import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import NavbarSuple from './NavbarSuple'
import SupleMobileNav from './SupleMobileNav'
import FooterSuple from './FooterSuple'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// A donde llega "Mi Suple" cuando este navegador no tiene ningún catálogo
// guardado (ver irAMiSuple en src/lib/supleTienda.js). Propia de Suple, a
// propósito NO reusa el formulario de INK (/tattoo-artist-colombia/estudio/
// mi-perfil): esa página carga sola el último token de CUALQUIER módulo
// guardado en el navegador y redirige al que sea, y trae el navbar/footer
// de tatuajes. Acá solo se pide el correo de un vendedor de Suple — el
// backend filtra por tipo='suple' (POST /api/estudios-solicitar-edicion).
export function meta() {
  return [
    { title: 'Entrar a mi catálogo | INKognito Suple' },
    { name: 'robots', content: 'noindex' },
  ]
}

const inputClass = 'w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors'

export default function SupleMiCatalogoPage() {
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setEnviando(true)
    try {
      await fetch(`${PANEL_URL}/api/estudios-solicitar-edicion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tipo: 'suple' }),
      })
    } catch {
      // Mismo mensaje de éxito aunque falle la red — no revela si un
      // correo existe o no en la base.
    } finally {
      setEnviando(false)
      setEnviado(true)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavbarSuple pageName="Mi catálogo" hideMobileActions />

      <div className="flex-1 pt-24 md:pt-28 pb-16 px-4">
        {enviado ? (
          <div className="text-center max-w-sm mx-auto">
            <Mail size={40} className="mx-auto mb-4 text-zinc-400" />
            <h1 className="text-xl font-black uppercase mb-3">Revisa tu correo</h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Si <strong>{email}</strong> tiene un catálogo activo en Suple, te mandamos un link para entrar.
            </p>
          </div>
        ) : (
          <div className="max-w-sm mx-auto">
            <h1 className="text-xl font-black uppercase mb-2 text-center">Entra a tu catálogo</h1>
            <p className="text-zinc-500 text-sm text-center mb-6">
              Escribe el correo con el que te registraste — te mandamos un link para entrar, sin contraseña.
            </p>
            <form onSubmit={enviar} className="space-y-3">
              <input
                required
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
              />
              <button
                type="submit"
                disabled={enviando}
                className="w-full py-3 text-white font-black uppercase tracking-widest rounded-lg bg-zinc-700 hover:bg-zinc-800 transition-colors disabled:opacity-60 text-sm"
              >
                {enviando ? 'Enviando...' : 'Mandarme el link'}
              </button>
            </form>
            <p className="text-zinc-500 text-xs text-center mt-6">
              ¿Aún no tienes catálogo?{' '}
              <Link to="/suplementos/proveedores/unete" className="font-bold underline underline-offset-2 text-zinc-700">
                Regístrate
              </Link>
            </p>
          </div>
        )}
      </div>

      <FooterSuple />
      <div className="h-16 md:hidden" />
      <SupleMobileNav active={null} />
    </div>
  )
}
