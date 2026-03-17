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





import { useState, useEffect } from 'react'
import Header from '../components/Header'
import EventFeed from '../components/EventFeed'
import MapView from '../components/MapView'
import ChatPanel from '../components/ChatPanel'
import FilterBar from '../components/FilterBar'
import EventDetail from '../components/EventDetail'
import OverlayPanel from '../components/OverlayPanel'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export default function Dashboard() {
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)
  const isMobile = useIsMobile()

  // Mobile: which drawer is open — null | 'feed' | 'chat'
  const [mobileDrawer, setMobileDrawer] = useState(null)

  const toggleDrawer = (name) => setMobileDrawer(prev => prev === name ? null : name)

  // ── MOBILE LAYOUT ──────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{
        width: '100%', height: '100dvh',
        background: '#0D1B2A', overflow: 'hidden',
        position: 'relative', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <Header />

        {/* Map always fullscreen underneath */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <MapView />
          <OverlayPanel />
          <EventDetail />

          {/* Feed Drawer — slides up from bottom left */}
          <div style={{
            position: 'absolute',
            bottom: mobileDrawer === 'feed' ? 0 : '-100%',
            left: 0, right: 0,
            height: '65%',
            background: '#0D1B2A',
            borderTop: '1px solid #0F3460',
            borderRadius: '14px 14px 0 0',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1)',
            zIndex: 50,
            boxShadow: '0 -8px 32px rgba(0,0,0,0.6)',
          }}>
            {/* Drawer handle */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 16px 6px',
              borderBottom: '1px solid #0F3460', flexShrink: 0,
            }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#B87333', letterSpacing: '1px' }}>◆ FEED</span>
              <button
                onClick={() => setMobileDrawer(null)}
                style={{ background: 'none', border: 'none', color: '#555', fontSize: '16px', cursor: 'pointer', padding: '0 4px' }}
              >✕</button>
            </div>
            <FilterBar />
            <EventFeed />
          </div>

          {/* Chat Drawer — slides up from bottom right */}
          <div style={{
            position: 'absolute',
            bottom: mobileDrawer === 'chat' ? 0 : '-100%',
            left: 0, right: 0,
            height: '65%',
            background: '#16213E',
            borderTop: '1px solid #0F3460',
            borderRadius: '14px 14px 0 0',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1)',
            zIndex: 50,
            boxShadow: '0 -8px 32px rgba(0,0,0,0.6)',
          }}>
            {/* Drawer handle */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 16px 6px',
              borderBottom: '1px solid #0F3460', flexShrink: 0,
            }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#B87333', letterSpacing: '1px' }}>◆ LIVE CHAT</span>
              <button
                onClick={() => setMobileDrawer(null)}
                style={{ background: 'none', border: 'none', color: '#555', fontSize: '16px', cursor: 'pointer', padding: '0 4px' }}
              >✕</button>
            </div>
            <ChatPanel />
          </div>

          {/* Floating bottom buttons — Feed (left) + Chat (right) */}
          {mobileDrawer === null && (
            <div style={{
              position: 'absolute', bottom: 16, left: 0, right: 0,
              display: 'flex', justifyContent: 'space-between',
              paddingLeft: 16, paddingRight: 16,
              zIndex: 40, pointerEvents: 'none',
            }}>
              {/* Feed button */}
              <button
                onClick={() => toggleDrawer('feed')}
                style={{
                  pointerEvents: 'all',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '9px 18px',
                  background: 'rgba(13,27,42,0.92)',
                  border: '1px solid #0F3460',
                  borderRadius: '24px',
                  color: '#FAFAFA', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span style={{ fontSize: '14px' }}>☰</span> Feed
              </button>

              {/* Chat button */}
              <button
                onClick={() => toggleDrawer('chat')}
                style={{
                  pointerEvents: 'all',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '9px 18px',
                  background: 'rgba(13,27,42,0.92)',
                  border: '1px solid #0F3460',
                  borderRadius: '24px',
                  color: '#FAFAFA', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span style={{ fontSize: '14px' }}>💬</span> Chat
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── DESKTOP LAYOUT (unchanged) ─────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full h-screen bg-dark overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Event Feed */}
        <div
          className={`flex-none transition-all duration-300 ${leftCollapsed ? 'w-0' : 'w-80'} overflow-hidden border-r border-border`}
          style={{ position: 'relative' }}
        >
          <div className="w-80 h-full flex flex-col">
            <FilterBar />
            <EventFeed />
          </div>
          <EventDetail />
        </div>

        {/* Collapse Toggle Left */}
        <button
          onClick={() => setLeftCollapsed(!leftCollapsed)}
          className="flex-none w-5 bg-panel hover:bg-border border-r border-border flex items-center justify-center text-text-secondary hover:text-copper transition-colors z-10"
          title={leftCollapsed ? 'Show feed' : 'Hide feed'}
        >
          <span className="text-xs" style={{ writingMode: 'vertical-rl' }}>{leftCollapsed ? '›' : '‹'}</span>
        </button>

        {/* Map */}
        <div className="flex-1 relative overflow-hidden">
          <MapView />
          <OverlayPanel />
        </div>

        {/* Collapse Toggle Right */}
        <button
          onClick={() => setRightCollapsed(!rightCollapsed)}
          className="flex-none w-5 bg-panel hover:bg-border border-l border-border flex items-center justify-center text-text-secondary hover:text-copper transition-colors z-10"
          title={rightCollapsed ? 'Show chat' : 'Hide chat'}
        >
          <span className="text-xs" style={{ writingMode: 'vertical-rl' }}>{rightCollapsed ? '‹' : '›'}</span>
        </button>

        {/* Right Panel - Chat */}
        <div className={`flex-none transition-all duration-300 ${rightCollapsed ? 'w-0' : 'w-72'} overflow-hidden border-l border-border`}>
          <div className="w-72 h-full flex flex-col">
            <ChatPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
