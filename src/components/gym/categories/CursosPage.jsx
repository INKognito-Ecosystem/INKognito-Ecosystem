import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import Seo from '../../Seo'
import { GraduationCap } from 'lucide-react'
import { useCatalog } from '../../../hooks/useCatalog'

const WA = '573207911013'

export default function CursosPage() {
  const { allProducts: cursos, loading } = useCatalog('gym', 'Cursos')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Cursos de Entrenamiento en Casa y Fitness | Colombia"
        description="Cursos recomendados de entrenamiento en casa, nutrición y desarrollo personal. Selección de los mejores cursos en español disponibles en Hotmart."
        siteName="INKognito Gym"
        canonical={`${import.meta.env.VITE_SITE_URL}/gym/cursos`}
      />

      <NavbarGym />

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
          <div className="flex items-center justify-between gap-4 mb-4">
            <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
              Cursos<br />
              <span className="text-gray-400">recomendados</span>
            </h1>
            <GraduationCap size={56} className="text-gray-800 flex-shrink-0 md:hidden" strokeWidth={1} />
          </div>
          <p className="text-gray-400 leading-relaxed max-w-2xl">
            Selección de los mejores cursos en español para entrenarte en casa, mejorar tu alimentación y aprender a fabricar tus propios equipos.
          </p>
        </div>
        </div>
      </section>

      <div className="pb-8 md:pb-14 px-4 md:px-6 max-w-7xl mx-auto pt-6 md:pt-8">
        {loading && (
          <div className="flex md:grid md:grid-cols-2 gap-4 overflow-x-hidden">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[72vw] md:w-auto rounded-2xl bg-gray-800/40 border border-gray-800 p-5 animate-pulse h-40" />
            ))}
          </div>
        )}
        {!loading && (cursos.length > 0 ? (
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
        ))}
      </div>

      <FooterGym />
    </div>
  )
}
