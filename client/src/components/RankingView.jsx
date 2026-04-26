import { useMemo, useState } from 'react'
import { occAtYear } from '../utils/timeline.js'
import { getColor }  from './Treemap.jsx'
import { getMetricValue, formatMetric, fmtWorkers } from '../utils/metrics.js'

const LAYER_LABEL = {
  growth:      'Growth %/yr',
  salary:      'Salary',
  education:   'Edu. Years',
  ai:          'AI Exposure',
  informality: 'Informality',
  gender:      'Female %',
}

function SortIcon({ col, sortKey, dir }) {
  if (sortKey !== col) return <span className="text-slate-700 ml-0.5">↕</span>
  return <span className="text-sky-400 ml-0.5">{dir === 'desc' ? '↓' : '↑'}</span>
}

export default function RankingView({ data, layer, year, region, currency, search, selected, onSelect }) {
  const [sortKey, setSortKey] = useState('metric')
  const [sortDir, setSortDir] = useState('desc')

  const query = search.trim().toLowerCase()

  const rows = useMemo(() => {
    return data.sectors.flatMap(s =>
      s.occupations.map(o => {
        const oy = occAtYear(o, year, region)
        return { occ: o, occY: oy, sector: s, metric: getMetricValue(oy, layer) }
      })
    )
  }, [data, layer, year, region])

  const sorted = useMemo(() => {
    const filtered = query ? rows.filter(r => r.occ.name.toLowerCase().includes(query) || r.sector.name.toLowerCase().includes(query)) : rows
    return [...filtered].sort((a, b) => {
      if (sortKey === 'name')    return sortDir === 'asc' ? a.occ.name.localeCompare(b.occ.name) : b.occ.name.localeCompare(a.occ.name)
      if (sortKey === 'sector')  return sortDir === 'asc' ? a.sector.name.localeCompare(b.sector.name) : b.sector.name.localeCompare(a.sector.name)
      if (sortKey === 'workers') return sortDir === 'asc' ? (a.occY.workers||0) - (b.occY.workers||0) : (b.occY.workers||0) - (a.occY.workers||0)
      // metric
      const va = a.metric, vb = b.metric
      if (va == null && vb == null) return 0
      if (va == null) return 1
      if (vb == null) return -1
      return sortDir === 'asc' ? va - vb : vb - va
    })
  }, [rows, sortKey, sortDir, query])

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const th = 'px-3 py-2 text-left text-[9px] uppercase tracking-widest font-bold text-slate-500 cursor-pointer hover:text-slate-300 whitespace-nowrap select-none'
  const td = 'px-3 py-2 text-[11px]'

  return (
    <div className="absolute inset-0 overflow-auto bg-[#0b1120]">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800">
          <tr>
            <th className={`${th} w-8`}>#</th>
            <th className={th} onClick={() => toggleSort('name')}>
              Occupation <SortIcon col="name" sortKey={sortKey} dir={sortDir} />
            </th>
            <th className={th} onClick={() => toggleSort('sector')}>
              Sector <SortIcon col="sector" sortKey={sortKey} dir={sortDir} />
            </th>
            <th className={`${th} text-right`} onClick={() => toggleSort('workers')}>
              Workers <SortIcon col="workers" sortKey={sortKey} dir={sortDir} />
            </th>
            <th className={`${th} text-right`} onClick={() => toggleSort('metric')}>
              {LAYER_LABEL[layer]} <SortIcon col="metric" sortKey={sortKey} dir={sortDir} />
            </th>
            <th className={`${th} text-right`}>Growth</th>
            <th className={`${th} text-right`}>AI Risk</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const { occ, occY, sector } = row
            const color  = getColor(occY, layer)
            const isSel  = selected?.occupation?.id === occ.id
            return (
              <tr
                key={occ.id}
                onClick={() => onSelect({ sector, occupation: occ })}
                className={`border-b border-slate-800/50 cursor-pointer transition-colors ${isSel ? 'bg-slate-700/60' : 'hover:bg-slate-800/40'}`}
              >
                <td className={`${td} text-slate-600 tabular-nums w-8`}>{i+1}</td>
                <td className={td}>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: color }} />
                    <span className={`font-semibold ${isSel ? 'text-white' : 'text-slate-200'}`}>{occ.name}</span>
                  </div>
                </td>
                <td className={`${td} text-slate-400`}>{sector.shortName || sector.name}</td>
                <td className={`${td} text-slate-300 text-right tabular-nums`}>{fmtWorkers(occY.workers)}</td>
                <td className={`${td} text-right font-bold tabular-nums`}>
                  <span className="text-sky-300">{formatMetric(occY, layer, currency)}</span>
                </td>
                <td className={`${td} text-right tabular-nums ${occY.growthPct < 0 ? 'text-rose-400' : occY.growthPct > 5 ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {occY.growthPct != null ? `${occY.growthPct > 0 ? '+' : ''}${occY.growthPct}%` : '—'}
                </td>
                <td className={`${td} text-right tabular-nums ${occY.aiExposure > 60 ? 'text-rose-400' : occY.aiExposure > 35 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {occY.aiExposure != null ? `${occY.aiExposure}` : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {sorted.length === 0 && (
        <p className="text-center text-slate-600 text-sm py-12">No occupations match "{search}"</p>
      )}
    </div>
  )
}
