import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { Search, MapPin, Palette, BadgeCheck, ChevronRight, Navigation, LoaderCircle } from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'

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

export async function loader() {
  // La foto del fundador (Jose Humanez) reusa la misma que ya tiene subida
  // en jhumaneztattoo (Configuración > Imágenes > Hero) — no hace falta
  // subirla de nuevo, ni el módulo tiene su propia fila en `artistas`.
  let fundadorFoto = null
  try {
    const heroRes = await fetch(`${PANEL_URL}/api/jhumaneztattoo/hero`)
    if (heroRes.ok) fundadorFoto = (await heroRes.json()).image_url || null
  } catch {
    fundadorFoto = null
  }
  try {
    const res = await fetch(`${PANEL_URL}/api/artistas`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return { artistas: await res.json(), fundadorFoto }
  } catch {
    return { artistas: [], fundadorFoto }
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

function ListingRow({ to, nombre, municipio, estilo, bio, foto, featured }) {
  return (
    <Link
      to={to}
      className={`group flex items-center gap-4 p-3 md:p-4 rounded-lg border transition-all duration-200 ${
        featured ? 'bg-white' : 'border-gray-200 hover:border-gray-300 bg-gray-50/60 hover:bg-gray-50'
      }`}
      style={featured ? { borderColor: ACCENT } : {}}
    >
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
        {foto
          ? <img src={foto} alt={nombre} className="w-full h-full object-cover" loading="lazy" />
          : <span className="text-gray-300 text-2xl font-black">{nombre?.[0]?.toUpperCase() || '?'}</span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-black uppercase text-sm leading-tight truncate text-gray-900">{nombre}</p>
          {featured ? (
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: ACCENT, color: 'white' }}>
              Fundador
            </span>
          ) : (
            <VerifiedBadge />
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="flex items-center gap-1 text-gray-500 text-[11px] uppercase tracking-wide">
            <MapPin size={11} />
            {municipio}
          </span>
          {estilo && (
            <span className="flex items-center gap-1 text-gray-500 text-[11px] uppercase tracking-wide">
              <Palette size={11} />
              {estilo}
            </span>
          )}
        </div>
        {bio && <p className="text-gray-400 text-xs mt-1 truncate">{bio}</p>}
      </div>
      <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors" />
    </Link>
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
  const { artistas, fundadorFoto } = useLoaderData()
  const [query, setQuery] = useState('')
  const [ubicando, setUbicando] = useState(false)
  const [ubicacionError, setUbicacionError] = useState(null)

  const q = query.trim().toLowerCase()
  const matches = (...campos) => q === '' || campos.some(c => c && c.toLowerCase().includes(q))

  // Sin búsqueda activa no se lista NINGÚN artista, fundador incluido —
  // por ahora se comporta igual que los demás, solo aparece al buscar su
  // nombre o "Chigorodó" (Jose, 2026-08-03: "de momento dejala como las
  // demas... ya veremos como hacemos par ponerla fija visible" — fijarlo
  // queda pendiente para una vuelta futura).
  const filtrados = q === '' ? [] : artistas.filter(a => matches(a.nombre, a.municipio, a.estilo))
  const fundadorVisible = q !== '' && matches('Jose Humanez', 'Chigorodó')
  const total = filtrados.length + (fundadorVisible ? 1 : 0)

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

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <NavbarArtistas />

      <section className="relative overflow-hidden pt-20 pb-8 md:pb-10 px-4 md:px-6">
        <div className="absolute inset-0 opacity-[0.05]" style={DOT_PATTERN} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-black uppercase leading-[0.95] mb-5">
            Encuentra tu <span style={{ color: ACCENT }}>tatuador</span>
          </h1>
          <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Artistas de tatuaje respaldados por INKognito en toda la región de Urabá. Busca por nombre, municipio o estilo — o deja que detectemos dónde estás.
          </p>

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
        </div>
      </section>

      <section className="px-4 md:px-6 pb-16 max-w-3xl mx-auto">

        {/* CONTADOR — solo tiene sentido con búsqueda activa, ningún
            artista (fundador incluido) se lista por defecto. */}
        {query && (
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">
            {total} resultado{total !== 1 ? 's' : ''} para <span className="text-gray-600">"{query}"</span>
          </p>
        )}

        {/* LISTADO */}
        <div className={`flex flex-col gap-3 ${query ? '' : 'mt-1'}`}>
          {fundadorVisible && (
            <ListingRow to="/jhumaneztattoo" nombre="Jose Humanez" municipio="Chigorodó" foto={fundadorFoto} featured />
          )}

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

          {total === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">
              No hay artistas con esa búsqueda por ahora.
            </div>
          )}
        </div>
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
