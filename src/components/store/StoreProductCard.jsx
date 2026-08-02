import { useState } from 'react'
import { useStoreCart } from '../../contexts/StoreCartContext'
import ProductImageGallery from '../ProductImageGallery'

const VAR_THRESHOLD = 3

function SizeSelector({ sizes, selIdx, onChange }) {
  const [open, setOpen] = useState(false)
  if (!sizes || sizes.length === 0) return null

  // Talla única — no hay nada que seleccionar, pero igual debe verse cuál
  // es (antes desaparecía por completo, reportado 2026-08-02).
  if (sizes.length === 1) {
    return (
      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wide">
        Talla disponible: T {sizes[0]}
      </p>
    )
  }

  if (sizes.length <= VAR_THRESHOLD) {
    return (
      <div className="grid gap-1 w-full" style={{ gridTemplateColumns: `repeat(${sizes.length}, 1fr)` }}>
        {sizes.map((s, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`text-[9px] font-bold py-1 rounded border transition-all duration-200 text-center truncate ${
              selIdx === i ? 'text-black border-[#C9A84C]' : 'border-gray-300 text-gray-500 hover:border-[#C9A84C] hover:text-gray-900'
            }`}
            style={selIdx === i ? { backgroundColor: '#C9A84C' } : {}}
          >
            T {s}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-1.5 px-2 rounded border border-gray-300 text-[9px] font-bold text-gray-600 hover:border-[#C9A84C] transition-all duration-200"
      >
        <span className="truncate">{sizes[selIdx] ? `T ${sizes[selIdx]}` : '—'}</span>
        <span className={`ml-1 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>▶</span>
      </button>
      {open && (
        <div className="mt-1 grid grid-cols-3 gap-1">
          {sizes.map((s, i) => (
            <button
              key={i}
              onClick={() => { onChange(i); setOpen(false) }}
              className={`text-[9px] font-bold py-1.5 px-1 rounded border transition-all duration-200 text-center truncate ${
                selIdx === i ? 'text-black border-[#C9A84C]' : 'border-gray-300 text-gray-500 hover:border-[#C9A84C] hover:text-gray-900'
              }`}
              style={selIdx === i ? { backgroundColor: '#C9A84C' } : {}}
            >
              T {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function StoreProductCard({ product, category, sizes }) {
  const { items, addItem } = useStoreCart()
  const [selIdx, setSelIdx] = useState(0)
  const [showDesc, setShowDesc] = useState(false)

  const selectedSize = sizes?.[selIdx] || ''
  // El botón refleja el carrito real, no un timer — antes decía "Agregado"
  // por 1.5s y volvía a "Agregar al carrito" aunque el producto siguiera
  // adentro, dando la impresión falsa de que no se había agregado.
  const cartKey = `${category}-${product.id}-${selectedSize}`
  const enCarrito = items.some(i => i.key === cartKey)

  const selectedVariant = selectedSize && product._item?.variantes
    ? product._item.variantes.find(v => v.variant === selectedSize)
    : null

  // Si la talla seleccionada no tiene foto propia, sigue siendo el mismo
  // producto — mostramos la foto de cualquier otra talla que sí tenga, en
  // vez de dejar la card sin imagen. Antes caía a product.images (la
  // "primera" variante según el orden alfabético en la base), que podía
  // estar igual de vacía si esa variante puntual no tenía foto
  // (reportado 2026-08-02).
  const fallbackVariant = product._item?.variantes?.find(v => v.image_url)
  const imageSource = selectedVariant?.image_url ? selectedVariant : fallbackVariant

  const galleryImages = imageSource?.image_url
    ? [imageSource.image_url, imageSource.image_url_2, imageSource.image_url_3].filter(Boolean)
    : (product.images?.length ? product.images : [product.image].filter(Boolean))

  // Descripción de la talla seleccionada si la tiene propia; si no, la del
  // producto (product.tag) — así, si todas las tallas comparten la misma
  // descripción (o solo el producto tiene una), se ve igual sin importar
  // cuál esté seleccionada; si cada talla tiene la suya, cambia con ella.
  // Antes siempre mostraba la del producto, nunca la de la variante
  // (reportado 2026-08-02).
  const description = selectedVariant?.descripcion || product.tag

  const handleAdd = () => {
    const variantId = product._item?.variantes?.find(v => v.variant === selectedSize)?.id
      ?? product._item?.variantes?.[0]?.id ?? null
    addItem({ ...product, inventoryId: variantId }, category, selectedSize)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl md:rounded-2xl overflow-hidden hover:border-[#C9A84C] hover:shadow-md transition-all duration-300 flex flex-col h-full">

      <div className="aspect-square w-full overflow-hidden bg-gray-100 relative flex-shrink-0">
        {galleryImages.length > 0 ? (
          <ProductImageGallery
            images={galleryImages}
            alt={`${product.name}${selectedSize ? ' ' + selectedSize : ''}`}
            containerClassName="w-full h-full"
            imgClassName="w-full h-full object-cover"
            onImgError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p className="text-gray-400 uppercase tracking-[0.3em] text-[10px]">Imagen</p>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1 gap-1.5 min-h-0">
        <h3 className="text-xs md:text-sm font-black uppercase leading-tight text-gray-900">
          {product.name}
        </h3>
        <span className="text-gray-900 font-bold text-sm">{product.price}</span>
        {description && (
          <>
            {/* Escritorio — texto completo, debajo de nombre/precio (antes
                iba arriba del nombre, reportado 2026-08-02) */}
            <p className="hidden md:block text-gray-500 text-[9.5px] leading-snug">{description}</p>
            {/* Móvil — botón que abre modal, mismo patrón que
                SupplyProductCard.jsx (2026-08-02) */}
            <button
              type="button"
              onClick={() => setShowDesc(true)}
              className="md:hidden self-start text-gray-500 text-[9px] font-bold uppercase tracking-[0.15em] underline underline-offset-2"
            >
              Ver descripción
            </button>
          </>
        )}
        <div className="mt-auto pt-1">
          <SizeSelector sizes={sizes} selIdx={selIdx} onChange={setSelIdx} />
        </div>
      </div>

      <button
        onClick={handleAdd}
        className={`w-full py-2.5 font-bold uppercase tracking-[0.1em] text-[10px] md:text-xs flex-shrink-0 transition-all duration-300 ${
          enCarrito ? 'bg-green-500 text-white' : 'text-black hover:brightness-90'
        }`}
        style={enCarrito ? {} : { backgroundColor: '#C9A84C' }}
      >
        {enCarrito ? '✓ Agregado' : '+ Agregar al carrito'}
      </button>

      {showDesc && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/70 flex items-end justify-center"
          onClick={() => setShowDesc(false)}
        >
          <div
            className="w-full max-w-md bg-white border-t border-gray-200 rounded-t-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">Descripción</h4>
              <button onClick={() => setShowDesc(false)} className="text-gray-400 text-lg leading-none px-1">✕</button>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      )}

    </div>
  )
}
