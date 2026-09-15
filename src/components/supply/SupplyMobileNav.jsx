import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, LayoutGrid, ShoppingCart, Menu as MenuIcon, X, Store, PlusCircle, GraduationCap, Globe } from 'lucide-react'
import { useSupplyCart } from '../../contexts/SupplyCartContext'
import CartDrawerSupply from './CartDrawerSupply'
import InkognitoModuleMenu from '../InkognitoModuleMenu'
import logoSupply from '../../assets/milogo/supply.webp'

// Tab bar + menú de pantalla completa para páginas de Supply DISTINTAS al
// home (categorías, marcas, etc.) — 2026-09-15, mismo patrón visual que ya
// se construyó y validó en MobileHomeSupply.jsx, pero navegando por Link en
// vez de scrollIntoView (acá no estamos ya en /supply, hay que ir ahí).
// Piloto en Cartuchos (CartridgesPage → SupplyCategoryPage.jsx, componente
// compartido por TODAS las categorías) antes de confirmar el resto.
// light (2026-09-15, Jose: "ambos navbar blancos, iconos azules") — default
// false para no tocar las demás categorías.
export default function SupplyMobileNav({ active = null, light = false }) {
  const { count } = useSupplyCart()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Íconos negros por default (2026-09-15, Jose: "azul será cuando el
  // carrito tenga una notificación de algo agregado") — el azul queda
  // reservado para el badge de cantidad del carrito, no como color de
  // pestaña activa.
  const tab = () => (light ? 'text-black' : 'text-zinc-500')
  const barBg = light ? 'bg-white/95' : 'bg-black/95'
  const barBorder = light ? 'border-blue-500/20' : 'border-blue-500/20'
  const cartIconClass = light ? 'text-black' : 'text-zinc-500'
  const menuBg = light ? 'bg-white' : 'bg-zinc-950'
  const menuHeaderBorder = light ? 'border-zinc-200' : 'border-zinc-900'
  const menuText = light ? 'text-zinc-900' : 'text-white'
  const menuItemText = light ? 'text-zinc-800' : 'text-zinc-200'
  const closeIconClass = light ? 'text-zinc-500' : 'text-zinc-400'

  return (
    <>
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center ${barBg} backdrop-blur-md border-t ${barBorder} py-2.5`}>
        <Link to="/supply" className={`flex flex-col items-center gap-1 ${tab('inicio')}`}>
          <Home size={19} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Inicio</span>
        </Link>
        <Link to="/supply/categorias" className={`flex flex-col items-center gap-1 ${tab('categorias')}`}>
          <LayoutGrid size={19} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Categorías</span>
        </Link>
        <button onClick={() => setDrawerOpen(true)} className={`relative flex flex-col items-center gap-1 ${cartIconClass}`}>
          <ShoppingCart size={19} />
          {count > 0 && (
            <span className="absolute -top-1 right-1 w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[8px] font-black flex items-center justify-center">
              {count > 9 ? '9+' : count}
            </span>
          )}
          <span className="text-[9px] font-bold uppercase tracking-wide">Carrito</span>
        </button>
        <button onClick={() => setMenuOpen(true)} className={`flex flex-col items-center gap-1 ${cartIconClass}`}>
          <MenuIcon size={19} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Menú</span>
        </button>
      </div>

      <CartDrawerSupply open={drawerOpen} onClose={() => setDrawerOpen(false)} light={light} />

      {menuOpen && (
        <div className={`md:hidden fixed inset-0 z-50 ${menuBg} flex flex-col`}>
          <div className={`flex-shrink-0 flex items-center justify-between px-5 py-4 border-b ${menuHeaderBorder}`}>
            <div className="flex items-center gap-2">
              <img src={logoSupply} alt="INKognito Supply" className="w-12 h-12 object-contain" />
              <span className={`text-xs font-black uppercase tracking-widest ${menuText}`}>Menú</span>
            </div>
            <button onClick={() => setMenuOpen(false)} className={`${closeIconClass} p-1`}><X size={22} /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Link to="/supply/proveedores" onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 px-6 py-4 text-[15px] font-medium ${menuItemText}`}>
              <Store size={18} className="flex-shrink-0" />
              Tiendas verificadas
            </Link>
            <Link to="/supply/proveedores/unete" onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 px-6 py-4 text-[15px] font-medium ${menuItemText}`}>
              <PlusCircle size={18} className="flex-shrink-0" />
              Registrar mi Supply
            </Link>
            {/* Va a la page de Cursos, no a la sección de la home
                (2026-09-15, Jose) — ahí ya se ve la franja con Kit y
                Recursos al lado, mismo patrón que Categorías. */}
            <Link to="/supply/aprende/cursos" onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 px-6 py-4 text-[15px] font-medium ${menuItemText}`}>
              <GraduationCap size={18} className="flex-shrink-0" />
              Educación para el artista
            </Link>
            <InkognitoModuleMenu current="supply" uppercase={false} textSize="text-[15px]" textClassName={`${menuItemText} font-medium`} icon={LayoutGrid} onNavigate={() => setMenuOpen(false)} />
            <Link to="/" onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 px-6 py-4 text-[15px] font-medium ${menuItemText}`}>
              <Globe size={18} className="flex-shrink-0" />
              Ecosistema
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
