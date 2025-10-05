# AI Development Studio - Quick Reference

## 🚀 One-Line Start

```bash
docker build -t ai-studio . && docker run -p 8080:8080 -p 3000:3000 -p 5173:5173 -v $(pwd)/workspace:/workspace ai-studio
```

## 📍 Access Points

| Service | URL | Password |
|---------|-----|----------|
| IDE (code-server) | http://localhost:8080 | `developer` |
| AI Router API | http://localhost:3000 | N/A |
| Live Preview | http://localhost:5173 | N/A |

## 🤖 AI Providers

| Provider | Configuration | API Key Required |
|----------|--------------|------------------|
| Ollama | `"provider": "ollama"` | No (runs locally) |
| OpenAI | `"provider": "openai"` | Yes |
| Anthropic | `"provider": "anthropic"` | Yes |
| Mistral | `"provider": "mistral"` | Yes |
| Together | `"provider": "together"` | Yes |

## ⚡ Quick Actions

### Switch AI Provider
```bash
# Edit config
vim workspace/.aistudio/config.json

# Change provider (example)
{
  "provider": "openai",
  "model": "gpt-4"
}
```

### Use AI Features in VS Code
- **Autocomplete**: Start typing → Ghost text appears → Press `Tab`
- **Refactor**: `F1` → Type "AI Coder: Refactor" → Enter instruction
- **Chat**: `F1` → Type "AI Coder: Open Chat"

### Docker Commands
```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker logs -f dev-studio

# Rebuild
docker-compose build --no-cache
```

## 🔑 Environment Variables

Set in `docker-compose.yml` or via `-e`:

```yaml
environment:
  - PASSWORD=your-password
  - DEFAULT_PROVIDER=ollama
  - DEFAULT_MODEL=codellama
  - OPENAI_API_KEY=sk-...
  - ANTHROPIC_API_KEY=sk-ant-...
  - MISTRAL_API_KEY=...
  - TOGETHER_API_KEY=...
```

## 📂 Important Files

| File | Purpose |
|------|---------|
| `workspace/.aistudio/config.json` | AI provider configuration |
| `config/code-server/settings.json` | VS Code settings |
| `Dockerfile` | Container definition |
| `docker-compose.yml` | Orchestration config |
| `start.sh` | Service startup script |

## 🔧 API Endpoints

### AI Router (Port 3000)

```bash
# Code completion
curl -X POST http://localhost:3000/complete \
  -H "Content-Type: application/json" \
  -d '{"prompt": "def hello():", "context": ""}'

# Refactor code
curl -X POST http://localhost:3000/refactor \
  -H "Content-Type: application/json" \
  -d '{"instruction": "Add error handling", "files": [...]}'

# Get config
curl http://localhost:3000/config

# Health check
curl http://localhost:3000/health
```

## 🛠 Troubleshooting

### AI not responding
```bash
# Check AI Router
curl http://localhost:3000/health

# View logs
docker logs dev-studio | grep ai-router
```

### Port already in use
```bash
# Change ports in docker-compose.yml
ports:
  - "8081:8080"  # Change 8080 to 8081
```

### Reset everything
```bash
docker-compose down -v
docker-compose up -d
```

## 📚 Documentation

- **Full Guide**: [AI_STUDIO_README.md](AI_STUDIO_README.md)
- **API Docs**: [ai-router/README.md](ai-router/README.md)
- **Extension**: [extensions/ai-coder/README.md](extensions/ai-coder/README.md)
- **Implementation**: [IMPLEMENTATION.md](IMPLEMENTATION.md)

## ✅ Validation

```bash
# Run tests
./build-test.sh
```

## 🎯 Next Steps

1. Build: `docker-compose up -d`
2. Access: http://localhost:8080
3. Configure: Edit `workspace/.aistudio/config.json`
4. Code: Start typing to see AI completions!

---

**Need help?** Check the documentation files or open an issue on GitHub.
