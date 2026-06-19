import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, Dumbbell, ShoppingCart } from 'lucide-react'
import logoGym from '../../assets/milogo/gym.webp'

export default function NavbarGym({ cartCount = 0, onCartClick = null }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-950 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 md:h-20 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/gym" className="flex items-center gap-2">
            <img src={logoGym} alt="INKognito Gym" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
            <span className="font-black uppercase tracking-wide md:tracking-[0.2em] text-xl md:text-2xl whitespace-nowrap">
              <span className="text-white">INK</span>
              <span className="text-gray-500">OGNITO </span>
              <span className="text-gray-300">GYM</span>
            </span>
            <Dumbbell size={18} className="text-gray-500" />
          </Link>

          {/* MENÚ DESKTOP */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/gym/maquinas-pedido" className="uppercase text-sm tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300">
              Máquinas
            </Link>
            <Link to="/gym/tutoriales" className="uppercase text-sm tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300">
              Tutoriales
            </Link>
            <Link to="/gym/cursos" className="uppercase text-sm tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300">
              Cursos
            </Link>
          </div>

          {/* CARRITO + HAMBURGUESA */}
          <div className="flex items-center gap-4">
            {onCartClick && (
              <button
                onClick={onCartClick}
                className="relative text-gray-400 hover:text-white transition-all duration-300"
                aria-label="Abrir carrito"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-white text-gray-950 text-[9px] font-black flex items-center justify-center px-0.5">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-400 hover:text-white transition-all duration-300"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* DROPDOWN MÓVIL */}
      {menuOpen && (
        <div className="absolute right-4 top-16 md:top-20 bg-gray-950 border border-gray-700 w-56 z-50">
          <Link to="/gym" onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-400 hover:text-white hover:bg-gray-900 transition-all duration-300">
            Inicio
          </Link>
          <Link to="/gym/maquinas-pedido" onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-400 hover:text-white hover:bg-gray-900 transition-all duration-300">
            Máquinas
          </Link>
          <Link to="/gym/tutoriales" onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-400 hover:text-white hover:bg-gray-900 transition-all duration-300">
            Tutoriales
          </Link>
          <Link to="/gym/cursos" onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-400 hover:text-white hover:bg-gray-900 transition-all duration-300">
            Cursos
          </Link>
          <div className="border-t border-gray-800 mt-1 pt-1">
            <Link to="/jhumaneztattoo" onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-400 hover:text-white hover:bg-gray-900 transition-all duration-300">
              JHumanezTattoo
            </Link>
            <Link to="/supply" onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-400 hover:text-white hover:bg-gray-900 transition-all duration-300">
              INKognito Supply
            </Link>
            <Link to="/store" onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-400 hover:text-white hover:bg-gray-900 transition-all duration-300">
              INKognito Store
            </Link>
            <Link to="/" onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-400 hover:text-white hover:bg-gray-900 transition-all duration-300">
              Ecosistema
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
