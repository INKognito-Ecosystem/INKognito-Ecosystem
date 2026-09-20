import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import NavbarCategoryStore from './NavbarCategoryStore'
import StoreMobileNav from './StoreMobileNav'
import FooterStore from './FooterStore'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#C9A84C'

// A donde llega "Mi Tienda" cuando este navegador no tiene ninguna tienda
// guardada (ver irAMiTienda en src/lib/storeTienda.js). Propia de Store, a
// propósito NO reusa el formulario de INK (/tattoo-artist-colombia/estudio/
// mi-perfil): esa página carga sola el último token de CUALQUIER módulo
// guardado en el navegador y redirige al que sea, y trae el navbar/footer
// de tatuajes. Acá solo se pide el correo de una tienda de Store — el
// backend filtra por tipo='tienda' (POST /api/estudios-solicitar-edicion).
export function meta() {
  return [
    { title: 'Entrar a mi tienda | INKognito Store' },
    { name: 'robots', content: 'noindex' },
  ]
}

const inputClass = 'w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors'

export default function StoreMiTiendaPage() {
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
        body: JSON.stringify({ email, tipo: 'tienda' }),
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
      <NavbarCategoryStore pageName="Mi tienda" hideMobileActions />

      <div className="flex-1 pt-24 md:pt-28 pb-16 px-4">
        {enviado ? (
          <div className="text-center max-w-sm mx-auto">
            <Mail size={40} className="mx-auto mb-4" style={{ color: ACCENT }} />
            <h1 className="text-xl font-black uppercase mb-3">Revisa tu correo</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Si <strong>{email}</strong> tiene una tienda activa en Store, te mandamos un link para entrar.
            </p>
          </div>
        ) : (
          <div className="max-w-sm mx-auto">
            <h1 className="text-xl font-black uppercase mb-2 text-center">Entra a tu tienda</h1>
            <p className="text-gray-500 text-sm text-center mb-6">
              Escribe el correo con el que registraste tu tienda — te mandamos un link para entrar, sin contraseña.
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
                className="w-full py-3 text-black font-black uppercase tracking-widest rounded-lg hover:brightness-90 transition disabled:opacity-60 text-sm"
                style={{ backgroundColor: ACCENT }}
              >
                {enviando ? 'Enviando...' : 'Mandarme el link'}
              </button>
            </form>
            <p className="text-gray-500 text-xs text-center mt-6">
              ¿Aún no tienes tienda?{' '}
              <Link to="/tattoo-artist-colombia/tienda/unete" className="font-bold underline underline-offset-2 text-gray-700">
                Regístrate
              </Link>
            </p>
          </div>
        )}
      </div>

      <FooterStore />
      <div className="h-16 md:hidden bg-white" />
      <StoreMobileNav active={null} />
    </div>
  )
}
