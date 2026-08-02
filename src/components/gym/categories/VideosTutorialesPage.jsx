import { Link } from 'react-router-dom'
import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import { PlayCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { getAdjacentCategories } from '../../../data/gymCategoriesOrder'
import { useScrolled } from '../../../hooks/useScrolled'

export function meta() {
  const title = 'Cómo Fabricar Máquinas de Gym | Tutoriales Profesionales — Colombia'
  const description = 'Videos de fabricación de equipos de gym con soldadura: mancuernas, discos, barras y máquinas. Canal de Jose Humanez en YouTube.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/gym/tutoriales` },
  ]
}

const videos = [
  {
    id: 1,
    titulo: 'Cómo hacer discos de cemento caseros',
    src: 'https://www.youtube.com/embed/eSFDi483lGc',
  },
  {
    id: 2,
    titulo: 'Mancuernas caseras de cemento — Timelapse',
    src: 'https://www.youtube.com/embed/-kyLJpmBtn0',
  },
  {
    id: 3,
    titulo: 'Aparato casero para fortalecer el tibial anterior',
    src: 'https://www.youtube.com/embed/ChCrs-vKvdA',
  },
  {
    id: 4,
    titulo: 'Cómo hacer mancuernas de cemento — Tutorial explicado',
    src: 'https://www.youtube.com/embed/7KPO3MGvrzY',
  },
  {
    id: 5,
    titulo: 'Rack casero de madera para pesas',
    src: 'https://www.youtube.com/embed/6pe_x5fqYOM',
  },
]

export default function VideosTutorialesPage() {
  const { prev, next } = getAdjacentCategories('tutoriales')
  const scrolled = useScrolled()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavbarGym />

      {scrolled && prev && (
        <Link
          to={`/gym/${prev.slug}`} replace
          aria-label={`Ver ${prev.name}`}
          className="fixed top-16 md:top-20 left-2 md:left-4 z-40 text-gray-400 hover:text-white bg-black/60 backdrop-blur-sm border border-gray-800 rounded-full p-2 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
      )}
      {scrolled && next && (
        <Link
          to={`/gym/${next.slug}`} replace
          aria-label={`Ver ${next.name}`}
          className="fixed top-16 md:top-20 right-2 md:right-4 z-40 text-gray-400 hover:text-white bg-black/60 backdrop-blur-sm border border-gray-800 rounded-full p-2 transition-colors"
        >
          <ArrowRight size={20} />
        </Link>
      )}

      {/* HERO */}
      <section className="relative pt-16 md:pt-24 pb-6 md:pb-10 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-0">
          <div className="flex items-center gap-3 mb-2">
            {prev && (
              <Link to={`/gym/${prev.slug}`} replace aria-label={`Ver ${prev.name}`} className="flex-shrink-0 text-gray-500 hover:text-white transition-colors">
                <ArrowLeft size={18} />
              </Link>
            )}
            <p className="flex-1 text-center uppercase tracking-[0.25em] text-gray-500 text-xs">Categoría</p>
            {next && (
              <Link to={`/gym/${next.slug}`} replace aria-label={`Ver ${next.name}`} className="flex-shrink-0 text-gray-500 hover:text-white transition-colors">
                <ArrowRight size={18} />
              </Link>
            )}
          </div>
          <div className="flex items-center justify-center md:justify-between gap-3 md:gap-4 mb-4">
            <h1 className="text-xl md:text-7xl font-black uppercase leading-tight md:leading-none text-center md:text-left">
              Tutoriales <span className="text-gray-400">en video</span>
            </h1>
            <PlayCircle size={40} className="text-gray-800 flex-shrink-0 md:hidden" strokeWidth={1} />
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <p className="text-gray-400 leading-relaxed max-w-2xl">
              Videos paso a paso de cómo construir equipos de gym caseros, con las mismas técnicas que uso yo — mancuernas, discos y máquinas hechas con materiales accesibles. Se reproducen directo desde YouTube, sin costo ni registro.
            </p>
            <a
              href="https://www.youtube.com/@JhumanezZ"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 border border-gray-700 text-gray-300 text-xs font-bold uppercase tracking-[0.2em] py-3 px-5 rounded hover:border-gray-400 hover:text-white transition-all duration-300"
            >
              Ver canal completo
            </a>
          </div>
        </div>
        </div>
      </section>

      <div className="pb-8 md:pb-14 px-4 md:px-6 max-w-7xl mx-auto pt-6 md:pt-8">
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
          {videos.map((v) => (
            <div
              key={v.id}
              className="snap-start flex-shrink-0 w-[70vw] md:w-auto border border-gray-800 bg-gray-800/40 rounded-xl overflow-hidden hover:border-gray-600 transition-all duration-300"
            >
              <div className="relative w-full aspect-video bg-gray-800">
                <iframe
                  src={v.src}
                  title={v.titulo}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-2 md:p-3">
                <h3 className="font-black uppercase text-[10px] md:text-xs leading-tight">{v.titulo}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FooterGym />
    </div>
  )
}
