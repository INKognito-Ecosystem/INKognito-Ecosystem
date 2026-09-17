import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, LayoutGrid, ShoppingCart, Menu as MenuIcon, X, Store, PlusCircle, GraduationCap, Globe, FileText, Shield, UserCircle } from 'lucide-react'
import { useSupplyCart } from '../../contexts/SupplyCartContext'
import CartDrawerSupply from './CartDrawerSupply'
import InkognitoModuleMenu from '../InkognitoModuleMenu'
import LegalModal from '../legal/LegalModal'
import logoSupply from '../../assets/milogo/supply.webp'
import { irAMiSupply } from '../../lib/supplyTienda'

// Tab bar + menú de pantalla completa para páginas de Supply DISTINTAS al
// home (categorías, marcas, etc.) — 2026-09-15, mismo patrón visual que ya
// se construyó y validó en MobileHomeSupply.jsx, pero navegando por Link en
// vez de scrollIntoView (acá no estamos ya en /supply, hay que ir ahí).
// Piloto en Cartuchos (CartridgesPage → SupplyCategoryPage.jsx, componente
// compartido por TODAS las categorías) antes de confirmar el resto.
// light (2026-09-15, Jose: "ambos navbar blancos, iconos azules") — default
// false para no tocar las demás categorías.
export default function SupplyMobileNav({ active = null, light = false }) {
  const navigate = useNavigate()
  const { count } = useSupplyCart()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  // legalOpen (2026-09-15, Jose: "el modal abre directo donde estoy...
  // blanco... ocupa toda la pantalla" — mismo patrón que EcosystemNavbar.jsx).
  const [legalOpen, setLegalOpen] = useState(null)

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
  // Jerarquía por secciones (2026-09-15, Jose: "armalo para los 4, tal como
  // lo hicimos con el home del ecosistema y con INK") — eyebrow + divisores.
  const menuLabelText = light ? 'text-zinc-400' : 'text-zinc-500'
  const menuDividerBorder = light ? 'border-zinc-100' : 'border-zinc-900'

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
            <p className={`px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.15em] ${menuLabelText}`}>Proveedores</p>
            <Link to="/supply/proveedores" onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 px-6 py-4 text-[15px] font-medium ${menuItemText}`}>
              <Store size={18} className="flex-shrink-0" />
              Tiendas verificadas
            </Link>
            <Link to="/supply/proveedores/unete" onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 px-6 py-4 text-[15px] font-medium ${menuItemText}`}>
              <PlusCircle size={18} className="flex-shrink-0" />
              Registrar mi Supply
            </Link>

            <div className={`border-t ${menuDividerBorder}`} />
            <p className={`px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.15em] ${menuLabelText}`}>Aprende</p>
            {/* Va a la page de Cursos, no a la sección de la home
                (2026-09-15, Jose) — ahí ya se ve la franja con Kit y
                Recursos al lado, mismo patrón que Categorías. */}
            <Link to="/supply/aprende/cursos" onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 px-6 py-4 text-[15px] font-medium ${menuItemText}`}>
              <GraduationCap size={18} className="flex-shrink-0" />
              Educación para el artista
            </Link>

            <div className={`border-t ${menuDividerBorder}`} />
            {/* Mi cuenta/perfil (2026-09-17, Jose: "en el botón hamburguesa
                de supply no veo el ítem de cuenta/perfil, y que este
                también lleve al perfil de quien tiene una tienda
                registrada") — mismo criterio que StoreMobileNav.jsx:
                irAMiSupply revisa si ya hay un Supply con token guardado en
                este navegador y lo abre directo con su botón de gestión; si
                no, cae al flujo de siempre (correo → INK) — ver
                supplyTienda.js. */}
            <p className={`px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.15em] ${menuLabelText}`}>Mi cuenta/perfil</p>
            <button type="button" onClick={() => { setMenuOpen(false); irAMiSupply(navigate) }} className={`flex items-center gap-3 w-full text-left px-6 py-4 text-[15px] font-medium ${menuItemText}`}>
              <UserCircle size={18} className="flex-shrink-0" />
              Mi Supply
            </button>

            <div className={`border-t ${menuDividerBorder}`} />
            {/* only=['store'] + extraLinks (2026-09-15, Jose: "el botón
                inkognito store se llamará Moda y estilo... quitaremos el
                de suple, lo reemplazaremos por el de INK, pero el buscador
                debe ir arriba y Moda y estilo abajo") — extraLinks pinta
                ANTES que la lista de `only`, así que INK queda primero. */}
            <InkognitoModuleMenu current="supply" only={['store']} extraLinks={[{ label: 'INK — encuentra tu tatuador', to: '/tattoo-artist-colombia' }]} uppercase={false} textSize="text-[15px]" textClassName={`${menuItemText} font-medium`} icon={LayoutGrid} onNavigate={() => setMenuOpen(false)} />

            <div className={`border-t ${menuDividerBorder}`} />
            <p className={`px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.15em] ${menuLabelText}`}>Ecosistema y legal</p>
            <Link to="/" onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 px-6 py-4 text-[15px] font-medium ${menuItemText}`}>
              <Globe size={18} className="flex-shrink-0" />
              Ecosistema
            </Link>
            {/* Botones, no Links (2026-09-15) — abren el modal en vez de
                navegar a /terminos //privacidad. */}
            <button type="button" onClick={() => { setMenuOpen(false); setLegalOpen('terminos') }} className={`flex items-center gap-3 w-full text-left px-6 py-4 text-[15px] font-medium ${menuItemText}`}>
              <FileText size={18} className="flex-shrink-0" />
              Términos
            </button>
            <button type="button" onClick={() => { setMenuOpen(false); setLegalOpen('privacidad') }} className={`flex items-center gap-3 w-full text-left px-6 py-4 text-[15px] font-medium ${menuItemText}`}>
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
