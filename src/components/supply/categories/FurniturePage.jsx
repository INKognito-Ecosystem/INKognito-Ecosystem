import { useLoaderData } from 'react-router'
import SupplyCategoryPage from '../SupplyCategoryPage'
import { fetchCatalogCategoria } from '../../../hooks/useCatalog'

const TITLE = 'Muebles'
const CATEGORIA = 'Muebles'
const SLUG = 'furniture'
const DESC = 'Muebles para estudio de tatuajes en Uraba. Camillas, bancos y almacenamiento profesional.'
const INTRO = 'Tu espacio dice mas de ti que cualquier otro elemento. La diferencia entre un cuarto y un estudio empieza por el mueble que el cliente toca primero.'

const guide = [
  { icon: '🛏️', title: 'Camilla reclinable', text: 'Altura regulable, tapizado resistente y reclinacion para distintas zonas del cuerpo.' },
  { icon: '🪑', title: 'Silla del artista', text: 'Altura ajustable, ruedas suaves y apoyo lumbar para jornadas largas.' },
  { icon: '🗄️', title: 'Almacenamiento', text: 'Cajones y porta-maquinas. Espacio ordenado transmite profesionalismo.' },
  { icon: '💡', title: 'Iluminacion', text: 'Lampara articulada luz fria (5000K-6500K). Revela colores como se veran cicatrizados.' },
  { icon: '📐', title: 'Distribucion del espacio', text: 'Organiza muebles para minimizar movimiento durante la sesion.' },
]

const faqs = [
  { q: 'Las camillas resisten cualquier peso?', a: 'Entre 150 y 200kg segun modelo. Confirmamos capacidad antes de vender.' },
  { q: 'Que tapizado es mas facil de limpiar?', a: 'Polipiel (cuero sintetico). Evita telas o materiales porosos.' },
  { q: 'Hacen envios de muebles?', a: 'Si, coordinamos embalaje y envio. El flete varia segun peso y destino.' },
  { q: 'Opciones para espacios pequenos?', a: 'Si. Escribenos con las medidas de tu espacio.' },
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

export default function FurniturePage() {
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
