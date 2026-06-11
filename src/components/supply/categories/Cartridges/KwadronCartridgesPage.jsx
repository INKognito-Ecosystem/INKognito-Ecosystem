import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'

const categories = [
  {
    name: 'Round Liner',
    products: [
      '1RL',
      '3RL',
      '5RL',
      '7RL',
      '9RL',
      '11RL',
      '14RL'
    ]
  },
  {
    name: 'Round Shader',
    products: [
      '3RS',
      '5RS',
      '7RS',
      '9RS',
      '11RS',
      '14RS'
    ]
  },
  {
    name: 'Curved Magnum',
    products: [
      '7CM',
      '9CM',
      '11CM',
      '13CM',
      '15CM',
      '17CM',
      '23CM'
    ]
  },
  {
    name: 'Magnum',
    products: [
      '7M1',
      '9M1',
      '11M1',
      '13M1',
      '15M1',
      '17M1',
      '23M1'
    ]
  },
  {
    name: 'Bugpin Magnum',
    products: [
      '7BP',
      '9BP',
      '11BP',
      '13BP',
      '15BP'
    ]
  }
]

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
  {
    question: '¿Qué configuración recomiendan para sombras?',
    answer:
      'Las Curved Magnum y Bugpin Magnum suelen ser las opciones preferidas para crear transiciones suaves y degradados limpios.'
  }
]

export default function KwadronCartridgesPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      <NavbarCategory pageName="Kwadron" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-12 md:mb-16">

          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Kwadron Cartridges
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-6">
            Catálogo Completo
          </h1>

          <div className="max-w-4xl text-zinc-400 leading-relaxed space-y-4">

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

        <div className="space-y-12">

          {categories.map((category) => (

            <section key={category.name}>

              <h2 className="text-2xl md:text-4xl font-black uppercase mb-6">
                {category.name}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                {category.products.map((product) => (

                  <div
                    key={product}
                    className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 hover:border-zinc-600 transition-all duration-300"
                  >

                    <div className="aspect-square bg-zinc-900 flex items-center justify-center">

                      <span className="text-zinc-700 uppercase tracking-[0.2em] text-xs">
                        foto
                      </span>

                    </div>

                    <div className="p-4">

  <h3 className="font-bold text-sm md:text-lg mb-2">
    {product}
  </h3>

  <div className="flex items-center justify-between mt-3">

    <span className="text-zinc-500 text-xs uppercase">
      Kwadron
    </span>

    <button className="px-3 py-1 border border-zinc-700 text-xs uppercase hover:border-white transition-all duration-300">
      Ver
    </button>

  </div>

</div>

                  </div>

                ))}

              </div>

            </section>

          ))}

        </div>

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