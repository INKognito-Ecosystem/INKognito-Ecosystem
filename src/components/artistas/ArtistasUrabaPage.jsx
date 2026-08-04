import { useEffect, useRef, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { Search, MapPin, Palette, BadgeCheck, ChevronRight, Navigation, LoaderCircle, Share2 } from 'lucide-react'
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
    return { artistas: await res.json(), fundadorFoto, municipioDetectado }
  } catch {
    return { artistas: [], fundadorFoto, municipioDetectado }
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

// Módulo nuevo (2026-08-03), desplegado sin exponer aún — ver plan de
// "Directorio de artistas de tatuaje en Urabá". Tercera vuelta de diseño
// el mismo día: v1 (grid de fotos negro) genérica; v2 (pills municipio +
// pills estilo sobre negro) se sentía a pestañas; ahora Jose pidió pasar
// a paleta blanco/rojo/gris (en vez del negro original) y mover el
// nombre del módulo al navbar propio (NavbarArtistas.jsx) — el eyebrow
// "Tattoo Artist Urabá" que vivía arriba del H1 alejaba demasiado el
// título del navbar.
export default function ArtistasUrabaPage() {
  const { artistas, fundadorFoto, municipioDetectado } = useLoaderData()
  const [query, setQuery] = useState('')
  const [ubicando, setUbicando] = useState(false)
  const [ubicacionError, setUbicacionError] = useState(null)
  const listadoRef = useRef(null)
  const prevVacioRef = useRef(true)

  const q = normalize(query.trim())
  const matches = (...campos) => q === '' || campos.some(c => c && normalize(c).includes(q))

  // Sin búsqueda activa no se lista NINGÚN artista, fundador incluido —
  // por ahora se comporta igual que los demás, solo aparece al buscar su
  // nombre o "Chigorodó" (Jose, 2026-08-03: "de momento dejala como las
  // demas... ya veremos como hacemos par ponerla fija visible" — fijarlo
  // queda pendiente para una vuelta futura).
  const filtrados = q === '' ? [] : artistas.filter(a => matches(a.nombre, a.municipio, a.estilo))
  const fundadorVisible = q !== '' && matches('Jose Humanez', 'Chigorodó')
  const total = filtrados.length + (fundadorVisible ? 1 : 0)

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
    <div className="min-h-screen bg-white text-gray-900">
      <NavbarArtistas />

      <section className="relative overflow-hidden pt-20 pb-8 md:pb-10 px-4 md:px-6">
        <div className="absolute inset-0 opacity-[0.05]" style={DOT_PATTERN} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-black uppercase leading-[0.95] mb-5">
            Encuentra tu <span style={{ color: ACCENT }}>tatuador</span>
          </h1>
          <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            El buscador que conecta clientes con tatuadores de Urabá, respaldados por INKognito. Busca por nombre, municipio o estilo — o deja que detectemos dónde estás.
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

      <section ref={listadoRef} className="px-4 md:px-6 pb-16 max-w-3xl mx-auto scroll-mt-20">

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

          {/* RECLUTAMIENTO — mensaje distinto según si ya hay artistas o
              no (Jose, 2026-08-04): "sé el primero" solo tiene sentido
              cuando de verdad no hay nadie; si ya hay artistas, el ángulo
              es sumarse a ellos, no ser "el primero" (sería falso). Ambos
              casos incluyen la invitación a compartir para quien no es
              tatuador — mismo patrón de Tattoodo, en su propio tono. */}
          {query && total === 0 && (
            <div className="text-center py-10 px-4">
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
                Todavía no hay ningún tatuador registrado para "{query}" — sé el primero en aparecer en el buscador que conecta clientes con artistas en Urabá.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
                <Link
                  to="/tattoo-artist-uraba/unete"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: ACCENT }}
                >
                  ¿Eres tatuador? Únete
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
          )}

          {query && total > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-200 text-center">
              <p className="text-gray-400 text-xs">
                ¿Eres tatuador en Urabá y no apareces aquí?{' '}
                <Link to="/tattoo-artist-uraba/unete" className="font-bold" style={{ color: ACCENT }}>
                  {total === 1 ? 'Únete al artista que ya está' : `Únete a los ${total} artistas que ya están`}
                </Link>
              </p>
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
