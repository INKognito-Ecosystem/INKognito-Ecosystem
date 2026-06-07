import { Link } from 'react-router-dom'
import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'

const products = [
  {
    id: 1,
    name: 'Intenze Ink Set',
    brand: 'Intenze',
    price: '$25',
    link: '/supply/ink/intenze'
  },
  {
    id: 2,
    name: 'Dynamic Color Set',
    brand: 'Dynamic',
    price: '$20',
    link: '/supply/ink/dynamic'
  },
  {
    id: 3,
    name: 'Eternal Ink Set',
    brand: 'Eternal',
    price: '$35',
    link: '/supply/ink/eternal'
  },
  {
    id: 4,
    name: 'Fusion Ink Set',
    brand: 'Fusion',
    price: '$28',
    link: '/supply/ink/fusion'
  },
  {
    id: 5,
    name: 'World Famous Set',
    brand: 'World Famous',
    price: '$30',
    link: '/supply/ink/world-famous'
  },
  {
    id: 6,
    name: 'Solid Ink Set',
    brand: 'Solid Ink',
    price: '$22',
    link: '/supply/ink/solid-ink'
  },
  {
    id: 7,
    name: 'Vice Colors Set',
    brand: 'Vice',
    price: '$30',
    link: '/supply/ink/vice-colors'
  }
]

export default function InkPage() {
  return (
    <>
      <div className="min-h-screen bg-black text-white">

        <NavbarCategory pageName="Tintas" />

        <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

          <div className="mb-10 md:mb-16">
            <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
              Categoría
            </p>

            <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
              Ink
            </h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">

            {products.map((product) => (

              <div
                key={product.id}
                className="border border-zinc-800 bg-zinc-950 rounded-xl md:rounded-2xl overflow-hidden hover:border-zinc-600 transition-all duration-300"
              >

                <div className="h-40 md:h-64 bg-zinc-900 flex items-center justify-center">
                  <p className="text-zinc-700 uppercase tracking-[0.3em] text-xs md:text-sm">
                    Product Image
                  </p>
                </div>

                <div className="p-4 md:p-6">

                  <p className="text-zinc-500 uppercase tracking-[0.2em] text-xs mb-1">
                    {product.brand}
                  </p>

                  <h3 className="text-lg md:text-2xl font-black uppercase mb-3">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between">

                    <span className="text-white font-bold text-base md:text-xl">
                      {product.price}
                    </span>

                    <Link
                       to={product.link}
                       className="px-3 md:px-5 py-2 border border-zinc-700 uppercase tracking-[0.2em] text-xs hover:border-white transition-all duration-300"
>
                       Ver
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

      <FooterSupply />

    </>
  )
}