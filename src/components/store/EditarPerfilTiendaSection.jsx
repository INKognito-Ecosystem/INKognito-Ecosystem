import { useRef, useState } from 'react'
import { Camera, LoaderCircle, MapPin, Navigation, Check } from 'lucide-react'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import ComboboxBuscable from '../artistas/ComboboxBuscable'
import { DEPARTAMENTOS_TIENDA, MUNICIPIOS_URABA_TIENDA } from '../../data/colombiaGeo'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const BTN = '#374151'
const inputClass = 'w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors'
const labelClass = 'text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block'

// Formulario de perfil de tienda, autocontenido — portado 2026-08-30 de
// la pestaña "Mi perfil" de EstudioEditarPerfilPage.jsx al fusionar
// perfil+catálogo (una tienda ya no tiene ese dashboard aparte). A
// diferencia del original, acá no hay toggle "editar" — este componente
// solo se monta dentro del panel del dueño (ver EstudioTiendaOwnerPanel.jsx),
// que YA es el contexto de edición, así que los campos van directo. Sin
// `catalogo_url` (confirmado fuera de alcance para tiendas 2026-08-30 —
// quien usa Store es justo porque no tiene página propia). Sin foto de
// portada ni "nombre para mostrar en Store" (quitados 2026-08-30, Jose:
// esos dos son de Supply/estudio de tatuajes — EstudioTiendaPage.jsx
// nunca muestra ninguna portada, solo el logo/perfil, y "nombre para
// mostrar en Store" no tiene sentido cuando el perfil YA ES la tienda).
export default function EditarPerfilTiendaSection({ token, estudio, cloud_name, upload_preset, onSaved }) {
  const [form, setForm] = useState({
    nombre: estudio.nombre || '', departamento: estudio.departamento || '', municipio: estudio.municipio || '',
    lat: estudio.lat ?? null, lng: estudio.lng ?? null,
    bio: estudio.bio || '', instagram: estudio.instagram || '', facebook: estudio.facebook || '', whatsapp: estudio.whatsapp || '',
    logo_url: estudio.logo_url || '',
    google_maps_url: estudio.google_maps_url || '',
  })
  const [subiendo, setSubiendo] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [error, setError] = useState(null)
  const [ubicando, setUbicando] = useState(false)
  const fileInputs = useRef({})

  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))
  const setDepartamento = (nuevo) => setForm((f) => ({ ...f, departamento: nuevo, municipio: '' }))
  const setMunicipio = (nuevo) => setForm((f) => ({ ...f, municipio: nuevo }))
  // Cobertura real de Store es solo Urabá de momento (2026-08-30, Jose)
  // — mismo criterio que EstudioTiendaRegistroPage.jsx.
  const municipiosDisponibles = MUNICIPIOS_URABA_TIENDA

  const usarMiUbicacion = () => {
    if (!navigator.geolocation) return
    setUbicando(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => { setForm((f) => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude })); setUbicando(false) },
      () => setUbicando(false),
      { timeout: 8000 }
    )
  }

  const elegirFoto = () => fileInputs.current.logo_url?.click()
  const subirFoto = async (file) => {
    if (!file || !cloud_name || !upload_preset) return
    setSubiendo(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', upload_preset)
      fd.append('folder', 'inkognito-tienda-estudios')
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) setForm((f) => ({ ...f, logo_url: data.secure_url }))
    } catch {
      setError('No pudimos subir esa foto — intenta de nuevo.')
    } finally {
      setSubiendo(false)
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
      const data = await res.json()
      setGuardado(true)
      setTimeout(() => setGuardado(false), 2500)
      onSaved?.(data)
    } catch {
      setError('No pudimos guardar los cambios — intenta de nuevo en un momento.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        ref={(el) => { fileInputs.current.logo_url = el }}
        style={{ display: 'none' }}
        onChange={(e) => subirFoto(e.target.files?.[0])}
      />

      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20">
          <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-100 shadow-md overflow-hidden">
            {form.logo_url ? (
              <img src={form.logo_url} alt={form.nombre} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl font-black">{form.nombre?.[0]?.toUpperCase() || '?'}</div>
            )}
          </div>
          <button
            type="button"
            onClick={elegirFoto}
            aria-label="Subir logo"
            className="absolute bottom-0 right-0 flex items-center justify-center w-7 h-7 rounded-full text-white shadow-md bg-gray-600"
          >
            {subiendo ? <LoaderCircle size={12} className="animate-spin" /> : <Camera size={12} />}
          </button>
        </div>
        <p className="text-gray-400 text-[10px] mt-2">Cuadrado, mínimo 400×400px</p>
      </div>

      <div>
        <label className={labelClass}>Nombre de la tienda</label>
        <input value={form.nombre} onChange={set('nombre')} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Bio</label>
        <textarea rows={3} value={form.bio} onChange={set('bio')} placeholder="Cuenta algo sobre la tienda..." className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Departamento *</label>
          <ComboboxBuscable value={form.departamento} onChange={setDepartamento} options={DEPARTAMENTOS_TIENDA} placeholder="Escribe para buscar..." inputClassName={inputClass} />
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
      <div>
        <label className={labelClass}><MapPin size={12} className="inline -mt-0.5 mr-1" />Link de Google Maps (opcional)</label>
        <input value={form.google_maps_url} onChange={set('google_maps_url')} placeholder="https://maps.app.goo.gl/..." className={inputClass} />
      </div>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      <button
        type="button"
        onClick={guardar}
        disabled={guardando}
        className="w-full py-3.5 text-white font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 text-sm"
        style={{ backgroundColor: BTN }}
      >
        {guardando ? 'Guardando...' : guardado ? '✓ Guardado' : 'Guardar cambios'}
      </button>
    </div>
  )
}
