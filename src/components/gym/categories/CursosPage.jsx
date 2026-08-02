import { Link, useLoaderData } from 'react-router-dom'
import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import { GraduationCap, ArrowLeft, ArrowRight } from 'lucide-react'
import { fetchCatalogCategoriaItems } from '../../../hooks/useCatalog'
import { getAdjacentCategories } from '../../../data/gymCategoriesOrder'
import { useScrolled } from '../../../hooks/useScrolled'

const WA = '573207911013'

export async function loader() {
  return fetchCatalogCategoriaItems('gym', 'Cursos')
}

export function meta() {
  const title = 'Cursos de Entrenamiento en Casa y Fitness | Colombia'
  const description = 'Cursos recomendados de entrenamiento en casa, nutrición y desarrollo personal. Selección de los mejores cursos en español disponibles en Hotmart.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/gym/cursos` },
  ]
}

export default function CursosPage() {
  const { items: cursos } = useLoaderData()
  const { prev, next } = getAdjacentCategories('cursos')
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
              Cursos <span className="text-gray-400">recomendados</span>
            </h1>
            <GraduationCap size={40} className="text-gray-800 flex-shrink-0 md:hidden" strokeWidth={1} />
          </div>
          <p className="text-gray-400 leading-relaxed max-w-2xl">
            Selección de los mejores cursos en español para entrenarte en casa, mejorar tu alimentación y aprender a fabricar tus propios equipos — grabados por quienes ya viven de esto, para que aprendas a tu ritmo, sin salir de casa.
          </p>
        </div>
        </div>
      </section>

      <div className="pb-8 md:pb-14 px-4 md:px-6 max-w-7xl mx-auto pt-6 md:pt-8">
        {cursos.length > 0 ? (
          <div className="flex md:grid md:grid-cols-2 gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
            {cursos.map((curso) => {
              const url = curso.url_ventas || curso.url_checkout || '#'
              return (
                <div
                  key={curso.name}
                  className="snap-start flex-shrink-0 w-[72vw] md:w-auto border border-gray-800 bg-gray-800/40 rounded-2xl overflow-hidden flex flex-col hover:border-gray-600 transition-all duration-300"
                >
                  {curso.image_url && (
                    <div className="aspect-video w-full bg-gray-900 overflow-hidden flex-shrink-0">
                      <img src={curso.image_url} alt={curso.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-black uppercase tracking-wide leading-tight">{curso.name}</h3>
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest bg-orange-500/15 text-orange-400 border border-orange-500/30 rounded-full px-3 py-1">
                        {curso.plataforma || 'Hotmart'}
                      </span>
                    </div>
                    {curso.descripcion && (
                      <p className="text-gray-400 text-sm leading-relaxed flex-1">{curso.descripcion}</p>
                    )}
                    <a
                      href={url}
                      target="_blank" rel="noopener noreferrer"
                      className="mt-auto inline-block text-center border border-gray-600 text-gray-300 text-xs font-bold uppercase tracking-[0.2em] py-3 px-4 rounded-xl hover:border-gray-300 hover:text-white transition-all duration-300"
                    >
                      Ver curso →
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="border border-gray-800 bg-gray-800/40 rounded-2xl p-6 text-center">
            <p className="text-gray-400 text-sm mb-4 max-w-sm mx-auto">
              Aún no tenemos cursos cargados. Avísanos y te contactamos apenas tengamos opciones disponibles.
            </p>
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero que me avisen cuando haya cursos disponibles en INKognito Gym.')}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-gray-950 font-bold uppercase tracking-[0.15em] text-xs rounded hover:bg-orange-400 transition"
            >
              Avisarme cuando haya stock →
            </a>
          </div>
        )}
      </div>

      <FooterGym />
    </div>
  )
}
