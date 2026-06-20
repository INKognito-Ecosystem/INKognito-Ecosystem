import { Link } from 'react-router-dom'
import { Wrench, GraduationCap, PlayCircle } from 'lucide-react'
import NavbarGym from './NavbarGym'
import FooterGym from './FooterGym'
import Seo from '../Seo'
import { creaciones, maquinasDestacadas, videosDestacados } from '../../data/gym'
const ogGym = '/og/gym.webp'

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
    titulo: 'Máquinas y planos',
    descripcion: 'Encarga tu máquina construida con soldadura profesional o descarga el plano PDF para hacerla tú mismo.',
    link: '/gym/maquinas-pedido',
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


export default function GymPage() {
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
        {/* FONDO CON GRID INDUSTRIAL */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px)',
          }}
        />

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
              return (
                <Link
                  key={s.titulo}
                  to={s.link}
                  className="border border-gray-800 bg-gray-900/60 rounded-2xl p-6 flex flex-col gap-4 hover:border-gray-600 hover:bg-gray-900/80 transition-all duration-300 group"
                >
                  {Icon && <Icon size={28} className="text-gray-400 group-hover:text-white transition-colors duration-300" />}
                  <h3 className="text-base font-black uppercase tracking-wide leading-tight">{s.titulo}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{s.descripcion}</p>
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] group-hover:text-gray-300 transition-colors duration-300">
                    Ver más →
                  </span>
                </Link>
              )
            })}
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
                  <div className={`${item.video ? 'aspect-video' : 'aspect-square'} bg-gray-700 flex items-center justify-center`}>
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
                  <div className="p-4">
                    <p className="font-black uppercase text-sm">{item.name}</p>
                    <p className="text-gray-500 text-xs mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MÁQUINAS BAJO PEDIDO — PREVIEW */}
      <section className="pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="border-t border-gray-800 pt-16">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="uppercase tracking-[0.25em] text-gray-500 text-xs md:text-sm mb-3">Soldadura profesional</p>
              <h2 className="text-3xl md:text-5xl font-black uppercase leading-none">Máquinas bajo pedido</h2>
            </div>
            <Link
              to="/gym/maquinas-pedido"
              className="hidden md:block text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white border border-gray-700 hover:border-gray-400 px-5 py-3 rounded transition-all duration-300"
            >
              Ver todas →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {maquinasDestacadas.map((m) => (
              <div
                key={m.id}
                className="border border-gray-800 bg-gray-900/60 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-square bg-gray-900 flex items-center justify-center">
                  <span className="text-gray-700 text-xs uppercase tracking-widest text-center px-6">Foto próximamente</span>
                </div>
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-700 text-gray-400 rounded-full px-3 py-1">Bajo pedido</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-700 text-gray-400 rounded-full px-3 py-1">Envío nacional</span>
                  </div>
                  <h3 className="font-black uppercase text-base leading-tight">{m.nombre}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{m.descripcion}</p>
                  <a
                    href={`https://wa.me/573207911013?text=Hola,%20me%20interesa%20cotizar:%20${encodeURIComponent(m.nombre)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto block text-center border border-gray-600 text-gray-300 text-xs font-bold uppercase tracking-[0.15em] py-3 rounded-xl hover:border-gray-300 hover:text-white transition-all duration-300"
                  >
                    Cotizar por WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 md:hidden">
            <Link
              to="/gym/maquinas-pedido"
              className="block text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white border border-gray-700 hover:border-gray-400 px-5 py-3 rounded transition-all duration-300"
            >
              Ver todas las máquinas →
            </Link>
          </div>
        </div>
      </section>

      {/* VIDEOS DESTACADOS */}
      <section className="pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="border-t border-gray-800 pt-16">
          <p className="uppercase tracking-[0.25em] text-gray-500 text-xs md:text-sm mb-3">YouTube</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase leading-none mb-12">Videos destacados</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {videosDestacados.map((v) => (
              <div
                key={v.id}
                className="border border-gray-800 bg-gray-900/60 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300"
              >
                <div className="relative w-full aspect-video bg-gray-900">
                  {v.src === null ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-600">
                      <span className="text-xs uppercase tracking-widest">Próximamente</span>
                    </div>
                  ) : (
                    <iframe
                      src={v.src}
                      title={v.titulo}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-black uppercase text-sm mb-2 leading-tight">{v.titulo}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{v.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="pb-24 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="border-t border-gray-800 pt-16">
          <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-8 md:p-14 text-center hover:border-gray-600 transition-all duration-300">
            <p className="uppercase tracking-[0.25em] text-gray-500 text-xs mb-4">Contacto directo</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase leading-none mb-4">
              ¿Tienes alguna<br />
              <span className="text-gray-400">idea en mente?</span>
            </h2>
            <p className="text-gray-400 mb-10 max-w-md mx-auto">
              Cuéntanos qué máquina necesitas y te damos un presupuesto personalizado.
            </p>
            <a
              href="https://wa.me/573207911013?text=Hola,%20me%20interesa%20una%20m%C3%A1quina%20de%20gym%20personalizada"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-400 text-gray-900 font-black uppercase tracking-[0.2em] py-4 px-12 rounded hover:bg-white transition-all duration-300"
            >
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <FooterGym />
    </div>
  )
}
