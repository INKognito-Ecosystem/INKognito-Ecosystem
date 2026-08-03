import { useLoaderData, Link } from 'react-router'
import { Package } from 'lucide-react'
import SupplyCategoryPage from '../../SupplyCategoryPage'
import { fetchCatalogCategoria } from '../../../../hooks/useCatalog'

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

const faqs = [
  { q: '¿Los cartuchos vienen esterilizados?', a: 'Sí. Todos vienen sellados y esterilizados por EO (óxido de etileno). Son de uso único — nunca reutilices un cartucho aunque lo laves.' },
  { q: '¿Cuántos cartuchos necesito para una sesión de 6 horas?', a: 'Depende del trabajo. Para linework calculas 2-4 cartuchos. Para pieza con sombras y color puedes necesitar entre 4 y 8. Conviene tener extra.' },
  { q: '¿Cómo sé qué número de cartucho necesito?', a: 'El número indica cuántas agujas tiene y cómo están agrupadas. Escríbenos describiendo tu estilo de trabajo (realismo, tradicional, letras) y te recomendamos.' },
  { q: '¿Venden cartuchos por unidad o por caja?', a: 'Por caja de 10 o 20 unidades según la referencia. Escríbenos si necesitas cantidad específica para cotizar.' },
  { q: '¿Hacen envíos fuera de Chigorodó?', a: 'Sí, a toda la región de Urabá: Apartadó, Turbo, Carepa, Mutatá, Arboletes. Coordinamos envío por WhatsApp.' },
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

export default function CartridgesPage() {
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
