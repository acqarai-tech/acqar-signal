// import { createContext, useContext, useEffect, useState, useCallback } from 'react'
// import { useSocket } from './SocketContext'

// const EventsContext = createContext(null)

// const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// export function EventsProvider({ children }) {
//   const [events, setEvents] = useState([])
//   const [filteredEvents, setFilteredEvents] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [filters, setFilters] = useState({
//     categories: [],
//     severityMin: 1,
//     severityMax: 5,
//     hours: 24,
//     search: ''
//   })
//   const [selectedEvent, setSelectedEvent] = useState(null)
//   const [mapStyle, setMapStyle] = useState('dark')
//   const { on, off } = useSocket()

//   // Fetch initial events from REST API
//   const fetchEvents = useCallback(async () => {
//     try {
//       setIsLoading(true)
//       const params = new URLSearchParams({
//         hours: filters.hours,
//         severity_min: filters.severityMin,
//         severity_max: filters.severityMax,
//         limit: 100
//       })
//       if (filters.categories.length === 1) params.append('category', filters.categories[0])
//       if (filters.search) params.append('search', filters.search)

//       const res = await fetch(`${API_BASE}/api/events/?${params}`)
//       if (!res.ok) throw new Error('API error')
//       const data = await res.json()
//       setEvents(data.events || [])
//     } catch (err) {
//       console.warn('REST fetch failed, using demo data:', err.message)
//       setEvents(getDemoEvents())
//     } finally {
//       setIsLoading(false)
//     }
//   }, [filters.hours, filters.severityMin, filters.severityMax, filters.categories, filters.search])

//   useEffect(() => { fetchEvents() }, [fetchEvents])

//   // Listen for real-time events via Socket.io
//   useEffect(() => {
//     const handleNewEvent = (event) => {
//       setEvents(prev => {
//         const exists = prev.find(e => e.id === event.id)
//         if (exists) return prev
//         return [event, ...prev].slice(0, 200)
//       })
//     }

//     const handleInitialEvents = ({ events: initialEvents }) => {
//       if (initialEvents?.length) setEvents(initialEvents)
//       setIsLoading(false)
//     }

//     on('new_event', handleNewEvent)
//     on('initial_events', handleInitialEvents)

//     return () => {
//       off('new_event', handleNewEvent)
//       off('initial_events', handleInitialEvents)
//     }
//   }, [on, off])

//   // Apply ALL filters including time window
//   useEffect(() => {
//     let result = [...events]

//     // ── Time filter ──────────────────────────────────────────────────────────
//     const cutoff = Date.now() - filters.hours * 60 * 60 * 1000
//     result = result.filter(e => {
//       const ts = e.created_at ? new Date(e.created_at).getTime() : Date.now()
//       return ts >= cutoff
//     })

//     // ── Category filter ──────────────────────────────────────────────────────
//     if (filters.categories.length > 0) {
//       result = result.filter(e => filters.categories.includes(e.category))
//     }

//     // ── Severity filter ──────────────────────────────────────────────────────
//     result = result.filter(
//       e => e.severity >= filters.severityMin && e.severity <= filters.severityMax
//     )

//     // ── Search filter ────────────────────────────────────────────────────────
//     if (filters.search) {
//       const q = filters.search.toLowerCase()
//       result = result.filter(e =>
//         e.title?.toLowerCase().includes(q) ||
//         e.location_name?.toLowerCase().includes(q)
//       )
//     }

//     setFilteredEvents(result)
//   }, [events, filters])

//   const updateFilters = (newFilters) =>
//     setFilters(prev => ({ ...prev, ...newFilters }))

//   return (
//     <EventsContext.Provider value={{
//       events, filteredEvents, isLoading, filters,
//       updateFilters, selectedEvent, setSelectedEvent, fetchEvents,
//       mapStyle, setMapStyle
//     }}>
//       {children}
//     </EventsContext.Provider>
//   )
// }

// export const useEvents = () => useContext(EventsContext)

// // Demo data fallback — timestamps spread across different time windows
// function getDemoEvents() {
//   const now = Date.now()
//   const mins = (m) => now - m * 60 * 1000
//   return [
//     // within 1H
//     { id: 'demo1', title: 'Emaar Reports Record Q4 Sales of AED 6.7 Billion', summary: 'Dubai developer Emaar Properties announced record quarterly sales driven by strong demand in Downtown and Creek Harbour.', category: 'transaction', severity: 4, lat: 25.1972, lng: 55.2744, location_name: 'Downtown Dubai', signal_count: 47, confidence: 0.92, source: 'Gulf News', created_at: new Date(mins(20)).toISOString(), is_active: true },
//     { id: 'demo2', title: 'DAMAC Launches Palm Jumeirah Ultra-Luxury Residences', summary: 'New off-plan project priced from AED 15M per unit, targeting UHNWI buyers from Europe and Asia.', category: 'offplan', severity: 3, lat: 25.1124, lng: 55.1390, location_name: 'Palm Jumeirah', signal_count: 31, confidence: 0.88, source: 'Arabian Business', created_at: new Date(mins(45)).toISOString(), is_active: true },
//     // within 1D (but not 1H)
//     { id: 'demo3', title: 'RERA Issues New Short-Term Rental Regulations', summary: 'Dubai Real Estate Regulatory Authority updates licensing requirements for holiday homes and serviced apartments.', category: 'regulatory', severity: 3, lat: 25.2048, lng: 55.2708, location_name: 'Dubai', signal_count: 62, confidence: 0.95, source: 'The National', created_at: new Date(mins(180)).toISOString(), is_active: true },
//     { id: 'demo4', title: 'Business Bay Records 847 Transactions in November', summary: 'Business Bay continues to be Dubai top performing district with AED 1.2B total transaction value this month.', category: 'transaction', severity: 3, lat: 25.1865, lng: 55.2644, location_name: 'Business Bay', signal_count: 28, confidence: 0.85, source: 'Zawya', created_at: new Date(mins(600)).toISOString(), is_active: true },
//     // within 1W (but not 1D)
//     { id: 'demo5', title: 'Nakheel Announces Palm Jebel Ali Phase 2 Infrastructure', summary: 'Construction contracts worth AED 3.8B awarded for road and utility infrastructure on Palm Jebel Ali expansion.', category: 'infrastructure', severity: 4, lat: 24.9823, lng: 55.0262, location_name: 'Dubai South', signal_count: 54, confidence: 0.91, source: 'Gulf News', created_at: new Date(mins(60 * 48)).toISOString(), is_active: true },
//     { id: 'demo6', title: 'Dubai Marina Average Rental Yield Hits 7.2%', summary: 'Marina district outperforms all other areas with highest rental yield in Q4, attracting yield-focused investors.', category: 'investment', severity: 2, lat: 25.0761, lng: 55.1403, location_name: 'Dubai Marina', signal_count: 19, confidence: 0.79, source: 'GDELT', created_at: new Date(mins(60 * 72)).toISOString(), is_active: true },
//     // within 1M (but not 1W)
//     { id: 'demo7', title: 'Dubai Land Department Launches Smart Rental Index', summary: 'New digital platform allows landlords and tenants to access real-time rental valuations across all districts.', category: 'regulatory', severity: 3, lat: 25.2048, lng: 55.2708, location_name: 'Dubai', signal_count: 38, confidence: 0.87, source: 'DLD', created_at: new Date(mins(60 * 24 * 12)).toISOString(), is_active: true },
//     { id: 'demo8', title: 'JVC Emerges as Most Affordable Investment District', summary: 'Jumeirah Village Circle records highest transaction volume among sub-AED 1M properties in Q4.', category: 'investment', severity: 2, lat: 25.0580, lng: 55.2100, location_name: 'JVC', signal_count: 22, confidence: 0.81, source: 'Property Monitor', created_at: new Date(mins(60 * 24 * 20)).toISOString(), is_active: true },
//   ]
// }























import { useEffect, useRef, useState } from 'react'
import { useEvents } from '../context/EventsContext'
import EventCard from './EventCard'

const SEVERITY_COLORS = {
  1: '#27AE60', 2: '#A8D44A', 3: '#F39C12', 4: '#E67E22', 5: '#E74C3C'
}

function liveThresholdMs(activeHours) {
  if (activeHours === 1)   return 60 * 60 * 1000
  if (activeHours === 24)  return 30 * 60 * 1000
  if (activeHours === 168) return 3 * 60 * 60 * 1000
  if (activeHours === 720) return 24 * 60 * 60 * 1000
  return 30 * 60 * 1000
}

// ── Paywall Popup ────────────────────────────────────────────────────────────
function ProUpgradePopup({ onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          zIndex: 1000, backdropFilter: 'blur(2px)',
        }}
      />
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1001,
        width: 'min(320px, 90vw)',
        background: '#FAFAF8',
        borderRadius: '10px',
        padding: '20px 20px 16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
        fontFamily: 'system-ui, sans-serif',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 10, right: 12,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 16, color: '#999', lineHeight: 1, padding: 0,
          }}
          aria-label="Close"
        >×</button>

        <p style={{
          fontSize: 9, fontWeight: 800, letterSpacing: '1.2px',
          color: '#B87333', margin: '0 0 6px', textTransform: 'uppercase',
        }}>Founding Member Offer</p>

        <h2 style={{
          fontSize: 22, fontWeight: 900, color: '#111',
          margin: '0 0 6px', lineHeight: 1.1, letterSpacing: '-0.5px',
          fontStyle: 'italic',
        }}>ACQAR PRO</h2>

        <p style={{
          fontSize: 11, color: '#555', margin: '0 0 12px', lineHeight: 1.5,
        }}>
          For property owners and buyers who need Dubai real estate intelligence.
        </p>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 2 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#B87333' }}>Đ</span>
          <span style={{ fontSize: 30, fontWeight: 900, color: '#B87333', lineHeight: 1 }}>29</span>
        </div>
        <p style={{
          fontSize: 8, fontWeight: 700, letterSpacing: '0.8px',
          color: '#B87333', margin: '0 0 12px', textTransform: 'uppercase',
        }}>First 3 months — 149/mo after</p>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            '10 TRUVALU™ AI Reports/Month',
            'Full SIGNAL™ Terminal Access',
            'PDF Reports & Shareable Links',
            'Real-Time Market Signals',
            'Cancel Anytime',
          ].map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: '#222', fontWeight: 600 }}>
              <span style={{ color: '#B87333', fontSize: 12, lineHeight: 1 }}>✓</span>
              {f}
            </li>
          ))}
        </ul>

        <a
          href="/pricing"
          style={{
            display: 'block', width: '100%', boxSizing: 'border-box',
            padding: '11px 0', background: '#B87333',
            color: '#fff', textAlign: 'center',
            fontSize: 10, fontWeight: 800, letterSpacing: '1px',
            textDecoration: 'none', borderRadius: 6,
            textTransform: 'uppercase',
          }}
        >
          Avail Founding Member Offer →
        </a>

        <button
          onClick={onClose}
          style={{
            display: 'block', width: '100%', marginTop: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 9, fontWeight: 700, letterSpacing: '1px',
            color: '#AAA', textTransform: 'uppercase', textAlign: 'center',
            padding: '4px 0',
          }}
        >
          Maybe Later
        </button>
      </div>
    </>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function EventFeed({ isPro = false }) {
  const { filteredEvents, isLoading, setSelectedEvent, filters } = useEvents()
  const feedRef = useRef(null)
  const prevCountRef = useRef(0)
  const [activeTab, setActiveTab] = useState('feed')
  const [showUpgradePopup, setShowUpgradePopup] = useState(false)

  const FREE_VISIBLE = 4

  useEffect(() => {
    if (filteredEvents.length > prevCountRef.current && feedRef.current) {
      feedRef.current.scrollTop = 0
    }
    prevCountRef.current = filteredEvents.length
  }, [filteredEvents.length])

  const getTabEvents = () => {
    const threshold = liveThresholdMs(filters?.hours ?? 24)
    const cutoff = Date.now() - threshold
    switch (activeTab) {
      case 'live':
        return filteredEvents.filter(e => {
          const ts = e.created_at_ts ? e.created_at_ts * 1000 : new Date(e.created_at).getTime()
          return ts >= cutoff
        })
      case 'reports':
        return filteredEvents.filter(e => e.severity >= 4).slice(0, 10)
      case 'feed':
      default:
        return filteredEvents
    }
  }

  const tabEvents = getTabEvents()

  const liveThreshold = liveThresholdMs(filters?.hours ?? 24)
  const liveCutoff = Date.now() - liveThreshold
  const liveCount = filteredEvents.filter(e => {
    const ts = e.created_at_ts ? e.created_at_ts * 1000 : new Date(e.created_at).getTime()
    return ts >= liveCutoff
  }).length

  const liveTabLabel = (() => {
    const h = filters?.hours ?? 24
    if (h === 1)   return 'LIVE · 1H'
    if (h === 24)  return 'LIVE · 30M'
    if (h === 168) return 'LIVE · 3H'
    if (h === 720) return 'LIVE · 24H'
    return 'LIVE'
  })()

  const reportsCount = filteredEvents.filter(e => e.severity >= 4).length

  if (isLoading) return (
    <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'#B3B3B3', fontSize:'13px'}}>
      <div>⏳ Fetching live data...</div>
    </div>
  )

  return (
    <div style={{flex:1, display:'flex', flexDirection:'column', overflowY:'hidden'}}>

      {/* Tab Bar */}
      <div style={{display:'flex', borderBottom:'1px solid #0F3460', flexShrink:0, background:'#16213E', alignItems:'center'}}>
        {[
          { key:'feed', label:'FEED' },
          { key:'live', label: liveTabLabel },
          { key:'reports', label:'REPORTS' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            flex:1, padding:'8px 4px', fontSize:'10px', fontWeight:700, letterSpacing:'0.5px',
            border:'none', background:'transparent', cursor:'pointer',
            color: activeTab === tab.key ? '#B87333' : '#555',
            borderBottom: activeTab === tab.key ? '2px solid #B87333' : '2px solid transparent',
          }}>
            {tab.key === 'live' && liveCount > 0 && (
              <span style={{display:'inline-flex', alignItems:'center', gap:'2px', marginRight:3}}>
                <span style={{display:'inline-block', width:5, height:5, borderRadius:'50%', background:'#27AE60', animation:'livePulse 2s infinite'}} />
                <span style={{fontSize:'9px', fontWeight:700, color:'#27AE60'}}>{liveCount}</span>
              </span>
            )}
            {tab.label}
            {tab.key === 'reports' && reportsCount > 0 && (
              <span style={{fontSize:'8px', fontWeight:800, padding:'0 3px', background:'#E74C3C22', color:'#E74C3C', borderRadius:'3px', marginLeft:'2px'}}>{reportsCount}</span>
            )}
          </button>
        ))}
        <div style={{fontSize:'10px', color:'#B3B3B3', padding:'0 8px', display:'flex', alignItems:'center', flexShrink:0}}>
          {tabEvents.length} events
        </div>
      </div>

      {/* Empty states */}
      {!tabEvents.length && !filteredEvents.length && (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'#B3B3B3', fontSize:'13px', textAlign:'center', padding:'20px'}}>
          <div>
            <div style={{fontSize:'32px', marginBottom:'8px'}}>📭</div>
            <div>No events match your filters</div>
            <div style={{fontSize:'11px', marginTop:'4px', color:'#666'}}>Try expanding the time range</div>
          </div>
        </div>
      )}

      {!tabEvents.length && filteredEvents.length > 0 && (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'#B3B3B3', fontSize:'13px', textAlign:'center', padding:'20px'}}>
          <div>
            <div style={{fontSize:'32px', marginBottom:'8px'}}>📭</div>
            <div>
              {activeTab === 'live' && `No events in the live window for this filter`}
              {activeTab === 'reports' && 'No high-severity reports in this time window.'}
              {activeTab === 'feed' && 'No events to display'}
            </div>
          </div>
        </div>
      )}

      {/* Reports tab */}
      {tabEvents.length > 0 && activeTab === 'reports' && (
        <div ref={feedRef} style={{flex:1, overflowY:'auto', position:'relative'}}>
          {tabEvents.map((event, idx) => {
            const isBlurred = !isPro && idx >= FREE_VISIBLE
            return (
              <div
                key={event.id}
                onClick={() => isBlurred ? setShowUpgradePopup(true) : setSelectedEvent(event)}
                style={{
                  padding:'12px', borderBottom:'1px solid #0F3460', cursor:'pointer',
                  background:'rgba(231,76,60,0.03)',
                  filter: isBlurred ? 'blur(4px)' : 'none',
                  userSelect: isBlurred ? 'none' : 'auto',
                  position: 'relative',
                }}
              >
                <div style={{display:'flex', gap:'6px', marginBottom:'5px', alignItems:'center'}}>
                  <span style={{fontSize:'9px', fontWeight:700, padding:'2px 6px', borderRadius:'3px',
                    background: SEVERITY_COLORS[event.severity] + '22', color: SEVERITY_COLORS[event.severity]}}>
                    ⚠ S{event.severity}
                  </span>
                  <span style={{fontSize:'9px', fontWeight:600, padding:'2px 5px', borderRadius:'3px',
                    background:'rgba(184,115,51,0.15)', color:'#B87333', textTransform:'uppercase',
                    letterSpacing:'0.3px'}}>{event.category?.replace('_',' ')}</span>
                  <span style={{fontSize:'10px', color:'#555', marginLeft:'auto'}}>{event.location_name}</span>
                </div>
                <div style={{fontSize:'12px', fontWeight:700, color:'#FAFAFA', lineHeight:1.4, marginBottom:'4px'}}>{event.title}</div>
                <div style={{fontSize:'11px', color:'#888', lineHeight:1.5}}>{event.summary?.slice(0, 120)}...</div>
                <div style={{display:'flex', gap:'8px', marginTop:'6px', alignItems:'center'}}>
                  <span style={{fontSize:'9px', color:'#B87333', fontWeight:600}}>via {event.source}</span>
                  {event.url && !isBlurred && (
                    <a href={event.url} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{fontSize:'9px', color:'#2980B9', textDecoration:'none', borderBottom:'1px dotted #2980B9', marginLeft:'auto'}}>
                      ↗ Source
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Feed + Live tabs */}
      {tabEvents.length > 0 && (activeTab === 'feed' || activeTab === 'live') && (
        <div ref={feedRef} style={{flex:1, overflowY:'auto', overflowX:'hidden'}}>
          {tabEvents.map((event, i) => (
            <EventCard key={event.id} event={event} isNew={i === 0} />
          ))}
        </div>
      )}

      {/* Upgrade Popup */}
      {showUpgradePopup && (
        <ProUpgradePopup onClose={() => setShowUpgradePopup(false)} />
      )}

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
