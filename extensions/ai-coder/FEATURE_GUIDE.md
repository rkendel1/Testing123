# AI Coder Extension - New Features Guide

## Overview

This guide covers the new features added to the AI Coder extension to enhance your development experience with natural language interaction and AI-generated code management.

## New Features

### 1. Natural Language Query

The Natural Language Query feature allows you to interact with any AI model or provider using natural language, and refine CLI commands for specific operations.

#### How to Use

1. **Open the Natural Language Query Panel**
   - Press `F1` or `Ctrl+Shift+P` (Windows/Linux) / `Cmd+Shift+P` (Mac)
   - Type "AI Coder: Natural Language Query"
   - Press Enter

2. **Send a General Query**
   - In the "General Query" section, type your question or request
   - Examples:
     - "How do I create a REST API in Node.js?"
     - "Explain the difference between let and const in JavaScript"
     - "What's the best way to handle errors in async functions?"
   - Click "Send Query" button
   - The AI response will appear below

3. **Refine CLI Commands**
   - In the "CLI Command Refinement" section:
     - Select the CLI tool from the dropdown (GitHub CLI, Supabase CLI, Git, NPM)
     - Enter your original command or description
     - Describe how you want to refine the command
   - Example workflow:
     - Select: "GitHub CLI (gh)"
     - Original command: "create a pull request"
     - Refinement: "add a detailed description and assign to myself"
   - Click "Refine Command"
   - The refined command will appear below

#### Use Cases

- **Learning**: Ask questions about programming concepts
- **CLI Help**: Get assistance with command-line tools
- **Best Practices**: Ask about coding standards and patterns
- **Troubleshooting**: Get help debugging issues
- **Command Building**: Build complex CLI commands step by step

### 2. AI Code Generation with Review

Generate code using AI and review it before applying to your project. This feature provides full control over AI-generated code with options to apply, reject, or request changes.

#### How to Use

1. **Initiate Code Generation**
   - Press `F1` or `Ctrl+Shift+P` / `Cmd+Shift+P`
   - Type "AI Coder: Generate Code with AI"
   - Press Enter

2. **Enter Your Request**
   - A dialog will appear asking "What code would you like to generate?"
   - Enter your request in natural language
   - Examples:
     - "Create a REST API endpoint for user authentication"
     - "Build a React component for a login form"
     - "Write a function to validate email addresses"
   - Click OK or press Enter

3. **Review the Generated Code**
   - A panel will open showing your request and the generated code
   - The code is displayed with syntax highlighting
   - Review the code carefully

4. **Choose an Action**

   **Option A: Apply Code**
   - Click the green "✓ Apply Code" button
   - If an editor is open: code is inserted at the cursor position
   - If no editor is open: code opens in a new file
   - Success message appears when complete

   **Option B: Reject Code**
   - Click the red "✗ Reject" button
   - A confirmation dialog appears
   - Click OK to dismiss the generated code
   - Panel closes

   **Option C: Request Changes**
   - Click the blue "↻ Request Changes" button
   - A text area appears below the code
   - Enter your feedback or requested changes
   - Examples:
     - "Add error handling for network failures"
     - "Use TypeScript instead of JavaScript"
     - "Add input validation"
     - "Make it more efficient"
   - Click "Submit Changes"
   - AI regenerates the code based on your feedback
   - Review the updated code and repeat

#### Workflow Examples

**Example 1: Creating a Utility Function**
```
1. Run "Generate Code with AI"
2. Request: "Create a function to debounce another function"
3. Review generated code
4. Request Changes: "Add TypeScript types"
5. Review updated code
6. Click "Apply Code"
```

**Example 2: Building a React Component**
```
1. Run "Generate Code with AI"
2. Request: "Create a reusable Button component in React"
3. Review generated code
4. Request Changes: "Add props for variant (primary/secondary) and size"
5. Review updated code
6. Request Changes: "Add hover and active states"
7. Review final code
8. Click "Apply Code"
```

**Example 3: API Integration**
```
1. Run "Generate Code with AI"
2. Request: "Create an axios wrapper for API calls with error handling"
3. Review generated code
4. Click "Apply Code" if satisfied, or
5. Request Changes: "Add retry logic for failed requests"
6. Click "Apply Code"
```

#### Best Practices

1. **Be Specific**: Provide detailed requirements in your initial request
2. **Review Carefully**: Always review generated code before applying
3. **Iterate**: Use "Request Changes" to refine the code
4. **Test Generated Code**: Test the code after applying it
5. **Combine with Refactoring**: Use AI Refactor to improve applied code

### 3. Enhanced Provider Support

All new features work seamlessly with all supported AI providers:
- Ollama (local)
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- Mistral AI
- Together AI
- Aider

#### Switching Providers

1. Press `F1` and type "AI Coder: Select Provider"
2. Choose your preferred provider from the list
3. All features immediately use the new provider
4. No restart required

## Integration with Existing Features

### Combining Features for Better Results

#### Workflow 1: Generate + Refactor
```
1. Generate code with "Generate Code with AI"
2. Apply the code
3. Select the applied code
4. Run "AI Coder: Refactor with AI"
5. Refine with natural language instruction
```

#### Workflow 2: Chat + Generate
```
1. Use "AI Coder: Open Chat" to discuss approach
2. Ask questions about best practices
3. Use "Generate Code with AI" with the learned approach
4. Apply and test the code
```

#### Workflow 3: Query + Generate
```
1. Use "Natural Language Query" to learn about a concept
2. Use the CLI refinement to build a command
3. Generate supporting code with "Generate Code with AI"
```

## Keyboard Shortcuts (Recommended)

You can add custom keyboard shortcuts for the new features:

1. Open Keyboard Shortcuts: `File > Preferences > Keyboard Shortcuts`
2. Search for "AI Coder"
3. Click the "+" icon to add a shortcut

Suggested shortcuts:
- Natural Language Query: `Ctrl+Alt+Q` (Windows/Linux) / `Cmd+Alt+Q` (Mac)
- Generate Code: `Ctrl+Alt+G` (Windows/Linux) / `Cmd+Alt+G` (Mac)

## Tips and Tricks

### Natural Language Queries

1. **Be Conversational**: Write queries as if talking to a colleague
2. **Provide Context**: Mention your tech stack or constraints
3. **Ask Follow-ups**: Build on previous queries for deeper understanding
4. **Use for Learning**: Great for understanding new concepts

### Code Generation

1. **Start Simple**: Begin with basic requirements, iterate for complexity
2. **Specify Language**: Mention the programming language explicitly
3. **Include Examples**: Reference similar code you want to emulate
4. **Request Documentation**: Ask for comments and documentation in code
5. **Ask for Tests**: Request unit tests along with implementation

### CLI Command Refinement

1. **Start with Intent**: Describe what you want to do
2. **Build Incrementally**: Start simple, add options progressively
3. **Learn as You Go**: Use this to learn CLI tool capabilities
4. **Save Commands**: Copy refined commands for future reference

## Troubleshooting

### Issue: "AI Router not available"
**Solution**: 
1. Ensure AI Router is running on port 3000
2. Check `aiCoder.routerUrl` setting
3. Verify network connectivity

### Issue: "Provider not responding"
**Solution**:
1. Check your API key in `.aistudio/config.json`
2. Verify internet connection for cloud providers
3. For Ollama, ensure it's running locally
4. Try switching to a different provider

### Issue: Generated code has errors
**Solution**:
1. Use "Request Changes" to specify the issue
2. Provide more context in your original request
3. Review and manually fix small issues
4. Try with a different AI provider

### Issue: Webview not appearing
**Solution**:
1. Check if it's hidden behind other windows
2. Close and reopen the command
3. Reload VS Code window (`Ctrl+R` / `Cmd+R`)

## Feature Comparison

| Feature | Natural Language Query | AI Chat | Code Generation |
|---------|----------------------|---------|-----------------|
| Purpose | Quick questions & CLI help | Conversation & exploration | Code creation |
| Output | Text response | Ongoing conversation | Executable code |
| Interaction | One-shot or refinement | Multi-turn chat | Review workflow |
| Best For | Learning, CLI building | Discussion, planning | Implementation |

## Configuration

### Extension Settings

Located in VS Code Settings or `.vscode/settings.json`:

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
    "openai": "your-api-key",
    "anthropic": "your-api-key"
  }
}
```

## Privacy and Security

- **Local First**: Default setup uses Ollama (local AI)
- **No Telemetry**: Extension doesn't collect usage data
- **API Keys**: Stored locally, never transmitted except to providers
- **Code Privacy**: Your code stays on your machine or goes only to chosen provider
- **Network**: Only communicates with AI Router (localhost) and chosen AI provider

## Getting Help

1. **Documentation**: Read extension README and project docs
2. **Examples**: Check workspace examples directory
3. **AI Chat**: Use the AI Chat feature to ask questions
4. **Issues**: Report bugs on GitHub repository

## What's Next

Upcoming features planned:
- Multi-file code generation
- Code snippets library
- Diff view for generated changes
- Command history
- Saved templates
- Team collaboration features

## Feedback

We welcome your feedback! Please:
- Report bugs via GitHub Issues
- Suggest features via GitHub Discussions
- Share your use cases and workflows
- Contribute improvements via Pull Requests

---

**Happy Coding with AI! 🤖**
