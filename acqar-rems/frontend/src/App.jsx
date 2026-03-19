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
import Dashboard from './pages/Dashboard'
import { EventsProvider } from './context/EventsContext'
import { SocketProvider } from './context/SocketContext'
import Landing from './pages/Landing'

// ✅ FIXED: uses localStorage instead of Supabase session
// Supabase had no session because we use hardcoded credentials, so it was
// always redirecting back to "/" — now we store a simple auth flag instead
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("acqar-auth") === "true"
  if (!isLoggedIn) return <Navigate to="/" replace />
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
