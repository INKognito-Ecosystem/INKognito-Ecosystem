import { Link } from 'react-router'
import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import GymMobileNav from '../GymMobileNav'
import { PlayCircle, ArrowLeft, ArrowRight, ExternalLink, FileText, Wrench } from 'lucide-react'
import { getAdjacentCategories } from '../../../data/gymCategoriesOrder'

const GRID_PATTERN = {
  backgroundImage:
    'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(24,24,27,1) 39px,rgba(24,24,27,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(24,24,27,1) 39px,rgba(24,24,27,1) 40px)',
}

export function meta() {
  const title = 'Cómo Fabricar Máquinas de Gym | Tutoriales Profesionales — Colombia'
  const description = 'Videos de fabricación de equipos de gym: mancuernas, discos, barras y máquinas. Canal de Jose Humanez en YouTube.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/gym/tutoriales` },
  ]
}

const VIDEOS = [
  {
    id: 1,
    num: '01',
    categoria: 'Discos',
    titulo: 'Cómo hacer discos de cemento caseros',
    resumen: 'Moldes, mezcla y acabado para fabricar discos resistentes y parejos desde casa.',
    src: 'https://www.youtube.com/embed/eSFDi483lGc',
  },
  {
    id: 2,
    num: '02',
    categoria: 'Mancuernas',
    titulo: 'Mancuernas caseras de cemento — Timelapse',
    resumen: 'Vista rápida del proceso completo de armado, vaciado y secado de mancuernas.',
    src: 'https://www.youtube.com/embed/-kyLJpmBtn0',
  },
  {
    id: 3,
    num: '03',
    categoria: 'Tren inferior',
    titulo: 'Aparato casero para fortalecer el tibial anterior',
    resumen: 'Construcción práctica de un accesorio específico para pierna, tobillo y rodilla.',
    src: 'https://www.youtube.com/embed/ChCrs-vKvdA',
  },
  {
    id: 4,
    num: '04',
    categoria: 'Mancuernas',
    titulo: 'Cómo hacer mancuernas de cemento — Tutorial explicado',
    resumen: 'Paso a paso detallado con materiales económicos y consejos para que queden firmes.',
    src: 'https://www.youtube.com/embed/7KPO3MGvrzY',
  },
  {
    id: 5,
    num: '05',
    categoria: 'Estructura',
    titulo: 'Rack casero de madera para pesas',
    resumen: 'Cómo organizar tus discos y barras con un soporte sólido hecho a mano.',
    src: 'https://www.youtube.com/embed/6pe_x5fqYOM',
  },
]

export default function VideosTutorialesPage() {
  const { prev, next } = getAdjacentCategories('tutoriales')

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <NavbarGym />

      {/* HERO EDITORIAL */}
      <section className="relative pt-20 md:pt-28 pb-10 md:pb-14 px-4 md:px-6 border-b border-zinc-200 overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={GRID_PATTERN} />
        <div className="relative z-10 max-w-7xl mx-auto">
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
              <PlayCircle size={13} /> INKognito Gym System · Tutoriales
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

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.98] text-zinc-900">
                Tutoriales <span className="text-zinc-400">en video</span>
              </h1>
              <p className="mt-4 text-zinc-600 text-sm md:text-base leading-relaxed">
                Aprende paso a paso cómo construir tus propios equipos caseros con materiales accesibles: discos, mancuernas, racks y accesorios probados en entrenamiento real. Todos los videos son gratuitos y se reproducen directo desde YouTube.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-700">
                  {VIDEOS.length} videos paso a paso
                </span>
                <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-700">
                  100% gratis
                </span>
                <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-700">
                  Sin registro
                </span>
              </div>
            </div>

            <a
              href="https://www.youtube.com/@JhumanezZ"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center justify-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-[0.18em] py-3.5 px-6 rounded-xl transition-colors"
            >
              Ver canal en YouTube <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* GRID DE VIDEOS */}
      <section className="py-10 md:py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VIDEOS.map((v) => (
            <article
              key={v.id}
              className="border border-zinc-200 bg-white rounded-2xl overflow-hidden flex flex-col hover:border-zinc-900 hover:shadow-md transition-all duration-300"
            >
              <div className="relative w-full aspect-video bg-zinc-950">
                <iframe
                  src={v.src}
                  title={v.titulo}
                  className="w-full h-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    {v.categoria}
                  </span>
                  <span className="text-[11px] font-black tracking-[0.16em] text-zinc-300">
                    {v.num}
                  </span>
                </div>
                <h2 className="font-black uppercase text-sm md:text-base leading-snug text-zinc-900">
                  {v.titulo}
                </h2>
                <p className="mt-2 text-xs md:text-sm text-zinc-600 leading-relaxed">
                  {v.resumen}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SIGUIENTE PASO */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 flex flex-col justify-between gap-5">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">
                <FileText size={13} /> Fabricación con medidas exactas
              </span>
              <h2 className="text-xl md:text-2xl font-black uppercase text-zinc-900 mt-2">
                ¿Prefieres fabricar con planos técnicos?
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed mt-2">
                En nuestra membresía de Planos PDF encuentras cortes, medidas exactas y lista de materiales para construir máquinas metálicas completas.
              </p>
            </div>
            <Link
              to="/gym#planos"
              className="inline-flex items-center justify-center gap-2 self-start border border-zinc-300 hover:border-zinc-900 text-zinc-900 text-xs font-bold uppercase tracking-[0.16em] px-5 py-3 rounded-xl transition-colors"
            >
              Ver planos digitales <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-zinc-950 text-white rounded-2xl p-6 md:p-8 flex flex-col justify-between gap-5">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">
                <Wrench size={13} /> Acero estructural Cal. 14
              </span>
              <h2 className="text-xl md:text-2xl font-black uppercase mt-2">
                ¿Quieres tu máquina ya fabricada?
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed mt-2">
                Si prefieres recibir el equipo listo y soldado profesionalmente, explora el catálogo de máquinas bajo pedido con envíos a toda Colombia.
              </p>
            </div>
            <Link
              to="/gym/maquinas-pedido"
              className="inline-flex items-center justify-center gap-2 self-start bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-black uppercase tracking-[0.16em] px-5 py-3 rounded-xl transition-colors"
            >
              Explorar máquinas <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <FooterGym />
      <div className="h-16 md:hidden" />
      <GymMobileNav />
    </div>
  )
}
