import footerBg from '../../assets/footer/footer-bg.png'

import {
  FaInstagram,
  FaFacebookF,
  FaYoutube
} from 'react-icons/fa'

export default function Footer() {

  return (

    <footer className="relative overflow-hidden bg-black border-t border-gray-900 pt-20 pb-8">

      {/* FONDO CINEMATOGRAFICO */}
      <img
        src={footerBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-top opacity-30 translate-y-10"
      />

      {/* CONTENIDO */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">

        {/* TITULO GRANDE */}
        <div className="mb-16">

          <div className="w-full bg-zinc-700/80 backdrop-blur-sm rounded-xl px-8 py-6 shadow-xl">

            <h2 className="text-white font-black text-3xl md:text-5xl tracking-[0.2em] uppercase italic text-center">
              INKOGNITO ESTUDIO DE TATUAJES
            </h2>

          </div>

        </div>

        {/* CONTENIDO ABAJO */}
        <div className="flex flex-col md:flex-row justify-between gap-16 mb-16">

          {/* TEXTO IZQUIERDA */}
          <div className="max-w-md">

            <p className="text-gray-300 text-lg leading-relaxed">

              Elevando el arte corporal desde 2019. 
              Especialista en diseño personalizado y piezas únicas

              <br />
              <br />

              INKOGNITO nace de la unión entre disciplina, arte y visión.
              Un estudio construido para crear piezas con carácter,
              detalle impecable y una presencia que perdura en el tiempo.

              <br />
              <br />

              Creamos marcas permanentes para quienes entienden
              el valor del significado.

            </p>

          </div>

          {/* DERECHA */}
          <div className="flex flex-col gap-12">

            {/* HORARIO */}
            <div>

              <h4 className="text-white font-black mb-6 uppercase tracking-[0.2em] text-xl">
                Horario
              </h4>

              <ul className="text-gray-300 space-y-3 text-sm">

                <li>Lunes - Viernes: 10:00 - 20:00</li>

                <li>Sábado: 11:00 - 18:00</li>

                <li>Domingo: Cerrado</li>

              </ul>

            </div>

            {/* SOCIAL */}
            <div>

              <h4 className="text-white font-black mb-6 uppercase tracking-[0.2em] text-xl">
                Redes Sociales
              </h4>

              <div className="flex gap-5">

                {/* INSTAGRAM */}
                <a
                  href="https://www.instagram.com/jhumaneztattoo?igsh=MXh4ZW9vaGZnMDVtZQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-pink-500 hover:to-yellow-500 hover:border-transparent transition-all duration-300 hover:scale-110"
                >
                  <FaInstagram size={22} />
                </a>

                {/* FACEBOOK */}
                <a
                  href="https://www.facebook.com/share/172JDKdCqe/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center text-white hover:bg-blue-600 hover:border-transparent transition-all duration-300 hover:scale-110"
                >
                  <FaFacebookF size={20} />
                </a>

                {/* YOUTUBE */}
                <a
                  href="https://youtube.com/@jhumanezz?si=9uXLRHm_QPAWo6uB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center text-white hover:bg-red-600 hover:border-transparent transition-all duration-300 hover:scale-110"
                >
                  <FaYoutube size={22} />
                </a>

              </div>

            </div>

          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-white/10 pt-8 flex flex-col items-center text-gray-500 text-xs gap-4">

          <p>
            © 2026 INKOGNITO STUDIO TATTOO. TODOS LOS DERECHOS RESERVADOS.
          </p>

          <div className="flex space-x-6">

            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Términos
            </a>

            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Privacidad
            </a>

          </div>

        </div>

      </div>

    </footer>

  )
}