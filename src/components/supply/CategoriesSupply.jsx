const categories = [
  'Machines',
  'Cartridges',
  'Power Supplies',
  'Ink',
  'Needles',
  'Gloves',
  'Aftercare',
  'Accessories',
  'Furniture',
  'Bundles'
]

export default function CategoriesSupply() {

  return (
    

    <section id="categorias" className="py-24 px-6 bg-black">

      <div className="max-w-7xl mx-auto">

        {/* TITULO */}
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

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

          {categories.map((category) => (

            <button
              key={category}
              className="h-36 border border-zinc-800 bg-zinc-950 hover:border-blue-500 hover:bg-zinc-900 transition-all duration-300 uppercase tracking-[0.2em] font-bold text-sm text-zinc-300"
            >
              {category}
            </button>

          ))}

        </div>

      </div>

    </section>

  )

}