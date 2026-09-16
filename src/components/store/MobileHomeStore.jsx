import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, Home, LayoutGrid, ShoppingCart, Menu as MenuIcon, X, Store, PlusCircle, Globe, FileText, Shield } from 'lucide-react'
import { categories } from '../../data/storeCategories.jsx'
import StoreProductCard from './StoreProductCard'
import CartDrawerStore from './CartDrawerStore'
import InkognitoModuleMenu from '../InkognitoModuleMenu'
import LegalModal from '../legal/LegalModal'
import { useStoreCart } from '../../contexts/StoreCartContext'
import { fetchCatalogPage, toProdCard } from '../../hooks/useCatalog'
import logoStore from '../../assets/milogo/store.webp'

const GOLD = '#C9A84C'
const SHOE_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44']
const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function toCard(item) {
  const prod = toProdCard(item)
  const sizes = item.variantes.map(v => v.variant).filter(Boolean)
  const isClothing = item.descripcion?.toLowerCase().includes('ropa') || item.name?.toLowerCase().includes('ropa')
  return { prod, sizes: sizes.length ? sizes : (isClothing ? CLOTHING_SIZES : SHOE_SIZES) }
}

// Home móvil de Store en formato marketplace (2026-09-16, Jose: "usaremos
// la misma lógica que aplicamos en Supply e INK") — mismo patrón que
// MobileHomeSupply.jsx (topbar con buscador, listón de categorías, banner,
// grid, tab bar inferior fijo, menú jerárquico a pantalla completa), pero
// con la paleta dorada de Store y SIN duplicar lo que Store ya tenía en
// blanco (cards, footer): reemplaza SOLO el navbar+hero+categorías+
// destacados de móvil (ver StorePage.jsx, envuelto en hidden md:block). Sin
// "cargar más" a propósito — el desktop tampoco lo tiene en Destacados (es
// una selección curada, no el catálogo completo), así que móvil no inventa
// un comportamiento que el resto de la página no tiene.
export default function MobileHomeStore({ initialProducts = [] }) {
  const { count } = useStoreCart()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [legalOpen, setLegalOpen] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [resultados, setResultados] = useState(null) // null = sin búsqueda activa
  const yaHizoScroll = useRef(false)

  const normaliza = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

  // Mismo criterio que MobileHomeSupply.jsx: busca por nombre de producto Y
  // por categoría (si el texto calza con una de las 7 categorías reales,
  // suma también sus productos completos, no solo los que calzan por nombre).
  useEffect(() => {
    const q = busqueda.trim()
    if (q.length < 2) { setResultados(null); setBuscando(false); yaHizoScroll.current = false; return }
    setBuscando(true)
    const t = setTimeout(async () => {
      const qNorm = normaliza(q)
      const categoriaCoincide = categories.find(c => normaliza(c.name).includes(qNorm))
      const [porNombre, porCategoria] = await Promise.all([
        fetchCatalogPage('store', { q, limit: 12 }),
        categoriaCoincide
          ? fetchCatalogPage('store', { categoria: categoriaCoincide.name, limit: 12 })
          : Promise.resolve({ items: [] }),
      ])
      const mapa = new Map()
      for (const item of [...porCategoria.items, ...porNombre.items]) {
        mapa.set(`${item.name}-${item.estudio_id ?? 'x'}`, item)
      }
      const nuevosResultados = [...mapa.values()]
      setResultados(nuevosResultados)
      setBuscando(false)
      if (nuevosResultados.length > 0 && !yaHizoScroll.current) {
        const el = document.getElementById('grid-mobile-store')
        const bar = document.querySelector('.sticky.top-0')
        if (el) {
          const barH = bar?.getBoundingClientRect().height ?? 0
          const y = el.getBoundingClientRect().top + window.scrollY - barH
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
        yaHizoScroll.current = true
      }
    }, 300)
    return () => clearTimeout(t)
  }, [busqueda])

  const gridItems = resultados ?? initialProducts

  return (
    <div className="md:hidden bg-white text-zinc-900">

      {/* TOP BAR — logo + buscador */}
      <div className="sticky top-0 z-40 flex items-center gap-2 px-4 py-3 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <Link to="/store" className="flex-shrink-0">
          <img src={logoStore} alt="INKognito Store" className="w-12 h-12 object-contain" />
        </Link>
        <div className="flex-1 flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-full px-3 py-2 min-w-0">
          <Search size={14} className="text-zinc-400 flex-shrink-0" />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar ropa, tenis, guayos..."
            className="flex-1 min-w-0 bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
        </div>
      </div>

      {/* CATEGORÍAS — listón dorado (2026-09-16, Jose: "agrega un listón...
          en este caso dorado" — mismo tratamiento que el listón azul de
          MobileHomeSupply.jsx). Texto/borde en negro sobre el dorado, no
          blanco — mismo criterio de contraste que ya usa toda la página en
          sus botones dorados (CTA, badge del carrito, "Agregar al carrito"). */}
      <div className="flex gap-5 overflow-x-auto px-4 py-3" style={{ backgroundColor: GOLD }}>
        <button
          onClick={() => document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' })}
          className={`flex-shrink-0 text-[13px] font-extrabold pb-1.5 border-b-2 whitespace-nowrap ${!resultados ? 'text-black border-black' : 'text-black/50 border-transparent'}`}
        >
          Todos
        </button>
        {categories.map(cat => (
          <Link
            key={cat.id}
            to={cat.link}
            className="flex-shrink-0 text-[13px] font-extrabold text-black/60 pb-1.5 border-b-2 border-transparent whitespace-nowrap"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* BANNER — mismo copy del hero de escritorio (StorePage.jsx), formato
          compacto sin botón CTA, mismo espíritu que el banner de
          MobileHomeSupply.jsx pero en dorado. */}
      <div
        className="mx-2 mt-3 rounded-2xl border border-[#C9A84C]/30 px-4 py-6 relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(145deg,#1c1608,#050505)' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at 88% 28%, rgba(201,168,76,.28), transparent 55%)' }}
        />
        <div className="relative z-10">
          <p className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-[0.3em] mb-2">
            INKognito Store — Urabá, Antioquia
          </p>
          <h2 className="text-lg font-black uppercase leading-[0.95]">
            Ropa & <span className="text-[#C9A84C]">Calzado</span> Para Urabá
          </h2>
          <p className="text-zinc-400 text-[10.5px] mt-2 max-w-[230px] leading-snug">
            Proveedores verificados en Urabá.
          </p>
          {/* Fila de checks en flujo normal, no absoluta (2026-09-16) — el
              título de Store es más corto que el de Supply (de donde se
              copió este banner), así que la posición fija `bottom-[26px]`
              terminaba encima del subtítulo en vez de debajo. */}
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
            {['Réplica premium', 'Pago contraentrega', 'Entrega en Urabá'].map(g => (
              <span key={g} className="flex items-center gap-0.5 text-[7.5px] font-bold text-zinc-300 whitespace-nowrap">
                <span className="text-green-500">✓</span> {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* GRID DE PRODUCTOS — misma selección "Destacados" que ya carga el
          loader de StorePage.jsx; se reemplaza por resultados de búsqueda
          cuando hay una activa. */}
      <div id="grid-mobile-store" className="px-4 mt-8">
        <h2 className="text-lg font-black uppercase mb-3 text-zinc-900">{resultados ? 'Resultados' : 'Destacados'}</h2>
        {buscando ? (
          <p className="text-zinc-500 text-xs">Buscando…</p>
        ) : gridItems.length === 0 ? (
          <p className="text-zinc-500 text-xs">
            {resultados ? 'Ningún producto coincide con tu búsqueda.' : 'Selección en preparación.'}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {gridItems.map(item => {
              const { prod, sizes } = toCard(item)
              return (
                <StoreProductCard
                  key={`${item.name}-${item.estudio_id ?? 'x'}`}
                  product={prod}
                  category={resultados ? (item.categoria || 'store') : 'destacados'}
                  sizes={sizes}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* espacio para que el tab bar fijo no tape el último contenido */}
      <div className="h-20" />

      {/* TAB BAR INFERIOR — Inicio / Categorías / Carrito / Menú, fijo en
          móvil (2026-09-16, Jose: "navbar en la parte inferior del móvil
          fijo") — mismos tokens dorados que el resto de la página. */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center bg-white/95 backdrop-blur-md border-t border-[#C9A84C]/20 py-2.5">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center gap-1" style={{ color: GOLD }}>
          <Home size={19} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Inicio</span>
        </button>
        <button onClick={() => document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' })} className="flex flex-col items-center gap-1 text-black">
          <LayoutGrid size={19} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Categorías</span>
        </button>
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

      {/* MENÚ — pantalla completa, estructura jerárquica (2026-09-16, mismo
          criterio ya usado en Supply/INK: eyebrow + divisores por sección
          en vez de lista plana). */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
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
            {/* only=['supply'] + extraLinks (2026-09-16) — mismo criterio
                recíproco que ya usa Supply (que muestra Store+INK): Store
                muestra Supply+INK. */}
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
    </div>
  )
}
