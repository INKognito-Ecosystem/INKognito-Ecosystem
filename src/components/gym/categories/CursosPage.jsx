import { Link, useLoaderData } from 'react-router-dom'
import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import GymMobileNav from '../GymMobileNav'
import { GraduationCap, ArrowLeft, ArrowRight } from 'lucide-react'
import { fetchCatalogCategoriaItems } from '../../../hooks/useCatalog'
import { getAdjacentCategories } from '../../../data/gymCategoriesOrder'
import { useScrolled } from '../../../hooks/useScrolled'

import CategoriaVaciaCard from '../../CategoriaVaciaCard'

// limit:100 (2026-09-14, paginación real) — contenido curado a mano
// (cursos de Hotmart), no inventario masivo; mismo criterio que los
// afiliados de Supply: acotado y generoso, sin UI de "cargar más".
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
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(24,24,27,1) 39px,rgba(24,24,27,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(24,24,27,1) 39px,rgba(24,24,27,1) 40px)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-0">
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
              Cursos <span className="text-zinc-500">recomendados</span>
            </h1>
            <GraduationCap size={40} className="text-zinc-300 flex-shrink-0 md:hidden" strokeWidth={1} />
          </div>
          <p className="text-zinc-600 leading-relaxed max-w-2xl text-justify [hyphens:auto]">
            Selección de los mejores cursos en español para entrenarte en casa, mejorar tu alimentación y aprender a fabricar tus propios equipos — grabados por quienes ya viven de esto, para que aprendas a tu ritmo, sin salir de casa.
          </p>
        </div>
        </div>
      </section>

      <div className="pb-8 md:pb-14 px-4 md:px-6 max-w-7xl mx-auto pt-6 md:pt-8">
        {cursos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cursos.map((curso) => {
              const url = curso.url_ventas || curso.url_checkout || '#'
              return (
                <div
                  key={curso.name}
                  className="border border-zinc-200 bg-white rounded-2xl overflow-hidden flex flex-col hover:border-zinc-400 transition-all duration-300"
                >
                  {curso.image_url && (
                    <div className="aspect-video w-full bg-zinc-50 overflow-hidden flex-shrink-0">
                      <img src={curso.image_url} alt={curso.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-black uppercase tracking-wide leading-tight">{curso.name}</h3>
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest bg-orange-50 text-orange-600 border border-orange-200 rounded-full px-3 py-1">
                        {curso.plataforma || 'Hotmart'}
                      </span>
                    </div>
                    {curso.descripcion && (
                      <p className="text-zinc-600 text-sm leading-relaxed flex-1">{curso.descripcion}</p>
                    )}
                    <a
                      href={url}
                      target="_blank" rel="noopener noreferrer"
                      className="mt-auto inline-block text-center border border-zinc-400 text-zinc-700 text-xs font-bold uppercase tracking-[0.2em] py-3 px-4 rounded-xl hover:border-zinc-600 hover:text-zinc-900 transition-all duration-300"
                    >
                      Ver curso →
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <CategoriaVaciaCard />
        )}
      </div>

      <FooterGym />
      <div className="h-16 md:hidden" />
      <GymMobileNav />
    </div>
  )
}
