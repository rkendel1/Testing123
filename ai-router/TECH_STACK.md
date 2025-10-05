# AI Router - Tech Stack

## Core Technologies

### Runtime Environment
- **Node.js** (v18+)
  - JavaScript runtime built on Chrome's V8 engine
  - Event-driven, non-blocking I/O
  - Excellent for I/O-heavy applications like API routing
  - Large ecosystem of packages via npm

### Web Framework
- **Express.js** (v4.x)
  - Minimal and flexible Node.js web framework
  - Robust routing system
  - Middleware architecture
  - Large community and extensive documentation
  - Why chosen: Industry standard, well-tested, simple to use

## Dependencies

### Production Dependencies

#### HTTP Client
- **axios** (v1.6+)
  - Promise-based HTTP client
  - Automatic JSON transformation
  - Request/response interceptors
  - Streaming support
  - Why chosen: Better API than native fetch, excellent error handling

#### Core Node Modules
- **fs** (built-in)
  - File system operations
  - Used for reading configuration files
  
- **path** (built-in)
  - Path manipulation utilities
  - Cross-platform path handling
  
- **crypto** (built-in)
  - Cryptographic functions
  - Used for generating cache keys (MD5 hashing)

### Development Dependencies

#### Code Quality
- **eslint**
  - JavaScript linter
  - Enforces code style
  - Catches common errors

- **prettier**
  - Code formatter
  - Consistent code style
  - Integrates with ESLint

#### Development Tools
- **nodemon**
  - Auto-restart on file changes
  - Improves development workflow
  - Watches for file changes

## API Integrations

### AI Provider APIs

#### Ollama (Local)
- **Protocol**: HTTP/REST
- **Endpoint**: http://localhost:11434
- **Authentication**: None (local)
- **Response Format**: JSON/Streaming

#### OpenAI
- **Protocol**: HTTP/REST
- **Endpoint**: https://api.openai.com/v1
- **Authentication**: Bearer token
- **Response Format**: JSON/Streaming SSE
- **Models**: GPT-4, GPT-3.5-turbo

#### Anthropic
- **Protocol**: HTTP/REST
- **Endpoint**: https://api.anthropic.com/v1
- **Authentication**: x-api-key header
- **Response Format**: JSON/Streaming
- **Models**: Claude 3 Opus, Sonnet, Haiku

#### Mistral AI
- **Protocol**: HTTP/REST
- **Endpoint**: https://api.mistral.ai/v1
- **Authentication**: Bearer token
- **Response Format**: JSON/Streaming
- **Models**: Mistral Large, Mistral Medium

#### Together AI
- **Protocol**: HTTP/REST
- **Endpoint**: https://api.together.xyz/v1
- **Authentication**: Bearer token
- **Response Format**: JSON/Streaming
- **Models**: Various open-source models

#### Aider
- **Protocol**: HTTP/REST (OpenAI-compatible)
- **Endpoint**: https://api.aider.chat/v1
- **Authentication**: Bearer token
- **Response Format**: JSON/Streaming

## Infrastructure

### Containerization
- **Docker**
  - Container runtime
  - Isolated development environment
  - Consistent deployment

- **Docker Compose**
  - Multi-container orchestration
  - Development environment setup
  - Service dependencies management

### File System Structure
```
ai-router/
├── server.js           # Main application entry point
├── package.json        # Dependencies and scripts
├── package-lock.json   # Locked dependency versions
├── README.md           # API documentation
├── CODING_STANDARDS.md # Code style guide
├── PROJECT_OVERVIEW.md # Project documentation
├── DESIGN_PATTERNS.md  # Architecture patterns
├── TECH_STACK.md       # This file
├── .devcontainer/      # Dev container config
│   └── devcontainer.json
└── node_modules/       # Installed dependencies
```

## Configuration Management

### Configuration File
- **Format**: JSON
- **Location**: `/workspace/.aistudio/config.json`
- **Hot Reload**: Yes
- **Structure**:
  ```json
  {
    "provider": "string",
    "model": "string",
    "apiKeys": { ... },
    "preferences": { ... },
    "cache": { ... }
  }
  ```

### Environment Variables
- **PORT**: Server port (default: 3000)
- **ENABLE_CACHE**: Enable caching (default: true)
- **MAX_CACHE_SIZE**: Cache size (default: 100)
- **CACHE_TTL**: Cache TTL in seconds (default: 3600)
- **API keys**: Provider-specific keys

## Performance Characteristics

### Caching
- **Type**: In-memory LRU cache
- **Implementation**: Custom JavaScript Map
- **Key Generation**: MD5 hash of prompt
- **Eviction**: TTL-based + size-based
- **Performance**: O(1) lookups

### Concurrency
- **Model**: Event-driven, single-threaded
- **Async Operations**: Promise-based with async/await
- **Streaming**: Supported for real-time responses
- **Connection Handling**: Node.js native

### Scalability
- **Current**: Single instance
- **Future**: Horizontal scaling with load balancer
- **Bottleneck**: External API rate limits
- **Mitigation**: Response caching

## Security Stack

### HTTPS/TLS
- **Development**: HTTP (local)
- **Production**: HTTPS recommended
- **Certificates**: Let's Encrypt or similar

### API Security
- **API Keys**: Stored in environment variables
- **Validation**: Input validation on all endpoints
- **Rate Limiting**: Not implemented (future enhancement)
- **CORS**: Configurable

### Data Protection
- **Sensitive Data**: Never logged
- **API Keys**: Environment variables only
- **Request Logging**: Excludes sensitive information

## Monitoring & Logging

### Logging
- **Method**: Console logging
- **Format**: Structured messages with context
- **Levels**: Info, Error
- **Future**: Winston or Bunyan for structured logging

### Health Checks
- **Endpoint**: GET /health
- **Response**: JSON with status
- **Monitoring**: Basic uptime check

### Metrics (Future)
- Request count
- Response times
- Cache hit/miss ratio
- Provider-specific metrics

## Development Tools

### IDE Support
- **VS Code**: Recommended IDE
- **Extensions**:
  - ESLint
  - Prettier
  - JavaScript/TypeScript support
  - REST Client for testing

### Testing Tools (Future)
- **Jest**: Unit testing framework
- **Supertest**: HTTP assertions
- **Nock**: HTTP mocking

### API Testing
- **curl**: Command-line testing
- **Postman**: API development
- **REST Client**: VS Code extension

## Deployment

### Container Image
- **Base**: ubuntu:24.04
- **Node.js**: Installed via apt
- **Exposed Ports**: 3000
- **Working Directory**: /home/developer/ai-router

### Service Management
- **Start Script**: start.sh
- **Process Manager**: None (runs as main process)
- **Auto-restart**: Docker restart policy

### Configuration
- **Environment**: Docker environment variables
- **Volume Mount**: /workspace for config.json
- **Network**: Bridge network with other services

## Future Technology Considerations

### Potential Additions
- **Redis**: Distributed caching
- **PostgreSQL**: Request analytics storage
- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization
- **WebSockets**: Real-time bidirectional communication
- **GraphQL**: Alternative API interface

### Scalability Enhancements
- **Load Balancer**: nginx or HAProxy
- **Message Queue**: RabbitMQ or Redis
- **CDN**: CloudFlare for static content
- **Kubernetes**: Container orchestration

## Version Requirements

### Minimum Versions
- Node.js: v18.0.0
- npm: v9.0.0
- Docker: v20.0.0

### Recommended Versions
- Node.js: v18.17.0 (LTS)
- npm: v9.8.0
- Docker: v24.0.0
