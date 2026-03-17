// import { Routes, Route } from 'react-router-dom'
// import Dashboard from './pages/Dashboard'
// import { EventsProvider } from './context/EventsContext'
// import { SocketProvider } from './context/SocketContext'
// import Landing from './pages/Landing'

// export default function App() {
//   return (
//     <SocketProvider>
//       <EventsProvider>
//         <Routes>
//             <Route path="/" element={<Landing />} />
//         <Route path="/dashboard" element={
//   <ProtectedRoute>
//     <Dashboard />
//   </ProtectedRoute>
// } />
//         </Routes>
//       </EventsProvider>
//     </SocketProvider>
//   )
// }


import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Dashboard from './pages/Dashboard'
import { EventsProvider } from './context/EventsContext'
import { SocketProvider } from './context/SocketContext'
import Landing from './pages/Landing'

// ── Add this function above App ──
function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })
  }, [])

  if (session === undefined) return null
  if (!session) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <SocketProvider>
      <EventsProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </EventsProvider>
    </SocketProvider>
  )
}
