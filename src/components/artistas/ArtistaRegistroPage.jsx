import { useRef, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { CheckCircle2, Camera, MapPin, Palette, LoaderCircle } from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#B3202F'
const MUNICIPIOS = ['Chigorodó', 'Apartadó', 'Turbo', 'Carepa']

// Los mismos 5 slots que ya maneja el admin en el panel (perfil, portada,
// 3 trabajos) — acá el artista los sube él mismo, directo a Cloudinary
// desde el navegador (unsigned upload, mismo patrón que ya usa el panel).
const SLOTS = [
  { key: 'foto_url', label: 'Perfil' },
  { key: 'foto_url_2', label: 'Portada' },
  { key: 'foto_trabajo_1', label: 'Trabajo 1' },
  { key: 'foto_trabajo_2', label: 'Trabajo 2' },
  { key: 'foto_trabajo_3', label: 'Trabajo 3' },
]

export async function loader() {
  try {
    const res = await fetch(`${PANEL_URL}/api/upload-config`)
    if (res.ok) return await res.json()
  } catch {
    // sigue abajo con el fallback
  }
  return { cloud_name: null, upload_preset: null }
}

export function meta() {
  const title = 'Únete como artista | Tattoo Artist Urabá'
  const description = 'Registra tu perfil en el buscador que conecta clientes con tatuadores de Urabá.'
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/tattoo-artist-uraba/unete` },
  ]
}

const inputClass = 'w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors'
const labelClass = 'text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block'

// Autoregistro público (2026-08-04) — el artista carga sus propios datos
// Y sus propias fotos, viendo su landing transformarse en vivo mientras
// llena el formulario (pedido explícito de Jose: "que ellos esos datos
// los llenen viendo como se ira transformando su landing, como en
// facebook"). El perfil NACE OCULTO (activo=false, forzado en el
// servidor) — Jose lo revisa en "Solicitudes pendientes" del panel y lo
// aprueba con un clic. La curación sigue siendo esa aprobación manual,
// no la subida de fotos en sí.
export default function ArtistaRegistroPage() {
  const { cloud_name, upload_preset } = useLoaderData()
  const [form, setForm] = useState({
    nombre: '', municipio: '', estilo: '', bio: '', instagram: '', facebook: '', whatsapp: '',
    foto_url: '', foto_url_2: '', foto_trabajo_1: '', foto_trabajo_2: '', foto_trabajo_3: '',
  })
  const [subiendo, setSubiendo] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState(null)
  const fileInputs = useRef({})

  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))

  const elegirFoto = (slot) => fileInputs.current[slot]?.click()

  const subirFoto = async (slot, file) => {
    if (!file) return
    if (!cloud_name || !upload_preset) {
      setError('La subida de fotos no está disponible en este momento — puedes registrarte igual y las agregamos después.')
      return
    }
    setError(null)
    setSubiendo(slot)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', upload_preset)
      fd.append('folder', 'inkognito-artistas')
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (!data.secure_url) throw new Error()
      setForm((f) => ({ ...f, [slot]: data.secure_url }))
    } catch {
      setError('No pudimos subir esa foto — intenta de nuevo.')
    } finally {
      setSubiendo(null)
    }
  }

  const enviar = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.municipio || !form.whatsapp.trim()) {
      setError('Nombre, municipio y WhatsApp son obligatorios.')
      return
    }
    setError(null)
    setEnviando(true)
    try {
      const res = await fetch(`${PANEL_URL}/api/artistas-solicitud`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setEnviado(true)
    } catch {
      setError('No pudimos enviar tu registro — intenta de nuevo en un momento.')
    } finally {
      setEnviando(false)
    }
  }

  const trabajos = [form.foto_trabajo_1, form.foto_trabajo_2, form.foto_trabajo_3].filter(Boolean)

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavbarArtistas />

      <div className="flex-1 pt-24 md:pt-28 max-w-5xl mx-auto px-4 pb-16 w-full">

        {enviado ? (
          <div className="text-center py-16">
            <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: ACCENT }} />
            <h1 className="text-2xl font-black uppercase mb-3">¡Listo, recibimos tu registro!</h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
              Vamos a revisar tu perfil y te escribimos por WhatsApp para confirmarte cuando quede activo en el buscador.
            </p>
            <Link to="/tattoo-artist-uraba" className="inline-block mt-6 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity" style={{ color: ACCENT }}>
              ← Volver al buscador
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-black uppercase leading-tight mb-3">
                Únete al <span style={{ color: ACCENT }}>buscador</span>
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
                Tattoo Artist Urabá conecta clientes con tatuadores de la región. Llena tus datos y mira tu perfil tomar forma en tiempo real.
              </p>
            </div>

            {/* inputs de archivo ocultos, uno por slot — se disparan desde
                los botones de cámara dentro de la vista previa */}
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

            <div className="grid md:grid-cols-2 gap-8 items-start">

              {/* VISTA PREVIA EN VIVO — mismo patrón visual de la landing
                  real (portada + avatar), se actualiza al instante con
                  cada campo y cada foto que se sube. */}
              <div className="order-2 md:order-1 md:sticky md:top-28">
                <p className={labelClass}>Así se verá tu perfil</p>
                <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="relative h-28 bg-gray-100">
                    {form.foto_url_2 && <img src={form.foto_url_2} alt="" className="w-full h-full object-cover" />}
                    <button
                      type="button"
                      onClick={() => elegirFoto('foto_url_2')}
                      className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1.5 rounded-full backdrop-blur-sm hover:bg-black/80 transition-colors"
                    >
                      {subiendo === 'foto_url_2' ? <LoaderCircle size={11} className="animate-spin" /> : <Camera size={11} />}
                      Portada
                    </button>
                  </div>

                  <div className="px-4 pb-4">
                    <div className="relative -mt-8 inline-block">
                      <div className="w-16 h-16 rounded-full border-4 border-white bg-gray-100 shadow-md overflow-hidden">
                        {form.foto_url ? (
                          <img src={form.foto_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl font-black">
                            {form.nombre?.[0]?.toUpperCase() || '?'}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => elegirFoto('foto_url')}
                        aria-label="Subir foto de perfil"
                        className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full text-white shadow-md"
                        style={{ backgroundColor: ACCENT }}
                      >
                        {subiendo === 'foto_url' ? <LoaderCircle size={11} className="animate-spin" /> : <Camera size={11} />}
                      </button>
                    </div>

                    <p className="font-black uppercase text-sm mt-3 leading-tight">{form.nombre || 'Tu nombre'}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-gray-500 text-[10px] uppercase tracking-wide">
                        <MapPin size={10} />
                        {form.municipio || 'Municipio'}
                      </span>
                      {form.estilo && (
                        <span className="flex items-center gap-1 text-gray-500 text-[10px] uppercase tracking-wide">
                          <Palette size={10} />
                          {form.estilo}
                        </span>
                      )}
                    </div>
                    {form.bio && <p className="text-gray-600 text-xs leading-relaxed mt-2">{form.bio}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-0.5">
                    {SLOTS.slice(2).map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => elegirFoto(key)}
                        className="relative aspect-square bg-gray-50 overflow-hidden group"
                      >
                        {form[key] ? (
                          <img src={form[key]} alt={label} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-300 group-hover:text-gray-400 transition-colors">
                            {subiendo === key ? <LoaderCircle size={16} className="animate-spin" /> : <Camera size={16} />}
                            <span className="text-[9px] font-bold uppercase tracking-wide">{label}</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-gray-400 text-[11px] mt-2 text-center">Toca las fotos para subirlas — es opcional, puedes hacerlo ahora o cuando te contactemos.</p>
              </div>

              {/* FORMULARIO */}
              <form onSubmit={enviar} className="order-1 md:order-2 space-y-4">
                <div>
                  <label className={labelClass}>Nombre *</label>
                  <input required className={inputClass} value={form.nombre} onChange={set('nombre')} placeholder="Tu nombre o el de tu estudio" />
                </div>

                <div>
                  <label className={labelClass}>Municipio *</label>
                  <select required className={inputClass} value={form.municipio} onChange={set('municipio')}>
                    <option value="">Selecciona tu municipio</option>
                    {MUNICIPIOS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Estilo</label>
                  <input className={inputClass} value={form.estilo} onChange={set('estilo')} placeholder="Ej: Realismo, Blackwork, Fine line" />
                </div>

                <div>
                  <label className={labelClass}>Bio corta</label>
                  <textarea rows={3} className={inputClass} value={form.bio} onChange={set('bio')} placeholder="1-2 líneas sobre ti y tu trabajo" />
                </div>

                <div>
                  <label className={labelClass}>WhatsApp *</label>
                  <input required className={inputClass} value={form.whatsapp} onChange={set('whatsapp')} placeholder="57300..." />
                </div>

                <div>
                  <label className={labelClass}>Instagram</label>
                  <input className={inputClass} value={form.instagram} onChange={set('instagram')} placeholder="https://instagram.com/..." />
                </div>

                <div>
                  <label className={labelClass}>Facebook</label>
                  <input className={inputClass} value={form.facebook} onChange={set('facebook')} placeholder="https://facebook.com/..." />
                </div>

                {error && <p className="text-sm" style={{ color: ACCENT }}>{error}</p>}

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
          </>
        )}
      </div>

      <footer className="border-t border-gray-200 py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-400 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} Tattoo Artist Urabá — INKognito. Todos los derechos reservados.</p>
          <span className="text-gray-300">Desarrollado por INKognito</span>
        </div>
      </footer>
    </div>
  )
}
