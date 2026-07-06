import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import BrandCatalogSection from '../../BrandCatalogSection'
import AccordionCard from '../../AccordionCard'
import Seo from '../../../Seo'
import { getAdjacentBrands } from '../../../../data/supplyBrandsOrder'
import { useSupplyVisual } from '../../../../hooks/useSupplyVisual'
import { useScrolled } from '../../../../hooks/useScrolled'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

const faq = [
  {
    question: '¿Qué caracteriza a las tintas Vice Colors?',
    answer: 'Su excelente saturación y brillo post-cicatrización, acompañados de nombres super creativos inspirados en la cultura pop y del tatuaje, con una inyección sumamente fluida.'
  },
  {
    question: '¿Cuál es el negro más recomendado de Vice Colors?',
    answer: 'Black Sabbath y Vicious Black son los negros estrella. Black Sabbath destaca para líneas y sombras estables, mientras que Vicious Black ofrece una profundidad absoluta para rellenos sólidos.'
  },
  {
    question: '¿Las tintas de Vice Colors son seguras para la piel?',
    answer: 'Por supuesto. Se fabrican siguiendo normativas internacionales muy exigentes de bioseguridad, garantizando pigmentos puros, estériles y estables.'
  },
]

export default function ViceColorsPage() {
  const logoUrl = useSupplyVisual('supply_brand_vice_colors')
  const { prev, next } = getAdjacentBrands(2)
  const scrolled = useScrolled()

  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Tintas Vice Colors | INKognito Supply — Colombia"
        description="Catálogo completo de Vice Colors: negros, grises, rojos, azules, pieles y más. Tintas premium para realismo y neotradicional. Disponibles en Urabá, despacho a Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/ink/vice-colors`}
      />
      <NavbarCategory pageName="Vice Colors" />

      {scrolled && (
        <>
          <Link
            to={prev.path}
            aria-label={`Ver ${prev.name}`}
            className="fixed top-16 md:top-20 left-2 md:left-4 z-40 text-zinc-400 hover:text-white bg-black/60 backdrop-blur-sm border border-zinc-800 rounded-full p-2 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <Link
            to={next.path}
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
            <Link to={prev.path} aria-label={`Ver ${prev.name}`} className="flex-shrink-0 text-zinc-500 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm text-center flex-1">
              Marca Profesional
            </p>
            <Link to={next.path} aria-label={`Ver ${next.name}`} className="flex-shrink-0 text-zinc-500 hover:text-white transition-colors">
              <ArrowRight size={18} />
            </Link>
          </div>

          {logoUrl === undefined ? (
            <div className="h-20 md:h-32" />
          ) : logoUrl ? (
            <div className="text-justify [hyphens:auto]">
              <div className="float-left w-[180px] mr-6 md:mr-8 mb-2">
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

        <BrandCatalogSection brandName="Vice Colors" />

        <section className="mt-10 md:mt-14">
          <AccordionCard
            icon="❓"
            title="Preguntas frecuentes"
            subtitle="Todo lo que necesitas saber sobre Vice Colors antes de tu pedido. Toca para ver las respuestas."
          >
            <div className="flex flex-col gap-5">
              {faq.map((item, i) => (
                <div key={i} className={i < faq.length - 1 ? 'pb-5 border-b border-zinc-800' : ''}>
                  <p className="font-bold text-white text-sm mb-2">{item.question}</p>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </AccordionCard>
        </section>

      </div>

      <FooterSupply />
    </div>
  )
}