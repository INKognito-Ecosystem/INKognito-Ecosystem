export const SUPPLY_CATEGORIES_ORDER = [
  { name: 'Tintas', slug: 'ink' },
  { name: 'Cartuchos', slug: 'cartridges' },
  { name: 'Agujas', slug: 'needles' },
  { name: 'Máquinas', slug: 'machines' },
  { name: 'Guantes', slug: 'gloves' },
  { name: 'Cuidados', slug: 'aftercare' },
  { name: 'Fuentes', slug: 'power-supplies' },
  { name: 'Accesorios', slug: 'accessories' },
  { name: 'Mobiliario', slug: 'furniture' },
  { name: 'Combos', slug: 'bundles' },
]

export function getAdjacentCategories(slug) {
  const total = SUPPLY_CATEGORIES_ORDER.length
  const idx = SUPPLY_CATEGORIES_ORDER.findIndex(c => c.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  const prev = SUPPLY_CATEGORIES_ORDER[(idx - 1 + total) % total]
  const next = SUPPLY_CATEGORIES_ORDER[(idx + 1) % total]
  return { prev, next }
}
