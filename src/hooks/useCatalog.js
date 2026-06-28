import { useState, useEffect } from 'react'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

/**
 * Fetches the product catalog from the panel.
 * Returns { categorias, loading, error }
 * categorias = { "Tintas": [{name, image_url, variantes}], "Espumas": [...] }
 *
 * @param {string} module  'supply' | 'store' | 'suplementos' | 'gym'
 * @param {string} [categoria]  optional filter — returns only that category's products
 */
export function useCatalog(module, categoria = null) {
  const [categorias, setCategorias] = useState({})
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  useEffect(() => {
    if (!module) return
    setLoading(true); setError(null)
    fetch(`${PANEL_URL}/api/catalog/${module}`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(data => {
        // API returns { "Tintas": [...], "Espumas": [...] }
        if (categoria) {
          // Return only one category as flat array via special key
          setCategorias({ [categoria]: data[categoria] || [] })
        } else {
          setCategorias(data)
        }
        setLoading(false)
      })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [module, categoria])

  // Convenience: flat list of all products
  const allProducts = Object.values(categorias).flat()

  return { categorias, allProducts, loading, error }
}

/** Converts a catalog item to the format StoreProductCard expects */
export function toProdCard(item) {
  const firstPrice = item.variantes?.[0]?.price
  return {
    id:    item.name,
    name:  item.name,
    image: item.image_url || '',
    price: firstPrice ? '$' + Math.round(firstPrice).toLocaleString('es-CO') : '—',
    tag:   item.descripcion || '',
    _item: item,
  }
}
