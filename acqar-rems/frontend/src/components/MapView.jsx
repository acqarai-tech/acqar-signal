// import { useEffect, useRef, useCallback } from 'react'
// import maplibregl from 'maplibre-gl'
// import { useEvents } from '../context/EventsContext'

// const CATEGORY_COLORS = {
//   transaction: '#E74C3C',
//   offplan: '#2980B9',
//   construction: '#F39C12',
//   regulatory: '#8E44AD',
//   infrastructure: '#27AE60',
//   investment: '#16A085'
// }

// const SEVERITY_SIZES = { 1: 8, 2: 10, 3: 13, 4: 16, 5: 20 }

// export default function MapView() {
//   const mapContainer = useRef(null)
//   const map = useRef(null)
//   const markers = useRef([])
//   const { filteredEvents, selectedEvent, setSelectedEvent, mapStyle } = useEvents()

//   // Initialize map
//   useEffect(() => {
//     if (map.current) return

//     map.current = new maplibregl.Map({
//       container: mapContainer.current,
//       style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
//       center: [55.2708, 25.2048],  // Dubai
//       zoom: 11,
//       attributionControl: false
//     })

//     map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')

//     return () => {
//       if (map.current) { map.current.remove(); map.current = null }
//     }
//   }, [])

//   // Handle map style changes
//   useEffect(() => {
//     if (!map.current) return

//     const styleUrls = {
//       dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
//       satellite: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
//       street: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
//     }

//     const styleUrl = styleUrls[mapStyle]
//     if (styleUrl && map.current.isStyleLoaded && map.current.isStyleLoaded()) {
//       map.current.setStyle(styleUrl)
//     }
//   }, [mapStyle])

//   // Update markers when events change
//   useEffect(() => {
//     if (!map.current) return

//     // Clear old markers
//     markers.current.forEach(m => m.remove())
//     markers.current = []

//     filteredEvents.forEach(event => {
//       const color = CATEGORY_COLORS[event.category] || '#B87333'
//       const size = SEVERITY_SIZES[event.severity] || 10

//       // Create marker element
//       const el = document.createElement('div')
//       el.style.cssText = `
//         width: ${size * 2}px; height: ${size * 2}px;
//         background: ${color}; border-radius: 50%;
//         border: 2px solid rgba(255,255,255,0.3);
//         cursor: pointer; opacity: 0.85;
//         ${event.severity >= 4 ? 'animation: pulse 2s infinite;' : ''}
//         box-shadow: 0 0 ${size}px ${color}66;
//       `

//       // Popup
//       const popup = new maplibregl.Popup({
//         offset: size + 5,
//         closeButton: true,
//         className: 'acqar-popup'
//       }).setHTML(`
//         <div style="min-width:220px; font-family:'Inter',sans-serif;">
//           <div style="font-size:11px; color:#B87333; font-weight:600; text-transform:uppercase; margin-bottom:4px;">
//             ${event.category} • S${event.severity}
//           </div>
//           <div style="font-size:13px; font-weight:600; margin-bottom:6px; line-height:1.3;">${event.title}</div>
//           <div style="font-size:11px; color:#B3B3B3; margin-bottom:8px;">📍 ${event.location_name}</div>
//           ${event.price_aed ? `<div style="font-size:12px; color:#27AE60; margin-bottom:6px;">💰 AED ${(event.price_aed/1000000).toFixed(1)}M</div>` : ''}
//           <div style="font-size:11px; color:#B3B3B3;">
//             📡 ${event.signal_count} signals • 🎯 ${Math.round(event.confidence * 100)}% confidence
//           </div>
//           <div style="font-size:10px; color:#666; margin-top:6px;">via ${event.source}</div>
//           ${['transaction', 'offplan', 'investment'].includes(event.category) ? `
//             <a href="https://acqar.ai" target="_blank" rel="noopener noreferrer"
//               style="display:block; margin-top:10px; padding:7px 10px; background:rgba(184,115,51,0.15); border:1px solid #B87333; border-radius:5px; text-decoration:none; text-align:center;">
//               <span style="font-size:11px; font-weight:700; color:#B87333;">🏷️ Free ValuCheck™ for ${event.location_name}</span>
//             </a>
//           ` : ''}
//         </div>
//       `)

//       const marker = new maplibregl.Marker({ element: el })
//         .setLngLat([event.lng, event.lat])
//         .setPopup(popup)
//         .addTo(map.current)

//       el.addEventListener('click', () => setSelectedEvent(event))
//       markers.current.push(marker)
//     })
//   }, [filteredEvents, setSelectedEvent, mapStyle])

//   // Fetch area momentum and show badges
//   useEffect(() => {
//     if (!map.current) return

//     const fetchMomentum = async () => {
//       try {
//         const res = await fetch('/api/area-momentum')
//         if (!res.ok) return
//         const data = await res.json()
//         const areas = data.momentum_areas || []

//         areas.forEach(area => {
//           if (!area.lat || !area.lng) return

//           const el = document.createElement('div')
//           el.style.cssText = `
//             background: rgba(184,115,51,0.9);
//             color: white;
//             font-family: 'Inter', sans-serif;
//             font-size: 10px;
//             font-weight: 700;
//             padding: 3px 7px;
//             border-radius: 10px;
//             border: 1px solid rgba(255,255,255,0.3);
//             white-space: nowrap;
//             pointer-events: none;
//             box-shadow: 0 0 8px rgba(184,115,51,0.5);
//           `
//           el.textContent = '\U0001F525 ' + area.area + ' x' + area.count

//           new maplibregl.Marker({ element: el, anchor: 'center' })
//             .setLngLat([area.lng, area.lat + 0.005])
//             .addTo(map.current)
//         })
//       } catch (e) {
//         // Silently ignore if endpoint not ready yet
//       }
//     }

//     // Fetch after map loads
//     if (map.current.loaded()) {
//       fetchMomentum()
//     } else {
//       map.current.on('load', fetchMomentum)
//     }
//   }, [])

//   // Fly to selected event
//   useEffect(() => {
//     if (selectedEvent && map.current) {
//       map.current.flyTo({
//         center: [selectedEvent.lng, selectedEvent.lat],
//         zoom: 14,
//         duration: 1200,
//         essential: true
//       })
//     }
//   }, [selectedEvent])

//   return (
//     <div className="relative w-full h-full">
//       <div ref={mapContainer} className="w-full h-full" />

//       {/* Map Legend */}
//       {/* <div className="absolute bottom-4 left-4 bg-panel/90 border border-border rounded-lg p-3 text-xs space-y-1.5"> */}
//       <div className="map-legend absolute bottom-4 left-4 bg-panel/90 border border-border rounded-lg p-3 text-xs space-y-1.5">
//         {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
//           <div key={cat} className="flex items-center gap-2">
//             <div className="w-2.5 h-2.5 rounded-full flex-none" style={{background: color}} />
//             <span className="text-text-secondary capitalize">{cat === 'offplan' ? 'Off-Plan' : cat}</span>
//           </div>
//         ))}

//         {/* Severity scale */}
//         <div style={{marginTop: '8px', borderTop: '1px solid #0F3460', paddingTop: '6px'}}>
//           <div style={{fontSize: '9px', color: '#B87333', fontWeight: 700, marginBottom: '4px', letterSpacing: '0.5px'}}>SEVERITY</div>
//           {[
//             {s: 'S1–S2', size: 6},
//             {s: 'S3', size: 9},
//             {s: 'S4–S5', size: 12},
//           ].map(({s, size}) => (
//             <div key={s} style={{display:'flex', alignItems:'center', gap:'6px', marginBottom:'2px'}}>
//               <div style={{
//                 width: size, height: size, borderRadius: '50%', flexShrink: 0,
//                 background: '#B87333', opacity: 0.7
//               }} />
//               <span style={{fontSize:'9px', color:'#666'}}>{s}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Pulse animation style */}
//       <style>{`
//       @media (max-width: 767px) {
//     .map-legend { display: none !important; }
//   }
//         @keyframes pulse {
//           0% { box-shadow: 0 0 0 0 rgba(231,76,60,0.7); }
//           70% { box-shadow: 0 0 0 10px rgba(231,76,60,0); }
//           100% { box-shadow: 0 0 0 0 rgba(231,76,60,0); }
//         }
//         .acqar-popup .maplibregl-popup-content {
//           background: #16213E !important;
//           border: 1px solid #B87333 !important;
//           color: #FAFAFA !important;
//           border-radius: 8px !important;
//           padding: 14px !important;
//         }
//         .acqar-popup .maplibregl-popup-tip {
//           border-top-color: #B87333 !important;
//           border-bottom-color: #B87333 !important;
//         }
//         .maplibregl-ctrl-bottom-right .maplibregl-ctrl {
//           margin-bottom: 80px !important;
//         }
//       `}</style>
//     </div>
//   )
// }













import { useEffect, useRef, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import { useEvents } from '../context/EventsContext'

const CATEGORY_COLORS = {
  transaction: '#E74C3C',
  offplan: '#2980B9',
  construction: '#F39C12',
  regulatory: '#8E44AD',
  infrastructure: '#27AE60',
  investment: '#16A085'
}

const SEVERITY_SIZES = { 1: 8, 2: 10, 3: 13, 4: 16, 5: 20 }

export default function MapView() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markers = useRef([])
  const { filteredEvents, selectedEvent, setSelectedEvent, mapStyle } = useEvents()

  // Initialize map
  useEffect(() => {
  if (map.current) return

  console.log('MAP CONTAINER:', mapContainer.current)
  console.log('CONTAINER WIDTH:', mapContainer.current?.offsetWidth)
  console.log('CONTAINER HEIGHT:', mapContainer.current?.offsetHeight)

  map.current = new maplibregl.Map({
    container: mapContainer.current,
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    center: [55.2708, 25.2048],
    zoom: 11,
    attributionControl: false
  })

  map.current.on('load', () => {
  console.log('MAP LOADED ✅')
  map.current.resize()
})
  map.current.on('error', (e) => console.log('MAP ERROR ❌', e))

  map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')

  return () => {
    if (map.current) { map.current.remove(); map.current = null }
  }
}, [])

  // Handle map style changes
  useEffect(() => {
    if (!map.current) return

    const styleUrls = {
      dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      satellite: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      street: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    }

    const styleUrl = styleUrls[mapStyle]
    if (styleUrl && map.current.isStyleLoaded && map.current.isStyleLoaded()) {
      map.current.setStyle(styleUrl)
    }
  }, [mapStyle])

  // Update markers when events change
  useEffect(() => {
    if (!map.current) return

    // Clear old markers
    markers.current.forEach(m => m.remove())
    markers.current = []

    filteredEvents.forEach(event => {
      const color = CATEGORY_COLORS[event.category] || '#B87333'
      const size = SEVERITY_SIZES[event.severity] || 10

      // Create marker element
      const el = document.createElement('div')
      el.style.cssText = `
        width: ${size * 2}px; height: ${size * 2}px;
        background: ${color}; border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.3);
        cursor: pointer; opacity: 0.85;
        ${event.severity >= 4 ? 'animation: pulse 2s infinite;' : ''}
        box-shadow: 0 0 ${size}px ${color}66;
      `

      // Popup
      const popup = new maplibregl.Popup({
        offset: size + 5,
        closeButton: true,
        className: 'acqar-popup'
      }).setHTML(`
        <div style="min-width:220px; font-family:'Inter',sans-serif;">
          <div style="font-size:11px; color:#B87333; font-weight:600; text-transform:uppercase; margin-bottom:4px;">
            ${event.category} • S${event.severity}
          </div>
          <div style="font-size:13px; font-weight:600; margin-bottom:6px; line-height:1.3;">${event.title}</div>
          <div style="font-size:11px; color:#B3B3B3; margin-bottom:8px;">📍 ${event.location_name}</div>
          ${event.price_aed ? `<div style="font-size:12px; color:#27AE60; margin-bottom:6px;">💰 AED ${(event.price_aed/1000000).toFixed(1)}M</div>` : ''}
          <div style="font-size:11px; color:#B3B3B3;">
            📡 ${event.signal_count} signals • 🎯 ${Math.round(event.confidence * 100)}% confidence
          </div>
          <div style="font-size:10px; color:#666; margin-top:6px;">via ${event.source}</div>
          ${['transaction', 'offplan', 'investment'].includes(event.category) ? `
            <a href="https://acqar.ai" target="_blank" rel="noopener noreferrer"
              style="display:block; margin-top:10px; padding:7px 10px; background:rgba(184,115,51,0.15); border:1px solid #B87333; border-radius:5px; text-decoration:none; text-align:center;">
              <span style="font-size:11px; font-weight:700; color:#B87333;">🏷️ Free ValuCheck™ for ${event.location_name}</span>
            </a>
          ` : ''}
        </div>
      `)

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([event.lng, event.lat])
        .setPopup(popup)
        .addTo(map.current)

      el.addEventListener('click', () => setSelectedEvent(event))
      markers.current.push(marker)
    })
  }, [filteredEvents, setSelectedEvent, mapStyle])

  // Fetch area momentum and show badges
  useEffect(() => {
    if (!map.current) return

    const fetchMomentum = async () => {
      try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const res = await fetch(`${API_BASE}/api/events/area-momentum`)
        if (!res.ok) return
        const data = await res.json()
        const areas = data.momentum_areas || []

        areas.forEach(area => {
          if (!area.lat || !area.lng) return

          const el = document.createElement('div')
          el.style.cssText = `
            background: rgba(184,115,51,0.9);
            color: white;
            font-family: 'Inter', sans-serif;
            font-size: 10px;
            font-weight: 700;
            padding: 3px 7px;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.3);
            white-space: nowrap;
            pointer-events: none;
            box-shadow: 0 0 8px rgba(184,115,51,0.5);
          `
         el.textContent = '🔥 ' + area.area + ' x' + area.count

          new maplibregl.Marker({ element: el, anchor: 'center' })
            .setLngLat([area.lng, area.lat + 0.005])
            .addTo(map.current)
        })
      } catch (e) {
        // Silently ignore if endpoint not ready yet
      }
    }

    // Fetch after map loads
    if (map.current.loaded()) {
      fetchMomentum()
    } else {
      map.current.on('load', fetchMomentum)
    }
  }, [])

  // Fly to selected event
  useEffect(() => {
    if (selectedEvent && map.current) {
      map.current.flyTo({
        center: [selectedEvent.lng, selectedEvent.lat],
        zoom: 14,
        duration: 1200,
        essential: true
      })
    }
  }, [selectedEvent])


    return (
  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
    <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {/* Map Legend */}
      {/* <div className="absolute bottom-4 left-4 bg-panel/90 border border-border rounded-lg p-3 text-xs space-y-1.5"> */}
      <div className="map-legend absolute bottom-4 left-4 bg-panel/90 border border-border rounded-lg p-3 text-xs space-y-1.5">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-none" style={{background: color}} />
            <span className="text-text-secondary capitalize">{cat === 'offplan' ? 'Off-Plan' : cat}</span>
          </div>
        ))}

        {/* Severity scale */}
        <div style={{marginTop: '8px', borderTop: '1px solid #0F3460', paddingTop: '6px'}}>
          <div style={{fontSize: '9px', color: '#B87333', fontWeight: 700, marginBottom: '4px', letterSpacing: '0.5px'}}>SEVERITY</div>
          {[
            {s: 'S1–S2', size: 6},
            {s: 'S3', size: 9},
            {s: 'S4–S5', size: 12},
          ].map(({s, size}) => (
            <div key={s} style={{display:'flex', alignItems:'center', gap:'6px', marginBottom:'2px'}}>
              <div style={{
                width: size, height: size, borderRadius: '50%', flexShrink: 0,
                background: '#B87333', opacity: 0.7
              }} />
              <span style={{fontSize:'9px', color:'#666'}}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pulse animation style */}
      <style>{`
      @media (max-width: 767px) {
    .map-legend { display: none !important; }
  }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(231,76,60,0.7); }
          70% { box-shadow: 0 0 0 10px rgba(231,76,60,0); }
          100% { box-shadow: 0 0 0 0 rgba(231,76,60,0); }
        }
        .acqar-popup .maplibregl-popup-content {
          background: #16213E !important;
          border: 1px solid #B87333 !important;
          color: #FAFAFA !important;
          border-radius: 8px !important;
          padding: 14px !important;
        }
        .acqar-popup .maplibregl-popup-tip {
          border-top-color: #B87333 !important;
          border-bottom-color: #B87333 !important;
        }
        .maplibregl-ctrl-bottom-right .maplibregl-ctrl {
          margin-bottom: 80px !important;
        }
      `}</style>
    </div>
  )
}
