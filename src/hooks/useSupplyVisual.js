import { useState, useEffect } from 'react'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

let cache = null
let inflightPromise = null

function fetchVisual() {
  if (cache) return Promise.resolve(cache)
  if (!inflightPromise) {
    inflightPromise = fetch(`${PANEL_URL}/api/visual/supply`)
      .then(r => r.json())
      .then(data => { cache = data; return data })
      .catch(() => { cache = {}; return cache })
  }
  return inflightPromise
}

export function useSupplyVisual(key) {
  // Siempre arranca en undefined, sin mirar el cache de módulo — en el
  // servidor ese cache puede seguir vivo entre requests (según cómo
  // reutilice Vercel la instancia), y el cliente SIEMPRE arranca en
  // undefined (módulo nuevo en el navegador). Si el servidor a veces
  // devolviera el valor ya resuelto y el cliente no, sería un mismatch
  // de hidratación — igual al que ya se corrigió en useScrolled/CuidadosPage.
  const [url, setUrl] = useState(undefined)

  useEffect(() => {
    let active = true
    fetchVisual().then(data => {
      if (active) setUrl(data[key] || null)
    })
    return () => { active = false }
  }, [key])

  return url
}
