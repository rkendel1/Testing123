# AI Coder Extension - Project Overview

## Purpose
The AI Coder Extension is a VS Code extension that provides AI-powered code assistance directly in the editor. It integrates with the AI Router service to offer code completion, refactoring, chat, natural language queries, and AI-generated code management.

## Key Features

### 1. Inline Autocomplete
- Ghost text code completions as you type
- Powered by AI Router with multiple provider support
- Accept with Tab or Ctrl+Space
- Can be toggled on/off via status bar

### 2. AI Chat
- Interactive chat panel for coding assistance
- Ask questions about code
- Request explanations
- Get code suggestions
- Side-by-side with editor

### 3. AI Refactoring
- Multi-file refactoring with natural language instructions
- Context-aware suggestions
- Review changes before applying
- Supports complex refactoring operations

### 4. Provider Selection
- Interactive provider switching
- Supports: Ollama, OpenAI, Anthropic, Mistral, Together AI, Aider
- No restart required
- Updates config.json automatically

### 5. Natural Language Query
- Send queries in natural language
- Refine CLI commands (GitHub CLI, Supabase CLI, Git, NPM)
- Get AI-powered assistance for command-line operations
- Dedicated panel for query interaction

### 6. AI Code Generation
- Request code generation with natural language
- Review generated code before applying
- Apply, reject, or request changes
- Iterative refinement support

## Architecture

### Extension Structure
```
extensions/ai-coder/
├── src/
│   └── extension.js        # Main extension code
├── package.json            # Extension manifest
├── README.md              # User documentation
├── CODING_STANDARDS.md    # Developer guidelines
├── PROJECT_OVERVIEW.md    # This file
├── DESIGN_PATTERNS.md     # Architecture patterns
├── TECH_STACK.md          # Technology details
└── .devcontainer/         # Dev container config
    └── devcontainer.json
```

### Core Components

#### 1. Extension Activation
- Activates on startup (`onStartupFinished`)
- Registers all commands and providers
- Creates status bar item
- Sets up file system watchers

#### 2. Completion Provider
- Implements `InlineCompletionItemProvider`
- Calls AI Router for completions
- Handles context extraction
- Provides ghost text suggestions

#### 3. Command Handlers
- Refactor: Multi-file refactoring
- Chat: Opens chat webview
- Toggle Autocomplete: Enable/disable completions
- Select Provider: Interactive provider picker
- Natural Language Query: Query interface
- Generate Code: Code generation workflow

#### 4. Webview Panels
- Chat Panel: Interactive AI chat
- Natural Language Panel: Query and CLI refinement
- Code Generation Panel: Code review and application

#### 5. Configuration Manager
- Loads from `.aistudio/config.json`
- Hot reload on file changes
- Updates status bar on changes

#### 6. Status Bar Item
- Shows current provider/model
- Indicates autocomplete status
- Click to toggle autocomplete

## User Workflows

### Workflow 1: Getting Code Completions
1. User types code in editor
2. Extension detects cursor position
3. Sends context to AI Router
4. AI Router returns completion
5. Extension displays as ghost text
6. User accepts with Tab or continues typing

### Workflow 2: AI Refactoring
1. User opens file to refactor
2. Runs "AI Coder: Refactor with AI" command
3. Enters refactoring instruction
4. Extension sends to AI Router
5. AI Router returns suggestions
6. Extension displays in new document
7. User reviews and applies changes

### Workflow 3: AI Chat
1. User runs "AI Coder: Open Chat" command
2. Chat panel opens beside editor
3. User types question or request
4. Extension sends to AI Router
5. AI response appears in chat
6. Conversation continues

### Workflow 4: Switching Providers
1. User runs "AI Coder: Select Provider"
2. QuickPick shows available providers
3. User selects provider
4. Extension updates config.json
5. Status bar updates immediately
6. New provider used for next request

### Workflow 5: Natural Language Query
1. User runs "AI Coder: Natural Language Query"
2. Panel opens with two sections
3. User enters general query OR
4. User selects CLI type and describes refinement
5. Extension sends to AI Router
6. Response displayed in panel
7. User can copy or use the result

### Workflow 6: Code Generation
1. User runs "AI Coder: Generate Code with AI"
2. Enters code generation instruction
3. Panel opens showing "Generating..."
4. AI generates code
5. Code displayed in panel with buttons:
   - Apply: Inserts code at cursor
   - Reject: Closes panel
   - Request Changes: Opens refinement input
6. If changes requested, cycle repeats

## Integration with AI Router

### API Endpoints Used

#### POST /complete
Used for:
- Inline completions
- Chat responses
- Natural language queries
- Code generation

Request:
```json
{
  "prompt": "User's request or context",
  "context": "Additional context (file content, etc.)"
}
```

#### POST /refactor
Used for:
- Multi-file refactoring

Request:
```json
{
  "files": [
    {"path": "file.js", "content": "..."}
  ],
  "instruction": "Refactoring instruction"
}
```

#### GET /config
Used for:
- Getting available providers
- Verifying connection

Response:
```json
{
  "provider": "ollama",
  "model": "codellama",
  "availableProviders": ["ollama", "openai", ...]
}
```

### Communication Flow
```
VS Code Extension
    ↓ HTTP Request
AI Router (localhost:3000)
    ↓ API Request
AI Provider (Ollama/OpenAI/etc.)
    ↓ Response
AI Router
    ↓ HTTP Response
VS Code Extension
    ↓ Display
User
```

## Configuration

### Extension Settings
Located in VS Code settings (or `.vscode/settings.json`):

```json
{
  "aiCoder.autocompleteEnabled": true,
  "aiCoder.routerUrl": "http://localhost:3000"
}
```

### AI Configuration
Located in workspace at `.aistudio/config.json`:

```json
{
  "provider": "ollama",
  "model": "codellama",
  "apiKeys": {
    "openai": "",
    "anthropic": "",
    ...
  }
}
```

## Commands

All commands accessible via Command Palette (F1):

| Command | ID | Description |
|---------|-----|-------------|
| AI Coder: Refactor with AI | `ai-coder.refactor` | Multi-file refactoring |
| AI Coder: Open Chat | `ai-coder.chat` | Open chat panel |
| AI Coder: Toggle Autocomplete | `ai-coder.toggleAutocomplete` | Enable/disable autocomplete |
| AI Coder: Select Provider | `ai-coder.selectProvider` | Switch AI provider |
| AI Coder: Natural Language Query | `ai-coder.naturalLanguageQuery` | Send natural language queries |
| AI Coder: Generate Code with AI | `ai-coder.generateCode` | Generate and manage AI code |

## Status Bar

Shows: `🤖 AI: {provider}/{model}`
- Click to toggle autocomplete
- Updates when config changes
- Tooltip shows autocomplete status

## Error Handling

### Network Errors
- Timeout after 5 seconds for autocomplete
- Show error message for user commands
- Log errors to console
- Graceful degradation

### Configuration Errors
- Handle missing config file
- Provide default values
- Warn user if router unavailable
- Validate configuration format

### User Errors
- Validate user input
- Show helpful error messages
- Provide suggestions for fixes
- Don't crash extension

## Performance Considerations

### Autocomplete
- 5-second timeout
- Silent failures
- Debounce requests
- Context limited to 10 lines

### Webviews
- Lazy loading
- Dispose when closed
- Efficient message passing
- Minimal DOM updates

### File Watching
- Watch only config file
- Efficient change detection
- Debounce updates

## Security

### API Keys
- Never logged
- Read from config only
- Not exposed in webviews
- User responsible for security

### User Input
- Sanitized before sending to AI
- Validated in webviews
- No code injection
- CSP enabled in webviews

### Network
- Only localhost by default
- HTTPS for remote providers
- No telemetry
- User data stays local

## Future Enhancements

### Planned Features
- TypeScript support
- More refactoring templates
- Code snippets library
- Keyboard shortcuts
- Command history
- Multi-file generation
- Diff view for changes
- Undo/redo for AI operations

### Technical Improvements
- Unit tests
- Integration tests
- Performance profiling
- Telemetry (opt-in)
- Error reporting
- Analytics
- Extension marketplace publish

### Integration Opportunities
- GitHub Copilot compatibility
- IntelliJ plugin
- Vim/Neovim extension
- Sublime Text package
- Web version (vscode.dev)

## Development Workflow

### Setup
1. Clone repository
2. `npm install` in extension directory
3. Open in VS Code
4. Press F5 to launch Extension Development Host
5. Test features in development window

### Testing
1. Manual testing in dev host
2. Test all commands
3. Verify webview rendering
4. Check error handling
5. Test with different providers

### Debugging
- Use VS Code debugger
- Console.log for quick debugging
- Check Extension Host logs
- Monitor network requests
- Inspect webview with Developer Tools

### Publishing
1. Update version in package.json
2. Update CHANGELOG
3. Test all features
4. Package with vsce
5. Publish to marketplace

## Dependencies

### Production
- **axios**: HTTP client for AI Router communication
- **vscode**: VS Code extension API (provided)

### Development
- **@types/vscode**: TypeScript definitions
- **vsce**: VS Code Extension Manager

## Deployment

### Installation
1. Copy extension to VS Code extensions folder, or
2. Install from .vsix file, or
3. Install from marketplace (future)

### In Docker Container
- Pre-installed in development studio
- Loads on code-server startup
- Auto-connects to AI Router

### Updates
- Manual update via .vsix file
- Marketplace auto-update (future)
- Version checking (future)

## Monitoring & Analytics

### Current
- Console logging
- Error messages to user
- Basic error tracking

### Future
- Usage analytics (opt-in)
- Error reporting service
- Performance metrics
- Provider usage stats
