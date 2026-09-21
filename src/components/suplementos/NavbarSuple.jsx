import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, ShoppingCart, Search, Share2, Home, LayoutGrid, Globe, FileText, Shield, Store, PlusCircle, UserCircle } from 'lucide-react'
// Mismo logo que ya usaba Gym (gris, coherente con el color de marca de
// Suple) — no existe todavía un logo propio subido para el módulo, así
// que se reusa el de Gym mientras tanto (2026-08-02, pedido de Jose:
// "así como estaban en gym").
import logoSuple from '../../assets/milogo/gym.webp'
import AnimatedWordmark from '../AnimatedWordmark'
import InkognitoModuleMenu from '../InkognitoModuleMenu'
import LegalModal from '../legal/LegalModal'
import { useSupleCart } from '../../contexts/SupleCartContext'
import { SUPLE_CATEGORIES_ORDER } from '../../data/supleCategoriesOrder'
import { irAMiSuple } from '../../lib/supleTienda'
import CartDrawerSuple from './CartDrawerSuple'

// Navbar superior ÚNICO de Suple, blanco (2026-09-19, migración de Suple a
// fondo blanco) — cubre el home de escritorio Y las páginas internas
// (categorías, ficha, categorías-lista), mismo papel que juntos cumplen
// NavbarStore + NavbarCategoryStore en Store. Todo lo que cambia entre esas
// páginas viene por props opcionales, así no hay dos navbars casi iguales:
//  - pageName: texto centrado en escritorio (sin buscador).
//  - searchValue/onSearchChange/searchPlaceholder: reemplaza pageName por un
//    buscador (también en móvil, donde el logo pierde el wordmark).
//  - shareUrl: botón de compartir (Web Share API, cae a copiar el link).
//  - hideMobileActions: el carrito y la hamburguesa viven en SupleMobileNav
//    abajo, así que en móvil se ocultan acá (mismo criterio que Supply/Store).
//  - hideWordmark: en móvil deja solo el logo para que quepa el buscador.
export default function NavbarSuple({
  pageName = '',
  hideMenu = false,
  hideMobileActions = false,
  hideWordmark = false,
  searchValue = '',
  onSearchChange = null,
  searchPlaceholder = 'Buscar suplementos…',
  shareUrl = '',
}) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [legalOpen, setLegalOpen] = useState(null)
  const [shareMsg, setShareMsg] = useState(null)
  const { count } = useSupleCart()

  const close = () => setMenuOpen(false)

  const compartir = async () => {
    const url = shareUrl || (typeof window !== 'undefined' ? window.location.href : '')
    if (navigator.share) {
      try { await navigator.share({ title: 'INKognito Suple', url }) } catch {}
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setShareMsg('Link copiado')
      setTimeout(() => setShareMsg(null), 2000)
    } catch {}
  }

  const itemClass = 'flex items-center gap-3 w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all duration-300'
  const labelClass = 'px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400'

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-16 md:h-20 flex items-center justify-between gap-3">

            {/* LOGO */}
            <Link to="/suplementos" className="flex items-center gap-2 flex-shrink-0">
              <img src={logoSuple} alt="INKognito Suple" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
              <span className={hideWordmark ? 'hidden md:block' : ''}>
                <AnimatedWordmark
                  moduleWord="SUPLE"
                  accentClassName="text-zinc-500"
                  inkClassName="text-gray-900"
                  className="font-black uppercase tracking-wide md:tracking-[0.2em] text-xl md:text-2xl leading-tight text-gray-900"
                />
                <span className="block text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 whitespace-nowrap">
                  Tienda Online
                </span>
              </span>
            </Link>

            {/* CENTRO — buscador o nombre de página */}
            {onSearchChange ? (
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  autoComplete="off"
                  className="w-full bg-zinc-100 border border-zinc-200 rounded-full pl-10 pr-9 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors"
                />
                {searchValue && (
                  <button
                    onClick={() => onSearchChange('')}
                    aria-label="Limpiar búsqueda"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ) : (
              <span className="hidden md:block uppercase text-sm tracking-[0.2em] text-zinc-500">
                {pageName}
              </span>
            )}

            {/* COMPARTIR + CARRITO + HAMBURGUESA */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {shareUrl && (
                <div className="relative">
                  <button
                    onClick={compartir}
                    aria-label="Compartir"
                    className="text-zinc-500 hover:text-zinc-900 transition-all duration-300"
                  >
                    <Share2 size={20} />
                  </button>
                  {shareMsg && (
                    <p className="absolute right-0 top-full mt-2 bg-zinc-900 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                      {shareMsg}
                    </p>
                  )}
                </div>
              )}
              <div className={`${hideMobileActions ? 'hidden md:flex' : 'flex'} items-center gap-4`}>
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="relative text-zinc-500 hover:text-zinc-900 transition-all duration-300"
                  aria-label="Abrir carrito"
                >
                  <ShoppingCart size={20} />
                  {count > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-zinc-700 text-white text-[9px] font-black flex items-center justify-center px-0.5">
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </button>
                {!hideMenu && (
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Menú"
                    className="text-zinc-500 hover:text-zinc-900 transition-all duration-300"
                  >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DROPDOWN — jerarquía por secciones, mismo criterio que
            NavbarStore.jsx: navegación / categorías / vendedores / Mi
            cuenta/perfil / módulos / Ecosistema y legal. "Proveedores" y "Mi
            cuenta/perfil" se suman acá (Suple multitenant, 2026-09-20). */}
        {!hideMenu && menuOpen && (
          <div className="fixed left-0 right-0 top-16 md:top-20 bg-white border-t border-zinc-200 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <Link to="/suplementos" onClick={close} className={itemClass}>
              <Home size={16} className="flex-shrink-0" /> Inicio Suple
            </Link>
            <Link to="/suplementos/categorias" onClick={close} className={itemClass}>
              <LayoutGrid size={16} className="flex-shrink-0" /> Categorías
            </Link>

            <div className="border-t border-zinc-100" />
            <p className={labelClass}>Categorías</p>
            {SUPLE_CATEGORIES_ORDER.map(c => (
              <Link key={c.slug} to={c.link} onClick={close} className={itemClass}>
                {c.name}
              </Link>
            ))}

            <div className="border-t border-zinc-100" />
            <p className={labelClass}>Proveedores</p>
            <Link to="/suplementos/tiendas" onClick={close} className={itemClass}>
              <Store size={16} className="flex-shrink-0" /> Tiendas verificadas
            </Link>
            <Link to="/suplementos/proveedores/unete" onClick={close} className={itemClass}>
              <PlusCircle size={16} className="flex-shrink-0" /> Registrar mi catálogo
            </Link>

            <div className="border-t border-zinc-100" />
            <p className={labelClass}>Mi cuenta/perfil</p>
            <button type="button" onClick={() => { close(); irAMiSuple(navigate) }} className={itemClass}>
              <UserCircle size={16} className="flex-shrink-0" /> Mi Suple
            </button>

            <div className="border-t border-zinc-100" />
            <InkognitoModuleMenu
              current="suple"
              extraLinks={[{ label: 'INK — encuentra tu tatuador', to: '/tattoo-artist-colombia' }]}
              textClassName="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              onNavigate={close}
            />

            <div className="border-t border-zinc-100" />
            <p className={labelClass}>Ecosistema y legal</p>
            <Link to="/" onClick={close} className={itemClass}>
              <Globe size={16} className="flex-shrink-0" /> Ecosistema
            </Link>
            <button type="button" onClick={() => { close(); setLegalOpen('terminos') }} className={itemClass}>
              <FileText size={16} className="flex-shrink-0" /> Términos
            </button>
            <button type="button" onClick={() => { close(); setLegalOpen('privacidad') }} className={itemClass}>
              <Shield size={16} className="flex-shrink-0" /> Privacidad
            </button>
          </div>
        )}
      </nav>

      <CartDrawerSuple open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <LegalModal type={legalOpen} variant="ecosystem" onClose={() => setLegalOpen(null)} />
    </>
  )
}
