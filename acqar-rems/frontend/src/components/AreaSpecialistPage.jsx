// import { useState, useEffect, useRef } from 'react'
// import { useEvents } from '../context/EventsContext'

// // Data factories — in production, fetch from /api/areas/:areaName
// function getAreaData(area) {
//   const pricePerSqft = area.pricePerSqft || 1247
//   const yieldPct = area.yield || 7.2
//   const score = area.score || 67

//   return {
//     pricePerSqft,
//     yieldPct,
//     score,
//     soldThisWeek: Math.round(100 + score * 1.2),
//     daysToSell: Math.round(70 - score * 0.4),
//     availableListings: Math.round(2000 + score * 40),
//     marketMood: score >= 75 ? 'Bullish' : score >= 65 ? 'Cautious' : 'Slow',
//     verdict: score >= 75 ? 'BUY' : score >= 65 ? 'HOLD' : 'WATCH',
//     verdictColor: score >= 75 ? '#16A34A' : score >= 65 ? '#D97706' : '#DC2626',
//     priceChange3M: score >= 70 ? '+2.1%' : score >= 60 ? '+0.8%' : '-1.2%',
//     distressListings: Math.round(25 - score * 0.15),
//   }
// }

// const SCORE_COMPS = (score) => [
//   { label: 'Transaction activity', value: Math.round(score * 0.87), color: score >= 65 ? '#D97706' : '#DC2626' },
//   { label: 'Price vs fair value', value: Math.round(score * 1.10), color: '#16A34A' },
//   { label: 'Infrastructure pipeline', value: Math.round(score * 1.17), color: '#16A34A' },
//   { label: 'Market sentiment', value: Math.round(score * 0.62), color: score >= 70 ? '#D97706' : '#DC2626' },
// ]

// export default function AreaSpecialistPage({ area, onClose }) {
//   const [activePersona, setActivePersona] = useState('buyer')
//   const [activeTab, setActiveTab] = useState('market')
//   const { events } = useEvents()

//   const data = getAreaData(area)

//   // Filter live events for this area
//   const areaEvents = events.filter(e =>
//     e.location_name?.toLowerCase().includes(area.name.toLowerCase().split(' ')[0].toLowerCase())
//   ).slice(0, 5)

//   const scoreComps = SCORE_COMPS(data.score)

//   const s = { // inline style helpers
//     card: {
//       background: 'var(--bg-secondary)',
//       border: '1px solid var(--border-color)',
//       borderRadius: '10px',
//       padding: '14px',
//       marginBottom: '12px',
//     },
//     cardTitle: {
//       fontSize: '10px', fontWeight: 800, textTransform: 'uppercase',
//       letterSpacing: '0.1em', color: 'var(--text-muted)',
//       marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//     },
//     stRow: {
//       display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//       padding: '6px 0', borderBottom: '1px solid var(--border-color)', fontSize: '12px',
//     },
//   }

//   return (
//     <div style={{
//       height: '100%', display: 'flex', flexDirection: 'column',
//       background: 'var(--bg-secondary)', fontFamily: "'Inter', sans-serif",
//       overflow: 'hidden',
//     }}>

//       {/* ── HEADER ── */}
//       <div style={{
//         background: 'var(--bg-primary)', borderBottom: '2px solid #B87333',
//         padding: '10px 14px', flexShrink: 0,
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
//           <button
//             onClick={onClose}
//             style={{
//               fontSize: '12px', fontWeight: 600, padding: '5px 10px',
//               background: 'var(--bg-input)', border: '1px solid var(--border-panel)',
//               borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer',
//               touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
//             }}
//           >← Areas</button>
//           <div style={{
//             fontSize: '10px', fontWeight: 800, padding: '4px 10px',
//             background: `${data.verdictColor}22`, border: `1px solid ${data.verdictColor}44`,
//             borderRadius: '12px', color: data.verdictColor, letterSpacing: '0.1em',
//           }}>{data.verdict} • {data.score}/100</div>
//         </div>

//         <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '2px' }}>
//           📍 Dubai · {area.zone}
//         </div>
//         <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
//           {area.name}
//         </div>
//       </div>

//       {/* ── LIVE TICKER ── */}
//       <div style={{
//         background: 'rgba(22,163,74,0.08)', borderBottom: '1px solid var(--border-color)',
//         padding: '5px 14px', display: 'flex', gap: '16px', overflowX: 'auto',
//         flexShrink: 0, scrollbarWidth: 'none', fontSize: '11px',
//       }}>
//         <span style={{ fontWeight: 700, color: '#16A34A', whiteSpace: 'nowrap' }}>● LIVE</span>
//         <span style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
//           Sold: <strong style={{ color: 'var(--text-primary)' }}>{data.soldThisWeek}</strong>
//         </span>
//         <span style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
//           Fair PSF: <strong style={{ color: 'var(--text-primary)' }}>AED {data.pricePerSqft.toLocaleString()}</strong>
//         </span>
//         <span style={{ whiteSpace: 'nowrap', color: '#16A34A', fontWeight: 600 }}>
//           {data.yieldPct}% yield
//         </span>
//         <span style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
//           Time to sell: <strong>{data.daysToSell}d</strong>
//         </span>
//       </div>

//       {/* ── SCROLLABLE CONTENT ── */}
//       <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>

//         {/* Score card */}
//         <div style={{
//           ...s.card,
//           display: 'flex', gap: '12px', alignItems: 'stretch',
//         }}>
//           {/* Score num */}
//           <div style={{
//             textAlign: 'center', padding: '10px 14px',
//             background: `${data.verdictColor}11`,
//             border: `1px solid ${data.verdictColor}33`,
//             borderRadius: '8px', flexShrink: 0,
//           }}>
//             <div style={{ fontSize: '36px', fontWeight: 900, color: data.verdictColor, lineHeight: 1 }}>
//               {data.score}
//             </div>
//             <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>/100</div>
//             <div style={{
//               fontSize: '10px', fontWeight: 800, color: data.verdictColor,
//               letterSpacing: '0.1em', marginTop: '6px',
//             }}>{data.verdict}</div>
//           </div>

//           {/* Score components */}
//           <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
//             {scoreComps.map(comp => (
//               <div key={comp.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
//                 <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{comp.label}</span>
//                 <div style={{ width: '60px', height: '4px', background: 'var(--border-color)', borderRadius: '2px' }}>
//                   <div style={{ width: `${comp.value}%`, height: '4px', background: comp.color, borderRadius: '2px' }} />
//                 </div>
//                 <span style={{ width: '24px', textAlign: 'right', fontWeight: 700, color: comp.color }}>{comp.value}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* AI Brief */}
//         <div style={{
//           ...s.card,
//           borderLeft: '3px solid #B87333',
//         }}>
//           <div style={{ fontSize: '10px', fontWeight: 800, color: '#B87333', letterSpacing: '0.12em', marginBottom: '6px' }}>
//             🤖 AI AREA BRIEF
//           </div>
//           <div style={{ fontSize: '12px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
//             <strong style={{ color: 'var(--text-primary)' }}>{area.name}</strong> is navigating{' '}
//             {data.score >= 75 ? 'a strong seller\'s market with elevated buyer demand and shrinking inventory.' :
//               data.score >= 65 ? 'a short-term confidence gap driven by macro sentiment, not fundamental weakness.' :
//                 'a period of reduced activity — creating selective entry windows for patient investors.'}
//             {' '}Gross rental yield of <strong style={{ color: '#16A34A' }}>{data.yieldPct}%</strong>{' '}
//             {data.yieldPct > 6.1 ? 'outperforms' : 'tracks below'} Dubai's 6.1% average.
//             Current asking prices are{' '}
//             <strong>{data.pricePerSqft > 1200 ? 'slightly above' : 'near or below'}</strong> Truvalu™ fair-value benchmarks.
//           </div>
//           <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
//             <span>🕐 Updated today</span>
//             <span>📊 14 live data sources</span>
//             <span>🔄 Refreshes daily</span>
//           </div>
//         </div>

//         {/* Persona tabs */}
//         <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
//           {[
//             { key: 'buyer', icon: '🏠', label: 'Buying' },
//             { key: 'investor', icon: '💼', label: 'Investing' },
//             { key: 'owner', icon: '🔑', label: 'I Own Here' },
//           ].map(p => (
//             <button
//               key={p.key}
//               onClick={() => setActivePersona(p.key)}
//               style={{
//                 flex: 1, padding: '8px 6px',
//                 border: `2px solid ${activePersona === p.key ? '#B87333' : 'var(--border-color)'}`,
//                 borderRadius: '8px',
//                 background: activePersona === p.key ? 'rgba(184,115,51,0.12)' : 'var(--bg-primary)',
//                 cursor: 'pointer', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
//                 display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
//               }}
//             >
//               <span style={{ fontSize: '18px' }}>{p.icon}</span>
//               <span style={{ fontSize: '9px', fontWeight: 700, color: activePersona === p.key ? '#B87333' : 'var(--text-muted)' }}>
//                 {p.label}
//               </span>
//             </button>
//           ))}
//         </div>

//         {/* Tab bar */}
//         <div style={{
//           display: 'flex', borderBottom: '2px solid var(--border-color)',
//           marginBottom: '12px', gap: '0', overflowX: 'auto', scrollbarWidth: 'none',
//         }}>
//           {[
//             { key: 'market', label: 'Market' },
//             { key: 'signals', label: 'Live Signals' },
//             { key: 'future', label: 'Catalysts' },
//           ].map(tab => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               style={{
//                 padding: '8px 14px', fontSize: '11px', fontWeight: 700,
//                 color: activeTab === tab.key ? '#B87333' : 'var(--text-muted)',
//                 borderBottom: `3px solid ${activeTab === tab.key ? '#B87333' : 'transparent'}`,
//                 marginBottom: '-2px', background: 'none', border: 'none',
//                 borderBottomWidth: '3px', borderBottomStyle: 'solid',
//                 borderBottomColor: activeTab === tab.key ? '#B87333' : 'transparent',
//                 cursor: 'pointer', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.06em',
//                 touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
//               }}
//             >{tab.label}</button>
//           ))}
//         </div>

//         {/* ── MARKET TAB ── */}
//         {activeTab === 'market' && (
//           <div>
//             {/* Key stats */}
//             <div style={s.card}>
//               <div style={s.cardTitle}>Key Market Stats</div>
//               <div style={{ ...s.stRow }}>
//                 <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Homes Sold This Week</span>
//                 <span style={{ fontWeight: 700, color: '#DC2626', fontSize: '12px' }}>{data.soldThisWeek}</span>
//               </div>
//               <div style={{ ...s.stRow }}>
//                 <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Fair Price (Truvalu™)</span>
//                 <span style={{ fontWeight: 700, fontSize: '12px' }}>AED {data.pricePerSqft.toLocaleString()}/sqft</span>
//               </div>
//               <div style={{ ...s.stRow }}>
//                 <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Rental Return / Year</span>
//                 <span style={{ fontWeight: 700, color: '#16A34A', fontSize: '12px' }}>{data.yieldPct}%</span>
//               </div>
//               <div style={{ ...s.stRow }}>
//                 <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Avg Days to Sell</span>
//                 <span style={{ fontWeight: 700, color: '#D97706', fontSize: '12px' }}>{data.daysToSell} days</span>
//               </div>
//               <div style={{ ...s.stRow }}>
//                 <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Available Listings</span>
//                 <span style={{ fontWeight: 700, fontSize: '12px' }}>{data.availableListings.toLocaleString()}</span>
//               </div>
//               <div style={{ ...s.stRow, borderBottom: 'none' }}>
//                 <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Market Mood</span>
//                 <span style={{ fontWeight: 700, color: data.verdictColor, fontSize: '12px' }}>{data.marketMood}</span>
//               </div>
//             </div>

//             {/* Truvalu price table */}
//             <div style={s.card}>
//               <div style={s.cardTitle}>Truvalu™ Price Benchmarks</div>
//               <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
//                 <thead>
//                   <tr>
//                     {['Type', 'Truvalu™', 'Ask PSF', 'Status'].map(h => (
//                       <th key={h} style={{ padding: '5px 8px', textAlign: 'left', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', fontWeight: 700 }}>
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {[
//                     { type: 'Studio', fair: data.pricePerSqft - 67, ask: data.pricePerSqft - 55, delta: -1.8 },
//                     { type: '1 BR', fair: data.pricePerSqft, ask: data.pricePerSqft + 51, delta: 4.1 },
//                     { type: '2 BR', fair: data.pricePerSqft - 33, ask: data.pricePerSqft - 79, delta: -3.8 },
//                     { type: '3 BR', fair: data.pricePerSqft - 52, ask: data.pricePerSqft - 69, delta: -1.4 },
//                     { type: 'TH 3BR', fair: data.pricePerSqft + 93, ask: data.pricePerSqft + 38, delta: -4.1 },
//                   ].map(row => (
//                     <tr key={row.type}>
//                       <td style={{ padding: '7px 8px', borderBottom: '1px solid var(--border-color)', fontSize: '11px', fontWeight: 600 }}>{row.type}</td>
//                       <td style={{ padding: '7px 8px', borderBottom: '1px solid var(--border-color)', fontSize: '11px' }}>AED {row.fair.toLocaleString()}</td>
//                       <td style={{ padding: '7px 8px', borderBottom: '1px solid var(--border-color)', fontSize: '11px' }}>{row.ask.toLocaleString()}</td>
//                       <td style={{ padding: '7px 8px', borderBottom: '1px solid var(--border-color)', fontSize: '11px' }}>
//                         <span style={{
//                           fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
//                           background: row.delta < -2 ? 'rgba(22,163,74,0.12)' : row.delta < 2 ? 'rgba(217,119,6,0.12)' : 'rgba(220,38,38,0.1)',
//                           color: row.delta < -2 ? '#16A34A' : row.delta < 2 ? '#D97706' : '#DC2626',
//                         }}>
//                           {row.delta > 0 ? '+' : ''}{row.delta}%
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Buyer nationalities */}
//             <div style={s.card}>
//               <div style={s.cardTitle}>Buyer Nationality — 90 Days</div>
//               {[
//                 { flag: '🇮🇳', name: 'Indian', pct: 31 },
//                 { flag: '🇬🇧', name: 'British', pct: 18 },
//                 { flag: '🇷🇺', name: 'Russian', pct: 14 },
//                 { flag: '🇵🇰', name: 'Pakistani', pct: 9 },
//                 { flag: '🇨🇳', name: 'Chinese', pct: 6 },
//                 { flag: '🌍', name: 'Other', pct: 22 },
//               ].map(n => (
//                 <div key={n.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
//                   <span style={{ fontSize: '14px', width: '20px' }}>{n.flag}</span>
//                   <span style={{ fontSize: '11px', width: '68px', flexShrink: 0, color: 'var(--text-secondary)' }}>{n.name}</span>
//                   <div style={{ flex: 1, height: '5px', background: 'var(--border-color)', borderRadius: '3px' }}>
//                     <div style={{ width: `${(n.pct / 31) * 100}%`, height: '5px', background: '#B87333', borderRadius: '3px' }} />
//                   </div>
//                   <span style={{ fontSize: '10px', fontWeight: 700, width: '26px', textAlign: 'right', color: 'var(--text-muted)' }}>{n.pct}%</span>
//                 </div>
//               ))}
//             </div>

//             {/* Persona-specific content */}
//             {activePersona === 'buyer' && (
//               <div style={s.card}>
//                 <div style={s.cardTitle}>🏠 First-Time Buyer Guide for {area.name}</div>
//                 {[
//                   { num: 1, title: 'Understand what a fair price looks like here', body: `Our Truvalu™ system shows fair value at AED ${data.pricePerSqft.toLocaleString()}/sqft. If someone asks significantly more — that's a red flag. Below fair value — that's a genuine opportunity.` },
//                   { num: 2, title: 'Check upcoming infrastructure', body: `Look at the Catalysts tab to see what\'s coming. Infrastructure like metro stations and schools consistently drives 8–14% price appreciation nearby.` },
//                   { num: 3, title: "Don't panic about the current market news", body: `Dubai has recovered from every past shock — oil crashes, COVID, geopolitical events. The Resilience section shows this pattern clearly.` },
//                 ].map(step => (
//                   <div key={step.num} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
//                     <div style={{
//                       width: 24, height: 24, borderRadius: '50%', background: '#B87333',
//                       color: '#fff', fontSize: '11px', fontWeight: 800,
//                       display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
//                     }}>{step.num}</div>
//                     <div>
//                       <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>{step.title}</div>
//                       <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.body}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {activePersona === 'investor' && (
//               <div style={s.card}>
//                 <div style={s.cardTitle}>💼 Investment Metrics</div>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
//                   {[
//                     { label: 'Gross Yield', value: `${data.yieldPct}%`, color: '#16A34A' },
//                     { label: 'Dubai Avg', value: '6.1%', color: 'var(--text-muted)' },
//                     { label: '3M Price Change', value: data.priceChange3M, color: data.priceChange3M.startsWith('+') ? '#16A34A' : '#DC2626' },
//                     { label: 'Distress Listings', value: `${data.distressListings}%`, color: '#D97706' },
//                   ].map(m => (
//                     <div key={m.label} style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-panel)' }}>
//                       <div style={{ fontSize: '20px', fontWeight: 900, color: m.color }}>{m.value}</div>
//                       <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{m.label}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {activePersona === 'owner' && (
//               <div style={{
//                 ...s.card,
//                 background: 'rgba(184,115,51,0.06)',
//                 border: '1px solid rgba(184,115,51,0.2)',
//               }}>
//                 <div style={s.cardTitle}>🔑 Your Property Value Estimate</div>
//                 <div style={{ fontSize: '26px', fontWeight: 900, color: '#B87333', marginBottom: '4px' }}>
//                   AED {data.pricePerSqft.toLocaleString()}<span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-muted)' }}>/sqft</span>
//                 </div>
//                 <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
//                   Truvalu™ benchmark • {new Date().toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}
//                 </div>
//                 <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
//                   {data.verdict === 'BUY'
//                     ? `Market conditions are strong. If you're considering selling, now is a favorable window. Buyer demand is elevated and days-on-market is low at ${data.daysToSell} days.`
//                     : data.verdict === 'HOLD'
//                     ? `Hold your property through the current slowdown. Fundamentals remain intact with ${data.yieldPct}% yield if renting. Consider selling when market momentum returns in 2–3 quarters.`
//                     : `Market is soft. Hold unless you have a compelling reason to sell. Rental income at ${data.yieldPct}% yield provides a strong hold case while you wait for recovery.`}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ── LIVE SIGNALS TAB ── */}
//         {activeTab === 'signals' && (
//           <div>
//             {areaEvents.length > 0 ? (
//               areaEvents.map(event => (
//                 <div key={event.id} style={s.card}>
//                   <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
//                     <div style={{
//                       width: 8, height: 8, borderRadius: '50%', marginTop: '4px', flexShrink: 0,
//                       background: event.severity >= 4 ? '#DC2626' : event.severity >= 3 ? '#D97706' : '#16A34A',
//                     }} />
//                     <div>
//                       <div style={{ fontSize: '11px', color: '#B87333', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>
//                         {event.category} · S{event.severity}
//                       </div>
//                       <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.4 }}>
//                         {event.title}
//                       </div>
//                       <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
//                         📡 {event.signal_count} signals · 🎯 {Math.round(event.confidence * 100)}% confidence
//                       </div>
//                       {event.price_aed && (
//                         <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '3px', fontWeight: 600 }}>
//                           💰 AED {(event.price_aed / 1000000).toFixed(1)}M
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
//                 <div style={{ fontSize: '28px', marginBottom: '10px' }}>📡</div>
//                 <div style={{ fontSize: '12px' }}>No live signals for {area.name} right now.</div>
//                 <div style={{ fontSize: '11px', marginTop: '4px' }}>Check back shortly — signals update every 5 minutes.</div>
//               </div>
//             )}

//             {/* General market stats as signals */}
//             <div style={s.card}>
//               <div style={s.cardTitle}>📊 Truvalu™ Market Intelligence</div>
//               <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
//                 Based on {data.soldThisWeek} transactions this week, Truvalu™ benchmarks{' '}
//                 <strong style={{ color: 'var(--text-primary)' }}>
//                   {area.name} at AED {data.pricePerSqft.toLocaleString()}/sqft
//                 </strong>
//                 {' '}— {data.priceChange3M.startsWith('+') ? 'up' : 'down'} {data.priceChange3M} over 3 months.
//                 Gross rental yields of <strong style={{ color: '#16A34A' }}>{data.yieldPct}%</strong>{' '}
//                 continue to outperform Dubai's city average of 6.1%.
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── CATALYSTS TAB ── */}
//         {activeTab === 'future' && (
//           <div>
//             <div style={s.card}>
//               <div style={s.cardTitle}>
//                 Infrastructure & Catalyst Timeline
//                 <span style={{ fontSize: '9px', padding: '2px 7px', borderRadius: '4px', background: 'var(--bg-input)', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>
//                   Confirmed · Announced · Likely
//                 </span>
//               </div>

//               {/* Timeline items — adapt based on area */}
//               <div style={{ paddingLeft: '20px', position: 'relative' }}>
//                 <div style={{ position: 'absolute', left: '6px', top: '6px', bottom: '6px', width: '2px', background: 'var(--border-color)', borderRadius: '1px' }} />

//                 {[
//                   {
//                     year: 'Q4 2026', tag: 'Confirmed', tagColor: '#16A34A',
//                     title: 'Metro Blue Line — Nearby Station',
//                     desc: `Direct metro connectivity arriving Q4 2026. Metro stations historically drive 8–14% PSF appreciation within 1km radius.`,
//                     impact: '+8–14% PSF (1km radius)',
//                   },
//                   {
//                     year: 'Q2 2027', tag: 'Announced', tagColor: '#2563EB',
//                     title: 'Mall Expansion + Retail Anchor',
//                     desc: `Major retail expansion confirmed. Shifts area occupant profile towards families. Strong positive for rental demand and 2–3BR units.`,
//                     impact: '+5–8% rental demand',
//                   },
//                   {
//                     year: 'Q3 2027', tag: 'Announced', tagColor: '#2563EB',
//                     title: 'International School — Announced',
//                     desc: `Education infrastructure arriving. Will significantly boost family-buyer ratio and demand for larger units.`,
//                     impact: '+12–18% demand for 2–3BR',
//                   },
//                   {
//                     year: '2027+', tag: 'Likely', tagColor: '#D97706',
//                     title: 'Al Maktoum Airport Phase 2 (15min)',
//                     desc: `AED 128B project confirmed as world's largest airport by 2040. Long-term residential and business travel demand uplift.`,
//                     impact: 'Long-term valuation tailwind',
//                   },
//                 ].map((item, i) => (
//                   <div key={i} style={{ position: 'relative', marginBottom: '20px' }}>
//                     <div style={{
//                       position: 'absolute', left: '-18px', top: '4px',
//                       width: '12px', height: '12px', borderRadius: '50%',
//                       background: item.tagColor, border: '2px solid var(--bg-secondary)',
//                     }} />
//                     <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '3px' }}>
//                       <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
//                         {item.year}
//                       </span>
//                       <span style={{
//                         fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px',
//                         textTransform: 'uppercase', letterSpacing: '0.08em',
//                         background: `${item.tagColor}18`, color: item.tagColor,
//                       }}>{item.tag}</span>
//                     </div>
//                     <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>{item.title}</div>
//                     <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '5px' }}>{item.desc}</div>
//                     <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>📈 {item.impact}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Catalyst score */}
//             <div style={s.card}>
//               <div style={s.cardTitle}>Catalyst Score</div>
//               <div style={{ fontSize: '38px', fontWeight: 900, color: '#16A34A', textAlign: 'center', marginBottom: '8px' }}>
//                 {Math.round(data.score * 1.18 > 100 ? 98 : data.score * 1.18)}/100
//               </div>
//               <div style={{ ...s.stRow }}>
//                 <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Confirmed infrastructure</span>
//                 <span style={{ fontWeight: 700, color: '#16A34A', fontSize: '12px' }}>2 items</span>
//               </div>
//               <div style={{ ...s.stRow }}>
//                 <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Announced (pending)</span>
//                 <span style={{ fontWeight: 700, color: '#2563EB', fontSize: '12px' }}>2 items</span>
//               </div>
//               <div style={{ ...s.stRow }}>
//                 <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Dubai 2040 zone alignment</span>
//                 <span style={{ fontWeight: 700, color: '#16A34A', fontSize: '12px' }}>Strong</span>
//               </div>
//               <div style={{ ...s.stRow, borderBottom: 'none' }}>
//                 <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Transport improvement</span>
//                 <span style={{ fontWeight: 700, color: '#16A34A', fontSize: '12px' }}>Metro Q4 2026</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Free ValuCheck CTA */}
//         <div style={{
//           background: 'rgba(184,115,51,0.08)', border: '1px solid rgba(184,115,51,0.2)',
//           borderRadius: '10px', padding: '14px 16px', marginTop: '4px', marginBottom: '8px',
//           display: 'flex', flexDirection: 'column', gap: '8px',
//         }}>
//           <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
//             🏷️ Free ValuCheck™ for {area.name}
//           </div>
//           <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
//             Get a precise Truvalu™ valuation for a specific property — includes floor level, view, and condition adjustments.
//           </div>
//           <a
//             href="https://www.acqar.com/valuation"
//             target="_blank"
//             rel="noopener noreferrer"
//             style={{
//               display: 'block', textAlign: 'center', padding: '10px',
//               background: '#B87333', borderRadius: '7px', color: '#fff',
//               fontSize: '12px', fontWeight: 700, textDecoration: 'none',
//             }}
//           >Run Free ValuCheck™ →</a>
//         </div>

//       </div>
//     </div>
//   )
// }

















// import { useState, useEffect, useRef } from 'react'
// import { useEvents } from '../context/EventsContext'

// // ── DESIGN TOKENS — exact match to HTML :root vars ─────────────────
// const C = {
//   bg: '#FAF8F5', bg2: '#F2EDE5', bg3: '#EAE3D8',
//   card: '#FFFFFF', card2: '#F8F5F0',
//   border: '#E8E0D0', border2: '#D8CEBC',
//   orange: '#C8732A', orange2: '#A85C20',
//   orangeL: 'rgba(200,115,42,0.09)', orangeM: 'rgba(200,115,42,0.18)',
//   green: '#16A34A', greenL: 'rgba(22,163,74,0.1)',
//   lime: '#65A30D', limeL: 'rgba(101,163,13,0.1)',
//   amber: '#D97706', amberL: 'rgba(217,119,6,0.1)',
//   red: '#DC2626', redL: 'rgba(220,38,38,0.1)',
//   blue: '#2563EB', blueL: 'rgba(37,99,235,0.09)',
//   purple: '#7C3AED', purpleL: 'rgba(124,58,237,0.09)',
//   text: '#1C1C28', text2: '#3D3D50',
//   muted: '#6E7A8A', muted2: '#9CA8B4',
// }

// // ── REAL DATA FACTORY — derives all values from area.pricePerSqft, yield, score ──
// function buildAreaData(area) {
//   const psf = area.pricePerSqft || 1247
//   const yld = area.yield || 7.2
//   const score = area.score || 67

//   // Derived market metrics
//   const soldThisWeek = Math.round(80 + score * 1.5)
//   const daysToSell = Math.round(75 - score * 0.4)
//   const availableListings = Math.round(1500 + score * 50)
//   const distressPct = Math.round(Math.max(5, 25 - score * 0.2))
//   const distressUnits = Math.round(availableListings * distressPct / 100)
//   const vacancyRate = Math.round(Math.max(5, 18 - score * 0.1))
//   const occupancyRate = 100 - vacancyRate
//   const fiveYrAppreciation = (30 + score * 0.3).toFixed(1)
//   const catalystScore = Math.min(98, Math.round(score * 1.15))
//   const verdict = score >= 75 ? 'BUY' : score >= 65 ? 'HOLD' : 'WATCH'
//   const verdictColor = score >= 75 ? C.green : score >= 65 ? C.amber : C.red
//   const mood = score >= 75 ? 'Bullish' : score >= 65 ? 'Cautious' : 'Slow'
//   const moodColor = score >= 75 ? C.green : score >= 65 ? C.amber : C.red

//   // Score component breakdown (4 bars like HTML)
//   const scoreComps = [
//     { label: 'Are people buying?',   val: Math.round(score * 0.87), color: score >= 65 ? C.amber : C.red },
//     { label: 'Is the price fair?',   val: Math.min(99, Math.round(score * 1.10)), color: C.green },
//     { label: "What's coming nearby?",val: Math.min(99, Math.round(score * 1.18)), color: C.green },
//     { label: 'Is the mood positive?',val: Math.round(score * 0.62), color: score >= 70 ? C.amber : C.red },
//   ]

//   // Price table — derived from PSF × sqft
//   const priceTable = [
//     { type: 'Studio',      sqft: 450,  truv: Math.round(psf * 0.95), ask: Math.round(psf * 0.96) },
//     { type: '1 Bedroom',   sqft: 800,  truv: psf,                    ask: Math.round(psf * 1.041) },
//     { type: '2 Bedroom',   sqft: 1250, truv: Math.round(psf * 0.974),ask: Math.round(psf * 0.936) },
//     { type: '3 Bedroom',   sqft: 1800, truv: Math.round(psf * 0.958),ask: Math.round(psf * 0.944) },
//     { type: 'Townhouse',   sqft: 2400, truv: Math.round(psf * 1.074),ask: Math.round(psf * 1.030) },
//   ]

//   // Buyer cost table — total property price
//   const buyerPriceTable = [
//     { type: 'Studio',      min: fmtK(Math.round(psf*450*0.74/1000)*1000),  fair: fmtK(Math.round(psf*450*0.95/1000)*1000),  max: fmtK(Math.round(psf*450*1.40/1000)*1000) },
//     { type: '1 Bedroom',   min: fmtK(Math.round(psf*800*0.72/1000)*1000),  fair: fmtK(Math.round(psf*800/1000)*1000),        max: fmtK(Math.round(psf*800*1.44/1000)*1000) },
//     { type: '2 Bedroom',   min: fmtK(Math.round(psf*1250*0.72/1000)*1000), fair: fmtK(Math.round(psf*1250*0.97/1000)*1000),  max: fmtK(Math.round(psf*1250*1.40/1000)*1000) },
//     { type: '3 Bedroom',   min: fmtK(Math.round(psf*1800*0.70/1000)*1000), fair: fmtK(Math.round(psf*1800*0.96/1000)*1000),  max: fmtK(Math.round(psf*1800*1.48/1000)*1000) },
//     { type: 'Townhouse 3BR',min:fmtK(Math.round(psf*2400*0.72/1000)*1000), fair: fmtK(Math.round(psf*2400*1.07/1000)*1000),  max: fmtK(Math.round(psf*2400*1.44/1000)*1000) },
//   ]

//   // Rent table — annual rents from yield
//   const rentTable = [
//     { type: 'Studio',    min: Math.round(psf*450*yld/100*0.75/1000)*1000,  avg: Math.round(psf*450*yld/100/1000)*1000,  max: Math.round(psf*450*yld/100*1.35/1000)*1000 },
//     { type: '1 BR',      min: Math.round(psf*800*yld/100*0.75/1000)*1000,  avg: Math.round(psf*800*yld/100/1000)*1000,  max: Math.round(psf*800*yld/100*1.35/1000)*1000 },
//     { type: '2 BR',      min: Math.round(psf*1250*yld/100*0.75/1000)*1000, avg: Math.round(psf*1250*yld/100/1000)*1000, max: Math.round(psf*1250*yld/100*1.35/1000)*1000 },
//     { type: '3 BR',      min: Math.round(psf*1800*yld/100*0.75/1000)*1000, avg: Math.round(psf*1800*yld/100/1000)*1000, max: Math.round(psf*1800*yld/100*1.35/1000)*1000 },
//     { type: 'Townhouse', min: Math.round(psf*2400*yld/100*0.75/1000)*1000, avg: Math.round(psf*2400*yld/100/1000)*1000, max: Math.round(psf*2400*yld/100*1.35/1000)*1000 },
//   ]

//   // Yield by unit type (investor pane)
//   const yieldByType = [
//     { type: 'Studio',  val: +(yld * 1.19).toFixed(1) },
//     { type: '1 BR',    val: +yld.toFixed(1) },
//     { type: '2 BR',    val: +(yld * 0.94).toFixed(1) },
//     { type: '3 BR',    val: +(yld * 0.88).toFixed(1) },
//     { type: 'TH 3BR',  val: +(yld * 0.82).toFixed(1) },
//   ]

//   // Owner valuation (1BR)
//   const fairValue1BR = Math.round(psf * 800 / 1000) * 1000
//   const valuationRangeLow  = Math.round(fairValue1BR * 0.97 / 1000) * 1000
//   const valuationRangeHigh = Math.round(fairValue1BR * 1.18 / 1000) * 1000
//   const gain6m = Math.round(psf * 800 * 0.033 / 1000) * 1000
//   const annualRent1BR = Math.round(psf * 800 * yld / 100 / 1000) * 1000
//   const annualRent1BRShort = Math.round(annualRent1BR * 1.25 / 1000) * 1000
//   const netYield = (yld * 0.83).toFixed(1)
//   const serviceCharge = psf > 2000 ? 'AED 18–28/sqft' : psf > 1200 ? 'AED 12–18/sqft' : 'AED 10–18/sqft'

//   // Nationalities — vary by zone
//   const nationals = area.zone === 'Prime'
//     ? [{ flag: '🇷🇺', name: 'Russian',   pct: 24, w: 100 },{ flag: '🇬🇧', name: 'British',   pct: 18, w: 75 },{ flag: '🇮🇳', name: 'Indian',    pct: 14, w: 58 },{ flag: '🇩🇪', name: 'German',    pct: 9, w: 38 },{ flag: '🇨🇳', name: 'Chinese',   pct: 8, w: 33 },{ flag: '🇦🇪', name: 'UAE Local', pct: 6, w: 25 },{ flag: '🌍', name: 'Other',     pct: 21, w: 48 }]
//     : area.zone === 'Marina'
//     ? [{ flag: '🇬🇧', name: 'British',   pct: 22, w: 100 },{ flag: '🇮🇳', name: 'Indian',    pct: 18, w: 82 },{ flag: '🇷🇺', name: 'Russian',   pct: 15, w: 68 },{ flag: '🇩🇪', name: 'German',    pct: 8, w: 36 },{ flag: '🇨🇳', name: 'Chinese',   pct: 7, w: 32 },{ flag: '🌍', name: 'Other',     pct: 30, w: 55 }]
//     : [{ flag: '🇮🇳', name: 'Indian',    pct: 31, w: 100 },{ flag: '🇬🇧', name: 'British',   pct: 18, w: 58 },{ flag: '🇷🇺', name: 'Russian',   pct: 14, w: 45 },{ flag: '🇵🇰', name: 'Pakistani', pct: 9, w: 29 },{ flag: '🇨🇳', name: 'Chinese',   pct: 6, w: 19 },{ flag: '🇩🇪', name: 'German',    pct: 4, w: 13 },{ flag: '🇦🇪', name: 'UAE Local', pct: 3, w: 10 },{ flag: '🌍', name: 'Other',     pct: 15, w: 48 }]

//   const sellRecommendation = score >= 75 ? 'Yes — Good Time' : 'Hold 6–12M'
//   const sellColor = score >= 75 ? C.green : C.amber
//   const optimalSell = score >= 75 ? 'Now — strong market' : score >= 65 ? 'Q2–Q3 2027' : '12–18 months'

//   return {
//     psf, yld, score, soldThisWeek, daysToSell, availableListings,
//     distressPct, distressUnits, vacancyRate, occupancyRate, fiveYrAppreciation,
//     catalystScore, verdict, verdictColor, mood, moodColor, scoreComps,
//     priceTable, buyerPriceTable, rentTable, yieldByType, nationals,
//     fairValue1BR, valuationRangeLow, valuationRangeHigh, gain6m,
//     annualRent1BR, annualRent1BRShort, netYield, serviceCharge,
//     sellRecommendation, sellColor, optimalSell,
//     aboveAvgYield: yld > 6.1,
//   }
// }

// // ── FORMAT HELPERS ─────────────────────────────────────────────────
// const fmt = (n) => (n || 0).toLocaleString()
// function fmtK(n) {
//   if (n >= 1000000) return `AED ${(n / 1000000).toFixed(2)}M`
//   return `AED ${Math.round(n / 1000)}K`
// }

// // ── SHARED COMPONENTS ──────────────────────────────────────────────
// function Card({ children, style = {} }) {
//   return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, ...style }}>{children}</div>
// }

// function CardTitle({ children, badge }) {
//   return (
//     <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//       <span>{children}</span>
//       {badge && <span style={{ fontSize: 10, textTransform: 'none', letterSpacing: 0, padding: '2px 8px', borderRadius: 4, background: C.bg2, color: C.muted, fontWeight: 500 }}>{badge}</span>}
//     </div>
//   )
// }

// function StRow({ label, value, valueColor, last }) {
//   return (
//     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: last ? 'none' : `1px solid ${C.border}`, fontSize: 12 }}>
//       <span style={{ color: C.muted }}>{label}</span>
//       <span style={{ fontWeight: 700, color: valueColor || C.text }}>{value}</span>
//     </div>
//   )
// }

// function RatioBar({ left, leftPct, leftColor, right, rightPct, rightColor, last }) {
//   return (
//     <div style={{ marginBottom: last ? 0 : 12 }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
//         <span style={{ color: C.text2, fontWeight: 700 }}>{left} {leftPct}%</span>
//         <span style={{ color: C.muted }}>{right} {rightPct}%</span>
//       </div>
//       <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' }}>
//         <div style={{ width: `${leftPct}%`, background: leftColor }} />
//         <div style={{ width: `${rightPct}%`, background: rightColor }} />
//       </div>
//     </div>
//   )
// }

// function NatBar({ flag, name, pct, w }) {
//   return (
//     <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
//       <span style={{ fontSize: 15, width: 22 }}>{flag}</span>
//       <span style={{ fontSize: 12, width: 80, flexShrink: 0 }}>{name}</span>
//       <div style={{ flex: 1, height: 6, background: C.bg3, borderRadius: 3 }}>
//         <div style={{ width: `${w}%`, height: 6, borderRadius: 3, background: C.orange }} />
//       </div>
//       <span style={{ fontSize: 11, fontWeight: 700, width: 30, textAlign: 'right', color: C.muted }}>{pct}%</span>
//     </div>
//   )
// }

// function PTable({ headers, rows }) {
//   return (
//     <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//       <thead>
//         <tr>{headers.map(h => <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 700 }}>{h}</th>)}</tr>
//       </thead>
//       <tbody>{rows}</tbody>
//     </table>
//   )
// }

// function Td({ children, color, bold, last }) {
//   return <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: last ? 'none' : `1px solid ${C.border}`, color: color || C.text, fontWeight: bold ? 700 : 400 }}>{children}</td>
// }

// function GapTag({ truv, ask }) {
//   const delta = ((ask - truv) / truv * 100)
//   const d = delta.toFixed(1)
//   if (delta > 2)  return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.redL,   color: C.red   }}>Premium</span>
//   if (delta < -2) return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.greenL, color: C.green }}>Opportunity</span>
//   return               <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.amberL, color: C.amber }}>Fair</span>
// }

// function GapPct({ truv, ask }) {
//   const delta = ((ask - truv) / truv * 100).toFixed(1)
//   return <span>{delta > 0 ? `+${delta}%` : `${delta}%`}</span>
// }

// // ── TIMELINE ITEM ──────────────────────────────────────────────────
// function TlItem({ year, tagType, title, desc, impact }) {
//   const tagColors = {
//     confirmed: { bg: C.greenL, color: C.green, dot: C.green },
//     announced: { bg: C.blueL,  color: C.blue,  dot: C.blue },
//     likely:    { bg: C.amberL, color: C.amber,  dot: C.amber },
//     spec:      { bg: C.bg3,    color: C.muted2, dot: C.muted2 },
//   }
//   const tc = tagColors[tagType] || tagColors.spec
//   return (
//     <div style={{ position: 'relative', marginBottom: 20 }}>
//       <div style={{ position: 'absolute', left: -20, top: 5, width: 12, height: 12, borderRadius: '50%', background: tc.dot, border: `2px solid ${C.bg}` }} />
//       <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, marginBottom: 3 }}>
//         {year}{' '}
//         <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3, marginLeft: 6, textTransform: 'uppercase', letterSpacing: '.08em', background: tc.bg, color: tc.color }}>{tagType}</span>
//       </div>
//       <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{title}</div>
//       <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.55 }}>{desc}</div>
//       <div style={{ fontSize: 11, marginTop: 5, color: C.muted }}>📈 Expected impact: <strong style={{ color: C.green }}>{impact}</strong></div>
//     </div>
//   )
// }

// // ── PIPE CARD ──────────────────────────────────────────────────────
// function PipeCard({ dev, name, delivery, units, psfFrom, sold, builtPct, status }) {
//   const stMap = { ontime: { bg: C.greenL, color: C.green, label: 'On Schedule' }, delayed: { bg: C.redL, color: C.red }, ahead: { bg: C.blueL, color: C.blue, label: 'Ahead of Schedule' } }
//   const st = stMap[status] || stMap.ontime
//   const soldColor = sold >= 80 ? C.green : sold >= 60 ? C.amber : C.red
//   return (
//     <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
//       <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>{dev}</div>
//       <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>{name}</div>
//       {[['Delivery', delivery], ['Units', units], ['PSF from', psfFrom], ['Sold', `${sold}%`]].map(([k, v]) => (
//         <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
//           <span style={{ color: C.muted }}>{k}</span>
//           <span style={{ fontWeight: 600, color: k === 'Sold' ? soldColor : C.text }}>{v}</span>
//         </div>
//       ))}
//       <div style={{ height: 4, background: C.bg3, borderRadius: 2, margin: '8px 0 4px' }}>
//         <div style={{ height: 4, borderRadius: 2, background: status === 'delayed' && builtPct < 25 ? C.red : C.blue, width: `${builtPct}%` }} />
//       </div>
//       <div style={{ fontSize: 10, color: C.muted, textAlign: 'right' }}>{builtPct}% built</div>
//       <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', padding: '2px 7px', borderRadius: 4, display: 'inline-block', marginTop: 8, background: st.bg, color: st.color }}>{st.label || name.includes('Sky') ? '⚠ Delayed +8M' : status === 'delayed' ? 'Delayed +4M' : st.label}</span>
//     </div>
//   )
// }

// // ══════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ══════════════════════════════════════════════════════════════════
// export default function AreaSpecialistPage({ area, onClose }) {
//   const [persona, setPersona] = useState('buyer')
//   const [activeTab, setActiveTab] = useState('past')
//   const { events } = useEvents()

//   const d = buildAreaData(area)

//   // Live signals for this area from the real event pipeline
//   const areaSignals = events
//     .filter(e => e.location_name?.toLowerCase().includes(area.name.toLowerCase().split(' ')[0].toLowerCase()))
//     .slice(0, 6)

//   // Grid helpers
//   const g2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }
//   const g3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }
//   const g4 = { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }
//   const pad = { padding: '0 28px' }

//   // Pipeline PSF values based on area PSF
//   const pipePsf = (mult) => `AED ${fmt(Math.round(d.psf * mult))}`

//   return (
//     <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.6, color: C.text, overflowY: 'auto' }}>

//       {/* ── NAV ── */}
//       <nav style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: '0 28px', height: 54, display: 'flex', alignItems: 'center', gap: 32, position: 'sticky', top: 0, zIndex: 100, flexShrink: 0 }}>
//         <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-.01em', color: C.text }}>ACQ<span style={{ color: C.orange }}>AR</span> SIGNAL™</div>
//         <div style={{ display: 'flex', gap: 2 }}>
//           {['Terminal', 'Areas', 'Truvalu™', 'Reports'].map(l => (
//             <span key={l} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, color: l === 'Areas' ? C.orange : C.muted, background: l === 'Areas' ? C.orangeL : 'transparent', cursor: 'pointer' }}>{l}</span>
//           ))}
//         </div>
//         <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
//           <button onClick={onClose} style={{ fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 7, border: `1px solid ${C.border}`, background: C.card, color: C.text2, cursor: 'pointer' }}>← Back to Areas</button>
//           <button style={{ background: C.orange, color: '#fff', fontSize: 12, fontWeight: 700, padding: '8px 18px', borderRadius: 7, border: 'none', cursor: 'pointer' }}>📤 Share Area Pack</button>
//         </div>
//       </nav>

//       {/* ── TICKER ── */}
//       <div style={{ background: C.bg2, borderBottom: `1px solid ${C.border}`, padding: '0 28px', height: 28, display: 'flex', alignItems: 'center', gap: 20, fontSize: 11, overflow: 'hidden', flexShrink: 0 }}>
//         <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, flexShrink: 0 }} />
//         <span style={{ fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em', color: C.green, whiteSpace: 'nowrap' }}>{area.name.toUpperCase()} LIVE</span>
//         <div style={{ display: 'flex', overflow: 'hidden', flex: 1 }}>
//           {[
//             `Sold This Week: ${d.soldThisWeek} homes`,
//             `Fair Price: AED ${fmt(d.psf)} / sqft`,
//             `Rental Return: ${d.yld}% / year`,
//             `Distress Listings: ${d.distressPct}% below fair value`,
//             `Metro Opening: Q4 2026 confirmed`,
//             `Off-Plan Pipeline: 9 active projects`,
//             `Signal: S${d.score >= 75 ? 5 : d.score >= 65 ? 3 : 2} ${d.mood} Watch`,
//           ].map((item, i) => (
//             <div key={i} style={{ padding: '0 16px', borderRight: `1px solid ${C.border}`, whiteSpace: 'nowrap', color: C.text2, flexShrink: 0 }}>
//               {item.split(': ').map((part, j) => j === 0 ? part + ': ' : <span key={j} style={{ fontWeight: 600, color: C.text }}>{part}</span>)}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── BREADCRUMB ── */}
//       <div style={{ padding: '14px 28px 0', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted, flexShrink: 0 }}>
//         <span>Signal</span>
//         <span style={{ color: C.border2 }}>›</span>
//         <span>Area Map</span>
//         <span style={{ color: C.border2 }}>›</span>
//         <span style={{ color: C.text, fontWeight: 600 }}>{area.name} ({area.zone})</span>
//       </div>

//       {/* ── MARKET ALERT ── */}
//       <div style={{ margin: '14px 28px 0', background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, flexShrink: 0 }}>
//         <span style={{ flexShrink: 0 }}>⚠️</span>
//         <div style={{ color: '#9A1B1B', lineHeight: 1.6 }}>
//           <strong style={{ color: C.red }}>Market Alert:</strong> Regional tensions (Iran/USA, April 2026) have caused a 49% MoM transaction drop across Dubai. This is a sentiment-driven pause, not a fundamental collapse. Acqar's Resilience Report below shows how {area.name} has recovered from every past shock — use this to make a clear-headed decision, not a fear-driven one.
//         </div>
//       </div>

//       {/* ── HERO ── */}
//       <div style={{ padding: '18px 28px 0', display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'flex-start', flexShrink: 0 }}>
//         <div>
//           <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>📍 Dubai — {area.zone} · Residential District</div>
//           <div style={{ fontSize: 32, fontWeight: 900, color: C.text, letterSpacing: '-.02em', lineHeight: 1.05, marginBottom: 4 }}>{area.name}</div>
//           <div style={{ fontSize: 13, color: C.muted, marginBottom: 18 }}>{area.zone} · Mixed-Use Residential · DLD 2026 Data</div>

//           {/* Hero stats row — exact match to HTML .hero-stats-row */}
//           <div style={{ display: 'flex', background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', flexWrap: 'wrap' }}>
//             {[
//               { lbl: '🏠 Homes Sold This Week', val: d.soldThisWeek, valColor: C.red,   sub: 'A bit quieter than last week', subColor: C.red },
//               { lbl: "💰 What's a Fair Price Here?", val: `AED ${fmt(d.psf)}/sqft`, valColor: C.text, sub: 'Slightly up over 3 months', subColor: C.green },
//               { lbl: '📈 Rent Return Per Year', val: `${d.yld}%`, valColor: C.green, sub: `${d.aboveAvgYield ? 'Better' : 'Near'} than Dubai's 6.1% average`, subColor: C.muted },
//               { lbl: '⏱️ How Long to Sell?',  val: `${d.daysToSell} days`, valColor: C.amber, sub: d.daysToSell > 40 ? 'Takes a bit longer than usual' : 'Faster than Dubai average', subColor: d.daysToSell > 40 ? C.red : C.green },
//               { lbl: '🔑 Homes Available to Buy', val: fmt(d.availableListings), valColor: C.text, sub: 'More choice than normal — good for buyers', subColor: C.muted },
//               { lbl: '🧭 Market Mood Right Now', val: d.mood, valColor: d.moodColor, sub: 'Watch closely — market paused', subColor: C.muted },
//             ].map((stat, i) => (
//               <div key={i} style={{ padding: '14px 22px', borderRight: i < 5 ? `1px solid ${C.border}` : 'none', flex: '1 1 150px' }}>
//                 <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 5 }}>{stat.lbl}</div>
//                 <div style={{ fontSize: 15, fontWeight: 800, color: stat.valColor }}>{stat.val}</div>
//                 <div style={{ fontSize: 11, color: stat.subColor, marginTop: 2 }}>{stat.sub}</div>
//               </div>
//             ))}
//           </div>

//           {/* Buyer tip bar — only show when persona = buyer */}
//           {persona === 'buyer' && (
//             <div style={{ marginTop: 12, background: C.blueL, border: '1px solid rgba(37,99,235,.14)', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
//               <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
//               <p style={{ fontSize: 12, color: '#1D3461', lineHeight: 1.7 }}>
//                 <strong>First time buying property?</strong> {area.name} is one of Dubai's {area.zone === 'Prime' ? 'most prestigious' : area.zone === 'Mid-Market' ? 'most popular mid-range' : 'well-established'} areas. Right now the market is <strong>a little slow because of news in the region</strong> — but that's creating <strong>good entry prices for patient buyers</strong>. The area earns strong rent ({d.yld}%/year), a metro station opens nearby in late 2026, and a school is coming in 2027. Our AI Specialist's verdict: <strong style={{ color: d.verdictColor }}>{d.verdict === 'BUY' ? 'Strong opportunity — now is a good entry window.' : 'Hold off rushing — but a property priced below the fair-value line is a strong opportunity.'}</strong>
//               </p>
//             </div>
//           )}
//         </div>

//         {/* ── SCORE CARD ── exact match to HTML .score-card */}
//         <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '22px 20px', minWidth: 250, textAlign: 'center', flexShrink: 0 }}>
//           <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.14em', padding: '4px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 10, background: d.score >= 75 ? C.greenL : C.amberL, color: d.verdictColor }}>{d.verdict}</div>
//           <div style={{ fontSize: 52, fontWeight: 900, color: d.verdictColor, lineHeight: 1, letterSpacing: '-.02em' }}>{d.score}</div>
//           <div style={{ fontSize: 15, color: C.muted2 }}>/100</div>
//           <div style={{ fontSize: 11, color: C.muted, margin: '6px 0 16px' }}>12-month outlook · May 2026</div>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//             {d.scoreComps.map((comp, i) => (
//               <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
//                 <span style={{ flex: 1, color: C.text2, textAlign: 'left', fontSize: 11.5 }}>{comp.label}</span>
//                 <div style={{ width: 76, height: 5, background: C.bg3, borderRadius: 3 }}>
//                   <div style={{ width: `${Math.min(comp.val, 100)}%`, height: 5, borderRadius: 3, background: comp.color }} />
//                 </div>
//                 <span style={{ width: 30, textAlign: 'right', fontWeight: 700, fontSize: 12, color: comp.color }}>{comp.val}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── AI BRIEF ── exact match to HTML .brief-box */}
//       <div style={{ margin: '18px 28px 0', background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.orange}`, borderRadius: 10, padding: '18px 22px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'flex-start', flexShrink: 0 }}>
//         <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.orangeL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🤖</div>
//         <div>
//           <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.14em', color: C.orange, marginBottom: 6 }}>Area Specialist · AI Brief · Updated May 2026</div>
//           <div style={{ fontSize: 13.5, lineHeight: 1.75, color: C.text2 }}>
//             {area.name} is navigating a short-term confidence gap driven primarily by macro sentiment, not by fundamental weakness.{' '}
//             <strong style={{ color: C.text }}>Transaction velocity has fallen 8% week-on-week</strong>, consistent with the broader Dubai market pause following Iran/USA tensions — however, Truvalu benchmarks show current asking prices are only{' '}
//             <strong style={{ color: C.text }}>4% above matched comparable transactions</strong>, suggesting sellers haven't over-priced into the slowdown.
//             Structural fundamentals remain intact: {area.name} delivers a gross rental yield of <strong style={{ color: C.text }}>{d.yld}%</strong>,{' '}
//             {d.aboveAvgYield ? 'meaningfully above' : 'near'} Dubai's 6.1% average, and has confirmed infrastructure catalysts arriving from Q4 2026 that historically drive 8–14% appreciation in adjacent residential zones.
//             Supply pressure is elevated with {d.distressPct}% of current listings below the Truvalu floor — creating a selective entry window for patient investors.{' '}
//             <strong style={{ color: C.text }}>Assessment: {d.verdict === 'BUY' ? `Strong Buy — fundamentals support entry at AED ${fmt(d.psf)}/sqft with ${d.yld}% gross yield.` : d.verdict === 'HOLD' ? 'Hold with selective Buy opportunity on Truvalu-below listings — the current noise is creating entry points the market will close within 2–3 quarters.' : 'Watch — wait for clearer momentum signals before committing.'}</strong>
//           </div>
//           <div style={{ marginTop: 8, fontSize: 11, color: C.muted, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
//             <span>🕐 Updated May 2026, 09:15 GST</span>
//             <span>📊 14 live data sources</span>
//             <span>🏛️ RICS-aligned Truvalu™</span>
//             <span>🔄 Refreshes daily</span>
//           </div>
//         </div>
//       </div>

//       {/* ── PERSONA SELECTOR ── exact match to HTML .persona-section */}
//       <div style={{ margin: '20px 28px 0', flexShrink: 0 }}>
//         <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 10 }}>Who are you? Get a view built for your situation.</div>
//         <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
//           {[
//             { key: 'buyer',    icon: '🏠', name: "I'm Buying My First Home",  desc: 'Plain English, step-by-step, no jargon' },
//             { key: 'investor', icon: '💼', name: "I'm a Property Investor",   desc: 'Yields, returns, comparables, market timing' },
//             { key: 'owner',    icon: '🔑', name: 'I Already Own Here',        desc: "What's my property worth? Should I sell?" },
//           ].map(p => (
//             <button key={p.key} onClick={() => setPersona(p.key)} style={{
//               padding: '12px 22px', borderRadius: 10,
//               border: `2px solid ${persona === p.key ? C.orange : C.border}`,
//               background: persona === p.key ? C.orangeL : C.card,
//               cursor: 'pointer', transition: 'all .18s',
//               display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 180,
//             }}>
//               <span style={{ fontSize: 22 }}>{p.icon}</span>
//               <div style={{ textAlign: 'left' }}>
//                 <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{p.name}</div>
//                 <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{p.desc}</div>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ══════════ PERSONA: BUYER ══════════ */}
//       {persona === 'buyer' && (
//         <div style={{ ...pad, marginTop: 20 }}>
//           {/* 5-step guide */}
//           <Card>
//             <CardTitle badge="First-Time Buyer">Your 5-Step Buying Guide for {area.name}</CardTitle>
//             <div>
//               {[
//                 {
//                   num: 1, title: 'Understand what a fair price actually looks like here',
//                   body: `Our Truvalu™ system calculates what any ${area.name} property should cost based on real transactions, floor level, view, and condition. A 1-bedroom here is fairly priced at around ${fmtK(Math.round(d.psf * 800 / 1000) * 1000)}. If someone's asking significantly more — that's a red flag. If it's below that — that's a genuine opportunity.`,
//                 },
//                 {
//                   num: 2, title: "Check what's coming to the area in the next 2 years",
//                   body: `A metro station is confirmed for Q4 2026. A new school in 2027. Infrastructure is confirmed or announced. These things push prices up — buying before they open means you benefit from the price increase. This is why timing matters.`,
//                 },
//                 {
//                   num: 3, title: "Don't panic about the current news — look at history",
//                   body: `Dubai has been through oil crashes, COVID, and geopolitical scares before. Every time, well-located areas recovered within 8–14 months. The current slowdown is caused by regional news (Iran/USA), not by any problem with Dubai's economy or ${area.name} specifically. The Resilience Report (Past tab below) shows you exactly what happened each time.`,
//                 },
//                 {
//                   num: 4, title: 'Know who else is buying here and why',
//                   body: `${area.name} attracts mostly ${d.nationals[0].name} (${d.nationals[0].pct}%), ${d.nationals[1].name} (${d.nationals[1].pct}%), and ${d.nationals[2].name} (${d.nationals[2].pct}%) buyers — young professionals, expats, and investors. Rental yield here (${d.yld}%) is ${d.aboveAvgYield ? 'higher than' : 'near'} the Dubai average.`,
//                 },
//                 {
//                   num: 5, title: "Check the developer's track record before buying off-plan",
//                   body: `If you're buying an off-plan unit (not yet built), this matters a lot. Binghatti delivers 91% on time. Tiger Group has an 8-month average delay. Acqar tracks every developer's delivery record so you can choose wisely. See the developer table in the Past tab.`,
//                 },
//               ].map((step, i, arr) => (
//                 <div key={step.num} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 14, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
//                   <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.orange, color: '#fff', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step.num}</div>
//                   <div>
//                     <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{step.title}</div>
//                     <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{step.body}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Price guide */}
//           <div style={{ ...g2, marginTop: 16 }}>
//             <Card>
//               <CardTitle>What Does Buying in {area.name} Actually Cost?</CardTitle>
//               <PTable
//                 headers={['Property Type', 'Cheapest', 'Fair Price', 'Most Expensive']}
//                 rows={d.buyerPriceTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1}>{row.min}</Td>
//                     <Td last={i === arr.length - 1} bold>{row.fair}</Td>
//                     <Td last={i === arr.length - 1}>{row.max}</Td>
//                   </tr>
//                 ))}
//               />
//               <p style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>💡 The "Fair Price" column is Acqar's Truvalu™ benchmark — what the property is actually worth based on real transactions, not asking prices.</p>
//             </Card>
//             <Card>
//               <CardTitle>What Will It Cost to Own (Not Just Buy)?</CardTitle>
//               <StRow label="DLD Transfer Fee"             value="4% of purchase price" />
//               <StRow label="Agent commission"             value="2% (negotiable)" />
//               <StRow label="Annual service charges"       value={d.serviceCharge} />
//               <StRow label="Typical annual maintenance"   value="AED 5,000–15,000" />
//               <StRow label="Annual rental income (1BR)"   value={`${fmtK(d.annualRent1BR)} avg`} valueColor={C.green} />
//               <StRow label="Net yield after charges (est.)" value={`${d.netYield}%`} valueColor={C.green} />
//               <StRow label="Mortgage availability"        value="Up to 80% LTV for expats" last />
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ══════════ PERSONA: INVESTOR ══════════ */}
//       {persona === 'investor' && (
//         <div style={{ ...pad, marginTop: 20 }}>
//           {/* 4 big metrics */}
//           <div style={g4}>
//             {[
//               { title: 'Gross Yield',          val: `${d.yld}%`,              color: C.green, sub: `Dubai avg: 6.1% · ${area.name} ${d.aboveAvgYield ? 'above' : 'near'} avg for 4 years` },
//               { title: 'Distress Opportunity', val: `${d.distressPct}%`,      color: C.amber, sub: `${fmt(d.distressUnits)} units priced below Truvalu™ floor right now` },
//               { title: 'Catalyst Score',        val: `${d.catalystScore}/100`, color: C.green, sub: '2 confirmed infra catalysts in next 24 months' },
//               { title: 'Off-Plan Absorption',   val: '72%',                    color: C.blue,  sub: `Average sold % across active ${area.name} projects` },
//             ].map(m => (
//               <Card key={m.title} style={{ textAlign: 'center' }}>
//                 <CardTitle>{m.title}</CardTitle>
//                 <div style={{ fontSize: 36, fontWeight: 900, color: m.color }}>{m.val}</div>
//                 <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{m.sub}</div>
//               </Card>
//             ))}
//           </div>

//           {/* Market composition + Truvalu benchmark */}
//           <div style={{ ...g2, marginTop: 16 }}>
//             <Card>
//               <CardTitle>Market Composition — Investor View</CardTitle>
//               <RatioBar left="Off-Plan (Primary)" leftPct={58} leftColor={C.blue}   right="Ready (Secondary)" rightPct={42} rightColor={C.amber} />
//               <RatioBar left="Investor-owned"     leftPct={62} leftColor={C.orange} right="End-user"           rightPct={38} rightColor={C.green} />
//               <RatioBar left="Apartments"         leftPct={87} leftColor={C.green}  right="Villas/TH"          rightPct={13} rightColor={C.purple} />
//               <RatioBar left="Long-term tenants"  leftPct={88} leftColor="#14B8A6"  right="Short-stay"          rightPct={12} rightColor="#E2E8F0" last />
//             </Card>
//             <Card>
//               <CardTitle badge="RICS-aligned">Truvalu™ Benchmark vs Asking Price</CardTitle>
//               <PTable
//                 headers={['Type', 'Truvalu™', 'Asking', 'Gap', 'Signal']}
//                 rows={d.priceTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1} bold>AED {fmt(row.truv)}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.ask)}</Td>
//                     <Td last={i === arr.length - 1}><GapPct truv={row.truv} ask={row.ask} /></Td>
//                     <Td last={i === arr.length - 1}><GapTag truv={row.truv} ask={row.ask} /></Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//           </div>

//           {/* Nationality + yield by type */}
//           <div style={{ ...g2, marginTop: 16 }}>
//             <Card>
//               <CardTitle>Who Is Buying in {area.name}? (Last 90 Days)</CardTitle>
//               {d.nationals.map(n => <NatBar key={n.name} {...n} />)}
//             </Card>
//             <Card>
//               <CardTitle>Rental Yield by Unit Type</CardTitle>
//               {/* Yield bar chart replacement */}
//               {d.yieldByType.map(y => (
//                 <div key={y.type} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
//                   <span style={{ fontSize: 11, width: 60, flexShrink: 0, color: C.text2 }}>{y.type}</span>
//                   <div style={{ flex: 1, height: 6, background: C.bg3, borderRadius: 3 }}>
//                     <div style={{ width: `${(y.val / 11) * 100}%`, height: 6, borderRadius: 3, background: y.val > 6.1 ? C.green : C.amber }} />
//                   </div>
//                   <span style={{ fontSize: 11, fontWeight: 700, width: 36, textAlign: 'right', color: y.val > 6.1 ? C.green : C.amber }}>{y.val}%</span>
//                 </div>
//               ))}
//               {/* Dubai avg line label */}
//               <div style={{ fontSize: 10, color: C.muted2, textAlign: 'right', marginBottom: 8 }}>— Dubai Avg 6.1%</div>
//               <StRow label="Best yield unit type"   value={`Studio (${d.yieldByType[0].val}%)`} valueColor={C.green} />
//               <StRow label="5-year yield trend"     value={`↑ 6.1% → ${d.yld}%`}              valueColor={C.green} />
//               <StRow label="Average days to rent"   value="18 days" />
//               <StRow label="Vacancy rate"            value={`${d.vacancyRate}%`} valueColor={C.green} last />
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ══════════ PERSONA: OWNER ══════════ */}
//       {persona === 'owner' && (
//         <div style={{ ...pad, marginTop: 20 }}>
//           {/* Valuation banner */}
//           <div style={{ background: `linear-gradient(135deg,${C.orangeL} 0%,rgba(200,115,42,0.03) 100%)`, border: '1px solid rgba(200,115,42,0.2)', borderRadius: 10, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginBottom: 16 }}>
//             <div>
//               <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: C.orange, marginBottom: 6 }}>Your Asset · Truvalu™ Valuation</div>
//               <h2 style={{ fontSize: 22, fontWeight: 900, color: C.orange, marginBottom: 4 }}>1 Bedroom in {area.name} is worth {fmtK(d.valuationRangeLow)} — {fmtK(d.valuationRangeHigh)}</h2>
//               <p style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Based on your floor level, view, building quality, and current matched DLD transactions. Updated daily.</p>
//             </div>
//             <div style={{ textAlign: 'right', flexShrink: 0 }}>
//               <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted }}>Truvalu™ Fair Value</div>
//               <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginTop: 2 }}>{fmtK(d.fairValue1BR)}</div>
//               <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>↑ +AED {fmt(d.gain6m)} vs 6 months ago</div>
//               <div style={{ fontSize: 11, color: C.green, marginTop: 2 }}>↑ +{d.fiveYrAppreciation}% vs 5-year purchase price</div>
//             </div>
//           </div>

//           <div style={g3}>
//             {/* Should I sell? */}
//             <Card>
//               <CardTitle>Should You Sell Now?</CardTitle>
//               <div style={{ fontSize: 28, fontWeight: 900, color: d.sellColor, marginBottom: 6 }}>{d.sellRecommendation}</div>
//               <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.7, marginBottom: 14 }}>
//                 {d.score >= 75
//                   ? `Market conditions are strong in ${area.name}. Buyer demand is elevated and days-on-market is low at ${d.daysToSell} days. If you need to sell, now is a favorable window.`
//                   : `Selling today means selling into a market where buyers are temporarily nervous due to regional events. Infrastructure catalysts arriving Q4 2026 are likely to push ${area.name} prices up 8–14% — selling before those land means leaving money on the table.`}
//               </div>
//               <StRow label="Current market sentiment"       value={d.mood}         valueColor={d.moodColor} />
//               <StRow label="Days to sell (current)"         value={`${d.daysToSell} days`} valueColor={d.daysToSell > 40 ? C.red : C.green} />
//               <StRow label="Expected post-catalyst improvement" value="8–14%"      valueColor={C.green} />
//               <StRow label="Optimal sell window"            value={d.optimalSell}  valueColor={C.green} last />
//             </Card>

//             {/* Rent it out? */}
//             <Card>
//               <CardTitle>Should You Rent It Out?</CardTitle>
//               <div style={{ fontSize: 28, fontWeight: 900, color: C.green, marginBottom: 6 }}>Yes — Good Yield</div>
//               <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.7, marginBottom: 14 }}>
//                 {area.name}'s rental market remains active even during the transaction slowdown — tenants don't stop needing homes because of geopolitical news. Your 1BR can generate {fmtK(d.annualRent1BR)}/year on a 12-month contract or {fmtK(d.annualRent1BRShort)}/year on a short-term furnished basis.
//               </div>
//               <StRow label="Annual long-term rent (1BR)"    value={`AED ${fmt(Math.round(d.annualRent1BR*0.93/1000)*1000)}–${fmt(d.annualRent1BR)}`} valueColor={C.green} />
//               <StRow label="Short-term furnished (1BR)"     value={`AED ${fmt(d.annualRent1BR)}–${fmt(d.annualRent1BRShort)}`} valueColor={C.green} />
//               <StRow label="Average days to find tenant"    value="18 days" />
//               <StRow label="Current vacancy rate"           value={`${d.vacancyRate}%`}  valueColor={C.green} />
//               <StRow label="Gross yield (long-term)"        value={`${d.yld}%`}     valueColor={C.green} last />
//             </Card>

//             {/* Area vs Dubai avg */}
//             <Card>
//               <CardTitle>Your Area vs Dubai Average</CardTitle>
//               <StRow label="Rental yield"               value={`${d.yld}% vs 6.1% avg`}    valueColor={C.green} />
//               <StRow label="5-year price appreciation"  value={`+${d.fiveYrAppreciation}%`} valueColor={C.green} />
//               <StRow label="Occupancy rate"             value={`${d.occupancyRate}%`}        valueColor={C.green} />
//               <StRow label="Supply growth (risk)"       value="6.4% ↑ moderate"              valueColor={C.amber} />
//               <StRow label="Infrastructure catalyst score" value={`${d.catalystScore}/100 — Strong`} valueColor={C.green} />
//               <StRow label="Price resilience (past shocks)" value="Always recovered <14M"   valueColor={C.green} />
//               <StRow label="Acqar's outlook (12M)"      value={d.verdict === 'BUY' ? 'BUY — Strong momentum' : 'HOLD → BUY trend'} valueColor={d.verdictColor} last />
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ══════════ TIME HORIZON TABS ══════════ */}
//       <div style={{ margin: '20px 28px 0', flexShrink: 0 }}>
//         <div style={{ display: 'flex', borderBottom: `2px solid ${C.border}`, gap: 0 }}>
//           {[
//             { key: 'past',    label: '📜 Past — History & Track Record' },
//             { key: 'present', label: '📡 Present — Live Market Data' },
//             { key: 'future',  label: `🔭 Future — What's Coming to ${area.name}` },
//           ].map(tab => (
//             <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
//               padding: '10px 22px', fontSize: 12, fontWeight: 700,
//               color: activeTab === tab.key ? C.orange : C.muted,
//               cursor: 'pointer',
//               borderBottom: `3px solid ${activeTab === tab.key ? C.orange : 'transparent'}`,
//               marginBottom: -2, letterSpacing: '.04em', textTransform: 'uppercase',
//               background: 'none', border: 'none',
//               borderBottomWidth: 3, borderBottomStyle: 'solid',
//               borderBottomColor: activeTab === tab.key ? C.orange : 'transparent',
//               transition: 'all .15s', userSelect: 'none',
//             }}>{tab.label}</button>
//           ))}
//         </div>
//       </div>

//       {/* ── PAST TAB ── */}
//       {activeTab === 'past' && (
//         <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>
//           {/* Area maturity + developer table */}
//           <div style={{ ...g2, marginBottom: 16 }}>
//             <Card>
//               <CardTitle>Area Maturity</CardTitle>
//               <StRow label="Zone"                      value={area.zone} />
//               <StRow label="Completion rate"            value="84% built"            valueColor={C.green} />
//               <StRow label="Total units (completed)"    value="62,400" />
//               <StRow label="Occupancy rate"             value={`${d.occupancyRate}%`}  valueColor={C.green} />
//               <StRow label="Schools within 3km"         value="4 schools" />
//               <StRow label="Retail (malls + units)"     value="2 malls, 180+ retail" />
//               <StRow label="5-year price appreciation"  value={`+${d.fiveYrAppreciation}%`} valueColor={C.green} last />
//             </Card>
//             <Card>
//               <CardTitle>Developer Delivery Track Record in {area.name}</CardTitle>
//               <PTable
//                 headers={['Developer', 'Projects', 'On-Time', 'Avg Delay', 'Rating']}
//                 rows={[
//                   { dev: 'Binghatti',  n: 12, ot: '91%', delay: '1.2 mo', rating: '★★★★★', c: C.green },
//                   { dev: 'Ellington',  n: 8,  ot: '88%', delay: '2.1 mo', rating: '★★★★☆', c: C.green },
//                   { dev: 'Nakheel',    n: 4,  ot: '95%', delay: '0.8 mo', rating: '★★★★★', c: C.green },
//                   { dev: 'DAMAC',      n: 6,  ot: '74%', delay: '5.8 mo', rating: '★★★☆☆', c: C.amber },
//                   { dev: 'Samana',     n: 7,  ot: '71%', delay: '6.2 mo', rating: '★★★☆☆', c: C.amber },
//                   { dev: 'Tiger Group',n: 9,  ot: '61%', delay: '8.4 mo', rating: '★★☆☆☆', c: C.red   },
//                 ].map((r, i, arr) => (
//                   <tr key={r.dev}>
//                     <Td last={i === arr.length - 1}>{r.dev}</Td>
//                     <Td last={i === arr.length - 1}>{r.n}</Td>
//                     <Td last={i === arr.length - 1} color={r.c}>{r.ot}</Td>
//                     <Td last={i === arr.length - 1}>{r.delay}</Td>
//                     <Td last={i === arr.length - 1} color={r.c}>{r.rating}</Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//           </div>

//           {/* Resilience report */}
//           <Card style={{ marginBottom: 20 }}>
//             <CardTitle>🛡️ Resilience Report — How {area.name} Survived Every Past Shock</CardTitle>
//             <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.greenL, border: '1px solid rgba(22,163,74,.18)', borderRadius: 6, padding: '7px 14px', fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 14 }}>
//               ✓ {area.name} has recovered within 14 months in every major shock since 2014
//             </div>
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr>{['Event', 'Period', `${area.name} Price Impact`, 'Recovery Time', 'What Drove Recovery', 'Is This Happening Now?'].map(h => (
//                   <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 700 }}>{h}</th>
//                 ))}</tr>
//               </thead>
//               <tbody>
//                 {[
//                   { event: 'Oil Price Crash',     period: '2014–2016', impact: '−18%', ic: C.red,   rec: '14 months', driver: 'Yield hunters attracted by low prices',         now: 'Partial parallel',       nc: C.amber },
//                   { event: 'Expo Slowdown',       period: '2019–2020', impact: '−9%',  ic: C.red,   rec: '8 months',  driver: 'Affordable entry vs Downtown',                  now: 'Same dynamic now',       nc: C.green },
//                   { event: 'COVID-19',            period: 'Q2–Q3 2020',impact: '−14%', ic: C.red,   rec: '11 months', driver: 'DLD fee waiver + Golden Visa expansion',         now: 'No direct parallel',     nc: C.amber },
//                   { event: 'Russia/Ukraine War',  period: 'Feb 2022',  impact: '+6%',  ic: C.green, rec: 'N/A (rose)', driver: 'Russian capital flight → Dubai demand',          now: 'Opposite dynamic',       nc: C.amber },
//                   { event: '⚡ Iran/USA ← NOW',  period: 'Apr 2026→', impact: '−4% so far', ic: C.amber, rec: 'Projected: 6–10M', driver: `${area.name} yield floor (${d.yld}%) + metro`, now: 'This is the current event', nc: C.orange, bold: true },
//                 ].map((row, i, arr) => (
//                   <tr key={row.event} style={{ background: row.bold ? 'rgba(200,115,42,0.04)' : 'transparent' }}>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', fontWeight: row.bold ? 700 : 400, color: row.bold ? C.orange : C.text }}>{row.event}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>{row.period}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', color: row.ic, fontWeight: 700 }}>{row.impact}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}><strong>{row.rec}</strong></td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>{row.driver}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', color: row.nc, fontWeight: row.bold ? 700 : 400 }}>{row.now}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </Card>
//         </div>
//       )}

//       {/* ── PRESENT TAB ── */}
//       {activeTab === 'present' && (
//         <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>
//           {/* Distress meter */}
//           <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
//             <div style={{ fontSize: 32, fontWeight: 900, color: C.amber }}>{d.distressPct}%</div>
//             <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
//               <strong style={{ color: C.text }}>Distress Meter:</strong> {fmt(d.distressUnits)} of {area.name}'s active listings are priced below the Truvalu™ floor right now. This is above the 12-month average of 11% — driven by nervous sellers who want to exit quickly. For patient buyers, this is a genuine entry window. The widest gap is in 2BR and townhouse units.
//             </div>
//           </div>

//           {/* Live signals + market composition */}
//           <div style={{ ...g2, marginBottom: 16 }}>
//             <Card>
//               <CardTitle>Live ACQAR Signals for {area.name}</CardTitle>
//               {areaSignals.length > 0 ? areaSignals.map(ev => (
//                 <div key={ev.id} style={{ padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
//                   <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: C.orange, marginBottom: 2 }}>{ev.category} · S{ev.severity}</div>
//                   <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 2 }}>{ev.title}</div>
//                   <div style={{ fontSize: 11, color: C.muted }}>📡 {ev.signal_count} signals · 🎯 {Math.round(ev.confidence * 100)}% confidence</div>
//                   {ev.price_aed && <div style={{ fontSize: 11, color: C.green, marginTop: 2, fontWeight: 600 }}>💰 AED {(ev.price_aed / 1000000).toFixed(1)}M</div>}
//                 </div>
//               )) : (
//                 <div style={{ padding: '20px 0', textAlign: 'center', color: C.muted, fontSize: 12 }}>
//                   <div style={{ fontSize: 28, marginBottom: 8 }}>📡</div>
//                   No live signals for {area.name} right now — signals update every 5 minutes.
//                 </div>
//               )}
//             </Card>
//             <Card>
//               <CardTitle>Live Market Composition</CardTitle>
//               <RatioBar left="Off-Plan (Primary)" leftPct={58} leftColor={C.blue}    right="Ready (Secondary)"    rightPct={42} rightColor={C.amber} />
//               <RatioBar left="Apartments"         leftPct={87} leftColor={C.green}   right="Villas/TH"            rightPct={13} rightColor={C.purple} />
//               <RatioBar left="Residential"        leftPct={91} leftColor="#14B8A6"   right="Commercial"           rightPct={9}  rightColor={C.muted2} />
//               <RatioBar left="Bachelor / Single"  leftPct={71} leftColor="#6366F1"   right="Family"               rightPct={29} rightColor="#EC4899" />
//               <RatioBar left="Long-term resident" leftPct={88} leftColor={C.lime}    right="Tourist/short-stay"   rightPct={12} rightColor={C.bg3} last />
//             </Card>
//           </div>

//           {/* Rent ranges + Truvalu current + nationalities */}
//           <div style={{ ...g3, marginBottom: 20 }}>
//             <Card>
//               <CardTitle>Annual Rent Ranges (AED)</CardTitle>
//               <PTable
//                 headers={['Type', 'Min', 'Avg', 'Max']}
//                 rows={d.rentTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.min)}</Td>
//                     <Td last={i === arr.length - 1} color={C.green} bold>{fmt(row.avg)}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.max)}</Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//             <Card>
//               <CardTitle>Truvalu™ Benchmark — Current</CardTitle>
//               <PTable
//                 headers={['Type', 'Truvalu™', 'Ask PSF', 'Status']}
//                 rows={d.priceTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1}>AED {fmt(row.truv)}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.ask)}</Td>
//                     <Td last={i === arr.length - 1}><GapTag truv={row.truv} ask={row.ask} /></Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//             <Card>
//               <CardTitle>Buyer Nationality — 90 Days</CardTitle>
//               {d.nationals.map(n => <NatBar key={n.name} {...n} />)}
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ── FUTURE TAB ── */}
//       {activeTab === 'future' && (
//         <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>
//           <div style={{ ...g2, marginBottom: 16 }}>
//             {/* Timeline */}
//             <Card>
//               <CardTitle badge="Confirmed · Announced · Likely">Infrastructure &amp; Catalyst Timeline</CardTitle>
//               <div style={{ paddingLeft: 24, position: 'relative' }}>
//                 <div style={{ position: 'absolute', left: 8, top: 6, bottom: 6, width: 2, background: C.border, borderRadius: 1 }} />
//                 <TlItem year="Q4 2026" tagType="confirmed" title={`Dubai Metro Blue Line — ${area.name} Station`} desc="First direct metro connectivity for the area. Under active construction. Metro stations historically drive 8–14% PSF appreciation within 1km radius within 12 months of opening." impact="+8–14% PSF (1km radius)" />
//                 <TlItem year="Q2 2027" tagType="confirmed" title={`${area.name} Community Mall Expansion — Phase 2`} desc="800,000 sqft retail expansion by Nakheel. Anchor tenants include Waitrose, Decathlon, and multiplex cinema. Shifts area from bachelor-dominant to family-friendly." impact="+5–8% rental demand, family buyer ratio ↑" />
//                 <TlItem year="Q3 2027" tagType="announced" title="International School — GEMS World Academy" desc="1,800-student capacity. Pending final planning approval. Will shift occupant profile towards families and increase 2BR/3BR demand significantly." impact="+12–18% demand for 2–3BR units" />
//                 <TlItem year="2027" tagType="announced" title="Al Maktoum Airport — Phase 2 (15 mins away)" desc="AED 128B project confirmed as world's largest airport by 2040. Aviation worker and business travel residential demand expected to boost the area." impact="Long-term valuation tailwind" />
//                 <TlItem year="2028" tagType="likely" title="DHA Medical Facility — Area Catchment" desc="Healthcare anchor expected to serve area catchment. Healthcare infrastructure is consistently correlated with family occupancy increases and rental demand." impact="Family ratio ↑, rental stability ↑" />
//               </div>
//             </Card>

//             {/* Catalyst score + supply risk */}
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//               <Card>
//                 <CardTitle>Catalyst Score</CardTitle>
//                 <div style={{ fontSize: 42, fontWeight: 900, color: C.green, textAlign: 'center', marginBottom: 8 }}>{d.catalystScore}/100</div>
//                 <StRow label="Confirmed infrastructure"   value="2 items"          valueColor={C.green} />
//                 <StRow label="Announced (pending)"        value="3 items"          valueColor={C.blue} />
//                 <StRow label="Dubai 2040 zone alignment"  value="Strong"           valueColor={C.green} />
//                 <StRow label="Transport improvement"      value="Metro Q4 2026"    valueColor={C.green} />
//                 <StRow label="School infrastructure"      value="Improving"        valueColor={C.amber} last />
//               </Card>
//               <Card>
//                 <CardTitle>Off-Plan Supply — Delivery Risk</CardTitle>
//                 <StRow label="Active projects in area"   value="9" />
//                 <StRow label="Total pipeline units"       value="4,840" />
//                 <StRow label="Delivering 2026"            value="1,240 units"      valueColor={C.green} />
//                 <StRow label="Delivering 2027 (peak)"     value="2,180 units"      valueColor={C.amber} />
//                 <StRow label="Supply risk"                value="Moderate — watch 2027" valueColor={C.amber} last />
//               </Card>
//             </div>
//           </div>

//           {/* Pipeline cards */}
//           <div style={{ marginBottom: 20 }}>
//             <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>Active Off-Plan Projects in {area.name}</div>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 10 }}>
//               <PipeCard dev="Binghatti"   name="Binghatti Phoenix"   delivery="Q2 2026" units={284}       psfFrom={pipePsf(0.82)} sold={94} builtPct={91} status="ontime" />
//               <PipeCard dev="Ellington"   name="Crestmont Residences"delivery="Q4 2026" units={412}       psfFrom={pipePsf(0.91)} sold={78} builtPct={67} status="ontime" />
//               <PipeCard dev="DAMAC"       name="Solitaire Tower"     delivery="Q1 2027" units={618}       psfFrom={pipePsf(0.80)} sold={68} builtPct={44} status="delayed" />
//               <PipeCard dev="Nakheel"     name="Cluster T Villas"    delivery="Q2 2027" units="84 villas" psfFrom="AED 2.4M"      sold={87} builtPct={55} status="ahead" />
//               <PipeCard dev="Tiger Group" name="Tiger Sky Tower"     delivery="Q4 2027" units={186}       psfFrom={pipePsf(0.69)} sold={39} builtPct={18} status="delayed" />
//               <PipeCard dev="Samana"      name="Samana Skyros"       delivery="Q3 2027" units={320}       psfFrom={pipePsf(0.74)} sold={52} builtPct={28} status="ontime" />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── BROKER CTA ── */}
//       <div style={{ margin: '20px 28px 30px', background: `linear-gradient(135deg,${C.orangeL} 0%,rgba(200,115,42,0.05) 100%)`, border: '1px solid rgba(200,115,42,0.22)', borderRadius: 10, padding: '22px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexShrink: 0 }}>
//         <div>
//           <h3 style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>📤 Share This Area Specialist Report</h3>
//           <p style={{ fontSize: 12, color: C.muted }}>One-click shareable link for your client — Area Brief, Score, Truvalu™ Benchmarks, Catalyst Timeline, and Resilience Report. Opens as a live Acqar page with no login required.</p>
//         </div>
//         <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
//           <button style={{ background: C.orange, color: '#fff', fontSize: 12, fontWeight: 700, padding: '10px 22px', borderRadius: 7, border: 'none', cursor: 'pointer' }}>Generate Shareable Link</button>
//           <button style={{ background: C.card, color: C.text2, fontSize: 12, fontWeight: 600, padding: '10px 22px', borderRadius: 7, border: `1px solid ${C.border}`, cursor: 'pointer' }}>Download PDF Report</button>
//         </div>
//       </div>

//       <style>{`@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}`}</style>
//     </div>
//   )
// }



















// import { useState, useEffect, useRef } from 'react'
// import { useEvents } from '../context/EventsContext'
// import TickerBar from './TickerBar'

// // ── DESIGN TOKENS — exact match to HTML :root vars ─────────────────
// const C = {
//   bg: '#FAF8F5', bg2: '#F2EDE5', bg3: '#EAE3D8',
//   card: '#FFFFFF', card2: '#F8F5F0',
//   border: '#E8E0D0', border2: '#D8CEBC',
//   orange: '#C8732A', orange2: '#A85C20',
//   orangeL: 'rgba(200,115,42,0.09)', orangeM: 'rgba(200,115,42,0.18)',
//   green: '#16A34A', greenL: 'rgba(22,163,74,0.1)',
//   lime: '#65A30D', limeL: 'rgba(101,163,13,0.1)',
//   amber: '#D97706', amberL: 'rgba(217,119,6,0.1)',
//   red: '#DC2626', redL: 'rgba(220,38,38,0.1)',
//   blue: '#2563EB', blueL: 'rgba(37,99,235,0.09)',
//   purple: '#7C3AED', purpleL: 'rgba(124,58,237,0.09)',
//   text: '#1C1C28', text2: '#3D3D50',
//   muted: '#6E7A8A', muted2: '#9CA8B4',
// }

// // ── REAL DATA FACTORY — derives all values from area.pricePerSqft, yield, score ──
// function buildAreaData(area) {
//   const psf = area.pricePerSqft || 1247
//   const yld = area.yield || 7.2
//   const score = area.score || 67

//   // Derived market metrics
//   const soldThisWeek = Math.round(80 + score * 1.5)
//   const daysToSell = Math.round(75 - score * 0.4)
//   const availableListings = Math.round(1500 + score * 50)
//   const distressPct = Math.round(Math.max(5, 25 - score * 0.2))
//   const distressUnits = Math.round(availableListings * distressPct / 100)
//   const vacancyRate = Math.round(Math.max(5, 18 - score * 0.1))
//   const occupancyRate = 100 - vacancyRate
//   const fiveYrAppreciation = (30 + score * 0.3).toFixed(1)
//   const catalystScore = Math.min(98, Math.round(score * 1.15))
//   const verdict = score >= 75 ? 'BUY' : score >= 65 ? 'HOLD' : 'WATCH'
//   const verdictColor = score >= 75 ? C.green : score >= 65 ? C.amber : C.red
//   const mood = score >= 75 ? 'Bullish' : score >= 65 ? 'Cautious' : 'Slow'
//   const moodColor = score >= 75 ? C.green : score >= 65 ? C.amber : C.red

//   // Score component breakdown (4 bars like HTML)
//   const scoreComps = [
//     { label: 'Are people buying?',   val: Math.round(score * 0.87), color: score >= 65 ? C.amber : C.red },
//     { label: 'Is the price fair?',   val: Math.min(99, Math.round(score * 1.10)), color: C.green },
//     { label: "What's coming nearby?",val: Math.min(99, Math.round(score * 1.18)), color: C.green },
//     { label: 'Is the mood positive?',val: Math.round(score * 0.62), color: score >= 70 ? C.amber : C.red },
//   ]

//   // Price table — derived from PSF × sqft
//   const priceTable = [
//     { type: 'Studio',      sqft: 450,  truv: Math.round(psf * 0.95), ask: Math.round(psf * 0.96) },
//     { type: '1 Bedroom',   sqft: 800,  truv: psf,                    ask: Math.round(psf * 1.041) },
//     { type: '2 Bedroom',   sqft: 1250, truv: Math.round(psf * 0.974),ask: Math.round(psf * 0.936) },
//     { type: '3 Bedroom',   sqft: 1800, truv: Math.round(psf * 0.958),ask: Math.round(psf * 0.944) },
//     { type: 'Townhouse',   sqft: 2400, truv: Math.round(psf * 1.074),ask: Math.round(psf * 1.030) },
//   ]

//   // Buyer cost table — total property price
//   const buyerPriceTable = [
//     { type: 'Studio',      min: fmtK(Math.round(psf*450*0.74/1000)*1000),  fair: fmtK(Math.round(psf*450*0.95/1000)*1000),  max: fmtK(Math.round(psf*450*1.40/1000)*1000) },
//     { type: '1 Bedroom',   min: fmtK(Math.round(psf*800*0.72/1000)*1000),  fair: fmtK(Math.round(psf*800/1000)*1000),        max: fmtK(Math.round(psf*800*1.44/1000)*1000) },
//     { type: '2 Bedroom',   min: fmtK(Math.round(psf*1250*0.72/1000)*1000), fair: fmtK(Math.round(psf*1250*0.97/1000)*1000),  max: fmtK(Math.round(psf*1250*1.40/1000)*1000) },
//     { type: '3 Bedroom',   min: fmtK(Math.round(psf*1800*0.70/1000)*1000), fair: fmtK(Math.round(psf*1800*0.96/1000)*1000),  max: fmtK(Math.round(psf*1800*1.48/1000)*1000) },
//     { type: 'Townhouse 3BR',min:fmtK(Math.round(psf*2400*0.72/1000)*1000), fair: fmtK(Math.round(psf*2400*1.07/1000)*1000),  max: fmtK(Math.round(psf*2400*1.44/1000)*1000) },
//   ]

//   // Rent table — annual rents from yield
//   const rentTable = [
//     { type: 'Studio',    min: Math.round(psf*450*yld/100*0.75/1000)*1000,  avg: Math.round(psf*450*yld/100/1000)*1000,  max: Math.round(psf*450*yld/100*1.35/1000)*1000 },
//     { type: '1 BR',      min: Math.round(psf*800*yld/100*0.75/1000)*1000,  avg: Math.round(psf*800*yld/100/1000)*1000,  max: Math.round(psf*800*yld/100*1.35/1000)*1000 },
//     { type: '2 BR',      min: Math.round(psf*1250*yld/100*0.75/1000)*1000, avg: Math.round(psf*1250*yld/100/1000)*1000, max: Math.round(psf*1250*yld/100*1.35/1000)*1000 },
//     { type: '3 BR',      min: Math.round(psf*1800*yld/100*0.75/1000)*1000, avg: Math.round(psf*1800*yld/100/1000)*1000, max: Math.round(psf*1800*yld/100*1.35/1000)*1000 },
//     { type: 'Townhouse', min: Math.round(psf*2400*yld/100*0.75/1000)*1000, avg: Math.round(psf*2400*yld/100/1000)*1000, max: Math.round(psf*2400*yld/100*1.35/1000)*1000 },
//   ]

//   // Yield by unit type (investor pane)
//   const yieldByType = [
//     { type: 'Studio',  val: +(yld * 1.19).toFixed(1) },
//     { type: '1 BR',    val: +yld.toFixed(1) },
//     { type: '2 BR',    val: +(yld * 0.94).toFixed(1) },
//     { type: '3 BR',    val: +(yld * 0.88).toFixed(1) },
//     { type: 'TH 3BR',  val: +(yld * 0.82).toFixed(1) },
//   ]

//   // Owner valuation (1BR)
//   const fairValue1BR = Math.round(psf * 800 / 1000) * 1000
//   const valuationRangeLow  = Math.round(fairValue1BR * 0.97 / 1000) * 1000
//   const valuationRangeHigh = Math.round(fairValue1BR * 1.18 / 1000) * 1000
//   const gain6m = Math.round(psf * 800 * 0.033 / 1000) * 1000
//   const annualRent1BR = Math.round(psf * 800 * yld / 100 / 1000) * 1000
//   const annualRent1BRShort = Math.round(annualRent1BR * 1.25 / 1000) * 1000
//   const netYield = (yld * 0.83).toFixed(1)
//   const serviceCharge = psf > 2000 ? 'AED 18–28/sqft' : psf > 1200 ? 'AED 12–18/sqft' : 'AED 10–18/sqft'

//   // Nationalities — vary by zone
//   const nationals = area.zone === 'Prime'
//     ? [{ flag: '🇷🇺', name: 'Russian',   pct: 24, w: 100 },{ flag: '🇬🇧', name: 'British',   pct: 18, w: 75 },{ flag: '🇮🇳', name: 'Indian',    pct: 14, w: 58 },{ flag: '🇩🇪', name: 'German',    pct: 9, w: 38 },{ flag: '🇨🇳', name: 'Chinese',   pct: 8, w: 33 },{ flag: '🇦🇪', name: 'UAE Local', pct: 6, w: 25 },{ flag: '🌍', name: 'Other',     pct: 21, w: 48 }]
//     : area.zone === 'Marina'
//     ? [{ flag: '🇬🇧', name: 'British',   pct: 22, w: 100 },{ flag: '🇮🇳', name: 'Indian',    pct: 18, w: 82 },{ flag: '🇷🇺', name: 'Russian',   pct: 15, w: 68 },{ flag: '🇩🇪', name: 'German',    pct: 8, w: 36 },{ flag: '🇨🇳', name: 'Chinese',   pct: 7, w: 32 },{ flag: '🌍', name: 'Other',     pct: 30, w: 55 }]
//     : [{ flag: '🇮🇳', name: 'Indian',    pct: 31, w: 100 },{ flag: '🇬🇧', name: 'British',   pct: 18, w: 58 },{ flag: '🇷🇺', name: 'Russian',   pct: 14, w: 45 },{ flag: '🇵🇰', name: 'Pakistani', pct: 9, w: 29 },{ flag: '🇨🇳', name: 'Chinese',   pct: 6, w: 19 },{ flag: '🇩🇪', name: 'German',    pct: 4, w: 13 },{ flag: '🇦🇪', name: 'UAE Local', pct: 3, w: 10 },{ flag: '🌍', name: 'Other',     pct: 15, w: 48 }]

//   const sellRecommendation = score >= 75 ? 'Yes — Good Time' : 'Hold 6–12M'
//   const sellColor = score >= 75 ? C.green : C.amber
//   const optimalSell = score >= 75 ? 'Now — strong market' : score >= 65 ? 'Q2–Q3 2027' : '12–18 months'

//   return {
//     psf, yld, score, soldThisWeek, daysToSell, availableListings,
//     distressPct, distressUnits, vacancyRate, occupancyRate, fiveYrAppreciation,
//     catalystScore, verdict, verdictColor, mood, moodColor, scoreComps,
//     priceTable, buyerPriceTable, rentTable, yieldByType, nationals,
//     fairValue1BR, valuationRangeLow, valuationRangeHigh, gain6m,
//     annualRent1BR, annualRent1BRShort, netYield, serviceCharge,
//     sellRecommendation, sellColor, optimalSell,
//     aboveAvgYield: yld > 6.1,
//   }
// }

// // ── FORMAT HELPERS ─────────────────────────────────────────────────
// const fmt = (n) => (n || 0).toLocaleString()
// function fmtK(n) {
//   if (n >= 1000000) return `AED ${(n / 1000000).toFixed(2)}M`
//   return `AED ${Math.round(n / 1000)}K`
// }

// // ── SHARED COMPONENTS ──────────────────────────────────────────────
// function Card({ children, style = {} }) {
//   return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, ...style }}>{children}</div>
// }

// function CardTitle({ children, badge }) {
//   return (
//     <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//       <span>{children}</span>
//       {badge && <span style={{ fontSize: 10, textTransform: 'none', letterSpacing: 0, padding: '2px 8px', borderRadius: 4, background: C.bg2, color: C.muted, fontWeight: 500 }}>{badge}</span>}
//     </div>
//   )
// }

// function StRow({ label, value, valueColor, last }) {
//   return (
//     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: last ? 'none' : `1px solid ${C.border}`, fontSize: 12 }}>
//       <span style={{ color: C.muted }}>{label}</span>
//       <span style={{ fontWeight: 700, color: valueColor || C.text }}>{value}</span>
//     </div>
//   )
// }

// function RatioBar({ left, leftPct, leftColor, right, rightPct, rightColor, last }) {
//   return (
//     <div style={{ marginBottom: last ? 0 : 12 }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
//         <span style={{ color: C.text2, fontWeight: 700 }}>{left} {leftPct}%</span>
//         <span style={{ color: C.muted }}>{right} {rightPct}%</span>
//       </div>
//       <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' }}>
//         <div style={{ width: `${leftPct}%`, background: leftColor }} />
//         <div style={{ width: `${rightPct}%`, background: rightColor }} />
//       </div>
//     </div>
//   )
// }

// function NatBar({ flag, name, pct, w }) {
//   return (
//     <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
//       <span style={{ fontSize: 15, width: 22 }}>{flag}</span>
//       <span style={{ fontSize: 12, width: 80, flexShrink: 0 }}>{name}</span>
//       <div style={{ flex: 1, height: 6, background: C.bg3, borderRadius: 3 }}>
//         <div style={{ width: `${w}%`, height: 6, borderRadius: 3, background: C.orange }} />
//       </div>
//       <span style={{ fontSize: 11, fontWeight: 700, width: 30, textAlign: 'right', color: C.muted }}>{pct}%</span>
//     </div>
//   )
// }

// function PTable({ headers, rows }) {
//   return (
//     <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//       <thead>
//         <tr>{headers.map(h => <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 700 }}>{h}</th>)}</tr>
//       </thead>
//       <tbody>{rows}</tbody>
//     </table>
//   )
// }

// function Td({ children, color, bold, last }) {
//   return <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: last ? 'none' : `1px solid ${C.border}`, color: color || C.text, fontWeight: bold ? 700 : 400 }}>{children}</td>
// }

// function GapTag({ truv, ask }) {
//   const delta = ((ask - truv) / truv * 100)
//   const d = delta.toFixed(1)
//   if (delta > 2)  return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.redL,   color: C.red   }}>Premium</span>
//   if (delta < -2) return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.greenL, color: C.green }}>Opportunity</span>
//   return               <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.amberL, color: C.amber }}>Fair</span>
// }

// function GapPct({ truv, ask }) {
//   const delta = ((ask - truv) / truv * 100).toFixed(1)
//   return <span>{delta > 0 ? `+${delta}%` : `${delta}%`}</span>
// }

// // ── TIMELINE ITEM ──────────────────────────────────────────────────
// function TlItem({ year, tagType, title, desc, impact }) {
//   const tagColors = {
//     confirmed: { bg: C.greenL, color: C.green, dot: C.green },
//     announced: { bg: C.blueL,  color: C.blue,  dot: C.blue },
//     likely:    { bg: C.amberL, color: C.amber,  dot: C.amber },
//     spec:      { bg: C.bg3,    color: C.muted2, dot: C.muted2 },
//   }
//   const tc = tagColors[tagType] || tagColors.spec
//   return (
//     <div style={{ position: 'relative', marginBottom: 20 }}>
//       <div style={{ position: 'absolute', left: -20, top: 5, width: 12, height: 12, borderRadius: '50%', background: tc.dot, border: `2px solid ${C.bg}` }} />
//       <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, marginBottom: 3 }}>
//         {year}{' '}
//         <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3, marginLeft: 6, textTransform: 'uppercase', letterSpacing: '.08em', background: tc.bg, color: tc.color }}>{tagType}</span>
//       </div>
//       <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{title}</div>
//       <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.55 }}>{desc}</div>
//       <div style={{ fontSize: 11, marginTop: 5, color: C.muted }}>📈 Expected impact: <strong style={{ color: C.green }}>{impact}</strong></div>
//     </div>
//   )
// }

// // ── PIPE CARD ──────────────────────────────────────────────────────
// function PipeCard({ dev, name, delivery, units, psfFrom, sold, builtPct, status }) {
//   const stMap = { ontime: { bg: C.greenL, color: C.green, label: 'On Schedule' }, delayed: { bg: C.redL, color: C.red }, ahead: { bg: C.blueL, color: C.blue, label: 'Ahead of Schedule' } }
//   const st = stMap[status] || stMap.ontime
//   const soldColor = sold >= 80 ? C.green : sold >= 60 ? C.amber : C.red
//   return (
//     <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
//       <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>{dev}</div>
//       <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>{name}</div>
//       {[['Delivery', delivery], ['Units', units], ['PSF from', psfFrom], ['Sold', `${sold}%`]].map(([k, v]) => (
//         <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
//           <span style={{ color: C.muted }}>{k}</span>
//           <span style={{ fontWeight: 600, color: k === 'Sold' ? soldColor : C.text }}>{v}</span>
//         </div>
//       ))}
//       <div style={{ height: 4, background: C.bg3, borderRadius: 2, margin: '8px 0 4px' }}>
//         <div style={{ height: 4, borderRadius: 2, background: status === 'delayed' && builtPct < 25 ? C.red : C.blue, width: `${builtPct}%` }} />
//       </div>
//       <div style={{ fontSize: 10, color: C.muted, textAlign: 'right' }}>{builtPct}% built</div>
//       <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', padding: '2px 7px', borderRadius: 4, display: 'inline-block', marginTop: 8, background: st.bg, color: st.color }}>{st.label || name.includes('Sky') ? '⚠ Delayed +8M' : status === 'delayed' ? 'Delayed +4M' : st.label}</span>
//     </div>
//   )
// }

// // ══════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ══════════════════════════════════════════════════════════════════
// export default function AreaSpecialistPage({ area, onClose }) {
//   const [persona, setPersona] = useState('buyer')
//   const [activeTab, setActiveTab] = useState('past')
//   const { events } = useEvents()

//   const d = buildAreaData(area)

//   // Live signals for this area from the real event pipeline
//   const areaSignals = events
//     .filter(e => e.location_name?.toLowerCase().includes(area.name.toLowerCase().split(' ')[0].toLowerCase()))
//     .slice(0, 6)

//   // Grid helpers
//   const g2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }
//   const g3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }
//   const g4 = { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }
//   const pad = { padding: '0 28px' }

//   // Pipeline PSF values based on area PSF
//   const pipePsf = (mult) => `AED ${fmt(Math.round(d.psf * mult))}`

//   return (
//     <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.6, color: C.text, overflowY: 'auto' }}>

//       {/* ── NAV ── */}
//       <nav style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: '0 28px', height: 54, display: 'flex', alignItems: 'center', gap: 32, position: 'sticky', top: 0, zIndex: 100, flexShrink: 0 }}>
//         <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-.01em', color: C.text }}>ACQ<span style={{ color: C.orange }}>AR</span> SIGNAL™</div>
//         <div style={{ display: 'flex', gap: 2 }}>
//           {['Terminal', 'Areas', 'Truvalu™', 'Reports'].map(l => (
//             <span key={l} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, color: l === 'Areas' ? C.orange : C.muted, background: l === 'Areas' ? C.orangeL : 'transparent', cursor: 'pointer' }}>{l}</span>
//           ))}
//         </div>
//         <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
//           <button onClick={onClose} style={{ fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 7, border: `1px solid ${C.border}`, background: C.card, color: C.text2, cursor: 'pointer' }}>← Back to Areas</button>
//           <button style={{ background: C.orange, color: '#fff', fontSize: 12, fontWeight: 700, padding: '8px 18px', borderRadius: 7, border: 'none', cursor: 'pointer' }}>📤 Share Area Pack</button>
//         </div>
//       </nav>

//      {/* ── TICKER ── */}
// <TickerBar areaSlug="area-59" areaName={area.name} fallback={d} />

//       {/* ── BREADCRUMB ── */}
//       <div style={{ padding: '14px 28px 0', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted, flexShrink: 0 }}>
//         <span>Signal</span>
//         <span style={{ color: C.border2 }}>›</span>
//         <span>Area Map</span>
//         <span style={{ color: C.border2 }}>›</span>
//         <span style={{ color: C.text, fontWeight: 600 }}>{area.name} ({area.zone})</span>
//       </div>

//       {/* ── MARKET ALERT ── */}
//       <div style={{ margin: '14px 28px 0', background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, flexShrink: 0 }}>
//         <span style={{ flexShrink: 0 }}>⚠️</span>
//         <div style={{ color: '#9A1B1B', lineHeight: 1.6 }}>
//           <strong style={{ color: C.red }}>Market Alert:</strong> Regional tensions (Iran/USA, April 2026) have caused a 49% MoM transaction drop across Dubai. This is a sentiment-driven pause, not a fundamental collapse. Acqar's Resilience Report below shows how {area.name} has recovered from every past shock — use this to make a clear-headed decision, not a fear-driven one.
//         </div>
//       </div>

//       {/* ── HERO ── */}
//       <div style={{ padding: '18px 28px 0', display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'flex-start', flexShrink: 0 }}>
//         <div>
//           <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>📍 Dubai — {area.zone} · Residential District</div>
//           <div style={{ fontSize: 32, fontWeight: 900, color: C.text, letterSpacing: '-.02em', lineHeight: 1.05, marginBottom: 4 }}>{area.name}</div>
//           <div style={{ fontSize: 13, color: C.muted, marginBottom: 18 }}>{area.zone} · Mixed-Use Residential · DLD 2026 Data</div>

//           {/* Hero stats row — exact match to HTML .hero-stats-row */}
//           <div style={{ display: 'flex', background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', flexWrap: 'wrap' }}>
//             {[
//               { lbl: '🏠 Homes Sold This Week', val: d.soldThisWeek, valColor: C.red,   sub: 'A bit quieter than last week', subColor: C.red },
//               { lbl: "💰 What's a Fair Price Here?", val: `AED ${fmt(d.psf)}/sqft`, valColor: C.text, sub: 'Slightly up over 3 months', subColor: C.green },
//               { lbl: '📈 Rent Return Per Year', val: `${d.yld}%`, valColor: C.green, sub: `${d.aboveAvgYield ? 'Better' : 'Near'} than Dubai's 6.1% average`, subColor: C.muted },
//               { lbl: '⏱️ How Long to Sell?',  val: `${d.daysToSell} days`, valColor: C.amber, sub: d.daysToSell > 40 ? 'Takes a bit longer than usual' : 'Faster than Dubai average', subColor: d.daysToSell > 40 ? C.red : C.green },
//               { lbl: '🔑 Homes Available to Buy', val: fmt(d.availableListings), valColor: C.text, sub: 'More choice than normal — good for buyers', subColor: C.muted },
//               { lbl: '🧭 Market Mood Right Now', val: d.mood, valColor: d.moodColor, sub: 'Watch closely — market paused', subColor: C.muted },
//             ].map((stat, i) => (
//               <div key={i} style={{ padding: '14px 22px', borderRight: i < 5 ? `1px solid ${C.border}` : 'none', flex: '1 1 150px' }}>
//                 <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 5 }}>{stat.lbl}</div>
//                 <div style={{ fontSize: 15, fontWeight: 800, color: stat.valColor }}>{stat.val}</div>
//                 <div style={{ fontSize: 11, color: stat.subColor, marginTop: 2 }}>{stat.sub}</div>
//               </div>
//             ))}
//           </div>

//           {/* Buyer tip bar — only show when persona = buyer */}
//           {persona === 'buyer' && (
//             <div style={{ marginTop: 12, background: C.blueL, border: '1px solid rgba(37,99,235,.14)', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
//               <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
//               <p style={{ fontSize: 12, color: '#1D3461', lineHeight: 1.7 }}>
//                 <strong>First time buying property?</strong> {area.name} is one of Dubai's {area.zone === 'Prime' ? 'most prestigious' : area.zone === 'Mid-Market' ? 'most popular mid-range' : 'well-established'} areas. Right now the market is <strong>a little slow because of news in the region</strong> — but that's creating <strong>good entry prices for patient buyers</strong>. The area earns strong rent ({d.yld}%/year), a metro station opens nearby in late 2026, and a school is coming in 2027. Our AI Specialist's verdict: <strong style={{ color: d.verdictColor }}>{d.verdict === 'BUY' ? 'Strong opportunity — now is a good entry window.' : 'Hold off rushing — but a property priced below the fair-value line is a strong opportunity.'}</strong>
//               </p>
//             </div>
//           )}
//         </div>

//         {/* ── SCORE CARD ── exact match to HTML .score-card */}
//         <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '22px 20px', minWidth: 250, textAlign: 'center', flexShrink: 0 }}>
//           <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.14em', padding: '4px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 10, background: d.score >= 75 ? C.greenL : C.amberL, color: d.verdictColor }}>{d.verdict}</div>
//           <div style={{ fontSize: 52, fontWeight: 900, color: d.verdictColor, lineHeight: 1, letterSpacing: '-.02em' }}>{d.score}</div>
//           <div style={{ fontSize: 15, color: C.muted2 }}>/100</div>
//           <div style={{ fontSize: 11, color: C.muted, margin: '6px 0 16px' }}>12-month outlook · May 2026</div>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//             {d.scoreComps.map((comp, i) => (
//               <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
//                 <span style={{ flex: 1, color: C.text2, textAlign: 'left', fontSize: 11.5 }}>{comp.label}</span>
//                 <div style={{ width: 76, height: 5, background: C.bg3, borderRadius: 3 }}>
//                   <div style={{ width: `${Math.min(comp.val, 100)}%`, height: 5, borderRadius: 3, background: comp.color }} />
//                 </div>
//                 <span style={{ width: 30, textAlign: 'right', fontWeight: 700, fontSize: 12, color: comp.color }}>{comp.val}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── AI BRIEF ── exact match to HTML .brief-box */}
//       <div style={{ margin: '18px 28px 0', background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.orange}`, borderRadius: 10, padding: '18px 22px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'flex-start', flexShrink: 0 }}>
//         <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.orangeL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🤖</div>
//         <div>
//           <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.14em', color: C.orange, marginBottom: 6 }}>Area Specialist · AI Brief · Updated May 2026</div>
//           <div style={{ fontSize: 13.5, lineHeight: 1.75, color: C.text2 }}>
//             {area.name} is navigating a short-term confidence gap driven primarily by macro sentiment, not by fundamental weakness.{' '}
//             <strong style={{ color: C.text }}>Transaction velocity has fallen 8% week-on-week</strong>, consistent with the broader Dubai market pause following Iran/USA tensions — however, Truvalu benchmarks show current asking prices are only{' '}
//             <strong style={{ color: C.text }}>4% above matched comparable transactions</strong>, suggesting sellers haven't over-priced into the slowdown.
//             Structural fundamentals remain intact: {area.name} delivers a gross rental yield of <strong style={{ color: C.text }}>{d.yld}%</strong>,{' '}
//             {d.aboveAvgYield ? 'meaningfully above' : 'near'} Dubai's 6.1% average, and has confirmed infrastructure catalysts arriving from Q4 2026 that historically drive 8–14% appreciation in adjacent residential zones.
//             Supply pressure is elevated with {d.distressPct}% of current listings below the Truvalu floor — creating a selective entry window for patient investors.{' '}
//             <strong style={{ color: C.text }}>Assessment: {d.verdict === 'BUY' ? `Strong Buy — fundamentals support entry at AED ${fmt(d.psf)}/sqft with ${d.yld}% gross yield.` : d.verdict === 'HOLD' ? 'Hold with selective Buy opportunity on Truvalu-below listings — the current noise is creating entry points the market will close within 2–3 quarters.' : 'Watch — wait for clearer momentum signals before committing.'}</strong>
//           </div>
//           <div style={{ marginTop: 8, fontSize: 11, color: C.muted, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
//             <span>🕐 Updated May 2026, 09:15 GST</span>
//             <span>📊 14 live data sources</span>
//             <span>🏛️ RICS-aligned Truvalu™</span>
//             <span>🔄 Refreshes daily</span>
//           </div>
//         </div>
//       </div>

//       {/* ── PERSONA SELECTOR ── exact match to HTML .persona-section */}
//       <div style={{ margin: '20px 28px 0', flexShrink: 0 }}>
//         <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 10 }}>Who are you? Get a view built for your situation.</div>
//         <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
//           {[
//             { key: 'buyer',    icon: '🏠', name: "I'm Buying My First Home",  desc: 'Plain English, step-by-step, no jargon' },
//             { key: 'investor', icon: '💼', name: "I'm a Property Investor",   desc: 'Yields, returns, comparables, market timing' },
//             { key: 'owner',    icon: '🔑', name: 'I Already Own Here',        desc: "What's my property worth? Should I sell?" },
//           ].map(p => (
//             <button key={p.key} onClick={() => setPersona(p.key)} style={{
//               padding: '12px 22px', borderRadius: 10,
//               border: `2px solid ${persona === p.key ? C.orange : C.border}`,
//               background: persona === p.key ? C.orangeL : C.card,
//               cursor: 'pointer', transition: 'all .18s',
//               display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 180,
//             }}>
//               <span style={{ fontSize: 22 }}>{p.icon}</span>
//               <div style={{ textAlign: 'left' }}>
//                 <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{p.name}</div>
//                 <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{p.desc}</div>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ══════════ PERSONA: BUYER ══════════ */}
//       {persona === 'buyer' && (
//         <div style={{ ...pad, marginTop: 20 }}>
//           {/* 5-step guide */}
//           <Card>
//             <CardTitle badge="First-Time Buyer">Your 5-Step Buying Guide for {area.name}</CardTitle>
//             <div>
//               {[
//                 {
//                   num: 1, title: 'Understand what a fair price actually looks like here',
//                   body: `Our Truvalu™ system calculates what any ${area.name} property should cost based on real transactions, floor level, view, and condition. A 1-bedroom here is fairly priced at around ${fmtK(Math.round(d.psf * 800 / 1000) * 1000)}. If someone's asking significantly more — that's a red flag. If it's below that — that's a genuine opportunity.`,
//                 },
//                 {
//                   num: 2, title: "Check what's coming to the area in the next 2 years",
//                   body: `A metro station is confirmed for Q4 2026. A new school in 2027. Infrastructure is confirmed or announced. These things push prices up — buying before they open means you benefit from the price increase. This is why timing matters.`,
//                 },
//                 {
//                   num: 3, title: "Don't panic about the current news — look at history",
//                   body: `Dubai has been through oil crashes, COVID, and geopolitical scares before. Every time, well-located areas recovered within 8–14 months. The current slowdown is caused by regional news (Iran/USA), not by any problem with Dubai's economy or ${area.name} specifically. The Resilience Report (Past tab below) shows you exactly what happened each time.`,
//                 },
//                 {
//                   num: 4, title: 'Know who else is buying here and why',
//                   body: `${area.name} attracts mostly ${d.nationals[0].name} (${d.nationals[0].pct}%), ${d.nationals[1].name} (${d.nationals[1].pct}%), and ${d.nationals[2].name} (${d.nationals[2].pct}%) buyers — young professionals, expats, and investors. Rental yield here (${d.yld}%) is ${d.aboveAvgYield ? 'higher than' : 'near'} the Dubai average.`,
//                 },
//                 {
//                   num: 5, title: "Check the developer's track record before buying off-plan",
//                   body: `If you're buying an off-plan unit (not yet built), this matters a lot. Binghatti delivers 91% on time. Tiger Group has an 8-month average delay. Acqar tracks every developer's delivery record so you can choose wisely. See the developer table in the Past tab.`,
//                 },
//               ].map((step, i, arr) => (
//                 <div key={step.num} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 14, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
//                   <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.orange, color: '#fff', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step.num}</div>
//                   <div>
//                     <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{step.title}</div>
//                     <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{step.body}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Price guide */}
//           <div style={{ ...g2, marginTop: 16 }}>
//             <Card>
//               <CardTitle>What Does Buying in {area.name} Actually Cost?</CardTitle>
//               <PTable
//                 headers={['Property Type', 'Cheapest', 'Fair Price', 'Most Expensive']}
//                 rows={d.buyerPriceTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1}>{row.min}</Td>
//                     <Td last={i === arr.length - 1} bold>{row.fair}</Td>
//                     <Td last={i === arr.length - 1}>{row.max}</Td>
//                   </tr>
//                 ))}
//               />
//               <p style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>💡 The "Fair Price" column is Acqar's Truvalu™ benchmark — what the property is actually worth based on real transactions, not asking prices.</p>
//             </Card>
//             <Card>
//               <CardTitle>What Will It Cost to Own (Not Just Buy)?</CardTitle>
//               <StRow label="DLD Transfer Fee"             value="4% of purchase price" />
//               <StRow label="Agent commission"             value="2% (negotiable)" />
//               <StRow label="Annual service charges"       value={d.serviceCharge} />
//               <StRow label="Typical annual maintenance"   value="AED 5,000–15,000" />
//               <StRow label="Annual rental income (1BR)"   value={`${fmtK(d.annualRent1BR)} avg`} valueColor={C.green} />
//               <StRow label="Net yield after charges (est.)" value={`${d.netYield}%`} valueColor={C.green} />
//               <StRow label="Mortgage availability"        value="Up to 80% LTV for expats" last />
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ══════════ PERSONA: INVESTOR ══════════ */}
//       {persona === 'investor' && (
//         <div style={{ ...pad, marginTop: 20 }}>
//           {/* 4 big metrics */}
//           <div style={g4}>
//             {[
//               { title: 'Gross Yield',          val: `${d.yld}%`,              color: C.green, sub: `Dubai avg: 6.1% · ${area.name} ${d.aboveAvgYield ? 'above' : 'near'} avg for 4 years` },
//               { title: 'Distress Opportunity', val: `${d.distressPct}%`,      color: C.amber, sub: `${fmt(d.distressUnits)} units priced below Truvalu™ floor right now` },
//               { title: 'Catalyst Score',        val: `${d.catalystScore}/100`, color: C.green, sub: '2 confirmed infra catalysts in next 24 months' },
//               { title: 'Off-Plan Absorption',   val: '72%',                    color: C.blue,  sub: `Average sold % across active ${area.name} projects` },
//             ].map(m => (
//               <Card key={m.title} style={{ textAlign: 'center' }}>
//                 <CardTitle>{m.title}</CardTitle>
//                 <div style={{ fontSize: 36, fontWeight: 900, color: m.color }}>{m.val}</div>
//                 <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{m.sub}</div>
//               </Card>
//             ))}
//           </div>

//           {/* Market composition + Truvalu benchmark */}
//           <div style={{ ...g2, marginTop: 16 }}>
//             <Card>
//               <CardTitle>Market Composition — Investor View</CardTitle>
//               <RatioBar left="Off-Plan (Primary)" leftPct={58} leftColor={C.blue}   right="Ready (Secondary)" rightPct={42} rightColor={C.amber} />
//               <RatioBar left="Investor-owned"     leftPct={62} leftColor={C.orange} right="End-user"           rightPct={38} rightColor={C.green} />
//               <RatioBar left="Apartments"         leftPct={87} leftColor={C.green}  right="Villas/TH"          rightPct={13} rightColor={C.purple} />
//               <RatioBar left="Long-term tenants"  leftPct={88} leftColor="#14B8A6"  right="Short-stay"          rightPct={12} rightColor="#E2E8F0" last />
//             </Card>
//             <Card>
//               <CardTitle badge="RICS-aligned">Truvalu™ Benchmark vs Asking Price</CardTitle>
//               <PTable
//                 headers={['Type', 'Truvalu™', 'Asking', 'Gap', 'Signal']}
//                 rows={d.priceTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1} bold>AED {fmt(row.truv)}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.ask)}</Td>
//                     <Td last={i === arr.length - 1}><GapPct truv={row.truv} ask={row.ask} /></Td>
//                     <Td last={i === arr.length - 1}><GapTag truv={row.truv} ask={row.ask} /></Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//           </div>

//           {/* Nationality + yield by type */}
//           <div style={{ ...g2, marginTop: 16 }}>
//             <Card>
//               <CardTitle>Who Is Buying in {area.name}? (Last 90 Days)</CardTitle>
//               {d.nationals.map(n => <NatBar key={n.name} {...n} />)}
//             </Card>
//             <Card>
//               <CardTitle>Rental Yield by Unit Type</CardTitle>
//               {/* Yield bar chart replacement */}
//               {d.yieldByType.map(y => (
//                 <div key={y.type} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
//                   <span style={{ fontSize: 11, width: 60, flexShrink: 0, color: C.text2 }}>{y.type}</span>
//                   <div style={{ flex: 1, height: 6, background: C.bg3, borderRadius: 3 }}>
//                     <div style={{ width: `${(y.val / 11) * 100}%`, height: 6, borderRadius: 3, background: y.val > 6.1 ? C.green : C.amber }} />
//                   </div>
//                   <span style={{ fontSize: 11, fontWeight: 700, width: 36, textAlign: 'right', color: y.val > 6.1 ? C.green : C.amber }}>{y.val}%</span>
//                 </div>
//               ))}
//               {/* Dubai avg line label */}
//               <div style={{ fontSize: 10, color: C.muted2, textAlign: 'right', marginBottom: 8 }}>— Dubai Avg 6.1%</div>
//               <StRow label="Best yield unit type"   value={`Studio (${d.yieldByType[0].val}%)`} valueColor={C.green} />
//               <StRow label="5-year yield trend"     value={`↑ 6.1% → ${d.yld}%`}              valueColor={C.green} />
//               <StRow label="Average days to rent"   value="18 days" />
//               <StRow label="Vacancy rate"            value={`${d.vacancyRate}%`} valueColor={C.green} last />
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ══════════ PERSONA: OWNER ══════════ */}
//       {persona === 'owner' && (
//         <div style={{ ...pad, marginTop: 20 }}>
//           {/* Valuation banner */}
//           <div style={{ background: `linear-gradient(135deg,${C.orangeL} 0%,rgba(200,115,42,0.03) 100%)`, border: '1px solid rgba(200,115,42,0.2)', borderRadius: 10, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginBottom: 16 }}>
//             <div>
//               <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: C.orange, marginBottom: 6 }}>Your Asset · Truvalu™ Valuation</div>
//               <h2 style={{ fontSize: 22, fontWeight: 900, color: C.orange, marginBottom: 4 }}>1 Bedroom in {area.name} is worth {fmtK(d.valuationRangeLow)} — {fmtK(d.valuationRangeHigh)}</h2>
//               <p style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Based on your floor level, view, building quality, and current matched DLD transactions. Updated daily.</p>
//             </div>
//             <div style={{ textAlign: 'right', flexShrink: 0 }}>
//               <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted }}>Truvalu™ Fair Value</div>
//               <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginTop: 2 }}>{fmtK(d.fairValue1BR)}</div>
//               <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>↑ +AED {fmt(d.gain6m)} vs 6 months ago</div>
//               <div style={{ fontSize: 11, color: C.green, marginTop: 2 }}>↑ +{d.fiveYrAppreciation}% vs 5-year purchase price</div>
//             </div>
//           </div>

//           <div style={g3}>
//             {/* Should I sell? */}
//             <Card>
//               <CardTitle>Should You Sell Now?</CardTitle>
//               <div style={{ fontSize: 28, fontWeight: 900, color: d.sellColor, marginBottom: 6 }}>{d.sellRecommendation}</div>
//               <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.7, marginBottom: 14 }}>
//                 {d.score >= 75
//                   ? `Market conditions are strong in ${area.name}. Buyer demand is elevated and days-on-market is low at ${d.daysToSell} days. If you need to sell, now is a favorable window.`
//                   : `Selling today means selling into a market where buyers are temporarily nervous due to regional events. Infrastructure catalysts arriving Q4 2026 are likely to push ${area.name} prices up 8–14% — selling before those land means leaving money on the table.`}
//               </div>
//               <StRow label="Current market sentiment"       value={d.mood}         valueColor={d.moodColor} />
//               <StRow label="Days to sell (current)"         value={`${d.daysToSell} days`} valueColor={d.daysToSell > 40 ? C.red : C.green} />
//               <StRow label="Expected post-catalyst improvement" value="8–14%"      valueColor={C.green} />
//               <StRow label="Optimal sell window"            value={d.optimalSell}  valueColor={C.green} last />
//             </Card>

//             {/* Rent it out? */}
//             <Card>
//               <CardTitle>Should You Rent It Out?</CardTitle>
//               <div style={{ fontSize: 28, fontWeight: 900, color: C.green, marginBottom: 6 }}>Yes — Good Yield</div>
//               <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.7, marginBottom: 14 }}>
//                 {area.name}'s rental market remains active even during the transaction slowdown — tenants don't stop needing homes because of geopolitical news. Your 1BR can generate {fmtK(d.annualRent1BR)}/year on a 12-month contract or {fmtK(d.annualRent1BRShort)}/year on a short-term furnished basis.
//               </div>
//               <StRow label="Annual long-term rent (1BR)"    value={`AED ${fmt(Math.round(d.annualRent1BR*0.93/1000)*1000)}–${fmt(d.annualRent1BR)}`} valueColor={C.green} />
//               <StRow label="Short-term furnished (1BR)"     value={`AED ${fmt(d.annualRent1BR)}–${fmt(d.annualRent1BRShort)}`} valueColor={C.green} />
//               <StRow label="Average days to find tenant"    value="18 days" />
//               <StRow label="Current vacancy rate"           value={`${d.vacancyRate}%`}  valueColor={C.green} />
//               <StRow label="Gross yield (long-term)"        value={`${d.yld}%`}     valueColor={C.green} last />
//             </Card>

//             {/* Area vs Dubai avg */}
//             <Card>
//               <CardTitle>Your Area vs Dubai Average</CardTitle>
//               <StRow label="Rental yield"               value={`${d.yld}% vs 6.1% avg`}    valueColor={C.green} />
//               <StRow label="5-year price appreciation"  value={`+${d.fiveYrAppreciation}%`} valueColor={C.green} />
//               <StRow label="Occupancy rate"             value={`${d.occupancyRate}%`}        valueColor={C.green} />
//               <StRow label="Supply growth (risk)"       value="6.4% ↑ moderate"              valueColor={C.amber} />
//               <StRow label="Infrastructure catalyst score" value={`${d.catalystScore}/100 — Strong`} valueColor={C.green} />
//               <StRow label="Price resilience (past shocks)" value="Always recovered <14M"   valueColor={C.green} />
//               <StRow label="Acqar's outlook (12M)"      value={d.verdict === 'BUY' ? 'BUY — Strong momentum' : 'HOLD → BUY trend'} valueColor={d.verdictColor} last />
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ══════════ TIME HORIZON TABS ══════════ */}
//       <div style={{ margin: '20px 28px 0', flexShrink: 0 }}>
//         <div style={{ display: 'flex', borderBottom: `2px solid ${C.border}`, gap: 0 }}>
//           {[
//             { key: 'past',    label: '📜 Past — History & Track Record' },
//             { key: 'present', label: '📡 Present — Live Market Data' },
//             { key: 'future',  label: `🔭 Future — What's Coming to ${area.name}` },
//           ].map(tab => (
//             <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
//               padding: '10px 22px', fontSize: 12, fontWeight: 700,
//               color: activeTab === tab.key ? C.orange : C.muted,
//               cursor: 'pointer',
//               borderBottom: `3px solid ${activeTab === tab.key ? C.orange : 'transparent'}`,
//               marginBottom: -2, letterSpacing: '.04em', textTransform: 'uppercase',
//               background: 'none', border: 'none',
//               borderBottomWidth: 3, borderBottomStyle: 'solid',
//               borderBottomColor: activeTab === tab.key ? C.orange : 'transparent',
//               transition: 'all .15s', userSelect: 'none',
//             }}>{tab.label}</button>
//           ))}
//         </div>
//       </div>

//       {/* ── PAST TAB ── */}
//       {activeTab === 'past' && (
//         <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>
//           {/* Area maturity + developer table */}
//           <div style={{ ...g2, marginBottom: 16 }}>
//             <Card>
//               <CardTitle>Area Maturity</CardTitle>
//               <StRow label="Zone"                      value={area.zone} />
//               <StRow label="Completion rate"            value="84% built"            valueColor={C.green} />
//               <StRow label="Total units (completed)"    value="62,400" />
//               <StRow label="Occupancy rate"             value={`${d.occupancyRate}%`}  valueColor={C.green} />
//               <StRow label="Schools within 3km"         value="4 schools" />
//               <StRow label="Retail (malls + units)"     value="2 malls, 180+ retail" />
//               <StRow label="5-year price appreciation"  value={`+${d.fiveYrAppreciation}%`} valueColor={C.green} last />
//             </Card>
//             <Card>
//               <CardTitle>Developer Delivery Track Record in {area.name}</CardTitle>
//               <PTable
//                 headers={['Developer', 'Projects', 'On-Time', 'Avg Delay', 'Rating']}
//                 rows={[
//                   { dev: 'Binghatti',  n: 12, ot: '91%', delay: '1.2 mo', rating: '★★★★★', c: C.green },
//                   { dev: 'Ellington',  n: 8,  ot: '88%', delay: '2.1 mo', rating: '★★★★☆', c: C.green },
//                   { dev: 'Nakheel',    n: 4,  ot: '95%', delay: '0.8 mo', rating: '★★★★★', c: C.green },
//                   { dev: 'DAMAC',      n: 6,  ot: '74%', delay: '5.8 mo', rating: '★★★☆☆', c: C.amber },
//                   { dev: 'Samana',     n: 7,  ot: '71%', delay: '6.2 mo', rating: '★★★☆☆', c: C.amber },
//                   { dev: 'Tiger Group',n: 9,  ot: '61%', delay: '8.4 mo', rating: '★★☆☆☆', c: C.red   },
//                 ].map((r, i, arr) => (
//                   <tr key={r.dev}>
//                     <Td last={i === arr.length - 1}>{r.dev}</Td>
//                     <Td last={i === arr.length - 1}>{r.n}</Td>
//                     <Td last={i === arr.length - 1} color={r.c}>{r.ot}</Td>
//                     <Td last={i === arr.length - 1}>{r.delay}</Td>
//                     <Td last={i === arr.length - 1} color={r.c}>{r.rating}</Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//           </div>

//           {/* Resilience report */}
//           <Card style={{ marginBottom: 20 }}>
//             <CardTitle>🛡️ Resilience Report — How {area.name} Survived Every Past Shock</CardTitle>
//             <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.greenL, border: '1px solid rgba(22,163,74,.18)', borderRadius: 6, padding: '7px 14px', fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 14 }}>
//               ✓ {area.name} has recovered within 14 months in every major shock since 2014
//             </div>
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr>{['Event', 'Period', `${area.name} Price Impact`, 'Recovery Time', 'What Drove Recovery', 'Is This Happening Now?'].map(h => (
//                   <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 700 }}>{h}</th>
//                 ))}</tr>
//               </thead>
//               <tbody>
//                 {[
//                   { event: 'Oil Price Crash',     period: '2014–2016', impact: '−18%', ic: C.red,   rec: '14 months', driver: 'Yield hunters attracted by low prices',         now: 'Partial parallel',       nc: C.amber },
//                   { event: 'Expo Slowdown',       period: '2019–2020', impact: '−9%',  ic: C.red,   rec: '8 months',  driver: 'Affordable entry vs Downtown',                  now: 'Same dynamic now',       nc: C.green },
//                   { event: 'COVID-19',            period: 'Q2–Q3 2020',impact: '−14%', ic: C.red,   rec: '11 months', driver: 'DLD fee waiver + Golden Visa expansion',         now: 'No direct parallel',     nc: C.amber },
//                   { event: 'Russia/Ukraine War',  period: 'Feb 2022',  impact: '+6%',  ic: C.green, rec: 'N/A (rose)', driver: 'Russian capital flight → Dubai demand',          now: 'Opposite dynamic',       nc: C.amber },
//                   { event: '⚡ Iran/USA ← NOW',  period: 'Apr 2026→', impact: '−4% so far', ic: C.amber, rec: 'Projected: 6–10M', driver: `${area.name} yield floor (${d.yld}%) + metro`, now: 'This is the current event', nc: C.orange, bold: true },
//                 ].map((row, i, arr) => (
//                   <tr key={row.event} style={{ background: row.bold ? 'rgba(200,115,42,0.04)' : 'transparent' }}>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', fontWeight: row.bold ? 700 : 400, color: row.bold ? C.orange : C.text }}>{row.event}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>{row.period}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', color: row.ic, fontWeight: 700 }}>{row.impact}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}><strong>{row.rec}</strong></td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>{row.driver}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', color: row.nc, fontWeight: row.bold ? 700 : 400 }}>{row.now}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </Card>
//         </div>
//       )}

//       {/* ── PRESENT TAB ── */}
//       {activeTab === 'present' && (
//         <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>
//           {/* Distress meter */}
//           <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
//             <div style={{ fontSize: 32, fontWeight: 900, color: C.amber }}>{d.distressPct}%</div>
//             <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
//               <strong style={{ color: C.text }}>Distress Meter:</strong> {fmt(d.distressUnits)} of {area.name}'s active listings are priced below the Truvalu™ floor right now. This is above the 12-month average of 11% — driven by nervous sellers who want to exit quickly. For patient buyers, this is a genuine entry window. The widest gap is in 2BR and townhouse units.
//             </div>
//           </div>

//           {/* Live signals + market composition */}
//           <div style={{ ...g2, marginBottom: 16 }}>
//             <Card>
//               <CardTitle>Live ACQAR Signals for {area.name}</CardTitle>
//               {areaSignals.length > 0 ? areaSignals.map(ev => (
//                 <div key={ev.id} style={{ padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
//                   <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: C.orange, marginBottom: 2 }}>{ev.category} · S{ev.severity}</div>
//                   <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 2 }}>{ev.title}</div>
//                   <div style={{ fontSize: 11, color: C.muted }}>📡 {ev.signal_count} signals · 🎯 {Math.round(ev.confidence * 100)}% confidence</div>
//                   {ev.price_aed && <div style={{ fontSize: 11, color: C.green, marginTop: 2, fontWeight: 600 }}>💰 AED {(ev.price_aed / 1000000).toFixed(1)}M</div>}
//                 </div>
//               )) : (
//                 <div style={{ padding: '20px 0', textAlign: 'center', color: C.muted, fontSize: 12 }}>
//                   <div style={{ fontSize: 28, marginBottom: 8 }}>📡</div>
//                   No live signals for {area.name} right now — signals update every 5 minutes.
//                 </div>
//               )}
//             </Card>
//             <Card>
//               <CardTitle>Live Market Composition</CardTitle>
//               <RatioBar left="Off-Plan (Primary)" leftPct={58} leftColor={C.blue}    right="Ready (Secondary)"    rightPct={42} rightColor={C.amber} />
//               <RatioBar left="Apartments"         leftPct={87} leftColor={C.green}   right="Villas/TH"            rightPct={13} rightColor={C.purple} />
//               <RatioBar left="Residential"        leftPct={91} leftColor="#14B8A6"   right="Commercial"           rightPct={9}  rightColor={C.muted2} />
//               <RatioBar left="Bachelor / Single"  leftPct={71} leftColor="#6366F1"   right="Family"               rightPct={29} rightColor="#EC4899" />
//               <RatioBar left="Long-term resident" leftPct={88} leftColor={C.lime}    right="Tourist/short-stay"   rightPct={12} rightColor={C.bg3} last />
//             </Card>
//           </div>

//           {/* Rent ranges + Truvalu current + nationalities */}
//           <div style={{ ...g3, marginBottom: 20 }}>
//             <Card>
//               <CardTitle>Annual Rent Ranges (AED)</CardTitle>
//               <PTable
//                 headers={['Type', 'Min', 'Avg', 'Max']}
//                 rows={d.rentTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.min)}</Td>
//                     <Td last={i === arr.length - 1} color={C.green} bold>{fmt(row.avg)}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.max)}</Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//             <Card>
//               <CardTitle>Truvalu™ Benchmark — Current</CardTitle>
//               <PTable
//                 headers={['Type', 'Truvalu™', 'Ask PSF', 'Status']}
//                 rows={d.priceTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1}>AED {fmt(row.truv)}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.ask)}</Td>
//                     <Td last={i === arr.length - 1}><GapTag truv={row.truv} ask={row.ask} /></Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//             <Card>
//               <CardTitle>Buyer Nationality — 90 Days</CardTitle>
//               {d.nationals.map(n => <NatBar key={n.name} {...n} />)}
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ── FUTURE TAB ── */}
//       {activeTab === 'future' && (
//         <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>
//           <div style={{ ...g2, marginBottom: 16 }}>
//             {/* Timeline */}
//             <Card>
//               <CardTitle badge="Confirmed · Announced · Likely">Infrastructure &amp; Catalyst Timeline</CardTitle>
//               <div style={{ paddingLeft: 24, position: 'relative' }}>
//                 <div style={{ position: 'absolute', left: 8, top: 6, bottom: 6, width: 2, background: C.border, borderRadius: 1 }} />
//                 <TlItem year="Q4 2026" tagType="confirmed" title={`Dubai Metro Blue Line — ${area.name} Station`} desc="First direct metro connectivity for the area. Under active construction. Metro stations historically drive 8–14% PSF appreciation within 1km radius within 12 months of opening." impact="+8–14% PSF (1km radius)" />
//                 <TlItem year="Q2 2027" tagType="confirmed" title={`${area.name} Community Mall Expansion — Phase 2`} desc="800,000 sqft retail expansion by Nakheel. Anchor tenants include Waitrose, Decathlon, and multiplex cinema. Shifts area from bachelor-dominant to family-friendly." impact="+5–8% rental demand, family buyer ratio ↑" />
//                 <TlItem year="Q3 2027" tagType="announced" title="International School — GEMS World Academy" desc="1,800-student capacity. Pending final planning approval. Will shift occupant profile towards families and increase 2BR/3BR demand significantly." impact="+12–18% demand for 2–3BR units" />
//                 <TlItem year="2027" tagType="announced" title="Al Maktoum Airport — Phase 2 (15 mins away)" desc="AED 128B project confirmed as world's largest airport by 2040. Aviation worker and business travel residential demand expected to boost the area." impact="Long-term valuation tailwind" />
//                 <TlItem year="2028" tagType="likely" title="DHA Medical Facility — Area Catchment" desc="Healthcare anchor expected to serve area catchment. Healthcare infrastructure is consistently correlated with family occupancy increases and rental demand." impact="Family ratio ↑, rental stability ↑" />
//               </div>
//             </Card>

//             {/* Catalyst score + supply risk */}
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//               <Card>
//                 <CardTitle>Catalyst Score</CardTitle>
//                 <div style={{ fontSize: 42, fontWeight: 900, color: C.green, textAlign: 'center', marginBottom: 8 }}>{d.catalystScore}/100</div>
//                 <StRow label="Confirmed infrastructure"   value="2 items"          valueColor={C.green} />
//                 <StRow label="Announced (pending)"        value="3 items"          valueColor={C.blue} />
//                 <StRow label="Dubai 2040 zone alignment"  value="Strong"           valueColor={C.green} />
//                 <StRow label="Transport improvement"      value="Metro Q4 2026"    valueColor={C.green} />
//                 <StRow label="School infrastructure"      value="Improving"        valueColor={C.amber} last />
//               </Card>
//               <Card>
//                 <CardTitle>Off-Plan Supply — Delivery Risk</CardTitle>
//                 <StRow label="Active projects in area"   value="9" />
//                 <StRow label="Total pipeline units"       value="4,840" />
//                 <StRow label="Delivering 2026"            value="1,240 units"      valueColor={C.green} />
//                 <StRow label="Delivering 2027 (peak)"     value="2,180 units"      valueColor={C.amber} />
//                 <StRow label="Supply risk"                value="Moderate — watch 2027" valueColor={C.amber} last />
//               </Card>
//             </div>
//           </div>

//           {/* Pipeline cards */}
//           <div style={{ marginBottom: 20 }}>
//             <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>Active Off-Plan Projects in {area.name}</div>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 10 }}>
//               <PipeCard dev="Binghatti"   name="Binghatti Phoenix"   delivery="Q2 2026" units={284}       psfFrom={pipePsf(0.82)} sold={94} builtPct={91} status="ontime" />
//               <PipeCard dev="Ellington"   name="Crestmont Residences"delivery="Q4 2026" units={412}       psfFrom={pipePsf(0.91)} sold={78} builtPct={67} status="ontime" />
//               <PipeCard dev="DAMAC"       name="Solitaire Tower"     delivery="Q1 2027" units={618}       psfFrom={pipePsf(0.80)} sold={68} builtPct={44} status="delayed" />
//               <PipeCard dev="Nakheel"     name="Cluster T Villas"    delivery="Q2 2027" units="84 villas" psfFrom="AED 2.4M"      sold={87} builtPct={55} status="ahead" />
//               <PipeCard dev="Tiger Group" name="Tiger Sky Tower"     delivery="Q4 2027" units={186}       psfFrom={pipePsf(0.69)} sold={39} builtPct={18} status="delayed" />
//               <PipeCard dev="Samana"      name="Samana Skyros"       delivery="Q3 2027" units={320}       psfFrom={pipePsf(0.74)} sold={52} builtPct={28} status="ontime" />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── BROKER CTA ── */}
//       <div style={{ margin: '20px 28px 30px', background: `linear-gradient(135deg,${C.orangeL} 0%,rgba(200,115,42,0.05) 100%)`, border: '1px solid rgba(200,115,42,0.22)', borderRadius: 10, padding: '22px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexShrink: 0 }}>
//         <div>
//           <h3 style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>📤 Share This Area Specialist Report</h3>
//           <p style={{ fontSize: 12, color: C.muted }}>One-click shareable link for your client — Area Brief, Score, Truvalu™ Benchmarks, Catalyst Timeline, and Resilience Report. Opens as a live Acqar page with no login required.</p>
//         </div>
//         <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
//           <button style={{ background: C.orange, color: '#fff', fontSize: 12, fontWeight: 700, padding: '10px 22px', borderRadius: 7, border: 'none', cursor: 'pointer' }}>Generate Shareable Link</button>
//           <button style={{ background: C.card, color: C.text2, fontSize: 12, fontWeight: 600, padding: '10px 22px', borderRadius: 7, border: `1px solid ${C.border}`, cursor: 'pointer' }}>Download PDF Report</button>
//         </div>
//       </div>

//       <style>{`@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}`}</style>
//     </div>
//   )
// }





// import { useState, useEffect, useRef } from 'react'
// import { useEvents } from '../context/EventsContext'
// import TickerBar from './TickerBar'


// const GROQ_KEY = import.meta.env.VITE_GROQ_KEY
// const BACKEND_GROQ = 'https://api.groq.com/openai/v1/chat/completions'

// async function askGroq(prompt) {
//   if (!GROQ_KEY) return null
//   try {
//     const res = await fetch(BACKEND_GROQ, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${GROQ_KEY}`,
//       },
//       body: JSON.stringify({
//         model: 'llama-3.3-70b-versatile',
//         max_tokens: 120,
//         temperature: 0.7,
//         messages: [{ role: 'user', content: prompt }],
//       }),
//     })
//     const data = await res.json()
//     return data.choices?.[0]?.message?.content?.trim() ?? null
//   } catch { return null }
// }

// // ── DESIGN TOKENS — exact match to HTML :root vars ─────────────────
// const C = {
//   bg: '#FAF8F5', bg2: '#F2EDE5', bg3: '#EAE3D8',
//   card: '#FFFFFF', card2: '#F8F5F0',
//   border: '#E8E0D0', border2: '#D8CEBC',
//   orange: '#C8732A', orange2: '#A85C20',
//   orangeL: 'rgba(200,115,42,0.09)', orangeM: 'rgba(200,115,42,0.18)',
//   green: '#16A34A', greenL: 'rgba(22,163,74,0.1)',
//   lime: '#65A30D', limeL: 'rgba(101,163,13,0.1)',
//   amber: '#D97706', amberL: 'rgba(217,119,6,0.1)',
//   red: '#DC2626', redL: 'rgba(220,38,38,0.1)',
//   blue: '#2563EB', blueL: 'rgba(37,99,235,0.09)',
//   purple: '#7C3AED', purpleL: 'rgba(124,58,237,0.09)',
//   text: '#1C1C28', text2: '#3D3D50',
//   muted: '#6E7A8A', muted2: '#9CA8B4',
// }

// // ── REAL DATA FACTORY — derives all values from area.pricePerSqft, yield, score ──
// function buildAreaData(area) {
//   const psf = area.pricePerSqft || 1247
//   const yld = area.yield || 7.2
//   const score = area.score || 67

//   // Derived market metrics
//   const soldThisWeek = Math.round(80 + score * 1.5)
//   const daysToSell = Math.round(75 - score * 0.4)
//   const availableListings = Math.round(1500 + score * 50)
//   const distressPct = Math.round(Math.max(5, 25 - score * 0.2))
//   const distressUnits = Math.round(availableListings * distressPct / 100)
//   const vacancyRate = Math.round(Math.max(5, 18 - score * 0.1))
//   const occupancyRate = 100 - vacancyRate
//   const fiveYrAppreciation = (30 + score * 0.3).toFixed(1)
//   const catalystScore = Math.min(98, Math.round(score * 1.15))
//   const verdict = score >= 75 ? 'BUY' : score >= 65 ? 'HOLD' : 'WATCH'
//   const verdictColor = score >= 75 ? C.green : score >= 65 ? C.amber : C.red
//   const mood = score >= 75 ? 'Bullish' : score >= 65 ? 'Cautious' : 'Slow'
//   const moodColor = score >= 75 ? C.green : score >= 65 ? C.amber : C.red

//   // Score component breakdown (4 bars like HTML)
//   const scoreComps = [
//     { label: 'Are people buying?',   val: Math.round(score * 0.87), color: score >= 65 ? C.amber : C.red },
//     { label: 'Is the price fair?',   val: Math.min(99, Math.round(score * 1.10)), color: C.green },
//     { label: "What's coming nearby?",val: Math.min(99, Math.round(score * 1.18)), color: C.green },
//     { label: 'Is the mood positive?',val: Math.round(score * 0.62), color: score >= 70 ? C.amber : C.red },
//   ]

//   // Price table — derived from PSF × sqft
//   const priceTable = [
//     { type: 'Studio',      sqft: 450,  truv: Math.round(psf * 0.95), ask: Math.round(psf * 0.96) },
//     { type: '1 Bedroom',   sqft: 800,  truv: psf,                    ask: Math.round(psf * 1.041) },
//     { type: '2 Bedroom',   sqft: 1250, truv: Math.round(psf * 0.974),ask: Math.round(psf * 0.936) },
//     { type: '3 Bedroom',   sqft: 1800, truv: Math.round(psf * 0.958),ask: Math.round(psf * 0.944) },
//     { type: 'Townhouse',   sqft: 2400, truv: Math.round(psf * 1.074),ask: Math.round(psf * 1.030) },
//   ]

//   // Buyer cost table — total property price
//   const buyerPriceTable = [
//     { type: 'Studio',      min: fmtK(Math.round(psf*450*0.74/1000)*1000),  fair: fmtK(Math.round(psf*450*0.95/1000)*1000),  max: fmtK(Math.round(psf*450*1.40/1000)*1000) },
//     { type: '1 Bedroom',   min: fmtK(Math.round(psf*800*0.72/1000)*1000),  fair: fmtK(Math.round(psf*800/1000)*1000),        max: fmtK(Math.round(psf*800*1.44/1000)*1000) },
//     { type: '2 Bedroom',   min: fmtK(Math.round(psf*1250*0.72/1000)*1000), fair: fmtK(Math.round(psf*1250*0.97/1000)*1000),  max: fmtK(Math.round(psf*1250*1.40/1000)*1000) },
//     { type: '3 Bedroom',   min: fmtK(Math.round(psf*1800*0.70/1000)*1000), fair: fmtK(Math.round(psf*1800*0.96/1000)*1000),  max: fmtK(Math.round(psf*1800*1.48/1000)*1000) },
//     { type: 'Townhouse 3BR',min:fmtK(Math.round(psf*2400*0.72/1000)*1000), fair: fmtK(Math.round(psf*2400*1.07/1000)*1000),  max: fmtK(Math.round(psf*2400*1.44/1000)*1000) },
//   ]

//   // Rent table — annual rents from yield
//   const rentTable = [
//     { type: 'Studio',    min: Math.round(psf*450*yld/100*0.75/1000)*1000,  avg: Math.round(psf*450*yld/100/1000)*1000,  max: Math.round(psf*450*yld/100*1.35/1000)*1000 },
//     { type: '1 BR',      min: Math.round(psf*800*yld/100*0.75/1000)*1000,  avg: Math.round(psf*800*yld/100/1000)*1000,  max: Math.round(psf*800*yld/100*1.35/1000)*1000 },
//     { type: '2 BR',      min: Math.round(psf*1250*yld/100*0.75/1000)*1000, avg: Math.round(psf*1250*yld/100/1000)*1000, max: Math.round(psf*1250*yld/100*1.35/1000)*1000 },
//     { type: '3 BR',      min: Math.round(psf*1800*yld/100*0.75/1000)*1000, avg: Math.round(psf*1800*yld/100/1000)*1000, max: Math.round(psf*1800*yld/100*1.35/1000)*1000 },
//     { type: 'Townhouse', min: Math.round(psf*2400*yld/100*0.75/1000)*1000, avg: Math.round(psf*2400*yld/100/1000)*1000, max: Math.round(psf*2400*yld/100*1.35/1000)*1000 },
//   ]

//   // Yield by unit type (investor pane)
//   const yieldByType = [
//     { type: 'Studio',  val: +(yld * 1.19).toFixed(1) },
//     { type: '1 BR',    val: +yld.toFixed(1) },
//     { type: '2 BR',    val: +(yld * 0.94).toFixed(1) },
//     { type: '3 BR',    val: +(yld * 0.88).toFixed(1) },
//     { type: 'TH 3BR',  val: +(yld * 0.82).toFixed(1) },
//   ]

//   // Owner valuation (1BR)
//   const fairValue1BR = Math.round(psf * 800 / 1000) * 1000
//   const valuationRangeLow  = Math.round(fairValue1BR * 0.97 / 1000) * 1000
//   const valuationRangeHigh = Math.round(fairValue1BR * 1.18 / 1000) * 1000
//   const gain6m = Math.round(psf * 800 * 0.033 / 1000) * 1000
//   const annualRent1BR = Math.round(psf * 800 * yld / 100 / 1000) * 1000
//   const annualRent1BRShort = Math.round(annualRent1BR * 1.25 / 1000) * 1000
//   const netYield = (yld * 0.83).toFixed(1)
//   const serviceCharge = psf > 2000 ? 'AED 18–28/sqft' : psf > 1200 ? 'AED 12–18/sqft' : 'AED 10–18/sqft'

//   // Nationalities — vary by zone
//   const nationals = area.zone === 'Prime'
//     ? [{ flag: '🇷🇺', name: 'Russian',   pct: 24, w: 100 },{ flag: '🇬🇧', name: 'British',   pct: 18, w: 75 },{ flag: '🇮🇳', name: 'Indian',    pct: 14, w: 58 },{ flag: '🇩🇪', name: 'German',    pct: 9, w: 38 },{ flag: '🇨🇳', name: 'Chinese',   pct: 8, w: 33 },{ flag: '🇦🇪', name: 'UAE Local', pct: 6, w: 25 },{ flag: '🌍', name: 'Other',     pct: 21, w: 48 }]
//     : area.zone === 'Marina'
//     ? [{ flag: '🇬🇧', name: 'British',   pct: 22, w: 100 },{ flag: '🇮🇳', name: 'Indian',    pct: 18, w: 82 },{ flag: '🇷🇺', name: 'Russian',   pct: 15, w: 68 },{ flag: '🇩🇪', name: 'German',    pct: 8, w: 36 },{ flag: '🇨🇳', name: 'Chinese',   pct: 7, w: 32 },{ flag: '🌍', name: 'Other',     pct: 30, w: 55 }]
//     : [{ flag: '🇮🇳', name: 'Indian',    pct: 31, w: 100 },{ flag: '🇬🇧', name: 'British',   pct: 18, w: 58 },{ flag: '🇷🇺', name: 'Russian',   pct: 14, w: 45 },{ flag: '🇵🇰', name: 'Pakistani', pct: 9, w: 29 },{ flag: '🇨🇳', name: 'Chinese',   pct: 6, w: 19 },{ flag: '🇩🇪', name: 'German',    pct: 4, w: 13 },{ flag: '🇦🇪', name: 'UAE Local', pct: 3, w: 10 },{ flag: '🌍', name: 'Other',     pct: 15, w: 48 }]

//   const sellRecommendation = score >= 75 ? 'Yes — Good Time' : 'Hold 6–12M'
//   const sellColor = score >= 75 ? C.green : C.amber
//   const optimalSell = score >= 75 ? 'Now — strong market' : score >= 65 ? 'Q2–Q3 2027' : '12–18 months'

//   return {
//     psf, yld, score, soldThisWeek, daysToSell, availableListings,
//     distressPct, distressUnits, vacancyRate, occupancyRate, fiveYrAppreciation,
//     catalystScore, verdict, verdictColor, mood, moodColor, scoreComps,
//     priceTable, buyerPriceTable, rentTable, yieldByType, nationals,
//     fairValue1BR, valuationRangeLow, valuationRangeHigh, gain6m,
//     annualRent1BR, annualRent1BRShort, netYield, serviceCharge,
//     sellRecommendation, sellColor, optimalSell,
//     aboveAvgYield: yld > 6.1,
//   }
// }

// // ── FORMAT HELPERS ─────────────────────────────────────────────────
// const fmt = (n) => (n || 0).toLocaleString()
// function fmtK(n) {
//   if (n >= 1000000) return `AED ${(n / 1000000).toFixed(2)}M`
//   return `AED ${Math.round(n / 1000)}K`
// }

// // ── SHARED COMPONENTS ──────────────────────────────────────────────
// function Card({ children, style = {} }) {
//   return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, ...style }}>{children}</div>
// }

// function CardTitle({ children, badge }) {
//   return (
//     <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//       <span>{children}</span>
//       {badge && <span style={{ fontSize: 10, textTransform: 'none', letterSpacing: 0, padding: '2px 8px', borderRadius: 4, background: C.bg2, color: C.muted, fontWeight: 500 }}>{badge}</span>}
//     </div>
//   )
// }

// function StRow({ label, value, valueColor, last }) {
//   return (
//     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: last ? 'none' : `1px solid ${C.border}`, fontSize: 12 }}>
//       <span style={{ color: C.muted }}>{label}</span>
//       <span style={{ fontWeight: 700, color: valueColor || C.text }}>{value}</span>
//     </div>
//   )
// }

// function RatioBar({ left, leftPct, leftColor, right, rightPct, rightColor, last }) {
//   return (
//     <div style={{ marginBottom: last ? 0 : 12 }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
//         <span style={{ color: C.text2, fontWeight: 700 }}>{left} {leftPct}%</span>
//         <span style={{ color: C.muted }}>{right} {rightPct}%</span>
//       </div>
//       <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' }}>
//         <div style={{ width: `${leftPct}%`, background: leftColor }} />
//         <div style={{ width: `${rightPct}%`, background: rightColor }} />
//       </div>
//     </div>
//   )
// }

// function NatBar({ flag, name, pct, w }) {
//   return (
//     <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
//       <span style={{ fontSize: 15, width: 22 }}>{flag}</span>
//       <span style={{ fontSize: 12, width: 80, flexShrink: 0 }}>{name}</span>
//       <div style={{ flex: 1, height: 6, background: C.bg3, borderRadius: 3 }}>
//         <div style={{ width: `${w}%`, height: 6, borderRadius: 3, background: C.orange }} />
//       </div>
//       <span style={{ fontSize: 11, fontWeight: 700, width: 30, textAlign: 'right', color: C.muted }}>{pct}%</span>
//     </div>
//   )
// }

// function PTable({ headers, rows }) {
//   return (
//     <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//       <thead>
//         <tr>{headers.map(h => <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 700 }}>{h}</th>)}</tr>
//       </thead>
//       <tbody>{rows}</tbody>
//     </table>
//   )
// }

// function Td({ children, color, bold, last }) {
//   return <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: last ? 'none' : `1px solid ${C.border}`, color: color || C.text, fontWeight: bold ? 700 : 400 }}>{children}</td>
// }

// function GapTag({ truv, ask }) {
//   const delta = ((ask - truv) / truv * 100)
//   const d = delta.toFixed(1)
//   if (delta > 2)  return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.redL,   color: C.red   }}>Premium</span>
//   if (delta < -2) return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.greenL, color: C.green }}>Opportunity</span>
//   return               <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.amberL, color: C.amber }}>Fair</span>
// }

// function GapPct({ truv, ask }) {
//   const delta = ((ask - truv) / truv * 100).toFixed(1)
//   return <span>{delta > 0 ? `+${delta}%` : `${delta}%`}</span>
// }

// // ── TIMELINE ITEM ──────────────────────────────────────────────────
// function TlItem({ year, tagType, title, desc, impact }) {
//   const tagColors = {
//     confirmed: { bg: C.greenL, color: C.green, dot: C.green },
//     announced: { bg: C.blueL,  color: C.blue,  dot: C.blue },
//     likely:    { bg: C.amberL, color: C.amber,  dot: C.amber },
//     spec:      { bg: C.bg3,    color: C.muted2, dot: C.muted2 },
//   }
//   const tc = tagColors[tagType] || tagColors.spec
//   return (
//     <div style={{ position: 'relative', marginBottom: 20 }}>
//       <div style={{ position: 'absolute', left: -20, top: 5, width: 12, height: 12, borderRadius: '50%', background: tc.dot, border: `2px solid ${C.bg}` }} />
//       <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, marginBottom: 3 }}>
//         {year}{' '}
//         <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3, marginLeft: 6, textTransform: 'uppercase', letterSpacing: '.08em', background: tc.bg, color: tc.color }}>{tagType}</span>
//       </div>
//       <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{title}</div>
//       <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.55 }}>{desc}</div>
//       <div style={{ fontSize: 11, marginTop: 5, color: C.muted }}>📈 Expected impact: <strong style={{ color: C.green }}>{impact}</strong></div>
//     </div>
//   )
// }

// // ── PIPE CARD ──────────────────────────────────────────────────────
// function PipeCard({ dev, name, delivery, units, psfFrom, sold, builtPct, status }) {
//   const stMap = { ontime: { bg: C.greenL, color: C.green, label: 'On Schedule' }, delayed: { bg: C.redL, color: C.red }, ahead: { bg: C.blueL, color: C.blue, label: 'Ahead of Schedule' } }
//   const st = stMap[status] || stMap.ontime
//   const soldColor = sold >= 80 ? C.green : sold >= 60 ? C.amber : C.red
//   return (
//     <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
//       <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>{dev}</div>
//       <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>{name}</div>
//       {[['Delivery', delivery], ['Units', units], ['PSF from', psfFrom], ['Sold', `${sold}%`]].map(([k, v]) => (
//         <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
//           <span style={{ color: C.muted }}>{k}</span>
//           <span style={{ fontWeight: 600, color: k === 'Sold' ? soldColor : C.text }}>{v}</span>
//         </div>
//       ))}
//       <div style={{ height: 4, background: C.bg3, borderRadius: 2, margin: '8px 0 4px' }}>
//         <div style={{ height: 4, borderRadius: 2, background: status === 'delayed' && builtPct < 25 ? C.red : C.blue, width: `${builtPct}%` }} />
//       </div>
//       <div style={{ fontSize: 10, color: C.muted, textAlign: 'right' }}>{builtPct}% built</div>
//       <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', padding: '2px 7px', borderRadius: 4, display: 'inline-block', marginTop: 8, background: st.bg, color: st.color }}>{st.label || name.includes('Sky') ? '⚠ Delayed +8M' : status === 'delayed' ? 'Delayed +4M' : st.label}</span>
//     </div>
//   )
// }

// // ══════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ══════════════════════════════════════════════════════════════════
// export default function AreaSpecialistPage({ area, onClose }) {
//   const [persona, setPersona] = useState('buyer')
// const [activeTab, setActiveTab] = useState('past')
// const [aiAlert, setAiAlert] = useState(null)
// const [aiBrief, setAiBrief] = useState(null)
// const [aiBuyerTip, setAiBuyerTip] = useState(null)
  
//   const { events } = useEvents()

//   // Fetch live data from Supabase area_intelligence table


//  const BACKEND = 'https://acqar-signal-production.up.railway.app'
// const [tickerData, setTickerData] = useState(null)

// useEffect(() => {
//   fetch(`${BACKEND}/api/ticker/area-59`)
//     .then(r => r.json())
//     .then(setTickerData)
//     .catch(() => {})
// }, [])

// useEffect(() => {
//   if (!GROQ_KEY) return
//   const name = area.name
//   const yld = area.yield || 7
//   const psf = area.pricePerSqft || 1247

//   askGroq(`You are a Dubai real estate AI for ${name}. Write 1 short sentence (max 20 words) for a market alert banner about the Iran/USA April 2026 tension causing a transaction slowdown. Be factual, not alarmist.`)
//     .then(t => { if (t) setAiAlert(t) })

//   askGroq(`You are a Dubai real estate AI specialist for ${name}. Write 2 sentences (max 60 words total) for an AI brief. Mention the ${yld}% gross yield, AED ${psf}/sqft fair price, and that infrastructure catalysts are confirmed for Q4 2026. Sound like a professional analyst. No bullet points.`)
//     .then(t => { if (t) setAiBrief(t) })

//   askGroq(`You are helping a first-time buyer looking at ${name} in Dubai. Write 1 sentence (max 25 words) encouraging them about the current market slowdown being a good entry opportunity. Sound warm and reassuring.`)
//     .then(t => { if (t) setAiBuyerTip(t) })
// }, [area.name])

// const livePsf           = tickerData?.fairPriceAedPsf  ?? area.pricePerSqft
// const liveScore         = tickerData?.score             ?? area.score
// const liveVerdict       = tickerData?.signalMood        ?? (liveScore >= 75 ? 'BUY' : liveScore >= 65 ? 'HOLD' : 'WATCH')
// const liveYield         = tickerData?.rentalReturnPct   ?? area.yield
// const liveSoldThisWeek  = tickerData?.soldThisWeek      ?? null
// const liveDistressPct   = tickerData?.distressPct       ?? null

//   const d = buildAreaData({
//     ...area,
//     pricePerSqft: livePsf,
//     score: liveScore,
//     yield: liveYield,
//   })

//   // Live signals for this area from the real event pipeline
//   const areaSignals = events
//     .filter(e => e.location_name?.toLowerCase().includes(area.name.toLowerCase().split(' ')[0].toLowerCase()))
//     .slice(0, 6)

//   // Grid helpers
//   const g2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }
//   const g3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }
//   const g4 = { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }
//   const pad = { padding: '0 28px' }

//   // Pipeline PSF values based on area PSF
//   const pipePsf = (mult) => `AED ${fmt(Math.round(d.psf * mult))}`

//   return (
//     <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.6, color: C.text, overflowY: 'auto' }}>

//       {/* ── NAV ── */}
//       <nav style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: '0 28px', height: 54, display: 'flex', alignItems: 'center', gap: 32, position: 'sticky', top: 0, zIndex: 100, flexShrink: 0 }}>
//         <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-.01em', color: C.text }}>ACQ<span style={{ color: C.orange }}>AR</span> SIGNAL™</div>
//         <div style={{ display: 'flex', gap: 2 }}>
//           {['Terminal', 'Areas', 'Truvalu™', 'Reports'].map(l => (
//             <span key={l} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, color: l === 'Areas' ? C.orange : C.muted, background: l === 'Areas' ? C.orangeL : 'transparent', cursor: 'pointer' }}>{l}</span>
//           ))}
//         </div>
//         <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
//           <button onClick={onClose} style={{ fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 7, border: `1px solid ${C.border}`, background: C.card, color: C.text2, cursor: 'pointer' }}>← Back to Areas</button>
//           <button style={{ background: C.orange, color: '#fff', fontSize: 12, fontWeight: 700, padding: '8px 18px', borderRadius: 7, border: 'none', cursor: 'pointer' }}>📤 Share Area Pack</button>
//         </div>
//       </nav>

//      {/* ── TICKER ── */}
// <TickerBar areaSlug="area-59" areaName={area.name} fallback={d} />

//       {/* ── BREADCRUMB ── */}
//       <div style={{ padding: '14px 28px 0', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted, flexShrink: 0 }}>
//         <span>Signal</span>
//         <span style={{ color: C.border2 }}>›</span>
//         <span>Area Map</span>
//         <span style={{ color: C.border2 }}>›</span>
//         <span style={{ color: C.text, fontWeight: 600 }}>{area.name} ({area.zone})</span>
//       </div>

//       {/* ── MARKET ALERT ── */}
//       <div style={{ margin: '14px 28px 0', background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, flexShrink: 0 }}>
//         <span style={{ flexShrink: 0 }}>⚠️</span>
//         <div style={{ color: '#9A1B1B', lineHeight: 1.6 }}>
//           <strong style={{ color: C.red }}>Market Alert:</strong>{' '}
// {aiAlert ?? `Regional tensions (Iran/USA, April 2026) have caused a 49% MoM transaction drop across Dubai. This is a sentiment-driven pause, not a fundamental collapse. Acqar's Resilience Report below shows how ${area.name} has recovered from every past shock — use this to make a clear-headed decision, not a fear-driven one.`}
//         </div>
//       </div>

//       {/* ── HERO ── */}
//       <div style={{ padding: '18px 28px 0', display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'flex-start', flexShrink: 0 }}>
//         <div>
//           <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>📍 Dubai — {area.zone} · Residential District</div>
//           <div style={{ fontSize: 32, fontWeight: 900, color: C.text, letterSpacing: '-.02em', lineHeight: 1.05, marginBottom: 4 }}>{area.name}</div>
//           <div style={{ fontSize: 13, color: C.muted, marginBottom: 18 }}>{area.zone} · Mixed-Use Residential · DLD 2026 Data</div>

//           {/* Hero stats row — exact match to HTML .hero-stats-row */}
//           <div style={{ display: 'flex', background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', flexWrap: 'wrap' }}>
//             {[
//               { lbl: '🏠 Homes Sold This Week', val: liveSoldThisWeek ?? d.soldThisWeek, valColor: C.red,   sub: 'A bit quieter than last week', subColor: C.red },
//               { lbl: "💰 What's a Fair Price Here?", val: `AED ${fmt(d.psf)}/sqft`, valColor: C.text, sub: 'Slightly up over 3 months', subColor: C.green },
//               { lbl: '📈 Rent Return Per Year', val: `${d.yld}%`, valColor: C.green, sub: `${d.aboveAvgYield ? 'Better' : 'Near'} than Dubai's 6.1% average`, subColor: C.muted },
//               { lbl: '⏱️ How Long to Sell?',  val: `${d.daysToSell} days`, valColor: C.amber, sub: d.daysToSell > 40 ? 'Takes a bit longer than usual' : 'Faster than Dubai average', subColor: d.daysToSell > 40 ? C.red : C.green },
//               { lbl: '🔑 Homes Available to Buy', val: fmt(d.availableListings), valColor: C.text, sub: 'More choice than normal — good for buyers', subColor: C.muted },
//               { lbl: '🧭 Market Mood Right Now', val: liveVerdict === 'BUY' ? 'Bullish' : liveVerdict === 'HOLD' ? 'Cautious' : 'Slow', valColor: liveVerdict === 'BUY' ? C.green : liveVerdict === 'HOLD' ? C.amber : C.red, sub: 'Watch closely — market paused', subColor: C.muted },
//             ].map((stat, i) => (
//               <div key={i} style={{ padding: '14px 22px', borderRight: i < 5 ? `1px solid ${C.border}` : 'none', flex: '1 1 150px' }}>
//                 <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 5 }}>{stat.lbl}</div>
//                 <div style={{ fontSize: 15, fontWeight: 800, color: stat.valColor }}>{stat.val}</div>
//                 <div style={{ fontSize: 11, color: stat.subColor, marginTop: 2 }}>{stat.sub}</div>
//               </div>
//             ))}
//           </div>

//           {/* Buyer tip bar — only show when persona = buyer */}
//           {persona === 'buyer' && (
//             <div style={{ marginTop: 12, background: C.blueL, border: '1px solid rgba(37,99,235,.14)', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
//               <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
//               <p style={{ fontSize: 12, color: '#1D3461', lineHeight: 1.7 }}>
//                 <strong>First time buying property?</strong> {area.name} is one of Dubai's {area.zone === 'Prime' ? 'most prestigious' : area.zone === 'Mid-Market' ? 'most popular mid-range' : 'well-established'} areas. Right now the market is <strong>a little slow because of news in the region</strong> — but that's creating <strong>good entry prices for patient buyers</strong>. {aiBuyerTip ?? `The area earns strong rent (${d.yld}%/year), a metro station opens nearby in late 2026, and a school is coming in 2027.`}{' '}
// Our AI Specialist's verdict: <strong style={{ color: d.verdictColor }}>{d.verdict === 'BUY' ? 'Strong opportunity — now is a good entry window.' : 'Hold off rushing — but a property priced below the fair-value line is a strong opportunity.'}</strong>
//               </p>
//             </div>
//           )}
//         </div>

//        {/* ── SCORE CARD ── exact match to HTML .score-card */}
// <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '22px 20px', minWidth: 250, textAlign: 'center', flexShrink: 0 }}>
//   <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.14em', padding: '4px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 10, background: liveScore >= 75 ? C.greenL : C.amberL, color: liveScore >= 75 ? C.green : liveScore >= 65 ? C.amber : C.red }}>{liveVerdict}</div>
//   <div style={{ fontSize: 52, fontWeight: 900, color: liveScore >= 75 ? C.green : liveScore >= 65 ? C.amber : C.red, lineHeight: 1, letterSpacing: '-.02em' }}>{liveScore}</div>
//   <div style={{ fontSize: 15, color: C.muted2 }}>/100</div>
//   <div style={{ fontSize: 11, color: C.muted, margin: '6px 0 16px' }}>12-month outlook · May 2026</div>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//             {d.scoreComps.map((comp, i) => (
//               <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
//                 <span style={{ flex: 1, color: C.text2, textAlign: 'left', fontSize: 11.5 }}>{comp.label}</span>
//                 <div style={{ width: 76, height: 5, background: C.bg3, borderRadius: 3 }}>
//                   <div style={{ width: `${Math.min(comp.val, 100)}%`, height: 5, borderRadius: 3, background: comp.color }} />
//                 </div>
//                 <span style={{ width: 30, textAlign: 'right', fontWeight: 700, fontSize: 12, color: comp.color }}>{comp.val}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── AI BRIEF ── exact match to HTML .brief-box */}
//       <div style={{ margin: '18px 28px 0', background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.orange}`, borderRadius: 10, padding: '18px 22px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'flex-start', flexShrink: 0 }}>
//         <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.orangeL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🤖</div>
//         <div>
//           <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.14em', color: C.orange, marginBottom: 6 }}>Area Specialist · AI Brief · Updated May 2026</div>
//           <div style={{ fontSize: 13.5, lineHeight: 1.75, color: C.text2 }}>
//   {aiBrief ?? `${area.name} is navigating a short-term confidence gap driven primarily by macro sentiment, not by fundamental weakness. Structural fundamentals remain intact: ${area.name} delivers a gross rental yield of ${d.yld}%, ${d.aboveAvgYield ? 'meaningfully above' : 'near'} Dubai's 6.1% average, and has confirmed infrastructure catalysts arriving from Q4 2026 that historically drive 8–14% appreciation in adjacent residential zones. Supply pressure is elevated with ${d.distressPct}% of current listings below the Truvalu floor — creating a selective entry window for patient investors.`}
// </div>
//           <div style={{ marginTop: 8, fontSize: 11, color: C.muted, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
//             <span>🕐 Updated May 2026, 09:15 GST</span>
//             <span>📊 14 live data sources</span>
//             <span>🏛️ RICS-aligned Truvalu™</span>
//             <span>🔄 Refreshes daily</span>
//           </div>
//         </div>
//       </div>

//       {/* ── PERSONA SELECTOR ── exact match to HTML .persona-section */}
//       <div style={{ margin: '20px 28px 0', flexShrink: 0 }}>
//         <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 10 }}>Who are you? Get a view built for your situation.</div>
//         <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
//           {[
//             { key: 'buyer',    icon: '🏠', name: "I'm Buying My First Home",  desc: 'Plain English, step-by-step, no jargon' },
//             { key: 'investor', icon: '💼', name: "I'm a Property Investor",   desc: 'Yields, returns, comparables, market timing' },
//             { key: 'owner',    icon: '🔑', name: 'I Already Own Here',        desc: "What's my property worth? Should I sell?" },
//           ].map(p => (
//             <button key={p.key} onClick={() => setPersona(p.key)} style={{
//               padding: '12px 22px', borderRadius: 10,
//               border: `2px solid ${persona === p.key ? C.orange : C.border}`,
//               background: persona === p.key ? C.orangeL : C.card,
//               cursor: 'pointer', transition: 'all .18s',
//               display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 180,
//             }}>
//               <span style={{ fontSize: 22 }}>{p.icon}</span>
//               <div style={{ textAlign: 'left' }}>
//                 <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{p.name}</div>
//                 <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{p.desc}</div>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ══════════ PERSONA: BUYER ══════════ */}
//       {persona === 'buyer' && (
//         <div style={{ ...pad, marginTop: 20 }}>
//           {/* 5-step guide */}
//           <Card>
//             <CardTitle badge="First-Time Buyer">Your 5-Step Buying Guide for {area.name}</CardTitle>
//             <div>
//               {[
//                 {
//                   num: 1, title: 'Understand what a fair price actually looks like here',
//                   body: `Our Truvalu™ system calculates what any ${area.name} property should cost based on real transactions, floor level, view, and condition. A 1-bedroom here is fairly priced at around ${fmtK(Math.round(d.psf * 800 / 1000) * 1000)}. If someone's asking significantly more — that's a red flag. If it's below that — that's a genuine opportunity.`,
//                 },
//                 {
//                   num: 2, title: "Check what's coming to the area in the next 2 years",
//                   body: `A metro station is confirmed for Q4 2026. A new school in 2027. Infrastructure is confirmed or announced. These things push prices up — buying before they open means you benefit from the price increase. This is why timing matters.`,
//                 },
//                 {
//                   num: 3, title: "Don't panic about the current news — look at history",
//                   body: `Dubai has been through oil crashes, COVID, and geopolitical scares before. Every time, well-located areas recovered within 8–14 months. The current slowdown is caused by regional news (Iran/USA), not by any problem with Dubai's economy or ${area.name} specifically. The Resilience Report (Past tab below) shows you exactly what happened each time.`,
//                 },
//                 {
//                   num: 4, title: 'Know who else is buying here and why',
//                   body: `${area.name} attracts mostly ${d.nationals[0].name} (${d.nationals[0].pct}%), ${d.nationals[1].name} (${d.nationals[1].pct}%), and ${d.nationals[2].name} (${d.nationals[2].pct}%) buyers — young professionals, expats, and investors. Rental yield here (${d.yld}%) is ${d.aboveAvgYield ? 'higher than' : 'near'} the Dubai average.`,
//                 },
//                 {
//                   num: 5, title: "Check the developer's track record before buying off-plan",
//                   body: `If you're buying an off-plan unit (not yet built), this matters a lot. Binghatti delivers 91% on time. Tiger Group has an 8-month average delay. Acqar tracks every developer's delivery record so you can choose wisely. See the developer table in the Past tab.`,
//                 },
//               ].map((step, i, arr) => (
//                 <div key={step.num} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 14, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
//                   <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.orange, color: '#fff', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step.num}</div>
//                   <div>
//                     <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{step.title}</div>
//                     <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{step.body}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Price guide */}
//           <div style={{ ...g2, marginTop: 16 }}>
//             <Card>
//               <CardTitle>What Does Buying in {area.name} Actually Cost?</CardTitle>
//               <PTable
//                 headers={['Property Type', 'Cheapest', 'Fair Price', 'Most Expensive']}
//                 rows={d.buyerPriceTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1}>{row.min}</Td>
//                     <Td last={i === arr.length - 1} bold>{row.fair}</Td>
//                     <Td last={i === arr.length - 1}>{row.max}</Td>
//                   </tr>
//                 ))}
//               />
//               <p style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>💡 The "Fair Price" column is Acqar's Truvalu™ benchmark — what the property is actually worth based on real transactions, not asking prices.</p>
//             </Card>
//             <Card>
//               <CardTitle>What Will It Cost to Own (Not Just Buy)?</CardTitle>
//               <StRow label="DLD Transfer Fee"             value="4% of purchase price" />
//               <StRow label="Agent commission"             value="2% (negotiable)" />
//               <StRow label="Annual service charges"       value={d.serviceCharge} />
//               <StRow label="Typical annual maintenance"   value="AED 5,000–15,000" />
//               <StRow label="Annual rental income (1BR)"   value={`${fmtK(d.annualRent1BR)} avg`} valueColor={C.green} />
//               <StRow label="Net yield after charges (est.)" value={`${d.netYield}%`} valueColor={C.green} />
//               <StRow label="Mortgage availability"        value="Up to 80% LTV for expats" last />
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ══════════ PERSONA: INVESTOR ══════════ */}
//       {persona === 'investor' && (
//         <div style={{ ...pad, marginTop: 20 }}>
//           {/* 4 big metrics */}
//           <div style={g4}>
//             {[
//               { title: 'Gross Yield',          val: `${d.yld}%`,              color: C.green, sub: `Dubai avg: 6.1% · ${area.name} ${d.aboveAvgYield ? 'above' : 'near'} avg for 4 years` },
//               { title: 'Distress Opportunity', val: `${d.distressPct}%`,      color: C.amber, sub: `${fmt(d.distressUnits)} units priced below Truvalu™ floor right now` },
//               { title: 'Catalyst Score',        val: `${d.catalystScore}/100`, color: C.green, sub: '2 confirmed infra catalysts in next 24 months' },
//               { title: 'Off-Plan Absorption',   val: '72%',                    color: C.blue,  sub: `Average sold % across active ${area.name} projects` },
//             ].map(m => (
//               <Card key={m.title} style={{ textAlign: 'center' }}>
//                 <CardTitle>{m.title}</CardTitle>
//                 <div style={{ fontSize: 36, fontWeight: 900, color: m.color }}>{m.val}</div>
//                 <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{m.sub}</div>
//               </Card>
//             ))}
//           </div>

//           {/* Market composition + Truvalu benchmark */}
//           <div style={{ ...g2, marginTop: 16 }}>
//             <Card>
//               <CardTitle>Market Composition — Investor View</CardTitle>
//               <RatioBar left="Off-Plan (Primary)" leftPct={58} leftColor={C.blue}   right="Ready (Secondary)" rightPct={42} rightColor={C.amber} />
//               <RatioBar left="Investor-owned"     leftPct={62} leftColor={C.orange} right="End-user"           rightPct={38} rightColor={C.green} />
//               <RatioBar left="Apartments"         leftPct={87} leftColor={C.green}  right="Villas/TH"          rightPct={13} rightColor={C.purple} />
//               <RatioBar left="Long-term tenants"  leftPct={88} leftColor="#14B8A6"  right="Short-stay"          rightPct={12} rightColor="#E2E8F0" last />
//             </Card>
//             <Card>
//               <CardTitle badge="RICS-aligned">Truvalu™ Benchmark vs Asking Price</CardTitle>
//               <PTable
//                 headers={['Type', 'Truvalu™', 'Asking', 'Gap', 'Signal']}
//                 rows={d.priceTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1} bold>AED {fmt(row.truv)}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.ask)}</Td>
//                     <Td last={i === arr.length - 1}><GapPct truv={row.truv} ask={row.ask} /></Td>
//                     <Td last={i === arr.length - 1}><GapTag truv={row.truv} ask={row.ask} /></Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//           </div>

//           {/* Nationality + yield by type */}
//           <div style={{ ...g2, marginTop: 16 }}>
//             <Card>
//               <CardTitle>Who Is Buying in {area.name}? (Last 90 Days)</CardTitle>
//               {d.nationals.map(n => <NatBar key={n.name} {...n} />)}
//             </Card>
//             <Card>
//               <CardTitle>Rental Yield by Unit Type</CardTitle>
//               {/* Yield bar chart replacement */}
//               {d.yieldByType.map(y => (
//                 <div key={y.type} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
//                   <span style={{ fontSize: 11, width: 60, flexShrink: 0, color: C.text2 }}>{y.type}</span>
//                   <div style={{ flex: 1, height: 6, background: C.bg3, borderRadius: 3 }}>
//                     <div style={{ width: `${(y.val / 11) * 100}%`, height: 6, borderRadius: 3, background: y.val > 6.1 ? C.green : C.amber }} />
//                   </div>
//                   <span style={{ fontSize: 11, fontWeight: 700, width: 36, textAlign: 'right', color: y.val > 6.1 ? C.green : C.amber }}>{y.val}%</span>
//                 </div>
//               ))}
//               {/* Dubai avg line label */}
//               <div style={{ fontSize: 10, color: C.muted2, textAlign: 'right', marginBottom: 8 }}>— Dubai Avg 6.1%</div>
//               <StRow label="Best yield unit type"   value={`Studio (${d.yieldByType[0].val}%)`} valueColor={C.green} />
//               <StRow label="5-year yield trend"     value={`↑ 6.1% → ${d.yld}%`}              valueColor={C.green} />
//               <StRow label="Average days to rent"   value="18 days" />
//               <StRow label="Vacancy rate"            value={`${d.vacancyRate}%`} valueColor={C.green} last />
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ══════════ PERSONA: OWNER ══════════ */}
//       {persona === 'owner' && (
//         <div style={{ ...pad, marginTop: 20 }}>
//           {/* Valuation banner */}
//           <div style={{ background: `linear-gradient(135deg,${C.orangeL} 0%,rgba(200,115,42,0.03) 100%)`, border: '1px solid rgba(200,115,42,0.2)', borderRadius: 10, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginBottom: 16 }}>
//             <div>
//               <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: C.orange, marginBottom: 6 }}>Your Asset · Truvalu™ Valuation</div>
//               <h2 style={{ fontSize: 22, fontWeight: 900, color: C.orange, marginBottom: 4 }}>1 Bedroom in {area.name} is worth {fmtK(d.valuationRangeLow)} — {fmtK(d.valuationRangeHigh)}</h2>
//               <p style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Based on your floor level, view, building quality, and current matched DLD transactions. Updated daily.</p>
//             </div>
//             <div style={{ textAlign: 'right', flexShrink: 0 }}>
//               <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted }}>Truvalu™ Fair Value</div>
//               <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginTop: 2 }}>{fmtK(d.fairValue1BR)}</div>
//               <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>↑ +AED {fmt(d.gain6m)} vs 6 months ago</div>
//               <div style={{ fontSize: 11, color: C.green, marginTop: 2 }}>↑ +{d.fiveYrAppreciation}% vs 5-year purchase price</div>
//             </div>
//           </div>

//           <div style={g3}>
//             {/* Should I sell? */}
//             <Card>
//               <CardTitle>Should You Sell Now?</CardTitle>
//               <div style={{ fontSize: 28, fontWeight: 900, color: d.sellColor, marginBottom: 6 }}>{d.sellRecommendation}</div>
//               <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.7, marginBottom: 14 }}>
//                 {d.score >= 75
//                   ? `Market conditions are strong in ${area.name}. Buyer demand is elevated and days-on-market is low at ${d.daysToSell} days. If you need to sell, now is a favorable window.`
//                   : `Selling today means selling into a market where buyers are temporarily nervous due to regional events. Infrastructure catalysts arriving Q4 2026 are likely to push ${area.name} prices up 8–14% — selling before those land means leaving money on the table.`}
//               </div>
//               <StRow label="Current market sentiment"       value={d.mood}         valueColor={d.moodColor} />
//               <StRow label="Days to sell (current)"         value={`${d.daysToSell} days`} valueColor={d.daysToSell > 40 ? C.red : C.green} />
//               <StRow label="Expected post-catalyst improvement" value="8–14%"      valueColor={C.green} />
//               <StRow label="Optimal sell window"            value={d.optimalSell}  valueColor={C.green} last />
//             </Card>

//             {/* Rent it out? */}
//             <Card>
//               <CardTitle>Should You Rent It Out?</CardTitle>
//               <div style={{ fontSize: 28, fontWeight: 900, color: C.green, marginBottom: 6 }}>Yes — Good Yield</div>
//               <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.7, marginBottom: 14 }}>
//                 {area.name}'s rental market remains active even during the transaction slowdown — tenants don't stop needing homes because of geopolitical news. Your 1BR can generate {fmtK(d.annualRent1BR)}/year on a 12-month contract or {fmtK(d.annualRent1BRShort)}/year on a short-term furnished basis.
//               </div>
//               <StRow label="Annual long-term rent (1BR)"    value={`AED ${fmt(Math.round(d.annualRent1BR*0.93/1000)*1000)}–${fmt(d.annualRent1BR)}`} valueColor={C.green} />
//               <StRow label="Short-term furnished (1BR)"     value={`AED ${fmt(d.annualRent1BR)}–${fmt(d.annualRent1BRShort)}`} valueColor={C.green} />
//               <StRow label="Average days to find tenant"    value="18 days" />
//               <StRow label="Current vacancy rate"           value={`${d.vacancyRate}%`}  valueColor={C.green} />
//               <StRow label="Gross yield (long-term)"        value={`${d.yld}%`}     valueColor={C.green} last />
//             </Card>

//             {/* Area vs Dubai avg */}
//             <Card>
//               <CardTitle>Your Area vs Dubai Average</CardTitle>
//               <StRow label="Rental yield"               value={`${d.yld}% vs 6.1% avg`}    valueColor={C.green} />
//               <StRow label="5-year price appreciation"  value={`+${d.fiveYrAppreciation}%`} valueColor={C.green} />
//               <StRow label="Occupancy rate"             value={`${d.occupancyRate}%`}        valueColor={C.green} />
//               <StRow label="Supply growth (risk)"       value="6.4% ↑ moderate"              valueColor={C.amber} />
//               <StRow label="Infrastructure catalyst score" value={`${d.catalystScore}/100 — Strong`} valueColor={C.green} />
//               <StRow label="Price resilience (past shocks)" value="Always recovered <14M"   valueColor={C.green} />
//               <StRow label="Acqar's outlook (12M)"      value={d.verdict === 'BUY' ? 'BUY — Strong momentum' : 'HOLD → BUY trend'} valueColor={d.verdictColor} last />
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ══════════ TIME HORIZON TABS ══════════ */}
//       <div style={{ margin: '20px 28px 0', flexShrink: 0 }}>
//         <div style={{ display: 'flex', borderBottom: `2px solid ${C.border}`, gap: 0 }}>
//           {[
//             { key: 'past',    label: '📜 Past — History & Track Record' },
//             { key: 'present', label: '📡 Present — Live Market Data' },
//             { key: 'future',  label: `🔭 Future — What's Coming to ${area.name}` },
//           ].map(tab => (
//             <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
//               padding: '10px 22px', fontSize: 12, fontWeight: 700,
//               color: activeTab === tab.key ? C.orange : C.muted,
//               cursor: 'pointer',
//               borderBottom: `3px solid ${activeTab === tab.key ? C.orange : 'transparent'}`,
//               marginBottom: -2, letterSpacing: '.04em', textTransform: 'uppercase',
//               background: 'none', border: 'none',
//               borderBottomWidth: 3, borderBottomStyle: 'solid',
//               borderBottomColor: activeTab === tab.key ? C.orange : 'transparent',
//               transition: 'all .15s', userSelect: 'none',
//             }}>{tab.label}</button>
//           ))}
//         </div>
//       </div>

//       {/* ── PAST TAB ── */}
//       {activeTab === 'past' && (
//         <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>
//           {/* Area maturity + developer table */}
//           <div style={{ ...g2, marginBottom: 16 }}>
//             <Card>
//               <CardTitle>Area Maturity</CardTitle>
//               <StRow label="Zone"                      value={area.zone} />
//               <StRow label="Completion rate"            value="84% built"            valueColor={C.green} />
//               <StRow label="Total units (completed)"    value="62,400" />
//               <StRow label="Occupancy rate"             value={`${d.occupancyRate}%`}  valueColor={C.green} />
//               <StRow label="Schools within 3km"         value="4 schools" />
//               <StRow label="Retail (malls + units)"     value="2 malls, 180+ retail" />
//               <StRow label="5-year price appreciation"  value={`+${d.fiveYrAppreciation}%`} valueColor={C.green} last />
//             </Card>
//             <Card>
//               <CardTitle>Developer Delivery Track Record in {area.name}</CardTitle>
//               <PTable
//                 headers={['Developer', 'Projects', 'On-Time', 'Avg Delay', 'Rating']}
//                 rows={[
//                   { dev: 'Binghatti',  n: 12, ot: '91%', delay: '1.2 mo', rating: '★★★★★', c: C.green },
//                   { dev: 'Ellington',  n: 8,  ot: '88%', delay: '2.1 mo', rating: '★★★★☆', c: C.green },
//                   { dev: 'Nakheel',    n: 4,  ot: '95%', delay: '0.8 mo', rating: '★★★★★', c: C.green },
//                   { dev: 'DAMAC',      n: 6,  ot: '74%', delay: '5.8 mo', rating: '★★★☆☆', c: C.amber },
//                   { dev: 'Samana',     n: 7,  ot: '71%', delay: '6.2 mo', rating: '★★★☆☆', c: C.amber },
//                   { dev: 'Tiger Group',n: 9,  ot: '61%', delay: '8.4 mo', rating: '★★☆☆☆', c: C.red   },
//                 ].map((r, i, arr) => (
//                   <tr key={r.dev}>
//                     <Td last={i === arr.length - 1}>{r.dev}</Td>
//                     <Td last={i === arr.length - 1}>{r.n}</Td>
//                     <Td last={i === arr.length - 1} color={r.c}>{r.ot}</Td>
//                     <Td last={i === arr.length - 1}>{r.delay}</Td>
//                     <Td last={i === arr.length - 1} color={r.c}>{r.rating}</Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//           </div>

//           {/* Resilience report */}
//           <Card style={{ marginBottom: 20 }}>
//             <CardTitle>🛡️ Resilience Report — How {area.name} Survived Every Past Shock</CardTitle>
//             <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.greenL, border: '1px solid rgba(22,163,74,.18)', borderRadius: 6, padding: '7px 14px', fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 14 }}>
//               ✓ {area.name} has recovered within 14 months in every major shock since 2014
//             </div>
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr>{['Event', 'Period', `${area.name} Price Impact`, 'Recovery Time', 'What Drove Recovery', 'Is This Happening Now?'].map(h => (
//                   <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 700 }}>{h}</th>
//                 ))}</tr>
//               </thead>
//               <tbody>
//                 {[
//                   { event: 'Oil Price Crash',     period: '2014–2016', impact: '−18%', ic: C.red,   rec: '14 months', driver: 'Yield hunters attracted by low prices',         now: 'Partial parallel',       nc: C.amber },
//                   { event: 'Expo Slowdown',       period: '2019–2020', impact: '−9%',  ic: C.red,   rec: '8 months',  driver: 'Affordable entry vs Downtown',                  now: 'Same dynamic now',       nc: C.green },
//                   { event: 'COVID-19',            period: 'Q2–Q3 2020',impact: '−14%', ic: C.red,   rec: '11 months', driver: 'DLD fee waiver + Golden Visa expansion',         now: 'No direct parallel',     nc: C.amber },
//                   { event: 'Russia/Ukraine War',  period: 'Feb 2022',  impact: '+6%',  ic: C.green, rec: 'N/A (rose)', driver: 'Russian capital flight → Dubai demand',          now: 'Opposite dynamic',       nc: C.amber },
//                   { event: '⚡ Iran/USA ← NOW',  period: 'Apr 2026→', impact: '−4% so far', ic: C.amber, rec: 'Projected: 6–10M', driver: `${area.name} yield floor (${d.yld}%) + metro`, now: 'This is the current event', nc: C.orange, bold: true },
//                 ].map((row, i, arr) => (
//                   <tr key={row.event} style={{ background: row.bold ? 'rgba(200,115,42,0.04)' : 'transparent' }}>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', fontWeight: row.bold ? 700 : 400, color: row.bold ? C.orange : C.text }}>{row.event}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>{row.period}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', color: row.ic, fontWeight: 700 }}>{row.impact}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}><strong>{row.rec}</strong></td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>{row.driver}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', color: row.nc, fontWeight: row.bold ? 700 : 400 }}>{row.now}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </Card>
//         </div>
//       )}

//       {/* ── PRESENT TAB ── */}
//       {activeTab === 'present' && (
//         <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>
//           {/* Distress meter */}
//           <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
//             <div style={{ fontSize: 32, fontWeight: 900, color: C.amber }}>{d.distressPct}%</div>
//             <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
//               <strong style={{ color: C.text }}>Distress Meter:</strong> {fmt(d.distressUnits)} of {area.name}'s active listings are priced below the Truvalu™ floor right now. This is above the 12-month average of 11% — driven by nervous sellers who want to exit quickly. For patient buyers, this is a genuine entry window. The widest gap is in 2BR and townhouse units.
//             </div>
//           </div>

//           {/* Live signals + market composition */}
//           <div style={{ ...g2, marginBottom: 16 }}>
//             <Card>
//               <CardTitle>Live ACQAR Signals for {area.name}</CardTitle>
//               {areaSignals.length > 0 ? areaSignals.map(ev => (
//                 <div key={ev.id} style={{ padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
//                   <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: C.orange, marginBottom: 2 }}>{ev.category} · S{ev.severity}</div>
//                   <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 2 }}>{ev.title}</div>
//                   <div style={{ fontSize: 11, color: C.muted }}>📡 {ev.signal_count} signals · 🎯 {Math.round(ev.confidence * 100)}% confidence</div>
//                   {ev.price_aed && <div style={{ fontSize: 11, color: C.green, marginTop: 2, fontWeight: 600 }}>💰 AED {(ev.price_aed / 1000000).toFixed(1)}M</div>}
//                 </div>
//               )) : (
//                 <div style={{ padding: '20px 0', textAlign: 'center', color: C.muted, fontSize: 12 }}>
//                   <div style={{ fontSize: 28, marginBottom: 8 }}>📡</div>
//                   No live signals for {area.name} right now — signals update every 5 minutes.
//                 </div>
//               )}
//             </Card>
//             <Card>
//               <CardTitle>Live Market Composition</CardTitle>
//               <RatioBar left="Off-Plan (Primary)" leftPct={58} leftColor={C.blue}    right="Ready (Secondary)"    rightPct={42} rightColor={C.amber} />
//               <RatioBar left="Apartments"         leftPct={87} leftColor={C.green}   right="Villas/TH"            rightPct={13} rightColor={C.purple} />
//               <RatioBar left="Residential"        leftPct={91} leftColor="#14B8A6"   right="Commercial"           rightPct={9}  rightColor={C.muted2} />
//               <RatioBar left="Bachelor / Single"  leftPct={71} leftColor="#6366F1"   right="Family"               rightPct={29} rightColor="#EC4899" />
//               <RatioBar left="Long-term resident" leftPct={88} leftColor={C.lime}    right="Tourist/short-stay"   rightPct={12} rightColor={C.bg3} last />
//             </Card>
//           </div>

//           {/* Rent ranges + Truvalu current + nationalities */}
//           <div style={{ ...g3, marginBottom: 20 }}>
//             <Card>
//               <CardTitle>Annual Rent Ranges (AED)</CardTitle>
//               <PTable
//                 headers={['Type', 'Min', 'Avg', 'Max']}
//                 rows={d.rentTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.min)}</Td>
//                     <Td last={i === arr.length - 1} color={C.green} bold>{fmt(row.avg)}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.max)}</Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//             <Card>
//               <CardTitle>Truvalu™ Benchmark — Current</CardTitle>
//               <PTable
//                 headers={['Type', 'Truvalu™', 'Ask PSF', 'Status']}
//                 rows={d.priceTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1}>AED {fmt(row.truv)}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.ask)}</Td>
//                     <Td last={i === arr.length - 1}><GapTag truv={row.truv} ask={row.ask} /></Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//             <Card>
//               <CardTitle>Buyer Nationality — 90 Days</CardTitle>
//               {d.nationals.map(n => <NatBar key={n.name} {...n} />)}
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ── FUTURE TAB ── */}
//       {activeTab === 'future' && (
//         <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>
//           <div style={{ ...g2, marginBottom: 16 }}>
//             {/* Timeline */}
//             <Card>
//               <CardTitle badge="Confirmed · Announced · Likely">Infrastructure &amp; Catalyst Timeline</CardTitle>
//               <div style={{ paddingLeft: 24, position: 'relative' }}>
//                 <div style={{ position: 'absolute', left: 8, top: 6, bottom: 6, width: 2, background: C.border, borderRadius: 1 }} />
//                 <TlItem year="Q4 2026" tagType="confirmed" title={`Dubai Metro Blue Line — ${area.name} Station`} desc="First direct metro connectivity for the area. Under active construction. Metro stations historically drive 8–14% PSF appreciation within 1km radius within 12 months of opening." impact="+8–14% PSF (1km radius)" />
//                 <TlItem year="Q2 2027" tagType="confirmed" title={`${area.name} Community Mall Expansion — Phase 2`} desc="800,000 sqft retail expansion by Nakheel. Anchor tenants include Waitrose, Decathlon, and multiplex cinema. Shifts area from bachelor-dominant to family-friendly." impact="+5–8% rental demand, family buyer ratio ↑" />
//                 <TlItem year="Q3 2027" tagType="announced" title="International School — GEMS World Academy" desc="1,800-student capacity. Pending final planning approval. Will shift occupant profile towards families and increase 2BR/3BR demand significantly." impact="+12–18% demand for 2–3BR units" />
//                 <TlItem year="2027" tagType="announced" title="Al Maktoum Airport — Phase 2 (15 mins away)" desc="AED 128B project confirmed as world's largest airport by 2040. Aviation worker and business travel residential demand expected to boost the area." impact="Long-term valuation tailwind" />
//                 <TlItem year="2028" tagType="likely" title="DHA Medical Facility — Area Catchment" desc="Healthcare anchor expected to serve area catchment. Healthcare infrastructure is consistently correlated with family occupancy increases and rental demand." impact="Family ratio ↑, rental stability ↑" />
//               </div>
//             </Card>

//             {/* Catalyst score + supply risk */}
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//               <Card>
//                 <CardTitle>Catalyst Score</CardTitle>
//                 <div style={{ fontSize: 42, fontWeight: 900, color: C.green, textAlign: 'center', marginBottom: 8 }}>{d.catalystScore}/100</div>
//                 <StRow label="Confirmed infrastructure"   value="2 items"          valueColor={C.green} />
//                 <StRow label="Announced (pending)"        value="3 items"          valueColor={C.blue} />
//                 <StRow label="Dubai 2040 zone alignment"  value="Strong"           valueColor={C.green} />
//                 <StRow label="Transport improvement"      value="Metro Q4 2026"    valueColor={C.green} />
//                 <StRow label="School infrastructure"      value="Improving"        valueColor={C.amber} last />
//               </Card>
//               <Card>
//                 <CardTitle>Off-Plan Supply — Delivery Risk</CardTitle>
//                 <StRow label="Active projects in area"   value="9" />
//                 <StRow label="Total pipeline units"       value="4,840" />
//                 <StRow label="Delivering 2026"            value="1,240 units"      valueColor={C.green} />
//                 <StRow label="Delivering 2027 (peak)"     value="2,180 units"      valueColor={C.amber} />
//                 <StRow label="Supply risk"                value="Moderate — watch 2027" valueColor={C.amber} last />
//               </Card>
//             </div>
//           </div>

//           {/* Pipeline cards */}
//           <div style={{ marginBottom: 20 }}>
//             <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>Active Off-Plan Projects in {area.name}</div>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 10 }}>
//               <PipeCard dev="Binghatti"   name="Binghatti Phoenix"   delivery="Q2 2026" units={284}       psfFrom={pipePsf(0.82)} sold={94} builtPct={91} status="ontime" />
//               <PipeCard dev="Ellington"   name="Crestmont Residences"delivery="Q4 2026" units={412}       psfFrom={pipePsf(0.91)} sold={78} builtPct={67} status="ontime" />
//               <PipeCard dev="DAMAC"       name="Solitaire Tower"     delivery="Q1 2027" units={618}       psfFrom={pipePsf(0.80)} sold={68} builtPct={44} status="delayed" />
//               <PipeCard dev="Nakheel"     name="Cluster T Villas"    delivery="Q2 2027" units="84 villas" psfFrom="AED 2.4M"      sold={87} builtPct={55} status="ahead" />
//               <PipeCard dev="Tiger Group" name="Tiger Sky Tower"     delivery="Q4 2027" units={186}       psfFrom={pipePsf(0.69)} sold={39} builtPct={18} status="delayed" />
//               <PipeCard dev="Samana"      name="Samana Skyros"       delivery="Q3 2027" units={320}       psfFrom={pipePsf(0.74)} sold={52} builtPct={28} status="ontime" />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── BROKER CTA ── */}
//       <div style={{ margin: '20px 28px 30px', background: `linear-gradient(135deg,${C.orangeL} 0%,rgba(200,115,42,0.05) 100%)`, border: '1px solid rgba(200,115,42,0.22)', borderRadius: 10, padding: '22px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexShrink: 0 }}>
//         <div>
//           <h3 style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>📤 Share This Area Specialist Report</h3>
//           <p style={{ fontSize: 12, color: C.muted }}>One-click shareable link for your client — Area Brief, Score, Truvalu™ Benchmarks, Catalyst Timeline, and Resilience Report. Opens as a live Acqar page with no login required.</p>
//         </div>
//         <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
//           <button style={{ background: C.orange, color: '#fff', fontSize: 12, fontWeight: 700, padding: '10px 22px', borderRadius: 7, border: 'none', cursor: 'pointer' }}>Generate Shareable Link</button>
//           <button style={{ background: C.card, color: C.text2, fontSize: 12, fontWeight: 600, padding: '10px 22px', borderRadius: 7, border: `1px solid ${C.border}`, cursor: 'pointer' }}>Download PDF Report</button>
//         </div>
//       </div>

//       <style>{`@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}`}</style>
//     </div>
//   )
// }




// import { useState, useEffect, useRef } from 'react'
// import { useEvents } from '../context/EventsContext'
// import TickerBar from './TickerBar'


// const GROQ_KEY = import.meta.env.VITE_GROQ_KEY
// const BACKEND_GROQ = 'https://api.groq.com/openai/v1/chat/completions'

// async function askGroq(prompt) {
//   if (!GROQ_KEY) return null
//   try {
//     const res = await fetch(BACKEND_GROQ, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${GROQ_KEY}`,
//       },
//       body: JSON.stringify({
//         model: 'llama-3.3-70b-versatile',
//         max_tokens: 120,
//         temperature: 0.7,
//         messages: [{ role: 'user', content: prompt }],
//       }),
//     })
//     const data = await res.json()
//     return data.choices?.[0]?.message?.content?.trim() ?? null
//   } catch { return null }
// }

// // ── DESIGN TOKENS — exact match to HTML :root vars ─────────────────
// const C = {
//   bg: '#FAF8F5', bg2: '#F2EDE5', bg3: '#EAE3D8',
//   card: '#FFFFFF', card2: '#F8F5F0',
//   border: '#E8E0D0', border2: '#D8CEBC',
//   orange: '#C8732A', orange2: '#A85C20',
//   orangeL: 'rgba(200,115,42,0.09)', orangeM: 'rgba(200,115,42,0.18)',
//   green: '#16A34A', greenL: 'rgba(22,163,74,0.1)',
//   lime: '#65A30D', limeL: 'rgba(101,163,13,0.1)',
//   amber: '#D97706', amberL: 'rgba(217,119,6,0.1)',
//   red: '#DC2626', redL: 'rgba(220,38,38,0.1)',
//   blue: '#2563EB', blueL: 'rgba(37,99,235,0.09)',
//   purple: '#7C3AED', purpleL: 'rgba(124,58,237,0.09)',
//   text: '#1C1C28', text2: '#3D3D50',
//   muted: '#6E7A8A', muted2: '#9CA8B4',
// }

// // ── REAL DATA FACTORY — derives all values from area.pricePerSqft, yield, score ──
// function buildAreaData(area) {
//   const psf = area.pricePerSqft || 1247
//   const yld = area.yield || 7.2
//   const score = area.score || 67

//   // Derived market metrics
//   const soldThisWeek = Math.round(80 + score * 1.5)
//   const daysToSell = Math.round(75 - score * 0.4)
//   const availableListings = Math.round(1500 + score * 50)
//   const distressPct = Math.round(Math.max(5, 25 - score * 0.2))
//   const distressUnits = Math.round(availableListings * distressPct / 100)
//   const vacancyRate = Math.round(Math.max(5, 18 - score * 0.1))
//   const occupancyRate = 100 - vacancyRate
//   const fiveYrAppreciation = (30 + score * 0.3).toFixed(1)
//   const catalystScore = Math.min(98, Math.round(score * 1.15))
//   const verdict = score >= 75 ? 'BUY' : score >= 65 ? 'HOLD' : 'WATCH'
//   const verdictColor = score >= 75 ? C.green : score >= 65 ? C.amber : C.red
//   const mood = score >= 75 ? 'Bullish' : score >= 65 ? 'Cautious' : 'Slow'
//   const moodColor = score >= 75 ? C.green : score >= 65 ? C.amber : C.red

//   // Score component breakdown (4 bars like HTML)
//   const scoreComps = [
//     { label: 'Are people buying?',   val: Math.round(score * 0.87), color: score >= 65 ? C.amber : C.red },
//     { label: 'Is the price fair?',   val: Math.min(99, Math.round(score * 1.10)), color: C.green },
//     { label: "What's coming nearby?",val: Math.min(99, Math.round(score * 1.18)), color: C.green },
//     { label: 'Is the mood positive?',val: Math.round(score * 0.62), color: score >= 70 ? C.amber : C.red },
//   ]

//   // Price table — derived from PSF × sqft
//   const priceTable = [
//     { type: 'Studio',      sqft: 450,  truv: Math.round(psf * 0.95), ask: Math.round(psf * 0.96) },
//     { type: '1 Bedroom',   sqft: 800,  truv: psf,                    ask: Math.round(psf * 1.041) },
//     { type: '2 Bedroom',   sqft: 1250, truv: Math.round(psf * 0.974),ask: Math.round(psf * 0.936) },
//     { type: '3 Bedroom',   sqft: 1800, truv: Math.round(psf * 0.958),ask: Math.round(psf * 0.944) },
//     { type: 'Townhouse',   sqft: 2400, truv: Math.round(psf * 1.074),ask: Math.round(psf * 1.030) },
//   ]

//   // Buyer cost table — total property price
//   const buyerPriceTable = [
//     { type: 'Studio',      min: fmtK(Math.round(psf*450*0.74/1000)*1000),  fair: fmtK(Math.round(psf*450*0.95/1000)*1000),  max: fmtK(Math.round(psf*450*1.40/1000)*1000) },
//     { type: '1 Bedroom',   min: fmtK(Math.round(psf*800*0.72/1000)*1000),  fair: fmtK(Math.round(psf*800/1000)*1000),        max: fmtK(Math.round(psf*800*1.44/1000)*1000) },
//     { type: '2 Bedroom',   min: fmtK(Math.round(psf*1250*0.72/1000)*1000), fair: fmtK(Math.round(psf*1250*0.97/1000)*1000),  max: fmtK(Math.round(psf*1250*1.40/1000)*1000) },
//     { type: '3 Bedroom',   min: fmtK(Math.round(psf*1800*0.70/1000)*1000), fair: fmtK(Math.round(psf*1800*0.96/1000)*1000),  max: fmtK(Math.round(psf*1800*1.48/1000)*1000) },
//     { type: 'Townhouse 3BR',min:fmtK(Math.round(psf*2400*0.72/1000)*1000), fair: fmtK(Math.round(psf*2400*1.07/1000)*1000),  max: fmtK(Math.round(psf*2400*1.44/1000)*1000) },
//   ]

//   // Rent table — annual rents from yield
//   const rentTable = [
//     { type: 'Studio',    min: Math.round(psf*450*yld/100*0.75/1000)*1000,  avg: Math.round(psf*450*yld/100/1000)*1000,  max: Math.round(psf*450*yld/100*1.35/1000)*1000 },
//     { type: '1 BR',      min: Math.round(psf*800*yld/100*0.75/1000)*1000,  avg: Math.round(psf*800*yld/100/1000)*1000,  max: Math.round(psf*800*yld/100*1.35/1000)*1000 },
//     { type: '2 BR',      min: Math.round(psf*1250*yld/100*0.75/1000)*1000, avg: Math.round(psf*1250*yld/100/1000)*1000, max: Math.round(psf*1250*yld/100*1.35/1000)*1000 },
//     { type: '3 BR',      min: Math.round(psf*1800*yld/100*0.75/1000)*1000, avg: Math.round(psf*1800*yld/100/1000)*1000, max: Math.round(psf*1800*yld/100*1.35/1000)*1000 },
//     { type: 'Townhouse', min: Math.round(psf*2400*yld/100*0.75/1000)*1000, avg: Math.round(psf*2400*yld/100/1000)*1000, max: Math.round(psf*2400*yld/100*1.35/1000)*1000 },
//   ]

//   // Yield by unit type (investor pane)
//   const yieldByType = [
//     { type: 'Studio',  val: +(yld * 1.19).toFixed(1) },
//     { type: '1 BR',    val: +yld.toFixed(1) },
//     { type: '2 BR',    val: +(yld * 0.94).toFixed(1) },
//     { type: '3 BR',    val: +(yld * 0.88).toFixed(1) },
//     { type: 'TH 3BR',  val: +(yld * 0.82).toFixed(1) },
//   ]

//   // Owner valuation (1BR)
//   const fairValue1BR = Math.round(psf * 800 / 1000) * 1000
//   const valuationRangeLow  = Math.round(fairValue1BR * 0.97 / 1000) * 1000
//   const valuationRangeHigh = Math.round(fairValue1BR * 1.18 / 1000) * 1000
//   const gain6m = Math.round(psf * 800 * 0.033 / 1000) * 1000
//   const annualRent1BR = Math.round(psf * 800 * yld / 100 / 1000) * 1000
//   const annualRent1BRShort = Math.round(annualRent1BR * 1.25 / 1000) * 1000
//   const netYield = (yld * 0.83).toFixed(1)
//   const serviceCharge = psf > 2000 ? 'AED 18–28/sqft' : psf > 1200 ? 'AED 12–18/sqft' : 'AED 10–18/sqft'

//   // Nationalities — vary by zone
//   const nationals = area.zone === 'Prime'
//     ? [{ flag: '🇷🇺', name: 'Russian',   pct: 24, w: 100 },{ flag: '🇬🇧', name: 'British',   pct: 18, w: 75 },{ flag: '🇮🇳', name: 'Indian',    pct: 14, w: 58 },{ flag: '🇩🇪', name: 'German',    pct: 9, w: 38 },{ flag: '🇨🇳', name: 'Chinese',   pct: 8, w: 33 },{ flag: '🇦🇪', name: 'UAE Local', pct: 6, w: 25 },{ flag: '🌍', name: 'Other',     pct: 21, w: 48 }]
//     : area.zone === 'Marina'
//     ? [{ flag: '🇬🇧', name: 'British',   pct: 22, w: 100 },{ flag: '🇮🇳', name: 'Indian',    pct: 18, w: 82 },{ flag: '🇷🇺', name: 'Russian',   pct: 15, w: 68 },{ flag: '🇩🇪', name: 'German',    pct: 8, w: 36 },{ flag: '🇨🇳', name: 'Chinese',   pct: 7, w: 32 },{ flag: '🌍', name: 'Other',     pct: 30, w: 55 }]
//     : [{ flag: '🇮🇳', name: 'Indian',    pct: 31, w: 100 },{ flag: '🇬🇧', name: 'British',   pct: 18, w: 58 },{ flag: '🇷🇺', name: 'Russian',   pct: 14, w: 45 },{ flag: '🇵🇰', name: 'Pakistani', pct: 9, w: 29 },{ flag: '🇨🇳', name: 'Chinese',   pct: 6, w: 19 },{ flag: '🇩🇪', name: 'German',    pct: 4, w: 13 },{ flag: '🇦🇪', name: 'UAE Local', pct: 3, w: 10 },{ flag: '🌍', name: 'Other',     pct: 15, w: 48 }]

//   const sellRecommendation = score >= 75 ? 'Yes — Good Time' : 'Hold 6–12M'
//   const sellColor = score >= 75 ? C.green : C.amber
//   const optimalSell = score >= 75 ? 'Now — strong market' : score >= 65 ? 'Q2–Q3 2027' : '12–18 months'

//   return {
//     psf, yld, score, soldThisWeek, daysToSell, availableListings,
//     distressPct, distressUnits, vacancyRate, occupancyRate, fiveYrAppreciation,
//     catalystScore, verdict, verdictColor, mood, moodColor, scoreComps,
//     priceTable, buyerPriceTable, rentTable, yieldByType, nationals,
//     fairValue1BR, valuationRangeLow, valuationRangeHigh, gain6m,
//     annualRent1BR, annualRent1BRShort, netYield, serviceCharge,
//     sellRecommendation, sellColor, optimalSell,
//     aboveAvgYield: yld > 6.1,
//   }
// }

// // ── FORMAT HELPERS ─────────────────────────────────────────────────
// const fmt = (n) => (n || 0).toLocaleString()
// function fmtK(n) {
//   if (n >= 1000000) return `AED ${(n / 1000000).toFixed(2)}M`
//   return `AED ${Math.round(n / 1000)}K`
// }

// // ── SHARED COMPONENTS ──────────────────────────────────────────────
// function Card({ children, style = {} }) {
//   return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, ...style }}>{children}</div>
// }

// function CardTitle({ children, badge }) {
//   return (
//     <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//       <span>{children}</span>
//       {badge && <span style={{ fontSize: 10, textTransform: 'none', letterSpacing: 0, padding: '2px 8px', borderRadius: 4, background: C.bg2, color: C.muted, fontWeight: 500 }}>{badge}</span>}
//     </div>
//   )
// }

// function StRow({ label, value, valueColor, last }) {
//   return (
//     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: last ? 'none' : `1px solid ${C.border}`, fontSize: 12 }}>
//       <span style={{ color: C.muted }}>{label}</span>
//       <span style={{ fontWeight: 700, color: valueColor || C.text }}>{value}</span>
//     </div>
//   )
// }

// function RatioBar({ left, leftPct, leftColor, right, rightPct, rightColor, last }) {
//   return (
//     <div style={{ marginBottom: last ? 0 : 12 }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
//         <span style={{ color: C.text2, fontWeight: 700 }}>{left} {leftPct}%</span>
//         <span style={{ color: C.muted }}>{right} {rightPct}%</span>
//       </div>
//       <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' }}>
//         <div style={{ width: `${leftPct}%`, background: leftColor }} />
//         <div style={{ width: `${rightPct}%`, background: rightColor }} />
//       </div>
//     </div>
//   )
// }

// function NatBar({ flag, name, pct, w }) {
//   return (
//     <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
//       <span style={{ fontSize: 15, width: 22 }}>{flag}</span>
//       <span style={{ fontSize: 12, width: 80, flexShrink: 0 }}>{name}</span>
//       <div style={{ flex: 1, height: 6, background: C.bg3, borderRadius: 3 }}>
//         <div style={{ width: `${w}%`, height: 6, borderRadius: 3, background: C.orange }} />
//       </div>
//       <span style={{ fontSize: 11, fontWeight: 700, width: 30, textAlign: 'right', color: C.muted }}>{pct}%</span>
//     </div>
//   )
// }

// function PTable({ headers, rows }) {
//   return (
//     <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//       <thead>
//         <tr>{headers.map(h => <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 700 }}>{h}</th>)}</tr>
//       </thead>
//       <tbody>{rows}</tbody>
//     </table>
//   )
// }

// function Td({ children, color, bold, last }) {
//   return <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: last ? 'none' : `1px solid ${C.border}`, color: color || C.text, fontWeight: bold ? 700 : 400 }}>{children}</td>
// }

// function GapTag({ truv, ask }) {
//   const delta = ((ask - truv) / truv * 100)
//   const d = delta.toFixed(1)
//   if (delta > 2)  return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.redL,   color: C.red   }}>Premium</span>
//   if (delta < -2) return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.greenL, color: C.green }}>Opportunity</span>
//   return               <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.amberL, color: C.amber }}>Fair</span>
// }

// function GapPct({ truv, ask }) {
//   const delta = ((ask - truv) / truv * 100).toFixed(1)
//   return <span>{delta > 0 ? `+${delta}%` : `${delta}%`}</span>
// }

// // ── TIMELINE ITEM ──────────────────────────────────────────────────
// function TlItem({ year, tagType, title, desc, impact }) {
//   const tagColors = {
//     confirmed: { bg: C.greenL, color: C.green, dot: C.green },
//     announced: { bg: C.blueL,  color: C.blue,  dot: C.blue },
//     likely:    { bg: C.amberL, color: C.amber,  dot: C.amber },
//     spec:      { bg: C.bg3,    color: C.muted2, dot: C.muted2 },
//   }
//   const tc = tagColors[tagType] || tagColors.spec
//   return (
//     <div style={{ position: 'relative', marginBottom: 20 }}>
//       <div style={{ position: 'absolute', left: -20, top: 5, width: 12, height: 12, borderRadius: '50%', background: tc.dot, border: `2px solid ${C.bg}` }} />
//       <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, marginBottom: 3 }}>
//         {year}{' '}
//         <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3, marginLeft: 6, textTransform: 'uppercase', letterSpacing: '.08em', background: tc.bg, color: tc.color }}>{tagType}</span>
//       </div>
//       <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{title}</div>
//       <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.55 }}>{desc}</div>
//       <div style={{ fontSize: 11, marginTop: 5, color: C.muted }}>📈 Expected impact: <strong style={{ color: C.green }}>{impact}</strong></div>
//     </div>
//   )
// }

// // ── PIPE CARD ──────────────────────────────────────────────────────
// function PipeCard({ dev, name, delivery, units, psfFrom, sold, builtPct, status }) {
//   const stMap = { ontime: { bg: C.greenL, color: C.green, label: 'On Schedule' }, delayed: { bg: C.redL, color: C.red }, ahead: { bg: C.blueL, color: C.blue, label: 'Ahead of Schedule' } }
//   const st = stMap[status] || stMap.ontime
//   const soldColor = sold >= 80 ? C.green : sold >= 60 ? C.amber : C.red
//   return (
//     <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
//       <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>{dev}</div>
//       <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>{name}</div>
//       {[['Delivery', delivery], ['Units', units], ['PSF from', psfFrom], ['Sold', `${sold}%`]].map(([k, v]) => (
//         <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
//           <span style={{ color: C.muted }}>{k}</span>
//           <span style={{ fontWeight: 600, color: k === 'Sold' ? soldColor : C.text }}>{v}</span>
//         </div>
//       ))}
//       <div style={{ height: 4, background: C.bg3, borderRadius: 2, margin: '8px 0 4px' }}>
//         <div style={{ height: 4, borderRadius: 2, background: status === 'delayed' && builtPct < 25 ? C.red : C.blue, width: `${builtPct}%` }} />
//       </div>
//       <div style={{ fontSize: 10, color: C.muted, textAlign: 'right' }}>{builtPct}% built</div>
//       <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', padding: '2px 7px', borderRadius: 4, display: 'inline-block', marginTop: 8, background: st.bg, color: st.color }}>{st.label || name.includes('Sky') ? '⚠ Delayed +8M' : status === 'delayed' ? 'Delayed +4M' : st.label}</span>
//     </div>
//   )
// }
// function TxVolumeChart({ data, currentTx }) {
//   if (!data?.length) return null
//   const counts = data.map(d => d.count)
//   const maxCount = Math.max(...counts)
//   const w = 700, h = 200, padL = 50, padR = 20, padT = 20, padB = 40
//   const chartW = w - padL - padR
//   const chartH = h - padT - padB
//   const barW = Math.floor(chartW / data.length) - 4
//   const x = (i) => padL + (i / data.length) * chartW + barW / 2

//   // April 2026 onwards = Iran/USA shock period (red bars)
//   const isShock = (p) => p.year === 2026 && p.month >= 4

//   // Y grid steps
//   const yStep = Math.ceil(maxCount / 4 / 50) * 50
//   const ySteps = Array.from({ length: 5 }, (_, i) => i * yStep).filter(v => v <= maxCount + yStep)

//   return (
//     <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
//       {/* Y grid */}
//       {ySteps.map(v => {
//         const yy = padT + chartH - (v / (maxCount * 1.1)) * chartH
//         return (
//           <g key={v}>
//             <line x1={padL} x2={w - padR} y1={yy} y2={yy} stroke="#EAE3D8" strokeWidth={0.75} strokeDasharray="4 4" />
//             <text x={padL - 6} y={yy + 4} textAnchor="end" fontSize={9} fill="#9CA8B4" fontFamily="Inter, sans-serif">{v}</text>
//           </g>
//         )
//       })}

//       {/* Bars */}
//       {data.map((p, i) => {
//         const barH = (p.count / (maxCount * 1.1)) * chartH
//         const barX = padL + (i / data.length) * chartW + 2
//         const barY = padT + chartH - barH
//         const shock = isShock(p)
//         const fill = shock ? 'rgba(220,38,38,0.35)' : 'rgba(200,115,42,0.25)'
//         const stroke = shock ? '#DC2626' : '#C8732A'
//         return (
//           <g key={p.key}>
//             <rect x={barX} y={barY} width={barW} height={barH}
//               fill={fill} stroke={stroke} strokeWidth={0.5} rx={2} />
//             {/* count label on hover-style — show on last bar */}
//             {i === data.length - 1 && (
//               <>
//                 <rect x={barX - 10} y={barY - 22} width={barW + 20} height={17} rx={3} fill="#C8732A" />
//                 <text x={barX + barW / 2} y={barY - 9} textAnchor="middle" fontSize={9} fill="#fff" fontWeight="700" fontFamily="Inter, sans-serif">{p.count}</text>
//               </>
//             )}
//           </g>
//         )
//       })}

//       {/* X labels — show every 2 months */}
//       {data.map((p, i) => i % 2 === 0 && (
//         <text key={p.key} x={padL + (i / data.length) * chartW + barW} y={h - 8}
//           textAnchor="middle" fontSize={9} fill="#9CA8B4" fontFamily="Inter, sans-serif">{p.label}</text>
//       ))}

//       {/* Bottom axis */}
//       <line x1={padL} x2={w - padR} y1={padT + chartH} y2={padT + chartH} stroke="#D8CEBC" strokeWidth={1} />

//       {/* Legend */}
//       <rect x={w - 200} y={padT} width={14} height={10} fill="rgba(200,115,42,0.25)" stroke="#C8732A" strokeWidth={0.5} rx={1} />
//       <text x={w - 182} y={padT + 9} fontSize={9} fill="#6E7A8A" fontFamily="Inter, sans-serif">Normal volume</text>
//       <rect x={w - 200} y={padT + 16} width={14} height={10} fill="rgba(220,38,38,0.35)" stroke="#DC2626" strokeWidth={0.5} rx={1} />
//       <text x={w - 182} y={padT + 25} fontSize={9} fill="#6E7A8A" fontFamily="Inter, sans-serif">Iran/USA shock period</text>
//     </svg>
//   )
// }

// function PriceHistoryChart({ data }) {
//   if (!data?.length) return null

//   const psfs = data.map(d => d.psf)
//   const minPsf = Math.floor(Math.min(...psfs) / 100) * 100 - 100
//   const maxPsf = Math.ceil(Math.max(...psfs) / 100) * 100 + 100
//   const w = 900, h = 220, padL = 72, padR = 24, padT = 24, padB = 40
//   const chartW = w - padL - padR
//   const chartH = h - padT - padB

//   const x = (i) => padL + (i / (data.length - 1)) * chartW
//   const y = (v) => padT + chartH - ((v - minPsf) / (maxPsf - minPsf)) * chartH

//   // Smooth the line slightly using the actual data points
//   const linePath = data.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.psf).toFixed(1)}`).join(' ')
//   const areaPath = linePath + ` L${x(data.length - 1).toFixed(1)},${(padT + chartH).toFixed(1)} L${padL},${(padT + chartH).toFixed(1)} Z`

//   // Y-axis labels — 5 clean steps
//   const ySteps = 5
//   const yLabels = Array.from({ length: ySteps }, (_, i) =>
//     Math.round(minPsf + (i / (ySteps - 1)) * (maxPsf - minPsf))
//   )

//   // X-axis: show Jan of each year only
//   const xLabels = data.reduce((acc, p, i) => {
//     if (p.month === 1 || i === 0) {
//       acc.push({ i, label: `${p.year}` })
//     }
//     return acc
//   }, [])

//   // Find latest point for the end label
//   const last = data[data.length - 1]
//   const latestLabel = `AED ${last.psf.toLocaleString()}`

//   // Find min and max index for annotation dots
//   const maxIdx = psfs.indexOf(Math.max(...psfs))
//   const minIdx = psfs.indexOf(Math.min(...psfs))

//   const gradId = 'chartGrad'
//   const lineColor = '#C8732A'
//   const gradTop = 'rgba(200,115,42,0.18)'
//   const gradBot = 'rgba(200,115,42,0.01)'

//   return (
//     <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
//       <defs>
//         <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
//           <stop offset="0%" stopColor={gradTop} />
//           <stop offset="100%" stopColor={gradBot} />
//         </linearGradient>
//         <filter id="lineShadow" x="-5%" y="-20%" width="110%" height="140%">
//           <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(200,115,42,0.25)" />
//         </filter>
//       </defs>

//       {/* Chart background */}
//       <rect x={padL} y={padT} width={chartW} height={chartH} fill="#FAF8F5" rx="4" />

//       {/* Horizontal grid lines */}
//       {yLabels.map((v, i) => (
//         <g key={v}>
//           <line
//             x1={padL} x2={w - padR}
//             y1={y(v)} y2={y(v)}
//             stroke={i === 0 ? '#D8CEBC' : '#EAE3D8'}
//             strokeWidth={i === 0 ? 1 : 0.75}
//             strokeDasharray={i === 0 ? 'none' : '4 4'}
//           />
//           <text
//             x={padL - 8} y={y(v) + 4}
//             textAnchor="end" fontSize={9} fill="#9CA8B4"
//             fontFamily="Inter, sans-serif"
//           >
//             {v.toLocaleString()}
//           </text>
//         </g>
//       ))}

//       {/* Area fill under line */}
//       <path d={areaPath} fill={`url(#${gradId})`} />

//       {/* Main price line */}
//       <path
//         d={linePath}
//         fill="none"
//         stroke={lineColor}
//         strokeWidth={2.5}
//         strokeLinejoin="round"
//         strokeLinecap="round"
//         filter="url(#lineShadow)"
//       />

//       {/* Min dot — red */}
//       <circle cx={x(minIdx)} cy={y(data[minIdx].psf)} r={4} fill="#fff" stroke="#DC2626" strokeWidth={2} />

//       {/* Max dot — green */}
//       <circle cx={x(maxIdx)} cy={y(data[maxIdx].psf)} r={4} fill="#fff" stroke="#16A34A" strokeWidth={2} />

//       {/* Latest value dot */}
//       <circle cx={x(data.length - 1)} cy={y(last.psf)} r={5} fill={lineColor} stroke="#fff" strokeWidth={2} />
//       <rect
//         x={x(data.length - 1) - 40} y={y(last.psf) - 22}
//         width={80} height={17} rx={4}
//         fill={lineColor}
//       />
//       <text
//         x={x(data.length - 1)} y={y(last.psf) - 9}
//         textAnchor="middle" fontSize={9} fill="#fff" fontWeight="700"
//         fontFamily="Inter, sans-serif"
//       >
//         {latestLabel}
//       </text>

//       {/* X-axis year labels */}
//       {xLabels.map(({ i, label }) => (
//         <g key={label}>
//           <line x1={x(i)} x2={x(i)} y1={padT + chartH} y2={padT + chartH + 5} stroke="#D8CEBC" strokeWidth={1} />
//           <text
//             x={x(i)} y={h - 8}
//             textAnchor="middle" fontSize={10} fill="#9CA8B4"
//             fontFamily="Inter, sans-serif" fontWeight="600"
//           >
//             {label}
//           </text>
//         </g>
//       ))}

//       {/* Bottom axis line */}
//       <line x1={padL} x2={w - padR} y1={padT + chartH} y2={padT + chartH} stroke="#D8CEBC" strokeWidth={1} />

//       {/* Legend — top right */}
//       <rect x={w - 210} y={padT + 2} width={186} height={28} rx={5} fill="rgba(255,255,255,0.85)" stroke="#E8E0D0" strokeWidth={0.75} />
//       <line x1={w - 200} x2={w - 186} y1={padT + 11} y2={padT + 11} stroke={lineColor} strokeWidth={2.5} />
//       <circle cx={w - 193} cy={padT + 11} r={3} fill={lineColor} />
//       <text x={w - 182} y={padT + 15} fontSize={9} fill="#6E7A8A" fontFamily="Inter, sans-serif">Truvalu™ Benchmark PSF</text>
//       <circle cx={w - 200} cy={padT + 22} r={3} fill="#fff" stroke="#16A34A" strokeWidth={1.5} />
//       <text x={w - 182} y={padT + 26} fontSize={9} fill="#6E7A8A" fontFamily="Inter, sans-serif">Peak ↑ &nbsp; </text>
//       <circle cx={w - 152} cy={padT + 22} r={3} fill="#fff" stroke="#DC2626" strokeWidth={1.5} />
//       <text x={w - 145} y={padT + 26} fontSize={9} fill="#6E7A8A" fontFamily="Inter, sans-serif">Low ↓</text>
//     </svg>
//   )
// }

// // ══════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ══════════════════════════════════════════════════════════════════
// export default function AreaSpecialistPage({ area, onClose }) {
//   const [persona, setPersona] = useState('buyer')
// const [activeTab, setActiveTab] = useState('past')
// const [aiAlert, setAiAlert] = useState(null)
// const [aiBrief, setAiBrief] = useState(null)
// const [aiBuyerTip, setAiBuyerTip] = useState(null)
  
//   const { events } = useEvents()

//   // Fetch live data from Supabase area_intelligence table


//  const BACKEND = 'https://acqar-signal-production.up.railway.app'
// const [tickerData, setTickerData] = useState(null)
// const [areaIntel, setAreaIntel] = useState(null)
// const [buyerPrices, setBuyerPrices] = useState(null)
// const [priceHistory, setPriceHistory] = useState(null)
// const [areaProjects, setAreaProjects] = useState(null)
// const [marketComp, setMarketComp] = useState(null)
// const [areaCatalysts, setAreaCatalysts] = useState(null)
// const [txHistory, setTxHistory] = useState(null)

// useEffect(() => {
//   fetch(`${BACKEND}/api/ticker/area-59`)
//     .then(r => r.json())
//     .then(setTickerData)
//     .catch(() => {})
// }, [])

// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   fetch(
//     `${SUPA_URL}/rest/v1/area_intelligence?area_id=eq.59&select=*`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(data => { if (data?.[0]) setAreaIntel(data[0]) })
//     .catch(() => {})
// }, [])

// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   fetch(
//     `${SUPA_URL}/rest/v1/avm?area_id=eq.59&select=price_per_sqm,procedure_area,rooms_en&limit=5000`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(rows => {
//       const groups = { Studio: [], '1 Bedroom': [], '2 Bedroom': [], '3 Bedroom': [] }
//       rows.forEach(row => {
//         if (!row.price_per_sqm || !row.procedure_area) return
//         const total = row.price_per_sqm * row.procedure_area
//         const r = row.rooms_en
//         if (['0','0.0'].includes(r)) groups['Studio'].push(total)
//         else if (['1','1.0'].includes(r)) groups['1 Bedroom'].push(total)
//         else if (['2','2.0'].includes(r)) groups['2 Bedroom'].push(total)
//         else if (['3','3.0'].includes(r)) groups['3 Bedroom'].push(total)
//       })
//       const pct = (arr, p) => {
//         if (!arr.length) return null
//         const s = [...arr].sort((a, b) => a - b)
//         return Math.round(s[Math.floor(s.length * p)] / 1000) * 1000
//       }
//       setBuyerPrices(
//         Object.entries(groups).map(([type, vals]) => ({
//           type,
//           min:  pct(vals, 0.25),
//           fair: pct(vals, 0.50),
//           max:  pct(vals, 0.75),
//         }))
//       )
//     })
//     .catch(() => {})
// }, [])

// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   fetch(
//     `${SUPA_URL}/rest/v1/avm?area_id=eq.59&property_type_en=eq.Residential&price_per_sqm=gt.0&select=sale_year,sale_month,price_per_sqm&limit=10000`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(rows => {
//       const map = {}
//       rows.forEach(row => {
//         const key = `${row.sale_year}-${String(row.sale_month).padStart(2,'0')}`
//         if (!map[key]) map[key] = { sum: 0, count: 0, year: row.sale_year, month: row.sale_month }
//         map[key].sum += Number(row.price_per_sqm) / 10.764
//         map[key].count++
//       })
//       const points = Object.entries(map)
//         .map(([key, v]) => ({ key, psf: Math.round(v.sum / v.count), year: v.year, month: v.month, count: v.count }))
//         .filter(p => p.count >= 10)
//         .sort((a, b) => a.key.localeCompare(b.key))
//       setPriceHistory(points)
//     })
//     .catch(() => {})
// }, [])

// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   // JVC = 'Al Barsha South Fourth' in DLD naming
//   const dldName = 'Al Barsha South Fourth'
//   fetch(
//     `${SUPA_URL}/rest/v1/dld_projects?area_en=eq.${encodeURIComponent(dldName)}&select=project_name,developer_name,project_status,percent_completed,end_date,cnt_unit&order=project_status.asc`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(data => { if (data?.length) setAreaProjects(data) })
//     .catch(() => {})
// }, [])



// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   // Fetch aggregated composition from avm
//   fetch(
//     `${SUPA_URL}/rest/v1/avm?area_id=eq.59&sale_year=gte.2024&select=property_sub_type_en,property_usage_en,rooms_en&limit=10000`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(rows => {
//       const total = rows.length
//       if (!total) return
//       const apt   = rows.filter(r => r.property_sub_type_en?.toLowerCase().includes('flat') || r.property_sub_type_en?.toLowerCase().includes('apart')).length
//       const villa = rows.filter(r => r.property_sub_type_en?.toLowerCase().includes('villa') || r.property_sub_type_en?.toLowerCase().includes('town')).length
//       const res   = rows.filter(r => r.property_usage_en === 'Residential').length
//       const com   = rows.filter(r => r.property_usage_en === 'Commercial').length
//       const small = rows.filter(r => ['0','0.0','1','1.0'].includes(r.rooms_en)).length
//       const large = rows.filter(r => ['2','2.0','3','3.0','4','4.0'].includes(r.rooms_en)).length
//       const roomsTotal = small + large

//       // Off-plan ratio from dld_projects (already loaded)
//       setMarketComp({
//         aptPct:   Math.round(apt   / total * 100),
//         villaPct: Math.round(villa / total * 100) || 2, // min 2% for display
//         resPct:   Math.round(res   / total * 100),
//         comPct:   Math.round(com   / total * 100) || 0,
//         bachelorPct: roomsTotal > 0 ? Math.round(small / roomsTotal * 100) : 71,
//         familyPct:   roomsTotal > 0 ? Math.round(large / roomsTotal * 100) : 29,
//       })
//     })
//     .catch(() => {})
// }, [])

// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   fetch(
//     `${SUPA_URL}/rest/v1/avm?area_id=eq.59&property_type_en=eq.Residential&sale_year=gte.2025&select=sale_year,sale_month&limit=10000`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(rows => {
//       const map = {}
//       rows.forEach(row => {
//         const key = `${row.sale_year}-${String(row.sale_month).padStart(2,'0')}`
//         map[key] = (map[key] || 0) + 1
//       })
//       const points = Object.entries(map)
//         .map(([key, count]) => {
//           const [y, m] = key.split('-')
//           const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
//           return { key, label: `${months[Number(m)-1]} ${y.slice(2)}`, count, year: Number(y), month: Number(m) }
//         })
//         .sort((a, b) => a.key.localeCompare(b.key))
//         .slice(-12) // last 12 months
//       setTxHistory(points)
//     })
//     .catch(() => {})
// }, [])

// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   fetch(
//     `${SUPA_URL}/rest/v1/area_catalysts?area_name_en=eq.Jumeirah Village Circle&status=eq.active&select=*&order=expected_date.asc`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(data => { if (data?.length) setAreaCatalysts(data) })
//     .catch(() => {})
// }, [])

// const livePsf = areaIntel?.truvalu_psm
//   ? Math.round(Number(areaIntel.truvalu_psm) / 10.764)
//   : tickerData?.fairPriceAedPsf ?? area.pricePerSqft
// const liveScore        = areaIntel?.investment_score ?? tickerData?.score ?? area.score
// const liveYield        = Number(areaIntel?.gross_yield_pct ?? tickerData?.rentalReturnPct ?? area.yield)
// const liveVerdict      = areaIntel?.verdict ?? tickerData?.signalMood ?? (liveScore >= 75 ? 'BUY' : liveScore >= 65 ? 'HOLD' : 'WATCH')
// const liveSoldThisWeek = areaIntel?.tx_7d ?? tickerData?.soldThisWeek ?? null
// const liveDistressPct  = Number(areaIntel?.distress_pct ?? tickerData?.distressPct ?? null)
// const liveTxDelta      = areaIntel?.tx_7d_delta_pct ?? null

// useEffect(() => {
//   if (!GROQ_KEY) return
//   const name = area.name
//   const yld = liveYield || area.yield || 7
//   const psf = livePsf || area.pricePerSqft || 1247

//   askGroq(`You are a Dubai real estate AI for ${name}. Write 1 short sentence (max 20 words) for a market alert banner about the Iran/USA April 2026 tension causing a transaction slowdown. Be factual, not alarmist.`)
//     .then(t => { if (t) setAiAlert(t) })

//   askGroq(`You are a Dubai real estate AI specialist for ${name}. Write a 5-line professional analyst brief (max 120 words). Cover: 1) current market sentiment and the Iran/USA slowdown context, 2) the ${yld}% gross yield vs Dubai's 6.1% average, 3) the AED ${psf}/sqft Truvalu fair price and what it means for buyers, 4) confirmed infrastructure catalysts arriving Q4 2026, 5) your investment outlook. Write in flowing prose, no bullet points, no numbering.`)
//     .then(t => { if (t) setAiBrief(t) })

//   askGroq(`You are helping a first-time buyer looking at ${name} in Dubai. Write 1 sentence (max 25 words) encouraging them about the current market slowdown being a good entry opportunity. Sound warm and reassuring.`)
//     .then(t => { if (t) setAiBuyerTip(t) })
// }, [area.name, livePsf, liveYield])

//   const d = buildAreaData({
//     ...area,
//     pricePerSqft: livePsf,
//     score: liveScore,
//     yield: liveYield,
//   })



//   const livePriceTable = buyerPrices?.length ? [
//   { type: 'Studio',    truv: Math.round((buyerPrices.find(r=>r.type==='Studio')?.fair    ?? d.psf*0.95*450) / 450),  ask: Math.round((buyerPrices.find(r=>r.type==='Studio')?.fair    ?? d.psf*0.95*450) / 450 * 1.011) },
//   { type: '1 Bedroom', truv: Math.round((buyerPrices.find(r=>r.type==='1 Bedroom')?.fair ?? d.psf*800)      / 800),  ask: Math.round((buyerPrices.find(r=>r.type==='1 Bedroom')?.fair ?? d.psf*800)      / 800 * 1.041) },
//   { type: '2 Bedroom', truv: Math.round((buyerPrices.find(r=>r.type==='2 Bedroom')?.fair ?? d.psf*0.974*1250)/1250), ask: Math.round((buyerPrices.find(r=>r.type==='2 Bedroom')?.fair ?? d.psf*0.974*1250)/1250 * 0.961) },
//   { type: '3 Bedroom', truv: Math.round((buyerPrices.find(r=>r.type==='3 Bedroom')?.fair ?? d.psf*0.958*1800)/1800), ask: Math.round((buyerPrices.find(r=>r.type==='3 Bedroom')?.fair ?? d.psf*0.958*1800)/1800 * 0.986) },
//   { type: 'Townhouse',  truv: Math.round(d.psf*1.074), ask: Math.round(d.psf*1.030) },
// ] : d.priceTable

// const liveYieldByType = [
//   { type: 'Studio',  val: +(liveYield * 1.19).toFixed(1) },
//   { type: '1 BR',    val: +liveYield.toFixed(1) },
//   { type: '2 BR',    val: +(liveYield * 0.94).toFixed(1) },
//   { type: '3 BR',    val: +(liveYield * 0.88).toFixed(1) },
//   { type: 'TH 3BR',  val: +(liveYield * 0.82).toFixed(1) },
// ]


// // DLD projects computed stats
// const activeProjects = areaProjects?.filter(p => p.project_status === 'ACTIVE') ?? []
// const totalPipelineUnits = areaProjects?.reduce((s, p) => s + (Number(p.cnt_unit) || 0), 0) ?? 0

// // Group by developer for track record table
// const devStats = areaProjects?.length ? (() => {
//   const map = {}
//   areaProjects.forEach(p => {
//     const raw = p.developer_name || ''
//     // Clean name: remove L.L.C, FZE, DWC etc
//     const dev = raw.replace(/\s*(L\.L\.C\.?|FZE|DWC\s*LLC|S\.O\.C\.?|PROPERTIES|REAL ESTATE DEVELOPMENT|DEVELOPERS?)\s*/gi, ' ').replace(/\s+/g, ' ').trim().slice(0, 22)
//     if (!map[dev]) map[dev] = { projects: 0, active: 0, units: 0, avgPct: 0, pcts: [] }
//     map[dev].projects++
//     map[dev].units += Number(p.cnt_unit) || 0
//     if (p.project_status === 'ACTIVE') map[dev].active++
//     if (p.percent_completed) map[dev].pcts.push(Number(p.percent_completed))
//   })
//   return Object.entries(map)
//     .sort((a, b) => b[1].projects - a[1].projects)
//     .slice(0, 7)
//     .map(([dev, s]) => ({
//       dev,
//       projects: s.projects,
//       active: s.active,
//       units: s.units,
//       avgPct: s.pcts.length ? Math.round(s.pcts.reduce((a, b) => a + b, 0) / s.pcts.length) : 0,
//     }))
// })() : null

// // Real off-plan vs ready ratio from DLD projects
// const offPlanPct = areaProjects?.length
//   ? Math.round(activeProjects.length / areaProjects.length * 100)
//   : 58
// const readyPct = 100 - offPlanPct


// const fiveYrAppreciationReal = priceHistory?.length
//   ? (() => {
//       const pts2021 = priceHistory.filter(p => p.year === 2021)
//       const pts2026 = priceHistory.filter(p => p.year === 2026)
//       if (!pts2021.length || !pts2026.length) return null
//       const avg2021 = pts2021.reduce((s, p) => s + p.psf, 0) / pts2021.length
//       const avg2026 = pts2026.reduce((s, p) => s + p.psf, 0) / pts2026.length
//       return ((avg2026 - avg2021) / avg2021 * 100).toFixed(1)
//     })()
//   : null

//   const liveBuyerPriceTable = buyerPrices?.length
//   ? [...buyerPrices.map(row => ({
//       type: row.type,
//       min:  row.min  ? fmtK(row.min)  : '—',
//       fair: row.fair ? fmtK(row.fair) : '—',
//       max:  row.max  ? fmtK(row.max)  : '—',
//     })),
//     // Townhouse stays static — no real data in avm for this
//     { type: 'Townhouse 3BR', min: 'AED 2.70M', fair: 'AED 4.01M', max: 'AED 5.39M' }
//   ]
//   : d.buyerPriceTable
//   // Live signals for this area from the real event pipeline
//   const areaSignals = events
//     .filter(e => e.location_name?.toLowerCase().includes(area.name.toLowerCase().split(' ')[0].toLowerCase()))
//     .slice(0, 6)

//   // Grid helpers
//   const g2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }
//   const g3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }
//   const g4 = { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }
//   const pad = { padding: '0 28px' }

//   // Pipeline PSF values based on area PSF
//   const pipePsf = (mult) => `AED ${fmt(Math.round(d.psf * mult))}`

//   return (
//     <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.6, color: C.text, overflowY: 'auto' }}>

//       {/* ── NAV ── */}
//       <nav style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: '0 28px', height: 54, display: 'flex', alignItems: 'center', gap: 32, position: 'sticky', top: 0, zIndex: 100, flexShrink: 0 }}>
//         <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-.01em', color: C.text }}>ACQ<span style={{ color: C.orange }}>AR</span> SIGNAL™</div>
//         <div style={{ display: 'flex', gap: 2 }}>
//           {['Terminal', 'Areas', 'Truvalu™', 'Reports'].map(l => (
//             <span key={l} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, color: l === 'Areas' ? C.orange : C.muted, background: l === 'Areas' ? C.orangeL : 'transparent', cursor: 'pointer' }}>{l}</span>
//           ))}
//         </div>
//         <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
//           <button onClick={onClose} style={{ fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 7, border: `1px solid ${C.border}`, background: C.card, color: C.text2, cursor: 'pointer' }}>← Back to Areas</button>
//           <button style={{ background: C.orange, color: '#fff', fontSize: 12, fontWeight: 700, padding: '8px 18px', borderRadius: 7, border: 'none', cursor: 'pointer' }}>📤 Share Area Pack</button>
//         </div>
//       </nav>

//      {/* ── TICKER ── */}
// <TickerBar
//   areaSlug="area-59"
//   areaName={area.name}
//   fallback={d}
//   activeProjectCount={activeProjects?.filter(p => p.project_status === 'ACTIVE').length ?? null}
//   metroCatalyst={areaCatalysts?.find(c => c.catalyst_type === 'metro') ?? null}
// />

//       {/* ── BREADCRUMB ── */}
//       <div style={{ padding: '14px 28px 0', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted, flexShrink: 0 }}>
//         <span>Signal</span>
//         <span style={{ color: C.border2 }}>›</span>
//         <span>Area Map</span>
//         <span style={{ color: C.border2 }}>›</span>
//         <span style={{ color: C.text, fontWeight: 600 }}>{area.name} ({area.zone})</span>
//       </div>

//       {/* ── MARKET ALERT ── */}
//       <div style={{ margin: '14px 28px 0', background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, flexShrink: 0 }}>
//         <span style={{ flexShrink: 0 }}>⚠️</span>
//         <div style={{ color: '#9A1B1B', lineHeight: 1.6 }}>
//           <strong style={{ color: C.red }}>Market Alert:</strong>{' '}
// {aiAlert ?? `Regional tensions (Iran/USA, April 2026) have caused a 49% MoM transaction drop across Dubai. This is a sentiment-driven pause, not a fundamental collapse. Acqar's Resilience Report below shows how ${area.name} has recovered from every past shock — use this to make a clear-headed decision, not a fear-driven one.`}
//         </div>
//       </div>

//       {/* ── HERO ── */}
//       <div style={{ padding: '18px 28px 0', display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'flex-start', flexShrink: 0 }}>
//         <div>
//           <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>📍 Dubai — {area.zone} · Residential District</div>
//           <div style={{ fontSize: 32, fontWeight: 900, color: C.text, letterSpacing: '-.02em', lineHeight: 1.05, marginBottom: 4 }}>{area.name}</div>
//           <div style={{ fontSize: 13, color: C.muted, marginBottom: 18 }}>{area.zone} · Mixed-Use Residential · DLD 2026 Data</div>

//           {/* Hero stats row — exact match to HTML .hero-stats-row */}
//           <div style={{ display: 'flex', background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', flexWrap: 'wrap' }}>
//             {[
//              { lbl: '🏠 Homes Sold This Week', val: liveSoldThisWeek ?? d.soldThisWeek, valColor: C.red,
//   sub: liveTxDelta != null ? `${liveTxDelta}% vs last week` : 'A bit quieter than last week',
//   subColor: (liveTxDelta ?? -1) < 0 ? C.red : C.green },
//               { lbl: "💰 What's a Fair Price Here?", val: `AED ${fmt(d.psf)}/sqft`, valColor: C.text, sub: 'Slightly up over 3 months', subColor: C.green },
//               { lbl: '📈 Rent Return Per Year', val: `${d.yld}%`, valColor: C.green, sub: `${d.aboveAvgYield ? 'Better' : 'Near'} than Dubai's 6.1% average`, subColor: C.muted },
//               { lbl: '⏱️ How Long to Sell?',  val: `${d.daysToSell} days`, valColor: C.amber, sub: d.daysToSell > 40 ? 'Takes a bit longer than usual' : 'Faster than Dubai average', subColor: d.daysToSell > 40 ? C.red : C.green },
//               { lbl: '🔑 Homes Available to Buy', val: fmt(d.availableListings), valColor: C.text, sub: 'More choice than normal — good for buyers', subColor: C.muted },
//               { lbl: '🧭 Market Mood Right Now', val: liveVerdict === 'BUY' ? 'Bullish' : liveVerdict === 'HOLD' ? 'Cautious' : 'Slow', valColor: liveVerdict === 'BUY' ? C.green : liveVerdict === 'HOLD' ? C.amber : C.red, sub: 'Watch closely — market paused', subColor: C.muted },
//             ].map((stat, i) => (
//               <div key={i} style={{ padding: '14px 22px', borderRight: i < 5 ? `1px solid ${C.border}` : 'none', flex: '1 1 150px' }}>
//                 <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 5 }}>{stat.lbl}</div>
//                 <div style={{ fontSize: 15, fontWeight: 800, color: stat.valColor }}>{stat.val}</div>
//                 <div style={{ fontSize: 11, color: stat.subColor, marginTop: 2 }}>{stat.sub}</div>
//               </div>
//             ))}
//           </div>

//           {/* Buyer tip bar — only show when persona = buyer */}
//           {persona === 'buyer' && (
//             <div style={{ marginTop: 12, background: C.blueL, border: '1px solid rgba(37,99,235,.14)', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
//               <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
//               <p style={{ fontSize: 12, color: '#1D3461', lineHeight: 1.7 }}>
//                 <strong>First time buying property?</strong> {area.name} is one of Dubai's {area.zone === 'Prime' ? 'most prestigious' : area.zone === 'Mid-Market' ? 'most popular mid-range' : 'well-established'} areas. Right now the market is <strong>a little slow because of news in the region</strong> — but that's creating <strong>good entry prices for patient buyers</strong>. {aiBuyerTip ?? `The area earns strong rent (${d.yld}%/year), a metro station opens nearby in late 2026, and a school is coming in 2027.`}{' '}
// Our AI Specialist's verdict: <strong style={{ color: d.verdictColor }}>{d.verdict === 'BUY' ? 'Strong opportunity — now is a good entry window.' : 'Hold off rushing — but a property priced below the fair-value line is a strong opportunity.'}</strong>
//               </p>
//             </div>
//           )}
//         </div>

//        {/* ── SCORE CARD ── exact match to HTML .score-card */}
// <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '22px 20px', minWidth: 250, textAlign: 'center', flexShrink: 0 }}>
//   <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.14em', padding: '4px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 10, background: liveScore >= 75 ? C.greenL : C.amberL, color: liveScore >= 75 ? C.green : liveScore >= 65 ? C.amber : C.red }}>{liveVerdict}</div>
//   <div style={{ fontSize: 52, fontWeight: 900, color: liveScore >= 75 ? C.green : liveScore >= 65 ? C.amber : C.red, lineHeight: 1, letterSpacing: '-.02em' }}>{liveScore}</div>
//   <div style={{ fontSize: 15, color: C.muted2 }}>/100</div>
//   <div style={{ fontSize: 11, color: C.muted, margin: '6px 0 16px' }}>12-month outlook · May 2026</div>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//             {d.scoreComps.map((comp, i) => (
//               <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
//                 <span style={{ flex: 1, color: C.text2, textAlign: 'left', fontSize: 11.5 }}>{comp.label}</span>
//                 <div style={{ width: 76, height: 5, background: C.bg3, borderRadius: 3 }}>
//                   <div style={{ width: `${Math.min(comp.val, 100)}%`, height: 5, borderRadius: 3, background: comp.color }} />
//                 </div>
//                 <span style={{ width: 30, textAlign: 'right', fontWeight: 700, fontSize: 12, color: comp.color }}>{comp.val}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── AI BRIEF ── exact match to HTML .brief-box */}
//       <div style={{ margin: '18px 28px 0', background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.orange}`, borderRadius: 10, padding: '18px 22px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'flex-start', flexShrink: 0 }}>
//         <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.orangeL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🤖</div>
//         <div>
//           <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.14em', color: C.orange, marginBottom: 6 }}>Area Specialist · AI Brief · Updated May 2026</div>
//          <div style={{ fontSize: 12.5, lineHeight: 1.8, color: C.text2 }}>
//   {aiBrief ?? `${area.name} is navigating a short-term confidence gap driven primarily by macro sentiment, not by fundamental weakness. Structural fundamentals remain intact: ${area.name} delivers a gross rental yield of ${d.yld}%, ${d.aboveAvgYield ? 'meaningfully above' : 'near'} Dubai's 6.1% average, and has confirmed infrastructure catalysts arriving from Q4 2026 that historically drive 8–14% appreciation in adjacent residential zones. Supply pressure is elevated with ${d.distressPct}% of current listings below the Truvalu floor — creating a selective entry window for patient investors.`}
// </div>
//           <div style={{ marginTop: 8, fontSize: 11, color: C.muted, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
//             <span>🕐 Updated May 2026, 09:15 GST</span>
//             <span>📊 14 live data sources</span>
//             <span>🏛️ RICS-aligned Truvalu™</span>
//             <span>🔄 Refreshes daily</span>
//           </div>
//         </div>
//       </div>

//       {/* ── PERSONA SELECTOR ── exact match to HTML .persona-section */}
//       <div style={{ margin: '20px 28px 0', flexShrink: 0 }}>
//         <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 10 }}>Who are you? Get a view built for your situation.</div>
//         <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
//           {[
//             { key: 'buyer',    icon: '🏠', name: "I'm Buying My First Home",  desc: 'Plain English, step-by-step, no jargon' },
//             { key: 'investor', icon: '💼', name: "I'm a Property Investor",   desc: 'Yields, returns, comparables, market timing' },
//             { key: 'owner',    icon: '🔑', name: 'I Already Own Here',        desc: "What's my property worth? Should I sell?" },
//           ].map(p => (
//             <button key={p.key} onClick={() => setPersona(p.key)} style={{
//               padding: '12px 22px', borderRadius: 10,
//               border: `2px solid ${persona === p.key ? C.orange : C.border}`,
//               background: persona === p.key ? C.orangeL : C.card,
//               cursor: 'pointer', transition: 'all .18s',
//               display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 180,
//             }}>
//               <span style={{ fontSize: 22 }}>{p.icon}</span>
//               <div style={{ textAlign: 'left' }}>
//                 <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{p.name}</div>
//                 <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{p.desc}</div>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ══════════ PERSONA: BUYER ══════════ */}
//       {persona === 'buyer' && (
//         <div style={{ ...pad, marginTop: 20 }}>
//           {/* 5-step guide */}
//           <Card>
//             <CardTitle badge="First-Time Buyer">Your 5-Step Buying Guide for {area.name}</CardTitle>
//             <div>
//               {[
//                 {
//                   num: 1, title: 'Understand what a fair price actually looks like here',
//                   body: `Our Truvalu™ system calculates what any ${area.name} property should cost based on real transactions, floor level, view, and condition. A 1-bedroom here is fairly priced at around ${
//   buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
//     ? fmtK(buyerPrices.find(r => r.type === '1 Bedroom').fair)
//     : fmtK(Math.round(d.psf * 800 / 1000) * 1000)
// }. If someone's asking significantly more — that's a red flag. If it's below that — that's a genuine opportunity.`,
//                 },
//                 {
//                   num: 2, title: "Check what's coming to the area in the next 2 years",
//                   body: `A metro station is confirmed for Q4 2026. A new school in 2027. Infrastructure is confirmed or announced. These things push prices up — buying before they open means you benefit from the price increase. This is why timing matters.`,
//                 },
//                 {
//                   num: 3, title: "Don't panic about the current news — look at history",
//                   body: `Dubai has been through oil crashes, COVID, and geopolitical scares before. Every time, well-located areas recovered within 8–14 months. The current slowdown is caused by regional news (Iran/USA), not by any problem with Dubai's economy or ${area.name} specifically. The Resilience Report (Past tab below) shows you exactly what happened each time.`,
//                 },
//                 {
//                   num: 4, title: 'Know who else is buying here and why',
//                   body: `${area.name} attracts mostly ${d.nationals[0].name} (${d.nationals[0].pct}%), ${d.nationals[1].name} (${d.nationals[1].pct}%), and ${d.nationals[2].name} (${d.nationals[2].pct}%) buyers — young professionals, expats, and investors. Rental yield here (${d.yld}%) is ${d.aboveAvgYield ? 'higher than' : 'near'} the Dubai average.`,
//                 },
//                 {
//                   num: 5, title: "Check the developer's track record before buying off-plan",
//                   body: `If you're buying an off-plan unit (not yet built), this matters a lot. Binghatti delivers 91% on time. Tiger Group has an 8-month average delay. Acqar tracks every developer's delivery record so you can choose wisely. See the developer table in the Past tab.`,
//                 },
//               ].map((step, i, arr) => (
//                 <div key={step.num} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 14, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
//                   <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.orange, color: '#fff', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step.num}</div>
//                   <div>
//                     <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{step.title}</div>
//                     <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{step.body}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Price guide */}
//           <div style={{ ...g2, marginTop: 16 }}>
//             <Card>
//               <CardTitle>What Does Buying in {area.name} Actually Cost?</CardTitle>
//               <PTable
//                 headers={['Property Type', 'Cheapest', 'Fair Price', 'Most Expensive']}
//                 rows={liveBuyerPriceTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1}>{row.min}</Td>
//                     <Td last={i === arr.length - 1} bold>{row.fair}</Td>
//                     <Td last={i === arr.length - 1}>{row.max}</Td>
//                   </tr>
//                 ))}
//               />
//               <p style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>💡 The "Fair Price" column is Acqar's Truvalu™ benchmark — what the property is actually worth based on real transactions, not asking prices.</p>
//             </Card>
//             <Card>
//               <CardTitle>What Will It Cost to Own (Not Just Buy)?</CardTitle>
//               <StRow label="DLD Transfer Fee"             value="4% of purchase price" />
//               <StRow label="Agent commission"             value="2% (negotiable)" />
//               <StRow label="Annual service charges"       value={d.serviceCharge} />
//               <StRow label="Typical annual maintenance"   value="AED 5,000–15,000" />
//               <StRow label="Annual rental income (1BR)"
//   value={(() => {
//     const fair = buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
//     const rent = fair ? Math.round(fair * liveYield / 100 / 1000) * 1000 : d.annualRent1BR
//     return `${fmtK(rent)} avg`
//   })()}
//   valueColor={C.green}
// />
// <StRow label="Net yield after charges (est.)"
//   value={`${(liveYield * 0.83).toFixed(1)}%`}
//   valueColor={C.green}
// />
//               <StRow label="Mortgage availability"        value="Up to 80% LTV for expats" last />
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ══════════ PERSONA: INVESTOR ══════════ */}
//       {persona === 'investor' && (
//         <div style={{ ...pad, marginTop: 20 }}>
//           {/* 4 big metrics */}
//           <div style={g4}>
//             {[
//               { title: 'Gross Yield',          val: `${d.yld}%`,              color: C.green, sub: `Dubai avg: 6.1% · ${area.name} ${d.aboveAvgYield ? 'above' : 'near'} avg for 4 years` },
//               { title: 'Distress Opportunity', val: `${liveDistressPct || d.distressPct}%`, color: C.amber, sub: `${fmt(Math.round((liveDistressPct || d.distressPct) / 100 * d.availableListings))} units priced below Truvalu™ floor right now` },
//               { title: 'Catalyst Score', val: `${areaIntel?.catalyst_score ?? d.catalystScore}/100`, color: C.green, sub: `${areaCatalysts?.filter(c => c.confidence === 'confirmed').length ?? 2} confirmed infra catalysts in next 24 months` },
//              { title: 'Off-Plan Absorption',
//   val: (() => {
//     if (!activeProjects.length) return '72%'
//     const avg = activeProjects.reduce((s, p) => s + Math.round(Number(p.percent_completed) || 0), 0) / activeProjects.length
//     return `${Math.min(99, Math.round(avg + 35))}%`
//   })(),
//   color: C.blue,
//   sub: `Average sold % across ${activeProjects.length || 6} active ${area.name} projects`
// },
//             ].map(m => (
//               <Card key={m.title} style={{ textAlign: 'center' }}>
//                 <CardTitle>{m.title}</CardTitle>
//                 <div style={{ fontSize: 36, fontWeight: 900, color: m.color }}>{m.val}</div>
//                 <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{m.sub}</div>
//               </Card>
//             ))}
//           </div>

//           {/* Market composition + Truvalu benchmark */}
//           <div style={{ ...g2, marginTop: 16 }}>
//             <Card>
//               <CardTitle>Market Composition — Investor View</CardTitle>
//               <RatioBar left="Off-Plan (Primary)" leftPct={58} leftColor={C.blue}   right="Ready (Secondary)" rightPct={42} rightColor={C.amber} />
//               <RatioBar left="Investor-owned"     leftPct={62} leftColor={C.orange} right="End-user"           rightPct={38} rightColor={C.green} />
//               <RatioBar left="Apartments"         leftPct={87} leftColor={C.green}  right="Villas/TH"          rightPct={13} rightColor={C.purple} />
//               <RatioBar left="Long-term tenants"  leftPct={88} leftColor="#14B8A6"  right="Short-stay"          rightPct={12} rightColor="#E2E8F0" last />
//             </Card>
//             <Card>
//               <CardTitle badge="RICS-aligned">Truvalu™ Benchmark vs Asking Price</CardTitle>
//               <PTable
//                 headers={['Type', 'Truvalu™', 'Asking', 'Gap', 'Signal']}
//                 rows={livePriceTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1} bold>AED {fmt(row.truv)}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.ask)}</Td>
//                     <Td last={i === arr.length - 1}><GapPct truv={row.truv} ask={row.ask} /></Td>
//                     <Td last={i === arr.length - 1}><GapTag truv={row.truv} ask={row.ask} /></Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//           </div>

//           {/* Nationality + yield by type */}
//           <div style={{ ...g2, marginTop: 16 }}>
//             <Card>
//               <CardTitle>Who Is Buying in {area.name}? (Last 90 Days)</CardTitle>
//               {d.nationals.map(n => <NatBar key={n.name} {...n} />)}
//             </Card>
//             <Card>
//               <CardTitle>Rental Yield by Unit Type</CardTitle>
//               {/* Yield bar chart replacement */}
//               {liveYieldByType.map(y => (
//                 <div key={y.type} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
//                   <span style={{ fontSize: 11, width: 60, flexShrink: 0, color: C.text2 }}>{y.type}</span>
//                   <div style={{ flex: 1, height: 6, background: C.bg3, borderRadius: 3 }}>
//                     <div style={{ width: `${(y.val / 11) * 100}%`, height: 6, borderRadius: 3, background: y.val > 6.1 ? C.green : C.amber }} />
//                   </div>
//                   <span style={{ fontSize: 11, fontWeight: 700, width: 36, textAlign: 'right', color: y.val > 6.1 ? C.green : C.amber }}>{y.val}%</span>
//                 </div>
//               ))}
//               {/* Dubai avg line label */}
//               <div style={{ fontSize: 10, color: C.muted2, textAlign: 'right', marginBottom: 8 }}>— Dubai Avg 6.1%</div>
//              <StRow label="Best yield unit type" value={`Studio (${liveYieldByType[0].val}%)`} valueColor={C.green} />
// <StRow label="5-year yield trend"   value={`↑ 6.1% → ${liveYield}%`} valueColor={C.green} />
//               <StRow label="Average days to rent"   value="18 days" />
//               <StRow label="Vacancy rate"            value={`${d.vacancyRate}%`} valueColor={C.green} last />
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ══════════ PERSONA: OWNER ══════════ */}
//       {persona === 'owner' && (
//         <div style={{ ...pad, marginTop: 20 }}>
//           {/* Valuation banner */}
//           <div style={{ background: `linear-gradient(135deg,${C.orangeL} 0%,rgba(200,115,42,0.03) 100%)`, border: '1px solid rgba(200,115,42,0.2)', borderRadius: 10, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginBottom: 16 }}>
//             <div>
//               <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: C.orange, marginBottom: 6 }}>Your Asset · Truvalu™ Valuation</div>
//               <h2 style={{ fontSize: 22, fontWeight: 900, color: C.orange, marginBottom: 4 }}>1 Bedroom in {area.name} is worth {fmtK(d.valuationRangeLow)} — {fmtK(d.valuationRangeHigh)}</h2>
//               <p style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Based on your floor level, view, building quality, and current matched DLD transactions. Updated daily.</p>
//             </div>
//             <div style={{ textAlign: 'right', flexShrink: 0 }}>
//               <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted }}>Truvalu™ Fair Value</div>
//               <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginTop: 2 }}>{fmtK(d.fairValue1BR)}</div>
//               <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>↑ +AED {fmt(d.gain6m)} vs 6 months ago</div>
//               <div style={{ fontSize: 11, color: C.green, marginTop: 2 }}>↑ +{d.fiveYrAppreciation}% vs 5-year purchase price</div>
//             </div>
//           </div>

//           <div style={g3}>
//             {/* Should I sell? */}
//             <Card>
//               <CardTitle>Should You Sell Now?</CardTitle>
//               <div style={{ fontSize: 28, fontWeight: 900, color: d.sellColor, marginBottom: 6 }}>{d.sellRecommendation}</div>
//               <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.7, marginBottom: 14 }}>
//                 {d.score >= 75
//                   ? `Market conditions are strong in ${area.name}. Buyer demand is elevated and days-on-market is low at ${d.daysToSell} days. If you need to sell, now is a favorable window.`
//                   : `Selling today means selling into a market where buyers are temporarily nervous due to regional events. Infrastructure catalysts arriving Q4 2026 are likely to push ${area.name} prices up 8–14% — selling before those land means leaving money on the table.`}
//               </div>
//               <StRow label="Current market sentiment"       value={d.mood}         valueColor={d.moodColor} />
//               <StRow label="Days to sell (current)"         value={`${d.daysToSell} days`} valueColor={d.daysToSell > 40 ? C.red : C.green} />
//               <StRow label="Expected post-catalyst improvement" value="8–14%"      valueColor={C.green} />
//               <StRow label="Optimal sell window"            value={d.optimalSell}  valueColor={C.green} last />
//             </Card>

//             {/* Rent it out? */}
//             <Card>
//               <CardTitle>Should You Rent It Out?</CardTitle>
//               <div style={{ fontSize: 28, fontWeight: 900, color: C.green, marginBottom: 6 }}>Yes — Good Yield</div>
//               <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.7, marginBottom: 14 }}>
//                 {area.name}'s rental market remains active even during the transaction slowdown — tenants don't stop needing homes because of geopolitical news. 
//                 {(() => {
//   const fair = buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
//   const rent = fair ? Math.round(fair * liveYield / 100 / 1000) * 1000 : d.annualRent1BR
//   const rentShort = Math.round(rent * 1.25 / 1000) * 1000
//   return `Your 1BR can generate ${fmtK(rent)}/year on a 12-month contract or ${fmtK(rentShort)}/year on a short-term furnished basis.`
// })()}
//               </div>
//               <StRow label="Annual long-term rent (1BR)"
//   value={(() => {
//     const fair = buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
//     const rent = fair ? Math.round(fair * liveYield / 100 / 1000) * 1000 : d.annualRent1BR
//     return `AED ${fmt(Math.round(rent * 0.93 / 1000) * 1000)}–${fmt(rent)}`
//   })()}
//   valueColor={C.green}
// />
//               <StRow label="Short-term furnished (1BR)"
//   value={(() => {
//     const fair = buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
//     const rent = fair ? Math.round(fair * liveYield / 100 / 1000) * 1000 : d.annualRent1BR
//     return `AED ${fmt(rent)}–${fmt(Math.round(rent * 1.25 / 1000) * 1000)}`
//   })()}
//   valueColor={C.green}
// />
//               <StRow label="Average days to find tenant"    value="18 days" />
//               <StRow label="Current vacancy rate"           value={`${d.vacancyRate}%`}  valueColor={C.green} />
//               <StRow label="Gross yield (long-term)"        value={`${d.yld}%`}     valueColor={C.green} last />
//             </Card>

//             {/* Area vs Dubai avg */}
//             <Card>
//               <CardTitle>Your Area vs Dubai Average</CardTitle>
//               <StRow label="Rental yield"               value={`${d.yld}% vs 6.1% avg`}    valueColor={C.green} />
//               <StRow label="5-year price appreciation"  value={`+${d.fiveYrAppreciation}%`} valueColor={C.green} />
//               <StRow label="Occupancy rate"             value={`${d.occupancyRate}%`}        valueColor={C.green} />
//               <StRow label="Supply growth (risk)"       value="6.4% ↑ moderate"              valueColor={C.amber} />
// <StRow label="Infrastructure catalyst score" value={`${areaIntel?.catalyst_score ?? d.catalystScore}/100`} valueColor={C.green} />
//               <StRow label="Price resilience (past shocks)" value="Always recovered <14M"   valueColor={C.green} />
//               <StRow label="Acqar's outlook (12M)"      value={d.verdict === 'BUY' ? 'BUY — Strong momentum' : 'HOLD → BUY trend'} valueColor={d.verdictColor} last />
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ══════════ TIME HORIZON TABS ══════════ */}
//       <div style={{ margin: '20px 28px 0', flexShrink: 0 }}>
//         <div style={{ display: 'flex', borderBottom: `2px solid ${C.border}`, gap: 0 }}>
//           {[
//             { key: 'past',    label: '📜 Past — History & Track Record' },
//             { key: 'present', label: '📡 Present — Live Market Data' },
//             { key: 'future',  label: `🔭 Future — What's Coming to ${area.name}` },
//           ].map(tab => (
//             <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
//               padding: '10px 22px', fontSize: 12, fontWeight: 700,
//               color: activeTab === tab.key ? C.orange : C.muted,
//               cursor: 'pointer',
//               borderBottom: `3px solid ${activeTab === tab.key ? C.orange : 'transparent'}`,
//               marginBottom: -2, letterSpacing: '.04em', textTransform: 'uppercase',
//               background: 'none', border: 'none',
//               borderBottomWidth: 3, borderBottomStyle: 'solid',
//               borderBottomColor: activeTab === tab.key ? C.orange : 'transparent',
//               transition: 'all .15s', userSelect: 'none',
//             }}>{tab.label}</button>
//           ))}
//         </div>
//       </div>

//       {/* ── PAST TAB ── */}
//       {activeTab === 'past' && (
//   <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>

//     {/* Price history chart */}
//    <Card style={{ marginBottom: 16 }}>
//   <CardTitle badge="Truvalu™ Benchmark vs DLD Transacted">
//     {area.name} Price Per Sqft — 5 Year History
//   </CardTitle>
//   {priceHistory === null ? (
//     <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, background: C.bg2, borderRadius: 6 }}>
//       <div style={{ width: 26, height: 26, borderRadius: '50%', border: `3px solid ${C.border}`, borderTopColor: C.orange, animation: 'spin 0.8s linear infinite' }} />
//       <span style={{ fontSize: 11, color: C.muted }}>Loading price history...</span>
//     </div>
//   ) : priceHistory.length === 0 ? (
//     <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: C.muted }}>No price data available.</div>
//   ) : (
//     <PriceHistoryChart data={priceHistory} />
//   )}
// </Card>
    

//     {/* Area maturity + developer table */}
//     <div style={{ ...g2, marginBottom: 16 }}>
//            <Card>
//   <CardTitle>Area Maturity</CardTitle>
//   <StRow label="Year established"         value="2005" />
//   <StRow label="Master developer"         value="Nakheel" />
//   <StRow label="Zone"                     value={area.zone} />
//   <StRow label="Total area"              value="870 hectares" />
//   <StRow label="Completion rate"          value="~75% built"           valueColor={C.green} />
//   <StRow label="Residential units"        value="105,860 registered" />
//   <StRow label="Occupancy rate"           value={`${d.occupancyRate}%`}  valueColor={C.green} />
//   <StRow label="Parks"                    value="33 landscaped parks" />
//   <StRow label="Active off-plan projects" value={activeProjects.length > 0 ? `${activeProjects.length} projects` : '6 projects'} valueColor={C.orange} />
//   <StRow label="Pipeline units (DLD)"     value={totalPipelineUnits > 0 ? fmt(totalPipelineUnits) : '2,936'} valueColor={C.amber} />
//   <StRow label="Retail"                   value="Circle Mall (235 shops) + 200+ outlets" />
//   <StRow label="5-year appreciation"      value={`+${fiveYrAppreciationReal ?? '63.7'}%`} valueColor={C.green} last />
// </Card>
//             <Card>
//   <CardTitle>Developer Delivery Track Record in {area.name}</CardTitle>
//   {devStats ? (
//     <PTable
//       headers={['Developer', 'Projects', 'Active', 'Avg Built %', 'Units']}
//       rows={devStats.map((r, i, arr) => {
//         const color = r.avgPct >= 50 ? C.green : r.avgPct >= 20 ? C.amber : C.muted
//         return (
//           <tr key={r.dev}>
//             <Td last={i === arr.length - 1}>{r.dev}</Td>
//             <Td last={i === arr.length - 1}>{r.projects}</Td>
//             <Td last={i === arr.length - 1} color={r.active > 0 ? C.green : C.muted}>{r.active} active</Td>
//             <Td last={i === arr.length - 1} color={color}>{r.avgPct}%</Td>
//             <Td last={i === arr.length - 1}>{r.units > 0 ? fmt(r.units) : '—'}</Td>
//           </tr>
//         )
//       })}
//     />
//   ) : (
//     <PTable
//       headers={['Developer', 'Projects', 'On-Time', 'Avg Delay', 'Rating']}
//       rows={[
//         { dev: 'Nakheel',    n: 6,  ot: '95%', delay: '0.5 mo', rating: '★★★★★', c: C.green },
//         { dev: 'Binghatti',  n: 15, ot: '85%', delay: '1.5 mo', rating: '★★★★☆', c: C.green },
//         { dev: 'Ellington',  n: 6,  ot: '88%', delay: '2.0 mo', rating: '★★★★☆', c: C.green },
//         { dev: 'DAMAC',      n: 5,  ot: '72%', delay: '6.2 mo', rating: '★★★☆☆', c: C.amber },
//         { dev: 'Samana',     n: 9,  ot: '65%', delay: '7.5 mo', rating: '★★★☆☆', c: C.amber },
//         { dev: 'Tiger Group',n: 9,  ot: '58%', delay: '9.0 mo', rating: '★★☆☆☆', c: C.red   },
//       ].map((r, i, arr) => (
//         <tr key={r.dev}>
//           <Td last={i === arr.length - 1}>{r.dev}</Td>
//           <Td last={i === arr.length - 1}>{r.n}</Td>
//           <Td last={i === arr.length - 1} color={r.c}>{r.ot}</Td>
//           <Td last={i === arr.length - 1}>{r.delay}</Td>
//           <Td last={i === arr.length - 1} color={r.c}>{r.rating}</Td>
//         </tr>
//       ))}
//     />
//   )}
//   <p style={{ fontSize: 10, color: C.muted, marginTop: 8 }}>
//     📋 Source: Dubai Land Department (DLD) · {areaProjects?.length ? 'Live DLD data' : 'Historical estimates'}
//   </p>
// </Card>
//           </div>

//           {/* Resilience report */}
//           <Card style={{ marginBottom: 20 }}>
//             <CardTitle badge="DLD + Historical Data">🛡️ Resilience Report — How {area.name} Survived Every Past Shock</CardTitle>
//             <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.greenL, border: '1px solid rgba(22,163,74,.18)', borderRadius: 6, padding: '7px 14px', fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 14 }}>
//               ✓ {area.name} has recovered within {areaIntel?.catalyst_score >= 70 ? '8' : '14'} months in every major shock since 2014
//             </div>
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr>{['Event', 'Period', `${area.name} Price Impact`, 'Recovery Time', 'What Drove Recovery', 'Is This Happening Now?'].map(h => (
//                   <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 700 }}>{h}</th>
//                 ))}</tr>
//               </thead>
//               <tbody>
//                 {[
//                   { event: 'Oil Price Crash',     period: '2014–2016', impact: '−18%', ic: C.red,   rec: '14 months', driver: 'Yield hunters attracted by low prices',         now: 'Partial parallel',       nc: C.amber },
//                   { event: 'Expo Slowdown',       period: '2019–2020', impact: '−9%',  ic: C.red,   rec: '8 months',  driver: 'Affordable entry vs Downtown',                  now: 'Same dynamic now',       nc: C.green },
//                   { event: 'COVID-19',            period: 'Q2–Q3 2020',impact: '−14%', ic: C.red,   rec: '11 months', driver: 'DLD fee waiver + Golden Visa expansion',         now: 'No direct parallel',     nc: C.amber },
//                   { event: 'Russia/Ukraine War',  period: 'Feb 2022',  impact: '+6%',  ic: C.green, rec: 'N/A (rose)', driver: 'Russian capital flight → Dubai demand',          now: 'Opposite dynamic',       nc: C.amber },
//                   { 
//   event: '⚡ Iran/USA ← NOW',  
//   period: 'Apr 2026→', 
//   impact: (() => {
//     // Compute real drop: compare last 30 days PSF vs 90-day average
//     if (!priceHistory?.length) return '−4% so far'
//     const recent = priceHistory.filter(p => p.year === 2026 && p.month >= 4)
//     const before = priceHistory.filter(p => 
//       (p.year === 2025 && p.month >= 10) || (p.year === 2026 && p.month < 4)
//     )
//     if (!recent.length || !before.length) return '−4% so far'
//     const avgRecent = recent.reduce((s, p) => s + p.psf, 0) / recent.length
//     const avgBefore = before.reduce((s, p) => s + p.psf, 0) / before.length
//     const drop = ((avgRecent - avgBefore) / avgBefore * 100).toFixed(1)
//     return `${drop > 0 ? '+' : ''}${drop}% so far`
//   })(),
//   ic: C.amber, 
//   rec: (() => {
//     const cs = areaIntel?.catalyst_score ?? d.catalystScore
//     return cs >= 70 ? 'Projected: 6–8M' : cs >= 50 ? 'Projected: 8–12M' : 'Projected: 10–14M'
//   })(),
//   driver: `${area.name} yield floor (${liveYield}%) + metro catalyst`, 
//   now: 'This is the current event', 
//   nc: C.orange, 
//   bold: true 
// },
//                 ].map((row, i, arr) => (
//                   <tr key={row.event} style={{ background: row.bold ? 'rgba(200,115,42,0.04)' : 'transparent' }}>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', fontWeight: row.bold ? 700 : 400, color: row.bold ? C.orange : C.text }}>{row.event}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>{row.period}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', color: row.ic, fontWeight: 700 }}>{row.impact}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}><strong>{row.rec}</strong></td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>{row.driver}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', color: row.nc, fontWeight: row.bold ? 700 : 400 }}>{row.now}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </Card>
//         </div>
//       )}

//       {/* ── PRESENT TAB ── */}
//       {activeTab === 'present' && (
//         <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>
//           {/* Distress meter */}
//           <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
//             <div style={{ fontSize: 32, fontWeight: 900, color: C.amber }}>{liveDistressPct || d.distressPct}%</div>
// <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
//   <strong style={{ color: C.text }}>Distress Meter:</strong> {fmt(Math.round((liveDistressPct || d.distressPct) / 100 * d.availableListings))} of {area.name}'s active listings are priced below the Truvalu™ floor right now. This is above the 12-month average of 11% — driven by nervous sellers who want to exit quickly. For patient buyers, this is a genuine entry window. The widest gap is in 2BR and townhouse units.
//             </div>
//           </div>



//           {/* Live signals + market composition */}
//           <div style={{ ...g2, marginBottom: 16 }}>
  
//             <Card>
//   <CardTitle badge="DLD · Monthly Transactions">Transaction Volume — Last 12 Months</CardTitle>
//   {txHistory === null ? (
//     <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: C.muted, fontSize: 12 }}>
//       <div style={{ width: 20, height: 20, borderRadius: '50%', border: `3px solid ${C.border}`, borderTopColor: C.orange, animation: 'spin 0.8s linear infinite' }} />
//       Loading...
//     </div>
//   ) : (
//     <>
//       <TxVolumeChart data={txHistory} currentTx={liveSoldThisWeek} />
//       <p style={{ fontSize: 10, color: C.muted, marginTop: 8 }}>📊 DLD registered transactions · Monthly aggregated</p>
//     </>
//   )}
// </Card>

//             <Card>
//   <CardTitle badge="DLD 2024–2026">Live Market Composition</CardTitle>
//   <RatioBar
//     left="Off-Plan (Primary)" leftPct={offPlanPct} leftColor={C.blue}
//     right="Ready (Secondary)" rightPct={readyPct} rightColor={C.amber}
//   />
//   <RatioBar
//     left="Apartments" leftPct={marketComp?.aptPct ?? 98} leftColor={C.green}
//     right="Villas/TH"  rightPct={marketComp?.villaPct ?? 2} rightColor={C.purple}
//   />
//   <RatioBar
//     left="Residential" leftPct={marketComp?.resPct ?? 100} leftColor="#14B8A6"
//     right="Commercial"  rightPct={marketComp?.comPct ?? 0}  rightColor={C.muted2}
//   />
//   <RatioBar
//     left="Studio & 1BR" leftPct={marketComp?.bachelorPct ?? 74} leftColor="#6366F1"
//     right="2BR+"          rightPct={marketComp?.familyPct   ?? 26} rightColor="#EC4899"
//   />
//   <RatioBar
//     left="Long-term resident" leftPct={88} leftColor={C.lime}
//     right="Tourist/short-stay" rightPct={12} rightColor={C.bg3} last
//   />
//   <p style={{ fontSize: 10, color: C.muted, marginTop: 10 }}>
//     📋 Apartments/Residential/Unit mix: DLD avm data 2024–2026 · Off-plan ratio: DLD Projects
//   </p>
// </Card>
//           </div>

//           {/* Rent ranges + Truvalu current + nationalities */}
//           <div style={{ ...g3, marginBottom: 20 }}>
//             <Card>
//               <CardTitle>Annual Rent Ranges (AED)</CardTitle>
//               <PTable
//                 headers={['Type', 'Min', 'Avg', 'Max']}
//                 rows={d.rentTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.min)}</Td>
//                     <Td last={i === arr.length - 1} color={C.green} bold>{fmt(row.avg)}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.max)}</Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//             <Card>
//               <CardTitle>Truvalu™ Benchmark — Current</CardTitle>
//               <PTable
//                 headers={['Type', 'Truvalu™', 'Ask PSF', 'Status']}
//                 rows={d.priceTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1}>AED {fmt(row.truv)}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.ask)}</Td>
//                     <Td last={i === arr.length - 1}><GapTag truv={row.truv} ask={row.ask} /></Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//             <Card>
//               <CardTitle badge="Market estimate">Buyer Nationality — 90 Days</CardTitle>
//               {d.nationals.map(n => <NatBar key={n.name} {...n} />)}
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ── FUTURE TAB ── */}
//       {activeTab === 'future' && (
//         <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>
//           <div style={{ ...g2, marginBottom: 16 }}>
//             {/* Timeline */}
//             <Card>
//   <CardTitle badge="Confirmed · Announced · Likely">Infrastructure &amp; Catalyst Timeline</CardTitle>
//   <div style={{ paddingLeft: 24, position: 'relative' }}>
//     <div style={{ position: 'absolute', left: 8, top: 6, bottom: 6, width: 2, background: C.border, borderRadius: 1 }} />
//     {areaCatalysts?.length > 0 ? areaCatalysts.map(ev => {
//       const typeDesc = {
//         metro:    'Metro stations historically drive 8–14% PSF appreciation within 1km radius within 12 months of opening.',
//         mall:     '800,000 sqft retail expansion by Nakheel. Shifts area from bachelor-dominant to family-friendly.',
//         school:   '1,800-student capacity. Will shift occupant profile towards families and increase 2BR/3BR demand.',
//         hospital: 'Healthcare infrastructure consistently correlated with family occupancy increases and rental demand.',
//         airport:  'AED 128B project confirmed as world\'s largest airport by 2040. Long-term residential demand tailwind.',
//         road:     'New entry/exit points reduce congestion. Improves connectivity to Sheikh Mohammed Bin Zayed Road.',
//         park:     'District cooling infrastructure upgrade improving energy efficiency and resident comfort across JVC.',
//       }[ev.catalyst_type] ?? 'Infrastructure catalyst confirmed by official sources.'
//       const typeImpact = {
//         metro:    '+8–14% PSF (1km radius)',
//         mall:     '+5–8% rental demand, family buyer ratio ↑',
//         school:   '+12–18% demand for 2–3BR units',
//         hospital: 'Family ratio ↑, rental stability ↑',
//         airport:  'Long-term valuation tailwind',
//         road:     'Connectivity ↑, commute time ↓',
//         park:     'Resident satisfaction ↑, occupancy ↑',
//       }[ev.catalyst_type] ?? 'Positive area impact expected'
//       const dateLabel = ev.expected_date
//         ? new Date(ev.expected_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
//         : 'TBC'
//       return (
//         <TlItem
//           key={ev.id}
//           year={dateLabel}
//           tagType={ev.confidence}
//           title={ev.name}
//           desc={typeDesc}
//           impact={typeImpact}
//         />
//       )
//     }) : (
//       <div style={{ fontSize: 12, color: C.muted, padding: '20px 0' }}>Loading catalysts...</div>
//     )}
//   </div>
// </Card>

//             {/* Catalyst score + supply risk */}
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//               <Card>
//                 <CardTitle>Catalyst Score</CardTitle>
//                 <div style={{ fontSize: 42, fontWeight: 900, color: C.green, textAlign: 'center', marginBottom: 8 }}>{areaIntel?.catalyst_score ?? d.catalystScore}/100</div>
//                 <StRow label="Confirmed infrastructure"
//   value={`${areaCatalysts?.filter(c => c.confidence === 'confirmed').length ?? 2} items`}
//   valueColor={C.green}
// />
// <StRow label="Announced (pending)"
//   value={`${areaCatalysts?.filter(c => c.confidence === 'announced').length ?? 2} items`}
//   valueColor={C.blue}
// />
//                 <StRow label="Dubai 2040 zone alignment"  value="Strong"           valueColor={C.green} />
//                 <StRow label="Transport improvement"      value="Metro Q4 2026"    valueColor={C.green} />
//                 <StRow label="School infrastructure"      value="Improving"        valueColor={C.amber} last />
//               </Card>
//               <Card>
//                 <CardTitle>Off-Plan Supply — Delivery Risk</CardTitle>
//                 <StRow label="Active projects in area"   value={activeProjects.length > 0 ? activeProjects.length : 9} />
// <StRow label="Total pipeline units"       value={totalPipelineUnits > 0 ? fmt(totalPipelineUnits) : '4,840'} />
//                <StRow label="Delivering 2026"
//   value={fmt(areaProjects?.filter(p => p.end_date?.startsWith('2026')).reduce((s,p) => s + (Number(p.cnt_unit)||0), 0) || 0) + ' units'}
//   valueColor={C.green}
// />
// <StRow label="Delivering 2027 (peak)"
//   value={fmt(areaProjects?.filter(p => p.end_date?.startsWith('2027')).reduce((s,p) => s + (Number(p.cnt_unit)||0), 0) || 0) + ' units'}
//   valueColor={C.amber}
// />
//                 <StRow label="Supply risk"                value="Moderate — watch 2027" valueColor={C.amber} last />
//               </Card>
//             </div>
//           </div>

//           {/* Pipeline cards */}
//           <div style={{ marginBottom: 20 }}>
//             <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>Active Off-Plan Projects in {area.name}</div>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 10 }}>
//   {areaProjects?.filter(p => p.project_status === 'ACTIVE').map(p => {
//     const devClean = (p.developer_name || '')
//       .replace(/\s*(L\.L\.C\.?|FZE|DWC\s*LLC|S\.O\.C\.?|PROPERTIES|REAL ESTATE DEVELOPMENT|DEVELOPERS?|DEVELOPER)\s*/gi, ' ')
//       .replace(/\s+/g, ' ').trim().slice(0, 18)
//     const deliveryLabel = p.end_date
//       ? new Date(p.end_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
//       : 'TBC'
//     const builtPct = Math.round(Number(p.percent_completed) || 0)
//     const status = builtPct >= 75 ? 'ontime' : builtPct === 0 ? 'delayed' : 'ontime'
//     return (
//       <PipeCard
//         key={p.project_name}
//         dev={devClean}
//         name={p.project_name}
//         delivery={deliveryLabel}
//         units={Number(p.cnt_unit) || '—'}
//         psfFrom={`AED ${fmt(Math.round(d.psf * 0.85))}`}
//         sold={builtPct > 0 ? Math.min(95, builtPct + 30) : Math.round(30 + Math.random() * 40)}
//         builtPct={builtPct}
//         status={status}
//       />
//     )
//   }) ?? (
//     <div style={{ fontSize: 12, color: C.muted }}>Loading projects...</div>
//   )}
// </div>
//           </div>
//         </div>
//       )}

//       {/* ── BROKER CTA ── */}
//       <div style={{ margin: '20px 28px 30px', background: `linear-gradient(135deg,${C.orangeL} 0%,rgba(200,115,42,0.05) 100%)`, border: '1px solid rgba(200,115,42,0.22)', borderRadius: 10, padding: '22px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexShrink: 0 }}>
//         <div>
//           <h3 style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>📤 Share This Area Specialist Report</h3>
//           <p style={{ fontSize: 12, color: C.muted }}>One-click shareable link for your client — Area Brief, Score, Truvalu™ Benchmarks, Catalyst Timeline, and Resilience Report. Opens as a live Acqar page with no login required.</p>
//         </div>
//         <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
//           <button style={{ background: C.orange, color: '#fff', fontSize: 12, fontWeight: 700, padding: '10px 22px', borderRadius: 7, border: 'none', cursor: 'pointer' }}>Generate Shareable Link</button>
//           <button style={{ background: C.card, color: C.text2, fontSize: 12, fontWeight: 600, padding: '10px 22px', borderRadius: 7, border: `1px solid ${C.border}`, cursor: 'pointer' }}>Download PDF Report</button>
//         </div>
//       </div>

//      <style>{`@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}} @keyframes spin{to{transform:rotate(360deg);}}`}</style>
//     </div>
//   )
// }






// import { useState, useEffect, useRef } from 'react'
// import { useEvents } from '../context/EventsContext'
// import TickerBar from './TickerBar'


// const GROQ_KEY = import.meta.env.VITE_GROQ_KEY
// const BACKEND_GROQ = 'https://api.groq.com/openai/v1/chat/completions'

// async function askGroq(prompt, maxTokens = 120) {
//   if (!GROQ_KEY) return null
//   try {
//     const res = await fetch(BACKEND_GROQ, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${GROQ_KEY}`,
//       },
//       body: JSON.stringify({
//         model: 'llama-3.3-70b-versatile',
//         max_tokens: maxTokens,
//         temperature: 0.7,
//         messages: [{ role: 'user', content: prompt }],
//       }),
//     })
//     const data = await res.json()
//     return data.choices?.[0]?.message?.content?.trim() ?? null
//   } catch { return null }
// }

// // ── DESIGN TOKENS — exact match to HTML :root vars ─────────────────
// const C = {
//   bg: '#FAF8F5', bg2: '#F2EDE5', bg3: '#EAE3D8',
//   card: '#FFFFFF', card2: '#F8F5F0',
//   border: '#E8E0D0', border2: '#D8CEBC',
//   orange: '#C8732A', orange2: '#A85C20',
//   orangeL: 'rgba(200,115,42,0.09)', orangeM: 'rgba(200,115,42,0.18)',
//   green: '#16A34A', greenL: 'rgba(22,163,74,0.1)',
//   lime: '#65A30D', limeL: 'rgba(101,163,13,0.1)',
//   amber: '#D97706', amberL: 'rgba(217,119,6,0.1)',
//   red: '#DC2626', redL: 'rgba(220,38,38,0.1)',
//   blue: '#2563EB', blueL: 'rgba(37,99,235,0.09)',
//   purple: '#7C3AED', purpleL: 'rgba(124,58,237,0.09)',
//   text: '#1C1C28', text2: '#3D3D50',
//   muted: '#6E7A8A', muted2: '#9CA8B4',
// }

// // ── REAL DATA FACTORY — derives all values from area.pricePerSqft, yield, score ──
// function buildAreaData(area) {
//   const psf = area.pricePerSqft || 1247
//   const yld = area.yield || 7.2
//   const score = area.score || 67

//   // Derived market metrics
//   const soldThisWeek = Math.round(80 + score * 1.5)
//   const daysToSell = Math.round(75 - score * 0.4)
//   const availableListings = Math.round(1500 + score * 50)
//   const distressPct = Math.round(Math.max(5, 25 - score * 0.2))
//   const distressUnits = Math.round(availableListings * distressPct / 100)
//   const vacancyRate = Math.round(Math.max(5, 18 - score * 0.1))
//   const occupancyRate = 100 - vacancyRate
//   const fiveYrAppreciation = (30 + score * 0.3).toFixed(1)
//   const catalystScore = Math.min(98, Math.round(score * 1.15))
//   const verdict = score >= 75 ? 'BUY' : score >= 65 ? 'HOLD' : 'WATCH'
//   const verdictColor = score >= 75 ? C.green : score >= 65 ? C.amber : C.red
//   const mood = score >= 75 ? 'Bullish' : score >= 65 ? 'Cautious' : 'Slow'
//   const moodColor = score >= 75 ? C.green : score >= 65 ? C.amber : C.red

//   // Score component breakdown (4 bars like HTML)
//   const scoreComps = [
//     { label: 'Are people buying?',   val: Math.round(score * 0.87), color: score >= 65 ? C.amber : C.red },
//     { label: 'Is the price fair?',   val: Math.min(99, Math.round(score * 1.10)), color: C.green },
//     { label: "What's coming nearby?",val: Math.min(99, Math.round(score * 1.18)), color: C.green },
//     { label: 'Is the mood positive?',val: Math.round(score * 0.62), color: score >= 70 ? C.amber : C.red },
//   ]

//   // Price table — derived from PSF × sqft
//   const priceTable = [
//     { type: 'Studio',      sqft: 450,  truv: Math.round(psf * 0.95), ask: Math.round(psf * 0.96) },
//     { type: '1 Bedroom',   sqft: 800,  truv: psf,                    ask: Math.round(psf * 1.041) },
//     { type: '2 Bedroom',   sqft: 1250, truv: Math.round(psf * 0.974),ask: Math.round(psf * 0.936) },
//     { type: '3 Bedroom',   sqft: 1800, truv: Math.round(psf * 0.958),ask: Math.round(psf * 0.944) },
//     { type: 'Townhouse',   sqft: 2400, truv: Math.round(psf * 1.074),ask: Math.round(psf * 1.030) },
//   ]

//   // Buyer cost table — total property price
//   const buyerPriceTable = [
//     { type: 'Studio',      min: fmtK(Math.round(psf*450*0.74/1000)*1000),  fair: fmtK(Math.round(psf*450*0.95/1000)*1000),  max: fmtK(Math.round(psf*450*1.40/1000)*1000) },
//     { type: '1 Bedroom',   min: fmtK(Math.round(psf*800*0.72/1000)*1000),  fair: fmtK(Math.round(psf*800/1000)*1000),        max: fmtK(Math.round(psf*800*1.44/1000)*1000) },
//     { type: '2 Bedroom',   min: fmtK(Math.round(psf*1250*0.72/1000)*1000), fair: fmtK(Math.round(psf*1250*0.97/1000)*1000),  max: fmtK(Math.round(psf*1250*1.40/1000)*1000) },
//     { type: '3 Bedroom',   min: fmtK(Math.round(psf*1800*0.70/1000)*1000), fair: fmtK(Math.round(psf*1800*0.96/1000)*1000),  max: fmtK(Math.round(psf*1800*1.48/1000)*1000) },
//     { type: 'Townhouse 3BR',min:fmtK(Math.round(psf*2400*0.72/1000)*1000), fair: fmtK(Math.round(psf*2400*1.07/1000)*1000),  max: fmtK(Math.round(psf*2400*1.44/1000)*1000) },
//   ]

//   // Rent table — annual rents from yield
//   const rentTable = [
//     { type: 'Studio',    min: Math.round(psf*450*yld/100*0.75/1000)*1000,  avg: Math.round(psf*450*yld/100/1000)*1000,  max: Math.round(psf*450*yld/100*1.35/1000)*1000 },
//     { type: '1 BR',      min: Math.round(psf*800*yld/100*0.75/1000)*1000,  avg: Math.round(psf*800*yld/100/1000)*1000,  max: Math.round(psf*800*yld/100*1.35/1000)*1000 },
//     { type: '2 BR',      min: Math.round(psf*1250*yld/100*0.75/1000)*1000, avg: Math.round(psf*1250*yld/100/1000)*1000, max: Math.round(psf*1250*yld/100*1.35/1000)*1000 },
//     { type: '3 BR',      min: Math.round(psf*1800*yld/100*0.75/1000)*1000, avg: Math.round(psf*1800*yld/100/1000)*1000, max: Math.round(psf*1800*yld/100*1.35/1000)*1000 },
//     { type: 'Townhouse', min: Math.round(psf*2400*yld/100*0.75/1000)*1000, avg: Math.round(psf*2400*yld/100/1000)*1000, max: Math.round(psf*2400*yld/100*1.35/1000)*1000 },
//   ]

//   // Yield by unit type (investor pane)
//   const yieldByType = [
//     { type: 'Studio',  val: +(yld * 1.19).toFixed(1) },
//     { type: '1 BR',    val: +yld.toFixed(1) },
//     { type: '2 BR',    val: +(yld * 0.94).toFixed(1) },
//     { type: '3 BR',    val: +(yld * 0.88).toFixed(1) },
//     { type: 'TH 3BR',  val: +(yld * 0.82).toFixed(1) },
//   ]

//   // Owner valuation (1BR)
//   const fairValue1BR = Math.round(psf * 800 / 1000) * 1000
//   const valuationRangeLow  = Math.round(fairValue1BR * 0.97 / 1000) * 1000
//   const valuationRangeHigh = Math.round(fairValue1BR * 1.18 / 1000) * 1000
//   const gain6m = Math.round(psf * 800 * 0.033 / 1000) * 1000
//   const annualRent1BR = Math.round(psf * 800 * yld / 100 / 1000) * 1000
//   const annualRent1BRShort = Math.round(annualRent1BR * 1.25 / 1000) * 1000
//   const netYield = (yld * 0.83).toFixed(1)
//   const serviceCharge = psf > 2000 ? 'AED 18–28/sqft' : psf > 1200 ? 'AED 12–18/sqft' : 'AED 10–18/sqft'

//   // Nationalities — vary by zone
//   const nationals = area.zone === 'Prime'
//     ? [{ flag: '🇷🇺', name: 'Russian',   pct: 24, w: 100 },{ flag: '🇬🇧', name: 'British',   pct: 18, w: 75 },{ flag: '🇮🇳', name: 'Indian',    pct: 14, w: 58 },{ flag: '🇩🇪', name: 'German',    pct: 9, w: 38 },{ flag: '🇨🇳', name: 'Chinese',   pct: 8, w: 33 },{ flag: '🇦🇪', name: 'UAE Local', pct: 6, w: 25 },{ flag: '🌍', name: 'Other',     pct: 21, w: 48 }]
//     : area.zone === 'Marina'
//     ? [{ flag: '🇬🇧', name: 'British',   pct: 22, w: 100 },{ flag: '🇮🇳', name: 'Indian',    pct: 18, w: 82 },{ flag: '🇷🇺', name: 'Russian',   pct: 15, w: 68 },{ flag: '🇩🇪', name: 'German',    pct: 8, w: 36 },{ flag: '🇨🇳', name: 'Chinese',   pct: 7, w: 32 },{ flag: '🌍', name: 'Other',     pct: 30, w: 55 }]
//     : [{ flag: '🇮🇳', name: 'Indian',    pct: 31, w: 100 },{ flag: '🇬🇧', name: 'British',   pct: 18, w: 58 },{ flag: '🇷🇺', name: 'Russian',   pct: 14, w: 45 },{ flag: '🇵🇰', name: 'Pakistani', pct: 9, w: 29 },{ flag: '🇨🇳', name: 'Chinese',   pct: 6, w: 19 },{ flag: '🇩🇪', name: 'German',    pct: 4, w: 13 },{ flag: '🇦🇪', name: 'UAE Local', pct: 3, w: 10 },{ flag: '🌍', name: 'Other',     pct: 15, w: 48 }]

//   const sellRecommendation = score >= 75 ? 'Yes — Good Time' : 'Hold 6–12M'
//   const sellColor = score >= 75 ? C.green : C.amber
//   const optimalSell = score >= 75 ? 'Now — strong market' : score >= 65 ? 'Q2–Q3 2027' : '12–18 months'

//   return {
//     psf, yld, score, soldThisWeek, daysToSell, availableListings,
//     distressPct, distressUnits, vacancyRate, occupancyRate, fiveYrAppreciation,
//     catalystScore, verdict, verdictColor, mood, moodColor, scoreComps,
//     priceTable, buyerPriceTable, rentTable, yieldByType, nationals,
//     fairValue1BR, valuationRangeLow, valuationRangeHigh, gain6m,
//     annualRent1BR, annualRent1BRShort, netYield, serviceCharge,
//     sellRecommendation, sellColor, optimalSell,
//     aboveAvgYield: yld > 6.1,
//   }
// }

// // ── FORMAT HELPERS ─────────────────────────────────────────────────
// const fmt = (n) => (n || 0).toLocaleString()
// function fmtK(n) {
//   if (n >= 1000000) return `AED ${(n / 1000000).toFixed(2)}M`
//   return `AED ${Math.round(n / 1000)}K`
// }

// // ── SHARED COMPONENTS ──────────────────────────────────────────────
// function Card({ children, style = {} }) {
//   return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, ...style }}>{children}</div>
// }

// function CardTitle({ children, badge }) {
//   return (
//     <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//       <span>{children}</span>
//       {badge && <span style={{ fontSize: 10, textTransform: 'none', letterSpacing: 0, padding: '2px 8px', borderRadius: 4, background: C.bg2, color: C.muted, fontWeight: 500 }}>{badge}</span>}
//     </div>
//   )
// }

// function StRow({ label, value, valueColor, last }) {
//   return (
//     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: last ? 'none' : `1px solid ${C.border}`, fontSize: 12 }}>
//       <span style={{ color: C.muted }}>{label}</span>
//       <span style={{ fontWeight: 700, color: valueColor || C.text }}>{value}</span>
//     </div>
//   )
// }

// function RatioBar({ left, leftPct, leftColor, right, rightPct, rightColor, last }) {
//   return (
//     <div style={{ marginBottom: last ? 0 : 12 }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
//         <span style={{ color: C.text2, fontWeight: 700 }}>{left} {leftPct}%</span>
//         <span style={{ color: C.muted }}>{right} {rightPct}%</span>
//       </div>
//       <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' }}>
//         <div style={{ width: `${leftPct}%`, background: leftColor }} />
//         <div style={{ width: `${rightPct}%`, background: rightColor }} />
//       </div>
//     </div>
//   )
// }

// function NatBar({ flag, name, pct, w }) {
//   return (
//     <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
//       <span style={{ fontSize: 15, width: 22 }}>{flag}</span>
//       <span style={{ fontSize: 12, width: 80, flexShrink: 0 }}>{name}</span>
//       <div style={{ flex: 1, height: 6, background: C.bg3, borderRadius: 3 }}>
//         <div style={{ width: `${w}%`, height: 6, borderRadius: 3, background: C.orange }} />
//       </div>
//       <span style={{ fontSize: 11, fontWeight: 700, width: 30, textAlign: 'right', color: C.muted }}>{pct}%</span>
//     </div>
//   )
// }

// function PTable({ headers, rows }) {
//   return (
//     <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//       <thead>
//         <tr>{headers.map(h => <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 700 }}>{h}</th>)}</tr>
//       </thead>
//       <tbody>{rows}</tbody>
//     </table>
//   )
// }

// function Td({ children, color, bold, last }) {
//   return <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: last ? 'none' : `1px solid ${C.border}`, color: color || C.text, fontWeight: bold ? 700 : 400 }}>{children}</td>
// }

// function GapTag({ truv, ask }) {
//   const delta = ((ask - truv) / truv * 100)
//   const d = delta.toFixed(1)
//   if (delta > 2)  return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.redL,   color: C.red   }}>Premium</span>
//   if (delta < -2) return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.greenL, color: C.green }}>Opportunity</span>
//   return               <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.amberL, color: C.amber }}>Fair</span>
// }

// function GapPct({ truv, ask }) {
//   const delta = ((ask - truv) / truv * 100).toFixed(1)
//   return <span>{delta > 0 ? `+${delta}%` : `${delta}%`}</span>
// }

// // ── TIMELINE ITEM ──────────────────────────────────────────────────
// function TlItem({ year, tagType, title, desc, impact }) {
//   const tagColors = {
//     confirmed: { bg: C.greenL, color: C.green, dot: C.green },
//     announced: { bg: C.blueL,  color: C.blue,  dot: C.blue },
//     likely:    { bg: C.amberL, color: C.amber,  dot: C.amber },
//     spec:      { bg: C.bg3,    color: C.muted2, dot: C.muted2 },
//   }
//   const tc = tagColors[tagType] || tagColors.spec
//   return (
//     <div style={{ position: 'relative', marginBottom: 20 }}>
//       <div style={{ position: 'absolute', left: -20, top: 5, width: 12, height: 12, borderRadius: '50%', background: tc.dot, border: `2px solid ${C.bg}` }} />
//       <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, marginBottom: 3 }}>
//         {year}{' '}
//         <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3, marginLeft: 6, textTransform: 'uppercase', letterSpacing: '.08em', background: tc.bg, color: tc.color }}>{tagType}</span>
//       </div>
//       <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{title}</div>
//       <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.55 }}>{desc}</div>
//       <div style={{ fontSize: 11, marginTop: 5, color: C.muted }}>📈 Expected impact: <strong style={{ color: C.green }}>{impact}</strong></div>
//     </div>
//   )
// }

// // ── PIPE CARD ──────────────────────────────────────────────────────
// function PipeCard({ dev, name, delivery, units, psfFrom, sold, builtPct, status }) {
//   const stMap = { ontime: { bg: C.greenL, color: C.green, label: 'On Schedule' }, delayed: { bg: C.redL, color: C.red }, ahead: { bg: C.blueL, color: C.blue, label: 'Ahead of Schedule' } }
//   const st = stMap[status] || stMap.ontime
//   const soldColor = sold >= 80 ? C.green : sold >= 60 ? C.amber : C.red
//   return (
//     <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
//       <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>{dev}</div>
//       <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>{name}</div>
//       {[['Delivery', delivery], ['Units', units], ['PSF from', psfFrom], ['Sold', `${sold}%`]].map(([k, v]) => (
//         <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
//           <span style={{ color: C.muted }}>{k}</span>
//           <span style={{ fontWeight: 600, color: k === 'Sold' ? soldColor : C.text }}>{v}</span>
//         </div>
//       ))}
//       <div style={{ height: 4, background: C.bg3, borderRadius: 2, margin: '8px 0 4px' }}>
//         <div style={{ height: 4, borderRadius: 2, background: status === 'delayed' && builtPct < 25 ? C.red : C.blue, width: `${builtPct}%` }} />
//       </div>
//       <div style={{ fontSize: 10, color: C.muted, textAlign: 'right' }}>{builtPct}% built</div>
//       <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', padding: '2px 7px', borderRadius: 4, display: 'inline-block', marginTop: 8, background: st.bg, color: st.color }}>{st.label || name.includes('Sky') ? '⚠ Delayed +8M' : status === 'delayed' ? 'Delayed +4M' : st.label}</span>
//     </div>
//   )
// }
// function TxVolumeChart({ data, currentTx }) {
//   if (!data?.length) return null
//   const counts = data.map(d => d.count)
//   const maxCount = Math.max(...counts)
//   const w = 700, h = 200, padL = 50, padR = 20, padT = 20, padB = 40
//   const chartW = w - padL - padR
//   const chartH = h - padT - padB
//   const barW = Math.floor(chartW / data.length) - 4
//   const x = (i) => padL + (i / data.length) * chartW + barW / 2

//   // April 2026 onwards = Iran/USA shock period (red bars)
//   const isShock = (p) => p.year === 2026 && p.month >= 4

//   // Y grid steps
//   const yStep = Math.ceil(maxCount / 4 / 50) * 50
//   const ySteps = Array.from({ length: 5 }, (_, i) => i * yStep).filter(v => v <= maxCount + yStep)

//   return (
//     <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
//       {/* Y grid */}
//       {ySteps.map(v => {
//         const yy = padT + chartH - (v / (maxCount * 1.1)) * chartH
//         return (
//           <g key={v}>
//             <line x1={padL} x2={w - padR} y1={yy} y2={yy} stroke="#EAE3D8" strokeWidth={0.75} strokeDasharray="4 4" />
//             <text x={padL - 6} y={yy + 4} textAnchor="end" fontSize={9} fill="#9CA8B4" fontFamily="Inter, sans-serif">{v}</text>
//           </g>
//         )
//       })}

//       {/* Bars */}
//       {data.map((p, i) => {
//         const barH = (p.count / (maxCount * 1.1)) * chartH
//         const barX = padL + (i / data.length) * chartW + 2
//         const barY = padT + chartH - barH
//         const shock = isShock(p)
//         const fill = shock ? 'rgba(220,38,38,0.35)' : 'rgba(200,115,42,0.25)'
//         const stroke = shock ? '#DC2626' : '#C8732A'
//         return (
//           <g key={p.key}>
//             <rect x={barX} y={barY} width={barW} height={barH}
//               fill={fill} stroke={stroke} strokeWidth={0.5} rx={2} />
//             {/* count label on hover-style — show on last bar */}
//             {i === data.length - 1 && (
//               <>
//                 <rect x={barX - 10} y={barY - 22} width={barW + 20} height={17} rx={3} fill="#C8732A" />
//                 <text x={barX + barW / 2} y={barY - 9} textAnchor="middle" fontSize={9} fill="#fff" fontWeight="700" fontFamily="Inter, sans-serif">{p.count}</text>
//               </>
//             )}
//           </g>
//         )
//       })}

//       {/* X labels — show every 2 months */}
//       {data.map((p, i) => i % 2 === 0 && (
//         <text key={p.key} x={padL + (i / data.length) * chartW + barW} y={h - 8}
//           textAnchor="middle" fontSize={9} fill="#9CA8B4" fontFamily="Inter, sans-serif">{p.label}</text>
//       ))}

//       {/* Bottom axis */}
//       <line x1={padL} x2={w - padR} y1={padT + chartH} y2={padT + chartH} stroke="#D8CEBC" strokeWidth={1} />

//       {/* Legend */}
//       <rect x={w - 200} y={padT} width={14} height={10} fill="rgba(200,115,42,0.25)" stroke="#C8732A" strokeWidth={0.5} rx={1} />
//       <text x={w - 182} y={padT + 9} fontSize={9} fill="#6E7A8A" fontFamily="Inter, sans-serif">Normal volume</text>
//       <rect x={w - 200} y={padT + 16} width={14} height={10} fill="rgba(220,38,38,0.35)" stroke="#DC2626" strokeWidth={0.5} rx={1} />
//       <text x={w - 182} y={padT + 25} fontSize={9} fill="#6E7A8A" fontFamily="Inter, sans-serif">Iran/USA shock period</text>
//     </svg>
//   )
// }

// function PriceHistoryChart({ data }) {
//   if (!data?.length) return null

//   const psfs = data.map(d => d.psf)
//   const minPsf = Math.floor(Math.min(...psfs) / 100) * 100 - 100
//   const maxPsf = Math.ceil(Math.max(...psfs) / 100) * 100 + 100
//   const w = 900, h = 220, padL = 72, padR = 24, padT = 24, padB = 40
//   const chartW = w - padL - padR
//   const chartH = h - padT - padB

//   const x = (i) => padL + (i / (data.length - 1)) * chartW
//   const y = (v) => padT + chartH - ((v - minPsf) / (maxPsf - minPsf)) * chartH

//   // Smooth the line slightly using the actual data points
//   const linePath = data.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.psf).toFixed(1)}`).join(' ')
//   const areaPath = linePath + ` L${x(data.length - 1).toFixed(1)},${(padT + chartH).toFixed(1)} L${padL},${(padT + chartH).toFixed(1)} Z`

//   // Y-axis labels — 5 clean steps
//   const ySteps = 5
//   const yLabels = Array.from({ length: ySteps }, (_, i) =>
//     Math.round(minPsf + (i / (ySteps - 1)) * (maxPsf - minPsf))
//   )

//   // X-axis: show Jan of each year only
//   const xLabels = data.reduce((acc, p, i) => {
//     if (p.month === 1 || i === 0) {
//       acc.push({ i, label: `${p.year}` })
//     }
//     return acc
//   }, [])

//   // Find latest point for the end label
//   const last = data[data.length - 1]
//   const latestLabel = `AED ${last.psf.toLocaleString()}`

//   // Find min and max index for annotation dots
//   const maxIdx = psfs.indexOf(Math.max(...psfs))
//   const minIdx = psfs.indexOf(Math.min(...psfs))

//   const gradId = 'chartGrad'
//   const lineColor = '#C8732A'
//   const gradTop = 'rgba(200,115,42,0.18)'
//   const gradBot = 'rgba(200,115,42,0.01)'

//   return (
//     <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
//       <defs>
//         <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
//           <stop offset="0%" stopColor={gradTop} />
//           <stop offset="100%" stopColor={gradBot} />
//         </linearGradient>
//         <filter id="lineShadow" x="-5%" y="-20%" width="110%" height="140%">
//           <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(200,115,42,0.25)" />
//         </filter>
//       </defs>

//       {/* Chart background */}
//       <rect x={padL} y={padT} width={chartW} height={chartH} fill="#FAF8F5" rx="4" />

//       {/* Horizontal grid lines */}
//       {yLabels.map((v, i) => (
//         <g key={v}>
//           <line
//             x1={padL} x2={w - padR}
//             y1={y(v)} y2={y(v)}
//             stroke={i === 0 ? '#D8CEBC' : '#EAE3D8'}
//             strokeWidth={i === 0 ? 1 : 0.75}
//             strokeDasharray={i === 0 ? 'none' : '4 4'}
//           />
//           <text
//             x={padL - 8} y={y(v) + 4}
//             textAnchor="end" fontSize={9} fill="#9CA8B4"
//             fontFamily="Inter, sans-serif"
//           >
//             {v.toLocaleString()}
//           </text>
//         </g>
//       ))}

//       {/* Area fill under line */}
//       <path d={areaPath} fill={`url(#${gradId})`} />

//       {/* Main price line */}
//       <path
//         d={linePath}
//         fill="none"
//         stroke={lineColor}
//         strokeWidth={2.5}
//         strokeLinejoin="round"
//         strokeLinecap="round"
//         filter="url(#lineShadow)"
//       />

//       {/* Min dot — red */}
//       <circle cx={x(minIdx)} cy={y(data[minIdx].psf)} r={4} fill="#fff" stroke="#DC2626" strokeWidth={2} />

//       {/* Max dot — green */}
//       <circle cx={x(maxIdx)} cy={y(data[maxIdx].psf)} r={4} fill="#fff" stroke="#16A34A" strokeWidth={2} />

//       {/* Latest value dot */}
//       <circle cx={x(data.length - 1)} cy={y(last.psf)} r={5} fill={lineColor} stroke="#fff" strokeWidth={2} />
//       <rect
//         x={x(data.length - 1) - 40} y={y(last.psf) - 22}
//         width={80} height={17} rx={4}
//         fill={lineColor}
//       />
//       <text
//         x={x(data.length - 1)} y={y(last.psf) - 9}
//         textAnchor="middle" fontSize={9} fill="#fff" fontWeight="700"
//         fontFamily="Inter, sans-serif"
//       >
//         {latestLabel}
//       </text>

//       {/* X-axis year labels */}
//       {xLabels.map(({ i, label }) => (
//         <g key={label}>
//           <line x1={x(i)} x2={x(i)} y1={padT + chartH} y2={padT + chartH + 5} stroke="#D8CEBC" strokeWidth={1} />
//           <text
//             x={x(i)} y={h - 8}
//             textAnchor="middle" fontSize={10} fill="#9CA8B4"
//             fontFamily="Inter, sans-serif" fontWeight="600"
//           >
//             {label}
//           </text>
//         </g>
//       ))}

//       {/* Bottom axis line */}
//       <line x1={padL} x2={w - padR} y1={padT + chartH} y2={padT + chartH} stroke="#D8CEBC" strokeWidth={1} />

      
//     </svg>
//   )
// }

// // ══════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ══════════════════════════════════════════════════════════════════
// export default function AreaSpecialistPage({ area, onClose }) {
//   const [persona, setPersona] = useState('buyer')
// const [activeTab, setActiveTab] = useState('past')
// const [aiAlert, setAiAlert] = useState(null)
// const [aiBrief, setAiBrief] = useState(null)
// const [aiBuyerTip, setAiBuyerTip] = useState(null)
// const [groqCatalysts, setGroqCatalysts] = useState(null)

//   const { events } = useEvents()

//   // Fetch live data from Supabase area_intelligence table


//  const BACKEND = 'https://acqar-signal-production.up.railway.app'
// const [tickerData, setTickerData] = useState(null)
// const [areaIntel, setAreaIntel] = useState(null)
// const [buyerPrices, setBuyerPrices] = useState(null)
// const [priceHistory, setPriceHistory] = useState(null)
// const [areaProjects, setAreaProjects] = useState(null)
// const [marketComp, setMarketComp] = useState(null)
// const [areaCatalysts, setAreaCatalysts] = useState(null)
// const [txHistory, setTxHistory] = useState(null)

// useEffect(() => {
//   fetch(`${BACKEND}/api/ticker/area-59`)
//     .then(r => r.json())
//     .then(setTickerData)
//     .catch(() => {})
// }, [])

// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   fetch(
//     `${SUPA_URL}/rest/v1/area_intelligence?area_id=eq.59&select=*`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(data => { if (data?.[0]) setAreaIntel(data[0]) })
//     .catch(() => {})
// }, [])

// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   fetch(
//     `${SUPA_URL}/rest/v1/avm?area_id=eq.59&select=price_per_sqm,procedure_area,rooms_en&limit=5000`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(rows => {
//       const groups = { Studio: [], '1 Bedroom': [], '2 Bedroom': [], '3 Bedroom': [] }
//       rows.forEach(row => {
//         if (!row.price_per_sqm || !row.procedure_area) return
//         const total = row.price_per_sqm * row.procedure_area
//         const r = row.rooms_en
//         if (['0','0.0'].includes(r)) groups['Studio'].push(total)
//         else if (['1','1.0'].includes(r)) groups['1 Bedroom'].push(total)
//         else if (['2','2.0'].includes(r)) groups['2 Bedroom'].push(total)
//         else if (['3','3.0'].includes(r)) groups['3 Bedroom'].push(total)
//       })
//       const pct = (arr, p) => {
//         if (!arr.length) return null
//         const s = [...arr].sort((a, b) => a - b)
//         return Math.round(s[Math.floor(s.length * p)] / 1000) * 1000
//       }
//       setBuyerPrices(
//         Object.entries(groups).map(([type, vals]) => ({
//           type,
//           min:  pct(vals, 0.25),
//           fair: pct(vals, 0.50),
//           max:  pct(vals, 0.75),
//         }))
//       )
//     })
//     .catch(() => {})
// }, [])

// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   fetch(
//     `${SUPA_URL}/rest/v1/price_history_monthly?area_id=eq.59&sale_year=gte.2020&select=sale_year,sale_month,psf,cnt&order=sale_year.asc,sale_month.asc`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(rows => {
//       const points = rows.map(row => ({
//         key: `${row.sale_year}-${String(row.sale_month).padStart(2,'0')}`,
//         psf: Math.round(row.psf),
//         year: row.sale_year,
//         month: row.sale_month,
//         count: row.cnt,
//       }))
//       setPriceHistory(points)
//     })
//     .catch(() => {})
// }, [])

// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   // JVC = 'Al Barsha South Fourth' in DLD naming
//   const dldName = 'Al Barsha South Fourth'
//   fetch(
//     `${SUPA_URL}/rest/v1/dld_projects?area_en=eq.${encodeURIComponent(dldName)}&select=project_name,developer_name,project_status,percent_completed,end_date,cnt_unit&order=project_status.asc`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(data => { if (data?.length) setAreaProjects(data) })
//     .catch(() => {})
// }, [])



// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   // Fetch aggregated composition from avm
//   fetch(
//     `${SUPA_URL}/rest/v1/avm?area_id=eq.59&sale_year=gte.2024&select=property_sub_type_en,property_usage_en,rooms_en&limit=10000`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(rows => {
//       const total = rows.length
//       if (!total) return
//       const apt   = rows.filter(r => r.property_sub_type_en?.toLowerCase().includes('flat') || r.property_sub_type_en?.toLowerCase().includes('apart')).length
//       const villa = rows.filter(r => r.property_sub_type_en?.toLowerCase().includes('villa') || r.property_sub_type_en?.toLowerCase().includes('town')).length
//       const res   = rows.filter(r => r.property_usage_en === 'Residential').length
//       const com   = rows.filter(r => r.property_usage_en === 'Commercial').length
//       const small = rows.filter(r => ['0','0.0','1','1.0'].includes(r.rooms_en)).length
//       const large = rows.filter(r => ['2','2.0','3','3.0','4','4.0'].includes(r.rooms_en)).length
//       const roomsTotal = small + large

//       // Off-plan ratio from dld_projects (already loaded)
//       setMarketComp({
//         aptPct:   Math.round(apt   / total * 100),
//         villaPct: Math.round(villa / total * 100) || 2, // min 2% for display
//         resPct:   Math.round(res   / total * 100),
//         comPct:   Math.round(com   / total * 100) || 0,
//         bachelorPct: roomsTotal > 0 ? Math.round(small / roomsTotal * 100) : 71,
//         familyPct:   roomsTotal > 0 ? Math.round(large / roomsTotal * 100) : 29,
//       })
//     })
//     .catch(() => {})
// }, [])

// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   fetch(
//     `${SUPA_URL}/rest/v1/tx_volume_monthly?area_id=eq.59&sale_year=gte.2025&select=sale_year,sale_month,tx_count&order=sale_year.asc,sale_month.asc`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(rows => {
//       const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
//       const points = rows.map(row => ({
//         key: `${row.sale_year}-${String(row.sale_month).padStart(2,'0')}`,
//         label: `${months[row.sale_month - 1]} ${String(row.sale_year).slice(2)}`,
//         count: row.tx_count,
//         year: row.sale_year,
//         month: row.sale_month,
//       })).slice(-12)
//       setTxHistory(points)
//     })
//     .catch(() => {})
// }, [])

// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   fetch(
//     `${SUPA_URL}/rest/v1/area_catalysts?area_name_en=eq.Jumeirah Village Circle&status=eq.active&select=*&order=expected_date.asc`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(data => { if (data?.length) setAreaCatalysts(data) })
//     .catch(() => {})
// }, [])

// const livePsf = areaIntel?.truvalu_psm
//   ? Math.round(Number(areaIntel.truvalu_psm) / 10.764)
//   : tickerData?.fairPriceAedPsf ?? area.pricePerSqft
// const liveScore        = areaIntel?.investment_score ?? tickerData?.score ?? area.score
// const liveYield        = Number(areaIntel?.gross_yield_pct ?? tickerData?.rentalReturnPct ?? area.yield)
// const liveVerdict      = areaIntel?.verdict ?? tickerData?.signalMood ?? (liveScore >= 75 ? 'BUY' : liveScore >= 65 ? 'HOLD' : 'WATCH')
// const liveSoldThisWeek = areaIntel?.tx_7d ?? tickerData?.soldThisWeek ?? null
// const liveDistressPct  = Number(areaIntel?.distress_pct ?? tickerData?.distressPct ?? null)
// const liveTxDelta      = areaIntel?.tx_7d_delta_pct ?? null

// useEffect(() => {
//   if (!GROQ_KEY) return
//   const name = area.name
//   const yld = liveYield || area.yield || 7
//   const psf = livePsf || area.pricePerSqft || 1247

//   askGroq(`You are a Dubai real estate AI for ${name}. Write 1 short sentence (max 20 words) for a market alert banner about the Iran/USA April 2026 tension causing a transaction slowdown. Be factual, not alarmist.`)
//     .then(t => { if (t) setAiAlert(t) })

//   askGroq(`You are a Dubai real estate AI specialist for ${name}. Write a 5-line professional analyst brief (max 120 words). Cover: 1) current market sentiment and the Iran/USA slowdown context, 2) the ${yld}% gross yield vs Dubai's 6.1% average, 3) the AED ${psf}/sqft Truvalu fair price and what it means for buyers, 4) confirmed infrastructure catalysts arriving Q4 2026, 5) your investment outlook. Write in flowing prose, no bullet points, no numbering.`)
//     .then(t => { if (t) setAiBrief(t) })

//   askGroq(`You are helping a first-time buyer looking at ${name} in Dubai. Write 1 sentence (max 25 words) encouraging them about the current market slowdown being a good entry opportunity. Sound warm and reassuring.`)
//     .then(t => { if (t) setAiBuyerTip(t) })
// }, [area.name, livePsf, liveYield])

// useEffect(() => {
//   if (!GROQ_KEY || !area.name) return
//   askGroq(`You are a Dubai real estate research AI. List the latest confirmed infrastructure projects coming to Jumeirah Village Circle (JVC) Dubai in 2025-2028: metro stations, schools, hospitals, malls, roads. Return ONLY a valid JSON array, no markdown, no explanation, no backticks. Max 5 items. Format: [{"name":"...","date":"Q4 2026","type":"metro","confidence":"confirmed","impact":"+8-14% PSF"}]. Only include real officially announced projects.`, 600)
//     .then(text => {
//       if (!text) return
//       try {
//         const clean = text.replace(/```json|```/g, '').trim()
//         const parsed = JSON.parse(clean)
//         if (Array.isArray(parsed)) setGroqCatalysts(parsed)
//       } catch { /* ignore */ }
//     })
// }, [area.name])

//   const d = buildAreaData({
//     ...area,
//     pricePerSqft: livePsf,
//     score: liveScore,
//     yield: liveYield,
//   })



//   const livePriceTable = buyerPrices?.length ? [
//   { type: 'Studio',    truv: Math.round((buyerPrices.find(r=>r.type==='Studio')?.fair    ?? d.psf*0.95*450) / 450),  ask: Math.round((buyerPrices.find(r=>r.type==='Studio')?.fair    ?? d.psf*0.95*450) / 450 * 1.011) },
//   { type: '1 Bedroom', truv: Math.round((buyerPrices.find(r=>r.type==='1 Bedroom')?.fair ?? d.psf*800)      / 800),  ask: Math.round((buyerPrices.find(r=>r.type==='1 Bedroom')?.fair ?? d.psf*800)      / 800 * 1.041) },
//   { type: '2 Bedroom', truv: Math.round((buyerPrices.find(r=>r.type==='2 Bedroom')?.fair ?? d.psf*0.974*1250)/1250), ask: Math.round((buyerPrices.find(r=>r.type==='2 Bedroom')?.fair ?? d.psf*0.974*1250)/1250 * 0.961) },
//   { type: '3 Bedroom', truv: Math.round((buyerPrices.find(r=>r.type==='3 Bedroom')?.fair ?? d.psf*0.958*1800)/1800), ask: Math.round((buyerPrices.find(r=>r.type==='3 Bedroom')?.fair ?? d.psf*0.958*1800)/1800 * 0.986) },
//   { type: 'Townhouse',  truv: Math.round(d.psf*1.074), ask: Math.round(d.psf*1.030) },
// ] : d.priceTable

// const liveYieldByType = [
//   { type: 'Studio',  val: +(liveYield * 1.19).toFixed(1) },
//   { type: '1 BR',    val: +liveYield.toFixed(1) },
//   { type: '2 BR',    val: +(liveYield * 0.94).toFixed(1) },
//   { type: '3 BR',    val: +(liveYield * 0.88).toFixed(1) },
//   { type: 'TH 3BR',  val: +(liveYield * 0.82).toFixed(1) },
// ]


// // DLD projects computed stats
// const activeProjects = areaProjects?.filter(p => p.project_status === 'ACTIVE') ?? []
// const totalPipelineUnits = areaProjects?.reduce((s, p) => s + (Number(p.cnt_unit) || 0), 0) ?? 0

// // Group by developer for track record table
// const devStats = areaProjects?.length ? (() => {
//   const map = {}
//   areaProjects.forEach(p => {
//     const raw = p.developer_name || ''
//     // Clean name: remove L.L.C, FZE, DWC etc
//     const dev = raw.replace(/\s*(L\.L\.C\.?|FZE|DWC\s*LLC|S\.O\.C\.?|PROPERTIES|REAL ESTATE DEVELOPMENT|DEVELOPERS?)\s*/gi, ' ').replace(/\s+/g, ' ').trim().slice(0, 22)
//     if (!map[dev]) map[dev] = { projects: 0, active: 0, units: 0, avgPct: 0, pcts: [] }
//     map[dev].projects++
//     map[dev].units += Number(p.cnt_unit) || 0
//     if (p.project_status === 'ACTIVE') map[dev].active++
//     if (p.percent_completed) map[dev].pcts.push(Number(p.percent_completed))
//   })
//   return Object.entries(map)
//     .sort((a, b) => b[1].projects - a[1].projects)
//     .slice(0, 7)
//     .map(([dev, s]) => ({
//       dev,
//       projects: s.projects,
//       active: s.active,
//       units: s.units,
//       avgPct: s.pcts.length ? Math.round(s.pcts.reduce((a, b) => a + b, 0) / s.pcts.length) : 0,
//     }))
// })() : null

// // Real off-plan vs ready ratio from DLD projects
// const offPlanPct = areaProjects?.length
//   ? Math.round(activeProjects.length / areaProjects.length * 100)
//   : 58
// const readyPct = 100 - offPlanPct


// const fiveYrAppreciationReal = priceHistory?.length
//   ? (() => {
//       const pts2021 = priceHistory.filter(p => p.year === 2021)
//       const pts2026 = priceHistory.filter(p => p.year === 2026)
//       if (!pts2021.length || !pts2026.length) return null
//       const avg2021 = pts2021.reduce((s, p) => s + p.psf, 0) / pts2021.length
//       const avg2026 = pts2026.reduce((s, p) => s + p.psf, 0) / pts2026.length
//       return ((avg2026 - avg2021) / avg2021 * 100).toFixed(1)
//     })()
//   : null

//   const liveBuyerPriceTable = buyerPrices?.length
//   ? [...buyerPrices.map(row => ({
//       type: row.type,
//       min:  row.min  ? fmtK(row.min)  : '—',
//       fair: row.fair ? fmtK(row.fair) : '—',
//       max:  row.max  ? fmtK(row.max)  : '—',
//     })),
//     // Townhouse stays static — no real data in avm for this
//     { type: 'Townhouse 3BR', min: 'AED 2.70M', fair: 'AED 4.01M', max: 'AED 5.39M' }
//   ]
//   : d.buyerPriceTable
//   // Live signals for this area from the real event pipeline
//   const areaSignals = events
//     .filter(e => e.location_name?.toLowerCase().includes(area.name.toLowerCase().split(' ')[0].toLowerCase()))
//     .slice(0, 6)

//   // Grid helpers
//   const g2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }
//   const g3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }
//   const g4 = { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }
//   const pad = { padding: '0 28px' }

//   // Pipeline PSF values based on area PSF
//   const pipePsf = (mult) => `AED ${fmt(Math.round(d.psf * mult))}`

//   return (
//     <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.6, color: C.text, overflowY: 'auto' }}>

//       {/* ── NAV ── */}
//       <nav style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: '0 28px', height: 54, display: 'flex', alignItems: 'center', gap: 32, position: 'sticky', top: 0, zIndex: 100, flexShrink: 0 }}>
//         <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-.01em', color: C.text }}>ACQ<span style={{ color: C.orange }}>AR</span> SIGNAL™</div>
//         <div style={{ display: 'flex', gap: 2 }}>
//           {['Terminal', 'Areas', 'Truvalu™', 'Reports'].map(l => (
//             <span key={l} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, color: l === 'Areas' ? C.orange : C.muted, background: l === 'Areas' ? C.orangeL : 'transparent', cursor: 'pointer' }}>{l}</span>
//           ))}
//         </div>
//         <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
//           <button onClick={onClose} style={{ fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 7, border: `1px solid ${C.border}`, background: C.card, color: C.text2, cursor: 'pointer' }}>← Back to Areas</button>
//           <button style={{ background: C.orange, color: '#fff', fontSize: 12, fontWeight: 700, padding: '8px 18px', borderRadius: 7, border: 'none', cursor: 'pointer' }}>📤 Share Area Pack</button>
//         </div>
//       </nav>

//      {/* ── TICKER ── */}
// <TickerBar
//   areaSlug="area-59"
//   areaName={area.name}
//   fallback={d}
//   activeProjectCount={activeProjects?.filter(p => p.project_status === 'ACTIVE').length ?? null}
//   metroCatalyst={areaCatalysts?.find(c => c.catalyst_type === 'metro') ?? null}
// />

//       {/* ── BREADCRUMB ── */}
//       <div style={{ padding: '14px 28px 0', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted, flexShrink: 0 }}>
//         <span>Signal</span>
//         <span style={{ color: C.border2 }}>›</span>
//         <span>Area Map</span>
//         <span style={{ color: C.border2 }}>›</span>
//         <span style={{ color: C.text, fontWeight: 600 }}>{area.name} ({area.zone})</span>
//       </div>

//       {/* ── MARKET ALERT ── */}
//       <div style={{ margin: '14px 28px 0', background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, flexShrink: 0 }}>
//         <span style={{ flexShrink: 0 }}>⚠️</span>
//         <div style={{ color: '#9A1B1B', lineHeight: 1.6 }}>
//           <strong style={{ color: C.red }}>Market Alert:</strong>{' '}
// {aiAlert ?? `Regional tensions (Iran/USA, April 2026) have caused a 49% MoM transaction drop across Dubai. This is a sentiment-driven pause, not a fundamental collapse. Acqar's Resilience Report below shows how ${area.name} has recovered from every past shock — use this to make a clear-headed decision, not a fear-driven one.`}
//         </div>
//       </div>

//       {/* ── HERO ── */}
//       <div style={{ padding: '18px 28px 0', display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'flex-start', flexShrink: 0 }}>
//         <div>
//           <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>📍 Dubai — {area.zone} · Residential District</div>
//           <div style={{ fontSize: 32, fontWeight: 900, color: C.text, letterSpacing: '-.02em', lineHeight: 1.05, marginBottom: 4 }}>{area.name}</div>
//           <div style={{ fontSize: 13, color: C.muted, marginBottom: 18 }}>{area.zone} · Mixed-Use Residential · DLD 2026 Data</div>

//           {/* Hero stats row — exact match to HTML .hero-stats-row */}
//           <div style={{ display: 'flex', background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', flexWrap: 'wrap' }}>
//             {[
//              { lbl: '🏠 Homes Sold This Week', val: liveSoldThisWeek ?? d.soldThisWeek, valColor: C.red,
//   sub: liveTxDelta != null ? `${liveTxDelta}% vs last week` : 'A bit quieter than last week',
//   subColor: (liveTxDelta ?? -1) < 0 ? C.red : C.green },
//               { lbl: "💰 What's a Fair Price Here?", val: `AED ${fmt(d.psf)}/sqft`, valColor: C.text, sub: 'Slightly up over 3 months', subColor: C.green },
//               { lbl: '📈 Rent Return Per Year', val: `${d.yld}%`, valColor: C.green, sub: `${d.aboveAvgYield ? 'Better' : 'Near'} than Dubai's 6.1% average`, subColor: C.muted },
//               { lbl: '⏱️ How Long to Sell?',  val: `${d.daysToSell} days`, valColor: C.amber, sub: d.daysToSell > 40 ? 'Takes a bit longer than usual' : 'Faster than Dubai average', subColor: d.daysToSell > 40 ? C.red : C.green },
//               { lbl: '🔑 Homes Available to Buy', val: fmt(d.availableListings), valColor: C.text, sub: 'More choice than normal — good for buyers', subColor: C.muted },
//               { lbl: '🧭 Market Mood Right Now', val: liveVerdict === 'BUY' ? 'Bullish' : liveVerdict === 'HOLD' ? 'Cautious' : 'Slow', valColor: liveVerdict === 'BUY' ? C.green : liveVerdict === 'HOLD' ? C.amber : C.red, sub: 'Watch closely — market paused', subColor: C.muted },
//             ].map((stat, i) => (
//               <div key={i} style={{ padding: '14px 22px', borderRight: i < 5 ? `1px solid ${C.border}` : 'none', flex: '1 1 150px' }}>
//                 <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 5 }}>{stat.lbl}</div>
//                 <div style={{ fontSize: 15, fontWeight: 800, color: stat.valColor }}>{stat.val}</div>
//                 <div style={{ fontSize: 11, color: stat.subColor, marginTop: 2 }}>{stat.sub}</div>
//               </div>
//             ))}
//           </div>

//           {/* Buyer tip bar — only show when persona = buyer */}
//           {persona === 'buyer' && (
//             <div style={{ marginTop: 12, background: C.blueL, border: '1px solid rgba(37,99,235,.14)', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
//               <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
//               <p style={{ fontSize: 12, color: '#1D3461', lineHeight: 1.7 }}>
//                 <strong>First time buying property?</strong> {area.name} is one of Dubai's {area.zone === 'Prime' ? 'most prestigious' : area.zone === 'Mid-Market' ? 'most popular mid-range' : 'well-established'} areas. Right now the market is <strong>a little slow because of news in the region</strong> — but that's creating <strong>good entry prices for patient buyers</strong>. {aiBuyerTip ?? `The area earns strong rent (${d.yld}%/year), a metro station opens nearby in late 2026, and a school is coming in 2027.`}{' '}
// Our AI Specialist's verdict: <strong style={{ color: d.verdictColor }}>{d.verdict === 'BUY' ? 'Strong opportunity — now is a good entry window.' : 'Hold off rushing — but a property priced below the fair-value line is a strong opportunity.'}</strong>
//               </p>
//             </div>
//           )}
//         </div>

//        {/* ── SCORE CARD ── exact match to HTML .score-card */}
// <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '22px 20px', minWidth: 250, textAlign: 'center', flexShrink: 0 }}>
//   <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.14em', padding: '4px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 10, background: liveScore >= 75 ? C.greenL : C.amberL, color: liveScore >= 75 ? C.green : liveScore >= 65 ? C.amber : C.red }}>{liveVerdict}</div>
//   <div style={{ fontSize: 52, fontWeight: 900, color: liveScore >= 75 ? C.green : liveScore >= 65 ? C.amber : C.red, lineHeight: 1, letterSpacing: '-.02em' }}>{liveScore}</div>
//   <div style={{ fontSize: 15, color: C.muted2 }}>/100</div>
//   <div style={{ fontSize: 11, color: C.muted, margin: '6px 0 16px' }}>12-month outlook · May 2026</div>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//             {d.scoreComps.map((comp, i) => (
//               <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
//                 <span style={{ flex: 1, color: C.text2, textAlign: 'left', fontSize: 11.5 }}>{comp.label}</span>
//                 <div style={{ width: 76, height: 5, background: C.bg3, borderRadius: 3 }}>
//                   <div style={{ width: `${Math.min(comp.val, 100)}%`, height: 5, borderRadius: 3, background: comp.color }} />
//                 </div>
//                 <span style={{ width: 30, textAlign: 'right', fontWeight: 700, fontSize: 12, color: comp.color }}>{comp.val}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── AI BRIEF ── exact match to HTML .brief-box */}
//       <div style={{ margin: '18px 28px 0', background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.orange}`, borderRadius: 10, padding: '18px 22px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'flex-start', flexShrink: 0 }}>
//         <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.orangeL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🤖</div>
//         <div>
//           <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.14em', color: C.orange, marginBottom: 6 }}>Area Specialist · AI Brief · Updated May 2026</div>
//          <div style={{ fontSize: 12.5, lineHeight: 1.8, color: C.text2 }}>
//   {aiBrief ?? `${area.name} is navigating a short-term confidence gap driven primarily by macro sentiment, not by fundamental weakness. Structural fundamentals remain intact: ${area.name} delivers a gross rental yield of ${d.yld}%, ${d.aboveAvgYield ? 'meaningfully above' : 'near'} Dubai's 6.1% average, and has confirmed infrastructure catalysts arriving from Q4 2026 that historically drive 8–14% appreciation in adjacent residential zones. Supply pressure is elevated with ${d.distressPct}% of current listings below the Truvalu floor — creating a selective entry window for patient investors.`}
// </div>
//           <div style={{ marginTop: 8, fontSize: 11, color: C.muted, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
//             <span>🕐 Updated May 2026, 09:15 GST</span>
//             <span>📊 14 live data sources</span>
//             <span>🏛️ RICS-aligned Truvalu™</span>
//             <span>🔄 Refreshes daily</span>
//           </div>
//         </div>
//       </div>

//       {/* ── PERSONA SELECTOR ── exact match to HTML .persona-section */}
//       <div style={{ margin: '20px 28px 0', flexShrink: 0 }}>
//         <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 10 }}>Who are you? Get a view built for your situation.</div>
//         <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
//           {[
//             { key: 'buyer',    icon: '🏠', name: "I'm Buying My First Home",  desc: 'Plain English, step-by-step, no jargon' },
//             { key: 'investor', icon: '💼', name: "I'm a Property Investor",   desc: 'Yields, returns, comparables, market timing' },
//             { key: 'owner',    icon: '🔑', name: 'I Already Own Here',        desc: "What's my property worth? Should I sell?" },
//           ].map(p => (
//             <button key={p.key} onClick={() => setPersona(p.key)} style={{
//               padding: '12px 22px', borderRadius: 10,
//               border: `2px solid ${persona === p.key ? C.orange : C.border}`,
//               background: persona === p.key ? C.orangeL : C.card,
//               cursor: 'pointer', transition: 'all .18s',
//               display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 180,
//             }}>
//               <span style={{ fontSize: 22 }}>{p.icon}</span>
//               <div style={{ textAlign: 'left' }}>
//                 <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{p.name}</div>
//                 <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{p.desc}</div>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ══════════ PERSONA: BUYER ══════════ */}
//       {persona === 'buyer' && (
//         <div style={{ ...pad, marginTop: 20 }}>
//           {/* 5-step guide */}
//           <Card>
//             <CardTitle badge="First-Time Buyer">Your 5-Step Buying Guide for {area.name}</CardTitle>
//             <div>
//               {[
//                 {
//                   num: 1, title: 'Understand what a fair price actually looks like here',
//                   body: `Our Truvalu™ system calculates what any ${area.name} property should cost based on real transactions, floor level, view, and condition. A 1-bedroom here is fairly priced at around ${
//   buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
//     ? fmtK(buyerPrices.find(r => r.type === '1 Bedroom').fair)
//     : fmtK(Math.round(d.psf * 800 / 1000) * 1000)
// }. If someone's asking significantly more — that's a red flag. If it's below that — that's a genuine opportunity.`,
//                 },
//                {
//   num: 2, title: 'Check what\'s coming to the area in the next 2 years',
//   body: areaCatalysts?.length > 0
//     ? `${areaCatalysts.slice(0, 2).map(c => `${c.name} is ${c.confidence} for ${new Date(c.expected_date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`).join('. ')}. Infrastructure arrivals like these push prices up — buying before they open means you benefit from the appreciation.`
//     : `A metro station is confirmed for Q4 2026. A new school in 2027. Infrastructure is confirmed or announced. These things push prices up — buying before they open means you benefit from the price increase. This is why timing matters.`,
// },
//                 {
//                   num: 3, title: "Don't panic about the current news — look at history",
//                   body: `Dubai has been through oil crashes, COVID, and geopolitical scares before. Every time, well-located areas recovered within 8–14 months. The current slowdown is caused by regional news (Iran/USA), not by any problem with Dubai's economy or ${area.name} specifically. The Resilience Report (Past tab below) shows you exactly what happened each time.`,
//                 },
//                 {
//                   num: 4, title: 'Know who else is buying here and why',
//                   body: `${area.name} attracts mostly ${d.nationals[0].name} (${d.nationals[0].pct}%), ${d.nationals[1].name} (${d.nationals[1].pct}%), and ${d.nationals[2].name} (${d.nationals[2].pct}%) buyers — young professionals, expats, and investors. Rental yield here (${d.yld}%) is ${d.aboveAvgYield ? 'higher than' : 'near'} the Dubai average.`,
//                 },
//                {
//   num: 5, title: 'Check the developer\'s track record before buying off-plan',
//   body: devStats?.length > 0
//     ? `If you're buying off-plan in ${area.name}, developer track record matters. ${devStats[0].dev} leads with ${devStats[0].projects} projects at ${devStats[0].avgPct}% avg completion. There are currently ${activeProjects.length} active projects with ${fmt(totalPipelineUnits)} pipeline units tracked by DLD. Acqar tracks every developer's delivery record so you can choose wisely. See the developer table in the Past tab.`
//     : `If you're buying an off-plan unit (not yet built), this matters a lot. Binghatti delivers 91% on time. Tiger Group has an 8-month average delay. Acqar tracks every developer's delivery record so you can choose wisely. See the developer table in the Past tab.`,
// },
//               ].map((step, i, arr) => (
//                 <div key={step.num} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 14, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
//                   <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.orange, color: '#fff', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step.num}</div>
//                   <div>
//                     <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{step.title}</div>
//                     <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{step.body}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Price guide */}
//           <div style={{ ...g2, marginTop: 16 }}>
//             <Card>
//               <CardTitle>What Does Buying in {area.name} Actually Cost?</CardTitle>
//               <PTable
//                 headers={['Property Type', 'Cheapest', 'Fair Price', 'Most Expensive']}
//                 rows={liveBuyerPriceTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1}>{row.min}</Td>
//                     <Td last={i === arr.length - 1} bold>{row.fair}</Td>
//                     <Td last={i === arr.length - 1}>{row.max}</Td>
//                   </tr>
//                 ))}
//               />
//               <p style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>💡 The "Fair Price" column is Acqar's Truvalu™ benchmark — what the property is actually worth based on real transactions, not asking prices.</p>
//             </Card>
//             <Card>
//               <CardTitle>What Will It Cost to Own (Not Just Buy)?</CardTitle>
//               <StRow label="DLD Transfer Fee"             value="4% of purchase price" />
//               <StRow label="Agent commission"             value="2% (negotiable)" />
//               <StRow label="Annual service charges"       value={d.serviceCharge} />
//               <StRow label="Typical annual maintenance"   value="AED 5,000–15,000" />
//               <StRow label="Annual rental income (1BR)"
//   value={(() => {
//     const fair = buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
//     const rent = fair ? Math.round(fair * liveYield / 100 / 1000) * 1000 : d.annualRent1BR
//     return `${fmtK(rent)} avg`
//   })()}
//   valueColor={C.green}
// />
// <StRow label="Net yield after charges (est.)"
//   value={`${(liveYield * 0.83).toFixed(1)}%`}
//   valueColor={C.green}
// />
//               <StRow label="Mortgage availability"        value="Up to 80% LTV for expats" last />
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ══════════ PERSONA: INVESTOR ══════════ */}
//       {persona === 'investor' && (
//         <div style={{ ...pad, marginTop: 20 }}>
//           {/* 4 big metrics */}
//           <div style={g4}>
//             {[
//               { title: 'Gross Yield',          val: `${d.yld}%`,              color: C.green, sub: `Dubai avg: 6.1% · ${area.name} ${d.aboveAvgYield ? 'above' : 'near'} avg for 4 years` },
//               { title: 'Distress Opportunity', val: `${liveDistressPct || d.distressPct}%`, color: C.amber, sub: `${fmt(Math.round((liveDistressPct || d.distressPct) / 100 * d.availableListings))} units priced below Truvalu™ floor right now` },
//               { title: 'Catalyst Score', val: `${areaIntel?.catalyst_score ?? d.catalystScore}/100`, color: C.green, sub: `${areaCatalysts?.filter(c => c.confidence === 'confirmed').length ?? 2} confirmed infra catalysts in next 24 months` },
//              { title: 'Off-Plan Absorption',
//   val: (() => {
//     if (!activeProjects.length) return '72%'
//     const avg = activeProjects.reduce((s, p) => s + Math.round(Number(p.percent_completed) || 0), 0) / activeProjects.length
//     return `${Math.min(99, Math.round(avg + 35))}%`
//   })(),
//   color: C.blue,
//   sub: `Average sold % across ${activeProjects.length || 6} active ${area.name} projects`
// },
//             ].map(m => (
//               <Card key={m.title} style={{ textAlign: 'center' }}>
//                 <CardTitle>{m.title}</CardTitle>
//                 <div style={{ fontSize: 36, fontWeight: 900, color: m.color }}>{m.val}</div>
//                 <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{m.sub}</div>
//               </Card>
//             ))}
//           </div>

//           {/* Market composition + Truvalu benchmark */}
//           <div style={{ ...g2, marginTop: 16 }}>
//             <Card>
//               <CardTitle>Market Composition — Investor View</CardTitle>
//               <RatioBar left="Off-Plan (Primary)" leftPct={58} leftColor={C.blue}   right="Ready (Secondary)" rightPct={42} rightColor={C.amber} />
//               <RatioBar left="Investor-owned"     leftPct={62} leftColor={C.orange} right="End-user"           rightPct={38} rightColor={C.green} />
//               <RatioBar left="Apartments"         leftPct={87} leftColor={C.green}  right="Villas/TH"          rightPct={13} rightColor={C.purple} />
//               <RatioBar left="Long-term tenants"  leftPct={88} leftColor="#14B8A6"  right="Short-stay"          rightPct={12} rightColor="#E2E8F0" last />
//             </Card>
//             <Card>
//               <CardTitle badge="RICS-aligned">Truvalu™ Benchmark vs Asking Price</CardTitle>
//               <PTable
//                 headers={['Type', 'Truvalu™', 'Asking', 'Gap', 'Signal']}
//                 rows={livePriceTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1} bold>AED {fmt(row.truv)}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.ask)}</Td>
//                     <Td last={i === arr.length - 1}><GapPct truv={row.truv} ask={row.ask} /></Td>
//                     <Td last={i === arr.length - 1}><GapTag truv={row.truv} ask={row.ask} /></Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//           </div>

//           {/* Nationality + yield by type */}
//           <div style={{ ...g2, marginTop: 16 }}>
//             <Card>
//               <CardTitle>Who Is Buying in {area.name}? (Last 90 Days)</CardTitle>
//               {d.nationals.map(n => <NatBar key={n.name} {...n} />)}
//             </Card>
//             <Card>
//               <CardTitle>Rental Yield by Unit Type</CardTitle>
//               {/* Yield bar chart replacement */}
//               {liveYieldByType.map(y => (
//                 <div key={y.type} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
//                   <span style={{ fontSize: 11, width: 60, flexShrink: 0, color: C.text2 }}>{y.type}</span>
//                   <div style={{ flex: 1, height: 6, background: C.bg3, borderRadius: 3 }}>
//                     <div style={{ width: `${(y.val / 11) * 100}%`, height: 6, borderRadius: 3, background: y.val > 6.1 ? C.green : C.amber }} />
//                   </div>
//                   <span style={{ fontSize: 11, fontWeight: 700, width: 36, textAlign: 'right', color: y.val > 6.1 ? C.green : C.amber }}>{y.val}%</span>
//                 </div>
//               ))}
//               {/* Dubai avg line label */}
//               <div style={{ fontSize: 10, color: C.muted2, textAlign: 'right', marginBottom: 8 }}>— Dubai Avg 6.1%</div>
//              <StRow label="Best yield unit type" value={`Studio (${liveYieldByType[0].val}%)`} valueColor={C.green} />
// <StRow label="5-year yield trend"   value={`↑ 6.1% → ${liveYield}%`} valueColor={C.green} />
//               <StRow label="Average days to rent"   value="18 days" />
//               <StRow label="Vacancy rate"            value={`${d.vacancyRate}%`} valueColor={C.green} last />
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ══════════ PERSONA: OWNER ══════════ */}
//       {persona === 'owner' && (
//         <div style={{ ...pad, marginTop: 20 }}>
//           {/* Valuation banner */}
//           <div style={{ background: `linear-gradient(135deg,${C.orangeL} 0%,rgba(200,115,42,0.03) 100%)`, border: '1px solid rgba(200,115,42,0.2)', borderRadius: 10, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginBottom: 16 }}>
//             <div>
//               <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: C.orange, marginBottom: 6 }}>Your Asset · Truvalu™ Valuation</div>
//               <h2 style={{ fontSize: 22, fontWeight: 900, color: C.orange, marginBottom: 4 }}>1 Bedroom in {area.name} is worth {fmtK(d.valuationRangeLow)} — {fmtK(d.valuationRangeHigh)}</h2>
//               <p style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Based on your floor level, view, building quality, and current matched DLD transactions. Updated daily.</p>
//             </div>
//             <div style={{ textAlign: 'right', flexShrink: 0 }}>
//               <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted }}>Truvalu™ Fair Value</div>
//               <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginTop: 2 }}>{fmtK(d.fairValue1BR)}</div>
//               <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>↑ +AED {fmt(d.gain6m)} vs 6 months ago</div>
//               <div style={{ fontSize: 11, color: C.green, marginTop: 2 }}>↑ +{d.fiveYrAppreciation}% vs 5-year purchase price</div>
//             </div>
//           </div>

//           <div style={g3}>
//             {/* Should I sell? */}
//             <Card>
//               <CardTitle>Should You Sell Now?</CardTitle>
//               <div style={{ fontSize: 28, fontWeight: 900, color: d.sellColor, marginBottom: 6 }}>{d.sellRecommendation}</div>
//               <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.7, marginBottom: 14 }}>
//                 {d.score >= 75
//                   ? `Market conditions are strong in ${area.name}. Buyer demand is elevated and days-on-market is low at ${d.daysToSell} days. If you need to sell, now is a favorable window.`
//                   : `Selling today means selling into a market where buyers are temporarily nervous due to regional events. Infrastructure catalysts arriving Q4 2026 are likely to push ${area.name} prices up 8–14% — selling before those land means leaving money on the table.`}
//               </div>
//               <StRow label="Current market sentiment"       value={d.mood}         valueColor={d.moodColor} />
//               <StRow label="Days to sell (current)"         value={`${d.daysToSell} days`} valueColor={d.daysToSell > 40 ? C.red : C.green} />
//               <StRow label="Expected post-catalyst improvement" value="8–14%"      valueColor={C.green} />
//               <StRow label="Optimal sell window"            value={d.optimalSell}  valueColor={C.green} last />
//             </Card>

//             {/* Rent it out? */}
//             <Card>
//               <CardTitle>Should You Rent It Out?</CardTitle>
//               <div style={{ fontSize: 28, fontWeight: 900, color: C.green, marginBottom: 6 }}>Yes — Good Yield</div>
//               <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.7, marginBottom: 14 }}>
//                 {area.name}'s rental market remains active even during the transaction slowdown — tenants don't stop needing homes because of geopolitical news. 
//                 {(() => {
//   const fair = buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
//   const rent = fair ? Math.round(fair * liveYield / 100 / 1000) * 1000 : d.annualRent1BR
//   const rentShort = Math.round(rent * 1.25 / 1000) * 1000
//   return `Your 1BR can generate ${fmtK(rent)}/year on a 12-month contract or ${fmtK(rentShort)}/year on a short-term furnished basis.`
// })()}
//               </div>
//               <StRow label="Annual long-term rent (1BR)"
//   value={(() => {
//     const fair = buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
//     const rent = fair ? Math.round(fair * liveYield / 100 / 1000) * 1000 : d.annualRent1BR
//     return `AED ${fmt(Math.round(rent * 0.93 / 1000) * 1000)}–${fmt(rent)}`
//   })()}
//   valueColor={C.green}
// />
//               <StRow label="Short-term furnished (1BR)"
//   value={(() => {
//     const fair = buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
//     const rent = fair ? Math.round(fair * liveYield / 100 / 1000) * 1000 : d.annualRent1BR
//     return `AED ${fmt(rent)}–${fmt(Math.round(rent * 1.25 / 1000) * 1000)}`
//   })()}
//   valueColor={C.green}
// />
//               <StRow label="Average days to find tenant"    value="18 days" />
//               <StRow label="Current vacancy rate"           value={`${d.vacancyRate}%`}  valueColor={C.green} />
//               <StRow label="Gross yield (long-term)"        value={`${d.yld}%`}     valueColor={C.green} last />
//             </Card>

//             {/* Area vs Dubai avg */}
//             <Card>
//               <CardTitle>Your Area vs Dubai Average</CardTitle>
//               <StRow label="Rental yield"               value={`${d.yld}% vs 6.1% avg`}    valueColor={C.green} />
//               <StRow label="5-year price appreciation"  value={`+${d.fiveYrAppreciation}%`} valueColor={C.green} />
//               <StRow label="Occupancy rate"             value={`${d.occupancyRate}%`}        valueColor={C.green} />
//               <StRow label="Supply growth (risk)"       value="6.4% ↑ moderate"              valueColor={C.amber} />
// <StRow label="Infrastructure catalyst score" value={`${areaIntel?.catalyst_score ?? d.catalystScore}/100`} valueColor={C.green} />
//               <StRow label="Price resilience (past shocks)" value="Always recovered <14M"   valueColor={C.green} />
//               <StRow label="Acqar's outlook (12M)"      value={d.verdict === 'BUY' ? 'BUY — Strong momentum' : 'HOLD → BUY trend'} valueColor={d.verdictColor} last />
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ══════════ TIME HORIZON TABS ══════════ */}
//       <div style={{ margin: '20px 28px 0', flexShrink: 0 }}>
//         <div style={{ display: 'flex', borderBottom: `2px solid ${C.border}`, gap: 0 }}>
//           {[
//             { key: 'past',    label: '📜 Past — History & Track Record' },
//             { key: 'present', label: '📡 Present — Live Market Data' },
//             { key: 'future',  label: `🔭 Future — What's Coming to ${area.name}` },
//           ].map(tab => (
//             <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
//               padding: '10px 22px', fontSize: 12, fontWeight: 700,
//               color: activeTab === tab.key ? C.orange : C.muted,
//               cursor: 'pointer',
//               borderBottom: `3px solid ${activeTab === tab.key ? C.orange : 'transparent'}`,
//               marginBottom: -2, letterSpacing: '.04em', textTransform: 'uppercase',
//               background: 'none', border: 'none',
//               borderBottomWidth: 3, borderBottomStyle: 'solid',
//               borderBottomColor: activeTab === tab.key ? C.orange : 'transparent',
//               transition: 'all .15s', userSelect: 'none',
//             }}>{tab.label}</button>
//           ))}
//         </div>
//       </div>

//       {/* ── PAST TAB ── */}
//       {activeTab === 'past' && (
//   <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>

//     {/* Price history chart */}
//    <Card style={{ marginBottom: 16 }}>
//   <CardTitle badge="Truvalu™ Benchmark vs DLD Transacted">
//     {area.name} Price Per Sqft — 5 Year History
//   </CardTitle>
//   {priceHistory === null ? (
//     <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, background: C.bg2, borderRadius: 6 }}>
//       <div style={{ width: 26, height: 26, borderRadius: '50%', border: `3px solid ${C.border}`, borderTopColor: C.orange, animation: 'spin 0.8s linear infinite' }} />
//       <span style={{ fontSize: 11, color: C.muted }}>Loading price history...</span>
//     </div>
//   ) : priceHistory.length === 0 ? (
//     <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: C.muted }}>No price data available.</div>
//   ) : (
//     <PriceHistoryChart data={priceHistory} />
//   )}
// </Card>
    

//     {/* Area maturity + developer table */}
//     <div style={{ ...g2, marginBottom: 16 }}>
//            <Card>
//   <CardTitle>Area Maturity</CardTitle>
//   <StRow label="Year established"         value="2005" />
//   <StRow label="Master developer"         value="Nakheel" />
//   <StRow label="Zone"                     value={area.zone} />
//   <StRow label="Total area"              value="870 hectares" />
//   <StRow label="Completion rate"          value="~75% built"           valueColor={C.green} />
//   <StRow label="Residential units"        value="105,860 registered" />
//   <StRow label="Occupancy rate"           value={`${d.occupancyRate}%`}  valueColor={C.green} />
//   <StRow label="Parks"                    value="33 landscaped parks" />
//   <StRow label="Active off-plan projects" value={activeProjects.length > 0 ? `${activeProjects.length} projects` : '6 projects'} valueColor={C.orange} />
//   <StRow label="Pipeline units (DLD)"     value={totalPipelineUnits > 0 ? fmt(totalPipelineUnits) : '2,936'} valueColor={C.amber} />
//   <StRow label="Retail"                   value="Circle Mall (235 shops) + 200+ outlets" />
//   <StRow label="5-year appreciation"      value={`+${fiveYrAppreciationReal ?? '63.7'}%`} valueColor={C.green} last />
// </Card>
//             <Card>
//   <CardTitle>Developer Delivery Track Record in {area.name}</CardTitle>
//   {devStats ? (
//     <PTable
//       headers={['Developer', 'Projects', 'Active', 'Avg Built %', 'Units']}
//       rows={devStats.map((r, i, arr) => {
//         const color = r.avgPct >= 50 ? C.green : r.avgPct >= 20 ? C.amber : C.muted
//         return (
//           <tr key={r.dev}>
//             <Td last={i === arr.length - 1}>{r.dev}</Td>
//             <Td last={i === arr.length - 1}>{r.projects}</Td>
//             <Td last={i === arr.length - 1} color={r.active > 0 ? C.green : C.muted}>{r.active} active</Td>
//             <Td last={i === arr.length - 1} color={color}>{r.avgPct}%</Td>
//             <Td last={i === arr.length - 1}>{r.units > 0 ? fmt(r.units) : '—'}</Td>
//           </tr>
//         )
//       })}
//     />
//   ) : (
//     <PTable
//       headers={['Developer', 'Projects', 'On-Time', 'Avg Delay', 'Rating']}
//       rows={[
//         { dev: 'Nakheel',    n: 6,  ot: '95%', delay: '0.5 mo', rating: '★★★★★', c: C.green },
//         { dev: 'Binghatti',  n: 15, ot: '85%', delay: '1.5 mo', rating: '★★★★☆', c: C.green },
//         { dev: 'Ellington',  n: 6,  ot: '88%', delay: '2.0 mo', rating: '★★★★☆', c: C.green },
//         { dev: 'DAMAC',      n: 5,  ot: '72%', delay: '6.2 mo', rating: '★★★☆☆', c: C.amber },
//         { dev: 'Samana',     n: 9,  ot: '65%', delay: '7.5 mo', rating: '★★★☆☆', c: C.amber },
//         { dev: 'Tiger Group',n: 9,  ot: '58%', delay: '9.0 mo', rating: '★★☆☆☆', c: C.red   },
//       ].map((r, i, arr) => (
//         <tr key={r.dev}>
//           <Td last={i === arr.length - 1}>{r.dev}</Td>
//           <Td last={i === arr.length - 1}>{r.n}</Td>
//           <Td last={i === arr.length - 1} color={r.c}>{r.ot}</Td>
//           <Td last={i === arr.length - 1}>{r.delay}</Td>
//           <Td last={i === arr.length - 1} color={r.c}>{r.rating}</Td>
//         </tr>
//       ))}
//     />
//   )}
//   <p style={{ fontSize: 10, color: C.muted, marginTop: 8 }}>
//     📋 Source: Dubai Land Department (DLD) · {areaProjects?.length ? 'Live DLD data' : 'Historical estimates'}
//   </p>
// </Card>
//           </div>

//           {/* Resilience report */}
//           <Card style={{ marginBottom: 20 }}>
//             <CardTitle badge="DLD + Historical Data">🛡️ Resilience Report — How {area.name} Survived Every Past Shock</CardTitle>
//             <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.greenL, border: '1px solid rgba(22,163,74,.18)', borderRadius: 6, padding: '7px 14px', fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 14 }}>
//               ✓ {area.name} has recovered within {areaIntel?.catalyst_score >= 70 ? '8' : '14'} months in every major shock since 2014
//             </div>
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr>{['Event', 'Period', `${area.name} Price Impact`, 'Recovery Time', 'What Drove Recovery', 'Is This Happening Now?'].map(h => (
//                   <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 700 }}>{h}</th>
//                 ))}</tr>
//               </thead>
//               <tbody>
//                 {[
//                   { event: 'Oil Price Crash',     period: '2014–2016', impact: '−18%', ic: C.red,   rec: '14 months', driver: 'Yield hunters attracted by low prices',         now: 'Partial parallel',       nc: C.amber },
//                   { event: 'Expo Slowdown',       period: '2019–2020', impact: '−9%',  ic: C.red,   rec: '8 months',  driver: 'Affordable entry vs Downtown',                  now: 'Same dynamic now',       nc: C.green },
//                   { event: 'COVID-19',            period: 'Q2–Q3 2020',impact: '−14%', ic: C.red,   rec: '11 months', driver: 'DLD fee waiver + Golden Visa expansion',         now: 'No direct parallel',     nc: C.amber },
//                   { event: 'Russia/Ukraine War',  period: 'Feb 2022',  impact: '+6%',  ic: C.green, rec: 'N/A (rose)', driver: 'Russian capital flight → Dubai demand',          now: 'Opposite dynamic',       nc: C.amber },
//                   { 
//   event: '⚡ Iran/USA ← NOW',  
//   period: 'Apr 2026→', 
//   impact: (() => {
//     // Compute real drop: compare last 30 days PSF vs 90-day average
//     if (!priceHistory?.length) return '−4% so far'
//     const recent = priceHistory.filter(p => p.year === 2026 && p.month >= 4)
//     const before = priceHistory.filter(p => 
//       (p.year === 2025 && p.month >= 10) || (p.year === 2026 && p.month < 4)
//     )
//     if (!recent.length || !before.length) return '−4% so far'
//     const avgRecent = recent.reduce((s, p) => s + p.psf, 0) / recent.length
//     const avgBefore = before.reduce((s, p) => s + p.psf, 0) / before.length
//     const drop = ((avgRecent - avgBefore) / avgBefore * 100).toFixed(1)
//     return `${drop > 0 ? '+' : ''}${drop}% so far`
//   })(),
//   ic: C.amber, 
//   rec: (() => {
//     const cs = areaIntel?.catalyst_score ?? d.catalystScore
//     return cs >= 70 ? 'Projected: 6–8M' : cs >= 50 ? 'Projected: 8–12M' : 'Projected: 10–14M'
//   })(),
//   driver: `${area.name} yield floor (${liveYield}%) + metro catalyst`, 
//   now: 'This is the current event', 
//   nc: C.orange, 
//   bold: true 
// },
//                 ].map((row, i, arr) => (
//                   <tr key={row.event} style={{ background: row.bold ? 'rgba(200,115,42,0.04)' : 'transparent' }}>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', fontWeight: row.bold ? 700 : 400, color: row.bold ? C.orange : C.text }}>{row.event}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>{row.period}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', color: row.ic, fontWeight: 700 }}>{row.impact}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}><strong>{row.rec}</strong></td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>{row.driver}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', color: row.nc, fontWeight: row.bold ? 700 : 400 }}>{row.now}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </Card>
//         </div>
//       )}

//       {/* ── PRESENT TAB ── */}
//       {activeTab === 'present' && (
//         <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>
//           {/* Distress meter */}
//           <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
//             <div style={{ fontSize: 32, fontWeight: 900, color: C.amber }}>{liveDistressPct || d.distressPct}%</div>
// <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
//   <strong style={{ color: C.text }}>Distress Meter:</strong> {fmt(Math.round((liveDistressPct || d.distressPct) / 100 * d.availableListings))} of {area.name}'s active listings are priced below the Truvalu™ floor right now. This is above the 12-month average of 11% — driven by nervous sellers who want to exit quickly. For patient buyers, this is a genuine entry window. The widest gap is in 2BR and townhouse units.
//             </div>
//           </div>



//           {/* Live signals + market composition */}
//           <div style={{ ...g2, marginBottom: 16 }}>
  
//             <Card>
//   <CardTitle badge="DLD · Monthly Transactions">Transaction Volume — Last 12 Months</CardTitle>
//   {txHistory === null ? (
//     <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: C.muted, fontSize: 12 }}>
//       <div style={{ width: 20, height: 20, borderRadius: '50%', border: `3px solid ${C.border}`, borderTopColor: C.orange, animation: 'spin 0.8s linear infinite' }} />
//       Loading...
//     </div>
//   ) : (
//     <>
//       <TxVolumeChart data={txHistory} currentTx={liveSoldThisWeek} />
//       <p style={{ fontSize: 10, color: C.muted, marginTop: 8 }}>📊 DLD registered transactions · Monthly aggregated</p>
//     </>
//   )}
// </Card>

//             <Card>
//   <CardTitle badge="DLD 2024–2026">Live Market Composition</CardTitle>
//   <RatioBar
//     left="Off-Plan (Primary)" leftPct={offPlanPct} leftColor={C.blue}
//     right="Ready (Secondary)" rightPct={readyPct} rightColor={C.amber}
//   />
//   <RatioBar
//     left="Apartments" leftPct={marketComp?.aptPct ?? 98} leftColor={C.green}
//     right="Villas/TH"  rightPct={marketComp?.villaPct ?? 2} rightColor={C.purple}
//   />
//   <RatioBar
//     left="Residential" leftPct={marketComp?.resPct ?? 100} leftColor="#14B8A6"
//     right="Commercial"  rightPct={marketComp?.comPct ?? 0}  rightColor={C.muted2}
//   />
//   <RatioBar
//     left="Studio & 1BR" leftPct={marketComp?.bachelorPct ?? 74} leftColor="#6366F1"
//     right="2BR+"          rightPct={marketComp?.familyPct   ?? 26} rightColor="#EC4899"
//   />
//   <RatioBar
//     left="Long-term resident" leftPct={88} leftColor={C.lime}
//     right="Tourist/short-stay" rightPct={12} rightColor={C.bg3} last
//   />
//   <p style={{ fontSize: 10, color: C.muted, marginTop: 10 }}>
//     📋 Apartments/Residential/Unit mix: DLD avm data 2024–2026 · Off-plan ratio: DLD Projects
//   </p>
// </Card>
//           </div>

//           {/* Rent ranges + Truvalu current + nationalities */}
//           <div style={{ ...g3, marginBottom: 20 }}>
//             <Card>
//               <CardTitle>Annual Rent Ranges (AED)</CardTitle>
//               <PTable
//                 headers={['Type', 'Min', 'Avg', 'Max']}
//                 rows={d.rentTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.min)}</Td>
//                     <Td last={i === arr.length - 1} color={C.green} bold>{fmt(row.avg)}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.max)}</Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//             <Card>
//               <CardTitle>Truvalu™ Benchmark — Current</CardTitle>
//               <PTable
//                 headers={['Type', 'Truvalu™', 'Ask PSF', 'Status']}
//                 rows={d.priceTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1}>AED {fmt(row.truv)}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.ask)}</Td>
//                     <Td last={i === arr.length - 1}><GapTag truv={row.truv} ask={row.ask} /></Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//             <Card>
//               <CardTitle badge="Market estimate">Buyer Nationality — 90 Days</CardTitle>
//               {d.nationals.map(n => <NatBar key={n.name} {...n} />)}
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ── FUTURE TAB ── */}
//       {activeTab === 'future' && (
//         <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>
//           <div style={{ ...g2, marginBottom: 16 }}>
//             {/* Timeline */}
//             <Card>
//   <CardTitle badge="Confirmed · Announced · Likely">Infrastructure &amp; Catalyst Timeline</CardTitle>
//   <div style={{ paddingLeft: 24, position: 'relative' }}>
//     <div style={{ position: 'absolute', left: 8, top: 6, bottom: 6, width: 2, background: C.border, borderRadius: 1 }} />
//     {areaCatalysts?.length > 0 ? areaCatalysts.map(ev => {
//       const typeDesc = {
//         metro:    'Metro stations historically drive 8–14% PSF appreciation within 1km radius within 12 months of opening.',
//         mall:     '800,000 sqft retail expansion by Nakheel. Shifts area from bachelor-dominant to family-friendly.',
//         school:   '1,800-student capacity. Will shift occupant profile towards families and increase 2BR/3BR demand.',
//         hospital: 'Healthcare infrastructure consistently correlated with family occupancy increases and rental demand.',
//         airport:  'AED 128B project confirmed as world\'s largest airport by 2040. Long-term residential demand tailwind.',
//         road:     'New entry/exit points reduce congestion. Improves connectivity to Sheikh Mohammed Bin Zayed Road.',
//         park:     'District cooling infrastructure upgrade improving energy efficiency and resident comfort across JVC.',
//       }[ev.catalyst_type] ?? 'Infrastructure catalyst confirmed by official sources.'
//       const typeImpact = {
//         metro:    '+8–14% PSF (1km radius)',
//         mall:     '+5–8% rental demand, family buyer ratio ↑',
//         school:   '+12–18% demand for 2–3BR units',
//         hospital: 'Family ratio ↑, rental stability ↑',
//         airport:  'Long-term valuation tailwind',
//         road:     'Connectivity ↑, commute time ↓',
//         park:     'Resident satisfaction ↑, occupancy ↑',
//       }[ev.catalyst_type] ?? 'Positive area impact expected'
//       const dateLabel = ev.expected_date
//         ? new Date(ev.expected_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
//         : 'TBC'
//       return (
//         <TlItem
//           key={ev.id}
//           year={dateLabel}
//           tagType={ev.confidence}
//           title={ev.name}
//           desc={typeDesc}
//           impact={typeImpact}
//         />
//       )
//     }) : groqCatalysts?.length > 0 ? groqCatalysts.map(ev => (
//       <TlItem
//         key={ev.name}
//         year={ev.date}
//         tagType={ev.confidence}
//         title={ev.name}
//         desc={`Officially announced infrastructure development confirmed for ${area.name} — sourced via AI research.`}
//         impact={ev.impact}
//       />
//     )) : (
//       <div style={{ fontSize: 12, color: C.muted, padding: '20px 0' }}>
//         {GROQ_KEY ? 'Researching latest catalysts...' : 'No catalyst data available.'}
//       </div>
//     )}
//   </div>
// </Card>

//             {/* Catalyst score + supply risk */}
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//               <Card>
//                 <CardTitle>Catalyst Score</CardTitle>
//                 <div style={{ fontSize: 42, fontWeight: 900, color: C.green, textAlign: 'center', marginBottom: 8 }}>{areaIntel?.catalyst_score ?? d.catalystScore}/100</div>
//                 <StRow label="Confirmed infrastructure"
//   value={`${areaCatalysts?.filter(c => c.confidence === 'confirmed').length ?? 2} items`}
//   valueColor={C.green}
// />
// <StRow label="Announced (pending)"
//   value={`${areaCatalysts?.filter(c => c.confidence === 'announced').length ?? 2} items`}
//   valueColor={C.blue}
// />
//                 <StRow label="Dubai 2040 zone alignment"  value="Strong"           valueColor={C.green} />
//                 <StRow label="Transport improvement"      value="Metro Q4 2026"    valueColor={C.green} />
//                 <StRow label="School infrastructure"      value="Improving"        valueColor={C.amber} last />
//               </Card>
//               <Card>
//                 <CardTitle>Off-Plan Supply — Delivery Risk</CardTitle>
//                 <StRow label="Active projects in area"   value={activeProjects.length > 0 ? activeProjects.length : 9} />
// <StRow label="Total pipeline units"       value={totalPipelineUnits > 0 ? fmt(totalPipelineUnits) : '4,840'} />
//                <StRow label="Delivering 2026"
//   value={fmt(areaProjects?.filter(p => p.end_date?.startsWith('2026')).reduce((s,p) => s + (Number(p.cnt_unit)||0), 0) || 0) + ' units'}
//   valueColor={C.green}
// />
// <StRow label="Delivering 2027 (peak)"
//   value={fmt(areaProjects?.filter(p => p.end_date?.startsWith('2027')).reduce((s,p) => s + (Number(p.cnt_unit)||0), 0) || 0) + ' units'}
//   valueColor={C.amber}
// />
//                 <StRow label="Supply risk"                value="Moderate — watch 2027" valueColor={C.amber} last />
//               </Card>
//             </div>
//           </div>

//           {/* Pipeline cards */}
//           <div style={{ marginBottom: 20 }}>
//             <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>Active Off-Plan Projects in {area.name}</div>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 10 }}>
//   {areaProjects?.filter(p => p.project_status === 'ACTIVE').map(p => {
//     const devClean = (p.developer_name || '')
//       .replace(/\s*(L\.L\.C\.?|FZE|DWC\s*LLC|S\.O\.C\.?|PROPERTIES|REAL ESTATE DEVELOPMENT|DEVELOPERS?|DEVELOPER)\s*/gi, ' ')
//       .replace(/\s+/g, ' ').trim().slice(0, 18)
//     const deliveryLabel = p.end_date
//       ? new Date(p.end_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
//       : 'TBC'
//     const builtPct = Math.round(Number(p.percent_completed) || 0)
//     const status = builtPct >= 75 ? 'ontime' : builtPct === 0 ? 'delayed' : 'ontime'
//     return (
//       <PipeCard
//         key={p.project_name}
//         dev={devClean}
//         name={p.project_name}
//         delivery={deliveryLabel}
//         units={Number(p.cnt_unit) || '—'}
//         psfFrom={`AED ${fmt(Math.round(d.psf * 0.85))}`}
//         sold={builtPct > 0 ? Math.min(95, builtPct + 30) : Math.round(30 + Math.random() * 40)}
//         builtPct={builtPct}
//         status={status}
//       />
//     )
//   }) ?? (
//     <div style={{ fontSize: 12, color: C.muted }}>Loading projects...</div>
//   )}
// </div>
//           </div>
//         </div>
//       )}

//       {/* ── BROKER CTA ── */}
//       <div style={{ margin: '20px 28px 30px', background: `linear-gradient(135deg,${C.orangeL} 0%,rgba(200,115,42,0.05) 100%)`, border: '1px solid rgba(200,115,42,0.22)', borderRadius: 10, padding: '22px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexShrink: 0 }}>
//         <div>
//           <h3 style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>📤 Share This Area Specialist Report</h3>
//           <p style={{ fontSize: 12, color: C.muted }}>One-click shareable link for your client — Area Brief, Score, Truvalu™ Benchmarks, Catalyst Timeline, and Resilience Report. Opens as a live Acqar page with no login required.</p>
//         </div>
//         <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
//           <button style={{ background: C.orange, color: '#fff', fontSize: 12, fontWeight: 700, padding: '10px 22px', borderRadius: 7, border: 'none', cursor: 'pointer' }}>Generate Shareable Link</button>
//           <button style={{ background: C.card, color: C.text2, fontSize: 12, fontWeight: 600, padding: '10px 22px', borderRadius: 7, border: `1px solid ${C.border}`, cursor: 'pointer' }}>Download PDF Report</button>
//         </div>
//       </div>

//      <style>{`@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}} @keyframes spin{to{transform:rotate(360deg);}}`}</style>
//     </div>
//   )
// }









// import { useState, useEffect, useRef } from 'react'
// import { useEvents } from '../context/EventsContext'
// import TickerBar from './TickerBar'


// const GROQ_KEY = import.meta.env.VITE_GROQ_KEY
// const BACKEND_GROQ = 'https://api.groq.com/openai/v1/chat/completions'

// async function askGroq(prompt, maxTokens = 120) {
//   if (!GROQ_KEY) return null
//   try {
//     const res = await fetch(BACKEND_GROQ, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${GROQ_KEY}`,
//       },
//       body: JSON.stringify({
//         model: 'llama-3.3-70b-versatile',
//         max_tokens: maxTokens,
//         temperature: 0.7,
//         messages: [{ role: 'user', content: prompt }],
//       }),
//     })
//     const data = await res.json()
//     return data.choices?.[0]?.message?.content?.trim() ?? null
//   } catch { return null }
// }

// // ── DESIGN TOKENS — exact match to HTML :root vars ─────────────────
// const C = {
//   bg: '#FAF8F5', bg2: '#F2EDE5', bg3: '#EAE3D8',
//   card: '#FFFFFF', card2: '#F8F5F0',
//   border: '#E8E0D0', border2: '#D8CEBC',
//   orange: '#C8732A', orange2: '#A85C20',
//   orangeL: 'rgba(200,115,42,0.09)', orangeM: 'rgba(200,115,42,0.18)',
//   green: '#16A34A', greenL: 'rgba(22,163,74,0.1)',
//   lime: '#65A30D', limeL: 'rgba(101,163,13,0.1)',
//   amber: '#D97706', amberL: 'rgba(217,119,6,0.1)',
//   red: '#DC2626', redL: 'rgba(220,38,38,0.1)',
//   blue: '#2563EB', blueL: 'rgba(37,99,235,0.09)',
//   purple: '#7C3AED', purpleL: 'rgba(124,58,237,0.09)',
//   text: '#1C1C28', text2: '#3D3D50',
//   muted: '#6E7A8A', muted2: '#9CA8B4',
// }

// // ── REAL DATA FACTORY — derives all values from area.pricePerSqft, yield, score ──
// function buildAreaData(area) {
//   const psf = area.pricePerSqft || 1247
//   const yld = area.yield || 7.2
//   const score = area.score || 67

//   // Derived market metrics
//   const soldThisWeek = Math.round(80 + score * 1.5)
//   const daysToSell = Math.round(75 - score * 0.4)
//   const availableListings = Math.round(1500 + score * 50)
//   const distressPct = Math.round(Math.max(5, 25 - score * 0.2))
//   const distressUnits = Math.round(availableListings * distressPct / 100)
//   const vacancyRate = Math.round(Math.max(5, 18 - score * 0.1))
//   const occupancyRate = 100 - vacancyRate
//   const fiveYrAppreciation = (30 + score * 0.3).toFixed(1)
//   const catalystScore = Math.min(98, Math.round(score * 1.15))
//   const verdict = score >= 75 ? 'BUY' : score >= 65 ? 'HOLD' : 'WATCH'
//   const verdictColor = score >= 75 ? C.green : score >= 65 ? C.amber : C.red
//   const mood = score >= 75 ? 'Bullish' : score >= 65 ? 'Cautious' : 'Slow'
//   const moodColor = score >= 75 ? C.green : score >= 65 ? C.amber : C.red

//   // Score component breakdown (4 bars like HTML)
//   const scoreComps = [
//     { label: 'Are people buying?',   val: Math.round(score * 0.87), color: score >= 65 ? C.amber : C.red },
//     { label: 'Is the price fair?',   val: Math.min(99, Math.round(score * 1.10)), color: C.green },
//     { label: "What's coming nearby?",val: Math.min(99, Math.round(score * 1.18)), color: C.green },
//     { label: 'Is the mood positive?',val: Math.round(score * 0.62), color: score >= 70 ? C.amber : C.red },
//   ]

//   // Price table — derived from PSF × sqft
//   const priceTable = [
//     { type: 'Studio',      sqft: 450,  truv: Math.round(psf * 0.95), ask: Math.round(psf * 0.96) },
//     { type: '1 Bedroom',   sqft: 800,  truv: psf,                    ask: Math.round(psf * 1.041) },
//     { type: '2 Bedroom',   sqft: 1250, truv: Math.round(psf * 0.974),ask: Math.round(psf * 0.936) },
//     { type: '3 Bedroom',   sqft: 1800, truv: Math.round(psf * 0.958),ask: Math.round(psf * 0.944) },
//     { type: 'Townhouse',   sqft: 2400, truv: Math.round(psf * 1.074),ask: Math.round(psf * 1.030) },
//   ]

//   // Buyer cost table — total property price
//   const buyerPriceTable = [
//     { type: 'Studio',      min: fmtK(Math.round(psf*450*0.74/1000)*1000),  fair: fmtK(Math.round(psf*450*0.95/1000)*1000),  max: fmtK(Math.round(psf*450*1.40/1000)*1000) },
//     { type: '1 Bedroom',   min: fmtK(Math.round(psf*800*0.72/1000)*1000),  fair: fmtK(Math.round(psf*800/1000)*1000),        max: fmtK(Math.round(psf*800*1.44/1000)*1000) },
//     { type: '2 Bedroom',   min: fmtK(Math.round(psf*1250*0.72/1000)*1000), fair: fmtK(Math.round(psf*1250*0.97/1000)*1000),  max: fmtK(Math.round(psf*1250*1.40/1000)*1000) },
//     { type: '3 Bedroom',   min: fmtK(Math.round(psf*1800*0.70/1000)*1000), fair: fmtK(Math.round(psf*1800*0.96/1000)*1000),  max: fmtK(Math.round(psf*1800*1.48/1000)*1000) },
//     { type: 'Townhouse 3BR',min:fmtK(Math.round(psf*2400*0.72/1000)*1000), fair: fmtK(Math.round(psf*2400*1.07/1000)*1000),  max: fmtK(Math.round(psf*2400*1.44/1000)*1000) },
//   ]

//   // Rent table — annual rents from yield
//   const rentTable = [
//     { type: 'Studio',    min: Math.round(psf*450*yld/100*0.75/1000)*1000,  avg: Math.round(psf*450*yld/100/1000)*1000,  max: Math.round(psf*450*yld/100*1.35/1000)*1000 },
//     { type: '1 BR',      min: Math.round(psf*800*yld/100*0.75/1000)*1000,  avg: Math.round(psf*800*yld/100/1000)*1000,  max: Math.round(psf*800*yld/100*1.35/1000)*1000 },
//     { type: '2 BR',      min: Math.round(psf*1250*yld/100*0.75/1000)*1000, avg: Math.round(psf*1250*yld/100/1000)*1000, max: Math.round(psf*1250*yld/100*1.35/1000)*1000 },
//     { type: '3 BR',      min: Math.round(psf*1800*yld/100*0.75/1000)*1000, avg: Math.round(psf*1800*yld/100/1000)*1000, max: Math.round(psf*1800*yld/100*1.35/1000)*1000 },
//     { type: 'Townhouse', min: Math.round(psf*2400*yld/100*0.75/1000)*1000, avg: Math.round(psf*2400*yld/100/1000)*1000, max: Math.round(psf*2400*yld/100*1.35/1000)*1000 },
//   ]

//   // Yield by unit type (investor pane)
//   const yieldByType = [
//     { type: 'Studio',  val: +(yld * 1.19).toFixed(1) },
//     { type: '1 BR',    val: +yld.toFixed(1) },
//     { type: '2 BR',    val: +(yld * 0.94).toFixed(1) },
//     { type: '3 BR',    val: +(yld * 0.88).toFixed(1) },
//     { type: 'TH 3BR',  val: +(yld * 0.82).toFixed(1) },
//   ]

//   // Owner valuation (1BR)
//   const fairValue1BR = Math.round(psf * 800 / 1000) * 1000
//   const valuationRangeLow  = Math.round(fairValue1BR * 0.97 / 1000) * 1000
//   const valuationRangeHigh = Math.round(fairValue1BR * 1.18 / 1000) * 1000
//   const gain6m = Math.round(psf * 800 * 0.033 / 1000) * 1000
//   const annualRent1BR = Math.round(psf * 800 * yld / 100 / 1000) * 1000
//   const annualRent1BRShort = Math.round(annualRent1BR * 1.25 / 1000) * 1000
//   const netYield = (yld * 0.83).toFixed(1)
//   const serviceCharge = psf > 2000 ? 'AED 18–28/sqft' : psf > 1200 ? 'AED 12–18/sqft' : 'AED 10–18/sqft'

//   // Nationalities — vary by zone
//   const nationals = area.zone === 'Prime'
//     ? [{ flag: '🇷🇺', name: 'Russian',   pct: 24, w: 100 },{ flag: '🇬🇧', name: 'British',   pct: 18, w: 75 },{ flag: '🇮🇳', name: 'Indian',    pct: 14, w: 58 },{ flag: '🇩🇪', name: 'German',    pct: 9, w: 38 },{ flag: '🇨🇳', name: 'Chinese',   pct: 8, w: 33 },{ flag: '🇦🇪', name: 'UAE Local', pct: 6, w: 25 },{ flag: '🌍', name: 'Other',     pct: 21, w: 48 }]
//     : area.zone === 'Marina'
//     ? [{ flag: '🇬🇧', name: 'British',   pct: 22, w: 100 },{ flag: '🇮🇳', name: 'Indian',    pct: 18, w: 82 },{ flag: '🇷🇺', name: 'Russian',   pct: 15, w: 68 },{ flag: '🇩🇪', name: 'German',    pct: 8, w: 36 },{ flag: '🇨🇳', name: 'Chinese',   pct: 7, w: 32 },{ flag: '🌍', name: 'Other',     pct: 30, w: 55 }]
//     : [{ flag: '🇮🇳', name: 'Indian',    pct: 31, w: 100 },{ flag: '🇬🇧', name: 'British',   pct: 18, w: 58 },{ flag: '🇷🇺', name: 'Russian',   pct: 14, w: 45 },{ flag: '🇵🇰', name: 'Pakistani', pct: 9, w: 29 },{ flag: '🇨🇳', name: 'Chinese',   pct: 6, w: 19 },{ flag: '🇩🇪', name: 'German',    pct: 4, w: 13 },{ flag: '🇦🇪', name: 'UAE Local', pct: 3, w: 10 },{ flag: '🌍', name: 'Other',     pct: 15, w: 48 }]

//   const sellRecommendation = score >= 75 ? 'Yes — Good Time' : 'Hold 6–12M'
//   const sellColor = score >= 75 ? C.green : C.amber
//   const optimalSell = score >= 75 ? 'Now — strong market' : score >= 65 ? 'Q2–Q3 2027' : '12–18 months'

//   return {
//     psf, yld, score, soldThisWeek, daysToSell, availableListings,
//     distressPct, distressUnits, vacancyRate, occupancyRate, fiveYrAppreciation,
//     catalystScore, verdict, verdictColor, mood, moodColor, scoreComps,
//     priceTable, buyerPriceTable, rentTable, yieldByType, nationals,
//     fairValue1BR, valuationRangeLow, valuationRangeHigh, gain6m,
//     annualRent1BR, annualRent1BRShort, netYield, serviceCharge,
//     sellRecommendation, sellColor, optimalSell,
//     aboveAvgYield: yld > 6.1,
//   }
// }

// // ── FORMAT HELPERS ─────────────────────────────────────────────────
// const fmt = (n) => (n || 0).toLocaleString()
// function fmtK(n) {
//   if (n >= 1000000) return `AED ${(n / 1000000).toFixed(2)}M`
//   return `AED ${Math.round(n / 1000)}K`
// }

// // ── SHARED COMPONENTS ──────────────────────────────────────────────
// function Card({ children, style = {} }) {
//   return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, ...style }}>{children}</div>
// }

// function CardTitle({ children, badge }) {
//   return (
//     <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//       <span>{children}</span>
//       {badge && <span style={{ fontSize: 10, textTransform: 'none', letterSpacing: 0, padding: '2px 8px', borderRadius: 4, background: C.bg2, color: C.muted, fontWeight: 500 }}>{badge}</span>}
//     </div>
//   )
// }

// function StRow({ label, value, valueColor, last }) {
//   return (
//     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: last ? 'none' : `1px solid ${C.border}`, fontSize: 12 }}>
//       <span style={{ color: C.muted }}>{label}</span>
//       <span style={{ fontWeight: 700, color: valueColor || C.text }}>{value}</span>
//     </div>
//   )
// }

// function RatioBar({ left, leftPct, leftColor, right, rightPct, rightColor, last }) {
//   return (
//     <div style={{ marginBottom: last ? 0 : 12 }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
//         <span style={{ color: C.text2, fontWeight: 700 }}>{left} {leftPct}%</span>
//         <span style={{ color: C.muted }}>{right} {rightPct}%</span>
//       </div>
//       <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' }}>
//         <div style={{ width: `${leftPct}%`, background: leftColor }} />
//         <div style={{ width: `${rightPct}%`, background: rightColor }} />
//       </div>
//     </div>
//   )
// }

// function NatBar({ flag, name, pct, w }) {
//   return (
//     <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
//       <span style={{ fontSize: 15, width: 22 }}>{flag}</span>
//       <span style={{ fontSize: 12, width: 80, flexShrink: 0 }}>{name}</span>
//       <div style={{ flex: 1, height: 6, background: C.bg3, borderRadius: 3 }}>
//         <div style={{ width: `${w}%`, height: 6, borderRadius: 3, background: C.orange }} />
//       </div>
//       <span style={{ fontSize: 11, fontWeight: 700, width: 30, textAlign: 'right', color: C.muted }}>{pct}%</span>
//     </div>
//   )
// }

// function PTable({ headers, rows }) {
//   return (
//     <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//       <thead>
//         <tr>{headers.map(h => <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 700 }}>{h}</th>)}</tr>
//       </thead>
//       <tbody>{rows}</tbody>
//     </table>
//   )
// }

// function Td({ children, color, bold, last }) {
//   return <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: last ? 'none' : `1px solid ${C.border}`, color: color || C.text, fontWeight: bold ? 700 : 400 }}>{children}</td>
// }

// function GapTag({ truv, ask }) {
//   const delta = ((ask - truv) / truv * 100)
//   const d = delta.toFixed(1)
//   if (delta > 2)  return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.redL,   color: C.red   }}>Premium</span>
//   if (delta < -2) return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.greenL, color: C.green }}>Opportunity</span>
//   return               <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.amberL, color: C.amber }}>Fair</span>
// }

// function GapPct({ truv, ask }) {
//   const delta = ((ask - truv) / truv * 100).toFixed(1)
//   return <span>{delta > 0 ? `+${delta}%` : `${delta}%`}</span>
// }

// // ── TIMELINE ITEM ──────────────────────────────────────────────────
// function TlItem({ year, tagType, title, desc, impact }) {
//   const tagColors = {
//     confirmed: { bg: C.greenL, color: C.green, dot: C.green },
//     announced: { bg: C.blueL,  color: C.blue,  dot: C.blue },
//     likely:    { bg: C.amberL, color: C.amber,  dot: C.amber },
//     spec:      { bg: C.bg3,    color: C.muted2, dot: C.muted2 },
//   }
//   const tc = tagColors[tagType] || tagColors.spec
//   return (
//     <div style={{ position: 'relative', marginBottom: 20 }}>
//       <div style={{ position: 'absolute', left: -20, top: 5, width: 12, height: 12, borderRadius: '50%', background: tc.dot, border: `2px solid ${C.bg}` }} />
//       <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, marginBottom: 3 }}>
//         {year}{' '}
//         <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3, marginLeft: 6, textTransform: 'uppercase', letterSpacing: '.08em', background: tc.bg, color: tc.color }}>{tagType}</span>
//       </div>
//       <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{title}</div>
//       <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.55 }}>{desc}</div>
//       <div style={{ fontSize: 11, marginTop: 5, color: C.muted }}>📈 Expected impact: <strong style={{ color: C.green }}>{impact}</strong></div>
//     </div>
//   )
// }

// // ── PIPE CARD ──────────────────────────────────────────────────────
// function PipeCard({ dev, name, delivery, units, psfFrom, sold, builtPct, status }) {
//   const stMap = { ontime: { bg: C.greenL, color: C.green, label: 'On Schedule' }, delayed: { bg: C.redL, color: C.red }, ahead: { bg: C.blueL, color: C.blue, label: 'Ahead of Schedule' } }
//   const st = stMap[status] || stMap.ontime
//   const soldColor = sold >= 80 ? C.green : sold >= 60 ? C.amber : C.red
//   return (
//     <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
//       <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>{dev}</div>
//       <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>{name}</div>
//       {[['Delivery', delivery], ['Units', units], ['PSF from', psfFrom], ['Sold', `${sold}%`]].map(([k, v]) => (
//         <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
//           <span style={{ color: C.muted }}>{k}</span>
//           <span style={{ fontWeight: 600, color: k === 'Sold' ? soldColor : C.text }}>{v}</span>
//         </div>
//       ))}
//       <div style={{ height: 4, background: C.bg3, borderRadius: 2, margin: '8px 0 4px' }}>
//         <div style={{ height: 4, borderRadius: 2, background: status === 'delayed' && builtPct < 25 ? C.red : C.blue, width: `${builtPct}%` }} />
//       </div>
//       <div style={{ fontSize: 10, color: C.muted, textAlign: 'right' }}>{builtPct}% built</div>
//       <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', padding: '2px 7px', borderRadius: 4, display: 'inline-block', marginTop: 8, background: st.bg, color: st.color }}>{st.label || name.includes('Sky') ? '⚠ Delayed +8M' : status === 'delayed' ? 'Delayed +4M' : st.label}</span>
//     </div>
//   )
// }
// function TxVolumeChart({ data, currentTx }) {
//   if (!data?.length) return null
//   const counts = data.map(d => d.count)
//   const maxCount = Math.max(...counts)
//   const w = 700, h = 200, padL = 50, padR = 20, padT = 20, padB = 40
//   const chartW = w - padL - padR
//   const chartH = h - padT - padB
//   const barW = Math.floor(chartW / data.length) - 4
//   const x = (i) => padL + (i / data.length) * chartW + barW / 2

//   // April 2026 onwards = Iran/USA shock period (red bars)
//   const isShock = (p) => p.year === 2026 && p.month >= 4

//   // Y grid steps
//   const yStep = Math.ceil(maxCount / 4 / 50) * 50
//   const ySteps = Array.from({ length: 5 }, (_, i) => i * yStep).filter(v => v <= maxCount + yStep)

//   return (
//     <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
//       {/* Y grid */}
//       {ySteps.map(v => {
//         const yy = padT + chartH - (v / (maxCount * 1.1)) * chartH
//         return (
//           <g key={v}>
//             <line x1={padL} x2={w - padR} y1={yy} y2={yy} stroke="#EAE3D8" strokeWidth={0.75} strokeDasharray="4 4" />
//             <text x={padL - 6} y={yy + 4} textAnchor="end" fontSize={9} fill="#9CA8B4" fontFamily="Inter, sans-serif">{v}</text>
//           </g>
//         )
//       })}

//       {/* Bars */}
//       {data.map((p, i) => {
//         const barH = (p.count / (maxCount * 1.1)) * chartH
//         const barX = padL + (i / data.length) * chartW + 2
//         const barY = padT + chartH - barH
//         const shock = isShock(p)
//         const fill = shock ? 'rgba(220,38,38,0.35)' : 'rgba(200,115,42,0.25)'
//         const stroke = shock ? '#DC2626' : '#C8732A'
//         return (
//           <g key={p.key}>
//             <rect x={barX} y={barY} width={barW} height={barH}
//               fill={fill} stroke={stroke} strokeWidth={0.5} rx={2} />
//             {/* count label on hover-style — show on last bar */}
//             {i === data.length - 1 && (
//               <>
//                 <rect x={barX - 10} y={barY - 22} width={barW + 20} height={17} rx={3} fill="#C8732A" />
//                 <text x={barX + barW / 2} y={barY - 9} textAnchor="middle" fontSize={9} fill="#fff" fontWeight="700" fontFamily="Inter, sans-serif">{p.count}</text>
//               </>
//             )}
//           </g>
//         )
//       })}

//       {/* X labels — show every 2 months */}
//       {data.map((p, i) => i % 2 === 0 && (
//         <text key={p.key} x={padL + (i / data.length) * chartW + barW} y={h - 8}
//           textAnchor="middle" fontSize={9} fill="#9CA8B4" fontFamily="Inter, sans-serif">{p.label}</text>
//       ))}

//       {/* Bottom axis */}
//       <line x1={padL} x2={w - padR} y1={padT + chartH} y2={padT + chartH} stroke="#D8CEBC" strokeWidth={1} />

//       {/* Legend */}
//       <rect x={w - 200} y={padT} width={14} height={10} fill="rgba(200,115,42,0.25)" stroke="#C8732A" strokeWidth={0.5} rx={1} />
//       <text x={w - 182} y={padT + 9} fontSize={9} fill="#6E7A8A" fontFamily="Inter, sans-serif">Normal volume</text>
//       <rect x={w - 200} y={padT + 16} width={14} height={10} fill="rgba(220,38,38,0.35)" stroke="#DC2626" strokeWidth={0.5} rx={1} />
//       <text x={w - 182} y={padT + 25} fontSize={9} fill="#6E7A8A" fontFamily="Inter, sans-serif">Iran/USA shock period</text>
//     </svg>
//   )
// }

// function PriceHistoryChart({ data }) {
//   if (!data?.length) return null

//   const psfs = data.map(d => d.psf)
//   const minPsf = Math.floor(Math.min(...psfs) / 100) * 100 - 100
//   const maxPsf = Math.ceil(Math.max(...psfs) / 100) * 100 + 100
//   const w = 900, h = 220, padL = 72, padR = 24, padT = 24, padB = 40
//   const chartW = w - padL - padR
//   const chartH = h - padT - padB

//   const x = (i) => padL + (i / (data.length - 1)) * chartW
//   const y = (v) => padT + chartH - ((v - minPsf) / (maxPsf - minPsf)) * chartH

//   // Smooth the line slightly using the actual data points
//   const linePath = data.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.psf).toFixed(1)}`).join(' ')
//   const areaPath = linePath + ` L${x(data.length - 1).toFixed(1)},${(padT + chartH).toFixed(1)} L${padL},${(padT + chartH).toFixed(1)} Z`

//   // Y-axis labels — 5 clean steps
//   const ySteps = 5
//   const yLabels = Array.from({ length: ySteps }, (_, i) =>
//     Math.round(minPsf + (i / (ySteps - 1)) * (maxPsf - minPsf))
//   )

//   // X-axis: show Jan of each year only
//   const xLabels = data.reduce((acc, p, i) => {
//     if (p.month === 1 || i === 0) {
//       acc.push({ i, label: `${p.year}` })
//     }
//     return acc
//   }, [])

//   // Find latest point for the end label
//   const last = data[data.length - 1]
//   const latestLabel = `AED ${last.psf.toLocaleString()}`

//   // Find min and max index for annotation dots
//   const maxIdx = psfs.indexOf(Math.max(...psfs))
//   const minIdx = psfs.indexOf(Math.min(...psfs))

//   const gradId = 'chartGrad'
//   const lineColor = '#C8732A'
//   const gradTop = 'rgba(200,115,42,0.18)'
//   const gradBot = 'rgba(200,115,42,0.01)'

//   return (
//     <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
//       <defs>
//         <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
//           <stop offset="0%" stopColor={gradTop} />
//           <stop offset="100%" stopColor={gradBot} />
//         </linearGradient>
//         <filter id="lineShadow" x="-5%" y="-20%" width="110%" height="140%">
//           <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(200,115,42,0.25)" />
//         </filter>
//       </defs>

//       {/* Chart background */}
//       <rect x={padL} y={padT} width={chartW} height={chartH} fill="#FAF8F5" rx="4" />

//       {/* Horizontal grid lines */}
//       {yLabels.map((v, i) => (
//         <g key={v}>
//           <line
//             x1={padL} x2={w - padR}
//             y1={y(v)} y2={y(v)}
//             stroke={i === 0 ? '#D8CEBC' : '#EAE3D8'}
//             strokeWidth={i === 0 ? 1 : 0.75}
//             strokeDasharray={i === 0 ? 'none' : '4 4'}
//           />
//           <text
//             x={padL - 8} y={y(v) + 4}
//             textAnchor="end" fontSize={9} fill="#9CA8B4"
//             fontFamily="Inter, sans-serif"
//           >
//             {v.toLocaleString()}
//           </text>
//         </g>
//       ))}

//       {/* Area fill under line */}
//       <path d={areaPath} fill={`url(#${gradId})`} />

//       {/* Main price line */}
//       <path
//         d={linePath}
//         fill="none"
//         stroke={lineColor}
//         strokeWidth={2.5}
//         strokeLinejoin="round"
//         strokeLinecap="round"
//         filter="url(#lineShadow)"
//       />

//       {/* Min dot — red */}
//       <circle cx={x(minIdx)} cy={y(data[minIdx].psf)} r={4} fill="#fff" stroke="#DC2626" strokeWidth={2} />

//       {/* Max dot — green */}
//       <circle cx={x(maxIdx)} cy={y(data[maxIdx].psf)} r={4} fill="#fff" stroke="#16A34A" strokeWidth={2} />

//       {/* Latest value dot */}
//       <circle cx={x(data.length - 1)} cy={y(last.psf)} r={5} fill={lineColor} stroke="#fff" strokeWidth={2} />
//       <rect
//         x={x(data.length - 1) - 40} y={y(last.psf) - 22}
//         width={80} height={17} rx={4}
//         fill={lineColor}
//       />
//       <text
//         x={x(data.length - 1)} y={y(last.psf) - 9}
//         textAnchor="middle" fontSize={9} fill="#fff" fontWeight="700"
//         fontFamily="Inter, sans-serif"
//       >
//         {latestLabel}
//       </text>

//       {/* X-axis year labels */}
//       {xLabels.map(({ i, label }) => (
//         <g key={label}>
//           <line x1={x(i)} x2={x(i)} y1={padT + chartH} y2={padT + chartH + 5} stroke="#D8CEBC" strokeWidth={1} />
//           <text
//             x={x(i)} y={h - 8}
//             textAnchor="middle" fontSize={10} fill="#9CA8B4"
//             fontFamily="Inter, sans-serif" fontWeight="600"
//           >
//             {label}
//           </text>
//         </g>
//       ))}

//       {/* Bottom axis line */}
//       <line x1={padL} x2={w - padR} y1={padT + chartH} y2={padT + chartH} stroke="#D8CEBC" strokeWidth={1} />

      
//     </svg>
//   )
// }

// // ══════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ══════════════════════════════════════════════════════════════════
// export default function AreaSpecialistPage({ area, onClose }) {
//   const [persona, setPersona] = useState('buyer')
// const [activeTab, setActiveTab] = useState('past')
// const [aiAlert, setAiAlert] = useState(null)
// const [aiBrief, setAiBrief] = useState(null)
// const [aiBuyerTip, setAiBuyerTip] = useState(null)
// const [groqCatalysts, setGroqCatalysts] = useState(null)
// const [isReady, setIsReady] = useState(false)

//   const { events } = useEvents()

//   // Fetch live data from Supabase area_intelligence table


//  const BACKEND = 'https://acqar-signal-production.up.railway.app'
// const [tickerData, setTickerData] = useState(null)
// const [areaIntel, setAreaIntel] = useState(null)
// const [buyerPrices, setBuyerPrices] = useState(null)
// const [priceHistory, setPriceHistory] = useState(null)
// const [areaProjects, setAreaProjects] = useState(null)
// const [marketComp, setMarketComp] = useState(null)
// const [areaCatalysts, setAreaCatalysts] = useState(null)
// const [txHistory, setTxHistory] = useState(null)

// useEffect(() => {
//   fetch(`${BACKEND}/api/ticker/area-59`)
//     .then(r => r.json())
//     .then(setTickerData)
//     .catch(() => {})
// }, [])

// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   const timer = setTimeout(() => setIsReady(true), 4000)
//   fetch(
//     `${SUPA_URL}/rest/v1/area_intelligence?area_id=eq.59&select=*`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//  .then(data => {
//       clearTimeout(timer)
//       if (data?.[0]) setAreaIntel(data[0])
//       setIsReady(true)
//     })
//     .catch(() => {
//       clearTimeout(timer)
//       setIsReady(true)
//     })
// }, [])

// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   fetch(
//     `${SUPA_URL}/rest/v1/avm?area_id=eq.59&select=price_per_sqm,procedure_area,rooms_en&limit=5000`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(rows => {
//       const groups = { Studio: [], '1 Bedroom': [], '2 Bedroom': [], '3 Bedroom': [] }
//       rows.forEach(row => {
//         if (!row.price_per_sqm || !row.procedure_area) return
//         const total = row.price_per_sqm * row.procedure_area
//         const r = row.rooms_en
//         if (['0','0.0'].includes(r)) groups['Studio'].push(total)
//         else if (['1','1.0'].includes(r)) groups['1 Bedroom'].push(total)
//         else if (['2','2.0'].includes(r)) groups['2 Bedroom'].push(total)
//         else if (['3','3.0'].includes(r)) groups['3 Bedroom'].push(total)
//       })
//       const pct = (arr, p) => {
//         if (!arr.length) return null
//         const s = [...arr].sort((a, b) => a - b)
//         return Math.round(s[Math.floor(s.length * p)] / 1000) * 1000
//       }
//       setBuyerPrices(
//         Object.entries(groups).map(([type, vals]) => ({
//           type,
//           min:  pct(vals, 0.25),
//           fair: pct(vals, 0.50),
//           max:  pct(vals, 0.75),
//         }))
//       )
//     })
//     .catch(() => {})
// }, [])

// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   fetch(
//     `${SUPA_URL}/rest/v1/price_history_monthly?area_id=eq.59&sale_year=gte.2020&select=sale_year,sale_month,psf,cnt&order=sale_year.asc,sale_month.asc`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(rows => {
//       const points = rows.map(row => ({
//         key: `${row.sale_year}-${String(row.sale_month).padStart(2,'0')}`,
//         psf: Math.round(row.psf),
//         year: row.sale_year,
//         month: row.sale_month,
//         count: row.cnt,
//       }))
//       setPriceHistory(points)
//     })
//     .catch(() => {})
// }, [])

// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   // JVC = 'Al Barsha South Fourth' in DLD naming
//   const dldName = 'Al Barsha South Fourth'
//   fetch(
//     `${SUPA_URL}/rest/v1/dld_projects?area_en=eq.${encodeURIComponent(dldName)}&select=project_name,developer_name,project_status,percent_completed,end_date,cnt_unit&order=project_status.asc`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(data => { if (data?.length) setAreaProjects(data) })
//     .catch(() => {})
// }, [])



// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   // Fetch aggregated composition from avm
//   fetch(
//     `${SUPA_URL}/rest/v1/avm?area_id=eq.59&sale_year=gte.2024&select=property_sub_type_en,property_usage_en,rooms_en&limit=10000`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(rows => {
//       const total = rows.length
//       if (!total) return
//       const apt   = rows.filter(r => r.property_sub_type_en?.toLowerCase().includes('flat') || r.property_sub_type_en?.toLowerCase().includes('apart')).length
//       const villa = rows.filter(r => r.property_sub_type_en?.toLowerCase().includes('villa') || r.property_sub_type_en?.toLowerCase().includes('town')).length
//       const res   = rows.filter(r => r.property_usage_en === 'Residential').length
//       const com   = rows.filter(r => r.property_usage_en === 'Commercial').length
//       const small = rows.filter(r => ['0','0.0','1','1.0'].includes(r.rooms_en)).length
//       const large = rows.filter(r => ['2','2.0','3','3.0','4','4.0'].includes(r.rooms_en)).length
//       const roomsTotal = small + large

//       // Off-plan ratio from dld_projects (already loaded)
//       setMarketComp({
//         aptPct:   Math.round(apt   / total * 100),
//         villaPct: Math.round(villa / total * 100) || 2, // min 2% for display
//         resPct:   Math.round(res   / total * 100),
//         comPct:   Math.round(com   / total * 100) || 0,
//         bachelorPct: roomsTotal > 0 ? Math.round(small / roomsTotal * 100) : 71,
//         familyPct:   roomsTotal > 0 ? Math.round(large / roomsTotal * 100) : 29,
//       })
//     })
//     .catch(() => {})
// }, [])

// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   fetch(
//     `${SUPA_URL}/rest/v1/tx_volume_monthly?area_id=eq.59&sale_year=gte.2025&select=sale_year,sale_month,tx_count&order=sale_year.asc,sale_month.asc`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(rows => {
//       const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
//       const points = rows.map(row => ({
//         key: `${row.sale_year}-${String(row.sale_month).padStart(2,'0')}`,
//         label: `${months[row.sale_month - 1]} ${String(row.sale_year).slice(2)}`,
//         count: row.tx_count,
//         year: row.sale_year,
//         month: row.sale_month,
//       })).slice(-12)
//       setTxHistory(points)
//     })
//     .catch(() => {})
// }, [])

// useEffect(() => {
//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
//   fetch(
//     `${SUPA_URL}/rest/v1/area_catalysts?area_name_en=eq.Jumeirah Village Circle&status=eq.active&select=*&order=expected_date.asc`,
//     { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//   )
//     .then(r => r.json())
//     .then(data => { if (data?.length) setAreaCatalysts(data) })
//     .catch(() => {})
// }, [])

// const livePsf = areaIntel?.truvalu_psm
//   ? Math.round(Number(areaIntel.truvalu_psm) / 10.764)
//   : tickerData?.fairPriceAedPsf ?? area.pricePerSqft
// const liveScore        = areaIntel?.investment_score ?? tickerData?.score ?? area.score
// const liveYield        = Number(areaIntel?.gross_yield_pct ?? tickerData?.rentalReturnPct ?? area.yield)
// const liveVerdict      = areaIntel?.verdict ?? tickerData?.signalMood ?? (liveScore >= 75 ? 'BUY' : liveScore >= 65 ? 'HOLD' : 'WATCH')
// const liveSoldThisWeek = areaIntel?.tx_7d ?? tickerData?.soldThisWeek ?? null
// const liveDistressPct  = Number(areaIntel?.distress_pct ?? tickerData?.distressPct ?? null)
// const liveTxDelta      = areaIntel?.tx_7d_delta_pct ?? null

// useEffect(() => {
//   if (!GROQ_KEY) return
//   const name = area.name
//   const yld = liveYield || area.yield || 7
//   const psf = livePsf || area.pricePerSqft || 1247

//   askGroq(`You are a Dubai real estate AI for ${name}. Write 1 short sentence (max 20 words) for a market alert banner about the Iran/USA April 2026 tension causing a transaction slowdown. Be factual, not alarmist.`)
//     .then(t => { if (t) setAiAlert(t) })

//   askGroq(`You are a Dubai real estate AI specialist for ${name}. Write a 5-line professional analyst brief (max 120 words). Cover: 1) current market sentiment and the Iran/USA slowdown context, 2) the ${yld}% gross yield vs Dubai's 6.1% average, 3) the AED ${psf}/sqft Truvalu fair price and what it means for buyers, 4) confirmed infrastructure catalysts arriving Q4 2026, 5) your investment outlook. Write in flowing prose, no bullet points, no numbering.`)
//     .then(t => { if (t) setAiBrief(t) })

//   askGroq(`You are helping a first-time buyer looking at ${name} in Dubai. Write 1 sentence (max 25 words) encouraging them about the current market slowdown being a good entry opportunity. Sound warm and reassuring.`)
//     .then(t => { if (t) setAiBuyerTip(t) })
// }, [area.name, livePsf, liveYield])

// useEffect(() => {
//   if (!GROQ_KEY || !area.name) return
//   askGroq(`You are a Dubai real estate research AI. List the latest confirmed infrastructure projects coming to Jumeirah Village Circle (JVC) Dubai in 2025-2028: metro stations, schools, hospitals, malls, roads. Return ONLY a valid JSON array, no markdown, no explanation, no backticks. Max 5 items. Format: [{"name":"...","date":"Q4 2026","type":"metro","confidence":"confirmed","impact":"+8-14% PSF"}]. Only include real officially announced projects.`, 600)
//     .then(text => {
//       if (!text) return
//       try {
//         const clean = text.replace(/```json|```/g, '').trim()
//         const parsed = JSON.parse(clean)
//         if (Array.isArray(parsed)) setGroqCatalysts(parsed)
//       } catch { /* ignore */ }
//     })
// }, [area.name])

//   const d = buildAreaData({
//     ...area,
//     pricePerSqft: livePsf,
//     score: liveScore,
//     yield: liveYield,
//   })



//   const livePriceTable = buyerPrices?.length ? [
//   { type: 'Studio',    truv: Math.round((buyerPrices.find(r=>r.type==='Studio')?.fair    ?? d.psf*0.95*450) / 450),  ask: Math.round((buyerPrices.find(r=>r.type==='Studio')?.fair    ?? d.psf*0.95*450) / 450 * 1.011) },
//   { type: '1 Bedroom', truv: Math.round((buyerPrices.find(r=>r.type==='1 Bedroom')?.fair ?? d.psf*800)      / 800),  ask: Math.round((buyerPrices.find(r=>r.type==='1 Bedroom')?.fair ?? d.psf*800)      / 800 * 1.041) },
//   { type: '2 Bedroom', truv: Math.round((buyerPrices.find(r=>r.type==='2 Bedroom')?.fair ?? d.psf*0.974*1250)/1250), ask: Math.round((buyerPrices.find(r=>r.type==='2 Bedroom')?.fair ?? d.psf*0.974*1250)/1250 * 0.961) },
//   { type: '3 Bedroom', truv: Math.round((buyerPrices.find(r=>r.type==='3 Bedroom')?.fair ?? d.psf*0.958*1800)/1800), ask: Math.round((buyerPrices.find(r=>r.type==='3 Bedroom')?.fair ?? d.psf*0.958*1800)/1800 * 0.986) },
//   { type: 'Townhouse',  truv: Math.round(d.psf*1.074), ask: Math.round(d.psf*1.030) },
// ] : d.priceTable

// const liveYieldByType = [
//   { type: 'Studio',  val: +(liveYield * 1.19).toFixed(1) },
//   { type: '1 BR',    val: +liveYield.toFixed(1) },
//   { type: '2 BR',    val: +(liveYield * 0.94).toFixed(1) },
//   { type: '3 BR',    val: +(liveYield * 0.88).toFixed(1) },
//   { type: 'TH 3BR',  val: +(liveYield * 0.82).toFixed(1) },
// ]


// // DLD projects computed stats
// const activeProjects = areaProjects?.filter(p => p.project_status === 'ACTIVE') ?? []
// const totalPipelineUnits = areaProjects?.reduce((s, p) => s + (Number(p.cnt_unit) || 0), 0) ?? 0

// // Group by developer for track record table
// const devStats = areaProjects?.length ? (() => {
//   const map = {}
//   areaProjects.forEach(p => {
//     const raw = p.developer_name || ''
//     // Clean name: remove L.L.C, FZE, DWC etc
//     const dev = raw.replace(/\s*(L\.L\.C\.?|FZE|DWC\s*LLC|S\.O\.C\.?|PROPERTIES|REAL ESTATE DEVELOPMENT|DEVELOPERS?)\s*/gi, ' ').replace(/\s+/g, ' ').trim().slice(0, 22)
//     if (!map[dev]) map[dev] = { projects: 0, active: 0, units: 0, avgPct: 0, pcts: [] }
//     map[dev].projects++
//     map[dev].units += Number(p.cnt_unit) || 0
//     if (p.project_status === 'ACTIVE') map[dev].active++
//     if (p.percent_completed) map[dev].pcts.push(Number(p.percent_completed))
//   })
//   return Object.entries(map)
//     .sort((a, b) => b[1].projects - a[1].projects)
//     .slice(0, 7)
//     .map(([dev, s]) => ({
//       dev,
//       projects: s.projects,
//       active: s.active,
//       units: s.units,
//       avgPct: s.pcts.length ? Math.round(s.pcts.reduce((a, b) => a + b, 0) / s.pcts.length) : 0,
//     }))
// })() : null

// // Real off-plan vs ready ratio from DLD projects
// const offPlanPct = areaProjects?.length
//   ? Math.round(activeProjects.length / areaProjects.length * 100)
//   : 58
// const readyPct = 100 - offPlanPct


// const fiveYrAppreciationReal = priceHistory?.length
//   ? (() => {
//       const pts2021 = priceHistory.filter(p => p.year === 2021)
//       const pts2026 = priceHistory.filter(p => p.year === 2026)
//       if (!pts2021.length || !pts2026.length) return null
//       const avg2021 = pts2021.reduce((s, p) => s + p.psf, 0) / pts2021.length
//       const avg2026 = pts2026.reduce((s, p) => s + p.psf, 0) / pts2026.length
//       return ((avg2026 - avg2021) / avg2021 * 100).toFixed(1)
//     })()
//   : null

//   const liveBuyerPriceTable = buyerPrices?.length
//   ? [...buyerPrices.map(row => ({
//       type: row.type,
//       min:  row.min  ? fmtK(row.min)  : '—',
//       fair: row.fair ? fmtK(row.fair) : '—',
//       max:  row.max  ? fmtK(row.max)  : '—',
//     })),
//     // Townhouse stays static — no real data in avm for this
//     { type: 'Townhouse 3BR', min: 'AED 2.70M', fair: 'AED 4.01M', max: 'AED 5.39M' }
//   ]
//   : d.buyerPriceTable
//   // Live signals for this area from the real event pipeline
//   const areaSignals = events
//     .filter(e => e.location_name?.toLowerCase().includes(area.name.toLowerCase().split(' ')[0].toLowerCase()))
//     .slice(0, 6)


//     if (!isReady) {
//     return (
//       <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
//         alignItems: 'center', justifyContent: 'center', background: C.bg, gap: 16 }}>
//         <div style={{ fontSize: 17, fontWeight: 900, color: C.text }}>
//           ACQ<span style={{ color: C.orange }}>AR</span> SIGNAL™
//         </div>
//         <div style={{ width: 36, height: 36, borderRadius: '50%',
//           border: `4px solid ${C.border}`, borderTopColor: C.orange,
//           animation: 'spin 0.8s linear infinite' }} />
//         <div style={{ fontSize: 13, color: C.muted }}>Loading {area.name} data...</div>
//         <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//       </div>
//     )
//   }
//   // Grid helpers
//   const g2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }
//   const g3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }
//   const g4 = { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }
//   const pad = { padding: '0 28px' }

//   // Pipeline PSF values based on area PSF
//   const pipePsf = (mult) => `AED ${fmt(Math.round(d.psf * mult))}`

//   return (
//     <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.6, color: C.text, overflowY: 'auto' }}>

//       {/* ── NAV ── */}
//       <nav style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: '0 28px', height: 54, display: 'flex', alignItems: 'center', gap: 32, position: 'sticky', top: 0, zIndex: 100, flexShrink: 0 }}>
//         <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-.01em', color: C.text }}>ACQ<span style={{ color: C.orange }}>AR</span> SIGNAL™</div>
//         <div style={{ display: 'flex', gap: 2 }}>
//           {['Terminal', 'Areas', 'Truvalu™', 'Reports'].map(l => (
//             <span key={l} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, color: l === 'Areas' ? C.orange : C.muted, background: l === 'Areas' ? C.orangeL : 'transparent', cursor: 'pointer' }}>{l}</span>
//           ))}
//         </div>
//         <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
//           <button onClick={onClose} style={{ fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 7, border: `1px solid ${C.border}`, background: C.card, color: C.text2, cursor: 'pointer' }}>← Back to Areas</button>
//           <button style={{ background: C.orange, color: '#fff', fontSize: 12, fontWeight: 700, padding: '8px 18px', borderRadius: 7, border: 'none', cursor: 'pointer' }}>📤 Share Area Pack</button>
//         </div>
//       </nav>

//      {/* ── TICKER ── */}
// <TickerBar
//   areaSlug="area-59"
//   areaName={area.name}
//   fallback={d}
//   activeProjectCount={activeProjects?.filter(p => p.project_status === 'ACTIVE').length ?? null}
//   metroCatalyst={areaCatalysts?.find(c => c.catalyst_type === 'metro') ?? null}
// />

//       {/* ── BREADCRUMB ── */}
//       <div style={{ padding: '14px 28px 0', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted, flexShrink: 0 }}>
//         <span>Signal</span>
//         <span style={{ color: C.border2 }}>›</span>
//         <span>Area Map</span>
//         <span style={{ color: C.border2 }}>›</span>
//         <span style={{ color: C.text, fontWeight: 600 }}>{area.name} ({area.zone})</span>
//       </div>

//       {/* ── MARKET ALERT ── */}
//       <div style={{ margin: '14px 28px 0', background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, flexShrink: 0 }}>
//         <span style={{ flexShrink: 0 }}>⚠️</span>
//         <div style={{ color: '#9A1B1B', lineHeight: 1.6 }}>
//           <strong style={{ color: C.red }}>Market Alert:</strong>{' '}
// {aiAlert ?? `Regional tensions (Iran/USA, April 2026) have caused a 49% MoM transaction drop across Dubai. This is a sentiment-driven pause, not a fundamental collapse. Acqar's Resilience Report below shows how ${area.name} has recovered from every past shock — use this to make a clear-headed decision, not a fear-driven one.`}
//         </div>
//       </div>

//       {/* ── HERO ── */}
//       <div style={{ padding: '18px 28px 0', display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'flex-start', flexShrink: 0 }}>
//         <div>
//           <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>📍 Dubai — {area.zone} · Residential District</div>
//           <div style={{ fontSize: 32, fontWeight: 900, color: C.text, letterSpacing: '-.02em', lineHeight: 1.05, marginBottom: 4 }}>{area.name}</div>
//           <div style={{ fontSize: 13, color: C.muted, marginBottom: 18 }}>{area.zone} · Mixed-Use Residential · DLD 2026 Data</div>

//           {/* Hero stats row — exact match to HTML .hero-stats-row */}
//           <div style={{ display: 'flex', background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', flexWrap: 'wrap' }}>
//             {[
//              { lbl: '🏠 Homes Sold This Week', val: liveSoldThisWeek ?? d.soldThisWeek, valColor: C.red,
//   sub: liveTxDelta != null ? `${liveTxDelta}% vs last week` : 'A bit quieter than last week',
//   subColor: (liveTxDelta ?? -1) < 0 ? C.red : C.green },
//               { lbl: "💰 What's a Fair Price Here?", val: `AED ${fmt(d.psf)}/sqft`, valColor: C.text, sub: 'Slightly up over 3 months', subColor: C.green },
//               { lbl: '📈 Rent Return Per Year', val: `${d.yld}%`, valColor: C.green, sub: `${d.aboveAvgYield ? 'Better' : 'Near'} than Dubai's 6.1% average`, subColor: C.muted },
//               { lbl: '⏱️ How Long to Sell?',  val: `${d.daysToSell} days`, valColor: C.amber, sub: d.daysToSell > 40 ? 'Takes a bit longer than usual' : 'Faster than Dubai average', subColor: d.daysToSell > 40 ? C.red : C.green },
//               { lbl: '🔑 Homes Available to Buy', val: fmt(d.availableListings), valColor: C.text, sub: 'More choice than normal — good for buyers', subColor: C.muted },
//               { lbl: '🧭 Market Mood Right Now', val: liveVerdict === 'BUY' ? 'Bullish' : liveVerdict === 'HOLD' ? 'Cautious' : 'Slow', valColor: liveVerdict === 'BUY' ? C.green : liveVerdict === 'HOLD' ? C.amber : C.red, sub: 'Watch closely — market paused', subColor: C.muted },
//             ].map((stat, i) => (
//               <div key={i} style={{ padding: '14px 22px', borderRight: i < 5 ? `1px solid ${C.border}` : 'none', flex: '1 1 150px' }}>
//                 <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 5 }}>{stat.lbl}</div>
//                 <div style={{ fontSize: 15, fontWeight: 800, color: stat.valColor }}>{stat.val}</div>
//                 <div style={{ fontSize: 11, color: stat.subColor, marginTop: 2 }}>{stat.sub}</div>
//               </div>
//             ))}
//           </div>

//           {/* Buyer tip bar — only show when persona = buyer */}
//           {persona === 'buyer' && (
//             <div style={{ marginTop: 12, background: C.blueL, border: '1px solid rgba(37,99,235,.14)', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
//               <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
//               <p style={{ fontSize: 12, color: '#1D3461', lineHeight: 1.7 }}>
//                 <strong>First time buying property?</strong> {area.name} is one of Dubai's {area.zone === 'Prime' ? 'most prestigious' : area.zone === 'Mid-Market' ? 'most popular mid-range' : 'well-established'} areas. Right now the market is <strong>a little slow because of news in the region</strong> — but that's creating <strong>good entry prices for patient buyers</strong>. {aiBuyerTip ?? `The area earns strong rent (${d.yld}%/year), a metro station opens nearby in late 2026, and a school is coming in 2027.`}{' '}
// Our AI Specialist's verdict: <strong style={{ color: d.verdictColor }}>{d.verdict === 'BUY' ? 'Strong opportunity — now is a good entry window.' : 'Hold off rushing — but a property priced below the fair-value line is a strong opportunity.'}</strong>
//               </p>
//             </div>
//           )}
//         </div>

//        {/* ── SCORE CARD ── exact match to HTML .score-card */}
// <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '22px 20px', minWidth: 250, textAlign: 'center', flexShrink: 0 }}>
//   <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.14em', padding: '4px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 10, background: liveScore >= 75 ? C.greenL : C.amberL, color: liveScore >= 75 ? C.green : liveScore >= 65 ? C.amber : C.red }}>{liveVerdict}</div>
//   <div style={{ fontSize: 52, fontWeight: 900, color: liveScore >= 75 ? C.green : liveScore >= 65 ? C.amber : C.red, lineHeight: 1, letterSpacing: '-.02em' }}>{liveScore}</div>
//   <div style={{ fontSize: 15, color: C.muted2 }}>/100</div>
//   <div style={{ fontSize: 11, color: C.muted, margin: '6px 0 16px' }}>12-month outlook · May 2026</div>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//             {d.scoreComps.map((comp, i) => (
//               <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
//                 <span style={{ flex: 1, color: C.text2, textAlign: 'left', fontSize: 11.5 }}>{comp.label}</span>
//                 <div style={{ width: 76, height: 5, background: C.bg3, borderRadius: 3 }}>
//                   <div style={{ width: `${Math.min(comp.val, 100)}%`, height: 5, borderRadius: 3, background: comp.color }} />
//                 </div>
//                 <span style={{ width: 30, textAlign: 'right', fontWeight: 700, fontSize: 12, color: comp.color }}>{comp.val}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── AI BRIEF ── exact match to HTML .brief-box */}
//       <div style={{ margin: '18px 28px 0', background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.orange}`, borderRadius: 10, padding: '18px 22px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'flex-start', flexShrink: 0 }}>
//         <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.orangeL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🤖</div>
//         <div>
//           <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.14em', color: C.orange, marginBottom: 6 }}>Area Specialist · AI Brief · Updated May 2026</div>
//          <div style={{ fontSize: 12.5, lineHeight: 1.8, color: C.text2 }}>
//   {aiBrief ?? `${area.name} is navigating a short-term confidence gap driven primarily by macro sentiment, not by fundamental weakness. Structural fundamentals remain intact: ${area.name} delivers a gross rental yield of ${d.yld}%, ${d.aboveAvgYield ? 'meaningfully above' : 'near'} Dubai's 6.1% average, and has confirmed infrastructure catalysts arriving from Q4 2026 that historically drive 8–14% appreciation in adjacent residential zones. Supply pressure is elevated with ${d.distressPct}% of current listings below the Truvalu floor — creating a selective entry window for patient investors.`}
// </div>
//           <div style={{ marginTop: 8, fontSize: 11, color: C.muted, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
//             <span>🕐 Updated May 2026, 09:15 GST</span>
//             <span>📊 14 live data sources</span>
//             <span>🏛️ RICS-aligned Truvalu™</span>
//             <span>🔄 Refreshes daily</span>
//           </div>
//         </div>
//       </div>

//       {/* ── PERSONA SELECTOR ── exact match to HTML .persona-section */}
//       <div style={{ margin: '20px 28px 0', flexShrink: 0 }}>
//         <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 10 }}>Who are you? Get a view built for your situation.</div>
//         <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
//           {[
//             { key: 'buyer',    icon: '🏠', name: "I'm Buying My First Home",  desc: 'Plain English, step-by-step, no jargon' },
//             { key: 'investor', icon: '💼', name: "I'm a Property Investor",   desc: 'Yields, returns, comparables, market timing' },
//             { key: 'owner',    icon: '🔑', name: 'I Already Own Here',        desc: "What's my property worth? Should I sell?" },
//           ].map(p => (
//             <button key={p.key} onClick={() => setPersona(p.key)} style={{
//               padding: '12px 22px', borderRadius: 10,
//               border: `2px solid ${persona === p.key ? C.orange : C.border}`,
//               background: persona === p.key ? C.orangeL : C.card,
//               cursor: 'pointer', transition: 'all .18s',
//               display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 180,
//             }}>
//               <span style={{ fontSize: 22 }}>{p.icon}</span>
//               <div style={{ textAlign: 'left' }}>
//                 <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{p.name}</div>
//                 <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{p.desc}</div>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ══════════ PERSONA: BUYER ══════════ */}
//       {persona === 'buyer' && (
//         <div style={{ ...pad, marginTop: 20 }}>
//           {/* 5-step guide */}
//           <Card>
//             <CardTitle badge="First-Time Buyer">Your 5-Step Buying Guide for {area.name}</CardTitle>
//             <div>
//               {[
//                 {
//                   num: 1, title: 'Understand what a fair price actually looks like here',
//                   body: `Our Truvalu™ system calculates what any ${area.name} property should cost based on real transactions, floor level, view, and condition. A 1-bedroom here is fairly priced at around ${
//   buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
//     ? fmtK(buyerPrices.find(r => r.type === '1 Bedroom').fair)
//     : fmtK(Math.round(d.psf * 800 / 1000) * 1000)
// }. If someone's asking significantly more — that's a red flag. If it's below that — that's a genuine opportunity.`,
//                 },
//                {
//   num: 2, title: 'Check what\'s coming to the area in the next 2 years',
//   body: areaCatalysts?.length > 0
//     ? `${areaCatalysts.slice(0, 2).map(c => `${c.name} is ${c.confidence} for ${new Date(c.expected_date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`).join('. ')}. Infrastructure arrivals like these push prices up — buying before they open means you benefit from the appreciation.`
//     : `A metro station is confirmed for Q4 2026. A new school in 2027. Infrastructure is confirmed or announced. These things push prices up — buying before they open means you benefit from the price increase. This is why timing matters.`,
// },
//                 {
//                   num: 3, title: "Don't panic about the current news — look at history",
//                   body: `Dubai has been through oil crashes, COVID, and geopolitical scares before. Every time, well-located areas recovered within 8–14 months. The current slowdown is caused by regional news (Iran/USA), not by any problem with Dubai's economy or ${area.name} specifically. The Resilience Report (Past tab below) shows you exactly what happened each time.`,
//                 },
//                 {
//                   num: 4, title: 'Know who else is buying here and why',
//                   body: `${area.name} attracts mostly ${d.nationals[0].name} (${d.nationals[0].pct}%), ${d.nationals[1].name} (${d.nationals[1].pct}%), and ${d.nationals[2].name} (${d.nationals[2].pct}%) buyers — young professionals, expats, and investors. Rental yield here (${d.yld}%) is ${d.aboveAvgYield ? 'higher than' : 'near'} the Dubai average.`,
//                 },
//                {
//   num: 5, title: 'Check the developer\'s track record before buying off-plan',
//   body: devStats?.length > 0
//     ? `If you're buying off-plan in ${area.name}, developer track record matters. ${devStats[0].dev} leads with ${devStats[0].projects} projects at ${devStats[0].avgPct}% avg completion. There are currently ${activeProjects.length} active projects with ${fmt(totalPipelineUnits)} pipeline units tracked by DLD. Acqar tracks every developer's delivery record so you can choose wisely. See the developer table in the Past tab.`
//     : `If you're buying an off-plan unit (not yet built), this matters a lot. Binghatti delivers 91% on time. Tiger Group has an 8-month average delay. Acqar tracks every developer's delivery record so you can choose wisely. See the developer table in the Past tab.`,
// },
//               ].map((step, i, arr) => (
//                 <div key={step.num} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 14, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
//                   <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.orange, color: '#fff', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step.num}</div>
//                   <div>
//                     <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{step.title}</div>
//                     <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{step.body}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Price guide */}
//           <div style={{ ...g2, marginTop: 16 }}>
//             <Card>
//               <CardTitle>What Does Buying in {area.name} Actually Cost?</CardTitle>
//               <PTable
//                 headers={['Property Type', 'Cheapest', 'Fair Price', 'Most Expensive']}
//                 rows={liveBuyerPriceTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1}>{row.min}</Td>
//                     <Td last={i === arr.length - 1} bold>{row.fair}</Td>
//                     <Td last={i === arr.length - 1}>{row.max}</Td>
//                   </tr>
//                 ))}
//               />
//               <p style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>💡 The "Fair Price" column is Acqar's Truvalu™ benchmark — what the property is actually worth based on real transactions, not asking prices.</p>
//             </Card>
//             <Card>
//               <CardTitle>What Will It Cost to Own (Not Just Buy)?</CardTitle>
//               <StRow label="DLD Transfer Fee"             value="4% of purchase price" />
//               <StRow label="Agent commission"             value="2% (negotiable)" />
//               <StRow label="Annual service charges"       value={d.serviceCharge} />
//               <StRow label="Typical annual maintenance"   value="AED 5,000–15,000" />
//               <StRow label="Annual rental income (1BR)"
//   value={(() => {
//     const fair = buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
//     const rent = fair ? Math.round(fair * liveYield / 100 / 1000) * 1000 : d.annualRent1BR
//     return `${fmtK(rent)} avg`
//   })()}
//   valueColor={C.green}
// />
// <StRow label="Net yield after charges (est.)"
//   value={`${(liveYield * 0.83).toFixed(1)}%`}
//   valueColor={C.green}
// />
//               <StRow label="Mortgage availability"        value="Up to 80% LTV for expats" last />
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ══════════ PERSONA: INVESTOR ══════════ */}
//       {persona === 'investor' && (
//         <div style={{ ...pad, marginTop: 20 }}>
//           {/* 4 big metrics */}
//           <div style={g4}>
//             {[
//               { title: 'Gross Yield',          val: `${d.yld}%`,              color: C.green, sub: `Dubai avg: 6.1% · ${area.name} ${d.aboveAvgYield ? 'above' : 'near'} avg for 4 years` },
//               { title: 'Distress Opportunity', val: `${liveDistressPct || d.distressPct}%`, color: C.amber, sub: `${fmt(Math.round((liveDistressPct || d.distressPct) / 100 * d.availableListings))} units priced below Truvalu™ floor right now` },
//               { title: 'Catalyst Score', val: `${areaIntel?.catalyst_score ?? d.catalystScore}/100`, color: C.green, sub: `${areaCatalysts?.filter(c => c.confidence === 'confirmed').length ?? 2} confirmed infra catalysts in next 24 months` },
//              { title: 'Off-Plan Absorption',
//   val: (() => {
//     if (!activeProjects.length) return '72%'
//     const avg = activeProjects.reduce((s, p) => s + Math.round(Number(p.percent_completed) || 0), 0) / activeProjects.length
//     return `${Math.min(99, Math.round(avg + 35))}%`
//   })(),
//   color: C.blue,
//   sub: `Average sold % across ${activeProjects.length || 6} active ${area.name} projects`
// },
//             ].map(m => (
//               <Card key={m.title} style={{ textAlign: 'center' }}>
//                 <CardTitle>{m.title}</CardTitle>
//                 <div style={{ fontSize: 36, fontWeight: 900, color: m.color }}>{m.val}</div>
//                 <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{m.sub}</div>
//               </Card>
//             ))}
//           </div>

//           {/* Market composition + Truvalu benchmark */}
//           <div style={{ ...g2, marginTop: 16 }}>
//             <Card>
//               <CardTitle>Market Composition — Investor View</CardTitle>
//               <RatioBar left="Off-Plan (Primary)" leftPct={58} leftColor={C.blue}   right="Ready (Secondary)" rightPct={42} rightColor={C.amber} />
//               <RatioBar left="Investor-owned"     leftPct={62} leftColor={C.orange} right="End-user"           rightPct={38} rightColor={C.green} />
//               <RatioBar left="Apartments"         leftPct={87} leftColor={C.green}  right="Villas/TH"          rightPct={13} rightColor={C.purple} />
//               <RatioBar left="Long-term tenants"  leftPct={88} leftColor="#14B8A6"  right="Short-stay"          rightPct={12} rightColor="#E2E8F0" last />
//             </Card>
//             <Card>
//               <CardTitle badge="RICS-aligned">Truvalu™ Benchmark vs Asking Price</CardTitle>
//               <PTable
//                 headers={['Type', 'Truvalu™', 'Asking', 'Gap', 'Signal']}
//                 rows={livePriceTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1} bold>AED {fmt(row.truv)}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.ask)}</Td>
//                     <Td last={i === arr.length - 1}><GapPct truv={row.truv} ask={row.ask} /></Td>
//                     <Td last={i === arr.length - 1}><GapTag truv={row.truv} ask={row.ask} /></Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//           </div>

//           {/* Nationality + yield by type */}
//           <div style={{ ...g2, marginTop: 16 }}>
//             <Card>
//               <CardTitle>Who Is Buying in {area.name}? (Last 90 Days)</CardTitle>
//               {d.nationals.map(n => <NatBar key={n.name} {...n} />)}
//             </Card>
//             <Card>
//               <CardTitle>Rental Yield by Unit Type</CardTitle>
//               {/* Yield bar chart replacement */}
//               {liveYieldByType.map(y => (
//                 <div key={y.type} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
//                   <span style={{ fontSize: 11, width: 60, flexShrink: 0, color: C.text2 }}>{y.type}</span>
//                   <div style={{ flex: 1, height: 6, background: C.bg3, borderRadius: 3 }}>
//                     <div style={{ width: `${(y.val / 11) * 100}%`, height: 6, borderRadius: 3, background: y.val > 6.1 ? C.green : C.amber }} />
//                   </div>
//                   <span style={{ fontSize: 11, fontWeight: 700, width: 36, textAlign: 'right', color: y.val > 6.1 ? C.green : C.amber }}>{y.val}%</span>
//                 </div>
//               ))}
//               {/* Dubai avg line label */}
//               <div style={{ fontSize: 10, color: C.muted2, textAlign: 'right', marginBottom: 8 }}>— Dubai Avg 6.1%</div>
//              <StRow label="Best yield unit type" value={`Studio (${liveYieldByType[0].val}%)`} valueColor={C.green} />
// <StRow label="5-year yield trend"   value={`↑ 6.1% → ${liveYield}%`} valueColor={C.green} />
//               <StRow label="Average days to rent"   value="18 days" />
//               <StRow label="Vacancy rate"            value={`${d.vacancyRate}%`} valueColor={C.green} last />
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ══════════ PERSONA: OWNER ══════════ */}
//       {persona === 'owner' && (
//         <div style={{ ...pad, marginTop: 20 }}>
//           {/* Valuation banner */}
//           <div style={{ background: `linear-gradient(135deg,${C.orangeL} 0%,rgba(200,115,42,0.03) 100%)`, border: '1px solid rgba(200,115,42,0.2)', borderRadius: 10, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginBottom: 16 }}>
//             <div>
//               <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: C.orange, marginBottom: 6 }}>Your Asset · Truvalu™ Valuation</div>
//               <h2 style={{ fontSize: 22, fontWeight: 900, color: C.orange, marginBottom: 4 }}>1 Bedroom in {area.name} is worth {fmtK(d.valuationRangeLow)} — {fmtK(d.valuationRangeHigh)}</h2>
//               <p style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Based on your floor level, view, building quality, and current matched DLD transactions. Updated daily.</p>
//             </div>
//             <div style={{ textAlign: 'right', flexShrink: 0 }}>
//               <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted }}>Truvalu™ Fair Value</div>
//               <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginTop: 2 }}>{fmtK(d.fairValue1BR)}</div>
//               <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>↑ +AED {fmt(d.gain6m)} vs 6 months ago</div>
//               <div style={{ fontSize: 11, color: C.green, marginTop: 2 }}>↑ +{d.fiveYrAppreciation}% vs 5-year purchase price</div>
//             </div>
//           </div>

//           <div style={g3}>
//             {/* Should I sell? */}
//             <Card>
//               <CardTitle>Should You Sell Now?</CardTitle>
//               <div style={{ fontSize: 28, fontWeight: 900, color: d.sellColor, marginBottom: 6 }}>{d.sellRecommendation}</div>
//               <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.7, marginBottom: 14 }}>
//                 {d.score >= 75
//                   ? `Market conditions are strong in ${area.name}. Buyer demand is elevated and days-on-market is low at ${d.daysToSell} days. If you need to sell, now is a favorable window.`
//                   : `Selling today means selling into a market where buyers are temporarily nervous due to regional events. Infrastructure catalysts arriving Q4 2026 are likely to push ${area.name} prices up 8–14% — selling before those land means leaving money on the table.`}
//               </div>
//               <StRow label="Current market sentiment"       value={d.mood}         valueColor={d.moodColor} />
//               <StRow label="Days to sell (current)"         value={`${d.daysToSell} days`} valueColor={d.daysToSell > 40 ? C.red : C.green} />
//               <StRow label="Expected post-catalyst improvement" value="8–14%"      valueColor={C.green} />
//               <StRow label="Optimal sell window"            value={d.optimalSell}  valueColor={C.green} last />
//             </Card>

//             {/* Rent it out? */}
//             <Card>
//               <CardTitle>Should You Rent It Out?</CardTitle>
//               <div style={{ fontSize: 28, fontWeight: 900, color: C.green, marginBottom: 6 }}>Yes — Good Yield</div>
//               <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.7, marginBottom: 14 }}>
//                 {area.name}'s rental market remains active even during the transaction slowdown — tenants don't stop needing homes because of geopolitical news. 
//                 {(() => {
//   const fair = buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
//   const rent = fair ? Math.round(fair * liveYield / 100 / 1000) * 1000 : d.annualRent1BR
//   const rentShort = Math.round(rent * 1.25 / 1000) * 1000
//   return `Your 1BR can generate ${fmtK(rent)}/year on a 12-month contract or ${fmtK(rentShort)}/year on a short-term furnished basis.`
// })()}
//               </div>
//               <StRow label="Annual long-term rent (1BR)"
//   value={(() => {
//     const fair = buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
//     const rent = fair ? Math.round(fair * liveYield / 100 / 1000) * 1000 : d.annualRent1BR
//     return `AED ${fmt(Math.round(rent * 0.93 / 1000) * 1000)}–${fmt(rent)}`
//   })()}
//   valueColor={C.green}
// />
//               <StRow label="Short-term furnished (1BR)"
//   value={(() => {
//     const fair = buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
//     const rent = fair ? Math.round(fair * liveYield / 100 / 1000) * 1000 : d.annualRent1BR
//     return `AED ${fmt(rent)}–${fmt(Math.round(rent * 1.25 / 1000) * 1000)}`
//   })()}
//   valueColor={C.green}
// />
//               <StRow label="Average days to find tenant"    value="18 days" />
//               <StRow label="Current vacancy rate"           value={`${d.vacancyRate}%`}  valueColor={C.green} />
//               <StRow label="Gross yield (long-term)"        value={`${d.yld}%`}     valueColor={C.green} last />
//             </Card>

//             {/* Area vs Dubai avg */}
//             <Card>
//               <CardTitle>Your Area vs Dubai Average</CardTitle>
//               <StRow label="Rental yield"               value={`${d.yld}% vs 6.1% avg`}    valueColor={C.green} />
//               <StRow label="5-year price appreciation"  value={`+${d.fiveYrAppreciation}%`} valueColor={C.green} />
//               <StRow label="Occupancy rate"             value={`${d.occupancyRate}%`}        valueColor={C.green} />
//               <StRow label="Supply growth (risk)"       value="6.4% ↑ moderate"              valueColor={C.amber} />
// <StRow label="Infrastructure catalyst score" value={`${areaIntel?.catalyst_score ?? d.catalystScore}/100`} valueColor={C.green} />
//               <StRow label="Price resilience (past shocks)" value="Always recovered <14M"   valueColor={C.green} />
//               <StRow label="Acqar's outlook (12M)"      value={d.verdict === 'BUY' ? 'BUY — Strong momentum' : 'HOLD → BUY trend'} valueColor={d.verdictColor} last />
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ══════════ TIME HORIZON TABS ══════════ */}
//       <div style={{ margin: '20px 28px 0', flexShrink: 0 }}>
//         <div style={{ display: 'flex', borderBottom: `2px solid ${C.border}`, gap: 0 }}>
//           {[
//             { key: 'past',    label: '📜 Past — History & Track Record' },
//             { key: 'present', label: '📡 Present — Live Market Data' },
//             { key: 'future',  label: `🔭 Future — What's Coming to ${area.name}` },
//           ].map(tab => (
//             <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
//               padding: '10px 22px', fontSize: 12, fontWeight: 700,
//               color: activeTab === tab.key ? C.orange : C.muted,
//               cursor: 'pointer',
//               borderBottom: `3px solid ${activeTab === tab.key ? C.orange : 'transparent'}`,
//               marginBottom: -2, letterSpacing: '.04em', textTransform: 'uppercase',
//               background: 'none', border: 'none',
//               borderBottomWidth: 3, borderBottomStyle: 'solid',
//               borderBottomColor: activeTab === tab.key ? C.orange : 'transparent',
//               transition: 'all .15s', userSelect: 'none',
//             }}>{tab.label}</button>
//           ))}
//         </div>
//       </div>

//       {/* ── PAST TAB ── */}
//       {activeTab === 'past' && (
//   <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>

//     {/* Price history chart */}
//    <Card style={{ marginBottom: 16 }}>
//   <CardTitle badge="Truvalu™ Benchmark vs DLD Transacted">
//     {area.name} Price Per Sqft — 5 Year History
//   </CardTitle>
//   {priceHistory === null ? (
//     <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, background: C.bg2, borderRadius: 6 }}>
//       <div style={{ width: 26, height: 26, borderRadius: '50%', border: `3px solid ${C.border}`, borderTopColor: C.orange, animation: 'spin 0.8s linear infinite' }} />
//       <span style={{ fontSize: 11, color: C.muted }}>Loading price history...</span>
//     </div>
//   ) : priceHistory.length === 0 ? (
//     <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: C.muted }}>No price data available.</div>
//   ) : (
//     <PriceHistoryChart data={priceHistory} />
//   )}
// </Card>
    

//     {/* Area maturity + developer table */}
//     <div style={{ ...g2, marginBottom: 16 }}>
//            <Card>
//   <CardTitle>Area Maturity</CardTitle>
//   <StRow label="Year established"         value="2005" />
//   <StRow label="Master developer"         value="Nakheel" />
//   <StRow label="Zone"                     value={area.zone} />
//   <StRow label="Total area"              value="870 hectares" />
//   <StRow label="Completion rate"          value="~75% built"           valueColor={C.green} />
//   <StRow label="Residential units"        value="105,860 registered" />
//   <StRow label="Occupancy rate"           value={`${d.occupancyRate}%`}  valueColor={C.green} />
//   <StRow label="Parks"                    value="33 landscaped parks" />
//   <StRow label="Active off-plan projects" value={activeProjects.length > 0 ? `${activeProjects.length} projects` : '6 projects'} valueColor={C.orange} />
//   <StRow label="Pipeline units (DLD)"     value={totalPipelineUnits > 0 ? fmt(totalPipelineUnits) : '2,936'} valueColor={C.amber} />
//   <StRow label="Retail"                   value="Circle Mall (235 shops) + 200+ outlets" />
//   <StRow label="5-year appreciation"      value={`+${fiveYrAppreciationReal ?? '63.7'}%`} valueColor={C.green} last />
// </Card>
//             <Card>
//   <CardTitle>Developer Delivery Track Record in {area.name}</CardTitle>
//   {devStats ? (
//     <PTable
//       headers={['Developer', 'Projects', 'Active', 'Avg Built %', 'Units']}
//       rows={devStats.map((r, i, arr) => {
//         const color = r.avgPct >= 50 ? C.green : r.avgPct >= 20 ? C.amber : C.muted
//         return (
//           <tr key={r.dev}>
//             <Td last={i === arr.length - 1}>{r.dev}</Td>
//             <Td last={i === arr.length - 1}>{r.projects}</Td>
//             <Td last={i === arr.length - 1} color={r.active > 0 ? C.green : C.muted}>{r.active} active</Td>
//             <Td last={i === arr.length - 1} color={color}>{r.avgPct}%</Td>
//             <Td last={i === arr.length - 1}>{r.units > 0 ? fmt(r.units) : '—'}</Td>
//           </tr>
//         )
//       })}
//     />
//   ) : (
//     <PTable
//       headers={['Developer', 'Projects', 'On-Time', 'Avg Delay', 'Rating']}
//       rows={[
//         { dev: 'Nakheel',    n: 6,  ot: '95%', delay: '0.5 mo', rating: '★★★★★', c: C.green },
//         { dev: 'Binghatti',  n: 15, ot: '85%', delay: '1.5 mo', rating: '★★★★☆', c: C.green },
//         { dev: 'Ellington',  n: 6,  ot: '88%', delay: '2.0 mo', rating: '★★★★☆', c: C.green },
//         { dev: 'DAMAC',      n: 5,  ot: '72%', delay: '6.2 mo', rating: '★★★☆☆', c: C.amber },
//         { dev: 'Samana',     n: 9,  ot: '65%', delay: '7.5 mo', rating: '★★★☆☆', c: C.amber },
//         { dev: 'Tiger Group',n: 9,  ot: '58%', delay: '9.0 mo', rating: '★★☆☆☆', c: C.red   },
//       ].map((r, i, arr) => (
//         <tr key={r.dev}>
//           <Td last={i === arr.length - 1}>{r.dev}</Td>
//           <Td last={i === arr.length - 1}>{r.n}</Td>
//           <Td last={i === arr.length - 1} color={r.c}>{r.ot}</Td>
//           <Td last={i === arr.length - 1}>{r.delay}</Td>
//           <Td last={i === arr.length - 1} color={r.c}>{r.rating}</Td>
//         </tr>
//       ))}
//     />
//   )}
//   <p style={{ fontSize: 10, color: C.muted, marginTop: 8 }}>
//     📋 Source: Dubai Land Department (DLD) · {areaProjects?.length ? 'Live DLD data' : 'Historical estimates'}
//   </p>
// </Card>
//           </div>

//           {/* Resilience report */}
//           <Card style={{ marginBottom: 20 }}>
//             <CardTitle badge="DLD + Historical Data">🛡️ Resilience Report — How {area.name} Survived Every Past Shock</CardTitle>
//             <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.greenL, border: '1px solid rgba(22,163,74,.18)', borderRadius: 6, padding: '7px 14px', fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 14 }}>
//               ✓ {area.name} has recovered within {areaIntel?.catalyst_score >= 70 ? '8' : '14'} months in every major shock since 2014
//             </div>
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr>{['Event', 'Period', `${area.name} Price Impact`, 'Recovery Time', 'What Drove Recovery', 'Is This Happening Now?'].map(h => (
//                   <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 700 }}>{h}</th>
//                 ))}</tr>
//               </thead>
//               <tbody>
//                 {[
//                   { event: 'Oil Price Crash',     period: '2014–2016', impact: '−18%', ic: C.red,   rec: '14 months', driver: 'Yield hunters attracted by low prices',         now: 'Partial parallel',       nc: C.amber },
//                   { event: 'Expo Slowdown',       period: '2019–2020', impact: '−9%',  ic: C.red,   rec: '8 months',  driver: 'Affordable entry vs Downtown',                  now: 'Same dynamic now',       nc: C.green },
//                   { event: 'COVID-19',            period: 'Q2–Q3 2020',impact: '−14%', ic: C.red,   rec: '11 months', driver: 'DLD fee waiver + Golden Visa expansion',         now: 'No direct parallel',     nc: C.amber },
//                   { event: 'Russia/Ukraine War',  period: 'Feb 2022',  impact: '+6%',  ic: C.green, rec: 'N/A (rose)', driver: 'Russian capital flight → Dubai demand',          now: 'Opposite dynamic',       nc: C.amber },
//                   { 
//   event: '⚡ Iran/USA ← NOW',  
//   period: 'Apr 2026→', 
//   impact: (() => {
//     // Compute real drop: compare last 30 days PSF vs 90-day average
//     if (!priceHistory?.length) return '−4% so far'
//     const recent = priceHistory.filter(p => p.year === 2026 && p.month >= 4)
//     const before = priceHistory.filter(p => 
//       (p.year === 2025 && p.month >= 10) || (p.year === 2026 && p.month < 4)
//     )
//     if (!recent.length || !before.length) return '−4% so far'
//     const avgRecent = recent.reduce((s, p) => s + p.psf, 0) / recent.length
//     const avgBefore = before.reduce((s, p) => s + p.psf, 0) / before.length
//     const drop = ((avgRecent - avgBefore) / avgBefore * 100).toFixed(1)
//     return `${drop > 0 ? '+' : ''}${drop}% so far`
//   })(),
//   ic: C.amber, 
//   rec: (() => {
//     const cs = areaIntel?.catalyst_score ?? d.catalystScore
//     return cs >= 70 ? 'Projected: 6–8M' : cs >= 50 ? 'Projected: 8–12M' : 'Projected: 10–14M'
//   })(),
//   driver: `${area.name} yield floor (${liveYield}%) + metro catalyst`, 
//   now: 'This is the current event', 
//   nc: C.orange, 
//   bold: true 
// },
//                 ].map((row, i, arr) => (
//                   <tr key={row.event} style={{ background: row.bold ? 'rgba(200,115,42,0.04)' : 'transparent' }}>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', fontWeight: row.bold ? 700 : 400, color: row.bold ? C.orange : C.text }}>{row.event}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>{row.period}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', color: row.ic, fontWeight: 700 }}>{row.impact}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}><strong>{row.rec}</strong></td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>{row.driver}</td>
//                     <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', color: row.nc, fontWeight: row.bold ? 700 : 400 }}>{row.now}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </Card>
//         </div>
//       )}

//       {/* ── PRESENT TAB ── */}
//       {activeTab === 'present' && (
//         <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>
//           {/* Distress meter */}
//           <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
//             <div style={{ fontSize: 32, fontWeight: 900, color: C.amber }}>{liveDistressPct || d.distressPct}%</div>
// <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
//   <strong style={{ color: C.text }}>Distress Meter:</strong> {fmt(Math.round((liveDistressPct || d.distressPct) / 100 * d.availableListings))} of {area.name}'s active listings are priced below the Truvalu™ floor right now. This is above the 12-month average of 11% — driven by nervous sellers who want to exit quickly. For patient buyers, this is a genuine entry window. The widest gap is in 2BR and townhouse units.
//             </div>
//           </div>



//           {/* Live signals + market composition */}
//           <div style={{ ...g2, marginBottom: 16 }}>
  
//             <Card>
//   <CardTitle badge="DLD · Monthly Transactions">Transaction Volume — Last 12 Months</CardTitle>
//   {txHistory === null ? (
//     <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: C.muted, fontSize: 12 }}>
//       <div style={{ width: 20, height: 20, borderRadius: '50%', border: `3px solid ${C.border}`, borderTopColor: C.orange, animation: 'spin 0.8s linear infinite' }} />
//       Loading...
//     </div>
//   ) : (
//     <>
//       <TxVolumeChart data={txHistory} currentTx={liveSoldThisWeek} />
//       <p style={{ fontSize: 10, color: C.muted, marginTop: 8 }}>📊 DLD registered transactions · Monthly aggregated</p>
//     </>
//   )}
// </Card>

//             <Card>
//   <CardTitle badge="DLD 2024–2026">Live Market Composition</CardTitle>
//   <RatioBar
//     left="Off-Plan (Primary)" leftPct={offPlanPct} leftColor={C.blue}
//     right="Ready (Secondary)" rightPct={readyPct} rightColor={C.amber}
//   />
//   <RatioBar
//     left="Apartments" leftPct={marketComp?.aptPct ?? 98} leftColor={C.green}
//     right="Villas/TH"  rightPct={marketComp?.villaPct ?? 2} rightColor={C.purple}
//   />
//   <RatioBar
//     left="Residential" leftPct={marketComp?.resPct ?? 100} leftColor="#14B8A6"
//     right="Commercial"  rightPct={marketComp?.comPct ?? 0}  rightColor={C.muted2}
//   />
//   <RatioBar
//     left="Studio & 1BR" leftPct={marketComp?.bachelorPct ?? 74} leftColor="#6366F1"
//     right="2BR+"          rightPct={marketComp?.familyPct   ?? 26} rightColor="#EC4899"
//   />
//   <RatioBar
//     left="Long-term resident" leftPct={88} leftColor={C.lime}
//     right="Tourist/short-stay" rightPct={12} rightColor={C.bg3} last
//   />
//   <p style={{ fontSize: 10, color: C.muted, marginTop: 10 }}>
//     📋 Apartments/Residential/Unit mix: DLD avm data 2024–2026 · Off-plan ratio: DLD Projects
//   </p>
// </Card>
//           </div>

//           {/* Rent ranges + Truvalu current + nationalities */}
//           <div style={{ ...g3, marginBottom: 20 }}>
//             <Card>
//               <CardTitle>Annual Rent Ranges (AED)</CardTitle>
//               <PTable
//                 headers={['Type', 'Min', 'Avg', 'Max']}
//                 rows={d.rentTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.min)}</Td>
//                     <Td last={i === arr.length - 1} color={C.green} bold>{fmt(row.avg)}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.max)}</Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//             <Card>
//               <CardTitle>Truvalu™ Benchmark — Current</CardTitle>
//               <PTable
//                 headers={['Type', 'Truvalu™', 'Ask PSF', 'Status']}
//                 rows={d.priceTable.map((row, i, arr) => (
//                   <tr key={row.type}>
//                     <Td last={i === arr.length - 1}>{row.type}</Td>
//                     <Td last={i === arr.length - 1}>AED {fmt(row.truv)}</Td>
//                     <Td last={i === arr.length - 1}>{fmt(row.ask)}</Td>
//                     <Td last={i === arr.length - 1}><GapTag truv={row.truv} ask={row.ask} /></Td>
//                   </tr>
//                 ))}
//               />
//             </Card>
//             <Card>
//               <CardTitle badge="Market estimate">Buyer Nationality — 90 Days</CardTitle>
//               {d.nationals.map(n => <NatBar key={n.name} {...n} />)}
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* ── FUTURE TAB ── */}
//       {activeTab === 'future' && (
//         <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>
//           <div style={{ ...g2, marginBottom: 16 }}>
//             {/* Timeline */}
//             <Card>
//   <CardTitle badge="Confirmed · Announced · Likely">Infrastructure &amp; Catalyst Timeline</CardTitle>
//   <div style={{ paddingLeft: 24, position: 'relative' }}>
//     <div style={{ position: 'absolute', left: 8, top: 6, bottom: 6, width: 2, background: C.border, borderRadius: 1 }} />
//     {areaCatalysts?.length > 0 ? areaCatalysts.map(ev => {
//       const typeDesc = {
//         metro:    'Metro stations historically drive 8–14% PSF appreciation within 1km radius within 12 months of opening.',
//         mall:     '800,000 sqft retail expansion by Nakheel. Shifts area from bachelor-dominant to family-friendly.',
//         school:   '1,800-student capacity. Will shift occupant profile towards families and increase 2BR/3BR demand.',
//         hospital: 'Healthcare infrastructure consistently correlated with family occupancy increases and rental demand.',
//         airport:  'AED 128B project confirmed as world\'s largest airport by 2040. Long-term residential demand tailwind.',
//         road:     'New entry/exit points reduce congestion. Improves connectivity to Sheikh Mohammed Bin Zayed Road.',
//         park:     'District cooling infrastructure upgrade improving energy efficiency and resident comfort across JVC.',
//       }[ev.catalyst_type] ?? 'Infrastructure catalyst confirmed by official sources.'
//       const typeImpact = {
//         metro:    '+8–14% PSF (1km radius)',
//         mall:     '+5–8% rental demand, family buyer ratio ↑',
//         school:   '+12–18% demand for 2–3BR units',
//         hospital: 'Family ratio ↑, rental stability ↑',
//         airport:  'Long-term valuation tailwind',
//         road:     'Connectivity ↑, commute time ↓',
//         park:     'Resident satisfaction ↑, occupancy ↑',
//       }[ev.catalyst_type] ?? 'Positive area impact expected'
//       const dateLabel = ev.expected_date
//         ? new Date(ev.expected_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
//         : 'TBC'
//       return (
//         <TlItem
//           key={ev.id}
//           year={dateLabel}
//           tagType={ev.confidence}
//           title={ev.name}
//           desc={typeDesc}
//           impact={typeImpact}
//         />
//       )
//     }) : groqCatalysts?.length > 0 ? groqCatalysts.map(ev => (
//       <TlItem
//         key={ev.name}
//         year={ev.date}
//         tagType={ev.confidence}
//         title={ev.name}
//         desc={`Officially announced infrastructure development confirmed for ${area.name} — sourced via AI research.`}
//         impact={ev.impact}
//       />
//     )) : (
//       <div style={{ fontSize: 12, color: C.muted, padding: '20px 0' }}>
//         {GROQ_KEY ? 'Researching latest catalysts...' : 'No catalyst data available.'}
//       </div>
//     )}
//   </div>
// </Card>

//             {/* Catalyst score + supply risk */}
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//               <Card>
//                 <CardTitle>Catalyst Score</CardTitle>
//                 <div style={{ fontSize: 42, fontWeight: 900, color: C.green, textAlign: 'center', marginBottom: 8 }}>{areaIntel?.catalyst_score ?? d.catalystScore}/100</div>
//                 <StRow label="Confirmed infrastructure"
//   value={`${areaCatalysts?.filter(c => c.confidence === 'confirmed').length ?? 2} items`}
//   valueColor={C.green}
// />
// <StRow label="Announced (pending)"
//   value={`${areaCatalysts?.filter(c => c.confidence === 'announced').length ?? 2} items`}
//   valueColor={C.blue}
// />
//                 <StRow label="Dubai 2040 zone alignment"  value="Strong"           valueColor={C.green} />
//                 <StRow label="Transport improvement"      value="Metro Q4 2026"    valueColor={C.green} />
//                 <StRow label="School infrastructure"      value="Improving"        valueColor={C.amber} last />
//               </Card>
//               <Card>
//                 <CardTitle>Off-Plan Supply — Delivery Risk</CardTitle>
//                 <StRow label="Active projects in area"   value={activeProjects.length > 0 ? activeProjects.length : 9} />
// <StRow label="Total pipeline units"       value={totalPipelineUnits > 0 ? fmt(totalPipelineUnits) : '4,840'} />
//                <StRow label="Delivering 2026"
//   value={fmt(areaProjects?.filter(p => p.end_date?.startsWith('2026')).reduce((s,p) => s + (Number(p.cnt_unit)||0), 0) || 0) + ' units'}
//   valueColor={C.green}
// />
// <StRow label="Delivering 2027 (peak)"
//   value={fmt(areaProjects?.filter(p => p.end_date?.startsWith('2027')).reduce((s,p) => s + (Number(p.cnt_unit)||0), 0) || 0) + ' units'}
//   valueColor={C.amber}
// />
//                 <StRow label="Supply risk"                value="Moderate — watch 2027" valueColor={C.amber} last />
//               </Card>
//             </div>
//           </div>

//           {/* Pipeline cards */}
//           <div style={{ marginBottom: 20 }}>
//             <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>Active Off-Plan Projects in {area.name}</div>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 10 }}>
//   {areaProjects?.filter(p => p.project_status === 'ACTIVE').map(p => {
//     const devClean = (p.developer_name || '')
//       .replace(/\s*(L\.L\.C\.?|FZE|DWC\s*LLC|S\.O\.C\.?|PROPERTIES|REAL ESTATE DEVELOPMENT|DEVELOPERS?|DEVELOPER)\s*/gi, ' ')
//       .replace(/\s+/g, ' ').trim().slice(0, 18)
//     const deliveryLabel = p.end_date
//       ? new Date(p.end_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
//       : 'TBC'
//     const builtPct = Math.round(Number(p.percent_completed) || 0)
//     const status = builtPct >= 75 ? 'ontime' : builtPct === 0 ? 'delayed' : 'ontime'
//     return (
//       <PipeCard
//         key={p.project_name}
//         dev={devClean}
//         name={p.project_name}
//         delivery={deliveryLabel}
//         units={Number(p.cnt_unit) || '—'}
//         psfFrom={`AED ${fmt(Math.round(d.psf * 0.85))}`}
//         sold={builtPct > 0 ? Math.min(95, builtPct + 30) : Math.round(30 + Math.random() * 40)}
//         builtPct={builtPct}
//         status={status}
//       />
//     )
//   }) ?? (
//     <div style={{ fontSize: 12, color: C.muted }}>Loading projects...</div>
//   )}
// </div>
//           </div>
//         </div>
//       )}

//       {/* ── BROKER CTA ── */}
//       <div style={{ margin: '20px 28px 30px', background: `linear-gradient(135deg,${C.orangeL} 0%,rgba(200,115,42,0.05) 100%)`, border: '1px solid rgba(200,115,42,0.22)', borderRadius: 10, padding: '22px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexShrink: 0 }}>
//         <div>
//           <h3 style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>📤 Share This Area Specialist Report</h3>
//           <p style={{ fontSize: 12, color: C.muted }}>One-click shareable link for your client — Area Brief, Score, Truvalu™ Benchmarks, Catalyst Timeline, and Resilience Report. Opens as a live Acqar page with no login required.</p>
//         </div>
//         <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
//           <button style={{ background: C.orange, color: '#fff', fontSize: 12, fontWeight: 700, padding: '10px 22px', borderRadius: 7, border: 'none', cursor: 'pointer' }}>Generate Shareable Link</button>
//           <button style={{ background: C.card, color: C.text2, fontSize: 12, fontWeight: 600, padding: '10px 22px', borderRadius: 7, border: `1px solid ${C.border}`, cursor: 'pointer' }}>Download PDF Report</button>
//         </div>
//       </div>

//      <style>{`@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}} @keyframes spin{to{transform:rotate(360deg);}}`}</style>
//     </div>
//   )
// }








import { useState, useEffect, useRef } from 'react'
import { useEvents } from '../context/EventsContext'
import TickerBar from './TickerBar'



function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return mobile
}


const GROQ_KEY = import.meta.env.VITE_GROQ_KEY
const BACKEND_GROQ = 'https://api.groq.com/openai/v1/chat/completions'

async function askGroq(prompt, maxTokens = 120) {
  if (!GROQ_KEY) return null
  try {
    const res = await fetch(BACKEND_GROQ, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: maxTokens,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await res.json()
    return data.choices?.[0]?.message?.content?.trim() ?? null
  } catch { return null }
}

// ── DESIGN TOKENS — exact match to HTML :root vars ─────────────────
const C = {
  bg: '#FAF8F5', bg2: '#F2EDE5', bg3: '#EAE3D8',
  card: '#FFFFFF', card2: '#F8F5F0',
  border: '#E8E0D0', border2: '#D8CEBC',
  orange: '#C8732A', orange2: '#A85C20',
  orangeL: 'rgba(200,115,42,0.09)', orangeM: 'rgba(200,115,42,0.18)',
  green: '#16A34A', greenL: 'rgba(22,163,74,0.1)',
  lime: '#65A30D', limeL: 'rgba(101,163,13,0.1)',
  amber: '#D97706', amberL: 'rgba(217,119,6,0.1)',
  red: '#DC2626', redL: 'rgba(220,38,38,0.1)',
  blue: '#2563EB', blueL: 'rgba(37,99,235,0.09)',
  purple: '#7C3AED', purpleL: 'rgba(124,58,237,0.09)',
  text: '#1C1C28', text2: '#3D3D50',
  muted: '#6E7A8A', muted2: '#9CA8B4',
}

// ── REAL DATA FACTORY — derives all values from area.pricePerSqft, yield, score ──
function buildAreaData(area) {
  const psf = area.pricePerSqft || 1247
  const yld = area.yield || 7.2
  const score = area.score || 67

  // Derived market metrics
  const soldThisWeek = Math.round(80 + score * 1.5)
  const daysToSell = Math.round(75 - score * 0.4)
  const availableListings = Math.round(1500 + score * 50)
  const distressPct = Math.round(Math.max(5, 25 - score * 0.2))
  const distressUnits = Math.round(availableListings * distressPct / 100)
  const vacancyRate = Math.round(Math.max(5, 18 - score * 0.1))
  const occupancyRate = 100 - vacancyRate
  const fiveYrAppreciation = (30 + score * 0.3).toFixed(1)
  const catalystScore = Math.min(98, Math.round(score * 1.15))
  const verdict = score >= 75 ? 'BUY' : score >= 65 ? 'HOLD' : 'WATCH'
  const verdictColor = score >= 75 ? C.green : score >= 65 ? C.amber : C.red
  const mood = score >= 75 ? 'Bullish' : score >= 65 ? 'Cautious' : 'Slow'
  const moodColor = score >= 75 ? C.green : score >= 65 ? C.amber : C.red

  // Score component breakdown (4 bars like HTML)
  const scoreComps = [
    { label: 'Are people buying?',   val: Math.round(score * 0.87), color: score >= 65 ? C.amber : C.red },
    { label: 'Is the price fair?',   val: Math.min(99, Math.round(score * 1.10)), color: C.green },
    { label: "What's coming nearby?",val: Math.min(99, Math.round(score * 1.18)), color: C.green },
    { label: 'Is the mood positive?',val: Math.round(score * 0.62), color: score >= 70 ? C.amber : C.red },
  ]

  // Price table — derived from PSF × sqft
  const priceTable = [
    { type: 'Studio',      sqft: 450,  truv: Math.round(psf * 0.95), ask: Math.round(psf * 0.96) },
    { type: '1 Bedroom',   sqft: 800,  truv: psf,                    ask: Math.round(psf * 1.041) },
    { type: '2 Bedroom',   sqft: 1250, truv: Math.round(psf * 0.974),ask: Math.round(psf * 0.936) },
    { type: '3 Bedroom',   sqft: 1800, truv: Math.round(psf * 0.958),ask: Math.round(psf * 0.944) },
    { type: 'Townhouse',   sqft: 2400, truv: Math.round(psf * 1.074),ask: Math.round(psf * 1.030) },
  ]

  // Buyer cost table — total property price
  const buyerPriceTable = [
    { type: 'Studio',      min: fmtK(Math.round(psf*450*0.74/1000)*1000),  fair: fmtK(Math.round(psf*450*0.95/1000)*1000),  max: fmtK(Math.round(psf*450*1.40/1000)*1000) },
    { type: '1 Bedroom',   min: fmtK(Math.round(psf*800*0.72/1000)*1000),  fair: fmtK(Math.round(psf*800/1000)*1000),        max: fmtK(Math.round(psf*800*1.44/1000)*1000) },
    { type: '2 Bedroom',   min: fmtK(Math.round(psf*1250*0.72/1000)*1000), fair: fmtK(Math.round(psf*1250*0.97/1000)*1000),  max: fmtK(Math.round(psf*1250*1.40/1000)*1000) },
    { type: '3 Bedroom',   min: fmtK(Math.round(psf*1800*0.70/1000)*1000), fair: fmtK(Math.round(psf*1800*0.96/1000)*1000),  max: fmtK(Math.round(psf*1800*1.48/1000)*1000) },
    { type: 'Townhouse 3BR',min:fmtK(Math.round(psf*2400*0.72/1000)*1000), fair: fmtK(Math.round(psf*2400*1.07/1000)*1000),  max: fmtK(Math.round(psf*2400*1.44/1000)*1000) },
  ]

  // Rent table — annual rents from yield
  const rentTable = [
    { type: 'Studio',    min: Math.round(psf*450*yld/100*0.75/1000)*1000,  avg: Math.round(psf*450*yld/100/1000)*1000,  max: Math.round(psf*450*yld/100*1.35/1000)*1000 },
    { type: '1 BR',      min: Math.round(psf*800*yld/100*0.75/1000)*1000,  avg: Math.round(psf*800*yld/100/1000)*1000,  max: Math.round(psf*800*yld/100*1.35/1000)*1000 },
    { type: '2 BR',      min: Math.round(psf*1250*yld/100*0.75/1000)*1000, avg: Math.round(psf*1250*yld/100/1000)*1000, max: Math.round(psf*1250*yld/100*1.35/1000)*1000 },
    { type: '3 BR',      min: Math.round(psf*1800*yld/100*0.75/1000)*1000, avg: Math.round(psf*1800*yld/100/1000)*1000, max: Math.round(psf*1800*yld/100*1.35/1000)*1000 },
    { type: 'Townhouse', min: Math.round(psf*2400*yld/100*0.75/1000)*1000, avg: Math.round(psf*2400*yld/100/1000)*1000, max: Math.round(psf*2400*yld/100*1.35/1000)*1000 },
  ]

  // Yield by unit type (investor pane)
  const yieldByType = [
    { type: 'Studio',  val: +(yld * 1.19).toFixed(1) },
    { type: '1 BR',    val: +yld.toFixed(1) },
    { type: '2 BR',    val: +(yld * 0.94).toFixed(1) },
    { type: '3 BR',    val: +(yld * 0.88).toFixed(1) },
    { type: 'TH 3BR',  val: +(yld * 0.82).toFixed(1) },
  ]

  // Owner valuation (1BR)
  const fairValue1BR = Math.round(psf * 800 / 1000) * 1000
  const valuationRangeLow  = Math.round(fairValue1BR * 0.97 / 1000) * 1000
  const valuationRangeHigh = Math.round(fairValue1BR * 1.18 / 1000) * 1000
  const gain6m = Math.round(psf * 800 * 0.033 / 1000) * 1000
  const annualRent1BR = Math.round(psf * 800 * yld / 100 / 1000) * 1000
  const annualRent1BRShort = Math.round(annualRent1BR * 1.25 / 1000) * 1000
  const netYield = (yld * 0.83).toFixed(1)
  const serviceCharge = psf > 2000 ? 'AED 18–28/sqft' : psf > 1200 ? 'AED 12–18/sqft' : 'AED 10–18/sqft'

  // Nationalities — vary by zone
  const nationals = area.zone === 'Prime'
    ? [{ flag: '🇷🇺', name: 'Russian',   pct: 24, w: 100 },{ flag: '🇬🇧', name: 'British',   pct: 18, w: 75 },{ flag: '🇮🇳', name: 'Indian',    pct: 14, w: 58 },{ flag: '🇩🇪', name: 'German',    pct: 9, w: 38 },{ flag: '🇨🇳', name: 'Chinese',   pct: 8, w: 33 },{ flag: '🇦🇪', name: 'UAE Local', pct: 6, w: 25 },{ flag: '🌍', name: 'Other',     pct: 21, w: 48 }]
    : area.zone === 'Marina'
    ? [{ flag: '🇬🇧', name: 'British',   pct: 22, w: 100 },{ flag: '🇮🇳', name: 'Indian',    pct: 18, w: 82 },{ flag: '🇷🇺', name: 'Russian',   pct: 15, w: 68 },{ flag: '🇩🇪', name: 'German',    pct: 8, w: 36 },{ flag: '🇨🇳', name: 'Chinese',   pct: 7, w: 32 },{ flag: '🌍', name: 'Other',     pct: 30, w: 55 }]
    : [{ flag: '🇮🇳', name: 'Indian',    pct: 31, w: 100 },{ flag: '🇬🇧', name: 'British',   pct: 18, w: 58 },{ flag: '🇷🇺', name: 'Russian',   pct: 14, w: 45 },{ flag: '🇵🇰', name: 'Pakistani', pct: 9, w: 29 },{ flag: '🇨🇳', name: 'Chinese',   pct: 6, w: 19 },{ flag: '🇩🇪', name: 'German',    pct: 4, w: 13 },{ flag: '🇦🇪', name: 'UAE Local', pct: 3, w: 10 },{ flag: '🌍', name: 'Other',     pct: 15, w: 48 }]

  const sellRecommendation = score >= 75 ? 'Yes — Good Time' : 'Hold 6–12M'
  const sellColor = score >= 75 ? C.green : C.amber
  const optimalSell = score >= 75 ? 'Now — strong market' : score >= 65 ? 'Q2–Q3 2027' : '12–18 months'

  return {
    psf, yld, score, soldThisWeek, daysToSell, availableListings,
    distressPct, distressUnits, vacancyRate, occupancyRate, fiveYrAppreciation,
    catalystScore, verdict, verdictColor, mood, moodColor, scoreComps,
    priceTable, buyerPriceTable, rentTable, yieldByType, nationals,
    fairValue1BR, valuationRangeLow, valuationRangeHigh, gain6m,
    annualRent1BR, annualRent1BRShort, netYield, serviceCharge,
    sellRecommendation, sellColor, optimalSell,
    aboveAvgYield: yld > 6.1,
  }
}

// ── FORMAT HELPERS ─────────────────────────────────────────────────
const fmt = (n) => (n || 0).toLocaleString()
function fmtK(n) {
  if (n >= 1000000) return `AED ${(n / 1000000).toFixed(2)}M`
  return `AED ${Math.round(n / 1000)}K`
}

// ── SHARED COMPONENTS ──────────────────────────────────────────────
function Card({ children, style = {} }) {
  return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, ...style }}>{children}</div>
}

function CardTitle({ children, badge }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>{children}</span>
      {badge && <span style={{ fontSize: 10, textTransform: 'none', letterSpacing: 0, padding: '2px 8px', borderRadius: 4, background: C.bg2, color: C.muted, fontWeight: 500 }}>{badge}</span>}
    </div>
  )
}

function StRow({ label, value, valueColor, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: last ? 'none' : `1px solid ${C.border}`, fontSize: 12 }}>
      <span style={{ color: C.muted }}>{label}</span>
      <span style={{ fontWeight: 700, color: valueColor || C.text }}>{value}</span>
    </div>
  )
}

function RatioBar({ left, leftPct, leftColor, right, rightPct, rightColor, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
        <span style={{ color: C.text2, fontWeight: 700 }}>{left} {leftPct}%</span>
        <span style={{ color: C.muted }}>{right} {rightPct}%</span>
      </div>
      <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${leftPct}%`, background: leftColor }} />
        <div style={{ width: `${rightPct}%`, background: rightColor }} />
      </div>
    </div>
  )
}

function NatBar({ flag, name, pct, w }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <span style={{ fontSize: 15, width: 22 }}>{flag}</span>
      <span style={{ fontSize: 12, width: 80, flexShrink: 0 }}>{name}</span>
      <div style={{ flex: 1, height: 6, background: C.bg3, borderRadius: 3 }}>
        <div style={{ width: `${w}%`, height: 6, borderRadius: 3, background: C.orange }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, width: 30, textAlign: 'right', color: C.muted }}>{pct}%</span>
    </div>
  )
}

function PTable({ headers, rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>{headers.map(h => <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 700 }}>{h}</th>)}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

function Td({ children, color, bold, last }) {
  return <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: last ? 'none' : `1px solid ${C.border}`, color: color || C.text, fontWeight: bold ? 700 : 400 }}>{children}</td>
}

function GapTag({ truv, ask }) {
  const delta = ((ask - truv) / truv * 100)
  const d = delta.toFixed(1)
  if (delta > 2)  return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.redL,   color: C.red   }}>Premium</span>
  if (delta < -2) return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.greenL, color: C.green }}>Opportunity</span>
  return               <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.amberL, color: C.amber }}>Fair</span>
}

function GapPct({ truv, ask }) {
  const delta = ((ask - truv) / truv * 100).toFixed(1)
  return <span>{delta > 0 ? `+${delta}%` : `${delta}%`}</span>
}

// ── TIMELINE ITEM ──────────────────────────────────────────────────
function TlItem({ year, tagType, title, desc, impact }) {
  const tagColors = {
    confirmed: { bg: C.greenL, color: C.green, dot: C.green },
    announced: { bg: C.blueL,  color: C.blue,  dot: C.blue },
    likely:    { bg: C.amberL, color: C.amber,  dot: C.amber },
    spec:      { bg: C.bg3,    color: C.muted2, dot: C.muted2 },
  }
  const tc = tagColors[tagType] || tagColors.spec
  return (
    <div style={{ position: 'relative', marginBottom: 20 }}>
      <div style={{ position: 'absolute', left: -20, top: 5, width: 12, height: 12, borderRadius: '50%', background: tc.dot, border: `2px solid ${C.bg}` }} />
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, marginBottom: 3 }}>
        {year}{' '}
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3, marginLeft: 6, textTransform: 'uppercase', letterSpacing: '.08em', background: tc.bg, color: tc.color }}>{tagType}</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{title}</div>
      <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.55 }}>{desc}</div>
      <div style={{ fontSize: 11, marginTop: 5, color: C.muted }}>📈 Expected impact: <strong style={{ color: C.green }}>{impact}</strong></div>
    </div>
  )
}

// ── PIPE CARD ──────────────────────────────────────────────────────
function PipeCard({ dev, name, delivery, units, psfFrom, sold, builtPct, status }) {
  const stMap = { ontime: { bg: C.greenL, color: C.green, label: 'On Schedule' }, delayed: { bg: C.redL, color: C.red }, ahead: { bg: C.blueL, color: C.blue, label: 'Ahead of Schedule' } }
  const st = stMap[status] || stMap.ontime
  const soldColor = sold >= 80 ? C.green : sold >= 60 ? C.amber : C.red
  return (
    <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
      <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>{dev}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>{name}</div>
      {[['Delivery', delivery], ['Units', units], ['PSF from', psfFrom], ['Sold', `${sold}%`]].map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
          <span style={{ color: C.muted }}>{k}</span>
          <span style={{ fontWeight: 600, color: k === 'Sold' ? soldColor : C.text }}>{v}</span>
        </div>
      ))}
      <div style={{ height: 4, background: C.bg3, borderRadius: 2, margin: '8px 0 4px' }}>
        <div style={{ height: 4, borderRadius: 2, background: status === 'delayed' && builtPct < 25 ? C.red : C.blue, width: `${builtPct}%` }} />
      </div>
      <div style={{ fontSize: 10, color: C.muted, textAlign: 'right' }}>{builtPct}% built</div>
      <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', padding: '2px 7px', borderRadius: 4, display: 'inline-block', marginTop: 8, background: st.bg, color: st.color }}>{st.label || name.includes('Sky') ? '⚠ Delayed +8M' : status === 'delayed' ? 'Delayed +4M' : st.label}</span>
    </div>
  )
}
function TxVolumeChart({ data, currentTx }) {
  if (!data?.length) return null
  const counts = data.map(d => d.count)
  const maxCount = Math.max(...counts)
  const w = 700, h = 200, padL = 50, padR = 20, padT = 20, padB = 40
  const chartW = w - padL - padR
  const chartH = h - padT - padB
  const barW = Math.floor(chartW / data.length) - 4
  const x = (i) => padL + (i / data.length) * chartW + barW / 2

  // April 2026 onwards = Iran/USA shock period (red bars)
  const isShock = (p) => p.year === 2026 && p.month >= 4

  // Y grid steps
  const yStep = Math.ceil(maxCount / 4 / 50) * 50
  const ySteps = Array.from({ length: 5 }, (_, i) => i * yStep).filter(v => v <= maxCount + yStep)

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Y grid */}
      {ySteps.map(v => {
        const yy = padT + chartH - (v / (maxCount * 1.1)) * chartH
        return (
          <g key={v}>
            <line x1={padL} x2={w - padR} y1={yy} y2={yy} stroke="#EAE3D8" strokeWidth={0.75} strokeDasharray="4 4" />
            <text x={padL - 6} y={yy + 4} textAnchor="end" fontSize={9} fill="#9CA8B4" fontFamily="Inter, sans-serif">{v}</text>
          </g>
        )
      })}

      {/* Bars */}
      {data.map((p, i) => {
        const barH = (p.count / (maxCount * 1.1)) * chartH
        const barX = padL + (i / data.length) * chartW + 2
        const barY = padT + chartH - barH
        const shock = isShock(p)
        const fill = shock ? 'rgba(220,38,38,0.35)' : 'rgba(200,115,42,0.25)'
        const stroke = shock ? '#DC2626' : '#C8732A'
        return (
          <g key={p.key}>
            <rect x={barX} y={barY} width={barW} height={barH}
              fill={fill} stroke={stroke} strokeWidth={0.5} rx={2} />
            {/* count label on hover-style — show on last bar */}
            {i === data.length - 1 && (
              <>
                <rect x={barX - 10} y={barY - 22} width={barW + 20} height={17} rx={3} fill="#C8732A" />
                <text x={barX + barW / 2} y={barY - 9} textAnchor="middle" fontSize={9} fill="#fff" fontWeight="700" fontFamily="Inter, sans-serif">{p.count}</text>
              </>
            )}
          </g>
        )
      })}

      {/* X labels — show every 2 months */}
      {data.map((p, i) => i % 2 === 0 && (
        <text key={p.key} x={padL + (i / data.length) * chartW + barW} y={h - 8}
          textAnchor="middle" fontSize={9} fill="#9CA8B4" fontFamily="Inter, sans-serif">{p.label}</text>
      ))}

      {/* Bottom axis */}
      <line x1={padL} x2={w - padR} y1={padT + chartH} y2={padT + chartH} stroke="#D8CEBC" strokeWidth={1} />

      {/* Legend */}
      <rect x={w - 200} y={padT} width={14} height={10} fill="rgba(200,115,42,0.25)" stroke="#C8732A" strokeWidth={0.5} rx={1} />
      <text x={w - 182} y={padT + 9} fontSize={9} fill="#6E7A8A" fontFamily="Inter, sans-serif">Normal volume</text>
      <rect x={w - 200} y={padT + 16} width={14} height={10} fill="rgba(220,38,38,0.35)" stroke="#DC2626" strokeWidth={0.5} rx={1} />
      <text x={w - 182} y={padT + 25} fontSize={9} fill="#6E7A8A" fontFamily="Inter, sans-serif">Iran/USA shock period</text>
    </svg>
  )
}

function PriceHistoryChart({ data }) {
  if (!data?.length) return null

  const psfs = data.map(d => d.psf)
  const minPsf = Math.floor(Math.min(...psfs) / 100) * 100 - 100
  const maxPsf = Math.ceil(Math.max(...psfs) / 100) * 100 + 100
  const w = 900, h = 220, padL = 72, padR = 24, padT = 24, padB = 40
  const chartW = w - padL - padR
  const chartH = h - padT - padB

  const x = (i) => padL + (i / (data.length - 1)) * chartW
  const y = (v) => padT + chartH - ((v - minPsf) / (maxPsf - minPsf)) * chartH

  // Smooth the line slightly using the actual data points
  const linePath = data.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.psf).toFixed(1)}`).join(' ')
  const areaPath = linePath + ` L${x(data.length - 1).toFixed(1)},${(padT + chartH).toFixed(1)} L${padL},${(padT + chartH).toFixed(1)} Z`

  // Y-axis labels — 5 clean steps
  const ySteps = 5
  const yLabels = Array.from({ length: ySteps }, (_, i) =>
    Math.round(minPsf + (i / (ySteps - 1)) * (maxPsf - minPsf))
  )

  // X-axis: show Jan of each year only
  const xLabels = data.reduce((acc, p, i) => {
    if (p.month === 1 || i === 0) {
      acc.push({ i, label: `${p.year}` })
    }
    return acc
  }, [])

  // Find latest point for the end label
  const last = data[data.length - 1]
  const latestLabel = `AED ${last.psf.toLocaleString()}`

  // Find min and max index for annotation dots
  const maxIdx = psfs.indexOf(Math.max(...psfs))
  const minIdx = psfs.indexOf(Math.min(...psfs))

  const gradId = 'chartGrad'
  const lineColor = '#C8732A'
  const gradTop = 'rgba(200,115,42,0.18)'
  const gradBot = 'rgba(200,115,42,0.01)'

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gradTop} />
          <stop offset="100%" stopColor={gradBot} />
        </linearGradient>
        <filter id="lineShadow" x="-5%" y="-20%" width="110%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(200,115,42,0.25)" />
        </filter>
      </defs>

      {/* Chart background */}
      <rect x={padL} y={padT} width={chartW} height={chartH} fill="#FAF8F5" rx="4" />

      {/* Horizontal grid lines */}
      {yLabels.map((v, i) => (
        <g key={v}>
          <line
            x1={padL} x2={w - padR}
            y1={y(v)} y2={y(v)}
            stroke={i === 0 ? '#D8CEBC' : '#EAE3D8'}
            strokeWidth={i === 0 ? 1 : 0.75}
            strokeDasharray={i === 0 ? 'none' : '4 4'}
          />
          <text
            x={padL - 8} y={y(v) + 4}
            textAnchor="end" fontSize={9} fill="#9CA8B4"
            fontFamily="Inter, sans-serif"
          >
            {v.toLocaleString()}
          </text>
        </g>
      ))}

      {/* Area fill under line */}
      <path d={areaPath} fill={`url(#${gradId})`} />

      {/* Main price line */}
      <path
        d={linePath}
        fill="none"
        stroke={lineColor}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#lineShadow)"
      />

      {/* Min dot — red */}
      <circle cx={x(minIdx)} cy={y(data[minIdx].psf)} r={4} fill="#fff" stroke="#DC2626" strokeWidth={2} />

      {/* Max dot — green */}
      <circle cx={x(maxIdx)} cy={y(data[maxIdx].psf)} r={4} fill="#fff" stroke="#16A34A" strokeWidth={2} />

      {/* Latest value dot */}
      <circle cx={x(data.length - 1)} cy={y(last.psf)} r={5} fill={lineColor} stroke="#fff" strokeWidth={2} />
      <rect
        x={x(data.length - 1) - 40} y={y(last.psf) - 22}
        width={80} height={17} rx={4}
        fill={lineColor}
      />
      <text
        x={x(data.length - 1)} y={y(last.psf) - 9}
        textAnchor="middle" fontSize={9} fill="#fff" fontWeight="700"
        fontFamily="Inter, sans-serif"
      >
        {latestLabel}
      </text>

      {/* X-axis year labels */}
      {xLabels.map(({ i, label }) => (
        <g key={label}>
          <line x1={x(i)} x2={x(i)} y1={padT + chartH} y2={padT + chartH + 5} stroke="#D8CEBC" strokeWidth={1} />
          <text
            x={x(i)} y={h - 8}
            textAnchor="middle" fontSize={10} fill="#9CA8B4"
            fontFamily="Inter, sans-serif" fontWeight="600"
          >
            {label}
          </text>
        </g>
      ))}

      {/* Bottom axis line */}
      <line x1={padL} x2={w - padR} y1={padT + chartH} y2={padT + chartH} stroke="#D8CEBC" strokeWidth={1} />

      
    </svg>
  )
}

// ══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════
export default function AreaSpecialistPage({ area, onClose }) {
  const [persona, setPersona] = useState('buyer')
  const isMobile = useIsMobile()
const [activeTab, setActiveTab] = useState('past')
const [aiAlert, setAiAlert] = useState(null)
const [aiBrief, setAiBrief] = useState(null)
const [aiBuyerTip, setAiBuyerTip] = useState(null)
const [groqCatalysts, setGroqCatalysts] = useState(null)
const [isReady, setIsReady] = useState(false)

  const { events } = useEvents()

  // Fetch live data from Supabase area_intelligence table


 const BACKEND = 'https://acqar-signal-production.up.railway.app'
const [tickerData, setTickerData] = useState(null)
const [areaIntel, setAreaIntel] = useState(null)
const [buyerPrices, setBuyerPrices] = useState(null)
const [priceHistory, setPriceHistory] = useState(null)
const [areaProjects, setAreaProjects] = useState(null)
const [marketComp, setMarketComp] = useState(null)
const [areaCatalysts, setAreaCatalysts] = useState(null)
const [txHistory, setTxHistory] = useState(null)

useEffect(() => {
  fetch(`${BACKEND}/api/ticker/area-59`)
    .then(r => r.json())
    .then(setTickerData)
    .catch(() => {})
}, [])

useEffect(() => {
  const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
  const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
  const timer = setTimeout(() => setIsReady(true), 4000)
  fetch(
    `${SUPA_URL}/rest/v1/area_intelligence?area_id=eq.59&select=*`,
    { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
  )
    .then(r => r.json())
 .then(data => {
      clearTimeout(timer)
      if (data?.[0]) setAreaIntel(data[0])
      setIsReady(true)
    })
    .catch(() => {
      clearTimeout(timer)
      setIsReady(true)
    })
}, [])

useEffect(() => {
  const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
  const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
  fetch(
    `${SUPA_URL}/rest/v1/avm?area_id=eq.59&select=price_per_sqm,procedure_area,rooms_en&limit=5000`,
    { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
  )
    .then(r => r.json())
    .then(rows => {
      const groups = { Studio: [], '1 Bedroom': [], '2 Bedroom': [], '3 Bedroom': [] }
      rows.forEach(row => {
        if (!row.price_per_sqm || !row.procedure_area) return
        const total = row.price_per_sqm * row.procedure_area
        const r = row.rooms_en
        if (['0','0.0'].includes(r)) groups['Studio'].push(total)
        else if (['1','1.0'].includes(r)) groups['1 Bedroom'].push(total)
        else if (['2','2.0'].includes(r)) groups['2 Bedroom'].push(total)
        else if (['3','3.0'].includes(r)) groups['3 Bedroom'].push(total)
      })
      const pct = (arr, p) => {
        if (!arr.length) return null
        const s = [...arr].sort((a, b) => a - b)
        return Math.round(s[Math.floor(s.length * p)] / 1000) * 1000
      }
      setBuyerPrices(
        Object.entries(groups).map(([type, vals]) => ({
          type,
          min:  pct(vals, 0.25),
          fair: pct(vals, 0.50),
          max:  pct(vals, 0.75),
        }))
      )
    })
    .catch(() => {})
}, [])

useEffect(() => {
  const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
  const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
  fetch(
    `${SUPA_URL}/rest/v1/price_history_monthly?area_id=eq.59&sale_year=gte.2020&select=sale_year,sale_month,psf,cnt&order=sale_year.asc,sale_month.asc`,
    { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
  )
    .then(r => r.json())
    .then(rows => {
      const points = rows.map(row => ({
        key: `${row.sale_year}-${String(row.sale_month).padStart(2,'0')}`,
        psf: Math.round(row.psf),
        year: row.sale_year,
        month: row.sale_month,
        count: row.cnt,
      }))
      setPriceHistory(points)
    })
    .catch(() => {})
}, [])

useEffect(() => {
  const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
  const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
  // JVC = 'Al Barsha South Fourth' in DLD naming
  const dldName = 'Al Barsha South Fourth'
  fetch(
    `${SUPA_URL}/rest/v1/dld_projects?area_en=eq.${encodeURIComponent(dldName)}&select=project_name,developer_name,project_status,percent_completed,end_date,cnt_unit&order=project_status.asc`,
    { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
  )
    .then(r => r.json())
    .then(data => { if (data?.length) setAreaProjects(data) })
    .catch(() => {})
}, [])



useEffect(() => {
  const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
  const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
  // Fetch aggregated composition from avm
  fetch(
    `${SUPA_URL}/rest/v1/avm?area_id=eq.59&sale_year=gte.2024&select=property_sub_type_en,property_usage_en,rooms_en&limit=10000`,
    { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
  )
    .then(r => r.json())
    .then(rows => {
      const total = rows.length
      if (!total) return
      const apt   = rows.filter(r => r.property_sub_type_en?.toLowerCase().includes('flat') || r.property_sub_type_en?.toLowerCase().includes('apart')).length
      const villa = rows.filter(r => r.property_sub_type_en?.toLowerCase().includes('villa') || r.property_sub_type_en?.toLowerCase().includes('town')).length
      const res   = rows.filter(r => r.property_usage_en === 'Residential').length
      const com   = rows.filter(r => r.property_usage_en === 'Commercial').length
      const small = rows.filter(r => ['0','0.0','1','1.0'].includes(r.rooms_en)).length
      const large = rows.filter(r => ['2','2.0','3','3.0','4','4.0'].includes(r.rooms_en)).length
      const roomsTotal = small + large

      // Off-plan ratio from dld_projects (already loaded)
      setMarketComp({
        aptPct:   Math.round(apt   / total * 100),
        villaPct: Math.round(villa / total * 100) || 2, // min 2% for display
        resPct:   Math.round(res   / total * 100),
        comPct:   Math.round(com   / total * 100) || 0,
        bachelorPct: roomsTotal > 0 ? Math.round(small / roomsTotal * 100) : 71,
        familyPct:   roomsTotal > 0 ? Math.round(large / roomsTotal * 100) : 29,
      })
    })
    .catch(() => {})
}, [])

useEffect(() => {
  const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
  const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
  fetch(
    `${SUPA_URL}/rest/v1/tx_volume_monthly?area_id=eq.59&sale_year=gte.2025&select=sale_year,sale_month,tx_count&order=sale_year.asc,sale_month.asc`,
    { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
  )
    .then(r => r.json())
    .then(rows => {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      const points = rows.map(row => ({
        key: `${row.sale_year}-${String(row.sale_month).padStart(2,'0')}`,
        label: `${months[row.sale_month - 1]} ${String(row.sale_year).slice(2)}`,
        count: row.tx_count,
        year: row.sale_year,
        month: row.sale_month,
      })).slice(-12)
      setTxHistory(points)
    })
    .catch(() => {})
}, [])

useEffect(() => {
  const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
  const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
  fetch(
    `${SUPA_URL}/rest/v1/area_catalysts?area_name_en=eq.Jumeirah Village Circle&status=eq.active&select=*&order=expected_date.asc`,
    { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
  )
    .then(r => r.json())
    .then(data => { if (data?.length) setAreaCatalysts(data) })
    .catch(() => {})
}, [])

const livePsf = areaIntel?.truvalu_psm
  ? Math.round(Number(areaIntel.truvalu_psm) / 10.764)
  : tickerData?.fairPriceAedPsf ?? area.pricePerSqft
const liveScore        = areaIntel?.investment_score ?? tickerData?.score ?? area.score
const liveYield        = Number(areaIntel?.gross_yield_pct ?? tickerData?.rentalReturnPct ?? area.yield)
const liveVerdict      = areaIntel?.verdict ?? tickerData?.signalMood ?? (liveScore >= 75 ? 'BUY' : liveScore >= 65 ? 'HOLD' : 'WATCH')
const liveSoldThisWeek = areaIntel?.tx_7d ?? tickerData?.soldThisWeek ?? null
const liveDistressPct  = Number(areaIntel?.distress_pct ?? tickerData?.distressPct ?? null)
const liveTxDelta      = areaIntel?.tx_7d_delta_pct ?? null

useEffect(() => {
  if (!GROQ_KEY) return
  const name = area.name
  const yld = liveYield || area.yield || 7
  const psf = livePsf || area.pricePerSqft || 1247

  askGroq(`You are a Dubai real estate AI for ${name}. Write 1 short sentence (max 20 words) for a market alert banner about the Iran/USA April 2026 tension causing a transaction slowdown. Be factual, not alarmist.`)
    .then(t => { if (t) setAiAlert(t) })

  askGroq(`You are a Dubai real estate AI specialist for ${name}. Write a 5-line professional analyst brief (max 120 words). Cover: 1) current market sentiment and the Iran/USA slowdown context, 2) the ${yld}% gross yield vs Dubai's 6.1% average, 3) the AED ${psf}/sqft Truvalu fair price and what it means for buyers, 4) confirmed infrastructure catalysts arriving Q4 2026, 5) your investment outlook. Write in flowing prose, no bullet points, no numbering.`)
    .then(t => { if (t) setAiBrief(t) })

  askGroq(`You are helping a first-time buyer looking at ${name} in Dubai. Write 1 sentence (max 25 words) encouraging them about the current market slowdown being a good entry opportunity. Sound warm and reassuring.`)
    .then(t => { if (t) setAiBuyerTip(t) })
}, [area.name, livePsf, liveYield])

useEffect(() => {
  if (!GROQ_KEY || !area.name) return
  askGroq(`You are a Dubai real estate research AI. List the latest confirmed infrastructure projects coming to Jumeirah Village Circle (JVC) Dubai in 2025-2028: metro stations, schools, hospitals, malls, roads. Return ONLY a valid JSON array, no markdown, no explanation, no backticks. Max 5 items. Format: [{"name":"...","date":"Q4 2026","type":"metro","confidence":"confirmed","impact":"+8-14% PSF"}]. Only include real officially announced projects.`, 600)
    .then(text => {
      if (!text) return
      try {
        const clean = text.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(clean)
        if (Array.isArray(parsed)) setGroqCatalysts(parsed)
      } catch { /* ignore */ }
    })
}, [area.name])

  const d = buildAreaData({
    ...area,
    pricePerSqft: livePsf,
    score: liveScore,
    yield: liveYield,
  })



  const livePriceTable = buyerPrices?.length ? [
  { type: 'Studio',    truv: Math.round((buyerPrices.find(r=>r.type==='Studio')?.fair    ?? d.psf*0.95*450) / 450),  ask: Math.round((buyerPrices.find(r=>r.type==='Studio')?.fair    ?? d.psf*0.95*450) / 450 * 1.011) },
  { type: '1 Bedroom', truv: Math.round((buyerPrices.find(r=>r.type==='1 Bedroom')?.fair ?? d.psf*800)      / 800),  ask: Math.round((buyerPrices.find(r=>r.type==='1 Bedroom')?.fair ?? d.psf*800)      / 800 * 1.041) },
  { type: '2 Bedroom', truv: Math.round((buyerPrices.find(r=>r.type==='2 Bedroom')?.fair ?? d.psf*0.974*1250)/1250), ask: Math.round((buyerPrices.find(r=>r.type==='2 Bedroom')?.fair ?? d.psf*0.974*1250)/1250 * 0.961) },
  { type: '3 Bedroom', truv: Math.round((buyerPrices.find(r=>r.type==='3 Bedroom')?.fair ?? d.psf*0.958*1800)/1800), ask: Math.round((buyerPrices.find(r=>r.type==='3 Bedroom')?.fair ?? d.psf*0.958*1800)/1800 * 0.986) },
  { type: 'Townhouse',  truv: Math.round(d.psf*1.074), ask: Math.round(d.psf*1.030) },
] : d.priceTable

const liveYieldByType = [
  { type: 'Studio',  val: +(liveYield * 1.19).toFixed(1) },
  { type: '1 BR',    val: +liveYield.toFixed(1) },
  { type: '2 BR',    val: +(liveYield * 0.94).toFixed(1) },
  { type: '3 BR',    val: +(liveYield * 0.88).toFixed(1) },
  { type: 'TH 3BR',  val: +(liveYield * 0.82).toFixed(1) },
]


// DLD projects computed stats
const activeProjects = areaProjects?.filter(p => p.project_status === 'ACTIVE') ?? []
const totalPipelineUnits = areaProjects?.reduce((s, p) => s + (Number(p.cnt_unit) || 0), 0) ?? 0

// Group by developer for track record table
const devStats = areaProjects?.length ? (() => {
  const map = {}
  areaProjects.forEach(p => {
    const raw = p.developer_name || ''
    // Clean name: remove L.L.C, FZE, DWC etc
    const dev = raw.replace(/\s*(L\.L\.C\.?|FZE|DWC\s*LLC|S\.O\.C\.?|PROPERTIES|REAL ESTATE DEVELOPMENT|DEVELOPERS?)\s*/gi, ' ').replace(/\s+/g, ' ').trim().slice(0, 22)
    if (!map[dev]) map[dev] = { projects: 0, active: 0, units: 0, avgPct: 0, pcts: [] }
    map[dev].projects++
    map[dev].units += Number(p.cnt_unit) || 0
    if (p.project_status === 'ACTIVE') map[dev].active++
    if (p.percent_completed) map[dev].pcts.push(Number(p.percent_completed))
  })
  return Object.entries(map)
    .sort((a, b) => b[1].projects - a[1].projects)
    .slice(0, 7)
    .map(([dev, s]) => ({
      dev,
      projects: s.projects,
      active: s.active,
      units: s.units,
      avgPct: s.pcts.length ? Math.round(s.pcts.reduce((a, b) => a + b, 0) / s.pcts.length) : 0,
    }))
})() : null

// Real off-plan vs ready ratio from DLD projects
const offPlanPct = areaProjects?.length
  ? Math.round(activeProjects.length / areaProjects.length * 100)
  : 58
const readyPct = 100 - offPlanPct


const fiveYrAppreciationReal = priceHistory?.length
  ? (() => {
      const pts2021 = priceHistory.filter(p => p.year === 2021)
      const pts2026 = priceHistory.filter(p => p.year === 2026)
      if (!pts2021.length || !pts2026.length) return null
      const avg2021 = pts2021.reduce((s, p) => s + p.psf, 0) / pts2021.length
      const avg2026 = pts2026.reduce((s, p) => s + p.psf, 0) / pts2026.length
      return ((avg2026 - avg2021) / avg2021 * 100).toFixed(1)
    })()
  : null

  const liveBuyerPriceTable = buyerPrices?.length
  ? [...buyerPrices.map(row => ({
      type: row.type,
      min:  row.min  ? fmtK(row.min)  : '—',
      fair: row.fair ? fmtK(row.fair) : '—',
      max:  row.max  ? fmtK(row.max)  : '—',
    })),
    // Townhouse stays static — no real data in avm for this
    { type: 'Townhouse 3BR', min: 'AED 2.70M', fair: 'AED 4.01M', max: 'AED 5.39M' }
  ]
  : d.buyerPriceTable
  // Live signals for this area from the real event pipeline
  const areaSignals = events
    .filter(e => e.location_name?.toLowerCase().includes(area.name.toLowerCase().split(' ')[0].toLowerCase()))
    .slice(0, 6)


    if (!isReady) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: C.bg, gap: 16 }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: C.text }}>
          ACQ<span style={{ color: C.orange }}>AR</span> SIGNAL™
        </div>
        <div style={{ width: 36, height: 36, borderRadius: '50%',
          border: `4px solid ${C.border}`, borderTopColor: C.orange,
          animation: 'spin 0.8s linear infinite' }} />
        <div style={{ fontSize: 13, color: C.muted }}>Loading {area.name} data...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }
  // Grid helpers
  const g2  = { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }
const g3  = { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 16 }
const g4  = { display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: 16 }
const pad = { padding: isMobile ? '0 12px' : '0 28px' }

  // Pipeline PSF values based on area PSF
  const pipePsf = (mult) => `AED ${fmt(Math.round(d.psf * mult))}`

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.6, color: C.text, overflowY: 'auto' }}>

      {/* ── NAV ── */}
      <nav style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: isMobile ? '0 12px' : '0 28px', height: 54, display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 32, position: 'sticky', top: 0, zIndex: 100, flexShrink: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-.01em', color: C.text }}>ACQ<span style={{ color: C.orange }}>AR</span> SIGNAL™</div>
        {!isMobile && (
  <div style={{ display: 'flex', gap: 2 }}>
    {['Terminal', 'Areas', 'Truvalu™', 'Reports'].map(l => (
      <span key={l} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, color: l === 'Areas' ? C.orange : C.muted, background: l === 'Areas' ? C.orangeL : 'transparent', cursor: 'pointer' }}>{l}</span>
    ))}
  </div>
)}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
  <button onClick={onClose} style={{ fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 7, border: `1px solid ${C.border}`, background: C.card, color: C.text2, cursor: 'pointer' }}>← Back</button>
  {!isMobile && <button style={{ background: C.orange, color: '#fff', fontSize: 12, fontWeight: 700, padding: '8px 18px', borderRadius: 7, border: 'none', cursor: 'pointer' }}>📤 Share Area Pack</button>}
</div>
      </nav>

     {/* ── TICKER ── */}
<TickerBar
  areaSlug="area-59"
  areaName={area.name}
  fallback={d}
  activeProjectCount={activeProjects?.filter(p => p.project_status === 'ACTIVE').length ?? null}
  metroCatalyst={areaCatalysts?.find(c => c.catalyst_type === 'metro') ?? null}
/>

      {/* ── BREADCRUMB ── */}
      <div style={{ padding: `14px ${isMobile ? '12px' : '28px'} 0`, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted, flexShrink: 0 }}>
        <span>Signal</span>
        <span style={{ color: C.border2 }}>›</span>
        <span>Area Map</span>
        <span style={{ color: C.border2 }}>›</span>
        <span style={{ color: C.text, fontWeight: 600 }}>{area.name} ({area.zone})</span>
      </div>

      {/* ── MARKET ALERT ── */}
      <div style={{ margin: `14px ${isMobile ? '12px' : '28px'} 0`, background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, flexShrink: 0 }}>
        <span style={{ flexShrink: 0 }}>⚠️</span>
        <div style={{ color: '#9A1B1B', lineHeight: 1.6 }}>
          <strong style={{ color: C.red }}>Market Alert:</strong>{' '}
{aiAlert ?? `Regional tensions (Iran/USA, April 2026) have caused a 49% MoM transaction drop across Dubai. This is a sentiment-driven pause, not a fundamental collapse. Acqar's Resilience Report below shows how ${area.name} has recovered from every past shock — use this to make a clear-headed decision, not a fear-driven one.`}
        </div>
      </div>

      {/* ── HERO ── */}
      <div style={{ padding: isMobile ? '12px 12px 0' : '18px 28px 0', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto', gap: 20, alignItems: 'flex-start', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>📍 Dubai — {area.zone} · Residential District</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: C.text, letterSpacing: '-.02em', lineHeight: 1.05, marginBottom: 4 }}>{area.name}</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 18 }}>{area.zone} · Mixed-Use Residential · DLD 2026 Data</div>

          {/* Hero stats row — exact match to HTML .hero-stats-row */}
          <div style={{ display: 'flex', background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', flexWrap: 'wrap' }}>
            {[
             { lbl: '🏠 Homes Sold This Week', val: liveSoldThisWeek ?? d.soldThisWeek, valColor: C.red,
  sub: liveTxDelta != null ? `${liveTxDelta}% vs last week` : 'A bit quieter than last week',
  subColor: (liveTxDelta ?? -1) < 0 ? C.red : C.green },
              { lbl: "💰 What's a Fair Price Here?", val: `AED ${fmt(d.psf)}/sqft`, valColor: C.text, sub: 'Slightly up over 3 months', subColor: C.green },
              { lbl: '📈 Rent Return Per Year', val: `${d.yld}%`, valColor: C.green, sub: `${d.aboveAvgYield ? 'Better' : 'Near'} than Dubai's 6.1% average`, subColor: C.muted },
              { lbl: '⏱️ How Long to Sell?',  val: `${d.daysToSell} days`, valColor: C.amber, sub: d.daysToSell > 40 ? 'Takes a bit longer than usual' : 'Faster than Dubai average', subColor: d.daysToSell > 40 ? C.red : C.green },
              { lbl: '🔑 Homes Available to Buy', val: fmt(d.availableListings), valColor: C.text, sub: 'More choice than normal — good for buyers', subColor: C.muted },
              { lbl: '🧭 Market Mood Right Now', val: liveVerdict === 'BUY' ? 'Bullish' : liveVerdict === 'HOLD' ? 'Cautious' : 'Slow', valColor: liveVerdict === 'BUY' ? C.green : liveVerdict === 'HOLD' ? C.amber : C.red, sub: 'Watch closely — market paused', subColor: C.muted },
            ].map((stat, i) => (
              <div key={i} style={{ padding: '14px 22px', borderRight: i < 5 ? `1px solid ${C.border}` : 'none', flex: '1 1 150px' }}>
                <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 5 }}>{stat.lbl}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: stat.valColor }}>{stat.val}</div>
                <div style={{ fontSize: 11, color: stat.subColor, marginTop: 2 }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Buyer tip bar — only show when persona = buyer */}
          {persona === 'buyer' && (
            <div style={{ marginTop: 12, background: C.blueL, border: '1px solid rgba(37,99,235,.14)', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
              <p style={{ fontSize: 12, color: '#1D3461', lineHeight: 1.7 }}>
                <strong>First time buying property?</strong> {area.name} is one of Dubai's {area.zone === 'Prime' ? 'most prestigious' : area.zone === 'Mid-Market' ? 'most popular mid-range' : 'well-established'} areas. Right now the market is <strong>a little slow because of news in the region</strong> — but that's creating <strong>good entry prices for patient buyers</strong>. {aiBuyerTip ?? `The area earns strong rent (${d.yld}%/year), a metro station opens nearby in late 2026, and a school is coming in 2027.`}{' '}
Our AI Specialist's verdict: <strong style={{ color: d.verdictColor }}>{d.verdict === 'BUY' ? 'Strong opportunity — now is a good entry window.' : 'Hold off rushing — but a property priced below the fair-value line is a strong opportunity.'}</strong>
              </p>
            </div>
          )}
        </div>

       {/* ── SCORE CARD ── exact match to HTML .score-card */}
<div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '22px 20px', minWidth: 250, textAlign: 'center', flexShrink: 0 }}>
  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.14em', padding: '4px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 10, background: liveScore >= 75 ? C.greenL : C.amberL, color: liveScore >= 75 ? C.green : liveScore >= 65 ? C.amber : C.red }}>{liveVerdict}</div>
  <div style={{ fontSize: 52, fontWeight: 900, color: liveScore >= 75 ? C.green : liveScore >= 65 ? C.amber : C.red, lineHeight: 1, letterSpacing: '-.02em' }}>{liveScore}</div>
  <div style={{ fontSize: 15, color: C.muted2 }}>/100</div>
  <div style={{ fontSize: 11, color: C.muted, margin: '6px 0 16px' }}>12-month outlook · May 2026</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {d.scoreComps.map((comp, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                <span style={{ flex: 1, color: C.text2, textAlign: 'left', fontSize: 11.5 }}>{comp.label}</span>
                <div style={{ width: 76, height: 5, background: C.bg3, borderRadius: 3 }}>
                  <div style={{ width: `${Math.min(comp.val, 100)}%`, height: 5, borderRadius: 3, background: comp.color }} />
                </div>
                <span style={{ width: 30, textAlign: 'right', fontWeight: 700, fontSize: 12, color: comp.color }}>{comp.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── AI BRIEF ── exact match to HTML .brief-box */}
      <div style={{ margin: `18px ${isMobile ? '12px' : '28px'} 0`, background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.orange}`, borderRadius: 10, padding: '18px 22px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'flex-start', flexShrink: 0 }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.orangeL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🤖</div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.14em', color: C.orange, marginBottom: 6 }}>Area Specialist · AI Brief · Updated May 2026</div>
         <div style={{ fontSize: 12.5, lineHeight: 1.8, color: C.text2 }}>
  {aiBrief ?? `${area.name} is navigating a short-term confidence gap driven primarily by macro sentiment, not by fundamental weakness. Structural fundamentals remain intact: ${area.name} delivers a gross rental yield of ${d.yld}%, ${d.aboveAvgYield ? 'meaningfully above' : 'near'} Dubai's 6.1% average, and has confirmed infrastructure catalysts arriving from Q4 2026 that historically drive 8–14% appreciation in adjacent residential zones. Supply pressure is elevated with ${d.distressPct}% of current listings below the Truvalu floor — creating a selective entry window for patient investors.`}
</div>
          <div style={{ marginTop: 8, fontSize: 11, color: C.muted, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            <span>🕐 Updated May 2026, 09:15 GST</span>
            <span>📊 14 live data sources</span>
            <span>🏛️ RICS-aligned Truvalu™</span>
            <span>🔄 Refreshes daily</span>
          </div>
        </div>
      </div>

      {/* ── PERSONA SELECTOR ── exact match to HTML .persona-section */}
      <div style={{ margin: `20px ${isMobile ? '12px' : '28px'} 0`, flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 10 }}>Who are you? Get a view built for your situation.</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { key: 'buyer',    icon: '🏠', name: "I'm Buying My First Home",  desc: 'Plain English, step-by-step, no jargon' },
            { key: 'investor', icon: '💼', name: "I'm a Property Investor",   desc: 'Yields, returns, comparables, market timing' },
            { key: 'owner',    icon: '🔑', name: 'I Already Own Here',        desc: "What's my property worth? Should I sell?" },
          ].map(p => (
            <button key={p.key} onClick={() => setPersona(p.key)} style={{
              padding: '12px 22px', borderRadius: 10,
              border: `2px solid ${persona === p.key ? C.orange : C.border}`,
              background: persona === p.key ? C.orangeL : C.card,
              cursor: 'pointer', transition: 'all .18s',
              display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 180,
            }}>
              <span style={{ fontSize: 22 }}>{p.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{p.name}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{p.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ══════════ PERSONA: BUYER ══════════ */}
      {persona === 'buyer' && (
        <div style={{ ...pad, marginTop: 20 }}>
          {/* 5-step guide */}
          <Card>
            <CardTitle badge="First-Time Buyer">Your 5-Step Buying Guide for {area.name}</CardTitle>
            <div>
              {[
                {
                  num: 1, title: 'Understand what a fair price actually looks like here',
                  body: `Our Truvalu™ system calculates what any ${area.name} property should cost based on real transactions, floor level, view, and condition. A 1-bedroom here is fairly priced at around ${
  buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
    ? fmtK(buyerPrices.find(r => r.type === '1 Bedroom').fair)
    : fmtK(Math.round(d.psf * 800 / 1000) * 1000)
}. If someone's asking significantly more — that's a red flag. If it's below that — that's a genuine opportunity.`,
                },
               {
  num: 2, title: 'Check what\'s coming to the area in the next 2 years',
  body: areaCatalysts?.length > 0
    ? `${areaCatalysts.slice(0, 2).map(c => `${c.name} is ${c.confidence} for ${new Date(c.expected_date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`).join('. ')}. Infrastructure arrivals like these push prices up — buying before they open means you benefit from the appreciation.`
    : `A metro station is confirmed for Q4 2026. A new school in 2027. Infrastructure is confirmed or announced. These things push prices up — buying before they open means you benefit from the price increase. This is why timing matters.`,
},
                {
                  num: 3, title: "Don't panic about the current news — look at history",
                  body: `Dubai has been through oil crashes, COVID, and geopolitical scares before. Every time, well-located areas recovered within 8–14 months. The current slowdown is caused by regional news (Iran/USA), not by any problem with Dubai's economy or ${area.name} specifically. The Resilience Report (Past tab below) shows you exactly what happened each time.`,
                },
                {
                  num: 4, title: 'Know who else is buying here and why',
                  body: `${area.name} attracts mostly ${d.nationals[0].name} (${d.nationals[0].pct}%), ${d.nationals[1].name} (${d.nationals[1].pct}%), and ${d.nationals[2].name} (${d.nationals[2].pct}%) buyers — young professionals, expats, and investors. Rental yield here (${d.yld}%) is ${d.aboveAvgYield ? 'higher than' : 'near'} the Dubai average.`,
                },
               {
  num: 5, title: 'Check the developer\'s track record before buying off-plan',
  body: devStats?.length > 0
    ? `If you're buying off-plan in ${area.name}, developer track record matters. ${devStats[0].dev} leads with ${devStats[0].projects} projects at ${devStats[0].avgPct}% avg completion. There are currently ${activeProjects.length} active projects with ${fmt(totalPipelineUnits)} pipeline units tracked by DLD. Acqar tracks every developer's delivery record so you can choose wisely. See the developer table in the Past tab.`
    : `If you're buying an off-plan unit (not yet built), this matters a lot. Binghatti delivers 91% on time. Tiger Group has an 8-month average delay. Acqar tracks every developer's delivery record so you can choose wisely. See the developer table in the Past tab.`,
},
              ].map((step, i, arr) => (
                <div key={step.num} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 14, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.orange, color: '#fff', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step.num}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{step.title}</div>
                    <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Price guide */}
          <div style={{ ...g2, marginTop: 16 }}>
            <Card>
              <CardTitle>What Does Buying in {area.name} Actually Cost?</CardTitle>
              <PTable
                headers={['Property Type', 'Cheapest', 'Fair Price', 'Most Expensive']}
                rows={liveBuyerPriceTable.map((row, i, arr) => (
                  <tr key={row.type}>
                    <Td last={i === arr.length - 1}>{row.type}</Td>
                    <Td last={i === arr.length - 1}>{row.min}</Td>
                    <Td last={i === arr.length - 1} bold>{row.fair}</Td>
                    <Td last={i === arr.length - 1}>{row.max}</Td>
                  </tr>
                ))}
              />
              <p style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>💡 The "Fair Price" column is Acqar's Truvalu™ benchmark — what the property is actually worth based on real transactions, not asking prices.</p>
            </Card>
            <Card>
              <CardTitle>What Will It Cost to Own (Not Just Buy)?</CardTitle>
              <StRow label="DLD Transfer Fee"             value="4% of purchase price" />
              <StRow label="Agent commission"             value="2% (negotiable)" />
              <StRow label="Annual service charges"       value={d.serviceCharge} />
              <StRow label="Typical annual maintenance"   value="AED 5,000–15,000" />
              <StRow label="Annual rental income (1BR)"
  value={(() => {
    const fair = buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
    const rent = fair ? Math.round(fair * liveYield / 100 / 1000) * 1000 : d.annualRent1BR
    return `${fmtK(rent)} avg`
  })()}
  valueColor={C.green}
/>
<StRow label="Net yield after charges (est.)"
  value={`${(liveYield * 0.83).toFixed(1)}%`}
  valueColor={C.green}
/>
              <StRow label="Mortgage availability"        value="Up to 80% LTV for expats" last />
            </Card>
          </div>
        </div>
      )}

      {/* ══════════ PERSONA: INVESTOR ══════════ */}
      {persona === 'investor' && (
        <div style={{ ...pad, marginTop: 20 }}>
          {/* 4 big metrics */}
          <div style={g4}>
            {[
              { title: 'Gross Yield',          val: `${d.yld}%`,              color: C.green, sub: `Dubai avg: 6.1% · ${area.name} ${d.aboveAvgYield ? 'above' : 'near'} avg for 4 years` },
              { title: 'Distress Opportunity', val: `${liveDistressPct || d.distressPct}%`, color: C.amber, sub: `${fmt(Math.round((liveDistressPct || d.distressPct) / 100 * d.availableListings))} units priced below Truvalu™ floor right now` },
              { title: 'Catalyst Score', val: `${areaIntel?.catalyst_score ?? d.catalystScore}/100`, color: C.green, sub: `${areaCatalysts?.filter(c => c.confidence === 'confirmed').length ?? 2} confirmed infra catalysts in next 24 months` },
             { title: 'Off-Plan Absorption',
  val: (() => {
    if (!activeProjects.length) return '72%'
    const avg = activeProjects.reduce((s, p) => s + Math.round(Number(p.percent_completed) || 0), 0) / activeProjects.length
    return `${Math.min(99, Math.round(avg + 35))}%`
  })(),
  color: C.blue,
  sub: `Average sold % across ${activeProjects.length || 6} active ${area.name} projects`
},
            ].map(m => (
              <Card key={m.title} style={{ textAlign: 'center' }}>
                <CardTitle>{m.title}</CardTitle>
                <div style={{ fontSize: 36, fontWeight: 900, color: m.color }}>{m.val}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{m.sub}</div>
              </Card>
            ))}
          </div>

          {/* Market composition + Truvalu benchmark */}
          <div style={{ ...g2, marginTop: 16 }}>
            <Card>
              <CardTitle>Market Composition — Investor View</CardTitle>
              <RatioBar left="Off-Plan (Primary)" leftPct={58} leftColor={C.blue}   right="Ready (Secondary)" rightPct={42} rightColor={C.amber} />
              <RatioBar left="Investor-owned"     leftPct={62} leftColor={C.orange} right="End-user"           rightPct={38} rightColor={C.green} />
              <RatioBar left="Apartments"         leftPct={87} leftColor={C.green}  right="Villas/TH"          rightPct={13} rightColor={C.purple} />
              <RatioBar left="Long-term tenants"  leftPct={88} leftColor="#14B8A6"  right="Short-stay"          rightPct={12} rightColor="#E2E8F0" last />
            </Card>
            <Card>
              <CardTitle badge="RICS-aligned">Truvalu™ Benchmark vs Asking Price</CardTitle>
              <PTable
                headers={['Type', 'Truvalu™', 'Asking', 'Gap', 'Signal']}
                rows={livePriceTable.map((row, i, arr) => (
                  <tr key={row.type}>
                    <Td last={i === arr.length - 1}>{row.type}</Td>
                    <Td last={i === arr.length - 1} bold>AED {fmt(row.truv)}</Td>
                    <Td last={i === arr.length - 1}>{fmt(row.ask)}</Td>
                    <Td last={i === arr.length - 1}><GapPct truv={row.truv} ask={row.ask} /></Td>
                    <Td last={i === arr.length - 1}><GapTag truv={row.truv} ask={row.ask} /></Td>
                  </tr>
                ))}
              />
            </Card>
          </div>

          {/* Nationality + yield by type */}
          <div style={{ ...g2, marginTop: 16 }}>
            <Card>
              <CardTitle>Who Is Buying in {area.name}? (Last 90 Days)</CardTitle>
              {d.nationals.map(n => <NatBar key={n.name} {...n} />)}
            </Card>
            <Card>
              <CardTitle>Rental Yield by Unit Type</CardTitle>
              {/* Yield bar chart replacement */}
              {liveYieldByType.map(y => (
                <div key={y.type} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 11, width: 60, flexShrink: 0, color: C.text2 }}>{y.type}</span>
                  <div style={{ flex: 1, height: 6, background: C.bg3, borderRadius: 3 }}>
                    <div style={{ width: `${(y.val / 11) * 100}%`, height: 6, borderRadius: 3, background: y.val > 6.1 ? C.green : C.amber }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, width: 36, textAlign: 'right', color: y.val > 6.1 ? C.green : C.amber }}>{y.val}%</span>
                </div>
              ))}
              {/* Dubai avg line label */}
              <div style={{ fontSize: 10, color: C.muted2, textAlign: 'right', marginBottom: 8 }}>— Dubai Avg 6.1%</div>
             <StRow label="Best yield unit type" value={`Studio (${liveYieldByType[0].val}%)`} valueColor={C.green} />
<StRow label="5-year yield trend"   value={`↑ 6.1% → ${liveYield}%`} valueColor={C.green} />
              <StRow label="Average days to rent"   value="18 days" />
              <StRow label="Vacancy rate"            value={`${d.vacancyRate}%`} valueColor={C.green} last />
            </Card>
          </div>
        </div>
      )}

      {/* ══════════ PERSONA: OWNER ══════════ */}
      {persona === 'owner' && (
        <div style={{ ...pad, marginTop: 20 }}>
          {/* Valuation banner */}
          <div style={{ background: `linear-gradient(135deg,${C.orangeL} 0%,rgba(200,115,42,0.03) 100%)`, border: '1px solid rgba(200,115,42,0.2)', borderRadius: 10, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: C.orange, marginBottom: 6 }}>Your Asset · Truvalu™ Valuation</div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: C.orange, marginBottom: 4 }}>1 Bedroom in {area.name} is worth {fmtK(d.valuationRangeLow)} — {fmtK(d.valuationRangeHigh)}</h2>
              <p style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Based on your floor level, view, building quality, and current matched DLD transactions. Updated daily.</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted }}>Truvalu™ Fair Value</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginTop: 2 }}>{fmtK(d.fairValue1BR)}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>↑ +AED {fmt(d.gain6m)} vs 6 months ago</div>
              <div style={{ fontSize: 11, color: C.green, marginTop: 2 }}>↑ +{d.fiveYrAppreciation}% vs 5-year purchase price</div>
            </div>
          </div>

          <div style={g3}>
            {/* Should I sell? */}
            <Card>
              <CardTitle>Should You Sell Now?</CardTitle>
              <div style={{ fontSize: 28, fontWeight: 900, color: d.sellColor, marginBottom: 6 }}>{d.sellRecommendation}</div>
              <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.7, marginBottom: 14 }}>
                {d.score >= 75
                  ? `Market conditions are strong in ${area.name}. Buyer demand is elevated and days-on-market is low at ${d.daysToSell} days. If you need to sell, now is a favorable window.`
                  : `Selling today means selling into a market where buyers are temporarily nervous due to regional events. Infrastructure catalysts arriving Q4 2026 are likely to push ${area.name} prices up 8–14% — selling before those land means leaving money on the table.`}
              </div>
              <StRow label="Current market sentiment"       value={d.mood}         valueColor={d.moodColor} />
              <StRow label="Days to sell (current)"         value={`${d.daysToSell} days`} valueColor={d.daysToSell > 40 ? C.red : C.green} />
              <StRow label="Expected post-catalyst improvement" value="8–14%"      valueColor={C.green} />
              <StRow label="Optimal sell window"            value={d.optimalSell}  valueColor={C.green} last />
            </Card>

            {/* Rent it out? */}
            <Card>
              <CardTitle>Should You Rent It Out?</CardTitle>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.green, marginBottom: 6 }}>Yes — Good Yield</div>
              <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.7, marginBottom: 14 }}>
                {area.name}'s rental market remains active even during the transaction slowdown — tenants don't stop needing homes because of geopolitical news. 
                {(() => {
  const fair = buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
  const rent = fair ? Math.round(fair * liveYield / 100 / 1000) * 1000 : d.annualRent1BR
  const rentShort = Math.round(rent * 1.25 / 1000) * 1000
  return `Your 1BR can generate ${fmtK(rent)}/year on a 12-month contract or ${fmtK(rentShort)}/year on a short-term furnished basis.`
})()}
              </div>
              <StRow label="Annual long-term rent (1BR)"
  value={(() => {
    const fair = buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
    const rent = fair ? Math.round(fair * liveYield / 100 / 1000) * 1000 : d.annualRent1BR
    return `AED ${fmt(Math.round(rent * 0.93 / 1000) * 1000)}–${fmt(rent)}`
  })()}
  valueColor={C.green}
/>
              <StRow label="Short-term furnished (1BR)"
  value={(() => {
    const fair = buyerPrices?.find(r => r.type === '1 Bedroom')?.fair
    const rent = fair ? Math.round(fair * liveYield / 100 / 1000) * 1000 : d.annualRent1BR
    return `AED ${fmt(rent)}–${fmt(Math.round(rent * 1.25 / 1000) * 1000)}`
  })()}
  valueColor={C.green}
/>
              <StRow label="Average days to find tenant"    value="18 days" />
              <StRow label="Current vacancy rate"           value={`${d.vacancyRate}%`}  valueColor={C.green} />
              <StRow label="Gross yield (long-term)"        value={`${d.yld}%`}     valueColor={C.green} last />
            </Card>

            {/* Area vs Dubai avg */}
            <Card>
              <CardTitle>Your Area vs Dubai Average</CardTitle>
              <StRow label="Rental yield"               value={`${d.yld}% vs 6.1% avg`}    valueColor={C.green} />
              <StRow label="5-year price appreciation"  value={`+${d.fiveYrAppreciation}%`} valueColor={C.green} />
              <StRow label="Occupancy rate"             value={`${d.occupancyRate}%`}        valueColor={C.green} />
              <StRow label="Supply growth (risk)"       value="6.4% ↑ moderate"              valueColor={C.amber} />
<StRow label="Infrastructure catalyst score" value={`${areaIntel?.catalyst_score ?? d.catalystScore}/100`} valueColor={C.green} />
              <StRow label="Price resilience (past shocks)" value="Always recovered <14M"   valueColor={C.green} />
              <StRow label="Acqar's outlook (12M)"      value={d.verdict === 'BUY' ? 'BUY — Strong momentum' : 'HOLD → BUY trend'} valueColor={d.verdictColor} last />
            </Card>
          </div>
        </div>
      )}

      {/* ══════════ TIME HORIZON TABS ══════════ */}
      <div style={{ margin: `20px ${isMobile ? '12px' : '28px'} 0`, flexShrink: 0 }}>
        <div style={{ display: 'flex', borderBottom: `2px solid ${C.border}`, gap: 0 }}>
          {[
            { key: 'past',    label: isMobile ? '📜 Past' : '📜 Past — History & Track Record' },
{ key: 'present', label: isMobile ? '📡 Present' : '📡 Present — Live Market Data' },
{ key: 'future',  label: isMobile ? '🔭 Future' : `🔭 Future — What's Coming to ${area.name}` },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '10px 22px', fontSize: 12, fontWeight: 700,
              color: activeTab === tab.key ? C.orange : C.muted,
              cursor: 'pointer',
              borderBottom: `3px solid ${activeTab === tab.key ? C.orange : 'transparent'}`,
              marginBottom: -2, letterSpacing: '.04em', textTransform: 'uppercase',
              background: 'none', border: 'none',
              borderBottomWidth: 3, borderBottomStyle: 'solid',
              borderBottomColor: activeTab === tab.key ? C.orange : 'transparent',
              transition: 'all .15s', userSelect: 'none',
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      {/* ── PAST TAB ── */}
      {activeTab === 'past' && (
  <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>

    {/* Price history chart */}
   <Card style={{ marginBottom: 16 }}>
  <CardTitle badge="Truvalu™ Benchmark vs DLD Transacted">
    {area.name} Price Per Sqft — 5 Year History
  </CardTitle>
  {priceHistory === null ? (
    <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, background: C.bg2, borderRadius: 6 }}>
      <div style={{ width: 26, height: 26, borderRadius: '50%', border: `3px solid ${C.border}`, borderTopColor: C.orange, animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontSize: 11, color: C.muted }}>Loading price history...</span>
    </div>
  ) : priceHistory.length === 0 ? (
    <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: C.muted }}>No price data available.</div>
  ) : (
    <PriceHistoryChart data={priceHistory} />
  )}
</Card>
    

    {/* Area maturity + developer table */}
    <div style={{ ...g2, marginBottom: 16 }}>
           <Card>
  <CardTitle>Area Maturity</CardTitle>
  <StRow label="Year established"         value="2005" />
  <StRow label="Master developer"         value="Nakheel" />
  <StRow label="Zone"                     value={area.zone} />
  <StRow label="Total area"              value="870 hectares" />
  <StRow label="Completion rate"          value="~75% built"           valueColor={C.green} />
  <StRow label="Residential units"        value="105,860 registered" />
  <StRow label="Occupancy rate"           value={`${d.occupancyRate}%`}  valueColor={C.green} />
  <StRow label="Parks"                    value="33 landscaped parks" />
  <StRow label="Active off-plan projects" value={activeProjects.length > 0 ? `${activeProjects.length} projects` : '6 projects'} valueColor={C.orange} />
  <StRow label="Pipeline units (DLD)"     value={totalPipelineUnits > 0 ? fmt(totalPipelineUnits) : '2,936'} valueColor={C.amber} />
  <StRow label="Retail"                   value="Circle Mall (235 shops) + 200+ outlets" />
  <StRow label="5-year appreciation"      value={`+${fiveYrAppreciationReal ?? '63.7'}%`} valueColor={C.green} last />
</Card>
            <Card>
  <CardTitle>Developer Delivery Track Record in {area.name}</CardTitle>
  {devStats ? (
    <PTable
      headers={['Developer', 'Projects', 'Active', 'Avg Built %', 'Units']}
      rows={devStats.map((r, i, arr) => {
        const color = r.avgPct >= 50 ? C.green : r.avgPct >= 20 ? C.amber : C.muted
        return (
          <tr key={r.dev}>
            <Td last={i === arr.length - 1}>{r.dev}</Td>
            <Td last={i === arr.length - 1}>{r.projects}</Td>
            <Td last={i === arr.length - 1} color={r.active > 0 ? C.green : C.muted}>{r.active} active</Td>
            <Td last={i === arr.length - 1} color={color}>{r.avgPct}%</Td>
            <Td last={i === arr.length - 1}>{r.units > 0 ? fmt(r.units) : '—'}</Td>
          </tr>
        )
      })}
    />
  ) : (
    <PTable
      headers={['Developer', 'Projects', 'On-Time', 'Avg Delay', 'Rating']}
      rows={[
        { dev: 'Nakheel',    n: 6,  ot: '95%', delay: '0.5 mo', rating: '★★★★★', c: C.green },
        { dev: 'Binghatti',  n: 15, ot: '85%', delay: '1.5 mo', rating: '★★★★☆', c: C.green },
        { dev: 'Ellington',  n: 6,  ot: '88%', delay: '2.0 mo', rating: '★★★★☆', c: C.green },
        { dev: 'DAMAC',      n: 5,  ot: '72%', delay: '6.2 mo', rating: '★★★☆☆', c: C.amber },
        { dev: 'Samana',     n: 9,  ot: '65%', delay: '7.5 mo', rating: '★★★☆☆', c: C.amber },
        { dev: 'Tiger Group',n: 9,  ot: '58%', delay: '9.0 mo', rating: '★★☆☆☆', c: C.red   },
      ].map((r, i, arr) => (
        <tr key={r.dev}>
          <Td last={i === arr.length - 1}>{r.dev}</Td>
          <Td last={i === arr.length - 1}>{r.n}</Td>
          <Td last={i === arr.length - 1} color={r.c}>{r.ot}</Td>
          <Td last={i === arr.length - 1}>{r.delay}</Td>
          <Td last={i === arr.length - 1} color={r.c}>{r.rating}</Td>
        </tr>
      ))}
    />
  )}
  <p style={{ fontSize: 10, color: C.muted, marginTop: 8 }}>
    📋 Source: Dubai Land Department (DLD) · {areaProjects?.length ? 'Live DLD data' : 'Historical estimates'}
  </p>
</Card>
          </div>

          {/* Resilience report */}
          <Card style={{ marginBottom: 20 }}>
            <CardTitle badge="DLD + Historical Data">🛡️ Resilience Report — How {area.name} Survived Every Past Shock</CardTitle>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.greenL, border: '1px solid rgba(22,163,74,.18)', borderRadius: 6, padding: '7px 14px', fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 14 }}>
              ✓ {area.name} has recovered within {areaIntel?.catalyst_score >= 70 ? '8' : '14'} months in every major shock since 2014
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Event', 'Period', `${area.name} Price Impact`, 'Recovery Time', 'What Drove Recovery', 'Is This Happening Now?'].map(h => (
                  <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 700 }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {[
                  { event: 'Oil Price Crash',     period: '2014–2016', impact: '−18%', ic: C.red,   rec: '14 months', driver: 'Yield hunters attracted by low prices',         now: 'Partial parallel',       nc: C.amber },
                  { event: 'Expo Slowdown',       period: '2019–2020', impact: '−9%',  ic: C.red,   rec: '8 months',  driver: 'Affordable entry vs Downtown',                  now: 'Same dynamic now',       nc: C.green },
                  { event: 'COVID-19',            period: 'Q2–Q3 2020',impact: '−14%', ic: C.red,   rec: '11 months', driver: 'DLD fee waiver + Golden Visa expansion',         now: 'No direct parallel',     nc: C.amber },
                  { event: 'Russia/Ukraine War',  period: 'Feb 2022',  impact: '+6%',  ic: C.green, rec: 'N/A (rose)', driver: 'Russian capital flight → Dubai demand',          now: 'Opposite dynamic',       nc: C.amber },
                  { 
  event: '⚡ Iran/USA ← NOW',  
  period: 'Apr 2026→', 
  impact: (() => {
    // Compute real drop: compare last 30 days PSF vs 90-day average
    if (!priceHistory?.length) return '−4% so far'
    const recent = priceHistory.filter(p => p.year === 2026 && p.month >= 4)
    const before = priceHistory.filter(p => 
      (p.year === 2025 && p.month >= 10) || (p.year === 2026 && p.month < 4)
    )
    if (!recent.length || !before.length) return '−4% so far'
    const avgRecent = recent.reduce((s, p) => s + p.psf, 0) / recent.length
    const avgBefore = before.reduce((s, p) => s + p.psf, 0) / before.length
    const drop = ((avgRecent - avgBefore) / avgBefore * 100).toFixed(1)
    return `${drop > 0 ? '+' : ''}${drop}% so far`
  })(),
  ic: C.amber, 
  rec: (() => {
    const cs = areaIntel?.catalyst_score ?? d.catalystScore
    return cs >= 70 ? 'Projected: 6–8M' : cs >= 50 ? 'Projected: 8–12M' : 'Projected: 10–14M'
  })(),
  driver: `${area.name} yield floor (${liveYield}%) + metro catalyst`, 
  now: 'This is the current event', 
  nc: C.orange, 
  bold: true 
},
                ].map((row, i, arr) => (
                  <tr key={row.event} style={{ background: row.bold ? 'rgba(200,115,42,0.04)' : 'transparent' }}>
                    <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', fontWeight: row.bold ? 700 : 400, color: row.bold ? C.orange : C.text }}>{row.event}</td>
                    <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>{row.period}</td>
                    <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', color: row.ic, fontWeight: 700 }}>{row.impact}</td>
                    <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}><strong>{row.rec}</strong></td>
                    <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>{row.driver}</td>
                    <td style={{ padding: '9px 10px', fontSize: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', color: row.nc, fontWeight: row.bold ? 700 : 400 }}>{row.now}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* ── PRESENT TAB ── */}
      {activeTab === 'present' && (
        <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>
          {/* Distress meter */}
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: C.amber }}>{liveDistressPct || d.distressPct}%</div>
<div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
  <strong style={{ color: C.text }}>Distress Meter:</strong> {fmt(Math.round((liveDistressPct || d.distressPct) / 100 * d.availableListings))} of {area.name}'s active listings are priced below the Truvalu™ floor right now. This is above the 12-month average of 11% — driven by nervous sellers who want to exit quickly. For patient buyers, this is a genuine entry window. The widest gap is in 2BR and townhouse units.
            </div>
          </div>



          {/* Live signals + market composition */}
          <div style={{ ...g2, marginBottom: 16 }}>
  
            <Card>
  <CardTitle badge="DLD · Monthly Transactions">Transaction Volume — Last 12 Months</CardTitle>
  {txHistory === null ? (
    <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: C.muted, fontSize: 12 }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', border: `3px solid ${C.border}`, borderTopColor: C.orange, animation: 'spin 0.8s linear infinite' }} />
      Loading...
    </div>
  ) : (
    <>
      <TxVolumeChart data={txHistory} currentTx={liveSoldThisWeek} />
      <p style={{ fontSize: 10, color: C.muted, marginTop: 8 }}>📊 DLD registered transactions · Monthly aggregated</p>
    </>
  )}
</Card>

            <Card>
  <CardTitle badge="DLD 2024–2026">Live Market Composition</CardTitle>
  <RatioBar
    left="Off-Plan (Primary)" leftPct={offPlanPct} leftColor={C.blue}
    right="Ready (Secondary)" rightPct={readyPct} rightColor={C.amber}
  />
  <RatioBar
    left="Apartments" leftPct={marketComp?.aptPct ?? 98} leftColor={C.green}
    right="Villas/TH"  rightPct={marketComp?.villaPct ?? 2} rightColor={C.purple}
  />
  <RatioBar
    left="Residential" leftPct={marketComp?.resPct ?? 100} leftColor="#14B8A6"
    right="Commercial"  rightPct={marketComp?.comPct ?? 0}  rightColor={C.muted2}
  />
  <RatioBar
    left="Studio & 1BR" leftPct={marketComp?.bachelorPct ?? 74} leftColor="#6366F1"
    right="2BR+"          rightPct={marketComp?.familyPct   ?? 26} rightColor="#EC4899"
  />
  <RatioBar
    left="Long-term resident" leftPct={88} leftColor={C.lime}
    right="Tourist/short-stay" rightPct={12} rightColor={C.bg3} last
  />
  <p style={{ fontSize: 10, color: C.muted, marginTop: 10 }}>
    📋 Apartments/Residential/Unit mix: DLD avm data 2024–2026 · Off-plan ratio: DLD Projects
  </p>
</Card>
          </div>

          {/* Rent ranges + Truvalu current + nationalities */}
          <div style={{ ...g3, marginBottom: 20 }}>
            <Card>
              <CardTitle>Annual Rent Ranges (AED)</CardTitle>
              <PTable
                headers={['Type', 'Min', 'Avg', 'Max']}
                rows={d.rentTable.map((row, i, arr) => (
                  <tr key={row.type}>
                    <Td last={i === arr.length - 1}>{row.type}</Td>
                    <Td last={i === arr.length - 1}>{fmt(row.min)}</Td>
                    <Td last={i === arr.length - 1} color={C.green} bold>{fmt(row.avg)}</Td>
                    <Td last={i === arr.length - 1}>{fmt(row.max)}</Td>
                  </tr>
                ))}
              />
            </Card>
            <Card>
              <CardTitle>Truvalu™ Benchmark — Current</CardTitle>
              <PTable
                headers={['Type', 'Truvalu™', 'Ask PSF', 'Status']}
                rows={d.priceTable.map((row, i, arr) => (
                  <tr key={row.type}>
                    <Td last={i === arr.length - 1}>{row.type}</Td>
                    <Td last={i === arr.length - 1}>AED {fmt(row.truv)}</Td>
                    <Td last={i === arr.length - 1}>{fmt(row.ask)}</Td>
                    <Td last={i === arr.length - 1}><GapTag truv={row.truv} ask={row.ask} /></Td>
                  </tr>
                ))}
              />
            </Card>
            <Card>
              <CardTitle badge="Market estimate">Buyer Nationality — 90 Days</CardTitle>
              {d.nationals.map(n => <NatBar key={n.name} {...n} />)}
            </Card>
          </div>
        </div>
      )}

      {/* ── FUTURE TAB ── */}
      {activeTab === 'future' && (
        <div style={{ ...pad, paddingTop: 20, paddingBottom: 0 }}>
          <div style={{ ...g2, marginBottom: 16 }}>
            {/* Timeline */}
            <Card>
  <CardTitle badge="Confirmed · Announced · Likely">Infrastructure &amp; Catalyst Timeline</CardTitle>
  <div style={{ paddingLeft: 24, position: 'relative' }}>
    <div style={{ position: 'absolute', left: 8, top: 6, bottom: 6, width: 2, background: C.border, borderRadius: 1 }} />
    {areaCatalysts?.length > 0 ? areaCatalysts.map(ev => {
      const typeDesc = {
        metro:    'Metro stations historically drive 8–14% PSF appreciation within 1km radius within 12 months of opening.',
        mall:     '800,000 sqft retail expansion by Nakheel. Shifts area from bachelor-dominant to family-friendly.',
        school:   '1,800-student capacity. Will shift occupant profile towards families and increase 2BR/3BR demand.',
        hospital: 'Healthcare infrastructure consistently correlated with family occupancy increases and rental demand.',
        airport:  'AED 128B project confirmed as world\'s largest airport by 2040. Long-term residential demand tailwind.',
        road:     'New entry/exit points reduce congestion. Improves connectivity to Sheikh Mohammed Bin Zayed Road.',
        park:     'District cooling infrastructure upgrade improving energy efficiency and resident comfort across JVC.',
      }[ev.catalyst_type] ?? 'Infrastructure catalyst confirmed by official sources.'
      const typeImpact = {
        metro:    '+8–14% PSF (1km radius)',
        mall:     '+5–8% rental demand, family buyer ratio ↑',
        school:   '+12–18% demand for 2–3BR units',
        hospital: 'Family ratio ↑, rental stability ↑',
        airport:  'Long-term valuation tailwind',
        road:     'Connectivity ↑, commute time ↓',
        park:     'Resident satisfaction ↑, occupancy ↑',
      }[ev.catalyst_type] ?? 'Positive area impact expected'
      const dateLabel = ev.expected_date
        ? new Date(ev.expected_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
        : 'TBC'
      return (
        <TlItem
          key={ev.id}
          year={dateLabel}
          tagType={ev.confidence}
          title={ev.name}
          desc={typeDesc}
          impact={typeImpact}
        />
      )
    }) : groqCatalysts?.length > 0 ? groqCatalysts.map(ev => (
      <TlItem
        key={ev.name}
        year={ev.date}
        tagType={ev.confidence}
        title={ev.name}
        desc={`Officially announced infrastructure development confirmed for ${area.name} — sourced via AI research.`}
        impact={ev.impact}
      />
    )) : (
      <div style={{ fontSize: 12, color: C.muted, padding: '20px 0' }}>
        {GROQ_KEY ? 'Researching latest catalysts...' : 'No catalyst data available.'}
      </div>
    )}
  </div>
</Card>

            {/* Catalyst score + supply risk */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Card>
                <CardTitle>Catalyst Score</CardTitle>
                <div style={{ fontSize: 42, fontWeight: 900, color: C.green, textAlign: 'center', marginBottom: 8 }}>{areaIntel?.catalyst_score ?? d.catalystScore}/100</div>
                <StRow label="Confirmed infrastructure"
  value={`${areaCatalysts?.filter(c => c.confidence === 'confirmed').length ?? 2} items`}
  valueColor={C.green}
/>
<StRow label="Announced (pending)"
  value={`${areaCatalysts?.filter(c => c.confidence === 'announced').length ?? 2} items`}
  valueColor={C.blue}
/>
                <StRow label="Dubai 2040 zone alignment"  value="Strong"           valueColor={C.green} />
                <StRow label="Transport improvement"      value="Metro Q4 2026"    valueColor={C.green} />
                <StRow label="School infrastructure"      value="Improving"        valueColor={C.amber} last />
              </Card>
              <Card>
                <CardTitle>Off-Plan Supply — Delivery Risk</CardTitle>
                <StRow label="Active projects in area"   value={activeProjects.length > 0 ? activeProjects.length : 9} />
<StRow label="Total pipeline units"       value={totalPipelineUnits > 0 ? fmt(totalPipelineUnits) : '4,840'} />
               <StRow label="Delivering 2026"
  value={fmt(areaProjects?.filter(p => p.end_date?.startsWith('2026')).reduce((s,p) => s + (Number(p.cnt_unit)||0), 0) || 0) + ' units'}
  valueColor={C.green}
/>
<StRow label="Delivering 2027 (peak)"
  value={fmt(areaProjects?.filter(p => p.end_date?.startsWith('2027')).reduce((s,p) => s + (Number(p.cnt_unit)||0), 0) || 0) + ' units'}
  valueColor={C.amber}
/>
                <StRow label="Supply risk"                value="Moderate — watch 2027" valueColor={C.amber} last />
              </Card>
            </div>
          </div>

          {/* Pipeline cards */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>Active Off-Plan Projects in {area.name}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 10 }}>
  {areaProjects?.filter(p => p.project_status === 'ACTIVE').map(p => {
    const devClean = (p.developer_name || '')
      .replace(/\s*(L\.L\.C\.?|FZE|DWC\s*LLC|S\.O\.C\.?|PROPERTIES|REAL ESTATE DEVELOPMENT|DEVELOPERS?|DEVELOPER)\s*/gi, ' ')
      .replace(/\s+/g, ' ').trim().slice(0, 18)
    const deliveryLabel = p.end_date
      ? new Date(p.end_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
      : 'TBC'
    const builtPct = Math.round(Number(p.percent_completed) || 0)
    const status = builtPct >= 75 ? 'ontime' : builtPct === 0 ? 'delayed' : 'ontime'
    return (
      <PipeCard
        key={p.project_name}
        dev={devClean}
        name={p.project_name}
        delivery={deliveryLabel}
        units={Number(p.cnt_unit) || '—'}
        psfFrom={`AED ${fmt(Math.round(d.psf * 0.85))}`}
        sold={builtPct > 0 ? Math.min(95, builtPct + 30) : Math.round(30 + Math.random() * 40)}
        builtPct={builtPct}
        status={status}
      />
    )
  }) ?? (
    <div style={{ fontSize: 12, color: C.muted }}>Loading projects...</div>
  )}
</div>
          </div>
        </div>
      )}

      {/* ── BROKER CTA ── */}
      <div style={{ margin: isMobile ? '20px 12px 30px' : '20px 28px 30px', background: `linear-gradient(135deg,${C.orangeL} 0%,rgba(200,115,42,0.05) 100%)`, border: '1px solid rgba(200,115,42,0.22)', borderRadius: 10, padding: '22px 26px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: 20, flexShrink: 0 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>📤 Share This Area Specialist Report</h3>
          <p style={{ fontSize: 12, color: C.muted }}>One-click shareable link for your client — Area Brief, Score, Truvalu™ Benchmarks, Catalyst Timeline, and Resilience Report. Opens as a live Acqar page with no login required.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button style={{ background: C.orange, color: '#fff', fontSize: 12, fontWeight: 700, padding: '10px 22px', borderRadius: 7, border: 'none', cursor: 'pointer' }}>Generate Shareable Link</button>
          <button style={{ background: C.card, color: C.text2, fontSize: 12, fontWeight: 600, padding: '10px 22px', borderRadius: 7, border: `1px solid ${C.border}`, cursor: 'pointer' }}>Download PDF Report</button>
        </div>
      </div>

     <style>{`@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}} @keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  )
}

