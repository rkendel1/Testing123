const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// AI Router Server
// Routes requests from VS Code extension to selected AI model provider
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Config file path
const CONFIG_PATH = '/workspace/.aistudio/config.json';

// In-memory cache for AI responses
const responseCache = new Map();
let cacheEnabled = process.env.ENABLE_CACHE !== 'false'; // Enabled by default
const MAX_CACHE_SIZE = parseInt(process.env.MAX_CACHE_SIZE || '100');
const CACHE_TTL = parseInt(process.env.CACHE_TTL || '3600') * 1000; // Default 1 hour in ms

/**
 * Generate cache key from prompt and config
 */
function getCacheKey(prompt, provider, model) {
  const hash = crypto.createHash('md5').update(`${provider}:${model}:${prompt}`).digest('hex');
  return hash;
}

/**
 * Get cached response if available and not expired
 */
function getCachedResponse(key) {
  if (!cacheEnabled) return null;
  
  const cached = responseCache.get(key);
  if (!cached) return null;
  
  // Check if cache entry has expired
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    responseCache.delete(key);
    return null;
  }
  
  return cached.data;
}

/**
 * Store response in cache
 */
function setCachedResponse(key, data) {
  if (!cacheEnabled) return;
  
  // Implement simple LRU by removing oldest entry if cache is full
  if (responseCache.size >= MAX_CACHE_SIZE) {
    const firstKey = responseCache.keys().next().value;
    responseCache.delete(firstKey);
  }
  
  responseCache.set(key, {
    data: data,
    timestamp: Date.now()
  });
}

/**
 * Clear cache
 */
function clearCache() {
  responseCache.clear();
}

/**
 * Load configuration from .aistudio/config.json
 * Returns default config if file doesn't exist
 */
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const configData = fs.readFileSync(CONFIG_PATH, 'utf8');
      return JSON.parse(configData);
    }
  } catch (error) {
    console.error('Error loading config:', error.message);
  }
  
  // Return default configuration
  return {
    provider: process.env.DEFAULT_PROVIDER || 'ollama',
    model: process.env.DEFAULT_MODEL || 'codellama',
    apiKeys: {
      openai: process.env.OPENAI_API_KEY || '',
      anthropic: process.env.ANTHROPIC_API_KEY || '',
      mistral: process.env.MISTRAL_API_KEY || '',
      together: process.env.TOGETHER_API_KEY || '',
      aider: process.env.AIDER_API_KEY || ''
    }
  };
}

/**
 * Route request to Ollama (local)
 */
async function routeToOllama(prompt, model, stream = true) {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: model,
      prompt: prompt,
      stream: stream
    }, {
      responseType: stream ? 'stream' : 'json'
    });
    return response;
  } catch (error) {
    throw new Error(`Ollama error: ${error.message}`);
  }
}

/**
 * Route request to OpenAI
 */
async function routeToOpenAI(prompt, model, apiKey, stream = true) {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: model,
      messages: [{ role: 'user', content: prompt }],
      stream: stream
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      responseType: stream ? 'stream' : 'json'
    });
    return response;
  } catch (error) {
    throw new Error(`OpenAI error: ${error.message}`);
  }
}

/**
 * Route request to Anthropic
 */
async function routeToAnthropic(prompt, model, apiKey, stream = true) {
  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
      stream: stream
    }, {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      responseType: stream ? 'stream' : 'json'
    });
    return response;
  } catch (error) {
    throw new Error(`Anthropic error: ${error.message}`);
  }
}

/**
 * Route request to Mistral
 */
async function routeToMistral(prompt, model, apiKey, stream = true) {
  try {
    const response = await axios.post('https://api.mistral.ai/v1/chat/completions', {
      model: model,
      messages: [{ role: 'user', content: prompt }],
      stream: stream
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      responseType: stream ? 'stream' : 'json'
    });
    return response;
  } catch (error) {
    throw new Error(`Mistral error: ${error.message}`);
  }
}

/**
 * Route request to Together AI
 */
async function routeToTogether(prompt, model, apiKey, stream = true) {
  try {
    const response = await axios.post('https://api.together.xyz/v1/chat/completions', {
      model: model,
      messages: [{ role: 'user', content: prompt }],
      stream: stream
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      responseType: stream ? 'stream' : 'json'
    });
    return response;
  } catch (error) {
    throw new Error(`Together error: ${error.message}`);
  }
}

/**
 * Route request to Aider
 */
async function routeToAider(prompt, model, apiKey, stream = true) {
  try {
    // Aider uses OpenAI-compatible API
    const response = await axios.post('https://api.aider.chat/v1/chat/completions', {
      model: model,
      messages: [{ role: 'user', content: prompt }],
      stream: stream
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      responseType: stream ? 'stream' : 'json'
    });
    return response;
  } catch (error) {
    throw new Error(`Aider error: ${error.message}`);
  }
}

/**
 * POST /complete - Streaming code completion endpoint
 * Accepts code context and returns completions inline
 */
app.post('/complete', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Load current configuration
    const config = loadConfig();
    const fullPrompt = context ? `${context}\n\n${prompt}` : prompt;

    console.log(`[/complete] Provider: ${config.provider}, Model: ${config.model}`);

    // Check cache for non-streaming requests
    const cacheKey = getCacheKey(fullPrompt, config.provider, config.model);
    const cachedResponse = getCachedResponse(cacheKey);
    
    if (cachedResponse) {
      console.log(`[/complete] Cache hit for key: ${cacheKey}`);
      // For streaming responses, we can't use cache effectively
      // So we only cache non-streaming responses
      return res.json(cachedResponse);
    }

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let providerResponse;

    // Route to appropriate provider
    switch (config.provider.toLowerCase()) {
      case 'ollama':
        providerResponse = await routeToOllama(fullPrompt, config.model, true);
        break;
      case 'openai':
        providerResponse = await routeToOpenAI(fullPrompt, config.model, config.apiKeys.openai, true);
        break;
      case 'anthropic':
        providerResponse = await routeToAnthropic(fullPrompt, config.model, config.apiKeys.anthropic, true);
        break;
      case 'mistral':
        providerResponse = await routeToMistral(fullPrompt, config.model, config.apiKeys.mistral, true);
        break;
      case 'together':
        providerResponse = await routeToTogether(fullPrompt, config.model, config.apiKeys.together, true);
        break;
      case 'aider':
        providerResponse = await routeToAider(fullPrompt, config.model, config.apiKeys.aider, true);
        break;
      default:
        return res.status(400).json({ error: `Unknown provider: ${config.provider}` });
    }

    // Stream response to client
    if (providerResponse.data && providerResponse.data.pipe) {
      providerResponse.data.pipe(res);
    } else {
      res.json(providerResponse.data);
    }

  } catch (error) {
    console.error('[/complete] Error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

/**
 * POST /refactor - Multi-file refactoring endpoint
 * Accepts multiple files and returns refactored code
 */
app.post('/refactor', async (req, res) => {
  try {
    const { files, instruction } = req.body;
    
    if (!files || !instruction) {
      return res.status(400).json({ error: 'Files and instruction are required' });
    }

    // Load current configuration
    const config = loadConfig();

    console.log(`[/refactor] Provider: ${config.provider}, Model: ${config.model}`);
    console.log(`[/refactor] Refactoring ${files.length} file(s)`);

    // Build refactoring prompt
    let prompt = `Refactor the following code according to this instruction: ${instruction}\n\n`;
    files.forEach((file, index) => {
      prompt += `File ${index + 1}: ${file.path}\n\`\`\`\n${file.content}\n\`\`\`\n\n`;
    });
    prompt += 'Provide the refactored code for each file.';

    let providerResponse;

    // Check cache first for non-streaming refactor requests
    const cacheKey = getCacheKey(prompt, config.provider, config.model);
    const cachedResponse = getCachedResponse(cacheKey);
    
    if (cachedResponse) {
      console.log(`[/refactor] Cache hit for key: ${cacheKey}`);
      return res.json({
        result: cachedResponse,
        provider: config.provider,
        model: config.model,
        cached: true
      });
    }

    // Route to appropriate provider (non-streaming for refactor)
    switch (config.provider.toLowerCase()) {
      case 'ollama':
        providerResponse = await routeToOllama(prompt, config.model, false);
        break;
      case 'openai':
        providerResponse = await routeToOpenAI(prompt, config.model, config.apiKeys.openai, false);
        break;
      case 'anthropic':
        providerResponse = await routeToAnthropic(prompt, config.model, config.apiKeys.anthropic, false);
        break;
      case 'mistral':
        providerResponse = await routeToMistral(prompt, config.model, config.apiKeys.mistral, false);
        break;
      case 'together':
        providerResponse = await routeToTogether(prompt, config.model, config.apiKeys.together, false);
        break;
      case 'aider':
        providerResponse = await routeToAider(prompt, config.model, config.apiKeys.aider, false);
        break;
      default:
        return res.status(400).json({ error: `Unknown provider: ${config.provider}` });
    }

    // Cache the response
    setCachedResponse(cacheKey, providerResponse.data);

    res.json({ 
      result: providerResponse.data,
      provider: config.provider,
      model: config.model
    });

  } catch (error) {
    console.error('[/refactor] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /config - Get current configuration
 */
app.get('/config', (req, res) => {
  try {
    const config = loadConfig();
    // Don't send API keys to client
    res.json({
      provider: config.provider,
      model: config.model,
      availableProviders: ['ollama', 'openai', 'anthropic', 'mistral', 'together', 'aider'],
      cacheEnabled: cacheEnabled,
      cacheSize: responseCache.size,
      maxCacheSize: MAX_CACHE_SIZE
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /health - Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    config: loadConfig().provider
  });
});

/**
 * POST /cache/clear - Clear the response cache
 */
app.post('/cache/clear', (req, res) => {
  try {
    const sizeBefore = responseCache.size;
    clearCache();
    console.log(`[/cache/clear] Cleared ${sizeBefore} cached entries`);
    res.json({
      success: true,
      clearedEntries: sizeBefore,
      message: `Cache cleared successfully. Removed ${sizeBefore} entries.`
    });
  } catch (error) {
    console.error('[/cache/clear] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /cache/stats - Get cache statistics
 */
app.get('/cache/stats', (req, res) => {
  try {
    res.json({
      enabled: cacheEnabled,
      size: responseCache.size,
      maxSize: MAX_CACHE_SIZE,
      ttl: CACHE_TTL / 1000, // Return in seconds
      hitRate: 'Not tracked' // Could be implemented with counters
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /cache/toggle - Enable or disable cache
 */
app.put('/cache/toggle', (req, res) => {
  try {
    const { enabled } = req.body;
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'enabled parameter must be a boolean' });
    }
    
    cacheEnabled = enabled;
    console.log(`[/cache/toggle] Cache ${enabled ? 'enabled' : 'disabled'}`);
    
    res.json({
      success: true,
      cacheEnabled: cacheEnabled,
      message: `Cache ${enabled ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    console.error('[/cache/toggle] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('=========================================');
  console.log('  AI Router Server');
  console.log('=========================================');
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Config path: ${CONFIG_PATH}`);
  
  const config = loadConfig();
  console.log(`Current provider: ${config.provider}`);
  console.log(`Current model: ${config.model}`);
  console.log(`Cache enabled: ${cacheEnabled}`);
  console.log(`Max cache size: ${MAX_CACHE_SIZE} entries`);
  console.log(`Cache TTL: ${CACHE_TTL / 1000} seconds`);
  console.log('=========================================');
});
