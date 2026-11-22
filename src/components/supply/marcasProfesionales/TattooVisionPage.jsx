import { Link, useLoaderData } from 'react-router'
import { ArrowLeft, ArrowRight, Award } from 'lucide-react'
import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import BrandCatalogSection from '../BrandCatalogSection'
import SupplyFAQ from '../SupplyFAQ'
import SupplyMobileNav from '../SupplyMobileNav'
import BrandShowcaseHero from '../BrandShowcaseHero'
import { getAdjacentBrands } from '../../../data/supplyBrandsOrder'
import { useSupplyVisual } from '../../../hooks/useSupplyVisual'
import { useScrolled } from '../../../hooks/useScrolled'
import { fetchCatalogMarca, fetchSupplyFaq, useLoadMore } from '../../../hooks/useCatalog'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ESTUDIO_ID = 4

export async function loader({ request }) {
  const [catalogo, estudioRes, faqItems] = await Promise.all([
    fetchCatalogMarca('supply', 'tattoo-vision'),
    fetch(`${PANEL_URL}/api/estudios/${ESTUDIO_ID}`).catch(() => null),
    fetchSupplyFaq({ marca: 'tattoo-vision' }),
  ])
  const estudio = estudioRes && estudioRes.ok ? await estudioRes.json() : null
  const mostrarFlechas = new URL(request.url).searchParams.get('flechas') !== '0'
  return { ...catalogo, distribuidorOficial: estudio?.distribuidor_oficial || false, mostrarFlechas, faqItems }
}

export function meta() {
  const title = 'Tattoo Vision | Gafas Polarizadas y Sistemas Ópticos de Hernán Yepes — INKognito Supply'
  const description = 'Gafas de tecnología polarizada TR90 y sistemas ópticos creados por Hernán Yepes. Eliminan el 100% de los reflejos en la piel para control de saturación y degradado. Disponibles en Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/brands/tattoo-vision` },
  ]
}

export default function TattooVisionPage() {
  const { products: productosIniciales, nextCursor, hasMore, distribuidorOficial, mostrarFlechas, faqItems } = useLoaderData()
  const { items: products, hasMore: hasMoreProductos, loading: cargandoMasProductos, loadMore: cargarMasProductos } = useLoadMore('supply', { marca: 'tattoo-vision' }, { items: productosIniciales, nextCursor, hasMore })
  const logoUrl = useSupplyVisual('supply_brand_tattoo_vision')
  const { prev, next } = getAdjacentBrands(0)
  const scrolled = useScrolled(120)

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalogo-marca')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Navbar en blanco puro coherente con todo Supply */}
      <NavbarCategory pageName="Tattoo Vision" light />

      {mostrarFlechas && scrolled && (
        <>
          <Link
            to={prev.path} replace
            aria-label={`Ver ${prev.name}`}
            className="fixed top-16 md:top-20 left-2 md:left-4 z-40 text-zinc-600 hover:text-black bg-white/90 backdrop-blur-md border border-zinc-200/80 shadow-sm rounded-full p-2 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <Link
            to={next.path} replace
            aria-label={`Ver ${next.name}`}
            className="fixed top-16 md:top-20 right-2 md:right-4 z-40 text-zinc-600 hover:text-black bg-white/90 backdrop-blur-md border border-zinc-200/80 shadow-sm rounded-full p-2 transition-colors"
          >
            <ArrowRight size={20} />
          </Link>
        </>
      )}

      {/* SHOWCASE PREMIUM: Producto fotográfico real flotando en blanco con sombra y specs */}
      <BrandShowcaseHero
        brandKey="tattoo-vision"
        logoUrl={logoUrl}
        distribuidorOficial={distribuidorOficial}
        onExploreCatalog={handleScrollToCatalog}
      />

      {/* CATÁLOGO DE PRODUCTOS & DETALLES DE MARCA */}
      <div id="catalogo-marca" className="pt-10 md:pt-14 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="flex items-center justify-between gap-3 mb-8 pb-4 border-b border-zinc-100">
          {mostrarFlechas ? (
            <Link to={prev.path} replace aria-label={`Ver ${prev.name}`} className="flex-shrink-0 text-zinc-400 hover:text-zinc-900 transition-colors">
              <ArrowLeft size={18} />
            </Link>
          ) : <span />}
          <div className="text-center">
            <p className="uppercase tracking-[0.25em] text-zinc-400 text-xs font-semibold">
              Catálogo Oficial
            </p>
            <h3 className="text-xl sm:text-2xl font-black uppercase text-zinc-900 tracking-tight mt-0.5">
              Productos & Equipamiento Tattoo Vision
            </h3>
          </div>
          {mostrarFlechas ? (
            <Link to={next.path} replace aria-label={`Ver ${next.name}`} className="flex-shrink-0 text-zinc-400 hover:text-zinc-900 transition-colors">
              <ArrowRight size={18} />
            </Link>
          ) : <span />}
        </div>

        <BrandCatalogSection brandName="Tattoo Vision" products={products} supplierBadge={null} hasMore={hasMoreProductos} onLoadMore={cargarMasProductos} loadingMore={cargandoMasProductos} light />

        <SupplyFAQ items={faqItems} nombre="Tattoo Vision" light />

      </div>

      <FooterSupply light />
      <div className="h-16 md:hidden" />
      <SupplyMobileNav active="marcas" light />

    </div>
  )
}
