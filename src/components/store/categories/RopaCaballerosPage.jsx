import { useState, useEffect, useRef } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, X, Search } from 'lucide-react'
import NavbarCategoryStore from '../NavbarCategoryStore'
import StoreMobileNav from '../StoreMobileNav'
import FooterStore from '../FooterStore'
import LlegamosDondeEstas from '../LlegamosDondeEstas'
import AccordionCardStore from '../AccordionCardStore'
import { FaWhatsapp } from 'react-icons/fa'
import StoreProductCard from '../StoreProductCard'
import { fetchCatalogCategoriaItems, fetchCatalogPage, toProdCard, useLoadMore } from '../../../hooks/useCatalog'
import { getAdjacentCategories } from '../../../data/storeCategoriesOrder'
import { categories } from '../../../data/storeCategories.jsx'
import { useScrolled } from '../../../hooks/useScrolled'
import logoStore from '../../../assets/milogo/store.webp'

import CategoriaVaciaCard from '../../CategoriaVaciaCard'
const TITLE = 'Ropa Deportiva Caballeros'
const CATEGORIA_DB = 'Ropa Caballeros'
const DESCRIPCION = 'Camisetas dry-fit, shorts y joggers para el hombre activo. Diseños de marcas reconocidas con telas que resisten el sudor y el calor de Urabá. Despacho con Ruta del Golfo a toda la región — pago contraentrega, sin adelantos.'

export async function loader() {
  return fetchCatalogCategoriaItems('store', CATEGORIA_DB)
}

export function meta() {
  const title = 'Ropa para caballero | INKognito Store — Urabá'
  const description = 'Shorts, camisetas dry-fit, joggers y conjuntos deportivos para hombre en Urabá. Calidad premium para gym, running y ciclismo en el clima cálido de la región.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/store/ropa-caballeros` },
  ]
}

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const STRIPE_PATTERN = {
  backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 19px,rgba(201,168,76,1) 19px,rgba(201,168,76,1) 20px)',
}

const faqs = [
  {
    q: '¿Los productos son de proveedores confiables?',
    a: 'Sí. INKognito Store es una tienda online que trabaja con proveedores verificados y reconocidos, no reventa sin control. Cada producto se revisa antes de despacharse.',
  },
  {
    q: '¿Cómo llega mi pedido y en cuánto tiempo?',
    a: 'Despachamos con Ruta del Golfo, nuestra red de transportadoras verificadas en toda la región de Urabá — el tiempo exacto depende de la transportadora y la zona. Pago contraentrega: pagas cuando recibes el paquete, sin adelantos.',
  },
  {
    q: '¿Qué pasa si la talla que recibo no me queda?',
    a: 'Las tallas disponibles las ves directamente en cada producto del catálogo. Si tienes duda entre dos tallas, escríbenos por WhatsApp con tu medida de pecho y cintura en centímetros y te orientamos antes de confirmar. Si la talla llegó y no queda bien, coordina el cambio dentro de los 3 días hábiles de recibido.',
  },
  {
    q: '¿Las telas aguantan el entrenamiento y el calor de Urabá?',
    a: 'Sí. Dry-fit con ventilación activa y costuras reforzadas para uso intenso en el clima cálido de la región. Shorts, joggers y camisetas fabricados con los mismos estándares de las marcas de referencia — a un precio accesible.',
  },
]

export default function RopaCaballerosPage() {
  const { items: itemsIniciales, nextCursor, hasMore } = useLoaderData()
  const { items: catalogItems, hasMore: hayMasProductos, loading: cargandoMasProductos, loadMore: cargarMasProductos } =
    useLoadMore('store', { categoria: CATEGORIA_DB }, { items: itemsIniciales, nextCursor, hasMore })
  const { prev, next } = getAdjacentCategories('ropa-caballeros')
  const scrolled = useScrolled()
  const [introAbierto, setIntroAbierto] = useState(false)

  // Centra la categoría activa en el listón horizontal al entrar a la
  // página (2026-09-16, mismo bug/mismo arreglo que SupplyCategoryPage.jsx).
  const activeTabRef = useRef(null)
  useEffect(() => {
    activeTabRef.current?.scrollIntoView({ behavior: 'instant', inline: 'center', block: 'nearest' })
  }, [])

  // Buscador dentro de la categoría (2026-09-16, Jose: "el buscador debe
  // aparecer también en cada categoría... debe filtrar dentro de su
  // categoría como lo hace Supply") — mismo patrón que SupplyCategoryPage.jsx.
  const [busqueda, setBusqueda] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [resultados, setResultados] = useState(null)

  useEffect(() => {
    const q = busqueda.trim()
    if (q.length < 2) { setResultados(null); setBuscando(false); return }
    setBuscando(true)
    const t = setTimeout(async () => {
      const page = await fetchCatalogPage('store', { categoria: CATEGORIA_DB, q, limit: 24 })
      setResultados(page.items)
      setBuscando(false)
    }, 300)
    return () => clearTimeout(t)
  }, [busqueda])

  const gridItems = resultados ?? catalogItems

  return (
    <>
      <div className="hidden md:block">
        <NavbarCategoryStore pageName="Ropa Caballeros" />
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
            placeholder={`Buscar en categoría ${TITLE.toLowerCase()}`}
            className="w-full min-w-0 bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs rounded-lg pl-8 pr-2 py-2 placeholder:text-zinc-500 focus:outline-none focus:border-[#C9A84C]"
          />
        </div>
      </div>

      {scrolled && prev && (
        <Link
          to={`/store/${prev.slug}`} replace
          aria-label={`Ver ${prev.name}`}
          className="fixed top-16 md:top-20 left-2 md:left-4 z-40 text-gray-500 hover:text-gray-900 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full p-2 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
      )}
      {scrolled && next && (
        <Link
          to={`/store/${next.slug}`} replace
          aria-label={`Ver ${next.name}`}
          className="fixed top-16 md:top-20 right-2 md:right-4 z-40 text-gray-500 hover:text-gray-900 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full p-2 transition-colors"
        >
          <ArrowRight size={20} />
        </Link>
      )}

      {/* HERO */}
      <div className="relative overflow-hidden bg-gray-50 pt-0 md:pt-24">
        <div className="absolute inset-0 opacity-[0.13]" style={STRIPE_PATTERN} />
        <div className="relative z-10 pb-4 px-6 max-w-7xl mx-auto">
          {/* Desktop — flechas prev/next + "Categoría", sin cambios */}
          <div className="hidden md:flex items-center gap-3 mb-2">
            {prev && (
              <Link to={`/store/${prev.slug}`} replace aria-label={`Ver ${prev.name}`} className="flex-shrink-0 text-gray-400 hover:text-gray-900 transition-colors">
                <ArrowLeft size={20} />
              </Link>
            )}
            <p className="flex-1 text-center uppercase tracking-[0.25em] text-[#C9A84C] text-xs">Categoría</p>
            {next && (
              <Link to={`/store/${next.slug}`} replace aria-label={`Ver ${next.name}`} className="flex-shrink-0 text-gray-400 hover:text-gray-900 transition-colors">
                <ArrowRight size={20} />
              </Link>
            )}
          </div>

          {/* Móvil — listón dorado de categorías + ícono de libro para la descripción */}
          <div className="md:hidden -mx-6 px-6 py-3 mb-3" style={{ backgroundColor: '#C9A84C' }}>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={cat.link}
                    ref={cat.link === '/store/ropa-caballeros' ? activeTabRef : null}
                    className={`flex-shrink-0 text-[12px] font-extrabold pb-1 border-b-2 whitespace-nowrap ${
                      cat.link === '/store/ropa-caballeros' ? 'text-black border-black' : 'text-black/60 border-transparent'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIntroAbierto(true)}
                aria-label={`Sobre ${TITLE.toLowerCase()}`}
                className="flex-shrink-0 w-7 h-7 rounded-full border border-black/30 flex items-center justify-center text-black"
              >
                <BookOpen size={14} />
              </button>
            </div>
          </div>

          {/* Título — solo desktop, el listón ya identifica la categoría en móvil */}
          <h1 className="hidden md:block text-7xl font-black uppercase leading-none mb-2 text-gray-900 text-left">
            {TITLE}
          </h1>
          <p className="hidden md:block uppercase tracking-[0.2em] text-gray-500 text-xs mb-4 text-left">
            Gym • Running • Ciclismo • Urbano
          </p>
          <p className="hidden md:block text-gray-700 leading-relaxed max-w-2xl text-sm md:text-lg text-justify [hyphens:auto]">
            {DESCRIPCION}
          </p>
        </div>
      </div>

      {introAbierto && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/70 flex items-end" onClick={() => setIntroAbierto(false)}>
          <div className="w-full max-w-md bg-white border-t border-gray-200 rounded-t-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">{TITLE}</h4>
              <button onClick={() => setIntroAbierto(false)} className="text-gray-400"><X size={20} /></button>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{DESCRIPCION}</p>
          </div>
        </div>
      )}

      {/* PRODUCTS */}
      <div className="bg-gray-50 pt-4 pb-8 md:pb-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="hidden md:flex items-center gap-2 mb-5">
            <div className="relative flex-1 min-w-0">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={`Buscar en categoría ${TITLE.toLowerCase()}`}
                className="w-full min-w-0 bg-white border border-gray-200 text-gray-900 text-sm rounded-lg pl-9 pr-3 py-2.5 placeholder:text-gray-400 focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
          </div>

          {buscando ? (
            <p className="text-gray-400 text-sm text-center py-10">Buscando…</p>
          ) : gridItems.length === 0 ? (
            resultados ? (
              <p className="text-gray-400 text-sm text-center py-10">Ningún producto coincide con tu búsqueda.</p>
            ) : (
            <CategoriaVaciaCard className="border border-[#C9A84C]/30 bg-white" labelClassName="text-gray-400" titleClassName="text-gray-900" />
            )
          ) : (
            <>
            <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
              {gridItems.map(item => {
                const prod = toProdCard(item)
                const sizes = item.variantes.map(v => v.variant).filter(Boolean)
                return (
                  <div key={item.name} className="snap-start flex-shrink-0 w-[44vw] md:w-auto">
                    <StoreProductCard
                      product={prod}
                      category="ropa-caballeros"
                      sizes={sizes.length ? sizes : CLOTHING_SIZES}
                    />
                  </div>
                )
              })}
            </div>
            {!resultados && hayMasProductos && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={cargarMasProductos}
                  disabled={cargandoMasProductos}
                  className="px-6 py-2.5 border border-[#C9A84C]/40 text-[#C9A84C] text-xs font-bold uppercase tracking-[0.15em] rounded hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all duration-300 disabled:opacity-50"
                >
                  {cargandoMasProductos ? 'Cargando…' : 'Cargar más'}
                </button>
              </div>
            )}
            </>
          )}
        </div>
      </div>

      {/* CTA DARK — solo desktop */}
      <div className="hidden md:block bg-black py-16 px-6 text-center">
        <a
          href="https://wa.me/573207911013?text=Hola,%20quiero%20ver%20el%20catálogo%20completo%20de%20ropa%20deportiva%20caballeros"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-5 rounded-xl border text-white uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.2)] hover:border-[#C9A84C]"
          style={{ borderColor: 'rgba(201,168,76,0.3)', backgroundColor: 'rgba(201,168,76,0.04)' }}
        >
          <FaWhatsapp size={22} />
          Ver catálogo completo
        </a>
      </div>

      {/* FAQ */}
      <div className="bg-white py-10 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <AccordionCardStore
            icon="❓"
            title="Preguntas frecuentes"
            subtitle="Envíos, tallas y todo lo que necesitas saber antes de tu pedido. Toca para ver las respuestas."
          >
            <div className="flex flex-col gap-5">
              {faqs.map((faq, i) => (
                <div key={i} className={i < faqs.length - 1 ? 'pb-5 border-b border-gray-200' : ''}>
                  <p className="font-bold text-gray-900 text-sm mb-2">{faq.q}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </AccordionCardStore>
        </div>
      </div>

      <LlegamosDondeEstas />

      <FooterStore />

      <div className="h-16 md:hidden bg-white" />

      <StoreMobileNav active="categorias" />
    </>
  )
}
