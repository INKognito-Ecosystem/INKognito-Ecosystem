import { useState, useEffect, useRef } from 'react'
import { useLoaderData, useParams, useNavigate, Link } from 'react-router'
import { ArrowLeft, ShoppingCart, Share2, Wrench, ShieldCheck } from 'lucide-react'
import ProductImageGallery from '../ProductImageGallery'
import NavbarGym from './NavbarGym'
import GymMobileNav from './GymMobileNav'
import { useGymCart } from '../../contexts/GymCartContext'
import { fetchCatalogPage } from '../../hooks/useCatalog'
import { GYM_CART_CATEGORY, gymCartKey, gymCartItem, gymFormatPrice } from '../../lib/gymCart'
import logoGym from '../../assets/milogo/gym.webp'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Ficha de producto estilo Mercado Libre para Gym System (2026-09-20, Jose:
// "aplica a la card del producto la dinámica de los demás módulos, que abra
// una landing cuando le dé clic") — calco de SupleProductDetailPage.jsx (sin
// multitenant, Gym tampoco tiene tiendas propias) pero en la paleta oscura
// de Gym en vez de blanca: cada máquina la fabrica INKognito, no hay
// "vendedor" que mostrar, así que en su lugar hay un bloque de origen
// ESTÁTICO ("Hecho por INKognito Gym System"). El :id es un inventory.id de
// cualquier variante, mismo contrato que ya usa /api/product/:id sin
// cambios de backend.
export async function loader({ params }) {
  try {
    const res = await fetch(`${PANEL_URL}/api/product/${params.id}`)
    const data = await res.json()
    if (data.error) return { product: null, otrasMaquinas: [] }

    // "Otras máquinas" — 2 más del catálogo de Gym, con su propia foto
    // (fetchCatalogPage, paginado, nunca el catálogo completo).
    let otrasMaquinas = []
    if (data.tipo !== 'afiliado') {
      try {
        const page = await fetchCatalogPage('gym', { tipo: 'fisico', limit: 6 })
        otrasMaquinas = page.items
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
        otrasMaquinas = []
      }
    }

    return { product: data, otrasMaquinas }
  } catch {
    return { product: null, otrasMaquinas: [] }
  }
}

export function meta({ data, params }) {
  const product = data?.product
  const canonical = `${import.meta.env.VITE_SITE_URL}/gym/producto/${params.id}`
  if (!product) {
    return [{ title: 'Producto no encontrado | INKognito Gym System' }]
  }
  const title = `${product.name} | INKognito Gym System`
  const description = product.descripcion || `${product.name} — fabricada bajo pedido con soldadura profesional en INKognito Gym System, con envío a toda Colombia.`
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

export default function GymProductDetailPage() {
  const { product, otrasMaquinas } = useLoaderData()
  const { id } = useParams()
  const navigate = useNavigate()
  const { items: cartItems, addItem, removeItem, setSingleItem } = useGymCart()
  const heroRef = useRef(null)

  const [activeVariant, setActiveVariant] = useState(0)
  const [imgIdx, setImgIdx] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [shareMsg, setShareMsg] = useState(null)

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
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-white font-black uppercase tracking-widest">Producto no encontrado</p>
        <Link to="/gym/maquinas-pedido" className="font-bold underline underline-offset-2 text-gray-300">
          Volver a Gym System
        </Link>
      </div>
    )
  }

  const sel = variantes[activeVariant] || variantes[0] || {}
  const resolvedPrice = gymFormatPrice(sel.price)
  // Sin foto de referencia si no hay image_url real (2026-09-20, Jose: "si
  // no tiene imagen, simplemente no se muestra imagen") — sin fotos, se
  // muestra el ícono de llave (ver más abajo), igual que antes de la
  // migración de la card a esta ficha.
  const images = [sel.image_url, sel.image_url_2, sel.image_url_3].filter(Boolean)
  const sinStock = (sel.stock ?? 0) <= 0

  // Misma key que la card de MaquinasPedidoPage.jsx (ver src/lib/gymCart.js)
  // — el estado "en carrito" coincide sin importar desde dónde se agregó.
  const cartKey = gymCartKey(product.name)
  const enCarrito = cartItems.some(i => i.key === cartKey)

  const armarItem = () => gymCartItem({
    nombre: product.name,
    price: resolvedPrice || 'Desde $XX.000',
    inventoryId: sel.id,
    image: images[0],
    stock: sel.stock,
  })

  const handleToggle = () => {
    if (enCarrito) {
      removeItem(cartKey)
      return
    }
    addItem(armarItem(), GYM_CART_CATEGORY)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 500)
  }

  // "Comprar ahora" — setSingleItem() REEMPLAZA todo el carrito por esta
  // única máquina y navega directo a /pedido/gym.
  const handleComprarAhora = () => {
    if (sinStock) return
    setSingleItem(armarItem(), GYM_CART_CATEGORY)
    navigate('/pedido/gym')
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/gym/producto/${sel.id ?? id}`
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
      <div className="flex gap-1.5">
        <span className="text-[9px] font-bold uppercase tracking-widest bg-gray-800 text-gray-400 rounded-full px-2 py-0.5">Bajo pedido</span>
        <span className="text-[9px] font-bold uppercase tracking-widest bg-gray-800 text-gray-400 rounded-full px-2 py-0.5">Envío nacional</span>
      </div>
      <h1 className="text-sm font-medium leading-snug text-white">{product.name}</h1>
      {resolvedPrice && <p className="text-white font-bold text-2xl">{resolvedPrice}</p>}
      {sinStock ? (
        <p className="text-red-500 text-xs font-bold uppercase tracking-wide">Agotada</p>
      ) : (sel.stock ?? 0) <= 3 && (sel.stock ?? 0) > 0 && (
        <p className="text-amber-500 text-xs font-bold">Últimas {sel.stock}</p>
      )}
      {product.descripcion && (
        <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{product.descripcion}</p>
      )}
    </div>
  )

  const ctaButtons = (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleComprarAhora}
        disabled={sinStock}
        className={`w-full py-4 rounded-xl font-bold uppercase tracking-[0.1em] text-xs transition-all duration-300 ${
          sinStock ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-white text-gray-950 hover:bg-gray-200'
        }`}
      >
        {sinStock ? 'Sin disponibilidad' : 'Comprar ahora'}
      </button>
      {/* Sin estado "Agregado" (verde) a propósito, mismo criterio que
          Supply/Store/Suple — el único feedback es el parpadeo (solo al
          agregar) y el badge sobre el ícono. */}
      <button
        onClick={handleToggle}
        disabled={sinStock}
        className={`w-full py-4 rounded-xl font-bold uppercase tracking-[0.1em] text-xs flex items-center justify-center gap-2 transition-all duration-200 border-2 ${justAdded ? 'cta-blink' : ''} ${
          sinStock ? 'border-gray-800 text-gray-600 cursor-not-allowed' : 'border-white text-white hover:bg-white/10'
        }`}
      >
        <span className="relative flex-shrink-0">
          <ShoppingCart size={16} />
          {enCarrito && (
            <span className="absolute -top-2 -right-2 w-3.5 h-3.5 rounded-full bg-white text-gray-950 text-[9px] font-black flex items-center justify-center">
              1
            </span>
          )}
        </span>
        Agregar al carrito
      </button>
    </div>
  )

  // Bloque de origen ESTÁTICO (reemplaza al bloque de vendedor multitenant
  // de Store/Supply) — cada máquina la fabrica INKognito, no hay tienda que
  // mostrar. Debajo, "Otras máquinas" y el link al catálogo completo.
  const origenBlock = (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-11 h-11 rounded-full bg-gray-900 border border-gray-800 overflow-hidden flex items-center justify-center flex-shrink-0">
          <img src={logoGym} alt="INKognito Gym System" className="w-full h-full object-contain" />
        </div>
        <div className="min-w-0">
          <p className="font-black uppercase text-sm text-white truncate">INKognito Gym System</p>
          <p className="flex items-center gap-1 text-[11px] text-gray-500 truncate">
            <ShieldCheck size={11} className="flex-shrink-0" />
            Soldadura profesional — hecha a mano en Chigorodó, Urabá
          </p>
        </div>
      </div>
      {otrasMaquinas.length > 0 && (
        <div className="border-t border-gray-800">
          <p className="px-4 pt-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
            Otras máquinas
          </p>
          {otrasMaquinas.map(p => (
            <Link
              key={p.id}
              to={`/gym/producto/${p.id}`}
              className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 last:border-b-0 hover:bg-gray-900/60"
            >
              <div className="w-20 h-20 rounded-lg bg-gray-900 overflow-hidden flex-shrink-0">
                {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-contain" />}
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <span className="text-sm text-gray-300 truncate">{p.name}</span>
                {p.price != null && (
                  <span className="text-sm font-bold text-white">{gymFormatPrice(p.price)}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
      <Link
        to="/gym/maquinas-pedido"
        className="flex items-center justify-between px-4 py-3 border-t border-gray-800 text-sm font-bold text-white"
      >
        Ver todas las máquinas
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950">

      {/* ===== MÓVIL — cuadro de foto estándar + navbar transparente ===== */}
      <div className="md:hidden">
        <div ref={heroRef} className="relative w-full aspect-square bg-gray-900 border-b border-gray-800">
          {images.length > 0 ? (
            <ProductImageGallery
              images={images}
              alt={product.name}
              containerClassName="w-full h-full"
              imgClassName="w-full h-full object-contain"
              activeIndex={imgIdx}
              onIndexChange={setImgIdx}
              eager
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Wrench size={40} className="text-gray-800" strokeWidth={1} />
            </div>
          )}
        </div>

        <div className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-gray-950 shadow-sm border-b border-gray-800' : 'bg-transparent'}`}>
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3">
            <button
              onClick={() => navigate(-1)}
              aria-label="Volver"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${scrolled ? 'text-white' : 'bg-black/50 backdrop-blur-md text-white'}`}
            >
              <ArrowLeft size={18} />
            </button>
            <span />
            <button
              onClick={handleShare}
              aria-label="Compartir"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${scrolled ? 'text-white' : 'bg-black/50 backdrop-blur-md text-white'}`}
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {shareMsg && (
          <div className="fixed top-16 inset-x-0 z-50 flex justify-center px-4">
            <p className="bg-white text-gray-950 text-xs font-bold px-4 py-2 rounded-full shadow-lg">{shareMsg}</p>
          </div>
        )}

        <div className="px-5 py-6 pb-28 flex flex-col gap-6">
          {infoBlock}
          {ctaButtons}
          {origenBlock}
        </div>

        <GymMobileNav />
      </div>

      {/* ===== ESCRITORIO — layout simple de 2 columnas ===== */}
      <div className="hidden md:block">
        <NavbarGym />
        <div className="pt-24 pb-16 max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="aspect-square w-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
              {images.length > 0 ? (
                <ProductImageGallery
                  images={images}
                  alt={product.name}
                  containerClassName="w-full h-full"
                  imgClassName="w-full h-full object-contain"
                  activeIndex={imgIdx}
                  onIndexChange={setImgIdx}
                  eager
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Wrench size={64} className="text-gray-800" strokeWidth={1} />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-6">
              {infoBlock}
              {ctaButtons}
              {origenBlock}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
