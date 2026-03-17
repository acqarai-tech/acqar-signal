import { useEffect, useRef, useState } from 'react'
import { useSocket } from '../context/SocketContext'
import { formatDistanceToNow } from 'date-fns'

const ADJECTIVES = [
  'Frosty', 'Lunar', 'Brisk', 'Prismic', 'Smoky', 'Arctic', 'Solar', 'Neon', 'Copper',
  'Silver', 'Crystal', 'Storm', 'Desert', 'Gulf', 'Cedar', 'Steel', 'Marble', 'Golden',
  'Crimson', 'Azure', 'Amber', 'Cobalt', 'Jade', 'Onyx', 'Pearl', 'Ruby', 'Sapphire',
]

const ANIMALS = [
  'Walrus', 'Gecko', 'Falcon', 'Kiwi', 'Ocelot', 'Swift', 'Moth', 'Crane', 'Fox',
  'Eagle', 'Wolf', 'Lion', 'Hawk', 'Owl', 'Lynx', 'Raven', 'Heron', 'Ibis', 'Mink',
  'Puma', 'Quail', 'Stork', 'Tapir', 'Viper', 'Wren', 'Zebu', 'Bison', 'Dingo',
]

// Generate a random animal name pair
const randomName = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  const num = Math.random() > 0.6 ? ' ' + (Math.floor(Math.random() * 9) + 2) : ''
  return adj + ' ' + animal + num
}

// Generate a consistent color for a name (based on first char)
const nameColor = (name) => {
  const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22', '#D4AC0D']
  const idx = name.charCodeAt(0) % colors.length
  return colors[idx]
}


export default function ChatPanel() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [showNewBtn, setShowNewBtn] = useState(false)
  const [myName] = useState(() => randomName())
  const [watcherCount, setWatcherCount] = useState(0)
  const [replyTo, setReplyTo] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)
  const { isConnected, socket } = useSocket()
  const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  // Fetch watcher count from backend
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const statusRes = await fetch(`${API}/api/market/status`)
        if (statusRes.ok) {
          const statusData = await statusRes.json()
          const realConnections = statusData.monitor_count || statusData.active_connections
          if (realConnections > 0) {
            setWatcherCount(realConnections)
          }
        }
      } catch(e) {
        // fallback
      }
    }
    fetchStatus()
    const interval = setInterval(fetchStatus, 10000) // refresh every 10s
    return () => clearInterval(interval)
  }, [API])

  // Listen to real socket events
  useEffect(() => {
    if (!socket) return

    // Listen for real chat messages
    socket.on('chat_message', (msg) => {
      const newMsg = {
        id: msg.id || Date.now(),
        username: msg.username,
        text: msg.text,
        ts: msg.ts || Date.now(),
        color: nameColor(msg.username),
        isNew: true
      }

      const atBottom = containerRef.current &&
        (containerRef.current.scrollHeight - containerRef.current.scrollTop - containerRef.current.clientHeight) < 50
      if (!atBottom) setShowNewBtn(true)

      setMessages(prev => [newMsg, ...prev].slice(0, 100))
    })

    // Listen for typing indicator
    socket.on('user_typing', () => {
      setIsTyping(true)
      const timer = setTimeout(() => setIsTyping(false), 2000)
      return () => clearTimeout(timer)
    })

    return () => {
      socket.off('chat_message')
      socket.off('user_typing')
    }
  }, [socket])

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    setShowNewBtn(false)
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // Emit via socket
    if (socket && isConnected) {
      socket.emit('chat_message', {
        text: input.trim(),
        username: myName
      })
    }

    // Add to local state
    const newMsg = {
      id: Date.now(), username: myName, text: input.trim(),
      ts: Date.now(), color: '#B87333', isOwn: true
    }
    setMessages(prev => [newMsg, ...prev])
    setInput('')
    setReplyTo(null)
  }

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: '#16213E', fontFamily: "'Inter', sans-serif"
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 12px', borderBottom: '1px solid #0F3460',
        display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#FAFAFA' }}>Community Signal</span>
          <span style={{ fontSize: '9px', color: '#444', display: 'block' }}>as {myName}</span>
        </div>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: isConnected ? '#27AE60' : '#666',
          boxShadow: isConnected ? '0 0 6px #27AE60' : 'none'
        }} />
        <span style={{ fontSize: '10px', color: '#B3B3B3', flex: 1 }}>
          {isConnected ? 'live' : 'demo'}
        </span>
        <span style={{ fontSize: '10px', color: '#B87333', fontWeight: 700 }}>
          👁 {watcherCount.toLocaleString()}
        </span>
      </div>

      {/* New messages button */}
      {showNewBtn && (
        <button onClick={scrollToTop} style={{
          margin: '4px 8px', padding: '4px', fontSize: '11px', fontWeight: 600,
          background: 'rgba(39,174,96,0.2)', border: '1px solid #27AE60',
          color: '#27AE60', borderRadius: '4px', cursor: 'pointer'
        }}>↑ New messages</button>
      )}

      {/* Messages */}
      <div ref={containerRef} style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.map(msg => (
          <div key={msg.id}
            style={{
              padding: '7px 9px', borderRadius: '6px',
              background: msg.isOwn ? 'rgba(184,115,51,0.15)' : 'rgba(255,255,255,0.03)',
              border: '1px solid ' + (msg.isOwn ? '#B87333' : '#0F3460'),
              animation: msg.isNew ? 'slideIn 0.3s ease' : 'none',
              position: 'relative'
            }}>
            {/* Username + time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: msg.isOwn ? '#B87333' : msg.color }}>
                {msg.username}
              </span>
              <span style={{ fontSize: '10px', color: '#555' }}>
                {formatDistanceToNow(new Date(msg.ts), { addSuffix: true })}
              </span>
            </div>

            {/* Message text */}
            <div style={{ fontSize: '12px', color: '#FAFAFA', lineHeight: 1.4 }}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{
            fontSize: '12px', color: '#888', fontStyle: 'italic',
            padding: '8px'
          }}>
            Someone is typing...
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} style={{
        padding: '8px', borderTop: '1px solid #0F3460', flexShrink: 0,
        display: 'flex', gap: '6px'
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Signal the community..."
          maxLength={200}
          style={{
            flex: 1, padding: '7px 10px', fontSize: '12px',
            background: '#1A1A2E', border: '1px solid #0F3460',
            color: '#FAFAFA', borderRadius: '4px', outline: 'none'
          }}
        />
        <button type="submit" disabled={!input.trim()} style={{
          padding: '7px 12px', fontSize: '12px', fontWeight: 700,
          background: input.trim() ? '#B87333' : '#333',
          color: 'white', border: 'none', borderRadius: '4px', cursor: input.trim() ? 'pointer' : 'default'
        }}>→</button>
      </form>

      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  )
}


