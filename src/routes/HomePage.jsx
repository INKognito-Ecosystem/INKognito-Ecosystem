import { useLoaderData, Link } from 'react-router'
import { TATTOO_HOURS } from '../config/business'
import Navbar from '../components/tattoo/Navbar'
import HeroFicha from '../components/tattoo/HeroFicha'
import About from '../components/tattoo/About'
import CuidadosTeaser from '../components/tattoo/CuidadosTeaser'
import Testimonials from '../components/tattoo/Testimonials'
import AgendaPublica from '../components/tattoo/AgendaPublica'
import Footer from '../components/tattoo/Footer'
import WhatsAppFloat from '../components/tattoo/WhatsAppFloat'

const ogTattoo = '/og/josefoto-og.jpg'
const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
// En public/ (no importada vía Vite) a propósito: un import normal de este
// asset solo se referencia desde el loader (código de servidor), y el paso
// de build que mueve assets del server bundle al client bundle no lo
// resolvía bien (ENOENT en el build) — sirviéndola como archivo estático
// se evita ese problema por completo.
const IMG_MIFOTO_FALLBACK = '/mifoto-fallback.jpg'

// Corre en el servidor (y en el cliente en navegaciones internas) — la foto
// de Jose ya llega resuelta en el primer HTML en vez de placeholder + fetch
// posterior. Fallback a la foto estática si el panel falla o no tiene nada
// configurado, igual que hacía el componente antes.
export async function loader() {
  try {
    const res = await fetch(`${PANEL_URL}/api/jhumaneztattoo/hero`)
    const data = await res.json()
    return { heroPhoto: data.image_url || IMG_MIFOTO_FALLBACK }
  } catch {
    return { heroPhoto: IMG_MIFOTO_FALLBACK }
  }
}

const tattooJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TattooParlor',
  '@id': `${import.meta.env.VITE_SITE_URL}/jhumaneztattoo#business`,
  name: 'INKognito Tattoo Studio — Jose Humanez',
  description: 'Estudio de tatuajes en Chigorodó. Realismo, sombras, línea fina y diseños personalizados. Atendemos toda la región de Urabá: Chigorodó, Apartadó, Turbo, Carepa, Mutatá.',
  url: `${import.meta.env.VITE_SITE_URL}/jhumaneztattoo`,
  telephone: '+57-320-791-1013',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Chigorodó',
    addressRegion: 'Antioquia',
    addressCountry: 'CO',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 7.6734, longitude: -76.6868 },
  areaServed: ['Chigorodó', 'Apartadó', 'Turbo', 'Carepa', 'Mutatá', 'Necoclí', 'San Juan de Urabá'],
  openingHours: TATTOO_HOURS.schemaOrgFormat,
  priceRange: '$$',
  sameAs: ['https://www.instagram.com/jhumaneztattoo', 'https://www.facebook.com/jhumaneztattoo'],
  image: `${import.meta.env.VITE_SITE_URL}/og/josefoto-og.jpg`,
}

export function meta() {
  const title = 'Tatuador en Chigorodó, Antioquia | Realismo y diseños personalizados — Jose Humanez'
  const description = 'Tatuador profesional especialista en realismo, sombras y línea fina en Chigorodó, Urabá antioqueño. Estudio privado con cita previa. Cotiza tu tatuaje por WhatsApp.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${import.meta.env.VITE_SITE_URL}/jhumaneztattoo` },
    { property: 'og:image', content: `${import.meta.env.VITE_SITE_URL}${ogTattoo}` },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/jhumaneztattoo` },
    { 'script:ld+json': tattooJsonLd },
  ]
}

export default function HomePage() {
  const { heroPhoto } = useLoaderData()

  return (
    <div className="bg-black text-white">
      {/* El meta() de arriba ya cubre SSR para esta ruta — no se renderiza
          <Seo>/<Helmet> acá para evitar que las dos mecánicas escriban el
          <head> a la vez (eso rompía la hidratación: React esperaba los tags
          de meta() en el HTML del servidor y encontraba de más los que Helmet
          agrega por su cuenta del lado del cliente). El resto del sitio, que
          todavía no tiene meta(), sigue usando <Seo> normalmente. */}

      {/* bg-black/text-white acá (antes era un Fragment sin wrapper): About.jsx
          y CuidadosTeaser.jsx no traen su propio color de fondo/texto completo,
          asumían un ancestro oscuro que nunca existió — se veían con fondo
          blanco y texto invisible (negro sobre negro) por esto. */}
      <Navbar />
      <HeroFicha
        heroPhoto={heroPhoto}
        secondaryButton={
          <Link
            to="/portafolio"
            className="w-full md:w-72 mt-3 px-10 py-4 rounded border border-white/20 text-gray-300 font-bold text-sm uppercase tracking-widest hover:border-white/50 hover:text-white transition-all text-center block"
          >
            Portafolio
          </Link>
        }
      />
      <About />
      <CuidadosTeaser />
      <Testimonials />

      {/* Agendamiento online directo, mismo componente que la landing de
          pauta (/jhumaneztattoo/agenda) — reemplaza el viejo ReservationForm
          (cuestionario que solo armaba un mensaje de WhatsApp). */}
      <AgendaPublica />

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
