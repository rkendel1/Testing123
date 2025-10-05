# Preview App - Coding Standards

## React & JavaScript Style Guide

### General Principles
- Follow React best practices and hooks patterns
- Use functional components with hooks (no class components)
- Keep components small and focused
- Use TypeScript or JSDoc for type safety
- Follow ES6+ standards

### Code Formatting
- **Indentation**: 2 spaces (no tabs)
- **Line Length**: Maximum 100 characters
- **Semicolons**: Always use semicolons
- **Quotes**: Single quotes for JS, double quotes for JSX attributes
- **Trailing Commas**: Use trailing commas in multi-line arrays and objects

### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile`, `NavBar`)
- **Files**: PascalCase for components (e.g., `UserProfile.jsx`)
- **Variables/Functions**: camelCase (e.g., `handleClick`, `userData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_USERS`, `API_URL`)
- **CSS Classes**: kebab-case or BEM notation
- **Hooks**: Start with "use" (e.g., `useAuth`, `useFetch`)

### Component Structure
```jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Brief description of component
 * @param {Object} props - Component props
 * @param {string} props.title - Title to display
 */
function ComponentName({ title, children }) {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  const handleEvent = () => {
    // Event handler
  };

  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
}

ComponentName.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node
};

export default ComponentName;
```

### React Best Practices

#### Hooks Rules
- Only call hooks at the top level
- Only call hooks from React functions
- Use dependency arrays correctly in useEffect
- Custom hooks for reusable logic

#### State Management
- Keep state as local as possible
- Lift state up when needed by multiple components
- Use Context API for global state
- Consider Redux/Zustand for complex state

#### Props
- Destructure props in function signature
- Use prop-types or TypeScript for validation
- Keep props minimal and focused
- Use children prop for composition

#### Performance
- Use React.memo() for expensive components
- Use useMemo() for expensive calculations
- Use useCallback() for function props
- Avoid inline function definitions in render
- Use keys properly in lists

### JSX Guidelines
- Self-close tags when no children
- One prop per line for multiple props
- Use fragments `<>` instead of unnecessary divs
- Keep JSX readable and well-formatted

```jsx
// Good
<Button
  onClick={handleClick}
  disabled={isLoading}
  variant="primary"
>
  Submit
</Button>

// Avoid
<Button onClick={handleClick} disabled={isLoading} variant="primary">Submit</Button>
```

### CSS/Styling
- Use CSS modules or styled-components
- Follow BEM naming for vanilla CSS
- Keep styles modular and component-scoped
- Use CSS variables for theming
- Avoid inline styles unless dynamic

### File Organization
```
src/
├── components/        # Reusable components
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.module.css
│   │   └── Button.test.jsx
│   └── ...
├── pages/            # Page components
├── hooks/            # Custom hooks
├── utils/            # Utility functions
├── services/         # API services
├── context/          # React context
├── assets/           # Images, fonts, etc.
└── App.jsx           # Main app component
```

### Error Handling
- Use Error Boundaries for component errors
- Handle async errors with try-catch
- Provide user-friendly error messages
- Log errors for debugging

```jsx
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  console.error('Failed to fetch data:', error);
  setError('Unable to load data. Please try again.');
}
```

### Testing
- Write tests for all components
- Test user interactions
- Test edge cases
- Use React Testing Library
- Aim for 80%+ coverage

### Accessibility
- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation
- Test with screen readers
- Maintain color contrast ratios

### Comments & Documentation
- Use JSDoc for component props
- Comment complex logic
- Keep comments up-to-date
- Document API integrations

### Git Commit Messages
- Use conventional commits format
- Keep messages concise and descriptive
- Reference issue numbers
- Use present tense

Examples:
```
feat: add user profile component
fix: resolve navigation menu bug
docs: update README with setup instructions
style: format code with prettier
refactor: simplify data fetching logic
```

## Code Review Checklist
- [ ] Component follows single responsibility principle
- [ ] Props are properly validated
- [ ] Hooks follow rules of hooks
- [ ] No unnecessary re-renders
- [ ] Accessibility considerations addressed
- [ ] Error handling implemented
- [ ] Tests included
- [ ] No console.log statements
- [ ] Code is properly formatted
- [ ] Documentation is updated
