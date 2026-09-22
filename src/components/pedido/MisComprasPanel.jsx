import { useEffect, useState } from 'react'
import { ArrowLeft, Package, Truck } from 'lucide-react'
import { leerMisCompras } from '../../lib/misCompras'
import { ESTADO_LABEL, ESTADO_CLASE } from './MisEnviosVendorSection'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

const ESTADO_COMPRA_LABEL = { aprobado: 'Pago aprobado', pendiente: 'Confirmando pago', rechazado: 'Pago rechazado' }
const ESTADO_COMPRA_CLASE = { aprobado: 'bg-green-100 text-green-700', pendiente: 'bg-amber-100 text-amber-700', rechazado: 'bg-red-100 text-red-700' }
const MODULO_LABEL = { store: 'INKognito Store', suplementos: 'INKognito Suple', supply: 'INKognito Supply' }

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
                      <p className="font-black text-sm text-gray-900">{MODULO_LABEL[c.module] || c.module}</p>
                      <span className="text-zinc-400 text-[10px] flex-shrink-0">{formatFecha(c.fecha)}</span>
                    </div>

                    {data === undefined ? (
                      <p className="text-zinc-400 text-xs">Consultando...</p>
                    ) : !data ? (
                      <p className="text-zinc-400 text-xs">No pudimos consultar esta compra.</p>
                    ) : (
                      <>
                        <p className="text-zinc-500 text-xs mb-2">{data.vendedor_nombre}</p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${ESTADO_COMPRA_CLASE[data.estado_compra] || 'bg-gray-100 text-gray-600'}`}>
                            {ESTADO_COMPRA_LABEL[data.estado_compra] || data.estado_compra}
                          </span>
                          {/* Solo Store/Suple llegan a tener envío de Ruta del
                              Golfo — Supply nunca tiene `envio` (ver
                              GET /api/estudios-compra-seguimiento). */}
                          {data.envio && (
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${ESTADO_CLASE[data.envio.estado] || 'bg-gray-100 text-gray-600'}`}>
                              Envío: {ESTADO_LABEL[data.envio.estado] || data.envio.estado}
                            </span>
                          )}
                        </div>
                        {data.envio?.transportadora_nombre && (
                          <p className="text-zinc-400 text-[11px] mt-2 flex items-center gap-1.5">
                            <Truck size={12} className="flex-shrink-0" /> {data.envio.transportadora_nombre}
                          </p>
                        )}
                      </>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </aside>
    </>
  )
}
