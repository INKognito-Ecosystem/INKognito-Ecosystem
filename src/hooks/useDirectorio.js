import { useState, useEffect } from 'react'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Paginación real por cursor del directorio de artistas/estudios (INK,
// 2026-09-14) — mismo principio que useCatalog.js (fetchCatalogPage), pero
// dominio de datos distinto (artistas/estudios, no inventory) así que
// vive en su propio archivo — mismo criterio que ya usa el código para no
// mezclar /api/estudios-tiendas con /api/estudios (motivos de negocio
// distintos, no reusar solo porque el shape se parece).
async function fetchDirectorioPage(endpoint, { q, municipio, departamento, estilo, lat, lng, orden, radioKm, limit = 12, cursor } = {}) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (municipio) params.set('municipio', municipio)
  if (departamento) params.set('departamento', departamento)
  if (estilo) params.set('estilo', estilo)
  if (lat != null) params.set('lat', String(lat))
  if (lng != null) params.set('lng', String(lng))
  if (orden) params.set('orden', orden)
  if (radioKm != null) params.set('radio_km', String(radioKm))
  params.set('limit', String(limit))
  if (cursor) params.set('cursor', cursor)
  try {
    const res = await fetch(`${PANEL_URL}${endpoint}?${params}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch {
    return { items: [], nextCursor: null, hasMore: false }
  }
}

export function fetchArtistasPage(filtros) {
  return fetchDirectorioPage('/api/artistas', filtros)
}
export function fetchEstudiosPage(filtros) {
  return fetchDirectorioPage('/api/estudios', filtros)
}

export const PAGE_SIZE = 12
// "Cerca de ti" — mismo radio que ya usaba filtrarCercaDeTi en el
// frontend antes de esta migración (RADIO_CERCA_KM); el fallback a los 10
// más cercanos del país cuando nadie cae dentro vive ahora en el backend
// (ver GET /api/artistas, fallback de radio en server.js). Exportada
// (2026-09-17) para que el carrusel persistente "Cerca de ti" de
// ArtistasColombiaPage.jsx use el mismo radio en su polling de
// actualización en vivo, sin duplicar el número mágico.
export const RADIO_CERCA_KM = 50

/**
 * Hook de alto nivel del buscador — reemplaza la carga completa +
 * filtrado/orden en memoria (matches(), ordenarPorCercania,
 * filtrarCercaDeTi) que tenía ArtistasColombiaPage.jsx. Busca artistas Y
 * estudios EN PARALELO siempre que hay texto (≥2 caracteres) o "Cerca de
 * ti" activo, para que cambiar de pestaña Artistas/Estudios siga sin
 * disparar un fetch nuevo — mismo comportamiento que ya tenía la página
 * (ambas listas ya cargadas, la pestaña solo decide cuál se muestra).
 *
 * Con texto activo, igual se manda lat/lng (si se conocen) para que cada
 * resultado traiga su distancia_km y la card pueda seguir mostrando "a X
 * km" — el ORDEN pasa a ser por relevancia del texto, no por cercanía
 * (antes SIEMPRE ordenaba por distancia incluso buscando texto; ahora es
 * un criterio nuevo — ver nota en el plan de migración).
 */
export function useDirectorioBusqueda({ query, misCoords, cercaDeTiActivo }) {
  const [artistas, setArtistas] = useState({ items: [], cursor: null, hasMore: false })
  const [estudios, setEstudios] = useState({ items: [], cursor: null, hasMore: false })
  const [cargando, setCargando] = useState(false)
  const [cargandoMasArtistas, setCargandoMasArtistas] = useState(false)
  const [cargandoMasEstudios, setCargandoMasEstudios] = useState(false)

  const tieneQ = query.trim().length >= 2
  const activo = tieneQ || cercaDeTiActivo

  function filtrosActuales(cursor) {
    return tieneQ
      ? { q: query.trim(), limit: PAGE_SIZE, lat: misCoords?.lat, lng: misCoords?.lng, cursor }
      : { lat: misCoords?.lat, lng: misCoords?.lng, radioKm: RADIO_CERCA_KM, orden: 'distancia', limit: PAGE_SIZE, cursor }
  }

  useEffect(() => {
    if (!activo) {
      setArtistas({ items: [], cursor: null, hasMore: false })
      setEstudios({ items: [], cursor: null, hasMore: false })
      return
    }
    let vigente = true
    setCargando(true)
    // Debounce solo en búsqueda de texto (300ms, mismo patrón que
    // SupplyCategoryPage.jsx) — "Cerca de ti" dispara de una, es un solo
    // toque de botón, no algo que se escribe letra a letra.
    const demora = tieneQ ? 300 : 0
    const timer = setTimeout(async () => {
      const filtros = filtrosActuales(null)
      const [ar, er] = await Promise.all([fetchArtistasPage(filtros), fetchEstudiosPage(filtros)])
      if (!vigente) return
      setArtistas({ items: ar.items, cursor: ar.nextCursor, hasMore: ar.hasMore })
      setEstudios({ items: er.items, cursor: er.nextCursor, hasMore: er.hasMore })
      setCargando(false)
    }, demora)
    return () => { vigente = false; clearTimeout(timer) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, cercaDeTiActivo, misCoords?.lat, misCoords?.lng])

  async function cargarMasArtistas() {
    if (!artistas.hasMore || cargandoMasArtistas) return
    setCargandoMasArtistas(true)
    const page = await fetchArtistasPage(filtrosActuales(artistas.cursor))
    setArtistas(prev => ({ items: [...prev.items, ...page.items], cursor: page.nextCursor, hasMore: page.hasMore }))
    setCargandoMasArtistas(false)
  }

  async function cargarMasEstudios() {
    if (!estudios.hasMore || cargandoMasEstudios) return
    setCargandoMasEstudios(true)
    const page = await fetchEstudiosPage(filtrosActuales(estudios.cursor))
    setEstudios(prev => ({ items: [...prev.items, ...page.items], cursor: page.nextCursor, hasMore: page.hasMore }))
    setCargandoMasEstudios(false)
  }

  return {
    artistas: artistas.items,
    hasMoreArtistas: artistas.hasMore,
    cargandoMasArtistas,
    cargarMasArtistas,
    estudios: estudios.items,
    hasMoreEstudios: estudios.hasMore,
    cargandoMasEstudios,
    cargarMasEstudios,
    cargando,
  }
}
