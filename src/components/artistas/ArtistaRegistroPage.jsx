import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#B3202F'
const MUNICIPIOS = ['Chigorodó', 'Apartadó', 'Turbo', 'Carepa']

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
// de texto, pero el perfil NACE OCULTO (activo=false en el servidor,
// forzado sin importar qué se envíe acá). Jose lo revisa, le sube las
// fotos desde el panel y lo activa — mismo criterio curado de siempre,
// solo que ahora el artista hace la carga de datos en vez de dictárselos
// a Jose por WhatsApp. No hay login ni fotos en este formulario a
// propósito: las fotos siguen siendo el filtro de calidad que Jose
// controla manualmente.
export default function ArtistaRegistroPage() {
  const [form, setForm] = useState({ nombre: '', municipio: '', estilo: '', bio: '', instagram: '', facebook: '', whatsapp: '' })
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState(null)

  const set = (campo) => (e) => setForm(f => ({ ...f, [campo]: e.target.value }))

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

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <NavbarArtistas />

      <div className="pt-24 md:pt-28 max-w-xl mx-auto px-4 pb-16">

        {enviado ? (
          <div className="text-center py-16">
            <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: ACCENT }} />
            <h1 className="text-2xl font-black uppercase mb-3">¡Listo, recibimos tu registro!</h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
              Vamos a revisar tu información y te escribimos por WhatsApp para completar tu perfil con fotos y activarlo en el buscador.
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
                Tattoo Artist Urabá conecta clientes con tatuadores de la región. Cuéntanos de ti — nosotros nos encargamos del resto.
              </p>
            </div>

            <form onSubmit={enviar} className="space-y-4">
              <div>
                <label className={labelClass}>Nombre *</label>
                <input required className={inputClass} value={form.nombre} onChange={set('nombre')} placeholder="Tu nombre o el de tu estudio" />
              </div>

              <div>
                <label className={labelClass}>Municipio *</label>
                <select required className={inputClass} value={form.municipio} onChange={set('municipio')}>
                  <option value="">Selecciona tu municipio</option>
                  {MUNICIPIOS.map(m => <option key={m} value={m}>{m}</option>)}
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
