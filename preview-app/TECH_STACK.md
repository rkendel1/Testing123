# Preview App - Tech Stack

## Core Technologies

### Build Tool
- **Vite** (v4.x)
  - Next-generation frontend build tool
  - Native ES modules in development
  - Lightning-fast HMR (Hot Module Replacement)
  - Optimized production builds with Rollup
  - Plugin-based architecture
  - **Why chosen**: 10-100x faster than webpack, modern architecture

### Framework
- **React** (v18.x)
  - Library for building user interfaces
  - Component-based architecture
  - Virtual DOM for efficient updates
  - Concurrent features (Suspense, Transitions)
  - Hooks for state and side effects
  - **Why chosen**: Industry standard, large ecosystem, excellent performance

### Language
- **JavaScript (ES2020+)**
  - Modern syntax (arrow functions, destructuring, etc.)
  - Modules (import/export)
  - Promises and async/await
  - Optional chaining and nullish coalescing
  - **Future**: TypeScript for better type safety

## Development Dependencies

### React Plugins
- **@vitejs/plugin-react**
  - Official Vite plugin for React
  - Fast Refresh support
  - JSX transformation
  - React DevTools integration

### Code Quality Tools

#### Linting
- **ESLint**
  - JavaScript/React linter
  - Catches common errors
  - Enforces code style
  - Integrates with VS Code

#### Formatting
- **Prettier**
  - Code formatter
  - Consistent style
  - Auto-format on save
  - Integrates with ESLint

## Production Dependencies

### React Core
- **react**: Core React library
- **react-dom**: React DOM renderer

### Optional Libraries (commonly added)
- **react-router-dom**: Client-side routing
- **axios**: HTTP client
- **react-query**: Data fetching and caching
- **zustand/redux**: State management
- **react-hook-form**: Form handling
- **yup/zod**: Schema validation

## Styling Options

### Built-in Support
- **CSS**: Native CSS support
- **CSS Modules**: Scoped CSS
- **PostCSS**: CSS transformations
- **Sass/SCSS**: CSS preprocessor (plugin)
- **Less**: CSS preprocessor (plugin)

### Popular Additions
- **Tailwind CSS**: Utility-first CSS framework
- **styled-components**: CSS-in-JS
- **emotion**: CSS-in-JS
- **Material-UI**: Component library
- **Chakra UI**: Component library

## Asset Handling

### Supported Formats
- **Images**: PNG, JPG, GIF, SVG, WebP
- **Fonts**: TTF, OTF, WOFF, WOFF2
- **JSON**: Import as modules
- **Raw Text**: Import with `?raw`
- **Web Workers**: Import with `?worker`

### Optimization
- **Image compression**: Automatic in production
- **Tree-shaking**: Remove unused code
- **Code splitting**: Dynamic imports
- **Minification**: Terser for JS, cssnano for CSS

## Development Server

### Features
- **Port**: 5173 (default)
- **HMR**: WebSocket-based hot updates
- **CORS**: Configurable
- **Proxy**: API proxy support
- **HTTPS**: Optional SSL support

### Configuration
```javascript
// vite.config.js
{
  server: {
    port: 5173,
    host: '0.0.0.0',  // Allow external access
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}
```

## Build System

### Production Build
- **Bundler**: Rollup
- **Output**: Optimized static files
- **Target**: Modern browsers (ES2015+)
- **Minification**: Terser
- **Code splitting**: Automatic
- **Tree-shaking**: Dead code elimination

### Build Output
```
dist/
├── assets/
│   ├── index-[hash].js      # Main bundle
│   ├── vendor-[hash].js     # Dependencies
│   └── style-[hash].css     # Styles
└── index.html               # Entry HTML
```

## Environment Variables

### Naming Convention
- Prefix with `VITE_` to expose to client
- Example: `VITE_API_URL`, `VITE_APP_TITLE`

### Usage
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
```

### Configuration Files
- `.env`: All environments
- `.env.local`: Local overrides (gitignored)
- `.env.development`: Development only
- `.env.production`: Production only

## Browser Support

### Target Browsers
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- iOS Safari: Last 2 versions

### Polyfills
- Not included by default
- Add if targeting older browsers
- Use `@vitejs/plugin-legacy` for IE11

## Testing (Future Enhancement)

### Unit Testing
- **Vitest**: Vite-native test runner
- **Jest**: Popular testing framework
- **React Testing Library**: Component testing

### E2E Testing
- **Playwright**: End-to-end testing
- **Cypress**: E2E testing and debugging

### Coverage
- **Istanbul/c8**: Code coverage
- Target: 80%+ coverage

## Performance Monitoring

### Development Tools
- **React DevTools**: Component inspector
- **Vite DevTools**: Build analysis
- **Browser DevTools**: Performance profiler

### Production Monitoring
- **Web Vitals**: Core web vitals tracking
- **Lighthouse**: Performance audits
- **Sentry**: Error tracking (optional)

## File Structure

### Project Layout
```
preview-app/
├── public/              # Static assets (not processed)
│   └── vite.svg
├── src/                 # Source code
│   ├── assets/         # Processed assets
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utility functions
│   ├── styles/         # Global styles
│   ├── App.jsx         # Root component
│   ├── App.css         # App styles
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── .devcontainer/      # Dev container config
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies
├── .eslintrc.js        # ESLint config
├── .prettierrc         # Prettier config
└── .gitignore          # Git ignore rules
```

## Configuration Files

### vite.config.js
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0'
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

### package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx",
    "format": "prettier --write src"
  }
}
```

## Deployment

### Static Hosting
- **Netlify**: Drop dist folder or connect to git
- **Vercel**: Automatic deployment from git
- **GitHub Pages**: Via gh-pages package
- **AWS S3**: Static website hosting
- **Cloudflare Pages**: Fast global CDN

### Docker Deployment
- Build production files: `npm run build`
- Serve with nginx or similar
- Configure in main Dockerfile

### Build Command
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## Security Considerations

### Dependencies
- Regular updates via `npm audit`
- Automated dependency updates (Dependabot)
- Review package before installation

### Environment Variables
- Never commit secrets
- Use .env.local for sensitive data
- Validate environment variables

### Content Security Policy
- Configure in HTML meta tags
- Restrict resource loading
- Prevent XSS attacks

## Performance Optimization

### Code Splitting
```javascript
// Route-based splitting
const Dashboard = lazy(() => import('./Dashboard'));

// Component-based splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### Asset Optimization
- Compress images (WebP format)
- Lazy load images below the fold
- Use SVG for icons
- Optimize fonts (subset, woff2)

### Caching Strategy
- Cache-bust with content hashes
- Long cache times for static assets
- Service worker for offline support

## Future Technology Considerations

### Potential Additions
- **TypeScript**: Type safety
- **PWA**: Progressive Web App capabilities
- **GraphQL**: Alternative to REST
- **Web Workers**: Heavy computation offload
- **WebAssembly**: Performance-critical code
- **Storybook**: Component documentation
- **Chromatic**: Visual testing

### Performance Enhancements
- **Prerendering**: SSG for static content
- **SSR**: Server-side rendering (with Vite SSR)
- **ISR**: Incremental static regeneration
- **CDN**: Global content delivery

## Version Requirements

### Minimum Versions
- Node.js: v14.18.0
- npm: v7.0.0

### Recommended Versions
- Node.js: v18.x (LTS)
- npm: v9.x
- Modern browser with ES2015+ support
