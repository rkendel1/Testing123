# Natural Language Interface - Quick Reference

## 🚀 Quick Start

### Use Natural Language with ANY Provider

```
1. Open VS Code
2. Press F1
3. Type "AI Coder: Natural Language Query"
4. Enter your query in plain English
5. Get response from your configured provider
```

**No provider-specific syntax needed!**

---

## 📝 Common Queries (Work with ALL Providers)

### Code Generation
```
"Generate a function to calculate tax"
"Create a REST API endpoint for user authentication"
"Write a function to validate email addresses"
"Generate unit tests for this function"
```

### Explanations
```
"Explain how async/await works in JavaScript"
"What is the difference between var, let, and const?"
"How does the event loop work in Node.js?"
"Explain database indexing with examples"
```

### Code Review
```
"Review this code for security vulnerabilities"
"Suggest improvements to this function"
"Find potential bugs in this implementation"
"Optimize this code for better performance"
```

---

## 🔄 Switch Providers Instantly

```
Current: Ollama (local, free)
         ↓
Run: AI Coder: Select Provider
         ↓
Choose: OpenAI (cloud, GPT-4)
         ↓
Same queries, different provider!
```

**Status bar shows**: 🤖 AI: openai/gpt-4

---

## 🎯 Commands

| Command | Shortcut | Purpose |
|---------|----------|---------|
| `AI Coder: Natural Language Query` | F1 | Send queries to AI |
| `AI Coder: Generate Code with AI` | F1 | Generate & apply code |
| `AI Coder: Select Provider` | F1 | Switch AI provider |
| `AI Coder: Toggle Autocomplete` | Status bar | Enable/disable autocomplete |

---

## 🌟 Supported Providers

| Provider | Type | API Key? | Cost |
|----------|------|----------|------|
| **Ollama** | Local | ❌ No | Free |
| **OpenAI** | Cloud | ✅ Yes | Paid |
| **Anthropic** | Cloud | ✅ Yes | Paid |
| **Mistral** | Cloud | ✅ Yes | Paid |
| **Together AI** | Cloud | ✅ Yes | Paid |
| **Aider** | Cloud | ✅ Yes | Paid |

---

## 💡 Example Workflow

### Scenario: Generate Tax Function

**1. With Ollama (free)**
```
> AI Coder: Select Provider → ollama
> AI Coder: Natural Language Query
> "Generate a function to calculate tax"
✓ Get response from Ollama
```

**2. Compare with OpenAI**
```
> AI Coder: Select Provider → openai
> AI Coder: Natural Language Query
> "Generate a function to calculate tax" (same query!)
✓ Get response from GPT-4
✓ Compare both versions
```

**3. Apply Best Result**
```
> Choose the version you prefer
> Apply to your code
```

---

## 🎨 Features

✅ **Provider Agnostic**: Same queries work everywhere
✅ **Instant Switching**: Change providers in seconds
✅ **Visual Feedback**: See which provider is active
✅ **Error Handling**: Clear messages if something fails
✅ **30s Timeout**: Handles complex queries
✅ **Context Aware**: Uses current file for better results

---

## 📚 Need More Info?

| Document | What's Inside |
|----------|---------------|
| `README.md` | Complete feature guide |
| `PROVIDER_EXAMPLES.md` | 5 detailed examples |
| `NATURAL_LANGUAGE_TEST_GUIDE.md` | Testing procedures |
| `PROVIDER_AGNOSTIC_ARCHITECTURE.md` | How it works |

---

## 🐛 Troubleshooting

### Query Not Working?

1. **Check AI Router is running**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Check provider in status bar**
   - Should show: 🤖 AI: provider/model

3. **Check API key** (for cloud providers)
   - Edit `/workspace/.aistudio/config.json`
   - Verify API key is set

4. **Check error message**
   - Extension provides helpful error messages
   - Follow the guidance provided

### Want to Switch Providers?

```
F1 → AI Coder: Select Provider → Choose provider
```

That's it! No config edits needed.

---

## ⚡ Pro Tips

1. **Use Ollama for quick tests** (free, fast)
2. **Use OpenAI/Claude for complex tasks** (better quality)
3. **Compare outputs** from multiple providers
4. **Same query works everywhere** - no syntax changes
5. **Status bar shows active provider** - click to toggle autocomplete

---

## 🎯 Remember

**The Magic**: Write your query in plain English once, use it with ANY provider!

```
One Query → Six Providers → Choose Best Result
```

No provider-specific syntax. No code changes. Just natural language.

---

## 🚀 Get Started Now

1. Press `F1`
2. Type "AI Coder: Natural Language Query"
3. Enter: "Generate a function to calculate tax"
4. See it work with your current provider
5. Switch providers and try again!

**It's that simple!**
