# Preview App - Design Patterns

## React Patterns

### 1. Container/Presentational Pattern
**Purpose**: Separate logic from presentation

**Implementation**:
```jsx
// Container Component (logic)
function UserListContainer() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);
  
  return <UserList users={users} />;
}

// Presentational Component (UI)
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

**Benefits**:
- Reusable presentation components
- Easier testing
- Clear separation of concerns

### 2. Compound Component Pattern
**Purpose**: Create components that work together

**Implementation**:
```jsx
function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div className="tabs">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, { 
          isActive: index === activeTab,
          onClick: () => setActiveTab(index)
        })
      )}
    </div>
  );
}

Tabs.Tab = function Tab({ isActive, onClick, children }) {
  return (
    <button 
      className={isActive ? 'active' : ''} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

**Benefits**:
- Flexible API
- Implicit state sharing
- Better developer experience

### 3. Custom Hooks Pattern
**Purpose**: Reuse stateful logic

**Implementation**:
```jsx
// Custom hook
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);
  
  return { data, loading, error };
}

// Usage
function MyComponent() {
  const { data, loading, error } = useFetch('/api/data');
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <Display data={data} />;
}
```

**Benefits**:
- Reusable logic
- Cleaner components
- Easier testing

### 4. Higher-Order Component (HOC) Pattern
**Purpose**: Add functionality to components

**Implementation**:
```jsx
function withLoading(Component) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) return <Spinner />;
    return <Component {...props} />;
  };
}

const UserListWithLoading = withLoading(UserList);
```

**Benefits**:
- Code reuse
- Prop injection
- Behavior composition

### 5. Render Props Pattern
**Purpose**: Share code using a prop whose value is a function

**Implementation**:
```jsx
function DataFetcher({ url, render }) {
  const { data, loading, error } = useFetch(url);
  return render({ data, loading, error });
}

// Usage
<DataFetcher 
  url="/api/users"
  render={({ data, loading, error }) => {
    if (loading) return <Spinner />;
    if (error) return <Error />;
    return <UserList users={data} />;
  }}
/>
```

**Benefits**:
- Dynamic composition
- Inversion of control
- Flexible rendering

## State Management Patterns

### 1. Lifting State Up
**Purpose**: Share state between components

**Implementation**:
```jsx
function Parent() {
  const [sharedState, setSharedState] = useState(initialValue);
  
  return (
    <>
      <ChildA state={sharedState} setState={setSharedState} />
      <ChildB state={sharedState} />
    </>
  );
}
```

### 2. Context Pattern
**Purpose**: Avoid prop drilling for global state

**Implementation**:
```jsx
const ThemeContext = React.createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Usage
function ThemedButton() {
  const { theme } = useContext(ThemeContext);
  return <button className={theme}>Click me</button>;
}
```

### 3. Reducer Pattern
**Purpose**: Manage complex state logic

**Implementation**:
```jsx
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </div>
  );
}
```

## Performance Patterns

### 1. Memoization Pattern
**Purpose**: Prevent unnecessary re-renders

**Implementation**:
```jsx
const ExpensiveComponent = React.memo(({ data }) => {
  // Only re-renders when data changes
  return <div>{processData(data)}</div>;
});

function Parent() {
  const expensiveValue = useMemo(() => computeExpensiveValue(), [dep]);
  const handleClick = useCallback(() => doSomething(), [dep]);
  
  return <ExpensiveComponent data={expensiveValue} onClick={handleClick} />;
}
```

### 2. Lazy Loading Pattern
**Purpose**: Load components on demand

**Implementation**:
```jsx
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 3. Virtualization Pattern
**Purpose**: Render only visible items in long lists

**Implementation**:
```jsx
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={50}
    >
      {({ index, style }) => (
        <div style={style}>{items[index]}</div>
      )}
    </FixedSizeList>
  );
}
```

## Code Organization Patterns

### 1. Feature-based Structure
```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── index.js
│   └── dashboard/
│       └── ...
```

### 2. Atomic Design Pattern
```
src/
├── components/
│   ├── atoms/       # Basic building blocks
│   ├── molecules/   # Simple combinations
│   ├── organisms/   # Complex combinations
│   ├── templates/   # Page layouts
│   └── pages/       # Actual pages
```

## Error Handling Patterns

### 1. Error Boundary Pattern
**Purpose**: Catch errors in component tree

**Implementation**:
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### 2. Async Error Handling
**Purpose**: Handle promise rejections

**Implementation**:
```jsx
function useAsyncError() {
  const [error, setError] = useState(null);
  
  const handleError = useCallback((error) => {
    setError(error);
    console.error(error);
  }, []);
  
  return { error, handleError };
}
```

## Testing Patterns

### 1. Component Testing Pattern
```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('button click increments counter', async () => {
  render(<Counter />);
  const button = screen.getByRole('button');
  
  await userEvent.click(button);
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### 2. Mock Pattern
```jsx
jest.mock('./api', () => ({
  fetchUsers: jest.fn(() => Promise.resolve([{ id: 1, name: 'John' }]))
}));
```

## Styling Patterns

### 1. CSS Modules
```jsx
import styles from './Component.module.css';

function Component() {
  return <div className={styles.container}>Content</div>;
}
```

### 2. Styled Components (if used)
```jsx
const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'gray'};
  padding: 10px 20px;
`;
```

### 3. CSS-in-JS with Emotion (alternative)
```jsx
const styles = {
  container: css`
    display: flex;
    flex-direction: column;
  `
};
```

## Best Practices

1. **Keep components small**: Single responsibility
2. **Use TypeScript**: Better type safety
3. **Test user behavior**: Not implementation details
4. **Optimize images**: Lazy load and compress
5. **Code splitting**: Split by routes
6. **Accessibility first**: Semantic HTML and ARIA
7. **Performance monitoring**: Use React DevTools Profiler
