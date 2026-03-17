// import { useEffect, useRef, useState } from 'react'
// import { useSocket } from '../context/SocketContext'
// import { formatDistanceToNow } from 'date-fns'

// const ADJECTIVES = [
//   'Frosty', 'Lunar', 'Brisk', 'Prismic', 'Smoky', 'Arctic', 'Solar', 'Neon', 'Copper',
//   'Silver', 'Crystal', 'Storm', 'Desert', 'Gulf', 'Cedar', 'Steel', 'Marble', 'Golden',
//   'Crimson', 'Azure', 'Amber', 'Cobalt', 'Jade', 'Onyx', 'Pearl', 'Ruby', 'Sapphire',
// ]

// const ANIMALS = [
//   'Walrus', 'Gecko', 'Falcon', 'Kiwi', 'Ocelot', 'Swift', 'Moth', 'Crane', 'Fox',
//   'Eagle', 'Wolf', 'Lion', 'Hawk', 'Owl', 'Lynx', 'Raven', 'Heron', 'Ibis', 'Mink',
//   'Puma', 'Quail', 'Stork', 'Tapir', 'Viper', 'Wren', 'Zebu', 'Bison', 'Dingo',
// ]

// // Generate a random animal name pair
// const randomName = () => {
//   const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
//   const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
//   const num = Math.random() > 0.6 ? ' ' + (Math.floor(Math.random() * 9) + 2) : ''
//   return adj + ' ' + animal + num
// }

// // Generate a consistent color for a name (based on first char)
// const nameColor = (name) => {
//   const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22', '#D4AC0D']
//   const idx = name.charCodeAt(0) % colors.length
//   return colors[idx]
// }


// export default function ChatPanel() {
//   const [messages, setMessages] = useState([])
//   const [input, setInput] = useState('')
//   const [showNewBtn, setShowNewBtn] = useState(false)
//   const [myName] = useState(() => randomName())
//   const [watcherCount, setWatcherCount] = useState(0)
//   const [replyTo, setReplyTo] = useState(null)
//   const [hoveredId, setHoveredId] = useState(null)
//   const [isTyping, setIsTyping] = useState(false)
//   const messagesEndRef = useRef(null)
//   const containerRef = useRef(null)
//   const { isConnected, socket } = useSocket()
//   const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

//   // Fetch watcher count from backend
//   useEffect(() => {
//     const fetchStatus = async () => {
//       try {
//         const statusRes = await fetch(`${API}/api/market/status`)
//         if (statusRes.ok) {
//           const statusData = await statusRes.json()
//           const realConnections = statusData.monitor_count || statusData.active_connections
//           if (realConnections > 0) {
//             setWatcherCount(realConnections)
//           }
//         }
//       } catch(e) {
//         // fallback
//       }
//     }
//     fetchStatus()
//     const interval = setInterval(fetchStatus, 10000) // refresh every 10s
//     return () => clearInterval(interval)
//   }, [API])

//   // Listen to real socket events
//   useEffect(() => {
//     if (!socket) return

//     // Listen for real chat messages
//     socket.on('chat_message', (msg) => {
//       const newMsg = {
//         id: msg.id || Date.now(),
//         username: msg.username,
//         text: msg.text,
//         ts: msg.ts || Date.now(),
//         color: nameColor(msg.username),
//         isNew: true
//       }

//       const atBottom = containerRef.current &&
//         (containerRef.current.scrollHeight - containerRef.current.scrollTop - containerRef.current.clientHeight) < 50
//       if (!atBottom) setShowNewBtn(true)

//       setMessages(prev => [newMsg, ...prev].slice(0, 100))
//     })

//     // Listen for typing indicator
//     socket.on('user_typing', () => {
//       setIsTyping(true)
//       const timer = setTimeout(() => setIsTyping(false), 2000)
//       return () => clearTimeout(timer)
//     })

//     return () => {
//       socket.off('chat_message')
//       socket.off('user_typing')
//     }
//   }, [socket])

//   const scrollToTop = () => {
//     containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
//     setShowNewBtn(false)
//   }

//   const sendMessage = (e) => {
//     e.preventDefault()
//     if (!input.trim()) return

//     // Emit via socket
//     if (socket && isConnected) {
//       socket.emit('chat_message', {
//         text: input.trim(),
//         username: myName
//       })
//     }

//     // Add to local state
//     const newMsg = {
//       id: Date.now(), username: myName, text: input.trim(),
//       ts: Date.now(), color: '#B87333', isOwn: true
//     }
//     setMessages(prev => [newMsg, ...prev])
//     setInput('')
//     setReplyTo(null)
//   }

//   return (
//     <div style={{
//       height: '100%', display: 'flex', flexDirection: 'column',
//       background: '#16213E', fontFamily: "'Inter', sans-serif"
//     }}>
//       {/* Header */}
//       <div style={{
//         padding: '10px 12px', borderBottom: '1px solid #0F3460',
//         display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0
//       }}>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
//           <span style={{ fontSize: '13px', fontWeight: 700, color: '#FAFAFA' }}>Community Signal</span>
//           <span style={{ fontSize: '9px', color: '#444', display: 'block' }}>as {myName}</span>
//         </div>
//         <div style={{
//           width: 6, height: 6, borderRadius: '50%',
//           background: isConnected ? '#27AE60' : '#666',
//           boxShadow: isConnected ? '0 0 6px #27AE60' : 'none'
//         }} />
//         <span style={{ fontSize: '10px', color: '#B3B3B3', flex: 1 }}>
//           {isConnected ? 'live' : 'demo'}
//         </span>
//         <span style={{ fontSize: '10px', color: '#B87333', fontWeight: 700 }}>
//           👁 {watcherCount.toLocaleString()}
//         </span>
//       </div>

//       {/* New messages button */}
//       {showNewBtn && (
//         <button onClick={scrollToTop} style={{
//           margin: '4px 8px', padding: '4px', fontSize: '11px', fontWeight: 600,
//           background: 'rgba(39,174,96,0.2)', border: '1px solid #27AE60',
//           color: '#27AE60', borderRadius: '4px', cursor: 'pointer'
//         }}>↑ New messages</button>
//       )}

//       {/* Messages */}
//       <div ref={containerRef} style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
//         {messages.map(msg => (
//           <div key={msg.id}
//             style={{
//               padding: '7px 9px', borderRadius: '6px',
//               background: msg.isOwn ? 'rgba(184,115,51,0.15)' : 'rgba(255,255,255,0.03)',
//               border: '1px solid ' + (msg.isOwn ? '#B87333' : '#0F3460'),
//               animation: msg.isNew ? 'slideIn 0.3s ease' : 'none',
//               position: 'relative'
//             }}>
//             {/* Username + time */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
//               <span style={{ fontSize: '11px', fontWeight: 700, color: msg.isOwn ? '#B87333' : msg.color }}>
//                 {msg.username}
//               </span>
//               <span style={{ fontSize: '10px', color: '#555' }}>
//                 {formatDistanceToNow(new Date(msg.ts), { addSuffix: true })}
//               </span>
//             </div>

//             {/* Message text */}
//             <div style={{ fontSize: '12px', color: '#FAFAFA', lineHeight: 1.4 }}>
//               {msg.text}
//             </div>
//           </div>
//         ))}

//         {/* Typing indicator */}
//         {isTyping && (
//           <div style={{
//             fontSize: '12px', color: '#888', fontStyle: 'italic',
//             padding: '8px'
//           }}>
//             Someone is typing...
//           </div>
//         )}
//       </div>

//       {/* Input */}
//       <form onSubmit={sendMessage} style={{
//         padding: '8px', borderTop: '1px solid #0F3460', flexShrink: 0,
//         display: 'flex', gap: '6px'
//       }}>
//         <input
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           placeholder="Signal the community..."
//           maxLength={200}
//           style={{
//             flex: 1, padding: '7px 10px', fontSize: '12px',
//             background: '#1A1A2E', border: '1px solid #0F3460',
//             color: '#FAFAFA', borderRadius: '4px', outline: 'none'
//           }}
//         />
//         <button type="submit" disabled={!input.trim()} style={{
//           padding: '7px 12px', fontSize: '12px', fontWeight: 700,
//           background: input.trim() ? '#B87333' : '#333',
//           color: 'white', border: 'none', borderRadius: '4px', cursor: input.trim() ? 'pointer' : 'default'
//         }}>→</button>
//       </form>

//       <style>{`
//         @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
//       `}</style>
//     </div>
//   )
// }


// import { useEffect, useRef, useState } from 'react'
// import { supabase } from '../lib/supabase'

// const nameColor = (name = '') => {
//   const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22', '#D4AC0D']
//   let hash = 0
//   for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
//   return colors[Math.abs(hash) % colors.length]
// }

// function formatTime(ts) {
//   const d = new Date(ts)
//   return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
// }

// // Temporary guest name until auth is integrated
// const GUEST_NAME = 'Guest_' + Math.random().toString(36).slice(2, 6).toUpperCase()

// export default function ChatPanel() {
//   const myName = GUEST_NAME
//   const [messages, setMessages] = useState([])
//   const [input, setInput] = useState('')
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const bottomRef = useRef(null)
//   const inputRef = useRef(null)

//   // ── Fetch messages on mount ───────────────────────────────────────────────
//   useEffect(() => {
//     const fetchMessages = async () => {
//       setLoading(true)
//       setError(null)
//       const { data, error } = await supabase
//         .from('messages')
//         .select('id, user_name, content, created_at')
//         .order('created_at', { ascending: true })
//         .limit(100)

//       if (error) {
//         console.error('Fetch error:', error)
//         setError('Could not load messages: ' + error.message)
//         setLoading(false)
//         return
//       }
//       setMessages(data || [])
//       setLoading(false)
//     }

//     fetchMessages()
//   }, [])

//   // ── Supabase Realtime ─────────────────────────────────────────────────────
//   useEffect(() => {
//     const channel = supabase
//       .channel('chat-room-' + Math.random())
//       .on(
//         'postgres_changes',
//         { event: 'INSERT', schema: 'public', table: 'messages' },
//         (payload) => {
//           setMessages(prev => {
//             if (prev.find(m => m.id === payload.new.id)) return prev
//             return [...prev, payload.new]
//           })
//         }
//       )
//       .subscribe((status) => {
//         console.log('Realtime status:', status)
//       })

//     return () => supabase.removeChannel(channel)
//   }, [])

//   // ── Auto scroll to bottom ─────────────────────────────────────────────────
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   // ── Send message ──────────────────────────────────────────────────────────
//   const sendMessage = async (e) => {
//     e.preventDefault()
//     const text = input.trim()
//     if (!text) return
//     setInput('')

//     const { error } = await supabase.from('messages').insert({
//       user_id: myName,
//       user_name: myName,
//       content: text,
//     })

//     if (error) {
//       console.error('Send error:', error)
//       setError('Failed to send: ' + error.message)
//     }
//   }

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault()
//       sendMessage(e)
//     }
//   }

//   return (
//     <div style={{
//       height: '100%', display: 'flex', flexDirection: 'column',
//       background: '#16213E', fontFamily: "'Inter', sans-serif"
//     }}>
//       {/* Header */}
//       <div style={{
//         padding: '10px 12px', borderBottom: '1px solid #0F3460',
//         display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0
//       }}>
//         <div style={{ flex: 1 }}>
//           <span style={{ fontSize: '13px', fontWeight: 700, color: '#FAFAFA' }}>ACQAR Community Signal</span>
//           <span style={{ fontSize: '9px', color: '#555', display: 'block', marginTop: '1px' }}>
//             chatting as <span style={{ color: '#B87333', fontWeight: 600 }}>{myName}</span>
//           </span>
//         </div>
//         <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#27AE60', boxShadow: '0 0 6px #27AE60' }} />
//         <span style={{ fontSize: '10px', color: '#27AE60', fontWeight: 600 }}>LIVE</span>
//       </div>

//       {/* Error banner */}
//       {error && (
//         <div style={{
//           padding: '6px 12px', background: 'rgba(231,76,60,0.15)',
//           borderBottom: '1px solid #E74C3C',
//           fontSize: '10px', color: '#E74C3C',
//           display: 'flex', justifyContent: 'space-between'
//         }}>
//           {error}
//           <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#E74C3C', cursor: 'pointer' }}>✕</button>
//         </div>
//       )}

//       {/* Messages */}
//       <div style={{
//         flex: 1, overflowY: 'auto', padding: '10px 8px',
//         display: 'flex', flexDirection: 'column', gap: '6px',
//         scrollbarWidth: 'thin', scrollbarColor: '#0F3460 transparent',
//       }}>
//         {loading && (
//           <div style={{ fontSize: '11px', color: '#444', textAlign: 'center', padding: '20px' }}>
//             Loading messages...
//           </div>
//         )}

//         {!loading && messages.length === 0 && (
//           <div style={{ fontSize: '11px', color: '#444', textAlign: 'center', padding: '20px' }}>
//             No messages yet. Say something!
//           </div>
//         )}

//         {messages.map(msg => {
//           const isOwn = msg.user_name === myName
//           const color = isOwn ? '#B87333' : nameColor(msg.user_name)
//           return (
//             <div key={msg.id} style={{
//               padding: '7px 9px', borderRadius: '6px',
//               background: isOwn ? 'rgba(184,115,51,0.15)' : 'rgba(255,255,255,0.03)',
//               border: `1px solid ${isOwn ? '#B87333' : '#0F3460'}`,
//             }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
//                 <span style={{ fontSize: '11px', fontWeight: 700, color }}>{msg.user_name}</span>
//                 <span style={{ fontSize: '9px', color: '#444' }}>{formatTime(msg.created_at)}</span>
//               </div>
//               <div style={{ fontSize: '12px', color: '#FAFAFA', lineHeight: 1.45, wordBreak: 'break-word' }}>
//                 {msg.content}
//               </div>
//             </div>
//           )
//         })}
//         <div ref={bottomRef} />
//       </div>

//       {/* Input */}
//       <form onSubmit={sendMessage} style={{
//         padding: '8px', borderTop: '1px solid #0F3460',
//         display: 'flex', gap: '6px', flexShrink: 0
//       }}>
//         <input
//           ref={inputRef}
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Signal the community..."
//           maxLength={200}
//           style={{
//             flex: 1, padding: '7px 10px', fontSize: '12px',
//             background: '#1A1A2E', border: '1px solid #0F3460',
//             color: '#FAFAFA', borderRadius: '4px', outline: 'none',
//             transition: 'border-color 0.15s',
//           }}
//           onFocus={e => e.target.style.borderColor = '#B87333'}
//           onBlur={e => e.target.style.borderColor = '#0F3460'}
//         />
//         <button type="submit" disabled={!input.trim()} style={{
//           padding: '7px 12px', fontSize: '12px', fontWeight: 700,
//           background: input.trim() ? '#B87333' : '#333',
//           color: 'white', border: 'none', borderRadius: '4px',
//           cursor: input.trim() ? 'pointer' : 'default',
//           transition: 'background 0.15s',
//         }}>→</button>
//       </form>
//     </div>
//   )
// }







import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

const nameColor = (name = '') => {
  const colors = [
    '#E8A838', '#E74C3C', '#3498DB', '#2ECC71',
    '#9B59B6', '#1ABC9C', '#E67E22', '#D4AC0D',
    '#F39C12', '#16A085', '#27AE60', '#8E44AD',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function formatTime(ts) {
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const GUEST_NAME = 'Guest_' + Math.random().toString(36).slice(2, 6).toUpperCase()

export default function ChatPanel({ onClose }) {
  const myName = GUEST_NAME
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [msgCount, setMsgCount] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // ── Fetch messages ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('messages')
        .select('id, user_name, content, created_at')
        .order('created_at', { ascending: true })
        .limit(100)
      if (error) {
        setError('Could not load messages: ' + error.message)
        setLoading(false)
        return
      }
      setMessages(data || [])
      setLoading(false)
    }
    fetchMessages()
  }, [])

  // ── Real message count ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
      if (count !== null) setMsgCount(count)
    }
    fetchCount()
  }, [messages])

  // ── Supabase Realtime ─────────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('chat-room-' + Math.random())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev
          return [...prev, payload.new]
        })
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  // ── Auto scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Send ──────────────────────────────────────────────────────────────────
  const sendMessage = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput('')
    const { error } = await supabase.from('messages').insert({
      user_id: myName, user_name: myName, content: text,
    })
    if (error) setError('Failed to send: ' + error.message)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e) }
  }

  // ── Close handler — works on both touch and mouse ─────────────────────────
  const triggerClose = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (typeof onClose === 'function') onClose()
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#111827',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden',
    }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '7px',
        padding: '0 12px',
        background: '#0d1117',
        borderBottom: '1px solid #1f2937',
        flexShrink: 0,
        height: 44,
        // Ensure header is always on top and touchable
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Icon */}
        <div style={{
          width: 22, height: 22, borderRadius: '6px',
          background: '#1f2937',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', flexShrink: 0,
        }}>💬</div>

        {/* Title */}
        <span style={{ fontSize: '12px', fontWeight: 800, color: '#f9fafb', letterSpacing: '1px' }}>
          CHAT
        </span>

        <span style={{ fontSize: '10px', color: '#4b5563' }}>as</span>
        <span style={{ fontSize: '10px', fontWeight: 700, color: nameColor(myName) }}>
          {myName}
        </span>

        <div style={{ flex: 1 }} />

        {/* Real message count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '13px' }}>🟠</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#f9fafb' }}>
            {msgCount !== null ? msgCount.toLocaleString() : '—'}
          </span>
        </div>

        {/* Refresh */}
        <button
          onClick={() => window.location.reload()}
          title="Refresh"
          style={{
            background: 'none', border: 'none',
            color: '#4b5563', cursor: 'pointer',
            fontSize: '15px', padding: '4px',
            lineHeight: 1, borderRadius: '4px',
          }}
        >↺</button>

        {/* ✕ Close button — onTouchEnd for mobile, onClick for desktop */}
        <button
          onTouchEnd={triggerClose}
          onClick={triggerClose}
          title="Close"
          style={{
            width: 36, height: 36,         // larger touch target for mobile
            background: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '6px',
            color: '#9ca3af',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', flexShrink: 0,
            WebkitTapHighlightColor: 'transparent', // remove iOS tap flash
            touchAction: 'manipulation',
          }}
        >✕</button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          padding: '5px 12px', background: 'rgba(239,68,68,0.15)',
          borderBottom: '1px solid rgba(239,68,68,0.4)',
          fontSize: '10px', color: '#f87171',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0,
        }}>
          {error}
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* ── Messages ── */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '4px 0 8px',
        scrollbarWidth: 'thin',
        scrollbarColor: '#1f2937 transparent',
      }}>
        {loading && (
          <div style={{ fontSize: '11px', color: '#4b5563', textAlign: 'center', padding: '24px' }}>
            Loading messages...
          </div>
        )}
        {!loading && messages.length === 0 && (
          <div style={{ fontSize: '11px', color: '#4b5563', textAlign: 'center', padding: '24px' }}>
            No messages yet. Say something!
          </div>
        )}
        {messages.map((msg, i) => {
          const isOwn = msg.user_name === myName
          const color = isOwn ? '#B87333' : nameColor(msg.user_name)
          const prevMsg = messages[i - 1]
          const sameUser = prevMsg && prevMsg.user_name === msg.user_name
          const timeDiff = prevMsg
            ? (new Date(msg.created_at) - new Date(prevMsg.created_at)) / 1000 : 999
          const showHeader = !sameUser || timeDiff > 120
          return (
            <div key={msg.id} style={{
              padding: showHeader ? '10px 14px 2px' : '1px 14px',
              background: isOwn ? 'rgba(184,115,51,0.05)' : 'transparent',
              borderLeft: isOwn ? '2px solid rgba(184,115,51,0.5)' : '2px solid transparent',
            }}>
              {showHeader && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color }}>{msg.user_name}</span>
                  <span style={{ fontSize: '9px', color: '#374151' }}>{formatTime(msg.created_at)}</span>
                </div>
              )}
              <div style={{ fontSize: '13px', color: '#d1d5db', lineHeight: 1.5, wordBreak: 'break-word' }}>
                {msg.content}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <form onSubmit={sendMessage} style={{
        padding: '10px 12px',
        borderTop: '1px solid #1f2937',
        background: '#0d1117',
        flexShrink: 0,
        display: 'flex', gap: '8px', alignItems: 'center',
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          maxLength={200}
          style={{
            flex: 1, padding: '9px 14px', fontSize: '13px',
            background: '#1f2937', border: '1px solid #374151',
            color: '#f9fafb', borderRadius: '8px', outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => e.target.style.borderColor = '#6366f1'}
          onBlur={e => e.target.style.borderColor = '#374151'}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          style={{
            width: 36, height: 36, borderRadius: '8px',
            background: input.trim() ? '#6366f1' : '#1f2937',
            border: 'none', color: 'white',
            cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '15px', flexShrink: 0,
            transition: 'background 0.15s',
            touchAction: 'manipulation',
          }}
        >↗</button>
      </form>
    </div>
  )
}
