import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, ChevronLeft, ChevronRight, ArrowDown, ArrowLeft, ArrowRight, ExternalLink, CheckCircle2 } from 'lucide-react'
import { BRAND_SHOWCASE_DATA } from './brandShowcaseData'

/**
 * Componente MAESTRO Premium para Páginas de Marca en INKognito Supply.
 *
 * Jerarquía visual solicitada:
 * 1. ZONA SUPERIOR (Hero Stage):
 *    - Exclusivamente el Navbar y el objeto fotográfico real flotando en el centro con sombra.
 *    - Flechas laterales SIEMPRE visibles (ancladas con absolute, nunca desaparecen, bucle infinito).
 *    - NINGÚN texto ni clasificación encima de la imagen.
 * 2. CLASIFICACIÓN DEBAJO DE LAS IMÁGENES:
 *    - Pills interactivas de herramientas (01. Gafas TR90, 02. Clip-On, etc.) situadas DEBAJO del producto y su sombra.
 *    - Categoría, título de la pieza, micro-especificación y contador 01 / 05.
 * 3. ZONA MEDIA (Revelación de Marca):
 *    - Logotipo oficial de Tattoo Vision incorporado debajo del stage.
 *    - Modelo, ingeniería de Hernán Yepes y descripción técnica.
 *    - Botones de acción: Vitrina de stock en Supply y enlace al sitio oficial.
 * 4. DESGLOSE DEL SISTEMA & BENTO GRID.
 */

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.3 },
      scale: { duration: 0.3 },
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? -120 : 120,
    opacity: 0,
    scale: 0.95,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 },
    },
  }),
}

export default function BrandShowcaseHero({
  brandKey = 'tattoo-vision',
  logoUrl = null,
  distribuidorOficial = false,
  onExploreCatalog,
  brandNav = null,
}) {
  const data = BRAND_SHOWCASE_DATA[brandKey] || BRAND_SHOWCASE_DATA['tattoo-vision']
  const slides = data.heroSlides || []
  const isMultiSlide = slides.length > 1
  const resolvedLogo = logoUrl || data.logoFallback

  const [[currentIndex, direction], setSlide] = useState([0, 0])

  // Bucle infinito circular garantizado: nunca se detiene ni deshabilita
  const paginate = useCallback((newDirection) => {
    if (slides.length <= 1) return
    setSlide(([prevIndex]) => {
      const total = slides.length || 1
      const nextIndex = (prevIndex + newDirection + total) % total
      return [nextIndex, newDirection]
    })
  }, [slides.length])

  const goToSlide = (targetIndex) => {
    if (slides.length <= 1) return
    setSlide(([prevIndex]) => [targetIndex, targetIndex > prevIndex ? 1 : -1])
  }

  // Soporte de navegación por teclado (flechas izquierda / derecha)
  useEffect(() => {
    if (!isMultiSlide) return
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') paginate(-1)
      if (e.key === 'ArrowRight') paginate(1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [paginate, isMultiSlide])

  const currentSlide = slides[currentIndex] || slides[0]

  const handleScrollDown = () => {
    if (onExploreCatalog) {
      onExploreCatalog()
      return
    }
    const cat = document.getElementById('catalogo-marca')
    if (cat) cat.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative w-full bg-white text-zinc-900 selection:bg-blue-600 selection:text-white">

      {/* Trama sutil de textura milimétrica de fondo */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.8) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* ==================================================================== */}
      {/* 1. ZONA SUPERIOR: EXCLUSIVAMENTE EL OBJETO FLOTANTE & FLECHAS FIJAS   */}
      {/* ==================================================================== */}
      <div className="relative w-full min-h-[66vh] sm:min-h-[74vh] md:min-h-[80vh] flex flex-col items-center justify-between pt-24 sm:pt-28 pb-10 px-4 overflow-hidden">

        {/* Resplandor ambiental de acento difuso detrás del producto */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[620px] md:w-[750px] h-[280px] sm:h-[360px] rounded-full blur-[110px] pointer-events-none opacity-[0.08]"
          style={{ backgroundColor: data.accentColor }}
        />

        {/* Marca de agua tenue del logotipo en el fondo detrás de las fotos de producto */}
        {(data.heroWatermarkLogo || resolvedLogo) && (
          data.logoMaskColor && !data.heroWatermarkLogo ? (
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[440px] md:w-[540px] h-[160px] sm:h-[220px] md:h-[260px] opacity-[0.07] pointer-events-none select-none"
              style={{
                backgroundColor: data.logoMaskColor,
                WebkitMaskImage: `url(${resolvedLogo})`,
                maskImage: `url(${resolvedLogo})`,
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            />
          ) : (
            <img
              src={data.heroWatermarkLogo || resolvedLogo}
              alt=""
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[460px] md:w-[560px] max-h-[240px] sm:max-h-[320px] md:max-h-[360px] h-auto object-contain opacity-[0.06] pointer-events-none select-none"
            />
          )
        )}

        {/* CONTENEDOR DEL VISOR CON FLECHAS ANCLADAS A LOS EXTREMOS (SIEMPRE VISIBLES) */}
        <div className="relative w-full max-w-5xl mx-auto my-auto flex items-center justify-center min-h-[320px] sm:min-h-[380px] md:min-h-[440px]">

          {/* FLECHA ANTERIOR — SOLO EN MODO MULTI-SLIDE (KIT) */}
          {isMultiSlide && (
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Ver herramienta anterior"
              className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-zinc-800 hover:bg-zinc-900 hover:text-white border border-zinc-200/90 hover:border-zinc-900 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer select-none"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* FLECHA SIGUIENTE — SOLO EN MODO MULTI-SLIDE (KIT) */}
          {isMultiSlide && (
            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Ver siguiente herramienta"
              className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-zinc-800 hover:bg-zinc-900 hover:text-white border border-zinc-200/90 hover:border-zinc-900 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer select-none"
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* ÁREA CENTRAL: OBJETO FOTOGRÁFICO REAL FLOTANDO CON SU SOMBRA (SWIPEABLE SI ES KIT) */}
          <div className="relative w-full max-w-xl mx-auto flex flex-col items-center justify-center px-10 sm:px-16 overflow-visible">

            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentSlide.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag={isMultiSlide ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(e, { offset, velocity }) => {
                  if (!isMultiSlide) return
                  const swipe = offset.x
                  if (swipe < -40 || velocity.x < -350) {
                    paginate(1)
                  } else if (swipe > 40 || velocity.x > 350) {
                    paginate(-1)
                  }
                }}
                className={`relative w-full flex flex-col items-center justify-center select-none ${isMultiSlide ? 'cursor-grab active:cursor-grabbing' : ''}`}
              >

                {/* FOTOGRAFÍA REAL FLOTANTE (Movimiento de levitación física suave) */}
                <motion.div
                  animate={{ y: [0, -14, 0] }}
                  transition={{
                    duration: 4.6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative z-10 flex items-center justify-center"
                >
                  {currentSlide.frameStyle === 'watermark' ? (
                    <div className="relative flex items-center justify-center py-6 sm:py-10">
                      <img
                        src={currentSlide.src}
                        alt={currentSlide.alt}
                        className={`w-auto h-auto ${currentSlide.maxHeight} ${currentSlide.maxWidth} object-contain opacity-[0.22] pointer-events-none select-none`}
                      />
                    </div>
                  ) : currentSlide.frameStyle === 'gallery' ? (
                    <div className="relative rounded-3xl overflow-hidden shadow-[0_28px_60px_rgba(0,0,0,0.22)] ring-1 ring-black/10 bg-zinc-950">
                      <img
                        src={currentSlide.src}
                        alt={currentSlide.alt}
                        className={`w-full h-auto ${currentSlide.maxHeight} ${currentSlide.maxWidth} object-cover pointer-events-none select-none`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />
                      {resolvedLogo && (
                        <img
                          src={resolvedLogo}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 m-auto w-36 sm:w-44 md:w-52 h-auto object-contain invert opacity-[0.16] pointer-events-none select-none"
                        />
                      )}
                    </div>
                  ) : (
                    <img
                      src={currentSlide.src}
                      alt={currentSlide.alt}
                      className={`w-auto h-auto ${currentSlide.maxHeight} ${currentSlide.maxWidth} object-contain drop-shadow-[0_22px_38px_rgba(0,0,0,0.16)] pointer-events-none select-none`}
                    />
                  )}
                </motion.div>

                {/* SOMBRA DE CONTACTO REALISTA EN EL SUELO (Sincronizada en fase inversa) */}
                <motion.div
                  animate={{
                    scaleX: [1, 0.88, 1],
                    scaleY: [1, 0.82, 1],
                    opacity: [0.38, 0.22, 0.38],
                  }}
                  transition={{
                    duration: 4.6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className={`${currentSlide.shadowWidth} h-6 sm:h-7 mt-3 rounded-[100%] bg-gradient-to-r from-zinc-900/5 via-zinc-900/60 to-zinc-900/5 blur-xl pointer-events-none`}
                />

              </motion.div>
            </AnimatePresence>

          </div>

        </div>

        {/* ==================================================================== */}
        {/* 2. CLASIFICACIÓN DE LOS OBJETOS SITUADA DEBAJO DE LAS IMÁGENES       */}
        {/* ==================================================================== */}
        <div className="relative z-20 w-full max-w-3xl mx-auto flex flex-col items-center gap-3 mt-4 text-center">

          {/* SELECTOR DE HERRAMIENTAS (PILLS DE CLASIFICACIÓN — SOLO EN KITS MULTI-PIEZA) */}
          {isMultiSlide && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-2">
              {slides.map((item, idx) => {
                const isActive = idx === currentIndex
                return (
                  <button
                    key={item.id}
                    onClick={() => goToSlide(idx)}
                    className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-semibold transition-all cursor-pointer select-none ${
                      isActive
                        ? 'bg-zinc-900 text-white shadow-md ring-1 ring-zinc-900 scale-105'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/90 hover:text-zinc-900'
                    }`}
                  >
                    <span>{`0${idx + 1}. `}</span>
                    <span className="hidden xs:inline">{item.badge}</span>
                    <span className="xs:hidden">{item.badge.split(' ')[0]}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* CATEGORÍA Y DETALLES TÉCNICOS DEL OBJETO SELECCIONADO */}
          <div className="mt-1 flex flex-col items-center">
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-zinc-400 font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: data.accentColor || '#3b82f6' }} />
              <span>{currentSlide.category}</span>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
              {currentSlide.title}
            </h4>

            <p className="text-xs text-zinc-500 max-w-md mx-auto mt-0.5 leading-relaxed">
              {currentSlide.detail}
            </p>
          </div>

          {/* CONTADOR DE PIEZAS (SOLO EN KITS MULTI-PIEZA) */}
          {isMultiSlide && (
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider font-semibold text-zinc-400 mt-1">
              <span className="text-zinc-900 font-bold">{`0${currentIndex + 1}`}</span>
              <span className="text-zinc-300">/</span>
              <span className="text-zinc-400">{`0${slides.length}`}</span>
              <span className="text-zinc-300">·</span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-400">Desliza para explorar el kit</span>
            </div>
          )}

          {/* Flecha suave de scroll */}
          <div className="mt-2 text-zinc-300">
            <ArrowDown size={14} className="animate-bounce" />
          </div>

        </div>

      </div>

      {/* ==================================================================== */}
      {/* 3. ZONA MEDIA: LOGO DE LA MARCA DEBAJO DE LAS GAFAS & MODELO         */}
      {/* ==================================================================== */}
      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-12 sm:pb-16 text-center border-t border-zinc-100">

        {/* Logotipo oficial de la marca en el centro + flechas sutiles en los extremos para cambiar de marca */}
        <div className="relative w-full flex items-center justify-between gap-4 mb-6">
          {brandNav?.show && brandNav?.prev ? (
            <Link
              to={brandNav.prev.path}
              replace
              aria-label={`Ver ${brandNav.prev.name}`}
              title={`Anterior: ${brandNav.prev.name}`}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/90 border border-transparent hover:border-zinc-200/80 flex items-center justify-center transition-all flex-shrink-0"
            >
              <ArrowLeft size={18} />
            </Link>
          ) : <span className="w-9 sm:w-10 flex-shrink-0" />}

          <div className="flex flex-col items-center justify-center mx-auto px-2">
            {resolvedLogo ? (
              data.logoMaskColor ? (
                <span className="relative inline-flex items-center justify-center">
                  <img
                    src={resolvedLogo}
                    alt={data.brandName}
                    className={`${
                      data.logoClassName ||
                      'h-20 sm:h-24 md:h-28 w-auto max-w-[240px] sm:max-w-[320px] md:max-w-[380px] object-contain'
                    } opacity-0`}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      backgroundColor: data.logoMaskColor,
                      WebkitMaskImage: `url(${resolvedLogo})`,
                      maskImage: `url(${resolvedLogo})`,
                      WebkitMaskSize: 'contain',
                      maskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskPosition: 'center',
                    }}
                  />
                </span>
              ) : (
                <img
                  src={resolvedLogo}
                  alt={data.brandName}
                  className={
                    data.logoClassName ||
                    'h-20 sm:h-24 md:h-28 w-auto max-w-[240px] sm:max-w-[320px] md:max-w-[380px] object-contain drop-shadow-sm'
                  }
                />
              )
            ) : (
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900">
                {data.brandName}
              </h2>
            )}
          </div>

          {brandNav?.show && brandNav?.next ? (
            <Link
              to={brandNav.next.path}
              replace
              aria-label={`Ver ${brandNav.next.name}`}
              title={`Siguiente: ${brandNav.next.name}`}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/90 border border-transparent hover:border-zinc-200/80 flex items-center justify-center transition-all flex-shrink-0"
            >
              <ArrowRight size={18} />
            </Link>
          ) : <span className="w-9 sm:w-10 flex-shrink-0" />}
        </div>

        {/* Eyebrow de ingeniería / marca — SIEMPRE en una sola línea sin cortes */}
        <div className="inline-flex items-center justify-center max-w-full px-3 sm:px-4 py-1 rounded-full bg-zinc-100 border border-zinc-200/80 mb-3.5 overflow-hidden">
          <span className="text-[9px] sm:text-[11px] font-mono font-bold tracking-[0.14em] sm:tracking-[0.2em] text-zinc-600 uppercase whitespace-nowrap truncate">
            {data.eyebrow}
          </span>
        </div>

        {/* Título de Producto & Subtítulo */}
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 leading-tight text-balance">
          {data.title}
        </h3>

        <p className="text-base sm:text-lg md:text-xl font-medium text-zinc-600 mt-2 max-w-2xl mx-auto">
          {data.subtitle}
        </p>

        <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl mx-auto mt-3 leading-relaxed text-balance">
          {data.description}
        </p>

        {/* ACCIONES: VITRINA SUPPLY & ENLACE AL SITIO OFICIAL */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={handleScrollDown}
            className="group inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-full bg-zinc-900 hover:bg-black text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Ver Stock en Tiendas Supply</span>
            <ChevronDown size={15} className="group-hover:translate-y-0.5 transition-transform" />
          </button>

          {data.officialUrl && (
            <a
              href={data.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-bold tracking-wider uppercase border border-zinc-300 transition-all shadow-xs hover:border-zinc-400 hover:-translate-y-0.5"
            >
              <span>{data.officialLabel || `Sitio Oficial ${data.brandName}`}</span>
              <ExternalLink size={14} className="text-zinc-400 group-hover:text-zinc-700 transition-colors" />
            </a>
          )}
        </div>

      </div>

      {/* ==================================================================== */}
      {/* 4. DESGLOSE DEL SISTEMA DE HARDWARE (4 COMPONENTES INTEGRALES)        */}
      {/* ==================================================================== */}
      {data.systemTools?.length > 0 && (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-12">
          <div className="text-center mb-7">
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 font-bold">
              {data.systemSection?.eyebrow || 'Arquitectura del Hardware'}
            </p>
            <h4 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight mt-0.5">
              {data.systemSection?.title || 'Sistema Integral de Precisión'}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.systemTools.map((tool, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-5 flex flex-col justify-between hover:bg-white hover:shadow-sm hover:border-zinc-300 transition-all"
              >
                <div>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-zinc-200/70 text-zinc-700 font-bold tracking-wider inline-block mb-2.5">
                    {tool.tag}
                  </span>
                  <h5 className="text-sm font-bold text-zinc-900 tracking-tight">
                    {tool.name}
                  </h5>
                  <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. ZONA EDITORIAL PREMIUM: BENTO GRID DE INGENIERÍA & EN ACCIÓN      */}
      {/* ==================================================================== */}
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16">

        {data.bento && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* TARJETA DESTACADA: Fotografía real editorial (Col span 7) */}
            <div className="md:col-span-7 rounded-3xl bg-zinc-900 text-white overflow-hidden p-6 sm:p-8 flex flex-col justify-between shadow-xl relative group">

              <div className="relative w-full h-[240px] sm:h-[300px] rounded-2xl overflow-hidden mb-6 bg-zinc-950 flex items-center justify-center border border-white/5">
                {data.bento.featured.image ? (
                  <>
                    <img
                      src={data.bento.featured.image}
                      alt={data.bento.featured.imageAlt}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                  </>
                ) : data.bento.featured.watermarkLogo ? (
                  <>
                    <div
                      className="absolute inset-0 opacity-[0.06]"
                      style={{
                        backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                      }}
                    />
                    <img
                      src={data.bento.featured.watermarkLogo}
                      alt={data.bento.featured.imageAlt}
                      className="w-40 sm:w-48 h-auto object-contain invert opacity-[0.18] group-hover:opacity-[0.26] group-hover:scale-105 transition-all duration-700 select-none pointer-events-none"
                    />
                  </>
                ) : null}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-zinc-300 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-blue-400 font-bold">{data.bento.featured.overlayLeft}</span>
                  <span className="text-zinc-400">{data.bento.featured.overlayRight}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-blue-400 uppercase">
                    {data.bento.featured.eyebrow}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold">
                    {data.bento.featured.badge}
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {data.bento.featured.title}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mt-2">
                  {data.bento.featured.description}
                </p>
              </div>

            </div>

            {/* COLUMNA DERECHA: 2 Tarjetas estratégicas de hardware (Col span 5) */}
            <div className="md:col-span-5 flex flex-col gap-6">
              {data.bento.cards.map((card, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl bg-zinc-50 border border-zinc-200/80 p-6 sm:p-7 flex flex-col justify-between hover:bg-white hover:border-zinc-300 transition-all shadow-sm flex-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-blue-600 uppercase">
                        {card.eyebrow}
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-zinc-200/70 text-zinc-700 font-semibold">
                        {card.badge}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-zinc-900 tracking-tight">
                      {card.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mt-2">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span>{card.footer}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================================================================== */}
        {/* 6. FRANJA INFERIOR: MÉTRICAS DE HARDWARE Y ACCESO A CATÁLOGO         */}
        {/* ==================================================================== */}
        <div className="w-full mt-10 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Estadísticas de precisión */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 w-full sm:w-auto">
            {data.stats.map((st, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  {st.label}
                </span>
                <span className="text-xl font-black text-zinc-900 tracking-tight mt-0.5">
                  {st.value}
                </span>
                <span className="text-[11px] text-zinc-500">
                  {st.note}
                </span>
              </div>
            ))}
          </div>

          {/* Botón al catálogo comercial */}
          <button
            onClick={handleScrollDown}
            className="group flex items-center gap-3 px-7 py-3.5 rounded-full bg-zinc-900 hover:bg-black text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Explorar Stock en Supply</span>
            <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
          </button>

        </div>

      </div>

    </section>
  )
}
