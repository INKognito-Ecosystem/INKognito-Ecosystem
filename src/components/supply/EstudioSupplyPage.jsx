import { useLoaderData } from 'react-router-dom'
import FooterSupply from './FooterSupply'
import NavbarCategory from './NavbarCategory'
import BrandCatalogSection from './BrandCatalogSection'
import { fetchCatalogEstudio } from '../../hooks/useCatalog'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Supply multitenant (fase 4, 2026-08-07) — catálogo filtrado de un
// estudio-vendedor específico, a donde llega alguien que entró desde su
// perfil en Tattoo Artist Colombia ("Ver su catálogo en Supply"). A
// diferencia de las páginas de marca (Tommy, Warlock — un archivo fijo
// por marca, copy escrito a mano), esta es dinámica: cualquier estudio
// con vende_supply activo tiene esta misma página, sin tocar código.
export async function loader({ params }) {
  try {
    const [estudioRes, catalogo] = await Promise.all([
      fetch(`${PANEL_URL}/api/estudios/${params.id}`),
      fetchCatalogEstudio('supply', params.id),
    ])
    const estudio = estudioRes.ok ? await estudioRes.json() : null
    return { estudio, products: catalogo.products }
  } catch {
    return { estudio: null, products: [] }
  }
}

export function meta({ data }) {
  const estudio = data?.estudio
  if (!estudio) return [{ title: 'Estudio no encontrado | INKognito Supply' }]
  const title = `${estudio.nombre} — Catálogo | INKognito Supply`
  const description = `Productos de ${estudio.nombre} disponibles en INKognito Supply.`
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/estudio/${estudio.id}` },
  ]
}

export default function EstudioSupplyPage() {
  const { estudio, products } = useLoaderData()

  if (!estudio) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <p className="text-zinc-400 text-sm">No encontramos este estudio.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarCategory pageName={estudio.nombre} />

      <div className="pt-20 md:pt-24 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8">
          {estudio.logo_url && (
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-zinc-800 flex-shrink-0">
              <img src={estudio.logo_url} alt={estudio.nombre} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-1">Catálogo de</p>
            <h1 className="text-2xl md:text-4xl font-black uppercase leading-tight">{estudio.nombre}</h1>
            {estudio.municipio && <p className="text-zinc-500 text-sm mt-1">{estudio.municipio}{estudio.departamento ? `, ${estudio.departamento}` : ''}</p>}
          </div>
        </div>

        <BrandCatalogSection
          brandName={estudio.nombre}
          products={products}
          supplierBadge={`Suministrado por ${estudio.nombre}`}
        />
      </div>

      <FooterSupply />
    </div>
  )
}
