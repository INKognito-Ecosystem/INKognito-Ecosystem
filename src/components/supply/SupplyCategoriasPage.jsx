import { useState, useEffect, useRef, useMemo } from 'react'
import { useLoaderData, Link, useNavigate } from 'react-router'
import { Search, MapPin, SlidersHorizontal, Share2, ChevronRight } from 'lucide-react'
import { categories, catKey } from './CategoriesSupply'
import { CATEGORY_PRIORITY_IMG, matchProductsToSubcategories } from '../../data/supplySubcategories'
import SupplyMobileNav from './SupplyMobileNav'
import SupplyProductCard from './SupplyProductCard'
import { fetchCatalogCounts, fetchCatalogPage } from '../../hooks/useCatalog'
import logoSupply from '../../assets/milogo/supply.webp'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

const ORDEN_OPTIONS = [
  { value: 'recientes', label: 'Recientes' },
  { value: 'precio_asc', label: 'Menor precio' },
]

export async function loader() {
  const [counts, inicialProductos, imgs] = await Promise.all([
    fetchCatalogCounts('supply'),
    fetchCatalogPage('supply', { tipo: 'fisico', limit: 100 }),
    fetch(`${PANEL_URL}/api/visual/supply`).then(r => r.ok ? r.json() : {}).catch(() => ({})),
  ])
  return { counts, productosFisicos: inicialProductos.items || [], imgs }
}

export function meta() {
  const title = 'Categorías | INKognito Supply'
  const description = 'Explora todas las categorías y subcategorías de insumos profesionales para tatuadores — tintas, cartuchos, agujas, máquinas, cuidados, mobiliario y más.'
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/categorias` },
  ]
}

export default function SupplyCategoriasPage() {
  const { counts, productosFisicos, imgs = {} } = useLoaderData()
  const navigate = useNavigate()

  // Por defecto selecciona la primera categoría que tenga productos, o Tintas si ninguna tiene
  const initialCat = useMemo(() => {
    const conStock = categories.find((c) => (counts[c.cat] || 0) > 0)
    return (conStock || categories[0]).cat
  }, [counts])

  const [activeCat, setActiveCat] = useState(initialCat)

  const [busqueda, setBusqueda] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [resultados, setResultados] = useState(null)
  const [orden, setOrden] = useState('recientes')
  const [provFiltro, setProvFiltro] = useState('todos')
  const [provBusqueda, setProvBusqueda] = useState('')

  const [ordenAbierto, setOrdenAbierto] = useState(false)
  const [provAbierto, setProvAbierto] = useState(false)
  const [shareMsg, setShareMsg] = useState(null)
  const ordenRef = useRef(null)
  const provRef = useRef(null)
  const yaHizoScroll = useRef(false)
  const rightPaneRef = useRef(null)

  const shareUrl = `${import.meta.env.VITE_SITE_URL}/supply/categorias`
  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Categorías | INKognito Supply', url: shareUrl }) } catch {}
      return
    }
    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareMsg('Link copiado')
      setTimeout(() => setShareMsg(null), 2000)
    } catch {}
  }

  useEffect(() => {
    function onClickFuera(e) {
      if (ordenRef.current && !ordenRef.current.contains(e.target)) setOrdenAbierto(false)
      if (provRef.current && !provRef.current.contains(e.target)) setProvAbierto(false)
    }
    document.addEventListener('mousedown', onClickFuera)
    return () => document.removeEventListener('mousedown', onClickFuera)
  }, [])

  const normaliza = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

  useEffect(() => {
    const q = busqueda.trim()
    if (q.length < 2) { setResultados(null); setBuscando(false); yaHizoScroll.current = false; return }
    setBuscando(true)
    const t = setTimeout(async () => {
      const qNorm = normaliza(q)
      const categoriaCoincide = categories.find(c => normaliza(c.cat).includes(qNorm))
      const [porNombre, porCategoria] = await Promise.all([
        fetchCatalogPage('supply', { q, limit: 24, orden }),
        categoriaCoincide
          ? fetchCatalogPage('supply', { categoria: categoriaCoincide.cat, tipo: 'fisico', limit: 24, orden })
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
        document.getElementById('categorias-resultados')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        yaHizoScroll.current = true
      }
    }, 300)
    return () => clearTimeout(t)
  }, [busqueda, orden])

  const proveedoresEnResultados = useMemo(() => {
    if (!resultados) return []
    const map = new Map()
    for (const item of resultados) {
      const id = item.estudio_id
      if (id == null) continue
      if (!map.has(id)) {
        map.set(id, {
          id,
          nombre: item.estudio_nombre_display || item.estudio_nombre_supply || item.estudio_nombre || 'Proveedor',
          municipio: item.estudio_municipio || null,
        })
      }
    }
    return [...map.values()].sort((a, b) => (a.municipio || '').localeCompare(b.municipio || '') || a.nombre.localeCompare(b.nombre))
  }, [resultados])

  const proveedoresFiltrados = useMemo(() => {
    const q = provBusqueda.trim().toLowerCase()
    if (!q) return proveedoresEnResultados
    return proveedoresEnResultados.filter(p => p.nombre.toLowerCase().includes(q) || (p.municipio || '').toLowerCase().includes(q))
  }, [proveedoresEnResultados, provBusqueda])

  const resultadosFiltrados = provFiltro === 'todos' ? resultados : (resultados || []).filter(r => String(r.estudio_id) === provFiltro)
  const hayFiltros = resultados !== null && resultados.length > 0

  // Categoría activa + productos reales de esa categoría + subcategorías mapeadas
  const activeCategoryObj = useMemo(
    () => categories.find((c) => c.cat === activeCat) || categories[0],
    [activeCat]
  )

  const activeProducts = useMemo(
    () => productosFisicos.filter((p) => normaliza(p.categoria) === normaliza(activeCat)),
    [productosFisicos, activeCat]
  )

  const subcategorias = useMemo(
    () => matchProductsToSubcategories(activeCat, activeProducts),
    [activeCat, activeProducts]
  )

  const handleSelectCategory = (cat) => {
    setActiveCat(cat)
    if (rightPaneRef.current) rightPaneRef.current.scrollTop = 0
  }

  const handleSubcatClick = (sub) => {
    if (sub.count <= 0) return
    // Navega directo a la página de la categoría correspondiente donde se
    // muestran todos los productos disponibles de esa categoría.
    navigate(sub.customPath || activeCategoryObj.path)
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* NAVBAR SUPERIOR CON BUSCADOR */}
      <div className="fixed top-0 inset-x-0 z-50 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center gap-2 md:gap-3">
          <Link to="/supply" aria-label="Volver a Supply" className="flex-shrink-0">
            <img src={logoSupply} alt="INKognito Supply" className="w-11 h-11 md:w-14 md:h-14 object-contain" />
          </Link>

          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur() } }}
              placeholder="Buscar tintas, agujas, máquinas..."
              className="w-full bg-zinc-100 border border-zinc-200 text-zinc-900 text-sm rounded-full pl-9 pr-4 py-2 placeholder:text-zinc-500 focus:outline-none focus:border-blue-400"
            />
          </div>

          <button
            type="button"
            onClick={handleShare}
            aria-label="Compartir"
            className="flex-shrink-0 flex items-center justify-center w-9 h-9 text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <Share2 size={18} />
          </button>

          {hayFiltros && (
            <>
              <div className="relative flex-shrink-0" ref={provRef}>
                <button
                  type="button"
                  onClick={() => setProvAbierto(o => !o)}
                  aria-label="Filtrar por ubicación"
                  aria-expanded={provAbierto}
                  className={`flex items-center justify-center w-9 h-9 bg-zinc-100 border rounded-lg transition-colors ${
                    provAbierto || provFiltro !== 'todos' ? 'border-blue-500 text-blue-500' : 'border-zinc-200 text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <MapPin size={14} />
                </button>
                {provAbierto && (
                  <div className="absolute right-0 top-full mt-1.5 z-20 w-64 bg-white border border-zinc-200 rounded-lg shadow-xl overflow-hidden">
                    <div className="p-2 border-b border-zinc-100">
                      <div className="relative">
                        <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        <input
                          type="text"
                          value={provBusqueda}
                          onChange={(e) => setProvBusqueda(e.target.value)}
                          placeholder="Buscar proveedor o ciudad"
                          className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs rounded-md pl-7 pr-2 py-1.5 placeholder:text-zinc-400 focus:outline-none focus:border-blue-400"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setProvFiltro('todos'); setProvBusqueda(''); setProvAbierto(false) }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                        provFiltro === 'todos' ? 'text-blue-500 bg-blue-50' : 'text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      Todas las ubicaciones
                    </button>
                    <div className="max-h-60 overflow-y-auto border-t border-zinc-100">
                      {proveedoresFiltrados.length === 0 ? (
                        <p className="px-3 py-3 text-xs text-zinc-400">Ningún proveedor coincide</p>
                      ) : proveedoresFiltrados.map(p => (
                        <div key={p.id} className="flex items-center">
                          <button
                            type="button"
                            onClick={() => { setProvFiltro(String(p.id)); setProvBusqueda(''); setProvAbierto(false) }}
                            className={`flex-1 min-w-0 text-left px-3 py-2 text-xs truncate transition-colors ${
                              provFiltro === String(p.id) ? 'text-blue-500 bg-blue-50 font-bold' : 'text-zinc-600 hover:bg-zinc-50'
                            }`}
                          >
                            {p.nombre}
                            {p.municipio && <span className="text-zinc-400 font-normal"> · {p.municipio}</span>}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative flex-shrink-0" ref={ordenRef}>
                <button
                  type="button"
                  onClick={() => setOrdenAbierto(o => !o)}
                  aria-label="Ordenar por"
                  aria-expanded={ordenAbierto}
                  className={`flex items-center justify-center w-9 h-9 bg-zinc-100 border rounded-lg transition-colors ${
                    ordenAbierto ? 'border-blue-500 text-blue-500' : 'border-zinc-200 text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <SlidersHorizontal size={14} />
                </button>
                {ordenAbierto && (
                  <div className="absolute right-0 top-full mt-1.5 z-20 min-w-[140px] bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-xl">
                    {ORDEN_OPTIONS.map(o => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => { setOrden(o.value); setOrdenAbierto(false) }}
                        className={`w-full text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                          orden === o.value ? 'text-blue-500 bg-blue-50' : 'text-zinc-600 hover:bg-zinc-50'
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {shareMsg && (
          <div className="absolute left-0 right-0 top-full mt-2 flex justify-center pointer-events-none">
            <p className="bg-zinc-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">{shareMsg}</p>
          </div>
        )}
      </div>

      {/* CONTENIDO PRINCIPAL */}
      {resultados !== null ? (
        <div id="categorias-resultados" className="pt-20 md:pt-24 pb-28 md:pb-16 px-4 md:px-6 max-w-7xl mx-auto">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500 mb-3">
            {buscando ? 'Buscando…' : `Resultados (${resultadosFiltrados.length})`}
          </h2>
          {!buscando && resultadosFiltrados.length === 0 ? (
            <p className="text-zinc-500 text-sm">Ningún producto coincide con tu búsqueda.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {resultadosFiltrados.map(item => (
                <SupplyProductCard key={`${item.name}-${item.estudio_id ?? 'x'}`} item={item} categoria={item.categoria} light />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* LAYOUT 2 COLUMNAS ESTILO MERCADO LIBRE */
        <div className="pt-16 md:pt-20 h-[100dvh] flex max-w-7xl mx-auto">
          {/* COLUMNA IZQUIERDA: CATEGORÍAS PRINCIPALES */}
          <aside
            aria-label="Categorías de Supply"
            className="w-[104px] sm:w-[144px] md:w-[230px] flex-shrink-0 bg-zinc-100/90 border-r border-zinc-200 overflow-y-auto pb-24 md:pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((cat) => {
              const Icon = cat.icon
              const isSelected = cat.cat === activeCat
              const imgKey = cat.imgKey || catKey(cat.cat)
              const priorityPhoto = CATEGORY_PRIORITY_IMG[cat.cat]
              const catPhoto = priorityPhoto || imgs[imgKey] || null
              const isCover = !priorityPhoto && Boolean(imgs[imgKey])
              return (
                <button
                  key={cat.cat}
                  type="button"
                  onClick={() => handleSelectCategory(cat.cat)}
                  className={`relative w-full text-left px-2 sm:px-3 md:px-3.5 py-2.5 md:py-3 flex flex-col md:flex-row items-center gap-1.5 md:gap-3 border-b border-zinc-200/70 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-white text-blue-600 font-black'
                      : 'bg-transparent text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 font-semibold'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-blue-600" />
                  )}
                  <span
                    className={`relative w-12 h-12 md:w-11 md:h-11 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 border ${
                      isSelected ? 'border-blue-300 bg-white shadow-xs' : 'border-zinc-200 bg-white'
                    }`}
                  >
                    {catPhoto ? (
                      <img
                        src={catPhoto}
                        alt={cat.name}
                        className={`w-full h-full ${isCover ? 'object-cover' : 'object-contain p-1'}`}
                        loading="lazy"
                      />
                    ) : (
                      <Icon size={18} strokeWidth={1.8} className={isSelected ? 'text-blue-600' : 'text-zinc-400'} />
                    )}
                  </span>
                  <span className="text-[10px] sm:text-[11px] md:text-xs leading-tight text-center md:text-left uppercase tracking-wide flex-1 min-w-0">
                    {cat.name}
                  </span>
                </button>
              )
            })}
          </aside>

          {/* PANEL DERECHO: SUBCATEGORÍAS Y PRODUCTOS DE LA CATEGORÍA ACTIVA */}
          <main
            ref={rightPaneRef}
            className="flex-1 min-w-0 bg-white overflow-y-auto px-3.5 sm:px-5 md:px-8 pt-4 md:pt-6 pb-28 md:pb-12"
          >
            {/* ENCABEZADO DE LA CATEGORÍA ACTIVA */}
            <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-zinc-100">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Categoría Supply
                </p>
                <h1 className="mt-0.5 text-base sm:text-xl md:text-2xl font-black uppercase tracking-tight text-zinc-900 truncate">
                  {activeCategoryObj.name}
                </h1>
              </div>

              <Link
                to={activeCategoryObj.path}
                className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/70 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full transition-colors"
              >
                <span>Ver todo</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* SUBCATEGORÍAS / MARCAS DE LA CATEGORÍA SELECCIONADA */}
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400 mb-3">
              Qué encuentras en {activeCategoryObj.name}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
              {subcategorias.map((sub) => {
                const hasStock = sub.count > 0
                const cardContent = (
                  <>
                    <div className="relative aspect-square w-full bg-zinc-50 rounded-xl overflow-hidden flex items-center justify-center p-2.5 sm:p-3 border border-zinc-100">
                      <img
                        src={sub.image}
                        alt={sub.name}
                        loading="lazy"
                        className={`w-full h-full object-contain transition-transform duration-300 ${
                          hasStock ? 'group-hover:scale-105' : 'opacity-80'
                        }`}
                      />
                      <span
                        className={`absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          hasStock
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white/90 text-zinc-400 border border-zinc-200'
                        }`}
                      >
                        {hasStock ? `${sub.count} disp.` : 'Sin stock'}
                      </span>
                    </div>
                    <p
                      className={`mt-2 text-[11px] sm:text-xs font-bold leading-snug text-center px-0.5 ${
                        hasStock ? 'text-zinc-900 group-hover:text-blue-600' : 'text-zinc-500'
                      }`}
                    >
                      {sub.name}
                    </p>
                  </>
                )

                if (hasStock) {
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSubcatClick(sub)}
                      className="group flex flex-col items-center text-left p-2 rounded-2xl border border-blue-200/80 bg-white hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                    >
                      {cardContent}
                    </button>
                  )
                }

                return (
                  <div
                    key={sub.id}
                    className="flex flex-col items-center p-2 rounded-2xl border border-zinc-200/70 bg-white/70"
                  >
                    {cardContent}
                  </div>
                )
              })}
            </div>
          </main>
        </div>
      )}

      <SupplyMobileNav active="categorias" light />
    </div>
  )
}
