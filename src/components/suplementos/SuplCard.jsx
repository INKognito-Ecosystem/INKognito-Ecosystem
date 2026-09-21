import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Check } from 'lucide-react'
import ProductImageGallery from '../ProductImageGallery'
import { useSupleCart } from '../../contexts/SupleCartContext'
import { SUPLE_CART_CATEGORY, supleCartKey, supleCartItem, supleFormatPrice } from '../../lib/supleCart'

const VAR_THRESHOLD = 3

// Selector de presentación (sabor/tamaño) — exportado (2026-09-19) para que
// la ficha del producto (SupleProductDetailPage.jsx) use exactamente el
// mismo. `large` agranda letra y alto de los chips para la ficha; la card
// usa el tamaño compacto de siempre. Blanco con acento grafito (zinc-700).
export function VariantSelectorSupl({ variantes, selIdx, onChange, large = false }) {
  const [open, setOpen] = useState(false)
  if (!variantes || variantes.length === 0) return null

  const textSize = large ? 'text-xs' : 'text-[9px]'
  const chipPad = large ? 'py-2' : 'py-1'

  if (variantes.length === 1) {
    return variantes[0].variant ? (
      <p className={`${textSize} font-bold text-zinc-400 uppercase tracking-wide`}>
        Presentación: {variantes[0].variant}
      </p>
    ) : null
  }

  if (variantes.length <= VAR_THRESHOLD) {
    return (
      <div className="grid gap-1 w-full" style={{ gridTemplateColumns: `repeat(${variantes.length}, 1fr)` }}>
        {variantes.map((v, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            className={`${textSize} font-bold ${chipPad} rounded border transition-all duration-200 text-center truncate ${
              selIdx === i
                ? 'bg-zinc-700 text-white border-zinc-700'
                : 'border-zinc-300 text-zinc-600 hover:border-zinc-500 hover:text-zinc-900'
            }`}
          >
            {v.variant || `Opc. ${i + 1}`}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between ${large ? 'py-2' : 'py-1.5'} px-2 rounded border border-zinc-300 ${textSize} font-bold text-zinc-700 hover:border-zinc-500 transition-all duration-200`}
      >
        <span className="truncate">{variantes[selIdx]?.variant || 'Elegir variante'}</span>
        <span className={`ml-1 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>▶</span>
      </button>
      {open && (
        <div className="mt-1 grid grid-cols-2 gap-1">
          {variantes.map((v, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { onChange(i); setOpen(false) }}
              className={`${textSize} font-bold ${large ? 'py-2' : 'py-1.5'} px-1 rounded border transition-all duration-200 text-center truncate ${
                selIdx === i
                  ? 'bg-zinc-700 text-white border-zinc-700'
                  : 'border-zinc-300 text-zinc-600 hover:border-zinc-500 hover:text-zinc-900'
              }`}
            >
              {v.variant || `Opc. ${i + 1}`}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Card compacta blanca (2026-09-19, migración de Suple a fondo blanco) —
// mismo patrón que SupplyProductCard.jsx / StoreProductCard.jsx: clic en la
// foto abre la ficha completa (/suplementos/producto/:id), el carrito es un
// ícono circular incrustado en la foto (ShoppingCart ↔ Check, toggle
// agregar/quitar) y la card maneja su propio carrito. Recibe el ítem crudo
// del catálogo (`item`), no un objeto ya mapeado — así la misma card sirve
// en el home, las categorías y "Más de…" de la ficha.
export function SuplCard({ item }) {
  const navigate = useNavigate()
  const { items: cartItems, addItem, removeItem } = useSupleCart()
  const [selIdx, setSelIdx] = useState(0)
  const [showDesc, setShowDesc] = useState(false)
  const [bloqueoMsg, setBloqueoMsg] = useState(null)

  const nombre = item.name
  const variantes = item.variantes || []
  const sel = variantes[selIdx] || {}

  const precio = supleFormatPrice(sel.price) || 'Consultar precio'

  // Si la presentación elegida no tiene foto propia, sigue siendo el mismo
  // producto — se muestra la foto de cualquier otra que sí tenga, en vez de
  // dejar la card sin imagen (mismo criterio que StoreProductCard.jsx).
  const conFoto = variantes.find(v => v.image_url)
  const fuenteImagen = sel.image_url ? sel : conFoto
  // Cards de catálogo: SOLO la portada (2026-09-21, Jose: "estas fotos solo
  // se mostrarán dentro de la landing de un producto específico"). Las fotos
  // 2 y 3 viven en la ficha del producto, con sus miniaturas.
  const galleryImages = fuenteImagen?.image_url
    ? [fuenteImagen.image_url]
    : [item.image_url].filter(Boolean)

  const description = sel.descripcion || item.descripcion

  const cartKey = supleCartKey(nombre, sel.variant)
  const enCarrito = cartItems.some(i => i.key === cartKey)

  // Dueño real de la variante seleccionada (2026-09-20, Suple multitenant)
  // — mismo criterio que SupplyProductCard.jsx: `estudio_nombre_display` ya
  // resuelve nombre_suple vs nombre a nivel de backend (server.js), no hace
  // falta elegir entre varios campos acá.
  const proveedorId = sel.estudio_id ?? item.estudio_id ?? null
  const proveedorNombre = sel.estudio_nombre_display || item.estudio_nombre_display || null
  const proveedorMp = sel.estudio_mp_conectado ?? item.estudio_mp_conectado ?? false

  const handleToggle = () => {
    if (enCarrito) {
      removeItem(cartKey)
      return
    }
    const resultado = addItem(supleCartItem({
      nombre,
      variant: sel.variant,
      price: precio,
      inventoryId: sel.id,
      categoria: item.categoria,
      image: fuenteImagen?.image_url || item.image_url,
      stock: sel.stock,
    }), SUPLE_CART_CATEGORY, {
      estudioId: proveedorId,
      estudioNombre: proveedorNombre,
      mpConectado: !!proveedorMp,
    })
    if (!resultado.ok) {
      setBloqueoMsg(`Ya tienes productos de ${resultado.nombreActual} en tu carrito — termina esa compra antes de agregar de otro vendedor.`)
      setTimeout(() => setBloqueoMsg(null), 5000)
    }
  }

  const ultimas = typeof sel.stock === 'number' && sel.stock > 0 && sel.stock <= 3

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col h-full hover:border-zinc-400 hover:shadow-md transition-all duration-300">
      {/* Clic en la foto abre la ficha completa del producto. */}
      <div
        className={`aspect-square w-full overflow-hidden bg-zinc-50 relative flex-shrink-0 ${sel.id ? 'cursor-pointer' : ''}`}
        onClick={sel.id ? () => navigate(`/suplementos/producto/${sel.id}`) : undefined}
      >
        {galleryImages.length > 0 ? (
          <ProductImageGallery
            images={galleryImages}
            alt={`${nombre}${sel.variant ? ' ' + sel.variant : ''}`}
            containerClassName="w-full h-full"
            imgClassName="w-full h-full object-cover"
            onImgError={(e) => { e.currentTarget.style.display = 'none' }}
            square
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-50">
            <p className="text-zinc-400 uppercase tracking-[0.3em] text-[10px]">Imagen</p>
          </div>
        )}
        {/* stopPropagation: el contenedor de la foto también tiene su
            propio onClick (abre la ficha), sin esto tocar el ícono también
            navegaría. */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleToggle() }}
          aria-label={enCarrito ? 'Quitar del carrito' : 'Agregar al carrito'}
          className={`absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
            enCarrito ? 'bg-zinc-700 text-white' : 'bg-white text-zinc-500 hover:text-zinc-900'
          }`}
        >
          {enCarrito ? <Check size={13} /> : <ShoppingCart size={12} />}
        </button>
      </div>

      {bloqueoMsg && (
        <p className="px-3 pt-2 text-[9px] leading-snug text-amber-700 bg-amber-50">{bloqueoMsg}</p>
      )}

      <div className="p-3 flex flex-col flex-1 gap-1.5 min-h-0">
        <h3 className="text-xs md:text-sm font-black uppercase leading-tight text-zinc-900">{nombre}</h3>
        <span className="text-zinc-900 font-bold text-sm">{precio}</span>
        {ultimas && (
          <span className="text-[10px] font-bold text-amber-700">Últimas {sel.stock}</span>
        )}
        {description && (
          <>
            <p className="hidden md:block text-zinc-500 text-[9.5px] leading-snug">{description}</p>
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
          <VariantSelectorSupl variantes={variantes} selIdx={selIdx} onChange={setSelIdx} />
        </div>
      </div>

      {showDesc && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
          onClick={() => setShowDesc(false)}
        >
          <div
            className="w-full max-w-md bg-white border-t border-zinc-200 rounded-t-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900">Descripción</h4>
              <button onClick={() => setShowDesc(false)} aria-label="Cerrar" className="text-zinc-400 text-lg leading-none px-1">✕</button>
            </div>
            <p className="text-zinc-600 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      )}
    </div>
  )
}
