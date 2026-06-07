import { Link } from 'react-router-dom'
import FooterSupply from '../FooterSupply'


const products = [
  { id: 1, name: 'Tattoo Vision 2X', category: 'Sistema Visual', price: '$1.500.000' },
  { id: 2, name: 'Tattoo Vision 2', category: 'Sistema Visual', price: '$1.140.000' },
  { id: 3, name: 'Gafas Eclipse', category: 'Gafas', price: '$800.000' },
  { id: 4, name: 'Kit Tattoo Vision', category: 'Kit', price: '$840.000' },
  { id: 5, name: 'Luz LED Profesional', category: 'Iluminación', price: '$600.000' },
  { id: 6, name: 'Stand Articulado para Tablet', category: 'Accesorio', price: '$79.900' },
  { id: 7, name: 'Trípode Viajero', category: 'Accesorio', price: '$200.000' },
  { id: 8, name: 'Gafas Clásicas', category: 'Gafas', price: '$400.000' },
  { id: 9, name: 'Gafas Dager', category: 'Gafas', price: '$400.000' },
  { id: 10, name: 'Gafas Flex', category: 'Gafas', price: '$400.000' },
  { id: 11, name: 'Gafas REC', category: 'Gafas', price: '$400.000' },
  { id: 12, name: 'Gafas Orbe', category: 'Gafas', price: '$400.000' },
  { id: 13, name: 'Gafas Liner', category: 'Gafas', price: '$400.000' },
]

export default function TattooVisionPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-16 md:h-20 flex items-center justify-between">

            <Link
              to="/supply"
              className="text-base md:text-2xl font-black uppercase tracking-[0.2em]"
            >
              <span className="text-white">INK</span>
              <span className="text-zinc-500">OGNITO SUPPLY</span>
            </Link>

            <span className="hidden md:block uppercase text-sm tracking-[0.2em] text-zinc-400">
              Tattoo Vision
            </span>

            <div className="flex items-center gap-4 md:gap-8">

              <Link
                to="/supply"
                className="uppercase text-xs md:text-sm tracking-[0.2em] text-zinc-500 hover:text-white transition-all duration-300"
              >
                Supply
              </Link>

              <Link
                to="/"
                className="uppercase text-xs md:text-sm tracking-[0.2em] text-zinc-500 hover:text-white transition-all duration-300"
              >
                Ecosistema
              </Link>

            </div>

          </div>
        </div>
      </nav>

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">

          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Marca Profesional
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-6">
            Tattoo Vision
          </h1>

          <p className="max-w-3xl text-zinc-400 text-sm md:text-base leading-relaxed">
            Sistemas visuales diseñados para tatuadores profesionales.
            Gafas especializadas, iluminación avanzada y accesorios
            desarrollados para mejorar la visibilidad, reducir reflejos
            y aumentar la precisión durante el proceso de tatuaje.
          </p>

        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">

          {products.map((product) => (

            <div
              key={product.id}
              className="border border-zinc-800 bg-zinc-950 rounded-xl md:rounded-2xl overflow-hidden hover:border-zinc-600 transition-all duration-300"
            >

              <div className="h-40 md:h-72 bg-zinc-900 flex items-center justify-center">

                <p className="text-zinc-700 uppercase tracking-[0.3em] text-xs md:text-sm text-center px-4">
                  Product Image
                </p>

              </div>

              <div className="p-4 md:p-6">

                <p className="text-zinc-500 uppercase tracking-[0.2em] text-xs mb-2">
                  {product.category}
                </p>

                <h3 className="text-lg md:text-2xl font-black uppercase mb-3">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between">

                  <span className="text-white font-bold text-sm md:text-xl">
                    {product.price}
                  </span>

                  <button className="px-3 md:px-5 py-2 border border-zinc-700 uppercase tracking-[0.2em] text-xs hover:border-white transition-all duration-300">
                    Ver
                  </button>

                </div>

              </div>

            </div>

          ))}
        </div>
      </div>

      <FooterSupply />

    </div>
  )
}