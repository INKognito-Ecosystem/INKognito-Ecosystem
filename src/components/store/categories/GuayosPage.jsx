import NavbarCategoryStore from '../NavbarCategoryStore'
import FooterStore from '../FooterStore'
import { FaWhatsapp } from 'react-icons/fa'
import StoreProductCard from '../StoreProductCard'
import Seo from '../../Seo'

const SHOE_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44']

const products = [
  { id: 1, name: 'Predator Accuracy.1 TF', brand: 'Adidas', price: '$359.000', tag: 'Multisuperficie' },
  { id: 2, name: 'Mercurial Vapor XV Elite TF', brand: 'Nike', price: '$399.000', tag: 'Velocidad' },
  { id: 3, name: 'Phantom GX Elite TF', brand: 'Nike', price: '$379.000', tag: 'Control' },
  { id: 4, name: 'Copa Pure.1 TF', brand: 'Adidas', price: '$329.000', tag: 'Toque' },
  { id: 5, name: 'X Speedportal.1 TF', brand: 'Adidas', price: '$345.000', tag: 'Velocidad' },
  { id: 6, name: 'Tiempo Legend 10 Elite', brand: 'Nike', price: '$315.000', tag: 'Clásico' },
  { id: 7, name: 'King Pro TF', brand: 'Puma', price: '$289.000', tag: 'Potencia' },
  { id: 8, name: 'Future 7 Pro TF', brand: 'Puma', price: '$299.000', tag: 'Adaptación' },
]

const faqs = [
  {
    q: '¿Los guayos son originales o réplicas?',
    a: 'Son réplicas de alta calidad con materiales premium similares a los originales, a una fracción del precio. Los diseños están inspirados en los modelos más icónicos de Nike, Adidas y Puma, con acabados de nivel profesional.',
  },
  {
    q: '¿La calidad es buena para jugar en las canchas de Urabá?',
    a: 'Sí. Fabricados con materiales resistentes probados en el uso intensivo. La suela, los tacos y el upper están pensados para rendir en las canchas sintéticas, tierra y grama natural de Chigorodó, Carepa, Apartadó, Turbo y toda la región.',
  },
  {
    q: '¿Qué tipo de guayo es mejor para las canchas del Urabá?',
    a: 'La mayoría de canchas en la región son sintéticas o de tierra, así que recomendamos modelos TF (Turf) para mayor seguridad. Para grama natural, el FG funciona bien. Escríbenos con el tipo de cancha donde juegas y te orientamos.',
  },
  {
    q: '¿Hacen envíos a toda la región de Urabá?',
    a: 'Sí. Cubrimos todo el Urabá antioqueño: Chigorodó, Carepa, Apartadó, Turbo, Mutatá y Arboletes. Entrega en 1 a 4 días hábiles con pago contraentrega disponible.',
  },
  {
    q: '¿Qué pasa si la talla no me queda?',
    a: 'Hacemos cambio de talla sin problema. Contáctanos dentro de los 3 días hábiles de recibir tu pedido. Por WhatsApp te orientamos con la talla antes del pedido para evitar inconvenientes.',
  },
]

export default function GuayosPage() {
  return (
    <>
      <Seo
        title="Guayos | INKognito Store — Urabá"
        description="Guayos de fútbol Nike, Adidas y Puma para las canchas de Chigorodó, Turbo y todo Urabá. Réplicas premium para terreno sintético. Pide por WhatsApp con entrega regional."
        siteName="INKognito Store"
        canonical={`${import.meta.env.VITE_SITE_URL}/store/guayos`}
      />
      <NavbarCategoryStore pageName="Guayos" />

      {/* HERO */}
      <div className="bg-gray-50 pt-20 md:pt-24">
        <div className="pb-6 px-6 max-w-7xl mx-auto">
          <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-sm mb-4">Categoría</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-3 text-gray-900">
            Guayos
          </h1>
          <p className="uppercase tracking-[0.2em] text-gray-500 text-xs mb-8">
            Fútbol • Velocidad • Potencia
          </p>
          <p className="text-gray-700 leading-relaxed max-w-2xl text-base md:text-lg">
            Para dominar el balón en las canchas sintéticas de Chigorodó, los polvorientos de Turbo
            y la grama de Carepa. Tracción, control y potencia en cada par, sin el precio original.
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
                category="guayos"
                sizes={SHOE_SIZES}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA DARK */}
      <div className="bg-black py-16 px-6 text-center">
        <a
          href="https://wa.me/573207911013?text=Hola,%20quiero%20ver%20el%20catálogo%20completo%20de%20guayos"
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
