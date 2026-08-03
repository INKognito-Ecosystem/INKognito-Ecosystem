import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, ShoppingCart } from 'lucide-react'
// Mismo logo que ya usaba Gym (gris, coherente con el color de marca de
// Suple) — no existe todavía un logo propio subido para el módulo, así
// que se reusa el de Gym mientras tanto (2026-08-02, pedido de Jose:
// "así como estaban en gym").
import logoSuple from '../../assets/milogo/gym.webp'
import AnimatedWordmark from '../AnimatedWordmark'
import InkognitoModuleMenu from '../InkognitoModuleMenu'
import { useSupleCart } from '../../contexts/SupleCartContext'
import CartDrawerSuple from './CartDrawerSuple'

export default function NavbarSuple() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { count } = useSupleCart()

  const close = () => setMenuOpen(false)

  return (
    <>
      {/* shadow-[...] es el mismo "resplandor" que ya usa NavbarSupply.jsx
          bajo su barra (shadow-[0_6px_35px_rgba(59,130,246,0.25)], en azul)
          para separar visualmente el navbar del hero — acá en gris, el
          color propio de Suple (2026-08-03, pedido de Jose). */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-950 border-b border-gray-800 shadow-[0_6px_35px_rgba(158,158,158,0.20)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-16 md:h-20 flex items-center justify-between">

            {/* LOGO */}
            <Link to="/suplementos" className="flex items-center gap-2">
              <img src={logoSuple} alt="INKognito Suple" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
              <span>
                <AnimatedWordmark
                  moduleWord="SUPLE"
                  accentClassName="text-[#9E9E9E]"
                  className="font-black uppercase tracking-wide md:tracking-[0.2em] text-xl md:text-2xl"
                />
                <span className="block text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 whitespace-nowrap">
                  Tienda Online
                </span>
              </span>
            </Link>

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
            <Link to="/suplementos" onClick={close} className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-400 hover:text-white hover:bg-gray-900 transition-all duration-300">
              Inicio
            </Link>
            <div className="border-t border-gray-800 mt-1 pt-1">
              <InkognitoModuleMenu
                current="suple"
                textClassName="text-gray-400 hover:text-white hover:bg-gray-900"
                onNavigate={close}
              />
              <Link to="/" onClick={close} className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-400 hover:text-white hover:bg-gray-900 transition-all duration-300">
                Ecosistema
              </Link>
            </div>
          </div>
        )}
      </nav>

      <CartDrawerSuple open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
