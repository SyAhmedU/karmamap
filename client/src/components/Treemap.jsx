import { useRef, useEffect, useState, useCallback } from 'react'
import { hierarchy, treemap, treemapSquarify } from 'd3-hierarchy'
import { EXCHANGE_RATE } from '../App.jsx'

// ── Color scales ──────────────────────────────────────────────────────────────

function lerp(a, b, t) {
  const hex = (h) => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)]
  const [ar,ag,ab] = hex(a)
  const [br,bg,bb] = hex(b)
  const r = Math.round(ar + (br-ar)*t)
  const g = Math.round(ag + (bg-ag)*t)
  const bl2= Math.round(ab + (bb-ab)*t)
  return `rgb(${r},${g},${bl2})`
}

function growthColor(v) {
  if (v < 0)  return lerp('#991b1b', '#f87171', Math.min(Math.abs(v)/5, 1))
  if (v < 3)  return lerp('#78350f', '#fbbf24', v/3)
  if (v < 10) return lerp('#166534', '#4ade80', (v-3)/7)
  return lerp('#166534', '#86efac', Math.min((v-10)/40, 1))
}

function salaryColor(v, currency) {
  const monthly = currency === 'usd' ? v / EXCHANGE_RATE : v
  const maxM = currency === 'usd' ? 1600 : 135000
  const t = Math.min(monthly / maxM, 1)
  return lerp('#1e3a5f', '#38bdf8', t)
}

function educationColor(v) {
  const t = Math.min((v - 4) / 14, 1)
  return lerp('#2d1657', '#a78bfa', t)
}

function aiColor(v) {
  const t = v / 100
  return lerp('#14532d', '#ef4444', t)
}

export function getColor(occupation, layer, currency) {
  switch (layer) {
    case 'growth':    return growthColor(occupation.growthPct)
    case 'salary':    return salaryColor(occupation.medianSalaryINR, currency)
    case 'education': return educationColor(occupation.educationYears)
    case 'ai':        return aiColor(occupation.aiExposure)
    default:          return '#334155'
  }
}

// ── Format helpers ────────────────────────────────────────────────────────────

function fmtWorkers(n) {
  if (n >= 1e7) return `${(n/1e7).toFixed(1)}Cr`
  if (n >= 1e5) return `${(n/1e5).toFixed(1)}L`
  return `${(n/1000).toFixed(0)}K`
}

function fmtSalary(v, currency) {
  const monthly = currency === 'usd' ? v / EXCHANGE_RATE : v
  const symbol = currency === 'usd' ? '$' : '₹'
  if (monthly >= 100000) return `${symbol}${(monthly/1000).toFixed(0)}K`
  return `${symbol}${Math.round(monthly/1000)}K`
}

function fmtLayer(occ, layer, currency) {
  switch (layer) {
    case 'growth':    return occ.growthPct > 0 ? `+${occ.growthPct}%` : `${occ.growthPct}%`
    case 'salary':    return fmtSalary(occ.medianSalaryINR, currency)
    case 'education': return `${occ.educationYears}yr`
    case 'ai':        return `${occ.aiExposure}/100`
    default:          return ''
  }
}

// ── Build hierarchy ───────────────────────────────────────────────────────────

function buildHierarchy(data) {
  return {
    name: 'root',
    children: data.sectors.map(s => ({
      name: s.name,
      id: s.id,
      color: s.color,
      sector: s,
      children: s.occupations.map(o => ({
        name: o.name,
        id: o.id,
        value: o.workers,
        occupation: o,
        sector: s,
      }))
    }))
  }
}

// ── Treemap component ─────────────────────────────────────────────────────────

export default function Treemap({ data, layer, currency, selected, onSelect }) {
  const containerRef = useRef(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })
  const [nodes, setNodes] = useState([])
  const [groups, setGroups] = useState([])
  const [tooltip, setTooltip] = useState(null)

  // Measure container
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setDims({ w: Math.floor(width), h: Math.floor(height) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Compute layout
  useEffect(() => {
    if (dims.w < 10 || dims.h < 10) return
    const root = hierarchy(buildHierarchy(data))
      .sum(d => d.value || 0)
      .sort((a, b) => b.value - a.value)

    treemap()
      .tile(treemapSquarify)
      .size([dims.w, dims.h])
      .paddingOuter(3)
      .paddingTop(22)
      .paddingInner(1)(root)

    // leaf nodes (occupations)
    const leafs = root.leaves().map(n => ({
      x0: n.x0, y0: n.y0, x1: n.x1, y1: n.y1,
      occupation: n.data.occupation,
      sector: n.data.sector,
    }))

    // sector group nodes
    const grps = root.children.map(n => ({
      x0: n.x0, y0: n.y0, x1: n.x1, y1: n.y1,
      sector: n.data.sector,
      name: n.data.name,
    }))

    setNodes(leafs)
    setGroups(grps)
  }, [dims, data])

  const isSelected = useCallback((occ) =>
    selected?.occupation?.id === occ.id, [selected])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Sector group labels */}
      {groups.map(g => {
        const w = g.x1 - g.x0
        const h = g.y1 - g.y0
        if (w < 60) return null
        return (
          <div
            key={g.sector.id}
            className="absolute pointer-events-none z-10"
            style={{ left: g.x0 + 3, top: g.y0, width: w - 6, height: 20 }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-widest truncate block"
              style={{ color: g.sector.color, opacity: 0.9, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
            >
              {g.name}
            </span>
          </div>
        )
      })}

      {/* Occupation cells */}
      {nodes.map(n => {
        const w = n.x1 - n.x0
        const h = n.y1 - n.y0
        const color = getColor(n.occupation, layer, currency)
        const sel = isSelected(n.occupation)
        const label = fmtLayer(n.occupation, layer, currency)
        const showName = w > 55 && h > 30
        const showVal  = w > 45 && h > 44

        return (
          <div
            key={n.occupation.id}
            className={`treemap-cell ${sel ? 'selected' : ''}`}
            style={{
              left: n.x0, top: n.y0,
              width: w, height: h,
              background: color,
              border: `1px solid rgba(0,0,0,0.25)`,
            }}
            onClick={() => onSelect({ sector: n.sector, occupation: n.occupation })}
            onMouseEnter={(e) => setTooltip({ x: e.clientX, y: e.clientY, n })}
            onMouseMove={(e) => setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
            onMouseLeave={() => setTooltip(null)}
          >
            {showName && (
              <div className="absolute inset-0 p-1 flex flex-col justify-end pointer-events-none">
                <p className="text-white text-[10px] font-semibold leading-tight drop-shadow truncate">
                  {n.occupation.name}
                </p>
                {showVal && (
                  <p className="text-white/70 text-[9px] font-bold drop-shadow">
                    {label}
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Tooltip */}
      {tooltip && (
        <Tooltip x={tooltip.x} y={tooltip.y} n={tooltip.n} layer={layer} currency={currency} dims={dims} />
      )}
    </div>
  )
}

function Tooltip({ x, y, n, layer, currency, dims }) {
  const occ = n.occupation
  const PAD = 12
  const W = 220
  const H = 130

  let tx = x + PAD
  let ty = y + PAD
  if (tx + W > dims.w) tx = x - W - PAD
  if (ty + H > dims.h) ty = y - H - PAD

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{ left: tx, top: ty, width: W }}
    >
      <div className="bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl p-3 shadow-2xl">
        <div className="flex items-start gap-2 mb-2">
          <div className="w-2.5 h-2.5 rounded-sm mt-1 shrink-0" style={{ background: n.sector.color }} />
          <div>
            <p className="text-white text-[12px] font-bold leading-tight">{occ.name}</p>
            <p className="text-slate-400 text-[10px]">{n.sector.name}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <Stat label="Workers" val={fmtWorkers(occ.workers)} />
          <Stat label="Growth"  val={occ.growthPct > 0 ? `+${occ.growthPct}%` : `${occ.growthPct}%`} hi={occ.growthPct > 5} lo={occ.growthPct < 0} />
          <Stat label={currency === 'usd' ? 'Salary $/mo' : 'Salary ₹/mo'} val={fmtSalary(occ.medianSalaryINR, currency)} />
          <Stat label="AI Exposure" val={`${occ.aiExposure}/100`} hi={occ.aiExposure > 60} lo={occ.aiExposure < 25} />
          <Stat label="Education" val={`${occ.educationYears} yrs`} />
        </div>
      </div>
    </div>
  )
}

function Stat({ label, val, hi, lo }) {
  return (
    <div className="bg-slate-800 rounded-lg p-1.5">
      <p className="text-slate-500 text-[9px] uppercase tracking-wide">{label}</p>
      <p className={`text-[11px] font-bold ${hi ? 'text-emerald-400' : lo ? 'text-rose-400' : 'text-white'}`}>{val}</p>
    </div>
  )
}
