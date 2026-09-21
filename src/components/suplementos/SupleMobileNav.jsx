import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, LayoutGrid, ShoppingCart, Menu as MenuIcon, X, Globe, FileText, Shield, Store, PlusCircle, UserCircle } from 'lucide-react'
import { useSupleCart } from '../../contexts/SupleCartContext'
import CartDrawerSuple from './CartDrawerSuple'
import InkognitoModuleMenu from '../InkognitoModuleMenu'
import LegalModal from '../legal/LegalModal'
import { SUPLE_CATEGORIES_ORDER } from '../../data/supleCategoriesOrder'
import { CAT_ICONS } from './CategoriesSuple'
import { irAMiSuple } from '../../lib/supleTienda'
import logoSuple from '../../assets/milogo/gym.webp'

// Tab bar + menú de pantalla completa compartidos por TODAS las páginas de
// Suple (2026-09-19, migración de Suple a fondo blanco) — mismo criterio que
// StoreMobileNav.jsx / SupplyMobileNav.jsx: Inicio · Categorías · Carrito ·
// Menú. "Proveedores" y "Mi cuenta/perfil" se suman acá (Suple multitenant,
// 2026-09-20).
// active: 'inicio' | 'categorias' — qué pestaña queda marcada (barrita
// grafito arriba del ícono; todas las pestañas son negras como en Supply).
export default function SupleMobileNav({ active = null }) {
  const navigate = useNavigate()
  const { count } = useSupleCart()
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
        <Link to="/suplementos" prefetch="viewport" className="relative flex flex-col items-center gap-1 text-black">
          {marca('inicio')}
          <Home size={19} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Inicio</span>
        </Link>
        <Link to="/suplementos/categorias" prefetch="viewport" className="relative flex flex-col items-center gap-1 text-black">
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

      <CartDrawerSuple open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <img src={logoSuple} alt="INKognito Suple" className="w-12 h-12 object-contain" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-900">Menú</span>
            </div>
            <button onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" className="text-zinc-500 p-1"><X size={22} /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <p className={etiqueta}>Categorías</p>
            {SUPLE_CATEGORIES_ORDER.map(c => {
              const Icon = CAT_ICONS[c.name]
              return (
                <Link key={c.slug} to={c.link} onClick={() => setMenuOpen(false)} className={itemMenu}>
                  {Icon && <Icon size={18} className="flex-shrink-0" />}
                  {c.name}
                </Link>
              )
            })}

            <div className="border-t border-zinc-100" />
            <p className={etiqueta}>Proveedores</p>
            <Link to="/suplementos/tiendas" onClick={() => setMenuOpen(false)} className={itemMenu}>
              <Store size={18} className="flex-shrink-0" />
              Tiendas verificadas
            </Link>
            <Link to="/suplementos/proveedores/unete" onClick={() => setMenuOpen(false)} className={itemMenu}>
              <PlusCircle size={18} className="flex-shrink-0" />
              Registrar mi catálogo
            </Link>

            <div className="border-t border-zinc-100" />
            <p className={etiqueta}>Mi cuenta/perfil</p>
            <button type="button" onClick={() => { setMenuOpen(false); irAMiSuple(navigate) }} className={`${itemMenu} w-full text-left`}>
              <UserCircle size={18} className="flex-shrink-0" />
              Mi Suple
            </button>

            <div className="border-t border-zinc-100" />
            <InkognitoModuleMenu current="suple" extraLinks={[{ label: 'INK — encuentra tu tatuador', to: '/tattoo-artist-colombia' }]} uppercase={false} textSize="text-[15px]" textClassName="text-zinc-800 font-medium" icon={LayoutGrid} onNavigate={() => setMenuOpen(false)} />

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
