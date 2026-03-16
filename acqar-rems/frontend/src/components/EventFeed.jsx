// import { useEffect, useRef, useState } from 'react'
// import { useEvents } from '../context/EventsContext'
// import EventCard from './EventCard'

// const SEVERITY_COLORS = {
//   1: '#27AE60',
//   2: '#A8D44A',
//   3: '#F39C12',
//   4: '#E67E22',
//   5: '#E74C3C'
// }

// export default function EventFeed() {
//   const { filteredEvents, isLoading, setSelectedEvent } = useEvents()
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
//     const now = Date.now() / 1000 // current time in seconds
//     const thirtyMinutesAgo = now - 1800 // 30 min = 1800 sec

//     switch (activeTab) {
//       case 'live':
//         return filteredEvents.filter(e => {
//           const eventTs = e.created_at_ts || new Date(e.created_at).getTime() / 1000
//           return eventTs >= thirtyMinutesAgo
//         })
//       case 'reports':
//         return filteredEvents
//           .filter(e => e.severity >= 4)
//           .slice(0, 10)
//       case 'feed':
//       default:
//         return filteredEvents
//     }
//   }

//   const tabEvents = getTabEvents()

//   // Calculate live events (events in last 30 minutes)
//   const now = Date.now() / 1000
//   const liveCount = filteredEvents.filter(e => {
//     const ts = e.created_at_ts || new Date(e.created_at).getTime() / 1000
//     return ts >= now - 1800
//   }).length

//   // Calculate reports count (severity >= 4)
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
//           {key:'feed', label:'FEED'},
//           {key:'live', label:'LIVE'},
//           {key:'reports', label:'REPORTS'},
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
//               <span style={{fontSize:'8px',fontWeight:800,padding:'0 3px',background:'#E74C3C22',color:'#E74C3C',borderRadius:'3px',marginLeft:'2px'}}>{reportsCount}</span>
//             )}
//           </button>
//         ))}
//         <div style={{
//           fontSize:'10px', color:'#B3B3B3', padding:'0 8px',
//           display:'flex', alignItems:'center', flexShrink:0
//         }}>
//           {tabEvents.length} events
//         </div>
//       </div>

//       {/* Content Area */}
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
//               {activeTab === 'live' && 'No events in the last 30 minutes'}
//               {activeTab === 'reports' && 'No high-severity reports in this time window. Try switching to 72H.'}
//               {activeTab === 'feed' && 'No events to display'}
//             </div>
//           </div>
//         </div>
//       )}

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

const SEVERITY_COLORS = {
  1: '#27AE60', 2: '#A8D44A', 3: '#F39C12', 4: '#E67E22', 5: '#E74C3C'
}

// How many ms counts as "live" depending on the active filter
function liveThresholdMs(activeHours) {
  if (activeHours === 1)   return 60 * 60 * 1000          // last 1h  → whole window
  if (activeHours === 24)  return 30 * 60 * 1000          // last 1d  → last 30 min
  if (activeHours === 168) return 3 * 60 * 60 * 1000      // last 1w  → last 3h
  if (activeHours === 720) return 24 * 60 * 60 * 1000     // last 1m  → last 24h
  return 30 * 60 * 1000
}

export default function EventFeed() {
  const { filteredEvents, isLoading, setSelectedEvent, filters } = useEvents()
  const feedRef = useRef(null)
  const prevCountRef = useRef(0)
  const [activeTab, setActiveTab] = useState('feed')

  // Auto-scroll to top when new events arrive
  useEffect(() => {
    if (filteredEvents.length > prevCountRef.current && feedRef.current) {
      feedRef.current.scrollTop = 0
    }
    prevCountRef.current = filteredEvents.length
  }, [filteredEvents.length])

  // Filter events based on active tab
  const getTabEvents = () => {
    const threshold = liveThresholdMs(filters?.hours ?? 24)
    const cutoff = Date.now() - threshold

    switch (activeTab) {
      case 'live':
        return filteredEvents.filter(e => {
          const ts = e.created_at_ts
            ? e.created_at_ts * 1000
            : new Date(e.created_at).getTime()
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

  // Live count using same threshold
  const liveThreshold = liveThresholdMs(filters?.hours ?? 24)
  const liveCutoff = Date.now() - liveThreshold
  const liveCount = filteredEvents.filter(e => {
    const ts = e.created_at_ts
      ? e.created_at_ts * 1000
      : new Date(e.created_at).getTime()
    return ts >= liveCutoff
  }).length

  // Live tab label changes based on filter
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
        <div ref={feedRef} style={{flex:1, overflowY:'auto'}}>
          {tabEvents.map(event => (
            <div key={event.id} style={{padding:'12px', borderBottom:'1px solid #0F3460', cursor:'pointer',
              background:'rgba(231,76,60,0.03)'}} onClick={() => setSelectedEvent(event)}>
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
                {event.url && (
                  <a href={event.url} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{fontSize:'9px', color:'#2980B9', textDecoration:'none', borderBottom:'1px dotted #2980B9', marginLeft:'auto'}}>
                    ↗ Source
                  </a>
                )}
              </div>
            </div>
          ))}
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

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
