import { Link, useLoaderData } from 'react-router'
import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import GymMobileNav from '../GymMobileNav'
import { FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa'
import { BookOpen, ArrowLeft, ArrowRight, Download } from 'lucide-react'
import { fetchCatalogCategoriaItems } from '../../../hooks/useCatalog'
import { getAdjacentCategories } from '../../../data/gymCategoriesOrder'
import CategoriaVaciaCard from '../../CategoriaVaciaCard'

const GRID_PATTERN = {
  backgroundImage:
    'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(24,24,27,1) 39px,rgba(24,24,27,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(24,24,27,1) 39px,rgba(24,24,27,1) 40px)',
}

export async function loader() {
  return fetchCatalogCategoriaItems('gym', 'Recursos', { limit: 100 })
}

export function meta() {
  const title = 'Recursos Gratis | Ebooks de Entrenamiento — INKognito Gym System'
  const description = 'Descarga gratis ebooks sobre hábitos, disciplina y rutinas de entrenamiento sin equipo. Recursos de INKognito Gym System.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/gym/recursos` },
  ]
}

export default function RecursosPage() {
  const { items: ebooks } = useLoaderData()
  const { prev, next } = getAdjacentCategories('recursos')

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
              <BookOpen size={13} /> INKognito Gym System · Biblioteca
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
              Recursos <span className="text-zinc-400">gratuitos</span>
            </h1>
            <p className="mt-4 text-zinc-600 text-sm md:text-base leading-relaxed">
              Ebooks y guías prácticas nacidas de la experiencia real: cómo construir hábitos, entrenar sin equipo y montar tu espacio desde cero sin gastar de más. Descárgalos gratis y empieza hoy.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-700">
                Descarga directa
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-700">
                100% gratis
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-700">
                Formato PDF
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* GRID DE EBOOKS */}
      <section className="py-10 md:py-16 px-4 md:px-6 max-w-7xl mx-auto">
        {ebooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {ebooks.map((eb) => {
              const url = eb.url_ventas || eb.url_checkout || '#'
              return (
                <article
                  key={eb.name}
                  className="border border-zinc-200 bg-white rounded-2xl overflow-hidden flex flex-col hover:border-zinc-900 hover:shadow-md transition-all duration-300"
                >
                  <div className="relative bg-zinc-100 flex items-center justify-center aspect-[3/4] p-3">
                    {eb.image_url ? (
                      <img
                        src={eb.image_url}
                        alt={eb.name}
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <span className="text-zinc-400 text-[10px] uppercase tracking-widest text-center">
                        Portada próximamente
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1 border-t border-zinc-100">
                    <div className="flex-1">
                      <h2 className="font-black uppercase text-xs md:text-sm leading-snug text-zinc-900">
                        {eb.name}
                      </h2>
                      {eb.descripcion && (
                        <p className="text-zinc-500 text-xs leading-relaxed mt-2 line-clamp-3">
                          {eb.descripcion}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-100">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-zinc-900 text-white font-bold uppercase tracking-[0.14em] text-[10px] md:text-xs py-2.5 px-3 rounded-xl hover:bg-zinc-800 transition-colors"
                      >
                        <Download size={13} /> Descargar gratis
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <CategoriaVaciaCard />
        )}
      </section>

      {/* COMUNIDAD Y REDES */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400">Sigue el proceso</p>
            <h2 className="text-xl md:text-2xl font-black uppercase text-zinc-900 mt-1">
              ¿Te sirvieron estas guías?
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed mt-2">
              En mis redes y en YouTube comparto nuevos planos, máquinas en fabricación y rutinas reales desde el taller.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.youtube.com/@JhumanezZ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-[0.14em] transition-colors"
            >
              <FaYoutube size={16} /> YouTube
            </a>
            <a
              href="https://www.instagram.com/jhumaneztattoo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-800 hover:border-zinc-900 text-xs font-bold uppercase tracking-[0.14em] transition-colors"
            >
              <FaInstagram size={15} /> Instagram
            </a>
            <a
              href="https://www.facebook.com/jhumaneztattoo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-800 hover:border-zinc-900 text-xs font-bold uppercase tracking-[0.14em] transition-colors"
            >
              <FaFacebookF size={14} /> Facebook
            </a>
          </div>
        </div>
      </section>

      <FooterGym />
      <div className="h-16 md:hidden" />
      <GymMobileNav />
    </div>
  )
}
