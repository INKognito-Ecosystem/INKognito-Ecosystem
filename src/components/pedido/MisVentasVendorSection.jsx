import { useEffect, useState } from 'react'
import { ZONAS_FLETE } from '../../data/colombiaGeo'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// "Mis ventas" — generalizado (2026-09-20, Suple multitenant) de
// MisVentasTiendaSection.jsx (Store) para servir también a Suple: el
// backend sigue siendo familia propia por módulo (estudios_compras_tienda
// vs estudios_compras_suple, cada uno con su propio endpoint), pero esta
// pantalla es visualmente idéntica sin ninguna rama de negocio distinta —
// mismo criterio que COMPRAR_ENDPOINT en PedidoSupplyVendorCheckout.jsx.
const VENTAS_ENDPOINT = {
  store: 'estudios-ventas-tienda-por-token',
  suplementos: 'estudios-ventas-suple-por-token',
}

export default function MisVentasVendorSection({ token, module = 'store' }) {
  const [ventas, setVentas] = useState(null)

  useEffect(() => {
    const endpoint = VENTAS_ENDPOINT[module] || VENTAS_ENDPOINT.store
    fetch(`${PANEL_URL}/api/${endpoint}?token=${encodeURIComponent(token)}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setVentas)
      .catch(() => setVentas([]))
  }, [token, module])

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
            <p className="text-gray-400">{v.cliente_nombre || 'Cliente'} · {new Date(v.created_at).toLocaleDateString('es-CO')}</p>
            {/* Info completa del comprador (2026-09-23, Jose: "toda la
                info necesaria, desde lo que se vendió hasta la info del
                comprador... así no dependerán solo del correo") — antes
                esta card no traía ni teléfono visible ni correo ni
                dirección. */}
            <p className="text-gray-400 truncate">{v.cliente_telefono}{v.cliente_email ? ` · ${v.cliente_email}` : ''}</p>
            {v.cliente_direccion && (
              // Store guarda el municipio como clave corta (ZONAS_FLETE,
              // ej. "chigorodo") — Suple guarda el nombre real de una vez
              // (nacional). El mapa cubre el caso de Store y no le hace
              // nada al de Suple (una clave que no calza en ZONAS_FLETE
              // se muestra tal cual).
              <p className="text-gray-400 truncate">{v.cliente_direccion}, {ZONAS_FLETE[v.cliente_municipio] || v.cliente_municipio}</p>
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
