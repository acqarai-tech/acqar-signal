// import { useEffect, useRef, useState } from 'react'
// import { useEvents } from '../context/EventsContext'
// import EventCard from './EventCard'

// const SEVERITY_COLORS = {
//   1: '#27AE60', 2: '#A8D44A', 3: '#F39C12', 4: '#E67E22', 5: '#E74C3C'
// }

// // How many ms counts as "live" depending on the active filter
// function liveThresholdMs(activeHours) {
//   if (activeHours === 1)   return 60 * 60 * 1000          // last 1h  → whole window
//   if (activeHours === 24)  return 30 * 60 * 1000          // last 1d  → last 30 min
//   if (activeHours === 168) return 3 * 60 * 60 * 1000      // last 1w  → last 3h
//   if (activeHours === 720) return 24 * 60 * 60 * 1000     // last 1m  → last 24h
//   return 30 * 60 * 1000
// }

// export default function EventFeed() {
//   const { filteredEvents, isLoading, setSelectedEvent, filters } = useEvents()
//   const feedRef = useRef(null)
//   const prevCountRef = useRef(0)
//   const [activeTab, setActiveTab] = useState('feed')

//   // Auto-scroll to top when new events arrive
//   useEffect(() => {
//     if (filteredEvents.length > prevCountRef.current && feedRef.current) {
//       feedRef.current.scrollTop = 0
//     }
//     prevCountRef.current = filteredEvents.length
//   }, [filteredEvents.length])

//   // Filter events based on active tab
//   const getTabEvents = () => {
//     const threshold = liveThresholdMs(filters?.hours ?? 24)
//     const cutoff = Date.now() - threshold

//     switch (activeTab) {
//       case 'live':
//         return filteredEvents.filter(e => {
//           const ts = e.created_at_ts
//             ? e.created_at_ts * 1000
//             : new Date(e.created_at).getTime()
//           return ts >= cutoff
//         })
//       case 'reports':
//         return filteredEvents.filter(e => e.severity >= 4).slice(0, 10)
//       case 'feed':
//       default:
//         return filteredEvents
//     }
//   }

//   const tabEvents = getTabEvents()

//   // Live count using same threshold
//   const liveThreshold = liveThresholdMs(filters?.hours ?? 24)
//   const liveCutoff = Date.now() - liveThreshold
//   const liveCount = filteredEvents.filter(e => {
//     const ts = e.created_at_ts
//       ? e.created_at_ts * 1000
//       : new Date(e.created_at).getTime()
//     return ts >= liveCutoff
//   }).length

//   // Live tab label changes based on filter
//   const liveTabLabel = (() => {
//     const h = filters?.hours ?? 24
//     if (h === 1)   return 'LIVE · 1H'
//     if (h === 24)  return 'LIVE · 30M'
//     if (h === 168) return 'LIVE · 3H'
//     if (h === 720) return 'LIVE · 24H'
//     return 'LIVE'
//   })()

//   const reportsCount = filteredEvents.filter(e => e.severity >= 4).length

//   if (isLoading) return (
//     <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'#B3B3B3', fontSize:'13px'}}>
//       <div>⏳ Fetching live data...</div>
//     </div>
//   )

//   return (
//     <div style={{flex:1, display:'flex', flexDirection:'column', overflowY:'hidden'}}>
//       {/* Tab Bar */}
//       <div style={{display:'flex', borderBottom:'1px solid #0F3460', flexShrink:0, background:'#16213E', alignItems:'center'}}>
//         {[
//           { key:'feed', label:'FEED' },
//           { key:'live', label: liveTabLabel },
//           { key:'reports', label:'REPORTS' },
//         ].map(tab => (
//           <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
//             flex:1, padding:'8px 4px', fontSize:'10px', fontWeight:700, letterSpacing:'0.5px',
//             border:'none', background:'transparent', cursor:'pointer',
//             color: activeTab === tab.key ? '#B87333' : '#555',
//             borderBottom: activeTab === tab.key ? '2px solid #B87333' : '2px solid transparent',
//           }}>
//             {tab.key === 'live' && liveCount > 0 && (
//               <span style={{display:'inline-flex', alignItems:'center', gap:'2px', marginRight:3}}>
//                 <span style={{display:'inline-block', width:5, height:5, borderRadius:'50%', background:'#27AE60', animation:'livePulse 2s infinite'}} />
//                 <span style={{fontSize:'9px', fontWeight:700, color:'#27AE60'}}>{liveCount}</span>
//               </span>
//             )}
//             {tab.label}
//             {tab.key === 'reports' && reportsCount > 0 && (
//               <span style={{fontSize:'8px', fontWeight:800, padding:'0 3px', background:'#E74C3C22', color:'#E74C3C', borderRadius:'3px', marginLeft:'2px'}}>{reportsCount}</span>
//             )}
//           </button>
//         ))}
//         <div style={{fontSize:'10px', color:'#B3B3B3', padding:'0 8px', display:'flex', alignItems:'center', flexShrink:0}}>
//           {tabEvents.length} events
//         </div>
//       </div>

//       {/* Empty states */}
//       {!tabEvents.length && !filteredEvents.length && (
//         <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'#B3B3B3', fontSize:'13px', textAlign:'center', padding:'20px'}}>
//           <div>
//             <div style={{fontSize:'32px', marginBottom:'8px'}}>📭</div>
//             <div>No events match your filters</div>
//             <div style={{fontSize:'11px', marginTop:'4px', color:'#666'}}>Try expanding the time range</div>
//           </div>
//         </div>
//       )}

//       {!tabEvents.length && filteredEvents.length > 0 && (
//         <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'#B3B3B3', fontSize:'13px', textAlign:'center', padding:'20px'}}>
//           <div>
//             <div style={{fontSize:'32px', marginBottom:'8px'}}>📭</div>
//             <div>
//               {activeTab === 'live' && `No events in the live window for this filter`}
//               {activeTab === 'reports' && 'No high-severity reports in this time window.'}
//               {activeTab === 'feed' && 'No events to display'}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Reports tab */}
//       {tabEvents.length > 0 && activeTab === 'reports' && (
//         <div ref={feedRef} style={{flex:1, overflowY:'auto'}}>
//           {tabEvents.map(event => (
//             <div key={event.id} style={{padding:'12px', borderBottom:'1px solid #0F3460', cursor:'pointer',
//               background:'rgba(231,76,60,0.03)'}} onClick={() => setSelectedEvent(event)}>
//               <div style={{display:'flex', gap:'6px', marginBottom:'5px', alignItems:'center'}}>
//                 <span style={{fontSize:'9px', fontWeight:700, padding:'2px 6px', borderRadius:'3px',
//                   background: SEVERITY_COLORS[event.severity] + '22', color: SEVERITY_COLORS[event.severity]}}>
//                   ⚠ S{event.severity}
//                 </span>
//                 <span style={{fontSize:'9px', fontWeight:600, padding:'2px 5px', borderRadius:'3px',
//                   background:'rgba(184,115,51,0.15)', color:'#B87333', textTransform:'uppercase',
//                   letterSpacing:'0.3px'}}>{event.category?.replace('_',' ')}</span>
//                 <span style={{fontSize:'10px', color:'#555', marginLeft:'auto'}}>{event.location_name}</span>
//               </div>
//               <div style={{fontSize:'12px', fontWeight:700, color:'#FAFAFA', lineHeight:1.4, marginBottom:'4px'}}>{event.title}</div>
//               <div style={{fontSize:'11px', color:'#888', lineHeight:1.5}}>{event.summary?.slice(0, 120)}...</div>
//               <div style={{display:'flex', gap:'8px', marginTop:'6px', alignItems:'center'}}>
//                 <span style={{fontSize:'9px', color:'#B87333', fontWeight:600}}>via {event.source}</span>
//                 {event.url && (
//                   <a href={event.url} target="_blank" rel="noopener noreferrer"
//                     onClick={e => e.stopPropagation()}
//                     style={{fontSize:'9px', color:'#2980B9', textDecoration:'none', borderBottom:'1px dotted #2980B9', marginLeft:'auto'}}>
//                     ↗ Source
//                   </a>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Feed + Live tabs */}
//       {tabEvents.length > 0 && (activeTab === 'feed' || activeTab === 'live') && (
//         <div ref={feedRef} style={{flex:1, overflowY:'auto', overflowX:'hidden'}}>
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





















import { useEffect, useRef, useState } from 'react'
import { useEvents } from '../context/EventsContext'
import EventCard from './EventCard'

// ─── Plan config ────────────────────────────────────────────────────────────
// Set this from your auth context / user state.
// true  = free user  → Reports tab is locked
// false = pro user   → Reports tab is fully accessible
const PRICING_URL = 'https://acqar.vercel.app/pricing'

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
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(10,14,26,0.72)',
          backdropFilter: 'blur(2px)',
          zIndex: 30,
        }}
      />

      {/* Card */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 31,
        width: '248px',
        background: 'linear-gradient(160deg, #16213E 0%, #0D1B30 100%)',
        border: '1px solid #B87333',
        borderRadius: '12px',
        padding: '18px 16px 14px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(184,115,51,0.15)',
      }}>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '10px', right: '10px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#555', fontSize: '14px', lineHeight: 1,
            padding: '2px 5px',
          }}
        >✕</button>

        {/* Label */}
        <div style={{
          fontSize: '9px', fontWeight: 800, letterSpacing: '1.2px',
          color: '#B87333', marginBottom: '6px',
        }}>
          FOUNDING MEMBER OFFER
        </div>

        {/* Product name */}
        <div style={{
          fontSize: '20px', fontWeight: 900, color: '#FAFAFA',
          letterSpacing: '-0.5px', marginBottom: '4px',
        }}>
          ACQAR <span style={{ color: '#B87333' }}>PRO</span>
        </div>

        <div style={{
          fontSize: '10px', color: '#888', lineHeight: 1.5, marginBottom: '12px',
        }}>
          For property owners and buyers who need Dubai real estate intelligence.
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', marginBottom: '2px' }}>
          <span style={{ fontSize: '11px', color: '#B87333', fontWeight: 700, marginBottom: '4px' }}>Đ</span>
          <span style={{ fontSize: '32px', fontWeight: 900, color: '#B87333', lineHeight: 1 }}>29</span>
        </div>
        <div style={{
          fontSize: '9px', fontWeight: 700, color: '#B87333',
          letterSpacing: '0.6px', marginBottom: '12px',
        }}>
          FIRST 3 MONTHS — 149/MO AFTER
        </div>

        {/* Features */}
        <div style={{ marginBottom: '14px' }}>
          {[
            '10 TRUVALU™ AI Reports/Month',
            'Full SIGNAL™ Terminal Access',
            'PDF Reports & Shareable Links',
            'Real-Time Market Signals',
            'Cancel Anytime',
          ].map(f => (
            <div key={f} style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              fontSize: '10px', color: '#DADADA', fontWeight: 600,
              marginBottom: '5px',
            }}>
              <span style={{ color: '#B87333', fontSize: '10px' }}>✓</span>
              {f}
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href={PRICING_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block', textAlign: 'center',
            background: 'linear-gradient(135deg, #B87333 0%, #D4913F 100%)',
            color: '#1A1A2E', fontWeight: 800, fontSize: '10px',
            letterSpacing: '0.8px', padding: '10px 12px',
            borderRadius: '7px', textDecoration: 'none',
            marginBottom: '8px',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          AVAIL FOUNDING MEMBER OFFER →
        </a>

        {/* Dismiss */}
        <button
          onClick={onClose}
          style={{
            display: 'block', width: '100%', textAlign: 'center',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '9px', fontWeight: 700, color: '#555',
            letterSpacing: '0.5px', padding: '4px',
          }}
        >
          MAYBE LATER
        </button>
      </div>
    </>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function EventFeed({ plan = 'free' }) {
  const { filteredEvents, isLoading, setSelectedEvent } = useEvents()
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
        return filteredEvents.filter(e => e.severity >= 4).slice(0, 10)
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
  const reportsCount = filteredEvents.filter(e => e.severity >= 4).length

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
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3B3B3', fontSize: '13px' }}>
      <div>⏳ Fetching live data...</div>
    </div>
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden', position: 'relative' }}>

      {/* ── Tab Bar ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', borderBottom: '1px solid #0F3460', flexShrink: 0, background: '#16213E', alignItems: 'center' }}>
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
              color: activeTab === tab.key ? '#B87333' : '#555',
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
            {tab.key === 'reports' && isFree && (
              <span style={{ fontSize: '9px', marginLeft: '3px', opacity: 0.7 }}>🔒</span>
            )}
            {tab.key === 'reports' && reportsCount > 0 && (
              <span style={{ fontSize: '8px', fontWeight: 800, padding: '0 3px', background: '#E74C3C22', color: '#E74C3C', borderRadius: '3px', marginLeft: '2px' }}>
                {reportsCount}
              </span>
            )}
          </button>
        ))}
        <div style={{ fontSize: '10px', color: '#B3B3B3', padding: '0 8px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {tabEvents.length} events
        </div>
      </div>

      {/* ── Content Area ────────────────────────────────────────────────── */}
      {!tabEvents.length && !filteredEvents.length && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3B3B3', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
            <div>No events match your filters</div>
            <div style={{ fontSize: '11px', marginTop: '4px', color: '#666' }}>Try expanding the time range</div>
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
                  padding: '12px', borderBottom: '1px solid #0F3460', cursor: 'pointer',
                  background: 'rgba(231,76,60,0.03)',
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
                  <span style={{ fontSize: '10px', color: '#555', marginLeft: 'auto' }}>{event.location_name}</span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#FAFAFA', lineHeight: 1.4, marginBottom: '4px' }}>{event.title}</div>
                <div style={{ fontSize: '11px', color: '#888', lineHeight: 1.5 }}>{event.summary?.slice(0, 120)}...</div>
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
                background: 'rgba(10,14,26,0.55)',
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              <div style={{
                fontSize: '24px', marginBottom: '8px',
              }}>🔒</div>
              <div style={{
                fontSize: '12px', fontWeight: 700, color: '#FAFAFA',
                marginBottom: '4px',
              }}>PRO Feature</div>
              <div style={{
                fontSize: '10px', color: '#888', marginBottom: '12px', textAlign: 'center', padding: '0 24px',
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
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
