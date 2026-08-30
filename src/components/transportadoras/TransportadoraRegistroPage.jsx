import { useRef, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { CheckCircle2, Camera, LoaderCircle } from 'lucide-react'
import ZonasCoberturaCheckboxes from './ZonasCoberturaCheckboxes'
import { ZONAS_FLETE } from '../../data/colombiaGeo'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#0057D9'

// Registro de transportadora — "Ruta del Golfo" (2026-08-30). Mismo
// patrón de siempre (honeypot+captcha, POST público, correo de
// verificación) pero construido genérico y sin marca de Store — esta
// pieza conecta a varios módulos con el tiempo (Jose: "que crezca más
// allá de Store el día de mañana"), así que a propósito no usa
// NavbarCategoryStore ni ningún navbar de otro módulo.
export async function loader() {
  const captchaA = Math.floor(Math.random() * 8) + 1
  const captchaB = Math.floor(Math.random() * 8) + 1
  try {
    const res = await fetch(`${PANEL_URL}/api/upload-config`)
    if (res.ok) return { ...(await res.json()), captchaA, captchaB }
  } catch {
    // sigue abajo con el fallback
  }
  return { cloud_name: null, upload_preset: null, captchaA, captchaB }
}

export function meta() {
  const title = 'Regístrate como transportadora | Ruta del Golfo'
  const description = 'Regístrate para recibir envíos de tiendas de INKognito Store en tu zona de cobertura.'
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/transportadoras/unete` },
  ]
}

const inputClass = 'w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors'
const labelClass = 'text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block'

export default function TransportadoraRegistroPage() {
  const { cloud_name, upload_preset, captchaA, captchaB } = useLoaderData()
  const [form, setForm] = useState({
    nombre: '', whatsapp: '', email: '', bio: '', logo_url: '', municipio: '', zonas_cobertura: [],
    sitio_web: '', // honeypot
  })
  const [subiendo, setSubiendo] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState(null)
  const [captchaRespuesta, setCaptchaRespuesta] = useState('')
  const fileInputs = useRef({})

  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))

  const elegirFoto = () => fileInputs.current.logo_url?.click()
  const subirFoto = async (file) => {
    if (!file || !cloud_name || !upload_preset) return
    setSubiendo(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', upload_preset)
      fd.append('folder', 'inkognito-transportadoras')
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
    if (!form.nombre.trim() || !form.whatsapp.trim() || !form.email.trim()) {
      setError('Nombre, WhatsApp y correo son obligatorios.')
      return
    }
    if (!form.municipio) {
      setError('Elige el municipio donde está tu empresa.')
      return
    }
    if (!form.zonas_cobertura.length) {
      setError('Elige al menos una zona de cobertura.')
      return
    }
    if (Number(captchaRespuesta) !== captchaA + captchaB) {
      setError('La respuesta de la verificación no es correcta.')
      return
    }
    setError(null)
    setEnviando(true)
    try {
      const res = await fetch(`${PANEL_URL}/api/transportadoras-solicitud`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, captcha_a: captchaA, captcha_b: captchaB, captcha_respuesta: captchaRespuesta }),
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
      <div className="border-b border-gray-200 px-4 py-4 text-center">
        <p className="font-black uppercase tracking-[0.15em] text-sm" style={{ color: ACCENT }}>Ruta del Golfo</p>
      </div>

      {enviado ? (
        <div className="flex-1 pt-12 max-w-md mx-auto px-4 pb-16 w-full">
          <div className="text-center py-16">
            <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: ACCENT }} />
            <h1 className="text-2xl font-black uppercase mb-3">¡Ya casi!</h1>
            <p className="text-gray-500 text-sm leading-relaxed">Falta un paso para activar tu registro.</p>
            <ol className="text-left text-gray-600 text-sm leading-relaxed mt-5 space-y-2.5 list-decimal list-inside">
              <li>Revisa la bandeja de <strong>{form.email}</strong> (y la de spam/promociones, por si acaso).</li>
              <li>Abre el correo de "Ruta del Golfo" y haz clic en el link de confirmación.</li>
              <li>Cuando revisemos y activemos tu registro, empezarás a ver los envíos que te asignen.</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="flex-1 pt-10 max-w-md mx-auto px-4 pb-16 w-full">
          <h1 className="text-xl font-black uppercase mb-2 text-center">Regístrate como transportadora</h1>
          <p className="text-gray-500 text-sm text-center mb-5">
            Recibe envíos de tiendas de INKognito Store en tu zona de cobertura.
          </p>

          <input
            type="file"
            accept="image/*"
            ref={(el) => { fileInputs.current.logo_url = el }}
            style={{ display: 'none' }}
            onChange={(e) => subirFoto(e.target.files?.[0])}
          />

          <div className="flex flex-col items-center mb-5">
            <button type="button" onClick={elegirFoto} className="relative w-16 h-16 rounded-full bg-gray-100 border border-gray-300 overflow-hidden flex-shrink-0">
              {form.logo_url ? <img src={form.logo_url} alt="" className="w-full h-full object-cover" /> : <Camera size={18} className="absolute inset-0 m-auto text-gray-400" />}
              {subiendo && <LoaderCircle size={16} className="animate-spin absolute inset-0 m-auto text-gray-600" />}
            </button>
            <p className="text-gray-400 text-[10px] mt-2">Logo (opcional): cuadrado, mínimo 400×400px</p>
          </div>

          <form onSubmit={enviar} className="space-y-4">
            <div>
              <label className={labelClass}>Nombre de la empresa *</label>
              <input required className={inputClass} value={form.nombre} onChange={set('nombre')} placeholder="Ej: Envíos Rápidos Urabá" />
            </div>

            <div>
              <label className={labelClass}>WhatsApp *</label>
              <input required className={inputClass} value={form.whatsapp} onChange={set('whatsapp')} placeholder="57300..." />
            </div>

            <div>
              <label className={labelClass}>Correo *</label>
              <input required type="email" className={inputClass} value={form.email} onChange={set('email')} placeholder="tucorreo@ejemplo.com" />
              <p className="text-gray-400 text-[10px] mt-1">Te mandamos un link para confirmar el registro — sin esto no queda activo.</p>
            </div>

            <div>
              <label className={labelClass}>Municipio de tu empresa *</label>
              <select required className={inputClass} value={form.municipio} onChange={set('municipio')}>
                <option value="">Selecciona...</option>
                {Object.entries(ZONAS_FLETE).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <p className="text-gray-400 text-[10px] mt-1">Dónde tienes tu sede — puede ser distinto de las zonas que cubres abajo.</p>
            </div>

            <div>
              <label className={labelClass}>Zonas que cubres *</label>
              <ZonasCoberturaCheckboxes value={form.zonas_cobertura} onChange={(zonas) => setForm((f) => ({ ...f, zonas_cobertura: zonas }))} />
            </div>

            <div>
              <label className={labelClass}>Bio (opcional)</label>
              <textarea rows={3} className={inputClass} value={form.bio} onChange={set('bio')} placeholder="Cuenta sobre tu empresa — flota, trayectoria..." />
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

            {error && <p className="text-sm text-center" style={{ color: '#dc2626' }}>{error}</p>}

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
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} Ruta del Golfo — Todos los derechos reservados.</p>
          <span className="text-gray-300">Desarrollado por INKognito</span>
        </div>
      </footer>
    </div>
  )
}
