import { useCatalog } from '../../hooks/useCatalog'

const WA_NUMBER = '573207911013'

function ProductCard({ item }) {
  const firstVariant = item.variantes?.[0]
  const price = firstVariant?.price
    ? '$' + Math.round(firstVariant.price).toLocaleString('es-CO')
    : null
  const variants = item.variantes?.map(v => v.variant).filter(Boolean) ?? []
  const totalStock = item.variantes?.reduce((s, v) => s + (v.stock || 0), 0) ?? 0

  const waText = encodeURIComponent(
    `Hola, quiero información sobre: ${item.name}${variants[0] ? ' — ' + variants[0] : ''}`
  )

  return (
    <div className="border border-blue-500/40 bg-zinc-950 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] transition-all duration-300 flex flex-col">

      {/* IMAGEN */}
      <div className="aspect-square w-full bg-zinc-900 overflow-hidden relative">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-zinc-700 uppercase tracking-[0.3em] text-xs text-center px-4">
              {item.name}
            </p>
          </div>
        )}
        {totalStock <= 2 && totalStock > 0 && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Últimas {totalStock}
          </span>
        )}
      </div>

      {/* INFO */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex-1">
          {item.descripcion && (
            <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] mb-1">
              {item.descripcion}
            </p>
          )}
          <h3 className="text-base font-black uppercase leading-tight text-white">
            {item.name}
          </h3>
          {/* Variantes disponibles */}
          {variants.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {variants.slice(0, 4).map(v => (
                <span key={v} className="text-[10px] border border-zinc-700 text-zinc-400 px-2 py-0.5 rounded">
                  {v}
                </span>
              ))}
              {variants.length > 4 && (
                <span className="text-[10px] text-zinc-600">+{variants.length - 4}</span>
              )}
            </div>
          )}
          {price && (
            <p className="text-white font-bold text-sm mt-2">{price}</p>
          )}
        </div>

        <a
          href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-center px-4 py-2 border border-blue-500/50 text-blue-400 uppercase tracking-[0.15em] text-[11px] font-bold hover:bg-blue-500 hover:text-white transition-all duration-300 rounded"
        >
          Consultar
        </a>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="border border-zinc-800 bg-zinc-950 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-zinc-900" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-zinc-800 rounded w-3/4" />
        <div className="h-3 bg-zinc-800 rounded w-1/2" />
        <div className="h-8 bg-zinc-800 rounded mt-2" />
      </div>
    </div>
  )
}

export default function FeaturedProductsSupply() {
  const { categorias, allProducts, loading } = useCatalog('supply')

  return (
    <section id="productos" className="pt-12 md:pt-16 lg:pt-20 pb-4 md:pb-6 lg:pb-8 px-6 bg-gray-950">
      <div className="max-w-7xl mx-auto">

        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-6 text-white">
            Disponible ahora
          </h2>
          <p className="text-zinc-500 text-base leading-relaxed">
            Insumos profesionales con stock real. Lo que ves está disponible para pedido inmediato.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : allProducts.length === 0 ? (
          <div className="border border-blue-500/20 bg-zinc-950 rounded-2xl p-12 text-center">
            <p className="text-zinc-400 text-lg mb-2">Catálogo en actualización</p>
            <p className="text-zinc-600 text-sm mb-6">
              Los productos aparecen aquí cuando el proveedor los agrega al inventario con categoría y foto.
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, quiero ver el catálogo de insumos para tatuaje disponible')}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold uppercase tracking-[0.15em] text-sm rounded hover:bg-blue-600 transition"
            >
              Ver disponibilidad por WhatsApp
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            {Object.entries(categorias).map(([cat, items]) => (
              <div key={cat}>
                {/* Cabecera de categoría */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex-1 h-px bg-zinc-800" />
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-[0.15em] text-white px-2">
                    {cat}
                  </h3>
                  <div className="flex-1 h-px bg-zinc-800" />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map(item => <ProductCard key={item.name} item={item} />)}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 md:mt-16 lg:mt-20">
        <div className="border-b border-zinc-900" />
      </div>
    </section>
  )
}
