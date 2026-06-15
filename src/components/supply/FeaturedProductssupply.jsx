import { Link } from 'react-router-dom'

const products = [
  {
    id: 1,
    name: 'Tattoo Vision',
    brand: 'Marca profesional',
    tagline: 'Lo más buscado en sistemas visuales',
    link: '/supply/brands/tattoo-vision'
  },
  {
    id: 2,
    name: 'Vice Colors',
    brand: 'Tintas',
    tagline: 'Recomendado por artistas de color',
    link: '/supply/ink/vice-colors'
  },
  {
    id: 3,
    name: 'WJX',
    brand: 'Cartuchos',
    tagline: 'Precisión y flujo para cada sesión',
    link: '/supply/cartridges/wjx'
  },
  {
    id: 4,
    name: 'Heaven Pro',
    brand: 'Cuidado pro',
    tagline: 'Nuevo en INKognito Supply',
    link: '/supply/brands/heaven-pro'
  }
]

export default function FeaturedProducts() {
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
          {products.map((product) => (
            <Link key={product.id} to={product.link} className="block h-full">
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
                    <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                      {product.tagline}
                    </p>
                  </div>
                  <span className="text-center px-3 sm:px-5 py-1.5 sm:py-2 border border-zinc-700 uppercase tracking-[0.2em] text-[10px] sm:text-sm hover:border-blue-500 hover:text-white transition-all duration-300">
                    Ver
                  </span>
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 md:mt-16 lg:mt-20">
        <div className="border-b border-zinc-900" />
      </div>

    </section>
  )
}
