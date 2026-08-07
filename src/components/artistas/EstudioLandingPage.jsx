import { Link, useLoaderData } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { MapPin, Users, Building2 } from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'
import { idDesdeParam } from './artistaSlug'
import { urlGoogleMaps } from './mapaUrl'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const BTN = '#374151'

// Página pública de estudio (fase 3 del directorio, 2026-08-06) — mucho
// más simple que ArtistaLandingPage.jsx a propósito: sin diseños en
// venta, sin agenda, sin Mercado Pago — esas son funciones exclusivas del
// perfil individual del artista. Esta página es solo identidad + roster,
// cada card sigue enlazando al perfil completo real del artista.
export async function loader({ params }) {
  const id = idDesdeParam(params.id)
  try {
    const res = await fetch(`${PANEL_URL}/api/estudios/${id}`)
    if (!res.ok) return { estudio: null }
    return { estudio: await res.json() }
  } catch {
    return { estudio: null }
  }
}

export function meta({ data }) {
  const estudio = data?.estudio
  if (!estudio) return [{ title: 'Estudio no encontrado | Tattoo Artist Colombia' }]
  const title = `${estudio.nombre} — Estudio de tatuajes en ${estudio.municipio} | Tattoo Artist Colombia`
  const description = estudio.bio || `${estudio.nombre}, estudio de tatuajes en ${estudio.municipio}${estudio.departamento ? ', ' + estudio.departamento : ''}.`
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/tattoo-artist-colombia/estudio/${estudio.id}` },
  ]
}

export default function EstudioLandingPage() {
  const { estudio } = useLoaderData()

  if (!estudio) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex flex-col">
        <NavbarArtistas />
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-gray-500 text-sm">No encontramos este estudio.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* "Tattoo Studios Colombia" en vez del wordmark de artista
          individual (2026-08-07, Jose) — la insignia de abajo ya deja
          claro que es un estudio, así que el nombre del estudio en sí
          puede ser corto (ej. "INKognito") sin perder contexto. */}
      <NavbarArtistas titulo="Tattoo Studios Colombia" />

      <div className="flex-1 pt-16 md:pt-20">
        {/* h-40/56/64 con ancho completo — una foto que no sea
            panorámica (ej. una foto de celular en vertical u horizontal
            normal) se ve exageradamente recortada con object-cover acá.
            El aviso de formato ideal vive en el dashboard del estudio
            (donde se sube la foto), no en esta página pública. */}
        <div className="w-full h-40 sm:h-56 md:h-64 bg-gray-100 overflow-hidden">
          {estudio.foto_portada && <img src={estudio.foto_portada} alt="" className="w-full h-full object-cover" />}
        </div>

        <div className="max-w-3xl mx-auto px-4">
          <div className="relative min-h-16 sm:min-h-[85px]">
            <div className="absolute left-0 top-0 -translate-y-1/3">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gray-100 shadow-md overflow-hidden">
                {estudio.logo_url ? (
                  <img src={estudio.logo_url} alt={estudio.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl font-black">{estudio.nombre?.[0]?.toUpperCase() || '?'}</div>
                )}
              </div>
            </div>
            <div className="pt-3 pl-[108px] sm:pl-[144px] min-w-0">
              {/* v4 (2026-08-07, Jose: "el ícono iba antes del nombre, no
                  al frente" — corrige v3, que lo puso después) — ícono
                  primero, nombre después, mismo patrón inline (solo
                  ícono, sin texto, como VerifiedBadge en
                  ArtistasColombiaPage.jsx). text-base en vez de
                  text-lg/2xl + truncate (Jose: "el nombre del estudio
                  como es largo genera dos líneas de texto") — más chico
                  que el de artista a propósito, para que SIEMPRE quede en
                  una sola línea sin importar el largo. */}
              <div className="flex items-center gap-1.5 min-w-0">
                <span title="Tattoo Studio" className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-gray-600">
                  <Building2 size={11} className="text-white" />
                </span>
                <h1 className="text-base sm:text-xl font-black uppercase leading-tight truncate min-w-0">{estudio.nombre}</h1>
              </div>
              {/* Enlace real a Google Maps (2026-08-07, Jose) — mismo
                  criterio que ArtistaLandingPage.jsx: link propio si lo
                  pegaron, si no el punto exacto capturado, si no una
                  búsqueda por nombre+municipio. */}
              <a
                href={urlGoogleMaps(estudio)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-700 transition-colors mt-1"
              >
                <MapPin size={11} className="flex-shrink-0" />
                <span className="underline underline-offset-2 decoration-gray-300">{estudio.municipio}{estudio.departamento ? `, ${estudio.departamento}` : ''}</span>
              </a>
            </div>
          </div>

          {estudio.bio && (
            <div className="mt-6 max-w-xl">
              <div className="bg-gray-100 border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3.5">
                <p className="text-gray-700 text-sm leading-relaxed">{estudio.bio}</p>
              </div>
            </div>
          )}

          {(estudio.instagram || estudio.facebook || estudio.whatsapp) && (
            <div className="flex items-center gap-3 mt-4">
              {estudio.whatsapp && (
                <a href={`https://wa.me/${estudio.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold" style={{ backgroundColor: '#25D366' }}>
                  <FaWhatsapp size={13} /> WhatsApp
                </a>
              )}
              {estudio.instagram && (
                <a href={estudio.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white" style={{ backgroundColor: BTN }}>
                  <FaInstagram size={14} />
                </a>
              )}
              {estudio.facebook && (
                <a href={estudio.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white" style={{ backgroundColor: BTN }}>
                  <FaFacebook size={14} />
                </a>
              )}
            </div>
          )}

          <div className="mt-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-1.5">
              <Users size={13} /> {estudio.artistas?.length || 0} artista{estudio.artistas?.length === 1 ? '' : 's'} en este estudio
            </p>
            {!estudio.artistas || estudio.artistas.length === 0 ? (
              <p className="text-gray-400 text-sm">Este estudio todavía no tiene artistas activos.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {estudio.artistas.map((a) => (
                  <Link key={a.id} to={`/artista/${a.id}`} className="block border border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 transition-colors">
                    <div className="w-full aspect-square bg-gray-100">
                      {a.foto_url ? (
                        <img src={a.foto_url} alt={a.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl font-black">{a.nombre?.[0]?.toUpperCase() || '?'}</div>
                      )}
                    </div>
                    <div className="px-2.5 py-2">
                      <p className="text-sm font-bold truncate">{a.nombre}</p>
                      {a.estilo && <p className="text-[11px] text-gray-500 truncate">{a.estilo}</p>}
                      {/* Fragmento de bio (2026-08-07, Jose: "tal como ya
                          aparece en la búsqueda del buscador") — mismo
                          tratamiento que ListingRow en ArtistasColombiaPage.jsx. */}
                      {a.bio && <p className="text-gray-400 text-[10px] mt-0.5 leading-snug truncate">{a.bio}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 py-6 px-4 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-400 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} Tattoo Artist Colombia — Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link to="/tattoo-artist-colombia/terminos" className="text-gray-400 hover:text-gray-700 transition-colors">Términos</Link>
            <Link to="/tattoo-artist-colombia/privacidad" className="text-gray-400 hover:text-gray-700 transition-colors">Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
