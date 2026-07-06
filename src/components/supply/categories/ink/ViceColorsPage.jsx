import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import BrandCatalogSection from '../../BrandCatalogSection'
import Seo from '../../../Seo'

export default function ViceColorsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Tintas Vice Colors | INKognito Supply — Colombia"
        description="Catálogo completo de Vice Colors: negros, grises, rojos, azules, pieles y más. Tintas premium para realismo y neotradicional. Disponibles en Urabá, despacho a Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/ink/vice-colors`}
      />
      <NavbarCategory pageName="Vice Colors" />

      <div className="pt-20 md:pt-24 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-6 md:mb-8">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-2">
            Vice Colors
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-3">
            Catálogo Completo
          </h1>

          <div className="max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-3">
              Vice Colors es una de las marcas de pigmentos más innovadoras y de mayor crecimiento en el sector europeo y latinoamericano. Con una personalidad audaz e ingredientes seleccionados meticulosamente, ha conquistado a los tatuadores que buscan colores con nombres rebeldes y saturaciones extremas.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-3">
              Su formulación destaca por su excelente viscosidad y rapidez de implantación. Productos estrella como Black Sabbath, El Gato Blanco y El Gato Patrón han redefinido la manera en que los artistas abordan los rellenos puros y los delineados de alto contraste.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Explora una gama cromática llena de actitud y diseñada para aguantar el paso del tiempo intacta. Perfecta para realismo, neotradicional, lettering, y estilos modernos de alta exigencia visual.
            </p>
          </div>
        </div>

        <BrandCatalogSection brandName="Vice Colors" />

        <section className="mt-10 md:mt-14">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-6">
            Preguntas frecuentes
          </h2>

          <div className="space-y-6">
            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Qué caracteriza a las tintas Vice Colors?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Su excelente saturación y brillo post-cicatrización, acompañados de nombres super creativos inspirados en la cultura pop y del tatuaje, con una inyección sumamente fluida.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cuál es el negro más recomendado de Vice Colors?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Black Sabbath y Vicious Black son los negros estrella. Black Sabbath destaca para líneas y sombras estables, mientras que Vicious Black ofrece una profundidad absoluta para rellenos sólidos.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Las tintas de Vice Colors son seguras para la piel?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Por supuesto. Se fabrican siguiendo normativas internacionales muy exigentes de bioseguridad, garantizando pigmentos puros, estériles y estables.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cómo es el proceso de curación con Vice Colors?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Gracias a sus componentes de alta pureza, minimizan el trauma durante la sesión y curan con excelente retención, manteniendo tonos vivos e idénticos al primer día.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Vice Colors es un producto vegano?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Sí, toda la gama de tintas Vice Colors es 100% apta para veganos y está fabricada sin ningún tipo de crueldad o componente de origen animal.
              </p>
            </div>
          </div>
        </section>

      </div>

      <FooterSupply />
    </div>
  )
}