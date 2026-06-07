import { Link } from 'react-router-dom'
import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'

const products = [
  { id: 1, name: 'Flux Max', brand: 'FK Irons', price: '$899' },
  { id: 2, name: 'Spektra Xion', brand: 'FK Irons', price: '$750' },
  { id: 3, name: 'Atom X', brand: 'Cheyenne', price: '$620' },
  { id: 4, name: 'Sol Terra', brand: 'Cheyenne', price: '$580' },
  { id: 5, name: 'Dragonfly X2', brand: 'Swashdrive', price: '$420' },
  { id: 6, name: 'Injectra', brand: 'Bishop', price: '$390' },
]

export default function MachinesPage() {
  return (
  <>
    <div className="min-h-screen bg-black text-white">

      <NavbarCategory pageName="Máquinas" />

      {/* CONTENIDO */}
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">

        {/* TITULO */}
        <div className="mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-sm mb-4">
            Categoría
          </p>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none">
            Machines
          </h1>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-zinc-800 bg-zinc-950 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all duration-300"
            >
              <div className="h-64 bg-zinc-900 flex items-center justify-center">
                <p className="text-zinc-700 uppercase tracking-[0.3em] text-sm">
                  Product Image
                </p>
              </div>
              <div className="p-6">
                <p className="text-zinc-500 uppercase tracking-[0.25em] text-xs mb-2">
                  {product.brand}
                </p>
                <h3 className="text-2xl font-black uppercase mb-4">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-xl">
                    {product.price}
                  </span>
                  <button className="px-5 py-2 border border-zinc-700 uppercase tracking-[0.2em] text-sm hover:border-white hover:text-white transition-all duration-300">
                    Ver
                  </button>
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