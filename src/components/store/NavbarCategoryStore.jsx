import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ShoppingCart, Menu, X, LayoutGrid, Store, PlusCircle, UserCircle, Globe, FileText, Shield } from 'lucide-react'
import { useStoreCart } from '../../contexts/StoreCartContext'
import CartDrawerStore from './CartDrawerStore'
import logoStore from '../../assets/milogo/store.webp'
import AnimatedWordmark from '../AnimatedWordmark'
import InkognitoModuleMenu from '../InkognitoModuleMenu'
import LegalModal from '../legal/LegalModal'

// hideMenu (2026-08-30, Jose; corregido 2026-09-13) — el catálogo de una
// tienda (EstudioTiendaPage.jsx) ya tiene su propio botón de gestión en el
// hero (solo el dueño lo ve). Al principio se ocultaba el menú genérico
// SIEMPRE en esa página, pero eso también lo escondía para un visitante
// normal que llega buscando desde el módulo — debe ver la navegación de
// siempre. Ahora EstudioTiendaPage.jsx pasa hideMenu={esDueno}: solo se
// oculta cuando quien mira la página es de verdad el dueño (token
// verificado), momento en el que su propio botón de gestión reemplaza al
// menú genérico en vez de competir con él.
//
// Blanco + jerarquía + Mi cuenta/perfil (2026-09-16, Jose: "actualizar
// todos los navbar de las pages que tengan que ver con store") — mismo
// tratamiento que ya recibió NavbarStore.jsx: este es el navbar compartido
// por las 7 páginas de categoría, el directorio de tiendas y la ficha de
// una tienda — un solo cambio acá cubre todas.
export default function NavbarCategoryStore({ pageName, hideMenu = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [legalOpen, setLegalOpen] = useState(null)
  const { count } = useStoreCart()

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-16 md:h-20 flex items-center justify-between">

            {/* LOGO */}
            <Link to="/store" className="flex items-center gap-2">
              <img src={logoStore} alt="INKognito Store" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
              <span>
                <AnimatedWordmark
                  moduleWord="STORE"
                  accentClassName="text-[#C9A84C]"
                  inkClassName="text-gray-900"
                  className="text-xl md:text-2xl font-black uppercase tracking-wide md:tracking-[0.2em] leading-tight text-gray-900"
                />
                <span className="block text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 whitespace-nowrap">
                  Tienda Online
                </span>
              </span>
            </Link>

            {/* NOMBRE DE PÁGINA */}
            <span className="hidden md:block uppercase text-sm tracking-[0.2em] text-zinc-500">
              {pageName}
            </span>

            {/* CARRITO + HAMBURGUESA */}
            <div className="flex items-center gap-4">

              {/* CARRITO CON BADGE DORADO */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="relative text-zinc-500 hover:text-[#C9A84C] transition-all duration-300"
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

              {!hideMenu && (
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-zinc-500 hover:text-[#C9A84C] transition-all duration-300"
                >
                  {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              )}
            </div>

          </div>
        </div>

        {/* DROPDOWN — jerarquía por secciones (2026-09-16), mismo criterio
            que NavbarStore.jsx: Tiendas / Mi cuenta/perfil / módulos /
            Ecosistema y legal. */}
        {!hideMenu && menuOpen && (
          <div className="fixed left-0 right-0 top-16 md:top-20 bg-white border-t border-zinc-200 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <Link to="/store" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-500 hover:text-[#C9A84C] hover:bg-zinc-50 transition-all duration-300">
              <Store size={16} className="flex-shrink-0" /> Inicio Store
            </Link>
            <Link to="/store/categorias" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-500 hover:text-[#C9A84C] hover:bg-zinc-50 transition-all duration-300">
              <LayoutGrid size={16} className="flex-shrink-0" /> Categorías
            </Link>

            <div className="border-t border-zinc-100" />
            <p className="px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Tiendas</p>
            <Link to="/store/tiendas" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-500 hover:text-[#C9A84C] hover:bg-zinc-50 transition-all duration-300">
              <Store size={16} className="flex-shrink-0" /> Tiendas verificadas
            </Link>
            <Link to="/tattoo-artist-colombia/tienda/unete" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-500 hover:text-[#C9A84C] hover:bg-zinc-50 transition-all duration-300">
              <PlusCircle size={16} className="flex-shrink-0" /> Registrar mi tienda
            </Link>

            <div className="border-t border-zinc-100" />
            <p className="px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Mi cuenta/perfil</p>
            <Link to="/tattoo-artist-colombia/estudio/mi-perfil" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-500 hover:text-[#C9A84C] hover:bg-zinc-50 transition-all duration-300">
              <UserCircle size={16} className="flex-shrink-0" /> Tienda
            </Link>

            <div className="border-t border-zinc-100" />
            <InkognitoModuleMenu
              current="store"
              only={['supply']}
              extraLinks={[{ label: 'INK — encuentra tu tatuador', to: '/tattoo-artist-colombia' }]}
              textClassName="text-zinc-500 hover:text-[#C9A84C] hover:bg-zinc-50"
              onNavigate={() => setMenuOpen(false)}
            />

            <div className="border-t border-zinc-100" />
            <p className="px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Ecosistema y legal</p>
            <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-500 hover:text-[#C9A84C] hover:bg-zinc-50 transition-all duration-300">
              <Globe size={16} className="flex-shrink-0" /> Ecosistema
            </Link>
            <button type="button" onClick={() => { setMenuOpen(false); setLegalOpen('terminos') }} className="flex items-center gap-3 w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-500 hover:text-[#C9A84C] hover:bg-zinc-50 transition-all duration-300">
              <FileText size={16} className="flex-shrink-0" /> Términos
            </button>
            <button type="button" onClick={() => { setMenuOpen(false); setLegalOpen('privacidad') }} className="flex items-center gap-3 w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-500 hover:text-[#C9A84C] hover:bg-zinc-50 transition-all duration-300">
              <Shield size={16} className="flex-shrink-0" /> Privacidad
            </button>
          </div>
        )}
      </nav>

      <CartDrawerStore open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <LegalModal type={legalOpen} variant="ecosystem" onClose={() => setLegalOpen(null)} />
    </>
  )
}
