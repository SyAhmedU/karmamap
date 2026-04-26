import { EXCHANGE_RATE } from '../App.jsx'

const GROWTH_STOPS = [
  { pct: -5,  label: '−5%',  color: '#991b1b' },
  { pct: 0,   label: '0%',   color: '#92400e' },
  { pct: 5,   label: '+5%',  color: '#15803d' },
  { pct: 15,  label: '+15%', color: '#4ade80' },
  { pct: 48,  label: '+48%', color: '#86efac' },
]

const AI_STOPS = [
  { v: 0,   label: '0',   color: '#14532d' },
  { v: 25,  label: '25',  color: '#16a34a' },
  { v: 50,  label: '50',  color: '#f59e0b' },
  { v: 75,  label: '75',  color: '#dc2626' },
  { v: 100, label: '100', color: '#ef4444' },
]

function salaryStops(currency) {
  const s = currency === 'usd'
    ? [{ v:5000,label:'₹5K' },{ v:20000,label:'₹20K' },{ v:65000,label:'₹65K' },{ v:135000,label:'₹135K'}]
    : [{ v:5000,label:'₹5K' },{ v:20000,label:'₹20K' },{ v:65000,label:'₹65K' },{ v:135000,label:'₹135K'}]
  const usd = [
    { v:5000/$1, label:'$60'   },
    { v:20000,   label:'$237'  },
    { v:65000,   label:'$769'  },
    { v:135000,  label:'$1.6K' },
  ]
  const stops = currency === 'usd'
    ? [{ v:0, label:'$60' }, { v:0.33, label:'$400' }, { v:0.66, label:'$900' }, { v:1, label:'$1.6K' }]
    : [{ v:0, label:'₹5K' }, { v:0.33, label:'₹45K' }, { v:0.66, label:'₹90K' }, { v:1, label:'₹135K' }]
  return stops
}

const EDU_STOPS = [
  { v: 0,   label: '4yr',  color: '#2d1657' },
  { v: 0.3, label: '8yr',  color: '#4c1d95' },
  { v: 0.6, label: '13yr', color: '#7c3aed' },
  { v: 1,   label: '18yr', color: '#a78bfa' },
]

function GradBar({ stops }) {
  const colors = stops.map(s => s.color).join(', ')
  return (
    <div className="flex items-center gap-2">
      <div className="h-2.5 w-32 rounded-full" style={{ background: `linear-gradient(to right, ${colors})` }} />
      <div className="flex gap-2">
        {[stops[0], stops[stops.length-1]].map((s, i) => (
          <span key={i} className="text-slate-400 text-[10px] font-semibold">{s.label}</span>
        ))}
      </div>
    </div>
  )
}

export default function Legend({ layer, currency, data }) {
  const totalM = (data.meta.totalWorkforce / 1e6).toFixed(0)
  const rate = `₹${EXCHANGE_RATE} = $1`

  return (
    <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-xl p-3 z-30 pointer-events-none">
      <p className="text-slate-500 text-[9px] uppercase tracking-widest font-bold mb-2">
        {layer === 'growth'    && 'Employment Growth (5-yr CAGR)'}
        {layer === 'salary'    && `Median Monthly Salary (${currency === 'usd' ? 'USD' : 'INR'})`}
        {layer === 'education' && 'Education Required (years)'}
        {layer === 'ai'        && 'AI Automation Exposure Score'}
      </p>

      {layer === 'growth' && <GradBar stops={GROWTH_STOPS} />}
      {layer === 'salary' && (
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-32 rounded-full" style={{ background: 'linear-gradient(to right, #1e3a5f, #38bdf8)' }} />
          <div className="flex gap-2">
            <span className="text-slate-400 text-[10px] font-semibold">
              {currency === 'usd' ? '$60' : '₹5K'}
            </span>
            <span className="text-slate-400 text-[10px] font-semibold">
              {currency === 'usd' ? '$1.6K' : '₹135K'}
            </span>
          </div>
        </div>
      )}
      {layer === 'education' && <GradBar stops={EDU_STOPS} />}
      {layer === 'ai' && <GradBar stops={AI_STOPS} />}

      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-800">
        <span className="text-slate-500 text-[9px]">Area ∝ workforce size</span>
        {layer === 'salary' && <span className="text-slate-500 text-[9px]">{rate} (RBI, Apr 2026)</span>}
      </div>
    </div>
  )
}
