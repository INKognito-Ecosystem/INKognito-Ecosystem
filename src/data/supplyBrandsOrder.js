export const SUPPLY_BRANDS_ORDER = [
  { name: 'Tattoo Vision', path: '/supply/brands/tattoo-vision' },
  { name: 'WJX', path: '/supply/cartridges/wjx' },
  { name: 'Vice Colors', path: '/supply/ink/vice-colors' },
  { name: 'Dynamic', path: '/supply/ink/dynamic' },
  { name: 'Heaven Pro', path: '/supply/brands/heaven-pro' },
  { name: 'Royal Three', path: '/supply/brands/royal-three' },
  { name: 'Kwadron', path: '/supply/cartridges/kwadron' },
]

export function getAdjacentBrands(currentIndex) {
  const total = SUPPLY_BRANDS_ORDER.length
  const prev = SUPPLY_BRANDS_ORDER[(currentIndex - 1 + total) % total]
  const next = SUPPLY_BRANDS_ORDER[(currentIndex + 1) % total]
  return { prev, next }
}
