// Mismo patrón cíclico que supplyCategoriesOrder.js/gymCategoriesOrder.js
// (2026-09-13, Jose: "como los demás, quiero que acá también estén las
// flechitas para desplazarse") — 3 páginas en vez de una lista larga de
// categorías, pero la misma lógica prev/next envuelta al llegar al final.
export const APRENDE_ORDER = [
  { name: 'Cursos', slug: 'cursos' },
  { name: 'Kit recomendado', slug: 'kit' },
  { name: 'Recursos gratuitos', slug: 'recursos' },
]

export function getAdjacentAprende(slug) {
  const total = APRENDE_ORDER.length
  const idx = APRENDE_ORDER.findIndex(c => c.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  const prev = APRENDE_ORDER[(idx - 1 + total) % total]
  const next = APRENDE_ORDER[(idx + 1) % total]
  return { prev, next }
}
