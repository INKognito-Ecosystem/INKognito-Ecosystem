import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import inkognitoLogo from '../../assets/ecosystem/logo.png'

const STORAGE_KEY = 'ink_ecosystem_boot_seen_v1'
const LOGO_ASPECT_RATIO = 1.791667 // 1376 / 768
const H_CENTER = 96 // Altura del logo cuando está encendido al centro
const W_CENTER = H_CENTER * LOGO_ASPECT_RATIO // Ancho proporcional ≈ 172px

export default function EcosystemBootIntro({ onComplete }) {
  // 'init' -> 'ignite' -> 'fade_text' -> 'travel' -> 'done'
  const [stage, setStage] = useState('init')
  const [destRect, setDestRect] = useState(null)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateMeasurements = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      const navLogo = document.getElementById('ecosystem-nav-logo')
      if (navLogo) {
        const r = navLogo.getBoundingClientRect()
        if (r.width > 0 && r.height > 0) {
          setDestRect({
            top: r.top,
            left: r.left,
            width: r.width,
            height: r.height,
          })
          return
        }
      }
      // Fallback matemático responsive si la imagen tardase un frame en reportar rect
      const isMobile = window.innerWidth < 768
      setDestRect({
        top: 16,
        left: isMobile ? 8 : 8,
        width: 52 * LOGO_ASPECT_RATIO,
        height: 52,
      })
    }

    updateMeasurements()
    const raf = requestAnimationFrame(updateMeasurements)
    window.addEventListener('resize', updateMeasurements)

    // Cronología de la animación (con 1s adicional para lectura cómoda):
    // T=60ms: Ignición y encendido del logo en el centro
    const t1 = setTimeout(() => setStage('ignite'), 60)

    // T=1850ms: Desaparece la información de texto central (1.8s de lectura pausada)
    const t2 = setTimeout(() => setStage('fade_text'), 1850)

    // T=2200ms: El logo se desplaza en línea recta directa hacia el navbar
    const t3 = setTimeout(() => setStage('travel'), 2200)

    // T=2950ms: El logo encaja exactamente en el navbar; concluimos y damos relevo
    const t4 = setTimeout(() => {
      setStage('done')
      if (onComplete) onComplete()
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {}
    }, 2950)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', updateMeasurements)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onComplete])

  if (stage === 'done') return null

  const isTraveling = stage === 'travel'
  const isFadingText = stage === 'fade_text' || isTraveling

  // Destino exacto en el navbar
  const rect = destRect || {
    top: 16,
    left: 8,
    width: 52 * LOGO_ASPECT_RATIO,
    height: 52,
  }

  const screenW = windowSize.width || (typeof window !== 'undefined' ? window.innerWidth : 1200)
  const screenH = windowSize.height || (typeof window !== 'undefined' ? window.innerHeight : 800)

  // Coordenadas del centro exacto del viewport
  const centerX = screenW / 2 - W_CENTER / 2
  const centerY = screenH / 2 - H_CENTER / 2

  // Desplazamiento desde el destino (rect.left, rect.top) hasta el centro exacto
  const startX = centerX - rect.left
  const startY = centerY - rect.top
  const startScale = H_CENTER / rect.height

  return (
    <AnimatePresence>
      {/* 1. FONDO NEGRO Y TEXTOS CENTRALES (SE DESVANECEN SUAVEMENTE AL VIAJAR) */}
      <motion.div
        key="ecosystem-boot-backdrop"
        initial={{ opacity: 1 }}
        animate={{ opacity: isTraveling ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="fixed inset-0 z-[100] pointer-events-none bg-black overflow-hidden select-none"
      >
        {/* Glow de fondo de ignición inicial */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: stage === 'ignite' ? 0.35 : 0,
            scale: stage === 'ignite' ? 1.15 : 0.8,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.22)_0%,rgba(37,99,235,0.1)_40%,transparent_70%)] pointer-events-none blur-xl"
        />

        {/* TEXTO INFORMATIVO CENTRAL (SIN MÓDULOS)
            Desaparece suavemente antes del desplazamiento del logo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: isFadingText ? 0 : stage === 'ignite' ? 1 : 0,
            y: isFadingText ? 15 : stage === 'ignite' ? 0 : 10,
          }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="absolute top-[calc(50%+58px)] left-0 right-0 flex flex-col items-center pointer-events-none text-center px-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <p className="text-[12px] sm:text-[13px] font-black uppercase tracking-[0.35em] text-white">
              INKOGNITO <span className="text-zinc-400 font-light">ECOSYSTEM</span>
            </p>
          </div>
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-medium">
            PLATAFORMA MODULAR INTEGRADA
          </p>
        </motion.div>
      </motion.div>

      {/* 2. EL LOGO EN VUELO INDEPENDIENTE (z-[101])
          NO es hijo del overlay que se desvanece, garantizando OPACIDAD 100% SÓLIDA
          durante todo el trayecto hasta el aterrizaje en el navbar (cero espabilar ni parpadeo) */}
      <motion.div
        key="ecosystem-boot-flying-logo"
        style={{
          position: 'fixed',
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          transformOrigin: 'top left',
          zIndex: 101,
        }}
        initial={{
          x: startX,
          y: startY,
          scale: startScale,
          opacity: 0,
        }}
        animate={
          isTraveling
            ? {
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1, // Totalmente sólido (100% opaco) todo el vuelo
              }
            : stage === 'ignite' || stage === 'fade_text'
            ? {
                x: startX,
                y: startY,
                scale: startScale,
                opacity: 1,
              }
            : {
                x: startX,
                y: startY,
                scale: startScale,
                opacity: 0,
              }
        }
        transition={
          isTraveling
            ? {
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1], // Curva física Apple / Wiltech suave
              }
            : {
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }
        }
        className="pointer-events-none select-none"
      >
        <motion.img
          src={inkognitoLogo}
          alt="INKognito"
          animate={{
            filter: isTraveling
              ? 'drop-shadow(0 0 0px rgba(255,255,255,0))'
              : 'drop-shadow(0 0 25px rgba(255,255,255,0.45))',
          }}
          transition={{ duration: 0.7 }}
          className="w-full h-full object-contain"
        />
      </motion.div>
    </AnimatePresence>
  )
}
