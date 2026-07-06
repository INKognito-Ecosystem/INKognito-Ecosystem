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
    question: '¿Qué productos incluye la línea Heaven Pro?',
    answer: 'Crema y toallitas de limpieza para usar durante la sesión, y crema de cicatrización para después — cubre las dos etapas del tatuaje.'
  },
  {
    question: '¿Cuáles debo tener siempre en el estudio?',
    answer: 'La crema para tatuar y las toallitas de limpieza las usas en cada sesión mientras tatúas. La crema de cicatrización la recomiendas o vendes a tu cliente para después.'
  },
  {
    question: '¿Puedo revender la crema de cicatrización a mis clientes?',
    answer: 'Sí. Muchos tatuadores la incluyen como parte del kit de cuidado que entregan al cliente al terminar la sesión.'
  },
]

export default function HeavenProPage() {
  const logoUrl = useSupplyVisual('supply_brand_heaven_pro')
  const { prev, next } = getAdjacentBrands(4)
  const scrolled = useScrolled()

  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Heaven Pro | Cuidado de tatuajes — INKognito Supply"
        description="Heaven Pro: crema y toallitas de limpieza para usar durante la sesión, crema de cicatrización para después. Línea completa para el tatuador y para vender a tus clientes. Disponibles en Urabá, Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/brands/heaven-pro`}
      />
      <NavbarCategory pageName="Heaven Pro" />

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
            <div className="h-24 md:h-40" />
          ) : logoUrl ? (
            <div>
              <div className="float-left w-[180px] mr-6 md:mr-8 mb-2">
                <img
                  src={logoUrl}
                  alt="Heaven Pro"
                  className="h-24 md:h-40 w-auto max-w-full object-contain"
                />
              </div>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed text-justify [hyphens:auto]">
                Línea completa para el tatuaje: crema y toallitas de limpieza para
                usar durante la sesión, y crema de cicatrización para después. Para
                uso diario del tatuador profesional y lista para recomendar o vender
                directamente a tus clientes.
              </p>
              <div className="clear-both" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
              <h1 className="text-4xl md:text-7xl font-black uppercase leading-none flex-shrink-0">
                Heaven Pro
              </h1>
              <p className="max-w-xl text-zinc-400 text-sm md:text-base leading-relaxed text-justify [hyphens:auto] sm:border-l sm:border-zinc-800 sm:pl-8">
                Línea completa para el tatuaje: crema y toallitas de limpieza para
                usar durante la sesión, y crema de cicatrización para después. Para
                uso diario del tatuador profesional y lista para recomendar o vender
                directamente a tus clientes.
              </p>
            </div>
          )}

          </div>
        </div>

        <BrandCatalogSection brandName="Heaven Pro" />

        <section className="mt-10 md:mt-14">
          <AccordionCard
            icon="❓"
            title="Preguntas frecuentes"
            subtitle="Todo lo que necesitas saber sobre Heaven Pro antes de tu pedido. Toca para ver las respuestas."
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
