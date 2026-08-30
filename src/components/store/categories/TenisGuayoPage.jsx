import { Link, useLoaderData } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import NavbarCategoryStore from '../NavbarCategoryStore'
import FooterStore from '../FooterStore'
import LlegamosDondeEstas from '../LlegamosDondeEstas'
import AccordionCardStore from '../AccordionCardStore'
import { FaWhatsapp } from 'react-icons/fa'
import StoreProductCard from '../StoreProductCard'
import { fetchCatalogCategoriaItems, toProdCard } from '../../../hooks/useCatalog'
import { getAdjacentCategories } from '../../../data/storeCategoriesOrder'
import { useScrolled } from '../../../hooks/useScrolled'

export async function loader() {
  return fetchCatalogCategoriaItems('store', 'Tenis y guayo')
}

export function meta() {
  const title = 'Teniguayos | INKognito Store — Urabá'
  const description = 'Tenis multideporte para sintético, polvo de ladrillo y calle en Urabá. Versatilidad total, despacho con Ruta del Golfo a toda la región. Pago contraentrega.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/store/tenis-guayo` },
  ]
}

const SHOE_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44']

const STRIPE_PATTERN = {
  backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 19px,rgba(201,168,76,1) 19px,rgba(201,168,76,1) 20px)',
}

const faqs = [
  {
    q: '¿Los productos son de proveedores confiables?',
    a: 'Sí. INKognito Store es una tienda online que trabaja con proveedores verificados y reconocidos, no reventa sin control. Cada producto se revisa antes de despacharse.',
  },
  {
    q: '¿Para qué superficies sirven exactamente?',
    a: 'Los tenis guayo están diseñados para rendir en sintético, polvo de ladrillo y calle sin cambiar de par. Son la opción más versátil para quien juega en diferentes superficies o quiere un calzado que también use fuera de la cancha.',
  },
  {
    q: '¿Cómo llegan a mi municipio y en cuánto tiempo?',
    a: 'Despachamos con Ruta del Golfo, nuestra red de transportadoras verificadas en toda la región de Urabá — el tiempo exacto depende de la transportadora y la zona. Pago contraentrega: pagas cuando recibes el paquete, sin adelantos.',
  },
  {
    q: '¿Qué pasa si la talla no me queda?',
    a: 'Las tallas disponibles las ves directamente en cada producto del catálogo. Si tienes duda entre dos números, escríbenos por WhatsApp con la medida de tu pie en centímetros antes de confirmar. Si la talla llegó y no queda, coordina el cambio dentro de los 3 días hábiles de recibido.',
  },
]

export default function TenisGuayoPage() {
  const { items: catalogItems } = useLoaderData()
  const { prev, next } = getAdjacentCategories('tenis-guayo')
  const scrolled = useScrolled()

  return (
    <>
      <NavbarCategoryStore pageName="Teniguayos" />

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
          <h1 className="text-xl md:text-7xl font-black uppercase leading-tight md:leading-none mb-2 text-gray-900 text-center md:text-left">Teniguayos</h1>
          <p className="uppercase tracking-[0.2em] text-gray-500 text-xs mb-4 text-center md:text-left">Multisuperficie • Sintético • Calle</p>
          <p className="text-gray-700 leading-relaxed max-w-2xl text-sm md:text-lg text-justify [hyphens:auto]">
            El calzado más versátil de Urabá: rinde en sintético, polvo de ladrillo y calle sin cambiar de par. La opción inteligente para quien juega donde se pueda y quiere un solo calzado para todo. Despachamos con Ruta del Golfo a toda la región — pago contraentrega.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 pt-4 pb-8 md:pb-14 px-6">
        <div className="max-w-7xl mx-auto">
          {catalogItems.length === 0 ? (
            <div className="border border-[#C9A84C]/30 bg-white rounded-2xl p-10 text-center">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Sin stock por el momento</p>
              <p className="text-gray-900 text-lg font-black uppercase mb-2">Catálogo actualizándose</p>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                Déjanos tu número y te avisamos cuando tengamos Teniguayos disponible. Sé el primero en saber.
              </p>
              <a
                href={`https://wa.me/573207911013?text=${encodeURIComponent('Hola, quiero que me avisen cuando haya Teniguayos disponible en INKognito Store.')}`}
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
                    <StoreProductCard product={prod} category="tenis-guayo" sizes={sizes.length ? sizes : SHOE_SIZES} />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* CTA DARK — solo desktop */}
      <div className="hidden md:block bg-black py-16 px-6 text-center">
        <a href="https://wa.me/573207911013?text=Hola,%20quiero%20ver%20tenis%20y%20guayos" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-5 rounded-xl border text-white uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:border-[#C9A84C]"
          style={{ borderColor: 'rgba(201,168,76,0.3)', backgroundColor: 'rgba(201,168,76,0.04)' }}>
          <FaWhatsapp size={22} />Ver catálogo completo
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

      <LlegamosDondeEstas />

      <FooterStore />
    </>
  )
}
