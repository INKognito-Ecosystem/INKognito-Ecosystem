import { useLoaderData, Link } from 'react-router'
import { Package } from 'lucide-react'
import SupplyCategoryPage from '../../SupplyCategoryPage'
import { fetchCatalogCategoria, fetchSupplyFaq } from '../../../../hooks/useCatalog'

const TITLE = 'Cartuchos'
const CATEGORIA = 'Cartuchos'
const SLUG = 'cartridges'
const DESC = 'Cartuchos para tatuar en Chigorodó, Urabá. Liner, shader, magnum y bugpin. Con membrana de seguridad. Compatibles con rotativas. Envíos a Apartadó, Turbo, Carepa y toda la región.'
const INTRO = `Cartuchos profesionales para máquinas rotativas en Chigorodó, Urabá. Agujas encapsuladas con membrana de seguridad, flujo de tinta controlado y punta de precisión. Compatible con la mayoría de máquinas rotativas del mercado.`

const guide = [
  { icon: '📐', title: 'Liner (RL)', text: 'Redondas en línea. Para trazos finos, contornos y trabajo en línea. Cuanto menor el número, más fino el trazo. Los RL3 y RL5 son los más versátiles.' },
  { icon: '🌑', title: 'Shader (RS y M1)', text: 'Para rellenar y sombrear áreas. Los RS trabajan bien en saturación densa. Los M1 (magnum) son ideales para degradados suaves y fondos grandes.' },
  { icon: '🔮', title: 'Curved Magnum (CM)', text: 'Magnum curvado. El favorito para sombras suaves y transiciones de color. Reduce trauma en la piel comparado con magnum plano.' },
  { icon: '🎯', title: 'Bugpin', text: 'Agujas de calibre ultra fino dentro del cartucho. Para trabajo de detalle extremo en realismo. Requieren máquina bien calibrada.' },
  { icon: '⚡', title: 'Compatibilidad', text: 'Verifica que la palanca de tu máquina sea compatible con cartuchos (grip estándar). La mayoría de rotativas modernas lo son. Si tienes duda, escríbenos.' },
  { icon: '🔒', title: 'Membrana anti-retorno', text: 'Todos nuestros cartuchos tienen membrana de seguridad que impide retorno de tinta a la máquina. Esencial para higiene y protección del mecanismo.' },
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

export default function CartridgesPage() {
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
      extraCTA={
        <Link
          to="/supply/cartuchos-surtidos"
          className="flex items-center gap-3 border border-blue-500/30 bg-blue-500/5 rounded-lg px-4 py-3 hover:border-blue-500/60 hover:bg-blue-500/10 transition-all duration-300 w-fit"
        >
          <Package size={18} className="text-blue-400 flex-shrink-0" />
          <span className="text-sm text-zinc-300">
            <span className="font-bold text-white">¿Necesitas variedad de calibres?</span> Arma tu caja surtida de 20 cartuchos a tu gusto →
          </span>
        </Link>
      }
    />
  )
}
