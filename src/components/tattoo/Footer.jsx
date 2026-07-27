import { Link } from 'react-router-dom'
import footerBg from '../../assets/footer/footer-bg.webp'
import { TATTOO_HOURS } from '../../config/business'

import {
  FaInstagram,
  FaFacebookF,
  FaYoutube
} from 'react-icons/fa'

// Estructura de 3 columnas (descripción / navegación / contacto) — mismo
// patrón que Footer.jsx de Eljach: en móvil, Navegación y Contacto quedan
// lado a lado (grid-cols-2 md:contents) en vez de apiladas, minimalista.
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

        {/* CONTENIDO ABAJO — 3 columnas (descripción 1.4fr / navegación / contacto) */}
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-8 md:gap-12 mb-8 md:mb-16">

          {/* DESCRIPCIÓN + REDES */}
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

            <div className="flex gap-3 mt-5">

              <a
                href="https://www.instagram.com/jhumaneztattoo?igsh=MXh4ZW9vaGZnMDVtZQ=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-gradient-to-br hover:from-pink-500 hover:to-yellow-500 hover:text-white hover:border-transparent transition-all duration-300"
              >
                <FaInstagram size={15} />
              </a>

              <a
                href="https://www.facebook.com/humanezjose"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-transparent transition-all duration-300"
              >
                <FaFacebookF size={13} />
              </a>

              <a
                href="https://youtube.com/@jhumanezz?si=9uXLRHm_QPAWo6uB"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:border-transparent transition-all duration-300"
              >
                <FaYoutube size={15} />
              </a>

            </div>

          </div>

          {/* Móvil: Navegación y Contacto lado a lado — en desktop md:contents
              las vuelve a soltar como columnas normales del grid de arriba */}
          <div className="grid grid-cols-2 gap-6 md:contents">

            {/* NAVEGACIÓN */}
            <div>
              <h4 className="text-[13px] font-bold tracking-[1px] uppercase text-white mb-4">
                Navegación
              </h4>
              <ul className="flex flex-col gap-2 list-none">
                {[
                  ['Inicio', '/jhumaneztattoo'],
                  ['Portafolio', '/portafolio'],
                  ['Cuidados', '/cuidados'],
                  ['Acerca de mí', '/jhumaneztattoo#acerca'],
                ].map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="text-[14px] text-gray-400 hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACTO */}
            <div>
              <h4 className="text-[13px] font-bold tracking-[1px] uppercase text-white mb-4">
                Contacto
              </h4>
              <ul className="flex flex-col gap-2 list-none">
                <li>
                  <a
                    href="https://wa.me/573207911013?text=Hola%20Jose,%20quiero%20informaci%C3%B3n%20sobre%20un%20tatuaje"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-gray-400 hover:text-white transition-colors"
                  >
                    WhatsApp: 320 791 1013
                  </a>
                </li>
                <li className="text-[14px] text-gray-400">Chigorodó, Urabá</li>
                <li className="text-[14px] text-gray-400">
                  {TATTOO_HOURS.weekdays.label}: {TATTOO_HOURS.weekdays.hours}
                </li>
                <li className="text-[14px] text-gray-400">
                  {TATTOO_HOURS.saturday.label}: {TATTOO_HOURS.saturday.hours}
                </li>
                <li>
                  <Link to="/jhumaneztattoo#contacto" className="text-[14px] text-red-500 hover:text-red-400 transition-colors">
                    Reservar ahora →
                  </Link>
                </li>
              </ul>
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
