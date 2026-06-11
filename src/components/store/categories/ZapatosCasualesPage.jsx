import NavbarCategoryStore from '../NavbarCategoryStore'
import FooterStore from '../FooterStore'
import { FaWhatsapp } from 'react-icons/fa'
import StoreProductCard from '../StoreProductCard'

const SHOE_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44']

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
    q: '¿Los productos son originales o réplicas?',
    a: 'Son réplicas de alta calidad con materiales premium similares a los originales, a una fracción del precio. Los diseños están inspirados en las mejores marcas del mercado y fabricados con los mismos estándares de acabado.',
  },
  {
    q: '¿La calidad es buena? ¿Realmente duran?',
    a: 'Sí. Cada par está fabricado con materiales seleccionados y probados para el uso diario en el clima cálido y la actividad de Urabá. Miles de clientes en la región los usan con satisfacción.',
  },
  {
    q: '¿Qué modelos casuales son más pedidos en Urabá?',
    a: 'Los más pedidos son el Air Force 1 en blanco, el Forum Low y el Converse Chuck Taylor. Su diseño limpio combina con cualquier outfit y son perfectos para el clima cálido de la región.',
  },
  {
    q: '¿Hacen envíos a toda la región de Urabá?',
    a: 'Sí. Cubrimos todo el Urabá antioqueño: Chigorodó, Carepa, Apartadó, Turbo, Mutatá y Arboletes. Entrega en 1 a 3 días hábiles con pago contraentrega disponible.',
  },
  {
    q: '¿Qué pasa si la talla no me queda?',
    a: 'Hacemos cambio de talla sin problema. Contáctanos dentro de los 3 días hábiles de recibir tu pedido y coordinamos el cambio. Por WhatsApp te guiamos para elegir la talla correcta antes de hacer el pedido.',
  },
]

export default function ZapatosCasualesPage() {
  return (
    <>
      <NavbarCategoryStore pageName="Zapatos Casuales" />

      {/* HERO */}
      <div className="bg-gray-50 pt-20 md:pt-24">
        <div className="pb-6 px-6 max-w-7xl mx-auto">
          <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-sm mb-4">Categoría</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-3 text-gray-900">
            Zapatos<br />Casuales
          </h1>
          <p className="uppercase tracking-[0.2em] text-gray-500 text-xs mb-8">
            Lifestyle • Urbano • Street
          </p>
          <p className="text-gray-700 leading-relaxed max-w-2xl text-base md:text-lg">
            Calidad premium, precio accesible. Diseños inspirados en las mejores marcas,
            fabricados para el ritmo de Urabá.
          </p>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="bg-gray-50 pt-4 pb-10 md:pt-6 md:pb-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <StoreProductCard
                key={product.id}
                product={product}
                category="zapatos-casuales"
                sizes={SHOE_SIZES}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA DARK */}
      <div className="bg-black py-16 px-6 text-center">
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
      <div className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-10 text-gray-900">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-6 hover:border-[#C9A84C] transition-all duration-300 bg-white">
                <h3 className="font-bold text-base md:text-lg mb-3 text-gray-900">{faq.q}</h3>
                <p className="text-gray-500 leading-relaxed text-sm md:text-base">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FooterStore />
    </>
  )
}
