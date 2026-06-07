import { Link } from 'react-router-dom'

const categories = [
  { name: 'Machines', path: '/supply/machines' },
  { name: 'Cartridges', path: '/supply/cartridges' },
  { name: 'Power Supplies', path: '/supply/power-supplies' },
  { name: 'Ink', path: '/supply/ink' },
  { name: 'Needles', path: '/supply/needles' },
  { name: 'Gloves', path: '/supply/gloves' },
  { name: 'Aftercare', path: '/supply/aftercare' },
  { name: 'Accessories', path: '/supply/accessories' },
  { name: 'Furniture', path: '/supply/furniture' },
  { name: 'Bundles', path: '/supply/bundles' },
]

export default function CategoriesSupply() {
  return (
    <section id="categorias" className="py-24 px-6 bg-black">
      <div className="max-w-7xl mx-auto">

        <div className="mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-400 text-lg md:text-xl mb-4 font-semibold">
            Categories
          </p>
          <h2 className="text-4xl md:text-6xl font-black uppercase leading-none">
            Equipment
            <br />
            Selection
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="h-36 border border-zinc-800 bg-zinc-950 hover:border-blue-500 hover:bg-zinc-900 transition-all duration-300 uppercase tracking-[0.2em] font-bold text-sm text-zinc-300 flex items-center justify-center"
            >
              {category.name}
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}