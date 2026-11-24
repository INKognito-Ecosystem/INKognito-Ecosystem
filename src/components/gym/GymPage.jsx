import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { FileText, Wrench, Dumbbell, ArrowRight, CheckCircle2, ShieldCheck, Truck, Hammer } from 'lucide-react'
import NavbarGym from './NavbarGym'
import GymMobileNav from './GymMobileNav'
import FooterGym from './FooterGym'
import { GYM_SECCIONES } from '../../data/gymSecciones'

const ogGym = '/og/gym.webp'
const WA = '573207911013'

const GRID_PATTERN = {
  backgroundImage:
    'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px)',
}
const GRID_PATTERN_CLARO = {
  backgroundImage:
    'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(24,24,27,1) 39px,rgba(24,24,27,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(24,24,27,1) 39px,rgba(24,24,27,1) 40px)',
}

const gymJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${import.meta.env.VITE_SITE_URL}/gym#business`,
  "name": "INKognito Gym System",
  "description": "Máquinas de gym construidas con soldadura profesional bajo pedido, tienda INKognito Gym Equipment, planos técnicos descargables, tutoriales y cursos. Envíos a toda Colombia desde Urabá, Antioquia.",
  "url": `${import.meta.env.VITE_SITE_URL}/gym`,
  "email": "soporte@inkognito-ecosystem.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Chigorodó",
    "addressRegion": "Antioquia",
    "addressCountry": "CO"
  },
  "areaServed": "CO",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Equipos y recursos de INKognito Gym System",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Máquinas de gym bajo pedido" } },
      { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Planos técnicos descargables" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Tutoriales de construcción en video" } }
    ]
  }
}

const RIBBON_ITEM = 'flex-shrink-0 text-[13px] font-extrabold text-white/70 pb-1.5 border-b-2 border-transparent whitespace-nowrap'

const PANEL_URL = import.meta.env.VITE_PANEL_URL
const membresiaMsg = `https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero el acceso completo a todos los planos de Gym')}`

export function meta() {
  const title = 'INKognito Gym System | Máquinas Bajo Pedido y Planos Técnicos — Colombia'
  const description = 'Máquinas de gym construidas con soldadura profesional bajo pedido, planos técnicos descargables, tutoriales y recursos en INKognito Gym System. Envíos a toda Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: `${import.meta.env.VITE_SITE_URL}${ogGym}` },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/gym` },
    { 'script:ld+json': gymJsonLd },
  ]
}

const DEFAULT_PLANO_MUESTRAS = [
  { src: '/gym-assets/planos/muestra-1.webp', titulo: 'Prensa Hack 45° — Armado general' },
  { src: '/gym-assets/planos/muestra-2.webp', titulo: 'Jalón Dorsal de Discos — Vistas y 3D' },
  { src: '/gym-assets/planos/muestra-3.webp', titulo: 'Máquina Smith Inclinada — Ensamble general' },
]

export default function GymPage() {
  const [planosModalOpen, setPlanosModalOpen]     = useState(false)
  const [planoActivo, setPlanoActivo]             = useState(0)
  const [historiaModalOpen, setHistoriaModalOpen] = useState(false)
  const [precioPlanos, setPrecioPlanos]           = useState(10000)
  const [planoMuestras, setPlanoMuestras]         = useState(DEFAULT_PLANO_MUESTRAS.map(m => m.src))
  const [creaciones, setCreaciones]               = useState(null)
  const [creacionSeleccionada, setCreacionSeleccionada] = useState(null)
  const [creacionImgActiva, setCreacionImgActiva]       = useState(0)

  useEffect(() => {
    fetch(`${PANEL_URL}/api/visual/gym`)
      .then(r => r.json())
      .then(data => {
        if (data.precio_planos) setPrecioPlanos(Number(data.precio_planos))
        setPlanoMuestras([
          data.gym_plano_muestra_1 || DEFAULT_PLANO_MUESTRAS[0].src,
          data.gym_plano_muestra_2 || DEFAULT_PLANO_MUESTRAS[1].src,
          data.gym_plano_muestra_3 || DEFAULT_PLANO_MUESTRAS[2].src,
        ])
      })
      .catch(() => {})
    fetch(`${PANEL_URL}/api/gym-creaciones`)
      .then(r => r.json())
      .then(setCreaciones)
      .catch(() => setCreaciones([]))
  }, [])

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <NavbarGym />

      {/* CATEGORÍAS — listón móvil */}
      <div className="md:hidden pt-16">
        <div className="flex gap-5 overflow-x-auto px-4 py-3 bg-zinc-700 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="flex-shrink-0 text-[13px] font-extrabold pb-1.5 border-b-2 whitespace-nowrap text-white border-white">
            Todos
          </span>
          {GYM_SECCIONES.map(s => (
            s.scrollTo ? (
              <button
                key={s.titulo}
                type="button"
                onClick={() => scrollToSection(s.scrollTo)}
                className={RIBBON_ITEM}
              >
                {s.titulo}
              </button>
            ) : (
              <Link key={s.titulo} to={s.link} className={RIBBON_ITEM}>
                {s.titulo}
              </Link>
            )
          ))}
        </div>
      </div>

      {/* BANNER MÓVIL */}
      <div className="md:hidden relative overflow-hidden mx-4 mt-4 mb-8 rounded-2xl border border-zinc-400/20 bg-gradient-to-br from-zinc-800 to-zinc-950 px-5 py-6">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={GRID_PATTERN} />
        <Dumbbell
          className="absolute -right-6 top-1/2 text-white/[0.06] pointer-events-none"
          style={{ transform: 'translateY(-50%) rotate(-20deg)' }}
          size={190}
          strokeWidth={1}
        />
        <div className="relative z-10">
          <p className="uppercase tracking-[0.25em] text-zinc-400 text-[10px] font-bold mb-2">
            INKognito Gym System · Colombia
          </p>
          <h1 className="text-2xl font-black uppercase leading-[1.1] mb-2 text-white">
            Tu gym en casa, <span className="inline-block bg-white text-zinc-950 px-1.5 -mx-0.5">a tu medida</span>
          </h1>
          <p className="text-zinc-300 text-xs leading-relaxed mb-5 max-w-[18rem]">
            Máquinas en acero estructural soldadas bajo pedido, planos técnicos en PDF y recursos reales para entrenar fuerte. Envíos a toda Colombia.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/gym/maquinas-pedido" className="px-4 py-2.5 rounded-lg bg-white text-zinc-950 text-[11px] font-black uppercase tracking-[0.1em] whitespace-nowrap">
              Ver máquinas
            </Link>
            <button
              type="button"
              onClick={() => setHistoriaModalOpen(true)}
              className="px-4 py-2.5 rounded-lg border border-white/35 text-white text-[11px] font-bold uppercase tracking-[0.1em] whitespace-nowrap"
            >
              Nuestra historia
            </button>
          </div>
          <p className="mt-5 pt-4 border-t border-white/15 text-zinc-300 text-[11px] italic tracking-wide">
            “Hago arte para no morir, desafío cuerpo y mente.”
          </p>
        </div>
      </div>

      {/* HERO ESCRITORIO — Split editorial de alto impacto */}
      <section className="hidden md:block relative pt-28 pb-16 px-6 overflow-hidden border-b border-zinc-100">
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={GRID_PATTERN_CLARO} />
        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
          {/* Columna izquierda: Titular, propuesta de valor y acciones */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-zinc-900" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-700">
                INKognito Gym System · Fabricación Nacional
              </span>
            </div>

            <h1 className="text-5xl xl:text-6xl font-black uppercase tracking-tight leading-[0.98] text-zinc-950 mb-5">
              Construye tu<br />
              <span className="text-zinc-500">propio gym</span><br />
              desde cero
            </h1>

            <p className="text-zinc-600 text-base lg:text-lg leading-relaxed max-w-xl mb-8">
              Máquinas en acero estructural soldadas bajo pedido en Chigorodó, planos técnicos en PDF y recursos prácticos para entrenar en serio sin depender de equipos importados.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/gym/maquinas-pedido"
                className="inline-flex items-center gap-2 bg-zinc-950 text-white text-xs font-black uppercase tracking-[0.18em] py-4 px-7 rounded-xl hover:bg-zinc-800 transition-all shadow-sm hover:shadow-md"
              >
                Explorar máquinas <ArrowRight size={15} />
              </Link>
              <Link
                to="/gym/inkognito-gym-equipment"
                className="inline-flex items-center gap-2 bg-white border border-zinc-300 text-zinc-900 text-xs font-bold uppercase tracking-[0.18em] py-4 px-6 rounded-xl hover:border-zinc-900 transition-all"
              >
                Tienda oficial
              </Link>
              <button
                type="button"
                onClick={() => setHistoriaModalOpen(true)}
                className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500 hover:text-zinc-950 py-3 px-4 transition-colors cursor-pointer"
              >
                Nuestra historia →
              </button>
            </div>

            <blockquote className="mt-8 pl-4 border-l-2 border-zinc-900 text-zinc-500 text-sm italic">
              “Hago arte para no morir, desafío cuerpo y mente.”
            </blockquote>
          </div>

          {/* Columna derecha: Tarjeta visual de taller y especificaciones clave */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-zinc-950 text-white p-7 border border-zinc-800 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={GRID_PATTERN} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400">
                    INKognito Gym Equipment
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider text-zinc-200">
                    Bajo pedido
                  </span>
                </div>

                <div className="relative rounded-2xl bg-white p-5 mb-5 flex items-center justify-center h-64 overflow-hidden">
                  <img
                    src="/gym-assets/jalones-al-pecho.webp"
                    alt="Máquina de jalones al pecho INKognito Gym System"
                    className="max-h-full w-auto object-contain"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-base font-black text-white leading-none">Cal. 14</p>
                    <p className="text-[11px] text-zinc-400 mt-1">Acero estructural</p>
                  </div>
                  <div>
                    <p className="text-base font-black text-white leading-none">30 días</p>
                    <p className="text-[11px] text-zinc-400 mt-1">Fabricación taller</p>
                  </div>
                  <div>
                    <p className="text-base font-black text-white leading-none">Colombia</p>
                    <p className="text-[11px] text-zinc-400 mt-1">Envío nacional</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORA EL ECOSISTEMA GYM SYSTEM — Grilla limpia 3x2 en escritorio */}
      <section className="hidden md:block py-16 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-400 mb-2">
              Módulos y Recursos
            </p>
            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-zinc-950 leading-none">
              Todo lo que encuentras aquí
            </h2>
          </div>
          <p className="text-zinc-500 text-sm max-w-md leading-relaxed">
            Desde máquinas soldadas a tu medida hasta planos técnicos, tutoriales de taller y suplementación aliada.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GYM_SECCIONES.map((s) => {
            const Icon = s.icon
            const cardClasses =
              'group bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col gap-3 hover:border-zinc-900 hover:shadow-lg transition-all duration-300 text-left w-full cursor-pointer'
            const inner = (
              <>
                <div className="flex items-center justify-between">
                  {Icon && (
                    <div className="w-11 h-11 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:bg-zinc-950 group-hover:border-zinc-950 transition-colors duration-300">
                      <Icon size={20} className="text-zinc-700 group-hover:text-white transition-colors duration-300" />
                    </div>
                  )}
                  <ArrowRight
                    size={16}
                    className="text-zinc-300 group-hover:text-zinc-950 group-hover:translate-x-1 transition-all duration-300"
                  />
                </div>
                <h3 className="text-base font-black uppercase tracking-tight text-zinc-950 mt-1">
                  {s.titulo}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500 flex-1">
                  {s.texto}
                </p>
              </>
            )
            return s.scrollTo ? (
              <button key={s.titulo} type="button" onClick={() => scrollToSection(s.scrollTo)} className={cardClasses}>
                {inner}
              </button>
            ) : (
              <Link key={s.titulo} to={s.link} className={cardClasses}>
                {inner}
              </Link>
            )
          })}
        </div>
      </section>

      {/* PLANOS DIGITALES — Tarjeta editorial de ancho completo */}
      <section id="planos" className="pb-12 md:py-14 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="border-t border-zinc-200 pt-8 md:pt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-7">
            <div>
              <p className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-400 mb-1.5">
                Fabricación Propia · PDF
              </p>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-none text-zinc-950">
                  Planos digitales
                </h2>
                <FileText size={22} className="text-zinc-300 flex-shrink-0 md:hidden" strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-zinc-500 text-sm max-w-lg leading-relaxed">
              Planos técnicos en PDF con medidas exactas y lista de materiales para fabricar tus máquinas en casa o iniciar tu propio taller.
            </p>
          </div>

          <div className="group relative border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 rounded-3xl p-6 sm:p-8 md:p-11 overflow-hidden shadow-xl">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={GRID_PATTERN} />
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/[0.06] pointer-events-none" />

            <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.22em] bg-white text-zinc-950 rounded-full px-3 py-1 mb-4">
                  <FileText size={12} /> Acceso total · Pago único
                </span>
                <h3 className="text-2xl md:text-4xl font-black uppercase leading-tight mb-3 text-white">
                  Membresía de por vida
                </h3>
                <p className="text-zinc-300 leading-relaxed text-sm md:text-base mb-5 max-w-xl">
                  Paga una sola vez y accede de inmediato a toda la biblioteca de planos disponibles, incluyendo los nuevos diseños que agreguemos al catálogo.
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-300">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-white" /> Medidas exactas en PDF
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-white" /> Lista de materiales
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-white" /> Actualizaciones incluidas
                  </span>
                </div>
              </div>

              <div className="md:col-span-5 md:border-l md:border-white/10 md:pl-8 flex flex-col gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 mb-1">Inversión única</p>
                  <span className="text-3xl md:text-4xl font-black text-white">
                    ${precioPlanos.toLocaleString('es-CO')} <span className="text-sm font-bold text-zinc-400">COP</span>
                  </span>
                </div>
                <a
                  href={membresiaMsg}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white text-zinc-950 font-black uppercase tracking-[0.15em] text-xs py-3.5 px-6 rounded-xl hover:bg-zinc-200 transition-all"
                >
                  Obtener acceso completo <ArrowRight size={14} />
                </a>
                <button
                  type="button"
                  onClick={() => setPlanosModalOpen(true)}
                  className="border border-white/25 text-zinc-100 font-bold uppercase tracking-[0.15em] text-xs py-3.5 px-6 rounded-xl hover:border-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  Ver muestra de planos
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MIS CREACIONES — Portafolio real */}
      <section className="pb-12 md:py-14 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="border-t border-zinc-200 pt-8 md:pt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-7">
            <div>
              <p className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-400 mb-1.5">
                Portafolio de Taller
              </p>
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-none text-zinc-950">
                Mis creaciones
              </h2>
            </div>
            <p className="text-zinc-500 text-sm max-w-lg leading-relaxed">
              Equipos construidos con soldadura profesional y acero calibre grueso, probados en entrenamiento real diario.
            </p>
          </div>

          {creaciones?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
              {creaciones.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    const abre = c.descripcion || (c.image_urls?.length > 1)
                    if (!abre) return
                    setCreacionImgActiva(0)
                    setCreacionSeleccionada(c)
                  }}
                  className={`group relative aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 text-left shadow-sm hover:shadow-md transition-all ${(c.descripcion || c.image_urls?.length > 1) ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <img
                    src={c.image_url}
                    alt={c.titulo || 'Máquina construida por INKognito Gym System'}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {(c.titulo || c.categoria) && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3.5 py-3">
                      {c.titulo && <p className="text-white text-xs md:text-sm font-bold leading-tight">{c.titulo}</p>}
                      {c.categoria && <p className="text-zinc-300 text-[10px] uppercase tracking-wider mt-0.5">{c.categoria}</p>}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="border border-zinc-200 bg-zinc-50 rounded-2xl py-16 text-center">
              <p className="text-zinc-500 uppercase tracking-[0.25em] text-xs font-bold mb-1">Portafolio en carga</p>
              <p className="text-zinc-400 text-sm">Estamos cargando las fotografías de máquinas fabricadas en taller.</p>
            </div>
          )}
        </div>
      </section>

      {/* FABRICACIÓN A MEDIDA + CONTACTO — Bloque único sin redundancia */}
      <section className="pb-14 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="border-t border-zinc-200 pt-8 md:pt-12">
          <div className="group relative overflow-hidden bg-zinc-950 border border-zinc-800 rounded-3xl p-7 sm:p-10 md:p-14 shadow-2xl">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={GRID_PATTERN} />
            <div className="absolute -bottom-16 -right-16 w-60 h-60 rounded-full bg-white/[0.06] pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 text-zinc-400 text-[11px] font-mono font-bold uppercase tracking-[0.25em] mb-3">
                  <Wrench size={14} /> Fabricación Bajo Pedido · Chigorodó, Urabá
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.98] mb-4 text-white">
                  ¿Tienes una máquina <span className="text-zinc-400">en mente?</span>
                </h2>
                <p className="text-zinc-300 leading-relaxed text-sm md:text-base max-w-xl mb-6">
                  Fabricamos equipos a tu medida con soldadura profesional, sin intermediarios y con despacho a toda Colombia. Elige acabado en pintura negra o gris y tubo para discos estándar o olímpicos.
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-zinc-200">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
                    <Hammer size={12} /> Soldadura profesional
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
                    <ShieldCheck size={12} /> Pintura Negro / Gris
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
                    <Truck size={12} /> Envíos a toda Colombia
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-3">
                <Link
                  to="/gym/maquinas-pedido"
                  className="inline-flex items-center justify-center gap-2 bg-white text-zinc-950 font-black uppercase tracking-[0.18em] text-xs py-4 px-8 rounded-xl hover:bg-zinc-200 transition-all"
                >
                  Ver catálogo de máquinas <ArrowRight size={15} />
                </Link>
                <a
                  href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola, me interesa cotizar una máquina de gym a medida')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border border-white/25 text-white font-bold uppercase tracking-[0.18em] text-xs py-4 px-8 rounded-xl hover:border-white hover:bg-white/10 transition-all"
                >
                  Cotizar máquina personalizada
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterGym />
      <div className="h-16 md:hidden" />
      <GymMobileNav active="inicio" />

      {/* MODAL NUESTRA HISTORIA */}
      {historiaModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setHistoriaModalOpen(false)}
        >
          <div
            className="relative bg-white border border-zinc-200 rounded-2xl w-full max-w-xl mx-auto my-auto p-8 md:p-10 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setHistoriaModalOpen(false)}
              aria-label="Cerrar"
              className="absolute top-5 right-6 text-zinc-500 hover:text-zinc-900 text-2xl leading-none bg-transparent border-none cursor-pointer"
            >✕</button>

            <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs mb-6">Nuestra historia</p>

            <p className="text-zinc-900 text-base md:text-lg font-bold leading-relaxed mb-6 italic">
              &ldquo;Empecé como cualquiera: queriendo entrenar, sin poder pagar un gimnasio.&rdquo;
            </p>

            <p className="text-zinc-600 text-sm leading-relaxed mb-5">
              No tenía el dinero para una membresía mensual, ni para comprar máquinas comerciales que cuestan millones. Así que hice lo que sabía hacer: aprendí a soldar, conseguí una pulidora, y empecé a construir mis propias herramientas — primero mancuernas de cemento, después discos, y con el tiempo, máquinas completas.
            </p>

            <p className="text-zinc-600 text-sm leading-relaxed mb-5">
              Hoy entreno en mi propio gym, hecho con mis manos, en Chigorodó. Y me di cuenta de algo: si yo lo necesitaba, seguro hay muchas personas en Urabá y en toda Colombia que también quieren entrenar fuerte, sin gastar lo que cuesta un gimnasio comercial o una máquina importada.
            </p>

            <p className="text-zinc-600 text-sm leading-relaxed mb-5">
              Por eso fabrico estas máquinas — con la misma calidad y resistencia que uso yo mismo todos los días, pero a un precio que tenga sentido para la gente real. No es un negocio que inventé desde un escritorio — es algo que vivo, que uso, y que sé que funciona.
            </p>

            <p className="text-zinc-600 text-sm leading-relaxed mb-8">
              Si tú también quieres construirte a ti mismo, sin importar dónde empiezas, aquí tienes una alternativa real.
            </p>

            <p className="text-zinc-900 font-black uppercase tracking-[0.15em] text-sm">— Jose</p>
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE CREACIÓN */}
      {creacionSeleccionada && (
        <div
          className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setCreacionSeleccionada(null)}
        >
          <div
            className="relative bg-white border border-zinc-200 rounded-2xl w-full max-w-xl mx-auto my-auto overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setCreacionSeleccionada(null)}
              aria-label="Cerrar"
              className="absolute top-4 right-5 text-white/70 hover:text-white text-2xl leading-none bg-black/40 rounded-full w-8 h-8 flex items-center justify-center border-none cursor-pointer z-10"
            >✕</button>
            <img
              src={creacionSeleccionada.image_urls?.[creacionImgActiva] || creacionSeleccionada.image_url}
              alt={creacionSeleccionada.titulo || 'Máquina construida por INKognito Gym System'}
              className="w-full max-h-[45vh] object-cover"
            />
            {creacionSeleccionada.image_urls?.length > 1 && (
              <div className="flex gap-2 p-3 bg-white">
                {creacionSeleccionada.image_urls.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCreacionImgActiva(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 ${i === creacionImgActiva ? 'border-zinc-900' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="p-6 md:p-8">
              {creacionSeleccionada.categoria && (
                <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs mb-2">{creacionSeleccionada.categoria}</p>
              )}
              {creacionSeleccionada.titulo && (
                <h3 className="text-zinc-900 text-xl md:text-2xl font-black uppercase leading-tight mb-4">{creacionSeleccionada.titulo}</h3>
              )}
              <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-line">{creacionSeleccionada.descripcion}</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MUESTRA PLANOS */}
      {planosModalOpen && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[80] flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setPlanosModalOpen(false)}
        >
          <div
            className="relative bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-5xl mx-auto p-5 md:p-7 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-400">
                  Muestra real · Planos PDF
                </p>
                <h3 className="text-white text-lg md:text-2xl font-black uppercase tracking-tight mt-1">
                  {DEFAULT_PLANO_MUESTRAS[planoActivo]?.titulo || `Muestra plano ${planoActivo + 1}`}
                </h3>
              </div>
              <button
                type="button"
                className="text-zinc-400 hover:text-white text-2xl leading-none bg-zinc-900 hover:bg-zinc-800 w-9 h-9 rounded-full flex items-center justify-center border border-zinc-800 cursor-pointer shrink-0"
                onClick={() => setPlanosModalOpen(false)}
                aria-label="Cerrar"
              >✕</button>
            </div>

            {/* Plano seleccionado en grande */}
            <div className="bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center">
              <img
                src={planoMuestras[planoActivo] || DEFAULT_PLANO_MUESTRAS[planoActivo].src}
                alt={DEFAULT_PLANO_MUESTRAS[planoActivo]?.titulo || `Muestra plano ${planoActivo + 1}`}
                className="w-full max-h-[60vh] object-contain"
              />
            </div>

            {/* Selector de las 3 muestras + CTA */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="grid grid-cols-3 gap-2.5 sm:max-w-md w-full">
                {planoMuestras.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPlanoActivo(i)}
                    className={`group relative rounded-xl overflow-hidden border-2 bg-zinc-100 aspect-[4/3] transition-all cursor-pointer ${
                      i === planoActivo ? 'border-white ring-2 ring-white/20' : 'border-zinc-700 opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={src || DEFAULT_PLANO_MUESTRAS[i].src}
                      alt={DEFAULT_PLANO_MUESTRAS[i]?.titulo || `Muestra ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                      0{i + 1}
                    </span>
                  </button>
                ))}
              </div>

              <a
                href={membresiaMsg}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-zinc-950 font-black uppercase tracking-[0.15em] text-xs py-3.5 px-6 rounded-xl hover:bg-zinc-200 transition-all shrink-0"
              >
                Obtener acceso (${precioPlanos.toLocaleString('es-CO')}) <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
