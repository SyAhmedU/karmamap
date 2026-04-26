import { EXCHANGE_RATE } from '../App.jsx'
import { occAtYear } from '../utils/timeline.js'

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

export default function DetailPanel({ sector, occupation: occ, currency, region, year = 2025, onClose }) {
  if (!occ) return null

  // Merge year-adjusted metrics over the base occupation (keeps description/sources)
  const occY        = { ...occ, ...occAtYear(occ, year, region) }
  const growthColor = occY.growthPct < 0 ? 'red' : occY.growthPct < 5 ? 'amber' : 'green'
  const aiColor     = occY.aiExposure > 60 ? 'red' : occY.aiExposure > 35 ? 'amber' : 'green'

  return (
    <div className="h-full flex flex-col bg-[#0f172a] overflow-y-auto">
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
          <button onClick={onClose} className="text-slate-500 hover:text-white p-1 shrink-0 text-lg leading-none">&times;</button>
        </div>
        <p className="text-slate-300 text-[12px] leading-relaxed mt-2">{occY.description}</p>
      </div>

      {/* Stats grid */}
      <div className="p-4 grid grid-cols-2 gap-2 border-b border-slate-800">
        <Badge label="Workforce" value={fmt(occY.workers)} color="blue" />
        <Badge label="Growth/yr" value={occY.growthPct > 0 ? `+${occY.growthPct}%` : `${occY.growthPct}%`} color={growthColor} />
        <Badge label={currency === 'usd' ? 'Salary $/mo' : 'Salary ₹/mo'} value={fmtSal(occY, currency)} color="violet" />
        <Badge label="AI Exposure" value={`${occY.aiExposure} / 100`} color={aiColor} />
        <Badge label="Education" value={`${occY.educationYears} years`} color="slate" />
        <Badge label="% Workforce" value={`${((occY.workers/(region === 'world' ? 3320000000 : 582000000))*100).toFixed(2)}%`} color="slate" />
      </div>

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

      {/* Sources */}
      <div className="p-4">
        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-2">Data Sources</p>
        <div className="space-y-1.5">
          {occY.sources.map((s, i) => (
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
          Sector classification: {sector.plfsCode} · Sources: {sector.sources.slice(0,1).join('')}
        </p>
      </div>
    </div>
  )
}
