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
// soporta animar hacia/desde 'auto'), Y el nombre del módulo trae su
// propio `x` explícito sincronizado con el mismo estado/transition — así
// los dos se mueven a la vez, con la misma curva de tiempo, en un solo
// gesto continuo en vez de que el nombre del módulo solo "salte" a su
// lugar por el reflow pasivo del hermano encogiéndose.
//
// v3 (2026-08-02) — cada Navbar* vive dentro de la página (no en un layout
// persistente en root.jsx), así que sin esto la animación se repetía en
// CADA navegación dentro del mismo módulo (ej. Store → Store/ropa-dama
// volvía a mostrar "INKOGNITO STORE" completo) — Jose lo reportó: una vez
// que "INKOGNITO" se esconde, debe quedar escondido en todas las rutas del
// módulo, no solo en la página principal. Se guarda en sessionStorage,
// una key por nombre de módulo, para que la intro solo se vea una vez por
// sesión y de ahí en adelante cada Navbar* monte ya colapsado (sin
// animar) en cualquier página de ese módulo.
export default function AnimatedWordmark({ moduleWord, accentClassName = 'text-white', className = '' }) {
  const storageKey = `inkognito-wordmark-seen-${moduleWord}`
  const [collapsed, setCollapsed] = useState(false)
  // Cuando ya se vio antes en esta sesión, la transición pasa a duración 0
  // — colapsa de inmediato en el primer efecto post-hidratación en vez de
  // animar, evitando repetir el gesto en cada página nueva.
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
      <motion.span
        animate={{ width: collapsed ? 0 : 'auto', opacity: collapsed ? 0 : 1 }}
        transition={transition}
        style={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap' }}
      >
        <span className="text-white">INK</span>
        <span className={accentClassName}>OGNITO</span>
        {' '}
      </motion.span>
      <motion.span
        animate={{ x: collapsed ? 0 : 18 }}
        transition={transition}
        className={`${accentClassName} whitespace-nowrap`}
      >
        {moduleWord}
      </motion.span>
    </span>
  )
}
