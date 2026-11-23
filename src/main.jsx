import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '@fontsource-variable/inter'
import './styles.css'
createRoot(document.getElementById('root')).render(<App />)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}))
}

// En escritorio, el teléfono se escala para caber siempre completo en la ventana
const fit = () => document.documentElement.style.setProperty('--k', String(Math.min(1, (window.innerHeight - 56) / 844)))
fit(); window.addEventListener('resize', fit)
