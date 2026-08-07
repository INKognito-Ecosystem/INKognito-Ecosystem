// Link real de Google Maps para el chip de ubicación (2026-08-07, Jose:
// "conectar el botón de ubicación con el mapa real de ese negocio, hay
// estudios/supplys que se registran en google"). Tres niveles, del más
// específico al más genérico — nunca deja el chip sin link:
// 1. google_maps_url propio, si ya tienen ficha real de Google Maps.
// 2. lat/lng capturados ("Agregar ubicación exacta") — pin exacto.
// 3. Búsqueda por nombre+municipio — a veces resuelve solo a su ficha
//    real si ya está registrado en Google, aunque no lo hayan pegado acá.
export function urlGoogleMaps({ google_maps_url, lat, lng, nombre, municipio, departamento }) {
  if (google_maps_url) return google_maps_url
  if (lat != null && lng != null) return `https://www.google.com/maps?q=${lat},${lng}`
  const query = [nombre, municipio, departamento].filter(Boolean).join(' ')
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
