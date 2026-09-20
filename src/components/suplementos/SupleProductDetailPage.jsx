import { useState, useEffect, useRef } from 'react'
import { useLoaderData, useParams, useNavigate, Link } from 'react-router'
import { ArrowLeft, ShoppingCart, Share2, Store, MapPin, ExternalLink } from 'lucide-react'
import ProductImageGallery from '../ProductImageGallery'
import { VariantSelectorSupl } from './SuplCard'
import NavbarSuple from './NavbarSuple'
import SupleMobileNav from './SupleMobileNav'
import { useSupleCart } from '../../contexts/SupleCartContext'
import { fetchCatalogPage } from '../../hooks/useCatalog'
import { getSupleCategoryByCategoria } from '../../data/supleCategoriesOrder'
import { SUPLE_CART_CATEGORY, supleCartKey, supleCartItem, supleFormatPrice } from '../../lib/supleCart'
import { cloudinaryFill } from '../../lib/cloudinary'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const MP_LOGO_URL = 'https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/5.21.0/mercadopago/logo__large@2x.png'

// Ficha de producto estilo Mercado Libre para Suple (2026-09-19, migración a
// fondo blanco; 2026-09-20, Suple multitenant) — calco de
// StoreProductDetailPage.jsx/SupplyProductDetailPage.jsx: bloqueo de
// carrito por vendedor (vendorLock), insignia de Mercado Pago cuando ESE
// vendedor está conectado, y bloque de vendedor real (logo/nombre/
// municipio/"Ir a la página del vendedor") en vez del texto fijo de Nutri
// House de antes. Mientras un producto no tenga estudio_id (catálogo viejo
// sin migrar, ver Fase 11 del plan de multitenant), el bloque de vendedor
// simplemente no aparece — nunca se inventa una identidad — pero "Más de
// {categoría}" se mantiene siempre, sin importar si el producto tiene
// vendedor o no. El :id es un inventory.id de CUALQUIER variante del
// producto, mismo contrato que ya usa /api/product/:id sin cambios de
// backend.
export async function loader({ params }) {
  try {
    const res = await fetch(`${PANEL_URL}/api/product/${params.id}`)
    const data = await res.json()
    if (data.error) return { product: null, otrosProductos: [], tienda: null }

    // "Más de {categoría}" — 2 productos de la misma categoría, con su
    // propia foto (fetchCatalogPage, paginado, nunca el catálogo completo).
    // Los afiliados no llevan este bloque (no son productos propios).
    let otrosProductos = []
    if (data.tipo !== 'afiliado' && data.categoria) {
      try {
        const page = await fetchCatalogPage('suplementos', { categoria: data.categoria, tipo: 'fisico', limit: 6 })
        otrosProductos = page.items
          .filter(p => p.name !== data.name)
          .slice(0, 2)
          .map(p => ({
            id: p.variantes?.[0]?.id ?? null,
            name: p.name,
            price: p.variantes?.[0]?.price ?? null,
            image_url: p.variantes?.[0]?.image_url ?? p.image_url ?? null,
          }))
          .filter(p => p.id != null)
      } catch {
        otrosProductos = []
      }
    }

    // Vendedor real (Suple multitenant, 2026-09-20) — mismos datos que ya
    // muestran SupleTiendasDirectorioPage.jsx/EstudioSuplePage.jsx: logo,
    // municipio/departamento vía GET /api/estudios/:id, público y sin auth.
    let tienda = null
    if (data.estudio_id) {
      try {
        const estudioRes = await fetch(`${PANEL_URL}/api/estudios/${data.estudio_id}`)
        tienda = estudioRes.ok ? await estudioRes.json() : null
      } catch {
        tienda = null
      }
    }

    return { product: data, otrosProductos, tienda }
  } catch {
    return { product: null, otrosProductos: [], tienda: null }
  }
}

export function meta({ data, params }) {
  const product = data?.product
  const canonical = `${import.meta.env.VITE_SITE_URL}/suplementos/producto/${params.id}`
  if (!product) {
    return [{ title: 'Producto no encontrado | INKognito Suple' }]
  }
  const title = `${product.name} | INKognito Suple`
  const description = product.descripcion || `${product.name} — disponible en INKognito Suple, con envío a Urabá y toda Colombia.`
  const imageUrl = product.variantes?.[0]?.image_url
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonical },
    ...(imageUrl ? [{ property: 'og:image', content: imageUrl }] : []),
    { tagName: 'link', rel: 'canonical', href: canonical },
  ]
}

export default function SupleProductDetailPage() {
  const { product, otrosProductos, tienda } = useLoaderData()
  const { id } = useParams()
  const navigate = useNavigate()
  const { items: cartItems, addItem, removeItem, setSingleItem } = useSupleCart()
  const heroRef = useRef(null)

  const [activeVariant, setActiveVariant] = useState(0)
  const [imgIdx, setImgIdx] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [shareMsg, setShareMsg] = useState(null)
  const [bloqueoMsg, setBloqueoMsg] = useState(null)

  const variantes = product?.variantes ?? []

  // Abre mostrando la MISMA presentación que el usuario tenía seleccionada
  // en el grid, no siempre la primera.
  useEffect(() => {
    if (!variantes.length) return
    const idx = variantes.findIndex(v => v.id === Number(id))
    setActiveVariant(idx >= 0 ? idx : 0)
  }, [id])

  useEffect(() => { setImgIdx(0) }, [activeVariant])

  // El navbar se vuelve sólido apenas la foto (cuadro fijo, no pantalla
  // completa) termina de pasar detrás de él.
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return
      setScrolled(heroRef.current.getBoundingClientRect().bottom < 64)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-zinc-900 font-black uppercase tracking-widest">Producto no encontrado</p>
        <Link to="/suplementos" className="font-bold underline underline-offset-2 text-zinc-700">
          Volver a Suple
        </Link>
      </div>
    )
  }

  const esAfiliado = product.tipo === 'afiliado'
  const urlAfiliado = product.url_ventas || product.url_checkout || null
  const categoriaInfo = getSupleCategoryByCategoria(product.categoria)

  const sel = variantes[activeVariant] || variantes[0] || {}
  const resolvedPrice = supleFormatPrice(sel.price)
  const images = [sel.image_url, sel.image_url_2, sel.image_url_3].filter(Boolean)
  const sinStock = (sel.stock ?? 0) <= 0

  // Dueño real de la variante seleccionada (Suple multitenant, 2026-09-20)
  // — mismo criterio que Store/Supply: `estudio_nombre_display` ya resuelve
  // nombre_suple vs nombre a nivel de backend (server.js).
  const proveedorId = sel.estudio_id ?? product.estudio_id ?? null
  const proveedorNombre = sel.estudio_nombre_display || product.estudio_nombre_display || null
  const proveedorSlug = sel.estudio_slug || product.estudio_slug || null
  const proveedorMp = sel.estudio_mp_conectado ?? product.estudio_mp_conectado ?? false

  // Misma key que SuplCard.jsx (ver src/lib/supleCart.js) — el estado "en
  // carrito" y el "1" del botón coinciden con la card sin importar desde
  // dónde se agregó.
  const cartKey = supleCartKey(product.name, sel.variant)
  const enCarrito = cartItems.some(i => i.key === cartKey)

  const armarItem = () => supleCartItem({
    nombre: product.name,
    variant: sel.variant,
    price: resolvedPrice || 'Consultar precio',
    inventoryId: sel.id,
    categoria: product.categoria,
    image: images[0],
    stock: sel.stock,
  })
  const opts = { estudioId: proveedorId, estudioNombre: proveedorNombre, mpConectado: !!proveedorMp }

  // Parpadeo del botón al agregar (mismo criterio que
  // SupplyProductDetailPage.jsx) — feedback visual corto, no cambia el
  // estado real del carrito (eso ya lo hace enCarrito).
  const handleToggle = () => {
    if (enCarrito) {
      removeItem(cartKey)
      return
    }
    const resultado = addItem(armarItem(), SUPLE_CART_CATEGORY, opts)
    if (resultado && !resultado.ok) {
      setBloqueoMsg(`Ya tienes productos de ${resultado.nombreActual} en tu carrito — termina esa compra antes de agregar de otro vendedor.`)
      setTimeout(() => setBloqueoMsg(null), 5000)
      return
    }
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 500)
  }

  // "Comprar ahora" — setSingleItem() REEMPLAZA todo el carrito por este
  // único producto (no lo suma a lo que ya había) y navega directo al
  // pedido en línea.
  const handleComprarAhora = () => {
    if (sinStock) return
    setSingleItem(armarItem(), SUPLE_CART_CATEGORY, opts)
    navigate('/pedido/suplementos')
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/suplementos/producto/${sel.id ?? id}`
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url }) } catch {}
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setShareMsg('Link copiado')
      setTimeout(() => setShareMsg(null), 2000)
    } catch {}
  }

  const infoBlock = (
    <div className="flex flex-col gap-3">
      <h1 className="text-sm font-medium leading-snug text-zinc-900">{product.name}</h1>
      {resolvedPrice && <p className="text-zinc-900 font-bold text-2xl">{resolvedPrice}</p>}
      {/* Medio de pago — solo si ESTE vendedor está conectado (proveedorMp):
          si no, el cobro real no pasa por Mercado Pago, mostrar el logo
          igual sería prometer algo que no aplica para este producto. */}
      {proveedorMp && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Medios de pago:</span>
          <img
            src={MP_LOGO_URL}
            alt="Mercado Pago"
            className="h-4"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </div>
      )}
      {!esAfiliado && (
        sinStock ? (
          <p className="text-red-500 text-xs font-bold uppercase tracking-wide">Agotado</p>
        ) : (sel.stock ?? 0) <= 3 && (
          <p className="text-amber-700 text-xs font-bold">Últimas {sel.stock}</p>
        )
      )}
      {variantes.length > 0 && (
        <VariantSelectorSupl variantes={variantes} selIdx={activeVariant} onChange={setActiveVariant} large />
      )}
      {product.descripcion && (
        <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-line">{product.descripcion}</p>
      )}
      {bloqueoMsg && (
        <p className="text-[11px] leading-snug text-amber-700 bg-amber-100 border border-amber-200 rounded-lg px-3 py-2">{bloqueoMsg}</p>
      )}
    </div>
  )

  // Orden tomado de la referencia real de Mercado Libre (misma decisión ya
  // usada en Supply/Store): "Comprar ahora" primero (acción principal,
  // resuelve carrito+checkout de una), "Agregar al carrito" debajo como
  // secundaria. Un afiliado no se compra acá — un único CTA hacia la
  // plataforma externa.
  const ctaButtons = esAfiliado ? (
    urlAfiliado && (
      <a
        href={urlAfiliado}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-4 rounded-xl font-bold uppercase tracking-[0.1em] text-xs flex items-center justify-center gap-2 bg-zinc-700 text-white hover:bg-zinc-800 transition-colors duration-300"
      >
        Ver en {product.plataforma || 'la tienda'} <ExternalLink size={14} />
      </a>
    )
  ) : (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleComprarAhora}
        disabled={sinStock}
        className={`w-full py-4 rounded-xl font-bold uppercase tracking-[0.1em] text-xs transition-all duration-300 ${
          sinStock ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-zinc-700 text-white hover:bg-zinc-800'
        }`}
      >
        {sinStock ? 'Sin stock' : 'Comprar ahora'}
      </button>
      {/* Sin estado "Agregado" (verde) a propósito, mismo criterio que
          Supply/Store — el único feedback es el parpadeo (solo al agregar,
          ver handleToggle) y el badge sobre el ícono. */}
      <button
        onClick={handleToggle}
        disabled={sinStock}
        className={`w-full py-4 rounded-xl font-bold uppercase tracking-[0.1em] text-xs flex items-center justify-center gap-2 transition-all duration-200 border-2 ${justAdded ? 'cta-blink' : ''} ${
          sinStock ? 'border-zinc-200 text-zinc-400 cursor-not-allowed' : 'border-zinc-700 text-zinc-700 hover:bg-zinc-100'
        }`}
      >
        <span className="relative flex-shrink-0">
          <ShoppingCart size={16} />
          {enCarrito && (
            <span className="absolute -top-2 -right-2 w-3.5 h-3.5 rounded-full bg-zinc-700 text-white text-[9px] font-black flex items-center justify-center">
              1
            </span>
          )}
        </span>
        Agregar al carrito
      </button>
    </div>
  )

  // Bloque de vendedor (Suple multitenant, 2026-09-20) — mismos campos reales que ya muestran
  // SupleTiendasDirectorioPage.jsx/EstudioSuplePage.jsx (logo_url,
  // municipio, departamento). Solo aparece si el producto de verdad tiene
  // estudio_id (`tienda` viene del loader) — un producto todavía sin
  // migrar (ver Fase 11 del plan) no tiene ninguna identidad de vendedor
  // que mostrar, así que el header de arriba simplemente no aparece; "Más
  // de {categoría}" se mantiene siempre, con o sin vendedor real.
  const proveedorBlock = !esAfiliado && (
    <div className="border border-zinc-200 rounded-xl overflow-hidden">
      {proveedorNombre && (
        <Link to={`/suplementos/${proveedorSlug || `estudio/${proveedorId}`}`} className="flex items-center gap-3 px-4 py-3">
          <div className="w-11 h-11 rounded-full bg-zinc-100 overflow-hidden flex items-center justify-center flex-shrink-0">
            {tienda?.logo_url ? (
              <img src={cloudinaryFill(tienda.logo_url, 100, 100)} alt={proveedorNombre} className="w-full h-full object-cover" />
            ) : (
              <Store size={18} className="text-zinc-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-black uppercase text-sm text-zinc-900 truncate">{proveedorNombre}</p>
            {tienda?.municipio && (
              <p className="flex items-center gap-1 text-[11px] text-zinc-500 truncate">
                <MapPin size={11} className="flex-shrink-0" />
                {tienda.municipio}{tienda.departamento ? `, ${tienda.departamento}` : ''}
              </p>
            )}
          </div>
        </Link>
      )}
      {otrosProductos.length > 0 && (
        <div className="border-t border-zinc-100">
          <p className="px-4 pt-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Más de {categoriaInfo?.name || product.categoria}
          </p>
          {otrosProductos.map(p => (
            <Link
              key={p.id}
              to={`/suplementos/producto/${p.id}`}
              className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50"
            >
              <div className="w-20 h-20 rounded-lg bg-zinc-50 overflow-hidden flex-shrink-0">
                {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-contain" />}
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <span className="text-sm text-zinc-700 truncate">{p.name}</span>
                {p.price != null && (
                  <span className="text-sm font-bold text-zinc-900">{supleFormatPrice(p.price)}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
      {proveedorId ? (
        <Link
          to={`/suplementos/${proveedorSlug || `estudio/${proveedorId}`}`}
          className="flex items-center justify-between px-4 py-3 border-t border-zinc-100 text-sm font-bold text-zinc-700"
        >
          Ir a la página del vendedor
          <span aria-hidden="true">→</span>
        </Link>
      ) : categoriaInfo && (
        <Link
          to={categoriaInfo.link}
          className="flex items-center justify-between px-4 py-3 border-t border-zinc-100 text-sm font-bold text-zinc-700"
        >
          Ver toda la categoría
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-white">

      {/* ===== MÓVIL — cuadro de foto estándar + navbar transparente ===== */}
      <div className="md:hidden">
        <div ref={heroRef} className="relative w-full aspect-square bg-zinc-50 border-b border-zinc-200">
          {images.length > 0 ? (
            <ProductImageGallery
              images={images}
              alt={`${product.name}${sel.variant ? ' ' + sel.variant : ''}`}
              containerClassName="w-full h-full"
              imgClassName="w-full h-full object-contain"
              activeIndex={imgIdx}
              onIndexChange={setImgIdx}
              eager
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-zinc-400 uppercase tracking-[0.3em] text-xs text-center px-6">{product.name}</p>
            </div>
          )}
        </div>

        <div className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-white shadow-sm border-b border-zinc-200' : 'bg-transparent'}`}>
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3">
            <button
              onClick={() => navigate(-1)}
              aria-label="Volver"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${scrolled ? 'text-zinc-900' : 'bg-white/80 backdrop-blur-md text-zinc-900'}`}
            >
              <ArrowLeft size={18} />
            </button>
            <span />
            <button
              onClick={handleShare}
              aria-label="Compartir"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${scrolled ? 'text-zinc-900' : 'bg-white/80 backdrop-blur-md text-zinc-900'}`}
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {shareMsg && (
          <div className="fixed top-16 inset-x-0 z-50 flex justify-center px-4">
            <p className="bg-zinc-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">{shareMsg}</p>
          </div>
        )}

        <div className="px-5 py-6 pb-28 flex flex-col gap-6">
          {infoBlock}
          {ctaButtons}
          {proveedorBlock}
        </div>

        <SupleMobileNav active={null} />
      </div>

      {/* ===== ESCRITORIO — layout simple de 2 columnas ===== */}
      <div className="hidden md:block">
        <NavbarSuple pageName={product.categoria || 'Producto'} hideMenu />
        <div className="pt-24 pb-16 max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="aspect-square w-full bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-200">
              {images.length > 0 ? (
                <ProductImageGallery
                  images={images}
                  alt={`${product.name}${sel.variant ? ' ' + sel.variant : ''}`}
                  containerClassName="w-full h-full"
                  imgClassName="w-full h-full object-contain"
                  activeIndex={imgIdx}
                  onIndexChange={setImgIdx}
                  eager
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-zinc-400 uppercase tracking-[0.3em] text-xs text-center px-6">{product.name}</p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-6">
              {infoBlock}
              {ctaButtons}
              {proveedorBlock}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
