// URLs de artista con nombre en vez de solo número (2026-08-05, pedido de
// Jose: "en ves de numero aparesca el nombre que tiene ese artista"). Se
// arma como "slug-id" (ej. /artista/jhumaneztattoo-11) en vez de un slug
// puro — así no hace falta garantizar que el slug sea único en la base
// (dos artistas podrían llamarse igual), el número al final sigue siendo
// la clave real que se usa para buscarlo. El slug es puramente cosmético/
// SEO, se ignora al leer la URL.
export function slugifyNombre(nombre) {
  return (nombre || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function artistaUrl(artista) {
  const slug = slugifyNombre(artista?.nombre)
  return `/artista/${slug ? `${slug}-` : ''}${artista.id}`
}

// Un link viejo sin slug (solo "/artista/11") o uno nuevo ("/artista/
// jhumaneztattoo-11") deben apuntar al mismo perfil — se toma el último
// grupo de dígitos de la URL, sin importar qué haya antes.
export function idDesdeParam(param) {
  const m = String(param || '').match(/(\d+)$/)
  return m ? m[1] : param
}
