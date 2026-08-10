import { Link, useLoaderData } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import BrandCatalogSection from '../../BrandCatalogSection'
import SupplyFAQ from '../../SupplyFAQ'
import { getAdjacentBrands } from '../../../../data/supplyBrandsOrder'
import { useSupplyVisual } from '../../../../hooks/useSupplyVisual'
import { useScrolled } from '../../../../hooks/useScrolled'
import { fetchCatalogMarca, fetchSupplyFaq } from '../../../../hooks/useCatalog'

export async function loader() {
  const [catalogo, faqItems] = await Promise.all([
    fetchCatalogMarca('supply', 'vice-colors'),
    fetchSupplyFaq({ marca: 'vice-colors' }),
  ])
  return { ...catalogo, faqItems }
}

export function meta() {
  const title = 'Tintas Vice Colors | INKognito Supply — Colombia'
  const description = 'Catálogo completo de Vice Colors: negros, grises, rojos, azules, pieles y más. Tintas premium para realismo y neotradicional. Disponibles en Urabá, despacho a Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/ink/vice-colors` },
  ]
}

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

export default function ViceColorsPage() {
  const { products, faqItems } = useLoaderData()
  const logoUrl = useSupplyVisual('supply_brand_vice_colors')
  const { prev, next } = getAdjacentBrands(3)
  const scrolled = useScrolled()

  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarCategory pageName="Vice Colors" />

      {scrolled && (
        <>
          <Link
            to={prev.path} replace
            aria-label={`Ver ${prev.name}`}
            className="fixed top-16 md:top-20 left-2 md:left-4 z-40 text-zinc-400 hover:text-white bg-black/60 backdrop-blur-sm border border-zinc-800 rounded-full p-2 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <Link
            to={next.path} replace
            aria-label={`Ver ${next.name}`}
            className="fixed top-16 md:top-20 right-2 md:right-4 z-40 text-zinc-400 hover:text-white bg-black/60 backdrop-blur-sm border border-zinc-800 rounded-full p-2 transition-colors"
          >
            <ArrowRight size={20} />
          </Link>
        </>
      )}

      <div className="pt-20 md:pt-24 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="relative overflow-hidden mb-6 md:mb-8">
          <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
          <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 mb-3">
            <Link to={prev.path} replace aria-label={`Ver ${prev.name}`} className="flex-shrink-0 text-zinc-500 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm text-center flex-1">
              Marca Profesional
            </p>
            <Link to={next.path} replace aria-label={`Ver ${next.name}`} className="flex-shrink-0 text-zinc-500 hover:text-white transition-colors">
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
                  alt="Vice Colors"
                  className="h-20 md:h-32 w-auto max-w-full object-contain"
                />
              </div>
              <p className="text-zinc-400 leading-relaxed mb-3">
                Vice Colors es una de las marcas de pigmentos más innovadoras y de mayor crecimiento en el sector europeo y latinoamericano. Con una personalidad audaz e ingredientes seleccionados meticulosamente, ha conquistado a los tatuadores que buscan colores con nombres rebeldes y saturaciones extremas.
              </p>
              <p className="text-zinc-400 leading-relaxed mb-3">
                Su formulación destaca por su excelente viscosidad y rapidez de implantación. Productos estrella como Black Sabbath, El Gato Blanco y El Gato Patrón han redefinido la manera en que los artistas abordan los rellenos puros y los delineados de alto contraste.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Explora una gama cromática llena de actitud y diseñada para aguantar el paso del tiempo intacta. Perfecta para realismo, neotradicional, lettering, y estilos modernos de alta exigencia visual.
              </p>
              <div className="clear-both" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
              <h1 className="text-4xl md:text-7xl font-black uppercase leading-none flex-shrink-0">
                Vice Colors
              </h1>

              <div className="max-w-xl text-justify [hyphens:auto] sm:border-l sm:border-zinc-800 sm:pl-8">
                <p className="text-zinc-400 leading-relaxed mb-3">
                  Vice Colors es una de las marcas de pigmentos más innovadoras y de mayor crecimiento en el sector europeo y latinoamericano. Con una personalidad audaz e ingredientes seleccionados meticulosamente, ha conquistado a los tatuadores que buscan colores con nombres rebeldes y saturaciones extremas.
                </p>
                <p className="text-zinc-400 leading-relaxed mb-3">
                  Su formulación destaca por su excelente viscosidad y rapidez de implantación. Productos estrella como Black Sabbath, El Gato Blanco y El Gato Patrón han redefinido la manera en que los artistas abordan los rellenos puros y los delineados de alto contraste.
                </p>
                <p className="text-zinc-400 leading-relaxed">
                  Explora una gama cromática llena de actitud y diseñada para aguantar el paso del tiempo intacta. Perfecta para realismo, neotradicional, lettering, y estilos modernos de alta exigencia visual.
                </p>
              </div>
            </div>
          )}
          </div>
        </div>

        <BrandCatalogSection brandName="Vice Colors" products={products} />

        <SupplyFAQ items={faqItems} nombre="Vice Colors" />

      </div>

      <FooterSupply />
    </div>
  )
}