import { useEffect, useState } from 'react'
import { Truck } from 'lucide-react'
import { ZONAS_FLETE } from '../../data/colombiaGeo'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const BTN = '#374151'

// "Mis envíos" — "Ruta del Golfo" (2026-08-30). 4ta opción del panel de
// la dueña, junto a perfil/productos/ventas: lista sus compras aprobadas
// que aún no tienen transportadora asignada, con un selector nativo (la
// lista de transportadoras por zona suele ser corta — no hace falta
// ComboboxBuscable, pensado para listas largas tipo municipios/marcas).
export default function MisEnviosTiendaSection({ token }) {
  const [pendientes, setPendientes] = useState(null)
  const [municipioTienda, setMunicipioTienda] = useState(null)
  const [transportadoras, setTransportadoras] = useState([])
  const [seleccion, setSeleccion] = useState({})
  const [asignando, setAsignando] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${PANEL_URL}/api/estudios-envios-pendientes-por-token?token=${encodeURIComponent(token)}`)
      .then((r) => r.ok ? r.json() : { pendientes: [], municipioTienda: null })
      .then((data) => {
        setPendientes(data.pendientes || [])
        setMunicipioTienda(data.municipioTienda || null)
      })
      .catch(() => setPendientes([]))
  }, [token])

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

  const asignar = async (compraId) => {
    const transportadora_id = seleccion[compraId]
    if (!transportadora_id) return
    setError(null)
    setAsignando(compraId)
    try {
      const res = await fetch(`${PANEL_URL}/api/estudios-envios-asignar-por-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, compra_id: compraId, transportadora_id: Number(transportadora_id) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '')
      setPendientes((prev) => prev.filter((c) => c.id !== compraId))
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
              <p className="text-gray-400 text-[10px] uppercase tracking-wide mb-2">
                {c.cliente_telefono} · {ZONAS_FLETE[c.cliente_municipio] || c.cliente_municipio} · ${Number(c.monto_total).toLocaleString('es-CO')}
              </p>
              <div className="flex gap-2">
                <select
                  className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
                  value={seleccion[c.id] || ''}
                  onChange={(e) => setSeleccion((s) => ({ ...s, [c.id]: e.target.value }))}
                  disabled={!transportadoras.length}
                >
                  <option value="">Elige transportadora...</option>
                  {transportadoras.map((t) => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => asignar(c.id)}
                  disabled={!seleccion[c.id] || asignando === c.id}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-60 flex-shrink-0"
                  style={{ backgroundColor: BTN }}
                >
                  <Truck size={14} />
                  {asignando === c.id ? '...' : 'Asignar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
