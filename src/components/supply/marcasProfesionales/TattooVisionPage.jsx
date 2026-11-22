import { Link, useLoaderData } from 'react-router'
import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Award } from 'lucide-react'
import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import BrandCatalogSection from '../BrandCatalogSection'
import SupplyFAQ from '../SupplyFAQ'
import SupplyMobileNav from '../SupplyMobileNav'
import BrandExplodedHero from '../scrollytelling/BrandExplodedHero'
import { getAdjacentBrands } from '../../../data/supplyBrandsOrder'
import { useSupplyVisual } from '../../../hooks/useSupplyVisual'
import { useScrolled } from '../../../hooks/useScrolled'
import { fetchCatalogMarca, fetchSupplyFaq, useLoadMore } from '../../../hooks/useCatalog'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
// fase 6.1 (2026-08-07) — id real en `estudios` vinculado a esta marca,
// solo para leer distribuidor_oficial (la insignia paga). Si el fetch
// falla, simplemente no se muestra insignia — no rompe la página.
const ESTUDIO_ID = 4

export async function loader({ request }) {
  const [catalogo, estudioRes, faqItems] = await Promise.all([
    fetchCatalogMarca('supply', 'tattoo-vision'),
    fetch(`${PANEL_URL}/api/estudios/${ESTUDIO_ID}`).catch(() => null),
    fetchSupplyFaq({ marca: 'tattoo-vision' }),
  ])
  const estudio = estudioRes && estudioRes.ok ? await estudioRes.json() : null
  // ?flechas=0 (fase 6.1, bug real de Jose) — quien llega acá desde el
  // perfil de un estudio en el buscador no debe poder saltar a otra
  // marca sin relación; navegando normal desde el menú de Supply, el
  // parámetro no viene y las flechas se ven como siempre.
  const mostrarFlechas = new URL(request.url).searchParams.get('flechas') !== '0'
  return { ...catalogo, distribuidorOficial: estudio?.distribuidor_oficial || false, mostrarFlechas, faqItems }
}

export function meta() {
  const title = 'Tattoo Vision | Sistemas visuales para tatuadores — INKognito Supply'
  const description = 'Lámparas, gafas y sistemas de visión Tattoo Vision para tatuadores profesionales. Precisión óptica en cada sesión. Disponibles en toda Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/brands/tattoo-vision` },
  ]
}

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

function InsigniaDistribuidorOficial() {
  return (
    <span className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-black text-[9px] font-black uppercase tracking-widest bg-amber-400">
      <Award size={10} /> Distribuidor Oficial
    </span>
  )
}

export default function TattooVisionPage() {
  const { products: productosIniciales, nextCursor, hasMore, distribuidorOficial, mostrarFlechas, faqItems } = useLoaderData()
  const { items: products, hasMore: hasMoreProductos, loading: cargandoMasProductos, loadMore: cargarMasProductos } = useLoadMore('supply', { marca: 'tattoo-vision' }, { items: productosIniciales, nextCursor, hasMore })
  const logoUrl = useSupplyVisual('supply_brand_tattoo_vision')
  const { prev, next } = getAdjacentBrands(0)
  const scrolled = useScrolled(200)
  const [inCatalog, setInCatalog] = useState(false)

  useEffect(() => {
    const el = document.getElementById('catalogo-marca')
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        setInCatalog(entry.isIntersecting || entry.boundingClientRect.top <= 100)
      },
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalogo-marca')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* El navbar se sincroniza: oscuro y técnico durante el despiece, blanco puro en el catálogo */}
      <NavbarCategory pageName="Tattoo Vision" light={inCatalog} />

      {mostrarFlechas && scrolled && (
        <>
          <Link
            to={prev.path} replace
            aria-label={`Ver ${prev.name}`}
            className={`fixed top-16 md:top-20 left-2 md:left-4 z-40 backdrop-blur-sm border rounded-full p-2 transition-colors ${
              inCatalog
                ? 'text-zinc-600 hover:text-black bg-white/80 border-zinc-200'
                : 'text-zinc-300 hover:text-white bg-zinc-900/80 border-zinc-700'
            }`}
          >
            <ArrowLeft size={20} />
          </Link>
          <Link
            to={next.path} replace
            aria-label={`Ver ${next.name}`}
            className={`fixed top-16 md:top-20 right-2 md:right-4 z-40 backdrop-blur-sm border rounded-full p-2 transition-colors ${
              inCatalog
                ? 'text-zinc-600 hover:text-black bg-white/80 border-zinc-200'
                : 'text-zinc-300 hover:text-white bg-zinc-900/80 border-zinc-700'
            }`}
          >
            <ArrowRight size={20} />
          </Link>
        </>
      )}

      {/* HERO SCROLLYTELLING: Despiece técnico interactivo estilo Wiltech */}
      <BrandExplodedHero
        brandKey="tattoo-vision"
        onExploreCatalog={handleScrollToCatalog}
      />

      {/* CATÁLOGO DE PRODUCTOS & DETALLES DE MARCA */}
      <div id="catalogo-marca" className="pt-12 md:pt-16 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="relative overflow-hidden mb-6 md:mb-8">
          <div className="absolute inset-0 opacity-[0.05]" style={DOT_PATTERN} />
          <div className="relative z-10">

          <div className="flex items-center justify-between gap-3 mb-3">
            {mostrarFlechas ? (
              <Link to={prev.path} replace aria-label={`Ver ${prev.name}`} className="flex-shrink-0 text-zinc-400 hover:text-zinc-900 transition-colors">
                <ArrowLeft size={18} />
              </Link>
            ) : <span />}
            <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm text-center flex-1">
              Marca Profesional
            </p>
            {mostrarFlechas ? (
              <Link to={next.path} replace aria-label={`Ver ${next.name}`} className="flex-shrink-0 text-zinc-400 hover:text-zinc-900 transition-colors">
                <ArrowRight size={18} />
              </Link>
            ) : <span />}
          </div>

          {logoUrl === undefined ? (
            <div className="h-20 md:h-32" />
          ) : logoUrl ? (
            <div>
              <div className="float-left w-[180px] mr-6 md:mr-8 mb-2 flex flex-col items-start">
                <img
                  src={logoUrl}
                  alt="Tattoo Vision"
                  className="h-20 md:h-32 w-auto max-w-full object-contain"
                />
                {distribuidorOficial && <InsigniaDistribuidorOficial />}
              </div>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed text-justify [hyphens:auto]">
                Sistemas visuales diseñados para tatuadores profesionales.
                Gafas especializadas, iluminación avanzada y accesorios
                desarrollados para mejorar la visibilidad, reducir reflejos
                y aumentar la precisión durante el proceso de tatuaje.
              </p>
              <div className="clear-both" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
              <div className="flex-shrink-0">
                <h1 className="text-4xl md:text-7xl font-black uppercase leading-none text-zinc-900">
                  Tattoo Vision
                </h1>
                {distribuidorOficial && <InsigniaDistribuidorOficial />}
              </div>
              <p className="max-w-xl text-zinc-600 text-sm md:text-base leading-relaxed text-justify [hyphens:auto] sm:border-l sm:border-zinc-200 sm:pl-8">
                Sistemas visuales diseñados para tatuadores profesionales.
                Gafas especializadas, iluminación avanzada y accesorios
                desarrollados para mejorar la visibilidad, reducir reflejos
                y aumentar la precisión durante el proceso de tatuaje.
              </p>
            </div>
          )}

          </div>
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
