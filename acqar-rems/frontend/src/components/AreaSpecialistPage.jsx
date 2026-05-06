import { useState, useEffect, useRef } from 'react'
import { useEvents } from '../context/EventsContext'

// Data factories — in production, fetch from /api/areas/:areaName
function getAreaData(area) {
  const pricePerSqft = area.pricePerSqft || 1247
  const yieldPct = area.yield || 7.2
  const score = area.score || 67

  return {
    pricePerSqft,
    yieldPct,
    score,
    soldThisWeek: Math.round(100 + score * 1.2),
    daysToSell: Math.round(70 - score * 0.4),
    availableListings: Math.round(2000 + score * 40),
    marketMood: score >= 75 ? 'Bullish' : score >= 65 ? 'Cautious' : 'Slow',
    verdict: score >= 75 ? 'BUY' : score >= 65 ? 'HOLD' : 'WATCH',
    verdictColor: score >= 75 ? '#16A34A' : score >= 65 ? '#D97706' : '#DC2626',
    priceChange3M: score >= 70 ? '+2.1%' : score >= 60 ? '+0.8%' : '-1.2%',
    distressListings: Math.round(25 - score * 0.15),
  }
}

const SCORE_COMPS = (score) => [
  { label: 'Transaction activity', value: Math.round(score * 0.87), color: score >= 65 ? '#D97706' : '#DC2626' },
  { label: 'Price vs fair value', value: Math.round(score * 1.10), color: '#16A34A' },
  { label: 'Infrastructure pipeline', value: Math.round(score * 1.17), color: '#16A34A' },
  { label: 'Market sentiment', value: Math.round(score * 0.62), color: score >= 70 ? '#D97706' : '#DC2626' },
]

export default function AreaSpecialistPage({ area, onClose }) {
  const [activePersona, setActivePersona] = useState('buyer')
  const [activeTab, setActiveTab] = useState('market')
  const { events } = useEvents()

  const data = getAreaData(area)

  // Filter live events for this area
  const areaEvents = events.filter(e =>
    e.location_name?.toLowerCase().includes(area.name.toLowerCase().split(' ')[0].toLowerCase())
  ).slice(0, 5)

  const scoreComps = SCORE_COMPS(data.score)

  const s = { // inline style helpers
    card: {
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '10px',
      padding: '14px',
      marginBottom: '12px',
    },
    cardTitle: {
      fontSize: '10px', fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '0.1em', color: 'var(--text-muted)',
      marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    stRow: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '6px 0', borderBottom: '1px solid var(--border-color)', fontSize: '12px',
    },
  }

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-secondary)', fontFamily: "'Inter', sans-serif",
      overflow: 'hidden',
    }}>

      {/* ── HEADER ── */}
      <div style={{
        background: 'var(--bg-primary)', borderBottom: '2px solid #B87333',
        padding: '10px 14px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <button
            onClick={onClose}
            style={{
              fontSize: '12px', fontWeight: 600, padding: '5px 10px',
              background: 'var(--bg-input)', border: '1px solid var(--border-panel)',
              borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer',
              touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
            }}
          >← Areas</button>
          <div style={{
            fontSize: '10px', fontWeight: 800, padding: '4px 10px',
            background: `${data.verdictColor}22`, border: `1px solid ${data.verdictColor}44`,
            borderRadius: '12px', color: data.verdictColor, letterSpacing: '0.1em',
          }}>{data.verdict} • {data.score}/100</div>
        </div>

        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '2px' }}>
          📍 Dubai · {area.zone}
        </div>
        <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {area.name}
        </div>
      </div>

      {/* ── LIVE TICKER ── */}
      <div style={{
        background: 'rgba(22,163,74,0.08)', borderBottom: '1px solid var(--border-color)',
        padding: '5px 14px', display: 'flex', gap: '16px', overflowX: 'auto',
        flexShrink: 0, scrollbarWidth: 'none', fontSize: '11px',
      }}>
        <span style={{ fontWeight: 700, color: '#16A34A', whiteSpace: 'nowrap' }}>● LIVE</span>
        <span style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
          Sold: <strong style={{ color: 'var(--text-primary)' }}>{data.soldThisWeek}</strong>
        </span>
        <span style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
          Fair PSF: <strong style={{ color: 'var(--text-primary)' }}>AED {data.pricePerSqft.toLocaleString()}</strong>
        </span>
        <span style={{ whiteSpace: 'nowrap', color: '#16A34A', fontWeight: 600 }}>
          {data.yieldPct}% yield
        </span>
        <span style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
          Time to sell: <strong>{data.daysToSell}d</strong>
        </span>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>

        {/* Score card */}
        <div style={{
          ...s.card,
          display: 'flex', gap: '12px', alignItems: 'stretch',
        }}>
          {/* Score num */}
          <div style={{
            textAlign: 'center', padding: '10px 14px',
            background: `${data.verdictColor}11`,
            border: `1px solid ${data.verdictColor}33`,
            borderRadius: '8px', flexShrink: 0,
          }}>
            <div style={{ fontSize: '36px', fontWeight: 900, color: data.verdictColor, lineHeight: 1 }}>
              {data.score}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>/100</div>
            <div style={{
              fontSize: '10px', fontWeight: 800, color: data.verdictColor,
              letterSpacing: '0.1em', marginTop: '6px',
            }}>{data.verdict}</div>
          </div>

          {/* Score components */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
            {scoreComps.map(comp => (
              <div key={comp.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{comp.label}</span>
                <div style={{ width: '60px', height: '4px', background: 'var(--border-color)', borderRadius: '2px' }}>
                  <div style={{ width: `${comp.value}%`, height: '4px', background: comp.color, borderRadius: '2px' }} />
                </div>
                <span style={{ width: '24px', textAlign: 'right', fontWeight: 700, color: comp.color }}>{comp.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Brief */}
        <div style={{
          ...s.card,
          borderLeft: '3px solid #B87333',
        }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#B87333', letterSpacing: '0.12em', marginBottom: '6px' }}>
            🤖 AI AREA BRIEF
          </div>
          <div style={{ fontSize: '12px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{area.name}</strong> is navigating{' '}
            {data.score >= 75 ? 'a strong seller\'s market with elevated buyer demand and shrinking inventory.' :
              data.score >= 65 ? 'a short-term confidence gap driven by macro sentiment, not fundamental weakness.' :
                'a period of reduced activity — creating selective entry windows for patient investors.'}
            {' '}Gross rental yield of <strong style={{ color: '#16A34A' }}>{data.yieldPct}%</strong>{' '}
            {data.yieldPct > 6.1 ? 'outperforms' : 'tracks below'} Dubai's 6.1% average.
            Current asking prices are{' '}
            <strong>{data.pricePerSqft > 1200 ? 'slightly above' : 'near or below'}</strong> Truvalu™ fair-value benchmarks.
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <span>🕐 Updated today</span>
            <span>📊 14 live data sources</span>
            <span>🔄 Refreshes daily</span>
          </div>
        </div>

        {/* Persona tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          {[
            { key: 'buyer', icon: '🏠', label: 'Buying' },
            { key: 'investor', icon: '💼', label: 'Investing' },
            { key: 'owner', icon: '🔑', label: 'I Own Here' },
          ].map(p => (
            <button
              key={p.key}
              onClick={() => setActivePersona(p.key)}
              style={{
                flex: 1, padding: '8px 6px',
                border: `2px solid ${activePersona === p.key ? '#B87333' : 'var(--border-color)'}`,
                borderRadius: '8px',
                background: activePersona === p.key ? 'rgba(184,115,51,0.12)' : 'var(--bg-primary)',
                cursor: 'pointer', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
              }}
            >
              <span style={{ fontSize: '18px' }}>{p.icon}</span>
              <span style={{ fontSize: '9px', fontWeight: 700, color: activePersona === p.key ? '#B87333' : 'var(--text-muted)' }}>
                {p.label}
              </span>
            </button>
          ))}
        </div>

        {/* Tab bar */}
        <div style={{
          display: 'flex', borderBottom: '2px solid var(--border-color)',
          marginBottom: '12px', gap: '0', overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          {[
            { key: 'market', label: 'Market' },
            { key: 'signals', label: 'Live Signals' },
            { key: 'future', label: 'Catalysts' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '8px 14px', fontSize: '11px', fontWeight: 700,
                color: activeTab === tab.key ? '#B87333' : 'var(--text-muted)',
                borderBottom: `3px solid ${activeTab === tab.key ? '#B87333' : 'transparent'}`,
                marginBottom: '-2px', background: 'none', border: 'none',
                borderBottomWidth: '3px', borderBottomStyle: 'solid',
                borderBottomColor: activeTab === tab.key ? '#B87333' : 'transparent',
                cursor: 'pointer', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.06em',
                touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
              }}
            >{tab.label}</button>
          ))}
        </div>

        {/* ── MARKET TAB ── */}
        {activeTab === 'market' && (
          <div>
            {/* Key stats */}
            <div style={s.card}>
              <div style={s.cardTitle}>Key Market Stats</div>
              <div style={{ ...s.stRow }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Homes Sold This Week</span>
                <span style={{ fontWeight: 700, color: '#DC2626', fontSize: '12px' }}>{data.soldThisWeek}</span>
              </div>
              <div style={{ ...s.stRow }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Fair Price (Truvalu™)</span>
                <span style={{ fontWeight: 700, fontSize: '12px' }}>AED {data.pricePerSqft.toLocaleString()}/sqft</span>
              </div>
              <div style={{ ...s.stRow }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Rental Return / Year</span>
                <span style={{ fontWeight: 700, color: '#16A34A', fontSize: '12px' }}>{data.yieldPct}%</span>
              </div>
              <div style={{ ...s.stRow }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Avg Days to Sell</span>
                <span style={{ fontWeight: 700, color: '#D97706', fontSize: '12px' }}>{data.daysToSell} days</span>
              </div>
              <div style={{ ...s.stRow }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Available Listings</span>
                <span style={{ fontWeight: 700, fontSize: '12px' }}>{data.availableListings.toLocaleString()}</span>
              </div>
              <div style={{ ...s.stRow, borderBottom: 'none' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Market Mood</span>
                <span style={{ fontWeight: 700, color: data.verdictColor, fontSize: '12px' }}>{data.marketMood}</span>
              </div>
            </div>

            {/* Truvalu price table */}
            <div style={s.card}>
              <div style={s.cardTitle}>Truvalu™ Price Benchmarks</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr>
                    {['Type', 'Truvalu™', 'Ask PSF', 'Status'].map(h => (
                      <th key={h} style={{ padding: '5px 8px', textAlign: 'left', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', fontWeight: 700 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: 'Studio', fair: data.pricePerSqft - 67, ask: data.pricePerSqft - 55, delta: -1.8 },
                    { type: '1 BR', fair: data.pricePerSqft, ask: data.pricePerSqft + 51, delta: 4.1 },
                    { type: '2 BR', fair: data.pricePerSqft - 33, ask: data.pricePerSqft - 79, delta: -3.8 },
                    { type: '3 BR', fair: data.pricePerSqft - 52, ask: data.pricePerSqft - 69, delta: -1.4 },
                    { type: 'TH 3BR', fair: data.pricePerSqft + 93, ask: data.pricePerSqft + 38, delta: -4.1 },
                  ].map(row => (
                    <tr key={row.type}>
                      <td style={{ padding: '7px 8px', borderBottom: '1px solid var(--border-color)', fontSize: '11px', fontWeight: 600 }}>{row.type}</td>
                      <td style={{ padding: '7px 8px', borderBottom: '1px solid var(--border-color)', fontSize: '11px' }}>AED {row.fair.toLocaleString()}</td>
                      <td style={{ padding: '7px 8px', borderBottom: '1px solid var(--border-color)', fontSize: '11px' }}>{row.ask.toLocaleString()}</td>
                      <td style={{ padding: '7px 8px', borderBottom: '1px solid var(--border-color)', fontSize: '11px' }}>
                        <span style={{
                          fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
                          background: row.delta < -2 ? 'rgba(22,163,74,0.12)' : row.delta < 2 ? 'rgba(217,119,6,0.12)' : 'rgba(220,38,38,0.1)',
                          color: row.delta < -2 ? '#16A34A' : row.delta < 2 ? '#D97706' : '#DC2626',
                        }}>
                          {row.delta > 0 ? '+' : ''}{row.delta}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Buyer nationalities */}
            <div style={s.card}>
              <div style={s.cardTitle}>Buyer Nationality — 90 Days</div>
              {[
                { flag: '🇮🇳', name: 'Indian', pct: 31 },
                { flag: '🇬🇧', name: 'British', pct: 18 },
                { flag: '🇷🇺', name: 'Russian', pct: 14 },
                { flag: '🇵🇰', name: 'Pakistani', pct: 9 },
                { flag: '🇨🇳', name: 'Chinese', pct: 6 },
                { flag: '🌍', name: 'Other', pct: 22 },
              ].map(n => (
                <div key={n.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                  <span style={{ fontSize: '14px', width: '20px' }}>{n.flag}</span>
                  <span style={{ fontSize: '11px', width: '68px', flexShrink: 0, color: 'var(--text-secondary)' }}>{n.name}</span>
                  <div style={{ flex: 1, height: '5px', background: 'var(--border-color)', borderRadius: '3px' }}>
                    <div style={{ width: `${(n.pct / 31) * 100}%`, height: '5px', background: '#B87333', borderRadius: '3px' }} />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, width: '26px', textAlign: 'right', color: 'var(--text-muted)' }}>{n.pct}%</span>
                </div>
              ))}
            </div>

            {/* Persona-specific content */}
            {activePersona === 'buyer' && (
              <div style={s.card}>
                <div style={s.cardTitle}>🏠 First-Time Buyer Guide for {area.name}</div>
                {[
                  { num: 1, title: 'Understand what a fair price looks like here', body: `Our Truvalu™ system shows fair value at AED ${data.pricePerSqft.toLocaleString()}/sqft. If someone asks significantly more — that's a red flag. Below fair value — that's a genuine opportunity.` },
                  { num: 2, title: 'Check upcoming infrastructure', body: `Look at the Catalysts tab to see what\'s coming. Infrastructure like metro stations and schools consistently drives 8–14% price appreciation nearby.` },
                  { num: 3, title: "Don't panic about the current market news", body: `Dubai has recovered from every past shock — oil crashes, COVID, geopolitical events. The Resilience section shows this pattern clearly.` },
                ].map(step => (
                  <div key={step.num} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', background: '#B87333',
                      color: '#fff', fontSize: '11px', fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>{step.num}</div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>{step.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activePersona === 'investor' && (
              <div style={s.card}>
                <div style={s.cardTitle}>💼 Investment Metrics</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  {[
                    { label: 'Gross Yield', value: `${data.yieldPct}%`, color: '#16A34A' },
                    { label: 'Dubai Avg', value: '6.1%', color: 'var(--text-muted)' },
                    { label: '3M Price Change', value: data.priceChange3M, color: data.priceChange3M.startsWith('+') ? '#16A34A' : '#DC2626' },
                    { label: 'Distress Listings', value: `${data.distressListings}%`, color: '#D97706' },
                  ].map(m => (
                    <div key={m.label} style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-panel)' }}>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: m.color }}>{m.value}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activePersona === 'owner' && (
              <div style={{
                ...s.card,
                background: 'rgba(184,115,51,0.06)',
                border: '1px solid rgba(184,115,51,0.2)',
              }}>
                <div style={s.cardTitle}>🔑 Your Property Value Estimate</div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#B87333', marginBottom: '4px' }}>
                  AED {data.pricePerSqft.toLocaleString()}<span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-muted)' }}>/sqft</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Truvalu™ benchmark • {new Date().toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {data.verdict === 'BUY'
                    ? `Market conditions are strong. If you're considering selling, now is a favorable window. Buyer demand is elevated and days-on-market is low at ${data.daysToSell} days.`
                    : data.verdict === 'HOLD'
                    ? `Hold your property through the current slowdown. Fundamentals remain intact with ${data.yieldPct}% yield if renting. Consider selling when market momentum returns in 2–3 quarters.`
                    : `Market is soft. Hold unless you have a compelling reason to sell. Rental income at ${data.yieldPct}% yield provides a strong hold case while you wait for recovery.`}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── LIVE SIGNALS TAB ── */}
        {activeTab === 'signals' && (
          <div>
            {areaEvents.length > 0 ? (
              areaEvents.map(event => (
                <div key={event.id} style={s.card}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', marginTop: '4px', flexShrink: 0,
                      background: event.severity >= 4 ? '#DC2626' : event.severity >= 3 ? '#D97706' : '#16A34A',
                    }} />
                    <div>
                      <div style={{ fontSize: '11px', color: '#B87333', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>
                        {event.category} · S{event.severity}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.4 }}>
                        {event.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        📡 {event.signal_count} signals · 🎯 {Math.round(event.confidence * 100)}% confidence
                      </div>
                      {event.price_aed && (
                        <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '3px', fontWeight: 600 }}>
                          💰 AED {(event.price_aed / 1000000).toFixed(1)}M
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>📡</div>
                <div style={{ fontSize: '12px' }}>No live signals for {area.name} right now.</div>
                <div style={{ fontSize: '11px', marginTop: '4px' }}>Check back shortly — signals update every 5 minutes.</div>
              </div>
            )}

            {/* General market stats as signals */}
            <div style={s.card}>
              <div style={s.cardTitle}>📊 Truvalu™ Market Intelligence</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                Based on {data.soldThisWeek} transactions this week, Truvalu™ benchmarks{' '}
                <strong style={{ color: 'var(--text-primary)' }}>
                  {area.name} at AED {data.pricePerSqft.toLocaleString()}/sqft
                </strong>
                {' '}— {data.priceChange3M.startsWith('+') ? 'up' : 'down'} {data.priceChange3M} over 3 months.
                Gross rental yields of <strong style={{ color: '#16A34A' }}>{data.yieldPct}%</strong>{' '}
                continue to outperform Dubai's city average of 6.1%.
              </div>
            </div>
          </div>
        )}

        {/* ── CATALYSTS TAB ── */}
        {activeTab === 'future' && (
          <div>
            <div style={s.card}>
              <div style={s.cardTitle}>
                Infrastructure & Catalyst Timeline
                <span style={{ fontSize: '9px', padding: '2px 7px', borderRadius: '4px', background: 'var(--bg-input)', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>
                  Confirmed · Announced · Likely
                </span>
              </div>

              {/* Timeline items — adapt based on area */}
              <div style={{ paddingLeft: '20px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '6px', top: '6px', bottom: '6px', width: '2px', background: 'var(--border-color)', borderRadius: '1px' }} />

                {[
                  {
                    year: 'Q4 2026', tag: 'Confirmed', tagColor: '#16A34A',
                    title: 'Metro Blue Line — Nearby Station',
                    desc: `Direct metro connectivity arriving Q4 2026. Metro stations historically drive 8–14% PSF appreciation within 1km radius.`,
                    impact: '+8–14% PSF (1km radius)',
                  },
                  {
                    year: 'Q2 2027', tag: 'Announced', tagColor: '#2563EB',
                    title: 'Mall Expansion + Retail Anchor',
                    desc: `Major retail expansion confirmed. Shifts area occupant profile towards families. Strong positive for rental demand and 2–3BR units.`,
                    impact: '+5–8% rental demand',
                  },
                  {
                    year: 'Q3 2027', tag: 'Announced', tagColor: '#2563EB',
                    title: 'International School — Announced',
                    desc: `Education infrastructure arriving. Will significantly boost family-buyer ratio and demand for larger units.`,
                    impact: '+12–18% demand for 2–3BR',
                  },
                  {
                    year: '2027+', tag: 'Likely', tagColor: '#D97706',
                    title: 'Al Maktoum Airport Phase 2 (15min)',
                    desc: `AED 128B project confirmed as world's largest airport by 2040. Long-term residential and business travel demand uplift.`,
                    impact: 'Long-term valuation tailwind',
                  },
                ].map((item, i) => (
                  <div key={i} style={{ position: 'relative', marginBottom: '20px' }}>
                    <div style={{
                      position: 'absolute', left: '-18px', top: '4px',
                      width: '12px', height: '12px', borderRadius: '50%',
                      background: item.tagColor, border: '2px solid var(--bg-secondary)',
                    }} />
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '3px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                        {item.year}
                      </span>
                      <span style={{
                        fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px',
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        background: `${item.tagColor}18`, color: item.tagColor,
                      }}>{item.tag}</span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>{item.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '5px' }}>{item.desc}</div>
                    <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>📈 {item.impact}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Catalyst score */}
            <div style={s.card}>
              <div style={s.cardTitle}>Catalyst Score</div>
              <div style={{ fontSize: '38px', fontWeight: 900, color: '#16A34A', textAlign: 'center', marginBottom: '8px' }}>
                {Math.round(data.score * 1.18 > 100 ? 98 : data.score * 1.18)}/100
              </div>
              <div style={{ ...s.stRow }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Confirmed infrastructure</span>
                <span style={{ fontWeight: 700, color: '#16A34A', fontSize: '12px' }}>2 items</span>
              </div>
              <div style={{ ...s.stRow }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Announced (pending)</span>
                <span style={{ fontWeight: 700, color: '#2563EB', fontSize: '12px' }}>2 items</span>
              </div>
              <div style={{ ...s.stRow }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Dubai 2040 zone alignment</span>
                <span style={{ fontWeight: 700, color: '#16A34A', fontSize: '12px' }}>Strong</span>
              </div>
              <div style={{ ...s.stRow, borderBottom: 'none' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Transport improvement</span>
                <span style={{ fontWeight: 700, color: '#16A34A', fontSize: '12px' }}>Metro Q4 2026</span>
              </div>
            </div>
          </div>
        )}

        {/* Free ValuCheck CTA */}
        <div style={{
          background: 'rgba(184,115,51,0.08)', border: '1px solid rgba(184,115,51,0.2)',
          borderRadius: '10px', padding: '14px 16px', marginTop: '4px', marginBottom: '8px',
          display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
            🏷️ Free ValuCheck™ for {area.name}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Get a precise Truvalu™ valuation for a specific property — includes floor level, view, and condition adjustments.
          </div>
          <a
            href="https://www.acqar.com/valuation"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block', textAlign: 'center', padding: '10px',
              background: '#B87333', borderRadius: '7px', color: '#fff',
              fontSize: '12px', fontWeight: 700, textDecoration: 'none',
            }}
          >Run Free ValuCheck™ →</a>
        </div>

      </div>
    </div>
  )
}
