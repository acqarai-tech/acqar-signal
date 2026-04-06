import AISummaryPanel from '../components/AISummaryPanel'

export default function SummaryPage() {
  const params = new URLSearchParams(window.location.search)
  const plan = params.get('plan') || 'free'

  return (
    <div style={{
      background: '#0D1B2A',
      minHeight: '100vh',
      padding: '0',
    }}>
      <AISummaryPanel userPlan={plan} />
    </div>
  )
}
