import { useLoaderData, redirect } from 'react-router-dom'
import { Award } from 'lucide-react'
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
  let estudio = null, products = []
  try {
    const [estudioRes, catalogo] = await Promise.all([
      fetch(`${PANEL_URL}/api/estudios/${params.id}`),
      fetchCatalogEstudio('supply', params.id),
    ])
    estudio = estudioRes.ok ? await estudioRes.json() : null
    products = catalogo.products
  } catch {
    estudio = null
  }
  // fase 6.1 (2026-08-07, Jose) — una marca con landing propia ya hecha a
  // mano (marcasProfesionales/*.jsx) o su propio sitio externo no debe
  // quedarse con esta página genérica vacía como duplicado; el redirect
  // va FUERA del try/catch de arriba a propósito — throw redirect() es un
  // Response, no un error, y un catch genérico lo tragaría silenciosamente.
  // ?flechas=0 (bug real, 2026-08-07, Jose: "el botón de las flechas para
  // navegar entre marcas sigue apareciendo") — quien llega acá viene del
  // perfil del estudio en el buscador, no del menú de marcas; las 4
  // páginas de marcasProfesionales/ leen este parámetro para ocultar sus
  // flechas prev/next solo en ese caso, sin tocar su comportamiento
  // normal cuando se navega entre ellas desde el menú de Supply.
  if (estudio?.catalogo_url) {
    const externo = /^https?:\/\//.test(estudio.catalogo_url)
    const destino = externo ? estudio.catalogo_url : `${estudio.catalogo_url}${estudio.catalogo_url.includes('?') ? '&' : '?'}flechas=0`
    throw redirect(destino)
  }
  return { estudio, products }
}

export function meta({ data }) {
  const estudio = data?.estudio
  if (!estudio) return [{ title: 'Estudio no encontrado | INKognito Supply' }]
  // nombre_supply (2026-08-07): identidad propia para vender en Supply,
  // distinta del nombre de tatuajes (ej. "INKognito Supply" vs "INKognito
  // Tattoo Studio") — esta página nunca lo leía, siempre mostraba el
  // nombre de tatuajes sin importar lo que el proveedor configurara
  // (reportado 2026-08-09).
  const nombreSupply = estudio.nombre_supply || estudio.nombre
  const title = `${nombreSupply} — Catálogo | INKognito Supply`
  const description = `Productos de ${nombreSupply} disponibles en INKognito Supply.`
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

  const nombreSupply = estudio.nombre_supply || estudio.nombre

  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarCategory pageName={nombreSupply} />

      <div className="pt-20 md:pt-24 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8">
          {estudio.logo_url && (
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-zinc-800 flex-shrink-0">
              <img src={estudio.logo_url} alt={nombreSupply} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-1">Catálogo de</p>
            <h1 className="text-2xl md:text-4xl font-black uppercase leading-tight">{nombreSupply}</h1>
            {estudio.municipio && <p className="text-zinc-500 text-sm mt-1">{estudio.municipio}{estudio.departamento ? `, ${estudio.departamento}` : ''}</p>}
            {/* Insignia "Distribuidor Oficial" (fase 6, 2026-08-07) —
                tarifa fija de patrocinio, no comisión (la venta acá no
                necesariamente pasa por el carrito). Color ámbar a
                propósito, distinto del azul de toda la identidad de
                Supply, para que se lea como un sello aparte. Sin flechas
                prev/next (Jose: a esta página se llega desde el perfil
                del estudio en el buscador, no desde el menú de marcas —
                saltar a otra marca sin relación no tiene sentido acá). */}
            {estudio.distribuidor_oficial && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-black text-[10px] font-black uppercase tracking-widest bg-amber-400 mt-2">
                <Award size={12} /> Distribuidor Oficial
              </span>
            )}
          </div>
        </div>

        {/* Sin insignia de proveedor por card ni banner "Suministrado
            por..." acá — sería redundante, el título de esta misma
            página ya deja claro de quién es el catálogo (Jose,
            2026-08-09). Esa insignia sí importa en el catálogo general
            de Supply, donde los productos vienen mezclados. */}
        <BrandCatalogSection
          brandName={nombreSupply}
          products={products}
          supplierBadge={null}
          showEstudioBadge={false}
          whatsapp={estudio.whatsapp || undefined}
        />
      </div>

      <FooterSupply />
    </div>
  )
}
