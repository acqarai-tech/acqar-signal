


// import { Routes, Route, Navigate } from 'react-router-dom'
// import { useState, useEffect } from 'react'
// import { supabase } from './lib/supabase'
// import Dashboard from './pages/Dashboard'
// import { EventsProvider } from './context/EventsContext'
// import { SocketProvider } from './context/SocketContext'
// import Landing from './pages/Landing'
// import Login from './pages/Login'
// import RegisterPage from './pages/RegisterPage'

// function ProtectedRoute({ children }) {
//   const [checking, setChecking] = useState(true)
//   const [allowed, setAllowed] = useState(false)

//   useEffect(() => {
//     // Check admin login first
//     const isAdmin = localStorage.getItem("admin_auth") === "true"
//     if (isAdmin) {
//       setAllowed(true)
//       setChecking(false)
//       return
//     }

//     // Check real Supabase session
//     supabase.auth.getSession().then(({ data }) => {
//       setAllowed(!!data.session)
//       setChecking(false)
//     })
//   }, [])

//   // Show nothing while checking — prevents flash redirect
//   if (checking) return null

//   if (!allowed) return <Navigate to="/login" replace />
//   return children
// }

// export default function App() {
//   return (
//     <SocketProvider>
//       <EventsProvider>
//         <Routes>
//           <Route path="/" element={<Landing />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<RegisterPage />} />
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </EventsProvider>
//     </SocketProvider>
//   )
// }



import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Dashboard from './pages/Dashboard'
import { EventsProvider } from './context/EventsContext'
import { SocketProvider } from './context/SocketContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import RegisterPage from './pages/RegisterPage'
// import AuthCallback from './pages/AuthCallback'

function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin_auth") === "true"
    if (isAdmin) {
      setAllowed(true)
      setChecking(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setAllowed(!!data.session)
      setChecking(false)
    })
  }, [])

  if (checking) return null
  if (!allowed) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <SocketProvider>
      <EventsProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<RegisterPage />} />
          {/* <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/callback-signup" element={<AuthCallback />} /> */}

          {/* ✅ NEW — unprotected terminal route for iframe embed */}
          <Route path="/terminal" element={<Dashboard />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </EventsProvider>
    </SocketProvider>
  )
}
