import { useLoaderData } from 'react-router'
import SupplyCategoryPage from '../SupplyCategoryPage'
import { fetchCatalogCategoria, fetchSupplyFaq } from '../../../hooks/useCatalog'

const TITLE = 'Agujas'
const CATEGORIA = 'Agujas'
const SLUG = 'needles'
const DESC = 'Agujas de tatuaje profesionales en Chigorodo, Uraba. RL, RS, M1, CM para todos los estilos.'
const INTRO = 'RL, RS, M1 y CM para cada estilo de trabajo. La aguja correcta no es un detalle — es la diferencia entre un trabajo limpio y uno que duele dos veces, para ti y para el cliente.'

const guide = [
  { icon: '📐', title: 'RL Liner', text: 'Para contornos y trazos finos. Las RL3 y RL5 son las mas versatiles.' },
  { icon: '🌑', title: 'RS Shader', text: 'Para rellenar areas pequenas con color saturado.' },
  { icon: '〰️', title: 'M1 Magnum', text: 'Para fondos grandes y sombras suaves con menos pasadas.' },
  { icon: '🌊', title: 'CM Curved Magnum', text: 'Favorito del realismo. Degradados sin bordes duros.' },
  { icon: '🔬', title: 'Bugpin', text: 'Calibre ultra fino para detalle extremo. Requiere maquina calibrada.' },
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

export default function NeedlesPage() {
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
