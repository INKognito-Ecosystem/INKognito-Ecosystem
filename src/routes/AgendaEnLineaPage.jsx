import { Link } from 'react-router'
import AgendaPublica from '../components/tattoo/AgendaPublica'

const ANOS_EXPERIENCIA = new Date().getFullYear() - 2019 // estudio abierto desde 2019 (ver Footer.jsx)

// Landing mínima — solo el contenedor del formulario de agenda (2026-08-30,
// Jose: "que sea solo un contenedor de agenda en línea"). A diferencia de
// /jhumaneztattoo/agenda (que sí trae hero + portafolio, pensada para pauta
// con contexto visual), acá no hay nada más que el form — ni hero, ni
// portafolio, ni modal "Sobre mí". AgendaPublica.jsx ya es 100%
// autocontenido (pide su propia disponibilidad, sube su propia imagen,
// postea a /api/appointments/publica), así que esta página no necesita
// loader — es solo el mismo encabezado mínimo + form + footer legal que ya
// usa JhumaneztattooAgenda.jsx, sin Navbar ni links que saquen de la página.
export function meta() {
  const title = 'Agenda tu cita de tatuaje | INKognito Tattoo — Jose Humanez'
  const description = `Reserva tu fecha directo desde acá, sin WhatsApp — cuéntanos tu idea y el precio se confirma contigo. ${ANOS_EXPERIENCIA} años de experiencia en Chigorodó, Urabá.`
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${import.meta.env.VITE_SITE_URL}/agendaenlinea` },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/agendaenlinea` },
  ]
}

export default function AgendaEnLineaPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Encabezado mínimo — sin Navbar, sin links de salida, mismo
          criterio que JhumaneztattooAgenda.jsx: un solo objetivo. */}
      {/* Mismo tamaño/color exacto que el título que traía AgendaPublica.jsx
          internamente (text-3xl md:text-5xl, "Cita" en text-zinc-600) —
          Jose: "no le cambies el tamaño y el color que ya tiene este
          título", solo se movió de lugar para no repetirlo. */}
      <div className="pt-10 pb-2 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-black uppercase italic text-center">
          Agenda tu <span className="text-zinc-600">Cita</span>
        </h1>
      </div>

      <div className="flex-1">
        <AgendaPublica showHeading={false} compactTop />
      </div>

      {/* FOOTER MÍNIMO — solo lo legalmente necesario, mismo patrón que
          JhumaneztattooAgenda.jsx. */}
      <footer className="border-t border-white/10 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-500 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} INKognito Tattoo. Todos los derechos reservados.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/terminos" className="hover:text-white transition-colors">Términos</Link>
            <Link to="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
            <span>Desarrollado por INKognito</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
