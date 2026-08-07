import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const SupplyCartContext = createContext(null)
const STORAGE_KEY = 'inkognito-cart-supply'

export function SupplyCartProvider({ children }) {
  const [items, setItems] = useState([])
  // Persistencia en localStorage (2026-08-01) — antes el carrito era solo
  // estado en memoria y se perdía al recargar. Se hidrata en un efecto (no
  // en el useState inicial) porque el render de servidor no tiene
  // localStorage — leerlo directo en el initializer causaría un mismatch de
  // hidratación entre el HTML del servidor y el primer render del cliente.
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

  // Un proveedor con Mercado Pago propio a la vez (fase 5, 2026-08-07) —
  // el Split de Mercado Pago reparte un pago hacia UNA sola cuenta
  // conectada por preferencia, así que mezclar dos proveedores conectados
  // (o un proveedor conectado con productos directos de INKognito) no se
  // puede cobrar en un solo checkout. La mayoría del tráfico real entra ya
  // filtrado por proveedor (desde su perfil en el buscador), así que esto
  // casi nunca se siente como una restricción real.
  const addItem = useCallback((product, category, opts = {}) => {
    const { estudioId = null, estudioNombre = null, mpConectado = false } = opts
    const bloqueadoPor = items.find(i => i.mpConectado)
    if (bloqueadoPor && (!mpConectado || estudioId !== bloqueadoPor.estudioId)) {
      return { ok: false, motivo: 'otro_proveedor', nombreActual: bloqueadoPor.estudioNombre }
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

  const vendorLock = items.find(i => i.mpConectado) || null

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
    <SupplyCartContext.Provider value={{ items, addItem, removeItem, changeQty, clearCart, count, total, vendorLock }}>
      {children}
    </SupplyCartContext.Provider>
  )
}

export function useSupplyCart() {
  const ctx = useContext(SupplyCartContext)
  if (!ctx) throw new Error('useSupplyCart must be inside SupplyCartProvider')
  return ctx
}
