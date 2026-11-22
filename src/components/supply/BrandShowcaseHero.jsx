import { motion } from 'motion/react'
import { Award, ChevronDown, CheckCircle2, ShieldCheck, Sparkles, ArrowDown } from 'lucide-react'
import { BRAND_SHOWCASE_DATA } from './brandShowcaseData'

/**
 * Componente MAESTRO Premium para Páginas de Marca en INKognito Supply.
 *
 * Jerarquía visual de alta gama (Inspirado en diseño editorial Apple Pro / Leica):
 * 1. ZONA SUPERIOR: Exclusivamente el Navbar y el producto fotográfico real flotando en el centro con sombra realista.
 * 2. ZONA MEDIA: Logotipo oficial de la marca incorporado debajo del producto, con insignia de distribuidor oficial y modelo.
 * 3. ZONA EDITORIAL (BENTO GRID): Distribución estratégica de información técnica con demostración visual real en piel.
 * 4. FRANJA DE TELEMETRÍA & ACCESO AL CATÁLOGO.
 */

export default function BrandShowcaseHero({
  brandKey = 'tattoo-vision',
  logoUrl = null,
  distribuidorOficial = false,
  onExploreCatalog,
}) {
  const data = BRAND_SHOWCASE_DATA[brandKey] || BRAND_SHOWCASE_DATA['tattoo-vision']

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
      {/* 1. ZONA SUPERIOR: EXCLUSIVAMENTE EL PRODUCTO FLOTANDO CON SU SOMBRA  */}
      {/* ==================================================================== */}
      <div className="relative w-full min-h-[58vh] sm:min-h-[64vh] flex flex-col items-center justify-center pt-24 sm:pt-28 pb-8 px-4 overflow-hidden">

        {/* Resplandor ambiental de acento difuso detrás del producto */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[580px] h-[260px] sm:h-[340px] rounded-full blur-[100px] pointer-events-none opacity-[0.08]"
          style={{ backgroundColor: data.accentColor }}
        />

        {/* CONTENEDOR DEL PRODUCTO FLOTANTE */}
        <div className="relative flex flex-col items-center justify-center w-full max-w-xl mx-auto my-auto z-10">

          {/* FOTOGRAFÍA REAL FLOTANTE (Movimiento de levitación suave) */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{
              duration: 4.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10 w-full flex items-center justify-center"
          >
            <img
              src={data.productImage}
              alt={data.productAlt}
              className="w-full max-w-[420px] sm:max-w-[500px] md:max-w-[540px] h-auto object-contain select-none pointer-events-none drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)]"
            />
          </motion.div>

          {/* SOMBRA DE CONTACTO REALISTA EN EL SUELO (Respira en sincronía inversa con la elevación) */}
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
            className="w-[280px] sm:w-[380px] md:w-[420px] h-7 mt-2 rounded-[100%] bg-gradient-to-r from-zinc-900/5 via-zinc-900/55 to-zinc-900/5 blur-xl pointer-events-none"
          />

          {/* Micro-indicador de producto oficial */}
          <div className="mt-4 flex items-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{data.badge}</span>
          </div>

        </div>

        {/* Flecha suave invitando a descubrir la información */}
        <div className="relative z-10 mt-6 flex flex-col items-center text-zinc-300">
          <ArrowDown size={14} className="animate-bounce" />
        </div>

      </div>

      {/* ==================================================================== */}
      {/* 2. ZONA MEDIA: LOGO DE LA MARCA DEBAJO DE LAS GAFAS & MODELO         */}
      {/* ==================================================================== */}
      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-12 sm:pb-16 text-center border-t border-zinc-100">

        {/* Logotipo oficial de la marca incorporado en el centro */}
        <div className="flex flex-col items-center justify-center mb-6">
          {logoUrl ? (
            <div className="flex flex-col items-center">
              <img
                src={logoUrl}
                alt={data.brandName}
                className="h-14 sm:h-16 md:h-20 w-auto max-w-[220px] object-contain drop-shadow-sm"
              />
              {distribuidorOficial && (
                <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-black text-[10px] font-black uppercase tracking-widest bg-amber-400 shadow-sm">
                  <Award size={12} /> Distribuidor Oficial
                </span>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900">
                {data.brandName}
              </h2>
              {distribuidorOficial && (
                <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-black text-[10px] font-black uppercase tracking-widest bg-amber-400">
                  <Award size={12} /> Distribuidor Oficial
                </span>
              )}
            </div>
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

      </div>

      {/* ==================================================================== */}
      {/* 3. ZONA EDITORIAL PREMIUM: BENTO GRID DE INGENIERÍA & EN ACCIÓN      */}
      {/* ==================================================================== */}
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* TARJETA DESTACADA: Demostración fotográfica real en sesión de tatuaje (Col span 7) */}
          <div className="md:col-span-7 rounded-3xl bg-zinc-900 text-white overflow-hidden p-6 sm:p-8 flex flex-col justify-between shadow-xl relative group">

            {/* Fotografía de demostración real (kit_7: el tatuador mirando a través del lente polarizado) */}
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
        {/* 4. FRANJA INFERIOR: MÉTRICAS DE HARDWARE Y BOTÓN AL CATÁLOGO         */}
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

          {/* Botón directo y protagonista al catálogo comercial */}
          <button
            onClick={handleScrollDown}
            className="group flex items-center gap-3 px-7 py-3.5 rounded-full bg-zinc-900 hover:bg-black text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Ver Catálogo de Productos</span>
            <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
          </button>

        </div>

      </div>

    </section>
  )
}
