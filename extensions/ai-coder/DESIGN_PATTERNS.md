# AI Coder Extension - Design Patterns

## VS Code Extension Patterns

### 1. Command Pattern
**Purpose**: Encapsulate actions as commands

**Implementation**:
```javascript
// Register command
const command = vscode.commands.registerCommand(
  'ai-coder.action',
  async () => {
    await performAction();
  }
);
context.subscriptions.push(command);

// Execute command programmatically
await vscode.commands.executeCommand('ai-coder.action');
```

**Benefits**:
- User-invokable actions
- Programmatic execution
- Command palette integration
- Keyboard shortcut binding

### 2. Provider Pattern
**Purpose**: Implement VS Code extension points

**Implementation**:
```javascript
class AICompletionProvider {
  async provideInlineCompletionItems(document, position, context, token) {
    // Provide completions based on context
    return completions;
  }
}

const provider = vscode.languages.registerInlineCompletionItemProvider(
  { pattern: '**' },
  new AICompletionProvider()
);
```

**Benefits**:
- Integrate with VS Code features
- Consistent API
- Cancellable operations
- Context-aware

### 3. Disposable Pattern
**Purpose**: Manage resource lifecycle

**Implementation**:
```javascript
function activate(context) {
  const disposable1 = vscode.commands.registerCommand(...);
  const disposable2 = vscode.workspace.onDidChangeConfiguration(...);
  
  // Add to subscriptions for auto-cleanup
  context.subscriptions.push(disposable1, disposable2);
}

function deactivate() {
  // Resources automatically disposed
}
```

**Benefits**:
- Automatic cleanup
- No memory leaks
- Proper resource management

### 4. Singleton Pattern
**Purpose**: Single instance of shared resources

**Implementation**:
```javascript
let statusBarItem = null;

function getStatusBarItem() {
  if (!statusBarItem) {
    statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
  }
  return statusBarItem;
}
```

**Benefits**:
- Shared state
- Resource efficiency
- Consistent behavior

### 5. Observer Pattern
**Purpose**: React to events and changes

**Implementation**:
```javascript
// File system watcher
const watcher = vscode.workspace.createFileSystemWatcher('**/*.json');

watcher.onDidChange(uri => {
  console.log(`File changed: ${uri.fsPath}`);
  reloadConfiguration();
});

watcher.onDidCreate(uri => {
  console.log(`File created: ${uri.fsPath}`);
});

context.subscriptions.push(watcher);
```

**Benefits**:
- Event-driven architecture
- Decoupled components
- Reactive updates

### 6. Factory Pattern
**Purpose**: Create webview panels

**Implementation**:
```javascript
function createWebviewPanel(type, title, viewColumn) {
  const panel = vscode.window.createWebviewPanel(
    type,
    title,
    viewColumn,
    {
      enableScripts: true,
      retainContextWhenHidden: true
    }
  );
  
  panel.webview.html = getWebviewContent(type);
  return panel;
}

// Usage
const chatPanel = createWebviewPanel('chat', 'AI Chat', vscode.ViewColumn.Beside);
const queryPanel = createWebviewPanel('query', 'NL Query', vscode.ViewColumn.Beside);
```

**Benefits**:
- Consistent panel creation
- Centralized configuration
- Reusable code

### 7. Strategy Pattern
**Purpose**: Different completion strategies

**Implementation**:
```javascript
const strategies = {
  inline: async (prompt) => getInlineCompletion(prompt),
  refactor: async (prompt) => getRefactorSuggestion(prompt),
  chat: async (prompt) => getChatResponse(prompt)
};

async function getAIResponse(type, prompt) {
  const strategy = strategies[type];
  return await strategy(prompt);
}
```

**Benefits**:
- Flexible behavior selection
- Easy to add new strategies
- Clean separation

## Webview Communication Patterns

### 1. Message Passing Pattern
**Purpose**: Communication between extension and webview

**Implementation**:
```javascript
// Extension side
panel.webview.postMessage({
  command: 'update',
  data: newData
});

panel.webview.onDidReceiveMessage(
  message => {
    switch (message.command) {
      case 'action':
        handleAction(message.data);
        break;
    }
  }
);

// Webview side (HTML/JS)
const vscode = acquireVsCodeApi();

// Send to extension
vscode.postMessage({
  command: 'action',
  data: formData
});

// Receive from extension
window.addEventListener('message', event => {
  const message = event.data;
  handleUpdate(message.data);
});
```

**Benefits**:
- Type-safe communication
- Asynchronous messaging
- Bidirectional communication

### 2. State Management Pattern
**Purpose**: Persist webview state

**Implementation**:
```javascript
// Webview side
const vscode = acquireVsCodeApi();

// Get previous state
const previousState = vscode.getState();

// Update state
vscode.setState({
  scrollPosition: window.scrollY,
  formData: currentData
});

// Restore on reload
if (previousState) {
  window.scrollTo(0, previousState.scrollPosition);
}
```

**Benefits**:
- State persistence across reloads
- Better user experience
- Handles webview disposal/recreation

### 3. Event Delegation Pattern
**Purpose**: Efficient event handling in webview

**Implementation**:
```javascript
// Webview HTML
document.addEventListener('click', (e) => {
  if (e.target.matches('.action-button')) {
    handleAction(e.target.dataset.action);
  }
});
```

**Benefits**:
- Single event listener
- Dynamic content support
- Better performance

## API Integration Patterns

### 1. Adapter Pattern
**Purpose**: Adapt AI Router API to extension needs

**Implementation**:
```javascript
class AIRouterAdapter {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  
  async getCompletion(prompt, context) {
    const response = await axios.post(`${this.baseUrl}/complete`, {
      prompt,
      context
    });
    return this.adaptResponse(response.data);
  }
  
  adaptResponse(data) {
    // Transform API response to extension format
    return {
      text: data.response || data.text || data,
      confidence: data.confidence || 1.0
    };
  }
}
```

**Benefits**:
- Isolates API changes
- Consistent internal format
- Easy to test

### 2. Circuit Breaker Pattern (Future)
**Purpose**: Handle API failures gracefully

**Implementation**:
```javascript
class CircuitBreaker {
  constructor(maxFailures = 3, resetTimeout = 60000) {
    this.failures = 0;
    this.maxFailures = maxFailures;
    this.resetTimeout = resetTimeout;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }
  
  async call(fn) {
    if (this.state === 'OPEN') {
      throw new Error('Circuit breaker is open');
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failures++;
    if (this.failures >= this.maxFailures) {
      this.state = 'OPEN';
      setTimeout(() => {
        this.state = 'HALF_OPEN';
        this.failures = 0;
      }, this.resetTimeout);
    }
  }
}
```

### 3. Retry Pattern
**Purpose**: Retry failed requests

**Implementation**:
```javascript
async function withRetry(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
}

// Usage
const result = await withRetry(
  () => axios.post(url, data),
  3,
  1000
);
```

## Error Handling Patterns

### 1. Try-Catch with User Feedback
**Implementation**:
```javascript
async function handleCommand() {
  try {
    await performAction();
    vscode.window.showInformationMessage('Action completed successfully');
  } catch (error) {
    console.error('Action failed:', error);
    vscode.window.showErrorMessage(`Action failed: ${error.message}`);
  }
}
```

### 2. Silent Failure for Background Operations
**Implementation**:
```javascript
async function provideCompletions() {
  try {
    return await fetchCompletions();
  } catch (error) {
    console.error('Completion error:', error.message);
    return null; // Silent failure
  }
}
```

### 3. Graceful Degradation
**Implementation**:
```javascript
async function getConfig() {
  try {
    return await loadConfigFromFile();
  } catch (error) {
    console.warn('Using default config:', error.message);
    return getDefaultConfig();
  }
}
```

## Performance Patterns

### 1. Debouncing Pattern
**Purpose**: Limit function execution rate

**Implementation**:
```javascript
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

const debouncedCompletion = debounce(
  () => triggerCompletion(),
  300
);
```

### 2. Caching Pattern
**Purpose**: Cache expensive computations

**Implementation**:
```javascript
const cache = new Map();

async function getCachedResult(key, computeFn) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const result = await computeFn();
  cache.set(key, result);
  return result;
}
```

### 3. Lazy Loading Pattern
**Purpose**: Load resources only when needed

**Implementation**:
```javascript
let heavyResource = null;

async function getHeavyResource() {
  if (!heavyResource) {
    heavyResource = await loadHeavyResource();
  }
  return heavyResource;
}
```

## Configuration Patterns

### 1. Configuration Cascade
**Purpose**: Layer configuration sources

**Implementation**:
```javascript
function getEffectiveConfig() {
  const defaults = getDefaultConfig();
  const workspace = getWorkspaceConfig();
  const user = getUserConfig();
  
  return {
    ...defaults,
    ...workspace,
    ...user
  };
}
```

### 2. Configuration Validation
**Purpose**: Ensure valid configuration

**Implementation**:
```javascript
function validateConfig(config) {
  const errors = [];
  
  if (!config.provider) {
    errors.push('Provider is required');
  }
  
  if (!config.model) {
    errors.push('Model is required');
  }
  
  if (errors.length > 0) {
    throw new Error(`Invalid config: ${errors.join(', ')}`);
  }
  
  return config;
}
```

## Testing Patterns

### 1. Mock Pattern
**Purpose**: Mock VS Code API for testing

**Implementation**:
```javascript
// Test file
jest.mock('vscode', () => ({
  window: {
    showInformationMessage: jest.fn(),
    showErrorMessage: jest.fn()
  },
  commands: {
    registerCommand: jest.fn()
  }
}));
```

### 2. Spy Pattern
**Purpose**: Verify function calls

**Implementation**:
```javascript
const spy = jest.spyOn(vscode.window, 'showInformationMessage');

// Test code
await command();

expect(spy).toHaveBeenCalledWith('Success message');
```

## Best Practices Applied

1. **Single Responsibility**: Each function has one clear purpose
2. **DRY**: Reuse common webview creation logic
3. **Error Handling**: Comprehensive try-catch blocks
4. **Resource Management**: Proper disposal of resources
5. **User Feedback**: Clear messages for all actions
6. **Performance**: Timeouts and debouncing
7. **Security**: CSP in webviews, input validation
8. **Maintainability**: Clear code structure and documentation
