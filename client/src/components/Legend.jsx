import { EXCHANGE_RATE } from '../App.jsx'

const GROWTH_STOPS = [
  { label: '−5%', color: '#991b1b' },
  { label: '0%',  color: '#92400e' },
  { label: '+5%', color: '#15803d' },
  { label: '+48%',color: '#86efac' },
]

const AI_STOPS = [
  { label: '0 — Safe',    color: '#14532d' },
  { label: '50',          color: '#f59e0b' },
  { label: '100 — At Risk',color: '#ef4444' },
]

const EDU_STOPS = [
  { label: '4 yrs',  color: '#2d1657' },
  { label: '12 yrs', color: '#7c3aed' },
  { label: '21 yrs', color: '#a78bfa' },
]

function GradBar({ stops, minLabel, maxLabel, gradient }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-28 rounded-full shrink-0" style={{ background: gradient }} />
      <div className="flex gap-2">
        <span className="text-slate-400 text-[10px] font-semibold">{minLabel}</span>
        <span className="text-slate-400 text-[10px]">→</span>
        <span className="text-slate-400 text-[10px] font-semibold">{maxLabel}</span>
      </div>
    </div>
  )
}

export default function Legend({ layer, currency, region }) {
  const isWorld = region === 'world'
  const salaryMin = currency === 'usd' ? '$60' : '₹5K'
  const salaryMax = isWorld ? '$13K' : (currency === 'usd' ? '$1.6K' : '₹135K')

  const TITLE = {
    growth:      'Employment Growth (5-yr CAGR)',
    salary:      `Median Monthly Salary (${currency === 'usd' ? 'USD' : 'INR'})`,
    education:   'Education Required (years)',
    ai:          'AI Automation Exposure',
    informality: 'Informal Employment (%)',
    gender:      'Female Workers (%)',
  }

  return (
    <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-xl p-3 z-30 pointer-events-none">
      <p className="text-slate-500 text-[9px] uppercase tracking-widest font-bold mb-2">
        {TITLE[layer] || layer}
      </p>

      {layer === 'growth' && (
        <GradBar gradient="linear-gradient(to right, #991b1b, #92400e, #15803d, #86efac)"
          minLabel="−5% (declining)" maxLabel="+48% (booming)" />
      )}
      {layer === 'salary' && (
        <GradBar gradient="linear-gradient(to right, #1e3a5f, #38bdf8)"
          minLabel={salaryMin} maxLabel={salaryMax} />
      )}
      {layer === 'education' && (
        <GradBar gradient="linear-gradient(to right, #2d1657, #7c3aed, #a78bfa)"
          minLabel="4 yrs" maxLabel="21 yrs" />
      )}
      {layer === 'ai' && (
        <GradBar gradient="linear-gradient(to right, #14532d, #f59e0b, #ef4444)"
          minLabel="0 — Safe" maxLabel="100 — High risk" />
      )}
      {layer === 'informality' && (
        <GradBar gradient="linear-gradient(to right, #0f4c75, #9b1c1c)"
          minLabel="0% — Fully formal" maxLabel="99% — Fully informal" />
      )}
      {layer === 'gender' && (
        <GradBar gradient="linear-gradient(to right, #1e3a8a, #7e22ce, #9d174d)"
          minLabel="0% — Male dominated" maxLabel="100% — Female dominated" />
      )}

      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-800">
        <span className="text-slate-500 text-[9px]">Area ∝ workforce size</span>
        {layer === 'salary' && !isWorld && (
          <span className="text-slate-500 text-[9px]">₹{EXCHANGE_RATE} = $1 (RBI Apr 2026)</span>
        )}
      </div>
    </div>
  )
}
