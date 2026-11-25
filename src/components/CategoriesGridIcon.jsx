import { useEffect, useRef } from 'react'
import { useNavigation } from 'react-router'
import { motion } from 'motion/react'

// Memoria global del estado visual anterior entre montajes de ruta:
// cuando se navega de /<modulo> -> /<modulo>/categorias (o viceversa), el
// nuevo componente arranca en `initial` con el estado anterior y anima hacia
// el nuevo estado de forma garantizada en cada toque.
let lastCategoriesOpen = false

const SPRING_UP = { type: 'spring', stiffness: 360, damping: 24, mass: 0.7 }
const SPRING_DOWN = { type: 'spring', stiffness: 360, damping: 24, mass: 0.7, delay: 0.03 }

/**
 * Ícono animado de Categorías (4 cuadros 2x2 en HTML puro GPU-acelerado):
 * - Al abrir: inferior izquierdo -> superior derecho, inferior derecho -> superior izquierdo
 *   (y los superiores bajan en diagonal a ocupar los inferiores).
 * - Al cerrar (tocando Categorías otra vez, Atrás o cualquier otro botón):
 *   los 4 cuadros regresan suavemente a sus posiciones originales.
 */
export default function CategoriesGridIcon({ open = false, size = 19, className = '' }) {
  const navigation = useNavigation()
  const pendingPath = navigation.location?.pathname || null
  const targetOpen = pendingPath
    ? /\/categorias\/?$/.test(pendingPath)
    : open

  // Captura el estado inicial en el instante de montar esta instancia
  const initialOpenRef = useRef(lastCategoriesOpen)

  useEffect(() => {
    lastCategoriesOpen = targetOpen
  }, [targetOpen])

  // Dimensiones proporcionales a `size` (default 19px -> cuadros de 7px, separación 3px, salto 10px)
  const sq = Math.round(size * 0.37)
  const pad = Math.round(size * 0.08)
  const step = size - pad * 2 - sq

  const boxStyle = {
    width: `${sq}px`,
    height: `${sq}px`,
    borderWidth: '1.8px',
    borderStyle: 'solid',
    borderColor: 'currentColor',
    borderRadius: '2px',
    boxSizing: 'border-box',
    position: 'absolute',
  }

  const init = initialOpenRef.current

  return (
    <span
      aria-hidden="true"
      className={`relative inline-block flex-shrink-0 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* Superior izquierdo -> pasa a inferior derecho */}
      <motion.span
        style={{ ...boxStyle, left: `${pad}px`, top: `${pad}px` }}
        initial={{ x: init ? step : 0, y: init ? step : 0 }}
        animate={{ x: targetOpen ? step : 0, y: targetOpen ? step : 0 }}
        transition={SPRING_DOWN}
      />
      {/* Superior derecho -> pasa a inferior izquierdo */}
      <motion.span
        style={{ ...boxStyle, left: `${pad + step}px`, top: `${pad}px` }}
        initial={{ x: init ? -step : 0, y: init ? step : 0 }}
        animate={{ x: targetOpen ? -step : 0, y: targetOpen ? step : 0 }}
        transition={SPRING_DOWN}
      />
      {/* Inferior izquierdo -> sube al superior derecho */}
      <motion.span
        style={{ ...boxStyle, left: `${pad}px`, top: `${pad + step}px` }}
        initial={{ x: init ? step : 0, y: init ? -step : 0 }}
        animate={{ x: targetOpen ? step : 0, y: targetOpen ? -step : 0 }}
        transition={SPRING_UP}
      />
      {/* Inferior derecho -> sube al superior izquierdo */}
      <motion.span
        style={{ ...boxStyle, left: `${pad + step}px`, top: `${pad + step}px` }}
        initial={{ x: init ? -step : 0, y: init ? -step : 0 }}
        animate={{ x: targetOpen ? -step : 0, y: targetOpen ? -step : 0 }}
        transition={SPRING_UP}
      />
    </span>
  )
}
