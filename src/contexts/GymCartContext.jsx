import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const GymCartContext = createContext(null)
const STORAGE_KEY = 'inkognito-cart-gym'

export function GymCartProvider({ children }) {
  const [items, setItems] = useState([])
  // Persistencia en localStorage (2026-08-01) — ver mismo patrón/comentario
  // en SupplyCartContext.jsx (hidrata en efecto, no en el useState inicial,
  // por el SSR).
  const [hydrated, setHydrated] = useState(false)
  // Selección estilo Mercado Libre (2026-09-20, carrito de Gym al nivel de
  // los demás módulos) — mismo patrón que StoreCartContext.jsx/
  // SupleCartContext.jsx: vive acá para que PedidoOnlinePage.jsx también la
  // respete al armar el pedido (ya lee `cart.selectedItems ?? cart.items`).
  // No se persiste a propósito: cada sesión nueva arranca con todo
  // seleccionado.
  const [selectedKeys, setSelectedKeys] = useState(() => new Set())

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

  const addItem = useCallback((product, category) => {
    const key = `${category}-${product.id}`
    setItems(prev => {
      const existing = prev.find(i => i.key === key)
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { key, ...product, category, qty: 1 }]
    })
  }, [])

  // Reemplaza TODO el carrito por un único producto (2026-09-11) — ver
  // comentario en StoreCartContext.jsx (mismo motivo). `opts` no se usa acá
  // (Gym no tiene vendor-lock), pero se acepta para que ProductLandingPage
  // pueda llamar a los 4 carritos con la misma forma.
  const setSingleItem = useCallback((product, category) => {
    const key = `${category}-${product.id}`
    setItems([{ key, ...product, category, qty: 1 }])
    return { ok: true }
  }, [])

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
    <GymCartContext.Provider value={{
      items, addItem, setSingleItem, removeItem, removeItems, changeQty, clearCart, count, total,
      selectedKeys, toggleSelected, setAllSelected, allSelected, selectedItems, selectedCount, selectedTotal,
    }}>
      {children}
    </GymCartContext.Provider>
  )
}

export function useGymCart() {
  const ctx = useContext(GymCartContext)
  if (!ctx) throw new Error('useGymCart must be inside GymCartProvider')
  return ctx
}
