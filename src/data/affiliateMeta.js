// Métricas reales verificadas en cada plataforma (Amazon, Mercado Libre, Hotmart)
// para enriquecer las cards y landings de productos afiliados sin inventar datos.
// Si el panel/API en el futuro envía `rating`, `reviews` o `temperatura`, esos
// valores tienen prioridad sobre este mapa.

const AFFILIATE_META_BY_ID = {
  // Hotmart Cursos (verificados en vivo en Mercado de Afiliación Hotmart)
  163: {
    rating: 4.9,
    reviews: '79',
    temperatura: 14,
    priceLabel: '$1.300.000 COP',
  },
  162: {
    rating: 5.0,
    reviews: '2',
    temperatura: 21,
    priceLabel: 'US$126.04',
  },
  250239: {
    rating: 5.0,
    reviews: '1',
    temperatura: 16,
    priceLabel: 'US$11.99',
  },
  250278: {
    rating: 4.3,
    reviews: '4',
    temperatura: 19,
    priceLabel: 'US$39.00',
  },
  250279: {
    rating: 4.4,
    reviews: '5',
    temperatura: 14,
    priceLabel: 'US$35.00',
  },
  // Amazon (verificados en vivo 2026-11-24 con envío a Colombia)
  250280: {
    rating: 4.6,
    reviews: '2.4k',
    priceLabel: 'US$41.14',
    shipping: 'Envío gratis CO',
  },
  250281: {
    rating: 4.7,
    reviews: '40k+',
    priceLabel: 'US$39.99',
    shipping: 'Envío gratis CO',
  },
  250282: {
    rating: 4.5,
    reviews: '563',
    priceLabel: 'US$33.99',
    shipping: 'Envío a CO',
  },
}

const normaliza = (s) =>
  (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

const AFFILIATE_META_BY_KEYWORD = [
  { match: 'hernan yepes', meta: AFFILIATE_META_BY_ID[163] },
  { match: 'curso tecnico', meta: AFFILIATE_META_BY_ID[163] },
  { match: 'reinvencion creativa', meta: AFFILIATE_META_BY_ID[162] },
  { match: 'entrena tu pulso', meta: AFFILIATE_META_BY_ID[250239] },
  { match: 'mejore su pulso', meta: AFFILIATE_META_BY_ID[250239] },
  { match: 'tatuajes para principiantes', meta: AFFILIATE_META_BY_ID[250278] },
  { match: 'guia autodidacta', meta: AFFILIATE_META_BY_ID[250279] },
  { match: 'tatuaje bajo lupa', meta: AFFILIATE_META_BY_ID[250279] },
  { match: 'spirit', meta: AFFILIATE_META_BY_ID[250280] },
  { match: 'hustle butter', meta: AFFILIATE_META_BY_ID[250281] },
  { match: 'lampara led de pie para tatuajes 18w', meta: AFFILIATE_META_BY_ID[250282] },
]

export function getAffiliateMeta(item) {
  if (!item || item.tipo !== 'afiliado') return null

  // Prioridad 1: campos directos desde el panel si existen
  if (item.rating || item.temperatura || item.reviews) {
    return {
      rating: item.rating ?? null,
      reviews: item.reviews ?? null,
      temperatura: item.temperatura ?? null,
      priceLabel: item.price_label ?? null,
      shipping: item.shipping_label ?? null,
    }
  }

  // Prioridad 2: match por ID de inventario (primera variante o id directo)
  const firstId = item.variantes?.[0]?.id ?? item.id
  if (firstId && AFFILIATE_META_BY_ID[firstId]) {
    return AFFILIATE_META_BY_ID[firstId]
  }

  // Prioridad 3: match por nombre normalizado
  const nameNorm = normaliza(item.name)
  const hit = AFFILIATE_META_BY_KEYWORD.find((k) => nameNorm.includes(k.match))
  return hit ? hit.meta : null
}
