// import { useEvents } from '../context/EventsContext'
// import { formatDistanceToNow } from 'date-fns'

// const CATEGORY_COLORS = {
//   transaction: '#E74C3C', offplan: '#2980B9', construction: '#F39C12',
//   regulatory: '#8E44AD', infrastructure: '#27AE60', investment: '#16A085'
// }
// const CATEGORY_LABELS = {
//   transaction: 'Transaction', offplan: 'Off-Plan', construction: 'Construction',
//   regulatory: 'Regulatory', infrastructure: 'Infrastructure', investment: 'Investment'
// }
// const SEVERITY_COLORS = { 1:'#27AE60', 2:'#A8D44A', 3:'#F39C12', 4:'#E67E22', 5:'#E74C3C' }

// export default function EventCard({ event, isNew }) {
//   const { setSelectedEvent, selectedEvent } = useEvents()
//   const isSelected = selectedEvent?.id === event.id
//   const catColor = CATEGORY_COLORS[event.category] || '#B87333'
//   const sevColor = SEVERITY_COLORS[event.severity] || '#B87333'

//   const timeAgo = (() => {
//     try { return formatDistanceToNow(new Date(event.created_at), { addSuffix: true }) }
//     catch { return 'recently' }
//   })()

//   return (
//     <div
//       onClick={() => setSelectedEvent(isSelected ? null : event)}
//       style={{
//         padding:'10px 12px',
//         borderBottom:'1px solid #0F3460',
//         cursor:'pointer',
//         background: isSelected ? 'rgba(184,115,51,0.1)' : isNew ? 'rgba(39,174,96,0.05)' : 'transparent',
//         borderLeft: isSelected ? '3px solid #B87333' : isNew ? '3px solid #27AE60' : '3px solid transparent',
//         transition:'background 0.15s',
//       }}
//       onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
//       onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isNew ? 'rgba(39,174,96,0.05)' : 'transparent' }}
//     >
//       {/* Category + Severity badges */}
//       <div style={{display:'flex', alignItems:'center', gap:'6px', marginBottom:'5px'}}>
//         <span style={{
//           fontSize:'9px', fontWeight:700, padding:'2px 6px', borderRadius:'3px',
//           background: catColor + '22', color: catColor, letterSpacing:'0.5px'
//         }}>{CATEGORY_LABELS[event.category] || event.category?.toUpperCase()}</span>

//         <span style={{
//           fontSize:'9px', fontWeight:700, padding:'2px 5px', borderRadius:'3px',
//           background: sevColor + '22', color: sevColor
//         }}>S{event.severity}</span>

//         {isNew && (
//           <span style={{
//             fontSize:'9px', fontWeight:700, padding:'2px 5px', borderRadius:'3px',
//             background:'rgba(39,174,96,0.2)', color:'#27AE60'
//           }}>NEW</span>
//         )}

//         <span style={{flex:1}} />
//         <span style={{fontSize:'9px', color:'#444'}}>{isSelected ? '▲' : '▼'}</span>
//         <span style={{fontSize:'10px', color:'#666'}}>{timeAgo}</span>
//       </div>

//       {/* Title */}
//       <div style={{fontSize:'12px', fontWeight:600, color:'#FAFAFA', lineHeight:1.35, marginBottom:'4px'}}>
//         {event.title}
//       </div>

//       {/* Location + source */}
//       <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'10px', color:'#B3B3B3'}}>
//         <span>📍 {event.location_name}</span>
//         <span style={{color:'#B87333', fontWeight:600}}>via {event.source}</span>
//       </div>
//     </div>
//   )
// }



import { useEvents } from '../context/EventsContext'

const CATEGORY_COLORS = {
  transaction: '#E74C3C', offplan: '#2980B9', construction: '#F39C12',
  regulatory: '#8E44AD', infrastructure: '#27AE60', investment: '#16A085'
}
const CATEGORY_LABELS = {
  transaction: 'Transaction', offplan: 'Off-Plan', construction: 'Construction',
  regulatory: 'Regulatory', infrastructure: 'Infrastructure', investment: 'Investment'
}
const SEVERITY_COLORS = { 1:'#27AE60', 2:'#A8D44A', 3:'#F39C12', 4:'#E67E22', 5:'#E74C3C' }

// Smart time formatter based on active filter
function formatEventTime(createdAt, activeHours) {
  try {
    const now = Date.now()
    const ts = new Date(createdAt).getTime()
    const diffMs = now - ts
    const seconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(diffMs / (1000 * 60))
    const hours   = Math.floor(diffMs / (1000 * 60 * 60))
    const days    = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    // 1H → minutes and seconds
    if (activeHours === 1) {
      if (seconds < 60) return `${seconds}s ago`
      if (minutes < 60) return `${minutes}m ${seconds % 60}s ago`
      return `${hours}h ago`
    }

    // 1D → hours
    if (activeHours === 24) {
      if (minutes < 1)  return 'just now'
      if (hours < 1)    return `${minutes}m ago`
      if (hours < 24)   return `${hours}h ago`
      return `${days}d ago`
    }

    // 1W → days
    if (activeHours === 168) {
      if (hours < 1)  return `${minutes}m ago`
      if (hours < 24) return `${hours}h ago`
      if (days === 1) return 'yesterday'
      if (days <= 7)  return `${days} days ago`
      return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    }

    // 1M → full date
    if (activeHours === 720) {
      if (hours < 1)  return `${minutes}m ago`
      if (hours < 24) return `${hours}h ago`
      if (days === 1) return 'yesterday'
      return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    }

    // fallback
    if (minutes < 1)  return 'just now'
    if (hours < 1)    return `${minutes}m ago`
    if (hours < 24)   return `${hours}h ago`
    return `${days}d ago`
  } catch {
    return 'recently'
  }
}

export default function EventCard({ event, isNew }) {
  const { setSelectedEvent, selectedEvent, filters } = useEvents()
  const isSelected = selectedEvent?.id === event.id
  const catColor = CATEGORY_COLORS[event.category] || '#B87333'
  const sevColor = SEVERITY_COLORS[event.severity] || '#B87333'
  const timeAgo = formatEventTime(event.created_at, filters?.hours ?? 24)

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
