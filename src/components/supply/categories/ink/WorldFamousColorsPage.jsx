import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'

const categories = [
  {
    name: 'Negros y grises',
    products: [
      'Blackout',
      'Triple Blackout',
      'Ghost Grey',
      'Dark Greywash',
      'Medium Greywash',
      'Light Greywash'
    ]
  },
  {
    name: 'Rojos',
    products: [
      'Scarlet Red',
      'Stop Red',
      'Brick Red',
      'Bordeaux',
      'Dark Red'
    ]
  },
  {
    name: 'Azules',
    products: [
      'Blue Concentrate',
      'Dark Blue',
      'Sky Blue',
      'Michele Turco Blue',
      'Limitless Blue'
    ]
  },
  {
    name: 'Verdes',
    products: [
      'Lime Green',
      'Dark Green',
      'Olive Green',
      'Army Green',
      'Limitless Green'
    ]
  },
  {
    name: 'Amarillos y naranjas',
    products: [
      'Canary Yellow',
      'Golden Yellow',
      'Sunflower',
      'Orange',
      'Burnt Orange'
    ]
  },
  {
    name: 'Morados y rosas',
    products: [
      'Purple Concentrate',
      'Violet',
      'Magenta',
      'Hot Pink',
      'Pink Ribbon'
    ]
  },
  {
    name: 'Marrones',
    products: [
      'Chocolate',
      'Dark Brown',
      'Sienna',
      'Burnt Umber',
      'Terra Cotta'
    ]
  },
  {
    name: 'Blancos',
    products: [
      'White House',
      'Straight White',
      'Limitless White'
    ]
  },
  {
    name: 'Tonos piel',
    products: [
      'Dark Flesh',
      'Medium Flesh',
      'Light Flesh',
      'Pink Skin',
      'Skin Tone'
    ]
  }
]

export default function WorldFamousColorsPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      <NavbarCategory pageName="World Famous" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            World Famous Ink
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
                          World Famous
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