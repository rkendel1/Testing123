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
 * Generate HTML for natural language query webview
 */
function getNaturalLanguageWebviewContent(provider, model) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Natural Language Query</title>
    <style>
        body {
            padding: 20px;
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            font-family: var(--vscode-font-family);
        }
        .header {
            padding: 10px 0;
            border-bottom: 1px solid var(--vscode-panel-border);
            margin-bottom: 20px;
        }
        .section {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
        }
        .section h3 {
            margin-top: 0;
            color: var(--vscode-textLink-foreground);
        }
        textarea {
            width: 100%;
            min-height: 100px;
            padding: 8px;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            font-family: var(--vscode-editor-font-family);
            resize: vertical;
        }
        input, select {
            width: 100%;
            padding: 8px;
            margin: 5px 0;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
        }
        button {
            padding: 10px 20px;
            margin: 5px 5px 5px 0;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            cursor: pointer;
            border-radius: 2px;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .response {
            margin-top: 10px;
            padding: 10px;
            background-color: var(--vscode-textCodeBlock-background);
            border-left: 3px solid var(--vscode-textLink-foreground);
            white-space: pre-wrap;
            font-family: var(--vscode-editor-font-family);
        }
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>AI Natural Language Query</h2>
        <p>Provider: ${provider} | Model: ${model}</p>
    </div>
    
    <div class="section">
        <h3>General Query</h3>
        <textarea id="queryInput" placeholder="Enter your natural language query or question..."></textarea>
        <button onclick="sendQuery()">Send Query</button>
        <div id="queryResponse" class="response hidden"></div>
    </div>

    <div class="section">
        <h3>CLI Command Refinement</h3>
        <p>Refine natural language queries for specific CLI operations</p>
        <select id="commandType">
            <option value="github">GitHub CLI (gh)</option>
            <option value="supabase">Supabase CLI</option>
            <option value="git">Git</option>
            <option value="npm">NPM</option>
        </select>
        <input type="text" id="originalCommand" placeholder="Original command or description..." />
        <textarea id="refinementInput" placeholder="Describe how you want to refine this command..."></textarea>
        <button onclick="refineCommand()">Refine Command</button>
        <div id="refinedResponse" class="response hidden"></div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function sendQuery() {
            const query = document.getElementById('queryInput').value.trim();
            if (!query) return;
            
            vscode.postMessage({
                command: 'sendQuery',
                text: query
            });
            
            document.getElementById('queryResponse').textContent = 'Processing...';
            document.getElementById('queryResponse').classList.remove('hidden');
        }

        function refineCommand() {
            const commandType = document.getElementById('commandType').value;
            const originalCommand = document.getElementById('originalCommand').value.trim();
            const refinement = document.getElementById('refinementInput').value.trim();
            
            if (!originalCommand || !refinement) return;
            
            vscode.postMessage({
                command: 'refineQuery',
                commandType: commandType,
                originalCommand: originalCommand,
                refinement: refinement
            });
            
            document.getElementById('refinedResponse').textContent = 'Refining command...';
            document.getElementById('refinedResponse').classList.remove('hidden');
        }
        
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'receiveResponse':
                    document.getElementById('queryResponse').textContent = message.text;
                    document.getElementById('queryResponse').classList.remove('hidden');
                    break;
                case 'receiveRefinedCommand':
                    document.getElementById('refinedResponse').textContent = 
                        message.commandType.toUpperCase() + ' Command:\\n' + message.text;
                    document.getElementById('refinedResponse').classList.remove('hidden');
                    break;
                case 'error':
                    const errorMsg = 'Error: ' + message.text;
                    document.getElementById('queryResponse').textContent = errorMsg;
                    document.getElementById('refinedResponse').textContent = errorMsg;
                    break;
            }
        });
    </script>
</body>
</html>`;
}

/**
 * Generate HTML for code generation webview
 */
function getCodeGenerationWebviewContent(provider, model, instruction) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Code Generation</title>
    <style>
        body {
            padding: 20px;
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            font-family: var(--vscode-font-family);
        }
        .header {
            padding: 10px 0;
            border-bottom: 1px solid var(--vscode-panel-border);
            margin-bottom: 20px;
        }
        .instruction {
            padding: 10px;
            margin-bottom: 15px;
            background-color: var(--vscode-input-background);
            border-left: 3px solid var(--vscode-textLink-foreground);
        }
        .code-container {
            margin: 15px 0;
            padding: 15px;
            background-color: var(--vscode-textCodeBlock-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            overflow-x: auto;
        }
        pre {
            margin: 0;
            white-space: pre-wrap;
            font-family: var(--vscode-editor-font-family);
        }
        .actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        button {
            padding: 10px 20px;
            border: none;
            cursor: pointer;
            border-radius: 2px;
            font-weight: 500;
        }
        .btn-apply {
            background-color: #28a745;
            color: white;
        }
        .btn-apply:hover {
            background-color: #218838;
        }
        .btn-reject {
            background-color: #dc3545;
            color: white;
        }
        .btn-reject:hover {
            background-color: #c82333;
        }
        .btn-changes {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }
        .btn-changes:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .changes-section {
            margin-top: 15px;
            display: none;
        }
        .changes-section.visible {
            display: block;
        }
        textarea {
            width: 100%;
            min-height: 80px;
            padding: 8px;
            margin: 10px 0;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            font-family: var(--vscode-editor-font-family);
            resize: vertical;
        }
        .loading {
            text-align: center;
            padding: 20px;
            color: var(--vscode-descriptionForeground);
        }
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>AI Code Generation</h2>
        <p>Provider: ${provider} | Model: ${model}</p>
    </div>
    
    <div class="instruction">
        <strong>Instruction:</strong> ${instruction}
    </div>

    <div id="loadingIndicator" class="loading">
        Generating code...
    </div>

    <div id="codeSection" class="hidden">
        <h3>Generated Code:</h3>
        <div class="code-container">
            <pre id="generatedCode"></pre>
        </div>

        <div class="actions">
            <button class="btn-apply" onclick="applyCode()">✓ Apply Code</button>
            <button class="btn-reject" onclick="rejectCode()">✗ Reject</button>
            <button class="btn-changes" onclick="toggleChanges()">↻ Request Changes</button>
        </div>

        <div id="changesSection" class="changes-section">
            <h4>Request Changes:</h4>
            <textarea id="changesInput" placeholder="Describe the changes you'd like to make..."></textarea>
            <button class="btn-changes" onclick="submitChanges()">Submit Changes</button>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let currentCode = '';
        let originalInstruction = '${instruction.replace(/'/g, "\\'")}';
        
        function applyCode() {
            vscode.postMessage({
                command: 'applyCode',
                code: currentCode
            });
        }

        function rejectCode() {
            if (confirm('Are you sure you want to reject this generated code?')) {
                vscode.postMessage({
                    command: 'rejectCode'
                });
            }
        }

        function toggleChanges() {
            const section = document.getElementById('changesSection');
            section.classList.toggle('visible');
        }

        function submitChanges() {
            const changes = document.getElementById('changesInput').value.trim();
            if (!changes) return;
            
            document.getElementById('loadingIndicator').classList.remove('hidden');
            document.getElementById('codeSection').classList.add('hidden');
            
            vscode.postMessage({
                command: 'requestChanges',
                changes: changes,
                currentCode: currentCode,
                originalInstruction: originalInstruction
            });
        }
        
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'codeGenerated':
                    currentCode = message.code;
                    originalInstruction = message.instruction;
                    document.getElementById('generatedCode').textContent = currentCode;
                    document.getElementById('loadingIndicator').classList.add('hidden');
                    document.getElementById('codeSection').classList.remove('hidden');
                    document.getElementById('changesSection').classList.remove('visible');
                    document.getElementById('changesInput').value = '';
                    break;
                case 'error':
                    document.getElementById('loadingIndicator').textContent = 'Error: ' + message.text;
                    break;
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
 * Natural Language Query Command
 * Allows users to send natural language queries to the AI
 */
async function naturalLanguageQueryCommand(context) {
  const panel = vscode.window.createWebviewPanel(
    'aiNaturalLanguage',
    'AI Natural Language Query',
    vscode.ViewColumn.Beside,
    {
      enableScripts: true
    }
  );

  // Load current config
  currentConfig = loadAIConfig();
  const provider = currentConfig ? currentConfig.provider : 'ollama';
  const model = currentConfig ? currentConfig.model : 'codellama';

  panel.webview.html = getNaturalLanguageWebviewContent(provider, model);

  // Handle messages from webview
  panel.webview.onDidReceiveMessage(
    async message => {
      switch (message.command) {
        case 'sendQuery':
          try {
            const routerUrl = getRouterUrl();
            const response = await axios.post(`${routerUrl}/complete`, {
              prompt: message.text,
              context: message.context || ''
            });
            
            panel.webview.postMessage({
              command: 'receiveResponse',
              text: response.data,
              originalQuery: message.text
            });
          } catch (error) {
            panel.webview.postMessage({
              command: 'error',
              text: error.message
            });
          }
          break;
        case 'refineQuery':
          try {
            const routerUrl = getRouterUrl();
            const refinementPrompt = `Refine this ${message.commandType} command: "${message.originalCommand}" to: ${message.refinement}`;
            const response = await axios.post(`${routerUrl}/complete`, {
              prompt: refinementPrompt,
              context: ''
            });
            
            panel.webview.postMessage({
              command: 'receiveRefinedCommand',
              text: response.data,
              commandType: message.commandType
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
 * Generate Code Command
 * Allows users to request, review, and apply AI-generated code
 */
async function generateCodeCommand(context) {
  // Get code generation instruction from user
  const instruction = await vscode.window.showInputBox({
    prompt: 'What code would you like to generate?',
    placeHolder: 'e.g., Create a REST API endpoint for user authentication'
  });

  if (!instruction) {
    return;
  }

  const panel = vscode.window.createWebviewPanel(
    'aiCodeGeneration',
    'AI Code Generation',
    vscode.ViewColumn.Beside,
    {
      enableScripts: true
    }
  );

  // Load current config
  currentConfig = loadAIConfig();
  const provider = currentConfig ? currentConfig.provider : 'ollama';
  const model = currentConfig ? currentConfig.model : 'codellama';

  panel.webview.html = getCodeGenerationWebviewContent(provider, model, instruction);

  // Generate code
  try {
    const routerUrl = getRouterUrl();
    
    // Get current file context if available
    const activeEditor = vscode.window.activeTextEditor;
    const fileContext = activeEditor ? activeEditor.document.getText() : '';
    
    const response = await axios.post(`${routerUrl}/complete`, {
      prompt: `Generate code for the following request:\n${instruction}\n\nCurrent file context:\n${fileContext}`,
      context: fileContext
    });

    panel.webview.postMessage({
      command: 'codeGenerated',
      code: response.data,
      instruction: instruction
    });
  } catch (error) {
    panel.webview.postMessage({
      command: 'error',
      text: error.message
    });
  }

  // Handle messages from webview
  panel.webview.onDidReceiveMessage(
    async message => {
      switch (message.command) {
        case 'applyCode':
          try {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor) {
              const position = activeEditor.selection.active;
              await activeEditor.edit(editBuilder => {
                editBuilder.insert(position, message.code);
              });
              vscode.window.showInformationMessage('Code applied successfully!');
              panel.dispose();
            } else {
              // Create new file
              const doc = await vscode.workspace.openTextDocument({
                content: message.code,
                language: message.language || 'javascript'
              });
              await vscode.window.showTextDocument(doc);
              vscode.window.showInformationMessage('Code opened in new file!');
              panel.dispose();
            }
          } catch (error) {
            vscode.window.showErrorMessage(`Failed to apply code: ${error.message}`);
          }
          break;
        case 'rejectCode':
          vscode.window.showInformationMessage('Code generation rejected');
          panel.dispose();
          break;
        case 'requestChanges':
          try {
            const routerUrl = getRouterUrl();
            const response = await axios.post(`${routerUrl}/complete`, {
              prompt: `Modify the following code based on this feedback:\n\nOriginal request: ${message.originalInstruction}\n\nGenerated code:\n${message.currentCode}\n\nRequested changes: ${message.changes}`,
              context: message.currentCode
            });
            
            panel.webview.postMessage({
              command: 'codeGenerated',
              code: response.data,
              instruction: message.originalInstruction
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
  const naturalLanguageCmd = vscode.commands.registerCommand('ai-coder.naturalLanguageQuery', () => naturalLanguageQueryCommand(context));
  const generateCodeCmd = vscode.commands.registerCommand('ai-coder.generateCode', () => generateCodeCommand(context));

  // Add to subscriptions
  context.subscriptions.push(
    completionProvider, 
    refactorCmd, 
    chatCmd, 
    toggleCmd, 
    selectProviderCmd,
    naturalLanguageCmd,
    generateCodeCmd,
    statusBarItem
  );

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
