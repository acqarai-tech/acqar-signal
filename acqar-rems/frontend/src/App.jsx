import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import { EventsProvider } from './context/EventsContext'
import { SocketProvider } from './context/SocketContext'

export default function App() {
  return (
    <SocketProvider>
      <EventsProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </EventsProvider>
    </SocketProvider>
  )
}
