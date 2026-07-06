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
  const [url, setUrl] = useState(() => (cache ? (cache[key] || null) : undefined))

  useEffect(() => {
    let active = true
    fetchVisual().then(data => {
      if (active) setUrl(data[key] || null)
    })
    return () => { active = false }
  }, [key])

  return url
}
