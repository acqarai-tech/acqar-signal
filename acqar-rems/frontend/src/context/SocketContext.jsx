import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function SocketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false)
  const [monitorCount, setMonitorCount] = useState(8742)
  const socketRef = useRef(null)
  const listenersRef = useRef({})

  useEffect(() => {
    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })

    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))
    socket.on('market_update', (data) => {
      if (data.monitor_count) setMonitorCount(data.monitor_count)
    })

    socketRef.current = socket

    return () => socket.disconnect()
  }, [])

  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
    }
  }

  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback)
    }
  }

  const emit = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data)
    }
  }

  return (
    <SocketContext.Provider value={{ isConnected, monitorCount, on, off, emit, socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
