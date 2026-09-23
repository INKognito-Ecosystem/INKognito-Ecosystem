import { useEffect, useState } from 'react'
import { Truck, CheckCircle2, AlertTriangle } from 'lucide-react'
import { ZONAS_FLETE } from '../../data/colombiaGeo'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
// Exportados (2026-09-22) — MisComprasPanel.jsx los reusa para el lado
// comprador, mismos colores/etiquetas que ya ve la tienda del lado vendedor.
export const ESTADO_LABEL = { asignado: 'Asignado', recogido: 'Recogido', entregado: 'Entregado' }
export const ESTADO_CLASE = { asignado: 'bg-amber-100 text-amber-700', recogido: 'bg-blue-100 text-blue-700', entregado: 'bg-green-100 text-green-700' }

// "Mis envíos" — generalizado (2026-09-20, Suple multitenant) de
// MisEnviosTiendaSection.jsx (Store) para servir también a Suple: mismo
// criterio que MisVentasVendorSection.jsx — el backend sigue siendo
// familia propia por módulo, esta pantalla no tiene ninguna rama de
// negocio distinta entre los dos. Un vendedor de Suple no está
// necesariamente en la zona de Ruta del Golfo — si su municipio no tiene
// transportadoras activas, el mensaje de "coordina directo" ya lo cubre
// sin necesitar ningún caso especial acá.
const ENVIOS_PENDIENTES_ENDPOINT = {
  store: 'estudios-envios-pendientes-por-token',
  suplementos: 'estudios-envios-pendientes-suple-por-token',
}
const ENVIOS_ASIGNAR_ENDPOINT = {
  store: 'estudios-envios-asignar-por-token',
  suplementos: 'estudios-envios-asignar-suple-por-token',
}
// Reasignar (2026-09-22, Jose: "si una transportadora no recoje, la tienda
// debería poder reasignar a otra") — un solo endpoint para ambos módulos,
// a diferencia de pendientes/asignar de arriba: opera sobre un envío que YA
// existe (guarda su propio compra_tipo), no hace falta duplicarlo por
// módulo — ver POST /api/estudios-envios-reasignar-por-token en el panel.
const ENVIOS_REASIGNAR_ENDPOINT = 'estudios-envios-reasignar-por-token'

function formatFechaHora(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
}

export default function MisEnviosVendorSection({ token, module = 'store', enCoberturaRuta }) {
  const [pendientes, setPendientes] = useState(null)
  const [enCamino, setEnCamino] = useState([])
  const [municipioTienda, setMunicipioTienda] = useState(null)
  const [zonaFiltro, setZonaFiltro] = useState('')
  const [transportadoras, setTransportadoras] = useState([])
  const [asignando, setAsignando] = useState(null)
  const [reasignarAbierto, setReasignarAbierto] = useState(null)
  const [reasignando, setReasignando] = useState(null)
  const [error, setError] = useState(null)

  const endpointPendientes = ENVIOS_PENDIENTES_ENDPOINT[module] || ENVIOS_PENDIENTES_ENDPOINT.store
  const endpointAsignar = ENVIOS_ASIGNAR_ENDPOINT[module] || ENVIOS_ASIGNAR_ENDPOINT.store

  const cargar = () => {
    fetch(`${PANEL_URL}/api/${endpointPendientes}?token=${encodeURIComponent(token)}`)
      .then((r) => r.ok ? r.json() : { pendientes: [], enCamino: [], municipioTienda: null })
      .then((data) => {
        setPendientes(data.pendientes || [])
        setEnCamino(data.enCamino || [])
        setMunicipioTienda(data.municipioTienda || null)
      })
      .catch(() => setPendientes([]))
  }

  useEffect(cargar, [token, module])

  useEffect(() => {
    if (!municipioTienda || zonaFiltro) return
    const zona = municipioTienda.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '')
    if (ZONAS_FLETE[zona]) setZonaFiltro(zona)
  }, [municipioTienda, zonaFiltro])

  useEffect(() => {
    if (!zonaFiltro) { setTransportadoras([]); return }
    fetch(`${PANEL_URL}/api/transportadoras?municipio=${encodeURIComponent(zonaFiltro)}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setTransportadoras)
      .catch(() => setTransportadoras([]))
  }, [zonaFiltro])

  const asignar = async (compraId, transportadoraId) => {
    setError(null)
    setAsignando(compraId)
    try {
      const res = await fetch(`${PANEL_URL}/api/${endpointAsignar}`, {
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

  const reasignar = async (envioId, transportadoraId) => {
    setError(null)
    setReasignando(envioId)
    try {
      const res = await fetch(`${PANEL_URL}/api/${ENVIOS_REASIGNAR_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, envio_id: envioId, transportadora_id: transportadoraId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '')
      setReasignarAbierto(null)
      cargar()
    } catch (err) {
      setError(err.message || 'No pudimos reasignar la transportadora — intenta de nuevo.')
    } finally {
      setReasignando(null)
    }
  }

  if (pendientes === null) return <p className="text-gray-400 text-xs text-center py-4">Cargando...</p>

  return (
    <div>
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        Compras aprobadas listas para recoger — elige con qué transportadora de Ruta del Golfo la vas a enviar.
      </p>

      {/* Estado de cobertura permanente (2026-09-22, Jose: "eso debería
          verse desde antes, no a mitad de un pedido") — antes solo
          aparecía el aviso de abajo, y solo si ya había un pedido
          pendiente por asignar. Este usa en_cobertura_ruta (calculado
          server-side sobre el municipio real de la tienda, ver
          GET /api/estudios-por-token), no el dropdown de zona de abajo —
          es más preciso porque no depende de que el municipio de la
          tienda esté entre las 10 opciones fijas de ZONAS_FLETE. */}
      {typeof enCoberturaRuta === 'boolean' && (
        <div className={`mb-4 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-xs ${
          enCoberturaRuta ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'
        }`}>
          {enCoberturaRuta
            ? <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" />
            : <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />}
          <p className="leading-relaxed">
            {enCoberturaRuta
              ? 'Tu zona está cubierta por Ruta del Golfo — puedes asignar transportadora a tus envíos.'
              : 'Todavía no hay ninguna transportadora activa en tu zona — coordina cada entrega directo con tus clientes.'}
          </p>
        </div>
      )}

      <div className="mb-4">
        <label className="text-[9px] font-bold uppercase tracking-wide text-gray-400 mb-1.5 block">Buscar transportadora en</label>
        <select
          value={zonaFiltro}
          onChange={(e) => setZonaFiltro(e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-500"
        >
          <option value="">Selecciona una zona...</option>
          {Object.entries(ZONAS_FLETE).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {zonaFiltro && !transportadoras.length && (
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
                    {asignando === c.id ? '...' : (
                      <span>
                        {t.nombre}
                        {t.municipio_base && <span className="font-normal text-gray-400"> · {ZONAS_FLETE[t.municipio_base] || t.municipio_base}</span>}
                      </span>
                    )}
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
                {/* Timestamps de cada paso (2026-09-22, fortalecer el rastreo) */}
                {(e.recogido_at || e.entregado_at) && (
                  <p className="text-gray-400 text-[10px] mt-1">
                    {e.recogido_at && <>Recogido {formatFechaHora(e.recogido_at)}</>}
                    {e.recogido_at && e.entregado_at && ' · '}
                    {e.entregado_at && <>Entregado {formatFechaHora(e.entregado_at)}</>}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-gray-100">
                  {e.transportadora_logo ? (
                    <img src={e.transportadora_logo} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <Truck size={14} className="text-gray-400 flex-shrink-0" />
                  )}
                  <span className="text-xs font-bold text-gray-700">
                    {e.transportadora_nombre}
                    {e.transportadora_municipio && <span className="font-normal text-gray-400"> · {ZONAS_FLETE[e.transportadora_municipio] || e.transportadora_municipio}</span>}
                  </span>
                </div>

                {/* Quién paga el flete (2026-09-23) — confirmación para que
                    veas que tu política se aplicó bien en este envío
                    puntual; la transportadora ve el mismo mensaje en su
                    panel. */}
                <p className="text-gray-400 text-[10px] mt-1.5">
                  {e.cobrar_flete_cliente
                    ? `El cliente paga $${Number(e.monto_flete).toLocaleString('es-CO')} de flete al recibir`
                    : `Tú le pagas $${Number(e.monto_flete).toLocaleString('es-CO')} a la transportadora al recoger — el cliente no paga flete`}
                </p>

                {/* Reasignar (2026-09-22) — solo tiene sentido mientras la
                    transportadora no ha actuado todavía. */}
                {e.estado === 'asignado' && (
                  <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                    {reasignarAbierto === e.envio_id ? (
                      <>
                        <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">Reasignar a</p>
                        <div className="flex flex-wrap gap-2">
                          {transportadoras.filter((t) => t.id !== e.transportadora_id).map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => reasignar(e.envio_id, t.id)}
                              disabled={reasignando === e.envio_id}
                              className="flex items-center gap-1.5 pl-1.5 pr-3 py-1.5 rounded-full border border-gray-300 hover:border-gray-500 text-xs font-bold text-gray-700 transition-colors disabled:opacity-60"
                            >
                              {t.logo_url ? (
                                <img src={t.logo_url} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                              ) : (
                                <Truck size={14} className="text-gray-400 flex-shrink-0" />
                              )}
                              {reasignando === e.envio_id ? '...' : t.nombre}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setReasignarAbierto(null)}
                            className="text-xs font-bold text-gray-400 px-2 py-1.5"
                          >
                            Cancelar
                          </button>
                        </div>
                        {!transportadoras.length && (
                          <p className="text-gray-400 text-[11px]">Elige una zona arriba para ver otras transportadoras.</p>
                        )}
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setReasignarAbierto(e.envio_id)}
                        className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
                      >
                        ¿No ha recogido? Reasignar transportadora →
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
