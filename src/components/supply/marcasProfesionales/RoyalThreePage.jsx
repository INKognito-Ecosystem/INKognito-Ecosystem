import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import BrandCatalogSection from '../BrandCatalogSection'
import AccordionCard from '../AccordionCard'
import Seo from '../../Seo'
import { getAdjacentBrands } from '../../../data/supplyBrandsOrder'
import { useSupplyVisual } from '../../../hooks/useSupplyVisual'
import { useScrolled } from '../../../hooks/useScrolled'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

const faq = [
  {
    question: '¿Qué hace diferentes a los productos Royal Three?',
    answer: 'Combinan formulaciones de uso clínico con la practicidad que necesita un estudio de tatuaje en el día a día.'
  },
  {
    question: '¿Son solo para estudios profesionales?',
    answer: 'Están pensados principalmente para el uso diario en estudio, aunque algunos productos de cuidado también sirven para el cliente en casa.'
  },
  {
    question: '¿Cumplen normas de bioseguridad?',
    answer: 'Sí, las líneas de jabones y cremas están formuladas bajo estándares de bioseguridad pensados para el entorno de un estudio de tatuaje.'
  },
]

export default function RoyalThreePage() {
  const logoUrl = useSupplyVisual('supply_brand_royal_three')
  const { prev, next } = getAdjacentBrands(5)
  const scrolled = useScrolled()

  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Royal Three | Insumos para tatuadores — INKognito Supply"
        description="Cremas, jabones y productos de bioseguridad Royal Three para estudios de tatuaje profesionales. Disponibles en Urabá, Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/brands/royal-three`}
      />
      <NavbarCategory pageName="Royal Three" />

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
            <div className="h-24 md:h-40" />
          ) : logoUrl ? (
            <div>
              <div className="float-left w-[180px] mr-6 md:mr-8 mb-2 flex justify-center">
                <img
                  src={logoUrl}
                  alt="Royal Three"
                  className="h-24 md:h-40 w-auto max-w-full object-contain"
                />
              </div>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed text-justify [hyphens:auto]">
                Cremas, jabones y productos de bioseguridad desarrollados para estudios
                de tatuaje profesionales. Royal Three combina eficacia clínica con
                formulaciones pensadas para la rutina diaria del tatuador.
              </p>
              <div className="clear-both" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
              <h1 className="text-4xl md:text-7xl font-black uppercase leading-none flex-shrink-0">
                Royal Three
              </h1>
              <p className="max-w-xl text-zinc-400 text-sm md:text-base leading-relaxed text-justify [hyphens:auto] sm:border-l sm:border-zinc-800 sm:pl-8">
                Cremas, jabones y productos de bioseguridad desarrollados para estudios
                de tatuaje profesionales. Royal Three combina eficacia clínica con
                formulaciones pensadas para la rutina diaria del tatuador.
              </p>
            </div>
          )}

          </div>
        </div>

        <BrandCatalogSection brandName="Royal Three" />

        <section className="mt-10 md:mt-14">
          <AccordionCard
            icon="❓"
            title="Preguntas frecuentes"
            subtitle="Todo lo que necesitas saber sobre Royal Three antes de tu pedido. Toca para ver las respuestas."
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
