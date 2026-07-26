import { useLoaderData } from 'react-router'
import SupplyCategoryPage from '../SupplyCategoryPage'
import { fetchCatalogCategoria } from '../../../hooks/useCatalog'

const TITLE = 'Fuentes de poder'
const CATEGORIA = 'Fuentes'
const SLUG = 'power-supplies'
const DESC = 'Fuentes de poder para maquinas de tatuar en Chigorodo, Uraba. Voltaje estable y control preciso.'
const INTRO = 'La fuente que no falla es la que nunca piensas en ella mientras tatuas. Voltaje estable, mente libre para crear.'

const guide = [
  { icon: '🎛️', title: 'Control de voltaje', text: 'Incrementos de 0.1V. La diferencia entre 6V y 6.5V cambia el comportamiento de tu maquina.' },
  { icon: '📺', title: 'Pantalla digital', text: 'Muestra el voltaje exacto en tiempo real. Indispensable para trabajo consistente.' },
  { icon: '⚡', title: 'Amperaje', text: 'Para rotativas: 2A suficientes. Para varias maquinas o bobinas potentes: 3A o mas.' },
  { icon: '🔌', title: 'Compatibilidad', text: 'Verifica el conector: RCA, jack 3.5mm o clip cord.' },
  { icon: '🔇', title: 'Inalambricas', text: 'Libertad de movimiento. Autonomia entre 3 y 5 horas. Ten segunda bateria cargada.' },
]

const faqs = [
  { q: 'Que fuente para rotativas?', a: 'Control digital, minimo 2A y display visible. Escribenos con tu maquina.' },
  { q: 'Las inalambricas duran toda la sesion?', a: 'Entre 3 y 5 horas segun uso. Ten segunda bateria cargada.' },
  { q: 'Incluyen cable y adaptadores?', a: 'Consultamos el kit incluido antes de confirmar.' },
  { q: 'Envios?', a: 'Si, por transportadora desde Chigorodo.' },
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

export default function PowerSuppliesPage() {
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
