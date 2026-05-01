import { useState } from 'react'
import { EXCHANGE_RATE } from '../App.jsx'
import { occAtYear, getTimelineData, TIMELINE_YEARS, totalWorkforceAtYear } from '../utils/timeline.js'

// India occupation ID → nearest World equivalent ID
const INDIA_TO_WORLD = {
  crop_farming:           'crop_farmers',
  animal_husbandry:       'livestock_dairy',
  fisheries:              'fisheries_global',
  agri_labour:            'agri_wage_labour',
  horticulture:           'crop_farmers',
  agri_engineers_ext:     'food_scientists_global',
  construction_workers:   'construction_workers_global',
  electricians_plumbers:  'skilled_trades_global',
  construction_supervisors:'civil_engineers_global',
  civil_engineers:        'civil_engineers_global',
  real_estate_agents:     'real_estate_global',
  equipment_operators:    'factory_assembly',
  architects_india:       'architects_designers',
  retail_workers:         'retail_workers_global',
  restaurant_hotel:       'chefs_restaurant_global',
  wholesale_trade:        'wholesale_distribution_global',
  ecommerce:              'ecommerce_global',
  gig_delivery:           'ride_gig_global',
  tourism_travel:         'tour_guides_travel',
  street_vendors:         'street_informal_trade',
  garment_textile:        'garment_textile_global',
  food_processing:        'food_beverage_mfg',
  automobile:             'auto_engineering_global',
  electronics:            'electronics_global',
  chemical_pharma:        'pharma_chemical_global',
  msme_workers:           'factory_assembly',
  ev_battery_workers:     'electronics_global',
  defence_manufacturing:  'aerospace_mfg_global',
  software_engineers:     'software_engineers_global',
  it_support_bpo:         'it_support_bpo_global',
  data_scientists:        'data_analysts_global',
  cybersecurity:          'cybersecurity_global',
  cloud_devops:           'cloud_devops_global',
  ai_ml_engineers:        'ai_ml_global',
  product_managers:       'consultants_mgmt',
  ui_ux_designers:        'architects_designers',
  hardware_network_eng:   'cloud_devops_global',
  school_teachers:        'school_teachers_global',
  college_faculty:        'higher_ed_global',
  edtech_professionals:   'edtech_global',
  private_tutors:         'school_teachers_global',
  doctors:                'doctors_global',
  nurses:                 'nurses_global',
  pharmacists:            'biotech_researchers_global',
  paramedics:             'community_health_global',
  asha_workers:           'community_health_global',
  hospital_admin:         'civil_servants_global',
  ayush_practitioners:    'community_health_global',
  mental_health_workers:  'mental_health_global',
  truck_drivers:          'truck_drivers_global',
  auto_taxi_drivers:      'ride_gig_global',
  railway_staff:          'logistics_warehouse_global',
  logistics_warehouse:    'logistics_warehouse_global',
  aviation:               'aviation_global',
  postal_courier:         'logistics_warehouse_global',
  metro_urban_transit:    'logistics_warehouse_global',
  bank_employees:         'bank_employees_global',
  insurance:              'insurance_global',
  fintech_professionals:  'fintech_global',
  chartered_accountants:  'accounting_audit_global',
  stock_brokers:          'investment_advisors_global',
  microfinance:           'bank_employees_global',
  mutual_fund_agents:     'investment_advisors_global',
  civil_servants:         'civil_servants_global',
  police_paramilitary:    'police_military_global',
  municipal_workers:      'civil_servants_global',
  psu_employees:          'civil_servants_global',
  armed_forces:           'police_military_global',
  domestic_workers:       'domestic_workers_global',
  security_guards:        'security_services_global',
  beauty_wellness:        'beauty_fitness_global',
  sanitation_waste:       'community_health_global',
  gig_home_services:      'ride_gig_global',
  film_entertainment:     'journalists_media_global',
  digital_creators:       'marketing_advertising_global',
  journalists:            'journalists_media_global',
  advertising_marketing:  'marketing_advertising_global',
  gaming_esports:         'software_engineers_global',
  coal_miners:            'mining_workers_global',
  stone_quarry:           'mining_workers_global',
  mining_engineers:       'mining_workers_global',
  oil_gas_workers:        'fossil_fuel_workers',
  mineral_processing:     'mining_workers_global',
  critical_minerals_workers:'mining_workers_global',
  power_utility:          'utility_grid_workers',
  renewable_energy:       'renewable_energy_global',
  water_sanitation_utility:'utility_grid_workers',
  gas_distribution:       'fossil_fuel_workers',
  nuclear_energy_workers: 'nuclear_global',
}

function getPivots(occ, occY, data, year, region) {
  if ((occY.aiExposure ?? 0) < 52) return []
  const salUSD = occY.medianSalaryUSD ?? (occY.medianSalaryINR != null ? occY.medianSalaryINR / EXCHANGE_RATE : null)
  const eduYrs = occY.educationYears ?? 12
  return data.sectors
    .flatMap(s => s.occupations.map(o => ({ occ: o, sector: s, oy: occAtYear(o, year, region) })))
    .filter(c =>
      c.occ.id !== occ.id &&
      (c.oy.aiExposure ?? 100) < 42 &&
      Math.abs((c.oy.educationYears ?? 12) - eduYrs) <= 3
    )
    .sort((a, b) => {
      const aSal = a.oy.medianSalaryUSD ?? (a.oy.medianSalaryINR != null ? a.oy.medianSalaryINR / EXCHANGE_RATE : 0)
      const bSal = b.oy.medianSalaryUSD ?? (b.oy.medianSalaryINR != null ? b.oy.medianSalaryINR / EXCHANGE_RATE : 0)
      const ref  = salUSD || 500
      const aScore = Math.abs(aSal - ref) / ref + (a.oy.aiExposure || 0) / 200
      const bScore = Math.abs(bSal - ref) / ref + (b.oy.aiExposure || 0) / 200
      return aScore - bScore
    })
    .slice(0, 3)
}

function fmt(n) {
  if (n >= 1e7)  return `${(n/1e7).toFixed(2)} Cr`
  if (n >= 1e5)  return `${(n/1e5).toFixed(1)} Lakh`
  return `${(n/1000).toFixed(0)}K`
}

function fmtSal(occ, currency) {
  const usd = occ.medianSalaryUSD ?? (occ.medianSalaryINR / EXCHANGE_RATE)
  if (currency === 'usd') {
    return `$${usd >= 1000 ? (usd/1000).toFixed(1)+'K' : Math.round(usd)}/mo`
  }
  const inr = occ.medianSalaryINR ?? (usd * EXCHANGE_RATE)
  return `₹${inr >= 100000 ? (inr/1000).toFixed(0)+'K' : Math.round(inr/1000)+'K'}/mo`
}

function Badge({ label, value, color = 'slate' }) {
  const cls = {
    slate:   'bg-slate-800 text-slate-300',
    green:   'bg-emerald-900/60 text-emerald-300',
    red:     'bg-rose-900/60 text-rose-300',
    amber:   'bg-amber-900/60 text-amber-300',
    blue:    'bg-sky-900/60 text-sky-300',
    violet:  'bg-violet-900/60 text-violet-300',
  }[color]
  return (
    <div className={`rounded-xl p-2.5 ${cls}`}>
      <p className="text-[9px] uppercase tracking-widest opacity-70 font-bold mb-0.5">{label}</p>
      <p className="text-base font-black">{value}</p>
    </div>
  )
}

// Tiny SVG sparkline with area fill
function Sparkline({ values, color = '#38bdf8', nowIdx, width = 230, height = 34, yearLabels }) {
  if (!values || values.length < 2) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * (width - 2) + 1,
    height - 4 - ((v - min) / range) * (height - 10),
  ])
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length-1][0].toFixed(1)},${height} L${pts[0][0].toFixed(1)},${height}Z`
  const gradId = `sg${color.replace(/[^a-z0-9]/gi, '')}`
  const nowPt  = nowIdx != null && nowIdx >= 0 && nowIdx < pts.length ? pts[nowIdx] : null

  return (
    <div>
      <svg width={width} height={height} className="overflow-visible block">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0"   />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradId})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {nowPt && (
          <circle cx={nowPt[0]} cy={nowPt[1]} r="3.5" fill={color} stroke="#0f172a" strokeWidth="2" />
        )}
      </svg>
      {yearLabels && (
        <div className="flex justify-between mt-0.5">
          {yearLabels.map((lbl, i) => (
            <span key={i} className={`text-[8px] tabular-nums ${lbl ? 'text-slate-600' : ''}`}>{lbl}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DetailPanel({ sector, occupation: occ, currency, region, year = 2025, onClose, data, worldData, onPivot }) {
  const [outlook, setOutlook]           = useState(null)
  const [outlookLoading, setLoading]    = useState(false)
  const [outlookError, setOutlookError] = useState(null)

  if (!occ) return null

  const occY             = { ...occ, ...occAtYear(occ, year, region) }
  const growthColor      = occY.growthPct < 0 ? 'red' : occY.growthPct < 5 ? 'amber' : 'green'
  const aiColor          = occY.aiExposure > 60 ? 'red' : occY.aiExposure > 35 ? 'amber' : 'green'
  const dii              = occ.digitalIntensity ?? null
  const digitalColor     = dii == null ? 'slate' : dii > 70 ? 'blue' : dii > 40 ? 'amber' : 'slate'
  const displacementRisk = (occY.aiExposure != null && dii != null) ? Math.round(occY.aiExposure * dii / 100) : null
  const drColor          = displacementRisk == null ? 'slate' : displacementRisk > 55 ? 'red' : displacementRisk > 28 ? 'amber' : 'green'
  const wfTotal          = totalWorkforceAtYear(region, year) ?? (region === 'world' ? 3_500_000_000 : 582_000_000)

  async function fetchOutlook() {
    setLoading(true); setOutlookError(null); setOutlook(null)
    try {
      const res = await fetch('/api/outlook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occupation: occ.name,
          sector: sector.name,
          region,
          metrics: {
            aiExposure:       occY.aiExposure,
            digitalIntensity: dii,
            displacementRisk: displacementRisk,
            growthPct:        occY.growthPct,
            workers:          occY.workers,
            salaryINR:        occY.medianSalaryINR,
            salaryUSD:        occY.medianSalaryUSD,
          },
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      setOutlook(await res.json())
    } catch (e) {
      setOutlookError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // India vs World comparison
  const worldOccId = region === 'india' ? INDIA_TO_WORLD[occ.id] : null
  let worldComp = null
  if (worldOccId && worldData) {
    for (const s of worldData.sectors) {
      const wo = s.occupations.find(o => o.id === worldOccId)
      if (wo) {
        const woy = occAtYear(wo, year, 'world')
        worldComp = { occ: wo, occY: woy, sector: s }
        break
      }
    }
  }

  // Sparkline data from timeline anchors
  const pivots = (data && onPivot) ? getPivots(occ, occY, data, year, region) : []

  const tl     = getTimelineData(region)
  const tlOcc  = tl?.occupations?.[occ.id]
  const salKey = region === 'world' ? 'medianSalaryUSD' : 'medianSalaryINR'

  // Build (year, value) pairs so nowIdx stays correct after filtering
  const workerPairs = tlOcc ? TIMELINE_YEARS.map(yr => [yr, tlOcc[yr]?.workers]).filter(([,v]) => v > 0)    : []
  const salaryPairs = tlOcc ? TIMELINE_YEARS.map(yr => [yr, tlOcc[yr]?.[salKey]]).filter(([,v]) => v > 0)   : []
  const aiPairs     = tlOcc ? TIMELINE_YEARS.map(yr => [yr, tlOcc[yr]?.aiExposure]).filter(([,v]) => v != null) : []

  const workerVals = workerPairs.map(([,v]) => v)
  const salaryVals = salaryPairs.map(([,v]) => v)
  const aiVals     = aiPairs.map(([,v]) => v)

  const workerNowIdx = workerPairs.findIndex(([yr]) => yr === 2025)
  const salaryNowIdx = salaryPairs.findIndex(([yr]) => yr === 2025)
  const aiNowIdx     = aiPairs.findIndex(([yr]) => yr === 2025)

  // Sparse year labels: show only start, 2025, and end
  function spkLabels(pairs) {
    if (!pairs.length) return []
    return pairs.map(([yr], i) =>
      i === 0 || yr === 2025 || i === pairs.length - 1 ? String(yr) : ''
    )
  }

  // Accent stripe — coloured top border signals risk level at a glance
  const riskStripe =
    drColor === 'red'   ? 'linear-gradient(90deg, #be123c 0%, #f43f5e 45%, transparent 100%)' :
    drColor === 'amber' ? 'linear-gradient(90deg, #b45309 0%, #f59e0b 45%, transparent 100%)' :
    drColor === 'green' ? 'linear-gradient(90deg, #065f46 0%, #10b981 45%, transparent 100%)' :
                          'linear-gradient(90deg, #334155 0%, transparent 100%)'

  return (
    <div className="h-full flex flex-col bg-[#0f172a] overflow-y-auto detail-panel-scroll">

      {/* Risk accent stripe */}
      <div className="h-[3px] shrink-0 risk-stripe" style={{ background: riskStripe }} />

      {/* Header */}
      <div className="p-4 border-b border-slate-800 shrink-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 rounded-sm mt-1 shrink-0" style={{ background: sector.color }} />
            <div>
              <h2 className="text-white font-bold text-sm leading-tight">{occ.name}</h2>
              <p className="text-slate-400 text-[11px]">{sector.name}{sector.capital ? ` · ${sector.capital}` : ''}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close (Esc)"
            className="text-slate-500 hover:text-white hover:bg-slate-800 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors text-lg leading-none"
          >&times;</button>
        </div>
        <p className="text-slate-300 text-[12px] leading-relaxed mt-2">{occY.description}</p>
      </div>

      {/* AI Displacement Risk — shown first so it's never missed */}
      {displacementRisk != null && (
        <div className="px-4 pt-4 pb-0 shrink-0">
          <div className={`rounded-xl p-3 border transition-colors ${
            drColor === 'red'   ? 'bg-rose-950/50 border-rose-900/50'   :
            drColor === 'amber' ? 'bg-amber-950/50 border-amber-900/50' :
                                  'bg-emerald-950/40 border-emerald-900/40'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">AI Displacement Risk</p>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                drColor === 'red'   ? 'bg-rose-900/70 text-rose-300'     :
                drColor === 'amber' ? 'bg-amber-900/70 text-amber-300'   :
                                      'bg-emerald-900/70 text-emerald-300'
              }`}>
                {displacementRisk > 55 ? 'HIGH' : displacementRisk > 28 ? 'MODERATE' : 'LOW'}
              </span>
            </div>
            <div className="flex items-end gap-3">
              <p className={`text-3xl font-black leading-none ${
                drColor === 'red' ? 'text-rose-300' : drColor === 'amber' ? 'text-amber-300' : 'text-emerald-300'
              }`}>
                {displacementRisk}<span className="text-slate-600 text-sm font-normal"> / 100</span>
              </p>
              <div className="flex-1 mb-1.5">
                <div className="h-2 rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      drColor === 'red' ? 'bg-gradient-to-r from-rose-700 to-rose-400' :
                      drColor === 'amber' ? 'bg-gradient-to-r from-amber-700 to-amber-400' :
                                           'bg-gradient-to-r from-emerald-700 to-emerald-400'
                    }`}
                    style={{ width: `${displacementRisk}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              AI Exposure ({occY.aiExposure}) × Digital Intensity ({dii}) ÷ 100
            </p>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="p-4 border-b border-slate-800">
        {/* Primary row: Workers + Growth + Salary */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="col-span-1 rounded-xl p-2.5 bg-sky-900/40 border border-sky-800/40">
            <p className="text-[8px] uppercase tracking-widest text-sky-400/70 font-bold mb-0.5">Workers</p>
            <p className="text-sm font-black text-sky-200">{fmt(occY.workers)}</p>
          </div>
          <div className={`rounded-xl p-2.5 border ${
            growthColor === 'green' ? 'bg-emerald-900/40 border-emerald-800/40' :
            growthColor === 'amber' ? 'bg-amber-900/40 border-amber-800/40' :
                                      'bg-rose-900/40 border-rose-800/40'
          }`}>
            <p className="text-[8px] uppercase tracking-widest opacity-60 font-bold mb-0.5 text-current">Growth</p>
            <p className={`text-sm font-black ${growthColor === 'green' ? 'text-emerald-200' : growthColor === 'amber' ? 'text-amber-200' : 'text-rose-200'}`}>
              {occY.growthPct > 0 ? `+${occY.growthPct}%` : `${occY.growthPct}%`}
            </p>
          </div>
          <div className="rounded-xl p-2.5 bg-violet-900/40 border border-violet-800/40">
            <p className="text-[8px] uppercase tracking-widest text-violet-400/70 font-bold mb-0.5">{currency === 'usd' ? '$/mo' : '₹/mo'}</p>
            <p className="text-sm font-black text-violet-200">{fmtSal(occY, currency)}</p>
          </div>
        </div>

        {/* Secondary grid: AI, DII, Education + optionals */}
        <div className="grid grid-cols-2 gap-2">
          <Badge label="AI Exposure"  value={`${occY.aiExposure} / 100`} color={aiColor} />
          {dii != null
            ? <Badge label="Digital Intensity" value={`${dii} / 100`} color={digitalColor} />
            : <Badge label="Education"         value={`${occY.educationYears} yrs`} color="slate" />
          }
          {dii != null && <Badge label="Education" value={`${occY.educationYears} yrs`} color="slate" />}
          <Badge label="% of Workforce" value={`${((occY.workers / wfTotal) * 100).toFixed(2)}%`} color="slate" />
          {occY.informalityPct != null && (
            <Badge label="Informal Work" value={`${occY.informalityPct}%`}
              color={occY.informalityPct > 70 ? 'red' : occY.informalityPct > 40 ? 'amber' : 'green'} />
          )}
          {occY.femalePct != null && (
            <Badge label="Female Workers" value={`${occY.femalePct}%`} color="violet" />
          )}
          {occY.wageDecile != null && (
            <Badge label="Wage Decile" value={`D${occY.wageDecile} / 10`}
              color={occY.wageDecile >= 8 ? 'green' : occY.wageDecile <= 3 ? 'red' : 'amber'} />
          )}
          {occY.iscoCode && (
            <Badge label="ISCO-08" value={occY.iscoCode} color="slate" />
          )}
        </div>
      </div>

      {/* Sparklines — 1950 → 2050 trends */}
      {tlOcc && (workerVals.length >= 2 || salaryVals.length >= 2) && (
        <div className="p-4 border-b border-slate-800">
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-3">
            Trends ({workerPairs[0]?.[0] ?? 1950} → {workerPairs.at(-1)?.[0] ?? 2050})
          </p>
          <div className="space-y-4">
            {workerVals.length >= 2 && (
              <div>
                <p className="text-slate-500 text-[9px] mb-1.5">Workforce size <span className="text-slate-600">● = 2025</span></p>
                <Sparkline values={workerVals} color="#38bdf8"
                  nowIdx={workerNowIdx >= 0 ? workerNowIdx : undefined}
                  width={230} height={34} yearLabels={spkLabels(workerPairs)} />
              </div>
            )}
            {salaryVals.length >= 2 && (
              <div>
                <p className="text-slate-500 text-[9px] mb-1.5">Salary trend <span className="text-slate-600">● = 2025</span></p>
                <Sparkline values={salaryVals} color="#a78bfa"
                  nowIdx={salaryNowIdx >= 0 ? salaryNowIdx : undefined}
                  width={230} height={34} yearLabels={spkLabels(salaryPairs)} />
              </div>
            )}
            {aiVals.length >= 2 && (
              <div>
                <p className="text-slate-500 text-[9px] mb-1.5">AI exposure trajectory <span className="text-slate-600">● = 2025</span></p>
                <Sparkline values={aiVals} color="#f87171"
                  nowIdx={aiNowIdx >= 0 ? aiNowIdx : undefined}
                  width={230} height={28} yearLabels={spkLabels(aiPairs)} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Skills */}
      {occY.topSkills?.length > 0 && (
        <div className="p-4 border-b border-slate-800">
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-2">Top Skills Required</p>
          <div className="flex flex-wrap gap-1.5">
            {occY.topSkills.map((sk, i) => (
              <span key={i} className="bg-slate-800 text-slate-300 text-[10px] font-semibold px-2 py-1 rounded-lg border border-slate-700">{sk}</span>
            ))}
          </div>
        </div>
      )}

      {/* Career pivot suggestions — shown when AI risk is high */}
      {pivots.length > 0 && (
        <div className="p-4 border-b border-slate-800">
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">🔄 Lower-Risk Career Pivots</p>
          <p className="text-slate-600 text-[9px] mb-3">Similar education · AI exposure below 42 · Closest salary match</p>
          <div className="space-y-1.5">
            {pivots.map(p => {
              const aiC = p.oy.aiExposure > 35 ? 'text-amber-400' : 'text-emerald-400'
              return (
                <button
                  key={p.occ.id}
                  onClick={() => onPivot({ sector: p.sector, occupation: p.occ })}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 transition-colors text-left group"
                >
                  <div className="w-2 h-2 rounded-sm shrink-0 mt-0.5" style={{ background: p.sector.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-[11px] font-semibold truncate group-hover:text-white">{p.occ.name}</p>
                    <p className="text-slate-500 text-[9px]">{p.sector.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-[10px] font-bold ${aiC}`}>AI {p.oy.aiExposure}/100</p>
                    <p className="text-slate-500 text-[9px]">{p.oy.educationYears} yrs edu</p>
                  </div>
                  <span className="text-slate-600 group-hover:text-slate-300 text-[12px]">→</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* AI interpretation */}
      <div className="p-4 border-b border-slate-800">
        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-2">AI Exposure Interpretation</p>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${occY.aiExposure}%`,
                background: occY.aiExposure > 60 ? '#ef4444' : occY.aiExposure > 35 ? '#f59e0b' : '#22c55e'
              }}
            />
          </div>
          <span className={`text-[11px] font-bold ${occY.aiExposure > 60 ? 'text-rose-400' : occY.aiExposure > 35 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {occY.aiExposure > 60 ? 'High Risk' : occY.aiExposure > 35 ? 'Moderate' : 'Low Risk'}
          </span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          {occY.aiExposure > 60
            ? 'Significant automation pressure. Roles involving routine digital tasks face disruption from LLMs and RPA tools in the near term.'
            : occY.aiExposure > 35
            ? 'Moderate exposure. AI will augment rather than replace, but upskilling in digital tools is essential over the next 5 years.'
            : 'Low automation risk. Roles require physical dexterity, human judgment, or regulatory oversight that AI cannot easily replicate.'}
        </p>
      </div>

      {/* India vs World Comparison */}
      {worldComp && (
        <div className="p-4 border-b border-slate-800">
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-3">India vs World</p>
          <p className="text-slate-600 text-[9px] mb-3">Closest global equivalent: <span className="text-slate-400 font-semibold">{worldComp.occ.name}</span></p>
          <div className="space-y-2">
            {[
              {
                label: 'AI Exposure',
                india: occY.aiExposure,
                world: worldComp.occY.aiExposure,
                fmt: v => `${v}/100`,
                barColor: v => v > 60 ? '#f87171' : v > 35 ? '#fbbf24' : '#34d399',
              },
              {
                label: 'Growth/yr',
                india: occY.growthPct,
                world: worldComp.occY.growthPct,
                fmt: v => `${v > 0 ? '+' : ''}${v}%`,
                barColor: v => v < 0 ? '#f87171' : v < 3 ? '#fbbf24' : '#34d399',
              },
              {
                label: 'Education (yrs)',
                india: occY.educationYears,
                world: worldComp.occY.educationYears,
                fmt: v => `${v} yrs`,
                barColor: () => '#818cf8',
              },
              {
                label: 'Salary (USD/mo)',
                india: occY.medianSalaryINR != null ? Math.round(occY.medianSalaryINR / EXCHANGE_RATE) : occY.medianSalaryUSD,
                world: worldComp.occY.medianSalaryUSD,
                fmt: v => v >= 1000 ? `$${(v/1000).toFixed(1)}K` : `$${v}`,
                barColor: () => '#a78bfa',
              },
            ].filter(r => r.india != null && r.world != null).map(row => {
              const maxVal = Math.max(Math.abs(row.india), Math.abs(row.world), 1)
              const iPct = Math.min(Math.abs(row.india) / maxVal * 100, 100)
              const wPct = Math.min(Math.abs(row.world) / maxVal * 100, 100)
              return (
                <div key={row.label}>
                  <div className="flex justify-between text-[9px] text-slate-500 mb-0.5">
                    <span>{row.label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex justify-between text-[9px] mb-0.5">
                        <span className="text-orange-400 font-bold">IN</span>
                        <span className="text-slate-300 tabular-nums">{row.fmt(row.india)}</span>
                      </div>
                      <div className="h-1 rounded-full bg-slate-800">
                        <div className="h-full rounded-full" style={{ width: `${iPct}%`, background: row.barColor(row.india) }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[9px] mb-0.5">
                        <span className="text-blue-400 font-bold">WLD</span>
                        <span className="text-slate-300 tabular-nums">{row.fmt(row.world)}</span>
                      </div>
                      <div className="h-1 rounded-full bg-slate-800">
                        <div className="h-full rounded-full" style={{ width: `${wPct}%`, background: row.barColor(row.world) }} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 2035 AI Outlook */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">2035 AI Outlook</p>
          {!outlook && !outlookLoading && (
            <button
              onClick={fetchOutlook}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-violet-800/60 text-violet-300 hover:bg-violet-700/60 transition-colors border border-violet-700/40"
            >
              ✦ Generate
            </button>
          )}
          {outlook && (
            <button
              onClick={fetchOutlook}
              className="text-[9px] text-slate-600 hover:text-slate-400 transition-colors"
            >
              ↻ Refresh
            </button>
          )}
        </div>

        {outlookLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <span className="inline-block w-3 h-3 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            Asking Claude about {year}→2035…
          </div>
        )}

        {outlookError && (
          <p className="text-rose-400 text-[10px]">Error: {outlookError}</p>
        )}

        {outlook && !outlookLoading && (() => {
          const verdictStyle = {
            THRIVING:  { bg: 'bg-emerald-900/50', text: 'text-emerald-300', border: 'border-emerald-700/40' },
            STABLE:    { bg: 'bg-sky-900/50',     text: 'text-sky-300',     border: 'border-sky-700/40'     },
            AT_RISK:   { bg: 'bg-amber-900/50',   text: 'text-amber-300',   border: 'border-amber-700/40'   },
            DISRUPTED: { bg: 'bg-rose-900/50',    text: 'text-rose-300',    border: 'border-rose-700/40'    },
          }[outlook.verdict] ?? { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' }

          return (
            <div className={`rounded-xl p-3 border ${verdictStyle.bg} ${verdictStyle.border}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${verdictStyle.text} ${verdictStyle.bg} ${verdictStyle.border}`}>
                  {outlook.verdict}
                </span>
                <p className={`text-[11px] font-bold leading-tight ${verdictStyle.text}`}>{outlook.headline}</p>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed mb-2">{outlook.detail}</p>
              <div className="pt-2 border-t border-slate-700/50">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1">Action for workers today</p>
                <p className="text-slate-400 text-[10px] leading-relaxed italic">"{outlook.workerAdvice}"</p>
              </div>
            </div>
          )
        })()}

        {!outlook && !outlookLoading && !outlookError && (
          <p className="text-slate-600 text-[10px]">Click Generate to get a Claude-powered forecast for this occupation's 2035 outlook.</p>
        )}
      </div>

      {/* Sources */}
      <div className="p-4">
        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-2">Data Sources</p>
        <div className="space-y-1.5">
          {(occY.sources || []).map((s, i) => (
            <p key={i} className="text-slate-400 text-[10px] leading-relaxed flex gap-1.5">
              <span className="text-slate-600 shrink-0">·</span>
              {s}
            </p>
          ))}
        </div>
      </div>

      {/* Sector source */}
      <div className="px-4 pb-4">
        <p className="text-slate-600 text-[10px]">
          {sector.plfsCode || sector.iloCode ? `Sector: ${sector.plfsCode || sector.iloCode} · ` : ''}
          {sector.sources?.slice(0,1).join('')}
        </p>
      </div>
    </div>
  )
}
