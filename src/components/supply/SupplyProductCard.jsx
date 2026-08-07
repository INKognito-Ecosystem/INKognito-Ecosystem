import { useState } from 'react'
import { useSupplyCart } from '../../contexts/SupplyCartContext'
import ProductImageGallery from '../ProductImageGallery'

const VAR_THRESHOLD = 3

// Extraído de SupplyCategoryPage.jsx (2026-07-30) para reusarlo también en
// BrandCatalogSection.jsx — antes las páginas de marca no tenían forma de
// mostrar inventario real y cada una inventaba su propia card (algunas con
// productos y precios inventados, ej. "$XX.XXX", que además agregaban al
// carrito real si el cliente hacía clic). Una sola fuente de verdad para la
// card de producto de Supply.
export function VariantSelectorSupply({ variantObjs, selIdx, onChange }) {
  const [open, setOpen] = useState(false)
  if (!variantObjs || variantObjs.length <= 1) return null

  if (variantObjs.length <= VAR_THRESHOLD) {
    return (
      <div className="grid gap-1 w-full" style={{ gridTemplateColumns: `repeat(${variantObjs.length}, 1fr)` }}>
        {variantObjs.map((v, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`text-[9px] font-bold py-1 rounded border transition-all duration-200 text-center truncate ${
              selIdx === i
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-zinc-700 text-zinc-500 hover:border-blue-400 hover:text-white'
            }`}
          >
            {v.variant}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-1.5 px-2 rounded border border-zinc-700 text-[9px] font-bold text-zinc-300 hover:border-blue-400 transition-all duration-200"
      >
        <span className="truncate">{variantObjs[selIdx]?.variant || '—'}</span>
        <span className={`ml-1 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>▶</span>
      </button>
      {open && (
        <div className="mt-1 grid grid-cols-2 gap-1">
          {variantObjs.map((v, i) => (
            <button
              key={i}
              onClick={() => { onChange(i); setOpen(false) }}
              className={`text-[9px] font-bold py-1.5 px-1 rounded border transition-all duration-200 text-center truncate ${
                selIdx === i
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-zinc-700 text-zinc-500 hover:border-blue-400 hover:text-white'
              }`}
            >
              {v.variant}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SupplyProductCard({ item, categoria }) {
  const { items: cartItems, addItem } = useSupplyCart()
  const [selIdx, setSelIdx] = useState(0)
  const [showDesc, setShowDesc] = useState(false)

  // variantObjs (con nombre) es solo para el selector — si el producto tiene
  // una única variante SIN nombre (ej. mobiliario, no todo necesita un
  // "sabor"/talla), antes quedaba filtrada por completo y sel caía en {},
  // perdiendo precio/stock/imagen aunque el producto sí los tuviera (la
  // landing individual de producto sí los mostraba, porque no filtra por
  // nombre — de ahí la inconsistencia reportada 2026-08-01).
  const allVariants = item.variantes ?? []
  const variantObjs = allVariants.filter(v => v.variant)
  const totalStock  = allVariants.reduce((s, v) => s + (v.stock || 0), 0)
  const sel         = variantObjs[selIdx] || variantObjs[0] || allVariants[0] || {}

  const resolvedPrice = sel.price
    ? '$' + Math.round(sel.price).toLocaleString('es-CO')
    : null
  // Si la variante seleccionada no tiene foto propia, sigue siendo el mismo
  // producto — antes caía a item.image_url, que es solo la de la primera
  // variante en orden alfabético y podía estar igual de vacía. Ahora busca
  // cualquier otra variante que sí tenga foto (mismo criterio aplicado en
  // StoreProductCard.jsx, reportado 2026-08-02).
  const fallbackVariant = allVariants.find(v => v.image_url)
  const activeImage = sel.image_url || fallbackVariant?.image_url || item.image_url || null
  const images = sel.image_url
    ? [sel.image_url, sel.image_url_2, sel.image_url_3].filter(Boolean)
    : fallbackVariant
      ? [fallbackVariant.image_url, fallbackVariant.image_url_2, fallbackVariant.image_url_3].filter(Boolean)
      : [item.image_url, item.image_url_2, item.image_url_3].filter(Boolean)
  const galleryImages = images.filter(Boolean)

  // Descripción de la variante seleccionada si tiene la suya propia; si no,
  // la del producto — mismo criterio que StoreProductCard.jsx. Antes
  // siempre mostraba item.descripcion (la de la primera fila en la base),
  // nunca cambiaba al cambiar de variante (reportado 2026-08-02).
  const description = sel.descripcion || item.descripcion

  const productId = item.name + (sel.variant ? '-' + sel.variant : '')
  const cartKey = `${categoria}-${productId}`
  const enCarrito = cartItems.some(i => i.key === cartKey)

  const handleAdd = () => {
    addItem({
      id:          productId,
      inventoryId: sel.id ?? null,
      name:        item.name + (sel.variant ? ` (${sel.variant})` : ''),
      price:       resolvedPrice || '—',
      brand:       item.categoria || '',
      image:       activeImage || '',
    }, categoria)
  }

  return (
    <div className="border border-blue-500/40 bg-zinc-950 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300 flex flex-col h-full">

      <div className="aspect-square w-full bg-zinc-900 overflow-hidden flex-shrink-0">
        {galleryImages.length > 0 ? (
          <ProductImageGallery
            images={galleryImages}
            alt={`${item.name}${sel.variant ? ' ' + sel.variant : ''}`}
            containerClassName="w-full h-full"
            imgClassName="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-zinc-700 uppercase tracking-[0.3em] text-[10px] text-center px-3">{item.name}</p>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1 gap-1.5 min-h-0">
        {/* Supply multitenant (fase 4, 2026-08-07) — insignia por card
            solo para productos de un estudio-vendedor. La insignia fija
            de categoría (Tommy/Warlock) sigue viviendo en
            SupplyCategoryPage.jsx a nivel de página, sin tocar — esta es
            la excepción puntual cuando el producto viene de otra parte. */}
        {item.estudio_nombre && (
          <p className="text-[8px] font-bold uppercase tracking-wide text-blue-400">Suministrado por {item.estudio_nombre}</p>
        )}
        <h3 className="text-xs font-black uppercase leading-tight text-white">{item.name}</h3>
        {resolvedPrice && <p className="text-white font-bold text-sm">{resolvedPrice}</p>}
        {totalStock <= 3 && totalStock > 0 && (
          <p className="text-yellow-500 text-[9px] font-bold">⚠️ Últimas {totalStock}</p>
        )}
        {description && (
          <>
            {/* Escritorio — texto completo, debajo de nombre/precio */}
            <p className="hidden md:block text-zinc-500 text-[9.5px] leading-snug">{description}</p>
            {/* Móvil — botón que abre modal, en vez de estirar la card
                (descripción de mobiliario es un párrafo largo, no la
                etiqueta corta de una palabra que este campo tenía antes;
                2026-08-01). */}
            <button
              type="button"
              onClick={() => setShowDesc(true)}
              className="md:hidden self-start text-zinc-500 text-[9px] font-bold uppercase tracking-[0.15em] underline underline-offset-2"
            >
              Ver descripción
            </button>
          </>
        )}
        <div className="mt-auto pt-1">
          {variantObjs.length === 1 ? (
            <p className="text-[9px] font-bold text-zinc-400 uppercase truncate">{variantObjs[0].variant}</p>
          ) : (
            <VariantSelectorSupply variantObjs={variantObjs} selIdx={selIdx} onChange={setSelIdx} />
          )}
        </div>
      </div>

      <button
        onClick={handleAdd}
        className={`w-full py-2.5 font-bold uppercase tracking-[0.1em] text-[10px] flex-shrink-0 transition-all duration-300 ${
          enCarrito ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {enCarrito ? '✓ Agregado' : '+ Agregar al carrito'}
      </button>

      {showDesc && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/70 flex items-end justify-center"
          onClick={() => setShowDesc(false)}
        >
          <div
            className="w-full max-w-md bg-zinc-950 border-t border-zinc-800 rounded-t-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-white">Descripción</h4>
              <button onClick={() => setShowDesc(false)} className="text-zinc-500 text-lg leading-none px-1">✕</button>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      )}
    </div>
  )
}
