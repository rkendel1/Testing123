# Preview App - Project Overview

## Purpose
The Preview App is a Vite-powered React application that provides a real-time preview environment for development. It auto-reloads when files change, allowing developers to see their work instantly without manual refresh.

## Key Features
- **Hot Module Replacement (HMR)**: Instant updates without full page reload
- **Fast Build**: Vite provides lightning-fast build times
- **React 18**: Modern React with concurrent features
- **Live Preview**: Real-time rendering of changes
- **Development Server**: Built-in dev server on port 5173

## Target Use Cases
1. **UI Component Development**: Preview React components as you build them
2. **Rapid Prototyping**: Quick iteration on designs and layouts
3. **Template Testing**: Test different layouts and themes
4. **Documentation Preview**: Live preview of documentation sites
5. **Learning Environment**: Experiment with React code and see results immediately

## Architecture

### Application Structure
```
preview-app/
├── public/              # Static assets
│   └── vite.svg        # Favicon
├── src/                # Source code
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # React components
│   ├── App.jsx         # Root component
│   ├── App.css         # App styles
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies
```

### Component Hierarchy
```
App (root)
└── Your components here
```

### Data Flow
1. **User Edit**: Developer edits source files
2. **File Watch**: Vite detects file changes
3. **HMR**: Vite sends updates via WebSocket
4. **Module Update**: Only changed modules are updated
5. **UI Refresh**: Browser updates without full reload

## Technology Stack

### Build Tool
- **Vite**: Next-generation frontend build tool
  - ES modules based
  - Lightning-fast HMR
  - Optimized production builds
  - Plugin ecosystem

### Framework
- **React 18**: JavaScript library for building UIs
  - Component-based architecture
  - Virtual DOM for performance
  - Hooks for state management
  - Large ecosystem

### Styling
- **CSS**: Vanilla CSS with CSS modules support
- **PostCSS**: CSS transformations (configurable)
- Optional: TailwindCSS, styled-components, etc.

## Development Workflow

### Starting Development
```bash
npm install    # Install dependencies
npm run dev    # Start dev server
```

### Building for Production
```bash
npm run build  # Create optimized build
npm run preview # Preview production build
```

### Typical Development Flow
1. Start dev server with `npm run dev`
2. Open http://localhost:5173 in browser
3. Edit components in `src/`
4. See changes instantly in browser
5. Build for production when ready

## Key Features Explained

### Hot Module Replacement (HMR)
- Updates modules in-place without full reload
- Preserves application state during updates
- Instant feedback during development
- Significantly faster than traditional live reload

### Fast Refresh
- React-specific HMR implementation
- Preserves component state
- Handles errors gracefully
- Shows error overlay in development

### Asset Handling
- Automatic asset optimization
- Image compression
- CSS bundling and minification
- JavaScript tree-shaking

## Configuration

### Vite Config (vite.config.js)
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0'  // Allow external access
  }
})
```

### Package.json Scripts
- `dev`: Start development server
- `build`: Build for production
- `preview`: Preview production build
- `lint`: Run ESLint (if configured)

## Environment Variables
- Prefix with `VITE_` to expose to client
- Example: `VITE_API_URL`
- Access via `import.meta.env.VITE_API_URL`

## Performance Considerations

### Development
- HMR for instant updates
- On-demand compilation
- Lazy loading of routes
- Code splitting

### Production
- Minification
- Tree-shaking
- Asset optimization
- Gzip compression

## Integration with AI Studio

### Purpose in Studio
- Live preview of code changes
- Visual feedback for developers
- Testing UI components
- Demonstrating features

### Accessibility
- Available at http://localhost:5173
- Auto-starts with Docker container
- Shares workspace with VS Code
- Changes reflect immediately

## Common Use Cases

### 1. Component Development
Create and test React components with instant feedback:
```jsx
function MyComponent() {
  return <div>Hello World</div>;
}
```
Save the file and see it immediately in the browser.

### 2. Styling Experimentation
Modify CSS and see changes instantly:
```css
.button {
  background: blue;  /* Change and save to see effect */
}
```

### 3. Layout Testing
Test different layouts and responsive designs:
```jsx
<div className="container">
  <div className="grid">
    {/* Your layout here */}
  </div>
</div>
```

### 4. API Integration
Test API calls and data display:
```jsx
const [data, setData] = useState([]);

useEffect(() => {
  fetch('/api/data')
    .then(res => res.json())
    .then(setData);
}, []);
```

## Best Practices

### Development
- Use React DevTools for debugging
- Enable source maps for easier debugging
- Organize components logically
- Keep components small and focused
- Use prop-types or TypeScript

### Performance
- Lazy load routes and heavy components
- Optimize images before importing
- Use production build for performance testing
- Monitor bundle size

### Code Organization
- Group related files together
- Use index files for cleaner imports
- Separate concerns (logic, UI, styles)
- Create reusable components

## Troubleshooting

### Port Already in Use
Change port in vite.config.js or use different port

### HMR Not Working
- Check file watchers limit (Linux)
- Verify WebSocket connection
- Restart dev server

### Build Errors
- Clear node_modules and reinstall
- Check for syntax errors
- Verify all imports are correct

### Slow Performance
- Reduce bundle size
- Enable code splitting
- Optimize large images
- Check for memory leaks

## Future Enhancements
- TypeScript support
- Testing framework (Jest/Vitest)
- E2E testing (Playwright/Cypress)
- State management (Redux/Zustand)
- UI component library integration
- Storybook for component documentation
- PWA capabilities
- Analytics integration
