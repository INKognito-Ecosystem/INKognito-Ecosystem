import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const SupplyCartContext = createContext(null)
const STORAGE_KEY = 'inkognito-cart-supply'

export function SupplyCartProvider({ children }) {
  const [items, setItems] = useState([])
  // Selección estilo Mercado Libre (2026-09-15, Jose: "transformar nuestro
  // carrito de esta manera... cuadro para marcar o desmarcar dentro del
  // carrito") — vive acá (no solo en CartDrawerSupply.jsx) para que
  // PedidoOnlinePage.jsx también pueda respetarla al armar el pedido, sin
  // que el drawer tenga que pasarle nada por props. No se persiste en
  // localStorage a propósito: cada sesión nueva arranca con todo
  // seleccionado (el default esperable), más simple que sincronizar dos
  // claves de storage.
  const [selectedKeys, setSelectedKeys] = useState(() => new Set())
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

  // Mantiene selectedKeys sincronizado con items: un producto nuevo entra
  // seleccionado por default (igual que Mercado Libre), y una key que ya
  // no está en el carrito (eliminada) se limpia sola.
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

  // Reemplaza TODO el carrito por un único producto (2026-09-11) — ver
  // comentario gemelo en StoreCartContext.jsx (mismo motivo, mismo bug
  // corregido en ProductLandingPage.jsx).
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

  // Elimina varias a la vez (2026-09-15) — usado por PedidoOnlinePage.jsx
  // tras un pedido exitoso: solo se borran los productos que de verdad se
  // pidieron (los seleccionados), no todo el carrito — si el comprador
  // dejó algo desmarcado a propósito, sigue ahí para después.
  const removeItems = useCallback((keys) => {
    const set = new Set(keys)
    setItems(prev => prev.filter(i => !set.has(i.key)))
  }, [])

  const changeQty = useCallback((key, qty) => {
    if (qty < 1) {
      setItems(prev => prev.filter(i => i.key !== key))
      return
    }
    setItems(prev => prev.map(i => i.key === key ? { ...i, qty } : i))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  // Selección (ver comentario junto a selectedKeys más arriba).
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
    <SupplyCartContext.Provider value={{
      items, addItem, setSingleItem, removeItem, removeItems, changeQty, clearCart, count, total, vendorLock,
      selectedKeys, toggleSelected, setAllSelected, allSelected, selectedItems, selectedCount, selectedTotal,
    }}>
      {children}
    </SupplyCartContext.Provider>
  )
}

export function useSupplyCart() {
  const ctx = useContext(SupplyCartContext)
  if (!ctx) throw new Error('useSupplyCart must be inside SupplyCartProvider')
  return ctx
}
