import { useState } from 'react'
import { EXCHANGE_RATE } from '../App.jsx'

function fmtSal(v, currency) {
  if (currency === 'usd') {
    const d = v / EXCHANGE_RATE
    return `$${d >= 1000 ? (d/1000).toFixed(1)+'K' : Math.round(d)}/mo`
  }
  return `₹${v >= 100000 ? (v/1000).toFixed(0)+'K' : v.toLocaleString('en-IN')}/mo`
}

export default function LLMScorer({ currency, onClose }) {
  const [jobTitle, setJobTitle] = useState('')
  const [context, setContext]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState(null)
  const [error, setError]       = useState('')

  async function score(e) {
    e.preventDefault()
    if (!jobTitle.trim()) return
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle: jobTitle.trim(), context: context.trim() })
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setResult(json)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const aiColor = result
    ? result.aiExposure > 60 ? 'text-rose-400' : result.aiExposure > 35 ? 'text-amber-400' : 'text-emerald-400'
    : ''

  return (
    <div className="h-full flex flex-col bg-[#0f172a] overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-sm">✦ Score a Job</h2>
          <p className="text-slate-400 text-[11px]">Claude AI analysis for India market</p>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white text-lg leading-none">&times;</button>
      </div>

      {/* Form */}
      <form onSubmit={score} className="p-4 space-y-3 border-b border-slate-800">
        <div>
          <label className="text-slate-400 text-[11px] font-semibold block mb-1">Job Title *</label>
          <input
            value={jobTitle}
            onChange={e => setJobTitle(e.target.value)}
            placeholder="e.g. Drone Surveyor, EV Battery Engineer..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-[13px] placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <label className="text-slate-400 text-[11px] font-semibold block mb-1">Context <span className="text-slate-600">(optional)</span></label>
          <input
            value={context}
            onChange={e => setContext(e.target.value)}
            placeholder="e.g. tier-2 city, entry-level, fintech startup..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-[13px] placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !jobTitle.trim()}
          className="w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-bold text-[13px] transition-all flex items-center justify-center gap-2"
        >
          {loading ? <><Spinner /> Analysing…</> : '✦ Score with Claude'}
        </button>
        {error && <p className="text-rose-400 text-[11px]">{error}</p>}
      </form>

      {/* Result */}
      {result && (
        <div className="p-4 space-y-4">
          <p className="text-slate-300 text-[11px] font-bold uppercase tracking-widest">Results for "{jobTitle}"</p>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-800 rounded-xl p-2.5">
              <p className="text-slate-500 text-[9px] uppercase tracking-widest font-bold">Growth / yr</p>
              <p className={`text-base font-black ${result.growthPct > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {result.growthPct > 0 ? '+' : ''}{result.growthPct}%
              </p>
            </div>
            <div className="bg-slate-800 rounded-xl p-2.5">
              <p className="text-slate-500 text-[9px] uppercase tracking-widest font-bold">Salary {currency === 'usd' ? '$/mo' : '₹/mo'}</p>
              <p className="text-base font-black text-sky-300">{fmtSal(result.medianSalaryINR, currency)}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-2.5">
              <p className="text-slate-500 text-[9px] uppercase tracking-widest font-bold">Education</p>
              <p className="text-base font-black text-violet-300">{result.educationYears} yrs</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-2.5">
              <p className="text-slate-500 text-[9px] uppercase tracking-widest font-bold">AI Exposure</p>
              <p className={`text-base font-black ${aiColor}`}>{result.aiExposure} / 100</p>
            </div>
          </div>

          {/* AI bar */}
          <div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-1">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${result.aiExposure}%`,
                  background: result.aiExposure > 60 ? '#ef4444' : result.aiExposure > 35 ? '#f59e0b' : '#22c55e'
                }}
              />
            </div>
            <p className={`text-[11px] font-semibold ${aiColor}`}>
              AI Risk: {result.aiExposure > 60 ? 'High' : result.aiExposure > 35 ? 'Moderate' : 'Low'}
            </p>
          </div>

          {result.outlook && (
            <div className="bg-slate-800/60 rounded-xl p-3">
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Outlook</p>
              <p className="text-slate-200 text-[12px] leading-relaxed">{result.outlook}</p>
            </div>
          )}

          {result.rationale && (
            <div className="bg-slate-800/40 rounded-xl p-3">
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Rationale</p>
              <p className="text-slate-400 text-[11px] leading-relaxed">{result.rationale}</p>
            </div>
          )}

          <p className="text-slate-600 text-[9px]">
            Scored by Claude Opus 4. For reference only. Verify with official PLFS and NASSCOM reports.
          </p>
        </div>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
  )
}
