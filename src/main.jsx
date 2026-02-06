import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import MovieBookingApp from './App.jsx'

// Temporarily removed StrictMode to debug "only 1 movie" issue
// If movies show correctly, the issue was StrictMode double-rendering
createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <MovieBookingApp />
  </AuthProvider>,
)
