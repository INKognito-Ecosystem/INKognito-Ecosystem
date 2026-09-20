// `link` (2026-09-19, migración de Suple a fondo blanco) — mismo criterio que
// storeCategories: la página de categorías, el menú inferior y la ficha de
// producto arman sus enlaces desde acá en vez de repetir la ruta a mano.
export const SUPLE_CATEGORIES_ORDER = [
  { name: 'Proteínas',   slug: 'proteinas',   categoria: 'Proteínas',         link: '/suplementos/proteinas' },
  { name: 'Creatina',    slug: 'creatina',    categoria: 'Creatina',          link: '/suplementos/creatina' },
  { name: 'Pre-entreno', slug: 'pre-entreno', categoria: 'Pre-entreno',       link: '/suplementos/pre-entreno' },
  { name: 'Vitaminas',   slug: 'vitaminas',   categoria: 'Vitaminas y omega', link: '/suplementos/vitaminas' },
  { name: 'Accesorios',  slug: 'accesorios',  categoria: 'Accesorios',        link: '/suplementos/accesorios' },
]

// Nombre de categoría en la base ("Vitaminas y omega") → su entrada de arriba.
export function getSupleCategoryByCategoria(categoria) {
  return SUPLE_CATEGORIES_ORDER.find(c => c.categoria === categoria) || null
}

export function getAdjacentSupleCategories(slug) {
  const total = SUPLE_CATEGORIES_ORDER.length
  const idx = SUPLE_CATEGORIES_ORDER.findIndex(c => c.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  const prev = SUPLE_CATEGORIES_ORDER[(idx - 1 + total) % total]
  const next = SUPLE_CATEGORIES_ORDER[(idx + 1) % total]
  return { prev, next }
}
