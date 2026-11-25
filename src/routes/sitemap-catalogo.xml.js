// Sitemap dinámico SSR: indexa automáticamente en Google todas las fichas de
// productos físicos, cursos, Equípate bien, Recursos y PDFs oficiales de
// INKognito sin tener que editar sitemap.xml a mano cada vez que subes algo.

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://inkognito-ecosystem.com').replace(/\/$/, '')
const PANEL_URL = (import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app').replace(/\/$/, '')

const STATIC_EXTRA = [
  { path: '/supply/categorias', priority: '0.8', changefreq: 'weekly' },
  { path: '/supply/aprende/cursos', priority: '0.9', changefreq: 'weekly' },
  { path: '/supply/aprende/kit', priority: '0.9', changefreq: 'weekly' },
  { path: '/supply/aprende/recursos', priority: '0.9', changefreq: 'weekly' },
  { path: '/recursos/consentimiento-informado-tatuaje-colombia.pdf', priority: '0.8', changefreq: 'monthly' },
  { path: '/recursos/checklist-bioseguridad-estudio-colombia.pdf', priority: '0.8', changefreq: 'monthly' },
  { path: '/recursos/tabla-agujas-cartuchos-voltajes-inkognito.pdf', priority: '0.8', changefreq: 'monthly' },
]

function escXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

async function fetchModuleProductPaths(moduleName, routePrefix) {
  try {
    const res = await fetch(`${PANEL_URL}/api/catalog/${moduleName}`, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return []
    const data = await res.json()
    const items = Object.values(data).flat()
    const seen = new Set()
    const paths = []
    for (const item of items) {
      const id = item?.variantes?.[0]?.id ?? item?.id
      if (id != null && !seen.has(id)) {
        seen.add(id)
        paths.push({ path: `${routePrefix}/${id}`, priority: '0.8', changefreq: 'weekly' })
      }
    }
    return paths
  } catch {
    return []
  }
}

export async function loader() {
  const [supplyPaths, storePaths, suplePaths] = await Promise.all([
    fetchModuleProductPaths('supply', '/supply/producto'),
    fetchModuleProductPaths('store', '/store/producto'),
    fetchModuleProductPaths('suplementos', '/suplementos/producto'),
  ])

  const today = new Date().toISOString().slice(0, 10)
  const urls = [...STATIC_EXTRA, ...supplyPaths, ...storePaths, ...suplePaths]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (u) =>
        `  <url>\n    <loc>${escXml(`${SITE_URL}${u.path}`)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join('\n')}\n</urlset>`

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
