import { useState } from 'react'
import Header from '../components/Header'
import EventFeed from '../components/EventFeed'
import MapView from '../components/MapView'
import ChatPanel from '../components/ChatPanel'
import FilterBar from '../components/FilterBar'
import EventDetail from '../components/EventDetail'
import OverlayPanel from '../components/OverlayPanel'

export default function Dashboard() {
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)

  return (
    <div className="flex flex-col w-full h-screen bg-dark overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Event Feed */}
        <div className={`flex-none transition-all duration-300 ${leftCollapsed ? 'w-0' : 'w-80'} overflow-hidden border-r border-border`}
          style={{ position: 'relative' }}>
          <div className="w-80 h-full flex flex-col">
            <FilterBar />
            <EventFeed />
          </div>
          {/* Event Detail Panel - slides up from bottom */}
          <EventDetail />
        </div>

        {/* Collapse Toggle Left */}
        <button
          onClick={() => setLeftCollapsed(!leftCollapsed)}
          className="flex-none w-5 bg-panel hover:bg-border border-r border-border flex items-center justify-center text-text-secondary hover:text-copper transition-colors z-10"
          title={leftCollapsed ? 'Show feed' : 'Hide feed'}
        >
          <span className="text-xs" style={{writingMode: 'vertical-rl'}}>{leftCollapsed ? '›' : '‹'}</span>
        </button>

        {/* Map - takes remaining space */}
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
          <span className="text-xs" style={{writingMode: 'vertical-rl'}}>{rightCollapsed ? '‹' : '›'}</span>
        </button>

        {/* Right Panel - Chat Only */}
        <div className={`flex-none transition-all duration-300 ${rightCollapsed ? 'w-0' : 'w-72'} overflow-hidden border-l border-border`}>
          <div className="w-72 h-full flex flex-col">
            <ChatPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
