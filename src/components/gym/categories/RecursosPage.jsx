import { Link, useLoaderData } from 'react-router-dom'
import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import { FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa'
import { BookOpen, ArrowLeft, ArrowRight } from 'lucide-react'
import { fetchCatalogCategoriaItems } from '../../../hooks/useCatalog'
import { getAdjacentCategories } from '../../../data/gymCategoriesOrder'
import { useScrolled } from '../../../hooks/useScrolled'

const GRID_PATTERN = {
  backgroundImage:
    'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px)',
}

const WA = '573207911013'

export async function loader() {
  return fetchCatalogCategoriaItems('gym', 'Recursos')
}

export function meta() {
  const title = 'Recursos Gratis | Ebooks de Entrenamiento y Desarrollo Personal — INKognito Gym'
  const description = 'Descarga gratis ebooks sobre hábitos, disciplina y rutinas de entrenamiento sin equipo. Recursos de INKognito Gym.'
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
        <div className="absolute inset-0 opacity-[0.04]" style={GRID_PATTERN} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            {prev && (
              <Link to={`/gym/${prev.slug}`} replace aria-label={`Ver ${prev.name}`} className="flex-shrink-0 text-gray-500 hover:text-white transition-colors">
                <ArrowLeft size={24} />
              </Link>
            )}
            <div className="flex-1 flex items-center justify-center md:justify-between gap-3 md:gap-4">
              <h1 className="text-xl md:text-7xl font-black uppercase leading-tight md:leading-none text-center md:text-left">
                Recursos <span className="text-gray-400">gratuitos</span>
              </h1>
              <BookOpen
                size={40}
                className="text-gray-800 flex-shrink-0 md:hidden"
                strokeWidth={1}
              />
            </div>
            {next && (
              <Link to={`/gym/${next.slug}`} replace aria-label={`Ver ${next.name}`} className="flex-shrink-0 text-gray-500 hover:text-white transition-colors">
                <ArrowRight size={24} />
              </Link>
            )}
          </div>
          <p className="text-gray-400 leading-relaxed max-w-2xl">
            No necesitas pagar nada para empezar a cambiar tu vida. Estos recursos nacieron de mi propia experiencia — construyendo mi gym desde cero, entrenando sin equipo, y aprendiendo a base de prueba y error. Si a mí me sirvió, puede servirte a ti también. Descárgalos, úsalos, y empieza donde estás.
          </p>
        </div>
      </section>

      {/* GRID DE EBOOKS */}
      <div className="pb-8 md:pb-14 px-4 md:px-6 max-w-xl mx-auto pt-6 md:pt-8">
        {ebooks.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {ebooks.map((eb) => {
              const url = eb.url_ventas || eb.url_checkout || '#'
              return (
                <div
                  key={eb.name}
                  className="border border-gray-800 bg-gray-800/40 rounded-xl overflow-hidden flex flex-col hover:border-gray-600 transition-all duration-300"
                >
                  {/* PORTADA — proporción de libro (3:4), sin recortar el contenido */}
                  <div className="relative bg-gray-800 flex items-center justify-center aspect-[3/4]">
                    {eb.image_url ? (
                      <img
                        src={eb.image_url}
                        alt={eb.name}
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <span className="text-gray-700 text-[9px] uppercase tracking-widest">Portada próximamente</span>
                    )}
                  </div>

                  {/* INFO — ancho completo, título arriba, botón abajo */}
                  <div className="p-2 flex flex-col flex-1 border-t border-gray-800">
                    <div className="flex-1">
                      <h2 className="font-black uppercase text-[11px] leading-tight mb-1">{eb.name}</h2>
                      {eb.descripcion && (
                        <p className="text-gray-500 text-[10px] leading-relaxed line-clamp-2">{eb.descripcion}</p>
                      )}
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-gray-800">
                      <a
                        href={url}
                        target="_blank" rel="noopener noreferrer"
                        className="block text-center bg-white text-gray-950 font-black uppercase tracking-[0.1em] text-[10px] py-1.5 rounded-lg hover:bg-gray-200 transition-all duration-300"
                      >
                        Descargar gratis
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="border border-gray-800 bg-gray-800/40 rounded-2xl p-6 text-center">
            <p className="text-gray-400 text-sm mb-4 max-w-sm mx-auto">
              Aún no tenemos recursos gratuitos cargados. Avísanos y te contactamos apenas tengamos algo disponible.
            </p>
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero que me avisen cuando haya recursos gratuitos disponibles en INKognito Gym.')}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-gray-950 font-bold uppercase tracking-[0.15em] text-xs rounded hover:bg-orange-400 transition"
            >
              Avisarme cuando haya recursos →
            </a>
          </div>
        )}

        {/* SECCIÓN REDES */}
        <div className="mt-8 border-t border-gray-800 pt-8 text-center max-w-xl mx-auto">
          <p className="text-gray-400 leading-relaxed text-sm md:text-base mb-8">
            Si estos recursos te fueron de ayuda, te invito a seguirme en mis redes y a suscribirte a mi canal de YouTube — ahí comparto todo el proceso de construir esto desde cero.
          </p>
          <div className="flex items-center justify-center gap-8">
            <a href="https://www.instagram.com/jhumaneztattoo" target="_blank" rel="noopener noreferrer"
               className="text-gray-500 hover:text-white transition-colors duration-300">
              <FaInstagram size={28} />
            </a>
            <a href="https://www.facebook.com/jhumaneztattoo" target="_blank" rel="noopener noreferrer"
               className="text-gray-500 hover:text-white transition-colors duration-300">
              <FaFacebookF size={28} />
            </a>
            <a href="https://www.youtube.com/@JhumanezZ" target="_blank" rel="noopener noreferrer"
               className="text-gray-500 hover:text-white transition-colors duration-300">
              <FaYoutube size={28} />
            </a>
          </div>
        </div>
      </div>

      <FooterGym />
    </div>
  )
}
