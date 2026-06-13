import NavbarCategoryStore from '../NavbarCategoryStore'
import FooterStore from '../FooterStore'
import { FaWhatsapp } from 'react-icons/fa'
import StoreProductCard from '../StoreProductCard'
import Seo from '../../Seo'

const SHOE_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44']

const products = [
  { id: 1, name: 'Tiempo Legend 10 Club TF', brand: 'Nike', price: '$229.000', tag: 'Multisuperficie' },
  { id: 2, name: 'Copa Pure.4 TF', brand: 'Adidas', price: '$219.000', tag: 'Multisuperficie' },
  { id: 3, name: 'Predator Club TF', brand: 'Adidas', price: '$235.000', tag: 'Multisuperficie' },
  { id: 4, name: 'Phantom Club TF', brand: 'Nike', price: '$245.000', tag: 'Control' },
  { id: 5, name: 'King Pro TT', brand: 'Puma', price: '$209.000', tag: 'Velocidad' },
  { id: 6, name: 'Future Play TF', brand: 'Puma', price: '$199.000', tag: 'Versatil' },
  { id: 7, name: 'X Speedportal.4 TF', brand: 'Adidas', price: '$225.000', tag: 'Velocidad' },
  { id: 8, name: 'Mercurial Vapor 15 Club TF', brand: 'Nike', price: '$239.000', tag: 'Velocidad' },
]

const faqs = [
  {
    q: '¿Los tenis guayo son originales o réplicas?',
    a: 'Son réplicas de alta calidad con materiales premium similares a los originales, a una fracción del precio. Diseños inspirados en los modelos TF de Nike, Adidas y Puma con la misma estética y funcionalidad.',
  },
  {
    q: '¿Sirven para jugar fútbol 5 en las canchas de Urabá?',
    a: 'Sí. El tenis guayo TF está diseñado precisamente para canchas sintéticas y superficies duras — las más comunes en Chigorodó, Carepa, Apartadó y Turbo. Agarre ideal sin dañar la superficie.',
  },
  {
    q: '¿Puedo usarlos también en la calle?',
    a: 'Sí, esa es su ventaja sobre el guayo tradicional. El Copa Pure TF y el Tiempo Legend TF tienen siluetas limpias que combinan bien con ropa casual, populares en Urabá por su doble funcionalidad: canchita y calle.',
  },
  {
    q: '¿Hacen envíos a toda la región de Urabá?',
    a: 'Sí. Cubrimos todo el Urabá antioqueño: Chigorodó, Carepa, Apartadó, Turbo, Mutatá y Arboletes. Entrega en 1 a 4 días hábiles con pago contraentrega disponible.',
  },
  {
    q: '¿Qué pasa si la talla no me queda?',
    a: 'Hacemos cambio de talla sin problema. Contáctanos dentro de los 3 días hábiles de recibir tu pedido. Por WhatsApp te guiamos para elegir la talla correcta antes de hacer el pedido.',
  },
]

export default function TenisGuayoPage() {
  return (
    <>
      <Seo
        title="Tenis y guayos | INKognito Store — Urabá"
        description="Tenis guayo multisuperficie para las canchas sintéticas de Urabá. Perfectos para fútbol 5 y uso diario. Nike, Adidas y Puma réplica premium. Entrega en toda la región."
        siteName="INKognito Store"
        canonical={`${import.meta.env.VITE_SITE_URL}/store/tenis-guayo`}
      />
      <NavbarCategoryStore pageName="Tenis Guayo" />

      {/* HERO */}
      <div className="bg-gray-50 pt-20 md:pt-24">
        <div className="pb-6 px-6 max-w-7xl mx-auto">
          <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-sm mb-4">Categoría</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-3 text-gray-900">
            Tenis Guayo
          </h1>
          <p className="uppercase tracking-[0.2em] text-gray-500 text-xs mb-8">
            Multisuperficie • Fútbol • Calle
          </p>
          <p className="text-gray-700 leading-relaxed max-w-2xl text-base md:text-lg">
            La solución perfecta para las canchas sintéticas de fútbol 5 de Urabá: tracción de guayo,
            comodidad de tenis. Del partido a la calle sin cambiar de calzado.
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
                category="tenis-guayo"
                sizes={SHOE_SIZES}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA DARK */}
      <div className="bg-black py-16 px-6 text-center">
        <a
          href="https://wa.me/573207911013?text=Hola,%20quiero%20ver%20el%20catálogo%20completo%20de%20tenis%20guayo"
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
