import { LAYERS } from '../App.jsx'

const ICONS = {
  growth:      '📈',
  salary:      '💰',
  education:   '🎓',
  ai:          '🤖',
  digital:     '💻',
  informality: '🏗️',
  gender:      '⚧',
}

const COLORS = {
  growth:      'bg-emerald-600 text-white',
  salary:      'bg-sky-600 text-white',
  education:   'bg-violet-600 text-white',
  ai:          'bg-rose-600 text-white',
  digital:     'bg-cyan-600 text-white',
  informality: 'bg-orange-700 text-white',
  gender:      'bg-fuchsia-700 text-white',
}

export default function LayerPicker({ layer, onLayer, currency }) {
  return (
    <div className="flex items-center gap-2 px-5 py-2 border-b border-slate-800 bg-[#0f172a] shrink-0 overflow-x-auto">
      <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mr-1 shrink-0">View by</span>
      {LAYERS.map(l => {
        const active = l.id === layer
        const unit = l.id === 'salary' ? (currency === 'usd' ? '$/mo' : '₹/mo') : l.unit
        return (
          <button
            key={l.id}
            onClick={() => onLayer(l.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all shrink-0 ${
              active ? COLORS[l.id] : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span className="text-[13px] leading-none">{ICONS[l.id]}</span>
            {l.label}
            <span className={`text-[10px] ${active ? 'opacity-70' : 'text-slate-600'}`}>{unit}</span>
          </button>
        )
      })}
    </div>
  )
}
