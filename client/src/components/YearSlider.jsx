import { useState, useEffect } from 'react'

const YEARS = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2025, 2030, 2035, 2040, 2050]
const PIVOT = 2025   // "NOW"

// Only show year labels for these to avoid crowding
const LABELED_YEARS = new Set([1950, 1970, 1990, 2000, 2010, 2020, 2025, 2035, 2050])

const CONTEXT = {
  1950: 'Post-Independence',
  1960: 'Green Revolution',
  1970: 'Industrial Push',
  1980: 'Pre-Liberalisation',
  1990: 'LPG Reforms',
  2000: 'IT Boom',
  2010: 'Smartphone Era',
  2020: 'COVID / Gig Rise',
  2025: 'AI Disruption',
  2030: 'Automation Onset',
  2035: 'Automation Wave',
  2040: 'AI Saturation',
  2050: 'Post-AGI World',
}

export { YEARS }

function yearToPct(y) {
  const i = YEARS.indexOf(y)
  if (i >= 0) return (i / (YEARS.length - 1)) * 100
  // interpolate for arbitrary years
  for (let j = 0; j < YEARS.length - 1; j++) {
    if (y >= YEARS[j] && y <= YEARS[j + 1]) {
      const t = (y - YEARS[j]) / (YEARS[j + 1] - YEARS[j])
      return ((j + t) / (YEARS.length - 1)) * 100
    }
  }
  return y >= YEARS[YEARS.length - 1] ? 100 : 0
}

export default function YearSlider({ year, onYear }) {
  const [playing, setPlaying] = useState(false)

  const idx      = YEARS.indexOf(year)
  const pivotI   = YEARS.indexOf(PIVOT)
  const pivotPct = yearToPct(PIVOT)

  useEffect(() => {
    if (!playing) return
    const cur = YEARS.indexOf(year)
    if (cur < 0 || cur >= YEARS.length - 1) { setPlaying(false); return }
    const id = setTimeout(() => onYear(YEARS[cur + 1]), 600)
    return () => clearTimeout(id)
  }, [playing, year, onYear])

  function togglePlay() {
    if (playing) { setPlaying(false); return }
    if (year === YEARS[YEARS.length - 1]) onYear(YEARS[0])
    setPlaying(true)
  }

  const isPast = year < PIVOT
  const isNow  = year === PIVOT

  return (
    <div className="shrink-0 bg-slate-900/95 border-t border-slate-800 px-4 py-2 flex items-center gap-4 z-20">

      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        title={playing ? 'Pause' : 'Play timeline (1950 → 2050)'}
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

      {/* Year display */}
      <div className="shrink-0 text-center" style={{ minWidth: 72 }}>
        <p className={`font-black text-xl leading-none tabular-nums transition-colors ${
          playing
            ? (isPast ? 'text-violet-300' : isNow ? 'text-sky-300' : 'text-amber-300')
            : (isPast ? 'text-violet-200' : isNow ? 'text-sky-300'  : 'text-amber-200')
        }`}>{year}</p>
        <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${
          isPast ? 'text-violet-500' : isNow ? 'text-sky-400' : 'text-amber-400'
        }`}>
          {isPast ? 'Historical' : isNow ? 'Now' : 'Projected'}
        </p>
      </div>

      {/* Track */}
      <div className="flex-1 relative flex items-center" style={{ height: 38 }}>

        {/* Historical track segment (1950 → 2025) */}
        <div className="absolute top-1/2 -translate-y-1/2 h-px bg-slate-700"
          style={{ left: 0, width: `${pivotPct}%` }} />
        {/* Projected track segment (2025 → 2050) */}
        <div className="absolute top-1/2 -translate-y-1/2"
          style={{ left: `${pivotPct}%`, right: 0, height: 0, borderTop: '1.5px dashed #475569' }} />

        {/* Historical fill (before NOW) */}
        <div className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-violet-600 rounded-full transition-all duration-300"
          style={{ left: 0, width: `${(Math.min(idx, pivotI) / (YEARS.length - 1)) * 100}%` }} />
        {/* Projected fill (after NOW) */}
        {idx > pivotI && (
          <div className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-amber-500 transition-all duration-300"
            style={{ left: `${pivotPct}%`, width: `${((idx - pivotI) / (YEARS.length - 1)) * 100}%` }} />
        )}

        {/* Year dots + labels */}
        {YEARS.map((yr, i) => {
          const pct    = (i / (YEARS.length - 1)) * 100
          const active = yr === year
          const past   = yr < year
          const isHist = yr < PIVOT
          const showLabel = LABELED_YEARS.has(yr) || active

          return (
            <button
              key={yr}
              onClick={() => onYear(yr)}
              title={`${yr} — ${CONTEXT[yr] ?? ''}`}
              className="absolute -translate-x-1/2 flex flex-col items-center gap-0.5 group"
              style={{ left: `${pct}%`, top: 0, bottom: 0, justifyContent: 'center' }}
            >
              <div className={`
                rounded-full border-2 transition-all duration-200
                ${active
                  ? (isHist || yr === PIVOT
                      ? 'w-3.5 h-3.5 bg-sky-400 border-sky-200 scale-110 shadow-sm shadow-sky-900'
                      : 'w-3.5 h-3.5 bg-amber-400 border-amber-200 scale-110')
                  : past
                    ? (isHist ? 'w-2 h-2 bg-violet-600 border-violet-500' : 'w-2 h-2 bg-sky-600 border-sky-500')
                    : 'w-2 h-2 bg-slate-700 border-slate-600 group-hover:border-slate-400'}
              `} />
              {showLabel && (
                <span className={`
                  text-[9px] font-bold tabular-nums select-none leading-none
                  ${active
                    ? (isHist || yr === PIVOT ? 'text-sky-300' : 'text-amber-300')
                    : yr === PIVOT ? 'text-slate-300'
                    : isHist ? 'text-slate-500 group-hover:text-slate-300'
                    : 'text-slate-500 group-hover:text-slate-300'}
                `}>{yr}</span>
              )}
              {yr === PIVOT && (
                <span className="text-[7px] text-sky-500 font-bold leading-none">NOW</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Context pill + reset */}
      <div className="shrink-0 text-right" style={{ minWidth: 104 }}>
        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap
          ${isPast ? 'bg-violet-900/60 text-violet-300' : isNow ? 'bg-sky-900/60 text-sky-300' : 'bg-amber-900/60 text-amber-300'}`}>
          {CONTEXT[year] ?? ''}
        </span>
        {year !== PIVOT && (
          <div className="mt-1">
            <button
              onClick={() => { setPlaying(false); onYear(PIVOT) }}
              className="text-slate-500 hover:text-sky-400 text-[9px] font-semibold transition-colors"
            >↶ Back to 2025</button>
          </div>
        )}
      </div>

    </div>
  )
}
