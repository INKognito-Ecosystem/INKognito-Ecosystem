import { useEffect, useState } from 'react'
import { Truck } from 'lucide-react'
import { ZONAS_FLETE } from '../../data/colombiaGeo'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const BTN = '#374151'
const ESTADO_LABEL = { asignado: 'Asignado', recogido: 'Recogido', entregado: 'Entregado' }
const ESTADO_CLASE = { asignado: 'bg-amber-100 text-amber-700', recogido: 'bg-blue-100 text-blue-700', entregado: 'bg-green-100 text-green-700' }

// "Mis envíos" — "Ruta del Golfo" (2026-08-30). 4ta opción del panel de
// la dueña, junto a perfil/productos/ventas. Dos secciones:
// - Pendientes: compras aprobadas sin transportadora — elegir una asigna
//   directo (chip con logo, 2026-08-30, Jose: "cuando el dueño de la
//   tienda busque, deberían mostrarse la transportadora, con su logo").
// - En camino: seguimiento de lo ya asignado (2026-08-30, Jose: "no
//   desaparezca la card hasta que la transportadora marque el estado
//   como entregado") — de solo lectura, la transportadora es quien avanza
//   el estado desde su propio panel.
export default function MisEnviosTiendaSection({ token }) {
  const [pendientes, setPendientes] = useState(null)
  const [enCamino, setEnCamino] = useState([])
  const [municipioTienda, setMunicipioTienda] = useState(null)
  const [transportadoras, setTransportadoras] = useState([])
  const [asignando, setAsignando] = useState(null)
  const [error, setError] = useState(null)

  const cargar = () => {
    fetch(`${PANEL_URL}/api/estudios-envios-pendientes-por-token?token=${encodeURIComponent(token)}`)
      .then((r) => r.ok ? r.json() : { pendientes: [], enCamino: [], municipioTienda: null })
      .then((data) => {
        setPendientes(data.pendientes || [])
        setEnCamino(data.enCamino || [])
        setMunicipioTienda(data.municipioTienda || null)
      })
      .catch(() => setPendientes([]))
  }

  useEffect(cargar, [token])

  useEffect(() => {
    if (!municipioTienda) return
    // Zona de origen de la recogida es el municipio propio de la tienda
    // (normalizado a las claves de flete_tabla) — mismo criterio que
    // valida el servidor en /api/estudios-envios-asignar-por-token.
    const zona = municipioTienda.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '')
    fetch(`${PANEL_URL}/api/transportadoras?municipio=${encodeURIComponent(zona)}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setTransportadoras)
      .catch(() => setTransportadoras([]))
  }, [municipioTienda])

  const asignar = async (compraId, transportadoraId) => {
    setError(null)
    setAsignando(compraId)
    try {
      const res = await fetch(`${PANEL_URL}/api/estudios-envios-asignar-por-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, compra_id: compraId, transportadora_id: transportadoraId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '')
      cargar()
    } catch (err) {
      setError(err.message || 'No pudimos asignar la transportadora — intenta de nuevo.')
    } finally {
      setAsignando(null)
    }
  }

  if (pendientes === null) return <p className="text-gray-400 text-xs text-center py-4">Cargando...</p>

  return (
    <div>
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        Compras aprobadas listas para recoger — elige con qué transportadora de Ruta del Golfo la vas a enviar.
      </p>

      {!transportadoras.length && pendientes.length > 0 && (
        <p className="text-amber-600 text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
          Todavía no hay transportadoras activas en tu zona — coordina la entrega directo con el cliente mientras tanto.
        </p>
      )}
      {error && <p className="text-red-600 text-xs mb-3">{error}</p>}

      {pendientes.length === 0 ? (
        <p className="text-gray-400 text-xs text-center py-6">No tienes compras pendientes de envío.</p>
      ) : (
        <div className="space-y-3">
          {pendientes.map((c) => (
            <div key={c.id} className="border border-gray-200 rounded-xl p-4">
              <p className="font-black text-sm">{c.cliente_nombre || 'Cliente'}</p>
              <p className="text-gray-500 text-xs mt-0.5">{c.cliente_direccion || 'Sin dirección registrada'}, {ZONAS_FLETE[c.cliente_municipio] || c.cliente_municipio}</p>
              <p className="text-gray-400 text-[10px] uppercase tracking-wide mb-3">
                {c.cliente_telefono} · ${Number(c.monto_total).toLocaleString('es-CO')}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">Elige transportadora</p>
              <div className="flex flex-wrap gap-2">
                {transportadoras.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => asignar(c.id, t.id)}
                    disabled={asignando === c.id}
                    className="flex items-center gap-1.5 pl-1.5 pr-3 py-1.5 rounded-full border border-gray-300 hover:border-gray-500 text-xs font-bold text-gray-700 transition-colors disabled:opacity-60"
                  >
                    {t.logo_url ? (
                      <img src={t.logo_url} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <Truck size={14} className="text-gray-400 flex-shrink-0" />
                    )}
                    {asignando === c.id ? '...' : t.nombre}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {enCamino.length > 0 && (
        <div className="mt-6 pt-5 border-t border-gray-200">
          <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400 mb-2.5">En camino</p>
          <div className="space-y-3">
            {enCamino.map((e) => (
              <div key={e.envio_id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-black text-sm">{e.cliente_nombre || 'Cliente'}</p>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full flex-shrink-0 ${ESTADO_CLASE[e.estado]}`}>{ESTADO_LABEL[e.estado]}</span>
                </div>
                <p className="text-gray-500 text-xs">{e.cliente_direccion || 'Sin dirección'}, {ZONAS_FLETE[e.cliente_municipio] || e.cliente_municipio}</p>
                <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-gray-100">
                  {e.transportadora_logo ? (
                    <img src={e.transportadora_logo} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <Truck size={14} className="text-gray-400 flex-shrink-0" />
                  )}
                  <span className="text-xs font-bold text-gray-700">{e.transportadora_nombre}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
