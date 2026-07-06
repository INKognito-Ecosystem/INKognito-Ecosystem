import { useState } from 'react'

export default function AccordionCard({ icon, title, subtitle, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-zinc-800 bg-zinc-950 rounded-2xl overflow-hidden">
      {/* Header — siempre visible, toca para abrir/cerrar */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-zinc-900 transition-colors duration-150"
      >
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xl flex-shrink-0">{icon}</span>
            <span className="font-black uppercase text-white tracking-[0.08em] text-sm">{title}</span>
          </div>
          <p className="text-zinc-500 text-xs leading-relaxed pl-8">{subtitle}</p>
        </div>
        <span
          className="text-zinc-500 text-xs flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ▶
        </span>
      </button>

      {/* Contenido — scroll interno, solo visible cuando está abierto */}
      {open && (
        <div className="border-t border-zinc-800 overflow-y-auto" style={{ maxHeight: '340px' }}>
          <div className="px-6 py-5">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
