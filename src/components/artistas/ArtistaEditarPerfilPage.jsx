import { useEffect, useRef, useState } from 'react'
import { useLoaderData, useSearchParams } from 'react-router-dom'
import { Camera, LoaderCircle, Navigation, Check, Mail, Plus, Trash2, Wallet, ExternalLink } from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'
import ComboboxBuscable from './ComboboxBuscable'
import { DEPARTAMENTOS, MUNICIPIOS_POR_DEPARTAMENTO } from '../../data/colombiaGeo'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#B3202F'

const SLOTS = [
  { key: 'foto_url', label: 'Perfil' },
  { key: 'foto_url_2', label: 'Portada' },
  { key: 'foto_trabajo_1', label: 'Trabajo 1' },
  { key: 'foto_trabajo_2', label: 'Trabajo 2' },
  { key: 'foto_trabajo_3', label: 'Trabajo 3' },
]

// "Mi perfil" (2026-08-05) — sin login/contraseña: el artista pone su
// correo, le llega un link con token por email (mismo mecanismo que la
// confirmación de registro, ver ArtistaVerificarPage.jsx), y ese link es
// lo que autoriza la edición. Sin ?token en la URL se pide el correo;
// con token válido, se precarga el formulario con los datos actuales.
export async function loader({ request }) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token) return { token: null }
  try {
    const [artistaRes, configRes] = await Promise.all([
      fetch(`${PANEL_URL}/api/artistas-por-token?token=${encodeURIComponent(token)}`),
      fetch(`${PANEL_URL}/api/upload-config`),
    ])
    const artista = artistaRes.ok ? await artistaRes.json() : null
    const config = configRes.ok ? await configRes.json() : { cloud_name: null, upload_preset: null }
    if (!artista) return { token, artista: null, error: 'Este link ya no es válido — pídelo de nuevo.' }
    return { token, artista, ...config }
  } catch {
    return { token, artista: null, error: 'No pudimos cargar tu perfil — intenta de nuevo en un momento.' }
  }
}

export function meta() {
  return [{ title: 'Editar mi perfil | Tattoo Artist Colombia' }]
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
      await fetch(`${PANEL_URL}/api/artistas-solicitar-edicion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {
      // Se muestra el mismo mensaje de éxito aunque falle la red — no
      // conviene revelar si un correo existe o no en la base.
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
          Si <strong>{email}</strong> tiene un perfil activo, te mandamos un link para editarlo.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-xl font-black uppercase mb-2 text-center">Editar mi perfil</h1>
      <p className="text-gray-500 text-sm text-center mb-6">
        Escribe el correo con el que te registraste — te mandamos un link para editar tu perfil, sin contraseña.
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
          style={{ backgroundColor: ACCENT }}
        >
          {enviando ? 'Enviando...' : 'Mandarme el link'}
        </button>
      </form>
    </div>
  )
}

const TIPOS_DISENO = [
  { value: 'tatuaje', label: 'Diseño de tatuaje', hint: 'Se tatúa en una sola persona — desaparece de la venta al venderse' },
  { value: 'lamina', label: 'Lámina / print', hint: 'Para enmarcar — se puede vender a varios clientes' },
]

// "Mis diseños en venta" (2026-08-05) — primer paso de monetización del
// directorio: el artista sube diseños con precio, un comprador los paga
// por Mercado Pago y el reparto (comisión INKognito + resto al artista)
// es instantáneo. Autocontenido a propósito — cada diseño tiene su propio
// ciclo de vida (subir/editar/borrar) que no encaja en el <form> plano de
// "Guardar cambios" de arriba, así que vive FUERA de ese form con sus
// propios endpoints.
const NUEVO_VACIO = { tipo: 'tatuaje', titulo: '', descripcion: '', precio: '', imagen_url: '', imagen_url_2: '', imagen_url_3: '' }
const SLOTS_DISENO = [
  { key: 'imagen_url', label: 'Foto 1' },
  { key: 'imagen_url_2', label: 'Foto 2' },
  { key: 'imagen_url_3', label: 'Foto 3' },
]

function MisDisenosSection({ token, cloud_name, upload_preset, mpConectado }) {
  const [disenos, setDisenos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [subiendo, setSubiendo] = useState(null)
  const [nuevo, setNuevo] = useState(NUEVO_VACIO)
  const [error, setError] = useState(null)
  const fileInputs = useRef({})

  useEffect(() => {
    fetch(`${PANEL_URL}/api/artistas-disenos-por-token?token=${encodeURIComponent(token)}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setDisenos)
      .catch(() => setDisenos([]))
      .finally(() => setCargando(false))
  }, [token])

  const elegirFoto = (slot) => fileInputs.current[slot]?.click()

  const subirImagen = async (slot, file) => {
    if (!file || !cloud_name || !upload_preset) return
    setSubiendo(slot)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', upload_preset)
      fd.append('folder', 'inkognito-disenos')
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) setNuevo((n) => ({ ...n, [slot]: data.secure_url }))
    } catch {
      setError('No pudimos subir esa imagen — intenta de nuevo.')
    } finally {
      setSubiendo(null)
    }
  }

  const agregarDiseno = async () => {
    if (!nuevo.imagen_url || !nuevo.precio) {
      setError('Sube al menos la primera foto y ponle un precio antes de agregarlo.')
      return
    }
    setError(null)
    try {
      const res = await fetch(`${PANEL_URL}/api/artistas-disenos-por-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...nuevo }),
      })
      if (!res.ok) throw new Error()
      const creado = await res.json()
      setDisenos((d) => [...(d || []), creado])
      setNuevo(NUEVO_VACIO)
    } catch {
      setError('No pudimos agregar el diseño — intenta de nuevo.')
    }
  }

  const toggleActivo = async (d) => {
    const res = await fetch(`${PANEL_URL}/api/artistas-disenos-por-token/${d.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, activo: !d.activo }),
    })
    if (res.ok) setDisenos((ds) => ds.map((x) => x.id === d.id ? { ...x, activo: !x.activo } : x))
  }

  const borrarDiseno = async (d) => {
    const res = await fetch(`${PANEL_URL}/api/artistas-disenos-por-token/${d.id}?token=${encodeURIComponent(token)}`, { method: 'DELETE' })
    if (res.ok) {
      setDisenos((ds) => ds.filter((x) => x.id !== d.id))
    } else if (res.status === 409) {
      setError('Este diseño ya tiene ventas — desactívalo con el switch en vez de borrarlo.')
    }
  }

  return (
    <div className="mb-6 border border-gray-200 rounded-2xl p-4">
      <p className={labelClass}>Mis diseños en venta</p>

      {/* Estado de Mercado Pago — sin esto conectado no se puede cobrar */}
      <div className="flex items-center justify-between gap-3 mb-4 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200">
        <div className="flex items-center gap-2">
          <Wallet size={16} className={mpConectado ? 'text-green-600' : 'text-gray-400'} />
          <span className="text-xs font-bold">
            {mpConectado ? 'Mercado Pago conectado' : 'Sin Mercado Pago conectado'}
          </span>
        </div>
        {!mpConectado && (
          <a
            href={`${PANEL_URL}/api/artistas-mp-conectar?token=${encodeURIComponent(token)}`}
            className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: ACCENT }}
          >
            Conectar <ExternalLink size={11} />
          </a>
        )}
      </div>
      {!mpConectado && (
        <p className="text-gray-400 text-[10px] mb-4 -mt-2">Necesitas conectar tu cuenta de Mercado Pago para poder vender diseños — el pago te llega directo a ti.</p>
      )}

      {cargando ? (
        <p className="text-gray-400 text-xs text-center py-4">Cargando...</p>
      ) : (
        <>
          {disenos && disenos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {disenos.map((d) => (
                <div key={d.id} className={`relative aspect-square rounded-lg overflow-hidden border ${d.activo ? 'border-gray-200' : 'border-gray-200 opacity-50'}`}>
                  <img src={d.imagen_url} alt={d.titulo || 'Diseño'} className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 bg-black/60 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full">
                    {d.tipo === 'lamina' ? 'Lámina' : 'Tatuaje'}
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[10px] px-1.5 py-1 flex items-center justify-between">
                    <span className="font-bold">${Number(d.precio).toLocaleString('es-CO')}</span>
                    <div className="flex items-center gap-1.5">
                      <button type="button" onClick={() => toggleActivo(d)} className="underline">
                        {d.activo ? 'Ocultar' : 'Mostrar'}
                      </button>
                      <button type="button" onClick={() => borrarDiseno(d)} aria-label="Borrar diseño">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Formulario para agregar uno nuevo */}
          <div className="border border-dashed border-gray-300 rounded-lg p-3 space-y-2.5">
            {SLOTS_DISENO.map(({ key }) => (
              <input
                key={key}
                type="file"
                accept="image/*"
                ref={(el) => { fileInputs.current[key] = el }}
                style={{ display: 'none' }}
                onChange={(e) => subirImagen(key, e.target.files?.[0])}
              />
            ))}
            <p className="text-gray-400 text-[10px]">Hasta 3 fotos — la primera es obligatoria (ej: el diseño solo), las otras 2 son opcionales (ej: sobre piel, otro ángulo).</p>
            <div className="grid grid-cols-3 gap-2">
              {SLOTS_DISENO.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => elegirFoto(key)}
                  className="relative aspect-square rounded-lg bg-gray-50 border border-gray-200 text-gray-400 overflow-hidden"
                >
                  {nuevo[key] ? (
                    <img src={nuevo[key]} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  ) : subiendo === key ? (
                    <div className="w-full h-full flex items-center justify-center"><LoaderCircle size={14} className="animate-spin" /></div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                      <Camera size={13} />
                      <span className="text-[8px] font-bold uppercase">{label}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {TIPOS_DISENO.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setNuevo((n) => ({ ...n, tipo: t.value }))}
                  className={`px-2 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-wide transition-colors ${nuevo.tipo === t.value ? 'text-white' : 'text-gray-500 border-gray-300'}`}
                  style={nuevo.tipo === t.value ? { backgroundColor: ACCENT, borderColor: ACCENT } : {}}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-[10px] -mt-1">{TIPOS_DISENO.find((t) => t.value === nuevo.tipo)?.hint}</p>

            <input className={inputClass} placeholder="Título (opcional)" value={nuevo.titulo} onChange={(e) => setNuevo((n) => ({ ...n, titulo: e.target.value }))} />
            <div>
              <textarea
                rows={4}
                className={inputClass}
                placeholder="Cuéntale a quien lo vea por qué vale la pena — qué representa este diseño, qué se siente tatuárselo, para quién es. Esto es lo que van a leer antes de comprar."
                value={nuevo.descripcion}
                onChange={(e) => setNuevo((n) => ({ ...n, descripcion: e.target.value }))}
              />
              <p className="text-gray-400 text-[10px] mt-1">Esta descripción es lo más importante para que la persona decida comprar — sé específico, no genérico.</p>
            </div>
            <input className={inputClass} type="number" min="1" placeholder="Precio en COP" value={nuevo.precio} onChange={(e) => setNuevo((n) => ({ ...n, precio: e.target.value }))} />

            <button
              type="button"
              onClick={agregarDiseno}
              disabled={subiendo}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg border-2 text-xs font-black uppercase tracking-widest disabled:opacity-60"
              style={{ borderColor: ACCENT, color: ACCENT }}
            >
              <Plus size={14} /> Agregar diseño
            </button>
          </div>
        </>
      )}

      {error && <p className="text-sm mt-3" style={{ color: ACCENT }}>{error}</p>}
    </div>
  )
}

// Pantalla 2 — con token válido: formulario precargado. Deliberadamente
// más simple que el de registro (ArtistaRegistroPage.jsx) — sin el panel
// de vista previa en vivo, para no duplicar toda esa complejidad en una
// pantalla de edición puntual.
function FormularioEdicion({ token, artista, cloud_name, upload_preset }) {
  const [searchParams] = useSearchParams()
  const mp = searchParams.get('mp')
  const [form, setForm] = useState({
    nombre: artista.nombre || '', departamento: artista.departamento || '', municipio: artista.municipio || '',
    lat: artista.lat ?? null, lng: artista.lng ?? null, estilo: artista.estilo || '', bio: artista.bio || '',
    instagram: artista.instagram || '', facebook: artista.facebook || '', whatsapp: artista.whatsapp || '',
    no_tatua: artista.no_tatua || '',
    foto_url: artista.foto_url || '', foto_url_2: artista.foto_url_2 || '',
    foto_trabajo_1: artista.foto_trabajo_1 || '', foto_trabajo_2: artista.foto_trabajo_2 || '', foto_trabajo_3: artista.foto_trabajo_3 || '',
  })
  const [subiendo, setSubiendo] = useState(null)
  const [ubicando, setUbicando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [error, setError] = useState(null)
  const fileInputs = useRef({})

  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))
  const setDepartamento = (nuevo) => setForm((f) => ({ ...f, departamento: nuevo, municipio: '' }))
  const setMunicipio = (nuevo) => setForm((f) => ({ ...f, municipio: nuevo }))
  const municipiosDisponibles = MUNICIPIOS_POR_DEPARTAMENTO[form.departamento] || []

  const elegirFoto = (slot) => fileInputs.current[slot]?.click()
  const subirFoto = async (slot, file) => {
    if (!file || !cloud_name || !upload_preset) return
    setSubiendo(slot)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', upload_preset)
      fd.append('folder', 'inkognito-artistas')
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) setForm((f) => ({ ...f, [slot]: data.secure_url }))
    } catch {
      setError('No pudimos subir esa foto — intenta de nuevo.')
    } finally {
      setSubiendo(null)
    }
  }

  const usarMiUbicacion = () => {
    if (!navigator.geolocation) return
    setUbicando(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => { setForm((f) => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude })); setUbicando(false) },
      () => setUbicando(false),
      { timeout: 8000 }
    )
  }

  const guardar = async (e) => {
    e.preventDefault()
    setError(null)
    setGuardando(true)
    try {
      const res = await fetch(`${PANEL_URL}/api/artistas-editar-por-token`, {
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

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-xl font-black uppercase mb-1 text-center">Editar mi perfil</h1>
      <p className="text-gray-500 text-sm text-center mb-6">Hola {artista.nombre} — actualiza lo que necesites.</p>

      {guardado && (
        <p className="text-sm text-center mb-4 py-2 rounded-lg bg-green-50 text-green-700 font-bold">✓ Cambios guardados</p>
      )}
      {mp === 'ok' && (
        <p className="text-sm text-center mb-4 py-2 rounded-lg bg-green-50 text-green-700 font-bold">✓ Mercado Pago conectado</p>
      )}
      {mp === 'error' && (
        <p className="text-sm text-center mb-4 py-2 rounded-lg bg-gray-50 text-gray-600 font-bold">No pudimos conectar Mercado Pago — intenta de nuevo.</p>
      )}

      {SLOTS.map(({ key }) => (
        <input
          key={key}
          type="file"
          accept="image/*"
          ref={(el) => { fileInputs.current[key] = el }}
          style={{ display: 'none' }}
          onChange={(e) => subirFoto(key, e.target.files?.[0])}
        />
      ))}

      <div className="grid grid-cols-3 gap-2 mb-6">
        {SLOTS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => elegirFoto(key)}
            className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
          >
            {form[key] ? (
              <img src={form[key]} alt={label} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-400">
                {subiendo === key ? <LoaderCircle size={16} className="animate-spin" /> : <Camera size={16} />}
              </div>
            )}
            <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-bold uppercase text-center py-0.5">{label}</span>
          </button>
        ))}
      </div>

      <MisDisenosSection token={token} cloud_name={cloud_name} upload_preset={upload_preset} mpConectado={artista.mp_conectado} />

      <form onSubmit={guardar} className="space-y-4">
        <div>
          <label className={labelClass}>Nombre *</label>
          <input required className={inputClass} value={form.nombre} onChange={set('nombre')} />
        </div>

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
            {ubicando ? 'Ubicando...' : form.lat ? 'Ubicación exacta guardada' : 'Actualizar mi ubicación exacta'}
          </button>
        </div>

        <div>
          <label className={labelClass}>Estilo</label>
          <input className={inputClass} value={form.estilo} onChange={set('estilo')} placeholder="Ej: Realismo, Blackwork, Fine line" />
        </div>

        <div>
          <label className={labelClass}>Bio</label>
          <textarea rows={3} className={inputClass} value={form.bio} onChange={set('bio')} placeholder="Técnicas, estilos y materiales — esto ayuda en la búsqueda" />
        </div>

        <div>
          <label className={labelClass}>WhatsApp *</label>
          <input required className={inputClass} value={form.whatsapp} onChange={set('whatsapp')} />
        </div>

        <div>
          <label className={labelClass}>Instagram</label>
          <input className={inputClass} value={form.instagram} onChange={set('instagram')} placeholder="https://instagram.com/..." />
        </div>

        <div>
          <label className={labelClass}>Facebook</label>
          <input className={inputClass} value={form.facebook} onChange={set('facebook')} placeholder="https://facebook.com/..." />
        </div>

        <div>
          <label className={labelClass}>No tatúas (opcional)</label>
          <input className={inputClass} value={form.no_tatua} onChange={set('no_tatua')} placeholder="Ej: rostro, manos, zonas genitales" />
        </div>

        {error && <p className="text-sm" style={{ color: ACCENT }}>{error}</p>}

        <button
          type="submit"
          disabled={guardando}
          className="w-full py-3.5 text-white font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 text-sm"
          style={{ backgroundColor: ACCENT }}
        >
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}

export default function ArtistaEditarPerfilPage() {
  const { token, artista, error, cloud_name, upload_preset } = useLoaderData()

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavbarArtistas />
      <div className="flex-1 pt-20 md:pt-24 px-4 pb-16 w-full">
        {!token || !artista ? (
          error ? (
            <div className="text-center max-w-sm mx-auto">
              <p className="text-gray-500 text-sm leading-relaxed">{error}</p>
            </div>
          ) : (
            <PedirLinkForm />
          )
        ) : (
          <FormularioEdicion token={token} artista={artista} cloud_name={cloud_name} upload_preset={upload_preset} />
        )}
      </div>
      <footer className="border-t border-gray-200 py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-400 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} Tattoo Artist Colombia — INKognito. Todos los derechos reservados.</p>
          <span className="text-gray-300">Desarrollado por INKognito</span>
        </div>
      </footer>
    </div>
  )
}
