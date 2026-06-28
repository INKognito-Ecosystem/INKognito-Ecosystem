import { useState, useMemo } from 'react'
import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import Seo from '../../Seo'
import { useCatalog } from '../../../hooks/useCatalog'

const WA = '573207911013'
const PAGE_SIZE = 6

const GRID_PATTERN = {
  backgroundImage:
    'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px)',
}

const productos = [
  // Proteína
  { id: 1,  categoria: 'Proteína',    nombre: 'Whey Protein 2 lb',              precioLabel: '$XXX.000', image: null },
  { id: 2,  categoria: 'Proteína',    nombre: 'Whey Protein 5 lb',              precioLabel: '$XXX.000', image: null },
  { id: 3,  categoria: 'Proteína',    nombre: 'Proteína vegana 2 lb',           precioLabel: '$XXX.000', image: null },
  // Creatina
  { id: 4,  categoria: 'Creatina',    nombre: 'Creatina monohidrato 300 g',     precioLabel: '$XXX.000', image: null },
  { id: 5,  categoria: 'Creatina',    nombre: 'Creatina monohidrato 500 g',     precioLabel: '$XXX.000', image: null },
  { id: 6,  categoria: 'Creatina',    nombre: 'Creatina micronizada 300 g',     precioLabel: '$XXX.000', image: null },
  // Pre-entreno
  { id: 7,  categoria: 'Pre-entreno', nombre: 'Pre-entreno con estimulante',    precioLabel: '$XXX.000', image: null },
  { id: 8,  categoria: 'Pre-entreno', nombre: 'Pre-entreno sin estimulante',    precioLabel: '$XXX.000', image: null },
  { id: 9,  categoria: 'Pre-entreno', nombre: 'Pre-entreno + creatina',         precioLabel: '$XXX.000', image: null },
  // Vitaminas
  { id: 10, categoria: 'Vitaminas',   nombre: 'Multivitamínico completo',       precioLabel: '$XXX.000', image: null },
  { id: 11, categoria: 'Vitaminas',   nombre: 'Vitamina C 1000 mg',             precioLabel: '$XXX.000', image: null },
  { id: 12, categoria: 'Vitaminas',   nombre: 'Omega 3 — 60 cápsulas',          precioLabel: '$XXX.000', image: null },
]

const CATEGORIAS = ['Todos', 'Proteína', 'Creatina', 'Pre-entreno', 'Vitaminas']

export default function SuplementosPage() {
  const [cart, setCart]         = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [filtro, setFiltro]     = useState('Todos')
  const [visible, setVisible]   = useState(PAGE_SIZE)
  const { categorias: apiCats, allProducts: apiProds } = useCatalog('suplementos')

  // Usar productos del API si hay, sino fallback hardcodeado
  const productosActivos = useMemo(() => {
    if (apiProds.length > 0) {
      return apiProds.map((item, i) => ({
        id:         i + 1,
        categoria:  item.categoria || 'Otro',
        nombre:     item.name,
        precioLabel: item.variantes?.[0]?.price
          ? '$' + Math.round(item.variantes[0].price).toLocaleString('es-CO')
          : '$XXX.000',
        image: item.image_url || null,
      }))
    }
    return productos
  }, [apiProds])

  const CATEGORIAS_DIN = ['Todos', ...new Set(productosActivos.map(p => p.categoria))]

  const addToCart      = (p) => setCart(prev => prev.find(i => i.id === p.id) ? prev : [...prev, p])
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))

  const filtrados = filtro === 'Todos' ? productosActivos : productosActivos.filter(p => p.categoria === filtro)
  const visibles  = filtrados.slice(0, visible)

  const buildCartMsg = () => {
    const lines = cart.map(i => `• ${i.nombre} — ${i.precioLabel}`)
    const msg = [
      'Hola, quiero adquirir los siguientes suplementos de INKognito Gym:',
      '',
      ...lines,
      '',
      'Por favor confirmar disponibilidad, precio final y método de pago. ¡Gracias!',
    ].join('\n')
    return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Suplementos Deportivos | INKognito Gym — Urabá y Colombia"
        description="Proteína, creatina, pre-entreno y vitaminas para potenciar tu entrenamiento. Suplementos deportivos en Urabá, Chigorodó, Antioquia. Envíos a toda Colombia."
        siteName="INKognito Gym"
        canonical={`${import.meta.env.VITE_SITE_URL}/gym/suplementos`}
      />

      <NavbarGym cartCount={cart.length} onCartClick={() => setCartOpen(true)} />

      {/* HERO */}
      <section className="relative pt-28 md:pt-36 pb-16 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900" />
        <div className="absolute inset-0 opacity-[0.04]" style={GRID_PATTERN} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <p className="uppercase tracking-[0.25em] text-gray-500 text-xs md:text-sm mb-3">
            Nutrición deportiva
          </p>
          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-6">
            Suple<br />
            <span className="text-gray-400">mentos</span>
          </h1>
          <p className="text-gray-400 leading-relaxed max-w-2xl">
            Proteína, creatina, pre-entreno y vitaminas para potenciar tu entrenamiento. Selección de productos de calidad con envíos a toda Colombia desde Urabá, Antioquia.
          </p>
        </div>
      </section>

      <div className="pb-32 px-4 md:px-6 max-w-7xl mx-auto pt-10">

        {/* FILTROS POR CATEGORÍA */}
        <div className="flex gap-2 flex-wrap mb-10">
          {CATEGORIAS_DIN.map(cat => (
            <button
              key={cat}
              onClick={() => { setFiltro(cat); setVisible(PAGE_SIZE) }}
              className={`text-xs font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full border transition-all duration-200 ${
                filtro === cat
                  ? 'bg-white text-gray-950 border-white'
                  : 'border-gray-700 text-gray-400 hover:border-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {visibles.map((p) => {
            const inCart = cart.some(i => i.id === p.id)
            return (
              <div
                key={p.id}
                className="border border-gray-800 bg-gray-800/40 rounded-xl overflow-hidden flex flex-col hover:border-gray-600 transition-all duration-300"
              >
                {/* IMAGEN */}
                <div className="relative w-full aspect-square bg-gray-800 flex items-center justify-center">
                  {p.image
                    ? <img
                        src={p.image}
                        alt={p.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    : <span className="text-gray-700 text-[10px] uppercase tracking-widest text-center px-2">Imagen próx.</span>
                  }
                </div>

                {/* CONTENIDO */}
                <div className="p-3 flex flex-col gap-2 flex-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-gray-700 text-gray-400 rounded-full px-2 py-0.5 self-start">
                    {p.categoria}
                  </span>
                  <h3 className="font-black uppercase text-xs leading-tight">{p.nombre}</h3>
                  <div className="flex flex-col gap-1.5 mt-auto pt-2 border-t border-gray-800">
                    <span className="text-white font-black text-sm">{p.precioLabel}</span>
                    <button
                      disabled={inCart}
                      onClick={() => addToCart(p)}
                      className={`w-full text-center text-[9px] font-bold uppercase tracking-widest py-1.5 rounded-lg border transition-all duration-300 ${
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

        {/* CARGAR MÁS */}
        {visible < filtrados.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisible(v => Math.min(v + PAGE_SIZE, filtrados.length))}
              className="border border-gray-700 text-gray-400 text-xs font-bold uppercase tracking-[0.2em] py-3 px-8 rounded-xl hover:border-gray-400 hover:text-white transition-all duration-300"
            >
              Cargar más ({filtrados.length - visible} restantes)
            </button>
          </div>
        )}
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
            ? <p className="text-gray-600 text-sm text-center mt-12">No has agregado ningún suplemento.</p>
            : cart.map(item => (
                <div key={item.id} className="border border-gray-800 rounded-xl p-4 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-black uppercase text-xs leading-tight mb-1">{item.nombre}</p>
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest">{item.categoria}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{item.precioLabel}</p>
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
          <a
            href={cart.length > 0 ? buildCartMsg() : '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => { if (cart.length === 0) e.preventDefault() }}
            className={`block text-center font-black uppercase tracking-[0.15em] text-xs py-4 rounded-xl transition-all duration-300 ${cart.length > 0 ? 'bg-white text-gray-950 hover:bg-gray-200' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
          >
            Finalizar por WhatsApp
          </a>
        </div>
      </aside>
    </div>
  )
}
