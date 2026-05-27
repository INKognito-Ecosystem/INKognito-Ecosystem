const products = [
  {
    name: 'Flux Max Machine',
    category: 'Machines',
    price: '$899'
  },

  {
    name: 'RL Cartridges',
    category: 'Cartridges',
    price: '$39'
  },

  {
    name: 'Critical Power',
    category: 'Power Supply',
    price: '$249'
  }
]

export default function FeaturedProducts() {

  return (
    

      <section
      id="destacados"
      className="py-28 px-6 bg-black"
    >


      <div className="max-w-7xl mx-auto">

        {/* TITULO */}
        <div className="mb-16">

         <p className="uppercase tracking-[0.25em] text-zinc-400 text-lg md:text-xl mb-4 font-semibold">
         Destacados
        </p>

          <h2 className="text-4xl md:text-6xl font-black uppercase leading-none">

            Selected
            <br />

            Equipment

          </h2>

        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">

          {products.map((product) => (

            <div
              key={product.name}
              className="border border-zinc-800 bg-zinc-950 rounded-2xl overflow-hidden hover:border-blue-500 transition-all duration-300"
            >

              {/* IMAGEN */}
              <div className="h-72 bg-zinc-900 flex items-center justify-center">

                <p className="text-zinc-600 uppercase tracking-[0.3em] text-sm">
                  Product Image
                </p>

              </div>

              {/* INFO */}
              <div className="p-6">

                <p className="text-zinc-500 uppercase tracking-[0.25em] text-xs mb-3">
                  {product.category}
                </p>

                <h3 className="text-2xl font-black uppercase mb-4">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between">

                  <span className="text-white font-bold text-xl">
                    {product.price}
                  </span>

                  <button className="px-5 py-2 border border-zinc-700 uppercase tracking-[0.2em] text-sm hover:border-blue-500 hover:text-white transition-all duration-300">

                    View

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  )

}