import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'

const categories = [
  {
    name: 'Negros',
    products: [
      'Dynamic Black',
      'Triple Black',
      'Heavy Black'
    ]
  },
  {
    name: 'Blancos',
    products: [
      'Dynamic White',
      'Heavy White'
    ]
  },
  {
    name: 'Rojos',
    products: [
      'Dynamic Red',
      'Crimson Red',
      'Fire Red'
    ]
  },
  {
    name: 'Azules',
    products: [
      'Dynamic Blue',
      'Ocean Blue',
      'Royal Blue'
    ]
  },
  {
    name: 'Verdes',
    products: [
      'Dynamic Green',
      'Lime Green',
      'Dark Green'
    ]
  },
  {
    name: 'Amarillos y naranjas',
    products: [
      'Dynamic Yellow',
      'Golden Yellow',
      'Orange'
    ]
  },
  {
    name: 'Morados',
    products: [
      'Purple',
      'Deep Purple',
      'Violet'
    ]
  }
]

export default function DynamicColorsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarCategory pageName="Dynamic" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Dynamic
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            Catálogo Completo
          </h1>

          <div className="mt-10 max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-5">
              Dynamic Colors ha sido el estándar de oro en la industria del tatuaje durante décadas, ofreciendo pigmentos de dispersión fina de calidad premium. Fabricada en los Estados Unidos, es reconocida globalmente por la fluidez excepcional de sus tintas y su curación sumamente brillante y duradera.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-5">
              Nuestra selección incluye sus icónicas tintas negras como el clásico Dynamic Black (TBK) y el ultra concentrado Triple Black, favoritos indiscutibles para líneas precisas, sombreados suaves y rellenos sólidos e intensos.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Explora una gama de colores vivos y consistentes que garantizan un flujo constante en la máquina de tatuar y una retención de color óptima bajo la piel, ideales para todo tipo de estilos artísticos.
            </p>
          </div>
        </div>

        <div className="space-y-12">

          {categories.map((category) => (
            <section key={category.name}>

              <h2 className="text-2xl md:text-4xl font-black uppercase mb-6">
                {category.name}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

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

                      <h3 className="font-bold text-sm md:text-lg">
                        {product}
                      </h3>

                      <div className="mt-3 flex items-center justify-between">

                        <span className="text-zinc-400 text-xs">
                          Dynamic
                        </span>

                        <button className="text-xs px-3 py-1 border border-zinc-700 rounded hover:border-white transition-all duration-300">
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
                ¿Por qué la tinta negra Dynamic Black es tan popular?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Su popularidad se debe a su altísima concentración de pigmento, excelente fluidez y un tono negro profundo que no se desvanece fácilmente, facilitando un delineado limpio y sombreados consistentes.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cuál es la diferencia entre Dynamic Black y Triple Black?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                El Dynamic Black estándar es ideal para delinear y diluir en mezclas de sombras (greywash). Por otro lado, Triple Black contiene una carga de pigmento aún mayor, lo que lo hace perfecto exclusivamente para rellenos sólidos y tribales super oscuros.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Las tintas Dynamic son aptas para veganos?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Sí, todas las tintas Dynamic están formuladas con ingredientes de alta pureza de origen no animal y son 100% libres de crueldad animal.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Dónde se fabrican las tintas Dynamic?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Las tintas Dynamic originales son diseñadas, probadas y fabricadas con orgullo en los Estados Unidos, cumpliendo estrictos controles de calidad.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cómo puedo diluir la tinta Dynamic para sombreados?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Se recomienda diluir utilizando agua bidestilada estéril, extracto de hamamelis o una solución mezcladora especializada para mantener la esterilidad del pigmento.
              </p>
            </div>
          </div>
        </section>

      </div>

      <FooterSupply />
    </div>
  )
}