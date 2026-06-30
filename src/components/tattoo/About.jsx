import aboutBg from '../../assets/about/about-bg.webp'

export default function About() {
  return (
    <section id="acerca" className="relative py-8 md:py-14 px-4 overflow-hidden border-t border-white/5">

      {/* IMAGEN DE FONDO */}
      <img
        src={aboutBg}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />

      {/* CAPA OSCURA */}
      <div className="absolute inset-0 bg-black/25"></div>

      {/* CONTENIDO */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">

        {/* TITULO */}
        <button className="mb-10 px-8 py-3 rounded bg-white text-black font-black uppercase tracking-widest cursor-default">
          Acerca de mí
        </button>

        {/* TEXTO */}
        <div className="space-y-6 text-gray-300 text-lg leading-relaxed font-light">

          <p>
            Soy Jose Humanez.
          </p>

          <p>
            Vivo el arte como una extensión de quién soy.
            La disciplina, el entrenamiento y la creatividad hacen parte de mi proceso dentro y fuera del estudio, porque creo que cuerpo y mente también forman parte del arte que proyectamos.
          </p>

          <p>
            Desde Chigorodó, en la región de Urabá, Antioquia — Colombia, trabajo cada pieza con intención, detalle y visión artística, buscando crear tatuajes que realmente conecten con la identidad de cada persona.
          </p>

          <p>
            INKOGNITO Tattoo Studio nace de esa filosofía:
            crear arte que permanezca.
          </p>

          <p className="text-white text-xl italic font-semibold pt-4">
            "Hago arte para no morir. Desafío cuerpo y mente."
          </p>

        </div>

      </div>

    </section>
  )
}