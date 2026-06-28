import NavbarCategory from './NavbarCategory'
import FooterSupply from './FooterSupply'
import Seo from '../Seo'
import { useCatalog } from '../../hooks/useCatalog'

const WA = '573207911013'

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
    <div className="border border-blue-500/40 bg-zinc-950 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300 flex flex-col">
      <div className="aspect-square w-full bg-zinc-900 overflow-hidden">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-zinc-700 uppercase tracking-[0.3em] text-xs text-center px-3">{item.name}</p>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex-1">
          {item.descripcion && (
            <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] mb-1">{item.descripcion}</p>
          )}
          <h3 className="text-sm font-black uppercase leading-tight text-white">{item.name}</h3>
          {variants.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {variants.slice(0, 4).map(v => (
                <span key={v} className="text-[10px] border border-zinc-700 text-zinc-400 px-2 py-0.5 rounded">{v}</span>
              ))}
              {variants.length > 4 && <span className="text-[10px] text-zinc-600">+{variants.length - 4}</span>}
            </div>
          )}
          {price && <p className="text-white font-bold text-sm mt-2">{price}</p>}
          {totalStock <= 3 && totalStock > 0 && (
            <p className="text-yellow-500 text-[10px] mt-1 font-bold">⚠️ Últimas {totalStock} unidades</p>
          )}
        </div>
        <a
          href={`https://wa.me/${WA}?text=${waText}`}
          target="_blank" rel="noopener noreferrer"
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
      <div className="p-4 flex flex-col gap-2">
        <div className="h-4 bg-zinc-800 rounded w-3/4" />
        <div className="h-3 bg-zinc-800 rounded w-1/2" />
        <div className="h-8 bg-zinc-800 rounded mt-2" />
      </div>
    </div>
  )
}

/**
 * Página dinámica de categoría supply.
 * @param {string} title     - Nombre visible (ej: "Tintas")
 * @param {string} categoria - Categoría exacta del inventario (ej: "Tintas")
 * @param {string} slug      - Slug de la URL para SEO (ej: "tintas")
 * @param {string} desc      - Descripción SEO
 */
export default function SupplyCategoryPage({ title, categoria, slug, desc }) {
  const { allProducts: products, loading } = useCatalog('supply', categoria)

  return (
    <>
      <Seo
        title={`${title} | INKognito Supply — Urabá`}
        description={desc || `${title} profesionales para tatuadores en Urabá. Pedidos por WhatsApp.`}
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/${slug || categoria.toLowerCase()}`}
      />
      <NavbarCategory pageName={title} backPath="/supply" backLabel="Supply" />

      <div className="bg-black min-h-screen pt-20 md:pt-24">
        <div className="px-6 max-w-7xl mx-auto pb-6">
          <p className="uppercase tracking-[0.25em] text-blue-500/70 text-xs mb-3">Supply — {categoria}</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-2 text-white">{title}</h1>
        </div>

        <div className="px-6 pb-20 max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="border border-blue-500/20 bg-zinc-950 rounded-2xl p-12 text-center mt-8">
              <p className="text-zinc-400 text-lg mb-2">Próximamente disponible</p>
              <p className="text-zinc-600 text-sm mb-6">
                Escríbenos para consultar disponibilidad de {title.toLowerCase()}.
              </p>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hola, quiero consultar disponibilidad de ${title}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold uppercase tracking-[0.15em] text-sm rounded hover:bg-blue-600 transition"
              >
                Consultar por WhatsApp
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(item => <ProductCard key={item.name} item={item} />)}
            </div>
          )}
        </div>
      </div>

      <FooterSupply />
    </>
  )
}
