import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Menu, ShoppingCart, X, Sparkles, LayoutGrid, Tag, Phone, Store, PlusCircle, GraduationCap, Globe, FileText, Shield } from 'lucide-react'
import { useSupplyCart } from '../../contexts/SupplyCartContext'
import CartDrawerSupply from './CartDrawerSupply'
import logoSupply from '../../assets/milogo/supply.webp'
import AnimatedWordmark from '../AnimatedWordmark'
import InkognitoModuleMenu from '../InkognitoModuleMenu'

export default function NavbarSupply() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { count } = useSupplyCart()

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-blue-500/20 shadow-[0_6px_35px_rgba(59,130,246,0.25)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-16 md:h-20 flex items-center justify-between">

            {/* LOGO */}
            <div className="flex items-center gap-2">
              <img src={logoSupply} alt="INKognito Supply" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
              <div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-wide md:tracking-[0.2em] whitespace-nowrap leading-tight">
                  <AnimatedWordmark moduleWord="SUPPLY" accentClassName="text-blue-500" />
                </h1>
                <span className="block text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 whitespace-nowrap">
                  Tienda Online
                </span>
              </div>
            </div>

            {/* MENU DESKTOP */}
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
              <Link to="/supply/proveedores" className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300">
                Tiendas verificadas
              </Link>
              <button onClick={() => scrollTo('contacto-desktop')} className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300">
                Contacto
              </button>
            </div>

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
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {/* DROPDOWN MÓVIL — jerarquía por secciones (2026-09-15, Jose:
                "armalo para los 4, tal como lo hicimos con el home del
                ecosistema y con INK") — este era el más atrasado de los 4
                menús de Supply: lista plana, sin íconos. "Registrar mi
                Supply" y "Educación para el artista" se suman por primera
                vez acá, mismos destinos que ya usa SupplyMobileNav.jsx en
                móvil. Términos/Privacidad nuevos (Jose: "debería ir
                políticas y privacidad... tal como en INK y en el home del
                ecosistema") — Supply no tiene página legal propia, apuntan
                a las mismas /terminos y /privacidad de siempre. */}
            {menuOpen && (
              <div className="fixed left-0 right-0 top-16 md:top-20 bg-black border-t border-zinc-800 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
                <p className="px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600">Explorar</p>
                <button onClick={() => { scrollTo('destacados'); setMenuOpen(false) }}
                  className="flex items-center gap-3 w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
                  <Sparkles size={16} className="flex-shrink-0" /> Destacados
                </button>
                <button onClick={() => { scrollTo('categorias'); setMenuOpen(false) }}
                  className="flex items-center gap-3 w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
                  <LayoutGrid size={16} className="flex-shrink-0" /> Categorías
                </button>
                <button onClick={() => { scrollTo('marcas'); setMenuOpen(false) }}
                  className="flex items-center gap-3 w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
                  <Tag size={16} className="flex-shrink-0" /> Marcas
                </button>
                <button onClick={() => { scrollTo('contacto-desktop'); setMenuOpen(false) }}
                  className="flex items-center gap-3 w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
                  <Phone size={16} className="flex-shrink-0" /> Contacto
                </button>

                <div className="border-t border-zinc-900" />
                <p className="px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600">Proveedores</p>
                <Link to="/supply/proveedores" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
                  <Store size={16} className="flex-shrink-0" /> Tiendas verificadas
                </Link>
                <Link to="/supply/proveedores/unete" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
                  <PlusCircle size={16} className="flex-shrink-0" /> Registrar mi Supply
                </Link>

                <div className="border-t border-zinc-900" />
                <p className="px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600">Aprende</p>
                <Link to="/supply/aprende/cursos" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
                  <GraduationCap size={16} className="flex-shrink-0" /> Educación para el artista
                </Link>

                <div className="border-t border-zinc-900" />
                {/* only=['store'] + extraLinks (2026-09-15, Jose: "el botón
                    inkognito store se llamará Moda y estilo... quitaremos
                    el de suple, lo reemplazaremos por el de INK, pero el
                    buscador debe ir arriba y Moda y estilo abajo") —
                    extraLinks pinta ANTES que la lista de `only`, así que
                    INK queda primero. */}
                <InkognitoModuleMenu
                  current="supply"
                  only={['store']}
                  extraLinks={[{ label: 'INK — encuentra tu tatuador', to: '/tattoo-artist-colombia' }]}
                  textClassName="text-zinc-400 hover:text-white hover:bg-zinc-900"
                  onNavigate={() => setMenuOpen(false)}
                />

                <div className="border-t border-zinc-900" />
                <p className="px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600">Ecosistema y legal</p>
                <Link to="/" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
                  <Globe size={16} className="flex-shrink-0" /> Ecosistema
                </Link>
                <Link to="/terminos" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
                  <FileText size={16} className="flex-shrink-0" /> Términos
                </Link>
                <Link to="/privacidad" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300">
                  <Shield size={16} className="flex-shrink-0" /> Privacidad
                </Link>
              </div>
            )}

          </div>
        </div>
      </nav>

      <CartDrawerSupply open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
