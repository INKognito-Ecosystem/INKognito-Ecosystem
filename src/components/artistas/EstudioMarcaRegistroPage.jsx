import { useRef, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { CheckCircle2, Camera, LoaderCircle, Navigation, Check } from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'
import ComboboxBuscable from './ComboboxBuscable'
import { DEPARTAMENTOS, MUNICIPIOS_POR_DEPARTAMENTO, municipioDesdeNombreIP } from '../../data/colombiaGeo'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#B3202F'

// Registro de marca — fase 6.5 (2026-08-07). Calcado de EstudioRegistroPage.jsx
// (mismo loader/honeypot/captcha/submit a POST /api/estudios-solicitud, que
// ya acepta `tipo` desde fase 6.2), pero con `tipo: 'empresa'` fijo y copy
// propio — sin selector, esta página YA ES la de marca. A propósito NO tiene
// ningún link público hacia ella (ni en NavbarArtistas.jsx ni en ningún otro
// lugar del sitio) — Jose (2026-08-07): "las marcas las sigo creando yo
// [curándolas]... este [formulario] no debe ser público", la comparte a mano
// con quien quiera invitar. Mismo patrón "desplegado sin exponer" que ya se
// usó para el directorio completo al principio de este módulo.
export async function loader({ request }) {
  let ciudadDetectada = null
  try {
    const ipCity = request.headers.get('x-vercel-ip-city')
    if (ipCity) ciudadDetectada = municipioDesdeNombreIP(decodeURIComponent(ipCity))
  } catch {
    ciudadDetectada = null
  }
  const captchaA = Math.floor(Math.random() * 8) + 1
  const captchaB = Math.floor(Math.random() * 8) + 1
  try {
    const res = await fetch(`${PANEL_URL}/api/upload-config`)
    if (res.ok) return { ...(await res.json()), ciudadDetectada, captchaA, captchaB }
  } catch {
    // sigue abajo con el fallback
  }
  return { cloud_name: null, upload_preset: null, ciudadDetectada, captchaA, captchaB }
}

export function meta() {
  const title = 'Registra tu marca | Tattoo Artist Colombia'
  const description = 'Registra tu marca proveedora y patrocina a los artistas del directorio de tatuadores de Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/tattoo-artist-colombia/marca/unete` },
  ]
}

const inputClass = 'w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors'
const labelClass = 'text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block'

export default function EstudioMarcaRegistroPage() {
  const { cloud_name, upload_preset, captchaA, captchaB } = useLoaderData()
  const [form, setForm] = useState({
    nombre: '', departamento: '', municipio: '', lat: null, lng: null, bio: '', instagram: '', facebook: '', whatsapp: '', email: '',
    logo_url: '', foto_portada: '',
    sitio_web: '', // honeypot
  })
  const [subiendo, setSubiendo] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState(null)
  const [captchaRespuesta, setCaptchaRespuesta] = useState('')
  const [ubicando, setUbicando] = useState(false)
  const [ubicacionError, setUbicacionError] = useState(null)
  const fileInputs = useRef({})

  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))
  const setDepartamento = (nuevo) => setForm((f) => ({ ...f, departamento: nuevo, municipio: '' }))
  const setMunicipio = (nuevo) => setForm((f) => ({ ...f, municipio: nuevo }))
  const municipiosDisponibles = MUNICIPIOS_POR_DEPARTAMENTO[form.departamento] || []

  const usarMiUbicacion = () => {
    setUbicacionError(null)
    if (!navigator.geolocation) {
      setUbicacionError('Tu navegador no soporta geolocalización — no pasa nada, el perfil funciona igual.')
      return
    }
    setUbicando(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude }))
        setUbicando(false)
      },
      () => {
        setUbicacionError('No pudimos acceder a tu ubicación — actívala en el navegador, o simplemente sigue sin ella.')
        setUbicando(false)
      },
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

  const enviar = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.departamento || !form.municipio || !form.whatsapp.trim() || !form.email.trim()) {
      setError('Nombre, departamento, municipio, WhatsApp y correo son obligatorios.')
      return
    }
    if (!form.facebook.trim() && !form.instagram.trim()) {
      setError('Agrega al menos una red social — Instagram o Facebook.')
      return
    }
    if (Number(captchaRespuesta) !== captchaA + captchaB) {
      setError('La respuesta de la verificación no es correcta.')
      return
    }
    setError(null)
    setEnviando(true)
    try {
      const res = await fetch(`${PANEL_URL}/api/estudios-solicitud`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tipo: 'empresa', captcha_a: captchaA, captcha_b: captchaB, captcha_respuesta: captchaRespuesta }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '')
      setEnviado(true)
    } catch (err) {
      setError(err.message || 'No pudimos enviar el registro — intenta de nuevo en un momento.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavbarArtistas titulo="Registrar marca" />

      {enviado ? (
        <div className="flex-1 pt-20 md:pt-24 max-w-md mx-auto px-4 pb-16 w-full">
          <div className="text-center py-16">
            <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: ACCENT }} />
            <h1 className="text-2xl font-black uppercase mb-3">¡Ya casi!</h1>
            <p className="text-gray-500 text-sm leading-relaxed">Falta un paso para que el perfil de tu marca quede activo.</p>
            <ol className="text-left text-gray-600 text-sm leading-relaxed mt-5 space-y-2.5 list-decimal list-inside">
              <li>Revisa la bandeja de <strong>{form.email}</strong> (y la de spam/promociones, por si acaso).</li>
              <li>Abre el correo de "Tattoo Artist Colombia" y haz clic en el link de confirmación.</li>
              <li>Listo — desde ahí mismo puedes patrocinar artistas del directorio.</li>
            </ol>
            <Link to="/tattoo-artist-colombia" className="inline-block mt-6 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity text-gray-600">
              ← Volver al buscador
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex-1 pt-20 md:pt-24 max-w-md mx-auto px-4 pb-16 w-full">
          <h1 className="text-xl font-black uppercase mb-2 text-center">Registra tu marca</h1>
          <p className="text-gray-500 text-sm text-center mb-5">
            Aparece frente a los tatuadores del directorio y patrocina a los artistas que quieras promocionar.
          </p>

          {SLOTS_MARCA_REG.map(({ key }) => (
            <input
              key={key}
              type="file"
              accept="image/*"
              ref={(el) => { fileInputs.current[key] = el }}
              style={{ display: 'none' }}
              onChange={(e) => subirFoto(key, e.target.files?.[0])}
            />
          ))}

          <div className="flex items-center gap-3 mb-5">
            <button type="button" onClick={() => elegirFoto('logo_url')} className="relative w-16 h-16 rounded-full bg-gray-100 border border-gray-300 overflow-hidden flex-shrink-0">
              {form.logo_url ? <img src={form.logo_url} alt="" className="w-full h-full object-cover" /> : <Camera size={18} className="absolute inset-0 m-auto text-gray-400" />}
              {subiendo === 'logo_url' && <LoaderCircle size={16} className="animate-spin absolute inset-0 m-auto text-gray-600" />}
            </button>
            <button type="button" onClick={() => elegirFoto('foto_portada')} className="relative flex-1 h-16 rounded-lg bg-gray-100 border border-gray-300 overflow-hidden">
              {form.foto_portada ? <img src={form.foto_portada} alt="" className="w-full h-full object-cover" /> : <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-[11px] font-bold uppercase tracking-wide gap-1"><Camera size={13} />Portada</span>}
              {subiendo === 'foto_portada' && <LoaderCircle size={16} className="animate-spin absolute inset-0 m-auto text-gray-600" />}
            </button>
          </div>
          <p className="text-gray-400 text-[10px] text-center -mt-3 mb-5">
            Logo: cuadrado, mínimo 400×400px · Portada: horizontal, ideal 1200×400px
          </p>

          <form onSubmit={enviar} className="space-y-4">
            <div>
              <label className={labelClass}>Nombre de la marca *</label>
              <input required className={inputClass} value={form.nombre} onChange={set('nombre')} placeholder="Ej: Mi Marca de Insumos" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Departamento *</label>
                <ComboboxBuscable value={form.departamento} onChange={setDepartamento} options={DEPARTAMENTOS} placeholder="Escribe para buscar..." inputClassName={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Municipio *</label>
                <ComboboxBuscable value={form.municipio} onChange={setMunicipio} options={municipiosDisponibles} disabled={!form.departamento} placeholder={form.departamento ? 'Escribe para buscar...' : 'Elige antes el departamento'} inputClassName={inputClass} />
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
                {ubicando ? 'Ubicando...' : form.lat ? 'Ubicación exacta agregada' : 'Agregar ubicación exacta (opcional)'}
              </button>
              <p className="text-gray-400 text-[10px] mt-1.5 text-center leading-relaxed">
                Opcional — sin esto, igual aparece asociada a su municipio.
              </p>
              {ubicacionError && <p className="text-gray-400 text-[10px] mt-1 text-center">{ubicacionError}</p>}
            </div>

            <div>
              <label className={labelClass}>Bio</label>
              <textarea rows={3} className={inputClass} value={form.bio} onChange={set('bio')} placeholder="Cuenta sobre la marca — qué vende, trayectoria" />
            </div>

            <div>
              <label className={labelClass}>WhatsApp *</label>
              <input required className={inputClass} value={form.whatsapp} onChange={set('whatsapp')} placeholder="57300..." />
            </div>

            <div>
              <label className={labelClass}>Correo *</label>
              <input required type="email" className={inputClass} value={form.email} onChange={set('email')} placeholder="tucorreo@ejemplo.com" />
              <p className="text-gray-400 text-[10px] mt-1">Te mandamos un link para confirmar el perfil y patrocinar artistas — sin esto no queda activo.</p>
            </div>

            <div>
              <label className={labelClass}>Instagram {!form.facebook.trim() && '*'}</label>
              <input className={inputClass} value={form.instagram} onChange={set('instagram')} placeholder="https://instagram.com/..." />
            </div>

            <div>
              <label className={labelClass}>Facebook {!form.instagram.trim() && '*'}</label>
              <input className={inputClass} value={form.facebook} onChange={set('facebook')} placeholder="https://facebook.com/..." />
              <p className="text-gray-400 text-[10px] mt-1">Necesitamos al menos una de las dos.</p>
            </div>

            <input
              type="text"
              value={form.sitio_web}
              onChange={set('sitio_web')}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
            />

            <div>
              <label className={labelClass}>Verificación — ¿cuánto es {captchaA} + {captchaB}?</label>
              <input type="number" inputMode="numeric" className={inputClass} value={captchaRespuesta} onChange={(e) => setCaptchaRespuesta(e.target.value)} placeholder="Escribe el resultado" />
            </div>

            {error && <p className="text-sm text-center" style={{ color: ACCENT }}>{error}</p>}

            <button
              type="submit"
              disabled={enviando}
              className="w-full py-3.5 text-white font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 text-sm"
              style={{ backgroundColor: ACCENT }}
            >
              {enviando ? 'Enviando...' : 'Enviar registro'}
            </button>
          </form>
        </div>
      )}

      <footer className="border-t border-gray-200 py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-400 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} Tattoo Artist Colombia — Todos los derechos reservados.</p>
          <span className="text-gray-300">Desarrollado por INKognito</span>
        </div>
      </footer>
    </div>
  )
}

const SLOTS_MARCA_REG = [{ key: 'logo_url' }, { key: 'foto_portada' }]
