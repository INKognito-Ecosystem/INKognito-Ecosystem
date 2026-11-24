import { useLoaderData } from 'react-router'
import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import BrandCatalogSection from '../BrandCatalogSection'
import SupplyFAQ from '../SupplyFAQ'
import SupplyMobileNav from '../SupplyMobileNav'
import BrandShowcaseHero from '../BrandShowcaseHero'
import { getAdjacentBrands, SUPPLY_BRANDS_ORDER } from '../../../data/supplyBrandsOrder'
import { useSupplyVisual } from '../../../hooks/useSupplyVisual'
import { fetchCatalogMarca, fetchSupplyFaq, useLoadMore } from '../../../hooks/useCatalog'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
// id real en `estudios` vinculado a esta marca para leer distribuidor_oficial.
const ESTUDIO_ID = 5

// El slug de marca interno sigue siendo 'kwadron' a propósito porque el logo y
// catálogo en el panel viven bajo esa clave (supply_brand_kwadron).
export async function loader({ request }) {
  const [catalogo, estudioRes, faqItems] = await Promise.all([
    fetchCatalogMarca('supply', 'kwadron'),
    fetch(`${PANEL_URL}/api/estudios/${ESTUDIO_ID}`).catch(() => null),
    fetchSupplyFaq({ marca: 'kwadron' }),
  ])
  const estudio = estudioRes && estudioRes.ok ? await estudioRes.json() : null
  const mostrarFlechas = new URL(request.url).searchParams.get('flechas') !== '0'
  return {
    ...catalogo,
    distribuidorOficial: estudio?.distribuidor_oficial || false,
    mostrarFlechas,
    faqItems,
  }
}

export function meta() {
  const title = 'Industrias Warlock | Mobiliario Profesional para Estudios de Tatuaje — INKognito Supply'
  const description =
    'Industrias Warlock: mobiliario profesional colombiano para estudios de tatuaje — camillas reclinables, apoyabrazos ajustables, sillas ergonómicas y carros auxiliares. Disponible en toda Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/mobiliario/warlock` },
  ]
}

export default function IndustriasWarlockPage() {
  const { products: productosIniciales, nextCursor, hasMore, distribuidorOficial, mostrarFlechas, faqItems } = useLoaderData()
  const { items: products, hasMore: hasMoreProductos, loading: cargandoMasProductos, loadMore: cargarMasProductos } =
    useLoadMore('supply', { marca: 'kwadron' }, { items: productosIniciales, nextCursor, hasMore })
  const logoUrl = useSupplyVisual('supply_brand_kwadron')
  const brandIndex = SUPPLY_BRANDS_ORDER.findIndex((b) => b.path === '/supply/mobiliario/warlock')
  const { prev, next } = getAdjacentBrands(brandIndex >= 0 ? brandIndex : 1)

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalogo-marca')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const shareUrl =
    typeof window !== 'undefined' && window.location?.href
      ? window.location.href
      : 'https://inkognito-ecosystem.com/supply/mobiliario/warlock'

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <NavbarCategory
        pageName="Industrias Warlock"
        light
        hideWordmark
        hideCart
        hideMenu
        shareUrl={shareUrl}
      />

      <BrandShowcaseHero
        brandKey="industrias-warlock"
        logoUrl="/marcas-marquee/warlock.png"
        distribuidorOficial={distribuidorOficial}
        onExploreCatalog={handleScrollToCatalog}
        brandNav={{ show: mostrarFlechas, prev, next }}
      />

      <div id="catalogo-marca" className="pt-10 md:pt-14 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-8 pb-4 border-b border-zinc-100">
          <p className="uppercase tracking-[0.25em] text-zinc-400 text-xs font-semibold">
            Vitrina Multi-Tienda · Mobiliario Profesional
          </p>
          <h3 className="text-xl sm:text-2xl font-black uppercase text-zinc-900 tracking-tight mt-0.5">
            Stock de Tiendas Aliadas en INKognito Supply
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
            Mobiliario publicado y comercializado directamente por distribuidores y tiendas supply registradas.
          </p>
        </div>

        <BrandCatalogSection
          brandName="Industrias Warlock"
          products={products}
          supplierBadge="Mobiliario fabricado por Industrias Warlock — equipamiento para estudios de tatuaje"
          hasMore={hasMoreProductos}
          onLoadMore={cargarMasProductos}
          loadingMore={cargandoMasProductos}
          light
          emptyTitle="Vitrina Multi-Tienda Supply"
          emptyMessage="En este momento ninguna tienda supply aliada ha cargado inventario activo de Industrias Warlock en la plataforma. Cuando un proveedor publique camillas, apoyabrazos o mobiliario, aparecerán automáticamente aquí."
          hideWhatsapp={true}
        />

        <SupplyFAQ items={faqItems} nombre="Industrias Warlock" light />
      </div>

      <FooterSupply light />
      <SupplyMobileNav active="marcas" light />
      <div className="h-16 md:hidden bg-white" />
    </div>
  )
}
