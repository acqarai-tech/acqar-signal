import { useState, useEffect } from 'react'
import { EventsProvider } from '../context/EventsContext'
import AllAreaSpecialistPage from '../components/AllAreaSpecialistPage'

const C = {
  bg: '#FAF8F5', bg2: '#F2EDE5',
  card: '#FFFFFF', border: '#E8E0D0',
  orange: '#C8732A', orangeL: 'rgba(200,115,42,0.09)',
  green: '#16A34A', greenL: 'rgba(22,163,74,0.1)',
  amber: '#D97706', amberL: 'rgba(217,119,6,0.1)',
  red: '#DC2626', redL: 'rgba(220,38,38,0.1)',
  text: '#1C1C28', muted: '#6E7A8A', muted2: '#9CA8B4',
}

function getVerdict(a) {
  const score = Number(a.investment_score) || 0
  return a.verdict || (score >= 75 ? 'BUY' : score >= 65 ? 'HOLD' : 'WATCH')
}
function verdictColor(v) {
  return v === 'BUY' ? C.green : v === 'HOLD' ? C.amber : C.red
}
function verdictBg(v) {
  return v === 'BUY' ? C.greenL : v === 'HOLD' ? C.amberL : C.redL
}

export default function AllAreasPage() {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedArea, setSelectedArea] = useState(null)

  const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
  const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

  useEffect(() => {
    fetch(
      `${SUPA_URL}/rest/v1/area_intelligence?select=area_id,area_name_en,investment_score,gross_yield_pct,truvalu_psm,distress_pct,tx_7d,verdict&order=area_name_en.asc&limit=500`,
      { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
    )
      .then(r => r.json())
      .then(data => { setAreas(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function buildAreaObj(a) {
    const score = Number(a.investment_score) || 60
    const psm   = Number(a.truvalu_psm) || 0
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

  const filtered = areas.filter(a =>
    !search || a.area_name_en?.toLowerCase().includes(search.toLowerCase())
  )

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
  height: '100vh', background: C.bg,
  fontFamily: "'Inter', sans-serif", color: C.text,
  display: 'flex', flexDirection: 'column',
  overflowY: 'auto',
}}>

      {/* ── HEADER ── */}
      <div style={{
        background: C.card, borderBottom: `1px solid ${C.border}`,
        padding: '0 28px', height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
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
          {loading ? '...' : `${areas.length} areas`} · May 2026
        </div>
      </div>

      <div style={{ padding: '24px 28px 60px' }}>

        {/* ── SEARCH ── */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search areas..."
          style={{
            width: '100%', maxWidth: 400,
            padding: '9px 14px', border: `1px solid ${C.border}`,
            borderRadius: 8, fontSize: 13, background: C.card,
            color: C.text, outline: 'none', boxSizing: 'border-box',
            marginBottom: 20, display: 'block',
          }}
        />

        {/* ── LOADING ── */}
        {loading ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 80, flexDirection: 'column', gap: 14,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              border: `4px solid ${C.border}`, borderTopColor: C.orange,
              animation: 'spin 0.8s linear infinite',
            }} />
            <div style={{ fontSize: 13, color: C.muted }}>Loading all Dubai areas...</div>
          </div>
        ) : (

          /* ── AREA LIST ── */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 8,
          }}>
            {filtered.map(area => {
              const verdict = getVerdict(area)
              return (
                <div
                  key={area.area_id}
                  onClick={() => setSelectedArea(buildAreaObj(area))}
                  style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderLeft: `3px solid ${verdictColor(verdict)}`,
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = C.orange
                    e.currentTarget.style.background = C.bg2
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = C.border
                    e.currentTarget.style.background = C.card
                  }}
                >
                  {/* Name + ID */}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                      {area.area_name_en}
                    </div>
                    <div style={{ fontSize: 10, color: C.muted2, marginTop: 2 }}>
                      #{area.area_id}
                    </div>
                  </div>

                  {/* Verdict badge + arrow */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
                      letterSpacing: '.08em', padding: '2px 8px', borderRadius: 4,
                      background: verdictBg(verdict), color: verdictColor(verdict),
                    }}>{verdict}</span>
                    <span style={{ fontSize: 12, color: C.orange, opacity: 0.4 }}>→</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── NO RESULTS ── */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: C.muted, fontSize: 14 }}>
            No areas match "<strong>{search}</strong>"
            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => setSearch('')}
                style={{
                  padding: '7px 16px', background: C.orangeL,
                  border: `1px solid rgba(200,115,42,0.3)`,
                  borderRadius: 7, color: C.orange,
                  fontWeight: 700, fontSize: 12, cursor: 'pointer',
                }}
              >Clear</button>
            </div>
          </div>
        )}

        {!loading && (
          <div style={{ marginTop: 20, fontSize: 11, color: C.muted2, textAlign: 'center' }}>
            Showing {filtered.length} of {areas.length} areas
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input::placeholder { color: #9CA8B4; }
        body { margin: 0; }
      `}</style>
    </div>
  )
}
