import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import Seo from '../../../Seo'

const categories = [
  {
    name: 'Negros y grises',
    products: ['Black Sabbath', 'Vicious Black', 'Battleship Grey', 'Brianza Grey', 'Obscure Grey', 'Grey Wash', 'Grey Wash Light', 'Sober Grey']
  },
  {
    name: 'Azules',
    products: ['Almost Blue', 'Buonasera Blue', 'Estate Blue', 'Pitufo Blue', 'Turquoise']
  },
  {
    name: 'Rojos',
    products: ['Bleeding Red', 'Burning Red', 'Criminal Red', 'First Blood', 'Red End', 'Redbenga']
  },
  {
    name: 'Amarillos y naranjas',
    products: ['Amarillo', 'Alvarillo', 'Clockwork Orange', 'Sweet Tangerine', "Tangerine's Dream", "Mellow's Gold", 'Dijon']
  },
  {
    name: 'Verdes',
    products: ['Green Hulk', 'Olives Matters']
  },
  {
    name: 'Morados y rosas',
    products: ['Deep Purple', 'Sweet Lavender', 'Magenta', "Lara's Pink", 'Pinkcheeks']
  },
  {
    name: 'Blancos',
    products: ['El Gato Blanco', 'El Gato Patrón']
  },
  {
    name: 'Tonos piel y realismo',
    products: ['Flesh', 'Medium Flesh', 'Extra Light Flesh']
  },
  {
    name: 'Marrones',
    products: ['Jackie Brown', 'Coffee Bitti', 'Expresso']
  }
]

export default function ViceColorsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Tintas Vice Colors | INKognito Supply — Colombia"
        description="Catálogo completo de Vice Colors: negros, grises, rojos, azules, pieles y más. Tintas premium para realismo y neotradicional. Disponibles en Urabá, despacho a Colombia."
        siteName="INKognito Supply"
      />
      <NavbarCategory pageName="Vice Colors" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Vice Colors
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            Catálogo Completo
          </h1>

          <div className="mt-10 max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-5">
              Vice Colors es una de las marcas de pigmentos más innovadoras y de mayor crecimiento en el sector europeo y latinoamericano. Con una personalidad audaz e ingredientes seleccionados meticulosamente, ha conquistado a los tatuadores que buscan colores con nombres rebeldes y saturaciones extremas.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-5">
              Su formulación destaca por su excelente viscosidad y rapidez de implantación. Productos estrella como Black Sabbath, El Gato Blanco y El Gato Patrón han redefinido la manera en que los artistas abordan los rellenos puros y los delineados de alto contraste.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Explora una gama cromática llena de actitud y diseñada para aguantar el paso del tiempo intacta. Perfecta para realismo, neotradicional, lettering, y estilos modernos de alta exigencia visual.
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
                          Vice Colors
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
                ¿Qué caracteriza a las tintas Vice Colors?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Su excelente saturación y brillo post-cicatrización, acompañados de nombres super creativos inspirados en la cultura pop y del tatuaje, con una inyección sumamente fluida.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cuál es el negro más recomendado de Vice Colors?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Black Sabbath y Vicious Black son los negros estrella. Black Sabbath destaca para líneas y sombras estables, mientras que Vicious Black ofrece una profundidad absoluta para rellenos sólidos.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Las tintas de Vice Colors son seguras para la piel?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Por supuesto. Se fabrican siguiendo normativas internacionales muy exigentes de bioseguridad, garantizando pigmentos puros, estériles y estables.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cómo es el proceso de curación con Vice Colors?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Gracias a sus componentes de alta pureza, minimizan el trauma durante la sesión y curan con excelente retención, manteniendo tonos vivos e idénticos al primer día.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Vice Colors es un producto vegano?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Sí, toda la gama de tintas Vice Colors es 100% apta para veganos y está fabricada sin ningún tipo de crueldad o componente de origen animal.
              </p>
            </div>
          </div>
        </section>

      </div>

      <FooterSupply />
    </div>
  )
}