import { useEffect, useState } from 'react'
import { ArrowLeft, Package, Truck } from 'lucide-react'
import { leerMisCompras } from '../../lib/misCompras'
import BarraEstadoCompra from './BarraEstadoCompra'
import ModalDetalleEstadoCompra from './ModalDetalleEstadoCompra'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Etiqueta CORTA del módulo — a propósito distinta del nombre real de la
// tienda (2026-09-27, Jose: "no sé si el de arriba es el módulo y el de
// abajo el nombre de la tienda... veo que está repetido, dice INKognito
// Suple y abajo lo mismo"). El nombre real (`data.vendedor_nombre`) casi
// siempre COINCIDE con esta marca hoy (todavía no hay tiendas de terceros
// reales comprando de prueba) — por eso la etiqueta de módulo se muestra
// como tag chico ("Suple") y el nombre de la tienda como título en negrita,
// nunca los dos como texto igual de grande.
const MODULO_LABEL = { store: 'Store', suplementos: 'Suple', supply: 'Supply' }

function formatFecha(ms) {
  try { return new Date(ms).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return '' }
}

// "Mis compras" (2026-09-22, Jose) — rastreo sin cuenta, del lado
// COMPRADOR: nunca inicia sesión en ningún módulo, así que la lista sale de
// `leerMisCompras()` (localStorage, la guardó TiendaCompraResultadoPage.jsx/
// SupleCompraResultadoPage.jsx/SupplyCompraResultadoPage.jsx al volver de
// Mercado Pago), y el estado real se consulta en vivo por token contra
// GET /api/estudios-compra-seguimiento. Mismo patrón de drawer que
// CartDrawerStore.jsx, pero un solo tema claro para los 3 módulos — no es
// parte de la identidad visual de cada tienda, es una utilidad de cuenta.
//
// Nombre deliberadamente distinto a la pestaña "Pedidos" del panel admin
// (se elimina en la reforma de Tiendas Online → Ventas) — son dos cosas
// distintas (comprador vs. operación interna), mejor que ni el nombre se
// parezca.
export default function MisComprasPanel({ open, onClose }) {
  const [compras, setCompras] = useState([])
  const [detalle, setDetalle] = useState({})
  const [verMasKey, setVerMasKey] = useState(null)
  const [marcandoKey, setMarcandoKey] = useState(null)

  // Supply: el comprador confirma que ya recibió su pedido (mismo mecanismo
  // que SeguimientoCompraPage.jsx — ver POST /api/estudios-compra-marcar-recibido,
  // 2026-09-27). Acá también, porque Jose confirmó que la compra debe poder
  // verse y actuarse desde los dos lugares (el link de WhatsApp Y este panel).
  const marcarRecibido = async (c, key) => {
    setMarcandoKey(key)
    try {
      const res = await fetch(`${PANEL_URL}/api/estudios-compra-marcar-recibido`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compra_id: c.compraId, token: c.token, module: c.module }),
      })
      if (res.ok) setDetalle((prev) => ({ ...prev, [key]: { ...prev[key], recibido_at: new Date().toISOString() } }))
    } finally {
      setMarcandoKey(null)
    }
  }

  useEffect(() => {
    if (!open) return
    const lista = leerMisCompras()
    setCompras(lista)
    lista.forEach((c) => {
      const key = `${c.module}-${c.compraId}`
      fetch(`${PANEL_URL}/api/estudios-compra-seguimiento?compra_id=${encodeURIComponent(c.compraId)}&token=${encodeURIComponent(c.token)}&module=${encodeURIComponent(c.module)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => setDetalle((prev) => ({ ...prev, [key]: data })))
        .catch(() => setDetalle((prev) => ({ ...prev, [key]: null })))
    })
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full md:max-w-sm bg-white border-l border-zinc-200 z-[70] flex flex-col transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-200 flex-shrink-0">
          <button onClick={onClose} aria-label="Volver" className="text-zinc-400 hover:text-black transition-colors duration-200">
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-bold text-lg text-gray-900">Mis compras</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {compras.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-16 h-16 rounded-full border border-zinc-200 flex items-center justify-center">
                <Package size={24} className="text-zinc-300" />
              </div>
              <p className="text-zinc-400 text-sm">Todavía no tienes compras registradas en este navegador.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {compras.map((c) => {
                const key = `${c.module}-${c.compraId}`
                const data = detalle[key]
                return (
                  <li key={key} className="border border-zinc-200 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="inline-block px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-wide">
                        {MODULO_LABEL[c.module] || c.module}
                      </span>
                      <span className="text-zinc-400 text-[10px] flex-shrink-0">{formatFecha(c.fecha)}</span>
                    </div>

                    {data === undefined ? (
                      <p className="text-zinc-400 text-xs mt-1">Consultando...</p>
                    ) : !data ? (
                      <p className="text-zinc-400 text-xs mt-1">No pudimos consultar esta compra.</p>
                    ) : (
                      <>
                        <p className="font-black text-sm text-gray-900 mt-1 mb-3">{data.vendedor_nombre}</p>
                        <BarraEstadoCompra
                          estadoCompra={data.estado_compra}
                          envio={data.envio}
                          module={c.module}
                          recibidoConfirmado={!!data.recibido_at}
                        />
                        {data.envio?.transportadora_nombre && (
                          <p className="text-zinc-400 text-[11px] mt-2 flex items-center gap-1.5">
                            <Truck size={12} className="flex-shrink-0" /> {data.envio.transportadora_nombre}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            type="button"
                            onClick={() => setVerMasKey(key)}
                            className="text-xs font-bold text-zinc-500 hover:text-black transition-colors duration-200 underline"
                          >
                            Ver más
                          </button>
                          {c.module === 'supply' && data.estado_compra === 'aprobado' && !data.recibido_at && (
                            <button
                              type="button"
                              onClick={() => marcarRecibido(c, key)}
                              disabled={marcandoKey === key}
                              className="text-xs font-bold text-white bg-zinc-900 hover:bg-black transition-colors duration-200 rounded-full px-3 py-1 disabled:opacity-50"
                            >
                              {marcandoKey === key ? 'Guardando...' : 'Ya recibí mi pedido'}
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </aside>

      {verMasKey && (() => {
        const c = compras.find((x) => `${x.module}-${x.compraId}` === verMasKey)
        const data = detalle[verMasKey]
        if (!c || !data) return null
        return (
          <ModalDetalleEstadoCompra
            open
            onClose={() => setVerMasKey(null)}
            estadoCompra={data.estado_compra}
            envio={data.envio}
            module={c.module}
            recibidoConfirmado={!!data.recibido_at}
            vendorNombre={data.vendedor_nombre}
          />
        )
      })()}
    </>
  )
}
