import { Link } from 'react-router-dom'
import { STORE_HOURS } from '../../config/business'
import { FaWhatsapp } from 'react-icons/fa'
import { Truck, Shield, Clock, Star, Award, Shirt, Footprints, Sun, Trophy, Zap } from 'lucide-react'
import NavbarStore from './NavbarStore'
import FooterStore from './FooterStore'
import StoreProductCard from './StoreProductCard'
import Seo from '../Seo'
import { useCatalog, toProdCard } from '../../hooks/useCatalog'
const ogStore = '/og/store.webp'

const categories = [
  {
    id: 1,
    name: 'Ropa Dama',
    tag: 'Deportiva Femenina',
    description: 'Sets, leggings, tops y conjuntos para mujer activa. Gym, running, yoga y ciclismo.',
    link: '/store/ropa-dama',
    icon: <Shirt size={28} />,
  },
  {
    id: 2,
    name: 'Ropa Caballeros',
    tag: 'Deportiva Masculina',
    description: 'Shorts, camisetas, joggers y conjuntos para hombre activo. Desde el gym hasta la calle.',
    link: '/store/ropa-caballeros',
    icon: <Shirt size={28} />,
  },
  {
    id: 3,
    name: 'Zapatos Deportivos',
    tag: 'Running & Gym',
    description: 'Para correr, entrenar y rendir. Las siluetas más buscadas en el mercado, a tu alcance.',
    link: '/store/zapatos-deportivos',
    icon: <Footprints size={28} />,
  },
  {
    id: 4,
    name: 'Zapatos Casuales',
    tag: 'Estilo Urbano',
    description: 'Cómodos, frescos y con actitud. Los modelos icónicos para el día a día en Urabá.',
    link: '/store/zapatos-casuales',
    icon: <Sun size={28} />,
  },
  {
    id: 5,
    name: 'Guayos',
    tag: 'Fútbol',
    description: 'Para dominar el balón desde Chigorodó hasta Turbo. Tracción, control y poder.',
    link: '/store/guayos',
    icon: <Trophy size={28} />,
  },
  {
    id: 6,
    name: 'Tenis Guayo',
    tag: 'Multisuperficie',
    description: 'Versatilidad total. Canchita de sintético, polvo de ladrillo y calle sin cambiar de par.',
    link: '/store/tenis-guayo',
    icon: <Zap size={28} />,
  },
]

const SHOE_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44']
const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const cities = [
  { name: 'Chigorodó', time: '1–2 días' },
  { name: 'Carepa', time: '1–2 días' },
  { name: 'Apartadó', time: '1–2 días' },
  { name: 'Turbo', time: '2–3 días' },
  { name: 'Mutatá', time: '2–3 días' },
  { name: 'Arboletes', time: '3–4 días' },
]

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

const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  "@id": `${import.meta.env.VITE_SITE_URL}/store#business`,
  "name": "INKognito Store",
  "description": "Tienda de ropa deportiva, zapatos y guayos en Urabá, Antioquia. Nike, Adidas, Puma y más. Chigorodó, Apartadó, Turbo, Carepa. Envío regional.",
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

export default function StorePage() {
  const { allProducts: featuredItems, loading: featuredLoading } = useCatalog('store', 'Destacados')

  return (
    <main className="bg-white text-gray-900">

      <Seo
        title="INKognito Store | Ropa y zapatos deportivos en Urabá"
        description="Ropa deportiva para dama y caballero, zapatos deportivos, casuales y guayos en Chigorodó y el Urabá antioqueño. Pide por WhatsApp con entrega en la región."
        image={ogStore}
        canonical={`${import.meta.env.VITE_SITE_URL}/store`}
        jsonLd={storeJsonLd}
      />

      <NavbarStore />

      {/* ── HERO ── */}
      <section className="relative min-h-[65vh] md:min-h-screen flex flex-col justify-start overflow-hidden pt-16 bg-gray-50">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 15% 50%, rgba(201,168,76,0.10) 0%, transparent 55%), radial-gradient(ellipse at 85% 15%, rgba(201,168,76,0.06) 0%, transparent 50%)',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/25 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-4 pb-8 md:pt-8 md:pb-12 text-center">
          <p className="uppercase tracking-[0.4em] text-[#C9A84C] text-xs md:text-sm mb-4 md:mb-6 font-semibold">
            INKognito Store — Urabá, Antioquia
          </p>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black uppercase leading-[0.9] mb-6 md:mb-8">
            <span className="block text-gray-900">Ropa &</span>
            <span className="block text-[#C9A84C]">Calzado</span>
            <span className="block text-gray-900">Para Urabá</span>
          </h1>

          <p className="text-gray-700 text-base md:text-xl leading-relaxed max-w-2xl mx-auto mb-8 md:mb-12">
            Calidad premium, precio accesible. Diseños inspirados en las mejores marcas,
            fabricados para el ritmo de Urabá.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
          <div className="mt-8 md:mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto">
            <div className="text-center">
              <p className="text-3xl md:text-5xl font-black text-[#C9A84C]">4</p>
              <p className="text-gray-600 uppercase tracking-[0.2em] text-[10px] md:text-xs mt-1">Municipios</p>
            </div>
            <div className="text-center border-x border-gray-300">
              <p className="text-3xl md:text-5xl font-black text-[#C9A84C]">6</p>
              <p className="text-gray-600 uppercase tracking-[0.2em] text-[10px] md:text-xs mt-1">Categorías</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-5xl font-black text-[#C9A84C]">100%</p>
              <p className="text-gray-600 uppercase tracking-[0.2em] text-[10px] md:text-xs mt-1">Calidad</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORÍAS ── */}
      <section id="categorias" className="bg-gray-50 pt-3 md:pt-6 pb-8 md:pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 md:mb-8">
            <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-xs mb-2">
              Catálogo
            </p>
            <h2 className="text-2xl md:text-4xl font-black uppercase leading-none text-gray-900">
              Nuestras Categorías
            </h2>
          </div>

          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.link}
                className="group snap-start flex-shrink-0 w-[75vw] md:w-auto bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#C9A84C] hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[160px] md:min-h-[220px]"
              >
                <div>
                  <div className="mb-3 text-[#C9A84C]">{cat.icon}</div>
                  <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-[10px] mb-2 font-semibold">
                    {cat.tag}
                  </p>
                  <h3 className="text-xl md:text-3xl font-black uppercase mb-2 text-gray-900 group-hover:text-[#C9A84C] transition-colors duration-300">
                    {cat.name}
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-4 md:mt-6">
                  <span className="uppercase tracking-[0.2em] text-xs text-gray-400 group-hover:text-[#C9A84C] transition-colors duration-300">
                    Ver categoría →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTACADOS ── */}
      <section id="destacados" className="bg-white pt-3 md:pt-6 pb-8 md:pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 md:mb-8">
            <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-xs mb-2">
              Selección
            </p>
            <h2 className="text-2xl md:text-4xl font-black uppercase leading-none text-gray-900">
              Destacados
            </h2>
          </div>

          {featuredLoading ? (
            <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="snap-start flex-shrink-0 w-[44vw] md:w-auto bg-gray-200 rounded-xl animate-pulse aspect-[3/4]" />
              ))}
            </div>
          ) : featuredItems.length === 0 ? (
            <div className="border border-gray-200 rounded-xl py-10 text-center">
              <p className="text-gray-400 text-sm mb-1">Selección en preparación</p>
              <p className="text-gray-500 text-xs">Agrega productos con categoría "Destacados" desde el panel</p>
            </div>
          ) : (
            <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
              {featuredItems.map(item => {
                const prod = toProdCard(item)
                const sizes = item.variantes.map(v => v.variant).filter(Boolean)
                const isClothing = item.descripcion?.toLowerCase().includes('ropa') || item.name?.toLowerCase().includes('ropa')
                return (
                  <div key={item.name} className="snap-start flex-shrink-0 w-[44vw] md:w-auto">
                    <StoreProductCard
                      product={prod}
                      category="destacados"
                      sizes={sizes.length ? sizes : (isClothing ? CLOTHING_SIZES : SHOE_SIZES)}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── LOGÍSTICA + GARANTÍAS + CONTACTO — solo desktop (dark, 3 col) ── */}
      <div className="hidden md:block">
        <section className="bg-black text-white py-14 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">

              {/* COL 1: LOGÍSTICA */}
              <div>
                <p className="uppercase tracking-[0.25em] text-[#C9A84C]/70 text-[10px] mb-4">Logística · Cobertura</p>
                <h2 className="text-3xl font-black uppercase leading-none mb-6 text-white">Llegamos donde estás</h2>
                <div className="flex gap-3 mb-6">
                  <div className="flex items-center justify-center bg-white rounded-xl p-2 flex-shrink-0 w-14 h-14">
                    <img src="/eljach.png" alt="Eljach" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col justify-center bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 flex-1">
                    <p className="text-white text-sm font-bold uppercase tracking-wide leading-tight">Eljach Transportadora</p>
                    <p className="text-zinc-500 text-xs mt-0.5">Entregas locales y contra entrega</p>
                  </div>
                </div>
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-3">Zonas de cobertura</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {['Chigorodó','Carepa','Apartadó','Turbo','Currulao','El Tres','Coldesa','Río Grande','El Reposo','Casa Verde'].map(z => (
                    <span key={z} className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] bg-[#C9A84C]/5">{z}</span>
                  ))}
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                  <p className="text-xs text-zinc-500">
                    Flete desde <span className="text-[#C9A84C] font-bold">$8.000</span>
                    {' '}· Gratis en compras +<span className="text-[#C9A84C] font-bold"> $300.000</span>
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

              {/* COL 3: CONTACTO */}
              <div>
                <p className="uppercase tracking-[0.25em] text-[#C9A84C]/70 text-[10px] mb-4">Contacto</p>
                <h2 className="text-3xl font-black uppercase leading-none mb-6 text-white">Hablemos</h2>
                <p className="text-zinc-400 text-base leading-relaxed mb-7">
                  ¿Buscas un modelo específico? ¿Quieres saber disponibilidad de tu talla?
                  Escríbenos y te respondemos en minutos.
                </p>
                <a
                  href="https://wa.me/573207911013?text=Hola,%20quiero%20información%20sobre%20INKognito%20Store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl border text-white uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.2)] hover:border-[#C9A84C] mb-5"
                  style={{ borderColor: 'rgba(201,168,76,0.3)', backgroundColor: 'rgba(201,168,76,0.04)' }}
                >
                  <FaWhatsapp size={22} />
                  Hablar con INKognito Store
                </a>
                <p className="text-zinc-600 uppercase tracking-[0.2em] text-xs mb-6">
                  {STORE_HOURS.weekdays.label} · {STORE_HOURS.weekdays.hours}
                </p>
                <div className="flex flex-col gap-3">
                  {['Réplicas premium de alta calidad','Cobertura en toda la región de Urabá','Atención personalizada por WhatsApp','Cambios de talla garantizados','Pago contraentrega disponible'].map(item => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="text-[#C9A84C] text-sm flex-shrink-0">✓</span>
                      <span className="text-zinc-400 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>

      {/* ── LLEGAMOS DONDE ESTÁS — solo móvil ── */}
      <section id="contacto" className="md:hidden bg-black text-white border-t border-zinc-900 px-6 py-8">
        <h2 className="text-2xl font-black uppercase leading-none mb-3 text-white">Llegamos donde estás</h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-5">
          Contamos con transportadora aliada para entregas seguras y con pago contraentrega en toda la región de Urabá.
        </p>
        <div className="flex gap-2 mb-5">
          <div className="flex items-center justify-center bg-white rounded-xl p-1 flex-shrink-0 aspect-square w-16">
            <img src="/eljach.png" alt="Eljach" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col justify-center bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 flex-1">
            <p className="text-white text-xs font-bold uppercase tracking-wide leading-tight">Eljach Transportadora</p>
            <p className="text-zinc-500 text-[10px] mt-0.5">Entregas locales y contra entrega</p>
          </div>
        </div>
        {/* Ciudades */}
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-2">Zonas de cobertura</p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Chigorodó','Carepa','Apartadó','Turbo','Currulao','El Tres','Coldesa','Río Grande','El Reposo','Casa Verde'].map(c => (
            <span key={c} className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] bg-[#C9A84C]/5">{c}</span>
          ))}
        </div>

        {/* Garantías */}
        <div className="flex flex-col gap-2 mb-5">
          {['Pago contraentrega disponible','Atención personalizada por WhatsApp','Cobertura en toda la región de Urabá'].map(g => (
            <div key={g} className="flex items-center gap-2">
              <span className="font-bold text-sm" style={{ color: '#C9A84C' }}>✓</span>
              <span className="text-zinc-400 text-xs">{g}</span>
            </div>
          ))}
        </div>
        <a
          href="https://wa.me/573207911013?text=Hola%2C%20quiero%20hacer%20un%20pedido%20en%20INKognito%20Store"
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border text-white font-bold uppercase tracking-[0.15em] text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]"
          style={{ borderColor: 'rgba(201,168,76,0.4)', backgroundColor: 'rgba(201,168,76,0.04)' }}
        >
          📱 Hacer mi pedido ahora
        </a>
      </section>

      <FooterStore />

    </main>
  )
}
