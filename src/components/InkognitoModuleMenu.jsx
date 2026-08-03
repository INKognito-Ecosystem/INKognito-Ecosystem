import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

const MODULES = [
  { key: 'supply', label: 'INKognito Supply', path: '/supply' },
  { key: 'store',  label: 'INKognito Store',  path: '/store' },
  { key: 'suple',  label: 'INKognito Suple',  path: '/suplementos' },
]

// Antes cada navbar repetía "INKognito Supply" / "INKognito Store" /
// "INKognito Gym" como 2-3 links sueltos en el dropdown — un solo botón
// "INKognito" que despliega las otras tiendas evita repetir la palabra
// tantas veces (2026-08-03, pedido de Jose). Gym queda fuera a propósito
// (solo supply/store/suple) — sigue accesible vía "Ecosistema", que cada
// navbar mantiene como link aparte.
export default function InkognitoModuleMenu({ current, textClassName, onNavigate }) {
  const [open, setOpen] = useState(false)
  const others = MODULES.filter(m => m.key !== current)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex items-center justify-between w-full px-6 py-4 uppercase text-xs tracking-[0.2em] transition-all duration-300 ${textClassName}`}
      >
        <span>INKognito</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && others.map(m => (
        <Link
          key={m.key}
          to={m.path}
          onClick={onNavigate}
          className={`block pl-10 pr-6 py-3 uppercase text-[11px] tracking-[0.2em] transition-all duration-300 ${textClassName}`}
        >
          {m.label}
        </Link>
      ))}
    </div>
  )
}
