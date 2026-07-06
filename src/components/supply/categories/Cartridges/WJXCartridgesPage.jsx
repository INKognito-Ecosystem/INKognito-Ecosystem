import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import BrandCatalogSection from '../../BrandCatalogSection'
import Seo from '../../../Seo'

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
  {
    question: '¿Qué configuración es mejor para líneas?',
    answer:
      'Las Round Liner son la elección principal para líneas finas, medias y gruesas dependiendo del número de agujas.'
  }
]

export default function WJXCartridgesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Cartuchos WJX | INKognito Supply — Colombia"
        description="Cartuchos WJX de alta precisión para líneas y sombras. Compatibles con máquinas tipo pen. Disponibles en Urabá, Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/cartridges/wjx`}
      />

      <NavbarCategory pageName="WJX Tattoo" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-12 md:mb-16">

          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            WJX Tattoo Cartridges
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-6">
            Catálogo Completo
          </h1>

          <div className="max-w-4xl text-zinc-400 leading-relaxed space-y-4">

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

        <BrandCatalogSection brandName="WJX Tattoo" />

        <section className="mt-24">

          <h2 className="text-3xl md:text-5xl font-black uppercase mb-10">
            Preguntas frecuentes
          </h2>

          <div className="space-y-6">

            {faq.map((item) => (

              <div
                key={item.question}
                className="border border-zinc-800 rounded-xl p-6"
              >

                <h3 className="font-bold text-lg mb-3">
                  {item.question}
                </h3>

                <p className="text-zinc-400 leading-relaxed">
                  {item.answer}
                </p>

              </div>

            ))}

          </div>

        </section>

      </div>

      <FooterSupply />

    </div>
  )
}