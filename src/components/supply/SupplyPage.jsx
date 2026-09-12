import { useLoaderData } from 'react-router-dom'
import NavbarSupply from './NavbarSupply'
import HeroSupply from './HeroSupply'
import CategoriesSupply from './CategoriesSupply'
import BrandsSupply from './BrandsSupply'
import TechMarquee from '../TechMarquee'
import FooterSupply from './FooterSupply'
import { FaWhatsapp } from 'react-icons/fa'
import { GraduationCap, Package, BookOpen } from 'lucide-react'
import { fetchCatalogFull } from '../../hooks/useCatalog'
const ogSupply = '/og/supply.webp'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}
import { Link } from 'react-router-dom'
import { SUPPLY_HOURS } from '../../config/business'

const supplyJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  "@id": `${import.meta.env.VITE_SITE_URL}/supply#business`,
  "name": "INKognito Supply",
  "description": "Tienda online de insumos y equipos profesionales para tatuadores, con productos de proveedores locales y nacionales verificados. Máquinas, tintas, cartuchos, agujas y accesorios. Con base en Urabá, Antioquia. Despacho a toda Colombia por solicitud.",
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

export async function loader() {
  return fetchCatalogFull('supply')
}

export function meta() {
  const title = 'INKognito Supply | Insumos y equipos para tatuaje en Urabá'
  const description = 'Tienda online de insumos para tatuadores — máquinas, cartuchos, tintas, agujas y accesorios de proveedores locales y nacionales verificados y reconocidos. Con base en Urabá (Apartadó, Turbo, Carepa), despacho a toda Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: `${import.meta.env.VITE_SITE_URL}${ogSupply}` },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply` },
    { 'script:ld+json': supplyJsonLd },
  ]
}

export default function SupplyPage() {
  const { categorias } = useLoaderData()

  return (

    <main className="bg-gray-950 text-white">

    <NavbarSupply />

      <HeroSupply />

<div className="max-w-7xl mx-auto px-6 mt-2 md:mt-8">
  <div className="border-b border-zinc-900"></div>
</div>

<CategoriesSupply categorias={categorias} />

    <BrandsSupply />

    {/* SECCIÓN EDUCACIÓN — Cursos, Kit, Recursos */}
    <section className="relative overflow-hidden bg-gray-950 border-t border-zinc-900 py-8 md:py-16">
      <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="mb-6">
          <h2 className="float-left mr-6 md:mr-8 mb-2 text-2xl md:text-4xl font-black uppercase leading-none">
            Educación
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed text-justify [hyphens:auto]">
            Tatuar bien no es solo cuestión de pulso — es técnica, negocio y disciplina. Por eso
            esta sección reúne cursos grabados por tatuadores que ya viven de esto, el kit básico
            para empezar sin sobrecostos, y recursos gratuitos para seguir creciendo sin que el
            dinero sea la barrera. Todo pensado para acompañarte más allá de la venta.
          </p>
          <div className="clear-both" />
        </div>

        <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">

          {/* CARD CURSOS — mismo patrón de card usado en Eljach (Packages.jsx:
              fondo en degradado, no plano + hover con elevación/sombra) y en
              jhumaneztattoo (CuidadosTeaser.jsx: círculo decorativo difuminado
              detrás del contenido + ícono que crece en hover), adaptado a la
              paleta azul de Supply. */}
          <div className="group relative overflow-hidden snap-start flex-shrink-0 w-[80vw] md:w-auto border border-blue-500/20 bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 md:p-7 flex flex-col hover:border-blue-500/40 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(59,130,246,0.15)] transition-all duration-300">
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-blue-600/10" />
            <div className="relative w-12 h-12 rounded-full bg-zinc-900 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap size={22} />
            </div>
            <h3 className="relative text-xl md:text-2xl font-black uppercase leading-none mb-3">
              Domina tu oficio.<br />
              <span className="text-zinc-500">No lo improvises.</span>
            </h3>
            <p className="relative text-zinc-400 text-sm mb-5 flex-1">
              Cursos grabados por tatuadores que ya viven de esto. Acceso de por vida, a tu ritmo.
            </p>
            <Link
              to="/supply/aprende#cursos"
              className="relative shrink-0 border border-blue-500/40 text-blue-400 text-sm font-black uppercase tracking-[0.2em] py-3 px-6 rounded-xl text-center hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300"
            >
              Ver cursos →
            </Link>
          </div>

          {/* CARD KIT — mismo patrón, acento ámbar en vez de azul para que las
              3 cards no se lean idénticas (variación ya vista en el propio
              Packages.jsx de Eljach entre su card "featured" y las normales). */}
          <div className="group relative overflow-hidden snap-start flex-shrink-0 w-[80vw] md:w-auto border border-amber-500/20 bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 md:p-7 flex flex-col hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(245,158,11,0.15)] transition-all duration-300">
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-amber-500/10" />
            <div className="relative w-12 h-12 rounded-full bg-zinc-900 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Package size={22} />
            </div>
            <h3 className="relative text-xl md:text-2xl font-black uppercase leading-none mb-3">
              Equípate bien<br />
              <span className="text-zinc-500">desde el día uno.</span>
            </h3>
            <p className="relative text-zinc-400 text-sm mb-5 flex-1">
              Insumos básicos seleccionados en Amazon y AliExpress para empezar a tatuar con seriedad, sin sobrecostos.
            </p>
            <Link
              to="/supply/aprende#kit"
              className="relative shrink-0 border border-amber-500/40 text-amber-400 text-sm font-black uppercase tracking-[0.2em] py-3 px-6 rounded-xl text-center hover:border-amber-500 hover:bg-amber-500/10 transition-all duration-300"
            >
              Ver kit recomendado →
            </Link>
          </div>

          {/* CARD RECURSOS — acento esmeralda (tercer color, gratis/crecimiento). */}
          <div className="group relative overflow-hidden snap-start flex-shrink-0 w-[80vw] md:w-auto border border-emerald-500/20 bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 md:p-7 flex flex-col hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(16,185,129,0.15)] transition-all duration-300">
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-emerald-500/10" />
            <div className="relative w-12 h-12 rounded-full bg-zinc-900 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <BookOpen size={22} />
            </div>
            <h3 className="relative text-xl md:text-2xl font-black uppercase leading-none mb-3">
              Conocimiento<br />
              <span className="text-zinc-500">que no cuesta nada.</span>
            </h3>
            <p className="relative text-zinc-400 text-sm mb-5 flex-1">
              Contenido gratuito para seguir creciendo. La práctica constante es lo que realmente marca la diferencia.
            </p>
            <Link
              to="/supply/aprende#recursos"
              className="relative shrink-0 border border-emerald-500/40 text-emerald-400 text-sm font-black uppercase tracking-[0.2em] py-3 px-6 rounded-xl text-center hover:border-emerald-500 hover:bg-emerald-500/10 transition-all duration-300"
            >
              Ver recursos gratuitos →
            </Link>
          </div>

        </div>
      </div>
    </section>

    {/* ── COBERTURA + CONTACTO — solo móvil ────────────────────── */}
    <section id="contacto" className="relative overflow-hidden md:hidden border-t border-zinc-900 bg-gray-950 px-6 py-8">
      <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
      <div className="relative z-10">
      <h2 className="text-2xl font-black uppercase leading-none mb-3 text-white">Llegamos donde estás</h2>
      <p className="text-zinc-400 text-sm leading-relaxed mb-5">
        Trabajamos con proveedores verificados en distintas ciudades del país — cada uno coordina
        contigo el envío y la forma de pago directamente al confirmar tu pedido.
      </p>
      <div className="flex flex-col gap-2 mb-5">
        {['Proveedores verificados en todo el país','Atención personalizada por WhatsApp','Envíos a toda Colombia'].map(g => (
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
          <p className="text-zinc-400 text-sm leading-relaxed mb-5">
            Trabajamos con proveedores verificados en distintas ciudades del país — cada uno
            coordina contigo el envío y la forma de pago directamente al confirmar tu pedido.
          </p>
          <div className="border-t border-zinc-800 pt-4">
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1.5">Cobertura nacional</p>
            <p className="text-zinc-600 text-xs leading-relaxed">
              Enviamos a cualquier parte de Colombia. Tiempo y costo de envío se coordinan con
              el proveedor al confirmar el pedido.
            </p>
          </div>
        </div>

        {/* COL 2: GARANTÍAS */}
        <div>
          <p className="uppercase tracking-[0.25em] text-blue-400/70 text-[10px] mb-4">Garantías</p>
          <h2 className="text-3xl font-black uppercase leading-none mb-6 text-white">Compra con Confianza</h2>
          <div className="flex flex-col gap-4">
            {[
              {t:'Proveedores verificados',      d:'Estudios y empresas verificadas en distintas ciudades de Colombia, con catálogo propio.'},
              {t:'Productos originales',         d:'Tintas, cartuchos y agujas de marcas certificadas. Calidad garantizada en cada pedido.'},
              {t:'Pago contraentrega',           d:'Disponible donde el proveedor lo ofrezca. Sin riesgos, sin adelantos innecesarios.'},
              {t:'Soporte por WhatsApp',         d:'Asesoría personalizada antes, durante y después de tu compra.'},
              {t:'Envíos a toda Colombia',       d:'Cada proveedor coordina contigo tiempo y costo de envío al confirmar el pedido.'},
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

    <TechMarquee />

    <FooterSupply />

    </main>

  )

}

