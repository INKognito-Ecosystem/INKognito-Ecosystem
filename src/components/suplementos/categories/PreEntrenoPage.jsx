import { useLoaderData } from 'react-router'
import SupleCategoryPage from '../SupleCategoryPage'
import { fetchCatalogCategoria } from '../../../hooks/useCatalog'

const TITLE = 'Pre-entreno'
const CATEGORIA = 'Pre-entreno'
const SLUG = 'pre-entreno'
const DESC = 'Pre-entreno para tus rutinas en Chigorodó, Urabá. Stock real, despacho rápido.'
const INTRO = 'Energía y enfoque antes de entrenar — pre-entrenos con stock real y despacho rápido en toda la región de Urabá.'

export async function loader() {
  return fetchCatalogCategoria('suplementos', CATEGORIA)
}

export function meta() {
  const title = `${TITLE} para entrenar en Urabá | INKognito Suple — Chigorodó`
  return [
    { title },
    { name: 'description', content: DESC },
    { property: 'og:title', content: title },
    { property: 'og:description', content: DESC },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/suplementos/${SLUG}` },
  ]
}

export default function PreEntrenoPage() {
  const { products } = useLoaderData()
  return (
    <SupleCategoryPage
      title={TITLE}
      categoria={CATEGORIA}
      slug={SLUG}
      intro={INTRO}
      products={products}
    />
  )
}
