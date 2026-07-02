import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { Package, ExternalLink, Truck, Shield, ShoppingBag } from 'lucide-react'
import Seo from '../Seo'
import EcosystemNavbar from '../ecosystem/EcosystemNavbar'

const PANEL_URL = import.meta.env.VITE_PANEL_URL
const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '573207911013'

const PLATAFORMA_LABEL = {
  amazon:      'Amazon',
  aliexpress:  'AliExpress',
  mercadolibre:'Mercado Libre',
  hotmart:     'Hotmart',
}

export default function ProductLandingPage() {
  const { id } = useParams()
  const [product, setProduct]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [notFound, setNotFound]     = useState(false)
  const [activeVariant, setActive]  = useState(0)

  useEffect(() => {
    fetch(`${PANEL_URL}/api/product/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setNotFound(true); setLoading(false); return; }
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

  const variant    = product.variantes[activeVariant] || product.variantes[0]
  const isAfiliado = product.tipo === 'afiliado'
  const imageUrl   = variant?.image_url || product.variantes[0]?.image_url

  const waMessage = encodeURIComponent(
    `Hola, quiero pedir:\n• ${product.name}${variant?.variant ? ` — ${variant.variant}` : ''}\nPrecio: $${variant?.price?.toLocaleString('es-CO') ?? '?'}`
  )

  const plataformaLabel = PLATAFORMA_LABEL[product.plataforma?.toLowerCase()] || product.plataforma || 'Tienda'

  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title={`${product.name} | INKognito`}
        description={product.descripcion || `${product.name} — disponible con envío a toda Colombia`}
        image={imageUrl}
      />

      <EcosystemNavbar />

      <div className="pt-24 max-w-5xl mx-auto px-4 py-10 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-start">

          {/* IMAGEN */}
          <div className="aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
            {imageUrl
              ? <img key={imageUrl} src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-zinc-700"><Package size={64} /></div>
            }
          </div>

          {/* DETALLE */}
          <div className="space-y-6">

            <div>
              <p className="text-zinc-500 text-[11px] uppercase tracking-widest mb-2">{product.categoria}</p>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight">
                {product.name}
              </h1>
              {variant?.price != null && (
                <p className="text-3xl font-black mt-4">
                  ${variant.price.toLocaleString('es-CO')}
                </p>
              )}
            </div>

            {/* SELECTOR DE VARIANTES */}
            {product.variantes.length > 1 && (
              <div>
                <p className="text-zinc-500 text-[11px] uppercase tracking-widest mb-3">Variante</p>
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

            {/* CTA */}
            {isAfiliado ? (
              <a
                href={product.url_checkout || product.url_ventas}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded hover:bg-zinc-200 transition-all text-sm"
              >
                <ExternalLink size={18} />
                Ver en {plataformaLabel}
              </a>
            ) : (
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-green-600 text-white font-black uppercase tracking-widest rounded hover:bg-green-500 transition-all text-sm"
              >
                <FaWhatsapp size={20} />
                Pedir por WhatsApp
              </a>
            )}

            {/* DESCRIPCIÓN */}
            {product.descripcion && (
              <p className="text-zinc-400 text-sm leading-relaxed">{product.descripcion}</p>
            )}

            {/* TRUST SIGNALS */}
            {!isAfiliado && (
              <div className="border-t border-zinc-800 pt-5 space-y-3">
                <div className="flex items-center gap-3 text-zinc-400 text-xs">
                  <Truck size={14} className="shrink-0" />
                  <span>Envío a todo Colombia — Urabá en 1-2 días</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400 text-xs">
                  <ShoppingBag size={14} className="shrink-0" />
                  <span>Contraentrega disponible en Urabá</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400 text-xs">
                  <Shield size={14} className="shrink-0" />
                  <span>Garantía de calidad en cada producto</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
