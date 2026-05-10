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
//   const now = new Date()
//   const slot = Math.floor(now.getMinutes() / 30)
//   const key = `${now.toISOString().slice(0, 13)}_${slot}`
//   return `acqar_chat_v4_${key}`
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
// async function buildMessagesFromEvents(events) {
//   const top = events.slice(0, 5)
//   const now = Date.now()
//   const total = top.length
//   const chat = []

//   const PERSONAS = [
//     { name: 'Sara Al Hashimi',    role: 'property owner in Dubai with units in JVC and Business Bay' },
//     { name: 'Khalid Al Mansouri', role: 'Dubai real estate investor focused on off-plan and ROI' },
//     { name: 'James Crawford',     role: 'RERA-registered Dubai broker with 10 years experience' },
//     { name: 'Marco Ferretti',     role: 'Italian expat who recently bought in Creek Harbour' },
//   ]

//   const groqKey = import.meta.env.VITE_GROQ_KEY
//   if (!groqKey) return []

//   for (let i = 0; i < top.length; i++) {
//     const event = top[i]
//     try {
//       const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${groqKey}`,
//         },
//         body: JSON.stringify({
//           model: 'llama-3.1-8b-instant',
//           max_tokens: 250,
//           messages: [
//             {
//               role: 'system',
//               content: `You are simulating a Dubai real estate group chat. Generate a realistic conversation between these 4 people reacting to a news headline:
// - Sara Al Hashimi (property owner, JVC and Business Bay units)
// - Khalid Al Mansouri (investor, off-plan focus)
// - James Crawford (RERA broker, 10 years experience)
// - Marco Ferretti (Italian expat, recent buyer)

// Rules:
// - Generate exactly 4 messages, one from each person
// - Each message is 1-2 sentences max
// - React directly to the headline
// - Use specific AED prices, area names, yield numbers
// - Sound like real people texting casually
// - Format as JSON array: [{"name":"...","msg":"..."},...]
// - Return ONLY the JSON array, nothing else`
//             },
//             {
//               role: 'user',
//               content: `Headline: "${event.title}" ${event.location_name ? `Location: ${event.location_name}` : ''}`
//             }
//           ],
//         }),
//       })

//       const data = await response.json()
//       const text = data?.choices?.[0]?.message?.content?.trim()
//       if (!text) continue

//       const thread = JSON.parse(text)
//       if (!Array.isArray(thread)) continue

//       thread.forEach((msg, j) => {
//         const threadOffset = i * 5 * 60000
//         const msgOffset = j * 2 * 60000
//         const baseTime = now - (total * 5 * 60000)
//         chat.push({
//           id: `ev_${i}_${j}`,
//           user_name: msg.name,
//           content: msg.msg,
//           created_at: new Date(baseTime + threadOffset + msgOffset).toISOString()
//         })
//       })

//     } catch (err) {
//       console.warn('Groq thread generation failed for event:', event.title, err.message)
//     }
//   }

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

//     const weekAgo = Math.floor(Date.now() / 1000) - (1 * 86400)
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

//     const shaped = await buildMessagesFromEvents(events)
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

//      const shaped = await buildMessagesFromEvents(events)
//     localStorage.setItem(TODAY_KEY, JSON.stringify(shaped))
//     return shaped

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
//       position: 'absolute', inset: 0, background: 'var(--bg-primary)',
//       zIndex: 99999, display: 'flex', flexDirection: 'column',
//       fontFamily: "'Inter', sans-serif",
//     }}>
//       {/* Header */}
//       <div style={{
//         display: 'flex', alignItems: 'center', gap: '8px',
//         padding: '0 12px', height: 44, background: 'var(--bg-secondary)',
// borderBottom: '1px solid var(--border-color)', flexShrink: 0,
//       }}>
//        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>PRIVATE CHAT (DM)</span>
//         <span style={{ fontSize: '12px', color: nameColor(target.name), fontWeight: 700 }}>
//           {target.name}
//         </span>
//         <div style={{ flex: 1 }} />
//         <button
//           onClick={onClose}
//           style={{
//             background: 'var(--bg-input)', border: '1px solid var(--border-panel)',
// borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer',
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
//   fontSize: '11px', color: 'var(--text-muted)',
//   textAlign: 'center', padding: '24px',
// }}>
//             No messages yet. Start the private conversation.
//           </div>
//         )}
//         {messages.map(m => (
//           <div key={m.id} style={{
//             padding: '4px 14px',
//             background: m.sender_name === myName ? 'var(--own-message-bg)' : 'transparent',
//             borderLeft: m.sender_name === myName ? '2px solid rgba(184,115,51,0.5)' : '2px solid transparent',
//           }}>
//             <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1px' }}>
//               <span style={{ fontSize: '11px', fontWeight: 700, color: nameColor(m.sender_name) }}>
//                 {m.sender_name}
//               </span>
//              <span style={{ fontSize: '9px', color: 'var(--text-timestamp)' }}>
//                 {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </span>
//             </div>
//             <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, wordBreak: 'break-word' }}>
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
//         borderTop: '1px solid var(--border-color)',
// background: 'var(--bg-secondary)', flexShrink: 0,
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
//          style={{
//   flex: 1, padding: '10px 14px', fontSize: '16px',
//   background: 'var(--bg-input)',
//   border: '1px solid var(--border-panel)',
//   color: 'var(--text-primary)',
//   borderRadius: '8px', outline: 'none',
//   transition: 'border-color 0.15s',
//   WebkitAppearance: 'none',
//   cursor: 'text',
//   placeholderColor: 'var(--text-muted)',
// }}
//           onFocus={e => e.target.style.borderColor = '#6366f1'}
//          onBlur={e => e.target.style.borderColor = 'var(--border-panel)'}
//         />
//        <button
//   onClick={send}
//   disabled={!input.trim()}
//   style={{
//     width: 40, height: 40, borderRadius: '8px',
//     background: input.trim() ? '#6366f1' : 'var(--border-panel)',
//     border: 'none', color: 'var(--text-muted)', cursor: input.trim() ? 'pointer' : 'default',
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
// const [privateInput, setPrivateInput] = useState('')          
// const [dmNotifications, setDmNotifications] = useState([])
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


//   // ── DM notification listener ──
// useEffect(() => {
//   const channel = supabase
//     .channel('dm-notify-' + Math.random())
//     .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'private_messages' }, (payload) => {
//       const msg = payload.new
//       if (msg.sender_name === myName) return
//       if (privateTarget && [myName, privateTarget.name].sort().join('__') === msg.room_id) return
//       setDmNotifications(prev => [...prev, msg])
//     })
//     .subscribe()
//   return () => supabase.removeChannel(channel)
// }, [myName, privateTarget])


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
//       keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'salam', 'anyone', 'thoughts', 'opinion', 'advice', 'help', 'suggest', 'collab', 'collaborate', 'partner', 'interested', 'who wants', 'anyone interested'],
//       replies: [
//         { agent: 'James Crawford', msg: 'Morning — active day in the market. Two viewings already and it is not even 10am. What are you looking at?' },
//         { agent: 'Sara Al Hashimi', msg: 'Hey — what is your situation? Buying, selling, or just watching the market right now?' },
//         { agent: 'Khalid Al Mansouri', msg: 'Good to see new people in here. Dubai RE moves fast — what area or asset class are you focused on?' },
//         { agent: 'Marco Ferretti', msg: 'Just closed on something last week after 3 months of searching. Happy to share what I learned — what is your budget range?' },
//         { agent: 'Khalid Al Mansouri', msg: 'Interested — what is the asking price per unit and are they currently tenanted? Bulk deal in JVC at the right price is worth a serious look.' },
// { agent: 'James Crawford', msg: 'I have buyers for bulk JVC deals — DM me the details. What floor range and what is the total asking price for the block?' },
// { agent: 'Tariq Al Mahmoud', msg: 'We look at bulk purchases regularly — 20 units is a serious conversation. Send me the numbers privately.' },
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

//  const CLAUDE_PERSONAS = [
//     { name: 'Sara Al Hashimi',    role: 'property owner and seller in Dubai, owns 2 units in JVC and 1 in Business Bay, knowledgeable about yields and tenancy' },
//     { name: 'Khalid Al Mansouri', role: 'Dubai real estate investor, focuses on off-plan deals, high ROI areas, and long-term capital appreciation' },
//     { name: 'James Crawford',     role: 'RERA-registered Dubai broker with 10 years experience, knows transaction process, DLD fees, and market liquidity' },
//     { name: 'Marco Ferretti',     role: 'Italian expat who bought a 1BR in Creek Harbour 8 months ago, shares honest buyer perspective and lessons learned' },
//     { name: 'Aisha Al Farsi',     role: 'UAE national property investor focused on freehold zones and golden visa eligible properties above AED 2M' },
//     { name: 'David Park',         role: 'Korean expat and first-time buyer searching for a 1BR in Dubai Hills or MBR City, budget AED 1.4M' },
//     { name: 'Priya Nair',         role: 'Indian investor who owns 3 short-term rental units in Dubai Marina, expert on Airbnb yields and DTCM licensing' },
//     { name: 'Omar Al Suwaidi',    role: 'Dubai-based developer rep who works with Emaar and Sobha launches and off-plan payment plans' },
//     { name: 'Natasha Voronova',   role: 'Russian buyer who purchased a villa in Dubai Hills, focused on capital preservation and residency visas' },
//     { name: 'Ahmed Bin Rashid',   role: 'Emirati property owner with multiple units in Downtown and Palm Jumeirah, focused on premium segment insights' },
//     { name: 'Sophie Laurent',     role: 'French expat agent specializing in luxury properties in DIFC and Downtown Dubai' },
//     { name: 'Raj Malhotra',       role: 'Property consultant helping NRI buyers understand mortgage options and DLD process from outside UAE' },
//     { name: 'Lucas Oliveira',     role: 'Brazilian investor who flipped two off-plan units in Business Bay, expert on entry timing and resale' },
//     { name: 'Fatima Al Zaabi',    role: 'UAE national first-time buyer looking at JVC and Al Furjan, comparing off-plan vs ready stock' },
//     { name: 'Michael Turner',     role: 'British retiree who bought a sea-view apartment in JBR and lives there full time' },
//     { name: 'Chen Wei',           role: 'Chinese investor who owns units in Creek Harbour and Dubai South, bullish on Al Maktoum Airport corridor' },
//     { name: 'Isabella Rossi',     role: 'European buyer who closed on a 2BR in Sobha Hartland, shares experience with developer payment plans' },
//     { name: 'Hassan Al Qassimi',  role: 'Dubai property lawyer advising on NOC, MOU, DLD transfers, and title deed issues' },
//     { name: 'Mia Johansson',      role: 'Swedish expat managing 5 furnished 1BRs across JVC and Business Bay for passive income' },
//     { name: 'Tariq Al Mahmoud',   role: 'Gulf-based family office allocator focused on bulk purchases and commercial property in Dubai' },
//   ]

//   const triggerAgentReply = async (userMessage) => {
//     // 90% chance agent replies
//   if (Math.random() > 0.15) return

//     // Pick random persona that is not the current user
//     const available = CLAUDE_PERSONAS.filter(p => p.name !== myName)
//     const persona = available[Math.floor(Math.random() * available.length)]

//     // Typing delay 2-5 seconds
//     const delay = 2000 + Math.random() * 3000
//     setAgentTyping(true)
//     await new Promise(r => setTimeout(r, delay))
//     setAgentTyping(false)

//     try {
//      const groqKey = import.meta.env.VITE_GROQ_KEY
// if (!groqKey) throw new Error('VITE_GROQ_KEY missing')
//       const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${groqKey}`,
//         },
//         body: JSON.stringify({
//          model: 'llama-3.3-70b-versatile',
//           max_tokens: 400,
//           messages: [
//             {
//               role: 'system',
//               content: `You are ${persona.name}, a ${persona.role}. You are in a Dubai real estate group chat. Current year is 2026.

// Someone just said: "${userMessage}"

// IMPORTANT — Read the ENTIRE message carefully before replying.
// If the message has multiple parts or questions, address ALL of them.

// Rules:
// - Read the full message and understand EVERYTHING the person is asking
// - Count how many questions the user asked and make sure you answer every single one before finishing your reply
// - NEVER invent numbers or facts not mentioned by the user
// - Use ONLY the exact prices and numbers the user gave you
// - Be accurate about UAE RERA laws and Dubai real estate
// - If they ask about a deal or collab show genuine interest with specific questions
// - If they ask about buying give specific area and price advice
// - Write enough sentences to fully answer ALL questions asked (up to 6 sentences)
// - Sound like a real person texting casually
// - No bullet points
// - Never say you are an AI
// - Current year is 2026`
//             },
//             {
//               role: 'user',
//               content: userMessage
//             }
//           ],
//         }),
//       })

//       const data = await response.json()
//       const replyText = data?.choices?.[0]?.message?.content?.trim()
//       if (!replyText) throw new Error('empty response')

//       console.log('Inserting AI reply:', persona.name, replyText)
//       const { error: insertError } = await supabase.from('messages').insert({
//         user_id: authUser?.id || '00000000-0000-0000-0000-000000000000',
//         user_name: persona.name,
//         content: replyText,
//       })

//       if (insertError) {
//         console.error('Supabase insert failed:', insertError)
//         setMessages(prev => [...prev, {
//           id: `agent-local-${Date.now()}`,
//           user_name: persona.name,
//           content: replyText,
//           created_at: new Date().toISOString(),
//         }])
//       } else {
//         console.log('AI reply saved to Supabase ✅')
//       }
//     } catch (err) {
//       console.warn('Groq agent failed, using fallback:', err.message)
//       const reply = getSmartReply(userMessage)
//       if (reply.agent === myName) {
//         const others = AI_AGENT_NAMES.filter(n => n !== myName)
//         reply.agent = others[Math.floor(Math.random() * others.length)]
//       }
//      const { error: insertError } = await supabase.from('messages').insert({
//         user_id: authUser?.id || '00000000-0000-0000-0000-000000000000',
//         user_name: reply.agent,
//         content: reply.msg,
//       })
//       if (insertError) {
//         setMessages(prev => [...prev, {
//           id: `agent-local-${Date.now()}`,
//           user_name: reply.agent,
//           content: reply.msg,
//           created_at: new Date().toISOString(),
//         }])
//       }
//     }
//   }

//   return (
//     <div style={{
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   background: 'var(--bg-primary)',
//   fontFamily: "'Inter', sans-serif",
//   overflow: 'hidden',
//   pointerEvents: 'auto',
//   position: 'relative',   // ← ADD THIS
// }}>
//      <style>{`
//   @keyframes bounce {
//     0%, 100% { transform: translateY(0); opacity: 0.4; }
//     50% { transform: translateY(-4px); opacity: 1; }
//   }
//   [data-theme="light"] input::placeholder {
//     color: #999999;
//   }
//   [data-theme="light"] .chat-input-field {
//     background: #F0F0F0 !important;
//     border-color: #DEDEDE !important;
//   }
// `}</style>

//       {/* Header */}
//       {onClose && (
//         <div style={{
//           display: 'flex', alignItems: 'center', gap: '7px',
//           padding: '0 12px',
//           background: 'var(--bg-secondary)',
// borderBottom: '1px solid var(--border-color)',
//           flexShrink: 0,
//           height: 44,
//           position: 'sticky',
//           top: 0,
//           zIndex: 9999,
//         }}>
//           <div style={{
//           width: 22, height: 22, borderRadius: '6px', background: 'var(--bg-input)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: '11px', flexShrink: 0,
//           }}>💬</div>

//           <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '1px' }}>CHAT</span>

//          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>as</span>
//           <span style={{
//             fontSize: '10px', fontWeight: 700,
//             color: nameColor(myName),
//             maxWidth: '140px', overflow: 'hidden',
//             textOverflow: 'ellipsis', whiteSpace: 'nowrap',
//           }}>{myName}</span>

//           <div style={{ flex: 1 }} />

//           <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//             <span style={{ fontSize: '13px' }}>🟠</span>
//             <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
//               {msgCount !== null ? msgCount.toLocaleString() : '—'}
//             </span>
//           </div>

//           <button
//             onClick={() => window.location.reload()}
//            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '15px', padding: '4px' }}
//           >↺</button>

//           <button
//             onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); onClose() }}
//             onTouchStart={(e) => { e.stopPropagation(); e.preventDefault(); onClose() }}
//             onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClose() }}
//             style={{
//               width: 36, height: 36, background: 'var(--bg-input)',
// border: '1px solid var(--border-panel)', borderRadius: '6px',
// color: 'var(--text-primary)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               touchAction: 'manipulation',
//               WebkitTapHighlightColor: 'transparent',
//               position: 'relative',
//               zIndex: 999,
//             }}
//           >✕</button>
//         </div>
//       )}

//       {/* DM Notifications */}
//       {dmNotifications.map((notif, i) => (
//         <div key={i} onClick={() => {
//           setPrivateTarget({ name: notif.sender_name })
//           setDmNotifications(prev => prev.filter((_, j) => j !== i))
//         }} style={{
//           padding: '8px 14px',
//           background: 'rgba(99,102,241,0.2)',
//           borderBottom: '1px solid rgba(99,102,241,0.4)',
//           fontSize: '11px', color: '#a5b4fc',
//           cursor: 'pointer', flexShrink: 0,
//           display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//         }}>
//           <span>💬 <strong>{notif.sender_name}</strong> sent you a private message</span>
//           <button onClick={e => { e.stopPropagation(); setDmNotifications(prev => prev.filter((_, j) => j !== i)) }}
//             style={{ background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer', fontSize: '14px' }}>✕</button>
//         </div>
//       ))}

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
//        scrollbarWidth: 'thin', scrollbarColor: 'var(--bg-input) transparent',
//         WebkitOverflowScrolling: 'touch',
//       }}>
//         {loading && (
//          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
//   Loading messages...
//           </div>
//         )}
//         {!loading && messages.length === 0 && (
//           <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
//   No messages yet. Say something!
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
//               background: isOwn ? 'var(--own-message-bg)' : 'transparent',
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
//                   <span style={{ fontSize: '9px', color: 'var(--text-timestamp)' }}>{formatTime(msg.created_at)}</span>
//                 </div>
//               )}
//               <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, wordBreak: 'break-word' }}>
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
//             color: 'var(--text-muted)',
// fontStyle: 'italic',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '6px',
//           }}>
//             <span style={{
//               display: 'inline-flex', gap: '3px', alignItems: 'center',
//             }}>
//               <span style={{ animation: 'bounce 1s infinite', animationDelay: '0ms', width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />
//               <span style={{ animation: 'bounce 1s infinite', animationDelay: '150ms', width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />
//               <span style={{ animation: 'bounce 1s infinite', animationDelay: '300ms', width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />
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
//           background: 'var(--bg-secondary)',
// borderTop: '1px solid var(--border-color)',
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           gap: '6px',
//           flexShrink: 0,
//         }}>
//           <span style={{ fontSize: '10px', color: 'var(--text-primary)', flexShrink: 1, minWidth: 0 }}>
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
//           borderTop: '1px solid var(--border-color)',
// background: 'var(--bg-secondary)', flexShrink: 0,
//           display: 'flex', gap: '8px', alignItems: 'center',
//         }}>
//          <input
//   ref={inputRef}
//   className="chat-input-field"
//   value={input}
//   onChange={e => setInput(e.target.value)}
//   onKeyDown={handleKeyDown}
//             placeholder={authUser ? `Message as ${myName}...` : 'Sign in to chat...'}
//             maxLength={200}
//             style={{
//               flex: 1, padding: '10px 14px', fontSize: '16px',
//               background: 'var(--bg-input)',
// border: '1px solid var(--border-panel)',
// color: 'var(--text-primary)',
//               borderRadius: '8px', outline: 'none',
//               transition: 'border-color 0.15s',
//               WebkitAppearance: 'none',
//               cursor: 'text',
//             }}
//             onFocus={e => e.target.style.borderColor = '#6366f1'}
//             onBlur={e => e.target.style.borderColor = 'var(--border-panel)'}
//           />
//           <button
//             type="button"
//             onClick={sendMessage}
//             disabled={!input.trim()}
//             style={{
//               width: 40, height: 40, borderRadius: '8px',
//              background: input.trim() ? '#6366f1' : 'var(--border-panel)',
// border: 'none', color: 'var(--text-muted)',
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



















// import { useEffect, useRef, useState } from 'react'
// import { supabase } from '../lib/supabase'
// import { generateChatResponse } from '../lib/chatPersonas'

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
//   const now = new Date()
//   const slot = Math.floor(now.getMinutes() / 30)
//   const key = `${now.toISOString().slice(0, 13)}_${slot}`
//   return `acqar_chat_v4_${key}`
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
// async function buildMessagesFromEvents(events) {
//   const top = events.slice(0, 5)
//   const now = Date.now()
//   const total = top.length
//   const chat = []

//   const PERSONAS = [
//     { name: 'Sara Al Hashimi',    role: 'property owner in Dubai with units in JVC and Business Bay' },
//     { name: 'Khalid Al Mansouri', role: 'Dubai real estate investor focused on off-plan and ROI' },
//     { name: 'James Crawford',     role: 'RERA-registered Dubai broker with 10 years experience' },
//     { name: 'Marco Ferretti',     role: 'Italian expat who recently bought in Creek Harbour' },
//   ]

//   const groqKey = import.meta.env.VITE_GROQ_KEY
//   if (!groqKey) return []

//   for (let i = 0; i < top.length; i++) {
//     const event = top[i]
//     try {
//       const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${groqKey}`,
//         },
//         body: JSON.stringify({
//           model: 'llama-3.1-8b-instant',
//           max_tokens: 250,
//           messages: [
//             {
//               role: 'system',
//               content: `You are simulating a Dubai real estate group chat. Generate a realistic conversation between these 4 people reacting to a news headline:
// - Sara Al Hashimi (property owner, JVC and Business Bay units)
// - Khalid Al Mansouri (investor, off-plan focus)
// - James Crawford (RERA broker, 10 years experience)
// - Marco Ferretti (Italian expat, recent buyer)

// Rules:
// - Generate exactly 4 messages, one from each person
// - Each message is 1-2 sentences max
// - React directly to the headline
// - Use specific AED prices, area names, yield numbers
// - Sound like real people texting casually
// - Format as JSON array: [{"name":"...","msg":"..."},...]
// - Return ONLY the JSON array, nothing else`
//             },
//             {
//               role: 'user',
//               content: `Headline: "${event.title}" ${event.location_name ? `Location: ${event.location_name}` : ''}`
//             }
//           ],
//         }),
//       })

//       const data = await response.json()
//       const text = data?.choices?.[0]?.message?.content?.trim()
//       if (!text) continue

//       const thread = JSON.parse(text)
//       if (!Array.isArray(thread)) continue

//       thread.forEach((msg, j) => {
//         const threadOffset = i * 5 * 60000
//         const msgOffset = j * 2 * 60000
//         const baseTime = now - (total * 5 * 60000)
//         chat.push({
//           id: `ev_${i}_${j}`,
//           user_name: msg.name,
//           content: msg.msg,
//           created_at: new Date(baseTime + threadOffset + msgOffset).toISOString()
//         })
//       })

//     } catch (err) {
//       console.warn('Groq thread generation failed for event:', event.title, err.message)
//     }
//   }

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

//     const weekAgo = Math.floor(Date.now() / 1000) - (1 * 86400)
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

//     const shaped = await buildMessagesFromEvents(events)
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

//      const shaped = await buildMessagesFromEvents(events)
//     localStorage.setItem(TODAY_KEY, JSON.stringify(shaped))
//     return shaped

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
//       position: 'absolute', inset: 0, background: 'var(--bg-primary)',
//       zIndex: 99999, display: 'flex', flexDirection: 'column',
//       fontFamily: "'Inter', sans-serif",
//     }}>
//       {/* Header */}
//       <div style={{
//         display: 'flex', alignItems: 'center', gap: '8px',
//         padding: '0 12px', height: 44, background: 'var(--bg-secondary)',
// borderBottom: '1px solid var(--border-color)', flexShrink: 0,
//       }}>
//        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>PRIVATE CHAT (DM)</span>
//         <span style={{ fontSize: '12px', color: nameColor(target.name), fontWeight: 700 }}>
//           {target.name}
//         </span>
//         <div style={{ flex: 1 }} />
//         <button
//           onClick={onClose}
//           style={{
//             background: 'var(--bg-input)', border: '1px solid var(--border-panel)',
// borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer',
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
//   fontSize: '11px', color: 'var(--text-muted)',
//   textAlign: 'center', padding: '24px',
// }}>
//             No messages yet. Start the private conversation.
//           </div>
//         )}
//         {messages.map(m => (
//           <div key={m.id} style={{
//             padding: '4px 14px',
//             background: m.sender_name === myName ? 'var(--own-message-bg)' : 'transparent',
//             borderLeft: m.sender_name === myName ? '2px solid rgba(184,115,51,0.5)' : '2px solid transparent',
//           }}>
//             <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1px' }}>
//               <span style={{ fontSize: '11px', fontWeight: 700, color: nameColor(m.sender_name) }}>
//                 {m.sender_name}
//               </span>
//              <span style={{ fontSize: '9px', color: 'var(--text-timestamp)' }}>
//                 {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </span>
//             </div>
//             <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, wordBreak: 'break-word' }}>
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
//         borderTop: '1px solid var(--border-color)',
// background: 'var(--bg-secondary)', flexShrink: 0,
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
//          style={{
//   flex: 1, padding: '10px 14px', fontSize: '16px',
//   background: 'var(--bg-input)',
//   border: '1px solid var(--border-panel)',
//   color: 'var(--text-primary)',
//   borderRadius: '8px', outline: 'none',
//   transition: 'border-color 0.15s',
//   WebkitAppearance: 'none',
//   cursor: 'text',
//   placeholderColor: 'var(--text-muted)',
// }}
//           onFocus={e => e.target.style.borderColor = '#6366f1'}
//          onBlur={e => e.target.style.borderColor = 'var(--border-panel)'}
//         />
//        <button
//   onClick={send}
//   disabled={!input.trim()}
//   style={{
//     width: 40, height: 40, borderRadius: '8px',
//     background: input.trim() ? '#6366f1' : 'var(--border-panel)',
//     border: 'none', color: 'var(--text-muted)', cursor: input.trim() ? 'pointer' : 'default',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: '16px', flexShrink: 0,
//             transition: 'background 0.15s',
//           }}
//         >↗</button>
//       </div>
//     </div>
//   )
// }

//  const CLAUDE_PERSONAS = [
//   { name: 'Sara Al Hashimi',    role: 'property owner and seller in Dubai, owns 2 units in JVC and 1 in Business Bay' },
//   { name: 'Khalid Al Mansouri', role: 'Dubai real estate investor, focuses on off-plan deals and high ROI areas' },
//   { name: 'James Crawford',     role: 'RERA-registered Dubai broker with 10 years experience' },
//   { name: 'Marco Ferretti',     role: 'Italian expat who bought a 1BR in Creek Harbour 8 months ago' },
//   { name: 'Aisha Al Farsi',     role: 'UAE national property investor focused on freehold zones and golden visa properties' },
//   { name: 'David Park',         role: 'Korean expat and first-time buyer searching for a 1BR in Dubai Hills, budget AED 1.4M' },
//   { name: 'Priya Nair',         role: 'Indian investor who owns 3 short-term rental units in Dubai Marina' },
//   { name: 'Omar Al Suwaidi',    role: 'Dubai-based developer rep who works with Emaar and Sobha launches' },
//   { name: 'Natasha Voronova',   role: 'Russian buyer who purchased a villa in Dubai Hills, focused on capital preservation' },
//   { name: 'Ahmed Bin Rashid',   role: 'Emirati property owner with multiple units in Downtown and Palm Jumeirah' },
//   { name: 'Sophie Laurent',     role: 'French expat agent specializing in luxury properties in DIFC and Downtown Dubai' },
//   { name: 'Raj Malhotra',       role: 'Property consultant helping NRI buyers understand mortgage options and DLD process' },
//   { name: 'Lucas Oliveira',     role: 'Brazilian investor who flipped two off-plan units in Business Bay' },
//   { name: 'Fatima Al Zaabi',    role: 'UAE national first-time buyer looking at JVC and Al Furjan' },
//   { name: 'Michael Turner',     role: 'British retiree who bought a sea-view apartment in JBR and lives there full time' },
//   { name: 'Chen Wei',           role: 'Chinese investor who owns units in Creek Harbour and Dubai South' },
//   { name: 'Isabella Rossi',     role: 'European buyer who closed on a 2BR in Sobha Hartland' },
//   { name: 'Hassan Al Qassimi',  role: 'Dubai property lawyer advising on NOC, MOU, DLD transfers, and title deed issues' },
//   { name: 'Mia Johansson',      role: 'Swedish expat managing 5 furnished 1BRs across JVC and Business Bay' },
//   { name: 'Tariq Al Mahmoud',   role: 'Gulf-based family office allocator focused on bulk purchases and commercial property' },
// ]


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
// const [privateInput, setPrivateInput] = useState('')          
// const [dmNotifications, setDmNotifications] = useState([])
// const [chatHistory, setChatHistory] = useState([])   // ← ADD THIS
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


//   // ── DM notification listener ──
// useEffect(() => {
//   const channel = supabase
//     .channel('dm-notify-' + Math.random())
//     .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'private_messages' }, (payload) => {
//       const msg = payload.new
//       if (msg.sender_name === myName) return
//       if (privateTarget && [myName, privateTarget.name].sort().join('__') === msg.room_id) return
//       setDmNotifications(prev => [...prev, msg])
//     })
//     .subscribe()
//   return () => supabase.removeChannel(channel)
// }, [myName, privateTarget])


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


//  const triggerAgentReply = async (userMessage) => {
//   const available = CLAUDE_PERSONAS.filter(p => p.name !== myName)
//   const persona = available[Math.floor(Math.random() * available.length)]

//   setAgentTyping(true)
//   await new Promise(r => setTimeout(r, 30000)) // 30 second delay
//   setAgentTyping(false)

//   try {
//     const updatedHistory = [
//       ...chatHistory,
//       { role: 'user', content: userMessage }
//     ]

//     const replyText = await generateChatResponse(userMessage, persona, updatedHistory)

//     if (!replyText) return // off-topic — stay silent

//     setChatHistory([
//       ...updatedHistory,
//       { role: 'assistant', content: replyText }
//     ])

//     const { error: insertError } = await supabase.from('messages').insert({
//       user_id: authUser?.id || '00000000-0000-0000-0000-000000000000',
//       user_name: persona.name,
//       content: replyText,
//     })

//     if (insertError) {
//       setMessages(prev => [...prev, {
//         id: `agent-local-${Date.now()}`,
//         user_name: persona.name,
//         content: replyText,
//         created_at: new Date().toISOString(),
//       }])
//     }

//   } catch (err) {
//     console.warn('Agent reply failed silently:', err.message)
//     // no fallback — silent fail
//   }
// }

//   return (
//     <div style={{
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   background: 'var(--bg-primary)',
//   fontFamily: "'Inter', sans-serif",
//   overflow: 'hidden',
//   pointerEvents: 'auto',
//   position: 'relative',   // ← ADD THIS
// }}>
//      <style>{`
//   @keyframes bounce {
//     0%, 100% { transform: translateY(0); opacity: 0.4; }
//     50% { transform: translateY(-4px); opacity: 1; }
//   }
//   [data-theme="light"] input::placeholder {
//     color: #999999;
//   }
//   [data-theme="light"] .chat-input-field {
//     background: #F0F0F0 !important;
//     border-color: #DEDEDE !important;
//   }
// `}</style>

//       {/* Header */}
//       {onClose && (
//         <div style={{
//           display: 'flex', alignItems: 'center', gap: '7px',
//           padding: '0 12px',
//           background: 'var(--bg-secondary)',
// borderBottom: '1px solid var(--border-color)',
//           flexShrink: 0,
//           height: 44,
//           position: 'sticky',
//           top: 0,
//           zIndex: 9999,
//         }}>
//           <div style={{
//           width: 22, height: 22, borderRadius: '6px', background: 'var(--bg-input)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: '11px', flexShrink: 0,
//           }}>💬</div>

//           <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '1px' }}>CHAT</span>

//          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>as</span>
//           <span style={{
//             fontSize: '10px', fontWeight: 700,
//             color: nameColor(myName),
//             maxWidth: '140px', overflow: 'hidden',
//             textOverflow: 'ellipsis', whiteSpace: 'nowrap',
//           }}>{myName}</span>

//           <div style={{ flex: 1 }} />

//           <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//             <span style={{ fontSize: '13px' }}>🟠</span>
//             <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
//               {msgCount !== null ? msgCount.toLocaleString() : '—'}
//             </span>
//           </div>

//           <button
//             onClick={() => window.location.reload()}
//            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '15px', padding: '4px' }}
//           >↺</button>

//           <button
//             onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); onClose() }}
//             onTouchStart={(e) => { e.stopPropagation(); e.preventDefault(); onClose() }}
//             onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClose() }}
//             style={{
//               width: 36, height: 36, background: 'var(--bg-input)',
// border: '1px solid var(--border-panel)', borderRadius: '6px',
// color: 'var(--text-primary)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               touchAction: 'manipulation',
//               WebkitTapHighlightColor: 'transparent',
//               position: 'relative',
//               zIndex: 999,
//             }}
//           >✕</button>
//         </div>
//       )}

//       {/* DM Notifications */}
//       {dmNotifications.map((notif, i) => (
//         <div key={i} onClick={() => {
//           setPrivateTarget({ name: notif.sender_name })
//           setDmNotifications(prev => prev.filter((_, j) => j !== i))
//         }} style={{
//           padding: '8px 14px',
//           background: 'rgba(99,102,241,0.2)',
//           borderBottom: '1px solid rgba(99,102,241,0.4)',
//           fontSize: '11px', color: '#a5b4fc',
//           cursor: 'pointer', flexShrink: 0,
//           display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//         }}>
//           <span>💬 <strong>{notif.sender_name}</strong> sent you a private message</span>
//           <button onClick={e => { e.stopPropagation(); setDmNotifications(prev => prev.filter((_, j) => j !== i)) }}
//             style={{ background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer', fontSize: '14px' }}>✕</button>
//         </div>
//       ))}

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
//        scrollbarWidth: 'thin', scrollbarColor: 'var(--bg-input) transparent',
//         WebkitOverflowScrolling: 'touch',
//       }}>
//         {loading && (
//          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
//   Loading messages...
//           </div>
//         )}
//         {!loading && messages.length === 0 && (
//           <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
//   No messages yet. Say something!
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
//               background: isOwn ? 'var(--own-message-bg)' : 'transparent',
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
//                   <span style={{ fontSize: '9px', color: 'var(--text-timestamp)' }}>{formatTime(msg.created_at)}</span>
//                 </div>
//               )}
//               <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, wordBreak: 'break-word' }}>
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
//             color: 'var(--text-muted)',
// fontStyle: 'italic',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '6px',
//           }}>
//             <span style={{
//               display: 'inline-flex', gap: '3px', alignItems: 'center',
//             }}>
//               <span style={{ animation: 'bounce 1s infinite', animationDelay: '0ms', width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />
//               <span style={{ animation: 'bounce 1s infinite', animationDelay: '150ms', width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />
//               <span style={{ animation: 'bounce 1s infinite', animationDelay: '300ms', width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />
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
//           background: 'var(--bg-secondary)',
// borderTop: '1px solid var(--border-color)',
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           gap: '6px',
//           flexShrink: 0,
//         }}>
//           <span style={{ fontSize: '10px', color: 'var(--text-primary)', flexShrink: 1, minWidth: 0 }}>
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
//           borderTop: '1px solid var(--border-color)',
// background: 'var(--bg-secondary)', flexShrink: 0,
//           display: 'flex', gap: '8px', alignItems: 'center',
//         }}>
//          <input
//   ref={inputRef}
//   className="chat-input-field"
//   value={input}
//   onChange={e => setInput(e.target.value)}
//   onKeyDown={handleKeyDown}
//             placeholder={authUser ? `Message as ${myName}...` : 'Sign in to chat...'}
//             maxLength={200}
//             style={{
//               flex: 1, padding: '10px 14px', fontSize: '16px',
//               background: 'var(--bg-input)',
// border: '1px solid var(--border-panel)',
// color: 'var(--text-primary)',
//               borderRadius: '8px', outline: 'none',
//               transition: 'border-color 0.15s',
//               WebkitAppearance: 'none',
//               cursor: 'text',
//             }}
//             onFocus={e => e.target.style.borderColor = '#6366f1'}
//             onBlur={e => e.target.style.borderColor = 'var(--border-panel)'}
//           />
//           <button
//             type="button"
//             onClick={sendMessage}
//             disabled={!input.trim()}
//             style={{
//               width: 40, height: 40, borderRadius: '8px',
//              background: input.trim() ? '#6366f1' : 'var(--border-panel)',
// border: 'none', color: 'var(--text-muted)',
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















// import { useEffect, useRef, useState } from 'react'
// import { supabase } from '../lib/supabase'
// import { generateChatResponse } from '../lib/chatPersonas'

// const REAL_USERS = [
//   'Anastasia Volkov',
//   'Svetlana Morozova',
//   'Alexei Petrov',
//   'Irina Sokolova',
//   'Hassan Al Farsi',
//   'Yusuf Al Zaabi',
//   'Ayaan Soomro',
//   'Omar Al Hashimi',
//   'Zaryab Memon',
//   'Yelena Ivanova',
// ]

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
//   const now = new Date()
//   const slot = Math.floor(now.getMinutes() / 30)
//   const key = `${now.toISOString().slice(0, 13)}_${slot}`
//   return `acqar_chat_v4_${key}`
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
// async function buildMessagesFromEvents(events) {
//   const top = events.slice(0, 5)
//   const now = Date.now()
//   const total = top.length
//   const chat = []

//   const PERSONAS = [
//     { name: 'Sara Al Hashimi',    role: 'property owner in Dubai with units in JVC and Business Bay' },
//     { name: 'Khalid Al Mansouri', role: 'Dubai real estate investor focused on off-plan and ROI' },
//     { name: 'James Crawford',     role: 'RERA-registered Dubai broker with 10 years experience' },
//     { name: 'Marco Ferretti',     role: 'Italian expat who recently bought in Creek Harbour' },
//   ]

//   const groqKey = import.meta.env.VITE_GROQ_KEY
//   if (!groqKey) return []

//   for (let i = 0; i < top.length; i++) {
//     const event = top[i]
//     try {
//       const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${groqKey}`,
//         },
//         body: JSON.stringify({
//           model: 'llama-3.1-8b-instant',
//           max_tokens: 250,
//           messages: [
//             {
//               role: 'system',
//               content: `You are simulating a Dubai real estate group chat. Generate a realistic conversation between these 4 people reacting to a news headline:
// - Sara Al Hashimi (property owner, JVC and Business Bay units)
// - Khalid Al Mansouri (investor, off-plan focus)
// - James Crawford (RERA broker, 10 years experience)
// - Marco Ferretti (Italian expat, recent buyer)

// Rules:
// - Generate exactly 4 messages, one from each person
// - Each message is 1-2 sentences max
// - React directly to the headline
// - Use specific AED prices, area names, yield numbers
// - Sound like real people texting casually
// - Format as JSON array: [{"name":"...","msg":"..."},...]
// - Return ONLY the JSON array, nothing else`
//             },
//             {
//               role: 'user',
//               content: `Headline: "${event.title}" ${event.location_name ? `Location: ${event.location_name}` : ''}`
//             }
//           ],
//         }),
//       })

//       const data = await response.json()
//       const text = data?.choices?.[0]?.message?.content?.trim()
//       if (!text) continue

//       const thread = JSON.parse(text)
//       if (!Array.isArray(thread)) continue

//       thread.forEach((msg, j) => {
//         const threadOffset = i * 5 * 60000
//         const msgOffset = j * 2 * 60000
//         const baseTime = now - (total * 5 * 60000)
//         chat.push({
//           id: `ev_${i}_${j}`,
//           user_name: msg.name,
//           content: msg.msg,
//           created_at: new Date(baseTime + threadOffset + msgOffset).toISOString()
//         })
//       })

//     } catch (err) {
//       console.warn('Groq thread generation failed for event:', event.title, err.message)
//     }
//   }

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

//     const weekAgo = Math.floor(Date.now() / 1000) - (1 * 86400)
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

//     const shaped = await buildMessagesFromEvents(events)
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

//      const shaped = await buildMessagesFromEvents(events)
//     localStorage.setItem(TODAY_KEY, JSON.stringify(shaped))
//     return shaped

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
//       position: 'absolute', inset: 0, background: 'var(--bg-primary)',
//       zIndex: 99999, display: 'flex', flexDirection: 'column',
//       fontFamily: "'Inter', sans-serif",
//     }}>
//       {/* Header */}
//       <div style={{
//         display: 'flex', alignItems: 'center', gap: '8px',
//         padding: '0 12px', height: 44, background: 'var(--bg-secondary)',
// borderBottom: '1px solid var(--border-color)', flexShrink: 0,
//       }}>
//        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>PRIVATE CHAT (DM)</span>
//         <span style={{ fontSize: '12px', color: nameColor(target.name), fontWeight: 700 }}>
//           {target.name}
//         </span>
//         <div style={{ flex: 1 }} />
//         <button
//           onClick={onClose}
//           style={{
//             background: 'var(--bg-input)', border: '1px solid var(--border-panel)',
// borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer',
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
//   fontSize: '11px', color: 'var(--text-muted)',
//   textAlign: 'center', padding: '24px',
// }}>
//             No messages yet. Start the private conversation.
//           </div>
//         )}
//         {messages.map(m => (
//           <div key={m.id} style={{
//             padding: '4px 14px',
//             background: m.sender_name === myName ? 'var(--own-message-bg)' : 'transparent',
//             borderLeft: m.sender_name === myName ? '2px solid rgba(184,115,51,0.5)' : '2px solid transparent',
//           }}>
//             <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1px' }}>
//               <span style={{ fontSize: '11px', fontWeight: 700, color: nameColor(m.sender_name) }}>
//                 {m.sender_name}
//               </span>
//              <span style={{ fontSize: '9px', color: 'var(--text-timestamp)' }}>
//                 {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </span>
//             </div>
//             <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, wordBreak: 'break-word' }}>
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
//         borderTop: '1px solid var(--border-color)',
// background: 'var(--bg-secondary)', flexShrink: 0,
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
//          style={{
//   flex: 1, padding: '10px 14px', fontSize: '16px',
//   background: 'var(--bg-input)',
//   border: '1px solid var(--border-panel)',
//   color: 'var(--text-primary)',
//   borderRadius: '8px', outline: 'none',
//   transition: 'border-color 0.15s',
//   WebkitAppearance: 'none',
//   cursor: 'text',
//   placeholderColor: 'var(--text-muted)',
// }}
//           onFocus={e => e.target.style.borderColor = '#6366f1'}
//          onBlur={e => e.target.style.borderColor = 'var(--border-panel)'}
//         />
//        <button
//   onClick={send}
//   disabled={!input.trim()}
//   style={{
//     width: 40, height: 40, borderRadius: '8px',
//     background: input.trim() ? '#6366f1' : 'var(--border-panel)',
//     border: 'none', color: 'var(--text-muted)', cursor: input.trim() ? 'pointer' : 'default',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: '16px', flexShrink: 0,
//             transition: 'background 0.15s',
//           }}
//         >↗</button>
//       </div>
//     </div>
//   )
// }

//  const CLAUDE_PERSONAS = [
//   { name: 'Sara Al Hashimi',    role: 'property owner and seller in Dubai, owns 2 units in JVC and 1 in Business Bay' },
//   { name: 'Khalid Al Mansouri', role: 'Dubai real estate investor, focuses on off-plan deals and high ROI areas' },
//   { name: 'James Crawford',     role: 'RERA-registered Dubai broker with 10 years experience' },
//   { name: 'Marco Ferretti',     role: 'Italian expat who bought a 1BR in Creek Harbour 8 months ago' },
//   { name: 'Aisha Al Farsi',     role: 'UAE national property investor focused on freehold zones and golden visa properties' },
//   { name: 'David Park',         role: 'Korean expat and first-time buyer searching for a 1BR in Dubai Hills, budget AED 1.4M' },
//   { name: 'Priya Nair',         role: 'Indian investor who owns 3 short-term rental units in Dubai Marina' },
//   { name: 'Omar Al Suwaidi',    role: 'Dubai-based developer rep who works with Emaar and Sobha launches' },
//   { name: 'Natasha Voronova',   role: 'Russian buyer who purchased a villa in Dubai Hills, focused on capital preservation' },
//   { name: 'Ahmed Bin Rashid',   role: 'Emirati property owner with multiple units in Downtown and Palm Jumeirah' },
//   { name: 'Sophie Laurent',     role: 'French expat agent specializing in luxury properties in DIFC and Downtown Dubai' },
//   { name: 'Raj Malhotra',       role: 'Property consultant helping NRI buyers understand mortgage options and DLD process' },
//   { name: 'Lucas Oliveira',     role: 'Brazilian investor who flipped two off-plan units in Business Bay' },
//   { name: 'Fatima Al Zaabi',    role: 'UAE national first-time buyer looking at JVC and Al Furjan' },
//   { name: 'Michael Turner',     role: 'British retiree who bought a sea-view apartment in JBR and lives there full time' },
//   { name: 'Chen Wei',           role: 'Chinese investor who owns units in Creek Harbour and Dubai South' },
//   { name: 'Isabella Rossi',     role: 'European buyer who closed on a 2BR in Sobha Hartland' },
//   { name: 'Hassan Al Qassimi',  role: 'Dubai property lawyer advising on NOC, MOU, DLD transfers, and title deed issues' },
//   { name: 'Mia Johansson',      role: 'Swedish expat managing 5 furnished 1BRs across JVC and Business Bay' },
//   { name: 'Tariq Al Mahmoud',   role: 'Gulf-based family office allocator focused on bulk purchases and commercial property' },
// ]


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
// const [privateInput, setPrivateInput] = useState('')          
// const [dmNotifications, setDmNotifications] = useState([])
// const [chatHistory, setChatHistory] = useState([])   // ← ADD THIS
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


//   // ── DM notification listener ──
// useEffect(() => {
//   const channel = supabase
//     .channel('dm-notify-' + Math.random())
//     .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'private_messages' }, (payload) => {
//       const msg = payload.new
//       if (msg.sender_name === myName) return
//       if (privateTarget && [myName, privateTarget.name].sort().join('__') === msg.room_id) return
//       setDmNotifications(prev => [...prev, msg])
//     })
//     .subscribe()
//   return () => supabase.removeChannel(channel)
// }, [myName, privateTarget])


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


// const triggerAgentReply = async (userMessage) => {
//   // ── No AI reply if message is from a real user ──
//   if (REAL_USERS.includes(myName)) return

//   const available = CLAUDE_PERSONAS.filter(p => p.name !== myName)
//   const persona = available[Math.floor(Math.random() * available.length)]

//   setAgentTyping(true)
//   await new Promise(r => setTimeout(r, 30000)) // 30 second delay
//   setAgentTyping(false)

//   try {
//     const updatedHistory = [
//       ...chatHistory,
//       { role: 'user', content: userMessage }
//     ]

//     const replyText = await generateChatResponse(userMessage, persona, updatedHistory)

//     if (!replyText) return // off-topic — stay silent

//     setChatHistory([
//       ...updatedHistory,
//       { role: 'assistant', content: replyText }
//     ])

//     const { error: insertError } = await supabase.from('messages').insert({
//       user_id: authUser?.id || '00000000-0000-0000-0000-000000000000',
//       user_name: persona.name,
//       content: replyText,
//     })

//     if (insertError) {
//       setMessages(prev => [...prev, {
//         id: `agent-local-${Date.now()}`,
//         user_name: persona.name,
//         content: replyText,
//         created_at: new Date().toISOString(),
//       }])
//     }

//   } catch (err) {
//     console.warn('Agent reply failed silently:', err.message)
//     // no fallback — silent fail
//   }
// }

//   return (
//     <div style={{
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   background: 'var(--bg-primary)',
//   fontFamily: "'Inter', sans-serif",
//   overflow: 'hidden',
//   pointerEvents: 'auto',
//   position: 'relative',   // ← ADD THIS
// }}>
//      <style>{`
//   @keyframes bounce {
//     0%, 100% { transform: translateY(0); opacity: 0.4; }
//     50% { transform: translateY(-4px); opacity: 1; }
//   }
//   [data-theme="light"] input::placeholder {
//     color: #999999;
//   }
//   [data-theme="light"] .chat-input-field {
//     background: #F0F0F0 !important;
//     border-color: #DEDEDE !important;
//   }
// `}</style>

//       {/* Header */}
//       {onClose && (
//         <div style={{
//           display: 'flex', alignItems: 'center', gap: '7px',
//           padding: '0 12px',
//           background: 'var(--bg-secondary)',
// borderBottom: '1px solid var(--border-color)',
//           flexShrink: 0,
//           height: 44,
//           position: 'sticky',
//           top: 0,
//           zIndex: 9999,
//         }}>
//           <div style={{
//           width: 22, height: 22, borderRadius: '6px', background: 'var(--bg-input)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: '11px', flexShrink: 0,
//           }}>💬</div>

//           <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '1px' }}>CHAT</span>

//          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>as</span>
//           <span style={{
//             fontSize: '10px', fontWeight: 700,
//             color: nameColor(myName),
//             maxWidth: '140px', overflow: 'hidden',
//             textOverflow: 'ellipsis', whiteSpace: 'nowrap',
//           }}>{myName}</span>

//           <div style={{ flex: 1 }} />

//           <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//             <span style={{ fontSize: '13px' }}>🟠</span>
//             <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
//               {msgCount !== null ? msgCount.toLocaleString() : '—'}
//             </span>
//           </div>

//           <button
//             onClick={() => window.location.reload()}
//            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '15px', padding: '4px' }}
//           >↺</button>

//           <button
//             onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); onClose() }}
//             onTouchStart={(e) => { e.stopPropagation(); e.preventDefault(); onClose() }}
//             onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClose() }}
//             style={{
//               width: 36, height: 36, background: 'var(--bg-input)',
// border: '1px solid var(--border-panel)', borderRadius: '6px',
// color: 'var(--text-primary)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               touchAction: 'manipulation',
//               WebkitTapHighlightColor: 'transparent',
//               position: 'relative',
//               zIndex: 999,
//             }}
//           >✕</button>
//         </div>
//       )}

//       {/* DM Notifications */}
//       {dmNotifications.map((notif, i) => (
//         <div key={i} onClick={() => {
//           setPrivateTarget({ name: notif.sender_name })
//           setDmNotifications(prev => prev.filter((_, j) => j !== i))
//         }} style={{
//           padding: '8px 14px',
//           background: 'rgba(99,102,241,0.2)',
//           borderBottom: '1px solid rgba(99,102,241,0.4)',
//           fontSize: '11px', color: '#a5b4fc',
//           cursor: 'pointer', flexShrink: 0,
//           display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//         }}>
//           <span>💬 <strong>{notif.sender_name}</strong> sent you a private message</span>
//           <button onClick={e => { e.stopPropagation(); setDmNotifications(prev => prev.filter((_, j) => j !== i)) }}
//             style={{ background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer', fontSize: '14px' }}>✕</button>
//         </div>
//       ))}

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
//        scrollbarWidth: 'thin', scrollbarColor: 'var(--bg-input) transparent',
//         WebkitOverflowScrolling: 'touch',
//       }}>
//         {loading && (
//          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
//   Loading messages...
//           </div>
//         )}
//         {!loading && messages.length === 0 && (
//           <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
//   No messages yet. Say something!
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
//               background: isOwn ? 'var(--own-message-bg)' : 'transparent',
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
//                   <span style={{ fontSize: '9px', color: 'var(--text-timestamp)' }}>{formatTime(msg.created_at)}</span>
//                 </div>
//               )}
//               <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, wordBreak: 'break-word' }}>
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
//             color: 'var(--text-muted)',
// fontStyle: 'italic',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '6px',
//           }}>
//             <span style={{
//               display: 'inline-flex', gap: '3px', alignItems: 'center',
//             }}>
//               <span style={{ animation: 'bounce 1s infinite', animationDelay: '0ms', width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />
//               <span style={{ animation: 'bounce 1s infinite', animationDelay: '150ms', width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />
//               <span style={{ animation: 'bounce 1s infinite', animationDelay: '300ms', width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />
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
//           background: 'var(--bg-secondary)',
// borderTop: '1px solid var(--border-color)',
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           gap: '6px',
//           flexShrink: 0,
//         }}>
//           <span style={{ fontSize: '10px', color: 'var(--text-primary)', flexShrink: 1, minWidth: 0 }}>
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
//           borderTop: '1px solid var(--border-color)',
// background: 'var(--bg-secondary)', flexShrink: 0,
//           display: 'flex', gap: '8px', alignItems: 'center',
//         }}>
//          <input
//   ref={inputRef}
//   className="chat-input-field"
//   value={input}
//   onChange={e => setInput(e.target.value)}
//   onKeyDown={handleKeyDown}
//             placeholder={authUser ? `Message as ${myName}...` : 'Sign in to chat...'}
//             maxLength={200}
//             style={{
//               flex: 1, padding: '10px 14px', fontSize: '16px',
//               background: 'var(--bg-input)',
// border: '1px solid var(--border-panel)',
// color: 'var(--text-primary)',
//               borderRadius: '8px', outline: 'none',
//               transition: 'border-color 0.15s',
//               WebkitAppearance: 'none',
//               cursor: 'text',
//             }}
//             onFocus={e => e.target.style.borderColor = '#6366f1'}
//             onBlur={e => e.target.style.borderColor = 'var(--border-panel)'}
//           />
//           <button
//             type="button"
//             onClick={sendMessage}
//             disabled={!input.trim()}
//             style={{
//               width: 40, height: 40, borderRadius: '8px',
//              background: input.trim() ? '#6366f1' : 'var(--border-panel)',
// border: 'none', color: 'var(--text-muted)',
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
import { generateChatResponse } from '../lib/chatPersonas'

const REAL_USERS = [
  'Anastasia Volkov',
  'Svetlana Morozova',
  'Alexei Petrov',
  'Irina Sokolova',
  'Hassan Al Farsi',
  'Yusuf Al Zaabi',
  'Ayaan Soomro',
  'Omar Al Hashimi',
  'Zaryab Memon',
  'Yelena Ivanova',
]

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
  const now = new Date()
  const slot = Math.floor(now.getMinutes() / 30)
  const key = `${now.toISOString().slice(0, 13)}_${slot}`
  return `acqar_chat_v4_${key}`
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
async function buildMessagesFromEvents(events) {
  const top = events.slice(0, 5)
  const now = Date.now()
  const total = top.length
  const chat = []

  const PERSONAS = [
    { name: 'Sara Al Hashimi',    role: 'property owner in Dubai with units in JVC and Business Bay' },
    { name: 'Khalid Al Mansouri', role: 'Dubai real estate investor focused on off-plan and ROI' },
    { name: 'James Crawford',     role: 'RERA-registered Dubai broker with 10 years experience' },
    { name: 'Marco Ferretti',     role: 'Italian expat who recently bought in Creek Harbour' },
  ]

  const groqKey = import.meta.env.VITE_GROQ_KEY
  if (!groqKey) return []

  for (let i = 0; i < top.length; i++) {
    const event = top[i]
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          max_tokens: 250,
          messages: [
            {
              role: 'system',
              content: `You are simulating a Dubai real estate group chat. Generate a realistic conversation between these 4 people reacting to a news headline:
- Sara Al Hashimi (property owner, JVC and Business Bay units)
- Khalid Al Mansouri (investor, off-plan focus)
- James Crawford (RERA broker, 10 years experience)
- Marco Ferretti (Italian expat, recent buyer)

Rules:
- Generate exactly 4 messages, one from each person
- Each message is 1-2 sentences max
- React directly to the headline
- Use specific AED prices, area names, yield numbers
- Sound like real people texting casually
- Format as JSON array: [{"name":"...","msg":"..."},...]
- Return ONLY the JSON array, nothing else`
            },
            {
              role: 'user',
              content: `Headline: "${event.title}" ${event.location_name ? `Location: ${event.location_name}` : ''}`
            }
          ],
        }),
      })

      const data = await response.json()
      const text = data?.choices?.[0]?.message?.content?.trim()
      if (!text) continue

      const thread = JSON.parse(text)
      if (!Array.isArray(thread)) continue

      thread.forEach((msg, j) => {
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

    } catch (err) {
      console.warn('Groq thread generation failed for event:', event.title, err.message)
    }
  }

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

    const weekAgo = Math.floor(Date.now() / 1000) - (1 * 86400)
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

    const shaped = await buildMessagesFromEvents(events)
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

     const shaped = await buildMessagesFromEvents(events)
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
      position: 'absolute', inset: 0, background: 'var(--bg-primary)',
      zIndex: 99999, display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '0 12px', height: 44, background: 'var(--bg-secondary)',
borderBottom: '1px solid var(--border-color)', flexShrink: 0,
      }}>
       <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>PRIVATE CHAT (DM)</span>
        <span style={{ fontSize: '12px', color: nameColor(target.name), fontWeight: 700 }}>
          {target.name}
        </span>
        <div style={{ flex: 1 }} />
        <button
          onClick={onClose}
          style={{
            background: 'var(--bg-input)', border: '1px solid var(--border-panel)',
borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer',
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
  fontSize: '11px', color: 'var(--text-muted)',
  textAlign: 'center', padding: '24px',
}}>
            No messages yet. Start the private conversation.
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} style={{
            padding: '4px 14px',
            background: m.sender_name === myName ? 'var(--own-message-bg)' : 'transparent',
            borderLeft: m.sender_name === myName ? '2px solid rgba(184,115,51,0.5)' : '2px solid transparent',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: nameColor(m.sender_name) }}>
                {m.sender_name}
              </span>
             <span style={{ fontSize: '9px', color: 'var(--text-timestamp)' }}>
                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, wordBreak: 'break-word' }}>
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
        borderTop: '1px solid var(--border-color)',
background: 'var(--bg-secondary)', flexShrink: 0,
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
  background: 'var(--bg-input)',
  border: '1px solid var(--border-panel)',
  color: 'var(--text-primary)',
  borderRadius: '8px', outline: 'none',
  transition: 'border-color 0.15s',
  WebkitAppearance: 'none',
  cursor: 'text',
  placeholderColor: 'var(--text-muted)',
}}
          onFocus={e => e.target.style.borderColor = '#6366f1'}
         onBlur={e => e.target.style.borderColor = 'var(--border-panel)'}
        />
       <button
  onClick={send}
  disabled={!input.trim()}
  style={{
    width: 40, height: 40, borderRadius: '8px',
    background: input.trim() ? '#6366f1' : 'var(--border-panel)',
    border: 'none', color: 'var(--text-muted)', cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', flexShrink: 0,
            transition: 'background 0.15s',
          }}
        >↗</button>
      </div>
    </div>
  )
}

 const CLAUDE_PERSONAS = [
  { name: 'Sara Al Hashimi',    role: 'property owner and seller in Dubai, owns 2 units in JVC and 1 in Business Bay' },
  { name: 'Khalid Al Mansouri', role: 'Dubai real estate investor, focuses on off-plan deals and high ROI areas' },
  { name: 'James Crawford',     role: 'RERA-registered Dubai broker with 10 years experience' },
  { name: 'Marco Ferretti',     role: 'Italian expat who bought a 1BR in Creek Harbour 8 months ago' },
  { name: 'Aisha Al Farsi',     role: 'UAE national property investor focused on freehold zones and golden visa properties' },
  { name: 'David Park',         role: 'Korean expat and first-time buyer searching for a 1BR in Dubai Hills, budget AED 1.4M' },
  { name: 'Priya Nair',         role: 'Indian investor who owns 3 short-term rental units in Dubai Marina' },
  { name: 'Omar Al Suwaidi',    role: 'Dubai-based developer rep who works with Emaar and Sobha launches' },
  { name: 'Natasha Voronova',   role: 'Russian buyer who purchased a villa in Dubai Hills, focused on capital preservation' },
  { name: 'Ahmed Bin Rashid',   role: 'Emirati property owner with multiple units in Downtown and Palm Jumeirah' },
  { name: 'Sophie Laurent',     role: 'French expat agent specializing in luxury properties in DIFC and Downtown Dubai' },
  { name: 'Raj Malhotra',       role: 'Property consultant helping NRI buyers understand mortgage options and DLD process' },
  { name: 'Lucas Oliveira',     role: 'Brazilian investor who flipped two off-plan units in Business Bay' },
  { name: 'Fatima Al Zaabi',    role: 'UAE national first-time buyer looking at JVC and Al Furjan' },
  { name: 'Michael Turner',     role: 'British retiree who bought a sea-view apartment in JBR and lives there full time' },
  { name: 'Chen Wei',           role: 'Chinese investor who owns units in Creek Harbour and Dubai South' },
  { name: 'Isabella Rossi',     role: 'European buyer who closed on a 2BR in Sobha Hartland' },
  { name: 'Hassan Al Qassimi',  role: 'Dubai property lawyer advising on NOC, MOU, DLD transfers, and title deed issues' },
  { name: 'Mia Johansson',      role: 'Swedish expat managing 5 furnished 1BRs across JVC and Business Bay' },
  { name: 'Tariq Al Mahmoud',   role: 'Gulf-based family office allocator focused on bulk purchases and commercial property' },
]


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
const [privateTarget, setPrivateTarget] = useState(null)      // ← ADD
const [privateMessages, setPrivateMessages] = useState([])    // ← ADD
const [privateInput, setPrivateInput] = useState('')          
const [dmNotifications, setDmNotifications] = useState([])
const [chatHistory, setChatHistory] = useState([])   // ← ADD THIS
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
        .limit(2000)
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
  const channel = supabase
    .channel('dm-notify-' + Math.random())
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'private_messages' }, (payload) => {
      const msg = payload.new
      if (msg.sender_name === myName) return
      if (privateTarget && [myName, privateTarget.name].sort().join('__') === msg.room_id) return
      setDmNotifications(prev => [...prev, msg])
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


const triggerAgentReply = async (userMessage) => {
  // ── No AI reply if message is from a real user ──
  if (REAL_USERS.includes(myName)) return

  const available = CLAUDE_PERSONAS.filter(p => p.name !== myName)
  const persona = available[Math.floor(Math.random() * available.length)]

  setAgentTyping(true)
  await new Promise(r => setTimeout(r, 30000)) // 30 second delay
  setAgentTyping(false)

  try {
    const updatedHistory = [
      ...chatHistory,
      { role: 'user', content: userMessage }
    ]

    const replyText = await generateChatResponse(userMessage, persona, updatedHistory)

    if (!replyText) return // off-topic — stay silent

    setChatHistory([
      ...updatedHistory,
      { role: 'assistant', content: replyText }
    ])

    const { error: insertError } = await supabase.from('messages').insert({
      user_id: authUser?.id || '00000000-0000-0000-0000-000000000000',
      user_name: persona.name,
      content: replyText,
    })

    if (insertError) {
      setMessages(prev => [...prev, {
        id: `agent-local-${Date.now()}`,
        user_name: persona.name,
        content: replyText,
        created_at: new Date().toISOString(),
      }])
    }

  } catch (err) {
    console.warn('Agent reply failed silently:', err.message)
    // no fallback — silent fail
  }
}

  return (
    <div style={{
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--bg-primary)',
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
  [data-theme="light"] input::placeholder {
    color: #999999;
  }
  [data-theme="light"] .chat-input-field {
    background: #F0F0F0 !important;
    border-color: #DEDEDE !important;
  }
`}</style>

      {/* Header */}
      {onClose && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '0 12px',
          background: 'var(--bg-secondary)',
borderBottom: '1px solid var(--border-color)',
          flexShrink: 0,
          height: 44,
          position: 'sticky',
          top: 0,
          zIndex: 9999,
        }}>
          <div style={{
          width: 22, height: 22, borderRadius: '6px', background: 'var(--bg-input)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', flexShrink: 0,
          }}>💬</div>

          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '1px' }}>CHAT</span>

         <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>as</span>
          <span style={{
            fontSize: '10px', fontWeight: 700,
            color: nameColor(myName),
            maxWidth: '140px', overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{myName}</span>

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '13px' }}>🟠</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {msgCount !== null ? msgCount.toLocaleString() : '—'}
            </span>
          </div>

          <button
            onClick={() => window.location.reload()}
           style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '15px', padding: '4px' }}
          >↺</button>

          <button
            onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); onClose() }}
            onTouchStart={(e) => { e.stopPropagation(); e.preventDefault(); onClose() }}
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClose() }}
            style={{
              width: 36, height: 36, background: 'var(--bg-input)',
border: '1px solid var(--border-panel)', borderRadius: '6px',
color: 'var(--text-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              position: 'relative',
              zIndex: 999,
            }}
          >✕</button>
        </div>
      )}

      {/* DM Notifications */}
      {dmNotifications.map((notif, i) => (
        <div key={i} onClick={() => {
          setPrivateTarget({ name: notif.sender_name })
          setDmNotifications(prev => prev.filter((_, j) => j !== i))
        }} style={{
          padding: '8px 14px',
          background: 'rgba(99,102,241,0.2)',
          borderBottom: '1px solid rgba(99,102,241,0.4)',
          fontSize: '11px', color: '#a5b4fc',
          cursor: 'pointer', flexShrink: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>💬 <strong>{notif.sender_name}</strong> sent you a private message</span>
          <button onClick={e => { e.stopPropagation(); setDmNotifications(prev => prev.filter((_, j) => j !== i)) }}
            style={{ background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer', fontSize: '14px' }}>✕</button>
        </div>
      ))}

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
       scrollbarWidth: 'thin', scrollbarColor: 'var(--bg-input) transparent',
        WebkitOverflowScrolling: 'touch',
      }}>
        {loading && (
         <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
  Loading messages...
          </div>
        )}
        {!loading && messages.length === 0 && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
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
              background: isOwn ? 'var(--own-message-bg)' : 'transparent',
              borderLeft: isOwn ? '2px solid rgba(184,115,51,0.5)' : '2px solid transparent',
            }}>
              {showHeader && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '2px' }}>
                  <span
  onClick={() => {
    if (msg.user_name !== myName) setPrivateTarget({ name: msg.user_name, userId: msg.user_id })
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
                  <span style={{ fontSize: '9px', color: 'var(--text-timestamp)' }}>{formatTime(msg.created_at)}</span>
                </div>
              )}
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, wordBreak: 'break-word' }}>
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
            color: 'var(--text-muted)',
fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span style={{
              display: 'inline-flex', gap: '3px', alignItems: 'center',
            }}>
              <span style={{ animation: 'bounce 1s infinite', animationDelay: '0ms', width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />
              <span style={{ animation: 'bounce 1s infinite', animationDelay: '150ms', width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />
              <span style={{ animation: 'bounce 1s infinite', animationDelay: '300ms', width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />
            </span>
            Someone is typing...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Free plan — read-only banner */}
      {authUser && !canChat && (
        <div style={{
          padding: '10px 12px',
          background: 'var(--bg-secondary)',
borderTop: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '6px',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '10px', color: 'var(--text-primary)', flexShrink: 1, minWidth: 0 }}>
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
          borderTop: '1px solid var(--border-color)',
background: 'var(--bg-secondary)', flexShrink: 0,
          display: 'flex', gap: '8px', alignItems: 'center',
        }}>
         <input
  ref={inputRef}
  className="chat-input-field"
  value={input}
  onChange={e => setInput(e.target.value)}
  onKeyDown={handleKeyDown}
            placeholder={authUser ? `Message as ${myName}...` : 'Sign in to chat...'}
            maxLength={200}
            style={{
              flex: 1, padding: '10px 14px', fontSize: '16px',
              background: 'var(--bg-input)',
border: '1px solid var(--border-panel)',
color: 'var(--text-primary)',
              borderRadius: '8px', outline: 'none',
              transition: 'border-color 0.15s',
              WebkitAppearance: 'none',
              cursor: 'text',
            }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = 'var(--border-panel)'}
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!input.trim()}
            style={{
              width: 40, height: 40, borderRadius: '8px',
             background: input.trim() ? '#6366f1' : 'var(--border-panel)',
border: 'none', color: 'var(--text-muted)',
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























