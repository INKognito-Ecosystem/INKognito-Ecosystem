import { useLoaderData } from 'react-router'
import SupplyCategoryPage from '../SupplyCategoryPage'
import { fetchCatalogCategoria, fetchSupplyFaq } from '../../../hooks/useCatalog'

// La página de CATEGORÍA debe quedar neutra/universal — no asumir un solo
// proveedor por nombre (Jose, 2026-09-12: "somos el sistema digital, cada
// proveedor es responsable"). Antes asumía 100% Industrias Warlock (fabrica
// en Bogotá, sin contraentrega); la atribución real ahora vive por producto
// en cada card (ver SupplyProductCard.jsx) y en la página propia de la marca
// (IndustriasWarlockPage.jsx), no acá.
const TITLE = 'Mobiliario'
const CATEGORIA = 'Mobiliario'
const SLUG = 'furniture'
const DESC = 'Mobiliario profesional para estudios de tatuaje — camillas, sillas y almacenamiento, con envío a toda Colombia.'
const INTRO = 'Tu espacio dice más de ti que cualquier otro elemento. La diferencia entre un cuarto y un estudio empieza por el mueble que el cliente toca primero.'

const guide = [
  { icon: '🛏️', title: 'Camilla reclinable', text: 'Altura regulable, tapizado resistente y reclinacion para distintas zonas del cuerpo.' },
  { icon: '🪑', title: 'Silla del artista', text: 'Altura ajustable, ruedas suaves y apoyo lumbar para jornadas largas.' },
  { icon: '🗄️', title: 'Almacenamiento', text: 'Cajones y porta-maquinas. Espacio ordenado transmite profesionalismo.' },
  { icon: '💡', title: 'Iluminacion', text: 'Lampara articulada luz fria (5000K-6500K). Revela colores como se veran cicatrizados.' },
  { icon: '📐', title: 'Distribucion del espacio', text: 'Organiza muebles para minimizar movimiento durante la sesion.' },
]

export async function loader() {
  const [catalogo, faqs] = await Promise.all([
    fetchCatalogCategoria('supply', CATEGORIA),
    fetchSupplyFaq({ categoria: CATEGORIA }),
  ])
  return { ...catalogo, faqs }
}

export function meta() {
  const title = `${TITLE} para tatuadores en Colombia | INKognito Supply`
  return [
    { title },
    { name: 'description', content: DESC },
    { property: 'og:title', content: title },
    { property: 'og:description', content: DESC },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/${SLUG}` },
  ]
}

export default function FurniturePage() {
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
