import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import Seo from '../../../Seo'
import { useSupplyCart } from '../../../../contexts/SupplyCartContext'

const categories = [
  {
    name: 'Round Liner',
    products: [
      'EZ 1RL',
      'EZ 3RL',
      'EZ 5RL',
      'EZ 7RL',
      'EZ 9RL',
      'EZ 11RL',
      'EZ 14RL'
    ]
  },
  {
    name: 'Round Shader',
    products: [
      'EZ 3RS',
      'EZ 5RS',
      'EZ 7RS',
      'EZ 9RS',
      'EZ 11RS',
      'EZ 14RS'
    ]
  },
  {
    name: 'Magnum',
    products: [
      'EZ 7M1',
      'EZ 9M1',
      'EZ 11M1',
      'EZ 13M1',
      'EZ 15M1',
      'EZ 17M1',
      'EZ 23M1'
    ]
  },
  {
    name: 'Curved Magnum',
    products: [
      'EZ 7RM',
      'EZ 9RM',
      'EZ 11RM',
      'EZ 13RM',
      'EZ 15RM',
      'EZ 17RM',
      'EZ 23RM'
    ]
  }
]

const faqs = [
  {
    question: '¿Para qué sirven las agujas Round Liner?',
    answer:
      'Las Round Liner están diseñadas para líneas, lettering, detalles finos y contornos precisos.'
  },
  {
    question: '¿Qué diferencia hay entre Magnum y Curved Magnum?',
    answer:
      'Las Curved Magnum tienen una configuración arqueada que distribuye mejor la presión y ayuda a realizar sombras más suaves.'
  },
  {
    question: '¿Las agujas EZ sirven para realismo?',
    answer:
      'Sí. Son ampliamente utilizadas para black and grey, microrealismo y trabajos de detalle.'
  },
  {
    question: '¿Qué configuración se recomienda para sombras?',
    answer:
      'Las Magnum y Curved Magnum suelen ser las más utilizadas para rellenos y sombreado.'
  }
]

export default function EZCartridgesPage() {
  const { addItem } = useSupplyCart()
  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Cartuchos EZ Tattoo | INKognito Supply — Colombia"
        description="Cartuchos EZ en RL, RS, Magnum y Curved Magnum. Excelente relación calidad-precio para realismo, black and grey y lettering. Disponibles en Urabá, Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/cartridges/ez-tattoo`}
      />

      <NavbarCategory pageName="EZ Tattoo" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-12 md:mb-20">

          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            EZ Tattoo Cartridges
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-6">
            Catálogo Completo
          </h1>

          <div className="max-w-3xl">
            <p className="text-zinc-400 leading-relaxed">
              EZ Tattoo es una de las marcas de cartuchos más utilizadas por artistas
              alrededor del mundo. Sus agujas destacan por su consistencia, precisión
              y excelente relación calidad-precio, siendo una opción popular para
              realismo, black and grey, color y lettering.
            </p>
          </div>

        </div>

        <div className="space-y-12">

          {categories.map((category) => (

            <section key={category.name}>

              <h2 className="text-2xl md:text-4xl font-black uppercase mb-6">
                {category.name}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                {category.products.map((name) => {
                  const product = { id: name, name, brand: 'EZ Tattoo', price: '$XX.XXX' }
                  return (
                    <div
                      key={name}
                      className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 hover:border-zinc-600 transition-all duration-300"
                    >

                      <div className="aspect-square bg-zinc-900 flex items-center justify-center">
                        <span className="text-zinc-700 uppercase tracking-[0.2em] text-xs">
                          Foto
                        </span>
                      </div>

                      <div className="p-3 md:p-4">

                        <h3 className="font-bold text-sm md:text-lg mb-2">
                          {name}
                        </h3>

                        <span className="text-zinc-500 text-xs uppercase block mb-2">
                          EZ Tattoo
                        </span>

                        <span className="text-white font-bold text-sm block mb-3">
                          {product.price}
                        </span>

                        <button
                          onClick={() => addItem(product, 'cartridges-ez')}
                          className="w-full py-2 border border-zinc-700 uppercase tracking-[0.15em] text-xs hover:border-blue-500 hover:text-blue-500 transition-all duration-300"
                        >
                          + Agregar al carrito
                        </button>

                      </div>

                    </div>
                  )
                })}

              </div>

            </section>

          ))}

        </div>

        <section className="mt-20 border-t border-zinc-800 pt-12">

          <h2 className="text-3xl md:text-5xl font-black uppercase mb-10">
            Preguntas Frecuentes
          </h2>

          <div className="space-y-6">

            {faqs.map((faq) => (

              <div
                key={faq.question}
                className="border border-zinc-800 rounded-xl p-5 md:p-6"
              >

                <h3 className="font-bold text-lg mb-3">
                  {faq.question}
                </h3>

                <p className="text-zinc-400 leading-relaxed">
                  {faq.answer}
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
