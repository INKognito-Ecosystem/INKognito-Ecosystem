import { useState } from 'react'

// Versión clara (paleta blanca/dorada de Store) del mismo AccordionCard
// que ya usa Supply (src/components/supply/AccordionCard.jsx) — mismo
// comportamiento (un solo toggle para toda la sección), solo cambia el tema.
export default function AccordionCardStore({ icon, title, subtitle, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 bg-white rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-150"
      >
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xl flex-shrink-0">{icon}</span>
            <span className="font-black uppercase text-gray-900 tracking-[0.08em] text-sm">{title}</span>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed pl-8">{subtitle}</p>
        </div>
        <span
          className="text-gray-400 text-xs flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ▶
        </span>
      </button>

      {open && (
        <div className="border-t border-gray-200 overflow-y-auto" style={{ maxHeight: '340px' }}>
          <div className="px-6 py-5">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
