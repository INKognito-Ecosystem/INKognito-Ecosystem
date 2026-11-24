import { useLoaderData } from 'react-router'
import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import BrandCatalogSection from '../BrandCatalogSection'
import SupplyFAQ from '../SupplyFAQ'
import SupplyMobileNav from '../SupplyMobileNav'
import BrandShowcaseHero from '../BrandShowcaseHero'
import { getAdjacentBrands, SUPPLY_BRANDS_ORDER } from '../../../data/supplyBrandsOrder'
import { useSupplyVisual } from '../../../hooks/useSupplyVisual'
import { fetchCatalogEstudio, fetchSupplyFaq, useLoadMore } from '../../../hooks/useCatalog'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
// id real en `estudios` vinculado a Heaven Pro: filtra por estudio_id para no
// mezclar productos de terceros etiquetados como heaven-pro.
const ESTUDIO_ID = 6

export async function loader({ request }) {
  const [catalogo, estudioRes, faqItems] = await Promise.all([
    fetchCatalogEstudio('supply', ESTUDIO_ID),
    fetch(`${PANEL_URL}/api/estudios/${ESTUDIO_ID}`).catch(() => null),
    fetchSupplyFaq({ marca: 'heaven-pro' }),
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
  const title = 'Heaven Pro | Cuidado Profesional para Tatuajes — INKognito Supply Colombia'
  const description =
    'Heaven Pro Colombia: Crema VITTA (aftercare), Crema MEDIUM (proceso), toallitas TACTTUS y diluyente AQUA Mixer. Fórmulas 100% veganas e hipoalergénicas.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/brands/heaven-pro` },
  ]
}

export default function HeavenProPage() {
  const { products: productosIniciales, nextCursor, hasMore, distribuidorOficial, mostrarFlechas, faqItems } = useLoaderData()
  const { items: products, hasMore: hasMoreProductos, loading: cargandoMasProductos, loadMore: cargarMasProductos } =
    useLoadMore('supply', { estudioId: ESTUDIO_ID }, { items: productosIniciales, nextCursor, hasMore })
  const logoUrl = useSupplyVisual('supply_brand_heaven_pro')
  const brandIndex = SUPPLY_BRANDS_ORDER.findIndex((b) => b.path === '/supply/brands/heaven-pro')
  const { prev, next } = getAdjacentBrands(brandIndex >= 0 ? brandIndex : 6)

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalogo-marca')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const shareUrl =
    typeof window !== 'undefined' && window.location?.href
      ? window.location.href
      : 'https://inkognito-ecosystem.com/supply/brands/heaven-pro'

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <NavbarCategory pageName="Heaven Pro" light hideWordmark hideCart hideMenu shareUrl={shareUrl} />

      <BrandShowcaseHero
        brandKey="heaven-pro"
        logoUrl="/marcas-marquee/heaven-pro.png"
        distribuidorOficial={distribuidorOficial}
        onExploreCatalog={handleScrollToCatalog}
        brandNav={{ show: mostrarFlechas, prev, next }}
      />

      <div id="catalogo-marca" className="pt-10 md:pt-14 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-8 pb-4 border-b border-zinc-100">
          <p className="uppercase tracking-[0.25em] text-zinc-400 text-xs font-semibold">
            Vitrina Oficial · Cuidado Dermatológico
          </p>
          <h3 className="text-xl sm:text-2xl font-black uppercase text-zinc-900 tracking-tight mt-0.5">
            Catálogo Heaven Pro en INKognito Supply
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
            Productos oficiales de Heaven Pro disponibles directamente en la plataforma.
          </p>
        </div>

        <BrandCatalogSection
          brandName="Heaven Pro"
          products={products}
          supplierBadge={null}
          hasMore={hasMoreProductos}
          onLoadMore={cargarMasProductos}
          loadingMore={cargandoMasProductos}
          light
          officialUrl="https://heavenpro.co"
          hideWhatsapp={true}
        />

        <SupplyFAQ items={faqItems} nombre="Heaven Pro" light />
      </div>

      <FooterSupply light />
      <SupplyMobileNav active="marcas" light />
      <div className="h-16 md:hidden bg-white" />
    </div>
  )
}
