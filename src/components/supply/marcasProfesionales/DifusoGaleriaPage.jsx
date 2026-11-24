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
    fetchCatalogMarca('supply', 'difuso-galeria'),
    fetchSupplyFaq({ marca: 'difuso-galeria' }),
  ])
  const mostrarFlechas = new URL(request.url).searchParams.get('flechas') !== '0'
  return { ...catalogo, mostrarFlechas, faqItems }
}

export function meta() {
  const title = 'Difuso Galería & Supply | Estudio de Tatuajes e Insumos en Medellín — INKognito Supply'
  const description = 'Difuso Galería y Difuso Supply Tattoo en Envigado, Medellín. Estudio referente de tatuaje contemporáneo y tienda especializada en insumos profesionales con envíos a toda Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/brands/difuso-galeria` },
  ]
}

export default function DifusoGaleriaPage() {
  const { products: productosIniciales, nextCursor, hasMore, mostrarFlechas, faqItems } = useLoaderData()
  const { items: products, hasMore: hasMoreProductos, loading: cargandoMasProductos, loadMore: cargarMasProductos } = useLoadMore('supply', { marca: 'difuso-galeria' }, { items: productosIniciales, nextCursor, hasMore })
  const brandIndex = SUPPLY_BRANDS_ORDER.findIndex(b => b.path === '/supply/brands/difuso-galeria')
  const { prev, next } = getAdjacentBrands(brandIndex >= 0 ? brandIndex : 0)

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalogo-marca')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const shareUrl = typeof window !== 'undefined' && window.location?.href
    ? window.location.href
    : 'https://inkognito-ecosystem.com/supply/brands/difuso-galeria'

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Navbar en blanco puro sin "SUPPLY Tienda Online", sin carrito ni hamburguesa, con botón para compartir */}
      <NavbarCategory
        pageName="Difuso Galería"
        light
        hideWordmark
        hideCart
        hideMenu
        shareUrl={shareUrl}
      />

      {/* SHOWCASE PREMIUM: Escena de galería flotando sobre fondo blanco con logo tenue y specs */}
      <BrandShowcaseHero
        brandKey="difuso-galeria"
        logoUrl="/marcas-marquee/difuso-galeria.png"
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
          brandName="Difuso Galería"
          products={products}
          supplierBadge={null}
          hasMore={hasMoreProductos}
          onLoadMore={cargarMasProductos}
          loadingMore={cargandoMasProductos}
          light
          officialUrl="https://difusosupplytattoo.com"
          emptyTitle="Vitrina Multi-Tienda Supply"
          emptyMessage="En este momento no hay inventario activo de Difuso cargado en la plataforma. Cuando publiquen unidades, se listarán automáticamente aquí. Puedes explorar su catálogo completo directamente en su tienda oficial:"
          hideWhatsapp={true}
        />

        <SupplyFAQ items={faqItems} nombre="Difuso Galería" light />

      </div>

      <FooterSupply light />
      <SupplyMobileNav active="marcas" light />
      <div className="h-16 md:hidden bg-white" />
    </div>
  )
}
