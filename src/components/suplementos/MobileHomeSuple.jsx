import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Zap, Share2 } from 'lucide-react'
import FooterSuple from './FooterSuple'
import SupleMobileNav from './SupleMobileNav'
import { SuplCard } from './SuplCard'
import SupleCategoryRibbon from './SupleCategoryRibbon'
import { AfiliadosSuple, CoberturaMovilSuple } from './SupleHomeSections'
import { SUPLE_CATEGORIES_ORDER } from '../../data/supleCategoriesOrder'
import { fetchCatalogPage, useLoadMore } from '../../hooks/useCatalog'
import logoSuple from '../../assets/milogo/gym.webp'

const normaliza = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// Home móvil de Suple en formato marketplace (2026-09-19, migración de Suple
// a fondo blanco) — mismo patrón que MobileHomeStore.jsx / MobileHomeSupply.jsx:
// barra superior con buscador, listón de categorías, banner, grid de
// productos y tab bar inferior (SupleMobileNav, compartido con las demás
// páginas de Suple). Acento grafito. El banner se arma en CSS con el mismo
// copy del hero de escritorio (titular, chips por objetivo, stats) — no hay
// imagen de banner propia todavía. Debajo del grid se conservan las
// secciones que ya tenía el home (afiliados y cobertura) y el footer.
export default function MobileHomeSuple({ afiliados = [], products = [], nextCursor = null, hasMore = false }) {
  const [busqueda, setBusqueda] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [resultados, setResultados] = useState(null) // null = sin búsqueda activa
  const yaHizoScroll = useRef(false)

  const { items: destacados, hasMore: hayMas, loading: cargandoMas, loadMore } =
    useLoadMore('suplementos', { tipo: 'fisico' }, { items: products, nextCursor, hasMore })

  // Busca por nombre de producto Y por categoría (si el texto calza con una
  // de las 5 categorías, suma también sus productos, no solo los que
  // calzan por nombre) — mismo criterio que MobileHomeStore.jsx.
  useEffect(() => {
    const q = busqueda.trim()
    if (q.length < 2) { setResultados(null); setBuscando(false); yaHizoScroll.current = false; return }
    setBuscando(true)
    let vigente = true
    const t = setTimeout(async () => {
      const qNorm = normaliza(q)
      const categoriaCoincide = SUPLE_CATEGORIES_ORDER.find(c => normaliza(c.name).includes(qNorm))
      const [porNombre, porCategoria] = await Promise.all([
        fetchCatalogPage('suplementos', { tipo: 'fisico', q, limit: 12 }),
        categoriaCoincide
          ? fetchCatalogPage('suplementos', { tipo: 'fisico', categoria: categoriaCoincide.categoria, limit: 12 })
          : Promise.resolve({ items: [] }),
      ])
      if (!vigente) return
      const mapa = new Map()
      for (const item of [...porCategoria.items, ...porNombre.items]) mapa.set(item.name, item)
      const nuevos = [...mapa.values()]
      setResultados(nuevos)
      setBuscando(false)
      if (nuevos.length > 0 && !yaHizoScroll.current) {
        const el = document.getElementById('grid-mobile-suple')
        const bar = document.querySelector('.sticky.top-0')
        if (el) {
          const barH = bar?.getBoundingClientRect().height ?? 0
          window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - barH, behavior: 'smooth' })
        }
        yaHizoScroll.current = true
      }
    }, 300)
    return () => { vigente = false; clearTimeout(t) }
  }, [busqueda])

  const gridItems = resultados ?? destacados

  // Compartir el home — Web Share API; sin ella, copia el link (mismo
  // comportamiento que el botón de NavbarSuple.jsx).
  const [shareMsg, setShareMsg] = useState(null)
  const compartir = async () => {
    const url = `${import.meta.env.VITE_SITE_URL || window.location.origin}/suplementos`
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

  return (
    <div className="md:hidden bg-white text-zinc-900">

      {/* TOP BAR — logo + buscador + compartir (2026-09-19, Jose: "agrega el
          icono de compartir, al lado derecho del buscador") */}
      <div className="sticky top-0 z-40 flex items-center gap-2 px-4 py-3 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <Link to="/suplementos" className="flex-shrink-0">
          <img src={logoSuple} alt="INKognito Suple" className="w-12 h-12 object-contain" />
        </Link>
        <div className="flex-1 flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-full px-3 py-2 min-w-0">
          <Search size={14} className="text-zinc-400 flex-shrink-0" />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar proteína, creatina, pre-entreno..."
            className="flex-1 min-w-0 bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
        </div>
        <div className="relative flex-shrink-0">
          <button
            onClick={compartir}
            aria-label="Compartir"
            className="p-1.5 -mr-1.5 text-zinc-500 hover:text-zinc-900 transition-colors duration-200"
          >
            <Share2 size={20} />
          </button>
          {shareMsg && (
            <p className="absolute right-0 top-full mt-2 bg-zinc-900 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
              {shareMsg}
            </p>
          )}
        </div>
      </div>

      {/* CATEGORÍAS — listón grafito (SupleCategoryRibbon.jsx, el mismo de
          las páginas de categoría). "Todos" es solo indicador visual (no
          navega), igual que en MobileHomeStore.jsx: refleja que no hay
          búsqueda activa. */}
      <SupleCategoryRibbon todosActivo={!resultados} />

      {/* BANNER — armado en CSS con el copy del hero de escritorio. */}
      <div className="relative overflow-hidden mx-2 mt-3 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 text-white px-5 py-6">
        <Zap
          className="absolute -right-4 top-1/2 text-white/[0.09] pointer-events-none"
          style={{ transform: 'translateY(-50%) rotate(8deg)' }}
          size={200}
          strokeWidth={1}
        />
        <div className="relative z-10">
          <p className="uppercase tracking-[0.25em] text-zinc-300 text-[10px] font-semibold mb-2">INKognito Suple — Urabá</p>
          <h2 className="text-2xl font-black uppercase leading-[1.05] mb-2">
            Potencia tus <span className="inline-block bg-white text-zinc-900 px-1.5 -mx-0.5">Entrenamientos</span>
          </h2>
          <p className="text-zinc-300 text-xs leading-relaxed mb-4 max-w-[17rem]">
            Proteína, creatina, pre-entreno y más, con stock real y despacho rápido desde Urabá a toda Colombia.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { to: '/suplementos/proteinas', label: 'Ganar masa' },
              { to: '/suplementos/vitaminas', label: 'Definición' },
              { to: '/suplementos/pre-entreno', label: 'Rendimiento' },
            ].map(chip => (
              <Link key={chip.to} to={chip.to} className="px-3 py-1.5 rounded-full border border-white/40 text-white text-[10px] font-bold uppercase tracking-wider">
                {chip.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-between gap-4">
            <Link to="/suplementos/categorias" className="inline-block px-5 py-2.5 rounded-lg bg-white text-zinc-900 text-[11px] font-black uppercase tracking-[0.2em]">
              Ver catálogo
            </Link>
            <div className="flex divide-x divide-white/20">
              {[{ n: '4', l: 'Municipios' }, { n: '100%', l: 'Stock real' }].map(s => (
                <div key={s.l} className="px-3 first:pl-0 last:pr-0 text-center">
                  <p className="text-lg font-black leading-none [font-variant-numeric:tabular-nums]">{s.n}</p>
                  <p className="text-zinc-400 uppercase tracking-[0.15em] text-[8px] mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GRID DE PRODUCTOS — se reemplaza por resultados de búsqueda cuando
          hay una activa. */}
      <div id="grid-mobile-suple" className="px-4 mt-8 mb-10">
        <h2 className="text-lg font-black uppercase mb-3 text-zinc-900">{resultados ? 'Resultados' : 'Destacados'}</h2>
        {buscando ? (
          <p className="text-zinc-500 text-xs">Buscando…</p>
        ) : gridItems.length === 0 ? (
          <p className="text-zinc-500 text-xs">
            {resultados ? 'Ningún producto coincide con tu búsqueda.' : 'Selección en preparación.'}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {gridItems.map(item => (
                <SuplCard key={item.variantes?.[0]?.id ?? `${item.categoria}-${item.name}`} item={item} />
              ))}
            </div>
            {!resultados && hayMas && (
              <div className="flex justify-center mt-5">
                <button
                  onClick={loadMore}
                  disabled={cargandoMas}
                  className="px-6 py-2.5 border border-zinc-300 text-zinc-700 text-xs font-bold uppercase tracking-[0.15em] rounded hover:border-zinc-700 transition-all duration-300 disabled:opacity-50"
                >
                  {cargandoMas ? 'Cargando…' : 'Cargar más'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <AfiliadosSuple afiliados={afiliados} />
      <CoberturaMovilSuple />
      <FooterSuple />

      {/* espacio para que el tab bar fijo no tape el último contenido */}
      <div className="h-16" />

      <SupleMobileNav active="inicio" />
    </div>
  )
}
