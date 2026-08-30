import { useEffect, useState } from 'react'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// "Mis ventas" (Store multitenant) — relocada 2026-08-30 al fusionar
// perfil+catálogo, mismo motivo/patrón que MisProductosTiendaSection.jsx.
// Sin acordeón propio (mismo criterio: ahora vive en su propia pantalla
// dentro de EstudioTiendaOwnerPanel.jsx, la navegación del panel ya
// decide cuándo se muestra). Antes, sin ventas, no mostraba nada (return
// null) — tenía sentido cuando compartía scroll con otras secciones,
// pero acá sería una pantalla completamente vacía; ahora muestra un
// mensaje.
export default function MisVentasTiendaSection({ token }) {
  const [ventas, setVentas] = useState(null)

  useEffect(() => {
    fetch(`${PANEL_URL}/api/estudios-ventas-tienda-por-token?token=${encodeURIComponent(token)}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setVentas)
      .catch(() => setVentas([]))
  }, [token])

  if (ventas === null) {
    return <p className="text-gray-400 text-xs text-center py-6">Cargando...</p>
  }

  if (ventas.length === 0) {
    return <p className="text-gray-400 text-xs text-center py-6">Todavía no tienes ventas.</p>
  }

  return (
    <div className="space-y-2">
      {ventas.map((v) => (
        <div key={v.id} className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs">
          <div className="min-w-0">
            <p className="font-bold truncate">{v.items.map((i) => `${i.cantidad}x ${i.product_nombre}`).join(', ')}</p>
            <p className="text-gray-400">{v.cliente_nombre || v.cliente_telefono} · {new Date(v.created_at).toLocaleDateString('es-CO')}</p>
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
