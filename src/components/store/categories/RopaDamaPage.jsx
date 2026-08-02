import { Link, useLoaderData } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import NavbarCategoryStore from '../NavbarCategoryStore'
import FooterStore from '../FooterStore'
import AccordionCardStore from '../AccordionCardStore'
import { FaWhatsapp } from 'react-icons/fa'
import StoreProductCard from '../StoreProductCard'
import { fetchCatalogCategoriaItems, toProdCard } from '../../../hooks/useCatalog'
import { getAdjacentCategories } from '../../../data/storeCategoriesOrder'
import { useScrolled } from '../../../hooks/useScrolled'

export async function loader() {
  return fetchCatalogCategoriaItems('store', 'Ropa Dama')
}

export function meta() {
  const title = 'Ropa deportiva para dama en Urabá | INKognito Store — Chigorodó'
  const description = 'Sets, leggings y tops deportivos para mujer en Chigorodó y el Urabá antioqueño. Ropa para gym, running, yoga y ciclismo. Tallas XS a XXL. Pide por WhatsApp con entrega a domicilio.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/store/ropa-dama` },
  ]
}

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const STRIPE_PATTERN = {
  backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 19px,rgba(201,168,76,1) 19px,rgba(201,168,76,1) 20px)',
}

const faqs = [
  {
    q: '¿Los productos son de proveedores confiables?',
    a: 'Sí. INKognito Store es una tienda online que trabaja con proveedores verificados y reconocidos, no reventa sin control. Cada producto se revisa antes de despacharse.',
  },
  {
    q: '¿Cómo llega mi pedido y en cuánto tiempo?',
    a: 'Despachamos con Eljach Mensajería Express, nuestro aliado logístico en la región. La ruta es diaria — entrega estimada de 1 a 2 días hábiles a Chigorodó, Carepa, Apartadó y Turbo. Pago contraentrega: pagas cuando recibes el paquete en tu puerta, sin adelantos.',
  },
  {
    q: '¿Qué pasa si la talla que recibo no me queda?',
    a: 'Las tallas disponibles las ves directamente en cada producto del catálogo. Si tienes duda entre dos tallas, escríbenos por WhatsApp con tu medida de cintura y cadera en centímetros y te orientamos antes de confirmar. Si la talla llegó y no queda bien, coordina el cambio dentro de los 3 días hábiles de recibido.',
  },
  {
    q: '¿La ropa aguanta el clima cálido y los entrenamientos de Urabá?',
    a: 'Sí. Telas de alto estiramiento con resistencia al sudor y costuras reforzadas para el uso diario en el calor de la región. Diseños inspirados en las marcas más reconocidas del mercado deportivo, a un precio que tiene sentido para Urabá.',
  },
]

export default function RopaDamaPage() {
  const { items: catalogItems } = useLoaderData()
  const { prev, next } = getAdjacentCategories('ropa-dama')
  const scrolled = useScrolled()

  return (
    <>
      <NavbarCategoryStore pageName="Ropa Dama" />

      {scrolled && prev && (
        <Link
          to={`/store/${prev.slug}`} replace
          aria-label={`Ver ${prev.name}`}
          className="fixed top-16 md:top-20 left-2 md:left-4 z-40 text-gray-500 hover:text-gray-900 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full p-2 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
      )}
      {scrolled && next && (
        <Link
          to={`/store/${next.slug}`} replace
          aria-label={`Ver ${next.name}`}
          className="fixed top-16 md:top-20 right-2 md:right-4 z-40 text-gray-500 hover:text-gray-900 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full p-2 transition-colors"
        >
          <ArrowRight size={20} />
        </Link>
      )}

      {/* HERO */}
      <div className="relative overflow-hidden bg-gray-50 pt-20 md:pt-24">
        <div className="absolute inset-0 opacity-[0.13]" style={STRIPE_PATTERN} />
        <div className="relative z-10 pb-4 px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            {prev && (
              <Link to={`/store/${prev.slug}`} replace aria-label={`Ver ${prev.name}`} className="flex-shrink-0 text-gray-400 hover:text-gray-900 transition-colors">
                <ArrowLeft size={20} />
              </Link>
            )}
            <p className="flex-1 text-center uppercase tracking-[0.25em] text-[#C9A84C] text-xs">Categoría</p>
            {next && (
              <Link to={`/store/${next.slug}`} replace aria-label={`Ver ${next.name}`} className="flex-shrink-0 text-gray-400 hover:text-gray-900 transition-colors">
                <ArrowRight size={20} />
              </Link>
            )}
          </div>
          <h1 className="text-xl md:text-7xl font-black uppercase leading-tight md:leading-none mb-2 text-gray-900 text-center md:text-left">
            Ropa Deportiva Dama
          </h1>
          <p className="uppercase tracking-[0.2em] text-gray-500 text-xs mb-4">Gym • Running • Yoga • Ciclismo</p>
          <p className="text-gray-700 leading-relaxed max-w-2xl text-sm md:text-lg">
            Sets de compresión, leggings y tops para mujer activa. Diseños de marcas reconocidas, fabricados con telas técnicas que resisten el calor y el uso intenso. Despacho con Eljach a toda la región de Urabá — pagas cuando recibes.
          </p>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="bg-gray-50 pt-4 pb-8 md:pb-14 px-6">
        <div className="max-w-7xl mx-auto">
          {catalogItems.length === 0 ? (
            <div className="border border-[#C9A84C]/30 bg-white rounded-2xl p-10 text-center">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Sin stock por el momento</p>
              <p className="text-gray-900 text-lg font-black uppercase mb-2">Catálogo actualizándose</p>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                Déjanos tu número y te avisamos cuando tengamos Ropa Dama disponible. Sé el primero en saber.
              </p>
              <a
                href={`https://wa.me/573207911013?text=${encodeURIComponent('Hola, quiero que me avisen cuando haya Ropa Dama disponible en INKognito Store.')}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold uppercase tracking-[0.15em] text-sm rounded hover:brightness-90 transition"
                style={{ backgroundColor: '#C9A84C' }}
              >
                <FaWhatsapp size={18} />
                Avisarme cuando haya stock →
              </a>
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
                      category="ropa-dama"
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
          href="https://wa.me/573207911013?text=Hola,%20quiero%20ver%20el%20cat%C3%A1logo%20de%20ropa%20deportiva%20dama"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-5 rounded-xl border text-white uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:border-[#C9A84C]"
          style={{ borderColor: 'rgba(201,168,76,0.3)', backgroundColor: 'rgba(201,168,76,0.04)' }}
        >
          <FaWhatsapp size={22} />
          Ver catálogo completo
        </a>
      </div>

      {/* FAQ */}
      <div className="bg-white py-10 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <AccordionCardStore
            icon="❓"
            title="Preguntas frecuentes"
            subtitle="Envíos, tallas y todo lo que necesitas saber antes de tu pedido. Toca para ver las respuestas."
          >
            <div className="flex flex-col gap-5">
              {faqs.map((faq, i) => (
                <div key={i} className={i < faqs.length - 1 ? 'pb-5 border-b border-gray-200' : ''}>
                  <p className="font-bold text-gray-900 text-sm mb-2">{faq.q}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </AccordionCardStore>
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
            <p className="text-white text-xs font-bold uppercase tracking-wide leading-tight">Eljach Mensajería Express</p>
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
