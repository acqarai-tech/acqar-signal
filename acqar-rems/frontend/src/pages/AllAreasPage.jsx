import { useState, useEffect, useRef } from 'react'
import { EventsProvider } from '../context/EventsContext'
import AllAreaSpecialistPage from '../components/AllAreaSpecialistPage'

const C = {
  bg: '#FAF8F5', bg2: '#F2EDE5', bg3: '#EAE3D8',
  card: '#FFFFFF', border: '#E8E0D0', border2: '#D8CEBC',
  orange: '#C8732A', orange2: '#A85C20', orangeL: 'rgba(200,115,42,0.09)',
  green: '#16A34A', greenL: 'rgba(22,163,74,0.1)',
  amber: '#D97706', amberL: 'rgba(217,119,6,0.1)',
  red: '#DC2626', redL: 'rgba(220,38,38,0.1)',
  blue: '#2563EB', blueL: 'rgba(37,99,235,0.09)',
  text: '#1C1C28', text2: '#3D3D50',
  muted: '#6E7A8A', muted2: '#9CA8B4',
}

const fmt = (n) => (n || 0).toLocaleString()

function verdictColor(v) {
  return v === 'BUY' ? C.green : v === 'HOLD' ? C.amber : C.red
}
function verdictBg(v) {
  return v === 'BUY' ? C.greenL : v === 'HOLD' ? C.amberL : C.redL
}
function getVerdict(a) {
  const score = Number(a.investment_score) || 0
  return a.verdict || (score >= 75 ? 'BUY' : score >= 65 ? 'HOLD' : 'WATCH')
}

// ── Global scrolling ticker ─────────────────────────────────────────
function GlobalTicker({ areas }) {
  const trackRef = useRef(null)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let x = 0
    let rafId
    const tick = () => {
      x -= 0.4
      if (Math.abs(x) > el.scrollWidth / 2) x = 0
      el.style.transform = `translateX(${x}px)`
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [areas])

  const topAreas = [...areas]
    .sort((a, b) => (Number(b.investment_score) || 0) - (Number(a.investment_score) || 0))
    .slice(0, 20)

  const items = topAreas.map(a => {
    const verdict = getVerdict(a)
    const psf = a.truvalu_psm ? Math.round(Number(a.truvalu_psm) / 10.764) : null
    return [
      `${a.area_name_en}: ${verdict}`,
      psf ? `AED ${fmt(psf)}/sqft` : null,
      a.gross_yield_pct ? `${Number(a.gross_yield_pct).toFixed(1)}% yield` : null,
      a.investment_score ? `Score ${a.investment_score}/100` : null,
    ].filter(Boolean).join(' · ')
  })

  const allItems = [...items, ...items]

  return (
    <div style={{
      background: C.bg2, borderBottom: `1px solid ${C.border}`,
      height: 28, display: 'flex', alignItems: 'center',
      gap: 16, fontSize: 11, overflow: 'hidden', flexShrink: 0,
      padding: '0 16px', position: 'sticky', top: 52, zIndex: 99,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, flexShrink: 0 }} />
      <span style={{
        fontWeight: 700, fontSize: 10, textTransform: 'uppercase',
        letterSpacing: '.1em', color: C.green, whiteSpace: 'nowrap',
      }}>DUBAI LIVE</span>
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div ref={trackRef} style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform' }}>
          {allItems.map((item, i) => (
            <div key={i} style={{
              padding: '0 18px', borderRight: `1px solid ${C.border}`,
              whiteSpace: 'nowrap', color: C.text2, flexShrink: 0, fontSize: 11,
            }}>
              {item.split(': ').map((part, j) =>
                j === 0
                  ? <span key={j}>{part}: </span>
                  : <span key={j} style={{ fontWeight: 600, color: C.text }}>{part}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Single area card ────────────────────────────────────────────────
function AreaCard({ area, onClick }) {
  const score    = Number(area.investment_score) || 0
  const yld      = Number(area.gross_yield_pct)  || 0
  const psm      = Number(area.truvalu_psm)       || 0
  const psf      = psm ? Math.round(psm / 10.764) : null
  const distress = Number(area.distress_pct)      || 0
  const tx7d     = area.tx_7d
  const verdict  = getVerdict(area)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.card,
        border: `1px solid ${hovered ? C.orange : C.border}`,
        borderLeft: `3px solid ${verdictColor(verdict)}`,
        borderRadius: 10,
        padding: 18,
        cursor: 'pointer',
        transition: 'all 0.15s',
        boxShadow: hovered ? '0 4px 20px rgba(200,115,42,0.12)' : 'none',
        transform: hovered ? 'translateY(-2px)' : 'none',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <span style={{
          fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
          letterSpacing: '.1em', padding: '3px 9px', borderRadius: 4,
          background: verdictBg(verdict), color: verdictColor(verdict),
        }}>{verdict}</span>
        <span style={{ fontSize: 10, color: C.muted2 }}>#{area.area_id}</span>
      </div>

      {/* Name */}
      <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 2, lineHeight: 1.3 }}>
        {area.area_name_en}
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 14 }}>
        {score >= 75 ? 'Prime' : score >= 65 ? 'Mid-Market' : 'Emerging'} · Dubai
      </div>

      {/* Stats 2x2 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1 }}>
        {[
          { label: 'Score',    value: score || '—',                          color: verdictColor(verdict), big: true },
          { label: 'Yield',    value: yld ? `${yld}%` : '—',                color: C.green,               big: true },
          { label: 'Fair PSF', value: psf ? `AED ${psf.toLocaleString()}` : '—', color: C.text },
          { label: 'Distress', value: distress ? `${distress}%` : '—',      color: distress > 15 ? C.amber : C.muted },
        ].map(stat => (
          <div key={stat.label} style={{ background: C.bg2, borderRadius: 6, padding: '8px 10px' }}>
            <div style={{ fontSize: 9, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 2 }}>
              {stat.label}
            </div>
            <div style={{ fontSize: stat.big ? 18 : 13, fontWeight: 700, color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Sold this week */}
      {tx7d != null && (
        <div style={{
          marginTop: 10, fontSize: 11, color: C.muted,
          display: 'flex', justifyContent: 'space-between',
          borderTop: `1px solid ${C.border}`, paddingTop: 8,
        }}>
          <span>Sold this week</span>
          <span style={{ fontWeight: 700, color: C.text }}>{tx7d} homes</span>
        </div>
      )}

      {/* Arrow */}
      <div style={{
        position: 'absolute', right: 14, bottom: 14,
        fontSize: 14, color: C.orange,
        opacity: hovered ? 0.9 : 0.25,
        transition: 'opacity 0.15s',
      }}>→</div>
    </div>
  )
}

// ── Main export ─────────────────────────────────────────────────────
export default function AllAreasPage() {
  const [areas,        setAreas]        = useState([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [filter,       setFilter]       = useState('all')   // all | BUY | HOLD | WATCH
  const [sortBy,       setSortBy]       = useState('score') // score | yield | psf | name
  const [selectedArea, setSelectedArea] = useState(null)

  const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
  const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

  useEffect(() => {
    fetch(
      `${SUPA_URL}/rest/v1/area_intelligence?select=*&order=investment_score.desc.nullslast`,
      { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
    )
      .then(r => r.json())
      .then(data => { setAreas(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Build area object for AllAreaSpecialistPage
  function buildAreaObj(a) {
    const score = Number(a.investment_score) || 60
    const psm   = Number(a.truvalu_psm)      || 0
    const psf   = psm ? Math.round(psm / 10.764) : 1200
    return {
      name:         a.area_name_en,
      zone:         score >= 75 ? 'Prime' : score >= 65 ? 'Mid-Market' : 'Emerging',
      pricePerSqft: psf,
      yield:        Number(a.gross_yield_pct) || 6.5,
      score,
      area_id:      a.area_id,
    }
  }

  // Filtered + sorted list
  const filtered = areas
    .filter(a => {
      if (filter !== 'all' && getVerdict(a) !== filter) return false
      if (search && !a.area_name_en?.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'score') return (Number(b.investment_score) || 0) - (Number(a.investment_score) || 0)
      if (sortBy === 'yield') return (Number(b.gross_yield_pct)  || 0) - (Number(a.gross_yield_pct)  || 0)
      if (sortBy === 'psf')   return (Number(b.truvalu_psm)      || 0) - (Number(a.truvalu_psm)      || 0)
      if (sortBy === 'name')  return (a.area_name_en || '').localeCompare(b.area_name_en || '')
      return 0
    })

  // Summary stats
  const buyCount   = areas.filter(a => getVerdict(a) === 'BUY').length
  const holdCount  = areas.filter(a => getVerdict(a) === 'HOLD').length
  const watchCount = areas.filter(a => getVerdict(a) === 'WATCH').length
  const avgYield   = areas.length
    ? (areas.reduce((s, a) => s + (Number(a.gross_yield_pct) || 0), 0) / areas.length).toFixed(1)
    : '—'
  const avgScore   = areas.length
    ? Math.round(areas.reduce((s, a) => s + (Number(a.investment_score) || 0), 0) / areas.length)
    : '—'
  const distressedCount = areas.filter(a => Number(a.distress_pct) > 15).length

  // ── If area selected, show detail page ──
  if (selectedArea) {
    return (
      <EventsProvider>
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
          <AllAreaSpecialistPage
            area={selectedArea}
            onClose={() => setSelectedArea(null)}
          />
        </div>
      </EventsProvider>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      fontFamily: "'Inter', sans-serif", color: C.text,
    }}>

      {/* ── STICKY HEADER ── */}
      <div style={{
        background: C.card, borderBottom: `1px solid ${C.border}`,
        padding: '0 28px', height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 900, fontSize: 17, letterSpacing: '0.12em' }}>
            <span style={{ color: C.orange }}>ACQ</span>
            <span style={{ color: C.text }}>AR</span>
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, color: C.orange,
            letterSpacing: '1.5px', textTransform: 'uppercase',
            padding: '3px 10px', borderRadius: 4,
            background: C.orangeL, border: `1px solid rgba(200,115,42,0.35)`,
          }}>SIGNAL™</span>
          <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>
            · All Dubai Areas
          </span>
        </div>
        <div style={{ fontSize: 11, color: C.muted }}>
          {areas.length} areas tracked · Updated daily · May 2026
        </div>
      </div>

      {/* ── GLOBAL TICKER ── */}
      {areas.length > 0 && <GlobalTicker areas={areas} />}

      <div style={{ padding: '24px 28px 60px' }}>

        {/* ── SUMMARY STAT CARDS ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 12, marginBottom: 20,
        }}>
          {[
            { label: 'Total Areas',  value: areas.length,   color: C.text,   sub: 'Tracked by Acqar' },
            { label: 'BUY Signal',   value: buyCount,       color: C.green,  sub: 'Strong opportunity' },
            { label: 'HOLD Signal',  value: holdCount,      color: C.amber,  sub: 'Wait & watch' },
            { label: 'WATCH Signal', value: watchCount,     color: C.red,    sub: 'Needs monitoring' },
            { label: 'Avg Yield',    value: `${avgYield}%`, color: C.green,  sub: 'Dubai avg: 6.1%' },
            { label: 'Avg Score',    value: avgScore,       color: C.orange, sub: 'Out of 100' },
            { label: 'Distressed',   value: distressedCount,color: C.red,    sub: 'Areas >15% distress' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 8, padding: '14px 16px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, marginBottom: 6 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: stat.color, lineHeight: 1 }}>
                {loading ? '—' : stat.value}
              </div>
              <div style={{ fontSize: 10, color: C.muted2, marginTop: 4 }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* ── MARKET ALERT ── */}
        <div style={{
          background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)',
          borderRadius: 8, padding: '10px 16px',
          display: 'flex', alignItems: 'flex-start', gap: 10,
          fontSize: 12, marginBottom: 20,
        }}>
          <span style={{ flexShrink: 0 }}>⚠️</span>
          <div style={{ color: '#9A1B1B', lineHeight: 1.6 }}>
            <strong style={{ color: C.red }}>Market Alert — May 2026:</strong>{' '}
            Regional tensions (Iran/USA, April 2026) have caused a 49% MoM transaction drop across Dubai.
            This is a sentiment-driven pause, not a fundamental collapse.
            Use the area scores below to find resilient entry opportunities.
          </div>
        </div>

        {/* ── SEARCH + FILTER + SORT ── */}
        <div style={{
          display: 'flex', gap: 10, flexWrap: 'wrap',
          alignItems: 'center', marginBottom: 20,
        }}>
          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍  Search areas... (e.g. Marina, Downtown, JVC)"
            style={{
              flex: 1, minWidth: 220, maxWidth: 380,
              padding: '9px 14px', border: `1px solid ${C.border}`,
              borderRadius: 8, fontSize: 13, background: C.card,
              color: C.text, outline: 'none', boxSizing: 'border-box',
            }}
          />

          {/* Verdict filter */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'BUY', 'HOLD', 'WATCH'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 14px', fontSize: 11, fontWeight: 700,
                  borderRadius: 7, cursor: 'pointer',
                  border: `1px solid ${filter === f ? C.orange : C.border}`,
                  background: filter === f ? C.orangeL : C.card,
                  color: filter === f ? C.orange : C.muted,
                  textTransform: 'uppercase', letterSpacing: '.06em',
                  transition: 'all 0.12s',
                }}
              >{f === 'all' ? 'All' : f}</button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              padding: '8px 12px', border: `1px solid ${C.border}`,
              borderRadius: 7, fontSize: 12, background: C.card,
              color: C.text, cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="score">Sort: Score ↓</option>
            <option value="yield">Sort: Yield ↓</option>
            <option value="psf">Sort: Price PSF ↓</option>
            <option value="name">Sort: Name A–Z</option>
          </select>

          <span style={{ fontSize: 12, color: C.muted, marginLeft: 'auto' }}>
            Showing <strong style={{ color: C.text }}>{filtered.length}</strong> area{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── AREA GRID ── */}
        {loading ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 100, flexDirection: 'column', gap: 16,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              border: `4px solid ${C.border}`, borderTopColor: C.orange,
              animation: 'spin 0.8s linear infinite',
            }} />
            <div style={{ fontSize: 13, color: C.muted }}>Loading all Dubai areas...</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            color: C.muted, fontSize: 14,
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            No areas found matching <strong>"{search}"</strong>
            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => { setSearch(''); setFilter('all') }}
                style={{
                  padding: '8px 18px', background: C.orangeL,
                  border: `1px solid rgba(200,115,42,0.3)`,
                  borderRadius: 7, color: C.orange, fontWeight: 700,
                  fontSize: 12, cursor: 'pointer',
                }}
              >Clear filters</button>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(255px, 1fr))',
            gap: 14,
          }}>
            {filtered.map(area => (
              <AreaCard
                key={area.area_id}
                area={area}
                onClick={() => setSelectedArea(buildAreaObj(area))}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input::placeholder { color: #9CA8B4; }
        select option { background: #fff; color: #1C1C28; }
        body { margin: 0; }
      `}</style>
    </div>
  )
}
