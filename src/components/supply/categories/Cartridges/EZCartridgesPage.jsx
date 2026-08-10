import { useLoaderData } from 'react-router-dom'
import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import BrandCatalogSection from '../../BrandCatalogSection'
import SupplyFAQ from '../../SupplyFAQ'
import { fetchCatalogMarca, fetchSupplyFaq } from '../../../../hooks/useCatalog'

export async function loader() {
  const [catalogo, faqItems] = await Promise.all([
    fetchCatalogMarca('supply', 'ez-tattoo'),
    fetchSupplyFaq({ marca: 'ez-tattoo' }),
  ])
  return { ...catalogo, faqItems }
}

export function meta() {
  const title = 'Cartuchos EZ Tattoo | INKognito Supply — Colombia'
  const description = 'Cartuchos EZ en RL, RS, Magnum y Curved Magnum. Excelente relación calidad-precio para realismo, black and grey y lettering. Disponibles en Urabá, Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/cartridges/ez-tattoo` },
  ]
}

// Reescrito 2026-07-30 — antes mostraba una grilla de productos y precios
// inventados ("$XX.XXX") con un botón que sí agregaba al carrito real, sin
// stock ni precio de verdad detrás. Ahora usa el mismo BrandCatalogSection
// que el resto de páginas de marca, con productos reales filtrados por
// `marca='ez-tattoo'` desde el inventario del panel.
export default function EZCartridgesPage() {
  const { products, faqItems } = useLoaderData()
  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarCategory pageName="EZ Tattoo" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-12 md:mb-20">

          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            EZ Tattoo Cartridges
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-6">
            Catálogo Completo
          </h1>

          <div className="max-w-3xl">
            <p className="text-zinc-400 leading-relaxed">
              EZ Tattoo es una de las marcas de cartuchos más utilizadas por artistas
              alrededor del mundo. Sus agujas destacan por su consistencia, precisión
              y excelente relación calidad-precio, siendo una opción popular para
              realismo, black and grey, color y lettering.
            </p>
          </div>

        </div>

        <BrandCatalogSection brandName="EZ Tattoo" products={products} />

        <SupplyFAQ items={faqItems} nombre="EZ Tattoo" />

      </div>

      <FooterSupply />

    </div>
  )
}
