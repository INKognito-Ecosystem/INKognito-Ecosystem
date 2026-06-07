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

      </div>

      <FooterSupply />
    </div>
  )
}