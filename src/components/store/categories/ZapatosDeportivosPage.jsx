import NavbarCategoryStore from '../NavbarCategoryStore'
import FooterStore from '../FooterStore'
import { FaWhatsapp } from 'react-icons/fa'
import StoreProductCard from '../StoreProductCard'
import Seo from '../../Seo'
import { useCatalog, toProdCard } from '../../../hooks/useCatalog'

const SHOE_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44']

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
    q: '¿Los productos son originales o réplicas?',
    a: 'Son réplicas de alta calidad con materiales premium similares a los originales, a una fracción del precio. Los diseños están inspirados en las mejores marcas del mercado y fabricados con los mismos estándares de acabado.',
  },
  {
    q: '¿La calidad es buena? ¿Realmente duran?',
    a: 'Sí. Cada par está fabricado con materiales seleccionados y probados para el uso diario en el clima cálido y la actividad intensa de Urabá. Miles de clientes en la región los usan con satisfacción.',
  },
  {
    q: '¿Cómo elijo entre running y entrenamiento?',
    a: 'Las de running tienen mayor amortiguación en talón y antepié para movimiento unidireccional. Las de entrenamiento ofrecen estabilidad lateral para pesas, sentadillas y movimientos en múltiples direcciones. Escríbenos y te asesoramos según tu actividad.',
  },
  {
    q: '¿Hacen envíos a toda la región de Urabá?',
    a: 'Sí. Cubrimos todo el Urabá antioqueño: Chigorodó, Carepa, Apartadó, Turbo, Mutatá y Arboletes. Entrega en 1 a 4 días hábiles con pago contraentrega disponible.',
  },
  {
    q: '¿Qué pasa si la talla no me queda?',
    a: 'Hacemos cambio de talla sin problema. Contáctanos dentro de los 3 días hábiles de recibir tu pedido y coordinamos el cambio. Por WhatsApp te guiamos para elegir la talla correcta antes de hacer el pedido.',
  },
]

export default function ZapatosDeportivosPage() {
  const { allProducts: catalogItems, loading } = useCatalog('store', 'Zapatos Deportivos')
  return (
    <>
      <Seo
        title="Zapatos deportivos | INKognito Store — Urabá"
        description="Zapatillas para correr y entrenar en Chigorodó, Apartadó y toda la región de Urabá. Nike, Adidas, Asics y New Balance réplica premium. Envío en 1 a 4 días hábiles."
        siteName="INKognito Store"
        canonical={`${import.meta.env.VITE_SITE_URL}/store/zapatos-deportivos`}
      />
      <NavbarCategoryStore pageName="Zapatos Deportivos" />

      {/* HERO */}
      <div className="bg-gray-50 pt-20 md:pt-24">
        <div className="pb-6 px-6 max-w-7xl mx-auto">
          <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-sm mb-4">Categoría</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-3 text-gray-900">
            Zapatos<br />Deportivos
          </h1>
          <p className="uppercase tracking-[0.2em] text-gray-500 text-xs mb-8">
            Running • Entrenamiento • Gym
          </p>
          <p className="text-gray-700 leading-relaxed max-w-2xl text-base md:text-lg">
            Las siluetas de running y entrenamiento más buscadas del mercado, a un precio que tiene
            sentido para Urabá. Amortiguación para el asfalto de Apartadó, soporte para la pesa de Chigorodó.
          </p>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="bg-gray-50 pt-4 pb-10 md:pt-6 md:pb-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? <p className="text-gray-400 col-span-4 py-8 text-center">Cargando...</p>
              : catalogItems.length === 0 ? <p className="text-gray-400 col-span-4 py-8 text-center">Próximamente disponible</p>
              : catalogItems.map(item => {
                const prod = toProdCard(item)
                const sizes = item.variantes.map(v => v.variant).filter(Boolean)
                return (
              <StoreProductCard
                key={item.name}
                product={prod}
                category="zapatos-deportivos"
                sizes={sizes.length ? sizes : SHOE_SIZES}
              />
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA DARK */}
      <div className="bg-black py-16 px-6 text-center">
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
