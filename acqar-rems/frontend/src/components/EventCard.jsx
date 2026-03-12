import { useEvents } from '../context/EventsContext'
import { formatDistanceToNow } from 'date-fns'

const CATEGORY_COLORS = {
  transaction: '#E74C3C', offplan: '#2980B9', construction: '#F39C12',
  regulatory: '#8E44AD', infrastructure: '#27AE60', investment: '#16A085'
}
const CATEGORY_LABELS = {
  transaction: 'Transaction', offplan: 'Off-Plan', construction: 'Construction',
  regulatory: 'Regulatory', infrastructure: 'Infrastructure', investment: 'Investment'
}
const SEVERITY_COLORS = { 1:'#27AE60', 2:'#A8D44A', 3:'#F39C12', 4:'#E67E22', 5:'#E74C3C' }

export default function EventCard({ event, isNew }) {
  const { setSelectedEvent, selectedEvent } = useEvents()
  const isSelected = selectedEvent?.id === event.id
  const catColor = CATEGORY_COLORS[event.category] || '#B87333'
  const sevColor = SEVERITY_COLORS[event.severity] || '#B87333'

  const timeAgo = (() => {
    try { return formatDistanceToNow(new Date(event.created_at), { addSuffix: true }) }
    catch { return 'recently' }
  })()

  return (
    <div
      onClick={() => setSelectedEvent(isSelected ? null : event)}
      style={{
        padding:'10px 12px',
        borderBottom:'1px solid #0F3460',
        cursor:'pointer',
        background: isSelected ? 'rgba(184,115,51,0.1)' : isNew ? 'rgba(39,174,96,0.05)' : 'transparent',
        borderLeft: isSelected ? '3px solid #B87333' : isNew ? '3px solid #27AE60' : '3px solid transparent',
        transition:'background 0.15s',
      }}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isNew ? 'rgba(39,174,96,0.05)' : 'transparent' }}
    >
      {/* Category + Severity badges */}
      <div style={{display:'flex', alignItems:'center', gap:'6px', marginBottom:'5px'}}>
        <span style={{
          fontSize:'9px', fontWeight:700, padding:'2px 6px', borderRadius:'3px',
          background: catColor + '22', color: catColor, letterSpacing:'0.5px'
        }}>{CATEGORY_LABELS[event.category] || event.category?.toUpperCase()}</span>

        <span style={{
          fontSize:'9px', fontWeight:700, padding:'2px 5px', borderRadius:'3px',
          background: sevColor + '22', color: sevColor
        }}>S{event.severity}</span>

        {isNew && (
          <span style={{
            fontSize:'9px', fontWeight:700, padding:'2px 5px', borderRadius:'3px',
            background:'rgba(39,174,96,0.2)', color:'#27AE60'
          }}>NEW</span>
        )}

        <span style={{flex:1}} />
        <span style={{fontSize:'9px', color:'#444'}}>{isSelected ? '▲' : '▼'}</span>
        <span style={{fontSize:'10px', color:'#666'}}>{timeAgo}</span>
      </div>

      {/* Title */}
      <div style={{fontSize:'12px', fontWeight:600, color:'#FAFAFA', lineHeight:1.35, marginBottom:'4px'}}>
        {event.title}
      </div>

      {/* Location + source */}
      <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'10px', color:'#B3B3B3'}}>
        <span>📍 {event.location_name}</span>
        <span style={{color:'#B87333', fontWeight:600}}>via {event.source}</span>
      </div>
    </div>
  )
}
