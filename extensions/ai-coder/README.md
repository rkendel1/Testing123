# AI Coder Extension

VS Code extension for AI-powered code completion and refactoring.

## Features

### Overview: Provider-Agnostic Natural Language Interface

The AI Coder extension provides a **unified natural language interface** that works seamlessly across all supported AI providers. You can:

- Use the same natural language commands regardless of the underlying provider (Ollama, OpenAI, Anthropic, Mistral, Together, Aider)
- Switch providers without changing your workflow or commands
- Get consistent, high-quality responses from any configured provider
- Focus on your coding tasks, not provider-specific syntax

**Key Benefits**:
- 🔄 **Provider Agnostic**: Write queries once, use with any provider
- 🚀 **Seamless Switching**: Change providers instantly with `AI Coder: Select Provider`
- 📝 **Natural Language**: No need to learn provider-specific APIs or syntax
- ⚡ **Uniform Experience**: Same interface, same commands, different providers

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

### 6. Natural Language Query

Interact with **any configured AI provider** using natural language queries and refine CLI commands.

- **Command**: `AI Coder: Natural Language Query`
- **Keyboard**: `F1` > "AI Coder: Natural Language Query"
- **Provider Support**: Works uniformly with all supported providers (Ollama, OpenAI, Anthropic, Mistral, Together, Aider)
- **Features**:
  - Send natural language queries to the configured AI provider
  - Get responses from any provider without provider-specific syntax
  - Refine natural language queries for specific CLI operations (GitHub CLI, Supabase CLI, Git, NPM)
  - Get AI-powered assistance for command-line operations
  - Seamless provider switching - no changes needed to your queries
- **How it works**:
  1. Run command to open Natural Language Query panel
  2. Enter your query in the General Query section (e.g., "Generate a function to calculate tax")
  3. The query is automatically routed to your configured provider
  4. Review AI responses - the interface shows which provider handled your request
  5. Switch providers anytime using `AI Coder: Select Provider` without changing your workflow
- **Examples**:
  - "Generate a function to calculate tax"
  - "Explain how async/await works in JavaScript"
  - "Create a REST API endpoint for user authentication"
  - "How do I implement rate limiting in Express?"
- **CLI Command Refinement**:
  1. Select a CLI type (GitHub, Supabase, Git, NPM)
  2. Enter original command or description
  3. Describe how you want to refine it
  4. Get refined command from your configured provider

### 7. Generate Code with AI

Request, review, and apply AI-generated code directly within the IDE using **any configured AI provider**.

- **Command**: `AI Coder: Generate Code with AI`
- **Keyboard**: `F1` > "AI Coder: Generate Code"
- **Provider Support**: Works uniformly with all supported providers (Ollama, OpenAI, Anthropic, Mistral, Together, Aider)
- **Features**:
  - Request code generation with natural language instructions
  - Review generated code before applying
  - Apply code to current file or create new file
  - Reject generated code if not suitable
  - Request changes or refinements to generated code
  - Provider-agnostic interface - same workflow for all providers
- **How it works**:
  1. Run command and enter code generation instruction
  2. Wait for AI to generate code (routed automatically to your configured provider)
  3. Review the generated code
  4. Choose from:
     - **Apply Code**: Insert code at cursor position or create new file
     - **Reject**: Dismiss the generated code
     - **Request Changes**: Provide feedback for refinement
- **Examples**:
  - "Create a REST API endpoint for user authentication"
  - "Generate a function to validate email addresses"
  - "Create a React component for a login form"
  - "Write unit tests for this function"

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
| `AI Coder: Natural Language Query` | Send natural language queries and refine CLI commands |
| `AI Coder: Generate Code with AI` | Request, review, and apply AI-generated code |

## Usage Examples

### Example 1: Provider-Agnostic Natural Language Query

**Scenario**: Generate a tax calculation function using different providers

1. **Using Ollama (local)**:
   - Run `AI Coder: Natural Language Query`
   - Current provider shows: `ollama/codellama`
   - Enter: "Generate a function to calculate tax"
   - Get response tailored to your request

2. **Switch to OpenAI**:
   - Run `AI Coder: Select Provider`
   - Choose `openai`
   - Run `AI Coder: Natural Language Query`
   - Enter the **same query**: "Generate a function to calculate tax"
   - Get response from OpenAI - no syntax changes needed!

3. **Switch to Anthropic Claude**:
   - Run `AI Coder: Select Provider`
   - Choose `anthropic`
   - Run `AI Coder: Natural Language Query`
   - Enter the **same query**: "Generate a function to calculate tax"
   - Get response from Claude - same interface, different provider!

**Key Point**: The natural language interface abstracts away provider differences. Your queries work uniformly across all providers.

### Example 2: Code Completion

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

### Example 3: Refactoring

1. Select code to refactor
2. Run `AI Coder: Refactor with AI`
3. Enter: "Add error handling and input validation"
4. Review suggested changes
5. Apply or modify as needed

### Example 4: Chat

1. Run `AI Coder: Open Chat`
2. Ask: "How do I implement authentication in Express?"
3. Get AI response with code examples
4. Copy code to your project

### Example 5: Cross-Provider Code Generation

**Scenario**: Generate the same code using different providers to compare outputs

1. **With Ollama**:
   - Current provider: `ollama/codellama`
   - Run `AI Coder: Generate Code with AI`
   - Enter: "Create a REST API endpoint for user authentication"
   - Review code generated by Ollama

2. **With OpenAI GPT-4**:
   - Run `AI Coder: Select Provider` → Choose `openai`
   - Run `AI Coder: Generate Code with AI`
   - Enter: "Create a REST API endpoint for user authentication"
   - Review code generated by GPT-4
   - Apply the version you prefer

3. **With Anthropic Claude**:
   - Run `AI Coder: Select Provider` → Choose `anthropic`
   - Run `AI Coder: Generate Code with AI`
   - Enter: "Create a REST API endpoint for user authentication"
   - Review code generated by Claude
   - Compare all three versions

**Benefit**: The unified interface lets you quickly test multiple providers to find the best solution for your specific use case.

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
