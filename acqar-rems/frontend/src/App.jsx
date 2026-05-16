


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



// import { Routes, Route, Navigate } from 'react-router-dom'
// import { useState, useEffect } from 'react'
// import { supabase } from './lib/supabase'
// import Dashboard from './pages/Dashboard'
// import { EventsProvider } from './context/EventsContext'
// import { SocketProvider } from './context/SocketContext'
// import Landing from './pages/Landing'
// import Login from './pages/Login'
// import RegisterPage from './pages/RegisterPage'
// // import AuthCallback from './pages/AuthCallback'

// function ProtectedRoute({ children }) {
//   const [checking, setChecking] = useState(true)
//   const [allowed, setAllowed] = useState(false)

//   useEffect(() => {
//     const isAdmin = localStorage.getItem("admin_auth") === "true"
//     if (isAdmin) {
//       setAllowed(true)
//       setChecking(false)
//       return
//     }
//     supabase.auth.getSession().then(({ data }) => {
//       setAllowed(!!data.session)
//       setChecking(false)
//     })
//   }, [])

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
//           {/* <Route path="/auth/callback" element={<AuthCallback />} />
//           <Route path="/auth/callback-signup" element={<AuthCallback />} /> */}

//           {/* ✅ NEW — unprotected terminal route for iframe embed */}
//           <Route path="/terminal" element={<Dashboard />} />

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


// import { Routes, Route, Navigate, useLocation } from 'react-router-dom'  // ← add useLocation
// import { useState, useEffect } from 'react'
// import { supabase } from './lib/supabase'
// import Dashboard from './pages/Dashboard'
// import { EventsProvider } from './context/EventsContext'
// import { SocketProvider } from './context/SocketContext'
// import Landing from './pages/Landing'
// import Login from './pages/Login'
// import RegisterPage from './pages/RegisterPage'
// import { trackPage } from './analytics'  // ← ADD THIS

// // ← ADD THIS COMPONENT
// // function PageTracker() {
// //   const location = useLocation()

// //   useEffect(() => {
// //     trackPage(location.pathname)
// //   }, [location])

// //   return null
// // }


// function PageTracker() {
//   const location = useLocation()

//   useEffect(() => {
//     trackPage(location.pathname)
//   }, [location.pathname])  // ← change [location] to [location.pathname]

//   return null
// }
// function ProtectedRoute({ children }) {
//   const [checking, setChecking] = useState(true)
//   const [allowed, setAllowed] = useState(false)

//   useEffect(() => {
//     const isAdmin = localStorage.getItem("admin_auth") === "true"
//     if (isAdmin) {
//       setAllowed(true)
//       setChecking(false)
//       return
//     }
//     supabase.auth.getSession().then(({ data }) => {
//       setAllowed(!!data.session)
//       setChecking(false)
//     })
//   }, [])

//   if (checking) return null
//   if (!allowed) return <Navigate to="/login" replace />
//   return children
// }

// export default function App() {
//   return (
//     <SocketProvider>
//       <EventsProvider>
//         <PageTracker />  {/* ← ADD THIS — tracks every route change */}
//         <Routes>
//           <Route path="/" element={<Landing />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<RegisterPage />} />

//           {/* ✅ NEW — unprotected terminal route for iframe embed */}
//           <Route path="/terminal" element={<Dashboard />} />

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




// import { Routes, Route, Navigate, useLocation } from 'react-router-dom'  // ← add useLocation
// import { useState, useEffect } from 'react'
// import { supabase } from './lib/supabase'
// import Dashboard from './pages/Dashboard'
// import { EventsProvider } from './context/EventsContext'
// import { SocketProvider } from './context/SocketContext'
// import Landing from './pages/Landing'
// import Login from './pages/Login'
// import RegisterPage from './pages/RegisterPage'
// import SummaryPage from './pages/SummaryPage'
// import { trackPage } from './analytics'  // ← ADD THIS

// // ← ADD THIS COMPONENT
// // function PageTracker() {
// //   const location = useLocation()

// //   useEffect(() => {
// //     trackPage(location.pathname)
// //   }, [location])

// //   return null
// // }


// function PageTracker() {
//   const location = useLocation()

//   useEffect(() => {
//     trackPage(location.pathname)
//   }, [location.pathname])  // ← change [location] to [location.pathname]

//   return null
// }
// function ProtectedRoute({ children }) {
//   const [checking, setChecking] = useState(true)
//   const [allowed, setAllowed] = useState(false)

//   useEffect(() => {
//     const isAdmin = localStorage.getItem("admin_auth") === "true"
//     if (isAdmin) {
//       setAllowed(true)
//       setChecking(false)
//       return
//     }
//     supabase.auth.getSession().then(({ data }) => {
//       setAllowed(!!data.session)
//       setChecking(false)
//     })
//   }, [])

//   if (checking) return null
//   if (!allowed) return <Navigate to="/login" replace />
//   return children
// }

// export default function App() {
//   return (
//     <SocketProvider>
//       <EventsProvider>
//         <PageTracker />  {/* ← ADD THIS — tracks every route change */}
//         <Routes>
//           <Route path="/" element={<Landing />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<RegisterPage />} />
//           <Route path="/summary" element={<SummaryPage />} />

//           {/* ✅ NEW — unprotected terminal route for iframe embed */}
//           <Route path="/terminal" element={<Dashboard />} />

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







// import { Routes, Route, Navigate, useLocation } from 'react-router-dom'  // ← add useLocation
// import { useState, useEffect } from 'react'
// import { supabase } from './lib/supabase'
// import Dashboard from './pages/Dashboard'
// import { EventsProvider } from './context/EventsContext'
// import { SocketProvider } from './context/SocketContext'
// import Landing from './pages/Landing'
// import Login from './pages/Login'
// import RegisterPage from './pages/RegisterPage'
// import SummaryPage from './pages/SummaryPage'
// import { trackPage } from './analytics'  // ← ADD THIS

// // ← ADD THIS COMPONENT
// // function PageTracker() {
// //   const location = useLocation()

// //   useEffect(() => {
// //     trackPage(location.pathname)
// //   }, [location])

// //   return null
// // }


// function PageTracker() {
//   const location = useLocation()

//   useEffect(() => {
//     trackPage(location.pathname)
//   }, [location.pathname])  // ← change [location] to [location.pathname]

//   return null
// }
// function ProtectedRoute({ children }) {
//   const [checking, setChecking] = useState(true)
//   const [allowed, setAllowed] = useState(false)

//   useEffect(() => {
//     const isAdmin = localStorage.getItem("admin_auth") === "true"
//     if (isAdmin) {
//       setAllowed(true)
//       setChecking(false)
//       return
//     }
//     supabase.auth.getSession().then(({ data }) => {
//       setAllowed(!!data.session)
//       setChecking(false)
//     })
//   }, [])

//   if (checking) return null
//   if (!allowed) return <Navigate to="/login" replace />
//   return children
// }


//     export default function App() {
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search)
//     const theme = params.get('theme') || 'dark'
//     document.documentElement.setAttribute('data-theme', theme)
//   }, [])
//   return (
//     <SocketProvider>
//       <EventsProvider>
//         <PageTracker />  {/* ← ADD THIS — tracks every route change */}
//         <Routes>
//           <Route path="/" element={<Landing />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<RegisterPage />} />
//           <Route path="/summary" element={<SummaryPage />} />

//           {/* ✅ NEW — unprotected terminal route for iframe embed */}
//           <Route path="/terminal" element={<Dashboard />} />

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









// import { Routes, Route, Navigate, useLocation } from 'react-router-dom'  // ← add useLocation
// import { useState, useEffect } from 'react'
// import { supabase } from './lib/supabase'
// import Dashboard from './pages/Dashboard'
// import { EventsProvider } from './context/EventsContext'
// import { SocketProvider } from './context/SocketContext'
// import Landing from './pages/Landing'
// import Login from './pages/Login'
// import RegisterPage from './pages/RegisterPage'
// import SummaryPage from './pages/SummaryPage'
// import AreaJVC from './pages/AreaJVC'
// import { trackPage } from './analytics'  // ← ADD THIS

// // ← ADD THIS COMPONENT
// // function PageTracker() {
// //   const location = useLocation()

// //   useEffect(() => {
// //     trackPage(location.pathname)
// //   }, [location])

// //   return null
// // }


// function PageTracker() {
//   const location = useLocation()

//   useEffect(() => {
//     trackPage(location.pathname)
//   }, [location.pathname])  // ← change [location] to [location.pathname]

//   return null
// }
// function ProtectedRoute({ children }) {
//   const [checking, setChecking] = useState(true)
//   const [allowed, setAllowed] = useState(false)

//   useEffect(() => {
//     const isAdmin = localStorage.getItem("admin_auth") === "true"
//     if (isAdmin) {
//       setAllowed(true)
//       setChecking(false)
//       return
//     }
//     supabase.auth.getSession().then(({ data }) => {
//       setAllowed(!!data.session)
//       setChecking(false)
//     })
//   }, [])

//   if (checking) return null
//   if (!allowed) return <Navigate to="/login" replace />
//   return children
// }


//     export default function App() {
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search)
//     const theme = params.get('theme') || 'dark'
//     document.documentElement.setAttribute('data-theme', theme)
//   }, [])
//   return (
//     <SocketProvider>
//       <EventsProvider>
//         <PageTracker />  {/* ← ADD THIS — tracks every route change */}
//         <Routes>
//           <Route path="/" element={<Landing />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<RegisterPage />} />
//           <Route path="/summary" element={<SummaryPage />} />

//           {/* ✅ NEW — unprotected terminal route for iframe embed */}
//           <Route path="/terminal" element={<Dashboard />} />

//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="/area/jvc" element={<AreaJVC />} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </EventsProvider>
//     </SocketProvider>
//   )
// }








// import { Routes, Route, Navigate, useLocation } from 'react-router-dom'  // ← add useLocation
// import { useState, useEffect } from 'react'
// import { supabase } from './lib/supabase'
// import Dashboard from './pages/Dashboard'
// import { EventsProvider } from './context/EventsContext'
// import { SocketProvider } from './context/SocketContext'
// import Landing from './pages/Landing'
// import Login from './pages/Login'
// import RegisterPage from './pages/RegisterPage'
// import SummaryPage from './pages/SummaryPage'
// import AreaJVC from './pages/AreaJVC'
// import AllAreasPage from './pages/AllAreasPage'
// import { trackPage } from './analytics'  // ← ADD THIS

// // ← ADD THIS COMPONENT
// // function PageTracker() {
// //   const location = useLocation()

// //   useEffect(() => {
// //     trackPage(location.pathname)
// //   }, [location])

// //   return null
// // }


// function PageTracker() {
//   const location = useLocation()

//   useEffect(() => {
//     trackPage(location.pathname)
//   }, [location.pathname])  // ← change [location] to [location.pathname]

//   return null
// }
// function ProtectedRoute({ children }) {
//   const [checking, setChecking] = useState(true)
//   const [allowed, setAllowed] = useState(false)

//   useEffect(() => {
//     const isAdmin = localStorage.getItem("admin_auth") === "true"
//     if (isAdmin) {
//       setAllowed(true)
//       setChecking(false)
//       return
//     }
//     supabase.auth.getSession().then(({ data }) => {
//       setAllowed(!!data.session)
//       setChecking(false)
//     })
//   }, [])

//   if (checking) return null
//   if (!allowed) return <Navigate to="/login" replace />
//   return children
// }


//     export default function App() {
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search)
//     const theme = params.get('theme') || 'dark'
//     document.documentElement.setAttribute('data-theme', theme)
//   }, [])
//   return (
//     <SocketProvider>
//       <EventsProvider>
//         <PageTracker />  {/* ← ADD THIS — tracks every route change */}
//         <Routes>
//           <Route path="/" element={<Landing />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<RegisterPage />} />
//           <Route path="/summary" element={<SummaryPage />} />
//           <Route path="/areas" element={<AllAreasPage />} />

//           {/* ✅ NEW — unprotected terminal route for iframe embed */}
//           <Route path="/terminal" element={<Dashboard />} />

//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="/area/jvc" element={<AreaJVC />} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </EventsProvider>
//     </SocketProvider>
//   )
// }











import { Routes, Route, Navigate, useLocation } from 'react-router-dom'  // ← add useLocation
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Dashboard from './pages/Dashboard'
import { EventsProvider } from './context/EventsContext'
import { SocketProvider } from './context/SocketContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import RegisterPage from './pages/RegisterPage'
import SummaryPage from './pages/SummaryPage'
import AreaJVC from './pages/AreaJVC'
import { useSearchParams } from 'react-router-dom'
import AllAreaSpecialistPage from './components/AllAreaSpecialistPage'
import AllAreasPage from './pages/AllAreasPage'
import { trackPage } from './analytics'  // ← ADD THIS

// ← ADD THIS COMPONENT
// function PageTracker() {
//   const location = useLocation()

//   useEffect(() => {
//     trackPage(location.pathname)
//   }, [location])

//   return null
// }


function AreaPage() {
  const [searchParams] = useSearchParams()
  const area = {
    name:         searchParams.get('area')  ?? 'Unknown Area',
    zone:         searchParams.get('zone')  ?? 'Mid-Market',
    area_id:      searchParams.get('id'),
    pricePerSqft: null,
    score:        null,
    yield:        null,
  }
  return (
    <AllAreaSpecialistPage
      area={area}
      onClose={() => window.history.back()}
    />
  )
}

function PageTracker() {
  const location = useLocation()

  useEffect(() => {
    trackPage(location.pathname)
  }, [location.pathname])  // ← change [location] to [location.pathname]

  return null
}
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
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const theme = params.get('theme') || 'dark'
    document.documentElement.setAttribute('data-theme', theme)
  }, [])
  return (
    <SocketProvider>
      <EventsProvider>
        <PageTracker />  {/* ← ADD THIS — tracks every route change */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/areas" element={<AllAreasPage />} />

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
         <Route path="/area/jvc" element={<AreaJVC />} />
<Route path="/area/:slug" element={<AreaPage />} />
<Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </EventsProvider>
    </SocketProvider>
  )
}
