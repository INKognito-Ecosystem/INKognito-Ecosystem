// Fotos de respaldo verificadas para las máquinas de Gym System que aún no
// tienen foto cargada en Cloudinary desde el panel. Cuando el admin suba una
// foto propia en el panel (`image_url`), esa siempre manda sobre este respaldo.
const normaliza = (s) =>
  (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

const GYM_FALLBACK_BY_NAME = {
  'jalones al pecho': '/gym-assets/jalones-al-pecho.webp',
  'barra hexagonal': '/gym-assets/barra-hexagonal.webp',
}

export function resolveGymMachineImage(name, imageUrl) {
  if (imageUrl) return imageUrl
  return GYM_FALLBACK_BY_NAME[normaliza(name)] || null
}
