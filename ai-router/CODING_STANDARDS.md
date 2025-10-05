# AI Router - Coding Standards

## JavaScript Style Guide

### General Principles
- Follow ES6+ standards
- Use `const` and `let` instead of `var`
- Prefer arrow functions for callbacks
- Use async/await over callbacks for asynchronous operations
- Keep functions small and focused on a single responsibility

### Code Formatting
- **Indentation**: 2 spaces (no tabs)
- **Line Length**: Maximum 100 characters
- **Semicolons**: Always use semicolons
- **Quotes**: Single quotes for strings, except in JSON
- **Trailing Commas**: Use trailing commas in multi-line arrays and objects

### Naming Conventions
- **Variables/Functions**: camelCase (e.g., `routeToOpenAI`, `loadConfig`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_CACHE_SIZE`, `DEFAULT_PORT`)
- **Classes**: PascalCase (e.g., `CacheManager`, `RouterService`)
- **Files**: kebab-case (e.g., `cache-manager.js`, `route-handler.js`)

### Function Structure
```javascript
/**
 * Brief description of what the function does
 * @param {Type} paramName - Description of parameter
 * @returns {Type} Description of return value
 */
async function functionName(paramName) {
  // Implementation
}
```

### Error Handling
- Always use try-catch blocks for async operations
- Provide meaningful error messages
- Log errors with context information
- Return appropriate HTTP status codes

```javascript
try {
  const result = await someAsyncOperation();
  return result;
} catch (error) {
  console.error('[Context] Error:', error.message);
  throw new Error(`Operation failed: ${error.message}`);
}
```

### Comments
- Use JSDoc comments for all exported functions
- Add inline comments for complex logic
- Keep comments up-to-date with code changes
- Explain "why" not "what" when commenting

### API Design
- Use RESTful conventions
- Version API endpoints when making breaking changes
- Return consistent response formats
- Include proper HTTP status codes
- Document all endpoints

### Testing
- Write unit tests for all utility functions
- Test edge cases and error conditions
- Use descriptive test names
- Maintain test coverage above 80%

### Security
- Validate all user inputs
- Sanitize data before processing
- Never log sensitive information (API keys, tokens)
- Use environment variables for configuration
- Implement rate limiting for API endpoints

### Performance
- Cache responses when appropriate
- Use streaming for large responses
- Optimize database queries
- Monitor memory usage
- Profile performance bottlenecks

## Git Commit Messages
- Use imperative mood ("Add feature" not "Added feature")
- Keep first line under 50 characters
- Provide detailed description in body if needed
- Reference issue numbers when applicable

## Code Review Checklist
- [ ] Code follows style guide
- [ ] Functions have proper documentation
- [ ] Error handling is implemented
- [ ] Tests are included
- [ ] No console.log statements in production code
- [ ] Security best practices followed
- [ ] Performance considerations addressed
