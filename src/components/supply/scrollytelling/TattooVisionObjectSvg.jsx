import { motion } from 'motion/react'

/**
 * Renderizado vectorial por capas independientes para las GAFAS POLARIZADAS TR90
 * REALES DE TATTOO VISION creadas por HERNÁN YEPES.
 *
 * Muestra el diseño auténtico de armazón TR90 negro mate, lentes polarizados
 * lineales semitransparentes (que eliminan el 100% de los reflejos en combinación
 * con la luz polarizada), bisagras metálicas y cordón de sujeción ergonómico.
 */

export function TattooVisionObjectSvg({
  layerTransforms = {},
  activeLayer = null,
  onHoverLayer,
}) {
  return (
    <div className="relative w-full max-w-[620px] h-[340px] sm:h-[400px] flex items-center justify-center select-none perspective-[1200px]">

      {/* SVG Canvas de Alta Definición */}
      <svg
        viewBox="0 0 720 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
      >
        <defs>
          {/* TR90 Negro Mate con sombreado sutil de polímero suizo */}
          <linearGradient id="tr90Matte" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e2229" />
            <stop offset="35%" stopColor="#2a303c" />
            <stop offset="70%" stopColor="#16191f" />
            <stop offset="100%" stopColor="#0f1115" />
          </linearGradient>

          <linearGradient id="tr90Bevel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#475569" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
          </linearGradient>

          {/* Lente polarizado lineal semitransparente (aclarado para no oscurecer la sesión de tatuaje) */}
          <linearGradient id="polarizedLens" x1="0%" y1="0%" x2="100%" y2="85%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.28" />
            <stop offset="35%" stopColor="#0284c7" stopOpacity="0.18" />
            <stop offset="70%" stopColor="#0369a1" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.32" />
          </linearGradient>

          {/* Destello de polarización óptica */}
          <linearGradient id="reflectionGlint" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
          </linearGradient>

          {/* Bisagras mecánicas de acero inoxidable */}
          <linearGradient id="steelHinge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          {/* Cordón textil trenzado */}
          <linearGradient id="lanyardBraid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
        </defs>

        {/* ============================================================ */}
        {/* CAPA 04: CORDÓN DE SEGURIDAD AJUSTABLE                       */}
        {/* ============================================================ */}
        <motion.g
          id="layer-lanyard"
          style={layerTransforms.lanyard}
          className="cursor-pointer transition-opacity"
          opacity={activeLayer && activeLayer !== 'lanyard' ? 0.35 : 1}
          onMouseEnter={() => onHoverLayer && onHoverLayer('lanyard')}
          onMouseLeave={() => onHoverLayer && onHoverLayer(null)}
        >
          {/* Lazo del cordón que cae por detrás */}
          <path
            d="M92 195 C60 270 120 370 360 370 C600 370 660 270 628 195"
            stroke="url(#lanyardBraid)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="6 3"
            fill="none"
          />

          {/* Pasador de tensión regulable central */}
          <circle cx="360" cy="370" r="10" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
          <circle cx="360" cy="370" r="4" fill="#10b981" />

          {/* Terminales de sujeción de goma a las puntas de las patillas */}
          <rect x="86" y="190" width="12" height="18" rx="4" fill="#047857" stroke="#10b981" strokeWidth="1" />
          <rect x="622" y="190" width="12" height="18" rx="4" fill="#047857" stroke="#10b981" strokeWidth="1" />
        </motion.g>

        {/* ============================================================ */}
        {/* CAPA 03: PATILLAS LATERALES Y BISAGRAS DE PRECISIÓN          */}
        {/* ============================================================ */}
        <motion.g
          id="layer-temples"
          style={layerTransforms.temples}
          className="cursor-pointer transition-opacity"
          opacity={activeLayer && activeLayer !== 'temples' ? 0.35 : 1}
          onMouseEnter={() => onHoverLayer && onHoverLayer('temples')}
          onMouseLeave={() => onHoverLayer && onHoverLayer(null)}
        >
          {/* Patilla Izquierda TR90 en perspectiva */}
          <path
            d="M192 192 L96 172 C80 168 76 176 82 188 L94 204 L190 208 Z"
            fill="url(#tr90Matte)"
            stroke="#0f172a"
            strokeWidth="1.5"
          />
          {/* Bisagra de acero inoxidable izquierda */}
          <rect x="186" y="194" width="8" height="12" rx="2" fill="url(#steelHinge)" stroke="#334155" strokeWidth="1" />
          <circle cx="190" cy="200" r="1.5" fill="#0f172a" />

          {/* Patilla Derecha TR90 en perspectiva */}
          <path
            d="M528 192 L624 172 C640 168 644 176 638 188 L626 204 L530 208 Z"
            fill="url(#tr90Matte)"
            stroke="#0f172a"
            strokeWidth="1.5"
          />
          {/* Bisagra de acero inoxidable derecha */}
          <rect x="526" y="194" width="8" height="12" rx="2" fill="url(#steelHinge)" stroke="#334155" strokeWidth="1" />
          <circle cx="530" cy="200" r="1.5" fill="#0f172a" />

          {/* Grabado discreto en la patilla izquierda */}
          <text x="110" y="192" fill="#64748b" fontSize="7" fontFamily="sans-serif" fontWeight="bold" letterSpacing="0.1em">
            TR90 · HERNÁN YEPES
          </text>
        </motion.g>

        {/* ============================================================ */}
        {/* CAPA 02: ARMAZÓN FRONTAL TR90 SU IZO (Diseño Real Yepes)     */}
        {/* ============================================================ */}
        <motion.g
          id="layer-frame"
          style={layerTransforms.frame}
          className="cursor-pointer transition-opacity"
          opacity={activeLayer && activeLayer !== 'frame' ? 0.35 : 1}
          onMouseEnter={() => onHoverLayer && onHoverLayer('frame')}
          onMouseLeave={() => onHoverLayer && onHoverLayer(null)}
        >
          {/* Marco exterior completo de las gafas estilo Wayfarer/D-frame ergonómico */}
          <path
            d="
              M176 172
              C210 166 310 168 344 186
              C352 190 368 190 376 186
              C410 168 510 166 544 172
              C554 174 558 186 552 202
              L538 250
              C528 278 500 292 450 294
              C392 296 366 264 362 238
              C360 226 348 226 346 238
              C342 264 316 296 258 294
              C208 292 180 278 170 250
              L156 202
              C150 186 160 174 176 172 Z
            "
            fill="url(#tr90Matte)"
            stroke="#090d16"
            strokeWidth="2.5"
          />

          {/* Biselado superior de luz para dar sensación de volumen tridimensional al TR90 */}
          <path
            d="M178 174 C215 168 305 170 342 188 C354 192 366 192 378 188 C415 170 505 168 542 174"
            stroke="url(#tr90Bevel)"
            strokeWidth="1.8"
            fill="none"
          />

          {/* Vaciado interior izquierdo para el cristal */}
          <path
            d="M192 186 C225 180 300 182 322 198 C332 205 334 220 326 238 C316 262 292 280 256 282 C214 284 190 262 184 236 C180 216 182 192 192 186 Z"
            fill="#090d16"
            stroke="#2a303c"
            strokeWidth="1.5"
          />

          {/* Vaciado interior derecho para el cristal */}
          <path
            d="M528 186 C495 180 420 182 398 198 C388 205 386 220 394 238 C404 262 428 280 464 282 C506 284 530 262 536 236 C540 216 538 192 528 186 Z"
            fill="#090d16"
            stroke="#2a303c"
            strokeWidth="1.5"
          />

          {/* Remaches metálicos clásicos en las esquinas superiores */}
          <ellipse cx="174" cy="182" rx="3" ry="1.5" fill="url(#steelHinge)" />
          <ellipse cx="546" cy="182" rx="3" ry="1.5" fill="url(#steelHinge)" />

          {/* Puente nasal anatómico suave integrado */}
          <path
            d="M346 224 C352 220 368 220 374 224"
            stroke="#475569"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.g>

        {/* ============================================================ */}
        {/* CAPA 01: LENTES POLARIZADOS LINEALES SEMITRANSPARENTES       */}
        {/* ============================================================ */}
        <motion.g
          id="layer-optics"
          style={layerTransforms.optics}
          className="cursor-pointer transition-opacity"
          opacity={activeLayer && activeLayer !== 'optics' ? 0.35 : 1}
          onMouseEnter={() => onHoverLayer && onHoverLayer('optics')}
          onMouseLeave={() => onHoverLayer && onHoverLayer(null)}
        >
          {/* Lente Izquierdo Polarizado Lineal Semitransparente */}
          <path
            d="M194 187 C226 181 299 183 320 199 C330 206 332 219 324 237 C314 260 291 278 256 280 C216 282 192 260 186 235 C182 215 184 193 194 187 Z"
            fill="url(#polarizedLens)"
            stroke="#38bdf8"
            strokeWidth="1.6"
          />

          {/* Lente Derecho Polarizado Lineal Semitransparente */}
          <path
            d="M526 187 C494 181 421 183 400 199 C390 206 388 219 396 237 C406 260 429 278 464 280 C504 282 528 260 534 235 C538 215 536 193 526 187 Z"
            fill="url(#polarizedLens)"
            stroke="#38bdf8"
            strokeWidth="1.6"
          />

          {/* Reflejo diagonal sutil de polarización óptica */}
          <path
            d="M200 192 L290 196 L240 274 L190 240 Z"
            fill="url(#reflectionGlint)"
            opacity="0.35"
          />
          <path
            d="M520 192 L430 196 L480 274 L530 240 Z"
            fill="url(#reflectionGlint)"
            opacity="0.35"
          />

          {/* Indicador de eje de polarización lineal y firma óptica de Tattoo Vision */}
          <g opacity="0.8">
            <line x1="250" y1="210" x2="250" y2="250" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 2" />
            <line x1="244" y1="230" x2="256" y2="230" stroke="#38bdf8" strokeWidth="0.8" />
            <text x="214" y="248" fill="#38bdf8" fontSize="6.5" fontFamily="monospace" letterSpacing="0.08em">
              POLARIZED · 90°
            </text>
          </g>

          <g opacity="0.8">
            <line x1="470" y1="210" x2="470" y2="250" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 2" />
            <line x1="464" y1="230" x2="476" y2="230" stroke="#38bdf8" strokeWidth="0.8" />
            <text x="434" y="248" fill="#38bdf8" fontSize="6.5" fontFamily="monospace" letterSpacing="0.08em">
              POLARIZED · 90°
            </text>
          </g>

          {/* Sello de autenticidad en esquina superior del lente */}
          <text x="300" y="202" fill="#7dd3fc" fontSize="5.5" fontFamily="monospace" opacity="0.7">
            TATTOO VISION
          </text>
          <text x="404" y="202" fill="#7dd3fc" fontSize="5.5" fontFamily="monospace" opacity="0.7">
            TATTOO VISION
          </text>
        </motion.g>

      </svg>
    </div>
  )
}
