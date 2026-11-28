import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'

const STORAGE_KEY = 'kg_favoritos_v1'
const UNSEEN_KEY = 'kg_favoritos_unseen_v1'
const EMPTY = { artistas: [], estudios: [], disenos: [], stands: [] }

const InkFavoritosContext = createContext(null)

function sanitizarLista(arr) {
  if (!Array.isArray(arr)) return []
  return arr.filter(it => it && it.id != null)
}

export function InkFavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState(EMPTY)
  const [unseenCount, setUnseenCount] = useState(0)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setFavoritos({
          artistas: sanitizarLista(parsed?.artistas),
          estudios: sanitizarLista(parsed?.estudios),
          disenos: sanitizarLista(parsed?.disenos),
          stands: sanitizarLista(parsed?.stands),
        })
      }
      const unseenRaw = parseInt(localStorage.getItem(UNSEEN_KEY) || '0', 10)
      if (Number.isFinite(unseenRaw) && unseenRaw > 0) setUnseenCount(unseenRaw)
    } catch {
      // localStorage bloqueado o corrupto — arranca vacío sin romper SSR
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos))
      localStorage.setItem(UNSEEN_KEY, String(unseenCount))
    } catch {}
  }, [favoritos, unseenCount, hydrated])

  const esFavorito = useCallback((tipo, id) => {
    if (!tipo || id == null) return false
    const lista = favoritos[tipo]
    if (!Array.isArray(lista)) return false
    return lista.some(it => String(it.id) === String(id))
  }, [favoritos])

  const toggleFavorito = useCallback((tipo, item) => {
    if (!tipo || !item || item.id == null) return
    setFavoritos(prev => {
      const lista = Array.isArray(prev[tipo]) ? prev[tipo] : []
      const existe = lista.some(it => String(it.id) === String(item.id))
      const siguiente = existe
        ? lista.filter(it => String(it.id) !== String(item.id))
        : [{ ...item, savedAt: Date.now() }, ...lista]
      setUnseenCount(u => (existe ? Math.max(0, u - 1) : u + 1))
      return { ...prev, [tipo]: siguiente }
    })
  }, [])

  const quitarFavorito = useCallback((tipo, id) => {
    if (!tipo || id == null) return
    setFavoritos(prev => ({
      ...prev,
      [tipo]: (prev[tipo] || []).filter(it => String(it.id) !== String(id)),
    }))
    setUnseenCount(u => Math.max(0, u - 1))
  }, [])

  const marcarFavoritosVistos = useCallback(() => {
    setUnseenCount(0)
  }, [])

  const totalCount = useMemo(
    () => favoritos.artistas.length + favoritos.estudios.length + favoritos.disenos.length + favoritos.stands.length,
    [favoritos]
  )

  const value = useMemo(
    () => ({ favoritos, hydrated, totalCount, unseenCount, esFavorito, toggleFavorito, quitarFavorito, marcarFavoritosVistos }),
    [favoritos, hydrated, totalCount, unseenCount, esFavorito, toggleFavorito, quitarFavorito, marcarFavoritosVistos]
  )

  return (
    <InkFavoritosContext.Provider value={value}>
      {children}
    </InkFavoritosContext.Provider>
  )
}

export function useInkFavoritos() {
  const ctx = useContext(InkFavoritosContext)
  if (!ctx) {
    return {
      favoritos: EMPTY,
      hydrated: false,
      totalCount: 0,
      unseenCount: 0,
      esFavorito: () => false,
      toggleFavorito: () => {},
      quitarFavorito: () => {},
      marcarFavoritosVistos: () => {},
    }
  }
  return ctx
}
