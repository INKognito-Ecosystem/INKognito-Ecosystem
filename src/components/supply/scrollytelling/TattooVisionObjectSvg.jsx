import { motion } from 'motion/react'

/**
 * Renderizado vectorial por capas independientes para las GAFAS TATTOO VISION 2
 * CON SISTEMA CLIP-ON MAGNÉTICO (El modelo más vendido e icónico de HERNÁN YEPES).
 *
 * Muestra el despiece de ingeniería real:
 * - Sobrelente Magnético (Clip-On) con imanes de neodimio y lentes polarizados lineales.
 * - Lentes transparentes base (compatibles con fórmula médica u óptica).
 * - Armazón principal en polímero suizo TR90 negro mate con receptores magnéticos.
 * - Patillas biomecánicas, bisagras de acero inoxidable y cordón de seguridad.
 */

export function TattooVisionObjectSvg({
  layerTransforms = {},
  activeLayer = null,
  onHoverLayer,
}) {
  return (
    <div className="relative w-full max-w-[640px] h-[340px] sm:h-[400px] flex items-center justify-center select-none perspective-[1200px]">

      {/* SVG Canvas de Alta Definición */}
      <svg
        viewBox="0 0 740 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-[0_25px_50px_rgba(0,0,0,0.3)]"
      >
        <defs>
          {/* TR90 Negro Mate profundo de alta densidad */}
          <linearGradient id="tr90MatteDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#181b22" />
            <stop offset="40%" stopColor="#242934" />
            <stop offset="80%" stopColor="#12141a" />
            <stop offset="100%" stopColor="#0b0d11" />
          </linearGradient>

          {/* Bisel sutil de luz sobre el marco TR90 */}
          <linearGradient id="frameBevelLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#64748b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
          </linearGradient>

          {/* Sobrelente Clip-on (Polímero ultradelgado negro con acento técnico) */}
          <linearGradient id="clipOnFrame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#272e3b" />
            <stop offset="50%" stopColor="#161b24" />
            <stop offset="100%" stopColor="#0f131a" />
          </linearGradient>

          {/* Lente polarizado lineal de alta transmitancia para el Clip-On */}
          <linearGradient id="polarizedClipOnLens" x1="0%" y1="0%" x2="100%" y2="90%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.32" />
            <stop offset="35%" stopColor="#0284c7" stopOpacity="0.22" />
            <stop offset="70%" stopColor="#0369a1" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.38" />
          </linearGradient>

          {/* Lente base transparente (claro óptico para fórmula médica) */}
          <linearGradient id="baseClearLens" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
          </linearGradient>

          {/* Imanes de Neodimio N52 (Cromo pulido / brillo plateado magnético) */}
          <linearGradient id="neodymiumMagnet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="45%" stopColor="#94a3b8" />
            <stop offset="70%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          {/* Reflejos especulares de luz polarizada */}
          <linearGradient id="opticalGlint" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
          </linearGradient>

          {/* Cordón textil trenzado */}
          <linearGradient id="lanyardBraidGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
        </defs>

        {/* ============================================================ */}
        {/* CAPA 04: PATILLAS BIOMECÁNICAS, BISAGRAS Y CORDÓN TEXTIL     */}
        {/* ============================================================ */}
        <motion.g
          id="layer-temples_lanyard"
          style={layerTransforms.temples_lanyard}
          className="cursor-pointer transition-opacity"
          opacity={activeLayer && activeLayer !== 'temples_lanyard' ? 0.35 : 1}
          onMouseEnter={() => onHoverLayer && onHoverLayer('temples_lanyard')}
          onMouseLeave={() => onHoverLayer && onHoverLayer(null)}
        >
          {/* Lazo del cordón Tattoo Vision que cae por detrás */}
          <path
            d="M96 195 C62 270 120 375 370 375 C620 375 678 270 644 195"
            stroke="url(#lanyardBraidGreen)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="6 3"
            fill="none"
          />
          {/* Pasador de tensión regulable con seguro */}
          <circle cx="370" cy="375" r="10" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
          <circle cx="370" cy="375" r="4" fill="#10b981" />

          {/* Terminales de sujeción de goma a las patillas */}
          <rect x="90" y="190" width="12" height="18" rx="4" fill="#047857" stroke="#10b981" strokeWidth="1" />
          <rect x="638" y="190" width="12" height="18" rx="4" fill="#047857" stroke="#10b981" strokeWidth="1" />

          {/* Patilla Izquierda TR90 en perspectiva anatómica */}
          <path
            d="M202 192 L102 172 C86 168 82 176 88 188 L100 204 L200 208 Z"
            fill="url(#tr90MatteDark)"
            stroke="#0a0c10"
            strokeWidth="1.5"
          />
          {/* Bisagra de acero inoxidable izquierda */}
          <rect x="196" y="194" width="8" height="12" rx="2" fill="url(#neodymiumMagnet)" stroke="#334155" strokeWidth="1" />
          <circle cx="200" cy="200" r="1.5" fill="#0f172a" />

          {/* Patilla Derecha TR90 en perspectiva anatómica */}
          <path
            d="M538 192 L638 172 C654 168 658 176 652 188 L640 204 L540 208 Z"
            fill="url(#tr90MatteDark)"
            stroke="#0a0c10"
            strokeWidth="1.5"
          />
          {/* Bisagra de acero inoxidable derecha */}
          <rect x="536" y="194" width="8" height="12" rx="2" fill="url(#neodymiumMagnet)" stroke="#334155" strokeWidth="1" />
          <circle cx="540" cy="200" r="1.5" fill="#0f172a" />

          {/* Grabado icónico de autor en la patilla izquierda */}
          <text x="115" y="192" fill="#64748b" fontSize="6.5" fontFamily="sans-serif" fontWeight="bold" letterSpacing="0.1em">
            TATTOO VISION 2 · HERNÁN YEPES
          </text>
        </motion.g>

        {/* ============================================================ */}
        {/* CAPA 03: ARMAZÓN BASE TR90 CON RECEPTORES MAGNÉTICOS         */}
        {/* ============================================================ */}
        <motion.g
          id="layer-frame"
          style={layerTransforms.frame}
          className="cursor-pointer transition-opacity"
          opacity={activeLayer && activeLayer !== 'frame' ? 0.35 : 1}
          onMouseEnter={() => onHoverLayer && onHoverLayer('frame')}
          onMouseLeave={() => onHoverLayer && onHoverLayer(null)}
        >
          {/* Armazón principal Wayfarer/D-frame TR90 */}
          <path
            d="
              M186 172
              C220 166 320 168 354 186
              C362 190 378 190 386 186
              C420 168 520 166 554 172
              C564 174 568 186 562 202
              L548 250
              C538 278 510 292 460 294
              C402 296 376 264 372 238
              C370 226 358 226 356 238
              C352 264 326 296 268 294
              C218 292 190 278 180 250
              L166 202
              C160 186 170 174 186 172 Z
            "
            fill="url(#tr90MatteDark)"
            stroke="#07080b"
            strokeWidth="2.5"
          />

          {/* Bisel de luz superior sobre el puente y cejas */}
          <path
            d="M188 174 C225 168 315 170 352 188 C364 192 376 192 388 188 C425 170 515 168 552 174"
            stroke="url(#frameBevelLight)"
            strokeWidth="1.8"
            fill="none"
          />

          {/* Abertura ocular izquierda para el cristal base */}
          <path
            d="M202 186 C235 180 310 182 332 198 C342 205 344 220 336 238 C326 262 302 280 266 282 C224 284 200 262 194 236 C190 216 192 192 202 186 Z"
            fill="#090d16"
            stroke="#202633"
            strokeWidth="1.5"
          />

          {/* Abertura ocular derecha para el cristal base */}
          <path
            d="M538 186 C505 180 430 182 408 198 C398 205 396 220 404 238 C414 262 438 280 474 282 C516 284 540 262 546 236 C550 216 548 192 538 186 Z"
            fill="#090d16"
            stroke="#202633"
            strokeWidth="1.5"
          />

          {/* RECEPTOR MAGNÉTICO IZQUIERDO (Para acoplar el Clip-On) */}
          <circle cx="182" cy="182" r="3.5" fill="url(#neodymiumMagnet)" stroke="#334155" strokeWidth="1" />
          <circle cx="182" cy="182" r="1.5" fill="#0f172a" />

          {/* RECEPTOR MAGNÉTICO DERECHO (Para acoplar el Clip-On) */}
          <circle cx="558" cy="182" r="3.5" fill="url(#neodymiumMagnet)" stroke="#334155" strokeWidth="1" />
          <circle cx="558" cy="182" r="1.5" fill="#0f172a" />

          {/* Puente nasal ergonómico */}
          <path d="M356 224 C362 220 378 220 384 224" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>

        {/* ============================================================ */}
        {/* CAPA 02: CRISTALES BASE DE VISIÓN (Compatibles con Fórmula)  */}
        {/* ============================================================ */}
        <motion.g
          id="layer-base_lenses"
          style={layerTransforms.base_lenses}
          className="cursor-pointer transition-opacity"
          opacity={activeLayer && activeLayer !== 'base_lenses' ? 0.35 : 1}
          onMouseEnter={() => onHoverLayer && onHoverLayer('base_lenses')}
          onMouseLeave={() => onHoverLayer && onHoverLayer(null)}
        >
          {/* Lente Base Izquierdo (Neutro o Formulado en Óptica) */}
          <path
            d="M204 187 C236 181 309 183 330 199 C340 206 342 219 334 237 C324 260 301 278 266 280 C226 282 202 260 196 235 C192 215 194 193 204 187 Z"
            fill="url(#baseClearLens)"
            stroke="#7dd3fc"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />

          {/* Lente Base Derecho (Neutro o Formulado en Óptica) */}
          <path
            d="M536 187 C504 181 431 183 410 199 C400 206 398 219 406 237 C416 260 439 278 474 280 C514 282 538 260 544 235 C548 215 546 193 536 187 Z"
            fill="url(#baseClearLens)"
            stroke="#7dd3fc"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />

          {/* Rótulo de compatibilidad óptica */}
          <text x="236" y="240" fill="#7dd3fc" fontSize="6" fontFamily="monospace" opacity="0.8" letterSpacing="0.08em">
            RX / FORMULA COMPATIBLE
          </text>
          <text x="446" y="240" fill="#7dd3fc" fontSize="6" fontFamily="monospace" opacity="0.8" letterSpacing="0.08em">
            OPTICAL CLEAR GRADE
          </text>
        </motion.g>

        {/* ============================================================ */}
        {/* CAPA 01: SOBRELENTE MAGNÉTICO POLARIZADO (CLIP-ON FRONTAL)   */}
        {/* ============================================================ */}
        <motion.g
          id="layer-clipon"
          style={layerTransforms.clipon}
          className="cursor-pointer transition-opacity"
          opacity={activeLayer && activeLayer !== 'clipon' ? 0.35 : 1}
          onMouseEnter={() => onHoverLayer && onHoverLayer('clipon')}
          onMouseLeave={() => onHoverLayer && onHoverLayer(null)}
        >
          {/* Estructura ultraligera del Clip-On magnético */}
          <path
            d="
              M188 174
              C222 168 318 170 352 188
              C360 192 376 192 384 188
              C418 170 514 168 548 174
              C558 176 562 188 556 204
              L542 252
              C532 278 506 292 458 294
              C402 296 376 266 372 242
              C370 230 358 230 356 242
              C352 266 326 296 270 294
              C222 292 196 278 186 252
              L172 204
              C166 188 174 176 188 174 Z
            "
            fill="url(#clipOnFrame)"
            stroke="#38bdf8"
            strokeWidth="1.8"
          />

          {/* Lente Polarizado Lineal Izquierdo en Clip-On */}
          <path
            d="M204 188 C236 182 309 184 330 200 C340 207 342 220 334 238 C324 261 301 279 266 281 C226 283 202 261 196 236 C192 216 194 194 204 188 Z"
            fill="url(#polarizedClipOnLens)"
            stroke="#38bdf8"
            strokeWidth="1.8"
          />

          {/* Lente Polarizado Lineal Derecho en Clip-On */}
          <path
            d="M536 188 C504 182 431 184 410 200 C400 207 398 220 406 238 C416 261 439 279 474 281 C514 283 538 261 544 236 C548 216 546 194 536 188 Z"
            fill="url(#polarizedClipOnLens)"
            stroke="#38bdf8"
            strokeWidth="1.8"
          />

          {/* IMÁN DE NEODIMIO N52 IZQUIERDO */}
          <circle cx="184" cy="184" r="4.2" fill="url(#neodymiumMagnet)" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="184" cy="184" r="1.8" fill="#0284c7" />

          {/* IMÁN DE NEODIMIO N52 DERECHO */}
          <circle cx="552" cy="184" r="4.2" fill="url(#neodymiumMagnet)" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="552" cy="184" r="1.8" fill="#0284c7" />

          {/* Líneas de campo magnético sutiles */}
          <path d="M178 184 C175 180 175 188 178 184" stroke="#38bdf8" strokeWidth="0.8" />
          <path d="M558 184 C561 180 561 188 558 184" stroke="#38bdf8" strokeWidth="0.8" />

          {/* Reflejos de polarización en los lentes del Clip-On */}
          <path d="M210 194 L300 198 L250 274 L200 242 Z" fill="url(#opticalGlint)" opacity="0.35" />
          <path d="M530 194 L440 198 L490 274 L540 242 Z" fill="url(#opticalGlint)" opacity="0.35" />

          {/* Eje de polarización ortogonal 90° grabado en cristal */}
          <g opacity="0.85">
            <line x1="265" y1="210" x2="265" y2="250" stroke="#38bdf8" strokeWidth="0.9" strokeDasharray="3 2" />
            <line x1="259" y1="230" x2="271" y2="230" stroke="#38bdf8" strokeWidth="0.9" />
            <text x="226" y="248" fill="#38bdf8" fontSize="6.5" fontFamily="monospace" letterSpacing="0.08em">
              POLARIZED · 90°
            </text>
          </g>

          <g opacity="0.85">
            <line x1="475" y1="210" x2="475" y2="250" stroke="#38bdf8" strokeWidth="0.9" strokeDasharray="3 2" />
            <line x1="469" y1="230" x2="481" y2="230" stroke="#38bdf8" strokeWidth="0.9" />
            <text x="436" y="248" fill="#38bdf8" fontSize="6.5" fontFamily="monospace" letterSpacing="0.08em">
              POLARIZED · 90°
            </text>
          </g>

          {/* Marca grabada oficial en el Clip-on */}
          <text x="312" y="202" fill="#7dd3fc" fontSize="6" fontFamily="monospace" opacity="0.85" fontWeight="bold">
            CLIP-ON MAGNET
          </text>
          <text x="402" y="202" fill="#7dd3fc" fontSize="6" fontFamily="monospace" opacity="0.85" fontWeight="bold">
            TATTOO VISION
          </text>
        </motion.g>

      </svg>
    </div>
  )
}
