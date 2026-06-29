import { useState } from 'react'
import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import Seo from '../../Seo'
import { useCatalog } from '../../../hooks/useCatalog'
import { useGymCart } from '../../../contexts/GymCartContext'
import { FlaskConical } from 'lucide-react'

const VAR_THRESHOLD = 3

function VariantSelectorSupl({ variantes, selIdx, onChange }) {
  const [open, setOpen] = useState(false)
  if (!variantes || variantes.length <= 1) return null

  if (variantes.length <= VAR_THRESHOLD) {
    return (
      <div className="grid gap-1 w-full" style={{ gridTemplateColumns: `repeat(${variantes.length}, 1fr)` }}>
        {variantes.map((v, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`text-[9px] font-bold py-1 rounded border transition-all duration-200 text-center truncate ${
              selIdx === i
                ? 'bg-white text-gray-950 border-white'
                : 'border-gray-700 text-gray-500 hover:border-gray-400 hover:text-white'
            }`}
          >
            {v.variant || `Opc. ${i + 1}`}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-1.5 px-2 rounded border border-gray-700 text-[9px] font-bold text-gray-300 hover:border-gray-400 transition-all duration-200"
      >
        <span className="truncate">{variantes[selIdx]?.variant || 'Elegir variante'}</span>
        <span className={`ml-1 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>▶</span>
      </button>
      {open && (
        <div className="mt-1 grid grid-cols-2 gap-1">
          {variantes.map((v, i) => (
            <button
              key={i}
              onClick={() => { onChange(i); setOpen(false) }}
              className={`text-[9px] font-bold py-1.5 px-1 rounded border transition-all duration-200 text-center truncate ${
                selIdx === i
                  ? 'bg-white text-gray-950 border-white'
                  : 'border-gray-700 text-gray-500 hover:border-gray-400 hover:text-white'
              }`}
            >
              {v.variant || `Opc. ${i + 1}`}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SuplCard({ p, onAddToCart }) {
  const [selIdx, setSelIdx] = useState(0)
  const variantes = p.variantes || []
  const sel       = variantes[selIdx] || {}

  const precio = sel.price
    ? '$' + Math.round(sel.price).toLocaleString('es-CO')
    : p.precioLabel || 'Consultar precio'
  const imagen = sel.image_url || p.image || null

  return (
    <div className="snap-start flex-shrink-0 w-[40vw] md:w-auto border border-gray-800 bg-gray-800/40 rounded-xl overflow-hidden flex flex-col hover:border-gray-600 transition-all duration-300">
      <div className="relative w-full aspect-square bg-gray-800 flex items-center justify-center flex-shrink-0">
        {imagen
          ? <img key={imagen} src={imagen} alt={p.nombre} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
          : <span className="text-gray-700 text-[10px] uppercase tracking-widest text-center px-2">Imagen próx.</span>
        }
      </div>
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        <span className="text-[9px] font-bold uppercase tracking-widest bg-gray-700 text-gray-400 rounded-full px-2 py-0.5 self-start">
          {p.categoria}
        </span>
        <h3 className="font-black uppercase text-xs leading-tight">{p.nombre}</h3>
        <VariantSelectorSupl variantes={variantes} selIdx={selIdx} onChange={setSelIdx} />
        <span className="text-white font-black text-sm mt-auto">{precio}</span>
      </div>
      <button
        onClick={() => onAddToCart(p, sel)}
        className="w-full py-2.5 font-bold uppercase tracking-[0.1em] text-[10px] bg-white text-gray-950 hover:bg-gray-200 transition-all duration-300 flex-shrink-0"
      >
        + Agregar al carrito
      </button>
    </div>
  )
}

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
  const [filtro, setFiltro]   = useState('Todos')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const { allProducts: apiProds } = useCatalog('suplementos')
  const { addItem, count: cartCount } = useGymCart()

  const productosActivos = apiProds.length > 0
    ? apiProds.map((item, i) => ({
        id:          i + 1,
        categoria:   item.categoria || 'Suplementos',
        nombre:      item.name,
        image:       item.image_url || item.variantes?.[0]?.image_url || null,
        variantes:   item.variantes || [],
        precioLabel: item.variantes?.[0]?.price
          ? '$' + Math.round(item.variantes[0].price).toLocaleString('es-CO')
          : 'Consultar precio',
      }))
    : productos

  const CATEGORIAS_DIN = ['Todos', ...new Set(productosActivos.map(p => p.categoria))]

  const filtrados = filtro === 'Todos' ? productosActivos : productosActivos.filter(p => p.categoria === filtro)
  const visibles  = filtrados.slice(0, visible)

  const handleAddToCart = (p, sel = {}) => {
    const precio = sel.price
      ? '$' + Math.round(sel.price).toLocaleString('es-CO')
      : p.precioLabel
    const nombre = sel.variant ? `${p.nombre} — ${sel.variant}` : p.nombre
    addItem({
      id:    p.id,
      name:  nombre,
      price: precio,
      brand: p.categoria,
      image: sel.image_url || p.image || '',
    }, 'suplementos')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Suplementos Deportivos | INKognito Gym — Urabá y Colombia"
        description="Proteína, creatina, pre-entreno y vitaminas para potenciar tu entrenamiento. Suplementos deportivos en Urabá, Chigorodó, Antioquia. Envíos a toda Colombia."
        siteName="INKognito Gym"
        canonical={`${import.meta.env.VITE_SITE_URL}/gym/suplementos`}
      />

      <NavbarGym />

      {/* HERO */}
      <section className="relative pt-16 md:pt-24 pb-6 md:pb-10 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900" />
        <div className="absolute inset-0 opacity-[0.04]" style={GRID_PATTERN} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
              Suple<br />
              <span className="text-gray-400">mentos</span>
            </h1>
            <FlaskConical size={80} className="text-gray-800 flex-shrink-0 md:hidden" strokeWidth={1} />
          </div>
          <p className="text-gray-400 leading-relaxed max-w-2xl">
            Proteína, creatina, pre-entreno y vitaminas para potenciar tu entrenamiento. Selección de productos de calidad con envíos a toda Colombia desde Urabá, Antioquia.
          </p>
        </div>
      </section>

      <div className="pb-10 md:pb-16 px-4 md:px-6 max-w-7xl mx-auto pt-6 md:pt-8">

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
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
          {visibles.map((p) => (
            <SuplCard key={p.id} p={p} onAddToCart={handleAddToCart} />
          ))}
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

      {/* COBERTURA + CONTACTO — solo móvil */}
      <section className="md:hidden border-t border-gray-800 bg-gray-950 px-4 py-8">
        <h2 className="text-2xl font-black uppercase leading-none mb-3 text-white">Llegamos donde estás</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-5">
          Contamos con transportadora aliada para entregas seguras y con pago contraentrega en toda la región de Urabá.
        </p>
        <div className="flex gap-2 mb-5">
          <div className="flex items-center justify-center bg-white rounded-xl p-1 flex-shrink-0 aspect-square w-16">
            <img src="/eljach.png" alt="Eljach" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col justify-center bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 flex-1">
            <p className="text-white text-xs font-bold uppercase tracking-wide leading-tight">Eljach Transportadora</p>
            <p className="text-gray-500 text-[10px] mt-0.5">Aliado logístico · Contra entrega</p>
          </div>
        </div>
        <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-2">Urabá — Entrega directa</p>
        <div className="flex flex-col gap-1 mb-3">
          {[{n:'Chigorodó',t:'1–2 días'},{n:'Carepa',t:'1–2 días'},{n:'Apartadó',t:'1–2 días'},{n:'Turbo',t:'2–3 días'}].map(c => (
            <div key={c.n} className="flex items-center justify-between border-b border-gray-800 py-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-600 text-gray-300 bg-gray-800/60">{c.n}</span>
              <span className="text-gray-600 text-[9px] uppercase tracking-widest">{c.t}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-700 text-[9px] uppercase tracking-widest mb-1.5">Corregimientos y sectores</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {['Currulao','El Tres','Coldesa','Río Grande','El Reposo','Casa Verde'].map(c => (
            <span key={c} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-gray-800 text-gray-600 bg-gray-900">{c}</span>
          ))}
        </div>
        <p className="text-gray-700 text-[9px] leading-relaxed mb-4">
          ¿Fuera de Urabá? También enviamos al resto de Colombia — tiempo y costo se coordinan al confirmar.
        </p>
        <div className="flex flex-col gap-2 mb-5">
          {['Pago contraentrega disponible','Atención personalizada por WhatsApp','Cobertura en toda la región de Urabá'].map(g => (
            <div key={g} className="flex items-center gap-2">
              <span className="text-green-500 text-sm font-bold">✓</span>
              <span className="text-gray-400 text-xs">{g}</span>
            </div>
          ))}
        </div>
        <a
          href="https://wa.me/573207911013?text=Hola%2C%20quiero%20hacer%20un%20pedido%20de%20suplementos%20en%20INKognito%20Gym"
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-green-500/40 bg-gray-950 text-white font-bold uppercase tracking-[0.15em] text-sm hover:border-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300"
        >
          📱 Hacer mi pedido ahora
        </a>
      </section>

      {/* ── LOGÍSTICA + GARANTÍAS + CONTACTO — solo desktop ── */}
      <section className="hidden md:block bg-gray-950 border-t border-gray-800 px-6 py-14">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">

          {/* COL 1: LOGÍSTICA */}
          <div>
            <p className="uppercase tracking-[0.25em] text-gray-500 text-[10px] mb-4">Logística · Cobertura</p>
            <h2 className="text-3xl font-black uppercase leading-none mb-6 text-white">Llegamos donde estás</h2>
            <div className="flex gap-3 mb-4">
              <div className="flex items-center justify-center bg-white rounded-xl p-2 flex-shrink-0 w-14 h-14">
                <img src="/eljach.png" alt="Eljach" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col justify-center bg-black border border-gray-800 rounded-xl px-4 py-2.5 flex-1">
                <p className="text-white text-sm font-bold uppercase tracking-wide leading-tight">Eljach Transportadora</p>
                <p className="text-gray-500 text-xs mt-0.5">Aliado logístico · Contra entrega</p>
              </div>
            </div>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-3">Urabá — Entrega directa</p>
            <div className="flex flex-col gap-1.5 mb-3">
              {[{name:'Chigorodó',time:'1–2 días'},{name:'Carepa',time:'1–2 días'},{name:'Apartadó',time:'1–2 días'},{name:'Turbo',time:'2–3 días'}].map(c => (
                <div key={c.name} className="flex items-center justify-between py-1.5 border-b border-gray-800">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-gray-600 text-gray-300 bg-gray-800/60">{c.name}</span>
                  <span className="text-gray-600 text-[10px] uppercase tracking-[0.12em]">{c.time}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-700 text-[9px] uppercase tracking-widest mb-2">Corregimientos y sectores</p>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {['Currulao','El Tres','Coldesa','Río Grande','El Reposo','Casa Verde'].map(z => (
                <span key={z} className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-gray-800 text-gray-600 bg-gray-900">{z}</span>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-4">
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1.5">Resto de Colombia</p>
              <p className="text-gray-600 text-xs leading-relaxed">
                ¿Estás fuera de Urabá? Podemos enviarte tu pedido a cualquier parte del país.
                Tiempo y costo de envío se coordinan al confirmar el pedido.
              </p>
            </div>
          </div>

          {/* COL 2: GARANTÍAS */}
          <div>
            <p className="uppercase tracking-[0.25em] text-gray-500 text-[10px] mb-4">Garantías</p>
            <h2 className="text-3xl font-black uppercase leading-none mb-6 text-white">Compra con Confianza</h2>
            <div className="flex flex-col gap-4">
              {[
                {t:'Productos de calidad verificada',    d:'Selección de suplementos de marcas reconocidas. Sin productos de dudosa procedencia.'},
                {t:'Pago contraentrega',                  d:'Paga cuando recibas tu pedido en Urabá. Sin riesgos, sin adelantos innecesarios.'},
                {t:'Envíos a toda Colombia',              d:'Hacemos llegar tus suplementos a cualquier parte del país. Tiempo y costo coordinados.'},
                {t:'Asesoría personalizada',              d:'Te ayudamos a elegir el suplemento correcto según tu objetivo y nivel de entrenamiento.'},
                {t:'Soporte por WhatsApp',                d:'Respuesta rápida para resolver tus dudas sobre dosis, combinaciones y productos.'},
              ].map((g,i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-green-500 font-black text-base mt-0.5 flex-shrink-0">✓</span>
                  <div>
                    <p className="text-white text-sm font-bold uppercase tracking-[0.06em]">{g.t}</p>
                    <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{g.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COL 3: CONTACTO */}
          <div>
            <p className="uppercase tracking-[0.25em] text-gray-500 text-[10px] mb-4">Contacto</p>
            <h2 className="text-3xl font-black uppercase leading-none mb-6 text-white">Hablemos</h2>
            <p className="text-gray-400 text-base leading-relaxed mb-7">
              ¿Tienes dudas sobre qué suplemento elegir o cómo combinarlo? Escríbenos y te asesoramos en minutos.
            </p>
            <a
              href="https://wa.me/573207911013?text=Hola%2C%20quiero%20asesor%C3%ADa%20sobre%20suplementos%20en%20INKognito%20Gym"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl border border-green-500/30 bg-black text-white uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:border-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] mb-5"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-green-500"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Hablar con INKognito Gym
            </a>
            <div className="flex flex-col gap-3">
              {['Suplementos de calidad para tu rendimiento','Asesoría técnica personalizada','Con base en Urabá, envíos a Colombia','Pago contraentrega disponible en la región'].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <span className="text-green-500 text-sm flex-shrink-0">✓</span>
                  <span className="text-gray-400 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <FooterGym />
    </div>
  )
}
