// import { useState, useEffect } from 'react'
// import { EventsProvider } from '../context/EventsContext'
// import AllAreaSpecialistPage from '../components/AllAreaSpecialistPage'

// const C = {
//   bg: '#FAF8F5', bg2: '#F2EDE5',
//   card: '#FFFFFF', border: '#E8E0D0',
//   orange: '#C8732A', orangeL: 'rgba(200,115,42,0.09)',
//   green: '#16A34A', greenL: 'rgba(22,163,74,0.1)',
//   amber: '#D97706', amberL: 'rgba(217,119,6,0.1)',
//   red: '#DC2626', redL: 'rgba(220,38,38,0.1)',
//   text: '#1C1C28', muted: '#6E7A8A', muted2: '#9CA8B4',
// }

// function getVerdict(a) {
//   const score = Number(a.investment_score) || 0
//   return a.verdict || (score >= 75 ? 'BUY' : score >= 65 ? 'HOLD' : 'WATCH')
// }
// function verdictColor(v) {
//   return v === 'BUY' ? C.green : v === 'HOLD' ? C.amber : C.red
// }
// function verdictBg(v) {
//   return v === 'BUY' ? C.greenL : v === 'HOLD' ? C.amberL : C.redL
// }

// export default function AllAreasPage() {
//   const [areas, setAreas] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [search, setSearch] = useState('')
//   const [selectedArea, setSelectedArea] = useState(null)

//   const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
//   const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

//   useEffect(() => {
//     fetch(
//       `${SUPA_URL}/rest/v1/area_intelligence?select=area_id,area_name_en,investment_score,gross_yield_pct,truvalu_psm,distress_pct,tx_7d,verdict&order=area_name_en.asc&limit=500`,
//       { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
//     )
//       .then(r => r.json())
//       .then(data => { setAreas(data || []); setLoading(false) })
//       .catch(() => setLoading(false))
//   }, [])

//   function buildAreaObj(a) {
//     const score = Number(a.investment_score) || 60
//     const psm   = Number(a.truvalu_psm) || 0
//     const psf   = psm ? Math.round(psm / 10.764) : 1200
//     return {
//       name:         a.area_name_en,
//       zone:         score >= 75 ? 'Prime' : score >= 65 ? 'Mid-Market' : 'Emerging',
//       pricePerSqft: psf,
//       yield:        Number(a.gross_yield_pct) || 6.5,
//       score,
//       area_id:      a.area_id,
//     }
//   }

//   const filtered = areas.filter(a =>
//     !search || a.area_name_en?.toLowerCase().includes(search.toLowerCase())
//   )

//   // ── If area selected, show detail page ──
//   if (selectedArea) {
//     return (
//       <EventsProvider>
//         <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
//           <AllAreaSpecialistPage
//             area={selectedArea}
//             onClose={() => setSelectedArea(null)}
//           />
//         </div>
//       </EventsProvider>
//     )
//   }

//   return (
//     <div style={{
//   height: '100vh', background: C.bg,
//   fontFamily: "'Inter', sans-serif", color: C.text,
//   display: 'flex', flexDirection: 'column',
//   overflowY: 'auto',
// }}>

//       {/* ── HEADER ── */}
//       <div style={{
//         background: C.card, borderBottom: `1px solid ${C.border}`,
//         padding: '0 28px', height: 52,
//         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//         position: 'sticky', top: 0, zIndex: 100,
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//           <span style={{ fontWeight: 900, fontSize: 17, letterSpacing: '0.12em' }}>
//             <span style={{ color: C.orange }}>ACQ</span>
//             <span style={{ color: C.text }}>AR</span>
//           </span>
//           <span style={{
//             fontSize: 10, fontWeight: 700, color: C.orange,
//             letterSpacing: '1.5px', textTransform: 'uppercase',
//             padding: '3px 10px', borderRadius: 4,
//             background: C.orangeL, border: `1px solid rgba(200,115,42,0.35)`,
//           }}>SIGNAL™</span>
//           <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>
//             · All Dubai Areas
//           </span>
//         </div>
//         <div style={{ fontSize: 11, color: C.muted }}>
//           {loading ? '...' : `${areas.length} areas`} · May 2026
//         </div>
//       </div>

//       <div style={{ padding: '24px 28px 60px' }}>

//         {/* ── SEARCH ── */}
//         <input
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           placeholder="🔍  Search areas..."
//           style={{
//             width: '100%', maxWidth: 400,
//             padding: '9px 14px', border: `1px solid ${C.border}`,
//             borderRadius: 8, fontSize: 13, background: C.card,
//             color: C.text, outline: 'none', boxSizing: 'border-box',
//             marginBottom: 20, display: 'block',
//           }}
//         />

//         {/* ── LOADING ── */}
//         {loading ? (
//           <div style={{
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             padding: 80, flexDirection: 'column', gap: 14,
//           }}>
//             <div style={{
//               width: 34, height: 34, borderRadius: '50%',
//               border: `4px solid ${C.border}`, borderTopColor: C.orange,
//               animation: 'spin 0.8s linear infinite',
//             }} />
//             <div style={{ fontSize: 13, color: C.muted }}>Loading all Dubai areas...</div>
//           </div>
//         ) : (

//           /* ── AREA LIST ── */
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
//             gap: 8,
//           }}>
//             {filtered.map(area => {
//               const verdict = getVerdict(area)
//               return (
//                 <div
//                   key={area.area_id}
//                   onClick={() => setSelectedArea(buildAreaObj(area))}
//                   style={{
//                     display: 'flex', alignItems: 'center',
//                     justifyContent: 'space-between',
//                     padding: '12px 16px',
//                     background: C.card,
//                     border: `1px solid ${C.border}`,
//                     borderLeft: `3px solid ${verdictColor(verdict)}`,
//                     borderRadius: 8,
//                     cursor: 'pointer',
//                     transition: 'all 0.12s',
//                   }}
//                   onMouseEnter={e => {
//                     e.currentTarget.style.borderColor = C.orange
//                     e.currentTarget.style.background = C.bg2
//                   }}
//                   onMouseLeave={e => {
//                     e.currentTarget.style.borderColor = C.border
//                     e.currentTarget.style.background = C.card
//                   }}
//                 >
//                   {/* Name + ID */}
//                   <div>
//                     <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
//                       {area.area_name_en}
//                     </div>
//                     <div style={{ fontSize: 10, color: C.muted2, marginTop: 2 }}>
//                       #{area.area_id}
//                     </div>
//                   </div>

//                   {/* Verdict badge + arrow */}
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
//                     <span style={{
//                       fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
//                       letterSpacing: '.08em', padding: '2px 8px', borderRadius: 4,
//                       background: verdictBg(verdict), color: verdictColor(verdict),
//                     }}>{verdict}</span>
//                     <span style={{ fontSize: 12, color: C.orange, opacity: 0.4 }}>→</span>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         )}

//         {/* ── NO RESULTS ── */}
//         {!loading && filtered.length === 0 && (
//           <div style={{ textAlign: 'center', padding: 60, color: C.muted, fontSize: 14 }}>
//             No areas match "<strong>{search}</strong>"
//             <div style={{ marginTop: 10 }}>
//               <button
//                 onClick={() => setSearch('')}
//                 style={{
//                   padding: '7px 16px', background: C.orangeL,
//                   border: `1px solid rgba(200,115,42,0.3)`,
//                   borderRadius: 7, color: C.orange,
//                   fontWeight: 700, fontSize: 12, cursor: 'pointer',
//                 }}
//               >Clear</button>
//             </div>
//           </div>
//         )}

//         {!loading && (
//           <div style={{ marginTop: 20, fontSize: 11, color: C.muted2, textAlign: 'center' }}>
//             Showing {filtered.length} of {areas.length} areas
//           </div>
//         )}
//       </div>

//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg); } }
//         * { box-sizing: border-box; }
//         input::placeholder { color: #9CA8B4; }
//         body { margin: 0; }
//       `}</style>
//     </div>
//   )
// }














import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { EventsProvider } from '../context/EventsContext'
import AllAreaSpecialistPage from '../components/AllAreaSpecialistPage'

const C = {
  bg: '#FAF8F5', bg2: '#F2EDE5',
  card: '#FFFFFF', border: '#E8E0D0',
  orange: '#C8732A', orangeL: 'rgba(200,115,42,0.09)',
  // Fixed: BUY=green, WATCH=amber, HOLD=red
  green: '#118b3e', greenL: 'rgba(22,163,74,0.08)',
  amber: '#B45309', amberL: 'rgba(180,83,9,0.08)',
  red: '#a73535', redL: 'rgba(220,38,38,0.08)',
  text: '#1C1C28', muted: '#6E7A8A', muted2: '#9CA8B4',
  copper: '#B87333',
}

function getVerdict(a) {
  const score = Number(a.investment_score) || 0
  // Normalize verdict to uppercase for consistent comparison
  const raw = a.verdict ? a.verdict.toUpperCase() : null
  if (raw) return raw
  return score >= 75 ? 'BUY' : score >= 50 ? 'WATCH' : 'HOLD'
}

function verdictColor(v) {
  if (v === 'BUY') return C.green
  if (v === 'WATCH') return C.amber
  return C.red // HOLD
}

function verdictBg(v) {
  if (v === 'BUY') return C.greenL
  if (v === 'WATCH') return C.amberL
  return C.redL // HOLD
}

// ── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  const navigate = useNavigate()
  return (
    <>
      <style>{`
        .acq-footer-new {
          position: relative;
          background: #F5F5F4;
          border-top: 1px solid rgba(10,10,10,0.06);
          font-family: 'Inter', sans-serif;
          flex-shrink: 0;
        }
        .acq-footer-new .copper-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #B87333 35%, #B87333 65%, transparent 100%);
        }
        .acq-footer-new .inner {
          max-width: 100%;
          margin: 0 auto;
          padding: 48px 80px 32px;
        }
        .acq-footer-new .main-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1fr 1fr;
          gap: 32px;
          margin-bottom: 48px;
        }
        .acq-footer-new .col-heading {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }
        .acq-footer-new .col-heading-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #B87333;
          opacity: 0.7;
        }
        .acq-footer-new .col-heading h6 {
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.28em;
          color: #0A0A0A;
          margin: 0;
        }
        .acq-footer-new ul {
          list-style: none;
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .acq-footer-new ul li {
          font-size: 11.5px;
          font-weight: 600;
          color: rgba(10,10,10,0.55);
          cursor: pointer;
          transition: color 0.2s;
        }
        .acq-footer-new ul li:hover { color: #B87333; }
        .acq-footer-new ul li.muted {
          color: rgba(10,10,10,0.55);
          cursor: default;
        }
        .acq-footer-new ul li a {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s;
        }
        .acq-footer-new ul li a:hover { color: #B87333; }
        .acq-footer-new .social-row { display: flex; gap: 12px; }
        .acq-footer-new .social-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(10,10,10,0.09);
          background: rgba(255,255,255,0.6);
          display: flex; align-items: center; justify-content: center;
          color: rgba(10,10,10,0.35);
          text-decoration: none;
          transition: all 0.2s;
        }
        .acq-footer-new .social-btn:hover {
          color: #B87333;
          border-color: rgba(184,115,51,0.4);
        }
        .acq-footer-new .bottom-bar {
          border-top: 1px solid rgba(10,10,10,0.06);
          padding-top: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          width: 100%;
        }
        .acq-footer-new .bottom-bar p {
          font-weight: 700;
          color: rgba(10,10,10,0.3);
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.2em;
          margin: 0;
        }
        .acq-footer-new .bottom-bar .not-advice {
          font-weight: 500;
          color: rgba(10,10,10,0.25);
          font-size: 10px;
          margin: 0;
        }
        .acq-footer-new .bottom-location {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .acq-footer-new .bottom-location .logo {
          font-weight: 900;
          font-size: 10px;
          letter-spacing: 0.05em;
        }
        .acq-footer-new .bottom-location .divider {
          width: 1px; height: 12px;
          background: rgba(10,10,10,0.15);
        }
        .acq-footer-new .bottom-location .city {
          font-weight: 600;
          color: rgba(10,10,10,0.35);
          font-size: 10px;
          letter-spacing: 0.05em;
        }
        @media (max-width: 1024px) {
          .acq-footer-new .inner { padding: 48px 32px 32px; }
          .acq-footer-new .main-grid { grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
        }
        @media (max-width: 768px) {
          .acq-footer-new .inner { padding: 40px 24px 24px; }
          .acq-footer-new .main-grid { grid-template-columns: 1fr 1fr; gap: 32px 16px; }
          .acq-footer-new .bottom-bar { flex-direction: column; text-align: center; justify-content: center; }
          .acq-footer-new .bottom-location { justify-content: center; }
          .acq-footer-new .not-advice { display: none; }
        }
        @media (max-width: 480px) {
          .acq-footer-new .inner { padding: 40px 16px 20px; }
          .acq-footer-new .main-grid { grid-template-columns: 1fr; gap: 28px; }
        }
      `}</style>

      <footer className="acq-footer-new">
        <div className="copper-line" />
        <div className="inner">
          <div className="main-grid">

            {/* Brand */}
            <div>
              <div style={{ marginBottom: 24, lineHeight: 1 }}>
                <span style={{ fontWeight: 900, fontSize: 22, letterSpacing: '-0.5px' }}>
                  <span style={{ color: '#B87333' }}>ACQ</span>
                  <span style={{ color: '#111111' }}>AR</span>
                </span>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.75, color: 'rgba(10,10,10,0.5)', fontWeight: 500, marginBottom: 28, maxWidth: 280 }}>
                An AI-powered property intelligence platform built exclusively for Dubai real estate. Independent, institutional-quality, and always on.
              </p>
              <div className="social-row">
                {[
                  {
                    href: 'https://www.linkedin.com/company/acqar', label: 'LinkedIn',
                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  },
                  {
                    href: 'https://www.instagram.com/acqar.dxb/', label: 'Instagram',
                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  },
                ].map(({ href, label, icon }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="social-btn">{icon}</a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <div className="col-heading">
                <span className="col-heading-dot" />
                <h6>Product</h6>
              </div>
              <ul>
                <li><a href="https://www.acqar.com/truvalu" target="_blank" rel="noopener noreferrer">ACQAR TRUVALU™</a></li>
                <li><a href="http://www.acqar.com/" target="_blank" rel="noopener noreferrer">ACQAR SIGNAL™</a></li>
                <li className="muted">ACQAR PASSPORT™</li>
                <li onClick={() => navigate('/pricing')}>PRICING</li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <div className="col-heading">
                <span className="col-heading-dot" />
                <h6>Company</h6>
              </div>
              <ul>
                {['About ACQAR', 'Contact Us'].map(l => (<li key={l}>{l}</li>))}
                <li><a href="/broker" style={{ color: 'inherit', textDecoration: 'none' }}>Brokers</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <div className="col-heading">
                <span className="col-heading-dot" />
                <h6>Legal & Info</h6>
              </div>
              <ul>
                <li onClick={() => window.open('https://www.acqar.com/blogs', '_blank')}>Intelligence Blog</li>
                <li onClick={() => navigate('/terms')}>Terms of Use</li>
                <li onClick={() => navigate('/terms')}>Privacy Policy</li>
              </ul>
            </div>

            {/* Comparisons */}
            <div>
              <div className="col-heading">
                <span className="col-heading-dot" />
                <h6>Comparisons</h6>
              </div>
              <ul>
                {['vs Bayut TruEstimate', 'vs Property Finder', 'vs Traditional Valuers', 'Why ACQAR?'].map(l => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>

          </div>

          <div className="bottom-bar">
            <div className="bottom-location">
              <span className="logo">
                <span style={{ color: '#B87333' }}>ACQ</span>
                <span style={{ color: '#0A0A0A' }}>AR</span>
              </span>
              <span className="divider" />
              <span className="city">Dubai, United Arab Emirates</span>
            </div>
            <p>© 2026 ACQARLABS L.L.C-FZ. All rights reserved.</p>
            <p className="not-advice">Not financial advice.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
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
    const psm = Number(a.truvalu_psm) || 0
    const psf = psm ? Math.round(psm / 10.764) : 1200
    return {
      name: a.area_name_en,
      zone: score >= 75 ? 'Prime' : score >= 65 ? 'Mid-Market' : 'Emerging',
      pricePerSqft: psf,
      yield: Number(a.gross_yield_pct) || 6.5,
      score,
      area_id: a.area_id,
    }
  }

  const isMobile = window.innerWidth <= 768

  const filtered = areas.filter(a =>
    !search || a.area_name_en?.toLowerCase().includes(search.toLowerCase())
  )

  if (selectedArea) {
    return (
      <EventsProvider>
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
          <AllAreaSpecialistPage area={selectedArea} onClose={() => setSelectedArea(null)} />
        </div>
      </EventsProvider>
    )
  }

  return (
    <div style={{
  minHeight: '100vh',
  background: C.bg,
  fontFamily: "'Inter', sans-serif",
  color: C.text,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
}}>

      {/* ── HEADER ── */}
      <div style={{
        background: C.card,
        borderBottom: `1px solid ${C.border}`,
       height: 52,
padding: isMobile ? '0 12px' : '0 28px',
flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
      }}>
        {/* Left: Logo + badge only — no subtitle text */}
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
        </div>

     {/* Right: verdict legend */}
<div className="verdict-legend" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
  {[['BUY', C.green, C.greenL], ['WATCH', C.amber, C.amberL], ['HOLD', C.red, C.redL]].map(([label, color, bg]) => (
    <span key={label} style={{
      fontSize: 9, fontWeight: 800, letterSpacing: '.08em',
      padding: '2px 8px', borderRadius: 4,
      background: bg, color,
    }}>{label}</span>
  ))}
</div>

      {/* ── BODY ── */}
      <div style={{ flex: 1, padding: '24px 28px 40px' }}>

        {/* Search */}
        <div style={{ marginBottom: 20, position: 'relative', maxWidth: 400 }}>
          <span style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            fontSize: 13, pointerEvents: 'none', color: C.muted2,
          }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search areas..."
            style={{
              width: '100%',
              padding: '9px 14px 9px 34px',
              border: `1px solid ${C.border}`,
              borderRadius: 8, fontSize: 13,
              background: C.card, color: C.text,
              outline: 'none', boxSizing: 'border-box',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = C.orange}
            onBlur={e => e.target.style.borderColor = C.border}
          />
        </div>

        {/* Loading */}
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
          /* Area grid */
         <div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: 8,
}}>
            {filtered.map(area => {
              const verdict = getVerdict(area)
              const vColor = verdictColor(verdict)
              const vBg = verdictBg(verdict)
              return (
                <div
                  key={area.area_id}
                  onClick={() => setSelectedArea(buildAreaObj(area))}
                  className="area-card"
                  style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderLeft: `3px solid ${vColor}`,
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = `0 4px 14px rgba(0,0,0,0.09)`
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.borderTopColor = C.orange
                    e.currentTarget.style.borderRightColor = C.orange
                    e.currentTarget.style.borderBottomColor = C.orange
                    e.currentTarget.style.background = C.bg2
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.borderTopColor = C.border
                    e.currentTarget.style.borderRightColor = C.border
                    e.currentTarget.style.borderBottomColor = C.border
                    e.currentTarget.style.background = C.card
                  }}
                >
                  {/* Name */}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                      {area.area_name_en}
                    </div>
                  </div>

                  {/* Verdict badge + arrow */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
                      letterSpacing: '.08em', padding: '3px 9px', borderRadius: 4,
                      background: vBg, color: vColor,
                      border: `1px solid ${vColor}22`,
                    }}>{verdict}</span>
                    <span style={{ fontSize: 12, color: C.orange, opacity: 0.4 }}>→</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* No results */}
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

        {/* Count */}
        {!loading && filtered.length > 0 && (
          <div style={{ marginTop: 20, fontSize: 11, color: C.muted2, textAlign: 'center' }}>
            Showing {filtered.length} of {areas.length} areas
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <Footer />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .verdict-legend { display: none !important; } }
        * { box-sizing: border-box; }
        input::placeholder { color: #9CA8B4; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.border}; border-radius: 99px; }
        ::-webkit-scrollbar-thumb { background: ${C.orange}; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #a85f20; }
      `}</style>
    </div>
  )
}
