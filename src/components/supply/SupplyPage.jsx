import NavbarSupply from './NavbarSupply'
import HeroSupply from './HeroSupply'
import CategoriesSupply from './CategoriesSupply'
import BrandsSupply from './BrandsSupply'
import FooterSupply from './FooterSupply'
import { FaWhatsapp } from 'react-icons/fa'
import Seo from '../Seo'
const ogSupply = '/og/supply.webp'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}
import { Link } from 'react-router-dom'
import { SUPPLY_HOURS } from '../../config/business'
import { useCatalog } from '../../hooks/useCatalog'

const supplyJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  "@id": `${import.meta.env.VITE_SITE_URL}/supply#business`,
  "name": "INKognito Supply",
  "description": "Insumos y equipos profesionales para tatuadores en Urabá, Antioquia. Máquinas, tintas, cartuchos, agujas y accesorios. Despacho a toda Colombia por solicitud.",
  "url": `${import.meta.env.VITE_SITE_URL}/supply`,
  "telephone": "+57-320-791-1013",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Chigorodó",
    "addressRegion": "Antioquia",
    "addressCountry": "CO"
  },
  "areaServed": ["Chigorodó","Apartadó","Turbo","Carepa","Mutatá","Colombia por solicitud"]
}

export default function SupplyPage() {
  const { allProducts } = useCatalog('supply')
  const cursoDestacado = allProducts.find(p => p.tipo === 'afiliado') || null

  return (

    <main className="bg-gray-950 text-white">

    <Seo
      title="INKognito Supply | Insumos y equipos para tatuaje en Urabá"
      description="Máquinas, cartuchos, tintas, agujas y accesorios profesionales para tatuadores. Con base en Urabá (Apartadó, Turbo, Carepa). Despacho a otras ciudades de Colombia por solicitud. Pedidos por WhatsApp."
      image={ogSupply}
      siteName="INKognito Supply"
      canonical={`${import.meta.env.VITE_SITE_URL}/supply`}
      jsonLd={supplyJsonLd}
    />

    <NavbarSupply />

      <HeroSupply />

<div className="max-w-7xl mx-auto px-6 mt-4 md:mt-8">
  <div className="border-b border-zinc-900"></div>
</div>

<CategoriesSupply />

    <BrandsSupply />

    {/* SECCIÓN PARA NUEVOS TATUADORES */}
    <section className="relative overflow-hidden bg-gray-950 border-t border-zinc-900">
      <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        <div>
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs mb-3">
            Educación · Crecimiento profesional
          </p>
          <h2 className="text-3xl md:text-5xl font-black uppercase leading-none mb-3">
            {cursoDestacado?.name || 'Fórmate.'}<br />
            <span className="text-zinc-500">
              {cursoDestacado ? 'disponible ahora' : 'Especialízate.'}
            </span>
          </h2>
          <p className="text-zinc-400 text-base max-w-lg">
            {cursoDestacado?.descripcion || 'Cursos y recursos para tatuadores en cualquier etapa: desde tus primeros pasos hasta la técnica que te falta dominar.'}
          </p>
          {cursoDestacado && (
            <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-blue-500/30 text-blue-400 bg-blue-500/5">
              Curso digital · Hotmart
            </span>
          )}
        </div>
        {cursoDestacado?.url_ventas ? (
          <a
            href={cursoDestacado.url_ventas}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 border border-blue-500/40 text-blue-400 text-sm font-black uppercase tracking-[0.2em] py-4 px-8 rounded-xl hover:border-blue-500 hover:bg-blue-500/10 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300 whitespace-nowrap"
          >
            Ver seminario →
          </a>
        ) : (
          <Link
            to="/supply/aprende"
            className="shrink-0 border border-blue-500/40 text-blue-400 text-sm font-black uppercase tracking-[0.2em] py-4 px-8 rounded-xl hover:border-blue-500 hover:bg-blue-500/10 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300 whitespace-nowrap"
          >
            Ver cursos y recursos →
          </Link>
        )}
      </div>
    </section>

    {/* ── COBERTURA + CONTACTO — solo móvil ────────────────────── */}
    <section id="contacto" className="relative overflow-hidden md:hidden border-t border-zinc-900 bg-gray-950 px-6 py-8">
      <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
      <div className="relative z-10">
      <h2 className="text-2xl font-black uppercase leading-none mb-3 text-white">Llegamos donde estás</h2>
      <p className="text-zinc-400 text-sm leading-relaxed mb-5">
        Contamos con transportadora aliada para entregas seguras y con pago contraentrega en toda la región de Urabá.
      </p>
      <div className="flex gap-2 mb-5">
        <div className="flex items-center justify-center bg-white rounded-xl p-1 flex-shrink-0 aspect-square w-16">
          <img src="/eljach.png" alt="Eljach" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col justify-center bg-black border border-zinc-800 rounded-xl px-3 py-2 flex-1">
          <p className="text-white text-xs font-bold uppercase tracking-wide leading-tight">Eljach Transportadora</p>
          <p className="text-zinc-500 text-[10px] mt-0.5">Aliado logístico · Contra entrega</p>
        </div>
      </div>
      <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-2">Urabá — Entrega directa</p>
      <div className="flex flex-col gap-1 mb-3">
        {[{n:'Chigorodó',t:'1–2 días'},{n:'Carepa',t:'1–2 días'},{n:'Apartadó',t:'1–2 días'},{n:'Turbo',t:'2–3 días'}].map(c => (
          <div key={c.n} className="flex items-center justify-between border-b border-zinc-900 py-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30 text-blue-400 bg-blue-500/5">{c.n}</span>
            <span className="text-zinc-600 text-[9px] uppercase tracking-widest">{c.t}</span>
          </div>
        ))}
      </div>
      <p className="text-zinc-700 text-[9px] uppercase tracking-widest mb-1.5">Corregimientos y sectores</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {['Currulao','El Tres','Coldesa','Río Grande','El Reposo','Casa Verde'].map(c => (
          <span key={c} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-zinc-800 text-zinc-600 bg-zinc-900">{c}</span>
        ))}
      </div>
      <p className="text-zinc-700 text-[9px] leading-relaxed mb-4">
        ¿Fuera de Urabá? También enviamos al resto de Colombia — tiempo y costo se coordinan al confirmar.
      </p>
      <div className="flex flex-col gap-2 mb-5">
        {['Pago contraentrega disponible','Atención personalizada por WhatsApp','Cobertura en toda la región de Urabá'].map(g => (
          <div key={g} className="flex items-center gap-2">
            <span className="text-green-500 text-sm font-bold">✓</span>
            <span className="text-zinc-400 text-xs">{g}</span>
          </div>
        ))}
      </div>
      <a
        href="https://wa.me/573207911013?text=Hola%2C%20quiero%20hacer%20un%20pedido%20en%20INKognito%20Supply"
        target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-green-500/40 bg-zinc-950 text-white font-bold uppercase tracking-[0.15em] text-sm hover:border-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300"
      >
        📱 Hacer mi pedido ahora
      </a>
      </div>
    </section>

    {/* ── LOGÍSTICA + GARANTÍAS + CONTACTO — solo desktop ── */}
    <section id="contacto-desktop" className="relative overflow-hidden hidden md:block bg-gray-950 border-t border-zinc-900 px-6 py-14">
      <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">

        {/* COL 1: LOGÍSTICA */}
        <div>
          <p className="uppercase tracking-[0.25em] text-blue-400/70 text-[10px] mb-4">Logística · Cobertura</p>
          <h2 className="text-3xl font-black uppercase leading-none mb-6 text-white">Llegamos donde estás</h2>
          <div className="flex gap-3 mb-4">
            <div className="flex items-center justify-center bg-white rounded-xl p-2 flex-shrink-0 w-14 h-14">
              <img src="/eljach.png" alt="Eljach" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col justify-center bg-black border border-zinc-800 rounded-xl px-4 py-2.5 flex-1">
              <p className="text-white text-sm font-bold uppercase tracking-wide leading-tight">Eljach Transportadora</p>
              <p className="text-zinc-500 text-xs mt-0.5">Aliado logístico · Contra entrega</p>
            </div>
          </div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-3">Urabá — Entrega directa</p>
          <div className="flex flex-col gap-1.5 mb-3">
            {[{name:'Chigorodó',time:'1–2 días'},{name:'Carepa',time:'1–2 días'},{name:'Apartadó',time:'1–2 días'},{name:'Turbo',time:'2–3 días'}].map(c => (
              <div key={c.name} className="flex items-center justify-between py-1.5 border-b border-zinc-900">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-500/30 text-blue-400 bg-blue-500/5">{c.name}</span>
                <span className="text-zinc-600 text-[10px] uppercase tracking-[0.12em]">{c.time}</span>
              </div>
            ))}
          </div>
          <p className="text-zinc-700 text-[9px] uppercase tracking-widest mb-2">Corregimientos y sectores</p>
          <div className="flex flex-wrap gap-1.5 mb-5">
            {['Currulao','El Tres','Coldesa','Río Grande','El Reposo','Casa Verde'].map(z => (
              <span key={z} className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-zinc-800 text-zinc-500 bg-zinc-900">{z}</span>
            ))}
          </div>
          <div className="border-t border-zinc-800 pt-4">
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1.5">Resto de Colombia</p>
            <p className="text-zinc-600 text-xs leading-relaxed">
              ¿Estás fuera de Urabá? Podemos enviarte tu pedido a cualquier parte del país.
              Tiempo y costo de envío se coordinan al confirmar el pedido.
            </p>
          </div>
        </div>

        {/* COL 2: GARANTÍAS */}
        <div>
          <p className="uppercase tracking-[0.25em] text-blue-400/70 text-[10px] mb-4">Garantías</p>
          <h2 className="text-3xl font-black uppercase leading-none mb-6 text-white">Compra con Confianza</h2>
          <div className="flex flex-col gap-4">
            {[
              {t:'Proveedores verificados',     d:'Trabajamos con distribuidores reconocidos y de confianza para el sector del tatuaje.'},
              {t:'Productos originales',         d:'Tintas, cartuchos y agujas de marcas certificadas. Calidad garantizada en cada pedido.'},
              {t:'Pago contraentrega',           d:'Paga cuando recibas tu pedido en Urabá. Sin riesgos, sin adelantos innecesarios.'},
              {t:'Soporte por WhatsApp',         d:'Asesoría personalizada antes, durante y después de tu compra.'},
              {t:'Entregas en Urabá con Eljach', d:'Transportadora aliada con cobertura en los 4 municipios principales y sus sectores.'},
              {t:'Atención personalizada',       d:'Te acompañamos en la elección del producto correcto para tu nivel y disciplina.'},
            ].map((g,i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-green-500 font-black text-base mt-0.5 flex-shrink-0">✓</span>
                <div>
                  <p className="text-white text-sm font-bold uppercase tracking-[0.06em]">{g.t}</p>
                  <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed">{g.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COL 3: CONTACTO */}
        <div>
          <p className="uppercase tracking-[0.25em] text-blue-400/70 text-[10px] mb-4">Contacto</p>
          <h2 className="text-3xl font-black uppercase leading-none mb-6 text-white">Compra con confianza</h2>
          <p className="text-zinc-400 text-base leading-relaxed mb-7">
            Te ayudamos a conseguir insumos, tintas, cartuchos y equipos especializados.
            Nuestro objetivo es acompañarte en todo el proceso para que recibas exactamente lo que necesitas.
          </p>
          <a
            href="https://wa.me/573207911013"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl border border-green-500/30 bg-black text-white uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:border-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] mb-5"
          >
            <FaWhatsapp size={22} />
            Hablar con INKognito Supply
          </a>
          <p className="text-zinc-600 uppercase tracking-[0.2em] text-xs mb-6">
            {SUPPLY_HOURS.weekdays.label} · {SUPPLY_HOURS.weekdays.hours}
          </p>
          <div className="flex flex-col gap-3">
            {['Insumos profesionales para tatuadores','Con base en Urabá, despacho a Colombia','Asesoría técnica incluida','Tu aliado para crecer como artista'].map(item => (
              <div key={item} className="flex items-center gap-3">
                <span className="text-green-500 text-sm flex-shrink-0">✓</span>
                <span className="text-zinc-400 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>

    <FooterSupply />

    </main>

  )

}
