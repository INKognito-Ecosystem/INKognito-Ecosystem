import { useEffect, useRef, useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { Camera, LoaderCircle, Mail, Pencil, MapPin, CheckCircle2, Users, UserPlus, X, Navigation, Check } from 'lucide-react'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import NavbarArtistas from './NavbarArtistas'
import ComboboxBuscable from './ComboboxBuscable'
import { DEPARTAMENTOS, MUNICIPIOS_POR_DEPARTAMENTO } from '../../data/colombiaGeo'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
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
function MiEquipoSection({ token, artistas, invitacionesIniciales }) {
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
      <p className={labelClass}><Users size={12} className="inline -mt-0.5 mr-1" />Mi equipo</p>
      {equipo.length === 0 ? (
        <p className="text-gray-400 text-xs mb-4">Todavía no tienes artistas en tu equipo — invita al primero abajo.</p>
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
                aria-label={`Quitar a ${a.nombre} del estudio`}
                className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className={labelClass}><UserPlus size={12} className="inline -mt-0.5 mr-1" />Invitar artista</p>
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
          {invitando ? '...' : 'Invitar'}
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
  const [form, setForm] = useState({
    nombre: estudio.nombre || '', departamento: estudio.departamento || '', municipio: estudio.municipio || '',
    lat: estudio.lat ?? null, lng: estudio.lng ?? null,
    bio: estudio.bio || '', instagram: estudio.instagram || '', facebook: estudio.facebook || '', whatsapp: estudio.whatsapp || '',
    logo_url: estudio.logo_url || '', foto_portada: estudio.foto_portada || '',
  })
  const [subiendo, setSubiendo] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [error, setError] = useState(null)
  const [editandoHero, setEditandoHero] = useState(false)
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
    } catch {
      setError('No pudimos guardar los cambios — intenta de nuevo en un momento.')
    } finally {
      setGuardando(false)
    }
  }

  if (guardado) {
    return (
      <div className="text-center py-14 px-4 max-w-sm mx-auto">
        <CheckCircle2 size={48} className="mx-auto mb-4 text-green-600" />
        <h2 className="text-lg font-black uppercase mb-2">¡Listo!</h2>
        <p className="text-gray-500 text-sm mb-6">Guardamos los cambios de tu estudio.</p>
        <button
          type="button"
          onClick={() => setGuardado(false)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
          style={{ backgroundColor: BTN }}
        >
          ← Volver a editar
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <p className="text-gray-500 text-sm text-center mb-6 pt-2">Hola {estudio.nombre} — toca "Editar" para cambiar los datos del estudio, o cualquier foto para reemplazarla.</p>

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
          <button
            type="button"
            onClick={() => setEditandoHero((v) => !v)}
            className="flex-shrink-0 flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors"
          >
            <Pencil size={10} />
            {editandoHero ? 'Listo' : 'Editar'}
          </button>
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
        </div>
      )}

      {!editandoHero && (
        <p className="text-gray-400 text-[10px] mt-2 flex items-center gap-1"><MapPin size={10} />{form.municipio ? `${form.municipio}${form.departamento ? ', ' + form.departamento : ''}` : 'Sin ubicación'}</p>
      )}

      <div className="mt-8">
        <MiEquipoSection token={token} artistas={estudio.artistas} invitacionesIniciales={invitaciones} />
      </div>

      {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

      <button
        type="button"
        onClick={guardar}
        disabled={guardando}
        className="w-full py-3.5 text-white font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 text-sm"
        style={{ backgroundColor: BTN }}
      >
        {guardando ? 'Guardando...' : 'Guardar cambios'}
      </button>
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
          error ? (
            <div className="text-center max-w-sm mx-auto px-4">
              <p className="text-gray-500 text-sm leading-relaxed">{error}</p>
            </div>
          ) : (
            <div className="px-4"><PedirLinkForm /></div>
          )
        ) : (
          <FormularioEdicionEstudio token={token} estudio={estudio} cloud_name={cloud_name} upload_preset={upload_preset} invitaciones={invitaciones} />
        )}
      </div>
      <footer className="border-t border-gray-100 py-6 text-center">
        <p className="text-gray-400 text-[11px]">© {new Date().getFullYear()} Tattoo Artist Colombia — Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
