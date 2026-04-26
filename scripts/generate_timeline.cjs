#!/usr/bin/env node
// Run: node scripts/generate_timeline.js
// Generates india_timeline.json and world_timeline.json

const fs   = require('fs')
const path = require('path')

const YEARS = [2000, 2010, 2020, 2025, 2035, 2050]

// ─── Meta totals ──────────────────────────────────────────────────────────────
const INDIA_TOTAL_WF = [396000000, 472000000, 537000000, 582000000, 628000000, 665000000]
const WORLD_TOTAL_WF = [2740000000, 3020000000, 3160000000, 3320000000, 3520000000, 3680000000]

// ─── Salary multipliers (relative to 2025 value) ─────────────────────────────
// India INR: ~7%/yr inflation 2000-25, real wage growth on top
const INR_MULT = [0.16, 0.32, 0.67, 1.0, 1.78, 3.60]
// World USD: moderate real growth in global terms
const USD_MULT = [0.50, 0.64, 0.82, 1.0, 1.40, 2.25]

// ─── AI exposure multipliers (capped at 97) ───────────────────────────────────
// AI barely existed in 2000; concept explodes after 2020
const AI_MULT = [0.03, 0.09, 0.46, 1.0, 1.75, 2.65]

// ─── Education year deltas ────────────────────────────────────────────────────
const EDU_DELTA = [-1, -0.5, 0, 0, 0.5, 1.5]

// ─── Workers sector multipliers (indexed to YEARS) ───────────────────────────
const INDIA_SECT = {
  agriculture:       [1.74, 1.45, 1.08, 1.00, 0.74, 0.43],
  construction:      [0.52, 0.70, 0.90, 1.00, 1.22, 1.18],
  trade:             [0.58, 0.73, 0.90, 1.00, 1.08, 0.94],
  manufacturing:     [0.67, 0.78, 0.91, 1.00, 1.14, 1.07],
  it_technology:     [0.03, 0.14, 0.50, 1.00, 2.30, 3.80],
  education:         [0.52, 0.70, 0.87, 1.00, 1.24, 1.50],
  healthcare:        [0.38, 0.56, 0.80, 1.00, 1.60, 2.50],
  transport:         [0.45, 0.60, 0.84, 1.00, 1.30, 1.42],
  finance:           [0.30, 0.50, 0.80, 1.00, 1.34, 1.55],
  government:        [0.70, 0.80, 0.92, 1.00, 1.06, 1.08],
  personal_services: [0.55, 0.70, 0.87, 1.00, 1.14, 1.20],
  creative_media:    [0.18, 0.36, 0.68, 1.00, 1.95, 3.00],
  mining:            [0.82, 0.90, 0.97, 1.00, 0.88, 0.68],
  utilities:         [0.44, 0.58, 0.79, 1.00, 1.62, 2.40],
}

const WORLD_SECT = {
  agriculture:               [1.38, 1.22, 1.06, 1.00, 0.82, 0.58],
  manufacturing:             [0.72, 0.82, 0.93, 1.00, 1.04, 0.92],
  trade_retail:              [0.60, 0.74, 0.90, 1.00, 1.05, 0.90],
  construction_global:       [0.55, 0.70, 0.88, 1.00, 1.18, 1.12],
  transport_logistics_global:[0.48, 0.62, 0.84, 1.00, 1.22, 1.18],
  healthcare_global:         [0.40, 0.58, 0.80, 1.00, 1.55, 2.30],
  education_global:          [0.55, 0.70, 0.87, 1.00, 1.18, 1.35],
  it_technology_global:      [0.04, 0.16, 0.52, 1.00, 2.20, 3.60],
  finance_global:            [0.35, 0.55, 0.82, 1.00, 1.28, 1.45],
  government_global:         [0.72, 0.82, 0.92, 1.00, 1.04, 1.06],
  professional_services:     [0.32, 0.52, 0.80, 1.00, 1.40, 1.80],
  mining_energy_global:      [0.75, 0.88, 0.96, 1.00, 0.92, 0.72],
  accommodation_food_global: [0.52, 0.68, 0.82, 1.00, 1.18, 1.30],
  personal_services_global:  [0.55, 0.70, 0.87, 1.00, 1.12, 1.18],
}

// ─── Per-occupation worker overrides (absolute, all 6 years) ─────────────────
const OCC_WF = {
  // ── India ──
  crop_farming:          [295000000, 258000000, 208000000, 172000000, 126000000, 68000000],
  agri_labour:           [78000000,  64000000,  50000000,  42000000,  27000000,  11000000],
  animal_husbandry:      [29000000,  30000000,  32000000,  34000000,  33000000,  28000000],
  fisheries:             [11000000,  12000000,  13000000,  14000000,  15000000,  14000000],
  horticulture:          [3200000,   4000000,   5000000,   6000000,   8000000,   10000000],
  software_engineers:    [20000,     180000,    1100000,   2200000,   4800000,   9500000],
  it_support_bpo:        [40000,     550000,    2000000,   2500000,   1800000,   750000],
  data_scientists:       [0,         4000,      75000,     400000,    2000000,   5500000],
  cybersecurity:         [0,         2500,      22000,     150000,    750000,    2000000],
  cloud_devops:          [0,         4000,      55000,     300000,    1500000,   4000000],
  ai_ml_engineers:       [0,         1500,      18000,     200000,    1000000,   3200000],
  product_managers:      [0,         4000,      70000,     250000,    750000,    1800000],
  ui_ux_designers:       [0,         2500,      55000,     200000,    650000,    1500000],
  gig_delivery:          [0,         0,         700000,    5000000,   20000000,  30000000],
  ecommerce:             [0,         8000,      350000,    3500000,   15000000,  24000000],
  street_vendors:        [11500000,  10500000,  9200000,   8500000,   7000000,   4800000],
  fintech_professionals: [0,         4000,      55000,     400000,    2000000,   4500000],
  renewable_energy:      [4000,      25000,     110000,    400000,    2500000,   11000000],
  coal_miners:           [1300000,   1200000,   980000,    800000,    480000,    120000],
  digital_creators:      [0,         1500,      35000,     500000,    2800000,   7000000],
  asha_workers:          [100000,    600000,    950000,    1100000,   1400000,   1600000],
  edtech_professionals:  [0,         5000,      50000,     300000,    900000,    2000000],
  // ── World ──
  crop_farmers:          [550000000, 520000000, 510000000, 500000000, 420000000, 290000000],
  agri_wage_labour:      [230000000, 218000000, 205000000, 194000000, 160000000, 110000000],
  livestock_dairy:       [110000000, 118000000, 125000000, 130000000, 128000000, 110000000],
  fisheries_global:      [55000000,  58000000,  59000000,  60000000,  62000000,  58000000],
  ecommerce_global:      [0,         3000000,   18000000,  50000000,  140000000, 210000000],
  ride_gig_global:       [0,         500000,    18000000,  55000000,  180000000, 260000000],
  ai_ml_global:          [0,         20000,     300000,    2000000,   12000000,  45000000],
  cybersecurity_global:  [200000,    800000,    3000000,   5500000,   18000000,  40000000],
  cloud_devops_global:   [0,         200000,    2500000,   8000000,   30000000,  80000000],
  software_engineers_global:[800000, 6000000,   18000000,  28000000,  60000000,  110000000],
  it_support_bpo_global: [2000000,   12000000,  22000000,  24500000,  18000000,  9000000],
  renewable_energy_global:[300000,   2000000,   7000000,   16200000,  65000000,  200000000],
  fossil_fuel_workers:   [18000000,  18500000,  16000000,  12000000,  7000000,   2000000],
  elderly_care:          [12000000,  18000000,  26000000,  33100000,  55000000,  95000000],
  street_informal_trade: [145000000, 130000000, 115000000, 101000000, 85000000,  62000000],
  edtech_global:         [0,         200000,    3000000,   10000000,  35000000,  80000000],
  fintech_global:        [0,         100000,    1500000,   5000000,   22000000,  60000000],
}

// ─── Growth rate deltas per India sector (added to 2025 growthPct) ────────────
const INDIA_GDELTA = {
  agriculture:       [+1.0, +0.5, +0.2,  0, -1.2, -2.0],
  construction:      [-1.5, -0.8, -0.3,  0, +0.5, -0.8],
  trade:             [-2.0, -1.2, -0.4,  0, +0.3, -1.0],
  manufacturing:     [+0.8, +0.4, +0.1,  0, +0.3, -1.0],
  it_technology:     [-8.0, -4.0, -1.8,  0, +3.0, +1.5],
  education:         [-1.2, -0.6, -0.2,  0, +0.6, +1.0],
  healthcare:        [-2.5, -1.8, -0.8,  0, +2.5, +3.0],
  transport:         [-2.0, -1.2, -0.5,  0, +2.5, +0.8],
  finance:           [-3.0, -2.0, -0.8,  0, +2.0, +0.8],
  government:        [+0.5, +0.2,  0,    0, -0.3, -0.8],
  personal_services: [+0.8, +0.3,  0,    0, +0.3, -0.8],
  creative_media:    [-8.0, -4.0, -2.5,  0, +4.0, +3.0],
  mining:            [+1.5, +0.8, +0.3,  0, -2.0, -3.5],
  utilities:         [-3.0, -2.0, -0.8,  0, +3.5, +4.5],
}

const WORLD_GDELTA = {
  agriculture:               [+1.2, +0.6, +0.2, 0, -1.0, -1.8],
  manufacturing:             [+1.0, +0.5, +0.2, 0, -0.5, -1.2],
  trade_retail:              [-1.5, -0.8, -0.3, 0, +0.2, -1.0],
  construction_global:       [-1.0, -0.5, -0.2, 0, +0.5, -0.5],
  transport_logistics_global:[-1.5, -0.8, -0.3, 0, +1.5, +0.5],
  healthcare_global:         [-2.0, -1.5, -0.5, 0, +2.0, +3.0],
  education_global:          [-1.0, -0.5, -0.2, 0, +0.8, +1.2],
  it_technology_global:      [-8.0, -4.0, -2.0, 0, +3.0, +2.0],
  finance_global:            [-2.5, -1.5, -0.5, 0, +1.5, +0.5],
  government_global:         [+0.3, +0.2,  0,   0, -0.2, -0.5],
  professional_services:     [-3.0, -1.5, -0.5, 0, +2.0, +1.5],
  mining_energy_global:      [+1.5, +0.8, +0.3, 0, -1.5, -3.0],
  accommodation_food_global: [-1.5, -0.8, -0.3, 0, +0.8, +0.5],
  personal_services_global:  [+0.5, +0.2,  0,   0, +0.2, -0.5],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)) }
function round1(v) { return Math.round(v * 10) / 10 }

function buildOccTimeline(occ, sectorId, isUSD, sectMap, gDelta) {
  const salKey  = isUSD ? 'medianSalaryUSD' : 'medianSalaryINR'
  const salMult = isUSD ? USD_MULT : INR_MULT
  const sWf     = sectMap[sectorId] || Array(6).fill(1)
  const gd      = gDelta[sectorId]  || Array(6).fill(0)
  const wfOvr   = OCC_WF[occ.id]

  const result = {}
  YEARS.forEach((yr, i) => {
    // workers
    const workers = wfOvr
      ? Math.max(0, wfOvr[i])
      : Math.max(100, Math.round(occ.workers * sWf[i]))

    // salary
    const salary = Math.max(500, Math.round(occ[salKey] * salMult[i]))

    // growth
    const growthPct = round1(clamp(occ.growthPct + gd[i], -12, 60))

    // ai exposure
    const aiExposure = Math.round(clamp(occ.aiExposure * AI_MULT[i], 0, 97))

    // education
    const educationYears = Math.max(4, Math.round(occ.educationYears + EDU_DELTA[i]))

    const entry = { workers }
    entry[salKey] = salary
    entry.growthPct = growthPct
    entry.aiExposure = aiExposure
    entry.educationYears = educationYears
    result[yr] = entry
  })
  return result
}

function processDataset(data, isUSD, sectMap, gDelta) {
  const out = {
    meta: { years: YEARS, totalWorkforce: {} },
    occupations: {}
  }

  // Determine total workforce series
  const totWf = isUSD ? WORLD_TOTAL_WF : INDIA_TOTAL_WF
  YEARS.forEach((yr, i) => { out.meta.totalWorkforce[yr] = totWf[i] })

  data.sectors.forEach(sector => {
    sector.occupations.forEach(occ => {
      out.occupations[occ.id] = buildOccTimeline(occ, sector.id, isUSD, sectMap, gDelta)
    })
  })
  return out
}

// ─── States: map occupation id suffix → India sector ─────────────────────────
function statesSectorFor(occId) {
  const s = occId.split('_').slice(1).join('_')
  if (s.startsWith('agri') || s === 'tea_agri' || s === 'fisheries_trade') return 'agriculture'
  if (s.includes('it') || s === 'fintech' || s === 'aerospace_defense') return 'it_technology'
  if (s.startsWith('manufacturing') || s.includes('textile') || s.includes('msme') ||
      s.includes('auto') || s.includes('pharma') || s.includes('chemicals') ||
      s.includes('steel') || s.includes('diamond') || s.includes('artisan') ||
      s.includes('handicrafts') || s.includes('handlooms'))     return 'manufacturing'
  if (s.startsWith('construction') || s === 'metro') return 'construction'
  if (s.startsWith('trade') || s === 'migrant_trade' || s === 'gulf_remittance' ||
      s.includes('ports') || s === 'gig_services')              return 'trade'
  if (s.includes('tourism') || s.includes('hospitality'))       return 'personal_services'
  if (s.includes('mining') || s.includes('coal') || s === 'oil_gas') return 'mining'
  if (s === 'renewable' || s === 'renewable_energy' || s === 'hydro_power' ||
      s === 'power')                                             return 'utilities'
  if (s.includes('healthcare') || s.includes('health'))         return 'healthcare'
  if (s.includes('transport') || s.includes('logistics'))       return 'transport'
  if (s.startsWith('govt') || s.includes('defence') || s.includes('services_govt') ||
      s.includes('admin'))                                       return 'government'
  if (s.includes('finance') || s.includes('banking'))           return 'finance'
  return 'trade'  // default fallback
}

function processStates(data) {
  const STATES_TOTAL_WF = [330000000, 390000000, 445000000, 477000000, 510000000, 540000000]
  const out = {
    meta: { years: YEARS, totalWorkforce: {} },
    occupations: {}
  }
  YEARS.forEach((yr, i) => { out.meta.totalWorkforce[yr] = STATES_TOTAL_WF[i] })

  data.sectors.forEach(sector => {
    sector.occupations.forEach(occ => {
      const sectId = statesSectorFor(occ.id)
      out.occupations[occ.id] = buildOccTimeline(occ, sectId, false, INDIA_SECT, INDIA_GDELTA)
    })
  })
  return out
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const indiaData  = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../client/src/data/india_jobs.json'), 'utf8'))
const worldData  = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../client/src/data/world_jobs.json'), 'utf8'))
const statesData = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../client/src/data/india_states_jobs.json'), 'utf8'))

const indiaTL  = processDataset(indiaData, false, INDIA_SECT, INDIA_GDELTA)
const worldTL  = processDataset(worldData, true,  WORLD_SECT, WORLD_GDELTA)
const statesTL = processStates(statesData)

fs.writeFileSync(
  path.join(__dirname, '../client/src/data/india_timeline.json'),
  JSON.stringify(indiaTL, null, 2))
fs.writeFileSync(
  path.join(__dirname, '../client/src/data/world_timeline.json'),
  JSON.stringify(worldTL, null, 2))
fs.writeFileSync(
  path.join(__dirname, '../client/src/data/states_timeline.json'),
  JSON.stringify(statesTL, null, 2))

console.log('India occupations:',  Object.keys(indiaTL.occupations).length)
console.log('World occupations:',  Object.keys(worldTL.occupations).length)
console.log('States occupations:', Object.keys(statesTL.occupations).length)
console.log('Done.')
