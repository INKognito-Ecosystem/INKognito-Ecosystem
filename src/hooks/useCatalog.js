import { useState, useEffect } from 'react'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Cache a nivel de módulo: evita re-fetch y el flash de "cargando" al navegar
// entre categorías del mismo módulo (misma lógica que useSupplyVisual).
const cache = {}
const inflight = {}

function fetchCatalog(module) {
  if (cache[module]) return Promise.resolve(cache[module])
  if (!inflight[module]) {
    inflight[module] = fetch(`${PANEL_URL}/api/catalog/${module}`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(data => { cache[module] = data; delete inflight[module]; return data })
      .catch(e => { delete inflight[module]; throw e })
  }
  return inflight[module]
}

/**
 * Fetches the product catalog from the panel.
 * Returns { categorias, allProducts, loading, error }
 * categorias = { "Tintas": [{name, image_url, variantes}], "Espumas": [...] }
 *
 * @param {string} module  'supply' | 'store' | 'suplementos' | 'gym'
 * @param {string} [categoria]  optional filter — returns only that category's products
 */
export function useCatalog(module, categoria = null) {
  const [data, setData] = useState(() => cache[module] || null)
  const [loading, setLoading] = useState(() => !cache[module])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!module) return
    if (cache[module]) {
      setData(cache[module])
      setLoading(false)
      return
    }
    let active = true
    setLoading(true); setError(null)
    fetchCatalog(module)
      .then(d => { if (active) { setData(d); setLoading(false) } })
      .catch(e => { if (active) { setError(e.message); setLoading(false) } })
    return () => { active = false }
  }, [module])

  const full = data || {}
  const categorias = categoria ? { [categoria]: full[categoria] || [] } : full
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
