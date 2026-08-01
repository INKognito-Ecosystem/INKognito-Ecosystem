import { useLoaderData } from 'react-router-dom'
import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import BrandCatalogSection from '../../BrandCatalogSection'
import { fetchCatalogMarca } from '../../../../hooks/useCatalog'

export async function loader() {
  return fetchCatalogMarca('supply', 'world-famous')
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
  const { products } = useLoaderData()
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

        <section className="mt-24 md:mt-32">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-10">
            Preguntas frecuentes
          </h2>

          <div className="space-y-6">
            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Por qué se consideran revolucionarias las tintas World Famous?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Su fama radica en una de las mayores densidades de pigmento del mercado y un flujo ultra rápido que reduce la resistencia al tatuar, logrando curados extremadamente duraderos y nítidos.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Qué es la gama Limitless de World Famous?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Limitless es la línea premium rediseñada de World Famous para cumplir al 100% con los estrictos parámetros del reglamento europeo REACH sobre pigmentos seguros.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Las tintas de World Famous son veganas?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Sí, todos sus productos son completamente libres de crueldad animal, no contienen derivados de origen animal y se clasifican como vegan-friendly.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Dónde se fabrican las tintas World Famous?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Cada envase original se produce en instalaciones avanzadas ubicadas en los Estados Unidos, sujetas a estrictas pautas de grado médico.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Son seguras las tintas World Famous Ink?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Absolutamente. Su esterilización mediante radiación gamma de alta penetración y su envasado hermético garantizan la máxima seguridad higiénica para el artista y el cliente.
              </p>
            </div>
          </div>
        </section>

      </div>

      <FooterSupply />

    </div>
  )
}