import { useState } from 'react'
import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import Seo from '../../Seo'
import imgBancoMultiangulo from '../../../assets/imagenesgym/bancomultiangulo.jpg'
import imgRemoAcostado     from '../../../assets/imagenesgym/remoacostado.jpg'
import imgHipThrust        from '../../../assets/imagenesgym/hipthrust.jpg'
import imgExtencionFemoral from '../../../assets/imagenesgym/extencionyfemoral.jpg'

const WA = '573207911013'

const GRID_PATTERN = {
  backgroundImage:
    'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px)',
}

const productos = [
  {
    id: 1,
    nombre: 'Banco multiángulo',
    descripcion: 'Ajustable a plano, inclinado y declinado. Versátil para todo el tren superior con mancuernas o barra.',
    precio: null,
    image1: imgBancoMultiangulo, image2: null,
  },
  {
    id: 2,
    nombre: 'Jalones al pecho',
    descripcion: 'Estructura con polea para jalón vertical. Ideal para trabajar dorsales, bíceps y espalda alta.',
    precio: null,
    image1: null, image2: null,
  },
  {
    id: 3,
    nombre: 'Remo acostado',
    descripcion: 'Banco con soporte de pecho para remo horizontal con barra o mancuernas. Aísla espalda alta y media.',
    precio: null,
    image1: imgRemoAcostado, image2: null,
  },
  {
    id: 4,
    nombre: 'Barra hexagonal multifuncional',
    descripcion: 'Herramienta versátil para sentadillas, peso muerto y ejercicios de brazos en un solo equipo de acero.',
    precio: null,
    image1: null, image2: null,
  },
  {
    id: 5,
    nombre: 'Hip thrust',
    descripcion: 'Banco de empuje de cadera con soporte para barra y topes acolchados. Glúteos e isquiotibiales.',
    precio: null,
    image1: imgHipThrust, image2: null,
  },
  {
    id: 6,
    nombre: 'Estructura para dominadas y fondos',
    descripcion: 'Marco de acero multipropósito para dominadas amplias, neutras y fondos en paralelas.',
    precio: null,
    image1: null, image2: null,
  },
  {
    id: 7,
    nombre: 'Extensión y femorales',
    descripcion: 'Aislamiento específico para fortalecer cuádriceps y femorales en un solo equipo.',
    precio: null,
    image1: imgExtencionFemoral, image2: null,
  },
]

const fmtPrecio = (p) => p != null ? `$${Number(p).toLocaleString('es-CO')} COP` : 'Desde $XX.000'

export default function MaquinasPedidoPage() {
  const [cart, setCart]         = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  const addToCart      = (p) => setCart(prev => prev.find(i => i.id === p.id) ? prev : [...prev, p])
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))

  const buildCartMsg = () => {
    const lines = cart.map(i => `• ${i.nombre} — ${fmtPrecio(i.precio)}`)
    const msg = [
      'Hola, quiero cotizar las siguientes máquinas de INKognito Gym:',
      '',
      ...lines,
      '',
      'Nota: los precios son base y pueden tener ajustes según medidas y acabados.',
      'Por favor confirmar disponibilidad y presupuesto final. ¡Gracias!',
    ].join('\n')
    return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Máquinas de Gym Bajo Pedido | Soldadura Profesional — Colombia"
        description="Máquinas de gym hechas a tu medida, con soldadura profesional. Banco multiángulo, jalones, hip thrust y más. Envíos a toda Colombia desde Urabá."
        siteName="INKognito Gym"
        canonical={`${import.meta.env.VITE_SITE_URL}/gym/maquinas-pedido`}
      />

      <NavbarGym cartCount={cart.length} onCartClick={() => setCartOpen(true)} />

      {/* HERO */}
      <section className="relative pt-28 md:pt-36 pb-16 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900" />
        <div className="absolute inset-0 opacity-[0.04]" style={GRID_PATTERN} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <p className="uppercase tracking-[0.25em] text-gray-500 text-xs md:text-sm mb-3">
            Soldadura profesional
          </p>
          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-6">
            Máquinas<br />
            <span className="text-gray-400">bajo pedido</span>
          </h1>
          <p className="text-gray-400 leading-relaxed max-w-2xl mb-6">
            Máquinas de gym hechas a tu medida, con soldadura profesional. Elige la que necesitas y la fabricamos para ti.
          </p>
          <div className="border border-gray-700 bg-gray-800/50 rounded-xl p-5 max-w-2xl">
            <p className="text-gray-400 text-sm leading-relaxed">
              <span className="font-bold text-white">Envíos:</span>{' '}
              Fabricamos en Urabá, Antioquia. Enviamos a toda Colombia por transportadora (Servientrega, Coordinadora). El flete corre por cuenta del cliente.
            </p>
          </div>
        </div>
      </section>

      {/* GRID */}
      <div className="pb-32 px-4 md:px-6 max-w-7xl mx-auto pt-12">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map((p) => {
            const hasImages = p.image1 || p.image2
            const inCart    = cart.some(i => i.id === p.id)
            return (
              <div
                key={p.id}
                className="border border-gray-800 bg-gray-800/40 rounded-2xl overflow-hidden flex flex-col hover:border-gray-600 transition-all duration-300"
              >
                {/* IMAGEN */}
                <div className="relative w-full aspect-video bg-gray-800 flex items-center justify-center">
                  {p.image1
                    ? <img src={p.image1} alt={p.nombre} className="w-full h-full object-cover" />
                    : <span className="text-gray-700 text-xs uppercase tracking-widest text-center px-4">Imagen próximamente</span>
                  }
                  {hasImages && (
                    <button
                      onClick={() => setLightbox(p)}
                      className="absolute bottom-2 right-2 bg-black/60 border border-gray-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg hover:bg-black/90 transition-all"
                    >
                      Ver
                    </button>
                  )}
                </div>

                {/* CONTENIDO */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-700 text-gray-400 rounded-full px-3 py-1">Bajo pedido</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-700 text-gray-400 rounded-full px-3 py-1">Envío nacional</span>
                  </div>
                  <h3 className="font-black uppercase text-base leading-tight">{p.nombre}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{p.descripcion}</p>

                  <div className="border-t border-gray-800 pt-3 flex items-center justify-between">
                    <span className="text-gray-400 text-sm font-black">{fmtPrecio(p.precio)}</span>
                    <button
                      disabled={inCart}
                      onClick={() => addToCart(p)}
                      className={`text-[10px] font-bold uppercase tracking-[0.15em] py-2 px-4 rounded-xl border transition-all duration-300 ${
                        inCart
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

      {/* BACKDROP CARRITO */}
      <div
        className={`fixed inset-0 bg-black/70 z-[60] transition-opacity duration-300 ${cartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setCartOpen(false)}
      />

      {/* DRAWER CARRITO */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-sm bg-gray-950 border-l border-gray-800 z-[70] flex flex-col transition-transform duration-300 ease-out ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <h2 className="font-black uppercase tracking-[0.2em] text-sm">Carrito</h2>
          <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-white text-2xl leading-none bg-transparent border-none cursor-pointer">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {cart.length === 0
            ? <p className="text-gray-600 text-sm text-center mt-12">No has agregado ninguna máquina.</p>
            : cart.map(item => (
                <div key={item.id} className="border border-gray-800 rounded-xl p-4 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-black uppercase text-xs leading-tight mb-1">{item.nombre}</p>
                    <p className="text-gray-400 text-xs">{fmtPrecio(item.precio)}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-600 hover:text-red-400 text-xs uppercase tracking-widest border border-gray-800 rounded-lg px-2 py-1 transition-colors shrink-0"
                  >
                    Quitar
                  </button>
                </div>
              ))
          }
        </div>
        <div className="px-6 py-5 border-t border-gray-800 flex flex-col gap-3">
          {cart.length > 0 && (
            <p className="text-gray-600 text-[10px] leading-relaxed">
              Los precios son base. Pueden variar según medidas y acabados.
            </p>
          )}
          <a
            href={cart.length > 0 ? buildCartMsg() : '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => { if (cart.length === 0) e.preventDefault() }}
            className={`block text-center font-black uppercase tracking-[0.15em] text-xs py-4 rounded-xl transition-all duration-300 ${cart.length > 0 ? 'bg-white text-gray-950 hover:bg-gray-200' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
          >
            Cotizar por WhatsApp
          </a>
        </div>
      </aside>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-[80] flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-6 text-white/60 hover:text-white text-3xl leading-none bg-transparent border-none cursor-pointer z-10"
            onClick={() => setLightbox(null)}
            aria-label="Cerrar"
          >✕</button>
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            {[lightbox.image1, lightbox.image2].filter(Boolean).map((src, i) => (
              <img key={i} src={src} alt={`${lightbox.nombre} — imagen ${i + 1}`} className="rounded-xl object-contain max-h-[75vh] flex-1" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
