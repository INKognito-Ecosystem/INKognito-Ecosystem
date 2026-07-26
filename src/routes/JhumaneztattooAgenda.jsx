import { useState } from 'react'
import { useLoaderData, Link } from 'react-router'
import { X } from 'lucide-react'
import Gallery from '../components/tattoo/Gallery'
import AgendaPublica from '../components/tattoo/AgendaPublica'
import HeroFicha from '../components/tattoo/HeroFicha'
import { ABOUT_PARAGRAPHS, ABOUT_QUOTE } from '../components/tattoo/About'

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

export default function JhumaneztattooAgenda() {
  const { heroPhoto, items } = useLoaderData()
  const [, setLightboxOpen] = useState(false)
  const [sobreMiOpen, setSobreMiOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">

      <HeroFicha
        heroPhoto={heroPhoto}
        secondaryButton={
          <button
            type="button"
            onClick={() => setSobreMiOpen(true)}
            className="w-full md:w-72 mt-3 px-10 py-4 rounded border border-white/20 text-gray-300 font-bold text-sm uppercase tracking-widest hover:border-white/50 hover:text-white transition-all text-center"
          >
            Sobre mí
          </button>
        }
      />

      {/* MODAL "SOBRE MÍ" — mismo texto de la sección Acerca de mí de la
          página completa del estudio (About.jsx), sin salir de esta landing */}
      {sobreMiOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSobreMiOpen(false)}
        >
          <div
            className="relative max-w-lg w-full bg-zinc-950 border border-white/10 rounded-xl p-8 max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSobreMiOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <X size={22} />
            </button>
            <h2 className="text-2xl font-black uppercase italic mb-6">Sobre mí</h2>
            <div className="space-y-5 text-gray-300 leading-relaxed font-light">
              {ABOUT_PARAGRAPHS.map((p, i) => <p key={i}>{p}</p>)}
              <p className="text-white italic font-semibold pt-2">"{ABOUT_QUOTE}"</p>
            </div>
          </div>
        </div>
      )}

      {/* PORTAFOLIO REAL — compacto: pegado al hero, sin el espaciado pensado
          para vivir debajo de un navbar completo (como en /portafolio) */}
      <Gallery items={items} onLightboxChange={setLightboxOpen} compact />

      <AgendaPublica />

      {/* FOOTER MÍNIMO — solo lo legalmente necesario, sin links de navegación
          que compitan con el único objetivo de esta página */}
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
