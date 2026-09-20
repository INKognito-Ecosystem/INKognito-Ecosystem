import { useEffect, useState } from 'react'
import { X, ExternalLink, ChevronLeft, Pencil, ShoppingBag, Wallet, ChevronRight, Copy, Check, Truck } from 'lucide-react'
import EditarPerfilSupleSection from './EditarPerfilSupleSection'
import MisVentasVendorSection from '../pedido/MisVentasVendorSection'
import MisProductosSupleSection from './MisProductosSupleSection'
import MisEnviosVendorSection from '../pedido/MisEnviosVendorSection'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const SITE_URL = import.meta.env.VITE_SITE_URL
const MP_BLUE = '#3483FA'
const MP_LOGO_URL = 'https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/5.21.0/mercadopago/logo__large@2x.png'
const labelClass = 'text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block'

const OPCIONES = [
  { key: 'perfil', label: 'Editar mi perfil', icon: Pencil },
  { key: 'productos', label: 'Mis productos en Suple', icon: ShoppingBag },
  { key: 'ventas', label: 'Mis ventas', icon: Wallet },
  { key: 'envios', label: 'Mis envíos', icon: Truck },
]

const TITULOS = { perfil: 'Editar mi perfil', productos: 'Mis productos en Suple', ventas: 'Mis ventas', envios: 'Mis envíos' }

// Panel de gestión del vendedor (Suple multitenant, 2026-09-20) — calco
// exacto de EstudioTiendaOwnerPanel.jsx (Store): lo que abre el botón
// hamburguesa/campana que solo ve el dueño en EstudioSuplePage.jsx.
export default function EstudioSupleOwnerPanel({ estudio, token, cloud_name, upload_preset, mpStatus, notif, onNotifVista, onClose, onEstudioUpdate }) {
  const [vista, setVista] = useState(() => {
    const hayVentas = (notif?.ventas_nuevas || 0) > 0
    const hayEnvios = (notif?.envios_actualizados || 0) > 0
    if (hayVentas && !hayEnvios) return 'ventas'
    if (hayEnvios && !hayVentas) return 'envios'
    return 'menu'
  })
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    if (vista === 'ventas' || vista === 'envios') onNotifVista?.(vista)
  }, [vista])

  const linkPublico = `${SITE_URL}/suplementos/${estudio.slug || `estudio/${estudio.id}`}`
  const copiarLinkPublico = async () => {
    try {
      await navigator.clipboard.writeText(linkPublico)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1500)
    } catch {}
  }

  const anchoCompleto = vista === 'productos'

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 flex items-stretch justify-end" onClick={onClose}>
      <div
        className={`bg-white w-full h-full overflow-y-auto p-4 sm:p-6 ${anchoCompleto ? '' : 'sm:max-w-md'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-5 sticky top-0 bg-white pt-1 pb-2 -mx-1 px-1 z-10">
          {vista !== 'menu' ? (
            <button type="button" onClick={() => setVista('menu')} aria-label="Volver" className="text-gray-400 hover:text-gray-700 flex-shrink-0">
              <ChevronLeft size={20} />
            </button>
          ) : (
            <span className="w-5 flex-shrink-0" />
          )}
          <p className="flex-1 text-sm font-black uppercase tracking-widest text-gray-900">
            {vista === 'menu' ? 'Panel de tu catálogo' : TITULOS[vista]}
          </p>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-gray-400 hover:text-gray-700 flex-shrink-0"><X size={20} /></button>
        </div>

        {vista === 'menu' && (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
              {OPCIONES.map(({ key, label, icon: Icon }) => {
                const conteoNotif = key === 'ventas' ? notif?.ventas_nuevas : key === 'envios' ? notif?.envios_actualizados : 0
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setVista(key)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Icon size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="flex-1 text-sm font-bold text-gray-900">{label}</span>
                    {conteoNotif > 0 && (
                      <span className="min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-black leading-none flex-shrink-0">
                        {conteoNotif > 9 ? '9+' : conteoNotif}
                      </span>
                    )}
                    <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                  </button>
                )
              })}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <label className={labelClass}>Mercado Pago</label>
              {estudio.mp_conectado ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border" style={{ borderColor: MP_BLUE }}>
                  <img src={MP_LOGO_URL} alt="Mercado Pago" className="h-4" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: MP_BLUE }}>Conectado</span>
                </span>
              ) : (
                <a
                  href={`${PANEL_URL}/api/estudios-mp-conectar?token=${encodeURIComponent(token)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-[11px] font-black uppercase tracking-widest shadow-md hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: MP_BLUE }}
                >
                  Conecta Mercado Pago <ExternalLink size={12} />
                </a>
              )}
              {!estudio.mp_conectado && (
                <p className="text-gray-400 text-[10px] mt-1.5">Sin esto conectado, nadie puede pagarte por tus productos de Suple — la plata te llega directo a tu cuenta, sin pasar por INKognito.</p>
              )}
              {mpStatus === 'ok' && <p className="text-green-600 text-[11px] font-bold mt-1.5">¡Mercado Pago conectado!</p>}
              {mpStatus === 'error' && <p className="text-red-600 text-[11px] font-bold mt-1.5">No pudimos conectar tu cuenta — intenta de nuevo.</p>}
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <label className={labelClass}>Link para tus clientes</label>
              <p className="text-gray-500 text-[11px] mb-2.5">Comparte este — nunca el que usas tú para entrar aquí.</p>
              <button
                type="button"
                onClick={copiarLinkPublico}
                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-white border border-amber-300 text-left hover:border-amber-400 transition-colors"
              >
                <span className="text-xs font-mono text-gray-700 truncate">{linkPublico}</span>
                {copiado ? <Check size={16} className="text-green-600 flex-shrink-0" /> : <Copy size={16} className="text-amber-600 flex-shrink-0" />}
              </button>
            </div>
          </div>
        )}

        {vista === 'perfil' && (
          <EditarPerfilSupleSection
            token={token}
            estudio={estudio}
            cloud_name={cloud_name}
            upload_preset={upload_preset}
            onSaved={onEstudioUpdate}
          />
        )}

        {vista === 'productos' && (
          <MisProductosSupleSection token={token} cloud_name={cloud_name} upload_preset={upload_preset} estudioId={estudio.id} estudioSlug={estudio.slug} />
        )}

        {vista === 'ventas' && (
          <MisVentasVendorSection token={token} module="suplementos" />
        )}

        {vista === 'envios' && (
          <MisEnviosVendorSection token={token} module="suplementos" />
        )}
      </div>
    </div>
  )
}
