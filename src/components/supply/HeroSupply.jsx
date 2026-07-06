import { Link } from 'react-router-dom'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

export default function HeroSupply() {

  const featuredBrand = {
    name: 'Tattoo Vision',
    description: 'Precisión visual para artistas exigentes.',
    category: 'Gafas • Iluminación • Sistemas visuales'
  }

  return (

    <section className="relative md:min-h-screen pt-16 md:pt-32 pb-8 md:pb-0 bg-gray-950 text-white flex items-center px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">

        {/* IZQUIERDA */}
        <div>

          <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9]">
            Professional
            <br />
            Tattoo
            <br />
            Equipment
          </h1>

          <p className="mt-3 text-zinc-400 text-lg leading-relaxed max-w-xl">
            Equipamiento profesional para tatuadores en Urabá. Stock real,
            calidad verificada y el respaldo que tu trabajo exige.
          </p>

          {/* BOTONES — ancho completo en móvil, flex en desktop */}
          <div className="grid grid-cols-3 md:flex md:flex-wrap gap-3 mt-6 md:mt-10">
            <Link
              to="/supply/ink/vice-colors"
              className="text-center py-3 border border-blue-500 text-white uppercase tracking-wider text-[11px] md:text-sm md:px-6 hover:bg-blue-500 transition-all duration-300"
            >
              Vice Colors
            </Link>
            <Link
              to="/supply/brands/tattoo-vision"
              className="text-center py-3 border border-blue-500 text-white uppercase tracking-wider text-[11px] md:text-sm md:px-6 hover:bg-blue-500 transition-all duration-300"
            >
              Tattoo Vision
            </Link>
            <Link
              to="/supply/brands/heaven-pro"
              className="text-center py-3 border border-blue-500 text-white uppercase tracking-wider text-[11px] md:text-sm md:px-6 hover:bg-blue-500 transition-all duration-300"
            >
              Heaven Pro
            </Link>
          </div>

          <p className="md:hidden mt-5 text-center text-xs italic tracking-wide text-zinc-400">
            “De un tatuador, para tatuadores.”
          </p>

        </div>

        {/* DERECHA — solo desktop */}
<div className="hidden md:flex justify-center">

<div className="bg-zinc-950 border border-blue-500/30 rounded-2xl p-8 hover:border-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300">
    <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs mb-4">
      Cobertura Regional
    </p>

    <h3 className="text-4xl font-black uppercase mb-8">
      Urabá
    </h3>

    <div className="space-y-4 mb-8">

      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
  <span className="text-zinc-300">Turbo</span>
  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
</div>

      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <span className="text-zinc-300">Apartadó</span>
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
      </div>

      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <span className="text-zinc-300">Carepa</span>
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
      </div>

      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <span className="text-zinc-300">Chigorodó</span>
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-zinc-300">Mutata</span>
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
      </div>

    </div>

    <div className="border-t border-zinc-800 pt-6">

      <p className="text-zinc-400 leading-relaxed">
        Distribución y soporte para tatuadores en toda la región.
      </p>

    </div>

  </div>

</div>
</div>
 </section>

  )

}