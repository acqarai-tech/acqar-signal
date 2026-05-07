import { useEffect, useState, useRef } from 'react'

const C = {
  bg2: '#F2EDE5', border: '#E8E0D0', green: '#16A34A',
  text: '#1C1C28', text2: '#3D3D50',
}

const BACKEND = 'https://acqar-signal-production.up.railway.app'

const fmt = (n) => (n || 0).toLocaleString()

export default function TickerBar({ areaSlug, areaName, fallback }) {
  const [data, setData] = useState(null)
  const trackRef = useRef(null)

  useEffect(() => {
    fetch(`${BACKEND}/api/ticker/${areaSlug}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
  }, [areaSlug])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let x = 0
    const tick = () => {
      x -= 0.4
      if (Math.abs(x) > el.scrollWidth / 2) x = 0
      el.style.transform = `translateX(${x}px)`
      requestAnimationFrame(tick)
    }
    const id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [data])

  const items = [
    `Sold This Week: ${data?.soldThisWeek ?? fallback.soldThisWeek} homes`,
    `Fair Price: AED ${data?.fairPriceAedPsf ? fmt(data.fairPriceAedPsf) : fmt(fallback.psf)} / sqft`,
    `Rental Return: ${data?.rentalReturnPct ?? fallback.yld}% / year`,
    `Distress Listings: ${data?.distressPct ?? fallback.distressPct}% below fair value`,
    `Metro Opening: ${data?.metroOpening ? new Date(data.metroOpening.date).getFullYear() + ' ' + data.metroOpening.confidence : 'Q4 2026 confirmed'}`,
    `Off-Plan Pipeline: ${data?.offPlanPipeline ?? 9} active projects`,
    `Signal: ${data?.signalMood ?? fallback.verdict} · Score ${data?.score ?? fallback.score}/100`,
  ]

  const allItems = [...items, ...items]

  return (
    <div style={{ background: C.bg2, borderBottom: `1px solid ${C.border}`, padding: '0 28px', height: 28, display: 'flex', alignItems: 'center', gap: 20, fontSize: 11, overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, flexShrink: 0 }} />
      <span style={{ fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em', color: C.green, whiteSpace: 'nowrap' }}>{areaName.toUpperCase()} LIVE</span>
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div ref={trackRef} style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform' }}>
          {allItems.map((item, i) => (
            <div key={i} style={{ padding: '0 16px', borderRight: `1px solid ${C.border}`, whiteSpace: 'nowrap', color: C.text2, flexShrink: 0 }}>
              {item.split(': ').map((part, j) => j === 0
                ? part + ': '
                : <span key={j} style={{ fontWeight: 600, color: C.text }}>{part}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
