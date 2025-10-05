# AI Coder Extension - Coding Standards

## VS Code Extension Development Standards

### General Principles
- Follow VS Code extension best practices
- Use VS Code API correctly and efficiently
- Keep extension lightweight and performant
- Provide clear user feedback
- Handle errors gracefully

### Code Formatting
- **Indentation**: 2 spaces (no tabs)
- **Line Length**: Maximum 100 characters
- **Semicolons**: Always use semicolons
- **Quotes**: Single quotes for strings
- **Trailing Commas**: Use trailing commas in multi-line structures

### Naming Conventions
- **Functions**: camelCase (e.g., `activateExtension`, `getChatWebviewContent`)
- **Classes**: PascalCase (e.g., `AICompletionProvider`, `ChatPanel`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_TIMEOUT`, `MAX_RETRIES`)
- **Files**: kebab-case (e.g., `completion-provider.js`, `chat-panel.js`)
- **Commands**: kebab-case with extension prefix (e.g., `ai-coder.refactor`)

### Function Documentation
```javascript
/**
 * Brief description of function purpose
 * @param {vscode.ExtensionContext} context - Extension context
 * @returns {Promise<void>}
 */
async function functionName(context) {
  // Implementation
}
```

### VS Code API Usage

#### Extension Activation
- Use `activate()` function as entry point
- Register all disposables in context.subscriptions
- Clean up resources in `deactivate()`
- Use activation events appropriately

```javascript
function activate(context) {
  // Register commands, providers, etc.
  const command = vscode.commands.registerCommand('extension.command', handler);
  context.subscriptions.push(command);
}

function deactivate() {
  // Clean up resources
}
```

#### Command Registration
```javascript
const command = vscode.commands.registerCommand(
  'ai-coder.commandName',
  async () => {
    try {
      // Command implementation
    } catch (error) {
      vscode.window.showErrorMessage(`Error: ${error.message}`);
    }
  }
);
context.subscriptions.push(command);
```

#### User Interaction
- Use appropriate UI elements (showInformationMessage, showErrorMessage, etc.)
- Provide progress indicators for long operations
- Use QuickPick for selections
- Use InputBox for user input

```javascript
// Show progress
await vscode.window.withProgress({
  location: vscode.ProgressLocation.Notification,
  title: 'Processing...',
  cancellable: false
}, async (progress) => {
  progress.report({ increment: 0 });
  await doWork();
  progress.report({ increment: 100 });
});

// Get user input
const input = await vscode.window.showInputBox({
  prompt: 'Enter value',
  placeHolder: 'Type here...',
  validateInput: (value) => value ? null : 'Value required'
});
```

### Webview Development

#### Security
- Use Content Security Policy
- Sanitize user input
- Use nonces for inline scripts
- Enable only required capabilities

```javascript
webview.html = getWebviewContent(webview.cspSource);

function getWebviewContent(cspSource) {
  return `
    <meta http-equiv="Content-Security-Policy" 
          content="default-src 'none'; 
                   script-src ${cspSource} 'unsafe-inline'; 
                   style-src ${cspSource} 'unsafe-inline';">
  `;
}
```

#### Communication
- Use postMessage for webview communication
- Handle messages asynchronously
- Validate message data

```javascript
// Extension to webview
panel.webview.postMessage({
  command: 'update',
  data: someData
});

// Webview to extension
panel.webview.onDidReceiveMessage(
  async message => {
    switch (message.command) {
      case 'action':
        await handleAction(message.data);
        break;
    }
  },
  undefined,
  context.subscriptions
);
```

#### Styling
- Use VS Code CSS variables for theming
- Support light/dark themes
- Maintain consistency with VS Code UI

```css
.element {
  color: var(--vscode-foreground);
  background-color: var(--vscode-editor-background);
  border: 1px solid var(--vscode-panel-border);
}
```

### Error Handling

#### Try-Catch Pattern
```javascript
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('[Context] Error:', error);
  vscode.window.showErrorMessage(`Operation failed: ${error.message}`);
  return null;
}
```

#### Silent Failures
- For autocomplete, fail silently
- For user-initiated actions, show errors
- Log all errors for debugging

```javascript
// Autocomplete - silent failure
try {
  return await getCompletions();
} catch (error) {
  console.error('Autocomplete error:', error.message);
  return null;  // No user notification
}

// User command - show error
try {
  await executeCommand();
} catch (error) {
  vscode.window.showErrorMessage(`Failed: ${error.message}`);
}
```

### Performance

#### Async Operations
- Use async/await for asynchronous code
- Set appropriate timeouts
- Cancel operations when possible
- Don't block the UI thread

```javascript
const response = await axios.post(url, data, {
  timeout: 5000,
  cancelToken: source.token
});
```

#### Resource Management
- Dispose resources when done
- Use disposables pattern
- Clean up event listeners
- Avoid memory leaks

```javascript
const watcher = vscode.workspace.createFileSystemWatcher('**/*.js');
context.subscriptions.push(watcher);  // Auto-cleanup
```

### Configuration

#### Reading Configuration
```javascript
const config = vscode.workspace.getConfiguration('aiCoder');
const value = config.get('setting', 'defaultValue');
```

#### Updating Configuration
```javascript
await config.update('setting', newValue, vscode.ConfigurationTarget.Global);
```

#### Watching Configuration
```javascript
vscode.workspace.onDidChangeConfiguration(e => {
  if (e.affectsConfiguration('aiCoder')) {
    reloadConfiguration();
  }
});
```

### Testing

#### Unit Tests
- Test pure functions separately
- Mock VS Code API
- Use Jest or Mocha
- Test edge cases

#### Integration Tests
- Use VS Code Extension Test Runner
- Test actual extension behavior
- Verify command registration
- Test UI interactions

### Comments & Documentation

#### JSDoc Comments
```javascript
/**
 * Provides AI-powered code completions
 * @implements {vscode.InlineCompletionItemProvider}
 */
class AICompletionProvider {
  /**
   * Provide inline completions
   * @param {vscode.TextDocument} document - Active document
   * @param {vscode.Position} position - Cursor position
   * @param {vscode.InlineCompletionContext} context - Completion context
   * @param {vscode.CancellationToken} token - Cancellation token
   * @returns {Promise<vscode.InlineCompletionItem[]>}
   */
  async provideInlineCompletionItems(document, position, context, token) {
    // Implementation
  }
}
```

#### Code Comments
- Explain complex logic
- Document API endpoints
- Note workarounds or hacks
- Keep comments up-to-date

### Package.json Best Practices

#### Activation Events
```json
{
  "activationEvents": [
    "onStartupFinished",
    "onCommand:ai-coder.command"
  ]
}
```

#### Command Contributions
```json
{
  "contributes": {
    "commands": [
      {
        "command": "ai-coder.action",
        "title": "AI Coder: Action Name",
        "category": "AI Coder"
      }
    ]
  }
}
```

#### Configuration Contributions
```json
{
  "contributes": {
    "configuration": {
      "title": "AI Coder",
      "properties": {
        "aiCoder.setting": {
          "type": "string",
          "default": "value",
          "description": "Description of setting"
        }
      }
    }
  }
}
```

### Security Best Practices

#### API Keys
- Never hardcode API keys
- Read from configuration
- Warn if keys are missing
- Don't log sensitive data

```javascript
const apiKey = config.get('apiKey');
if (!apiKey) {
  vscode.window.showWarningMessage('API key not configured');
  return;
}
// Use apiKey but never log it
```

#### Input Validation
```javascript
function validateInput(input) {
  if (!input || input.trim() === '') {
    return 'Input cannot be empty';
  }
  if (input.length > 1000) {
    return 'Input too long';
  }
  return null;
}
```

### Git Commit Messages
- Use conventional commits format
- Reference issue numbers
- Keep first line under 50 characters
- Provide context in body

Examples:
```
feat(chat): add natural language query support
fix(completion): resolve timeout issue
docs: update README with new features
refactor: simplify webview creation
```

## Code Review Checklist
- [ ] All commands registered and tested
- [ ] Error handling implemented
- [ ] Resources properly disposed
- [ ] User feedback provided
- [ ] Configuration validated
- [ ] Webviews use CSP
- [ ] No hardcoded values
- [ ] Documentation updated
- [ ] package.json updated
- [ ] Performance considerations addressed
