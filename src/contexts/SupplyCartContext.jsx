import { createContext, useContext, useState, useCallback } from 'react'

const SupplyCartContext = createContext(null)

export function SupplyCartProvider({ children }) {
  const [items, setItems] = useState([])

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
    <SupplyCartContext.Provider value={{ items, addItem, removeItem, changeQty, clearCart, count, total }}>
      {children}
    </SupplyCartContext.Provider>
  )
}

export function useSupplyCart() {
  const ctx = useContext(SupplyCartContext)
  if (!ctx) throw new Error('useSupplyCart must be inside SupplyCartProvider')
  return ctx
}
