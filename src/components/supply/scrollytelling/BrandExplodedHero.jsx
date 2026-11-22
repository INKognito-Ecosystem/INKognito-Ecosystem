import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react'
import {
  Layers, Cpu, Eye, ShieldCheck, ChevronDown,
  Sparkles, Sliders, ArrowDown, Activity, Info, Award
} from 'lucide-react'
import { BRAND_EXPLODED_CONFIGS } from './brandExplodedData'
import TattooVisionRealObject from './TattooVisionRealObject'

/**
 * Componente MAESTRO universal de Scrollytelling y Despiece Técnico (Estilo Wiltech).
 * Utiliza una jerarquía fija para todas las marcas:
 * - Pinned sticky viewport (h-screen fijado en track de 300vh).
 * - Separación cinemática de capas 3D vinculada a useScroll.
 * - Incorporación del logo oficial de la marca en la cabecera.
 * - Callouts de telemetría e ingeniería con puntos de anclaje.
 * - Modo responsivo con offsets adaptativos para móvil y escritorio.
 */

export default function BrandExplodedHero({
  brandKey = 'tattoo-vision',
  logoUrl = null,
  distribuidorOficial = false,
  onExploreCatalog,
}) {
  const config = BRAND_EXPLODED_CONFIGS[brandKey] || BRAND_EXPLODED_CONFIGS['tattoo-vision']
  const containerRef = useRef(null)
  const [activeLayerId, setActiveLayerId] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detección responsiva para conmutar offsets de escritorio vs móvil
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Monitoreo del avance de scroll del contenedor padre (0 a 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Interpolación general de despiece (arranca al 15% y se completa al 65%)
  const explosionFactor = useTransform(scrollYProgress, [0.12, 0.65], [0, 1])

  // Fase 1: Opacidad del titular inicial (se atenúa a medida que se despieza)
  const headerOpacity = useTransform(scrollYProgress, [0.0, 0.22], [1, 0.15])
  const headerScale = useTransform(scrollYProgress, [0.0, 0.22], [1, 0.95])

  // Fase 2: Entrada y visibilidad de las fichas técnicas / callouts
  const calloutsOpacity = useTransform(scrollYProgress, [0.35, 0.50, 0.82, 0.95], [0, 1, 1, 0])
  const calloutsTranslateY = useTransform(scrollYProgress, [0.35, 0.50], [20, 0])

  // Fase 3: HUD de progreso de telemetría
  const hudProgress = useTransform(scrollYProgress, [0, 1], [0, 100])

  // Cálculo dinámico de transformaciones para cada capa del objeto
  const layerTransforms = {}
  config.layers.forEach((layer) => {
    const targetOffset = isMobile ? layer.mobileOffset : layer.desktopOffset
    // Interpolamos posición X, Y, Scale y Rotate respecto a explosionFactor
    const x = useTransform(explosionFactor, [0, 1], [0, targetOffset.x])
    const y = useTransform(explosionFactor, [0, 1], [0, targetOffset.y])
    const scale = useTransform(explosionFactor, [0, 1], [1, targetOffset.scale])
    const rotate = useTransform(explosionFactor, [0, 1], [0, targetOffset.rotate])

    layerTransforms[layer.id] = { x, y, scale, rotate }
  })

  const scrollToCatalog = () => {
    if (onExploreCatalog) {
      onExploreCatalog()
      return
    }
    const cat = document.getElementById('catalogo-marca')
    if (cat) {
      cat.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollBy({ top: window.innerHeight * 2, behavior: 'smooth' })
    }
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-zinc-950 text-white selection:bg-blue-600 selection:text-white"
      style={{ height: isMobile ? '240vh' : '290vh' }}
    >
      {/* VIEWPORT FIJO (Sticky): Se mantiene inmóvil en pantalla mientras el usuario hace scroll */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden px-4 md:px-8 py-5 select-none">

        {/* Patrón de Blueprint / Cuadrícula milimétrica técnica de fondo */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #38bdf8 1px, transparent 1px),
              linear-gradient(to bottom, #38bdf8 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Resplandor ambiental de acento en el centro */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-20"
          style={{ backgroundColor: config.colorAccent }}
        />

        {/* ========================================================== */}
        {/* ENCABEZADO SUPERIOR / HUD TÉCNICO & LOGO OFICIAL           */}
        {/* ========================================================== */}
        <div className="relative z-20 flex items-center justify-between gap-4 pt-16 md:pt-4">
          <div className="flex items-center gap-3 md:gap-4">
            {logoUrl && (
              <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg shadow-sm">
                <img
                  src={logoUrl}
                  alt={config.brandName}
                  className="h-6 md:h-8 w-auto max-w-[120px] object-contain"
                />
              </div>
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] md:text-xs font-mono font-semibold tracking-[0.2em] text-zinc-300 uppercase">
                  {config.badge}
                </span>
                {distribuidorOficial && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-black text-[9px] font-black uppercase tracking-wider bg-amber-400">
                    <Award size={10} /> Oficial
                  </span>
                )}
              </div>
              <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                SISTEMA CLIP-ON MAGNÉTICO // INGENIERÍA ÓPTICA
              </span>
            </div>
          </div>

          {/* Botón rápido para saltar al catálogo */}
          <button
            onClick={scrollToCatalog}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white text-zinc-300 hover:text-black border border-white/15 text-xs font-semibold tracking-wider uppercase transition-all backdrop-blur-md"
          >
            <span>Ver Catálogo</span>
            <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* ========================================================== */}
        {/* TITULAR PRINCIPAL FLOTANTE (Fase 1 de Ensamblaje)          */}
        {/* ========================================================== */}
        <motion.div
          style={{ opacity: headerOpacity, scale: headerScale }}
          className="relative z-20 text-center max-w-2xl mx-auto pointer-events-none mt-2 md:mt-0"
        >
          <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.35em] text-blue-400 mb-1">
            {config.eyebrow}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            {config.headline}
          </h2>
          <p className="text-zinc-400 text-xs md:text-sm mt-2 max-w-lg mx-auto font-normal hidden sm:block">
            {config.subheadline}
          </p>

          <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-zinc-400 font-mono">
            <span className="animate-bounce">↓</span>
            <span>Desplaza hacia abajo para iniciar el despiece</span>
          </div>
        </motion.div>

        {/* ========================================================== */}
        {/* ÁREA CENTRAL: OBJETO FÍSICO Y CALLOUTS DE DESPIECE          */}
        {/* ========================================================== */}
        <div className="relative z-10 flex-1 flex items-center justify-center w-full min-h-0 my-auto">

          {/* CALLOUTS LATERALES DE ESCRITORIO (Izquierda) */}
          <motion.div
            style={{ opacity: calloutsOpacity, y: calloutsTranslateY }}
            className="hidden lg:flex flex-col gap-4 absolute left-4 xl:left-8 max-w-xs z-20"
          >
            {config.layers.slice(0, 2).map((layer) => (
              <div
                key={layer.id}
                onMouseEnter={() => setActiveLayerId(layer.id)}
                onMouseLeave={() => setActiveLayerId(null)}
                className={`p-4 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                  activeLayerId === layer.id
                    ? 'bg-blue-950/40 border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.3)] scale-[1.02]'
                    : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-blue-400">
                    {layer.number} // {layer.category}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: layer.accentColor }}
                  />
                </div>
                <h4 className="text-sm font-bold text-white tracking-wide">{layer.title}</h4>
                <p className="text-[12px] text-zinc-400 leading-relaxed mt-1">
                  {layer.description}
                </p>
                <div className="mt-2 pt-2 border-t border-zinc-800 flex flex-wrap gap-1">
                  {layer.specs.map((sp, idx) => (
                    <span key={idx} className="text-[10px] font-mono text-zinc-300 bg-white/5 px-2 py-0.5 rounded">
                      {sp}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* RENDERIZADO DEL OBJETO (Fotografías reales despiezadas con física Motion) */}
          <div className="relative flex items-center justify-center w-full">
            <TattooVisionRealObject
              layerTransforms={layerTransforms}
              activeLayer={activeLayerId}
              onHoverLayer={setActiveLayerId}
            />
          </div>

          {/* CALLOUTS LATERALES DE ESCRITORIO (Derecha) */}
          <motion.div
            style={{ opacity: calloutsOpacity, y: calloutsTranslateY }}
            className="hidden lg:flex flex-col gap-4 absolute right-4 xl:right-8 max-w-xs z-20"
          >
            {config.layers.slice(2, 4).map((layer) => (
              <div
                key={layer.id}
                onMouseEnter={() => setActiveLayerId(layer.id)}
                onMouseLeave={() => setActiveLayerId(null)}
                className={`p-4 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                  activeLayerId === layer.id
                    ? 'bg-blue-950/40 border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.3)] scale-[1.02]'
                    : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-blue-400">
                    {layer.number} // {layer.category}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: layer.accentColor }}
                  />
                </div>
                <h4 className="text-sm font-bold text-white tracking-wide">{layer.title}</h4>
                <p className="text-[12px] text-zinc-400 leading-relaxed mt-1">
                  {layer.description}
                </p>
                <div className="mt-2 pt-2 border-t border-zinc-800 flex flex-wrap gap-1">
                  {layer.specs.map((sp, idx) => (
                    <span key={idx} className="text-[10px] font-mono text-zinc-300 bg-white/5 px-2 py-0.5 rounded">
                      {sp}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

        </div>

        {/* CALLOUTS PARA DISPOSITIVOS MÓVILES (Fichas compactas deslizables abajo) */}
        <motion.div
          style={{ opacity: calloutsOpacity }}
          className="lg:hidden relative z-20 w-full overflow-x-auto no-scrollbar flex gap-2 pb-2 -mx-2 px-2"
        >
          {config.layers.map((layer) => (
            <div
              key={layer.id}
              onClick={() => setActiveLayerId(activeLayerId === layer.id ? null : layer.id)}
              className={`flex-shrink-0 w-[240px] p-2.5 rounded-lg border backdrop-blur-md transition-all ${
                activeLayerId === layer.id
                  ? 'bg-blue-950/60 border-blue-400'
                  : 'bg-zinc-900/80 border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[9px] font-mono font-bold text-blue-400">
                  {layer.number} // {layer.tag}
                </span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: layer.accentColor }} />
              </div>
              <h5 className="text-[11px] font-bold text-white leading-tight">{layer.title}</h5>
              <p className="text-[10px] text-zinc-400 line-clamp-2 mt-0.5">{layer.description}</p>
            </div>
          ))}
        </motion.div>

        {/* ========================================================== */}
        {/* BARRA INFERIOR / TELEMETRÍA Y MÉTRICAS DE HARDWARE         */}
        {/* ========================================================== */}
        <div className="relative z-20 pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-400">

          {/* Estadísticas clave de ingeniería */}
          <div className="grid grid-cols-2 sm:flex items-center gap-4 md:gap-8 w-full sm:w-auto">
            {config.stats.map((st, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-[10px] uppercase text-zinc-500 tracking-wider">{st.label}</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-white font-sans">{st.value}</span>
                  <span className="text-[9px] text-zinc-400 hidden md:inline">({st.note})</span>
                </div>
              </div>
            ))}
          </div>

          {/* Barra de progreso de la animación de scroll */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest hidden sm:inline">
              Avance de Despiece
            </span>
            <div className="w-24 md:w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: useTransform(hudProgress, (v) => `${v}%`) }}
              />
            </div>
            <button
              onClick={scrollToCatalog}
              aria-label="Ir al catálogo"
              className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowDown size={14} />
            </button>
          </div>

        </div>

      </div>
    </section>
  )
}
