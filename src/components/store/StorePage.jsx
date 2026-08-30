import { Link, useLoaderData } from 'react-router-dom'
import { motion } from 'motion/react'
import { STORE_HOURS } from '../../config/business'
import { FaWhatsapp } from 'react-icons/fa'
import { Truck, Shield, Clock, Star, Award } from 'lucide-react'
import NavbarStore from './NavbarStore'
import FooterStore from './FooterStore'
import TechMarquee from '../TechMarquee'
import StoreProductCard from './StoreProductCard'
import CoverflowRow from '../CoverflowRow'
import { fetchCatalogCategoriaItems, toProdCard } from '../../hooks/useCatalog'
import { CATEGORY_GROUPS } from '../../data/storeCategories'
const ogStore = '/og/store.webp'

const STRIPE_PATTERN = {
  backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 19px,rgba(201,168,76,1) 19px,rgba(201,168,76,1) 20px)',
}

// Estilo de las 2 card grandes de "Nuestras Categorías" — el "estilo Eljach"
// que pidió Jose no es un patrón de fondo, es la card en sí (ver
// EljachWeb/src/components/Packages.jsx): fondo claro con degradé sutil de
// color hacia blanco, badge de ícono en cuadro con esquinas redondeadas y
// fondo/borde tintado, borde delgado que se pinta de color al hover, y
// glow de sombra coloreada (no negra) al levantar la card. Acá recoloreada
// por card en vez del azul de Eljach: gris acero para Deportiva (paleta de
// INKognito Gym, ver GymPage.jsx) y dorado (#C9A84C) para Casual
// (2026-08-02, corrige el intento anterior con patrones geométricos de fondo).

// La sección "Nuestras Categorías" del hub ya no lista las 6 categorías
// reales una por una — ahora muestra las 2 agrupaciones (Deportiva/Casual,
// ver storeCategories.jsx) y cada una lleva a su propia página con las
// sub-categorías correspondientes (decisión de Jose, 2026-08-02).
const categoryGroups = [CATEGORY_GROUPS.deportiva, CATEGORY_GROUPS.casual]

const SHOE_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44']
const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const guarantees = [
  {
    icon: <Shield size={26} />,
    title: 'Réplica de Alta Calidad',
    desc: 'Productos fabricados con materiales premium que replican los mejores diseños del mercado a precio accesible.',
  },
  {
    icon: <Star size={26} />,
    title: 'Calidad Garantizada',
    desc: 'Materiales y acabados probados para el uso diario en el clima cálido y el ritmo activo de Urabá.',
  },
  {
    icon: <FaWhatsapp size={26} />,
    title: 'Soporte WhatsApp',
    desc: 'Atención personalizada en tiempo real. Desde la elección de talla hasta la entrega en tu puerta.',
  },
  {
    icon: <Truck size={26} />,
    title: 'Entrega Segura',
    desc: 'Tu pedido llega bien empacado, con seguimiento y a tiempo a cualquier municipio de Urabá.',
  },
  {
    icon: <Award size={26} />,
    title: 'Cambios de Talla',
    desc: 'Si la talla no es la correcta, te ayudamos a hacer el cambio sin complicaciones.',
  },
  {
    icon: <Clock size={26} />,
    title: 'Respuesta Inmediata',
    desc: `${STORE_HOURS.weekdays.label} de ${STORE_HOURS.weekdays.hours}. Siempre disponibles para resolver tus dudas.`,
  },
]

// Aparición con fade + deslizamiento leve al entrar en pantalla (2026-08-30,
// Jose — probando en Store el mismo lenguaje de "scroll" que se ve en
// fractaill.com; ver TechMarquee.jsx). `viewport:{once:true}` evita que se
// repita si el usuario vuelve a pasar por la misma sección. No se aplica al
// HERO — ese ya está visible al cargar, no tiene sentido hacerlo esperar.
const REVEAL = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
}

const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  "@id": `${import.meta.env.VITE_SITE_URL}/store#business`,
  "name": "INKognito Store",
  "description": "Tienda online de ropa, zapatos y guayos, con proveedores verificados. Nike, Adidas, Puma y más. Chigorodó, Apartadó, Turbo, Carepa, Antioquia. Envío regional.",
  "url": `${import.meta.env.VITE_SITE_URL}/store`,
  "telephone": "+57-320-791-1013",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Chigorodó",
    "addressRegion": "Antioquia",
    "addressCountry": "CO"
  },
  "areaServed": ["Chigorodó","Apartadó","Turbo","Carepa","Mutatá","Necoclí"]
}

export async function loader() {
  return fetchCatalogCategoriaItems('store', 'Destacados')
}

export function meta() {
  const title = 'INKognito Store | Ropa y calzado en Urabá'
  const description = 'Tienda online de ropa para dama y caballero, zapatos deportivos, casuales y guayos, con proveedores verificados. En Chigorodó y el Urabá antioqueño. Pide por WhatsApp con entrega en la región.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: `${import.meta.env.VITE_SITE_URL}${ogStore}` },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/store` },
    { 'script:ld+json': storeJsonLd },
  ]
}

export default function StorePage() {
  const { items: featuredItems } = useLoaderData()

  return (
    <main className="bg-white text-gray-900">

      <NavbarStore />

      {/* ── HERO ── */}
      <section className="relative flex flex-col justify-start overflow-hidden pt-16 md:pt-20 bg-gray-50">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 15% 50%, rgba(201,168,76,0.10) 0%, transparent 55%), radial-gradient(ellipse at 85% 15%, rgba(201,168,76,0.06) 0%, transparent 50%)',
          }}
        />
        <div className="absolute inset-0 opacity-[0.13]" style={STRIPE_PATTERN} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/25 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-4 pb-8 md:pt-8 md:pb-12">
          <div className="md:grid md:grid-cols-2 md:gap-16 md:items-start">

            {/* IZQUIERDA */}
            <div className="text-center md:text-left">
              <p className="uppercase tracking-[0.4em] text-[#C9A84C] text-xs md:text-sm mb-4 md:mb-6 font-semibold">
                INKognito Store — Urabá, Antioquia
              </p>

              <h1 className="text-5xl sm:text-7xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] mb-6 md:mb-8">
                <span className="block text-gray-900">Ropa &</span>
                <span className="block text-[#C9A84C]">Calzado</span>
                <span className="block text-gray-900">Para Urabá</span>
              </h1>

              <p className="text-gray-700 text-base md:text-xl leading-relaxed max-w-2xl mx-auto md:mx-0 mb-8 md:mb-12">
                Tienda online de ropa y calzado, con proveedores verificados.
                Calidad premium, precio accesible y diseños inspirados en las
                mejores marcas, fabricados para el ritmo de Urabá.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={() => document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-4 uppercase tracking-[0.25em] font-black text-sm text-black transition-all duration-300 hover:brightness-90"
                  style={{ backgroundColor: '#C9A84C' }}
                >
                  Ver Catálogo
                </button>
                <a
                  href="https://wa.me/573207911013?text=Hola,%20quiero%20ver%20el%20catálogo%20de%20INKognito%20Store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex px-10 py-4 uppercase tracking-[0.25em] font-bold text-sm border border-gray-300 text-gray-700 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300 items-center justify-center gap-2"
                >
                  <FaWhatsapp size={18} />
                  WhatsApp
                </a>
              </div>

              {/* STATS */}
              <div className="mt-8 md:mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto md:mx-0">
                <div className="text-center md:text-left">
                  <p className="text-3xl md:text-5xl font-black text-[#C9A84C]">4</p>
                  <p className="text-gray-600 uppercase tracking-[0.2em] text-[10px] md:text-xs mt-1">Municipios</p>
                </div>
                <div className="text-center md:text-left border-x md:border-x-0 md:border-l border-gray-300 md:pl-6">
                  <p className="text-3xl md:text-5xl font-black text-[#C9A84C]">+6</p>
                  <p className="text-gray-600 uppercase tracking-[0.2em] text-[10px] md:text-xs mt-1">Categorías</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-3xl md:text-5xl font-black text-[#C9A84C]">100%</p>
                  <p className="text-gray-600 uppercase tracking-[0.2em] text-[10px] md:text-xs mt-1">Calidad</p>
                </div>
              </div>
            </div>

            {/* DERECHA — solo desktop, mismo cuadro de Eljach que ya tiene
                Supply en su hero (HeroSupply.jsx), recoloreado a dorado
                (2026-08-02, pedido de Jose). */}
            <div className="hidden md:flex justify-center">
              <div className="bg-gray-950 border border-[#C9A84C]/30 rounded-2xl p-8 hover:border-[#C9A84C] hover:shadow-[0_0_25px_rgba(201,168,76,0.15)] transition-all duration-300 w-full max-w-md">
                <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs mb-4">
                  Logística · Cobertura
                </p>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl p-2 flex-shrink-0 w-14 h-14">
                    <Truck size={26} className="text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold uppercase tracking-wide leading-tight">Ruta del Golfo</p>
                    <p className="text-zinc-500 text-xs mt-0.5">Transportadoras verificadas</p>
                  </div>
                </div>
                <div className="space-y-2.5 mb-6">
                  {[{name:'Chigorodó',time:'1–2 días'},{name:'Carepa',time:'1–2 días'},{name:'Apartadó',time:'1–2 días'},{name:'Turbo',time:'2–3 días'}].map(c => (
                    <div key={c.name} className="flex items-center justify-between border-b border-zinc-900 pb-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] bg-[#C9A84C]/5">{c.name}</span>
                      <span className="text-zinc-600 text-[10px] uppercase tracking-[0.12em]">{c.time}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-zinc-800 pt-6">
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Contraentrega en toda la región de Urabá. ¿Fuera de la región? También enviamos a
                    todo Colombia — tiempo y costo se coordinan al confirmar el pedido.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CATEGORÍAS ── */}
      <motion.section {...REVEAL} id="categorias" className="bg-gray-50 pt-3 md:pt-6 pb-8 md:pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 md:mb-8">
            <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-xs mb-2">
              Catálogo
            </p>
            <h2 className="text-2xl md:text-4xl font-black uppercase leading-none text-gray-900">
              Nuestras Categorías
            </h2>
          </div>

          {/* Mismo espíritu "sólido" que las card de Educación en Supply
              (SupplyPage.jsx) pero no idéntico: fondo más claro que
              zinc-900/black (gris acero medio para Deportiva, bronce oscuro
              con más presencia dorada para Casual) y el círculo decorativo
              en otra esquina/tamaño para que no se lean como copia-pega
              (2026-08-02, ajuste sobre el primer intento). */}
          <div className="flex md:grid md:grid-cols-2 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
            {categoryGroups.map((group) => {
              const isGym = group.key === 'deportiva'
              return (
                <Link
                  key={group.link}
                  to={group.link}
                  className={`group relative overflow-hidden snap-start flex-shrink-0 w-[80vw] md:w-auto rounded-2xl border bg-gradient-to-br p-6 md:p-7 flex flex-col transition-all duration-300 hover:-translate-y-1 min-h-[240px] md:min-h-[280px] ${
                    isGym
                      ? 'from-zinc-600 to-zinc-900 border-zinc-400/30 hover:border-zinc-300/50 hover:shadow-[0_12px_35px_rgba(161,161,170,0.2)]'
                      : 'from-[#4a350f] to-black border-[#C9A84C]/40 hover:border-[#C9A84C]/70 hover:shadow-[0_12px_35px_rgba(201,168,76,0.3)]'
                  }`}
                >
                  <div className={isGym
                    ? 'absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10'
                    : 'absolute -bottom-14 -right-14 w-44 h-44 rounded-full bg-[#C9A84C]/15'
                  } />
                  <div className={`relative w-12 h-12 rounded-full border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                    isGym ? 'bg-zinc-900/60 border-zinc-300/30 text-zinc-200' : 'bg-black/40 border-[#C9A84C]/50 text-[#C9A84C]'
                  }`}>
                    {group.icon}
                  </div>
                  <p className={`relative uppercase tracking-[0.25em] text-[10px] mb-2 font-semibold ${isGym ? 'text-zinc-300' : 'text-[#C9A84C]'}`}>
                    {group.tag}
                  </p>
                  <h3 className="relative text-lg md:text-2xl font-black uppercase leading-tight mb-3 text-white">
                    {group.name}
                  </h3>
                  <p className={`relative text-xs md:text-sm leading-relaxed mb-5 flex-1 text-justify [hyphens:auto] ${isGym ? 'text-zinc-200' : 'text-zinc-400'}`}>
                    {group.description}
                  </p>
                  <span className={`relative shrink-0 border text-xs md:text-sm font-black uppercase tracking-[0.2em] py-3 px-6 rounded-xl text-center transition-all duration-300 ${
                    isGym
                      ? 'border-zinc-300/40 text-zinc-100 group-hover:border-zinc-100 group-hover:bg-white/10'
                      : 'border-[#C9A84C]/50 text-[#C9A84C] group-hover:border-[#C9A84C] group-hover:bg-[#C9A84C]/15'
                  }`}>
                    Ver categorías →
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* ── DESTACADOS ── */}
      <motion.section {...REVEAL} id="destacados" className="bg-white pt-3 md:pt-6 pb-8 md:pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 md:mb-8">
            <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-xs mb-2">
              Selección
            </p>
            <h2 className="text-2xl md:text-4xl font-black uppercase leading-none text-gray-900">
              Destacados
            </h2>
          </div>

          {featuredItems.length === 0 ? (
            <div className="border border-gray-200 rounded-xl py-10 text-center">
              <p className="text-gray-400 text-sm mb-1">Selección en preparación</p>
              <p className="text-gray-500 text-xs">Agrega productos con categoría "Destacados" desde el panel</p>
            </div>
          ) : (
            <CoverflowRow desktopClassName="md:grid md:grid-cols-4 gap-4">
              {featuredItems.map(item => {
                const prod = toProdCard(item)
                const sizes = item.variantes.map(v => v.variant).filter(Boolean)
                const isClothing = item.descripcion?.toLowerCase().includes('ropa') || item.name?.toLowerCase().includes('ropa')
                return (
                  <StoreProductCard
                    key={item.name}
                    product={prod}
                    category="destacados"
                    sizes={sizes.length ? sizes : (isClothing ? CLOTHING_SIZES : SHOE_SIZES)}
                  />
                )
              })}
            </CoverflowRow>
          )}
        </div>
      </motion.section>

      {/* ── LOGÍSTICA + GARANTÍAS + CONTACTO — solo desktop (dark, 3 col) ── */}
      <div className="hidden md:block">
        <motion.section {...REVEAL} className="bg-black text-white py-14 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">

              {/* COL 1: LOGÍSTICA */}
              <div>
                <p className="uppercase tracking-[0.25em] text-[#C9A84C]/70 text-[10px] mb-4">Logística · Cobertura</p>
                <h2 className="text-3xl font-black uppercase leading-none mb-6 text-white">Llegamos donde estás</h2>

                {/* Urabá — cobertura directa */}
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-3">Urabá — Entrega directa</p>
                <div className="flex gap-3 mb-4">
                  <div className="flex items-center justify-center bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl p-2 flex-shrink-0 w-14 h-14">
                    <Truck size={26} className="text-[#C9A84C]" />
                  </div>
                  <div className="flex flex-col justify-center bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 flex-1">
                    <p className="text-white text-sm font-bold uppercase tracking-wide leading-tight">Ruta del Golfo</p>
                    <p className="text-zinc-500 text-xs mt-0.5">Transportadoras verificadas</p>
                  </div>
                </div>

                {/* Municipios con tiempos */}
                <div className="flex flex-col gap-1.5 mb-3">
                  {[
                    { name: 'Chigorodó', time: '1–2 días' },
                    { name: 'Carepa',    time: '1–2 días' },
                    { name: 'Apartadó', time: '1–2 días' },
                    { name: 'Turbo',    time: '2–3 días' },
                  ].map(c => (
                    <div key={c.name} className="flex items-center justify-between py-1.5 border-b border-zinc-900">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] bg-[#C9A84C]/5">{c.name}</span>
                      <span className="text-zinc-600 text-[10px] uppercase tracking-[0.12em]">{c.time}</span>
                    </div>
                  ))}
                </div>

                {/* Corregimientos y sectores */}
                <p className="text-zinc-700 text-[9px] uppercase tracking-widest mb-2">Corregimientos y sectores</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {['Currulao','El Tres','Coldesa','Río Grande','El Reposo','Casa Verde'].map(z => (
                    <span key={z} className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-zinc-800 text-zinc-500 bg-zinc-900">{z}</span>
                  ))}
                </div>

                {/* Resto de Colombia */}
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
                <p className="uppercase tracking-[0.25em] text-[#C9A84C]/70 text-[10px] mb-4">Garantías</p>
                <h2 className="text-3xl font-black uppercase leading-none mb-6 text-white">Compra con Confianza</h2>
                <div className="flex flex-col gap-4">
                  {guarantees.map((g, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-[#C9A84C] font-black text-base mt-0.5 flex-shrink-0">✓</span>
                      <div>
                        <p className="text-white text-sm font-bold uppercase tracking-[0.06em]">{g.title}</p>
                        <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed">{g.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COL 3: CONTACTO — reescrito 2026-08-30 (Jose: "aquí se
                  alojan productos de diferentes tiendas, nosotros le
                  prestamos la infraestructura digital para su negocio")
                  — ya no hay un WhatsApp único de "INKognito Store" (se
                  quitó el botón), así que el texto deja de prometer
                  atención directa nuestra y aclara que cada tienda
                  responde por su cuenta, mismo criterio que las
                  políticas de INK. */}
              <div>
                <p className="uppercase tracking-[0.25em] text-[#C9A84C]/70 text-[10px] mb-4">Cómo Funciona</p>
                <h2 className="text-3xl font-black uppercase leading-none mb-6 text-white">Tiendas Independientes</h2>
                <p className="text-zinc-400 text-base leading-relaxed mb-7">
                  INKognito Store reúne tiendas de ropa y calzado de Urabá — cada una gestiona sus propios pedidos.
                  Entra al perfil de la tienda que te interesa y escríbele directo por WhatsApp.
                </p>
                <p className="text-zinc-600 uppercase tracking-[0.2em] text-xs mb-6">
                  {STORE_HOURS.weekdays.label} · {STORE_HOURS.weekdays.hours}
                </p>
                <div className="flex flex-col gap-3">
                  {['Réplicas premium de alta calidad','Cobertura en toda la región de Urabá','Contacto directo con cada tienda','Tiendas verificadas por INKognito','Pago contraentrega disponible'].map(item => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="text-[#C9A84C] text-sm flex-shrink-0">✓</span>
                      <span className="text-zinc-400 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.section>
      </div>

      {/* ── LLEGAMOS DONDE ESTÁS — solo móvil ── */}
      <motion.section {...REVEAL} id="contacto" className="md:hidden bg-black text-white border-t border-zinc-900 px-6 py-8">
        <h2 className="text-2xl font-black uppercase leading-none mb-3 text-white">Llegamos donde estás</h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-5">
          Entregas seguras con Ruta del Golfo, nuestra red de transportadoras verificadas en toda la región de Urabá.
        </p>
        <div className="flex gap-2 mb-5">
          <div className="flex items-center justify-center bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl flex-shrink-0 aspect-square w-16">
            <Truck size={28} className="text-[#C9A84C]" />
          </div>
          <div className="flex flex-col justify-center bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 flex-1">
            <p className="text-white text-xs font-bold uppercase tracking-wide leading-tight">Ruta del Golfo</p>
            <p className="text-zinc-500 text-[10px] mt-0.5">Transportadoras verificadas</p>
          </div>
        </div>
        {/* Municipios con tiempos */}
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-2">Urabá — Entrega directa</p>
        <div className="flex flex-col gap-1 mb-3">
          {[{n:'Chigorodó',t:'1–2 días'},{n:'Carepa',t:'1–2 días'},{n:'Apartadó',t:'1–2 días'},{n:'Turbo',t:'2–3 días'}].map(c => (
            <div key={c.n} className="flex items-center justify-between border-b border-zinc-900 py-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] bg-[#C9A84C]/5">{c.n}</span>
              <span className="text-zinc-600 text-[9px] uppercase tracking-widest">{c.t}</span>
            </div>
          ))}
        </div>

        {/* Corregimientos y sectores */}
        <p className="text-zinc-700 text-[9px] uppercase tracking-widest mb-1.5">Corregimientos y sectores</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {['Currulao','El Tres','Coldesa','Río Grande','El Reposo','Casa Verde'].map(c => (
            <span key={c} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-zinc-800 text-zinc-600 bg-zinc-900">{c}</span>
          ))}
        </div>

        {/* Nacional — sutil */}
        <p className="text-zinc-700 text-[9px] leading-relaxed mb-4">
          ¿Fuera de Urabá? También enviamos al resto de Colombia — tiempo y costo se coordinan al confirmar.
        </p>

        {/* Garantías */}
        <div className="flex flex-col gap-2 mb-5">
          {['Pago contraentrega disponible','Contacto directo con cada tienda','Cobertura en toda la región de Urabá'].map(g => (
            <div key={g} className="flex items-center gap-2">
              <span className="font-bold text-sm" style={{ color: '#C9A84C' }}>✓</span>
              <span className="text-zinc-400 text-xs">{g}</span>
            </div>
          ))}
        </div>
      </motion.section>

      <TechMarquee />

      {/* ── TIENDAS ALIADAS — discreta, a nivel de pie (Store multitenant,
          2026-08-29). El punto es que un comprador pueda llegar al
          directorio sin depender de un link que una tienda le mandó —
          por eso vive acá, alcanzable desde el hub, no escondida. */}
      <motion.section {...REVEAL} className="bg-white border-t border-gray-100 px-6 py-6 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <p className="text-gray-500 text-xs">
            ¿Buscas una tienda específica? <Link to="/store/tiendas" className="font-bold underline underline-offset-2 hover:text-[#C9A84C]">Ver tiendas verificadas →</Link>
          </p>
          <span className="text-gray-300 text-xs hidden sm:inline">·</span>
          <p className="text-gray-400 text-[11px]">
            ¿Tienes una tienda de ropa o calzado en Urabá? <Link to="/tattoo-artist-colombia/tienda/unete" className="underline underline-offset-2 hover:text-[#C9A84C]">Regístrala acá</Link>
          </p>
        </div>
      </motion.section>

      <FooterStore />

    </main>
  )
}
