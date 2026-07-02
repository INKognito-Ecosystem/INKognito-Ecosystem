import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { Package, ExternalLink, Truck, Shield, ShoppingBag, Zap } from 'lucide-react'
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

export default function ProductLandingPage() {
  const { id } = useParams()
  const [product, setProduct]      = useState(null)
  const [loading, setLoading]      = useState(true)
  const [notFound, setNotFound]    = useState(false)
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

  const variant         = product.variantes[activeVariant] || product.variantes[0]
  const isAfiliado      = product.tipo === 'afiliado'
  const isSupply        = product.module === 'supply'
  const imageUrl        = variant?.image_url || product.variantes[0]?.image_url
  const stockBajo       = !isAfiliado && variant?.stock > 0 && variant?.stock <= 5
  const sinStock        = !isAfiliado && variant?.stock === 0
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

      <div className="pt-20 max-w-5xl mx-auto px-4 py-8 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">

          {/* COLUMNA IZQUIERDA — imagen + descripción */}
          <div className="space-y-5">
            {/* Imagen sin contenedor fijo — se adapta al tamaño natural de la foto */}
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
              <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight">
                {product.name}
              </h1>
              {variant?.price != null && (
                <p className="text-3xl font-black mt-3">
                  ${variant.price.toLocaleString('es-CO')}
                </p>
              )}
            </div>

            {/* Tagline — solo supply */}
            {isSupply && (
              <p className="text-zinc-500 text-xs italic tracking-wide border-l-2 border-zinc-700 pl-3">
                De un tatuador, para tatuadores.
              </p>
            )}

            {/* Stock bajo */}
            {stockBajo && (
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wide">
                <Zap size={13} />
                ¡Solo {variant.stock} disponibles!
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

            {/* CTA desktop */}
            <div className="hidden md:block">
              <CTAButton className="w-full" />
            </div>

            {/* Trust signals */}
            {!isAfiliado && (
              <div className="border-t border-zinc-800 pt-4 space-y-2">
                <div className="flex items-center gap-3 text-zinc-400 text-xs">
                  <Truck size={13} className="shrink-0 text-zinc-600" />
                  <span>Envío a todo Colombia — Urabá en 1-2 días hábiles</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400 text-xs">
                  <ShoppingBag size={13} className="shrink-0 text-zinc-600" />
                  <span>Contraentrega disponible en Urabá</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400 text-xs">
                  <Shield size={13} className="shrink-0 text-zinc-600" />
                  <span>Garantía de calidad en cada producto</span>
                </div>
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
