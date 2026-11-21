import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, LayoutGrid, ShoppingCart, Menu as MenuIcon, Store, PlusCircle, UserCircle, Globe, FileText, Shield, Package } from 'lucide-react'
import { useStoreCart } from '../../contexts/StoreCartContext'
import CartDrawerStore from './CartDrawerStore'
import InkognitoModuleMenu from '../InkognitoModuleMenu'
import LegalModal from '../legal/LegalModal'
import MisComprasPanel from '../pedido/MisComprasPanel'
import logoStore from '../../assets/milogo/store.webp'
import { irAMiTienda } from '../../lib/storeTienda'
import { leerMisCompras } from '../../lib/misCompras'

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
  const [comprasOpen, setComprasOpen] = useState(false)
  // "Mis compras" (2026-09-27, Jose: casi no se podía ver — solo existía en
  // el navbar de escritorio de la portada) — este componente sí es
  // compartido por TODAS las páginas de Store (ver comentario de arriba),
  // así que agregarlo aquí lo deja disponible sin importar desde dónde
  // entre el comprador, a diferencia de NavbarStore.jsx (solo escritorio,
  // solo /store).
  const [misComprasCount, setMisComprasCount] = useState(0)
  useEffect(() => { setMisComprasCount(leerMisCompras().length) }, [])

  const tabColor = (key) => (active === key ? GOLD : '#000')

  return (
    <>
      {/* z-[60] con el menú abierto (2026-11-20, mismo patrón que
          SupplyMobileNav.jsx): la barra queda encima del drawer (z-50) para
          que el botón Menú siga visible y pueda girar/cerrar. */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 ${menuOpen ? 'z-[60]' : 'z-40'} flex justify-around items-center bg-white/95 backdrop-blur-md border-t border-[#C9A84C]/20 py-2.5`}>
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
        {/* 2026-11-20 — mismo giro que EcosystemNavbar/SupplyMobileNav. */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          className="flex flex-col items-center gap-1 text-black"
        >
          <span
            className="inline-flex transition-transform duration-300 ease-in-out"
            style={{ transform: menuOpen ? 'rotate(-90deg)' : 'rotate(0deg)' }}
          >
            <MenuIcon size={19} />
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wide">Menú</span>
        </button>
      </div>

      <CartDrawerStore open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* 2026-11-20 — mismo deslizamiento derecha→izquierda que el menú del
          home del ecosistema: el panel queda montado y entra con
          translate-x. Al cerrar se va a la derecha y deja de recibir clicks. */}
      <div
        aria-hidden={!menuOpen}
        className={`md:hidden fixed inset-0 z-50 bg-white flex flex-col transition-transform duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${menuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'}`}
      >
          <div className="flex-shrink-0 flex items-center px-5 py-4 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <img src={logoStore} alt="INKognito Store" className="w-12 h-12 object-contain" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-900">Menú</span>
            </div>
          </div>
          {/* pb-[70px]: la barra inferior sigue visible encima del menú. */}
          <div className="flex-1 overflow-y-auto pb-[70px]">
            {/* Distinto de "Mi cuenta/perfil" de abajo (ese es para el
                DUEÑO de la tienda) — esta sección es para el COMPRADOR,
                mismo criterio que MisComprasPanel.jsx. */}
            {misComprasCount > 0 && (
              <>
                <p className="px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400">Tus compras</p>
                <button type="button" onClick={() => { setMenuOpen(false); setComprasOpen(true) }} className="flex items-center gap-3 w-full text-left px-6 py-4 text-[15px] font-medium text-zinc-800">
                  <Package size={18} className="flex-shrink-0" />
                  Mis compras
                </button>
                <div className="border-t border-zinc-100" />
              </>
            )}
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

      <LegalModal type={legalOpen} variant="ecosystem" onClose={() => setLegalOpen(null)} />
      <MisComprasPanel open={comprasOpen} onClose={() => setComprasOpen(false)} />
    </>
  )
}
