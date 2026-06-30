import { Link } from 'react-router-dom'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

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
      className="relative overflow-hidden pt-3 md:pt-6 pb-8 md:pb-12 px-6 bg-gray-950 border-t border-zinc-900"
    >
      <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
      <div className="relative z-10 max-w-7xl mx-auto">

        <div className="mb-4 md:mb-8">
          <h2 className="text-2xl md:text-4xl font-black uppercase mb-2">
            Marcas
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Calidad comprobada. Elegidas por profesionales que no dejan nada al azar.
          </p>
        </div>

        <div className="flex md:grid md:grid-cols-4 lg:grid-cols-7 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              to={brand.to}
              className="snap-start flex-shrink-0 w-[44vw] md:w-auto h-36 border border-zinc-800 bg-black flex items-center justify-center hover:border-blue-500 transition-all duration-300"
            >
              <p className="text-zinc-500 font-black tracking-[0.15em] text-[10px] md:text-xs text-center px-2">
                {brand.name}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
