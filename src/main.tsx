import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { retireLegacyServiceWorker } from './retireLegacyServiceWorker'
import './index.css'

const container = document.getElementById('root')

if (!container) throw new Error('The root element was not found')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

void retireLegacyServiceWorker().catch((error: unknown) => {
  console.warn('Could not retire the previous portfolio service worker.', error)
})
