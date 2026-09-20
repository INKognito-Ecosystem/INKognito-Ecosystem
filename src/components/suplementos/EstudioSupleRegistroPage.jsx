import { useRef, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { CheckCircle2, UploadCloud, Image as ImageIcon, LoaderCircle, Navigation, Check } from 'lucide-react'
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa'
import NavbarSuple from './NavbarSuple'
import SupleMobileNav from './SupleMobileNav'
import ComboboxBuscable from '../artistas/ComboboxBuscable'
import { DEPARTAMENTOS, MUNICIPIOS_POR_DEPARTAMENTO, municipioDesdeNombreIP } from '../../data/colombiaGeo'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#3f3f46' // zinc-700, mismo acento que ya usa Suple (carrito, marca de tab activo)

// Registro de vendedor — Suple multitenant (2026-09-20). Calcado de
// EstudioProveedorSupplyRegistroPage.jsx (cobertura nacional — un vendedor
// de suplementos no está atado a Urabá) + dirección obligatoria y botón de
// ubicación GPS de EstudioTiendaRegistroPage.jsx (Ruta del Golfo, Suple se
// suma a la misma red que Store). Público desde el día uno, mismo criterio
// que ambos moldes: sin aprobación manual, solo honeypot+captcha.
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
  const title = 'Registra tu catálogo | INKognito Suple'
  const description = 'Registra tu catálogo de suplementos deportivos y vende directo a tus clientes en toda Colombia con tu propio link de INKognito Suple.'
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/suplementos/proveedores/unete` },
  ]
}

const inputClass = 'w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors'
const labelClass = 'text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block'
const cardClass = 'bg-white border border-gray-200 rounded-2xl shadow-sm p-5 md:p-8'
const cardTitleClass = 'text-sm font-black uppercase tracking-widest text-gray-900 mb-4 pb-3 border-b border-gray-100'

export default function EstudioSupleRegistroPage() {
  const { cloud_name, upload_preset, captchaA, captchaB } = useLoaderData()
  const [form, setForm] = useState({
    nombre: '', departamento: '', municipio: '', direccion: '', lat: null, lng: null, bio: '', instagram: '', facebook: '', whatsapp: '', email: '',
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

  const numeroWhatsapp = form.whatsapp.replace(/^57/, '')
  const setNumeroWhatsapp = (e) => setForm((f) => ({ ...f, whatsapp: '57' + e.target.value.replace(/\D/g, '') }))

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
      fd.append('folder', 'inkognito-suple-vendedores')
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
    if (!form.nombre.trim() || !form.departamento || !form.municipio || !form.direccion.trim() || !form.whatsapp.trim() || !form.email.trim()) {
      setError('Nombre, departamento, municipio, dirección, WhatsApp y correo son obligatorios.')
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
        body: JSON.stringify({ ...form, tipo: 'suple', captcha_a: captchaA, captcha_b: captchaB, captcha_respuesta: captchaRespuesta }),
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
      <NavbarSuple
        pageName="Registrar vendedor"
        hideMobileActions
        shareUrl={`${import.meta.env.VITE_SITE_URL}/suplementos/proveedores/unete`}
      />

      {enviado ? (
        <div className="flex-1 pt-20 md:pt-24 max-w-md mx-auto px-4 pb-16 w-full">
          <div className="text-center py-16">
            <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: ACCENT }} />
            <h1 className="text-2xl font-black uppercase mb-3">¡Ya casi!</h1>
            <p className="text-gray-500 text-sm leading-relaxed">Falta un paso para que tu catálogo quede activo.</p>
            <ol className="text-left text-gray-600 text-sm leading-relaxed mt-5 space-y-2.5 list-decimal list-inside">
              <li>Revisa la bandeja de <strong>{form.email}</strong> (y la de spam/promociones, por si acaso).</li>
              <li>Abre el correo de "INKognito Suple" y haz clic en el link de confirmación.</li>
              <li>Listo — desde ahí mismo puedes conectar tu Mercado Pago y subir tus productos.</li>
            </ol>
            <Link to="/suplementos" className="inline-block mt-6 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity text-gray-600">
              ← Volver a Suple
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex-1 pt-20 md:pt-24 pb-16 px-4 w-full">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-xl md:text-2xl font-black uppercase mb-2">Registra tu catálogo</h1>
              <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                Vende tus suplementos directo a tus clientes en toda Colombia con tu propio perfil en INKognito Suple — cobras tú, directo a tu cuenta.
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={(el) => { fileInputs.current.logo_url = el }}
              style={{ display: 'none' }}
              onChange={(e) => subirFoto(e.target.files?.[0])}
            />

            <form onSubmit={enviar}>
              <div className="flex flex-col items-center mb-6">
                <p className="text-gray-500 text-xs mb-3"><strong className="text-gray-700">Logo:</strong> cuadrado, mínimo 400×400px</p>
                <button
                  type="button"
                  onClick={elegirFoto}
                  className="relative w-32 h-32 md:w-36 md:h-36 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 overflow-hidden hover:border-gray-400 transition-colors flex-shrink-0"
                >
                  {form.logo_url ? (
                    <img src={form.logo_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <UploadCloud size={20} className="text-gray-400" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-gray-600">Subir logo</span>
                      <ImageIcon size={14} className="text-gray-300" />
                    </>
                  )}
                  {subiendo && <LoaderCircle size={18} className="animate-spin absolute inset-0 m-auto text-gray-700" />}
                </button>
              </div>

              {/* CARD 1 — Datos del vendedor */}
              <div className={cardClass}>
                <h2 className={cardTitleClass}>Datos del vendedor</h2>
                <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                  <div className="col-span-2">
                    <label className={labelClass}>Nombre del negocio *</label>
                    <input required className={inputClass} value={form.nombre} onChange={set('nombre')} placeholder="Ej: Mi Marca de Suplementos" />
                  </div>

                  <div>
                    <label className={labelClass}>Departamento *</label>
                    <ComboboxBuscable value={form.departamento} onChange={setDepartamento} options={DEPARTAMENTOS} placeholder="Escribe para buscar..." inputClassName={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Municipio *</label>
                    <ComboboxBuscable value={form.municipio} onChange={setMunicipio} options={municipiosDisponibles} disabled={!form.departamento} placeholder={form.departamento ? 'Escribe para buscar...' : 'Elige antes el departamento'} inputClassName={inputClass} />
                  </div>

                  <div className="col-span-2">
                    <label className={labelClass}>Dirección exacta *</label>
                    <input required className={inputClass} value={form.direccion} onChange={set('direccion')} placeholder="Calle, carrera, barrio..." />
                    <p className="text-gray-400 text-[10px] mt-1">Para que Ruta del Golfo sepa dónde recoger tus pedidos — nunca se muestra públicamente.</p>
                  </div>

                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={usarMiUbicacion}
                      disabled={ubicando}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-wide transition-all duration-200 disabled:opacity-60"
                      style={form.lat ? { borderColor: '#16a34a', color: '#16a34a' } : { borderColor: '#4B5563', color: '#4B5563' }}
                    >
                      {ubicando ? <LoaderCircle size={12} className="animate-spin" /> : form.lat ? <Check size={12} /> : <Navigation size={12} />}
                      {ubicando ? 'Ubicando...' : form.lat ? 'Ubicación agregada' : 'Ubicación exacta'}
                    </button>
                    <p className="text-gray-400 text-[10px] mt-1.5 text-center leading-relaxed">
                      Actívala estando físicamente en el punto exacto que quieres mostrar.
                    </p>
                    {ubicacionError && <p className="text-gray-400 text-[10px] mt-1 text-center">{ubicacionError}</p>}
                  </div>

                  <div className="col-span-2">
                    <label className={labelClass}>Bio</label>
                    <textarea rows={3} className={inputClass} value={form.bio} onChange={set('bio')} placeholder="Cuenta sobre tu marca — qué vendes, trayectoria" />
                  </div>
                </div>
              </div>

              {/* CARD 2 — Redes de contacto */}
              <div className={`${cardClass} mt-5`}>
                <h2 className={cardTitleClass}>Redes de contacto</h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className={labelClass}>WhatsApp *</label>
                    <div className="flex gap-2">
                      <div className="flex-shrink-0 w-14 flex items-center justify-center rounded-lg border border-gray-300 bg-gray-100 text-sm font-bold text-gray-600">
                        +57
                      </div>
                      <div className="relative flex-1 min-w-0">
                        <input
                          required
                          type="tel"
                          inputMode="numeric"
                          className={`${inputClass} pr-9`}
                          value={numeroWhatsapp}
                          onChange={setNumeroWhatsapp}
                          placeholder="300 1234567"
                        />
                        <FaWhatsapp size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Instagram {!form.facebook.trim() && '*'}</label>
                    <div className="relative">
                      <input className={`${inputClass} pr-9`} value={form.instagram} onChange={set('instagram')} placeholder="https://instagram.com/..." />
                      <FaInstagram size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Facebook {!form.instagram.trim() && '*'}</label>
                    <div className="relative">
                      <input className={`${inputClass} pr-9`} value={form.facebook} onChange={set('facebook')} placeholder="https://facebook.com/..." />
                      <FaFacebook size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <p className="text-gray-400 text-[10px] mt-1">Necesitamos al menos una de las dos.</p>
                  </div>

                  <div>
                    <label className={labelClass}>Correo *</label>
                    <input required type="email" className={inputClass} value={form.email} onChange={set('email')} placeholder="tucorreo@ejemplo.com" />
                    <p className="text-gray-400 text-[10px] mt-1">Te mandamos un link para confirmar tu catálogo y empezar a vender — sin esto no queda activo.</p>
                  </div>
                </div>
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

              <div className="mt-5">
                <label className={labelClass}>Verificación — ¿cuánto es {captchaA} + {captchaB}?</label>
                <input type="number" inputMode="numeric" className={inputClass} value={captchaRespuesta} onChange={(e) => setCaptchaRespuesta(e.target.value)} placeholder="Escribe el resultado" />
              </div>

              {error && <p className="text-sm text-center mt-4" style={{ color: ACCENT }}>{error}</p>}

              <button
                type="submit"
                disabled={enviando}
                className="w-full py-3.5 mt-5 text-white font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 text-sm"
                style={{ backgroundColor: ACCENT }}
              >
                {enviando ? 'Enviando...' : 'Enviar registro'}
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="border-t border-gray-200 py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-400 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} INKognito Suple — Todos los derechos reservados.</p>
          <span className="text-gray-300">Desarrollado por INKognito</span>
        </div>
      </footer>
      <div className="h-16 md:hidden" />
      <SupleMobileNav active={null} />
    </div>
  )
}
