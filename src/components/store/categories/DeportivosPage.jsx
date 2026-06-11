import NavbarCategoryStore from '../NavbarCategoryStore'
import FooterStore from '../FooterStore'
import { FaWhatsapp } from 'react-icons/fa'
import { useStoreCart } from '../../../contexts/StoreCartContext'

const products = [
  { id: 1, name: 'Air Zoom Pegasus 40', brand: 'Nike', price: '$289.000', tag: 'Running' },
  { id: 2, name: 'Ultraboost 23', brand: 'Adidas', price: '$315.000', tag: 'Running' },
  { id: 3, name: 'Gel-Kayano 30', brand: 'Asics', price: '$299.000', tag: 'Running' },
  { id: 4, name: 'Metacon 8', brand: 'Nike', price: '$259.000', tag: 'Entrenamiento' },
  { id: 5, name: 'NMD_R1', brand: 'Adidas', price: '$245.000', tag: 'Lifestyle Sport' },
  { id: 6, name: 'Fresh Foam X 1080', brand: 'New Balance', price: '$279.000', tag: 'Running' },
  { id: 7, name: 'React Infinity Run', brand: 'Nike', price: '$295.000', tag: 'Running' },
  { id: 8, name: 'Solar Boost 5', brand: 'Adidas', price: '$269.000', tag: 'Running' },
]

const faqs = [
  {
    q: '¿Cuál es la diferencia entre una zapatilla de running y una de entrenamiento?',
    a: 'Las zapatillas de running están diseñadas para movimiento unidireccional hacia adelante, con mayor amortiguación en el talón y antepié. Las de entrenamiento ofrecen estabilidad lateral para sentadillas, pesas y movimientos en múltiples direcciones. Usar el calzado adecuado reduce el riesgo de lesiones.',
  },
  {
    q: '¿Cómo sé qué talla pedir si compro online?',
    a: 'Mide tu pie en centímetros desde el talón hasta el dedo más largo. Las tallas Nike y Adidas suelen coincidir con la talla estándar colombiana. Si estás entre dos tallas, recomendamos ir a la talla mayor para mayor comodidad, especialmente en running. Escríbenos por WhatsApp con tus medidas y te asesoramos.',
  },
  {
    q: '¿Qué zapatilla deportiva es mejor para el clima caliente de Urabá?',
    a: 'Recomendamos modelos con malla transpirable como la Ultraboost 23 o la Air Zoom Pegasus 40, que tienen parte superior en tejido engineered mesh que permite ventilación constante y evita que el pie se sobrecaliente durante el ejercicio.',
  },
  {
    q: '¿Cuánto dura una zapatilla deportiva de calidad?',
    a: 'Un calzado deportivo de marca premium tiene una vida útil de 500 a 800 kilómetros en running, o de 12 a 18 meses en uso regular de entrenamiento. La clave es rotar entre dos pares y dejar secar el calzado entre usos.',
  },
  {
    q: '¿Hacen envíos a Chigorodó y municipios del Urabá?',
    a: 'Sí, cubrimos toda la región: Chigorodó, Carepa, Apartadó, Turbo, Mutatá y Arboletes. El tiempo de entrega varía de 1 a 4 días hábiles según el municipio. Escríbenos por WhatsApp para confirmar disponibilidad y coordinar el envío.',
  },
]

export default function DeportivosPage() {
  const { addItem } = useStoreCart()
  return (
    <>
      <div className="min-h-screen bg-black text-white">

        <NavbarCategoryStore pageName="Deportivos" />

        <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">

          {/* ENCABEZADO */}
          <div className="mb-16">
            <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-sm mb-4">
              Categoría
            </p>
            <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-3">
              Deportivos
            </h1>
            <p className="uppercase tracking-[0.2em] text-zinc-500 text-xs mb-10">
              Running • Entrenamiento • Gym
            </p>

            <div className="mt-6 max-w-4xl space-y-4">
              <p className="text-zinc-400 leading-relaxed">
                En Urabá se vive el deporte con intensidad. Desde las madrugadas en el malecón de Turbo
                hasta las canchas de Apartadó, el calzado deportivo que usas hace la diferencia entre
                rendir o lesionarte. En INKognito Store seleccionamos zapatillas de alto rendimiento
                para corredores, atletas y personas que entrenan fuerte.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Trabajamos con las marcas más reconocidas del mercado: Nike, Adidas, Asics y New Balance.
                Cada modelo está elegido por su rendimiento, durabilidad y tecnología de amortiguación,
                pensado para el ritmo activo de la región.
              </p>
            </div>
          </div>

          {/* GRID DE PRODUCTOS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-zinc-800 bg-zinc-950 rounded-xl md:rounded-2xl overflow-hidden hover:border-[#C9A84C]/50 transition-all duration-300"
              >
                <div className="h-40 md:h-56 bg-zinc-900 flex items-center justify-center">
                  <p className="text-zinc-700 uppercase tracking-[0.3em] text-xs">Imagen</p>
                </div>
                <div className="p-4 md:p-5">
                  <p className="text-[#C9A84C] uppercase tracking-[0.25em] text-[10px] md:text-xs mb-1">
                    {product.brand} — {product.tag}
                  </p>
                  <h3 className="text-base md:text-xl font-black uppercase mb-3 leading-tight">
                    {product.name}
                  </h3>
                  <span className="text-white font-bold text-base md:text-lg block mb-3">
                    {product.price}
                  </span>
                  <button
                    onClick={() => addItem(product, 'deportivos')}
                    className="w-full py-2 border border-zinc-700 uppercase tracking-[0.15em] text-xs hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300"
                  >
                    + Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CTA WHATSAPP */}
          <div className="mt-16 text-center">
            <a
              href="https://wa.me/573207911013?text=Hola,%20quiero%20ver%20el%20catálogo%20completo%20de%20zapatos%20deportivos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-xl border text-white uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.2)] hover:border-[#C9A84C]"
              style={{ borderColor: 'rgba(201,168,76,0.3)', backgroundColor: 'rgba(201,168,76,0.04)' }}
            >
              <FaWhatsapp size={22} />
              Ver catálogo completo
            </a>
          </div>

          {/* FAQ */}
          <section className="mt-24 md:mt-32">
            <h2 className="text-3xl md:text-5xl font-black uppercase mb-10">
              Preguntas Frecuentes
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all duration-300">
                  <h3 className="font-bold text-base md:text-lg mb-3">{faq.q}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm md:text-base">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      <FooterStore />
    </>
  )
}
