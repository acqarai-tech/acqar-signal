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


import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { formatDistanceToNow } from 'date-fns'

// ─── Supabase client ──────────────────────────────────────────────────────────
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// ─── Name generator ───────────────────────────────────────────────────────────
const ADJECTIVES = [
  'Frosty','Lunar','Brisk','Prismic','Smoky','Arctic','Solar','Neon','Copper',
  'Silver','Crystal','Storm','Desert','Gulf','Cedar','Steel','Marble','Golden',
  'Crimson','Azure','Amber','Cobalt','Jade','Onyx','Pearl','Ruby','Sapphire',
]
const ANIMALS = [
  'Walrus','Gecko','Falcon','Kiwi','Ocelot','Swift','Moth','Crane','Fox',
  'Eagle','Wolf','Lion','Hawk','Owl','Lynx','Raven','Heron','Ibis','Mink',
  'Puma','Quail','Stork','Tapir','Viper','Wren','Zebu','Bison','Dingo',
]
const randomName = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  const num = Math.random() > 0.6 ? ' ' + (Math.floor(Math.random() * 9) + 2) : ''
  return adj + ' ' + animal + num
}

const COLORS = ['#E74C3C','#3498DB','#2ECC71','#F39C12','#9B59B6','#1ABC9C','#E67E22','#D4AC0D']
const nameColor = (name) => COLORS[name.charCodeAt(0) % COLORS.length]

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChatPanel() {
  const [messages, setMessages]     = useState([])
  const [input, setInput]           = useState('')
  const [myName]                    = useState(() => randomName())
  const [showNewBtn, setShowNewBtn] = useState(false)
  const [isTyping, setIsTyping]     = useState(false)
  const [onlineCount, setOnlineCount] = useState(1)
  const [status, setStatus]         = useState('connecting') // 'connecting' | 'live' | 'error'
  const [sending, setSending]       = useState(false)

  const containerRef  = useRef(null)
  const typingTimer   = useRef(null)
  const channelRef    = useRef(null)
  const presenceRef   = useRef(null)

  // ── helpers ──────────────────────────────────────────────────────────────
  const isNearBottom = () => {
    const el = containerRef.current
    if (!el) return true
    return el.scrollHeight - el.scrollTop - el.clientHeight < 80
  }

  const scrollToBottom = (smooth = true) => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: smooth ? 'smooth' : 'instant' })
  }

  const addMessage = useCallback((msg, isOwn = false) => {
    const enriched = {
      ...msg,
      color: isOwn ? '#B87333' : nameColor(msg.username),
      isOwn,
      isNew: true,
    }
    setMessages(prev => {
      // dedupe by id
      if (prev.find(m => m.id === enriched.id)) return prev
      return [...prev, enriched].slice(-100)
    })
    if (!isNearBottom() && !isOwn) {
      setShowNewBtn(true)
    } else {
      setTimeout(() => scrollToBottom(), 50)
    }
  }, [])

  // ── Load history ─────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('ts', { ascending: true })
        .limit(60)

      if (error) {
        console.error('Load error:', error)
        setStatus('error')
        return
      }

      if (data) {
        const enriched = data.map(m => ({
          ...m,
          color: m.username === myName ? '#B87333' : nameColor(m.username),
          isOwn: m.username === myName,
        }))
        setMessages(enriched)
        setTimeout(() => scrollToBottom(false), 50)
      }
    }
    load()
  }, [myName])

  // ── Realtime subscription ─────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('public:messages', { config: { broadcast: { self: false } } })
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          addMessage(payload.new)
        }
      )
      .subscribe((s) => {
        if (s === 'SUBSCRIBED') setStatus('live')
        if (s === 'CLOSED' || s === 'CHANNEL_ERROR') setStatus('error')
      })

    channelRef.current = channel
    return () => supabase.removeChannel(channel)
  }, [addMessage])

  // ── Presence (online count) ───────────────────────────────────────────────
  useEffect(() => {
    const presence = supabase.channel('presence:chat')
    presence
      .on('presence', { event: 'sync' }, () => {
        const state = presence.presenceState()
        setOnlineCount(Object.keys(state).length || 1)
      })
      .subscribe(async (s) => {
        if (s === 'SUBSCRIBED') {
          await presence.track({ username: myName, online_at: new Date().toISOString() })
        }
      })

    presenceRef.current = presence
    return () => supabase.removeChannel(presence)
  }, [myName])

  // ── Typing indicator via broadcast ────────────────────────────────────────
  const broadcastTyping = () => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'typing',
      payload: { username: myName },
    })
  }

  useEffect(() => {
    if (!channelRef.current) return
    const sub = channelRef.current.on('broadcast', { event: 'typing' }, (payload) => {
      if (payload.payload?.username === myName) return
      setIsTyping(true)
      clearTimeout(typingTimer.current)
      typingTimer.current = setTimeout(() => setIsTyping(false), 2500)
    })
    return () => clearTimeout(typingTimer.current)
  }, [myName])

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    setSending(true)
    setInput('')

    const optimistic = {
      id: `opt-${Date.now()}`,
      username: myName,
      text,
      ts: Date.now(),
    }
    addMessage(optimistic, true)

    const { error } = await supabase.from('messages').insert({
      username: myName,
      text,
      ts: Date.now(),
    })

    if (error) {
      console.error('Send error:', error)
      // remove optimistic on failure
      setMessages(prev => prev.filter(m => m.id !== optimistic.id))
      setInput(text) // restore input
    }

    setSending(false)
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    broadcastTyping()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(e)
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: '#16213E', fontFamily: "'Inter', sans-serif",
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: '10px 12px', borderBottom: '1px solid #0F3460',
        display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', flex: 1 }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#FAFAFA' }}>Community Signal</span>
          <span style={{ fontSize: '9px', color: '#555' }}>as <span style={{ color: '#B87333' }}>{myName}</span></span>
        </div>

        {/* Status dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: status === 'live' ? '#27AE60' : status === 'error' ? '#E74C3C' : '#F39C12',
            boxShadow: status === 'live' ? '0 0 6px #27AE60' : 'none',
          }} />
          <span style={{
            fontSize: '10px',
            color: status === 'live' ? '#27AE60' : status === 'error' ? '#E74C3C' : '#F39C12',
            fontWeight: 600,
          }}>
            {status === 'live' ? 'LIVE' : status === 'error' ? 'ERROR' : '...'}
          </span>
        </div>

        {/* Online count */}
        <span style={{ fontSize: '10px', color: '#B87333', fontWeight: 700 }}>
          👁 {onlineCount.toLocaleString()}
        </span>
      </div>

      {/* ── New messages button ── */}
      {showNewBtn && (
        <button
          onClick={() => { scrollToBottom(); setShowNewBtn(false) }}
          style={{
            margin: '4px 8px', padding: '5px', fontSize: '11px', fontWeight: 600,
            background: 'rgba(39,174,96,0.15)', border: '1px solid #27AE60',
            color: '#27AE60', borderRadius: '4px', cursor: 'pointer', flexShrink: 0,
          }}
        >
          ↓ New messages
        </button>
      )}

      {/* ── Messages ── */}
      <div
        ref={containerRef}
        onScroll={() => { if (isNearBottom()) setShowNewBtn(false) }}
        style={{
          flex: 1, overflowY: 'auto', padding: '8px',
          display: 'flex', flexDirection: 'column', gap: '6px',
        }}
      >
        {messages.length === 0 && status === 'live' && (
          <div style={{
            textAlign: 'center', color: '#444', fontSize: '12px',
            marginTop: '40px', lineHeight: 1.8,
          }}>
            <div style={{ fontSize: '22px', marginBottom: '6px' }}>💬</div>
            Be the first to signal the community
          </div>
        )}

        {messages.length === 0 && status === 'connecting' && (
          <div style={{ textAlign: 'center', color: '#444', fontSize: '12px', marginTop: '40px' }}>
            Connecting...
          </div>
        )}

        {messages.length === 0 && status === 'error' && (
          <div style={{ textAlign: 'center', color: '#E74C3C', fontSize: '12px', marginTop: '40px', lineHeight: 1.8 }}>
            <div style={{ fontSize: '22px', marginBottom: '6px' }}>⚠️</div>
            Could not connect to Supabase.<br />
            Check your <code style={{ color: '#F39C12' }}>VITE_SUPABASE_URL</code> and <code style={{ color: '#F39C12' }}>VITE_SUPABASE_ANON_KEY</code>.
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              padding: '7px 9px', borderRadius: '6px',
              background: msg.isOwn ? 'rgba(184,115,51,0.12)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${msg.isOwn ? '#B87333' : '#0F3460'}`,
              animation: msg.isNew ? 'slideIn 0.25s ease' : 'none',
              alignSelf: msg.isOwn ? 'flex-end' : 'flex-start',
              maxWidth: '90%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: msg.color }}>
                {msg.isOwn ? 'You' : msg.username}
              </span>
              <span style={{ fontSize: '10px', color: '#555' }}>
                {formatDistanceToNow(new Date(msg.ts), { addSuffix: true })}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#FAFAFA', lineHeight: 1.45, wordBreak: 'break-word' }}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ fontSize: '11px', color: '#555', fontStyle: 'italic', paddingLeft: '4px' }}>
            Someone is typing<span style={{ animation: 'dots 1.2s infinite' }}>...</span>
          </div>
        )}
      </div>

      {/* ── Input ── */}
      <form
        onSubmit={sendMessage}
        style={{
          padding: '8px', borderTop: '1px solid #0F3460',
          flexShrink: 0, display: 'flex', gap: '6px', alignItems: 'flex-end',
        }}
      >
        <input
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Signal the community..."
          maxLength={200}
          disabled={status === 'error'}
          style={{
            flex: 1, padding: '8px 10px', fontSize: '12px',
            background: '#1A1A2E', border: `1px solid ${status === 'error' ? '#E74C3C44' : '#0F3460'}`,
            color: '#FAFAFA', borderRadius: '4px', outline: 'none',
            resize: 'none', opacity: status === 'error' ? 0.5 : 1,
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || sending || status === 'error'}
          style={{
            padding: '8px 14px', fontSize: '13px', fontWeight: 700,
            background: input.trim() && !sending ? '#B87333' : '#2A2A3E',
            color: input.trim() && !sending ? '#fff' : '#555',
            border: 'none', borderRadius: '4px',
            cursor: input.trim() && !sending ? 'pointer' : 'default',
            transition: 'background 0.15s',
            flexShrink: 0,
          }}
        >
          {sending ? '⏳' : '→'}
        </button>
      </form>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes dots {
          0%,20%  { content: '.';   }
          40%     { content: '..';  }
          60%,100%{ content: '...'; }
        }
      `}</style>
    </div>
  )
}
