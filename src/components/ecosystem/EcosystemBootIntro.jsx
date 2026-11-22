import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import inkognitoLogo from '../../assets/ecosystem/logo.png'

const STORAGE_KEY = 'ink_ecosystem_boot_seen_v1'

const MODULE_PULSES = [
  { name: 'INK', color: '#dc2626' },
  { name: 'SUPPLY', color: '#2563eb' },
  { name: 'STORE', color: '#C9A84C' },
  { name: 'GYM', color: '#6b7280' },
  { name: 'SUPLE', color: '#9E9E9E' },
]

export default function EcosystemBootIntro({ onComplete }) {
  // 'init' -> 'ignite' -> 'fade_text' -> 'travel' -> 'done'
  const [stage, setStage] = useState('init')
  const [target, setTarget] = useState({ x: 0, y: 0, scale: 0.52 })

  useEffect(() => {
    const computeTarget = () => {
      const navLogo = document.getElementById('ecosystem-nav-logo')
      if (navLogo) {
        const rect = navLogo.getBoundingClientRect()
        // Centro del logo destino en el navbar
        const targetCenterX = rect.left + rect.width / 2
        const targetCenterY = rect.top + rect.height / 2
        // Centro del viewport (donde parte el logo inicial centrado)
        const startCenterX = window.innerWidth / 2
        const startCenterY = window.innerHeight / 2

        const dx = targetCenterX - startCenterX
        const dy = targetCenterY - startCenterY
        // Altura de inicio es 100px. Altura destino es rect.height (52px).
        const scaleFactor = (rect.height || 52) / 100
        setTarget({ x: dx, y: dy, scale: scaleFactor })
      } else {
        // Fallback matemático responsive si el ref tardara un frame
        const isMobile = window.innerWidth < 768
        const dx = -window.innerWidth / 2 + (isMobile ? 50 : 56)
        const dy = -window.innerHeight / 2 + 42
        setTarget({ x: dx, y: dy, scale: 0.52 })
      }
    }

    // Medimos inmediatamente y tras el primer frame
    computeTarget()
    const raf = requestAnimationFrame(computeTarget)
    window.addEventListener('resize', computeTarget)

    // Cronología de la animación:
    // T=60ms: Encendido e ignición del logo en el centro
    const t1 = setTimeout(() => setStage('ignite'), 60)

    // T=850ms: Desaparecen los textos y badges del centro
    const t2 = setTimeout(() => setStage('fade_text'), 850)

    // T=1150ms: El logo emprende el vuelo y desplazamiento visible hacia la esquina superior izquierda
    const t3 = setTimeout(() => setStage('travel'), 1150)

    // T=1950ms: El logo aterriza en la posición exacta del navbar, concluye y cede el relevo
    const t4 = setTimeout(() => {
      setStage('done')
      if (onComplete) onComplete()
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {}
    }, 1950)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', computeTarget)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onComplete])

  if (stage === 'done') return null

  const isTraveling = stage === 'travel'
  const isFadingText = stage === 'fade_text' || isTraveling

  return (
    <AnimatePresence>
      <motion.div
        key="ecosystem-boot-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: isTraveling ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-black overflow-hidden select-none"
      >
        {/* Glow de fondo de ignición inicial */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: stage === 'ignite' ? 0.35 : 0,
            scale: stage === 'ignite' ? 1.15 : 0.8,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,rgba(37,99,235,0.1)_40%,transparent_70%)] pointer-events-none blur-xl"
        />

        {/* CONTENEDOR PRINCIPAL */}
        <div className="relative flex flex-col items-center justify-center">
          {/* EL LOGO: VISIBLE EN TODO MOMENTO (OPACITY: 1) DURANTE EL VUELO */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, x: 0, y: 15 }}
            animate={
              isTraveling
                ? {
                    x: target.x,
                    y: target.y,
                    scale: target.scale,
                    opacity: 1, // Sigue completamente visible durante el desplazamiento
                  }
                : stage === 'ignite' || stage === 'fade_text'
                ? {
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                  }
                : {
                    x: 0,
                    y: 15,
                    scale: 0.7,
                    opacity: 0,
                  }
            }
            transition={
              isTraveling
                ? {
                    duration: 0.75,
                    ease: [0.16, 1, 0.3, 1], // Curva física suave Apple / Wiltech
                  }
                : {
                    duration: 0.65,
                    ease: [0.16, 1, 0.3, 1],
                  }
            }
            className="relative flex items-center justify-center origin-center"
          >
            <img
              src={inkognitoLogo}
              alt="INKognito"
              className="h-[100px] w-auto object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.45)]"
            />
          </motion.div>

          {/* TEXTO Y MÓDULOS DEL CENTRO: SE DESVANECEN ANTES DEL DESPLAZAMIENTO */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isFadingText ? 0 : stage === 'ignite' ? 1 : 0,
              y: isFadingText ? 15 : stage === 'ignite' ? 0 : 10,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="text-center mt-4 flex flex-col items-center pointer-events-none"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <p className="text-[12px] font-black uppercase tracking-[0.35em] text-white">
                INKOGNITO <span className="text-zinc-400 font-light">ECOSYSTEM</span>
              </p>
            </div>

            <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 font-medium mb-3">
              PLATAFORMA MODULAR INTEGRADA
            </p>

            {/* Micro-luces de estado de los módulos */}
            <div className="flex items-center gap-3 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800/80 backdrop-blur-sm">
              {MODULE_PULSES.map((m) => (
                <div key={m.name} className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: m.color, color: m.color }}
                  />
                  <span className="text-[8.5px] font-black uppercase tracking-wider text-zinc-300">
                    {m.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
