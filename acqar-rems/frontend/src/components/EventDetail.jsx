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

        {/* ── STEP 8: Summary ── */}
        {event.summary && (
          <p style={{
            fontSize: 13, color: '#B3B3B3', lineHeight: 1.75,
            marginBottom: 20, whiteSpace: 'pre-wrap',
          }}>
            {event.summary}
          </p>
        )}

        {/* ── STEP 9: Key stats grid ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 8, marginBottom: 20,
        }}>
          {[
            ['📍 Location', event.location_name],
            ['📡 Signals', `${event.signal_count} sources`],
            event.price_aed
              ? ['💰 Price', `AED ${(event.price_aed / 1000000).toFixed(1)}M`]
              : ['🔖 Category', CATEGORY_LABELS[event.category]],
            ['📰 Source', event.source],
          ].map(([label, val]) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 6, padding: 10,
            }}>
              <div style={{ fontSize: 9, color: '#555', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 11, color: '#FAFAFA', fontWeight: 600 }}>{val}</div>
            </div>
          ))}
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
                  <div style={{ fontSize: 11, color: '#FAFAFA', lineHeight: 1.4 }}>
                    {sig.snippet}
                  </div>
                  {sig.url && (
                    <a
                      href={sig.url} target="_blank" rel="noopener noreferrer"
                      style={{
                        fontSize: 10, color: '#B87333',
                        textDecoration: 'none', borderBottom: '1px dotted #B87333',
                      }}
                    >
                      ↗ View source
                    </a>
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













// import { useEvents } from '../context/EventsContext'
// import { useState, useEffect } from 'react'
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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

// // ── Mini Browser Component ──
// // ── Mini Browser Component — NO iframe, uses backend article fetch ──
// function MiniBrowser({ url, label, onClose }) {
//   const [status, setStatus] = useState('loading')
//   const [article, setArticle] = useState(null)
//   const [inputUrl, setInputUrl] = useState(url)
//   const [currentUrl, setCurrentUrl] = useState(url)

//   useEffect(() => {
//     fetchArticle(currentUrl)
//   }, [currentUrl])

//   async function fetchArticle(targetUrl) {
//   setStatus('loading')
//   setArticle(null)

//   try {
//     let articleUrl = targetUrl

//     // ── If Google News URL, resolve the real URL first via frontend ──
//     if (targetUrl.includes('news.google.com') || targetUrl.includes('linkedin.com')) {
//       try {
//         // Use a CORS proxy to follow the redirect and get final URL
//         const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
//         const headResp = await fetch(proxyUrl, { method: 'GET', redirect: 'follow' })
//         const finalUrl = headResp.url

//         // corsproxy.io wraps it, extract the real URL
//         if (finalUrl && !finalUrl.includes('google.com') && !finalUrl.includes('corsproxy')) {
//           articleUrl = finalUrl
//         } else {
//           // Try to extract from response HTML
//           const html = await headResp.text()
//           const match = html.match(/href="(https?:\/\/(?!.*google\.com)[^"]+)"/)
//           if (match) articleUrl = match[1]
//         }
//       } catch {
//         // keep original URL
//       }
//     }

//     // ── Now send the real URL to backend ──
//     const res = await fetch(`${API_URL}/api/article/fetch?url=${encodeURIComponent(articleUrl)}`)
//     const data = await res.json()

//     if (data.success && data.content) {
//       setArticle(data)
//       setStatus('loaded')
//     } else {
//       setStatus('error')
//     }
//   } catch {
//     setStatus('error')
//   }
// }

//   function navigate() { setCurrentUrl(inputUrl) }
//   function handleKeyDown(e) { if (e.key === 'Enter') navigate() }

//   return (
//     <div style={{
//       marginTop: 12, border: '1px solid #B87333',
//       borderRadius: 10, overflow: 'hidden', background: '#0a1520',
//     }}>

//       {/* Top Bar */}
//       <div style={{
//         background: '#0F2030', borderBottom: '1px solid #B87333',
//         padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 8,
//       }}>
//         <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
//           <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#E74C3C' }} />
//           <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F39C12' }} />
//           <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27AE60' }} />
//         </div>
//         <input
//           value={inputUrl}
//           onChange={e => setInputUrl(e.target.value)}
//           onKeyDown={handleKeyDown}
//           style={{
//             flex: 1, background: '#081525', border: '1px solid #1a3a5c',
//             borderRadius: 5, padding: '3px 8px', fontSize: 10,
//             color: '#B3B3B3', outline: 'none', fontFamily: 'monospace',
//           }}
//         />
//         <button onClick={navigate} style={{
//           background: '#B87333', border: 'none', borderRadius: 4,
//           color: '#fff', fontSize: 10, fontWeight: 700,
//           padding: '3px 8px', cursor: 'pointer', flexShrink: 0,
//         }}>Go</button>
//         <a href={currentUrl} target="_blank" rel="noopener noreferrer"
//           style={{ fontSize: 12, color: '#B87333', textDecoration: 'none', flexShrink: 0 }}>↗</a>
//         <button onClick={onClose} style={{
//           background: 'none', border: 'none', color: '#666',
//           fontSize: 13, cursor: 'pointer', flexShrink: 0,
//         }}>✕</button>
//       </div>

//       {/* Content */}
//       <div style={{ height: 420, overflowY: 'auto', background: '#081525' }}>

//         {status === 'loading' && (
//           <div style={{
//             height: '100%', display: 'flex', flexDirection: 'column',
//             alignItems: 'center', justifyContent: 'center', gap: 10,
//           }}>
//             <div style={{ fontSize: 22 }}>⏳</div>
//             <div style={{ fontSize: 11, color: '#666' }}>Fetching article...</div>
//           </div>
//         )}

//         {status === 'error' && (
//           <div style={{
//             height: '100%', display: 'flex', flexDirection: 'column',
//             alignItems: 'center', justifyContent: 'center', gap: 12,
//           }}>
//             <div style={{ fontSize: 28 }}>🔒</div>
//             <div style={{ fontSize: 12, color: '#666', textAlign: 'center', lineHeight: 1.6 }}>
//               Could not fetch article.<br />
//               <span style={{ color: '#B3B3B3' }}>{label}</span> may require a login.
//             </div>
//             <a href={currentUrl} target="_blank" rel="noopener noreferrer"
//               style={{
//                 fontSize: 12, color: '#B87333', fontWeight: 700,
//                 textDecoration: 'none', border: '1px solid #B87333',
//                 borderRadius: 6, padding: '6px 16px',
//               }}>
//               ↗ Open {label} in new tab
//             </a>
//           </div>
//         )}

//         {status === 'loaded' && article && (
//           <div style={{ padding: '16px 18px' }}>
//             <div style={{
//               display: 'inline-block', fontSize: 9, fontWeight: 700,
//               color: '#B87333', background: 'rgba(184,115,51,0.12)',
//               border: '1px solid rgba(184,115,51,0.3)', borderRadius: 4,
//               padding: '2px 7px', marginBottom: 10,
//               textTransform: 'uppercase', letterSpacing: '0.5px',
//             }}>{label}</div>

//             {article.title && (
//               <h2 style={{
//                 fontSize: 15, fontWeight: 800, color: '#FAFAFA',
//                 lineHeight: 1.4, marginBottom: 14, marginTop: 0,
//               }}>{article.title}</h2>
//             )}

//             <div style={{ borderTop: '1px solid #1a3a5c', marginBottom: 14 }} />

//             {article.content.split('\n\n').map((para, i) => (
//               para.trim() && (
//                 <p key={i} style={{
//                   fontSize: 12, color: '#B3B3B3',
//                   lineHeight: 1.85, marginBottom: 12, marginTop: 0,
//                 }}>{para.trim()}</p>
//               )
//             ))}

//             <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #1a3a5c' }}>
//               <a href={currentUrl} target="_blank" rel="noopener noreferrer"
//                 style={{
//                   fontSize: 11, color: '#B87333', fontWeight: 700,
//                   textDecoration: 'none', borderBottom: '1px dotted #B87333',
//                 }}>
//                 ↗ Read full article on {label}
//               </a>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Bottom bar */}
//       <div style={{
//         background: '#0F2030', borderTop: '1px solid #1a3a5c',
//         padding: '4px 10px', fontSize: 9, color: '#444',
//         display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//       }}>
//         <span style={{ color: status === 'loaded' ? '#27AE60' : status === 'error' ? '#E74C3C' : '#B87333' }}>
//           {status === 'loading' ? '⏳ Fetching...' : status === 'loaded' ? '✅ Article loaded' : '🔒 Could not load'}
//         </span>
//         <span style={{
//           fontFamily: 'monospace', overflow: 'hidden',
//           textOverflow: 'ellipsis', maxWidth: '70%', whiteSpace: 'nowrap',
//         }}>{currentUrl}</span>
//       </div>
//     </div>
//   )
// }


// function SourcePreview({ url, label }) {
//   const [status, setStatus] = useState('idle') // idle | loading | loaded | error
//   const [article, setArticle] = useState(null)

//   async function loadArticle() {
//   setStatus('loading')
//   try {
//     let articleUrl = url

//     // Resolve Google News URLs on frontend
//     if (url.includes('news.google.com') || url.includes('linkedin.com')) {
//       try {
//         const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`
//         const resp = await fetch(proxyUrl, { redirect: 'follow' })
//         const finalUrl = resp.url
//         if (finalUrl && !finalUrl.includes('google.com') && !finalUrl.includes('corsproxy')) {
//           articleUrl = finalUrl
//         } else {
//           const html = await resp.text()
//           const match = html.match(/href="(https?:\/\/(?!.*google\.com)[^"]+)"/)
//           if (match) articleUrl = match[1]
//         }
//       } catch {
//         // keep original
//       }
//     }

//     const res = await fetch(`${API_URL}/api/article/fetch?url=${encodeURIComponent(articleUrl)}`)
//     const data = await res.json()
//     if (data.success) {
//       setArticle(data)
//       setStatus('loaded')
//     } else {
//       setStatus('error')
//     }
//   } catch {
//     setStatus('error')
//   }
// }

//   if (status === 'idle') return (
//     <button onClick={loadArticle} style={{
//       fontSize: 10, color: '#B87333', background: 'none',
//       border: '1px dotted #B87333', borderRadius: 4,
//       padding: '2px 8px', cursor: 'pointer', marginTop: 6,
//     }}>
//       👁 Read article inline
//     </button>
//   )

//   if (status === 'loading') return (
//     <div style={{ fontSize: 10, color: '#666', marginTop: 6 }}>⏳ Loading article...</div>
//   )

//   if (status === 'error') return (
//     <div style={{
//       marginTop: 6, padding: '8px 10px',
//       background: 'rgba(255,255,255,0.03)',
//       border: '1px solid #1a3a5c', borderRadius: 6,
//     }}>
//       <div style={{ fontSize: 10, color: '#666', marginBottom: 4 }}>
//         🔒 This source blocks inline preview
//       </div>
//       <a href={url} target="_blank" rel="noopener noreferrer"
//         style={{
//           fontSize: 11, color: '#B87333', textDecoration: 'none',
//           borderBottom: '1px dotted #B87333', fontWeight: 600,
//         }}>
//         ↗ Read full article on {label}
//       </a>
//     </div>
//   )

//   return (
//     <div style={{
//       marginTop: 8, background: 'rgba(255,255,255,0.03)',
//       border: '1px solid #1a3a5c', borderRadius: 8, overflow: 'hidden',
//     }}>
//       <div style={{
//         display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//         background: 'rgba(184,115,51,0.10)', padding: '6px 10px',
//         borderBottom: '1px solid #1a3a5c',
//       }}>
//         <span style={{ fontSize: 10, color: '#B87333', fontWeight: 700 }}>{label}</span>
//         <div style={{ display: 'flex', gap: 10 }}>
//           <a href={url} target="_blank" rel="noopener noreferrer"
//             style={{ fontSize: 10, color: '#B87333', textDecoration: 'none' }}>↗ Open original</a>
//           <button onClick={() => setStatus('idle')}
//             style={{ fontSize: 10, color: '#666', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
//         </div>
//       </div>
//       <div style={{ padding: '12px 14px', maxHeight: 320, overflowY: 'auto' }}>
//         {article.title && (
//           <div style={{ fontSize: 13, fontWeight: 700, color: '#FAFAFA', marginBottom: 10, lineHeight: 1.4 }}>
//             {article.title}
//           </div>
//         )}
//         {article.content.split('\n\n').map((para, i) => (
//           <p key={i} style={{ fontSize: 12, color: '#B3B3B3', lineHeight: 1.7, marginBottom: 8 }}>
//             {para}
//           </p>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default function EventDetail({ hidden = false, onClose }) {
//   const { selectedEvent: event, setSelectedEvent } = useEvents()
//   const [showBrowser, setShowBrowser] = useState(false)  // ← controls mini browser

//   if (!event || hidden) return null

//   const catColor = CATEGORY_COLORS[event.category] || '#B87333'

//   function close() {
//     setSelectedEvent(null)
//     setShowBrowser(false)
//     if (onClose) onClose()
//   }

//   return (
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
//       <div style={{
//         background: '#0D1B2A',
//         border: '1px solid #B87333',
//         borderRadius: 16,
//         width: '100%',
//         // ── Wider when browser is open ──
//         maxWidth: showBrowser ? 900 : 560,
//         maxHeight: '90vh', overflowY: 'auto',
//         padding: 24,
//         boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
//         fontFamily: "'Inter', sans-serif",
//         position: 'relative',
//         transition: 'max-width 0.3s ease',
//       }}>

//         {/* Close button */}
//         <button
//           onClick={close}
//           style={{
//             position: 'absolute', top: 14, right: 16,
//             background: 'none', border: '1px solid #333',
//             fontSize: 14, cursor: 'pointer',
//             color: '#B3B3B3', borderRadius: 4, padding: '2px 8px',
//           }}
//         >✕</button>

//         {/* Top label */}
//         <div style={{
//           fontSize: 9, fontWeight: 900, color: '#B87333',
//           letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10,
//         }}>
//           MARKET SIGNAL
//         </div>

//         {/* Title */}
//         <h3 style={{
//           fontSize: 16, fontWeight: 900, color: '#FAFAFA',
//           marginBottom: 10, lineHeight: 1.4, paddingRight: 32,
//         }}>
//           {event.title}
//         </h3>

//         {/* Meta row */}
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

//         {/* Summary */}
//         {event.summary && (
//           <p style={{
//             fontSize: 13, color: '#B3B3B3', lineHeight: 1.75,
//             marginBottom: 20, whiteSpace: 'pre-wrap',
//           }}>
//             {event.summary}
//           </p>
//         )}

//         {/* Signal sources */}
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
//                   {sig.url && <SourcePreview url={sig.url} label={sig.source} />}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* PRIMARY SOURCE */}
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

//             {/* ── VIEW SOURCE button → opens mini browser ── */}
//             <button
//               onClick={() => setShowBrowser(prev => !prev)}
//               style={{
//                 display: 'inline-flex', alignItems: 'center',
//                 justifyContent: 'center', gap: 8,
//                 width: '100%', padding: '14px 22px',
//                 background: '#B87333', color: '#fff',
//                 borderRadius: 12, fontSize: 13, fontWeight: 700,
//                 border: 'none', cursor: 'pointer', letterSpacing: '0.02em',
//                 boxShadow: '0 8px 32px rgba(184,115,51,0.30)',
//               }}
//             >
//               {showBrowser
//                 ? '✕ CLOSE BROWSER'
//                 : `🌐 VIEW SOURCE — ${(event.source || 'LINK').toUpperCase()} →`}
//             </button>

//             {/* ── Mini Browser opens here ── */}
//             {showBrowser && (
//               <MiniBrowser
//                 url={event.url}
//                 label={event.source || 'Source'}
//                 onClose={() => setShowBrowser(false)}
//               />
//             )}

//             {/* Valuation button */}
//             <a
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
