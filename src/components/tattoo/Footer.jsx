import { Link } from 'react-router-dom'
import footerBg from '../../assets/footer/footer-bg.webp'
import { TATTOO_HOURS } from '../../config/business'

import {
  FaInstagram,
  FaFacebookF,
  FaYoutube
} from 'react-icons/fa'

export default function Footer() {

  return (

    <footer className="relative overflow-hidden bg-black border-t border-gray-900 pt-8 md:pt-14 pb-8">

      {/* FONDO CINEMATOGRAFICO */}
      <img
        src={footerBg}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-top opacity-30 translate-y-10"
      />

      {/* CONTENIDO */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">

        {/* TITULO GRANDE */}
        <div className="mb-8 md:mb-16">

          <div className="w-full bg-zinc-700/80 backdrop-blur-sm rounded-xl px-3 sm:px-8 py-4 sm:py-6 shadow-xl">

            <h2 className="text-white font-black text-base sm:text-3xl md:text-5xl tracking-tight sm:tracking-[0.2em] uppercase italic text-center whitespace-nowrap">
              INKOGNITO ESTUDIO DE TATUAJES
            </h2>

          </div>

        </div>

        {/* CONTENIDO ABAJO */}
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-16 mb-8 md:mb-16">

          {/* TEXTO IZQUIERDA */}
          <div className="max-w-md">

            <p className="text-gray-300 text-sm leading-relaxed">

              Elevando el arte corporal desde 2019.
              Especialista en diseño personalizado y piezas únicas

              <br />
              <br />

              INKOGNITO nace de la unión entre disciplina, arte, identidad.
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

                <li>{TATTOO_HOURS.weekdays.label}: {TATTOO_HOURS.weekdays.hours}</li>

                <li>{TATTOO_HOURS.saturday.label}: {TATTOO_HOURS.saturday.hours}</li>

                <li>{TATTOO_HOURS.sunday.label}: Cerrado</li>

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
                  href="https://www.facebook.com/humanezjose"
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
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row sm:justify-between items-center text-gray-500 text-[12px] gap-4">

          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">
            © 2026 INKognito Tattoo. Todos los derechos reservados.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">

            <Link to="/terminos" className="hover:text-white transition-colors">
              Términos
            </Link>

            <Link to="/privacidad" className="hover:text-white transition-colors">
              Privacidad
            </Link>

            <span>Desarrollado por INKognito</span>

          </div>

        </div>

      </div>

    </footer>

  )
}