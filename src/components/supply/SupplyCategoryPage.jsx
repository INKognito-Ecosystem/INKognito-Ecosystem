import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import NavbarCategory from './NavbarCategory'
import SupplyMobileNav from './SupplyMobileNav'
import FooterSupply from './FooterSupply'
import logoSupply from '../../assets/milogo/supply.webp'
import AccordionCard from './AccordionCard'
import SupplyProductCard from './SupplyProductCard'
import { fetchCatalogPage } from '../../hooks/useCatalog'
import { FaWhatsapp } from 'react-icons/fa'
import { ExternalLink, Droplet, PenTool, Crosshair, Drill, Hand, ShieldCheck, PlugZap, Toolbox, BedDouble, Package, ArrowLeft, ArrowRight, Search, SlidersHorizontal, MapPin, BookOpen, X } from 'lucide-react'
import { getAdjacentCategories } from '../../data/supplyCategoriesOrder'
import { categories } from './CategoriesSupply'

const AFILIADO_COPY = {
  'Tintas': {
    badge: 'Importación internacional · bajo pedido',
    title: 'Las mismas marcas — traídas directamente del exterior',
    desc:  'Eternal, Intenze, World Famous y más: las mismas marcas de referencia que usas o quieres usar, pero importadas. No están en el mercado local — se gestionan bajo pedido y llegan a Colombia con envío incluido.',
  },
  'Cartuchos': {
    badge: 'Importación internacional · bajo pedido',
    title: 'Cartuchos de marcas internacionales, traídos para ti',
    desc:  'Kwadron, EZ Tattoo, WJX y otros: marcas que no se consiguen fácil en Colombia. Se importan bajo pedido — mismos productos, diferente canal. Consulta disponibilidad y tiempos por WhatsApp.',
  },
  'Agujas': {
    badge: 'Importación internacional · bajo pedido',
    title: 'La configuración exacta que buscas, traída del exterior',
    desc:  'Si necesitas una configuración específica que no hay en el mercado local, estas se importan bajo pedido. Las mismas agujas, sin pasar por distribuidores colombianos.',
  },
  'Máquinas': {
    badge: 'Importación internacional · bajo pedido',
    title: 'Tu próxima rotativa, gestionada desde el exterior',
    desc:  'Equipos de marcas internacionales que raramente llegan al mercado colombiano. Se importan bajo pedido con asesoría incluida — el equipo de INKognito te orienta en la elección antes de confirmar.',
  },
  'Guantes': {
    badge: 'Importación internacional · bajo pedido',
    title: 'Bioseguridad de grado médico, importada directamente',
    desc:  'Los mismos guantes nitrilo que usan estudios de referencia internacional, disponibles para importar en volumen. Calidad certificada que no siempre circula en el mercado local.',
  },
  'Cuidados': {
    badge: 'Importación internacional · bajo pedido',
    title: 'Aftercare de primer nivel, traído directamente',
    desc:  'Cremas y protectores de las marcas que recomiendan tatuadores de referencia fuera del país. Se importan bajo pedido — los mismos productos que ves en referentes internacionales, sin intermediarios locales.',
  },
  'Fuentes': {
    badge: 'Importación internacional · bajo pedido',
    title: 'Fuentes de marcas internacionales, bajo pedido',
    desc:  'Si buscas una fuente específica que no encuentras en Colombia, se puede importar. Consulta disponibilidad y tiempos de entrega por WhatsApp antes de confirmar el pedido.',
  },
  'Accesorios': {
    badge: 'Importación internacional · bajo pedido',
    title: 'Accesorios de estudio que no llegan al mercado local',
    desc:  'Organizadores, racks y accesorios de marcas internacionales que no circulan en Colombia. Importados bajo pedido según lo que necesites para completar tu set.',
  },
  'Mobiliario': {
    badge: 'Importación internacional · bajo pedido',
    title: 'Mobiliario de estándar internacional, importado',
    desc:  'Camillas y mobiliario profesional de nivel internacional, disponibles para importar. Los tiempos de entrega son mayores que el stock local — consulta condiciones antes de pedir.',
  },
  'Combos': {
    badge: 'Importación internacional · bajo pedido',
    title: 'Sets completos de marcas internacionales, bajo pedido',
    desc:  'Combos de equipos y consumibles que no se arman con lo que hay en el mercado local. Se gestionan desde el exterior — ideal para quien quiere escalar con marcas de referencia internacional.',
  },
}

const WA = '573207911013'

// Insignia de proveedor por categoría — antes tenía un texto fijo de
// Tommy Tattoo Supply asumiendo que TODO lo de ink/cartuchos/agujas/etc.
// venía de ahí, pero con proveedores propios (fase 5, 2026-08-07) eso ya
// no es cierto: un producto de la misma categoría puede venir de otro
// estudio/empresa. La atribución real es por producto (ver
// SupplyProductCard.jsx, item.estudio_nombre_supply) — cada card ya
// muestra "Suministrado por X". Mobiliario tenía la misma excepción fija
// nombrando a Industrias Warlock, pero la página de categoría debe quedar
// neutra/universal (Jose, 2026-09-12: "somos el sistema digital, cada
// proveedor es responsable") — se retiró, la atribución por producto ya
// cubre esto igual que en el resto de categorías.
const DEFAULT_BADGE = null
const CATEGORY_BADGE = {
  Combos: null,
}

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

// Mismo patrón de aparición al hacer scroll que StorePage.jsx/SupplyPage.jsx
// — Jose notó que las páginas de categoría de Supply se quedaron sin esto
// (2026-09-12). El hero (título/intro/insignia) queda afuera a propósito:
// ya está visible al cargar, no tiene sentido hacerlo esperar.
const REVEAL = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
}

function AfiliadoCard({ item }) {
  const url = item.url_ventas || item.url_checkout || null
  const inner = (
    <div className="border border-blue-500/20 bg-zinc-950 rounded-2xl overflow-hidden flex flex-col h-full hover:border-blue-500/50 hover:shadow-[0_0_16px_rgba(59,130,246,0.12)] transition-all duration-300">
      <div className="aspect-square w-full bg-zinc-900 overflow-hidden flex-shrink-0 flex items-center justify-center">
        {item.image_url
          ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
          : <ExternalLink size={32} className="text-zinc-700" strokeWidth={1} />
        }
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <span className="text-[9px] font-black uppercase tracking-widest text-blue-400/70">Importación internacional{item.plataforma ? ` · ${item.plataforma}` : ''}</span>
        <h3 className="text-xs font-black uppercase leading-tight text-white">{item.name}</h3>
        {item.descripcion && (
          <p className="text-zinc-500 text-[10px] leading-relaxed flex-1">{item.descripcion}</p>
        )}
        {url && (
          <span className="mt-auto pt-1 text-[9px] font-bold uppercase tracking-widest text-blue-400 flex items-center gap-1">
            Ver recurso <ExternalLink size={9} />
          </span>
        )}
      </div>
    </div>
  )
  return url
    ? <a href={url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 w-[44vw] md:w-auto snap-start">{inner}</a>
    : <div className="flex-shrink-0 w-[44vw] md:w-auto snap-start">{inner}</div>
}


// products/afiliados/providers llegan resueltos por el loader de cada ruta
// (los ~10 wrapper de src/components/supply/categories/*) — ya no se llama
// useCatalog acá adentro, así el servidor manda la primera página real en
// el primer HTML. meta() (título/description/canonical) también quedó en
// cada wrapper, no acá — evita mezclar <Seo>/Helmet con meta() en la misma
// ruta (rompe la hidratación, ver nota en HomePage.jsx).
//
// Paginación real por cursor (2026-09-14) — antes `products` traía la
// categoría COMPLETA y busqueda/orden/provFiltro filtraban en memoria sobre
// ese array ya cargado; "Cargar más" solo revelaba de a bloques de un array
// que ya estaba entero en el cliente. Con proveedores/estudios subiendo su
// propio catálogo a la misma categoría, eso no tiene techo — ahora
// `products`/`nextCursor`/`hasMore` son solo la PRIMERA página (PAGE_SIZE),
// y cada cambio de búsqueda/orden/proveedor dispara una consulta nueva al
// servidor (fetchCatalogPage) en vez de refiltrar un array local. El
// listado de proveedores (`providers`) también viene del servidor —ya no
// se puede derivar de "todos los productos cargados", porque ya no todos
// están cargados.
const PAGE_SIZE = 12

const ORDEN_OPTIONS = [
  { value: 'recientes',  label: 'Recientes' },
  { value: 'precio_asc', label: 'Menor precio' },
]

// light (2026-09-15, piloto de Jose: "cambia el fondo de la page cartuchos
// a blanco... todo incluido el footer y politicas") — SupplyCategoryPage.jsx
// es compartido por las 10 categorías, así que esto se pasa explícito SOLO
// desde CartridgesPage.jsx por ahora, default false para no tocar las
// demás. Si el piloto convence, se replica el prop a los demás wrappers.
export default function SupplyCategoryPage({ title, categoria, slug, intro, guide, faqs, products = [], nextCursor = null, hasMore = false, providers = [], afiliados = [], extraCTA = null, light = false }) {
  const { prev, next } = getAdjacentCategories(slug)
  const t = light ? {
    pageBg: 'bg-white', text: 'text-zinc-900', textMuted: 'text-zinc-500', textMuted2: 'text-zinc-600',
    panel: 'bg-zinc-50', panelAlt: 'bg-white', input: 'bg-zinc-100', border: 'border-zinc-200', borderStrong: 'border-zinc-300',
    hoverBg: 'hover:bg-zinc-100', dotOpacity: 'opacity-[0.05]',
  } : {
    pageBg: 'bg-gray-950', text: 'text-white', textMuted: 'text-zinc-500', textMuted2: 'text-zinc-400',
    panel: 'bg-zinc-950', panelAlt: 'bg-zinc-900', input: 'bg-zinc-900', border: 'border-zinc-800', borderStrong: 'border-zinc-700',
    hoverBg: 'hover:bg-zinc-800', dotOpacity: 'opacity-[0.11]',
  }

  // Si la categoría tiene stock alguna vez, en base a la primera página
  // servida por el loader — a diferencia de `items` (que sí cambia con
  // cada búsqueda/filtro), esto decide entre el estado vacío "todavía no
  // vendemos esto" (con CTA de WhatsApp) y "sin resultados para tu
  // búsqueda" (con botón de quitar filtros) más abajo.
  const hayStockInicial = products.length > 0

  const [items, setItems] = useState(products)
  const [cursor, setCursor] = useState(nextCursor)
  const [masDisponible, setMasDisponible] = useState(hasMore)
  const [cargandoMas, setCargandoMas] = useState(false)
  const [cargandoFiltro, setCargandoFiltro] = useState(false)
  // Descripción de categoría en sheet, no siempre visible (2026-09-15,
  // Jose: "que la gente sepa que encontrará una descripción allí, pero que
  // no pelee con lo demás visualmente") — el texto sigue en el HTML inicial
  // (SSR, mismo `intro` de siempre) solo que colapsado hasta que lo abren,
  // así no se pierde el contenido para SEO/AEO. Solo móvil — desktop sigue
  // mostrando el párrafo completo como siempre.
  const [introAbierto, setIntroAbierto] = useState(false)

  const [provFiltro, setProvFiltro] = useState('todos')
  const [orden, setOrden] = useState('recientes')
  const [busqueda, setBusqueda] = useState('')
  const [provBusqueda, setProvBusqueda] = useState('')

  // Botones de orden y proveedor: solo ícono, las opciones (texto) aparecen
  // en un panel al pulsarlos (Jose, 2026-09-12) — se cierran solos al hacer
  // clic afuera de cualquiera de los dos.
  const [ordenAbierto, setOrdenAbierto] = useState(false)
  const [provAbierto, setProvAbierto] = useState(false)
  const ordenRef = useRef(null)
  const provRef = useRef(null)
  // Versión móvil de los mismos dropdowns (2026-09-15, buscador migrado a
  // la barra superior) — refs propios porque un mismo ref no puede
  // apuntar a dos elementos montados a la vez (el bloque de escritorio
  // queda montado, solo oculto con `hidden md:flex`). El estado de datos
  // (busqueda/orden/provFiltro) sí se comparte, son los mismos filtros.
  const [ordenAbiertoM, setOrdenAbiertoM] = useState(false)
  const [provAbiertoM, setProvAbiertoM] = useState(false)
  const ordenRefM = useRef(null)
  const provRefM = useRef(null)
  useEffect(() => {
    function onClickFuera(e) {
      if (ordenRef.current && !ordenRef.current.contains(e.target)) setOrdenAbierto(false)
      if (provRef.current && !provRef.current.contains(e.target)) setProvAbierto(false)
      if (ordenRefM.current && !ordenRefM.current.contains(e.target)) setOrdenAbiertoM(false)
      if (provRefM.current && !provRefM.current.contains(e.target)) setProvAbiertoM(false)
    }
    document.addEventListener('mousedown', onClickFuera)
    return () => document.removeEventListener('mousedown', onClickFuera)
  }, [])

  // Sin tildes/mayúsculas para que "cartucho" encuentre "Cartúcho" — mismo
  // criterio de búsqueda insensible a acentos usado en otros buscadores del
  // ecosistema (ej. directorio de artistas). Sigue viva acá SOLO para el
  // filtro de proveedor (lista corta, ya cargada completa) — la búsqueda de
  // producto ahora la resuelve el servidor (ILIKE, no acento-insensible;
  // ver nota en server.js).
  const normaliza = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

  // Ordenados por ciudad (Jose, 2026-09-12: "relacionarlo con el lugar de
  // donde es el supply") — la ciudad va pegada al nombre en cada fila (no
  // como encabezado aparte: era una etiqueta gris tan chica que Jose no la
  // notaba con un solo proveedor). El orden por ciudad igual agrupa
  // visualmente a los de la misma ciudad uno seguido del otro.
  const proveedoresOrdenados = useMemo(() => {
    return providers
      .map(p => ({ id: p.estudio_id, nombre: p.nombre, municipio: p.municipio || null, slug: p.slug || null }))
      .sort((a, b) => (a.municipio || '').localeCompare(b.municipio || '') || a.nombre.localeCompare(b.nombre))
  }, [providers])

  const proveedoresFiltrados = useMemo(() => {
    if (!provBusqueda.trim()) return proveedoresOrdenados
    const q = normaliza(provBusqueda)
    return proveedoresOrdenados.filter(p => normaliza(p.nombre).includes(q) || normaliza(p.municipio).includes(q))
  }, [proveedoresOrdenados, provBusqueda])

  // Cada cambio de búsqueda/orden/proveedor pide una página NUEVA al
  // servidor (cursor reiniciado) — se salta en el primer render porque esa
  // primera página ya llegó resuelta por el loader (SSR), no tiene sentido
  // repetirla apenas monta. Búsqueda lleva debounce (300ms); orden/proveedor
  // son selección directa, sin debounce.
  const primerRender = useRef(true)
  useEffect(() => {
    if (primerRender.current) { primerRender.current = false; return }
    let activo = true
    setCargandoFiltro(true)
    const estudioId = provFiltro === 'todos' ? undefined : provFiltro
    const demora = busqueda ? 300 : 0
    const timer = setTimeout(async () => {
      const page = await fetchCatalogPage('supply', { categoria, tipo: 'fisico', limit: PAGE_SIZE, orden, q: busqueda.trim() || undefined, estudioId })
      if (!activo) return
      setItems(page.items)
      setCursor(page.nextCursor)
      setMasDisponible(page.hasMore)
      setCargandoFiltro(false)
    }, demora)
    return () => { activo = false; clearTimeout(timer) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orden, busqueda, provFiltro])

  async function cargarMas() {
    if (!masDisponible || cargandoMas) return
    setCargandoMas(true)
    const estudioId = provFiltro === 'todos' ? undefined : provFiltro
    const page = await fetchCatalogPage('supply', { categoria, tipo: 'fisico', limit: PAGE_SIZE, orden, q: busqueda.trim() || undefined, estudioId, cursor })
    setItems(prev => [...prev, ...page.items])
    setCursor(page.nextCursor)
    setMasDisponible(page.hasMore)
    setCargandoMas(false)
  }

  return (
    <>
      <div className="hidden md:block">
        <NavbarCategory pageName={title} backPath="/supply" backLabel="Supply" />
      </div>

      {/* Top bar compacta + tab bar inferior, solo móvil (2026-09-15) —
          mismo patrón que MobileHomeSupply.jsx: el navbar fijo de arriba se
          reemplaza por esto, nav/carrito/menú bajan a la barra inferior
          (SupplyMobileNav, compartida por todas las categorías porque
          SupplyCategoryPage.jsx es el componente compartido de todas). */}
      {/* Barra superior — blanca con íconos azules en el piloto de Cartuchos
          (2026-09-15, Jose: "ambos navbar blancos, íconos azul claro"). */}
      <div className={`md:hidden sticky top-0 z-40 flex items-center gap-2 px-4 py-2 ${light ? 'bg-white' : 'bg-black'} border-b border-blue-500/20`}>
        <Link to="/supply" aria-label="Volver a Supply" className="flex-shrink-0">
          <img src={logoSupply} alt="INKognito Supply" className="w-12 h-12 object-contain" />
        </Link>
        <>
          <div className="relative flex-1 min-w-0">
            <Search size={14} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${light ? 'text-blue-400' : 'text-zinc-600'} pointer-events-none`} />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={`Buscar en categoría ${title.toLowerCase()}`}
                className={light
                  ? 'w-full min-w-0 bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs rounded-lg pl-8 pr-2 py-2 placeholder:text-zinc-500 focus:outline-none focus:border-blue-400'
                  : 'w-full min-w-0 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-lg pl-8 pr-2 py-2 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500'}
              />
            </div>
            {proveedoresOrdenados.length > 0 && (
              <div className="relative flex-shrink-0" ref={provRefM}>
                <button
                  type="button"
                  onClick={() => setProvAbiertoM(o => !o)}
                  aria-label="Filtrar por proveedor"
                  aria-expanded={provAbiertoM}
                  className={`flex items-center justify-center w-9 h-9 border rounded-lg transition-colors ${light ? 'bg-zinc-100' : 'bg-zinc-900'} ${
                    provAbiertoM || provFiltro !== 'todos' ? 'border-blue-500 text-blue-400' : light ? 'border-zinc-200 text-blue-400' : 'border-zinc-800 text-zinc-400'
                  }`}
                >
                  <MapPin size={14} />
                </button>
                {provAbiertoM && (
                  <div className="absolute right-0 top-full mt-1.5 z-20 w-64 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden">
                    <div className="p-2 border-b border-zinc-800">
                      <div className="relative">
                        <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                        <input
                          type="text"
                          value={provBusqueda}
                          onChange={(e) => setProvBusqueda(e.target.value)}
                          placeholder="Buscar proveedor o ciudad"
                          className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-md pl-7 pr-2 py-1.5 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setProvFiltro('todos'); setProvBusqueda(''); setProvAbiertoM(false) }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                        provFiltro === 'todos' ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-300'
                      }`}
                    >
                      Todos los proveedores
                    </button>
                    <div className="max-h-60 overflow-y-auto border-t border-zinc-800">
                      {proveedoresFiltrados.length === 0 ? (
                        <p className="px-3 py-3 text-xs text-zinc-600">Ningún proveedor coincide</p>
                      ) : proveedoresFiltrados.map(p => (
                        <div key={p.id} className="flex items-center">
                          <button
                            type="button"
                            onClick={() => { setProvFiltro(String(p.id)); setProvBusqueda(''); setProvAbiertoM(false) }}
                            className={`flex-1 min-w-0 text-left px-3 py-2 text-xs truncate transition-colors ${
                              provFiltro === String(p.id) ? 'text-blue-400 bg-blue-500/10 font-bold' : 'text-zinc-300'
                            }`}
                          >
                            {p.nombre}
                            {p.municipio && <span className="text-zinc-600 font-normal"> · {p.municipio}</span>}
                          </button>
                          <Link
                            to={`/supply/${p.slug || `estudio/${p.id}`}`}
                            onClick={(e) => e.stopPropagation()}
                            title={`Ver catálogo completo de ${p.nombre}`}
                            className="flex-shrink-0 px-2.5 py-2 text-zinc-600"
                          >
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="relative flex-shrink-0" ref={ordenRefM}>
              <button
                type="button"
                onClick={() => setOrdenAbiertoM(o => !o)}
                aria-label="Ordenar por"
                aria-expanded={ordenAbiertoM}
                className={`flex items-center justify-center w-9 h-9 border rounded-lg transition-colors ${light ? 'bg-zinc-100' : 'bg-zinc-900'} ${
                  ordenAbiertoM ? 'border-blue-500 text-blue-400' : light ? 'border-zinc-200 text-blue-400' : 'border-zinc-800 text-zinc-400'
                }`}
              >
                <SlidersHorizontal size={14} />
              </button>
              {ordenAbiertoM && (
                <div className="absolute right-0 top-full mt-1.5 z-20 min-w-[140px] bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-xl">
                  {ORDEN_OPTIONS.map(o => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => { setOrden(o.value); setOrdenAbiertoM(false) }}
                      className={`w-full text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                        orden === o.value ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-400'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
        </>
      </div>
      <SupplyMobileNav active="categorias" light={light} />

      {/* Ya no hay flechas prev/next flotantes al hacer scroll (2026-09-15,
          Jose: "quítales las flechas que aparecen cuando hago scroll, ya
          no serán necesarias") — quitado el bloque `{scrolled && ...}` que
          las mostraba (fixed, encima del contenido) junto con useScrolled,
          que ya no se usaba para nada más acá. Las flechas prev/next fijas
          del hero de escritorio (más abajo, sin scroll de por medio) no se
          tocaron — son un control de navegación aparte, no lo que Jose
          reportó. */}
      {/* pb-16 (64px), no pb-20 (80px) — 2026-09-15, Jose: "el copyright...
          queda lejos del navbar de abajo, hazlo más compacto". Medido con
          Playwright: el tab bar fijo de SupplyMobileNav mide ~58px, no
          80 — mismo ajuste en EstudioSupplyPage.jsx/SupplyPage.jsx. */}
      <div className={`${t.pageBg} pt-0 pb-16 md:pt-24 md:pb-0`}>

        {/* HERO — H1 + ícono de categoría en móvil */}
        <div className="relative overflow-hidden px-6 max-w-7xl mx-auto pb-5 md:pb-10">
          <div className={`absolute inset-0 ${t.dotOpacity}`} style={DOT_PATTERN} />
          {/* Desktop — flechas prev/next + "Categoría", sin cambios */}
          <div className="relative z-10 hidden md:flex items-center gap-3 mb-2">
            {prev && (
              <Link
                to={`/supply/${prev.slug}`} replace
                aria-label={`Ver ${prev.name}`}
                className={`flex-shrink-0 ${t.textMuted} hover:${light ? 'text-black' : 'text-white'} transition-colors`}
              >
                <ArrowLeft size={20} />
              </Link>
            )}
            <p className={`flex-1 text-center uppercase tracking-[0.25em] ${t.textMuted} text-xs`}>Categoría</p>
            {next && (
              <Link
                to={`/supply/${next.slug}`} replace
                aria-label={`Ver ${next.name}`}
                className={`flex-shrink-0 ${t.textMuted} hover:${light ? 'text-black' : 'text-white'} transition-colors`}
              >
                <ArrowRight size={20} />
              </Link>
            )}
          </div>

          {/* Móvil — tira de categorías en vez de flechas (2026-09-15, mismo
              patrón que MobileHomeSupply.jsx), con el disparador de
              descripción integrado al final, chico y sin texto.
              En el piloto claro (Cartuchos, light) va dentro de una franja
              azul sólida que también envuelve la insignia de stock (Jose,
              2026-09-15: "que ese listón sea de color azul") — fuera del
              piloto sigue igual que siempre, sin franja. La separación con
              extraCTA después de la franja es mt-3, no pegada (ver ese
              bloque más abajo — Jose pidió primero sin espacio, después
              corrigió a la misma distancia que separa el banner en
              MobileHomeSupply.jsx). */}
          {light ? (
            // py-3, no pt-4/pb-4 (2026-09-15, Jose: "el listón está muy
            // ancho en vertical, usa el mismo tamaño que tiene ese listón
            // en la page principal") — mismo padding vertical que la fila
            // de categorías de MobileHomeSupply.jsx (px-4 py-3).
            <div className="md:hidden relative z-10 -mx-6 px-6 py-3 bg-blue-500">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {categories.map(cat => (
                    <Link
                      key={cat.name}
                      to={cat.path}
                      className={`flex-shrink-0 text-[12px] font-extrabold pb-1 border-b-2 whitespace-nowrap ${
                        cat.cat === categoria ? 'text-white border-white' : 'text-blue-100 border-transparent'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                {intro && (
                  <button
                    type="button"
                    onClick={() => setIntroAbierto(true)}
                    aria-label={`Sobre ${title.toLowerCase()}`}
                    className="flex-shrink-0 w-7 h-7 rounded-full border border-white/50 flex items-center justify-center text-white"
                  >
                    <BookOpen size={14} />
                  </button>
                )}
              </div>
              {/* mt-3 acá, no mb-3 en la fila de arriba (2026-09-15) — así
                  el espacio solo existe cuando la insignia realmente se
                  renderiza; sin ella la franja queda del mismo alto que la
                  de MobileHomeSupply.jsx, sin espacio vacío de sobra. */}
              {hayStockInicial && (categoria in CATEGORY_BADGE ? CATEGORY_BADGE[categoria] : DEFAULT_BADGE) && (
                <div className="flex items-center gap-2 text-xs text-zinc-600 bg-white border border-white/70 rounded-lg px-3 py-2 w-fit mt-3">
                  <ShieldCheck size={14} className="shrink-0 text-blue-500" />
                  <span>{categoria in CATEGORY_BADGE ? CATEGORY_BADGE[categoria] : DEFAULT_BADGE}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="md:hidden relative z-10 flex items-center gap-2 mb-3 -mx-6 px-6">
              <div className="flex-1 flex gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {categories.map(cat => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    className={`flex-shrink-0 text-[12px] font-extrabold pb-1 border-b-2 whitespace-nowrap ${
                      cat.cat === categoria ? `${t.text} border-blue-500` : `${t.textMuted} border-transparent`
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              {intro && (
                <button
                  type="button"
                  onClick={() => setIntroAbierto(true)}
                  aria-label={`Sobre ${title.toLowerCase()}`}
                  className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center ${t.textMuted} ${t.border}`}
                >
                  <BookOpen size={14} />
                </button>
              )}
            </div>
          )}

          <div className="hidden md:flex relative z-10 items-center justify-center gap-3 mb-4">
            <h1 className={`text-4xl font-black uppercase tracking-tight leading-none ${t.text} text-center whitespace-nowrap`}>{title}</h1>
          </div>
          {intro && (
            <p className={`hidden md:block relative z-10 ${t.textMuted2} text-base md:text-lg leading-relaxed max-w-3xl text-justify [hyphens:auto]`}>{intro}</p>
          )}
          {hayStockInicial && (categoria in CATEGORY_BADGE ? CATEGORY_BADGE[categoria] : DEFAULT_BADGE) && (
            <div className={`${light ? 'hidden md:flex' : 'flex'} relative z-10 items-center gap-2 text-xs ${t.textMuted2} ${t.panelAlt} border ${t.border} rounded-lg px-3 py-2 w-fit mt-4`}>
              <ShieldCheck size={14} className="shrink-0 text-blue-400" />
              <span>{categoria in CATEGORY_BADGE ? CATEGORY_BADGE[categoria] : DEFAULT_BADGE}</span>
            </div>
          )}
          {extraCTA && (
            // mt-3 en móvil claro (2026-09-15, Jose: "separa también la
            // card de caja surtida, a la misma distancia de separación a
            // la que está el banner en la page principal") — mismo mt-3
            // que separa la fila de categorías del banner promocional en
            // MobileHomeSupply.jsx. Reemplaza el mt-0 de la vuelta
            // anterior (pegado sin espacio). Escritorio y fuera del
            // piloto siguen con mt-4 normal.
            <div className={`relative z-10 ${light ? 'mt-3 md:mt-4' : 'mt-4'}`}>{extraCTA}</div>
          )}
        </div>

        {/* Sheet de descripción — afuera del Hero (que tiene overflow-hidden;
            un fixed adentro queda recortado y se ve raro, ya nos pasó una
            vez con el modal de Educación). */}
        {introAbierto && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/70 flex items-end"
            onClick={() => setIntroAbierto(false)}
          >
            <div
              className={`w-full max-w-md ${t.panel} border-t ${t.border} rounded-t-2xl p-5`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-xs font-black uppercase tracking-widest ${t.text}`}>{title}</h4>
                <button onClick={() => setIntroAbierto(false)} className={t.textMuted}><X size={20} /></button>
              </div>
              <p className={`${t.textMuted2} text-sm leading-relaxed`}>{intro}</p>
            </div>
          </div>
        )}

        {/* PRODUCTOS FÍSICOS — grid en los tres anchos (2/3/4 columnas) */}
        <motion.div {...REVEAL} className="pb-10 max-w-7xl mx-auto">
          <div className="hidden md:flex flex-nowrap items-center gap-2 px-6 mb-5">
              <div className="relative flex-1 min-w-0">
                <Search size={14} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${t.textMuted} pointer-events-none`} />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder={`Buscar en categoría ${title.toLowerCase()}`}
                  className={`w-full min-w-0 ${t.input} border ${t.border} ${t.text} text-xs rounded-lg pl-8 pr-2 py-2 placeholder:${t.textMuted} focus:outline-none focus:border-blue-500`}
                />
              </div>
              {proveedoresOrdenados.length > 0 && (
                <div className="relative flex-shrink-0" ref={provRef}>
                  <button
                    type="button"
                    onClick={() => setProvAbierto(o => !o)}
                    aria-label="Filtrar por proveedor"
                    aria-expanded={provAbierto}
                    className={`flex items-center justify-center w-9 h-9 bg-zinc-900 border rounded-lg transition-colors ${
                      provAbierto || provFiltro !== 'todos' ? 'border-blue-500 text-blue-400' : 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <MapPin size={14} />
                  </button>
                  {provAbierto && (
                    <div className="absolute right-0 top-full mt-1.5 z-20 w-64 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden">
                      <div className="p-2 border-b border-zinc-800">
                        <div className="relative">
                          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                          <input
                            type="text"
                            value={provBusqueda}
                            onChange={(e) => setProvBusqueda(e.target.value)}
                            placeholder="Buscar proveedor o ciudad"
                            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-md pl-7 pr-2 py-1.5 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setProvFiltro('todos'); setProvBusqueda(''); setProvAbierto(false) }}
                        className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                          provFiltro === 'todos' ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                        }`}
                      >
                        Todos los proveedores
                      </button>
                      <div className="max-h-60 overflow-y-auto border-t border-zinc-800">
                        {proveedoresFiltrados.length === 0 ? (
                          <p className="px-3 py-3 text-xs text-zinc-600">Ningún proveedor coincide</p>
                        ) : proveedoresFiltrados.map(p => (
                          <div key={p.id} className="flex items-center">
                            <button
                              type="button"
                              onClick={() => { setProvFiltro(String(p.id)); setProvBusqueda(''); setProvAbierto(false) }}
                              className={`flex-1 min-w-0 text-left px-3 py-2 text-xs truncate transition-colors ${
                                provFiltro === String(p.id) ? 'text-blue-400 bg-blue-500/10 font-bold' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                              }`}
                            >
                              {p.nombre}
                              {p.municipio && <span className="text-zinc-600 font-normal"> · {p.municipio}</span>}
                            </button>
                            <Link
                              to={`/supply/${p.slug || `estudio/${p.id}`}`}
                              onClick={(e) => e.stopPropagation()}
                              title={`Ver catálogo completo de ${p.nombre}`}
                              className="flex-shrink-0 px-2.5 py-2 text-zinc-600 hover:text-blue-400 transition-colors"
                            >
                              <ExternalLink size={12} />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="relative flex-shrink-0" ref={ordenRef}>
                <button
                  type="button"
                  onClick={() => setOrdenAbierto(o => !o)}
                  aria-label="Ordenar por"
                  aria-expanded={ordenAbierto}
                  className={`flex items-center justify-center w-9 h-9 bg-zinc-900 border rounded-lg transition-colors ${
                    ordenAbierto ? 'border-blue-500 text-blue-400' : 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <SlidersHorizontal size={14} />
                </button>
                {ordenAbierto && (
                  <div className="absolute right-0 top-full mt-1.5 z-20 min-w-[140px] bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-xl">
                    {ORDEN_OPTIONS.map(o => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => { setOrden(o.value); setOrdenAbierto(false) }}
                        className={`w-full text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                          orden === o.value ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          {!hayStockInicial ? (
            <div className={`mx-6 border border-blue-500/20 ${t.panel} rounded-2xl p-10 text-center`}>
              <p className={`${t.textMuted} text-[10px] font-bold uppercase tracking-widest mb-2`}>Sin stock por el momento</p>
              <p className={`${t.text} text-lg font-black uppercase mb-2`}>Próximamente disponible</p>
              <p className={`${t.textMuted} text-sm mb-6 max-w-sm mx-auto`}>
                Déjanos tu número y te avisamos cuando tengamos {title.toLowerCase()} disponibles. Sé el primero en saber.
              </p>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hola, quiero que me avisen cuando haya ${title} disponibles en INKognito Supply.`)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold uppercase tracking-[0.15em] text-sm rounded hover:bg-blue-600 transition"
              >
                <FaWhatsapp size={18} />
                Avisarme cuando haya stock →
              </a>
            </div>
          ) : items.length === 0 && !cargandoFiltro ? (
            <div className={`mx-6 border ${t.border} ${t.panel} rounded-2xl p-8 text-center`}>
              <p className={`${t.textMuted2} text-sm mb-4`}>Ningún producto coincide con tu búsqueda o filtro.</p>
              <button
                type="button"
                onClick={() => { setBusqueda(''); setProvFiltro('todos') }}
                className="text-blue-400 text-xs font-bold uppercase tracking-widest hover:text-blue-300 transition-colors"
              >
                Quitar filtros
              </button>
            </div>
          ) : (
            <div className={`transition-opacity duration-200 ${cargandoFiltro ? 'opacity-50' : 'opacity-100'}`}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-6">
                {items.map(item => (
                  <SupplyProductCard key={`${item.name}-${item.estudio_id ?? 'x'}`} item={item} categoria={categoria} light={light} />
                ))}
              </div>
              {masDisponible && (
                <div className="flex justify-center mt-6 px-6">
                  <button
                    onClick={cargarMas}
                    disabled={cargandoMas}
                    className="px-6 py-2.5 border border-blue-500/40 text-blue-400 text-xs font-bold uppercase tracking-[0.15em] rounded hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300 disabled:opacity-50"
                  >
                    {cargandoMas ? 'Cargando…' : 'Cargar más'}
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* RECURSOS DIGITALES AFILIADOS — sección fija, siempre visible */}
        {(() => {
          const copy = AFILIADO_COPY[categoria] || { badge: `Recursos para ${title.toLowerCase()}`, title: 'Lleva tu técnica al siguiente nivel', desc: `Selección curada para dominar ${title.toLowerCase()}.` }
          return (
          <motion.div {...REVEAL} className="pb-10 max-w-7xl mx-auto px-6">
            <div className="border-t-2 border-blue-500/20 pt-8 mb-6">
              <p className="text-blue-400/70 text-[10px] font-bold uppercase tracking-widest mb-1">✦ {copy.badge}</p>
              <h2 className={`text-xl md:text-2xl font-black uppercase leading-none ${t.text}`}>
                {copy.title}
              </h2>
              <p className={`${t.textMuted} text-sm mt-2 max-w-lg leading-relaxed`}>
                {copy.desc}
              </p>
            </div>
            {afiliados.length > 0 ? (
              <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-3 md:pb-0 scrollbar-hide">
                {afiliados.map(item => (
                  <AfiliadoCard key={item.name} item={item} />
                ))}
              </div>
            ) : (
              <div className={`border border-blue-500/20 ${t.panel} rounded-2xl p-6 text-center`}>
                <p className={`${t.textMuted} text-sm mb-4 max-w-sm mx-auto`}>
                  Aún no tenemos activo el canal de importación para {title.toLowerCase()}. Avísanos y te contactamos en cuanto esté disponible — gestionamos el pedido desde el exterior.
                </p>
                <a
                  href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hola, quiero que me avisen cuando haya ${title} disponibles en INKognito Supply.`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white font-bold uppercase tracking-[0.15em] text-xs rounded hover:bg-blue-600 transition"
                >
                  <FaWhatsapp size={16} />
                  Avisarme cuando haya stock →
                </a>
              </div>
            )}
          </motion.div>
          )
        })()}


        {/* ACORDEONES — guía de compra y FAQ */}
        {(guide?.length > 0 || faqs?.length > 0) && (
          <motion.div {...REVEAL} className="px-6 pb-16 max-w-7xl mx-auto flex flex-col gap-4">

            {guide?.length > 0 && (
              <AccordionCard
                light={light}
                icon="📖"
                title={`Cómo elegir ${title.toLowerCase()}`}
                subtitle="Tipos, usos, compatibilidad y qué factores tener en cuenta antes de comprar. Toca para desplegar la guía completa."
              >
                <div className="flex flex-col gap-5">
                  {guide.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-2xl flex-shrink-0">{item.icon}</span>
                      <div>
                        <p className={`font-black uppercase ${t.text} text-xs tracking-[0.1em] mb-1`}>{item.title}</p>
                        <p className={`${t.textMuted} text-sm leading-relaxed`}>{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionCard>
            )}

            {faqs?.length > 0 && (
              <AccordionCard
                light={light}
                icon="❓"
                title="Preguntas frecuentes"
                subtitle="Envíos, calidad, cantidades y todo lo que necesitas saber antes de hacer tu pedido. Toca para ver las respuestas."
              >
                <div className="flex flex-col gap-5">
                  {faqs.map((faq, i) => (
                    <div key={faq.id ?? i} className={i < faqs.length - 1 ? `pb-5 border-b ${t.border}` : ''}>
                      <p className={`font-bold ${t.text} text-sm mb-2`}>{faq.pregunta}</p>
                      <p className={`${t.textMuted} text-sm leading-relaxed`}>{faq.respuesta}</p>
                    </div>
                  ))}
                </div>
              </AccordionCard>
            )}

          </motion.div>
        )}

        <FooterSupply light={light} />
      </div>
    </>
  )
}
