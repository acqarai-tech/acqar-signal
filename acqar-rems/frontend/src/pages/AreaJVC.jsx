import { EventsProvider } from '../context/EventsContext'
import AreaSpecialistPage from '../components/AreaSpecialistPage'

const JVC = {
  name: 'JVC',
  zone: 'Mid-Market',
  lat: 25.0586,
  lng: 55.2069,
  pricePerSqft: 1473,
  yield: 6.7,
  score: 69,
}

export default function AreaJVC() {
  return (
    <EventsProvider>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <AreaSpecialistPage
          area={JVC}
          onClose={() => window.history.back()}
        />
      </div>
    </EventsProvider>
  )
}










// import { EventsProvider } from '../context/EventsContext'
// import AreaSpecialistPage from '../components/AreaSpecialistPage'

// const JVC = {
//   name: 'JVC',
//   zone: 'Mid-Market',
//   dxbSlug: 'jumeirah-village-circle',
//   lat: 25.0586,
//   lng: 55.2069,
//   pricePerSqft: 1473,
//   yield: 6.7,
//   score: 69,
// }

// export default function AreaJVC() {
//   return (
//     <EventsProvider>
//       <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
//         <AreaSpecialistPage
//           area={JVC}
//           onClose={() => window.history.back()}
//         />
//       </div>
//     </EventsProvider>
//   )
// }
