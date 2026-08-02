export const STORE_CATEGORIES_ORDER = [
  { name: 'Ropa Dama', slug: 'ropa-dama' },
  { name: 'Ropa Caballeros', slug: 'ropa-caballeros' },
  { name: 'Zapatos Deportivos', slug: 'zapatos-deportivos' },
  { name: 'Zapatos Casuales', slug: 'zapatos-casuales' },
  { name: 'Guayos', slug: 'guayos' },
  { name: 'Tenis y Guayo', slug: 'tenis-guayo' },
]

export function getAdjacentCategories(slug) {
  const total = STORE_CATEGORIES_ORDER.length
  const idx = STORE_CATEGORIES_ORDER.findIndex(c => c.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  const prev = STORE_CATEGORIES_ORDER[(idx - 1 + total) % total]
  const next = STORE_CATEGORIES_ORDER[(idx + 1) % total]
  return { prev, next }
}
