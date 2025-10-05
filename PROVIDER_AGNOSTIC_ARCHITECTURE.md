# Provider-Agnostic Natural Language Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         VS Code Extension                        │
│                      (extensions/ai-coder)                       │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ User enters natural language query
                 │ (e.g., "Generate a function to calculate tax")
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              Natural Language Query Command                      │
│  - naturalLanguageQueryCommand()                                 │
│  - generateCodeCommand()                                         │
│  - No provider-specific logic                                    │
│  - Uses unified interface                                        │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ HTTP POST to /complete
                 │ { prompt: "...", context: "..." }
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        AI Router Server                          │
│                      (ai-router/server.js)                       │
│                      http://localhost:3000                       │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ Read config.json to determine provider
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Configuration File                          │
│              /workspace/.aistudio/config.json                    │
│  {                                                                │
│    "provider": "ollama" or "openai" or "anthropic" etc.         │
│    "model": "codellama" or "gpt-4" or "claude-3" etc.           │
│    "apiKeys": { ... }                                            │
│  }                                                                │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ Route based on provider
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Provider Routing Logic                        │
│                                                                   │
│  switch (config.provider.toLowerCase()) {                        │
│    case 'ollama':   -> routeToOllama()                          │
│    case 'openai':   -> routeToOpenAI()                          │
│    case 'anthropic': -> routeToAnthropic()                      │
│    case 'mistral':  -> routeToMistral()                         │
│    case 'together': -> routeToTogether()                        │
│    case 'aider':    -> routeToAider()                           │
│  }                                                                │
└───┬───────┬──────────┬─────────┬──────────┬─────────────────────┘
    │       │          │         │          │
    ▼       ▼          ▼         ▼          ▼
┌────────┬────────┬────────┬────────┬────────┬────────────────────┐
│Ollama  │OpenAI  │Anthropic│Mistral │Together│     Aider          │
│        │        │         │        │        │                    │
│Local   │GPT-4   │Claude   │Mistral │Open    │Pair Programming   │
│Models  │GPT-3.5 │Models   │Models  │Source  │Assistant           │
│        │        │         │        │Models  │                    │
│Port    │API     │API      │API     │API     │API                │
│11434   │Endpoint│Endpoint │Endpoint│Endpoint│Endpoint            │
└────────┴────────┴─────────┴────────┴────────┴────────────────────┘
    │       │          │         │          │          │
    └───────┴──────────┴─────────┴──────────┴──────────┘
                         │
                         │ Response (normalized format)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        AI Router Server                          │
│                   (Normalize & Return Response)                  │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ HTTP Response
                 │ { data: "...", provider: "...", model: "..." }
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VS Code Extension                           │
│                    (Display in Webview)                          │
│                                                                   │
│  ┌─────────────────────────────────────────────────────┐        │
│  │ AI Natural Language Query                           │        │
│  │ Current Provider: ollama | Model: codellama         │        │
│  │ This interface works seamlessly with all providers  │        │
│  ├─────────────────────────────────────────────────────┤        │
│  │ Query: Generate a function to calculate tax         │        │
│  │ [Send Query]                                         │        │
│  ├─────────────────────────────────────────────────────┤        │
│  │ Response:                                            │        │
│  │ function calculateTax(amount, rate) {                │        │
│  │   return amount * (rate / 100);                      │        │
│  │ }                                                     │        │
│  │                                                       │        │
│  │ Response from provider: ollama                       │        │
│  └─────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

## Key Architectural Features

### 1. Abstraction Layer (AI Router)
- **Purpose**: Hide provider-specific API differences
- **Benefit**: Extension code stays provider-agnostic
- **Result**: Same code works with all providers

### 2. Configuration-Based Routing
- **File**: `/workspace/.aistudio/config.json`
- **What it does**: Tells router which provider to use
- **How to change**: Use `AI Coder: Select Provider` command
- **Effect**: Instant provider switching, no code changes

### 3. Unified Interface
- **Endpoint**: `/complete` for all providers
- **Request Format**: Same for all providers
  ```json
  {
    "prompt": "Natural language query",
    "context": "Optional context"
  }
  ```
- **Response Format**: Normalized across providers

### 4. Provider-Specific Routing Functions

Each provider has a dedicated routing function that handles its specific API:

```javascript
// Ollama - Local model
routeToOllama(prompt, model, stream)
  -> POST http://localhost:11434/api/generate

// OpenAI - Cloud API
routeToOpenAI(prompt, model, apiKey, stream)
  -> POST https://api.openai.com/v1/chat/completions
  -> Headers: Authorization: Bearer {apiKey}

// Anthropic - Cloud API
routeToAnthropic(prompt, model, apiKey, stream)
  -> POST https://api.anthropic.com/v1/messages
  -> Headers: x-api-key: {apiKey}

// Mistral - Cloud API
routeToMistral(prompt, model, apiKey, stream)
  -> POST https://api.mistral.ai/v1/chat/completions
  -> Headers: Authorization: Bearer {apiKey}

// Together AI - Cloud API
routeToTogether(prompt, model, apiKey, stream)
  -> POST https://api.together.xyz/v1/chat/completions
  -> Headers: Authorization: Bearer {apiKey}

// Aider - OpenAI-compatible API
routeToAider(prompt, model, apiKey, stream)
  -> POST https://api.aider.chat/v1/chat/completions
  -> Headers: Authorization: Bearer {apiKey}
```

## Data Flow Example

### Scenario: User generates tax calculation function with different providers

#### Step 1: User Input (Same for all providers)
```
Command: AI Coder: Natural Language Query
Input: "Generate a function to calculate tax"
```

#### Step 2: Extension Processing (Same for all providers)
```javascript
// In naturalLanguageQueryCommand()
const response = await axios.post(`${routerUrl}/complete`, {
  prompt: "Generate a function to calculate tax",
  context: ""
});
```

#### Step 3: Router Processing

**With Ollama**:
```javascript
// config.provider = 'ollama'
case 'ollama':
  providerResponse = await routeToOllama(
    "Generate a function to calculate tax",
    "codellama",
    true
  );
  // -> POST to http://localhost:11434/api/generate
```

**With OpenAI**:
```javascript
// config.provider = 'openai'
case 'openai':
  providerResponse = await routeToOpenAI(
    "Generate a function to calculate tax",
    "gpt-4",
    apiKey,
    true
  );
  // -> POST to https://api.openai.com/v1/chat/completions
```

**With Anthropic**:
```javascript
// config.provider = 'anthropic'
case 'anthropic':
  providerResponse = await routeToAnthropic(
    "Generate a function to calculate tax",
    "claude-3-opus",
    apiKey,
    true
  );
  // -> POST to https://api.anthropic.com/v1/messages
```

#### Step 4: Response Display (Same for all providers)
```javascript
// Extension receives response and displays it
panel.webview.postMessage({
  command: 'receiveResponse',
  text: response.data,
  originalQuery: "Generate a function to calculate tax",
  provider: currentProvider // Shows which provider responded
});
```

## Provider Switching Flow

```
User Action: AI Coder: Select Provider
                    ↓
            Choose "anthropic"
                    ↓
    Update /workspace/.aistudio/config.json
                    ↓
         {"provider": "anthropic", ...}
                    ↓
            Status Bar Updates
                    ↓
      "🤖 AI: anthropic/claude-3"
                    ↓
    Next query uses Anthropic
                    ↓
      (No code changes needed!)
```

## Benefits of This Architecture

### For Users:
✅ **Learn Once**: Same commands for all providers
✅ **Switch Freely**: Change providers anytime
✅ **Compare Easily**: Test same query with different providers
✅ **Optimize Costs**: Use free local or paid cloud as needed

### For Developers:
✅ **Simple Extension Code**: No provider-specific logic
✅ **Easy to Extend**: Add new providers to router only
✅ **Maintainable**: Changes in one place (router)
✅ **Testable**: Clear separation of concerns

### For the System:
✅ **Scalable**: Add providers without touching extension
✅ **Reliable**: Provider failures isolated
✅ **Flexible**: Different providers for different tasks
✅ **Cacheable**: Responses cached at router level

## Summary

The architecture ensures that:
1. **Users** never need to know provider-specific details
2. **Extension code** remains provider-agnostic
3. **AI Router** handles all provider complexity
4. **Natural language** works uniformly everywhere
5. **Provider switching** is seamless and instant

This is true provider-agnostic design: write your natural language query once, use it with any provider, switch providers freely, all through the same unified interface.
