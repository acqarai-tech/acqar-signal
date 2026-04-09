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


// // ── Daily AI chat generator ──
// const TODAY_KEY = `acqar_chat_${new Date().toISOString().slice(0, 10)}`

// // Clean up yesterday's cache
// Object.keys(localStorage)
//   .filter(k => k.startsWith('acqar_chat_') && k !== TODAY_KEY)
//   .forEach(k => localStorage.removeItem(k))

// const PERSONA_NAMES = {
//   owner:    'Sara Al Hashimi',
//   buyer:    'Marco Ferretti',
//   investor: 'Khalid Al Mansouri',
//   broker:   'James Crawford',
// }

// // ── Fallback messages (shows if backend is down) ──
// const FALLBACK_MESSAGES = [
//   { id: 'f1', user_name: 'Khalid Al Mansouri', content: 'Dubai transaction volumes continue to strengthen — off-plan demand holding firm across Business Bay and Creek Harbour.', created_at: new Date(Date.now() - 20 * 60000).toISOString() },
//   { id: 'f2', user_name: 'James Crawford', content: 'Strong buyer interest at AED 1.5–2M right now. Dubai Hills and JVC are the sweet spots for end-use buyers.', created_at: new Date(Date.now() - 18 * 60000).toISOString() },
//   { id: 'f3', user_name: 'Sara Al Hashimi', content: 'My JVC tenants just renewed above asking — 8.5% yield on a studio. Rental market is very tight right now.', created_at: new Date(Date.now() - 15 * 60000).toISOString() },
//   { id: 'f4', user_name: 'Marco Ferretti', content: 'Does the AED 2M Golden Visa threshold apply to off-plan or ready property only?', created_at: new Date(Date.now() - 12 * 60000).toISOString() },
//   { id: 'f5', user_name: 'James Crawford', content: 'Marco — ready property at AED 2M qualifies immediately. Off-plan only counts once fully paid.', created_at: new Date(Date.now() - 10 * 60000).toISOString() },
// ]

// // ── Build chat messages from backend events ──
// function buildMessagesFromEvents(events) {
//   const top = events.slice(0, 5)
//   const now = Date.now()
//   const personas = [
//     { name: 'Khalid Al Mansouri', role: 'investor' },
//     { name: 'James Crawford',     role: 'broker'   },
//     { name: 'Sara Al Hashimi',    role: 'owner'    },
//     { name: 'Marco Ferretti',     role: 'buyer'    },
//   ]
//   const openers = {
//     investor: (e) => `${e.title} — this is exactly the signal I track. ${e.location_name ? e.location_name + ' is moving fast.' : 'Transaction velocity is picking up across the board.'}`,
//     broker:   (e) => `Just had this land in my inbox: "${e.title}". ${e.location_name ? 'Clients in ' + e.location_name + ' should be paying attention.' : 'Worth watching closely this week.'}`,
//     owner:    (e) => `This hits landlords directly — ${e.title}. ${e.category === 'regulatory' ? 'Regulatory shifts like this always compress yields first.' : 'Watching how this plays out for my renewal cycle.'}`,
//     buyer:    (e) => `Should this change my search strategy? Seeing "${e.title}" in the news — hard to read as a first-timer.`,
//   }
//   const replies = {
//     investor: (e) => `Tracking ${e.location_name || 'this area'} closely. Developer execution credibility is the real differentiator right now.`,
//     broker:   (e) => `Consistent with what I'm seeing on the ground. Enquiries are up materially this week.`,
//     owner:    (e) => `${e.category === 'price_signal' ? 'Higher prices mean a better exit for me, but yields compress for new buyers.' : 'This directly affects my renewal strategy for Q3.'}`,
//     buyer:    (e) => `This is actually reassuring. James — does this shift the Business Bay vs Dubai Hills calculus for my AED 1.8M budget?`,
//   }

//   const chat = []
//   top.forEach((event, i) => {
//     const persona = personas[i % personas.length]
//     const replyPersona = personas[(i + 1) % personas.length]
//     chat.push({
//       id: `ev_${i}_a`,
//       user_name: persona.name,
//       content: openers[persona.role](event),
//       created_at: new Date(now - (top.length * 2 - i * 2) * 60000).toISOString()
//     })
//     chat.push({
//       id: `ev_${i}_b`,
//       user_name: replyPersona.name,
//       content: replies[replyPersona.role](event),
//       created_at: new Date(now - (top.length * 2 - i * 2 - 1) * 60000).toISOString()
//     })
//   })
//   return chat
// }

// // ── Daily chat generator — uses your own backend, no external API ──
// async function generateDailyChat() {
//   const cached = localStorage.getItem(TODAY_KEY)
//   if (cached) {
//     try { return JSON.parse(cached) } catch { localStorage.removeItem(TODAY_KEY) }
//   }

//   try {
//     // ✅ Use your own backend — already has real UAE RE events
//     const res = await fetch('/api/events/community-signals?limit=5', {
//       signal: AbortSignal.timeout(6000)
//     })
//     if (!res.ok) throw new Error(`HTTP ${res.status}`)

//     const data = await res.json()
//     const signals = data.signals || []
//     if (!signals.length) throw new Error('no signals')

//     console.log('✅ Live signals:', signals.length, signals[0]?.text)

//     // Convert signals → events shape for buildMessagesFromEvents
//     const events = signals.map(s => ({
//       title: s.text
//         .replace(/^[\u{1F300}-\u{1FFFF}]\s*/u, '') // strip emoji prefix
//         .trim(),
//       location_name: s.location || '',
//       category: s.category || 'transaction',
//     }))

//     const shaped = buildMessagesFromEvents(events)
//     localStorage.setItem(TODAY_KEY, JSON.stringify(shaped))
//     return shaped

//   } catch (err) {
//     console.warn('community-signals failed:', err.message, '— using fallback')
//     return FALLBACK_MESSAGES
//   }
// }
// // ── Helper: extract Dubai location from headline ──
// function extractLocation(title = '') {
//   const areas = ['Palm Jumeirah', 'Dubai Hills', 'Business Bay', 'Downtown Dubai',
//     'Dubai Marina', 'JVC', 'Creek Harbour', 'Jumeirah', 'DIFC', 'Dubai South',
//     'Abu Dhabi', 'Sharjah', 'RAK', 'Meydan', 'JBR']
//   return areas.find(a => title.includes(a)) || ''
// }

// // ── Helper: detect category from headline ──
// function extractCategory(title = '') {
//   const t = title.toLowerCase()
//   if (t.includes('regulation') || t.includes('law') || t.includes('rera') || t.includes('dld')) return 'regulatory'
//   if (t.includes('price') || t.includes('aed') || t.includes('sqft') || t.includes('yield')) return 'price_signal'
//   if (t.includes('launch') || t.includes('off-plan') || t.includes('offplan')) return 'offplan'
//   return 'transaction'
// }
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
//   const fetchMessages = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const dailyChat = await generateDailyChat()
//       const { data, error } = await supabase
//         .from('messages')
//         .select('id, user_name, content, created_at')
//         .order('created_at', { ascending: true })
//         .limit(100)
//       const realMessages = (!error && data) ? data : []
//       setMessages([...dailyChat, ...realMessages])
//     } catch (err) {
//       console.error('fetchMessages error:', err)
//       setMessages(FALLBACK_MESSAGES)
//     } finally {
//       setLoading(false)  // ← ALWAYS runs — no more infinite loading spinner
//     }
//   }
//   fetchMessages()
// }, [])

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


// // ── Daily AI chat generator ──
// const TODAY_KEY = `acqar_chat_v2_${new Date().toISOString().slice(0, 10)}`

// // Clean up yesterday's cache
// Object.keys(localStorage)
//   .filter(k => k.startsWith('acqar_chat_') && k !== TODAY_KEY)
//   .forEach(k => localStorage.removeItem(k))

// const PERSONA_NAMES = {
//   owner:    'Sara Al Hashimi',
//   buyer:    'Marco Ferretti',
//   investor: 'Khalid Al Mansouri',
//   broker:   'James Crawford',
// }

// // ── Fallback messages (shows if backend is down) ──
// const FALLBACK_MESSAGES = [
//   { id: 'f1', user_name: 'Khalid Al Mansouri', content: 'Dubai transaction volumes continue to strengthen — off-plan demand holding firm across Business Bay and Creek Harbour.', created_at: new Date(Date.now() - 20 * 60000).toISOString() },
//   { id: 'f2', user_name: 'James Crawford', content: 'Strong buyer interest at AED 1.5–2M right now. Dubai Hills and JVC are the sweet spots for end-use buyers.', created_at: new Date(Date.now() - 18 * 60000).toISOString() },
//   { id: 'f3', user_name: 'Sara Al Hashimi', content: 'My JVC tenants just renewed above asking — 8.5% yield on a studio. Rental market is very tight right now.', created_at: new Date(Date.now() - 15 * 60000).toISOString() },
//   { id: 'f4', user_name: 'Marco Ferretti', content: 'Does the AED 2M Golden Visa threshold apply to off-plan or ready property only?', created_at: new Date(Date.now() - 12 * 60000).toISOString() },
//   { id: 'f5', user_name: 'James Crawford', content: 'Marco — ready property at AED 2M qualifies immediately. Off-plan only counts once fully paid.', created_at: new Date(Date.now() - 10 * 60000).toISOString() },
// ]

// // ── Build chat messages from backend events ──
// function buildMessagesFromEvents(events) {
//   const top = events.slice(0, 5)
//   const now = Date.now()
//   const total = top.length

//   // Each event generates a mini thread: opener → 1-2 replies → follow-up
//   // Personas react differently based on their role
//   const threads = [
//     // Event 0 — Investor opens, Broker replies, Buyer asks
//     (e) => [
//      { name: 'Khalid Al Mansouri', msg: `${e.title}${e.location_name ? " — " + e.location_name + " is moving." : ""} Transaction velocity is picking up. I'm watching this closely.` },
//       { name: 'James Crawford',     msg: `Khalid — same on my end. Had 3 client calls this morning about exactly this. Buyers are staying active despite everything.` },
//       { name: 'Marco Ferretti',     msg: `Does this affect the AED 1.5–2M range specifically? That's my budget and I don't want to miss the window.` },
//       { name: 'James Crawford',     msg: `Marco — if anything this strengthens the case for Dubai Hills at your budget. Resale velocity there is very strong right now.` },
//     ],
//     // Event 1 — Broker opens, Owner reacts, Investor adds data
//     (e) => [
//       { name: 'James Crawford',     msg: `Just flagged this to my team: ${e.title}. ${e.location_name ? e.location_name + ' specifically is one to watch.' : 'Whole market is reacting.'}` },
//      { name: 'Sara Al Hashimi',    msg: `This hits landlords directly. ${e.category === 'regulatory' ? "Regulatory changes always compress yields first — I've seen this before." : 'My JVC renewals are already reflecting this pressure.'}` },
//       { name: 'Khalid Al Mansouri', msg: `Sara — that's actually the signal. When owner sentiment shifts, smart buyers move. Off-plan pipeline is still very strong from what I track.` },
//     ],
//     // Event 2 — Owner raises concern, Broker reassures, Buyer follows
//     (e) => [
//       { name: 'Sara Al Hashimi',    msg: `Anyone else watching this? ${e.title}. My tenant renewals are up for discussion next month and this changes the calculus.` },
//       { name: 'James Crawford',     msg: `Sara — for mid-market JVC the fundamentals are still solid. Demand from end-users is real, not speculative. I wouldn't panic on renewals.` },
//       { name: 'Marco Ferretti',     msg: `This is actually reassuring for me as a buyer. If landlords are cautious it means less competition on ready units?` },
//       { name: 'Sara Al Hashimi',    msg: `Marco — yes, but don't wait too long. Enquiries are up and serious buyers are already moving.` },
//     ],
//     // Event 3 — Investor drops data point, others react
//     (e) => [
//       { name: 'Khalid Al Mansouri', msg: `${e.title}. ${e.location_name ? e.location_name + ' pricing is repricing faster than I expected.' : 'This is a structural shift, not a spike.'}` },
//       { name: 'James Crawford',     msg: `Khalid — 100%. I've had 6 offers accepted this week alone above asking. The narrative of a soft market is completely disconnected from what's actually happening.` },
//       { name: 'Sara Al Hashimi',    msg: `${e.category === 'price_signal' ? 'Higher prices help my exit strategy but crush my yield story. Classic dilemma.' : 'Watching how developers respond to this — execution credibility matters now more than ever.'}` },
//     ],
//     // Event 4 — Buyer asks, everyone answers
//     (e) => [
//       { name: 'Marco Ferretti',     msg: `Quick question for the group — seeing "${e.title}" in the news. Should I be accelerating my search or does this give me more time?` },
//       { name: 'James Crawford',     msg: `Accelerate. The buyers who wait for the right moment in Dubai consistently miss it. The data is clear — Q1 was the strongest quarter on record.` },
//       { name: 'Khalid Al Mansouri', msg: `Marco — at AED 1.8M with end-use intent, ${e.location_name ? e.location_name : 'Dubai Hills'} gives you both lifestyle and Golden Visa path. That's a very clean structure.` },
//       { name: 'Sara Al Hashimi',    msg: `And don't forget — ready property at AED 2M unlocks Golden Visa immediately. Worth stretching slightly if you can.` },
//     ],
//   ]

//   const chat = []
//   top.forEach((event, i) => {
//     const thread = threads[i % threads.length](event)
//     thread.forEach((msg, j) => {
//       // Space messages 2 minutes apart within each thread, 5 min between threads
//       const threadOffset = (total - i) * 5 * 60000
//       const msgOffset = (thread.length - j) * 2 * 60000
//       chat.push({
//         id: `ev_${i}_${j}`,
//         user_name: msg.name,
//         content: msg.msg,
//         created_at: new Date(now - threadOffset - msgOffset).toISOString()
//       })
//     })
//   })

//   return chat
// }
// // ── Daily chat generator — uses your own backend, no external API ──
// async function generateDailyChat() {
//   const cached = localStorage.getItem(TODAY_KEY)
//   if (cached) {
//     try { return JSON.parse(cached) } catch { localStorage.removeItem(TODAY_KEY) }
//   }

//   try {
//     // ✅ Use your own backend — already has real UAE RE events
//     const res = await fetch('/api/events/community-signals?limit=5', {
//       signal: AbortSignal.timeout(6000)
//     })
//     if (!res.ok) throw new Error(`HTTP ${res.status}`)

//     const data = await res.json()
//     const signals = data.signals || []
//     if (!signals.length) throw new Error('no signals')

//     console.log('✅ Live signals:', signals.length, signals[0]?.text)

//     // Convert signals → events shape for buildMessagesFromEvents
//     const events = signals
//   .filter(s => {
//     const t = s.text || ''
//     if (t.includes(' | ') && t.includes('Helping')) return false
//     if (t.includes('Portfolio Manager')) return false
//     if (t.includes('Specialist |')) return false
//     if (t.toLowerCase().includes('searching "')) return false
//     if (t.length < 30) return false
//     return true
//   })
//   .map(s => ({
//     title: s.text
//       .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}]\s*/gu, '')
//       .replace(/Searching "[^"]*"\.\.\./g, '')
//       .replace(/\s*-\s*(LinkedIn|Arabian Business|Gulf News|Zawya|The National).*$/i, '')
//       .trim(),
//     location_name: s.location || '',
//     category: s.category || 'transaction',
//   }))
//   .filter(e => e.title.length > 20)
//   .slice(0, 5)
//     const shaped = buildMessagesFromEvents(events)
//     localStorage.setItem(TODAY_KEY, JSON.stringify(shaped))
//     return shaped

//   } catch (err) {
//     console.warn('community-signals failed:', err.message, '— using fallback')
//     return FALLBACK_MESSAGES
//   }
// }
// // ── Helper: extract Dubai location from headline ──
// function extractLocation(title = '') {
//   const areas = ['Palm Jumeirah', 'Dubai Hills', 'Business Bay', 'Downtown Dubai',
//     'Dubai Marina', 'JVC', 'Creek Harbour', 'Jumeirah', 'DIFC', 'Dubai South',
//     'Abu Dhabi', 'Sharjah', 'RAK', 'Meydan', 'JBR']
//   return areas.find(a => title.includes(a)) || ''
// }

// // ── Helper: detect category from headline ──
// function extractCategory(title = '') {
//   const t = title.toLowerCase()
//   if (t.includes('regulation') || t.includes('law') || t.includes('rera') || t.includes('dld')) return 'regulatory'
//   if (t.includes('price') || t.includes('aed') || t.includes('sqft') || t.includes('yield')) return 'price_signal'
//   if (t.includes('launch') || t.includes('off-plan') || t.includes('offplan')) return 'offplan'
//   return 'transaction'
// }
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
//   const fetchMessages = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const dailyChat = await generateDailyChat()
//       const { data, error } = await supabase
//         .from('messages')
//         .select('id, user_name, content, created_at')
//         .order('created_at', { ascending: true })
//         .limit(100)
//       const realMessages = (!error && data) ? data : []
//       setMessages([...dailyChat, ...realMessages])
//     } catch (err) {
//       console.error('fetchMessages error:', err)
//       setMessages(FALLBACK_MESSAGES)
//     } finally {
//       setLoading(false)  // ← ALWAYS runs — no more infinite loading spinner
//     }
//   }
//   fetchMessages()
// }, [])

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


// // ── Daily AI chat generator ──
// const TODAY_KEY = `acqar_chat_v4_${new Date().toISOString().slice(0, 10)}`

// // Clean up yesterday's cache
// Object.keys(localStorage)
//   .filter(k => k.startsWith('acqar_chat_') && k !== TODAY_KEY)
//   .forEach(k => localStorage.removeItem(k))

// const PERSONA_NAMES = {
//   owner:    'Sara Al Hashimi',
//   buyer:    'Marco Ferretti',
//   investor: 'Khalid Al Mansouri',
//   broker:   'James Crawford',
// }

// // ── Fallback messages (shows if backend is down) ──
// const FALLBACK_MESSAGES = [
//   { id: 'f1', user_name: 'Khalid Al Mansouri', content: 'Dubai transaction volumes continue to strengthen — off-plan demand holding firm across Business Bay and Creek Harbour.', created_at: new Date(Date.now() - 20 * 60000).toISOString() },
//   { id: 'f2', user_name: 'James Crawford', content: 'Strong buyer interest at AED 1.5–2M right now. Dubai Hills and JVC are the sweet spots for end-use buyers.', created_at: new Date(Date.now() - 18 * 60000).toISOString() },
//   { id: 'f3', user_name: 'Sara Al Hashimi', content: 'My JVC tenants just renewed above asking — 8.5% yield on a studio. Rental market is very tight right now.', created_at: new Date(Date.now() - 15 * 60000).toISOString() },
//   { id: 'f4', user_name: 'Marco Ferretti', content: 'Does the AED 2M Golden Visa threshold apply to off-plan or ready property only?', created_at: new Date(Date.now() - 12 * 60000).toISOString() },
//   { id: 'f5', user_name: 'James Crawford', content: 'Marco — ready property at AED 2M qualifies immediately. Off-plan only counts once fully paid.', created_at: new Date(Date.now() - 10 * 60000).toISOString() },
// ]

// // ── Build chat messages from backend events ──
// function buildMessagesFromEvents(events) {
//   const top = events.slice(0, 5)
//   const now = Date.now()
//   const total = top.length

//   // Each event generates a mini thread: opener → 1-2 replies → follow-up
//   // Personas react differently based on their role
//   const threads = [
//     // Event 0 — Investor opens, Broker replies, Buyer asks
//     (e) => [
//      { name: 'Khalid Al Mansouri', msg: `${e.title}${e.location_name ? " — " + e.location_name + " is moving." : ""} Transaction velocity is picking up. I'm watching this closely.` },
//       { name: 'James Crawford',     msg: `Khalid — same on my end. Had 3 client calls this morning about exactly this. Buyers are staying active despite everything.` },
//       { name: 'Marco Ferretti',     msg: `Does this affect the AED 1.5–2M range specifically? That's my budget and I don't want to miss the window.` },
//       { name: 'James Crawford',     msg: `Marco — if anything this strengthens the case for Dubai Hills at your budget. Resale velocity there is very strong right now.` },
//     ],
//     // Event 1 — Broker opens, Owner reacts, Investor adds data
//     (e) => [
//       { name: 'James Crawford',     msg: `Just flagged this to my team: ${e.title}. ${e.location_name ? e.location_name + ' specifically is one to watch.' : 'Whole market is reacting.'}` },
//      { name: 'Sara Al Hashimi',    msg: `This hits landlords directly. ${e.category === 'regulatory' ? "Regulatory changes always compress yields first — I've seen this before." : 'My JVC renewals are already reflecting this pressure.'}` },
//       { name: 'Khalid Al Mansouri', msg: `Sara — that's actually the signal. When owner sentiment shifts, smart buyers move. Off-plan pipeline is still very strong from what I track.` },
//     ],
//     // Event 2 — Owner raises concern, Broker reassures, Buyer follows
//     (e) => [
//       { name: 'Sara Al Hashimi',    msg: `Anyone else watching this? ${e.title}. My tenant renewals are up for discussion next month and this changes the calculus.` },
//       { name: 'James Crawford',     msg: `Sara — for mid-market JVC the fundamentals are still solid. Demand from end-users is real, not speculative. I wouldn't panic on renewals.` },
//       { name: 'Marco Ferretti',     msg: `This is actually reassuring for me as a buyer. If landlords are cautious it means less competition on ready units?` },
//       { name: 'Sara Al Hashimi',    msg: `Marco — yes, but don't wait too long. Enquiries are up and serious buyers are already moving.` },
//     ],
//     // Event 3 — Investor drops data point, others react
//     (e) => [
//       { name: 'Khalid Al Mansouri', msg: `${e.title}. ${e.location_name ? e.location_name + ' pricing is repricing faster than I expected.' : 'This is a structural shift, not a spike.'}` },
//       { name: 'James Crawford',     msg: `Khalid — 100%. I've had 6 offers accepted this week alone above asking. The narrative of a soft market is completely disconnected from what's actually happening.` },
//       { name: 'Sara Al Hashimi',    msg: `${e.category === 'price_signal' ? 'Higher prices help my exit strategy but crush my yield story. Classic dilemma.' : 'Watching how developers respond to this — execution credibility matters now more than ever.'}` },
//     ],
//     // Event 4 — Buyer asks, everyone answers
//     (e) => [
//       { name: 'Marco Ferretti',     msg: `Quick question for the group — seeing "${e.title}" in the news. Should I be accelerating my search or does this give me more time?` },
//       { name: 'James Crawford',     msg: `Accelerate. The buyers who wait for the right moment in Dubai consistently miss it. The data is clear — Q1 was the strongest quarter on record.` },
//       { name: 'Khalid Al Mansouri', msg: `Marco — at AED 1.8M with end-use intent, ${e.location_name ? e.location_name : 'Dubai Hills'} gives you both lifestyle and Golden Visa path. That's a very clean structure.` },
//       { name: 'Sara Al Hashimi',    msg: `And don't forget — ready property at AED 2M unlocks Golden Visa immediately. Worth stretching slightly if you can.` },
//     ],
//   ]

//   const chat = []
//   top.forEach((event, i) => {
//     const thread = threads[i % threads.length](event)
//     thread.forEach((msg, j) => {
//       // Space messages 2 minutes apart within each thread, 5 min between threads
//      const threadOffset = i * 5 * 60000
// const msgOffset = j * 2 * 60000
// const baseTime = now - (total * 5 * 60000)
// chat.push({
//   id: `ev_${i}_${j}`,
//   user_name: msg.name,
//   content: msg.msg,
//   created_at: new Date(baseTime + threadOffset + msgOffset).toISOString()
// })
//     })
//   })

//   return chat
// }
// // ── Daily chat generator — uses your own backend, no external API ──
// async function generateDailyChat() {
//   const cached = localStorage.getItem(TODAY_KEY)
//   if (cached) {
//     try { return JSON.parse(cached) } catch { localStorage.removeItem(TODAY_KEY) }
//   }

//   try {
//     // ✅ Use your own backend — already has real UAE RE events
//     const res = await fetch('/api/events/community-signals?limit=5', {
//       signal: AbortSignal.timeout(6000)
//     })
//     if (!res.ok) throw new Error(`HTTP ${res.status}`)

//     const data = await res.json()
//     const signals = data.signals || []
//     if (!signals.length) throw new Error('no signals')

//     console.log('✅ Live signals:', signals.length, signals[0]?.text)

//     // Convert signals → events shape for buildMessagesFromEvents
//    const events = signals
//   .filter(s => {
//     const t = s.text || ''
//     if (t.includes(' | ') && t.includes('Helping')) return false
//     if (t.includes('Portfolio Manager')) return false
//     if (t.includes('Specialist |')) return false
//     if (t.toLowerCase().includes('searching')) return false
//     if (t.toLowerCase().includes('while global markets')) return false
//     if (t.toLowerCase().includes('the structure that')) return false
//     if (t.length < 30) return false
//     return true
//   })
//   .map(s => {
//     // Clean title aggressively
//     let title = s.text
//       .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}]\s*/gu, '')
//       .replace(/Searching\s+"[^"]*"\s*\.{3}/gi, '')
//       .replace(/\s*[-|]\s*(LinkedIn|Arabian Business|Gulf News|Zawya|The National|Bayut|Property Finder).*$/i, '')
//       .replace(/\s{2,}/g, ' ')
//       .trim()

//     // If title contains colon (article headline style), keep only the part before colon
//     // e.g. "UAE Property Investment 2026: The Structure That..." → "UAE Property Investment 2026"
//     if (title.includes(': ')) {
//       const beforeColon = title.split(': ')[0].trim()
//       if (beforeColon.length > 20) title = beforeColon
//     }

//     // Hard truncate at 80 chars cleanly
//     if (title.length > 80) {
//       title = title.slice(0, 80).replace(/\s+\S*$/, '').trim()
//     }

//     return {
//       title,
//       location_name: s.location || '',
//       category: s.category || 'transaction',
//     }
//   })
//   .filter(e => e.title.length > 20)
//   .slice(0, 5)

//     const shaped = buildMessagesFromEvents(events)
//     localStorage.setItem(TODAY_KEY, JSON.stringify(shaped))
//     return shaped

//   } catch (err) {
//     console.warn('community-signals failed:', err.message, '— using fallback')
//     return FALLBACK_MESSAGES
//   }
// }
// // ── Helper: extract Dubai location from headline ──
// function extractLocation(title = '') {
//   const areas = ['Palm Jumeirah', 'Dubai Hills', 'Business Bay', 'Downtown Dubai',
//     'Dubai Marina', 'JVC', 'Creek Harbour', 'Jumeirah', 'DIFC', 'Dubai South',
//     'Abu Dhabi', 'Sharjah', 'RAK', 'Meydan', 'JBR']
//   return areas.find(a => title.includes(a)) || ''
// }

// // ── Helper: detect category from headline ──
// function extractCategory(title = '') {
//   const t = title.toLowerCase()
//   if (t.includes('regulation') || t.includes('law') || t.includes('rera') || t.includes('dld')) return 'regulatory'
//   if (t.includes('price') || t.includes('aed') || t.includes('sqft') || t.includes('yield')) return 'price_signal'
//   if (t.includes('launch') || t.includes('off-plan') || t.includes('offplan')) return 'offplan'
//   return 'transaction'
// }
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
//   const fetchMessages = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const dailyChat = await generateDailyChat()
//       const { data, error } = await supabase
//         .from('messages')
//         .select('id, user_name, content, created_at')
//         .order('created_at', { ascending: true })
//         .limit(100)
//       const realMessages = (!error && data) ? data : []
//       setMessages([...dailyChat, ...realMessages])
//     } catch (err) {
//       console.error('fetchMessages error:', err)
//       setMessages(FALLBACK_MESSAGES)
//     } finally {
//       setLoading(false)  // ← ALWAYS runs — no more infinite loading spinner
//     }
//   }
//   fetchMessages()
// }, [])

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


// // ── Daily AI chat generator ──
// const currentHour = new Date().toISOString().slice(0, 13) // "2025-01-15T14"
// const TODAY_KEY = `acqar_chat_v4_${currentHour}`

// // Clean up yesterday's cache
// Object.keys(localStorage)
//   .filter(k => k.startsWith('acqar_chat_') && k !== TODAY_KEY)
//   .forEach(k => localStorage.removeItem(k))

// const PERSONA_NAMES = {
//   owner:    'Sara Al Hashimi',
//   buyer:    'Marco Ferretti',
//   investor: 'Khalid Al Mansouri',
//   broker:   'James Crawford',
// }

// // ── Fallback messages (shows if backend is down) ──
// const FALLBACK_MESSAGES = [
//   { id: 'f1', user_name: 'Khalid Al Mansouri', content: 'Just closed on a 2BR in Business Bay — AED 1.85M, handover Q3 2026. Developer offered 60/40 payment plan. Smooth process overall.', created_at: new Date(Date.now() - 25 * 60000).toISOString() },
//   { id: 'f2', user_name: 'Sara Al Hashimi', content: 'Listed my JVC studio today — AED 620k, fully furnished, 7.8% yield currently tenanted. Had 3 enquiries within the hour.', created_at: new Date(Date.now() - 22 * 60000).toISOString() },
//   { id: 'f3', user_name: 'Marco Ferretti', content: 'Looking to buy a 1BR in Dubai Hills or MBR City, budget AED 1.4–1.6M ready. Anyone sold recently in that range?', created_at: new Date(Date.now() - 18 * 60000).toISOString() },
//   { id: 'f4', user_name: 'James Crawford', content: 'Marco — sold a 1BR in Dubai Hills Estate last week, AED 1.55M. Buyer got it in 9 days from listing. That area moves fast right now.', created_at: new Date(Date.now() - 15 * 60000).toISOString() },
//   { id: 'f5', user_name: 'Sara Al Hashimi', content: 'Marco — also worth checking Sobha Hartland 2. My client bought a 1BR there for AED 1.48M off-plan last month, good ROI projection.', created_at: new Date(Date.now() - 12 * 60000).toISOString() },
//   { id: 'f6', user_name: 'Khalid Al Mansouri', content: 'Anyone looking at Palm Jebel Ali plots? Saw a G+1 plot listed at AED 3.2M — prices have moved 18% since January.', created_at: new Date(Date.now() - 8 * 60000).toISOString() },
//   { id: 'f7', user_name: 'James Crawford', content: 'Khalid — Palm Jebel Ali is very active. Had a client flip a plot in 6 weeks for AED 180k profit. Early movers are winning there.', created_at: new Date(Date.now() - 5 * 60000).toISOString() },
//   { id: 'f8', user_name: 'Marco Ferretti', content: 'Thanks all — going to view 2 units in Dubai Hills this weekend. Will report back on asking vs actual closing price.', created_at: new Date(Date.now() - 2 * 60000).toISOString() },
// ]

// // ── Build chat messages from backend events ──
// function buildMessagesFromEvents(events) {
//   const top = events.slice(0, 5)
//   const now = Date.now()
//   const total = top.length

//   // Each event generates a mini thread: opener → 1-2 replies → follow-up
//   // Personas react differently based on their role
//   const threads = [
//     // Thread 0 — Investor shares a purchase
//     (e) => [
//       { name: 'Khalid Al Mansouri', msg: `Just saw this — ${e.title}. Picked up a 2BR off-plan in ${e.location_name || 'Business Bay'} last week at AED 1.9M. Same developer, payment plan was 50/40/10.` },
//       { name: 'James Crawford',     msg: `Khalid — that's a strong entry. I closed a similar unit in ${e.location_name || 'that area'} for a client at AED 1.87M. Resale demand is already there before handover.` },
//       { name: 'Marco Ferretti',     msg: `What was the service charge per sqft? That's always my concern on off-plan in that zone.` },
//       { name: 'Khalid Al Mansouri', msg: `Marco — around AED 14/sqft. Reasonable for the amenities. Net yield projection is 6.8% once tenanted.` },
//     ],
//     // Thread 1 — Owner lists a property for sale
//     (e) => [
//       { name: 'Sara Al Hashimi',    msg: `Listed a 1BR in ${e.location_name || 'JVC'} today — AED 780k, tenanted at AED 62k/year. Anyone actively buying in that range? ${e.title}.` },
//       { name: 'James Crawford',     msg: `Sara — I have 2 buyers looking at exactly that. What floor and view? Send me the listing details.` },
//       { name: 'Marco Ferretti',     msg: `Is AED 780k negotiable or firm? I am in the market for a tenanted unit in that budget.` },
//       { name: 'Sara Al Hashimi',    msg: `Marco — some room, not much. The yield at asking is already 7.9% which is hard to find right now. Serious offers only.` },
//     ],
//     // Thread 2 — Buyer asks for recommendations
//     (e) => [
//       { name: 'Marco Ferretti',     msg: `Group — seeing this news: ${e.title}. I have AED 1.5M to deploy, ready property, ${e.location_name || 'Dubai Hills or JVC'}. What would you buy today?` },
//       { name: 'James Crawford',     msg: `Marco — at AED 1.5M ready, I would look at a 1BR in Sobha Hartland or a 2BR in JVC. Sobha has better resale, JVC has better yield.` },
//       { name: 'Sara Al Hashimi',    msg: `I sold my JVC 2BR last year for AED 1.42M, bought at AED 980k in 2021. For end-use, Dubai Hills is nicer but you pay a premium.` },
//       { name: 'Khalid Al Mansouri', msg: `Marco — also consider Creek Harbour. 1BR units at AED 1.4–1.55M, waterfront, strong rental demand. I have two there performing well.` },
//     ],
//     // Thread 3 — Deal just closed
//     (e) => [
//       { name: 'James Crawford',     msg: `Just closed a villa sale in ${e.location_name || 'Dubai Hills'}. AED 4.2M, 3BR, listed 11 days ago. Multiple offers, went AED 150k above asking. ${e.title}.` },
//       { name: 'Khalid Al Mansouri', msg: `James — villa market is on fire right now. I had a client lowball at AED 3.9M on something similar and lost it. Buyers need to be decisive.` },
//       { name: 'Sara Al Hashimi',    msg: `150k above asking in 11 days — that is the story of this market. I have a 4BR in Damac Hills that has had 6 viewings this week.` },
//       { name: 'Marco Ferretti',     msg: `What is driving villa demand this quarter specifically? Is it end-users or investors?` },
//       { name: 'James Crawford',     msg: `Marco — 70% end-users in my experience this year. Families upgrading from apartments. Golden Visa at AED 2M is also pulling people toward villas.` },
//     ],
//     // Thread 4 — Off-plan launch discussion
//     (e) => [
//       { name: 'Sara Al Hashimi',    msg: `Anyone registered for the new launch in ${e.location_name || 'Dubai South'}? ${e.title}. Prices starting AED 950k for a 1BR apparently.` },
//       { name: 'Khalid Al Mansouri', msg: `Sara — yes, I am on the EOI list. Developer is offering 1% per month payment plan. At AED 950k entry it is competitive for that zone.` },
//       { name: 'James Crawford',     msg: `I have 4 clients on that launch. Key question is handover credibility — developer track record matters more than ever in 2026.` },
//       { name: 'Marco Ferretti',     msg: `What is the projected rental yield on a 1BR there once complete?` },
//       { name: 'Khalid Al Mansouri', msg: `Marco — conservative estimate 7–8%. That area has strong demand from Expo legacy workers and logistics professionals. I am going in.` },
//     ],
//   ]

//   const chat = []
//   top.forEach((event, i) => {
//     const thread = threads[i % threads.length](event)
//     thread.forEach((msg, j) => {
//       // Space messages 2 minutes apart within each thread, 5 min between threads
//      const threadOffset = i * 5 * 60000
// const msgOffset = j * 2 * 60000
// const baseTime = now - (total * 5 * 60000)
// chat.push({
//   id: `ev_${i}_${j}`,
//   user_name: msg.name,
//   content: msg.msg,
//   created_at: new Date(baseTime + threadOffset + msgOffset).toISOString()
// })
//     })
//   })

//   return chat
// }
// // ── Daily chat generator — uses your own backend, no external API ──
// async function generateDailyChat() {
//   const cached = localStorage.getItem(TODAY_KEY)
//   if (cached) {
//     try { return JSON.parse(cached) } catch { localStorage.removeItem(TODAY_KEY) }
//   }

//   try {
//     // ✅ Use your own backend — already has real UAE RE events
//     const res = await fetch('/api/events/community-signals?limit=5&source=reddit', {
//       signal: AbortSignal.timeout(6000)
//     })
//     if (!res.ok) throw new Error(`HTTP ${res.status}`)

//     const data = await res.json()
//    const allSignals = data.signals || []
// const signals = allSignals.filter(s =>
//   (s.source || s.source_type || s.platform || '').toLowerCase().includes('reddit')
// )
// if (!signals.length) throw new Error('no signals')

//     console.log('✅ Live signals:', signals.length, signals[0]?.text)

//     // Convert signals → events shape for buildMessagesFromEvents
//    const events = signals
//   .filter(s => {
//     const t = s.text || ''
//     if (t.includes(' | ') && t.includes('Helping')) return false
//     if (t.includes('Portfolio Manager')) return false
//     if (t.includes('Specialist |')) return false
//     if (t.toLowerCase().includes('searching')) return false
//     if (t.toLowerCase().includes('while global markets')) return false
//     if (t.toLowerCase().includes('the structure that')) return false
//     if (t.length < 30) return false
//     return true
//   })
//   .map(s => {
//     // Clean title aggressively
//     let title = s.text
//       .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}]\s*/gu, '')
//       .replace(/Searching\s+"[^"]*"\s*\.{3}/gi, '')
//       .replace(/\s*[-|]\s*(LinkedIn|Arabian Business|Gulf News|Zawya|The National|Bayut|Property Finder).*$/i, '')
//       .replace(/\s{2,}/g, ' ')
//       .trim()

//     // If title contains colon (article headline style), keep only the part before colon
//     // e.g. "UAE Property Investment 2026: The Structure That..." → "UAE Property Investment 2026"
//     if (title.includes(': ')) {
//       const beforeColon = title.split(': ')[0].trim()
//       if (beforeColon.length > 20) title = beforeColon
//     }

//     // Hard truncate at 80 chars cleanly
//     if (title.length > 80) {
//       title = title.slice(0, 80).replace(/\s+\S*$/, '').trim()
//     }

//     return {
//       title,
//       location_name: s.location || '',
//       category: s.category || 'transaction',
//     }
//   })
//   .filter(e => e.title.length > 20)
//   .slice(0, 5)

//     const shaped = buildMessagesFromEvents(events)
//     localStorage.setItem(TODAY_KEY, JSON.stringify(shaped))
//     return shaped

//   } catch (err) {
//     console.warn('community-signals failed:', err.message, '— using fallback')
//     return FALLBACK_MESSAGES
//   }
// }
// // ── Helper: extract Dubai location from headline ──
// function extractLocation(title = '') {
//   const areas = ['Palm Jumeirah', 'Dubai Hills', 'Business Bay', 'Downtown Dubai',
//     'Dubai Marina', 'JVC', 'Creek Harbour', 'Jumeirah', 'DIFC', 'Dubai South',
//     'Abu Dhabi', 'Sharjah', 'RAK', 'Meydan', 'JBR']
//   return areas.find(a => title.includes(a)) || ''
// }

// // ── Helper: detect category from headline ──
// function extractCategory(title = '') {
//   const t = title.toLowerCase()
//   if (t.includes('regulation') || t.includes('law') || t.includes('rera') || t.includes('dld')) return 'regulatory'
//   if (t.includes('price') || t.includes('aed') || t.includes('sqft') || t.includes('yield')) return 'price_signal'
//   if (t.includes('launch') || t.includes('off-plan') || t.includes('offplan')) return 'offplan'
//   return 'transaction'
// }
// export default function ChatPanel({ onClose, userPlan }) {

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
//   const canChat = userPlan !== 'free'

//   const bottomRef = useRef(null)
//   const inputRef = useRef(null)


  
// // ── Auto-refresh when hour changes ──
// useEffect(() => {
//   const msUntilNextHour = () => {
//     const now = new Date()
//     return (60 - now.getMinutes()) * 60000 - now.getSeconds() * 1000
//   }

//   const timeout = setTimeout(() => {
//     // Clear old cache so generateDailyChat fetches fresh
//     localStorage.removeItem(TODAY_KEY)
//     window.location.reload()
//   }, msUntilNextHour())

//   return () => clearTimeout(timeout)
// }, [])
//   // ── Fetch messages ──
  
//   useEffect(() => {
//   const fetchMessages = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const dailyChat = await generateDailyChat()
//       const { data, error } = await supabase
//         .from('messages')
//         .select('id, user_name, content, created_at')
//         .order('created_at', { ascending: true })
//         .limit(100)
//       const realMessages = (!error && data) ? data : []
//       setMessages([...dailyChat, ...realMessages])
//     } catch (err) {
//       console.error('fetchMessages error:', err)
//       setMessages(FALLBACK_MESSAGES)
//     } finally {
//       setLoading(false)  // ← ALWAYS runs — no more infinite loading spinner
//     }
//   }
//   fetchMessages()
// }, [])

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
//   if (!myName || !authUser || !canChat) return
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

//       {/* Free plan — read-only banner */}
//       {authUser && !canChat && (
//         <div style={{
//           padding: '10px 12px',
//           background: 'rgba(99,102,241,0.1)',
//           borderTop: '1px solid rgba(99,102,241,0.25)',
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           flexShrink: 0,
//         }}>
//           <span style={{ fontSize: '11px', color: '#818cf8' }}>
//             🔒 <strong>Read-only.</strong> Upgrade to Pro to join the conversation.
//           </span>
//         <a 
//   href="https://acqar.vercel.app/pricing"
//   target="_top"
//   rel="noopener noreferrer"
//   style={{
//     fontSize: '11px', fontWeight: 700,
//     background: '#6366f1', color: 'white',
//     padding: '5px 10px', borderRadius: '6px',
//     textDecoration: 'none',
//   }}
// >Upgrade</a>
//         </div>
//       )}

//       {/* Input — paid users only */}
//       {canChat && (
//         <div style={{
//           padding: '10px 12px',
//           paddingBottom: 'max(10px, env(safe-area-inset-bottom, 10px))',
//           borderTop: '1px solid #1f2937',
//           background: '#0d1117', flexShrink: 0,
//           display: 'flex', gap: '8px', alignItems: 'center',
//         }}>
//           <input
//             ref={inputRef}
//             value={input}
//             onChange={e => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder={authUser ? `Message as ${myName}...` : 'Sign in to chat...'}
//             maxLength={200}
//             style={{
//               flex: 1, padding: '10px 14px', fontSize: '16px',
//               background: '#1f2937',
//               border: '1px solid #374151',
//               color: '#f9fafb',
//               borderRadius: '8px', outline: 'none',
//               transition: 'border-color 0.15s',
//               WebkitAppearance: 'none',
//               cursor: 'text',
//             }}
//             onFocus={e => e.target.style.borderColor = '#6366f1'}
//             onBlur={e => e.target.style.borderColor = '#374151'}
//           />
//           <button
//             type="button"
//             onClick={sendMessage}
//             disabled={!input.trim()}
//             style={{
//               width: 40, height: 40, borderRadius: '8px',
//               background: input.trim() ? '#6366f1' : '#1f2937',
//               border: 'none', color: 'white',
//               cursor: input.trim() ? 'pointer' : 'default',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               fontSize: '16px', flexShrink: 0,
//               transition: 'background 0.15s',
//               touchAction: 'manipulation',
//               WebkitTapHighlightColor: 'transparent',
//             }}
//           >↗</button>
//         </div>
//       )}
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
const currentHour = new Date().toISOString().slice(0, 13) // "2025-01-15T14"
const TODAY_KEY = `acqar_chat_v4_${currentHour}`

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

// ── Fallback messages (shows if backend is down) ──
const FALLBACK_MESSAGES = [
  { id: 'f1', user_name: 'Khalid Al Mansouri', content: 'Just closed on a 2BR in Business Bay — AED 1.85M, handover Q3 2026. Developer offered 60/40 payment plan. Smooth process overall.', created_at: new Date(Date.now() - 25 * 60000).toISOString() },
  { id: 'f2', user_name: 'Sara Al Hashimi', content: 'Listed my JVC studio today — AED 620k, fully furnished, 7.8% yield currently tenanted. Had 3 enquiries within the hour.', created_at: new Date(Date.now() - 22 * 60000).toISOString() },
  { id: 'f3', user_name: 'Marco Ferretti', content: 'Looking to buy a 1BR in Dubai Hills or MBR City, budget AED 1.4–1.6M ready. Anyone sold recently in that range?', created_at: new Date(Date.now() - 18 * 60000).toISOString() },
  { id: 'f4', user_name: 'James Crawford', content: 'Marco — sold a 1BR in Dubai Hills Estate last week, AED 1.55M. Buyer got it in 9 days from listing. That area moves fast right now.', created_at: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 'f5', user_name: 'Sara Al Hashimi', content: 'Marco — also worth checking Sobha Hartland 2. My client bought a 1BR there for AED 1.48M off-plan last month, good ROI projection.', created_at: new Date(Date.now() - 12 * 60000).toISOString() },
  { id: 'f6', user_name: 'Khalid Al Mansouri', content: 'Anyone looking at Palm Jebel Ali plots? Saw a G+1 plot listed at AED 3.2M — prices have moved 18% since January.', created_at: new Date(Date.now() - 8 * 60000).toISOString() },
  { id: 'f7', user_name: 'James Crawford', content: 'Khalid — Palm Jebel Ali is very active. Had a client flip a plot in 6 weeks for AED 180k profit. Early movers are winning there.', created_at: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 'f8', user_name: 'Marco Ferretti', content: 'Thanks all — going to view 2 units in Dubai Hills this weekend. Will report back on asking vs actual closing price.', created_at: new Date(Date.now() - 2 * 60000).toISOString() },
]

// ── Build chat messages from backend events ──
function buildMessagesFromEvents(events) {
  const top = events.slice(0, 5)
  const now = Date.now()
  const total = top.length

  // Each event generates a mini thread: opener → 1-2 replies → follow-up
  // Personas react differently based on their role
  const threads = [
    // Thread 0 — Investor shares a purchase
    (e) => [
      { name: 'Khalid Al Mansouri', msg: `Just saw this — ${e.title}. Picked up a 2BR off-plan in ${e.location_name || 'Business Bay'} last week at AED 1.9M. Same developer, payment plan was 50/40/10.` },
      { name: 'James Crawford',     msg: `Khalid — that's a strong entry. I closed a similar unit in ${e.location_name || 'that area'} for a client at AED 1.87M. Resale demand is already there before handover.` },
      { name: 'Marco Ferretti',     msg: `What was the service charge per sqft? That's always my concern on off-plan in that zone.` },
      { name: 'Khalid Al Mansouri', msg: `Marco — around AED 14/sqft. Reasonable for the amenities. Net yield projection is 6.8% once tenanted.` },
    ],
    // Thread 1 — Owner lists a property for sale
    (e) => [
      { name: 'Sara Al Hashimi',    msg: `Listed a 1BR in ${e.location_name || 'JVC'} today — AED 780k, tenanted at AED 62k/year. Anyone actively buying in that range? ${e.title}.` },
      { name: 'James Crawford',     msg: `Sara — I have 2 buyers looking at exactly that. What floor and view? Send me the listing details.` },
      { name: 'Marco Ferretti',     msg: `Is AED 780k negotiable or firm? I am in the market for a tenanted unit in that budget.` },
      { name: 'Sara Al Hashimi',    msg: `Marco — some room, not much. The yield at asking is already 7.9% which is hard to find right now. Serious offers only.` },
    ],
    // Thread 2 — Buyer asks for recommendations
    (e) => [
      { name: 'Marco Ferretti',     msg: `Group — seeing this news: ${e.title}. I have AED 1.5M to deploy, ready property, ${e.location_name || 'Dubai Hills or JVC'}. What would you buy today?` },
      { name: 'James Crawford',     msg: `Marco — at AED 1.5M ready, I would look at a 1BR in Sobha Hartland or a 2BR in JVC. Sobha has better resale, JVC has better yield.` },
      { name: 'Sara Al Hashimi',    msg: `I sold my JVC 2BR last year for AED 1.42M, bought at AED 980k in 2021. For end-use, Dubai Hills is nicer but you pay a premium.` },
      { name: 'Khalid Al Mansouri', msg: `Marco — also consider Creek Harbour. 1BR units at AED 1.4–1.55M, waterfront, strong rental demand. I have two there performing well.` },
    ],
    // Thread 3 — Deal just closed
    (e) => [
      { name: 'James Crawford',     msg: `Just closed a villa sale in ${e.location_name || 'Dubai Hills'}. AED 4.2M, 3BR, listed 11 days ago. Multiple offers, went AED 150k above asking. ${e.title}.` },
      { name: 'Khalid Al Mansouri', msg: `James — villa market is on fire right now. I had a client lowball at AED 3.9M on something similar and lost it. Buyers need to be decisive.` },
      { name: 'Sara Al Hashimi',    msg: `150k above asking in 11 days — that is the story of this market. I have a 4BR in Damac Hills that has had 6 viewings this week.` },
      { name: 'Marco Ferretti',     msg: `What is driving villa demand this quarter specifically? Is it end-users or investors?` },
      { name: 'James Crawford',     msg: `Marco — 70% end-users in my experience this year. Families upgrading from apartments. Golden Visa at AED 2M is also pulling people toward villas.` },
    ],
    // Thread 4 — Off-plan launch discussion
    (e) => [
      { name: 'Sara Al Hashimi',    msg: `Anyone registered for the new launch in ${e.location_name || 'Dubai South'}? ${e.title}. Prices starting AED 950k for a 1BR apparently.` },
      { name: 'Khalid Al Mansouri', msg: `Sara — yes, I am on the EOI list. Developer is offering 1% per month payment plan. At AED 950k entry it is competitive for that zone.` },
      { name: 'James Crawford',     msg: `I have 4 clients on that launch. Key question is handover credibility — developer track record matters more than ever in 2026.` },
      { name: 'Marco Ferretti',     msg: `What is the projected rental yield on a 1BR there once complete?` },
      { name: 'Khalid Al Mansouri', msg: `Marco — conservative estimate 7–8%. That area has strong demand from Expo legacy workers and logistics professionals. I am going in.` },
    ],
  ]

  const chat = []
  top.forEach((event, i) => {
    const thread = threads[i % threads.length](event)
    thread.forEach((msg, j) => {
      // Space messages 2 minutes apart within each thread, 5 min between threads
     const threadOffset = i * 5 * 60000
const msgOffset = j * 2 * 60000
const baseTime = now - (total * 5 * 60000)
chat.push({
  id: `ev_${i}_${j}`,
  user_name: msg.name,
  content: msg.msg,
  created_at: new Date(baseTime + threadOffset + msgOffset).toISOString()
})
    })
  })

  return chat
}
// ── Daily chat generator — uses your own backend, no external API ──
async function generateDailyChat() {
  const cached = localStorage.getItem(TODAY_KEY)
  if (cached) {
    try { return JSON.parse(cached) } catch { localStorage.removeItem(TODAY_KEY) }
  }

  try {
    // ✅ Use your own backend — already has real UAE RE events
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const res = await fetch(`${API_BASE}/api/events/community-signals?limit=10`, {
      signal: AbortSignal.timeout(6000)
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
   const allSignals = data.signals || []
const redditSignals = allSignals.filter(s =>
  (s.source || s.source_type || s.platform || '').toLowerCase().includes('reddit')
)
const signals = redditSignals.length > 0 ? redditSignals : allSignals
if (!signals.length) throw new Error('no signals')


    console.log('✅ Live signals:', signals.length, signals[0]?.text)

    // Convert signals → events shape for buildMessagesFromEvents
   const events = signals
  .filter(s => {
    const t = s.text || ''
    if (t.includes(' | ') && t.includes('Helping')) return false
    if (t.includes('Portfolio Manager')) return false
    if (t.includes('Specialist |')) return false
    if (t.toLowerCase().includes('searching')) return false
    if (t.toLowerCase().includes('while global markets')) return false
    if (t.toLowerCase().includes('the structure that')) return false
    if (t.length < 30) return false
    return true
  })
  .map(s => {
    // Clean title aggressively
    let title = s.text
      .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}]\s*/gu, '')
      .replace(/Searching\s+"[^"]*"\s*\.{3}/gi, '')
      .replace(/\s*[-|]\s*(LinkedIn|Arabian Business|Gulf News|Zawya|The National|Bayut|Property Finder).*$/i, '')
      .replace(/\s{2,}/g, ' ')
      .trim()

    // If title contains colon (article headline style), keep only the part before colon
    // e.g. "UAE Property Investment 2026: The Structure That..." → "UAE Property Investment 2026"
    if (title.includes(': ')) {
      const beforeColon = title.split(': ')[0].trim()
      if (beforeColon.length > 20) title = beforeColon
    }

    // Hard truncate at 80 chars cleanly
    if (title.length > 80) {
      title = title.slice(0, 80).replace(/\s+\S*$/, '').trim()
    }

    return {
      title,
      location_name: s.location || '',
      category: s.category || 'transaction',
    }
  })
  .filter(e => e.title.length > 20)
  .slice(0, 5)

    const shaped = buildMessagesFromEvents(events)
    localStorage.setItem(TODAY_KEY, JSON.stringify(shaped))
    return shaped

  } catch (err) {
    console.warn('community-signals failed:', err.message, '— using fallback')
    return FALLBACK_MESSAGES
  }
}
// ── Helper: extract Dubai location from headline ──
function extractLocation(title = '') {
  const areas = ['Palm Jumeirah', 'Dubai Hills', 'Business Bay', 'Downtown Dubai',
    'Dubai Marina', 'JVC', 'Creek Harbour', 'Jumeirah', 'DIFC', 'Dubai South',
    'Abu Dhabi', 'Sharjah', 'RAK', 'Meydan', 'JBR']
  return areas.find(a => title.includes(a)) || ''
}

// ── Helper: detect category from headline ──
function extractCategory(title = '') {
  const t = title.toLowerCase()
  if (t.includes('regulation') || t.includes('law') || t.includes('rera') || t.includes('dld')) return 'regulatory'
  if (t.includes('price') || t.includes('aed') || t.includes('sqft') || t.includes('yield')) return 'price_signal'
  if (t.includes('launch') || t.includes('off-plan') || t.includes('offplan')) return 'offplan'
  return 'transaction'
}
export default function ChatPanel({ onClose, userPlan }) {

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
  const canChat = userPlan !== 'free'

  const bottomRef = useRef(null)
  const inputRef = useRef(null)


  
// ── Auto-refresh when hour changes ──
useEffect(() => {
  const msUntilNextHour = () => {
    const now = new Date()
    return (60 - now.getMinutes()) * 60000 - now.getSeconds() * 1000
  }

  const timeout = setTimeout(() => {
    // Clear old cache so generateDailyChat fetches fresh
    localStorage.removeItem(TODAY_KEY)
    window.location.reload()
  }, msUntilNextHour())

  return () => clearTimeout(timeout)
}, [])
  // ── Fetch messages ──
  
  useEffect(() => {
  const fetchMessages = async () => {
    setLoading(true)
    setError(null)
    try {
      const dailyChat = await generateDailyChat()
      const { data, error } = await supabase
        .from('messages')
        .select('id, user_name, content, created_at')
        .order('created_at', { ascending: true })
        .limit(100)
      const realMessages = (!error && data) ? data : []
      setMessages([...dailyChat, ...realMessages])
    } catch (err) {
      console.error('fetchMessages error:', err)
      setMessages(FALLBACK_MESSAGES)
    } finally {
      setLoading(false)  // ← ALWAYS runs — no more infinite loading spinner
    }
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
  if (!myName || !authUser || !canChat) return
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

      {/* Free plan — read-only banner */}
      {authUser && !canChat && (
        <div style={{
          padding: '10px 12px',
          background: 'rgba(99,102,241,0.1)',
          borderTop: '1px solid rgba(99,102,241,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '11px', color: '#818cf8' }}>
            🔒 <strong>Read-only.</strong> Upgrade to Pro to join the conversation.
          </span>
        <a 
  href="https://acqar.vercel.app/pricing"
  target="_top"
  rel="noopener noreferrer"
  style={{
    fontSize: '11px', fontWeight: 700,
    background: '#6366f1', color: 'white',
    padding: '5px 10px', borderRadius: '6px',
    textDecoration: 'none',
  }}
>Upgrade</a>
        </div>
      )}

      {/* Input — paid users only */}
      {canChat && (
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
            style={{
              flex: 1, padding: '10px 14px', fontSize: '16px',
              background: '#1f2937',
              border: '1px solid #374151',
              color: '#f9fafb',
              borderRadius: '8px', outline: 'none',
              transition: 'border-color 0.15s',
              WebkitAppearance: 'none',
              cursor: 'text',
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
      )}
    </div>
  )
}
