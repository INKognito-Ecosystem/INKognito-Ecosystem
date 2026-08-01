import { useLoaderData } from 'react-router-dom'
import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import BrandCatalogSection from '../../BrandCatalogSection'
import { fetchCatalogMarca } from '../../../../hooks/useCatalog'

export async function loader() {
  return fetchCatalogMarca('supply', 'eternal')
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
  const { products } = useLoaderData()
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

        <section className="mt-24 md:mt-32">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-10">
            Preguntas frecuentes
          </h2>

          <div className="space-y-6">
            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Qué hace especial a la tinta Eternal Ink?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Su consistencia impecable, brillo y facilidad de inserción, perfeccionados durante más de dos décadas de innovación constante por reconocidos artistas.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Las tintas Eternal Ink contienen acrílico?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                No, Eternal Ink es de base acuosa y orgánica, libre de plásticos y acrílicos nocivos, lo que previene reacciones alérgicas y asegura una curación limpia.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cuál es el negro más oscuro de Eternal Ink?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Tanto Maxx Black como Pitch Black ofrecen una altísima densidad de negro. Pitch Black destaca por su brillo y profundidad absoluta en rellenos sólidos.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Las tintas de Eternal Ink son seguras para la piel?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Totalmente. Se elaboran bajo rigurosos protocolos médicos y de laboratorio en EE. UU., siendo testeadas periódicamente para garantizar total bioseguridad.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cómo debe almacenarse la tinta Eternal Ink?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Debe mantenerse a temperatura ambiente, protegida de la luz solar directa e hidratación excesiva, agitándola bien antes de cada aplicación.
              </p>
            </div>
          </div>
        </section>

      </div>

      <FooterSupply />

    </div>
  )
}