import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Check } from 'lucide-react'
import { useGymCart } from '../../contexts/GymCartContext'
import { GYM_CART_CATEGORY, gymCartKey, gymCartItem, gymFormatPrice } from '../../lib/gymCart'

// Card de una máquina de Gym — sacada de MaquinasPedidoPage.jsx (2026-09-21)
// para que la misma card se vea idéntica en "Máquinas bajo pedido" y en la
// página de la tienda (EstudioGymPage.jsx). Recibe el ítem tal cual lo
// devuelve el catálogo paginado (`fetchCatalogPage`). Su ancho lo decide la
// grilla que la usa (2 columnas en móvil, como los demás módulos — ya no hay
// filas con scroll horizontal).
//
// id = nombre de la máquina, no el índice del array (2026-09-20, dinámica de
// card al nivel de los demás módulos — mismo motivo que gymCart.js) —
// inventoryId real de inventory, sin esto el pedido no queda ligado a la fila
// real y tampoco la ficha (GymProductDetailPage.jsx) sabría qué producto
// abrir.
export default function GymMaquinaCard({ item, className = '' }) {
  const navigate = useNavigate()
  const { addItem, removeItem, items: cartItems } = useGymCart()
  // Modal de descripción abierto en móvil — mismo patrón que
  // StoreProductCard/SupplyProductCard/SuplCard.
  const [showDesc, setShowDesc] = useState(false)

  const p = {
    inventoryId: item.variantes?.[0]?.id ?? null,
    nombre:      item.name,
    descripcion: item.descripcion || '',
    precio:      item.variantes?.[0]?.price || null,
    stock:       item.variantes?.[0]?.stock ?? null,
    // Sin foto de referencia si no hay image_url real (2026-09-20, Jose:
    // "si no tiene imagen, simplemente no se muestra imagen") — sin foto real,
    // la card muestra "Imagen próximamente", tal como ya lo hacen
    // Supply/Store/Suple.
    image1:      item.image_url || null,
  }

  const key = gymCartKey(p.nombre)
  const enCarrito = cartItems.some(i => i.key === key)

  // Toggle agregar/quitar (2026-09-20) — mismo patrón que
  // SuplCard.jsx/StoreProductCard.jsx.
  const handleToggleCart = () => {
    if (enCarrito) {
      removeItem(key)
      return
    }
    addItem(gymCartItem({
      nombre:      p.nombre,
      price:       gymFormatPrice(p.precio),
      inventoryId: p.inventoryId,
      image:       p.image1 || '',
      stock:       p.stock,
    }), GYM_CART_CATEGORY)
  }

  return (
    <div className={`border border-zinc-200 bg-white rounded-2xl overflow-hidden flex flex-col hover:border-zinc-400 transition-all duration-300 ${className}`}>
      {/* IMAGEN — clic abre la ficha completa, mismo patrón que
          SuplCard.jsx/StoreProductCard.jsx (2026-09-20). El ícono de carrito es
          un círculo incrustado en la foto (ShoppingCart ↔ Check, toggle). */}
      {/* Cuadro SIEMPRE del mismo tamaño (2026-09-21, Jose: "las cards deben
          tener el mismo tamaño... la imagen siempre su cuadro es el mismo
          tamaño, mismo criterio que los demás módulos") — cuadrado como
          SuplCard.jsx. Antes era aspect-video sin overflow-hidden y con la
          imagen en el flujo: una foto más alta que ancha (dominadas y fondos)
          empujaba el cuadro y agrandaba toda la card. Ahora la imagen va
          `absolute inset-0` + object-cover dentro de un cuadro recortado, así
          que ninguna foto puede cambiarle el tamaño; solo la descripción
          puede alargar la card (hacia abajo, en el bloque de texto). */}
      <div
        className={`relative w-full aspect-square overflow-hidden bg-zinc-100 flex items-center justify-center flex-shrink-0 ${p.inventoryId ? 'cursor-pointer' : ''}`}
        onClick={p.inventoryId ? () => navigate(`/gym/producto/${p.inventoryId}`) : undefined}
      >
        {p.image1
          ? <img src={p.image1} alt={p.nombre} className="absolute inset-0 w-full h-full object-cover" />
          : <span className="text-zinc-300 text-xs uppercase tracking-widest text-center px-4">Imagen próximamente</span>
        }
        {/* stopPropagation: el contenedor también navega a la ficha — sin
            esto, tocar el ícono también navegaría. */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleToggleCart() }}
          aria-label={enCarrito ? 'Quitar del carrito' : 'Agregar al carrito'}
          className={`absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
            enCarrito ? 'bg-zinc-700 text-white' : 'bg-black/60 text-white hover:bg-black/90'
          }`}
        >
          {enCarrito ? <Check size={13} /> : <ShoppingCart size={12} />}
        </button>
      </div>

      {/* INFO */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-black uppercase text-xs leading-tight mb-1">{p.nombre}</h3>
        <p className="text-zinc-900 text-xs font-black">{gymFormatPrice(p.precio) || 'Desde $XX.000'}</p>
        {p.descripcion && (
          <>
            {/* Escritorio — texto completo, mismo patrón que
                Store/Supply/Suplementos (2026-08-02) */}
            <p className="hidden md:block text-zinc-500 text-[9.5px] leading-snug mt-1.5">{p.descripcion}</p>
            {/* Móvil — botón que abre modal */}
            <button
              type="button"
              onClick={() => setShowDesc(true)}
              className="md:hidden self-start mt-1.5 text-zinc-500 text-[9px] font-bold uppercase tracking-[0.15em] underline underline-offset-2"
            >
              Ver descripción
            </button>
          </>
        )}
        {/* Etiquetas abajo, una debajo de la otra (2026-09-21, Jose: nombre y
            precio arriba; "Bajo pedido" y "Envío nacional" abajo, una por fila). */}
        <div className="mt-auto pt-2 flex flex-col items-start gap-1">
          <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-widest bg-zinc-200 text-zinc-600 rounded-full px-2 py-0.5">Bajo pedido</span>
          <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-widest bg-zinc-200 text-zinc-600 rounded-full px-2 py-0.5">Envío nacional</span>
        </div>
      </div>

      {showDesc && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/70 flex items-end justify-center"
          onClick={() => setShowDesc(false)}
        >
          <div
            className="w-full max-w-md bg-white border-t border-zinc-200 rounded-t-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900">Descripción</h4>
              <button onClick={() => setShowDesc(false)} className="text-zinc-500 text-lg leading-none px-1">✕</button>
            </div>
            <p className="text-zinc-600 text-sm leading-relaxed">{p.descripcion}</p>
          </div>
        </div>
      )}
    </div>
  )
}
