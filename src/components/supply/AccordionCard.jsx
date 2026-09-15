import { useState } from 'react'

// light (2026-09-15, piloto de Jose en Cartuchos) — default false para no
// tocar los demás consumidores (Store, MisVentasSupplySection, SupplyFAQ).
export default function AccordionCard({ icon, title, subtitle, children, light = false }) {
  const [open, setOpen] = useState(false)
  const border = light ? 'border-zinc-200' : 'border-zinc-800'
  const bg = light ? 'bg-white' : 'bg-zinc-950'
  const hoverBg = light ? 'hover:bg-zinc-50' : 'hover:bg-zinc-900'
  const text = light ? 'text-zinc-900' : 'text-white'
  const textMuted = light ? 'text-zinc-500' : 'text-zinc-500'
  return (
    <div className={`border ${border} ${bg} rounded-2xl overflow-hidden`}>
      {/* Header — siempre visible, toca para abrir/cerrar */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full px-6 py-5 flex items-center justify-between text-left ${hoverBg} transition-colors duration-150`}
      >
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xl flex-shrink-0">{icon}</span>
            <span className={`font-black uppercase ${text} tracking-[0.08em] text-sm`}>{title}</span>
          </div>
          <p className={`${textMuted} text-xs leading-relaxed pl-8`}>{subtitle}</p>
        </div>
        <span
          className={`${textMuted} text-xs flex-shrink-0 transition-transform duration-200`}
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ▶
        </span>
      </button>

      {/* Contenido — scroll interno, solo visible cuando está abierto */}
      {open && (
        <div className={`border-t ${border} overflow-y-auto`} style={{ maxHeight: '340px' }}>
          <div className="px-6 py-5">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
