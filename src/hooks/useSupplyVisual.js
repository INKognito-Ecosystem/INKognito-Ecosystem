import { useState, useEffect } from 'react'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Fallbacks locales inmediatos para evitar fallos de render en localhost o DNS offline
export const SUPPLY_LOCAL_LOGOS = {
  supply_brand_tattoo_vision: '/supply-assets/logos/supply_brand_tattoo_vision.webp',
  supply_brand_heaven_pro: '/supply-assets/logos/supply_brand_heaven_pro.webp',
  supply_brand_wjx: '/supply-assets/logos/supply_brand_wjx.webp',
  supply_brand_kwadron: '/supply-assets/logos/supply_brand_kwadron.jpg',
  supply_brand_royal_three: '/supply-assets/logos/supply_brand_royal_three.png',
  supply_brand_dynamic: '/supply-assets/logos/supply_brand_dynamic.jpg',
  supply_brand_vice_colors: '/supply-assets/logos/supply_brand_vice_colors.png',
  supply_brand_don_melo: '/marcas-marquee/don-melo.png',
  supply_brand_difuso_galeria: '/marcas-marquee/difuso-galeria.png',
}

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
  // Inicializa con el fallback local si existe, evitando parpadeos o pantallas vacías
  const [url, setUrl] = useState(() => SUPPLY_LOCAL_LOGOS[key] || undefined)

  useEffect(() => {
    let active = true
    fetchVisual().then(data => {
      if (active) {
        setUrl(data[key] || SUPPLY_LOCAL_LOGOS[key] || null)
      }
    })
    return () => { active = false }
  }, [key])

  return url
}

