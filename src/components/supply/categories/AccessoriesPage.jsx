import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import { useSupplyCart } from '../../../contexts/SupplyCartContext'
import Seo from '../../Seo'

const products = [
   { id: 1, name: 'Stencil Gel', brand: 'Protón', price: '$15' },
  { id: 2, name: 'Espuma Limpiadora', brand: 'Royal Three', price: '$12' },
  { id: 3, name: 'Solidificador Medusa', brand: 'Royal Three', price: '$10' },
  { id: 4, name: 'Cubre Grip', brand: 'Mast', price: '$8' },
  { id: 5, name: 'Caps', brand: 'EZ Tattoo', price: '$5' },
  { id: 6, name: 'Fundas para Máquina', brand: 'Peak', price: '$6' },
  { id: 7, name: 'Fundas para Clip Cord', brand: 'Cheyenne', price: '$7' },
  { id: 8, name: 'Piel Sintetica', brand: 'Reelskin', price: '$18' },
]

export default function AccessoriesPage() {
  const { addItem } = useSupplyCart()
  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Accesorios para tatuaje | INKognito Supply — Urabá"
        description="Electrum, Hornet, Solidify, Mast y más. Insumos desechables, stencil gel, fundas y accesorios profesionales para estudios de tatuaje en Urabá, Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/accessories`}
      />
      <NavbarCategory pageName="Accesorios" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Categoría
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            Accesorios
          </h1>

          <div className="mt-10 max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-5">
              El éxito de una sesión de tatuaje radica en la atención a los detalles y la preparación impecable de la estación de trabajo. Los accesorios y suministros desechables aseguran un entorno completamente higiénico, facilitan la transferencia exacta del diseño y optimizan la comodidad del artista paso a paso.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-5">
              En INKognito Supply contamos con una amplia gama de insumos de marcas destacadas como Electrum, Hornet, Solidify, Mast, Peak y EZ. Todo lo necesario para tu día a día: gel transfer para Stencil de alta definición, espumas de limpieza, solidificadores de líquidos, fundas para máquinas y cables, caps para tinta y piel sintética de primera calidad para practicar.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Protege tus herramientas de la contaminación cruzada y eleva tus estándares de bioseguridad con accesorios de grado profesional que garantizan un flujo de trabajo fluido, seguro y eficiente en cada sesión.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">

          {products.map((product) => (
            <div
              key={product.id}
              className="border border-zinc-800 bg-zinc-950 rounded-xl md:rounded-2xl overflow-hidden hover:border-zinc-600 transition-all duration-300"
            >
              <div className="aspect-square bg-zinc-900 relative overflow-hidden flex items-center justify-center">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                )}
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
                  onClick={() => addItem(product, 'accessories')}
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
                ¿Qué es un solidificador de líquidos y por qué debería usarlo?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Es un polvo superabsorbente que gelifica instantáneamente los residuos líquidos (agua y tinta) en los vasos de enjuague al final de la sesión, evitando derrames accidentales y facilitando su desecho seguro en el contenedor de residuos biológicos.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Para qué sirven las fundas protectoras de máquina y clip cord?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Son barreras plásticas desechables indispensables para cubrir la máquina, el cable de alimentación o la batería inalámbrica. Evitan el contacto directo de fluidos, pigmentos y bacterias con los equipos, previniendo la contaminación cruzada.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cómo se logra que un stencil dure durante toda la sesión?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Se debe limpiar y desengrasar muy bien la piel del cliente. Luego, aplicar una capa delgada y uniforme de gel transfer de alta calidad (como Electrum), colocar el diseño presionando suavemente y dejar secar por completo entre 10 y 15 minutos antes de empezar a tatuar.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Qué es la piel sintética para tatuar y cuál es la mejor?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Es una plancha de silicona o caucho que simula la textura y resistencia de la piel humana. Las de alta calidad (como Reelskin) tienen el grosor y flexibilidad ideales para practicar técnicas de delineado, sombreado y empaque de color sin pigmentar toda la superficie.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Qué son los caps para tinta y qué tamaños existen?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Son pequeños recipientes de plástico desechables donde se vierte la tinta. Vienen en varios tamaños (pequeños de 8mm, medianos de 12mm y grandes de 15mm o más) para adaptarse a la cantidad de pigmento requerida para cada color del diseño.
              </p>
            </div>
          </div>
        </section>

      </div>

      <FooterSupply />

    </div>
  )
}