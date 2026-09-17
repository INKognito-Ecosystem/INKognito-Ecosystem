import { useMemo, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { MapPin, ShieldCheck, Search } from 'lucide-react'
import NavbarCategoryStore from './NavbarCategoryStore'
import StoreMobileNav from './StoreMobileNav'
import FooterStore from './FooterStore'
import { cloudinaryFill } from '../../lib/cloudinary'
import logoStore from '../../assets/milogo/store.webp'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Directorio de tiendas (Store multitenant, 2026-08-29) — deja que
// alguien verifique por su cuenta, sin depender de un link que la propia
// tienda mandó, que una tienda es real: consultarla acá es un camino
// independiente al de la insignia en su propio perfil.
export async function loader() {
  try {
    const res = await fetch(`${PANEL_URL}/api/estudios-tiendas`)
    return { tiendas: res.ok ? await res.json() : [] }
  } catch {
    return { tiendas: [] }
  }
}

export function meta() {
  const title = 'Tiendas verificadas | INKognito Store'
  const description = 'Directorio de tiendas de ropa y calzado registradas en INKognito Store, en Urabá.'
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/store/tiendas` },
  ]
}

// Sin tildes/mayúsculas — mismo criterio de búsqueda insensible a acentos
// usado en Supply (SupplyCategoryPage.jsx / SupplyProveedoresPage.jsx).
const normaliza = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// Mismo "Ver más" que el directorio de proveedores de Supply — no
// renderizar todas las tiendas de una si el directorio crece.
const PAGE_SIZE = 12

export default function TiendasDirectorioPage() {
  const { tiendas } = useLoaderData()
  const [busqueda, setBusqueda] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const tiendasFiltradas = useMemo(() => {
    if (!busqueda.trim()) return tiendas
    const q = normaliza(busqueda)
    return tiendas.filter(t => normaliza(t.nombre_tienda).includes(q) || normaliza(t.municipio).includes(q))
  }, [tiendas, busqueda])

  const handleBusqueda = (e) => { setBusqueda(e.target.value); setVisibleCount(PAGE_SIZE) }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar fijo — solo escritorio. En móvil ya no es fixed (2026-09-16,
          mismo criterio que las 8 páginas de categoría): lo reemplaza la
          barra compacta de abajo, con el buscador viviendo en el navbar
          superior en vez de flotando en el cuerpo de la página. */}
      <div className="hidden md:block">
        <NavbarCategoryStore pageName="Tiendas verificadas" hideMobileActions />
      </div>

      <div className="md:hidden sticky top-0 z-40 flex items-center gap-2 px-4 py-2 bg-white border-b border-zinc-200">
        <Link to="/store" aria-label="Volver a Store" className="flex-shrink-0">
          <img src={logoStore} alt="INKognito Store" className="w-12 h-12 object-contain" />
        </Link>
        <div className="relative flex-1 min-w-0">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={busqueda}
            onChange={handleBusqueda}
            placeholder="Buscar por nombre o ciudad"
            className="w-full min-w-0 bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs rounded-lg pl-8 pr-2 py-2 placeholder:text-zinc-500 focus:outline-none focus:border-[#C9A84C]"
          />
        </div>
      </div>

      <div className="bg-gray-50 pt-0 md:pt-24 pb-4 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-xs mb-2">INKognito Store</p>
          <h1 className="text-2xl md:text-4xl font-black uppercase leading-tight mb-3 text-gray-900">Tiendas verificadas</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
            Ropa y calzado de tiendas reales de Urabá, registradas en INKognito Store.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 pb-10 md:pb-14">
        {tiendas.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">Todavía no hay tiendas registradas.</p>
        ) : (
          <>
            {/* Buscador — solo escritorio (en móvil ya vive en la barra
                superior compacta, mismo criterio que las categorías). */}
            <div className="hidden md:block relative max-w-sm mx-auto mt-4 mb-6">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={busqueda}
                onChange={handleBusqueda}
                placeholder="Buscar por nombre o ciudad"
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg pl-9 pr-3 py-2.5 placeholder:text-gray-400 focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
            {tiendasFiltradas.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-10">Ninguna tienda coincide con "{busqueda}".</p>
            ) : (
              <>
                <div className="max-w-xl mx-auto flex flex-col divide-y divide-gray-100 border-t border-b border-gray-100">
                  {tiendasFiltradas.slice(0, visibleCount).map((t) => (
                    <Link
                      key={t.id}
                      to={`/store/${t.slug || `estudio/${t.id}`}`}
                      className="flex items-center gap-3 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center">
                        {t.logo_url
                          ? <img src={cloudinaryFill(t.logo_url, 100, 100)} alt={t.nombre_tienda} className="w-full h-full object-cover" loading="lazy" />
                          : <span className="text-gray-400 text-sm font-black">{t.nombre_tienda?.[0]?.toUpperCase() || '?'}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black uppercase text-sm text-gray-900 truncate flex items-center gap-1.5">
                          {t.nombre_tienda}
                          <ShieldCheck size={12} className="text-green-600 flex-shrink-0" />
                        </p>
                        {t.municipio && (
                          <p className="text-gray-500 text-xs flex items-center gap-1 truncate mt-0.5">
                            <MapPin size={10} className="flex-shrink-0" />
                            {t.municipio}{t.departamento ? `, ${t.departamento}` : ''}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                {visibleCount < tiendasFiltradas.length && (
                  <div className="flex justify-center mt-6">
                    <button
                      type="button"
                      onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                      className="px-6 py-2.5 border border-[#C9A84C]/50 text-[#C9A84C] text-xs font-bold uppercase tracking-[0.15em] rounded hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all duration-300"
                    >
                      Ver más ({tiendasFiltradas.length - visibleCount} más)
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        <div className="mt-12 text-center border-t border-gray-200 pt-8">
          <p className="text-gray-500 text-sm mb-3">¿Tienes una tienda de ropa o calzado en Urabá?</p>
          <Link
            to="/tattoo-artist-colombia/tienda/unete"
            className="inline-block px-6 py-3 text-white font-bold uppercase tracking-[0.15em] text-xs rounded hover:brightness-90 transition"
            style={{ backgroundColor: '#C9A84C' }}
          >
            Registrar mi tienda
          </Link>
        </div>
      </div>

      <FooterStore />

      {/* Espacio para que el tab bar fijo de StoreMobileNav no tape el
          footer (2026-09-16, mismo ajuste ya hecho en las páginas de
          categoría) — el navbar de arriba ya no muestra carrito/menú en
          móvil (hideMobileActions), ahora viven acá. */}
      <div className="h-16 md:hidden bg-white" />

      <StoreMobileNav active={null} />
    </div>
  )
}
