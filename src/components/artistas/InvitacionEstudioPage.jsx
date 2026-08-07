import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { CheckCircle2, XCircle } from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'
import { artistaUrl } from './artistaSlug'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#B3202F'
const BTN = '#374151'

// A donde llega el link que el estudio le manda a un artista invitado
// (ver POST /api/estudios-invitar). Dos ramas según si ese correo ya
// tiene perfil de artista o no — si no tiene, esta pantalla es el
// puente hacia el registro normal, llevando el token de invitación para
// que el vínculo con el estudio se complete en un solo paso (ver
// POST /api/artistas-solicitud, campo invitacion_token).
export async function loader({ request }) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token) return { ok: false, error: 'Falta el enlace de invitación.' }
  try {
    const res = await fetch(`${PANEL_URL}/api/invitacion-estudio?token=${encodeURIComponent(token)}`)
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data.error || 'Invitación inválida.' }
    return { ok: true, token, ...data }
  } catch {
    return { ok: false, error: 'No pudimos cargar la invitación — intenta de nuevo en un momento.' }
  }
}

export function meta() {
  return [{ title: 'Invitación de estudio | Tattoo Artist Colombia' }]
}

export default function InvitacionEstudioPage() {
  const data = useLoaderData()
  const [respuesta, setRespuesta] = useState(null) // 'aceptada' | 'rechazada' | null
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  const responder = async (aceptar) => {
    setEnviando(true)
    setError(null)
    try {
      const res = await fetch(`${PANEL_URL}/api/invitacion-estudio/responder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: data.token, aceptar }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || '')
      setRespuesta(result.estado)
    } catch (err) {
      setError(err.message || 'No pudimos procesar tu respuesta — intenta de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavbarArtistas titulo="Invitación de estudio" />
      <div className="flex-1 flex items-center justify-center pt-20 px-4">
        <div className="text-center max-w-sm">
          {!data.ok ? (
            <>
              <XCircle size={48} className="mx-auto mb-4 text-gray-400" />
              <h1 className="text-2xl font-black uppercase mb-3">Invitación no disponible</h1>
              <p className="text-gray-500 text-sm leading-relaxed">{data.error}</p>
              <Link to="/tattoo-artist-colombia" className="inline-block mt-6 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity text-gray-600">
                ← Ir al buscador
              </Link>
            </>
          ) : respuesta === 'aceptada' ? (
            <>
              <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: ACCENT }} />
              <h1 className="text-2xl font-black uppercase mb-3">¡Listo!</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                {data.estudio_tipo === 'empresa' ? `${data.estudio_nombre} ya te patrocina.` : `Ya quedaste vinculado a ${data.estudio_nombre}.`}
              </p>
              <Link
                to={artistaUrl(data.artista)}
                className="inline-flex items-center justify-center px-5 py-2.5 mt-6 rounded-full text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                style={{ backgroundColor: ACCENT }}
              >
                Ver mi perfil
              </Link>
            </>
          ) : respuesta === 'rechazada' ? (
            <>
              <XCircle size={48} className="mx-auto mb-4 text-gray-400" />
              <h1 className="text-2xl font-black uppercase mb-3">Invitación rechazada</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                {data.estudio_tipo === 'empresa' ? `No aceptaste el patrocinio de ${data.estudio_nombre}.` : `No quedaste vinculado a ${data.estudio_nombre}.`}
              </p>
            </>
          ) : (
            <>
              {data.estudio_logo && <img src={data.estudio_logo} alt="" className="w-16 h-16 rounded-full object-cover mx-auto mb-4" />}
              <h1 className="text-xl font-black uppercase mb-3">
                {data.estudio_tipo === 'empresa' ? `${data.estudio_nombre} quiere patrocinarte` : `${data.estudio_nombre} te invitó`}
              </h1>

              {data.ya_tiene_perfil ? (
                <>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {data.estudio_tipo === 'empresa' ? '¿Aceptas que esta marca te patrocine con tu perfil de artista ya registrado?' : '¿Quieres unirte a este estudio con tu perfil de artista ya registrado?'}
                  </p>
                  {error && <p className="text-sm mb-3" style={{ color: ACCENT }}>{error}</p>}
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => responder(true)}
                      disabled={enviando}
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-60"
                      style={{ backgroundColor: BTN }}
                    >
                      Aceptar
                    </button>
                    <button
                      type="button"
                      onClick={() => responder(false)}
                      disabled={enviando}
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-300 text-gray-600 text-xs font-bold uppercase tracking-widest hover:border-gray-500 transition-colors disabled:opacity-60"
                    >
                      Rechazar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">Todavía no tienes perfil de artista — créalo y quedas vinculado a este estudio automáticamente.</p>
                  <Link
                    to={`/tattoo-artist-colombia/unete?invitacion=${encodeURIComponent(data.token)}`}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: ACCENT }}
                  >
                    Crear mi perfil de artista
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <footer className="border-t border-gray-200 py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-400 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} Tattoo Artist Colombia — Todos los derechos reservados.</p>
          <span className="text-gray-300">Desarrollado por INKognito</span>
        </div>
      </footer>
    </div>
  )
}
