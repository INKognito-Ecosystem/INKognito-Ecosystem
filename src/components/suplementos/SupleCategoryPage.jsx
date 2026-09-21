import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavbarSuple from './NavbarSuple'
import FooterSuple from './FooterSuple'
import SupleMobileNav from './SupleMobileNav'
import SupleCategoryRibbon from './SupleCategoryRibbon'
import { SuplCard } from './SuplCard'
import { ArrowLeft, ArrowRight, LoaderCircle, X } from 'lucide-react'
import { getAdjacentSupleCategories } from '../../data/supleCategoriesOrder'
import { useLoadMore, fetchCatalogPage } from '../../hooks/useCatalog'

import CategoriaVaciaCard from '../CategoriaVaciaCard'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(24,24,27,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

const PAGE_SIZE = 24

// Blanco (2026-09-19, migración de Suple a fondo blanco) — mismo esqueleto
// que las categorías de Store/Supply: navbar superior con buscador, hero,
// grid de cards, footer, espaciador y tab bar inferior. La card ahora maneja
// su propio carrito (ver SuplCard.jsx), así que esta página ya no arma ítems
// ni calcula keys.
//
// nextCursor/hasMore (2026-09-14, paginación real, fase 2) — `products` ya
// no es la categoría completa, es solo la primera página; useLoadMore trae
// el resto bajo pedido en vez de un techo silencioso en el primer límite.
export default function SupleCategoryPage({ title, categoria, slug, intro, products: productosIniciales = [], nextCursor = null, hasMore = false }) {
  const { prev, next } = getAdjacentSupleCategories(slug)
  const { items: products, hasMore: hayMasProductos, loading: cargandoMasProductos, loadMore: cargarMasProductos } =
    useLoadMore('suplementos', { categoria }, { items: productosIniciales, nextCursor, hasMore })

  // Buscador (server-side, dentro de esta categoría) — mismo patrón que
  // SupplyCategoryPage.jsx: la búsqueda reemplaza la lista mientras está
  // activa, con debounce de 300 ms y su propia paginación por cursor.
  const [query, setQuery] = useState('')
  const buscando = query.trim().length >= 2
  const [resultados, setResultados] = useState({ items: [], nextCursor: null, hasMore: false })
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false)
  const [cargandoMasBusqueda, setCargandoMasBusqueda] = useState(false)

  useEffect(() => {
    if (!buscando) return
    let vigente = true
    setCargandoBusqueda(true)
    const timer = setTimeout(async () => {
      const r = await fetchCatalogPage('suplementos', { categoria, tipo: 'fisico', q: query.trim(), limit: PAGE_SIZE })
      if (!vigente) return
      setResultados({ items: r.items, nextCursor: r.nextCursor, hasMore: r.hasMore })
      setCargandoBusqueda(false)
    }, 300)
    return () => { vigente = false; clearTimeout(timer) }
  }, [query, categoria, buscando])

  const cargarMasBusqueda = async () => {
    if (!resultados.hasMore || cargandoMasBusqueda) return
    setCargandoMasBusqueda(true)
    const r = await fetchCatalogPage('suplementos', { categoria, tipo: 'fisico', q: query.trim(), limit: PAGE_SIZE, cursor: resultados.nextCursor })
    setResultados(prevR => ({ items: [...prevR.items, ...r.items], nextCursor: r.nextCursor, hasMore: r.hasMore }))
    setCargandoMasBusqueda(false)
  }

  const lista = buscando ? resultados.items : products
  const hayMas = buscando ? resultados.hasMore : hayMasProductos
  const cargandoMas = buscando ? cargandoMasBusqueda : cargandoMasProductos
  const cargarMas = buscando ? cargarMasBusqueda : cargarMasProductos

  // Hoja con la descripción de la categoría (móvil) — se abre desde el
  // ícono de libro del listón.
  const [verDescripcion, setVerDescripcion] = useState(false)

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <NavbarSuple
        pageName={title}
        hideMobileActions
        hideWordmark
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder={`Buscar en ${title}`}
        shareUrl={`${import.meta.env.VITE_SITE_URL}/suplementos/${slug}`}
      />

      {/* Sin flechas prev/next flotantes al hacer scroll (2026-09-19, Jose:
          "no has quitado las flechas que aparecen al hacer scroll en las
          categorías") — mismo criterio que SupplyCategoryPage.jsx desde
          2026-09-15. Quedan las flechas fijas del hero de escritorio, que
          son un control de navegación aparte. */}

      <div className="pt-16 md:pt-24">

        {/* Listón de categorías debajo del navbar, como en el home móvil
            (2026-09-19, Jose) — solo móvil: en escritorio la navegación
            entre categorías ya está en el menú del navbar y en las flechas
            del hero. La categoría actual queda marcada. */}
        <div className="md:hidden">
          <SupleCategoryRibbon activeSlug={slug} todosComoLink onInfo={intro ? () => setVerDescripcion(true) : null} />
        </div>

        {/* HERO */}
        <div className="relative overflow-hidden px-6 max-w-7xl mx-auto pt-4 pb-5 md:pb-10">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={DOT_PATTERN} />
          {/* Fila "Categoría" con flechas prev/next — solo escritorio: en
              móvil el listón de arriba ya muestra todas las categorías y
              marca la actual, así que repetirlo acá sobraba (2026-09-19,
              Jose: "no hacer redundante el nombre de la categoría"). */}
          <div className="relative z-10 hidden md:flex items-center gap-3 mb-2">
            {prev && (
              <Link
                to={`/suplementos/${prev.slug}`} replace
                aria-label={`Ver ${prev.name}`}
                className="flex-shrink-0 text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
            )}
            <p className="flex-1 text-center uppercase tracking-[0.25em] text-zinc-500 text-xs">Categoría</p>
            {next && (
              <Link
                to={`/suplementos/${next.slug}`} replace
                aria-label={`Ver ${next.name}`}
                className="flex-shrink-0 text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <ArrowRight size={20} />
              </Link>
            )}
          </div>
          {/* El título se oculta visualmente en móvil (el listón ya dice qué
              categoría es) pero se conserva en el HTML como <h1>: la página
              necesita su encabezado principal para SEO y lectores de
              pantalla. */}
          <h1 className="relative z-10 sr-only md:not-sr-only md:text-4xl font-black uppercase tracking-tight leading-none text-zinc-900 text-center mb-4">{title}</h1>
          {/* Descripción — en escritorio queda como el párrafo de siempre; en
              móvil vive detrás del ícono de libro del listón (ver
              SupleCategoryRibbon.jsx y la hoja de abajo). */}
          {intro && (
            <p className="relative z-10 hidden md:block text-zinc-600 text-lg leading-relaxed max-w-3xl text-justify [hyphens:auto]">{intro}</p>
          )}
        </div>

        {/* PRODUCTOS */}
        <div className="pb-16 max-w-7xl mx-auto">
          {buscando && (
            <p className="px-4 md:px-6 mb-3 text-zinc-400 text-xs uppercase tracking-widest">
              {cargandoBusqueda ? 'Buscando…' : `${lista.length}${hayMas ? '+' : ''} resultado${lista.length !== 1 ? 's' : ''} para "${query.trim()}"`}
            </p>
          )}

          {buscando && cargandoBusqueda && lista.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-10 text-zinc-400 text-sm">
              <LoaderCircle size={14} className="animate-spin" /> Buscando…
            </div>
          ) : lista.length === 0 ? (
            buscando ? (
              <p className="px-6 py-10 text-center text-zinc-500 text-sm">Ningún producto de {title.toLowerCase()} coincide con "{query.trim()}".</p>
            ) : (
              <CategoriaVaciaCard className="mx-6 border border-zinc-200 bg-zinc-50" labelClassName="text-zinc-500" titleClassName="text-zinc-900" />
            )
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-4 md:px-6">
                {lista.map((item) => (
                  <SuplCard key={item.variantes?.[0]?.id ?? item.name} item={item} />
                ))}
              </div>
              {hayMas && (
                <div className="flex justify-center mt-6 px-6">
                  <button
                    onClick={cargarMas}
                    disabled={cargandoMas}
                    className="px-6 py-2.5 border border-zinc-300 text-zinc-700 text-xs font-bold uppercase tracking-[0.15em] rounded hover:border-zinc-700 hover:text-zinc-900 transition-all duration-300 disabled:opacity-50"
                  >
                    {cargandoMas ? 'Cargando…' : 'Cargar más'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <FooterSuple />
      </div>

      <div className="h-16 md:hidden" />
      <SupleMobileNav active={null} />

      {/* Hoja inferior con la descripción — misma que la de Supply y Store
          (SupplyCategoryPage.jsx / categorías de Store): overlay oscuro, panel
          que sube desde abajo, título = nombre de la categoría y ✕. */}
      {verDescripcion && intro && (
        <div
          className="md:hidden fixed inset-0 z-[60] bg-black/70 flex items-end"
          onClick={() => setVerDescripcion(false)}
        >
          <div
            className="w-full max-w-md bg-white border-t border-zinc-200 rounded-t-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900">{title}</h4>
              <button onClick={() => setVerDescripcion(false)} aria-label="Cerrar" className="text-zinc-400"><X size={20} /></button>
            </div>
            <p className="text-zinc-600 text-sm leading-relaxed">{intro}</p>
          </div>
        </div>
      )}
    </div>
  )
}
