import NavbarCategoryStore from '../NavbarCategoryStore'
import FooterStore from '../FooterStore'
import { FaWhatsapp } from 'react-icons/fa'
import StoreProductCard from '../StoreProductCard'
import Seo from '../../Seo'
import { useCatalog, toProdCard } from '../../../hooks/useCatalog'

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const STRIPE_PATTERN = {
  backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 19px,rgba(201,168,76,1) 19px,rgba(201,168,76,1) 20px)',
}

const faqs = [
  {
    q: '¿Los productos son originales o réplicas?',
    a: 'Son réplicas de alta calidad con materiales premium similares a los originales, a una fracción del precio. Los diseños están inspirados en las mejores marcas deportivas y fabricados con los mismos estándares de acabado y resistencia.',
  },
  {
    q: '¿La ropa deportiva aguanta entrenamientos exigentes?',
    a: 'Sí. Fabricada con telas técnicas de alto rendimiento, resistentes al sudor y con buena ventilación — ideal para el clima cálido de Urabá. Shorts, camisetas y conjuntos pensados para que la ropa no sea el límite.',
  },
  {
    q: '¿Las tallas son las mismas que en tiendas de marca?',
    a: 'Manejamos tallas S, M, L, XL y XXL. Como las medidas pueden variar entre réplicas, te recomendamos escribirnos con tu talla habitual y tus medidas de pecho y cintura para orientarte correctamente.',
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

export default function RopaCaballerosPage() {
  const { allProducts: catalogItems, loading } = useCatalog('store', 'Ropa Caballeros')

  return (
    <>
      <Seo
        title="Ropa para caballero | INKognito Store — Urabá"
        description="Shorts, camisetas dry-fit, joggers y conjuntos deportivos para hombre en Urabá. Calidad premium para gym, running y ciclismo en el clima cálido de la región."
        siteName="INKognito Store"
        canonical={`${import.meta.env.VITE_SITE_URL}/store/ropa-caballeros`}
      />
      <NavbarCategoryStore pageName="Ropa Caballeros" />

      {/* HERO */}
      <div className="relative overflow-hidden bg-gray-50 pt-20 md:pt-24">
        <div className="absolute inset-0 opacity-[0.13]" style={STRIPE_PATTERN} />
        <div className="relative z-10 pb-4 px-6 max-w-7xl mx-auto">
          <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-xs mb-2">Categoría</p>
          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-2 text-gray-900">
            Ropa Deportiva<br />Caballeros
          </h1>
          <p className="uppercase tracking-[0.2em] text-gray-500 text-xs mb-4">
            Gym • Running • Ciclismo • Urbano
          </p>
          <p className="text-gray-700 leading-relaxed max-w-2xl text-sm md:text-lg">
            Camisetas dry-fit, shorts de running, joggers y conjuntos para el hombre activo de Urabá.
          </p>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="bg-gray-50 pt-4 pb-8 md:pb-14 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="snap-start flex-shrink-0 w-[44vw] md:w-auto bg-gray-200 rounded-xl animate-pulse aspect-[3/4]" />
              ))}
            </div>
          ) : catalogItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">Catálogo actualizándose…</p>
              <p className="text-gray-400 text-sm">Escríbenos por WhatsApp para ver disponibilidad</p>
            </div>
          ) : (
            <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
              {catalogItems.map(item => {
                const prod = toProdCard(item)
                const sizes = item.variantes.map(v => v.variant).filter(Boolean)
                return (
                  <div key={item.name} className="snap-start flex-shrink-0 w-[44vw] md:w-auto">
                    <StoreProductCard
                      product={prod}
                      category="ropa-caballeros"
                      sizes={sizes.length ? sizes : CLOTHING_SIZES}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* CTA DARK — solo desktop */}
      <div className="hidden md:block bg-black py-16 px-6 text-center">
        <a
          href="https://wa.me/573207911013?text=Hola,%20quiero%20ver%20el%20catálogo%20completo%20de%20ropa%20deportiva%20caballeros"
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
      <div className="bg-white py-10 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-5xl font-black uppercase mb-6 md:mb-10 text-gray-900">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-5 hover:border-[#C9A84C] transition-all duration-300 bg-white">
                <h3 className="font-bold text-sm md:text-lg mb-2 text-gray-900">{faq.q}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LLEGAMOS DONDE ESTÁS — solo móvil */}
      <div className="md:hidden bg-black text-white border-t border-zinc-900 px-6 py-8">
        <h2 className="text-2xl font-black uppercase leading-none mb-3 text-white">
          Llegamos donde estás
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-5">
          Contamos con transportadora aliada para entregas seguras y con pago contraentrega en toda la región de Urabá.
        </p>
        <div className="flex gap-2 mb-5">
          <div className="flex items-center justify-center bg-white rounded-xl p-1 flex-shrink-0 aspect-square w-16">
            <img src="/eljach.png" alt="Eljach" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col justify-center bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 flex-1">
            <p className="text-white text-xs font-bold uppercase tracking-wide leading-tight">Eljach Transportadora</p>
            <p className="text-zinc-500 text-[10px] mt-0.5">Entregas locales y contra entrega</p>
          </div>
        </div>
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-2">Zonas de cobertura</p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Chigorodó','Carepa','Apartadó','Turbo','Currulao','El Tres','Coldesa','Río Grande','El Reposo','Casa Verde'].map(c => (
            <span key={c} className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] bg-[#C9A84C]/5">{c}</span>
          ))}
        </div>
        <div className="flex flex-col gap-2 mb-5">
          {['Pago contraentrega disponible','Atención personalizada por WhatsApp','Cobertura en toda la región de Urabá'].map(g => (
            <div key={g} className="flex items-center gap-2">
              <span className="font-bold text-sm" style={{ color: '#C9A84C' }}>✓</span>
              <span className="text-zinc-400 text-xs">{g}</span>
            </div>
          ))}
        </div>
        <a
          href="https://wa.me/573207911013?text=Hola%2C%20quiero%20hacer%20un%20pedido%20en%20INKognito%20Store"
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border text-white font-bold uppercase tracking-[0.15em] text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]"
          style={{ borderColor: 'rgba(201,168,76,0.4)', backgroundColor: 'rgba(201,168,76,0.04)' }}
        >
          📱 Hacer mi pedido ahora
        </a>
      </div>

      <FooterStore />
    </>
  )
}
