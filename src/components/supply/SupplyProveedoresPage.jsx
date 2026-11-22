import { useMemo, useState } from 'react'
import { Link, useLoaderData } from 'react-router'
import { MapPin, ShieldCheck } from 'lucide-react'
import NavbarCategory from './NavbarCategory'
import FooterSupply from './FooterSupply'
import SupplyMobileNav from './SupplyMobileNav'
import { cloudinaryFill } from '../../lib/cloudinary'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

// Directorio público de proveedores de Supply (2026-09-12) — mismo
// propósito que store/tiendas (TiendasDirectorioPage.jsx): dejar que
// cualquiera verifique por su cuenta que un proveedor es real, sin
// depender de un link que el proveedor mismo mandó. A diferencia de
// BrandsSupply.jsx (marcas curadas a mano en el home), esto trae TODOS
// los proveedores con vende_supply activo, directo de la base de datos.
export async function loader() {
  try {
    const res = await fetch(`${PANEL_URL}/api/estudios-supply-directorio`)
    return { proveedores: res.ok ? await res.json() : [] }
  } catch {
    return { proveedores: [] }
  }
}

export function meta() {
  const title = 'Tiendas verificadas | INKognito Supply'
  const description = 'Directorio de tiendas y estudios verificados en INKognito Supply, en toda Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/proveedores` },
  ]
}

// Sin tildes/mayúsculas — mismo criterio de búsqueda insensible a acentos
// ya usado en el buscador de producto/proveedor de SupplyCategoryPage.jsx.
const normaliza = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

// Mismo "Cargar más" que SupplyCategoryPage.jsx — no renderizar todos los
// proveedores de una si el directorio crece.
const PAGE_SIZE = 12

export default function SupplyProveedoresPage() {
  const { proveedores } = useLoaderData()
  const [busqueda, setBusqueda] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const proveedoresFiltrados = useMemo(() => {
    if (!busqueda.trim()) return proveedores
    const q = normaliza(busqueda)
    return proveedores.filter(p => normaliza(p.nombre_supply).includes(q) || normaliza(p.municipio).includes(q))
  }, [proveedores, busqueda])

  const handleBusqueda = (v) => { setBusqueda(v); setVisibleCount(PAGE_SIZE) }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Tema blanco + buscador en el navbar (2026-09-15, Jose: "actualiza
          el fondo, los dos navbar, y que el buscador esté en el navbar
          superior") — mismo patrón ya usado en EstudioSupplyPage.jsx:
          hideWordmark porque no hay espacio para el wordmark + buscador a
          la vez, hideMobileActions porque carrito/menú migran al tab bar
          de abajo (SupplyMobileNav, nuevo acá — esta página antes no lo
          tenía). */}
      <NavbarCategory
        pageName="Tiendas verificadas"
        hideMobileActions
        light
        hideWordmark
        searchValue={busqueda}
        onSearchChange={handleBusqueda}
        searchPlaceholder="Buscar por nombre o ciudad"
        shareUrl={`${import.meta.env.VITE_SITE_URL}/supply/proveedores`}
      />

      <div className="relative overflow-hidden pt-20 md:pt-28 pb-4 px-6">
        <div className="absolute inset-0 opacity-[0.05]" style={DOT_PATTERN} />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <p className="uppercase tracking-[0.25em] text-blue-500 text-xs mb-2">INKognito Supply</p>
          <h1 className="text-2xl md:text-4xl font-black uppercase leading-tight mb-3 text-zinc-900">Tiendas verificadas</h1>
          <p className="text-zinc-600 text-sm max-w-md mx-auto leading-relaxed">
            Tiendas y estudios reales, verificados en INKognito Supply, en toda Colombia.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-6 md:pb-10">
        {proveedores.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-10">Todavía no hay tiendas registradas.</p>
        ) : proveedoresFiltrados.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-10">Ninguna tienda coincide con "{busqueda}".</p>
        ) : (
          <>
            {/* Lista compacta solo móvil */}
            <div className="md:hidden max-w-xl mx-auto flex flex-col divide-y divide-zinc-200 border-t border-b border-zinc-200 mt-4">
              {proveedoresFiltrados.slice(0, visibleCount).map((p) => (
                <Link
                  key={p.id}
                  to={`/supply/${p.slug || `estudio/${p.id}`}`}
                  className="flex items-center gap-3 py-3 hover:bg-zinc-50 transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                      {p.logo_url
                        ? <img src={cloudinaryFill(p.logo_url, 100, 100)} alt={p.nombre_supply} className="w-full h-full object-cover" loading="lazy" />
                        : <span className="text-zinc-400 text-sm font-black">{p.nombre_supply?.[0]?.toUpperCase() || '?'}</span>}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center">
                      <ShieldCheck size={10} className="text-blue-500" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black uppercase text-sm text-zinc-900 truncate">
                      {p.nombre_supply}
                    </p>
                    {p.municipio && (
                      <p className="text-zinc-500 text-xs flex items-center gap-1 truncate mt-0.5">
                        <MapPin size={10} className="flex-shrink-0" />
                        {p.municipio}{p.departamento ? `, ${p.departamento}` : ''}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-right pl-2">
                    <p className="text-blue-500 text-xs font-bold uppercase tracking-wide whitespace-nowrap">Ver tienda</p>
                    <p className="text-zinc-400 text-[11px] whitespace-nowrap mt-0.5">
                      {p.cantidad_productos ?? 0} producto{(p.cantidad_productos ?? 0) === 1 ? '' : 's'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Grid de tarjetas para escritorio */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {proveedoresFiltrados.slice(0, visibleCount).map((p) => (
                <Link
                  key={p.id}
                  to={`/supply/${p.slug || `estudio/${p.id}`}`}
                  className="group relative bg-white border border-zinc-200 hover:border-blue-500/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                        {p.logo_url
                          ? <img src={cloudinaryFill(p.logo_url, 120, 120)} alt={p.nombre_supply} className="w-full h-full object-cover" loading="lazy" />
                          : <span className="text-zinc-400 text-lg font-black">{p.nombre_supply?.[0]?.toUpperCase() || '?'}</span>}
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center">
                        <ShieldCheck size={12} className="text-blue-500" />
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          Verificado
                        </span>
                      </div>
                      <h3 className="font-black uppercase text-sm text-zinc-900 group-hover:text-blue-600 transition-colors truncate mt-1">
                        {p.nombre_supply}
                      </h3>
                      {p.municipio && (
                        <p className="text-zinc-500 text-xs flex items-center gap-1 truncate mt-0.5">
                          <MapPin size={11} className="flex-shrink-0 text-zinc-400" />
                          {p.municipio}{p.departamento ? `, ${p.departamento}` : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-medium">
                      {p.cantidad_productos ?? 0} producto{(p.cantidad_productos ?? 0) === 1 ? '' : 's'} disponible{(p.cantidad_productos ?? 0) === 1 ? '' : 's'}
                    </span>
                    <span className="text-blue-600 font-bold uppercase tracking-wide group-hover:translate-x-0.5 transition-transform">
                      Ver tienda →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {visibleCount < proveedoresFiltrados.length && (
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                  className="px-6 py-2.5 border border-blue-500/40 text-blue-500 text-xs font-bold uppercase tracking-[0.15em] rounded hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300"
                >
                  Ver más ({proveedoresFiltrados.length - visibleCount} más)
                </button>
              </div>
            )}
          </>
        )}

        <div className="mt-12 text-center border-t border-zinc-200 pt-8">
          {/* Corregido (2026-09-12, Jose): el CTA mandaba a WhatsApp
              personal, luego a /marca/unete (que es para marcas curadas
              a mano por Jose, un tema aparte) — ahora va al registro
              propio de proveedor nativo de Supply, autogestionable, sin
              pasar por Jose. Ver EstudioProveedorSupplyRegistroPage.jsx. */}
          <p className="text-zinc-500 text-sm mb-3">¿Tienes insumos o equipos para tatuadores?</p>
          <Link
            to="/supply/proveedores/unete"
            className="inline-block px-6 py-3 bg-blue-500 text-white font-bold uppercase tracking-[0.15em] text-xs rounded hover:bg-blue-600 transition"
          >
            Registrar mi Supply
          </Link>
        </div>
      </div>

      <FooterSupply light />
      {/* h-16 (64px), no h-20 — mismo ajuste medido de 2026-09-15 en
          EstudioSupplyPage.jsx/SupplyPage.jsx/SupplyCategoryPage.jsx. */}
      <div className="h-16 md:hidden" />
      <SupplyMobileNav active={null} light />
    </div>
  )
}
