# Aider Integration and Caching Guide

This guide explains how to use Aider as an AI provider and how to leverage the caching mechanism to optimize token usage and performance.

## Table of Contents

1. [Aider Provider Setup](#aider-provider-setup)
2. [Caching Mechanism](#caching-mechanism)
3. [Cache Management](#cache-management)
4. [VS Code Extension Integration](#vs-code-extension-integration)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Aider Provider Setup

### What is Aider?

Aider is an AI pair programming assistant that helps you write and refactor code. It uses advanced language models to understand your codebase and provide intelligent suggestions.

### Configuration

#### Step 1: Get Your Aider API Key

1. Sign up for Aider at [https://aider.chat](https://aider.chat)
2. Navigate to your account settings
3. Generate or copy your API key

#### Step 2: Configure the AI Studio

Edit `/workspace/.aistudio/config.json`:

```json
{
  "provider": "aider",
  "model": "gpt-4",
  "apiKeys": {
    "openai": "",
    "anthropic": "",
    "mistral": "",
    "together": "",
    "aider": "your-aider-api-key-here"
  },
  "preferences": {
    "autocomplete": true,
    "streaming": true,
    "maxTokens": 2048
  },
  "cache": {
    "enabled": true,
    "maxSize": 100,
    "ttl": 3600
  }
}
```

**Key Configuration Options:**
- `provider`: Set to `"aider"` to use Aider
- `model`: Choose your preferred model (e.g., `"gpt-4"`, `"claude-3-opus"`)
- `apiKeys.aider`: Your Aider API key

#### Step 3: Verify Configuration

Check that the configuration is loaded correctly:

```bash
curl http://localhost:3000/config
```

You should see `"aider"` in the `availableProviders` list.

### Using Aider via VS Code Extension

Once configured, you can use Aider through the AI Coder extension:

1. **Switch to Aider:**
   - Press `F1` to open the command palette
   - Type and select: `AI Coder: Select Provider`
   - Choose `aider` from the list

2. **Use AI Features:**
   - **Autocomplete**: Start typing and Aider will suggest completions
   - **Chat**: Press `F1` → `AI Coder: Open Chat` to chat with Aider
   - **Refactor**: Select code → `F1` → `AI Coder: Refactor with AI`

The status bar will show: `🤖 AI: aider/gpt-4` (or your selected model)

---

## Caching Mechanism

### Overview

The AI Router includes an intelligent caching system that stores AI responses to reduce:
- **Token Usage**: Identical requests don't consume additional tokens
- **Latency**: Cached responses are returned instantly
- **Costs**: Especially important for paid API providers like OpenAI, Anthropic, and Aider

### How It Works

1. **Cache Key Generation**: Each request generates a unique cache key based on:
   - The prompt text
   - The AI provider (e.g., `aider`, `openai`)
   - The model (e.g., `gpt-4`)

2. **Cache Lookup**: Before making an API call, the router checks if a cached response exists

3. **Cache Hit**: If found and not expired, the cached response is returned immediately

4. **Cache Miss**: If not found, the request is sent to the AI provider, and the response is cached

5. **TTL (Time To Live)**: Cached entries expire after the configured TTL (default: 1 hour)

6. **LRU Eviction**: When the cache is full, the oldest entry is removed

### Configuration

#### Via config.json

Edit `/workspace/.aistudio/config.json`:

```json
{
  "cache": {
    "enabled": true,
    "maxSize": 100,
    "ttl": 3600
  }
}
```

- `enabled`: Enable or disable caching (boolean)
- `maxSize`: Maximum number of cached entries (number)
- `ttl`: Time-to-live in seconds (number)

#### Via Environment Variables

Set these in your Docker environment or `docker-compose.yml`:

```yaml
environment:
  - ENABLE_CACHE=true
  - MAX_CACHE_SIZE=200
  - CACHE_TTL=7200  # 2 hours
```

### What Gets Cached?

- ✅ **Refactoring requests**: Non-streaming responses
- ✅ **Chat messages**: When using non-streaming mode
- ❌ **Streaming completions**: Not cached (dynamic typing)

---

## Cache Management

### Using the Cache Manager Script

The easiest way to manage the cache is with the included script:

```bash
# Show cache statistics
./cache-manager.sh stats

# Clear all cached entries
./cache-manager.sh clear

# Enable caching
./cache-manager.sh enable

# Disable caching
./cache-manager.sh disable

# Show help
./cache-manager.sh help
```

### Manual API Calls

#### View Cache Statistics

```bash
curl http://localhost:3000/cache/stats
```

Response:
```json
{
  "enabled": true,
  "size": 42,
  "maxSize": 100,
  "ttl": 3600,
  "hitRate": "Not tracked"
}
```

#### Clear Cache

```bash
curl -X POST http://localhost:3000/cache/clear
```

Response:
```json
{
  "success": true,
  "clearedEntries": 42,
  "message": "Cache cleared successfully. Removed 42 entries."
}
```

#### Toggle Cache

Disable:
```bash
curl -X PUT http://localhost:3000/cache/toggle \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}'
```

Enable:
```bash
curl -X PUT http://localhost:3000/cache/toggle \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

---

## VS Code Extension Integration

### Select Provider Command

The AI Coder extension includes a command to easily switch between providers:

1. Press `F1` to open the command palette
2. Type: `AI Coder: Select Provider`
3. Choose from available providers:
   - ollama (local)
   - openai
   - anthropic
   - mistral
   - together
   - **aider**

The extension will update your configuration file automatically.

### Status Bar Indicator

The status bar shows:
- Current provider and model: `🤖 AI: aider/gpt-4`
- Click to toggle autocomplete on/off
- Changes update in real-time

### Features with Aider

All AI Coder features work with Aider:

1. **Inline Autocomplete**: Ghost text suggestions as you type
2. **AI Chat**: Interactive chat panel for questions and code help
3. **Refactoring**: Natural language refactoring instructions
4. **Toggle Autocomplete**: Enable/disable AI suggestions

---

## Best Practices

### For Optimal Cache Performance

1. **Use Descriptive Prompts**: Similar prompts generate similar cache keys
2. **Batch Similar Requests**: Refactor related files together
3. **Adjust TTL**: 
   - Longer TTL for stable code (e.g., 7200 seconds = 2 hours)
   - Shorter TTL for rapidly changing code (e.g., 1800 seconds = 30 minutes)
4. **Monitor Cache Stats**: Regularly check cache efficiency

### For Aider Usage

1. **Choose the Right Model**:
   - `gpt-4`: Best quality, slower, more expensive
   - `gpt-3.5-turbo`: Faster, cheaper, good quality
   - `claude-3-opus`: Excellent for complex tasks

2. **Optimize Prompts**:
   - Be specific about what you want
   - Provide context for better suggestions
   - Use clear, concise language

3. **Manage API Costs**:
   - Enable caching to reduce redundant API calls
   - Use appropriate models for different tasks
   - Monitor your Aider API usage

### Cache Maintenance

1. **Regular Cleanup**: Clear cache weekly or when changing project focus
2. **Monitor Size**: Check cache stats to ensure it's not growing too large
3. **Adjust Settings**: Tune `maxSize` and `ttl` based on your usage patterns

---

## Troubleshooting

### Aider Not Available in Provider List

**Problem**: Aider doesn't appear in the provider selection menu

**Solution**:
1. Verify AI Router is running: `curl http://localhost:3000/health`
2. Check configuration: `curl http://localhost:3000/config`
3. Restart the AI Router service
4. Check VS Code extension logs

### API Key Not Working

**Problem**: Requests fail with authentication errors

**Solution**:
1. Verify your API key is correct in `/workspace/.aistudio/config.json`
2. Check for extra spaces or quotes around the key
3. Ensure your Aider account is active and has credits
4. Test the API key directly with Aider's API

### Cache Not Working

**Problem**: Duplicate requests still consuming tokens

**Solution**:
1. Check cache is enabled: `./cache-manager.sh stats`
2. Verify requests are identical (same prompt, provider, model)
3. Check cache TTL hasn't expired
4. Review cache size limit (may be full)

### High Memory Usage

**Problem**: Docker container using too much memory

**Solution**:
1. Reduce `MAX_CACHE_SIZE`: `export MAX_CACHE_SIZE=50`
2. Clear cache: `./cache-manager.sh clear`
3. Disable caching temporarily: `./cache-manager.sh disable`
4. Restart the container

### Stale Cached Responses

**Problem**: Getting outdated responses from cache

**Solution**:
1. Clear the cache: `./cache-manager.sh clear`
2. Reduce TTL: Edit config.json and set `cache.ttl` to a lower value (e.g., 1800)
3. Disable cache for specific workflows where freshness is critical

---

## Advanced Configuration

### Custom Cache Settings Per Environment

Development:
```yaml
environment:
  - ENABLE_CACHE=true
  - MAX_CACHE_SIZE=50
  - CACHE_TTL=1800  # 30 minutes
```

Production:
```yaml
environment:
  - ENABLE_CACHE=true
  - MAX_CACHE_SIZE=200
  - CACHE_TTL=7200  # 2 hours
```

### Multiple API Keys

You can configure multiple providers and switch between them:

```json
{
  "provider": "aider",
  "model": "gpt-4",
  "apiKeys": {
    "openai": "sk-...",
    "anthropic": "sk-ant-...",
    "aider": "your-aider-key"
  }
}
```

Switch providers without losing your API keys using the VS Code extension command.

---

## Resources

- **Aider Documentation**: [https://aider.chat/docs](https://aider.chat/docs)
- **AI Router API**: See `ai-router/README.md`
- **Extension Guide**: See `extensions/ai-coder/README.md`
- **Main Documentation**: See `README.md`

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the AI Router logs: `docker logs dev-studio | grep ai-router`
3. Open an issue on GitHub
4. Check Aider's support documentation
