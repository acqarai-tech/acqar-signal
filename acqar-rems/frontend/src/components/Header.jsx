// import { useEffect, useRef, useState } from 'react'
// import { useSocket } from '../context/SocketContext'
// import SignalRow from './SignalRow'

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// async function fetchPredictions() {
//   try {
//     const queries = [
//       'Federal Reserve rate cut',
//       'oil price OPEC 2025',
//       'US recession 2025',
//       'inflation CPI',
//       'mortgage rate',
//     ]
//     const results = []
//     const seenIds = new Set()
//     await Promise.allSettled(
//       queries.map(async (q) => {
//         const url = `https://api.manifold.markets/v0/search-markets?term=${encodeURIComponent(q)}&limit=3&sort=score&filter=open`
//         const res = await fetch(url)
//         if (!res.ok) return
//         const data = await res.json()
//         for (const m of data) {
//           if (seenIds.has(m.id) || m.isResolved) continue
//           seenIds.add(m.id)
//           results.push({
//             id: m.id,
//             question: m.question,
//             pct: Math.round((m.probability || 0.5) * 100 * 10) / 10,
//             source: 'Manifold',
//             url: m.url || 'https://manifold.markets',
//             is_real: true,
//           })
//         }
//       })
//     )
//     if (results.length >= 3) return results
//   } catch (_) {}

//   try {
//     const polyQueries = ['Federal Reserve', 'inflation', 'oil', 'interest rate']
//     const results = []
//     const seenIds = new Set()
//     await Promise.allSettled(
//       polyQueries.map(async (q) => {
//         const url = `https://gamma-api.polymarket.com/events?q=${encodeURIComponent(q)}&active=true&closed=false&limit=3`
//         const res = await fetch(url)
//         if (!res.ok) return
//         const events = await res.json()
//         for (const ev of events) {
//           for (const m of ev.markets || []) {
//             if (seenIds.has(m.id) || !m.question) continue
//             seenIds.add(m.id)
//             let pct = 50
//             try {
//               const outcomes = typeof m.outcomes === 'string' ? JSON.parse(m.outcomes) : (m.outcomes || [])
//               const prices = typeof m.outcomePrices === 'string' ? JSON.parse(m.outcomePrices) : (m.outcomePrices || [])
//               const yi = outcomes.findIndex(o => String(o).toLowerCase() === 'yes')
//               if (yi >= 0 && prices[yi] != null) pct = Math.round(parseFloat(prices[yi]) * 100 * 10) / 10
//               else if (prices[0] != null) pct = Math.round(parseFloat(prices[0]) * 100 * 10) / 10
//             } catch (_) {}
//             results.push({
//               id: String(m.id),
//               question: m.question,
//               pct,
//               source: 'Polymarket',
//               url: `https://polymarket.com/event/${ev.slug || ''}`,
//               is_real: true,
//             })
//           }
//         }
//       })
//     )
//     if (results.length >= 3) return results
//   } catch (_) {}

//   const res = await fetch(`${API_URL}/api/market/predictions`)
//   if (!res.ok) throw new Error('Backend predictions unavailable')
//   const data = await res.json()
//   return data.predictions || []
// }

// // ── Replace with your real auth context/hook ──
// const USER_NAME = 'Signal User'

// function getInitials(name) {
//   const parts = (name || '').trim().split(/\s+/).filter(Boolean)
//   const a = (parts[0] || 'A')[0] || 'A'
//   const b = (parts[1] || parts[0] || 'M')[0] || 'M'
//   return (a + b).toUpperCase()
// }

// const NAV_CSS = `
//   .hdr-topNav {
//     height: 58px;
//     background: #FFFFFF;
//     border-bottom: 1px solid #EAEAEA;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     padding: 0 28px;
//   }

//   .hdr-navLeft {
//     display: flex;
//     align-items: center;
//     gap: 44px;
//     min-width: 0;
//   }

//   .hdr-navBrand {
//     font-size: 14px;
//     font-weight: 900;
//     letter-spacing: 0.16em;
//     color: #1a1a1a;
//     cursor: pointer;
//     text-transform: uppercase;
//     line-height: 1;
//   }

//   .hdr-navLinks {
//     display: flex;
//     gap: 26px;
//     align-items: stretch;
//     height: 58px;
//   }

//   .hdr-navLink {
//     font-size: 10px;
//     font-weight: 800;
//     letter-spacing: 0.14em;
//     color: rgba(26,26,26,0.55);
//     cursor: pointer;
//     text-transform: uppercase;
//     line-height: 1;
//     padding: 0 2px;
//     display: flex;
//     align-items: center;
//     position: relative;
//     user-select: none;
//     border: none;
//     border-bottom: 2px solid transparent;
//     background: transparent;
//     transition: color 0.15s;
//     white-space: nowrap;
//   }

//   .hdr-navLink:hover { color: rgba(26,26,26,0.85); }

//   .hdr-navLink.active {
//     color: #1a1a1a;
//     border-bottom-color: #1a1a1a;
//   }

//   .hdr-navRight {
//     display: flex;
//     align-items: center;
//     gap: 16px;
//   }

//   .hdr-bellBtn {
//     width: 34px;
//     height: 34px;
//     border-radius: 999px;
//     background: transparent;
//     border: none;
//     display: grid;
//     place-items: center;
//     cursor: pointer;
//     position: relative;
//     padding: 0;
//   }

//   .hdr-bellIcon {
//     width: 16px;
//     height: 16px;
//     color: rgba(26,26,26,0.75);
//   }

//   .hdr-profileWrap { position: relative; }

//   .hdr-profileBtn {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     cursor: pointer;
//     border: none;
//     background: transparent;
//     padding: 4px 0;
//   }

//   .hdr-profileMeta {
//     display: flex;
//     flex-direction: column;
//     align-items: flex-end;
//     line-height: 1.05;
//   }

//   .hdr-profileName {
//     font-size: 10px;
//     font-weight: 800;
//     letter-spacing: 0.12em;
//     text-transform: uppercase;
//     color: #1a1a1a;
//     white-space: nowrap;
//     max-width: 200px;
//     overflow: hidden;
//     text-overflow: ellipsis;
//   }

//   .hdr-profileAvatar {
//     width: 28px;
//     height: 28px;
//     border-radius: 999px;
//     background: #B87333;
//     display: grid;
//     place-items: center;
//     color: #fff;
//     font-size: 10px;
//     font-weight: 900;
//     letter-spacing: 0.06em;
//     text-transform: uppercase;
//     flex-shrink: 0;
//   }

//   .hdr-caret {
//     width: 14px;
//     height: 14px;
//     color: rgba(26,26,26,0.55);
//     margin-left: 2px;
//     flex-shrink: 0;
//   }

//   .hdr-menu {
//     position: absolute;
//     top: calc(100% + 10px);
//     right: 0;
//     width: 220px;
//     background: #fff;
//     border: 1px solid #EAEAEA;
//     border-radius: 12px;
//     box-shadow: 0 18px 40px rgba(0,0,0,0.10);
//     overflow: hidden;
//     z-index: 200;
//   }

//   .hdr-menuTop {
//     padding: 14px 16px 12px;
//     border-bottom: 1px solid #EFEFEF;
//     background: #fff;
//   }

//   .hdr-menuTopLabel {
//     font-size: 9px;
//     font-weight: 900;
//     letter-spacing: 0.18em;
//     color: rgba(26,26,26,0.35);
//     text-transform: uppercase;
//     margin-bottom: 8px;
//   }

//   .hdr-menuName {
//     font-size: 13px;
//     font-weight: 900;
//     font-style: italic;
//     color: #1a1a1a;
//     text-transform: uppercase;
//     letter-spacing: 0.02em;
//     margin-bottom: 4px;
//     line-height: 1.1;
//   }

//   .hdr-menuTier {
//     font-size: 9px;
//     font-weight: 900;
//     letter-spacing: 0.14em;
//     color: #B87333;
//     text-transform: uppercase;
//     line-height: 1.1;
//   }

//   .hdr-menuList { padding: 8px 0; }

//   .hdr-menuItem {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     padding: 11px 16px;
//     cursor: pointer;
//     user-select: none;
//     transition: background 0.14s;
//   }

//   .hdr-menuItem:hover { background: #FAFAFA; }

//   .hdr-menuIcon {
//     width: 16px;
//     height: 16px;
//     color: rgba(26,26,26,0.55);
//     flex-shrink: 0;
//   }

//   .hdr-menuText {
//     font-size: 10px;
//     font-weight: 900;
//     letter-spacing: 0.14em;
//     color: #1a1a1a;
//     text-transform: uppercase;
//   }

//   .hdr-menuDivider { height: 1px; background: #EFEFEF; margin: 8px 0; }

//   .hdr-menuSignout {
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     gap: 8px;
//     padding: 12px 16px 14px;
//     cursor: pointer;
//     color: #FF4D4D;
//     font-size: 10px;
//     font-weight: 900;
//     letter-spacing: 0.18em;
//     text-transform: uppercase;
//     user-select: none;
//     transition: background 0.14s;
//   }

//   .hdr-menuSignout:hover { background: #FFF6F6; }
//   .hdr-menuSignout svg { width: 16px; height: 16px; color: #FF4D4D; }

//   @media (max-width: 768px) {
//     .hdr-navLinks { display: none; }
//     .hdr-profileMeta { display: none; }
//     .hdr-topNav { padding: 0 16px; }
//   }

//   @keyframes hdrLivePulse {
//     0%, 100% { opacity: 1; transform: scale(1); }
//     50% { opacity: 0.5; transform: scale(1.3); }
//   }
// `

// export default function Header() {
//   const { isConnected } = useSocket()

//   const [predictions, setPredictions] = useState([])
//   const [predLoading, setPredLoading] = useState(true)
//   const tickerRef = useRef(null)
//   const animRef = useRef(null)
//   const posRef = useRef(0)
//   const menuWrapRef = useRef(null)
//   const [menuOpen, setMenuOpen] = useState(false)

//   const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
//   useEffect(() => {
//     const handler = () => setIsMobile(window.innerWidth < 768)
//     window.addEventListener('resize', handler)
//     return () => window.removeEventListener('resize', handler)
//   }, [])

//   useEffect(() => {
//     function onKey(e) { if (e.key === 'Escape') setMenuOpen(false) }
//     function onClickOutside(e) {
//       if (menuWrapRef.current && !menuWrapRef.current.contains(e.target)) setMenuOpen(false)
//     }
//     window.addEventListener('keydown', onKey)
//     window.addEventListener('mousedown', onClickOutside)
//     return () => {
//       window.removeEventListener('keydown', onKey)
//       window.removeEventListener('mousedown', onClickOutside)
//     }
//   }, [])

//   useEffect(() => {
//     let cancelled = false
//     const load = async () => {
//       try {
//         const data = await fetchPredictions()
//         if (!cancelled) { setPredictions(data); setPredLoading(false); posRef.current = 0 }
//       } catch (_) {
//         if (!cancelled) setPredLoading(false)
//       }
//     }
//     load()
//     const interval = setInterval(load, 5 * 60 * 1000)
//     return () => { cancelled = true; clearInterval(interval) }
//   }, [])

//   useEffect(() => {
//     if (!tickerRef.current || predictions.length === 0) return
//     const el = tickerRef.current
//     const speed = 0.4
//     const animate = () => {
//       posRef.current -= speed
//       const halfWidth = el.scrollWidth / 2
//       if (Math.abs(posRef.current) >= halfWidth) posRef.current = 0
//       el.style.transform = `translateX(${posRef.current}px)`
//       animRef.current = requestAnimationFrame(animate)
//     }
//     animRef.current = requestAnimationFrame(animate)
//     return () => cancelAnimationFrame(animRef.current)
//   }, [predictions])

//   const isRealData = predictions.some(p => p.is_real)
//   const sourceLabel = predictions.length > 0
//     ? (isRealData ? (predictions[0].source === 'Polymarket' ? 'POLYMARKET' : 'MANIFOLD') : 'ACQAR SIGNAL')
//     : 'SIGNAL'

//   const path = typeof window !== 'undefined' ? window.location.pathname : ''
//   const isDash = path === '/dashboard' || path === '/'
//   const isReports = path === '/my-reports'
//   const isSettings = path === '/settings'

//   const initials = getInitials(USER_NAME)

//   return (
//     <>
//       <style>{NAV_CSS}</style>

//       <header style={{
//         background: '#FFFFFF',
//         borderBottom: '1px solid #E8E8E8',
//         display: 'flex',
//         flexDirection: 'column',
//         flexShrink: 0,
//         zIndex: 20,
//       }}>

//         {/* ── Main nav row ── */}
//         <div className="hdr-topNav">

//           <div className="hdr-navLeft">
//             {/* Brand */}
//             <div className="hdr-navBrand" onClick={() => window.location.href = '/'}>
//               <span style={{ color: '#B87333' }}>ACQ</span>
//               <span style={{ color: '#111111' }}>AR</span>
//             </div>

//             {/* Nav links */}
//             <nav className="hdr-navLinks">
//               {[
//                 { label: 'TERMINAL', active: isDash, href: '/dashboard' },
//                 { label: 'MY REPORTS', active: isReports, href: 'https://www.acqar.com/my-reports' },
//                 { label: 'SETTINGS', active: isSettings, href: 'https://www.acqar.com/settings' },
//               ].map(({ label, active, href }) => (
//                 <button
//                   key={label}
//                   className={`hdr-navLink${active ? ' active' : ''}`}
//                   onClick={() => window.location.href = href}
//                 >
//                   {label}
//                 </button>
//               ))}
//             </nav>
//           </div>

//           {/* Right side */}
//           <div className="hdr-navRight" ref={menuWrapRef}>

//             {/* Bell */}
//             <button className="hdr-bellBtn" type="button" aria-label="Notifications">
//               <svg className="hdr-bellIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7"/>
//                 <path d="M13.73 21a2 2 0 01-3.46 0"/>
//               </svg>
//             </button>

//             {/* Profile */}
//             <div className="hdr-profileWrap">
//               <button
//                 type="button"
//                 className="hdr-profileBtn"
//                 onClick={() => setMenuOpen(v => !v)}
//                 aria-haspopup="menu"
//                 aria-expanded={menuOpen ? 'true' : 'false'}
//               >
//                 <div className="hdr-profileMeta">
//                   <div className="hdr-profileName">{USER_NAME}</div>
//                 </div>
//                 <div className="hdr-profileAvatar">{initials}</div>
//                 <svg className="hdr-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <polyline points="6 9 12 15 18 9"/>
//                 </svg>
//               </button>

//               {menuOpen && (
//                 <div className="hdr-menu" role="menu">
//                   <div className="hdr-menuTop">
//                     <div className="hdr-menuTopLabel">Authenticated Account</div>
//                     <div className="hdr-menuName">{USER_NAME}</div>
//                     <div className="hdr-menuTier">VALUCHECK™ Premium Member</div>
//                   </div>

//                   <div className="hdr-menuList">
//                     <div className="hdr-menuItem" role="menuitem" onClick={() => { setMenuOpen(false); window.location.href = '/dashboard' }}>
//                       <svg className="hdr-menuIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>
//                       </svg>
//                       <div className="hdr-menuText">Terminal</div>
//                     </div>

//                     <div className="hdr-menuItem" role="menuitem" onClick={() => { setMenuOpen(false); window.location.href = 'https://www.acqar.com/my-reports' }}>
//                       <svg className="hdr-menuIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
//                         <path d="M14 2v6h6"/>
//                       </svg>
//                       <div className="hdr-menuText">My Reports</div>
//                     </div>

//                     <div className="hdr-menuItem" role="menuitem" onClick={() => { setMenuOpen(false); window.location.href = 'https://www.acqar.com/settings' }}>
//                       <svg className="hdr-menuIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z"/>
//                         <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.05.05a2 2 0 0 1-1.41 3.41h-.1a1.7 1.7 0 0 0-1.6 1.16 1.7 1.7 0 0 0-.37.62 2 2 0 0 1-3.82 0 1.7 1.7 0 0 0-.37-.62 1.7 1.7 0 0 0-1.6-1.16H9.5a2 2 0 0 1-1.41-3.41l.05-.05A1.7 1.7 0 0 0 8.6 15a1.7 1.7 0 0 0-1.06-1.6l-.06-.03a2 2 0 0 1 0-3.74l.06-.03A1.7 1.7 0 0 0 8.6 9a1.7 1.7 0 0 0-.34-1.87l-.05-.05A2 2 0 0 1 9.62 3.7h.1a1.7 1.7 0 0 0 1.6-1.16 2 2 0 0 1 3.82 0 1.7 1.7 0 0 0 1.6 1.16h.1A2 2 0 0 1 21 6.98l-.05.05A1.7 1.7 0 0 0 20.6 9a1.7 1.7 0 0 0 1.06 1.6l.06.03a2 2 0 0 1 0 3.74l-.06.03A1.7 1.7 0 0 0 19.4 15z"/>
//                       </svg>
//                       <div className="hdr-menuText">Account Settings</div>
//                     </div>

//                     <div className="hdr-menuDivider" />

//                     <div className="hdr-menuSignout" role="menuitem" onClick={() => setMenuOpen(false)}>
//                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M10 17l5-5-5-5"/>
//                         <path d="M15 12H3"/>
//                         <path d="M21 3v18"/>
//                       </svg>
//                       SIGN OUT
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ── Prediction Ticker Strip ── */}
//         <div style={{
//           height: '26px',
//           borderTop: '1px solid #0F3460',
//           background: '#0D1B30',
//           display: 'flex',
//           alignItems: 'center',
//           overflow: 'hidden',
//           position: 'relative',
//         }}>
//           <div style={{
//             flexShrink: 0,
//             paddingLeft: isMobile ? '6px' : '10px',
//             paddingRight: isMobile ? '6px' : '8px',
//             fontSize: isMobile ? '8px' : '9px',
//             fontWeight: 800,
//             color: '#B87333',
//             letterSpacing: '0.8px',
//             borderRight: '1px solid #0F3460',
//             height: '100%',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '4px',
//             background: '#0D1B30',
//             zIndex: 2,
//             whiteSpace: 'nowrap',
//           }}>
//             <span style={{
//               display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
//               background: isRealData ? '#27AE60' : '#B87333',
//               animation: isRealData ? 'hdrLivePulse 2s infinite' : 'none',
//             }} />
//             {isMobile ? (isRealData ? (predictions[0]?.source === 'Polymarket' ? 'POLY' : 'MFLD') : 'SIG') : sourceLabel}
//           </div>

//           <div style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '100%' }}>
//             {predLoading ? (
//               <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', paddingLeft: '12px', fontSize: '10px', color: '#555' }}>
//                 Loading predictions...
//               </div>
//             ) : predictions.length === 0 ? (
//               <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', paddingLeft: '12px', fontSize: '10px', color: '#555' }}>
//                 No predictions available
//               </div>
//             ) : (
//               <div ref={tickerRef} style={{ display: 'inline-flex', alignItems: 'center', height: '100%', whiteSpace: 'nowrap', willChange: 'transform' }}>
//                 {[...predictions, ...predictions].map((p, i) => (
//                   <PredictionItem key={`${p.id}-${i}`} prediction={p} isMobile={isMobile} />
//                 ))}
//               </div>
//             )}
//             <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '100%', background: 'linear-gradient(to right, #0D1B30, transparent)', pointerEvents: 'none' }} />
//             <div style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '100%', background: 'linear-gradient(to left, #0D1B30, transparent)', pointerEvents: 'none' }} />
//           </div>
//         </div>

//         {/* ── Signal Row ── */}
//         <SignalRow />
//       </header>
//     </>
//   )
// }

// function PredictionItem({ prediction, isMobile }) {
//   const { question, pct, source, url, is_real } = prediction
//   const color = pct >= 65 ? '#27AE60' : pct <= 35 ? '#E74C3C' : '#F39C12'
//   const maxLen = isMobile ? 38 : 55
//   const short = question.length > maxLen ? question.slice(0, maxLen - 3) + '...' : question

//   return (
//     <a
//       href={url || undefined}
//       target="_blank"
//       rel="noopener noreferrer"
//       style={{
//         display: 'inline-flex', alignItems: 'center', gap: isMobile ? '5px' : '7px',
//         padding: isMobile ? '0 10px' : '0 16px', height: '100%',
//         textDecoration: 'none',
//         borderRight: '1px solid #0F3460',
//         cursor: url ? 'pointer' : 'default',
//         transition: 'background 0.15s',
//       }}
//       onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
//       onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
//     >
//       <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: 800, color, minWidth: '32px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
//       <span style={{ fontSize: '8px', fontWeight: 700, color, opacity: 0.7, padding: '1px 3px', border: `1px solid ${color}44`, borderRadius: '2px' }}>YES</span>
//       <span style={{ fontSize: isMobile ? '9px' : '10px', color: '#B3B3B3', letterSpacing: '0.1px' }}>{short}</span>
//       {is_real && !isMobile && (
//         <span style={{ fontSize: '8px', color: '#555', fontWeight: 600, padding: '1px 4px', background: 'rgba(255,255,255,0.04)', borderRadius: '2px', flexShrink: 0 }}>{source}</span>
//       )}
//       <span style={{ color: '#1A2040', fontSize: '10px', marginLeft: '4px' }}>◆</span>
//     </a>
//   )
// }



import { useEffect, useRef, useState } from 'react'
import { useSocket } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import SignalRow from './SignalRow'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function fetchPredictions() {
  try {
    const queries = [
      'Federal Reserve rate cut',
      'oil price OPEC 2025',
      'US recession 2025',
      'inflation CPI',
      'mortgage rate',
    ]
    const results = []
    const seenIds = new Set()
    await Promise.allSettled(
      queries.map(async (q) => {
        const url = `https://api.manifold.markets/v0/search-markets?term=${encodeURIComponent(q)}&limit=3&sort=score&filter=open`
        const res = await fetch(url)
        if (!res.ok) return
        const data = await res.json()
        for (const m of data) {
          if (seenIds.has(m.id) || m.isResolved) continue
          seenIds.add(m.id)
          results.push({
            id: m.id,
            question: m.question,
            pct: Math.round((m.probability || 0.5) * 100 * 10) / 10,
            source: 'Manifold',
            url: m.url || 'https://manifold.markets',
            is_real: true,
          })
        }
      })
    )
    if (results.length >= 3) return results
  } catch (_) {}

  try {
    const polyQueries = ['Federal Reserve', 'inflation', 'oil', 'interest rate']
    const results = []
    const seenIds = new Set()
    await Promise.allSettled(
      polyQueries.map(async (q) => {
        const url = `https://gamma-api.polymarket.com/events?q=${encodeURIComponent(q)}&active=true&closed=false&limit=3`
        const res = await fetch(url)
        if (!res.ok) return
        const events = await res.json()
        for (const ev of events) {
          for (const m of ev.markets || []) {
            if (seenIds.has(m.id) || !m.question) continue
            seenIds.add(m.id)
            let pct = 50
            try {
              const outcomes = typeof m.outcomes === 'string' ? JSON.parse(m.outcomes) : (m.outcomes || [])
              const prices = typeof m.outcomePrices === 'string' ? JSON.parse(m.outcomePrices) : (m.outcomePrices || [])
              const yi = outcomes.findIndex(o => String(o).toLowerCase() === 'yes')
              if (yi >= 0 && prices[yi] != null) pct = Math.round(parseFloat(prices[yi]) * 100 * 10) / 10
              else if (prices[0] != null) pct = Math.round(parseFloat(prices[0]) * 100 * 10) / 10
            } catch (_) {}
            results.push({
              id: String(m.id),
              question: m.question,
              pct,
              source: 'Polymarket',
              url: `https://polymarket.com/event/${ev.slug || ''}`,
              is_real: true,
            })
          }
        }
      })
    )
    if (results.length >= 3) return results
  } catch (_) {}

  const res = await fetch(`${API_URL}/api/market/predictions`)
  if (!res.ok) throw new Error('Backend predictions unavailable')
  const data = await res.json()
  return data.predictions || []
}

function getInitials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean)
  const a = (parts[0] || 'A')[0] || 'A'
  const b = (parts[1] || parts[0] || 'M')[0] || 'M'
  return (a + b).toUpperCase()
}

const NAV_CSS = `
  .hdr-topNav {
    height: 58px;
    background: #FFFFFF;
    border-bottom: 1px solid #EAEAEA;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
  }

  .hdr-navLeft {
    display: flex;
    align-items: center;
    gap: 44px;
    min-width: 0;
  }

  .hdr-navBrand {
    font-size: 14px;
    font-weight: 900;
    letter-spacing: 0.16em;
    color: #1a1a1a;
    cursor: pointer;
    text-transform: uppercase;
    line-height: 1;
  }

  .hdr-navLinks {
    display: flex;
    gap: 26px;
    align-items: stretch;
    height: 58px;
  }

  .hdr-navLink {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.14em;
    color: rgba(26,26,26,0.55);
    cursor: pointer;
    text-transform: uppercase;
    line-height: 1;
    padding: 0 2px;
    display: flex;
    align-items: center;
    position: relative;
    user-select: none;
    border: none;
    border-bottom: 2px solid transparent;
    background: transparent;
    transition: color 0.15s;
    white-space: nowrap;
  }

  .hdr-navLink:hover { color: rgba(26,26,26,0.85); }

  .hdr-navLink.active {
    color: #1a1a1a;
    border-bottom-color: #1a1a1a;
  }

  .hdr-navRight {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .hdr-bellBtn {
    width: 34px;
    height: 34px;
    border-radius: 999px;
    background: transparent;
    border: none;
    display: grid;
    place-items: center;
    cursor: pointer;
    position: relative;
    padding: 0;
  }

  .hdr-bellIcon {
    width: 16px;
    height: 16px;
    color: rgba(26,26,26,0.75);
  }

  .hdr-profileWrap { position: relative; }

  .hdr-profileBtn {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    border: none;
    background: transparent;
    padding: 4px 0;
  }

  .hdr-profileMeta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1.05;
  }

  .hdr-profileName {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #1a1a1a;
    white-space: nowrap;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hdr-profileAvatar {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    background: #B87333;
    display: grid;
    place-items: center;
    color: #fff;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    flex-shrink: 0;
  }

  .hdr-caret {
    width: 14px;
    height: 14px;
    color: rgba(26,26,26,0.55);
    margin-left: 2px;
    flex-shrink: 0;
  }

  .hdr-menu {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 220px;
    background: #fff;
    border: 1px solid #EAEAEA;
    border-radius: 12px;
    box-shadow: 0 18px 40px rgba(0,0,0,0.10);
    overflow: hidden;
    z-index: 200;
  }

  .hdr-menuTop {
    padding: 14px 16px 12px;
    border-bottom: 1px solid #EFEFEF;
    background: #fff;
  }

  .hdr-menuTopLabel {
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.18em;
    color: rgba(26,26,26,0.35);
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .hdr-menuName {
    font-size: 13px;
    font-weight: 900;
    font-style: italic;
    color: #1a1a1a;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    margin-bottom: 4px;
    line-height: 1.1;
  }

  .hdr-menuEmail {
    font-size: 10px;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 4px;
    line-height: 1.1;
    text-transform: none;
    letter-spacing: 0;
  }

  .hdr-menuTier {
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.14em;
    color: #B87333;
    text-transform: uppercase;
    line-height: 1.1;
  }

  .hdr-menuList { padding: 8px 0; }

  .hdr-menuItem {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 16px;
    cursor: pointer;
    user-select: none;
    transition: background 0.14s;
  }

  .hdr-menuItem:hover { background: #FAFAFA; }

  .hdr-menuIcon {
    width: 16px;
    height: 16px;
    color: rgba(26,26,26,0.55);
    flex-shrink: 0;
  }

  .hdr-menuText {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.14em;
    color: #1a1a1a;
    text-transform: uppercase;
  }

  .hdr-menuDivider { height: 1px; background: #EFEFEF; margin: 8px 0; }

  .hdr-menuSignout {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px 14px;
    cursor: pointer;
    color: #FF4D4D;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    user-select: none;
    transition: background 0.14s;
  }

  .hdr-menuSignout:hover { background: #FFF6F6; }
  .hdr-menuSignout svg { width: 16px; height: 16px; color: #FF4D4D; }

  @media (max-width: 768px) {
    .hdr-navLinks { display: none; }
    .hdr-profileMeta { display: none; }
    .hdr-topNav { padding: 0 16px; }
  }

  @keyframes hdrLivePulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.3); }
  }
`

export default function Header() {
  const { isConnected } = useSocket()
  const navigate = useNavigate()

  // ── Real logged-in user from Supabase ──
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // Get current session on mount
    supabase.auth.getSession().then(({ data }) => {
      const user = data?.session?.user ?? null
      if (user) {
        setCurrentUser(user)
      } else {
        // Check admin login
        const isAdmin = localStorage.getItem('admin_auth') === 'true'
        if (isAdmin) {
          setCurrentUser({ email: 'admin@acqar.com', user_metadata: { name: 'Admin' } })
        }
      }
    })

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null
      if (user) {
        setCurrentUser(user)
      } else {
        const isAdmin = localStorage.getItem('admin_auth') === 'true'
        if (isAdmin) {
          setCurrentUser({ email: 'admin@acqar.com', user_metadata: { name: 'Admin' } })
        } else {
          setCurrentUser(null)
        }
      }
    })

    return () => listener?.subscription?.unsubscribe()
  }, [])

  // ── Derive display name from user ──
  const getUserName = (user) => {
    if (!user) return 'User'
    // Try name from metadata (set during signup)
    if (user.user_metadata?.name) return user.user_metadata.name
    if (user.user_metadata?.full_name) return user.user_metadata.full_name
    // Fall back to email prefix
    if (user.email) return user.email.split('@')[0]
    return 'User'
  }

  const USER_NAME = getUserName(currentUser)
  const USER_EMAIL = currentUser?.email || ''

  // ── Sign out handler ──
  const handleSignOut = async () => {
    setMenuOpen(false)
    // Clear admin flag
    localStorage.removeItem('admin_auth')
    // Sign out from Supabase
    try {
      await supabase.auth.signOut()
    } catch (e) {
      // ignore errors
    }
    navigate('/')
  }

  const [predictions, setPredictions] = useState([])
  const [predLoading, setPredLoading] = useState(true)
  const tickerRef = useRef(null)
  const animRef = useRef(null)
  const posRef = useRef(0)
  const menuWrapRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setMenuOpen(false) }
    function onClickOutside(e) {
      if (menuWrapRef.current && !menuWrapRef.current.contains(e.target)) setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onClickOutside)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onClickOutside)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await fetchPredictions()
        if (!cancelled) { setPredictions(data); setPredLoading(false); posRef.current = 0 }
      } catch (_) {
        if (!cancelled) setPredLoading(false)
      }
    }
    load()
    const interval = setInterval(load, 5 * 60 * 1000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  useEffect(() => {
    if (!tickerRef.current || predictions.length === 0) return
    const el = tickerRef.current
    const speed = 0.4
    const animate = () => {
      posRef.current -= speed
      const halfWidth = el.scrollWidth / 2
      if (Math.abs(posRef.current) >= halfWidth) posRef.current = 0
      el.style.transform = `translateX(${posRef.current}px)`
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [predictions])

  const isRealData = predictions.some(p => p.is_real)
  const sourceLabel = predictions.length > 0
    ? (isRealData ? (predictions[0].source === 'Polymarket' ? 'POLYMARKET' : 'MANIFOLD') : 'ACQAR SIGNAL')
    : 'SIGNAL'

  const path = typeof window !== 'undefined' ? window.location.pathname : ''
  const isDash = path === '/dashboard' || path === '/'
  const isReports = path === '/my-reports'
  const isSettings = path === '/settings'

  const initials = getInitials(USER_NAME)

  return (
    <>
      <style>{NAV_CSS}</style>

      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E8E8E8',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        zIndex: 20,
      }}>

        {/* ── Main nav row ── */}
        <div className="hdr-topNav">

          <div className="hdr-navLeft">
            {/* Brand */}
            <div className="hdr-navBrand" onClick={() => navigate('/')}>
              <span style={{ color: '#B87333' }}>ACQ</span>
              <span style={{ color: '#111111' }}>AR</span>
            </div>

            {/* Nav links */}
            <nav className="hdr-navLinks">
              {[
                { label: 'TERMINAL', active: isDash, href: '/dashboard' },
                { label: 'MY REPORTS', active: isReports, href: 'https://www.acqar.com/my-reports' },
                { label: 'SETTINGS', active: isSettings, href: 'https://www.acqar.com/settings' },
              ].map(({ label, active, href }) => (
                <button
                  key={label}
                  className={`hdr-navLink${active ? ' active' : ''}`}
                  onClick={() => window.location.href = href}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="hdr-navRight" ref={menuWrapRef}>

            {/* Bell */}
            <button className="hdr-bellBtn" type="button" aria-label="Notifications">
              <svg className="hdr-bellIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
            </button>

            {/* Profile */}
            <div className="hdr-profileWrap">
              <button
                type="button"
                className="hdr-profileBtn"
                onClick={() => setMenuOpen(v => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen ? 'true' : 'false'}
              >
                <div className="hdr-profileMeta">
                  <div className="hdr-profileName">{USER_NAME}</div>
                </div>
                <div className="hdr-profileAvatar">{initials}</div>
                <svg className="hdr-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {menuOpen && (
                <div className="hdr-menu" role="menu">
                  <div className="hdr-menuTop">
                    <div className="hdr-menuTopLabel">Signed In As</div>
                    <div className="hdr-menuName">{USER_NAME}</div>
                    {USER_EMAIL && (
                      <div className="hdr-menuEmail">{USER_EMAIL}</div>
                    )}
                    <div className="hdr-menuTier">ACQAR Signal Member</div>
                  </div>

                  <div className="hdr-menuList">
                    <div className="hdr-menuItem" role="menuitem" onClick={() => { setMenuOpen(false); navigate('/dashboard') }}>
                      <svg className="hdr-menuIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>
                      </svg>
                      <div className="hdr-menuText">Terminal</div>
                    </div>

                    <div className="hdr-menuItem" role="menuitem" onClick={() => { setMenuOpen(false); window.location.href = 'https://www.acqar.com/my-reports' }}>
                      <svg className="hdr-menuIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <path d="M14 2v6h6"/>
                      </svg>
                      <div className="hdr-menuText">My Reports</div>
                    </div>

                    <div className="hdr-menuItem" role="menuitem" onClick={() => { setMenuOpen(false); window.location.href = 'https://www.acqar.com/settings' }}>
                      <svg className="hdr-menuIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z"/>
                        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.05.05a2 2 0 0 1-1.41 3.41h-.1a1.7 1.7 0 0 0-1.6 1.16 1.7 1.7 0 0 0-.37.62 2 2 0 0 1-3.82 0 1.7 1.7 0 0 0-.37-.62 1.7 1.7 0 0 0-1.6-1.16H9.5a2 2 0 0 1-1.41-3.41l.05-.05A1.7 1.7 0 0 0 8.6 15a1.7 1.7 0 0 0-1.06-1.6l-.06-.03a2 2 0 0 1 0-3.74l.06-.03A1.7 1.7 0 0 0 8.6 9a1.7 1.7 0 0 0-.34-1.87l-.05-.05A2 2 0 0 1 9.62 3.7h.1a1.7 1.7 0 0 0 1.6-1.16 2 2 0 0 1 3.82 0 1.7 1.7 0 0 0 1.6 1.16h.1A2 2 0 0 1 21 6.98l-.05.05A1.7 1.7 0 0 0 20.6 9a1.7 1.7 0 0 0 1.06 1.6l.06.03a2 2 0 0 1 0 3.74l-.06.03A1.7 1.7 0 0 0 19.4 15z"/>
                      </svg>
                      <div className="hdr-menuText">Account Settings</div>
                    </div>

                    <div className="hdr-menuDivider" />

                    {/* ── Real Sign Out ── */}
                    <div className="hdr-menuSignout" role="menuitem" onClick={handleSignOut}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 17l5-5-5-5"/>
                        <path d="M15 12H3"/>
                        <path d="M21 3v18"/>
                      </svg>
                      SIGN OUT
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Prediction Ticker Strip ── */}
        <div style={{
          height: '26px',
          borderTop: '1px solid #0F3460',
          background: '#0D1B30',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            flexShrink: 0,
            paddingLeft: isMobile ? '6px' : '10px',
            paddingRight: isMobile ? '6px' : '8px',
            fontSize: isMobile ? '8px' : '9px',
            fontWeight: 800,
            color: '#B87333',
            letterSpacing: '0.8px',
            borderRight: '1px solid #0F3460',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#0D1B30',
            zIndex: 2,
            whiteSpace: 'nowrap',
          }}>
            <span style={{
              display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
              background: isRealData ? '#27AE60' : '#B87333',
              animation: isRealData ? 'hdrLivePulse 2s infinite' : 'none',
            }} />
            {isMobile ? (isRealData ? (predictions[0]?.source === 'Polymarket' ? 'POLY' : 'MFLD') : 'SIG') : sourceLabel}
          </div>

          <div style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '100%' }}>
            {predLoading ? (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', paddingLeft: '12px', fontSize: '10px', color: '#555' }}>
                Loading predictions...
              </div>
            ) : predictions.length === 0 ? (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', paddingLeft: '12px', fontSize: '10px', color: '#555' }}>
                No predictions available
              </div>
            ) : (
              <div ref={tickerRef} style={{ display: 'inline-flex', alignItems: 'center', height: '100%', whiteSpace: 'nowrap', willChange: 'transform' }}>
                {[...predictions, ...predictions].map((p, i) => (
                  <PredictionItem key={`${p.id}-${i}`} prediction={p} isMobile={isMobile} />
                ))}
              </div>
            )}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '100%', background: 'linear-gradient(to right, #0D1B30, transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '100%', background: 'linear-gradient(to left, #0D1B30, transparent)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* ── Signal Row ── */}
        <SignalRow />
      </header>
    </>
  )
}

function PredictionItem({ prediction, isMobile }) {
  const { question, pct, source, url, is_real } = prediction
  const color = pct >= 65 ? '#27AE60' : pct <= 35 ? '#E74C3C' : '#F39C12'
  const maxLen = isMobile ? 38 : 55
  const short = question.length > maxLen ? question.slice(0, maxLen - 3) + '...' : question

  return (
    <a
      href={url || undefined}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: isMobile ? '5px' : '7px',
        padding: isMobile ? '0 10px' : '0 16px', height: '100%',
        textDecoration: 'none',
        borderRight: '1px solid #0F3460',
        cursor: url ? 'pointer' : 'default',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: 800, color, minWidth: '32px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
      <span style={{ fontSize: '8px', fontWeight: 700, color, opacity: 0.7, padding: '1px 3px', border: `1px solid ${color}44`, borderRadius: '2px' }}>YES</span>
      <span style={{ fontSize: isMobile ? '9px' : '10px', color: '#B3B3B3', letterSpacing: '0.1px' }}>{short}</span>
      {is_real && !isMobile && (
        <span style={{ fontSize: '8px', color: '#555', fontWeight: 600, padding: '1px 4px', background: 'rgba(255,255,255,0.04)', borderRadius: '2px', flexShrink: 0 }}>{source}</span>
      )}
      <span style={{ color: '#1A2040', fontSize: '10px', marginLeft: '4px' }}>◆</span>
    </a>
  )
}
