import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, Dumbbell, ShoppingCart } from 'lucide-react'
import logoGym from '../../assets/milogo/gym.webp'
import { useGymCart } from '../../contexts/GymCartContext'
import CartDrawerGym from './CartDrawerGym'

const LINK = 'uppercase text-sm tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300'
const MOBILE_LINK = 'block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-400 hover:text-white hover:bg-gray-900 transition-all duration-300'
const MOBILE_BTN  = 'block w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-400 hover:text-white hover:bg-gray-900 transition-all duration-300 bg-transparent border-none cursor-pointer'

export default function NavbarGym() {
  const [menuOpen, setMenuOpen]   = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate   = useNavigate()
  const { pathname } = useLocation()
  const { count }  = useGymCart()

  const goToPlanos = () => {
    setMenuOpen(false)
    if (pathname === '/gym') {
      document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/gym')
      setTimeout(() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' }), 400)
    }
  }

  const close = () => setMenuOpen(false)

  return (
    <>
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
              <Link to="/gym/maquinas-pedido" className={LINK}>Máquinas</Link>
              <button onClick={goToPlanos} className={LINK}>Planos</button>
              <Link to="/gym/suplementos" className={LINK}>Suplementos</Link>
              <Link to="/gym/tutoriales" className={LINK}>Tutoriales</Link>
              <Link to="/gym/cursos" className={LINK}>Cursos</Link>
              <Link to="/gym/recursos" className={LINK}>Recursos</Link>
            </div>

            {/* CARRITO + HAMBURGUESA */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDrawerOpen(true)}
                className="relative text-gray-400 hover:text-white transition-all duration-300"
                aria-label="Abrir carrito"
              >
                <ShoppingCart size={20} />
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-white text-gray-950 text-[9px] font-black flex items-center justify-center px-0.5">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>
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
            <Link to="/gym"                 onClick={close} className={MOBILE_LINK}>Inicio</Link>
            <Link to="/gym/maquinas-pedido" onClick={close} className={MOBILE_LINK}>Máquinas</Link>
            <button                         onClick={goToPlanos} className={MOBILE_BTN}>Planos</button>
            <Link to="/gym/suplementos"     onClick={close} className={MOBILE_LINK}>Suplementos</Link>
            <Link to="/gym/tutoriales"      onClick={close} className={MOBILE_LINK}>Tutoriales</Link>
            <Link to="/gym/cursos"          onClick={close} className={MOBILE_LINK}>Cursos</Link>
            <Link to="/gym/recursos"        onClick={close} className={MOBILE_LINK}>Recursos</Link>
            <div className="border-t border-gray-800 mt-1 pt-1">
              <Link to="/jhumaneztattoo" onClick={close} className={MOBILE_LINK}>JHumanezTattoo</Link>
              <Link to="/supply"         onClick={close} className={MOBILE_LINK}>INKognito Supply</Link>
              <Link to="/store"          onClick={close} className={MOBILE_LINK}>INKognito Store</Link>
              <Link to="/"               onClick={close} className={MOBILE_LINK}>Ecosistema</Link>
            </div>
          </div>
        )}
      </nav>

      <CartDrawerGym open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
