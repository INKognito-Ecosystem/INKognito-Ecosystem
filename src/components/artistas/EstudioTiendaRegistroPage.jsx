import { useRef, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { CheckCircle2, Camera, LoaderCircle, Navigation, Check } from 'lucide-react'
import NavbarCategoryStore from '../store/NavbarCategoryStore'
import ComboboxBuscable from './ComboboxBuscable'
import { DEPARTAMENTOS, MUNICIPIOS_POR_DEPARTAMENTO, municipioDesdeNombreIP } from '../../data/colombiaGeo'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
// Dorado de Store (2026-08-30, corrección de Jose: "este es clonado de lo
// demás, pero no debe tener ningún vínculo con los demás módulos") — antes
// heredaba el rojo del registro de estudios de tatuaje sin querer, mismo
// bug de fondo que el navbar (ver más abajo).
const ACCENT = '#C9A84C'

// Registro de tienda — Store multitenant (2026-08-29). Calcado de
// EstudioRegistroPage.jsx/EstudioMarcaRegistroPage.jsx (mismo loader,
// mismo honeypot+captcha, mismo submit a POST /api/estudios-solicitud
// que ya acepta tipo='tienda'). A diferencia de la marca (que Jose cura
// a mano, sin link público), esta página SÍ es pública desde el día uno
// — el objetivo es que cualquier tienda de ropa/calzado de Urabá se
// autoregistre sin pasar por Jose.
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
  const title = 'Registra tu tienda | INKognito Store'
  const description = 'Registra tu tienda de ropa o calzado y vende directo a tus clientes de Urabá con tu propio link de INKognito Store.'
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/tattoo-artist-colombia/tienda/unete` },
  ]
}

const inputClass = 'w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors'
const labelClass = 'text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block'

export default function EstudioTiendaRegistroPage() {
  const { cloud_name, upload_preset, captchaA, captchaB } = useLoaderData()
  const [form, setForm] = useState({
    nombre: '', departamento: '', municipio: '', lat: null, lng: null, bio: '', instagram: '', facebook: '', whatsapp: '', email: '',
    logo_url: '',
    sitio_web: '', // honeypot
  })
  const [subiendo, setSubiendo] = useState(false)
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
        body: JSON.stringify({ ...form, tipo: 'tienda', captcha_a: captchaA, captcha_b: captchaB, captcha_respuesta: captchaRespuesta }),
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
      <NavbarCategoryStore pageName="Registrar tienda" />

      {enviado ? (
        <div className="flex-1 pt-20 md:pt-24 max-w-md mx-auto px-4 pb-16 w-full">
          <div className="text-center py-16">
            <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: ACCENT }} />
            <h1 className="text-2xl font-black uppercase mb-3">¡Ya casi!</h1>
            <p className="text-gray-500 text-sm leading-relaxed">Falta un paso para que el perfil de tu tienda quede activo.</p>
            <ol className="text-left text-gray-600 text-sm leading-relaxed mt-5 space-y-2.5 list-decimal list-inside">
              <li>Revisa la bandeja de <strong>{form.email}</strong> (y la de spam/promociones, por si acaso).</li>
              <li>Abre el correo de "INKognito Store" y haz clic en el link de confirmación.</li>
              <li>Listo — desde ahí mismo puedes conectar tu Mercado Pago y subir tus productos.</li>
            </ol>
            <Link to="/store" className="inline-block mt-6 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity text-gray-600">
              ← Volver a Store
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex-1 pt-20 md:pt-24 max-w-md mx-auto px-4 pb-16 w-full">
          <h1 className="text-xl font-black uppercase mb-2 text-center">Registra tu tienda</h1>
          <p className="text-gray-500 text-sm text-center mb-5">
            Vende directo a tus clientes de Urabá con tu propio perfil en INKognito Store — cobras tú, directo a tu cuenta.
          </p>

          <input
            type="file"
            accept="image/*"
            ref={(el) => { fileInputs.current.logo_url = el }}
            style={{ display: 'none' }}
            onChange={(e) => subirFoto(e.target.files?.[0])}
          />

          {/* Sin foto de portada (quitada 2026-08-30, Jose: el catálogo de
              una tienda nunca la muestra en ningún lado — solo el logo). */}
          <div className="flex flex-col items-center mb-5">
            <button type="button" onClick={elegirFoto} className="relative w-16 h-16 rounded-full bg-gray-100 border border-gray-300 overflow-hidden flex-shrink-0">
              {form.logo_url ? <img src={form.logo_url} alt="" className="w-full h-full object-cover" /> : <Camera size={18} className="absolute inset-0 m-auto text-gray-400" />}
              {subiendo && <LoaderCircle size={16} className="animate-spin absolute inset-0 m-auto text-gray-600" />}
            </button>
            <p className="text-gray-400 text-[10px] mt-2">Logo: cuadrado, mínimo 400×400px</p>
          </div>

          <form onSubmit={enviar} className="space-y-4">
            <div>
              <label className={labelClass}>Nombre de la tienda *</label>
              <input required className={inputClass} value={form.nombre} onChange={set('nombre')} placeholder="Ej: Mi Tienda de Ropa" />
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
              <textarea rows={3} className={inputClass} value={form.bio} onChange={set('bio')} placeholder="Cuenta sobre la tienda — qué vende, trayectoria" />
            </div>

            <div>
              <label className={labelClass}>WhatsApp *</label>
              <input required className={inputClass} value={form.whatsapp} onChange={set('whatsapp')} placeholder="57300..." />
            </div>

            <div>
              <label className={labelClass}>Correo *</label>
              <input required type="email" className={inputClass} value={form.email} onChange={set('email')} placeholder="tucorreo@ejemplo.com" />
              <p className="text-gray-400 text-[10px] mt-1">Te mandamos un link para confirmar el perfil y empezar a vender — sin esto no queda activo.</p>
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
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} INKognito Store — Todos los derechos reservados.</p>
          <span className="text-gray-300">Desarrollado por INKognito</span>
        </div>
      </footer>
    </div>
  )
}
