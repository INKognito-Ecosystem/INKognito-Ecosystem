import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import Seo from '../../../Seo'
import { useSupplyCart } from '../../../../contexts/SupplyCartContext'

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
  const { addItem } = useSupplyCart()
  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Tintas Intenze | INKognito Supply — Colombia"
        description="Intenze: alta pigmentación, fórmula estéril y vegana. Zuper Black, True Black y gama completa de colores. Disponibles en Urabá, despacho a Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/ink/intenze`}
      />

      <NavbarCategory pageName="Intenze Ink" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Intenze Ink
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            Catálogo Completo
          </h1>

          <div className="mt-10 max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-5">
              Intenze Ink es una de las marcas de tinta para tatuaje más reconocidas a nivel mundial. Utilizada por miles de artistas profesionales, destaca por la intensidad de sus pigmentos, la consistencia de sus colores y la amplia variedad de tonos disponibles.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-5">
              Sus líneas incluyen colores sólidos, tonos para realismo, mezclas para retrato y pigmentos desarrollados junto a artistas reconocidos de la industria del tatuaje.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Explora el catálogo completo de Intenze Ink y encuentra referencias originales para trabajos de color, black and grey, ilustración, neotradicional y realismo.
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

                {category.products.map((name) => {
                  const product = { id: name, name, brand: 'Intenze Ink', price: '$XX.XXX' }
                  return (
                    <div
                      key={name}
                      className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 hover:border-zinc-600 transition-all duration-300"
                    >

                      <div className="aspect-square bg-zinc-900 flex items-center justify-center">
                        <span className="text-zinc-700 uppercase tracking-[0.2em] text-xs">
                          Foto
                        </span>
                      </div>

                      <div className="p-3 md:p-4">

                        <h3 className="font-bold text-sm md:text-lg mb-2">
                          {name}
                        </h3>

                        <span className="text-zinc-500 text-xs uppercase block mb-2">
                          Intenze Ink
                        </span>

                        <span className="text-white font-bold text-sm block mb-3">
                          {product.price}
                        </span>

                        <button
                          onClick={() => addItem(product, 'ink-intenze')}
                          className="w-full py-2 border border-zinc-700 uppercase tracking-[0.15em] text-xs hover:border-blue-500 hover:text-blue-500 transition-all duration-300"
                        >
                          + Agregar al carrito
                        </button>

                      </div>

                    </div>
                  )
                })}

              </div>

            </section>

          ))}

        </div>

      </div>

      <FooterSupply />

    </div>
  )
}