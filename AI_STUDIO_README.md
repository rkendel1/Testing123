# AI Development Studio

A single-container, provider-agnostic AI development environment with integrated code completion, refactoring, and live preview.

## 🚀 Features

- **Multi-Provider AI Support**: Switch between Ollama (local), OpenAI, Anthropic, Mistral, and Together AI
- **Inline Code Completion**: AI-powered autocomplete as you type
- **AI-Assisted Refactoring**: Multi-file refactoring with natural language instructions
- **Live Preview**: Real-time React preview with hot reload on port 5173
- **Browser-based IDE**: Full VS Code experience via code-server
- **Pre-configured Tools**: Node.js, Python, GitHub CLI, Supabase CLI, and more

## 🎯 Quick Start

### Single Command Build & Run

```bash
docker build -t ai-studio . && docker run -p 8080:8080 -p 3000:3000 -p 5173:5173 -v $(pwd)/workspace:/workspace ai-studio
```

### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

### Access the Studio

- **IDE**: http://localhost:8080 (password: `developer`)
- **AI Router**: http://localhost:3000
- **Live Preview**: http://localhost:5173

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
    "together": "..."
  }
}
```

### Switching Providers

The AI Router automatically reloads configuration changes. Simply update `config.json`:

- **Ollama** (local): `"provider": "ollama"`, `"model": "codellama"`
- **OpenAI**: `"provider": "openai"`, `"model": "gpt-4"`
- **Anthropic**: `"provider": "anthropic"`, `"model": "claude-3-sonnet-20240229"`
- **Mistral**: `"provider": "mistral"`, `"model": "mistral-large-latest"`
- **Together**: `"provider": "together"`, `"model": "meta-llama/Llama-3-70b-chat-hf"`

### Environment Variables

Set these in `docker-compose.yml` or via `-e` flags:

- `PASSWORD`: Code-server password (default: `developer`)
- `DEFAULT_PROVIDER`: Initial AI provider (default: `ollama`)
- `DEFAULT_MODEL`: Initial AI model (default: `codellama`)
- `OPENAI_API_KEY`: OpenAI API key
- `ANTHROPIC_API_KEY`: Anthropic API key
- `MISTRAL_API_KEY`: Mistral API key
- `TOGETHER_API_KEY`: Together AI API key

## 📦 Components

### AI Router Service (Port 3000)

Node.js/Express server that routes AI requests to different providers.

**Endpoints:**
- `POST /complete`: Streaming code completion
- `POST /refactor`: Multi-file refactoring
- `GET /config`: Current configuration
- `GET /health`: Health check

### VS Code Extension: "AI Coder"

Pre-installed extension providing:
- Inline autocomplete with ghost text
- Chat interface for AI assistance
- Manual refactor triggers
- Status bar showing current provider/model

**Commands:**
- `AI Coder: Refactor with AI` - Refactor selected code
- `AI Coder: Open Chat` - Open chat panel
- `AI Coder: Toggle Autocomplete` - Enable/disable autocomplete

### Live Preview (Port 5173)

Vite React app for real-time preview of your work. Automatically reloads when files change.

## 🛠 Usage Examples

### Using AI Autocomplete

1. Open any code file in the IDE
2. Start typing - AI completions appear as ghost text
3. Press Tab to accept, or keep typing to ignore

### AI-Powered Refactoring

1. Open a file you want to refactor
2. Press `F1` and type "AI Coder: Refactor"
3. Enter your refactoring instruction (e.g., "Extract this into a separate function")
4. Review and apply the suggested changes

### Chat with AI

1. Press `F1` and type "AI Coder: Open Chat"
2. Ask questions or request code changes
3. Get contextual help for your project

## 📁 Directory Structure

```
.
├── ai-router/              # AI Router service
│   ├── package.json
│   └── server.js
├── extensions/ai-coder/    # VS Code extension
│   ├── package.json
│   └── src/extension.js
├── preview-app/            # Live preview React app
│   ├── package.json
│   ├── vite.config.js
│   └── src/
├── config/code-server/     # VS Code settings
│   └── settings.json
├── workspace/              # Your workspace (volume mounted)
│   └── .aistudio/
│       └── config.json     # AI configuration
├── Dockerfile              # Container definition
├── docker-compose.yml      # Compose configuration
└── start.sh               # Startup orchestration
```

## 🔑 Pre-installed Tools

- **Languages**: Node.js, Python 3
- **Package Managers**: npm, pip
- **CLI Tools**: GitHub CLI (gh), Supabase CLI
- **Development**: TypeScript, ESLint, Prettier, nodemon
- **Python Tools**: black, flake8, pylint
- **AI**: Ollama (local models)

## 🌟 Advanced Features

### Using Local Models with Ollama

Ollama runs locally in the container. Pull additional models:

```bash
docker exec -it dev-studio ollama pull llama2
docker exec -it dev-studio ollama pull mistral
```

Then update `.aistudio/config.json` to use them.

### Adding Custom Models

For remote providers, just update the model name in config.json. The AI Router will use it automatically.

### Customizing VS Code Settings

Edit `config/code-server/settings.json` before building, or modify settings in the IDE (they persist in the Docker volume).

## 🐛 Troubleshooting

### AI completions not working

1. Check AI Router is running: `curl http://localhost:3000/health`
2. Check config.json is valid JSON
3. For remote providers, verify API keys are set

### Live preview not loading

1. Check port 5173 is exposed and not in use
2. View preview logs: `docker logs dev-studio | grep Preview`

### Extension not loading

1. Restart code-server: `docker-compose restart`
2. Check extension is installed: Settings > Extensions

## 📝 Development Workflow

1. **Code**: Write code in the browser-based IDE
2. **Complete**: Get AI-powered suggestions as you type
3. **Refactor**: Use AI to improve and reorganize code
4. **Preview**: See changes live in the preview pane
5. **Deploy**: Use GitHub CLI or Supabase CLI to deploy

## 🤝 Contributing

This is a self-contained development environment. To modify:

1. Update source files (ai-router, extensions, preview-app)
2. Rebuild: `docker-compose build --no-cache`
3. Restart: `docker-compose up -d`

## 📄 License

MIT License - See LICENSE file for details

## 🎓 Learn More

- [Ollama Documentation](https://ollama.ai/)
- [code-server](https://github.com/coder/code-server)
- [VS Code Extension API](https://code.visualstudio.com/api)
- [Vite](https://vitejs.dev/)

---

**Built with ❤️ for AI-powered development**
