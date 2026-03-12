import { useEvents } from '../context/EventsContext'

export default function FilterBar() {
  const { filters, updateFilters, filteredEvents } = useEvents()

  return (
    <div style={{borderBottom:'1px solid #0F3460', padding:'8px', background:'#16213E', flexShrink:0}}>
      {/* Time filter */}
      <div style={{display:'flex', gap:'4px', marginBottom:'8px'}}>
        {[
          {label:'1H', hours:1},
          {label:'1D', hours:24},
          {label:'1W', hours:168},
          {label:'1M', hours:720},
        ].map(({label, hours}) => (
          <button key={label}
            onClick={() => updateFilters({ hours })}
            style={{
              flex:1, padding:'4px', fontSize:'11px', fontWeight:600,
              border:'1px solid ' + (filters.hours === hours ? '#B87333' : '#0F3460'),
              background: filters.hours === hours ? 'rgba(184,115,51,0.2)' : 'transparent',
              color: filters.hours === hours ? '#B87333' : '#B3B3B3',
              borderRadius:'4px', cursor:'pointer'
            }}
          >{label}</button>
        ))}
      </div>

      {/* Count */}
      <div style={{fontSize:'10px', color:'#B3B3B3'}}>
        {filteredEvents.length} events
      </div>
    </div>
  )
}
