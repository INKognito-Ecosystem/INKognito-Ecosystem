import { Link } from 'react-router-dom'
import NavbarCategoryStore from './NavbarCategoryStore'
import StoreMobileNav from './StoreMobileNav'
import { CATEGORY_GROUPS } from '../../data/storeCategories'

const categoryGroups = [CATEGORY_GROUPS.deportiva, CATEGORY_GROUPS.casual]

export function meta() {
  const title = 'Categorías | INKognito Store'
  const description = 'Explora ropa y calzado deportivo y casual — sets, camisetas dry-fit, tenis de running, guayos, zapatos casuales y más, en Urabá.'
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/store/categorias` },
  ]
}

// Página propia de categorías (2026-09-16, Jose: "quita las dos card que
// contenían las categorías [de la home]... esas cards van a pasar a estar
// dentro de una página, que estará enlazada a el botón categorías del
// navbar inferior") — mismo patrón ya resuelto en Supply
// (SupplyCategoriasPage.jsx, enlazada desde SupplyMobileNav). Mueve tal
// cual el bloque de "Nuestras Categorías" que antes vivía en StorePage.jsx,
// sin rediseñarlo — Jose pidió moverlo, no rehacerlo.
export default function StoreCategoriasPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <NavbarCategoryStore pageName="Categorías" hideMobileActions />

      <div className="pt-24 md:pt-28 pb-24 md:pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 md:mb-8">
            <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-xs mb-2">
              Catálogo
            </p>
            <h1 className="text-2xl md:text-4xl font-black uppercase leading-none text-gray-900">
              Nuestras Categorías
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {categoryGroups.map((group) => {
              const isGym = group.key === 'deportiva'
              return (
                <Link
                  key={group.link}
                  to={group.link}
                  className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 md:p-7 flex flex-col transition-all duration-300 hover:-translate-y-1 min-h-[240px] md:min-h-[280px] ${
                    isGym
                      ? 'from-zinc-600 to-zinc-900 border-zinc-400/30 hover:border-zinc-300/50 hover:shadow-[0_12px_35px_rgba(161,161,170,0.2)]'
                      : 'from-[#4a350f] to-black border-[#C9A84C]/40 hover:border-[#C9A84C]/70 hover:shadow-[0_12px_35px_rgba(201,168,76,0.3)]'
                  }`}
                >
                  <div className={isGym
                    ? 'absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10'
                    : 'absolute -bottom-14 -right-14 w-44 h-44 rounded-full bg-[#C9A84C]/15'
                  } />
                  <div className={`relative w-12 h-12 rounded-full border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                    isGym ? 'bg-zinc-900/60 border-zinc-300/30 text-zinc-200' : 'bg-black/40 border-[#C9A84C]/50 text-[#C9A84C]'
                  }`}>
                    {group.icon}
                  </div>
                  <p className={`relative uppercase tracking-[0.25em] text-[10px] mb-2 font-semibold ${isGym ? 'text-zinc-300' : 'text-[#C9A84C]'}`}>
                    {group.tag}
                  </p>
                  <h2 className="relative text-lg md:text-2xl font-black uppercase leading-tight mb-3 text-white">
                    {group.name}
                  </h2>
                  <p className={`relative text-xs md:text-sm leading-relaxed mb-5 flex-1 text-justify [hyphens:auto] ${isGym ? 'text-zinc-200' : 'text-zinc-400'}`}>
                    {group.description}
                  </p>
                  <span className={`relative shrink-0 border text-xs md:text-sm font-black uppercase tracking-[0.2em] py-3 px-6 rounded-xl text-center transition-all duration-300 ${
                    isGym
                      ? 'border-zinc-300/40 text-zinc-100 group-hover:border-zinc-100 group-hover:bg-white/10'
                      : 'border-[#C9A84C]/50 text-[#C9A84C] group-hover:border-[#C9A84C] group-hover:bg-[#C9A84C]/15'
                  }`}>
                    Ver categorías →
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <StoreMobileNav active="categorias" />
    </main>
  )
}
