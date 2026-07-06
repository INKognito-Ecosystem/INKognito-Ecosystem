import { useState } from 'react'
import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import Seo from '../../Seo'
import { useCatalog } from '../../../hooks/useCatalog'
import { useGymCart } from '../../../contexts/GymCartContext'
import { Wrench, ExternalLink } from 'lucide-react'
import imgBancoMultiangulo from '../../../assets/imagenesgym/bancomultiangulo.jpg'
import imgRemoAcostado     from '../../../assets/imagenesgym/remoacostado.jpg'
import imgHipThrust        from '../../../assets/imagenesgym/hipthrust.jpg'
import imgExtencionFemoral  from '../../../assets/imagenesgym/extencionyfemoral.jpg'
import imgFondosDominadas  from '../../../assets/imagenesgym/fondosydominadas.jpg'

const WA = '573207911013'

const GRID_PATTERN = {
  backgroundImage:
    'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px)',
}

const fmtPrecio = (p) => p != null ? `$${Number(p).toLocaleString('es-CO')} COP` : 'Desde $XX.000'

const LOCAL_IMAGES = {
  'banco multiángulo': imgBancoMultiangulo,
  'banco multiangulo': imgBancoMultiangulo,
  'remo acostado':     imgRemoAcostado,
  'hip thrust':        imgHipThrust,
  'extensión y femorales': imgExtencionFemoral,
  'extension y femorales': imgExtencionFemoral,
  'estructura para dominadas y fondos': imgFondosDominadas,
  'dominadas y fondos': imgFondosDominadas,
}

export default function MaquinasPedidoPage() {
  const [lightbox, setLightbox] = useState(null)
  const { allProducts: gymAllProds, loading: catalogLoading } = useCatalog('gym')
  const apiMaquinas   = gymAllProds.filter(p => p.tipo !== 'afiliado')
  const gymAfiliados  = gymAllProds.filter(p => p.tipo === 'afiliado' && p.categoria !== 'Cursos')
  const { addItem } = useGymCart()

  const productosFinales = catalogLoading ? [] : apiMaquinas.map((item, i) => {
    const key = item.name.toLowerCase()
    return {
      id:          i + 1,
      nombre:      item.name,
      descripcion: item.descripcion || '',
      precio:      item.variantes?.[0]?.price || null,
      image1:      item.image_url || LOCAL_IMAGES[key] || null,
      image2:      null,
    }
  })

  const handleAddToCart = (p) => {
    addItem({
      id:    p.id,
      name:  p.nombre,
      price: fmtPrecio(p.precio),
      brand: 'Bajo pedido',
      image: p.image1 || '',
    }, 'maquinas')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Máquinas de Gym Bajo Pedido | Soldadura Profesional — Colombia"
        description="Máquinas de gym hechas a tu medida, con soldadura profesional. Banco multiángulo, jalones, hip thrust y más. Envíos a toda Colombia desde Urabá."
        siteName="INKognito Gym"
        canonical={`${import.meta.env.VITE_SITE_URL}/gym/maquinas-pedido`}
      />

      <NavbarGym />

      {/* HERO */}
      <section className="relative pt-16 md:pt-24 pb-6 md:pb-10 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900" />
        <div className="absolute inset-0 opacity-[0.04]" style={GRID_PATTERN} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
              Máquinas<br />
              <span className="text-gray-400">bajo pedido</span>
            </h1>
            <Wrench size={80} className="text-gray-800 flex-shrink-0 md:hidden" strokeWidth={1} />
          </div>
          <div className="border border-gray-700 bg-gray-800/50 rounded-xl p-4 max-w-2xl">
            <p className="text-gray-300 text-sm leading-relaxed">
              Cada máquina sale de Chigorodó, hecha a mano con soldadura profesional.
              La tuya puede llegar a cualquier rincón de Colombia.{' '}
              <span className="text-white font-semibold">Cuéntanos dónde estás.</span>
            </p>
          </div>
        </div>
      </section>

      {/* GRID */}
      <div className="pb-10 md:pb-16 px-4 md:px-6 max-w-7xl mx-auto pt-6 md:pt-8">
        {catalogLoading && (
          <div className="flex gap-3 overflow-x-hidden">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[46vw] md:w-64 rounded-2xl bg-gray-800/40 border border-gray-800 animate-pulse">
                <div className="aspect-video bg-gray-700 rounded-t-2xl" />
                <div className="p-3 flex flex-col gap-2">
                  <div className="h-2 bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-700 rounded w-1/2" />
                  <div className="h-6 bg-gray-700 rounded mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!catalogLoading && productosFinales.length === 0 && (
          <div className="border border-gray-800 bg-gray-900/30 rounded-2xl py-16 text-center">
            <p className="text-gray-500 uppercase tracking-[0.25em] text-sm mb-2">Catálogo en preparación</p>
            <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">Estamos cargando las máquinas disponibles. Mientras tanto, cuéntanos qué necesitas por WhatsApp.</p>
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero consultar disponibilidad de máquinas de gym bajo pedido.')}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-950 font-bold uppercase tracking-[0.15em] text-xs rounded hover:bg-gray-200 transition"
            >
              Consultar por WhatsApp →
            </a>
          </div>
        )}
        <div className={`flex md:grid md:grid-cols-3 gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-3 md:pb-0 scrollbar-hide ${catalogLoading || productosFinales.length === 0 ? 'hidden' : ''}`}>
          {productosFinales.map((p) => {
            const hasImages = p.image1 || p.image2
            return (
              <div
                key={p.id}
                className="snap-start flex-shrink-0 w-[46vw] md:w-auto border border-gray-800 bg-gray-800/40 rounded-2xl overflow-hidden flex flex-col hover:border-gray-600 transition-all duration-300"
              >
                {/* IMAGEN */}
                <div className="relative w-full aspect-video bg-gray-800 flex items-center justify-center flex-shrink-0">
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

                {/* INFO */}
                <div className="p-3 flex flex-col flex-1">
                  <div className="flex gap-1.5 mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-gray-700 text-gray-400 rounded-full px-2 py-0.5">Bajo pedido</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-gray-700 text-gray-400 rounded-full px-2 py-0.5">Envío nacional</span>
                  </div>
                  <h3 className="font-black uppercase text-xs leading-tight mb-1">{p.nombre}</h3>
                  <p className="text-white text-xs font-black mt-auto">{fmtPrecio(p.precio)}</p>
                </div>

                {/* BOTÓN — flush al borde inferior */}
                <button
                  onClick={() => handleAddToCart(p)}
                  className="w-full text-[10px] font-bold uppercase tracking-[0.12em] py-2.5 bg-white text-gray-950 hover:bg-gray-200 transition-all duration-300 flex-shrink-0"
                >
                  + Agregar al carrito
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── PIEZAS Y MATERIALES — sección fija, siempre visible ── */}
      <section className="border-t-2 border-yellow-500/20 bg-[#0c0c0c] px-4 md:px-6 py-10 md:py-14">
        <div className="max-w-7xl mx-auto">
          <p className="text-yellow-400/70 text-[10px] font-bold uppercase tracking-widest mb-1">✦ Lo que necesitas para construir, disponible hoy</p>
          <h2 className="text-2xl md:text-3xl font-black uppercase leading-none mb-2 text-white">
            Fabrica sin que te falte nada
          </h2>
          <p className="text-gray-500 text-sm mb-8 max-w-lg leading-relaxed">
            Ruedas, poleas, cables y componentes disponibles en AliExpress y Mercado Libre con envío a toda Colombia. Material verificado para que no improvises ni pagues de más. Un gym propio empieza con las piezas correctas.
          </p>
          {gymAfiliados.length > 0 ? (
            <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
              {gymAfiliados.map((item, i) => {
                const url = item.url_ventas || item.url_checkout || null
                const inner = (
                  <div className="border border-yellow-500/15 bg-gray-950 rounded-2xl overflow-hidden flex flex-col h-full hover:border-yellow-500/40 hover:shadow-[0_0_16px_rgba(234,179,8,0.08)] transition-all duration-300">
                    <div className="aspect-square w-full bg-gray-900 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.image_url
                        ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                        : <ExternalLink size={28} className="text-gray-700" strokeWidth={1} />
                      }
                    </div>
                    <div className="p-3 flex flex-col gap-1.5 flex-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-yellow-400/70">Recurso externo · {item.plataforma || item.categoria}</span>
                      <h3 className="text-xs font-black uppercase leading-tight text-white">{item.name}</h3>
                      {item.descripcion && (
                        <p className="text-gray-500 text-[10px] leading-relaxed flex-1">{item.descripcion}</p>
                      )}
                      {url && (
                        <span className="mt-auto pt-1 text-[9px] font-bold uppercase tracking-widest text-yellow-400 flex items-center gap-1">
                          Ver producto <ExternalLink size={9} />
                        </span>
                      )}
                    </div>
                  </div>
                )
                return url
                  ? <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="snap-start flex-shrink-0 w-[44vw] md:w-auto">{inner}</a>
                  : <div key={i} className="snap-start flex-shrink-0 w-[44vw] md:w-auto">{inner}</div>
              })}
            </div>
          ) : (
            <div className="border border-yellow-500/15 bg-gray-950 rounded-2xl p-6 text-center">
              <p className="text-gray-500 text-sm mb-4 max-w-sm mx-auto">
                Aún no tenemos materiales cargados. Avísanos y te contactamos apenas tengamos opciones disponibles.
              </p>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero que me avisen cuando haya materiales disponibles en INKognito Gym.')}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-500 text-gray-950 font-bold uppercase tracking-[0.15em] text-xs rounded hover:bg-yellow-400 transition"
              >
                Avisarme cuando haya stock →
              </a>
            </div>
          )}
        </div>
      </section>

      <FooterGym />

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
