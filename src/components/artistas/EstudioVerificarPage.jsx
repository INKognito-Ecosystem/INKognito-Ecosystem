import { Link, redirect, useLoaderData } from 'react-router-dom'
import { XCircle } from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Confirmación de correo de estudio — mellizo de ArtistaVerificarPage.jsx.
// A donde llega el link que manda el panel al registrarse (ver
// POST /api/estudios-solicitud). Activa el perfil automáticamente y
// redirige de una vez a /estudio/mi-perfil con el token de edición
// (2026-08-19, mismo arreglo que ArtistaVerificarPage.jsx) — esta vista
// solo se ve si algo salió mal (link vencido/inválido).
export async function loader({ request }) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token) return { ok: false, error: 'Falta el enlace de confirmación.' }
  try {
    const res = await fetch(`${PANEL_URL}/api/estudios-verificar?token=${encodeURIComponent(token)}`)
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data.error || 'No pudimos confirmar el correo.' }
    if (data.tokenEdicion) {
      return redirect(`/tattoo-artist-colombia/estudio/mi-perfil?token=${encodeURIComponent(data.tokenEdicion)}&bienvenida=1`)
    }
    return { ok: true, id: data.id, nombre: data.nombre, tipo: data.tipo }
  } catch {
    return { ok: false, error: 'No pudimos confirmar el correo — intenta de nuevo en un momento.' }
  }
}

export function meta() {
  return [{ title: 'Confirmación de correo | Tattoo Artist Colombia' }]
}

export default function EstudioVerificarPage() {
  const { error } = useLoaderData()

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavbarArtistas />
      <div className="flex-1 flex items-center justify-center pt-20 px-4">
        <div className="text-center max-w-sm">
          <XCircle size={48} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-black uppercase mb-3">No pudimos confirmarte</h1>
          <p className="text-gray-500 text-sm leading-relaxed">{error}</p>
          <Link to="/tattoo-artist-colombia/estudio/unete" className="inline-block mt-6 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity text-gray-600">
            ← Volver a intentar
          </Link>
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
