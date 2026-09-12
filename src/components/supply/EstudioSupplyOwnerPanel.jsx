import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Pencil, ShoppingBag, Copy, Check, ChevronRight } from 'lucide-react'

const SITE_URL = import.meta.env.VITE_SITE_URL
const labelClass = 'text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block'

// Panel de gestión del catálogo (2026-09-12, Jose: "como en las tiendas de
// Store, un botón hamburguesa que me dé el link que debo compartir").
// A diferencia de EstudioTiendaOwnerPanel.jsx (que SÍ duplica los
// formularios dentro del panel, porque para una tienda perfil y catálogo
// son la misma página), acá "Editar mi perfil" y "Supply" ya viven en
// /estudio/mi-perfil (EstudioEditarPerfilPage.jsx, con sus pestañas) —
// este panel no los reconstruye, solo los deja fáciles de encontrar desde
// el catálogo público, más el link para compartir (lo único que de
// verdad faltaba acá).
export default function EstudioSupplyOwnerPanel({ estudio, token, onClose }) {
  const [copiado, setCopiado] = useState(false)
  const linkPublico = `${SITE_URL}/supply/estudio/${estudio.id}`
  const copiarLinkPublico = async () => {
    try {
      await navigator.clipboard.writeText(linkPublico)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1500)
    } catch {}
  }

  const tokenQS = encodeURIComponent(token)

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 flex items-stretch justify-end" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md h-full overflow-y-auto p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 mb-5 sticky top-0 bg-white pt-1 pb-2 -mx-1 px-1 z-10">
          <p className="flex-1 text-sm font-black uppercase tracking-widest text-gray-900">Panel de tu catálogo</p>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-gray-400 hover:text-gray-700 flex-shrink-0"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            <Link
              to={`/tattoo-artist-colombia/estudio/mi-perfil?token=${tokenQS}&tab=perfil`}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
            >
              <Pencil size={16} className="text-gray-400 flex-shrink-0" />
              <span className="flex-1 text-sm font-bold text-gray-900">Editar mi perfil</span>
              <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
            </Link>
            <Link
              to={`/tattoo-artist-colombia/estudio/mi-perfil?token=${tokenQS}&tab=supply`}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
            >
              <ShoppingBag size={16} className="text-gray-400 flex-shrink-0" />
              <span className="flex-1 text-sm font-bold text-gray-900">Mis productos, ventas y Mercado Pago</span>
              <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
            </Link>
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
      </div>
    </div>
  )
}
