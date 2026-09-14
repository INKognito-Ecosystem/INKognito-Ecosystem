import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, LayoutGrid, ShoppingCart, Menu as MenuIcon, X } from 'lucide-react'
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
export default function SupplyMobileNav({ active = null }) {
  const { count } = useSupplyCart()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const tab = (key) => (key === active ? 'text-blue-500' : 'text-zinc-500')

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center bg-black/95 backdrop-blur-md border-t border-blue-500/20 py-2.5">
        <Link to="/supply" className={`flex flex-col items-center gap-1 ${tab('inicio')}`}>
          <Home size={19} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Inicio</span>
        </Link>
        <Link to="/supply#categorias-mobile" className={`flex flex-col items-center gap-1 ${tab('categorias')}`}>
          <LayoutGrid size={19} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Categorías</span>
        </Link>
        <button onClick={() => setDrawerOpen(true)} className="relative flex flex-col items-center gap-1 text-zinc-500">
          <ShoppingCart size={19} />
          {count > 0 && (
            <span className="absolute -top-1 right-1 w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[8px] font-black flex items-center justify-center">
              {count > 9 ? '9+' : count}
            </span>
          )}
          <span className="text-[9px] font-bold uppercase tracking-wide">Carrito</span>
        </button>
        <button onClick={() => setMenuOpen(true)} className="flex flex-col items-center gap-1 text-zinc-500">
          <MenuIcon size={19} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Menú</span>
        </button>
      </div>

      <CartDrawerSupply open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-zinc-950 flex flex-col">
          <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-zinc-900">
            <div className="flex items-center gap-2">
              <img src={logoSupply} alt="INKognito Supply" className="w-12 h-12 object-contain" />
              <span className="text-xs font-black uppercase tracking-widest text-white">Menú</span>
            </div>
            <button onClick={() => setMenuOpen(false)} className="text-zinc-400 p-1"><X size={22} /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Link to="/supply/proveedores" onClick={() => setMenuOpen(false)} className="block px-6 py-5 uppercase text-sm font-bold tracking-[0.2em] text-zinc-300 border-b border-zinc-900">
              Tiendas verificadas
            </Link>
            <Link to="/supply/proveedores/unete" onClick={() => setMenuOpen(false)} className="block px-6 py-5 uppercase text-sm font-bold tracking-[0.2em] text-blue-400 border-b border-zinc-900">
              Registrar mi Supply
            </Link>
            <Link to="/supply#educacion" onClick={() => setMenuOpen(false)} className="block px-6 py-5 uppercase text-sm font-bold tracking-[0.2em] text-zinc-300 border-b border-zinc-900">
              Educación para el artista
            </Link>
            <InkognitoModuleMenu current="supply" textClassName="text-zinc-300 border-b border-zinc-900" onNavigate={() => setMenuOpen(false)} />
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-6 py-5 uppercase text-sm font-bold tracking-[0.2em] text-zinc-300 border-b border-zinc-900">
              Ecosistema
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
