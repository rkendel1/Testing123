# Provider-Agnostic Natural Language Examples

This document demonstrates how the same natural language queries work uniformly across all supported AI providers.

## Overview

The AI Coder extension's natural language interface allows you to use the **exact same queries** with any configured provider. No need to learn provider-specific syntax or commands.

## Example 1: Simple Code Generation

### The Query (works with ALL providers):
```
"Generate a function to calculate tax"
```

### With Ollama:
1. Run `AI Coder: Select Provider` → Choose `ollama`
2. Run `AI Coder: Natural Language Query`
3. Enter: "Generate a function to calculate tax"
4. ✅ Get response from Ollama

### With OpenAI:
1. Run `AI Coder: Select Provider` → Choose `openai`
2. Run `AI Coder: Natural Language Query`
3. Enter: "Generate a function to calculate tax" *(same query)*
4. ✅ Get response from OpenAI

### With Anthropic Claude:
1. Run `AI Coder: Select Provider` → Choose `anthropic`
2. Run `AI Coder: Natural Language Query`
3. Enter: "Generate a function to calculate tax" *(same query)*
4. ✅ Get response from Claude

### With Mistral:
1. Run `AI Coder: Select Provider` → Choose `mistral`
2. Run `AI Coder: Natural Language Query`
3. Enter: "Generate a function to calculate tax" *(same query)*
4. ✅ Get response from Mistral

### With Together AI:
1. Run `AI Coder: Select Provider` → Choose `together`
2. Run `AI Coder: Natural Language Query`
3. Enter: "Generate a function to calculate tax" *(same query)*
4. ✅ Get response from Together AI

### With Aider:
1. Run `AI Coder: Select Provider` → Choose `aider`
2. Run `AI Coder: Natural Language Query`
3. Enter: "Generate a function to calculate tax" *(same query)*
4. ✅ Get response from Aider

## Example 2: Complex Code Generation

### The Query (works with ALL providers):
```
"Create a REST API endpoint for user authentication with JWT tokens and bcrypt password hashing"
```

### Process:
1. Select any provider using `AI Coder: Select Provider`
2. Run `AI Coder: Generate Code with AI`
3. Enter the query above
4. Review generated code
5. Apply, reject, or request changes
6. Switch to different provider and compare results!

**No provider-specific syntax needed** - the same natural language works everywhere.

## Example 3: Explanations and Questions

### The Query (works with ALL providers):
```
"Explain how async/await works in JavaScript with examples"
```

### Process:
1. Select any provider
2. Run `AI Coder: Natural Language Query`
3. Enter the query
4. Get detailed explanation from your chosen provider

**Try with multiple providers** to compare explanations and find the one that works best for you!

## Example 4: CLI Command Refinement

### The Query (works with ALL providers):

**Command Type**: GitHub CLI (gh)
**Original**: "create pull request"
**Refinement**: "with title 'Fix login bug' targeting main branch"

### Process:
1. Select any provider
2. Run `AI Coder: Natural Language Query`
3. Go to "CLI Command Refinement" section
4. Select "GitHub CLI (gh)"
5. Enter original command and refinement
6. Get refined command from any provider

## Example 5: Testing Multiple Providers

### The Query:
```
"Write a Python function to parse CSV files with error handling"
```

### Workflow - Compare Providers:
1. **Test with Ollama** (free, local):
   - Select `ollama` provider
   - Generate code
   - Review output

2. **Test with OpenAI GPT-4** (cloud, paid):
   - Select `openai` provider
   - Use **exact same query**
   - Generate code
   - Compare with Ollama output

3. **Test with Anthropic Claude** (cloud, paid):
   - Select `anthropic` provider
   - Use **exact same query**
   - Generate code
   - Compare with previous outputs

4. **Choose the best result** and apply it!

## Key Benefits

✅ **One Interface, All Providers**: Learn once, use everywhere
✅ **No Provider Lock-in**: Switch providers freely
✅ **Compare Outputs**: Test the same query with multiple providers
✅ **Flexible Workflow**: Choose the best provider for each task
✅ **Cost Optimization**: Use free local models (Ollama) for simple tasks, paid cloud models for complex ones

## Common Use Cases

### Use Case 1: Development
- Use **Ollama** for quick, simple queries during development
- Use **OpenAI/Anthropic** for complex problems requiring advanced reasoning

### Use Case 2: Learning
- Ask the **same question** to multiple providers
- Compare explanations to get different perspectives
- Find which provider's teaching style works best for you

### Use Case 3: Code Quality
- Generate code with one provider
- Ask another provider to review it
- Compare implementations across providers

### Use Case 4: Cost Management
- Use **Ollama** (free) as primary provider
- Fall back to **OpenAI/Anthropic** for complex queries
- All with the same natural language interface!

## Sample Queries That Work Everywhere

### Code Generation:
- "Generate a function to validate email addresses"
- "Create a React component for a login form"
- "Write a SQL query to join users and orders tables"
- "Generate unit tests for this function"

### Explanations:
- "Explain how closures work in JavaScript"
- "What is the difference between var, let, and const?"
- "How does the event loop work in Node.js?"
- "Explain database indexing with examples"

### Code Review:
- "Review this code for security vulnerabilities"
- "Suggest improvements to this function"
- "Find potential bugs in this implementation"
- "Optimize this code for better performance"

### Refactoring:
- "Extract this code into a reusable function"
- "Add error handling to this code"
- "Convert this callback to async/await"
- "Add TypeScript types to this JavaScript code"

## Remember

**The magic of the natural language interface**: You write your query once in plain English, and it works with **any** provider. No special syntax, no provider-specific commands, just natural language.

Switch providers freely to:
- Compare outputs
- Optimize costs
- Find the best solution
- Learn different approaches
- Handle provider downtime

All while using the **exact same interface and queries**!
