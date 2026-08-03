// Orden de las páginas reales de Gym (coincide con el orden del array
// `servicios` en GymPage.jsx, sin contar "Planos PDF" que no es una página
// propia sino un scroll dentro de /gym) — mismo patrón de flechas prev/next
// que ya usan Store (storeCategoriesOrder.js) y Supply (2026-08-02).
// Suplementos salió de esta lista al independizarse como módulo propio
// (/suplementos, fuera de Gym) — ver SuplePage.jsx.
export const GYM_CATEGORIES_ORDER = [
  { name: 'Máquinas', slug: 'maquinas-pedido' },
  { name: 'Tutoriales', slug: 'tutoriales' },
  { name: 'Cursos', slug: 'cursos' },
  { name: 'Recursos', slug: 'recursos' },
]

export function getAdjacentCategories(slug) {
  const total = GYM_CATEGORIES_ORDER.length
  const idx = GYM_CATEGORIES_ORDER.findIndex(c => c.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  const prev = GYM_CATEGORIES_ORDER[(idx - 1 + total) % total]
  const next = GYM_CATEGORIES_ORDER[(idx + 1) % total]
  return { prev, next }
}
