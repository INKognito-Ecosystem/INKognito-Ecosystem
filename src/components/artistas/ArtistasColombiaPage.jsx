import { useEffect, useRef, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { Search, MapPin, Palette, BadgeCheck, ChevronRight, Navigation, LoaderCircle, Share2, Sparkles, Check } from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'
import { normalize, municipioMasCercanoNacional, municipioDesdeNombreIP, getCoordsMunicipio, distanciaKm } from '../../data/colombiaGeo'
import { artistaUrl } from './artistaSlug'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
// Psicología del color (2026-08-05, decisión final tras probar "todo
// rojo" y "todo gris"): ninguno de los dos extremos — rojo repetido en
// insignias/checkmarks/puntos compite consigo mismo y se lee como alerta,
// no invitación; gris total no le dice al ojo qué es lo importante. ACCENT
// vuelve a ser rojo, pero reservado para UNA sola acción principal por
// pantalla (acá: "Unirme como artista") — el resto de elementos usa clases
// gray-* de Tailwind directamente, ya no depende de esta constante.
const ACCENT = '#B3202F'

// Puntitos oscuros y muy sutiles sobre fondo blanco (antes eran claros
// sobre negro) — mismo recurso visual, paleta invertida.
const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(0,0,0,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

export async function loader({ request }) {
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

  // Estudios (fase 3, 2026-08-06) — se piden en paralelo, mismo criterio
  // que el resto del sitio; un fallo en uno no debe tumbar al otro.
  const [artistasRes, estudiosRes] = await Promise.allSettled([
    fetch(`${PANEL_URL}/api/artistas`),
    fetch(`${PANEL_URL}/api/estudios`),
  ])
  const artistas = artistasRes.status === 'fulfilled' && artistasRes.value.ok ? await artistasRes.value.json() : []
  const estudios = estudiosRes.status === 'fulfilled' && estudiosRes.value.ok ? await estudiosRes.value.json() : []
  return { artistas, estudios, ciudadDetectada }
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
function ArtistaCercanoCard({ a, distanciaTexto, onVerInfo }) {
  const fotos = [a.foto_trabajo_1, a.foto_trabajo_2].filter(Boolean)
  const nuevo = esArtistaNuevo(a.created_at)
  const abrirInfo = (e) => { e.preventDefault(); e.stopPropagation(); onVerInfo() }

  return (
    <Link
      to={artistaUrl(a)}
      className="flex-shrink-0 w-56 snap-start rounded-xl border border-gray-200 hover:border-gray-300 bg-white overflow-hidden transition-colors"
    >
      <div className="relative h-28 bg-gray-100 flex gap-0.5">
        {fotos.length > 0 ? fotos.map((f, i) => (
          <img key={i} src={f} alt="" className="flex-1 h-full object-cover" loading="lazy" />
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
              ? <img src={a.foto_url} alt={a.nombre} className="w-full h-full object-cover" loading="lazy" />
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
function EstudioCercanoCard({ e, distanciaTexto, onVerInfo }) {
  // Descripción con el mismo umbral "ver más" que ya usa ArtistaCercanoCard
  // (2026-08-07, bug real: esta card nunca mostró bio, ni truncada ni
  // completa — Jose lo notó comparando contra la de artistas).
  const abrirInfo = (e_) => { e_.preventDefault(); e_.stopPropagation(); onVerInfo() }
  return (
    <Link
      to={`/tattoo-artist-colombia/estudio/${e.id}`}
      className="flex-shrink-0 w-56 snap-start rounded-xl border border-gray-200 hover:border-gray-300 bg-white overflow-hidden transition-colors"
    >
      <div className="relative h-28 bg-gray-100">
        {e.foto_portada ? (
          <img src={e.foto_portada} alt="" className="w-full h-full object-cover" loading="lazy" />
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
              ? <img src={e.logo_url} alt={e.nombre} className="w-full h-full object-cover" loading="lazy" />
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

// Sección "Estudios cercanos" — mismo patrón que SeccionCercanos, propia
// y más chica (sin "ver todo": los estudios no tienen su propio listado
// completo aparte, viven dentro de la misma búsqueda). No se muestra si
// no hay ningún estudio activo todavía.
function SeccionEstudiosCercanos({ estudios, misCoords, onVerInfo }) {
  if (estudios.length === 0) return null
  const ordenados = ordenarPorCercania(estudios, misCoords, coordsDeEstudio).slice(0, 10)
  return (
    <div className="mt-6 max-w-3xl mx-auto text-left">
      <h2 className="font-black uppercase text-sm text-gray-900 mb-3 px-1">
        {misCoords ? 'Estudios más cercanos' : 'Estudios en el directorio'}
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x snap-mandatory scrollbar-hide">
        {ordenados.map((e) => {
          const c = coordsDeEstudio(e)
          const distanciaTexto = misCoords && c ? distanciaKm(misCoords.lat, misCoords.lng, c.lat, c.lng).toFixed(1) : null
          return <EstudioCercanoCard key={e.id} e={e} distanciaTexto={distanciaTexto} onVerInfo={() => onVerInfo(e)} />
        })}
      </div>
    </div>
  )
}

// Sección "Artistas más cercanos" — carrusel horizontal siempre visible
// (no requiere buscar), reservado para cuando SÍ hay al menos un artista
// activo — con 0 artistas en todo el país, la card de reclutamiento ya
// cumple ese rol de "sé el primero" sin duplicar mensajes vacíos acá.
// "Ver todo" activa `onVerTodo`, que muestra el listado completo abajo
// sin necesidad de escribir nada en el buscador.
function SeccionCercanos({ artistas, misCoords, onVerTodo, onVerInfo }) {
  if (artistas.length === 0) return null
  const ordenados = ordenarPorCercania(artistas, misCoords).slice(0, 10)
  return (
    <div className="mt-6 max-w-3xl mx-auto text-left">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="font-black uppercase text-sm text-gray-900">
          {misCoords ? 'Artistas más cercanos' : 'Artistas en el directorio'}
        </h2>
        <button
          onClick={onVerTodo}
          className="text-xs font-bold uppercase tracking-wide hover:opacity-70 transition-opacity text-gray-600"
        >
          Ver todo
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x snap-mandatory scrollbar-hide">
        {ordenados.map((a) => {
          const c = coordsDeArtista(a)
          const distanciaTexto = misCoords && c ? distanciaKm(misCoords.lat, misCoords.lng, c.lat, c.lng).toFixed(1) : null
          return <ArtistaCercanoCard key={a.id} a={a} distanciaTexto={distanciaTexto} onVerInfo={() => onVerInfo(a)} />
        })}
      </div>
    </div>
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

function ListingRow({ to, nombre, municipio, estilo, bio, foto, onVerInfo }) {
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
          ? <img src={foto} alt={nombre} className="w-full h-full object-cover" loading="lazy" />
          : <span className="text-gray-300 text-3xl font-black">{nombre?.[0]?.toUpperCase() || '?'}</span>}
      </div>
      <div className="flex-1 min-w-0 pr-5">
        {/* pr-5 en el contenedor de texto le deja espacio a la insignia de
            la esquina — sin esto el nombre largo quedaba debajo del ícono. */}
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
          Sin costo por ahora — sin tarjeta, sin compromiso
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
  const { artistas, estudios, ciudadDetectada } = useLoaderData()
  const [query, setQuery] = useState('')
  const [ubicando, setUbicando] = useState(false)
  const [ubicacionError, setUbicacionError] = useState(null)
  // Guarda un artista O un estudio (2026-08-07: la fila de estudios
  // reusaba ListingRow y su botón "ver más", pero onVerInfo era un no-op —
  // el botón no hacía nada, aunque se veía igual de clicable que el de un
  // artista). ModalInfoArtista solo lee nombre/bio/estilo, así que un
  // estudio (sin estilo) encaja sin cambios en el modal.
  const [modalArtista, setModalArtista] = useState(null)
  // "Ver todo" del carrusel "Artistas más cercanos" activa esto — muestra
  // el listado completo (ordenado por cercanía) sin necesidad de escribir
  // nada en el buscador (2026-08-05).
  const [mostrarTodos, setMostrarTodos] = useState(false)
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
  const matches = (...campos) => q === '' || campos.some(c => c && normalize(c).includes(q))

  // Sin búsqueda activa no se lista ningún artista, A MENOS que "Ver
  // todo" del carrusel esté activo (2026-08-05) — el fundador (Jose
  // Humanez) ya NO tiene trato especial: se quitó el perfil fijo/
  // destacado — "vamos a usar la plataforma como cualquier tatuador más"
  // (Jose, 2026-08-04). Si quiere aparecer en el directorio, se registra
  // igual que cualquier artista.
  // La bio SÍ entra en la búsqueda (2026-08-05, Jose preguntó directo si
  // ayudaba o si solo contaba el municipio — antes NO se incluía, así que
  // era puramente informativa). Por eso el campo del formulario dejó de
  // decir "bio corta, 1-2 líneas sobre ti" — ahora si un artista escribe
  // "puntillismo" o "acuarela" en su bio, alguien que busque esa palabra
  // sí lo va a encontrar, no solo por nombre/municipio/estilo.
  let filtrados = q === '' ? (mostrarTodos ? artistas : []) : artistas.filter(a => matches(a.nombre, a.municipio, a.estilo, a.bio))
  filtrados = ordenarPorCercania(filtrados, misCoords)
  const total = filtrados.length

  // Estudios (fase 3, 2026-08-06) — mismo criterio de query que los
  // artistas, resultado aparte (no interleaved en la misma lista, para no
  // confundir un perfil individual con uno de equipo). `estudios` (del
  // loader) ahora también puede traer empresas proveedoras con
  // distribuidor_oficial=true (fase 6, 2026-08-07 — GET /api/estudios ya
  // las incluye) — se separan acá porque enlazan a un destino distinto
  // (su catálogo de Supply, no un perfil de tatuaje) y no deben mezclarse
  // visualmente con estudios de tatuaje reales.
  const estudiosReales = estudios.filter(e => e.tipo !== 'empresa')
  const proveedoresOficiales = estudios.filter(e => e.tipo === 'empresa')

  let estudiosFiltrados = q === '' ? (mostrarTodos ? estudiosReales : []) : estudiosReales.filter(e => matches(e.nombre, e.municipio, e.bio))
  estudiosFiltrados = ordenarPorCercania(estudiosFiltrados, misCoords, coordsDeEstudio)
  const totalEstudios = estudiosFiltrados.length

  // Proveedores oficiales (fase 6, 2026-08-07) — el producto real que se
  // le vende a una marca por "Distribuidor Oficial": aparecer frente a
  // esta misma audiencia de tatuadores buscando. Mismo patrón de query
  // que estudios, sin ordenar por cercanía (son marcas nacionales, no
  // tiene sentido "el más cercano").
  const proveedoresFiltrados = q === '' ? (mostrarTodos ? proveedoresOficiales : []) : proveedoresOficiales.filter(e => matches(e.nombre, e.municipio, e.bio))
  const totalProveedores = proveedoresFiltrados.length

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
        setMisCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        const cercano = municipioMasCercanoNacional(pos.coords.latitude, pos.coords.longitude)
        if (cercano) setQuery(cercano.municipio)
        setUbicando(false)
      },
      () => {
        setUbicacionError('No pudimos acceder a tu ubicación — actívala en el navegador o escribe tu municipio.')
        setUbicando(false)
      },
      { timeout: 8000 }
    )
  }

  const verTodo = () => {
    setMostrarTodos(true)
    setQuery('')
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
      <section className="relative overflow-hidden pt-16 md:pt-20 pb-8 md:pb-10 px-4 md:px-6 bg-gray-300 border-b border-gray-300">
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
            <p className="text-gray-700 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto mt-1.5">
              {/* "INK" — apodo de INKognito para el buscador (Jose,
                  2026-08-05): se agrega como un toque de marca dentro del
                  copy, en la misma card que ya usa "tatuador" en el
                  título, sin reemplazar "Tattoo Artist Colombia" en
                  navbar/meta/footer — ese texto sigue haciendo el trabajo
                  de explicarle a quien recién llega de qué se trata esto. */}
              <span className="inline-block px-1.5 py-0.5 rounded-md text-white font-black bg-gray-600">INK</span> El buscador que conecta personas con tatuadores de toda Colombia. Busca por nombre, municipio, estilo — y déjanos recomendarte el artista más cercano.
            </p>

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
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-full border text-xs font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-60 border-gray-600 text-gray-600"
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

      {/* "Artistas más cercanos" — sección propia, FUERA del fondo gris del
          hero (Jose, 2026-08-05: "el hero solo debera llegar hasta el
          boton [Cerca de ti]... los artistas que aparecen cerca de ti se
          suponen son otra seccion" — antes vivía dentro del mismo
          <section> gris, así que el fondo gris se estiraba hasta abarcar
          también el carrusel). Sugerencia proactiva, visible mientras NO
          se está buscando activamente (Jose, 2026-08-04: "como sugerencias
          parecido a cuando facebook las muestra"; luego: "esa card de
          recomendacion, debera desaparecer cuando empiecen a escribir en
          el buscador"). Gratis y ordenado por cercanía real para TODOS
          los artistas — la prioridad paga es "aparecer primero" dentro de
          esto, no el acceso a aparecer. */}
      {!query && (
        <section className="px-4 md:px-6">
          <SeccionCercanos artistas={artistas} misCoords={misCoords} onVerTodo={verTodo} onVerInfo={setModalArtista} />
          {/* estudiosReales, no estudios crudo (fase 6, 2026-08-07) — el
              loader ahora también puede traer empresas proveedoras con
              distribuidor_oficial=true, que no tienen sentido acá (esta
              card enlaza al perfil de tatuaje y ordena por cercanía real,
              ninguna de las dos aplica a una marca nacional). Esas se
              muestran aparte, solo en resultados de búsqueda activa. */}
          <SeccionEstudiosCercanos estudios={estudiosReales} misCoords={misCoords} onVerInfo={setModalArtista} />
        </section>
      )}

      <section ref={listadoRef} className="flex-1 px-4 md:px-6 pb-16 max-w-3xl mx-auto scroll-mt-20 w-full">

        {/* CONTADOR — solo tiene sentido con búsqueda activa, ningún
            artista (fundador incluido) se lista por defecto. Cuenta
            artistas + estudios + proveedores oficiales juntos (fase 6,
            2026-08-07). */}
        {query && (
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">
            {total + totalEstudios + totalProveedores} resultado{(total + totalEstudios + totalProveedores) !== 1 ? 's' : ''} para <span className="text-gray-600">"{query}"</span>
          </p>
        )}

        {/* PROVEEDORES OFICIALES (fase 6, 2026-08-07) — el producto real
            de "Distribuidor Oficial": aparecer frente a esta misma
            audiencia. Enlaza a su catálogo de Supply (/supply/estudio/:id),
            no al perfil de tatuaje — es una marca proveedora, no un
            estudio. Bloque separado de "Estudios" para no confundir un
            proveedor de insumos con un lugar donde tatuarse. */}
        {proveedoresFiltrados.length > 0 && (
          <div className="mb-5">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 px-1">Proveedores Oficiales</p>
            <div className="flex flex-col gap-3">
              {proveedoresFiltrados.map(e => (
                <ListingRow
                  key={`proveedor-${e.id}`}
                  to={`/supply/estudio/${e.id}`}
                  nombre={e.nombre}
                  municipio={e.municipio}
                  estilo={null}
                  bio={e.bio}
                  foto={e.logo_url}
                  onVerInfo={() => setModalArtista(e)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ESTUDIOS — bloque propio arriba de los artistas (2026-08-06,
            resultado de que el estudio recién creado no aparecía en
            ninguna búsqueda). Reusa ListingRow, sin "especialidades" (los
            estudios no tienen estilo propio). */}
        {estudiosFiltrados.length > 0 && (
          <div className="mb-5">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 px-1">Estudios</p>
            <div className="flex flex-col gap-3">
              {estudiosFiltrados.map(e => (
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
              ))}
            </div>
          </div>
        )}

        {/* LISTADO */}
        <div className={`flex flex-col gap-3 ${query ? '' : 'mt-1'}`}>
          {filtrados.map(a => (
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
          ))}

          {query && total === 0 && totalEstudios === 0 && totalProveedores === 0 && (
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
