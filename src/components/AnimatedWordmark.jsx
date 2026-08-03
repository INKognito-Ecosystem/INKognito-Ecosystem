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
//
// v4 (2026-08-03) — la v3 seguía arrancando SIEMPRE en collapsed=false y
// corrigiendo recién en el useEffect (necesario en el load inicial vía SSR,
// donde el server no conoce sessionStorage y hay que hidratar igual que él).
// Pero al navegar de una category page a otra (Store/tintas → Store/agujas,
// por ejemplo) NO hay SSR de por medio — es una navegación 100% cliente que
// desmonta y vuelve a montar un AnimatedWordmark nuevo. `clientMounted`
// marca si YA pasamos por una hidratación en esta sesión de la SPA: en ese
// caso cualquier mount nuevo es puramente cliente y puede leer sessionStorage
// de una en el initializer de useState sin riesgo de mismatch — solo el
// primer mount de toda la sesión (el que sí vino de SSR) sigue arrancando en
// false y corrigiendo en el efecto.
//
// v5 (2026-08-03) — la v4 sí arrancaba con collapsed=true de una (confirmado
// con logs), pero el parpadeo seguía pasando igual al navegar entre category
// pages (Jose: "aun parpadea, en supply tambien"). Diagnosticado con
// Playwright inspeccionando estilo inline + identidad del nodo DOM en cada
// frame: NO es un problema de estado de React — es que motion, al animar
// `width` hacia/desde 'auto', necesita montar el nodo, dejar que el browser
// calcule su layout natural, y RECIÉN AHÍ aplicar el `width:0px` inline via
// un efecto — eso deja 1-2 frames donde el nodo nuevo (motion.span de
// "INKOGNITO") existe en el DOM sin el estilo todavía, mostrando el texto
// completo a tamaño natural antes de colapsarse. Pasa en CADA montaje nuevo
// del componente, sin importar qué diga `collapsed` desde el primer render.
// Es una limitación conocida de animar hacia 'auto' en Framer Motion, no
// arreglable ajustando el estado inicial. La solución: cuando ya sabemos que
// debe quedar oculto (`skipAnimation`), directamente NO montar ese
// motion.span — sin nodo, no hay chance de flash, sin importar cómo motion
// resuelva 'auto' internamente. El motion.span de la palabra del módulo (el
// que anima `x`, no `width`) no tiene este problema — transforms no
// requieren medir el layout natural — así que ese se deja igual.
let clientMounted = false

export default function AnimatedWordmark({ moduleWord, accentClassName = 'text-white', className = '' }) {
  const storageKey = `inkognito-wordmark-seen-${moduleWord}`

  const alreadySeen = () => {
    try { return sessionStorage.getItem(storageKey) === '1' } catch { return false }
  }

  const [collapsed, setCollapsed] = useState(() => clientMounted && alreadySeen())
  // Cuando ya se vio antes en esta sesión, ni se monta el motion.span de
  // "INKOGNITO" — ver nota v5 arriba.
  const [skipAnimation, setSkipAnimation] = useState(() => clientMounted && alreadySeen())

  useEffect(() => {
    clientMounted = true

    if (alreadySeen()) {
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

  const transition = { duration: 0.6, ease: [0.65, 0, 0.35, 1] }

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      {!skipAnimation && (
        <motion.span
          animate={{ width: collapsed ? 0 : 'auto', opacity: collapsed ? 0 : 1 }}
          transition={transition}
          style={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap' }}
        >
          <span className="text-white">INK</span>
          <span className={accentClassName}>OGNITO</span>
          {' '}
        </motion.span>
      )}
      <motion.span
        animate={{ x: collapsed ? 0 : 18 }}
        transition={skipAnimation ? { duration: 0 } : transition}
        className={`${accentClassName} whitespace-nowrap`}
      >
        {moduleWord}
      </motion.span>
    </span>
  )
}
