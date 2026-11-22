import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react'
import {
  Search, ShoppingCart, Package, GraduationCap,
  Store, Globe, UserCircle, Truck,
  ShieldCheck, Check, ArrowRight, X, Sparkles
} from 'lucide-react'
import { useSupplyCart } from '../../contexts/SupplyCartContext'
import CartDrawerSupply from './CartDrawerSupply'
import SupplyProductCard from './SupplyProductCard'
import BrandsMarquee from './BrandsMarquee'
import FooterSupply from './FooterSupply'
import TechMarquee from '../TechMarquee'
import LegalModal from '../legal/LegalModal'
import MisComprasPanel from '../pedido/MisComprasPanel'
import InkognitoModuleMenu from '../InkognitoModuleMenu'
import AnimatedWordmark from '../AnimatedWordmark'
import { categories, catKey } from './CategoriesSupply'
import { brands, brandKey } from './BrandsSupply'
import { fetchCatalogPage, useLoadMore } from '../../hooks/useCatalog'
import { irAMiSupply } from '../../lib/supplyTienda'
import { leerMisCompras } from '../../lib/misCompras'
import logoSupply from '../../assets/milogo/supply.webp'

const DOT_PATTERN_LIGHT = {
  backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
  backgroundSize: '20px 20px',
}

export default function DesktopHomeSupply({ counts = {}, imgs = {}, initialProducts }) {
  const navigate = useNavigate()
  const { count } = useSupplyCart()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [comprasOpen, setComprasOpen] = useState(false)
  const [legalOpen, setLegalOpen] = useState(null)
  const [misComprasCount, setMisComprasCount] = useState(0)

  // Scroll reactivo para efectos de profundidad y stagger estilo Fractaill
  const { scrollY } = useScroll()
  const heroCopyY = useTransform(scrollY, [0, 450], [0, 24])
  const heroShowcaseY = useTransform(scrollY, [0, 450], [0, -24])
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.88])
  const scrollPillOpacity = useTransform(scrollY, [0, 90], [1, 0])

  useEffect(() => {
    setMisComprasCount(leerMisCompras().length)
  }, [])

  // Búsqueda inteligente interactiva en Desktop
  const [busqueda, setBusqueda] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [resultados, setResultados] = useState(null)
  const searchInputRef = useRef(null)

  // Cátalogo y paginación por cursor ("Cargar más" en desktop)
  const { items: products, hasMore, loading: loadingMore, loadMore } = useLoadMore(
    'supply',
    {},
    initialProducts
  )

  const normaliza = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

  useEffect(() => {
    const q = busqueda.trim()
    if (q.length < 2) {
      setResultados(null)
      setBuscando(false)
      return
    }
    setBuscando(true)
    const t = setTimeout(async () => {
      const qNorm = normaliza(q)
      const categoriaCoincide = categories.find(c => normaliza(c.cat).includes(qNorm))
      const [porNombre, porCategoria] = await Promise.all([
        fetchCatalogPage('supply', { q, limit: 16 }),
        categoriaCoincide
          ? fetchCatalogPage('supply', { categoria: categoriaCoincide.cat, tipo: 'fisico', limit: 16 })
          : Promise.resolve({ items: [] }),
      ])
      const mapa = new Map()
      for (const item of [...porCategoria.items, ...porNombre.items]) {
        mapa.set(`${item.name}-${item.estudio_id ?? 'x'}`, item)
      }
      setResultados([...mapa.values()])
      setBuscando(false)
    }, 280)
    return () => clearTimeout(t)
  }, [busqueda])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const displayedProducts = resultados !== null ? resultados : products

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* ── TOP HEADER / NAVBAR EMPRESARIAL BLANCO ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all">
        {/* Barra superior fina de contexto */}
        <div className="bg-zinc-900 text-white text-[11px] font-medium py-1.5 px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between tracking-wide">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Truck size={13} className="text-blue-400" /> Despachos a toda Colombia · Urabá y cobertura nacional
              </span>
              <span className="text-zinc-500">|</span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <ShieldCheck size={13} className="text-emerald-400" /> Proveedores y marcas 100% verificados
              </span>
            </div>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => irAMiSupply(navigate)}
                className="hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                <Store size={12} /> Acceso para Proveedores (Mi Supply)
              </button>
              <span className="text-zinc-500">|</span>
              <Link to="/" className="hover:text-zinc-300 transition-colors flex items-center gap-1">
                <Globe size={12} /> Ecosistema INKognito
              </Link>
            </div>
          </div>
        </div>

        {/* Fila principal de navegación */}
        <div className="max-w-7xl mx-auto px-8 py-3.5 flex items-center justify-between gap-8">
          {/* LOGO OFICIAL */}
          <Link to="/supply" className="flex items-center gap-3 shrink-0 group">
            <img
              src={logoSupply}
              alt="INKognito Supply"
              className="w-11 h-11 object-contain transition-transform group-hover:scale-105"
            />
            <div>
              <div className="text-xl font-black uppercase tracking-[0.12em] leading-tight text-zinc-900">
                <AnimatedWordmark moduleWord="SUPPLY" accentClassName="text-blue-600" />
              </div>
              <span className="block text-[9.5px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                Insumos para Tatuadores
              </span>
            </div>
          </Link>

          {/* BUSCADOR EXPANDIDO CENTRAL */}
          <div className="relative flex-1 max-w-xl">
            <div className="relative flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar máquinas, tintas, agujas, cartuchos, marcas..."
                className="w-full pl-11 pr-10 py-2.5 bg-zinc-100 hover:bg-zinc-100/80 focus:bg-white text-zinc-900 text-sm rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-zinc-400"
              />
              <Search
                size={18}
                className="absolute left-3.5 text-zinc-400 pointer-events-none"
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => { setBusqueda(''); searchInputRef.current?.focus() }}
                  className="absolute right-3 p-1 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200 transition-all"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {buscando && (
              <span className="absolute right-10 top-3 text-[11px] font-semibold text-blue-600 animate-pulse">
                Buscando…
              </span>
            )}
          </div>

          {/* ACCIONES Y BOTONES DERECHA */}
          <div className="flex items-center gap-5 shrink-0">
            {/* Mis compras */}
            {misComprasCount > 0 && (
              <button
                type="button"
                onClick={() => setComprasOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-zinc-700 hover:text-blue-600 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-blue-50 transition-all"
              >
                <Package size={17} className="text-zinc-500" />
                <span>Mis compras ({misComprasCount})</span>
              </button>
            )}

            {/* Selector de módulos rápido */}
            <div className="border-l border-zinc-200 pl-4">
              <InkognitoModuleMenu
                current="supply"
                only={['store']}
                extraLinks={[{ label: 'INK — Directorio de Artistas', to: '/tattoo-artist-colombia' }]}
                textClassName="text-zinc-700 hover:text-blue-600 font-bold"
                label="Módulos"
                uppercase={false}
                textSize="text-xs"
              />
            </div>

            {/* CARRITO PRINCIPAL CON CONTADOR */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-blue-500/25 transition-all font-bold text-xs uppercase tracking-wider group"
            >
              <ShoppingCart size={17} className="transition-transform group-hover:scale-110" />
              <span>Carrito</span>
              {count > 0 && (
                <span className="ml-1 min-w-[20px] h-5 rounded-full bg-white text-blue-600 text-[10px] font-black flex items-center justify-center px-1">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Barra de navegación secundaria (Categorías rápidas y anclas) */}
        <div className="bg-zinc-50/80 border-t border-zinc-200/80 px-8 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-semibold text-zinc-600">
            <div className="flex items-center gap-7 overflow-x-auto py-1">
              <button
                onClick={() => scrollToSection('destacados')}
                className="hover:text-blue-600 transition-colors uppercase tracking-wider flex items-center gap-1.5"
              >
                <Sparkles size={13} className="text-blue-500" /> Productos Destacados
              </button>
              <button
                onClick={() => scrollToSection('categorias')}
                className="hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                Categorías de Insumos
              </button>
              <button
                onClick={() => scrollToSection('marcas')}
                className="hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                Marcas Oficiales
              </button>
              <Link
                to="/supply/proveedores"
                className="hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                Tiendas Verificadas
              </Link>
              <button
                onClick={() => scrollToSection('educacion')}
                className="hover:text-blue-600 transition-colors uppercase tracking-wider flex items-center gap-1.5"
              >
                <GraduationCap size={14} className="text-amber-500" /> Formación & Recursos
              </button>
              <button
                onClick={() => scrollToSection('cobertura')}
                className="hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                Logística y Cobertura
              </button>
            </div>

            <Link
              to="/supply/proveedores/unete"
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 tracking-wide uppercase flex items-center gap-1 hover:underline"
            >
              ¿Tienes una tienda de supply? Vende aquí →
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER EMPRESARIAL DESKTOP (BLANCO CON EFECTO FRACTAILL) ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white py-14 px-8 border-b border-zinc-100">
        <div className="absolute inset-0 pointer-events-none" style={DOT_PATTERN_LIGHT} />
        {/* Glow ambiental sutil */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-gradient-to-bl from-blue-400/10 via-sky-300/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-12 gap-8 items-center">
          {/* Izquierda: Copy institucional con stagger y parallax suave */}
          <motion.div
            style={{ y: heroCopyY, opacity: heroOpacity }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100/70 border border-blue-200 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              Plataforma B2B de Suministros
            </div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.05] text-zinc-950 mb-4">
              Equipamiento e insumos <span className="text-blue-600">profesionales</span> para tatuadores.
            </h1>
            <p className="text-zinc-600 text-base lg:text-lg leading-relaxed max-w-2xl mb-8">
              Conectamos a tatuadores y estudios de Colombia con las marcas más reconocidas y distribuidores verificados. Máquinas, tintas, cartuchos y accesorios con stock real y despacho inmediato.
            </p>

            {/* Badges de confianza */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-zinc-200/80 max-w-xl">
              <div className="hover:-translate-y-0.5 transition-transform">
                <p className="text-2xl font-black text-zinc-900">100%</p>
                <p className="text-zinc-500 text-xs font-medium">Marcas originales y verificadas</p>
              </div>
              <div className="border-l border-zinc-200 pl-4 hover:-translate-y-0.5 transition-transform">
                <p className="text-2xl font-black text-blue-600">Nacional</p>
                <p className="text-zinc-500 text-xs font-medium">Envíos directos a toda Colombia</p>
              </div>
              <div className="border-l border-zinc-200 pl-4 hover:-translate-y-0.5 transition-transform">
                <p className="text-2xl font-black text-zinc-900">Mercado Pago</p>
                <p className="text-zinc-500 text-xs font-medium">Pagos y compras protegidas</p>
              </div>
            </div>
          </motion.div>

          {/* Derecha: Vitrina destacada con offset opuesto de parallax */}
          <motion.div
            style={{ y: heroShowcaseY }}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-5 bg-white/90 backdrop-blur-md border border-zinc-200 rounded-2xl p-6 shadow-lg shadow-zinc-200/50"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                <Sparkles size={13} className="text-blue-600" /> Marcas Oficiales Verificadas
              </span>
              <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                Catálogo en línea
              </span>
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              Accede a los suministros de los fabricantes y distribuidores referentes de la industria del tatuaje:
            </p>
            <div className="py-2 overflow-hidden">
              <BrandsMarquee imgs={imgs} light={true} />
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-xs text-zinc-500 italic">“De un tatuador, para tatuadores.”</span>
              <button
                onClick={() => scrollToSection('categorias')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group/btn"
              >
                Explorar catálogo <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Indicador de scroll flotante estilo Fractaill */}
        <motion.div
          style={{ opacity: scrollPillOpacity }}
          className="max-w-7xl mx-auto mt-8 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
            Desliza para explorar el ecosistema de insumos ↓
          </div>
        </motion.div>
      </section>

      {/* ── RESULTADOS DE BÚSQUEDA ACTIVOS (SI EL USUARIO ESCRIBIÓ ALGO) ── */}
      {resultados !== null && (
        <section className="max-w-7xl mx-auto px-8 py-8 border-b border-zinc-200 bg-blue-50/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">
                Resultados para &ldquo;{busqueda}&rdquo;
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Se encontraron {resultados.length} producto{resultados.length !== 1 ? 's' : ''} coincidentes
              </p>
            </div>
            <button
              onClick={() => setBusqueda('')}
              className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 rounded-lg text-zinc-700 transition-all"
            >
              Limpiar búsqueda
            </button>
          </div>

          {resultados.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-zinc-200">
              <p className="text-zinc-400 text-base font-semibold mb-1">No se encontraron productos coincidentes</p>
              <p className="text-zinc-500 text-xs">Intenta con otro término (ej. &ldquo;cartuchos&rdquo;, &ldquo;dynamic&rdquo;, &ldquo;máquinas&rdquo;)</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {resultados.map((item) => (
                <SupplyProductCard
                  key={`${item.name}-${item.estudio_id ?? 'x'}`}
                  item={item}
                  categoria="general"
                  light={true}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── EXPLORADOR VISUAL DE CATEGORÍAS (GRID 5x2 EN BLANCO) ── */}
      <section id="categorias" className="max-w-7xl mx-auto px-8 py-14 border-b border-zinc-200">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 block mb-1">
              Líneas de Producto
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-950">
              Categorías de Insumos
            </h2>
          </div>
          <p className="text-sm text-zinc-500 max-w-md text-right">
            Selecciona la categoría para consultar stock disponible, calibres y variantes de nuestros proveedores.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat, idx) => {
            const count = counts[cat.cat] || 0
            const hasStock = count > 0
            const imgKey = cat.imgKey || catKey(cat.cat)
            const imgUrl = imgs[imgKey]

            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.45, delay: (idx % 5) * 0.05 }}
              >
                <Link
                  to={cat.path}
                  className="group relative h-40 bg-zinc-50 hover:bg-white rounded-2xl border border-zinc-200 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 flex flex-col justify-between overflow-hidden"
                >
                  {imgUrl ? (
                    <>
                      <img
                        src={imgUrl}
                        alt={cat.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="relative z-10 flex justify-end">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${hasStock ? 'bg-blue-600 text-white' : 'bg-black/60 text-zinc-300'}`}>
                          {hasStock ? `${count} ${count > 1 ? 'prods' : 'prod'}` : 'Consultar'}
                        </span>
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-sm font-black uppercase tracking-wider text-white">
                          {cat.name}
                        </h3>
                        <span className="text-[10px] font-semibold text-blue-300 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                          Ver catálogo →
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <cat.icon size={20} />
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${hasStock ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-zinc-200 text-zinc-500'}`}>
                          {hasStock ? `${count} disponibles` : 'Consultar'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 group-hover:text-blue-600 transition-colors">
                          {cat.name}
                        </h3>
                        <span className="text-[10px] font-bold text-zinc-400 group-hover:text-blue-500 transition-colors uppercase tracking-wider flex items-center gap-1 mt-0.5">
                          Explorar →
                        </span>
                      </div>
                    </>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS DEL CATÁLOGO (CATÁLOGO VIVO) ── */}
      <section id="destacados" className="max-w-7xl mx-auto px-8 py-14 border-b border-zinc-200">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 block mb-1">
              Inventario en Tiempo Real
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-950">
              Productos Destacados
            </h2>
          </div>
          <Link
            to="/supply/categorias"
            className="text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 flex items-center gap-1.5 hover:underline"
          >
            Ver todas las categorías completas <ArrowRight size={14} />
          </Link>
        </div>

        {displayedProducts.length === 0 ? (
          <div className="text-center py-16 bg-zinc-50 rounded-2xl border border-zinc-200">
            <p className="text-zinc-400 text-sm font-semibold mb-1">No hay productos destacados cargados en este momento</p>
            <p className="text-zinc-500 text-xs">Consulta las categorías individuales en la barra superior</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {displayedProducts.map((item) => (
              <SupplyProductCard
                key={`${item.name}-${item.estudio_id ?? 'x'}`}
                item={item}
                categoria="destacados"
                light={true}
              />
            ))}
          </div>
        )}

        {/* Botón de cargar más productos si hay más disponibles en el catálogo */}
        {resultados === null && hasMore && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="px-8 py-3 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-black uppercase tracking-widest border border-zinc-300 rounded-xl shadow-sm hover:border-blue-500 hover:text-blue-600 transition-all disabled:opacity-50"
            >
              {loadingMore ? 'Cargando más productos…' : 'Cargar más insumos ↓'}
            </button>
          </div>
        )}
      </section>

      {/* ── SECCIÓN MARCAS PROFESIONALES OFICIALES ── */}
      <section id="marcas" className="bg-zinc-50 py-14 px-8 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 block mb-1">
                Distribuidores y Fabricantes
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-950">
                Marcas Referentes
              </h2>
            </div>
            <p className="text-xs text-zinc-500 max-w-sm text-right">
              Garantía de procedencia y control de calidad directo con distribuidores autorizados.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {brands.map((brand) => {
              const key = brand.imgKey || brandKey(brand.name)
              const imgUrl = imgs[key] || brand.img
              const CardContent = (
                <div className="h-28 bg-white border border-zinc-200 hover:border-blue-500 rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all group">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={brand.name}
                      className="max-h-12 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-xs font-black uppercase tracking-wider text-zinc-700 text-center">
                      {brand.name}
                    </span>
                  )}
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-blue-600 transition-colors">
                    {brand.name}
                  </span>
                </div>
              )

              return brand.to ? (
                <Link key={brand.name} to={brand.to} className="block">
                  {CardContent}
                </Link>
              ) : (
                <div key={brand.name} className="opacity-90">
                  {CardContent}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SECCIÓN FORMACIÓN Y EDUCACIÓN PARA EL ARTISTA (TEMA CLARO) ── */}
      <section id="educacion" className="max-w-7xl mx-auto px-8 py-14 border-b border-zinc-200">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 block mb-1">
            Crecimiento Profesional
          </span>
          <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-950 mb-2">
            Educación y Recursos para el Artista
          </h2>
          <p className="text-sm text-zinc-500 max-w-2xl leading-relaxed">
            Formación práctica en técnica, bioseguridad, armado de kits de trabajo y guías descargables creadas para optimizar tu estudio.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Card Cursos */}
          <div className="border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-5 shadow-sm">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-xl font-black uppercase text-zinc-950 mb-2">
                Domina tu oficio.<br />
                <span className="text-amber-600">No lo improvises.</span>
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                Formación integral en técnica, bioseguridad, calibración de máquinas y administración de estudio. Acceso flexible para aprender a tu propio ritmo.
              </p>
            </div>
            <Link
              to="/supply/aprende/cursos"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-black uppercase text-xs tracking-wider bg-amber-500 hover:bg-amber-600 text-white transition-colors"
            >
              Explorar Cursos →
            </Link>
          </div>

          {/* Card Kit */}
          <div className="border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-5 shadow-sm">
                <Package size={24} />
              </div>
              <h3 className="text-xl font-black uppercase text-zinc-950 mb-2">
                Equípate bien<br />
                <span className="text-blue-600">desde el primer día.</span>
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                Guía de equipamiento básico y configuraciones recomendadas para armar tu mesa de trabajo con criterio profesional y sin sobrecostos.
              </p>
            </div>
            <Link
              to="/supply/aprende/kit"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-black uppercase text-xs tracking-wider bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Ver Kit Recomendado →
            </Link>
          </div>

          {/* Card Recursos */}
          <div className="border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-5 shadow-sm">
                <Check size={24} />
              </div>
              <h3 className="text-xl font-black uppercase text-zinc-950 mb-2">
                Conocimiento<br />
                <span className="text-emerald-600">gratuito y directo.</span>
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                Plantillas técnicas, guías de cuidados posteriores y herramientas descargables creadas para potenciar tu rendimiento diario.
              </p>
            </div>
            <Link
              to="/supply/aprende/recursos"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-black uppercase text-xs tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              Ver Recursos Gratuitos →
            </Link>
          </div>
        </div>
      </section>

      {/* ── COBERTURA Y LOGÍSTICA DE DISTRIBUCIÓN ── */}
      <section id="cobertura" className="bg-zinc-50 py-14 px-8 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 items-center">
          <div className="col-span-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 block mb-1">
              Logística Integrada
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-950 mb-4">
              Cobertura de Entrega en Toda Colombia
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed mb-6">
              Nuestra plataforma digital conecta a los proveedores de insumos con los artistas de todo el país. Al confirmar tu compra, el despacho se asigna directamente al proveedor correspondiente, garantizando disponibilidad inmediata, embalaje seguro y trazabilidad del envío.
            </p>
            <div className="flex items-center gap-6 text-xs font-semibold text-zinc-700">
              <span className="flex items-center gap-2">
                <Check size={16} className="text-blue-600" /> Cobertura directa Urabá (Apartadó, Turbo, Carepa, Chigorodó)
              </span>
              <span className="flex items-center gap-2">
                <Check size={16} className="text-blue-600" /> Envíos nacionales certificados a ciudades principales
              </span>
            </div>
          </div>

          <div className="col-span-4 bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm text-center">
            <Store size={32} className="mx-auto text-blue-600 mb-3" />
            <h3 className="text-base font-black uppercase tracking-wider text-zinc-900 mb-1">
              ¿Eres distribuidor de supply?
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Publica tu catálogo, recibe cobros directos por Mercado Pago y accede a miles de artistas en todo el país.
            </p>
            <Link
              to="/supply/proveedores/unete"
              className="inline-block w-full py-2.5 px-4 bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
            >
              Registrar Tienda Supply
            </Link>
          </div>
        </div>
      </section>

      {/* ── TECNOLOGÍAS USADAS Y PIE DE PÁGINA (LIGHT) ── */}
      <TechMarquee light={true} />
      <FooterSupply light={true} />

      {/* Modales y drawers */}
      <CartDrawerSupply open={drawerOpen} onClose={() => setDrawerOpen(false)} light={true} />
      <MisComprasPanel open={comprasOpen} onClose={() => setComprasOpen(false)} />
      <LegalModal type={legalOpen} variant="ecosystem" onClose={() => setLegalOpen(null)} />
    </div>
  )
}
