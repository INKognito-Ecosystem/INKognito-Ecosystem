import { useRef, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { MapPin, Palette, Search, X, ChevronLeft, ChevronRight } from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#B3202F'

export async function loader({ params }) {
  try {
    const res = await fetch(`${PANEL_URL}/api/artistas/${params.id}`)
    if (!res.ok) return { artista: null }
    return { artista: await res.json() }
  } catch {
    return { artista: null }
  }
}

export function meta({ data }) {
  const artista = data?.artista
  if (!artista) return [{ title: 'Artista no encontrado | Tattoo Artist Urabá' }]
  const title = `${artista.nombre} — Tatuador en ${artista.municipio} | Tattoo Artist Urabá`
  const description = artista.bio || `${artista.nombre}, tatuador en ${artista.municipio}, Urabá. Portafolio y contacto directo por WhatsApp.`
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    ...((artista.foto_url_2 || artista.foto_url) ? [{ property: 'og:image', content: artista.foto_url_2 || artista.foto_url }] : []),
  ]
}

// Presentación estilo perfil de red social (2026-08-03, pedido de Jose:
// "parecido a como se presenta face, con su lugar para foto de perfil, y
// una para portada"). Perfil y portada (foto_url/foto_url_2) son fotos
// propias, DISTINTAS de los trabajos de portafolio (foto_trabajo_1/2/3) —
// corrección del propio Jose tras la primera vuelta, que había reusado los
// mismos 3 slots para ambos roles: "la idea es subir perfil, portada, y
// aun asi las tres fotos [de trabajos]", 5 fotos en total.
export default function ArtistaLandingPage() {
  const { artista } = useLoaderData()
  const [lightbox, setLightbox] = useState(null)
  const touchStartX = useRef(null)

  if (!artista) return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarArtistas />
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm uppercase tracking-widest pt-20">
        Artista no encontrado
      </div>
    </div>
  )

  const waLink = artista.whatsapp
    ? `https://wa.me/${artista.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${artista.nombre}, te encontré en Tattoo Artist Urabá y quiero preguntarte por una cita.`)}`
    : null

  const tieneContacto = Boolean(waLink)
  const trabajos = [artista.foto_trabajo_1, artista.foto_trabajo_2, artista.foto_trabajo_3].filter(Boolean)

  const irA = (delta) => setLightbox(i => (i + delta + trabajos.length) % trabajos.length)
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < 40) return
    irA(delta < 0 ? 1 : -1)
  }

  return (
    <div className={`min-h-screen bg-white text-gray-900 ${tieneContacto ? 'pb-20' : ''}`}>
      <NavbarArtistas />

      <div className="pt-16 md:pt-20">

        {/* PORTADA */}
        <div className="w-full h-40 sm:h-56 md:h-72 bg-gray-100 overflow-hidden">
          {artista.foto_url_2 && (
            <img src={artista.foto_url_2} alt="" className="w-full h-full object-cover" loading="eager" />
          )}
        </div>

        <div className="max-w-3xl mx-auto px-4">

          {/* AVATAR — se monta sobre la portada, mismo patrón de perfil */}
          <div className="relative -mt-12 sm:-mt-16 md:-mt-20">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full border-4 border-white bg-gray-100 shadow-md overflow-hidden">
              {artista.foto_url ? (
                <img src={artista.foto_url} alt={artista.nombre} className="w-full h-full object-cover" loading="eager" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl font-black">
                  {artista.nombre?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-2">

            <div>
              <h1 className="text-2xl md:text-4xl font-black uppercase leading-tight">{artista.nombre}</h1>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-500">
                  <MapPin size={13} />
                  {artista.municipio}
                </span>
                {artista.estilo && (
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <Palette size={13} />
                    {artista.estilo}
                  </span>
                )}
              </div>
            </div>

            {artista.bio && (
              <p className="text-gray-600 text-sm leading-relaxed max-w-xl">{artista.bio}</p>
            )}

          </div>
        </div>

        {/* REDES SOCIALES — Facebook e Instagram, siempre visibles a todo el
            ancho de pantalla en 2 bloques (pedido de Jose, 2026-08-03). Si
            el artista todavía no tiene el link cargado, el bloque se queda
            visible pero deshabilitado con un aviso, nunca se oculta.
            Delgadas como el botón de WhatsApp (corrección de Jose: las
            primeras quedaron muy grandes/cuadradas, apiladas verticalmente
            — ahora ícono + texto en fila, misma altura que WhatsApp). */}
        <div className="mt-5">
          <p className="max-w-3xl mx-auto px-4 text-gray-400 text-[11px] uppercase tracking-widest mb-2">Redes sociales</p>
          <div className="grid grid-cols-2 w-full border-y border-gray-200">
            <a
              href={artista.facebook || undefined}
              target={artista.facebook ? '_blank' : undefined}
              rel={artista.facebook ? 'noopener noreferrer' : undefined}
              onClick={artista.facebook ? undefined : (e) => e.preventDefault()}
              aria-disabled={!artista.facebook}
              className={`flex items-center justify-center gap-2.5 py-3.5 border-r border-gray-200 transition-colors ${
                artista.facebook ? 'text-gray-700 hover:bg-gray-50 cursor-pointer' : 'text-gray-300 cursor-default'
              }`}
            >
              <FaFacebook size={18} />
              <span className="flex flex-col items-start leading-tight">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Facebook</span>
                {!artista.facebook && <span className="text-[9px] font-medium normal-case tracking-normal text-gray-300">Aún no se ha subido</span>}
              </span>
            </a>
            <a
              href={artista.instagram || undefined}
              target={artista.instagram ? '_blank' : undefined}
              rel={artista.instagram ? 'noopener noreferrer' : undefined}
              onClick={artista.instagram ? undefined : (e) => e.preventDefault()}
              aria-disabled={!artista.instagram}
              className={`flex items-center justify-center gap-2.5 py-3.5 transition-colors ${
                artista.instagram ? 'text-gray-700 hover:bg-gray-50 cursor-pointer' : 'text-gray-300 cursor-default'
              }`}
            >
              <FaInstagram size={18} />
              <span className="flex flex-col items-start leading-tight">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Instagram</span>
                {!artista.instagram && <span className="text-[9px] font-medium normal-case tracking-normal text-gray-300">Aún no se ha subido</span>}
              </span>
            </a>
          </div>
        </div>

        {/* TRABAJOS — fila horizontal a todo el ancho de la pantalla (pedido
            explícito de Jose, 2026-08-03), rompe el max-w-3xl a propósito.
            Cada foto abre el lightbox navegable con botón "Ver". */}
        {trabajos.length > 0 && (
          <div className="mt-6">
            <p className="max-w-3xl mx-auto px-4 text-gray-400 text-[11px] uppercase tracking-widest mb-2">Trabajos</p>
            <div className="grid grid-cols-3 gap-0.5 sm:gap-1 w-full">
              {trabajos.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setLightbox(i)}
                  className="relative aspect-square bg-gray-50 overflow-hidden group"
                >
                  <img src={src} alt={`Trabajo ${i + 1} de ${artista.nombre}`} className="w-full h-full object-cover" loading="lazy" />
                  <span className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-black/60 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full backdrop-blur-sm group-hover:bg-black/80 transition-colors">
                    <Search size={10} />
                    Ver
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4">
          <div className="border-t border-gray-200 pt-5 mt-6 pb-10">
            <Link to="/tattoo-artist-uraba" className="text-gray-400 hover:text-gray-900 text-xs uppercase tracking-widest transition-colors">
              ← Ver más artistas en Urabá
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 py-6 px-4 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-400 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} Tattoo Artist Urabá — INKognito. Todos los derechos reservados.</p>
          <span className="text-gray-300">Desarrollado por INKognito</span>
        </div>
      </footer>

      {/* CONTACTO FIJO — WhatsApp siempre alcanzable sin importar cuánto se
          haya scrolleado (pedido de Jose, 2026-08-03). Instagram/Facebook
          ya no van acá — se movieron al bloque "Redes sociales" fijo debajo
          de la bio, siempre visible con o sin link cargado. */}
      {tieneContacto && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 py-3 bg-green-600 text-white font-black uppercase tracking-widest rounded hover:bg-green-500 transition-all text-sm"
            >
              <FaWhatsapp size={18} />
              WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* LIGHTBOX — abre al tocar "Ver" en cualquier trabajo, navegable con
          flechas (desktop) o swipe (móvil) entre las 3 fotos. */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Cerrar"
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2"
          >
            <X size={26} />
          </button>

          {trabajos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); irA(-1) }}
                aria-label="Anterior"
                className="absolute left-1 sm:left-4 text-white/60 hover:text-white transition-colors p-3"
              >
                <ChevronLeft size={30} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); irA(1) }}
                aria-label="Siguiente"
                className="absolute right-1 sm:right-4 text-white/60 hover:text-white transition-colors p-3"
              >
                <ChevronRight size={30} />
              </button>
            </>
          )}

          <img
            src={trabajos[lightbox]}
            alt={`Trabajo ${lightbox + 1} de ${artista.nombre}`}
            className="max-w-[90vw] max-h-[82vh] object-contain select-none"
            onClick={(e) => e.stopPropagation()}
          />

          {trabajos.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
              {trabajos.map((_, i) => (
                <span key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === lightbox ? 'bg-white' : 'bg-white/40'}`} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
