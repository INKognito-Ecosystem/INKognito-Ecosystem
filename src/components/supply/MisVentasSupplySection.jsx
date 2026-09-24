import { useEffect, useState } from 'react'
import { Wallet, ChevronDown } from 'lucide-react'

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
export default function MisVentasSupplySection({ token, standalone = false }) {
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
    return (
      <div className="space-y-2">
        {lista.map((v) => (
          <div key={v.id} className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs">
            <div className="min-w-0">
              <p className="font-bold truncate">{v.items.map((i) => `${i.cantidad}x ${i.product_nombre}`).join(', ')}</p>
              <p className="text-gray-400">{v.cliente_nombre || 'Cliente'} · {new Date(v.created_at).toLocaleDateString('es-CO')}</p>
              {/* Info completa del comprador (2026-09-23, Jose: "así no
                  dependerán solo del correo") — Supply pide dirección
                  desde hoy mismo (ver PedidoSupplyVendorCheckout.jsx). */}
              <p className="text-gray-400 truncate">{v.cliente_telefono}{v.cliente_email ? ` · ${v.cliente_email}` : ''}</p>
              {v.cliente_direccion && (
                <p className="text-gray-400 truncate">{v.cliente_direccion}, {v.cliente_municipio}</p>
              )}
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="font-black">${Number(v.monto_estudio).toLocaleString('es-CO')}</p>
              <p className={
                v.estado === 'aprobado' ? 'text-green-600 font-bold' : v.estado === 'rechazado' ? 'text-gray-400' : 'text-amber-600 font-bold'
              }>
                {v.estado === 'aprobado' ? 'Pagado' : v.estado === 'rechazado' ? 'Rechazado' : 'Pendiente'}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
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
        <div className="px-4 pb-5 space-y-2">
          {lista.map((v) => (
            <div key={v.id} className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs">
              <div className="min-w-0">
                <p className="font-bold truncate">{v.items.map((i) => `${i.cantidad}x ${i.product_nombre}`).join(', ')}</p>
                <p className="text-gray-400">{v.cliente_nombre || 'Cliente'} · {new Date(v.created_at).toLocaleDateString('es-CO')}</p>
                <p className="text-gray-400 truncate">{v.cliente_telefono}{v.cliente_email ? ` · ${v.cliente_email}` : ''}</p>
                {v.cliente_direccion && (
                  <p className="text-gray-400 truncate">{v.cliente_direccion}, {v.cliente_municipio}</p>
                )}
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="font-black">${Number(v.monto_estudio).toLocaleString('es-CO')}</p>
                <p className={
                  v.estado === 'aprobado' ? 'text-green-600 font-bold' : v.estado === 'rechazado' ? 'text-gray-400' : 'text-amber-600 font-bold'
                }>
                  {v.estado === 'aprobado' ? 'Pagado' : v.estado === 'rechazado' ? 'Rechazado' : 'Pendiente'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
