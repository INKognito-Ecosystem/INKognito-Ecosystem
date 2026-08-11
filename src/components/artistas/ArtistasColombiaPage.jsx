import { useEffect, useRef, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { Search, MapPin, Palette, BadgeCheck, ChevronRight, Navigation, LoaderCircle, Share2, Sparkles, Check, Building2 } from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'
import { normalize, municipioDesdeNombreIP, getCoordsMunicipio, distanciaKm } from '../../data/colombiaGeo'
import { artistaUrl } from './artistaSlug'
import { cloudinaryFill } from '../../lib/cloudinary'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
// Psicología del color (2026-08-05, decisión final tras probar "todo
// rojo" y "todo gris"): ninguno de los dos extremos — rojo repetido en
// insignias/checkmarks/puntos compite consigo mismo y se lee como alerta,
// no invitación; gris total no le dice al ojo qué es lo importante. ACCENT
// vuelve a ser rojo, pero reservado para UNA sola acción principal por
// pantalla (acá: "Unirme como artista") — el resto de elementos usa clases
// gray-* de Tailwind directamente, ya no depende de esta constante.
const ACCENT = '#B3202F'

// Tolerancia a errores de tipeo en la búsqueda (2026-08-09, Jose: "cuál
// es el problema de arreglar eso desde ya" — antes un typo como
// "Medallin" en vez de "Medellín" no encontraba nada, aunque hubiera
// poquísimos artistas en la base; no es un problema de escala, es de
// calidad de búsqueda hoy mismo). Mismo algoritmo (Levenshtein) que ya
// usa el panel para detectar productos parecidos en el catálogo maestro
// (server.js, `_levenshtein`/`_similitudTexto`) — acá en el navegador
// porque esta búsqueda es 100% client-side sobre la lista ya cargada.
function levenshtein(a, b) {
  const m = a.length, n = b.length
  if (!m) return n
  if (!n) return m
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}
function similitud(a, b) {
  const maxLen = Math.max(a.length, b.length) || 1
  return 1 - levenshtein(a, b) / maxLen
}
// Umbral 0.75 — tolera 1-2 letras distintas en una palabra típica (ej.
// "medallin" vs "medellin" ya da 0.875). Palabras de menos de 3 letras no
// entran a esta comparación (demasiado cortas para que la similitud
// signifique algo — "el"/"de" siempre estarían "cerca" de cualquier cosa).
const UMBRAL_SIMILITUD = 0.75

// Puntitos oscuros y muy sutiles sobre fondo blanco (antes eran claros
// sobre negro) — mismo recurso visual, paleta invertida.
const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(0,0,0,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

export async function loader({ request }) {
  // Categoría inicial desde el link del menú (fase 6.5, 2026-08-07, Jose:
  // "búsqueda sectorizada... buscar estudios cerca") — mismo patrón que
  // ?flechas=0 en las páginas de marca: un query param que otro punto del
  // sitio (acá, NavbarArtistas.jsx) usa para aterrizar directo en un
  // estado específico, sin tocar nada del resto de la página.
  // Pestaña "Todos" eliminada (2026-08-11, Jose) — solo quedan Artistas y
  // Estudios; sin parámetro explícito, se aterriza en Artistas por defecto.
  const categoriaParam = new URL(request.url).searchParams.get('categoria')
  const categoriaInicial = categoriaParam === 'estudios' ? 'estudios' : 'artistas'

  // Geolocalización por IP vía el header x-vercel-ip-city que Vercel
  // inyecta en producción. Diagnosticado 2026-08-04: para pueblos chicos
  // (ej. Chigorodó) el proveedor de geolocalización de Vercel/MaxMind no
  // siempre resuelve una IP a nivel de ciudad — llega vacío. Cuando eso
  // pasa, esto degrada solo (el navbar se queda en "Colombia" fijo) y el
  // visitante sigue teniendo el botón "Cerca de ti" (GPS real del
  // navegador), que no depende de esto y siempre funciona si da permiso.
  let ciudadDetectada = null
  try {
    const ipCity = request.headers.get('x-vercel-ip-city')
    if (ipCity) ciudadDetectada = municipioDesdeNombreIP(decodeURIComponent(ipCity))
  } catch {
    ciudadDetectada = null
  }

  // v3 (2026-08-11, Jose: "que tal si cuando recién alguien entra al
  // buscador no ve ningún artista aún... solo si escribe algo o usa
  // cerca de mí aparecen") — ya no se precarga NADA en el servidor, ni
  // por región ni por país completo. La IP (ciudadDetectada) solo se usa
  // para la sugerencia "¿Buscas tatuadores en X?" (ver más abajo en el
  // render) — nunca para decidir qué traer. Esto también resuelve de raíz
  // el caso sin señal (Chigorodó): ya no hay una rama especial que se
  // comporte distinto, todos empiezan igual, vacío, sin importar si su IP
  // resolvió o no. Los datos reales se piden bajo demanda desde el
  // navegador (ver `cargarDatos` en el componente) recién cuando la
  // persona escribe algo o toca "Cerca de ti".
  return { ciudadDetectada, categoriaInicial }
}

export function meta() {
  const title = 'Tattoo Artist Colombia | Directorio de tatuadores — INKognito'
  const description = 'Encuentra tatuadores en toda Colombia. Portafolio, estilo y contacto directo por WhatsApp.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/tattoo-artist-colombia` },
  ]
}

// Coordenadas reales de un artista: prioriza su punto EXACTO (lat/lng
// propios, capturados con permiso al registrarse) sobre el centroide de
// su municipio — es lo que distingue a dos artistas "del mismo municipio"
// dentro de una ciudad grande (2026-08-05). Se usa tanto para ordenar el
// listado de búsqueda como el carrusel "Artistas más cercanos".
function coordsDeArtista(a) {
  return (a.lat != null && a.lng != null) ? { lat: a.lat, lng: a.lng } : getCoordsMunicipio(a.departamento, a.municipio)
}

// Mismo criterio para estudios (fase 3, 2026-08-06) — punto exacto si lo
// capturó (ver "Agregar ubicación exacta" en su dashboard), si no, el
// centroide de su municipio.
function coordsDeEstudio(e) {
  return (e.lat != null && e.lng != null) ? { lat: e.lat, lng: e.lng } : getCoordsMunicipio(e.departamento, e.municipio)
}

// Ordena una lista por cercanía real a un punto — devuelve una copia
// nueva, estable (sin coords conocidas quedan al final, sin alterar su
// orden relativo). Si no hay `desde` (ubicación del visitante
// desconocida), devuelve la lista tal cual llegó. `coordsFn` generalizado
// (2026-08-06) para reusar esto mismo con estudios, sin duplicar la
// lógica de ordenamiento — default artistas para no tocar los usos ya
// existentes.
function ordenarPorCercania(lista, desde, coordsFn = coordsDeArtista) {
  if (!desde) return lista
  return [...lista].sort((a, b) => {
    const ca = coordsFn(a)
    const cb = coordsFn(b)
    if (!ca && !cb) return 0
    if (!ca) return 1
    if (!cb) return -1
    return distanciaKm(desde.lat, desde.lng, ca.lat, ca.lng) - distanciaKm(desde.lat, desde.lng, cb.lat, cb.lng)
  })
}

const DIAS_ARTISTA_NUEVO = 14

function esArtistaNuevo(createdAt) {
  if (!createdAt) return false
  const dias = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  return dias >= 0 && dias <= DIAS_ARTISTA_NUEVO
}

// Umbral de largo de texto para decidir si "especialidades"/"sobre mí"
// caben en la fila compacta de una card o se vuelven un botón que abre el
// modal inferior (Jose, 2026-08-05: "si las especialidades son varias, y
// no caben en la card, deberán volverse un boton... lo mismo pasara con
// el sobre mi, si el texto es muy largo"). Compartido entre ArtistaCercanoCard
// y ListingRow — sin medir el DOM real, un umbral de caracteres alcanza.
const ESTILO_BOTON_MIN = 18
const BIO_BOTON_MIN = 45

// Card ancha del carrusel "Artistas más cercanos" (2026-08-05, pedido de
// Jose tras ver cómo Tattoodo sugiere artistas cercanos sin que el
// visitante busque nada — "como sugerencias parecido a cuando facebook
// las muestra"). Deliberadamente más grande que ListingRow (fotos de
// trabajo primero, como una vitrina) — ListingRow sigue siendo la fila
// compacta de RESULTADOS DE BÚSQUEDA, esta es la de descubrimiento.
//
// v2 (2026-08-05) — v1 montaba el avatar con margen negativo para que
// "flotara" sobre las fotos de trabajo, estilo portada de Facebook — pero
// con fotos reales (no el placeholder de letra que se usó al verificar
// v1) el avatar quedaba parcialmente tapado por ellas (Jose: "las fotos
// de arriba mocharon el circulo"). Se cambia a un layout más simple y sin
// solapamientos: avatar en línea junto al nombre, como ya hace
// ListingRow — mismo patrón en todo el módulo, cero riesgo de que una
// imagen tape a otra. También se agregan estilo/bio (antes solo mostraba
// municipio+departamento), reusando el mismo botón-que-abre-modal que ya
// existe en ListingRow en vez de duplicar esa lógica.
// full (2026-08-09, Jose: quiere que los resultados de la pestaña
// Artistas se vean con portada como en Todos, no la fila compacta de
// ListingRow — "más estilo redes sociales", scroll vertical, una card
// completa debajo de otra) — mismo componente que ya usaba el carrusel
// "Artistas más cercanos", solo cambia el contenedor: ancho fijo +
// snap-scroll (carrusel horizontal) vs. ancho completo (feed vertical).
function ArtistaCercanoCard({ a, distanciaTexto, onVerInfo, full = false }) {
  const fotos = [a.foto_trabajo_1, a.foto_trabajo_2].filter(Boolean)
  const nuevo = esArtistaNuevo(a.created_at)
  const abrirInfo = (e) => { e.preventDefault(); e.stopPropagation(); onVerInfo() }

  return (
    <Link
      to={artistaUrl(a)}
      className={`${full ? 'w-full' : 'flex-shrink-0 w-56 snap-start'} rounded-xl border border-gray-200 hover:border-gray-300 bg-white overflow-hidden transition-colors`}
    >
      <div className={`relative bg-gray-100 flex gap-0.5 ${full ? 'h-48 sm:h-56' : 'h-28'}`}>
        {/* El ancho pedido a Cloudinary se reparte entre las fotos que de
            verdad comparten la fila (2026-08-11, bug real: antes se pedía
            el mismo recorte ancho sin importar si había 1 o 2 fotos —
            con 2 lado a lado, cada una es casi cuadrada, no panorámica,
            y el recorte inteligente (g_auto) elegía mal el encuadre). */}
        {fotos.length > 0 ? fotos.map((f, i) => (
          <img key={i} src={cloudinaryFill(f, Math.round((full ? 500 : 250) / fotos.length), full ? 320 : 150)} alt="" className="flex-1 h-full object-cover" loading="lazy" />
        )) : (
          <div className="flex-1 h-full flex items-center justify-center text-gray-300 text-3xl font-black">
            {a.nombre?.[0]?.toUpperCase() || '?'}
          </div>
        )}
        {nuevo && (
          <span className="absolute top-2 left-2 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full text-white bg-gray-600">
            Nuevo artista
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2 flex-nowrap">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
            {a.foto_url
              ? <img src={cloudinaryFill(a.foto_url, 80, 80)} alt={a.nombre} className="w-full h-full object-cover" loading="lazy" />
              : <span className="text-gray-300 text-[10px] font-black">{a.nombre?.[0]?.toUpperCase() || '?'}</span>}
          </div>
          <p className="font-black uppercase text-xs leading-tight truncate text-gray-900 min-w-0 flex-1">{a.nombre}</p>
          <BadgeCheck size={13} className="flex-shrink-0 text-gray-600" />
        </div>
        <p className="text-gray-500 text-[10px] uppercase tracking-wide mt-1.5 truncate">
          {a.municipio}{a.departamento ? `, ${a.departamento}` : ''}
        </p>
        {a.estilo && (
          a.estilo.length > ESTILO_BOTON_MIN ? (
            <button type="button" onClick={abrirInfo} className="text-[10px] font-bold uppercase tracking-wide underline underline-offset-2 mt-1 text-gray-600">
              Especialidades
            </button>
          ) : (
            <p className="text-gray-500 text-[10px] uppercase tracking-wide mt-1 truncate">{a.estilo}</p>
          )
        )}
        {a.bio && (
          a.bio.length > BIO_BOTON_MIN ? (
            <button type="button" onClick={abrirInfo} className="block w-full text-left text-gray-400 text-[10px] mt-1 truncate underline underline-offset-2 decoration-gray-300">
              {a.bio}
            </button>
          ) : (
            <p className="text-gray-400 text-[10px] mt-1 truncate">{a.bio}</p>
          )
        )}
        {distanciaTexto && (
          <p className="text-gray-400 text-[10px] mt-1">A {distanciaTexto} km de distancia</p>
        )}
      </div>
    </Link>
  )
}

// Mellizo de ArtistaCercanoCard para estudios (fase 3, 2026-08-06) — sin
// "especialidades" (los estudios no tienen estilo propio, cada artista
// adentro tiene el suyo) y con foto_portada/logo_url en vez de
// foto_trabajo_1/2 + foto_url.
// full — mismo criterio que ArtistaCercanoCard (2026-08-09): resultados de
// la pestaña Estudios con portada completa, feed vertical, en vez de la
// fila compacta de ListingRow.
function EstudioCercanoCard({ e, distanciaTexto, onVerInfo, full = false }) {
  // Descripción con el mismo umbral "ver más" que ya usa ArtistaCercanoCard
  // (2026-08-07, bug real: esta card nunca mostró bio, ni truncada ni
  // completa — Jose lo notó comparando contra la de artistas).
  const abrirInfo = (e_) => { e_.preventDefault(); e_.stopPropagation(); onVerInfo() }
  return (
    <Link
      to={`/tattoo-artist-colombia/estudio/${e.id}`}
      className={`${full ? 'w-full' : 'flex-shrink-0 w-56 snap-start'} rounded-xl border border-gray-200 hover:border-gray-300 bg-white overflow-hidden transition-colors`}
    >
      <div className={`relative bg-gray-100 ${full ? 'h-48 sm:h-56' : 'h-28'}`}>
        {e.foto_portada ? (
          <img src={cloudinaryFill(e.foto_portada, full ? 500 : 250, full ? 320 : 150)} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl font-black">{e.nombre?.[0]?.toUpperCase() || '?'}</div>
        )}
        <span className="absolute top-2 left-2 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full text-white bg-gray-600">
          Estudio
        </span>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2 flex-nowrap">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
            {e.logo_url
              ? <img src={cloudinaryFill(e.logo_url, 80, 80)} alt={e.nombre} className="w-full h-full object-cover" loading="lazy" />
              : <span className="text-gray-300 text-[10px] font-black">{e.nombre?.[0]?.toUpperCase() || '?'}</span>}
          </div>
          <p className="font-black uppercase text-xs leading-tight truncate text-gray-900 min-w-0 flex-1">{e.nombre}</p>
        </div>
        <p className="text-gray-500 text-[10px] uppercase tracking-wide mt-1.5 truncate">
          {e.municipio}{e.departamento ? `, ${e.departamento}` : ''}
        </p>
        {e.bio && (
          e.bio.length > BIO_BOTON_MIN ? (
            <button type="button" onClick={abrirInfo} className="block w-full text-left text-gray-400 text-[10px] mt-1 truncate underline underline-offset-2 decoration-gray-300">
              {e.bio}
            </button>
          ) : (
            <p className="text-gray-400 text-[10px] mt-1 truncate">{e.bio}</p>
          )
        )}
        {distanciaTexto && (
          <p className="text-gray-400 text-[10px] mt-1">A {distanciaTexto} km de distancia</p>
        )}
      </div>
    </Link>
  )
}

// Insignia sola-ícono en la esquina de la card (2026-08-05, antes era un
// pill con texto "Verificado" en la misma fila que el nombre — Jose pidió
// que vaya "en el estremo de la card" solo con el ícono). Se posiciona
// absoluta sobre la card, que ahora necesita `relative`.
function VerifiedBadge() {
  return (
    <span
      className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 bg-gray-600"
      title="Verificado"
    >
      <BadgeCheck size={11} className="text-white" />
    </span>
  )
}

function ListingRow({ to, nombre, municipio, estilo, bio, foto, onVerInfo, kicker }) {
  // Los botones de "ver más" viven DENTRO de un <Link> que navega al
  // perfil completo — sin esto, tocarlos también dispara la navegación.
  const abrirInfo = (e) => { e.preventDefault(); e.stopPropagation(); onVerInfo() }

  return (
    <Link
      to={to}
      className="group relative flex items-center gap-4 p-3 md:p-4 rounded-lg border border-gray-200 hover:border-gray-300 bg-gray-50/60 hover:bg-gray-50 transition-all duration-200"
    >
      <VerifiedBadge />
      {/* Foto/logo más grande (2026-08-07, Jose: "que ocupe espacio... más
          grande, mejor visibilidad, parecido a el perfil") — antes 64-80px
          se veía chico comparado con el avatar real del perfil (~96-128px);
          ahora se acerca a esa escala. */}
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
        {foto
          ? <img src={cloudinaryFill(foto, 250, 250)} alt={nombre} className="w-full h-full object-cover" loading="lazy" />
          : <span className="text-gray-300 text-3xl font-black">{nombre?.[0]?.toUpperCase() || '?'}</span>}
      </div>
      <div className="flex-1 min-w-0 pr-5">
        {/* pr-5 en el contenedor de texto le deja espacio a la insignia de
            la esquina — sin esto el nombre largo quedaba debajo del ícono. */}
        {/* kicker (fase 6.4, 2026-08-07, Jose: "marca profesional debería
            estar debajo o encima del nombre, tal como se muestra cuando
            entro a una marca") — mismo texto que ya vive en la página de
            la marca, ahora también visible acá en el resultado de
            búsqueda, no solo al entrar. */}
        {kicker && <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest leading-tight">{kicker}</p>}
        <p className="font-black uppercase text-sm leading-tight truncate text-gray-900">{nombre}</p>
        <div className="flex items-center gap-3 mt-0.5 flex-nowrap min-w-0">
          <span className="flex items-center gap-1 text-gray-500 text-[11px] uppercase tracking-wide leading-snug flex-shrink-0">
            <MapPin size={11} />
            {municipio}
          </span>
          {estilo && (
            estilo.length > ESTILO_BOTON_MIN ? (
              <button
                type="button"
                onClick={abrirInfo}
                className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide flex-shrink-0 underline underline-offset-2 text-gray-600"
              >
                <Palette size={11} />
                Especialidades
              </button>
            ) : (
              <span className="flex items-center gap-1 text-gray-500 text-[11px] uppercase tracking-wide leading-snug min-w-0">
                <Palette size={11} className="flex-shrink-0" />
                <span className="truncate">{estilo}</span>
              </span>
            )
          )}
        </div>
        {bio && (
          bio.length > BIO_BOTON_MIN ? (
            <button
              type="button"
              onClick={abrirInfo}
              className="text-gray-400 text-xs mt-0.5 leading-snug truncate text-left underline underline-offset-2 decoration-gray-300 block w-full"
            >
              {bio}
            </button>
          ) : (
            <p className="text-gray-400 text-xs mt-0.5 leading-snug truncate">{bio}</p>
          )
        )}
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
    ? '¿Eres tatuador? Únete gratis'
    : total === 0
      ? `Todavía no hay tatuadores para "${query}"`
      : `Ya hay ${total} artista${total !== 1 ? 's' : ''} en "${query}"`
  const subtitulo = !query
    ? 'Crea tu perfil en minutos y empieza a aparecer en las búsquedas de tu zona.'
    : total === 0
      ? 'Sé el primero en aparecer aquí.'
      : 'Súmate y aparece junto a ellos.'

  return (
    <div className="mt-6 rounded-xl border-2 border-gray-200 bg-gray-50 p-5 md:p-6">
      {/* El ícono solo ocupa la fila del encabezado — antes envolvía
          también el checklist y los botones, dejando un espacio vacío a
          la izquierda en cada línea de esos bloques (Jose, 2026-08-04).
          Checklist y botones ahora van a todo el ancho de la card. */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-600">
          <Sparkles size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black uppercase text-sm text-gray-900 leading-tight">{encabezado}</p>
          <p className="text-gray-500 text-xs mt-0.5">{subtitulo}</p>
        </div>
      </div>

      <ul className="mt-3 space-y-1.5">
        <li className="flex items-center gap-2 text-xs text-gray-600">
          <Check size={13} className="flex-shrink-0 text-gray-500" />
          Apareces en las búsquedas de tu municipio
        </li>
        <li className="flex items-center gap-2 text-xs text-gray-600">
          <Check size={13} className="flex-shrink-0 text-gray-500" />
          Contacto directo por WhatsApp, sin intermediarios
        </li>
        <li className="flex items-center gap-2 text-xs text-gray-600">
          <Check size={13} className="flex-shrink-0 text-gray-500" />
          Vende tus diseños y láminas directo desde tu perfil
        </li>
        <li className="flex items-center gap-2 text-xs text-gray-600">
          <Check size={13} className="flex-shrink-0 text-gray-500" />
          Agenda citas y cobra el abono en línea, sin negociar por WhatsApp
        </li>
      </ul>

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <Link
          to="/tattoo-artist-colombia/unete"
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
  )
}

// Tarjeta de reclutamiento para ESTUDIOS (2026-08-09, Jose: "cuando estoy
// sobre la pestaña artistas, abajo me muestra una card que invita al
// artista a unirse gratis, pero cuando me paro en estudios no hay una que
// corresponda" — mismo patrón que TarjetaReclutamiento de arriba, pero con
// los beneficios reales que le importan a un ESTUDIO, no a un artista
// individual: roster de su equipo, tienda propia en Supply con Mercado
// Pago (cobra directo, cero retención), autoservicio de catálogo. Pedido
// explícito de Jose: "sumamente profesional... super informativa" — por
// eso 5 puntos en vez de los 3 de la de artistas, no un calco reducido.
function TarjetaReclutamientoEstudio({ query, total, compartir }) {
  const encabezado = !query
    ? '¿Tienes un estudio de tatuajes? Únete gratis'
    : total === 0
      ? `Todavía no hay estudios para "${query}"`
      : `Ya hay ${total} estudio${total !== 1 ? 's' : ''} en "${query}"`
  const subtitulo = !query
    ? 'Crea el perfil de tu estudio, suma a tu equipo de artistas y abre tu propia tienda en INKognito Supply.'
    : total === 0
      ? 'Sé el primer estudio en aparecer aquí.'
      : 'Súmate y aparece junto a ellos.'

  return (
    <div className="mt-6 rounded-xl border-2 border-gray-200 bg-gray-50 p-5 md:p-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-600">
          <Building2 size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black uppercase text-sm text-gray-900 leading-tight">{encabezado}</p>
          <p className="text-gray-500 text-xs mt-0.5">{subtitulo}</p>
        </div>
      </div>

      <ul className="mt-3 space-y-1.5">
        <li className="flex items-center gap-2 text-xs text-gray-600">
          <Check size={13} className="flex-shrink-0 text-gray-500" />
          Perfil profesional del estudio, visible en las búsquedas de tu municipio
        </li>
        <li className="flex items-center gap-2 text-xs text-gray-600">
          <Check size={13} className="flex-shrink-0 text-gray-500" />
          Suma a los artistas de tu equipo bajo el mismo perfil
        </li>
        <li className="flex items-center gap-2 text-xs text-gray-600">
          <Check size={13} className="flex-shrink-0 text-gray-500" />
          Tienda propia en INKognito Supply — cobras directo por Mercado Pago, sin que te retengamos tu dinero
        </li>
        <li className="flex items-center gap-2 text-xs text-gray-600">
          <Check size={13} className="flex-shrink-0 text-gray-500" />
          Subes tu propio catálogo cuando quieras, sin depender de nadie más
        </li>
      </ul>

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <Link
          to="/tattoo-artist-colombia/estudio/unete"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
          style={{ backgroundColor: ACCENT }}
        >
          Registrar mi estudio
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
  )
}

// Card informativa para quien BUSCA (no para quien se quiere registrar) —
// 2026-08-11, Jose: "así como mostramos una card que invita a estudios y
// artistas a unirse, creo que también debería haber unas que inviten a los
// usuarios a usar este sitio... sumamente informativas y claras con lo que
// encontrarán, según la pestaña en la que estén". Vive arriba de
// TarjetaReclutamiento/TarjetaReclutamientoEstudio (pedido explícito de
// posición), siempre visible como ellas — pero a propósito NO es un CTA:
// fondo blanco, borde de 1px, ícono en círculo gris claro (no sólido) y sin
// botones, para que se lea como información de confianza y no compita
// visualmente con el único botón rojo de la pantalla (la de reclutamiento).
function TarjetaInfoVisitante({ categoria }) {
  const config = {
    todos: {
      icon: Search,
      titulo: 'Qué vas a encontrar acá',
      texto: 'Un directorio de tatuadores y estudios verificados en toda Colombia. Portafolio real, estilo, disponibilidad y qué tan cerca está cada uno de ti. Compra sus diseños y láminas o agenda tu cita en línea, sin escribir primero — y si prefieres, escríbele directo por WhatsApp.',
    },
    artistas: {
      icon: Palette,
      titulo: 'Qué vas a encontrar en cada perfil de artista',
      texto: 'Portafolio de trabajos reales, estilo, disponibilidad y ubicación exacta — no aproximada. Compra sus diseños y láminas o agenda tu cita en línea directo desde su perfil, con contacto por WhatsApp si lo necesitas.',
    },
    estudios: {
      icon: Building2,
      titulo: 'Qué vas a encontrar en cada perfil de estudio',
      texto: 'El equipo completo de artistas que trabaja ahí, su ubicación, y — si el estudio vende insumos — su propio catálogo de INKognito Supply. Entra al perfil de cada artista para ver sus diseños, láminas y agendar en línea.',
    },
  }
  const { icon: Icon, titulo, texto } = config[categoria] || config.todos

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 md:p-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100">
          <Icon size={18} className="text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black uppercase text-sm text-gray-900 leading-tight">{titulo}</p>
          <p className="text-gray-500 text-xs mt-1 leading-relaxed">{texto}</p>
        </div>
      </div>
    </div>
  )
}

// Modal inferior compartido — "Sobre mí" + "Especialidades" completos de
// un artista (2026-08-05, pedido de Jose: cuando el estilo/bio no caben en
// la card compacta de resultados, un botón abre esto en vez de estirar la
// card). Mismo patrón bottom-sheet ya usado en Supply/Store/Suple
// (overlay + panel que sube desde abajo, ver SupplyProductCard.jsx), acá
// en la paleta blanco/rojo/gris del módulo en vez del negro de Supply.
function ModalInfoArtista({ artista, onClose }) {
  if (!artista) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white border-t border-gray-200 rounded-t-2xl p-5 max-h-[75vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">{artista.nombre}</h4>
          <button onClick={onClose} aria-label="Cerrar" className="text-gray-400 text-lg leading-none px-1">✕</button>
        </div>
        {artista.bio && (
          <div className="mb-4">
            <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Sobre mí</p>
            <p className="text-gray-700 text-sm leading-relaxed">{artista.bio}</p>
          </div>
        )}
        {artista.estilo && (
          <div>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Especialidades</p>
            <p className="text-gray-700 text-sm leading-relaxed">{artista.estilo}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Módulo nuevo (2026-08-03), desplegado sin exponer aún — ver plan de
// "Directorio de artistas de tatuaje en Urabá" (nombre original del plan;
// el módulo pasó a llamarse "Tattoo Artist Colombia" el 2026-08-04 con la
// expansión nacional del registro — ver NavbarArtistas.jsx). Tercera vuelta
// de diseño el mismo día: v1 (grid de fotos negro) genérica; v2 (pills
// municipio + pills estilo sobre negro) se sentía a pestañas; ahora Jose
// pidió pasar a paleta blanco/rojo/gris (en vez del negro original) y mover
// el nombre del módulo al navbar propio (NavbarArtistas.jsx) — el eyebrow
// que vivía arriba del H1 alejaba demasiado el título del navbar.
export default function ArtistasColombiaPage() {
  const { ciudadDetectada, categoriaInicial } = useLoaderData()
  // Nada se precarga desde el servidor (2026-08-11, ver comentario en el
  // loader) — arrancan vacíos y `cargarDatos()` los llena bajo demanda, la
  // primera vez que la persona escribe algo o toca "Cerca de ti".
  const [artistasData, setArtistasData] = useState([])
  const [estudiosData, setEstudiosData] = useState([])
  const [datosCargados, setDatosCargados] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [query, setQuery] = useState('')
  const [ubicando, setUbicando] = useState(false)
  const [ubicacionError, setUbicacionError] = useState(null)
  // Tooltips de onboarding, en secuencia (2026-08-11, Jose: "que aparezca
  // como cuando uno entra a una aplicación nueva que indica el por qué de
  // cada botón... solo la primera vez" — primero INK, y al dar "Entendido"
  // ahí recién aparece la de Cerca de ti, nunca las dos a la vez). Ambas
  // arrancan en `false` a propósito — el servidor no tiene localStorage,
  // así que deben coincidir con lo que se renderiza en el HTML inicial
  // (evita un mismatch de hidratación); recién en el useEffect de abajo,
  // ya en el navegador, se decide cuál mostrar.
  const [tooltipInkVisible, setTooltipInkVisible] = useState(false)
  const [tooltipUbicacionVisible, setTooltipUbicacionVisible] = useState(false)
  useEffect(() => {
    try {
      if (!localStorage.getItem('kg_tooltip_ink_visto')) {
        setTooltipInkVisible(true)
      } else if (!localStorage.getItem('kg_tooltip_cerca_de_ti_visto')) {
        setTooltipUbicacionVisible(true)
      }
    } catch {
      // localStorage puede fallar en navegación privada — sin tooltips, no rompe nada
    }
  }, [])
  const cerrarTooltipInk = () => {
    try {
      localStorage.setItem('kg_tooltip_ink_visto', '1')
      setTooltipInkVisible(false)
      // Encadena con la de Cerca de ti — Jose: "cuando yo le dé entendido,
      // entonces aparecerá la de cerca de ti".
      if (!localStorage.getItem('kg_tooltip_cerca_de_ti_visto')) setTooltipUbicacionVisible(true)
    } catch {
      setTooltipInkVisible(false)
    }
  }
  const cerrarTooltipUbicacion = () => {
    try { localStorage.setItem('kg_tooltip_cerca_de_ti_visto', '1') } catch {}
    setTooltipUbicacionVisible(false)
  }
  // Guarda un artista O un estudio (2026-08-07: la fila de estudios
  // reusaba ListingRow y su botón "ver más", pero onVerInfo era un no-op —
  // el botón no hacía nada, aunque se veía igual de clicable que el de un
  // artista). ModalInfoArtista solo lee nombre/bio/estilo, así que un
  // estudio (sin estilo) encaja sin cambios en el modal.
  const [modalArtista, setModalArtista] = useState(null)
  // "Cerca de ti" ya resuelto (2026-08-11) — a diferencia de escribir un
  // texto, acá se muestra TODO lo cargado ordenado por distancia real, sin
  // filtrar por coincidencia de nombre de municipio (antes un artista en un
  // municipio vecino al tuyo, con nombre distinto, simplemente no aparecía
  // aunque estuviera cerca). Se apaga apenas la persona vuelve a escribir —
  // ver el onChange del buscador más abajo.
  const [cercaDeTiActivo, setCercaDeTiActivo] = useState(false)
  const [categoria, setCategoria] = useState(categoriaInicial) // 'artistas' | 'estudios'
  // Coordenadas reales del visitante — de la geolocalización precisa del
  // navegador si tocó "Cerca de ti", o si no, del centroide de la ciudad
  // detectada por IP (menos preciso, pero mejor que nada). Con esto se
  // ordenan los resultados por cercanía real en vez de solo agrupar por
  // coincidencia de texto — es lo que resuelve el problema de precisión en
  // ciudades grandes (2026-08-04, ver informe de viabilidad): dos
  // artistas que "coinciden en municipio" con Bogotá pueden estar a 30km
  // de distancia entre sí, así que ordenar por distancia real importa más
  // que agruparlos como si fueran igual de cercanos.
  const [misCoords, setMisCoords] = useState(() =>
    ciudadDetectada ? getCoordsMunicipio(ciudadDetectada.departamento, ciudadDetectada.municipio) : null
  )
  const listadoRef = useRef(null)
  const prevVacioRef = useRef(true)

  const q = normalize(query.trim())
  const palabrasQuery = q.split(/\s+/).filter(Boolean)
  // Primero coincidencia exacta (rápida, cubre el 99% de los casos) — si
  // ningún campo la tiene, recién ahí se prueba tolerancia a tipeo:
  // CADA palabra escrita debe tener alguna palabra parecida (o contenida)
  // en el campo, para que "juan realismo" siga exigiendo las dos cosas,
  // no solo una.
  const matches = (...campos) => {
    if (q === '') return true
    // Con 1 sola letra, la coincidencia exacta por substring matchea casi
    // cualquier cosa (2026-08-11, Jose: "cualquier letra... activa todas
    // las marcas de prueba" — "Heaven Pro" contiene casi cualquier letra
    // suelta). Se pide al menos 2 caracteres antes de intentar coincidir,
    // igual que la mayoría de buscadores — mientras se escribe la primera
    // letra simplemente no hay resultados todavía, no resultados falsos.
    if (q.length < 2) return false
    if (campos.some(c => c && normalize(c).includes(q))) return true
    return campos.some(c => {
      if (!c) return false
      const palabrasCampo = normalize(c).split(/\s+/).filter(Boolean)
      return palabrasQuery.every(pq =>
        pq.length < 3 || palabrasCampo.some(pc => pc.includes(pq) || similitud(pq, pc) >= UMBRAL_SIMILITUD)
      )
    })
  }

  // Sin buscar nada todavía no se lista ningún artista (2026-08-11, Jose:
  // "que solo si escribe algo o usa cerca de mí aparecen") — el fundador
  // (Jose Humanez) tampoco tiene trato especial: se quitó el perfil fijo/
  // destacado — "vamos a usar la plataforma como cualquier tatuador más"
  // (Jose, 2026-08-04). Si quiere aparecer en el directorio, se registra
  // igual que cualquier artista.
  // La bio SÍ entra en la búsqueda (2026-08-05, Jose preguntó directo si
  // ayudaba o si solo contaba el municipio — antes NO se incluía, así que
  // era puramente informativa). Por eso el campo del formulario dejó de
  // decir "bio corta, 1-2 líneas sobre ti" — ahora si un artista escribe
  // "puntillismo" o "acuarela" en su bio, alguien que busque esa palabra
  // sí lo va a encontrar, no solo por nombre/municipio/estilo.
  // cercaDeTiActivo (2026-08-11) muestra TODO lo cargado sin filtrar por
  // texto — es la única forma de garantizar que, si existe un artista
  // real, aparezca por distancia real aunque su municipio no coincida
  // textualmente con el tuyo.
  // a.departamento entra a la búsqueda (2026-08-11, bug real: escribir
  // "Antioquia" no encontraba a un artista de Chigorodó — solo se
  // comparaba nombre/municipio/estilo/bio, nunca el departamento).
  let filtrados = cercaDeTiActivo ? artistasData : (q.length >= 2 ? artistasData.filter(a => matches(a.nombre, a.municipio, a.departamento, a.estilo, a.bio)) : [])
  filtrados = ordenarPorCercania(filtrados, misCoords)
  const total = filtrados.length

  // Estudios (fase 3, 2026-08-06) — mismo criterio de query que los
  // artistas, resultado aparte (no interleaved en la misma lista, para no
  // confundir un perfil individual con uno de equipo). `estudiosData`
  // también puede traer empresas proveedoras con distribuidor_oficial=true
  // (fase 6, 2026-08-07 — GET /api/estudios ya las incluye) — se separan
  // acá porque enlazan a un destino distinto (su catálogo de Supply, no un
  // perfil de tatuaje) y no deben mezclarse visualmente con estudios de
  // tatuaje reales.
  const estudiosReales = estudiosData.filter(e => e.tipo !== 'empresa')
  const proveedoresOficiales = estudiosData.filter(e => e.tipo === 'empresa')

  let estudiosFiltrados = cercaDeTiActivo ? estudiosReales : (q.length >= 2 ? estudiosReales.filter(e => matches(e.nombre, e.municipio, e.departamento, e.bio)) : [])
  estudiosFiltrados = ordenarPorCercania(estudiosFiltrados, misCoords, coordsDeEstudio)
  const totalEstudios = estudiosFiltrados.length

  // Proveedores oficiales (fase 6, 2026-08-07) — el producto real que se
  // le vende a una marca por "Distribuidor Oficial": aparecer frente a
  // esta misma audiencia de tatuadores buscando. Mismo patrón de query
  // que estudios, sin ordenar por cercanía (son marcas nacionales, no
  // tiene sentido "el más cercano"). NUNCA pasivas (fase 6.3, 2026-08-07)
  // — a diferencia de artistas/estudios, ni "Ver todo" ni el filtro de
  // categoría las muestran sin texto: solo aparecen si el visitante
  // escribió algo que de verdad coincide con una. Formaliza en código lo
  // que Jose ya había aprobado antes ("las marcas no aparecen como
  // sugerencias, a diferencia de artistas y estudios") — hasta ahora era
  // un accidente de la fórmula (sí aparecían con "Ver todo").
  const proveedoresFiltrados = q === '' ? [] : proveedoresOficiales.filter(e => matches(e.nombre, e.municipio, e.departamento, e.bio))
  const totalProveedores = proveedoresFiltrados.length

  // Totales acotados a lo que la categoría activa realmente muestra
  // (fase 6.3) — sin esto, el contador y el estado vacío contarían
  // resultados de una categoría oculta por el filtro.
  const totalArtistasVisible = categoria !== 'estudios' ? total : 0
  const totalOrgVisible = categoria !== 'artistas' ? totalEstudios + totalProveedores : 0
  const totalGeneral = totalArtistasVisible + totalOrgVisible

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

  // Trae el directorio completo bajo demanda (2026-08-11) — nada se pidió
  // en el loader; esto se llama desde el navegador (ambos endpoints ya
  // tienen CORS abierto) la primera vez que hace falta de verdad: al
  // escribir 2+ caracteres o al tocar "Cerca de ti". Una sola vez por
  // visita — `datosCargados` evita pedirlo de nuevo. No bloquea nada — si
  // falla, simplemente no hay resultados todavía.
  const cargarDatos = async () => {
    if (datosCargados || cargando) return
    setCargando(true)
    try {
      const [ar, er] = await Promise.all([
        fetch(`${PANEL_URL}/api/artistas`),
        fetch(`${PANEL_URL}/api/estudios`),
      ])
      setArtistasData(ar.ok ? await ar.json() : [])
      setEstudiosData(er.ok ? await er.json() : [])
      setDatosCargados(true)
    } catch {
      // silencioso
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    if (q.length >= 2 && !datosCargados && !cargando) {
      cargarDatos()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, datosCargados, cargando])

  // v2 (2026-08-11, Jose: "la idea es que si hay un artista lo muestres")
  // — ya no fija el buscador al nombre del municipio más cercano (un
  // artista real en un municipio VECINO con nombre distinto simplemente no
  // aparecía). Ahora "Cerca de ti" activa `cercaDeTiActivo`, que muestra
  // TODO lo cargado ordenado por distancia real — GPS no depende de que la
  // IP haya resuelto tu ciudad, así que esto funciona siempre que el
  // navegador dé permiso, sin importar el caso de Chigorodó de arriba.
  const usarMiUbicacion = () => {
    cerrarTooltipUbicacion()
    setUbicacionError(null)
    if (!navigator.geolocation) {
      setUbicacionError('Tu navegador no soporta geolocalización.')
      return
    }
    setUbicando(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMisCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setQuery('')
        setCercaDeTiActivo(true)
        cargarDatos()
        setUbicando(false)
      },
      () => {
        setUbicacionError('No pudimos acceder a tu ubicación — actívala en el navegador o escribe tu municipio.')
        setUbicando(false)
      },
      { timeout: 8000 }
    )
  }

  // Filtro de categoría (fase 6.3) — elegir "Artistas"/"Estudios" solo
  // cambia qué se muestra; ni trae datos ni cambia el estado de búsqueda.
  const cambiarCategoria = (nueva) => {
    setCategoria(nueva)
    listadoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Web Share API con fallback a WhatsApp — pedido de Jose (2026-08-04):
  // si quien busca NO es tatuador, se le invita a compartir la app en vez
  // de dejarlo sin ninguna acción posible.
  const compartir = () => {
    const texto = 'Encuentra tatuadores en toda Colombia — el buscador que conecta clientes con artistas de tatuaje.'
    const url = 'https://inkognito-ecosystem.com/tattoo-artist-colombia'
    if (navigator.share) {
      navigator.share({ title: 'Tattoo Artist Colombia', text: texto, url }).catch(() => {})
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
      <NavbarArtistas ciudadDetectada={ciudadDetectada} />

      {/* Hero fusionado con el navbar (2026-08-05, Jose: "funde el hero...
          para que quede pegado con el navbar" — antes había un hueco
          blanco entre el navbar oscuro y una card gris chica; ahora todo
          el hero ES la card, a todo el ancho de pantalla, sin esquinas
          redondeadas arriba, arrancando justo donde termina el navbar
          (pt-16/pt-20 calza exacto con la altura h-16/h-20 del navbar, ya
          blanco — ver NavbarArtistas.jsx). */}
      {/* overflow-hidden quitado (2026-08-11) — recortaba el tooltip de
          "Cerca de ti" (position: absolute, se extiende debajo del botón,
          cerca del borde inferior de este hero) contra la card de abajo.
          El fondo de puntos (DOT_PATTERN) ya calza exacto vía inset-0, no
          dependía de este overflow para no desbordarse. */}
      <section className="relative pt-16 md:pt-20 pb-8 md:pb-10 px-4 md:px-6 bg-gray-300 border-b border-gray-300">
        {/* pointer-events-none (2026-08-05): este fondo decorativo estaba
            tapando los clics del botón "Ver todo" de SeccionCercanos, que
            vive fuera del div `relative z-10` de más abajo — sin esto,
            cualquier elemento nuevo que se agregue como hermano directo de
            esta sección corre el mismo riesgo de quedar debajo del overlay
            en el orden de pintado. */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={DOT_PATTERN} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="pt-5 md:pt-7">
            <h1 className="text-lg sm:text-4xl md:text-5xl font-black uppercase leading-tight whitespace-nowrap">
              Encuentra tu{' '}
              <span className="inline-block px-2 sm:px-3 py-0.5 rounded-lg text-white bg-gray-600">
                tatuador
              </span>
            </h1>
            {/* div envolvente (no <p>) porque el tooltip de abajo es un
                <div> — no puede vivir dentro de un <p> en HTML válido; ver
                comentario completo en el tooltip mismo. */}
            <div className="max-w-2xl mx-auto">
              <div className="text-gray-700 text-sm md:text-lg leading-relaxed mt-1.5">
                {/* "INK" — apodo de INKognito para el buscador (Jose,
                    2026-08-05): se agrega como un toque de marca dentro del
                    copy, en la misma card que ya usa "tatuador" en el
                    título, sin reemplazar "Tattoo Artist Colombia" en
                    navbar/meta/footer — ese texto sigue haciendo el trabajo
                    de explicarle a quien recién llega de qué se trata esto.
                    v3 (2026-08-11) — texto acortado: la explicación de qué
                    es INK y a qué se dedica ahora vive en su tooltip de
                    onboarding (ver abajo), así que acá solo queda la
                    instrucción de uso, sin repetir lo mismo dos veces. */}
                <span className="relative inline-block px-1.5 py-0.5 rounded-md text-white font-black bg-gray-600">
                  INK
                  {/* Tooltip de onboarding sobre la marca INK (2026-08-11) —
                      primero en la secuencia, antes que el de "Cerca de ti"
                      (ver useEffect/cerrarTooltipInk arriba). v4: vuelve a
                      anclarse a la palabra "INK" (no al bloque de texto
                      completo de v3) — Jose: "la flecha... debería salir de
                      la zona izquierda, y más arriba, apuntando justamente
                      a la palabra ink". Ancla en `left-0` (no centrada) para
                      que la card se despliegue hacia la derecha desde ahí
                      en vez de partirse a ambos lados — con "INK" pegado a
                      la izquierda del bloque de texto, centrarla la hacía
                      desbordar. `max-w-[calc(100vw-2rem)]` sigue de
                      respaldo en pantallas muy angostas; el <div> vive
                      dentro de este <span> (inline-block, no <p>), por eso
                      el <p> de afuera se cambió a un <div> envolvente. */}
                  {tooltipInkVisible && (
                    <div className="absolute z-30 top-full mt-3 left-0 w-72 max-w-[calc(100vw-2rem)] bg-gray-900 rounded-xl p-4 shadow-xl text-left normal-case font-normal">
                      <span className="absolute -top-1.5 left-4 w-3 h-3 bg-gray-900 rotate-45" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Acerca de INK</p>
                      <p className="text-xs leading-relaxed text-gray-200">
                        INK es un buscador inteligente, pensado para resolver algo simple pero importante: encontrarte con el tatuador correcto. Te muestra el trabajo real de cada artista, qué tan cerca está de ti, y te conecta directo con él — sin vueltas. Empezamos en Urabá y seguimos creciendo por toda Colombia.
                      </p>
                      <button
                        onClick={cerrarTooltipInk}
                        className="mt-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:opacity-80 transition-opacity"
                      >
                        Entendido
                      </button>
                    </div>
                  )}
                </span> Busca por nombre, municipio o estilo, o usa tu ubicación — te mostramos lo más cercano.
              </div>
            </div>

            {/* Señales de confianza, mismo patrón que ya vimos en Tattoodo
                ("Verified artists · Easy booking") — Jose pidió agregarlas
                al pie de la card (2026-08-04). */}
            <div className="flex items-center justify-center gap-4 mt-4 text-gray-600 text-xs md:text-sm font-bold uppercase tracking-wide">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gray-500" />
                Artistas verificados
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gray-500" />
                Reserva fácil
              </span>
            </div>
          </div>

          {/* BARRA DE BÚSQUEDA + GEOLOCALIZACIÓN — sin listar municipios/
              estilos como botones: si uno no tiene artista registrado
              todavía, mostrarlo como opción no sirve de nada (Jose,
              2026-08-03). El municipio/estilo solo aparece como RESULTADO
              de buscar, nunca como opción previa para elegir. */}
          <div className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto mt-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setCercaDeTiActivo(false) }}
                placeholder="Nombre, municipio o estilo..."
                autoComplete="off"
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
            <div className="relative">
              <button
                onClick={usarMiUbicacion}
                disabled={ubicando}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-full border text-xs font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-60 border-gray-600 text-gray-600 w-full"
              >
                {ubicando ? <LoaderCircle size={15} className="animate-spin" /> : <Navigation size={15} />}
                {ubicando ? 'Ubicando...' : 'Cerca de ti'}
              </button>
              {/* Tooltip de onboarding — solo la primera vez (ver
                  useEffect/localStorage de arriba). Centrado bajo el
                  botón con una flechita apuntando hacia arriba, mismo
                  truco que un cuadrado rotado 45° oculto detrás del
                  cuerpo del tooltip. */}
              {tooltipUbicacionVisible && (
                <div className="absolute z-30 top-full mt-3 left-1/2 -translate-x-1/2 w-64 bg-gray-900 text-white rounded-xl p-4 shadow-xl text-left">
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45" />
                  <p className="text-xs leading-relaxed text-gray-200">
                    Con tu permiso de ubicación te mostramos artistas y estudios reales cerca de ti, ordenados por distancia — no una lista genérica.
                  </p>
                  <button
                    onClick={cerrarTooltipUbicacion}
                    className="mt-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:opacity-80 transition-opacity"
                  >
                    Entendido
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Filtro de categoría (fase 6.3, 2026-08-07, Jose: "un filtro al
              lado del botón de búsqueda, que filtre automático, bien sea
              por artistas, o por estudios") — 3 pills, misma paleta
              activo/inactivo que ya usa el selector de tipo en
              EstudioRegistroPage.jsx. No incluye "Marcas" a propósito —
              las marcas no se navegan como categoría, solo aparecen si el
              texto escrito coincide con una. */}
          <div className="flex items-center justify-center gap-2 max-w-xl mx-auto mt-3">
            {[
              { key: 'artistas', label: 'Artistas' },
              { key: 'estudios', label: 'Estudios' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => cambiarCategoria(key)}
                className={`px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wide transition-colors ${
                  categoria === key ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-400 text-gray-600 hover:border-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {ubicacionError && (
            <p className="text-gray-400 text-xs mt-3 max-w-md mx-auto">{ubicacionError}</p>
          )}
          {/* Sugerencia por geolocalización de IP (silenciosa, sin pedir
              permiso) — solo aparece antes de que la persona busque algo. */}
          {ciudadDetectada && !query && (
            <button
              onClick={() => setQuery(ciudadDetectada.municipio)}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mt-3"
            >
              <MapPin size={12} />
              ¿Buscas tatuadores en {ciudadDetectada.municipio}?
            </button>
          )}
        </div>
      </section>

      <section ref={listadoRef} className="flex-1 px-4 md:px-6 pb-16 max-w-3xl mx-auto scroll-mt-20 w-full">

        {/* CONTADOR — con búsqueda de 2+ caracteres o "Cerca de ti" activo
            (2026-08-11, antes también con `mostrarTodos`, eliminado junto
            con la pestaña Todos). Totales acotados a lo que la categoría
            activa realmente muestra. */}
        {(q.length >= 2 || cercaDeTiActivo) && (
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">
            {totalGeneral} resultado{totalGeneral !== 1 ? 's' : ''}{cercaDeTiActivo ? ' cerca de ti' : <> para <span className="text-gray-600">"{query}"</span></>}
          </p>
        )}

        {/* PROVEEDORES OFICIALES (fase 6, 2026-08-07) — el producto real
            de "Distribuidor Oficial": aparecer frente a esta misma
            audiencia. v2 (2026-08-07, Jose: "suponía que me abriría el
            perfil de esa marca, y allí ver información útil... pero en
            cambio me manda a la landing premium de una vez") — enlaza a
            SU PROPIO PERFIL (mismo destino que "Estudios" abajo), no
            directo al catálogo. El perfil (EstudioLandingPage.jsx) es
            donde vive el botón "Ver su catálogo" hacia catalogo_url —
            clic en el resultado de búsqueda ya no salta ese paso. Oculto
            bajo el filtro "Artistas" (fase 6.3). */}
        {categoria !== 'artistas' && proveedoresFiltrados.length > 0 && (
          <div className="mb-5">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 px-1">Proveedores Oficiales</p>
            <div className="flex flex-col gap-3">
              {proveedoresFiltrados.map(e => (
                <ListingRow
                  key={`proveedor-${e.id}`}
                  to={`/tattoo-artist-colombia/estudio/${e.id}`}
                  nombre={e.nombre}
                  municipio={e.municipio}
                  estilo={null}
                  bio={e.bio}
                  foto={e.logo_url}
                  onVerInfo={() => setModalArtista(e)}
                  kicker="Marca Profesional"
                />
              ))}
            </div>
          </div>
        )}

        {/* ESTUDIOS — bloque propio arriba de los artistas (2026-08-06,
            resultado de que el estudio recién creado no aparecía en
            ninguna búsqueda). Oculto bajo el filtro "Artistas" (fase 6.3).
            v2 (2026-08-09, Jose: "quiero que se vean con portada, como en
            Todos, estilo redes sociales") — con la pestaña "Estudios"
            activa, cada resultado es una EstudioCercanoCard de ancho
            completo (feed vertical) en vez de la fila compacta ListingRow;
            en "Todos" (donde la portada ya la muestra el carrusel de
            arriba) sigue igual que siempre. */}
        {categoria !== 'artistas' && estudiosFiltrados.length > 0 && (
          <div className="mb-5">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 px-1">Estudios</p>
            {/* grid de 2 columnas desde sm: (2026-08-09, Jose) — solo
                cuando se pintan las cards con portada (full); en "Todos"
                sigue siendo lista vertical de ListingRow como siempre. En
                celular queda 1 sola columna a propósito, para que la foto
                grande "estilo redes sociales" no se achique. */}
            <div className={categoria === 'estudios' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'flex flex-col gap-3'}>
              {estudiosFiltrados.map(e => (
                categoria === 'estudios' ? (() => {
                  // Distancia aproximada (2026-08-09, Jose preguntó
                  // explícitamente si esto se mostraba) — se calcula igual
                  // que en la sección "Estudios cercanos", pero acá faltaba
                  // pasarla al convertir el resultado de búsqueda en card
                  // completa; el orden ya era por cercanía, solo faltaba el
                  // número.
                  const c = coordsDeEstudio(e)
                  const distanciaTexto = misCoords && c ? distanciaKm(misCoords.lat, misCoords.lng, c.lat, c.lng).toFixed(1) : null
                  return <EstudioCercanoCard key={`estudio-${e.id}`} e={e} distanciaTexto={distanciaTexto} full onVerInfo={() => setModalArtista(e)} />
                })() : (
                  <ListingRow
                    key={`estudio-${e.id}`}
                    to={`/tattoo-artist-colombia/estudio/${e.id}`}
                    nombre={e.nombre}
                    municipio={e.municipio}
                    estilo={null}
                    bio={e.bio}
                    foto={e.logo_url}
                    onVerInfo={() => setModalArtista(e)}
                  />
                )
              ))}
            </div>
          </div>
        )}

        {/* LISTADO — oculto bajo el filtro "Estudios" (fase 6.3). v2
            (2026-08-09): mismo criterio que el bloque de Estudios de
            arriba — con "Artistas" activa, ArtistaCercanoCard de ancho
            completo; en "Todos", ListingRow como siempre. */}
        {categoria !== 'estudios' && (
          <div className={
            categoria === 'artistas'
              ? `grid grid-cols-1 sm:grid-cols-2 gap-3 ${query ? '' : 'mt-1'}`
              : `flex flex-col gap-3 ${query ? '' : 'mt-1'}`
          }>
            {filtrados.map(a => (
              categoria === 'artistas' ? (() => {
                const c = coordsDeArtista(a)
                const distanciaTexto = misCoords && c ? distanciaKm(misCoords.lat, misCoords.lng, c.lat, c.lng).toFixed(1) : null
                return <ArtistaCercanoCard key={a.id} a={a} distanciaTexto={distanciaTexto} full onVerInfo={() => setModalArtista(a)} />
              })() : (
                <ListingRow
                  key={a.id}
                  to={artistaUrl(a)}
                  nombre={a.nombre}
                  municipio={a.municipio}
                  estilo={a.estilo}
                  bio={a.bio}
                  foto={a.foto_url}
                  onVerInfo={() => setModalArtista(a)}
                />
              )
            ))}
          </div>
        )}

        {/* Se muestra mientras se trae el directorio la primera vez (ver
            `cargarDatos`) — evita que un "No hay resultados" parpadee
            antes de tiempo. */}
        {cargando && (q.length >= 2 || cercaDeTiActivo) && totalGeneral === 0 && (
          <div className="text-center py-6 text-gray-400 text-sm flex items-center justify-center gap-2">
            <LoaderCircle size={14} className="animate-spin" />
            Buscando...
          </div>
        )}

        {!cargando && (q.length >= 2 || cercaDeTiActivo) && totalGeneral === 0 && (
          <div className="text-center py-6 text-gray-400 text-sm">
            No hay resultados por ahora.
          </div>
        )}

        <TarjetaInfoVisitante categoria={categoria} />

        {/* RECLUTAMIENTO — siempre visible debajo de la búsqueda, sea cual
            sea el estado (Jose, 2026-08-04: "deberán aparecer siempre
            debajo en la búsqueda, pero en una card... con informaciones
            persuasivas"). Antes solo aparecía con búsqueda activa. Oculto
            bajo el filtro "Estudios" (fase 6.3) — es una card de
            reclutamiento de ARTISTAS, no aplica mientras se navega solo
            estudios. */}
        {categoria !== 'estudios' && (
          <TarjetaReclutamiento query={query} total={total} compartir={compartir} />
        )}

        {/* RECLUTAMIENTO DE ESTUDIOS (2026-08-09) — solo en la pestaña
            "Estudios", exclusiva con la de artistas de arriba (nunca se
            muestran las dos a la vez, cada una tiene su propio botón
            rojo — "una sola acción principal por pantalla"). */}
        {categoria === 'estudios' && (
          <TarjetaReclutamientoEstudio query={query} total={totalEstudios} compartir={compartir} />
        )}
      </section>

      <footer className="border-t border-gray-200 py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-400 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} Tattoo Artist Colombia — Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link to="/tattoo-artist-colombia/terminos" className="text-gray-400 hover:text-gray-700 transition-colors">Términos</Link>
            <Link to="/tattoo-artist-colombia/privacidad" className="text-gray-400 hover:text-gray-700 transition-colors">Privacidad</Link>
            <span className="text-gray-300">Desarrollado por INKognito</span>
          </div>
        </div>
      </footer>

      <ModalInfoArtista artista={modalArtista} onClose={() => setModalArtista(null)} />
    </div>
  )
}
