# Testing123 - AI Development Studio

A complete, AI-powered development environment in a single Docker container. Features provider-agnostic AI code completion, refactoring, real-time preview, and a browser-based IDE.

> ⚠️ **New Features!** This repository now includes:
> - **Aider Integration**: AI pair programming assistant support
> - **Response Caching**: Reduce token usage and costs with intelligent caching
> - See [AIDER_CACHING_GUIDE.md](AIDER_CACHING_GUIDE.md) for detailed setup and usage

See [AI_STUDIO_README.md](AI_STUDIO_README.md) for complete AI features documentation.

## 🚀 Quick Start

### Prerequisites
- Docker installed on your system
- Docker Compose (optional, but recommended)

### Single-Command Build & Run

```bash
docker build -t ai-studio . && docker run -p 8080:8080 -p 3000:3000 -p 5173:5173 -v $(pwd)/workspace:/workspace ai-studio
```

### Using Docker Compose (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rkendel1/Testing123.git
   cd Testing123
   ```

2. **Build and run the container:**
   ```bash
   docker-compose up -d
   ```

3. **Access the Studio:**
   - **IDE**: http://localhost:8080 (password: `developer`)
   - **AI Router API**: http://localhost:3000
   - **Live Preview**: http://localhost:5173

## 🤖 AI Features

### Inline Code Completion
AI-powered autocomplete appears as ghost text while you type. Just press Tab to accept suggestions.

### AI-Assisted Refactoring
Select code, run "AI Coder: Refactor with AI", describe what you want, and get instant refactoring suggestions.

### Multi-Provider Support
Switch between AI providers without rebuilding:
- **Ollama** (local, no API key needed)
- **OpenAI** (GPT-4, GPT-3.5)
- **Anthropic** (Claude)
- **Mistral** (Mistral Large)
- **Together AI** (Llama, etc.)
- **Aider** (AI pair programming assistant)

Edit `/workspace/.aistudio/config.json` to switch providers on the fly, or use the command palette: "AI Coder: Select Provider".

### Live Preview
Real-time React preview on port 5173 with automatic reload when files change.

## 📦 What's Included

### Development Tools
- **Git** - Version control
- **Node.js & npm** - JavaScript runtime and package manager
- **Python 3 & pip** - Python runtime and package manager
- **GitHub CLI** - Command-line interface for GitHub
- **Supabase CLI** - Command-line interface for Supabase
- **Build tools** - gcc, make, and other essential build utilities
- **Text editors** - vim, nano

### AI Tools
- **Ollama** - Local AI model runner (codellama, llama2, mistral, etc.)
- **AI Router** - Multi-provider AI request routing service
- **AI Coder Extension** - VS Code extension for inline completion and refactoring

### Pre-installed Development Packages
- **JavaScript/TypeScript:**
  - TypeScript
  - ts-node
  - nodemon
  - ESLint
  - Prettier

- **Python:**
  - black (formatter)
  - flake8 (linter)
  - pylint (linter)
  - autopep8 (formatter)

### VS Code Extensions (Pre-installed)
- Python support
- ESLint
- Prettier
- GitLens
- TypeScript support
- Code Spell Checker
- Error Lens
- Material Icon Theme
- **AI Coder** - AI-powered completion and refactoring

## 🔧 Configuration

### AI Provider Configuration

Edit `/workspace/.aistudio/config.json` to configure your AI provider:

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
  "cache": {
    "enabled": true,
    "maxSize": 100,
    "ttl": 3600
  }
}
```

#### Configuring Aider
To use Aider as your AI provider:
1. Set `"provider": "aider"` in the config
2. Add your Aider API key to `apiKeys.aider`
3. Optionally specify the model (e.g., `"model": "gpt-4"`)

You can also use the command palette: **AI Coder: Select Provider** to switch providers interactively.

Changes take effect immediately - no container restart needed!

### Cache Configuration

The AI Router includes a built-in caching mechanism to reduce token usage and improve performance:

- **enabled**: Enable or disable caching (default: true)
- **maxSize**: Maximum number of cached responses (default: 100)
- **ttl**: Cache time-to-live in seconds (default: 3600 = 1 hour)

#### Cache Management
- Clear cache: `curl -X POST http://localhost:3000/cache/clear`
- View cache stats: `curl http://localhost:3000/cache/stats`
- Toggle cache: `curl -X PUT http://localhost:3000/cache/toggle -H "Content-Type: application/json" -d '{"enabled": false}'`

For easier cache management, use the included script:
```bash
./cache-manager.sh stats     # Show cache statistics
./cache-manager.sh clear     # Clear cache
./cache-manager.sh enable    # Enable caching
./cache-manager.sh disable   # Disable caching
```

You can also configure cache via environment variables:
- `ENABLE_CACHE`: Set to `false` to disable caching
- `MAX_CACHE_SIZE`: Maximum cache entries (default: 100)
- `CACHE_TTL`: Cache TTL in seconds (default: 3600)

### Changing the Password
Edit the `docker-compose.yml` file and change the `PASSWORD` environment variable:

```yaml
environment:
  - PASSWORD=your-secure-password
```

### Adding More Extensions
Extensions can be added by modifying the Dockerfile. Add lines like:
```dockerfile
RUN code-server --install-extension <extension-id>
```

### Custom Configuration
The workspace directory is mounted as a volume, so any files you create will persist on your host machine in the `workspace` directory.

## 🌐 GitHub Codespaces Support

This repository includes a `.devcontainer` configuration, making it compatible with GitHub Codespaces. Simply:

1. Click the "Code" button on GitHub
2. Select "Codespaces"
3. Create a new codespace

Your development environment will be ready in minutes!

## 📁 Directory Structure

```
.
├── ai-router/              # AI Router service (Node.js/Express)
│   ├── server.js          # Main router server
│   ├── package.json       # Dependencies
│   └── README.md          # API documentation
├── extensions/ai-coder/   # VS Code extension for AI features
│   ├── src/extension.js   # Extension implementation
│   ├── package.json       # Extension manifest
│   └── README.md          # Extension documentation
├── preview-app/           # Vite React live preview app
│   ├── src/               # React components
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Dependencies
├── config/code-server/    # VS Code settings
│   └── settings.json      # Default editor settings
├── workspace/             # Your workspace (volume mounted)
│   ├── .aistudio/         # AI configuration
│   │   └── config.json    # Provider and model settings
│   └── examples/          # Example projects
├── Dockerfile             # Container definition
├── docker-compose.yml     # Compose configuration
├── start.sh              # Startup orchestration script
├── cache-manager.sh       # Cache management utility
├── AI_STUDIO_README.md   # Comprehensive AI studio docs
└── AIDER_CACHING_GUIDE.md # Aider integration & caching guide
```
├── workspace/             # Your working directory (mounted volume)
└── README.md              # This file
```

## 📚 Documentation

- **[AIDER_CACHING_GUIDE.md](AIDER_CACHING_GUIDE.md)** - Aider integration and caching setup
- **[AI_STUDIO_README.md](AI_STUDIO_README.md)** - Complete AI studio documentation
- **[ai-router/README.md](ai-router/README.md)** - AI Router API reference
- **[extensions/ai-coder/README.md](extensions/ai-coder/README.md)** - VS Code extension guide

## 🛠 Usage Tips

### Using AI Features

**Inline Autocomplete:**
- Start typing - AI suggestions appear as ghost text
- Press `Tab` to accept, or keep typing to ignore
- Toggle on/off: Click the AI icon in status bar

**AI Refactoring:**
1. Press `F1` and type "AI Coder: Refactor"
2. Enter your instruction (e.g., "Add error handling")
3. Review suggested changes

**AI Chat:**
1. Press `F1` and type "AI Coder: Open Chat"
2. Ask questions or request code changes
3. Get contextual help

**Switch AI Providers:**
Edit `/workspace/.aistudio/config.json` and change the `provider` field. Changes take effect immediately!

### Accessing the Terminal
Once you're in the web IDE, you can open a terminal by:
- Menu: Terminal → New Terminal
- Keyboard: Ctrl + ` (backtick)

### View Live Preview
Open http://localhost:5173 to see the live preview of your React app. Changes to workspace files automatically reload the preview.

### Installing Additional Tools
You can install additional tools using apt:
```bash
sudo apt-get update
sudo apt-get install <package-name>
```

### Stopping the Container
```bash
docker-compose down
```

Or if using Docker CLI:
```bash
docker stop dev-studio
```

### Viewing Logs
```bash
docker-compose logs -f
```

Or if using Docker CLI:
```bash
docker logs -f dev-studio
```

## 📚 Documentation

- **[AI Studio Guide](AI_STUDIO_README.md)** - Comprehensive AI features documentation
- **[AI Router API](ai-router/README.md)** - API endpoints and provider details
- **[AI Coder Extension](extensions/ai-coder/README.md)** - Extension usage and commands
- **[Architecture Details](ARCHITECTURE.md)** - Technical architecture
- **[Quick Reference](QUICKSTART.md)** - Quick reference card

## 🤝 Contributing

Feel free to submit issues or pull requests to improve this AI development studio!

## 📄 License

This project is open source and available under the MIT License.