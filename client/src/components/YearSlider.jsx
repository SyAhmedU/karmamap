import { useState, useEffect } from 'react'

const YEARS = [2000, 2010, 2020, 2025, 2035, 2050]
const PIVOT  = 2025
const MINOR_TICKS = [2030, 2040, 2045]

const CONTEXT = {
  2000: 'Pre-IT boom',
  2010: 'Smartphone era',
  2020: 'COVID / Gig rise',
  2025: 'AI disruption',
  2035: 'Automation wave',
  2050: 'Post-AGI world',
}

export { YEARS }

function yearToPct(y) {
  for (let i = 0; i < YEARS.length - 1; i++) {
    if (y >= YEARS[i] && y <= YEARS[i + 1]) {
      const t = (y - YEARS[i]) / (YEARS[i + 1] - YEARS[i])
      return ((i + t) / (YEARS.length - 1)) * 100
    }
  }
  return y >= YEARS[YEARS.length - 1] ? 100 : 0
}

export default function YearSlider({ year, onYear }) {
  const [playing, setPlaying] = useState(false)

  const idx      = YEARS.indexOf(year)
  const pivotI   = YEARS.indexOf(PIVOT)
  const pivotPct = yearToPct(PIVOT)

  // Auto-advance: each time year changes while playing, schedule next step
  useEffect(() => {
    if (!playing) return
    const cur = YEARS.indexOf(year)
    if (cur < 0 || cur >= YEARS.length - 1) {
      setPlaying(false)
      return
    }
    const id = setTimeout(() => onYear(YEARS[cur + 1]), 750)
    return () => clearTimeout(id)
  }, [playing, year, onYear])

  function togglePlay() {
    if (playing) { setPlaying(false); return }
    // Restart from beginning if already at end
    if (year === YEARS[YEARS.length - 1]) onYear(YEARS[0])
    setPlaying(true)
  }

  return (
    <div className="shrink-0 bg-slate-900/95 border-t border-slate-800 px-4 py-2 flex items-center gap-4 z-20">

      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        title={playing ? 'Pause' : 'Play timeline (2000 → 2050)'}
        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
          playing ? 'bg-amber-500 text-white shadow-lg shadow-amber-900/40' : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
        }`}
      >
        {playing ? (
          <svg viewBox="0 0 16 16" width="9" height="9">
            <rect x="3" y="2" width="4" height="12" rx="1" fill="currentColor"/>
            <rect x="9" y="2" width="4" height="12" rx="1" fill="currentColor"/>
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" width="9" height="9">
            <path d="M4 2l9 6-9 6z" fill="currentColor"/>
          </svg>
        )}
      </button>

      {/* Year + state label */}
      <div className="shrink-0 text-center" style={{ minWidth: 64 }}>
        <p className={`font-black text-xl leading-none tabular-nums transition-colors ${
          playing ? (year <= PIVOT ? 'text-sky-300' : 'text-amber-300') : 'text-white'
        }`}>{year}</p>
        <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${year <= PIVOT ? 'text-sky-400' : 'text-amber-400'}`}>
          {year <= PIVOT ? 'Historical' : 'Projected'}
        </p>
      </div>

      {/* Track */}
      <div className="flex-1 relative flex items-center" style={{ height: 36 }}>
        {/* Solid historical track */}
        <div className="absolute top-1/2 -translate-y-1/2 h-px bg-slate-700"
          style={{ left: 0, width: `${pivotPct}%` }} />
        {/* Dashed future track */}
        <div className="absolute top-1/2 -translate-y-1/2"
          style={{ left: `${pivotPct}%`, right: 0, height: 0, borderTop: '1.5px dashed #475569' }} />

        {/* Historical fill */}
        <div className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-sky-600 rounded-full transition-all duration-300"
          style={{ left: 0, width: `${(Math.min(idx, pivotI) / (YEARS.length - 1)) * 100}%` }} />
        {/* Projected fill */}
        {idx > pivotI && (
          <div className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-amber-500 transition-all duration-300"
            style={{ left: `${pivotPct}%`, width: `${((idx - pivotI) / (YEARS.length - 1)) * 100}%` }} />
        )}

        {/* Minor ticks at 2030 / 2040 / 2045 */}
        {MINOR_TICKS.map(ty => (
          <div key={ty} className="absolute bg-slate-600 rounded-full pointer-events-none"
            style={{ left: `${yearToPct(ty)}%`, top: '50%', width: 1.5, height: 7, transform: 'translate(-50%,-50%)' }} />
        ))}

        {/* Major year buttons */}
        {YEARS.map((yr, i) => {
          const pct    = (i / (YEARS.length - 1)) * 100
          const active = yr === year
          const past   = yr < year
          return (
            <button
              key={yr}
              onClick={() => onYear(yr)}
              className="absolute -translate-x-1/2 flex flex-col items-center gap-0.5 group"
              style={{ left: `${pct}%`, top: 0, bottom: 0, justifyContent: 'center' }}
            >
              <div className={`
                w-3 h-3 rounded-full border-2 transition-all duration-200
                ${active
                  ? (yr <= PIVOT ? 'bg-sky-400 border-sky-300 scale-125' : 'bg-amber-400 border-amber-300 scale-125')
                  : past
                    ? 'bg-sky-600 border-sky-500'
                    : 'bg-slate-700 border-slate-600 group-hover:border-slate-400'}
              `} />
              <span className={`
                text-[10px] font-bold tabular-nums select-none
                ${active
                  ? (yr <= PIVOT ? 'text-sky-300' : 'text-amber-300')
                  : yr === PIVOT ? 'text-slate-300' : 'text-slate-500 group-hover:text-slate-300'}
              `}>{yr}</span>
              {yr === PIVOT && <span className="text-[8px] text-slate-500 font-semibold leading-none">NOW</span>}
            </button>
          )
        })}
      </div>

      {/* Context pill + reset */}
      <div className="shrink-0 text-right" style={{ minWidth: 96 }}>
        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap
          ${year <= PIVOT ? 'bg-sky-900/60 text-sky-300' : 'bg-amber-900/60 text-amber-300'}`}>
          {CONTEXT[year] ?? ''}
        </span>
        {year !== PIVOT && (
          <div className="mt-1">
            <button
              onClick={() => { setPlaying(false); onYear(PIVOT) }}
              className="text-slate-500 hover:text-sky-400 text-[9px] font-semibold transition-colors"
            >↶ Reset to 2025</button>
          </div>
        )}
      </div>

    </div>
  )
}
