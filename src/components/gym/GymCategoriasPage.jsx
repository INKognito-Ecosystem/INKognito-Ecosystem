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

const CARD_CLASS = 'border border-gray-800 bg-gray-900/60 rounded-xl p-4 md:p-5 flex flex-col gap-3 hover:border-gray-600 hover:bg-gray-900/80 transition-all duration-300 group'

// Página propia de categorías (2026-09-20) — enlazada desde la pestaña
// "Categorías" del tab bar inferior (GymMobileNav.jsx), mismo patrón que
// StoreCategoriasPage.jsx / SupleCategoriasPage.jsx / SupplyCategoriasPage.jsx.
// Reúne las mismas tarjetas que en escritorio muestra el home de Gym; en
// móvil el home ya no las trae (las categorías van en su listón).
export default function GymCategoriasPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavbarGym />

      <section className="pt-24 md:pt-32 pb-10 md:pb-16 px-4 md:px-6 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-black uppercase leading-none mb-5 md:mb-8">Categorías</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {GYM_SECCIONES.map(s => {
            const Icon = s.icon
            return (
              <Link key={s.titulo} to={gymSeccionHref(s)} className={CARD_CLASS}>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-800/80 border border-gray-700 flex items-center justify-center group-hover:border-gray-500 group-hover:scale-105 transition-all duration-300">
                  <Icon size={20} className="text-gray-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h2 className="text-base font-black uppercase tracking-wide leading-tight">{s.titulo}</h2>
                <p className="text-sm leading-relaxed text-gray-500 group-hover:text-gray-400 transition-colors duration-300">{s.texto}</p>
              </Link>
            )
          })}
        </div>
      </section>

      <FooterGym />
      <div className="h-16 md:hidden" />
      <GymMobileNav active="categorias" />
    </div>
  )
}
