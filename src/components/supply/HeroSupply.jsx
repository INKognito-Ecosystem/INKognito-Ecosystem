import { Link } from 'react-router-dom'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

export default function HeroSupply() {

  // pt-20 (antes pt-16 en móvil, igual a la altura del navbar h-16 — el
  // título quedaba pegado al borde; pt-24 quedó muy separado, reportado por
  // Jose 2026-08-03)
  return (

    <section className="relative pt-20 pb-4 md:pb-8 bg-gray-950 text-white flex items-center px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />

      <div className="relative z-10 max-w-3xl mx-auto w-full">

        <div className="text-center">

          <p className="uppercase tracking-[0.4em] text-blue-500 text-xs md:text-sm mb-4 md:mb-6 font-semibold">
            INKognito Supply — Colombia
          </p>

          <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9]">
            Professional
            <br />
            <span className="text-blue-500">Tattoo</span>
            <br />
            Equipment
          </h1>

          <p className="mt-3 text-zinc-400 text-lg leading-relaxed max-w-xl mx-auto">
            Tienda online que reúne productos de proveedores locales y
            nacionales, verificados y reconocidos. Stock real, calidad
            garantizada y el respaldo que tu trabajo exige.
          </p>

          {/* BOTONES — ancho completo en móvil, flex en desktop */}
          <div className="grid grid-cols-3 md:flex md:flex-wrap md:justify-center gap-3 mt-6 md:mt-10">
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

          <p className="mt-5 text-center text-xs italic tracking-wide text-zinc-400">
            “De un tatuador, para tatuadores.”
          </p>

        </div>

      </div>
 </section>

  )

}