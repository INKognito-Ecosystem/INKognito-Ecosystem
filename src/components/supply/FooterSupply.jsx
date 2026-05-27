import { Link } from 'react-router-dom'

export default function FooterSupply() {

  return (

    <footer className="border-t border-zinc-900 bg-black px-6 py-16">

      <div className="max-w-7xl mx-auto">

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-12">

          {/* IZQUIERDA */}
          <div>

            <h2 className="text-2xl font-black uppercase tracking-[0.15em] mb-4">

              <span className="text-white">
                INK
              </span>

              <span className="text-zinc-500">
                OGNITO SUPPLY
              </span>

            </h2>

            <p className="text-zinc-500 leading-relaxed max-w-sm">
              Equipamiento profesional para artistas que trabajan con precisión, identidad y disciplina.
            </p>

          </div>

          {/* CENTRO */}
          <div>

            <p className="uppercase tracking-[0.25em] text-zinc-400 text-sm mb-6 font-semibold">
              Navegación
            </p>

            <div className="flex flex-col gap-4">
            <a
  href="#productos"
  className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300"
>
  Productos
</a>

 <a
  href="#marcas"
  className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300"
>
  Marcas
</a>

            </div>

          </div>

          {/* DERECHA */}
          <div className="md:text-right">

            <p className="uppercase tracking-[0.25em] text-zinc-400 text-sm mb-6 font-semibold">
              Ecosistema
            </p>

            <Link
              to="/"
              className="inline-block border border-zinc-700 px-6 py-3 uppercase tracking-[0.2em] text-sm text-zinc-300 hover:border-blue-500 hover:text-white transition-all duration-300"
            >
              Volver
            </Link>

          </div>

        </div>

        {/* LINEA */}
        <div className="border-t border-zinc-900 mt-16 pt-8 text-center">

          <p className="text-zinc-600 uppercase tracking-[0.2em] text-xs">
            © 2026 INKOGNITO. Todos los derechos reservados.
          </p>

        </div>

      </div>

    </footer>

  )

}