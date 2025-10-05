# Quick Reference: Aider & Caching

## Switch to Aider Provider

### Option 1: VS Code Command (Recommended)
```
F1 → "AI Coder: Select Provider" → Choose "aider"
```

### Option 2: Edit Config File
Edit `/workspace/.aistudio/config.json`:
```json
{
  "provider": "aider",
  "model": "gpt-4",
  "apiKeys": {
    "aider": "your-api-key-here"
  }
}
```

---

## Cache Management Commands

```bash
# View cache statistics
./cache-manager.sh stats

# Clear all cached responses
./cache-manager.sh clear

# Enable caching
./cache-manager.sh enable

# Disable caching
./cache-manager.sh disable
```

---

## Cache Configuration

### Via config.json
```json
{
  "cache": {
    "enabled": true,
    "maxSize": 100,
    "ttl": 3600
  }
}
```

### Via Environment Variables
```bash
export ENABLE_CACHE=true
export MAX_CACHE_SIZE=200
export CACHE_TTL=7200  # 2 hours
```

---

## API Endpoints

```bash
# Get config (includes cache info)
curl http://localhost:3000/config

# Cache statistics
curl http://localhost:3000/cache/stats

# Clear cache
curl -X POST http://localhost:3000/cache/clear

# Toggle cache
curl -X PUT http://localhost:3000/cache/toggle \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}'
```

---

## Supported Providers

- `ollama` - Local AI (no API key)
- `openai` - GPT-4, GPT-3.5
- `anthropic` - Claude
- `mistral` - Mistral models
- `together` - Together AI
- `aider` - **NEW!** AI pair programming

---

## VS Code Commands

| Command | Description |
|---------|-------------|
| `AI Coder: Select Provider` | Switch AI provider |
| `AI Coder: Refactor with AI` | Refactor code |
| `AI Coder: Open Chat` | Open AI chat |
| `AI Coder: Toggle Autocomplete` | Enable/disable AI |

---

## Quick Troubleshooting

**Provider not working?**
1. Check API key in config.json
2. Verify AI Router is running: `curl http://localhost:3000/health`
3. Check logs: `docker logs dev-studio | grep ai-router`

**Cache not saving tokens?**
1. Check cache is enabled: `./cache-manager.sh stats`
2. Verify requests are identical (same prompt/provider/model)
3. Check TTL hasn't expired

**High memory usage?**
1. Reduce MAX_CACHE_SIZE: `export MAX_CACHE_SIZE=50`
2. Clear cache: `./cache-manager.sh clear`
3. Disable cache: `./cache-manager.sh disable`

---

## Documentation Links

- **Full Guide**: [AIDER_CACHING_GUIDE.md](AIDER_CACHING_GUIDE.md)
- **Implementation Details**: [IMPLEMENTATION_AIDER_CACHE.md](IMPLEMENTATION_AIDER_CACHE.md)
- **AI Router API**: [ai-router/README.md](ai-router/README.md)
- **Extension Guide**: [extensions/ai-coder/README.md](extensions/ai-coder/README.md)

---

## Tips for Best Results

✅ Enable caching to reduce costs
✅ Use Aider for complex refactoring tasks
✅ Choose appropriate models for different tasks
✅ Monitor cache stats regularly
✅ Clear cache when changing project focus
✅ Adjust TTL based on code stability

---

**Need Help?** See [AIDER_CACHING_GUIDE.md](AIDER_CACHING_GUIDE.md) for detailed documentation.
