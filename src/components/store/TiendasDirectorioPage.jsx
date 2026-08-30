import { Link, useLoaderData } from 'react-router-dom'
import { MapPin, ShieldCheck } from 'lucide-react'
import NavbarCategoryStore from './NavbarCategoryStore'
import FooterStore from './FooterStore'
import { cloudinaryFill } from '../../lib/cloudinary'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Directorio simple de tiendas (Store multitenant, 2026-08-29) — a
// propósito SIN buscador ni filtros ni "cerca de ti", a diferencia del
// buscador de tatuadores (ArtistasColombiaPage.jsx). Su función no es
// ayudar a comparar/elegir entre muchas tiendas (eso ya lo resuelve
// navegar Store por categoría) — es dejar que alguien verifique por su
// cuenta, sin depender de un link que la propia tienda mandó, que una
// tienda es real: consultarla acá es un camino independiente al de la
// insignia en su propio perfil.
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

export default function TiendasDirectorioPage() {
  const { tiendas } = useLoaderData()

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <NavbarCategoryStore pageName="Tiendas verificadas" />

      <div className="bg-gray-50 pt-20 md:pt-24 pb-10 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-xs mb-2">INKognito Store</p>
          <h1 className="text-2xl md:text-4xl font-black uppercase leading-tight mb-3 text-gray-900">Tiendas verificadas</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
            Ropa y calzado de tiendas reales de Urabá, registradas en INKognito Store.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-14">
        {tiendas.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">Todavía no hay tiendas registradas.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {tiendas.map((t) => (
              <Link
                key={t.id}
                to={`/store/${t.slug || `estudio/${t.id}`}`}
                className="rounded-xl border border-gray-200 hover:border-[#C9A84C] bg-white overflow-hidden transition-colors"
              >
                <div className="relative h-28 bg-gray-100">
                  {t.foto_portada ? (
                    <img src={cloudinaryFill(t.foto_portada, 250, 150)} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl font-black">{t.nombre_tienda?.[0]?.toUpperCase() || '?'}</div>
                  )}
                  <span className="absolute top-2 left-2 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full text-white bg-green-600">
                    <ShieldCheck size={10} /> Verificada
                  </span>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2 flex-nowrap">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                      {t.logo_url
                        ? <img src={cloudinaryFill(t.logo_url, 80, 80)} alt={t.nombre_tienda} className="w-full h-full object-cover" loading="lazy" />
                        : <span className="text-gray-300 text-[10px] font-black">{t.nombre_tienda?.[0]?.toUpperCase() || '?'}</span>}
                    </div>
                    <p className="font-black uppercase text-xs leading-tight truncate text-gray-900 min-w-0 flex-1">{t.nombre_tienda}</p>
                  </div>
                  {t.municipio && (
                    <p className="text-gray-500 text-[10px] uppercase tracking-wide mt-1.5 flex items-center gap-1 truncate">
                      <MapPin size={10} className="flex-shrink-0" />
                      {t.municipio}{t.departamento ? `, ${t.departamento}` : ''}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center border-t border-gray-200 pt-8">
          <p className="text-gray-500 text-sm mb-3">¿Tienes una tienda de ropa o calzado en Urabá?</p>
          <Link
            to="/tattoo-artist-colombia/tienda/unete"
            className="inline-block px-6 py-3 text-white font-bold uppercase tracking-[0.15em] text-xs rounded hover:brightness-90 transition"
            style={{ backgroundColor: '#C9A84C' }}
          >
            Regístrala en INKognito Store
          </Link>
        </div>
      </div>

      <FooterStore />
    </div>
  )
}
