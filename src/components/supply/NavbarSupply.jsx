import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Menu, ShoppingCart, X } from 'lucide-react'

export default function NavbarSupply() {

  const [menuOpen, setMenuOpen] = useState(false)

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 md:h-20 flex items-center justify-between">

          {/* LOGO */}
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-[0.2em]">
            <span className="text-white">INK</span>
            <span className="text-zinc-500">OGNITO SUPPLY</span>
          </h1>

          {/* MENU */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('destacados')} className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300">
              Destacados
            </button>
            <button onClick={() => scrollTo('categorias')} className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300">
              Categorías
            </button>
            <button onClick={() => scrollTo('marcas')} className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300">
              Marcas
            </button>
            <button className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300">
              Contacto
            </button>
          </div>

          {/* VOLVER */}
          <div className="flex items-center gap-4">

  <button className="text-zinc-400 hover:text-white transition-all duration-300">
    <ShoppingCart size={20} />
  </button>


  <button
    onClick={() => setMenuOpen(!menuOpen)}
className="text-zinc-400 hover:text-white transition-all duration-300"  >
    {menuOpen ? <X size={22} /> : <Menu size={22} />}
  </button>

</div>
{menuOpen && (
  <div className="absolute top-16 right-6 w-64 bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-4 shadow-xl">

    <button
      onClick={() => {
        scrollTo('destacados')
        setMenuOpen(false)
      }}
      className="text-left uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300"
    >
      Destacados
    </button>

    <button
      onClick={() => {
        scrollTo('categorias')
        setMenuOpen(false)
      }}
      className="text-left uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300"
    >
      Categorías
    </button>

    <button
      onClick={() => {
        scrollTo('marcas')
        setMenuOpen(false)
      }}
      className="text-left uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300"
    >
      Marcas
    </button>

    <button
      onClick={() => {
        scrollTo('contacto')
        setMenuOpen(false)
      }}
      className="text-left uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300"
    >
      Contacto
    </button>

    <Link
      to="/"
      onClick={() => setMenuOpen(false)}
      className="uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300"
    >
      Ecosistema
    </Link>

  </div>
)}

        </div>
      </div>
    </nav>
  )
}