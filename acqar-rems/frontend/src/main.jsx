// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
// import App from './App'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// )


import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { initGA } from './analytics'  // ← ADD THIS

initGA()  // ← ADD THIS (fires once when app loads)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)







// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
// import App from './App'
// import './index.css'
// import { initGA } from './analytics'

// initGA()

// // ── Read theme from URL param (sent by parent dashboard) ──
// const urlParams = new URLSearchParams(window.location.search)
// const urlTheme = urlParams.get('theme')
// if (urlTheme === 'light' || urlTheme === 'dark') {
//   document.documentElement.setAttribute('data-theme', urlTheme)
//   localStorage.setItem('acqar-theme', urlTheme)
// } else {
//   const saved = localStorage.getItem('acqar-theme') || 'dark'
//   document.documentElement.setAttribute('data-theme', saved)
// }

// // ── Listen for postMessage from parent dashboard ──
// window.addEventListener('message', (e) => {
//   if (e.data?.type === 'acqar-theme') {
//     const t = e.data.theme
//     if (t === 'light' || t === 'dark') {
//       document.documentElement.setAttribute('data-theme', t)
//       localStorage.setItem('acqar-theme', t)
//     }
//   }
// })

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// )
