import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Drill, PenTool, PlugZap, Droplet, Crosshair, Hand, ShieldCheck, Toolbox, BedDouble, Package } from 'lucide-react'
import { useCatalog } from '../../hooks/useCatalog'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Convierte el campo `cat` de cada categoría a la clave de settings usada en el panel
const catKey = (cat) => 'supply_cat_' + cat.toLowerCase()
  .replace(/[áéíóú]/g, c => ({á:'a',é:'e',í:'i',ó:'o',ú:'u'})[c])
  .replace(/[^a-z0-9]/g, '_').replace(/_+/g,'_').replace(/^_|_$/g,'')

const categories = [
  { name: 'Tintas',            path: '/supply/ink',            icon: Droplet,    cat: 'Tintas'      },
  { name: 'Cartuchos',         path: '/supply/cartridges',     icon: PenTool,    cat: 'Cartuchos'   },
  { name: 'Agujas',            path: '/supply/needles',        icon: Crosshair,  cat: 'Agujas'      },
  { name: 'Máquinas',          path: '/supply/machines',       icon: Drill,      cat: 'Máquinas'    },
  { name: 'Guantes',           path: '/supply/gloves',         icon: Hand,       cat: 'Guantes'     },
  { name: 'Cuidados',          path: '/supply/aftercare',      icon: ShieldCheck, cat: 'Cuidados'    },
  { name: 'Fuentes',           path: '/supply/power-supplies', icon: PlugZap,    cat: 'Fuentes'     },
  { name: 'Accesorios',        path: '/supply/accessories',    icon: Toolbox,    cat: 'Accesorios'  },
  { name: 'Mobiliario',        path: '/supply/furniture',      icon: BedDouble,  cat: 'Muebles'     },
  { name: 'Combos',            path: '/supply/bundles',        icon: Package,    cat: 'Combos'      },
]

export default function CategoriesSupply() {
  const { categorias, loading } = useCatalog('supply')
  const [imgs, setImgs] = useState({})

  useEffect(() => {
    fetch(`${PANEL_URL}/api/visual/supply`)
      .then(r => r.json())
      .then(data => setImgs(data || {}))
      .catch(() => {})
  }, [])

  // Mapa de categoría → cantidad de productos disponibles
  const stockPorCat = {}
  if (!loading) {
    Object.entries(categorias).forEach(([cat, items]) => {
      stockPorCat[cat] = items.length
    })
  }

  return (
    <section id="categorias" className="relative overflow-hidden pt-3 md:pt-6 pb-8 md:pb-12 px-6 bg-gray-950">
      <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
      <div className="relative z-10 max-w-7xl mx-auto">

        <div className="mb-4 md:mb-8">
          <h2 className="float-left mr-6 md:mr-8 mb-2 text-2xl md:text-4xl font-black uppercase leading-none">
            Categorías
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed text-justify [hyphens:auto]">
            Insumos y equipos para cada etapa del trabajo profesional. Desde la primera aguja
            hasta el mobiliario del estudio: cada categoría está pensada para el flujo real de
            trabajo de un tatuador profesional. Tintas certificadas, cartuchos con membrana de
            seguridad, fuentes estables y accesorios que no fallan a mitad de sesión — con stock
            verificado y despacho rápido a Chigorodó, Apartadó, Turbo y Carepa.
          </p>
          <div className="clear-both" />
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
                  relative h-36 border bg-zinc-950 transition-all duration-300 overflow-hidden
                  uppercase tracking-[0.08em] font-bold text-[10px] md:text-xs flex flex-col
                  items-center justify-center gap-2 text-center px-1
                  border-blue-500 md:border-blue-500/30 md:hover:border-blue-500 md:hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]
                  ${hasStock ? 'text-zinc-300' : 'text-zinc-600'}
                `}
              >
                {imgs[catKey(category.cat)] ? (
                  <>
                    <img
                      src={imgs[catKey(category.cat)]}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 left-0 right-0 bg-black/65 py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-white z-10">
                      {category.name}
                    </span>
                    {!loading && (
                      <span className={`
                        absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full z-10
                        ${hasStock
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-zinc-800/80 text-zinc-600 border border-zinc-700'
                        }
                      `}>
                        {hasStock ? `${count} producto${count > 1 ? 's' : ''}` : 'Sin stock'}
                      </span>
                    )}
                    {loading && <span className="absolute top-2 right-2 text-[9px] text-zinc-700 px-2 z-10">...</span>}
                  </>
                ) : (
                  <>
                    <category.icon size={26} className={hasStock ? 'text-blue-400' : 'text-zinc-700'} />
                    <span>{category.name}</span>
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
                    {loading && <span className="absolute bottom-2 right-2 text-[9px] text-zinc-700 px-2">...</span>}
                  </>
                )}
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}
