import { useLoaderData } from 'react-router-dom'
import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import BrandCatalogSection from '../../BrandCatalogSection'
import { fetchCatalogMarca } from '../../../../hooks/useCatalog'

export async function loader() {
  return fetchCatalogMarca('supply', 'solid-ink')
}

export function meta() {
  const title = 'Tintas Solid Ink | INKognito Supply — Colombia'
  const description = 'Solid Ink: paleta de colores puros y consistentes para realismo y acuarela. Disponibles en Urabá, Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/ink/solid-ink` },
  ]
}

// Reescrito 2026-07-30 — antes mostraba una grilla de colores y precios
// inventados ("$XX.XXX") con un botón que sí agregaba al carrito real. Ahora
// usa BrandCatalogSection con productos reales filtrados por `marca='solid-ink'`.
export default function SolidColorsPage() {
  const { products } = useLoaderData()
  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarCategory pageName="Solid Ink" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Solid Ink
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            Catálogo Completo
          </h1>

          <div className="mt-10 max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-5">
              Solid Ink es considerada por innumerables artistas como la representación perfecta de la saturación pura y la consistencia ideal. Fundada por el veterano tatuador Federico Ferroni, la marca nació de la necesidad de conseguir pigmentos intensos, naturales e increíblemente estables.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-5">
              Elaborada con los pigmentos orgánicos de la más alta calidad y libre de aditivos nocivos, Solid Ink es sumamente fácil de aplicar en la piel. Su base fluida de agua destilada, glicerina y extracto de hamamelis asegura una textura óptima que no se seca fácilmente.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Explora una gama cromática insuperable que abarca sus prestigiosos negros de línea y relleno, así como amarillos, rojos y verdes sumamente vibrantes que garantizan resultados limpios, sólidos y duraderos.
            </p>
          </div>
        </div>

        <BrandCatalogSection brandName="Solid Ink" products={products} />

        <section className="mt-24 md:mt-32">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-10">
            Preguntas frecuentes
          </h2>

          <div className="space-y-6">
            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Quién creó Solid Ink?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Solid Ink fue desarrollada por el tatuador Federico Ferroni, quien diseñó una fórmula sumamente concentrada y natural para satisfacer sus propias exigencias artísticas y las de la industria profesional.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Qué ingredientes se utilizan en la tinta Solid Ink?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Está elaborada con pigmentos orgánicos puros de excelente grado, mezclados con agua destilada estéril, glicerina vegetal y un toque de extracto de hamamelis orgánico.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Las tintas de Solid Ink son veganas?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Sí, toda la línea de Solid Ink es 100% vegana, libre de gluten, crueldad animal y conservantes químicos agresivos.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cómo cura la tinta Solid Ink?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Su curación destaca por dejar un acabado mate satinado de extrema solidez, donde los colores se mantienen sumamente fieles al tono original inyectado.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Solid Ink contiene alérgenos o gluten?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                No, la marca se enorgullece de fabricar un producto totalmente hipoalergénico, libre de gluten y metales pesados nocivos para el organismo.
              </p>
            </div>
          </div>
        </section>

      </div>

      <FooterSupply />

    </div>
  )
}