import { Link } from 'react-router-dom'

const brands = [
  'TATTOO VISION',
  'FK IRONS',
  'CHEYENNE',
  'CRITICAL',
  'BISHOP',
  'KWADRON'
]

export default function BrandsSupply() {
  return (
    <section
      id="marcas"
      className="py-28 px-6 bg-zinc-950 border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto">

        {/* TITULO */}
        <div className="mb-16 text-center">

          <p className="uppercase tracking-[0.25em] text-zinc-400 text-lg md:text-xl mb-4 font-semibold">
            Marcas
          </p>

          <h2 className="text-4xl md:text-6xl font-black uppercase leading-none">
            Marcas
            <br />
            Profesionales
          </h2>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

          {brands.map((brand) => (

            brand === 'TATTOO VISION' ? (

              <Link
                key={brand}
                to="/brands/tattoo-vision"
                className="h-32 border border-zinc-800 bg-black flex items-center justify-center hover:border-blue-500 transition-all duration-300"
              >
                <p className="text-zinc-500 font-black tracking-[0.2em] text-sm text-center">
                  {brand}
                </p>
              </Link>

            ) : (

              <div
                key={brand}
                className="h-32 border border-zinc-800 bg-black flex items-center justify-center hover:border-blue-500 transition-all duration-300"
              >
                <p className="text-zinc-500 font-black tracking-[0.2em] text-sm text-center">
                  {brand}
                </p>
              </div>

            )

          ))}

        </div>

      </div>
    </section>
  )
}