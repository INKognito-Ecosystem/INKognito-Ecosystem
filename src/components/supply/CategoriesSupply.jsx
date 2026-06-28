import { Link } from 'react-router-dom'
import { Drill, PenTool, PlugZap, Droplet, Crosshair, Hand, HeartPulse, Toolbox, BedDouble, Package } from 'lucide-react'
import { useCatalog } from '../../hooks/useCatalog'

const categories = [
  { name: 'Tintas',            path: '/supply/ink',            icon: Droplet,    cat: 'Tintas'            },
  { name: 'Cartuchos',         path: '/supply/cartridges',     icon: PenTool,    cat: 'Cartuchos'         },
  { name: 'Agujas',            path: '/supply/needles',        icon: Crosshair,  cat: 'Agujas'            },
  { name: 'Máquinas',          path: '/supply/machines',       icon: Drill,      cat: 'Máquinas'          },
  { name: 'Guantes',           path: '/supply/gloves',         icon: Hand,       cat: 'Guantes'           },
  { name: 'Espumas',           path: '/supply/aftercare',      icon: HeartPulse, cat: 'Espumas y limpieza'},
  { name: 'Fuentes',           path: '/supply/power-supplies', icon: PlugZap,    cat: 'Fuentes'           },
  { name: 'Accesorios',        path: '/supply/accessories',    icon: Toolbox,    cat: 'Accesorios'        },
  { name: 'Mobiliario',        path: '/supply/furniture',      icon: BedDouble,  cat: 'Muebles'           },
  { name: 'Combos',            path: '/supply/bundles',        icon: Package,    cat: 'Bundles'           },
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
    <section id="categorias" className="pt-6 md:pt-8 lg:pt-10 pb-12 md:pb-16 lg:pb-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">

        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-8">
            Categorías
          </h2>
          <div className="bg-zinc-950 border border-blue-500/40 rounded-2xl p-8">
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
              Explora insumos, equipos y herramientas seleccionadas para cada etapa del trabajo profesional.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => {
            const count = stockPorCat[category.cat]
            const hasStock = count > 0
            return (
              <Link
                key={category.name}
                to={category.path}
                className={`
                  relative h-36 border bg-zinc-950 transition-all duration-300
                  uppercase tracking-[0.2em] font-bold text-sm flex flex-col
                  items-center justify-center gap-3 text-center
                  ${hasStock
                    ? 'border-blue-500/50 hover:border-blue-500 hover:bg-zinc-900 text-zinc-300'
                    : 'border-zinc-800 hover:border-zinc-600 text-zinc-600'
                  }
                `}
              >
                <category.icon size={32} className={hasStock ? 'text-blue-400' : 'text-zinc-700'} />
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
