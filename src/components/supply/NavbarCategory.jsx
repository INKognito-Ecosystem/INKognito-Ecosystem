import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useSupplyCart } from '../../contexts/SupplyCartContext'
import CartDrawerSupply from './CartDrawerSupply'
import logoSupply from '../../assets/milogo/supply.webp'

export default function NavbarCategory({ pageName }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { count } = useSupplyCart()

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-16 md:h-20 flex items-center justify-between">

            {/* LOGO */}
            <Link to="/supply" className="flex items-center gap-2">
              <img src={logoSupply} alt="INKognito Supply" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
              <span className="text-base md:text-2xl font-black uppercase tracking-wide md:tracking-[0.2em] whitespace-nowrap">
                <span className="text-white">INK</span>
                <span className="text-zinc-500">OGNITO SUPPLY</span>
              </span>
            </Link>

            {/* NOMBRE PÁGINA */}
            <span className="hidden md:block uppercase text-sm tracking-[0.2em] text-zinc-400">
              {pageName}
            </span>

            {/* CARRITO + HAMBURGUESA */}
            <div className="flex items-center gap-4">

              {/* CARRITO CON BADGE */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="relative text-zinc-400 hover:text-white transition-all duration-300"
              >
                <ShoppingCart size={20} />
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-blue-500 text-white text-[9px] font-black flex items-center justify-center px-0.5">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-zinc-400 hover:text-white transition-all duration-300"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>

        {/* MENÚ DESPLEGABLE */}
        {menuOpen && (
          <div className="absolute right-4 top-16 md:top-20 bg-black border border-zinc-800 w-56 z-50">
            <Link to="/supply" onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
              Inicio
            </Link>
            <Link to="/supply#categorias" onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
              Categorías
            </Link>
            <Link to="/supply#marcas" onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
              Marcas
            </Link>
            <Link to="/supply#destacados" onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
              Destacados
            </Link>
            <button onClick={() => { scrollTo('contacto'); setMenuOpen(false) }}
              className="block w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
              Contacto
            </button>
            <Link to="/jhumaneztattoo" onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
              JHumanezTattoo
            </Link>
            <Link to="/store" onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
              INKognito Store
            </Link>
            <Link to="/" onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
              Ecosistema
            </Link>
          </div>
        )}
      </nav>

      <CartDrawerSupply open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
