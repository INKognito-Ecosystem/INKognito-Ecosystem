import { Link, useLoaderData } from 'react-router'
import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import GymMobileNav from '../GymMobileNav'
import { GraduationCap, ArrowLeft, ArrowRight, ExternalLink, BookOpen, PlayCircle } from 'lucide-react'
import { fetchCatalogCategoriaItems } from '../../../hooks/useCatalog'
import { getAdjacentCategories } from '../../../data/gymCategoriesOrder'
import CategoriaVaciaCard from '../../CategoriaVaciaCard'

const GRID_PATTERN = {
  backgroundImage:
    'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(24,24,27,1) 39px,rgba(24,24,27,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(24,24,27,1) 39px,rgba(24,24,27,1) 40px)',
}

export async function loader() {
  return fetchCatalogCategoriaItems('gym', 'Cursos', { limit: 100 })
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
              <GraduationCap size={14} /> INKognito Gym System · Formación
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

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.98] text-zinc-900">
              Cursos <span className="text-zinc-400">recomendados</span>
            </h1>
            <p className="mt-4 text-zinc-600 text-sm md:text-base leading-relaxed">
              Selección curada de cursos en español sobre entrenamiento en casa, nutrición aplicada y hábitos sostenibles. Todos son programas externos verificados para que aprendas a tu ritmo desde cualquier lugar.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-700">
                100% en español
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-700">
                Acceso a tu ritmo
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-700">
                Selección verificada
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* LISTADO DE CURSOS */}
      <section className="py-10 md:py-16 px-4 md:px-6 max-w-7xl mx-auto">
        {cursos.length > 0 ? (
          <div className={`grid grid-cols-1 gap-6 ${cursos.length >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 max-w-5xl'}`}>
            {cursos.map((curso) => {
              const url = curso.url_ventas || curso.url_checkout || '#'
              return (
                <article
                  key={curso.name}
                  className="border border-zinc-200 bg-white rounded-2xl overflow-hidden flex flex-col hover:border-zinc-900 hover:shadow-md transition-all duration-300"
                >
                  {curso.image_url && (
                    <div className="aspect-video w-full bg-zinc-100 overflow-hidden flex-shrink-0">
                      <img src={curso.image_url} alt={curso.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-base md:text-lg font-black uppercase leading-snug text-zinc-900">
                        {curso.name}
                      </h2>
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-full px-3 py-1">
                        {curso.plataforma || 'Hotmart'}
                      </span>
                    </div>
                    {curso.descripcion && (
                      <p className="text-zinc-600 text-sm leading-relaxed flex-1">{curso.descripcion}</p>
                    )}
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center justify-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-[0.18em] py-3.5 px-5 rounded-xl transition-colors"
                    >
                      Ver curso <ExternalLink size={13} />
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <CategoriaVaciaCard />
        )}
      </section>

      {/* ALTERNATIVAS GRATUITAS */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400">Contenido abierto</p>
            <h2 className="text-xl md:text-2xl font-black uppercase text-zinc-900 mt-1">
              ¿Buscas empezar gratis hoy mismo?
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed mt-2">
              También tienes acceso libre a nuestros ebooks descargables y a los tutoriales en video para entrenar y fabricar desde casa.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/gym/recursos"
              className="inline-flex items-center gap-2 bg-white border border-zinc-300 hover:border-zinc-900 text-zinc-900 text-xs font-bold uppercase tracking-[0.16em] px-5 py-3 rounded-xl transition-colors"
            >
              <BookOpen size={14} /> Recursos gratis
            </Link>
            <Link
              to="/gym/tutoriales"
              className="inline-flex items-center gap-2 bg-white border border-zinc-300 hover:border-zinc-900 text-zinc-900 text-xs font-bold uppercase tracking-[0.16em] px-5 py-3 rounded-xl transition-colors"
            >
              <PlayCircle size={14} /> Tutoriales
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
