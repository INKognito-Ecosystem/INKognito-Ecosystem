import { useState } from 'react'
import { useLoaderData } from 'react-router'
import Navbar from '../components/tattoo/Navbar'
import Gallery from '../components/tattoo/Gallery'
import ReservationForm from '../components/tattoo/ReservationForm'
import Footer from '../components/tattoo/Footer'
import WhatsAppFloat from '../components/tattoo/WhatsAppFloat'

const ogPortafolio = '/og/portafolio-og.jpg'
const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Corre en el servidor — trae las fotos reales del panel para el primer HTML.
// Si el panel no tiene nada cargado o falla, devuelve null y Gallery.jsx usa
// su propio respaldo (FALLBACK_ITEMS, imágenes locales del código).
export async function loader() {
  try {
    const res = await fetch(`${PANEL_URL}/api/portfolio`)
    const rows = await res.json()
    if (Array.isArray(rows) && rows.length > 0) {
      return {
        items: rows.map(r => ({
          id: r.id,
          title: r.titulo || 'Tatuaje',
          img: r.image_url,
          category: r.categoria || 'Realismo',
        })),
      }
    }
    return { items: null }
  } catch {
    return { items: null }
  }
}

export function meta() {
  const title = 'Portafolio de tatuajes | Realismo, sombras y línea fina — Jose Humanez Tattoo'
  const description = 'Galería de trabajos de Jose Humanez: tatuajes de realismo, sombras, blackwork y línea fina hechos en Chigorodó, Antioquia. Mira el portafolio y reserva tu cita.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${import.meta.env.VITE_SITE_URL}/portafolio` },
    { property: 'og:image', content: `${import.meta.env.VITE_SITE_URL}${ogPortafolio}` },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/portafolio` },
  ]
}

export default function PortfolioPage() {
  const { items } = useLoaderData()
  const [estilo, setEstilo] = useState('')
  const [zona, setZona] = useState('')
  const [tamano, setTamano] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* meta() de arriba ya cubre SSR — sin <Seo>/<Helmet> acá, mismo motivo
          que en HomePage.jsx (evitar que las dos mecánicas escriban <head>
          al mismo tiempo y rompan la hidratación). */}

      <Navbar showInicio={true} />

      <Gallery items={items} onLightboxChange={setLightboxOpen} />

      <ReservationForm
        estilo={estilo} setEstilo={setEstilo}
        zona={zona} setZona={setZona}
        tamano={tamano} setTamano={setTamano}
        imageOpacity={0.2}
        showBackLink
      />

      <Footer />
      <WhatsAppFloat hidden={lightboxOpen} />
    </div>
  )
}
