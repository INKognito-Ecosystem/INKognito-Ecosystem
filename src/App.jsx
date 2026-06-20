import React, { lazy, Suspense, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAnalytics } from './hooks/useAnalytics'
import { TATTOO_HOURS } from './config/business'

// Tattoo module — eager (primary landing content)
import InkognitoHome from './components/ecosystem/InkognitoHome'
import Navbar from './components/tattoo/Navbar'
import Hero from './components/tattoo/Hero'
import About from './components/tattoo/About'
import Gallery from './components/tattoo/Gallery'
import Testimonials from './components/tattoo/Testimonials'
import Footer from './components/tattoo/Footer'
import WhatsAppFloat from './components/tattoo/WhatsAppFloat'
import CuidadosPage from './components/tattoo/CuidadosPage'
import CuidadosTeaser from './components/tattoo/CuidadosTeaser'
import ReservationForm from './components/tattoo/ReservationForm'
import Seo from './components/Seo'
import ComingSoonPage from './components/ecosystem/ComingSoonPage'

const ogTattoo = '/og/josefoto-og.jpg'
const ogPortafolio = '/og/portafolio-og.jpg'

// Supply module — lazy
const SupplyPage = lazy(() => import('./components/supply/SupplyPage'))
const MachinesPage = lazy(() => import('./components/supply/categories/MachinesPage'))
const CartridgesPage = lazy(() => import('./components/supply/categories/Cartridges/CartridgesPage'))
const EZCartridgesPage = lazy(() => import('./components/supply/categories/Cartridges/EZCartridgesPage'))
const WJXCartridgesPage = lazy(() => import('./components/supply/categories/Cartridges/WJXCartridgesPage'))
const KwadronCartridgesPage = lazy(() => import('./components/supply/categories/Cartridges/KwadronCartridgesPage'))
const PowerSuppliesPage = lazy(() => import('./components/supply/categories/PowerSuppliesPage'))
const InkPage = lazy(() => import('./components/supply/categories/ink/InkPage'))
const ViceColorsPage = lazy(() => import('./components/supply/categories/ink/ViceColorsPage'))
const DynamicColorsPage = lazy(() => import('./components/supply/categories/ink/DynamicColorsPage'))
const EternalColorsPage = lazy(() => import('./components/supply/categories/ink/EternalColorsPage'))
const IntenzeColorsPage = lazy(() => import('./components/supply/categories/ink/IntenzeColorsPage'))
const FusionColorsPage = lazy(() => import('./components/supply/categories/ink/FusionColorsPage'))
const WorldFamousColorsPage = lazy(() => import('./components/supply/categories/ink/WorldFamousColorsPage'))
const SolidColorsPage = lazy(() => import('./components/supply/categories/ink/SolidColorsPage'))
const NeedlesPage = lazy(() => import('./components/supply/categories/NeedlesPage'))
const GlovesPage = lazy(() => import('./components/supply/categories/GlovesPage'))
const AftercarePage = lazy(() => import('./components/supply/categories/AftercarePage'))
const AccessoriesPage = lazy(() => import('./components/supply/categories/AccessoriesPage'))
const FurniturePage = lazy(() => import('./components/supply/categories/FurniturePage'))
const BundlesPage = lazy(() => import('./components/supply/categories/BundlesPage'))
const TattooVisionPage = lazy(() => import('./components/supply/marcasProfesionales/TattooVisionPage'))
const HeavenProPage = lazy(() => import('./components/supply/marcasProfesionales/HeavenProPage'))
const RoyalThreePage = lazy(() => import('./components/supply/marcasProfesionales/RoyalThreePage'))
const AprendePage = lazy(() => import('./components/supply/AprendePage'))

// Store module — lazy
const StorePage = lazy(() => import('./components/store/StorePage'))
const RopaDamaPage = lazy(() => import('./components/store/categories/RopaDamaPage'))
const RopaCaballerosPage = lazy(() => import('./components/store/categories/RopaCaballerosPage'))
const ZapatosDeportivosPage = lazy(() => import('./components/store/categories/ZapatosDeportivosPage'))
const ZapatosCasualesPage = lazy(() => import('./components/store/categories/ZapatosCasualesPage'))
const GuayosPage = lazy(() => import('./components/store/categories/GuayosPage'))
const TenisGuayoPage = lazy(() => import('./components/store/categories/TenisGuayoPage'))

// Gym module — lazy
const GymPage = lazy(() => import('./components/gym/GymPage'))
const MaquinasPedidoPage = lazy(() => import('./components/gym/categories/MaquinasPedidoPage'))
const VideosTutorialesPage = lazy(() => import('./components/gym/categories/VideosTutorialesPage'))
const CursosGymPage = lazy(() => import('./components/gym/categories/CursosPage'))
const SuplementosGymPage = lazy(() => import('./components/gym/categories/SuplementosPage'))

const tattooJsonLd = {
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  "@id": `${import.meta.env.VITE_SITE_URL}/jhumaneztattoo#business`,
  "name": "INKognito Tattoo Studio — Jose Humanez",
  "description": "Estudio de tatuajes en Chigorodó. Realismo, sombras, línea fina y diseños personalizados. Atendemos toda la región de Urabá: Chigorodó, Apartadó, Turbo, Carepa, Mutatá.",
  "url": `${import.meta.env.VITE_SITE_URL}/jhumaneztattoo`,
  "telephone": "+57-320-791-1013",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Chigorodó",
    "addressRegion": "Antioquia",
    "addressCountry": "CO"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 7.6734,
    "longitude": -76.6868
  },
  "areaServed": ["Chigorodó","Apartadó","Turbo","Carepa","Mutatá","Necoclí","San Juan de Urabá"],
  "openingHours": TATTOO_HOURS.schemaOrgFormat,
  "priceRange": "$$",
  "sameAs": [
    "https://www.instagram.com/jhumaneztattoo",
    "https://www.facebook.com/jhumaneztattoo"
  ],
  "image": `${import.meta.env.VITE_SITE_URL}/og/josefoto-og.jpg`
}

/* =========================
   PAGINA PRINCIPAL
========================= */
function HomePage() {
  const [estilo, setEstilo] = useState('')
  const [zona, setZona] = useState('')
  const [tamano, setTamano] = useState('')

  return (
    <>
      <Seo
        title="Tatuador en Chigorodó, Antioquia | Realismo y diseños personalizados — Jose Humanez"
        description="Tatuador profesional especialista en realismo, sombras y línea fina en Chigorodó, Urabá antioqueño. Estudio privado con cita previa. Cotiza tu tatuaje por WhatsApp."
        image={ogTattoo}
        canonical={`${import.meta.env.VITE_SITE_URL}/jhumaneztattoo`}
        jsonLd={tattooJsonLd}
      />

      <Navbar />
      <Hero />
      <About />
      <CuidadosTeaser />
      <Testimonials />

      <ReservationForm
        estilo={estilo} setEstilo={setEstilo}
        zona={zona} setZona={setZona}
        tamano={tamano} setTamano={setTamano}
      />

      <Footer />
      <WhatsAppFloat />
    </>
  )
}

/* =========================
   PAGINA PORTAFOLIO
========================= */
function PortfolioPage() {
  const [estilo, setEstilo] = useState('')
  const [zona, setZona] = useState('')
  const [tamano, setTamano] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Portafolio de tatuajes | Realismo, sombras y línea fina — Jose Humanez Tattoo"
        description="Galería de trabajos de Jose Humanez: tatuajes de realismo, sombras, blackwork y línea fina hechos en Chigorodó, Antioquia. Mira el portafolio y reserva tu cita."
        image={ogPortafolio}
        canonical={`${import.meta.env.VITE_SITE_URL}/portafolio`}
      />

      <Navbar showInicio={true} />

      <Gallery onLightboxChange={setLightboxOpen} />

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

/* =========================
   APP
========================= */
function App() {
  useAnalytics()

  return (
    <div className="bg-black text-white overflow-x-hidden">
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <Routes>
          <Route path="/" element={<InkognitoHome />} />
          <Route path="/jhumaneztattoo" element={<HomePage />} />
          <Route path="/portafolio" element={<PortfolioPage />} />
          <Route path="/cuidados" element={<CuidadosPage />} />

          {/* Supply */}
          <Route path="/supply" element={<ComingSoonPage />} />
          <Route path="/supply/machines" element={<MachinesPage />} />
          <Route path="/supply/cartridges" element={<CartridgesPage />} />
          <Route path="/supply/cartridges/ez-tattoo" element={<EZCartridgesPage />} />
          <Route path="/supply/cartridges/wjx" element={<WJXCartridgesPage />} />
          <Route path="/supply/cartridges/kwadron" element={<KwadronCartridgesPage />} />
          <Route path="/supply/power-supplies" element={<PowerSuppliesPage />} />
          <Route path="/supply/ink" element={<InkPage />} />
          <Route path="/supply/ink/vice-colors" element={<ViceColorsPage />} />
          <Route path="/supply/ink/dynamic" element={<DynamicColorsPage />} />
          <Route path="/supply/ink/eternal" element={<EternalColorsPage />} />
          <Route path="/supply/ink/intenze" element={<IntenzeColorsPage />} />
          <Route path="/supply/ink/fusion" element={<FusionColorsPage />} />
          <Route path="/supply/ink/world-famous" element={<WorldFamousColorsPage />} />
          <Route path="/supply/ink/solid-ink" element={<SolidColorsPage />} />
          <Route path="/supply/needles" element={<NeedlesPage />} />
          <Route path="/supply/gloves" element={<GlovesPage />} />
          <Route path="/supply/aftercare" element={<AftercarePage />} />
          <Route path="/supply/accessories" element={<AccessoriesPage />} />
          <Route path="/supply/furniture" element={<FurniturePage />} />
          <Route path="/supply/bundles" element={<BundlesPage />} />
          <Route path="/supply/brands/tattoo-vision" element={<TattooVisionPage />} />
          <Route path="/supply/brands/heaven-pro" element={<HeavenProPage />} />
          <Route path="/supply/brands/royal-three" element={<RoyalThreePage />} />
          <Route path="/supply/aprende" element={<AprendePage />} />

          {/* Store */}
          <Route path="/store" element={<ComingSoonPage />} />
          <Route path="/store/ropa-dama" element={<RopaDamaPage />} />
          <Route path="/store/ropa-caballeros" element={<RopaCaballerosPage />} />
          <Route path="/store/zapatos-deportivos" element={<ZapatosDeportivosPage />} />
          <Route path="/store/zapatos-casuales" element={<ZapatosCasualesPage />} />
          <Route path="/store/guayos" element={<GuayosPage />} />
          <Route path="/store/tenis-guayo" element={<TenisGuayoPage />} />

          {/* Gym */}
          <Route path="/gym" element={<ComingSoonPage />} />
          <Route path="/gym/maquinas-pedido" element={<MaquinasPedidoPage />} />
          <Route path="/gym/tutoriales" element={<VideosTutorialesPage />} />
          <Route path="/gym/cursos" element={<CursosGymPage />} />
          <Route path="/gym/suplementos" element={<SuplementosGymPage />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
