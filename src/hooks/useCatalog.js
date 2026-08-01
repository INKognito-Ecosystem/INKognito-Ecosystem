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

/**
 * Versión para loader (servidor): trae el catálogo de una sola categoría ya
 * separado en físicos/afiliados, lista para usar directo en un route module
 * (`export async function loader() { return fetchCatalogCategoria(...) }`).
 * No usa el cache de módulo (ese es para el cliente) — cada request de
 * servidor es independiente.
 */
export async function fetchCatalogCategoria(module, categoria) {
  try {
    const res = await fetch(`${PANEL_URL}/api/catalog/${module}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const items = data[categoria] || []
    return {
      products: items.filter(p => !p.tipo || p.tipo === 'fisico'),
      afiliados: items.filter(p => p.tipo === 'afiliado'),
    }
  } catch {
    return { products: [], afiliados: [] }
  }
}

/**
 * Versión para loader (servidor): trae los productos de una sola categoría,
 * sin separar físicos/afiliados (para módulos como Store/Gym que no usan ese
 * campo `tipo`) — shape plano `{ items }`, listo para `useLoaderData()`.
 */
export async function fetchCatalogCategoriaItems(module, categoria) {
  try {
    const res = await fetch(`${PANEL_URL}/api/catalog/${module}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return { items: data[categoria] || [] }
  } catch {
    return { items: [] }
  }
}

/**
 * Versión para loader (servidor): trae el catálogo completo de un módulo,
 * ya agrupado por categoría, en el mismo shape que produce `useCatalog`
 * (`{ categorias, allProducts }`) — para usar en route modules tipo
 * `SupplyPage`/`StorePage`/`GymPage` que muestran todas las categorías juntas.
 */
export async function fetchCatalogFull(module) {
  try {
    const res = await fetch(`${PANEL_URL}/api/catalog/${module}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const categorias = await res.json()
    return { categorias, allProducts: Object.values(categorias).flat() }
  } catch {
    return { categorias: {}, allProducts: [] }
  }
}

/**
 * Versión para loader (servidor): productos de un módulo filtrados por
 * `marca` (el mismo slug que usa la ruta de esa marca, ej. 'wjx') — para las
 * páginas de "Marca Profesional" en Supply (WJX, Kwadron, Vice Colors...).
 * Reusa fetchCatalogFull en vez de pegarle a un endpoint aparte — el filtro
 * por marca vive acá, no en el panel.
 */
export async function fetchCatalogMarca(module, marca) {
  const { allProducts } = await fetchCatalogFull(module)
  return { products: allProducts.filter(p => p.marca === marca) }
}

/** Converts a catalog item to the format StoreProductCard expects */
export function toProdCard(item) {
  const firstPrice = item.variantes?.[0]?.price
  return {
    id:     item.name,
    name:   item.name,
    image:  item.image_url || '',
    images: [item.image_url, item.image_url_2, item.image_url_3].filter(Boolean),
    price:  firstPrice ? '$' + Math.round(firstPrice).toLocaleString('es-CO') : '—',
    tag:    item.descripcion || '',
    _item:  item,
  }
}
