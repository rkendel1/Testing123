# VS Code Extension - New Features Usage Examples

## Natural Language Query Feature

### Opening the Feature
1. Press `F1` (or `Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "AI Coder: Natural Language Query"
3. Press Enter

### UI Layout
```
┌─────────────────────────────────────────────────┐
│ AI Natural Language Query                       │
│ Provider: ollama | Model: codellama            │
├─────────────────────────────────────────────────┤
│                                                 │
│ General Query                                   │
│ ┌─────────────────────────────────────────────┐│
│ │ Enter your natural language query...        ││
│ │                                             ││
│ │                                             ││
│ └─────────────────────────────────────────────┘│
│ [Send Query]                                    │
│                                                 │
│ Response: (appears here after query)            │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ CLI Command Refinement                          │
│ Refine natural language queries for CLI ops    │
│                                                 │
│ [GitHub CLI (gh)  ▼]                           │
│                                                 │
│ Original command:                               │
│ ┌─────────────────────────────────────────────┐│
│ │ create a pull request                       ││
│ └─────────────────────────────────────────────┘│
│                                                 │
│ Refinement:                                     │
│ ┌─────────────────────────────────────────────┐│
│ │ add detailed description and assign to me   ││
│ │                                             ││
│ └─────────────────────────────────────────────┘│
│ [Refine Command]                                │
│                                                 │
│ Refined Command: (appears here)                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Example Workflow 1: General Query
**Input:**
```
Query: "What's the best way to handle async errors in Node.js?"
```

**Expected Output:**
```
Response: 
There are several best practices for handling async errors in Node.js:

1. Use try-catch with async/await:
   async function example() {
     try {
       const result = await asyncOperation();
       return result;
     } catch (error) {
       console.error('Error:', error);
       throw error;
     }
   }

2. Handle Promise rejections:
   promise
     .then(result => handleResult(result))
     .catch(error => handleError(error));

3. Use error-first callbacks (legacy):
   function example(callback) {
     operation((error, result) => {
       if (error) return callback(error);
       callback(null, result);
     });
   }

Best practice: Use async/await with try-catch for cleaner code.
```

### Example Workflow 2: CLI Refinement
**Input:**
```
CLI Type: GitHub CLI (gh)
Original: "create pr"
Refinement: "for the feature-auth branch to main with title 'Add authentication'"
```

**Expected Output:**
```
GitHub CLI Command:
gh pr create --base main --head feature-auth --title "Add authentication"
```

## AI Code Generation Feature

### Opening the Feature
1. Press `F1`
2. Type "AI Coder: Generate Code with AI"
3. Press Enter
4. Enter your code generation request

### UI Layout - Step 1: Initial Request
```
┌─────────────────────────────────────────────────┐
│ What code would you like to generate?           │
├─────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────┐│
│ │ Create a REST API endpoint for user auth    ││
│ └─────────────────────────────────────────────┘│
│                                                 │
│ [OK]  [Cancel]                                  │
└─────────────────────────────────────────────────┘
```

### UI Layout - Step 2: Generation in Progress
```
┌─────────────────────────────────────────────────┐
│ AI Code Generation                              │
│ Provider: ollama | Model: codellama            │
├─────────────────────────────────────────────────┤
│ Instruction: Create a REST API endpoint for    │
│ user authentication                             │
├─────────────────────────────────────────────────┤
│                                                 │
│         Generating code...                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

### UI Layout - Step 3: Review Generated Code
```
┌─────────────────────────────────────────────────┐
│ AI Code Generation                              │
│ Provider: ollama | Model: codellama            │
├─────────────────────────────────────────────────┤
│ Instruction: Create a REST API endpoint for    │
│ user authentication                             │
├─────────────────────────────────────────────────┤
│ Generated Code:                                 │
│ ┌─────────────────────────────────────────────┐│
│ │ const express = require('express');         ││
│ │ const bcrypt = require('bcrypt');           ││
│ │ const jwt = require('jsonwebtoken');        ││
│ │                                             ││
│ │ router.post('/auth/login', async (req, res) ││
│ │   const { username, password } = req.body;  ││
│ │                                             ││
│ │   try {                                     ││
│ │     const user = await User.findOne(...);  ││
│ │     const validPassword = await bcrypt...  ││
│ │                                             ││
│ │     if (!validPassword) {                  ││
│ │       return res.status(401).json(...);    ││
│ │     }                                       ││
│ │                                             ││
│ │     const token = jwt.sign(...);           ││
│ │     res.json({ token });                   ││
│ │   } catch (error) {                        ││
│ │     res.status(500).json(...);             ││
│ │   }                                         ││
│ │ });                                         ││
│ └─────────────────────────────────────────────┘│
│                                                 │
│ [✓ Apply Code] [✗ Reject] [↻ Request Changes] │
└─────────────────────────────────────────────────┘
```

### UI Layout - Step 4: Request Changes
```
┌─────────────────────────────────────────────────┐
│ (Same as above with code displayed)             │
│                                                 │
│ [✓ Apply Code] [✗ Reject] [↻ Request Changes] │
│                                                 │
│ Request Changes:                                │
│ ┌─────────────────────────────────────────────┐│
│ │ Add input validation and rate limiting      ││
│ │                                             ││
│ └─────────────────────────────────────────────┘│
│ [Submit Changes]                                │
└─────────────────────────────────────────────────┘
```

### Example Workflow 1: Simple Function
**Step 1 - Request:**
```
"Create a function to validate email addresses"
```

**Step 2 - Generated Code:**
```javascript
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Example usage:
// validateEmail('user@example.com') // returns true
// validateEmail('invalid-email')    // returns false
```

**Step 3 - Action: Apply Code**
- Click "✓ Apply Code"
- Code inserted at cursor position
- Success message appears

### Example Workflow 2: Iterative Refinement
**Step 1 - Initial Request:**
```
"Create a React button component"
```

**Step 2 - Initial Code:**
```jsx
function Button({ children, onClick }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

**Step 3 - Request Changes:**
```
"Add variant prop for primary/secondary styling"
```

**Step 4 - Refined Code:**
```jsx
function Button({ children, onClick, variant = 'primary' }) {
  const baseStyles = 'px-4 py-2 rounded font-medium';
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {children}
    </button>
  );
}
```

**Step 5 - Request More Changes:**
```
"Add disabled state and size prop"
```

**Step 6 - Final Code:**
```jsx
function Button({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  disabled = false 
}) {
  const baseStyles = 'rounded font-medium transition-colors';
  
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  };
  
  const sizeStyles = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };
  
  const disabledStyles = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : '';

  return (
    <button 
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles}`}
    >
      {children}
    </button>
  );
}
```

**Step 7 - Action: Apply Code**

## Combined Workflow Examples

### Workflow: Learn → Query → Generate

**Step 1: Ask a Question**
```
Feature: AI Coder: Natural Language Query
Query: "What are React hooks and when should I use them?"
```

**Step 2: Learn from Response**
```
Response explains hooks, useState, useEffect, etc.
```

**Step 3: Generate Code**
```
Feature: AI Coder: Generate Code with AI
Request: "Create a React component using useState and useEffect to fetch user data"
```

**Step 4: Review and Apply**

### Workflow: Refine CLI → Generate Code

**Step 1: Refine a CLI Command**
```
Feature: Natural Language Query
CLI Type: GitHub CLI
Original: "create repo"
Refinement: "private repository named 'my-app' with description 'My awesome app'"

Output: gh repo create my-app --private --description "My awesome app"
```

**Step 2: Generate Supporting Code**
```
Feature: Generate Code with AI
Request: "Create a GitHub Actions workflow for Node.js testing"
```

## Keyboard Shortcuts (Recommended Setup)

Users can add custom shortcuts via:
`File > Preferences > Keyboard Shortcuts`

Suggested shortcuts:
- **Natural Language Query**: `Ctrl+Alt+Q` / `Cmd+Alt+Q`
- **Generate Code**: `Ctrl+Alt+G` / `Cmd+Alt+G`

## Tips for Best Results

### Natural Language Queries
1. Be specific and provide context
2. Mention your tech stack
3. Ask follow-up questions
4. Use for learning and exploration

### Code Generation
1. Start with clear, detailed requirements
2. Specify the programming language
3. Mention any frameworks or libraries to use
4. Use "Request Changes" for iterative improvement
5. Review carefully before applying
6. Test generated code after applying

### CLI Refinement
1. Start with the basic intent
2. Add options incrementally
3. Learn CLI capabilities through refinement
4. Save refined commands for future reference

## Visual Indicators

### Loading States
- Spinning indicator during generation
- "Processing..." or "Generating code..." text
- Disabled buttons during operations

### Success States
- Green checkmark on successful apply
- Success notification message
- Panel closes after successful apply

### Error States
- Red error messages
- Error notifications
- Detailed error information in response area

## Accessibility

All webviews support:
- Keyboard navigation
- Screen reader compatibility
- VS Code theme integration
- High contrast mode support

## Privacy and Security

- All data stays local or goes to chosen AI provider
- No telemetry or tracking
- API keys never logged
- Code never shared with third parties
