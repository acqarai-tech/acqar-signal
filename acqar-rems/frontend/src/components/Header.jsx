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

// export default function Header() {
//   const { isConnected } = useSocket()
//   const [activeTimeFilter, setActiveTimeFilter] = useState(24)

//   const [predictions, setPredictions] = useState([])
//   const [predLoading, setPredLoading] = useState(true)
//   const tickerRef = useRef(null)
//   const animRef = useRef(null)
//   const posRef = useRef(0)

//   // Detect mobile
//   const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
//   useEffect(() => {
//     const handler = () => setIsMobile(window.innerWidth < 768)
//     window.addEventListener('resize', handler)
//     return () => window.removeEventListener('resize', handler)
//   }, [])

//   useEffect(() => {
//     let cancelled = false
//     const load = async () => {
//       try {
//         const data = await fetchPredictions()
//         if (!cancelled) {
//           setPredictions(data)
//           setPredLoading(false)
//           posRef.current = 0
//         }
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
//     ? (isRealData
//         ? (predictions[0].source === 'Polymarket' ? 'POLYMARKET' : 'MANIFOLD')
//         : 'ACQAR SIGNAL')
//     : 'SIGNAL'

//   return (
//     <header style={{
//       background: '#FFFFFF',
//       borderBottom: '1px solid #E0E0E0',
//       display: 'flex',
//       flexDirection: 'column',
//       flexShrink: 0,
//       zIndex: 20,
//     }}>
//       {/* ── Main header row ── */}
//       <div style={{
//         height: isMobile ? '44px' : '50px',
//         display: 'flex',
//         alignItems: 'center',
//         paddingLeft: isMobile ? '10px' : '16px',
//         paddingRight: isMobile ? '10px' : '16px',
//         gap: isMobile ? '8px' : '12px',
//       }}>

//         {/* Logo */}
//         {/* <div
//           className="hdrLogo flex items-center cursor-pointer shrink-0 whitespace-nowrap"
//           onClick={() => window.location.href = '/'}
//         >
//           <h1 style={{
//             fontSize: isMobile ? '18px' : '22px',
//             fontWeight: 900,
//             letterSpacing: '-0.5px',
//             textTransform: 'uppercase',
//             margin: 0,
//             lineHeight: 1,
//           }}>
//             <span style={{ color: '#B87333' }}>ACQ</span>
//             <span style={{ color: '#111111' }}>AR</span>
//           </h1>
//         </div> */}

//         <h1 style={{
//   fontSize: isMobile ? '18px' : '22px',
//   fontWeight: 900,
//   letterSpacing: '-0.5px',
//   textTransform: 'uppercase',
//   margin: 0,
//   lineHeight: 1,
//   display: 'flex',
//   alignItems: 'center',
//   gap: '6px',
// }}>
//   <span>
//     <span style={{ color: '#B87333' }}>ACQ</span>
//     <span style={{ color: '#111111' }}>AR</span>
//   </span>
//   <span style={{
//     fontSize: isMobile ? '8px' : '9px',
//     fontWeight: 700,
//     letterSpacing: '1.5px',
//     color: '#B87333',
//     border: '1px solid rgba(184,115,51,0.35)',
//     padding: '2px 6px',
//     borderRadius: '4px',
//     background: 'rgba(184,115,51,0.10)',
//     textTransform: 'uppercase',
//     lineHeight: 1,
//   }}>Signal</span>
// </h1>

//         {/* Center group */}
//         <div style={{
//           flex: 1,
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           gap: isMobile ? '8px' : '12px',
//         }}>

//           {/* Status indicator */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//             <div style={{
//               width: 6, height: 6, borderRadius: '50%',
//               background: isConnected ? '#27AE60' : '#666',
//               boxShadow: isConnected ? '0 0 6px #27AE60' : 'none',
//               flexShrink: 0,
//             }} />
//             {/* Hide "LIVE/OFFLINE" label on very small screens */}
//             {!isMobile && (
//               <span style={{ fontSize: '11px', color: isConnected ? '#27AE60' : '#666', fontWeight: 600 }}>
//                 {isConnected ? 'LIVE' : 'OFFLINE'}
//               </span>
//             )}
//           </div>

//           {/* Time filter buttons */}
//           <div style={{ display: 'flex', gap: isMobile ? '4px' : '6px' }}>
//             {[6, 24, 72].map(h => (
//               <button key={h} disabled style={{
//                 padding: isMobile ? '3px 6px' : '4px 8px',
//                 fontSize: isMobile ? '9px' : '10px',
//                 fontWeight: 700,
//                 border: activeTimeFilter === h ? '1px solid #B87333' : '1px solid #0F3460',
//                 background: activeTimeFilter === h ? 'rgba(184,115,51,0.2)' : 'transparent',
//                 color: activeTimeFilter === h ? '#B87333' : '#B3B3B3',
//                 borderRadius: '4px',
//                 cursor: 'not-allowed',
//                 pointerEvents: 'none',
//               }}>{h}H</button>
//             ))}
//           </div>

//         </div>
//       </div>

//       {/* ── Prediction Ticker Strip ── */}
//       <div style={{
//         height: '26px',
//         borderTop: '1px solid #0F3460',
//         background: '#0D1B30',
//         display: 'flex',
//         alignItems: 'center',
//         overflow: 'hidden',
//         position: 'relative',
//       }}>
//         {/* Left label */}
//         <div style={{
//           flexShrink: 0,
//           paddingLeft: isMobile ? '6px' : '10px',
//           paddingRight: isMobile ? '6px' : '8px',
//           fontSize: isMobile ? '8px' : '9px',
//           fontWeight: 800,
//           color: '#B87333',
//           letterSpacing: '0.8px',
//           borderRight: '1px solid #0F3460',
//           height: '100%',
//           display: 'flex',
//           alignItems: 'center',
//           gap: '4px',
//           background: '#0D1B30',
//           zIndex: 2,
//           whiteSpace: 'nowrap',
//         }}>
//           <span style={{
//             display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
//             background: isRealData ? '#27AE60' : '#B87333',
//             animation: isRealData ? 'livePulse 2s infinite' : 'none',
//           }} />
//           {/* Shorten label on mobile */}
//           {isMobile ? (isRealData ? (predictions[0]?.source === 'Polymarket' ? 'POLY' : 'MFLD') : 'SIG') : sourceLabel}
//         </div>

//         {/* Scrolling ticker */}
//         <div style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '100%' }}>
//           {predLoading ? (
//             <div style={{
//               position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
//               display: 'flex', alignItems: 'center', paddingLeft: '12px',
//               fontSize: '10px', color: '#555',
//             }}>Loading predictions...</div>
//           ) : predictions.length === 0 ? (
//             <div style={{
//               position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
//               display: 'flex', alignItems: 'center', paddingLeft: '12px',
//               fontSize: '10px', color: '#555',
//             }}>No predictions available</div>
//           ) : (
//             <div
//               ref={tickerRef}
//               style={{
//                 display: 'inline-flex', alignItems: 'center', height: '100%',
//                 whiteSpace: 'nowrap', willChange: 'transform',
//               }}
//             >
//               {[...predictions, ...predictions].map((p, i) => (
//                 <PredictionItem key={`${p.id}-${i}`} prediction={p} isMobile={isMobile} />
//               ))}
//             </div>
//           )}

//           {/* Fade edges */}
//           <div style={{
//             position: 'absolute', top: 0, left: 0, width: '24px', height: '100%',
//             background: 'linear-gradient(to right, #0D1B30, transparent)', pointerEvents: 'none',
//           }} />
//           <div style={{
//             position: 'absolute', top: 0, right: 0, width: '24px', height: '100%',
//             background: 'linear-gradient(to left, #0D1B30, transparent)', pointerEvents: 'none',
//           }} />
//         </div>
//       </div>

//       {/* ── DLD · STOCKS Signal Row ── */}
//       <SignalRow />

//       <style>{`
//         @keyframes livePulse {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50% { opacity: 0.5; transform: scale(1.3); }
//         }
//       `}</style>
//     </header>
//   )
// }

// function PredictionItem({ prediction, isMobile }) {
//   const { question, pct, source, url, is_real } = prediction
//   const color = pct >= 65 ? '#27AE60' : pct <= 35 ? '#E74C3C' : '#F39C12'
//   // Shorter truncation on mobile
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
//       <span style={{
//         fontSize: isMobile ? '10px' : '11px',
//         fontWeight: 800, color,
//         minWidth: '32px', textAlign: 'right',
//         fontVariantNumeric: 'tabular-nums',
//       }}>{pct}%</span>

//       <span style={{
//         fontSize: '8px', fontWeight: 700, color, opacity: 0.7,
//         padding: '1px 3px', border: `1px solid ${color}44`, borderRadius: '2px',
//       }}>YES</span>

//       <span style={{ fontSize: isMobile ? '9px' : '10px', color: '#B3B3B3', letterSpacing: '0.1px' }}>
//         {short}
//       </span>

//       {is_real && !isMobile && (
//         <span style={{
//           fontSize: '8px', color: '#555', fontWeight: 600,
//           padding: '1px 4px', background: 'rgba(255,255,255,0.04)',
//           borderRadius: '2px', flexShrink: 0,
//         }}>{source}</span>
//       )}

//       <span style={{ color: '#1A2040', fontSize: '10px', marginLeft: '4px' }}>◆</span>
//     </a>
//   )
// }


import { useEffect, useRef, useState } from 'react'
import { useSocket } from '../context/SocketContext'
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

export default function Header() {
  const { isConnected } = useSocket()
  const [activeTimeFilter, setActiveTimeFilter] = useState(24)

  const [predictions, setPredictions] = useState([])
  const [predLoading, setPredLoading] = useState(true)
  const tickerRef = useRef(null)
  const animRef = useRef(null)
  const posRef = useRef(0)

  // Detect mobile
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await fetchPredictions()
        if (!cancelled) {
          setPredictions(data)
          setPredLoading(false)
          posRef.current = 0
        }
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
    ? (isRealData
        ? (predictions[0].source === 'Polymarket' ? 'POLYMARKET' : 'MANIFOLD')
        : 'ACQAR SIGNAL')
    : 'SIGNAL'

  return (
    <header style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #E0E0E0',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      zIndex: 20,
    }}>
      {/* ── Main header row ── */}
      <div style={{
        height: isMobile ? '44px' : '50px',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: isMobile ? '10px' : '16px',
        paddingRight: isMobile ? '10px' : '16px',
        gap: isMobile ? '8px' : '12px',
      }}>

        {/* Logo */}
        {/* <div
          className="hdrLogo flex items-center cursor-pointer shrink-0 whitespace-nowrap"
          onClick={() => window.location.href = '/'}
        >
          <h1 style={{
            fontSize: isMobile ? '18px' : '22px',
            fontWeight: 900,
            letterSpacing: '-0.5px',
            textTransform: 'uppercase',
            margin: 0,
            lineHeight: 1,
          }}>
            <span style={{ color: '#B87333' }}>ACQ</span>
            <span style={{ color: '#111111' }}>AR</span>
          </h1>
        </div> */}

        <h1 style={{
  fontSize: isMobile ? '18px' : '22px',
  fontWeight: 900,
  letterSpacing: '-0.5px',
  textTransform: 'uppercase',
  margin: 0,
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
 gap: isMobile ? '4px' : '6px',
}}>
  <span>
    <span style={{ color: '#B87333' }}>ACQ</span>
    <span style={{ color: '#111111' }}>AR</span>
  </span>
  <span style={{
    fontSize: isMobile ? '8px' : '9px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    color: '#B87333',
    border: '1px solid rgba(184,115,51,0.35)',
    padding: '2px 6px',
    borderRadius: '4px',
    background: 'rgba(184,115,51,0.10)',
    textTransform: 'uppercase',
    lineHeight: 1,
  }}>Signal</span>
</h1>

        {/* Center group */}
        {/* <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: isMobile ? '8px' : '12px',
        }}> */}
        {/* Center group */}
<div style={{
  flex: 1,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: isMobile ? '6px' : '12px',
}}>

          {/* Status indicator */}
          {/* <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: isConnected ? '#27AE60' : '#666',
              boxShadow: isConnected ? '0 0 6px #27AE60' : 'none',
              flexShrink: 0,
            }} /> */}
            {/* Hide "LIVE/OFFLINE" label on very small screens */}
            {/* {!isMobile && (
              <span style={{ fontSize: '11px', color: isConnected ? '#27AE60' : '#666', fontWeight: 600 }}>
                {isConnected ? 'LIVE' : 'OFFLINE'}
              </span>
            )}
          </div> */}

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
  <div style={{
    width: 6, height: 6, borderRadius: '50%',
    background: isConnected ? '#27AE60' : '#666',
    boxShadow: isConnected ? '0 0 6px #27AE60' : 'none',
    flexShrink: 0,
  }} />
  <span style={{ fontSize: isMobile ? '9px' : '11px', color: isConnected ? '#27AE60' : '#666', fontWeight: 600 }}>
    {isConnected ? 'LIVE' : 'OFF'}
  </span>
</div>

          {/* Time filter buttons */}
          {/* <div style={{ display: 'flex', gap: isMobile ? '4px' : '6px' }}>
            {[6, 24, 72].map(h => (
              <button key={h} disabled style={{
                padding: isMobile ? '3px 6px' : '4px 8px',
                fontSize: isMobile ? '9px' : '10px', */}
                <div style={{ display: 'flex', gap: isMobile ? '3px' : '6px', flexShrink: 0 }}>
  {[6, 24, 72].map(h => (
    <button key={h} disabled style={{
      padding: isMobile ? '2px 5px' : '4px 8px',
      fontSize: isMobile ? '8px' : '10px',
                fontWeight: 700,
                border: activeTimeFilter === h ? '1px solid #B87333' : '1px solid #0F3460',
                background: activeTimeFilter === h ? 'rgba(184,115,51,0.2)' : 'transparent',
                color: activeTimeFilter === h ? '#B87333' : '#B3B3B3',
                borderRadius: '4px',
                cursor: 'not-allowed',
                pointerEvents: 'none',
              }}>{h}H</button>
            ))}
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
        {/* Left label */}
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
            animation: isRealData ? 'livePulse 2s infinite' : 'none',
          }} />
          {/* Shorten label on mobile */}
          {isMobile ? (isRealData ? (predictions[0]?.source === 'Polymarket' ? 'POLY' : 'MFLD') : 'SIG') : sourceLabel}
        </div>

        {/* Scrolling ticker */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '100%' }}>
          {predLoading ? (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', alignItems: 'center', paddingLeft: '12px',
              fontSize: '10px', color: '#555',
            }}>Loading predictions...</div>
          ) : predictions.length === 0 ? (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', alignItems: 'center', paddingLeft: '12px',
              fontSize: '10px', color: '#555',
            }}>No predictions available</div>
          ) : (
            <div
              ref={tickerRef}
              style={{
                display: 'inline-flex', alignItems: 'center', height: '100%',
                whiteSpace: 'nowrap', willChange: 'transform',
              }}
            >
              {[...predictions, ...predictions].map((p, i) => (
                <PredictionItem key={`${p.id}-${i}`} prediction={p} isMobile={isMobile} />
              ))}
            </div>
          )}

          {/* Fade edges */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '24px', height: '100%',
            background: 'linear-gradient(to right, #0D1B30, transparent)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '24px', height: '100%',
            background: 'linear-gradient(to left, #0D1B30, transparent)', pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* ── DLD · STOCKS Signal Row ── */}
      <SignalRow />

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </header>
  )
}

function PredictionItem({ prediction, isMobile }) {
  const { question, pct, source, url, is_real } = prediction
  const color = pct >= 65 ? '#27AE60' : pct <= 35 ? '#E74C3C' : '#F39C12'
  // Shorter truncation on mobile
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
      <span style={{
        fontSize: isMobile ? '10px' : '11px',
        fontWeight: 800, color,
        minWidth: '32px', textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
      }}>{pct}%</span>

      <span style={{
        fontSize: '8px', fontWeight: 700, color, opacity: 0.7,
        padding: '1px 3px', border: `1px solid ${color}44`, borderRadius: '2px',
      }}>YES</span>

      <span style={{ fontSize: isMobile ? '9px' : '10px', color: '#B3B3B3', letterSpacing: '0.1px' }}>
        {short}
      </span>

      {is_real && !isMobile && (
        <span style={{
          fontSize: '8px', color: '#555', fontWeight: 600,
          padding: '1px 4px', background: 'rgba(255,255,255,0.04)',
          borderRadius: '2px', flexShrink: 0,
        }}>{source}</span>
      )}

      <span style={{ color: '#1A2040', fontSize: '10px', marginLeft: '4px' }}>◆</span>
    </a>
  )
}
