import { motion } from 'motion/react'

/**
 * Renderizado de Scrollytelling basado en FOTOGRAFÍAS REALES DEL PRODUCTO FÍSICO
 * de TATTOO VISION 2 (Hernán Yepes).
 *
 * Utiliza los recortes en alta definición con canal alfa transparente de:
 * 1. La montura real TR90 con lentes transparentes y grabado de filigrana.
 * 2. El sobrelente magnético Clip-On real con lentes oscuros polarizados e imanes.
 */

export default function TattooVisionRealObject({
  layerTransforms = {},
  activeLayer = null,
  onHoverLayer,
}) {
  return (
    <div className="relative w-full max-w-[680px] h-[340px] sm:h-[420px] flex items-center justify-center select-none perspective-[1200px]">

      {/* Resplandor técnico de fondo detrás de las gafas */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[360px] sm:w-[480px] h-[220px] rounded-full bg-blue-600/15 blur-[90px]" />
      </div>

      {/* CONTENEDOR 3D DE LAS FOTOGRAFÍAS REALES */}
      <div className="relative w-[520px] sm:w-[620px] h-[320px] sm:h-[380px] flex items-center justify-center">

        {/* ============================================================ */}
        {/* CAPA BASE: FOTOGRAFÍA REAL DE LA MONTURA TR90 TATTOO VISION  */}
        {/* ============================================================ */}
        <motion.div
          id="layer-frame-real"
          style={layerTransforms.frame}
          className="absolute inset-0 flex items-center justify-center transition-opacity"
          animate={{
            opacity: activeLayer && activeLayer !== 'frame' && activeLayer !== 'base_lenses' ? 0.35 : 1,
          }}
          onMouseEnter={() => onHoverLayer && onHoverLayer('frame')}
          onMouseLeave={() => onHoverLayer && onHoverLayer(null)}
        >
          <img
            src="/supply-assets/tattoovision/glasses_base.webp"
            alt="Montura TR90 Tattoo Vision Real de Hernán Yepes"
            className="w-[420px] sm:w-[520px] h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.4)] pointer-events-none"
          />

          {/* Hotspot interactivo 1: Cristales Base aptos para fórmula */}
          <div className="absolute top-[52%] left-[42%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto group">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500 border border-white" />
            </span>
          </div>

          {/* Hotspot interactivo 2: Grabado de filigrana y logo en patilla */}
          <div className="absolute top-[58%] right-[22%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto group">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white" />
            </span>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* CAPA FRONTAL: FOTOGRAFÍA REAL DEL SOBRELENTE CLIP-ON MAGNÉTICO */}
        {/* ============================================================ */}
        <motion.div
          id="layer-clipon-real"
          style={layerTransforms.clipon}
          className="absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity z-20"
          animate={{
            opacity: activeLayer && activeLayer !== 'clipon' ? 0.4 : 1,
          }}
          onMouseEnter={() => onHoverLayer && onHoverLayer('clipon')}
          onMouseLeave={() => onHoverLayer && onHoverLayer(null)}
        >
          {/* El Clip-on fotográfico real: alineado con la montura y desplazable en scroll */}
          <div className="relative translate-x-[-38px] translate-y-[28px] sm:translate-x-[-48px] sm:translate-y-[34px]">
            <img
              src="/supply-assets/tattoovision/clipon_polarizado.webp"
              alt="Sobrelente Magnético Polarizado Clip-On Real Tattoo Vision"
              className="w-[280px] sm:w-[350px] h-auto object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.65)] pointer-events-none"
            />

            {/* Efecto de pulso en el imán de neodimio izquierdo */}
            <div className="absolute top-[6%] left-[3%] pointer-events-auto">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300 border border-white" />
              </span>
            </div>

            {/* Efecto de pulso en el imán de neodimio derecho */}
            <div className="absolute bottom-[28%] right-[3%] pointer-events-auto">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300 border border-white" />
              </span>
            </div>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* RETÍCULA DE INGENIERÍA Y LÍNEAS GUÍA DE ACOPLE MAGNÉTICO      */}
        {/* ============================================================ */}
        <svg
          viewBox="0 0 620 380"
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
        >
          {/* Eje de acople magnético frontal */}
          <line
            x1="230"
            y1="195"
            x2="175"
            y2="245"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            opacity="0.45"
          />
          <line
            x1="390"
            y1="180"
            x2="335"
            y2="230"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            opacity="0.45"
          />

          {/* Rótulo técnico de acople */}
          <text
            x="115"
            y="280"
            fill="#38bdf8"
            fontSize="8"
            fontFamily="monospace"
            letterSpacing="0.12em"
            opacity="0.8"
          >
            N52 MAGNETIC DOCKING // 0.02s
          </text>
        </svg>

      </div>

    </div>
  )
}
