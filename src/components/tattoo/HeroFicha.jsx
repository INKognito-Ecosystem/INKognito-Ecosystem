import { FaInstagram, FaFacebookF } from 'react-icons/fa'
import { MapPin, Palette, Clock, CalendarCheck } from 'lucide-react'
import heroBg from '../../assets/about/about-bg.webp'

const ANOS_EXPERIENCIA = new Date().getFullYear() - 2019 // estudio abierto desde 2019 (ver Footer.jsx)

// Dispara el evento de conversión en los dos pixeles ya instalados
// globalmente (root.jsx) — mismo patrón que ProductLandingPage.jsx.
function trackLeadClick() {
  if (typeof window.fbq === 'function') window.fbq('track', 'Lead')
  if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead')
}

// Hero compartido entre /jhumaneztattoo y /jhumaneztattoo/agenda — foto a un
// lado + ficha de datos concretos al otro (no un titular emotivo), mismo
// formato en PC y celular. El segundo botón cambia según la página: la
// landing de pauta abre un modal "Sobre mí" (no tiene esa sección aparte);
// la página completa ya tiene "Acerca de mí" más abajo, así que en su lugar
// lleva a /portafolio — cada página pasa el botón ya armado como prop.
export default function HeroFicha({ heroPhoto, secondaryButton }) {
  return (
    <section className="relative overflow-hidden min-h-screen bg-black flex items-center justify-center pt-12 pb-12">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-70 brightness-50 scale-105"
      />
      {/* Sin corrimiento en móvil (el contenido ya ocupa toda la altura del
          hero con redes sociales incluidas — subirlo en pantallas cortas
          cortaba lo de abajo). El translate solo aplica en desktop, donde
          sobra espacio vertical. */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10 md:gap-16 md:-translate-y-12">

        {/* FOTO */}
        <div className="flex-shrink-0 relative group">
          <div className="absolute -inset-1 bg-red-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-700" />
          {heroPhoto
            ? <img src={heroPhoto} alt="Jose Humanez" className="relative w-40 h-40 md:w-80 md:h-80 object-cover rounded-full border-2 border-white/10 shadow-2xl" />
            : <div className="relative w-40 h-40 md:w-80 md:h-80 rounded-full border-2 border-white/10 bg-zinc-900 shadow-2xl" />
          }
        </div>

        {/* FICHA */}
        <div className="w-full md:max-w-sm text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black uppercase italic text-white leading-tight">
            Jose Humanez
          </h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-[0.3em] mt-1 mb-6">
            Tatuador Profesional
          </p>

          <div className="flex flex-col gap-3 mb-7 items-center md:items-start">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-red-600 flex-shrink-0" />
              <span className="text-gray-300 text-base md:text-lg">Chigorodó, Urabá</span>
            </div>
            <div className="flex items-center gap-3">
              <Palette size={18} className="text-red-600 flex-shrink-0" />
              <span className="text-gray-300 text-base md:text-lg">Especialista en realismo y sombras</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-red-600 flex-shrink-0" />
              <span className="text-gray-300 text-base md:text-lg">{ANOS_EXPERIENCIA} años de experiencia</span>
            </div>
          </div>

          <a
            href="#contacto"
            onClick={trackLeadClick}
            className="w-full md:w-72 px-10 py-4 rounded bg-green-600 text-white font-black text-sm uppercase tracking-widest hover:bg-green-500 transition-all transform hover:-translate-y-1 text-center shadow-lg inline-flex items-center justify-center gap-2.5"
          >
            <CalendarCheck size={20} />
            Agenda online
          </a>

          {secondaryButton}

          <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
            <a
              href="https://www.instagram.com/jhumaneztattoo?igsh=MXh4ZW9vaGZnMDVtZQ=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-pink-500 hover:to-yellow-500 hover:border-transparent transition-all duration-300"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://www.facebook.com/humanezjose"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-blue-600 hover:border-transparent transition-all duration-300"
            >
              <FaFacebookF size={16} />
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
