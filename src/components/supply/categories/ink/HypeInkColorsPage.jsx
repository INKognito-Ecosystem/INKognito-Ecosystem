import { Link, useLoaderData } from 'react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import BrandCatalogSection from '../../BrandCatalogSection'
import SupplyFAQ from '../../SupplyFAQ'
import SupplyMobileNav from '../../SupplyMobileNav'
import { getAdjacentBrands } from '../../../../data/supplyBrandsOrder'
import { useSupplyVisual } from '../../../../hooks/useSupplyVisual'
import { useScrolled } from '../../../../hooks/useScrolled'
import { fetchCatalogMarca, fetchSupplyFaq, useLoadMore } from '../../../../hooks/useCatalog'

export function meta() {
  const title = 'Tintas Hype Ink | INKognito Supply — Colombia'
  const description = 'Hype Ink por Kasasink y Lea. Fórmula colombiana de negro puro ultra saturado y pigmentos de alta densidad para líneas y sombras perfectas.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/ink/hype-ink` },
  ]
}

export async function loader() {
  const [catalogo, faqItems] = await Promise.all([
    fetchCatalogMarca('supply', 'hype-ink'),
    fetchSupplyFaq({ marca: 'hype-ink' }),
  ])
  return { ...catalogo, faqItems }
}

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

export default function HypeInkColorsPage() {
  const { products: productosIniciales, nextCursor, hasMore, faqItems } = useLoaderData()
  const { items: products, hasMore: hasMoreProductos, loading: cargandoMasProductos, loadMore: cargarMasProductos } = useLoadMore(
    'supply',
    { marca: 'hype-ink' },
    { items: productosIniciales, nextCursor, hasMore }
  )
  const logoUrl = useSupplyVisual('supply_brand_hype_ink')
  const { prev, next } = getAdjacentBrands(5)
  const scrolled = useScrolled()

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <NavbarCategory pageName="Hype Ink" light />

      {scrolled && (
        <>
          <Link
            to={prev.path}
            replace
            aria-label={`Ver ${prev.name}`}
            className="fixed top-16 md:top-20 left-2 md:left-4 z-40 text-zinc-600 hover:text-black bg-white/80 backdrop-blur-sm border border-zinc-200 rounded-full p-2 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <Link
            to={next.path}
            replace
            aria-label={`Ver ${next.name}`}
            className="fixed top-16 md:top-20 right-2 md:right-4 z-40 text-zinc-600 hover:text-black bg-white/80 backdrop-blur-sm border border-zinc-200 rounded-full p-2 transition-colors"
          >
            <ArrowRight size={20} />
          </Link>
        </>
      )}

      <div className="pt-20 md:pt-24 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="relative overflow-hidden mb-6 md:mb-8">
          <div className="absolute inset-0 opacity-[0.05]" style={DOT_PATTERN} />
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-3 mb-3">
              <Link
                to={prev.path}
                replace
                aria-label={`Ver ${prev.name}`}
                className="flex-shrink-0 text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <ArrowLeft size={18} />
              </Link>
              <p className="uppercase tracking-[0.25em] text-zinc-400 text-xs md:text-sm text-center flex-1">
                Marca Nacional Profesional
              </p>
              <Link
                to={next.path}
                replace
                aria-label={`Ver ${next.name}`}
                className="flex-shrink-0 text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <ArrowRight size={18} />
              </Link>
            </div>

            {logoUrl === undefined ? (
              <div className="h-20 md:h-32" />
            ) : logoUrl ? (
              <div className="text-justify [hyphens:auto]">
                <div className="float-left w-[180px] mr-6 md:mr-8 mb-2 flex justify-center">
                  <img
                    src={logoUrl}
                    alt="Hype Ink"
                    className="h-20 md:h-32 w-auto max-w-full object-contain"
                  />
                </div>
                <p className="text-zinc-600 leading-relaxed mb-3">
                  Hype Ink nace del talento e investigación de los reconocidos artistas colombianos Cristian Casas (Kasasink) y Lea. Desarrollada para resolver las mayores exigencias de la piel y las técnicas modernas de tatuaje en América Latina.
                </p>
                <p className="text-zinc-600 leading-relaxed mb-3">
                  Su formulación estrella, <strong>Hype Ink Black</strong>, se distingue por su tono negro neutral ultra concentrado: no azula ni toma visos verdosos con los años, conservando un tono oscuro contundente tanto en curado rápido como en sesiones extensas.
                </p>
                <p className="text-zinc-600 leading-relaxed">
                  Con una viscosidad equilibrada y excelente dispersión de pigmento, Hype Ink permite una penetración suave y continua sin sobrecargar el tejido. Orgullo de manufactura y estándar profesional para los artistas más exigentes.
                </p>
                <div className="clear-both" />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
                <h1 className="text-4xl md:text-7xl font-black uppercase leading-none flex-shrink-0 text-zinc-900">
                  Hype Ink
                </h1>

                <div className="max-w-xl text-justify [hyphens:auto] sm:border-l sm:border-zinc-200 sm:pl-8">
                  <p className="text-zinc-600 leading-relaxed mb-3">
                    Hype Ink nace del talento e investigación de los reconocidos artistas colombianos Cristian Casas (Kasasink) y Lea. Desarrollada para resolver las mayores exigencias de la piel y las técnicas modernas de tatuaje en América Latina.
                  </p>
                  <p className="text-zinc-600 leading-relaxed mb-3">
                    Su formulación estrella, <strong>Hype Ink Black</strong>, se distingue por su tono negro neutral ultra concentrado: no azula ni toma visos verdosos con los años, conservando un tono oscuro contundente tanto en curado rápido como en sesiones extensas.
                  </p>
                  <p className="text-zinc-600 leading-relaxed">
                    Con una viscosidad equilibrada y excelente dispersión de pigmento, Hype Ink permite una penetración suave y continua sin sobrecargar el tejido. Orgullo de manufactura y estándar profesional para los artistas más exigentes.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <BrandCatalogSection
          brandName="Hype Ink"
          products={products}
          hasMore={hasMoreProductos}
          onLoadMore={cargarMasProductos}
          loadingMore={cargandoMasProductos}
          light
        />

        <SupplyFAQ items={faqItems} nombre="Hype Ink" light />
      </div>

      <FooterSupply light />
      <div className="h-16 md:hidden" />
      <SupplyMobileNav active="marcas" light />
    </div>
  )
}
