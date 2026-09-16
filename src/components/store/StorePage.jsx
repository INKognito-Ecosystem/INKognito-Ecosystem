import { Link, useLoaderData } from 'react-router-dom'
import { motion } from 'motion/react'
import { STORE_HOURS } from '../../config/business'
import { FaWhatsapp } from 'react-icons/fa'
import { Truck, Shield, Clock, Star, Award } from 'lucide-react'
import NavbarStore from './NavbarStore'
import MobileHomeStore from './MobileHomeStore'
import FooterStore from './FooterStore'
import TechMarquee from '../TechMarquee'
import LlegamosDondeEstas from './LlegamosDondeEstas'
import StoreProductCard from './StoreProductCard'
import CoverflowRow from '../CoverflowRow'
import { fetchCatalogCategoriaItems, toProdCard } from '../../hooks/useCatalog'
import { ZONAS_FLETE } from '../../data/colombiaGeo'
import rutaDelGolfoLogo from '../../assets/milogo/rutadelgolfologo.png'
const ogStore = '/og/store.webp'

const STRIPE_PATTERN = {
  backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 19px,rgba(201,168,76,1) 19px,rgba(201,168,76,1) 20px)',
}

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

      {/* Home móvil (MobileHomeStore, 2026-09-16, Jose: "usaremos la misma
          lógica que aplicamos en Supply e INK") — reemplaza SOLO en móvil
          al navbar+hero de abajo (envueltos en hidden md:block). */}
      <MobileHomeStore initialProducts={featuredItems} />

      <div className="hidden md:block">
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
                  <p className="text-3xl md:text-5xl font-black text-[#C9A84C]">10</p>
                  <p className="text-gray-600 uppercase tracking-[0.2em] text-[10px] md:text-xs mt-1">Zonas cubiertas</p>
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
            {/* Card temática de Ruta del Golfo — fondo blanco + colores
                propios de su marca oficial (2026-09-16, Jose: "que la
                sección de ruta del golfo el fondo sea blanco y azules, que
                son sus colores de empresa, y el naranja"): azul `#0057D9`
                + naranja `#F2854C`, la misma paleta ya elegida para su
                logo (ver memoria project_ruta_del_golfo.md) — ya NO el
                fondo oscuro ni el dorado de Store. */}
            <div className="hidden md:flex justify-center">
              <div className="bg-white border border-[#0057D9]/25 rounded-2xl p-8 hover:border-[#0057D9] hover:shadow-[0_0_25px_rgba(0,87,217,0.12)] transition-all duration-300 w-full max-w-md">
                <p className="text-[#0057D9] uppercase tracking-[0.3em] text-xs mb-4 font-semibold">
                  Logística · Cobertura
                </p>
                <div className="flex items-center gap-3 mb-6 bg-[#0057D9]/5 border border-[#0057D9]/15 rounded-xl px-4 py-3">
                  <img src={rutaDelGolfoLogo} alt="Ruta del Golfo" className="w-14 h-14 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 text-sm font-bold uppercase tracking-wide leading-tight">Ruta del Golfo</p>
                    <p className="text-gray-500 text-xs mt-0.5">Transportadoras verificadas</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {Object.values(ZONAS_FLETE).map((z) => (
                    <span key={z} className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#F2854C]/40 text-[#F2854C] bg-[#F2854C]/10">{z}</span>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Contraentrega en toda la región de Urabá. ¿Fuera de la región? También enviamos a
                    todo Colombia — tiempo y costo se coordinan al confirmar el pedido.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      </div>

      {/* ── DESTACADOS ── solo desktop (2026-09-16) — en móvil ya lo muestra
          MobileHomeStore, con la misma selección `featuredItems`, para no
          duplicar la sección. */}
      <motion.section {...REVEAL} id="destacados" className="hidden md:block bg-white pt-3 md:pt-6 pb-8 md:pb-12 px-6">
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

      {/* ── LOGÍSTICA + GARANTÍAS + CONTACTO — solo desktop. Fondo blanco
          (2026-09-16, Jose: "que la sección de ruta del golfo el fondo sea
          blanco y azules... y el naranja, solo queda negro el listón de
          las tecnologías usadas") — antes era una franja negra igual que
          TechMarquee; ahora TechMarquee queda como la ÚNICA sección oscura
          de la página. */}
      <div className="hidden md:block">
        <motion.section {...REVEAL} className="bg-white text-gray-900 border-t border-gray-200 py-14 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">

              {/* COL 1: LOGÍSTICA — colores propios de Ruta del Golfo, no
                  el dorado de Store (2026-09-16, ver nota en el hero). */}
              <div>
                <p className="uppercase tracking-[0.25em] text-[#0057D9] text-[10px] mb-4 font-semibold">Logística · Cobertura</p>

                <div className="flex items-center gap-3 mb-6 bg-[#0057D9]/5 border border-[#0057D9]/15 rounded-xl px-4 py-3">
                  <img src={rutaDelGolfoLogo} alt="Ruta del Golfo" className="w-14 h-14 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 text-sm font-bold uppercase tracking-wide leading-tight">Ruta del Golfo</p>
                    <p className="text-gray-500 text-xs mt-0.5">Transportadoras verificadas</p>
                  </div>
                </div>

                <h2 className="text-3xl font-black uppercase leading-none mb-6 text-gray-900">Llegamos donde estás</h2>

                {/* Sin días por municipio a propósito — con varias
                    transportadoras pudiendo conectarse, el tiempo real varía
                    y en varios casos será más rápido que una ruta fija
                    (2026-08-30, Jose). */}
                <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">Zonas de cobertura</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {Object.values(ZONAS_FLETE).map((z) => (
                    <span key={z} className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#F2854C]/40 text-[#F2854C] bg-[#F2854C]/10">{z}</span>
                  ))}
                </div>

                {/* Resto de Colombia */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1.5">Resto de Colombia</p>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    ¿Estás fuera de Urabá? Podemos enviarte tu pedido a cualquier parte del país.
                    Tiempo y costo de envío se coordinan al confirmar el pedido.
                  </p>
                </div>
              </div>

              {/* COL 2: GARANTÍAS */}
              <div>
                <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-[10px] mb-4 font-semibold">Garantías</p>
                <h2 className="text-3xl font-black uppercase leading-none mb-6 text-gray-900">Compra con Confianza</h2>
                <div className="flex flex-col gap-4">
                  {guarantees.map((g, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-[#C9A84C] font-black text-base mt-0.5 flex-shrink-0">✓</span>
                      <div>
                        <p className="text-gray-900 text-sm font-bold uppercase tracking-[0.06em]">{g.title}</p>
                        <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{g.desc}</p>
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
                <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-[10px] mb-4 font-semibold">Cómo Funciona</p>
                <h2 className="text-3xl font-black uppercase leading-none mb-6 text-gray-900">Tiendas Independientes</h2>
                <p className="text-gray-600 text-base leading-relaxed mb-7">
                  INKognito Store reúne tiendas de ropa y calzado de Urabá — cada una gestiona sus propios pedidos.
                  Entra al perfil de la tienda que te interesa y escríbele directo por WhatsApp.
                </p>
                <p className="text-gray-500 uppercase tracking-[0.2em] text-xs mb-6">
                  {STORE_HOURS.weekdays.label} · {STORE_HOURS.weekdays.hours}
                </p>
                <div className="flex flex-col gap-3">
                  {['Réplicas premium de alta calidad','Cobertura en toda la región de Urabá','Contacto directo con cada tienda','Tiendas verificadas por INKognito','Pago contraentrega disponible'].map(item => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="text-[#C9A84C] text-sm flex-shrink-0">✓</span>
                      <span className="text-gray-600 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.section>
      </div>

      {/* ── LLEGAMOS DONDE ESTÁS — solo móvil, componente compartido con
          las páginas de categoría (ver LlegamosDondeEstas.jsx) ── */}
      <motion.section {...REVEAL} id="contacto">
        <LlegamosDondeEstas />
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

      {/* Espacio para que la tab bar fija de MobileHomeStore no tape el
          footer (2026-09-16, mismo ajuste ya hecho en SupplyPage.jsx). */}
      <div className="h-16 md:hidden bg-white" />

    </main>
  )
}
