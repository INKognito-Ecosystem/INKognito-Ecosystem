import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, ChevronLeft, ChevronRight, CheckCircle2, ArrowDown, ExternalLink } from 'lucide-react'
import { BRAND_SHOWCASE_DATA } from './brandShowcaseData'

/**
 * Componente MAESTRO Premium para Páginas de Marca en INKognito Supply.
 *
 * Jerarquía visual de alta gama:
 * 1. ZONA SUPERIOR: Exclusivamente el Navbar y el Visor Flotante Interactivo
 *    - Permite deslizar a los lados (swipe / flechas / selector de herramientas) para ver cada objeto del kit por separado.
 *    - Cada objeto levita en el centro con su sombra de contacto realista sincronizada.
 * 2. ZONA MEDIA: Logotipo oficial de la marca incorporado DEBAJO de las herramientas, modelo y descripción editorial.
 * 3. DESGLOSE DEL SISTEMA: 4 módulos de hardware de precisión.
 * 4. BENTO GRID: Demostración fotográfica real sobre tatuaje en piel y detalles técnicos.
 * 5. TELEMETRÍA Y ACCESO A CATÁLOGO / SITIO OFICIAL.
 */

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 140 : -140,
    opacity: 0,
    scale: 0.94,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring', stiffness: 320, damping: 32 },
      opacity: { duration: 0.35 },
      scale: { duration: 0.35 },
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? -140 : 140,
    opacity: 0,
    scale: 0.94,
    transition: {
      x: { type: 'spring', stiffness: 320, damping: 32 },
      opacity: { duration: 0.25 },
      scale: { duration: 0.25 },
    },
  }),
}

export default function BrandShowcaseHero({
  brandKey = 'tattoo-vision',
  logoUrl = null,
  distribuidorOficial = false,
  onExploreCatalog,
}) {
  const data = BRAND_SHOWCASE_DATA[brandKey] || BRAND_SHOWCASE_DATA['tattoo-vision']
  const slides = data.heroSlides || []
  const resolvedLogo = logoUrl || data.logoFallback

  const [[currentIndex, direction], setSlide] = useState([0, 0])

  const paginate = useCallback((newDirection) => {
    setSlide(([prevIndex]) => {
      let nextIndex = prevIndex + newDirection
      if (nextIndex < 0) nextIndex = slides.length - 1
      if (nextIndex >= slides.length) nextIndex = 0
      return [nextIndex, newDirection]
    })
  }, [slides.length])

  const goToSlide = (targetIndex) => {
    setSlide(([prevIndex]) => [targetIndex, targetIndex > prevIndex ? 1 : -1])
  }

  // Soporte de navegación por teclado (flechas izquierda / derecha)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') paginate(-1)
      if (e.key === 'ArrowRight') paginate(1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [paginate])

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
      {/* 1. ZONA SUPERIOR: VISOR FLOTANTE INTERACTIVO (DESLIZAR A LOS LADOS)   */}
      {/* ==================================================================== */}
      <div className="relative w-full min-h-[64vh] sm:min-h-[72vh] md:min-h-[78vh] flex flex-col items-center justify-between pt-20 sm:pt-24 pb-8 px-4 overflow-hidden">

        {/* Resplandor ambiental de acento difuso detrás del producto */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[620px] md:w-[750px] h-[280px] sm:h-[360px] rounded-full blur-[110px] pointer-events-none opacity-[0.08]"
          style={{ backgroundColor: data.accentColor }}
        />

        {/* SELECTOR SUPERIOR DE HERRAMIENTAS (PILLS DE NAVEGACIÓN DIRECTA) */}
        <div className="relative z-20 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-3xl mx-auto px-2 mb-2">
          {slides.map((item, idx) => {
            const isActive = idx === currentIndex
            return (
              <button
                key={item.id}
                onClick={() => goToSlide(idx)}
                className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-semibold transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-900 scale-105'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900'
                }`}
              >
                <span>{`0${idx + 1}. `}</span>
                <span className="hidden xs:inline">{item.badge}</span>
                <span className="xs:hidden">{item.badge.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>

        {/* ESCENARIO DEL PRODUCTO FLOTANTE CON GESTOS Y CONTROLES LATERALES */}
        <div className="relative w-full max-w-4xl mx-auto my-auto flex items-center justify-between z-10 px-2 sm:px-6">

          {/* BOTÓN ANTERIOR (FLECHA IZQUIERDA) */}
          <button
            onClick={() => paginate(-1)}
            aria-label="Ver herramienta anterior"
            className="flex-shrink-0 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 border border-zinc-200/90 text-zinc-700 hover:text-black hover:border-zinc-400 hover:bg-white shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>

          {/* ÁREA CENTRAL: OBJETO FLOTANTE ACTIVO (SWIPEABLE / ARRASTRABLE) */}
          <div className="relative flex-1 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[360px] md:min-h-[420px] px-2 sm:px-4 overflow-visible">

            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentSlide.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = offset.x
                  if (swipe < -40 || velocity.x < -400) {
                    paginate(1)
                  } else if (swipe > 40 || velocity.x > 400) {
                    paginate(-1)
                  }
                }}
                className="relative w-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none"
              >

                {/* Categoría y Badge de la herramienta activa */}
                <div className="mb-3 sm:mb-4 flex items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-zinc-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span>{currentSlide.category}</span>
                </div>

                {/* FOTOGRAFÍA REAL FLOTANTE (Animación suave de levitación física) */}
                <motion.div
                  animate={{ y: [0, -14, 0] }}
                  transition={{
                    duration: 4.6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative z-10 flex items-center justify-center"
                >
                  <img
                    src={currentSlide.src}
                    alt={currentSlide.alt}
                    className={`w-auto h-auto ${currentSlide.maxHeight} ${currentSlide.maxWidth} object-contain drop-shadow-[0_22px_38px_rgba(0,0,0,0.16)] pointer-events-none select-none`}
                  />
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

                {/* Título de la pieza y micro-descripción */}
                <div className="mt-4 text-center max-w-md mx-auto">
                  <h4 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
                    {currentSlide.title}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
                    {currentSlide.detail}
                  </p>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>

          {/* BOTÓN SIGUIENTE (FLECHA DERECHA) */}
          <button
            onClick={() => paginate(1)}
            aria-label="Ver siguiente herramienta"
            className="flex-shrink-0 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 border border-zinc-200/90 text-zinc-700 hover:text-black hover:border-zinc-400 hover:bg-white shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>

        </div>

        {/* PIE DEL VISOR: CONTADOR E INDICACIÓN DE DESLIZAMIENTO */}
        <div className="relative z-10 mt-3 flex flex-col items-center gap-1 text-zinc-400">
          <div className="flex items-center gap-3 text-[11px] font-mono tracking-wider font-semibold">
            <span className="text-zinc-900 font-bold">{`0${currentIndex + 1}`}</span>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-400">{`0${slides.length}`}</span>
            <span className="text-zinc-300">·</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest hidden sm:inline">Desliza para explorar el kit</span>
          </div>

          <div className="mt-2 text-zinc-300">
            <ArrowDown size={14} className="animate-bounce" />
          </div>
        </div>

      </div>

      {/* ==================================================================== */}
      {/* 2. ZONA MEDIA: LOGO DE LA MARCA DEBAJO DE LAS GAFAS & MODELO         */}
      {/* ==================================================================== */}
      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-12 sm:pb-16 text-center border-t border-zinc-100">

        {/* Logotipo oficial de la marca incorporado en el centro */}
        <div className="flex flex-col items-center justify-center mb-6">
          {resolvedLogo ? (
            <img
              src={resolvedLogo}
              alt={data.brandName}
              className="h-14 sm:h-16 md:h-20 w-auto max-w-[240px] sm:max-w-[280px] object-contain drop-shadow-sm"
            />
          ) : (
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900">
              {data.brandName}
            </h2>
          )}
        </div>

        {/* Eyebrow de ingeniería y autor */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 border border-zinc-200/80 mb-3.5">
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-zinc-600 uppercase">
            {data.eyebrow}
          </span>
        </div>

        {/* Título de Producto & Subtítulo */}
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 leading-tight">
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
              <span>Sitio Oficial Tattoo Vision</span>
              <ExternalLink size={14} className="text-zinc-400 group-hover:text-zinc-700 transition-colors" />
            </a>
          )}
        </div>

      </div>

      {/* ==================================================================== */}
      {/* 3. DESGLOSE DEL SISTEMA DE HARDWARE (4 COMPONENTES INTEGRALES)        */}
      {/* ==================================================================== */}
      {data.systemTools?.length > 0 && (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-12">
          <div className="text-center mb-7">
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 font-bold">
              Arquitectura del Kit
            </p>
            <h4 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight mt-0.5">
              Sistema Integral de Precisión
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
      {/* 4. ZONA EDITORIAL PREMIUM: BENTO GRID DE INGENIERÍA & EN ACCIÓN      */}
      {/* ==================================================================== */}
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* TARJETA DESTACADA: Demostración fotográfica real en sesión de tatuaje (Col span 7) */}
          <div className="md:col-span-7 rounded-3xl bg-zinc-900 text-white overflow-hidden p-6 sm:p-8 flex flex-col justify-between shadow-xl relative group">

            {/* Fotografía de demostración real (el tatuador mirando a través del lente polarizado) */}
            <div className="relative w-full h-[240px] sm:h-[300px] rounded-2xl overflow-hidden mb-6 bg-zinc-950">
              <img
                src="/supply-assets/tattoovision/tattoo_demonstration.webp"
                alt="Demostración real de lentes Tattoo Vision cancelando reflejos sobre tatuaje"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-zinc-300 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <span className="text-blue-400 font-bold">Lente Izquierdo: Polarizado</span>
                <span className="text-zinc-400">Exterior: Brillo Superficial</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-blue-400 uppercase">
                  TECNOLOGÍA DE POLARIZACIÓN CRUZADA
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold">
                  Zero Glare
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Visión Real de la Dermis sin Reflejos
              </h4>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mt-2">
                Al sincronizar el filtro de las gafas con la luz polarizada, se anula el 100% del rebote de luz especular provocado por la vaselina, el brillo de las tintas y los fluidos. El artista evalúa la saturación real, el empastado y los degradados en tiempo real sin tener que esperar la cicatrización.
              </p>
            </div>

          </div>

          {/* COLUMNA DERECHA: 2 Tarjetas estratégicas de hardware (Col span 5) */}
          <div className="md:col-span-5 flex flex-col gap-6">

            {/* TARJETA 1: Sistema Clip-On Magnético */}
            <div className="rounded-3xl bg-zinc-50 border border-zinc-200/80 p-6 sm:p-7 flex flex-col justify-between hover:bg-white hover:border-zinc-300 transition-all shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-blue-600 uppercase">
                    MODULARIDAD DUAL
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-zinc-200/70 text-zinc-700 font-semibold">
                    Neodimio N52
                  </span>
                </div>
                <h4 className="text-lg font-bold text-zinc-900 tracking-tight">
                  Clip-On Magnético Instantáneo
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mt-2">
                  El sobrelente polarizado se acopla o retira en una fracción de segundo gracias a micro-imanes de neodimio de alta atracción integrados en los vértices del armazón.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span>Acople firme que no se desprende con el movimiento</span>
              </div>
            </div>

            {/* TARJETA 2: Montura TR90 y Compatibilidad RX */}
            <div className="rounded-3xl bg-zinc-50 border border-zinc-200/80 p-6 sm:p-7 flex flex-col justify-between hover:bg-white hover:border-zinc-300 transition-all shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-blue-600 uppercase">
                    ERGONOMÍA & FÓRMULA ÓPTICA
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-zinc-200/70 text-zinc-700 font-semibold">
                    TR90 Suizo
                  </span>
                </div>
                <h4 className="text-lg font-bold text-zinc-900 tracking-tight">
                  Polímero Ultraligero & Apta para Fórmula
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mt-2">
                  Estructura en TR90 suizo con memoria elástica indeformable (peso pluma de 42g). Permite que cualquier óptica adapte tus cristales formulados (miopía o astigmatismo) en la montura base sin perder la función polarizada del Clip-On.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span>Compatible con cristales formulados y de descanso</span>
              </div>
            </div>

          </div>

        </div>

        {/* ==================================================================== */}
        {/* 5. FRANJA INFERIOR: MÉTRICAS DE HARDWARE Y ACCESO A CATÁLOGO         */}
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
