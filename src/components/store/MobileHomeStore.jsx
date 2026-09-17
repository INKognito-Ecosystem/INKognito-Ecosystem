import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { categories } from '../../data/storeCategories.jsx'
import StoreProductCard from './StoreProductCard'
import StoreMobileNav from './StoreMobileNav'
import { fetchCatalogPage, toProdCard } from '../../hooks/useCatalog'
import logoStore from '../../assets/milogo/store.webp'
import bannerRopaCalzado from '../../assets/store/banner-ropa-calzado-uraba.png'

// Banners promocionales (2026-09-16) — Jose terminó pidiendo la pieza ya
// armada completa (foto+titular+insignias+CTA, todo horneado en una sola
// imagen) en vez de recomponerla en CSS ("esa ya está armada, solo es
// ponerla") — mucho más simple y sin los ajustes de alineación/recorte que
// tomaba re-armarla a mano. "El primero de varios banners que pienso
// incluir, al igual que en supply" — por ahora es uno solo fijo (no hace
// falta rotación/carrusel todavía); esta lista es el punto de extensión
// para cuando llegue ese momento — agregar un banner nuevo será sumar un
// objeto acá, no rediseñar el componente.
const BANNERS = [
  {
    id: 'ropa-calzado-uraba',
    image: bannerRopaCalzado,
    alt: 'Ropa & Calzado para Urabá — 100% réplica premium, pago contraentrega, envío local rápido',
    ctaTo: '/store/categorias',
  },
]

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
// con la paleta dorada de Store. El tab bar + menú viven en StoreMobileNav
// (compartido con StoreCategoriasPage.jsx y cualquier otra página no-home,
// mismo criterio que SupplyMobileNav/MobileHomeSupply). Sin "cargar más" a
// propósito — el desktop tampoco lo tiene en Destacados (selección curada,
// no el catálogo completo).
export default function MobileHomeStore({ initialProducts = [] }) {
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
          MobileHomeSupply.jsx). "Todos" es solo indicador visual (no
          clickable), igual que en MobileHomeSupply.jsx — no navega ni
          hace scroll, solo refleja que no hay búsqueda activa. Texto/borde
          en negro sobre el dorado, no blanco — mismo criterio de contraste
          que ya usa toda la página en sus botones dorados. */}
      <div className="flex gap-5 overflow-x-auto px-4 py-3" style={{ backgroundColor: GOLD }}>
        <span className={`flex-shrink-0 text-[13px] font-extrabold pb-1.5 border-b-2 whitespace-nowrap ${!resultados ? 'text-black border-black' : 'text-black/50 border-transparent'}`}>
          Todos
        </span>
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

      {/* BANNER — Jose terminó subiendo la pieza ya armada completa (ver
          nota junto a BANNERS más arriba), así que acá solo se coloca: sin
          overlay de texto/insignias propio, todo eso ya viene horneado en
          la imagen. Todo el banner es un solo link al catálogo, mismo
          criterio que cualquier banner promocional clickeable. */}
      {BANNERS.map(banner => (
        <Link
          key={banner.id}
          to={banner.ctaTo}
          className="block mx-2 mt-3 rounded-2xl overflow-hidden border border-[#C9A84C]/30"
        >
          <img src={banner.image} alt={banner.alt} className="w-full h-auto block" />
        </Link>
      ))}

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

      <StoreMobileNav active="inicio" />
    </div>
  )
}
