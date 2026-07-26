import { useState } from 'react'
import { useLoaderData, Link } from 'react-router'
import { FaWhatsapp } from 'react-icons/fa'
import { MapPin, Palette, Clock } from 'lucide-react'
import Gallery from '../components/tattoo/Gallery'
import ReservationForm from '../components/tattoo/ReservationForm'
import WhatsAppFloat from '../components/tattoo/WhatsAppFloat'
import { WHATSAPP } from '../config/business'
import heroBg from '../assets/about/about-bg.webp'

const ogTattoo = '/og/josefoto-og.jpg'
const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const IMG_MIFOTO_FALLBACK = '/mifoto-fallback.jpg'
const ANOS_EXPERIENCIA = new Date().getFullYear() - 2019 // estudio abierto desde 2019 (ver Footer.jsx)

// Landing de pauta (Meta/Google Ads) — a diferencia de /jhumaneztattoo (la
// página completa del estudio), acá NO hay Navbar ni links que saquen de la
// página: un solo objetivo (agendar por WhatsApp), sin distracciones. Trae
// foto de hero + portafolio real por loader, igual que HomePage/PortfolioPage.
export async function loader() {
  const [heroRes, portfolioRes] = await Promise.allSettled([
    fetch(`${PANEL_URL}/api/jhumaneztattoo/hero`).then(r => r.json()),
    fetch(`${PANEL_URL}/api/portfolio`).then(r => r.json()),
  ])

  const heroPhoto = heroRes.status === 'fulfilled' ? (heroRes.value.image_url || IMG_MIFOTO_FALLBACK) : IMG_MIFOTO_FALLBACK

  let items = null
  if (portfolioRes.status === 'fulfilled' && Array.isArray(portfolioRes.value) && portfolioRes.value.length > 0) {
    items = portfolioRes.value.map(r => ({
      id: r.id,
      title: r.titulo || 'Tatuaje',
      img: r.image_url,
      category: r.categoria || 'Realismo',
    }))
  }

  return { heroPhoto, items }
}

const tattooJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TattooParlor',
  '@id': `${import.meta.env.VITE_SITE_URL}/jhumaneztattoo/agenda#business`,
  name: 'INKognito Tattoo Studio — Jose Humanez',
  description: 'Estudio de tatuajes en Chigorodó. Realismo, sombras, línea fina y diseños personalizados. Atendemos toda la región de Urabá.',
  url: `${import.meta.env.VITE_SITE_URL}/jhumaneztattoo/agenda`,
  telephone: '+57-320-791-1013',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Chigorodó',
    addressRegion: 'Antioquia',
    addressCountry: 'CO',
  },
  areaServed: ['Chigorodó', 'Apartadó', 'Turbo', 'Carepa', 'Mutatá'],
  priceRange: '$$',
}

export function meta() {
  const title = 'Agenda tu tatuaje en Chigorodó | Jose Humanez — INKognito Tattoo'
  const description = `Tatuador profesional especialista en realismo, sombras y línea fina en Chigorodó, Urabá. ${ANOS_EXPERIENCIA} años de experiencia. Cotiza y agenda tu cita por WhatsApp.`
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${import.meta.env.VITE_SITE_URL}/jhumaneztattoo/agenda` },
    { property: 'og:image', content: `${import.meta.env.VITE_SITE_URL}${ogTattoo}` },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/jhumaneztattoo/agenda` },
    { 'script:ld+json': tattooJsonLd },
  ]
}

const WA_MESSAGE = encodeURIComponent('Hola Jose, quiero agendar/cotizar un tatuaje')
const WA_LINK = `https://wa.me/${WHATSAPP}?text=${WA_MESSAGE}`

// Dispara el evento de conversión en los dos pixeles ya instalados
// globalmente (root.jsx) — mismo patrón que ProductLandingPage.jsx.
function trackLeadClick() {
  if (typeof window.fbq === 'function') window.fbq('track', 'Lead')
  if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead')
}

export default function JhumaneztattooAgenda() {
  const { heroPhoto, items } = useLoaderData()
  const [estilo, setEstilo] = useState('')
  const [zona, setZona] = useState('')
  const [tamano, setTamano] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO — sin navbar, un solo CTA. Foto a un lado + ficha de datos
          concretos al otro (no un titular emotivo) — mismo formato en PC y
          celular, solo cambia de lado-a-lado a apilado. */}
      <section className="relative overflow-hidden min-h-screen bg-black flex items-center justify-center pt-12 pb-12">
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-70 brightness-50 scale-105"
        />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10 md:gap-16">

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
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackLeadClick}
              className="w-full md:w-auto px-10 py-4 rounded bg-green-600 text-white font-black text-sm uppercase tracking-widest hover:bg-green-500 transition-all transform hover:-translate-y-1 text-center shadow-lg inline-flex items-center justify-center gap-2.5"
            >
              <FaWhatsapp size={20} />
              Agenda tu cita
            </a>
          </div>

        </div>
      </section>

      {/* PORTAFOLIO REAL — compacto: pegado al hero, sin el espaciado pensado
          para vivir debajo de un navbar completo (como en /portafolio) */}
      <Gallery items={items} onLightboxChange={setLightboxOpen} compact />

      <ReservationForm
        estilo={estilo} setEstilo={setEstilo}
        zona={zona} setZona={setZona}
        tamano={tamano} setTamano={setTamano}
      />

      {/* FOOTER MÍNIMO — solo lo legalmente necesario, sin links de navegación
          que compitan con el único objetivo de esta página */}
      <footer className="border-t border-white/10 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-500 text-[12px] gap-3">
          <p>© {new Date().getFullYear()} INKognito Tattoo. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link to="/terminos" className="hover:text-white transition-colors">Términos</Link>
            <Link to="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
          </div>
        </div>
      </footer>

      <WhatsAppFloat hidden={lightboxOpen} />
    </div>
  )
}
