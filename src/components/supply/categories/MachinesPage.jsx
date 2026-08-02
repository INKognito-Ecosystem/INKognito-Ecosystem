import { useLoaderData } from 'react-router'
import SupplyCategoryPage from '../SupplyCategoryPage'
import { fetchCatalogCategoria } from '../../../hooks/useCatalog'

const TITLE = 'Maquinas'
const CATEGORIA = 'Maquinas'
const SLUG = 'machines'
const DESC = 'Maquinas de tatuar rotativas en Chigorodo, Uraba. Equipos para todos los estilos.'
const INTRO = 'Máquinas rotativas para todos los estilos, del realismo al lineal. Tu máquina define tu velocidad, tu control y tu firma — equipos que ya están en manos de tatuadores que probaron y no volvieron atrás.'

const guide = [
  { icon: '⚙️', title: 'Rotativa de lapiz', text: 'Ligera, silenciosa y versatil. La mas recomendada para empezar.' },
  { icon: '🔩', title: 'Compatible cartuchos', text: 'Cambio rapido sin perder calibracion. Ideal para sesiones largas.' },
  { icon: '⚡', title: 'Bobina (Coil)', text: 'Clasica con golpe propio. Favorita para linea negra y trabajo tradicional.' },
  { icon: '🎛️', title: 'Voltaje de trabajo', text: 'Entre 5V y 9V segun tecnica. Tu fuente debe permitir control preciso.' },
  { icon: '⚖️', title: 'Peso y ergonomia', text: 'Para detalle elige algo ligero. Para linea con fuerza, mas peso da estabilidad.' },
]

const faqs = [
  { q: 'Que maquina para empezar?', a: 'Rotativa de lapiz con cartuchos. La mas versatil.' },
  { q: 'Incluyen garantia?', a: 'Depende del fabricante. Consultamos condiciones antes de confirmar.' },
  { q: 'Compatibles con todas las fuentes?', a: 'Si, que la fuente entregue 5V-12V.' },
  { q: 'Envios a Colombia?', a: 'Si, por transportadora desde Chigorodo.' },
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

export default function MachinesPage() {
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
