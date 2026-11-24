import { Link, useLoaderData } from 'react-router'
import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import GymMobileNav from '../GymMobileNav'
import { fetchCatalogPage } from '../../../hooks/useCatalog'
import GymMaquinaCard from '../GymMaquinaCard'
import { Wrench, ExternalLink, ArrowLeft, ArrowRight, ShieldCheck, Clock, Truck, Store } from 'lucide-react'
import { getAdjacentCategories } from '../../../data/gymCategoriesOrder'
import CategoriaVaciaCard from '../../CategoriaVaciaCard'

const WA = '573207911013'

const GRID_PATTERN = {
  backgroundImage:
    'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(24,24,27,1) 39px,rgba(24,24,27,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(24,24,27,1) 39px,rgba(24,24,27,1) 40px)',
}

const SPECS = [
  {
    icon: ShieldCheck,
    label: 'Estructura industrial',
    value: 'Acero estructural Cal. 14 con soldadura profesional.',
  },
  {
    icon: Clock,
    label: 'Fabricación a medida',
    value: '~30 días calendario. Eliges pintura (negro o gris) y tubo (1" o 2").',
  },
  {
    icon: Truck,
    label: 'Envío a toda Colombia',
    value: 'Armadas en Urabá · Desarmadas listas para armar al resto del país.',
  },
]

const PASOS_PEDIDO = [
  {
    num: '01',
    titulo: 'Elige tu máquina',
    texto: 'Revisa fotos, precio y ficha técnica. En el pedido eliges el color de pintura y el tipo de tubo para discos.',
  },
  {
    num: '02',
    titulo: 'Fabricamos en taller',
    texto: 'Construimos tu equipo desde cero en Chigorodó, Urabá, en un plazo estimado de 30 días calendario.',
  },
  {
    num: '03',
    titulo: 'Despacho y entrega',
    texto: 'Entregamos armada en la zona de Urabá o embalada y lista para armar con envío a cualquier ciudad de Colombia.',
  },
]

export async function loader() {
  const [maquinasPage, afiliadosPage] = await Promise.all([
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

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <NavbarGym />

      {/* HERO EDITORIAL */}
      <section className="relative pt-20 md:pt-28 pb-10 md:pb-14 px-4 md:px-6 border-b border-zinc-200 overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={GRID_PATTERN} />
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Navegación entre categorías */}
          <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-100">
            {prev ? (
              <Link
                to={`/gym/${prev.slug}`}
                replace
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <ArrowLeft size={15} />
                <span className="hidden sm:inline">{prev.name}</span>
              </Link>
            ) : <span />}
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">
              <Wrench size={13} /> INKognito Gym System · Catálogo
            </span>
            {next ? (
              <Link
                to={`/gym/${next.slug}`}
                replace
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <span className="hidden sm:inline">{next.name}</span>
                <ArrowRight size={15} />
              </Link>
            ) : <span />}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.98] text-zinc-900">
                Máquinas <span className="text-zinc-400">bajo pedido</span>
              </h1>
              <p className="mt-4 text-zinc-600 text-sm md:text-base leading-relaxed">
                Cada máquina sale de nuestro taller en Chigorodó, fabricada a mano con acero calibre grueso y soldadura profesional, lista para entrenamiento intenso diario en casa o gimnasio.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                to="/gym/inkognito-gym-equipment"
                className="inline-flex items-center gap-2 border border-zinc-300 bg-white text-zinc-800 hover:border-zinc-900 hover:text-zinc-900 text-xs font-bold uppercase tracking-[0.16em] px-4 py-3 rounded-xl transition-colors"
              >
                <Store size={14} /> Tienda oficial
              </Link>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero cotizar una máquina de gym bajo pedido.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-[0.16em] px-5 py-3 rounded-xl transition-colors"
              >
                Cotizar a medida
              </a>
            </div>
          </div>

          {/* 3 especificaciones clave */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {SPECS.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shrink-0 text-zinc-800">
                    <Icon size={17} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-900">{s.label}</p>
                    <p className="text-xs text-zinc-600 leading-relaxed mt-1">{s.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CATÁLOGO DE MÁQUINAS */}
      <section className="py-10 md:py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 md:mb-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400">Modelos disponibles</p>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-900 mt-1">
              Elige tu equipo
            </h2>
          </div>
          {apiMaquinas.length > 0 && (
            <span className="inline-flex items-center self-start sm:self-auto px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-700">
              {apiMaquinas.length} {apiMaquinas.length === 1 ? 'modelo' : 'modelos'}
            </span>
          )}
        </div>

        {apiMaquinas.length === 0 ? (
          <div className="border border-zinc-200 bg-zinc-50 rounded-2xl py-16 px-6 text-center">
            <p className="text-zinc-500 uppercase tracking-[0.25em] text-sm font-bold mb-2">Catálogo en preparación</p>
            <p className="text-zinc-500 text-sm mb-6 max-w-md mx-auto">
              Estamos cargando las máquinas disponibles. Mientras tanto, escríbenos por WhatsApp y te enviamos fotos y precios al instante.
            </p>
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero consultar disponibilidad de máquinas de gym bajo pedido.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-zinc-900 text-white font-bold uppercase tracking-[0.15em] text-xs rounded-xl hover:bg-zinc-800 transition"
            >
              Consultar por WhatsApp →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {apiMaquinas.map((item) => (
              <GymMaquinaCard key={item.name} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* CÓMO FUNCIONA EL PEDIDO */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400">Proceso transparente</p>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-900 mt-1">
              ¿Cómo funciona tu pedido?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {PASOS_PEDIDO.map((p) => (
              <div key={p.num} className="bg-white border border-zinc-200 rounded-2xl p-6">
                <span className="text-xs font-black tracking-[0.2em] text-zinc-400">{p.num}</span>
                <h3 className="text-base font-black uppercase text-zinc-900 mt-2">{p.titulo}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed mt-2">{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PIEZAS Y MATERIALES — sección fija, siempre visible */}
      <section className="border-t border-zinc-200 bg-white px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-8">
            <p className="text-amber-700 text-[11px] font-bold uppercase tracking-[0.22em] mb-1">
              ✦ Componentes recomendados
            </p>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-900">
              Piezas y materiales para fabricar
            </h2>
            <p className="text-zinc-600 text-sm md:text-base mt-2 leading-relaxed">
              Ruedas, poleas, cables y accesorios verificados en AliExpress y Mercado Libre con envío a toda Colombia para que armes o mejores tu propio equipo sin improvisar.
            </p>
          </div>
          {gymAfiliados.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gymAfiliados.map((item, i) => {
                const url = item.url_ventas || item.url_checkout || null
                const inner = (
                  <div className="border border-zinc-200 bg-white rounded-2xl overflow-hidden flex flex-col h-full hover:border-zinc-900 hover:shadow-md transition-all duration-300">
                    <div className="aspect-square w-full bg-zinc-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.image_url
                        ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                        : <ExternalLink size={28} className="text-zinc-300" strokeWidth={1} />
                      }
                    </div>
                    <div className="p-4 flex flex-col gap-1.5 flex-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                        {item.plataforma || item.categoria || 'Externo'}
                      </span>
                      <h3 className="text-xs md:text-sm font-black uppercase leading-snug text-zinc-900">{item.name}</h3>
                      {item.descripcion && (
                        <p className="text-zinc-500 text-xs leading-relaxed flex-1 line-clamp-3">{item.descripcion}</p>
                      )}
                      {url && (
                        <span className="mt-auto pt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-900 flex items-center gap-1">
                          Ver producto <ExternalLink size={11} />
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
            <CategoriaVaciaCard className="border border-zinc-200 bg-zinc-50" />
          )}
        </div>
      </section>

      <FooterGym />
      <div className="h-16 md:hidden" />
      <GymMobileNav />
    </div>
  )
}
