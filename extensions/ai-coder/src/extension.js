const vscode = require('vscode');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * AI Coder Extension
 * Provides inline autocomplete and chat/refactor UI
 */

let autocompleteEnabled = true;
let currentConfig = null;
let statusBarItem;

/**
 * Load configuration from .aistudio/config.json
 */
function loadAIConfig() {
  try {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return null;
    }
    
    const configPath = path.join(workspaceFolders[0].uri.fsPath, '.aistudio', 'config.json');
    
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configData);
    }
  } catch (error) {
    console.error('Error loading AI config:', error);
  }
  return null;
}

/**
 * Get AI Router URL from configuration
 */
function getRouterUrl() {
  const config = vscode.workspace.getConfiguration('aiCoder');
  return config.get('routerUrl', 'http://localhost:3000');
}

/**
 * Inline Autocomplete Provider
 * Provides AI-powered code completions as ghost text
 */
class AICompletionProvider {
  async provideInlineCompletionItems(document, position, context, token) {
    if (!autocompleteEnabled) {
      return null;
    }

    try {
      // Get current line and preceding context
      const line = document.lineAt(position.line);
      const textBeforeCursor = document.getText(
        new vscode.Range(new vscode.Position(Math.max(0, position.line - 10), 0), position)
      );
      
      // Don't complete on empty lines or whitespace
      if (line.text.trim() === '' && textBeforeCursor.trim().endsWith('\n')) {
        return null;
      }

      // Build prompt with context
      const prompt = `Complete this code:\n${textBeforeCursor}`;
      
      // Call AI Router for completion
      const routerUrl = getRouterUrl();
      const response = await axios.post(`${routerUrl}/complete`, {
        prompt: prompt,
        context: document.getText()
      }, {
        timeout: 5000
      });

      // Parse response (simplified - actual parsing depends on provider)
      let completionText = '';
      if (response.data && typeof response.data === 'string') {
        completionText = response.data;
      } else if (response.data && response.data.response) {
        completionText = response.data.response;
      }

      if (!completionText) {
        return null;
      }

      // Create inline completion item
      return [
        new vscode.InlineCompletionItem(
          completionText,
          new vscode.Range(position, position)
        )
      ];

    } catch (error) {
      // Silently fail for autocomplete errors
      console.error('Autocomplete error:', error.message);
      return null;
    }
  }
}

/**
 * Refactor Command
 * Triggers AI-powered multi-file refactoring
 */
async function refactorCommand() {
  try {
    // Get instruction from user
    const instruction = await vscode.window.showInputBox({
      prompt: 'What refactoring would you like to perform?',
      placeHolder: 'e.g., Rename variable x to userId, Extract function, etc.'
    });

    if (!instruction) {
      return;
    }

    // Get active editor files
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage('No active file');
      return;
    }

    // Build files array (for now, just active file)
    const files = [{
      path: activeEditor.document.fileName,
      content: activeEditor.document.getText()
    }];

    // Show progress
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Refactoring with AI...',
      cancellable: false
    }, async (progress) => {
      progress.report({ increment: 0 });

      // Call AI Router for refactoring
      const routerUrl = getRouterUrl();
      const response = await axios.post(`${routerUrl}/refactor`, {
        files: files,
        instruction: instruction
      });

      progress.report({ increment: 100 });

      // Show result in new document
      const resultDoc = await vscode.workspace.openTextDocument({
        content: JSON.stringify(response.data, null, 2),
        language: 'json'
      });
      await vscode.window.showTextDocument(resultDoc);
      
      vscode.window.showInformationMessage('Refactoring complete! Review the suggested changes.');
    });

  } catch (error) {
    vscode.window.showErrorMessage(`Refactoring failed: ${error.message}`);
  }
}

/**
 * Chat Command
 * Opens a webview with chat interface
 */
async function chatCommand(context) {
  const panel = vscode.window.createWebviewPanel(
    'aiCoderChat',
    'AI Coder Chat',
    vscode.ViewColumn.Beside,
    {
      enableScripts: true
    }
  );

  // Load current config
  currentConfig = loadAIConfig();
  const provider = currentConfig ? currentConfig.provider : 'ollama';
  const model = currentConfig ? currentConfig.model : 'codellama';

  panel.webview.html = getChatWebviewContent(provider, model);

  // Handle messages from webview
  panel.webview.onDidReceiveMessage(
    async message => {
      switch (message.command) {
        case 'sendMessage':
          try {
            const routerUrl = getRouterUrl();
            const response = await axios.post(`${routerUrl}/complete`, {
              prompt: message.text,
              context: ''
            });
            
            panel.webview.postMessage({
              command: 'receiveMessage',
              text: response.data
            });
          } catch (error) {
            panel.webview.postMessage({
              command: 'error',
              text: error.message
            });
          }
          break;
      }
    },
    undefined,
    context.subscriptions
  );
}

/**
 * Generate HTML for chat webview
 */
function getChatWebviewContent(provider, model) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Coder Chat</title>
    <style>
        body {
            padding: 10px;
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            font-family: var(--vscode-font-family);
        }
        .header {
            padding: 10px;
            border-bottom: 1px solid var(--vscode-panel-border);
            margin-bottom: 10px;
        }
        .chat-container {
            height: calc(100vh - 150px);
            overflow-y: auto;
            padding: 10px;
            border: 1px solid var(--vscode-panel-border);
            margin-bottom: 10px;
        }
        .message {
            margin: 10px 0;
            padding: 8px;
            border-radius: 4px;
        }
        .user-message {
            background-color: var(--vscode-input-background);
            text-align: right;
        }
        .ai-message {
            background-color: var(--vscode-editor-background);
        }
        .input-container {
            display: flex;
            gap: 10px;
        }
        input {
            flex: 1;
            padding: 8px;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
        }
        button {
            padding: 8px 16px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            cursor: pointer;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>AI Coder Chat</h2>
        <p>Provider: ${provider} | Model: ${model}</p>
    </div>
    <div class="chat-container" id="chatContainer"></div>
    <div class="input-container">
        <input type="text" id="messageInput" placeholder="Ask a question or request code changes..." />
        <button onclick="sendMessage()">Send</button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            
            if (!message) return;
            
            // Display user message
            addMessage(message, 'user');
            
            // Send to extension
            vscode.postMessage({
                command: 'sendMessage',
                text: message
            });
            
            input.value = '';
        }
        
        function addMessage(text, type) {
            const container = document.getElementById('chatContainer');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + (type === 'user' ? 'user-message' : 'ai-message');
            messageDiv.textContent = text;
            container.appendChild(messageDiv);
            container.scrollTop = container.scrollHeight;
        }
        
        // Handle messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'receiveMessage':
                    addMessage(message.text, 'ai');
                    break;
                case 'error':
                    addMessage('Error: ' + message.text, 'ai');
                    break;
            }
        });
        
        // Send on Enter key
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    </script>
</body>
</html>`;
}

/**
 * Toggle Autocomplete Command
 */
function toggleAutocompleteCommand() {
  autocompleteEnabled = !autocompleteEnabled;
  updateStatusBar();
  vscode.window.showInformationMessage(
    `AI Autocomplete ${autocompleteEnabled ? 'enabled' : 'disabled'}`
  );
}

/**
 * Select Provider Command
 * Allows user to select AI provider from available options
 */
async function selectProviderCommand() {
  try {
    // Get available providers from AI Router
    const routerUrl = getRouterUrl();
    const response = await axios.get(`${routerUrl}/config`);
    const availableProviders = response.data.availableProviders || [];
    
    // Show quick pick menu
    const selected = await vscode.window.showQuickPick(availableProviders, {
      placeHolder: 'Select AI Provider',
      title: 'Choose AI Provider'
    });
    
    if (!selected) {
      return;
    }
    
    // Update config file
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('No workspace folder open');
      return;
    }
    
    const configPath = path.join(workspaceFolders[0].uri.fsPath, '.aistudio', 'config.json');
    
    if (!fs.existsSync(configPath)) {
      vscode.window.showErrorMessage('Config file not found');
      return;
    }
    
    // Read current config
    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);
    
    // Update provider
    config.provider = selected;
    
    // Write back to file
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    // Update status bar
    updateStatusBar();
    
    vscode.window.showInformationMessage(`AI Provider changed to: ${selected}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to change provider: ${error.message}`);
  }
}

/**
 * Update status bar item
 */
function updateStatusBar() {
  if (!statusBarItem) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.show();
  }
  
  currentConfig = loadAIConfig();
  const provider = currentConfig ? currentConfig.provider : 'ollama';
  const model = currentConfig ? currentConfig.model : 'codellama';
  
  statusBarItem.text = `$(robot) AI: ${provider}/${model}`;
  statusBarItem.tooltip = `AI Coder - ${autocompleteEnabled ? 'Enabled' : 'Disabled'}`;
  statusBarItem.command = 'ai-coder.toggleAutocomplete';
}

/**
 * Extension activation
 */
function activate(context) {
  console.log('AI Coder extension is now active');

  // Create status bar item
  updateStatusBar();

  // Register inline completion provider
  const completionProvider = vscode.languages.registerInlineCompletionItemProvider(
    { pattern: '**' },
    new AICompletionProvider()
  );

  // Register commands
  const refactorCmd = vscode.commands.registerCommand('ai-coder.refactor', refactorCommand);
  const chatCmd = vscode.commands.registerCommand('ai-coder.chat', () => chatCommand(context));
  const toggleCmd = vscode.commands.registerCommand('ai-coder.toggleAutocomplete', toggleAutocompleteCommand);
  const selectProviderCmd = vscode.commands.registerCommand('ai-coder.selectProvider', selectProviderCommand);

  // Add to subscriptions
  context.subscriptions.push(completionProvider, refactorCmd, chatCmd, toggleCmd, selectProviderCmd, statusBarItem);

  // Watch for config changes
  const configWatcher = vscode.workspace.createFileSystemWatcher('**/.aistudio/config.json');
  configWatcher.onDidChange(() => {
    updateStatusBar();
    vscode.window.showInformationMessage('AI configuration updated');
  });
  context.subscriptions.push(configWatcher);
}

/**
 * Extension deactivation
 */
function deactivate() {
  if (statusBarItem) {
    statusBarItem.dispose();
  }
}

module.exports = {
  activate,
  deactivate
};
