import { useState, useEffect, useRef, useMemo } from 'react'
import { useLoaderData, Link } from 'react-router'
import { Search, MapPin, SlidersHorizontal, Share2 } from 'lucide-react'
import { categories, catKey } from './CategoriesSupply'
import SupplyMobileNav from './SupplyMobileNav'
import SupplyProductCard from './SupplyProductCard'
import { fetchCatalogCounts, fetchCatalogPage } from '../../hooks/useCatalog'
import logoSupply from '../../assets/milogo/supply.webp'

const PANEL_URL = import.meta.env.VITE_PANEL_URL

const ORDEN_OPTIONS = [
  { value: 'recientes', label: 'Recientes' },
  { value: 'precio_asc', label: 'Menor precio' },
]

// Página propia de categorías (2026-09-15, Jose: "quiero que el botón
// categorías del navbar inferior abra una page nueva... con card y foto,
// como estaban antes... en columnas de dos"). El buscador + filtros viven
// pegados al navbar (Jose: "este buscador debe estar es en el navbar,
// junto con sus otros filtros, como el de ubicación, más reciente y
// menor precio") — mismo patrón/mismos íconos que ya usa
// SupplyCategoryPage.jsx (MapPin = proveedor/ubicación, SlidersHorizontal
// = orden), pero simplificado a un solo set de estado/refs porque acá no
// hace falta duplicar el bloque para mobile/desktop por separado: esta
// barra se ve igual en cualquier tamaño de pantalla, pegada justo debajo
// de NavbarCategory.
//
// El filtro de "ubicación" no tiene un endpoint propio tipo
// fetchCatalogProviders (ese exige una categoría fija) — como acá la
// búsqueda es de TODO el módulo, la lista de proveedores para filtrar se
// arma de los resultados que ya llegaron (client-side), no de un fetch
// aparte.
export async function loader() {
  const [counts, imgs] = await Promise.all([
    fetchCatalogCounts('supply'),
    fetch(`${PANEL_URL}/api/visual/supply`).then(r => r.ok ? r.json() : {}).catch(() => ({})),
  ])
  return { counts, imgs }
}

export function meta() {
  const title = 'Categorías | INKognito Supply'
  const description = 'Todas las categorías de insumos y equipos profesionales para tatuadores — tintas, cartuchos, agujas, máquinas y más.'
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/categorias` },
  ]
}

export default function SupplyCategoriasPage() {
  const { counts, imgs } = useLoaderData()
  const [busqueda, setBusqueda] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [resultados, setResultados] = useState(null) // null = sin búsqueda activa
  const [orden, setOrden] = useState('recientes')
  const [provFiltro, setProvFiltro] = useState('todos')
  const [provBusqueda, setProvBusqueda] = useState('')

  const [ordenAbierto, setOrdenAbierto] = useState(false)
  const [provAbierto, setProvAbierto] = useState(false)
  const [shareMsg, setShareMsg] = useState(null)
  const ordenRef = useRef(null)
  const provRef = useRef(null)
  const yaHizoScroll = useRef(false)

  // Compartir esta página (2026-09-15, Jose) — mismo patrón (Web Share API
  // con fallback a portapapeles) ya usado en NavbarCategory.jsx/
  // SupplyProductDetailPage.jsx. Acá no hay NavbarCategory que reusar (ver
  // comentario del navbar propio más abajo), así que se repite el mismo
  // handler corto en vez de forzar una dependencia cruzada.
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

  // Sin tildes/mayúsculas — mismo criterio que SupplyCategoryPage.jsx
  // (normaliza) para que "cartucho" encuentre "Cartuchos".
  const normaliza = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

  // También filtra por CATEGORÍA (2026-09-15, Jose: "también se debe
  // filtrar por categoría, no es necesario especificar el nombre del
  // producto") + scroll a resultados una sola vez por búsqueda (Jose:
  // "cuando empiecen a aparecer los productos, se debe hacer scroll...
  // si no, no se entera uno que hay algo buscando o apareciendo").
  useEffect(() => {
    const q = busqueda.trim()
    // Bug real (2026-09-15, Jose: "al borrar, destacado queda cargando y
    // no retorna si no hasta que recargo la página") — este return
    // temprano no reseteaba `buscando`, así que si quedaba en `true`
    // desde la búsqueda anterior, el spinner "Buscando…" nunca se
    // apagaba al borrar el texto.
    if (q.length < 2) { setResultados(null); setBuscando(false); yaHizoScroll.current = false; return }
    setBuscando(true)
    if (!yaHizoScroll.current) {
      document.getElementById('categorias-resultados')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      yaHizoScroll.current = true
    }
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
      setResultados([...mapa.values()])
      setBuscando(false)
    }, 300)
    return () => clearTimeout(t)
  }, [busqueda, orden])

  // Proveedores distintos DENTRO de los resultados actuales — no existe un
  // listado global de proveedores de Supply para armar esto de antemano.
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

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar propio de esta página (2026-09-15, Jose: "quita el texto
          supply tienda en línea del navbar y agrega allí el buscador") —
          ya no reusa NavbarCategory (ese es el navbar compartido con
          Cartuchos/ficha de producto/EstudioSupplyPage, con logo+wordmark;
          tocar su layout para meterle un buscador habría afectado a los
          otros 3). Acá el buscador reemplaza directamente al wordmark:
          solo ícono del logo + buscador + filtros, en una sola barra. Sin
          carrito acá (Jose: "tampoco dupliques el carrito en el navbar
          superior") — ya está en SupplyMobileNav de abajo, igual que el
          menú/categorías. */}
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

        <div id="categorias-resultados" className="pt-20 md:pt-24 pb-28 md:pb-16 px-4 md:px-6 max-w-7xl mx-auto">
          {resultados !== null ? (
            <>
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
            </>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {categories.map(category => {
                const count = counts[category.cat]
                const hasStock = count > 0
                const imgKey = category.imgKey || catKey(category.cat)
                const badgeClass = hasStock
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                return (
                  <Link
                    key={category.name}
                    to={category.path}
                    className="relative h-36 w-full rounded-xl border border-zinc-200 bg-zinc-50 overflow-hidden uppercase tracking-[0.08em] font-bold text-[10px] flex flex-col items-center justify-center gap-2 text-center px-1 hover:border-blue-400 transition-all duration-300"
                  >
                    {imgs[imgKey] ? (
                      <>
                        <img
                          src={imgs[imgKey]}
                          alt={category.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 left-0 right-0 bg-white/85 backdrop-blur-sm py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-900 z-10">
                          {category.name}
                        </span>
                        <span className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full z-10 ${badgeClass}`}>
                          {hasStock ? `${count} producto${count > 1 ? 's' : ''}` : 'Sin stock'}
                        </span>
                      </>
                    ) : (
                      <>
                        <category.icon size={26} className={hasStock ? 'text-blue-500' : 'text-zinc-300'} />
                        <span className="text-zinc-700">{category.name}</span>
                        <span className={`absolute bottom-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
                          {hasStock ? `${count} producto${count > 1 ? 's' : ''}` : 'Sin stock'}
                        </span>
                      </>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

      <SupplyMobileNav active="categorias" light />
    </div>
  )
}
