import { EXCHANGE_RATE } from '../App.jsx'

export function getMetricValue(occ, layer) {
  switch (layer) {
    case 'growth':      return occ.growthPct      ?? null
    case 'salary':      return occ.medianSalaryUSD ?? (occ.medianSalaryINR != null ? occ.medianSalaryINR / EXCHANGE_RATE : null)
    case 'education':   return occ.educationYears  ?? null
    case 'ai':          return occ.aiExposure       ?? null
    case 'informality': return occ.informalityPct   ?? null
    case 'gender':      return occ.femalePct         ?? null
    default:            return null
  }
}

export function formatMetric(occ, layer, currency) {
  switch (layer) {
    case 'growth': {
      const v = occ.growthPct
      if (v == null) return '—'
      return `${v > 0 ? '+' : ''}${v}%`
    }
    case 'salary': {
      const usd = occ.medianSalaryUSD ?? (occ.medianSalaryINR != null ? occ.medianSalaryINR / EXCHANGE_RATE : null)
      if (usd == null) return '—'
      if (currency === 'usd') return usd >= 1000 ? `$${(usd/1000).toFixed(1)}K` : `$${Math.round(usd)}`
      const inr = occ.medianSalaryINR ?? (usd * EXCHANGE_RATE)
      return inr >= 100000 ? `₹${(inr/1000).toFixed(0)}K` : `₹${Math.round(inr/1000)}K`
    }
    case 'education':   return occ.educationYears  != null ? `${occ.educationYears} yrs` : '—'
    case 'ai':          return occ.aiExposure       != null ? `${occ.aiExposure}/100`     : '—'
    case 'informality': return occ.informalityPct   != null ? `${occ.informalityPct}%`    : '—'
    case 'gender':      return occ.femalePct         != null ? `${occ.femalePct}% ♀`       : '—'
    default:            return '—'
  }
}

export function fmtWorkers(n) {
  if (!n) return '—'
  if (n >= 1e9) return `${(n/1e9).toFixed(2)}B`
  if (n >= 1e7) return `${(n/1e7).toFixed(1)}Cr`
  if (n >= 1e5) return `${(n/1e5).toFixed(1)}L`
  return `${(n/1000).toFixed(0)}K`
}
