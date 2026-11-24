import { Link, useLoaderData } from 'react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import BrandCatalogSection from '../BrandCatalogSection'
import SupplyFAQ from '../SupplyFAQ'
import SupplyMobileNav from '../SupplyMobileNav'
import BrandShowcaseHero from '../BrandShowcaseHero'
import { getAdjacentBrands, SUPPLY_BRANDS_ORDER } from '../../../data/supplyBrandsOrder'
import { useSupplyVisual } from '../../../hooks/useSupplyVisual'
import { fetchCatalogMarca, fetchSupplyFaq, useLoadMore } from '../../../hooks/useCatalog'

export async function loader({ request }) {
  const [catalogo, faqItems] = await Promise.all([
    fetchCatalogMarca('supply', 'don-melo'),
    fetchSupplyFaq({ marca: 'don-melo' }),
  ])
  const mostrarFlechas = new URL(request.url).searchParams.get('flechas') !== '0'
  return { ...catalogo, mostrarFlechas, faqItems }
}

export function meta() {
  const title = 'Don Melo | Máquinas Artesanales de Bobinas en Colombia — INKognito Supply'
  const description = 'Máquinas de tatuar artesanales de bobinas creadas a mano por Don Melo en Colombia. Power Liners de alta precisión, chasis metálico sólido y calibración profesional.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/brands/don-melo` },
  ]
}

export default function DonMeloPage() {
  const { products: productosIniciales, nextCursor, hasMore, mostrarFlechas, faqItems } = useLoaderData()
  const { items: products, hasMore: hasMoreProductos, loading: cargandoMasProductos, loadMore: cargarMasProductos } = useLoadMore('supply', { marca: 'don-melo' }, { items: productosIniciales, nextCursor, hasMore })
  const logoUrl = useSupplyVisual('supply_brand_don_melo')
  const brandIndex = SUPPLY_BRANDS_ORDER.findIndex(b => b.path === '/supply/brands/don-melo')
  const { prev, next } = getAdjacentBrands(brandIndex >= 0 ? brandIndex : 0)

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalogo-marca')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const shareUrl = typeof window !== 'undefined' && window.location?.href
    ? window.location.href
    : 'https://inkognito-ecosystem.com/supply/brands/don-melo'

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Navbar en blanco puro sin "SUPPLY Tienda Online", sin carrito ni hamburguesa, con botón para compartir */}
      <NavbarCategory
        pageName="Don Melo"
        light
        hideWordmark
        hideCart
        hideMenu
        shareUrl={shareUrl}
      />

      {/* SHOWCASE PREMIUM: Máquina artesanal flotando en blanco con sombra y specs */}
      <BrandShowcaseHero
        brandKey="don-melo"
        logoUrl={logoUrl}
        distribuidorOficial={false}
        onExploreCatalog={handleScrollToCatalog}
        brandNav={{ show: mostrarFlechas, prev, next }}
      />

      {/* VITRINA DE PRODUCTOS & STOCK DE TIENDAS SUPPLY */}
      <div id="catalogo-marca" className="pt-10 md:pt-14 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="text-center mb-8 pb-4 border-b border-zinc-100">
          <p className="uppercase tracking-[0.25em] text-zinc-400 text-xs font-semibold">
            Vitrina Multi-Tienda · Stock Disponible
          </p>
          <h3 className="text-xl sm:text-2xl font-black uppercase text-zinc-900 tracking-tight mt-0.5">
            Stock de Tiendas Aliadas en INKognito Supply
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
            Inventario publicado y comercializado directamente por distribuidores y tiendas supply registradas.
          </p>
        </div>

        <BrandCatalogSection
          brandName="Don Melo"
          products={products}
          supplierBadge={null}
          hasMore={hasMoreProductos}
          onLoadMore={cargarMasProductos}
          loadingMore={cargandoMasProductos}
          light
          officialUrl="https://www.instagram.com/don_melo_/"
          emptyTitle="Vitrina Multi-Tienda Supply"
          emptyMessage="En este momento ninguna tienda supply aliada ha cargado inventario activo de Don Melo en la plataforma. Cuando un proveedor suba máquinas o repuestos, se listarán automáticamente aquí. Puedes contactar directamente al taller oficial en su canal:"
          hideWhatsapp={true}
        />

        <SupplyFAQ items={faqItems} nombre="Don Melo" light />

      </div>

      <FooterSupply light />
      <SupplyMobileNav light />
      <div className="h-16 md:hidden bg-white" />
    </div>
  )
}
