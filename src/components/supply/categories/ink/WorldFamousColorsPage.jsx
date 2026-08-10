import { useLoaderData } from 'react-router-dom'
import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import BrandCatalogSection from '../../BrandCatalogSection'
import SupplyFAQ from '../../SupplyFAQ'
import { fetchCatalogMarca, fetchSupplyFaq } from '../../../../hooks/useCatalog'

export async function loader() {
  const [catalogo, faqItems] = await Promise.all([
    fetchCatalogMarca('supply', 'world-famous'),
    fetchSupplyFaq({ marca: 'world-famous' }),
  ])
  return { ...catalogo, faqItems }
}

export function meta() {
  const title = 'Tintas World Famous | INKognito Supply — Colombia'
  const description = 'World Famous Ink: alta pigmentación, cicatrización limpia y colores que retienen brillantez con el tiempo. Disponibles en Urabá, Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/ink/world-famous` },
  ]
}

// Reescrito 2026-07-30 — antes mostraba una grilla de colores y precios
// inventados ("$XX.XXX") con un botón que sí agregaba al carrito real. Ahora
// usa BrandCatalogSection con productos reales filtrados por `marca='world-famous'`.
export default function WorldFamousColorsPage() {
  const { products, faqItems } = useLoaderData()
  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarCategory pageName="World Famous" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            World Famous Ink
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            Catálogo Completo
          </h1>

          <div className="mt-10 max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-5">
              World Famous Ink está redefiniendo el arte del tatuaje con pigmentos de una densidad asombrosa y una fluidez de flujo insuperable. Respaldada por un equipo global de artistas de élite, esta marca es venerada por su durabilidad extrema y su brillo inalterable bajo la piel.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-5">
              Su formulación patentada de base vegana pasa por rigurosos procesos de esterilización mediante radiación gamma, asegurando un producto completamente libre de contaminantes y seguro para todo tipo de pieles en cualquier parte del mundo.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Descubre su amplio repertorio que incluye tanto sets icónicos de realismo retrato como su innovadora línea Limitless, diseñada especialmente para cumplir de forma estricta con las exigentes regulaciones REACH de la Unión Europea.
            </p>
          </div>
        </div>

        <BrandCatalogSection brandName="World Famous" products={products} />

        <SupplyFAQ items={faqItems} nombre="World Famous" />

      </div>

      <FooterSupply />

    </div>
  )
}