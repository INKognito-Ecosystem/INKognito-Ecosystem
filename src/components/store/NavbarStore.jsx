import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Menu, ShoppingCart, X, LayoutGrid, Sparkles, Truck, Phone, Store, PlusCircle, UserCircle, Globe, FileText, Shield } from 'lucide-react'
import { useStoreCart } from '../../contexts/StoreCartContext'
import CartDrawerStore from './CartDrawerStore'
import logoStore from '../../assets/milogo/store.webp'
import AnimatedWordmark from '../AnimatedWordmark'
import InkognitoModuleMenu from '../InkognitoModuleMenu'
import LegalModal from '../legal/LegalModal'

export default function NavbarStore() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  // legalOpen (2026-09-16, mismo patrón que NavbarSupply.jsx) — el modal
  // abre directo donde está el usuario en vez de navegar a /terminos.
  const [legalOpen, setLegalOpen] = useState(null)
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
              <span>
                <AnimatedWordmark
                  moduleWord="STORE"
                  accentClassName="text-[#C9A84C]"
                  className="text-xl md:text-2xl font-black uppercase tracking-wide md:tracking-[0.2em] leading-tight"
                />
                <span className="block text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 whitespace-nowrap">
                  Tienda Online
                </span>
              </span>
            </Link>

            {/* MENU DESKTOP */}
            <div className="hidden md:flex items-center gap-5">
              {/* Link, no scrollTo (2026-09-16) — las 2 cards de categorías
                  se movieron a su propia página (StoreCategoriasPage.jsx),
                  ya no hay id="categorias" en esta page para hacer scroll. */}
              <Link to="/store/categorias" className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] transition-all duration-300">
                Categorías
              </Link>
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

            {/* DROPDOWN — jerarquía por secciones (2026-09-16, Jose: "los
                botones del botón hamburguesa cambiarán y adquieren
                estructura jerárquica como ya hemos hecho" — mismo criterio
                que NavbarSupply.jsx/NavbarArtistas.jsx: eyebrow + divisores
                agrupando por tema en vez de lista plana). Términos/
                Privacidad nuevos acá — Store no tenía página legal propia
                en el navbar de escritorio, apuntan al mismo LegalModal que
                ya usa el resto del ecosistema. */}
            {menuOpen && (
              <div className="fixed left-0 right-0 top-16 md:top-20 bg-black border-t border-zinc-800 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
                <p className="px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600">Explorar</p>
                <Link to="/store/categorias" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] hover:bg-zinc-900 transition-all duration-300">
                  <LayoutGrid size={16} className="flex-shrink-0" /> Categorías
                </Link>
                <button onClick={() => { scrollTo('destacados'); setMenuOpen(false) }}
                  className="flex items-center gap-3 w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] hover:bg-zinc-900 transition-all duration-300">
                  <Sparkles size={16} className="flex-shrink-0" /> Destacados
                </button>
                <button onClick={() => { scrollTo('envios'); setMenuOpen(false) }}
                  className="flex items-center gap-3 w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] hover:bg-zinc-900 transition-all duration-300">
                  <Truck size={16} className="flex-shrink-0" /> Envíos
                </button>
                <button onClick={() => { scrollTo('contacto'); setMenuOpen(false) }}
                  className="flex items-center gap-3 w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] hover:bg-zinc-900 transition-all duration-300">
                  <Phone size={16} className="flex-shrink-0" /> Contacto
                </button>

                <div className="border-t border-zinc-900" />
                <p className="px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600">Tiendas</p>
                <Link to="/store/tiendas" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] hover:bg-zinc-900 transition-all duration-300">
                  <Store size={16} className="flex-shrink-0" /> Tiendas verificadas
                </Link>
                <Link to="/tattoo-artist-colombia/tienda/unete" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] hover:bg-zinc-900 transition-all duration-300">
                  <PlusCircle size={16} className="flex-shrink-0" /> Registrar mi tienda
                </Link>

                <div className="border-t border-zinc-900" />
                {/* Mi cuenta/perfil (2026-09-16, Jose: "también en el
                    hamburguesa debería estar el ítem cuenta/perfil, que
                    conecta para los que tienen tienda, de allí pueda
                    gestionar y editar su tienda") — una tienda Store ES un
                    estudio con tipo='empresa' (ver CLAUDE.md), reusa el
                    mismo /estudio/mi-perfil que ya usa INK para "Estudio". */}
                <p className="px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600">Mi cuenta/perfil</p>
                <Link to="/tattoo-artist-colombia/estudio/mi-perfil" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] hover:bg-zinc-900 transition-all duration-300">
                  <UserCircle size={16} className="flex-shrink-0" /> Tienda
                </Link>

                <div className="border-t border-zinc-900" />
                {/* only=['supply'] + extraLinks (2026-09-16) — mismo
                    criterio recíproco que ya usa Supply (muestra
                    Store+INK): Store muestra Supply+INK. */}
                <InkognitoModuleMenu
                  current="store"
                  only={['supply']}
                  extraLinks={[{ label: 'INK — encuentra tu tatuador', to: '/tattoo-artist-colombia' }]}
                  textClassName="text-zinc-400 hover:text-[#C9A84C] hover:bg-zinc-900"
                  onNavigate={() => setMenuOpen(false)}
                />

                <div className="border-t border-zinc-900" />
                <p className="px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600">Ecosistema y legal</p>
                <Link to="/" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] hover:bg-zinc-900 transition-all duration-300">
                  <Globe size={16} className="flex-shrink-0" /> Ecosistema
                </Link>
                <button type="button" onClick={() => { setMenuOpen(false); setLegalOpen('terminos') }}
                  className="flex items-center gap-3 w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] hover:bg-zinc-900 transition-all duration-300">
                  <FileText size={16} className="flex-shrink-0" /> Términos
                </button>
                <button type="button" onClick={() => { setMenuOpen(false); setLegalOpen('privacidad') }}
                  className="flex items-center gap-3 w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] hover:bg-zinc-900 transition-all duration-300">
                  <Shield size={16} className="flex-shrink-0" /> Privacidad
                </button>
              </div>
            )}

          </div>
        </div>
      </nav>

      <CartDrawerStore open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <LegalModal type={legalOpen} variant="ecosystem" onClose={() => setLegalOpen(null)} />
    </>
  )
}
