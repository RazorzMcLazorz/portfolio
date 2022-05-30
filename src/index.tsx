import React from 'react'
import { createRoot } from 'react-dom/client'
import { isMobile } from 'react-device-detect'
// @ts-ignore
import Particles from 'particlesjs'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import './index.scss'
import App from './App'
import reportWebVitals from './reportWebVitals'

const container = document.getElementById('root')

const root = createRoot(container!)

window.onload = function () {
  Particles.init({
    selector: '.background',
    maxParticles: isMobile ? 200 : 450,
    color: '#44d9e6',
    connectParticles: false,
    sizeVariations: 1,
    speed: isMobile ? 0.1 : 0.3,
  })
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
