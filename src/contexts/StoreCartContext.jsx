import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const StoreCartContext = createContext(null)
const STORAGE_KEY = 'inkognito-cart-store'

export function StoreCartProvider({ children }) {
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

  // Un solo dueño por carrito a la vez — generalizado 2026-08-30 (Jose:
  // "esos pedidos como sabrá la tienda cuando alguien agendó en línea"),
  // mismo criterio exacto que SupplyCartContext.jsx. Antes solo
  // bloqueaba mezclar tiendas CONECTADAS a Mercado Pago; una tienda SIN
  // conectar igual necesita quedar sola en el carrito — mezclada con
  // productos directos de INKognito, el checkout caía al flujo genérico
  // de Nequi/contraentrega, que le pagaría A INKOGNITO por un producto
  // que no es suyo. `opts` va como 4to parámetro (no reemplaza `size`)
  // para que todo llamador existente (productos de Store sin tienda)
  // siga funcionando igual, sin lock.
  const addItem = useCallback((product, category, size = '', opts = {}) => {
    const { estudioId = null, estudioNombre = null, mpConectado = false } = opts
    const primero = items[0]
    if (primero && (primero.estudioId || null) !== estudioId) {
      return { ok: false, motivo: 'otro_proveedor', nombreActual: primero.estudioNombre || 'la tienda general' }
    }
    const key = `${category}-${product.id}-${size}`
    setItems(prev => {
      const existing = prev.find(i => i.key === key)
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { key, ...product, category, size, qty: 1, estudioId, estudioNombre, mpConectado }]
    })
    return { ok: true }
  }, [items])

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

  const count = items.reduce((sum, i) => sum + i.qty, 0)

  const total = items.reduce((sum, i) => {
    const num = parseInt(String(i.price).replace(/[^0-9]/g, ''), 10) || 0
    return sum + num * i.qty
  }, 0)

  return (
    <StoreCartContext.Provider value={{ items, addItem, removeItem, changeQty, clearCart, count, total, vendorLock }}>
      {children}
    </StoreCartContext.Provider>
  )
}

export function useStoreCart() {
  const ctx = useContext(StoreCartContext)
  if (!ctx) throw new Error('useStoreCart must be inside StoreCartProvider')
  return ctx
}
