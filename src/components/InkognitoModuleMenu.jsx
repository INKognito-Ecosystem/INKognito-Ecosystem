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
// only (2026-08-06, Jose: "el INKognito que despliega los módulos, solo
// deja Supply, quita los demás" — pedido específico del navbar de
// artistas) — lista opcional de keys a mostrar; si no se pasa, se
// mantiene el comportamiento de siempre (todos menos el módulo actual),
// para no afectar los demás navbars que ya usan este componente.
// label (2026-08-06, Jose: "que su botón inicial no se llame INKognito
// sino que se llame 'Para artistas'" — mismo nombre que usa Tattoodo para
// esta misma categoría) — override opcional, default "INKognito" para no
// tocar los demás navbars.
// extraLinks (2026-08-06, Jose: "editar mi perfil no debería estar dentro
// de 'para artistas'? que quede arriba de supply") — items opcionales que
// se renderizan antes de los módulos, dentro del mismo desplegable. Vacío
// por default para no afectar los navbars que no lo pasan.
export default function InkognitoModuleMenu({ current, textClassName, onNavigate, only, label = 'INKognito', extraLinks = [] }) {
  const [open, setOpen] = useState(false)
  const others = only ? MODULES.filter(m => only.includes(m.key)) : MODULES.filter(m => m.key !== current)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex items-center justify-between w-full px-6 py-4 uppercase text-xs tracking-[0.2em] transition-all duration-300 ${textClassName}`}
      >
        <span>{label}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && extraLinks.map(item => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={`block pl-10 pr-6 py-3 uppercase text-[11px] tracking-[0.2em] transition-all duration-300 ${textClassName}`}
        >
          {item.label}
        </Link>
      ))}
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
