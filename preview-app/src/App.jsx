import { useState, useEffect } from 'react'
import './App.css'

/**
 * AI Studio Live Preview App
 * Automatically reloads when workspace files change
 */
function App() {
  const [count, setCount] = useState(0)
  const [time, setTime] = useState(new Date())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>🤖 AI Development Studio</h1>
        <h2>Live Preview</h2>
        
        <div className="card">
          <p>Current Time: {time.toLocaleTimeString()}</p>
          <button onClick={() => setCount((count) => count + 1)}>
            Count: {count}
          </button>
        </div>

        <div className="info">
          <p>
            This is a live preview running on port 5173.
            Changes to your workspace files will automatically reload this view.
          </p>
          <p>
            Edit files in <code>/workspace</code> to see changes in real-time.
          </p>
        </div>

        <div className="features">
          <h3>Available Services:</h3>
          <ul>
            <li>✅ Code Server (IDE) - Port 8080</li>
            <li>✅ AI Router - Port 3000</li>
            <li>✅ Live Preview - Port 5173</li>
          </ul>
        </div>
      </header>
    </div>
  )
}

export default App
