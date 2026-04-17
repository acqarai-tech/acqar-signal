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

// // export default function EventDetail({ hidden = false }) {
// export default function EventDetail({ hidden = false, onClose }) {
//   const { selectedEvent: event, setSelectedEvent } = useEvents()
//   const [copied, setCopied] = useState(false)
//   // if (!event) return null
//   if (!event || hidden) return null

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
//       zIndex: hidden ? 0 : 50,
//       pointerEvents: hidden ? 'none' : 'auto',
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
//           // onClick={() => setSelectedEvent(null)}
//           onClick={() => { setSelectedEvent(null); if (onClose) onClose(); }}
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
//           <a href="https://www.acqar.com/truvalu" target="_blank" rel="noopener noreferrer"
//             style={{
//               display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//               padding: '8px 10px', background: 'rgba(184,115,51,0.15)',
//               border: '1px solid #B87333', borderRadius: '6px', textDecoration: 'none',
//             }}>
//             <div>
//               <div style={{ fontSize: '11px', fontWeight: 700, color: '#B87333' }}>🏷️ TRUVALU™ — Free</div>
//             </div>
//             <span style={{ color: '#B87333', fontSize: '14px' }}>→</span>
//           </a>
//         </div>
//       </div>
//     </div>
//   )
// }










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

// // export default function EventDetail({ hidden = false }) {
// export default function EventDetail({ hidden = false, onClose }) {
//   const { selectedEvent: event, setSelectedEvent } = useEvents()
//   const [copied, setCopied] = useState(false)
//   // if (!event) return null
//   if (!event || hidden) return null

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
//       zIndex: hidden ? 0 : 50,
//       pointerEvents: hidden ? 'none' : 'auto',
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
//           // onClick={() => setSelectedEvent(null)}
//           onClick={() => { setSelectedEvent(null); if (onClose) onClose(); }}
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

// {/* PRIMARY SOURCE BUTTON — like Distress Deal */}
// {event.url && (
//   <div style={{ marginBottom: 14 }}>
//     <a
//       href={event.url}
//       target="_blank"
//       rel="noopener noreferrer"
//       style={{
//         display: 'inline-flex', alignItems: 'center', gap: 8,
//         padding: '10px 22px', background: '#DC2626', color: '#fff',
//         borderRadius: 8, fontSize: 10, fontWeight: 900,
//         textDecoration: 'none', letterSpacing: '0.1em',
//         textTransform: 'uppercase',
//       }}
//     >
//       VIEW SOURCE — {(event.source || 'LINK').toUpperCase()} →
//     </a>
//   </div>
// )}
//       {/* ACQAR CTAs */}
      
//       <div style={{ borderTop: '1px solid #0F3460', paddingTop: '12px' }}>
//         <div style={{ fontSize: '10px', color: '#B87333', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
//           ACQAR Intelligence
//         </div>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
//           <a href="https://www.acqar.com/truvalu" target="_blank" rel="noopener noreferrer"
//             style={{
//               display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//               padding: '8px 10px', background: 'rgba(184,115,51,0.15)',
//               border: '1px solid #B87333', borderRadius: '6px', textDecoration: 'none',
//             }}>
//             <div>
//               <div style={{ fontSize: '11px', fontWeight: 700, color: '#B87333' }}>🏷️ TRUVALU™ — Free</div>
//             </div>
//             <span style={{ color: '#B87333', fontSize: '14px' }}>→</span>
//           </a>
//         </div>
//       </div>
//     </div>
//   )
// }



















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

// export default function EventDetail({ hidden = false, onClose }) {
//   const { selectedEvent: event, setSelectedEvent } = useEvents()

//   if (!event || hidden) return null

//   const catColor = CATEGORY_COLORS[event.category] || '#B87333'

//   function close() {
//     setSelectedEvent(null)
//     if (onClose) onClose()
//   }

//   return (
//     // ── STEP 2: Overlay backdrop ──
//     <div
//       onClick={e => { if (e.target === e.currentTarget) close() }}
//       style={{
//         position: 'fixed', inset: 0,
//         background: 'rgba(0,0,0,0.65)',
//         zIndex: 100000,
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         padding: 20,
//       }}
//     >
//       {/* ── STEP 3: Modal card ── */}
//       <div style={{
//         background: '#0D1B2A',
//         border: '1px solid #B87333',
//         borderRadius: 16,
//         width: '100%', maxWidth: 560,
//         maxHeight: '85vh', overflowY: 'auto',
//         padding: 24,
//         boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
//         fontFamily: "'Inter', sans-serif",
//         position: 'relative',
//       }}>

//         {/* ── STEP 4: Close button ── */}
//         <button
//           onClick={close}
//           style={{
//             position: 'absolute', top: 14, right: 16,
//             background: 'none', border: '1px solid #333',
//             fontSize: 14, cursor: 'pointer',
//             color: '#B3B3B3', borderRadius: 4, padding: '2px 8px',
//           }}
//         >✕</button>

//         {/* ── STEP 5: Top label ── */}
//         <div style={{
//           fontSize: 9, fontWeight: 900, color: '#B87333',
//           letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10,
//         }}>
//           MARKET SIGNAL
//         </div>

//         {/* ── STEP 6: Title ── */}
//         <h3 style={{
//           fontSize: 16, fontWeight: 900, color: '#FAFAFA',
//           marginBottom: 10, lineHeight: 1.4, paddingRight: 32,
//         }}>
//           {event.title}
//         </h3>

//         {/* ── STEP 7: Meta row ── */}
//         <div style={{
//           display: 'flex', gap: 8, marginBottom: 20,
//           fontSize: 10, color: '#666', fontWeight: 600,
//           flexWrap: 'wrap', alignItems: 'center',
//         }}>
//           <span style={{
//             padding: '2px 8px', borderRadius: 4,
//             background: catColor + '22', color: catColor,
//             fontWeight: 700, fontSize: 9, letterSpacing: '0.5px',
//           }}>
//             {CATEGORY_LABELS[event.category] || event.category}
//           </span>
//           <span>·</span>
//           <span style={{ color: '#999' }}>{event.location_name}</span>
//           <span>·</span>
//           <span style={{ color: '#999' }}>Severity {event.severity}</span>
//           <span>·</span>
//           <span style={{ color: '#999' }}>{confidenceLabel(event.confidence)}</span>
//         </div>

        

        
//         {/* ── STEP 10: Signal sources ── */}
//         {event.signals && event.signals.length > 0 && (
//           <div style={{ marginBottom: 20 }}>
//             <div style={{
//               fontSize: 10, color: '#B87333', fontWeight: 700,
//               marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px',
//             }}>
//               Signal Sources
//             </div>
//             {event.signals.map((sig, i) => (
//               <div key={i} style={{
//                 display: 'flex', alignItems: 'flex-start', gap: 8,
//                 padding: '8px 0', borderBottom: '1px solid #0F3460',
//               }}>
//                 <span style={{
//                   fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 3,
//                   background: 'rgba(184,115,51,0.15)', color: '#B87333',
//                   flexShrink: 0, marginTop: 1,
//                 }}>{sig.source}</span>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: 11, color: '#FAFAFA', lineHeight: 1.4 }}>
//                     {sig.snippet}
//                   </div>
//                   {sig.url && (
//                     <a
//                       href={sig.url} target="_blank" rel="noopener noreferrer"
//                       style={{
//                         fontSize: 10, color: '#B87333',
//                         textDecoration: 'none', borderBottom: '1px dotted #B87333',
//                       }}
//                     >
//                       ↗ View source
//                     </a>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ── STEP 11: Source button at the bottom ── */}
//         {event.url && (
//           <div style={{
//             marginTop: 24, paddingTop: 16,
//             borderTop: '1px solid #0F3460',
//           }}>
//             <div style={{
//               fontSize: 10, fontWeight: 900, color: '#B87333',
//               letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12,
//             }}>
//               PRIMARY SOURCE
//             </div>
//             <a
//               href={event.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{
//                 display: 'inline-flex', alignItems: 'center',
//                 justifyContent: 'center', gap: 8,
//                 width: '100%', padding: '14px 22px',
//                 background: '#B87333', color: '#fff',
//                 borderRadius: 12, fontSize: 13, fontWeight: 700,
//                 textDecoration: 'none', letterSpacing: '0.02em',
//                 boxShadow: '0 8px 32px rgba(184,115,51,0.30)',
//               }}
//             >
//               VIEW SOURCE — {(event.source || 'LINK').toUpperCase()} →
//             </a>

// <a
            
//               href="https://www.acqar.com/valuation"
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{
//                 display: 'inline-flex', alignItems: 'center',
//                 justifyContent: 'center', gap: 8,
//                 width: '100%', padding: '14px 22px',
//                 background: 'rgba(184,115,51,0.15)', color: '#B87333',
//                 borderRadius: 12, fontSize: 13, fontWeight: 700,
//                 textDecoration: 'none', letterSpacing: '0.02em',
//                 border: '1px solid #B87333',
//                 marginTop: 10,
//               }}
//             >
//               GET PROPERTY VALUATION NOW
//             </a>
//           </div>
//         )}
          


//       </div>
//     </div>
//   )
// }



















import { useEvents } from '../context/EventsContext'
import { useState, useEffect } from 'react'

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

function SignalPreview({ url, label, snippet, title }) {
  const [open, setOpen] = useState(false)

  // Convert snippet text into bullet points by splitting on sentences
  function toBullets(text) {
    if (!text) return []
    return text
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 20)
      .slice(0, 6)
  }

  const bullets = toBullets(snippet)

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{
      fontSize: 10, color: '#B87333', background: 'none',
      border: '1px dotted #B87333', borderRadius: 4,
      padding: '2px 8px', cursor: 'pointer', marginTop: 6,
    }}>
      📄 View Key Points
    </button>
  )

  return (
    <div style={{
      marginTop: 8, border: '1px solid #1a3a5c',
      borderRadius: 8, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(184,115,51,0.10)',
        padding: '6px 10px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid #1a3a5c',
      }}>
        <span style={{ fontSize: 10, color: '#B87333', fontWeight: 700 }}>
          {label}
        </span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 10, color: '#B87333', textDecoration: 'none' }}>
              ↗ Open original
            </a>
          )}
          <button onClick={() => setOpen(false)} style={{
            background: 'none', border: 'none',
            color: '#666', fontSize: 13, cursor: 'pointer',
          }}>✕</button>
        </div>
      </div>

      {/* Bullet points */}
      <div style={{ padding: '12px 14px' }}>
        <div style={{ padding: '12px 14px' }}>
  {/* Show snippet if it has real content, otherwise show message */}
  {snippet && snippet.length > 60 ? (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
      {toBullets(snippet).map((point, i) => (
        <li key={i} style={{
          display: 'flex', gap: 8,
          alignItems: 'flex-start', marginBottom: 8,
        }}>
          <span style={{
            color: '#B87333', fontWeight: 900,
            fontSize: 12, flexShrink: 0,
          }}>•</span>
          <span style={{ fontSize: 11, color: '#B3B3B3', lineHeight: 1.7 }}>
            {point}
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <div style={{ fontSize: 11, color: '#666', lineHeight: 1.7 }}>
      <div style={{ marginBottom: 8 }}>
        📄 <span style={{ color: '#B3B3B3' }}>{snippet}</span>
      </div>
      <div style={{ fontSize: 10, color: '#555' }}>
        Full content available on source website.
      </div>
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer"
          style={{
            fontSize: 11, color: '#B87333', textDecoration: 'none',
            borderBottom: '1px dotted #B87333', display: 'inline-block',
            marginTop: 6, fontWeight: 600,
          }}>
          ↗ Read full article on {label}
        </a>
      )}
    </div>
  )}
</div>
          
      </div>
    </div>
  )
}


function MiniBrowser({ url, label, onClose }) {
  const [status, setStatus] = useState('loading')
  const [article, setArticle] = useState(null)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    fetchArticle(url)
  }, [url])

  async function fetchArticle(targetUrl) {
    setStatus('loading')
    try {
      const res = await fetch(`${API_URL}/api/article/fetch?url=${encodeURIComponent(targetUrl)}`)
      const data = await res.json()
      if (data.success && data.content) {
        setArticle(data)
        setStatus('loaded')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{
      marginTop: 10, border: '1px solid #B87333',
      borderRadius: 10, overflow: 'hidden', background: '#0a1520',
    }}>
      {/* Top bar */}
      <div style={{
        background: '#0F2030', borderBottom: '1px solid #1a3a5c',
        padding: '6px 10px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 10, color: '#B87333', fontWeight: 700 }}>{label}</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href={url} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 10, color: '#B87333', textDecoration: 'none' }}>
            ↗ Open original
          </a>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            color: '#666', fontSize: 13, cursor: 'pointer',
          }}>✕</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxHeight: 320, overflowY: 'auto', padding: '14px 16px' }}>
        {status === 'loading' && (
          <div style={{ fontSize: 11, color: '#666', textAlign: 'center', padding: 20 }}>
            ⏳ Fetching article...
          </div>
        )}
        {status === 'error' && (
          <div style={{ fontSize: 11, color: '#666', textAlign: 'center', padding: 20 }}>
            🔒 Could not load article.{' '}
            <a href={url} target="_blank" rel="noopener noreferrer"
              style={{ color: '#B87333', textDecoration: 'none', borderBottom: '1px dotted #B87333' }}>
              Click here to view source ↗
            </a>
          </div>
        )}
        {status === 'loaded' && article && (
          <>
            {article.title && (
              <div style={{
                fontSize: 13, fontWeight: 700, color: '#FAFAFA',
                marginBottom: 10, lineHeight: 1.4,
              }}>
                {article.title}
              </div>
            )}
            <div style={{ borderTop: '1px solid #1a3a5c', marginBottom: 10 }} />
            {article.content.split('\n\n').map((para, i) => (
              para.trim() && (
                <p key={i} style={{
                  fontSize: 12, color: '#B3B3B3',
                  lineHeight: 1.8, marginBottom: 10, marginTop: 0,
                }}>
                  {para.trim()}
                </p>
              )
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default function EventDetail({ hidden = false, onClose }) {
  const { selectedEvent: event, setSelectedEvent } = useEvents()

  if (!event || hidden) return null

  const catColor = CATEGORY_COLORS[event.category] || '#B87333'

  function close() {
    setSelectedEvent(null)
    if (onClose) onClose()
  }

  return (
    // ── STEP 2: Overlay backdrop ──
    <div
      onClick={e => { if (e.target === e.currentTarget) close() }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.65)',
        zIndex: 100000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      {/* ── STEP 3: Modal card ── */}
      <div style={{
        background: '#0D1B2A',
        border: '1px solid #B87333',
        borderRadius: 16,
        width: '100%', maxWidth: 560,
        maxHeight: '85vh', overflowY: 'auto',
        padding: 24,
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
      }}>

        {/* ── STEP 4: Close button ── */}
        <button
          onClick={close}
          style={{
            position: 'absolute', top: 14, right: 16,
            background: 'none', border: '1px solid #333',
            fontSize: 14, cursor: 'pointer',
            color: '#B3B3B3', borderRadius: 4, padding: '2px 8px',
          }}
        >✕</button>

        {/* ── STEP 5: Top label ── */}
        <div style={{
          fontSize: 9, fontWeight: 900, color: '#B87333',
          letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10,
        }}>
          MARKET SIGNAL
        </div>

        {/* ── STEP 6: Title ── */}
        <h3 style={{
          fontSize: 16, fontWeight: 900, color: '#FAFAFA',
          marginBottom: 10, lineHeight: 1.4, paddingRight: 32,
        }}>
          {event.title}
        </h3>

        {/* ── STEP 7: Meta row ── */}
        <div style={{
          display: 'flex', gap: 8, marginBottom: 20,
          fontSize: 10, color: '#666', fontWeight: 600,
          flexWrap: 'wrap', alignItems: 'center',
        }}>
          <span style={{
            padding: '2px 8px', borderRadius: 4,
            background: catColor + '22', color: catColor,
            fontWeight: 700, fontSize: 9, letterSpacing: '0.5px',
          }}>
            {CATEGORY_LABELS[event.category] || event.category}
          </span>
          <span>·</span>
          <span style={{ color: '#999' }}>{event.location_name}</span>
          <span>·</span>
          <span style={{ color: '#999' }}>Severity {event.severity}</span>
          <span>·</span>
          <span style={{ color: '#999' }}>{confidenceLabel(event.confidence)}</span>
        </div>

        

        
        {/* ── STEP 10: Signal sources ── */}
        {event.signals && event.signals.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 10, color: '#B87333', fontWeight: 700,
              marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>
              Signal Sources
            </div>
            {event.signals.map((sig, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                padding: '8px 0', borderBottom: '1px solid #0F3460',
              }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 3,
                  background: 'rgba(184,115,51,0.15)', color: '#B87333',
                  flexShrink: 0, marginTop: 1,
                }}>{sig.source}</span>
                <div style={{ flex: 1 }}>
  {/* Summary paragraph */}
  <div style={{ fontSize: 11, color: '#B3B3B3', lineHeight: 1.7, marginBottom: 6 }}>
    {sig.snippet}
  </div>
  {/* View Content button + MiniBrowser */}
  {sig.url && (
  <SignalPreview
    url={sig.url}
    label={sig.source}
    snippet={sig.snippet}
    title={sig.snippet}
  />
)}
</div>
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 11: Source button at the bottom ── */}
        {event.url && (
          <div style={{
            marginTop: 24, paddingTop: 16,
            borderTop: '1px solid #0F3460',
          }}>
            <div style={{
              fontSize: 10, fontWeight: 900, color: '#B87333',
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12,
            }}>
              PRIMARY SOURCE
            </div>
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                width: '100%', padding: '14px 22px',
                background: '#B87333', color: '#fff',
                borderRadius: 12, fontSize: 13, fontWeight: 700,
                textDecoration: 'none', letterSpacing: '0.02em',
                boxShadow: '0 8px 32px rgba(184,115,51,0.30)',
              }}
            >
              VIEW SOURCE — {(event.source || 'LINK').toUpperCase()} →
            </a>

<a
            
              href="https://www.acqar.com/valuation"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                width: '100%', padding: '14px 22px',
                background: 'rgba(184,115,51,0.15)', color: '#B87333',
                borderRadius: 12, fontSize: 13, fontWeight: 700,
                textDecoration: 'none', letterSpacing: '0.02em',
                border: '1px solid #B87333',
                marginTop: 10,
              }}
            >
              GET PROPERTY VALUATION NOW
            </a>
          </div>
        )}
          


      </div>
    </div>
  )
}
