import { useEffect, useRef, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { Search, MapPin, Palette, BadgeCheck, ChevronRight, Navigation, LoaderCircle, Share2, Sparkles, Check } from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'

// Sin esto, escribir "apartado"/"chigorodo" (sin tilde, lo normal al
// escribir rápido en el teléfono) NO matcheaba "Apartadó"/"Chigorodó" —
// solo funcionaban substrings casuales que no tocaban la sílaba
// acentuada ("apart", "chigo"). Se normalizan tildes en ambos lados
// antes de comparar (Jose, 2026-08-03).
const normalize = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#B3202F'

// Centros aproximados de los 4 municipios de Urabá donde opera el
// directorio — solo se usan para "¿cuál está más cerca?" (geolocalización),
// no hace falta precisión de catastro.
const MUNICIPIO_COORDS = {
  'Chigorodó': { lat: 7.668, lng: -76.681 },
  'Carepa':    { lat: 7.754, lng: -76.656 },
  'Apartadó':  { lat: 7.882, lng: -76.625 },
  'Turbo':     { lat: 8.093, lng: -76.729 },
}

function distanciaKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function municipioMasCercano(lat, lng) {
  let mejor = null
  let mejorDist = Infinity
  for (const [nombre, c] of Object.entries(MUNICIPIO_COORDS)) {
    const d = distanciaKm(lat, lng, c.lat, c.lng)
    if (d < mejorDist) { mejorDist = d; mejor = nombre }
  }
  return mejor
}

// Puntitos oscuros y muy sutiles sobre fondo blanco (antes eran claros
// sobre negro) — mismo recurso visual, paleta invertida.
const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(0,0,0,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

export async function loader({ request }) {
  // Geolocalización por IP (2026-08-04, sugerencia de Jose sobre cómo lo
  // hace Tattoodo con IP2Location) — pero mejor: Vercel ya inyecta el
  // header x-vercel-ip-city en cada request de producción, gratis y sin
  // pedirle permiso al visitante (a diferencia del botón "Cerca de ti",
  // que sí requiere el prompt del navegador). En local (sin Vercel
  // delante) el header no existe, así que esto degrada solo — el visitante
  // sigue teniendo el botón de geolocalización manual.
  let municipioDetectado = null
  try {
    const ipCity = request.headers.get('x-vercel-ip-city')
    if (ipCity) {
      const norm = normalize(decodeURIComponent(ipCity))
      municipioDetectado = Object.keys(MUNICIPIO_COORDS).find(m => normalize(m) === norm) || null
    }
  } catch {
    municipioDetectado = null
  }

  try {
    const res = await fetch(`${PANEL_URL}/api/artistas`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return { artistas: await res.json(), municipioDetectado }
  } catch {
    return { artistas: [], municipioDetectado }
  }
}

export function meta() {
  const title = 'Tattoo Artist Urabá | Directorio de tatuadores — INKognito'
  const description = 'Encuentra tatuadores en Urabá — Chigorodó, Apartadó, Turbo y Carepa. Portafolio, estilo y contacto directo por WhatsApp.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/tattoo-artist-uraba` },
  ]
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: `${ACCENT}15`, color: ACCENT, border: `1px solid ${ACCENT}40` }}>
      <BadgeCheck size={11} />
      Verificado
    </span>
  )
}

function ListingRow({ to, nombre, municipio, estilo, bio, foto }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 p-3 md:p-4 rounded-lg border border-gray-200 hover:border-gray-300 bg-gray-50/60 hover:bg-gray-50 transition-all duration-200"
    >
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
        {foto
          ? <img src={foto} alt={nombre} className="w-full h-full object-cover" loading="lazy" />
          : <span className="text-gray-300 text-2xl font-black">{nombre?.[0]?.toUpperCase() || '?'}</span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-black uppercase text-sm leading-tight truncate text-gray-900">{nombre}</p>
          <VerifiedBadge />
        </div>
        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
          <span className="flex items-center gap-1 text-gray-500 text-[11px] uppercase tracking-wide leading-snug">
            <MapPin size={11} />
            {municipio}
          </span>
          {estilo && (
            <span className="flex items-center gap-1 text-gray-500 text-[11px] uppercase tracking-wide leading-snug">
              <Palette size={11} />
              {estilo}
            </span>
          )}
        </div>
        {bio && <p className="text-gray-400 text-xs mt-0.5 leading-snug truncate">{bio}</p>}
      </div>
      <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors" />
    </Link>
  )
}

// Tarjeta de reclutamiento persuasiva (2026-08-04, pedido de Jose: "muy
// básicas... deberán aparecer siempre debajo en la búsqueda, pero en una
// card, como lo hace tattoodo, con informaciones persuasivas"). Antes
// eran dos bloques de texto plano que solo aparecían con búsqueda activa
// — ahora es una sola card, siempre visible, con puntos de valor + ambos
// CTA (unirse / compartir). El encabezado cambia según el estado de la
// búsqueda, pero la card en sí nunca se oculta.
function TarjetaReclutamiento({ query, total, compartir }) {
  const encabezado = !query
    ? '¿Eres tatuador en Urabá?'
    : total === 0
      ? `Todavía no hay tatuadores para "${query}"`
      : `Ya hay ${total} artista${total !== 1 ? 's' : ''} en "${query}"`
  const subtitulo = !query
    ? 'Este es el buscador que conecta clientes con tatuadores de la región.'
    : total === 0
      ? 'Sé el primero en aparecer aquí.'
      : 'Súmate y aparece junto a ellos.'

  return (
    <div className="mt-6 rounded-xl border-2 p-5 md:p-6" style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}06` }}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: ACCENT }}>
          <Sparkles size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black uppercase text-sm text-gray-900 leading-tight">{encabezado}</p>
          <p className="text-gray-500 text-xs mt-0.5">{subtitulo}</p>

          <ul className="mt-3 space-y-1.5">
            <li className="flex items-center gap-2 text-xs text-gray-600">
              <Check size={13} style={{ color: ACCENT }} className="flex-shrink-0" />
              Apareces en las búsquedas de tu municipio
            </li>
            <li className="flex items-center gap-2 text-xs text-gray-600">
              <Check size={13} style={{ color: ACCENT }} className="flex-shrink-0" />
              Contacto directo por WhatsApp, sin intermediarios
            </li>
            <li className="flex items-center gap-2 text-xs text-gray-600">
              <Check size={13} style={{ color: ACCENT }} className="flex-shrink-0" />
              Sin costo por ahora — sin tarjeta, sin compromiso
            </li>
          </ul>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Link
              to="/tattoo-artist-uraba/unete"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
              style={{ backgroundColor: ACCENT }}
            >
              Unirme como artista
            </Link>
            <button
              onClick={compartir}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 text-gray-600 text-xs font-bold uppercase tracking-widest hover:border-gray-500 transition-colors"
            >
              <Share2 size={13} />
              Compartir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Módulo nuevo (2026-08-03), desplegado sin exponer aún — ver plan de
// "Directorio de artistas de tatuaje en Urabá". Tercera vuelta de diseño
// el mismo día: v1 (grid de fotos negro) genérica; v2 (pills municipio +
// pills estilo sobre negro) se sentía a pestañas; ahora Jose pidió pasar
// a paleta blanco/rojo/gris (en vez del negro original) y mover el
// nombre del módulo al navbar propio (NavbarArtistas.jsx) — el eyebrow
// "Tattoo Artist Urabá" que vivía arriba del H1 alejaba demasiado el
// título del navbar.
export default function ArtistasUrabaPage() {
  const { artistas, municipioDetectado } = useLoaderData()
  const [query, setQuery] = useState('')
  const [ubicando, setUbicando] = useState(false)
  const [ubicacionError, setUbicacionError] = useState(null)
  const listadoRef = useRef(null)
  const prevVacioRef = useRef(true)

  const q = normalize(query.trim())
  const matches = (...campos) => q === '' || campos.some(c => c && normalize(c).includes(q))

  // Sin búsqueda activa no se lista ningún artista — solo aparece al
  // buscar (Jose, 2026-08-03). El fundador (Jose Humanez) ya NO tiene
  // trato especial: se quitó el perfil fijo/destacado — "vamos a usar la
  // plataforma como cualquier tatuador más" (Jose, 2026-08-04). Si quiere
  // aparecer en el directorio, se registra igual que cualquier artista.
  const filtrados = q === '' ? [] : artistas.filter(a => matches(a.nombre, a.municipio, a.estilo))
  const total = filtrados.length

  // Al iniciar la búsqueda (primera letra escrita) el teclado del celular
  // tapa las cards que aparecen debajo — scroll automático hacia el
  // listado apenas se empieza a escribir (Jose, 2026-08-03).
  useEffect(() => {
    const vacio = q === ''
    if (prevVacioRef.current && !vacio) {
      listadoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    prevVacioRef.current = vacio
  }, [q])

  const usarMiUbicacion = () => {
    setUbicacionError(null)
    if (!navigator.geolocation) {
      setUbicacionError('Tu navegador no soporta geolocalización.')
      return
    }
    setUbicando(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const cercano = municipioMasCercano(pos.coords.latitude, pos.coords.longitude)
        setQuery(cercano)
        setUbicando(false)
      },
      () => {
        setUbicacionError('No pudimos acceder a tu ubicación — actívala en el navegador o escribe tu municipio.')
        setUbicando(false)
      },
      { timeout: 8000 }
    )
  }

  // Web Share API con fallback a WhatsApp — pedido de Jose (2026-08-04):
  // si quien busca NO es tatuador, se le invita a compartir la app en vez
  // de dejarlo sin ninguna acción posible.
  const compartir = () => {
    const texto = 'Encuentra tatuadores en Urabá — el buscador que conecta clientes con artistas de tatuaje.'
    const url = 'https://inkognito-ecosystem.com/tattoo-artist-uraba'
    if (navigator.share) {
      navigator.share({ title: 'Tattoo Artist Urabá', text: texto, url }).catch(() => {})
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`, '_blank')
    }
  }

  return (
    // flex flex-col + flex-1 en el contenido (2026-08-04): sin esto, en
    // búsquedas con pocos resultados el footer quedaba flotando a media
    // pantalla en vez de pegado abajo — "pongamos el copyright abajo como
    // corresponde" (Jose). NavbarArtistas es fixed, no participa del flex.
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavbarArtistas />

      <section className="relative overflow-hidden pt-20 pb-8 md:pb-10 px-4 md:px-6">
        <div className="absolute inset-0 opacity-[0.05]" style={DOT_PATTERN} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Título + descripción dentro de una card, mismo lenguaje visual
              que TarjetaReclutamiento (Jose, 2026-08-04). "tatuador" pasa
              de texto rojo suelto a una card roja con texto blanco, y el
              título ahora cabe en una sola línea (antes ocupaba dos). */}
          <div className="rounded-xl border-2 p-5 md:p-7 mb-6 overflow-hidden" style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}06` }}>
            <h1 className="text-lg sm:text-4xl md:text-5xl font-black uppercase leading-tight whitespace-nowrap">
              Encuentra tu{' '}
              <span className="inline-block px-2 sm:px-3 py-0.5 rounded-lg text-white" style={{ backgroundColor: ACCENT }}>
                tatuador
              </span>
            </h1>
            <p className="text-gray-500 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto mt-4">
              El buscador que conecta clientes con tatuadores de Urabá. Busca por nombre, municipio o estilo — o deja que detectemos dónde estás.
            </p>
          </div>

          {/* BARRA DE BÚSQUEDA + GEOLOCALIZACIÓN — sin listar municipios/
              estilos como botones: si uno no tiene artista registrado
              todavía, mostrarlo como opción no sirve de nada (Jose,
              2026-08-03). El municipio/estilo solo aparece como RESULTADO
              de buscar, nunca como opción previa para elegir. */}
          <div className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Nombre, municipio o estilo..."
                className="w-full bg-gray-50 border border-gray-300 rounded-full pl-11 pr-9 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={usarMiUbicacion}
              disabled={ubicando}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-full border text-xs font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-60"
              style={{ borderColor: ACCENT, color: ACCENT }}
            >
              {ubicando ? <LoaderCircle size={15} className="animate-spin" /> : <Navigation size={15} />}
              {ubicando ? 'Ubicando...' : 'Cerca de ti'}
            </button>
          </div>
          {ubicacionError && (
            <p className="text-gray-400 text-xs mt-3 max-w-md mx-auto">{ubicacionError}</p>
          )}
          {/* Sugerencia por geolocalización de IP (silenciosa, sin pedir
              permiso) — solo aparece antes de que la persona busque algo. */}
          {municipioDetectado && !query && (
            <button
              onClick={() => setQuery(municipioDetectado)}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mt-3"
            >
              <MapPin size={12} />
              ¿Buscas tatuadores en {municipioDetectado}?
            </button>
          )}
        </div>
      </section>

      <section ref={listadoRef} className="flex-1 px-4 md:px-6 pb-16 max-w-3xl mx-auto scroll-mt-20 w-full">

        {/* CONTADOR — solo tiene sentido con búsqueda activa, ningún
            artista (fundador incluido) se lista por defecto. */}
        {query && (
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">
            {total} resultado{total !== 1 ? 's' : ''} para <span className="text-gray-600">"{query}"</span>
          </p>
        )}

        {/* LISTADO */}
        <div className={`flex flex-col gap-3 ${query ? '' : 'mt-1'}`}>
          {filtrados.map(a => (
            <ListingRow
              key={a.id}
              to={`/artista/${a.id}`}
              nombre={a.nombre}
              municipio={a.municipio}
              estilo={a.estilo}
              bio={a.bio}
              foto={a.foto_url}
            />
          ))}

          {query && total === 0 && (
            <div className="text-center py-6 text-gray-400 text-sm">
              No hay artistas con esa búsqueda por ahora.
            </div>
          )}
        </div>

        {/* RECLUTAMIENTO — siempre visible debajo de la búsqueda, sea cual
            sea el estado (Jose, 2026-08-04: "deberán aparecer siempre
            debajo en la búsqueda, pero en una card... con informaciones
            persuasivas"). Antes solo aparecía con búsqueda activa. */}
        <TarjetaReclutamiento query={query} total={total} compartir={compartir} />
      </section>

      <footer className="border-t border-gray-200 py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-400 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} Tattoo Artist Urabá — INKognito. Todos los derechos reservados.</p>
          <span className="text-gray-300">Desarrollado por INKognito</span>
        </div>
      </footer>
    </div>
  )
}
