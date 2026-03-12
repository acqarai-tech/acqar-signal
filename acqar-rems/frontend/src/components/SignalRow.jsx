import { useEffect, useRef, useState } from 'react'
import { useSocket } from '../context/SocketContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function getCategoryColor(cat) {
  const map = {
    transaction: '#27AE60',
    offplan: '#3498DB',
    price_signal: '#F39C12',
    regulatory: '#9B59B6',
    investment: '#1ABC9C',
  }
  return map[cat] || '#B87333'
}

export default function SignalRow() {
  const { socket } = useSocket()
  const [dld, setDld] = useState([])
  const [stocks, setStocks] = useState([])
  const [isLive, setIsLive] = useState(false)
  const [loading, setLoading] = useState(true)

  const tickerRef = useRef(null)
  const animRef = useRef(null)
  const posRef = useRef(0)

  // Fetch signal row data
  const fetchSignalRow = async () => {
    try {
      const res = await fetch(`${API}/api/market/signal-row`)
      if (!res.ok) throw new Error('Failed to fetch signal row')
      const data = await res.json()
      setDld(data.dld || [])
      setStocks(data.stocks || [])
      setIsLive(data.is_real || false)
      setLoading(false)
      posRef.current = 0  // reset scroll on fresh data
    } catch (err) {
      console.error('SignalRow fetch error:', err)
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchSignalRow()
  }, [])

  // Refresh every 90 seconds
  useEffect(() => {
    const interval = setInterval(fetchSignalRow, 90 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Listen for socket updates
  useEffect(() => {
    if (!socket) return
    const handleUpdate = () => {
      fetchSignalRow()
    }
    socket.on('signal_row_update', handleUpdate)
    return () => {
      socket.off('signal_row_update', handleUpdate)
    }
  }, [socket])

  // Smooth scrolling ticker animation
  useEffect(() => {
    if (!tickerRef.current || (dld.length === 0 && stocks.length === 0)) return
    const el = tickerRef.current
    const speed = 0.35  // px per frame

    const animate = () => {
      posRef.current -= speed
      const halfWidth = el.scrollWidth / 2
      if (Math.abs(posRef.current) >= halfWidth) {
        posRef.current = 0
      }
      el.style.transform = `translateX(${posRef.current}px)`
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [dld, stocks])

  const allItems = [...dld, ...stocks]
  const showContent = !loading && allItems.length > 0

  return (
    <div style={{
      height: '32px',
      background: '#0A1628',
      borderTop: '1px solid #0F3460',
      overflow: 'hidden',
      flexShrink: 0,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    }}>
      {/* Left label pill */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 2,
        background: 'linear-gradient(135deg, #0D3B6E, #1A1A2E)',
        borderRight: '1px solid #0F3460',
        padding: '0 10px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        width: '80px',
        whiteSpace: 'nowrap',
      }}>
        <span style={{
          display: 'inline-block',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: '#27AE60',
          animation: 'signalPulse 2s infinite',
        }} />
        <span style={{
          color: '#7FB3D3',
          fontSize: '9px',
          fontWeight: 800,
          letterSpacing: '0.8px',
        }}>
          DLD · STOCKS
        </span>
      </div>

      {/* Scrolling area */}
      <div style={{
        marginLeft: '80px',
        height: '100%',
        overflow: 'hidden',
        flex: 1,
        position: 'relative',
      }}>
        {loading ? (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '12px',
            fontSize: '10px',
            color: '#333',
          }}>
            Loading signals...
          </div>
        ) : allItems.length === 0 ? (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '12px',
            fontSize: '10px',
            color: '#333',
          }}>
            No signals available
          </div>
        ) : (
          <div
            ref={tickerRef}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '100%',
              whiteSpace: 'nowrap',
              willChange: 'transform',
            }}
          >
            {/* Doubled for seamless loop */}
            {[...dld, ...stocks, ...dld, ...stocks].map((item, i) => {
              if (item.type === 'dld') {
                return (
                  <a
                    key={`dld-${item.id}-${i}`}
                    href={item.url || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '0 14px',
                      height: '100%',
                      textDecoration: 'none',
                      borderRight: '1px solid #0D2040',
                      cursor: item.url ? 'pointer' : 'default',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Category badge */}
                    <span style={{
                      fontSize: '8px',
                      fontWeight: 700,
                      padding: '1px 4px',
                      borderRadius: '2px',
                      background: getCategoryColor(item.category) + '22',
                      color: getCategoryColor(item.category),
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                    }}>
                      {item.category?.replace(/_/g, ' ').slice(0, 6)}
                    </span>

                    {/* Area */}
                    <span style={{
                      fontSize: '10px',
                      color: '#8BA7C7',
                      fontWeight: 600,
                    }}>
                      {item.area?.split(' ').slice(0, 2).join(' ')}
                    </span>

                    {/* Amount if present */}
                    {item.amount_fmt && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#E8D5A3',
                      }}>
                        {item.amount_fmt}
                      </span>
                    )}

                    {/* Age */}
                    <span style={{
                      fontSize: '9px',
                      color: '#3A5878',
                    }}>
                      {item.age_mins < 60 ? `${item.age_mins}m` : `${Math.floor(item.age_mins / 60)}h`}
                    </span>

                    {/* Separator */}
                    <span style={{
                      color: '#0D2040',
                      fontSize: '10px',
                      marginLeft: '4px',
                    }}>
                      ◆
                    </span>
                  </a>
                )
              } else if (item.type === 'stock') {
                const stockIndex = [...dld, ...stocks].findIndex(x => x.id === item.id && x.type === 'stock')
                const isFirstStock = stockIndex === dld.length
                return (
                  <div
                    key={`stock-${item.id}-${i}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '0 14px',
                      height: '100%',
                      borderRight: '1px solid #0D2040',
                      borderLeft: isFirstStock ? '1px solid #1A3A5C' : 'none',
                    }}
                  >
                    {/* Symbol/Name */}
                    <span style={{
                      fontSize: '10px',
                      color: '#7FB3D3',
                      fontWeight: 700,
                    }}>
                      {item.label}
                    </span>

                    {/* Price */}
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#FAFAFA',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                    </span>

                    {/* Change pct */}
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      color: (item.change_pct || 0) >= 0 ? '#27AE60' : '#E74C3C',
                    }}>
                      {(item.change_pct || 0) >= 0 ? '▲' : '▼'} {Math.abs(item.change_pct || 0).toFixed(2)}%
                    </span>

                    {/* Exchange badge */}
                    <span style={{
                      fontSize: '8px',
                      color: '#2A4A6A',
                      fontWeight: 600,
                      padding: '1px 3px',
                      background: 'rgba(127,179,211,0.08)',
                      borderRadius: '2px',
                    }}>
                      {item.exchange}
                    </span>
                  </div>
                )
              }
              return null
            })}
          </div>
        )}

        {/* Left fade edge */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '20px',
          height: '100%',
          background: 'linear-gradient(to right, #0A1628, transparent)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        {/* Right fade edge */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '20px',
          height: '100%',
          background: 'linear-gradient(to left, #0A1628, transparent)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />
      </div>

      <style>{`
        @keyframes signalPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
      `}</style>
    </div>
  )
}
