import NavbarCategoryStore from '../NavbarCategoryStore'
import FooterStore from '../FooterStore'
import { FaWhatsapp } from 'react-icons/fa'
import StoreProductCard from '../StoreProductCard'
import Seo from '../../Seo'
import { useCatalog, toProdCard } from '../../../hooks/useCatalog'

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const faqs = [
  {
    q: '¿Los productos son originales o réplicas?',
    a: 'Son réplicas de alta calidad con materiales premium similares a los originales, a una fracción del precio. Los diseños están inspirados en las mejores marcas deportivas y fabricados con los mismos estándares de acabado y elasticidad.',
  },
  {
    q: '¿La ropa deportiva dura con el uso intenso?',
    a: 'Sí. Fabricada con telas de alto estiramiento y resistencia al sudor, pensada para el uso diario en el clima cálido de Urabá. Las costuras reforzadas garantizan durabilidad en entrenamientos exigentes.',
  },
  {
    q: '¿Las tallas son las mismas que en tiendas de marca?',
    a: 'Manejamos tallas XS a XXL. Como las medidas pueden variar, te recomendamos escribirnos con tu talla habitual y tus medidas de cintura y cadera para orientarte correctamente antes del pedido.',
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

export default function RopaDamaPage() {
  const { allProducts: catalogItems, loading } = useCatalog('store', 'Ropa Dama')
  return (
    <>
      <Seo
        title="Ropa deportiva para dama en Urabá | INKognito Store — Chigorodó"
        description="Sets, leggings y tops deportivos para mujer en Chigorodó y el Urabá antioqueño. Ropa para gym, running, yoga y ciclismo. Tallas XS a XXL. Pide por WhatsApp con entrega a domicilio."
        siteName="INKognito Store"
        canonical={`${import.meta.env.VITE_SITE_URL}/store/ropa-dama`}
      />
      <NavbarCategoryStore pageName="Ropa Dama" />

      <div className="bg-gray-50 pt-20 md:pt-24">
        <div className="pb-6 px-6 max-w-7xl mx-auto">
          <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-sm mb-4">Categoría</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-3 text-gray-900">
            Ropa Deportiva<br />Dama
          </h1>
          <p className="uppercase tracking-[0.2em] text-gray-500 text-xs mb-8">Gym • Running • Yoga • Ciclismo</p>
          <p className="text-gray-700 leading-relaxed max-w-2xl text-base md:text-lg">
            Sets de compresión, leggings de alto rendimiento y tops deportivos pensados para el calor de Urabá.
            Si entrenas en el gym de Chigorodó, corres en Apartadó o practicas yoga en casa,
            la ropa que usas marca la diferencia.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 pt-4 pb-10 md:pt-6 md:pb-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              [...Array(8)].map((_, i) => <div key={i} className="bg-gray-200 rounded-xl animate-pulse aspect-[3/4]" />)
            ) : catalogItems.length === 0 ? (
              <div className="col-span-4 text-center py-16">
                <p className="text-gray-400 text-lg mb-4">Catálogo actualizándose…</p>
                <p className="text-gray-400 text-sm">Escríbenos por WhatsApp para ver disponibilidad</p>
              </div>
            ) : (
              catalogItems.map(item => {
                const prod = toProdCard(item)
                const sizes = item.variantes.map(v => v.variant).filter(Boolean)
                return (
                  <StoreProductCard
                    key={item.name}
                    product={prod}
                    category="ropa-dama"
                    sizes={sizes.length ? sizes : CLOTHING_SIZES}
                  />
                )
              })
            )}
          </div>
        </div>
      </div>

      <div className="bg-black py-16 px-6 text-center">
        <a
          href="https://wa.me/573207911013?text=Hola,%20quiero%20ver%20el%20cat%C3%A1logo%20de%20ropa%20deportiva%20dama"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-5 rounded-xl border text-white uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:border-[#C9A84C]"
          style={{ borderColor: 'rgba(201,168,76,0.3)', backgroundColor: 'rgba(201,168,76,0.04)' }}
        >
          <FaWhatsapp size={22} />
          Ver catálogo completo
        </a>
      </div>

      <div className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-10 text-gray-900">Preguntas Frecuentes</h2>
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
