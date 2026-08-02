import { useLoaderData } from 'react-router'
import SupplyCategoryPage from '../SupplyCategoryPage'
import { fetchCatalogCategoria } from '../../../hooks/useCatalog'

const TITLE = 'Accesorios'
const CATEGORIA = 'Accesorios'
const SLUG = 'accessories'
const DESC = 'Accesorios para tatuadores en Chigorodo, Uraba. Transfer paper, bandejas, cables y mas.'
const INTRO = 'Transfer paper, bandejas, cables y todo lo que hace fluir el trabajo — los detalles que casi nadie nota, pero que definen si el proceso es suave o se interrumpe. Porque la creatividad necesita que lo demás funcione sin pensarlo.'

const guide = [
  { icon: '🗂️', title: 'Transfer paper', text: 'Para pasar el diseno a la piel con precision. El de copiado manual con gel es el mas usado.' },
  { icon: '🖊️', title: 'Gel de transferencia', text: 'Permite que el stencil dure mas. Capa delgada y deja secar antes de tatuar.' },
  { icon: '🧩', title: 'Tazas de tinta', text: 'Cada color en su taza evita contaminacion. Las de silicona son reutilizables.' },
  { icon: '📎', title: 'Clip cord y RCA', text: 'Cable que conecta maquina y fuente. Siempre ten un repuesto.' },
  { icon: '🗑️', title: 'Contenedores de residuos', text: 'Los residuos biologicos en contenedores especiales. Parte de tu profesionalismo.' },
]

const faqs = [
  { q: 'Transfer paper compatible con impresoras?', a: 'Hay tipos para impresora y para copiado manual. Verifica antes de comprar.' },
  { q: 'Que gel recomiendan?', a: 'Depende de la piel. Escribenos con tu caso.' },
  { q: 'Venden por unidad o pack?', a: 'Varia segun producto. Consultamos por WhatsApp.' },
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

export default function AccessoriesPage() {
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
