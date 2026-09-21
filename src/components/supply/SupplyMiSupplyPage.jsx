import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import NavbarCategory from './NavbarCategory'
import SupplyMobileNav from './SupplyMobileNav'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#3B82F6'

// A donde llega "Mi Supply" cuando este navegador no tiene ningún catálogo
// de Supply guardado (ver irAMiSupply en src/lib/supplyTienda.js). Propia de
// Supply, a propósito NO reusa el formulario de INK (/tattoo-artist-
// colombia/estudio/mi-perfil): esa página carga sola el último token de
// CUALQUIER módulo guardado en el navegador y redirige al que sea, y trae el
// navbar/footer de tatuajes. Acá solo se pide el correo de quien vende en
// Supply — el backend filtra por vende_supply (POST /api/estudios-
// solicitar-edicion con modulo='supply') y manda el link a su catálogo.
export function meta() {
  return [
    { title: 'Entrar a mi catálogo | INKognito Supply' },
    { name: 'robots', content: 'noindex' },
  ]
}

const inputClass = 'w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors'

export default function SupplyMiSupplyPage() {
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
        body: JSON.stringify({ email, modulo: 'supply' }),
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
      <NavbarCategory pageName="Mi Supply" light hideMobileActions />

      <div className="flex-1 pt-24 md:pt-28 pb-16 px-4">
        {enviado ? (
          <div className="text-center max-w-sm mx-auto">
            <Mail size={40} className="mx-auto mb-4" style={{ color: ACCENT }} />
            <h1 className="text-xl font-black uppercase mb-3">Revisa tu correo</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Si <strong>{email}</strong> tiene un catálogo activo en Supply, te mandamos un link para entrar.
            </p>
          </div>
        ) : (
          <div className="max-w-sm mx-auto">
            <h1 className="text-xl font-black uppercase mb-2 text-center">Entra a tu catálogo</h1>
            <p className="text-gray-500 text-sm text-center mb-6">
              Escribe el correo con el que te registraste en Supply — te mandamos un link para entrar, sin contraseña.
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
                className="w-full py-3 text-white font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 text-sm"
                style={{ backgroundColor: ACCENT }}
              >
                {enviando ? 'Enviando...' : 'Mandarme el link'}
              </button>
            </form>
            <p className="text-gray-500 text-xs text-center mt-6">
              ¿Aún no vendes en Supply?{' '}
              <Link to="/supply/proveedores/unete" className="font-bold underline underline-offset-2 text-gray-700">
                Regístrate
              </Link>
            </p>
          </div>
        )}
      </div>

      <footer className="border-t border-gray-200 py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-400 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} INKognito Supply — Todos los derechos reservados.</p>
          <span className="text-gray-300">Desarrollado por INKognito</span>
        </div>
      </footer>
      <div className="h-16 md:hidden" />
      <SupplyMobileNav active={null} light />
    </div>
  )
}
