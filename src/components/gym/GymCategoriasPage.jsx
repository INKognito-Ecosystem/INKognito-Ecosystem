import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import NavbarGym from './NavbarGym'
import FooterGym from './FooterGym'
import GymMobileNav from './GymMobileNav'
import { GYM_SECCIONES, gymSeccionHref } from '../../data/gymSecciones'

export function meta() {
  const title = 'Categorías | INKognito Gym System'
  const description = 'Máquinas de gym bajo pedido, planos PDF, suplementos, tutoriales, cursos y recursos para entrenar en casa. Desde Urabá a toda Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/gym/categorias` },
  ]
}

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(24,24,27,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

export default function GymCategoriasPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <NavbarGym />

      <section className="relative overflow-hidden pt-20 md:pt-28 pb-12 md:pb-20 bg-white">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={DOT_PATTERN} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-2xl mb-8 md:mb-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400">
              INKognito Gym System
            </p>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none text-zinc-900 mt-2">
              Categorías
            </h1>
            <p className="text-zinc-600 text-sm md:text-base leading-relaxed mt-3">
              Todo lo que necesitas para armar tu gimnasio y entrenar en casa, organizado por sección: máquinas bajo pedido, planos técnicos, suplementos, tutoriales, cursos y recursos gratuitos.
            </p>
          </div>

          {/* MÓVIL: mosaicos cuadrados de 2 columnas (igual que los demás módulos) */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {GYM_SECCIONES.map((s) => {
              const Icon = s.icon
              return (
                <Link
                  key={s.titulo}
                  to={gymSeccionHref(s)}
                  className="relative h-36 w-full border border-zinc-200 bg-white rounded-xl transition-all duration-300 overflow-hidden uppercase tracking-[0.08em] font-bold text-[10px] flex flex-col items-center justify-center gap-2 text-center px-2 text-zinc-800 active:scale-[0.98]"
                >
                  <Icon size={26} className="text-zinc-800" />
                  <span>{s.titulo}</span>
                </Link>
              )
            })}
          </div>

          {/* ESCRITORIO: cards arquitectónicas 3x2 con descripción completa */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {GYM_SECCIONES.map((s) => {
              const Icon = s.icon
              return (
                <Link
                  key={s.titulo}
                  to={gymSeccionHref(s)}
                  className="group bg-white border border-zinc-200 hover:border-zinc-900 hover:shadow-lg rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all duration-300"
                >
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-zinc-100 group-hover:bg-zinc-900 text-zinc-800 group-hover:text-white flex items-center justify-center transition-colors">
                      <Icon size={20} />
                    </div>
                    <h2 className="text-lg font-black uppercase tracking-wide text-zinc-900 mt-4">
                      {s.titulo}
                    </h2>
                    <p className="text-sm text-zinc-600 leading-relaxed mt-2">
                      {s.texto}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-zinc-900">
                    Explorar <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <FooterGym />
      <div className="h-16 md:hidden" />
      <GymMobileNav active="categorias" />
    </div>
  )
}
