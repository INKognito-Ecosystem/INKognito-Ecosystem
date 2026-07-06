import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import BrandCatalogSection from '../BrandCatalogSection'
import Seo from '../../Seo'

export default function HeavenProPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Heaven Pro | Cuidado de tatuajes — INKognito Supply"
        description="Cremas y productos de cuidado post-tatuaje Heaven Pro. Formulados para proteger y realzar la cicatrización. Disponibles en Urabá, Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/brands/heaven-pro`}
      />
      <NavbarCategory pageName="Heaven Pro" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">

          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Marca Profesional
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-6">
            Heaven Pro
          </h1>

          <p className="max-w-3xl text-zinc-400 text-sm md:text-base leading-relaxed">
            Productos de cuidado post-tatuaje desarrollados para proteger la piel
            durante el proceso de cicatrización. Cremas, lociones y accesorios
            formulados específicamente para tatuadores profesionales y sus clientes.
          </p>

        </div>

        <BrandCatalogSection brandName="Heaven Pro" />

      </div>

      <FooterSupply />
    </div>
  )
}
