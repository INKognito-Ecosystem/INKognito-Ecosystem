import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import BrandCatalogSection from '../../BrandCatalogSection'
import Seo from '../../../Seo'

export default function DynamicColorsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Tintas Dynamic | INKognito Supply — Colombia"
        description="Dynamic Black, Triple Black y colores clásicos. Pigmentos densos y fluidos para black and grey y estilo tradicional. Disponibles en Urabá, despacho a Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/ink/dynamic`}
      />
      <NavbarCategory pageName="Dynamic" />

      <div className="pt-20 md:pt-24 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-6 md:mb-8">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-2">
            Dynamic
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-3">
            Catálogo Completo
          </h1>

          <div className="max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-3">
              Dynamic Colors ha sido el estándar de oro en la industria del tatuaje durante décadas, ofreciendo pigmentos de dispersión fina de calidad premium. Fabricada en los Estados Unidos, es reconocida globalmente por la fluidez excepcional de sus tintas y su curación sumamente brillante y duradera.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-3">
              Nuestra selección incluye sus icónicas tintas negras como el clásico Dynamic Black (TBK) y el ultra concentrado Triple Black, favoritos indiscutibles para líneas precisas, sombreados suaves y rellenos sólidos e intensos.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Explora una gama de colores vivos y consistentes que garantizan un flujo constante en la máquina de tatuar y una retención de color óptima bajo la piel, ideales para todo tipo de estilos artísticos.
            </p>
          </div>
        </div>

        <BrandCatalogSection brandName="Dynamic" />

        <section className="mt-10 md:mt-14">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-6">
            Preguntas frecuentes
          </h2>

          <div className="space-y-6">
            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Por qué la tinta negra Dynamic Black es tan popular?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Su popularidad se debe a su altísima concentración de pigmento, excelente fluidez y un tono negro profundo que no se desvanece fácilmente, facilitando un delineado limpio y sombreados consistentes.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cuál es la diferencia entre Dynamic Black y Triple Black?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                El Dynamic Black estándar es ideal para delinear y diluir en mezclas de sombras (greywash). Por otro lado, Triple Black contiene una carga de pigmento aún mayor, lo que lo hace perfecto exclusivamente para rellenos sólidos y tribales super oscuros.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Las tintas Dynamic son aptas para veganos?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Sí, todas las tintas Dynamic están formuladas con ingredientes de alta pureza de origen no animal y son 100% libres de crueldad animal.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Dónde se fabrican las tintas Dynamic?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Las tintas Dynamic originales son diseñadas, probadas y fabricadas con orgullo en los Estados Unidos, cumpliendo estrictos controles de calidad.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cómo puedo diluir la tinta Dynamic para sombreados?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Se recomienda diluir utilizando agua bidestilada estéril, extracto de hamamelis o una solución mezcladora especializada para mantener la esterilidad del pigmento.
              </p>
            </div>
          </div>
        </section>

      </div>

      <FooterSupply />
    </div>
  )
}