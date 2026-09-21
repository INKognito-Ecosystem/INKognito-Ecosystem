import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, LayoutGrid, ShoppingCart, Menu as MenuIcon, X, Store, PlusCircle, UserCircle, Globe, FileText, Shield } from 'lucide-react'
import { useStoreCart } from '../../contexts/StoreCartContext'
import CartDrawerStore from './CartDrawerStore'
import InkognitoModuleMenu from '../InkognitoModuleMenu'
import LegalModal from '../legal/LegalModal'
import logoStore from '../../assets/milogo/store.webp'
import { irAMiTienda } from '../../lib/storeTienda'

const GOLD = '#C9A84C'

// Tab bar + menú de pantalla completa compartidos por TODAS las páginas de
// Store (2026-09-16) — extraído de MobileHomeStore.jsx para que la nueva
// página de categorías (StoreCategoriasPage.jsx) y cualquier otra página no-
// home puedan usar el mismo navbar inferior, mismo criterio que ya resolvió
// esto en Supply (SupplyMobileNav.jsx, separado de MobileHomeSupply.jsx).
// active: 'inicio' | 'categorias' — qué pestaña queda resaltada.
export default function StoreMobileNav({ active = null }) {
  const navigate = useNavigate()
  const { count } = useStoreCart()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [legalOpen, setLegalOpen] = useState(null)

  const tabColor = (key) => (active === key ? GOLD : '#000')

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center bg-white/95 backdrop-blur-md border-t border-[#C9A84C]/20 py-2.5">
        <Link to="/store" prefetch="viewport" className="flex flex-col items-center gap-1" style={{ color: tabColor('inicio') }}>
          <Home size={19} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Inicio</span>
        </Link>
        <Link to="/store/categorias" prefetch="viewport" className="flex flex-col items-center gap-1" style={{ color: tabColor('categorias') }}>
          <LayoutGrid size={19} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Categorías</span>
        </Link>
        <button onClick={() => setDrawerOpen(true)} className="relative flex flex-col items-center gap-1 text-black">
          <ShoppingCart size={19} />
          {count > 0 && (
            <span className="absolute -top-1 right-1 w-3.5 h-3.5 rounded-full text-white text-[8px] font-black flex items-center justify-center" style={{ backgroundColor: GOLD }}>
              {count > 9 ? '9+' : count}
            </span>
          )}
          <span className="text-[9px] font-bold uppercase tracking-wide">Carrito</span>
        </button>
        <button onClick={() => setMenuOpen(true)} className="flex flex-col items-center gap-1 text-black">
          <MenuIcon size={19} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Menú</span>
        </button>
      </div>

      <CartDrawerStore open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <img src={logoStore} alt="INKognito Store" className="w-12 h-12 object-contain" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-900">Menú</span>
            </div>
            <button onClick={() => setMenuOpen(false)} className="text-zinc-500 p-1"><X size={22} /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <p className="px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400">Tiendas</p>
            <Link to="/store/tiendas" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 text-[15px] font-medium text-zinc-800">
              <Store size={18} className="flex-shrink-0" />
              Tiendas verificadas
            </Link>
            <Link to="/tattoo-artist-colombia/tienda/unete" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 text-[15px] font-medium text-zinc-800">
              <PlusCircle size={18} className="flex-shrink-0" />
              Registrar mi tienda
            </Link>

            <div className="border-t border-zinc-100" />
            {/* Mi cuenta/perfil (2026-09-16, Jose: "también en el hamburguesa
                debería estar el ítem cuenta/perfil, que conecta para los que
                tienen tienda, de allí pueda gestionar y editar su tienda") —
                irAMiTienda revisa si ya hay una tienda con token guardado en
                este navegador y la abre directo con su botón de gestión; si
                no, abre su formulario de correo propio — ver storeTienda.js. */}
            <p className="px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400">Mi cuenta/perfil</p>
            <button type="button" onClick={() => { setMenuOpen(false); irAMiTienda(navigate) }} className="flex items-center gap-3 w-full text-left px-6 py-4 text-[15px] font-medium text-zinc-800">
              <UserCircle size={18} className="flex-shrink-0" />
              Mi Tienda
            </button>

            <div className="border-t border-zinc-100" />
            <InkognitoModuleMenu current="store" only={['supply']} extraLinks={[{ label: 'INK — encuentra tu tatuador', to: '/tattoo-artist-colombia' }]} uppercase={false} textSize="text-[15px]" textClassName="text-zinc-800 font-medium" icon={LayoutGrid} onNavigate={() => setMenuOpen(false)} />

            <div className="border-t border-zinc-100" />
            <p className="px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400">Ecosistema y legal</p>
            <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 text-[15px] font-medium text-zinc-800">
              <Globe size={18} className="flex-shrink-0" />
              Ecosistema
            </Link>
            <button type="button" onClick={() => { setMenuOpen(false); setLegalOpen('terminos') }} className="flex items-center gap-3 w-full text-left px-6 py-4 text-[15px] font-medium text-zinc-800">
              <FileText size={18} className="flex-shrink-0" />
              Términos
            </button>
            <button type="button" onClick={() => { setMenuOpen(false); setLegalOpen('privacidad') }} className="flex items-center gap-3 w-full text-left px-6 py-4 text-[15px] font-medium text-zinc-800">
              <Shield size={18} className="flex-shrink-0" />
              Privacidad
            </button>
          </div>
        </div>
      )}

      <LegalModal type={legalOpen} variant="ecosystem" onClose={() => setLegalOpen(null)} />
    </>
  )
}
