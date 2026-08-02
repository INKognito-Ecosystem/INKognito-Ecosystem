import { useLoaderData } from 'react-router'
import SupplyCategoryPage from '../SupplyCategoryPage'
import { fetchCatalogCategoria } from '../../../hooks/useCatalog'

const TITLE = 'Guantes'
const CATEGORIA = 'Guantes'
const SLUG = 'gloves'
const DESC = 'Guantes de nitrilo para tatuar en Chigorodo, Uraba. Sin latex y con excelente tacto.'
const INTRO = 'Guantes de nitrilo sin látex, con el tacto exacto para trabajar con precisión. El guante que usas también habla de cómo trabajas — agarre exacto, protección real y confianza en cada movimiento de la sesión.'

const guide = [
  { icon: '🖤', title: 'Nitrilo negro', text: 'El estandar del sector. Sin alergias y resiste pinchazos mejor que el latex.' },
  { icon: '📏', title: 'Talla correcta', text: 'S=18cm, M=19-20cm, L=21-22cm, XL=23cm+. Uno pequeno cansa, uno grande pierde tacto.' },
  { icon: '🔒', title: 'Doble guante', text: 'Para procedimientos largos, dos guantes superpuestos dan proteccion extra.' },
  { icon: '♻️', title: 'Uso unico', text: 'Nunca reutilices aunque parezca intacto. La barrera microscopica se compromete.' },
]

const faqs = [
  { q: 'Son libres de latex?', a: 'Si, todos de nitrilo. Aptos para personas con alergia.' },
  { q: 'Venden por caja?', a: 'Por caja de 100 unidades.' },
  { q: 'Cual talla es la mas pedida?', a: 'Talla M para la mayoria. Mide el ancho de tu palma.' },
  { q: 'Envios?', a: 'Si, a toda la region de Uraba y Colombia.' },
]

export async function loader() {
  return fetchCatalogCategoria('supply', CATEGORIA)
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

export default function GlovesPage() {
  const { products, afiliados } = useLoaderData()
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
