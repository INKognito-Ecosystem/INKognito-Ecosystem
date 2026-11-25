import { useLoaderData } from 'react-router'
import { PANEL_URL, SeccionAfiliados, AprendePageShell } from './AprendeShared'

export async function loader() {
  try {
    const res = await fetch(`${PANEL_URL}/api/catalog/supply`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const kitExt = Object.values(data).flat()
      .filter(p => p.tipo === 'afiliado' && p.categoria === 'Kit Externo')
    return { kitExt }
  } catch {
    return { kitExt: [] }
  }
}

export function meta({ data }) {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://inkognito-ecosystem.com'
  const title = 'Equípate Bien — Insumos Recomendados | INKognito Supply'
  const description = 'Selección curada por tatuadores en Amazon y Mercado Libre con envío verificado a Colombia. Equipo confiable, buenas calificaciones y cero sobrecostos.'
  const items = data?.kitExt || []
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Equípate Bien — Insumos y Equipos Recomendados para Tatuar',
    description,
    url: `${siteUrl}/supply/aprende/kit`,
    numberOfItems: items.length,
    itemListElement: items.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        description: p.descripcion || description,
        ...(p.image_url ? { image: p.image_url } : {}),
        url: p.variantes?.[0]?.id ? `${siteUrl}/supply/producto/${p.variantes[0].id}` : `${siteUrl}/supply/aprende/kit`,
      },
    })),
  }
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${siteUrl}/supply/aprende/kit` },
    { 'script:ld+json': itemListLd },
  ]
}

export default function KitPage() {
  const { kitExt } = useLoaderData()

  return (
    <AprendePageShell
      slug="kit"
      eyebrow="Amazon · Mercado Libre · Envío verificado a Colombia"
      titulo={<>Equípate bien<br /><span className="text-zinc-500">sin pagar de más</span></>}
      descripcion="Selección curada por tatuadores en Amazon y Mercado Libre con envío verificado a Colombia. Comparamos calificaciones reales, durabilidad y relación costo-beneficio para que inviertas solo en equipo que sí responde en cabina."
    >
      <SeccionAfiliados
        id="kit"
        titulo="Equípate bien"
        items={kitExt}
        color="blue"
        cols="lg:grid-cols-6"
        mostrarTitulo={false}
      />
      {kitExt.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 md:pb-12">
          <div className="border border-zinc-200 rounded-2xl px-5 py-4 text-center bg-zinc-50/60">
            <p className="text-zinc-600 text-xs md:text-sm leading-relaxed">
              Compra protegida directamente en <strong>Amazon</strong> y <strong>Mercado Libre</strong>.
              Cada producto fue filtrado por calificación real de compradores y disponibilidad de envío a Colombia.
            </p>
          </div>
        </div>
      )}
    </AprendePageShell>
  )
}
