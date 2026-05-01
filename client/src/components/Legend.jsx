import { EXCHANGE_RATE } from '../App.jsx'

const CONFIGS = {
  growth: {
    title: 'Employment Growth (5-yr CAGR)',
    gradient: 'linear-gradient(to right, #991b1b, #92400e, #15803d, #86efac)',
    min: '−5% declining', max: '+48% booming',
  },
  education: {
    title: 'Education Required (years)',
    gradient: 'linear-gradient(to right, #2d1657, #7c3aed, #a78bfa)',
    min: '4 yrs', max: '21 yrs',
  },
  ai: {
    title: 'AI Automation Exposure',
    gradient: 'linear-gradient(to right, #14532d, #f59e0b, #ef4444)',
    min: '0 — Safe', max: '100 — High risk',
  },
  digital: {
    title: 'Digital Intensity Index',
    gradient: 'linear-gradient(to right, #44403c, #0e7490, #06b6d4)',
    min: '0 — Fully physical', max: '100 — Fully digital',
  },
  informality: {
    title: 'Informal Employment (%)',
    gradient: 'linear-gradient(to right, #0f4c75, #9b1c1c)',
    min: '0% formal', max: '99% informal',
  },
  gender: {
    title: 'Female Workers (%)',
    gradient: 'linear-gradient(to right, #1e3a8a, #7e22ce, #9d174d)',
    min: '0% ♀', max: '100% ♀',
  },
}

export default function Legend({ layer, currency, region }) {
  const isWorld = region === 'world'

  let title, gradient, min, max
  if (layer === 'salary') {
    title    = `Median Salary (${currency === 'usd' ? 'USD' : 'INR'}/mo)`
    gradient = 'linear-gradient(to right, #1e3a5f, #38bdf8)'
    min      = currency === 'usd' ? '$60' : '₹5K'
    max      = isWorld ? '$13K' : (currency === 'usd' ? '$1.6K' : '₹135K')
  } else {
    const cfg = CONFIGS[layer]
    if (!cfg) return null
    ;({ title, gradient, min, max } = cfg)
  }

  return (
    <div className="shrink-0 flex items-center gap-4 px-5 py-1.5 border-b border-slate-800 bg-[#0f172a] overflow-x-auto">
      <span className="text-slate-500 text-[9px] uppercase tracking-widest font-bold whitespace-nowrap shrink-0">
        {title}
      </span>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-slate-500 text-[10px] font-semibold whitespace-nowrap">{min}</span>
        <div className="h-2 w-40 rounded-full shrink-0" style={{ background: gradient }} />
        <span className="text-slate-500 text-[10px] font-semibold whitespace-nowrap">{max}</span>
      </div>
      <span className="text-slate-600 text-[9px] ml-auto whitespace-nowrap shrink-0">Area ∝ workforce size</span>
      {layer === 'salary' && !isWorld && (
        <span className="text-slate-600 text-[9px] whitespace-nowrap shrink-0">₹{EXCHANGE_RATE} = $1 (RBI Apr 2026)</span>
      )}
    </div>
  )
}
