import { Link } from 'react-router-dom'

const brands = [
  { name: 'TATTOO VISION', to: '/supply/brands/tattoo-vision' },
  { name: 'WJX', to: '/supply/cartridges/wjx' },
  { name: 'VICE COLORS', to: '/supply/ink/vice-colors' },
  { name: 'DYNAMIC', to: '/supply/ink/dynamic' },
  { name: 'HEAVEN PRO', to: '/supply/brands/heaven-pro' },
  { name: 'ROYAL THREE', to: '/supply/brands/royal-three' },
  { name: 'KWADRON', to: '/supply/cartridges/kwadron' },
]

export default function BrandsSupply() {
  return (
    <section
      id="marcas"
      className="py-12 md:py-16 lg:py-20 px-6 bg-zinc-950 border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto">

        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-8">
            Marcas
          </h2>
          <div className="bg-zinc-950 border border-blue-500/40 rounded-2xl p-8">
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
              Calidad comprobada. Marcas elegidas por profesionales que no dejan nada al azar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              to={brand.to}
              className="h-32 border border-zinc-800 bg-black flex items-center justify-center hover:border-blue-500 transition-all duration-300"
            >
              <p className="text-zinc-500 font-black tracking-[0.2em] text-xs text-center px-2">
                {brand.name}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
