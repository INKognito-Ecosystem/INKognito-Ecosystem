import { useState } from 'react'
import { X, ExternalLink, ChevronLeft, Pencil, ShoppingBag, Wallet, ChevronRight, Copy, Check } from 'lucide-react'
import EditarPerfilTiendaSection from './EditarPerfilTiendaSection'
import MisVentasTiendaSection from './MisVentasTiendaSection'
import MisProductosTiendaSection from './MisProductosTiendaSection'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const SITE_URL = import.meta.env.VITE_SITE_URL
const MP_BLUE = '#3483FA'
const MP_LOGO_URL = 'https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/5.21.0/mercadopago/logo__large@2x.png'
const labelClass = 'text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block'

const OPCIONES = [
  { key: 'perfil', label: 'Editar mi perfil', icon: Pencil },
  { key: 'productos', label: 'Mis productos en Store', icon: ShoppingBag },
  { key: 'ventas', label: 'Mis ventas', icon: Wallet },
]

const TITULOS = { perfil: 'Editar mi perfil', productos: 'Mis productos en Store', ventas: 'Mis ventas' }

// Panel de gestión de la tienda (Store multitenant, 2026-08-30) — lo que
// abre el botón hamburguesa que solo ve el dueño en EstudioTiendaPage.jsx.
// Reemplaza el dashboard viejo (EstudioEditarPerfilPage.jsx) SOLO para
// tiendas. v2 (2026-08-30, Jose: "el botón no debería abrir de una vez
// la edición, mis productos en Store debería verse aparte") — antes
// abría directo el formulario de perfil con todo lo demás apilado
// debajo; ahora abre primero un menú (mismo espíritu que el overlay de
// NavbarArtistas.jsx), cada opción es su propia pantalla con botón
// "← Volver". Mercado Pago se queda en el menú mismo (es solo un
// estado + un botón, no amerita su propia pantalla).
export default function EstudioTiendaOwnerPanel({ estudio, token, cloud_name, upload_preset, mpStatus, onClose, onEstudioUpdate }) {
  const [vista, setVista] = useState('menu')
  const [copiado, setCopiado] = useState(false)

  // Link para clientes (2026-08-30, Jose: "no tiene forma de ver el link
  // que deberá compartir para que las personas no vean ese botón") — la
  // única URL a la que el dueño tiene acceso naturalmente es la SUYA
  // (con su ?token= en la barra del navegador); si la copia y comparte
  // tal cual, un cliente que la abra vería este mismo panel de gestión.
  // Este botón arma la versión limpia, sin token, para compartir.
  const linkPublico = `${SITE_URL}/store/estudio/${estudio.id}`
  const copiarLinkPublico = async () => {
    try {
      await navigator.clipboard.writeText(linkPublico)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1500)
    } catch {}
  }

  // "Mis productos en Store" (2026-08-30, Jose) — es una tabla, se ve
  // apretada en el ancho angosto del drawer normal; en PC ocupa toda la
  // pantalla en vez del bloque a la derecha. El resto (menú/perfil/
  // ventas, todo listas simples) se queda con el drawer angosto de
  // siempre.
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
            {vista === 'menu' ? 'Panel de tu tienda' : TITULOS[vista]}
          </p>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-gray-400 hover:text-gray-700 flex-shrink-0"><X size={20} /></button>
        </div>

        {vista === 'menu' && (
          <div className="space-y-4">
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

            <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
              {OPCIONES.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setVista(key)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
                >
                  <Icon size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="flex-1 text-sm font-bold text-gray-900">{label}</span>
                  <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                </button>
              ))}
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
                <p className="text-gray-400 text-[10px] mt-1.5">Sin esto conectado, nadie puede pagarte por tus productos de Store — la plata te llega directo a tu cuenta, sin pasar por INKognito.</p>
              )}
              {mpStatus === 'ok' && <p className="text-green-600 text-[11px] font-bold mt-1.5">¡Mercado Pago conectado!</p>}
              {mpStatus === 'error' && <p className="text-red-600 text-[11px] font-bold mt-1.5">No pudimos conectar tu cuenta — intenta de nuevo.</p>}
            </div>
          </div>
        )}

        {vista === 'perfil' && (
          <EditarPerfilTiendaSection
            token={token}
            estudio={estudio}
            cloud_name={cloud_name}
            upload_preset={upload_preset}
            onSaved={onEstudioUpdate}
          />
        )}

        {vista === 'productos' && (
          <MisProductosTiendaSection token={token} cloud_name={cloud_name} upload_preset={upload_preset} estudioId={estudio.id} />
        )}

        {vista === 'ventas' && (
          <MisVentasTiendaSection token={token} />
        )}
      </div>
    </div>
  )
}
