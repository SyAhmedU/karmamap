import { useState } from 'react'
import data from './data/india_jobs.json'
import Treemap from './components/Treemap.jsx'
import DetailPanel from './components/DetailPanel.jsx'
import LayerPicker from './components/LayerPicker.jsx'
import Legend from './components/Legend.jsx'
import LLMScorer from './components/LLMScorer.jsx'

export const LAYERS = [
  { id: 'growth',    label: 'Employment Growth',  unit: '%/yr',  desc: '5-year CAGR' },
  { id: 'salary',    label: 'Median Salary',       unit: '₹/mo', desc: 'Monthly median earnings' },
  { id: 'education', label: 'Education Required',  unit: 'years', desc: 'Formal education years' },
  { id: 'ai',        label: 'AI Exposure',         unit: '/100',  desc: 'Automation risk score (higher = more exposed)' },
]

export const EXCHANGE_RATE = data.meta.exchangeRate  // 84.5

export default function App() {
  const [layer, setLayer]       = useState('growth')
  const [currency, setCurrency] = useState('inr')  // 'inr' | 'usd'
  const [selected, setSelected] = useState(null)    // { sector, occupation }
  const [showLLM, setShowLLM]   = useState(false)

  const layerObj = LAYERS.find(l => l.id === layer)

  const salaryUnit = currency === 'usd' ? '$/mo' : '₹/mo'
  const displayLayer = { ...layerObj, unit: layer === 'salary' ? salaryUnit : layerObj.unit }

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] select-none">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center text-white font-black text-sm">K</div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none tracking-tight">KarmaMap</h1>
            <p className="text-slate-400 text-[11px] mt-0.5">India Job Market · {(data.meta.totalWorkforce / 1e6).toFixed(0)}M workers · {data.meta.primarySource.split(',')[0]}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Currency toggle — only relevant for salary layer */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setCurrency('inr')}
              className={`px-3 py-1 rounded text-[12px] font-bold transition-all ${currency === 'inr' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >₹ INR</button>
            <button
              onClick={() => setCurrency('usd')}
              className={`px-3 py-1 rounded text-[12px] font-bold transition-all ${currency === 'usd' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >$ USD</button>
          </div>

          <button
            onClick={() => setShowLLM(v => !v)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1.5 ${showLLM ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <span className="text-base leading-none">✦</span> Score a Job
          </button>
        </div>
      </header>

      {/* Layer picker */}
      <LayerPicker layer={layer} onLayer={setLayer} currency={currency} />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Treemap */}
        <div className="flex-1 relative overflow-hidden">
          <Treemap
            data={data}
            layer={layer}
            currency={currency}
            selected={selected}
            onSelect={setSelected}
          />
          <Legend layer={layer} currency={currency} data={data} />
        </div>

        {/* Side panels */}
        {(selected || showLLM) && (
          <div className="w-80 border-l border-slate-800 flex flex-col overflow-hidden shrink-0">
            {showLLM && (
              <LLMScorer currency={currency} onClose={() => setShowLLM(false)} />
            )}
            {selected && !showLLM && (
              <DetailPanel
                sector={selected.sector}
                occupation={selected.occupation}
                currency={currency}
                onClose={() => setSelected(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
