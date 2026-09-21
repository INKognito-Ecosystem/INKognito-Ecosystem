import { Link, useLoaderData } from 'react-router-dom'
import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import GymMobileNav from '../GymMobileNav'
import { fetchCatalogPage } from '../../../hooks/useCatalog'
import GymMaquinaCard from '../GymMaquinaCard'
import { Wrench, ExternalLink, ArrowLeft, ArrowRight } from 'lucide-react'
import { getAdjacentCategories } from '../../../data/gymCategoriesOrder'
import { useScrolled } from '../../../hooks/useScrolled'

import CategoriaVaciaCard from '../../CategoriaVaciaCard'
const WA = '573207911013'

const GRID_PATTERN = {
  backgroundImage:
    'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(24,24,27,1) 39px,rgba(24,24,27,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(24,24,27,1) 39px,rgba(24,24,27,1) 40px)',
}

// Paginación real (2026-09-14) — antes traía TODO gym (fetchCatalogFull)
// solo para filtrar en JS por tipo/categoria; máquinas soldadas a pedido
// son contenido curado a mano (no inventario masivo), así que limit:100
// alcanza sin necesitar "cargar más" — mismo criterio que Cursos/Recursos.
export async function loader() {
  const [maquinasPage, afiliadosPage] = await Promise.all([
    // orden 'antiguos': las máquinas en el orden en que se crearon (banco
    // primero, las nuevas al final) — no "la última creada arriba".
    fetchCatalogPage('gym', { tipo: 'fisico', limit: 100, orden: 'antiguos' }),
    fetchCatalogPage('gym', { categoria: 'Materiales', tipo: 'afiliado', limit: 100 }),
  ])
  return { maquinas: maquinasPage.items, afiliadosMateriales: afiliadosPage.items }
}

export function meta() {
  const title = 'Máquinas de Gym Bajo Pedido | Soldadura Profesional — Colombia'
  const description = 'Máquinas de gym hechas a tu medida, con soldadura profesional. Banco multiángulo, jalones, hip thrust y más. Envíos a toda Colombia desde Urabá.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/gym/maquinas-pedido` },
  ]
}

export default function MaquinasPedidoPage() {
  const { maquinas: apiMaquinas, afiliadosMateriales: gymAfiliados } = useLoaderData()
  const { prev, next } = getAdjacentCategories('maquinas-pedido')
  const scrolled = useScrolled()

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <NavbarGym />

      {scrolled && prev && (
        <Link
          to={`/gym/${prev.slug}`} replace
          aria-label={`Ver ${prev.name}`}
          className="fixed top-16 md:top-20 left-2 md:left-4 z-40 text-zinc-600 hover:text-zinc-900 bg-white/80 backdrop-blur-sm border border-zinc-200 rounded-full p-2 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
      )}
      {scrolled && next && (
        <Link
          to={`/gym/${next.slug}`} replace
          aria-label={`Ver ${next.name}`}
          className="fixed top-16 md:top-20 right-2 md:right-4 z-40 text-zinc-600 hover:text-zinc-900 bg-white/80 backdrop-blur-sm border border-zinc-200 rounded-full p-2 transition-colors"
        >
          <ArrowRight size={20} />
        </Link>
      )}

      {/* HERO */}
      <section className="relative pt-16 md:pt-24 pb-6 md:pb-10 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={GRID_PATTERN} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            {prev && (
              <Link to={`/gym/${prev.slug}`} replace aria-label={`Ver ${prev.name}`} className="flex-shrink-0 text-zinc-500 hover:text-zinc-900 transition-colors">
                <ArrowLeft size={18} />
              </Link>
            )}
            <p className="flex-1 text-center uppercase tracking-[0.25em] text-zinc-500 text-xs">Categoría</p>
            {next && (
              <Link to={`/gym/${next.slug}`} replace aria-label={`Ver ${next.name}`} className="flex-shrink-0 text-zinc-500 hover:text-zinc-900 transition-colors">
                <ArrowRight size={18} />
              </Link>
            )}
          </div>
          <div className="flex items-center justify-center md:justify-between gap-3 md:gap-4 mb-4">
            <h1 className="text-xl md:text-7xl font-black uppercase leading-tight md:leading-none text-center md:text-left">
              Máquinas <span className="text-zinc-500">bajo pedido</span>
            </h1>
            <Wrench size={40} className="text-zinc-300 flex-shrink-0 md:hidden" strokeWidth={1} />
          </div>
          <p className="text-zinc-600 leading-relaxed max-w-2xl text-justify [hyphens:auto]">
            Cada máquina sale de Chigorodó, hecha a mano con soldadura profesional y acero calibre grueso, lista para uso intenso diario. La tuya puede llegar a cualquier rincón de Colombia — cuéntanos qué necesitas y dónde estás.
          </p>
        </div>
      </section>

      {/* GRID */}
      <div className="pb-10 md:pb-16 px-4 md:px-6 max-w-7xl mx-auto pt-6 md:pt-8">
        {apiMaquinas.length === 0 && (
          <div className="border border-zinc-200 bg-zinc-50 rounded-2xl py-16 text-center">
            <p className="text-zinc-500 uppercase tracking-[0.25em] text-sm mb-2">Catálogo en preparación</p>
            <p className="text-zinc-400 text-sm mb-6 max-w-sm mx-auto">Estamos cargando las máquinas disponibles. Mientras tanto, cuéntanos qué necesitas por WhatsApp.</p>
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero consultar disponibilidad de máquinas de gym bajo pedido.')}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-700 text-white font-bold uppercase tracking-[0.15em] text-xs rounded hover:bg-zinc-800 transition"
            >
              Consultar por WhatsApp →
            </a>
          </div>
        )}
        {/* Cuadrícula de 2 columnas en móvil, igual que los demás módulos
            (2026-09-21, Jose: "las cards ya no se muestran con scroll
            horizontal") — antes era una fila deslizable de cards de 46vw. */}
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ${apiMaquinas.length === 0 ? 'hidden' : ''}`}>
          {apiMaquinas.map((item) => (
            <GymMaquinaCard key={item.name} item={item} />
          ))}
        </div>
      </div>

      {/* ── PIEZAS Y MATERIALES — sección fija, siempre visible ── */}
      <section className="border-t-2 border-yellow-500/30 bg-zinc-50 px-4 md:px-6 py-10 md:py-14">
        <div className="max-w-7xl mx-auto">
          <p className="text-yellow-700 text-[10px] font-bold uppercase tracking-widest mb-1">✦ Lo que necesitas para construir, disponible hoy</p>
          <h2 className="text-2xl md:text-3xl font-black uppercase leading-none mb-2 text-zinc-900">
            Fabrica sin que te falte nada
          </h2>
          <p className="text-zinc-500 text-sm mb-8 max-w-lg leading-relaxed">
            Ruedas, poleas, cables y componentes disponibles en AliExpress y Mercado Libre con envío a toda Colombia. Material verificado para que no improvises ni pagues de más. Un gym propio empieza con las piezas correctas.
          </p>
          {gymAfiliados.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {gymAfiliados.map((item, i) => {
                const url = item.url_ventas || item.url_checkout || null
                const inner = (
                  <div className="border border-yellow-500/30 bg-white rounded-2xl overflow-hidden flex flex-col h-full hover:border-yellow-500/60 hover:shadow-md transition-all duration-300">
                    <div className="aspect-square w-full bg-zinc-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.image_url
                        ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                        : <ExternalLink size={28} className="text-zinc-300" strokeWidth={1} />
                      }
                    </div>
                    <div className="p-3 flex flex-col gap-1.5 flex-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-yellow-700">Recurso externo · {item.plataforma || item.categoria}</span>
                      <h3 className="text-xs font-black uppercase leading-tight text-zinc-900">{item.name}</h3>
                      {item.descripcion && (
                        <p className="text-zinc-500 text-[10px] leading-relaxed flex-1">{item.descripcion}</p>
                      )}
                      {url && (
                        <span className="mt-auto pt-1 text-[9px] font-bold uppercase tracking-widest text-yellow-700 flex items-center gap-1">
                          Ver producto <ExternalLink size={9} />
                        </span>
                      )}
                    </div>
                  </div>
                )
                return url
                  ? <a key={i} href={url} target="_blank" rel="noopener noreferrer">{inner}</a>
                  : <div key={i}>{inner}</div>
              })}
            </div>
          ) : (
            <CategoriaVaciaCard className="border border-yellow-500/30 bg-white" />
          )}
        </div>
      </section>

      <FooterGym />
      <div className="h-16 md:hidden" />
      <GymMobileNav />
    </div>
  )
}
