export const SUPLE_CATEGORIES_ORDER = [
  { name: 'Proteínas',   slug: 'proteinas',   categoria: 'Proteínas' },
  { name: 'Creatina',    slug: 'creatina',    categoria: 'Creatina' },
  { name: 'Pre-entreno', slug: 'pre-entreno', categoria: 'Pre-entreno' },
  { name: 'Vitaminas',   slug: 'vitaminas',   categoria: 'Vitaminas y omega' },
  { name: 'Accesorios',  slug: 'accesorios',  categoria: 'Accesorios' },
]

export function getAdjacentSupleCategories(slug) {
  const total = SUPLE_CATEGORIES_ORDER.length
  const idx = SUPLE_CATEGORIES_ORDER.findIndex(c => c.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  const prev = SUPLE_CATEGORIES_ORDER[(idx - 1 + total) % total]
  const next = SUPLE_CATEGORIES_ORDER[(idx + 1) % total]
  return { prev, next }
}
