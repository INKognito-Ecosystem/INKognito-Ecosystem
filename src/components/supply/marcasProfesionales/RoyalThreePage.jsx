import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import BrandCatalogSection from '../BrandCatalogSection'
import Seo from '../../Seo'

export default function RoyalThreePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Royal Three | Insumos para tatuadores — INKognito Supply"
        description="Cremas, jabones y productos de bioseguridad Royal Three para estudios de tatuaje profesionales. Disponibles en Urabá, Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/brands/royal-three`}
      />
      <NavbarCategory pageName="Royal Three" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">

          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Marca Profesional
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-6">
            Royal Three
          </h1>

          <p className="max-w-3xl text-zinc-400 text-sm md:text-base leading-relaxed">
            Cremas, jabones y productos de bioseguridad desarrollados para estudios
            de tatuaje profesionales. Royal Three combina eficacia clínica con
            formulaciones pensadas para la rutina diaria del tatuador.
          </p>

        </div>

        <BrandCatalogSection brandName="Royal Three" />

      </div>

      <FooterSupply />
    </div>
  )
}
