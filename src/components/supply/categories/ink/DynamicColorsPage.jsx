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
    question: '¿Por qué la tinta negra Dynamic Black es tan popular?',
    answer: 'Su popularidad se debe a su altísima concentración de pigmento, excelente fluidez y un tono negro profundo que no se desvanece fácilmente, facilitando un delineado limpio y sombreados consistentes.'
  },
  {
    question: '¿Cuál es la diferencia entre Dynamic Black y Triple Black?',
    answer: 'El Dynamic Black estándar es ideal para delinear y diluir en mezclas de sombras (greywash). Por otro lado, Triple Black contiene una carga de pigmento aún mayor, lo que lo hace perfecto exclusivamente para rellenos sólidos y tribales super oscuros.'
  },
  {
    question: '¿Las tintas Dynamic son aptas para veganos?',
    answer: 'Sí, todas las tintas Dynamic están formuladas con ingredientes de alta pureza de origen no animal y son 100% libres de crueldad animal.'
  },
]

export default function DynamicColorsPage() {
  const logoUrl = useSupplyVisual('supply_brand_dynamic')
  const { prev, next } = getAdjacentBrands(3)
  const scrolled = useScrolled()

  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Tintas Dynamic | INKognito Supply — Colombia"
        description="Dynamic Black, Triple Black y colores clásicos. Pigmentos densos y fluidos para black and grey y estilo tradicional. Disponibles en Urabá, despacho a Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/ink/dynamic`}
      />
      <NavbarCategory pageName="Dynamic" />

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
                  alt="Dynamic"
                  className="h-20 md:h-32 w-auto max-w-full object-contain"
                />
              </div>
              <p className="text-zinc-400 leading-relaxed mb-3">
                Dynamic Colors ha sido el estándar de oro en la industria del tatuaje durante décadas, ofreciendo pigmentos de dispersión fina de calidad premium. Fabricada en los Estados Unidos, es reconocida globalmente por la fluidez excepcional de sus tintas y su curación sumamente brillante y duradera.
              </p>
              <p className="text-zinc-400 leading-relaxed mb-3">
                Nuestra selección incluye sus icónicas tintas negras como el clásico Dynamic Black (TBK) y el ultra concentrado Triple Black, favoritos indiscutibles para líneas precisas, sombreados suaves y rellenos sólidos e intensos.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Explora una gama de colores vivos y consistentes que garantizan un flujo constante en la máquina de tatuar y una retención de color óptima bajo la piel, ideales para todo tipo de estilos artísticos.
              </p>
              <div className="clear-both" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
              <h1 className="text-4xl md:text-7xl font-black uppercase leading-none flex-shrink-0">
                Dynamic
              </h1>

              <div className="max-w-xl text-justify [hyphens:auto] sm:border-l sm:border-zinc-800 sm:pl-8">
                <p className="text-zinc-400 leading-relaxed mb-3">
                  Dynamic Colors ha sido el estándar de oro en la industria del tatuaje durante décadas, ofreciendo pigmentos de dispersión fina de calidad premium. Fabricada en los Estados Unidos, es reconocida globalmente por la fluidez excepcional de sus tintas y su curación sumamente brillante y duradera.
                </p>
                <p className="text-zinc-400 leading-relaxed mb-3">
                  Nuestra selección incluye sus icónicas tintas negras como el clásico Dynamic Black (TBK) y el ultra concentrado Triple Black, favoritos indiscutibles para líneas precisas, sombreados suaves y rellenos sólidos e intensos.
                </p>
                <p className="text-zinc-400 leading-relaxed">
                  Explora una gama de colores vivos y consistentes que garantizan un flujo constante en la máquina de tatuar y una retención de color óptima bajo la piel, ideales para todo tipo de estilos artísticos.
                </p>
              </div>
            </div>
          )}
          </div>
        </div>

        <BrandCatalogSection brandName="Dynamic" />

        <section className="mt-10 md:mt-14">
          <AccordionCard
            icon="❓"
            title="Preguntas frecuentes"
            subtitle="Todo lo que necesitas saber sobre Dynamic antes de tu pedido. Toca para ver las respuestas."
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