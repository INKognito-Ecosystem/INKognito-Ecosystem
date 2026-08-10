import { useLoaderData } from 'react-router-dom'
import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import BrandCatalogSection from '../../BrandCatalogSection'
import SupplyFAQ from '../../SupplyFAQ'
import { fetchCatalogMarca, fetchSupplyFaq } from '../../../../hooks/useCatalog'

export async function loader() {
  const [catalogo, faqItems] = await Promise.all([
    fetchCatalogMarca('supply', 'eternal'),
    fetchSupplyFaq({ marca: 'eternal' }),
  ])
  return { ...catalogo, faqItems }
}

export function meta() {
  const title = 'Tintas Eternal Ink | INKognito Supply — Colombia'
  const description = 'Eternal Ink: base acuosa, sin acrílicos, paleta extensa de colores y negros. Cicatrización limpia y brillo duradero. Disponibles en Urabá, despacho a Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/ink/eternal` },
  ]
}

// Reescrito 2026-07-30 — antes mostraba una grilla de colores y precios
// inventados ("$XX.XXX") con un botón que sí agregaba al carrito real. Ahora
// usa BrandCatalogSection con productos reales filtrados por `marca='eternal'`.
export default function EternalColorsPage() {
  const { products, faqItems } = useLoaderData()
  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarCategory pageName="Eternal Ink" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Eternal Ink
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            Catálogo Completo
          </h1>

          <div className="mt-10 max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-5">
              Eternal Ink es reconocida mundialmente por definir el estándar de consistencia y vitalidad cromática en el arte del tatuaje. Desarrollada por artistas y para artistas, es una marca sinónimo de confianza, con una de las paletas de color más ricas y estables del mercado.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-5">
              Formulada sin acrílicos y de base acuosa, cada gota de Eternal Ink garantiza una inyección fluida bajo la piel, reduciendo el trauma tisular y facilitando un proceso de curación óptimo que conserva la intensidad del pigmento a lo largo de los años.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Descubre desde sus prestigiosos negros como Pitch Black y Maxx Black hasta sus sets especializados de realismo y tonos de piel, todos producidos en entornos de laboratorio estériles de última generación.
            </p>
          </div>
        </div>

        <BrandCatalogSection brandName="Eternal Ink" products={products} />

        <SupplyFAQ items={faqItems} nombre="Eternal Ink" />

      </div>

      <FooterSupply />

    </div>
  )
}