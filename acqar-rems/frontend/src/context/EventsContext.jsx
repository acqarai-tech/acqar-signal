import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useSocket } from './SocketContext'

const EventsContext = createContext(null)

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    categories: [],
    severityMin: 1,
    severityMax: 5,
    hours: 24,
    search: ''
  })
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [mapStyle, setMapStyle] = useState('dark')
  const { on, off } = useSocket()

  // Fetch initial events from REST API
  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        hours: filters.hours,
        severity_min: filters.severityMin,
        severity_max: filters.severityMax,
        limit: 100
      })
      if (filters.categories.length === 1) params.append('category', filters.categories[0])
      if (filters.search) params.append('search', filters.search)

      const res = await fetch(`${API_BASE}/api/events/?${params}`)
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setEvents(data.events || [])
    } catch (err) {
      console.warn('REST fetch failed, using demo data:', err.message)
      setEvents(getDemoEvents())
    } finally {
      setIsLoading(false)
    }
  }, [filters.hours, filters.severityMin, filters.severityMax, filters.categories, filters.search])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  // Listen for real-time events via Socket.io
  useEffect(() => {
    const handleNewEvent = (event) => {
      setEvents(prev => {
        const exists = prev.find(e => e.id === event.id)
        if (exists) return prev
        return [event, ...prev].slice(0, 200)
      })
    }

    const handleInitialEvents = ({ events: initialEvents }) => {
      if (initialEvents?.length) setEvents(initialEvents)
      setIsLoading(false)
    }

    on('new_event', handleNewEvent)
    on('initial_events', handleInitialEvents)

    return () => {
      off('new_event', handleNewEvent)
      off('initial_events', handleInitialEvents)
    }
  }, [on, off])

  // Apply ALL filters including time window
  useEffect(() => {
    let result = [...events]

    // ── Time filter ──────────────────────────────────────────────────────────
    const cutoff = Date.now() - filters.hours * 60 * 60 * 1000
    result = result.filter(e => {
      const ts = e.created_at ? new Date(e.created_at).getTime() : Date.now()
      return ts >= cutoff
    })

    // ── Category filter ──────────────────────────────────────────────────────
    if (filters.categories.length > 0) {
      result = result.filter(e => filters.categories.includes(e.category))
    }

    // ── Severity filter ──────────────────────────────────────────────────────
    result = result.filter(
      e => e.severity >= filters.severityMin && e.severity <= filters.severityMax
    )

    // ── Search filter ────────────────────────────────────────────────────────
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(e =>
        e.title?.toLowerCase().includes(q) ||
        e.location_name?.toLowerCase().includes(q)
      )
    }

    setFilteredEvents(result)
  }, [events, filters])

  const updateFilters = (newFilters) =>
    setFilters(prev => ({ ...prev, ...newFilters }))

  return (
    <EventsContext.Provider value={{
      events, filteredEvents, isLoading, filters,
      updateFilters, selectedEvent, setSelectedEvent, fetchEvents,
      mapStyle, setMapStyle
    }}>
      {children}
    </EventsContext.Provider>
  )
}

export const useEvents = () => useContext(EventsContext)

// Demo data fallback — timestamps spread across different time windows
function getDemoEvents() {
  const now = Date.now()
  const mins = (m) => now - m * 60 * 1000
  return [
    // within 1H
    { id: 'demo1', title: 'Emaar Reports Record Q4 Sales of AED 6.7 Billion', summary: 'Dubai developer Emaar Properties announced record quarterly sales driven by strong demand in Downtown and Creek Harbour.', category: 'transaction', severity: 4, lat: 25.1972, lng: 55.2744, location_name: 'Downtown Dubai', signal_count: 47, confidence: 0.92, source: 'Gulf News', created_at: new Date(mins(20)).toISOString(), is_active: true },
    { id: 'demo2', title: 'DAMAC Launches Palm Jumeirah Ultra-Luxury Residences', summary: 'New off-plan project priced from AED 15M per unit, targeting UHNWI buyers from Europe and Asia.', category: 'offplan', severity: 3, lat: 25.1124, lng: 55.1390, location_name: 'Palm Jumeirah', signal_count: 31, confidence: 0.88, source: 'Arabian Business', created_at: new Date(mins(45)).toISOString(), is_active: true },
    // within 1D (but not 1H)
    { id: 'demo3', title: 'RERA Issues New Short-Term Rental Regulations', summary: 'Dubai Real Estate Regulatory Authority updates licensing requirements for holiday homes and serviced apartments.', category: 'regulatory', severity: 3, lat: 25.2048, lng: 55.2708, location_name: 'Dubai', signal_count: 62, confidence: 0.95, source: 'The National', created_at: new Date(mins(180)).toISOString(), is_active: true },
    { id: 'demo4', title: 'Business Bay Records 847 Transactions in November', summary: 'Business Bay continues to be Dubai top performing district with AED 1.2B total transaction value this month.', category: 'transaction', severity: 3, lat: 25.1865, lng: 55.2644, location_name: 'Business Bay', signal_count: 28, confidence: 0.85, source: 'Zawya', created_at: new Date(mins(600)).toISOString(), is_active: true },
    // within 1W (but not 1D)
    { id: 'demo5', title: 'Nakheel Announces Palm Jebel Ali Phase 2 Infrastructure', summary: 'Construction contracts worth AED 3.8B awarded for road and utility infrastructure on Palm Jebel Ali expansion.', category: 'infrastructure', severity: 4, lat: 24.9823, lng: 55.0262, location_name: 'Dubai South', signal_count: 54, confidence: 0.91, source: 'Gulf News', created_at: new Date(mins(60 * 48)).toISOString(), is_active: true },
    { id: 'demo6', title: 'Dubai Marina Average Rental Yield Hits 7.2%', summary: 'Marina district outperforms all other areas with highest rental yield in Q4, attracting yield-focused investors.', category: 'investment', severity: 2, lat: 25.0761, lng: 55.1403, location_name: 'Dubai Marina', signal_count: 19, confidence: 0.79, source: 'GDELT', created_at: new Date(mins(60 * 72)).toISOString(), is_active: true },
    // within 1M (but not 1W)
    { id: 'demo7', title: 'Dubai Land Department Launches Smart Rental Index', summary: 'New digital platform allows landlords and tenants to access real-time rental valuations across all districts.', category: 'regulatory', severity: 3, lat: 25.2048, lng: 55.2708, location_name: 'Dubai', signal_count: 38, confidence: 0.87, source: 'DLD', created_at: new Date(mins(60 * 24 * 12)).toISOString(), is_active: true },
    { id: 'demo8', title: 'JVC Emerges as Most Affordable Investment District', summary: 'Jumeirah Village Circle records highest transaction volume among sub-AED 1M properties in Q4.', category: 'investment', severity: 2, lat: 25.0580, lng: 55.2100, location_name: 'JVC', signal_count: 22, confidence: 0.81, source: 'Property Monitor', created_at: new Date(mins(60 * 24 * 20)).toISOString(), is_active: true },
  ]
}



// import { createContext, useContext, useEffect, useState, useCallback } from 'react'
// import { useSocket } from './SocketContext'

// const EventsContext = createContext(null)

// const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// export function EventsProvider({ children }) {
//   const [events, setEvents] = useState([])
//   const [filteredEvents, setFilteredEvents] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [filters, setFilters] = useState({
//     categories: [],       // empty = all
//     severityMin: 1,
//     severityMax: 5,
//     hours: 168,           // DEFAULT: 7 days so feed is never empty on load
//     search: ''
//   })
//   const [selectedEvent, setSelectedEvent] = useState(null)
//   const [mapStyle, setMapStyle] = useState('dark')
//   const { on, off } = useSocket()

//   // Fetch initial events from REST API
//   const fetchEvents = useCallback(async () => {
//     try {
//       setIsLoading(true)
//       const params = new URLSearchParams({
//         hours:        filters.hours,
//         severity_min: filters.severityMin,
//         severity_max: filters.severityMax,
//         limit:        200                   // increased limit
//       })
//       if (filters.categories.length === 1) params.append('category', filters.categories[0])
//       if (filters.search) params.append('search', filters.search)

//       const res = await fetch(`${API_BASE}/api/events/?${params}`)
//       if (!res.ok) throw new Error('API error')
//       const data = await res.json()
//       setEvents(data.events || [])
//     } catch (err) {
//       console.warn('REST fetch failed, using demo data:', err.message)
//       setEvents(getDemoEvents())
//     } finally {
//       setIsLoading(false)
//     }
//   }, [filters.hours, filters.severityMin, filters.severityMax, filters.categories, filters.search])

//   useEffect(() => { fetchEvents() }, [fetchEvents])

//   // Poll every 30 seconds for new events even without socket
//   useEffect(() => {
//     const interval = setInterval(() => {
//       fetchEvents()
//     }, 30000)
//     return () => clearInterval(interval)
//   }, [fetchEvents])

//   // Listen for real-time events via Socket.io
//   useEffect(() => {
//     const handleNewEvent = (event) => {
//       setEvents(prev => {
//         const exists = prev.find(e => e.id === event.id)
//         if (exists) return prev
//         return [event, ...prev].slice(0, 500)
//       })
//     }

//     const handleInitialEvents = ({ events: initialEvents }) => {
//       if (initialEvents?.length) setEvents(initialEvents)
//       setIsLoading(false)
//     }

//     on('new_event', handleNewEvent)
//     on('initial_events', handleInitialEvents)

//     return () => {
//       off('new_event', handleNewEvent)
//       off('initial_events', handleInitialEvents)
//     }
//   }, [on, off])

//   // Apply filters to events
//   useEffect(() => {
//     let result = [...events]

//     // Category filter
//     if (filters.categories.length > 0) {
//       result = result.filter(e => filters.categories.includes(e.category))
//     }

//     // Severity filter
//     result = result.filter(e =>
//       e.severity >= filters.severityMin && e.severity <= filters.severityMax
//     )

//     // Time filter — use published_at OR created_at_ts, whichever is available
//     const cutoffTs = Date.now() / 1000 - filters.hours * 3600
//     result = result.filter(e => {
//       // Try created_at_ts first (set by pipeline from real published_at)
//       if (e.created_at_ts && e.created_at_ts > 0) {
//         return e.created_at_ts >= cutoffTs
//       }
//       // Fallback: parse created_at string
//       try {
//         const ts = new Date(e.created_at).getTime() / 1000
//         return ts >= cutoffTs
//       } catch {
//         return true // keep if unparseable
//       }
//     })

//     // Search filter
//     if (filters.search) {
//       const q = filters.search.toLowerCase()
//       result = result.filter(e =>
//         e.title?.toLowerCase().includes(q) ||
//         e.location_name?.toLowerCase().includes(q)
//       )
//     }

//     // Sort newest first
//     result.sort((a, b) => {
//       const tsA = a.created_at_ts || new Date(a.created_at || 0).getTime() / 1000
//       const tsB = b.created_at_ts || new Date(b.created_at || 0).getTime() / 1000
//       return tsB - tsA
//     })

//     setFilteredEvents(result)
//   }, [events, filters])

//   const updateFilters = (newFilters) =>
//     setFilters(prev => ({ ...prev, ...newFilters }))

//   return (
//     <EventsContext.Provider value={{
//       events, filteredEvents, isLoading, filters,
//       updateFilters, selectedEvent, setSelectedEvent, fetchEvents,
//       mapStyle, setMapStyle
//     }}>
//       {children}
//     </EventsContext.Provider>
//   )
// }

// export const useEvents = () => useContext(EventsContext)

// // Demo data fallback (when backend not running)
// function getDemoEvents() {
//   const now = Date.now()
//   return [
//     {
//       id: 'demo1',
//       title: 'Emaar Reports Record Q4 Sales of AED 6.7 Billion',
//       summary: 'Dubai developer Emaar Properties announced record quarterly sales driven by strong demand in Downtown and Creek Harbour.',
//       category: 'transaction',
//       severity: 4,
//       lat: 25.1972, lng: 55.2744,
//       location_name: 'Downtown Dubai',
//       signal_count: 47,
//       confidence: 0.92,
//       source: 'Gulf News',
//       created_at: new Date(now - 300000).toISOString(),
//       created_at_ts: (now - 300000) / 1000,
//       is_active: true
//     },
//     {
//       id: 'demo2',
//       title: 'DAMAC Launches Palm Jumeirah Ultra-Luxury Residences',
//       summary: 'New off-plan project priced from AED 15M per unit, targeting UHNWI buyers from Europe and Asia.',
//       category: 'offplan',
//       severity: 3,
//       lat: 25.1124, lng: 55.1390,
//       location_name: 'Palm Jumeirah',
//       signal_count: 31,
//       confidence: 0.88,
//       source: 'Arabian Business',
//       created_at: new Date(now - 900000).toISOString(),
//       created_at_ts: (now - 900000) / 1000,
//       is_active: true
//     },
//     {
//       id: 'demo3',
//       title: 'RERA Issues New Short-Term Rental Regulations',
//       summary: 'Dubai Real Estate Regulatory Authority updates licensing requirements for holiday homes and serviced apartments.',
//       category: 'regulatory',
//       severity: 3,
//       lat: 25.2048, lng: 55.2708,
//       location_name: 'Dubai',
//       signal_count: 62,
//       confidence: 0.95,
//       source: 'The National',
//       created_at: new Date(now - 1800000).toISOString(),
//       created_at_ts: (now - 1800000) / 1000,
//       is_active: true
//     },
//     {
//       id: 'demo4',
//       title: 'Business Bay Records High Transaction Volume',
//       summary: 'Business Bay continues to be Dubai top performing district with strong total transaction value this month.',
//       category: 'transaction',
//       severity: 3,
//       lat: 25.1865, lng: 55.2644,
//       location_name: 'Business Bay',
//       signal_count: 28,
//       confidence: 0.85,
//       source: 'Zawya',
//       created_at: new Date(now - 3600000).toISOString(),
//       created_at_ts: (now - 3600000) / 1000,
//       is_active: true
//     },
//     {
//       id: 'demo5',
//       title: 'Nakheel Announces Palm Jebel Ali Phase 2 Infrastructure',
//       summary: 'Construction contracts awarded for road and utility infrastructure on Palm Jebel Ali expansion.',
//       category: 'infrastructure',
//       severity: 4,
//       lat: 24.9823, lng: 55.0262,
//       location_name: 'Dubai South',
//       signal_count: 54,
//       confidence: 0.91,
//       source: 'Gulf News',
//       created_at: new Date(now - 5400000).toISOString(),
//       created_at_ts: (now - 5400000) / 1000,
//       is_active: true
//     },
//     {
//       id: 'demo6',
//       title: 'Dubai Marina Average Rental Yield Hits 7.2%',
//       summary: 'Marina district outperforms all other areas with highest rental yield, attracting yield-focused investors.',
//       category: 'investment',
//       severity: 2,
//       lat: 25.0761, lng: 55.1403,
//       location_name: 'Dubai Marina',
//       signal_count: 19,
//       confidence: 0.79,
//       source: 'GDELT',
//       created_at: new Date(now - 7200000).toISOString(),
//       created_at_ts: (now - 7200000) / 1000,
//       is_active: true
//     },
//   ]
// }





















