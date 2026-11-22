import { Link, useLoaderData } from 'react-router'
import { ArrowLeft, ArrowRight, Award } from 'lucide-react'
import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import BrandCatalogSection from '../BrandCatalogSection'
import SupplyFAQ from '../SupplyFAQ'
import SupplyMobileNav from '../SupplyMobileNav'
import BrandShowcaseHero from '../BrandShowcaseHero'
import { getAdjacentBrands } from '../../../data/supplyBrandsOrder'
import { useSupplyVisual } from '../../../hooks/useSupplyVisual'
import { useScrolled } from '../../../hooks/useScrolled'
import { fetchCatalogMarca, fetchSupplyFaq, useLoadMore } from '../../../hooks/useCatalog'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ESTUDIO_ID = 4

export async function loader({ request }) {
  const [catalogo, estudioRes, faqItems] = await Promise.all([
    fetchCatalogMarca('supply', 'tattoo-vision'),
    fetch(`${PANEL_URL}/api/estudios/${ESTUDIO_ID}`).catch(() => null),
    fetchSupplyFaq({ marca: 'tattoo-vision' }),
  ])
  const estudio = estudioRes && estudioRes.ok ? await estudioRes.json() : null
  const mostrarFlechas = new URL(request.url).searchParams.get('flechas') !== '0'
  return { ...catalogo, distribuidorOficial: estudio?.distribuidor_oficial || false, mostrarFlechas, faqItems }
}

export function meta() {
  const title = 'Tattoo Vision | Gafas Polarizadas y Sistemas Ópticos de Hernán Yepes — INKognito Supply'
  const description = 'Gafas de tecnología polarizada TR90 y sistemas ópticos creados por Hernán Yepes. Eliminan el 100% de los reflejos en la piel para control de saturación y degradado. Disponibles en Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/brands/tattoo-vision` },
  ]
}

export default function TattooVisionPage() {
  const { products: productosIniciales, nextCursor, hasMore, distribuidorOficial, mostrarFlechas, faqItems } = useLoaderData()
  const { items: products, hasMore: hasMoreProductos, loading: cargandoMasProductos, loadMore: cargarMasProductos } = useLoadMore('supply', { marca: 'tattoo-vision' }, { items: productosIniciales, nextCursor, hasMore })
  const logoUrl = useSupplyVisual('supply_brand_tattoo_vision')
  const { prev, next } = getAdjacentBrands(0)

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalogo-marca')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const shareUrl = typeof window !== 'undefined' && window.location?.href
    ? window.location.href
    : 'https://inkognito.com.co/supply/brands/tattoo-vision'

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Navbar en blanco puro sin "SUPPLY Tienda Online", sin carrito ni hamburguesa, con botón para compartir */}
      <NavbarCategory
        pageName="Tattoo Vision"
        light
        hideWordmark
        hideCart
        hideMenu
        shareUrl={shareUrl}
      />

      {/* SHOWCASE PREMIUM: Sistema de hardware flotando en blanco con sombra y specs */}
      <BrandShowcaseHero
        brandKey="tattoo-vision"
        logoUrl="/supply-assets/logos/supply_brand_tattoo_vision.webp"
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
          brandName="Tattoo Vision"
          products={products}
          supplierBadge={null}
          hasMore={hasMoreProductos}
          onLoadMore={cargarMasProductos}
          loadingMore={cargandoMasProductos}
          light
          officialUrl="https://tattoovision.com"
          emptyTitle="Vitrina Multi-Tienda Supply"
          emptyMessage="En este momento ninguna tienda supply aliada ha cargado inventario activo de Tattoo Vision en la plataforma. Cuando un proveedor suba unidades, se listarán automáticamente aquí. Puedes consultar la disponibilidad técnica o adquirir equipos directamente en su canal oficial:"
          hideWhatsapp={true}
        />

        <SupplyFAQ items={faqItems} nombre="Tattoo Vision" light />

      </div>

      <FooterSupply light />
      <div className="h-16 md:hidden" />
      <SupplyMobileNav active="marcas" light />

    </div>
  )
}
