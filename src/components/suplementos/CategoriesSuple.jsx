import { Link } from 'react-router-dom'
import { Beef, Zap, Flame, Pill, Dumbbell } from 'lucide-react'
import { SUPLE_CATEGORIES_ORDER } from '../../data/supleCategoriesOrder'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

const CAT_ICONS = {
  'Proteínas':   Beef,
  'Creatina':    Zap,
  'Pre-entreno': Flame,
  'Vitaminas':   Pill,
  'Accesorios':  Dumbbell,
}

export default function CategoriesSuple({ categorias = {} }) {
  // Mapa de categoría (nombre exacto de inventory.categoria) → cantidad de
  // productos disponibles — mismo cálculo que CategoriesSupply.jsx.
  const stockPorCat = {}
  Object.entries(categorias).forEach(([cat, items]) => {
    stockPorCat[cat] = items.length
  })

  return (
    <section id="categorias" className="relative overflow-hidden pt-3 md:pt-6 pb-8 md:pb-12 px-6 bg-gray-950">
      <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
      <div className="relative z-10 max-w-7xl mx-auto">

        <div className="mb-4 md:mb-8">
          <h2 className="float-left mr-6 md:mr-8 mb-2 text-2xl md:text-4xl font-black uppercase leading-none">
            Categorías
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed text-justify [hyphens:auto]">
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
                to={`/suplementos/${cat.slug}`}
                className={`
                  relative h-36 w-full border bg-gray-900 transition-all duration-300 overflow-hidden
                  uppercase tracking-[0.08em] font-bold text-[10px] md:text-xs flex flex-col
                  items-center justify-center gap-2 text-center px-1
                  border-gray-700 md:hover:border-[#9E9E9E] md:hover:shadow-[0_0_25px_rgba(158,158,158,0.15)]
                  ${hasStock ? 'text-gray-300' : 'text-gray-600'}
                `}
              >
                {Icon && <Icon size={26} className={hasStock ? 'text-[#9E9E9E]' : 'text-gray-700'} />}
                <span>{cat.name}</span>
                <span className={`
                  absolute bottom-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full
                  ${hasStock
                    ? 'bg-[#9E9E9E]/20 text-[#9E9E9E] border border-[#9E9E9E]/30'
                    : 'bg-gray-800 text-gray-600 border border-gray-700'
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
