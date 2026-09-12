import { useEffect, useRef, useState } from 'react'
import { Link, redirect, useLoaderData, useNavigate, useSearchParams } from 'react-router-dom'
import { Camera, LoaderCircle, Mail, Pencil, MapPin, Users, UserPlus, X, Navigation, Check, ShoppingBag, ExternalLink, ChevronLeft, ChevronRight, Copy } from 'lucide-react'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import NavbarArtistas from './NavbarArtistas'
import ComboboxBuscable from './ComboboxBuscable'
import { DEPARTAMENTOS, MUNICIPIOS_POR_DEPARTAMENTO } from '../../data/colombiaGeo'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const SITE_URL = import.meta.env.VITE_SITE_URL
// Mismo mecanismo de sesión persistida que ArtistaEditarPerfilPage.jsx
// (2026-08-06) — key propia para no chocar con el token del artista.
const EDIT_TOKEN_KEY = 'estudio_edit_token'
const BTN = '#374151'

// Dashboard de estudio (fase 3 del directorio, 2026-08-06) — mellizo
// simplificado de ArtistaEditarPerfilPage.jsx: mismo mecanismo de sesión
// sin contraseña por token, misma edición in-situ del hero. Un estudio
// tiene muchos menos campos que un artista (sin estilo/precio/agenda), así
// que todo cabe en un solo bloque editable, sin la separación en
// "hero editable + formulario largo debajo" que sí necesita el artista.
export async function loader({ request }) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token) return { token: null }
  let estudio = null, invitaciones = [], config = { cloud_name: null, upload_preset: null }
  try {
    const [estudioRes, configRes, invitacionesRes] = await Promise.all([
      fetch(`${PANEL_URL}/api/estudios-por-token?token=${encodeURIComponent(token)}`),
      fetch(`${PANEL_URL}/api/upload-config`),
      fetch(`${PANEL_URL}/api/estudios-invitaciones-por-token?token=${encodeURIComponent(token)}`),
    ])
    estudio = estudioRes.ok ? await estudioRes.json() : null
    config = configRes.ok ? await configRes.json() : config
    invitaciones = invitacionesRes.ok ? await invitacionesRes.json() : []
  } catch {
    return { token, estudio: null, error: 'No pudimos cargar tu estudio — intenta de nuevo en un momento.' }
  }
  if (!estudio) return { token, estudio: null, error: 'Este link ya no es válido — pídelo de nuevo.' }
  // Store multitenant (2026-08-30) — una tienda ya no tiene dashboard
  // aparte: su perfil y su catálogo son la misma página. Fuera de
  // cualquier try/catch a propósito — throw redirect() es un Response,
  // no un error, un catch genérico lo tragaría (mismo criterio que
  // EstudioSupplyPage.jsx/EstudioLandingPage.jsx). Cubre de una sola vez
  // todas las puertas de entrada a este dashboard para una tienda:
  // verificación, reenvío de link, bookmarks viejos, y el propio
  // localStorage de este componente (más abajo).
  if (estudio.tipo === 'tienda') throw redirect(`/store/estudio/${estudio.id}?token=${token}`)
  return { token, estudio, invitaciones, ...config }
}

export function meta() {
  return [{ title: 'Editar mi estudio | Tattoo Artist Colombia' }]
}

const inputClass = 'w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors'
const labelClass = 'text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block'
const VISTA_TITULOS = { perfil: 'Editar mi perfil', supply: 'Tienda en Supply' }

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

function FormularioEdicionEstudio({ token, estudio, cloud_name, upload_preset, invitaciones }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Panel unificado (2026-09-13, Jose: "el formato de editar mi estudio es
  // confuso... debería haber un mismo panel, sumamente completo... el
  // patrón que ya trae el panel me gusta") — mismo espíritu de menú +
  // vista con flecha de regreso que EstudioSupplyOwnerPanel.jsx/
  // EstudioTiendaOwnerPanel.jsx, reemplaza el sidebar/hamburguesa de
  // EditarPerfilTabs.jsx (que Jose sentía confuso, y donde meter encima
  // todo el panel de gestión de Supply hubiera sido "mucha carga"). Este
  // dashboard ya solo atiende estudio/empresa/proveedor — una tienda
  // (tipo='tienda') nunca llega acá, el loader la redirige a su propia
  // página (ver EstudioTiendaPage.jsx) antes de renderizar nada.
  const esProveedor = estudio.tipo === 'proveedor'
  const esEmpresa = estudio.tipo === 'empresa'
  // Autogestionable SOLO para estudio (Jose, 2026-09-13: "solo es para
  // estudios, para marcas aún no") — una marca sigue viendo esta sección
  // nada más si Jose YA le activó vende_supply a mano; un estudio la ve
  // SIEMPRE (activa o no) para poder prender su propia tienda él mismo. Un
  // proveedor nativo ya nace con esto activo (ver server.js).
  const puedeAutoactivarSupply = estudio.tipo === 'estudio'
  const muestraSupply = estudio.vende_supply || puedeAutoactivarSupply

  const [vista, setVista] = useState('menu')

  const linkPerfil = `${SITE_URL}/tattoo-artist-colombia/estudio/${estudio.id}`
  const linkSupply = `${SITE_URL}/supply/${estudio.slug || `estudio/${estudio.id}`}`
  // Ruta relativa + token (2026-09-13) — a diferencia de linkSupply de
  // arriba (absoluto, para copiar y compartir con clientes), esto es
  // para el propio Link de react-router de "Tienda en Supply": navega
  // con SU token puesto, para que EstudioSupplyPage.jsx lo reconozca
  // como dueño y muestre el botón hamburguesa de gestión.
  const rutaSupplyPropia = `/supply/${estudio.slug || `estudio/${estudio.id}`}?token=${encodeURIComponent(token)}`
  const [copiadoPerfil, setCopiadoPerfil] = useState(false)
  const [copiadoSupply, setCopiadoSupply] = useState(false)
  const copiarLinkPerfil = () => {
    navigator.clipboard.writeText(linkPerfil).then(() => {
      setCopiadoPerfil(true)
      setTimeout(() => setCopiadoPerfil(false), 1500)
    }).catch(() => {})
  }
  const copiarLinkSupply = () => {
    navigator.clipboard.writeText(linkSupply).then(() => {
      setCopiadoSupply(true)
      setTimeout(() => setCopiadoSupply(false), 1500)
    }).catch(() => {})
  }

  const [activandoSupply, setActivandoSupply] = useState(false)
  const [errorActivarSupply, setErrorActivarSupply] = useState(null)
  const activarSupply = async () => {
    setErrorActivarSupply(null)
    setActivandoSupply(true)
    try {
      const res = await fetch(`${PANEL_URL}/api/estudios-activar-supply-por-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      // Directo al catálogo real recién activado (2026-09-13, Jose: "este
      // botón abre la tienda de la misma forma que se le muestra a un
      // proveedor nativo") — no hace falta quedarse en esta pantalla ni
      // actualizar estado local, ya no hay nada más que mostrar acá.
      navigate(`/supply/${data.slug || `estudio/${data.id}`}?token=${encodeURIComponent(token)}&bienvenida=1`)
    } catch {
      setErrorActivarSupply('No pudimos activarla — intenta de nuevo en un momento.')
      setActivandoSupply(false)
    }
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

      <div className="px-4 max-w-md mx-auto lg:max-w-3xl">
        <div className="flex items-center gap-2 mb-5 sticky top-16 md:top-20 bg-white pt-3 pb-2 -mx-4 px-4 z-10 border-b border-gray-100">
          {vista !== 'menu' ? (
            <button type="button" onClick={() => setVista('menu')} aria-label="Volver" className="text-gray-400 hover:text-gray-700 flex-shrink-0">
              <ChevronLeft size={20} />
            </button>
          ) : (
            <span className="w-5 flex-shrink-0" />
          )}
          <p className="flex-1 text-sm font-black uppercase tracking-widest text-gray-900">
            {vista === 'menu' ? 'Panel de tu estudio' : vista === 'equipo' ? (esEmpresa ? 'Patrocinados' : 'Mis artistas') : VISTA_TITULOS[vista]}
          </p>
        </div>
      </div>

      {vista === 'menu' && (
        <div className="px-4 max-w-md mx-auto space-y-4">
          <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            <button type="button" onClick={() => setVista('perfil')} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors">
              <Pencil size={16} className="text-gray-400 flex-shrink-0" />
              <span className="flex-1 text-sm font-bold text-gray-900">Editar mi perfil</span>
              <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
            </button>
            {!esProveedor && (
              <button type="button" onClick={() => setVista('equipo')} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors">
                <Users size={16} className="text-gray-400 flex-shrink-0" />
                <span className="flex-1 text-sm font-bold text-gray-900">{esEmpresa ? 'Patrocinados' : 'Mis artistas'}</span>
                <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
              </button>
            )}
            {/* "Tienda en Supply" (2026-09-13, Jose: "debería abrir
                primeramente el como se ve el perfil en realidad, y con su
                botón hamburguesa para los cambios... literalmente este
                botón abre la tienda de la misma forma que se le muestra a
                un proveedor nativo") — si ya está activa, esto NO abre una
                vista propia acá: navega derecho al catálogo real
                (EstudioSupplyPage.jsx), con su token puesto, donde ya
                existe el mismo panel de gestión (hamburguesa → editar
                perfil/productos/ventas/Mercado Pago) que ya construimos
                para proveedores nativos — un solo lugar, no dos paneles
                de Supply distintos. Si aún no está activa, sí abre una
                vista acá mismo con el botón de autoactivar (no hay
                catálogo real todavía al que navegar). */}
            {muestraSupply && (
              estudio.vende_supply ? (
                <Link to={rutaSupplyPropia} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors">
                  <ShoppingBag size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="flex-1 text-sm font-bold text-gray-900">Tienda en Supply</span>
                  <ExternalLink size={14} className="text-gray-300 flex-shrink-0" />
                </Link>
              ) : (
                <button type="button" onClick={() => setVista('supply')} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors">
                  <ShoppingBag size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="flex-1 text-sm font-bold text-gray-900">Tienda en Supply</span>
                  <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                </button>
              )
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <label className={labelClass}>Link de tu perfil en el buscador</label>
            <p className="text-gray-500 text-[11px] mb-2.5">Compártelo con quien quiera ver tu estudio en Tattoo Artist Colombia.</p>
            <button type="button" onClick={copiarLinkPerfil} className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-white border border-gray-300 text-left hover:border-gray-400 transition-colors">
              <span className="text-xs font-mono text-gray-700 truncate">{linkPerfil}</span>
              {copiadoPerfil ? <Check size={16} className="text-green-600 flex-shrink-0" /> : <Copy size={16} className="text-gray-400 flex-shrink-0" />}
            </button>
          </div>

          {estudio.vende_supply && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <label className={labelClass}>Link de tu tienda en Supply</label>
              <p className="text-gray-500 text-[11px] mb-2.5">Comparte este con tus clientes para que compren directo.</p>
              <button type="button" onClick={copiarLinkSupply} className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-white border border-amber-300 text-left hover:border-amber-400 transition-colors">
                <span className="text-xs font-mono text-gray-700 truncate">{linkSupply}</span>
                {copiadoSupply ? <Check size={16} className="text-green-600 flex-shrink-0" /> : <Copy size={16} className="text-amber-600 flex-shrink-0" />}
              </button>
            </div>
          )}
        </div>
      )}

      <div className={vista === 'perfil' ? 'block' : 'hidden'}>
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
                  Toca "Editar" para cambiar el nombre o la descripción — la ubicación, redes y fotos ya están siempre listas para editar más abajo.
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

      {/* Ubicación/redes SIEMPRE visibles (2026-09-13, Jose: "creo que
          deberia mostrarce siempre y no esperar a dar editar") — "Editar"
          ahora solo controla nombre+bio (los dos campos de arriba que
          alternan entre texto plano e input/textarea); estos campos son
          inputs de toda la vida, no tiene sentido esconderlos detrás de
          ese mismo botón. */}
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

      {/* "Mis artistas"/"Patrocinados" (2026-08-19) — self-contained (guarda
          aparte, no necesita el botón de arriba). */}
      {!esProveedor && (
      <div className={vista === 'equipo' ? 'block' : 'hidden'}>
      <div className="px-4 max-w-3xl mx-auto lg:mx-0">
        <MiEquipoSection token={token} artistas={estudio.artistas} invitacionesIniciales={invitaciones} esEmpresa={esEmpresa} />
      </div>
      </div>
      )}

      {/* "Tienda en Supply" — esta vista SOLO existe para el caso "aún no
          activa" (ver el Link vs. botón en el menú, arriba): en cuanto
          vende_supply es true, el ítem del menú ya no entra acá, navega
          derecho al catálogo real. El panel de gestión completo
          (nombre para Supply, Mercado Pago, cajas surtidas, productos,
          ventas) ya NO se duplica en este archivo — vive un solo lugar,
          EstudioSupplyOwnerPanel.jsx, igual para estudio/empresa/
          proveedor. */}
      {puedeAutoactivarSupply && !estudio.vende_supply && (
      <div className={vista === 'supply' ? 'block' : 'hidden'}>
      <div className="px-4 max-w-3xl mx-auto lg:mx-0">
        <div className="text-center py-10 max-w-sm mx-auto">
          <ShoppingBag size={40} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-lg font-black uppercase mb-2">Activa tu tienda en Supply</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Vende insumos de tatuaje directo a otros tatuadores, con tu propio catálogo dentro de INKognito Supply — sin pasar por nadie.
          </p>
          {errorActivarSupply && <p className="text-red-600 text-xs mb-3">{errorActivarSupply}</p>}
          <button
            type="button"
            onClick={activarSupply}
            disabled={activandoSupply}
            className="w-full py-3.5 text-white font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 text-sm"
            style={{ backgroundColor: BTN }}
          >
            {activandoSupply ? 'Activando...' : 'Activar mi tienda en Supply'}
          </button>
        </div>
      </div>
      </div>
      )}
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
