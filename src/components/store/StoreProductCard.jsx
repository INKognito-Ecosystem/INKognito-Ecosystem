import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Check } from 'lucide-react'
import { useStoreCart } from '../../contexts/StoreCartContext'
import ProductImageGallery from '../ProductImageGallery'

const VAR_THRESHOLD = 3

// Exportado (2026-09-17) — StoreProductDetailPage.jsx lo reusa para elegir
// talla en la ficha completa, mismo criterio que SupplyProductCard.jsx
// exporta VariantSelectorSupply para su propia ficha.
export function SizeSelector({ sizes, selIdx, onChange }) {
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

// showEstudioBadge (2026-09-17, Jose: "las card ya no deberán mostrar
// suministrado por x tienda, pues ya estará dentro de la page de ese
// producto") — se quita la insignia "Vendido por X" de la card: ahora que
// cualquier card abre la ficha completa (StoreProductDetailPage.jsx), que
// SÍ muestra el módulo de la tienda, repetirlo acá era redundante. Mismo
// criterio que ya tenía SupplyProductCard.jsx cuando light=true.
export default function StoreProductCard({ product, category, sizes }) {
  const navigate = useNavigate()
  const { items, addItem, removeItem } = useStoreCart()
  const [selIdx, setSelIdx] = useState(0)
  const [showDesc, setShowDesc] = useState(false)
  const [bloqueoMsg, setBloqueoMsg] = useState(null)

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

  // Cards de catálogo: SOLO la portada (2026-09-21, Jose: "estas fotos solo
  // se mostrarán dentro de la landing de un producto específico"). Las fotos
  // 2 y 3 viven en la ficha del producto, con sus miniaturas.
  const galleryImages = imageSource?.image_url
    ? [imageSource.image_url]
    : [product.image].filter(Boolean)

  // Descripción de la talla seleccionada si la tiene propia; si no, la del
  // producto (product.tag) — así, si todas las tallas comparten la misma
  // descripción (o solo el producto tiene una), se ve igual sin importar
  // cuál esté seleccionada; si cada talla tiene la suya, cambia con ella.
  // Antes siempre mostraba la del producto, nunca la de la variante
  // (reportado 2026-08-02).
  const description = selectedVariant?.descripcion || product.tag

  // Store multitenant (2026-08-29) — dueño real de la variante
  // seleccionada, mismo criterio que SupplyProductCard.jsx: con fallback
  // al nivel de producto por si la variante no trae su propio dato.
  const proveedorId     = selectedVariant?.estudio_id ?? product._item?.estudio_id ?? null
  const proveedorNombre = selectedVariant?.estudio_nombre_display || selectedVariant?.estudio_nombre || product._item?.estudio_nombre_display || product._item?.estudio_nombre || null
  const proveedorMp     = selectedVariant?.estudio_mp_conectado ?? product._item?.estudio_mp_conectado ?? false

  // Variante activa a nivel de card (2026-09-17) — misma variante que ya
  // resuelve handleAdd, pero elevada acá para que el clic en la foto (abre
  // la ficha completa) y el "agregar al carrito" apunten al mismo id sin
  // recalcularlo dos veces.
  const varianteElegida = product._item?.variantes?.find(v => v.variant === selectedSize)
    ?? product._item?.variantes?.[0] ?? null

  const handleAdd = () => {
    const variantId = varianteElegida?.id ?? null
    // image (2026-09-16, Jose: "el carrito ahora trae la foto del
    // producto, al nivel de Supply") — la foto real de la talla
    // seleccionada, no product.image (que es solo la de la primera
    // variante en orden alfabético y puede no ser la que el cliente
    // eligió). Mismo criterio que SupplyProductCard.jsx.
    // stock (2026-09-16, Jose: "en el carrito, el stock aparece un segundo
    // después de abrir, debería cargar de una vez") — se guarda el stock ya
    // conocido al momento de agregar, para que CartDrawerStore lo muestre
    // de inmediato como primer valor en vez de nada; el fetch fresco al
    // abrir el carrito lo sigue actualizando en segundo plano por si
    // cambió desde entonces.
    const resultado = addItem({ ...product, inventoryId: variantId, image: imageSource?.image_url || product.image || '', stock: varianteElegida?.stock ?? null }, category, selectedSize, {
      estudioId:     proveedorId,
      estudioNombre: proveedorNombre,
      mpConectado:   !!proveedorMp,
    })
    if (resultado && !resultado.ok) {
      setBloqueoMsg(`Ya tienes productos de ${resultado.nombreActual} en tu carrito — termina esa compra antes de agregar de otra tienda.`)
      setTimeout(() => setBloqueoMsg(null), 5000)
    }
  }

  // Alterna agregar/quitar (2026-09-17, Jose: "no dice agregar al
  // carrito, sino que aparece el ícono del carrito" — la card debía
  // pasar al mismo ícono incrustado en la foto que ya usa Supply, en vez
  // del botón de texto de ancho completo de antes) — mismo criterio que
  // SupplyProductCard.jsx: volver a tocar el ícono ya en el carrito lo
  // quita, en vez de no hacer nada.
  const handleToggle = () => {
    if (enCarrito) removeItem(cartKey)
    else handleAdd()
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl md:rounded-2xl overflow-hidden hover:border-[#C9A84C] hover:shadow-md transition-all duration-300 flex flex-col h-full">

      {/* Clic en la foto abre la ficha completa del producto (2026-09-17,
          Jose: "vamos a implementar lo que ya hicimos en supply... no
          importa donde se muestre la card, esta deberá abrir ese
          producto, no importa si es desde una tienda, destacados o desde
          su categoría") — mismo criterio que SupplyProductCard.jsx, sin
          el gate `light` que tiene Supply (Store ya es blanco en todas
          partes, no hay una variante oscura que excluir). */}
      <div
        className={`aspect-square w-full overflow-hidden bg-gray-100 relative flex-shrink-0 ${varianteElegida?.id ? 'cursor-pointer' : ''}`}
        onClick={varianteElegida?.id ? () => navigate(`/store/producto/${varianteElegida.id}`) : undefined}
      >
        {galleryImages.length > 0 ? (
          <ProductImageGallery
            images={galleryImages}
            alt={`${product.name}${selectedSize ? ' ' + selectedSize : ''}`}
            containerClassName="w-full h-full"
            imgClassName="w-full h-full object-cover"
            onImgError={(e) => { e.currentTarget.style.display = 'none' }}
            square
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p className="text-gray-400 uppercase tracking-[0.3em] text-[10px]">Imagen</p>
          </div>
        )}
        {/* Carrito como ícono incrustado en la foto (2026-09-17, mismo
            patrón que SupplyProductCard.jsx) — reemplaza el botón de
            texto de ancho completo de abajo. stopPropagation: el
            contenedor de la foto también tiene su propio onClick (abre
            la ficha completa), sin esto tocar el ícono también
            navegaría. */}
        <button
          onClick={(e) => { e.stopPropagation(); handleToggle() }}
          aria-label={enCarrito ? 'Quitar del carrito' : 'Agregar al carrito'}
          className={`absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
            enCarrito ? 'text-black' : 'bg-white text-gray-500 hover:text-gray-900'
          }`}
          style={enCarrito ? { backgroundColor: '#C9A84C' } : {}}
        >
          {enCarrito ? <Check size={13} /> : <ShoppingCart size={12} />}
        </button>
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
        {bloqueoMsg && (
          <p className="text-[9px] leading-snug text-amber-700 bg-amber-50 rounded px-2 py-1.5 mt-1">{bloqueoMsg}</p>
        )}
      </div>

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
