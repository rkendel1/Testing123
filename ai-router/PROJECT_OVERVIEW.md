# AI Router - Project Overview

## Purpose
The AI Router is a Node.js/Express service that provides a unified API for interacting with multiple AI providers. It abstracts the complexity of different AI provider APIs, allowing clients to switch between providers without changing their code.

## Key Features
- **Multi-Provider Support**: Integrates with Ollama, OpenAI, Anthropic, Mistral, Together AI, and Aider
- **Unified API**: Consistent interface regardless of underlying provider
- **Response Caching**: Reduces token usage and costs by caching similar requests
- **Streaming Support**: Real-time streaming responses for better UX
- **Hot Configuration Reload**: Change providers without restarting the service
- **Health Monitoring**: Built-in health check endpoints

## Architecture
The AI Router follows a middleware-based architecture:
1. **Request Reception**: Express receives HTTP requests
2. **Configuration Loading**: Reads provider settings from config.json
3. **Cache Check**: Checks if response is cached (if enabled)
4. **Provider Routing**: Routes request to appropriate AI provider
5. **Response Processing**: Handles streaming or JSON responses
6. **Cache Storage**: Stores response for future requests
7. **Response Delivery**: Returns response to client

## Core Components

### Server (server.js)
- Main Express application
- Endpoint definitions
- Request routing logic
- Cache management

### Configuration
- Located in `/workspace/.aistudio/config.json`
- Hot-reloaded on changes
- Contains provider selection, API keys, and cache settings

### Cache System
- In-memory LRU cache
- Configurable size and TTL
- Hash-based key generation
- Cache statistics endpoint

## API Endpoints

### POST /complete
Code completion endpoint with streaming support
- **Input**: `{ prompt: string, context: string }`
- **Output**: Streaming or JSON response from AI

### POST /refactor
Multi-file refactoring endpoint
- **Input**: `{ files: Array, instruction: string }`
- **Output**: Refactored code suggestions

### GET /config
Returns current configuration and available providers
- **Output**: Configuration object with provider list

### GET /health
Health check endpoint
- **Output**: `{ status: "ok", provider: string, model: string }`

### Cache Endpoints
- **GET /cache/stats**: Cache statistics
- **POST /cache/clear**: Clear all cached entries
- **PUT /cache/toggle**: Enable/disable caching

## Provider Integration

### Ollama (Local)
- Runs locally in Docker container
- No API key required
- Models: codellama, llama2, mistral, etc.
- Endpoint: `http://localhost:11434/api/generate`

### OpenAI
- Cloud-based API
- Requires API key
- Models: GPT-4, GPT-3.5, etc.
- Endpoint: `https://api.openai.com/v1/chat/completions`

### Anthropic
- Cloud-based API
- Requires API key
- Models: Claude 3, Claude 2, etc.
- Endpoint: `https://api.anthropic.com/v1/messages`

### Mistral
- Cloud-based API
- Requires API key
- Models: Mistral Large, Mistral Medium, etc.
- Endpoint: `https://api.mistral.ai/v1/chat/completions`

### Together AI
- Cloud-based API
- Requires API key
- Models: Various open-source models
- Endpoint: `https://api.together.xyz/v1/chat/completions`

### Aider
- AI pair programming assistant
- Requires API key
- Endpoint: `https://api.aider.chat/v1/chat/completions`

## Configuration Format
```json
{
  "provider": "ollama",
  "model": "codellama",
  "apiKeys": {
    "openai": "sk-...",
    "anthropic": "sk-ant-...",
    "mistral": "...",
    "together": "...",
    "aider": "..."
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

## Environment Variables
- `PORT`: Server port (default: 3000)
- `ENABLE_CACHE`: Enable/disable caching (default: true)
- `MAX_CACHE_SIZE`: Maximum cache entries (default: 100)
- `CACHE_TTL`: Cache time-to-live in seconds (default: 3600)

## Dependencies
- **express**: Web framework
- **axios**: HTTP client for API requests
- **crypto**: Hash generation for cache keys
- **fs**: File system operations
- **path**: Path manipulation

## Development Workflow
1. Start the server: `npm start`
2. Make code changes
3. Server auto-reloads on file changes (if using nodemon)
4. Test endpoints with curl or Postman
5. Monitor logs for errors

## Testing
- Use curl to test endpoints manually
- Check cache statistics to verify caching
- Test provider switching by updating config.json
- Monitor response times and token usage

## Future Enhancements
- Database-backed cache persistence
- Request rate limiting per provider
- Load balancing across multiple providers
- Request analytics and monitoring
- WebSocket support for real-time communication
- Provider fallback on errors
