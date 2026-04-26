import { useMemo, useState } from 'react'
import { occAtYear } from '../utils/timeline.js'
import { getColor }  from './Treemap.jsx'
import { getMetricValue, formatMetric, fmtWorkers } from '../utils/metrics.js'

const LABEL = {
  growth:      'Fastest Growing',
  salary:      'Highest Paid',
  education:   'Most Education',
  ai:          'Highest AI Risk',
  informality: 'Most Informal',
  gender:      'Most Female-Led',
}

export default function TopFive({ data, layer, year, region, currency, onSelect }) {
  const [open, setOpen] = useState(true)

  const items = useMemo(() => {
    const all = data.sectors.flatMap(s =>
      s.occupations.map(o => {
        const oy = occAtYear(o, year, region)
        return { occ: o, occY: oy, sector: s, v: getMetricValue(oy, layer) }
      })
    ).filter(x => x.v !== null)

    return [...all].sort((a, b) => b.v - a.v).slice(0, 5)
  }, [data, layer, year, region])

  return (
    <div className="absolute bottom-3 right-3 z-30 pointer-events-auto select-none" style={{ width: 212 }}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-900/95 border border-slate-700 rounded-t-xl backdrop-blur text-left"
      >
        <span className="text-slate-400 text-[9px] uppercase tracking-widest font-bold">{LABEL[layer]}</span>
        <span className="text-slate-600 text-[10px]">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="bg-slate-900/95 border-x border-b border-slate-700 rounded-b-xl backdrop-blur overflow-hidden">
          {items.map((item, i) => {
            const color = getColor(item.occY, layer)
            return (
              <button
                key={item.occ.id}
                onClick={() => onSelect({ sector: item.sector, occupation: item.occ })}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-800/80 transition-colors border-t border-slate-800/60 text-left group"
              >
                <span className="text-slate-600 text-[9px] w-3 shrink-0 tabular-nums">#{i+1}</span>
                <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-[10px] font-semibold truncate group-hover:text-white leading-tight">
                    {item.occ.shortLabel || item.occ.name}
                  </p>
                  <p className="text-slate-600 text-[9px] truncate">{item.sector.shortName || item.sector.name}</p>
                </div>
                <span className="text-slate-400 text-[10px] font-bold shrink-0 tabular-nums">
                  {formatMetric(item.occY, layer, currency)}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
