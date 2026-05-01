/**
 * Extends both timeline JSON files with:
 *   Historical: 1950, 1960, 1970, 1980, 1990
 *   Near-future: 2030, 2040
 *
 * Historical data uses profile-based scaling from the year-2000 baseline.
 * Future data (2030, 2040) is simple linear interpolation between existing anchors.
 * AI exposure = 0 for all years ≤ 1990 (concept didn't apply).
 */

const fs   = require('fs')
const path = require('path')

// ── New year sets ──────────────────────────────────────────────────────────────
const HIST_YEARS   = [1950, 1960, 1970, 1980, 1990]
const FUTURE_YEARS = [2030, 2040]

// ── Aggregate workforce ────────────────────────────────────────────────────────
const INDIA_TOTAL = {
  1950: 150000000,
  1960: 185000000,
  1970: 220000000,
  1980: 270000000,
  1990: 330000000,
  2030: 610000000,
  2040: 640000000,
}
const WORLD_TOTAL = {
  1950: 1200000000,
  1960: 1400000000,
  1970: 1640000000,
  1980: 1980000000,
  1990: 2380000000,
  2030: 3430000000,
  2040: 3580000000,
}

// ── Historical profiles ────────────────────────────────────────────────────────
// Each year entry: { w: workerMultiplier, s: salaryMultiplier, g: growthPct, e: eduMultiplier }
// workerMultiplier  is applied to the year-2000 worker baseline
// salaryMultiplier  is applied to the year-2000 salary baseline
// aiExposure is always 0 for 1950-1990
const P = {
  // Farming, fishing, casual labour — existed at large scale since pre-independence
  ANCIENT: {
    1950: { w: 2.60, s: 0.025, g:  0.2, e: 0.50 },
    1960: { w: 2.30, s: 0.045, g:  0.5, e: 0.55 },
    1970: { w: 2.00, s: 0.085, g:  0.8, e: 0.65 },
    1980: { w: 1.65, s: 0.19,  g:  1.2, e: 0.76 },
    1990: { w: 1.28, s: 0.44,  g:  1.8, e: 0.88 },
  },
  // Perennial services: teachers, doctors, retail, civil engineers, railways
  TRADITIONAL: {
    1950: { w: 0.22, s: 0.030, g:  2.0, e: 0.55 },
    1960: { w: 0.32, s: 0.055, g:  2.8, e: 0.62 },
    1970: { w: 0.44, s: 0.100, g:  3.5, e: 0.70 },
    1980: { w: 0.58, s: 0.220, g:  4.2, e: 0.80 },
    1990: { w: 0.76, s: 0.480, g:  4.5, e: 0.92 },
  },
  // Industry / factory / trades — grew with post-war industrialisation
  INDUSTRIAL: {
    1950: { w: 0.10, s: 0.028, g:  2.5, e: 0.55 },
    1960: { w: 0.20, s: 0.055, g:  4.0, e: 0.62 },
    1970: { w: 0.35, s: 0.100, g:  5.5, e: 0.70 },
    1980: { w: 0.52, s: 0.220, g:  5.8, e: 0.80 },
    1990: { w: 0.72, s: 0.470, g:  5.5, e: 0.90 },
  },
  // Emerged with post-1991 LPG reforms: banking, insurance, telecom, auto, logistics
  POST_LIB: {
    1950: { w: 0.020, s: 0.030, g:  0.5, e: 0.62 },
    1960: { w: 0.035, s: 0.055, g:  1.0, e: 0.68 },
    1970: { w: 0.065, s: 0.100, g:  2.0, e: 0.74 },
    1980: { w: 0.140, s: 0.215, g:  3.5, e: 0.82 },
    1990: { w: 0.280, s: 0.450, g:  6.5, e: 0.92 },
  },
  // Government / public sector — always present, steady growth
  GOVT: {
    1950: { w: 0.38, s: 0.030, g:  1.5, e: 0.55 },
    1960: { w: 0.50, s: 0.055, g:  2.0, e: 0.62 },
    1970: { w: 0.62, s: 0.100, g:  2.5, e: 0.70 },
    1980: { w: 0.74, s: 0.220, g:  2.8, e: 0.80 },
    1990: { w: 0.88, s: 0.460, g:  2.2, e: 0.90 },
  },
  // IT-era roles: born ~1995-2005 (software, BPO, data, hardware/network)
  IT_ERA: {
    1950: { w: 0.000, s: 0,     g:  0,    e: 1.00 },
    1960: { w: 0.000, s: 0,     g:  0,    e: 1.00 },
    1970: { w: 0.000, s: 0,     g:  0,    e: 1.00 },
    1980: { w: 0.004, s: 0.14,  g:  8.0,  e: 0.97 },
    1990: { w: 0.018, s: 0.26,  g: 20.0,  e: 0.98 },
  },
  // Digital-native: born post-2000 (e-commerce, gig, digital creators, metro transit)
  DIGITAL_NATIVE: {
    1950: { w: 0, s: 0, g: 0, e: 1.0 },
    1960: { w: 0, s: 0, g: 0, e: 1.0 },
    1970: { w: 0, s: 0, g: 0, e: 1.0 },
    1980: { w: 0, s: 0, g: 0, e: 1.0 },
    1990: { w: 0, s: 0, g: 0, e: 1.0 },
  },
  // Future roles: born post-2015 (EV battery, AI/ML, green hydrogen, critical minerals)
  FUTURE_ROLE: {
    1950: { w: 0, s: 0, g: 0, e: 1.0 },
    1960: { w: 0, s: 0, g: 0, e: 1.0 },
    1970: { w: 0, s: 0, g: 0, e: 1.0 },
    1980: { w: 0, s: 0, g: 0, e: 1.0 },
    1990: { w: 0, s: 0, g: 0, e: 1.0 },
  },
}

// ── India occupation → profile ─────────────────────────────────────────────────
const INDIA_PROFILE = {
  // Agriculture
  crop_farming:          'ANCIENT',
  animal_husbandry:      'ANCIENT',
  fisheries:             'ANCIENT',
  agri_labour:           'ANCIENT',
  horticulture:          'ANCIENT',
  agri_engineers_ext:    'POST_LIB',
  // Construction
  construction_workers:  'ANCIENT',
  electricians_plumbers: 'INDUSTRIAL',
  construction_supervisors:'INDUSTRIAL',
  civil_engineers:       'TRADITIONAL',
  real_estate_agents:    'POST_LIB',
  equipment_operators:   'INDUSTRIAL',
  architects_india:      'TRADITIONAL',
  // Trade
  retail_workers:        'ANCIENT',
  restaurant_hotel:      'TRADITIONAL',
  wholesale_trade:       'TRADITIONAL',
  ecommerce:             'DIGITAL_NATIVE',
  gig_delivery:          'DIGITAL_NATIVE',
  tourism_travel:        'POST_LIB',
  street_vendors:        'ANCIENT',
  // Manufacturing
  garment_textile:       'INDUSTRIAL',
  food_processing:       'INDUSTRIAL',
  automobile:            'POST_LIB',
  electronics:           'POST_LIB',
  chemical_pharma:       'INDUSTRIAL',
  msme_workers:          'INDUSTRIAL',
  craft_artisans:        'ANCIENT',
  ev_battery_workers:    'FUTURE_ROLE',
  defence_manufacturing: 'POST_LIB',
  // IT & Technology
  software_engineers:    'IT_ERA',
  it_support_bpo:        'IT_ERA',
  data_scientists:       'IT_ERA',
  cybersecurity:         'IT_ERA',
  cloud_devops:          'DIGITAL_NATIVE',
  ai_ml_engineers:       'FUTURE_ROLE',
  product_managers:      'IT_ERA',
  ui_ux_designers:       'IT_ERA',
  hardware_network_eng:  'IT_ERA',
  // Education
  school_teachers:       'TRADITIONAL',
  college_faculty:       'TRADITIONAL',
  edtech_professionals:  'DIGITAL_NATIVE',
  private_tutors:        'TRADITIONAL',
  // Healthcare
  doctors:               'TRADITIONAL',
  nurses:                'TRADITIONAL',
  pharmacists:           'TRADITIONAL',
  paramedics:            'TRADITIONAL',
  asha_workers:          'POST_LIB',
  hospital_admin:        'POST_LIB',
  ayush_practitioners:   'ANCIENT',
  mental_health_workers: 'POST_LIB',
  // Transport
  truck_drivers:         'INDUSTRIAL',
  auto_taxi_drivers:     'INDUSTRIAL',
  railway_staff:         'TRADITIONAL',
  logistics_warehouse:   'POST_LIB',
  aviation:              'POST_LIB',
  postal_courier:        'TRADITIONAL',
  metro_urban_transit:   'DIGITAL_NATIVE',
  // Finance
  bank_employees:        'TRADITIONAL',
  insurance:             'TRADITIONAL',
  fintech_professionals: 'DIGITAL_NATIVE',
  chartered_accountants: 'TRADITIONAL',
  stock_brokers:         'POST_LIB',
  microfinance:          'POST_LIB',
  mutual_fund_agents:    'DIGITAL_NATIVE',
  // Government
  civil_servants:        'GOVT',
  police_paramilitary:   'GOVT',
  municipal_workers:     'GOVT',
  psu_employees:         'GOVT',
  armed_forces:          'GOVT',
  // Personal Services
  domestic_workers:      'ANCIENT',
  security_guards:       'INDUSTRIAL',
  beauty_wellness:       'TRADITIONAL',
  sanitation_waste:      'TRADITIONAL',
  gig_home_services:     'DIGITAL_NATIVE',
  // Creative & Media
  film_entertainment:    'TRADITIONAL',
  digital_creators:      'DIGITAL_NATIVE',
  journalists:           'TRADITIONAL',
  advertising_marketing: 'POST_LIB',
  gaming_esports:        'DIGITAL_NATIVE',
  // Mining
  coal_miners:           'TRADITIONAL',
  stone_quarry:          'ANCIENT',
  mining_engineers:      'TRADITIONAL',
  oil_gas_workers:       'POST_LIB',
  mineral_processing:    'INDUSTRIAL',
  critical_minerals_workers:'FUTURE_ROLE',
  // Utilities
  power_utility:         'TRADITIONAL',
  renewable_energy:      'FUTURE_ROLE',
  water_sanitation_utility:'TRADITIONAL',
  gas_distribution:      'POST_LIB',
  nuclear_energy_workers:'POST_LIB',
}

// ── World occupation → profile ─────────────────────────────────────────────────
const WORLD_PROFILE = {
  // Agriculture
  crop_farmers:             'ANCIENT',
  livestock_dairy:          'ANCIENT',
  fisheries_global:         'ANCIENT',
  agri_wage_labour:         'ANCIENT',
  food_scientists_global:   'POST_LIB',
  // Manufacturing
  factory_assembly:         'INDUSTRIAL',
  garment_textile_global:   'INDUSTRIAL',
  food_beverage_mfg:        'INDUSTRIAL',
  auto_engineering_global:  'POST_LIB',
  electronics_global:       'POST_LIB',
  pharma_chemical_global:   'INDUSTRIAL',
  aerospace_mfg_global:     'POST_LIB',
  semiconductor_workers:    'IT_ERA',
  // Trade
  retail_workers_global:    'TRADITIONAL',
  ecommerce_global:         'DIGITAL_NATIVE',
  wholesale_distribution_global:'TRADITIONAL',
  street_informal_trade:    'ANCIENT',
  // Construction
  construction_workers_global:'ANCIENT',
  civil_engineers_global:   'TRADITIONAL',
  skilled_trades_global:    'INDUSTRIAL',
  real_estate_global:       'POST_LIB',
  // Transport
  truck_drivers_global:     'INDUSTRIAL',
  ride_gig_global:          'DIGITAL_NATIVE',
  aviation_global:          'POST_LIB',
  maritime_shipping:        'TRADITIONAL',
  logistics_warehouse_global:'POST_LIB',
  drone_operators_global:   'FUTURE_ROLE',
  // Healthcare
  doctors_global:           'TRADITIONAL',
  nurses_global:            'TRADITIONAL',
  community_health_global:  'POST_LIB',
  elderly_care:             'POST_LIB',
  mental_health_global:     'POST_LIB',
  biotech_researchers_global:'IT_ERA',
  // Education
  school_teachers_global:   'TRADITIONAL',
  higher_ed_global:         'TRADITIONAL',
  edtech_global:            'DIGITAL_NATIVE',
  // IT & Tech
  software_engineers_global:'IT_ERA',
  ai_ml_global:             'FUTURE_ROLE',
  cybersecurity_global:     'IT_ERA',
  cloud_devops_global:      'DIGITAL_NATIVE',
  data_analysts_global:     'IT_ERA',
  it_support_bpo_global:    'IT_ERA',
  quantum_computing_global: 'FUTURE_ROLE',
  robotics_automation_global:'IT_ERA',
  // Finance
  bank_employees_global:    'TRADITIONAL',
  fintech_global:           'DIGITAL_NATIVE',
  investment_advisors_global:'POST_LIB',
  insurance_global:         'TRADITIONAL',
  accounting_audit_global:  'TRADITIONAL',
  crypto_defi_global:       'FUTURE_ROLE',
  // Government
  civil_servants_global:    'GOVT',
  police_military_global:   'GOVT',
  social_workers_global:    'TRADITIONAL',
  international_orgs:       'POST_LIB',
  // Professional Services
  lawyers_legal:            'TRADITIONAL',
  consultants_mgmt:         'POST_LIB',
  marketing_advertising_global:'POST_LIB',
  architects_designers:     'TRADITIONAL',
  hr_recruiters:            'POST_LIB',
  scientists_researchers:   'TRADITIONAL',
  journalists_media_global: 'TRADITIONAL',
  accountants_global_pro:   'TRADITIONAL',
  climate_sustainability_global:'FUTURE_ROLE',
  legal_tech_global:        'FUTURE_ROLE',
  // Mining & Energy
  fossil_fuel_workers:      'INDUSTRIAL',
  renewable_energy_global:  'FUTURE_ROLE',
  mining_workers_global:    'INDUSTRIAL',
  utility_grid_workers:     'POST_LIB',
  nuclear_global:           'POST_LIB',
  hydrogen_energy_global:   'FUTURE_ROLE',
  // Hospitality
  chefs_restaurant_global:  'TRADITIONAL',
  hotel_hospitality_global: 'POST_LIB',
  tour_guides_travel:       'POST_LIB',
  cruise_hospitality:       'DIGITAL_NATIVE',
  // Personal Services
  domestic_workers_global:  'ANCIENT',
  beauty_fitness_global:    'TRADITIONAL',
  security_services_global: 'INDUSTRIAL',
  elder_childcare_global:   'POST_LIB',
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t }

function interpolateYear(occData, targetYear, salKey) {
  const years = Object.keys(occData).map(Number).sort((a, b) => a - b)
  if (targetYear <= years[0])                    return { ...occData[years[0]] }
  if (targetYear >= years[years.length - 1])     return { ...occData[years[years.length - 1]] }
  for (let i = 0; i < years.length - 1; i++) {
    if (targetYear >= years[i] && targetYear <= years[i + 1]) {
      const t = (targetYear - years[i]) / (years[i + 1] - years[i])
      const a = occData[years[i]], b = occData[years[i + 1]]
      const r = {
        workers:        Math.round(lerp(a.workers,        b.workers,        t)),
        growthPct:      Math.round(lerp(a.growthPct,      b.growthPct,      t) * 10) / 10,
        aiExposure:     Math.round(lerp(a.aiExposure,     b.aiExposure,     t)),
        educationYears: Math.round(lerp(a.educationYears, b.educationYears, t)),
      }
      if (a[salKey] !== undefined) r[salKey] = Math.round(lerp(a[salKey], b[salKey], t))
      return r
    }
  }
}

function buildHistEntry(base2000, year, profile, salKey) {
  const prof = P[profile][year]
  if (!prof) return null

  // If this occupation effectively didn't exist (w ~0), give a nominal entry
  if (prof.w === 0) {
    const entry = {
      workers:        500,        // nominal — avoids zero-area in treemap
      growthPct:      prof.g,
      aiExposure:     0,
      educationYears: Math.max(4, Math.round(base2000.educationYears * prof.e)),
    }
    if (base2000[salKey]) entry[salKey] = Math.round(base2000[salKey] * 0.02)
    return entry
  }

  const entry = {
    workers:        Math.max(500, Math.round(base2000.workers * prof.w)),
    growthPct:      Math.round(prof.g * 10) / 10,
    aiExposure:     0,
    educationYears: Math.max(2, Math.round(base2000.educationYears * prof.e)),
  }
  if (base2000[salKey] && prof.s > 0) {
    entry[salKey] = Math.max(1, Math.round(base2000[salKey] * prof.s))
  }
  return entry
}

// ── Main extension function ────────────────────────────────────────────────────
function extendTimeline(filePath, profileMap, metaAdditions, salKey) {
  const data  = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  let added   = 0, skipped = 0

  // Add new years to meta
  const allYears = [...data.meta.years, ...HIST_YEARS, ...FUTURE_YEARS]
    .filter((y, i, a) => a.indexOf(y) === i)
    .sort((a, b) => a - b)
  data.meta.years = allYears

  for (const [y, total] of Object.entries(metaAdditions)) {
    data.meta.totalWorkforce[y] = total
  }

  for (const [occId, occData] of Object.entries(data.occupations)) {
    const base2000 = occData['2000']
    if (!base2000) { skipped++; continue }

    const profile = profileMap[occId]
    if (!profile) { console.warn(`  ⚠ No profile for ${occId}`); skipped++; continue }

    // Historical years
    for (const yr of HIST_YEARS) {
      if (!occData[yr]) {
        const entry = buildHistEntry(base2000, yr, profile, salKey)
        if (entry) { occData[String(yr)] = entry; added++ }
      }
    }

    // Future interpolation years
    for (const yr of FUTURE_YEARS) {
      if (!occData[yr]) {
        const entry = interpolateYear(occData, yr, salKey)
        if (entry) { occData[String(yr)] = entry; added++ }
      }
    }

    // Re-sort keys chronologically
    const sortedKeys = Object.keys(occData).map(Number).sort((a,b)=>a-b)
    const sorted = {}
    for (const k of sortedKeys) sorted[String(k)] = occData[String(k)]
    data.occupations[occId] = sorted
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
  console.log(`✓ ${path.basename(filePath)}: +${added} year entries added (${skipped} skipped)`)
}

// ── Run ────────────────────────────────────────────────────────────────────────
const base = path.join(__dirname, '../client/src/data')

extendTimeline(
  path.join(base, 'india_timeline.json'),
  INDIA_PROFILE,
  INDIA_TOTAL,
  'medianSalaryINR'
)

extendTimeline(
  path.join(base, 'world_timeline.json'),
  WORLD_PROFILE,
  WORLD_TOTAL,
  'medianSalaryUSD'
)

console.log('Done. New anchor years:', [1950,1960,1970,1980,1990,2000,2010,2020,2025,2030,2035,2040,2050].join(', '))
