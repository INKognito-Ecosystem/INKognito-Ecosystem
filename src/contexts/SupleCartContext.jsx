import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const SupleCartContext = createContext(null)
const STORAGE_KEY = 'inkognito-cart-suplementos'

// Carrito propio de Suple (antes vivía dentro de GymCartContext, cuando
// Suplementos era una página de Gym) — mismo patrón exacto que Supply/
// Store/Gym, separado porque Suple ahora es su propio módulo (2026-08-02).
export function SupleCartProvider({ children }) {
  const [items, setItems] = useState([])
  // Selección estilo Mercado Libre (2026-09-19, migración de Suple a fondo
  // blanco) — mismo patrón que StoreCartContext.jsx/SupplyCartContext.jsx:
  // vive acá para que PedidoOnlinePage.jsx también la respete al armar el
  // pedido (ya lee `cart.selectedItems ?? cart.items`). No se persiste a
  // propósito: cada sesión nueva arranca con todo seleccionado.
  const [selectedKeys, setSelectedKeys] = useState(() => new Set())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      if (Array.isArray(stored)) setItems(stored)
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch {}
  }, [items, hydrated])

  // Mantiene selectedKeys sincronizado con items: un producto nuevo entra
  // seleccionado, una key eliminada del carrito se limpia sola.
  useEffect(() => {
    setSelectedKeys(prev => {
      const keys = new Set(items.map(i => i.key))
      let changed = false
      const next = new Set()
      for (const k of prev) { if (keys.has(k)) next.add(k) }
      if (next.size !== prev.size) changed = true
      for (const k of keys) { if (!next.has(k)) { next.add(k); changed = true } }
      return changed ? next : prev
    })
  }, [items])

  // La key es `${category}-${product.id}` — el llamador arma `product.id`
  // con el nombre del producto + la variante (mismo patrón que Supply), así
  // cada presentación es su propia fila y la card y la ficha coinciden.
  // vendorLock (2026-09-20, Suple multitenant) — mismo criterio exacto que
  // SupplyCartContext.jsx/StoreCartContext.jsx: un carrito solo puede tener
  // productos de UN vendedor (conectado a MP o no) a la vez, o todos
  // directos de INKognito (sin estudio_id), nunca mezclados —
  // si se mezcla, el checkout genérico de Nequi/contraentrega le pagaría A
  // INKOGNITO por un producto que no es suyo (ver PedidoOnlinePage.jsx).
  const addItem = useCallback((product, category, opts = {}) => {
    const { estudioId = null, estudioNombre = null, mpConectado = false } = opts
    const primero = items[0]
    if (primero && (primero.estudioId || null) !== estudioId) {
      return { ok: false, motivo: 'otro_proveedor', nombreActual: primero.estudioNombre || 'el vendedor general' }
    }
    const key = `${category}-${product.id}`
    setItems(prev => {
      const existing = prev.find(i => i.key === key)
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { key, ...product, category, qty: 1, estudioId, estudioNombre, mpConectado }]
    })
    return { ok: true }
  }, [items])

  // Reemplaza TODO el carrito por un único producto (2026-09-11) — ver
  // comentario en StoreCartContext.jsx (mismo motivo).
  const setSingleItem = useCallback((product, category, opts = {}) => {
    const { estudioId = null, estudioNombre = null, mpConectado = false } = opts
    const key = `${category}-${product.id}`
    setItems([{ key, ...product, category, qty: 1, estudioId, estudioNombre, mpConectado }])
    return { ok: true }
  }, [])

  const vendorLock = items.find(i => i.estudioId) || null

  const removeItem = useCallback((key) => {
    setItems(prev => prev.filter(i => i.key !== key))
  }, [])

  const changeQty = useCallback((key, qty) => {
    if (qty < 1) {
      setItems(prev => prev.filter(i => i.key !== key))
      return
    }
    setItems(prev => prev.map(i => i.key === key ? { ...i, qty } : i))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  // Elimina varias a la vez — usado tras un pedido exitoso para borrar solo
  // los productos que de verdad se pidieron (ver PedidoOnlinePage.jsx).
  const removeItems = useCallback((keys) => {
    const set = new Set(keys)
    setItems(prev => prev.filter(i => !set.has(i.key)))
  }, [])

  const toggleSelected = useCallback((key) => {
    setSelectedKeys(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])
  const setAllSelected = useCallback((valor) => {
    setSelectedKeys(valor ? new Set(items.map(i => i.key)) : new Set())
  }, [items])
  const allSelected = items.length > 0 && items.every(i => selectedKeys.has(i.key))
  const selectedItems = items.filter(i => selectedKeys.has(i.key))
  const selectedCount = selectedItems.reduce((sum, i) => sum + i.qty, 0)
  const selectedTotal = selectedItems.reduce((sum, i) => {
    const num = parseInt(String(i.price).replace(/[^0-9]/g, ''), 10) || 0
    return sum + num * i.qty
  }, 0)

  const count = items.reduce((sum, i) => sum + i.qty, 0)

  const total = items.reduce((sum, i) => {
    const num = parseInt(String(i.price).replace(/[^0-9]/g, ''), 10) || 0
    return sum + num * i.qty
  }, 0)

  return (
    <SupleCartContext.Provider value={{
      items, addItem, setSingleItem, removeItem, removeItems, changeQty, clearCart, count, total, vendorLock,
      selectedKeys, toggleSelected, setAllSelected, allSelected, selectedItems, selectedCount, selectedTotal,
    }}>
      {children}
    </SupleCartContext.Provider>
  )
}

export function useSupleCart() {
  const ctx = useContext(SupleCartContext)
  if (!ctx) throw new Error('useSupleCart must be inside SupleCartProvider')
  return ctx
}
