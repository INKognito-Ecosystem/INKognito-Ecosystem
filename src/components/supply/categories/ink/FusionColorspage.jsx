import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'

const categories = [
  {
    name: 'Negros',
    products: [
      'Black',
      'Power Black',
      'True Black'
    ]
  },
  {
    name: 'Blancos',
    products: [
      'White',
      'Extra White'
    ]
  },
  {
    name: 'Rojos',
    products: [
      'Bright Red',
      'Crimson Red',
      'Red Brown',
      'Blood Red'
    ]
  },
  {
    name: 'Azules',
    products: [
      'Baby Blue',
      'True Blue',
      'Blue Sky',
      'Dark Blue'
    ]
  },
  {
    name: 'Verdes',
    products: [
      'Lime Green',
      'Leaf Green',
      'Dark Green',
      'Olive Green'
    ]
  },
  {
    name: 'Amarillos',
    products: [
      'Golden Yellow',
      'Bright Yellow',
      'Mustard'
    ]
  },
  {
    name: 'Naranjas',
    products: [
      'Orange',
      'Tangerine',
      'Rustic Orange'
    ]
  },
  {
    name: 'Morados y rosas',
    products: [
      'Purple',
      'Lavender',
      'Hot Pink',
      'Bubblegum Pink'
    ]
  },
  {
    name: 'Marrones',
    products: [
      'Chocolate',
      'Dark Chocolate',
      'Sienna',
      'Burnt Umber'
    ]
  },
  {
    name: 'Tonos piel',
    products: [
      'Flesh Tone Extra Light',
      'Flesh Tone Light',
      'Flesh Tone Medium',
      'Flesh Tone Dark'
    ]
  }
]

export default function FusionColorsPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      <NavbarCategory pageName="Fusion Ink" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Fusion Ink
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            Catálogo Completo
          </h1>
        </div>

        <div className="space-y-10">

          {categories.map((category) => (

            <div key={category.name}>

              <h2 className="text-2xl md:text-3xl font-black uppercase mb-5 border-b border-zinc-800 pb-3">
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

                    <div className="p-3">

                      <h3 className="font-bold text-sm md:text-base">
                        {product}
                      </h3>

                      <div className="mt-2 flex justify-between items-center">

                        <span className="text-zinc-400 text-xs">
                          Fusion Ink
                        </span>

                        <button className="text-xs px-2 py-1 border border-zinc-700 rounded hover:border-white transition-colors">
                          Ver
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>

      </div>

      <FooterSupply />

    </div>
  )
}