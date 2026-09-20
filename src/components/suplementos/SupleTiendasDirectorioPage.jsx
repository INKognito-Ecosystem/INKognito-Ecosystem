import { useMemo, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { MapPin, ShieldCheck, Search } from 'lucide-react'
import NavbarSuple from './NavbarSuple'
import SupleMobileNav from './SupleMobileNav'
import FooterSuple from './FooterSuple'
import { cloudinaryFill } from '../../lib/cloudinary'
import logoSuple from '../../assets/milogo/gym.webp'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Directorio de vendedores (Suple multitenant, 2026-09-20) — clon de
// TiendasDirectorioPage.jsx (Store): deja que alguien verifique por su
// cuenta, sin depender de un link que el propio vendedor mandó, que un
// vendedor es real.
export async function loader() {
  try {
    const res = await fetch(`${PANEL_URL}/api/estudios-suple-directorio`)
    return { vendedores: res.ok ? await res.json() : [] }
  } catch {
    return { vendedores: [] }
  }
}

export function meta() {
  const title = 'Vendedores verificados | INKognito Suple'
  const description = 'Directorio de vendedores de suplementos deportivos registrados en INKognito Suple, en toda Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/suplementos/tiendas` },
  ]
}

const normaliza = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const PAGE_SIZE = 12

export default function SupleTiendasDirectorioPage() {
  const { vendedores } = useLoaderData()
  const [busqueda, setBusqueda] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const vendedoresFiltrados = useMemo(() => {
    if (!busqueda.trim()) return vendedores
    const q = normaliza(busqueda)
    return vendedores.filter(t => normaliza(t.nombre_suple).includes(q) || normaliza(t.municipio).includes(q))
  }, [vendedores, busqueda])

  const handleBusqueda = (e) => { setBusqueda(e.target.value); setVisibleCount(PAGE_SIZE) }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="hidden md:block">
        <NavbarSuple pageName="Vendedores verificados" hideMobileActions />
      </div>

      <div className="md:hidden sticky top-0 z-40 flex items-center gap-2 px-4 py-2 bg-white border-b border-zinc-200">
        <Link to="/suplementos" aria-label="Volver a Suple" className="flex-shrink-0">
          <img src={logoSuple} alt="INKognito Suple" className="w-12 h-12 object-contain" />
        </Link>
        <div className="relative flex-1 min-w-0">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={busqueda}
            onChange={handleBusqueda}
            placeholder="Buscar por nombre o ciudad"
            className="w-full min-w-0 bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs rounded-lg pl-8 pr-2 py-2 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700"
          />
        </div>
      </div>

      <div className="bg-gray-50 pt-0 md:pt-24 pb-4 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs mb-2">INKognito Suple</p>
          <h1 className="text-2xl md:text-4xl font-black uppercase leading-tight mb-3 text-gray-900">Vendedores verificados</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
            Suplementos deportivos de vendedores reales, registrados en INKognito Suple.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 pb-10 md:pb-14">
        {vendedores.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">Todavía no hay vendedores registrados.</p>
        ) : (
          <>
            <div className="hidden md:block relative max-w-sm mx-auto mt-4 mb-6">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={busqueda}
                onChange={handleBusqueda}
                placeholder="Buscar por nombre o ciudad"
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg pl-9 pr-3 py-2.5 placeholder:text-gray-400 focus:outline-none focus:border-zinc-700"
              />
            </div>
            {vendedoresFiltrados.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-10">Ningún vendedor coincide con "{busqueda}".</p>
            ) : (
              <>
                <div className="max-w-xl mx-auto flex flex-col divide-y divide-gray-100 border-t border-b border-gray-100">
                  {vendedoresFiltrados.slice(0, visibleCount).map((t) => (
                    <Link
                      key={t.id}
                      to={`/suplementos/${t.slug || `estudio/${t.id}`}`}
                      className="flex items-center gap-3 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center">
                        {t.logo_url
                          ? <img src={cloudinaryFill(t.logo_url, 100, 100)} alt={t.nombre_suple} className="w-full h-full object-cover" loading="lazy" />
                          : <span className="text-gray-400 text-sm font-black">{t.nombre_suple?.[0]?.toUpperCase() || '?'}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black uppercase text-sm text-gray-900 truncate flex items-center gap-1.5">
                          {t.nombre_suple}
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
                {visibleCount < vendedoresFiltrados.length && (
                  <div className="flex justify-center mt-6">
                    <button
                      type="button"
                      onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                      className="px-6 py-2.5 border border-zinc-400 text-zinc-700 text-xs font-bold uppercase tracking-[0.15em] rounded hover:border-zinc-600 hover:bg-zinc-100 transition-all duration-300"
                    >
                      Ver más ({vendedoresFiltrados.length - visibleCount} más)
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        <div className="mt-12 text-center border-t border-gray-200 pt-8">
          <p className="text-gray-500 text-sm mb-3">¿Vendes suplementos deportivos?</p>
          <Link
            to="/suplementos/proveedores/unete"
            className="inline-block px-6 py-3 text-white font-bold uppercase tracking-[0.15em] text-xs rounded hover:brightness-90 transition bg-zinc-700"
          >
            Registrar mi catálogo
          </Link>
        </div>
      </div>

      <FooterSuple />

      <div className="h-16 md:hidden bg-white" />

      <SupleMobileNav active={null} />
    </div>
  )
}
