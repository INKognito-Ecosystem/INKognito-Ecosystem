import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import logoSupply from '../../assets/milogo/supply.webp'

const BOOT_KEY = 'ink_supply_boot_seen_v1'

export default function SupplyBootIntro({ onComplete }) {
  const [stage, setStage] = useState('init') // 'init' -> 'ignite' -> 'docking' -> 'done'
  const [coords, setCoords] = useState({ targetX: 0, targetY: 0 })

  useEffect(() => {
    // Calculamos las coordenadas hacia donde debe volar el logo (posición del logo en el navbar)
    const computeTarget = () => {
      // El navbar tiene padding x=32px (px-8) y py=14px, logo está a la izquierda
      // Del centro de la pantalla (0,0 en motion centrado) a la esquina superior izquierda:
      const targetX = -window.innerWidth / 2 + 56
      const targetY = -window.innerHeight / 2 + 58
      setCoords({ targetX, targetY })
    }

    computeTarget()
    window.addEventListener('resize', computeTarget)

    // Secuencia de encendido inspirada en Wiltech
    // T=100ms: Empieza a encender el logo central (fade + scale + glow)
    const t1 = setTimeout(() => {
      setStage('ignite')
    }, 120)

    // T=1300ms: Desplazamiento dinámico hacia el navbar (docking)
    const t2 = setTimeout(() => {
      setStage('docking')
    }, 1300)

    // T=2100ms: Transición completa, retiramos el overlay
    const t3 = setTimeout(() => {
      setStage('done')
      if (onComplete) onComplete()
      try {
        sessionStorage.setItem(BOOT_KEY, '1')
      } catch {}
    }, 2100)

    return () => {
      window.removeEventListener('resize', computeTarget)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onComplete])

  if (stage === 'done') return null

  const isDocking = stage === 'docking'

  return (
    <AnimatePresence>
      <motion.div
        key="supply-boot-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: isDocking ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-white overflow-hidden"
      >
        {/* Resplandor radial de encendido en el fondo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: stage === 'ignite' ? 0.8 : isDocking ? 0 : 0.4,
            scale: stage === 'ignite' ? 1.2 : 0.8,
          }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18)_0%,rgba(147,197,253,0.08)_40%,transparent_70%)] pointer-events-none"
        />

        {/* Línea sutil de encendido / boot scanner */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: stage === 'ignite' ? [0, 1.2, 0.9] : isDocking ? 0 : 0,
            opacity: stage === 'ignite' ? [0, 0.8, 0] : 0,
          }}
          transition={{ duration: 0.9, times: [0, 0.5, 1], ease: 'easeInOut' }}
          className="absolute h-[1px] w-64 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        />

        {/* LOGO EN VUELO (CENTRO -> NAVBAR) */}
        <motion.div
          initial={{ scale: 0.75, opacity: 0, y: 15 }}
          animate={
            isDocking
              ? {
                  x: coords.targetX,
                  y: coords.targetY,
                  scale: 0.38,
                  opacity: 0,
                }
              : stage === 'ignite'
              ? {
                  x: 0,
                  y: 0,
                  scale: [0.8, 1.1, 1],
                  opacity: 1,
                }
              : {
                  x: 0,
                  y: 10,
                  scale: 0.8,
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
                  duration: 0.85,
                  ease: [0.16, 1, 0.3, 1],
                }
          }
          className="relative flex flex-col items-center justify-center"
        >
          {/* Halo luminoso detrás del logo */}
          <motion.div
            animate={{
              boxShadow:
                stage === 'ignite'
                  ? '0 0 50px 10px rgba(59, 130, 246, 0.3)'
                  : '0 0 0px 0px rgba(59, 130, 246, 0)',
            }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl p-3"
          >
            <img
              src={logoSupply}
              alt="INKognito Supply"
              className="w-24 h-24 object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.12)]"
            />
          </motion.div>

          {/* Subtítulo técnico y palabra clave que se disuelve al iniciar el vuelo */}
          <motion.div
            animate={{
              opacity: isDocking ? 0 : stage === 'ignite' ? 1 : 0,
              y: isDocking ? 10 : stage === 'ignite' ? 0 : 8,
            }}
            transition={{ duration: 0.35 }}
            className="text-center mt-3"
          >
            <div className="flex items-center gap-2 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900">
                INKOGNITO <span className="text-blue-600">SUPPLY</span>
              </p>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-400 mt-0.5">
              SISTEMA DE SUMINISTROS B2B · COLOMBIA
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
