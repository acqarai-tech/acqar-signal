// import { useEffect, useRef, useState } from 'react'
// import { supabase } from '../lib/supabase'

// const nameColor = (name = '') => {
//   const colors = [
//     '#E8A838', '#E74C3C', '#3498DB', '#2ECC71',
//     '#9B59B6', '#1ABC9C', '#E67E22', '#D4AC0D',
//     '#F39C12', '#16A085', '#27AE60', '#8E44AD',
//   ]
//   let hash = 0
//   for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
//   return colors[Math.abs(hash) % colors.length]
// }

// function formatTime(ts) {
//   const d = new Date(ts)
//   return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
// }

// const GUEST_NAME = 'Guest_' + Math.random().toString(36).slice(2, 6).toUpperCase()

// // ChatPanel renders ONLY messages + input.
// // On mobile: Dashboard drawer owns the header and close button.
// // On desktop: pass onClose prop to show the header with a close button.
// export default function ChatPanel({ onClose }) {
//   const myName = GUEST_NAME

//   const [messages, setMessages] = useState([])
//   const [input, setInput] = useState('')
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [msgCount, setMsgCount] = useState(null)

//   const bottomRef = useRef(null)
//   const inputRef = useRef(null)

//   // ── Fetch messages ────────────────────────────────────────────────────────
//   useEffect(() => {
//     const fetchMessages = async () => {
//       setLoading(true)
//       setError(null)
//       const { data, error } = await supabase
//         .from('messages')
//         .select('id, user_name, content, created_at')
//         .order('created_at', { ascending: true })
//         .limit(100)
//       if (error) { setError('Could not load: ' + error.message); setLoading(false); return }
//       setMessages(data || [])
//       setLoading(false)
//     }
//     fetchMessages()
//   }, [])

//   // ── Message count ─────────────────────────────────────────────────────────
//   useEffect(() => {
//     const fetchCount = async () => {
//       const { count } = await supabase
//         .from('messages')
//         .select('*', { count: 'exact', head: true })
//       if (count !== null) setMsgCount(count)
//     }
//     fetchCount()
//   }, [messages])

//   // ── Realtime ──────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const channel = supabase
//       .channel('chat-room-' + Math.random())
//       .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
//         setMessages(prev => {
//           if (prev.find(m => m.id === payload.new.id)) return prev
//           return [...prev, payload.new]
//         })
//       })
//       .subscribe()
//     return () => supabase.removeChannel(channel)
//   }, [])

//   // ── Auto scroll ───────────────────────────────────────────────────────────
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   // ── Send ──────────────────────────────────────────────────────────────────
//   const sendMessage = async (e) => {
//     e?.preventDefault()
//     const text = input.trim()
//     if (!text) return
//     setInput('')
//     const { error } = await supabase.from('messages').insert({
//       user_id: myName, user_name: myName, content: text,
//     })
//     if (error) setError('Failed to send: ' + error.message)
//   }

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e) }
//   }

//   return (
//     <div style={{
//       height: '100%',
//       display: 'flex',
//       flexDirection: 'column',
//       background: '#111827',
//       fontFamily: "'Inter', sans-serif",
//       overflow: 'hidden',
//     }}>

//       {/* Header — only shown on desktop (when onClose prop is passed) */}
//       {onClose && (
//         <div style={{
//           display: 'flex', alignItems: 'center', gap: '7px',
//           padding: '0 12px',
//           background: '#0d1117',
//           borderBottom: '1px solid #1f2937',
//           flexShrink: 0,
//           height: 44,
//         }}>
//           <div style={{
//             width: 22, height: 22, borderRadius: '6px', background: '#1f2937',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: '11px', flexShrink: 0,
//           }}>💬</div>

//           <span style={{ fontSize: '12px', fontWeight: 800, color: '#f9fafb', letterSpacing: '1px' }}>CHAT</span>
//           <span style={{ fontSize: '10px', color: '#4b5563' }}>as</span>
//           <span style={{ fontSize: '10px', fontWeight: 700, color: nameColor(myName) }}>{myName}</span>

//           <div style={{ flex: 1 }} />

//           <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//             <span style={{ fontSize: '13px' }}>🟠</span>
//             <span style={{ fontSize: '12px', fontWeight: 700, color: '#f9fafb' }}>
//               {msgCount !== null ? msgCount.toLocaleString() : '—'}
//             </span>
//           </div>

//           <button
//             onClick={() => window.location.reload()}
//             style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', fontSize: '15px', padding: '4px' }}
//           >↺</button>

//           <button
//             onClick={onClose}
//             style={{
//               width: 36, height: 36, background: '#1f2937',
//               border: '1px solid #374151', borderRadius: '6px',
//               color: '#f9fafb', cursor: 'pointer', fontSize: '16px',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
//             }}
//           >✕</button>
//         </div>
//       )}

//       {/* Error */}
//       {error && (
//         <div style={{
//           padding: '5px 12px', background: 'rgba(239,68,68,0.15)',
//           borderBottom: '1px solid rgba(239,68,68,0.4)',
//           fontSize: '10px', color: '#f87171',
//           display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
//         }}>
//           {error}
//           <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>✕</button>
//         </div>
//       )}

//       {/* Messages */}
//       <div style={{
//         flex: 1, overflowY: 'auto', padding: '4px 0 8px',
//         scrollbarWidth: 'thin', scrollbarColor: '#1f2937 transparent',
//         WebkitOverflowScrolling: 'touch',
//       }}>
//         {loading && (
//           <div style={{ fontSize: '11px', color: '#4b5563', textAlign: 'center', padding: '24px' }}>
//             Loading messages...
//           </div>
//         )}
//         {!loading && messages.length === 0 && (
//           <div style={{ fontSize: '11px', color: '#4b5563', textAlign: 'center', padding: '24px' }}>
//             No messages yet. Say something!
//           </div>
//         )}
//         {messages.map((msg, i) => {
//           const isOwn = msg.user_name === myName
//           const color = isOwn ? '#B87333' : nameColor(msg.user_name)
//           const prevMsg = messages[i - 1]
//           const sameUser = prevMsg && prevMsg.user_name === msg.user_name
//           const timeDiff = prevMsg ? (new Date(msg.created_at) - new Date(prevMsg.created_at)) / 1000 : 999
//           const showHeader = !sameUser || timeDiff > 120
//           return (
//             <div key={msg.id} style={{
//               padding: showHeader ? '10px 14px 2px' : '1px 14px',
//               background: isOwn ? 'rgba(184,115,51,0.05)' : 'transparent',
//               borderLeft: isOwn ? '2px solid rgba(184,115,51,0.5)' : '2px solid transparent',
//             }}>
//               {showHeader && (
//                 <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '2px' }}>
//                   <span style={{ fontSize: '13px', fontWeight: 700, color }}>{msg.user_name}</span>
//                   <span style={{ fontSize: '9px', color: '#374151' }}>{formatTime(msg.created_at)}</span>
//                 </div>
//               )}
//               <div style={{ fontSize: '13px', color: '#d1d5db', lineHeight: 1.5, wordBreak: 'break-word' }}>
//                 {msg.content}
//               </div>
//             </div>
//           )
//         })}
//         <div ref={bottomRef} />
//       </div>

//       {/* Input */}
//       <div style={{
//         padding: '10px 12px',
//         paddingBottom: 'max(10px, env(safe-area-inset-bottom, 10px))',
//         borderTop: '1px solid #1f2937',
//         background: '#0d1117', flexShrink: 0,
//         display: 'flex', gap: '8px', alignItems: 'center',
//       }}>
//         <input
//           ref={inputRef}
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type a message..."
//           maxLength={200}
//           style={{
//             flex: 1, padding: '10px 14px', fontSize: '16px',
//             background: '#1f2937', border: '1px solid #374151',
//             color: '#f9fafb', borderRadius: '8px', outline: 'none',
//             transition: 'border-color 0.15s',
//             WebkitAppearance: 'none',
//           }}
//           onFocus={e => e.target.style.borderColor = '#6366f1'}
//           onBlur={e => e.target.style.borderColor = '#374151'}
//         />
//         <button
//           type="button"
//           onClick={sendMessage}
//           disabled={!input.trim()}
//           style={{
//             width: 40, height: 40, borderRadius: '8px',
//             background: input.trim() ? '#6366f1' : '#1f2937',
//             border: 'none', color: 'white',
//             cursor: input.trim() ? 'pointer' : 'default',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: '16px', flexShrink: 0,
//             transition: 'background 0.15s',
//             touchAction: 'manipulation',
//             WebkitTapHighlightColor: 'transparent',
//           }}
//         >↗</button>
//       </div>
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

function getDisplayName(user) {
  if (!user) return null
  const meta = user.user_metadata || {}
  if (meta.full_name) return meta.full_name
  if (meta.name) return meta.name
  if (user.email) return user.email.split('@')[0]
  return 'User_' + user.id.slice(0, 6).toUpperCase()
}

export default function ChatPanel({ onClose }) {

  // ── Auth ──────────────────────────────────────────────────────────────────
  const [authUser, setAuthUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAuthUser(data?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // ── Fetch name from users table ───────────────────────────────────────────
  const [dbName, setDbName] = useState(null)

  useEffect(() => {
    if (!authUser?.email) return
    supabase
      .from('users')
      .select('name')
      .eq('email', authUser.email)
      .single()
      .then(({ data }) => {
        if (data?.name) setDbName(data.name)
      })
  }, [authUser])

  const myName = dbName ?? (authUser ? getDisplayName(authUser) : null)

  // ── Chat state ────────────────────────────────────────────────────────────
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
      if (error) { setError('Could not load: ' + error.message); setLoading(false); return }
      setMessages(data || [])
      setLoading(false)
    }
    fetchMessages()
  }, [])

  // ── Message count ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
      if (count !== null) setMsgCount(count)
    }
    fetchCount()
  }, [messages])

  // ── Realtime ──────────────────────────────────────────────────────────────
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
    e?.preventDefault()
    if (!authUser || !myName) return
    const text = input.trim()
    if (!text) return
    setInput('')
    const { error } = await supabase.from('messages').insert({
      user_id: authUser.id,
      user_name: myName,
      content: text,
    })
    if (error) setError('Failed to send: ' + error.message)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e) }
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

      {/* Header — only shown when onClose prop is passed (desktop + mobile drawer) */}
      {onClose && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '0 12px',
          background: '#0d1117',
          borderBottom: '1px solid #1f2937',
          flexShrink: 0,
          height: 44,
          position: 'relative',
          zIndex: 10,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: '6px', background: '#1f2937',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', flexShrink: 0,
          }}>💬</div>

          <span style={{ fontSize: '12px', fontWeight: 800, color: '#f9fafb', letterSpacing: '1px' }}>CHAT</span>

          {myName ? (
            <>
              <span style={{ fontSize: '10px', color: '#4b5563' }}>as</span>
              <span style={{
                fontSize: '10px', fontWeight: 700,
                color: nameColor(myName),
                maxWidth: '140px', overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{myName}</span>
            </>
          ) : (
            <span style={{
              fontSize: '10px', fontWeight: 600, color: '#ef4444',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              padding: '1px 7px', borderRadius: '4px',
            }}>Not signed in</span>
          )}

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '13px' }}>🟠</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#f9fafb' }}>
              {msgCount !== null ? msgCount.toLocaleString() : '—'}
            </span>
          </div>

          <button
            onClick={() => window.location.reload()}
            style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', fontSize: '15px', padding: '4px' }}
          >↺</button>

          <button
            onClick={onClose}
            style={{
              width: 36, height: 36, background: '#1f2937',
              border: '1px solid #374151', borderRadius: '6px',
              color: '#f9fafb', cursor: 'pointer', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >✕</button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          padding: '5px 12px', background: 'rgba(239,68,68,0.15)',
          borderBottom: '1px solid rgba(239,68,68,0.4)',
          fontSize: '10px', color: '#f87171',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          {error}
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '4px 0 8px',
        scrollbarWidth: 'thin', scrollbarColor: '#1f2937 transparent',
        WebkitOverflowScrolling: 'touch',
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
          const timeDiff = prevMsg ? (new Date(msg.created_at) - new Date(prevMsg.created_at)) / 1000 : 999
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

      {/* Input */}
      <div style={{
        padding: '10px 12px',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom, 10px))',
        borderTop: '1px solid #1f2937',
        background: '#0d1117', flexShrink: 0,
        display: 'flex', gap: '8px', alignItems: 'center',
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={myName ? 'Type a message...' : 'Sign in to chat'}
          maxLength={200}
          disabled={!myName}
          style={{
            flex: 1, padding: '10px 14px', fontSize: '16px',
            background: myName ? '#1f2937' : '#161b22',
            border: '1px solid #374151',
            color: myName ? '#f9fafb' : '#4b5563',
            borderRadius: '8px', outline: 'none',
            transition: 'border-color 0.15s',
            WebkitAppearance: 'none',
            cursor: myName ? 'text' : 'not-allowed',
          }}
          onFocus={e => { if (myName) e.target.style.borderColor = '#6366f1' }}
          onBlur={e => e.target.style.borderColor = '#374151'}
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={!input.trim() || !myName}
          style={{
            width: 40, height: 40, borderRadius: '8px',
            background: input.trim() && myName ? '#6366f1' : '#1f2937',
            border: 'none', color: 'white',
            cursor: input.trim() && myName ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', flexShrink: 0,
            transition: 'background 0.15s',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
        >↗</button>
      </div>
    </div>
  )
}
