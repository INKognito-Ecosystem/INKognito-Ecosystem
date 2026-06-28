import { useState, useEffect } from 'react'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel.vercel.app'

/**
 * Carga el catálogo de productos desde el panel (PostgreSQL).
 * Solo devuelve productos con stock > 0 e is_active = true.
 * Los productos se agrupan por nombre; cada grupo tiene sus variantes (tallas/sabores).
 *
 * @param {string} module  'supply' | 'store' | 'suplementos' | 'gym'
 */
export function useCatalog(module) {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    if (!module) return
    setLoading(true)
    setError(null)
    fetch(`${PANEL_URL}/api/catalog/${module}`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(data => { setProducts(data); setLoading(false) })
      .catch(e  => { setError(e.message); setLoading(false) })
  }, [module])

  return { products, loading, error }
}

/**
 * Convierte un item del catálogo al formato que espera StoreProductCard.
 * price → string formateado, image → image_url, sizes → variantes
 */
export function toProdCard(item) {
  const firstPrice = item.variantes?.[0]?.price
  return {
    id:     item.name,
    name:   item.name,
    image:  item.image_url || '',
    price:  firstPrice ? '$' + Math.round(firstPrice).toLocaleString('es-CO') : '—',
    tag:    item.descripcion || '',
    _item:  item, // referencia original por si se necesita
  }
}
