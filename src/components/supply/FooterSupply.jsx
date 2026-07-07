import { Link } from 'react-router-dom'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

export default function FooterSupply() {

  return (

    <footer id="contacto" className="relative overflow-hidden border-t border-zinc-900">

      {/* BARRA SUPERIOR — negra, igual al navbar */}
      <div className="bg-black border-b border-zinc-900 px-6 py-4">
        <h2 className="max-w-7xl mx-auto text-xl md:text-2xl font-black uppercase tracking-[0.15em] text-center">
          <span className="text-white">INK</span>
          <span className="text-blue-500">OGNITO </span>
          <span className="text-blue-500">SUPPLY</span>
        </h2>
      </div>

      <div className="relative bg-gray-950 px-6 py-6 md:py-8">
      <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">

          {/* IZQUIERDA */}
          <div>

            <p className="text-zinc-500 leading-relaxed max-w-sm text-sm">
              Equipamiento profesional para artistas que trabajan con precisión, identidad y disciplina.
            </p>

          </div>

          {/* CENTRO */}
          <div>

            <p className="uppercase tracking-[0.25em] text-zinc-400 text-sm mb-3 font-semibold">
              Navegación
            </p>

            <div className="flex flex-col gap-2">
  <Link
    to="/supply#destacados"
    className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300"
  >
    Destacados
  </Link>

  <Link
    to="/supply#categorias"
    className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300"
  >
    Categorias
  </Link>

  <Link
    to="/supply#marcas"
    className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300"
  >
    Marcas
  </Link>
</div>

          </div>

          {/* DERECHA */}
          <div className="md:text-right">

            <p className="uppercase tracking-[0.25em] text-zinc-400 text-sm mb-3 font-semibold">
              Ecosistema
            </p>

            <Link
              to="/"
              className="inline-block border border-zinc-700 px-6 py-2.5 uppercase tracking-[0.2em] text-sm text-zinc-300 hover:border-blue-500 hover:text-white transition-all duration-300"
            >
              Volver
            </Link>

          </div>

        </div>

        {/* LINEA */}
        <div className="border-t border-zinc-900 mt-6 md:mt-8 pt-5 text-center">

          <p className="text-zinc-600 uppercase tracking-[0.2em] text-xs">
            © 2026 INKOGNITO. Todos los derechos reservados.
          </p>

        </div>

      </div>

      </div>

    </footer>

  )

}