import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import { useSupplyCart } from '../../../contexts/SupplyCartContext'

const products = [
  { id: 1, name: 'Starter Kit', brand: 'Inkognito', price: '$299' },
  { id: 2, name: 'Professional Kit', brand: 'Inkognito', price: '$699' },
  { id: 3, name: 'Black & Grey Combo', brand: 'Dynamic', price: '$149' },
  { id: 4, name: 'Color Pack', brand: 'World Famous', price: '$179' },
  { id: 5, name: 'Machine Combo', brand: 'Mast', price: '$499' },
  { id: 6, name: 'Studio Essentials', brand: 'Inkognito', price: '$899' },
]

export default function BundlesPage() {
  const { addItem } = useSupplyCart()
  return (
    <div className="min-h-screen bg-black text-white">

      <NavbarCategory pageName="Combos" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Categoría
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            Combos
          </h1>

          <div className="mt-10 max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-5">
              Adquirir kits y combos especializados es la forma más inteligente de equipar tu estudio, iniciar en la profesión o renovar tus suministros con la mejor relación calidad-precio. En INKognito Supply diseñamos combos profesionales que reúnen productos perfectamente compatibles, asegurando que tengas todo lo necesario para empezar a trabajar de inmediato.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-5">
              Encuentra desde kits de iniciación para aprendices y combos profesionales avanzados con máquinas rotativas de alta gama, hasta packs de tintas de marcas destacadas como Dynamic y World Famous, o sets esenciales de bioseguridad y agujas de varilla o cartuchos.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Todos nuestros combos están configurados por artistas experimentados, garantizando la compatibilidad absoluta de las piezas, la máxima calidad de cada insumo y un descuento significativo en comparación con la compra de productos por separado.
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
                  onClick={() => addItem(product, 'bundles')}
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
                ¿A quién van dirigidos los combos de INKognito Supply?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Ofrecemos opciones para todos los niveles: kits de iniciación con piel sintética y accesorios ideales para aprendices que practican de forma segura, y combos profesionales de alto rendimiento con máquinas tipo pen y fuentes inalámbricas para tatuadores experimentados.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Los combos de tatuaje incluyen productos originales?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Sí, absolutamente todos los componentes de nuestros combos son 100% originales, provenientes de marcas reconocidas del sector, garantizando el mismo estándar de calidad y esterilidad que los productos individuales.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Qué ventajas tiene comprar un combo de tintas o agujas?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Permite acceder a una amplia gama de colores o diferentes configuraciones de agujas esenciales a un precio mucho más accesible y competitivo, facilitando tener un stock completo y variado para cualquier diseño de inmediato.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Se pueden personalizar los productos incluidos en un combo?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Nuestros combos estándar están preconfigurados para mantener los mejores precios posibles. Sin embargo, puedes contactar con nuestro soporte de ventas para asesorarte en la creación de un paquete a medida para tu estudio.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Qué incluye un combo de iniciación típico?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Suelen incluir una máquina rotativa o pen versátil, una fuente de poder compacta, cartuchos o agujas de prueba de varias medidas, tintas básicas para práctica, piel sintética, caps, papel hectográfico para transferir diseños y gel transfer.
              </p>
            </div>
          </div>
        </section>

      </div>

      <FooterSupply />

    </div>
  )
}