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





import { useState } from 'react'
import Header from '../components/Header'
import EventFeed from '../components/EventFeed'
import MapView from '../components/MapView'
import ChatPanel from '../components/ChatPanel'
import FilterBar from '../components/FilterBar'
import EventDetail from '../components/EventDetail'
import OverlayPanel from '../components/OverlayPanel'

// Hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useState(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  })
  return isMobile
}

export default function Dashboard() {
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)
  const isMobile = useIsMobile()

  // Mobile active tab: 'map' | 'feed' | 'chat'
  const [mobileTab, setMobileTab] = useState('map')

  // ── MOBILE LAYOUT ──────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100dvh', background: '#0D1B2A', overflow: 'hidden' }}>
        <Header />

        {/* Content area */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>

          {/* MAP TAB */}
          <div style={{ display: mobileTab === 'map' ? 'block' : 'none', width: '100%', height: '100%', position: 'relative' }}>
            <MapView />
            <OverlayPanel />
            <EventDetail />
          </div>

          {/* FEED TAB */}
          <div style={{ display: mobileTab === 'feed' ? 'flex' : 'none', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
            <FilterBar />
            <EventFeed />
            <EventDetail />
          </div>

          {/* CHAT TAB */}
          <div style={{ display: mobileTab === 'chat' ? 'flex' : 'none', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
            <ChatPanel />
          </div>

        </div>

        {/* Bottom Tab Bar */}
        <div style={{
          display: 'flex', flexShrink: 0,
          borderTop: '1px solid #0F3460',
          background: '#0A1628',
          height: 52,
        }}>
          {[
            { key: 'map', icon: '🗺️', label: 'Map' },
            { key: 'feed', icon: '📡', label: 'Feed' },
            { key: 'chat', icon: '💬', label: 'Chat' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setMobileTab(tab.key)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '2px',
                background: 'none', border: 'none', cursor: 'pointer',
                borderTop: mobileTab === tab.key ? '2px solid #B87333' : '2px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '18px' }}>{tab.icon}</span>
              <span style={{
                fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px',
                color: mobileTab === tab.key ? '#B87333' : '#444',
              }}>{tab.label}</span>
            </button>
          ))}
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
