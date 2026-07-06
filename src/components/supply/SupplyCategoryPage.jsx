import { useState } from 'react'
import { Link } from 'react-router-dom'
import NavbarCategory from './NavbarCategory'
import FooterSupply from './FooterSupply'
import AccordionCard from './AccordionCard'
import Seo from '../Seo'
import { useCatalog } from '../../hooks/useCatalog'
import { useScrolled } from '../../hooks/useScrolled'
import { useSupplyCart } from '../../contexts/SupplyCartContext'
import { FaWhatsapp } from 'react-icons/fa'
import { ExternalLink, Droplet, PenTool, Crosshair, Drill, Hand, ShieldCheck, PlugZap, Toolbox, BedDouble, Package, ArrowLeft, ArrowRight } from 'lucide-react'
import { getAdjacentCategories } from '../../data/supplyCategoriesOrder'

const CAT_ICONS = {
  'Tintas':    Droplet,
  'Cartuchos': PenTool,
  'Agujas':    Crosshair,
  'Maquinas':  Drill,
  'Guantes':   Hand,
  'Cuidados':  ShieldCheck,
  'Fuentes':   PlugZap,
  'Accesorios':Toolbox,
  'Muebles':   BedDouble,
  'Combos':    Package,
}

const AFILIADO_COPY = {
  'Tintas': {
    badge: 'Importación internacional · bajo pedido',
    title: 'Las mismas marcas — traídas directamente del exterior',
    desc:  'Eternal, Intenze, World Famous y más: las mismas marcas de referencia que usas o quieres usar, pero importadas. No están en el mercado local — se gestionan bajo pedido y llegan a Colombia con envío incluido.',
  },
  'Cartuchos': {
    badge: 'Importación internacional · bajo pedido',
    title: 'Cartuchos de marcas internacionales, traídos para ti',
    desc:  'Kwadron, EZ Tattoo, WJX y otros: marcas que no se consiguen fácil en Colombia. Se importan bajo pedido — mismos productos, diferente canal. Consulta disponibilidad y tiempos por WhatsApp.',
  },
  'Agujas': {
    badge: 'Importación internacional · bajo pedido',
    title: 'La configuración exacta que buscas, traída del exterior',
    desc:  'Si necesitas una configuración específica que no hay en el mercado local, estas se importan bajo pedido. Las mismas agujas, sin pasar por distribuidores colombianos.',
  },
  'Máquinas': {
    badge: 'Importación internacional · bajo pedido',
    title: 'Tu próxima rotativa, gestionada desde el exterior',
    desc:  'Equipos de marcas internacionales que raramente llegan al mercado colombiano. Se importan bajo pedido con asesoría incluida — el equipo de INKognito te orienta en la elección antes de confirmar.',
  },
  'Guantes': {
    badge: 'Importación internacional · bajo pedido',
    title: 'Bioseguridad de grado médico, importada directamente',
    desc:  'Los mismos guantes nitrilo que usan estudios de referencia internacional, disponibles para importar en volumen. Calidad certificada que no siempre circula en el mercado local.',
  },
  'Cuidados': {
    badge: 'Importación internacional · bajo pedido',
    title: 'Aftercare de primer nivel, traído directamente',
    desc:  'Cremas y protectores de las marcas que recomiendan tatuadores de referencia fuera del país. Se importan bajo pedido — los mismos productos que ves en referentes internacionales, sin intermediarios locales.',
  },
  'Fuentes': {
    badge: 'Importación internacional · bajo pedido',
    title: 'Fuentes de marcas internacionales, bajo pedido',
    desc:  'Si buscas una fuente específica que no encuentras en Colombia, se puede importar. Consulta disponibilidad y tiempos de entrega por WhatsApp antes de confirmar el pedido.',
  },
  'Accesorios': {
    badge: 'Importación internacional · bajo pedido',
    title: 'Accesorios de estudio que no llegan al mercado local',
    desc:  'Organizadores, racks y accesorios de marcas internacionales que no circulan en Colombia. Importados bajo pedido según lo que necesites para completar tu set.',
  },
  'Muebles': {
    badge: 'Importación internacional · bajo pedido',
    title: 'Mobiliario de estándar internacional, importado',
    desc:  'Camillas y mobiliario profesional de nivel internacional, disponibles para importar. Los tiempos de entrega son mayores que el stock local — consulta condiciones antes de pedir.',
  },
  'Combos': {
    badge: 'Importación internacional · bajo pedido',
    title: 'Sets completos de marcas internacionales, bajo pedido',
    desc:  'Combos de equipos y consumibles que no se arman con lo que hay en el mercado local. Se gestionan desde el exterior — ideal para quien quiere escalar con marcas de referencia internacional.',
  },
}

const WA = '573207911013'
const VAR_THRESHOLD = 3

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

function VariantSelectorSupply({ variantObjs, selIdx, onChange }) {
  const [open, setOpen] = useState(false)
  if (!variantObjs || variantObjs.length <= 1) return null

  if (variantObjs.length <= VAR_THRESHOLD) {
    return (
      <div className="grid gap-1 w-full" style={{ gridTemplateColumns: `repeat(${variantObjs.length}, 1fr)` }}>
        {variantObjs.map((v, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`text-[9px] font-bold py-1 rounded border transition-all duration-200 text-center truncate ${
              selIdx === i
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-zinc-700 text-zinc-500 hover:border-blue-400 hover:text-white'
            }`}
          >
            {v.variant}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-1.5 px-2 rounded border border-zinc-700 text-[9px] font-bold text-zinc-300 hover:border-blue-400 transition-all duration-200"
      >
        <span className="truncate">{variantObjs[selIdx]?.variant || '—'}</span>
        <span className={`ml-1 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>▶</span>
      </button>
      {open && (
        <div className="mt-1 grid grid-cols-2 gap-1">
          {variantObjs.map((v, i) => (
            <button
              key={i}
              onClick={() => { onChange(i); setOpen(false) }}
              className={`text-[9px] font-bold py-1.5 px-1 rounded border transition-all duration-200 text-center truncate ${
                selIdx === i
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-zinc-700 text-zinc-500 hover:border-blue-400 hover:text-white'
              }`}
            >
              {v.variant}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ProductCard({ item, categoria }) {
  const { addItem } = useSupplyCart()
  const [selIdx, setSelIdx] = useState(0)
  const [added, setAdded]   = useState(false)

  const variantObjs = item.variantes?.filter(v => v.variant) ?? []
  const totalStock  = item.variantes?.reduce((s, v) => s + (v.stock || 0), 0) ?? 0
  const sel         = variantObjs[selIdx] || variantObjs[0] || {}

  const resolvedPrice = sel.price
    ? '$' + Math.round(sel.price).toLocaleString('es-CO')
    : null
  const activeImage = sel.image_url || item.image_url || null

  const handleAdd = () => {
    addItem({
      id:    item.name + (sel.variant ? '-' + sel.variant : ''),
      name:  item.name + (sel.variant ? ` (${sel.variant})` : ''),
      price: resolvedPrice || '—',
      brand: item.descripcion || item.categoria || '',
      image: activeImage || '',
    }, categoria)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="border border-blue-500/40 bg-zinc-950 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300 flex flex-col h-full">

      <div className="aspect-square w-full bg-zinc-900 overflow-hidden flex-shrink-0">
        {activeImage ? (
          <img
            key={activeImage}
            src={activeImage}
            alt={`${item.name}${sel.variant ? ' ' + sel.variant : ''}`}
            className="w-full h-full object-cover transition-opacity duration-200"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-zinc-700 uppercase tracking-[0.3em] text-[10px] text-center px-3">{item.name}</p>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1 gap-1.5 min-h-0">
        {item.descripcion && (
          <p className="text-zinc-500 uppercase tracking-[0.2em] text-[9px] leading-none">{item.descripcion}</p>
        )}
        <h3 className="text-xs font-black uppercase leading-tight text-white">{item.name}</h3>
        {resolvedPrice && <p className="text-white font-bold text-sm">{resolvedPrice}</p>}
        {totalStock <= 3 && totalStock > 0 && (
          <p className="text-yellow-500 text-[9px] font-bold">⚠️ Últimas {totalStock}</p>
        )}
        <div className="mt-auto pt-1">
          <VariantSelectorSupply variantObjs={variantObjs} selIdx={selIdx} onChange={setSelIdx} />
        </div>
      </div>

      <button
        onClick={handleAdd}
        className={`w-full py-2.5 font-bold uppercase tracking-[0.1em] text-[10px] flex-shrink-0 transition-all duration-300 ${
          added ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {added ? '✓ Agregado' : '+ Agregar al carrito'}
      </button>
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

function AfiliadoCard({ item }) {
  const url = item.url_ventas || item.url_checkout || null
  const inner = (
    <div className="border border-blue-500/20 bg-zinc-950 rounded-2xl overflow-hidden flex flex-col h-full hover:border-blue-500/50 hover:shadow-[0_0_16px_rgba(59,130,246,0.12)] transition-all duration-300">
      <div className="aspect-square w-full bg-zinc-900 overflow-hidden flex-shrink-0 flex items-center justify-center">
        {item.image_url
          ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
          : <ExternalLink size={32} className="text-zinc-700" strokeWidth={1} />
        }
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <span className="text-[9px] font-black uppercase tracking-widest text-blue-400/70">Importación internacional{item.plataforma ? ` · ${item.plataforma}` : ''}</span>
        <h3 className="text-xs font-black uppercase leading-tight text-white">{item.name}</h3>
        {item.descripcion && (
          <p className="text-zinc-500 text-[10px] leading-relaxed flex-1">{item.descripcion}</p>
        )}
        {url && (
          <span className="mt-auto pt-1 text-[9px] font-bold uppercase tracking-widest text-blue-400 flex items-center gap-1">
            Ver recurso <ExternalLink size={9} />
          </span>
        )}
      </div>
    </div>
  )
  return url
    ? <a href={url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 w-[44vw] md:w-auto snap-start">{inner}</a>
    : <div className="flex-shrink-0 w-[44vw] md:w-auto snap-start">{inner}</div>
}


export default function SupplyCategoryPage({ title, categoria, slug, desc, intro, guide, faqs }) {
  const { allProducts: allProds, loading } = useCatalog('supply', categoria)
  const products  = allProds.filter(p => !p.tipo || p.tipo === 'fisico')
  const afiliados = allProds.filter(p => p.tipo === 'afiliado')
  const CatIcon = CAT_ICONS[categoria] || null
  const { prev, next } = getAdjacentCategories(slug)
  const scrolled = useScrolled()

  return (
    <>
      <Seo
        title={`${title} para tatuadores en Urabá | INKognito Supply — Chigorodó`}
        description={desc || `${title} profesionales para tatuadores en Chigorodó, Urabá. Stock real y envíos a toda la región. Pedidos por WhatsApp.`}
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/${slug}`}
      />
      <NavbarCategory pageName={title} backPath="/supply" backLabel="Supply" />

      {scrolled && prev && (
        <Link
          to={`/supply/${prev.slug}`}
          aria-label={`Ver ${prev.name}`}
          className="fixed top-16 md:top-20 left-2 md:left-4 z-40 text-zinc-400 hover:text-white bg-black/60 backdrop-blur-sm border border-zinc-800 rounded-full p-2 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
      )}
      {scrolled && next && (
        <Link
          to={`/supply/${next.slug}`}
          aria-label={`Ver ${next.name}`}
          className="fixed top-16 md:top-20 right-2 md:right-4 z-40 text-zinc-400 hover:text-white bg-black/60 backdrop-blur-sm border border-zinc-800 rounded-full p-2 transition-colors"
        >
          <ArrowRight size={20} />
        </Link>
      )}

      <div className="bg-gray-950 pt-16 md:pt-24">

        {/* HERO — H1 + ícono de categoría en móvil */}
        <div className="relative overflow-hidden px-6 max-w-7xl mx-auto pb-5 md:pb-10">
          <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
          <div className="relative z-10 flex items-center gap-3 mb-4">
            {prev && (
              <Link
                to={`/supply/${prev.slug}`}
                aria-label={`Ver ${prev.name}`}
                className="flex-shrink-0 text-zinc-500 hover:text-white transition-colors"
              >
                <ArrowLeft size={24} />
              </Link>
            )}
            <div className="flex-1 flex items-center justify-center gap-3">
              <h1 className="text-xl md:text-4xl font-black uppercase tracking-tight leading-none text-white text-center whitespace-nowrap">{title}</h1>
              {CatIcon && (
                <CatIcon size={48} className="text-zinc-800 flex-shrink-0 md:hidden" strokeWidth={1} />
              )}
            </div>
            {next && (
              <Link
                to={`/supply/${next.slug}`}
                aria-label={`Ver ${next.name}`}
                className="flex-shrink-0 text-zinc-500 hover:text-white transition-colors"
              >
                <ArrowRight size={24} />
              </Link>
            )}
          </div>
          {intro && (
            <p className="relative z-10 text-zinc-400 text-base md:text-lg leading-relaxed max-w-3xl">{intro}</p>
          )}
        </div>

        {/* PRODUCTOS FÍSICOS — scroll horizontal en móvil, grid en desktop */}
        <div className="pb-10 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex gap-4 px-6 overflow-x-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[44vw] md:w-48">
                  <SkeletonCard />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="mx-6 border border-blue-500/20 bg-zinc-950 rounded-2xl p-10 text-center">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Sin stock por el momento</p>
              <p className="text-white text-lg font-black uppercase mb-2">Próximamente disponible</p>
              <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">
                Déjanos tu número y te avisamos cuando tengamos {title.toLowerCase()} disponibles. Sé el primero en saber.
              </p>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hola, quiero que me avisen cuando haya ${title} disponibles en INKognito Supply.`)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold uppercase tracking-[0.15em] text-sm rounded hover:bg-blue-600 transition"
              >
                <FaWhatsapp size={18} />
                Avisarme cuando haya stock →
              </a>
            </div>
          ) : (
            <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory -mx-0 px-6 md:px-6 pb-3 md:pb-0 scrollbar-hide">
              {products.map(item => (
                <div key={item.name} className="snap-start flex-shrink-0 w-[44vw] md:w-auto">
                  <ProductCard item={item} categoria={categoria} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RECURSOS DIGITALES AFILIADOS — sección fija, siempre visible */}
        {!loading && (() => {
          const copy = AFILIADO_COPY[categoria] || { badge: `Recursos para ${title.toLowerCase()}`, title: 'Lleva tu técnica al siguiente nivel', desc: `Selección curada para dominar ${title.toLowerCase()}.` }
          return (
          <div className="pb-10 max-w-7xl mx-auto px-6">
            <div className="border-t-2 border-blue-500/20 pt-8 mb-6">
              <p className="text-blue-400/70 text-[10px] font-bold uppercase tracking-widest mb-1">✦ {copy.badge}</p>
              <h2 className="text-xl md:text-2xl font-black uppercase leading-none text-white">
                {copy.title}
              </h2>
              <p className="text-zinc-500 text-sm mt-2 max-w-lg leading-relaxed">
                {copy.desc}
              </p>
            </div>
            {afiliados.length > 0 ? (
              <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-3 md:pb-0 scrollbar-hide">
                {afiliados.map(item => (
                  <AfiliadoCard key={item.name} item={item} />
                ))}
              </div>
            ) : (
              <div className="border border-blue-500/20 bg-zinc-950 rounded-2xl p-6 text-center">
                <p className="text-zinc-500 text-sm mb-4 max-w-sm mx-auto">
                  Aún no tenemos activo el canal de importación para {title.toLowerCase()}. Avísanos y te contactamos en cuanto esté disponible — gestionamos el pedido desde el exterior.
                </p>
                <a
                  href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hola, quiero que me avisen cuando haya ${title} disponibles en INKognito Supply.`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white font-bold uppercase tracking-[0.15em] text-xs rounded hover:bg-blue-600 transition"
                >
                  <FaWhatsapp size={16} />
                  Avisarme cuando haya stock →
                </a>
              </div>
            )}
          </div>
          )
        })()}


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
