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
    question: '¿Por qué los cartuchos Kwadron son tan populares?',
    answer:
      'Kwadron es reconocida mundialmente por la precisión de sus agujas, la estabilidad de sus agrupaciones y la consistencia de fabricación entre cartuchos.'
  },
  {
    question: '¿Kwadron sirve para realismo?',
    answer:
      'Sí. Muchos artistas especializados en realismo utilizan Kwadron por la precisión de sus agujas y la suavidad de sus magnums curvas.'
  },
  {
    question: '¿Qué configuración es mejor para líneas?',
    answer:
      'Las Round Liner son ideales para líneas. La elección depende del grosor deseado y del estilo de tatuaje.'
  },
]

export default function KwadronCartridgesPage() {
  const logoUrl = useSupplyVisual('supply_brand_kwadron')
  const { prev, next } = getAdjacentBrands(6)
  const scrolled = useScrolled()

  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Cartuchos Kwadron | INKognito Supply — Colombia"
        description="Cartuchos Kwadron: el estándar profesional europeo para precisión y consistencia. Usados por artistas de todo el mundo. Disponibles en Urabá, Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/cartridges/kwadron`}
      />

      <NavbarCategory pageName="Kwadron" />

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
                  alt="Kwadron"
                  className="h-20 md:h-32 w-auto max-w-full object-contain"
                />
              </div>

              <p>
                Kwadron es una de las marcas de cartuchos más reconocidas y utilizadas
                por artistas profesionales alrededor del mundo. Su reputación se basa
                en la precisión, consistencia y calidad de fabricación de cada aguja.
              </p>

              <p>
                Gracias a sus agrupaciones perfectamente alineadas y a la estabilidad
                de sus cartuchos, Kwadron se ha convertido en una referencia para
                trabajos de línea, realismo, black and grey y color.
              </p>

              <p>
                En esta sección encontrarás las configuraciones más utilizadas por los
                artistas para líneas, sombras, rellenos y trabajos de alta precisión.
              </p>

              <div className="clear-both" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
              <h1 className="text-4xl md:text-7xl font-black uppercase leading-none flex-shrink-0">
                Kwadron
              </h1>

              <div className="max-w-xl text-zinc-400 leading-relaxed text-justify [hyphens:auto] space-y-2 sm:border-l sm:border-zinc-800 sm:pl-8">

                <p>
                  Kwadron es una de las marcas de cartuchos más reconocidas y utilizadas
                  por artistas profesionales alrededor del mundo. Su reputación se basa
                  en la precisión, consistencia y calidad de fabricación de cada aguja.
                </p>

                <p>
                  Gracias a sus agrupaciones perfectamente alineadas y a la estabilidad
                  de sus cartuchos, Kwadron se ha convertido en una referencia para
                  trabajos de línea, realismo, black and grey y color.
                </p>

                <p>
                  En esta sección encontrarás las configuraciones más utilizadas por los
                  artistas para líneas, sombras, rellenos y trabajos de alta precisión.
                </p>

              </div>
            </div>
          )}

          </div>
        </div>

        <BrandCatalogSection brandName="Kwadron" />

        <section className="mt-10 md:mt-14">
          <AccordionCard
            icon="❓"
            title="Preguntas frecuentes"
            subtitle="Todo lo que necesitas saber sobre Kwadron antes de tu pedido. Toca para ver las respuestas."
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