import { useState } from 'react'
import NavbarCategory from './NavbarCategory'
import FooterSupply from './FooterSupply'
import Seo from '../Seo'
import { useCatalog } from '../../hooks/useCatalog'
import { FaWhatsapp } from 'react-icons/fa'

const WA = '573207911013'

function ProductCard({ item }) {
  const firstVariant = item.variantes?.[0]
  const price = firstVariant?.price
    ? '$' + Math.round(firstVariant.price).toLocaleString('es-CO')
    : null
  const variants = item.variantes?.map(v => v.variant).filter(Boolean) ?? []
  const totalStock = item.variantes?.reduce((s, v) => s + (v.stock || 0), 0) ?? 0
  const waText = encodeURIComponent(
    `Hola, quiero información sobre: ${item.name}${variants[0] ? ' — ' + variants[0] : ''}`
  )
  return (
    <div className="border border-blue-500/40 bg-zinc-950 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300 flex flex-col">
      <div className="aspect-square w-full bg-zinc-900 overflow-hidden">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-zinc-700 uppercase tracking-[0.3em] text-xs text-center px-3">{item.name}</p>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex-1">
          {item.descripcion && <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] mb-1">{item.descripcion}</p>}
          <h3 className="text-sm font-black uppercase leading-tight text-white">{item.name}</h3>
          {variants.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {variants.slice(0, 4).map(v => (
                <span key={v} className="text-[10px] border border-zinc-700 text-zinc-400 px-2 py-0.5 rounded">{v}</span>
              ))}
              {variants.length > 4 && <span className="text-[10px] text-zinc-600">+{variants.length - 4}</span>}
            </div>
          )}
          {price && <p className="text-white font-bold text-sm mt-2">{price}</p>}
          {totalStock <= 3 && totalStock > 0 && (
            <p className="text-yellow-500 text-[10px] mt-1 font-bold">⚠️ Últimas {totalStock} unidades</p>
          )}
        </div>
        <a
          href={`https://wa.me/${WA}?text=${waText}`}
          target="_blank" rel="noopener noreferrer"
          className="text-center px-4 py-2 border border-blue-500/50 text-blue-400 uppercase tracking-[0.15em] text-[11px] font-bold hover:bg-blue-500 hover:text-white transition-all duration-300 rounded"
        >
          Consultar
        </a>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="border border-zinc-800 bg-zinc-950 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-zinc-900" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-4 bg-zinc-800 rounded w-3/4" />
        <div className="h-3 bg-zinc-800 rounded w-1/2" />
        <div className="h-8 bg-zinc-800 rounded mt-2" />
      </div>
    </div>
  )
}

function AccordionCard({ icon, title, subtitle, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-zinc-800 bg-zinc-950 rounded-2xl overflow-hidden">
      {/* Header — siempre visible, toca para abrir/cerrar */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-zinc-900 transition-colors duration-150"
      >
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xl flex-shrink-0">{icon}</span>
            <span className="font-black uppercase text-white tracking-[0.08em] text-sm">{title}</span>
          </div>
          <p className="text-zinc-500 text-xs leading-relaxed pl-8">{subtitle}</p>
        </div>
        <span
          className="text-zinc-500 text-xs flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ▶
        </span>
      </button>

      {/* Contenido — scroll interno, solo visible cuando está abierto */}
      {open && (
        <div className="border-t border-zinc-800 overflow-y-auto" style={{ maxHeight: '340px' }}>
          <div className="px-6 py-5">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SupplyCategoryPage({ title, categoria, slug, desc, intro, guide, faqs }) {
  const { allProducts: products, loading } = useCatalog('supply', categoria)

  return (
    <>
      <Seo
        title={`${title} para tatuadores en Urabá | INKognito Supply — Chigorodó`}
        description={desc || `${title} profesionales para tatuadores en Chigorodó, Urabá. Stock real y envíos a toda la región. Pedidos por WhatsApp.`}
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/${slug}`}
      />
      <NavbarCategory pageName={title} backPath="/supply" backLabel="Supply" />

      <div className="bg-black pt-20 md:pt-24">

        {/* HERO DE CATEGORÍA */}
        <div className="px-6 max-w-7xl mx-auto pb-8 md:pb-12">
          <p className="uppercase tracking-[0.25em] text-blue-500/70 text-xs mb-3">Supply — {categoria}</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-6 text-white">{title}</h1>
          {intro && (
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-3xl">{intro}</p>
          )}
        </div>

        {/* PRODUCTOS DINÁMICOS */}
        <div className="px-6 pb-10 max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="border border-blue-500/20 bg-zinc-950 rounded-2xl p-12 text-center">
              <p className="text-zinc-400 text-lg mb-2">Próximamente disponible</p>
              <p className="text-zinc-600 text-sm mb-6">
                Escríbenos para consultar disponibilidad de {title.toLowerCase()}.
              </p>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hola, quiero consultar ${title} disponibles`)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold uppercase tracking-[0.15em] text-sm rounded hover:bg-blue-600 transition"
              >
                <FaWhatsapp size={18} />
                Consultar disponibilidad
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(item => <ProductCard key={item.name} item={item} />)}
            </div>
          )}
        </div>

        {/* ACORDEONES — guía de compra y FAQ */}
        {(guide?.length > 0 || faqs?.length > 0) && (
          <div className="px-6 pb-16 max-w-7xl mx-auto flex flex-col gap-4">

            {guide?.length > 0 && (
              <AccordionCard
                icon="📖"
                title={`Cómo elegir ${title.toLowerCase()}`}
                subtitle="Tipos, usos, compatibilidad y qué factores tener en cuenta antes de comprar. Toca para desplegar la guía completa."
              >
                <div className="flex flex-col gap-5">
                  {guide.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-2xl flex-shrink-0">{item.icon}</span>
                      <div>
                        <p className="font-black uppercase text-white text-xs tracking-[0.1em] mb-1">{item.title}</p>
                        <p className="text-zinc-500 text-sm leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionCard>
            )}

            {faqs?.length > 0 && (
              <AccordionCard
                icon="❓"
                title="Preguntas frecuentes"
                subtitle="Envíos, calidad, cantidades y todo lo que necesitas saber antes de hacer tu pedido. Toca para ver las respuestas."
              >
                <div className="flex flex-col gap-5">
                  {faqs.map((faq, i) => (
                    <div key={i} className={i < faqs.length - 1 ? 'pb-5 border-b border-zinc-800' : ''}>
                      <p className="font-bold text-white text-sm mb-2">{faq.q}</p>
                      <p className="text-zinc-500 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </AccordionCard>
            )}

          </div>
        )}

        <FooterSupply />
      </div>
    </>
  )
}
