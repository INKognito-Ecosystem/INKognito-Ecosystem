import { useEffect, useState } from 'react'
import { Wallet, ChevronDown } from 'lucide-react'
import VentasTable from '../pedido/VentasTable'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const BTN = '#374151'

// "Mis ventas" (fase 5, 2026-08-07) — solo lectura, lo que ya pagaron los
// clientes vía Mercado Pago Split directo a la cuenta del estudio/empresa.
// La fuente de verdad real es el webhook del panel; acá solo se muestra
// lo que ya quedó confirmado como aprobado o quedó pendiente/rechazado.
// v2 (2026-08-07, Jose: "un botón que notifica... como los botones
// acordeón ya implementados") — mismo patrón toggle de AccordionCard.jsx
// (usado en las páginas de categoría de Supply). La insignia con el
// conteo funciona como la "notificación" — cerrado por defecto, no hace
// falta abrir para saber si hay ventas.
// Extraído (2026-09-12) de EstudioEditarPerfilPage.jsx a su propio
// archivo — mismo criterio que MisVentasTiendaSection.jsx en Store: se
// reutiliza tal cual dentro de EstudioSupplyOwnerPanel.jsx.
// `standalone` (2026-09-12) — cuando este componente ES el contenido
// completo de una pantalla dedicada (la vista "ventas" del panel, con su
// propio título en el header), el acordeón propio (título+chevron) sobra
// y el caso sin ventas no puede devolver null (una pantalla en blanco se
// ve rota, a diferencia del acordeón dentro de una página larga, donde
// "no aparece nada" es una opción válida).
export default function MisVentasSupplySection({ token, standalone = false, vendorNombre }) {
  const [ventas, setVentas] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch(`${PANEL_URL}/api/estudios-ventas-supply-por-token?token=${encodeURIComponent(token)}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setVentas)
      .catch(() => setVentas([]))
  }, [token])

  if (!standalone && (!ventas || ventas.length === 0)) return null

  const lista = ventas || []

  if (standalone) {
    if (lista.length === 0) {
      return <p className="text-gray-400 text-xs text-center py-6">Todavía no tienes ventas.</p>
    }
    return <VentasTable ventas={lista} module="supply" vendorNombre={vendorNombre} />
  }

  return (
    <div className="mb-2 -mx-4 md:mx-0 bg-gray-50 border-y md:border border-gray-200 md:rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-4 flex items-center justify-between gap-2 text-left hover:bg-gray-100 transition-colors"
      >
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          <Wallet size={12} />
          Mis ventas
          <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-white text-[10px] font-black" style={{ backgroundColor: BTN }}>
            {lista.length}
          </span>
        </span>
        <ChevronDown size={16} className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-5">
          <VentasTable ventas={lista} module="supply" vendorNombre={vendorNombre} />
        </div>
      )}
    </div>
  )
}
