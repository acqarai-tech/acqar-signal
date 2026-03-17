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

// ─── Supabase config ────────────────────────────────────────────────────────
// Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ─── Helpers ─────────────────────────────────────────────────────────────────
function timeAgo(ts) {
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

function hashColor(str) {
  // Deterministic pastel color from username
  const colors = [
    '#E74C3C', '#2980B9', '#27AE60', '#F39C12',
    '#8E44AD', '#16A085', '#E67E22', '#1ABC9C',
    '#9B59B6', '#B87333', '#2ECC71', '#3498DB',
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function Avatar({ name, size = 24 }) {
  const color = hashColor(name || '?')
  const initials = (name || '?').slice(0, 2).toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color + '33', border: `1.5px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700, color, flexShrink: 0,
      letterSpacing: '-0.5px',
    }}>
      {initials}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ChatPanel({ currentUser }) {
  // currentUser should be: { id, name, email } from your auth context
  const user = currentUser || { id: 'guest', name: 'Guest' }

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [onlineCount, setOnlineCount] = useState(1)
  const [unread, setUnread] = useState(0)
  const [error, setError] = useState(null)

  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const channelRef = useRef(null)

  // ── Fetch last 50 messages on mount ──────────────────────────────────────
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50)
      if (error) { setError('Could not load messages'); return }
      setMessages(data || [])
    }
    fetchMessages()
  }, [])

  // ── Supabase Realtime subscription ───────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages(prev => {
            // avoid duplicates
            if (prev.find(m => m.id === payload.new.id)) return prev
            return [...prev, payload.new]
          })
          if (!isOpen) setUnread(n => n + 1)
        }
      )
      .subscribe()

    channelRef.current = channel
    return () => supabase.removeChannel(channel)
  }, [isOpen])

  // ── Presence for online count ─────────────────────────────────────────────
  useEffect(() => {
    const presence = supabase.channel('chat-presence')
    presence
      .on('presence', { event: 'sync' }, () => {
        const state = presence.presenceState()
        setOnlineCount(Object.keys(state).length || 1)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presence.track({ user_id: user.id, name: user.name })
        }
      })
    return () => supabase.removeChannel(presence)
  }, [user.id, user.name])

  // ── Auto scroll to bottom ─────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Clear unread when panel opens ─────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    setInput('')

    const { error } = await supabase.from('messages').insert({
      user_id: user.id,
      user_name: user.name,
      content: text,
    })

    if (error) setError('Failed to send. Try again.')
    setSending(false)
  }, [input, sending, user])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // ── Group consecutive messages from same user ─────────────────────────────
  const grouped = messages.reduce((acc, msg, i) => {
    const prev = messages[i - 1]
    const isOwn = msg.user_id === user.id
    const sameUser = prev && prev.user_id === msg.user_id
    const timeDiff = prev ? (new Date(msg.created_at) - new Date(prev.created_at)) / 1000 : 999
    acc.push({ ...msg, isOwn, showHeader: !sameUser || timeDiff > 120 })
    return acc
  }, [])

  return (
    <>
      {/* ── Toggle Button ── */}
      <button
        onClick={() => setIsOpen(o => !o)}
        style={{
          position: 'fixed', right: isOpen ? 352 : 0, top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 200,
          background: '#0D1B2A',
          border: '1px solid #B87333',
          borderRight: isOpen ? '1px solid #B87333' : 'none',
          borderRadius: isOpen ? '6px 0 0 6px' : '6px 0 0 6px',
          color: '#B87333',
          padding: '12px 7px',
          cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          transition: 'right 0.3s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '-2px 0 16px rgba(0,0,0,0.4)',
        }}
      >
        <span style={{ fontSize: '14px' }}>💬</span>
        <span style={{
          writingMode: 'vertical-rl', textOrientation: 'mixed',
          fontSize: '8px', fontWeight: 800, letterSpacing: '1.2px',
          color: '#B87333',
        }}>LIVE CHAT</span>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 4, right: 4,
            background: '#E74C3C', color: '#fff',
            borderRadius: '50%', width: 16, height: 16,
            fontSize: '8px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {/* ── Chat Panel ── */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '350px',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 199,
        display: 'flex', flexDirection: 'column',
        background: '#0A1628',
        borderLeft: '1px solid #B87333',
        boxShadow: '-4px 0 32px rgba(0,0,0,0.6)',
      }}>

        {/* Header */}
        <div style={{
          padding: '10px 14px',
          background: 'rgba(15,52,96,0.6)',
          borderBottom: '1px solid #0F3460',
          display: 'flex', alignItems: 'center', gap: '8px',
          flexShrink: 0,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#B87333', letterSpacing: '1px' }}>
                ◆ LIVE CHAT
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '3px',
                fontSize: '9px', color: '#27AE60', fontWeight: 600,
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%', background: '#27AE60',
                  animation: 'livePulse 2s infinite', display: 'inline-block',
                }} />
                {onlineCount} ONLINE
              </span>
            </div>
            <div style={{ fontSize: '9px', color: '#555', marginTop: '1px' }}>
              Chatting as <span style={{ color: '#B87333', fontWeight: 600 }}>{user.name}</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none', border: '1px solid #1a2a4a',
              color: '#555', borderRadius: '4px',
              padding: '3px 7px', cursor: 'pointer', fontSize: '11px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#B87333'; e.currentTarget.style.color = '#B87333' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a2a4a'; e.currentTarget.style.color = '#555' }}
          >✕</button>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            padding: '6px 14px', background: 'rgba(231,76,60,0.15)',
            borderBottom: '1px solid #E74C3C',
            fontSize: '10px', color: '#E74C3C',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            {error}
            <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#E74C3C', cursor: 'pointer', fontSize: '11px' }}>✕</button>
          </div>
        )}

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '12px 10px',
          display: 'flex', flexDirection: 'column', gap: '2px',
          scrollbarWidth: 'thin', scrollbarColor: '#0F3460 transparent',
        }}>
          {messages.length === 0 && (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '8px',
              color: '#333', paddingTop: '40px',
            }}>
              <span style={{ fontSize: '28px' }}>💬</span>
              <span style={{ fontSize: '11px', color: '#444', textAlign: 'center' }}>
                No messages yet.<br />Be the first to say something.
              </span>
            </div>
          )}

          {grouped.map((msg) => {
            const color = hashColor(msg.user_name || 'anon')
            return (
              <div key={msg.id} style={{
                display: 'flex',
                flexDirection: msg.isOwn ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: '6px',
                marginTop: msg.showHeader ? '10px' : '2px',
              }}>
                {/* Avatar — only show on header message */}
                <div style={{ width: 24, flexShrink: 0, alignSelf: 'flex-end', marginBottom: '2px' }}>
                  {msg.showHeader && <Avatar name={msg.user_name} size={24} />}
                </div>

                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: msg.isOwn ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                }}>
                  {/* Username + time */}
                  {msg.showHeader && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      marginBottom: '3px',
                      flexDirection: msg.isOwn ? 'row-reverse' : 'row',
                    }}>
                      <span style={{ fontSize: '9px', fontWeight: 700, color }}>{msg.user_name}</span>
                      <span style={{ fontSize: '8px', color: '#333' }}>{timeAgo(msg.created_at)}</span>
                    </div>
                  )}

                  {/* Bubble */}
                  <div style={{
                    padding: '7px 10px',
                    borderRadius: msg.isOwn ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                    background: msg.isOwn
                      ? 'rgba(184,115,51,0.18)'
                      : 'rgba(15,52,96,0.7)',
                    border: msg.isOwn
                      ? '1px solid rgba(184,115,51,0.4)'
                      : '1px solid #0F3460',
                    fontSize: '12px',
                    color: '#ECECEC',
                    lineHeight: 1.45,
                    wordBreak: 'break-word',
                    maxWidth: '100%',
                  }}>
                    {msg.content}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{
          padding: '10px', borderTop: '1px solid #0F3460',
          background: 'rgba(10,22,40,0.95)', flexShrink: 0,
        }}>
          <div style={{
            display: 'flex', gap: '8px', alignItems: 'flex-end',
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              style={{
                flex: 1,
                background: '#0D1B2A',
                border: '1px solid #0F3460',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                color: '#ECECEC',
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit',
                lineHeight: 1.4,
                maxHeight: '80px',
                overflowY: 'auto',
                transition: 'border-color 0.15s',
                scrollbarWidth: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#B87333'}
              onBlur={e => e.target.style.borderColor = '#0F3460'}
              onInput={e => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              style={{
                width: 36, height: 36, borderRadius: '8px',
                background: input.trim() ? '#B87333' : 'rgba(184,115,51,0.15)',
                border: '1px solid #B87333',
                color: input.trim() ? '#fff' : '#B87333',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', flexShrink: 0,
                transition: 'all 0.15s',
                opacity: sending ? 0.6 : 1,
              }}
            >
              {sending ? '…' : '→'}
            </button>
          </div>
          <div style={{ fontSize: '8px', color: '#2a3a5a', marginTop: '5px', textAlign: 'right' }}>
            Enter to send · Shift+Enter for new line
          </div>
        </div>
      </div>

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
      `}</style>
    </>
  )
}
