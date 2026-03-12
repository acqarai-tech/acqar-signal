export const CATEGORY_COLORS = {
  transaction: '#E74C3C',
  offplan: '#2980B9',
  construction: '#F39C12',
  regulatory: '#8E44AD',
  infrastructure: '#27AE60',
  investment: '#16A085',
  price_signal: '#E67E22',
  freezone: '#D4AC0D',
  rental_yield: '#1ABC9C',
  foreign_buyers: '#9B59B6'
}

export const CATEGORY_LABELS = {
  transaction: 'Transactions',
  offplan: 'Off-Plan',
  construction: 'Construction',
  regulatory: 'Regulatory',
  infrastructure: 'Infrastructure',
  investment: 'Investment',
  price_signal: 'Price Signals',
  freezone: 'Free Zones',
  rental_yield: 'Rental Yield',
  foreign_buyers: 'Foreign Buyers'
}

export const SEVERITY_COLORS = {
  1: '#27AE60',
  2: '#A8D44A',
  3: '#F39C12',
  4: '#E67E22',
  5: '#E74C3C'
}

export const DUBAI_AREAS = {
  'Downtown Dubai': [25.1972, 55.2744],
  'Dubai Marina': [25.0761, 55.1403],
  'Palm Jumeirah': [25.1124, 55.1390],
  'Business Bay': [25.1865, 55.2644],
  'DIFC': [25.2048, 55.2708],
  'JVC': [25.0586, 55.2069],
  'Dubai Hills': [25.1017, 55.2314],
  'Jumeirah': [25.2048, 55.2419],
  'Deira': [25.2697, 55.3094],
  'Bur Dubai': [25.2532, 55.2868],
}

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
