import { useEffect, useRef, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { MapPin, Palette, Search, X, ChevronLeft, ChevronRight, ShoppingBag, LoaderCircle, Wallet } from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'
import { municipioDesdeNombreIP } from '../../data/colombiaGeo'
import { idDesdeParam } from './artistaSlug'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#B3202F'
// Azul de marca de Mercado Pago (2026-08-05, Jose: "mercado pago es azul,
// tanto ese como el botón pagar con mercado pago, deberían ser azules") —
// solo para los 2 elementos ligados directo a Mercado Pago (precio/Comprar
// de un diseño, y el botón de pago del modal); el resto del sitio sigue
// con el rojo de INKognito. Logo real de Mercado Pago, hospedado en su
// propio CDN (mlstatic.com) — si algún día cambian esa ruta y deja de
// cargar, el onError la oculta sola, sin romper el botón.
const MP_BLUE = '#3483FA'
const MP_LOGO_URL = 'https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/5.21.0/mercadopago/logo__large@2x.png'

// Marca de agua ligera en la vista previa pública (2026-08-05, Jose: debe
// verse nítida, no una marca pesada que tape el detalle del trazo) — un
// solo texto centrado, semitransparente, insertado como transformación de
// Cloudinary sobre la misma imagen (sin subir un segundo archivo). El
// comprador recibe la imagen limpia por correo tras pagar.
const conMarcaDeAgua = (url) => {
  if (!url || !url.includes('/upload/')) return url
  const marca = 'l_text:Arial_50_bold:INKognito,co_white,o_30,a_-30,g_center'
  return url.replace('/upload/', `/upload/${marca}/`)
}

export async function loader({ params, request }) {
  // Mismo detector de ciudad por IP que usa la página madre — el navbar es
  // compartido, así que también acá hay que resolver ciudadDetectada
  // (2026-08-04, expansión nacional).
  let ciudadDetectada = null
  try {
    const ipCity = request.headers.get('x-vercel-ip-city')
    if (ipCity) ciudadDetectada = municipioDesdeNombreIP(decodeURIComponent(ipCity))
  } catch {
    ciudadDetectada = null
  }
  // La URL ahora es "nombre-id" (ej. /artista/jhumaneztattoo-11, ver
  // artistaSlug.js) — el nombre es cosmético, el id al final sigue siendo
  // lo único que se usa para buscarlo. Un link viejo sin nombre
  // ("/artista/11") sigue funcionando igual.
  const id = idDesdeParam(params.id)
  try {
    const res = await fetch(`${PANEL_URL}/api/artistas/${id}`)
    if (!res.ok) return { artista: null, ciudadDetectada }
    return { artista: await res.json(), ciudadDetectada }
  } catch {
    return { artista: null, ciudadDetectada }
  }
}

export function meta({ data }) {
  const artista = data?.artista
  if (!artista) return [{ title: 'Artista no encontrado | Tattoo Artist Colombia' }]
  const title = `${artista.nombre} — Tatuador en ${artista.municipio} | Tattoo Artist Colombia`
  const description = artista.bio || `${artista.nombre}, tatuador en ${artista.municipio}${artista.departamento ? ', ' + artista.departamento : ''}. Portafolio y contacto directo por WhatsApp.`
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
  const { artista, ciudadDetectada } = useLoaderData()
  const [lightbox, setLightbox] = useState(null)
  const touchStartX = useRef(null)
  const [disenoComprando, setDisenoComprando] = useState(null)
  const [compradorEmail, setCompradorEmail] = useState('')
  const [comprando, setComprando] = useState(false)
  const [errorCompra, setErrorCompra] = useState(null)

  // Bug real reportado por Jose (2026-08-05): tras redirigir a Mercado
  // Pago con window.location.href, si el usuario le da "Atrás" del
  // navegador sin completar el pago, a veces el navegador restaura la
  // página desde su caché (bfcache) exactamente como quedó al salir — con
  // el botón congelado en "cargando", porque ese código nunca volvió a
  // correr. `pageshow` con `event.persisted` detecta justo ese caso.
  useEffect(() => {
    const alRestaurar = (e) => { if (e.persisted) setComprando(false) }
    window.addEventListener('pageshow', alRestaurar)
    return () => window.removeEventListener('pageshow', alRestaurar)
  }, [])

  if (!artista) return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarArtistas ciudadDetectada={ciudadDetectada} />
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm uppercase tracking-widest pt-20">
        Artista no encontrado
      </div>
    </div>
  )

  // Bug real reportado por Jose (2026-08-05): el botón daba "número
  // inválido" porque el número guardado eran los 10 dígitos locales sin
  // el indicativo de país (57) que wa.me exige — el panel ahora normaliza
  // esto al guardar, pero se repite acá como respaldo por si queda algún
  // registro viejo guardado antes de ese fix.
  const digitos = artista.whatsapp ? artista.whatsapp.replace(/\D/g, '') : ''
  const waNumero = digitos.length === 10 && digitos.startsWith('3') ? `57${digitos}` : digitos
  const waLink = waNumero
    ? `https://wa.me/${waNumero}?text=${encodeURIComponent(`Hola ${artista.nombre}, te encontré en Tattoo Artist Colombia y quiero preguntarte por una cita.`)}`
    : null

  // El contacto es directo por WhatsApp — no hay forma de saber si se
  // volvió una venta real (decisión 2026-08-04, ver debate sobre modelo
  // Tattoodo vs suscripción). Este conteo de clics es la métrica de valor
  // que se le mostrará al artista para justificar la suscripción.
  const trackWhatsappClick = () => {
    fetch(`${PANEL_URL}/api/artistas/${artista.id}/click-whatsapp`, { method: 'POST' }).catch(() => {})
  }

  const trabajos = [artista.foto_trabajo_1, artista.foto_trabajo_2, artista.foto_trabajo_3].filter(Boolean)
  const disenos = artista.disenos || []

  const comprarDiseno = async (e) => {
    e.preventDefault()
    if (!disenoComprando) return
    setComprando(true)
    setErrorCompra(null)
    try {
      const res = await fetch(`${PANEL_URL}/api/disenos-comprar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diseno_id: disenoComprando.id, comprador_email: compradorEmail }),
      })
      const data = await res.json()
      if (!res.ok || !data.init_point) throw new Error(data.error || '')
      window.location.href = data.init_point
    } catch (err) {
      setErrorCompra(err.message || 'No pudimos iniciar el pago — intenta de nuevo.')
      setComprando(false)
    }
  }

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
    // flex flex-col + flex-1 (2026-08-04): footer siempre pegado abajo,
    // incluso en perfiles con poco contenido (Jose: "pongamos el copyright
    // abajo como corresponde"). NavbarArtistas es fixed, no participa.
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavbarArtistas ciudadDetectada={ciudadDetectada} />

      <div className="flex-1 pt-16 md:pt-20">

        {/* PORTADA — antes iba a todo el ancho de la pantalla; en monitores
            anchos la portada (y más abajo redes sociales/trabajos) crecían
            sin límite mientras el nombre/bio se quedaban en una columna
            angosta al centro, generando un desbalance — "en pc el diseño
            esta exagerado... deberia verse como facebook tambien en pc"
            (Jose, 2026-08-05). Facebook limita TODO el contenido del
            perfil a una columna, no solo el texto — acá se hace lo mismo
            con max-w-3xl en portada/redes/trabajos, igual que ya tenía el
            bloque de nombre/bio. */}
        <div className="max-w-3xl mx-auto">
          <div className="w-full h-40 sm:h-56 md:h-72 bg-gray-100 overflow-hidden">
            {artista.foto_url_2 && (
              <img src={artista.foto_url_2} alt="" className="w-full h-full object-cover" loading="eager" />
            )}
          </div>
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
                  {artista.municipio}{artista.departamento ? `, ${artista.departamento}` : ''}
                </span>
                {artista.estilo && (
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <Palette size={13} />
                    {artista.estilo}
                  </span>
                )}
                {artista.precio_nivel && (
                  <span className="text-xs font-bold tracking-widest text-gray-500">{'$'.repeat(artista.precio_nivel)}</span>
                )}
                {artista.disponibilidad && (
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ backgroundColor: `${ACCENT}12`, color: ACCENT }}>
                    {artista.disponibilidad}
                  </span>
                )}
                {/* Insignia de confianza (2026-08-05, Jose): que el visitante
                    sepa, antes de llegar a los diseños, que este artista
                    acepta pago directo y seguro por la plataforma. */}
                {artista.mp_conectado && (
                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                    <Wallet size={11} />
                    Acepta pagos con Mercado Pago
                  </span>
                )}
              </div>
            </div>

            {artista.bio && (
              <div>
                <p className="text-gray-400 text-[11px] uppercase tracking-widest mb-1">Sobre mí</p>
                <p className="text-gray-600 text-sm leading-relaxed max-w-xl">{artista.bio}</p>
              </div>
            )}

          </div>
        </div>

        {/* REDES SOCIALES — Facebook e Instagram, en 2 bloques a todo el
            ancho de la COLUMNA del perfil (antes iba a todo el ancho de la
            pantalla — ver nota de la portada arriba sobre por qué se acotó
            a max-w-3xl). Si el artista todavía no tiene el link cargado,
            el bloque se queda visible pero deshabilitado con un aviso,
            nunca se oculta. Delgadas, mismo alto que el botón de contacto
            de abajo. */}
        <div className="mt-5 max-w-3xl mx-auto">
          <p className="px-4 text-gray-400 text-[11px] uppercase tracking-widest mb-2">Redes sociales</p>
          <div className={`grid grid-cols-2 w-full border-t border-gray-200 ${waLink ? '' : 'border-b'}`}>
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

          {/* CONTACTAR AL ARTISTA — antes vivía fijo en la parte inferior de
              la pantalla; Jose pidió que ya no quede fijo y que se ubique
              justo debajo de redes sociales (2026-08-04). */}
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackWhatsappClick}
              className="flex items-center justify-center gap-2.5 py-3.5 border-b border-gray-200 bg-green-600 text-white font-black uppercase tracking-widest hover:bg-green-500 transition-colors text-sm"
            >
              <FaWhatsapp size={18} />
              Contactar al artista
            </a>
          )}
        </div>

        {/* TRABAJOS — antes iba a todo el ancho de la pantalla; en
            monitores anchos cada foto crecía sin límite (más de 600px por
            foto en 1920px) — acotado a max-w-3xl igual que el resto del
            perfil, ver nota de la portada arriba. Cada foto abre el
            lightbox navegable con botón "Ver". */}
        {trabajos.length > 0 && (
          <div className="mt-6 max-w-3xl mx-auto">
            <p className="px-4 text-gray-400 text-[11px] uppercase tracking-widest mb-2">Trabajos</p>
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

        {/* DISEÑOS DISPONIBLES — venta directa (2026-08-05), primer paso de
            monetización del directorio. Mismo patrón visual de grid que
            "Trabajos" arriba, pero con precio + botón Comprar sobre una
            versión con marca de agua (el archivo limpio llega por correo
            tras pagar). El pago se reparte al instante entre el artista y
            INKognito vía Mercado Pago — WhatsApp sigue siendo gratis y
            visible arriba, esto es una opción adicional, no un reemplazo. */}
        {disenos.length > 0 && (
          <div className="mt-6 max-w-3xl mx-auto">
            <p className="px-4 text-gray-400 text-[11px] uppercase tracking-widest mb-2">Diseños disponibles</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-0.5 sm:gap-1 w-full">
              {disenos.map((d) => (
                <div key={d.id} className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img src={conMarcaDeAgua(d.imagen_url)} alt={d.titulo || 'Diseño'} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                    {d.tipo === 'lamina' ? 'Lámina' : 'Tatuaje'}
                  </div>
                  <button
                    type="button"
                    onClick={() => { setDisenoComprando(d); setErrorCompra(null) }}
                    className="absolute bottom-1.5 inset-x-1.5 flex items-center justify-center gap-1.5 text-white text-[11px] font-black uppercase tracking-wide px-2 py-2 rounded-full hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: MP_BLUE }}
                  >
                    <ShoppingBag size={12} />
                    ${Number(d.precio).toLocaleString('es-CO')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INFO ADICIONAL — límites y preguntas frecuentes, autoreportadas
            por el artista (sin verificación, mismo criterio que las
            reseñas — ver debate 2026-08-04). Todo opcional, no cambia nada
            de lo que ya existía arriba. (Se descartó "Especialidades"
            aparte de "Estilo" — Jose notó que se repetiría el mismo
            contenido, ej. "Realismo, línea fina" ya vive en Estilo.) */}
        {(artista.no_tatua || artista.faq) && (
          <div className="max-w-3xl mx-auto px-4 mt-6 space-y-4">
            {artista.no_tatua && (
              <div>
                <p className="text-gray-400 text-[11px] uppercase tracking-widest mb-1">No tatúa</p>
                <p className="text-gray-700 text-sm leading-relaxed">{artista.no_tatua}</p>
              </div>
            )}
            {artista.faq && (
              <div>
                <p className="text-gray-400 text-[11px] uppercase tracking-widest mb-1">Preguntas frecuentes</p>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{artista.faq}</p>
              </div>
            )}
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4">
          <div className="border-t border-gray-200 pt-5 mt-6 pb-10">
            <Link to="/tattoo-artist-uraba" className="text-gray-400 hover:text-gray-900 text-xs uppercase tracking-widest transition-colors">
              ← Ver más artistas
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 py-6 px-4 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-400 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} Tattoo Artist Colombia — INKognito. Todos los derechos reservados.</p>
          <span className="text-gray-300">Desarrollado por INKognito</span>
        </div>
      </footer>

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

      {/* MODAL DE COMPRA — pide el correo del comprador (ahí llega el
          diseño limpio, sin marca de agua, tras confirmar el pago) y
          redirige a Mercado Pago. */}
      {disenoComprando && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center px-4"
          onClick={() => !comprando && setDisenoComprando(null)}
        >
          <div className="bg-white rounded-2xl p-5 w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
            <img src={conMarcaDeAgua(disenoComprando.imagen_url)} alt="" className="w-full aspect-square object-cover rounded-lg mb-3" />
            <p className="font-black uppercase text-sm mb-1">{disenoComprando.titulo || 'Diseño'}</p>
            <p className="text-gray-500 text-xs mb-4">${Number(disenoComprando.precio).toLocaleString('es-CO')} COP — se reparte al instante entre {artista.nombre} e INKognito.</p>
            <form onSubmit={comprarDiseno} className="space-y-2.5">
              <input
                required
                type="email"
                placeholder="Tu correo — ahí te llega el diseño"
                value={compradorEmail}
                onChange={(e) => setCompradorEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-500"
              />
              {errorCompra && <p className="text-xs" style={{ color: ACCENT }}>{errorCompra}</p>}
              <button
                type="submit"
                disabled={comprando}
                className="w-full py-3 text-white font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 text-xs flex items-center justify-center gap-2"
                style={{ backgroundColor: MP_BLUE }}
              >
                {comprando ? (
                  <LoaderCircle size={14} className="animate-spin" />
                ) : (
                  <>
                    Pagar con
                    <img
                      src={MP_LOGO_URL}
                      alt="Mercado Pago"
                      className="h-4"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  </>
                )}
              </button>
              <button type="button" onClick={() => setDisenoComprando(null)} className="w-full text-center text-gray-400 text-[11px] uppercase tracking-widest py-1">
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
