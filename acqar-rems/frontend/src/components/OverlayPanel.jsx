// import { useState, useEffect } from 'react'
// import { useEvents } from '../context/EventsContext'

// const CATEGORIES = [
//   { key: 'transaction', label: 'Transactions', color: '#E74C3C', icon: '🏠' },
//   { key: 'offplan', label: 'Off-Plan', color: '#2980B9', icon: '🏗️' },
//   { key: 'construction', label: 'Construction', color: '#F39C12', icon: '🔧' },
//   { key: 'regulatory', label: 'Regulatory', color: '#8E44AD', icon: '📋' },
//   { key: 'infrastructure', label: 'Infrastructure', color: '#27AE60', icon: '🚇' },
//   { key: 'investment', label: 'Investment', color: '#16A085', icon: '💰' },
//   { key: 'price_signal', label: 'Price Signals', color: '#E67E22', icon: '📈' },
//   { key: 'freezone', label: 'Free Zones', color: '#D4AC0D', icon: '🏢' },
//   { key: 'rental_yield', label: 'Rental Yield', color: '#1ABC9C', icon: '📡' },
//   { key: 'foreign_buyers', label: 'Foreign Buyers', color: '#9B59B6', icon: '🌍' },
// ]

// const SEV_COLORS = { 1: '#27AE60', 2: '#A8D44A', 3: '#F39C12', 4: '#E67E22', 5: '#E74C3C' }
// const SEV_LABELS = { 1: 'S1', 2: 'S2', 3: 'S3', 4: 'S4', 5: 'S5' }

// export default function OverlayPanel() {
//   const { filters, updateFilters, events, mapStyle, setMapStyle } = useEvents()
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [isCategoriesOpen, setIsCategoriesOpen] = useState(true)
//   const [isSeverityOpen, setIsSeverityOpen] = useState(true)
//   const [isMapOptionsOpen, setIsMapOptionsOpen] = useState(true)
//   const [isMapStyleOpen, setIsMapStyleOpen] = useState(false)
//   const [activeSevs, setActiveSevs] = useState([1, 2, 3, 4, 5])
//   const [mapOptions, setMapOptions] = useState({
//     events: true,
//     weather: false,
//     pipelines: false,
//     military: false,
//     energy: false,
//     internet: false,
//     daynight: false,
//   })

//   const countForCategory = (key) => events.filter(e => e.category === key).length

//   const toggleCategory = (key) => {
//     const current = filters.categories
//     const next = current.includes(key) ? current.filter(c => c !== key) : [...current, key]
//     updateFilters({ categories: next })
//   }

//   const toggleSev = (s) => {
//     setActiveSevs(prev => {
//       if (prev.includes(s)) {
//         const next = prev.filter(x => x !== s)
//         return next.length === 0 ? [s] : next // never empty
//       }
//       return [...prev, s].sort()
//     })
//   }

//   useEffect(() => {
//     updateFilters({
//       severityMin: Math.min(...activeSevs),
//       severityMax: Math.max(...activeSevs),
//     })
//   }, [activeSevs])

//   const allCategoriesActive = filters.categories.length === CATEGORIES.length
//   const noCategoriesActive = filters.categories.length === 0

//   // Icon shortcuts row - 6 main categories
//   const shortcutCategories = [
//     CATEGORIES.find(c => c.key === 'transaction'),
//     CATEGORIES.find(c => c.key === 'offplan'),
//     CATEGORIES.find(c => c.key === 'regulatory'),
//     CATEGORIES.find(c => c.key === 'investment'),
//     CATEGORIES.find(c => c.key === 'price_signal'),
//     CATEGORIES.find(c => c.key === 'foreign_buyers'),
//   ]

//   return (
//     <div style={{
//       position: 'absolute',
//       top: '12px',
//       left: '12px',
//       zIndex: 10,
//       width: '240px',
//     }}>
//       {/* Main Panel Container */}
//       <div style={{
//         background: 'rgba(22,33,62,0.92)',
//         backdropFilter: 'blur(8px)',
//         border: '1px solid #0F3460',
//         borderRadius: '8px',
//         overflow: 'hidden',
//       }}>
//         {/* Header - Collapsible */}
//         <button
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           style={{
//             width: '100%',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             padding: '8px 12px',
//             background: 'rgba(15,52,96,0.5)',
//             border: 'none',
//             borderBottom: isCollapsed ? 'none' : '1px solid #0F3460',
//             fontSize: '11px',
//             fontWeight: 700,
//             color: '#B87333',
//             letterSpacing: '0.8px',
//             cursor: 'pointer',
//             transition: 'all 0.15s',
//           }}
//         >
//           <span>◆ OVERLAYS</span>
//           <span style={{ fontSize: '10px' }}>{isCollapsed ? '▶' : '▼'}</span>
//         </button>

//         {/* Collapsed state - only show header */}
//         {isCollapsed && (
//           <div style={{ display: 'none' }} />
//         )}

//         {/* Expanded content */}
//         {!isCollapsed && (
//           <div style={{ padding: '8px' }}>
//             {/* Icon shortcuts row */}
//             <div style={{
//               display: 'grid',
//               gridTemplateColumns: '1fr 1fr 1fr',
//               gap: '4px',
//               marginBottom: '10px',
//             }}>
//               {shortcutCategories.map(cat => {
//                 const active = filters.categories.includes(cat.key)
//                 return (
//                   <button
//                     key={cat.key}
//                     onClick={() => toggleCategory(cat.key)}
//                     title={cat.label}
//                     style={{
//                       padding: '6px 4px',
//                       fontSize: '16px',
//                       background: active ? cat.color + '30' : 'rgba(255,255,255,0.05)',
//                       border: `1px solid ${active ? cat.color : '#1a2a4a'}`,
//                       borderRadius: '4px',
//                       cursor: 'pointer',
//                       transition: 'all 0.15s',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                     }}
//                   >
//                     {cat.icon}
//                   </button>
//                 )
//               })}
//             </div>

//             {/* CATEGORIES Section */}
//             <div style={{ marginBottom: '10px' }}>
//               <button
//                 onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
//                 style={{
//                   width: '100%',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                   padding: '6px 0',
//                   background: 'none',
//                   border: 'none',
//                   fontSize: '9px',
//                   fontWeight: 700,
//                   color: '#B3B3B3',
//                   letterSpacing: '0.6px',
//                   cursor: 'pointer',
//                   marginBottom: '4px',
//                 }}
//               >
//                 <span>CATEGORIES</span>
//                 <span style={{ fontSize: '9px' }}>{isCategoriesOpen ? '▼' : '▶'}</span>
//               </button>

//               {isCategoriesOpen && (
//                 <>
//                   {/* All On / All Off buttons */}
//                   <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
//                     <button
//                       onClick={() => updateFilters({ categories: CATEGORIES.map(c => c.key) })}
//                       style={{
//                         flex: 1,
//                         padding: '3px',
//                         fontSize: '8px',
//                         fontWeight: 600,
//                         background: 'transparent',
//                         border: '1px solid #1a2a4a',
//                         color: '#B3B3B3',
//                         borderRadius: '3px',
//                         cursor: 'pointer',
//                         transition: 'all 0.15s',
//                       }}
//                     >
//                       All On
//                     </button>
//                     <button
//                       onClick={() => updateFilters({ categories: [] })}
//                       style={{
//                         flex: 1,
//                         padding: '3px',
//                         fontSize: '8px',
//                         fontWeight: 600,
//                         background: 'transparent',
//                         border: '1px solid #1a2a4a',
//                         color: '#B3B3B3',
//                         borderRadius: '3px',
//                         cursor: 'pointer',
//                         transition: 'all 0.15s',
//                       }}
//                     >
//                       All Off
//                     </button>
//                   </div>

//                   {/* Categories list */}
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '200px', overflowY: 'auto' }}>
//                     {CATEGORIES.map(cat => {
//                       const active = filters.categories.includes(cat.key)
//                       const count = countForCategory(cat.key)
//                       return (
//                         <button
//                           key={cat.key}
//                           onClick={() => toggleCategory(cat.key)}
//                           style={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '6px',
//                             padding: '4px 6px',
//                             fontSize: '9px',
//                             fontWeight: 500,
//                             background: active ? cat.color + '15' : 'rgba(255,255,255,0.02)',
//                             border: `1px solid ${active ? cat.color : '#1a2a4a'}`,
//                             borderRadius: '3px',
//                             cursor: 'pointer',
//                             color: active ? cat.color : '#7a8a9a',
//                             transition: 'all 0.15s',
//                             textAlign: 'left',
//                           }}
//                         >
//                           <span style={{
//                             width: '6px',
//                             height: '6px',
//                             borderRadius: '50%',
//                             background: cat.color,
//                             flexShrink: 0,
//                           }} />
//                           <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                             {cat.label}
//                           </span>
//                           {count > 0 && (
//                             <span style={{
//                               fontSize: '8px',
//                               fontWeight: 700,
//                               background: cat.color + '33',
//                               color: cat.color,
//                               padding: '1px 4px',
//                               borderRadius: '6px',
//                               flexShrink: 0,
//                             }}>
//                               {count}
//                             </span>
//                           )}
//                         </button>
//                       )
//                     })}
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* SEVERITY Section */}
//             <div style={{ marginBottom: '10px' }}>
//               <button
//                 onClick={() => setIsSeverityOpen(!isSeverityOpen)}
//                 style={{
//                   width: '100%',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                   padding: '6px 0',
//                   background: 'none',
//                   border: 'none',
//                   fontSize: '9px',
//                   fontWeight: 700,
//                   color: '#B3B3B3',
//                   letterSpacing: '0.6px',
//                   cursor: 'pointer',
//                   marginBottom: '4px',
//                 }}
//               >
//                 <span>SEVERITY</span>
//                 <span style={{ fontSize: '9px' }}>{isSeverityOpen ? '▼' : '▶'}</span>
//               </button>

//               {isSeverityOpen && (
//                 <div style={{ display: 'flex', gap: '3px' }}>
//                   {[1, 2, 3, 4, 5].map(s => {
//                     const active = activeSevs.includes(s)
//                     const color = SEV_COLORS[s]
//                     return (
//                       <button
//                         key={s}
//                         onClick={() => toggleSev(s)}
//                         style={{
//                           flex: 1,
//                           padding: '4px 2px',
//                           fontSize: '9px',
//                           fontWeight: 800,
//                           borderRadius: '3px',
//                           cursor: 'pointer',
//                           border: `1px solid ${active ? color : '#1a2a4a'}`,
//                           background: active ? color : 'transparent',
//                           color: active ? 'white' : '#444',
//                           transition: 'all 0.15s',
//                           letterSpacing: '0.2px',
//                         }}
//                       >
//                         {SEV_LABELS[s]}
//                       </button>
//                     )
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* MAP OPTIONS Section */}
//             <div style={{ marginBottom: '10px' }}>
//               <button
//                 onClick={() => setIsMapOptionsOpen(!isMapOptionsOpen)}
//                 style={{
//                   width: '100%',
//                   display: 'none',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                   padding: '6px 0',
//                   background: 'none',
//                   border: 'none',
//                   fontSize: '9px',
//                   fontWeight: 700,
//                   color: '#B3B3B3',
//                   letterSpacing: '0.6px',
//                   cursor: 'pointer',
//                   marginBottom: '4px',
//                 }}
//               >
//                 <span>MAP OPTIONS</span>
//                 <span style={{ fontSize: '9px' }}>{isMapOptionsOpen ? '▼' : '▶'}</span>
//               </button>

//               {isMapOptionsOpen && (
//                 <div style={{ display: 'none', flexDirection: 'column', gap: '4px' }}>
//                   {[
//                     { key: 'events', label: 'Events' },
//                     { key: 'weather', label: 'Weather' },
//                     { key: 'pipelines', label: 'Pipelines & Cables' },
//                     { key: 'military', label: 'Military Bases' },
//                     { key: 'energy', label: 'Energy & Minerals' },
//                     { key: 'internet', label: 'Internet Outage' },
//                     { key: 'daynight', label: 'Day / Night' },
//                   ].map(opt => {
//                     const active = mapOptions[opt.key]
//                     return (
//                       <button
//                         key={opt.key}
//                         onClick={() => setMapOptions(prev => ({ ...prev, [opt.key]: !prev[opt.key] }))}
//                         style={{
//                           display: 'none',
//                           alignItems: 'center',
//                           gap: '6px',
//                           padding: '4px 6px',
//                           fontSize: '9px',
//                           fontWeight: 500,
//                           background: 'transparent',
//                           border: 'none',
//                           color: '#B3B3B3',
//                           cursor: 'pointer',
//                           transition: 'all 0.15s',
//                           textAlign: 'left',
//                         }}
//                       >
//                         <span style={{
//                           width: '12px',
//                           height: '12px',
//                           borderRadius: '50%',
//                           border: '1px solid #555',
//                           display: 'none',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           background: active ? '#B87333' : 'transparent',
//                           transition: 'all 0.15s',
//                         }}>
//                           {active && <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#16213E' }} />}
//                         </span>
//                         <span>{opt.label}</span>
//                       </button>
//                     )
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* MAP STYLE Section */}
//             <div>
//               <button
//                 onClick={() => setIsMapStyleOpen(!isMapStyleOpen)}
//                 style={{
//                   width: '100%',
//                   display: 'none',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                   padding: '6px 0',
//                   background: 'none',
//                   border: 'none',
//                   fontSize: '9px',
//                   fontWeight: 700,
//                   color: '#B3B3B3',
//                   letterSpacing: '0.6px',
//                   cursor: 'pointer',
//                   marginBottom: '4px',
//                 }}
//               >
//                 <span>MAP STYLE</span>
//                 <span style={{ fontSize: '9px' }}>{isMapStyleOpen ? '▼' : '▶'}</span>
//               </button>

//               {isMapStyleOpen && (
//                 <div style={{ display: 'none', flexDirection: 'column', gap: '4px' }}>
//                   {['dark', 'satellite', 'street'].map(style => (
//                     <button
//                       key={style}
//                       onClick={() => setMapStyle(style)}
//                       style={{
//                         padding: '6px 8px',
//                         fontSize: '9px',
//                         fontWeight: 600,
//                         background: 'rgba(255,255,255,0.05)',
//                         border: mapStyle === style ? '2px solid #B87333' : '1px solid #1a2a4a',
//                         borderRadius: '4px',
//                         color: mapStyle === style ? '#B87333' : '#B3B3B3',
//                         cursor: 'pointer',
//                         textAlign: 'left',
//                         textTransform: 'capitalize',
//                         transition: 'all 0.15s',
//                       }}
//                     >
//                       {style}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }








// import { useState, useEffect } from 'react'
// import { useEvents } from '../context/EventsContext'

// const CATEGORIES = [
//   { key: 'transaction', label: 'Transactions', color: '#E74C3C', icon: '🏠' },
//   { key: 'offplan', label: 'Off-Plan', color: '#2980B9', icon: '🏗️' },
//   { key: 'construction', label: 'Construction', color: '#F39C12', icon: '🔧' },
//   { key: 'regulatory', label: 'Regulatory', color: '#8E44AD', icon: '📋' },
//   { key: 'infrastructure', label: 'Infrastructure', color: '#27AE60', icon: '🚇' },
//   { key: 'investment', label: 'Investment', color: '#16A085', icon: '💰' },
//   { key: 'price_signal', label: 'Price Signals', color: '#E67E22', icon: '📈' },
//   { key: 'freezone', label: 'Free Zones', color: '#D4AC0D', icon: '🏢' },
//   { key: 'rental_yield', label: 'Rental Yield', color: '#1ABC9C', icon: '📡' },
//   { key: 'foreign_buyers', label: 'Foreign Buyers', color: '#9B59B6', icon: '🌍' },
// ]

// const SEV_COLORS = { 1: '#27AE60', 2: '#A8D44A', 3: '#F39C12', 4: '#E67E22', 5: '#E74C3C' }
// const SEV_LABELS = { 1: 'S1', 2: 'S2', 3: 'S3', 4: 'S4', 5: 'S5' }

// function useIsMobile() {
//   const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
//   useEffect(() => {
//     const handler = () => setIsMobile(window.innerWidth < 768)
//     window.addEventListener('resize', handler)
//     return () => window.removeEventListener('resize', handler)
//   }, [])
//   return isMobile
// }

// export default function OverlayPanel() {
//   const { filters, updateFilters, events } = useEvents()
//   const isMobile = useIsMobile()

//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [isCategoriesOpen, setIsCategoriesOpen] = useState(true)
//   const [isSeverityOpen, setIsSeverityOpen] = useState(true)
//   const [activeSevs, setActiveSevs] = useState([1, 2, 3, 4, 5])

//   const countForCategory = (key) => events.filter(e => e.category === key).length

//   const toggleCategory = (key) => {
//     const current = filters.categories
//     const next = current.includes(key) ? current.filter(c => c !== key) : [...current, key]
//     updateFilters({ categories: next })
//   }

//   const toggleSev = (s) => {
//     setActiveSevs(prev => {
//       if (prev.includes(s)) {
//         const next = prev.filter(x => x !== s)
//         return next.length === 0 ? [s] : next
//       }
//       return [...prev, s].sort()
//     })
//   }

//   useEffect(() => {
//     updateFilters({
//       severityMin: Math.min(...activeSevs),
//       severityMax: Math.max(...activeSevs),
//     })
//   }, [activeSevs])

//   // Hide entirely on mobile — no overlay panel shown
//   if (isMobile) return null

//   // ── DESKTOP ───────────────────────────────────────────────────────────────
//   const shortcutCategories = [
//     CATEGORIES.find(c => c.key === 'transaction'),
//     CATEGORIES.find(c => c.key === 'offplan'),
//     CATEGORIES.find(c => c.key === 'regulatory'),
//     CATEGORIES.find(c => c.key === 'investment'),
//     CATEGORIES.find(c => c.key === 'price_signal'),
//     CATEGORIES.find(c => c.key === 'foreign_buyers'),
//   ]

//   return (
//     <div style={{
//       position: 'absolute',
//       top: '12px',
//       left: '12px',
//       zIndex: 10,
//       width: '240px',
//     }}>
//       <div style={{
//         background: 'rgba(22,33,62,0.92)',
//         backdropFilter: 'blur(8px)',
//         border: '1px solid #0F3460',
//         borderRadius: '8px',
//         overflow: 'hidden',
//       }}>
//         {/* Header */}
//         <button
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           style={{
//             width: '100%',
//             display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//             padding: '8px 12px',
//             background: 'rgba(15,52,96,0.5)',
//             border: 'none',
//             borderBottom: isCollapsed ? 'none' : '1px solid #0F3460',
//             fontSize: '11px', fontWeight: 700, color: '#B87333',
//             letterSpacing: '0.8px', cursor: 'pointer',
//           }}
//         >
//           <span>◆ OVERLAYS</span>
//           <span style={{ fontSize: '10px' }}>{isCollapsed ? '▶' : '▼'}</span>
//         </button>

//         {!isCollapsed && (
//           <div style={{ padding: '8px' }}>
//             {/* Icon shortcuts */}
//             <div style={{
//               display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
//               gap: '4px', marginBottom: '10px',
//             }}>
//               {shortcutCategories.map(cat => {
//                 const active = filters.categories.includes(cat.key)
//                 return (
//                   <button
//                     key={cat.key}
//                     onClick={() => toggleCategory(cat.key)}
//                     title={cat.label}
//                     style={{
//                       padding: '6px 4px', fontSize: '16px',
//                       background: active ? cat.color + '30' : 'rgba(255,255,255,0.05)',
//                       border: `1px solid ${active ? cat.color : '#1a2a4a'}`,
//                       borderRadius: '4px', cursor: 'pointer',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     }}
//                   >{cat.icon}</button>
//                 )
//               })}
//             </div>

//             {/* Categories section */}
//             <div style={{ marginBottom: '10px' }}>
//               <button
//                 onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
//                 style={{
//                   width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                   padding: '6px 0', background: 'none', border: 'none',
//                   fontSize: '9px', fontWeight: 700, color: '#B3B3B3',
//                   letterSpacing: '0.6px', cursor: 'pointer', marginBottom: '4px',
//                 }}
//               >
//                 <span>CATEGORIES</span>
//                 <span style={{ fontSize: '9px' }}>{isCategoriesOpen ? '▼' : '▶'}</span>
//               </button>

//               {isCategoriesOpen && (
//                 <>
//                   <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
//                     <button
//                       onClick={() => updateFilters({ categories: CATEGORIES.map(c => c.key) })}
//                       style={{
//                         flex: 1, padding: '3px', fontSize: '8px', fontWeight: 600,
//                         background: 'transparent', border: '1px solid #1a2a4a',
//                         color: '#B3B3B3', borderRadius: '3px', cursor: 'pointer',
//                       }}
//                     >All On</button>
//                     <button
//                       onClick={() => updateFilters({ categories: [] })}
//                       style={{
//                         flex: 1, padding: '3px', fontSize: '8px', fontWeight: 600,
//                         background: 'transparent', border: '1px solid #1a2a4a',
//                         color: '#B3B3B3', borderRadius: '3px', cursor: 'pointer',
//                       }}
//                     >All Off</button>
//                   </div>

//                   <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '200px', overflowY: 'auto' }}>
//                     {CATEGORIES.map(cat => {
//                       const active = filters.categories.includes(cat.key)
//                       const count = countForCategory(cat.key)
//                       return (
//                         <button
//                           key={cat.key}
//                           onClick={() => toggleCategory(cat.key)}
//                           style={{
//                             display: 'flex', alignItems: 'center', gap: '6px',
//                             padding: '4px 6px', fontSize: '9px', fontWeight: 500,
//                             background: active ? cat.color + '15' : 'rgba(255,255,255,0.02)',
//                             border: `1px solid ${active ? cat.color : '#1a2a4a'}`,
//                             borderRadius: '3px', cursor: 'pointer',
//                             color: active ? cat.color : '#7a8a9a', textAlign: 'left',
//                           }}
//                         >
//                           <span style={{ width: 6, height: 6, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
//                           <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.label}</span>
//                           {count > 0 && (
//                             <span style={{
//                               fontSize: '8px', fontWeight: 700,
//                               background: cat.color + '33', color: cat.color,
//                               padding: '1px 4px', borderRadius: '6px', flexShrink: 0,
//                             }}>{count}</span>
//                           )}
//                         </button>
//                       )
//                     })}
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* Severity section */}
//             <div>
//               <button
//                 onClick={() => setIsSeverityOpen(!isSeverityOpen)}
//                 style={{
//                   width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                   padding: '6px 0', background: 'none', border: 'none',
//                   fontSize: '9px', fontWeight: 700, color: '#B3B3B3',
//                   letterSpacing: '0.6px', cursor: 'pointer', marginBottom: '4px',
//                 }}
//               >
//                 <span>SEVERITY</span>
//                 <span style={{ fontSize: '9px' }}>{isSeverityOpen ? '▼' : '▶'}</span>
//               </button>

//               {isSeverityOpen && (
//                 <div style={{ display: 'flex', gap: '3px' }}>
//                   {[1, 2, 3, 4, 5].map(s => {
//                     const active = activeSevs.includes(s)
//                     const color = SEV_COLORS[s]
//                     return (
//                       <button
//                         key={s}
//                         onClick={() => toggleSev(s)}
//                         style={{
//                           flex: 1, padding: '4px 2px',
//                           fontSize: '9px', fontWeight: 800,
//                           borderRadius: '3px', cursor: 'pointer',
//                           border: `1px solid ${active ? color : '#1a2a4a'}`,
//                           background: active ? color : 'transparent',
//                           color: active ? 'white' : '#444',
//                           letterSpacing: '0.2px',
//                         }}
//                       >{SEV_LABELS[s]}</button>
//                     )
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }













import { useState, useEffect } from 'react'
import { useEvents } from '../context/EventsContext'

const CATEGORIES = [
  { key: 'transaction', label: 'Transactions', color: '#E74C3C', icon: '🏠' },
  { key: 'offplan', label: 'Off-Plan', color: '#2980B9', icon: '🏗️' },
  { key: 'construction', label: 'Construction', color: '#F39C12', icon: '🔧' },
  { key: 'regulatory', label: 'Regulatory', color: '#8E44AD', icon: '📋' },
  { key: 'infrastructure', label: 'Infrastructure', color: '#27AE60', icon: '🚇' },
  { key: 'investment', label: 'Investment', color: '#16A085', icon: '💰' },
  { key: 'price_signal', label: 'Price Signals', color: '#E67E22', icon: '📈' },
  { key: 'freezone', label: 'Free Zones', color: '#D4AC0D', icon: '🏢' },
  { key: 'rental_yield', label: 'Rental Yield', color: '#1ABC9C', icon: '📡' },
  { key: 'foreign_buyers', label: 'Foreign Buyers', color: '#9B59B6', icon: '🌍' },
]

const SEV_COLORS = { 1: '#27AE60', 2: '#A8D44A', 3: '#F39C12', 4: '#E67E22', 5: '#E74C3C' }
const SEV_LABELS = { 1: 'S1', 2: 'S2', 3: 'S3', 4: 'S4', 5: 'S5' }

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export default function OverlayPanel() {
  const { filters, updateFilters, events } = useEvents()
  const isMobile = useIsMobile()

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true)
  const [isSeverityOpen, setIsSeverityOpen] = useState(true)
  const [activeSevs, setActiveSevs] = useState([1, 2, 3, 4, 5])

  const countForCategory = (key) => events.filter(e => e.category === key).length

  const toggleCategory = (key) => {
    const current = filters.categories
    const next = current.includes(key) ? current.filter(c => c !== key) : [...current, key]
    updateFilters({ categories: next })
  }

  const toggleSev = (s) => {
    setActiveSevs(prev => {
      if (prev.includes(s)) {
        const next = prev.filter(x => x !== s)
        return next.length === 0 ? [s] : next
      }
      return [...prev, s].sort()
    })
  }

  useEffect(() => {
    updateFilters({
      severityMin: Math.min(...activeSevs),
      severityMax: Math.max(...activeSevs),
    })
  }, [activeSevs])

  // Hide entirely on mobile — no overlay panel shown
  if (isMobile) return null

  // ── DESKTOP ───────────────────────────────────────────────────────────────
  const shortcutCategories = [
    CATEGORIES.find(c => c.key === 'transaction'),
    CATEGORIES.find(c => c.key === 'offplan'),
    CATEGORIES.find(c => c.key === 'regulatory'),
    CATEGORIES.find(c => c.key === 'investment'),
    CATEGORIES.find(c => c.key === 'price_signal'),
    CATEGORIES.find(c => c.key === 'foreign_buyers'),
  ]

  return (
    <div style={{
      position: 'absolute',
      top: '12px',
      left: '12px',
      zIndex: 10,
      width: '240px',
    }}>
      <div style={{
  background: 'var(--bg-panel)',
  backdropFilter: 'blur(8px)',
  border: '1px solid var(--border-panel)',
  borderRadius: '8px',
  overflow: 'hidden',
}}>
        {/* Header */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 12px',
           background: 'var(--panel-header-bg)',
border: 'none',
borderBottom: isCollapsed ? 'none' : '1px solid var(--border-color)',
            fontSize: '11px', fontWeight: 700, color: '#B87333',
            letterSpacing: '0.8px', cursor: 'pointer',
          }}
        >
          <span>◆ OVERLAYS</span>
          <span style={{ fontSize: '10px' }}>{isCollapsed ? '▶' : '▼'}</span>
        </button>

        {!isCollapsed && (
          <div style={{ padding: '8px' }}>
            {/* Icon shortcuts */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              gap: '4px', marginBottom: '10px',
            }}>
              {shortcutCategories.map(cat => {
                const active = filters.categories.includes(cat.key)
                return (
                  <button
                    key={cat.key}
                    onClick={() => toggleCategory(cat.key)}
                    title={cat.label}
                    style={{
                      padding: '6px 4px', fontSize: '16px',
                      background: active ? cat.color + '30' : 'var(--row-hover)',
border: `1px solid ${active ? cat.color : 'var(--border-panel)'}`,
                      borderRadius: '4px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >{cat.icon}</button>
                )
              })}
            </div>

            {/* Categories section */}
            <div style={{ marginBottom: '10px' }}>
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '6px 0', background: 'none', border: 'none',
                  fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)',
letterSpacing: '0.6px', cursor: 'pointer', marginBottom: '4px',
                }}
              >
                <span>CATEGORIES</span>
                <span style={{ fontSize: '9px' }}>{isCategoriesOpen ? '▼' : '▶'}</span>
              </button>

              {isCategoriesOpen && (
                <>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                    <button
                      onClick={() => updateFilters({ categories: CATEGORIES.map(c => c.key) })}
                      style={{
                        flex: 1, padding: '3px', fontSize: '8px', fontWeight: 600,
                       background: 'transparent', border: '1px solid var(--border-panel)',
color: 'var(--text-muted)', borderRadius: '3px', cursor: 'pointer',
                      }}
                    >All On</button>
                    <button
                      onClick={() => updateFilters({ categories: [] })}
                      style={{
                        flex: 1, padding: '3px', fontSize: '8px', fontWeight: 600,
                        background: 'transparent', border: '1px solid var(--border-panel)',
color: 'var(--text-muted)', borderRadius: '3px', cursor: 'pointer',
                      }}
                    >All Off</button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '200px', overflowY: 'auto' }}>
                    {CATEGORIES.map(cat => {
                      const active = filters.categories.includes(cat.key)
                      const count = countForCategory(cat.key)
                      return (
                        <button
                          key={cat.key}
                          onClick={() => toggleCategory(cat.key)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '4px 6px', fontSize: '9px', fontWeight: 500,
                            background: active ? cat.color + '15' : 'var(--row-hover)',
border: `1px solid ${active ? cat.color : 'var(--border-panel)'}`,
borderRadius: '3px', cursor: 'pointer',
color: active ? cat.color : 'var(--text-muted)', textAlign: 'left',
                          }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.label}</span>
                          {count > 0 && (
                            <span style={{
                              fontSize: '8px', fontWeight: 700,
                              background: cat.color + '33', color: cat.color,
                              padding: '1px 4px', borderRadius: '6px', flexShrink: 0,
                            }}>{count}</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Severity section */}
            <div>
              <button
                onClick={() => setIsSeverityOpen(!isSeverityOpen)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '6px 0', background: 'none', border: 'none',
                  fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)',
letterSpacing: '0.6px', cursor: 'pointer', marginBottom: '4px',
                }}
              >
                <span>SEVERITY</span>
                <span style={{ fontSize: '9px' }}>{isSeverityOpen ? '▼' : '▶'}</span>
              </button>

              {isSeverityOpen && (
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[1, 2, 3, 4, 5].map(s => {
                    const active = activeSevs.includes(s)
                    const color = SEV_COLORS[s]
                    return (
                      <button
                        key={s}
                        onClick={() => toggleSev(s)}
                        style={{
                          flex: 1, padding: '4px 2px',
                          fontSize: '9px', fontWeight: 800,
                          borderRadius: '3px', cursor: 'pointer',
                          border: `1px solid ${active ? color : 'var(--border-panel)'}`,
background: active ? color : 'transparent',
color: active ? 'white' : 'var(--text-muted)',
                          letterSpacing: '0.2px',
                        }}
                      >{SEV_LABELS[s]}</button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
