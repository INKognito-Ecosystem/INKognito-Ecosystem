import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { Package, ExternalLink, Truck, Shield, ShoppingBag, Zap, CheckCircle2 } from 'lucide-react'
import Seo from '../Seo'
import EcosystemNavbar from '../ecosystem/EcosystemNavbar'

const PANEL_URL  = import.meta.env.VITE_PANEL_URL
const WA_NUMBER  = import.meta.env.VITE_WHATSAPP_NUMBER || '573207911013'

const PLATAFORMA_LABEL = {
  amazon:       'Amazon',
  aliexpress:   'AliExpress',
  mercadolibre: 'Mercado Libre',
  hotmart:      'Hotmart',
}

const PASOS = [
  { n: '01', title: 'Escríbenos',   text: 'Toca el botón y cuéntanos qué quieres pedir.' },
  { n: '02', title: 'Confirmamos',  text: 'Te confirmamos disponibilidad y datos de entrega.' },
  { n: '03', title: 'Lo recibís',   text: 'Despacho en 24h. Contraentrega disponible en Urabá.' },
]

export default function ProductLandingPage() {
  const { id } = useParams()
  const [product, setProduct]  = useState(null)
  const [loading, setLoading]  = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeVariant, setActive] = useState(0)

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

  if (loading)  return <div className="min-h-screen bg-black" />
  if (notFound) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 text-sm uppercase tracking-widest">
      Producto no encontrado
    </div>
  )

  const variant       = product.variantes[activeVariant] || product.variantes[0]
  const isAfiliado    = product.tipo === 'afiliado'
  const imageUrl      = variant?.image_url || product.variantes[0]?.image_url
  const stockBajo     = !isAfiliado && variant?.stock > 0 && variant?.stock <= 5
  const sinStock      = !isAfiliado && variant?.stock === 0
  const plataformaLabel = PLATAFORMA_LABEL[product.plataforma?.toLowerCase()] || product.plataforma || 'Tienda'

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
      Ver en {plataformaLabel}
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

      <EcosystemNavbar />

      {/* HERO — 2 columnas desktop, apilado móvil */}
      <div className="pt-20 max-w-5xl mx-auto px-4 py-8 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">

          {/* IMAGEN — altura fija en móvil para no empujar el contenido */}
          <div className="w-full h-64 md:h-auto md:aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
            {imageUrl
              ? <img key={imageUrl} src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-zinc-700"><Package size={64} /></div>
            }
          </div>

          {/* DETALLE */}
          <div className="space-y-5">

            {/* CATEGORÍA + NOMBRE + PRECIO */}
            <div>
              <p className="text-zinc-500 text-[11px] uppercase tracking-widest mb-1">{product.categoria}</p>
              <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight">
                {product.name}
              </h1>
              {variant?.price != null && (
                <p className="text-3xl font-black mt-3 text-white">
                  ${variant.price.toLocaleString('es-CO')}
                </p>
              )}
            </div>

            {/* ALERTA STOCK */}
            {stockBajo && (
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wide">
                <Zap size={14} />
                ¡Solo {variant.stock} disponibles!
              </div>
            )}

            {/* VARIANTES */}
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
                          ? 'border-white bg-white text-black'
                          : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
                      }`}
                    >
                      {v.variant || 'Único'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA — visible en desktop, oculto en móvil (está en la barra fija) */}
            <div className="hidden md:block">
              <CTAButton className="w-full" />
            </div>

            {/* DESCRIPCIÓN */}
            {product.descripcion && (
              <p className="text-zinc-400 text-sm leading-relaxed">{product.descripcion}</p>
            )}

            {/* TRUST SIGNALS */}
            {!isAfiliado && (
              <div className="border-t border-zinc-800 pt-4 space-y-2">
                <div className="flex items-center gap-3 text-zinc-400 text-xs">
                  <Truck size={13} className="shrink-0 text-zinc-500" />
                  <span>Envío a todo Colombia — Urabá en 1-2 días hábiles</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400 text-xs">
                  <ShoppingBag size={13} className="shrink-0 text-zinc-500" />
                  <span>Contraentrega disponible en Urabá</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400 text-xs">
                  <Shield size={13} className="shrink-0 text-zinc-500" />
                  <span>Garantía de calidad en cada producto</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* CÓMO FUNCIONA — solo productos propios/dropi */}
      {!isAfiliado && (
        <section className="border-t border-white/5 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-zinc-500 text-[11px] uppercase tracking-widest text-center mb-8">Cómo funciona</p>
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              {PASOS.map(p => (
                <div key={p.n} className="text-center">
                  <span className="text-4xl md:text-5xl font-black text-zinc-800 italic">{p.n}</span>
                  <p className="text-white font-bold uppercase tracking-wide text-xs md:text-sm mt-2 mb-1">{p.title}</p>
                  <p className="text-zinc-500 text-xs leading-relaxed hidden md:block">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LINK AL ECOSISTEMA */}
      <div className="text-center py-8 border-t border-white/5">
        <Link to="/" className="text-zinc-600 text-xs uppercase tracking-widest hover:text-zinc-400 transition-colors">
          Ver más productos → inkognito-ecosystem.com
        </Link>
      </div>

      {/* BARRA CTA FIJA EN MÓVIL */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/95 backdrop-blur-sm border-t border-white/10 px-4 py-3">
        <CTAButton className="w-full" />
      </div>

    </div>
  )
}
