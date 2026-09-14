import { useLoaderData } from 'react-router-dom'
import { PANEL_URL, SeccionAfiliados, AprendePageShell } from './AprendeShared'

export async function loader() {
  try {
    const res = await fetch(`${PANEL_URL}/api/catalog/supply`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const recursos = Object.values(data).flat()
      .filter(p => p.tipo === 'afiliado' && p.categoria === 'Recursos')
    return { recursos }
  } catch {
    return { recursos: [] }
  }
}

export function meta() {
  const title = 'Recursos Gratuitos para Tatuadores | INKognito Supply'
  const description = 'Guías, plantillas y herramientas descargables diseñadas para potenciar tu técnica y el rendimiento de tu trabajo.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/aprende/recursos` },
  ]
}

export default function RecursosPage() {
  const { recursos } = useLoaderData()

  return (
    <AprendePageShell
      eyebrow="Sin costo"
      titulo={<>Recursos<br /><span className="text-zinc-500">gratuitos.</span></>}
      descripcion="Guías, plantillas y herramientas descargables diseñadas para potenciar tu técnica y el rendimiento de tu trabajo."
    >
      <SeccionAfiliados
        id="recursos"
        titulo="Recursos gratuitos"
        items={recursos}
        color="green"
        cols="lg:grid-cols-4"
        mostrarTitulo={false}
      />
    </AprendePageShell>
  )
}
