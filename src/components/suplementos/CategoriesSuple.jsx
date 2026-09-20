import { Link } from 'react-router-dom'
import { Beef, Zap, Flame, Pill, Dumbbell } from 'lucide-react'
import { SUPLE_CATEGORIES_ORDER } from '../../data/supleCategoriesOrder'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(24,24,27,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

// Exportado para que el hero (SuplePage.jsx), el tab bar (SupleMobileNav.jsx)
// y la página de categorías reusen el mismo set de íconos — un solo lugar
// define qué ícono va con cada categoría.
export const CAT_ICONS = {
  'Proteínas':   Beef,
  'Creatina':    Zap,
  'Pre-entreno': Flame,
  'Vitaminas':   Pill,
  'Accesorios':  Dumbbell,
}

// `counts` (2026-09-14, paginación real, fase 2) — antes recibía
// `categorias` (el catálogo completo del módulo) solo para hacer `.length`;
// ahora recibe directo `{categoria: cantidad}` desde
// fetchCatalogCounts('suplementos'), mismo cambio que CategoriesSupply.jsx.
// Blanco (2026-09-19, migración de Suple a fondo blanco).
export default function CategoriesSuple({ counts = {} }) {
  const stockPorCat = counts

  return (
    <section id="categorias" className="relative overflow-hidden pt-3 md:pt-6 pb-8 md:pb-12 px-6 bg-white">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={DOT_PATTERN} />
      <div className="relative z-10 max-w-7xl mx-auto">

        <div className="mb-4 md:mb-8">
          <h2 className="float-left mr-6 md:mr-8 mb-2 text-2xl md:text-4xl font-black uppercase leading-none text-zinc-900">
            Categorías
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed text-justify [hyphens:auto]">
            Todo lo que necesitas para entrenar, organizado por categoría — proteína, creatina,
            pre-entreno, vitaminas y accesorios, con stock real y despacho rápido a Chigorodó,
            Apartadó, Turbo y Carepa.
          </p>
          <div className="clear-both" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {SUPLE_CATEGORIES_ORDER.map((cat) => {
            const Icon = CAT_ICONS[cat.name]
            const count = stockPorCat[cat.categoria]
            const hasStock = count > 0
            return (
              <Link
                key={cat.slug}
                to={cat.link}
                className={`
                  relative h-36 w-full border bg-white rounded-xl transition-all duration-300 overflow-hidden
                  uppercase tracking-[0.08em] font-bold text-[10px] md:text-xs flex flex-col
                  items-center justify-center gap-2 text-center px-1
                  border-zinc-200 md:hover:border-zinc-500 md:hover:shadow-md
                  ${hasStock ? 'text-zinc-700' : 'text-zinc-400'}
                `}
              >
                {Icon && <Icon size={26} className={hasStock ? 'text-zinc-700' : 'text-zinc-300'} />}
                <span>{cat.name}</span>
                <span className={`
                  absolute bottom-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full
                  ${hasStock
                    ? 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                    : 'bg-zinc-50 text-zinc-400 border border-zinc-200'
                  }
                `}>
                  {hasStock ? `${count} producto${count > 1 ? 's' : ''}` : 'Sin stock'}
                </span>
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}
