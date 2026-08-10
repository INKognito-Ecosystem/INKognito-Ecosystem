import { useLoaderData } from 'react-router'
import SupplyCategoryPage from '../SupplyCategoryPage'
import { fetchCatalogCategoria, fetchSupplyFaq } from '../../../hooks/useCatalog'

const TITLE = 'Cuidados'
const CATEGORIA = 'Cuidados'
const SLUG = 'aftercare'
const DESC = 'Productos de cuidado y limpieza para tatuajes en Chigorodo, Uraba. Para tatuadores profesionales.'
const INTRO = 'Cremas, jabones y productos de limpieza para antes, durante y después de tatuar. Un proceso limpio no solo protege al cliente — lo que usas para cuidar el trabajo es parte de lo que deja tu firma en cada sesión.'

const guide = [
  { icon: '🧴', title: 'Espuma limpiadora', text: 'Para limpiar la zona antes y durante el tatuaje. Elimina sangre sin irritar.' },
  { icon: '🛡️', title: 'Film plastico', text: 'Cubre el tatuaje recien hecho. Ambiente humedo que acelera la cicatrizacion.' },
  { icon: '💧', title: 'Vaselina / Crema barrera', text: 'Capa delgada durante el proceso. Demasiada obstruye la vision del trabajo.' },
  { icon: '🌿', title: 'Crema de cicatrizacion', text: 'Para el cliente en casa. Sin alcohol ni fragancia. Hidratacion cuida el color.' },
  { icon: '📋', title: 'Instrucciones al cliente', text: 'Instrucciones claras reducen consultas post-sesion y protegen tu reputacion.' },
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

export default function AftercarePage() {
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
