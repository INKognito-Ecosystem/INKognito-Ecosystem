import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

// Animación de entrada del logo de cada módulo (Store/Supply/Gym/Suple):
// "INKOGNITO" se desliza hacia la izquierda y desaparece (como si se
// incrustara en el logo, a su izquierda), mientras el nombre del módulo
// se desliza a la izquierda para ocupar su lugar — un solo gesto fluido.
//
// v4 (2026-08-02) — probamos 2 enfoques que no quedaron bien:
//   v2: AnimatePresence (sin popLayout) + `layout` en el hermano — el
//       hermano solo empieza a reacomodarse DESPUÉS de que termina de
//       salir "INKOGNITO" (son dos animaciones en serie, no en paralelo),
//       se sentía brusco.
//   v3: animar el `width` del contenedor de "INKOGNITO " de 'auto' a 0 —
//       el texto se recorta con overflow:hidden mientras se encoge, lo
//       cual se ve mal (texto "cortado"/pegado) en vez de deslizarse.
// Acá con `AnimatePresence mode="popLayout"`: al desmontar "INKOGNITO",
// Motion lo saca del flujo (position:absolute) de inmediato para que el
// hermano con `layout` reaccione y se deslice EN PARALELO, no después —
// ambos son animaciones de transform puras (x/opacity), sin recorte de
// texto ni tranco. Este es el patrón que Framer Motion documenta
// específicamente para "un ítem sale, los hermanos se deslizan a la vez
// para llenar el espacio".
//
// El wordmark solo se anima una vez por módulo por sesión — cada Navbar*
// vive dentro de la página (no en un layout persistente en root.jsx), así
// que sin esto la intro se repetía en cada navegación dentro del mismo
// módulo. Se guarda en sessionStorage (una key por nombre de módulo): una
// vez visto, el wordmark monta directamente colapsado (sin animar) en
// cualquier otra ruta de ese módulo.
export default function AnimatedWordmark({ moduleWord, accentClassName = 'text-white', className = '' }) {
  const storageKey = `inkognito-wordmark-seen-${moduleWord}`
  const [collapsed, setCollapsed] = useState(false)
  const [skipAnimation, setSkipAnimation] = useState(false)

  useEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem(storageKey) === '1' } catch {}

    if (seen) {
      setSkipAnimation(true)
      setCollapsed(true)
      return
    }

    const t = setTimeout(() => {
      setCollapsed(true)
      try { sessionStorage.setItem(storageKey, '1') } catch {}
    }, 550)
    return () => clearTimeout(t)
  }, [storageKey])

  const transition = skipAnimation ? { duration: 0 } : { duration: 0.6, ease: [0.65, 0, 0.35, 1] }

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        {!collapsed && (
          <motion.span
            key="prefix"
            exit={{ opacity: 0, x: -20 }}
            transition={transition}
            className="whitespace-nowrap"
          >
            <span className="text-white">INK</span>
            <span className={accentClassName}>OGNITO</span>
            {' '}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span
        layout
        transition={transition}
        className={`${accentClassName} whitespace-nowrap`}
      >
        {moduleWord}
      </motion.span>
    </span>
  )
}
