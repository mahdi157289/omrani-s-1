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
const isProd = import.meta.env.PROD;
axios.defaults.baseURL = import.meta.env.VITE_API_URL || (isProd ? 'https://pastery-server.onrender.com' : 'http://localhost:5000');

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
