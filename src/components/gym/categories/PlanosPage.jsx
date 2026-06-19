import { useState } from 'react'
import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import Seo from '../../Seo'

const WA = '573207911013'
const MEMBRESIA_PRECIO = '$XX.000 COP'

const planos = [
  {
    id: 1,
    nombre: 'Banco Militar / Funcional',
    descripcion: 'Plano técnico completo en PDF con medidas exactas y lista de materiales necesarios para construir tu propio banco multifuncional.',
    precio: 5000,
    image1: null,
    image2: null,
  },
  { id: 2, nombre: 'Plano próximamente', descripcion: 'Este plano estará disponible pronto.', precio: null, image1: null, image2: null },
  { id: 3, nombre: 'Plano próximamente', descripcion: 'Este plano estará disponible pronto.', precio: null, image1: null, image2: null },
  { id: 4, nombre: 'Plano próximamente', descripcion: 'Este plano estará disponible pronto.', precio: null, image1: null, image2: null },
  { id: 5, nombre: 'Plano próximamente', descripcion: 'Este plano estará disponible pronto.', precio: null, image1: null, image2: null },
  { id: 6, nombre: 'Plano próximamente', descripcion: 'Este plano estará disponible pronto.', precio: null, image1: null, image2: null },
]

const fmt = (p) => p != null ? `$${Number(p).toLocaleString('es-CO')} COP` : 'Próximamente'

const GRID_PATTERN = {
  backgroundImage:
    'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px)',
}

export default function PlanosPage() {
  const [cart, setCart]               = useState([])
  const [cartOpen, setCartOpen]       = useState(false)
  const [lightbox, setLightbox]       = useState(null) // plano object | null

  const addToCart = (plano) => {
    setCart(prev => prev.find(i => i.id === plano.id) ? prev : [...prev, plano])
  }
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))

  const cartTotal = cart.reduce((sum, i) => sum + (i.precio ?? 0), 0)

  const buildCartMsg = () => {
    const lines = cart.map(i => `• ${i.nombre} — ${fmt(i.precio)}`)
    const msg = [
      'Hola, quiero adquirir los siguientes planos de INKognito Gym:',
      '',
      ...lines,
      '',
      cartTotal > 0 ? `Total: ${fmt(cartTotal)}` : '',
      '',
      'Por favor confirmar disponibilidad y método de pago. ¡Gracias!',
    ].filter(l => l !== undefined).join('\n')
    return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`
  }

  const membresiaMsg = `https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero el acceso completo a todos los planos de Gym')}`

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Planos Técnicos de Máquinas de Gym | Descarga Digital — Colombia"
        description="Planos profesionales en PDF para fabricar tus propias máquinas de gym. Diseños probados y funcionales. Descarga inmediata. Disponibles para toda Colombia."
        siteName="INKognito Gym"
        canonical={`${import.meta.env.VITE_SITE_URL}/gym/planos`}
      />

      <NavbarGym />

      {/* HERO */}
      <section className="relative pt-28 md:pt-36 pb-16 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900" />
        <div className="absolute inset-0 opacity-[0.04]" style={GRID_PATTERN} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <p className="uppercase tracking-[0.25em] text-gray-500 text-xs md:text-sm mb-3">
            Descarga digital
          </p>
          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-6">
            Planos<br />
            <span className="text-gray-400">digitales</span>
          </h1>
          <p className="text-gray-400 leading-relaxed max-w-2xl">
            Planos en PDF con medidas exactas, cortes y lista de materiales para que puedas fabricar tus propias máquinas de gym en casa. Descarga inmediata tras la compra.
          </p>
        </div>
      </section>

      <div className="pb-32 px-4 md:px-6 max-w-7xl mx-auto pt-12">

        {/* DESCRIPCIÓN GENERAL */}
        <p className="text-gray-400 leading-relaxed max-w-2xl mb-12 text-sm md:text-base">
          En esta sección encontrarás planos técnicos en formato PDF listos para descargar. Cada plano incluye medidas exactas, lista de materiales y pasos clave para que puedas construir tu propio equipo de gym en casa, sin importar tu nivel de experiencia en soldadura o carpintería.
        </p>

        {/* CARD MEMBRESÍA */}
        <div className="relative border border-gray-400/40 bg-gray-900 rounded-2xl p-8 md:p-10 mb-12 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.025]" style={GRID_PATTERN} />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] bg-white text-gray-950 rounded-full px-3 py-1 mb-4">
                Acceso total
              </span>
              <h2 className="text-2xl md:text-4xl font-black uppercase leading-tight mb-3">
                Membresía de por vida
              </h2>
              <p className="text-gray-400 leading-relaxed max-w-lg text-sm md:text-base">
                Paga una sola vez y obtén acceso a todos los planos disponibles, incluyendo los que se agreguen en el futuro.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
              <span className="text-3xl md:text-4xl font-black text-white">{MEMBRESIA_PRECIO}</span>
              <a
                href={membresiaMsg}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-gray-950 font-black uppercase tracking-[0.15em] text-xs py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                Obtener acceso completo
              </a>
            </div>
          </div>
        </div>

        {/* GRID DE PLANOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {planos.map((plano) => {
            const isReal    = plano.nombre !== 'Plano próximamente'
            const hasImages = plano.image1 || plano.image2
            const inCart    = cart.some(i => i.id === plano.id)
            return (
              <div
                key={plano.id}
                className={`border rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${isReal ? 'border-gray-600 bg-gray-800/60 hover:border-gray-400' : 'border-gray-800 bg-gray-800/20'}`}
              >
                {/* IMAGEN / PLACEHOLDER */}
                <div className="relative w-full aspect-video bg-gray-800 flex items-center justify-center">
                  {plano.image1 ? (
                    <img src={plano.image1} alt={plano.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-700 text-xs uppercase tracking-widest">
                      {isReal ? 'Imagen próximamente' : 'Próximamente'}
                    </span>
                  )}
                  {hasImages && (
                    <button
                      onClick={() => setLightbox(plano)}
                      className="absolute bottom-2 right-2 bg-black/60 border border-gray-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg hover:bg-black/90 transition-all"
                    >
                      Ver
                    </button>
                  )}
                </div>

                {/* CONTENIDO */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <h3 className={`font-black uppercase text-sm leading-tight ${isReal ? 'text-white' : 'text-gray-600'}`}>
                    {plano.nombre}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed flex-1">{plano.descripcion}</p>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-800">
                    <span className={`font-black text-base ${plano.precio ? 'text-white' : 'text-gray-600'}`}>
                      {fmt(plano.precio)}
                    </span>
                    <button
                      disabled={!isReal || inCart}
                      onClick={() => addToCart(plano)}
                      className={`text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-lg border transition-all duration-300 ${
                        !isReal
                          ? 'border-gray-800 text-gray-700 cursor-not-allowed'
                          : inCart
                          ? 'border-gray-500 text-gray-400 cursor-default'
                          : 'border-gray-600 text-gray-300 hover:border-white hover:text-white cursor-pointer'
                      }`}
                    >
                      {inCart ? 'En carrito ✓' : 'Agregar al carrito'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <FooterGym />

      {/* BOTÓN CARRITO FLOTANTE */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-white text-gray-950 rounded-full w-14 h-14 flex items-center justify-center shadow-2xl hover:bg-gray-200 transition-all duration-300"
        aria-label="Abrir carrito"
      >
        <span className="text-xl">🛒</span>
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">
            {cart.length}
          </span>
        )}
      </button>

      {/* DRAWER CARRITO */}
      <div
        className={`fixed inset-0 bg-black/70 z-[60] transition-opacity duration-300 ${cartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setCartOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-gray-950 border-l border-gray-800 z-[70] flex flex-col transition-transform duration-300 ease-out ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <h2 className="font-black uppercase tracking-[0.2em] text-sm">Carrito de planos</h2>
          <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-white text-2xl leading-none bg-transparent border-none cursor-pointer">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {cart.length === 0 ? (
            <p className="text-gray-600 text-sm text-center mt-12">No has agregado ningún plano.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="border border-gray-800 rounded-xl p-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-black uppercase text-xs leading-tight mb-1">{item.nombre}</p>
                  <p className="text-gray-400 text-xs">{fmt(item.precio)}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-600 hover:text-red-400 text-xs uppercase tracking-widest border border-gray-800 rounded-lg px-2 py-1 transition-colors shrink-0"
                >
                  Quitar
                </button>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-5 border-t border-gray-800 flex flex-col gap-3">
          {cartTotal > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm uppercase tracking-widest">Total</span>
              <span className="font-black text-lg">{fmt(cartTotal)}</span>
            </div>
          )}
          <a
            href={cart.length > 0 ? buildCartMsg() : '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => { if (cart.length === 0) e.preventDefault() }}
            className={`block text-center font-black uppercase tracking-[0.15em] text-xs py-4 rounded-xl transition-all duration-300 ${
              cart.length > 0
                ? 'bg-white text-gray-950 hover:bg-gray-200'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            Finalizar por WhatsApp
          </a>
        </div>
      </aside>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-[80] flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-6 text-white/60 hover:text-white text-3xl leading-none bg-transparent border-none cursor-pointer z-10"
            onClick={() => setLightbox(null)}
            aria-label="Cerrar"
          >
            ✕
          </button>
          <div
            className="flex flex-col md:flex-row gap-4 max-w-4xl w-full"
            onClick={e => e.stopPropagation()}
          >
            {[lightbox.image1, lightbox.image2].filter(Boolean).map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${lightbox.nombre} — imagen ${i + 1}`}
                className="rounded-xl object-contain max-h-[75vh] flex-1"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
