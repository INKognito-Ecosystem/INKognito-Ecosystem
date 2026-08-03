import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const SupleCartContext = createContext(null)
const STORAGE_KEY = 'inkognito-cart-suplementos'

// Carrito propio de Suple (antes vivía dentro de GymCartContext, cuando
// Suplementos era una página de Gym) — mismo patrón exacto que Supply/
// Store/Gym, separado porque Suple ahora es su propio módulo (2026-08-02).
export function SupleCartProvider({ children }) {
  const [items, setItems] = useState([])
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
    <SupleCartContext.Provider value={{ items, addItem, removeItem, changeQty, clearCart, count, total }}>
      {children}
    </SupleCartContext.Provider>
  )
}

export function useSupleCart() {
  const ctx = useContext(SupleCartContext)
  if (!ctx) throw new Error('useSupleCart must be inside SupleCartProvider')
  return ctx
}
