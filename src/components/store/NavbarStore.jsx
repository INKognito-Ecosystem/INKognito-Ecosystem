import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Menu, ShoppingCart, X } from 'lucide-react'
import { useStoreCart } from '../../contexts/StoreCartContext'
import CartDrawerStore from './CartDrawerStore'
import logoStore from '../../assets/milogo/store.png'

export default function NavbarStore() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { count } = useStoreCart()

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-16 md:h-20 flex items-center justify-between">

            {/* LOGO */}
            <Link to="/store" className="flex items-center gap-2">
              <img src={logoStore} alt="INKognito Store" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
              <span className="text-xl md:text-2xl font-black uppercase tracking-wide md:tracking-[0.2em] whitespace-nowrap">
                <span className="text-white">INK</span>
                <span className="text-[#C9A84C]">OGNITO STORE</span>
              </span>
            </Link>

            {/* MENU DESKTOP */}
            <div className="hidden md:flex items-center gap-5">
              <button onClick={() => scrollTo('categorias')} className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] transition-all duration-300">
                Categorías
              </button>
              <button onClick={() => scrollTo('destacados')} className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] transition-all duration-300">
                Destacados
              </button>
              <button onClick={() => scrollTo('envios')} className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] transition-all duration-300">
                Envíos
              </button>
              <button onClick={() => scrollTo('contacto')} className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] transition-all duration-300">
                Contacto
              </button>
            </div>

            {/* CARRITO + HAMBURGUESA */}
            <div className="flex items-center gap-4">

              {/* CARRITO CON BADGE DORADO */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="relative text-zinc-400 hover:text-[#C9A84C] transition-all duration-300"
              >
                <ShoppingCart size={20} />
                {count > 0 && (
                  <span
                    className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full text-black text-[9px] font-black flex items-center justify-center px-0.5"
                    style={{ backgroundColor: '#C9A84C' }}
                  >
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-zinc-400 hover:text-[#C9A84C] transition-all duration-300"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {/* DROPDOWN */}
            {menuOpen && (
              <div className="absolute right-4 top-16 md:top-20 bg-black border border-zinc-800 w-56 z-50">
                <button onClick={() => { scrollTo('categorias'); setMenuOpen(false) }} className="block w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] hover:bg-zinc-900 transition-all duration-300">
                  Categorías
                </button>
                <button onClick={() => { scrollTo('destacados'); setMenuOpen(false) }} className="block w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] hover:bg-zinc-900 transition-all duration-300">
                  Destacados
                </button>
                <button onClick={() => { scrollTo('envios'); setMenuOpen(false) }} className="block w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] hover:bg-zinc-900 transition-all duration-300">
                  Envíos
                </button>
                <button onClick={() => { scrollTo('contacto'); setMenuOpen(false) }} className="block w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] hover:bg-zinc-900 transition-all duration-300">
                  Contacto
                </button>
                <Link to="/tattoo" onClick={() => setMenuOpen(false)} className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] hover:bg-zinc-900 transition-all duration-300">
                  JHumanezTattoo
                </Link>
                <Link to="/supply" onClick={() => setMenuOpen(false)} className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] hover:bg-zinc-900 transition-all duration-300">
                  INKognito Supply
                </Link>
                <Link to="/" onClick={() => setMenuOpen(false)} className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] hover:bg-zinc-900 transition-all duration-300">
                  Ecosistema
                </Link>
              </div>
            )}

          </div>
        </div>
      </nav>

      <CartDrawerStore open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
