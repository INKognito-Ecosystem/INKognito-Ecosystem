import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'

const categories = [
  {
    name: 'Negros y grises',
    products: [
      'Lining Black',
      'Triple Black',
      'Black Label Grey',
      'Medium Grey',
      'Light Grey'
    ]
  },
  {
    name: 'Rojos',
    products: [
      'Blood Red',
      'Red',
      'Burgundy',
      'Dark Red',
      'El Dorado Red'
    ]
  },
  {
    name: 'Azules',
    products: [
      'Blue',
      'Sky Blue',
      'Dark Blue',
      'Blue Concentrate',
      'Teal'
    ]
  },
  {
    name: 'Verdes',
    products: [
      'Green',
      'Dark Green',
      'Olive',
      'Lime Green',
      'Jungle Green'
    ]
  },
  {
    name: 'Amarillos y naranjas',
    products: [
      'Yellow',
      'Golden Yellow',
      'Orange',
      'Tangerine',
      'El Dorado'
    ]
  },
  {
    name: 'Morados y rosas',
    products: [
      'Purple',
      'Violet',
      'Magenta',
      'Hot Pink',
      'Bubblegum Pink'
    ]
  },
  {
    name: 'Marrones',
    products: [
      'Brown',
      'Dark Brown',
      'Chocolate',
      'Burnt Umber',
      'Mocha'
    ]
  },
  {
    name: 'Blancos',
    products: [
      'White',
      'White Label'
    ]
  },
  {
    name: 'Tonos piel',
    products: [
      'Flesh',
      'Light Flesh',
      'Medium Flesh',
      'Dark Flesh',
      'Peach'
    ]
  }
]

export default function SolidColorsPage() {  
    return (
    <div className="min-h-screen bg-black text-white">

      <NavbarCategory pageName="Solid Ink" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Solid Ink
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            Catálogo Completo
          </h1>

          <div className="mt-10 max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-5">
              Solid Ink es considerada por innumerables artistas como la representación perfecta de la saturación pura y la consistencia ideal. Fundada por el veterano tatuador Federico Ferroni, la marca nació de la necesidad de conseguir pigmentos intensos, naturales e increíblemente estables.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-5">
              Elaborada con los pigmentos orgánicos de la más alta calidad y libre de aditivos nocivos, Solid Ink es sumamente fácil de aplicar en la piel. Su base fluida de agua destilada, glicerina y extracto de hamamelis asegura una textura óptima que no se seca fácilmente.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Explora una gama cromática insuperable que abarca sus prestigiosos negros de línea y relleno, así como amarillos, rojos y verdes sumamente vibrantes que garantizan resultados limpios, sólidos y duraderos.
            </p>
          </div>
        </div>

        <div className="space-y-10">

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
                        Foto
                      </span>
                    </div>

                    <div className="p-3 md:p-4">

                      <h3 className="font-bold text-sm md:text-lg mb-2">
                        {product}
                      </h3>

                      <div className="flex justify-between items-center">

                        <span className="text-zinc-500 text-xs uppercase">
                          Solid Ink
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

        <section className="mt-24 md:mt-32">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-10">
            Preguntas frecuentes
          </h2>

          <div className="space-y-6">
            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Quién creó Solid Ink?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Solid Ink fue desarrollada por el tatuador Federico Ferroni, quien diseñó una fórmula sumamente concentrada y natural para satisfacer sus propias exigencias artísticas y las de la industria profesional.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Qué ingredientes se utilizan en la tinta Solid Ink?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Está elaborada con pigmentos orgánicos puros de excelente grado, mezclados con agua destilada estéril, glicerina vegetal y un toque de extracto de hamamelis orgánico.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Las tintas de Solid Ink son veganas?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Sí, toda la línea de Solid Ink es 100% vegana, libre de gluten, crueldad animal y conservantes químicos agresivos.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cómo cura la tinta Solid Ink?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Su curación destaca por dejar un acabado mate satinado de extrema solidez, donde los colores se mantienen sumamente fieles al tono original inyectado.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Solid Ink contiene alérgenos o gluten?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                No, la marca se enorgullece de fabricar un producto totalmente hipoalergénico, libre de gluten y metales pesados nocivos para el organismo.
              </p>
            </div>
          </div>
        </section>

      </div>

      <FooterSupply />

    </div>
  )
}