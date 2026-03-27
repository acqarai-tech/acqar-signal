// import { useEvents } from '../context/EventsContext'
// import { useState } from 'react'

// function confidenceLabel(score) {
//   const pct = Math.round((score || 0) * 100)
//   if (pct < 20) return `${pct}% — Unconfirmed`
//   if (pct < 40) return `${pct}% — Low confidence`
//   if (pct < 60) return `${pct}% — Developing`
//   if (pct < 80) return `${pct}% — Probable`
//   if (pct < 95) return `${pct}% — High confidence`
//   return `${pct}% — Confirmed`
// }

// const CATEGORY_COLORS = {
//   transaction: '#E74C3C', offplan: '#2980B9', construction: '#F39C12',
//   regulatory: '#8E44AD', infrastructure: '#27AE60', investment: '#16A085'
// }

// const CATEGORY_LABELS = {
//   transaction: 'Transaction', offplan: 'Off-Plan', construction: 'Construction',
//   regulatory: 'Regulatory', infrastructure: 'Infrastructure', investment: 'Investment'
// }

// export default function EventDetail() {
//   const { selectedEvent: event, setSelectedEvent } = useEvents()
//   const [copied, setCopied] = useState(false)
//   if (!event) return null

//   const catColor = CATEGORY_COLORS[event.category] || '#B87333'
//   const confPct = Math.round((event.confidence || 0) * 100)

//   const copyLink = () => {
//     const url = `${window.location.origin}/#event/${event.id}`
//     navigator.clipboard.writeText(url).then(() => {
//       setCopied(true)
//       setTimeout(() => setCopied(false), 2000)
//     }).catch(() => {
//       setCopied(true)
//       setTimeout(() => setCopied(false), 2000)
//     })
//   }

//   return (
//     <div style={{
//       position: 'absolute', bottom: 0, left: 0, right: 0,
//       background: '#0D1B2A',
//       border: '1px solid #B87333',
//       borderBottom: 'none',
//       borderRadius: '8px 8px 0 0',
//       padding: '14px',
//       zIndex: 100,
//       maxHeight: '60%',
//       overflowY: 'auto',
//       boxShadow: '0 -4px 24px rgba(0,0,0,0.6)',
//       fontFamily: "'Inter', sans-serif",
//     }}>
//       {/* Header */}
//       <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
//         <div style={{ flex: 1 }}>
//           <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
//             <span style={{
//               fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px',
//               background: catColor + '22', color: catColor, letterSpacing: '0.5px'
//             }}>{CATEGORY_LABELS[event.category] || event.category}</span>
//             <span style={{
//               fontSize: '9px', fontWeight: 700, padding: '2px 5px', borderRadius: '3px',
//               background: 'rgba(184,115,51,0.2)', color: '#B87333'
//             }}>S{event.severity}</span>
//             <span style={{fontSize:'11px', color:'#FAFAFA', fontWeight:600}}>
//               {confidenceLabel(event.confidence)}
//             </span>
//             <div style={{ flex: 1 }}></div>
//             <button
//               onClick={copyLink}
//               title={copied ? 'Link copied!' : 'Copy link'}
//               style={{
//                 background:'none', border:'none', cursor:'pointer',
//                 color: copied ? '#27AE60' : '#555',
//                 fontSize:'13px', padding:'2px 4px',
//                 transition:'color 0.2s',
//               }}>
//               {copied ? '✓' : '🔗'}
//             </button>
//           </div>
//           <div style={{ fontSize: '14px', fontWeight: 700, color: '#FAFAFA', lineHeight: 1.35 }}>
//             {event.title}
//           </div>
//         </div>
//         <button
//           onClick={() => setSelectedEvent(null)}
//           style={{
//             background: 'none', border: '1px solid #333', color: '#B3B3B3',
//             borderRadius: '4px', cursor: 'pointer', fontSize: '12px',
//             padding: '2px 6px', flexShrink: 0
//           }}
//         >✕</button>
//       </div>

//       {/* Summary */}
//       {event.summary && (
//         <p style={{ fontSize: '12px', color: '#B3B3B3', lineHeight: 1.5, marginBottom: '12px' }}>
//           {event.summary}
//         </p>
//       )}

//       {/* Key stats */}
//       <div style={{
//         display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px'
//       }}>
//         {[
//           ['📍 Location', event.location_name],
//           ['📡 Signals', `${event.signal_count} sources`],
//           event.price_aed ? ['💰 Price', `AED ${(event.price_aed/1000000).toFixed(1)}M`] : ['🔖 Category', CATEGORY_LABELS[event.category]],
//           ['📰 Primary Source', event.source],
//         ].map(([label, val]) => (
//           <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '8px' }}>
//             <div style={{ fontSize: '9px', color: '#666', marginBottom: '2px' }}>{label}</div>
//             <div style={{ fontSize: '11px', color: '#FAFAFA', fontWeight: 600 }}>{val}</div>
//           </div>
//         ))}
//       </div>

//       {/* Source signals */}
//       {event.signals && event.signals.length > 0 && (
//         <div style={{ marginBottom: '12px' }}>
//           <div style={{ fontSize: '10px', color: '#B87333', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
//             Signal Sources
//           </div>
//           {event.signals.map((sig, i) => (
//             <div key={i} style={{
//               display: 'flex', alignItems: 'flex-start', gap: '8px',
//               padding: '6px 0', borderBottom: '1px solid #0F3460'
//             }}>
//               <span style={{
//                 fontSize: '9px', fontWeight: 700, padding: '2px 5px', borderRadius: '3px',
//                 background: 'rgba(184,115,51,0.15)', color: '#B87333', flexShrink: 0, marginTop: '1px'
//               }}>{sig.source}</span>
//               <div style={{ flex: 1 }}>
//                 <div style={{ fontSize: '11px', color: '#FAFAFA', lineHeight: 1.3 }}>{sig.snippet}</div>
//                 {sig.url && (
//                   <a href={sig.url} target="_blank" rel="noopener noreferrer"
//                     style={{ fontSize: '10px', color: '#B87333', textDecoration: 'none', borderBottom: '1px dotted #B87333' }}>
//                     ↗ View source
//                   </a>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Area Context */}
//       <div style={{marginTop:'10px', padding:'8px 10px', background:'rgba(184,115,51,0.06)', borderRadius:'4px', border:'1px solid rgba(184,115,51,0.15)', marginBottom: '12px'}}>
//         <div style={{fontSize:'9px', fontWeight:700, color:'#B87333', letterSpacing:'0.5px', marginBottom:'4px'}}>AREA CONTEXT</div>
//         <div style={{fontSize:'11px', color:'#B3B3B3'}}>
//           📍 {event.location_name} · {CATEGORY_LABELS[event.category] || event.category} signal
//         </div>
//         <div style={{fontSize:'10px', color:'#555', marginTop:'3px'}}>
//           Track this area in your Watchlist for alerts
//         </div>
//       </div>

//       {/* ACQAR CTAs */}
//       <div style={{ borderTop: '1px solid #0F3460', paddingTop: '12px' }}>
//         <div style={{ fontSize: '10px', color: '#B87333', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
//           ACQAR Intelligence
//         </div>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
//           <a href="http://www.acqar.com/" target="_blank" rel="noopener noreferrer"
//             style={{
//               display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//               padding: '8px 10px', background: 'rgba(184,115,51,0.15)',
//               border: '1px solid #B87333', borderRadius: '6px', textDecoration: 'none',
//             }}>
//             <div>
//               <div style={{ fontSize: '11px', fontWeight: 700, color: '#B87333' }}>🏷️ ValuCheck™ — Free</div>
           
//             </div>
//             <span style={{ color: '#B87333', fontSize: '14px' }}>→</span>
//           </a>
//           <a href="https://acqar.ai" target="_blank" rel="noopener noreferrer"
//             style={{
//               display: 'none', alignItems: 'center', justifyContent: 'space-between',
//               padding: '8px 10px', background: 'rgba(41,128,185,0.1)',
//               border: '1px solid #2980B9', borderRadius: '6px', textDecoration: 'none',
//             }}>
//             {/* <div> */}
              
//               {/* <div style={{ fontSize: '10px', color: '#B3B3B3' }}>Buy/Pass rating + 3-year prediction</div> */}
//             {/* </div> */}
//             {/* <span style={{ color: '#2980B9', fontSize: '14px' }}>→</span> */}
//           </a>
//         </div>
//       </div>
//     </div>
//   )
// }



import { useEvents } from '../context/EventsContext'
import { useState } from 'react'

function confidenceLabel(score) {
  const pct = Math.round((score || 0) * 100)
  if (pct < 20) return `${pct}% — Unconfirmed`
  if (pct < 40) return `${pct}% — Low confidence`
  if (pct < 60) return `${pct}% — Developing`
  if (pct < 80) return `${pct}% — Probable`
  if (pct < 95) return `${pct}% — High confidence`
  return `${pct}% — Confirmed`
}

const CATEGORY_COLORS = {
  transaction: '#E74C3C', offplan: '#2980B9', construction: '#F39C12',
  regulatory: '#8E44AD', infrastructure: '#27AE60', investment: '#16A085'
}

const CATEGORY_LABELS = {
  transaction: 'Transaction', offplan: 'Off-Plan', construction: 'Construction',
  regulatory: 'Regulatory', infrastructure: 'Infrastructure', investment: 'Investment'
}

// export default function EventDetail({ hidden = false }) {
export default function EventDetail({ hidden = false, onClose }) {
  const { selectedEvent: event, setSelectedEvent } = useEvents()
  const [copied, setCopied] = useState(false)
  // if (!event) return null
  if (!event || hidden) return null

  const catColor = CATEGORY_COLORS[event.category] || '#B87333'
  const confPct = Math.round((event.confidence || 0) * 100)

  const copyLink = () => {
    const url = `${window.location.origin}/#event/${event.id}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: '#0D1B2A',
      border: '1px solid #B87333',
      borderBottom: 'none',
      borderRadius: '8px 8px 0 0',
      padding: '14px',
      zIndex: hidden ? 0 : 50,
      pointerEvents: hidden ? 'none' : 'auto',
      maxHeight: '60%',
      overflowY: 'auto',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.6)',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px',
              background: catColor + '22', color: catColor, letterSpacing: '0.5px'
            }}>{CATEGORY_LABELS[event.category] || event.category}</span>
            <span style={{
              fontSize: '9px', fontWeight: 700, padding: '2px 5px', borderRadius: '3px',
              background: 'rgba(184,115,51,0.2)', color: '#B87333'
            }}>S{event.severity}</span>
            <span style={{fontSize:'11px', color:'#FAFAFA', fontWeight:600}}>
              {confidenceLabel(event.confidence)}
            </span>
            <div style={{ flex: 1 }}></div>
            <button
              onClick={copyLink}
              title={copied ? 'Link copied!' : 'Copy link'}
              style={{
                background:'none', border:'none', cursor:'pointer',
                color: copied ? '#27AE60' : '#555',
                fontSize:'13px', padding:'2px 4px',
                transition:'color 0.2s',
              }}>
              {copied ? '✓' : '🔗'}
            </button>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#FAFAFA', lineHeight: 1.35 }}>
            {event.title}
          </div>
        </div>
        <button
          // onClick={() => setSelectedEvent(null)}
          onClick={() => { setSelectedEvent(null); if (onClose) onClose(); }}
          style={{
            background: 'none', border: '1px solid #333', color: '#B3B3B3',
            borderRadius: '4px', cursor: 'pointer', fontSize: '12px',
            padding: '2px 6px', flexShrink: 0
          }}
        >✕</button>
      </div>

      {/* Summary */}
      {event.summary && (
        <p style={{ fontSize: '12px', color: '#B3B3B3', lineHeight: 1.5, marginBottom: '12px' }}>
          {event.summary}
        </p>
      )}

      {/* Key stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px'
      }}>
        {[
          ['📍 Location', event.location_name],
          ['📡 Signals', `${event.signal_count} sources`],
          event.price_aed ? ['💰 Price', `AED ${(event.price_aed/1000000).toFixed(1)}M`] : ['🔖 Category', CATEGORY_LABELS[event.category]],
          ['📰 Primary Source', event.source],
        ].map(([label, val]) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '8px' }}>
            <div style={{ fontSize: '9px', color: '#666', marginBottom: '2px' }}>{label}</div>
            <div style={{ fontSize: '11px', color: '#FAFAFA', fontWeight: 600 }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Source signals */}
      {event.signals && event.signals.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', color: '#B87333', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Signal Sources
          </div>
          {event.signals.map((sig, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '8px',
              padding: '6px 0', borderBottom: '1px solid #0F3460'
            }}>
              <span style={{
                fontSize: '9px', fontWeight: 700, padding: '2px 5px', borderRadius: '3px',
                background: 'rgba(184,115,51,0.15)', color: '#B87333', flexShrink: 0, marginTop: '1px'
              }}>{sig.source}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#FAFAFA', lineHeight: 1.3 }}>{sig.snippet}</div>
                {sig.url && (
                  <a href={sig.url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '10px', color: '#B87333', textDecoration: 'none', borderBottom: '1px dotted #B87333' }}>
                    ↗ View source
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Area Context */}
      <div style={{marginTop:'10px', padding:'8px 10px', background:'rgba(184,115,51,0.06)', borderRadius:'4px', border:'1px solid rgba(184,115,51,0.15)', marginBottom: '12px'}}>
        <div style={{fontSize:'9px', fontWeight:700, color:'#B87333', letterSpacing:'0.5px', marginBottom:'4px'}}>AREA CONTEXT</div>
        <div style={{fontSize:'11px', color:'#B3B3B3'}}>
          📍 {event.location_name} · {CATEGORY_LABELS[event.category] || event.category} signal
        </div>
        <div style={{fontSize:'10px', color:'#555', marginTop:'3px'}}>
          Track this area in your Watchlist for alerts
        </div>
      </div>

      {/* ACQAR CTAs */}
      <div style={{ borderTop: '1px solid #0F3460', paddingTop: '12px' }}>
        <div style={{ fontSize: '10px', color: '#B87333', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          ACQAR Intelligence
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <a href=https://www.acqar.com/truvalu" target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 10px', background: 'rgba(184,115,51,0.15)',
              border: '1px solid #B87333', borderRadius: '6px', textDecoration: 'none',
            }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#B87333' }}>🏷️ TRUVALU™ — Free</div>
            </div>
            <span style={{ color: '#B87333', fontSize: '14px' }}>→</span>
          </a>
        </div>
      </div>
    </div>
  )
}
