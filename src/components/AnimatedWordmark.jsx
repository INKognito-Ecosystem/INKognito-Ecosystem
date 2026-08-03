import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

// Animación de entrada del logo de cada módulo (Store/Supply/Gym/Suple):
// "INKOGNITO" se desliza hacia la izquierda y desaparece (como si se
// incrustara en el logo, a su izquierda), mientras el nombre del módulo se
// desliza a la izquierda para ocupar el espacio que dejó — usa el prop
// `layout` de motion para que ese reflow sea automático y fluido en vez de
// calcular anchos a mano (2026-08-02, pedido de Jose).
//
// Se dispara una vez por montaje del componente — como cada Navbar* vive
// dentro de la página (no en un layout persistente en root.jsx), esto
// significa que la animación se repite en cada navegación a una página que
// use este wordmark, no solo "la primera vez que se entra al módulo" en
// sentido estricto de sesión. Si se siente repetitivo, se puede acotar con
// sessionStorage más adelante.
export default function AnimatedWordmark({ moduleWord, accentClassName = 'text-white', className = '' }) {
  const [showFull, setShowFull] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShowFull(false), 550)
    return () => clearTimeout(t)
  }, [])

  return (
    <span className={`inline-flex items-baseline overflow-hidden ${className}`}>
      <AnimatePresence>
        {showFull && (
          <motion.span
            key="prefix"
            initial={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="whitespace-nowrap"
          >
            <span className="text-white">INK</span>
            <span className={accentClassName}>OGNITO</span>
            {' '}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span
        layout
        transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
        className={`${accentClassName} whitespace-nowrap`}
      >
        {moduleWord}
      </motion.span>
    </span>
  )
}
