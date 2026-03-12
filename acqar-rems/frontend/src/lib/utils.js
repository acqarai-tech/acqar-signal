import { formatDistanceToNow, parseISO } from 'date-fns'

export function timeAgo(dateStr) {
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr)
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return 'recently'
  }
}

export function formatAED(amount) {
  if (!amount) return null
  if (amount >= 1_000_000_000) return `AED ${(amount / 1_000_000_000).toFixed(1)}B`
  if (amount >= 1_000_000) return `AED ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `AED ${(amount / 1_000).toFixed(0)}K`
  return `AED ${amount.toLocaleString()}`
}

export function clsx(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function severityLabel(severity) {
  const labels = { 1: 'Info', 2: 'Low', 3: 'Medium', 4: 'High', 5: 'Critical' }
  return labels[severity] || 'Unknown'
}

export function categoryLabel(category) {
  const labels = {
    transaction: 'Transaction', offplan: 'Off-Plan', construction: 'Construction',
    regulatory: 'Regulatory', infrastructure: 'Infrastructure', investment: 'Investment'
  }
  return labels[category] || category
}
