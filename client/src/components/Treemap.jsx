import { useRef, useEffect, useState, useCallback } from 'react'
import { hierarchy, treemap, treemapSquarify } from 'd3-hierarchy'
import { EXCHANGE_RATE } from '../App.jsx'
import { occAtYear } from '../utils/timeline.js'

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

function salaryColor(v) {
  const t = Math.min(v / 13000, 1)
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

// Diverging: formal (0%) = #0f4c75, midpoint (50%) = #4a4a55, informal (100%) = #9b1c1c
function informalityColor(v) {
  const t = Math.min(v / 100, 1)
  if (t <= 0.5) return lerp('#0f4c75', '#4a4a55', t * 2)
  return lerp('#4a4a55', '#9b1c1c', (t - 0.5) * 2)
}

// Diverging: 0% female = #1e3a8a, 50% = #4a4a55, 100% = #9d174d
function genderColor(v) {
  const t = Math.min(v / 100, 1)
  if (t <= 0.5) return lerp('#1e3a8a', '#4a4a55', t * 2)
  return lerp('#4a4a55', '#9d174d', (t - 0.5) * 2)
}

function salaryUSD(occ) {
  return occ.medianSalaryUSD ?? (occ.medianSalaryINR / EXCHANGE_RATE)
}

export function getColor(occupation, layer) {
  switch (layer) {
    case 'growth':      return growthColor(occupation.growthPct)
    case 'salary':      return salaryColor(salaryUSD(occupation))
    case 'education':   return educationColor(occupation.educationYears)
    case 'ai':          return aiColor(occupation.aiExposure)
    case 'informality': return informalityColor(occupation.informalityPct ?? 50)
    case 'gender':      return genderColor(occupation.femalePct ?? 30)
    default:            return '#334155'
  }
}

// ── Text contrast helper (item 9) ─────────────────────────────────────────────
// Returns white or near-black so label meets WCAG AA against the bg color.

function relativeLuminance(rgbStr) {
  const m = rgbStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (!m) return 0
  return [m[1], m[2], m[3]].reduce((acc, v, i) => {
    const c = parseInt(v) / 255
    const lin = c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    return acc + lin * [0.2126, 0.7152, 0.0722][i]
  }, 0)
}

function labelColor(bgColor) {
  return relativeLuminance(bgColor) >= 0.35 ? '#0a0a0a' : '#ffffff'
}

// ── Format helpers ─────────────────────────────────────────────────────────────

function fmtWorkers(n) {
  if (n >= 1e9) return `${(n/1e9).toFixed(2)}B`
  if (n >= 1e7) return `${(n/1e7).toFixed(1)}Cr`
  if (n >= 1e5) return `${(n/1e5).toFixed(1)}L`
  return `${(n/1000).toFixed(0)}K`
}

function fmtSalary(occ, currency) {
  const usd = salaryUSD(occ)
  if (currency === 'usd') {
    return usd >= 1000 ? `$${(usd/1000).toFixed(1)}K` : `$${Math.round(usd)}`
  }
  const inr = occ.medianSalaryINR ?? (usd * EXCHANGE_RATE)
  return inr >= 100000 ? `₹${(inr/1000).toFixed(0)}K` : `₹${Math.round(inr/1000)}K`
}

function fmtLayer(occ, layer, currency) {
  switch (layer) {
    case 'growth':      return occ.growthPct > 0 ? `+${occ.growthPct}%` : `${occ.growthPct}%`
    case 'salary':      return fmtSalary(occ, currency)
    case 'education':   return `${occ.educationYears} yrs`
    case 'ai':          return `${occ.aiExposure}/100`
    case 'informality': return `${occ.informalityPct ?? '?'}% informal`
    case 'gender':      return `${occ.femalePct ?? '?'}% female`
    default:            return ''
  }
}

// ── Label selection by width (item 1b) ────────────────────────────────────────

function pickCellLabel(occ, w) {
  if (w >= 180) return occ.name                                   // full name, allow wrap
  if (w >= 100) return occ.shortLabel || occ.name.slice(0, 14)   // short form
  if (w >= 60)  return (occ.shortLabel || occ.name).slice(0, 6)  // first 6 chars, no ellipsis (tooltip has full)
  return ''                                                        // too narrow — skip
}

// Font size interpolated by sqrt(area) (item 1c)
function cellFontSize(w, h) {
  const sqrtArea = Math.sqrt(w * h)
  const t = Math.min(sqrtArea / 220, 1)
  return Math.round(10 + t * 4) // 10 → 14 px
}

// Section header label — never truncates (item 1d)
function sectorLabel(sector, w) {
  const full  = sector.name
  const short = sector.shortName || full
  if (w >= 150) return full
  if (w >= 80)  return short
  // drop "& ..." suffix first, then truncate
  const noAmp = short.replace(/\s*&.*$/, '').trim()
  return noAmp.slice(0, Math.max(8, Math.floor(w / 8)))
}

// ── Build hierarchy ────────────────────────────────────────────────────────────

function buildHierarchy(data, year, region) {
  return {
    name: 'root',
    children: data.sectors.map(s => ({
      name: s.name,
      id: s.id,
      color: s.color,
      sector: s,
      children: s.occupations.map(o => {
        const oAdj = occAtYear(o, year, region)
        return {
          name: o.name,
          id: o.id,
          value: Math.max(1, oAdj.workers),
          occupation: { ...oAdj, shortLabel: o.shortLabel },
          occBase: o,
          sector: s,
        }
      })
    }))
  }
}

// ── Treemap component ─────────────────────────────────────────────────────────

export default function Treemap({ data, layer, currency, selected, onSelect, search = '', year = 2025, region = 'india' }) {
  const containerRef = useRef(null)
  const [dims, setDims]     = useState({ w: 0, h: 0 })
  const [nodes, setNodes]   = useState([])
  const [groups, setGroups] = useState([])
  const [tooltip, setTooltip] = useState(null)
  const [focused, setFocused] = useState(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setDims({ w: Math.floor(width), h: Math.floor(height) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (dims.w < 10 || dims.h < 10) return
    const root = hierarchy(buildHierarchy(data, year, region))
      .sum(d => d.value || 0)
      .sort((a, b) => b.value - a.value)

    treemap()
      .tile(treemapSquarify)
      .size([dims.w, dims.h])
      .paddingOuter(3)
      .paddingTop(22)
      .paddingInner(1)(root)

    const leafs = root.leaves().map(n => ({
      x0: n.x0, y0: n.y0, x1: n.x1, y1: n.y1,
      occupation: n.data.occupation,
      occBase:    n.data.occBase,
      sector:     n.data.sector,
    }))

    const grps = root.children.map(n => ({
      x0: n.x0, y0: n.y0, x1: n.x1, y1: n.y1,
      sector: n.data.sector,
    }))

    setNodes(leafs)
    setGroups(grps)
  }, [dims, data, year, region])

  const isSelected = useCallback((occ) =>
    selected?.occupation?.id === occ.id, [selected])

  const query = search.trim().toLowerCase()
  const isMatch = useCallback((occ) =>
    !query || occ.name.toLowerCase().includes(query), [query])

  // Keyboard: dismiss on Escape anywhere in the container
  function handleContainerKey(e) {
    if (e.key === 'Escape') { setTooltip(null); setFocused(null) }
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      onKeyDown={handleContainerKey}
    >
      {/* Sector group labels (item 1d + item 10 — neutral color) */}
      {groups.map(g => {
        const w = g.x1 - g.x0
        const h = g.y1 - g.y0
        if (w < 40 || h < 24) return null
        return (
          <div
            key={g.sector.id}
            className="absolute pointer-events-none z-10"
            style={{ left: g.x0 + 3, top: g.y0, width: w - 6, height: 20 }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-widest block whitespace-nowrap text-slate-400"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
            >
              {sectorLabel(g.sector, w - 6)}
            </span>
          </div>
        )
      })}

      {/* Occupation cells */}
      {nodes.map((n, idx) => {
        const w   = n.x1 - n.x0
        const h   = n.y1 - n.y0
        const occ = n.occupation
        const base = n.occBase || occ
        const color     = getColor(occ, layer)
        const txtColor  = labelColor(color)
        const sel       = isSelected(occ)
        const matched   = isMatch(occ)
        const cellLabel = pickCellLabel(occ, w)
        const valLabel  = fmtLayer(occ, layer, currency)
        const fontSize  = cellFontSize(w, h)
        const showVal   = w > 55 && h > 44
        const ariaLabel = `${base.name}, ${valLabel}, ${fmtWorkers(occ.workers)} workers`
        const showFemalePill = layer === 'gender' && (occ.femalePct ?? 0) >= 60 && w > 60 && h > 40

        return (
          <div
            key={occ.id}
            role="button"
            tabIndex={0}
            aria-label={ariaLabel}
            title={ariaLabel}
            className={`treemap-cell ${sel ? 'selected' : ''}`}
            style={{
              left: n.x0, top: n.y0,
              width: w, height: h,
              background: color,
              border: `1px solid rgba(0,0,0,0.25)`,
              opacity: query && !matched ? 0.18 : 1,
              transition: 'opacity 0.2s ease, filter 0.15s ease',
              outline: focused === idx ? '2px solid #f8fafc' : undefined,
              outlineOffset: focused === idx ? '-2px' : undefined,
            }}
            onClick={() => onSelect({ sector: n.sector, occupation: base, occAdj: occ })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSelect({ sector: n.sector, occupation: base, occAdj: occ })
              if (e.key === 'Escape') { setTooltip(null); setFocused(null) }
            }}
            onFocus={() => setFocused(idx)}
            onBlur={() => setFocused(f => f === idx ? null : f)}
            onMouseEnter={(e) => setTooltip({ x: e.clientX, y: e.clientY, n })}
            onMouseMove={(e) => setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
            onMouseLeave={() => setTooltip(null)}
          >
            {cellLabel && (
              <div className="absolute inset-0 p-1 flex flex-col justify-end pointer-events-none">
                {/* Wide cell: allow 2-line wrap; narrow: single line */}
                <p
                  className={`font-semibold leading-tight drop-shadow ${w >= 180 ? 'line-clamp-2 whitespace-normal' : 'whitespace-nowrap'}`}
                  style={{ fontSize, color: txtColor, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
                >
                  {cellLabel}
                </p>
                {showVal && (
                  <p
                    className="font-bold drop-shadow mt-0.5 whitespace-nowrap"
                    style={{ fontSize: Math.max(fontSize - 2, 9), color: txtColor, opacity: 0.75, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
                  >
                    {valLabel}
                  </p>
                )}
              </div>
            )}

            {/* ♀ non-color signal for high female participation (item 12) */}
            {showFemalePill && (
              <div className="absolute top-1 right-1 pointer-events-none">
                <span className="text-[9px] bg-fuchsia-800/70 text-fuchsia-200 rounded px-1 leading-tight font-bold">♀</span>
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

// ── Tooltip (item 3) ──────────────────────────────────────────────────────────

const LAYER_LABEL = {
  growth:      'Growth/yr',
  salary:      'Salary/mo',
  education:   'Education',
  ai:          'AI Exposure',
  informality: 'Informal %',
  gender:      'Female %',
}

function Tooltip({ x, y, n, layer, currency, dims }) {
  const occ  = n.occupation         // year-adjusted metrics
  const base = n.occBase || occ     // full name, description, sources
  const PAD  = 14
  const W    = 240

  // Definition: first sentence of description
  const defn = base.description
    ? base.description.split(/\.\s/)[0].replace(/\.$/, '') + '.'
    : null

  // Position: never overflow viewport
  let tx = x + PAD
  let ty = y + PAD
  if (tx + W > dims.w) tx = x - W - PAD
  if (ty + 220 > dims.h) ty = Math.max(4, dims.h - 224)

  // Other metrics (everything except the currently selected layer)
  const others = [
    layer !== 'growth'      && { label: 'Growth/yr',   val: occ.growthPct > 0 ? `+${occ.growthPct}%` : `${occ.growthPct}%`, hi: occ.growthPct > 5, lo: occ.growthPct < 0 },
    layer !== 'salary'      && { label: currency === 'usd' ? 'Salary $/mo' : 'Salary ₹/mo', val: fmtSalary(occ, currency) },
    layer !== 'education'   && { label: 'Education',   val: `${occ.educationYears} yrs` },
    layer !== 'ai'          && { label: 'AI Exposure',  val: `${occ.aiExposure}/100`, hi: occ.aiExposure > 60, lo: occ.aiExposure < 25 },
    layer !== 'informality' && occ.informalityPct != null && { label: 'Informal %', val: `${occ.informalityPct}%`, lo: occ.informalityPct > 70 },
    layer !== 'gender'      && occ.femalePct != null && { label: 'Female %',  val: `${occ.femalePct}%` },
  ].filter(Boolean)

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{ left: tx, top: ty, width: W }}
    >
      <div className="bg-slate-900/97 backdrop-blur border border-slate-700 rounded-xl p-3 shadow-2xl">
        {/* Header */}
        <div className="flex items-start gap-2 mb-2">
          <div className="w-2.5 h-2.5 rounded-sm mt-0.5 shrink-0" style={{ background: n.sector.color }} />
          <div>
            <p className="text-white text-[12px] font-bold leading-tight">{base.name}</p>
            <p className="text-slate-400 text-[10px]">{n.sector.name}</p>
          </div>
        </div>

        {/* Definition */}
        {defn && (
          <p className="text-slate-400 text-[10px] leading-relaxed mb-2 border-b border-slate-800 pb-2">
            {defn}
          </p>
        )}

        {/* Workforce size — always prominent */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-500 text-[9px] uppercase tracking-wide">Workers</span>
          <span className="text-sky-300 text-[13px] font-black">{fmtWorkers(occ.workers)}</span>
        </div>

        {/* Active metric — highlighted */}
        <div className="bg-slate-800 rounded-lg px-2 py-1.5 mb-2 flex items-center justify-between">
          <span className="text-slate-400 text-[9px] uppercase tracking-wide">{LAYER_LABEL[layer]}</span>
          <span className="text-white text-[13px] font-black">{fmtLayer(occ, layer, currency)}</span>
        </div>

        {/* Other metrics */}
        <div className="grid grid-cols-2 gap-1">
          {others.map(({ label, val, hi, lo }) => (
            <div key={label} className="bg-slate-800/60 rounded p-1">
              <p className="text-slate-500 text-[8px] uppercase tracking-wide leading-none mb-0.5">{label}</p>
              <p className={`text-[10px] font-bold ${hi ? 'text-emerald-400' : lo ? 'text-rose-400' : 'text-slate-300'}`}>{val}</p>
            </div>
          ))}
        </div>

        {/* Top skill */}
        {occ.topSkills?.[0] && (
          <p className="text-slate-500 text-[9px] mt-1.5 pt-1.5 border-t border-slate-800">
            <span className="text-slate-600">Top skill: </span>{occ.topSkills[0]}
          </p>
        )}
      </div>
    </div>
  )
}
