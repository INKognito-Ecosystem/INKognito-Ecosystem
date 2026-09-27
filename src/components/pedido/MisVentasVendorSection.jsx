import { useEffect, useState } from 'react'
import { ZONAS_FLETE } from '../../data/colombiaGeo'
import VentasTable from './VentasTable'

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

export default function MisVentasVendorSection({ token, module = 'store', vendorNombre }) {
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

  // Store guarda el municipio como clave corta (ZONAS_FLETE, ej.
  // "chigorodo") — Suple guarda el nombre real de una vez (nacional). El
  // mapa cubre el caso de Store y no le hace nada al de Suple (una clave
  // que no calza en ZONAS_FLETE se muestra tal cual).
  return <VentasTable ventas={ventas} municipioLabel={(m) => ZONAS_FLETE[m] || m} module={module} vendorNombre={vendorNombre} />
}
