import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { BrowserRouter, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
  if (hash) {
    setTimeout(() => {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
}, [pathname, hash])

  return null
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToHash />
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)