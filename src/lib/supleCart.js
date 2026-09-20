// Convención ÚNICA de carrito de Suple (2026-09-19, migración de Suple a
// fondo blanco) — la usan la card (SuplCard.jsx) y la ficha
// (SupleProductDetailPage.jsx) para que el estado "en carrito" coincida sin
// importar desde dónde se agregó.
//
// Antes SupleCategoryPage armaba `id: i + 1` (índice del array) con
// categoría fija 'suplementos': la key `suplementos-1` colisionaba entre
// categorías (producto #1 de Proteínas vs #1 de Creatina) y no incluía la
// variante (el sabor B se fusionaba con el A). Ahora `product.id` es el
// nombre + la variante — mismo patrón que SupplyCartContext, así no hace
// falta cambiar la firma de `addItem(product, category)`.
export const SUPLE_CART_CATEGORY = 'suplementos'

export const supleProductId = (nombre, variant) => nombre + (variant ? `-${variant}` : '')

export const supleCartKey = (nombre, variant) => `${SUPLE_CART_CATEGORY}-${supleProductId(nombre, variant)}`

export const supleFormatPrice = (price) => (price ? '$' + Math.round(price).toLocaleString('es-CO') : null)

// Ítem que se guarda en el carrito. `name` conserva el formato
// "<producto> — <variante>" que ya leen CartDrawerSuple y PedidoOnlinePage.
export function supleCartItem({ nombre, variant, price, inventoryId, categoria, image, stock }) {
  return {
    id: supleProductId(nombre, variant),
    inventoryId: inventoryId ?? null,
    name: variant ? `${nombre} — ${variant}` : nombre,
    price,
    brand: categoria || '',
    image: image || '',
    stock: stock ?? null,
  }
}
