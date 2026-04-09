// import { useState, useEffect } from 'react'
// import { useEvents } from '../context/EventsContext'
// import Header from '../components/Header'
// import EventFeed from '../components/EventFeed'
// import MapView from '../components/MapView'
// import ChatPanel from '../components/ChatPanel'
// import FilterBar from '../components/FilterBar'
// import EventDetail from '../components/EventDetail'
// import OverlayPanel from '../components/OverlayPanel'


// // function useIsMobile() {
// //   const [isMobile, setIsMobile] = useState(
// //     () => window.matchMedia('(max-width: 767px)').matches
// //   )
// //   useEffect(() => {
// //     const mq = window.matchMedia('(max-width: 767px)')
// //     const handler = (e) => setIsMobile(e.matches)
// //     mq.addEventListener('change', handler)
// //     return () => mq.removeEventListener('change', handler)
// //   }, [])
// //   return isMobile
// // }

// function useIsMobile() {
//   const [isMobile, setIsMobile] = useState(

//     () => window.innerWidth <= 767
//   )


//   useEffect(() => {
//     const handler = () => setIsMobile(window.innerWidth <= 767)
//     window.addEventListener('resize', handler)
//     handler()
//     return () => window.removeEventListener('resize', handler)
//   }, [])
//   return isMobile
// }


// export default function Dashboard() {
//   const isMobile = useIsMobile()
//   const userPlan = useState(() => new URLSearchParams(window.location.search).get('plan') || 'free')[0]
  
//   const { setSelectedEvent, selectedEvent } = useEvents()
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

//   // When user taps an event, close the feed drawer so detail shows
//   useEffect(() => {
//     if (selectedEvent && mobileDrawer === 'feed') {
//       setMobileDrawer(null)
//     }
//   }, [selectedEvent])

//   // ── MOBILE ────────────────────────────────────────────────────────────────
//   // if (isMobile) {
//   if (isMobile || window.innerWidth <= 767) {
//     return (
//       <div style={{
//         width: '100%',
//         height: '100vh', // ✅ FIXED: was 100dvh, breaks on older Android
//         background: '#0D1B2A',
//         overflow: 'hidden',
//         position: 'relative',
//         display: 'flex',
//         flexDirection: 'column',
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
//                 zIndex: 998, // ✅ FIXED: was 50
//                 background: 'transparent',
//               }}
//             />
//           )}

//           <EventDetail hidden={mobileDrawer === 'chat'} onClose={() => setMobileDrawer('feed')} />

//           {/* Feed Drawer */}
//           <div style={{
//             position: 'absolute',
//             bottom: mobileDrawer === 'feed' ? 0 : '-110%',
//             left: 0, right: 0,
//             height: 'min(65%, 520px)',
//             minHeight: 260,
//             background: '#0D1B2A',
//             borderTop: '2px solid #B87333',
//             borderRadius: '16px 16px 0 0',
//             display: mobileDrawer === 'chat' ? 'none' : 'flex',
//             flexDirection: 'column',
//             overflow: 'hidden',
//             transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1)',
//             zIndex: 999,
//             boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
//           }}>
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
//             <EventFeed plan={userPlan} />
//           </div>


//           {/* Chat Drawer */}
//           {/* Chat Drawer */}
//           {mobileDrawer === 'chat' && (
//             <div style={{
//               position: 'absolute',
//               bottom: 0,
//               left: 0, right: 0,
//               height: 'min(75%, 620px)',
//               minHeight: 300,
//               background: '#111827',
//               borderTop: '2px solid #6366f1',
//               borderRadius: '16px 16px 0 0',
//               display: 'flex', flexDirection: 'column',
//               overflow: 'hidden',
//               zIndex: 1000,
//               boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
//             }}>
//               <ChatPanel onClose={() => setMobileDrawer(null)} />
//             </div>
//           )}


//           {/* Floating buttons */}
//           <div style={{
//             position: 'absolute', bottom: 16, left: 0, right: 0,
//             display: mobileDrawer !== null ? 'none' : 'flex',
//             justifyContent: 'space-between',
//             paddingLeft: 16, paddingRight: 16,
//             zIndex: 50, // ✅ FIXED: was 40
//           }}>
//             <button
//               onClick={() => { setSelectedEvent(null); setMobileDrawer('feed'); }}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: '6px',
//                 padding: '10px 20px', background: 'rgba(13,27,42,0.95)',
//                 border: '1px solid #0F3460', borderRadius: '24px',
//                 color: '#FAFAFA', fontSize: '13px', fontWeight: 600,
//                 cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
//                 backdropFilter: 'blur(10px)', touchAction: 'manipulation',
//                 WebkitTapHighlightColor: 'transparent',
//                 userSelect: 'none',        // ✅ ADDED
//                 WebkitUserSelect: 'none',  // ✅ ADDED
//               }}
//             ><span>☰</span> Feed</button>

//             <button
//               onClick={() => setMobileDrawer('chat')}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: '6px',
//                 padding: '10px 20px', background: 'rgba(99,102,241,0.15)',
//                 border: '1px solid #6366f1', borderRadius: '24px',
//                 color: '#a5b4fc', fontSize: '13px', fontWeight: 600,
//                 cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
//                 backdropFilter: 'blur(10px)', touchAction: 'manipulation',
//                 WebkitTapHighlightColor: 'transparent',
//                 userSelect: 'none',
//                 WebkitUserSelect: 'none',
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
//             <EventFeed plan={userPlan} />
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



// // function useIsMobile() {
// //   const [isMobile, setIsMobile] = useState(
// //     () => window.matchMedia('(max-width: 767px)').matches
// //   )
// //   useEffect(() => {
// //     const mq = window.matchMedia('(max-width: 767px)')
// //     const handler = (e) => setIsMobile(e.matches)
// //     mq.addEventListener('change', handler)
// //     return () => mq.removeEventListener('change', handler)
// //   }, [])
// //   return isMobile
// // }

// function useIsMobile() {
//   const [isMobile, setIsMobile] = useState(

//     () => window.innerWidth <= 767
//   )


//   useEffect(() => {
//     const handler = () => setIsMobile(window.innerWidth <= 767)
//     window.addEventListener('resize', handler)
//     handler()
//     return () => window.removeEventListener('resize', handler)
//   }, [])
//   return isMobile
// }


// export default function Dashboard() {
//   const isMobile = useIsMobile()
//   const userPlan = useState(() => new URLSearchParams(window.location.search).get('plan') || 'free')[0]
  
//   const { setSelectedEvent, selectedEvent } = useEvents()
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

//   // When user taps an event, close the feed drawer so detail shows
//   useEffect(() => {
//     if (selectedEvent && mobileDrawer === 'feed') {
//       setMobileDrawer(null)
//     }
//   }, [selectedEvent])

//   // ── MOBILE ────────────────────────────────────────────────────────────────
//   // if (isMobile) {
//   if (isMobile || window.innerWidth <= 767) {
//     return (
//       <div style={{
//         width: '100%',
//         height: '100vh', // ✅ FIXED: was 100dvh, breaks on older Android
//         background: '#0D1B2A',
//         overflow: 'hidden',
//         position: 'relative',
//         display: 'flex',
//         flexDirection: 'column',
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
//                 zIndex: 998, // ✅ FIXED: was 50
//                 background: 'transparent',
//               }}
//             />
//           )}

//           <EventDetail hidden={mobileDrawer === 'chat'} onClose={() => setMobileDrawer('feed')} />

//           {/* Feed Drawer */}
//           <div style={{
//             position: 'absolute',
//             bottom: mobileDrawer === 'feed' ? 0 : '-110%',
//             left: 0, right: 0,
//             height: 'min(65%, 520px)',
//             minHeight: 260,
//             background: '#0D1B2A',
//             borderTop: '2px solid #B87333',
//             borderRadius: '16px 16px 0 0',
//             display: mobileDrawer === 'chat' ? 'none' : 'flex',
//             flexDirection: 'column',
//             overflow: 'hidden',
//             transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1)',
//             zIndex: 999,
//             boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
//           }}>
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
//             <EventFeed plan={userPlan} />
//           </div>


//           {/* Chat Drawer */}
//           {/* Chat Drawer */}
//           {mobileDrawer === 'chat' && (
//             <div style={{
//               position: 'absolute',
//               bottom: 0,
//               left: 0, right: 0,
//               height: 'min(75%, 620px)',
//               minHeight: 300,
//               background: '#111827',
//               borderTop: '2px solid #6366f1',
//               borderRadius: '16px 16px 0 0',
//               display: 'flex', flexDirection: 'column',
//               overflow: 'hidden',
//               zIndex: 1000,
//               boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
//             }}>
             
//               <ChatPanel onClose={() => setMobileDrawer(null)} />
//             </div>
//           )}


//           {/* Floating buttons */}
//           <div style={{
//             position: 'absolute', bottom: 16, left: 0, right: 0,
//             display: mobileDrawer !== null ? 'none' : 'flex',
//             justifyContent: 'space-between',
//             paddingLeft: 16, paddingRight: 16,
//             zIndex: 50, // ✅ FIXED: was 40
//           }}>
//             <button
//               onClick={() => { setSelectedEvent(null); setMobileDrawer('feed'); }}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: '6px',
//                 padding: '10px 20px', background: 'rgba(13,27,42,0.95)',
//                 border: '1px solid #0F3460', borderRadius: '24px',
//                 color: '#FAFAFA', fontSize: '13px', fontWeight: 600,
//                 cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
//                 backdropFilter: 'blur(10px)', touchAction: 'manipulation',
//                 WebkitTapHighlightColor: 'transparent',
//                 userSelect: 'none',        // ✅ ADDED
//                 WebkitUserSelect: 'none',  // ✅ ADDED
//               }}
//             ><span>☰</span> Feed</button>

//             <button
//               onClick={() => setMobileDrawer('chat')}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: '6px',
//                 padding: '10px 20px', background: 'rgba(99,102,241,0.15)',
//                 border: '1px solid #6366f1', borderRadius: '24px',
//                 color: '#a5b4fc', fontSize: '13px', fontWeight: 600,
//                 cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
//                 backdropFilter: 'blur(10px)', touchAction: 'manipulation',
//                 WebkitTapHighlightColor: 'transparent',
//                 userSelect: 'none',
//                 WebkitUserSelect: 'none',
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
//             <EventFeed plan={userPlan} />
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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(

    () => window.innerWidth <= 767
  )


  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 767)
    window.addEventListener('resize', handler)
    handler()
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}


export default function Dashboard() {
  const isMobile = useIsMobile()
  const userPlan = useState(() => new URLSearchParams(window.location.search).get('plan') || 'free')[0]
  
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
  // if (isMobile) {
  if (isMobile || window.innerWidth <= 767) {
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
            display: mobileDrawer === 'chat' ? 'none' : 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1)',
            zIndex: 999,
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
            <EventFeed plan={userPlan} />
          </div>


          {/* Chat Drawer */}
          {/* Chat Drawer */}
          {mobileDrawer === 'chat' && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0, right: 0,
              height: 'min(75%, 620px)',
              minHeight: 300,
              background: '#111827',
              borderTop: '2px solid #6366f1',
              borderRadius: '16px 16px 0 0',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 1000,
              boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
            }}>
             
              <ChatPanel onClose={() => setMobileDrawer(null)} userPlan={userPlan} />
            </div>
          )}


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

            <button
              onClick={() => setMobileDrawer('chat')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px', background: 'rgba(99,102,241,0.15)',
                border: '1px solid #6366f1', borderRadius: '24px',
                color: '#a5b4fc', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)', touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
            ><span>💬</span> Chat</button>
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
            <EventFeed plan={userPlan} />
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
           
            <ChatPanel onClose={() => setChatOpen(false)} userPlan={userPlan} />
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
