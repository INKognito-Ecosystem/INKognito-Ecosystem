import { useLoaderData } from 'react-router'
import SupplyCategoryPage from '../../SupplyCategoryPage'
import { fetchCatalogCategoria, fetchSupplyFaq } from '../../../../hooks/useCatalog'

const TITLE = 'Tintas'
const CATEGORIA = 'Tintas'
const SLUG = 'ink'
const DESC = 'Tintas y pigmentos profesionales para tatuaje en Chigorodó, Urabá. Alta densidad, larga duración. Marcas como Vice Colors, Dynamic, Eternal. Envíos a Apartadó, Turbo y toda la región.'
const INTRO = `Tintas y pigmentos de alta densidad para tatuadores profesionales en Chigorodó, Urabá. Colores con alta concentración de pigmento, formulados para definición nítida, larga duración y cicatrización limpia. Disponibles en 1oz, 2oz y 4oz según existencias.`

const guide = [
  { icon: '🎨', title: 'Negros y grises', text: 'Esenciales para realismo y sombras. Busca alta densidad para trazo limpio y negros absolutos sin dilución. Los negros de calidad mantienen el color sin desvanecer con los años.' },
  { icon: '🌈', title: 'Colores vivos', text: 'Para color tradicional y neotrad. Elige tintas con alta saturación. Los rojos y amarillos son los más difíciles de mantener — invierte en marcas probadas.' },
  { icon: '💧', title: 'Dilución correcta', text: 'Dilata solo con agua destilada estéril. Jamás con agua del grifo ni alcohol. La proporción correcta depende del efecto: del 10% al 50% según el gris que busques.' },
  { icon: '🔒', title: 'Sellos y fechas', text: 'Verifica fecha de vencimiento y sello de seguridad. Tintas abiertas tienen vida útil de 12 meses. Almacena lejos de luz directa y a temperatura ambiente.' },
  { icon: '📦', title: 'Cantidad por sesión', text: 'Para una sesión de 4-6 horas de trabajo en color calculas entre 3 y 6 tintas según paleta. En piezas grandes conviene tener respaldo de los colores base.' },
  { icon: '🔬', title: 'Veganas y aptas piel', text: 'Todas las tintas en nuestro catálogo son libres de crueldad animal y formuladas para uso dérmico profesional, cumpliendo estándares de seguridad para tatuaje.' },
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

export default function InkPage() {
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
