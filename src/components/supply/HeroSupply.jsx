import { Link } from 'react-router-dom'

export default function HeroSupply() {

  const featuredBrand = {
    name: 'Tattoo Vision',
    description: 'Precisión visual para artistas exigentes.',
    category: 'Gafas • Iluminación • Sistemas visuales'
  }

  return (

    <section className="min-h-screen pt-24 md:pt-32 bg-black text-white flex items-center px-6">

      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">

        {/* IZQUIERDA */}
        <div>

          <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9]">
            Professional
            <br />
            Tattoo
            <br />
            Equipment
          </h1>

          <p className="mt-8 text-zinc-400 text-lg leading-relaxed max-w-xl">
            Máquinas, cartuchos y herramientas seleccionadas
            para artistas que trabajan con precisión absoluta.
          </p>

          {/* BOTONES */}
          <div className="flex flex-wrap gap-4 mt-10">

            <Link
              to="/supply/machines"
              className="px-6 py-3 border border-blue-500 text-white uppercase tracking-widest text-sm hover:bg-blue-500 transition-all duration-300"
            >
              Maquinas
            </Link>

            <Link
              to="/brands/tattoo-vision"
              className="px-6 py-3 border border-blue-500 text-white uppercase tracking-widest text-sm hover:bg-blue-500 transition-all duration-300"
            >
              Tattoo Vision
            </Link>

            <Link
              to="/supply/cartridges"
              className="px-6 py-3 border border-blue-500 text-white uppercase tracking-widest text-sm hover:bg-blue-500 transition-all duration-300"
            >
              Cartuchos
            </Link>

          </div>

        </div>

        {/* DERECHA */}
<div className="flex justify-center">

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