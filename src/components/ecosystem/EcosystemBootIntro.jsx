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
  const [stage, setStage] = useState('init') // 'init' -> 'ignite' -> 'modules' -> 'docking' -> 'done'
  const [coords, setCoords] = useState({ targetX: 0, targetY: 0 })

  useEffect(() => {
    const computeTarget = () => {
      // Navbar: fixed top-0 left-0, pl-2 (8px), py-4 (16px), logo h=52px.
      // Centro del logo en el navbar: X ≈ 50px, Y ≈ 42px
      const targetX = -window.innerWidth / 2 + 50
      const targetY = -window.innerHeight / 2 + 42
      setCoords({ targetX, targetY })
    }

    computeTarget()
    window.addEventListener('resize', computeTarget)

    // Secuencia de encendido inspirada en Wiltech para el Ecosistema
    // T=80ms: Ignición del emblema central
    const t1 = setTimeout(() => setStage('ignite'), 80)

    // T=750ms: Despertar de los módulos del ecosistema
    const t2 = setTimeout(() => setStage('modules'), 750)

    // T=1550ms: Vuelo y docking hacia el navbar superior izquierdo
    const t3 = setTimeout(() => setStage('docking'), 1550)

    // T=2350ms: Concluye y retira el overlay liberando el carrusel
    const t4 = setTimeout(() => {
      setStage('done')
      if (onComplete) onComplete()
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {}
    }, 2350)

    return () => {
      window.removeEventListener('resize', computeTarget)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onComplete])

  if (stage === 'done') return null

  const isDocking = stage === 'docking'

  return (
    <AnimatePresence>
      <motion.div
        key="ecosystem-boot-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: isDocking ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-black overflow-hidden select-none"
      >
        {/* Glow de fondo atmosférico (pulso de luz cósmica) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: stage === 'ignite' || stage === 'modules' ? 0.35 : 0,
            scale: stage === 'modules' ? 1.3 : 0.9,
          }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18)_0%,rgba(37,99,235,0.12)_35%,rgba(220,38,38,0.06)_65%,transparent_80%)] pointer-events-none blur-xl"
        />

        {/* Haz de luz de calibración / escáner horizontal */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: stage === 'ignite' ? [0, 1.4, 0.9] : isDocking ? 0 : 0,
            opacity: stage === 'ignite' ? [0, 0.9, 0] : 0,
          }}
          transition={{ duration: 0.85, times: [0, 0.5, 1], ease: 'easeInOut' }}
          className="absolute h-[1px] w-80 bg-gradient-to-r from-transparent via-white to-transparent"
        />

        {/* LOGO EN VUELO (CENTRO -> NAVBAR ESQUINA SUPERIOR IZQUIERDA) */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 15 }}
          animate={
            isDocking
              ? {
                  x: coords.targetX,
                  y: coords.targetY,
                  scale: 0.35,
                  opacity: 0,
                }
              : stage === 'ignite' || stage === 'modules'
              ? {
                  x: 0,
                  y: 0,
                  scale: stage === 'modules' ? 1.02 : 1,
                  opacity: 1,
                }
              : {
                  x: 0,
                  y: 10,
                  scale: 0.75,
                  opacity: 0.2,
                }
          }
          transition={
            isDocking
              ? {
                  duration: 0.75,
                  ease: [0.16, 1, 0.3, 1], // Curva física Apple / Wiltech
                }
              : {
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }
          }
          className="relative flex flex-col items-center justify-center"
        >
          {/* Logo oficial INKognito con halo difuso */}
          <motion.div
            animate={{
              filter:
                stage === 'ignite' || stage === 'modules'
                  ? 'drop-shadow(0 0 35px rgba(255,255,255,0.45))'
                  : 'drop-shadow(0 0 0px rgba(255,255,255,0))',
            }}
            transition={{ duration: 0.6 }}
            className="p-4"
          >
            <img
              src={inkognitoLogo}
              alt="INKognito Ecosystem"
              className="h-24 md:h-28 w-auto object-contain"
            />
          </motion.div>

          {/* Bloque tipográfico del Ecosistema */}
          <motion.div
            animate={{
              opacity: isDocking ? 0 : stage === 'modules' ? 1 : stage === 'ignite' ? 0.6 : 0,
              y: isDocking ? 12 : 0,
            }}
            transition={{ duration: 0.35 }}
            className="text-center mt-3 flex flex-col items-center"
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
            <div className="flex items-center gap-3 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-sm">
              {MODULE_PULSES.map((m, idx) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: stage === 'modules' ? 1 : 0.2,
                    scale: stage === 'modules' ? 1 : 0.6,
                  }}
                  transition={{ delay: 0.1 + idx * 0.08, duration: 0.3 }}
                  className="flex items-center gap-1.5"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: m.color, color: m.color }}
                  />
                  <span className="text-[8.5px] font-black uppercase tracking-wider text-zinc-300">
                    {m.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
