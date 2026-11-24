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
const ESTUDIO_ID = 7

export async function loader({ request }) {
  const [catalogo, estudioRes, faqItems] = await Promise.all([
    fetchCatalogMarca('supply', 'royal-three'),
    fetch(`${PANEL_URL}/api/estudios/${ESTUDIO_ID}`).catch(() => null),
    fetchSupplyFaq({ marca: 'royal-three' }),
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
  const title = 'Royal Three | Bioseguridad y Cuidado para Tatuadores — INKognito Supply Colombia'
  const description =
    'Royal Three Elements (Cali, Colombia): SKUM espuma antibacterial, limpiador enzimático K-10, solidificador Medusa, Aloe Ink, Cocoa Cream y Mixer con respaldo INVIMA.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/brands/royal-three` },
  ]
}

export default function RoyalThreePage() {
  const { products: productosIniciales, nextCursor, hasMore, distribuidorOficial, mostrarFlechas, faqItems } = useLoaderData()
  const { items: products, hasMore: hasMoreProductos, loading: cargandoMasProductos, loadMore: cargarMasProductos } =
    useLoadMore('supply', { marca: 'royal-three' }, { items: productosIniciales, nextCursor, hasMore })
  const logoUrl = useSupplyVisual('supply_brand_royal_three')
  const brandIndex = SUPPLY_BRANDS_ORDER.findIndex((b) => b.path === '/supply/brands/royal-three')
  const { prev, next } = getAdjacentBrands(brandIndex >= 0 ? brandIndex : 7)

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalogo-marca')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const shareUrl =
    typeof window !== 'undefined' && window.location?.href
      ? window.location.href
      : 'https://inkognito-ecosystem.com/supply/brands/royal-three'

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <NavbarCategory pageName="Royal Three" light hideWordmark hideCart hideMenu shareUrl={shareUrl} />

      <BrandShowcaseHero
        brandKey="royal-three"
        logoUrl="/marcas-marquee/royal-three.png"
        distribuidorOficial={distribuidorOficial}
        onExploreCatalog={handleScrollToCatalog}
        brandNav={{ show: mostrarFlechas, prev, next }}
      />

      <div id="catalogo-marca" className="pt-10 md:pt-14 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-8 pb-4 border-b border-zinc-100">
          <p className="uppercase tracking-[0.25em] text-zinc-400 text-xs font-semibold">
            Vitrina Multi-Tienda · Bioseguridad & Consumibles
          </p>
          <h3 className="text-xl sm:text-2xl font-black uppercase text-zinc-900 tracking-tight mt-0.5">
            Stock de Tiendas Aliadas en INKognito Supply
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
            Inventario publicado y comercializado directamente por distribuidores y tiendas supply registradas.
          </p>
        </div>

        <BrandCatalogSection
          brandName="Royal Three"
          products={products}
          hasMore={hasMoreProductos}
          onLoadMore={cargarMasProductos}
          loadingMore={cargandoMasProductos}
          light
          officialUrl="https://royalthree.co"
          hideWhatsapp={true}
        />

        <SupplyFAQ items={faqItems} nombre="Royal Three" light />
      </div>

      <FooterSupply light />
      <SupplyMobileNav active="marcas" light />
      <div className="h-16 md:hidden bg-white" />
    </div>
  )
}
