import { useLoaderData } from 'react-router'
import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import BrandCatalogSection from '../BrandCatalogSection'
import SupplyFAQ from '../SupplyFAQ'
import SupplyMobileNav from '../SupplyMobileNav'
import BrandShowcaseHero from '../BrandShowcaseHero'
import { getAdjacentBrands, SUPPLY_BRANDS_ORDER } from '../../../data/supplyBrandsOrder'
import { fetchCatalogMarca, fetchSupplyFaq, useLoadMore } from '../../../hooks/useCatalog'

export async function loader({ request }) {
  const [catalogo, faqItems] = await Promise.all([
    fetchCatalogMarca('supply', 'mamacure'),
    fetchSupplyFaq({ marca: 'mamacure' }),
  ])
  const mostrarFlechas = new URL(request.url).searchParams.get('flechas') !== '0'
  return { ...catalogo, mostrarFlechas, faqItems }
}

export function meta() {
  const title = 'MamaCure | Cuidado Natural para Tatuajes — INKognito Supply Colombia'
  const description =
    'MamaCure Colombia: Tattoo Cream con 10 ingredientes activos, Dragon Balm con Sangre de Drago y Natural Soap Light Foam pH neutro. Fórmulas naturales sin petrolatos ni parabenos.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/brands/mamacure` },
  ]
}

export default function MamacurePage() {
  const { products: productosIniciales, nextCursor, hasMore, mostrarFlechas = true, faqItems } = useLoaderData()
  const { items: products, hasMore: hasMoreProductos, loading: cargandoMasProductos, loadMore: cargarMasProductos } =
    useLoadMore('supply', { marca: 'mamacure' }, { items: productosIniciales, nextCursor, hasMore })
  const brandIndex = SUPPLY_BRANDS_ORDER.findIndex((b) => b.path === '/supply/brands/mamacure')
  const { prev, next } = getAdjacentBrands(brandIndex >= 0 ? brandIndex : 7)

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalogo-marca')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const shareUrl =
    typeof window !== 'undefined' && window.location?.href
      ? window.location.href
      : 'https://inkognito-ecosystem.com/supply/brands/mamacure'

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <NavbarCategory pageName="MamaCure" light hideWordmark hideCart hideMenu shareUrl={shareUrl} />

      <BrandShowcaseHero
        brandKey="mamacure"
        logoUrl="/marcas-marquee/mamacure.png"
        distribuidorOficial={false}
        onExploreCatalog={handleScrollToCatalog}
        brandNav={{ show: mostrarFlechas, prev, next }}
      />

      <div id="catalogo-marca" className="pt-10 md:pt-14 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-8 pb-4 border-b border-zinc-100">
          <p className="uppercase tracking-[0.25em] text-zinc-400 text-xs font-semibold">
            Vitrina Multi-Tienda · Cuidado Natural Tattoo
          </p>
          <h3 className="text-xl sm:text-2xl font-black uppercase text-zinc-900 tracking-tight mt-0.5">
            Catálogo MamaCure en INKognito Supply
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
            Productos MamaCure publicados por distribuidores y tiendas aliadas en INKognito Supply.
          </p>
        </div>

        <BrandCatalogSection
          brandName="MamaCure"
          products={products}
          supplierBadge={null}
          hasMore={hasMoreProductos}
          onLoadMore={cargarMasProductos}
          loadingMore={cargandoMasProductos}
          light
          officialUrl="https://mamacure.com.co"
          hideWhatsapp={true}
        />

        <SupplyFAQ items={faqItems} nombre="MamaCure" light />
      </div>

      <FooterSupply light />
      <SupplyMobileNav active="marcas" light />
      <div className="h-16 md:hidden bg-white" />
    </div>
  )
}
