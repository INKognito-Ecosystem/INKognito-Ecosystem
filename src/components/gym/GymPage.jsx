import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, PlayCircle, FileText, FlaskConical, Wrench, BookOpen } from 'lucide-react'
import NavbarGym from './NavbarGym'
import FooterGym from './FooterGym'
import Seo from '../Seo'

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
    icon: Wrench,
    titulo: 'Máquinas',
    texto: 'Acero, soldadura profesional, a tu medida.',
    link: '/gym/maquinas-pedido',
  },
  {
    icon: FileText,
    titulo: 'Planos PDF',
    texto: 'Medidas exactas para fabricarlas tú mismo.',
    scrollTo: 'planos',
  },
  {
    icon: FlaskConical,
    titulo: 'Suplementos',
    texto: 'Proteína, creatina y pre-entreno.',
    link: '/gym/suplementos',
  },
  {
    icon: PlayCircle,
    titulo: 'Tutoriales',
    texto: 'Construye máquinas caseras paso a paso.',
    link: '/gym/tutoriales',
  },
  {
    icon: GraduationCap,
    titulo: 'Cursos',
    texto: 'Entrenamiento y nutrición en español.',
    link: '/gym/cursos',
  },
  {
    icon: BookOpen,
    titulo: 'Recursos',
    texto: 'Ebooks y guías gratuitas para empezar.',
    link: '/gym/recursos',
  },
]

const CARD_CLASS = 'border border-gray-800 bg-gray-900/60 rounded-xl p-3 md:p-4 flex flex-col gap-2 hover:border-gray-600 hover:bg-gray-900/80 transition-all duration-300 group'

const PANEL_URL = import.meta.env.VITE_PANEL_URL

const membresiaMsg = `https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero el acceso completo a todos los planos de Gym')}`

export default function GymPage() {
  const [planosModalOpen, setPlanosModalOpen]     = useState(false)
  const [historiaModalOpen, setHistoriaModalOpen] = useState(false)
  const [precioPlanos, setPrecioPlanos]           = useState(10000)
  const [planoMuestras, setPlanoMuestras]         = useState([null, null, null])

  useEffect(() => {
    fetch(`${PANEL_URL}/api/visual/gym`)
      .then(r => r.json())
      .then(data => {
        if (data.precio_planos) setPrecioPlanos(Number(data.precio_planos))
        setPlanoMuestras([
          data.gym_plano_muestra_1 || null,
          data.gym_plano_muestra_2 || null,
          data.gym_plano_muestra_3 || null,
        ])
      })
      .catch(() => {})
  }, [])

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
      <section className="relative pt-16 md:pt-24 pb-8 md:pb-14 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900" />
        <div className="absolute inset-0 opacity-[0.04]" style={GRID_PATTERN} />
        <div className="relative z-10 max-w-7xl mx-auto text-center md:text-left">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-none mb-5">
            Construyo mi<br />
            <span className="text-gray-400">propio gym</span><br />
            desde cero
          </h1>
          <button
            onClick={() => setHistoriaModalOpen(true)}
            className="inline-block border border-gray-600 text-gray-300 text-sm font-bold uppercase tracking-[0.2em] py-3 px-7 rounded hover:border-gray-300 hover:text-white transition-all duration-300"
          >
            Nuestra historia
          </button>
        </div>
      </section>

      {/* LO QUE PUEDES CONSEGUIR AQUÍ */}
      <section className="pb-8 md:pb-14 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="border-t border-gray-800 pt-3 md:pt-8">
          <h2 className="text-2xl md:text-4xl font-black uppercase leading-none mb-4 md:mb-8">
            Lo que puedes conseguir aquí
          </h2>
          {/* 2 cards visibles en móvil, 6 en desktop */}
          <div className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
            {servicios.map((s) => {
              const Icon = s.icon
              const inner = (
                <>
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs md:text-xs font-black uppercase tracking-wide leading-tight">{s.titulo}</h3>
                    {Icon && <Icon size={18} className="text-gray-500 group-hover:text-white transition-colors duration-300 flex-shrink-0" />}
                  </div>
                  <p className="text-xs leading-snug text-gray-500 group-hover:text-gray-400 transition-colors duration-300">{s.texto}</p>
                </>
              )
              const cardCls = `${CARD_CLASS} snap-start flex-shrink-0 w-[44vw] md:w-auto`
              return s.scrollTo
                ? (
                    <button
                      key={s.titulo}
                      onClick={() => scrollToSection(s.scrollTo)}
                      className={`${cardCls} text-left`}
                    >
                      {inner}
                    </button>
                  )
                : (
                    <Link key={s.titulo} to={s.link} className={cardCls}>
                      {inner}
                    </Link>
                  )
            })}
          </div>
        </div>
      </section>

      {/* PLANOS DIGITALES */}
      <section id="planos" className="pb-8 md:pb-14 px-4 md:px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="border-t border-gray-800 pt-3 md:pt-8">
          <div className="flex items-center justify-between gap-4 mb-3 md:block">
            <h2 className="text-2xl md:text-4xl font-black uppercase leading-none md:mb-3">Planos digitales</h2>
            <FileText size={56} className="text-gray-800 flex-shrink-0 md:hidden" strokeWidth={1} />
          </div>
          <p className="text-gray-400 leading-relaxed max-w-2xl mb-6 text-sm md:text-base">
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
                <span className="text-3xl font-black text-white">${precioPlanos.toLocaleString('es-CO')} COP</span>
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
      <section className="pb-8 md:pb-14 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="border-t border-gray-800 pt-3 md:pt-8">
          <h2 className="text-2xl md:text-4xl font-black uppercase leading-none mb-4 md:mb-8">Mis creaciones</h2>

          <div className="border border-gray-800 bg-gray-900/30 rounded-2xl py-20 text-center">
            <p className="text-gray-500 uppercase tracking-[0.25em] text-sm mb-2">Próximamente</p>
            <p className="text-gray-600 text-sm">Estamos cargando el portafolio de máquinas</p>
          </div>
        </div>
      </section>

      {/* MÁQUINAS BAJO PEDIDO + CONTACTO — UNIFICADO */}
      <section className="pb-10 md:pb-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="border-t border-gray-800 pt-3 md:pt-8">
          <div className="flex items-end justify-between mb-5 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-black uppercase leading-none">Máquinas bajo pedido</h2>
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

      {/* MODAL NUESTRA HISTORIA */}
      {historiaModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[80] flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setHistoriaModalOpen(false)}
        >
          <div
            className="relative bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-xl mx-auto my-auto p-8 md:p-10 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setHistoriaModalOpen(false)}
              aria-label="Cerrar"
              className="absolute top-5 right-6 text-gray-500 hover:text-white text-2xl leading-none bg-transparent border-none cursor-pointer"
            >✕</button>

            <p className="uppercase tracking-[0.25em] text-gray-500 text-xs mb-6">Nuestra historia</p>

            <p className="text-white text-base md:text-lg font-bold leading-relaxed mb-6 italic">
              "Empecé como cualquiera: queriendo entrenar, sin poder pagar un gimnasio."
            </p>

            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              No tenía el dinero para una membresía mensual, ni para comprar máquinas comerciales que cuestan millones. Así que hice lo que sabía hacer: aprendí a soldar, conseguí una pulidora, y empecé a construir mis propias herramientas — primero mancuernas de cemento, después discos, y con el tiempo, máquinas completas.
            </p>

            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Hoy entreno en mi propio gym, hecho con mis manos, en Chigorodó. Y me di cuenta de algo: si yo lo necesitaba, seguro hay muchas personas en Urabá y en toda Colombia que también quieren entrenar fuerte, sin gastar lo que cuesta un gimnasio comercial o una máquina importada.
            </p>

            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Por eso fabrico estas máquinas — con la misma calidad y resistencia que uso yo mismo todos los días, pero a un precio que tenga sentido para la gente real. No es un negocio que inventé desde un escritorio — es algo que vivo, que uso, y que sé que funciona.
            </p>

            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Si tú también quieres construirte a ti mismo, sin importar dónde empiezas, aquí tienes una alternativa real.
            </p>

            <p className="text-white font-black uppercase tracking-[0.15em] text-sm">— Jose</p>
          </div>
        </div>
      )}

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
            {planoMuestras.map((src, i) => (
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
