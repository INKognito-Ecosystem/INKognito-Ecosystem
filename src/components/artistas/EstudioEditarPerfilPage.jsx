import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLoaderData, useNavigate, useSearchParams } from 'react-router-dom'
import { Camera, LoaderCircle, Mail, Pencil, MapPin, Users, UserPlus, X, Navigation, Check, Trash2, ShoppingBag, ExternalLink, Wallet, ChevronDown, CopyPlus, Eye, Plus, Link2 } from 'lucide-react'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import NavbarArtistas from './NavbarArtistas'
import ComboboxBuscable from './ComboboxBuscable'
import EditarPerfilTabs from './EditarPerfilTabs'
import { DEPARTAMENTOS, MUNICIPIOS_POR_DEPARTAMENTO } from '../../data/colombiaGeo'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
// Mismo mecanismo de sesión persistida que ArtistaEditarPerfilPage.jsx
// (2026-08-06) — key propia para no chocar con el token del artista.
const EDIT_TOKEN_KEY = 'estudio_edit_token'
const BTN = '#374151'
const MP_BLUE = '#3483FA'
const MP_LOGO_URL = 'https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/5.21.0/mercadopago/logo__large@2x.png'

// Dashboard de estudio (fase 3 del directorio, 2026-08-06) — mellizo
// simplificado de ArtistaEditarPerfilPage.jsx: mismo mecanismo de sesión
// sin contraseña por token, misma edición in-situ del hero. Un estudio
// tiene muchos menos campos que un artista (sin estilo/precio/agenda), así
// que todo cabe en un solo bloque editable, sin la separación en
// "hero editable + formulario largo debajo" que sí necesita el artista.
export async function loader({ request }) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token) return { token: null }
  try {
    const [estudioRes, configRes, invitacionesRes] = await Promise.all([
      fetch(`${PANEL_URL}/api/estudios-por-token?token=${encodeURIComponent(token)}`),
      fetch(`${PANEL_URL}/api/upload-config`),
      fetch(`${PANEL_URL}/api/estudios-invitaciones-por-token?token=${encodeURIComponent(token)}`),
    ])
    const estudio = estudioRes.ok ? await estudioRes.json() : null
    const config = configRes.ok ? await configRes.json() : { cloud_name: null, upload_preset: null }
    const invitaciones = invitacionesRes.ok ? await invitacionesRes.json() : []
    if (!estudio) return { token, estudio: null, error: 'Este link ya no es válido — pídelo de nuevo.' }
    return { token, estudio, invitaciones, ...config }
  } catch {
    return { token, estudio: null, error: 'No pudimos cargar tu estudio — intenta de nuevo en un momento.' }
  }
}

export function meta() {
  return [{ title: 'Editar mi estudio | Tattoo Artist Colombia' }]
}

const inputClass = 'w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors'
const labelClass = 'text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block'

// Pantalla 1 — sin token: solo pide el correo y dispara el envío del link.
function PedirLinkForm() {
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setEnviando(true)
    try {
      await fetch(`${PANEL_URL}/api/estudios-solicitar-edicion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {
      // Mismo mensaje de éxito aunque falle la red — no revela si un
      // correo existe o no en la base.
    } finally {
      setEnviando(false)
      setEnviado(true)
    }
  }

  if (enviado) {
    return (
      <div className="text-center max-w-sm mx-auto">
        <Mail size={40} className="mx-auto mb-4 text-gray-400" />
        <h1 className="text-xl font-black uppercase mb-3">Revisa tu correo</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Si <strong>{email}</strong> tiene un estudio activo, te mandamos un link para editarlo.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-xl font-black uppercase mb-2 text-center">Editar mi estudio</h1>
      <p className="text-gray-500 text-sm text-center mb-6">
        Escribe el correo con el que registraste tu estudio — te mandamos un link para editarlo, sin contraseña.
      </p>
      <form onSubmit={enviar} className="space-y-3">
        <input
          required
          type="email"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
        />
        <button
          type="submit"
          disabled={enviando}
          className="w-full py-3 text-white font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 text-sm"
          style={{ backgroundColor: BTN }}
        >
          {enviando ? 'Enviando...' : 'Mandarme el link'}
        </button>
      </form>
    </div>
  )
}

// "Mi equipo" + "Invitar artista" (2026-08-06) — el mecanismo de
// crecimiento que describió Jose: el estudio invita por correo, y si esa
// persona no tiene perfil todavía, la invitación la manda a registrarse
// como artista y queda vinculada de una. Autocontenido, fuera del <form>
// principal — mismo criterio que "Mis diseños en venta" en el perfil de
// artista (su propio ciclo de vida, sus propios endpoints).
// esEmpresa (fase 6.2, 2026-08-07, Jose: "desde editar mi marca, mandar
// el correo de patrocinio a algún artista") — mismos datos/endpoints
// (estudio.artistas, /api/estudios-invitar, /api/estudios-quitar-artista),
// solo cambia el copy: para una empresa esto es patrocinio, no "mi
// equipo". Antes esta sección se ocultaba por completo para tipo=empresa
// — ya no tiene sentido con la idea de patrocinio.
function MiEquipoSection({ token, artistas, invitacionesIniciales, esEmpresa }) {
  const [invitaciones, setInvitaciones] = useState(invitacionesIniciales || [])
  const [email, setEmail] = useState('')
  const [invitando, setInvitando] = useState(false)
  const [equipo, setEquipo] = useState(artistas || [])
  const [error, setError] = useState(null)

  const invitar = async (e) => {
    e.preventDefault()
    setError(null)
    setInvitando(true)
    try {
      const res = await fetch(`${PANEL_URL}/api/estudios-invitar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || '')
      setInvitaciones((prev) => [{ id: Date.now(), email, estado: 'pendiente', created_at: new Date().toISOString() }, ...prev])
      setEmail('')
    } catch (err) {
      setError(err.message || 'No pudimos enviar la invitación — intenta de nuevo.')
    } finally {
      setInvitando(false)
    }
  }

  const quitar = async (artistaId) => {
    setEquipo((prev) => prev.filter((a) => a.id !== artistaId))
    try {
      await fetch(`${PANEL_URL}/api/estudios-quitar-artista`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, artista_id: artistaId }),
      })
    } catch {
      // Si falla, el artista sigue vinculado del lado del panel — se
      // corrige solo en el siguiente refresh de la página.
    }
  }

  return (
    <div className="mb-8 -mx-4 md:mx-0 bg-gray-50 border-y md:border border-gray-200 md:rounded-2xl px-4 py-5">
      <p className={labelClass}><Users size={12} className="inline -mt-0.5 mr-1" />{esEmpresa ? 'Artistas patrocinados' : 'Mi equipo'}</p>
      {equipo.length === 0 ? (
        <p className="text-gray-400 text-xs mb-4">{esEmpresa ? 'Todavía no patrocinas a ningún artista — patrocina al primero abajo.' : 'Todavía no tienes artistas en tu equipo — invita al primero abajo.'}</p>
      ) : (
        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide mb-4 pb-1">
          {equipo.map((a) => (
            <div key={a.id} className="relative flex-shrink-0 snap-start w-32 bg-white border border-gray-200 rounded-xl overflow-hidden">
              <Link to={`/artista/${a.id}`} className="block">
                <div className="w-full aspect-square bg-gray-100">
                  {a.foto_url ? (
                    <img src={a.foto_url} alt={a.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl font-black">{a.nombre?.[0]?.toUpperCase() || '?'}</div>
                  )}
                </div>
                <p className="px-2 py-1.5 text-[11px] font-bold truncate">{a.nombre}</p>
              </Link>
              <button
                type="button"
                onClick={() => quitar(a.id)}
                aria-label={esEmpresa ? `Quitar patrocinio a ${a.nombre}` : `Quitar a ${a.nombre} del estudio`}
                className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className={labelClass}><UserPlus size={12} className="inline -mt-0.5 mr-1" />{esEmpresa ? 'Patrocinar artista' : 'Invitar artista'}</p>
      <form onSubmit={invitar} className="flex gap-2 mb-3">
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@delartista.com"
          className={inputClass}
        />
        <button
          type="submit"
          disabled={invitando}
          className="flex-shrink-0 px-4 py-2.5 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
          style={{ backgroundColor: BTN }}
        >
          {invitando ? '...' : esEmpresa ? 'Patrocinar' : 'Invitar'}
        </button>
      </form>
      {error && <p className="text-red-600 text-xs mb-2">{error}</p>}

      {invitaciones.length > 0 && (
        <div className="space-y-1.5">
          {invitaciones.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between gap-2 text-xs text-gray-500">
              <span className="truncate">{inv.email}</span>
              <span className={
                inv.estado === 'aceptada' ? 'text-green-600 font-bold' : inv.estado === 'rechazada' ? 'text-gray-400' : 'text-amber-600 font-bold'
              }>
                {inv.estado === 'aceptada' ? 'Aceptada' : inv.estado === 'rechazada' ? 'Rechazada' : 'Pendiente'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Mismo set fijo que ya usa el panel (INV_CATEGORIAS.supply), MENOS
// 'Cursos' y 'Kit Externo' (Jose, 2026-08-09: "no podrá subir kit
// externo, ni cursos... eso lo manejo solo yo de momento") — esas dos
// categorías son contenido curado a mano por Jose (afiliados/cursos
// digitales), no algo que un proveedor externo deba poder autopublicar.
// Server-side también las excluye de SUPPLY_CATEGORIAS_ESTUDIO en
// server.js — este archivo es SOLO el dashboard de autoservicio del
// proveedor, el panel admin (public/index.html) sigue con el set
// completo sin tocar. Las páginas de categoría de Supply son rutas fijas
// por texto exacto, un valor libre dejaría el producto sin ninguna
// página real donde aparecer.
// Sin "Recursos" (2026-08-27, Jose: "elimina recursos de esta elección,
// pues estos solo los subo yo de momento") — esa categoría es para
// contenido educativo curado (ebooks/cursos afiliados, ver AprendePage.jsx
// y categoria='Recursos' con tipo='afiliado'), no inventario físico que un
// estudio suba por su cuenta.
const SUPPLY_CATEGORIAS = ['Tintas', 'Cartuchos', 'Agujas', 'Máquinas', 'Guantes', 'Cuidados', 'Fuentes', 'Accesorios', 'Mobiliario', 'Combos']
// Mismo set fijo que INV_MARCAS.supply en el panel (public/index.html) —
// copia local, mismo criterio que SUPPLY_CATEGORIAS de arriba.
const SUPPLY_MARCAS = [
  { value: '', label: '— Sin marca / genérica —' },
  { value: 'wjx', label: 'WJX' },
  // 'kwadron' es la marca global de agujas/cartuchos (y también mobiliario,
  // ver nota en MARCAS_POR_CATEGORIA) — 'industrias-warlock' es un
  // proveedor LOCAL de mobiliario aparte, sin relación con la marca
  // Kwadron (ver project_proveedor_warlock_mobiliario en memoria). Antes
  // este mismo valor 'kwadron' traía la etiqueta "Industrias Warlock
  // (mobiliario)" — así aparecía mal en Cartuchos/Agujas (Jose,
  // 2026-08-09: "warlock no debería aparecer allí, solo marcas de
  // agujas"). Separados en dos opciones reales.
  { value: 'kwadron', label: 'Kwadron' },
  { value: 'industrias-warlock', label: 'Industrias Warlock (mobiliario)' },
  { value: 'ez-tattoo', label: 'EZ Tattoo' },
  { value: 'vice-colors', label: 'Vice Colors' },
  { value: 'dynamic', label: 'Dynamic' },
  { value: 'eternal', label: 'Eternal' },
  { value: 'intenze', label: 'Intenze' },
  { value: 'fusion', label: 'Fusion' },
  { value: 'world-famous', label: 'World Famous' },
  { value: 'solid-ink', label: 'Solid Ink' },
  { value: 'tattoo-vision', label: 'Tattoo Vision' },
  { value: 'heaven-pro', label: 'Heaven Pro' },
  { value: 'royal-three', label: 'Royal Three' },
  // Fuentes de poder — marcas profesionales reconocidas internacionalmente
  // (investigado 2026-08-09, sin inventario real todavía en esta categoría).
  { value: 'cheyenne', label: 'Cheyenne' },
  { value: 'critical', label: 'Critical' },
  { value: 'tatsoul', label: 'TATSoul' },
  { value: 'bishop', label: 'Bishop' },
  // Guantes — a diferencia de tintas/agujas, la mayoría de estudios compra
  // guantes genéricos de distribuidor médico sin lealtad de marca; estas
  // dos sí aparecen específicamente ligadas al gremio de tatuaje.
  { value: 'gorilla', label: 'Gorilla' },
  { value: 'naturflex', label: 'Naturflex' },
]
const SUPPLY_MARCA_LABEL = (v) => SUPPLY_MARCAS.find((m) => m.value === v)?.label || v

// Qué marcas tiene sentido ofrecer según la categoría elegida (Jose,
// 2026-08-09: "si agrego tintas, en marcas debería aparecerme solo
// tintas"). Investigado marca por marca (2026-08-09) — nada de "general,
// aparece en todas" sin verificar primero:
// - Tattoo Vision: NO es distribuidora general — es una marca colombiana
//   de tecnología de visualización (luz polarizada para ver la
//   saturación mientras se tatúa), un producto de equipo/accesorio, no
//   tinta ni cuidado ni cartucho.
// - Royal Three: tampoco es general — es específicamente una marca de
//   cuidado/proceso (mixers diluyentes, cremas, jabón, limpiador
//   anestésico pre-tatuaje) — encaja en Cuidados, no en tintas/cartuchos.
// - Eternal/Intenze/Fusion/World Famous/Solid Ink: tintas puras,
//   confirmado.
// - EZ Tattoo: cartuchos/agujas puro, confirmado.
// - Kwadron: sí es de verdad multi-línea — agujas/cartuchos Y mobiliario
//   (banquetas, estaciones de trabajo), confirmado con fuentes reales.
const MARCAS_POR_CATEGORIA = {
  'Tintas':      ['vice-colors', 'dynamic', 'eternal', 'intenze', 'fusion', 'world-famous', 'solid-ink'],
  'Cartuchos':   ['wjx', 'kwadron', 'ez-tattoo'],
  'Agujas':      ['wjx', 'kwadron', 'ez-tattoo'],
  'Cuidados':    ['heaven-pro', 'royal-three'],
  'Mobiliario':  ['kwadron', 'industrias-warlock'],
  'Máquinas':    ['tattoo-vision'],
  'Accesorios':  ['tattoo-vision'],
  'Fuentes':     ['cheyenne', 'critical', 'tatsoul', 'bishop'],
  'Guantes':     ['gorilla', 'naturflex'],
}
// Categoría sin entrada acá (Combos, Cursos, Kit Externo, Recursos, o
// cualquiera nueva que se agregue después) → solo "Sin marca / genérica",
// NUNCA la lista completa. Antes faltaban 6 de las 13 categorías reales de
// Supply en este mapa y todas caían al fallback "mostrar todo", por eso
// Fuentes mostraba marcas de tintas y agujas (Jose, 2026-08-09). Estas 4
// categorías tampoco son realmente "de marca" — un combo mezcla productos
// de varias marcas, un curso/recurso digital no tiene fabricante.
const marcasParaCategoria = (categoria) => {
  const permitidas = MARCAS_POR_CATEGORIA[categoria] || []
  return SUPPLY_MARCAS.filter((m) => m.value === '' || permitidas.includes(m.value)).map((m) => m.value)
}

// descripcionAuto: si la descripción actual vino sola (cascada
// categoría/marca), sigue siendo "refrescable" al cambiar de categoría/
// marca después. En cuanto el proveedor la toca a mano, o viene de un
// producto real (editar, vincular del buscador), deja de tocarse sola
// (reportado 2026-08-09: una camilla se quedó con la descripción de
// cartuchos porque había quedado autocompletada de una categoría
// elegida antes, y cambiar de categoría/marca después no la refrescaba).
const PRODUCTO_VACIO = { product: '', variant: '', price: '', stock: '', categoria: SUPPLY_CATEGORIAS[0], marca: '', image_url: '', descripcion: '', descripcionAuto: false, master_product_id: null }

// "Mis productos en Supply" (fase 4, 2026-08-07, Supply multitenant) —
// solo se renderiza si el estudio tiene vende_supply activo (Jose lo
// activa uno por uno desde el panel, mismo criterio de curaduría que ya
// usa con Tommy/Warlock). Mismo patrón de CRUD autocontenido que
// MisDisenosSection en ArtistaEditarPerfilPage.jsx, adaptado a los
// campos de un producto (una sola foto, categoría fija, variante y
// stock) en vez de un diseño.
function MisProductosSupplySection({ token, cloud_name, upload_preset }) {
  // Desplegable como Mis Ventas — a diferencia de esa sección, acá ni
  // siquiera se pide la lista al servidor hasta que se abre por primera
  // vez (puede traer fotos de muchos productos, no vale la pena cargarlo
  // de entrada si el proveedor no lo va a abrir).
  const [open, setOpen] = useState(false)
  const [productos, setProductos] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [nuevo, setNuevo] = useState(PRODUCTO_VACIO)
  const [editando, setEditando] = useState(null)
  const [error, setError] = useState(null)
  const [masterResults, setMasterResults] = useState([])
  const [varianteDe, setVarianteDe] = useState(null)
  const fileInput = useRef(null)
  const masterSearchTimer = useRef(null)
  const cargadoRef = useRef(false)
  // Tabla tipo Excel (2026-08-27, Jose: "como hemos venido organizando los
  // del panel... si son muchos que se vean bien organizados en columnas,
  // no cards grandes") — reemplaza las cards de imagen grande por filas
  // agrupadas por producto (expandibles si hay más de una variante),
  // mismo espíritu que el inventario del panel admin. El formulario ya no
  // está siempre visible: ahora es un modal, abierto por el botón
  // "Agregar producto" o al tocar "Ver"/"Editar" en una fila.
  const [formAbierto, setFormAbierto] = useState(false)
  const [verGrupo, setVerGrupo] = useState(null)
  const [grupoExpandido, setGrupoExpandido] = useState(null)
  // Link público por producto (2026-08-27, Jose: "que se pueda hacer
  // publicidad con ese link... hazlo visible para mirarlo") — el
  // mecanismo YA existe end-to-end: /p/:id (ProductLandingPage.jsx) lee
  // /api/product/:id, que ya hace JOIN con estudios y ya muestra
  // "Suministrado por X" + enruta el pago Split a la cuenta de ESTE
  // estudio, dinámico por producto. Solo faltaba mostrarlo — cualquier
  // id de variante del grupo sirve, la landing agrupa todas las
  // variantes del mismo producto igual que acá.
  const [linkCopiado, setLinkCopiado] = useState(false)
  const copiarLink = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopiado(true)
      setTimeout(() => setLinkCopiado(false), 1500)
    }).catch(() => {})
  }

  useEffect(() => {
    if (!open || cargadoRef.current) return
    cargadoRef.current = true
    setCargando(true)
    fetch(`${PANEL_URL}/api/estudios-inventario-por-token?token=${encodeURIComponent(token)}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setProductos)
      .catch(() => setProductos([]))
      .finally(() => setCargando(false))
  }, [open, token])

  const subirFoto = async (file) => {
    if (!file || !cloud_name || !upload_preset) return
    setSubiendo(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', upload_preset)
      fd.append('folder', 'inkognito-supply-estudios')
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) setNuevo((n) => ({ ...n, image_url: data.secure_url }))
    } catch {
      setError('No pudimos subir la foto — intenta de nuevo.')
    } finally {
      setSubiendo(false)
    }
  }

  const iniciarEdicion = (p) => {
    setError(null)
    setEditando(p.id)
    setVarianteDe(null)
    setMasterResults([])
    setNuevo({ product: p.product, variant: p.variant || '', price: p.price, stock: p.stock, categoria: p.categoria, marca: p.marca || '', image_url: p.image_url || '', descripcion: p.descripcion || '', descripcionAuto: false, master_product_id: null })
    setFormAbierto(true)
  }
  const cancelarEdicion = () => { setEditando(null); setVarianteDe(null); setNuevo(PRODUCTO_VACIO); setMasterResults([]); setError(null); setFormAbierto(false) }
  const abrirNuevoProducto = () => {
    setError(null)
    setEditando(null)
    setVarianteDe(null)
    setMasterResults([])
    setNuevo(PRODUCTO_VACIO)
    setFormAbierto(true)
  }

  // Agregar una variante (talla, sabor, color...) de un producto propio ya
  // cargado — a diferencia de "editar", esto SIEMPRE crea una fila nueva
  // (POST, no PUT), pero copia el nombre/categoría/marca EXACTOS del
  // producto original para que quede agrupado en la misma card en la web
  // de Supply en vez de crear un producto aparte por una diferencia de
  // texto (mayúsculas, espacios) al retipear el nombre a mano.
  const agregarVariante = (p) => {
    setError(null)
    setEditando(null)
    setVarianteDe(p.product)
    setMasterResults([])
    setNuevo({ product: p.product, variant: '', price: p.price || '', stock: '', categoria: p.categoria, marca: p.marca || '', image_url: '', descripcion: p.descripcion || '', descripcionAuto: false, master_product_id: p.master_product_id || null })
    setFormAbierto(true)
  }

  // Catálogo maestro — buscar un producto ya cargado por otro proveedor
  // (o por Jose desde el panel admin) para no retipear nombre/categoría/
  // marca/descripción desde cero.
  const onProductInput = (value) => {
    setNuevo((n) => ({ ...n, product: value, master_product_id: null }))
    clearTimeout(masterSearchTimer.current)
    if (value.trim().length < 2) { setMasterResults([]); return }
    masterSearchTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`${PANEL_URL}/api/master-catalog/search?module=supply&categoria=${encodeURIComponent(nuevo.categoria || '')}&q=${encodeURIComponent(value.trim())}`)
        const data = await res.json()
        setMasterResults(data.results || [])
      } catch { setMasterResults([]) }
    }, 300)
  }

  // Autocompletar la descripción EN VIVO al elegir categoría/marca (no solo
  // al guardar, que confundía — Jose, 2026-08-09: "mientras subía producto
  // tampoco se autocompletó de manera automática"). Nunca pisa algo que el
  // proveedor ya haya escrito — mismo criterio que la cascada del servidor.
  const prefillDescripcion = async (categoria, marca) => {
    try {
      const res = await fetch(`${PANEL_URL}/api/catalogo-defaults-lookup?module=supply&categoria=${encodeURIComponent(categoria || '')}&marca=${encodeURIComponent(marca || '')}`)
      const data = await res.json()
      // Se refresca si el campo está vacío O si lo que hay ahí sigue
      // siendo una sugerencia automática de una elección anterior — pero
      // nunca si el proveedor ya la escribió a mano o vino de un
      // producto real (editar, vincular del buscador).
      if (data.descripcion) {
        setNuevo((n) => (n.descripcion && !n.descripcionAuto ? n : { ...n, descripcion: data.descripcion, descripcionAuto: true }))
      }
    } catch { /* silencioso — el proveedor siempre puede escribirla a mano */ }
  }

  const seleccionarMaster = (item) => {
    setNuevo((n) => ({
      ...n,
      product: item.product,
      categoria: item.categoria || n.categoria,
      marca: item.marca || n.marca,
      descripcion: item.descripcion || n.descripcion,
      descripcionAuto: false,
      image_url: n.image_url || item.image_url || '',
      master_product_id: item.id,
    }))
    setMasterResults([])
  }

  const guardar = async () => {
    if (!nuevo.product.trim() || !nuevo.price) {
      setError('El nombre y el precio son obligatorios.')
      return
    }
    // Obligatoria (Jose, 2026-08-09): una fila sin variante quedaba
    // invisible/inseleccionable en la card de Supply cuando comparte
    // producto con otra fila que sí la tiene. Si el producto de verdad
    // no tiene variantes, escribe "Único" o algo simple — decisión tuya,
    // no un texto que el sistema inventa en silencio.
    if (!nuevo.variant.trim()) {
      setError('Escribe una variante (talla, sabor, color...) — o "Único" si el producto no tiene variantes.')
      return
    }
    setError(null)

    // Si no se está editando/vinculando uno ya existente, avisar (sin
    // bloquear) si hay algo muy parecido en el catálogo maestro.
    if (!editando && !nuevo.master_product_id) {
      try {
        const simRes = await fetch(`${PANEL_URL}/api/master-catalog/similar?module=supply&categoria=${encodeURIComponent(nuevo.categoria || '')}&product=${encodeURIComponent(nuevo.product.trim())}`)
        const simData = await simRes.json()
        if (simData.results?.length) {
          const nombres = simData.results.map((r) => `• ${r.product}${r.marca ? ' — ' + r.marca : ''}`).join('\n')
          const seguir = window.confirm(`Ya existe algo parecido en el catálogo maestro:\n\n${nombres}\n\n¿Seguro que es un producto distinto?\n\nAceptar = crear de todos modos.\nCancelar = revisar el nombre.`)
          if (!seguir) return
        }
      } catch { /* si falla la verificación, no bloquear el guardado */ }
    }

    setGuardando(true)
    try {
      const url = editando ? `${PANEL_URL}/api/estudios-inventario-por-token/${editando}` : `${PANEL_URL}/api/estudios-inventario-por-token`
      const res = await fetch(url, {
        method: editando ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...nuevo }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '')
      if (editando) {
        setProductos((ps) => ps.map((x) => x.id === editando ? data : x))
      } else {
        setProductos((ps) => [data, ...(ps || [])])
      }
      cancelarEdicion()
    } catch (err) {
      setError(err.message || 'No pudimos guardar — intenta de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  const toggleActivo = async (p) => {
    const res = await fetch(`${PANEL_URL}/api/estudios-inventario-por-token/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, is_active: !p.is_active }),
    })
    if (res.ok) setProductos((ps) => ps.map((x) => x.id === p.id ? { ...x, is_active: !x.is_active } : x))
  }

  const borrar = async (p) => {
    const res = await fetch(`${PANEL_URL}/api/estudios-inventario-por-token/${p.id}?token=${encodeURIComponent(token)}`, { method: 'DELETE' })
    if (res.ok) {
      setProductos((ps) => ps.filter((x) => x.id !== p.id))
      if (editando === p.id) cancelarEdicion()
    }
  }

  // Agrupar por nombre exacto de producto — mismo criterio que usa la
  // tienda pública de Supply para armar una sola card con variantes
  // (GROUP BY product), para que el dashboard se vea igual de agrupado
  // que la web en vez de una card por fila/variante.
  const grupos = useMemo(() => {
    if (!productos) return []
    const mapa = new Map()
    for (const p of productos) {
      if (!mapa.has(p.product)) mapa.set(p.product, { product: p.product, categoria: p.categoria, variantes: [] })
      mapa.get(p.product).variantes.push(p)
    }
    return [...mapa.values()]
  }, [productos])

  // Categoría/marca "reales" (2026-08-09, Jose: "que aparezcan las
  // categorías y marcas reales detrás de cada producto"). No hay forma de
  // adivinar la marca real de un nombre que nunca se ha subido — pero para
  // un producto que SÍ ya existe (vinculado del buscador de catálogo
  // maestro, o una variante nueva de algo propio ya cargado), la
  // categoría/marca reales ya se conocen y no deberían poder desviarse por
  // error. Mismo principio que departamento→municipio: una vez el valor
  // está confirmado contra un dato real, el campo deja de ser editable a
  // mano.
  const categoriaMarcaBloqueada = !!varianteDe || !!nuevo.master_product_id

  return (
    <div className="mb-8 -mx-4 md:mx-0 bg-gray-50 border-y md:border border-gray-200 md:rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-4 flex items-center justify-between gap-2 text-left hover:bg-gray-100 transition-colors"
      >
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          <ShoppingBag size={12} />
          Mis productos en Supply
        </span>
        <ChevronDown size={16} className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-5">
          <p className="text-gray-400 text-[10px] mb-4">Aparecen en tu propio catálogo (enlazado desde tu perfil) y también mezclados en la tienda general de Supply, en su categoría correspondiente.</p>

          {cargando ? (
            <p className="text-gray-400 text-xs text-center py-4">Cargando...</p>
          ) : (
            <>
              <button
                type="button"
                onClick={abrirNuevoProducto}
                className="w-full mb-4 py-2.5 flex items-center justify-center gap-1.5 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: BTN }}
              >
                <Plus size={14} />
                Agregar producto a mi tienda
              </button>

              {grupos.length === 0 ? (
                <p className="text-gray-400 text-xs text-center py-6">Todavía no tienes productos — agrega el primero arriba.</p>
              ) : (
                /* Tabla tipo Excel (2026-08-27, Jose: "como hemos venido
                   organizando los del panel... si son muchos que se vean
                   bien organizados en columnas" — y luego, al ocultar las
                   columnas en móvil: "eso no se ve en móvil", quería el
                   encabezado también ahí, no solo en PC). Columnas fijas
                   SIEMPRE visibles (mismo grid-cols en header y filas, en
                   cualquier tamaño de pantalla) — si no caben todas en un
                   celular angosto, la tabla scrollea horizontal en vez de
                   esconder columnas, igual que Excel/Sheets en el celular. */
                <div className="border border-gray-200 rounded-lg overflow-x-auto">
                  <div className="min-w-[454px]">
                    <div className="grid grid-cols-[minmax(190px,1fr)_60px_40px_116px] gap-2 px-3 py-2 bg-gray-100 border-b border-gray-200 text-[9px] font-bold uppercase tracking-wide text-gray-400">
                      <span>Producto</span>
                      <span className="text-right">Precio</span>
                      <span className="text-center">Stock</span>
                      <span className="text-right">Acciones</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {grupos.map((g) => {
                        const portada = g.variantes.find((v) => v.image_url)?.image_url
                        const unaSola = g.variantes.length === 1
                        const expandido = grupoExpandido === g.product
                        return (
                          <div key={g.product}>
                            <div className="grid grid-cols-[minmax(190px,1fr)_60px_40px_116px] gap-2 items-center px-3 py-2 hover:bg-gray-50 transition-colors">
                              <button
                                type="button"
                                onClick={() => !unaSola && setGrupoExpandido((cur) => cur === g.product ? null : g.product)}
                                className={`flex items-center gap-2 min-w-0 text-left ${unaSola ? 'cursor-default' : ''}`}
                              >
                                <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                  {portada ? <img src={portada} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-[8px]">Sin foto</div>}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-xs text-gray-900 truncate">{g.product}</p>
                                  <p className="text-[10px] text-gray-400 truncate">
                                    {g.categoria}
                                    {!unaSola && ` · ${g.variantes.length} variantes`}
                                  </p>
                                </div>
                              </button>
                              {unaSola ? (
                                <>
                                  <span className="text-xs text-gray-700 text-right">${Number(g.variantes[0].price).toLocaleString('es-CO')}</span>
                                  <span className="text-xs text-gray-700 text-center">{g.variantes[0].stock}</span>
                                </>
                              ) : (
                                <>
                                  <span />
                                  <span />
                                </>
                              )}
                              <div className="flex items-center justify-end gap-2.5 text-gray-400 flex-shrink-0">
                              <button type="button" onClick={() => setVerGrupo(g)} aria-label="Ver producto" title="Ver"><Eye size={14} /></button>
                              <button type="button" onClick={() => agregarVariante(g.variantes[0])} aria-label="Agregar variante" title="Agregar variante (talla, sabor, color...)"><CopyPlus size={13} /></button>
                              {unaSola ? (
                                <>
                                  <button type="button" onClick={() => iniciarEdicion(g.variantes[0])} aria-label="Editar producto" title="Editar"><Pencil size={13} /></button>
                                  <button type="button" onClick={() => borrar(g.variantes[0])} aria-label="Borrar producto" title="Borrar"><Trash2 size={13} /></button>
                                </>
                              ) : (
                                <button type="button" onClick={() => setGrupoExpandido((cur) => cur === g.product ? null : g.product)} aria-label="Ver variantes" title="Variantes">
                                  <ChevronDown size={14} className={`transition-transform ${expandido ? 'rotate-180' : ''}`} />
                                </button>
                              )}
                            </div>
                          </div>

                          {!unaSola && expandido && (
                            <div className="px-3 pb-2 pt-1 space-y-1 bg-gray-50">
                              {g.variantes.map((v) => (
                                <div key={v.id} className={`flex items-center justify-between gap-2 text-[11px] rounded-md px-2.5 py-1.5 bg-white border border-gray-100 ${v.is_active ? '' : 'opacity-50'}`}>
                                  <span className="truncate flex-1">{v.variant || 'Única'}</span>
                                  <span className="text-gray-500 flex-shrink-0">${Number(v.price).toLocaleString('es-CO')}</span>
                                  <span className="text-gray-400 flex-shrink-0 w-14 text-right">Stock {v.stock}</span>
                                  <div className="flex items-center gap-1.5 text-gray-400 flex-shrink-0">
                                    <button type="button" onClick={() => iniciarEdicion(v)} aria-label="Editar variante"><Pencil size={11} /></button>
                                    <button type="button" onClick={() => toggleActivo(v)} className="underline">{v.is_active ? 'Ocultar' : 'Mostrar'}</button>
                                    <button type="button" onClick={() => borrar(v)} aria-label="Borrar variante"><Trash2 size={11} /></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Modal: agregar/editar producto — ya no vive siempre visible
              en la sección (Jose, 2026-08-27), se abre con "Agregar
              producto a mi tienda" o al tocar "Editar"/"Agregar variante"
              en una fila. */}
          {formAbierto && (
            <div className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center px-0 sm:px-4" onClick={cancelarEdicion}>
              <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm max-h-[92vh] overflow-y-auto p-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-black uppercase text-gray-700">{editando ? 'Editando producto' : varianteDe ? 'Nueva variante' : 'Agregar producto'}</p>
                  <button type="button" onClick={cancelarEdicion} aria-label="Cerrar" className="text-gray-400"><X size={18} /></button>
                </div>
                <div className="space-y-2.5">
                  {varianteDe && (
                    <div className="bg-gray-100 rounded-md px-2.5 py-1.5">
                      <p className="text-[10px] text-gray-600">Nueva variante de <span className="font-black">{varianteDe}</span> — quedará agrupada con el mismo producto.</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" ref={fileInput} style={{ display: 'none' }} onChange={(e) => subirFoto(e.target.files?.[0])} />
                  <button type="button" onClick={() => fileInput.current?.click()} className="w-full aspect-video rounded-lg bg-white border border-gray-200 text-gray-400 overflow-hidden relative">
                    {nuevo.image_url ? (
                      <img src={nuevo.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    ) : subiendo ? (
                      <div className="w-full h-full flex items-center justify-center"><LoaderCircle size={16} className="animate-spin" /></div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                        <Camera size={16} />
                        <span className="text-[10px] font-bold uppercase">Foto del producto</span>
                      </div>
                    )}
                  </button>

                  <div className="relative">
                    <input className={`${inputClass} ${varianteDe ? 'bg-gray-100 text-gray-500' : ''}`} placeholder="Nombre del producto" autoComplete="off" readOnly={!!varianteDe} value={nuevo.product} onChange={(e) => onProductInput(e.target.value)} />
                    {masterResults.length > 0 && (
                      <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {masterResults.map((r) => (
                          <button type="button" key={r.id} onClick={() => seleccionarMaster(r)} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center justify-between gap-2">
                            <span className="truncate">{r.product}{r.marca && <span className="text-gray-400"> — {r.marca}</span>}</span>
                            <span className="text-gray-400 text-[10px] flex-shrink-0">{r.categoria}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 text-[10px] -mt-1.5">Si ya alguien cargó este producto antes, elígelo de la lista para no repetir categoría/marca/descripción.</p>
                  <input className={inputClass} placeholder='Variante — talla, sabor, color... o "Único" si no aplica' value={nuevo.variant} onChange={(e) => setNuevo((n) => ({ ...n, variant: e.target.value }))} />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold pointer-events-none">$</span>
                      <input className={inputClass.replace('px-4', 'pl-7 pr-4')} type="number" min="1" placeholder="Precio en COP" value={nuevo.price} onChange={(e) => setNuevo((n) => ({ ...n, price: e.target.value }))} />
                    </div>
                    <input className={inputClass} type="number" min="0" placeholder="Stock" value={nuevo.stock} onChange={(e) => setNuevo((n) => ({ ...n, stock: e.target.value }))} />
                  </div>
                  <ComboboxBuscable
                    value={nuevo.categoria}
                    options={SUPPLY_CATEGORIAS}
                    placeholder="Categoría"
                    inputClassName={inputClass}
                    disabled={categoriaMarcaBloqueada}
                    onChange={(categoria) => {
                      // Al cambiar de categoría, si la marca elegida ya no
                      // aplica ahí (ej. venía de Tintas y ahora es Cartuchos),
                      // se limpia — evita dejar una marca incoherente guardada.
                      const marcasValidas = marcasParaCategoria(categoria)
                      const marcaSigueValida = marcasValidas.includes(nuevo.marca)
                      setNuevo((n) => ({ ...n, categoria, marca: marcaSigueValida ? n.marca : '' }))
                      prefillDescripcion(categoria, marcaSigueValida ? nuevo.marca : '')
                    }}
                  />
                  <ComboboxBuscable
                    value={nuevo.marca}
                    options={marcasParaCategoria(nuevo.categoria)}
                    labelFor={SUPPLY_MARCA_LABEL}
                    placeholder="Marca (opcional)"
                    inputClassName={inputClass}
                    disabled={categoriaMarcaBloqueada}
                    onChange={(marca) => { setNuevo((n) => ({ ...n, marca })); prefillDescripcion(nuevo.categoria, marca) }}
                  />
                  {nuevo.master_product_id && !varianteDe && (
                    <div className="flex items-center justify-between bg-green-50 rounded-md px-2.5 py-1.5 -mt-1">
                      <p className="text-[10px] text-green-700">✓ Categoría y marca reales — vinculadas al catálogo maestro.</p>
                      <button type="button" onClick={() => setNuevo((n) => ({ ...n, master_product_id: null }))} className="text-gray-400 text-[10px] font-bold uppercase underline flex-shrink-0 ml-2">No es este</button>
                    </div>
                  )}
                  <textarea rows={2} className={inputClass} placeholder="Descripción (opcional)" value={nuevo.descripcion} onChange={(e) => setNuevo((n) => ({ ...n, descripcion: e.target.value, descripcionAuto: false }))} />

                  {error && <p className="text-red-600 text-xs">{error}</p>}

                  <button
                    type="button"
                    onClick={guardar}
                    disabled={guardando}
                    className="w-full py-2.5 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
                    style={{ backgroundColor: BTN }}
                  >
                    {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : '+ Agregar producto'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal: ver detalle de un producto (2026-08-27, nuevo — antes
              la única forma de ver la foto/descripción era la card grande;
              con la tabla compacta hace falta un botón dedicado). */}
          {verGrupo && (
            <div className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center px-0 sm:px-4" onClick={() => setVerGrupo(null)}>
              <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* aspect-square (2026-08-27, Jose: "la imagen es exagerada,
                    no está manteniendo el tamaño que ya hemos organizado vía
                    Cloudinary") — antes aspect-video (16:9); las fotos de
                    producto se suben y se ven en todos lados en cuadrado
                    (mismo criterio que SupplyCategoryPage.jsx, la tienda
                    pública real), este modal era el único lugar mostrándolas
                    panorámicas. */}
                <div className="w-full aspect-square bg-gray-100">
                  {verGrupo.variantes.find((v) => v.image_url)?.image_url ? (
                    <img src={verGrupo.variantes.find((v) => v.image_url).image_url} alt={verGrupo.product} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">Sin foto</div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-black text-sm truncate">{verGrupo.product}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide truncate">{verGrupo.categoria}{verGrupo.variantes[0]?.marca ? ` · ${verGrupo.variantes[0].marca}` : ''}</p>
                    </div>
                    <button type="button" onClick={() => setVerGrupo(null)} aria-label="Cerrar" className="text-gray-400 flex-shrink-0"><X size={18} /></button>
                  </div>
                  {verGrupo.variantes[0]?.descripcion && (
                    <p className="text-gray-600 text-xs leading-relaxed mt-2">{verGrupo.variantes[0].descripcion}</p>
                  )}
                  <div className="mt-3 space-y-1.5">
                    {verGrupo.variantes.map((v) => (
                      <div key={v.id} className={`flex items-center justify-between text-xs rounded-md px-2.5 py-1.5 bg-gray-50 ${v.is_active ? '' : 'opacity-50'}`}>
                        <span className="truncate flex-1">{v.variant || 'Única'}</span>
                        <span className="text-gray-600 flex-shrink-0 mx-2">${Number(v.price).toLocaleString('es-CO')}</span>
                        <span className="text-gray-400 flex-shrink-0">Stock: {v.stock}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">Link para compartir este producto</p>
                    <div className="flex items-center gap-2">
                      <p className="flex-1 min-w-0 text-[11px] text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 truncate">
                        {`${import.meta.env.VITE_SITE_URL}/p/${verGrupo.variantes[0].id}`}
                      </p>
                      <button
                        type="button"
                        onClick={() => copiarLink(`${import.meta.env.VITE_SITE_URL}/p/${verGrupo.variantes[0].id}`)}
                        className="flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg text-white text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: BTN }}
                      >
                        {linkCopiado ? <Check size={12} /> : <Link2 size={12} />}
                        {linkCopiado ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => { const primera = verGrupo.variantes[0]; setVerGrupo(null); iniciarEdicion(primera) }}
                    className="w-full mt-3 py-2.5 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: BTN }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// "Mis ventas" (fase 5, 2026-08-07) — solo lectura, lo que ya pagaron los
// clientes vía Mercado Pago Split directo a la cuenta del estudio/empresa.
// La fuente de verdad real es el webhook del panel; acá solo se muestra
// lo que ya quedó confirmado como aprobado o quedó pendiente/rechazado.
// v2 (2026-08-07, Jose: "un botón que notifica... como los botones
// acordeón ya implementados") — mismo patrón toggle de AccordionCard.jsx
// (usado en las páginas de categoría de Supply), reestilado a la paleta
// blanco/gris de este módulo en vez del negro de Supply. La insignia con
// el conteo funciona como la "notificación" — cerrado por defecto, no
// hace falta abrir para saber si hay ventas.
function MisVentasSupplySection({ token }) {
  const [ventas, setVentas] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch(`${PANEL_URL}/api/estudios-ventas-supply-por-token?token=${encodeURIComponent(token)}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setVentas)
      .catch(() => setVentas([]))
  }, [token])

  if (!ventas || ventas.length === 0) return null

  return (
    // mb-2 (no mb-8) — Jose, 2026-08-09: quedaba mucho espacio muerto
    // entre este botón y "Mis productos en Supply", justo debajo.
    <div className="mb-2 -mx-4 md:mx-0 bg-gray-50 border-y md:border border-gray-200 md:rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-4 flex items-center justify-between gap-2 text-left hover:bg-gray-100 transition-colors"
      >
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          <Wallet size={12} />
          Mis ventas
          <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-white text-[10px] font-black" style={{ backgroundColor: BTN }}>
            {ventas.length}
          </span>
        </span>
        <ChevronDown size={16} className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-5 space-y-2">
          {ventas.map((v) => (
            <div key={v.id} className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs">
              <div className="min-w-0">
                <p className="font-bold truncate">{v.items.map((i) => `${i.cantidad}x ${i.product_nombre}`).join(', ')}</p>
                <p className="text-gray-400">{v.cliente_nombre || v.cliente_telefono} · {new Date(v.created_at).toLocaleDateString('es-CO')}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="font-black">${Number(v.monto_estudio).toLocaleString('es-CO')}</p>
                <p className={
                  v.estado === 'aprobado' ? 'text-green-600 font-bold' : v.estado === 'rechazado' ? 'text-gray-400' : 'text-amber-600 font-bold'
                }>
                  {v.estado === 'aprobado' ? 'Pagado' : v.estado === 'rechazado' ? 'Rechazado' : 'Pendiente'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FormularioEdicionEstudio({ token, estudio, cloud_name, upload_preset, invitaciones }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const mp = searchParams.get('mp')
  // Pestañas (2026-08-19) — mismo patrón que ArtistaEditarPerfilPage.jsx:
  // "Supply" solo aparece en el menú si el estudio tiene vende_supply
  // activo. Si la URL trae un ?tab= que ya no aplica (ej. se desactivó
  // Supply), cae de vuelta a "Mi perfil" en vez de mostrar una pestaña
  // fantasma.
  const tabsEstudio = [
    { key: 'perfil', label: 'Mi perfil', icon: MapPin },
    { key: 'equipo', label: estudio.tipo === 'empresa' ? 'Patrocinados' : 'Mi equipo', icon: Users },
    ...(estudio.vende_supply ? [{ key: 'supply', label: 'Supply', icon: ShoppingBag }] : []),
  ]
  const tabPedido = searchParams.get('tab')
  const activeTab = tabsEstudio.some((t) => t.key === tabPedido) ? tabPedido : 'perfil'
  const cambiarTab = (key) => {
    const next = new URLSearchParams(searchParams)
    next.set('tab', key)
    setSearchParams(next, { replace: true })
  }
  const [form, setForm] = useState({
    nombre: estudio.nombre || '', departamento: estudio.departamento || '', municipio: estudio.municipio || '',
    lat: estudio.lat ?? null, lng: estudio.lng ?? null,
    bio: estudio.bio || '', instagram: estudio.instagram || '', facebook: estudio.facebook || '', whatsapp: estudio.whatsapp || '',
    logo_url: estudio.logo_url || '', foto_portada: estudio.foto_portada || '',
    google_maps_url: estudio.google_maps_url || '', nombre_supply: estudio.nombre_supply || '',
    catalogo_url: estudio.catalogo_url || '',
    vende_cajas_surtidas: estudio.vende_cajas_surtidas || false,
    recargo_caja_surtida_pct: estudio.recargo_caja_surtida_pct ?? 0,
  })
  const [subiendo, setSubiendo] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [error, setError] = useState(null)
  const [editandoHero, setEditandoHero] = useState(false)
  // Tooltip de onboarding sobre el botón "Editar" (2026-08-19) — mismo
  // patrón exacto que ArtistaEditarPerfilPage.jsx / el de "Para agendar"
  // en ArtistaLandingPage.jsx, misma key de localStorage (cada página
  // corre en su propio dominio de token, no hay riesgo de que una
  // "consuma" el tooltip de la otra).
  const [tooltipEditarVisible, setTooltipEditarVisible] = useState(false)
  useEffect(() => {
    try {
      if (!localStorage.getItem('kg_tooltip_editar_visto')) setTooltipEditarVisible(true)
    } catch {}
  }, [])
  const cerrarTooltipEditar = () => {
    try { localStorage.setItem('kg_tooltip_editar_visto', '1') } catch {}
    setTooltipEditarVisible(false)
  }
  const [ubicando, setUbicando] = useState(false)
  const fileInputs = useRef({})

  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))
  const setDepartamento = (nuevo) => setForm((f) => ({ ...f, departamento: nuevo, municipio: '' }))
  const setMunicipio = (nuevo) => setForm((f) => ({ ...f, municipio: nuevo }))
  const municipiosDisponibles = MUNICIPIOS_POR_DEPARTAMENTO[form.departamento] || []

  // Ubicación exacta (2026-08-06, Jose: "por que el buscador no me lo
  // muestra como cercano") — el estudio creado a mano desde el panel
  // nace sin lat/lng (ese formulario no la pide); acá es donde se
  // completa, mismo patrón que ya usa el artista.
  const usarMiUbicacion = () => {
    if (!navigator.geolocation) return
    setUbicando(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => { setForm((f) => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude })); setUbicando(false) },
      () => setUbicando(false),
      { timeout: 8000 }
    )
  }

  const elegirFoto = (slot) => fileInputs.current[slot]?.click()
  const subirFoto = async (slot, file) => {
    if (!file || !cloud_name || !upload_preset) return
    setSubiendo(slot)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', upload_preset)
      fd.append('folder', 'inkognito-estudios')
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) setForm((f) => ({ ...f, [slot]: data.secure_url }))
    } catch {
      setError('No pudimos subir esa foto — intenta de nuevo.')
    } finally {
      setSubiendo(null)
    }
  }

  const guardar = async (e) => {
    e.preventDefault()
    setError(null)
    setGuardando(true)
    try {
      const res = await fetch(`${PANEL_URL}/api/estudios-editar-por-token`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...form }),
      })
      if (!res.ok) throw new Error()
      setGuardado(true)
      setTimeout(() => setGuardado(false), 2500)
    } catch {
      setError('No pudimos guardar los cambios — intenta de nuevo en un momento.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="max-w-3xl lg:max-w-none mx-auto">
      <div className="px-4 max-w-3xl mx-auto">
        {searchParams.get('bienvenida') === '1' && (
          <p className="text-sm text-center mb-4 py-2 rounded-lg bg-green-50 text-green-700 font-bold">✓ Tu correo quedó confirmado — ya puedes editar tu perfil</p>
        )}
      </div>

      {SLOTS_ESTUDIO.map(({ key }) => (
        <input
          key={key}
          type="file"
          accept="image/*"
          ref={(el) => { fileInputs.current[key] = el }}
          style={{ display: 'none' }}
          onChange={(e) => subirFoto(key, e.target.files?.[0])}
        />
      ))}

      <EditarPerfilTabs tabs={tabsEstudio} activeTab={activeTab} onChange={cambiarTab}>

      <div className={activeTab === 'perfil' ? 'block' : 'hidden'}>
      <div className="px-4 max-w-3xl mx-auto lg:mx-0">

      <div className="w-full h-40 sm:h-56 bg-gray-100 overflow-hidden relative rounded-2xl">
        {form.foto_portada && <img src={form.foto_portada} alt="" className="w-full h-full object-cover" />}
        <button
          type="button"
          onClick={() => elegirFoto('foto_portada')}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 text-white text-[11px] font-bold uppercase tracking-wide px-3 py-2 rounded-full backdrop-blur-sm hover:bg-black/80 transition-colors"
        >
          {subiendo === 'foto_portada' ? <LoaderCircle size={12} className="animate-spin" /> : <Camera size={12} />}
          Portada
        </button>
      </div>

      <div className="relative min-h-16 sm:min-h-[85px]">
        <div className="absolute left-0 top-0 -translate-y-1/3">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white bg-gray-100 shadow-md overflow-hidden">
            {form.logo_url ? (
              <img src={form.logo_url} alt={form.nombre} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl font-black">{form.nombre?.[0]?.toUpperCase() || '?'}</div>
            )}
          </div>
          <button
            type="button"
            onClick={() => elegirFoto('logo_url')}
            aria-label="Subir logo"
            className="absolute bottom-1 right-1 flex items-center justify-center w-8 h-8 rounded-full text-white shadow-md bg-gray-600"
          >
            {subiendo === 'logo_url' ? <LoaderCircle size={13} className="animate-spin" /> : <Camera size={13} />}
          </button>
        </div>

        <div className="pt-2 pl-[108px] sm:pl-[124px] flex items-center justify-between gap-2">
          <div className="min-w-0 flex items-center gap-2">
            {editandoHero ? (
              <input
                value={form.nombre}
                onChange={set('nombre')}
                className="text-base sm:text-xl font-black uppercase leading-tight bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-gray-600 min-w-0 flex-1"
              />
            ) : (
              <h1 className="text-base sm:text-xl font-black uppercase leading-tight truncate">{form.nombre || 'Nombre del estudio'}</h1>
            )}
          </div>
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => setEditandoHero((v) => !v)}
              className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors"
            >
              <Pencil size={10} />
              {editandoHero ? 'Listo' : 'Editar'}
            </button>

            {/* Tooltip de onboarding sobre "Editar" (2026-08-19, corregido
                2026-08-26) — mismo fix que ArtistaEditarPerfilPage.jsx: ancla
                directo al wrapper del botón (no al hero completo), así la
                flecha siempre apunta a "Editar" sin importar el ancho de
                pantalla. */}
            {tooltipEditarVisible && (
              <div className="absolute z-20 top-full right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-gray-900 rounded-xl p-4 shadow-xl text-left">
                <span className="absolute -top-1.5 right-3 w-3 h-3 bg-gray-900 rotate-45" />
                <p className="text-xs leading-relaxed text-gray-200">
                  Toca "Editar" para cambiar el nombre, ubicación y redes de tu estudio — o cualquier foto, para reemplazarla.
                </p>
                <button
                  onClick={cerrarTooltipEditar}
                  className="mt-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:opacity-80 transition-opacity"
                >
                  Entendido
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guía de formato ideal (2026-08-07, Jose: "las fotos tienen mucho
          zoom... esto debería mostrar el formato ideal en el que el
          artista debe cargar la foto") — object-cover recorta agresivo
          cuando la proporción de la foto subida no coincide con la del
          contenedor (portada muy ancha y baja, logo cuadrado). Solo
          visible mientras se edita, para no ensuciar la vista normal. */}
      {editandoHero && (
        <p className="text-gray-400 text-[10px] text-center mt-2 mb-1">
          Portada: horizontal, ideal 1200×400px · Logo: cuadrado, mínimo 400×400px
        </p>
      )}

      <div className="mt-6 space-y-2">
        <div className="max-w-xl">
          <div className="bg-gray-100 border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3.5">
            {editandoHero ? (
              <textarea
                rows={3}
                value={form.bio}
                onChange={set('bio')}
                placeholder="Cuenta algo sobre el estudio..."
                className="w-full bg-transparent text-gray-700 text-sm leading-relaxed focus:outline-none resize-none"
              />
            ) : (
              <p className="text-gray-700 text-sm leading-relaxed">{form.bio || 'Agrega una descripción de tu estudio.'}</p>
            )}
          </div>
        </div>
      </div>

      {editandoHero && (
        <div className="mt-6 space-y-4 max-w-xl">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Departamento *</label>
              <ComboboxBuscable value={form.departamento} onChange={setDepartamento} options={DEPARTAMENTOS} placeholder="Escribe para buscar..." inputClassName={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Municipio *</label>
              <ComboboxBuscable value={form.municipio} onChange={setMunicipio} options={municipiosDisponibles} disabled={!form.departamento} placeholder="Escribe para buscar..." inputClassName={inputClass} />
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={usarMiUbicacion}
              disabled={ubicando}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-60"
              style={form.lat ? { borderColor: '#16a34a', color: '#16a34a' } : { borderColor: '#4B5563', color: '#4B5563' }}
            >
              {ubicando ? <LoaderCircle size={14} className="animate-spin" /> : form.lat ? <Check size={14} /> : <Navigation size={14} />}
              {ubicando ? 'Ubicando...' : form.lat ? 'Ubicación exacta agregada' : 'Agregar ubicación exacta (ayuda a aparecer "cerca de ti")'}
            </button>
            {/* Aclaración (2026-08-07, Jose confundió esto con el link de
                Google Maps, pensando que uno reemplaza al otro) — son
                independientes: esto alimenta el orden por cercanía del
                buscador, el link de Google Maps de abajo NO. */}
            <p className="text-gray-400 text-[10px] mt-1.5 text-center">Actívalo siempre — es lo único que ordena tu perfil por cercanía real en el buscador, tengas o no link de Google Maps.</p>
          </div>
          <div>
            <label className={labelClass}><FaInstagram className="inline -mt-0.5 mr-1" />Instagram</label>
            <input value={form.instagram} onChange={set('instagram')} placeholder="https://instagram.com/..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}><FaFacebook className="inline -mt-0.5 mr-1" />Facebook</label>
            <input value={form.facebook} onChange={set('facebook')} placeholder="https://facebook.com/..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}><FaWhatsapp className="inline -mt-0.5 mr-1" />WhatsApp</label>
            <input value={form.whatsapp} onChange={set('whatsapp')} placeholder="57300..." className={inputClass} />
          </div>
          <div>
            {/* Link de Google Maps (2026-08-07, Jose: "conectar el botón
                de ubicación con el mapa real de ese negocio") — opcional;
                sin esto, el chip de ubicación del perfil público igual
                funciona (cae a la ubicación exacta capturada o a una
                búsqueda por nombre+municipio). Texto de ayuda explícito
                (2026-08-07, Jose confundió esto con la ubicación exacta,
                pensando que había que elegir una de las dos) — deja claro
                que esto es ADEMÁS de la ubicación exacta, no en su lugar,
                y que no afecta el orden del buscador. */}
            <label className={labelClass}><MapPin size={12} className="inline -mt-0.5 mr-1" />Link de Google Maps (opcional)</label>
            <input value={form.google_maps_url} onChange={set('google_maps_url')} placeholder="https://maps.app.goo.gl/..." className={inputClass} />
            <p className="text-gray-400 text-[10px] mt-1">Si ya tienes ficha de tu negocio en Google Maps, pégala acá — el botón de ubicación de tu perfil abrirá esa ficha real en vez de un pin genérico. No reemplaza la ubicación exacta de arriba, es un extra: no afecta el orden del buscador.</p>
          </div>
        </div>
      )}

      {!editandoHero && (
        <p className="text-gray-400 text-[10px] mt-2 flex items-center gap-1"><MapPin size={10} />{form.municipio ? `${form.municipio}${form.departamento ? ', ' + form.departamento : ''}` : 'Sin ubicación'}</p>
      )}

      {/* fase 6.2 (2026-08-07) — link a su propio catálogo (interno o
          externo), solo para marcas/empresas. Reusa el mismo mecanismo
          que ya redirige /supply/estudio/:id cuando este campo está
          seteado (fase 6.1). */}
      {estudio.tipo === 'empresa' && (
        <div className="mt-8">
          <label className={labelClass}>Link de tu catálogo (opcional)</label>
          <input value={form.catalogo_url} onChange={set('catalogo_url')} placeholder="https://tu-sitio.com o /supply/brands/tu-marca" className={inputClass} />
          <p className="text-gray-400 text-[10px] mt-1">Puede ser tu propia web, o si ya tienes una página armada con nosotros, pégala acá. Quien vea tu perfil en el buscador va a llegar directo ahí en vez de a una página genérica.</p>
        </div>
      )}

      {error && <p className="text-red-600 text-sm text-center mt-8">{error}</p>}
      <button
        type="button"
        onClick={guardar}
        disabled={guardando}
        className="w-full mt-4 py-3.5 text-white font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 text-sm"
        style={{ backgroundColor: BTN }}
      >
        {guardando ? 'Guardando...' : guardado ? '✓ Guardado' : 'Guardar cambios'}
      </button>

      </div>
      </div>

      {/* Pestaña "Mi equipo"/"Patrocinados" (2026-08-19) — antes vivía
          pegada debajo del hero; ahora es su propia pestaña, self-
          contained (guarda aparte, no necesita el botón de arriba). */}
      <div className={activeTab === 'equipo' ? 'block' : 'hidden'}>
      <div className="px-4 max-w-3xl mx-auto lg:mx-0">
        <MiEquipoSection token={token} artistas={estudio.artistas} invitacionesIniciales={invitaciones} esEmpresa={estudio.tipo === 'empresa'} />
      </div>
      </div>

      {/* Pestaña "Supply" (2026-08-19) — solo se monta si vende_supply,
          mismo criterio que ya decide si aparece en tabsEstudio. */}
      {estudio.vende_supply && (
      <div className={activeTab === 'supply' ? 'block' : 'hidden'}>
      {/* lg:pt-6 (2026-08-27, Jose: "ese texto está demasiado cerca del
          navbar... solo pasa en PC") — el -mt-4 de EditarPerfilTabs.jsx
          pega la barra de pestañas al navbar a propósito (pedido en esa
          misma sesión), y en móvil el propio botón ☰ actúa de colchón
          visual antes del contenido. En desktop no hay nada intermedio:
          el sidebar de pestañas no ocupa la fila de arriba del contenido,
          así que el primer campo de esta pestaña (sin padding propio, a
          diferencia de "Mi equipo" que ya trae py-5 en su card) quedaba
          pegado directo al navbar. */}
      <div className="px-4 max-w-3xl mx-auto lg:mx-0 lg:pt-6 space-y-4">
          <div>
            <label className={labelClass}>Nombre para mostrar en Supply (opcional)</label>
            <input value={form.nombre_supply} onChange={set('nombre_supply')} placeholder={form.nombre || 'Nombre del estudio'} className={inputClass} />
            <p className="text-gray-400 text-[10px] mt-1">Si vendes insumos además de tatuar, puedes usar un nombre distinto acá (ej. "INKognito Supply") — si lo dejas vacío, se muestra el mismo nombre de tu perfil.</p>
          </div>

          {/* Mercado Pago Split (fase 5, 2026-08-07) — mismo patrón que
              ArtistaEditarPerfilPage.jsx: sin esto conectado, un comprador
              no puede pagarte directo por tus productos de Supply. */}
          <div>
            <label className={labelClass}>Mercado Pago</label>
            {estudio.mp_conectado ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border" style={{ borderColor: MP_BLUE }}>
                <img src={MP_LOGO_URL} alt="Mercado Pago" className="h-4" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: MP_BLUE }}>Conectado</span>
              </span>
            ) : (
              <a
                href={`${PANEL_URL}/api/estudios-mp-conectar?token=${encodeURIComponent(token)}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-[11px] font-black uppercase tracking-widest shadow-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: MP_BLUE }}
              >
                Conecta Mercado Pago <ExternalLink size={12} />
              </a>
            )}
            {!estudio.mp_conectado && (
              <p className="text-gray-400 text-[10px] mt-1.5">Sin esto conectado, nadie puede pagarte por tus productos de Supply — la plata te llega directo a tu cuenta, sin pasar por INKognito.</p>
            )}
            {mp === 'ok' && <p className="text-green-600 text-[11px] font-bold mt-1.5">¡Mercado Pago conectado!</p>}
            {mp === 'error' && <p className="text-red-600 text-[11px] font-bold mt-1.5">No pudimos conectar tu cuenta — intenta de nuevo.</p>}
          </div>

          {/* Cajas surtidas de cartuchos (2026-08-09) — reencuadrado el
              mismo día: en vez de que solo Jose active esto por
              proveedor, cada proveedor lo prende/apaga él mismo acá,
              igual que ya autogestiona su inventario. Solo tiene efecto
              si además hay productos reales en categoría Cartuchos (ver
              EstudioSupplyPage.jsx) — sin eso, no hay de qué armar la
              caja aunque el interruptor esté prendido. */}
          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.vende_cajas_surtidas} onChange={(e) => setForm((f) => ({ ...f, vende_cajas_surtidas: e.target.checked }))} className="w-4 h-4" />
              <span className={labelClass}>Ofrecer cajas surtidas de cartuchos</span>
            </label>
            <p className="text-gray-400 text-[10px] mt-1 mb-3">Le muestra a tus clientes un armador de cajas de 20 cartuchos (calibre y referencia a su gusto) en tu propia tienda de Supply — usa tus productos de Cartuchos ya cargados como referencia de precio, no necesitas subir nada aparte.</p>
            {form.vende_cajas_surtidas && (
              <div>
                <label className={labelClass}>Recargo por armar la caja (%)</label>
                <input type="number" min="0" step="1" value={form.recargo_caja_surtida_pct} onChange={(e) => setForm((f) => ({ ...f, recargo_caja_surtida_pct: Number(e.target.value) || 0 }))} className={inputClass} style={{ maxWidth: '140px' }} />
                <p className="text-gray-400 text-[10px] mt-1">0% = la caja surtida cuesta lo mismo que una caja completa de esa referencia. Súbelo si quieres cobrar de más por armarla a la medida.</p>
              </div>
            )}
          </div>

          <MisVentasSupplySection token={token} />
          <MisProductosSupplySection token={token} cloud_name={cloud_name} upload_preset={upload_preset} />

          {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}
          <button
            type="button"
            onClick={guardar}
            disabled={guardando}
            className="w-full mt-4 py-3.5 text-white font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 text-sm"
            style={{ backgroundColor: BTN }}
          >
            {guardando ? 'Guardando...' : guardado ? '✓ Guardado' : 'Guardar cambios'}
          </button>
      </div>
      </div>
      )}

      </EditarPerfilTabs>
    </div>
  )
}

const SLOTS_ESTUDIO = [
  { key: 'logo_url' },
  { key: 'foto_portada' },
]

export default function EstudioEditarPerfilPage() {
  const { token, estudio, error, cloud_name, upload_preset, invitaciones } = useLoaderData()
  const navigate = useNavigate()

  useEffect(() => {
    if (token && estudio) localStorage.setItem(EDIT_TOKEN_KEY, token)
    else if (token && error) localStorage.removeItem(EDIT_TOKEN_KEY)
  }, [token, estudio, error])

  useEffect(() => {
    if (token) return
    const guardado = localStorage.getItem(EDIT_TOKEN_KEY)
    if (guardado) navigate(`?token=${encodeURIComponent(guardado)}`, { replace: true })
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavbarArtistas titulo="Editar mi estudio" />
      <div className="flex-1 pt-20 md:pt-24 pb-16 w-full">
        {!token || !estudio ? (
          // Mismo bug real que ArtistaEditarPerfilPage.jsx (2026-08-26) —
          // un token guardado vencido dejaba al estudio en una pantalla de
          // error sin ningún formulario para pedir un link nuevo.
          <div className="px-4">
            {error && <p className="text-gray-500 text-sm leading-relaxed text-center max-w-sm mx-auto mb-6">{error}</p>}
            <PedirLinkForm />
          </div>
        ) : (
          <FormularioEdicionEstudio token={token} estudio={estudio} cloud_name={cloud_name} upload_preset={upload_preset} invitaciones={invitaciones} />
        )}
      </div>
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
    </div>
  )
}
