import { Link, useLoaderData } from 'react-router-dom'
import { MapPin, ShieldCheck } from 'lucide-react'
import NavbarCategory from './NavbarCategory'
import FooterSupply from './FooterSupply'
import { cloudinaryFill } from '../../lib/cloudinary'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const WA = '573207911013'

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

export default function SupplyProveedoresPage() {
  const { proveedores } = useLoaderData()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavbarCategory pageName="Proveedores" />

      <div className="relative overflow-hidden pt-20 md:pt-28 pb-10 px-6">
        <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <p className="uppercase tracking-[0.25em] text-blue-400/70 text-xs mb-2">INKognito Supply</p>
          <h1 className="text-2xl md:text-4xl font-black uppercase leading-tight mb-3 text-white">Proveedores verificados</h1>
          <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
            Estudios y empresas reales, registrados en INKognito Supply, en toda Colombia.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 md:py-10">
        {proveedores.length === 0 ? (
          <p className="text-zinc-600 text-sm text-center py-10">Todavía no hay proveedores registrados.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {proveedores.map((p) => (
              <Link
                key={p.id}
                to={`/supply/estudio/${p.id}`}
                className="rounded-xl border border-zinc-800 hover:border-blue-500 bg-zinc-950 overflow-hidden transition-colors"
              >
                <div className="relative h-28 bg-zinc-900">
                  {p.foto_portada ? (
                    <img src={cloudinaryFill(p.foto_portada, 250, 150)} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700 text-3xl font-black">{p.nombre_supply?.[0]?.toUpperCase() || '?'}</div>
                  )}
                  <span className="absolute top-2 left-2 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full text-white bg-blue-600">
                    <ShieldCheck size={10} /> Verificado
                  </span>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2 flex-nowrap">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-zinc-900 flex-shrink-0 flex items-center justify-center">
                      {p.logo_url
                        ? <img src={cloudinaryFill(p.logo_url, 80, 80)} alt={p.nombre_supply} className="w-full h-full object-cover" loading="lazy" />
                        : <span className="text-zinc-700 text-[10px] font-black">{p.nombre_supply?.[0]?.toUpperCase() || '?'}</span>}
                    </div>
                    <p className="font-black uppercase text-xs leading-tight truncate text-white min-w-0 flex-1">{p.nombre_supply}</p>
                  </div>
                  {p.municipio && (
                    <p className="text-zinc-500 text-[10px] uppercase tracking-wide mt-1.5 flex items-center gap-1 truncate">
                      <MapPin size={10} className="flex-shrink-0" />
                      {p.municipio}{p.departamento ? `, ${p.departamento}` : ''}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center border-t border-zinc-800 pt-8">
          {/* A diferencia de Store (tienda/unete, público desde el día uno),
              el registro de marca/proveedor de Supply lo sigue curando Jose
              directamente (ver EstudioMarcaRegistroPage.jsx — sin link
              público a propósito) — acá solo se ofrece el contacto por
              WhatsApp, no un formulario de autoregistro abierto. */}
          <p className="text-zinc-500 text-sm mb-3">¿Tienes insumos o equipos para tatuadores?</p>
          <a
            href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero registrarme como proveedor en INKognito Supply.')}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-500 text-white font-bold uppercase tracking-[0.15em] text-xs rounded hover:bg-blue-600 transition"
          >
            Escríbenos para ser proveedor
          </a>
        </div>
      </div>

      <FooterSupply />
    </div>
  )
}
