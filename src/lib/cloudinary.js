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

// Fotos de artistas/estudios (2026-08-11) — a diferencia de cloudinarySquare
// (c_pad + fondo blanco, pensado para fotos de PRODUCTO donde no se puede
// recortar nada), acá sí se puede recortar sin perder información
// importante: son retratos/portadas que ya se muestran dentro de una caja
// de aspecto fijo con object-cover. c_fill + g_auto deja que Cloudinary
// elija el recorte que mejor conserva el sujeto en vez de cortar el centro
// a ciegas. Sin esto, una foto subida a resolución completa de celular se
// descarga entera para mostrarse en una card de ~300px.
export function cloudinaryFill(url, w, h) {
  if (!url || !url.includes('/upload/')) return url
  return url.replace('/upload/', `/upload/c_fill,g_auto,w_${w},h_${h},f_auto,q_auto/`)
}

// Para vistas tipo lightbox (object-contain, sin recorte): c_limit solo
// reduce si la imagen original es más grande que `max`, nunca recorta ni
// agranda — mantiene la proporción original tal cual la subió el usuario.
export function cloudinaryLimit(url, max = 1600) {
  if (!url || !url.includes('/upload/')) return url
  return url.replace('/upload/', `/upload/c_limit,w_${max},h_${max},f_auto,q_auto/`)
}
