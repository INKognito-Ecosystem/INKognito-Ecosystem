import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, PlayCircle, FileText, FlaskConical } from 'lucide-react'
import NavbarGym from './NavbarGym'
import FooterGym from './FooterGym'
import Seo from '../Seo'
import { creaciones, maquinasDestacadas } from '../../data/gym'

const ogGym = '/og/gym.webp'
const WA = '573207911013'

const GRID_PATTERN = {
  backgroundImage:
    'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px)',
}

const gymJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${import.meta.env.VITE_SITE_URL}/gym#business`,
  "name": "INKognito Gym",
  "description": "Máquinas de gym construidas con soldadura profesional. Planos técnicos descargables. Tutoriales y cursos de entrenamiento. Envíos a toda Colombia desde Urabá, Antioquia.",
  "url": `${import.meta.env.VITE_SITE_URL}/gym`,
  "telephone": "+57-320-791-1013",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Chigorodó",
    "addressRegion": "Antioquia",
    "addressCountry": "CO"
  },
  "areaServed": "CO",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Equipos y recursos para gym casero",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Máquinas de gym bajo pedido" } },
      { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Planos técnicos descargables" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Tutoriales de construcción en video" } }
    ]
  }
}

const servicios = [
  {
    icon: FileText,
    titulo: 'Planos Digitales',
    descripcion: 'Planos técnicos en PDF para fabricar tus propias máquinas de gym.',
    scrollTo: 'planos',
  },
  {
    icon: FlaskConical,
    titulo: 'Suplementos',
    descripcion: 'Proteína, creatina, pre-entreno y vitaminas para potenciar tu entrenamiento.',
    link: '/gym/suplementos',
  },
  {
    icon: PlayCircle,
    titulo: 'Tutoriales en video',
    descripcion: 'Videos paso a paso de cómo construir mancuernas, discos y máquinas caseras.',
    link: '/gym/tutoriales',
  },
  {
    icon: GraduationCap,
    titulo: 'Cursos recomendados',
    descripcion: 'Los mejores cursos de entrenamiento, nutrición y fabricación en español.',
    link: '/gym/cursos',
  },
]

const CARD_CLASS = 'border border-gray-800 bg-gray-900/60 rounded-2xl p-6 flex flex-col gap-4 hover:border-gray-600 hover:bg-gray-900/80 transition-all duration-300 group'

const membresiaMsg = `https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero el acceso completo a todos los planos de Gym')}`

// Imágenes de muestra del plano (reemplazar con URLs reales cuando estén listas)
const PLANO_MUESTRAS = [null, null, null]

export default function GymPage() {
  const [planosModalOpen, setPlanosModalOpen] = useState(false)

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="INKognito Gym | Máquinas de Gym con Soldadura Profesional y Planos Técnicos — Colombia"
        description="Máquinas de gym construidas con soldadura profesional. Planos técnicos descargables. Envíos a toda Colombia desde Urabá, Antioquia."
        image={ogGym}
        siteName="INKognito Gym"
        canonical={`${import.meta.env.VITE_SITE_URL}/gym`}
        jsonLd={gymJsonLd}
      />

      <NavbarGym />

      {/* HERO */}
      <section className="relative pt-20 md:pt-28 pb-24 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900" />
        <div className="absolute inset-0 opacity-[0.04]" style={GRID_PATTERN} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <p className="uppercase tracking-[0.25em] text-gray-500 text-xs md:text-sm mb-4">
            Gym casero — Urabá, Colombia
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-none mb-6">
            Construí mi<br />
            <span className="text-gray-400">propio gym</span><br />
            desde cero
          </h1>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
            Máquinas fabricadas a mano, planos digitales y recursos para entrenar en casa sin gastar una fortuna.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/gym/maquinas-pedido"
              className="inline-block text-center bg-gray-400 text-gray-900 text-sm font-black uppercase tracking-[0.2em] py-4 px-8 rounded hover:bg-white transition-all duration-300"
            >
              Ver máquinas y planos
            </Link>
          </div>
        </div>
      </section>

      {/* LO QUE PUEDES CONSEGUIR AQUÍ */}
      <section className="pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="border-t border-gray-800 pt-16">
          <p className="uppercase tracking-[0.25em] text-gray-500 text-xs md:text-sm mb-3">Servicios</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase leading-none mb-12">
            Lo que puedes conseguir aquí
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {servicios.map((s) => {
              const Icon = s.icon
              const inner = (
                <>
                  {Icon && <Icon size={28} className="text-gray-400 group-hover:text-white transition-colors duration-300" />}
                  <h3 className="text-base font-black uppercase tracking-wide leading-tight">{s.titulo}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{s.descripcion}</p>
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] group-hover:text-gray-300 transition-colors duration-300">
                    Ver más →
                  </span>
                </>
              )
              return s.scrollTo
                ? (
                    <button
                      key={s.titulo}
                      onClick={() => scrollToSection(s.scrollTo)}
                      className={`${CARD_CLASS} text-left w-full`}
                    >
                      {inner}
                    </button>
                  )
                : (
                    <Link key={s.titulo} to={s.link} className={CARD_CLASS}>
                      {inner}
                    </Link>
                  )
            })}
          </div>
        </div>
      </section>

      {/* PLANOS DIGITALES */}
      <section id="planos" className="pb-20 px-4 md:px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="border-t border-gray-800 pt-16">
          <p className="uppercase tracking-[0.25em] text-gray-500 text-xs md:text-sm mb-3">Descarga digital</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase leading-none mb-6">Planos digitales</h2>
          <p className="text-gray-400 leading-relaxed max-w-2xl mb-12 text-sm md:text-base">
            Son planos técnicos completos en formato PDF, con medidas exactas y lista de materiales necesarios para construir cada equipo. Pensados para quien quiere fabricar sus propias máquinas de gym en casa — ya sea para uso personal o para empezar su propio negocio de fabricación de equipos fitness.
          </p>

          {/* CARD MEMBRESÍA */}
          <div className="relative border border-gray-400/40 bg-gray-900 rounded-2xl p-8 md:p-10 overflow-hidden max-w-3xl">
            <div className="absolute inset-0 opacity-[0.025]" style={GRID_PATTERN} />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] bg-white text-gray-950 rounded-full px-3 py-1 mb-4">
                  Acceso total
                </span>
                <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight mb-3">
                  Membresía de por vida
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                  Paga una sola vez y obtén acceso a todos los planos disponibles, incluyendo los que se agreguen en el futuro.
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                <span className="text-3xl font-black text-white">$XX.000 COP</span>
                <a
                  href={membresiaMsg}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-gray-950 font-black uppercase tracking-[0.15em] text-xs py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  Obtener acceso completo
                </a>
                <button
                  onClick={() => setPlanosModalOpen(true)}
                  className="border border-gray-600 text-gray-400 font-bold uppercase tracking-[0.15em] text-xs py-3 px-6 rounded-xl hover:border-gray-300 hover:text-white transition-all duration-300"
                >
                  Ver muestra
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MIS CREACIONES */}
      <section className="pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="border-t border-gray-800 pt-16">
          <p className="uppercase tracking-[0.25em] text-gray-500 text-xs md:text-sm mb-3">Portafolio</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase leading-none mb-12">Mis creaciones</h2>

          {creaciones.length === 0 ? (
            <div className="border border-gray-800 bg-gray-900/30 rounded-2xl py-20 text-center">
              <p className="text-gray-500 uppercase tracking-[0.25em] text-sm mb-2">Próximamente</p>
              <p className="text-gray-600 text-sm">Estamos cargando el portafolio de máquinas</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {creaciones.map((item) => (
                <div key={item.name} className="border border-gray-800 bg-gray-900 rounded-xl overflow-hidden">
                  <div className="aspect-video bg-gray-700 flex items-center justify-center">
                    {item.video ? (
                      <iframe
                        src={item.video}
                        title={item.name}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <span className="text-gray-600 text-xs uppercase tracking-widest text-center px-3">Imagen próximamente</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-black uppercase text-xs leading-tight mb-1">{item.name}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MÁQUINAS BAJO PEDIDO + CONTACTO — UNIFICADO */}
      <section className="pb-24 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="border-t border-gray-800 pt-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="uppercase tracking-[0.25em] text-gray-500 text-xs md:text-sm mb-3">Soldadura profesional</p>
              <h2 className="text-3xl md:text-5xl font-black uppercase leading-none">Máquinas bajo pedido</h2>
            </div>
            <Link
              to="/gym/maquinas-pedido"
              className="hidden md:block text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white border border-gray-700 hover:border-gray-400 px-5 py-3 rounded transition-all duration-300"
            >
              Ver catálogo →
            </Link>
          </div>

          <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-8 md:p-14 hover:border-gray-600 transition-all duration-300">
            <p className="uppercase tracking-[0.25em] text-gray-500 text-xs mb-4">Contacto directo</p>
            <h3 className="text-2xl md:text-4xl font-black uppercase leading-none mb-4">
              ¿Tienes alguna<br />
              <span className="text-gray-400">idea en mente?</span>
            </h3>
            <p className="text-gray-300 leading-relaxed text-base max-w-2xl mb-8">
              Fabrico máquinas de gym a tu medida, con soldadura profesional y a precios muy accesibles. ¿Tienes alguna idea en mente? Cuéntanos qué máquina necesitas y te damos un presupuesto personalizado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola, me interesa una máquina de gym personalizada')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-center bg-white text-gray-950 font-black uppercase tracking-[0.2em] text-sm py-4 px-10 rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                Escríbenos por WhatsApp
              </a>
              <Link
                to="/gym/maquinas-pedido"
                className="inline-block text-center border border-gray-700 text-gray-400 font-bold uppercase tracking-[0.2em] text-sm py-4 px-8 rounded-xl hover:border-gray-400 hover:text-white transition-all duration-300"
              >
                Ver catálogo completo →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FooterGym />

      {/* MODAL MUESTRA PLANOS */}
      {planosModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-[80] flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setPlanosModalOpen(false)}
        >
          <button
            className="absolute top-5 right-6 text-white/60 hover:text-white text-3xl leading-none bg-transparent border-none cursor-pointer z-10"
            onClick={() => setPlanosModalOpen(false)}
            aria-label="Cerrar"
          >✕</button>
          <div
            className="flex flex-col md:flex-row gap-4 max-w-4xl w-full"
            onClick={e => e.stopPropagation()}
          >
            {PLANO_MUESTRAS.map((src, i) => (
              src
                ? <img key={i} src={src} alt={`Muestra plano ${i + 1}`} className="rounded-xl object-contain max-h-[70vh] flex-1" />
                : (
                    <div key={i} className="flex-1 aspect-video bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center min-h-[140px]">
                      <span className="text-gray-600 text-xs uppercase tracking-widest text-center px-4">Imagen próximamente</span>
                    </div>
                  )
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
