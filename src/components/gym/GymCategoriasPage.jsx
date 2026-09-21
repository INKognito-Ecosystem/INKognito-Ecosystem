import { Link } from 'react-router-dom'
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

// Puntos decorativos de fondo — los mismos de CategoriesSuple.jsx.
const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(24,24,27,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

// Página propia de categorías (2026-09-20) — enlazada desde la pestaña
// "Categorías" del tab bar inferior (GymMobileNav.jsx), mismo patrón que
// StoreCategoriasPage.jsx / SupleCategoriasPage.jsx / SupplyCategoriasPage.jsx.
// 2026-09-21 (Jose: "la card de las categorías se ven como anchas, deben ser
// iguales a las de los demás módulos"): mosaicos cuadrados de 2 columnas con
// ícono + nombre, calco de CategoriesSuple.jsx. Las tarjetas anchas con
// descripción quedan solo en el home de escritorio.
export default function GymCategoriasPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <NavbarGym />

      <section className="relative overflow-hidden pt-16 md:pt-20 pb-8 md:pb-12 bg-white">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={DOT_PATTERN} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-6 md:pt-8">
          <div className="mb-4 md:mb-8">
            <h1 className="float-left mr-6 md:mr-8 mb-2 text-2xl md:text-4xl font-black uppercase leading-none text-zinc-900">
              Categorías
            </h1>
            <p className="text-zinc-500 text-sm leading-relaxed text-justify [hyphens:auto]">
              Todo lo que necesitas para entrenar en casa, organizado por sección — máquinas,
              planos, suplementos, tutoriales, cursos y recursos, desde Urabá a toda Colombia.
            </p>
            <div className="clear-both" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {GYM_SECCIONES.map(s => {
              const Icon = s.icon
              return (
                <Link
                  key={s.titulo}
                  to={gymSeccionHref(s)}
                  className="relative h-36 w-full border bg-white rounded-xl transition-all duration-300 overflow-hidden uppercase tracking-[0.08em] font-bold text-[10px] md:text-xs flex flex-col items-center justify-center gap-2 text-center px-1 border-zinc-200 md:hover:border-zinc-500 md:hover:shadow-md text-zinc-700"
                >
                  <Icon size={26} className="text-zinc-700" />
                  <span>{s.titulo}</span>
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
