import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import NavbarCategoryStore from './NavbarCategoryStore'
import StoreMobileNav from './StoreMobileNav'
import StoreProductCard from './StoreProductCard'
import { CATEGORY_GROUPS } from '../../data/storeCategories'
import { fetchCatalogPage, toProdCard } from '../../hooks/useCatalog'
import logoStore from '../../assets/milogo/store.webp'

const categoryGroups = [CATEGORY_GROUPS.deportiva, CATEGORY_GROUPS.casual]

// Mapea la categoria real de la DB al slug de su página — necesario para
// que StoreProductCard arme el cartKey correcto sobre un resultado que
// puede venir de cualquier categoría (búsqueda global, no una sola como en
// las páginas de categoría). "Tenis y guayo" es el único nombre de DB que
// no coincide con el `name` de storeCategories.jsx (ahí se muestra como
// "Teniguayos"), así que no basta con derivarlo de esa lista.
const CATEGORIA_TO_SLUG = {
  'Ropa Dama': 'ropa-dama',
  'Ropa Caballeros': 'ropa-caballeros',
  'Zapatos Deportivos': 'zapatos-deportivos',
  'Zapatos Casuales': 'zapatos-casuales',
  'Guayos': 'guayos',
  'Tenis y guayo': 'tenis-guayo',
  'Ropa General': 'ropa-general',
  'Accesorios': 'accesorios',
}

export function meta() {
  const title = 'Categorías | INKognito Store'
  const description = 'Explora ropa y calzado deportivo y casual — sets, camisetas dry-fit, tenis de running, guayos, zapatos casuales y más, en Urabá.'
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/store/categorias` },
  ]
}

// Página propia de categorías (2026-09-16, Jose: "quita las dos card que
// contenían las categorías [de la home]... esas cards van a pasar a estar
// dentro de una página, que estará enlazada a el botón categorías del
// navbar inferior") — mismo patrón ya resuelto en Supply
// (SupplyCategoriasPage.jsx, enlazada desde SupplyMobileNav). Mueve tal
// cual el bloque de "Nuestras Categorías" que antes vivía en StorePage.jsx,
// sin rediseñarlo — Jose pidió moverlo, no rehacerlo.
export default function StoreCategoriasPage() {
  // Buscador global de Store (2026-09-16, Jose: "la page categorías...
  // no tiene el buscador en el navbar superior") — a diferencia de las 8
  // páginas de categoría (que filtran DENTRO de una sola categoría), acá
  // no hay una categoría fija: busca en todo el catálogo de Store, mismo
  // fetch de bajo nivel (fetchCatalogPage), sin filtro de categoria.
  const [busqueda, setBusqueda] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [resultados, setResultados] = useState(null) // null = sin búsqueda activa

  useEffect(() => {
    const q = busqueda.trim()
    if (q.length < 2) { setResultados(null); setBuscando(false); return }
    setBuscando(true)
    const t = setTimeout(async () => {
      const page = await fetchCatalogPage('store', { q, limit: 24 })
      setResultados(page.items)
      setBuscando(false)
    }, 300)
    return () => clearTimeout(t)
  }, [busqueda])

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar fijo — solo escritorio; en móvil lo reemplaza la barra
          compacta con buscador de abajo (mismo criterio que las 8 páginas
          de categoría y TiendasDirectorioPage.jsx). */}
      <div className="hidden md:block">
        <NavbarCategoryStore pageName="Categorías" hideMobileActions />
      </div>

      <div className="md:hidden sticky top-0 z-40 flex items-center gap-2 px-4 py-2 bg-white border-b border-zinc-200">
        <Link to="/store" aria-label="Volver a Store" className="flex-shrink-0">
          <img src={logoStore} alt="INKognito Store" className="w-12 h-12 object-contain" />
        </Link>
        <div className="relative flex-1 min-w-0">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar en Store"
            className="w-full min-w-0 bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs rounded-lg pl-8 pr-2 py-2 placeholder:text-zinc-500 focus:outline-none focus:border-[#C9A84C]"
          />
        </div>
      </div>

      <div className="pt-0 md:pt-28 pb-24 md:pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 md:mb-8">
            <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-xs mb-2">
              Catálogo
            </p>
            <h1 className="text-2xl md:text-4xl font-black uppercase leading-none text-gray-900">
              Nuestras Categorías
            </h1>
          </div>

          {/* Buscador — fila propia, solo escritorio (en móvil ya vive en
              la barra superior compacta). */}
          <div className="hidden md:flex items-center gap-2 mb-6 max-w-md">
            <div className="relative flex-1 min-w-0">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar en Store"
                className="w-full min-w-0 bg-white border border-gray-200 text-gray-900 text-sm rounded-lg pl-9 pr-3 py-2.5 placeholder:text-gray-400 focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
          </div>

          {resultados !== null ? (
            buscando ? (
              <p className="text-gray-400 text-sm text-center py-10">Buscando…</p>
            ) : resultados.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-10">Ningún producto coincide con "{busqueda}".</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {resultados.map(item => {
                  const prod = toProdCard(item)
                  const sizes = item.variantes.map(v => v.variant).filter(Boolean)
                  return (
                    <StoreProductCard
                      key={item.name}
                      product={prod}
                      category={CATEGORIA_TO_SLUG[item.categoria] || 'general'}
                      sizes={sizes.length ? sizes : ['Única']}
                    />
                  )
                })}
              </div>
            )
          ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {categoryGroups.map((group) => {
              const isGym = group.key === 'deportiva'
              return (
                <Link
                  key={group.link}
                  to={group.link}
                  className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 md:p-7 flex flex-col transition-all duration-300 hover:-translate-y-1 min-h-[240px] md:min-h-[280px] ${
                    isGym
                      ? 'from-zinc-600 to-zinc-900 border-zinc-400/30 hover:border-zinc-300/50 hover:shadow-[0_12px_35px_rgba(161,161,170,0.2)]'
                      : 'from-[#4a350f] to-black border-[#C9A84C]/40 hover:border-[#C9A84C]/70 hover:shadow-[0_12px_35px_rgba(201,168,76,0.3)]'
                  }`}
                >
                  <div className={isGym
                    ? 'absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10'
                    : 'absolute -bottom-14 -right-14 w-44 h-44 rounded-full bg-[#C9A84C]/15'
                  } />
                  <div className={`relative w-12 h-12 rounded-full border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                    isGym ? 'bg-zinc-900/60 border-zinc-300/30 text-zinc-200' : 'bg-black/40 border-[#C9A84C]/50 text-[#C9A84C]'
                  }`}>
                    {group.icon}
                  </div>
                  <p className={`relative uppercase tracking-[0.25em] text-[10px] mb-2 font-semibold ${isGym ? 'text-zinc-300' : 'text-[#C9A84C]'}`}>
                    {group.tag}
                  </p>
                  <h2 className="relative text-lg md:text-2xl font-black uppercase leading-tight mb-3 text-white">
                    {group.name}
                  </h2>
                  <p className={`relative text-xs md:text-sm leading-relaxed mb-5 flex-1 text-justify [hyphens:auto] ${isGym ? 'text-zinc-200' : 'text-zinc-400'}`}>
                    {group.description}
                  </p>
                  <span className={`relative shrink-0 border text-xs md:text-sm font-black uppercase tracking-[0.2em] py-3 px-6 rounded-xl text-center transition-all duration-300 ${
                    isGym
                      ? 'border-zinc-300/40 text-zinc-100 group-hover:border-zinc-100 group-hover:bg-white/10'
                      : 'border-[#C9A84C]/50 text-[#C9A84C] group-hover:border-[#C9A84C] group-hover:bg-[#C9A84C]/15'
                  }`}>
                    Ver categorías →
                  </span>
                </Link>
              )
            })}
          </div>
          )}
        </div>
      </div>

      <StoreMobileNav active="categorias" />
    </main>
  )
}
