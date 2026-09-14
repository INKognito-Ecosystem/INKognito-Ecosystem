import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Bell, Home, LayoutGrid, ShoppingCart, Menu as MenuIcon, X } from 'lucide-react'
import { categories } from './CategoriesSupply'
import BrandsMarquee from './BrandsMarquee'
import SupplyProductCard from './SupplyProductCard'
import CartDrawerSupply from './CartDrawerSupply'
import InkognitoModuleMenu from '../InkognitoModuleMenu'
import { useSupplyCart } from '../../contexts/SupplyCartContext'
import { useLoadMore, fetchCatalogPage } from '../../hooks/useCatalog'
import logoSupply from '../../assets/milogo/supply.webp'

// Home móvil de Supply en formato marketplace (2026-09-14, boceto + mockup
// aprobados por Jose) — reemplaza SOLO en móvil a NavbarSupply/HeroSupply/
// CategoriesSupply/BrandsSupply (que siguen intactos para desktop, ver
// SupplyPage.jsx). Local por ahora, sin push.
//
// Textos del banner y del carrusel de marcas son los MISMOS que ya existen
// en HeroSupply.jsx — Jose fue explícito: no inventar copy nuevo, reusar
// "Professional Tattoo Equipment" y "De un tatuador, para tatuadores."
export default function MobileHomeSupply({ imgs = {}, initialProducts }) {
  const { count } = useSupplyCart()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [resultados, setResultados] = useState(null) // null = sin búsqueda activa

  const { items, hasMore, loading, loadMore } = useLoadMore('supply', {}, initialProducts)

  // Búsqueda global del módulo (todas las categorías a la vez) — mismo
  // debounce de 300ms que ya usa SupplyCategoryPage.jsx, mismo
  // fetchCatalogPage de siempre, sin cursor propio (primera página nada
  // más — la búsqueda por categoría con "cargar más" ya existe en cada
  // página de categoría).
  useEffect(() => {
    const q = busqueda.trim()
    if (q.length < 2) { setResultados(null); return }
    setBuscando(true)
    const t = setTimeout(async () => {
      const page = await fetchCatalogPage('supply', { q, limit: 12 })
      setResultados(page.items)
      setBuscando(false)
    }, 300)
    return () => clearTimeout(t)
  }, [busqueda])

  const gridItems = resultados ?? items

  const scrollToId = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="md:hidden bg-gray-950 text-white">

      {/* TOP BAR — logo + buscador + campana */}
      <div className="sticky top-0 z-40 flex items-center gap-2 px-4 py-3 bg-black/90 backdrop-blur-md border-b border-blue-500/20">
        <Link to="/supply" className="flex-shrink-0">
          <img src={logoSupply} alt="INKognito Supply" className="w-12 h-12 object-contain" />
        </Link>
        <div className="flex-1 flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-full px-3 py-2 min-w-0">
          <Search size={14} className="text-zinc-500 flex-shrink-0" />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar tintas, agujas, máquinas..."
            className="flex-1 min-w-0 bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none"
          />
        </div>
        {/* Campana visual por ahora — Supply no tiene notificaciones todavía */}
        <button className="flex-shrink-0 w-9 h-9 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400">
          <Bell size={16} />
        </button>
      </div>

      {/* CATEGORÍAS — nombre en fila, sin card */}
      <div id="categorias-mobile" className="flex gap-5 overflow-x-auto px-4 py-3 border-b border-zinc-900 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className={`flex-shrink-0 text-[13px] font-extrabold pb-1.5 border-b-2 whitespace-nowrap ${!resultados ? 'text-white border-blue-500' : 'text-zinc-500 border-transparent'}`}>
          Todos
        </span>
        {categories.map(cat => (
          <Link
            key={cat.name}
            to={cat.path}
            className="flex-shrink-0 text-[13px] font-extrabold text-zinc-500 pb-1.5 border-b-2 border-transparent whitespace-nowrap"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* BANNER — más ancho que el resto, texto igual al de HeroSupply.jsx.
          Compacto sin botón CTA (2026-09-14); un poco más alto (2026-09-15). */}
      <div
        className="mx-2 mt-3 rounded-2xl border border-blue-500/30 px-4 py-6 relative overflow-hidden"
        style={{ background: 'radial-gradient(circle at 88% 28%, rgba(59,130,246,.28), transparent 55%), linear-gradient(145deg,#0e1626,#07090d)' }}
      >
        <p className="text-blue-500 text-[9px] font-bold uppercase tracking-[0.3em] mb-2">INKognito Supply — Colombia</p>
        <h2 className="text-lg font-black uppercase leading-[0.95]">
          Professional <span className="text-blue-500">Tattoo</span> Equipment
        </h2>
        <p className="text-zinc-400 text-[10.5px] mt-2 max-w-[230px] leading-snug">
          Ecosistema de distribución de insumos profesionales.
        </p>
        {/* Checks de cobertura/confianza (2026-09-15) — texto completo, en
            una sola fila, alineados a la altura de "profesionales." (2da
            línea del subtítulo), aprovechando el espacio libre a su
            derecha. Posición absoluta: no suma altura al banner. */}
        <div className="absolute right-4 bottom-[26px] left-[108px] flex flex-nowrap justify-between gap-1">
          {['Stock verificado', 'Despacho directo', 'Cobertura nacional'].map(g => (
            <span key={g} className="flex items-center gap-0.5 text-[7.5px] font-bold text-zinc-300 whitespace-nowrap">
              <span className="text-green-500">✓</span> {g}
            </span>
          ))}
        </div>
      </div>

      {/* MARCAS — mismo BrandsMarquee y mismas frases del hero, justo debajo del banner */}
      <div className="mt-6">
        <p className="text-center text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-semibold">
          Marcas referentes en la industria
        </p>
        <BrandsMarquee imgs={imgs} />
        <p className="mt-4 text-center text-xs italic tracking-wide text-zinc-400">
          &ldquo;De un tatuador, para tatuadores.&rdquo;
        </p>
      </div>

      {/* GRID DE PRODUCTOS — paginado real (fetchCatalogPage/useLoadMore) */}
      <div id="grid-mobile" className="px-4 mt-8">
        <h2 className="text-lg font-black uppercase mb-3">{resultados ? 'Resultados' : 'Destacados'}</h2>
        {buscando ? (
          <p className="text-zinc-500 text-xs">Buscando…</p>
        ) : gridItems.length === 0 ? (
          <p className="text-zinc-500 text-xs">Ningún producto coincide con tu búsqueda.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {gridItems.map(item => (
              <SupplyProductCard key={`${item.name}-${item.estudio_id ?? 'x'}`} item={item} categoria={item.categoria} />
            ))}
          </div>
        )}
        {!resultados && hasMore && (
          <div className="flex justify-center mt-5">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-6 py-2.5 border border-blue-500/40 text-blue-400 text-xs font-bold uppercase tracking-[0.15em] rounded hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Cargando…' : 'Cargar más'}
            </button>
          </div>
        )}
      </div>

      {/* espacio para que el tab bar fijo no tape el último contenido */}
      <div className="h-20" />

      {/* TAB BAR INFERIOR — Inicio / Categorías / Carrito / Menú */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center bg-black/95 backdrop-blur-md border-t border-blue-500/20 py-2.5">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center gap-1 text-blue-500">
          <Home size={19} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Inicio</span>
        </button>
        <button onClick={() => scrollToId('categorias-mobile')} className="flex flex-col items-center gap-1 text-zinc-500">
          <LayoutGrid size={19} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Categorías</span>
        </button>
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

      {/* MENÚ — pantalla completa (2026-09-15, antes era un sheet chico que
          dejaba ver el fondo; mismo contenido que el dropdown de NavbarSupply) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col">
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
            <button
              type="button"
              onClick={() => { setMenuOpen(false); scrollToId('educacion') }}
              className="block w-full text-left px-6 py-5 uppercase text-sm font-bold tracking-[0.2em] text-zinc-300 border-b border-zinc-900"
            >
              Educación para el artista
            </button>
            <InkognitoModuleMenu current="supply" textClassName="text-zinc-300 border-b border-zinc-900" onNavigate={() => setMenuOpen(false)} />
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-6 py-5 uppercase text-sm font-bold tracking-[0.2em] text-zinc-300 border-b border-zinc-900">
              Ecosistema
            </Link>
          </div>
        </div>
      )}

    </div>
  )
}
