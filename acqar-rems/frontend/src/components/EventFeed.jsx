// import { useEffect, useRef, useState } from 'react'
// import { useEvents } from '../context/EventsContext'
// import EventCard from './EventCard'

// // ─── Plan config ────────────────────────────────────────────────────────────
// // Set this from your auth context / user state.
// // true  = free user  → Reports tab is locked
// // false = pro user   → Reports tab is fully accessible
// const PRICING_URL = 'https://acqar.vercel.app/pricing'

// // Replace this line with real auth context later:
// // const { plan } = useAuth()
// // For now expose it as a prop so parent can pass plan="free" | "pro"
// // ────────────────────────────────────────────────────────────────────────────

// const SEVERITY_COLORS = {
//   1: '#27AE60',
//   2: '#A8D44A',
//   3: '#F39C12',
//   4: '#E67E22',
//   5: '#E74C3C'
// }

// // ─── Pricing Popup ───────────────────────────────────────────────────────────
// function ProUpgradePopup({ onClose }) {
//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         onClick={onClose}
//         style={{
//           position: 'fixed', inset: 0,

//           background: 'rgba(10,14,26,0.72)',
//           backdropFilter: 'blur(2px)',
//           zIndex: 30,
//         }}
//       />

//       {/* Card */}
//       <div style={{
//   position: 'fixed',
// top: '50%', left: '50%',
// transform: 'translate(-50%, -50%)',
// zIndex: 31,
// width: 'min(248px, calc(100vw - 32px))',
// maxHeight: '85dvh',
// overflowY: 'auto',
// WebkitOverflowScrolling: 'touch',
//   background: 'linear-gradient(160deg, #16213E 0%, #0D1B30 100%)',
//   border: '1px solid #B87333',
//   borderRadius: '12px',
//   padding: '18px 16px 14px',
//   boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(184,115,51,0.15)',
// }}>

//         {/* Close */}
//         <button
//           onClick={onClose}
//           style={{
//             position: 'absolute', top: '10px', right: '10px',
//             background: 'none', border: 'none', cursor: 'pointer',
//             color: '#555', fontSize: '14px', lineHeight: 1,
//             padding: '2px 5px',
//           }}
//         >✕</button>

//         {/* Label */}
//         <div style={{
//           fontSize: '9px', fontWeight: 800, letterSpacing: '1.2px',
//           color: '#B87333', marginBottom: '6px',
//         }}>
//           FOUNDING MEMBER OFFER
//         </div>

//         {/* Product name */}
//         <div style={{
//           fontSize: '20px', fontWeight: 900, color: '#FAFAFA',
//           letterSpacing: '-0.5px', marginBottom: '4px',
//         }}>
//           ACQAR <span style={{ color: '#B87333' }}>PRO</span>
//         </div>

//         <div style={{
//           fontSize: '10px', color: '#888', lineHeight: 1.5, marginBottom: '12px',
//         }}>
//           For property owners and buyers who need Dubai real estate intelligence.
//         </div>

//         {/* Price */}
//         {/* Price */}
// <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', marginBottom: '2px' }}>
//   <span style={{ fontSize: '11px', color: '#B87333', fontWeight: 900, marginBottom: '4px', letterSpacing: '0.05em' }}>AED</span>
//   <span style={{ fontSize: '32px', fontWeight: 900, color: '#B87333', lineHeight: 1 }}>29</span>
// </div>
//         <div style={{
//           fontSize: '9px', fontWeight: 700, color: '#B87333',
//           letterSpacing: '0.6px', marginBottom: '12px',
//         }}>
//           FIRST 3 MONTHS — 149/MO AFTER
//         </div>

//         {/* Features */}
//         <div style={{ marginBottom: '14px' }}>
//           {[
//             '10 TRUVALU™ AI Reports/Month',
//             'Full SIGNAL™ Terminal Access',
//             'PDF Reports & Shareable Links',
//             'Real-Time Market Signals',
//             'Cancel Anytime',
//           ].map(f => (
//             <div key={f} style={{
//               display: 'flex', alignItems: 'center', gap: '7px',
//               fontSize: '10px', color: '#DADADA', fontWeight: 600,
//               marginBottom: '5px',
//             }}>
//               <span style={{ color: '#B87333', fontSize: '10px' }}>✓</span>
//               {f}
//             </div>
//           ))}
//         </div>

//         {/* CTA */}
//         <a
//           href={PRICING_URL}
//           target="_blank"
//           rel="noopener noreferrer"
//           style={{
//             display: 'block', textAlign: 'center',
//             background: 'linear-gradient(135deg, #B87333 0%, #D4913F 100%)',
//             color: '#1A1A2E', fontWeight: 800, fontSize: '10px',
//             letterSpacing: '0.8px', padding: '10px 12px',
//             borderRadius: '7px', textDecoration: 'none',
//             marginBottom: '8px',
//             transition: 'opacity 0.15s',
//           }}
//           onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
//           onMouseLeave={e => e.currentTarget.style.opacity = '1'}
//         >
//           AVAIL FOUNDING MEMBER OFFER →
//         </a>

//         {/* Dismiss */}
//         <button
//           onClick={onClose}
//           style={{
//             display: 'block', width: '100%', textAlign: 'center',
//             background: 'none', border: 'none', cursor: 'pointer',
//             fontSize: '9px', fontWeight: 700, color: '#555',
//             letterSpacing: '0.5px', padding: '4px',
//           }}
//         >
//           MAYBE LATER
//         </button>
//       </div>
//     </>
//   )
// }

// // ─── Main Component ──────────────────────────────────────────────────────────
// export default function EventFeed({ plan = 'free' }) {
//   const { filteredEvents, isLoading, setSelectedEvent } = useEvents()
//   const feedRef = useRef(null)
//   const prevCountRef = useRef(0)
//   const [activeTab, setActiveTab] = useState('feed')
//   const [showProPopup, setShowProPopup] = useState(false)

//   const isFree = plan === 'free'

//   // Auto-scroll to top when new events arrive
//   useEffect(() => {
//     if (filteredEvents.length > prevCountRef.current && feedRef.current) {
//       feedRef.current.scrollTop = 0
//     }
//     prevCountRef.current = filteredEvents.length
//   }, [filteredEvents.length])

//   // Filter events based on active tab
//   const getTabEvents = () => {
//     const now = Date.now() / 1000
//     const thirtyMinutesAgo = now - 1800

//     switch (activeTab) {
//       case 'live':
//         return filteredEvents.filter(e => {
//           const eventTs = e.created_at_ts || new Date(e.created_at).getTime() / 1000
//           return eventTs >= thirtyMinutesAgo
//         })
//    case 'reports':
//   return filteredEvents.filter(e => e.severity >= 4).slice(0, isFree ? 4 : filteredEvents.filter(e => e.severity >= 4).length)
//       case 'feed':
//       default:
//         return filteredEvents
//     }
//   }

//   const tabEvents = getTabEvents()

//   // Counts
//   const now = Date.now() / 1000
//   const liveCount = filteredEvents.filter(e => {
//     const ts = e.created_at_ts || new Date(e.created_at).getTime() / 1000
//     return ts >= now - 1800
//   }).length
//   const reportsCount = isFree ? 4 : filteredEvents.filter(e => e.severity >= 4).length

//   // Handle Reports tab click for free users
//   const handleTabClick = (key) => {
//     if (key === 'reports' && isFree) {
//       setActiveTab('reports') // switch so they see the blur
//       setShowProPopup(true)
//       return
//     }
//     setActiveTab(key)
//     setShowProPopup(false)
//   }

//   if (isLoading) return (
//     <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3B3B3', fontSize: '13px' }}>
//       <div>⏳ Fetching live data...</div>
//     </div>
//   )

//   return (
//     <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden', position: 'relative' }}>

//       {/* ── Tab Bar ─────────────────────────────────────────────────────── */}
//       <div style={{ display: 'flex', borderBottom: '1px solid #0F3460', flexShrink: 0, background: '#16213E', alignItems: 'center' }}>
//         {[
//           { key: 'feed', label: 'FEED' },
//           { key: 'live', label: 'LIVE' },
//           { key: 'reports', label: 'REPORTS' },
//         ].map(tab => (
//           <button
//             key={tab.key}
//             onClick={() => handleTabClick(tab.key)}
//             style={{
//               flex: 1, padding: '8px 4px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px',
//               border: 'none', background: 'transparent', cursor: 'pointer',
//               color: activeTab === tab.key ? '#B87333' : '#555',
//               borderBottom: activeTab === tab.key ? '2px solid #B87333' : '2px solid transparent',
//               position: 'relative',
//             }}
//           >
//             {tab.key === 'live' && liveCount > 0 && (
//               <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', marginRight: 3 }}>
//                 <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#27AE60', animation: 'livePulse 2s infinite' }} />
//                 <span style={{ fontSize: '9px', fontWeight: 700, color: '#27AE60' }}>{liveCount}</span>
//               </span>
//             )}
//             {tab.label}
//             {/* Lock icon on REPORTS for free users */}
            
//             {tab.key === 'reports' && reportsCount > 0 && (
//               <span style={{ fontSize: '8px', fontWeight: 800, padding: '0 3px', background: '#E74C3C22', color: '#E74C3C', borderRadius: '3px', marginLeft: '2px' }}>
//                 {reportsCount}
//               </span>
//             )}
//           </button>
//         ))}
//         <div style={{ fontSize: '10px', color: '#B3B3B3', padding: '0 8px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
//           {tabEvents.length} events
//         </div>
//       </div>

//       {/* ── Content Area ────────────────────────────────────────────────── */}
//       {!tabEvents.length && !filteredEvents.length && (
//         <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3B3B3', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
//           <div>
//             <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
//             <div>No events match your filters</div>
//             <div style={{ fontSize: '11px', marginTop: '4px', color: '#666' }}>Try expanding the time range</div>
//           </div>
//         </div>
//       )}

//       {!tabEvents.length && filteredEvents.length > 0 && (
//         <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3B3B3', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
//           <div>
//             <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
//             <div>
//               {activeTab === 'live' && 'No events in the last 30 minutes'}
//               {activeTab === 'reports' && 'No high-severity reports in this time window. Try switching to 72H.'}
//               {activeTab === 'feed' && 'No events to display'}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── REPORTS TAB — with blur gate for free users ──────────────────── */}
//       {tabEvents.length > 0 && activeTab === 'reports' && (
//         <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

//           {/* Actual report cards (blurred when free) */}
//           <div
//             ref={feedRef}
//             style={{
//               height: '100%', overflowY: 'auto',
//               filter: isFree ? 'blur(4px)' : 'none',
//               pointerEvents: isFree ? 'none' : 'auto',
//               userSelect: isFree ? 'none' : 'auto',
//               transition: 'filter 0.2s',
//             }}
//           >
//             {tabEvents.map(event => (
//               <div
//                 key={event.id}
//                 style={{
//                   padding: '12px', borderBottom: '1px solid #0F3460', cursor: 'pointer',
//                   background: 'rgba(231,76,60,0.03)',
//                 }}
//                 onClick={() => setSelectedEvent(event)}
//               >
//                 <div style={{ display: 'flex', gap: '6px', marginBottom: '5px', alignItems: 'center' }}>
//                   <span style={{
//                     fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px',
//                     background: SEVERITY_COLORS[event.severity] + '22', color: SEVERITY_COLORS[event.severity],
//                   }}>⚠ S{event.severity}</span>
//                   <span style={{
//                     fontSize: '9px', fontWeight: 600, padding: '2px 5px', borderRadius: '3px',
//                     background: 'rgba(184,115,51,0.15)', color: '#B87333', textTransform: 'uppercase', letterSpacing: '0.3px',
//                   }}>{event.category?.replace('_', ' ')}</span>
//                   <span style={{ fontSize: '10px', color: '#555', marginLeft: 'auto' }}>{event.location_name}</span>
//                 </div>
//                 <div style={{ fontSize: '12px', fontWeight: 700, color: '#FAFAFA', lineHeight: 1.4, marginBottom: '4px' }}>{event.title}</div>
//                 <div style={{ fontSize: '11px', color: '#888', lineHeight: 1.5 }}>{event.summary?.slice(0, 120)}...</div>
//                 <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
//                   <span style={{ fontSize: '9px', color: '#B87333', fontWeight: 600 }}>via {event.source}</span>
//                   {event.url && (
//                     <a href={event.url} target="_blank" rel="noopener noreferrer"
//                       onClick={e => e.stopPropagation()}
//                       style={{ fontSize: '9px', color: '#2980B9', textDecoration: 'none', borderBottom: '1px dotted #2980B9', marginLeft: 'auto' }}>
//                       ↗ Source
//                     </a>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pricing popup overlay (only for free users) */}
//           {isFree && showProPopup && (
//             <ProUpgradePopup onClose={() => {
//               setShowProPopup(false)
//               setActiveTab('feed') // send them back to feed on dismiss
//             }} />
//           )}

//           {/* Teaser overlay when popup is closed but still on reports tab (free) */}
//           {isFree && !showProPopup && (
//             <div
//               onClick={() => setShowProPopup(true)}
//               style={{
//                 position: 'absolute', inset: 0,
//                 display: 'flex', flexDirection: 'column',
//                 alignItems: 'center', justifyContent: 'center',
//                 background: 'rgba(10,14,26,0.55)',
//                 cursor: 'pointer',
//                 zIndex: 10,
//               }}
//             >
//               <div style={{
//                 fontSize: '24px', marginBottom: '8px',
//               }}>🔒</div>
//               <div style={{
//                 fontSize: '12px', fontWeight: 700, color: '#FAFAFA',
//                 marginBottom: '4px',
//               }}>PRO Feature</div>
//               <div style={{
//                 fontSize: '10px', color: '#888', marginBottom: '12px', textAlign: 'center', padding: '0 24px',
//               }}>High-severity market reports require ACQAR PRO</div>
//               <div style={{
//                 fontSize: '10px', fontWeight: 700, color: '#B87333',
//                 border: '1px solid #B87333', borderRadius: '5px',
//                 padding: '5px 14px', letterSpacing: '0.5px',
//               }}>
//                 VIEW PLANS →
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── FEED & LIVE TABS ────────────────────────────────────────────── */}
//       {tabEvents.length > 0 && (activeTab === 'feed' || activeTab === 'live') && (
//         <div ref={feedRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
//           {tabEvents.map((event, i) => (
//             <EventCard key={event.id} event={event} isNew={i === 0} />
//           ))}
//         </div>
//       )}

//       <style>{`
//         @keyframes livePulse {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50% { opacity: 0.5; transform: scale(1.3); }
//         }
//       `}</style>
//     </div>
//   )
// }



// import { useEffect, useRef, useState } from 'react'
// import { useEvents } from '../context/EventsContext'
// import EventCard from './EventCard'

// // ─── Plan config ────────────────────────────────────────────────────────────
// // Set this from your auth context / user state.
// // true  = free user  → Reports tab is locked
// // false = pro user   → Reports tab is fully accessible
// const PRICING_URL = 'https://acqar.vercel.app/pricing'

// // Replace this line with real auth context later:
// // const { plan } = useAuth()
// // For now expose it as a prop so parent can pass plan="free" | "pro"
// // ────────────────────────────────────────────────────────────────────────────

// const SEVERITY_COLORS = {
//   1: '#27AE60',
//   2: '#A8D44A',
//   3: '#F39C12',
//   4: '#E67E22',
//   5: '#E74C3C'
// }

// // ─── Pricing Popup ───────────────────────────────────────────────────────────
// function ProUpgradePopup({ onClose }) {
//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         onClick={onClose}
//         style={{
//           position: 'fixed', inset: 0,

//           background: 'rgba(10,14,26,0.72)',
//           backdropFilter: 'blur(2px)',
//           zIndex: 30,
//         }}
//       />

//       {/* Card */}
//       <div style={{
//   position: 'fixed',
// top: '50%', left: '50%',
// transform: 'translate(-50%, -50%)',
// zIndex: 31,
// width: 'min(248px, calc(100vw - 32px))',
// maxHeight: '85dvh',
// overflowY: 'auto',
// WebkitOverflowScrolling: 'touch',
//   background: 'linear-gradient(160deg, #16213E 0%, #0D1B30 100%)',
//   border: '1px solid #B87333',
//   borderRadius: '12px',
//   padding: '18px 16px 14px',
//   boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(184,115,51,0.15)',
// }}>

//         {/* Close */}
//         <button
//           onClick={onClose}
//           style={{
//             position: 'absolute', top: '10px', right: '10px',
//             background: 'none', border: 'none', cursor: 'pointer',
//             color: '#555', fontSize: '14px', lineHeight: 1,
//             padding: '2px 5px',
//           }}
//         >✕</button>

//         {/* Label */}
//         <div style={{
//           fontSize: '9px', fontWeight: 800, letterSpacing: '1.2px',
//           color: '#B87333', marginBottom: '6px',
//         }}>
//           FOUNDING MEMBER OFFER
//         </div>

//         {/* Product name */}
//         <div style={{
//           fontSize: '20px', fontWeight: 900, color: '#FAFAFA',
//           letterSpacing: '-0.5px', marginBottom: '4px',
//         }}>
//           ACQAR <span style={{ color: '#B87333' }}>PRO</span>
//         </div>

//         <div style={{
//           fontSize: '10px', color: '#888', lineHeight: 1.5, marginBottom: '12px',
//         }}>
//           For property owners and buyers who need Dubai real estate intelligence.
//         </div>

//         {/* Price */}
//         {/* Price */}
// <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', marginBottom: '2px' }}>
//   <span style={{ fontSize: '11px', color: '#B87333', fontWeight: 900, marginBottom: '4px', letterSpacing: '0.05em' }}>AED</span>
//   <span style={{ fontSize: '32px', fontWeight: 900, color: '#B87333', lineHeight: 1 }}>29</span>
// </div>
//         <div style={{
//           fontSize: '9px', fontWeight: 700, color: '#B87333',
//           letterSpacing: '0.6px', marginBottom: '12px',
//         }}>
//           FIRST 3 MONTHS — 149/MO AFTER
//         </div>

//         {/* Features */}
//         <div style={{ marginBottom: '14px' }}>
//           {[
//             '10 TRUVALU™ AI Reports/Month',
//             'Full SIGNAL™ Terminal Access',
//             'PDF Reports & Shareable Links',
//             'Real-Time Market Signals',
//             'Cancel Anytime',
//           ].map(f => (
//             <div key={f} style={{
//               display: 'flex', alignItems: 'center', gap: '7px',
//               fontSize: '10px', color: '#DADADA', fontWeight: 600,
//               marginBottom: '5px',
//             }}>
//               <span style={{ color: '#B87333', fontSize: '10px' }}>✓</span>
//               {f}
//             </div>
//           ))}
//         </div>

//         {/* CTA */}
//         <a
//           href={PRICING_URL}
//           target="_blank"
//           rel="noopener noreferrer"
//           style={{
//             display: 'block', textAlign: 'center',
//             background: 'linear-gradient(135deg, #B87333 0%, #D4913F 100%)',
//             color: '#1A1A2E', fontWeight: 800, fontSize: '10px',
//             letterSpacing: '0.8px', padding: '10px 12px',
//             borderRadius: '7px', textDecoration: 'none',
//             marginBottom: '8px',
//             transition: 'opacity 0.15s',
//           }}
//           onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
//           onMouseLeave={e => e.currentTarget.style.opacity = '1'}
//         >
//           AVAIL FOUNDING MEMBER OFFER →
//         </a>

//         {/* Dismiss */}
//         <button
//           onClick={onClose}
//           style={{
//             display: 'block', width: '100%', textAlign: 'center',
//             background: 'none', border: 'none', cursor: 'pointer',
//             fontSize: '9px', fontWeight: 700, color: '#555',
//             letterSpacing: '0.5px', padding: '4px',
//           }}
//         >
//           MAYBE LATER
//         </button>
//       </div>
//     </>
//   )
// }

// // ─── Main Component ──────────────────────────────────────────────────────────
// export default function EventFeed({ plan = 'free' }) {
//  const { events, filteredEvents, isLoading, setSelectedEvent } = useEvents()
//   const feedRef = useRef(null)
//   const prevCountRef = useRef(0)
//   const [activeTab, setActiveTab] = useState('feed')
//   const [showProPopup, setShowProPopup] = useState(false)

//   const isFree = plan === 'free'

//   // Auto-scroll to top when new events arrive
//   useEffect(() => {
//     if (filteredEvents.length > prevCountRef.current && feedRef.current) {
//       feedRef.current.scrollTop = 0
//     }
//     prevCountRef.current = filteredEvents.length
//   }, [filteredEvents.length])

//   // Filter events based on active tab
//   const getTabEvents = () => {
//     const now = Date.now() / 1000
//     const thirtyMinutesAgo = now - 1800

//     switch (activeTab) {
//       case 'live':
//         return filteredEvents.filter(e => {
//           const eventTs = e.created_at_ts || new Date(e.created_at).getTime() / 1000
//           return eventTs >= thirtyMinutesAgo
//         })
//   case 'reports':
//   const allReports = events.filter(e => e.severity >= 4)
//   return allReports.slice(0, isFree ? 4 : allReports.length)
//       case 'feed':
//       default:
//         return filteredEvents
//     }
//   }

//   const tabEvents = getTabEvents()

//   // Counts
//   const now = Date.now() / 1000
//   const liveCount = filteredEvents.filter(e => {
//     const ts = e.created_at_ts || new Date(e.created_at).getTime() / 1000
//     return ts >= now - 1800
//   }).length
//   const reportsCount = isFree ? 4 : filteredEvents.filter(e => e.severity >= 4).length

//   // Handle Reports tab click for free users
//   const handleTabClick = (key) => {
//     if (key === 'reports' && isFree) {
//       setActiveTab('reports') // switch so they see the blur
//       setShowProPopup(true)
//       return
//     }
//     setActiveTab(key)
//     setShowProPopup(false)
//   }

//   if (isLoading) return (
//     <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3B3B3', fontSize: '13px' }}>
//       <div>⏳ Fetching live data...</div>
//     </div>
//   )

//   return (
//     <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden', position: 'relative' }}>

//       {/* ── Tab Bar ─────────────────────────────────────────────────────── */}
//       <div style={{ display: 'flex', borderBottom: '1px solid #0F3460', flexShrink: 0, background: '#16213E', alignItems: 'center' }}>
//         {[
//           { key: 'feed', label: 'FEED' },
//           { key: 'live', label: 'LIVE' },
//           { key: 'reports', label: 'REPORTS' },
//         ].map(tab => (
//           <button
//             key={tab.key}
//             onClick={() => handleTabClick(tab.key)}
//             style={{
//               flex: 1, padding: '8px 4px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px',
//               border: 'none', background: 'transparent', cursor: 'pointer',
//               color: activeTab === tab.key ? '#B87333' : '#555',
//               borderBottom: activeTab === tab.key ? '2px solid #B87333' : '2px solid transparent',
//               position: 'relative',
//             }}
//           >
//             {tab.key === 'live' && liveCount > 0 && (
//               <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', marginRight: 3 }}>
//                 <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#27AE60', animation: 'livePulse 2s infinite' }} />
//                 <span style={{ fontSize: '9px', fontWeight: 700, color: '#27AE60' }}>{liveCount}</span>
//               </span>
//             )}
//             {tab.label}
//             {/* Lock icon on REPORTS for free users */}
            
//             {tab.key === 'reports' && reportsCount > 0 && (
//               <span style={{ fontSize: '8px', fontWeight: 800, padding: '0 3px', background: '#E74C3C22', color: '#E74C3C', borderRadius: '3px', marginLeft: '2px' }}>
//                 {reportsCount}
//               </span>
//             )}
//           </button>
//         ))}
//         <div style={{ fontSize: '10px', color: '#B3B3B3', padding: '0 8px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
//           {tabEvents.length} events
//         </div>
//       </div>

//       {/* ── Content Area ────────────────────────────────────────────────── */}
//       {!tabEvents.length && !filteredEvents.length && (
//         <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3B3B3', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
//           <div>
//             <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
//             <div>No events match your filters</div>
//             <div style={{ fontSize: '11px', marginTop: '4px', color: '#666' }}>Try expanding the time range</div>
//           </div>
//         </div>
//       )}

//       {!tabEvents.length && filteredEvents.length > 0 && (
//         <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3B3B3', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
//           <div>
//             <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
//             <div>
//               {activeTab === 'live' && 'No events in the last 30 minutes'}
//               {activeTab === 'reports' && 'No high-severity reports in this time window. Try switching to 72H.'}
//               {activeTab === 'feed' && 'No events to display'}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── REPORTS TAB — with blur gate for free users ──────────────────── */}
//       {tabEvents.length > 0 && activeTab === 'reports' && (
//         <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

//           {/* Actual report cards (blurred when free) */}
//           <div
//             ref={feedRef}
//             style={{
//               height: '100%', overflowY: 'auto',
//               filter: isFree ? 'blur(4px)' : 'none',
//               pointerEvents: isFree ? 'none' : 'auto',
//               userSelect: isFree ? 'none' : 'auto',
//               transition: 'filter 0.2s',
//             }}
//           >
//             {tabEvents.map(event => (
//               <div
//                 key={event.id}
//                 style={{
//                   padding: '12px', borderBottom: '1px solid #0F3460', cursor: 'pointer',
//                   background: 'rgba(231,76,60,0.03)',
//                 }}
//                 onClick={() => setSelectedEvent(event)}
//               >
//                 <div style={{ display: 'flex', gap: '6px', marginBottom: '5px', alignItems: 'center' }}>
//                   <span style={{
//                     fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px',
//                     background: SEVERITY_COLORS[event.severity] + '22', color: SEVERITY_COLORS[event.severity],
//                   }}>⚠ S{event.severity}</span>
//                   <span style={{
//                     fontSize: '9px', fontWeight: 600, padding: '2px 5px', borderRadius: '3px',
//                     background: 'rgba(184,115,51,0.15)', color: '#B87333', textTransform: 'uppercase', letterSpacing: '0.3px',
//                   }}>{event.category?.replace('_', ' ')}</span>
//                   <span style={{ fontSize: '10px', color: '#555', marginLeft: 'auto' }}>{event.location_name}</span>
//                 </div>
//                 <div style={{ fontSize: '12px', fontWeight: 700, color: '#FAFAFA', lineHeight: 1.4, marginBottom: '4px' }}>{event.title}</div>
//                 <div style={{ fontSize: '11px', color: '#888', lineHeight: 1.5 }}>{event.summary?.slice(0, 120)}...</div>
//                 <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
//                   <span style={{ fontSize: '9px', color: '#B87333', fontWeight: 600 }}>via {event.source}</span>
//                   {event.url && (
//                     <a href={event.url} target="_blank" rel="noopener noreferrer"
//                       onClick={e => e.stopPropagation()}
//                       style={{ fontSize: '9px', color: '#2980B9', textDecoration: 'none', borderBottom: '1px dotted #2980B9', marginLeft: 'auto' }}>
//                       ↗ Source
//                     </a>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pricing popup overlay (only for free users) */}
//           {isFree && showProPopup && (
//             <ProUpgradePopup onClose={() => {
//               setShowProPopup(false)
//               setActiveTab('feed') // send them back to feed on dismiss
//             }} />
//           )}

//           {/* Teaser overlay when popup is closed but still on reports tab (free) */}
//           {isFree && !showProPopup && (
//             <div
//               onClick={() => setShowProPopup(true)}
//               style={{
//                 position: 'absolute', inset: 0,
//                 display: 'flex', flexDirection: 'column',
//                 alignItems: 'center', justifyContent: 'center',
//                 background: 'rgba(10,14,26,0.55)',
//                 cursor: 'pointer',
//                 zIndex: 10,
//               }}
//             >
//               <div style={{
//                 fontSize: '24px', marginBottom: '8px',
//               }}>🔒</div>
//               <div style={{
//                 fontSize: '12px', fontWeight: 700, color: '#FAFAFA',
//                 marginBottom: '4px',
//               }}>PRO Feature</div>
//               <div style={{
//                 fontSize: '10px', color: '#888', marginBottom: '12px', textAlign: 'center', padding: '0 24px',
//               }}>High-severity market reports require ACQAR PRO</div>
//               <div style={{
//                 fontSize: '10px', fontWeight: 700, color: '#B87333',
//                 border: '1px solid #B87333', borderRadius: '5px',
//                 padding: '5px 14px', letterSpacing: '0.5px',
//               }}>
//                 VIEW PLANS →
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── FEED & LIVE TABS ────────────────────────────────────────────── */}
//       {tabEvents.length > 0 && (activeTab === 'feed' || activeTab === 'live') && (
//         <div ref={feedRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
//           {tabEvents.map((event, i) => (
//             <EventCard key={event.id} event={event} isNew={i === 0} />
//           ))}
//         </div>
//       )}

//       <style>{`
//         @keyframes livePulse {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50% { opacity: 0.5; transform: scale(1.3); }
//         }
//       `}</style>
//     </div>
//   )
// }









// import { useEffect, useRef, useState } from 'react'
// import { useEvents } from '../context/EventsContext'
// import EventCard from './EventCard'
// import ReactDOM from 'react-dom'


// // ─── Plan config ────────────────────────────────────────────────────────────
// // Set this from your auth context / user state.
// // true  = free user  → Reports tab is locked
// // false = pro user   → Reports tab is fully accessible
// const PRICING_URL = 'https://www.acqar.com/pricing'

// // Replace this line with real auth context later:
// // const { plan } = useAuth()
// // For now expose it as a prop so parent can pass plan="free" | "pro"
// // ────────────────────────────────────────────────────────────────────────────

// const SEVERITY_COLORS = {
//   1: '#27AE60',
//   2: '#A8D44A',
//   3: '#F39C12',
//   4: '#E67E22',
//   5: '#E74C3C'
// }

// // ─── Pricing Popup ───────────────────────────────────────────────────────────

//     function ProUpgradePopup({ onClose }) {
//   // Mount to document.body so it escapes overflow:hidden parent
//   const [mounted, setMounted] = useState(false)
  
//   useEffect(() => {
//     setMounted(true)
//     document.body.style.overflow = 'hidden'
//     return () => { document.body.style.overflow = '' }
//   }, [])

//   if (!mounted) return null

//   return ReactDOM.createPortal(
//     <>
//       {/* Backdrop */}
//       <div
//         onClick={onClose}
//         style={{
//           position: 'fixed', inset: 0,
//           background: 'rgba(0,0,0,0.55)',
//           zIndex: 99999,
//         }}
//       />

//       {/* Card */}
//            <div className="pro-popup-card" style={{
//         position: 'fixed',
//         top: '50%', left: '50%',
//         transform: 'translate(-50%, -50%)',
//         zIndex: 100000,
//         width: 'min(420px, calc(100vw - 32px))',
//         maxHeight: '90dvh',
//         overflowY: 'auto',
//         WebkitOverflowScrolling: 'touch',
//         scrollbarWidth: 'none',
//         msOverflowStyle: 'none',
//         background: '#fff',
//         borderRadius: '20px',
//         padding: '28px 24px',
//         boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
//         fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
//         WebkitFontSmoothing: 'antialiased',
//       }}>
//         {/* Close */}
//         <button
//           onClick={onClose}
//           style={{
//             position: 'absolute', top: 14, right: 16,
//             background: 'none', border: 'none',
//             fontSize: 20, cursor: 'pointer', color: '#aaa',
//           }}
//         >✕</button>

//         {/* Founding badge */}
//         <div style={{
//           fontSize: 10, fontWeight: 900, color: '#B87333',
//           letterSpacing: '0.2em', textTransform: 'uppercase',
//           marginBottom: 12,
//         }}>
//           FOUNDING MEMBER OFFER
//         </div>

//         {/* Title */}
//         <h2 style={{
//           fontSize: 38, fontWeight: 900, fontStyle: 'italic',
//           letterSpacing: '-1px', textTransform: 'uppercase',
//           color: '#1a1a1a', lineHeight: 1,
//           margin: '0 0 10px 0',
//         }}>
//           ACQAR PRO
//         </h2>

//         {/* Description */}
//         <p style={{
//           fontSize: 13, color: '#666',
//           lineHeight: 1.6, fontWeight: 500,
//           margin: '0 0 20px 0',
//         }}>
//           For property owners and buyers who need Dubai real estate intelligence platform.
//         </p>

//         {/* Price */}
//         <div style={{
//           display: 'flex', alignItems: 'flex-end',
//           gap: 6, marginBottom: 8,
//         }}>
//           <span style={{
//             fontSize: 20, fontWeight: 900, color: '#B87333',
//             marginBottom: 6,
//           }}>
//             AED
//           </span>
//           <span style={{
//             fontSize: 48, fontWeight: 900,
//             color: '#B87333', letterSpacing: '-2px', lineHeight: 1,
//           }}>
//             29
//           </span>
//         </div>

//         {/* Price note */}
//         <div style={{
//           fontSize: 10, fontWeight: 900, color: '#B87333',
//           letterSpacing: '0.15em', textTransform: 'uppercase',
//           marginBottom: 28,
//         }}>
//           FIRST 3 MONTHS — 149/MO AFTER
//         </div>

//         {/* Features */}
//         <div style={{
//           display: 'flex', flexDirection: 'column',
//           gap: 8, marginBottom: 28,
//         }}>
//           {[
//             '10 TRUVALU™ AI Reports/Month',
//             'Full SIGNAL™ Terminal Access',
//             'PDF Reports & Shareable Links',
//             'Real-Time Market Signals',
//             'Cancel Anytime',
//           ].map(f => (
//             <div key={f} style={{
//               display: 'flex', alignItems: 'center',
//               gap: 10, fontSize: 12, fontWeight: 700, color: '#333',
//             }}>
//               <span style={{
//                 width: 18, height: 18, borderRadius: '50%',
//                 background: 'rgba(184,115,51,0.12)',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 flexShrink: 0,
//               }}>
//                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
//                   stroke="#B87333" strokeWidth="3"
//                   strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M20 6L9 17l-5-5"/>
//                 </svg>
//               </span>
//               {f}
//             </div>
//           ))}
//         </div>

//         {/* CTA Button */}
//        {/* CTA Button */}
//         <a
//           href={PRICING_URL}
//           target="_blank"
//           rel="noopener noreferrer"
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             gap: 8,
//             background: '#B87333',
//             color: '#fff',
//             borderRadius: '12px',
//             fontSize: 16,
//             fontWeight: 700,
//             letterSpacing: '0.02em',
//             padding: '16px 32px',
//             textDecoration: 'none',
//             marginBottom: 10,
//             boxShadow: '0 8px 32px rgba(184,115,51,0.30)',
//             transition: 'all 0.2s',
//             fontFamily: "'Inter', system-ui, sans-serif",
//             touchAction: 'manipulation',
//             WebkitTapHighlightColor: 'transparent',
//           }}
//           onMouseEnter={e => {
//             e.currentTarget.style.background = '#D4924A'
//             e.currentTarget.style.transform = 'translateY(-2px)'
//             e.currentTarget.style.boxShadow = '0 12px 40px rgba(184,115,51,0.40)'
//           }}
//           onMouseLeave={e => {
//             e.currentTarget.style.background = '#B87333'
//             e.currentTarget.style.transform = 'translateY(0)'
//             e.currentTarget.style.boxShadow = '0 8px 32px rgba(184,115,51,0.30)'
//           }}
//         >
//           CLAIM YOUR SPOT →
//         </a>
//         {/* Dismiss */}
//         {/* Dismiss */}
//         <button
//           onClick={onClose}
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             gap: 8,
//             width: '100%',
//             padding: '14px 24px',
//             background: 'transparent',
//             color: 'rgba(26,26,26,0.45)',
//             border: '1px solid rgba(26,26,26,0.15)',
//             borderRadius: '12px',
//             fontSize: 14,
//             fontWeight: 600,
//             cursor: 'pointer',
//             transition: 'all 0.2s',
//             fontFamily: "'Inter', system-ui, sans-serif",
//             touchAction: 'manipulation',
//             WebkitTapHighlightColor: 'transparent',
//           }}
//           onMouseEnter={e => {
//             e.currentTarget.style.color = '#1a1a1a'
//             e.currentTarget.style.borderColor = 'rgba(26,26,26,0.3)'
//           }}
//           onMouseLeave={e => {
//             e.currentTarget.style.color = 'rgba(26,26,26,0.45)'
//             e.currentTarget.style.borderColor = 'rgba(26,26,26,0.15)'
//           }}
//         >
//           Maybe Later
//         </button>

//       </div>
//     </>,
//     document.body
//   )
// }
  


// // ─── Main Component ──────────────────────────────────────────────────────────
// export default function EventFeed({ plan = 'free' }) {
//  const { events, filteredEvents, isLoading, setSelectedEvent } = useEvents()
//   const feedRef = useRef(null)
//   const prevCountRef = useRef(0)
//   const [activeTab, setActiveTab] = useState('feed')
//   const [showProPopup, setShowProPopup] = useState(false)

//   const isFree = plan === 'free'

//   // Auto-scroll to top when new events arrive
//   useEffect(() => {
//     if (filteredEvents.length > prevCountRef.current && feedRef.current) {
//       feedRef.current.scrollTop = 0
//     }
//     prevCountRef.current = filteredEvents.length
//   }, [filteredEvents.length])

//   // Filter events based on active tab
//   const getTabEvents = () => {
//     const now = Date.now() / 1000
//     const thirtyMinutesAgo = now - 1800

//     switch (activeTab) {
//       case 'live':
//         return filteredEvents.filter(e => {
//           const eventTs = e.created_at_ts || new Date(e.created_at).getTime() / 1000
//           return eventTs >= thirtyMinutesAgo
//         })
//   case 'reports':
//   const allReports = events.filter(e => e.severity >= 4)
//   return allReports.slice(0, isFree ? 4 : allReports.length)
//       case 'feed':
//       default:
//         return filteredEvents
//     }
//   }

//   const tabEvents = getTabEvents()

//   // Counts
//   const now = Date.now() / 1000
//   const liveCount = filteredEvents.filter(e => {
//     const ts = e.created_at_ts || new Date(e.created_at).getTime() / 1000
//     return ts >= now - 1800
//   }).length
//   const reportsCount = isFree ? 4 : filteredEvents.filter(e => e.severity >= 4).length

//   // Handle Reports tab click for free users
//   const handleTabClick = (key) => {
//     if (key === 'reports' && isFree) {
//       setActiveTab('reports') // switch so they see the blur
//       setShowProPopup(true)
//       return
//     }
//     setActiveTab(key)
//     setShowProPopup(false)
//   }

//   if (isLoading) return (
//     <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3B3B3', fontSize: '13px' }}>
//       <div>⏳ Fetching live data...</div>
//     </div>
//   )

//   return (
//     <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden', position: 'relative' }}>

//       {/* ── Tab Bar ─────────────────────────────────────────────────────── */}
//       <div style={{ display: 'flex', borderBottom: '1px solid #0F3460', flexShrink: 0, background: '#16213E', alignItems: 'center' }}>
//         {[
//           { key: 'feed', label: 'FEED' },
//           { key: 'live', label: 'LIVE' },
//           { key: 'reports', label: 'REPORTS' },
//         ].map(tab => (
//           <button
//             key={tab.key}
//             onClick={() => handleTabClick(tab.key)}
//             style={{
//               flex: 1, padding: '8px 4px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px',
//               border: 'none', background: 'transparent', cursor: 'pointer',
//               color: activeTab === tab.key ? '#B87333' : '#555',
//               borderBottom: activeTab === tab.key ? '2px solid #B87333' : '2px solid transparent',
//               position: 'relative',
//             }}
//           >
//             {tab.key === 'live' && liveCount > 0 && (
//               <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', marginRight: 3 }}>
//                 <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#27AE60', animation: 'livePulse 2s infinite' }} />
//                 <span style={{ fontSize: '9px', fontWeight: 700, color: '#27AE60' }}>{liveCount}</span>
//               </span>
//             )}
//             {tab.label}
//             {/* Lock icon on REPORTS for free users */}
            
//             {tab.key === 'reports' && reportsCount > 0 && (
//               <span style={{ fontSize: '8px', fontWeight: 800, padding: '0 3px', background: '#E74C3C22', color: '#E74C3C', borderRadius: '3px', marginLeft: '2px' }}>
//                 {reportsCount}
//               </span>
//             )}
//           </button>
//         ))}
//         <div style={{ fontSize: '10px', color: '#B3B3B3', padding: '0 8px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
//           {tabEvents.length} events
//         </div>
//       </div>

//       {/* ── Content Area ────────────────────────────────────────────────── */}
//       {!tabEvents.length && !filteredEvents.length && (
//         <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3B3B3', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
//           <div>
//             <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
//             <div>No events match your filters</div>
//             <div style={{ fontSize: '11px', marginTop: '4px', color: '#666' }}>Try expanding the time range</div>
//           </div>
//         </div>
//       )}

//       {!tabEvents.length && filteredEvents.length > 0 && (
//         <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3B3B3', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
//           <div>
//             <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
//             <div>
//               {activeTab === 'live' && 'No events in the last 30 minutes'}
//               {activeTab === 'reports' && 'No high-severity reports in this time window. Try switching to 72H.'}
//               {activeTab === 'feed' && 'No events to display'}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── REPORTS TAB — with blur gate for free users ──────────────────── */}
//       {tabEvents.length > 0 && activeTab === 'reports' && (
//         <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

//           {/* Actual report cards (blurred when free) */}
//           <div
//             ref={feedRef}
//             style={{
//               height: '100%', overflowY: 'auto',
//               filter: isFree ? 'blur(4px)' : 'none',
//               pointerEvents: isFree ? 'none' : 'auto',
//               userSelect: isFree ? 'none' : 'auto',
//               transition: 'filter 0.2s',
//             }}
//           >
//             {tabEvents.map(event => (
//               <div
//                 key={event.id}
//                 style={{
//                   padding: '12px', borderBottom: '1px solid #0F3460', cursor: 'pointer',
//                   background: 'rgba(231,76,60,0.03)',
//                 }}
//                 onClick={() => setSelectedEvent(event)}
//               >
//                 <div style={{ display: 'flex', gap: '6px', marginBottom: '5px', alignItems: 'center' }}>
//                   <span style={{
//                     fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px',
//                     background: SEVERITY_COLORS[event.severity] + '22', color: SEVERITY_COLORS[event.severity],
//                   }}>⚠ S{event.severity}</span>
//                   <span style={{
//                     fontSize: '9px', fontWeight: 600, padding: '2px 5px', borderRadius: '3px',
//                     background: 'rgba(184,115,51,0.15)', color: '#B87333', textTransform: 'uppercase', letterSpacing: '0.3px',
//                   }}>{event.category?.replace('_', ' ')}</span>
//                   <span style={{ fontSize: '10px', color: '#555', marginLeft: 'auto' }}>{event.location_name}</span>
//                 </div>
//                 <div style={{ fontSize: '12px', fontWeight: 700, color: '#FAFAFA', lineHeight: 1.4, marginBottom: '4px' }}>{event.title}</div>
//                 <div style={{ fontSize: '11px', color: '#888', lineHeight: 1.5 }}>{event.summary?.slice(0, 120)}...</div>
//                 <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
//                   <span style={{ fontSize: '9px', color: '#B87333', fontWeight: 600 }}>via {event.source}</span>
//                   {event.url && (
//                     <a href={event.url} target="_blank" rel="noopener noreferrer"
//                       onClick={e => e.stopPropagation()}
//                       style={{ fontSize: '9px', color: '#2980B9', textDecoration: 'none', borderBottom: '1px dotted #2980B9', marginLeft: 'auto' }}>
//                       ↗ Source
//                     </a>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pricing popup overlay (only for free users) */}
//           {isFree && showProPopup && (
//             <ProUpgradePopup onClose={() => {
//               setShowProPopup(false)
//               setActiveTab('feed') // send them back to feed on dismiss
//             }} />
//           )}

//           {/* Teaser overlay when popup is closed but still on reports tab (free) */}
//           {isFree && !showProPopup && (
//             <div
//               onClick={() => setShowProPopup(true)}
//               style={{
//                 position: 'absolute', inset: 0,
//                 display: 'flex', flexDirection: 'column',
//                 alignItems: 'center', justifyContent: 'center',
//                 background: 'rgba(10,14,26,0.55)',
//                 cursor: 'pointer',
//                 zIndex: 10,
//               }}
//             >
//               <div style={{
//                 fontSize: '24px', marginBottom: '8px',
//               }}>🔒</div>
//               <div style={{
//                 fontSize: '12px', fontWeight: 700, color: '#FAFAFA',
//                 marginBottom: '4px',
//               }}>PRO Feature</div>
//               <div style={{
//                 fontSize: '10px', color: '#888', marginBottom: '12px', textAlign: 'center', padding: '0 24px',
//               }}>High-severity market reports require ACQAR PRO</div>
//               <div style={{
//                 fontSize: '10px', fontWeight: 700, color: '#B87333',
//                 border: '1px solid #B87333', borderRadius: '5px',
//                 padding: '5px 14px', letterSpacing: '0.5px',
//               }}>
//                 VIEW PLANS →
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── FEED & LIVE TABS ────────────────────────────────────────────── */}
//       {tabEvents.length > 0 && (activeTab === 'feed' || activeTab === 'live') && (
//         <div ref={feedRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
//           {tabEvents.map((event, i) => (
//             <EventCard key={event.id} event={event} isNew={i === 0} />
//           ))}
//         </div>
//       )}

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

//         @keyframes livePulse {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50% { opacity: 0.5; transform: scale(1.3); }
//         }

//         .pro-popup-card::-webkit-scrollbar {
//           display: none;
//         }
//       `}</style>
//     </div>
//   )
// }










import { useEffect, useRef, useState } from 'react'
import { useEvents } from '../context/EventsContext'
import EventCard from './EventCard'
import ReactDOM from 'react-dom'


// ─── Plan config ────────────────────────────────────────────────────────────
// Set this from your auth context / user state.
// true  = free user  → Reports tab is locked
// false = pro user   → Reports tab is fully accessible
const PRICING_URL = 'https://www.acqar.com/pricing'

// Replace this line with real auth context later:
// const { plan } = useAuth()
// For now expose it as a prop so parent can pass plan="free" | "pro"
// ────────────────────────────────────────────────────────────────────────────

const SEVERITY_COLORS = {
  1: '#27AE60',
  2: '#A8D44A',
  3: '#F39C12',
  4: '#E67E22',
  5: '#E74C3C'
}

// ─── Pricing Popup ───────────────────────────────────────────────────────────

    function ProUpgradePopup({ onClose }) {
  // Mount to document.body so it escapes overflow:hidden parent
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!mounted) return null

  return ReactDOM.createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 99999,
        }}
      />

      {/* Card */}
           <div className="pro-popup-card" style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 100000,
        width: 'min(420px, calc(100vw - 32px))',
        maxHeight: '90dvh',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        background: '#fff',
        borderRadius: '20px',
        padding: '28px 24px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        WebkitFontSmoothing: 'antialiased',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 16,
            background: 'none', border: 'none',
            fontSize: 20, cursor: 'pointer', color: '#aaa',
          }}
        >✕</button>

        {/* Founding badge */}
        <div style={{
          fontSize: 10, fontWeight: 900, color: '#B87333',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          FOUNDING MEMBER OFFER
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 38, fontWeight: 900, fontStyle: 'italic',
          letterSpacing: '-1px', textTransform: 'uppercase',
          color: '#1a1a1a', lineHeight: 1,
          margin: '0 0 10px 0',
        }}>
          ACQAR PRO
        </h2>

        {/* Description */}
        <p style={{
          fontSize: 13, color: '#666',
          lineHeight: 1.6, fontWeight: 500,
          margin: '0 0 20px 0',
        }}>
          For property owners and buyers who need Dubai real estate intelligence platform.
        </p>

        {/* Price */}
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          gap: 6, marginBottom: 8,
        }}>
          <span style={{
            fontSize: 20, fontWeight: 900, color: '#B87333',
            marginBottom: 6,
          }}>
            AED
          </span>
          <span style={{
            fontSize: 48, fontWeight: 900,
            color: '#B87333', letterSpacing: '-2px', lineHeight: 1,
          }}>
            29
          </span>
        </div>

        {/* Price note */}
        <div style={{
          fontSize: 10, fontWeight: 900, color: '#B87333',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          marginBottom: 28,
        }}>
          FIRST 3 MONTHS — 149/MO AFTER
        </div>

        {/* Features */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          gap: 8, marginBottom: 28,
        }}>
          {[
            '10 TRUVALU™ AI Reports/Month',
            'Full SIGNAL™ Terminal Access',
            'PDF Reports & Shareable Links',
            'Real-Time Market Signals',
            'Cancel Anytime',
          ].map(f => (
            <div key={f} style={{
              display: 'flex', alignItems: 'center',
              gap: 10, fontSize: 12, fontWeight: 700, color: '#333',
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: '50%',
                background: 'rgba(184,115,51,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="#B87333" strokeWidth="3"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </span>
              {f}
            </div>
          ))}
        </div>

        {/* CTA Button */}
       {/* CTA Button */}
        <a
          href={PRICING_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: '#B87333',
            color: '#fff',
            borderRadius: '12px',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.02em',
            padding: '16px 32px',
            textDecoration: 'none',
            marginBottom: 10,
            boxShadow: '0 8px 32px rgba(184,115,51,0.30)',
            transition: 'all 0.2s',
            fontFamily: "'Inter', system-ui, sans-serif",
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#D4924A'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(184,115,51,0.40)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#B87333'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(184,115,51,0.30)'
          }}
        >
          CLAIM YOUR SPOT →
        </a>
        {/* Dismiss */}
        {/* Dismiss */}
        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            padding: '14px 24px',
            background: 'transparent',
            color: 'rgba(26,26,26,0.45)',
            border: '1px solid rgba(26,26,26,0.15)',
            borderRadius: '12px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: "'Inter', system-ui, sans-serif",
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#1a1a1a'
            e.currentTarget.style.borderColor = 'rgba(26,26,26,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(26,26,26,0.45)'
            e.currentTarget.style.borderColor = 'rgba(26,26,26,0.15)'
          }}
        >
          Maybe Later
        </button>

      </div>
    </>,
    document.body
  )
}
  


// ─── Main Component ──────────────────────────────────────────────────────────
export default function EventFeed({ plan = 'free' }) {
 const { events, filteredEvents, isLoading, setSelectedEvent } = useEvents()
  const feedRef = useRef(null)
  const prevCountRef = useRef(0)
  const [activeTab, setActiveTab] = useState('feed')
  const [showProPopup, setShowProPopup] = useState(false)

  const isFree = plan === 'free'

  // Auto-scroll to top when new events arrive
  useEffect(() => {
    if (filteredEvents.length > prevCountRef.current && feedRef.current) {
      feedRef.current.scrollTop = 0
    }
    prevCountRef.current = filteredEvents.length
  }, [filteredEvents.length])

  // Filter events based on active tab
  const getTabEvents = () => {
    const now = Date.now() / 1000
    const thirtyMinutesAgo = now - 1800

    switch (activeTab) {
      case 'live':
        return filteredEvents.filter(e => {
          const eventTs = e.created_at_ts || new Date(e.created_at).getTime() / 1000
          return eventTs >= thirtyMinutesAgo
        })
  case 'reports':
  const allReports = events.filter(e => e.severity >= 4)
  return allReports.slice(0, isFree ? 4 : allReports.length)
      case 'feed':
      default:
        return filteredEvents
    }
  }

  const tabEvents = getTabEvents()

  // Counts
  const now = Date.now() / 1000
  const liveCount = filteredEvents.filter(e => {
    const ts = e.created_at_ts || new Date(e.created_at).getTime() / 1000
    return ts >= now - 1800
  }).length
  const reportsCount = isFree ? 4 : filteredEvents.filter(e => e.severity >= 4).length

  // Handle Reports tab click for free users
  const handleTabClick = (key) => {
    if (key === 'reports' && isFree) {
      setActiveTab('reports') // switch so they see the blur
      setShowProPopup(true)
      return
    }
    setActiveTab(key)
    setShowProPopup(false)
  }

  if (isLoading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
      <div>⏳ Fetching live data...</div>
    </div>
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden', position: 'relative' }}>

      {/* ── Tab Bar ─────────────────────────────────────────────────────── */}
    <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', flexShrink: 0, background: 'var(--tab-bar-bg)', alignItems: 'center' }}>
        {[
          { key: 'feed', label: 'FEED' },
          { key: 'live', label: 'LIVE' },
          { key: 'reports', label: 'REPORTS' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            style={{
              flex: 1, padding: '8px 4px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px',
              border: 'none', background: 'transparent', cursor: 'pointer',
              color: activeTab === tab.key ? '#B87333' : 'var(--tab-inactive)',
              borderBottom: activeTab === tab.key ? '2px solid #B87333' : '2px solid transparent',
              position: 'relative',
            }}
          >
            {tab.key === 'live' && liveCount > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', marginRight: 3 }}>
                <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#27AE60', animation: 'livePulse 2s infinite' }} />
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#27AE60' }}>{liveCount}</span>
              </span>
            )}
            {tab.label}
            {/* Lock icon on REPORTS for free users */}
            
            {tab.key === 'reports' && reportsCount > 0 && (
              <span style={{ fontSize: '8px', fontWeight: 800, padding: '0 3px', background: '#E74C3C22', color: '#E74C3C', borderRadius: '3px', marginLeft: '2px' }}>
                {reportsCount}
              </span>
            )}
          </button>
        ))}
       <div style={{ fontSize: '10px', color: 'var(--text-muted)', padding: '0 8px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {tabEvents.length} events
        </div>
      </div>

      {/* ── Content Area ────────────────────────────────────────────────── */}
      {!tabEvents.length && !filteredEvents.length && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px'}}>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
            <div>No events match your filters</div>
            <div style={{ fontSize: '11px', marginTop: '4px', color: 'var(--text-muted)' }}>Try expanding the time range</div>
          </div>
        </div>
      )}

      {!tabEvents.length && filteredEvents.length > 0 && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3B3B3', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
            <div>
              {activeTab === 'live' && 'No events in the last 30 minutes'}
              {activeTab === 'reports' && 'No high-severity reports in this time window. Try switching to 72H.'}
              {activeTab === 'feed' && 'No events to display'}
            </div>
          </div>
        </div>
      )}

      {/* ── REPORTS TAB — with blur gate for free users ──────────────────── */}
      {tabEvents.length > 0 && activeTab === 'reports' && (
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

          {/* Actual report cards (blurred when free) */}
          <div
            ref={feedRef}
            style={{
              height: '100%', overflowY: 'auto',
              filter: isFree ? 'blur(4px)' : 'none',
              pointerEvents: isFree ? 'none' : 'auto',
              userSelect: isFree ? 'none' : 'auto',
              transition: 'filter 0.2s',
            }}
          >
            {tabEvents.map(event => (
              <div
                key={event.id}
               style={{
  padding: '12px', borderBottom: '1px solid var(--feed-border)', cursor: 'pointer',
  background: 'var(--row-hover)',
}}
                onClick={() => setSelectedEvent(event)}
              >
                <div style={{ display: 'flex', gap: '6px', marginBottom: '5px', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px',
                    background: SEVERITY_COLORS[event.severity] + '22', color: SEVERITY_COLORS[event.severity],
                  }}>⚠ S{event.severity}</span>
                  <span style={{
                    fontSize: '9px', fontWeight: 600, padding: '2px 5px', borderRadius: '3px',
                    background: 'rgba(184,115,51,0.15)', color: '#B87333', textTransform: 'uppercase', letterSpacing: '0.3px',
                  }}>{event.category?.replace('_', ' ')}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: 'auto' }}>{event.location_name}</span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--popup-text)', lineHeight: 1.4, marginBottom: '4px' }}>{event.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{event.summary?.slice(0, 120)}...</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '9px', color: '#B87333', fontWeight: 600 }}>via {event.source}</span>
                  {event.url && (
                    <a href={event.url} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{ fontSize: '9px', color: '#2980B9', textDecoration: 'none', borderBottom: '1px dotted #2980B9', marginLeft: 'auto' }}>
                      ↗ Source
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing popup overlay (only for free users) */}
          {isFree && showProPopup && (
            <ProUpgradePopup onClose={() => {
              setShowProPopup(false)
              setActiveTab('feed') // send them back to feed on dismiss
            }} />
          )}

          {/* Teaser overlay when popup is closed but still on reports tab (free) */}
          {isFree && !showProPopup && (
            <div
              onClick={() => setShowProPopup(true)}
              style={{
  position: 'absolute', inset: 0,
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center',
  background: 'var(--lock-overlay-bg)',
  cursor: 'pointer',
  zIndex: 10,
}}
            >
              <div style={{
                fontSize: '24px', marginBottom: '8px',
              }}>🔒</div>
              <div style={{
  fontSize: '12px', fontWeight: 700, color: 'var(--popup-text)',
  marginBottom: '4px',
}}>PRO Feature</div>
              <div style={{
  fontSize: '10px', color: 'var(--text-muted)', marginBottom: '12px', textAlign: 'center', padding: '0 24px',
}}>High-severity market reports require ACQAR PRO</div>
              <div style={{
                fontSize: '10px', fontWeight: 700, color: '#B87333',
                border: '1px solid #B87333', borderRadius: '5px',
                padding: '5px 14px', letterSpacing: '0.5px',
              }}>
                VIEW PLANS →
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── FEED & LIVE TABS ────────────────────────────────────────────── */}
      {tabEvents.length > 0 && (activeTab === 'feed' || activeTab === 'live') && (
        <div ref={feedRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {tabEvents.map((event, i) => (
            <EventCard key={event.id} event={event} isNew={i === 0} />
          ))}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }

        .pro-popup-card::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
