import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const StoreCartContext = createContext(null)
const STORAGE_KEY = 'inkognito-cart-store'

export function StoreCartProvider({ children }) {
  const [items, setItems] = useState([])
  // Selección estilo Mercado Libre (2026-09-16, mismo patrón que
  // SupplyCartContext.jsx) — vive acá para que PedidoOnlinePage.jsx
  // también pueda respetarla al armar el pedido. No se persiste en
  // localStorage a propósito: cada sesión nueva arranca con todo
  // seleccionado.
  const [selectedKeys, setSelectedKeys] = useState(() => new Set())
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

  // Mantiene selectedKeys sincronizado con items — mismo mecanismo que
  // SupplyCartContext.jsx: un producto nuevo entra seleccionado, una key
  // eliminada del carrito se limpia sola.
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
    // politicaEnvio/envioGratisMonto (2026-09-22, Ruta del Golfo) — mismo
    // mecanismo que estudioId/mpConectado: viaja desde el JOIN del
    // catálogo (ver StoreProductCard.jsx) hasta el ítem del carrito, sin
    // ningún fetch nuevo. CartDrawerStore.jsx los lee de vendorLock para
    // la barra de envío gratis.
    const { estudioId = null, estudioNombre = null, mpConectado = false, politicaEnvio = 'cliente_paga', envioGratisMonto = null } = opts
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
      return [...prev, { key, ...product, category, size, qty: 1, estudioId, estudioNombre, mpConectado, politicaEnvio, envioGratisMonto }]
    })
    return { ok: true }
  }, [items])

  // Reemplaza TODO el carrito por un único producto (2026-09-11) — la usa
  // la landing de un solo producto (ProductLandingPage, pensada para
  // publicidad/links directos): a diferencia de addItem, no hereda ni
  // consulta nada del carrito anterior (ni el vendor-lock contra lo viejo,
  // ni cantidad acumulada de clics repetidos) — siempre deja el carrito en
  // exactamente 1 unidad de este producto. Ver comentario en
  // ProductLandingPage.jsx para el bug real que esto corrige.
  const setSingleItem = useCallback((product, category, size = '', opts = {}) => {
    const { estudioId = null, estudioNombre = null, mpConectado = false, politicaEnvio = 'cliente_paga', envioGratisMonto = null } = opts
    const key = `${category}-${product.id}-${size}`
    setItems([{ key, ...product, category, size, qty: 1, estudioId, estudioNombre, mpConectado, politicaEnvio, envioGratisMonto }])
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

  // Elimina varias a la vez (2026-09-16, mismo criterio que
  // SupplyCartContext.jsx) — usado tras un pedido exitoso para borrar solo
  // los productos que de verdad se pidieron.
  const removeItems = useCallback((keys) => {
    const set = new Set(keys)
    setItems(prev => prev.filter(i => !set.has(i.key)))
  }, [])

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
    <StoreCartContext.Provider value={{
      items, addItem, setSingleItem, removeItem, removeItems, changeQty, clearCart, count, total, vendorLock,
      selectedKeys, toggleSelected, setAllSelected, allSelected, selectedItems, selectedCount, selectedTotal,
    }}>
      {children}
    </StoreCartContext.Provider>
  )
}

export function useStoreCart() {
  const ctx = useContext(StoreCartContext)
  if (!ctx) throw new Error('useStoreCart must be inside StoreCartProvider')
  return ctx
}
