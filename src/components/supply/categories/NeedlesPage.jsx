import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import { useSupplyCart } from '../../../contexts/SupplyCartContext'

const products = [
  { id: 1, name: 'Bugpin Round Liner', brand: 'Kwadron', price: '$18' },
  { id: 2, name: 'Magnum Curved', brand: 'Cheyenne', price: '$22' },
  { id: 3, name: 'Round Shader RS', brand: 'Mast', price: '$15' },
  { id: 4, name: 'Flat Needle F', brand: 'Peak', price: '$16' },
  { id: 5, name: 'Sublime Liner', brand: 'Kwadron', price: '$20' },
  { id: 6, name: 'Soft Edge Mag', brand: 'EZ Tattoo', price: '$19' },
]

export default function NeedlesPage() {
  const { addItem } = useSupplyCart()
  return (
    <div className="min-h-screen bg-black text-white">

      <NavbarCategory pageName="Agujas" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Categoría
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            agujas
          </h1>

          <div className="mt-10 max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-5">
              Las agujas tradicionales de varilla siguen siendo un pilar fundamental para muchos artistas que prefieren máquinas clásicas de bobinas o rotativas directas. La calidad del acero y la precisión de la soldadura determinan la facilidad de penetración en la piel, la retención de tinta y la limpieza de cada trazo.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-5">
              Nuestra selección de agujas de varilla en INKognito Supply abarca marcas prestigiosas como Kwadron, Cheyenne, Mast y Peak. Fabricadas con acero inoxidable de grado quirúrgico 316L, sometidas a rigurosos controles de calidad y esterilizadas con gas EO para total seguridad.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Ofrecemos todas las configuraciones esenciales: Round Liner para líneas precisas, Round Shader para transiciones suaves, Magnum para rellenos eficientes, y Curved Magnum para un sombreado homogéneo sin dañar los bordes de la piel.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-zinc-800 bg-zinc-950 rounded-xl md:rounded-2xl overflow-hidden hover:border-zinc-600 transition-all duration-300"
            >
              <div className="h-40 md:h-64 bg-zinc-900 flex items-center justify-center">
                <p className="text-zinc-700 uppercase tracking-[0.3em] text-xs md:text-sm">
                  Product Image
                </p>
              </div>

              <div className="p-4 md:p-6">
                <p className="text-zinc-500 uppercase tracking-[0.2em] text-xs mb-1">
                  {product.brand}
                </p>

                <h3 className="text-lg md:text-2xl font-black uppercase mb-3">
                  {product.name}
                </h3>

                <span className="text-white font-bold text-base md:text-xl block mb-3">
                  {product.price}
                </span>
                <button
                  onClick={() => addItem(product, 'needles')}
                  className="w-full py-2 border border-zinc-700 uppercase tracking-[0.15em] text-xs hover:border-blue-500 hover:text-blue-500 transition-all duration-300"
                >
                  + Agregar al carrito
                </button>
              </div>

            </div>
          ))}
        </div>

        <section className="mt-24 md:mt-32">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-10">
            Preguntas frecuentes
          </h2>

          <div className="space-y-6">
            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Diferencia entre agujas de varilla tradicionales y agujas de cartucho?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Las agujas tradicionales van soldadas a una varilla larga que se conecta directamente al martillo de las máquinas de bobinas o rotativas clásicas, mientras que los cartuchos son sistemas compactos con membranas de seguridad diseñados para máquinas tipo pen o grips especializados.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Qué significa el término "Taper" en las agujas de tatuar?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                El Taper es la longitud de la punta de la aguja. Un "Short Taper" tiene una punta más corta y empaca más tinta rápidamente, mientras que un "Long Taper" o "Super Long Taper" tiene puntas más afiladas y largas, ideales para líneas ultra finas y trabajos de gran detalle sin cortar la piel.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Para qué sirve la configuración Round Shader (RS)?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                A diferencia de las Round Liner, las agujas Round Shader se sueldan en paralelo y no de forma cónica cerrada. Esto las hace perfectas para hacer líneas gruesas, rellenar áreas pequeñas y realizar sombras de baja intensidad.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Las agujas tradicionales vienen esterilizadas?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Sí, todas nuestras agujas están empaquetadas de forma individual en blisters estériles de grado médico y tratadas con gas de Óxido de Etileno (EO). Cada blister incluye su lote y fecha de caducidad visible.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cómo elijo el calibre adecuado para mis agujas?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                El calibre 12 (0.35 mm) es excelente para líneas sólidas tradicionales y rellenos rápidos; el calibre 10 (0.30 mm) es versátil para trabajos de línea media y sombras; y el calibre 08 (0.25 mm) se prefiere para detalles minuciosos y texturas de sombra muy suaves.
              </p>
            </div>
          </div>
        </section>

      </div>

      <FooterSupply />

    </div>
  )
}