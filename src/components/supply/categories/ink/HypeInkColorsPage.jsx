import { useLoaderData } from 'react-router'
import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import BrandCatalogSection from '../../BrandCatalogSection'
import SupplyFAQ from '../../SupplyFAQ'
import SupplyMobileNav from '../../SupplyMobileNav'
import BrandShowcaseHero from '../../BrandShowcaseHero'
import { getAdjacentBrands, SUPPLY_BRANDS_ORDER } from '../../../../data/supplyBrandsOrder'
import { useSupplyVisual } from '../../../../hooks/useSupplyVisual'
import { fetchCatalogMarca, fetchSupplyFaq, useLoadMore } from '../../../../hooks/useCatalog'

export async function loader({ request }) {
  const [catalogo, faqItems] = await Promise.all([
    fetchCatalogMarca('supply', 'hype-ink'),
    fetchSupplyFaq({ marca: 'hype-ink' }),
  ])
  const mostrarFlechas = new URL(request.url).searchParams.get('flechas') !== '0'
  return { ...catalogo, mostrarFlechas, faqItems }
}

export function meta() {
  const title = 'Hype Ink Black | INKognito Supply — Colombia'
  const description =
    'Hype Ink Black: pigmento negro profesional co-creado por Cristian Casas (@kasasink). Fórmula vegana, acabado negro mate sin subtonos azules ni verdes y tapón dosificador de precisión.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/ink/hype-ink` },
  ]
}

export default function HypeInkColorsPage() {
  const { products: productosIniciales, nextCursor, hasMore, mostrarFlechas = true, faqItems } = useLoaderData()
  const { items: products, hasMore: hasMoreProductos, loading: cargandoMasProductos, loadMore: cargarMasProductos } =
    useLoadMore('supply', { marca: 'hype-ink' }, { items: productosIniciales, nextCursor, hasMore })
  const logoUrl = useSupplyVisual('supply_brand_hype_ink')
  const brandIndex = SUPPLY_BRANDS_ORDER.findIndex((b) => b.path === '/supply/ink/hype-ink')
  const { prev, next } = getAdjacentBrands(brandIndex >= 0 ? brandIndex : 5)

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalogo-marca')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const shareUrl =
    typeof window !== 'undefined' && window.location?.href
      ? window.location.href
      : 'https://inkognito-ecosystem.com/supply/ink/hype-ink'

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <NavbarCategory pageName="Hype Ink" light hideWordmark hideCart hideMenu shareUrl={shareUrl} />

      <BrandShowcaseHero
        brandKey="hype-ink"
        logoUrl={logoUrl || '/marcas-marquee/hype-ink.png'}
        distribuidorOficial={false}
        onExploreCatalog={handleScrollToCatalog}
        brandNav={{ show: mostrarFlechas, prev, next }}
      />

      <div id="catalogo-marca" className="pt-10 md:pt-14 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-8 pb-4 border-b border-zinc-100">
          <p className="uppercase tracking-[0.25em] text-zinc-400 text-xs font-semibold">
            Vitrina Multi-Tienda · Pigmento Negro Profesional
          </p>
          <h3 className="text-xl sm:text-2xl font-black uppercase text-zinc-900 tracking-tight mt-0.5">
            Stock de Tiendas Aliadas en INKognito Supply
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
            Inventario publicado y comercializado directamente por distribuidores y tiendas supply registradas.
          </p>
        </div>

        <BrandCatalogSection
          brandName="Hype Ink"
          products={products}
          hasMore={hasMoreProductos}
          onLoadMore={cargarMasProductos}
          loadingMore={cargandoMasProductos}
          light
          officialUrl="https://hypeink.es"
          hideWhatsapp={true}
        />

        <SupplyFAQ items={faqItems} nombre="Hype Ink" light />
      </div>

      <FooterSupply light />
      <SupplyMobileNav active="marcas" light />
      <div className="h-16 md:hidden bg-white" />
    </div>
  )
}
