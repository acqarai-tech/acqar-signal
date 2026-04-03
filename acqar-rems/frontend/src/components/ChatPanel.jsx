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


// const SEEDED_MESSAGES = [
//   { id: 's1', user_name: 'Khalid Al Mansouri', content: 'Ramadan 2026 just closed with $13.8B in Dubai real estate deals — 15,196 transactions, up 29.7% in value. Demand defying conflict and every pessimistic forecast.', created_at: new Date(Date.now() - 28 * 60000).toISOString() },
// { id: 's2', user_name: 'Priya Nair', content: 'Dubai issued Law No. 4 of 2026 on shared housing this week. Fines up to $272,000 for violations. Regulatory tightening is accelerating — smart money is already pricing this in.', created_at: new Date(Date.now() - 26 * 60000).toISOString() },
// { id: 's3', user_name: 'James Crawford', content: 'Property enquiries up 38% week-on-week per Arabian Business. Buyers are staying active despite regional tensions. Long-term demand signals are actually strengthening, not weakening.', created_at: new Date(Date.now() - 24 * 60000).toISOString() },
// { id: 's4', user_name: 'Sara Al Hashimi', content: '$25M Armani home sold on Palm Jumeirah last week. Branded residences are completely insulated from sentiment. My JVC units feel very different — tenants pushing hard on renewals with all the new supply.', created_at: new Date(Date.now() - 22 * 60000).toISOString() },
// { id: 's5', user_name: 'Khalid Al Mansouri', content: 'Dubai PropTech whitepaper from DIFC — sector could generate $14.4B annually by 2033. That is not a niche story anymore. Technology is becoming core infrastructure for this market.', created_at: new Date(Date.now() - 20 * 60000).toISOString() },
// { id: 's6', user_name: 'Priya Nair', content: 'Aldar confirmed $1.28B in contracts awarded this week and says 2026 handover schedule is unaffected by conflict. Developer resilience is becoming a key selection criterion right now.', created_at: new Date(Date.now() - 18 * 60000).toISOString() },
// { id: 's7', user_name: 'Marco Ferretti', content: 'First time buyer here — AED 1.8M budget, end-use plus some upside. Seeing a lot of noise in the market right now. Business Bay or Dubai Hills? Trying to cut through the conflict anxiety.', created_at: new Date(Date.now() - 16 * 60000).toISOString() },
// { id: 's8', user_name: 'James Crawford', content: 'Marco — Dubai Hills, no question right now. Resale velocity is strong, developer credibility is high, lifestyle fundamentals are solid. Business Bay yields more but Hills gives you better long-term positioning.', created_at: new Date(Date.now() - 15 * 60000).toISOString() },
// { id: 's9', user_name: 'Sara Al Hashimi', content: 'Marco also look at the $2.9B in transactions last week alone — 2,785 sales including a $13M home in Jumeirah. The market is not pausing. Buyers who wait for calm usually miss the entry.', created_at: new Date(Date.now() - 13 * 60000).toISOString() },
// { id: 's10', user_name: 'Khalid Al Mansouri', content: 'Select Group confirmed ARIA, SARIA, ORISE, SENSIA and THE MURAL all advancing on schedule. Jannat in Midtown delivering 3 months early. Execution credibility is the new marketing in 2026.', created_at: new Date(Date.now() - 11 * 60000).toISOString() },
// { id: 's11', user_name: 'Priya Nair', content: 'Dubai RE services hit 282,661 transactions and 563,920 customers in 2025 — 26,044 permits issued. This market has genuine depth now. Not a speculative bubble. Structural, demographic demand.', created_at: new Date(Date.now() - 9 * 60000).toISOString() },
// { id: 's12', user_name: 'Marco Ferretti', content: 'Reassuring numbers. One last thing — Golden Visa still triggers at AED 2M for ready property? Trying to structure this so the asset and the residency work together.', created_at: new Date(Date.now() - 7 * 60000).toISOString() },
// { id: 's13', user_name: 'James Crawford', content: 'Still AED 2M for ready property Golden Visa. Off-plan only counts once fully paid. Most of my international buyers are structuring around this threshold — they are buying residency as much as real estate.', created_at: new Date(Date.now() - 5 * 60000).toISOString() },
// { id: 's14', user_name: 'Sara Al Hashimi', content: 'Dubai RE sector saw $4.5B in transactions last week — 3,594 sales. Even with flight suspensions and regional disruption the transaction engine is running. This market has proven its resilience now.', created_at: new Date(Date.now() - 3 * 60000).toISOString() },
// { id: 's15', user_name: 'Priya Nair', content: 'ACQAR Signal had the Ramadan transaction surge flagged as S4 before Arabian Business published. That 12-hour lead is exactly the difference between positioning early and reading about it after.', created_at: new Date(Date.now() - 1 * 60000).toISOString() },
// ]
// export default function ChatPanel({ onClose }) {

//   // ── Real logged-in user from Supabase ──
//   const params = new URLSearchParams(window.location.search)
// const urlName = params.get('username') || 'User'
// const urlUserId = params.get('userid') || ''
// const [authUser, setAuthUser] = useState(urlUserId ? { id: urlUserId } : null)
// const [myName, setMyName] = useState(urlName)

// //   useEffect(() => {
// //     // Get current session
// //    const loadUser = async () => {
// //   const { data } = await supabase.auth.getSession()
// //   const user = data?.session?.user ?? null
// //   if (user) {
// //     setAuthUser(user)
// //     const { data: userRow } = await supabase
// //       .from('users')
// //       .select('name')
// //       .eq('id', user.id)
// //       .maybeSingle()
// //    const name =
// //   user.user_metadata?.name ||
// //   user.user_metadata?.full_name ||
// //   user.email?.split('@')[0] ||
// //   'User'
// // setMyName(name)
// //   } else {
// //     const isAdmin = localStorage.getItem('admin_auth') === 'true'
// //     if (isAdmin) {
// //       setAuthUser({ id: 'admin-001', email: 'admin@acqar.com' })
// //       setMyName('Admin')
// //     }
// //   }
// // }
// // loadUser()

// //     // Listen for auth changes
// //    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
// //   const user = session?.user ?? null
// //   if (user) {
// //     setAuthUser(user)
// //     supabase
// //       .from('users')
// //       .select('name')
// //       .eq('id', user.id)
// //       .maybeSingle()
// //       .then(({ data: userRow }) => {
// //         const name =
// //   user.user_metadata?.name ||
// //   user.user_metadata?.full_name ||
// //   user.email?.split('@')[0] ||
// //   'User'
// // setMyName(name)
// //       })
// //   } else {
// //     const isAdmin = localStorage.getItem('admin_auth') === 'true'
// //     if (isAdmin) {
// //       setAuthUser({ id: 'admin-001', email: 'admin@acqar.com' })
// //       setMyName('Admin')
// //     } else {
// //       setAuthUser(null)
// //       setMyName('User')
// //     }
// //   }
// // })
// //     return () => listener?.subscription?.unsubscribe()
// //   }, [])

//   // ── Chat state ──
 
// const [messages, setMessages] = useState([])
//   const [input, setInput] = useState('')
//   const [loading, setLoading] = useState(false)
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
//      if (error) { setLoading(false); return }
// const realMessages = data || []
// setMessages([...SEEDED_MESSAGES, ...realMessages])
// setLoading(false)
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
//  const sendMessage = async (e) => {
//   e?.preventDefault()
//   if (!myName || !authUser) return
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
//           disabled={false}
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
//          disabled={!input.trim()}
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


// ── Daily AI chat generator ──
const TODAY_KEY = `acqar_chat_${new Date().toISOString().slice(0, 10)}`

// Clean up yesterday's cache
Object.keys(localStorage)
  .filter(k => k.startsWith('acqar_chat_') && k !== TODAY_KEY)
  .forEach(k => localStorage.removeItem(k))

const PERSONA_NAMES = {
  owner:    'Sara Al Hashimi',
  buyer:    'Marco Ferretti',
  investor: 'Khalid Al Mansouri',
  broker:   'James Crawford',
}

async function generateDailyChat() {
  // Return cached version if already generated today
  const cached = localStorage.getItem(TODAY_KEY)
  if (cached) return JSON.parse(cached)

  // Fetch today's UAE RE news headlines via Claude web_search tool
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      system: `You are simulating a realistic Dubai real estate group chat for ${new Date().toDateString()}.
You have 4 participants:
- Sara Al Hashimi (property OWNER — mid-market JVC landlord, practical, watches rental yields and regulation)
- Marco Ferretti (first-time BUYER — AED 1.8M budget, end-use, wants Golden Visa, cautious)
- Khalid Al Mansouri (INVESTOR — HNW, off-plan, tracks transaction volumes and developer credibility)
- James Crawford (BROKER — experienced, gives market guidance, references specific areas)

Search for today's UAE real estate news headlines first, then generate exactly 15 chat messages.
Rules:
- Each message must reference actual news from today or this week
- Messages flow as a natural conversation — they reply to each other
- Each message is 1–3 sentences, conversational, no fluff
- Return ONLY a JSON array, no markdown, no preamble:
[{"user_name":"Sara Al Hashimi","content":"...","role":"owner"},...]`,
      messages: [{
        role: 'user',
        content: `Search for today's UAE Dubai real estate news (${new Date().toDateString()}) and generate the 15-message group chat JSON.`
      }]
    })
  })

  const data = await res.json()
  // Extract the text block (Claude returns text after tool use)
  const textBlock = data.content?.find(b => b.type === 'text')
  let messages = []
  try {
    const clean = textBlock?.text?.replace(/```json|```/g, '').trim()
    messages = JSON.parse(clean)
  } catch {
    messages = []
  }

  // Shape into ChatPanel format with staggered timestamps
  const now = Date.now()
  const shaped = messages.map((m, i) => ({
    id: `daily_${i}`,
    user_name: m.user_name,
    content: m.content,
    created_at: new Date(now - (messages.length - i) * 2 * 60000).toISOString()
  }))

  localStorage.setItem(TODAY_KEY, JSON.stringify(shaped))
  return shaped
}
export default function ChatPanel({ onClose }) {

  // ── Real logged-in user from Supabase ──
  const params = new URLSearchParams(window.location.search)
const urlName = params.get('username') || 'User'
const urlUserId = params.get('userid') || ''
const [authUser, setAuthUser] = useState(urlUserId ? { id: urlUserId } : null)
const [myName, setMyName] = useState(urlName)

//   useEffect(() => {
//     // Get current session
//    const loadUser = async () => {
//   const { data } = await supabase.auth.getSession()
//   const user = data?.session?.user ?? null
//   if (user) {
//     setAuthUser(user)
//     const { data: userRow } = await supabase
//       .from('users')
//       .select('name')
//       .eq('id', user.id)
//       .maybeSingle()
//    const name =
//   user.user_metadata?.name ||
//   user.user_metadata?.full_name ||
//   user.email?.split('@')[0] ||
//   'User'
// setMyName(name)
//   } else {
//     const isAdmin = localStorage.getItem('admin_auth') === 'true'
//     if (isAdmin) {
//       setAuthUser({ id: 'admin-001', email: 'admin@acqar.com' })
//       setMyName('Admin')
//     }
//   }
// }
// loadUser()

//     // Listen for auth changes
//    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//   const user = session?.user ?? null
//   if (user) {
//     setAuthUser(user)
//     supabase
//       .from('users')
//       .select('name')
//       .eq('id', user.id)
//       .maybeSingle()
//       .then(({ data: userRow }) => {
//         const name =
//   user.user_metadata?.name ||
//   user.user_metadata?.full_name ||
//   user.email?.split('@')[0] ||
//   'User'
// setMyName(name)
//       })
//   } else {
//     const isAdmin = localStorage.getItem('admin_auth') === 'true'
//     if (isAdmin) {
//       setAuthUser({ id: 'admin-001', email: 'admin@acqar.com' })
//       setMyName('Admin')
//     } else {
//       setAuthUser(null)
//       setMyName('User')
//     }
//   }
// })
//     return () => listener?.subscription?.unsubscribe()
//   }, [])

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

    // Load AI-generated daily chat (cached per day)
    const dailyChat = await generateDailyChat()

    const { data, error } = await supabase
      .from('messages')
      .select('id, user_name, content, created_at')
      .order('created_at', { ascending: true })
      .limit(100)

    if (error) { setLoading(false); return }
    const realMessages = data || []

    // Daily AI chat comes first, then real user messages on top
    setMessages([...dailyChat, ...realMessages])
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
          disabled={false}
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
         disabled={!input.trim()}
          style={{
            width: 40, height: 40, borderRadius: '8px',
            background: input.trim() ? '#6366f1' : '#1f2937',
            border: 'none', color: 'white',
            cursor: input.trim() ? 'pointer' : 'default',
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
