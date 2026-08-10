import { useLoaderData } from 'react-router'
import SupplyCategoryPage from '../SupplyCategoryPage'
import { fetchCatalogCategoria, fetchSupplyFaq } from '../../../hooks/useCatalog'

const TITLE = 'Combos'
const CATEGORIA = 'Combos'
const SLUG = 'bundles'
const DESC = 'Combos y paquetes de insumos para tatuadores en Uraba. Kits para iniciar y reposicion.'
const INTRO = 'Combos y paquetes de insumos armados para iniciar o reponer sin complicarte — todo lo que necesitas, seleccionado para que te enfoques en tatuar. Sin buscar producto por producto, sin improvisar, sin excusas.'

const guide = [
  { icon: '🎯', title: 'Kit de inicio', text: 'Lo esencial para empezar: maquina, fuente, cartuchos, guantes y limpieza.' },
  { icon: '🔄', title: 'Combo de reposicion', text: 'Para artistas activos. Tintas, cartuchos y consumibles con descuento por volumen.' },
  { icon: '🎨', title: 'Kit de color', text: 'Tintas en los colores mas pedidos para empezar a ofrecer trabajo a color.' },
  { icon: '💡', title: 'Por que un combo?', text: 'Menos tiempo buscando, mejor precio por volumen, todo coordinado.' },
]

export async function loader() {
  const [catalogo, faqs] = await Promise.all([
    fetchCatalogCategoria('supply', CATEGORIA),
    fetchSupplyFaq({ categoria: CATEGORIA }),
  ])
  return { ...catalogo, faqs }
}

export function meta() {
  const title = `${TITLE} para tatuadores en Urabá | INKognito Supply — Chigorodó`
  return [
    { title },
    { name: 'description', content: DESC },
    { property: 'og:title', content: title },
    { property: 'og:description', content: DESC },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/${SLUG}` },
  ]
}

export default function BundlesPage() {
  const { products, afiliados, faqs } = useLoaderData()
  return (
    <SupplyCategoryPage
      title={TITLE}
      categoria={CATEGORIA}
      slug={SLUG}
      desc={DESC}
      intro={INTRO}
      guide={guide}
      faqs={faqs}
      products={products}
      afiliados={afiliados}
    />
  )
}
