import { Link } from 'react-router-dom'
import { Drill, PenTool, PlugZap, Droplet, Crosshair, Hand, ShieldCheck, Toolbox, BedDouble, Package, GraduationCap } from 'lucide-react'
import { useCatalog } from '../../hooks/useCatalog'

const categories = [
  { name: 'Tintas',            path: '/supply/ink',            icon: Droplet,        cat: 'Tintas'      },
  { name: 'Cartuchos',         path: '/supply/cartridges',     icon: PenTool,        cat: 'Cartuchos'   },
  { name: 'Agujas',            path: '/supply/needles',        icon: Crosshair,      cat: 'Agujas'      },
  { name: 'Máquinas',          path: '/supply/machines',       icon: Drill,          cat: 'Máquinas'    },
  { name: 'Guantes',           path: '/supply/gloves',         icon: Hand,           cat: 'Guantes'     },
  { name: 'Cuidados',          path: '/supply/aftercare',      icon: ShieldCheck,    cat: 'Cuidados'    },
  { name: 'Fuentes',           path: '/supply/power-supplies', icon: PlugZap,        cat: 'Fuentes'     },
  { name: 'Accesorios',        path: '/supply/accessories',    icon: Toolbox,        cat: 'Accesorios'  },
  { name: 'Mobiliario',        path: '/supply/furniture',      icon: BedDouble,      cat: 'Muebles'     },
  { name: 'Combos',            path: '/supply/bundles',        icon: Package,        cat: 'Bundles'     },
  { name: 'Digitales',         path: '/supply/aprende',        icon: GraduationCap,  cat: 'Digitales'   },
]

export default function CategoriesSupply() {
  const { categorias, loading } = useCatalog('supply')

  // Mapa de categoría → cantidad de productos disponibles
  const stockPorCat = {}
  if (!loading) {
    Object.entries(categorias).forEach(([cat, items]) => {
      stockPorCat[cat] = items.length
    })
  }

  return (
    <section id="categorias" className="pt-3 md:pt-6 pb-8 md:pb-12 px-6 bg-black">
      <div className="max-w-7xl mx-auto">

        <div className="mb-4 md:mb-8">
          <h2 className="text-2xl md:text-4xl font-black uppercase mb-2">
            Categorías
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Insumos y equipos para cada etapa del trabajo profesional.
          </p>
        </div>

        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
          {categories.map((category) => {
            const count = stockPorCat[category.cat]
            const hasStock = count > 0
            return (
              <Link
                key={category.name}
                to={category.path}
                className={`
                  snap-start flex-shrink-0 w-[44vw] md:w-auto
                  relative h-36 border bg-zinc-950 transition-all duration-300
                  uppercase tracking-[0.08em] font-bold text-[10px] md:text-xs flex flex-col
                  items-center justify-center gap-2 text-center px-1
                  ${hasStock
                    ? 'border-blue-500/50 hover:border-blue-500 hover:bg-zinc-900 text-zinc-300'
                    : 'border-zinc-800 hover:border-zinc-600 text-zinc-600'
                  }
                `}
              >
                <category.icon size={26} className={hasStock ? 'text-blue-400' : 'text-zinc-700'} />
                <span>{category.name}</span>

                {/* Badge de stock en tiempo real */}
                {!loading && (
                  <span className={`
                    absolute bottom-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full
                    ${hasStock
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-zinc-800 text-zinc-600 border border-zinc-700'
                    }
                  `}>
                    {hasStock ? `${count} producto${count > 1 ? 's' : ''}` : 'Sin stock'}
                  </span>
                )}
                {loading && (
                  <span className="absolute bottom-2 right-2 text-[9px] text-zinc-700 px-2">...</span>
                )}
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}
