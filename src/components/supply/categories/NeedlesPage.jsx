import { useLoaderData, Link } from 'react-router'
import { Package } from 'lucide-react'
import SupplyCategoryPage from '../SupplyCategoryPage'
import { fetchCatalogCategoria } from '../../../hooks/useCatalog'

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

const faqs = [
  { q: 'Las agujas vienen esterilizadas?', a: 'Si, selladas por EO. Uso unico, nunca reutilices.' },
  { q: 'Que aguja para letras?', a: 'RL3 o RL5 para letras finas. RS7 o M1 para relleno.' },
  { q: 'Venden por caja?', a: 'Si. Consultamos cantidades especificas.' },
  { q: 'Hacen envios?', a: 'Si, a toda la region de Uraba y Colombia.' },
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

export default function NeedlesPage() {
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
      extraCTA={
        <Link
          to="/supply/agujas-surtidas"
          className="flex items-center gap-3 border border-blue-500/30 bg-blue-500/5 rounded-lg px-4 py-3 hover:border-blue-500/60 hover:bg-blue-500/10 transition-all duration-300 w-fit"
        >
          <Package size={18} className="text-blue-400 flex-shrink-0" />
          <span className="text-sm text-zinc-300">
            <span className="font-bold text-white">¿Necesitas variedad de calibres?</span> Arma tu caja surtida de 20 agujas a tu gusto →
          </span>
        </Link>
      }
    />
  )
}
