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
// uppercase (2026-09-15, Jose: menú móvil de Supply en minúscula, tipografía
// tipo Mercado Libre) — default true para no tocar los demás navbars que ya
// usan este componente en mayúsculas; el menú nuevo de Supply pasa
// uppercase={false} + su propio textSize (el tamaño default text-xs/11px es
// el de los navbars viejos, muy chico para el menú de pantalla completa).
// icon (2026-09-15, Jose: "en el botón hamburguesa, a sus nombres
// agrégales su ícono correspondiente, antes del nombre") — componente de
// ícono opcional, default null para no afectar los demás navbars.
export default function InkognitoModuleMenu({ current, textClassName, onNavigate, only, label = 'INKognito', extraLinks = [], uppercase = true, textSize, icon: Icon = null }) {
  const [open, setOpen] = useState(false)
  const others = only ? MODULES.filter(m => only.includes(m.key)) : MODULES.filter(m => m.key !== current)
  const caseClass = uppercase ? 'uppercase tracking-[0.2em]' : 'tracking-normal'
  const mainSize = textSize || 'text-xs'
  const subSize = textSize || 'text-[11px]'

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex items-center justify-between w-full px-6 py-4 ${caseClass} ${mainSize} transition-all duration-300 ${textClassName}`}
      >
        <span className="flex items-center gap-3">
          {Icon && <Icon size={18} className="flex-shrink-0" />}
          {label}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && extraLinks.map(item => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={`block pl-10 pr-6 py-3 ${caseClass} ${subSize} transition-all duration-300 ${textClassName}`}
        >
          {item.label}
        </Link>
      ))}
      {open && others.map(m => (
        <Link
          key={m.key}
          to={m.path}
          onClick={onNavigate}
          className={`block pl-10 pr-6 py-3 ${caseClass} ${subSize} transition-all duration-300 ${textClassName}`}
        >
          {m.label}
        </Link>
      ))}
    </div>
  )
}
