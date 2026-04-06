import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function SummaryPage() {
  const params = new URLSearchParams(window.location.search)
  const plan = params.get('plan') || 'pro'
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

useEffect(function() {
  function handleMessage(e) {
    if (e.data === 'PRINT_REPORT') {
      window.print()
    }
    if (e.data === 'GET_SUMMARY') {
      window.parent.postMessage({ type: 'SUMMARY_DATA', summary: summary }, '*')
    }
  }
  window.addEventListener('message', handleMessage)
  return function() { window.removeEventListener('message', handleMessage) }
}, [summary])

  useEffect(function() {
    fetch(API + '/api/summary', {
      headers: { 'x-user-plan': 'pro' }
    })
      .then(function(r) { return r.json() })
      .then(function(d) {
        setSummary(d.summary)
        setLoading(false)
      })
      .catch(function(e) {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div style={{
        background: '#fff', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 32, height: 32, border: '3px solid #EDEDED',
            borderTopColor: '#B87333', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
          }} />
          <div style={{ fontSize: 11, color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Compiling report...
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ background: '#fff', minHeight: '100vh', padding: 24, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ color: '#CC0000', fontSize: 13 }}>{error}</div>
      </div>
    )
  }

  if (!summary) return null

  const lines = summary.split('\n').filter(function(l) { return l.trim() })

  return (
    <div style={{
      background: '#fff', minHeight: '100vh',
      padding: '24px', fontFamily: 'Inter, sans-serif',
      maxWidth: '680px', margin: '0 auto',
    }}>
      {lines.map(function(line, i) {
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <p key={i} style={{
              fontSize: 12, fontWeight: 900, color: '#B87333',
              margin: '18px 0 6px', textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              {line.replace(/\*\*/g, '')}
            </p>
          )
        }
        if (line.startsWith('---')) {
          return <hr key={i} style={{ border: 'none', borderTop: '1px solid #EDEDED', margin: '16px 0' }} />
        }
        return (
          <p key={i} style={{
            fontSize: 13, color: '#333', lineHeight: 1.8,
            margin: '0 0 8px', fontWeight: 500,
          }}>
            {line}
          </p>
        )
      })}
    </div>
  )
}
