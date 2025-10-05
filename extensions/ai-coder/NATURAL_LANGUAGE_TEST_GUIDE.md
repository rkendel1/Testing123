# Natural Language Interface Test Guide

This guide provides test scenarios to validate that the natural language interface works uniformly across all supported AI providers.

## Test Environment Setup

### Prerequisites
1. VS Code with AI Coder extension installed
2. AI Router running on `http://localhost:3000`
3. Configuration file at `/workspace/.aistudio/config.json`
4. API keys configured for providers you want to test (optional for Ollama)

### Supported Providers
- Ollama (local, no API key required)
- OpenAI (requires API key)
- Anthropic (requires API key)
- Mistral (requires API key)
- Together AI (requires API key)
- Aider (requires API key)

## Test Scenarios

### Test 1: Basic Natural Language Query

**Objective**: Verify that natural language queries work across all providers

**Steps for Each Provider**:

1. **Configure Provider**:
   - Run `AI Coder: Select Provider`
   - Choose provider (e.g., `ollama`, `openai`, `anthropic`, etc.)
   - Verify status bar shows: `🤖 AI: <provider>/<model>`

2. **Execute Natural Language Query**:
   - Run `AI Coder: Natural Language Query`
   - Verify panel shows current provider and model
   - Enter query: "Generate a function to calculate tax"
   - Click "Send Query"

3. **Verify Response**:
   - ✅ Response is received within reasonable time (< 30 seconds)
   - ✅ Response contains code or explanation
   - ✅ Provider information is displayed below response
   - ✅ No error messages appear

4. **Repeat for All Providers**:
   - Ollama: Expected to work if running locally
   - OpenAI: Expected to work with valid API key
   - Anthropic: Expected to work with valid API key
   - Mistral: Expected to work with valid API key
   - Together: Expected to work with valid API key
   - Aider: Expected to work with valid API key

### Test 2: Code Generation Across Providers

**Objective**: Verify that code generation produces valid results from all providers

**Test Queries**:
1. "Generate a function to calculate tax"
2. "Create a REST API endpoint for user authentication"
3. "Write a function to validate email addresses"
4. "Generate a React component for a login form"

**Steps for Each Provider**:

1. Configure provider using `AI Coder: Select Provider`
2. Run `AI Coder: Generate Code with AI`
3. Enter one of the test queries above
4. Verify:
   - ✅ Code is generated successfully
   - ✅ Code is syntactically valid
   - ✅ Code is relevant to the request
   - ✅ Provider information is shown in the UI
   - ✅ Can apply, reject, or request changes to the code

### Test 3: CLI Command Refinement

**Objective**: Verify CLI command refinement works across providers

**Test Cases**:

**GitHub CLI Test**:
1. Select provider
2. Run `AI Coder: Natural Language Query`
3. Select "GitHub CLI (gh)" from dropdown
4. Original command: "create a pull request"
5. Refinement: "with title 'Fix bug' and base branch 'main'"
6. Verify refined command is appropriate for GitHub CLI

**Git Command Test**:
1. Select provider
2. Run `AI Coder: Natural Language Query`
3. Select "Git" from dropdown
4. Original command: "commit changes"
5. Refinement: "with message 'Update documentation'"
6. Verify refined command is a valid git command

**Repeat for Each Provider**: Ollama, OpenAI, Anthropic, Mistral, Together, Aider

### Test 4: Provider Switching Without Query Changes

**Objective**: Verify that the same query works across different providers without modification

**Steps**:

1. **Test with Ollama**:
   - Select Ollama provider
   - Run `AI Coder: Natural Language Query`
   - Enter: "Explain how async/await works in JavaScript"
   - Note the response

2. **Test with OpenAI** (same query):
   - Select OpenAI provider
   - Run `AI Coder: Natural Language Query`
   - Enter: "Explain how async/await works in JavaScript" (identical query)
   - Verify response is received successfully

3. **Test with Anthropic** (same query):
   - Select Anthropic provider
   - Run `AI Coder: Natural Language Query`
   - Enter: "Explain how async/await works in JavaScript" (identical query)
   - Verify response is received successfully

4. **Verify**:
   - ✅ Same query works across all providers
   - ✅ No provider-specific syntax required
   - ✅ Interface remains consistent
   - ✅ Provider switching is seamless

### Test 5: Error Handling

**Objective**: Verify proper error handling across providers

**Test Cases**:

1. **Invalid API Key**:
   - Configure provider with invalid API key
   - Run `AI Coder: Natural Language Query`
   - Enter any query
   - Verify: Clear error message is displayed

2. **Router Not Running**:
   - Stop AI Router service
   - Run `AI Coder: Natural Language Query`
   - Enter any query
   - Verify: Connection error is displayed with helpful message

3. **Empty Query**:
   - Run `AI Coder: Natural Language Query`
   - Click "Send Query" without entering text
   - Verify: Nothing happens or friendly message shown

### Test 6: Complex Queries

**Objective**: Test complex, multi-part natural language queries

**Test Queries**:

1. "Create a Node.js Express server with authentication, rate limiting, and error handling middleware"
2. "Generate a Python function to parse CSV files, validate data types, and handle missing values"
3. "Write a SQL query to join three tables and aggregate results by date"
4. "Create a TypeScript interface for a user profile with nested objects and optional fields"

**Steps**:
- Test each query with at least 2 different providers
- Verify responses are comprehensive and relevant
- Verify no timeout errors for complex queries (30-second timeout should be sufficient)

## Test Results Template

### Provider: [Provider Name]

| Test | Status | Notes |
|------|--------|-------|
| Basic Natural Language Query | ✅/❌ | |
| Code Generation | ✅/❌ | |
| CLI Command Refinement | ✅/❌ | |
| Provider Switching | ✅/❌ | |
| Error Handling | ✅/❌ | |
| Complex Queries | ✅/❌ | |

**Overall Assessment**: PASS / FAIL

**Issues Found**: [List any issues]

**Recommendations**: [Any recommendations]

## Expected Results

### All Providers Should:
- ✅ Accept natural language queries without provider-specific syntax
- ✅ Return relevant, useful responses
- ✅ Display provider information in the UI
- ✅ Handle errors gracefully with clear messages
- ✅ Support the same query format across all providers
- ✅ Complete requests within timeout period (30 seconds)
- ✅ Allow seamless switching between providers

### Provider-Specific Considerations

**Ollama**:
- Runs locally, no API key needed
- Response time depends on local hardware
- Model must be pulled/installed locally

**OpenAI**:
- Requires valid API key
- Response time typically 2-10 seconds
- Supports multiple models (GPT-3.5, GPT-4, etc.)

**Anthropic**:
- Requires valid API key
- Response time typically 2-10 seconds
- Supports Claude models

**Mistral**:
- Requires valid API key
- Response time varies
- Supports Mistral models

**Together AI**:
- Requires valid API key
- Response time varies
- Supports multiple open-source models

**Aider**:
- Requires valid API key
- Uses OpenAI-compatible API
- Specialized for pair programming

## Validation Checklist

Before marking the natural language interface as complete:

- [ ] All 6 test scenarios completed
- [ ] At least 3 different providers tested successfully
- [ ] Documentation updated with provider-agnostic examples
- [ ] Error handling verified for common failure scenarios
- [ ] UI clearly indicates current provider
- [ ] Same queries work across multiple providers without modification
- [ ] Provider switching is seamless
- [ ] Timeout handling works correctly
- [ ] Complex queries are supported

## Notes

- The natural language interface is designed to be provider-agnostic
- The AI Router handles provider-specific API differences
- Users should never need to know provider-specific syntax
- The same natural language query should work uniformly across all providers
- Provider switching should not require any changes to user queries or workflow
