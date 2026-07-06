import { useState, useEffect } from 'react'
import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import BrandCatalogSection from '../BrandCatalogSection'
import Seo from '../../Seo'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

export default function TattooVisionPage() {
  const [logoUrl, setLogoUrl] = useState(null)

  useEffect(() => {
    fetch(`${PANEL_URL}/api/visual/supply`)
      .then(r => r.json())
      .then(data => setLogoUrl(data?.supply_brand_tattoo_vision || null))
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Tattoo Vision | Sistemas visuales para tatuadores — INKognito Supply"
        description="Lámparas, gafas y sistemas de visión Tattoo Vision para tatuadores profesionales. Precisión óptica en cada sesión. Disponibles en Urabá, Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/brands/tattoo-vision`}
      />
      <NavbarCategory pageName="Tattoo Vision" />

      <div className="pt-20 md:pt-24 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-6 md:mb-8">

          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Tattoo Vision"
              className="h-16 md:h-24 w-auto max-w-full object-contain mb-3"
            />
          ) : (
            <>
              <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-2">
                Marca Profesional
              </p>
              <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-3">
                Tattoo Vision
              </h1>
            </>
          )}

          <p className="max-w-3xl text-zinc-400 text-sm md:text-base leading-relaxed">
            Sistemas visuales diseñados para tatuadores profesionales.
            Gafas especializadas, iluminación avanzada y accesorios
            desarrollados para mejorar la visibilidad, reducir reflejos
            y aumentar la precisión durante el proceso de tatuaje.
          </p>

        </div>

        <BrandCatalogSection brandName="Tattoo Vision" />

      </div>

      <FooterSupply />

    </div>
  )
}
