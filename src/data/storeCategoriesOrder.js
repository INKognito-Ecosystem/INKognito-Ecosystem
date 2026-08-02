import { categories } from './storeCategories.jsx'

// getAdjacentCategories ahora navega DENTRO del mismo grupo (deportiva/
// casual, ver storeCategories.jsx) en vez de cruzar las 6 categorías reales
// como un solo ciclo — al entrar desde una de las 2 mega-cards del hub se
// aterriza directo en la primera categoría de ese grupo, y las flechas
// prev/next se quedan navegando entre las categorías de ese mismo grupo,
// sin pasar por una página intermedia de lista (decisión de Jose,
// 2026-08-02). Si el grupo tiene una sola categoría (Casual hoy, con solo
// Zapatos Casuales), prev/next apuntan a sí misma — deja de ser un loop
// vacío en cuanto se sume una segunda categoría casual.
export function getAdjacentCategories(slug) {
  const current = categories.find(c => c.link === `/store/${slug}`)
  if (!current) return { prev: null, next: null }

  const groupItems = categories.filter(c => c.group === current.group)
  const total = groupItems.length
  const idx = groupItems.findIndex(c => c.link === current.link)
  const toRef = c => ({ name: c.name, slug: c.link.replace('/store/', '') })

  return {
    prev: toRef(groupItems[(idx - 1 + total) % total]),
    next: toRef(groupItems[(idx + 1) % total]),
  }
}
