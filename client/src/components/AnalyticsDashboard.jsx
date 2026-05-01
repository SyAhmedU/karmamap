import { useMemo } from 'react'
import { occAtYear, totalWorkforceAtYear, TIMELINE_YEARS } from '../utils/timeline.js'

// ── Data builders ─────────────────────────────────────────────────────────

function buildRiskDist(data, year, region) {
  const acc = { high: 0, mod: 0, low: 0, highC: 0, modC: 0, lowC: 0 }
  for (const s of data.sectors) {
    for (const o of s.occupations) {
      const oy  = occAtYear(o, year, region)
      const dii = o.digitalIntensity ?? null
      if (oy.aiExposure == null || dii == null) continue
      const adri = Math.round(oy.aiExposure * dii / 100)
      const w    = oy.workers || 0
      if (adri > 55)      { acc.high += w; acc.highC++ }
      else if (adri > 28) { acc.mod  += w; acc.modC++  }
      else                { acc.low  += w; acc.lowC++  }
    }
  }
  return acc
}

function buildTimeline(data, region) {
  return TIMELINE_YEARS.map(yr => {
    let high = 0, mod = 0, low = 0
    for (const s of data.sectors) {
      for (const o of s.occupations) {
        const oy  = occAtYear(o, yr, region)
        const dii = o.digitalIntensity ?? null
        if (oy.aiExposure == null || dii == null) continue
        const adri = Math.round(oy.aiExposure * dii / 100)
        const w    = oy.workers || 0
        if (adri > 55)      high += w
        else if (adri > 28) mod  += w
        else                low  += w
      }
    }
    return { year: yr, high, mod, low }
  })
}

function buildTopSectors(data, year, region) {
  return data.sectors.map(s => {
    let sum = 0, cnt = 0
    for (const o of s.occupations) {
      const oy  = occAtYear(o, year, region)
      const dii = o.digitalIntensity ?? null
      if (oy.aiExposure == null || dii == null) continue
      sum += Math.round(oy.aiExposure * dii / 100); cnt++
    }
    return { name: s.name, avgAdri: cnt ? Math.round(sum / cnt) : 0, occ: cnt }
  }).sort((a, b) => b.avgAdri - a.avgAdri).slice(0, 9)
}

function buildTopOccs(data, year, region, n = 10) {
  const rows = []
  for (const s of data.sectors) {
    for (const o of s.occupations) {
      const oy  = occAtYear(o, year, region)
      const dii = o.digitalIntensity ?? null
      if (oy.aiExposure == null || dii == null) continue
      const adri = Math.round(oy.aiExposure * dii / 100)
      rows.push({ name: o.name, sector: s.name, adri, ae: oy.aiExposure, dii, workers: oy.workers || 0, occ: o, sec: s })
    }
  }
  return rows.sort((a, b) => b.adri - a.adri).slice(0, n)
}

// ── Formatting helpers ────────────────────────────────────────────────────

function fmtW(w, region) {
  if (!w) return '0'
  if (region === 'world') {
    return w >= 1e9 ? `${(w / 1e9).toFixed(2)}B` : `${(w / 1e6).toFixed(0)}M`
  }
  return w >= 1e7 ? `${(w / 1e7).toFixed(1)} Cr` : `${(w / 1e5).toFixed(1)} L`
}

function adriColor(v) {
  return v > 55 ? '#f43f5e' : v > 28 ? '#f59e0b' : '#10b981'
}

function adriBadge(v) {
  return v > 55
    ? 'bg-rose-900/50 text-rose-300 border border-rose-700/50'
    : v > 28
      ? 'bg-amber-900/50 text-amber-300 border border-amber-700/50'
      : 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50'
}

function riskLabel(v) {
  return v > 55 ? 'HIGH' : v > 28 ? 'MOD' : 'LOW'
}

// ── SVG: Donut chart ──────────────────────────────────────────────────────

function DonutChart({ high, mod, low }) {
  const total = high + mod + low
  if (!total) return <div className="text-slate-600 text-[11px] text-center">No data</div>

  const cx = 50, cy = 50, ro = 40, ri = 24

  function arc(a0, a1) {
    if (Math.abs(a1 - a0) < 0.001) return ''
    const lg = (a1 - a0) > Math.PI ? 1 : 0
    const cos0 = Math.cos(a0), sin0 = Math.sin(a0)
    const cos1 = Math.cos(a1), sin1 = Math.sin(a1)
    return [
      `M ${cx + ro * cos0} ${cy + ro * sin0}`,
      `A ${ro} ${ro} 0 ${lg} 1 ${cx + ro * cos1} ${cy + ro * sin1}`,
      `L ${cx + ri * cos1} ${cy + ri * sin1}`,
      `A ${ri} ${ri} 0 ${lg} 0 ${cx + ri * cos0} ${cy + ri * sin0}`,
      'Z'
    ].join(' ')
  }

  const s  = -Math.PI / 2
  const aH = s + 2 * Math.PI * (high / total)
  const aM = aH + 2 * Math.PI * (mod  / total)

  const highPct = ((high / total) * 100).toFixed(1)

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {high > 0 && <path d={arc(s,  aH)} fill="#f43f5e" opacity="0.9" />}
      {mod  > 0 && <path d={arc(aH, aM)} fill="#f59e0b" opacity="0.9" />}
      {low  > 0 && <path d={arc(aM, s + Math.PI * 2)} fill="#10b981" opacity="0.85" />}
      <text x={cx} y={cy - 5} textAnchor="middle" fill="#f43f5e"
        fontSize="13" fontWeight="bold" fontFamily="system-ui">{highPct}%</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="#94a3b8"
        fontSize="6.5" fontFamily="system-ui">HIGH risk</text>
    </svg>
  )
}

// ── SVG: Timeline line chart ──────────────────────────────────────────────

function TimelineChart({ tl, year, region }) {
  const W = 500, H = 130
  const PL = 46, PR = 18, PT = 18, PB = 26
  const pw = W - PL - PR
  const ph = H - PT - PB

  const maxVal = Math.max(...tl.map(d => Math.max(d.high, d.mod))) * 1.2 || 1

  function xOf(yr) { return PL + pw * (yr - 1950) / 100 }
  function yOf(v)  { return H - PB - ph * (v / maxVal) }

  function polyPts(arr) { return arr.map(d => `${xOf(d.year).toFixed(1)},${yOf(d.val).toFixed(1)}`).join(' ') }

  const highArr = tl.map(d => ({ year: d.year, val: d.high }))
  const modArr  = tl.map(d => ({ year: d.year, val: d.mod  }))

  const highLine = polyPts(highArr)
  const modLine  = polyPts(modArr)

  const baseline = yOf(0).toFixed(1)
  const x0 = xOf(1950).toFixed(1), xN = xOf(2050).toFixed(1)

  const highArea = `${x0},${baseline} ${highLine} ${xN},${baseline}`
  const modArea  = `${x0},${baseline} ${modLine}  ${xN},${baseline}`

  const xNow = xOf(year)

  const yTicks = [0, 0.25, 0.5, 0.75, 1.0].map(t => {
    const v = maxVal * t
    return {
      y:     yOf(v),
      label: region === 'world'
        ? `${Math.round(v / 1e6)}M`
        : `${(v / 1e7).toFixed(0)}Cr`,
    }
  })

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      {/* Grid lines */}
      {yTicks.map(({ y, label }, i) => (
        <g key={i}>
          <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#1e293b" strokeWidth="0.5" />
          <text x={PL - 4} y={y + 3} textAnchor="end" fill="#475569"
            fontSize="7" fontFamily="system-ui">{label}</text>
        </g>
      ))}

      {/* MOD area + line */}
      <polygon points={modArea}  fill="#f59e0b" opacity="0.12" />
      <polyline points={modLine} fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.55" />

      {/* HIGH area + line */}
      <polygon points={highArea}  fill="#f43f5e" opacity="0.22" />
      <polyline points={highLine} fill="none" stroke="#f43f5e" strokeWidth="2.2" />

      {/* Year marker */}
      <line x1={xNow} y1={PT - 4} x2={xNow} y2={H - PB}
        stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.85" />
      <text x={xNow + 3} y={PT + 4} fill="#a78bfa"
        fontSize="7" fontWeight="bold" fontFamily="system-ui">{year}</text>

      {/* X axis */}
      <line x1={PL} y1={H - PB} x2={W - PR} y2={H - PB} stroke="#334155" strokeWidth="1" />
      {[1950, 1970, 1990, 2010, 2025, 2035, 2050].map(yr => (
        <text key={yr} x={xOf(yr)} y={H - PB + 10} textAnchor="middle"
          fill="#475569" fontSize="7" fontFamily="system-ui">{yr}</text>
      ))}

      {/* Legend */}
      <rect x={PL + 2} y={PT - 10} width="8" height="4" rx="1" fill="#f43f5e" opacity="0.9" />
      <text x={PL + 14} y={PT - 6} fill="#94a3b8" fontSize="7" fontFamily="system-ui">HIGH risk</text>
      <rect x={PL + 66} y={PT - 10} width="8" height="4" rx="1" fill="#f59e0b" opacity="0.8" />
      <text x={PL + 78} y={PT - 6} fill="#94a3b8" fontSize="7" fontFamily="system-ui">MODERATE risk</text>
    </svg>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, accent }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/40 flex flex-col gap-1">
      <div className="text-[22px] font-black tabular-nums leading-none" style={{ color: accent }}>{value}</div>
      <div className="text-slate-300 text-[11px] font-semibold">{label}</div>
      {sub && <div className="text-slate-500 text-[10px]">{sub}</div>}
    </div>
  )
}

function SectorBar({ name, avgAdri, occ, rank }) {
  const color = adriColor(avgAdri)
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-slate-600 text-[10px] w-4 text-right shrink-0">{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-slate-300 text-[11px] truncate">{name}</span>
          <span className="font-bold tabular-nums text-[11px] shrink-0 ml-2"
            style={{ color }}>{avgAdri}</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${avgAdri}%`, background: color }} />
        </div>
      </div>
      <span className="text-slate-600 text-[10px] shrink-0">{occ}j</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────

export default function AnalyticsDashboard({ data, year, region, onSelect }) {
  const dist    = useMemo(() => buildRiskDist(data, year, region),   [data, year, region])
  const tl      = useMemo(() => buildTimeline(data, region),         [data, region])
  const sectors = useMemo(() => buildTopSectors(data, year, region), [data, year, region])
  const topOccs = useMemo(() => buildTopOccs(data, year, region),    [data, year, region])

  const wf      = (totalWorkforceAtYear(region, year) ?? (dist.high + dist.mod + dist.low)) || 1
  const highPct = ((dist.high / wf) * 100).toFixed(1)
  const modPct  = ((dist.mod  / wf) * 100).toFixed(1)

  const tl2035 = tl.find(d => d.year === 2035)
  const tl2050 = tl.find(d => d.year === 2050)
  const tlNow  = tl.find(d => d.year === 2025) ?? tl.find(d => d.year === year)

  const mult2035 = tlNow?.high > 0 && tl2035 ? (tl2035.high / tlNow.high).toFixed(1) : null

  const totalOccs = data.sectors.reduce((n, s) => n + s.occupations.length, 0)

  return (
    <div className="h-full overflow-y-auto detail-panel-scroll px-5 py-5 space-y-5 view-fade">

      {/* ── Title row ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-white font-black text-xl leading-tight">AI Displacement Analytics</h2>
          <p className="text-slate-400 text-[12px] mt-0.5">
            {region === 'world' ? 'Global workforce' : region === 'states' ? 'Indian states' : 'India'}
            {' '}· Year {year} snapshot
          </p>
        </div>
        <div className="text-right text-[11px] text-slate-500 leading-relaxed">
          <div>{totalOccs} occupations analysed</div>
          <div>{data.sectors.length} sectors · ADRI model</div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="HIGH-Risk Workers"
          value={fmtW(dist.high, region)}
          sub={`${highPct}% of workforce`}
          accent="#f43f5e"
        />
        <KpiCard
          label="MODERATE-Risk Workers"
          value={fmtW(dist.mod, region)}
          sub={`${modPct}% of workforce`}
          accent="#f59e0b"
        />
        <KpiCard
          label="HIGH-Risk Occupations"
          value={dist.highC}
          sub={`of ${dist.highC + dist.modC + dist.lowC} mapped`}
          accent="#f43f5e"
        />
        <KpiCard
          label={`HIGH by 2035`}
          value={tl2035 ? fmtW(tl2035.high, region) : '—'}
          sub={mult2035 ? `×${mult2035} growth from 2025` : ''}
          accent="#a78bfa"
        />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* Donut — 1 col */}
        <div className="bg-slate-800/40 rounded-xl border border-slate-700/40 p-4">
          <h3 className="text-slate-200 text-[12px] font-bold mb-3">Risk Distribution · {year}</h3>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 shrink-0">
              <DonutChart high={dist.high} mod={dist.mod} low={dist.low} />
            </div>
            <div className="space-y-2.5 text-[11px] flex-1 min-w-0">
              {[
                { label: 'HIGH',     color: '#f43f5e', dot: 'bg-rose-500',    w: dist.high, c: dist.highC },
                { label: 'MODERATE', color: '#f59e0b', dot: 'bg-amber-500',   w: dist.mod,  c: dist.modC  },
                { label: 'LOW',      color: '#10b981', dot: 'bg-emerald-500', w: dist.low,  c: dist.lowC  },
              ].map(({ label, color, dot, w, c }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                  <span className="text-slate-400 w-14 shrink-0">{label}</span>
                  <span className="font-bold tabular-nums ml-auto" style={{ color }}>{fmtW(w, region)}</span>
                  <span className="text-slate-600 shrink-0">·{c}</span>
                </div>
              ))}
              <div className="pt-1 border-t border-slate-700/50 text-slate-500 tabular-nums">
                Total: {fmtW(wf, region)}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline — 2 cols */}
        <div className="bg-slate-800/40 rounded-xl border border-slate-700/40 p-4 lg:col-span-2">
          <h3 className="text-slate-200 text-[12px] font-bold mb-2">Workers at Risk · 1950 – 2050</h3>
          <TimelineChart tl={tl} year={year} region={region} />
          <div className="flex flex-wrap gap-4 mt-1.5 text-[10px] text-slate-500">
            {[
              { yr: 2025, d: tlNow,  c: 'text-rose-400' },
              { yr: 2035, d: tl2035, c: 'text-amber-400' },
              { yr: 2050, d: tl2050, c: 'text-violet-400' },
            ].filter(x => x.d).map(({ yr, d, c }) => (
              <span key={yr}>
                <span className={`font-bold ${c}`}>{yr}:</span>{' '}
                {fmtW(d.high, region)} HIGH · {fmtW(d.mod, region)} MOD
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 pb-4">

        {/* Sector ADRI bars */}
        <div className="bg-slate-800/40 rounded-xl border border-slate-700/40 p-4">
          <h3 className="text-slate-200 text-[12px] font-bold mb-3">
            Sectors by Avg. ADRI · {year}
          </h3>
          <div className="space-y-2.5">
            {sectors.map((s, i) => (
              <SectorBar key={s.name} rank={i + 1} name={s.name} avgAdri={s.avgAdri} occ={s.occ} />
            ))}
          </div>
        </div>

        {/* Top at-risk occupations */}
        <div className="bg-slate-800/40 rounded-xl border border-slate-700/40 p-4">
          <h3 className="text-slate-200 text-[12px] font-bold mb-3">
            Most At-Risk Occupations · {year}
          </h3>
          <div className="space-y-1">
            {topOccs.map((o, i) => (
              <button
                key={o.name + i}
                onClick={() => onSelect?.({ sector: o.sec, occupation: o.occ })}
                className="w-full flex items-center gap-2 text-left px-2 py-1.5 rounded-lg hover:bg-slate-700/50 transition-colors group"
              >
                <span className="text-slate-600 text-[10px] w-4 text-right shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-200 text-[11px] truncate group-hover:text-white transition-colors">
                    {o.name}
                  </div>
                  <div className="text-slate-500 text-[10px] truncate">{o.sector}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold tabular-nums ${adriBadge(o.adri)}`}>
                    {o.adri}
                  </span>
                  <span className="text-slate-600 text-[10px] w-12 text-right tabular-nums">
                    {fmtW(o.workers, region)}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <p className="text-slate-600 text-[10px] mt-3 pl-2">
            Click any row to open the full detail panel. ADRI = AI × Digital Intensity ÷ 100.
          </p>
        </div>
      </div>

    </div>
  )
}
