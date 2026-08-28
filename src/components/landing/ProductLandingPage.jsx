import { useState, useEffect } from 'react'
import { Link, useParams, useLoaderData, useNavigate } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { Package, ExternalLink, Truck, Shield, ShieldCheck, MessageSquare, Zap, Globe, CalendarCheck } from 'lucide-react'
import EcosystemNavbar from '../ecosystem/EcosystemNavbar'
import ProductImageGallery from '../ProductImageGallery'
import { useSupplyCart } from '../../contexts/SupplyCartContext'
import { useStoreCart } from '../../contexts/StoreCartContext'
import { useGymCart } from '../../contexts/GymCartContext'
import { useSupleCart } from '../../contexts/SupleCartContext'
import logoNutriHouse from '../../assets/milogo/nutrihouse.webp'

const PANEL_URL  = import.meta.env.VITE_PANEL_URL
const WA_NUMBER  = import.meta.env.VITE_WHATSAPP_NUMBER || '573207911013'

const PLATAFORMA_LABEL = {
  amazon:       'Amazon',
  aliexpress:   'AliExpress',
  mercadolibre: 'Mercado Libre',
  hotmart:      'Hotmart',
  dropi:        'Dropi',
}

const PLATAFORMA_BADGE = {
  hotmart:      { emoji: '📚', text: 'Curso digital — acceso inmediato tras la compra' },
  amazon:       { emoji: '📦', text: 'Producto físico — entregado por Amazon' },
  aliexpress:   { emoji: '📦', text: 'Producto físico — envío internacional desde AliExpress' },
  mercadolibre: { emoji: '🛍️', text: 'Producto físico — disponible en Mercado Libre' },
  dropi:        { emoji: '📦', text: 'Producto físico — pago contraentrega al recibir' },
}

const PLATAFORMA_TRUST = {
  hotmart: [
    { Icon: Zap,          text: 'Acceso inmediato — link directo a tu cuenta tras la compra' },
    { Icon: Shield,       text: 'Garantía de 7 días incluida por Hotmart' },
    { Icon: ExternalLink, text: 'Millones de estudiantes en Latinoamérica' },
  ],
  amazon: [
    { Icon: Truck,        text: 'Envío gestionado directamente por Amazon' },
    { Icon: Shield,       text: 'Compra protegida por Amazon' },
    { Icon: ExternalLink, text: 'La tienda online más grande del mundo' },
  ],
  aliexpress: [
    { Icon: Truck,        text: 'Envío internacional con seguimiento en tiempo real' },
    { Icon: Shield,       text: 'Protección al comprador incluida por AliExpress' },
    { Icon: ExternalLink, text: 'Millones de productos verificados' },
  ],
  mercadolibre: [
    { Icon: Truck,        text: 'Envío con Mercado Envíos — seguimiento en tiempo real' },
    { Icon: Shield,       text: 'Compra protegida por Mercado Libre' },
    { Icon: ExternalLink, text: 'Plataforma líder de comercio en Colombia' },
  ],
  dropi: [
    { Icon: Truck,        text: 'Contraentrega — pagas en efectivo solo cuando el producto llega a tu puerta' },
    { Icon: Shield,       text: 'Compra segura respaldada por Dropi y su red de transportadoras' },
    { Icon: Package,      text: 'Producto listo para despacho inmediato' },
  ],
}

const PLATAFORMA_TRUST_FALLBACK = [
  { Icon: Shield,       text: 'Compra directamente en la tienda oficial del producto' },
  { Icon: ExternalLink, text: 'Proceso de compra 100% en línea — sin intermediarios' },
  { Icon: Truck,        text: 'Envío y entrega gestionados por la plataforma' },
]

const MODULE_ACCENT = {
  supply:      '#3B82F6',
  store:       '#C9A84C',
  suplementos: '#9E9E9E',
  gym:         '#A1A1AA',
  dropi:       '#EC6F2D',
}

export async function loader({ params }) {
  try {
    const res = await fetch(`${PANEL_URL}/api/product/${params.id}`)
    const data = await res.json()
    if (data.error) return { product: null, warlockLogo: null }

    // Logo de Industrias Warlock — se resuelve en el loader (SSR) en vez de
    // con useSupplyVisual (fetch en el navegador tras montar) para que
    // aparezca desde el primer render en vez de "aparecer" un instante
    // después (reportado 2026-08-02). Solo se pide para Mobiliario, el
    // resto de productos no lo necesita.
    let warlockLogo = null
    if (data.module === 'supply' && data.categoria === 'Mobiliario') {
      try {
        const visualRes = await fetch(`${PANEL_URL}/api/visual/supply`)
        const visualData = await visualRes.json()
        warlockLogo = visualData.supply_brand_kwadron || null
      } catch {
        warlockLogo = null
      }
    }

    return { product: data, warlockLogo }
  } catch {
    return { product: null, warlockLogo: null }
  }
}

export function meta({ data }) {
  const product = data?.product
  if (!product) {
    return [{ title: 'Producto no encontrado | INKognito' }]
  }
  const title = `${product.name} | INKognito`
  const description = product.descripcion || `${product.name} — disponible con envío a toda Colombia`
  const imageUrl = product.variantes?.[0]?.image_url
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    ...(imageUrl ? [{ property: 'og:image', content: imageUrl }] : []),
  ]
}

// Módulo de inventario → contexto de carrito real. "suplementos" tiene su
// propio carrito desde que Suple se independizó de Gym como módulo propio
// (2026-08-02, ver SupleCartContext.jsx) — antes mandaba todo al carrito de
// Gym, bug detectado al agregar la insignia de Nutri House acá (2026-08-03).
const CART_MODULE = { supply: 'supply', store: 'store', gym: 'gym', suplementos: 'suplementos' }

export default function ProductLandingPage() {
  const { id } = useParams()
  const { product, warlockLogo } = useLoaderData()
  const navigate = useNavigate()
  const supplyCart = useSupplyCart()
  const storeCart = useStoreCart()
  const gymCart = useGymCart()
  const supleCart = useSupleCart()
  const [activeVariant, setActive] = useState(0)
  const [imgIdx, setImgIdx]        = useState(0)
  const [scrolled, setScrolled]    = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cambiar de variante vuelve a la foto de portada de esa variante — si no
  // se resetea, el índice de la variante anterior podía apuntar a un slot
  // vacío en la nueva.
  useEffect(() => { setImgIdx(0) }, [activeVariant])

  useEffect(() => {
    if (!product || typeof window.fbq !== 'function') return
    const v = product.variantes[0]
    window.fbq('track', 'ViewContent', {
      content_name:  product.name,
      content_ids:   [String(id)],
      content_type:  'product',
      value:         v?.price ?? 0,
      currency:      'COP',
    })
  }, [product])

  if (!product) return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm uppercase tracking-widest">
        Producto no encontrado
      </div>
      <footer className="border-t border-white/10 py-6 px-4 text-center">
        <span className="text-gray-500 text-[12px]">Desarrollado por INKognito</span>
      </footer>
    </div>
  )

  const variant         = product.variantes[activeVariant] || product.variantes[0]
  const isAfiliado      = product.tipo === 'afiliado'
  const isSupply        = product.module === 'supply'
  // Mobiliario (Industrias Warlock) no comparte la logística de Urabá/Eljach
  // del resto de Supply — fabrican en Bogotá, envío nacional, sin
  // contraentrega confirmada aún (2026-08-01).
  const esMobiliario     = isSupply && product.categoria === 'Mobiliario'
  // Nutri House suministra las 5 categorías de Suple (2026-08-03, confirmado
  // por Jose, incluida Accesorios) — a diferencia de Warlock/Tommy no hay
  // exclusiones por categoría/marca.
  const esNutriHouse     = product.module === 'suplementos'
  const accent          = MODULE_ACCENT[product.module] || '#A1A1AA'
  const imageUrl        = variant?.image_url || product.variantes[0]?.image_url
  const images           = variant?.image_url
    ? [variant.image_url, variant.image_url_2, variant.image_url_3].filter(Boolean)
    : [product.variantes[0]?.image_url, product.variantes[0]?.image_url_2, product.variantes[0]?.image_url_3].filter(Boolean)
  const stockNum        = (!isAfiliado && variant?.stock != null) ? Number(variant.stock) : null
  const sinStock        = stockNum === 0
  const stockBajo       = stockNum !== null && stockNum > 0 && stockNum <= 5
  const plataformaKey   = product.plataforma?.toLowerCase().replace(/\s+/g, '')
  const plataformaLabel = PLATAFORMA_LABEL[plataformaKey] || product.plataforma || 'Tienda'
  const plataformaBadge = isAfiliado ? (PLATAFORMA_BADGE[plataformaKey] ?? null) : null
  const plataformaTrust = isAfiliado ? (PLATAFORMA_TRUST[plataformaKey] ?? PLATAFORMA_TRUST_FALLBACK) : []

  const waMessage = encodeURIComponent(
    `Hola, quiero pedir:\n• ${product.name}${variant?.variant ? ` — ${variant.variant}` : ''}\nPrecio: $${variant?.price?.toLocaleString('es-CO') ?? '?'}`
  )

  // Pedido online — alternativa al WhatsApp, misma lógica que ya usan los
  // CartDrawer de Supply/Store/Gym: agrega el producto al carrito real y
  // manda a /pedido/:module, que lee ese mismo carrito y solo pide datos de
  // entrega. Antes esta landing (pensada para publicidad/compartir un link
  // directo) solo ofrecía WhatsApp — no tenía forma de generar el pedido sin
  // salir a otra app (2026-07-30).
  const cartModule = CART_MODULE[product.module]
  const cart = { supply: supplyCart, store: storeCart, gym: gymCart, suplementos: supleCart }[cartModule]
  const [bloqueoMsg, setBloqueoMsg] = useState(null)
  const handlePedidoOnline = () => {
    if (sinStock || !cart) return
    const productId = product.name + (variant?.variant ? '-' + variant.variant : '')
    const resultado = cart.addItem({
      id:          productId,
      inventoryId: variant?.id ?? null,
      name:        product.name + (variant?.variant ? ` (${variant.variant})` : ''),
      price:       variant?.price ? '$' + Math.round(variant.price).toLocaleString('es-CO') : '—',
      brand:       product.categoria || '',
      image:       imageUrl || '',
    }, product.categoria, isSupply ? {
      // Dueño de la VARIANTE activa, no de la fila con la que se aterrizó
      // en esta página — el catálogo maestro permite que variantes del
      // mismo producto pertenezcan a proveedores distintos (reportado
      // 2026-08-09). Fallback a nivel de producto por compatibilidad.
      estudioId:     variant?.estudio_id ?? product.estudio_id ?? null,
      estudioNombre: variant?.estudio_nombre_supply || variant?.estudio_nombre || product.estudio_nombre_supply || product.estudio_nombre || null,
      mpConectado:   !!(variant?.estudio_mp_conectado ?? product.estudio_mp_conectado),
    } : undefined)
    if (resultado && resultado.ok === false) {
      setBloqueoMsg(`Ya tienes productos de ${resultado.nombreActual} en tu carrito — termina esa compra antes de agregar de otro proveedor.`)
      return
    }
    navigate(`/pedido/${cartModule}`)
  }

  const PedidoOnlineButton = ({ className = '' }) => (
    <div className={className}>
      <button
        type="button"
        onClick={handlePedidoOnline}
        disabled={sinStock}
        className={`w-full flex items-center justify-center gap-3 py-4 font-black uppercase tracking-widest rounded transition-all text-sm ${
          sinStock
            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            : 'border-2 text-white hover:bg-white/5'
        }`}
        style={sinStock ? {} : { borderColor: accent }}
      >
        <CalendarCheck size={18} />
        Agendar Pedido en Línea
      </button>
      {bloqueoMsg && <p className="mt-2 text-[11px] leading-snug text-amber-400">{bloqueoMsg}</p>}
    </div>
  )

  const CTAButton = ({ className = '' }) => isAfiliado ? (
    <a
      href={product.url_checkout || product.url_ventas}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`flex items-center justify-center gap-3 py-4 bg-white text-black font-black uppercase tracking-widest rounded hover:bg-zinc-200 transition-all text-sm ${className}`}
    >
      <ExternalLink size={18} />
      {plataformaKey === 'hotmart' ? `Comprar en ${plataformaLabel}` : `Ver en ${plataformaLabel}`}
    </a>
  ) : (
    <a
      href={sinStock ? undefined : `https://wa.me/${WA_NUMBER}?text=${waMessage}`}
      target={sinStock ? undefined : '_blank'}
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-3 py-4 font-black uppercase tracking-widest rounded transition-all text-sm ${
        sinStock
          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          : 'bg-green-600 text-white hover:bg-green-500'
      } ${className}`}
    >
      <FaWhatsapp size={20} />
      {sinStock ? 'Sin stock' : 'Pedir por WhatsApp'}
    </a>
  )

  return (
    <div className={`min-h-screen bg-black text-white md:pb-0 ${!isAfiliado && cart ? 'pb-36' : 'pb-20'}`}>
      <EcosystemNavbar logoFilter="brightness(0) invert(1)" showTagline showTattooSection={false} />

      <div className="pt-20 max-w-5xl mx-auto px-4 py-8 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">

          {/* COLUMNA IZQUIERDA — imagen + descripción */}
          <div className="space-y-5">
            {images.length > 0
              ? (
                <>
                  <div className="relative">
                    {/* square (2026-08-27, Jose: "las imágenes... son
                        gigantes... por muy grande que sean se adapten...
                        ¿esto no se supone que ya lo habíamos corregido?")
                        — el 2026-08-09 esto quedó a propósito SIN square
                        (comentario en ProductImageGallery.jsx: "la foto
                        grande de ProductLandingPage sigue mostrando la
                        imagen completa tal cual"), para no recortar nada.
                        Con Supply multi-tenant, fotos de estudios de
                        cualquier proporción/resolución ya no tenían un
                        formato consistente (una vertical de celular se
                        veía enorme). cloudinarySquare usa c_pad (rellena
                        con fondo blanco), no c_fill — se sigue viendo la
                        foto completa sin recortar, solo dentro de un
                        lienzo 800×800 fijo en vez de a su tamaño crudo. */}
                    <ProductImageGallery
                      images={images}
                      alt={product.name}
                      activeIndex={imgIdx}
                      onIndexChange={setImgIdx}
                      containerClassName="rounded-xl border border-zinc-800 overflow-hidden aspect-square bg-white"
                      imgClassName="w-full h-full object-contain"
                      eager
                      square
                    />
                    {/* Insignia de marca sobre la foto — mismo logo que
                        IndustriasWarlockPage.jsx, solo Mobiliario/Warlock
                        (2026-08-02). Vive fuera del contenedor overflow-hidden
                        de la galería para no quedar recortada. */}
                    {esMobiliario && warlockLogo && (
                      <div
                        className="absolute bottom-3 right-3 w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white shadow-lg"
                        title="Fabricado por Industrias Warlock"
                      >
                        <img src={warlockLogo} alt="Industrias Warlock" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {/* Nutri House (Suple) — el logo es un webp con fondo
                        transparente, se deja libre sin círculo/plate (Jose,
                        2026-08-03), con drop-shadow para que no se pierda
                        sobre fotos claras. */}
                    {esNutriHouse && (
                      <img
                        src={logoNutriHouse}
                        alt="Nutri House"
                        title="Suministrado por Nutri House"
                        className="absolute bottom-3 right-3 h-14 md:h-16 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
                      />
                    )}
                  </div>
                  {images.length > 1 && (
                    <div className="hidden md:flex gap-2">
                      {images.map((src, i) => (
                        <button
                          key={src}
                          type="button"
                          onClick={() => setImgIdx(i)}
                          className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                            i === imgIdx ? 'border-white' : 'border-zinc-800 hover:border-zinc-600'
                          }`}
                        >
                          <img src={src} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )
              : (
                <div className="relative aspect-square rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700">
                  <Package size={64} />
                  {esMobiliario && warlockLogo && (
                    <div
                      className="absolute bottom-3 right-3 w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white shadow-lg"
                      title="Fabricado por Industrias Warlock"
                    >
                      <img src={warlockLogo} alt="Industrias Warlock" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {esNutriHouse && (
                    <img
                      src={logoNutriHouse}
                      alt="Nutri House"
                      title="Suministrado por Nutri House"
                      className="absolute bottom-3 right-3 h-14 md:h-16 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
                    />
                  )}
                </div>
              )
            }

            {/* Descripción — debajo de la imagen en desktop, se oculta en móvil (va al final) */}
            {product.descripcion && (
              <p className="hidden md:block text-zinc-400 text-sm leading-relaxed">{product.descripcion}</p>
            )}
          </div>

          {/* COLUMNA DERECHA — decisión de compra */}
          <div className="space-y-5">

            <div>
              <p className="hidden md:block text-zinc-500 text-[11px] uppercase tracking-widest mb-1">{product.categoria}</p>

              {/* MÓVIL — dos filas flex justify-between independientes.
                  Clave para que el precio quede repartido entre nombre y
                  stock (ni pegado al nombre ni pegado al stock, sin importar
                  cuán largo sea el nombre): nombre/precio/stock son 3 hijos
                  directos del mismo flex row — justify-between reparte el
                  espacio sobrante en 2 huecos iguales, así que el precio cae
                  a medio camino entre ambos según el ancho real del nombre,
                  no según una columna reservada de tamaño fijo (eso fue lo
                  que pegaba el precio a la derecha con CSS Grid + 1fr).
                  El stock ("5" arriba / "disponibles" abajo) usa el mismo
                  ancho fijo (w-16) en ambas filas para que el texto quede
                  centrado en la misma posición horizontal en las dos filas,
                  ya que son flex containers separados y no comparten columna
                  de grid (2026-08-02). */}
              <div className="md:hidden">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-zinc-500 text-[11px] uppercase tracking-widest">{product.categoria}</p>
                  {stockNum !== null && stockBajo && (
                    <span className="w-16 shrink-0 text-center text-sm font-black text-amber-400">{stockNum}</span>
                  )}
                </div>
                <div className="flex items-baseline justify-between gap-3 mt-1">
                  <h1 className="text-base font-black uppercase tracking-tight leading-tight truncate shrink min-w-0">
                    {product.name}
                  </h1>
                  {variant?.price != null && (
                    <span className="shrink-0 text-sm font-black whitespace-nowrap">${variant.price.toLocaleString('es-CO')}</span>
                  )}
                  {stockNum !== null && (
                    stockBajo ? (
                      <span className="w-16 shrink-0 text-center text-[8px] font-bold uppercase tracking-wide text-amber-400">disponibles</span>
                    ) : (
                      <span className={`shrink-0 whitespace-nowrap text-[11px] font-bold uppercase tracking-wide ${
                        sinStock ? 'text-red-500' : 'text-zinc-500'
                      }`}>
                        {sinStock ? 'Agotado' : `${stockNum} en stock`}
                      </span>
                    )
                  )}
                </div>
              </div>
              {product.descripcion && (
                <p className="md:hidden text-zinc-400 text-xs leading-relaxed mt-2">{product.descripcion}</p>
              )}

              {/* ESCRITORIO — layout original, sin cambios */}
              <div className="hidden md:flex md:items-start md:justify-between md:gap-4">
                <h1 className="text-4xl font-black uppercase tracking-tight leading-tight">
                  {product.name}
                </h1>
              </div>
              {variant?.price != null && (
                <p className="hidden md:block text-3xl font-black mt-3">
                  ${variant.price.toLocaleString('es-CO')}
                </p>
              )}
            </div>

            {/* Variantes — arriba de la frase de marca y del badge/stock de
                escritorio, para que se vea de inmediato junto a nombre/precio
                sin tener que bajar más (reportado 2026-08-02, quedaba muy
                abajo en productos con variantes tipo WJX). */}
            {product.variantes.length > 1 && (
              <div>
                <p className="text-zinc-500 text-[11px] uppercase tracking-widest mb-2">Variante</p>
                <div className="flex flex-wrap gap-2">
                  {product.variantes.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`px-4 py-2 rounded border text-sm font-bold transition-all ${
                        i === activeVariant
                          ? 'text-black'
                          : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
                      }`}
                      style={i === activeVariant ? { borderColor: accent, backgroundColor: accent } : {}}
                    >
                      {v.variant || 'Único'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tagline — una sola copia para móvil y escritorio, ya no hay
                versión duplicada md:hidden porque las Variantes ahora van
                antes que esta frase en ambos layouts (ver nota arriba). */}
            {isSupply && (
              <p className="text-xs italic tracking-wide border-l-2 pl-3" style={{ borderColor: accent, color: accent }}>
                De un tatuador, para tatuadores.
              </p>
            )}

            {/* Badge de plataforma — solo afiliados */}
            {plataformaBadge && (
              <div className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 w-fit">
                <span>{plataformaBadge.emoji}</span>
                <span>{plataformaBadge.text}</span>
              </div>
            )}

            {/* Stock — solo escritorio en móvil ya va en la línea compacta de arriba */}
            {stockNum !== null && (
              <div className={`hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${
                sinStock ? 'text-red-500' : stockBajo ? 'text-amber-400' : 'text-zinc-500'
              }`}>
                {(sinStock || stockBajo) && <Zap size={13} />}
                {sinStock
                  ? 'Agotado por el momento'
                  : stockBajo
                    ? `¡Solo ${stockNum} disponible${stockNum !== 1 ? 's' : ''}!`
                    : `${stockNum} en stock`}
              </div>
            )}

            {/* CTA desktop — pedido online primero (queda nuestro), WhatsApp
                como alternativa, igual que en los CartDrawer */}
            <div className="hidden md:flex md:flex-col md:gap-3">
              {!isAfiliado && cart && <PedidoOnlineButton className="w-full" />}
              <CTAButton className="w-full" />
            </div>

            {/* Trust signals — solo modulos con proveedor externo (no Gym: maquinas propias) */}
            {!isAfiliado && ['supply', 'suplementos', 'store'].includes(product.module) && (
              <div className="border-t border-zinc-800 pt-4 space-y-2">
                {/* Industrias Warlock (mobiliario) tiene su propia insignia —
                    mismo criterio que supplierBadge en BrandCatalogSection.jsx
                    (ver IndustriasWarlockPage.jsx). El resto de marcas sin
                    Tommy (Tattoo Vision, Heaven Pro) simplemente no muestran
                    insignia de proveedor, igual que en su página de marca. */}
                {esMobiliario ? (
                  <>
                    <div className="flex items-center gap-3 text-zinc-400 text-xs">
                      <ShieldCheck size={13} className="shrink-0" style={{ color: accent }} />
                      <span>Producto de Industrias Warlock — mobiliario fabricado para estudios de tatuaje</span>
                    </div>
                    {/* Warlock fabrica en Bogotá y envía a todo el país — no
                        aplica la cobertura/contraentrega de Eljach (esa es
                        solo Urabá). Contraentrega para mobiliario aún no
                        está confirmada con ellos (2026-08-01). */}
                    <div className="flex items-center gap-3 text-zinc-400 text-xs">
                      <Truck size={13} className="shrink-0" style={{ color: accent }} />
                      <span>Envío a toda Colombia desde Bogotá — pago por Nequi antes del despacho, aún sin contraentrega para mobiliario</span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Insignia dinámica por producto (fase 5, 2026-08-07)
                        — reemplaza el texto fijo de Tommy, que asumía que
                        todo lo de Supply venía de ahí. Ya no muestra nada
                        hasta que Tommy se registre como empresa proveedora
                        y sus productos queden asociados a su perfil. */}
                    {isSupply && (variant?.estudio_nombre_supply || product.estudio_nombre_supply) && (
                      <div className="flex items-center gap-3 text-zinc-400 text-xs">
                        <ShieldCheck size={13} className="shrink-0" style={{ color: accent }} />
                        <span>Suministrado por {variant?.estudio_nombre_supply || product.estudio_nombre_supply}</span>
                      </div>
                    )}
                    {esNutriHouse && (
                      <div className="flex items-center gap-3 text-zinc-400 text-xs">
                        <ShieldCheck size={13} className="shrink-0" style={{ color: accent }} />
                        <span>Suministrado por Nutri House — punto físico en Chigorodó</span>
                      </div>
                    )}
                    {/* Supply es multi-tenant (fase 4/5): cada producto puede
                        venir de un estudio distinto, cada uno con su propia
                        logística — ya no todo sale de Eljach en Urabá como
                        cuando Supply era solo el inventario de Jose (Jose,
                        2026-08-27: "ya no se maneja como antes, ni lo
                        transporta Eljach... debe ser universal"). Store y
                        Suplementos siguen siendo de un solo proveedor, ahí
                        el texto específico de Eljach/Urabá sigue siendo
                        cierto. */}
                    {isSupply ? (
                      <div className="flex items-center gap-3 text-zinc-400 text-xs">
                        <Truck size={13} className="shrink-0" style={{ color: accent }} />
                        <span>Envío y forma de pago los coordina {variant?.estudio_nombre_supply || product.estudio_nombre_supply || 'el vendedor'} directamente contigo al confirmar tu pedido</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-zinc-400 text-xs">
                        <Truck size={13} className="shrink-0" style={{ color: accent }} />
                        <span>Envío con Eljach Mensajería Express — 1 a 2 días en Urabá (Chigorodó, Apartadó, Carepa, Turbo), con pago contraentrega</span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex items-center gap-3 text-zinc-400 text-xs">
                  <MessageSquare size={13} className="shrink-0" style={{ color: accent }} />
                  <span>Agenda tu pedido en línea o por WhatsApp — tú eliges, sin intermediarios</span>
                </div>
                {/* Ya dice "envío a toda Colombia" en la línea de arriba para
                    mobiliario — esta línea sería redundante/confusa ahí. Para
                    Supply tampoco aplica: sin una zona base fija por
                    vendedor, "fuera de Urabá" ya no significa nada. */}
                {!esMobiliario && !isSupply && (
                  <div className="flex items-center gap-3 text-zinc-400 text-xs">
                    <Globe size={13} className="shrink-0" style={{ color: accent }} />
                    <span>¿Fuera de Urabá? También enviamos a toda Colombia — tiempo y costo se coordinan al confirmar (sin contraentrega fuera de la zona)</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-zinc-400 text-xs">
                  <Shield size={13} className="shrink-0" style={{ color: accent }} />
                  <span>Garantía en cada producto — si algo falla, lo resolvemos</span>
                </div>
              </div>
            )}

            {plataformaTrust.length > 0 && (
              <div className="border-t border-zinc-800 pt-4 space-y-2">
                {plataformaTrust.map(({ Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-3 text-zinc-400 text-xs">
                    <Icon size={13} className="shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>

      {/* FOOTER MÍNIMO — mismo patrón que /jhumaneztattoo/agenda y
          /pedido/:module. Faltaba del todo, se notó al revisar todas las
          landing pages standalone del sitio (2026-07-30). El espacio para
          que la barra fija de botones no tape contenido ya lo reserva el
          wrapper exterior (pb-36/pb-20, ver abajo) — este footer NO debe
          sumar su propio padding extra encima, o queda el doble del
          espacio necesario entre el copyright y los botones fijos (bug
          reportado 2026-08-01). */}
      <footer className="border-t border-white/10 py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-500 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} INKognito. Todos los derechos reservados.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/terminos" className="hover:text-white transition-colors">Términos</Link>
            <Link to="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
            <span>Desarrollado por INKognito</span>
          </div>
        </div>
      </footer>

      {/* CTA fijo móvil — pedido online + WhatsApp apiladas, igual que desktop */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/95 backdrop-blur-sm border-t border-white/10 px-4 py-3 flex flex-col gap-2">
        {!isAfiliado && cart && <PedidoOnlineButton className="w-full" />}
        <CTAButton className="w-full" />
      </div>

    </div>
  )
}
