import { useLoaderData } from 'react-router-dom'
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

export function meta() {
  const title = 'Kit Recomendado para Tatuadores | INKognito Supply'
  const description = 'Insumos básicos seleccionados en Amazon y AliExpress para empezar a tatuar con seriedad, sin sobrecostos.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/aprende/kit` },
  ]
}

export default function KitPage() {
  const { kitExt } = useLoaderData()

  return (
    <AprendePageShell
      eyebrow="Amazon · AliExpress · Kit básico"
      titulo={<>El kit que respalda<br /><span className="text-zinc-500">tu práctica.</span></>}
      descripcion="Insumos seleccionados para trabajar con seriedad, sin sobrecostos."
    >
      <SeccionAfiliados
        id="kit"
        titulo="Kit recomendado"
        items={kitExt}
        color="blue"
        cols="lg:grid-cols-6"
        mostrarTitulo={false}
      />
    </AprendePageShell>
  )
}
