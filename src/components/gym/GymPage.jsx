import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Wrench, Dumbbell } from 'lucide-react'
import NavbarGym from './NavbarGym'
import GymMobileNav from './GymMobileNav'
import FooterGym from './FooterGym'
import CoverflowRow from '../CoverflowRow'
import { GYM_SECCIONES } from '../../data/gymSecciones'

const ogGym = '/og/gym.webp'
const WA = '573207911013'

// Cuadrícula decorativa — clara (líneas grises) para las tarjetas oscuras que
// se quedan como estaban, oscura (líneas casi negras) para el fondo blanco.
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

const RIBBON_ITEM = 'flex-shrink-0 text-[13px] font-extrabold text-white/70 pb-1.5 border-b-2 border-transparent whitespace-nowrap'

const CARD_CLASS = 'border border-gray-800 bg-gray-950 rounded-xl p-4 md:p-5 flex flex-col gap-3 min-h-[190px] md:min-h-[210px] hover:border-gray-600 hover:bg-gray-900 transition-all duration-300 group'

const PANEL_URL = import.meta.env.VITE_PANEL_URL

const membresiaMsg = `https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero el acceso completo a todos los planos de Gym')}`

export function meta() {
  const title = 'INKognito Gym | Máquinas de Gym con Soldadura Profesional y Planos Técnicos — Colombia'
  const description = 'Máquinas de gym construidas con soldadura profesional. Planos técnicos descargables. Envíos a toda Colombia desde Urabá, Antioquia.'
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

export default function GymPage() {
  const [planosModalOpen, setPlanosModalOpen]     = useState(false)
  const [historiaModalOpen, setHistoriaModalOpen] = useState(false)
  const [precioPlanos, setPrecioPlanos]           = useState(10000)
  const [planoMuestras, setPlanoMuestras]         = useState([null, null, null])
  const [creaciones, setCreaciones]               = useState(null)
  const [creacionSeleccionada, setCreacionSeleccionada] = useState(null)
  const [creacionImgActiva, setCreacionImgActiva]       = useState(0)

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
    // "Mis creaciones" (2026-08-31) — antes era un placeholder fijo
    // ("Próximamente"), sin backend ni forma de subir fotos. Ahora se
    // administra desde el panel (Imágenes → Gym — Mis creaciones).
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

      {/* CATEGORÍAS — listón (2026-09-20, Jose: "que se muestren en un listón
          tal como los demás módulos"). Solo móvil, justo debajo del navbar
          fijo, igual que en MobileHomeSupply/Store/Suple; reemplaza al
          carrusel de tarjetas de "Lo que puedes conseguir aquí", que en móvil
          queda oculto (escritorio conserva la grilla de tarjetas). Gym no
          tiene color de acento (blanco/gris), así que el listón va en gris
          acero — el mismo zinc-700 de Suple y del degradé de las tarjetas de
          Planos/Máquinas. "Todos" es solo indicador visual (no navega), igual
          que en los demás módulos. */}
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

      {/* BANNER — hero móvil (2026-09-20, Jose: "que sea algo más comercial,
          tipo banner como ya venimos haciendo"). Mismo formato del banner
          armado en CSS de MobileHomeSuple.jsx (tarjeta con degradé, titular
          con palabra resaltada, botones, marca de agua), en la paleta de Gym
          (gris acero + blanco). Conserva "Nuestra historia" y la frase del
          hero de siempre (Jose: "la frase sí la conservamos"). Escritorio
          sigue con el hero de abajo. El <h1> vive acá en móvil y en el hero
          en escritorio — nunca se ven los dos a la vez. */}
      <div className="md:hidden relative overflow-hidden mx-4 mt-4 mb-8 rounded-2xl border border-zinc-400/20 bg-gradient-to-br from-zinc-700 to-zinc-900 px-5 py-6">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={GRID_PATTERN} />
        <Dumbbell
          className="absolute -right-6 top-1/2 text-white/[0.07] pointer-events-none"
          style={{ transform: 'translateY(-50%) rotate(-20deg)' }}
          size={190}
          strokeWidth={1}
        />
        <div className="relative z-10">
          <p className="uppercase tracking-[0.25em] text-zinc-300 text-[10px] font-semibold mb-2">INKognito Gym — Urabá</p>
          <h1 className="text-2xl font-black uppercase leading-[1.1] mb-2 text-white">
            Tu gym en casa, <span className="inline-block bg-white text-gray-950 px-1.5 -mx-0.5">a tu medida</span>
          </h1>
          <p className="text-zinc-300 text-xs leading-relaxed mb-5 max-w-[18rem]">
            Máquinas con soldadura profesional, planos técnicos y todo para entrenar sin gimnasio comercial. Envíos a toda Colombia.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/gym/maquinas-pedido" className="px-4 py-2.5 rounded-lg bg-white text-gray-950 text-[11px] font-black uppercase tracking-[0.1em] whitespace-nowrap">
              Ver máquinas
            </Link>
            <button
              type="button"
              onClick={() => setHistoriaModalOpen(true)}
              className="px-4 py-2.5 rounded-lg border border-white/40 text-white text-[11px] font-bold uppercase tracking-[0.1em] whitespace-nowrap"
            >
              Nuestra historia
            </button>
          </div>
          <p className="mt-5 pt-4 border-t border-white/15 text-zinc-300 text-[11px] italic tracking-wide">
            “Hago arte para no morir, desafío cuerpo y mente.”
          </p>
        </div>
      </div>

      {/* HERO — solo escritorio; en móvil lo reemplaza el banner de arriba. */}
      <section className="hidden md:block relative pt-24 md:pt-32 pb-8 md:pb-14 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={GRID_PATTERN_CLARO} />
        <div className="relative z-10 max-w-7xl mx-auto text-center md:text-left">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-none mb-5">
            Construyo mi<br />
            <span className="text-zinc-600">propio gym</span><br />
            desde cero
          </h1>
          <button
            onClick={() => setHistoriaModalOpen(true)}
            className="inline-block border border-zinc-400 text-zinc-700 text-sm font-bold uppercase tracking-[0.2em] py-3 px-7 rounded hover:border-zinc-600 hover:text-zinc-900 transition-all duration-300"
          >
            Nuestra historia
          </button>
          <p className="mt-5 text-zinc-600 text-xs md:text-sm italic tracking-wide">
            “Hago arte para no morir, desafío cuerpo y mente.”
          </p>
        </div>
      </section>

      {/* LO QUE PUEDES CONSEGUIR AQUÍ — solo escritorio (2026-09-20, Jose:
          "sobra en ese lugar pues categorías ya no le acompaña"): en móvil
          las categorías pasaron al listón de arriba, así que el título y la
          descripción quedaban sueltos. En escritorio siguen con su grilla de
          tarjetas. */}
      <section className="hidden md:block pb-8 md:pb-14 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="border-t border-zinc-200 pt-3 md:pt-8">
          <div className="mb-4 md:mb-8">
            <h2 className="float-left mr-6 md:mr-8 mb-2 text-base md:text-3xl font-black uppercase leading-none whitespace-nowrap">
              Lo que puedes conseguir aquí
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed text-justify [hyphens:auto]">
              Todo lo que necesitas para entrenar en casa sin depender de un gimnasio comercial:
              máquinas de gym fabricadas con soldadura profesional en Chigorodó, Urabá, planos
              técnicos para construir tu propio equipo, suplementos, tutoriales en video y
              cursos de entrenamiento — pensado para quien quiere resultados reales sin gastar
              lo que cuesta un gimnasio o un equipo importado.
            </p>
            <div className="clear-both" />
          </div>
          {/* Mismo carrusel coverflow de Categorías/Marcas en Supply, pero
              estático — sin autoplay, el usuario mueve con el dedo desde el
              inicio, con la flechita "Desliza" siempre visible (pedido
              explícito: estas card de Gym no hacen la vuelta automática al
              entrar, 2026-08-02). Desde 2026-09-20 la sección entera es solo
              escritorio: en móvil las categorías van en el listón de arriba
              (ver bajo NavbarGym). */}
          <CoverflowRow desktopClassName="md:grid md:grid-cols-3 lg:grid-cols-6 gap-3" autoplay={false}>
            {GYM_SECCIONES.map((s, i) => {
              const Icon = s.icon
              const inner = (
                <>
                  {Icon && (
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-800/80 border border-gray-700 flex items-center justify-center mx-auto md:mx-0 group-hover:border-gray-500 group-hover:scale-105 transition-all duration-300">
                      <Icon size={20} className="text-gray-400 group-hover:text-white transition-colors duration-300" />
                    </div>
                  )}
                  <h3 className="text-sm md:text-base font-black uppercase tracking-wide leading-tight text-center md:text-left text-white">{s.titulo}</h3>
                  <p className="text-xs md:text-sm leading-relaxed text-gray-500 group-hover:text-gray-400 transition-colors duration-300 flex-1 text-justify [hyphens:auto] text-center md:text-left">{s.texto}</p>
                </>
              )
              return (
                <div key={s.titulo} className="w-full">
                  {s.scrollTo
                    ? (
                        <button
                          onClick={() => scrollToSection(s.scrollTo)}
                          className={`${CARD_CLASS} text-left w-full`}
                        >
                          {inner}
                        </button>
                      )
                    : (
                        <Link to={s.link} className={`${CARD_CLASS} w-full`}>
                          {inner}
                        </Link>
                      )}
                  {i === 0 && (
                    <div className="md:hidden mt-1.5 flex items-center justify-end gap-1 text-gray-500 text-[9px] font-bold uppercase tracking-widest">
                      <span>Desliza</span>
                      <span className="animate-bounce">→</span>
                    </div>
                  )}
                </div>
              )
            })}
          </CoverflowRow>
        </div>
      </section>

      {/* PLANOS DIGITALES */}
      <section id="planos" className="pb-8 md:pb-14 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="border-t border-zinc-200 pt-3 md:pt-8">
          <div className="mb-6">
            <div className="float-left flex items-center gap-3 mr-6 md:mr-8 mb-2">
              <h2 className="text-base md:text-3xl font-black uppercase leading-none whitespace-nowrap">
                Planos digitales
              </h2>
              <FileText size={24} className="text-zinc-300 flex-shrink-0 md:hidden" strokeWidth={1} />
            </div>
            <p className="text-zinc-600 text-sm md:text-base leading-relaxed text-justify [hyphens:auto]">
              Planos técnicos completos en PDF, con medidas exactas y lista de materiales — para
              construir tus propias máquinas de gym en casa, en cualquier ciudad de Colombia.
              Pensados para uso personal o para quien quiere empezar su propio negocio de
              fabricación de equipos fitness.
            </p>
            <div className="clear-both" />
          </div>

          {/* CARD MEMBRESÍA — mismo patrón "sólido" aplicado recientemente
              en Store (StorePage.jsx): degradé gris acero, círculo
              decorativo difuminado y badge de ícono circular, en la paleta
              propia de Gym (blanco/gris, sin color de acento). */}
          <div className="group relative border border-zinc-400/30 bg-gradient-to-br from-zinc-600 to-zinc-900 rounded-2xl p-8 md:p-10 overflow-hidden max-w-3xl hover:border-zinc-300/50 hover:shadow-[0_12px_35px_rgba(161,161,170,0.2)] transition-all duration-300">
            <div className="absolute inset-0 opacity-[0.025]" style={GRID_PATTERN} />
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-full bg-zinc-900/60 border border-zinc-300/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText size={22} className="text-zinc-200" />
                </div>
                <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] bg-white text-gray-950 rounded-full px-3 py-1 mb-4">
                  Acceso total
                </span>
                <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight mb-3 text-white">
                  Membresía de por vida
                </h3>
                <p className="text-zinc-200 leading-relaxed text-sm md:text-base">
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
                  className="border border-zinc-300/40 text-zinc-100 font-bold uppercase tracking-[0.15em] text-xs py-3 px-6 rounded-xl hover:border-zinc-100 hover:bg-white/10 transition-all duration-300"
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
        <div className="border-t border-zinc-200 pt-3 md:pt-8">
          <div className="mb-4 md:mb-8">
            <h2 className="float-left mr-6 md:mr-8 mb-2 text-base md:text-3xl font-black uppercase leading-none whitespace-nowrap">
              Mis creaciones
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed text-justify [hyphens:auto]">
              Portafolio real de máquinas construidas con mis propias manos — la prueba de que
              se puede entrenar fuerte sin gastar en equipos comerciales o importados. Cada
              pieza fabricada con soldadura profesional, pensada para durar años de uso intenso.
            </p>
            <div className="clear-both" />
          </div>

          {creaciones?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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
                  className={`group relative aspect-square overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 text-left ${(c.descripcion || c.image_urls?.length > 1) ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <img
                    src={c.image_url}
                    alt={c.titulo || 'Máquina construida por INKognito Gym'}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {(c.titulo || c.categoria) && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 py-2.5">
                      {c.titulo && <p className="text-white text-xs md:text-sm font-bold leading-tight">{c.titulo}</p>}
                      {c.categoria && <p className="text-gray-300 text-[10px] uppercase tracking-wide">{c.categoria}</p>}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="border border-zinc-200 bg-zinc-50 rounded-2xl py-20 text-center">
              <p className="text-zinc-500 uppercase tracking-[0.25em] text-sm mb-2">Próximamente</p>
              <p className="text-zinc-400 text-sm">Estamos cargando el portafolio de máquinas</p>
            </div>
          )}
        </div>
      </section>

      {/* MÁQUINAS BAJO PEDIDO + CONTACTO — UNIFICADO */}
      <section className="pb-10 md:pb-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="border-t border-zinc-200 pt-3 md:pt-8">
          <div className="mb-5 md:mb-8">
            <h2 className="float-left mr-6 md:mr-8 mb-2 text-base md:text-3xl font-black uppercase leading-none whitespace-nowrap">
              Máquinas bajo pedido
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed text-justify [hyphens:auto]">
              Máquinas de gym fabricadas a tu medida, con acero y soldadura profesional, en
              Chigorodó, Urabá — con envíos a toda Colombia. Cuéntanos qué necesitas construir
              y te damos un presupuesto real, sin intermediarios.
            </p>
            <div className="clear-both" />
            <Link
              to="/gym/maquinas-pedido"
              className="hidden md:inline-block mt-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-900 border border-zinc-300 hover:border-zinc-600 px-5 py-3 rounded transition-all duration-300"
            >
              Ver catálogo →
            </Link>
          </div>

          {/* Mismo patrón "sólido" aplicado en Store/Planos digitales:
              degradé gris acero, círculo decorativo (acá abajo-derecha, más
              grande, para no ser idéntico al de la card de Planos) y badge
              de ícono circular con Wrench (contexto: sección de Máquinas). */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-zinc-600 to-zinc-900 border border-zinc-400/30 rounded-2xl p-8 md:p-14 hover:border-zinc-300/50 hover:shadow-[0_12px_35px_rgba(161,161,170,0.2)] transition-all duration-300">
            <div className="absolute -bottom-14 -right-14 w-44 h-44 rounded-full bg-white/10" />
            <div className="relative z-10 w-12 h-12 rounded-full bg-zinc-900/60 border border-zinc-300/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Wrench size={22} className="text-zinc-200" />
            </div>
            <p className="relative z-10 uppercase tracking-[0.25em] text-zinc-300 text-xs mb-4">Contacto directo</p>
            <h3 className="relative z-10 text-2xl md:text-4xl font-black uppercase leading-none mb-4 text-white">
              ¿Tienes alguna<br />
              <span className="text-zinc-300">idea en mente?</span>
            </h3>
            <p className="relative z-10 text-zinc-200 leading-relaxed text-base max-w-2xl mb-8">
              Fabrico máquinas de gym a tu medida, con soldadura profesional y a precios muy accesibles. ¿Tienes alguna idea en mente? Cuéntanos qué máquina necesitas y te damos un presupuesto personalizado.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4">
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
                className="inline-block text-center border border-zinc-300/40 text-zinc-100 font-bold uppercase tracking-[0.2em] text-sm py-4 px-8 rounded-xl hover:border-zinc-100 hover:bg-white/10 transition-all duration-300"
              >
                Ver catálogo completo →
              </Link>
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
              "Empecé como cualquiera: queriendo entrenar, sin poder pagar un gimnasio."
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

      {/* MODAL DETALLE DE CREACIÓN — solo se abre si hay algo que no cabe
          en la card: descripción, o más de una foto para ver en galería
          (el título/categoría ya se ven en la card sin necesidad de clic). */}
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
              alt={creacionSeleccionada.titulo || 'Máquina construida por INKognito Gym'}
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
