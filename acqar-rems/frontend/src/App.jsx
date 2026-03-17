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
          <Route path="/" element={<Dashboard />} />
          <Route path="/landing" element={<Landing />} />
        </Routes>
      </EventsProvider>
    </SocketProvider>
  )
}
