import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { Package, ExternalLink, Truck, Shield, MessageSquare, Zap, Globe } from 'lucide-react'
import Seo from '../Seo'
import EcosystemNavbar from '../ecosystem/EcosystemNavbar'

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
  suplementos: '#A1A1AA',
  gym:         '#A1A1AA',
  dropi:       '#EC6F2D',
}

export default function ProductLandingPage() {
  const { id } = useParams()
  const [product, setProduct]      = useState(null)
  const [loading, setLoading]      = useState(true)
  const [notFound, setNotFound]    = useState(false)
  const [activeVariant, setActive] = useState(0)
  const [scrolled, setScrolled]    = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch(`${PANEL_URL}/api/product/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setNotFound(true); setLoading(false); return }
        setProduct(data)
        setLoading(false)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [id])

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

  if (loading)  return <div className="min-h-screen bg-black" />
  if (notFound) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 text-sm uppercase tracking-widest">
      Producto no encontrado
    </div>
  )

  const variant         = product.variantes[activeVariant] || product.variantes[0]
  const isAfiliado      = product.tipo === 'afiliado'
  const isSupply        = product.module === 'supply'
  const accent          = MODULE_ACCENT[product.module] || '#A1A1AA'
  const imageUrl        = variant?.image_url || product.variantes[0]?.image_url
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
    <div className="min-h-screen bg-black text-white pb-20 md:pb-0">
      <Seo
        title={`${product.name} | INKognito`}
        description={product.descripcion || `${product.name} — disponible con envío a toda Colombia`}
        image={imageUrl}
      />

      <EcosystemNavbar tattooLabel="Jhumaneztattoo" logoFilter="brightness(0) invert(1)" showTagline />

      <div className="pt-20 max-w-5xl mx-auto px-4 py-8 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">

          {/* COLUMNA IZQUIERDA — imagen + descripción */}
          <div className="space-y-5">
            {imageUrl
              ? <img key={imageUrl} src={imageUrl} alt={product.name} className="w-full h-auto rounded-xl border border-zinc-800" />
              : <div className="aspect-square rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700"><Package size={64} /></div>
            }

            {/* Descripción — debajo de la imagen en desktop, se oculta en móvil (va al final) */}
            {product.descripcion && (
              <p className="hidden md:block text-zinc-400 text-sm leading-relaxed">{product.descripcion}</p>
            )}
          </div>

          {/* COLUMNA DERECHA — decisión de compra */}
          <div className="space-y-5">

            <div>
              <p className="text-zinc-500 text-[11px] uppercase tracking-widest mb-1">{product.categoria}</p>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight">
                  {product.name}
                </h1>
                {/* Flecha de scroll — desaparece al bajar */}
                <span
                  className={`md:hidden mt-1 text-zinc-600 text-lg transition-opacity duration-500 animate-bounce shrink-0 ${scrolled ? 'opacity-0' : 'opacity-100'}`}
                >
                  ↓
                </span>
              </div>
              {variant?.price != null && (
                <p className="text-3xl font-black mt-3">
                  ${variant.price.toLocaleString('es-CO')}
                </p>
              )}
            </div>

            {/* Tagline — solo supply */}
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

            {/* Stock */}
            {stockNum !== null && (
              <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${
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

            {/* Variantes */}
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

            {/* CTA desktop */}
            <div className="hidden md:block">
              <CTAButton className="w-full" />
            </div>

            {/* Trust signals — solo modulos con proveedor externo (no Gym: maquinas propias) */}
            {!isAfiliado && ['supply', 'suplementos', 'store'].includes(product.module) && (
              <div className="border-t border-zinc-800 pt-4 space-y-2">
                <div className="flex items-center gap-3 text-zinc-400 text-xs">
                  <Truck size={13} className="shrink-0" style={{ color: accent }} />
                  <span>Envío con Eljach Transportadora — 1 a 2 días en Urabá (Chigorodó, Apartadó, Carepa, Turbo), con pago contraentrega</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400 text-xs">
                  <MessageSquare size={13} className="shrink-0" style={{ color: accent }} />
                  <span>Confirmación por WhatsApp en minutos — pedido directo, sin intermediarios</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400 text-xs">
                  <Globe size={13} className="shrink-0" style={{ color: accent }} />
                  <span>¿Fuera de Urabá? También enviamos a toda Colombia — tiempo y costo se coordinan al confirmar (sin contraentrega fuera de la zona)</span>
                </div>
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

        {/* Descripción en móvil — debajo de todo */}
        {product.descripcion && (
          <p className="md:hidden text-zinc-400 text-sm leading-relaxed mt-8 pt-6 border-t border-zinc-800">
            {product.descripcion}
          </p>
        )}

      </div>

      {/* CTA fijo móvil */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/95 backdrop-blur-sm border-t border-white/10 px-4 py-3">
        <CTAButton className="w-full" />
      </div>

    </div>
  )
}
