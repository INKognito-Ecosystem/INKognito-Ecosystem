import { useMemo, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { MapPin, ShieldCheck, Search } from 'lucide-react'
import NavbarCategory from './NavbarCategory'
import FooterSupply from './FooterSupply'
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
  const title = 'Proveedores verificados | INKognito Supply'
  const description = 'Directorio de estudios y empresas registradas como proveedores en INKognito Supply, en toda Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/proveedores` },
  ]
}

// Sin tildes/mayúsculas — mismo criterio de búsqueda insensible a acentos
// ya usado en el buscador de producto/proveedor de SupplyCategoryPage.jsx.
const normaliza = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

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

  const handleBusqueda = (e) => { setBusqueda(e.target.value); setVisibleCount(PAGE_SIZE) }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavbarCategory pageName="Proveedores" />

      <div className="relative overflow-hidden pt-20 md:pt-28 pb-4 px-6">
        <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <p className="uppercase tracking-[0.25em] text-blue-400/70 text-xs mb-2">INKognito Supply</p>
          <h1 className="text-2xl md:text-4xl font-black uppercase leading-tight mb-3 text-white">Proveedores verificados</h1>
          <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
            Estudios y empresas reales, registrados en INKognito Supply, en toda Colombia.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-6 md:pb-10">
        {proveedores.length === 0 ? (
          <p className="text-zinc-600 text-sm text-center py-10">Todavía no hay proveedores registrados.</p>
        ) : (
          <>
            <div className="relative max-w-sm mx-auto mt-4 mb-6">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
              <input
                type="text"
                value={busqueda}
                onChange={handleBusqueda}
                placeholder="Buscar por nombre o ciudad"
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm rounded-lg pl-9 pr-3 py-2.5 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
              />
            </div>
            {proveedoresFiltrados.length === 0 ? (
              <p className="text-zinc-600 text-sm text-center py-10">Ningún proveedor coincide con "{busqueda}".</p>
            ) : (
              <>
                <div className="max-w-xl mx-auto flex flex-col divide-y divide-zinc-800 border-t border-b border-zinc-800">
                  {proveedoresFiltrados.slice(0, visibleCount).map((p) => (
                    <Link
                      key={p.id}
                      to={`/supply/${p.slug || `estudio/${p.id}`}`}
                      className="flex items-center gap-3 py-3 hover:bg-zinc-900 transition-colors"
                    >
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0 flex items-center justify-center">
                        {p.logo_url
                          ? <img src={cloudinaryFill(p.logo_url, 100, 100)} alt={p.nombre_supply} className="w-full h-full object-cover" loading="lazy" />
                          : <span className="text-zinc-600 text-sm font-black">{p.nombre_supply?.[0]?.toUpperCase() || '?'}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black uppercase text-sm text-white truncate flex items-center gap-1.5">
                          {p.nombre_supply}
                          <ShieldCheck size={12} className="text-blue-400 flex-shrink-0" />
                        </p>
                        {p.municipio && (
                          <p className="text-zinc-500 text-xs flex items-center gap-1 truncate mt-0.5">
                            <MapPin size={10} className="flex-shrink-0" />
                            {p.municipio}{p.departamento ? `, ${p.departamento}` : ''}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                {visibleCount < proveedoresFiltrados.length && (
                  <div className="flex justify-center mt-6">
                    <button
                      type="button"
                      onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                      className="px-6 py-2.5 border border-blue-500/40 text-blue-400 text-xs font-bold uppercase tracking-[0.15em] rounded hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300"
                    >
                      Ver más ({proveedoresFiltrados.length - visibleCount} más)
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        <div className="mt-12 text-center border-t border-zinc-800 pt-8">
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
            Regístrate como proveedor
          </Link>
        </div>
      </div>

      <FooterSupply />
    </div>
  )
}
