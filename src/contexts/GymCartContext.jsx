import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const GymCartContext = createContext(null)
const STORAGE_KEY = 'inkognito-cart-gym'

export function GymCartProvider({ children }) {
  const [items, setItems] = useState([])
  // Persistencia en localStorage (2026-08-01) — ver mismo patrón/comentario
  // en SupplyCartContext.jsx (hidrata en efecto, no en el useState inicial,
  // por el SSR).
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

  const count = items.reduce((sum, i) => sum + i.qty, 0)

  const total = items.reduce((sum, i) => {
    const num = parseInt(String(i.price).replace(/[^0-9]/g, ''), 10) || 0
    return sum + num * i.qty
  }, 0)

  return (
    <GymCartContext.Provider value={{ items, addItem, setSingleItem, removeItem, changeQty, clearCart, count, total }}>
      {children}
    </GymCartContext.Provider>
  )
}

export function useGymCart() {
  const ctx = useContext(GymCartContext)
  if (!ctx) throw new Error('useGymCart must be inside GymCartProvider')
  return ctx
}
