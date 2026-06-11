import { Link } from 'react-router-dom'

const categories = [
  { name: 'Máquinas', path: '/supply/machines' },
  { name: 'Cartuchos', path: '/supply/cartridges' },
  { name: 'Fuentes', path: '/supply/power-supplies' },
  { name: 'Tintas', path: '/supply/ink' },
  { name: 'Agujas', path: '/supply/needles' },
  { name: 'Guantes', path: '/supply/gloves' },
  { name: 'Cuidado Posterior', path: '/supply/aftercare' },
  { name: 'Accesorios', path: '/supply/accessories' },
  { name: 'Mobiliario', path: '/supply/furniture' },
  { name: 'Combos', path: '/supply/bundles' },
]

export default function CategoriesSupply() {
  return (
<section id="categorias" className="pt-6 md:pt-8 lg:pt-10 pb-12 md:pb-16 lg:pb-20 px-6 bg-black">      <div className="max-w-7xl mx-auto">

        {/* TITULO + SEO */}
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
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="h-36 border border-zinc-800 bg-zinc-950 hover:border-blue-500 hover:bg-zinc-900 transition-all duration-300 uppercase tracking-[0.2em] font-bold text-sm text-zinc-300 flex items-center justify-center"
            >
              {category.name}
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}