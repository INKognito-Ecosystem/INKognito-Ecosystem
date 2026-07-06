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
    question: '¿Para qué sirven los sistemas de Tattoo Vision?',
    answer: 'Ofrecen iluminación adicional y protección visual durante sesiones largas, reduciendo el cansancio ocular y mejorando la precisión en el trazo.'
  },
  {
    question: '¿Sirven para cualquier tipo de sesión?',
    answer: 'Sí. Son especialmente útiles en trabajos de detalle fino o realismo, donde la precisión visual es crítica, pero se adaptan a cualquier duración de sesión.'
  },
  {
    question: '¿Necesito experiencia previa para usarlos?',
    answer: 'No. Son fáciles de ajustar y se adaptan al espacio de trabajo habitual del tatuador, sin curva de aprendizaje.'
  },
]

export default function TattooVisionPage() {
  const logoUrl = useSupplyVisual('supply_brand_tattoo_vision')
  const { prev, next } = getAdjacentBrands(0)
  const scrolled = useScrolled()

  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Tattoo Vision | Sistemas visuales para tatuadores — INKognito Supply"
        description="Lámparas, gafas y sistemas de visión Tattoo Vision para tatuadores profesionales. Precisión óptica en cada sesión. Disponibles en Urabá, Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/brands/tattoo-vision`}
      />
      <NavbarCategory pageName="Tattoo Vision" />

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
            <div>
              <div className="float-left w-[180px] mr-6 md:mr-8 mb-2">
                <img
                  src={logoUrl}
                  alt="Tattoo Vision"
                  className="h-20 md:h-32 w-auto max-w-full object-contain"
                />
              </div>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed text-justify [hyphens:auto]">
                Sistemas visuales diseñados para tatuadores profesionales.
                Gafas especializadas, iluminación avanzada y accesorios
                desarrollados para mejorar la visibilidad, reducir reflejos
                y aumentar la precisión durante el proceso de tatuaje.
              </p>
              <div className="clear-both" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
              <h1 className="text-4xl md:text-7xl font-black uppercase leading-none flex-shrink-0">
                Tattoo Vision
              </h1>
              <p className="max-w-xl text-zinc-400 text-sm md:text-base leading-relaxed text-justify [hyphens:auto] sm:border-l sm:border-zinc-800 sm:pl-8">
                Sistemas visuales diseñados para tatuadores profesionales.
                Gafas especializadas, iluminación avanzada y accesorios
                desarrollados para mejorar la visibilidad, reducir reflejos
                y aumentar la precisión durante el proceso de tatuaje.
              </p>
            </div>
          )}

          </div>
        </div>

        <BrandCatalogSection brandName="Tattoo Vision" />

        <section className="mt-10 md:mt-14">
          <AccordionCard
            icon="❓"
            title="Preguntas frecuentes"
            subtitle="Todo lo que necesitas saber sobre Tattoo Vision antes de tu pedido. Toca para ver las respuestas."
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
