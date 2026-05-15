import { useEffect, useState, useRef } from 'react'

const C = {
  bg2: '#F2EDE5', border: '#E8E0D0', green: '#16A34A',
  text: '#1C1C28', text2: '#3D3D50',
}

const BACKEND = 'https://acqar-signal-production.up.railway.app'

const fmt = (n) => (n || 0).toLocaleString()

export default function TickerBar({ areaSlug, areaName, fallback, activeProjectCount, metroCatalyst }) {
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
  {
    label: 'Sold This Week',
    value: soldThisWeek > 0
      ? `${fmt(soldThisWeek)} homes`
      : `${fmt(fallback?.soldThisWeek ?? Math.round(20 + (fallback?.score ?? 60) * 1.5))} homes (est.)`
  },
  {
    label: 'Fair Price',
    value: `AED ${fairPsf} / sqft`
  },
  {
    label: 'Rental Return',
    value: `${yld}% / year`
  },
  {
    label: 'Distress Listings',
    value: `${distress}% below fair value`
  },
  {
    label: 'Metro Opening',
    value: metroCatalyst?.expected_date
      ? `${new Date(metroCatalyst.expected_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} · ${metroCatalyst.confidence}`
      : data?.metroOpening?.date
        ? `${new Date(data.metroOpening.date).getFullYear()} · ${data.metroOpening.confidence}`
        : 'Dubai Metro expansion · 2026–2029'
  },
  {
    label: 'Off-Plan Pipeline',
    value: activeProjectCount > 0
      ? `${activeProjectCount} active projects`
      : data?.offPlanPipeline > 0
        ? `${data.offPlanPipeline} active projects`
        : `${Math.round(3 + (fallback?.score ?? 60) * 0.08)} active projects (est.)`
  },
  {
    label: 'Signal',
    value: `${verdict} · Score ${score}/100`
  },
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
