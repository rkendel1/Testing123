# AI Coder Extension

VS Code extension for AI-powered code completion and refactoring.

## Features

### 1. Inline Autocomplete

AI-powered code completions appear as ghost text as you type.

- **Trigger**: Automatic while typing
- **Accept**: Press `Tab` or `Ctrl+Space`
- **Dismiss**: Keep typing or press `Esc`

### 2. AI Chat

Interactive chat panel for asking questions and requesting code changes.

- **Command**: `AI Coder: Open Chat`
- **Keyboard**: `F1` > "AI Coder: Open Chat"
- **Features**: 
  - Ask coding questions
  - Request explanations
  - Get code suggestions

### 3. AI Refactoring

Multi-file refactoring with natural language instructions.

- **Command**: `AI Coder: Refactor with AI`
- **Keyboard**: `F1` > "AI Coder: Refactor"
- **How it works**:
  1. Open file to refactor
  2. Run command
  3. Enter instruction (e.g., "Extract this into a helper function")
  4. Review suggested changes

### 4. Toggle Autocomplete

Enable or disable AI autocomplete.

- **Command**: `AI Coder: Toggle Autocomplete`
- **Status Bar**: Click the AI icon in status bar
- **Default**: Enabled

### 5. Select Provider

Interactively switch between AI providers.

- **Command**: `AI Coder: Select Provider`
- **Keyboard**: `F1` > "AI Coder: Select Provider"
- **How it works**:
  1. Run command
  2. Choose from available providers (Ollama, OpenAI, Anthropic, Mistral, Together, Aider)
  3. Provider is updated in config.json
  4. Changes take effect immediately

## Configuration

### Extension Settings

Available in VS Code Settings (`Ctrl+,`):

```json
{
  "aiCoder.autocompleteEnabled": true,
  "aiCoder.routerUrl": "http://localhost:3000"
}
```

- `aiCoder.autocompleteEnabled`: Enable/disable autocomplete (default: `true`)
- `aiCoder.routerUrl`: AI Router server URL (default: `http://localhost:3000`)

### AI Provider Configuration

The extension reads the current AI provider from `/workspace/.aistudio/config.json`:

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
  }
}
```

#### Supported Providers

- **ollama**: Local AI (no API key needed)
- **openai**: GPT-4, GPT-3.5 (requires API key)
- **anthropic**: Claude models (requires API key)
- **mistral**: Mistral models (requires API key)
- **together**: Together AI models (requires API key)
- **aider**: AI pair programming assistant (requires API key)

To switch providers, either:
1. Edit the config file directly, or
2. Use the `AI Coder: Select Provider` command

The status bar displays the current provider and model.

## Status Bar

The extension adds a status bar item showing:

```
🤖 AI: ollama/codellama
```

Click it to toggle autocomplete on/off.

## Commands

All commands available via Command Palette (`F1`):

| Command | Description |
|---------|-------------|
| `AI Coder: Refactor with AI` | Refactor code with AI |
| `AI Coder: Open Chat` | Open chat panel |
| `AI Coder: Toggle Autocomplete` | Enable/disable autocomplete |
| `AI Coder: Select Provider` | Switch AI provider |

## Usage Examples

### Example 1: Code Completion

1. Start typing a function:
   ```javascript
   function calculateTotal(
   ```

2. AI suggests completion:
   ```javascript
   function calculateTotal(items) {
     return items.reduce((sum, item) => sum + item.price, 0);
   }
   ```

3. Press `Tab` to accept

### Example 2: Refactoring

1. Select code to refactor
2. Run `AI Coder: Refactor with AI`
3. Enter: "Add error handling and input validation"
4. Review suggested changes
5. Apply or modify as needed

### Example 3: Chat

1. Run `AI Coder: Open Chat`
2. Ask: "How do I implement authentication in Express?"
3. Get AI response with code examples
4. Copy code to your project

## How It Works

```
┌─────────────┐
│  VS Code    │
│  Extension  │
└──────┬──────┘
       │
       │ HTTP POST
       │
       ▼
┌─────────────┐      ┌──────────┐
│  AI Router  │─────▶│  Cache   │
│  Port 3000  │      └──────────┘
└──────┬──────┘
       │
       │ Route to provider
       │
       ▼
┌──────────────┬─────────┬──────────┬─────────┬─────────┬───────┐
│   Ollama     │ OpenAI  │Anthropic │ Mistral │Together │ Aider │
│   (local)    │ (remote)│ (remote) │(remote) │(remote) │(remote)│
└──────────────┴─────────┴──────────┴─────────┴─────────┴───────┘
```

## Troubleshooting

### Autocomplete not working

1. Check AI Router is running:
   ```bash
   curl http://localhost:3000/health
   ```

2. Check extension is enabled:
   - Look for `🤖 AI:` in status bar
   - Click it to toggle

3. Check settings:
   - `aiCoder.autocompleteEnabled` should be `true`
   - `aiCoder.routerUrl` should be `http://localhost:3000`

### Chat not responding

1. Check AI Router logs:
   ```bash
   docker logs dev-studio | grep ai-router
   ```

2. Verify config.json is valid JSON

3. For remote providers, check API keys are set

### Status bar not showing provider

1. Create `/workspace/.aistudio/config.json` if missing
2. Restart VS Code: `Developer: Reload Window`

## Development

### Building the Extension

```bash
cd extensions/ai-coder
npm install
npm run compile
```

### Installing Locally

```bash
code-server --install-extension extensions/ai-coder
```

## API Reference

The extension calls these AI Router endpoints:

- `POST /complete`: Get code completions
- `POST /refactor`: Refactor code
- `GET /config`: Get current provider config

See `ai-router/README.md` for API details.

## License

MIT License
