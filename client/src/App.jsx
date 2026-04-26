import { useState, useEffect, useRef } from 'react'
import indiaData  from './data/india_jobs.json'
import worldData  from './data/world_jobs.json'
import statesData from './data/india_states_jobs.json'
import Treemap     from './components/Treemap.jsx'
import DetailPanel from './components/DetailPanel.jsx'
import LayerPicker from './components/LayerPicker.jsx'
import Legend      from './components/Legend.jsx'
import LLMScorer   from './components/LLMScorer.jsx'
import YearSlider  from './components/YearSlider.jsx'
import TopFive     from './components/TopFive.jsx'
import RankingView from './components/RankingView.jsx'
import { totalWorkforceAtYear, occAtYear, TIMELINE_YEARS } from './utils/timeline.js'

export const LAYERS = [
  { id: 'growth',       label: 'Employment Growth',  unit: '%/yr',  desc: '5-year CAGR' },
  { id: 'salary',       label: 'Median Salary',       unit: '₹/mo', desc: 'Monthly median earnings' },
  { id: 'education',    label: 'Education Required',  unit: 'years', desc: 'Formal education years' },
  { id: 'ai',           label: 'AI Exposure',         unit: '/100',  desc: 'Automation risk score (higher = more exposed)' },
  { id: 'informality',  label: 'Informality',         unit: '%',     desc: '% workers in informal employment' },
  { id: 'gender',       label: 'Female Participation', unit: '% ♀', desc: '% female workers in this occupation' },
]

export const EXCHANGE_RATE = indiaData.meta.exchangeRate  // 84.5

function dataForRegion(r) {
  return r === 'world' ? worldData : r === 'states' ? statesData : indiaData
}

// ── URL hash state encoding ────────────────────────────────────────────────────

function parseHash() {
  try {
    const params = new URLSearchParams(window.location.hash.slice(1))
    const r = params.get('r')
    const l = params.get('l')
    const y = parseInt(params.get('y'), 10)
    const o = params.get('o')
    return {
      region: ['india','world','states'].includes(r)          ? r    : null,
      layer:  LAYERS.find(x => x.id === l)                   ? l    : null,
      year:   TIMELINE_YEARS.includes(y)                      ? y    : null,
      occId:  o || null,
    }
  } catch { return {} }
}

// ── CSV export ─────────────────────────────────────────────────────────────────

function exportCSV(data, year, region) {
  const headers = [
    'Occupation','Sector','Workers','Growth %','Salary INR','Salary USD',
    'AI Exposure','Education Yrs','Informality %','Female %','ISCO Code',
  ]
  const rows = data.sectors.flatMap(s =>
    s.occupations.map(o => {
      const oy = occAtYear(o, year, region)
      return [
        `"${o.name}"`,
        `"${s.name}"`,
        oy.workers ?? '',
        oy.growthPct ?? '',
        oy.medianSalaryINR ?? '',
        oy.medianSalaryUSD ?? '',
        oy.aiExposure ?? '',
        oy.educationYears ?? '',
        o.informalityPct ?? '',
        o.femalePct ?? '',
        o.iscoCode ?? '',
      ].join(',')
    })
  )
  const csv  = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), { href: url, download: `karmamap-${region}-${year}.csv` })
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ── App ────────────────────────────────────────────────────────────────────────

export default function App() {
  const [region,    setRegion]    = useState('india')
  const [layer,     setLayer]     = useState('growth')
  const [currency,  setCurrency]  = useState('inr')
  const [selected,  setSelected]  = useState(null)
  const [showLLM,   setShowLLM]   = useState(false)
  const [search,    setSearch]    = useState('')
  const [year,      setYear]      = useState(2025)
  const [viewMode,  setViewMode]  = useState('treemap')  // 'treemap' | 'table'

  const data             = dataForRegion(region)
  const effectiveCurrency = region === 'world' ? 'usd' : currency

  // Skip first URL-sync run (before hash hydration fires)
  const skipFirstSync = useRef(true)

  // Hydrate state from URL hash on mount
  useEffect(() => {
    const { region: r, layer: l, year: y, occId } = parseHash()
    if (r) { setRegion(r); if (r === 'world') setCurrency('usd') }
    if (l) setLayer(l)
    if (y) setYear(y)
    if (occId) {
      const d = dataForRegion(r || 'india')
      for (const s of d.sectors) {
        const o = s.occupations.find(occ => occ.id === occId)
        if (o) { setSelected({ sector: s, occupation: o }); break }
      }
    }
  }, [])  // eslint-disable-line

  // Sync URL hash on every meaningful state change
  useEffect(() => {
    if (skipFirstSync.current) { skipFirstSync.current = false; return }
    const params = new URLSearchParams()
    params.set('r', region)
    params.set('l', layer)
    params.set('y', String(year))
    if (selected) params.set('o', selected.occupation.id)
    window.location.hash = params.toString()
  }, [region, layer, year, selected])

  function handleRegion(r) {
    setRegion(r)
    setSelected(null)
    setSearch('')
    setCurrency(r === 'world' ? 'usd' : 'inr')
  }

  const wfAtYear   = totalWorkforceAtYear(region, year) ?? data.meta.totalWorkforce
  const totalLabel = region === 'world'
    ? `${(wfAtYear / 1e9).toFixed(2)}B workers`
    : `${(wfAtYear / 1e6).toFixed(0)}M workers`

  const panelOpen = selected || showLLM

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] select-none">

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center text-white font-black text-sm">S</div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none tracking-tight">Syed's India Jobs AI Impact</h1>
            <p className="text-slate-400 text-[11px] mt-0.5">
              {totalLabel} · {data.meta.primarySource.split(',')[0]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs…"
            className="bg-slate-800 text-slate-200 text-[12px] placeholder-slate-500 border border-slate-700 rounded-lg px-3 py-1.5 w-36 focus:outline-none focus:border-slate-500 select-text"
          />

          {/* Region toggle */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
            <button onClick={() => handleRegion('world')}
              className={`px-3 py-1 rounded text-[12px] font-bold transition-all ${region === 'world' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}>
              🌍 World
            </button>
            <button onClick={() => handleRegion('india')}
              className={`px-3 py-1 rounded text-[12px] font-bold transition-all ${region === 'india' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}>
              India
            </button>
            <button onClick={() => handleRegion('states')} title="Indian states & UTs"
              className={`px-3 py-1 rounded text-[12px] font-bold transition-all ${region === 'states' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              🗺️ States
            </button>
          </div>

          {/* Currency toggle — disabled when not on salary layer */}
          {(region === 'india' || region === 'states') && (
            <div
              className={`flex items-center gap-1 bg-slate-800 rounded-lg p-1 transition-opacity ${layer !== 'salary' ? 'opacity-40 pointer-events-none' : ''}`}
              title={layer !== 'salary' ? 'Currency only applies to Median Salary view' : undefined}
            >
              <button onClick={() => setCurrency('inr')}
                className={`px-3 py-1 rounded text-[12px] font-bold transition-all ${currency === 'inr' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}>
                ₹ INR
              </button>
              <button onClick={() => setCurrency('usd')}
                className={`px-3 py-1 rounded text-[12px] font-bold transition-all ${currency === 'usd' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}>
                $ USD
              </button>
            </div>
          )}

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
            <button onClick={() => setViewMode('treemap')}
              title="Treemap view"
              className={`px-2.5 py-1 rounded text-[12px] font-bold transition-all ${viewMode === 'treemap' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              ⊞
            </button>
            <button onClick={() => setViewMode('table')}
              title="Ranked list view"
              className={`px-2.5 py-1 rounded text-[12px] font-bold transition-all ${viewMode === 'table' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              ≡
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={() => exportCSV(data, year, region)}
            title="Download data as CSV"
            className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center gap-1.5"
          >
            <span className="text-[11px]">↓</span> CSV
          </button>

          {/* Score a Job */}
          <button
            onClick={() => setShowLLM(v => !v)}
            title="Estimate AI exposure and salary for any job title"
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1.5 ${showLLM ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <span className="text-base leading-none">✦</span> Score a Job
          </button>
        </div>
      </header>

      {/* ── Layer picker ── */}
      <LayerPicker layer={layer} onLayer={setLayer} currency={effectiveCurrency} />

      {/* ── Legend bar ── */}
      <Legend layer={layer} currency={effectiveCurrency} region={region} />

      {/* ── Year slider ── */}
      <YearSlider year={year} onYear={setYear} />

      {/* ── Main content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Map / Table area */}
        <div key={region} className="flex-1 relative overflow-hidden view-fade">
          {viewMode === 'treemap' ? (
            <>
              <Treemap
                data={data}
                layer={layer}
                currency={effectiveCurrency}
                selected={selected}
                onSelect={setSelected}
                search={search}
                year={year}
                region={region}
              />
              {/* Top 5 overlay — only in treemap mode */}
              <TopFive
                data={data}
                layer={layer}
                year={year}
                region={region}
                currency={effectiveCurrency}
                onSelect={setSelected}
              />
            </>
          ) : (
            <RankingView
              data={data}
              layer={layer}
              year={year}
              region={region}
              currency={effectiveCurrency}
              search={search}
              selected={selected}
              onSelect={setSelected}
            />
          )}
        </div>

        {/* Side panel */}
        {panelOpen && (
          <div className="w-80 border-l border-slate-800 flex flex-col overflow-hidden shrink-0">
            {showLLM && (
              <LLMScorer currency={effectiveCurrency} onClose={() => setShowLLM(false)} />
            )}
            {selected && !showLLM && (
              <DetailPanel
                sector={selected.sector}
                occupation={selected.occupation}
                currency={effectiveCurrency}
                region={region}
                year={year}
                onClose={() => setSelected(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
