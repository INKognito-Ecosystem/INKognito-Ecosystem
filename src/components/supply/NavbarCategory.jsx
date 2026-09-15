import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useSupplyCart } from '../../contexts/SupplyCartContext'
import CartDrawerSupply from './CartDrawerSupply'
import logoSupply from '../../assets/milogo/supply.webp'
import AnimatedWordmark from '../AnimatedWordmark'
import InkognitoModuleMenu from '../InkognitoModuleMenu'

// hideMenu (2026-09-13, Jose) — mismo criterio que NavbarCategoryStore.jsx:
// el catálogo de un proveedor (EstudioSupplyPage.jsx) ya tiene su propio
// botón de gestión en el hero, visible SOLO para el dueño verificado por
// token. EstudioSupplyPage.jsx pasa hideMenu={esDueno} — un visitante
// normal que llega buscando desde el módulo sigue viendo el menú genérico
// de siempre; el menú solo se reemplaza por el botón de gestión cuando de
// verdad es el dueño el que mira la página.
// hideMobileActions (2026-09-15, Jose: "agrégale a las tiendas creadas por
// proveedores el navbar de la parte inferior, y el navbar de arriba solo
// quita el botón navbar y el carrito, pues migrarán al navbar inferior")
// — default false para no tocar Cartuchos/ficha de producto, donde este
// navbar YA está envuelto en `hidden md:block` (nunca se monta en móvil,
// así que ocultar sus botones ahí no cambiaría nada). Pensado para
// páginas como EstudioSupplyPage.jsx que SÍ muestran este navbar en
// cualquier tamaño de pantalla y ahora suman su propio SupplyMobileNav.
// light (2026-09-15, Jose: "el navbar debe ser blanco" — página de
// categorías) — default false para no tocar Cartuchos/ficha de
// producto/EstudioSupplyPage, que siguen con el navbar oscuro de siempre.
export default function NavbarCategory({ pageName, hideMenu = false, hideMobileActions = false, light = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { count } = useSupplyCart()
  const t = light ? {
    navBg: 'bg-white/95', navBorder: 'border-zinc-200', shadow: '',
    pageName: 'text-zinc-500', icon: 'text-zinc-500 hover:text-zinc-900',
    menuBg: 'bg-white', menuBorder: 'border-zinc-200', menuText: 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100',
  } : {
    navBg: 'bg-black/70', navBorder: 'border-blue-500/20', shadow: 'shadow-[0_6px_35px_rgba(59,130,246,0.25)]',
    pageName: 'text-zinc-400', icon: 'text-zinc-400 hover:text-white',
    menuBg: 'bg-black', menuBorder: 'border-zinc-800', menuText: 'text-zinc-400 hover:text-white hover:bg-zinc-900',
  }

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 ${t.navBg} backdrop-blur-md border-b ${t.navBorder} ${t.shadow}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-16 md:h-20 flex items-center justify-between">

            {/* LOGO */}
            <Link to="/supply" className="flex items-center gap-2">
              <img src={logoSupply} alt="INKognito Supply" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
              <span>
                <AnimatedWordmark
                  moduleWord="SUPPLY"
                  accentClassName="text-blue-500"
                  className="text-xl md:text-2xl font-black uppercase tracking-wide md:tracking-[0.2em] leading-tight"
                />
                <span className="block text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 whitespace-nowrap">
                  Tienda Online
                </span>
              </span>
            </Link>

            {/* NOMBRE PÁGINA */}
            <span className={`hidden md:block uppercase text-sm tracking-[0.2em] ${t.pageName}`}>
              {pageName}
            </span>

            {/* CARRITO + HAMBURGUESA */}
            <div className={`${hideMobileActions ? 'hidden md:flex' : 'flex'} items-center gap-4`}>

              {/* CARRITO CON BADGE */}
              <button
                onClick={() => setDrawerOpen(true)}
                className={`relative transition-all duration-300 ${t.icon}`}
              >
                <ShoppingCart size={20} />
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-blue-500 text-white text-[9px] font-black flex items-center justify-center px-0.5">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>

              {!hideMenu && (
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={`transition-all duration-300 ${t.icon}`}
                >
                  {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              )}
            </div>

          </div>
        </div>

        {/* MENÚ DESPLEGABLE */}
        {!hideMenu && menuOpen && (
          <div className={`fixed left-0 right-0 top-16 md:top-20 ${t.menuBg} border-t ${t.menuBorder} z-50 max-h-[calc(100vh-4rem)] overflow-y-auto`}>
            <Link to="/supply" onClick={() => setMenuOpen(false)}
              className={`block px-6 py-4 uppercase text-xs tracking-[0.2em] transition-all duration-300 ${t.menuText}`}>
              Inicio
            </Link>
            <Link to="/supply#categorias" onClick={() => setMenuOpen(false)}
              className={`block px-6 py-4 uppercase text-xs tracking-[0.2em] transition-all duration-300 ${t.menuText}`}>
              Categorías
            </Link>
            <Link to="/supply#marcas" onClick={() => setMenuOpen(false)}
              className={`block px-6 py-4 uppercase text-xs tracking-[0.2em] transition-all duration-300 ${t.menuText}`}>
              Marcas
            </Link>
            <Link to="/supply/proveedores" onClick={() => setMenuOpen(false)}
              className={`block px-6 py-4 uppercase text-xs tracking-[0.2em] transition-all duration-300 ${t.menuText}`}>
              Proveedores
            </Link>
            <Link to="/supply#destacados" onClick={() => setMenuOpen(false)}
              className={`block px-6 py-4 uppercase text-xs tracking-[0.2em] transition-all duration-300 ${t.menuText}`}>
              Destacados
            </Link>
            <button onClick={() => { scrollTo('contacto'); setMenuOpen(false) }}
              className={`block w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] transition-all duration-300 ${t.menuText}`}>
              Contacto
            </button>
            <InkognitoModuleMenu
              current="supply"
              textClassName={t.menuText}
              onNavigate={() => setMenuOpen(false)}
            />
            <Link to="/" onClick={() => setMenuOpen(false)}
              className={`block px-6 py-4 uppercase text-xs tracking-[0.2em] transition-all duration-300 ${t.menuText}`}>
              Ecosistema
            </Link>
          </div>
        )}
      </nav>

      <CartDrawerSupply open={drawerOpen} onClose={() => setDrawerOpen(false)} light={light} />
    </>
  )
}
