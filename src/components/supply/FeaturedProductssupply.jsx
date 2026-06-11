import { Link } from 'react-router-dom'
import { useSupplyCart } from '../../contexts/SupplyCartContext'

const products = [
  {
    id: 1,
    name: 'Tattoo Vision',
    brand: 'Marca profesional',
    price: 'Original',
    link: '/brands/tattoo-vision'
  },
  {
    id: 2,
    name: 'Vice Colors',
    brand: 'Tintas',
    price: '$30',
    link: '/supply/ink/vice-colors'
  },
  {
    id: 3,
    name: 'WJX',
    brand: 'Cartuchos',
    price: '$28',
    link: '/supply/cartridges/wjx'
  },
  {
    id: 4,
    name: 'Heaven Pro',
    brand: 'Cuidado pro',
    price: 'Soon',
    link: null
  }
]

const isNumericPrice = (price) => price.startsWith('$')

export default function FeaturedProducts() {
  const { addItem } = useSupplyCart()

  return (
    <section
      id="destacados"
      className="pt-12 md:pt-16 lg:pt-20 pb-4 md:pb-6 lg:pb-8 px-6 bg-black"
    >
      <div className="max-w-7xl mx-auto">

        {/* TITULO */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-8">
            Destacados
          </h2>
          <div className="bg-zinc-950 border border-blue-500/40 rounded-2xl p-8">
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
              Descubre los productos más buscados por tatuadores profesionales.
            </p>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">

          {products.map((product) => {
            const CardContent = (
              <div className="border border-blue-500/40 bg-zinc-950 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] transition-all duration-300 h-full flex flex-col justify-between">

                {/* IMAGEN */}
                <div className="h-48 sm:h-72 bg-zinc-900 flex items-center justify-center">
                  <p className="text-zinc-600 uppercase tracking-[0.3em] text-xs sm:text-sm">
                    Product Image
                  </p>
                </div>

                {/* INFO */}
                <div className="p-4 sm:p-6 flex flex-col gap-3">
                  <div>
                    <p className="text-zinc-500 uppercase tracking-[0.25em] text-[10px] sm:text-xs mb-2">
                      {product.brand}
                    </p>
                    <h3 className="text-lg sm:text-2xl font-black uppercase">
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-sm sm:text-xl">
                      {product.price}
                    </span>
                    {product.link ? (
                      <span className="px-3 sm:px-5 py-1.5 sm:py-2 border border-zinc-700 uppercase tracking-[0.2em] text-[10px] sm:text-sm hover:border-blue-500 hover:text-white transition-all duration-300">
                        Ver
                      </span>
                    ) : (
                      <span className="px-3 sm:px-5 py-1.5 sm:py-2 border border-zinc-800 uppercase tracking-[0.2em] text-[10px] sm:text-sm text-zinc-700 cursor-not-allowed">
                        Soon
                      </span>
                    )}
                  </div>

                  {/* AGREGAR AL CARRITO — solo para productos con precio real */}
                  {isNumericPrice(product.price) && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        addItem(product, 'destacados')
                      }}
                      className="w-full py-2 border border-zinc-700 uppercase tracking-[0.15em] text-xs hover:border-blue-500 hover:text-blue-500 transition-all duration-300"
                    >
                      + Agregar al carrito
                    </button>
                  )}
                </div>

              </div>
            )

            return product.link ? (
              <Link key={product.id} to={product.link} className="block h-full">
                {CardContent}
              </Link>
            ) : (
              <div key={product.id} className="block h-full">
                {CardContent}
              </div>
            )
          })}

        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 md:mt-16 lg:mt-20">
        <div className="border-b border-zinc-900" />
      </div>

    </section>
  )
}
