import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

// Animación de entrada del logo de cada módulo (Store/Supply/Gym/Suple):
// "INKOGNITO" se desliza hacia la izquierda y desaparece (como si se
// incrustara en el logo, a su izquierda), mientras el nombre del módulo
// ocupa su lugar.
//
// v2 (2026-08-02) — la primera versión usaba AnimatePresence + `layout` en
// el span vecino: eso anima en DOS pasos (primero termina de salir
// "INKOGNITO", RECIÉN AHÍ arranca el reflow del nombre del módulo), lo que
// se sentía "brusco" en vez de un solo movimiento fluido. Acá en cambio se
// anima el `width` del contenedor de "INKOGNITO " de 'auto' a 0 (motion
// soporta animar hacia/desde 'auto') — el nombre del módulo es un span
// hermano normal, sin su propia animación: se desliza a la izquierda solo
// porque el navegador recalcula el layout en cada frame mientras el
// hermano se encoge, así que ambos se mueven a la vez, con la misma curva
// de tiempo, en un solo gesto continuo.
//
// Se dispara una vez por montaje del componente — como cada Navbar* vive
// dentro de la página (no en un layout persistente en root.jsx), esto
// significa que la animación se repite en cada navegación a una página que
// use este wordmark, no solo "la primera vez que se entra al módulo" en
// sentido estricto de sesión. Si se siente repetitivo, se puede acotar con
// sessionStorage más adelante.
export default function AnimatedWordmark({ moduleWord, accentClassName = 'text-white', className = '' }) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setCollapsed(true), 550)
    return () => clearTimeout(t)
  }, [])

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      <motion.span
        animate={{ width: collapsed ? 0 : 'auto', opacity: collapsed ? 0 : 1 }}
        transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
        style={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap' }}
      >
        <span className="text-white">INK</span>
        <span className={accentClassName}>OGNITO</span>
        {' '}
      </motion.span>
      <span className={`${accentClassName} whitespace-nowrap`}>{moduleWord}</span>
    </span>
  )
}
