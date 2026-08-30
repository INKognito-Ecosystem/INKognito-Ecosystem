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

  // Un solo dueño por carrito a la vez — generalizado 2026-08-30 (Jose:
  // "esos pedidos como sabrá la tienda cuando alguien agendó en línea").
  // Antes solo bloqueaba mezclar proveedores CONECTADOS a Mercado Pago;
  // un proveedor SIN conectar igual necesita quedar solo en el carrito —
  // si se mezcla con productos directos de INKognito (o de otro
  // proveedor), el checkout cae al flujo genérico de Nequi/contraentrega,
  // que le pagaría A INKOGNITO por un producto que no es suyo, y el
  // proveedor real nunca se entera del pedido (ver PedidoOnlinePage.jsx,
  // que ahora bloquea el checkout en vez de dejarlo caer a ese flujo
  // cuando detecta un proveedor sin conectar). Regla simple: el carrito
  // solo puede tener productos de UN dueño — todos de un mismo
  // proveedor (conectado o no), o todos directos de INKognito, nunca
  // mezclados.
  const addItem = useCallback((product, category, opts = {}) => {
    const { estudioId = null, estudioNombre = null, mpConectado = false } = opts
    const primero = items[0]
    if (primero && (primero.estudioId || null) !== estudioId) {
      return { ok: false, motivo: 'otro_proveedor', nombreActual: primero.estudioNombre || 'la tienda general' }
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
