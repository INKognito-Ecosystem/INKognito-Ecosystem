import { useState } from 'react'
import NavbarCategory from './NavbarCategory'
import FooterSupply from './FooterSupply'
import Seo from '../Seo'
import { useCatalog } from '../../hooks/useCatalog'
import { useSupplyCart } from '../../contexts/SupplyCartContext'
import { FaWhatsapp } from 'react-icons/fa'
import { ExternalLink, Droplet, PenTool, Crosshair, Drill, Hand, ShieldCheck, PlugZap, Toolbox, BedDouble, Package } from 'lucide-react'

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
    badge: 'Importa directamente y ahorra',
    title: 'Tinta de nivel internacional al precio que debería ser',
    desc:  'Marcas como Eternal, Intenze y World Famous disponibles desde Amazon con envío a Colombia. Para quien no quiere pagar el sobreprecio local pero sí quiere calidad real. ¿Prefieres tenerlas ya en mano en Urabá? INKognito Supply te cubre.',
  },
  'Cartuchos': {
    badge: 'Los que usan los que ya cobran bien',
    title: 'El cartucho que no te falla a mitad de sesión',
    desc:  'Membrana precisa, aguja consistente, entrada limpia. Marcas internacionales disponibles para importar directo desde Amazon. Porque un cartucho barato te cobra la sesión en reprocesos.',
  },
  'Agujas': {
    badge: 'La configuración exacta que necesitas',
    title: 'Cada técnica exige su aguja — aquí están todas',
    desc:  'Desde liner fino hasta magnum curvo: configuraciones específicas que no siempre están en el mercado local. Importa lo que necesitas, cuando lo necesitas.',
  },
  'Máquinas': {
    badge: 'Equipos internacionales al precio real',
    title: 'Tu próxima rotativa, sin pasar por tres intermediarios',
    desc:  'Máquinas de marcas reconocidas disponibles directamente desde distribuidores. Compara antes de decidir. Si quieres orientación personalizada, el equipo de INKognito te asesora por WhatsApp.',
  },
  'Guantes': {
    badge: 'Volumen sin excusas',
    title: 'El precio por unidad que deberías estar pagando',
    desc:  'Cajas de guantes nitrilo grado médico desde Amazon. Cuando compras en cantidad, el ahorro es real. Sin excusas para saltarse la protección básica.',
  },
  'Cuidados': {
    badge: 'El aftercare que los internacionales ya usan',
    title: 'Cuida el trabajo tan bien como lo hiciste',
    desc:  'Cremas de cicatrización, protector solar y aftercare de las marcas que recomiendan tatuadores de referencia. Disponibles para importar con envío a Colombia.',
  },
  'Fuentes': {
    badge: 'Estabilidad que se nota en el trazo',
    title: 'Una buena fuente no se reemplaza — invierte bien',
    desc:  'Fuentes digitales con voltaje estable y pantalla LED de marcas confiables en Amazon. Mejor precio que el mercado local y la tranquilidad de saber que tu máquina recibe lo que necesita.',
  },
  'Accesorios': {
    badge: 'Los detalles que completan un set profesional',
    title: 'Un workspace de pro no improvisa',
    desc:  'Porta cartuchos, racks, organizadores y todo lo que hace que tu estudio funcione limpio y eficiente. Disponibles para importar — porque el orden también es parte del servicio.',
  },
  'Muebles': {
    badge: 'El ambiente también vende',
    title: 'Un estudio que dice "esto es en serio"',
    desc:  'Camillas, sillas ergonómicas y mobiliario profesional disponibles para importar. Los clientes notan el espacio antes de notar la máquina. Dale al tuyo el nivel que merece.',
  },
  'Combos': {
    badge: 'Todo en un solo pedido',
    title: 'El kit para arrancar o escalar sin dar vueltas',
    desc:  'Sets de equipos curados para quien empieza o para quien quiere actualizar todo de una. Un solo pedido bien hecho vale más que diez compras improvisadas.',
  },
}

const WA = '573207911013'
const VAR_THRESHOLD = 3

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(113,113,122,1) 1px, transparent 1px)',
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
        <span className="text-[9px] font-black uppercase tracking-widest text-blue-400/70">Recurso digital{item.plataforma ? ` · ${item.plataforma}` : ''}</span>
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
  const { allProducts: allProds, loading } = useCatalog('supply', categoria)
  const products  = allProds.filter(p => !p.tipo || p.tipo === 'fisico')
  const afiliados = allProds.filter(p => p.tipo === 'afiliado')
  const CatIcon = CAT_ICONS[categoria] || null

  return (
    <>
      <Seo
        title={`${title} para tatuadores en Urabá | INKognito Supply — Chigorodó`}
        description={desc || `${title} profesionales para tatuadores en Chigorodó, Urabá. Stock real y envíos a toda la región. Pedidos por WhatsApp.`}
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/${slug}`}
      />
      <NavbarCategory pageName={title} backPath="/supply" backLabel="Supply" />

      <div className="bg-black pt-16 md:pt-24">

        {/* HERO — H1 + ícono de categoría en móvil */}
        <div className="relative overflow-hidden px-6 max-w-7xl mx-auto pb-5 md:pb-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900" />
          <div className="absolute inset-0 opacity-[0.09]" style={DOT_PATTERN} />
          <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
            <h1 className="text-3xl md:text-7xl font-black uppercase leading-none text-white">{title}</h1>
            {CatIcon && (
              <CatIcon size={64} className="text-zinc-800 flex-shrink-0 md:hidden" strokeWidth={1} />
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
                  Aún no tenemos un link de importación activo para {title.toLowerCase()}. Avísanos y te contactamos apenas esté disponible.
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
