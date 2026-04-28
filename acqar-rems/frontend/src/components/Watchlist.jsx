// import { useState } from 'react'
// import { useEvents } from '../context/EventsContext'

// const DUBAI_AREAS = [
//   'Palm Jumeirah', 'Dubai Marina', 'Downtown Dubai', 'Business Bay',
//   'DIFC', 'JVC', 'Dubai Hills Estate', 'Expo City', 'Meydan', 'Deira',
//   'JBR', 'Arabian Ranches', 'Emirates Hills', 'Dubai South', 'Creek Harbour',
// ]

// export default function Watchlist() {
//   const [watched, setWatched] = useState(['Palm Jumeirah', 'Dubai Marina', 'Downtown Dubai'])
//   const [showAdd, setShowAdd] = useState(false)
//   const { events } = useEvents()

//   const toggle = (area) => {
//     setWatched(prev => prev.includes(area)
//       ? prev.filter(a => a !== area)
//       : [...prev, area])
//   }

//   // Count recent events per watched area
//   const areaStats = watched.map(area => {
//     const areaEvents = events.filter(e =>
//       e.location_name?.toLowerCase().includes(area.toLowerCase().split(' ')[0])
//     )
//     const high = areaEvents.filter(e => e.severity >= 4).length
//     return { area, count: areaEvents.length, high }
//   })

//   return (
//     <div style={{
//       height: '100%', display: 'flex', flexDirection: 'column',
//       background: '#16213E', fontFamily: "'Inter', sans-serif", overflow: 'hidden'
//     }}>
//       {/* Header */}
//       <div style={{
//         padding: '10px 12px', borderBottom: '1px solid #0F3460',
//         display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0
//       }}>
//         <span style={{ fontSize: '13px', fontWeight: 700, color: '#FAFAFA' }}>⭐ Watchlist</span>
//         <span style={{ flex: 1, fontSize: '10px', color: '#666' }}>{watched.length} areas</span>
//         <button onClick={() => setShowAdd(!showAdd)} style={{
//           fontSize: '10px', fontWeight: 700, padding: '3px 8px',
//           background: 'rgba(184,115,51,0.15)', border: '1px solid #B87333',
//           color: '#B87333', borderRadius: '4px', cursor: 'pointer'
//         }}>+ Add</button>
//       </div>

//       {/* Add area picker */}
//       {showAdd && (
//         <div style={{
//           padding: '8px', borderBottom: '1px solid #0F3460', flexShrink: 0,
//           display: 'flex', flexWrap: 'wrap', gap: '4px'
//         }}>
//           {DUBAI_AREAS.filter(a => !watched.includes(a)).map(area => (
//             <button key={area} onClick={() => { toggle(area); setShowAdd(false) }}
//               style={{
//                 fontSize: '10px', padding: '3px 7px', borderRadius: '12px',
//                 background: 'rgba(255,255,255,0.05)', border: '1px solid #1a2a4a',
//                 color: '#B3B3B3', cursor: 'pointer'
//               }}>{area}</button>
//           ))}
//         </div>
//       )}

//       {/* Watched areas */}
//       <div style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
//         {areaStats.length === 0 && (
//           <div style={{ textAlign: 'center', padding: '24px 12px', color: '#444', fontSize: '12px' }}>
//             <div style={{ fontSize: '24px', marginBottom: '8px' }}>⭐</div>
//             No areas watched yet.<br />Click "+ Add" to track an area.
//           </div>
//         )}
//         {areaStats.map(({ area, count, high }) => (
//           <div key={area} style={{
//             padding: '10px', background: 'rgba(255,255,255,0.03)',
//             border: '1px solid #0F3460', borderRadius: '6px',
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
//               <span style={{ fontSize: '12px', fontWeight: 700, color: '#FAFAFA', flex: 1 }}>{area}</span>
//               <button onClick={() => toggle(area)} style={{
//                 fontSize: '10px', padding: '1px 5px',
//                 background: 'none', border: '1px solid #333', color: '#666',
//                 borderRadius: '3px', cursor: 'pointer'
//               }}>✕</button>
//             </div>
//             <div style={{ display: 'flex', gap: '8px', fontSize: '10px' }}>
//               <span style={{ color: '#B3B3B3' }}>📡 {count} signals</span>
//               {high > 0 && (
//                 <span style={{ color: '#E74C3C', fontWeight: 700 }}>🔴 {high} high priority</span>
//               )}
//               {count === 0 && (
//                 <span style={{ color: '#444' }}>No recent activity</span>
//               )}
//             </div>
//             <a href="https://acqar.ai" target="_blank" rel="noopener noreferrer"
//               style={{
//                 display: 'block', marginTop: '7px', padding: '5px 8px',
//                 background: 'rgba(184,115,51,0.1)', border: '1px solid rgba(184,115,51,0.3)',
//                 borderRadius: '4px', textDecoration: 'none', textAlign: 'center',
//                 fontSize: '10px', fontWeight: '600', color: '#B87333'
//               }}>
//               🏷️ Get ValuCheck™ alert for {area.split(' ')[0]}
//             </a>
//           </div>
//         ))}
//       </div>

//       {/* REMS PRO upsell */}
//       <div style={{
//         padding: '10px 12px', borderTop: '1px solid #0F3460', flexShrink: 0,
//         background: 'rgba(184,115,51,0.05)',
//       }}>
//         <div style={{ fontSize: '10px', color: '#B87333', fontWeight: 700, marginBottom: '4px' }}>
//           REMS PRO — AED 49/month
//         </div>
//         <div style={{ fontSize: '10px', color: '#666', marginBottom: '6px' }}>
//           Real-time alerts + Telegram push for your watchlist areas
//         </div>
//         <a href="https://acqar.ai" target="_blank" rel="noopener noreferrer" style={{
//           display: 'block', padding: '6px', background: '#B87333',
//           borderRadius: '4px', textAlign: 'center', textDecoration: 'none',
//           fontSize: '11px', fontWeight: 700, color: 'white'
//         }}>Upgrade to PRO →</a>
//       </div>
//     </div>
//   )
// }









import { useState } from 'react'
import { useEvents } from '../context/EventsContext'

const DUBAI_AREAS = [
  'Palm Jumeirah', 'Dubai Marina', 'Downtown Dubai', 'Business Bay',
  'DIFC', 'JVC', 'Dubai Hills Estate', 'Expo City', 'Meydan', 'Deira',
  'JBR', 'Arabian Ranches', 'Emirates Hills', 'Dubai South', 'Creek Harbour',
]

export default function Watchlist() {
  const [watched, setWatched] = useState(['Palm Jumeirah', 'Dubai Marina', 'Downtown Dubai'])
  const [showAdd, setShowAdd] = useState(false)
  const { events } = useEvents()

  const toggle = (area) => {
    setWatched(prev => prev.includes(area)
      ? prev.filter(a => a !== area)
      : [...prev, area])
  }

  // Count recent events per watched area
  const areaStats = watched.map(area => {
    const areaEvents = events.filter(e =>
      e.location_name?.toLowerCase().includes(area.toLowerCase().split(' ')[0])
    )
    const high = areaEvents.filter(e => e.severity >= 4).length
    return { area, count: areaEvents.length, high }
  })

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-card)', fontFamily: "'Inter', sans-serif", overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
       padding: '10px 12px', borderBottom: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0
      }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>⭐ Watchlist</span>
        <span style={{ flex: 1, fontSize: '10px', color: 'var(--text-muted)' }}>{watched.length} areas</span>
        <button onClick={() => setShowAdd(!showAdd)} style={{
          fontSize: '10px', fontWeight: 700, padding: '3px 8px',
          background: 'rgba(184,115,51,0.15)', border: '1px solid #B87333',
          color: '#B87333', borderRadius: '4px', cursor: 'pointer'
        }}>+ Add</button>
      </div>

      {/* Add area picker */}
      {showAdd && (
        <div style={{
          padding: '8px', borderBottom: '1px solid var(--border-color)', flexShrink: 0,
          display: 'flex', flexWrap: 'wrap', gap: '4px'
        }}>
          {DUBAI_AREAS.filter(a => !watched.includes(a)).map(area => (
            <button key={area} onClick={() => { toggle(area); setShowAdd(false) }}
              style={{
                fontSize: '10px', padding: '3px 7px', borderRadius: '12px',
               background: 'var(--row-hover)', border: '1px solid var(--border-panel)',
color: 'var(--text-muted)', cursor: 'pointer'
              }}>{area}</button>
          ))}
        </div>
      )}

      {/* Watched areas */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {areaStats.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--text-muted)', fontSize: '12px' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⭐</div>
            No areas watched yet.<br />Click "+ Add" to track an area.
          </div>
        )}
        {areaStats.map(({ area, count, high }) => (
          <div key={area} style={{
           padding: '10px', background: 'var(--row-hover)',
border: '1px solid var(--border-color)', borderRadius: '6px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>{area}</span>
              <button onClick={() => toggle(area)} style={{
                fontSize: '10px', padding: '1px 5px',
                background: 'none', border: '1px solid var(--border-panel)', color: 'var(--text-muted)',
                borderRadius: '3px', cursor: 'pointer'
              }}>✕</button>
            </div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '10px' }}>
              <span style={{ color: 'var(--text-muted)' }}>📡 {count} signals</span>
              {high > 0 && (
                <span style={{ color: '#E74C3C', fontWeight: 700 }}>🔴 {high} high priority</span>
              )}
              {count === 0 && (
                <span style={{ color: 'var(--text-muted)' }}>No recent activity</span>
              )}
            </div>
            <a href="https://acqar.ai" target="_blank" rel="noopener noreferrer"
              style={{
                display: 'block', marginTop: '7px', padding: '5px 8px',
                background: 'rgba(184,115,51,0.1)', border: '1px solid rgba(184,115,51,0.3)',
                borderRadius: '4px', textDecoration: 'none', textAlign: 'center',
                fontSize: '10px', fontWeight: '600', color: '#B87333'
              }}>
              🏷️ Get ValuCheck™ alert for {area.split(' ')[0]}
            </a>
          </div>
        ))}
      </div>

      {/* REMS PRO upsell */}
      <div style={{
        padding: '10px 12px', borderTop: '1px solid var(--border-color)', flexShrink: 0,
background: 'rgba(184,115,51,0.05)',
      }}>
        <div style={{ fontSize: '10px', color: '#B87333', fontWeight: 700, marginBottom: '4px' }}>
          REMS PRO — AED 49/month
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Real-time alerts + Telegram push for your watchlist areas
        </div>
        <a href="https://acqar.ai" target="_blank" rel="noopener noreferrer" style={{
          display: 'block', padding: '6px', background: '#B87333',
          borderRadius: '4px', textAlign: 'center', textDecoration: 'none',
          fontSize: '11px', fontWeight: 700, color: 'white'
        }}>Upgrade to PRO →</a>
      </div>
    </div>
  )
}
