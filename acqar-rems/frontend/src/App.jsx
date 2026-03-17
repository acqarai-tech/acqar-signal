import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import { EventsProvider } from './context/EventsContext'
import { SocketProvider } from './context/SocketContext'
import Landing from './pages/Landing'

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
