import indiaTL  from '../data/india_timeline.json'
import worldTL  from '../data/world_timeline.json'
import statesTL from '../data/states_timeline.json'

export const TIMELINE_YEARS = [2000, 2010, 2020, 2025, 2035, 2050]

function lerp(a, b, t) { return a + (b - a) * t }

// Linear interpolation between the two nearest anchor years
function interpolateOcc(tlOcc, year, salKey) {
  if (!tlOcc) return null
  const years = TIMELINE_YEARS
  // Clamp to range
  if (year <= years[0]) return { ...tlOcc[years[0]] }
  if (year >= years[years.length - 1]) return { ...tlOcc[years[years.length - 1]] }
  if (tlOcc[year]) return { ...tlOcc[year] }

  // Find surrounding anchors
  let lo = years[0], hi = years[years.length - 1]
  for (let i = 0; i < years.length - 1; i++) {
    if (year >= years[i] && year <= years[i + 1]) {
      lo = years[i]; hi = years[i + 1]; break
    }
  }
  const t = (year - lo) / (hi - lo)
  const a = tlOcc[lo], b = tlOcc[hi]

  const result = {
    workers:        Math.round(lerp(a.workers, b.workers, t)),
    growthPct:      Math.round(lerp(a.growthPct, b.growthPct, t) * 10) / 10,
    aiExposure:     Math.round(lerp(a.aiExposure, b.aiExposure, t)),
    educationYears: Math.round(lerp(a.educationYears, b.educationYears, t)),
  }
  if (a[salKey] !== undefined) {
    result[salKey] = Math.round(lerp(a[salKey], b[salKey], t))
  }
  return result
}

export function getTimelineData(region) {
  if (region === 'world')  return worldTL
  if (region === 'states') return statesTL
  return indiaTL
}

// Returns a merged occupation object: base fields + year-specific overrides
export function occAtYear(occ, year, region) {
  const tl    = getTimelineData(region)
  const tlOcc = tl.occupations[occ.id]
  const salKey = region === 'world' ? 'medianSalaryUSD' : 'medianSalaryINR'
  const snap  = interpolateOcc(tlOcc, year, salKey)
  if (!snap) return occ
  return { ...occ, ...snap }
}

export function totalWorkforceAtYear(region, year) {
  const tl = getTimelineData(region)
  const years = TIMELINE_YEARS
  if (!tl.meta?.totalWorkforce) return null

  if (tl.meta.totalWorkforce[year] !== undefined) return tl.meta.totalWorkforce[year]
  // interpolate
  let lo = years[0], hi = years[years.length - 1]
  for (let i = 0; i < years.length - 1; i++) {
    if (year >= years[i] && year <= years[i + 1]) { lo = years[i]; hi = years[i + 1]; break }
  }
  const t = (year - lo) / (hi - lo)
  return Math.round(lerp(tl.meta.totalWorkforce[lo], tl.meta.totalWorkforce[hi], t))
}
