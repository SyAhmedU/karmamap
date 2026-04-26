import { LAYERS } from '../App.jsx'

const ICONS = {
  growth:    '📈',
  salary:    '💰',
  education: '🎓',
  ai:        '🤖',
}

export default function LayerPicker({ layer, onLayer, currency }) {
  return (
    <div className="flex items-center gap-2 px-5 py-2 border-b border-slate-800 bg-[#0f172a] shrink-0">
      <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mr-1">Colour by</span>
      {LAYERS.map(l => {
        const active = l.id === layer
        const unit = l.id === 'salary' ? (currency === 'usd' ? '$/mo' : '₹/mo') : l.unit
        return (
          <button
            key={l.id}
            onClick={() => onLayer(l.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
              active
                ? 'bg-white text-slate-900 shadow-lg'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span>{ICONS[l.id]}</span>
            {l.label}
            <span className={`text-[10px] ${active ? 'text-slate-500' : 'text-slate-600'}`}>{unit}</span>
          </button>
        )
      })}
    </div>
  )
}
