import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'

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
      <NavbarCategory pageName="Vice Colors" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Vice Colors
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            Catálogo Completo
          </h1>
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

      </div>

      <FooterSupply />
    </div>
  )
}