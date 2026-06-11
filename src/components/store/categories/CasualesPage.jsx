import NavbarCategoryStore from '../NavbarCategoryStore'
import FooterStore from '../FooterStore'
import { FaWhatsapp } from 'react-icons/fa'
import { useStoreCart } from '../../../contexts/StoreCartContext'

const products = [
  { id: 1, name: 'Air Force 1 Low', brand: 'Nike', price: '$269.000', tag: 'Clásico' },
  { id: 2, name: 'Forum Low', brand: 'Adidas', price: '$249.000', tag: 'Retro' },
  { id: 3, name: 'Chuck Taylor All Star', brand: 'Converse', price: '$189.000', tag: 'Icónico' },
  { id: 4, name: '574 Core', brand: 'New Balance', price: '$235.000', tag: 'Urbano' },
  { id: 5, name: 'Blazer Mid 77', brand: 'Nike', price: '$259.000', tag: 'Retro' },
  { id: 6, name: 'Superstar', brand: 'Adidas', price: '$229.000', tag: 'Clásico' },
  { id: 7, name: 'Old Skool', brand: 'Vans', price: '$199.000', tag: 'Skate' },
  { id: 8, name: 'Sk8-Hi', brand: 'Vans', price: '$215.000', tag: 'Skate' },
]

const faqs = [
  {
    q: '¿Qué estilo de zapato casual está de moda en 2025?',
    a: 'El estilo chunky y los clásicos retro como el Air Force 1, Forum Low y el Superstar siguen dominando la tendencia urbana. En Urabá, los modelos en blanco y en colores neutros son los más pedidos por su versatilidad para combinar con cualquier outfit del día.',
  },
  {
    q: '¿Son los zapatos casuales aptos para usar en el calor de Urabá?',
    a: 'Sí, siempre que elijas modelos con parte superior en canvas, mesh o cuero perforado. El Converse All Star en canvas y los modelos con malla de Adidas permiten buena circulación de aire y son ideales para el clima cálido de la región.',
  },
  {
    q: '¿Qué diferencia hay entre una zapatilla casual y una deportiva?',
    a: 'Las casuales priorizan el estilo y la comodidad cotidiana, con suela plana o baja y diseño lifestyle. Las deportivas tienen tecnologías de amortiguación y soporte para actividad física. Usar casuales para deporte intenso puede generar lesiones por falta de soporte.',
  },
  {
    q: '¿Cómo cuido mis zapatillas casuales para que duren más?',
    a: 'Evita usarlas bajo lluvia intensa. Para limpiarlas, usa un cepillo suave y jabón neutro, nunca las metas a la lavadora. Guárdalas rellenas con papel para conservar la forma y en un lugar ventilado, lejos de la humedad característica de Urabá.',
  },
  {
    q: '¿Hacen envíos de zapatos casuales a Chigorodó y Turbo?',
    a: 'Sí. Cubrimos Chigorodó, Carepa, Apartadó, Turbo, Mutatá y Arboletes con tiempos de entrega de 1 a 3 días hábiles. Escríbenos por WhatsApp con tu municipio y pedido para coordinar la entrega.',
  },
]

export default function CasualesPage() {
  const { addItem } = useStoreCart()
  return (
    <>
      <div className="min-h-screen bg-black text-white">

        <NavbarCategoryStore pageName="Casuales" />

        <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">

          {/* ENCABEZADO */}
          <div className="mb-16">
            <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-sm mb-4">
              Categoría
            </p>
            <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-3">
              Casuales
            </h1>
            <p className="uppercase tracking-[0.2em] text-zinc-500 text-xs mb-10">
              Lifestyle • Urbano • Street
            </p>

            <div className="mt-6 max-w-4xl space-y-4">
              <p className="text-zinc-400 leading-relaxed">
                Urabá tiene su propio estilo. Un estilo que mezcla la energía del trópico con la actitud
                urbana que se vive en las calles de Apartadó y Chigorodó. En INKognito Store encontrarás
                los modelos casuales más icónicos del mercado para que cada salida sea con identidad propia.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Desde el clásico Air Force 1 hasta el retro Forum Low, pasando por el eterno Converse
                y el skate Vans. Modelos para todos los gustos, todos los estilos y todas las actitudes.
                Porque en Urabá se camina con carácter.
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
                    onClick={() => addItem(product, 'casuales')}
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
              href="https://wa.me/573207911013?text=Hola,%20quiero%20ver%20el%20catálogo%20completo%20de%20zapatos%20casuales"
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
