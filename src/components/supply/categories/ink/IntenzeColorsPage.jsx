import { useLoaderData } from 'react-router-dom'
import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import BrandCatalogSection from '../../BrandCatalogSection'
import { fetchCatalogMarca } from '../../../../hooks/useCatalog'

export async function loader() {
  return fetchCatalogMarca('supply', 'intenze')
}

export function meta() {
  const title = 'Tintas Intenze | INKognito Supply — Colombia'
  const description = 'Intenze: alta pigmentación, fórmula estéril y vegana. Zuper Black, True Black y gama completa de colores. Disponibles en Urabá, despacho a Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/ink/intenze` },
  ]
}

// Reescrito 2026-07-30 — antes mostraba una grilla de colores y precios
// inventados ("$XX.XXX") con un botón que sí agregaba al carrito real. Ahora
// usa BrandCatalogSection con productos reales filtrados por `marca='intenze'`.
export default function IntenzeColorsPage() {
  const { products } = useLoaderData()
  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarCategory pageName="Intenze Ink" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Intenze Ink
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            Catálogo Completo
          </h1>

          <div className="mt-10 max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-5">
              Intenze Ink es una de las marcas de tinta para tatuaje más reconocidas a nivel mundial. Utilizada por miles de artistas profesionales, destaca por la intensidad de sus pigmentos, la consistencia de sus colores y la amplia variedad de tonos disponibles.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-5">
              Sus líneas incluyen colores sólidos, tonos para realismo, mezclas para retrato y pigmentos desarrollados junto a artistas reconocidos de la industria del tatuaje.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Explora el catálogo completo de Intenze Ink y encuentra referencias originales para trabajos de color, black and grey, ilustración, neotradicional y realismo.
            </p>
          </div>
        </div>

        <BrandCatalogSection brandName="Intenze Ink" products={products} />

      </div>

      <FooterSupply />

    </div>
  )
}
