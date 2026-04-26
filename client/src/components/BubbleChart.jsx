import { useRef, useEffect, useState, useMemo } from 'react'
import { occAtYear } from '../utils/timeline.js'
import { getColor }  from './Treemap.jsx'
import { EXCHANGE_RATE } from '../App.jsx'

const METRICS = [
  { id: 'ai',          label: 'AI Exposure',      unit: '/100', fmt: v => `${v}`,            get: o => o.aiExposure },
  { id: 'salary',      label: 'Salary (USD/mo)',   unit: '$',    fmt: v => v >= 1000 ? `$${(v/1000).toFixed(0)}K` : `$${v}`, get: o => o.medianSalaryUSD ?? (o.medianSalaryINR != null ? o.medianSalaryINR / EXCHANGE_RATE : null) },
  { id: 'growth',      label: 'Growth %/yr',       unit: '%',    fmt: v => `${v > 0 ? '+' : ''}${v}%`,  get: o => o.growthPct },
  { id: 'education',   label: 'Education (yrs)',    unit: 'yrs',  fmt: v => `${v} yrs`,       get: o => o.educationYears },
  { id: 'informality', label: 'Informality %',      unit: '%',    fmt: v => `${v}%`,          get: o => o.informalityPct },
  { id: 'gender',      label: 'Female Workers %',   unit: '%',    fmt: v => `${v}%`,          get: o => o.femalePct },
]

const PAD = { top: 24, right: 28, bottom: 56, left: 68 }

function niceTicks(min, max, n = 5) {
  const raw  = (max - min) / n
  const mag  = Math.pow(10, Math.floor(Math.log10(raw)))
  const norm = raw / mag
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10
  const step = nice * mag
  const ticks = []
  for (let v = Math.ceil(min / step) * step; v <= max + step * 0.01; v = Math.round((v + step) * 1e9) / 1e9) {
    if (v >= min - step * 0.01) ticks.push(Math.round(v * 1000) / 1000)
    if (ticks.length > n + 3) break
  }
  return ticks
}

export default function BubbleChart({ data, layer, year, region, currency, selected, onSelect, search }) {
  const containerRef = useRef(null)
  const [dims, setDims] = useState({ w: 600, h: 400 })
  const [xId, setXId]   = useState('ai')
  const [yId, setYId]   = useState('salary')
  const [tip,  setTip]  = useState(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect
      setDims({ w: Math.floor(width), h: Math.floor(height) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const xDef = METRICS.find(m => m.id === xId)
  const yDef = METRICS.find(m => m.id === yId)
  const query = (search || '').trim().toLowerCase()

  const points = useMemo(() => {
    return data.sectors.flatMap(s =>
      s.occupations.map(o => {
        const oy = occAtYear(o, year, region)
        const x  = xDef.get(oy)
        const y  = yDef.get(oy)
        if (x == null || y == null) return null
        return { occ: o, occY: oy, sector: s, x, y, workers: oy.workers || 1 }
      })
    ).filter(Boolean)
  }, [data, year, region, xId, yId])

  const chartW = dims.w - PAD.left - PAD.right
  const chartH = dims.h - PAD.top  - PAD.bottom
  if (chartW < 50 || chartH < 50 || !points.length) return <div ref={containerRef} className="absolute inset-0" />

  const xs   = points.map(p => p.x)
  const ys   = points.map(p => p.y)
  const xMin = Math.min(...xs), xMax = Math.max(...xs)
  const yMin = Math.min(...ys), yMax = Math.max(...ys)
  const wMax = Math.max(...points.map(p => p.workers))

  const pad = 0.06  // 6% axis padding
  const xRange = (xMax - xMin) || 1
  const yRange = (yMax - yMin) || 1
  const xLo = xMin - xRange * pad, xHi = xMax + xRange * pad
  const yLo = yMin - yRange * pad, yHi = yMax + yRange * pad

  const sx = v => PAD.left + ((v - xLo) / (xHi - xLo)) * chartW
  const sy = v => PAD.top  + chartH - ((v - yLo) / (yHi - yLo)) * chartH
  const sr = w => Math.max(4, Math.sqrt(w / wMax) * 34)

  const xTicks = niceTicks(xMin, xMax)
  const yTicks = niceTicks(yMin, yMax)

  // Sort: smaller circles on top so big ones don't block small
  const sorted = [...points].sort((a, b) => b.workers - a.workers)

  return (
    <div className="absolute inset-0 flex flex-col bg-[#0b1120]">

      {/* Axis selectors */}
      <div className="flex items-center gap-4 px-5 py-2 border-b border-slate-800 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">X</span>
          <select value={xId} onChange={e => setXId(e.target.value)}
            className="bg-slate-800 text-slate-200 text-[11px] rounded-lg px-2 py-1 border border-slate-700 outline-none cursor-pointer">
            {METRICS.filter(m => m.id !== yId).map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Y</span>
          <select value={yId} onChange={e => setYId(e.target.value)}
            className="bg-slate-800 text-slate-200 text-[11px] rounded-lg px-2 py-1 border border-slate-700 outline-none cursor-pointer">
            {METRICS.filter(m => m.id !== xId).map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </div>
        <span className="text-slate-600 text-[9px] ml-auto shrink-0">Bubble size ∝ workers · Color = {layer} view · {points.length} occupations</span>
      </div>

      {/* SVG chart */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <svg width={dims.w} height={dims.h} className="block">

          {/* Grid lines */}
          {xTicks.map(v => (
            <line key={v} x1={sx(v)} y1={PAD.top} x2={sx(v)} y2={PAD.top + chartH}
              stroke="#1e293b" strokeWidth="1" />
          ))}
          {yTicks.map(v => (
            <line key={v} x1={PAD.left} y1={sy(v)} x2={PAD.left + chartW} y2={sy(v)}
              stroke="#1e293b" strokeWidth="1" />
          ))}

          {/* Axes */}
          <line x1={PAD.left} y1={PAD.top + chartH} x2={PAD.left + chartW} y2={PAD.top + chartH} stroke="#334155" />
          <line x1={PAD.left} y1={PAD.top}           x2={PAD.left}         y2={PAD.top + chartH}  stroke="#334155" />

          {/* X ticks + labels */}
          {xTicks.map(v => (
            <g key={v}>
              <line x1={sx(v)} y1={PAD.top + chartH} x2={sx(v)} y2={PAD.top + chartH + 4} stroke="#475569" />
              <text x={sx(v)} y={PAD.top + chartH + 16} textAnchor="middle" fill="#64748b" fontSize="10">
                {xDef.fmt(v)}
              </text>
            </g>
          ))}
          <text x={PAD.left + chartW / 2} y={dims.h - 8}
            textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">
            {xDef.label}
          </text>

          {/* Y ticks + labels */}
          {yTicks.map(v => (
            <g key={v}>
              <line x1={PAD.left - 4} y1={sy(v)} x2={PAD.left} y2={sy(v)} stroke="#475569" />
              <text x={PAD.left - 8} y={sy(v) + 4} textAnchor="end" fill="#64748b" fontSize="10">
                {yDef.fmt(v)}
              </text>
            </g>
          ))}
          <text
            transform={`translate(14, ${PAD.top + chartH / 2}) rotate(-90)`}
            textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">
            {yDef.label}
          </text>

          {/* Bubbles — large first, small on top */}
          {sorted.map(p => {
            const cx      = sx(p.x)
            const cy      = sy(p.y)
            const r       = sr(p.workers)
            const color   = getColor(p.occY, layer)
            const isSel   = selected?.occupation?.id === p.occ.id
            const matched = !query || p.occ.name.toLowerCase().includes(query) || p.sector.name.toLowerCase().includes(query)
            return (
              <circle
                key={p.occ.id}
                cx={cx} cy={cy} r={r}
                fill={color}
                fillOpacity={matched ? (isSel ? 1 : 0.72) : 0.08}
                stroke={isSel ? '#f8fafc' : matched ? 'rgba(0,0,0,0.35)' : 'none'}
                strokeWidth={isSel ? 2.5 : 0.8}
                style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s, r 0.2s' }}
                onClick={() => onSelect({ sector: p.sector, occupation: p.occ })}
                onMouseEnter={e => setTip({ x: e.clientX, y: e.clientY, p })}
                onMouseMove={e  => setTip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
                onMouseLeave={() => setTip(null)}
              />
            )
          })}

          {/* Labels for selected bubble */}
          {sorted.filter(p => selected?.occupation?.id === p.occ.id).map(p => (
            <text key={p.occ.id} x={sx(p.x)} y={sy(p.y) - sr(p.workers) - 5}
              textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="700"
              style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
              {p.occ.shortLabel || p.occ.name}
            </text>
          ))}
        </svg>
      </div>

      {/* Tooltip */}
      {tip && (() => {
        const { p } = tip
        const salUSD = p.occY.medianSalaryUSD ?? (p.occY.medianSalaryINR != null ? p.occY.medianSalaryINR / EXCHANGE_RATE : null)
        return (
          <div className="fixed z-50 pointer-events-none bg-slate-900/95 border border-slate-700 rounded-xl p-3 shadow-2xl"
            style={{ left: tip.x + 14, top: tip.y - 60, maxWidth: 240 }}>
            <p className="text-white font-bold text-[12px] leading-tight">{p.occ.name}</p>
            <p className="text-slate-400 text-[10px] mb-2">{p.sector.name}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
              <span className="text-slate-500 text-[10px]">{xDef.label}</span>
              <span className="text-sky-300 text-[10px] font-bold">{xDef.fmt(p.x)}</span>
              <span className="text-slate-500 text-[10px]">{yDef.label}</span>
              <span className="text-sky-300 text-[10px] font-bold">{yDef.fmt(p.y)}</span>
              <span className="text-slate-500 text-[10px]">Workers</span>
              <span className="text-slate-300 text-[10px]">{p.workers >= 1e7 ? `${(p.workers/1e7).toFixed(1)}Cr` : p.workers >= 1e5 ? `${(p.workers/1e5).toFixed(1)}L` : `${(p.workers/1000).toFixed(0)}K`}</span>
              {salUSD != null && (
                <>
                  <span className="text-slate-500 text-[10px]">Salary</span>
                  <span className="text-emerald-300 text-[10px]">{salUSD >= 1000 ? `$${(salUSD/1000).toFixed(1)}K/mo` : `$${Math.round(salUSD)}/mo`}</span>
                </>
              )}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
