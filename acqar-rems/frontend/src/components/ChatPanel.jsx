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
//     const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// const res = await fetch(`${API_BASE}/api/events/community-signals?limit=10`, {
//       signal: AbortSignal.timeout(6000)
//     })
//     if (!res.ok) throw new Error(`HTTP ${res.status}`)

//     const data = await res.json()
//    const allSignals = data.signals || []
// const redditSignals = allSignals.filter(s =>
//   (s.source || s.source_type || s.platform || '').toLowerCase().includes('reddit')
// )
// const signals = redditSignals.length > 0 ? redditSignals : allSignals
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
// >CLAIM YOUR SPOT → </a>
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
//     const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// const res = await fetch(`${API_BASE}/api/events/community-signals?limit=10`, {
//       signal: AbortSignal.timeout(6000)
//     })
//     if (!res.ok) throw new Error(`HTTP ${res.status}`)

//     const data = await res.json()
//    const allSignals = data.signals || []
// const redditSignals = allSignals.filter(s =>
//   (s.source || s.source_type || s.platform || '').toLowerCase().includes('reddit')
// )
// const signals = redditSignals.length > 0 ? redditSignals : allSignals
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
//           background: '#0d1117',
//           borderTop: '1px solid #1f2937',
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           gap: '6px',
//           flexShrink: 0,
//         }}>
//           <span style={{ fontSize: '10px', color: 'white', flexShrink: 1, minWidth: 0 }}>
//             🔒 <strong>Read-only.</strong> Upgrade to ACQAR Pro to chat.
//           </span>
//         <a 
//   href="https://www.acqar.com/pricing"
//   target="_top"
//   rel="noopener noreferrer"
//  style={{
//     fontSize: '11px', fontWeight: 700,
//     background: '#B87333', color: 'white',
//     padding: '5px 10px', borderRadius: '6px',
//     textDecoration: 'none',
//     whiteSpace: 'nowrap',
//     flexShrink: 0,
//   }}
// >CLAIM YOUR SPOT → </a>
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
//   (e) => [
//     { name: 'Khalid Al Mansouri', msg: `"${e.title}" — saw this at 6am. ${e.location_name || 'Business Bay'} enquiries already up this morning because of it.` },
//     { name: 'James Crawford',     msg: `Three buyers texted me specifically about ${e.location_name || 'that area'} before 9. All reacting to the same news.` },
//     { name: 'Marco Ferretti',     msg: `After "${e.title.slice(0, 50)}..." — is this a sentiment shift or do prices actually move within weeks?` },
//     { name: 'Khalid Al Mansouri', msg: `In ${e.location_name || 'this market'} both happen fast. That headline is the kind that triggers real transactions, not just talk.` },
//     { name: 'Sara Al Hashimi',    msg: `Two sellers already called me after reading "${e.title.slice(0, 45)}..." wanting to list before the next wave.` },
//   ],
//   (e) => [
//     { name: 'Sara Al Hashimi',    msg: `Read "${e.title.slice(0, 50)}..." this morning and immediately bumped my ${e.location_name || 'JVC'} ask by AED 35k.` },
//     { name: 'James Crawford',     msg: `Bold move — what has the reaction been since you repriced?` },
//     { name: 'Sara Al Hashimi',    msg: `Two more enquiries today. People are clearly reading "${e.title.slice(0, 40)}..." and moving faster.` },
//     { name: 'Marco Ferretti',     msg: `Does "${e.title.slice(0, 45)}..." actually change absorption in ${e.location_name || 'JVC'} or just create noise?` },
//     { name: 'Khalid Al Mansouri', msg: `Real absorption. ${e.location_name || 'That area'} had 4 transactions above asking last month — before this headline dropped.` },
//   ],
//   (e) => [
//     { name: 'Marco Ferretti',     msg: `"${e.title}" — does this bring more buyers into ${e.location_name || 'Dubai'} or just squeeze the same pool harder?` },
//     { name: 'James Crawford',     msg: `New buyers, definitely. "${e.title.slice(0, 40)}..." is the kind of headline that reaches people outside our usual circle.` },
//     { name: 'Sara Al Hashimi',    msg: `Window between "${e.title.slice(0, 35)}..." and the price reaction in ${e.location_name || 'this area'} is maybe 3 weeks. That is the window.` },
//     { name: 'Khalid Al Mansouri', msg: `By the time the second wave reads that headline, the deals in ${e.location_name || 'core Dubai'} are already signed.` },
//     { name: 'Marco Ferretti',     msg: `Given "${e.title.slice(0, 45)}..." where exactly would you deploy right now in ${e.location_name || 'Dubai'}?` },
//     { name: 'James Crawford',     msg: `Ready stock in ${e.location_name || 'Creek Harbour'} — not yet fully priced in and that headline changes the calculus.` },
//   ],
//   (e) => [
//     { name: 'James Crawford',     msg: `Buyer walked into my ${e.location_name || 'Downtown'} viewing with "${e.title.slice(0, 45)}..." on his phone. Asked if it changes the ask.` },
//     { name: 'Khalid Al Mansouri', msg: `What did you tell him?` },
//     { name: 'James Crawford',     msg: `That "${e.title.slice(0, 40)}..." confirms the price, it does not negotiate it. He paid full ask.` },
//     { name: 'Sara Al Hashimi',    msg: `${e.location_name || 'That zone'} stopped being a buyers market the moment headlines like "${e.title.slice(0, 35)}..." started appearing.` },
//     { name: 'Marco Ferretti',     msg: `So where is the value left for a buyer who missed ${e.location_name || 'this area'} before "${e.title.slice(0, 35)}..."?` },
//     { name: 'Khalid Al Mansouri', msg: `Adjacent areas that have not yet priced in what "${e.title.slice(0, 40)}..." means for the wider ${e.location_name || 'Dubai'} market.` },
//   ],
//   (e) => [
//     { name: 'Sara Al Hashimi',    msg: `My ${e.location_name || 'Business Bay'} tenant asked if I am selling after seeing "${e.title.slice(0, 45)}...". Wants first refusal.` },
//     { name: 'Marco Ferretti',     msg: `Are you selling given what "${e.title.slice(0, 40)}..." suggests about where prices go from here?` },
//     { name: 'Sara Al Hashimi',    msg: `Leaning yes. "${e.title.slice(0, 40)}..." makes me think capital gain now beats yield over the next 2 years in ${e.location_name || 'this area'}.` },
//     { name: 'Khalid Al Mansouri', msg: `Only sell if you have a clear reinvestment into something that "${e.title.slice(0, 35)}..." has not already priced up.` },
//     { name: 'James Crawford',     msg: `Three tenanted units sold this week in ${e.location_name || 'that area'}. Buyers specifically want income from day one after reading "${e.title.slice(0, 35)}...".` },
//     { name: 'Marco Ferretti',     msg: `What are tenanted units actually yielding net in ${e.location_name || 'that area'} right now post "${e.title.slice(0, 35)}..."?` },
//     { name: 'Khalid Al Mansouri', msg: `Net around 6% after fees — that number looks very different now that "${e.title.slice(0, 40)}..." has reset expectations in ${e.location_name || 'this market'}.` },
//   ],
// ]
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
//     const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// const res = await fetch(`${API_BASE}/api/events/community-signals?limit=10`, {
//       signal: AbortSignal.timeout(6000)
//     })
//     if (!res.ok) throw new Error(`HTTP ${res.status}`)

//     const data = await res.json()
//    const allSignals = data.signals || []
// const redditSignals = allSignals.filter(s =>
//   (s.source || s.source_type || s.platform || '').toLowerCase().includes('reddit')
// )
// const signals = redditSignals.length > 0 ? redditSignals : allSignals
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
//           background: '#0d1117',
//           borderTop: '1px solid #1f2937',
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           gap: '6px',
//           flexShrink: 0,
//         }}>
//           <span style={{ fontSize: '10px', color: 'white', flexShrink: 1, minWidth: 0 }}>
//             🔒 <strong>Read-only.</strong> Upgrade to ACQAR Pro to chat.
//           </span>
//         <a 
//   href="https://www.acqar.com/pricing"
//   target="_top"
//   rel="noopener noreferrer"
//  style={{
//     fontSize: '11px', fontWeight: 700,
//     background: '#B87333', color: 'white',
//     padding: '5px 10px', borderRadius: '6px',
//     textDecoration: 'none',
//     whiteSpace: 'nowrap',
//     flexShrink: 0,
//   }}
// >CLAIM YOUR SPOT → </a>
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
//   (e) => [
//     { name: 'Khalid Al Mansouri', msg: `"${e.title}" — saw this at 6am. ${e.location_name || 'Business Bay'} enquiries already up this morning because of it.` },
//     { name: 'James Crawford',     msg: `Three buyers texted me specifically about ${e.location_name || 'that area'} before 9. All reacting to the same news.` },
//     { name: 'Marco Ferretti',     msg: `After "${e.title.slice(0, 50)}..." — is this a sentiment shift or do prices actually move within weeks?` },
//     { name: 'Khalid Al Mansouri', msg: `In ${e.location_name || 'this market'} both happen fast. That headline is the kind that triggers real transactions, not just talk.` },
//     { name: 'Sara Al Hashimi',    msg: `Two sellers already called me after reading "${e.title.slice(0, 45)}..." wanting to list before the next wave.` },
//   ],
//   (e) => [
//     { name: 'Sara Al Hashimi',    msg: `Read "${e.title.slice(0, 50)}..." this morning and immediately bumped my ${e.location_name || 'JVC'} ask by AED 35k.` },
//     { name: 'James Crawford',     msg: `Bold move — what has the reaction been since you repriced?` },
//     { name: 'Sara Al Hashimi',    msg: `Two more enquiries today. People are clearly reading "${e.title.slice(0, 40)}..." and moving faster.` },
//     { name: 'Marco Ferretti',     msg: `Does "${e.title.slice(0, 45)}..." actually change absorption in ${e.location_name || 'JVC'} or just create noise?` },
//     { name: 'Khalid Al Mansouri', msg: `Real absorption. ${e.location_name || 'That area'} had 4 transactions above asking last month — before this headline dropped.` },
//   ],
//   (e) => [
//     { name: 'Marco Ferretti',     msg: `"${e.title}" — does this bring more buyers into ${e.location_name || 'Dubai'} or just squeeze the same pool harder?` },
//     { name: 'James Crawford',     msg: `New buyers, definitely. "${e.title.slice(0, 40)}..." is the kind of headline that reaches people outside our usual circle.` },
//     { name: 'Sara Al Hashimi',    msg: `Window between "${e.title.slice(0, 35)}..." and the price reaction in ${e.location_name || 'this area'} is maybe 3 weeks. That is the window.` },
//     { name: 'Khalid Al Mansouri', msg: `By the time the second wave reads that headline, the deals in ${e.location_name || 'core Dubai'} are already signed.` },
//     { name: 'Marco Ferretti',     msg: `Given "${e.title.slice(0, 45)}..." where exactly would you deploy right now in ${e.location_name || 'Dubai'}?` },
//     { name: 'James Crawford',     msg: `Ready stock in ${e.location_name || 'Creek Harbour'} — not yet fully priced in and that headline changes the calculus.` },
//   ],
//   (e) => [
//     { name: 'James Crawford',     msg: `Buyer walked into my ${e.location_name || 'Downtown'} viewing with "${e.title.slice(0, 45)}..." on his phone. Asked if it changes the ask.` },
//     { name: 'Khalid Al Mansouri', msg: `What did you tell him?` },
//     { name: 'James Crawford',     msg: `That "${e.title.slice(0, 40)}..." confirms the price, it does not negotiate it. He paid full ask.` },
//     { name: 'Sara Al Hashimi',    msg: `${e.location_name || 'That zone'} stopped being a buyers market the moment headlines like "${e.title.slice(0, 35)}..." started appearing.` },
//     { name: 'Marco Ferretti',     msg: `So where is the value left for a buyer who missed ${e.location_name || 'this area'} before "${e.title.slice(0, 35)}..."?` },
//     { name: 'Khalid Al Mansouri', msg: `Adjacent areas that have not yet priced in what "${e.title.slice(0, 40)}..." means for the wider ${e.location_name || 'Dubai'} market.` },
//   ],
//   (e) => [
//     { name: 'Sara Al Hashimi',    msg: `My ${e.location_name || 'Business Bay'} tenant asked if I am selling after seeing "${e.title.slice(0, 45)}...". Wants first refusal.` },
//     { name: 'Marco Ferretti',     msg: `Are you selling given what "${e.title.slice(0, 40)}..." suggests about where prices go from here?` },
//     { name: 'Sara Al Hashimi',    msg: `Leaning yes. "${e.title.slice(0, 40)}..." makes me think capital gain now beats yield over the next 2 years in ${e.location_name || 'this area'}.` },
//     { name: 'Khalid Al Mansouri', msg: `Only sell if you have a clear reinvestment into something that "${e.title.slice(0, 35)}..." has not already priced up.` },
//     { name: 'James Crawford',     msg: `Three tenanted units sold this week in ${e.location_name || 'that area'}. Buyers specifically want income from day one after reading "${e.title.slice(0, 35)}...".` },
//     { name: 'Marco Ferretti',     msg: `What are tenanted units actually yielding net in ${e.location_name || 'that area'} right now post "${e.title.slice(0, 35)}..."?` },
//     { name: 'Khalid Al Mansouri', msg: `Net around 6% after fees — that number looks very different now that "${e.title.slice(0, 40)}..." has reset expectations in ${e.location_name || 'this market'}.` },
//   ],
// ]
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
//     // ── Fetch from Reddit directly (same as DistressDealsModal) ──
//     const subreddits = ['DubaiRealEstate', 'dubairealestate', 'dubai']
//     const DUBAI_AREAS = [
//       'Palm Jumeirah', 'Dubai Hills', 'Business Bay', 'Downtown Dubai',
//       'Dubai Marina', 'JVC', 'Creek Harbour', 'Jumeirah', 'DIFC',
//       'Dubai South', 'Meydan', 'JBR', 'Sobha', 'Damac', 'Emaar',
//       'Al Furjan', 'Motor City', 'Sports City', 'Jumeirah Village',
//     ]

//     const RE_KEYWORDS = [
//       'buy', 'sell', 'rent', 'invest', 'property', 'apartment', 'villa',
//       'studio', 'bedroom', 'aed', 'price', 'market', 'off-plan', 'developer',
//       'handover', 'mortgage', 'yield', 'roi', 'sqft', 'listing', 'agent',
//       'broker', 'dld', 'rera', 'freehold', 'lease', 'tenancy', 'landlord',
//     ]

//     const weekAgo = Math.floor(Date.now() / 1000) - (7 * 86400)
//     const allPosts = []
//     const seen = new Set()

//     for (const sub of subreddits) {
//       try {
//         const controller = new AbortController()
//         const timeout = setTimeout(() => controller.abort(), 8000)
//         const resp = await fetch(
//           `https://www.reddit.com/r/${sub}/new.json?limit=100&raw_json=1`,
//           { signal: controller.signal, headers: { 'Accept': 'application/json' } }
//         )
//         clearTimeout(timeout)
//         if (!resp.ok) continue

//         const data = await resp.json()
//         const posts = data?.data?.children || []

//         for (const { data: post } of posts) {
//           if (!post || post.created_utc < weekAgo) continue
//           if (post.selftext === '[removed]' || post.selftext === '[deleted]') continue
//           if (seen.has(post.id)) continue

//           const combined = (post.title + ' ' + (post.selftext || '')).toLowerCase()

//           // Must contain at least one RE keyword
//           if (!RE_KEYWORDS.some(kw => combined.includes(kw))) continue

//           // Skip spam/noise
//           if (post.title.length < 20) continue
//           if (post.title.includes('|') && post.title.includes('Helping')) continue

//           seen.add(post.id)

//           // Extract Dubai location from title
//           const location = DUBAI_AREAS.find(a =>
//             (post.title + ' ' + (post.selftext || '')).includes(a)
//           ) || ''

//           allPosts.push({
//             title: post.title.slice(0, 100),
//             location_name: location,
//             score: post.score || 0,
//           })
//         }
//       } catch (e) {
//         console.log(`Reddit r/${sub} error:`, e?.name === 'AbortError' ? 'timeout' : e)
//       }
//     }

//     // Sort by score and take top 5
//     allPosts.sort((a, b) => b.score - a.score)
//     const events = allPosts.slice(0, 5)

//     if (!events.length) throw new Error('no reddit posts found')

//     console.log('✅ Reddit posts for chat:', events.length, events[0]?.title)

//     const shaped = buildMessagesFromEvents(events)
//     localStorage.setItem(TODAY_KEY, JSON.stringify(shaped))
//     return shaped

//   } catch (err) {
//     console.warn('Reddit chat fetch failed:', err.message)

//     // Fallback to your backend signals
//     try {
//       const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
//       const res = await fetch(`${API_BASE}/api/events/community-signals?limit=10`, {
//         signal: AbortSignal.timeout(6000)
//       })
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const data = await res.json()
//       const signals = data.signals || []
//       if (!signals.length) throw new Error('no signals')

//       const events = signals
//         .filter(s => {
//           const t = s.text || ''
//           if (t.includes(' | ') && t.includes('Helping')) return false
//           if (t.includes('Portfolio Manager')) return false
//           if (t.toLowerCase().includes('searching')) return false
//           if (t.length < 30) return false
//           return true
//         })
//         .map(s => {
//           let title = s.text
//             .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}]\s*/gu, '')
//             .replace(/\s*[-|]\s*(LinkedIn|Arabian Business|Gulf News|Zawya|The National|Bayut|Property Finder).*$/i, '')
//             .replace(/\s{2,}/g, ' ')
//             .trim()
//           if (title.includes(': ')) {
//             const beforeColon = title.split(': ')[0].trim()
//             if (beforeColon.length > 20) title = beforeColon
//           }
//           if (title.length > 80) title = title.slice(0, 80).replace(/\s+\S*$/, '').trim()
//           return { title, location_name: s.location || '' }
//         })
//         .filter(e => e.title.length > 20)
//         .slice(0, 5)

//       if (!events.length) throw new Error('no clean events')

//       const shaped = buildMessagesFromEvents(events)
//       localStorage.setItem(TODAY_KEY, JSON.stringify(shaped))
//       return shaped

//     } catch (err2) {
//       console.warn('Backend fallback also failed:', err2.message, '— using static fallback')
//       return FALLBACK_MESSAGES
//     }
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
//           background: '#0d1117',
//           borderTop: '1px solid #1f2937',
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           gap: '6px',
//           flexShrink: 0,
//         }}>
//           <span style={{ fontSize: '10px', color: 'white', flexShrink: 1, minWidth: 0 }}>
//             🔒 <strong>Read-only.</strong> Upgrade to ACQAR Pro to chat.
//           </span>
//         <a 
//   href="https://www.acqar.com/pricing"
//   target="_top"
//   rel="noopener noreferrer"
//  style={{
//     fontSize: '11px', fontWeight: 700,
//     background: '#B87333', color: 'white',
//     padding: '5px 10px', borderRadius: '6px',
//     textDecoration: 'none',
//     whiteSpace: 'nowrap',
//     flexShrink: 0,
//   }}
// >CLAIM YOUR SPOT → </a>
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
// function getTodayKey() {
//   const currentHour = new Date().toISOString().slice(0, 13)
//   return `acqar_chat_v4_${currentHour}`
// }
// const TODAY_KEY = getTodayKey()

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
//   (e) => [
//     { name: 'Khalid Al Mansouri', msg: `"${e.title}" — saw this at 6am. ${e.location_name || 'Business Bay'} enquiries already up this morning because of it.` },
//     { name: 'James Crawford',     msg: `Three buyers texted me specifically about ${e.location_name || 'that area'} before 9. All reacting to the same news.` },
//     { name: 'Marco Ferretti',     msg: `After "${e.title.slice(0, 50)}..." — is this a sentiment shift or do prices actually move within weeks?` },
//     { name: 'Khalid Al Mansouri', msg: `In ${e.location_name || 'this market'} both happen fast. That headline is the kind that triggers real transactions, not just talk.` },
//     { name: 'Sara Al Hashimi',    msg: `Two sellers already called me after reading "${e.title.slice(0, 45)}..." wanting to list before the next wave.` },
//   ],
//   (e) => [
//     { name: 'Sara Al Hashimi',    msg: `Read "${e.title.slice(0, 50)}..." this morning and immediately bumped my ${e.location_name || 'JVC'} ask by AED 35k.` },
//     { name: 'James Crawford',     msg: `Bold move — what has the reaction been since you repriced?` },
//     { name: 'Sara Al Hashimi',    msg: `Two more enquiries today. People are clearly reading "${e.title.slice(0, 40)}..." and moving faster.` },
//     { name: 'Marco Ferretti',     msg: `Does "${e.title.slice(0, 45)}..." actually change absorption in ${e.location_name || 'JVC'} or just create noise?` },
//     { name: 'Khalid Al Mansouri', msg: `Real absorption. ${e.location_name || 'That area'} had 4 transactions above asking last month — before this headline dropped.` },
//   ],
//   (e) => [
//     { name: 'Marco Ferretti',     msg: `"${e.title}" — does this bring more buyers into ${e.location_name || 'Dubai'} or just squeeze the same pool harder?` },
//     { name: 'James Crawford',     msg: `New buyers, definitely. "${e.title.slice(0, 40)}..." is the kind of headline that reaches people outside our usual circle.` },
//     { name: 'Sara Al Hashimi',    msg: `Window between "${e.title.slice(0, 35)}..." and the price reaction in ${e.location_name || 'this area'} is maybe 3 weeks. That is the window.` },
//     { name: 'Khalid Al Mansouri', msg: `By the time the second wave reads that headline, the deals in ${e.location_name || 'core Dubai'} are already signed.` },
//     { name: 'Marco Ferretti',     msg: `Given "${e.title.slice(0, 45)}..." where exactly would you deploy right now in ${e.location_name || 'Dubai'}?` },
//     { name: 'James Crawford',     msg: `Ready stock in ${e.location_name || 'Creek Harbour'} — not yet fully priced in and that headline changes the calculus.` },
//   ],
//   (e) => [
//     { name: 'James Crawford',     msg: `Buyer walked into my ${e.location_name || 'Downtown'} viewing with "${e.title.slice(0, 45)}..." on his phone. Asked if it changes the ask.` },
//     { name: 'Khalid Al Mansouri', msg: `What did you tell him?` },
//     { name: 'James Crawford',     msg: `That "${e.title.slice(0, 40)}..." confirms the price, it does not negotiate it. He paid full ask.` },
//     { name: 'Sara Al Hashimi',    msg: `${e.location_name || 'That zone'} stopped being a buyers market the moment headlines like "${e.title.slice(0, 35)}..." started appearing.` },
//     { name: 'Marco Ferretti',     msg: `So where is the value left for a buyer who missed ${e.location_name || 'this area'} before "${e.title.slice(0, 35)}..."?` },
//     { name: 'Khalid Al Mansouri', msg: `Adjacent areas that have not yet priced in what "${e.title.slice(0, 40)}..." means for the wider ${e.location_name || 'Dubai'} market.` },
//   ],
//   (e) => [
//     { name: 'Sara Al Hashimi',    msg: `My ${e.location_name || 'Business Bay'} tenant asked if I am selling after seeing "${e.title.slice(0, 45)}...". Wants first refusal.` },
//     { name: 'Marco Ferretti',     msg: `Are you selling given what "${e.title.slice(0, 40)}..." suggests about where prices go from here?` },
//     { name: 'Sara Al Hashimi',    msg: `Leaning yes. "${e.title.slice(0, 40)}..." makes me think capital gain now beats yield over the next 2 years in ${e.location_name || 'this area'}.` },
//     { name: 'Khalid Al Mansouri', msg: `Only sell if you have a clear reinvestment into something that "${e.title.slice(0, 35)}..." has not already priced up.` },
//     { name: 'James Crawford',     msg: `Three tenanted units sold this week in ${e.location_name || 'that area'}. Buyers specifically want income from day one after reading "${e.title.slice(0, 35)}...".` },
//     { name: 'Marco Ferretti',     msg: `What are tenanted units actually yielding net in ${e.location_name || 'that area'} right now post "${e.title.slice(0, 35)}..."?` },
//     { name: 'Khalid Al Mansouri', msg: `Net around 6% after fees — that number looks very different now that "${e.title.slice(0, 40)}..." has reset expectations in ${e.location_name || 'this market'}.` },
//   ],
// ]
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
//     // ── Fetch from Reddit directly (same as DistressDealsModal) ──
//     const subreddits = ['DubaiRealEstate', 'dubairealestate', 'dubai']
//     const DUBAI_AREAS = [
//       'Palm Jumeirah', 'Dubai Hills', 'Business Bay', 'Downtown Dubai',
//       'Dubai Marina', 'JVC', 'Creek Harbour', 'Jumeirah', 'DIFC',
//       'Dubai South', 'Meydan', 'JBR', 'Sobha', 'Damac', 'Emaar',
//       'Al Furjan', 'Motor City', 'Sports City', 'Jumeirah Village',
//     ]
// const RE_KEYWORDS = [
//       'property', 'apartment', 'villa', 'studio', 'bedroom',
//       'aed', 'off-plan', 'offplan', 'developer', 'handover',
//       'mortgage', 'yield', 'roi', 'sqft', 'dld', 'rera',
//       'freehold', 'tenancy', 'landlord', 'real estate',
//       'palm jumeirah', 'dubai hills', 'business bay', 'downtown dubai',
//       'dubai marina', 'jvc', 'creek harbour', 'difc', 'emaar',
//       'damac', 'sobha', 'nakheel', 'meraas',
//     ]

//     const weekAgo = Math.floor(Date.now() / 1000) - (7 * 86400)
//     const allPosts = []
//     const seen = new Set()

//     for (const sub of subreddits) {
//       try {
//         const controller = new AbortController()
//         const timeout = setTimeout(() => controller.abort(), 8000)
//         const resp = await fetch(
//           `https://www.reddit.com/r/${sub}/new.json?limit=100&raw_json=1`,
//           { signal: controller.signal, headers: { 'Accept': 'application/json' } }
//         )
//         clearTimeout(timeout)
//         if (!resp.ok) continue

//         const data = await resp.json()
//         const posts = data?.data?.children || []

//         for (const { data: post } of posts) {
//           if (!post || post.created_utc < weekAgo) continue
//           if (post.selftext === '[removed]' || post.selftext === '[deleted]') continue
//           if (seen.has(post.id)) continue

//           const combined = (post.title + ' ' + (post.selftext || '')).toLowerCase()

//           // Must contain at least one STRONG RE keyword
//           const STRONG_KEYWORDS = [
//             'property', 'apartment', 'villa', 'aed', 'sqft',
//             'off-plan', 'offplan', 'developer', 'dld', 'rera',
//             'real estate', 'freehold', 'mortgage', 'handover',
//             'emaar', 'damac', 'sobha', 'nakheel', 'meraas',
//             'palm jumeirah', 'dubai hills', 'business bay',
//             'downtown dubai', 'dubai marina', 'jvc', 'creek harbour',
//           ]
//           if (!STRONG_KEYWORDS.some(kw => combined.includes(kw))) continue

//           // Skip spam/noise/non-RE posts
//           if (post.title.length < 20) continue
//           if (post.title.includes('|') && post.title.includes('Helping')) continue
//           if (combined.includes('visa') && !combined.includes('property')) continue
//           if (combined.includes('job') && !combined.includes('property')) continue
//           if (combined.includes('restaurant') || combined.includes('food')) continue
//           if (combined.includes('tourist') || combined.includes('vacation')) continue

//           seen.add(post.id)

//           // Extract Dubai location from title
//           const location = DUBAI_AREAS.find(a =>
//             (post.title + ' ' + (post.selftext || '')).includes(a)
//           ) || ''

//           allPosts.push({
//             title: post.title.slice(0, 100),
//             location_name: location,
//             score: post.score || 0,
//           })
//         }
//       } catch (e) {
//         console.log(`Reddit r/${sub} error:`, e?.name === 'AbortError' ? 'timeout' : e)
//       }
//     }

//     // Sort by score and take top 5
//     allPosts.sort((a, b) => b.score - a.score)
//     const events = allPosts.slice(0, 5)

//     if (!events.length) throw new Error('no reddit posts found')

//     console.log('✅ Reddit posts for chat:', events.length, events[0]?.title)

//     const shaped = buildMessagesFromEvents(events)
//     localStorage.setItem(TODAY_KEY, JSON.stringify(shaped))
//     return shaped

//   } catch (err) {
//     console.warn('Reddit chat fetch failed:', err.message)

//     // Fallback to your backend signals
//     try {
//       const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
//       const res = await fetch(`${API_BASE}/api/events/community-signals?limit=10`, {
//         signal: AbortSignal.timeout(6000)
//       })
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const data = await res.json()
//       const signals = data.signals || []
//       if (!signals.length) throw new Error('no signals')

//       const events = signals
//         .filter(s => {
//           const t = s.text || ''
//           if (t.includes(' | ') && t.includes('Helping')) return false
//           if (t.includes('Portfolio Manager')) return false
//           if (t.toLowerCase().includes('searching')) return false
//           if (t.length < 30) return false
//           return true
//         })
//         .map(s => {
//           let title = s.text
//             .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}]\s*/gu, '')
//             .replace(/\s*[-|]\s*(LinkedIn|Arabian Business|Gulf News|Zawya|The National|Bayut|Property Finder).*$/i, '')
//             .replace(/\s{2,}/g, ' ')
//             .trim()
//           if (title.includes(': ')) {
//             const beforeColon = title.split(': ')[0].trim()
//             if (beforeColon.length > 20) title = beforeColon
//           }
//           if (title.length > 80) title = title.slice(0, 80).replace(/\s+\S*$/, '').trim()
//           return { title, location_name: s.location || '' }
//         })
//         .filter(e => e.title.length > 20)
//         .slice(0, 5)

//       if (!events.length) throw new Error('no clean events')

//       const shaped = buildMessagesFromEvents(events)
//       localStorage.setItem(TODAY_KEY, JSON.stringify(shaped))
//       return shaped

//     } catch (err2) {
//       console.warn('Backend fallback also failed:', err2.message, '— using static fallback')
//       return FALLBACK_MESSAGES
//     }
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
//     // Clear current cache key so new hour fetches fresh
//     const currentKey = getTodayKey()
//     localStorage.removeItem(currentKey)
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
//           background: '#0d1117',
//           borderTop: '1px solid #1f2937',
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           gap: '6px',
//           flexShrink: 0,
//         }}>
//           <span style={{ fontSize: '10px', color: 'white', flexShrink: 1, minWidth: 0 }}>
//             🔒 <strong>Read-only.</strong> Upgrade to ACQAR Pro to chat.
//           </span>
//         <a 
//   href="https://www.acqar.com/pricing"
//   target="_top"
//   rel="noopener noreferrer"
//  style={{
//     fontSize: '11px', fontWeight: 700,
//     background: '#B87333', color: 'white',
//     padding: '5px 10px', borderRadius: '6px',
//     textDecoration: 'none',
//     whiteSpace: 'nowrap',
//     flexShrink: 0,
//   }}
// >CLAIM YOUR SPOT → </a>
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
// function getTodayKey() {
//   const currentHour = new Date().toISOString().slice(0, 13)
//   return `acqar_chat_v4_${currentHour}`
// }
// const TODAY_KEY = getTodayKey()

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
//   (e) => [
//     { name: 'Khalid Al Mansouri', msg: `"${e.title}" — saw this at 6am. ${e.location_name || 'Business Bay'} enquiries already up this morning because of it.` },
//     { name: 'James Crawford',     msg: `Three buyers texted me specifically about ${e.location_name || 'that area'} before 9. All reacting to the same news.` },
//     { name: 'Marco Ferretti',     msg: `After "${e.title.slice(0, 50)}..." — is this a sentiment shift or do prices actually move within weeks?` },
//     { name: 'Khalid Al Mansouri', msg: `In ${e.location_name || 'this market'} both happen fast. That headline is the kind that triggers real transactions, not just talk.` },
//     { name: 'Sara Al Hashimi',    msg: `Two sellers already called me after reading "${e.title.slice(0, 45)}..." wanting to list before the next wave.` },
//   ],
//   (e) => [
//     { name: 'Sara Al Hashimi',    msg: `Read "${e.title.slice(0, 50)}..." this morning and immediately bumped my ${e.location_name || 'JVC'} ask by AED 35k.` },
//     { name: 'James Crawford',     msg: `Bold move — what has the reaction been since you repriced?` },
//     { name: 'Sara Al Hashimi',    msg: `Two more enquiries today. People are clearly reading "${e.title.slice(0, 40)}..." and moving faster.` },
//     { name: 'Marco Ferretti',     msg: `Does "${e.title.slice(0, 45)}..." actually change absorption in ${e.location_name || 'JVC'} or just create noise?` },
//     { name: 'Khalid Al Mansouri', msg: `Real absorption. ${e.location_name || 'That area'} had 4 transactions above asking last month — before this headline dropped.` },
//   ],
//   (e) => [
//     { name: 'Marco Ferretti',     msg: `"${e.title}" — does this bring more buyers into ${e.location_name || 'Dubai'} or just squeeze the same pool harder?` },
//     { name: 'James Crawford',     msg: `New buyers, definitely. "${e.title.slice(0, 40)}..." is the kind of headline that reaches people outside our usual circle.` },
//     { name: 'Sara Al Hashimi',    msg: `Window between "${e.title.slice(0, 35)}..." and the price reaction in ${e.location_name || 'this area'} is maybe 3 weeks. That is the window.` },
//     { name: 'Khalid Al Mansouri', msg: `By the time the second wave reads that headline, the deals in ${e.location_name || 'core Dubai'} are already signed.` },
//     { name: 'Marco Ferretti',     msg: `Given "${e.title.slice(0, 45)}..." where exactly would you deploy right now in ${e.location_name || 'Dubai'}?` },
//     { name: 'James Crawford',     msg: `Ready stock in ${e.location_name || 'Creek Harbour'} — not yet fully priced in and that headline changes the calculus.` },
//   ],
//   (e) => [
//     { name: 'James Crawford',     msg: `Buyer walked into my ${e.location_name || 'Downtown'} viewing with "${e.title.slice(0, 45)}..." on his phone. Asked if it changes the ask.` },
//     { name: 'Khalid Al Mansouri', msg: `What did you tell him?` },
//     { name: 'James Crawford',     msg: `That "${e.title.slice(0, 40)}..." confirms the price, it does not negotiate it. He paid full ask.` },
//     { name: 'Sara Al Hashimi',    msg: `${e.location_name || 'That zone'} stopped being a buyers market the moment headlines like "${e.title.slice(0, 35)}..." started appearing.` },
//     { name: 'Marco Ferretti',     msg: `So where is the value left for a buyer who missed ${e.location_name || 'this area'} before "${e.title.slice(0, 35)}..."?` },
//     { name: 'Khalid Al Mansouri', msg: `Adjacent areas that have not yet priced in what "${e.title.slice(0, 40)}..." means for the wider ${e.location_name || 'Dubai'} market.` },
//   ],
//   (e) => [
//     { name: 'Sara Al Hashimi',    msg: `My ${e.location_name || 'Business Bay'} tenant asked if I am selling after seeing "${e.title.slice(0, 45)}...". Wants first refusal.` },
//     { name: 'Marco Ferretti',     msg: `Are you selling given what "${e.title.slice(0, 40)}..." suggests about where prices go from here?` },
//     { name: 'Sara Al Hashimi',    msg: `Leaning yes. "${e.title.slice(0, 40)}..." makes me think capital gain now beats yield over the next 2 years in ${e.location_name || 'this area'}.` },
//     { name: 'Khalid Al Mansouri', msg: `Only sell if you have a clear reinvestment into something that "${e.title.slice(0, 35)}..." has not already priced up.` },
//     { name: 'James Crawford',     msg: `Three tenanted units sold this week in ${e.location_name || 'that area'}. Buyers specifically want income from day one after reading "${e.title.slice(0, 35)}...".` },
//     { name: 'Marco Ferretti',     msg: `What are tenanted units actually yielding net in ${e.location_name || 'that area'} right now post "${e.title.slice(0, 35)}..."?` },
//     { name: 'Khalid Al Mansouri', msg: `Net around 6% after fees — that number looks very different now that "${e.title.slice(0, 40)}..." has reset expectations in ${e.location_name || 'this market'}.` },
//   ],
// ]
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
//     // ── Fetch from Reddit directly (same as DistressDealsModal) ──
//     const subreddits = ['DubaiRealEstate', 'dubairealestate', 'dubai']
//     const DUBAI_AREAS = [
//       'Palm Jumeirah', 'Dubai Hills', 'Business Bay', 'Downtown Dubai',
//       'Dubai Marina', 'JVC', 'Creek Harbour', 'Jumeirah', 'DIFC',
//       'Dubai South', 'Meydan', 'JBR', 'Sobha', 'Damac', 'Emaar',
//       'Al Furjan', 'Motor City', 'Sports City', 'Jumeirah Village',
//     ]
// const RE_KEYWORDS = [
//       'property', 'apartment', 'villa', 'studio', 'bedroom',
//       'aed', 'off-plan', 'offplan', 'developer', 'handover',
//       'mortgage', 'yield', 'roi', 'sqft', 'dld', 'rera',
//       'freehold', 'tenancy', 'landlord', 'real estate',
//       'palm jumeirah', 'dubai hills', 'business bay', 'downtown dubai',
//       'dubai marina', 'jvc', 'creek harbour', 'difc', 'emaar',
//       'damac', 'sobha', 'nakheel', 'meraas',
//     ]

//     const weekAgo = Math.floor(Date.now() / 1000) - (7 * 86400)
//     const allPosts = []
//     const seen = new Set()

//     for (const sub of subreddits) {
//       try {
//         const controller = new AbortController()
//         const timeout = setTimeout(() => controller.abort(), 8000)
//         const resp = await fetch(
//           `https://www.reddit.com/r/${sub}/new.json?limit=100&raw_json=1`,
//           { signal: controller.signal, headers: { 'Accept': 'application/json' } }
//         )
//         clearTimeout(timeout)
//         if (!resp.ok) continue

//         const data = await resp.json()
//         const posts = data?.data?.children || []

//         for (const { data: post } of posts) {
//           if (!post || post.created_utc < weekAgo) continue
//           if (post.selftext === '[removed]' || post.selftext === '[deleted]') continue
//           if (seen.has(post.id)) continue

//           const combined = (post.title + ' ' + (post.selftext || '')).toLowerCase()

//           // Must contain at least one STRONG RE keyword
//           const STRONG_KEYWORDS = [
//             'property', 'apartment', 'villa', 'aed', 'sqft',
//             'off-plan', 'offplan', 'developer', 'dld', 'rera',
//             'real estate', 'freehold', 'mortgage', 'handover',
//             'emaar', 'damac', 'sobha', 'nakheel', 'meraas',
//             'palm jumeirah', 'dubai hills', 'business bay',
//             'downtown dubai', 'dubai marina', 'jvc', 'creek harbour',
//           ]
//           if (!STRONG_KEYWORDS.some(kw => combined.includes(kw))) continue

//           // Skip spam/noise/non-RE posts
//           if (post.title.length < 20) continue
//           if (post.title.includes('|') && post.title.includes('Helping')) continue
//           if (combined.includes('visa') && !combined.includes('property')) continue
//           if (combined.includes('job') && !combined.includes('property')) continue
//           if (combined.includes('restaurant') || combined.includes('food')) continue
//           if (combined.includes('tourist') || combined.includes('vacation')) continue

//           seen.add(post.id)

//           // Extract Dubai location from title
//           const location = DUBAI_AREAS.find(a =>
//             (post.title + ' ' + (post.selftext || '')).includes(a)
//           ) || ''

//           allPosts.push({
//             title: post.title.slice(0, 100),
//             location_name: location,
//             score: post.score || 0,
//           })
//         }
//       } catch (e) {
//         console.log(`Reddit r/${sub} error:`, e?.name === 'AbortError' ? 'timeout' : e)
//       }
//     }

//     // Sort by score and take top 5
//     allPosts.sort((a, b) => b.score - a.score)
//     const events = allPosts.slice(0, 5)

//     if (!events.length) throw new Error('no reddit posts found')

//     console.log('✅ Reddit posts for chat:', events.length, events[0]?.title)

//     const shaped = buildMessagesFromEvents(events)
//     localStorage.setItem(TODAY_KEY, JSON.stringify(shaped))
//     return shaped

//   } catch (err) {
//     console.warn('Reddit chat fetch failed:', err.message)

//     // Fallback to your backend signals
//     try {
//       const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
//       const res = await fetch(`${API_BASE}/api/events/community-signals?limit=10`, {
//         signal: AbortSignal.timeout(6000)
//       })
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const data = await res.json()
//       const signals = data.signals || []
//       if (!signals.length) throw new Error('no signals')

//       const events = signals
//         .filter(s => {
//           const t = s.text || ''
//           if (t.includes(' | ') && t.includes('Helping')) return false
//           if (t.includes('Portfolio Manager')) return false
//           if (t.toLowerCase().includes('searching')) return false
//           if (t.length < 30) return false
//           return true
//         })
//         .map(s => {
//           let title = s.text
//             .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}]\s*/gu, '')
//             .replace(/\s*[-|]\s*(LinkedIn|Arabian Business|Gulf News|Zawya|The National|Bayut|Property Finder).*$/i, '')
//             .replace(/\s{2,}/g, ' ')
//             .trim()
//           if (title.includes(': ')) {
//             const beforeColon = title.split(': ')[0].trim()
//             if (beforeColon.length > 20) title = beforeColon
//           }
//           if (title.length > 80) title = title.slice(0, 80).replace(/\s+\S*$/, '').trim()
//           return { title, location_name: s.location || '' }
//         })
//         .filter(e => e.title.length > 20)
//         .slice(0, 5)

//       if (!events.length) throw new Error('no clean events')

//       const shaped = buildMessagesFromEvents(events)
//       localStorage.setItem(TODAY_KEY, JSON.stringify(shaped))
//       return shaped

//     } catch (err2) {
//       console.warn('Backend fallback also failed:', err2.message, '— using static fallback')
//       return FALLBACK_MESSAGES
//     }
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
//   const [agentTyping, setAgentTyping] = useState(false)
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
//     // Clear current cache key so new hour fetches fresh
//     const currentKey = getTodayKey()
//     localStorage.removeItem(currentKey)
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
// const sendMessage = async (e) => {
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
//     if (error) {
//       setError('Failed to send: ' + error.message)
//       return
//     }
//     // Trigger AI agent reply after user sends
//     triggerAgentReply(text)
//   }

//  const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e) }
//   }

//   // ── AI Agent reply ──
//  // ── AI Agent reply — keyword matching, no API key needed ──
//   const AI_AGENT_NAMES = [
//     'Sara Al Hashimi',
//     'Khalid Al Mansouri',
//     'James Crawford',
//     'Marco Ferretti',
//   ]

//   const AGENT_REPLIES = [
//     // ── PRICES ──
//     {
//       keywords: ['price', 'prices', 'pricing', 'expensive', 'cheap', 'cost', 'aed', 'million', 'psf', 'sqft'],
//       replies: [
//         { agent: 'James Crawford', msg: 'Prices in core Dubai are still holding firm. Sellers are not discounting right now — multiple offers on anything priced correctly.' },
//         { agent: 'Khalid Al Mansouri', msg: 'AED 1,800–2,200 psf in Business Bay ready stock. Off-plan is moving faster and at better entry points if you can wait for handover.' },
//         { agent: 'Sara Al Hashimi', msg: 'Compared to 18 months ago, prices are up 20–30% in most areas. The question is whether you are buying for yield or capital gain.' },
//         { agent: 'Marco Ferretti', msg: 'I was surprised how fast prices moved here. What budget range are you working with — that changes the options significantly.' },
//         { agent: 'James Crawford', msg: 'Dubai Hills and MBR City still offer value relative to Downtown. Prices per sqft are 15–20% lower for similar quality.' },
//       ]
//     },
//     // ── INVESTMENT / ROI / YIELD ──
//     {
//       keywords: ['invest', 'investment', 'roi', 'yield', 'return', 'rental', 'rent', 'income', 'profit', 'capital gain'],
//       replies: [
//         { agent: 'Khalid Al Mansouri', msg: 'Net yields in JVC and Sports City are still hitting 7–8%. If you want capital gain, go Downtown or Palm. You cannot have both at peak.' },
//         { agent: 'Sara Al Hashimi', msg: 'Tenanted properties are selling fast right now. Buyers want income from day one — furnish it and list it tenanted for a 15% premium.' },
//         { agent: 'James Crawford', msg: 'Best ROI entry right now is off-plan in Dubai South or Al Furjan. Lower entry price, strong rental demand when it completes.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Short-term rental in Marina or JBR is generating 10–12% gross. You need a holiday home licence — DTCM handles it, process takes 2 weeks.' },
//         { agent: 'Marco Ferretti', msg: 'I ran the numbers on three areas. Creek Harbour surprised me — yields are solid and capital appreciation is still early-stage.' },
//       ]
//     },
//     // ── OFF-PLAN ──
//     {
//       keywords: ['off-plan', 'offplan', 'off plan', 'launch', 'developer', 'handover', 'payment plan', 'emaar', 'damac', 'sobha', 'nakheel', 'meraas'],
//       replies: [
//         { agent: 'James Crawford', msg: 'Off-plan payment plans from Emaar and Sobha are 60/40 right now. You pay 60% during construction, 40% on handover. Protects your cashflow.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Sobha Hartland 2 and Dubai Hills phase 3 are selling out within days of launch. You need to be on the priority list before public launch.' },
//         { agent: 'Sara Al Hashimi', msg: 'DAMAC is offering post-handover payment plans on some units — 3 years after keys. That is the one to look at if cashflow is tight.' },
//         { agent: 'Marco Ferretti', msg: 'Which developer are you looking at? Some have better build quality track records than others — Emaar and Sobha are the benchmarks here.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Off-plan in Dubai South is the play right now. Al Maktoum Airport expansion makes that whole corridor interesting for 3–5 year hold.' },
//       ]
//     },
//     // ── AREAS — DUBAI HILLS ──
//     {
//       keywords: ['dubai hills', 'hills estate', 'hills'],
//       replies: [
//         { agent: 'James Crawford', msg: 'Dubai Hills is fully established now. Villas have appreciated 45% since 2021. Apartments around the golf course are the value play remaining.' },
//         { agent: 'Sara Al Hashimi', msg: 'Sold a 3BR villa in Dubai Hills last month — 14 viewings in 4 days, went above asking. That market has very strong demand.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Dubai Hills Mall has changed the dynamic completely. Foot traffic drives rental demand — 1BR apartments near the mall are yielding 6.5% net.' },
//       ]
//     },
//     // ── AREAS — BUSINESS BAY ──
//     {
//       keywords: ['business bay', 'bay'],
//       replies: [
//         { agent: 'James Crawford', msg: 'Business Bay is the most liquid market in Dubai right now. High transaction volume, lots of ready buyers and sellers.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Canal-facing units in Business Bay command a 20% premium. Non-canal is better value but slower to appreciate.' },
//         { agent: 'Sara Al Hashimi', msg: 'My Business Bay studio is generating AED 75k per year short-term. Running costs are around AED 15k including management — net is strong.' },
//       ]
//     },
//     // ── AREAS — JVC ──
//     {
//       keywords: ['jvc', 'jumeirah village circle', 'jumeirah village'],
//       replies: [
//         { agent: 'Sara Al Hashimi', msg: 'JVC is the highest transaction volume area in Dubai. Studios and 1BRs move in days if priced right — AED 550–750k range.' },
//         { agent: 'James Crawford', msg: 'JVC yields are holding at 7–8% net. The infrastructure has improved massively — Circle Mall changed the whole feel of the community.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Entry point in JVC is still accessible. For long-term hold it is solid — not glamorous but the numbers work better than most premium areas.' },
//       ]
//     },
//     // ── AREAS — PALM ──
//     {
//       keywords: ['palm', 'palm jumeirah', 'palm jebel ali', 'atlantis', 'frond'],
//       replies: [
//         { agent: 'Khalid Al Mansouri', msg: 'Palm Jebel Ali is where early movers are going. Plots have moved 20%+ since launch. Palm Jumeirah is fully priced — Jebel Ali is the opportunity.' },
//         { agent: 'James Crawford', msg: 'Palm Jumeirah villas are AED 15–35M range now. The rental yields are only 3–4% net but the capital preservation is exceptional.' },
//         { agent: 'Sara Al Hashimi', msg: 'The new monorail extension on Palm Jumeirah is driving another wave of interest. Connectivity was the one gap — that is closing.' },
//       ]
//     },
//     // ── AREAS — DOWNTOWN ──
//     {
//       keywords: ['downtown', 'burj khalifa', 'burj', 'opera', 'address'],
//       replies: [
//         { agent: 'James Crawford', msg: 'Downtown Dubai is a trophy asset — prices reflect that. AED 2,800–4,500 psf depending on floor and view. Yield is 3.5–4.5% net.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Downtown is for capital preservation, not yield. If you want income, go JVC or Business Bay. Downtown is a store of value play.' },
//         { agent: 'Marco Ferretti', msg: 'I looked at Downtown seriously — the Burj view premium is real but so is the price. Hard to justify on yield alone.' },
//       ]
//     },
//     // ── AREAS — MARINA ──
//     {
//       keywords: ['marina', 'dubai marina', 'jbr', 'jumeirah beach', 'bluewaters'],
//       replies: [
//         { agent: 'Sara Al Hashimi', msg: 'Marina is still one of the strongest short-term rental markets. Tourists want the address — you can hit 85% occupancy in peak season.' },
//         { agent: 'James Crawford', msg: 'Marina prices per sqft are AED 1,600–2,200 for ready stock. Older buildings offer better value — focus on floors 20+ for views.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Bluewaters and JBR have completely reset Marina pricing expectations. The entire waterfront corridor is repricing upward.' },
//       ]
//     },
//     // ── MORTGAGE / FINANCE ──
//     {
//       keywords: ['mortgage', 'finance', 'loan', 'bank', 'interest rate', 'ltv', 'down payment'],
//       replies: [
//         { agent: 'Marco Ferretti', msg: 'UAE mortgage rates are running 4.5–5.2% fixed for expats right now. ADCB and Emirates NBD have the most competitive packages I have seen.' },
//         { agent: 'James Crawford', msg: 'Non-residents can get 50% LTV — so AED 2M property needs AED 1M down. Residents get 80% LTV which changes the entry point significantly.' },
//         { agent: 'Khalid Al Mansouri', msg: 'I always buy cash for off-plan — no mortgage available anyway until handover. For ready stock, mortgage makes sense if your yield covers the rate.' },
//         { agent: 'Sara Al Hashimi', msg: 'Pre-approval takes 3–5 days with most UAE banks. Get it before you make an offer — sellers take you more seriously with a pre-approval letter.' },
//       ]
//     },
//     // ── BUYING PROCESS ──
//     {
//       keywords: ['buy', 'buying', 'purchase', 'how to buy', 'process', 'steps', 'mou', 'noc', 'dld', 'transfer', 'agent'],
//       replies: [
//         { agent: 'James Crawford', msg: 'Process is: agree price → sign MOU → pay 10% deposit → NOC from developer → DLD transfer. Usually 30 days from MOU to transfer.' },
//         { agent: 'Sara Al Hashimi', msg: 'DLD transfer fee is 4% of purchase price — budget for that on top. Plus AED 4,000–5,000 in admin fees. Factor it into your total cost.' },
//         { agent: 'Marco Ferretti', msg: 'I used a RERA-registered agent and it made a big difference. They know which buildings have service charge issues or structural problems to avoid.' },
//         { agent: 'James Crawford', msg: 'Always get a snagging inspection before transfer on any ready property. AED 1,500–2,000 for the service — saves you much more in surprises.' },
//       ]
//     },
//     // ── SELLING ──
//     {
//       keywords: ['sell', 'selling', 'list', 'listing', 'asking price', 'valuation', 'market value'],
//       replies: [
//         { agent: 'Sara Al Hashimi', msg: 'Properties priced within 5% of market value are selling in under 3 weeks right now. Overprice by 10% and it sits for months.' },
//         { agent: 'James Crawford', msg: 'Get a RERA valuation report before listing — gives you a defensible number when buyers negotiate. Costs AED 2,500 but worth it.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Best time to list is September–November and February–April. Summer is slow — if you can wait, Q4 inventory is lower and buyers are more serious.' },
//         { agent: 'Sara Al Hashimi', msg: 'Stage the apartment before photos. I spent AED 8,000 on styling and furniture rental — sold AED 85,000 above what an unstyled unit went for in the same building.' },
//       ]
//     },
//     // ── MARKET CONDITIONS ──
//     {
//       keywords: ['market', 'bubble', 'crash', 'correction', 'slow', 'boom', 'growth', 'forecast', 'trend', '2025', '2026'],
//       replies: [
//         { agent: 'Khalid Al Mansouri', msg: 'Dubai is not in a bubble. Population growth is 100k+ per year and supply cannot keep up. Fundamentals are different from 2008.' },
//         { agent: 'James Crawford', msg: 'Transaction volumes are at record highs — 14,000+ deals per month in 2024. This is not speculative flipping, it is genuine end-user demand.' },
//         { agent: 'Marco Ferretti', msg: 'I was sceptical before I moved here. The demand is real — I know 40 colleagues who relocated to Dubai in the past two years alone.' },
//         { agent: 'Sara Al Hashimi', msg: 'Areas that still have upside: Dubai South, Al Furjan, Meydan. Core areas are fully priced. The growth story has moved to the second ring.' },
//       ]
//     },
//     // ── VISA / GOLDEN VISA ──
//     {
//       keywords: ['visa', 'golden visa', 'residency', 'resident', 'citizenship'],
//       replies: [
//         { agent: 'Marco Ferretti', msg: 'AED 2M property qualifies for a 10-year golden visa — that was the trigger for my purchase. The residency stability changes the calculus completely.' },
//         { agent: 'James Crawford', msg: 'Golden visa through property: AED 2M minimum, must be ready (not off-plan), and fully paid — no mortgage balance. DLD processes it in 2–3 weeks.' },
//         { agent: 'Khalid Al Mansouri', msg: 'The golden visa has driven a whole segment of demand — buyers specifically targeting AED 2M+ ready stock just for the visa. It has a floor effect on that price point.' },
//       ]
//     },
//     // ── PROPERTY TYPES ──
//     {
//       keywords: ['studio', 'bedroom', '1br', '2br', '3br', 'villa', 'apartment', 'flat', 'penthouse', 'townhouse', 'duplex', 'unit', 'floor', 'view', 'furnished', 'unfurnished'],
//       replies: [
//         { agent: 'James Crawford', msg: '1BR in Business Bay or JVC is the sweet spot for yield right now. AED 750k–1.1M range, tenants are easy to find, liquidity is high.' },
//         { agent: 'Sara Al Hashimi', msg: 'Furnished units command 20–25% premium on rent vs unfurnished in the same building. The fit-out cost is AED 30–50k and you earn it back in year one.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Studios are the highest-yield asset class in Dubai but hardest to resell. 1BR is the balance — easier exit, slightly lower yield, much bigger buyer pool.' },
//         { agent: 'Marco Ferretti', msg: 'Villas in Dubai Hills and Arabian Ranches have waiting lists of buyers. If one comes to market priced correctly it is gone in 48 hours.' },
//         { agent: 'James Crawford', msg: 'High floor with Burj or sea view adds 15–25% to value and makes the unit significantly easier to resell. Always worth paying the premium on entry.' },
//       ]
//     },
//     // ── SERVICE CHARGE / FEES ──
//     {
//       keywords: ['service charge', 'maintenance', 'chiller', 'dewa', 'fees', 'charges', 'cost of ownership', 'running cost'],
//       replies: [
//         { agent: 'Sara Al Hashimi', msg: 'Always check the service charge before buying. Some buildings in JLT and Downtown charge AED 25–35 psf — that is AED 25k/year on a 1,000 sqft unit.' },
//         { agent: 'James Crawford', msg: 'Chiller-free buildings are significantly more attractive to tenants and buyers. Worth paying a small premium on entry — lower running costs win long term.' },
//         { agent: 'Khalid Al Mansouri', msg: 'DEWA costs in Dubai average AED 500–800/month for a 1BR. Factor that into your tenant affordability calculation when setting rent.' },
//         { agent: 'Marco Ferretti', msg: 'I nearly bought a unit before I checked the service charge arrears on the building. AED 2.3M in unpaid charges. Always pull the RERA service charge index first.' },
//       ]
//     },
//     // ── SHORT TERM RENTAL / AIRBNB ──
//     {
//       keywords: ['airbnb', 'short term', 'holiday home', 'dtcm', 'vacation rental', 'short-term', 'nightly'],
//       replies: [
//         { agent: 'Sara Al Hashimi', msg: 'Holiday home licence from DTCM costs AED 1,520 per year. You need it before listing on Airbnb — inspections happen and fines are AED 10k+.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Marina, JBR, Palm, and Downtown are the top short-term rental areas. Occupancy above 80% in peak season (Oct–Apr). Summer drops to 50–60%.' },
//         { agent: 'James Crawford', msg: 'Short-term management companies charge 20–25% of revenue. Factor that in — net yield after fees and DEWA is usually 8–10% on a well-located unit.' },
//         { agent: 'Marco Ferretti', msg: 'I use a management company for my Marina unit. Gross AED 120k last year, net after all fees AED 87k. Hands-off investment — worth every dirham.' },
//       ]
//     },
//     // ── CREEK HARBOUR / NEW AREAS ──
//     {
//       keywords: ['creek harbour', 'creek', 'meydan', 'dubai south', 'al furjan', 'motor city', 'sports city', 'arjan', 'mbr', 'mohammad bin rashid'],
//       replies: [
//         { agent: 'Khalid Al Mansouri', msg: 'Creek Harbour is my top pick for 3–5 year hold. Still 30% below Downtown pricing with the same Emaar quality. The creek tower will change everything when it completes.' },
//         { agent: 'James Crawford', msg: 'Dubai South is the long-term infrastructure play. Al Maktoum Airport will be the world\'s largest when done. Property prices there now look cheap in that context.' },
//         { agent: 'Sara Al Hashimi', msg: 'Meydan is underrated. Racecourse views, Sobha quality, and prices per sqft that are 25% below comparable Downtown units. Getting attention from smart money.' },
//         { agent: 'Marco Ferretti', msg: 'Al Furjan surprised me — community feel, good schools, metro access. Families are moving there and that stabilises rental demand significantly.' },
//       ]
//     },
//     // ── GREETING / GENERAL ──
   
//     {
//       keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'salam', 'anyone', 'thoughts', 'opinion', 'advice', 'help', 'suggest'],
//       replies: [
//         { agent: 'James Crawford', msg: 'Morning — active day in the market. Two viewings already and it is not even 10am. What are you looking at?' },
//         { agent: 'Sara Al Hashimi', msg: 'Hey — what is your situation? Buying, selling, or just watching the market right now?' },
//         { agent: 'Khalid Al Mansouri', msg: 'Good to see new people in here. Dubai RE moves fast — what area or asset class are you focused on?' },
//         { agent: 'Marco Ferretti', msg: 'Just closed on something last week after 3 months of searching. Happy to share what I learned — what is your budget range?' },
//       ]
//     },
//   ]

//   const getSmartReply = (userMessage) => {
//     const msg = userMessage.toLowerCase()

//     // Find all matching topic groups
//     const matches = AGENT_REPLIES.filter(group =>
//       group.keywords.some(kw => msg.includes(kw))
//     )

//     if (matches.length === 0) {
//       const generic = [
//         { agent: 'James Crawford', msg: 'Dubai transactions are up 30% year-on-year. Whatever you are considering, the window to enter at current prices is narrowing fast.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Rule I follow: buy within 10 mins of a metro station, sea, or major mall. Everything else in Dubai is secondary to those three anchors.' },
//         { agent: 'Sara Al Hashimi', msg: 'Service charges are the hidden cost people forget. Budget AED 12–18 per sqft per year depending on the building. That eats into yield significantly.' },
//         { agent: 'Marco Ferretti', msg: 'Three things I wish I knew before buying in Dubai: check the service charge history, check if the building has a pool and gym (resale value), and always verify DLD registration.' },
//         { agent: 'James Crawford', msg: 'Handover delays are real — add 6 months to whatever the developer promises on off-plan. Factor that into your cashflow planning.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Foreign ownership is 100% freehold in designated zones — Downtown, Marina, Palm, JVC, Business Bay, Dubai Hills. Outside those zones you need a local partner.' },
//         { agent: 'Sara Al Hashimi', msg: 'RERA regulates everything here. If your agent is not RERA-registered, walk away. Check their license number on the Dubai REST app.' },
//         { agent: 'Marco Ferretti', msg: 'I track DLD transaction data every week. Volume and price per sqft by area — that tells you more than any agent will.' },
//         { agent: 'James Crawford', msg: 'Resale value in Dubai is heavily driven by view and floor. Same unit, different floor — 15% price difference. Always go as high as budget allows.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Property management fee in Dubai runs 5–8% of annual rent. Factor that into your net yield calculation before committing.' },
//       ]
//       return generic[Math.floor(Math.random() * generic.length)]
//     }
//     // Pick the most specific match (most keyword hits) for best accuracy
//     const scored = matches.map(group => ({
//       group,
//       score: group.keywords.filter(kw => msg.includes(kw)).length
//     }))
//     scored.sort((a, b) => b.score - a.score)
//     const bestMatch = scored[0].group
//     return bestMatch.replies[Math.floor(Math.random() * bestMatch.replies.length)]
//   }

//   const triggerAgentReply = async (userMessage) => {
//     // 55% chance agent replies
//     if (Math.random() > 0.55) return

//     // Get smart keyword-matched reply
//     const reply = getSmartReply(userMessage)

//     // Skip if agent name matches the sender
//     if (reply.agent === myName) {
//       const others = AI_AGENT_NAMES.filter(n => n !== myName)
//       reply.agent = others[Math.floor(Math.random() * others.length)]
//     }

//     // Wait 2-6 seconds to feel natural
//     const delay = 2000 + Math.random() * 4000
//     setAgentTyping(true)
//     await new Promise(r => setTimeout(r, delay))
//     setAgentTyping(false)

//     // Save to Supabase so all users see it
//     const { error: insertError } = await supabase.from('messages').insert({
//       user_id: authUser?.id || null,
//       user_name: reply.agent,
//       content: reply.msg,
//     })

//     // If Supabase insert fails, show locally anyway
//     if (insertError) {
//       console.error('Agent insert failed:', insertError)
//       setMessages(prev => [...prev, {
//         id: `agent-local-${Date.now()}`,
//         user_name: reply.agent,
//         content: reply.msg,
//         created_at: new Date().toISOString(),
//       }])
//     }
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
//       <style>{`
//         @keyframes bounce {
//           0%, 100% { transform: translateY(0); opacity: 0.4; }
//           50% { transform: translateY(-4px); opacity: 1; }
//         }
//       `}</style>

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
//         {/* Agent typing indicator */}
//         {agentTyping && (
//           <div style={{
//             padding: '6px 14px',
//             fontSize: '11px',
//             color: '#6b7280',
//             fontStyle: 'italic',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '6px',
//           }}>
//             <span style={{
//               display: 'inline-flex', gap: '3px', alignItems: 'center',
//             }}>
//               <span style={{ animation: 'bounce 1s infinite', animationDelay: '0ms', width: 5, height: 5, borderRadius: '50%', background: '#6b7280', display: 'inline-block' }} />
//               <span style={{ animation: 'bounce 1s infinite', animationDelay: '150ms', width: 5, height: 5, borderRadius: '50%', background: '#6b7280', display: 'inline-block' }} />
//               <span style={{ animation: 'bounce 1s infinite', animationDelay: '300ms', width: 5, height: 5, borderRadius: '50%', background: '#6b7280', display: 'inline-block' }} />
//             </span>
//             Someone is typing...
//           </div>
//         )}
//         <div ref={bottomRef} />
//       </div>

//       {/* Free plan — read-only banner */}
//       {authUser && !canChat && (
//         <div style={{
//           padding: '10px 12px',
//           background: '#0d1117',
//           borderTop: '1px solid #1f2937',
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           gap: '6px',
//           flexShrink: 0,
//         }}>
//           <span style={{ fontSize: '10px', color: 'white', flexShrink: 1, minWidth: 0 }}>
//             🔒 <strong>Read-only.</strong> Upgrade to ACQAR Pro to chat.
//           </span>
//         <a 
//   href="https://www.acqar.com/pricing"
//   target="_top"
//   rel="noopener noreferrer"
//  style={{
//     fontSize: '11px', fontWeight: 700,
//     background: '#B87333', color: 'white',
//     padding: '5px 10px', borderRadius: '6px',
//     textDecoration: 'none',
//     whiteSpace: 'nowrap',
//     flexShrink: 0,
//   }}
// >CLAIM YOUR SPOT → </a>
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
// function getTodayKey() {
//   const currentHour = new Date().toISOString().slice(0, 13)
//   return `acqar_chat_v4_${currentHour}`
// }
// const TODAY_KEY = getTodayKey()

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
//   (e) => [
//     { name: 'Khalid Al Mansouri', msg: `"${e.title}" — saw this at 6am. ${e.location_name || 'Business Bay'} enquiries already up this morning because of it.` },
//     { name: 'James Crawford',     msg: `Three buyers texted me specifically about ${e.location_name || 'that area'} before 9. All reacting to the same news.` },
//     { name: 'Marco Ferretti',     msg: `After "${e.title.slice(0, 50)}..." — is this a sentiment shift or do prices actually move within weeks?` },
//     { name: 'Khalid Al Mansouri', msg: `In ${e.location_name || 'this market'} both happen fast. That headline is the kind that triggers real transactions, not just talk.` },
//     { name: 'Sara Al Hashimi',    msg: `Two sellers already called me after reading "${e.title.slice(0, 45)}..." wanting to list before the next wave.` },
//   ],
//   (e) => [
//     { name: 'Sara Al Hashimi',    msg: `Read "${e.title.slice(0, 50)}..." this morning and immediately bumped my ${e.location_name || 'JVC'} ask by AED 35k.` },
//     { name: 'James Crawford',     msg: `Bold move — what has the reaction been since you repriced?` },
//     { name: 'Sara Al Hashimi',    msg: `Two more enquiries today. People are clearly reading "${e.title.slice(0, 40)}..." and moving faster.` },
//     { name: 'Marco Ferretti',     msg: `Does "${e.title.slice(0, 45)}..." actually change absorption in ${e.location_name || 'JVC'} or just create noise?` },
//     { name: 'Khalid Al Mansouri', msg: `Real absorption. ${e.location_name || 'That area'} had 4 transactions above asking last month — before this headline dropped.` },
//   ],
//   (e) => [
//     { name: 'Marco Ferretti',     msg: `"${e.title}" — does this bring more buyers into ${e.location_name || 'Dubai'} or just squeeze the same pool harder?` },
//     { name: 'James Crawford',     msg: `New buyers, definitely. "${e.title.slice(0, 40)}..." is the kind of headline that reaches people outside our usual circle.` },
//     { name: 'Sara Al Hashimi',    msg: `Window between "${e.title.slice(0, 35)}..." and the price reaction in ${e.location_name || 'this area'} is maybe 3 weeks. That is the window.` },
//     { name: 'Khalid Al Mansouri', msg: `By the time the second wave reads that headline, the deals in ${e.location_name || 'core Dubai'} are already signed.` },
//     { name: 'Marco Ferretti',     msg: `Given "${e.title.slice(0, 45)}..." where exactly would you deploy right now in ${e.location_name || 'Dubai'}?` },
//     { name: 'James Crawford',     msg: `Ready stock in ${e.location_name || 'Creek Harbour'} — not yet fully priced in and that headline changes the calculus.` },
//   ],
//   (e) => [
//     { name: 'James Crawford',     msg: `Buyer walked into my ${e.location_name || 'Downtown'} viewing with "${e.title.slice(0, 45)}..." on his phone. Asked if it changes the ask.` },
//     { name: 'Khalid Al Mansouri', msg: `What did you tell him?` },
//     { name: 'James Crawford',     msg: `That "${e.title.slice(0, 40)}..." confirms the price, it does not negotiate it. He paid full ask.` },
//     { name: 'Sara Al Hashimi',    msg: `${e.location_name || 'That zone'} stopped being a buyers market the moment headlines like "${e.title.slice(0, 35)}..." started appearing.` },
//     { name: 'Marco Ferretti',     msg: `So where is the value left for a buyer who missed ${e.location_name || 'this area'} before "${e.title.slice(0, 35)}..."?` },
//     { name: 'Khalid Al Mansouri', msg: `Adjacent areas that have not yet priced in what "${e.title.slice(0, 40)}..." means for the wider ${e.location_name || 'Dubai'} market.` },
//   ],
//   (e) => [
//     { name: 'Sara Al Hashimi',    msg: `My ${e.location_name || 'Business Bay'} tenant asked if I am selling after seeing "${e.title.slice(0, 45)}...". Wants first refusal.` },
//     { name: 'Marco Ferretti',     msg: `Are you selling given what "${e.title.slice(0, 40)}..." suggests about where prices go from here?` },
//     { name: 'Sara Al Hashimi',    msg: `Leaning yes. "${e.title.slice(0, 40)}..." makes me think capital gain now beats yield over the next 2 years in ${e.location_name || 'this area'}.` },
//     { name: 'Khalid Al Mansouri', msg: `Only sell if you have a clear reinvestment into something that "${e.title.slice(0, 35)}..." has not already priced up.` },
//     { name: 'James Crawford',     msg: `Three tenanted units sold this week in ${e.location_name || 'that area'}. Buyers specifically want income from day one after reading "${e.title.slice(0, 35)}...".` },
//     { name: 'Marco Ferretti',     msg: `What are tenanted units actually yielding net in ${e.location_name || 'that area'} right now post "${e.title.slice(0, 35)}..."?` },
//     { name: 'Khalid Al Mansouri', msg: `Net around 6% after fees — that number looks very different now that "${e.title.slice(0, 40)}..." has reset expectations in ${e.location_name || 'this market'}.` },
//   ],
// ]
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
//     // ── Fetch from Reddit directly (same as DistressDealsModal) ──
//     const subreddits = ['DubaiRealEstate', 'dubairealestate', 'dubai']
//     const DUBAI_AREAS = [
//       'Palm Jumeirah', 'Dubai Hills', 'Business Bay', 'Downtown Dubai',
//       'Dubai Marina', 'JVC', 'Creek Harbour', 'Jumeirah', 'DIFC',
//       'Dubai South', 'Meydan', 'JBR', 'Sobha', 'Damac', 'Emaar',
//       'Al Furjan', 'Motor City', 'Sports City', 'Jumeirah Village',
//     ]
// const RE_KEYWORDS = [
//       'property', 'apartment', 'villa', 'studio', 'bedroom',
//       'aed', 'off-plan', 'offplan', 'developer', 'handover',
//       'mortgage', 'yield', 'roi', 'sqft', 'dld', 'rera',
//       'freehold', 'tenancy', 'landlord', 'real estate',
//       'palm jumeirah', 'dubai hills', 'business bay', 'downtown dubai',
//       'dubai marina', 'jvc', 'creek harbour', 'difc', 'emaar',
//       'damac', 'sobha', 'nakheel', 'meraas',
//     ]

//     const weekAgo = Math.floor(Date.now() / 1000) - (7 * 86400)
//     const allPosts = []
//     const seen = new Set()

//     for (const sub of subreddits) {
//       try {
//         const controller = new AbortController()
//         const timeout = setTimeout(() => controller.abort(), 8000)
//         const resp = await fetch(
//           `https://www.reddit.com/r/${sub}/new.json?limit=100&raw_json=1`,
//           { signal: controller.signal, headers: { 'Accept': 'application/json' } }
//         )
//         clearTimeout(timeout)
//         if (!resp.ok) continue

//         const data = await resp.json()
//         const posts = data?.data?.children || []

//         for (const { data: post } of posts) {
//           if (!post || post.created_utc < weekAgo) continue
//           if (post.selftext === '[removed]' || post.selftext === '[deleted]') continue
//           if (seen.has(post.id)) continue

//           const combined = (post.title + ' ' + (post.selftext || '')).toLowerCase()

//           // Must contain at least one STRONG RE keyword
//           const STRONG_KEYWORDS = [
//             'property', 'apartment', 'villa', 'aed', 'sqft',
//             'off-plan', 'offplan', 'developer', 'dld', 'rera',
//             'real estate', 'freehold', 'mortgage', 'handover',
//             'emaar', 'damac', 'sobha', 'nakheel', 'meraas',
//             'palm jumeirah', 'dubai hills', 'business bay',
//             'downtown dubai', 'dubai marina', 'jvc', 'creek harbour',
//           ]
//           if (!STRONG_KEYWORDS.some(kw => combined.includes(kw))) continue

//           // Skip spam/noise/non-RE posts
//           if (post.title.length < 20) continue
//           if (post.title.includes('|') && post.title.includes('Helping')) continue
//           if (combined.includes('visa') && !combined.includes('property')) continue
//           if (combined.includes('job') && !combined.includes('property')) continue
//           if (combined.includes('restaurant') || combined.includes('food')) continue
//           if (combined.includes('tourist') || combined.includes('vacation')) continue

//           seen.add(post.id)

//           // Extract Dubai location from title
//           const location = DUBAI_AREAS.find(a =>
//             (post.title + ' ' + (post.selftext || '')).includes(a)
//           ) || ''

//           allPosts.push({
//             title: post.title.slice(0, 100),
//             location_name: location,
//             score: post.score || 0,
//           })
//         }
//       } catch (e) {
//         console.log(`Reddit r/${sub} error:`, e?.name === 'AbortError' ? 'timeout' : e)
//       }
//     }

//     // Sort by score and take top 5
//     allPosts.sort((a, b) => b.score - a.score)
//     const events = allPosts.slice(0, 5)

//     if (!events.length) throw new Error('no reddit posts found')

//     console.log('✅ Reddit posts for chat:', events.length, events[0]?.title)

//     const shaped = buildMessagesFromEvents(events)
//     localStorage.setItem(TODAY_KEY, JSON.stringify(shaped))
//     return shaped

//   } catch (err) {
//     console.warn('Reddit chat fetch failed:', err.message)

//     // Fallback to your backend signals
//     try {
//       const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
//       const res = await fetch(`${API_BASE}/api/events/community-signals?limit=10`, {
//         signal: AbortSignal.timeout(6000)
//       })
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const data = await res.json()
//       const signals = data.signals || []
//       if (!signals.length) throw new Error('no signals')

//       const events = signals
//         .filter(s => {
//           const t = s.text || ''
//           if (t.includes(' | ') && t.includes('Helping')) return false
//           if (t.includes('Portfolio Manager')) return false
//           if (t.toLowerCase().includes('searching')) return false
//           if (t.length < 30) return false
//           return true
//         })
//         .map(s => {
//           let title = s.text
//             .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}]\s*/gu, '')
//             .replace(/\s*[-|]\s*(LinkedIn|Arabian Business|Gulf News|Zawya|The National|Bayut|Property Finder).*$/i, '')
//             .replace(/\s{2,}/g, ' ')
//             .trim()
//           if (title.includes(': ')) {
//             const beforeColon = title.split(': ')[0].trim()
//             if (beforeColon.length > 20) title = beforeColon
//           }
//           if (title.length > 80) title = title.slice(0, 80).replace(/\s+\S*$/, '').trim()
//           return { title, location_name: s.location || '' }
//         })
//         .filter(e => e.title.length > 20)
//         .slice(0, 5)

//       if (!events.length) throw new Error('no clean events')

//       const shaped = buildMessagesFromEvents(events)
//       localStorage.setItem(TODAY_KEY, JSON.stringify(shaped))
//       return shaped

//     } catch (err2) {
//       console.warn('Backend fallback also failed:', err2.message, '— using static fallback')
//       return FALLBACK_MESSAGES
//     }
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

// function PrivateChatOverlay({ myName, authUser, target, onClose }) {
//   const [messages, setMessages] = useState([])
//   const [input, setInput] = useState('')
//   const bottomRef = useRef(null)

//   const roomId = [myName.trim(), target.name.trim()].sort().join('__')

//   useEffect(() => {
//    const fetchPrivate = async () => {
//   const { data, error } = await supabase
//     .from('private_messages')
//     .select('*')
//     .eq('room_id', roomId)
//     .order('created_at', { ascending: true })
//     .limit(100)
//   console.log('private fetch:', data, error)
//   if (data) setMessages(data)
// }
//     fetchPrivate()

//     const channel = supabase
//       .channel('private-' + roomId)
//       .on('postgres_changes', {
//         event: 'INSERT',
//         schema: 'public',
//         table: 'private_messages',
//       }, (payload) => {
//         if (payload.new.room_id === roomId) {
//           setMessages(prev =>
//             prev.find(m => m.id === payload.new.id) ? prev : [...prev, payload.new]
//           )
//         }
//       })
//       .subscribe()

//     return () => supabase.removeChannel(channel)
//   }, [roomId])

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   const send = async () => {
//     const text = input.trim()
//     if (!text) return
//     setInput('')
//     await supabase.from('private_messages').insert({
//       room_id: roomId,
//       sender_name: myName,
//       content: text,
//     })
//   }

//   return (
//     <div style={{
//       position: 'absolute', inset: 0, background: '#0d1117',
//       zIndex: 99999, display: 'flex', flexDirection: 'column',
//       fontFamily: "'Inter', sans-serif",
//     }}>
//       {/* Header */}
//       <div style={{
//         display: 'flex', alignItems: 'center', gap: '8px',
//         padding: '0 12px', height: 44, background: '#111827',
//         borderBottom: '1px solid #1f2937', flexShrink: 0,
//       }}>
//        <span style={{ fontSize: '12px', fontWeight: 800, color: '#f9fafb' }}>PRIVATE CHAT (DM)</span>
//         <span style={{ fontSize: '12px', color: nameColor(target.name), fontWeight: 700 }}>
//           {target.name}
//         </span>
//         <div style={{ flex: 1 }} />
//         <button
//           onClick={onClose}
//           style={{
//             background: '#1f2937', border: '1px solid #374151',
//             borderRadius: '6px', color: '#f9fafb', cursor: 'pointer',
//             width: 36, height: 36, fontSize: '16px',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//           }}
//         >✕</button>
//       </div>

//       {/* Notice */}
//       <div style={{
//         padding: '6px 12px',
//         background: 'rgba(99,102,241,0.1)',
//         borderBottom: '1px solid rgba(99,102,241,0.2)',
//         fontSize: '10px', color: '#818cf8', flexShrink: 0,
//       }}>
//         🔐 Private — you may share contact details here
//       </div>

//       {/* Messages */}
//       <div style={{
//         flex: 1, overflowY: 'auto', padding: '8px 0',
//         scrollbarWidth: 'thin', scrollbarColor: '#1f2937 transparent',
//       }}>
//         {messages.length === 0 && (
//           <div style={{
//             fontSize: '11px', color: '#4b5563',
//             textAlign: 'center', padding: '24px',
//           }}>
//             No messages yet. Start the private conversation.
//           </div>
//         )}
//         {messages.map(m => (
//           <div key={m.id} style={{
//             padding: '4px 14px',
//             background: m.sender_name === myName ? 'rgba(184,115,51,0.05)' : 'transparent',
//             borderLeft: m.sender_name === myName ? '2px solid rgba(184,115,51,0.5)' : '2px solid transparent',
//           }}>
//             <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1px' }}>
//               <span style={{ fontSize: '11px', fontWeight: 700, color: nameColor(m.sender_name) }}>
//                 {m.sender_name}
//               </span>
//               <span style={{ fontSize: '9px', color: '#374151' }}>
//                 {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </span>
//             </div>
//             <div style={{ fontSize: '13px', color: '#d1d5db', lineHeight: 1.5, wordBreak: 'break-word' }}>
//               {m.content}
//             </div>
//           </div>
//         ))}
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
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           onKeyDown={e => {
//             if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
//           }}
//           placeholder="Message privately... (email/phone allowed)"
//           maxLength={300}
//           style={{
//             flex: 1, padding: '10px 14px', fontSize: '16px',
//             background: '#1f2937', border: '1px solid #374151',
//             color: '#f9fafb', borderRadius: '8px', outline: 'none',
//             WebkitAppearance: 'none',
//           }}
//           onFocus={e => e.target.style.borderColor = '#6366f1'}
//           onBlur={e => e.target.style.borderColor = '#374151'}
//         />
//         <button
//           onClick={send}
//           disabled={!input.trim()}
//           style={{
//             width: 40, height: 40, borderRadius: '8px',
//             background: input.trim() ? '#6366f1' : '#1f2937',
//             border: 'none', color: 'white', cursor: input.trim() ? 'pointer' : 'default',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: '16px', flexShrink: 0,
//             transition: 'background 0.15s',
//           }}
//         >↗</button>
//       </div>
//     </div>
//   )
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
// const [input, setInput] = useState('')
// const [loading, setLoading] = useState(false)
// const [error, setError] = useState(null)
// const [msgCount, setMsgCount] = useState(null)
// const [agentTyping, setAgentTyping] = useState(false)
// const [privateTarget, setPrivateTarget] = useState(null)      // ← ADD
// const [privateMessages, setPrivateMessages] = useState([])    // ← ADD
// const [privateInput, setPrivateInput] = useState('')          // ← ADD
// const canChat = userPlan !== 'free'

//   const bottomRef = useRef(null)
//   const inputRef = useRef(null)


  
// // ── Auto-refresh when hour changes ──
// useEffect(() => {
//   const msUntilNextHour = () => {
//     const now = new Date()
//     return (60 - now.getMinutes()) * 60000 - now.getSeconds() * 1000
//   }

//   const timeout = setTimeout(() => {
//     // Clear current cache key so new hour fetches fresh
//     const currentKey = getTodayKey()
//     localStorage.removeItem(currentKey)
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
// const sendMessage = async (e) => {
//   e?.preventDefault()
//   if (!myName || !authUser || !canChat) return
//   const text = input.trim()
//   if (!text) return

//   // ── Block email and phone in group chat ──
//   const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
//   const phoneRegex = /(\+?\d[\d\s\-().]{7,}\d)/
//   if (emailRegex.test(text) || phoneRegex.test(text)) {
//     setError('📵 Emails & phone numbers not allowed in group chat. Use private chat instead.')
//     return
//   }

//   setInput('')
//     const { error } = await supabase.from('messages').insert({
//       user_id: authUser.id,
//       user_name: myName,
//       content: text,
//     })
//     if (error) {
//       setError('Failed to send: ' + error.message)
//       return
//     }
//     // Trigger AI agent reply after user sends
//     triggerAgentReply(text)
//   }

//  const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e) }
//   }

//   // ── AI Agent reply ──
//  // ── AI Agent reply — keyword matching, no API key needed ──
//   const AI_AGENT_NAMES = [
//     'Sara Al Hashimi',
//     'Khalid Al Mansouri',
//     'James Crawford',
//     'Marco Ferretti',
//   ]

//   const AGENT_REPLIES = [
//     // ── PRICES ──
//     {
//       keywords: ['price', 'prices', 'pricing', 'expensive', 'cheap', 'cost', 'aed', 'million', 'psf', 'sqft'],
//       replies: [
//         { agent: 'James Crawford', msg: 'Prices in core Dubai are still holding firm. Sellers are not discounting right now — multiple offers on anything priced correctly.' },
//         { agent: 'Khalid Al Mansouri', msg: 'AED 1,800–2,200 psf in Business Bay ready stock. Off-plan is moving faster and at better entry points if you can wait for handover.' },
//         { agent: 'Sara Al Hashimi', msg: 'Compared to 18 months ago, prices are up 20–30% in most areas. The question is whether you are buying for yield or capital gain.' },
//         { agent: 'Marco Ferretti', msg: 'I was surprised how fast prices moved here. What budget range are you working with — that changes the options significantly.' },
//         { agent: 'James Crawford', msg: 'Dubai Hills and MBR City still offer value relative to Downtown. Prices per sqft are 15–20% lower for similar quality.' },
//       ]
//     },
//     // ── INVESTMENT / ROI / YIELD ──
//     {
//       keywords: ['invest', 'investment', 'roi', 'yield', 'return', 'rental', 'rent', 'income', 'profit', 'capital gain'],
//       replies: [
//         { agent: 'Khalid Al Mansouri', msg: 'Net yields in JVC and Sports City are still hitting 7–8%. If you want capital gain, go Downtown or Palm. You cannot have both at peak.' },
//         { agent: 'Sara Al Hashimi', msg: 'Tenanted properties are selling fast right now. Buyers want income from day one — furnish it and list it tenanted for a 15% premium.' },
//         { agent: 'James Crawford', msg: 'Best ROI entry right now is off-plan in Dubai South or Al Furjan. Lower entry price, strong rental demand when it completes.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Short-term rental in Marina or JBR is generating 10–12% gross. You need a holiday home licence — DTCM handles it, process takes 2 weeks.' },
//         { agent: 'Marco Ferretti', msg: 'I ran the numbers on three areas. Creek Harbour surprised me — yields are solid and capital appreciation is still early-stage.' },
//       ]
//     },
//     // ── OFF-PLAN ──
//     {
//       keywords: ['off-plan', 'offplan', 'off plan', 'launch', 'developer', 'handover', 'payment plan', 'emaar', 'damac', 'sobha', 'nakheel', 'meraas'],
//       replies: [
//         { agent: 'James Crawford', msg: 'Off-plan payment plans from Emaar and Sobha are 60/40 right now. You pay 60% during construction, 40% on handover. Protects your cashflow.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Sobha Hartland 2 and Dubai Hills phase 3 are selling out within days of launch. You need to be on the priority list before public launch.' },
//         { agent: 'Sara Al Hashimi', msg: 'DAMAC is offering post-handover payment plans on some units — 3 years after keys. That is the one to look at if cashflow is tight.' },
//         { agent: 'Marco Ferretti', msg: 'Which developer are you looking at? Some have better build quality track records than others — Emaar and Sobha are the benchmarks here.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Off-plan in Dubai South is the play right now. Al Maktoum Airport expansion makes that whole corridor interesting for 3–5 year hold.' },
//       ]
//     },
//     // ── AREAS — DUBAI HILLS ──
//     {
//       keywords: ['dubai hills', 'hills estate', 'hills'],
//       replies: [
//         { agent: 'James Crawford', msg: 'Dubai Hills is fully established now. Villas have appreciated 45% since 2021. Apartments around the golf course are the value play remaining.' },
//         { agent: 'Sara Al Hashimi', msg: 'Sold a 3BR villa in Dubai Hills last month — 14 viewings in 4 days, went above asking. That market has very strong demand.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Dubai Hills Mall has changed the dynamic completely. Foot traffic drives rental demand — 1BR apartments near the mall are yielding 6.5% net.' },
//       ]
//     },
//     // ── AREAS — BUSINESS BAY ──
//     {
//       keywords: ['business bay', 'bay'],
//       replies: [
//         { agent: 'James Crawford', msg: 'Business Bay is the most liquid market in Dubai right now. High transaction volume, lots of ready buyers and sellers.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Canal-facing units in Business Bay command a 20% premium. Non-canal is better value but slower to appreciate.' },
//         { agent: 'Sara Al Hashimi', msg: 'My Business Bay studio is generating AED 75k per year short-term. Running costs are around AED 15k including management — net is strong.' },
//       ]
//     },
//     // ── AREAS — JVC ──
//     {
//       keywords: ['jvc', 'jumeirah village circle', 'jumeirah village'],
//       replies: [
//         { agent: 'Sara Al Hashimi', msg: 'JVC is the highest transaction volume area in Dubai. Studios and 1BRs move in days if priced right — AED 550–750k range.' },
//         { agent: 'James Crawford', msg: 'JVC yields are holding at 7–8% net. The infrastructure has improved massively — Circle Mall changed the whole feel of the community.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Entry point in JVC is still accessible. For long-term hold it is solid — not glamorous but the numbers work better than most premium areas.' },
//       ]
//     },
//     // ── AREAS — PALM ──
//     {
//       keywords: ['palm', 'palm jumeirah', 'palm jebel ali', 'atlantis', 'frond'],
//       replies: [
//         { agent: 'Khalid Al Mansouri', msg: 'Palm Jebel Ali is where early movers are going. Plots have moved 20%+ since launch. Palm Jumeirah is fully priced — Jebel Ali is the opportunity.' },
//         { agent: 'James Crawford', msg: 'Palm Jumeirah villas are AED 15–35M range now. The rental yields are only 3–4% net but the capital preservation is exceptional.' },
//         { agent: 'Sara Al Hashimi', msg: 'The new monorail extension on Palm Jumeirah is driving another wave of interest. Connectivity was the one gap — that is closing.' },
//       ]
//     },
//     // ── AREAS — DOWNTOWN ──
//     {
//       keywords: ['downtown', 'burj khalifa', 'burj', 'opera', 'address'],
//       replies: [
//         { agent: 'James Crawford', msg: 'Downtown Dubai is a trophy asset — prices reflect that. AED 2,800–4,500 psf depending on floor and view. Yield is 3.5–4.5% net.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Downtown is for capital preservation, not yield. If you want income, go JVC or Business Bay. Downtown is a store of value play.' },
//         { agent: 'Marco Ferretti', msg: 'I looked at Downtown seriously — the Burj view premium is real but so is the price. Hard to justify on yield alone.' },
//       ]
//     },
//     // ── AREAS — MARINA ──
//     {
//       keywords: ['marina', 'dubai marina', 'jbr', 'jumeirah beach', 'bluewaters'],
//       replies: [
//         { agent: 'Sara Al Hashimi', msg: 'Marina is still one of the strongest short-term rental markets. Tourists want the address — you can hit 85% occupancy in peak season.' },
//         { agent: 'James Crawford', msg: 'Marina prices per sqft are AED 1,600–2,200 for ready stock. Older buildings offer better value — focus on floors 20+ for views.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Bluewaters and JBR have completely reset Marina pricing expectations. The entire waterfront corridor is repricing upward.' },
//       ]
//     },
//     // ── MORTGAGE / FINANCE ──
//     {
//       keywords: ['mortgage', 'finance', 'loan', 'bank', 'interest rate', 'ltv', 'down payment'],
//       replies: [
//         { agent: 'Marco Ferretti', msg: 'UAE mortgage rates are running 4.5–5.2% fixed for expats right now. ADCB and Emirates NBD have the most competitive packages I have seen.' },
//         { agent: 'James Crawford', msg: 'Non-residents can get 50% LTV — so AED 2M property needs AED 1M down. Residents get 80% LTV which changes the entry point significantly.' },
//         { agent: 'Khalid Al Mansouri', msg: 'I always buy cash for off-plan — no mortgage available anyway until handover. For ready stock, mortgage makes sense if your yield covers the rate.' },
//         { agent: 'Sara Al Hashimi', msg: 'Pre-approval takes 3–5 days with most UAE banks. Get it before you make an offer — sellers take you more seriously with a pre-approval letter.' },
//       ]
//     },
//     // ── BUYING PROCESS ──
//     {
//       keywords: ['buy', 'buying', 'purchase', 'how to buy', 'process', 'steps', 'mou', 'noc', 'dld', 'transfer', 'agent'],
//       replies: [
//         { agent: 'James Crawford', msg: 'Process is: agree price → sign MOU → pay 10% deposit → NOC from developer → DLD transfer. Usually 30 days from MOU to transfer.' },
//         { agent: 'Sara Al Hashimi', msg: 'DLD transfer fee is 4% of purchase price — budget for that on top. Plus AED 4,000–5,000 in admin fees. Factor it into your total cost.' },
//         { agent: 'Marco Ferretti', msg: 'I used a RERA-registered agent and it made a big difference. They know which buildings have service charge issues or structural problems to avoid.' },
//         { agent: 'James Crawford', msg: 'Always get a snagging inspection before transfer on any ready property. AED 1,500–2,000 for the service — saves you much more in surprises.' },
//       ]
//     },
//     // ── SELLING ──
//     {
//       keywords: ['sell', 'selling', 'list', 'listing', 'asking price', 'valuation', 'market value'],
//       replies: [
//         { agent: 'Sara Al Hashimi', msg: 'Properties priced within 5% of market value are selling in under 3 weeks right now. Overprice by 10% and it sits for months.' },
//         { agent: 'James Crawford', msg: 'Get a RERA valuation report before listing — gives you a defensible number when buyers negotiate. Costs AED 2,500 but worth it.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Best time to list is September–November and February–April. Summer is slow — if you can wait, Q4 inventory is lower and buyers are more serious.' },
//         { agent: 'Sara Al Hashimi', msg: 'Stage the apartment before photos. I spent AED 8,000 on styling and furniture rental — sold AED 85,000 above what an unstyled unit went for in the same building.' },
//       ]
//     },
//     // ── MARKET CONDITIONS ──
//     {
//       keywords: ['market', 'bubble', 'crash', 'correction', 'slow', 'boom', 'growth', 'forecast', 'trend', '2025', '2026'],
//       replies: [
//         { agent: 'Khalid Al Mansouri', msg: 'Dubai is not in a bubble. Population growth is 100k+ per year and supply cannot keep up. Fundamentals are different from 2008.' },
//         { agent: 'James Crawford', msg: 'Transaction volumes are at record highs — 14,000+ deals per month in 2024. This is not speculative flipping, it is genuine end-user demand.' },
//         { agent: 'Marco Ferretti', msg: 'I was sceptical before I moved here. The demand is real — I know 40 colleagues who relocated to Dubai in the past two years alone.' },
//         { agent: 'Sara Al Hashimi', msg: 'Areas that still have upside: Dubai South, Al Furjan, Meydan. Core areas are fully priced. The growth story has moved to the second ring.' },
//       ]
//     },
//     // ── VISA / GOLDEN VISA ──
//     {
//       keywords: ['visa', 'golden visa', 'residency', 'resident', 'citizenship'],
//       replies: [
//         { agent: 'Marco Ferretti', msg: 'AED 2M property qualifies for a 10-year golden visa — that was the trigger for my purchase. The residency stability changes the calculus completely.' },
//         { agent: 'James Crawford', msg: 'Golden visa through property: AED 2M minimum, must be ready (not off-plan), and fully paid — no mortgage balance. DLD processes it in 2–3 weeks.' },
//         { agent: 'Khalid Al Mansouri', msg: 'The golden visa has driven a whole segment of demand — buyers specifically targeting AED 2M+ ready stock just for the visa. It has a floor effect on that price point.' },
//       ]
//     },
//     // ── PROPERTY TYPES ──
//     {
//       keywords: ['studio', 'bedroom', '1br', '2br', '3br', 'villa', 'apartment', 'flat', 'penthouse', 'townhouse', 'duplex', 'unit', 'floor', 'view', 'furnished', 'unfurnished'],
//       replies: [
//         { agent: 'James Crawford', msg: '1BR in Business Bay or JVC is the sweet spot for yield right now. AED 750k–1.1M range, tenants are easy to find, liquidity is high.' },
//         { agent: 'Sara Al Hashimi', msg: 'Furnished units command 20–25% premium on rent vs unfurnished in the same building. The fit-out cost is AED 30–50k and you earn it back in year one.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Studios are the highest-yield asset class in Dubai but hardest to resell. 1BR is the balance — easier exit, slightly lower yield, much bigger buyer pool.' },
//         { agent: 'Marco Ferretti', msg: 'Villas in Dubai Hills and Arabian Ranches have waiting lists of buyers. If one comes to market priced correctly it is gone in 48 hours.' },
//         { agent: 'James Crawford', msg: 'High floor with Burj or sea view adds 15–25% to value and makes the unit significantly easier to resell. Always worth paying the premium on entry.' },
//       ]
//     },
//     // ── SERVICE CHARGE / FEES ──
//     {
//       keywords: ['service charge', 'maintenance', 'chiller', 'dewa', 'fees', 'charges', 'cost of ownership', 'running cost'],
//       replies: [
//         { agent: 'Sara Al Hashimi', msg: 'Always check the service charge before buying. Some buildings in JLT and Downtown charge AED 25–35 psf — that is AED 25k/year on a 1,000 sqft unit.' },
//         { agent: 'James Crawford', msg: 'Chiller-free buildings are significantly more attractive to tenants and buyers. Worth paying a small premium on entry — lower running costs win long term.' },
//         { agent: 'Khalid Al Mansouri', msg: 'DEWA costs in Dubai average AED 500–800/month for a 1BR. Factor that into your tenant affordability calculation when setting rent.' },
//         { agent: 'Marco Ferretti', msg: 'I nearly bought a unit before I checked the service charge arrears on the building. AED 2.3M in unpaid charges. Always pull the RERA service charge index first.' },
//       ]
//     },
//     // ── SHORT TERM RENTAL / AIRBNB ──
//     {
//       keywords: ['airbnb', 'short term', 'holiday home', 'dtcm', 'vacation rental', 'short-term', 'nightly'],
//       replies: [
//         { agent: 'Sara Al Hashimi', msg: 'Holiday home licence from DTCM costs AED 1,520 per year. You need it before listing on Airbnb — inspections happen and fines are AED 10k+.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Marina, JBR, Palm, and Downtown are the top short-term rental areas. Occupancy above 80% in peak season (Oct–Apr). Summer drops to 50–60%.' },
//         { agent: 'James Crawford', msg: 'Short-term management companies charge 20–25% of revenue. Factor that in — net yield after fees and DEWA is usually 8–10% on a well-located unit.' },
//         { agent: 'Marco Ferretti', msg: 'I use a management company for my Marina unit. Gross AED 120k last year, net after all fees AED 87k. Hands-off investment — worth every dirham.' },
//       ]
//     },
//     // ── CREEK HARBOUR / NEW AREAS ──
//     {
//       keywords: ['creek harbour', 'creek', 'meydan', 'dubai south', 'al furjan', 'motor city', 'sports city', 'arjan', 'mbr', 'mohammad bin rashid'],
//       replies: [
//         { agent: 'Khalid Al Mansouri', msg: 'Creek Harbour is my top pick for 3–5 year hold. Still 30% below Downtown pricing with the same Emaar quality. The creek tower will change everything when it completes.' },
//         { agent: 'James Crawford', msg: 'Dubai South is the long-term infrastructure play. Al Maktoum Airport will be the world\'s largest when done. Property prices there now look cheap in that context.' },
//         { agent: 'Sara Al Hashimi', msg: 'Meydan is underrated. Racecourse views, Sobha quality, and prices per sqft that are 25% below comparable Downtown units. Getting attention from smart money.' },
//         { agent: 'Marco Ferretti', msg: 'Al Furjan surprised me — community feel, good schools, metro access. Families are moving there and that stabilises rental demand significantly.' },
//       ]
//     },
//     // ── GREETING / GENERAL ──
   
//     {
//       keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'salam', 'anyone', 'thoughts', 'opinion', 'advice', 'help', 'suggest'],
//       replies: [
//         { agent: 'James Crawford', msg: 'Morning — active day in the market. Two viewings already and it is not even 10am. What are you looking at?' },
//         { agent: 'Sara Al Hashimi', msg: 'Hey — what is your situation? Buying, selling, or just watching the market right now?' },
//         { agent: 'Khalid Al Mansouri', msg: 'Good to see new people in here. Dubai RE moves fast — what area or asset class are you focused on?' },
//         { agent: 'Marco Ferretti', msg: 'Just closed on something last week after 3 months of searching. Happy to share what I learned — what is your budget range?' },
//       ]
//     },
//   ]

//   const getSmartReply = (userMessage) => {
//     const msg = userMessage.toLowerCase()

//     // Find all matching topic groups
//     const matches = AGENT_REPLIES.filter(group =>
//       group.keywords.some(kw => msg.includes(kw))
//     )

//     if (matches.length === 0) {
//       const generic = [
//         { agent: 'James Crawford', msg: 'Dubai transactions are up 30% year-on-year. Whatever you are considering, the window to enter at current prices is narrowing fast.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Rule I follow: buy within 10 mins of a metro station, sea, or major mall. Everything else in Dubai is secondary to those three anchors.' },
//         { agent: 'Sara Al Hashimi', msg: 'Service charges are the hidden cost people forget. Budget AED 12–18 per sqft per year depending on the building. That eats into yield significantly.' },
//         { agent: 'Marco Ferretti', msg: 'Three things I wish I knew before buying in Dubai: check the service charge history, check if the building has a pool and gym (resale value), and always verify DLD registration.' },
//         { agent: 'James Crawford', msg: 'Handover delays are real — add 6 months to whatever the developer promises on off-plan. Factor that into your cashflow planning.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Foreign ownership is 100% freehold in designated zones — Downtown, Marina, Palm, JVC, Business Bay, Dubai Hills. Outside those zones you need a local partner.' },
//         { agent: 'Sara Al Hashimi', msg: 'RERA regulates everything here. If your agent is not RERA-registered, walk away. Check their license number on the Dubai REST app.' },
//         { agent: 'Marco Ferretti', msg: 'I track DLD transaction data every week. Volume and price per sqft by area — that tells you more than any agent will.' },
//         { agent: 'James Crawford', msg: 'Resale value in Dubai is heavily driven by view and floor. Same unit, different floor — 15% price difference. Always go as high as budget allows.' },
//         { agent: 'Khalid Al Mansouri', msg: 'Property management fee in Dubai runs 5–8% of annual rent. Factor that into your net yield calculation before committing.' },
//       ]
//       return generic[Math.floor(Math.random() * generic.length)]
//     }
//     // Pick the most specific match (most keyword hits) for best accuracy
//     const scored = matches.map(group => ({
//       group,
//       score: group.keywords.filter(kw => msg.includes(kw)).length
//     }))
//     scored.sort((a, b) => b.score - a.score)
//     const bestMatch = scored[0].group
//     return bestMatch.replies[Math.floor(Math.random() * bestMatch.replies.length)]
//   }

//   const triggerAgentReply = async (userMessage) => {
//     // 55% chance agent replies
//     if (Math.random() > 0.55) return

//     // Get smart keyword-matched reply
//     const reply = getSmartReply(userMessage)

//     // Skip if agent name matches the sender
//     if (reply.agent === myName) {
//       const others = AI_AGENT_NAMES.filter(n => n !== myName)
//       reply.agent = others[Math.floor(Math.random() * others.length)]
//     }

//     // Wait 2-6 seconds to feel natural
//     const delay = 2000 + Math.random() * 4000
//     setAgentTyping(true)
//     await new Promise(r => setTimeout(r, delay))
//     setAgentTyping(false)

//     // Save to Supabase so all users see it
//     const { error: insertError } = await supabase.from('messages').insert({
//       user_id: authUser?.id || null,
//       user_name: reply.agent,
//       content: reply.msg,
//     })

//     // If Supabase insert fails, show locally anyway
//     if (insertError) {
//       console.error('Agent insert failed:', insertError)
//       setMessages(prev => [...prev, {
//         id: `agent-local-${Date.now()}`,
//         user_name: reply.agent,
//         content: reply.msg,
//         created_at: new Date().toISOString(),
//       }])
//     }
//   }

//   return (
//     <div style={{
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   background: '#111827',
//   fontFamily: "'Inter', sans-serif",
//   overflow: 'hidden',
//   pointerEvents: 'auto',
//   position: 'relative',   // ← ADD THIS
// }}>
//       <style>{`
//         @keyframes bounce {
//           0%, 100% { transform: translateY(0); opacity: 0.4; }
//           50% { transform: translateY(-4px); opacity: 1; }
//         }
//       `}</style>

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
//                   <span
//   onClick={() => {
//     if (msg.user_name !== myName) setPrivateTarget({ name: msg.user_name, userId: msg.user_id })
//   }}
//   style={{
//     fontSize: '13px', fontWeight: 700, color,
//     cursor: msg.user_name !== myName ? 'pointer' : 'default',
//     textDecoration: msg.user_name !== myName ? 'underline dotted' : 'none',
//   }}
//   title={msg.user_name !== myName ? `Private chat with ${msg.user_name}` : ''}
// >
//   {msg.user_name}
// </span>
//                   <span style={{ fontSize: '9px', color: '#374151' }}>{formatTime(msg.created_at)}</span>
//                 </div>
//               )}
//               <div style={{ fontSize: '13px', color: '#d1d5db', lineHeight: 1.5, wordBreak: 'break-word' }}>
//                 {msg.content}
//               </div>
//             </div>
//           )
//         })}
//         {/* Agent typing indicator */}
//         {agentTyping && (
//           <div style={{
//             padding: '6px 14px',
//             fontSize: '11px',
//             color: '#6b7280',
//             fontStyle: 'italic',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '6px',
//           }}>
//             <span style={{
//               display: 'inline-flex', gap: '3px', alignItems: 'center',
//             }}>
//               <span style={{ animation: 'bounce 1s infinite', animationDelay: '0ms', width: 5, height: 5, borderRadius: '50%', background: '#6b7280', display: 'inline-block' }} />
//               <span style={{ animation: 'bounce 1s infinite', animationDelay: '150ms', width: 5, height: 5, borderRadius: '50%', background: '#6b7280', display: 'inline-block' }} />
//               <span style={{ animation: 'bounce 1s infinite', animationDelay: '300ms', width: 5, height: 5, borderRadius: '50%', background: '#6b7280', display: 'inline-block' }} />
//             </span>
//             Someone is typing...
//           </div>
//         )}
//         <div ref={bottomRef} />
//       </div>

//       {/* Free plan — read-only banner */}
//       {authUser && !canChat && (
//         <div style={{
//           padding: '10px 12px',
//           background: '#0d1117',
//           borderTop: '1px solid #1f2937',
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           gap: '6px',
//           flexShrink: 0,
//         }}>
//           <span style={{ fontSize: '10px', color: 'white', flexShrink: 1, minWidth: 0 }}>
//             🔒 <strong>Read-only.</strong> Upgrade to ACQAR Pro to chat.
//           </span>
//         <a 
//   href="https://www.acqar.com/pricing"
//   target="_top"
//   rel="noopener noreferrer"
//  style={{
//     fontSize: '11px', fontWeight: 700,
//     background: '#B87333', color: 'white',
//     padding: '5px 10px', borderRadius: '6px',
//     textDecoration: 'none',
//     whiteSpace: 'nowrap',
//     flexShrink: 0,
//   }}
// >CLAIM YOUR SPOT → </a>
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

//       {/* Private Chat Overlay */}
//       {privateTarget && (
//         <PrivateChatOverlay
//           myName={myName}
//           authUser={authUser}
//           target={privateTarget}
//           onClose={() => setPrivateTarget(null)}
//         />
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
function getTodayKey() {
  const currentHour = new Date().toISOString().slice(0, 13)
  return `acqar_chat_v4_${currentHour}`
}
const TODAY_KEY = getTodayKey()

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
  (e) => [
    { name: 'Khalid Al Mansouri', msg: `"${e.title}" — saw this at 6am. ${e.location_name || 'Business Bay'} enquiries already up this morning because of it.` },
    { name: 'James Crawford',     msg: `Three buyers texted me specifically about ${e.location_name || 'that area'} before 9. All reacting to the same news.` },
    { name: 'Marco Ferretti',     msg: `After "${e.title.slice(0, 50)}..." — is this a sentiment shift or do prices actually move within weeks?` },
    { name: 'Khalid Al Mansouri', msg: `In ${e.location_name || 'this market'} both happen fast. That headline is the kind that triggers real transactions, not just talk.` },
    { name: 'Sara Al Hashimi',    msg: `Two sellers already called me after reading "${e.title.slice(0, 45)}..." wanting to list before the next wave.` },
  ],
  (e) => [
    { name: 'Sara Al Hashimi',    msg: `Read "${e.title.slice(0, 50)}..." this morning and immediately bumped my ${e.location_name || 'JVC'} ask by AED 35k.` },
    { name: 'James Crawford',     msg: `Bold move — what has the reaction been since you repriced?` },
    { name: 'Sara Al Hashimi',    msg: `Two more enquiries today. People are clearly reading "${e.title.slice(0, 40)}..." and moving faster.` },
    { name: 'Marco Ferretti',     msg: `Does "${e.title.slice(0, 45)}..." actually change absorption in ${e.location_name || 'JVC'} or just create noise?` },
    { name: 'Khalid Al Mansouri', msg: `Real absorption. ${e.location_name || 'That area'} had 4 transactions above asking last month — before this headline dropped.` },
  ],
  (e) => [
    { name: 'Marco Ferretti',     msg: `"${e.title}" — does this bring more buyers into ${e.location_name || 'Dubai'} or just squeeze the same pool harder?` },
    { name: 'James Crawford',     msg: `New buyers, definitely. "${e.title.slice(0, 40)}..." is the kind of headline that reaches people outside our usual circle.` },
    { name: 'Sara Al Hashimi',    msg: `Window between "${e.title.slice(0, 35)}..." and the price reaction in ${e.location_name || 'this area'} is maybe 3 weeks. That is the window.` },
    { name: 'Khalid Al Mansouri', msg: `By the time the second wave reads that headline, the deals in ${e.location_name || 'core Dubai'} are already signed.` },
    { name: 'Marco Ferretti',     msg: `Given "${e.title.slice(0, 45)}..." where exactly would you deploy right now in ${e.location_name || 'Dubai'}?` },
    { name: 'James Crawford',     msg: `Ready stock in ${e.location_name || 'Creek Harbour'} — not yet fully priced in and that headline changes the calculus.` },
  ],
  (e) => [
    { name: 'James Crawford',     msg: `Buyer walked into my ${e.location_name || 'Downtown'} viewing with "${e.title.slice(0, 45)}..." on his phone. Asked if it changes the ask.` },
    { name: 'Khalid Al Mansouri', msg: `What did you tell him?` },
    { name: 'James Crawford',     msg: `That "${e.title.slice(0, 40)}..." confirms the price, it does not negotiate it. He paid full ask.` },
    { name: 'Sara Al Hashimi',    msg: `${e.location_name || 'That zone'} stopped being a buyers market the moment headlines like "${e.title.slice(0, 35)}..." started appearing.` },
    { name: 'Marco Ferretti',     msg: `So where is the value left for a buyer who missed ${e.location_name || 'this area'} before "${e.title.slice(0, 35)}..."?` },
    { name: 'Khalid Al Mansouri', msg: `Adjacent areas that have not yet priced in what "${e.title.slice(0, 40)}..." means for the wider ${e.location_name || 'Dubai'} market.` },
  ],
  (e) => [
    { name: 'Sara Al Hashimi',    msg: `My ${e.location_name || 'Business Bay'} tenant asked if I am selling after seeing "${e.title.slice(0, 45)}...". Wants first refusal.` },
    { name: 'Marco Ferretti',     msg: `Are you selling given what "${e.title.slice(0, 40)}..." suggests about where prices go from here?` },
    { name: 'Sara Al Hashimi',    msg: `Leaning yes. "${e.title.slice(0, 40)}..." makes me think capital gain now beats yield over the next 2 years in ${e.location_name || 'this area'}.` },
    { name: 'Khalid Al Mansouri', msg: `Only sell if you have a clear reinvestment into something that "${e.title.slice(0, 35)}..." has not already priced up.` },
    { name: 'James Crawford',     msg: `Three tenanted units sold this week in ${e.location_name || 'that area'}. Buyers specifically want income from day one after reading "${e.title.slice(0, 35)}...".` },
    { name: 'Marco Ferretti',     msg: `What are tenanted units actually yielding net in ${e.location_name || 'that area'} right now post "${e.title.slice(0, 35)}..."?` },
    { name: 'Khalid Al Mansouri', msg: `Net around 6% after fees — that number looks very different now that "${e.title.slice(0, 40)}..." has reset expectations in ${e.location_name || 'this market'}.` },
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
    // ── Fetch from Reddit directly (same as DistressDealsModal) ──
    const subreddits = ['DubaiRealEstate', 'dubairealestate', 'dubai']
    const DUBAI_AREAS = [
      'Palm Jumeirah', 'Dubai Hills', 'Business Bay', 'Downtown Dubai',
      'Dubai Marina', 'JVC', 'Creek Harbour', 'Jumeirah', 'DIFC',
      'Dubai South', 'Meydan', 'JBR', 'Sobha', 'Damac', 'Emaar',
      'Al Furjan', 'Motor City', 'Sports City', 'Jumeirah Village',
    ]
const RE_KEYWORDS = [
      'property', 'apartment', 'villa', 'studio', 'bedroom',
      'aed', 'off-plan', 'offplan', 'developer', 'handover',
      'mortgage', 'yield', 'roi', 'sqft', 'dld', 'rera',
      'freehold', 'tenancy', 'landlord', 'real estate',
      'palm jumeirah', 'dubai hills', 'business bay', 'downtown dubai',
      'dubai marina', 'jvc', 'creek harbour', 'difc', 'emaar',
      'damac', 'sobha', 'nakheel', 'meraas',
    ]

    const weekAgo = Math.floor(Date.now() / 1000) - (7 * 86400)
    const allPosts = []
    const seen = new Set()

    for (const sub of subreddits) {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 8000)
        const resp = await fetch(
          `https://www.reddit.com/r/${sub}/new.json?limit=100&raw_json=1`,
          { signal: controller.signal, headers: { 'Accept': 'application/json' } }
        )
        clearTimeout(timeout)
        if (!resp.ok) continue

        const data = await resp.json()
        const posts = data?.data?.children || []

        for (const { data: post } of posts) {
          if (!post || post.created_utc < weekAgo) continue
          if (post.selftext === '[removed]' || post.selftext === '[deleted]') continue
          if (seen.has(post.id)) continue

          const combined = (post.title + ' ' + (post.selftext || '')).toLowerCase()

          // Must contain at least one STRONG RE keyword
          const STRONG_KEYWORDS = [
            'property', 'apartment', 'villa', 'aed', 'sqft',
            'off-plan', 'offplan', 'developer', 'dld', 'rera',
            'real estate', 'freehold', 'mortgage', 'handover',
            'emaar', 'damac', 'sobha', 'nakheel', 'meraas',
            'palm jumeirah', 'dubai hills', 'business bay',
            'downtown dubai', 'dubai marina', 'jvc', 'creek harbour',
          ]
          if (!STRONG_KEYWORDS.some(kw => combined.includes(kw))) continue

          // Skip spam/noise/non-RE posts
          if (post.title.length < 20) continue
          if (post.title.includes('|') && post.title.includes('Helping')) continue
          if (combined.includes('visa') && !combined.includes('property')) continue
          if (combined.includes('job') && !combined.includes('property')) continue
          if (combined.includes('restaurant') || combined.includes('food')) continue
          if (combined.includes('tourist') || combined.includes('vacation')) continue

          seen.add(post.id)

          // Extract Dubai location from title
          const location = DUBAI_AREAS.find(a =>
            (post.title + ' ' + (post.selftext || '')).includes(a)
          ) || ''

          allPosts.push({
            title: post.title.slice(0, 100),
            location_name: location,
            score: post.score || 0,
          })
        }
      } catch (e) {
        console.log(`Reddit r/${sub} error:`, e?.name === 'AbortError' ? 'timeout' : e)
      }
    }

    // Sort by score and take top 5
    allPosts.sort((a, b) => b.score - a.score)
    const events = allPosts.slice(0, 5)

    if (!events.length) throw new Error('no reddit posts found')

    console.log('✅ Reddit posts for chat:', events.length, events[0]?.title)

    const shaped = buildMessagesFromEvents(events)
    localStorage.setItem(TODAY_KEY, JSON.stringify(shaped))
    return shaped

  } catch (err) {
    console.warn('Reddit chat fetch failed:', err.message)

    // Fallback to your backend signals
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const res = await fetch(`${API_BASE}/api/events/community-signals?limit=10`, {
        signal: AbortSignal.timeout(6000)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const signals = data.signals || []
      if (!signals.length) throw new Error('no signals')

      const events = signals
        .filter(s => {
          const t = s.text || ''
          if (t.includes(' | ') && t.includes('Helping')) return false
          if (t.includes('Portfolio Manager')) return false
          if (t.toLowerCase().includes('searching')) return false
          if (t.length < 30) return false
          return true
        })
        .map(s => {
          let title = s.text
            .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}]\s*/gu, '')
            .replace(/\s*[-|]\s*(LinkedIn|Arabian Business|Gulf News|Zawya|The National|Bayut|Property Finder).*$/i, '')
            .replace(/\s{2,}/g, ' ')
            .trim()
          if (title.includes(': ')) {
            const beforeColon = title.split(': ')[0].trim()
            if (beforeColon.length > 20) title = beforeColon
          }
          if (title.length > 80) title = title.slice(0, 80).replace(/\s+\S*$/, '').trim()
          return { title, location_name: s.location || '' }
        })
        .filter(e => e.title.length > 20)
        .slice(0, 5)

      if (!events.length) throw new Error('no clean events')

      const shaped = buildMessagesFromEvents(events)
      localStorage.setItem(TODAY_KEY, JSON.stringify(shaped))
      return shaped

    } catch (err2) {
      console.warn('Backend fallback also failed:', err2.message, '— using static fallback')
      return FALLBACK_MESSAGES
    }
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

function PrivateChatOverlay({ myName, authUser, target, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  const roomId = [myName.trim(), target.name.trim()].sort().join('__')

  useEffect(() => {
   const fetchPrivate = async () => {
  const { data, error } = await supabase
    .from('private_messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
    .limit(100)
  console.log('private fetch:', data, error)
  if (data) setMessages(data)
}
    fetchPrivate()

    const channel = supabase
      .channel('private-' + roomId)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'private_messages',
      }, (payload) => {
        if (payload.new.room_id === roomId) {
          setMessages(prev =>
            prev.find(m => m.id === payload.new.id) ? prev : [...prev, payload.new]
          )
        }
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [roomId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    await supabase.from('private_messages').insert({
      room_id: roomId,
      sender_name: myName,
      content: text,
    })
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#0d1117',
      zIndex: 99999, display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '0 12px', height: 44, background: '#111827',
        borderBottom: '1px solid #1f2937', flexShrink: 0,
      }}>
       <span style={{ fontSize: '12px', fontWeight: 800, color: '#f9fafb' }}>PRIVATE CHAT (DM)</span>
        <span style={{ fontSize: '12px', color: nameColor(target.name), fontWeight: 700 }}>
          {target.name}
        </span>
        <div style={{ flex: 1 }} />
        <button
          onClick={onClose}
          style={{
            background: '#1f2937', border: '1px solid #374151',
            borderRadius: '6px', color: '#f9fafb', cursor: 'pointer',
            width: 36, height: 36, fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >✕</button>
      </div>

      {/* Notice */}
      <div style={{
        padding: '6px 12px',
        background: 'rgba(99,102,241,0.1)',
        borderBottom: '1px solid rgba(99,102,241,0.2)',
        fontSize: '10px', color: '#818cf8', flexShrink: 0,
      }}>
        🔐 Private — you may share contact details here
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '8px 0',
        scrollbarWidth: 'thin', scrollbarColor: '#1f2937 transparent',
      }}>
        {messages.length === 0 && (
          <div style={{
            fontSize: '11px', color: '#4b5563',
            textAlign: 'center', padding: '24px',
          }}>
            No messages yet. Start the private conversation.
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} style={{
            padding: '4px 14px',
            background: m.sender_name === myName ? 'rgba(184,115,51,0.05)' : 'transparent',
            borderLeft: m.sender_name === myName ? '2px solid rgba(184,115,51,0.5)' : '2px solid transparent',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: nameColor(m.sender_name) }}>
                {m.sender_name}
              </span>
              <span style={{ fontSize: '9px', color: '#374151' }}>
                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#d1d5db', lineHeight: 1.5, wordBreak: 'break-word' }}>
              {m.content}
            </div>
          </div>
        ))}
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
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
          }}
          placeholder="Message privately... (email/phone allowed)"
          maxLength={300}
          style={{
            flex: 1, padding: '10px 14px', fontSize: '16px',
            background: '#1f2937', border: '1px solid #374151',
            color: '#f9fafb', borderRadius: '8px', outline: 'none',
            WebkitAppearance: 'none',
          }}
          onFocus={e => e.target.style.borderColor = '#6366f1'}
          onBlur={e => e.target.style.borderColor = '#374151'}
        />
        <button
          onClick={send}
          disabled={!input.trim()}
          style={{
            width: 40, height: 40, borderRadius: '8px',
            background: input.trim() ? '#6366f1' : '#1f2937',
            border: 'none', color: 'white', cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', flexShrink: 0,
            transition: 'background 0.15s',
          }}
        >↗</button>
      </div>
    </div>
  )
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
const [agentTyping, setAgentTyping] = useState(false)
const [privateTarget, setPrivateTarget] = useState(null)
const [privateMessages, setPrivateMessages] = useState([])
const [privateInput, setPrivateInput] = useState('')
const [dmNotifications, setDmNotifications] = useState([])  // ← ADD
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
    // Clear current cache key so new hour fetches fresh
    const currentKey = getTodayKey()
    localStorage.removeItem(currentKey)
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

 // ── DM notification listener ──
  useEffect(() => {
    if (!myName) return
    const channel = supabase
      .channel('dm-notify-' + myName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'private_messages',
      }, (payload) => {
        const msg = payload.new
        if (
          msg.sender_name !== myName &&
          msg.room_id.includes(myName.trim()) &&
          (!privateTarget || privateTarget.name !== msg.sender_name)
        ) {
          setDmNotifications(prev => {
            if (prev.find(n => n.sender === msg.sender_name)) {
              return prev.map(n => n.sender === msg.sender_name
                ? { ...n, count: n.count + 1, preview: msg.content }
                : n
              )
            }
            return [...prev, { sender: msg.sender_name, count: 1, preview: msg.content }]
          })
        }
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [myName, privateTarget])

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

  // ── Block email and phone in group chat ──
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  const phoneRegex = /(\+?\d[\d\s\-().]{7,}\d)/
  if (emailRegex.test(text) || phoneRegex.test(text)) {
    setError('📵 Emails & phone numbers not allowed in group chat. Use private chat instead.')
    return
  }

  setInput('')
    const { error } = await supabase.from('messages').insert({
      user_id: authUser.id,
      user_name: myName,
      content: text,
    })
    if (error) {
      setError('Failed to send: ' + error.message)
      return
    }
    // Trigger AI agent reply after user sends
    triggerAgentReply(text)
  }

 const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e) }
  }

  // ── AI Agent reply ──
 // ── AI Agent reply — keyword matching, no API key needed ──
  const AI_AGENT_NAMES = [
    'Sara Al Hashimi',
    'Khalid Al Mansouri',
    'James Crawford',
    'Marco Ferretti',
  ]

  const AGENT_REPLIES = [
    // ── PRICES ──
    {
      keywords: ['price', 'prices', 'pricing', 'expensive', 'cheap', 'cost', 'aed', 'million', 'psf', 'sqft'],
      replies: [
        { agent: 'James Crawford', msg: 'Prices in core Dubai are still holding firm. Sellers are not discounting right now — multiple offers on anything priced correctly.' },
        { agent: 'Khalid Al Mansouri', msg: 'AED 1,800–2,200 psf in Business Bay ready stock. Off-plan is moving faster and at better entry points if you can wait for handover.' },
        { agent: 'Sara Al Hashimi', msg: 'Compared to 18 months ago, prices are up 20–30% in most areas. The question is whether you are buying for yield or capital gain.' },
        { agent: 'Marco Ferretti', msg: 'I was surprised how fast prices moved here. What budget range are you working with — that changes the options significantly.' },
        { agent: 'James Crawford', msg: 'Dubai Hills and MBR City still offer value relative to Downtown. Prices per sqft are 15–20% lower for similar quality.' },
      ]
    },
    // ── INVESTMENT / ROI / YIELD ──
    {
      keywords: ['invest', 'investment', 'roi', 'yield', 'return', 'rental', 'rent', 'income', 'profit', 'capital gain'],
      replies: [
        { agent: 'Khalid Al Mansouri', msg: 'Net yields in JVC and Sports City are still hitting 7–8%. If you want capital gain, go Downtown or Palm. You cannot have both at peak.' },
        { agent: 'Sara Al Hashimi', msg: 'Tenanted properties are selling fast right now. Buyers want income from day one — furnish it and list it tenanted for a 15% premium.' },
        { agent: 'James Crawford', msg: 'Best ROI entry right now is off-plan in Dubai South or Al Furjan. Lower entry price, strong rental demand when it completes.' },
        { agent: 'Khalid Al Mansouri', msg: 'Short-term rental in Marina or JBR is generating 10–12% gross. You need a holiday home licence — DTCM handles it, process takes 2 weeks.' },
        { agent: 'Marco Ferretti', msg: 'I ran the numbers on three areas. Creek Harbour surprised me — yields are solid and capital appreciation is still early-stage.' },
      ]
    },
    // ── OFF-PLAN ──
    {
      keywords: ['off-plan', 'offplan', 'off plan', 'launch', 'developer', 'handover', 'payment plan', 'emaar', 'damac', 'sobha', 'nakheel', 'meraas'],
      replies: [
        { agent: 'James Crawford', msg: 'Off-plan payment plans from Emaar and Sobha are 60/40 right now. You pay 60% during construction, 40% on handover. Protects your cashflow.' },
        { agent: 'Khalid Al Mansouri', msg: 'Sobha Hartland 2 and Dubai Hills phase 3 are selling out within days of launch. You need to be on the priority list before public launch.' },
        { agent: 'Sara Al Hashimi', msg: 'DAMAC is offering post-handover payment plans on some units — 3 years after keys. That is the one to look at if cashflow is tight.' },
        { agent: 'Marco Ferretti', msg: 'Which developer are you looking at? Some have better build quality track records than others — Emaar and Sobha are the benchmarks here.' },
        { agent: 'Khalid Al Mansouri', msg: 'Off-plan in Dubai South is the play right now. Al Maktoum Airport expansion makes that whole corridor interesting for 3–5 year hold.' },
      ]
    },
    // ── AREAS — DUBAI HILLS ──
    {
      keywords: ['dubai hills', 'hills estate', 'hills'],
      replies: [
        { agent: 'James Crawford', msg: 'Dubai Hills is fully established now. Villas have appreciated 45% since 2021. Apartments around the golf course are the value play remaining.' },
        { agent: 'Sara Al Hashimi', msg: 'Sold a 3BR villa in Dubai Hills last month — 14 viewings in 4 days, went above asking. That market has very strong demand.' },
        { agent: 'Khalid Al Mansouri', msg: 'Dubai Hills Mall has changed the dynamic completely. Foot traffic drives rental demand — 1BR apartments near the mall are yielding 6.5% net.' },
      ]
    },
    // ── AREAS — BUSINESS BAY ──
    {
      keywords: ['business bay', 'bay'],
      replies: [
        { agent: 'James Crawford', msg: 'Business Bay is the most liquid market in Dubai right now. High transaction volume, lots of ready buyers and sellers.' },
        { agent: 'Khalid Al Mansouri', msg: 'Canal-facing units in Business Bay command a 20% premium. Non-canal is better value but slower to appreciate.' },
        { agent: 'Sara Al Hashimi', msg: 'My Business Bay studio is generating AED 75k per year short-term. Running costs are around AED 15k including management — net is strong.' },
      ]
    },
    // ── AREAS — JVC ──
    {
      keywords: ['jvc', 'jumeirah village circle', 'jumeirah village'],
      replies: [
        { agent: 'Sara Al Hashimi', msg: 'JVC is the highest transaction volume area in Dubai. Studios and 1BRs move in days if priced right — AED 550–750k range.' },
        { agent: 'James Crawford', msg: 'JVC yields are holding at 7–8% net. The infrastructure has improved massively — Circle Mall changed the whole feel of the community.' },
        { agent: 'Khalid Al Mansouri', msg: 'Entry point in JVC is still accessible. For long-term hold it is solid — not glamorous but the numbers work better than most premium areas.' },
      ]
    },
    // ── AREAS — PALM ──
    {
      keywords: ['palm', 'palm jumeirah', 'palm jebel ali', 'atlantis', 'frond'],
      replies: [
        { agent: 'Khalid Al Mansouri', msg: 'Palm Jebel Ali is where early movers are going. Plots have moved 20%+ since launch. Palm Jumeirah is fully priced — Jebel Ali is the opportunity.' },
        { agent: 'James Crawford', msg: 'Palm Jumeirah villas are AED 15–35M range now. The rental yields are only 3–4% net but the capital preservation is exceptional.' },
        { agent: 'Sara Al Hashimi', msg: 'The new monorail extension on Palm Jumeirah is driving another wave of interest. Connectivity was the one gap — that is closing.' },
      ]
    },
    // ── AREAS — DOWNTOWN ──
    {
      keywords: ['downtown', 'burj khalifa', 'burj', 'opera', 'address'],
      replies: [
        { agent: 'James Crawford', msg: 'Downtown Dubai is a trophy asset — prices reflect that. AED 2,800–4,500 psf depending on floor and view. Yield is 3.5–4.5% net.' },
        { agent: 'Khalid Al Mansouri', msg: 'Downtown is for capital preservation, not yield. If you want income, go JVC or Business Bay. Downtown is a store of value play.' },
        { agent: 'Marco Ferretti', msg: 'I looked at Downtown seriously — the Burj view premium is real but so is the price. Hard to justify on yield alone.' },
      ]
    },
    // ── AREAS — MARINA ──
    {
      keywords: ['marina', 'dubai marina', 'jbr', 'jumeirah beach', 'bluewaters'],
      replies: [
        { agent: 'Sara Al Hashimi', msg: 'Marina is still one of the strongest short-term rental markets. Tourists want the address — you can hit 85% occupancy in peak season.' },
        { agent: 'James Crawford', msg: 'Marina prices per sqft are AED 1,600–2,200 for ready stock. Older buildings offer better value — focus on floors 20+ for views.' },
        { agent: 'Khalid Al Mansouri', msg: 'Bluewaters and JBR have completely reset Marina pricing expectations. The entire waterfront corridor is repricing upward.' },
      ]
    },
    // ── MORTGAGE / FINANCE ──
    {
      keywords: ['mortgage', 'finance', 'loan', 'bank', 'interest rate', 'ltv', 'down payment'],
      replies: [
        { agent: 'Marco Ferretti', msg: 'UAE mortgage rates are running 4.5–5.2% fixed for expats right now. ADCB and Emirates NBD have the most competitive packages I have seen.' },
        { agent: 'James Crawford', msg: 'Non-residents can get 50% LTV — so AED 2M property needs AED 1M down. Residents get 80% LTV which changes the entry point significantly.' },
        { agent: 'Khalid Al Mansouri', msg: 'I always buy cash for off-plan — no mortgage available anyway until handover. For ready stock, mortgage makes sense if your yield covers the rate.' },
        { agent: 'Sara Al Hashimi', msg: 'Pre-approval takes 3–5 days with most UAE banks. Get it before you make an offer — sellers take you more seriously with a pre-approval letter.' },
      ]
    },
    // ── BUYING PROCESS ──
    {
      keywords: ['buy', 'buying', 'purchase', 'how to buy', 'process', 'steps', 'mou', 'noc', 'dld', 'transfer', 'agent'],
      replies: [
        { agent: 'James Crawford', msg: 'Process is: agree price → sign MOU → pay 10% deposit → NOC from developer → DLD transfer. Usually 30 days from MOU to transfer.' },
        { agent: 'Sara Al Hashimi', msg: 'DLD transfer fee is 4% of purchase price — budget for that on top. Plus AED 4,000–5,000 in admin fees. Factor it into your total cost.' },
        { agent: 'Marco Ferretti', msg: 'I used a RERA-registered agent and it made a big difference. They know which buildings have service charge issues or structural problems to avoid.' },
        { agent: 'James Crawford', msg: 'Always get a snagging inspection before transfer on any ready property. AED 1,500–2,000 for the service — saves you much more in surprises.' },
      ]
    },
    // ── SELLING ──
    {
      keywords: ['sell', 'selling', 'list', 'listing', 'asking price', 'valuation', 'market value'],
      replies: [
        { agent: 'Sara Al Hashimi', msg: 'Properties priced within 5% of market value are selling in under 3 weeks right now. Overprice by 10% and it sits for months.' },
        { agent: 'James Crawford', msg: 'Get a RERA valuation report before listing — gives you a defensible number when buyers negotiate. Costs AED 2,500 but worth it.' },
        { agent: 'Khalid Al Mansouri', msg: 'Best time to list is September–November and February–April. Summer is slow — if you can wait, Q4 inventory is lower and buyers are more serious.' },
        { agent: 'Sara Al Hashimi', msg: 'Stage the apartment before photos. I spent AED 8,000 on styling and furniture rental — sold AED 85,000 above what an unstyled unit went for in the same building.' },
      ]
    },
    // ── MARKET CONDITIONS ──
    {
      keywords: ['market', 'bubble', 'crash', 'correction', 'slow', 'boom', 'growth', 'forecast', 'trend', '2025', '2026'],
      replies: [
        { agent: 'Khalid Al Mansouri', msg: 'Dubai is not in a bubble. Population growth is 100k+ per year and supply cannot keep up. Fundamentals are different from 2008.' },
        { agent: 'James Crawford', msg: 'Transaction volumes are at record highs — 14,000+ deals per month in 2024. This is not speculative flipping, it is genuine end-user demand.' },
        { agent: 'Marco Ferretti', msg: 'I was sceptical before I moved here. The demand is real — I know 40 colleagues who relocated to Dubai in the past two years alone.' },
        { agent: 'Sara Al Hashimi', msg: 'Areas that still have upside: Dubai South, Al Furjan, Meydan. Core areas are fully priced. The growth story has moved to the second ring.' },
      ]
    },
    // ── VISA / GOLDEN VISA ──
    {
      keywords: ['visa', 'golden visa', 'residency', 'resident', 'citizenship'],
      replies: [
        { agent: 'Marco Ferretti', msg: 'AED 2M property qualifies for a 10-year golden visa — that was the trigger for my purchase. The residency stability changes the calculus completely.' },
        { agent: 'James Crawford', msg: 'Golden visa through property: AED 2M minimum, must be ready (not off-plan), and fully paid — no mortgage balance. DLD processes it in 2–3 weeks.' },
        { agent: 'Khalid Al Mansouri', msg: 'The golden visa has driven a whole segment of demand — buyers specifically targeting AED 2M+ ready stock just for the visa. It has a floor effect on that price point.' },
      ]
    },
    // ── PROPERTY TYPES ──
    {
      keywords: ['studio', 'bedroom', '1br', '2br', '3br', 'villa', 'apartment', 'flat', 'penthouse', 'townhouse', 'duplex', 'unit', 'floor', 'view', 'furnished', 'unfurnished'],
      replies: [
        { agent: 'James Crawford', msg: '1BR in Business Bay or JVC is the sweet spot for yield right now. AED 750k–1.1M range, tenants are easy to find, liquidity is high.' },
        { agent: 'Sara Al Hashimi', msg: 'Furnished units command 20–25% premium on rent vs unfurnished in the same building. The fit-out cost is AED 30–50k and you earn it back in year one.' },
        { agent: 'Khalid Al Mansouri', msg: 'Studios are the highest-yield asset class in Dubai but hardest to resell. 1BR is the balance — easier exit, slightly lower yield, much bigger buyer pool.' },
        { agent: 'Marco Ferretti', msg: 'Villas in Dubai Hills and Arabian Ranches have waiting lists of buyers. If one comes to market priced correctly it is gone in 48 hours.' },
        { agent: 'James Crawford', msg: 'High floor with Burj or sea view adds 15–25% to value and makes the unit significantly easier to resell. Always worth paying the premium on entry.' },
      ]
    },
    // ── SERVICE CHARGE / FEES ──
    {
      keywords: ['service charge', 'maintenance', 'chiller', 'dewa', 'fees', 'charges', 'cost of ownership', 'running cost'],
      replies: [
        { agent: 'Sara Al Hashimi', msg: 'Always check the service charge before buying. Some buildings in JLT and Downtown charge AED 25–35 psf — that is AED 25k/year on a 1,000 sqft unit.' },
        { agent: 'James Crawford', msg: 'Chiller-free buildings are significantly more attractive to tenants and buyers. Worth paying a small premium on entry — lower running costs win long term.' },
        { agent: 'Khalid Al Mansouri', msg: 'DEWA costs in Dubai average AED 500–800/month for a 1BR. Factor that into your tenant affordability calculation when setting rent.' },
        { agent: 'Marco Ferretti', msg: 'I nearly bought a unit before I checked the service charge arrears on the building. AED 2.3M in unpaid charges. Always pull the RERA service charge index first.' },
      ]
    },
    // ── SHORT TERM RENTAL / AIRBNB ──
    {
      keywords: ['airbnb', 'short term', 'holiday home', 'dtcm', 'vacation rental', 'short-term', 'nightly'],
      replies: [
        { agent: 'Sara Al Hashimi', msg: 'Holiday home licence from DTCM costs AED 1,520 per year. You need it before listing on Airbnb — inspections happen and fines are AED 10k+.' },
        { agent: 'Khalid Al Mansouri', msg: 'Marina, JBR, Palm, and Downtown are the top short-term rental areas. Occupancy above 80% in peak season (Oct–Apr). Summer drops to 50–60%.' },
        { agent: 'James Crawford', msg: 'Short-term management companies charge 20–25% of revenue. Factor that in — net yield after fees and DEWA is usually 8–10% on a well-located unit.' },
        { agent: 'Marco Ferretti', msg: 'I use a management company for my Marina unit. Gross AED 120k last year, net after all fees AED 87k. Hands-off investment — worth every dirham.' },
      ]
    },
    // ── CREEK HARBOUR / NEW AREAS ──
    {
      keywords: ['creek harbour', 'creek', 'meydan', 'dubai south', 'al furjan', 'motor city', 'sports city', 'arjan', 'mbr', 'mohammad bin rashid'],
      replies: [
        { agent: 'Khalid Al Mansouri', msg: 'Creek Harbour is my top pick for 3–5 year hold. Still 30% below Downtown pricing with the same Emaar quality. The creek tower will change everything when it completes.' },
        { agent: 'James Crawford', msg: 'Dubai South is the long-term infrastructure play. Al Maktoum Airport will be the world\'s largest when done. Property prices there now look cheap in that context.' },
        { agent: 'Sara Al Hashimi', msg: 'Meydan is underrated. Racecourse views, Sobha quality, and prices per sqft that are 25% below comparable Downtown units. Getting attention from smart money.' },
        { agent: 'Marco Ferretti', msg: 'Al Furjan surprised me — community feel, good schools, metro access. Families are moving there and that stabilises rental demand significantly.' },
      ]
    },
    // ── GREETING / GENERAL ──
   
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'salam', 'anyone', 'thoughts', 'opinion', 'advice', 'help', 'suggest'],
      replies: [
        { agent: 'James Crawford', msg: 'Morning — active day in the market. Two viewings already and it is not even 10am. What are you looking at?' },
        { agent: 'Sara Al Hashimi', msg: 'Hey — what is your situation? Buying, selling, or just watching the market right now?' },
        { agent: 'Khalid Al Mansouri', msg: 'Good to see new people in here. Dubai RE moves fast — what area or asset class are you focused on?' },
        { agent: 'Marco Ferretti', msg: 'Just closed on something last week after 3 months of searching. Happy to share what I learned — what is your budget range?' },
      ]
    },
  ]

  const getSmartReply = (userMessage) => {
    const msg = userMessage.toLowerCase()

    // Find all matching topic groups
    const matches = AGENT_REPLIES.filter(group =>
      group.keywords.some(kw => msg.includes(kw))
    )

    if (matches.length === 0) {
      const generic = [
        { agent: 'James Crawford', msg: 'Dubai transactions are up 30% year-on-year. Whatever you are considering, the window to enter at current prices is narrowing fast.' },
        { agent: 'Khalid Al Mansouri', msg: 'Rule I follow: buy within 10 mins of a metro station, sea, or major mall. Everything else in Dubai is secondary to those three anchors.' },
        { agent: 'Sara Al Hashimi', msg: 'Service charges are the hidden cost people forget. Budget AED 12–18 per sqft per year depending on the building. That eats into yield significantly.' },
        { agent: 'Marco Ferretti', msg: 'Three things I wish I knew before buying in Dubai: check the service charge history, check if the building has a pool and gym (resale value), and always verify DLD registration.' },
        { agent: 'James Crawford', msg: 'Handover delays are real — add 6 months to whatever the developer promises on off-plan. Factor that into your cashflow planning.' },
        { agent: 'Khalid Al Mansouri', msg: 'Foreign ownership is 100% freehold in designated zones — Downtown, Marina, Palm, JVC, Business Bay, Dubai Hills. Outside those zones you need a local partner.' },
        { agent: 'Sara Al Hashimi', msg: 'RERA regulates everything here. If your agent is not RERA-registered, walk away. Check their license number on the Dubai REST app.' },
        { agent: 'Marco Ferretti', msg: 'I track DLD transaction data every week. Volume and price per sqft by area — that tells you more than any agent will.' },
        { agent: 'James Crawford', msg: 'Resale value in Dubai is heavily driven by view and floor. Same unit, different floor — 15% price difference. Always go as high as budget allows.' },
        { agent: 'Khalid Al Mansouri', msg: 'Property management fee in Dubai runs 5–8% of annual rent. Factor that into your net yield calculation before committing.' },
      ]
      return generic[Math.floor(Math.random() * generic.length)]
    }
    // Pick the most specific match (most keyword hits) for best accuracy
    const scored = matches.map(group => ({
      group,
      score: group.keywords.filter(kw => msg.includes(kw)).length
    }))
    scored.sort((a, b) => b.score - a.score)
    const bestMatch = scored[0].group
    return bestMatch.replies[Math.floor(Math.random() * bestMatch.replies.length)]
  }

  const triggerAgentReply = async (userMessage) => {
    // 55% chance agent replies
    if (Math.random() > 0.55) return

    // Get smart keyword-matched reply
    const reply = getSmartReply(userMessage)

    // Skip if agent name matches the sender
    if (reply.agent === myName) {
      const others = AI_AGENT_NAMES.filter(n => n !== myName)
      reply.agent = others[Math.floor(Math.random() * others.length)]
    }

    // Wait 2-6 seconds to feel natural
    const delay = 2000 + Math.random() * 4000
    setAgentTyping(true)
    await new Promise(r => setTimeout(r, delay))
    setAgentTyping(false)

    // Save to Supabase so all users see it
    const { error: insertError } = await supabase.from('messages').insert({
      user_id: authUser?.id || null,
      user_name: reply.agent,
      content: reply.msg,
    })

    // If Supabase insert fails, show locally anyway
    if (insertError) {
      console.error('Agent insert failed:', insertError)
      setMessages(prev => [...prev, {
        id: `agent-local-${Date.now()}`,
        user_name: reply.agent,
        content: reply.msg,
        created_at: new Date().toISOString(),
      }])
    }
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
  position: 'relative',   // ← ADD THIS
}}>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>

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
                  <span
 onClick={() => {
    if (msg.user_name !== myName) {
      setPrivateTarget({ name: msg.user_name, userId: msg.user_id })
      setDmNotifications(prev => prev.filter(n => n.sender !== msg.user_name))
    }
  }}
  style={{
    fontSize: '13px', fontWeight: 700, color,
    cursor: msg.user_name !== myName ? 'pointer' : 'default',
    textDecoration: msg.user_name !== myName ? 'underline dotted' : 'none',
  }}
  title={msg.user_name !== myName ? `Private chat with ${msg.user_name}` : ''}
>
  {msg.user_name}
</span>
                  <span style={{ fontSize: '9px', color: '#374151' }}>{formatTime(msg.created_at)}</span>
                </div>
              )}
              <div style={{ fontSize: '13px', color: '#d1d5db', lineHeight: 1.5, wordBreak: 'break-word' }}>
                {msg.content}
              </div>
            </div>
          )
        })}
        {/* Agent typing indicator */}
        {agentTyping && (
          <div style={{
            padding: '6px 14px',
            fontSize: '11px',
            color: '#6b7280',
            fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span style={{
              display: 'inline-flex', gap: '3px', alignItems: 'center',
            }}>
              <span style={{ animation: 'bounce 1s infinite', animationDelay: '0ms', width: 5, height: 5, borderRadius: '50%', background: '#6b7280', display: 'inline-block' }} />
              <span style={{ animation: 'bounce 1s infinite', animationDelay: '150ms', width: 5, height: 5, borderRadius: '50%', background: '#6b7280', display: 'inline-block' }} />
              <span style={{ animation: 'bounce 1s infinite', animationDelay: '300ms', width: 5, height: 5, borderRadius: '50%', background: '#6b7280', display: 'inline-block' }} />
            </span>
            Someone is typing...
          </div>
        )}
        {/* DM Notifications */}
        {dmNotifications.map((n) => (
          <div
            key={n.sender}
            onClick={() => {
              setPrivateTarget({ name: n.sender })
              setDmNotifications(prev => prev.filter(x => x.sender !== n.sender))
            }}
            style={{
              margin: '6px 14px',
              padding: '8px 12px',
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.4)',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '14px' }}>💬</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#818cf8' }}>
                New DM from {n.sender} ({n.count})
              </div>
              <div style={{
                fontSize: '11px', color: '#9ca3af',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {n.preview}
              </div>
            </div>
            <span style={{ fontSize: '10px', color: '#6366f1', fontWeight: 700 }}>Open →</span>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Free plan — read-only banner */}
      {authUser && !canChat && (
        <div style={{
          padding: '10px 12px',
          background: '#0d1117',
          borderTop: '1px solid #1f2937',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '6px',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '10px', color: 'white', flexShrink: 1, minWidth: 0 }}>
            🔒 <strong>Read-only.</strong> Upgrade to ACQAR Pro to chat.
          </span>
        <a 
  href="https://www.acqar.com/pricing"
  target="_top"
  rel="noopener noreferrer"
 style={{
    fontSize: '11px', fontWeight: 700,
    background: '#B87333', color: 'white',
    padding: '5px 10px', borderRadius: '6px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  }}
>CLAIM YOUR SPOT → </a>
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

      {/* Private Chat Overlay */}
      {privateTarget && (
        <PrivateChatOverlay
          myName={myName}
          authUser={authUser}
          target={privateTarget}
          onClose={() => setPrivateTarget(null)}
        />
      )}
    </div>
  )
}
