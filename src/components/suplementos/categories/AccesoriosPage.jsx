import { useLoaderData } from 'react-router'
import SupleCategoryPage from '../SupleCategoryPage'
import { fetchCatalogCategoria } from '../../../hooks/useCatalog'

const TITLE = 'Accesorios'
const CATEGORIA = 'Accesorios'
const SLUG = 'accesorios'
const DESC = 'Accesorios para entrenar en Chigorodó, Urabá. Guantes, correas, straps y más — próximamente.'
const INTRO = 'Guantes, correas, straps y demás accesorios para complementar tu entrenamiento — próximamente disponibles con despacho a toda la región de Urabá.'

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

export default function AccesoriosPage() {
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
