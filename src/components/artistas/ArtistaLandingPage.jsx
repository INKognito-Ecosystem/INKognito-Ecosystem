import { useEffect, useRef, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { MapPin, Palette, Search, X, ChevronLeft, ChevronRight, ShoppingBag, Image as ImageIcon, LoaderCircle, Building2, Award } from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'
import { municipioDesdeNombreIP } from '../../data/colombiaGeo'
import { idDesdeParam } from './artistaSlug'
import { DISPONIBILIDAD_COLOR, DISPONIBILIDAD_TEXTO } from './disponibilidad'
import { urlGoogleMaps } from './mapaUrl'
import { cloudinaryFill, cloudinaryLimit } from '../../lib/cloudinary'
import { MESES_CALENDARIO, _pad2, fechaISO, celdasDelMes } from './calendarioUtil'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#B3202F'
// BTN (2026-08-06, Jose: "todo botón que esté en rojo cámbialo a gris")
// — ACCENT se queda como está (sigue usándose para texto de error y el
// fallback de disponibilidad, que no son botones), pero los botones
// reales pasan a este gris oscuro.
const BTN = '#374151'
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

// precio_sesion_texto es texto libre (no un número) a propósito — muchos
// artistas prefieren escribir "depende del tamaño" en vez de un precio
// exacto. Pero si SÍ escribieron solo dígitos (2026-08-06, Jose: "el
// número se muestra sin comas"), se le da formato de miles como a
// cualquier otro precio del sitio — sin tocar el texto si no es un
// número puro.
const formatearValorSesion = (texto) => {
  if (!texto) return texto
  const limpio = texto.trim()
  if (!/^\d+$/.test(limpio)) return texto
  return `$${Number(limpio).toLocaleString('es-CO')}`
}

// Calendario real (fase 1 de agenda, 2026-08-19) — MESES_CALENDARIO/
// fechaISO/celdasDelMes viven en calendarioUtil.js (compartidas con el
// calendario de bloqueos del artista en ArtistaEditarPerfilPage.jsx).
// formatearHora12 se queda acá — el calendario del artista trabaja a
// nivel de día, no formatea horas.
const formatearHora12 = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  const ampm = h < 12 ? 'AM' : 'PM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${_pad2(m)} ${ampm}`
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
  // "Ver más" por diseño (2026-08-06) — objeto {id: bool} compartido entre
  // ambas secciones (tatuar/digital), ya que los ids de disenos son
  // únicos entre las dos.
  const [disenosExpandidos, setDisenosExpandidos] = useState({})
  // "Ver más" de la bio (2026-08-06) — mismo patrón, un solo bloque de
  // bio por perfil así que alcanza con un booleano simple.
  const [bioExpandida, setBioExpandida] = useState(false)
  // v2 (2026-08-06, Jose: "a mi texto de sobre mí no debería aparecerle
  // el ver más, pues tiene tres líneas de texto" — un umbral de
  // caracteres es solo una aproximación de "3 líneas", y para su bio
  // específica daba falso positivo). Se mide de verdad: si el texto
  // recortado (line-clamp-3) tiene más alto de contenido del que se
  // alcanza a mostrar (scrollHeight > clientHeight), ahí sí se recortó
  // algo de verdad y el botón tiene sentido.
  const bioRef = useRef(null)
  const [bioDesborda, setBioDesborda] = useState(false)
  useEffect(() => {
    if (bioRef.current) {
      setBioDesborda(bioRef.current.scrollHeight > bioRef.current.clientHeight + 1)
    }
  }, [artista.bio])
  // Aviso al hacer clic en una red social que el artista no puso
  // (2026-08-06, Jose: "debería salirle un mensaje que diga que el
  // artista no la puso, pero algo bien profesional") — antes el clic no
  // hacía nada (preventDefault silencioso). Toast simple, se autooculta.
  const [avisoRed, setAvisoRed] = useState(null)
  const mostrarAvisoRed = (red) => {
    setAvisoRed(red)
    setTimeout(() => setAvisoRed(null), 3500)
  }

  // Foto activa por diseño en la card de navegación (2026-08-06, Jose:
  // "no veo la opción para ver o pasar las fotos" — hasta 3 fotos por
  // diseño ya existían en la base y ya se navegaban dentro del modal
  // "Comprar", pero la card de navegación solo mostraba la primera).
  const [disenosImgIdx, setDisenosImgIdx] = useState({})
  // Ver en grande (2026-08-06, Jose: "poner la opción ver para que la
  // imagen se vea en tamaño completo tal como pasa con portafolio") —
  // mismo lightbox que ya usan los trabajos, pero para diseños, con
  // marca de agua (siguen sin comprarse) y comparte disenosImgIdx con la
  // card para que abrir/cerrar no pierda la foto en la que ibas.
  const [disenoLightboxId, setDisenoLightboxId] = useState(null)
  const [modalImgIdx, setModalImgIdx] = useState(0)
  const [compradorEmail, setCompradorEmail] = useState('')
  const [comprando, setComprando] = useState(false)
  const [errorCompra, setErrorCompra] = useState(null)

  // Reservas con anticipo (fase 2, 2026-08-06) — mismo patrón que la compra
  // de un diseño, formulario propio (nombre/WhatsApp/correo/mensaje) porque
  // acá el artista necesita poder contactar al cliente para coordinar fecha.
  const [reservando, setReservando] = useState(false)
  const [resNombre, setResNombre] = useState('')
  const [resTelefono, setResTelefono] = useState('')
  const [resEmail, setResEmail] = useState('')
  const [resMensaje, setResMensaje] = useState('')
  const [enviandoReserva, setEnviandoReserva] = useState(false)
  const [errorReserva, setErrorReserva] = useState(null)
  const [mostrarTerminos, setMostrarTerminos] = useState(false)

  // Calendario real (fase 1 de agenda, 2026-08-19) — reservaPaso solo
  // importa si artista.tiene_horario; artistas sin horario configurado
  // siguen exactamente en el paso 3 (el formulario de siempre), sin
  // ningún cambio de comportamiento para ellos.
  const [reservaPaso, setReservaPaso] = useState(3)
  const hoyBase = new Date()
  const [reservaMesVisible, setReservaMesVisible] = useState({ year: hoyBase.getFullYear(), month: hoyBase.getMonth() })
  const [dispoMes, setDispoMes] = useState({})
  const [cargandoMes, setCargandoMes] = useState(false)
  const [fechaElegida, setFechaElegida] = useState(null)
  const [slotsDia, setSlotsDia] = useState([])
  const [cargandoDia, setCargandoDia] = useState(false)
  const [horaElegida, setHoraElegida] = useState(null)
  // Tooltip de onboarding sobre "Para agendar" (2026-08-11, mismo patrón
  // que los de INK/Cerca de ti en ArtistasColombiaPage.jsx) — aclara que
  // ese número es un ABONO parcial, no el precio completo del tatuaje;
  // malentendido real si alguien paga pensando que ya cubrió todo.
  // Arranca en `false` a propósito — el servidor no tiene localStorage, así
  // que debe coincidir con el HTML inicial (evita mismatch de hidratación).
  const [tooltipAgendarVisible, setTooltipAgendarVisible] = useState(false)
  useEffect(() => {
    try {
      if (!localStorage.getItem('kg_tooltip_agendar_visto')) setTooltipAgendarVisible(true)
    } catch {
      // localStorage puede fallar en navegación privada — sin tooltip, no rompe nada
    }
  }, [])
  const cerrarTooltipAgendar = () => {
    try { localStorage.setItem('kg_tooltip_agendar_visto', '1') } catch {}
    setTooltipAgendarVisible(false)
  }

  // Diseños agrupados por tipo, cada uno detrás de su propio botón
  // desplegable. v3 (2026-08-06, Jose: primero pidió que ambas categorías
  // arrancaran visibles si tenían productos, pero corrigió — "no se
  // puede, una card ya ocupa el ancho de la pantalla; si tiene diseño en
  // ambos lugares, debe mostrar primero el diseño antes que la lámina...
  // la otra aparecerá si yo le doy al botón") — vuelve a ser mutuamente
  // excluyente (una sola sección abierta a la vez), pero con un valor
  // inicial inteligente en vez de arrancar cerrado: "tatuar" tiene
  // prioridad si el artista tiene de los dos tipos, "digital" solo si es
  // lo único que tiene.
  const [seccionDisenos, setSeccionDisenos] = useState(() => {
    const d = artista?.disenos || []
    if (d.some((x) => x.tipo !== 'lamina')) return 'tatuar'
    if (d.some((x) => x.tipo === 'lamina')) return 'digital'
    return null
  })

  // Bug real reportado por Jose (2026-08-05): tras redirigir a Mercado
  // Pago con window.location.href, si el usuario le da "Atrás" del
  // navegador sin completar el pago, a veces el navegador restaura la
  // página desde su caché (bfcache) exactamente como quedó al salir — con
  // el botón congelado en "cargando", porque ese código nunca volvió a
  // correr. `pageshow` con `event.persisted` detecta justo ese caso.
  useEffect(() => {
    const alRestaurar = (e) => { if (e.persisted) { setComprando(false); setEnviandoReserva(false) } }
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
  const disenosTatuar = disenos.filter((d) => d.tipo !== 'lamina')
  const disenosDigital = disenos.filter((d) => d.tipo === 'lamina')

  // v2 (2026-08-06, Jose: "la descripción... por lo que veo no aparece
  // en ningún lado" — antes vivía solo dentro del modal de compra, nunca
  // ayudaba a decidir ANTES del clic en "Comprar"). Card horizontal:
  // imagen a la izquierda (limpia, sin precio encima — se movió abajo
  // para no tapar el detalle del trazo), título+descripción+precio a la
  // derecha. Varios diseños hacen scroll lateral, mismo patrón ya
  // probado en "Artistas más cercanos" (ArtistasColombiaPage.jsx).
  // v3 (2026-08-06, Jose: "ojo que redujiste el tamaño de la card, la
  // idea es que estos dos bloques... ocupen todo el ancho de la
  // pantalla") — cada card pasa a ser un slide de ancho completo (una
  // por pantalla, no varias chiquitas visibles a la vez); con varios
  // diseños se hace scroll lateral para pasar al siguiente. Imagen y
  // panel de texto se reparten ese ancho completo entre los dos.
  const renderGridDisenos = (items) => (
    <div className="flex overflow-x-auto px-4 snap-x snap-mandatory scrollbar-hide">
      {items.map((d) => {
        const imagenes = [d.imagen_url, d.imagen_url_2, d.imagen_url_3].filter(Boolean)
        const idx = disenosImgIdx[d.id] || 0
        return (
        <div key={d.id} className="w-full flex-shrink-0 snap-center">
          {/* v4 (2026-08-06, Jose: "la card quedó muy larga... debería
              adaptarse al tamaño de fotos que suban") — al revés de la
              v3: ahí el texto (variable, según lo que escriba cada
              artista) mandaba el alto y la imagen se estiraba para
              alcanzarlo, tamaño impredecible. Ahora la imagen tiene su
              propia proporción fija (retrato, aspect-[4/5] — le sienta
              mejor a fotos de tatuaje que un cuadrado) y el texto se
              recorta más corto (line-clamp-3) para no desbordarse mucho
              más allá de esa altura. Card consistente sin importar cuán
              largo escriba el artista. */}
          <div className="flex items-stretch bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
            {/* self-start (2026-08-06) — sin esto, "items-stretch" del
                padre estira la imagen para igualar el alto del texto
                expandido, exactamente el problema que se acaba de
                corregir. Con self-start, la imagen se queda en su propia
                altura (aspect-[4/5]) sin importar cuánto crezca el texto
                al lado. */}
            <div className="relative w-2/5 sm:w-1/3 flex-shrink-0 self-start aspect-[4/5] bg-gray-100 overflow-hidden">
              <img
                src={conMarcaDeAgua(imagenes[idx])} alt={d.titulo || 'Diseño'} className="w-full h-full object-cover" loading="lazy"
                draggable={false} onContextMenu={(e) => e.preventDefault()}
              />
              {/* Navegar entre fotos (2026-08-06, Jose: "no veo la opción
                  para ver o pasar las fotos" — hasta 3 fotos por diseño
                  ya existían en la base, pero acá solo se mostraba la
                  primera). Mismo patrón de puntos+flechas que ya usa el
                  modal "Comprar" para esto mismo. */}
              {imagenes.length > 1 && (
                <>
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
                    {imagenes.map((_, i) => (
                      <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`} />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setDisenosImgIdx((s) => ({ ...s, [d.id]: (idx - 1 + imagenes.length) % imagenes.length })) }}
                    aria-label="Foto anterior"
                    className="absolute left-0.5 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setDisenosImgIdx((s) => ({ ...s, [d.id]: (idx + 1) % imagenes.length })) }}
                    aria-label="Foto siguiente"
                    className="absolute right-0.5 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setDisenoLightboxId(d.id) }}
                aria-label="Ver en grande"
                className="absolute top-1.5 right-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <Search size={12} />
              </button>
            </div>
            <div className="flex-1 min-w-0 pt-3 pb-4 px-4 flex flex-col justify-start">
              <p className="font-black text-sm uppercase leading-tight">{d.titulo || 'Diseño'}</p>
              {d.descripcion && (
                <>
                  {/* "Ver más" (2026-08-06, Jose) — por defecto recortado a
                      3 líneas; al expandir, scroll interno con max-h en
                      vez de dejar que la card crezca sin límite. El
                      umbral de 100 caracteres es un estimado de cuándo un
                      texto ya no cabe en 3 líneas a este ancho/tamaño —
                      no hay forma barata de medirlo exacto en CSS puro. */}
                  <p className={`text-gray-500 text-xs leading-relaxed mt-1.5 ${disenosExpandidos[d.id] ? 'max-h-24 overflow-y-auto pr-1' : 'line-clamp-3'}`}>
                    {d.descripcion}
                  </p>
                  {d.descripcion.length > 100 && (
                    <button
                      type="button"
                      onClick={() => setDisenosExpandidos((s) => ({ ...s, [d.id]: !s[d.id] }))}
                      className="text-[10px] font-black uppercase tracking-wide mt-1 self-start text-gray-700 hover:opacity-70 transition-opacity"
                    >
                      {disenosExpandidos[d.id] ? 'Ver menos' : 'Ver más'}
                    </button>
                  )}
                </>
              )}
              <button
                type="button"
                onClick={() => { setDisenoComprando(d); setErrorCompra(null); setModalImgIdx(0) }}
                className="mt-auto self-end flex items-center gap-1.5 text-white text-xs font-black uppercase tracking-wide px-3.5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
                style={{ backgroundColor: MP_BLUE }}
              >
                <ShoppingBag size={13} />
                ${Number(d.precio).toLocaleString('es-CO')}
              </button>
            </div>
          </div>
        </div>
        )
      })}
    </div>
  )

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

  const hacerReserva = async (e) => {
    e.preventDefault()
    setEnviandoReserva(true)
    setErrorReserva(null)
    try {
      const res = await fetch(`${PANEL_URL}/api/artistas-reservar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artista_id: artista.id, cliente_nombre: resNombre, cliente_telefono: resTelefono,
          cliente_email: resEmail, mensaje: resMensaje,
          ...(artista.tiene_horario ? { fecha_slot: fechaElegida, hora_inicio_slot: horaElegida } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.init_point) throw new Error(data.error || '')
      window.location.href = data.init_point
    } catch (err) {
      setErrorReserva(err.message || 'No pudimos iniciar el pago — intenta de nuevo.')
      setEnviandoReserva(false)
    }
  }

  // Calendario real (fase 1 de agenda, 2026-08-19) — abre el modal en el
  // paso 1 (calendario) si el artista configuró horario; si no, salta
  // directo al formulario de siempre, cero cambio para esos artistas.
  const abrirReserva = () => {
    const hoy = new Date()
    setReservaMesVisible({ year: hoy.getFullYear(), month: hoy.getMonth() })
    setFechaElegida(null)
    setHoraElegida(null)
    setSlotsDia([])
    setReservaPaso(artista.tiene_horario ? 1 : 3)
    setReservando(true)
  }

  useEffect(() => {
    if (!reservando || !artista.tiene_horario || reservaPaso !== 1) return
    const { year, month } = reservaMesVisible
    const desde = fechaISO(new Date(year, month, 1))
    const hasta = fechaISO(new Date(year, month + 1, 0))
    setCargandoMes(true)
    fetch(`${PANEL_URL}/api/artistas-disponibilidad-mes?artista_id=${artista.id}&desde=${desde}&hasta=${hasta}`)
      .then(r => r.ok ? r.json() : {})
      .then(setDispoMes)
      .catch(() => setDispoMes({}))
      .finally(() => setCargandoMes(false))
  }, [reservando, reservaPaso, reservaMesVisible, artista.id, artista.tiene_horario])

  const cambiarMes = (delta) => {
    setReservaMesVisible(({ year, month }) => {
      const d = new Date(year, month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  const elegirDia = (iso) => {
    if (dispoMes[iso] !== 'disponible') return
    setFechaElegida(iso)
    setHoraElegida(null)
    setSlotsDia([])
    setCargandoDia(true)
    setReservaPaso(2)
    fetch(`${PANEL_URL}/api/artistas-disponibilidad-dia?artista_id=${artista.id}&fecha=${iso}`)
      .then(r => r.ok ? r.json() : { slots: [] })
      .then(data => setSlotsDia(data.slots || []))
      .catch(() => setSlotsDia([]))
      .finally(() => setCargandoDia(false))
  }

  const elegirHora = (hhmm) => {
    setHoraElegida(hhmm)
    setReservaPaso(3)
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
              <img src={cloudinaryFill(artista.foto_url_2, 700, 300)} alt="" className="w-full h-full object-cover" loading="eager" />
            )}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4">

          {/* AVATAR + NOMBRE/UBICACIÓN/ESPECIALIDAD lado a lado (2026-08-06).
              v3, Jose: "más grande el círculo... ya no dividido a la mitad,
              un poquito más abajo como lo está Facebook" — sigue siendo
              posicionamiento absoluto (garantiza el offset exacto que se
              pida, sin depender de cómo flex mide cajas con margen
              negativo), solo que ahora sube 1/3 de la altura del avatar en
              vez de la mitad, dejando 2/3 del círculo por debajo de la
              portada — mismo mecanismo, proporción distinta.
              min-h-* en el contenedor (2026-08-06, Jose: "el texto quedó
              muy pegado... se mete debajo de él") — el avatar es absolute,
              así que NO le suma altura a este contenedor; sin el min-h, lo
              que viene después (los badges) arrancaba apenas termina el
              bloque de texto (más bajo que el avatar) y el avatar de abajo
              se lo tapaba. El min-h es la porción del avatar que cuelga
              por debajo del punto de anclaje (2/3 de su alto). */}
          <div className="relative min-h-16 sm:min-h-[85px] md:min-h-[107px]">
            <div className="absolute left-0 top-0 -translate-y-1/3 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-gray-100 shadow-md overflow-hidden">
              {artista.foto_url ? (
                <img src={cloudinaryFill(artista.foto_url, 320, 320)} alt={artista.nombre} className="w-full h-full object-cover" loading="eager" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl font-black">
                  {artista.nombre?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>

            <div className="min-w-0 pt-2 pl-[108px] sm:pl-[144px] md:pl-[176px] flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl md:text-2xl font-black uppercase leading-tight truncate">{artista.nombre}</h1>
                {/* Ciudad y especialidad apiladas, cada una en su propia
                    línea (2026-08-06, Jose) — antes iban lado a lado en una
                    sola fila. */}
                <div className="mt-1 space-y-0.5">
                  {/* Enlace real a Google Maps (2026-08-07, Jose) — v2:
                      "como botón no es claro... debería ser sensible" — el
                      texto subrayado no se leía como botón real y el área
                      de toque era muy chica en celular. Ahora es un botón
                      con fondo/borde visibles y feedback al tocar
                      (active:). Link propio si lo pegó, si no el punto
                      exacto capturado, si no búsqueda por
                      nombre+municipio. Nunca queda sin link. */}
                  <a
                    href={urlGoogleMaps(artista)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:scale-95 transition-all border border-gray-300 rounded-full px-2 py-0.5 max-w-full truncate"
                  >
                    <MapPin size={10} className="flex-shrink-0" />
                    <span className="truncate">{artista.municipio}{artista.departamento ? `, ${artista.departamento}` : ''}</span>
                  </a>
                  {artista.estilo && (
                    <span className="flex items-center gap-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500 truncate">
                      <Palette size={10} className="flex-shrink-0" />
                      <span className="truncate">{artista.estilo}</span>
                    </span>
                  )}
                  {/* Cruce con el estudio (fase 3, 2026-08-06) — v2 (Jose:
                      "el artista no le pertenece al estudio" — se quita el
                      verbo de posesión, mismo estilo que municipio/estilo
                      arriba). v3 (Jose: "cómo hace la gente para saber que
                      es cliqueable" — sin la flecha ni el verbo, ya no
                      tenía ninguna señal de que se puede tocar): subrayado
                      en el texto, mismo recurso que ya usa esta página para
                      "Especialidades" y el "ver más" de la bio. */}
                  {/* v4 (fase 6.1, 2026-08-07, Jose) — si el vínculo es
                      con una empresa (marca proveedora), no con un
                      estudio de tatuaje real, se reencuadra como
                      patrocinio: mismo dato (`artista.estudio_id`), sin
                      inventar una relación nueva. */}
                  {artista.estudio && (
                    <Link
                      to={`/tattoo-artist-colombia/estudio/${artista.estudio.id}`}
                      className="flex items-center gap-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-700 transition-colors truncate"
                    >
                      {artista.estudio.tipo === 'empresa' ? <Award size={10} className="flex-shrink-0" /> : <Building2 size={10} className="flex-shrink-0" />}
                      <span className="truncate underline underline-offset-2 decoration-gray-300">
                        {artista.estudio.tipo === 'empresa' ? `Patrocinado por ${artista.estudio.nombre}` : artista.estudio.nombre}
                      </span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Precio (2026-08-06, Jose: "esa información va a
                  aparecer... por el lado derecho de la pantalla" — antes
                  vivía en su propia fila debajo de todo el encabezado,
                  empujando la bio hacia abajo; ahora comparte la misma
                  fila que nombre/ubicación, alineado a la derecha).
                  Disponibilidad ya no va acá — se movió arriba de la
                  card "Sobre mí" (ver más abajo). */}
              {artista.precio_nivel && (
                <span className="flex-shrink-0 text-xs font-bold tracking-widest text-gray-500 pt-0.5">{'$'.repeat(artista.precio_nivel)}</span>
              )}
            </div>
          </div>

          {/* mt-6 (2026-08-06, Jose: "pegaste mucho 'sobre mí' a la foto
              de perfil") — precio/disponibilidad ya no viven acá para dar
              ese respiro, hay que ponerlo explícito en el margen. */}
          <div className="mt-6 space-y-2">

            {/* "Sobre mí" (2026-08-06, Jose: "el mismo sistema... como
                está Mercado Pago en la card de agenda en línea, y que la
                descripción parezca que está contenida en un chat") —
                mismo truco de insignia mitad afuera/mitad adentro que ya
                usa el badge de MP, acá arriba en vez de abajo. La esquina
                superior izquierda de la burbuja se deja cuadrada
                (rounded-tl-sm) para que se lea como una burbuja de chat,
                justo donde "clipa" la insignia. */}
            {artista.bio && (
              <div className="relative max-w-xl">
                <div className="bg-gray-100 border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3.5">
                  {/* "Ver más" (2026-08-06, Jose: "si la info de sobre mí
                      sobrepasa las 3 líneas, deberá aparecer el botón ver
                      más como el que implementamos en la card de los
                      diseños") — mismo patrón: recorte por defecto, scroll
                      interno con max-h al expandir en vez de dejar que la
                      burbuja crezca sin límite. */}
                  <p ref={bioRef} className={`text-gray-700 text-sm leading-relaxed ${bioExpandida ? 'max-h-32 overflow-y-auto pr-1' : 'line-clamp-3'}`}>
                    {artista.bio}
                  </p>
                  {bioDesborda && (
                    <button
                      type="button"
                      onClick={() => setBioExpandida((v) => !v)}
                      className="text-[10px] font-black uppercase tracking-wide mt-1.5 text-gray-700 hover:opacity-70 transition-opacity"
                    >
                      {bioExpandida ? 'Ver menos' : 'Ver más'}
                    </button>
                  )}
                </div>
                <span className="absolute -top-3 left-4 px-2.5 py-1 rounded-full bg-white border border-gray-300 shadow-sm text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Sobre mí
                </span>
                {/* Disponibilidad (2026-08-06, Jose: "ponlo justo encima
                    de la card 'sobre mí', pero por su lado derecho" — y
                    "quedó como si fuera una burbuja que hace parte de la
                    bio, debe quedar encimita") — v2: antes usaba un
                    fondo del acento casi transparente (7% opacidad), que
                    se perdía contra el gris de la burbuja y parecía texto
                    suelto adentro. Ahora fondo sólido + sombra (mismo
                    "pop" que ya usa la insignia de MP) y -top-4 en vez de
                    -top-3, para que quede claramente montada encima, no
                    incrustada. Color sólido por estado, no el rojo de
                    marca — "Disponible ahora" debe leerse como algo
                    bueno a simple vista. */}
                {artista.disponibilidad && (
                  <span
                    className="absolute -top-4 right-4 px-2 py-1 rounded-full whitespace-nowrap text-[8.5px] font-bold uppercase tracking-wide text-white shadow-md"
                    style={{ backgroundColor: DISPONIBILIDAD_COLOR[artista.disponibilidad] || ACCENT }}
                  >
                    {DISPONIBILIDAD_TEXTO[artista.disponibilidad] || artista.disponibilidad}
                  </span>
                )}
              </div>
            )}

            {/* PORTAFOLIO — v2 (2026-08-06, Jose: "encierra portafolio en
                una card gris... ponlo a la izquierda, para que el título
                y descripción sean una sola línea... para que no quede
                lejos de la card de sobre mí") — pasa de sección suelta a
                todo el ancho, a una card compacta del mismo ancho que la
                burbuja de bio (max-w-xl) y dentro del mismo space-y-2,
                así el espaciado entre ambas es automático y mínimo.
                Título+descripción combinados en un solo `<p>` con
                truncate — nunca se parte en dos líneas sin importar el
                largo del nombre/municipio. */}
            {trabajos.length > 0 && (
              <div className="max-w-xl">
                <div className="bg-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
                  <p className="px-4 pt-3.5 pb-2 text-gray-400 text-[11px] text-left overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <span className="uppercase tracking-widest font-bold text-gray-500">Portafolio</span> — Tatuajes hechos por {artista.nombre} en {artista.municipio}
                  </p>
                  <div className="grid grid-cols-3 gap-0.5 sm:gap-1 w-full">
                    {trabajos.map((src, i) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setLightbox(i)}
                        className="relative aspect-square bg-gray-50 overflow-hidden group"
                      >
                        <img src={cloudinaryFill(src, 400, 400)} alt={`Trabajo ${i + 1} de ${artista.nombre}`} className="w-full h-full object-cover" loading="lazy" />
                        <span className="absolute bottom-1.5 right-1.5 flex items-center justify-center w-6 h-6 bg-black/60 text-white rounded-full backdrop-blur-sm group-hover:bg-black/80 transition-colors">
                          <Search size={12} />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4">
          <div className="mt-6 space-y-2">

            {/* Reservar (fase 2, 2026-08-06) — aparece solo si el artista
                activó su precio para agendar. Card propia (no texto suelto
                + botón sin relación visual, Jose 2026-08-06) para que el
                texto informativo y el botón se lean como una sola unidad.
                precio_sesion_texto es puramente informativo (muchos
                artistas no quieren publicar el precio real del tatuaje),
                nunca es lo que se cobra.
                v2 (2026-08-06, Jose: "no dice la información suficiente...
                que significa ese número") — se agrega UNA frase que
                explica la mecánica (mismo texto que ya vivía escondido
                dentro del modal, ahora visible antes de decidir). El botón
                ya no repite el precio (ya queda claro en la grilla de
                abajo) — sin escribir un párrafo largo.
                v3 (2026-08-06, Jose: "una card dividida en 4... la primera
                dirá el valor de mi sesión y abajo el precio, la otra dirá
                para agendar y su precio abajo") — grilla 2x2: etiquetas
                arriba, valores abajo. Si el artista no llenó
                precio_sesion_texto (es opcional, muchos no quieren publicar
                precio de tatuaje), se muestra solo el bloque de "Para
                agendar" solo, sin la grilla vacía a su lado.
                v4 (2026-08-06, Jose: "quitemos los rojos... card gris medio
                con estilo premium", y "que se vean similares" los dos
                precios). v5 (Jose: "no se ve premium" — flat solid gray
                no alcanza) — degradado sutil (efecto metal cepillado, no
                un solo gris plano), línea de acento clara arriba (mismo
                recurso visual que tarjetas VIP/metálicas reales), borde
                fino para definir el canto, sombra más profunda para que
                la card "flote". precio_sesion_texto pasó a número real
                (ver ArtistaEditarPerfilPage.jsx) — formatearValorSesion
                sigue de respaldo por si queda algún texto viejo guardado. */}
            {artista.precio_agendar && (
              // Dos capas (2026-08-06, Jose: la insignia de MP debe quedar
              // mitad afuera/mitad adentro de la esquina, mismo truco que
              // el avatar montado sobre la portada) — la card visual de
              // adentro sigue con overflow-hidden (esquinas y degradado
              // limpios), la insignia vive afuera de esa capa, como
              // hermana, posicionada respecto a ESTE wrapper exterior — así
              // puede sobresalir sin que se le corte nada.
              <div className="relative mt-2 max-w-xl">
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 border border-gray-500/30 shadow-2xl shadow-gray-900/40">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent" />
                  <div className="pt-2.5 px-4 pb-7">
                    {/* v6 (2026-08-06, Jose: quitar "Reserva tu cita" + su
                        frase, título nuevo "Agenda en línea" — card más
                        angosta verticalmente; números más chicos; botón AL
                        FRENTE de los precios, no debajo).
                        v7 (Jose: "deja mucho espacio" — menos padding). */}
                    <p className="text-[11px] font-black uppercase tracking-widest mb-2 text-gray-300">Agenda en línea</p>

                    {/* v13 (2026-08-06, Jose): probamos pegar "Agendar" a
                        "Para agendar" (v12) pero el hueco vacío solo se
                        movió al lado derecho de la card en vez del medio —
                        de vuelta a v9: botón fijo contra el borde derecho
                        vía justify-between. */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-6">
                        {artista.precio_sesion_texto && (
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5 whitespace-nowrap text-center">Valor de mi sesión</p>
                            <p className="text-base font-black text-white leading-snug truncate text-center">{formatearValorSesion(artista.precio_sesion_texto)}</p>
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5 whitespace-nowrap text-center">Para agendar</p>
                          <p className="text-base font-black text-white whitespace-nowrap text-center">
                            ${Number(artista.precio_agendar).toLocaleString('es-CO')}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={abrirReserva}
                        className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white text-gray-900 font-black uppercase tracking-widest text-[11px] hover:opacity-90 transition-opacity"
                      >
                        Agendar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Insignia de confianza de Mercado Pago (2026-08-06) — se
                    movió acá desde el encabezado del perfil (Jose: ahí
                    competía con precio/disponibilidad, que son datos del
                    artista, no de la transacción). No se duplica también
                    junto a "Comprar" de cada diseño ni dentro de los
                    modales de pago — esos ya tienen su propia línea "Pago
                    100% seguro, procesado por Mercado Pago", sería
                    redundante repetirlo ahí.
                    v8 (Jose): esquina inferior derecha, mitad afuera/mitad
                    adentro — mismo mecanismo que el avatar sobre la
                    portada (posición absoluta + mitad de su propio alto
                    hacia afuera del borde). */}
                {/* v10 (2026-08-06, Jose: "quita el texto pago seguro, y
                    solo deja el logo") — sin texto ni ícono de tarjeta, el
                    badge se queda en una sola línea siempre (ya no hay nada
                    que pueda forzarlo a partirse en dos). */}
                {/* z-10 (2026-08-06, Jose: "cuando me paro en la card de
                    diseños de láminas, este se superpone y tapa el
                    botoncito de mercado pago... siempre se mantenga por
                    debajo") — sin z-index, la sección de Diseños (que
                    viene después en el DOM) puede pintarse encima de esta
                    insignia cuando se abre/expande y su contenido se
                    acerca al borde inferior de la card de Agenda. */}
                {artista.mp_conectado && (
                  <span
                    className="absolute -bottom-3 right-4 z-10 flex items-center px-2.5 py-1 rounded-full bg-white border shadow-md"
                    style={{ borderColor: MP_BLUE }}
                  >
                    <img
                      src={MP_LOGO_URL}
                      alt="Mercado Pago"
                      className="h-4"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  </span>
                )}

                {/* Términos y condiciones (2026-08-06, Jose) — explica por
                    qué conviene agendar en línea en vez de solo WhatsApp,
                    sin ser un candado (WhatsApp sigue gratis). v11 (Jose:
                    "estiró la card, no la estires, solo ubícalo abajo a la
                    izquierda") — posición absoluta como la insignia de MP,
                    ya no ocupa su propio renglón en el flujo normal. */}
                <button
                  type="button"
                  onClick={() => setMostrarTerminos(true)}
                  className="absolute bottom-2 left-4 z-10 text-[10px] text-gray-400 underline decoration-gray-500 hover:text-gray-200 transition-colors"
                >
                  Términos y condiciones
                </button>

                {/* Tooltip de onboarding sobre "Para agendar" (2026-08-11)
                    — aclara que ese número es un ABONO parcial, no el
                    precio completo del tatuaje. Mismo patrón de las de
                    ArtistasColombiaPage.jsx (una sola vez, localStorage).
                    Vive como HERMANA de la card `overflow-hidden` (mismo
                    truco que la insignia de MP y "Términos y condiciones"
                    arriba) — anidarlo adentro lo recortaría contra el
                    borde de la card, igual que le pasó al hero del
                    buscador con su propio overflow-hidden. */}
                {tooltipAgendarVisible && (
                  <div className="absolute z-20 top-full mt-3 left-4 w-72 max-w-[calc(100vw-2rem)] bg-gray-900 rounded-xl p-4 shadow-xl text-left">
                    <span className="absolute -top-1.5 left-6 w-3 h-3 bg-gray-900 rotate-45" />
                    <p className="text-xs leading-relaxed text-gray-200">
                      "Para agendar" es un abono para reservar tu cita — no el precio completo del tatuaje. El resto se paga directo con {artista.nombre}, el día de tu sesión.
                    </p>
                    <button
                      onClick={cerrarTooltipAgendar}
                      className="mt-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:opacity-80 transition-opacity"
                    >
                      Entendido
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* DISEÑOS A LA VENTA — venta directa (2026-08-05), primer paso de
            monetización del directorio. v2 (2026-08-06, Jose: "debajo de
            la card de agenda en línea vamos a poner dos botones... uno
            será de diseños para tatuar, y el otro diseños digitales a la
            venta... cada botón desplegará su contenido, así no cargamos
            todo de una vez") — separados por tipo detrás de un botón
            desplegable cada uno, mismo patrón de fila a 2 columnas que
            usa Redes sociales más abajo. El grid con marca de agua de
            cada tipo solo se monta cuando esa sección está abierta, así
            el navegador no pide esas fotos hasta que el visitante decide
            explorar esa categoría — y la descripción bajo cada botón es
            la que le permite decidir sin tener que abrirlo primero. */}
        {(disenosTatuar.length > 0 || disenosDigital.length > 0) && (
          <div className="mt-2 max-w-3xl mx-auto">
            <div className="grid grid-cols-2 w-full border-t border-b border-gray-200">
              <button
                type="button"
                onClick={() => setSeccionDisenos((s) => (s === 'tatuar' ? null : 'tatuar'))}
                disabled={disenosTatuar.length === 0}
                aria-expanded={seccionDisenos === 'tatuar'}
                className={`relative flex flex-col items-center justify-center gap-1 text-center py-3.5 px-2 pl-7 border-r border-gray-200 transition-colors ${
                  disenosTatuar.length > 0 ? (seccionDisenos === 'tatuar' ? 'bg-gray-50' : 'hover:bg-gray-50 cursor-pointer') : 'cursor-default'
                }`}
              >
                {/* Ícono a la esquina inferior izquierda (2026-08-06,
                    Jose), fuera del título — pl-7 en el botón le hace
                    espacio para que no se solape con el texto centrado. */}
                <Palette size={14} className={`absolute bottom-2 left-2 ${disenosTatuar.length > 0 ? 'text-gray-400' : 'text-gray-300'}`} />
                <span className={`text-xs sm:text-sm font-black uppercase tracking-widest ${disenosTatuar.length > 0 ? 'text-gray-700' : 'text-gray-300'}`}>
                  Ideas únicas, listas para tu piel
                </span>
                {/* Sin la frase extra (2026-08-06, Jose: "es redundante
                    con la descripción que aparece al abrir cada card")
                    — solo el contador. */}
                <span className={`text-[9.5px] font-medium leading-snug ${disenosTatuar.length > 0 ? 'text-gray-400' : 'text-gray-300'}`}>
                  {disenosTatuar.length > 0
                    ? `${disenosTatuar.length} diseño${disenosTatuar.length > 1 ? 's' : ''}`
                    : 'Aún no hay disponibles'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSeccionDisenos((s) => (s === 'digital' ? null : 'digital'))}
                disabled={disenosDigital.length === 0}
                aria-expanded={seccionDisenos === 'digital'}
                className={`relative flex flex-col items-center justify-center gap-1 text-center py-3.5 px-2 pl-7 transition-colors ${
                  disenosDigital.length > 0 ? (seccionDisenos === 'digital' ? 'bg-gray-50' : 'hover:bg-gray-50 cursor-pointer') : 'cursor-default'
                }`}
              >
                <ImageIcon size={14} className={`absolute bottom-2 left-2 ${disenosDigital.length > 0 ? 'text-gray-400' : 'text-gray-300'}`} />
                <span className={`text-xs sm:text-sm font-black uppercase tracking-widest ${disenosDigital.length > 0 ? 'text-gray-700' : 'text-gray-300'}`}>
                  Arte para llevar a casa
                </span>
                <span className={`text-[9.5px] font-medium leading-snug ${disenosDigital.length > 0 ? 'text-gray-400' : 'text-gray-300'}`}>
                  {disenosDigital.length > 0
                    ? `${disenosDigital.length} lámina${disenosDigital.length > 1 ? 's' : ''}`
                    : 'Aún no hay disponibles'}
                </span>
              </button>
            </div>

            {seccionDisenos === 'tatuar' && disenosTatuar.length > 0 && (
              <div className="pt-2">
                <p className="px-4 text-gray-500 text-[11px] leading-relaxed mb-1.5">Diseños elaborados por {artista.nombre}, listos para tatuar. Cada uno es único — al venderse, deja de estar disponible para los demás.</p>
                {renderGridDisenos(disenosTatuar)}
              </div>
            )}
            {seccionDisenos === 'digital' && disenosDigital.length > 0 && (
              <div className="pt-2">
                <p className="px-4 text-gray-500 text-[11px] leading-relaxed mb-1.5">Láminas digitales para imprimir y enmarcar — diseños exclusivos del artista.</p>
                {renderGridDisenos(disenosDigital)}
              </div>
            )}
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

        {/* REDES SOCIALES — Facebook e Instagram, en 2 bloques a todo el
            ancho de la COLUMNA del perfil. v2 (2026-08-06, Jose: "ubicar
            la sesión redes sociales en la parte de abajo, antes del
            footer") — se movió desde justo debajo del encabezado hasta
            acá, ya que la prioridad de la página ahora es la agenda en
            línea y los diseños en venta primero. Si el artista todavía no
            tiene el link cargado, el bloque se queda visible pero
            deshabilitado con un aviso, nunca se oculta. */}
        <div className="mt-6 max-w-3xl mx-auto">
          {/* Empujón sutil hacia Agenda en línea (2026-08-06, Jose) — tono
              de invitación, no de advertencia: WhatsApp se queda gratis y
              abierto como siempre, esto solo recuerda que la opción de
              pago existe más arriba. Solo aparece si el artista activó
              "para agendar". Centrado (Jose) — ya no hay una etiqueta
              "Redes sociales" a su izquierda con la que alinearse; los
              íconos de Facebook/Instagram de abajo ya se explican solos. */}
          {artista.precio_agendar && (
            <p className="px-4 text-gray-500 text-[11px] mb-3 text-center">¿Prefieres asegurar tu cupo? Agenda en línea más arriba ↑</p>
          )}
          <div className={`grid grid-cols-2 w-full border-t border-gray-200 ${waLink ? '' : 'border-b'}`}>
            <a
              href={artista.facebook || undefined}
              target={artista.facebook ? '_blank' : undefined}
              rel={artista.facebook ? 'noopener noreferrer' : undefined}
              onClick={artista.facebook ? undefined : (e) => { e.preventDefault(); mostrarAvisoRed('Facebook') }}
              aria-disabled={!artista.facebook}
              className={`flex items-center justify-center gap-2.5 py-3.5 border-r border-gray-200 transition-colors ${
                artista.facebook ? 'text-gray-700 hover:bg-gray-50 cursor-pointer' : 'text-gray-300 cursor-pointer'
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
              onClick={artista.instagram ? undefined : (e) => { e.preventDefault(); mostrarAvisoRed('Instagram') }}
              aria-disabled={!artista.instagram}
              className={`flex items-center justify-center gap-2.5 py-3.5 transition-colors ${
                artista.instagram ? 'text-gray-700 hover:bg-gray-50 cursor-pointer' : 'text-gray-300 cursor-pointer'
              }`}
            >
              <FaInstagram size={18} />
              <span className="flex flex-col items-start leading-tight">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Instagram</span>
                {!artista.instagram && <span className="text-[9px] font-medium normal-case tracking-normal text-gray-300">Aún no se ha subido</span>}
              </span>
            </a>
          </div>

          {/* CONTACTAR AL ARTISTA — se queda justo debajo de redes
              sociales, viajan juntos como un solo bloque (2026-08-04 /
              2026-08-06). */}
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

        <div className="max-w-3xl mx-auto px-4">
          <div className="border-t border-gray-200 pt-5 mt-6 pb-10">
            <Link to="/tattoo-artist-colombia" className="text-gray-400 hover:text-gray-900 text-xs uppercase tracking-widest transition-colors">
              ← Ver más artistas
            </Link>
          </div>
        </div>
      </div>

      {/* Enlaces legales (2026-08-06, Jose) — el módulo de artistas era el
          único sin enlace a /terminos ni /privacidad, aunque esas páginas
          ya existen y ahora /terminos cubre el directorio (sección 6). */}
      <footer className="border-t border-gray-200 py-6 px-4 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-400 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} Tattoo Artist Colombia — Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link to="/tattoo-artist-colombia/terminos" className="text-gray-400 hover:text-gray-700 transition-colors">Términos</Link>
            <Link to="/tattoo-artist-colombia/privacidad" className="text-gray-400 hover:text-gray-700 transition-colors">Privacidad</Link>
            <span className="text-gray-300">Desarrollado por INKognito</span>
          </div>
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
            src={cloudinaryLimit(trabajos[lightbox])}
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

      {/* LIGHTBOX de diseños (2026-08-06, Jose: "poner la opción ver para
          que la imagen se vea en tamaño completo tal como pasa con
          portafolio") — mismo patrón que el de Trabajos arriba, con dos
          diferencias: sigue con marca de agua (no se compró todavía) y
          comparte disenosImgIdx con la card de navegación, así la foto en
          la que ibas no se pierde al cerrar. */}
      {disenoLightboxId !== null && (() => {
        const d = disenos.find((x) => x.id === disenoLightboxId)
        if (!d) return null
        const imgs = [d.imagen_url, d.imagen_url_2, d.imagen_url_3].filter(Boolean)
        const idx = disenosImgIdx[d.id] || 0
        const ir = (delta) => setDisenosImgIdx((s) => ({ ...s, [d.id]: (idx + delta + imgs.length) % imgs.length }))
        const onTouchEndLB = (e) => {
          if (touchStartX.current == null) return
          const delta = e.changedTouches[0].clientX - touchStartX.current
          touchStartX.current = null
          if (Math.abs(delta) < 40) return
          ir(delta < 0 ? 1 : -1)
        }
        return (
          <div
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
            onClick={() => setDisenoLightboxId(null)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEndLB}
          >
            <button
              type="button"
              onClick={() => setDisenoLightboxId(null)}
              aria-label="Cerrar"
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2"
            >
              <X size={26} />
            </button>

            {imgs.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); ir(-1) }}
                  aria-label="Anterior"
                  className="absolute left-1 sm:left-4 text-white/60 hover:text-white transition-colors p-3"
                >
                  <ChevronLeft size={30} />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); ir(1) }}
                  aria-label="Siguiente"
                  className="absolute right-1 sm:right-4 text-white/60 hover:text-white transition-colors p-3"
                >
                  <ChevronRight size={30} />
                </button>
              </>
            )}

            <img
              src={conMarcaDeAgua(imgs[idx])}
              alt={d.titulo || 'Diseño'}
              className="max-w-[90vw] max-h-[82vh] object-contain select-none"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />

            {imgs.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                {imgs.map((_, i) => (
                  <span key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/40'}`} />
                ))}
              </div>
            )}
          </div>
        )
      })()}

      {/* MODAL DE COMPRA — card informativa tipo landing de producto
          (2026-08-05, Jose: "tipo hotmar, una card ultra informativa,
          nombre valor, y descripcion" — este modal es la pieza clave de
          conversión, no un simple resumen técnico del pago). Galería de
          hasta 3 fotos + descripción de venta que escribió el artista;
          pide el correo del comprador (ahí llega el diseño limpio, sin
          marca de agua, tras confirmar el pago) y redirige a Mercado Pago. */}
      {disenoComprando && (() => {
        const imagenes = [disenoComprando.imagen_url, disenoComprando.imagen_url_2, disenoComprando.imagen_url_3].filter(Boolean)
        return (
          <div
            className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center px-4 py-8"
            onClick={() => !comprando && setDisenoComprando(null)}
          >
            <div className="bg-white rounded-2xl w-full max-w-sm max-h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <img
                  src={conMarcaDeAgua(imagenes[modalImgIdx])} alt="" className="w-full aspect-square object-cover"
                  draggable={false} onContextMenu={(e) => e.preventDefault()}
                />
                <div className="absolute top-2.5 left-2.5 bg-black/60 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                  {disenoComprando.tipo === 'lamina' ? 'Lámina' : 'Tatuaje'}
                </div>
                {imagenes.length > 1 && (
                  <>
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {imagenes.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setModalImgIdx(i)}
                          aria-label={`Foto ${i + 1}`}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${i === modalImgIdx ? 'bg-white' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                    <button type="button" onClick={() => setModalImgIdx((i) => (i - 1 + imagenes.length) % imagenes.length)} aria-label="Foto anterior" className="absolute left-1.5 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1.5">
                      <ChevronLeft size={20} />
                    </button>
                    <button type="button" onClick={() => setModalImgIdx((i) => (i + 1) % imagenes.length)} aria-label="Foto siguiente" className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1.5">
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              <div className="p-5">
                <p className="font-black uppercase text-base leading-tight mb-1.5">{disenoComprando.titulo || 'Diseño'}</p>
                {/* Frase orientativa (2026-08-05, Jose) — distinta según el
                    tipo: para tatuaje se apoya en un hecho real (el diseño
                    se reserva/desaparece al venderse, no es solo hype). */}
                <p className="text-gray-500 text-xs italic mb-2">
                  {disenoComprando.tipo === 'lamina'
                    ? 'Llévate este diseño para enmarcar y hacerlo tuyo.'
                    : 'Reserva este diseño y plásmalo en tu piel — es exclusivo, una vez vendido deja de estar disponible para los demás.'}
                </p>
                <p className="text-2xl font-black mb-3" style={{ color: MP_BLUE }}>
                  ${Number(disenoComprando.precio).toLocaleString('es-CO')} <span className="text-xs font-bold text-gray-400">COP</span>
                </p>

                {disenoComprando.descripcion && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-line">{disenoComprando.descripcion}</p>
                )}

                <form onSubmit={comprarDiseno} className="space-y-2.5">
                  <input
                    required
                    type="email"
                    placeholder="Tu correo (ahí recibirás el diseño)"
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
                  <p className="text-gray-400 text-[10px] text-center">Pago 100% seguro, procesado por Mercado Pago.</p>
                  <button type="button" onClick={() => setDisenoComprando(null)} className="w-full text-center text-gray-400 text-[11px] uppercase tracking-widest py-1">
                    Cancelar
                  </button>
                </form>
              </div>
            </div>
          </div>
        )
      })()}

      {/* MODAL DE RESERVA (fase 2, 2026-08-06) — mismo patrón que el de
          compra de diseño, más simple (sin galería/marca de agua). Pide
          nombre + WhatsApp + correo porque el artista necesita poder
          contactar al cliente para coordinar la fecha, no solo mandarle un
          archivo. */}
      {reservando && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center px-4 py-8"
          onClick={() => !enviandoReserva && setReservando(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-sm max-h-full overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <p className="font-black uppercase text-base leading-tight mb-1.5">Reservar con {artista.nombre}</p>

            {/* Paso 1 — calendario de mes (fase 1 de agenda, 2026-08-19).
                Solo existe si el artista configuró horario; si no, el
                modal salta directo al paso 3 y esto nunca se renderiza. */}
            {artista.tiene_horario && reservaPaso === 1 && (
              <>
                <p className="text-gray-500 text-xs italic mb-3">Elige un día disponible.</p>
                <div className="flex items-center justify-between mb-2">
                  <button type="button" onClick={() => cambiarMes(-1)} className="p-1 text-gray-400 hover:text-gray-700">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-black uppercase">{MESES_CALENDARIO[reservaMesVisible.month]} {reservaMesVisible.year}</span>
                  <button type="button" onClick={() => cambiarMes(1)} className="p-1 text-gray-400 hover:text-gray-700">
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 mb-1">
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => <span key={i}>{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {celdasDelMes(reservaMesVisible.year, reservaMesVisible.month).map((c, i) => {
                    if (!c) return <span key={i} />
                    const estado = dispoMes[c.iso]
                    const disponible = estado === 'disponible'
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={!disponible}
                        onClick={() => elegirDia(c.iso)}
                        className={`aspect-square rounded-lg text-[11px] font-bold flex items-center justify-center transition-colors ${
                          disponible ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'text-gray-300'
                        }`}
                      >
                        {c.dia}
                      </button>
                    )
                  })}
                </div>
                {cargandoMes && <p className="text-center text-gray-400 text-[11px] mt-3">Cargando disponibilidad...</p>}
                <button type="button" onClick={() => setReservando(false)} className="w-full text-center text-gray-400 text-[11px] uppercase tracking-widest py-1 mt-3">
                  Cancelar
                </button>
              </>
            )}

            {/* Paso 2 — franjas del día elegido. */}
            {artista.tiene_horario && reservaPaso === 2 && (
              <>
                <button type="button" onClick={() => setReservaPaso(1)} className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2">
                  ‹ Cambiar día
                </button>
                <p className="text-gray-500 text-xs italic mb-3">{fechaElegida} — elige una hora.</p>
                {cargandoDia ? (
                  <p className="text-center text-gray-400 text-xs py-8">Cargando horarios...</p>
                ) : slotsDia.length === 0 ? (
                  <p className="text-center text-gray-400 text-xs py-8">Ese día no tiene franjas configuradas.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {slotsDia.map((s) => (
                      <button
                        key={s.hora_inicio}
                        type="button"
                        disabled={!s.libre}
                        onClick={() => elegirHora(s.hora_inicio)}
                        className={`py-2 rounded-lg text-[11px] font-bold border transition-colors ${
                          s.libre ? 'border-gray-300 text-gray-700 hover:border-gray-500' : 'border-gray-100 text-gray-300 line-through'
                        }`}
                      >
                        {formatearHora12(s.hora_inicio)}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Paso 3 — formulario de contacto (el único paso que existe
                para un artista sin horario configurado). */}
            {(!artista.tiene_horario || reservaPaso === 3) && (
              <>
                {artista.tiene_horario && fechaElegida && horaElegida && (
                  <button
                    type="button"
                    onClick={() => setReservaPaso(1)}
                    className="w-full text-left bg-gray-50 rounded-lg px-3 py-2 mb-3 text-[11px] font-bold text-gray-600"
                  >
                    📅 {fechaElegida} · {formatearHora12(horaElegida)} — <span className="underline">Cambiar</span>
                  </button>
                )}
                <p className="text-gray-500 text-xs italic mb-3">
                  {artista.tiene_horario
                    ? `Vas a agendar directamente tu cita — ${artista.nombre} confirma por WhatsApp los detalles del diseño.`
                    : `${artista.nombre} se pondrá en contacto contigo para coordinar la fecha después de tu pago.`}
                </p>
                <p className="text-2xl font-black mb-3" style={{ color: MP_BLUE }}>
                  ${Number(artista.precio_agendar).toLocaleString('es-CO')} <span className="text-xs font-bold text-gray-400">COP</span>
                </p>

                <form onSubmit={hacerReserva} className="space-y-2.5">
                  <input
                    required
                    type="text"
                    placeholder="Tu nombre"
                    value={resNombre}
                    onChange={(e) => setResNombre(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-500"
                  />
                  <input
                    required
                    type="text"
                    placeholder="Tu WhatsApp (573XXXXXXXXX)"
                    value={resTelefono}
                    onChange={(e) => setResTelefono(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-500"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Tu correo (ahí recibirás la confirmación)"
                    value={resEmail}
                    onChange={(e) => setResEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-500"
                  />
                  <textarea
                    rows={2}
                    placeholder="¿Qué tatuaje tienes en mente? (opcional)"
                    value={resMensaje}
                    onChange={(e) => setResMensaje(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-500 resize-none"
                  />
                  {errorReserva && <p className="text-xs" style={{ color: ACCENT }}>{errorReserva}</p>}
                  <button
                    type="submit"
                    disabled={enviandoReserva}
                    className="w-full py-3 text-white font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 text-xs flex items-center justify-center gap-2"
                    style={{ backgroundColor: MP_BLUE }}
                  >
                    {enviandoReserva ? (
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
                  <p className="text-gray-400 text-[10px] text-center">Pago 100% seguro, procesado por Mercado Pago.</p>
                  <button type="button" onClick={() => setReservando(false)} className="w-full text-center text-gray-400 text-[11px] uppercase tracking-widest py-1">
                    Cancelar
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Términos y condiciones de "Agenda en línea" (2026-08-06) — texto
          persuasivo, no un candado: WhatsApp/redes se quedan gratis y
          abiertos, esto es una vía adicional. El punto de venta real es
          que el artista recibe de inmediato los datos de contacto + la
          idea del tatuaje por correo, en vez de depender de encontrar el
          mensaje entre WhatsApp. */}
      {mostrarTerminos && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center px-4 py-8"
          onClick={() => setMostrarTerminos(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-sm max-h-full overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <p className="font-black uppercase text-base leading-tight mb-3">Cómo funciona agendar en línea</p>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>El WhatsApp y las redes de {artista.nombre} siguen siendo gratis para ti — puedes escribirle directo, cuando quieras.</p>
              <p>Agendar y abonar en línea es una vía adicional, pensada para avanzar más rápido: al confirmarse el pago, {artista.nombre} recibe de inmediato un correo con tus datos de contacto y la idea de tu tatuaje.</p>
              <p>{artista.tiene_horario
                ? <>Eliges el día y la hora exacta en el calendario de {artista.nombre} — tu cita queda agendada de una vez, sin ir y venir por WhatsApp para cuadrar fecha.</>
                : <>Con esa información completa, {artista.nombre} se pone en contacto contigo para coordinar la valoración, el diseño y, después, la fecha de tu cita — sin que tu solicitud se pierda entre otros mensajes.</>}</p>
              <p>El pago se procesa de forma segura por Mercado Pago — nunca compartes tus datos de tarjeta con el artista ni con INKognito.</p>
              <p className="font-bold text-gray-800">Es la forma más directa de convertir tu idea en una cita real.</p>
            </div>
            <button type="button" onClick={() => setMostrarTerminos(false)} className="w-full mt-5 py-3 text-white font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity text-xs" style={{ backgroundColor: BTN }}>
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Aviso de red social no agregada (2026-08-06, Jose: "algo bien
          profesional") — toast simple abajo, se cierra solo. */}
      {avisoRed && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[70] bg-gray-900 text-white text-xs font-medium px-4 py-3 rounded-lg shadow-lg max-w-[90vw] text-center">
          {artista.nombre} todavía no agregó su {avisoRed} — puedes escribirle por WhatsApp mientras tanto.
        </div>
      )}
    </div>
  )
}
