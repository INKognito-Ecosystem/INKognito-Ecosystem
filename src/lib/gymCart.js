// Convención ÚNICA de carrito de Gym System (2026-09-20, dinámica de card +
// ficha al nivel de los demás módulos) — la usan la card (dentro de
// MaquinasPedidoPage.jsx) y la ficha (GymProductDetailPage.jsx) para que el
// estado "en carrito" coincida sin importar desde dónde se agregó. Mismo
// patrón que src/lib/supleCart.js.
//
// Antes MaquinasPedidoPage armaba `id: i + 1` (índice del array): la key
// `maquinas-1` dependía del orden del catálogo, no del producto — si el
// orden cambiaba, un carrito ya guardado en localStorage dejaba de coincidir
// con la fila real. Ahora `product.id` es el nombre de la máquina (estable);
// se acepta una variante opcional por si algún día una máquina la tiene,
// aunque hoy cada fila del catálogo de Gym es una sola presentación.
export const GYM_CART_CATEGORY = 'maquinas'

export const gymProductId = (nombre, variant) => nombre + (variant ? `-${variant}` : '')

export const gymCartKey = (nombre, variant) => `${GYM_CART_CATEGORY}-${gymProductId(nombre, variant)}`

// Con "COP" al final — mismo formato que ya usaba `fmtPrecio()` en
// MaquinasPedidoPage.jsx, a diferencia de Suple/Supply que no lo agregan.
export const gymFormatPrice = (price) => (price ? '$' + Math.round(price).toLocaleString('es-CO') + ' COP' : null)

// Ítem que se guarda en el carrito. `brand` queda fijo en "Bajo pedido" —
// mismo rótulo que ya mostraba CartDrawerGym antes de este cambio.
export function gymCartItem({ nombre, variant, price, inventoryId, image, stock }) {
  return {
    id: gymProductId(nombre, variant),
    inventoryId: inventoryId ?? null,
    name: variant ? `${nombre} — ${variant}` : nombre,
    price,
    brand: 'Bajo pedido',
    image: image || '',
    stock: stock ?? null,
  }
}
