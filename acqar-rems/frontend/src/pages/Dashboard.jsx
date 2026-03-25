// import { useState } from 'react'
// import Header from '../components/Header'
// import EventFeed from '../components/EventFeed'
// import MapView from '../components/MapView'
// import ChatPanel from '../components/ChatPanel'
// import FilterBar from '../components/FilterBar'
// import EventDetail from '../components/EventDetail'
// import OverlayPanel from '../components/OverlayPanel'

// export default function Dashboard() {
//   const [leftCollapsed, setLeftCollapsed] = useState(false)
//   const [rightCollapsed, setRightCollapsed] = useState(false)

//   return (
//     <div className="flex flex-col w-full h-screen bg-dark overflow-hidden">
//       <Header />

//       <div className="flex flex-1 overflow-hidden">
//         {/* Left Panel - Event Feed */}
//         <div className={`flex-none transition-all duration-300 ${leftCollapsed ? 'w-0' : 'w-80'} overflow-hidden border-r border-border`}
//           style={{ position: 'relative' }}>
//           <div className="w-80 h-full flex flex-col">
//             <FilterBar />
//             <EventFeed />
//           </div>
//           {/* Event Detail Panel - slides up from bottom */}
//           <EventDetail />
//         </div>

//         {/* Collapse Toggle Left */}
//         <button
//           onClick={() => setLeftCollapsed(!leftCollapsed)}
//           className="flex-none w-5 bg-panel hover:bg-border border-r border-border flex items-center justify-center text-text-secondary hover:text-copper transition-colors z-10"
//           title={leftCollapsed ? 'Show feed' : 'Hide feed'}
//         >
//           <span className="text-xs" style={{writingMode: 'vertical-rl'}}>{leftCollapsed ? '›' : '‹'}</span>
//         </button>

//         {/* Map - takes remaining space */}
//         <div className="flex-1 relative overflow-hidden">
//           <MapView />
//           <OverlayPanel />
//         </div>

//         {/* Collapse Toggle Right */}
//         <button
//           onClick={() => setRightCollapsed(!rightCollapsed)}
//           className="flex-none w-5 bg-panel hover:bg-border border-l border-border flex items-center justify-center text-text-secondary hover:text-copper transition-colors z-10"
//           title={rightCollapsed ? 'Show chat' : 'Hide chat'}
//         >
//           <span className="text-xs" style={{writingMode: 'vertical-rl'}}>{rightCollapsed ? '‹' : '›'}</span>
//         </button>

//         {/* Right Panel - Chat Only */}
//         <div className={`flex-none transition-all duration-300 ${rightCollapsed ? 'w-0' : 'w-72'} overflow-hidden border-l border-border`}>
//           <div className="w-72 h-full flex flex-col">
//             <ChatPanel />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }





// import { useState, useEffect } from 'react'
// import Header from '../components/Header'
// import EventFeed from '../components/EventFeed'
// import MapView from '../components/MapView'
// import ChatPanel from '../components/ChatPanel'
// import FilterBar from '../components/FilterBar'
// import EventDetail from '../components/EventDetail'
// import OverlayPanel from '../components/OverlayPanel'

// function useIsMobile() {
//   const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
//   useEffect(() => {
//     const handler = () => setIsMobile(window.innerWidth < 768)
//     window.addEventListener('resize', handler)
//     return () => window.removeEventListener('resize', handler)
//   }, [])
//   return isMobile
// }

// export default function Dashboard() {
//   const [leftCollapsed, setLeftCollapsed] = useState(false)
//   const [rightCollapsed, setRightCollapsed] = useState(false)
//   const isMobile = useIsMobile()

//   // Mobile: which drawer is open — null | 'feed' | 'chat'
//   const [mobileDrawer, setMobileDrawer] = useState(null)

//   const toggleDrawer = (name) => setMobileDrawer(prev => prev === name ? null : name)

//   // ── MOBILE LAYOUT ──────────────────────────────────────────────────────────
//   if (isMobile) {
//     return (
//       <div style={{
//         width: '100%', height: '100dvh',
//         background: '#0D1B2A', overflow: 'hidden',
//         position: 'relative', display: 'flex', flexDirection: 'column',
//       }}>
//         {/* Header */}
//         <Header />

//         {/* Map always fullscreen underneath */}
//         <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
//           <MapView />
//           <OverlayPanel />
//           <EventDetail />

//           {/* Feed Drawer — slides up from bottom left */}
//           <div style={{
//             position: 'absolute',
//             bottom: mobileDrawer === 'feed' ? 0 : '-100%',
//             left: 0, right: 0,
//             height: '65%',
//             background: '#0D1B2A',
//             borderTop: '1px solid #0F3460',
//             borderRadius: '14px 14px 0 0',
//             display: 'flex', flexDirection: 'column',
//             overflow: 'hidden',
//             transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1)',
//             zIndex: 50,
//             boxShadow: '0 -8px 32px rgba(0,0,0,0.6)',
//           }}>
//             {/* Drawer handle */}
//             <div style={{
//               display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//               padding: '10px 16px 6px',
//               borderBottom: '1px solid #0F3460', flexShrink: 0,
//             }}>
//               <span style={{ fontSize: '11px', fontWeight: 800, color: '#B87333', letterSpacing: '1px' }}>◆ FEED</span>
//               <button
//                 onClick={() => setMobileDrawer(null)}
//                 style={{ background: 'none', border: 'none', color: '#555', fontSize: '16px', cursor: 'pointer', padding: '0 4px' }}
//               >✕</button>
//             </div>
//             <FilterBar />
//             <EventFeed />
//           </div>

//           {/* Chat Drawer — slides up from bottom right */}
//           <div style={{
//             position: 'absolute',
//             bottom: mobileDrawer === 'chat' ? 0 : '-100%',
//             left: 0, right: 0,
//             height: '65%',
//             background: '#16213E',
//             borderTop: '1px solid #0F3460',
//             borderRadius: '14px 14px 0 0',
//             display: 'flex', flexDirection: 'column',
//             overflow: 'hidden',
//             transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1)',
//             zIndex: 50,
//             boxShadow: '0 -8px 32px rgba(0,0,0,0.6)',
//           }}>
//             {/* Drawer handle */}
//             <div style={{
//               display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//               padding: '10px 16px 6px',
//               borderBottom: '1px solid #0F3460', flexShrink: 0,
//             }}>
//               <span style={{ fontSize: '11px', fontWeight: 800, color: '#B87333', letterSpacing: '1px' }}>◆ LIVE CHAT</span>
//               <button
//                 onClick={() => setMobileDrawer(null)}
//                 style={{ background: 'none', border: 'none', color: '#555', fontSize: '16px', cursor: 'pointer', padding: '0 4px' }}
//               >✕</button>
//             </div>
//             <ChatPanel />
//           </div>

//           {/* Floating bottom buttons — Feed (left) + Chat (right) */}
//           {mobileDrawer === null && (
//             <div style={{
//               position: 'absolute', bottom: 16, left: 0, right: 0,
//               display: 'flex', justifyContent: 'space-between',
//               paddingLeft: 16, paddingRight: 16,
//               zIndex: 40, pointerEvents: 'none',
//             }}>
//               {/* Feed button */}
//               <button
//                 onClick={() => toggleDrawer('feed')}
//                 style={{
//                   pointerEvents: 'all',
//                   display: 'flex', alignItems: 'center', gap: '6px',
//                   padding: '9px 18px',
//                   background: 'rgba(13,27,42,0.92)',
//                   border: '1px solid #0F3460',
//                   borderRadius: '24px',
//                   color: '#FAFAFA', fontSize: '13px', fontWeight: 600,
//                   cursor: 'pointer',
//                   boxShadow: '0 2px 16px rgba(0,0,0,0.5)',
//                   backdropFilter: 'blur(8px)',
//                 }}
//               >
//                 <span style={{ fontSize: '14px' }}>☰</span> Feed
//               </button>

//               {/* Chat button */}
//               <button
//                 onClick={() => toggleDrawer('chat')}
//                 style={{
//                   pointerEvents: 'all',
//                   display: 'flex', alignItems: 'center', gap: '6px',
//                   padding: '9px 18px',
//                   background: 'rgba(13,27,42,0.92)',
//                   border: '1px solid #0F3460',
//                   borderRadius: '24px',
//                   color: '#FAFAFA', fontSize: '13px', fontWeight: 600,
//                   cursor: 'pointer',
//                   boxShadow: '0 2px 16px rgba(0,0,0,0.5)',
//                   backdropFilter: 'blur(8px)',
//                 }}
//               >
//                 <span style={{ fontSize: '14px' }}>💬</span> Chat
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     )
//   }

//   // ── DESKTOP LAYOUT (unchanged) ─────────────────────────────────────────────
//   return (
//     <div className="flex flex-col w-full h-screen bg-dark overflow-hidden">
//       <Header />
//       <div className="flex flex-1 overflow-hidden">
//         {/* Left Panel - Event Feed */}
//         <div
//           className={`flex-none transition-all duration-300 ${leftCollapsed ? 'w-0' : 'w-80'} overflow-hidden border-r border-border`}
//           style={{ position: 'relative' }}
//         >
//           <div className="w-80 h-full flex flex-col">
//             <FilterBar />
//             <EventFeed />
//           </div>
//           <EventDetail />
//         </div>

//         {/* Collapse Toggle Left */}
//         <button
//           onClick={() => setLeftCollapsed(!leftCollapsed)}
//           className="flex-none w-5 bg-panel hover:bg-border border-r border-border flex items-center justify-center text-text-secondary hover:text-copper transition-colors z-10"
//           title={leftCollapsed ? 'Show feed' : 'Hide feed'}
//         >
//           <span className="text-xs" style={{ writingMode: 'vertical-rl' }}>{leftCollapsed ? '›' : '‹'}</span>
//         </button>

//         {/* Map */}
//         <div className="flex-1 relative overflow-hidden">
//           <MapView />
//           <OverlayPanel />
//         </div>

//         {/* Collapse Toggle Right */}
//         <button
//           onClick={() => setRightCollapsed(!rightCollapsed)}
//           className="flex-none w-5 bg-panel hover:bg-border border-l border-border flex items-center justify-center text-text-secondary hover:text-copper transition-colors z-10"
//           title={rightCollapsed ? 'Show chat' : 'Hide chat'}
//         >
//           <span className="text-xs" style={{ writingMode: 'vertical-rl' }}>{rightCollapsed ? '‹' : '›'}</span>
//         </button>

//         {/* Right Panel - Chat */}
//         <div className={`flex-none transition-all duration-300 ${rightCollapsed ? 'w-0' : 'w-72'} overflow-hidden border-l border-border`}>
//           <div className="w-72 h-full flex flex-col">
//             <ChatPanel />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }





// import { useState, useEffect } from 'react'
// import Header from '../components/Header'
// import EventFeed from '../components/EventFeed'
// import MapView from '../components/MapView'
// import ChatPanel from '../components/ChatPanel'
// import FilterBar from '../components/FilterBar'
// import EventDetail from '../components/EventDetail'
// import OverlayPanel from '../components/OverlayPanel'

// function useIsMobile() {
//   const [isMobile, setIsMobile] = useState(
//     () => window.matchMedia('(max-width: 767px)').matches
//   )
//   useEffect(() => {
//     const mq = window.matchMedia('(max-width: 767px)')
//     const handler = (e) => setIsMobile(e.matches)
//     mq.addEventListener('change', handler)
//     return () => mq.removeEventListener('change', handler)
//   }, [])
//   return isMobile
// }

// export default function Dashboard() {
//   const isMobile = useIsMobile()
//   const [leftCollapsed, setLeftCollapsed] = useState(false)
//   const [chatOpen, setChatOpen] = useState(false) // always false on init, desktop opens via useEffect
//   const [mobileDrawer, setMobileDrawer] = useState(null)

//   // Open chat by default on desktop only
//   useEffect(() => {
//     if (!isMobile) setChatOpen(true)
//   }, [isMobile])

//   // Close drawer when switching from mobile to desktop
//   useEffect(() => {
//     if (!isMobile) setMobileDrawer(null)
//   }, [isMobile])

//   // ── MOBILE ────────────────────────────────────────────────────────────────
//   if (isMobile) {
//     return (
//       <div style={{
//         width: '100%', height: '100dvh',
//         background: '#0D1B2A', overflow: 'hidden',
//         position: 'relative', display: 'flex', flexDirection: 'column',
//       }}>
//         <Header />
//         <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
//           <MapView />
//           {/* OverlayPanel removed on mobile */}
//           <EventDetail />

//           {/* Feed Drawer */}
//           <div style={{
//             position: 'absolute',
//             bottom: mobileDrawer === 'feed' ? 0 : '-110%',
//             left: 0, right: 0, height: '65%',
//             background: '#0D1B2A',
//             borderTop: '2px solid #B87333',
//             borderRadius: '16px 16px 0 0',
//             display: 'flex', flexDirection: 'column',
//             overflow: 'hidden',
//             transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1)',
//             zIndex: 110,
//             boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
//           }}>
//             <div style={{
//               display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//               padding: '12px 16px 8px', borderBottom: '1px solid #0F3460', flexShrink: 0,
//             }}>
//               <span style={{ fontSize: '11px', fontWeight: 800, color: '#B87333', letterSpacing: '1px' }}>◆ FEED</span>
//               <button
//                 onClick={() => setMobileDrawer(null)}
//                 style={{
//                   width: 36, height: 36, background: '#1f2937',
//                   border: '1px solid #374151', borderRadius: '6px',
//                   color: '#f9fafb', cursor: 'pointer', fontSize: '16px',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                   touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
//                 }}
//               >✕</button>
//             </div>
//             <FilterBar />
//             <EventFeed />
//           </div>

//           {/* Chat Drawer */}
//           <div style={{
//             position: 'absolute',
//             bottom: mobileDrawer === 'chat' ? 0 : '-110%',
//             left: 0, right: 0, height: '72%',
//             background: '#0D1B2A',
//             borderTop: '2px solid #B87333',
//             borderRadius: '16px 16px 0 0',
//             display: 'flex', flexDirection: 'column',
//             overflow: 'hidden',
//             transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1)',
//             zIndex: 110,
//             boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
//           }}>
//             <ChatPanel onClose={() => setMobileDrawer(null)} />
//           </div>

//           {/* Floating buttons */}
//           <div style={{
//             position: 'absolute', bottom: 16, left: 0, right: 0,
//             display: mobileDrawer !== null ? 'none' : 'flex',
//             justifyContent: 'space-between',
//             paddingLeft: 16, paddingRight: 16,
//             zIndex: 40,
//           }}>
//             <button
//               onClick={() => setMobileDrawer('feed')}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: '6px',
//                 padding: '10px 20px', background: 'rgba(13,27,42,0.95)',
//                 border: '1px solid #0F3460', borderRadius: '24px',
//                 color: '#FAFAFA', fontSize: '13px', fontWeight: 600,
//                 cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
//                 backdropFilter: 'blur(10px)', touchAction: 'manipulation',
//                 WebkitTapHighlightColor: 'transparent',
//               }}
//             ><span>☰</span> Feed</button>

//             <button
//               onClick={() => setMobileDrawer('chat')}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: '6px',
//                 padding: '10px 20px', background: 'rgba(13,27,42,0.95)',
//                 border: '1px solid #0F3460', borderRadius: '24px',
//                 color: '#FAFAFA', fontSize: '13px', fontWeight: 600,
//                 cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
//                 backdropFilter: 'blur(10px)', touchAction: 'manipulation',
//                 WebkitTapHighlightColor: 'transparent',
//               }}
//             ><span>💬</span> Chat</button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // ── DESKTOP ───────────────────────────────────────────────────────────────
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', overflow: 'hidden' }}>
//       <Header />
//       <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

//         <div style={{
//           flexShrink: 0, width: leftCollapsed ? 0 : 320,
//           overflow: 'hidden', borderRight: '1px solid #0F3460',
//           transition: 'width 0.3s', position: 'relative',
//         }}>
//           <div style={{ width: 320, height: '100%', display: 'flex', flexDirection: 'column' }}>
//             <FilterBar />
//             <EventFeed />
//           </div>
//           <EventDetail />
//         </div>

//         <button
//           onClick={() => setLeftCollapsed(!leftCollapsed)}
//           style={{
//             flexShrink: 0, width: 20,
//             background: '#16213E', border: 'none', borderRight: '1px solid #0F3460',
//             color: '#666', cursor: 'pointer', fontSize: '12px',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//           }}
//         >
//           <span style={{ writingMode: 'vertical-rl' }}>{leftCollapsed ? '›' : '‹'}</span>
//         </button>

//         <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
//           <MapView />
//           <OverlayPanel />
//         </div>

//         {chatOpen ? (
//           <div style={{ flexShrink: 0, width: 340, borderLeft: '1px solid #0F3460', display: 'flex', flexDirection: 'column' }}>
//             <ChatPanel onClose={() => setChatOpen(false)} />
//           </div>
//         ) : (
//           <button
//             onClick={() => setChatOpen(true)}
//             style={{
//               flexShrink: 0, width: 36, background: '#111827',
//               borderLeft: '1px solid #1f2937', border: 'none',
//               color: '#6366f1', cursor: 'pointer',
//               display: 'flex', flexDirection: 'column',
//               alignItems: 'center', justifyContent: 'center', gap: '6px',
//             }}
//             title="Open chat"
//           >
//             <span style={{ fontSize: '16px' }}>💬</span>
//             <span style={{ fontSize: '9px', fontWeight: 700, color: '#6366f1', writingMode: 'vertical-rl', letterSpacing: '1px' }}>CHAT</span>
//           </button>
//         )}
//       </div>
//     </div>
//   )
// }



// import { useState, useEffect } from 'react'
// import Header from '../components/Header'
// import EventFeed from '../components/EventFeed'
// import MapView from '../components/MapView'
// import ChatPanel from '../components/ChatPanel'
// import FilterBar from '../components/FilterBar'
// import EventDetail from '../components/EventDetail'
// import OverlayPanel from '../components/OverlayPanel'

// function useIsMobile() {
//   const [isMobile, setIsMobile] = useState(
//     () => window.matchMedia('(max-width: 767px)').matches
//   )
//   useEffect(() => {
//     const mq = window.matchMedia('(max-width: 767px)')
//     const handler = (e) => setIsMobile(e.matches)
//     mq.addEventListener('change', handler)
//     return () => mq.removeEventListener('change', handler)
//   }, [])
//   return isMobile
// }

// export default function Dashboard() {
//   const isMobile = useIsMobile()
//   const [leftCollapsed, setLeftCollapsed] = useState(false)
//   const [chatOpen, setChatOpen] = useState(false)
//   const [mobileDrawer, setMobileDrawer] = useState(null)

//   useEffect(() => {
//     if (!isMobile) {
//       setChatOpen(true)
//     } else {
//       setChatOpen(false)
//       setMobileDrawer(null)
//     }
//   }, [isMobile])

//   useEffect(() => {
//     if (!isMobile) setMobileDrawer(null)
//   }, [isMobile])

//   // ── MOBILE ────────────────────────────────────────────────────────────────
//   if (isMobile) {
//     return (
//       <div style={{
//         width: '100%', height: '100dvh',
//         background: '#0D1B2A', overflow: 'hidden',
//         position: 'relative', display: 'flex', flexDirection: 'column',
//         touchAction: 'manipulation',
//       }}>
//         <Header />
//         <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

//           {/* Unmount MapView when chat is open so MapLibre can't intercept touches */}
//           {mobileDrawer !== 'chat' ? <MapView /> : (
//             <div style={{ position: 'absolute', inset: 0, background: '#0D1B2A' }} />
//           )}

//           {/* Blocks MapLibre touch events when feed is open */}
//           {mobileDrawer === 'feed' && (
//             <div
//               onTouchStart={(e) => e.stopPropagation()}
//               onTouchMove={(e) => e.stopPropagation()}
//               onTouchEnd={(e) => e.stopPropagation()}
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 position: 'absolute',
//                 top: 0, left: 0, right: 0, bottom: 0,
//                 zIndex: 50,
//                 background: 'transparent',
//               }}
//             />
//           )}

//           <EventDetail hidden={mobileDrawer === 'chat'} />

//           {/* Feed Drawer */}
//           {/* <div style={{
//             position: 'absolute',
//             bottom: mobileDrawer === 'feed' ? 0 : '-110%',
//             left: 0, right: 0, height: '65%',
//             background: '#0D1B2A',
//             borderTop: '2px solid #B87333',
//             borderRadius: '16px 16px 0 0',
//             display: 'flex', flexDirection: 'column',
//             overflow: 'hidden',
//             transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1)',
//             zIndex: 110,
//             boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
//           }}> */}
//           <div style={{
//   position: 'absolute',
//   bottom: mobileDrawer === 'feed' ? 0 : '-110%',
//   left: 0, right: 0,
//   height: 'min(65%, 520px)',        // ← caps height on tall phones
//   minHeight: 260,                    // ← never too small
//   background: '#0D1B2A',
//   borderTop: '2px solid #B87333',
//   borderRadius: '16px 16px 0 0',
//   display: 'flex', flexDirection: 'column',
//   overflow: 'hidden',
//   transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1)',
//   zIndex: 110,
//   boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
// }}>
//             <div style={{
//               display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//               padding: '12px 16px 8px', borderBottom: '1px solid #0F3460', flexShrink: 0,
//             }}>
//               <span style={{ fontSize: '11px', fontWeight: 800, color: '#B87333', letterSpacing: '1px' }}>◆ FEED</span>
//               <button
//                 onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); setMobileDrawer(null); }}
//                 onTouchStart={(e) => { e.stopPropagation(); e.preventDefault(); setMobileDrawer(null); }}
//                 onClick={(e) => { e.stopPropagation(); e.preventDefault(); setMobileDrawer(null); }}
//                 style={{
//                   width: 44, height: 44, background: '#1f2937',
//                   border: '1px solid #374151', borderRadius: '6px',
//                   color: '#f9fafb', cursor: 'pointer', fontSize: '18px',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                   touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
//                   userSelect: 'none', WebkitUserSelect: 'none',
//                 }}
//               >✕</button>
//             </div>
//             <FilterBar />
//             <EventFeed />
//           </div>

//           {/* Chat Drawer */}
//           {/* <div style={{
//             position: 'absolute',
//             bottom: mobileDrawer === 'chat' ? 0 : '-110%',
//             left: 0, right: 0, height: '72%',
//             background: '#0D1B2A',
//             borderTop: '2px solid #B87333',
//             borderRadius: '16px 16px 0 0',
//             display: 'flex', flexDirection: 'column',
//             overflow: 'hidden',
//             transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1)',
//             zIndex: 150,
//             boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
//             pointerEvents: mobileDrawer === 'chat' ? 'auto' : 'none',
//             touchAction: 'manipulation',
//           }}>
//             <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
//               <ChatPanel onClose={() => setMobileDrawer(null)} />
//             </div>
//           </div> */}

//           {/* Floating buttons */}
//           <div style={{
//             position: 'absolute', bottom: 16, left: 0, right: 0,
//             display: mobileDrawer !== null ? 'none' : 'flex',
//             justifyContent: 'space-between',
//             paddingLeft: 16, paddingRight: 16,
//             zIndex: 40,
//           }}>
//             <button
//               onClick={() => setMobileDrawer('feed')}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: '6px',
//                 padding: '10px 20px', background: 'rgba(13,27,42,0.95)',
//                 border: '1px solid #0F3460', borderRadius: '24px',
//                 color: '#FAFAFA', fontSize: '13px', fontWeight: 600,
//                 cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
//                 backdropFilter: 'blur(10px)', touchAction: 'manipulation',
//                 WebkitTapHighlightColor: 'transparent',
//               }}
//             ><span>☰</span> Feed</button>

//             {/* <button
//               onClick={() => setMobileDrawer('chat')}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: '6px',
//                 padding: '10px 20px', background: 'rgba(13,27,42,0.95)',
//                 border: '1px solid #0F3460', borderRadius: '24px',
//                 color: '#FAFAFA', fontSize: '13px', fontWeight: 600,
//                 cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
//                 backdropFilter: 'blur(10px)', touchAction: 'manipulation',
//                 WebkitTapHighlightColor: 'transparent',
//               }}
//             ><span>💬</span> Chat</button> */}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // ── DESKTOP ───────────────────────────────────────────────────────────────
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', overflow: 'hidden' }}>
//       <Header />
//       <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

//         <div style={{
//           flexShrink: 0, width: leftCollapsed ? 0 : 320,
//           overflow: 'hidden', borderRight: '1px solid #0F3460',
//           transition: 'width 0.3s', position: 'relative',
//         }}>
//           <div style={{ width: 320, height: '100%', display: 'flex', flexDirection: 'column' }}>
//             <FilterBar />
//             <EventFeed />
//           </div>
//           <EventDetail />
//         </div>

//         <button
//           onClick={() => setLeftCollapsed(!leftCollapsed)}
//           style={{
//             flexShrink: 0, width: 20,
//             background: '#16213E', border: 'none', borderRight: '1px solid #0F3460',
//             color: '#666', cursor: 'pointer', fontSize: '12px',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//           }}
//         >
//           <span style={{ writingMode: 'vertical-rl' }}>{leftCollapsed ? '›' : '‹'}</span>
//         </button>

//         <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
//           <MapView />
//           <OverlayPanel />
//         </div>

//         {chatOpen ? (
//           <div style={{ flexShrink: 0, width: 340, borderLeft: '1px solid #0F3460', display: 'flex', flexDirection: 'column' }}>
//             <ChatPanel onClose={() => setChatOpen(false)} />
//           </div>
//         ) : (
//           <button
//             onClick={() => setChatOpen(true)}
//             style={{
//               flexShrink: 0, width: 36, background: '#111827',
//               borderLeft: '1px solid #1f2937', border: 'none',
//               color: '#6366f1', cursor: 'pointer',
//               display: 'flex', flexDirection: 'column',
//               alignItems: 'center', justifyContent: 'center', gap: '6px',
//             }}
//             title="Open chat"
//           >
//             <span style={{ fontSize: '16px' }}>💬</span>
//             <span style={{ fontSize: '9px', fontWeight: 700, color: '#6366f1', writingMode: 'vertical-rl', letterSpacing: '1px' }}>CHAT</span>
//           </button>
//         )}
//       </div>
//     </div>
//   )
// }


// import { useState, useEffect } from 'react'
// import { useEvents } from '../context/EventsContext'
// import Header from '../components/Header'
// import EventFeed from '../components/EventFeed'
// import MapView from '../components/MapView'
// import ChatPanel from '../components/ChatPanel'
// import FilterBar from '../components/FilterBar'
// import EventDetail from '../components/EventDetail'
// import OverlayPanel from '../components/OverlayPanel'


// function useIsMobile() {
//   const [isMobile, setIsMobile] = useState(
//     () => window.matchMedia('(max-width: 767px)').matches
//   )
//   useEffect(() => {
//     const mq = window.matchMedia('(max-width: 767px)')
//     const handler = (e) => setIsMobile(e.matches)
//     mq.addEventListener('change', handler)
//     return () => mq.removeEventListener('change', handler)
//   }, [])
//   return isMobile
// }

// export default function Dashboard() {
//   const isMobile = useIsMobile()
//   const { setSelectedEvent,selectedEvent } = useEvents()
//   const [leftCollapsed, setLeftCollapsed] = useState(false)
//   const [chatOpen, setChatOpen] = useState(false)
//   const [mobileDrawer, setMobileDrawer] = useState(null)
  

//   useEffect(() => {
//     if (!isMobile) {
//       setChatOpen(true)
//     } else {
//       setChatOpen(false)
//       setMobileDrawer(null)
//     }
//   }, [isMobile])

//   // useEffect(() => {
//   //   if (!isMobile) setMobileDrawer(null)
//   // }, [isMobile])

//   useEffect(() => {
//   if (!isMobile) setMobileDrawer(null)
// }, [isMobile])

// // ✅ When user taps an event, close the feed drawer so detail shows
// useEffect(() => {
//   if (selectedEvent && mobileDrawer === 'feed') {
//     setMobileDrawer(null)
//   }
// }, [selectedEvent])

//   // ── MOBILE ────────────────────────────────────────────────────────────────
//   if (isMobile) {
//     return (
//       <div style={{
//         width: '100%', height: '100dvh',
//         background: '#0D1B2A', overflow: 'hidden',
//         position: 'relative', display: 'flex', flexDirection: 'column',
//         touchAction: 'manipulation',
//       }}>
//         <Header />
//         <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

//           {/* Unmount MapView when chat is open so MapLibre can't intercept touches */}
//           {mobileDrawer !== 'chat' ? <MapView /> : (
//             <div style={{ position: 'absolute', inset: 0, background: '#0D1B2A' }} />
//           )}

//           {/* Blocks MapLibre touch events when feed is open */}
//           {mobileDrawer === 'feed' && (
//             <div
//               onTouchStart={(e) => e.stopPropagation()}
//               onTouchMove={(e) => e.stopPropagation()}
//               onTouchEnd={(e) => e.stopPropagation()}
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 position: 'absolute',
//                 top: 0, left: 0, right: 0, bottom: 0,
//                 zIndex: 50,
//                 background: 'transparent',
//               }}
//             />
//           )}

//          <EventDetail hidden={mobileDrawer === 'chat'} onClose={() => setMobileDrawer('feed')} />

//           {/* Feed Drawer */}
//           {/* <div style={{
//             position: 'absolute',
//             bottom: mobileDrawer === 'feed' ? 0 : '-110%',
//             left: 0, right: 0, height: '65%',
//             background: '#0D1B2A',
//             borderTop: '2px solid #B87333',
//             borderRadius: '16px 16px 0 0',
//             display: 'flex', flexDirection: 'column',
//             overflow: 'hidden',
//             transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1)',
//             zIndex: 110,
//             boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
//           }}> */}
//           <div style={{
//   position: 'absolute',
//   bottom: mobileDrawer === 'feed' ? 0 : '-110%',
//   left: 0, right: 0,
//   height: 'min(65%, 520px)',        // ← caps height on tall phones
//   minHeight: 260,                    // ← never too small
//   background: '#0D1B2A',
//   borderTop: '2px solid #B87333',
//   borderRadius: '16px 16px 0 0',
//   display: 'flex', flexDirection: 'column',
//   overflow: 'hidden',
//   transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1)',
//   zIndex: 110,
//   boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
// }}>
//             <div style={{
//               display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//               padding: '12px 16px 8px', borderBottom: '1px solid #0F3460', flexShrink: 0,
//             }}>
//               <span style={{ fontSize: '11px', fontWeight: 800, color: '#B87333', letterSpacing: '1px' }}>◆ FEED</span>
//               <button
//                 onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); setMobileDrawer(null); }}
//                 onTouchStart={(e) => { e.stopPropagation(); e.preventDefault(); setMobileDrawer(null); }}
//                 onClick={(e) => { e.stopPropagation(); e.preventDefault(); setMobileDrawer(null); }}
//                 style={{
//                   width: 44, height: 44, background: '#1f2937',
//                   border: '1px solid #374151', borderRadius: '6px',
//                   color: '#f9fafb', cursor: 'pointer', fontSize: '18px',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                   touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
//                   userSelect: 'none', WebkitUserSelect: 'none',
//                 }}
//               >✕</button>
//             </div>
//             <FilterBar />
//             <EventFeed />
//           </div>

//           {/* Chat Drawer */}
//           {/* <div style={{
//             position: 'absolute',
//             bottom: mobileDrawer === 'chat' ? 0 : '-110%',
//             left: 0, right: 0, height: '72%',
//             background: '#0D1B2A',
//             borderTop: '2px solid #B87333',
//             borderRadius: '16px 16px 0 0',
//             display: 'flex', flexDirection: 'column',
//             overflow: 'hidden',
//             transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1)',
//             zIndex: 150,
//             boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
//             pointerEvents: mobileDrawer === 'chat' ? 'auto' : 'none',
//             touchAction: 'manipulation',
//           }}>
//             <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
//               <ChatPanel onClose={() => setMobileDrawer(null)} />
//             </div>
//           </div> */}

//           {/* Floating buttons */}
//           <div style={{
//             position: 'absolute', bottom: 16, left: 0, right: 0,
//             display: mobileDrawer !== null ? 'none' : 'flex',
//             justifyContent: 'space-between',
//             paddingLeft: 16, paddingRight: 16,
//             zIndex: 40,
//           }}>
//             <button
//               // onClick={() => setMobileDrawer('feed')}
//               onClick={() => { setSelectedEvent(null); setMobileDrawer('feed'); }}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: '6px',
//                 padding: '10px 20px', background: 'rgba(13,27,42,0.95)',
//                 border: '1px solid #0F3460', borderRadius: '24px',
//                 color: '#FAFAFA', fontSize: '13px', fontWeight: 600,
//                 cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
//                 backdropFilter: 'blur(10px)', touchAction: 'manipulation',
//                 WebkitTapHighlightColor: 'transparent',
//               }}
//             ><span>☰</span> Feed</button>

//             {/* <button
//               onClick={() => setMobileDrawer('chat')}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: '6px',
//                 padding: '10px 20px', background: 'rgba(13,27,42,0.95)',
//                 border: '1px solid #0F3460', borderRadius: '24px',
//                 color: '#FAFAFA', fontSize: '13px', fontWeight: 600,
//                 cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
//                 backdropFilter: 'blur(10px)', touchAction: 'manipulation',
//                 WebkitTapHighlightColor: 'transparent',
//               }}
//             ><span>💬</span> Chat</button> */}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // ── DESKTOP ───────────────────────────────────────────────────────────────
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', overflow: 'hidden' }}>
//       <Header />
//       <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

//         <div style={{
//           flexShrink: 0, width: leftCollapsed ? 0 : 320,
//           overflow: 'hidden', borderRight: '1px solid #0F3460',
//           transition: 'width 0.3s', position: 'relative',
//         }}>
//           <div style={{ width: 320, height: '100%', display: 'flex', flexDirection: 'column' }}>
//             <FilterBar />
//             <EventFeed />
//           </div>
//           <EventDetail />
//         </div>

//         <button
//           onClick={() => setLeftCollapsed(!leftCollapsed)}
//           style={{
//             flexShrink: 0, width: 20,
//             background: '#16213E', border: 'none', borderRight: '1px solid #0F3460',
//             color: '#666', cursor: 'pointer', fontSize: '12px',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//           }}
//         >
//           <span style={{ writingMode: 'vertical-rl' }}>{leftCollapsed ? '›' : '‹'}</span>
//         </button>

//         <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
//           <MapView />
//           <OverlayPanel />
//         </div>

//         {chatOpen ? (
//           <div style={{ flexShrink: 0, width: 340, borderLeft: '1px solid #0F3460', display: 'flex', flexDirection: 'column' }}>
//             <ChatPanel onClose={() => setChatOpen(false)} />
//           </div>
//         ) : (
//           <button
//             onClick={() => setChatOpen(true)}
//             style={{
//               flexShrink: 0, width: 36, background: '#111827',
//               borderLeft: '1px solid #1f2937', border: 'none',
//               color: '#6366f1', cursor: 'pointer',
//               display: 'flex', flexDirection: 'column',
//               alignItems: 'center', justifyContent: 'center', gap: '6px',
//             }}
//             title="Open chat"
//           >
//             <span style={{ fontSize: '16px' }}>💬</span>
//             <span style={{ fontSize: '9px', fontWeight: 700, color: '#6366f1', writingMode: 'vertical-rl', letterSpacing: '1px' }}>CHAT</span>
//           </button>
//         )}
//       </div>
//     </div>
//   )
// }







import { useState, useEffect } from 'react'
import { useEvents } from '../context/EventsContext'
import Header from '../components/Header'
import EventFeed from '../components/EventFeed'
import MapView from '../components/MapView'
import ChatPanel from '../components/ChatPanel'
import FilterBar from '../components/FilterBar'
import EventDetail from '../components/EventDetail'
import OverlayPanel from '../components/OverlayPanel'


function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 767px)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

export default function Dashboard() {
  const isMobile = useIsMobile()
  const { setSelectedEvent, selectedEvent } = useEvents()
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [mobileDrawer, setMobileDrawer] = useState(null)

  useEffect(() => {
    if (!isMobile) {
      setChatOpen(true)
    } else {
      setChatOpen(false)
      setMobileDrawer(null)
    }
  }, [isMobile])

  useEffect(() => {
    if (!isMobile) setMobileDrawer(null)
  }, [isMobile])

  // When user taps an event, close the feed drawer so detail shows
  useEffect(() => {
    if (selectedEvent && mobileDrawer === 'feed') {
      setMobileDrawer(null)
    }
  }, [selectedEvent])

  // ── MOBILE ────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{
        width: '100%',
        height: '100vh', // ✅ FIXED: was 100dvh, breaks on older Android
        background: '#0D1B2A',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        touchAction: 'manipulation',
      }}>
        <Header />
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

          {/* Unmount MapView when chat is open so MapLibre can't intercept touches */}
          {mobileDrawer !== 'chat' ? <MapView /> : (
            <div style={{ position: 'absolute', inset: 0, background: '#0D1B2A' }} />
          )}

          {/* Blocks MapLibre touch events when feed is open */}
          {mobileDrawer === 'feed' && (
            <div
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 998, // ✅ FIXED: was 50
                background: 'transparent',
              }}
            />
          )}

          <EventDetail hidden={mobileDrawer === 'chat'} onClose={() => setMobileDrawer('feed')} />

          {/* Feed Drawer */}
          <div style={{
            position: 'absolute',
            bottom: mobileDrawer === 'feed' ? 0 : '-110%',
            left: 0, right: 0,
            height: 'min(65%, 520px)',
            minHeight: 260,
            background: '#0D1B2A',
            borderTop: '2px solid #B87333',
            borderRadius: '16px 16px 0 0',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1)',
            zIndex: 999, // ✅ FIXED: was 110
            boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px 8px', borderBottom: '1px solid #0F3460', flexShrink: 0,
            }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#B87333', letterSpacing: '1px' }}>◆ FEED</span>
              <button
                onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); setMobileDrawer(null); }}
                onTouchStart={(e) => { e.stopPropagation(); e.preventDefault(); setMobileDrawer(null); }}
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); setMobileDrawer(null); }}
                style={{
                  width: 44, height: 44, background: '#1f2937',
                  border: '1px solid #374151', borderRadius: '6px',
                  color: '#f9fafb', cursor: 'pointer', fontSize: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                  userSelect: 'none', WebkitUserSelect: 'none',
                }}
              >✕</button>
            </div>
            <FilterBar />
            <EventFeed />
          </div>

          {/* Floating buttons */}
          <div style={{
            position: 'absolute', bottom: 16, left: 0, right: 0,
            display: mobileDrawer !== null ? 'none' : 'flex',
            justifyContent: 'space-between',
            paddingLeft: 16, paddingRight: 16,
            zIndex: 50, // ✅ FIXED: was 40
          }}>
            <button
              onClick={() => { setSelectedEvent(null); setMobileDrawer('feed'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px', background: 'rgba(13,27,42,0.95)',
                border: '1px solid #0F3460', borderRadius: '24px',
                color: '#FAFAFA', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)', touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none',        // ✅ ADDED
                WebkitUserSelect: 'none',  // ✅ ADDED
              }}
            ><span>☰</span> Feed</button>
          </div>

        </div>
      </div>
    )
  }

  // ── DESKTOP ───────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        <div style={{
          flexShrink: 0, width: leftCollapsed ? 0 : 320,
          overflow: 'hidden', borderRight: '1px solid #0F3460',
          transition: 'width 0.3s', position: 'relative',
        }}>
          <div style={{ width: 320, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <FilterBar />
            <EventFeed />
          </div>
          <EventDetail />
        </div>

        <button
          onClick={() => setLeftCollapsed(!leftCollapsed)}
          style={{
            flexShrink: 0, width: 20,
            background: '#16213E', border: 'none', borderRight: '1px solid #0F3460',
            color: '#666', cursor: 'pointer', fontSize: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ writingMode: 'vertical-rl' }}>{leftCollapsed ? '›' : '‹'}</span>
        </button>

        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <MapView />
          <OverlayPanel />
        </div>

        {chatOpen ? (
          <div style={{ flexShrink: 0, width: 340, borderLeft: '1px solid #0F3460', display: 'flex', flexDirection: 'column' }}>
            <ChatPanel onClose={() => setChatOpen(false)} />
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            style={{
              flexShrink: 0, width: 36, background: '#111827',
              borderLeft: '1px solid #1f2937', border: 'none',
              color: '#6366f1', cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
            title="Open chat"
          >
            <span style={{ fontSize: '16px' }}>💬</span>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#6366f1', writingMode: 'vertical-rl', letterSpacing: '1px' }}>CHAT</span>
          </button>
        )}
      </div>
    </div>
  )
}
