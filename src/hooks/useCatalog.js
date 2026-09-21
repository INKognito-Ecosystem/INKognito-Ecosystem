import { useState } from 'react'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// ─── Paginación real por cursor (2026-09-14) ──────────────────────────
// `/api/catalog/:module` con categoria/marca/estudio_id/tipo/q/orden/
// limit/cursor ya no trae el módulo completo — ver plan en
// C:\Users\USUARIO\.claude\plans\typed-toasting-lampson.md y la
// implementación en inkognito-panel/src/server.js (línea ~8236). Un solo
// punto de entrada de bajo nivel (fetchCatalogPage) que tanto los loaders
// (primera página, servidor) como las interacciones del cliente (buscar,
// ordenar, filtrar por proveedor, "cargar más") usan directamente — sin
// pasar por el cache de fetchCatalog(), porque cada combinación de
// filtros/cursor es una consulta distinta, no "el catálogo" completo.
export async function fetchCatalogPage(module, { categoria, marca, estudioId, tipo, q, orden, limit = 24, cursor } = {}) {
  const params = new URLSearchParams()
  if (categoria) params.set('categoria', categoria)
  if (marca) params.set('marca', marca)
  if (estudioId != null) params.set('estudio_id', String(estudioId))
  if (tipo) params.set('tipo', tipo)
  if (q) params.set('q', q)
  if (orden) params.set('orden', orden)
  params.set('limit', String(limit))
  if (cursor) params.set('cursor', cursor)
  try {
    const res = await fetch(`${PANEL_URL}/api/catalog/${module}?${params}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch {
    return { items: [], nextCursor: null, hasMore: false }
  }
}

/**
 * Modo liviano `{categoria: cantidad}` — para grillas tipo "Categorías" que
 * antes traían el módulo completo solo para hacer `.length` por categoría.
 */
export async function fetchCatalogCounts(module) {
  try {
    const res = await fetch(`${PANEL_URL}/api/catalog/${module}?counts=1`)
    if (!res.ok) return {}
    return await res.json()
  } catch {
    return {}
  }
}

/** Proveedores distintos que venden en una categoría — para el filtro de proveedor. */
export async function fetchCatalogProviders(module, categoria) {
  try {
    const res = await fetch(`${PANEL_URL}/api/catalog/${module}?categoria=${encodeURIComponent(categoria)}&providers=1`)
    if (!res.ok) return []
    const data = await res.json()
    return data.providers || []
  } catch {
    return []
  }
}

/**
 * Versión para loader (servidor): primera página de una categoría, ya
 * separada en físicos (paginados de verdad, PAGE_SIZE a la vez) y
 * afiliados (lista completa — son recursos curados, no inventario con
 * volumen real, así que no necesitan "cargar más"), más el listado de
 * proveedores para el filtro. Reemplaza al viejo fetchCatalogCategoria que
 * traía el módulo entero y filtraba en JS.
 */
export async function fetchCatalogCategoria(module, categoria, { limit = 12, orden, q, soloFisicos = false } = {}) {
  try {
    // `soloFisicos` (2026-09-21) — las páginas que no muestran la sección de
    // afiliados ni el filtro de proveedor (las 5 categorías de Suple) se
    // ahorran esas 2 llamadas al panel en cada navegación; con la base a
    // ~150 ms por consulta, cada llamada de más pesaba de verdad.
    const [fisicos, afiliadosPage, providers] = await Promise.all([
      fetchCatalogPage(module, { categoria, tipo: 'fisico', limit, orden, q }),
      soloFisicos ? { items: [] } : fetchCatalogPage(module, { categoria, tipo: 'afiliado', limit: 100 }),
      soloFisicos ? [] : fetchCatalogProviders(module, categoria),
    ])
    return {
      products: fisicos.items,
      nextCursor: fisicos.nextCursor,
      hasMore: fisicos.hasMore,
      afiliados: afiliadosPage.items,
      providers,
    }
  } catch {
    return { products: [], nextCursor: null, hasMore: false, afiliados: [], providers: [] }
  }
}

/**
 * Versión para loader (servidor): primera página de productos de una sola
 * categoría, sin separar físicos/afiliados (para módulos como Store/Gym que
 * no usan ese campo `tipo` para separar secciones) — shape `{ items,
 * nextCursor, hasMore }`, listo para `useLoaderData()` + useLoadMore().
 *
 * Fase 2 (2026-09-14) — antes traía el MÓDULO COMPLETO vía fetchRawCatalog
 * solo para quedarse con `data[categoria]`; ahora pide directo esa
 * categoría, paginada, al servidor.
 */
export async function fetchCatalogCategoriaItems(module, categoria, { limit = 24 } = {}) {
  const { items, nextCursor, hasMore } = await fetchCatalogPage(module, { categoria, limit })
  return { items, nextCursor, hasMore }
}

/**
 * Versión para loader (servidor): primera página (hasta 100) de productos de
 * un módulo filtrados por `marca` (el mismo slug que usa la ruta de esa
 * marca, ej. 'wjx') — para las páginas de "Marca Profesional" en Supply
 * (WJX, Kwadron, Vice Colors...). Antes traía el módulo completo y filtraba
 * en JS; ahora el filtro vive en el servidor. `nextCursor`/`hasMore` quedan
 * disponibles para que la página agregue "cargar más" con useLoadMore() si
 * algún día una marca supera los 100 productos — hoy ninguna lo hace.
 */
export async function fetchCatalogMarca(module, marca, { limit = 100 } = {}) {
  const { items, nextCursor, hasMore } = await fetchCatalogPage(module, { marca, limit })
  return { products: items, nextCursor, hasMore }
}

/**
 * Supply multitenant (fase 4, 2026-08-07) — productos de un módulo
 * cargados por un estudio-vendedor específico (`inventory.estudio_id`),
 * para la vista filtrada que se abre desde el perfil de ese estudio en
 * Tattoo Artist Colombia. Antes reusaba fetchCatalogFull + filter (traía el
 * módulo entero); ahora pide directo por estudio_id al servidor.
 */
export async function fetchCatalogEstudio(module, estudioId, { limit = 100 } = {}) {
  const { items, nextCursor, hasMore } = await fetchCatalogPage(module, { estudioId, limit })
  return { products: items, nextCursor, hasMore }
}

/**
 * Hook genérico de "cargar más" sobre fetchCatalogPage (2026-09-14) — para
 * vistas SIN filtros propios que convertir (páginas de marca/estudio de
 * Supply, y fase 2: categorías de Store/Suplementos/Gym): reciben la
 * primera página ya resuelta por el loader y solo necesitan poder pedir
 * más. `filters` fijo por instancia (marca/estudioId/categoria/tipo) — si
 * cambia (ej. el usuario navega a otra marca sin remontar el componente),
 * reinicia desde la página inicial en vez de seguir acumulando de la marca
 * anterior.
 */
export function useLoadMore(module, filters, initial) {
  const filtersKey = JSON.stringify(filters)
  const [items, setItems] = useState(initial.items || [])
  const [cursor, setCursor] = useState(initial.nextCursor || null)
  const [hasMore, setHasMore] = useState(!!initial.hasMore)
  const [loading, setLoading] = useState(false)
  const [key, setKey] = useState(filtersKey)

  if (filtersKey !== key) {
    setKey(filtersKey)
    setItems(initial.items || [])
    setCursor(initial.nextCursor || null)
    setHasMore(!!initial.hasMore)
  }

  async function loadMore() {
    if (!hasMore || loading) return
    setLoading(true)
    try {
      const page = await fetchCatalogPage(module, { ...filters, cursor })
      setItems(prev => [...prev, ...page.items])
      setCursor(page.nextCursor)
      setHasMore(page.hasMore)
    } finally {
      setLoading(false)
    }
  }

  return { items, hasMore, loading, loadMore }
}

/**
 * Preguntas frecuentes de Supply (2026-08-09) — antes vivían hardcodeadas
 * en cada página .jsx de categoría/marca; ahora en `supply_faq` (panel),
 * editables desde Configuración sin tocar código. El servidor ya devuelve
 * general + el nivel pedido combinado — acá no hay que sumar nada, solo
 * pasar el parámetro correcto. Server-side (llamado desde loader()), no
 * client-side — el contenido de FAQ sí aporta SEO/AEO real y debe venir
 * en el HTML ya renderizado, no aparecer recién después de hidratar.
 */
export async function fetchSupplyFaq({ categoria, marca } = {}) {
  const qs = categoria ? `categoria=${encodeURIComponent(categoria)}` : `marca=${encodeURIComponent(marca)}`
  try {
    const res = await fetch(`${PANEL_URL}/api/supply-faq?${qs}`)
    if (!res.ok) return []
    const data = await res.json()
    return data.items || []
  } catch {
    return []
  }
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
