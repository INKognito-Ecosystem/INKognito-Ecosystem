import { Link } from 'react-router-dom'
export default function HeroSupply() {

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

            <Link to="/supply/machines" className="px-6 py-3 border border-blue-500 text-white uppercase tracking-widest text-sm hover:bg-blue-500 transition-all duration-300">
              Maquinas
            </Link>

            <Link to="/brands/tattoo-vision" className="px-6 py-3 border border-blue-500 text-white uppercase tracking-widest text-sm hover:bg-blue-500 transition-all duration-300">
              Tattoo Vision
            </Link>

            <Link to="/supply/cartridges" className="px-6 py-3 border border-blue-500 text-white uppercase tracking-widest text-sm hover:bg-blue-500 transition-all duration-300">
              cartuchos
            </Link>

          </div>

        </div>

        {/* DERECHA */}
        <div className="flex justify-center">

          <div className="w-[420px] h-[420px] rounded-3xl border border-zinc-800 bg-zinc-900 flex items-center justify-center">

            <p className="text-zinc-600 uppercase tracking-[0.3em]">
              PRODUCT IMAGE
            </p>

          </div>

        </div>

      </div>

    </section>

  )

}
