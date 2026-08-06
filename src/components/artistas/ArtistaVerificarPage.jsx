import { Link, useLoaderData } from 'react-router-dom'
import { CheckCircle2, XCircle } from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'
import { artistaUrl } from './artistaSlug'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#B3202F'

// Confirmación de correo (2026-08-05) — a donde llega el link que manda
// el panel al registrarse (ver POST /api/artistas-solicitud). Activa el
// perfil automáticamente al cargar esta página — es el único filtro
// anti-spam del registro gratis, reemplaza la aprobación manual de Jose.
export async function loader({ request }) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token) return { ok: false, error: 'Falta el enlace de confirmación.' }
  try {
    const res = await fetch(`${PANEL_URL}/api/artistas-verificar?token=${encodeURIComponent(token)}`)
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data.error || 'No pudimos confirmar tu correo.' }
    return { ok: true, id: data.id, nombre: data.nombre }
  } catch {
    return { ok: false, error: 'No pudimos confirmar tu correo — intenta de nuevo en un momento.' }
  }
}

export function meta() {
  return [{ title: 'Confirmación de correo | Tattoo Artist Colombia' }]
}

export default function ArtistaVerificarPage() {
  const { ok, error, id, nombre } = useLoaderData()

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavbarArtistas />
      <div className="flex-1 flex items-center justify-center pt-20 px-4">
        <div className="text-center max-w-sm">
          {ok ? (
            <>
              <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: ACCENT }} />
              <h1 className="text-2xl font-black uppercase mb-3">¡Listo, {nombre}!</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Tu correo quedó confirmado y tu perfil ya está activo en el buscador.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center mt-6">
                <Link
                  to={artistaUrl({ id, nombre })}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: ACCENT }}
                >
                  Ver mi perfil
                </Link>
                <Link
                  to="/tattoo-artist-colombia"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-300 text-gray-600 text-xs font-bold uppercase tracking-widest hover:border-gray-500 transition-colors"
                >
                  Ir al buscador
                </Link>
              </div>
            </>
          ) : (
            <>
              <XCircle size={48} className="mx-auto mb-4 text-gray-400" />
              <h1 className="text-2xl font-black uppercase mb-3">No pudimos confirmarte</h1>
              <p className="text-gray-500 text-sm leading-relaxed">{error}</p>
              <p className="text-gray-400 text-xs mt-4">
                Si el link venció, regístrate de nuevo o escríbenos.
              </p>
              <Link to="/tattoo-artist-colombia/unete" className="inline-block mt-6 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity text-gray-600">
                ← Volver a intentar
              </Link>
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
