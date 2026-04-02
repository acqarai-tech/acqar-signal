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

// export default function ChatPanel({ onClose }) {

//   // ── Real logged-in user from Supabase ──
//   const [authUser, setAuthUser] = useState(null)
//   const [myName, setMyName] = useState('User')

//   useEffect(() => {
//     // Get current session
//     supabase.auth.getSession().then(({ data }) => {
//       const user = data?.session?.user ?? null
//       if (user) {
//         setAuthUser(user)
//         // Get name from metadata or email
//         const name =
//           user.user_metadata?.name ||
//           user.user_metadata?.full_name ||
//           user.email?.split('@')[0] ||
//           'User'
//         setMyName(name)
//       } else {
//         // Check admin login
//         const isAdmin = localStorage.getItem('admin_auth') === 'true'
//         if (isAdmin) {
//           setAuthUser({ id: 'admin-001', email: 'admin@acqar.com' })
//           setMyName('Admin')
//         }
//       }
//     })

//     // Listen for auth changes
//     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//       const user = session?.user ?? null
//       if (user) {
//         setAuthUser(user)
//         const name =
//           user.user_metadata?.name ||
//           user.user_metadata?.full_name ||
//           user.email?.split('@')[0] ||
//           'User'
//         setMyName(name)
//       } else {
//         const isAdmin = localStorage.getItem('admin_auth') === 'true'
//         if (isAdmin) {
//           setAuthUser({ id: 'admin-001', email: 'admin@acqar.com' })
//           setMyName('Admin')
//         } else {
//           setAuthUser(null)
//           setMyName('User')
//         }
//       }
//     })

//     return () => listener?.subscription?.unsubscribe()
//   }, [])

//   // ── Chat state ──
//   const [messages, setMessages] = useState([])
//   const [input, setInput] = useState('')
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [msgCount, setMsgCount] = useState(null)

//   const bottomRef = useRef(null)
//   const inputRef = useRef(null)

//   // ── Fetch messages ──
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

//   // ── Message count ──
//   useEffect(() => {
//     const fetchCount = async () => {
//       const { count } = await supabase
//         .from('messages')
//         .select('*', { count: 'exact', head: true })
//       if (count !== null) setMsgCount(count)
//     }
//     fetchCount()
//   }, [messages])

//   // ── Realtime ──
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

//   // ── Auto scroll ──
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   // ── Send ──
//   const sendMessage = async (e) => {
//     e?.preventDefault()
//     if (!myName || !authUser) return
//     const text = input.trim()
//     if (!text) return
//     setInput('')
//     const { error } = await supabase.from('messages').insert({
//       user_id: authUser.id,
//       user_name: myName,
//       content: text,
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
//       pointerEvents: 'auto',
//     }}>

//       {/* Header */}
//       {onClose && (
//         <div style={{
//           display: 'flex', alignItems: 'center', gap: '7px',
//           padding: '0 12px',
//           background: '#0d1117',
//           borderBottom: '1px solid #1f2937',
//           flexShrink: 0,
//           height: 44,
//           position: 'sticky',
//           top: 0,
//           zIndex: 9999,
//         }}>
//           <div style={{
//             width: 22, height: 22, borderRadius: '6px', background: '#1f2937',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: '11px', flexShrink: 0,
//           }}>💬</div>

//           <span style={{ fontSize: '12px', fontWeight: 800, color: '#f9fafb', letterSpacing: '1px' }}>CHAT</span>

//           <span style={{ fontSize: '10px', color: '#4b5563' }}>as</span>
//           <span style={{
//             fontSize: '10px', fontWeight: 700,
//             color: nameColor(myName),
//             maxWidth: '140px', overflow: 'hidden',
//             textOverflow: 'ellipsis', whiteSpace: 'nowrap',
//           }}>{myName}</span>

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
//             onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); onClose() }}
//             onTouchStart={(e) => { e.stopPropagation(); e.preventDefault(); onClose() }}
//             onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClose() }}
//             style={{
//               width: 36, height: 36, background: '#1f2937',
//               border: '1px solid #374151', borderRadius: '6px',
//               color: '#f9fafb', cursor: 'pointer', fontSize: '16px',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               touchAction: 'manipulation',
//               WebkitTapHighlightColor: 'transparent',
//               position: 'relative',
//               zIndex: 999,
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
//           placeholder={authUser ? `Message as ${myName}...` : 'Sign in to chat...'}
//           maxLength={200}
//           disabled={!authUser}
//           style={{
//             flex: 1, padding: '10px 14px', fontSize: '16px',
//             background: '#1f2937',
//             border: '1px solid #374151',
//             color: '#f9fafb',
//             borderRadius: '8px', outline: 'none',
//             transition: 'border-color 0.15s',
//             WebkitAppearance: 'none',
//             cursor: authUser ? 'text' : 'not-allowed',
//             opacity: authUser ? 1 : 0.5,
//           }}
//           onFocus={e => e.target.style.borderColor = '#6366f1'}
//           onBlur={e => e.target.style.borderColor = '#374151'}
//         />
//         <button
//           type="button"
//           onClick={sendMessage}
//           disabled={!input.trim() || !authUser}
//           style={{
//             width: 40, height: 40, borderRadius: '8px',
//             background: input.trim() && authUser ? '#6366f1' : '#1f2937',
//             border: 'none', color: 'white',
//             cursor: input.trim() && authUser ? 'pointer' : 'default',
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


const SEEDED_MESSAGES = [
  { id: 's1', user_name: 'Khalid Al Mansouri', content: 'Anyone tracking the Palm Jumeirah land deal today? Dh1 billion+ at Royal Amwaj. Q1 2026 sales already up 23% YoY. Insane numbers.', created_at: new Date(Date.now() - 28 * 60000).toISOString() },
  { id: 's2', user_name: 'Priya Nair', content: 'Saw that. As an investor I\'m more focused on Creek Harbour and Festival City — Metro Blue Line connectivity is going to reprice those areas significantly in 2026.', created_at: new Date(Date.now() - 26 * 60000).toISOString() },
  { id: 's3', user_name: 'James Crawford', content: 'Agree on Creek Harbour. My buyers from Europe are asking specifically about metro-linked communities now. Walkability and commute time are becoming part of the pricing conversation.', created_at: new Date(Date.now() - 24 * 60000).toISOString() },
  { id: 's4', user_name: 'Sara Al Hashimi', content: 'I own 2 units in JVC. Rental yield holding at 8.9%. But renewals this year — tenants are negotiating harder. New supply coming in 2026/27 is giving them leverage.', created_at: new Date(Date.now() - 22 * 60000).toISOString() },
  { id: 's5', user_name: 'Khalid Al Mansouri', content: 'The fam Properties report said it perfectly — 2026 is logic-based buying. No more momentum decisions. Buyers are scrutinising developers, delivery timelines, resale logic.', created_at: new Date(Date.now() - 20 * 60000).toISOString() },
  { id: 's6', user_name: 'Priya Nair', content: 'Which is why I\'m staying away from off-plan in oversupplied areas. 42,000–45,000 new units expected to hit market this year. Ready stock in scarce locations is the play.', created_at: new Date(Date.now() - 18 * 60000).toISOString() },
  { id: 's7', user_name: 'Marco Ferretti', content: 'Looking to buy my first unit in Dubai. Budget AED 1.8M. Between Business Bay and Dubai Hills — which makes more sense for end-use plus some appreciation?', created_at: new Date(Date.now() - 16 * 60000).toISOString() },
  { id: 's8', user_name: 'James Crawford', content: 'Marco — Dubai Hills for lifestyle and long-term hold. Business Bay if rental income matters more to you. Both are solid but Hills has better resale velocity right now.', created_at: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 's9', user_name: 'Sara Al Hashimi', content: 'Marco also check Jumeirah Water Canal corridor — extending into Downtown and Business Bay. Driven Properties called it part of Dubai\'s emerging golden square. Limited future supply.', created_at: new Date(Date.now() - 13 * 60000).toISOString() },
  { id: 's10', user_name: 'Khalid Al Mansouri', content: 'DLD blockchain title deed pilot is live btw. Tokenisation is going to change how we trade. Faster transactions, more transparency. Long overdue for this market.', created_at: new Date(Date.now() - 11 * 60000).toISOString() },
  { id: 's11', user_name: 'Priya Nair', content: 'That tokenisation pilot is huge for fractional ownership. Opens Dubai RE to a completely different investor base globally. Dh1,676/sqft average still looks cheap vs London or Singapore.', created_at: new Date(Date.now() - 9 * 60000).toISOString() },
  { id: 's12', user_name: 'Marco Ferretti', content: 'Good points all. Also considering the Golden Visa angle — does the 10-year visa still apply at AED 2M threshold for ready properties?', created_at: new Date(Date.now() - 7 * 60000).toISOString() },
  { id: 's13', user_name: 'James Crawford', content: 'Yes still AED 2M for ready property Golden Visa. Off-plan needs to be fully paid at that value. Lots of my international clients use this as the entry trigger.', created_at: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 's14', user_name: 'Sara Al Hashimi', content: 'Palm Jebel Ali Phase 2 and Dubai Islands future phases launching 2026 onwards per Khaleej Times. Government-backed land banks coming to market. Worth watching for long horizon plays.', created_at: new Date(Date.now() - 3 * 60000).toISOString() },
  { id: 's15', user_name: 'Priya Nair', content: 'ACQAR Signal picked up the Palm Jumeirah land deal as S5 alert this morning before any portal updated. That\'s the edge right there — acting before the market reprices.', created_at: new Date(Date.now() - 1 * 60000).toISOString() },
]
export default function ChatPanel({ onClose }) {

  // ── Real logged-in user from Supabase ──
  const [authUser, setAuthUser] = useState(null)
  const [myName, setMyName] = useState('User')

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      const user = data?.session?.user ?? null
      if (user) {
        setAuthUser(user)
        // Get name from metadata or email
        const name =
          user.user_metadata?.name ||
          user.user_metadata?.full_name ||
          user.email?.split('@')[0] ||
          'User'
        setMyName(name)
      } else {
        // Check admin login
        const isAdmin = localStorage.getItem('admin_auth') === 'true'
        if (isAdmin) {
          setAuthUser({ id: 'admin-001', email: 'admin@acqar.com' })
          setMyName('Admin')
        }
      }
    })

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null
      if (user) {
        setAuthUser(user)
        const name =
          user.user_metadata?.name ||
          user.user_metadata?.full_name ||
          user.email?.split('@')[0] ||
          'User'
        setMyName(name)
      } else {
        const isAdmin = localStorage.getItem('admin_auth') === 'true'
        if (isAdmin) {
          setAuthUser({ id: 'admin-001', email: 'admin@acqar.com' })
          setMyName('Admin')
        } else {
          setAuthUser(null)
          setMyName('User')
        }
      }
    })

    return () => listener?.subscription?.unsubscribe()
  }, [])

  // ── Chat state ──
 
const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [msgCount, setMsgCount] = useState(null)

  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // ── Fetch messages ──
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('messages')
        .select('id, user_name, content, created_at')
        .order('created_at', { ascending: true })
        .limit(100)
     if (error) { setLoading(false); return }
const realMessages = data || []
setMessages([...SEEDED_MESSAGES, ...realMessages])
setLoading(false)
    }
    fetchMessages()
  }, [])

  // ── Message count ──
  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
      if (count !== null) setMsgCount(count)
    }
    fetchCount()
  }, [messages])

  // ── Realtime ──
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

  // ── Auto scroll ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Send ──
  const sendMessage = async (e) => {
    e?.preventDefault()
    if (!myName || !authUser) return
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
      pointerEvents: 'auto',
    }}>

      {/* Header */}
      {onClose && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '0 12px',
          background: '#0d1117',
          borderBottom: '1px solid #1f2937',
          flexShrink: 0,
          height: 44,
          position: 'sticky',
          top: 0,
          zIndex: 9999,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: '6px', background: '#1f2937',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', flexShrink: 0,
          }}>💬</div>

          <span style={{ fontSize: '12px', fontWeight: 800, color: '#f9fafb', letterSpacing: '1px' }}>CHAT</span>

          <span style={{ fontSize: '10px', color: '#4b5563' }}>as</span>
          <span style={{
            fontSize: '10px', fontWeight: 700,
            color: nameColor(myName),
            maxWidth: '140px', overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{myName}</span>

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
            onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); onClose() }}
            onTouchStart={(e) => { e.stopPropagation(); e.preventDefault(); onClose() }}
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClose() }}
            style={{
              width: 36, height: 36, background: '#1f2937',
              border: '1px solid #374151', borderRadius: '6px',
              color: '#f9fafb', cursor: 'pointer', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              position: 'relative',
              zIndex: 999,
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
          placeholder={authUser ? `Message as ${myName}...` : 'Sign in to chat...'}
          maxLength={200}
          disabled={!authUser}
          style={{
            flex: 1, padding: '10px 14px', fontSize: '16px',
            background: '#1f2937',
            border: '1px solid #374151',
            color: '#f9fafb',
            borderRadius: '8px', outline: 'none',
            transition: 'border-color 0.15s',
            WebkitAppearance: 'none',
            cursor: authUser ? 'text' : 'not-allowed',
            opacity: authUser ? 1 : 0.5,
          }}
          onFocus={e => e.target.style.borderColor = '#6366f1'}
          onBlur={e => e.target.style.borderColor = '#374151'}
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={!input.trim() || !authUser}
          style={{
            width: 40, height: 40, borderRadius: '8px',
            background: input.trim() && authUser ? '#6366f1' : '#1f2937',
            border: 'none', color: 'white',
            cursor: input.trim() && authUser ? 'pointer' : 'default',
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
