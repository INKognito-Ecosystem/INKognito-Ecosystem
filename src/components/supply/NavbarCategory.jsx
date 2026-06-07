import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ShoppingCart, Menu, X } from 'lucide-react'

export default function NavbarCategory({ pageName }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="h-16 md:h-20 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/supply" className="text-base md:text-2xl font-black uppercase tracking-[0.2em]">
            <span className="text-white">INK</span>
            <span className="text-zinc-500">OGNITO SUPPLY</span>
          </Link>

          {/* NOMBRE PÁGINA */}
          <span className="uppercase text-sm tracking-[0.2em] text-zinc-400">
            {pageName}
          </span>

          {/* CARRITO + HAMBURGUESA */}
          <div className="flex items-center gap-4">
            <button className="text-zinc-400 hover:text-white transition-all duration-300">
              <ShoppingCart size={20} />
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
        <div className="absolute right-4 top-16 md:top-20 bg-black border border-zinc-800 w-48 z-50">
          <Link to="/supply" onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
            Inicio
          </Link>
          <Link
            to="/supply#categorias"
            onClick={() => setMenuOpen(false)}
             className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300"
>
              Categorías
</Link>
          <Link
  to="/supply#marcas"
  onClick={() => setMenuOpen(false)}
  className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300"
>
  Marcas
</Link>
          <Link to="/supply#destacados" onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
            Destacados
          </Link>
          <Link to="/" onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
            Ecosistema
          </Link>
        </div>
      )}
    </nav>
  )
}