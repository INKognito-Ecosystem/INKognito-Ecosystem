import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'

const categories = [
  {
    name: 'Negros',
    products: [
      'Zuper Black',
      'True Black',
      'Lining Black'
    ]
  },
  {
    name: 'Blancos',
    products: [
      'Snow White Opaque',
      'Snow White Mixing White'
    ]
  },
  {
    name: 'Rojos',
    products: [
      'Dragon Red',
      'Bright Red',
      'Crimson Red',
      'Bordeaux Red'
    ]
  },
  {
    name: 'Amarillos',
    products: [
      'Lemon Yellow',
      'Golden Yellow',
      'Bright Yellow'
    ]
  },
  {
    name: 'Naranjas',
    products: [
      'Bright Orange',
      'Burnt Orange'
    ]
  },
  {
    name: 'Azules',
    products: [
      'Persian Blue',
      'True Blue',
      'Dark Blue',
      'Baby Blue'
    ]
  },
  {
    name: 'Verdes',
    products: [
      'Light Green',
      'Dark Green',
      'Lime Green'
    ]
  },
  {
    name: 'Morados',
    products: [
      'Dark Purple',
      'Violet',
      'Lavender'
    ]
  },
  {
    name: 'Rosas',
    products: [
      'Hot Pink',
      'Soft Pink'
    ]
  },
  {
    name: 'Marrones',
    products: [
      'Chocolate',
      'Sienna',
      'Brown'
    ]
  },
  {
    name: 'Tonos piel',
    products: [
      'Flesh Tone',
      'Dark Flesh',
      'Light Flesh'
    ]
  }
]

export default function IntenzeColorsPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      <NavbarCategory pageName="Intenze Ink" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Intenze Ink
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            Catálogo Completo
          </h1>
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
                          Intenze Ink
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

      </div>

      <FooterSupply />

    </div>
  )
}