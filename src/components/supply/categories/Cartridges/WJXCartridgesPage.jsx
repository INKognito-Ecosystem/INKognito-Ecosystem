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
    question: '¿Los cartuchos WJX sirven para cualquier máquina?',
    answer:
      'Sí. Los cartuchos WJX utilizan el sistema universal de cartuchos compatible con la mayoría de máquinas rotativas modernas.'
  },
  {
    question: '¿Qué diferencia hay entre WJX y EZ Tattoo?',
    answer:
      'WJX suele destacar por una membrana más firme y una sensación más consistente durante sesiones largas, mientras que EZ ofrece una excelente relación calidad-precio.'
  },
  {
    question: '¿Qué configuración es mejor para realismo?',
    answer:
      'Para realismo suelen utilizarse Curved Magnum y Bugpin Magnum por su capacidad de crear degradados suaves.'
  },
]

export default function WJXCartridgesPage() {
  const logoUrl = useSupplyVisual('supply_brand_wjx')
  const { prev, next } = getAdjacentBrands(1)
  const scrolled = useScrolled()

  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Cartuchos WJX | INKognito Supply — Colombia"
        description="Cartuchos WJX de alta precisión para líneas y sombras. Compatibles con máquinas tipo pen. Disponibles en Urabá, Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/cartridges/wjx`}
      />

      <NavbarCategory pageName="WJX Tattoo" />

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
            <div className="text-zinc-400 leading-relaxed text-justify [hyphens:auto] space-y-2">
              <div className="float-left w-[180px] mr-6 md:mr-8 mb-2">
                <img
                  src={logoUrl}
                  alt="WJX"
                  className="h-20 md:h-32 w-auto max-w-full object-contain"
                />
              </div>

              <p>
                Los cartuchos WJX se han convertido en una de las opciones más
                utilizadas por tatuadores de todo el mundo gracias a su precisión,
                estabilidad y excelente flujo de tinta.
              </p>

              <p>
                Son especialmente populares para trabajos de realismo, black and
                grey y color debido a la consistencia de sus agujas y la calidad
                de sus membranas internas.
              </p>

              <p>
                En esta sección encontrarás las configuraciones más utilizadas de
                WJX para líneas, sombras y rellenos.
              </p>

              <div className="clear-both" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
              <h1 className="text-4xl md:text-7xl font-black uppercase leading-none flex-shrink-0">
                WJX
              </h1>

              <div className="max-w-xl text-zinc-400 leading-relaxed text-justify [hyphens:auto] space-y-2 sm:border-l sm:border-zinc-800 sm:pl-8">

                <p>
                  Los cartuchos WJX se han convertido en una de las opciones más
                  utilizadas por tatuadores de todo el mundo gracias a su precisión,
                  estabilidad y excelente flujo de tinta.
                </p>

                <p>
                  Son especialmente populares para trabajos de realismo, black and
                  grey y color debido a la consistencia de sus agujas y la calidad
                  de sus membranas internas.
                </p>

                <p>
                  En esta sección encontrarás las configuraciones más utilizadas de
                  WJX para líneas, sombras y rellenos.
                </p>

              </div>
            </div>
          )}

          </div>
        </div>

        <BrandCatalogSection brandName="WJX Tattoo" />

        <section className="mt-10 md:mt-14">
          <AccordionCard
            icon="❓"
            title="Preguntas frecuentes"
            subtitle="Todo lo que necesitas saber sobre WJX antes de tu pedido. Toca para ver las respuestas."
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