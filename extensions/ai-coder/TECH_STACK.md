# AI Coder Extension - Tech Stack

## Core Technologies

### VS Code Extension API
- **Version**: 1.80.0+
- **Language**: JavaScript (ES6+)
- **Extension Host**: Node.js runtime
- **API Surface**: VS Code Extension API
- **Why chosen**: Native VS Code integration, full IDE access

### Runtime Environment
- **Node.js**: v14+ (via VS Code)
- **Event Loop**: Single-threaded, non-blocking
- **Module System**: CommonJS (require/exports)
- **Future**: ES modules support

## Dependencies

### Production Dependencies

#### HTTP Client
- **axios** (v1.6+)
  - Promise-based HTTP client
  - Request/response interceptors
  - Timeout support
  - Error handling
  - **Why chosen**: Reliable, well-tested, excellent API

### Development Dependencies

#### Type Definitions
- **@types/vscode** (v1.80+)
  - TypeScript type definitions for VS Code API
  - IntelliSense support
  - Type checking
  - **Why chosen**: Better developer experience, fewer errors

#### Packaging
- **vsce** (v2.15+)
  - VS Code Extension Manager
  - Package extension to .vsix
  - Publish to marketplace
  - **Why chosen**: Official VS Code packaging tool

### VS Code API Modules Used

#### Commands API
```javascript
vscode.commands.registerCommand(id, handler)
vscode.commands.executeCommand(id, ...args)
```
- Command registration
- Command execution
- Command palette integration

#### Window API
```javascript
vscode.window.showInformationMessage(message)
vscode.window.showErrorMessage(message)
vscode.window.showInputBox(options)
vscode.window.showQuickPick(items, options)
vscode.window.createWebviewPanel(type, title, column, options)
vscode.window.createStatusBarItem(alignment, priority)
vscode.window.withProgress(options, task)
```
- User interaction
- Webview creation
- Status bar
- Progress indicators

#### Workspace API
```javascript
vscode.workspace.getConfiguration(section)
vscode.workspace.workspaceFolders
vscode.workspace.openTextDocument(options)
vscode.workspace.createFileSystemWatcher(pattern)
```
- Configuration access
- Workspace information
- File system watching
- Document operations

#### Languages API
```javascript
vscode.languages.registerInlineCompletionItemProvider(selector, provider)
```
- Inline completion registration
- Language features integration

#### Text Editor API
```javascript
vscode.window.activeTextEditor
editor.document
editor.selection
editor.edit(callback)
```
- Editor access
- Document manipulation
- Selection handling

## Extension Manifest (package.json)

### Extension Metadata
```json
{
  "name": "ai-coder",
  "displayName": "AI Coder",
  "description": "AI-powered code completion and refactoring",
  "version": "1.0.0",
  "publisher": "ai-studio",
  "engines": {
    "vscode": "^1.80.0"
  }
}
```

### Activation Events
```json
{
  "activationEvents": [
    "onStartupFinished"
  ]
}
```
- Extension activates after VS Code starts
- Lazy loading for better performance
- Can add specific activation events if needed

### Contribution Points

#### Commands
```json
{
  "contributes": {
    "commands": [
      {
        "command": "ai-coder.refactor",
        "title": "AI Coder: Refactor with AI"
      }
    ]
  }
}
```

#### Configuration
```json
{
  "contributes": {
    "configuration": {
      "properties": {
        "aiCoder.autocompleteEnabled": {
          "type": "boolean",
          "default": true
        }
      }
    }
  }
}
```

## Webview Technology

### HTML/CSS/JavaScript
- **HTML5**: Structure
- **CSS3**: Styling with VS Code variables
- **Vanilla JavaScript**: No framework overhead
- **Message API**: Extension communication

### VS Code Theme Integration
```css
:root {
  --vscode-foreground
  --vscode-background
  --vscode-editor-background
  --vscode-button-background
  --vscode-input-background
  --vscode-panel-border
}
```

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'none'; 
               script-src 'unsafe-inline'; 
               style-src 'unsafe-inline';">
```

## File System Operations

### Node.js Built-in Modules
- **fs**: File system operations
  - Read configuration files
  - Write updated configs
  - Check file existence

- **path**: Path manipulation
  - Cross-platform path handling
  - Join paths safely
  - Resolve relative paths

## Architecture Patterns

### Extension Structure
```
ai-coder/
├── src/
│   └── extension.js          # Main entry point
├── package.json              # Extension manifest
├── README.md                 # User documentation
└── .vscodeignore            # Files to exclude from package
```

### Code Organization
```javascript
// extension.js structure
// 1. Imports
// 2. Global variables
// 3. Helper functions
// 4. Classes (providers)
// 5. Command handlers
// 6. Activation function
// 7. Deactivation function
// 8. Module exports
```

## API Integration

### AI Router Communication
- **Protocol**: HTTP/REST
- **Endpoint**: http://localhost:3000
- **Format**: JSON
- **Timeout**: 5 seconds (autocomplete), 30 seconds (commands)
- **Error Handling**: Graceful fallback

### Request/Response Format
```javascript
// Request
{
  prompt: string,
  context: string
}

// Response
{
  response: string,
  // or direct string
}
```

## Development Tools

### VS Code Extension Development
- **Extension Host**: Isolated VS Code instance for testing
- **Debugging**: Built-in debugger support
- **Hot Reload**: Reload extension during development
- **DevTools**: Webview debugging with Chrome DevTools

### Recommended VS Code Extensions
- ESLint: Code linting
- Prettier: Code formatting
- Extension Test Runner: Run extension tests

## Testing Infrastructure (Future)

### Unit Testing
- **Framework**: Jest or Mocha
- **Coverage**: Istanbul/c8
- **Mocking**: Mock VS Code API

### Integration Testing
- **VS Code Test Runner**: Official test runner
- **Test Workspace**: Sample workspace for tests
- **Assertions**: Chai or Jest matchers

### E2E Testing
- **Approach**: Test in real VS Code instance
- **Automation**: Simulate user interactions
- **Verification**: Check expected outcomes

## Performance Considerations

### Extension Size
- **Current**: ~10KB (excluding node_modules)
- **node_modules**: ~5MB (axios)
- **Packaged**: ~1MB
- **Optimization**: Tree-shaking in production

### Memory Usage
- **Baseline**: ~10MB
- **Active**: ~20-30MB (with webviews)
- **Optimization**: Dispose webviews when closed

### Startup Time
- **Activation**: <100ms
- **First Completion**: ~200-500ms (network)
- **Subsequent**: <100ms (cached)

## Security

### API Key Handling
- Stored in workspace config
- Never logged or exposed
- User-managed
- Not transmitted except to AI providers

### Webview Security
- Content Security Policy enforced
- No remote script loading
- Sanitized user input
- Isolated from extension process

### Network Security
- HTTPS for remote providers
- Local-only by default (localhost:3000)
- No telemetry
- No data collection

## Deployment

### Packaging
```bash
vsce package
# Creates ai-coder-1.0.0.vsix
```

### Installation Methods
1. **From VSIX**:
   ```
   code --install-extension ai-coder-1.0.0.vsix
   ```

2. **From Source** (development):
   - Copy to extensions folder
   - Reload VS Code

3. **Marketplace** (future):
   - Search in Extensions view
   - Click Install

### Distribution
- **Docker Container**: Pre-installed in AI Studio
- **Manual**: .vsix file distribution
- **Marketplace**: Future public release

## Version Requirements

### Minimum
- VS Code: 1.80.0
- Node.js: v14 (via VS Code)
- npm: v7 (for development)

### Recommended
- VS Code: Latest stable
- Node.js: v18 (for development)
- npm: v9 (for development)

## Configuration Files

### .vscodeignore
```
.git
.gitignore
node_modules
src/**/*.test.js
.eslintrc.js
```
- Excludes files from package
- Reduces extension size
- Faster installation

### package.json Scripts
```json
{
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "node src/extension.js",
    "package": "vsce package"
  }
}
```

## Future Technology Considerations

### TypeScript Migration
- Better type safety
- IntelliSense improvements
- Compile-time error checking
- Easier refactoring

### Testing Framework
- Jest for unit tests
- VS Code Test Runner for integration
- Automated test runs in CI/CD

### Language Server Protocol
- For advanced language features
- Smarter completions
- Better refactoring support

### WebSocket Communication
- Real-time AI streaming
- Better performance
- Live collaboration features

### Extension API Enhancements
- Notebook support
- Terminal integration
- Git integration
- Debugger integration

## Build and Development Workflow

### Development
```bash
# Install dependencies
npm install

# Open in VS Code
code .

# Press F5 to launch Extension Development Host

# Make changes and reload window to test
```

### Building
```bash
# Package extension
vsce package

# Output: ai-coder-1.0.0.vsix
```

### Publishing (Future)
```bash
# Create publisher account on marketplace
vsce create-publisher <name>

# Login
vsce login <publisher>

# Publish
vsce publish
```

## Monitoring and Debugging

### Console Logging
- Extension Host console
- Output channel (future)
- Log levels (future)

### Error Tracking
- Console errors
- User notifications
- Sentry integration (future)

### Performance Profiling
- VS Code profiler
- Chrome DevTools (webviews)
- Memory snapshots
