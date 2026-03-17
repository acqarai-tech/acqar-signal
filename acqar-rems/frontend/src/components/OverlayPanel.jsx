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
  const { filters, updateFilters, events, mapStyle, setMapStyle } = useEvents()
  const isMobile = useIsMobile()

  // Desktop: collapsible panel
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true)
  const [isSeverityOpen, setIsSeverityOpen] = useState(true)
  const [activeSevs, setActiveSevs] = useState([1, 2, 3, 4, 5])

  // Mobile: compact pill button + bottom drawer
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileTab, setMobileTab] = useState('categories') // 'categories' | 'severity'

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

  const activeCount = filters.categories.length

  // ── MOBILE LAYOUT ────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        {/* Compact filter pill — top-left of map */}
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 20,
          display: 'flex',
          gap: '6px',
        }}>
          <button
            onClick={() => setMobileOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '7px 12px',
              background: 'rgba(22,33,62,0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #0F3460',
              borderRadius: '20px',
              color: '#B87333',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ fontSize: '12px' }}>◈</span>
            <span>FILTERS</span>
            {activeCount < CATEGORIES.length && (
              <span style={{
                background: '#B87333', color: '#0D1B2A',
                fontSize: '9px', fontWeight: 800,
                padding: '1px 5px', borderRadius: '8px',
              }}>{activeCount}</span>
            )}
          </button>

          {/* Severity quick-badges */}
          <div style={{
            display: 'flex', gap: '3px', alignItems: 'center',
            background: 'rgba(22,33,62,0.92)',
            backdropFilter: 'blur(8px)',
            border: '1px solid #0F3460',
            borderRadius: '20px',
            padding: '5px 8px',
          }}>
            {[1, 2, 3, 4, 5].map(s => {
              const active = activeSevs.includes(s)
              const color = SEV_COLORS[s]
              return (
                <button
                  key={s}
                  onClick={() => toggleSev(s)}
                  style={{
                    width: 22, height: 22,
                    fontSize: '8px', fontWeight: 800,
                    borderRadius: '4px',
                    border: `1px solid ${active ? color : '#1a2a4a'}`,
                    background: active ? color : 'transparent',
                    color: active ? '#fff' : '#444',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >{s}</button>
              )
            })}
          </div>
        </div>

        {/* Backdrop */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 29,
              backdropFilter: 'blur(2px)',
            }}
          />
        )}

        {/* Bottom drawer */}
        <div style={{
          position: 'absolute',
          bottom: mobileOpen ? 0 : '-110%',
          left: 0, right: 0,
          zIndex: 30,
          background: 'rgba(22,33,62,0.97)',
          backdropFilter: 'blur(10px)',
          border: '1px solid #0F3460',
          borderRadius: '16px 16px 0 0',
          transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1)',
          maxHeight: '70%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
        }}>
          {/* Drawer header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px 0',
            flexShrink: 0,
          }}>
            {/* Drag handle */}
            <div style={{
              position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
              width: 36, height: 4, borderRadius: 2, background: '#1e3a5a',
            }} />

            <span style={{ fontSize: '12px', fontWeight: 800, color: '#B87333', letterSpacing: '0.8px' }}>◆ OVERLAYS</span>
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                width: 32, height: 32, background: '#1f3455',
                border: '1px solid #0F3460', borderRadius: '8px',
                color: '#B3B3B3', cursor: 'pointer', fontSize: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                touchAction: 'manipulation',
              }}
            >✕</button>
          </div>

          {/* Tab bar */}
          <div style={{
            display: 'flex', borderBottom: '1px solid #0F3460',
            padding: '8px 16px 0',
            gap: '4px',
            flexShrink: 0,
          }}>
            {['categories', 'severity'].map(tab => (
              <button
                key={tab}
                onClick={() => setMobileTab(tab)}
                style={{
                  flex: 1,
                  padding: '7px',
                  fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  border: 'none', background: 'transparent',
                  color: mobileTab === tab ? '#B87333' : '#555',
                  borderBottom: mobileTab === tab ? '2px solid #B87333' : '2px solid transparent',
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                }}
              >{tab}</button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>

            {/* Categories tab */}
            {mobileTab === 'categories' && (
              <>
                {/* All On / All Off */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                  <button
                    onClick={() => updateFilters({ categories: CATEGORIES.map(c => c.key) })}
                    style={{
                      flex: 1, padding: '6px',
                      fontSize: '11px', fontWeight: 600,
                      background: 'transparent',
                      border: '1px solid #1a2a4a',
                      color: '#B3B3B3', borderRadius: '6px', cursor: 'pointer',
                    }}
                  >All On</button>
                  <button
                    onClick={() => updateFilters({ categories: [] })}
                    style={{
                      flex: 1, padding: '6px',
                      fontSize: '11px', fontWeight: 600,
                      background: 'transparent',
                      border: '1px solid #1a2a4a',
                      color: '#B3B3B3', borderRadius: '6px', cursor: 'pointer',
                    }}
                  >All Off</button>
                </div>

                {/* Icon shortcuts — 2 cols on mobile */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '6px',
                  marginBottom: '10px',
                }}>
                  {CATEGORIES.slice(0, 10).map(cat => {
                    const active = filters.categories.includes(cat.key)
                    return (
                      <button
                        key={cat.key}
                        onClick={() => toggleCategory(cat.key)}
                        title={cat.label}
                        style={{
                          padding: '8px 4px',
                          fontSize: '18px',
                          background: active ? cat.color + '30' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${active ? cat.color : '#1a2a4a'}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          touchAction: 'manipulation',
                        }}
                      >{cat.icon}</button>
                    )
                  })}
                </div>

                {/* Full list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {CATEGORIES.map(cat => {
                    const active = filters.categories.includes(cat.key)
                    const count = countForCategory(cat.key)
                    return (
                      <button
                        key={cat.key}
                        onClick={() => toggleCategory(cat.key)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '8px 10px',
                          fontSize: '12px', fontWeight: 500,
                          background: active ? cat.color + '15' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${active ? cat.color : '#1a2a4a'}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          color: active ? cat.color : '#7a8a9a',
                          textAlign: 'left',
                          touchAction: 'manipulation',
                        }}
                      >
                        <span style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: cat.color, flexShrink: 0,
                        }} />
                        <span style={{ flex: 1 }}>{cat.label}</span>
                        <span style={{ fontSize: '11px' }}>{cat.icon}</span>
                        {count > 0 && (
                          <span style={{
                            fontSize: '10px', fontWeight: 700,
                            background: cat.color + '33', color: cat.color,
                            padding: '1px 6px', borderRadius: '8px', flexShrink: 0,
                          }}>{count}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {/* Severity tab */}
            {mobileTab === 'severity' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map(s => {
                  const active = activeSevs.includes(s)
                  const color = SEV_COLORS[s]
                  const labels = {
                    1: 'Minimal — informational only',
                    2: 'Low — minor market movement',
                    3: 'Medium — notable activity',
                    4: 'High — significant event',
                    5: 'Critical — major market impact',
                  }
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSev(s)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${active ? color : '#1a2a4a'}`,
                        background: active ? color + '18' : 'transparent',
                        cursor: 'pointer',
                        touchAction: 'manipulation',
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: '6px',
                        background: active ? color : 'transparent',
                        border: `2px solid ${color}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 800,
                        color: active ? '#fff' : color,
                        flexShrink: 0,
                        transition: 'all 0.15s',
                      }}>S{s}</div>
                      <span style={{
                        fontSize: '12px', color: active ? '#FAFAFA' : '#7a8a9a',
                        textAlign: 'left',
                      }}>{labels[s]}</span>
                      {active && (
                        <span style={{ marginLeft: 'auto', color, fontSize: '14px' }}>✓</span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

  // ── DESKTOP LAYOUT (unchanged) ───────────────────────────────────────────
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
        background: 'rgba(22,33,62,0.92)',
        backdropFilter: 'blur(8px)',
        border: '1px solid #0F3460',
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
            background: 'rgba(15,52,96,0.5)',
            border: 'none',
            borderBottom: isCollapsed ? 'none' : '1px solid #0F3460',
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
                      background: active ? cat.color + '30' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${active ? cat.color : '#1a2a4a'}`,
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
                  fontSize: '9px', fontWeight: 700, color: '#B3B3B3',
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
                        background: 'transparent', border: '1px solid #1a2a4a',
                        color: '#B3B3B3', borderRadius: '3px', cursor: 'pointer',
                      }}
                    >All On</button>
                    <button
                      onClick={() => updateFilters({ categories: [] })}
                      style={{
                        flex: 1, padding: '3px', fontSize: '8px', fontWeight: 600,
                        background: 'transparent', border: '1px solid #1a2a4a',
                        color: '#B3B3B3', borderRadius: '3px', cursor: 'pointer',
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
                            background: active ? cat.color + '15' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${active ? cat.color : '#1a2a4a'}`,
                            borderRadius: '3px', cursor: 'pointer',
                            color: active ? cat.color : '#7a8a9a', textAlign: 'left',
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
                  fontSize: '9px', fontWeight: 700, color: '#B3B3B3',
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
                          border: `1px solid ${active ? color : '#1a2a4a'}`,
                          background: active ? color : 'transparent',
                          color: active ? 'white' : '#444',
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
