const YEARS = [2000, 2010, 2020, 2025, 2035, 2050]
const PIVOT  = 2025  // boundary between historical and projected

export { YEARS }

export default function YearSlider({ year, onYear }) {
  const idx    = YEARS.indexOf(year)
  const pivotI = YEARS.indexOf(PIVOT)

  return (
    <div className="shrink-0 bg-slate-900/95 border-t border-slate-800 px-6 py-2.5 flex items-center gap-5 z-20">
      {/* Label */}
      <div className="shrink-0 text-center" style={{ minWidth: 68 }}>
        <p className="text-white font-black text-xl leading-none tabular-nums">{year}</p>
        <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${year <= PIVOT ? 'text-sky-400' : 'text-amber-400'}`}>
          {year <= PIVOT ? 'Historical' : 'Projected'}
        </p>
      </div>

      {/* Year buttons */}
      <div className="flex-1 relative flex items-center">
        {/* Track */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-700 rounded-full" />

        {/* Historical fill */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-sky-600 rounded-full transition-all duration-300"
          style={{ left: 0, width: `${(Math.min(idx, pivotI) / (YEARS.length - 1)) * 100}%` }}
        />

        {/* Projected fill */}
        {idx > pivotI && (
          <div
            className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-amber-500 rounded-full transition-all duration-300"
            style={{
              left:  `${(pivotI / (YEARS.length - 1)) * 100}%`,
              width: `${((idx - pivotI) / (YEARS.length - 1)) * 100}%`,
            }}
          />
        )}

        {/* Year dots */}
        {YEARS.map((yr, i) => {
          const pct     = (i / (YEARS.length - 1)) * 100
          const active  = yr === year
          const past    = yr < year
          const isPivot = yr === PIVOT
          return (
            <button
              key={yr}
              onClick={() => onYear(yr)}
              className="absolute -translate-x-1/2 flex flex-col items-center gap-1 group"
              style={{ left: `${pct}%` }}
            >
              {/* Dot */}
              <div className={`
                w-3 h-3 rounded-full border-2 transition-all duration-200
                ${active
                  ? (yr <= PIVOT ? 'bg-sky-400 border-sky-300 scale-125' : 'bg-amber-400 border-amber-300 scale-125')
                  : past
                    ? 'bg-sky-600 border-sky-500'
                    : 'bg-slate-700 border-slate-600 group-hover:border-slate-400'}
              `} />
              {/* Label */}
              <span className={`
                text-[10px] font-bold tabular-nums mt-0.5 select-none
                ${active
                  ? (yr <= PIVOT ? 'text-sky-300' : 'text-amber-300')
                  : isPivot
                    ? 'text-slate-300'
                    : 'text-slate-500 group-hover:text-slate-300'}
              `}>
                {yr}
              </span>
              {isPivot && (
                <span className="text-[8px] text-slate-500 font-semibold -mt-0.5">NOW</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Context chip */}
      <div className="shrink-0 text-right" style={{ minWidth: 90 }}>
        <p className="text-slate-500 text-[9px] uppercase tracking-widest">
          {year <= PIVOT ? '← History' : 'Forecast →'}
        </p>
        <p className="text-slate-400 text-[10px] font-semibold mt-0.5">
          {year === 2000 && 'Pre-IT boom'}
          {year === 2010 && 'Smartphone era'}
          {year === 2020 && 'COVID / Gig rise'}
          {year === 2025 && 'AI disruption'}
          {year === 2035 && 'Automation wave'}
          {year === 2050 && 'Post-AGI world'}
        </p>
      </div>
    </div>
  )
}
