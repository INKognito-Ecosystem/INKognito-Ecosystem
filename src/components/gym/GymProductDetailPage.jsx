import { useState, useEffect, useRef } from 'react'
import { useLoaderData, useParams, useNavigate, Link } from 'react-router'
import { ArrowLeft, ShoppingCart, Share2, Wrench, MapPin } from 'lucide-react'
import ProductImageGallery from '../ProductImageGallery'
import ProductImageThumbs from '../ProductImageThumbs'
import NavbarGym from './NavbarGym'
import GymMobileNav from './GymMobileNav'
import { useGymCart } from '../../contexts/GymCartContext'
import { fetchCatalogPage } from '../../hooks/useCatalog'
import { GYM_CART_CATEGORY, gymCartKey, gymCartItem, gymFormatPrice } from '../../lib/gymCart'
import { cloudinaryFill } from '../../lib/cloudinary'
import logoGym from '../../assets/milogo/gym.webp'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// La tienda de Gym es UNA sola por ahora: "INKognito Gym Equipment", la de
// Jose — una fila real de `estudios` (tipo='gym'), creada el 2026-09-21. Las
// máquinas nuevas que se carguen desde el panel sin dueño caen a ella por
// este slug; cuando haya más tiendas en Gym, cada máquina traerá su
// `estudio_slug` propio y este valor quedará solo como respaldo.
const GYM_TIENDA_SLUG = 'inkognito-gym-equipment'

// 2026-09-21 (Jose: Gym pasa a fondo blanco como los demás): variante CLARA;
// los botones principales van en grafito (zinc-700) como en Suple.
// Ficha de producto estilo Mercado Libre para Gym System (2026-09-20, Jose:
// "aplica a la card del producto la dinámica de los demás módulos, que abra
// una landing cuando le dé clic") — calco de SupleProductDetailPage.jsx. El
// bloque de abajo (2026-09-21, Jose: "lo que aparecerá allí será una tienda
// real, y será mi tienda") muestra la TIENDA REAL de la máquina — logo,
// nombre y ubicación leídos de `estudios`, igual que en los demás módulos —
// en vez del texto fijo de antes. El :id es un inventory.id de cualquier
// variante, mismo contrato que ya usa /api/product/:id.
export async function loader({ params }) {
  try {
    const res = await fetch(`${PANEL_URL}/api/product/${params.id}`)
    const data = await res.json()
    if (data.error) return { product: null, otrasMaquinas: [], tienda: null }

    // La tienda dueña de la máquina (o la de Gym por defecto si no tiene).
    let tienda = null
    try {
      const rt = await fetch(`${PANEL_URL}/api/estudios-por-slug/${data.estudio_slug || GYM_TIENDA_SLUG}`)
      if (rt.ok) tienda = await rt.json()
    } catch {
      tienda = null
    }

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

    return { product: data, otrasMaquinas, tienda }
  } catch {
    return { product: null, otrasMaquinas: [], tienda: null }
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
  const { product, otrasMaquinas, tienda } = useLoaderData()
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-zinc-900 font-black uppercase tracking-widest">Producto no encontrado</p>
        <Link to="/gym/maquinas-pedido" className="font-bold underline underline-offset-2 text-zinc-700">
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
      <h1 className="text-sm font-medium leading-snug text-zinc-900">{product.name}</h1>
      {resolvedPrice && <p className="text-zinc-900 font-bold text-2xl">{resolvedPrice}</p>}
      {sinStock ? (
        <p className="text-red-500 text-xs font-bold uppercase tracking-wide">Agotada</p>
      ) : (sel.stock ?? 0) <= 3 && (sel.stock ?? 0) > 0 && (
        <p className="text-amber-500 text-xs font-bold">Últimas {sel.stock}</p>
      )}
      {product.descripcion && (
        <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-line">{product.descripcion}</p>
      )}
      {/* Etiquetas abajo, una debajo de la otra (2026-09-21, Jose) — mismo
          orden que la card de Máquinas: nombre y precio arriba. */}
      <div className="flex flex-col items-start gap-1.5">
        <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-widest bg-zinc-100 text-zinc-600 rounded-full px-2 py-0.5">Bajo pedido</span>
        <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-widest bg-zinc-100 text-zinc-600 rounded-full px-2 py-0.5">Envío nacional</span>
      </div>
    </div>
  )

  const ctaButtons = (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleComprarAhora}
        disabled={sinStock}
        className={`w-full py-4 rounded-xl font-bold uppercase tracking-[0.1em] text-xs transition-all duration-300 ${
          sinStock ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-zinc-700 text-white hover:bg-zinc-800'
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

  // Bloque de la TIENDA (mismo lugar y formato que el de Store/Supply/Suple):
  // logo + nombre + ubicación de la tienda real de la máquina; el encabezado y
  // el botón de abajo llevan a su página (EstudioGymPage.jsx), que se puede
  // compartir sola. Entre los dos, "Otras máquinas".
  const tiendaNombre = tienda?.nombre || product.estudio_nombre_display || null
  const tiendaHref = tienda ? `/gym/${tienda.slug || `estudio/${tienda.id}`}` : '/gym/maquinas-pedido'
  const origenBlock = (
    <div className="border border-zinc-200 rounded-xl overflow-hidden">
      {tiendaNombre && (
        <Link to={tiendaHref} className="flex items-center gap-3 px-4 py-3">
          <div className="w-11 h-11 rounded-full bg-zinc-50 border border-zinc-200 overflow-hidden flex items-center justify-center flex-shrink-0">
            {tienda?.logo_url ? (
              <img src={cloudinaryFill(tienda.logo_url, 100, 100)} alt={tiendaNombre} className="w-full h-full object-cover" />
            ) : (
              <img src={logoGym} alt={tiendaNombre} className="w-full h-full object-contain scale-[1.6]" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-black uppercase text-sm text-zinc-900 truncate">{tiendaNombre}</p>
            {tienda?.municipio && (
              <p className="flex items-center gap-1 text-[11px] text-zinc-500 truncate">
                <MapPin size={11} className="flex-shrink-0" />
                {tienda.municipio}{tienda.departamento ? `, ${tienda.departamento}` : ''}
              </p>
            )}
          </div>
        </Link>
      )}
      {otrasMaquinas.length > 0 && (
        <div className="border-t border-zinc-200">
          <p className="px-4 pt-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Otras máquinas
          </p>
          {otrasMaquinas.map(p => (
            <Link
              key={p.id}
              to={`/gym/producto/${p.id}`}
              className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 last:border-b-0 hover:bg-zinc-50"
            >
              <div className="w-20 h-20 rounded-lg bg-zinc-50 overflow-hidden flex-shrink-0">
                {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-contain" />}
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <span className="text-sm text-zinc-700 truncate">{p.name}</span>
                {p.price != null && (
                  <span className="text-sm font-bold text-zinc-900">{gymFormatPrice(p.price)}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
      <Link
        to={tiendaHref}
        className="flex items-center justify-between px-4 py-3 border-t border-zinc-200 text-sm font-bold text-zinc-900"
      >
        {tienda ? 'Ir a la página de la tienda' : 'Ver todas las máquinas'}
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-white text-zinc-900">

      {/* ===== MÓVIL — cuadro de foto estándar + navbar transparente ===== */}
      <div className="md:hidden">
        <div ref={heroRef} className="relative w-full aspect-square bg-zinc-50 border-b border-zinc-200">
          {images.length > 0 ? (
            <ProductImageGallery hoverScrub={false}
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
              <Wrench size={40} className="text-zinc-300" strokeWidth={1} />
            </div>
          )}
        </div>

        <div className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-black shadow-sm border-b border-zinc-800' : 'bg-transparent'}`}>
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
            <p className="bg-zinc-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">{shareMsg}</p>
          </div>
        )}

        <div className="px-5 py-6 pb-28 flex flex-col gap-6">
          <ProductImageThumbs images={images} activeIndex={imgIdx} onSelect={setImgIdx} />
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
            <div className="flex flex-col gap-3">
            <div className="aspect-square w-full bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-200">
              {images.length > 0 ? (
                <ProductImageGallery hoverScrub={false}
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
                  <Wrench size={64} className="text-zinc-300" strokeWidth={1} />
                </div>
              )}
            </div>
              <ProductImageThumbs images={images} activeIndex={imgIdx} onSelect={setImgIdx} />
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
