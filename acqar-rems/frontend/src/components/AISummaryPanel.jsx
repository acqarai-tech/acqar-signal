import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function renderMarkdown(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={i} style={{ color: '#B87333', fontWeight: 700 }}>
          {part.slice(2, -2)}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

function SummaryContent({ text }) {
  const paragraphs = text.split('\n').filter(function(line) { return line.trim() })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {paragraphs.map(function(para, i) {
        return (
          <p key={i} style={{
            fontSize: '11px',
            lineHeight: '1.7',
            color: '#B3B3B3',
            margin: 0,
          }}>
            {renderMarkdown(para)}
          </p>
        )
      })}
    </div>
  )
}

function UpgradeGate() {
  return (
    <div style={{
      padding: '16px 12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
      textAlign: 'center',
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'rgba(184,115,51,0.1)',
        border: '1px solid rgba(184,115,51,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
      }}>
        {'🔒'}
      </div>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#B87333', marginBottom: '4px' }}>
          AI Daily Briefing
        </div>
        <div style={{ fontSize: '10px', color: '#666', lineHeight: '1.5' }}>
          24-hour AI intelligence summary generated from live Dubai RE signals.
        </div>
      </div>
      
        href="https://acqar.ai"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          width: '100%',
          padding: '7px 12px',
          background: '#B87333',
          color: 'white',
          borderRadius: '5px',
          textDecoration: 'none',
          fontSize: '11px',
          fontWeight: 700,
          textAlign: 'center',
        }}
      >
        Upgrade to PRO
      </a>
    </div>
  )
}

export default function AISummaryPanel({ userPlan }) {
  var plan = userPlan || 'free'
  var isPro = plan === 'pro'

  var [summary, setSummary] = useState(null)
  var [loading, setLoading] = useState(false)
  var [error, setError] = useState(null)
  var [meta, setMeta] = useState(null)
  var [expanded, setExpanded] = useState(true)

  function fetchSummary() {
    if (!isPro) return
    setLoading(true)
    setError(null)
    fetch(API + '/api/summary', {
      headers: { 'x-user-plan': 'pro' },
    })
      .then(function(res) {
        if (!res.ok) {
          return res.json().then(function(err) {
            throw new Error((err && err.detail && err.detail.message) || 'Failed to load briefing')
          })
        }
        return res.json()
      })
      .then(function(data) {
        setSummary(data.summary)
        setMeta({
          generated_at: data.generated_at,
          event_count: data.event_count,
          cached: data.cached,
          expires_in: data.cache_expires_in,
        })
      })
      .catch(function(e) {
        setError(e.message)
      })
      .finally(function() {
        setLoading(false)
      })
  }

  function forceRefresh(e) {
    e.stopPropagation()
    setLoading(true)
    fetch(API + '/api/summary/refresh', {
      method: 'POST',
      headers: { 'x-user-plan': 'pro' },
    })
      .then(function() {
        fetchSummary()
      })
      .catch(function(e) {
        setError(e.message)
        setLoading(false)
      })
  }

  useEffect(function() {
    if (isPro) fetchSummary()
  }, [isPro])

  function formatTime(ts) {
    if (!ts) return ''
    return new Date(ts * 1000).toLocaleTimeString('en-AE', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function formatExpiry(secs) {
    if (!secs) return ''
    return 'refreshes in ' + Math.round(secs / 60) + 'm'
  }

  return (
    <div style={{
      background: '#16213E',
      borderBottom: '1px solid #0F3460',
      flexShrink: 0,
    }}>

      <div
        onClick={function() { setExpanded(!expanded) }}
        style={{
          padding: '9px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          userSelect: 'none',
          borderBottom: expanded ? '1px solid #0F3460' : 'none',
        }}
      >
        <div style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: isPro ? '#B87333' : '#333',
          boxShadow: (isPro && !loading) ? '0 0 5px #B87333' : 'none',
          flexShrink: 0,
        }} />

        <span style={{
          fontSize: '10px',
          fontWeight: 700,
          color: '#B87333',
          letterSpacing: '0.8px',
          flex: 1,
        }}>
          AI MARKET BRIEFING
        </span>

        <span style={{
          fontSize: '9px',
          fontWeight: 700,
          padding: '1px 5px',
          background: isPro ? 'rgba(184,115,51,0.15)' : 'rgba(80,80,80,0.2)',
          border: '1px solid ' + (isPro ? 'rgba(184,115,51,0.35)' : '#2a2a2a'),
          borderRadius: '3px',
          color: isPro ? '#B87333' : '#444',
        }}>
          PRO
        </span>

        {isPro && summary && !loading && (
          <button
            onClick={forceRefresh}
            title="Force refresh"
            style={{
              fontSize: '12px',
              color: '#444',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0 2px',
              lineHeight: 1,
            }}
          >
            {'↻'}
          </button>
        )}

        <span style={{ fontSize: '9px', color: '#444' }}>
          {expanded ? '▲' : '▼'}
        </span>
      </div>

      {expanded && (
        <div>
          {!isPro && <UpgradeGate />}

          {isPro && loading && (
            <div style={{ padding: '14px 12px' }}>
              <div style={{ fontSize: '10px', color: '#555', marginBottom: '8px', textAlign: 'center' }}>
                Analysing live signals...
              </div>
              <div style={{
                height: '2px',
                background: '#0F3460',
                borderRadius: '2px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: '35%',
                  background: '#B87333',
                  borderRadius: '2px',
                  animation: 'summarySlide 1.4s ease-in-out infinite',
                }} />
              </div>
            </div>
          )}

          {isPro && error && !loading && (
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{
                padding: '8px 10px',
                background: 'rgba(231,76,60,0.08)',
                border: '1px solid rgba(231,76,60,0.25)',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#E74C3C',
              }}>
                {error}
              </div>
              <button
                onClick={fetchSummary}
                style={{
                  padding: '6px',
                  background: 'rgba(184,115,51,0.08)',
                  border: '1px solid rgba(184,115,51,0.25)',
                  borderRadius: '4px',
                  color: '#B87333',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
            </div>
          )}

          {isPro && summary && !loading && (
            <div>
              <div style={{
                padding: '12px',
                maxHeight: '300px',
                overflowY: 'auto',
              }}>
                <SummaryContent text={summary} />
              </div>
              <div style={{
                padding: '5px 12px',
                borderTop: '1px solid #0F3460',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: '9px', color: '#3a3a3a' }}>
                  {meta && meta.event_count} signals · {formatTime(meta && meta.generated_at)}
                  {meta && meta.cached ? ' · cached' : ' · fresh'}
                </span>
                <span style={{ fontSize: '9px', color: '#3a3a3a' }}>
                  {formatExpiry(meta && meta.expires_in)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes summarySlide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  )
}
