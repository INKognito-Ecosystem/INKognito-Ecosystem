import EcosystemNavbar from './EcosystemNavbar'
import { Link } from 'react-router-dom'
import ecosystemBg from '../../assets/ecosystem/ecosystem-bg.jpg'
// Imagen nueva subida a Obsidian (2026-09-15, Jose: "esta imagen la usarás
// para el fondo del home del ecosistema... solo para móvil de momento") —
// retrato (encaja mejor en pantalla de celular que el hoyo negro panorámico
// de ecosystemBg); desktop se queda con el fondo de siempre hasta que Jose
// decida algo para esa vista.
import ecosystemBgMobile from '../../assets/ecosystem/ecosystem-bg-mobile.jpg'

export function meta() {
  const title = 'INKognito | Tattoo, Supply y Store en Urabá, Colombia'
  const description = 'Ecosistema de servicios en Chigorodó, Urabá: estudio de tatuajes, insumos profesionales para tatuadores y tienda deportiva. Conoce todos nuestros módulos.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:site_name', content: 'INKognito Ecosystem' },
    { property: 'og:url', content: `${import.meta.env.VITE_SITE_URL}/` },
    { property: 'og:image', content: `${import.meta.env.VITE_SITE_URL}/og/ecosystem-og.png` },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/` },
  ]
}

export default function InkognitoHome() {
  return (
    <section className="relative h-dvh bg-black text-white flex flex-col items-center px-6 overflow-hidden">

      {/* meta() arriba ya cubre SSR — no se renderiza <Seo>/<Helmet> para
          evitar que las dos mecánicas escriban <head> a la vez (rompía la
          hidratación, ver nota en HomePage.jsx). */}

      {/* NAVBAR */}
      <EcosystemNavbar />

      {/* FONDO — imagen distinta en móvil (2026-09-15, ver import arriba),
          desktop se queda con el hoyo negro de siempre. */}
      <img
        src={ecosystemBgMobile}
        alt=""
        className="md:hidden absolute inset-0 w-full h-full object-cover opacity-80"
      />
      <img
        src={ecosystemBg}
        alt=""
        className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-80"
      />

      {/* OVERLAY OSCURO */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* CONTENIDO — ocupa todo el espacio disponible entre navbar y copyright.
          Todo compactado (paddings/gaps/tamaños de letra reducidos) para que
          la pantalla completa (logo + módulos + copyright) quepa en un solo
          viewport sin scroll — antes con py-20 + gap-6 + py-5 por botón el
          bloque se pasaba de la altura disponible en pantallas de laptop
          típicas y obligaba a hacer scroll para ver el copyright
          (reportado 2026-08-02). */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full flex-1 py-2 md:py-3 min-h-0">

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase italic tracking-[0.12em] text-center">
          <span className="text-white">INK</span>
          <span className="text-zinc-300">OGNITO</span>
        </h1>

        <p className="mt-1 mb-2 sm:mb-4 text-zinc-300 uppercase tracking-[0.15em] sm:tracking-[0.5em] text-sm md:text-base font-semibold text-center whitespace-nowrap px-2">
          Disciplina • Arte • Identidad
        </p>

        <p className="text-white uppercase tracking-[0.45em] text-sm text-center mb-2 sm:mb-4 font-medium">
          Select Module
        </p>

        <div className="flex flex-col gap-2.5 sm:gap-3 w-full max-w-md">
          {/* Nombres en frase, más limpio (2026-09-16, Jose: "por lo menos
              que la primera letra sea mayúscula, y usa una tipografía más
              limpia, no esa así toda gorda") — antes todo el bloque
              forzaba uppercase + font-black; ahora solo la primera letra
              va en mayúscula (texto real, no un transform de CSS) y el
              peso baja a font-medium con tracking más angosto, más acorde
              a texto de frase que a un bloque en mayúsculas. Store/Gym/
              Suple renombrados: "Moda y estilo", "Gym systems",
              "Suplementación" — mismas rutas, mismo orden. */}
          {/* "Tattoo studio" → INK (2026-09-16, Jose: "vamos a cambiar el
              nombre del módulo tattoo studio... asignar esa URL del
              módulo para INK, encuentra tu tatuador") — reemplaza el link
              directo al estudio propio de Jose (/jhumaneztattoo) por el
              directorio de artistas completo. "INK" se queda en mayúscula
              (nombre de marca, mismo criterio que "INKognito"/"Supply"/
              "Store" en los demás botones) — el resto del label copia la
              frase real que ya usa el h1 de ArtistasColombiaPage.jsx
              ("Encuentra tu tatuador"), no una nueva. jhumaneztattoo sigue
              siendo un estudio real DENTRO de ese directorio (id 20,
              buscable), no desaparece, solo deja de ser el único acceso
              directo desde el home. */}
          <Link
            to="/tattoo-artist-colombia"
            className="w-full py-3 sm:py-4 bg-zinc-700 rounded text-center uppercase tracking-wide font-medium hover:bg-red-600 transition-all duration-300"
          >
            INK — encuentra tu tatuador
          </Link>

          <Link
            to="/supply"
            className="w-full py-3 sm:py-4 bg-zinc-700 rounded text-center uppercase tracking-wide font-medium hover:bg-blue-600 transition-all duration-300"
          >
            Tattoo supply
          </Link>

          <Link
            to="/store"
            className="w-full py-3 sm:py-4 bg-zinc-700 rounded text-center uppercase tracking-wide font-medium transition-all duration-300"
            style={{ color: 'white' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C9A84C'; e.currentTarget.style.color = '#000' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#3f3f46'; e.currentTarget.style.color = '#fff' }}
          >
            Moda & estilo
          </Link>

          <Link
            to="/gym"
            className="w-full py-3 sm:py-4 bg-zinc-700 rounded text-center uppercase tracking-wide font-medium hover:bg-gray-500 transition-all duration-300"
          >
            Gym systems
          </Link>

          <Link
            to="/suplementos"
            className="w-full py-3 sm:py-4 bg-zinc-700 rounded text-center uppercase tracking-wide font-medium hover:bg-[#9E9E9E] transition-all duration-300"
          >
            Suplementación
          </Link>
        </div>

      </div>

      {/* COPYRIGHT — mismo tamaño/estilo que los footers de los módulos
          (2026-09-16, Jose: "que sea consistente con los que ya están
          dentro de los módulos" — el texto acá era text-xs uppercase
          tracking-widest, mucho más grande/pesado que el
          text-[9.5px] sm:text-[12px] en frase normal que ya usan
          FooterSupply.jsx y el resto). */}
      <div className="relative z-10 w-full text-center pb-2 sm:pb-3 shrink-0">
        <p className="text-zinc-600 text-[9.5px] sm:text-[12px]">
          © 2026 INKognito. Todos los derechos reservados.
        </p>
        <div className="flex justify-center items-center gap-6 mt-2 text-[12px]">
          <Link to="/terminos" className="text-zinc-600 hover:text-white transition-colors">
            Términos
          </Link>
          <Link to="/privacidad" className="text-zinc-600 hover:text-white transition-colors">
            Privacidad
          </Link>
        </div>
      </div>

    </section>
  )
}
