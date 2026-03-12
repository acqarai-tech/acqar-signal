import { useEffect, useState, useRef } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const DEMO_TICKERS = [
  { name: 'Dubai Property Index', value: 287.4, change_pct: 0.34, unit: 'pts' },
  { name: 'Palm Jumeirah Avg', value: 2847, change_pct: 0.12, unit: 'AED/sqft' },
  { name: 'Downtown Dubai Avg', value: 3241, change_pct: -0.08, unit: 'AED/sqft' },
  { name: 'Marina Yield', value: 6.8, change_pct: 0.05, unit: '%' },
  { name: 'AED/USD', value: 3.6725, change_pct: 0.00, unit: '' },
  { name: 'Bus. Bay Transactions', value: 847, change_pct: 2.1, unit: '30d' },
  { name: 'JVC Avg Price', value: 1240, change_pct: 0.45, unit: 'AED/sqft' },
  { name: 'DIFC Yield', value: 5.9, change_pct: -0.1, unit: '%' },
]

export default function Ticker() {
  const [tickers, setTickers] = useState(DEMO_TICKERS)
  const trackRef = useRef(null)

  useEffect(() => {
    const load = () => fetch(`${API}/api/market/ticker`).then(r => r.json()).then(d => {
      if (d.tickers?.length) setTickers(d.tickers)
    }).catch(() => {})
    load()
    const id = setInterval(load, 60000)
    return () => clearInterval(id)
  }, [])

  // Duplicate ticker items for seamless loop
  const items = [...tickers, ...tickers]

  return (
    <div style={{
      height:'32px', background:'#16213E', borderBottom:'1px solid #0F3460',
      overflow:'hidden', flexShrink:0, position:'relative'
    }}>
      {/* Label */}
      <div style={{
        position:'absolute', left:0, top:0, bottom:0, zIndex:2,
        background:'#B87333', color:'white', fontSize:'10px', fontWeight:700,
        padding:'0 10px', display:'flex', alignItems:'center', letterSpacing:'1px'
      }}>LIVE</div>

      {/* Scrolling track */}
      <div style={{
        marginLeft:'48px', height:'100%', overflow:'hidden'
      }}>
        <div
          ref={trackRef}
          style={{
            display:'flex', alignItems:'center', height:'100%', gap:'32px',
            animation:'ticker-scroll 60s linear infinite',
            whiteSpace:'nowrap'
          }}
        >
          {items.map((t, i) => (
            <div key={i} style={{display:'flex', alignItems:'center', gap:'6px', flexShrink:0}}>
              <span style={{fontSize:'11px', color:'#B3B3B3'}}>{t.name || t.symbol}</span>
              <span style={{fontSize:'11px', fontWeight:600, color:'#FAFAFA'}}>
                {typeof t.value === 'number' ? t.value.toLocaleString(undefined, {maximumFractionDigits:2}) : t.value}
                {t.unit ? ` ${t.unit}` : ''}
              </span>
              <span style={{
                fontSize:'10px', fontWeight:600,
                color: (t.change_pct || 0) >= 0 ? '#27AE60' : '#E74C3C'
              }}>
                {(t.change_pct || 0) >= 0 ? '▲' : '▼'} {Math.abs(t.change_pct || 0).toFixed(2)}%
              </span>
              <span style={{color:'#0F3460', marginLeft:'8px'}}>|</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
