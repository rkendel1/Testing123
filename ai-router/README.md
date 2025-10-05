# AI Router API Documentation

The AI Router is a Node.js/Express service that routes requests from the VS Code extension to various AI model providers.

## Endpoints

### POST /complete

Streaming code completion endpoint.

**Request:**
```json
{
  "prompt": "function calculateSum(",
  "context": "// File context here..."
}
```

**Response:**
Server-sent events stream with completions.

**Example:**
```bash
curl -X POST http://localhost:3000/complete \
  -H "Content-Type: application/json" \
  -d '{"prompt": "def hello():", "context": ""}'
```

### POST /refactor

Multi-file refactoring endpoint.

**Request:**
```json
{
  "instruction": "Extract this into a separate function",
  "files": [
    {
      "path": "/workspace/main.js",
      "content": "function main() { /* code */ }"
    }
  ]
}
```

**Response:**
```json
{
  "result": { /* Provider response */ },
  "provider": "ollama",
  "model": "codellama"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/refactor \
  -H "Content-Type: application/json" \
  -d '{
    "instruction": "Add error handling",
    "files": [{"path": "app.js", "content": "console.log(x)"}]
  }'
```

### GET /config

Get current configuration (without API keys).

**Response:**
```json
{
  "provider": "ollama",
  "model": "codellama",
  "availableProviders": ["ollama", "openai", "anthropic", "mistral", "together", "aider"],
  "cacheEnabled": true,
  "cacheSize": 42,
  "maxCacheSize": 100
}
```

**Example:**
```bash
curl http://localhost:3000/config
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "config": "ollama"
}
```

**Example:**
```bash
curl http://localhost:3000/health
```

### POST /cache/clear

Clear all cached responses.

**Response:**
```json
{
  "success": true,
  "clearedEntries": 42,
  "message": "Cache cleared successfully. Removed 42 entries."
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/cache/clear
```

### GET /cache/stats

Get cache statistics.

**Response:**
```json
{
  "enabled": true,
  "size": 42,
  "maxSize": 100,
  "ttl": 3600,
  "hitRate": "Not tracked"
}
```

**Example:**
```bash
curl http://localhost:3000/cache/stats
```

### PUT /cache/toggle

Enable or disable the cache.

**Request:**
```json
{
  "enabled": false
}
```

**Response:**
```json
{
  "success": true,
  "cacheEnabled": false,
  "message": "Cache disabled successfully"
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/cache/toggle \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}'
```

## Configuration

The AI Router reads configuration from `/workspace/.aistudio/config.json`:

```json
{
  "provider": "ollama",
  "model": "codellama",
  "apiKeys": {
    "openai": "",
    "anthropic": "",
    "mistral": "",
    "together": "",
    "aider": ""
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

## Supported Providers

### Ollama (Local)

- **Provider**: `ollama`
- **Default Model**: `codellama`
- **API Key**: Not required (runs locally)
- **Endpoint**: `http://localhost:11434`

### OpenAI

- **Provider**: `openai`
- **Models**: `gpt-4`, `gpt-3.5-turbo`, etc.
- **API Key**: Required in config.json or env var `OPENAI_API_KEY`
- **Endpoint**: `https://api.openai.com/v1`

### Anthropic

- **Provider**: `anthropic`
- **Models**: `claude-3-opus-20240229`, `claude-3-sonnet-20240229`, etc.
- **API Key**: Required in config.json or env var `ANTHROPIC_API_KEY`
- **Endpoint**: `https://api.anthropic.com/v1`

### Mistral

- **Provider**: `mistral`
- **Models**: `mistral-large-latest`, `mistral-medium`, etc.
- **API Key**: Required in config.json or env var `MISTRAL_API_KEY`
- **Endpoint**: `https://api.mistral.ai/v1`

### Together AI

- **Provider**: `together`
- **Models**: `meta-llama/Llama-3-70b-chat-hf`, etc.
- **API Key**: Required in config.json or env var `TOGETHER_API_KEY`
- **Endpoint**: `https://api.together.xyz/v1`

### Aider

- **Provider**: `aider`
- **Models**: Supports various models including GPT-4, Claude, etc.
- **API Key**: Required in config.json or env var `AIDER_API_KEY`
- **Endpoint**: `https://api.aider.chat/v1`
- **Description**: AI pair programming assistant with OpenAI-compatible API

## Environment Variables

The router uses these environment variables as fallbacks:

- `DEFAULT_PROVIDER`: Default provider if config.json not found
- `DEFAULT_MODEL`: Default model if config.json not found
- `OPENAI_API_KEY`: OpenAI API key
- `ANTHROPIC_API_KEY`: Anthropic API key
- `MISTRAL_API_KEY`: Mistral API key
- `TOGETHER_API_KEY`: Together AI API key
- `AIDER_API_KEY`: Aider API key
- `ENABLE_CACHE`: Enable/disable response caching (default: true)
- `MAX_CACHE_SIZE`: Maximum number of cached responses (default: 100)
- `CACHE_TTL`: Cache time-to-live in seconds (default: 3600)

## Runtime Provider Switching

To switch providers without rebuilding:

1. Edit `/workspace/.aistudio/config.json`
2. Change `provider` and `model` fields
3. Save the file
4. Next request will use the new provider

No restart required!

## Response Caching

The AI Router includes an in-memory caching mechanism to reduce token usage and improve performance.

### How it Works

- Responses are cached based on a hash of the prompt, provider, and model
- Cache entries expire after the configured TTL (default: 1 hour)
- When the cache is full, the oldest entry is removed (LRU eviction)
- Streaming responses are not cached (only non-streaming refactor requests)

### Configuration

Configure caching in `/workspace/.aistudio/config.json`:

```json
{
  "cache": {
    "enabled": true,
    "maxSize": 100,
    "ttl": 3600
  }
}
```

Or via environment variables:
- `ENABLE_CACHE`: Set to `false` to disable (default: `true`)
- `MAX_CACHE_SIZE`: Maximum cache entries (default: 100)
- `CACHE_TTL`: Time-to-live in seconds (default: 3600)

### Cache Management

**Using the cache manager script (recommended):**
```bash
./cache-manager.sh stats     # Show cache statistics
./cache-manager.sh clear     # Clear cache
./cache-manager.sh enable    # Enable caching
./cache-manager.sh disable   # Disable caching
```

**Manual API calls:**

**Clear the cache:**
```bash
curl -X POST http://localhost:3000/cache/clear
```

**View cache statistics:**
```bash
curl http://localhost:3000/cache/stats
```

**Enable/disable cache at runtime:**
```bash
# Disable
curl -X PUT http://localhost:3000/cache/toggle \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}'

# Enable
curl -X PUT http://localhost:3000/cache/toggle \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

### Benefits

- **Reduced Token Usage**: Identical requests don't consume additional tokens
- **Faster Responses**: Cached responses are returned instantly
- **Cost Savings**: Especially beneficial for paid API providers
- **Configurable**: Can be disabled or tuned based on your needs

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `400`: Bad request (missing parameters)
- `500`: Server error (provider error, network issue, etc.)

Error response format:
```json
{
  "error": "Error message here"
}
```

## Logging

The AI Router logs all requests and provider selections to stdout:

```
[/complete] Provider: ollama, Model: codellama
[/refactor] Provider: openai, Model: gpt-4
[/refactor] Refactoring 3 file(s)
```

View logs with:
```bash
docker logs dev-studio | grep "ai-router"
```
