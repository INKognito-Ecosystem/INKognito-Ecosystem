import { redirect, useLoaderData } from 'react-router-dom'
import { XCircle } from 'lucide-react'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Confirmación de correo de transportadora — "Ruta del Golfo" (2026-08-30).
// Mismo patrón que EstudioVerificarPage.jsx: a donde llega el link que
// manda el panel al registrarse (POST /api/transportadoras-solicitud).
// A diferencia de una tienda, esto NO activa el perfil (activo se queda
// en false hasta que Jose lo revise) — solo confirma el correo y redirige
// directo al panel con el token de edición.
export async function loader({ request }) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token) return { ok: false, error: 'Falta el enlace de confirmación.' }
  try {
    const res = await fetch(`${PANEL_URL}/api/transportadoras-verificar?token=${encodeURIComponent(token)}`)
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data.error || 'No pudimos confirmar el correo.' }
    return redirect(`/transportadoras/mi-panel?token=${encodeURIComponent(data.tokenEdicion)}&bienvenida=1`)
  } catch {
    return { ok: false, error: 'No pudimos confirmar el correo — intenta de nuevo en un momento.' }
  }
}

export function meta() {
  return [{ title: 'Confirmación de correo | Ruta del Golfo' }]
}

export default function TransportadoraVerificarPage() {
  const { error } = useLoaderData()

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <div className="border-b border-gray-200 px-4 py-4 text-center">
        <p className="font-black uppercase tracking-[0.15em] text-sm" style={{ color: '#0057D9' }}>Ruta del Golfo</p>
      </div>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <XCircle size={48} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-black uppercase mb-3">No pudimos confirmarte</h1>
          <p className="text-gray-500 text-sm leading-relaxed">{error}</p>
        </div>
      </div>
      <footer className="border-t border-gray-200 py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-400 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} Ruta del Golfo — Todos los derechos reservados.</p>
          <span className="text-gray-300">Desarrollado por INKognito</span>
        </div>
      </footer>
    </div>
  )
}
