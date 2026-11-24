export const SUPPLY_BRANDS_ORDER = [
  { name: 'Tattoo Vision', path: '/supply/brands/tattoo-vision' },
  { name: 'Industrias Warlock', path: '/supply/mobiliario/warlock' },
  { name: 'WJX', path: '/supply/cartridges/wjx' },
  { name: 'Vice Colors', path: '/supply/ink/vice-colors' },
  { name: 'Dynamic', path: '/supply/ink/dynamic' },
  { name: 'Hype Ink', path: '/supply/ink/hype-ink' },
  { name: 'Heaven Pro', path: '/supply/brands/heaven-pro' },
  { name: 'MamaCure', path: '/supply/brands/mamacure' },
  { name: 'Royal Three', path: '/supply/brands/royal-three' },
  { name: 'Don Melo', path: '/supply/brands/don-melo' },
  { name: 'Difuso Galería', path: '/supply/brands/difuso-galeria' },
]

export function getAdjacentBrands(currentIndex) {
  const total = SUPPLY_BRANDS_ORDER.length
  const prev = SUPPLY_BRANDS_ORDER[(currentIndex - 1 + total) % total]
  const next = SUPPLY_BRANDS_ORDER[(currentIndex + 1) % total]
  return { prev, next }
}
