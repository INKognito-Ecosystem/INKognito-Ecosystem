import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'

const categories = [
  {
    name: 'Negros',
    products: [
      'Lining Black',
      'Triple Black',
      'Maxx Black',
      'Pitch Black'
    ]
  },
  {
    name: 'Grises',
    products: [
      'Light Grey Wash',
      'Medium Grey Wash',
      'Dark Grey Wash',
      'Smoke Grey'
    ]
  },
  {
    name: 'Rojos',
    products: [
      'Crimson Red',
      'Lipstick Red',
      'Dark Red',
      'Burgundy'
    ]
  },
  {
    name: 'Azules',
    products: [
      'Blue Concentrate',
      'Dark Blue',
      'Turquoise',
      'Sky Blue'
    ]
  },
  {
    name: 'Amarillos y Naranjas',
    products: [
      'Bright Yellow',
      'Golden Yellow',
      'Orange',
      'Tangerine'
    ]
  },
  {
    name: 'Verdes',
    products: [
      'Lime Green',
      'True Green',
      'Olive Green',
      'Dark Green'
    ]
  },
  {
    name: 'Morados',
    products: [
      'Purple Concentrate',
      'Lavender',
      'Deep Violet'
    ]
  },
  {
    name: 'Tonos Piel',
    products: [
      'Light Flesh',
      'Medium Flesh',
      'Dark Flesh'
    ]
  }
]

export default function EternalColorsPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      <NavbarCategory pageName="Eternal Ink" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Eternal Ink
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            Catálogo Completo
          </h1>

          <div className="mt-10 max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-5">
              Eternal Ink es reconocida mundialmente por definir el estándar de consistencia y vitalidad cromática en el arte del tatuaje. Desarrollada por artistas y para artistas, es una marca sinónimo de confianza, con una de las paletas de color más ricas y estables del mercado.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-5">
              Formulada sin acrílicos y de base acuosa, cada gota de Eternal Ink garantiza una inyección fluida bajo la piel, reduciendo el trauma tisular y facilitando un proceso de curación óptimo que conserva la intensidad del pigmento a lo largo de los años.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Descubre desde sus prestigiosos negros como Pitch Black y Maxx Black hasta sus sets especializados de realismo y tonos de piel, todos producidos en entornos de laboratorio estériles de última generación.
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
                          Eternal Ink
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
                ¿Qué hace especial a la tinta Eternal Ink?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Su consistencia impecable, brillo y facilidad de inserción, perfeccionados durante más de dos décadas de innovación constante por reconocidos artistas.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Las tintas Eternal Ink contienen acrílico?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                No, Eternal Ink es de base acuosa y orgánica, libre de plásticos y acrílicos nocivos, lo que previene reacciones alérgicas y asegura una curación limpia.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cuál es el negro más oscuro de Eternal Ink?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Tanto Maxx Black como Pitch Black ofrecen una altísima densidad de negro. Pitch Black destaca por su brillo y profundidad absoluta en rellenos sólidos.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Las tintas de Eternal Ink son seguras para la piel?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Totalmente. Se elaboran bajo rigurosos protocolos médicos y de laboratorio en EE. UU., siendo testeadas periódicamente para garantizar total bioseguridad.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cómo debe almacenarse la tinta Eternal Ink?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Debe mantenerse a temperatura ambiente, protegida de la luz solar directa e hidratación excesiva, agitándola bien antes de cada aplicación.
              </p>
            </div>
          </div>
        </section>

      </div>

      <FooterSupply />

    </div>
  )
}