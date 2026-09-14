import BrandsMarquee from './BrandsMarquee'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

export default function HeroSupply({ imgs = {} }) {

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
            Ecosistema de distribución de insumos profesionales. Red de
            proveedores verificados con stock real y alcance nacional. La
            infraestructura digital que potencia tu trabajo.
          </p>

          {/* Prueba (2026-09-13, Jose: "tomar los logos de las marcas de
              Supply y hacer un carrusel como el de las tecnologías
              usadas") — mismo scroll infinito que TechMarquee.jsx, ahora
              con los logos de marcas de Supply. Los botones (Vice Colors /
              Tattoo Vision / Heaven Pro) que vivían acá se quitaron (Jose,
              2026-09-13) y se reemplazaron por este mismo carrusel con su
              propia frase encima. */}
          <p className="mt-8 md:mt-10 text-center text-[10px] md:text-xs uppercase tracking-[0.3em] text-zinc-500 font-semibold">
            Marcas referentes en la industria
          </p>
          <BrandsMarquee imgs={imgs} />

          <p className="mt-5 text-center text-xs italic tracking-wide text-zinc-400">
            “De un tatuador, para tatuadores.”
          </p>

        </div>

      </div>
 </section>

  )

}