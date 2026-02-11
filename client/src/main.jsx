import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import './i18n'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import axios from 'axios'

// Set base URL for API requests
// If VITE_API_URL is set (production), use it. Otherwise use the hardcoded production URL.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://pastery-server.onrender.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
