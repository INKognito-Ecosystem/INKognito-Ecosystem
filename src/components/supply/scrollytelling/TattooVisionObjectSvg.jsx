import { motion } from 'motion/react'

/**
 * Renderizado vectorial por capas independientes para el visor de precisión Tattoo Vision (Vision-X Pro).
 * Cada capa se desacopla independientemente en el espacio 3D según el avance del scroll (Scrollytelling tipo Wiltech).
 */

export function TattooVisionObjectSvg({
  explodedProgress, // MotionValue 0 -> 1
  layerTransforms = {},
  activeLayer = null,
  onHoverLayer,
}) {
  return (
    <div className="relative w-full max-w-[580px] h-[340px] sm:h-[400px] flex items-center justify-center select-none perspective-[1200px]">

      {/* SVG Canvas de Alta Definición */}
      <svg
        viewBox="0 0 680 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-[0_20px_45px_rgba(0,0,0,0.12)]"
      >
        <defs>
          {/* Gradientes y filtros para apariencia técnica de titanio y óptica */}
          <linearGradient id="titaniumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="40%" stopColor="#64748b" />
            <stop offset="70%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          <linearGradient id="lensGradLeft" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
            <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.55" />
          </linearGradient>

          <linearGradient id="lensGradRight" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.55" />
            <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.25" />
            <stop offset="80%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="ledGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#eab308" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="goldPins" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <linearGradient id="siliconeGrip" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.9" />
          </linearGradient>

          <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ============================================================ */}
        {/* CAPA 04: ALMOHADILLAS & BIO-GRIP SILICONADO (Fondo / Apoyo)   */}
        {/* ============================================================ */}
        <motion.g
          id="layer-biogrip"
          style={layerTransforms.biogrip}
          className="cursor-pointer transition-opacity"
          opacity={activeLayer && activeLayer !== 'biogrip' ? 0.35 : 1}
          onMouseEnter={() => onHoverLayer && onHoverLayer('biogrip')}
          onMouseLeave={() => onHoverLayer && onHoverLayer(null)}
        >
          {/* Apoyos nasales de silicona médica */}
          <path
            d="M320 236 C314 246 312 264 316 276 C318 280 324 282 328 277 C332 271 334 252 328 240 Z"
            fill="url(#siliconeGrip)"
            stroke="#065f46"
            strokeWidth="1.5"
          />
          <path
            d="M360 236 C366 246 368 264 364 276 C362 280 356 282 352 277 C348 271 346 252 352 240 Z"
            fill="url(#siliconeGrip)"
            stroke="#065f46"
            strokeWidth="1.5"
          />
          {/* Ranuras micro-fluidas anti-sudor */}
          <line x1="316" y1="250" x2="324" y2="252" stroke="#ecfdf5" strokeWidth="1" strokeLinecap="round" />
          <line x1="316" y1="258" x2="325" y2="260" stroke="#ecfdf5" strokeWidth="1" strokeLinecap="round" />
          <line x1="318" y1="266" x2="326" y2="268" stroke="#ecfdf5" strokeWidth="1" strokeLinecap="round" />

          <line x1="364" y1="250" x2="356" y2="252" stroke="#ecfdf5" strokeWidth="1" strokeLinecap="round" />
          <line x1="364" y1="258" x2="355" y2="260" stroke="#ecfdf5" strokeWidth="1" strokeLinecap="round" />
          <line x1="362" y1="266" x2="354" y2="268" stroke="#ecfdf5" strokeWidth="1" strokeLinecap="round" />

          {/* Terminales ergonómicos en las patillas traseras */}
          <path
            d="M65 142 C50 148 42 165 48 180 C52 190 62 195 72 188 C76 182 82 165 80 152 Z"
            fill="url(#siliconeGrip)"
            stroke="#065f46"
            strokeWidth="1"
            opacity="0.85"
          />
          <path
            d="M615 142 C630 148 638 165 632 180 C628 190 618 195 608 188 C604 182 598 165 600 152 Z"
            fill="url(#siliconeGrip)"
            stroke="#065f46"
            strokeWidth="1"
            opacity="0.85"
          />
        </motion.g>

        {/* ============================================================ */}
        {/* CAPA 03: CHASIS AEROESPACIAL DE TITANIO (Estructura Base)    */}
        {/* ============================================================ */}
        <motion.g
          id="layer-chassis"
          style={layerTransforms.chassis}
          className="cursor-pointer transition-opacity"
          opacity={activeLayer && activeLayer !== 'chassis' ? 0.35 : 1}
          onMouseEnter={() => onHoverLayer && onHoverLayer('chassis')}
          onMouseLeave={() => onHoverLayer && onHoverLayer(null)}
        >
          {/* Patilla izquierda en perspectiva */}
          <path
            d="M178 186 L70 148 C60 144 54 150 58 158 L82 178 L170 205 Z"
            fill="url(#titaniumGrad)"
            stroke="#0f172a"
            strokeWidth="1.5"
          />
          {/* Aligeramientos esqueletizados en patilla izquierda */}
          <polygon points="95,162 125,172 120,178 92,168" fill="#090d16" />
          <polygon points="135,176 160,185 156,190 132,182" fill="#090d16" />

          {/* Patilla derecha en perspectiva */}
          <path
            d="M502 186 L610 148 C620 144 626 150 622 158 L598 178 L510 205 Z"
            fill="url(#titaniumGrad)"
            stroke="#0f172a"
            strokeWidth="1.5"
          />
          {/* Aligeramientos esqueletizados en patilla derecha */}
          <polygon points="585,162 555,172 560,178 588,168" fill="#090d16" />
          <polygon points="545,176 520,185 524,190 548,182" fill="#090d16" />

          {/* Barra superior de cejas (Dual Brow Armor) */}
          <path
            d="M165 174 C220 160 300 162 340 170 C380 162 460 160 515 174 L524 186 C460 172 380 174 340 182 C300 174 220 172 156 186 Z"
            fill="url(#titaniumGrad)"
            stroke="#0f172a"
            strokeWidth="2"
          />

          {/* Marco exterior izquierdo del lente */}
          <path
            d="M162 182 C190 174 290 176 322 198 C330 204 330 220 324 238 C314 266 288 288 238 290 C182 292 150 256 148 222 C146 198 152 186 162 182 Z"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="2.5"
          />

          {/* Marco exterior derecho del lente */}
          <path
            d="M518 182 C490 174 390 176 358 198 C350 204 350 220 356 238 C366 266 392 288 442 290 C498 292 530 256 532 222 C534 198 528 186 518 182 Z"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="2.5"
          />

          {/* Puente nasal central reforzado */}
          <path
            d="M320 202 C330 196 350 196 360 202 L364 220 C354 214 326 214 316 220 Z"
            fill="url(#titaniumGrad)"
            stroke="#0f172a"
            strokeWidth="1.5"
          />

          {/* Pernos y tornillos micrométricos en titanio */}
          <circle cx="166" cy="180" r="3" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1" />
          <circle cx="514" cy="180" r="3" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1" />
          <line x1="164.5" y1="180" x2="167.5" y2="180" stroke="#0f172a" strokeWidth="0.8" />
          <line x1="512.5" y1="180" x2="515.5" y2="180" stroke="#0f172a" strokeWidth="0.8" />
        </motion.g>

        {/* ============================================================ */}
        {/* CAPA 02: MÓDULO MICRO-LED & ILUMINACIÓN COAXIAL              */}
        {/* ============================================================ */}
        <motion.g
          id="layer-lighting"
          style={layerTransforms.lighting}
          className="cursor-pointer transition-opacity"
          opacity={activeLayer && activeLayer !== 'lighting' ? 0.35 : 1}
          onMouseEnter={() => onHoverLayer && onHoverLayer('lighting')}
          onMouseLeave={() => onHoverLayer && onHoverLayer(null)}
        >
          {/* Haz cónico de luz proyectada hacia el campo de trabajo */}
          <polygon
            points="332,176 348,176 430,360 250,360"
            fill="url(#ledGlow)"
            opacity="0.16"
            className="pointer-events-none"
          />

          {/* Bloque proyector micro-LED central */}
          <rect
            x="326"
            y="156"
            width="28"
            height="26"
            rx="4"
            fill="#0f172a"
            stroke="#fbbf24"
            strokeWidth="1.5"
          />

          {/* Disipador pasivo superior de grafeno */}
          <line x1="330" y1="154" x2="350" y2="154" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="332" y1="151" x2="348" y2="151" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />

          {/* Doble lente colimador LED de alta reproducción de color */}
          <circle cx="334" cy="169" r="4.5" fill="url(#ledGlow)" filter="url(#laserGlow)" />
          <circle cx="346" cy="169" r="4.5" fill="url(#ledGlow)" filter="url(#laserGlow)" />
          <circle cx="334" cy="169" r="2" fill="#ffffff" />
          <circle cx="346" cy="169" r="2" fill="#ffffff" />

          {/* Pines de conexión y carga magnética chapados en oro */}
          <rect x="330" y="145" width="4" height="4" rx="1" fill="url(#goldPins)" />
          <rect x="346" y="145" width="4" height="4" rx="1" fill="url(#goldPins)" />
        </motion.g>

        {/* ============================================================ */}
        {/* CAPA 01: ESCUDO ÓPTICO POLARIZADO HD (Cristales Frontales)   */}
        {/* ============================================================ */}
        <motion.g
          id="layer-optics"
          style={layerTransforms.optics}
          className="cursor-pointer transition-opacity"
          opacity={activeLayer && activeLayer !== 'optics' ? 0.35 : 1}
          onMouseEnter={() => onHoverLayer && onHoverLayer('optics')}
          onMouseLeave={() => onHoverLayer && onHoverLayer(null)}
        >
          {/* Lente Izquierdo Polarizado */}
          <path
            d="M172 188 C198 180 285 182 312 202 C320 208 320 220 314 236 C304 260 280 280 236 282 C186 284 158 252 156 222 C154 202 162 192 172 188 Z"
            fill="url(#lensGradLeft)"
            stroke="#38bdf8"
            strokeWidth="1.8"
          />

          {/* Lente Derecho Polarizado */}
          <path
            d="M508 188 C482 180 395 182 368 202 C360 208 360 220 366 236 C376 260 400 280 444 282 C494 284 522 252 524 222 C526 202 518 192 508 188 Z"
            fill="url(#lensGradRight)"
            stroke="#38bdf8"
            strokeWidth="1.8"
          />

          {/* Destellos y reflejos de polarización técnica */}
          <path
            d="M180 196 Q240 188 286 210"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.65"
          />
          <path
            d="M500 196 Q440 188 394 210"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.65"
          />

          {/* Retícula de grabado láser y puntos de calibración milimétrica */}
          {/* Ojo Izquierdo: Cruz de enfoque óptico */}
          <line x1="235" y1="228" x2="245" y2="228" stroke="#38bdf8" strokeWidth="1" opacity="0.8" />
          <line x1="240" y1="223" x2="240" y2="233" stroke="#38bdf8" strokeWidth="1" opacity="0.8" />
          <circle cx="240" cy="228" r="8" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
          <text x="218" y="248" fill="#38bdf8" fontSize="7" fontFamily="monospace" opacity="0.75" letterSpacing="0.08em">
            OPTIC.CAL · L
          </text>

          {/* Ojo Derecho: Cruz de enfoque óptico */}
          <line x1="435" y1="228" x2="445" y2="228" stroke="#38bdf8" strokeWidth="1" opacity="0.8" />
          <line x1="440" y1="223" x2="440" y2="233" stroke="#38bdf8" strokeWidth="1" opacity="0.8" />
          <circle cx="440" cy="228" r="8" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
          <text x="418" y="248" fill="#38bdf8" fontSize="7" fontFamily="monospace" opacity="0.75" letterSpacing="0.08em">
            OPTIC.CAL · R
          </text>

          {/* Micro-marcas de escala en bordes */}
          <line x1="168" y1="206" x2="174" y2="208" stroke="#7dd3fc" strokeWidth="1" opacity="0.6" />
          <line x1="166" y1="214" x2="172" y2="216" stroke="#7dd3fc" strokeWidth="1" opacity="0.6" />
          <line x1="165" y1="222" x2="171" y2="224" stroke="#7dd3fc" strokeWidth="1" opacity="0.6" />

          <line x1="512" y1="206" x2="506" y2="208" stroke="#7dd3fc" strokeWidth="1" opacity="0.6" />
          <line x1="514" y1="214" x2="508" y2="216" stroke="#7dd3fc" strokeWidth="1" opacity="0.6" />
          <line x1="515" y1="222" x2="509" y2="224" stroke="#7dd3fc" strokeWidth="1" opacity="0.6" />
        </motion.g>

      </svg>
    </div>
  )
}
