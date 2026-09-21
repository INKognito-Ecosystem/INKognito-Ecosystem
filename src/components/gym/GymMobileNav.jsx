import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, LayoutGrid, ShoppingCart, Menu as MenuIcon, X, Globe, FileText, Shield } from 'lucide-react'
import { useGymCart } from '../../contexts/GymCartContext'
import CartDrawerGym from './CartDrawerGym'
import InkognitoModuleMenu from '../InkognitoModuleMenu'
import LegalModal from '../legal/LegalModal'
import { GYM_SECCIONES, gymSeccionHref } from '../../data/gymSecciones'
import logoGym from '../../assets/milogo/gym.webp'

// 2026-09-21 (Jose: Gym pasa a fondo blanco como los demás módulos): variante
// CLARA, calco de SupleMobileNav.jsx — barra blanca, íconos negros y barrita
// grafito (zinc-700) sobre la pestaña activa. Ya no hay variante oscura.
// Tab bar + menú de pantalla completa compartidos por TODAS las páginas de
// Gym System (2026-09-20, Jose: "reemplázalo por el navbar de abajo, como el
// que ya tienen los demás módulos") — mismo criterio que SupplyMobileNav.jsx
// / StoreMobileNav.jsx / SupleMobileNav.jsx: Inicio · Categorías · Carrito ·
// Menú. Gym es oscuro (toda su página lo es), así que va en la variante
// oscura de SupplyMobileNav (barra negra, íconos grises) con el blanco de
// acento — el mismo que ya usa Gym en su navbar y sus botones.
// active: 'inicio' | 'categorias' — qué pestaña queda marcada (barrita
// blanca arriba del ícono).
export default function GymMobileNav({ active = null }) {
  const { count } = useGymCart()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [legalOpen, setLegalOpen] = useState(null)

  const marca = (key) => (
    active === key ? <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-zinc-700" /> : null
  )

  const itemMenu = 'flex items-center gap-3 px-6 py-4 text-[15px] font-medium text-zinc-800'
  const etiqueta = 'px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400'

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center bg-white/95 backdrop-blur-md border-t border-zinc-200 py-2.5">
        <Link to="/gym" className="relative flex flex-col items-center gap-1 text-black">
          {marca('inicio')}
          <Home size={19} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Inicio</span>
        </Link>
        <Link to="/gym/categorias" className="relative flex flex-col items-center gap-1 text-black">
          {marca('categorias')}
          <LayoutGrid size={19} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Categorías</span>
        </Link>
        <button onClick={() => setDrawerOpen(true)} className="relative flex flex-col items-center gap-1 text-black">
          <ShoppingCart size={19} />
          {count > 0 && (
            <span className="absolute -top-1 right-1 w-3.5 h-3.5 rounded-full bg-zinc-700 text-white text-[8px] font-black flex items-center justify-center">
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

      <CartDrawerGym open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <img src={logoGym} alt="INKognito Gym System" className="w-12 h-12 object-contain" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-900">Menú</span>
            </div>
            <button onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" className="text-zinc-500 p-1"><X size={22} /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <p className={etiqueta}>Categorías</p>
            {GYM_SECCIONES.map(s => {
              const Icon = s.icon
              return (
                <Link key={s.titulo} to={gymSeccionHref(s)} onClick={() => setMenuOpen(false)} className={itemMenu}>
                  <Icon size={18} className="flex-shrink-0" />
                  {s.titulo}
                </Link>
              )
            })}

            <div className="border-t border-zinc-100" />
            <InkognitoModuleMenu current="gym" extraLinks={[{ label: 'INK — encuentra tu tatuador', to: '/tattoo-artist-colombia' }]} uppercase={false} textSize="text-[15px]" textClassName="text-zinc-800 font-medium" icon={LayoutGrid} onNavigate={() => setMenuOpen(false)} />

            <div className="border-t border-zinc-100" />
            <p className={etiqueta}>Ecosistema y legal</p>
            <Link to="/" onClick={() => setMenuOpen(false)} className={itemMenu}>
              <Globe size={18} className="flex-shrink-0" />
              Ecosistema
            </Link>
            <button type="button" onClick={() => { setMenuOpen(false); setLegalOpen('terminos') }} className={`${itemMenu} w-full text-left`}>
              <FileText size={18} className="flex-shrink-0" />
              Términos
            </button>
            <button type="button" onClick={() => { setMenuOpen(false); setLegalOpen('privacidad') }} className={`${itemMenu} w-full text-left`}>
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
