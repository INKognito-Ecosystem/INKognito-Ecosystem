// Estandarización visual de fotos de producto (Pilar 2 de "arquitectura
// técnica de un módulo avanzado", 2026-08-09) — transformación EN VIVO vía
// URL de Cloudinary, no reprocesa ni reemplaza el archivo original. Se
// aplica igual a fotos ya cargadas y a las nuevas, sin backfill.
//
// c_pad (rellena en vez de recortar) + fondo blanco: hoy las tarjetas de
// catálogo son cuadradas vía CSS (object-cover), lo que recorta productos
// que no son naturalmente cuadrados (una botella, una caja alargada). Con
// esto la foto completa queda adentro, con relleno blanco si hace falta.
//
// Mismo patrón/guard que _cloudinaryOptimizedUrl en inkognito-panel
// (public/index.html) — si la URL no es una Cloudinary sin transformar
// (ej. algo externo), se devuelve intacta.
export function cloudinarySquare(url, size = 800) {
  if (!url || !url.includes('/upload/')) return url
  return url.replace('/upload/', `/upload/c_pad,w_${size},h_${size},b_white,f_auto,q_auto/`)
}
