import { useEffect, useState } from 'react'
import { useNavigation } from 'react-router'

// Persiste el estado visual anterior entre cambios de ruta para que al entrar
// o salir de /<modulo>/categorias la transición diagonal de los 4 cuadros
// siempre se ejecute de forma visible, incluso si cambia el componente montado.
let lastCategoriesOpen = false

/**
 * Ícono animado de Categorías (4 cuadros 2x2):
 * - Al abrir: el cuadro inferior izquierdo viaja al superior derecho y el
 *   inferior derecho al superior izquierdo (cruce diagonal limpio).
 * - Al cerrar (tocando Categorías otra vez, botón Atrás o cualquier otro botón):
 *   los 4 cuadros regresan suavemente a sus posiciones originales.
 *
 * Usa useNavigation() para disparar la animación EN EL INSTANTE del toque
 * (sin esperar a que termine el loader de la nueva ruta en datos móviles).
 */
export default function CategoriesGridIcon({ open = false, size = 19, className = '' }) {
  const navigation = useNavigation()
  const pendingPath = navigation.location?.pathname || null
  const targetOpen = pendingPath
    ? /\/categorias\/?$/.test(pendingPath)
    : open

  const [swapped, setSwapped] = useState(() => lastCategoriesOpen)

  useEffect(() => {
    if (swapped === targetOpen) {
      lastCategoriesOpen = targetOpen
      return
    }
    // 40ms garantiza que el navegador móvil pinte el estado inicial antes de
    // aplicar el transform destino (evita que Chrome colapse ambos frames).
    const t = setTimeout(() => {
      setSwapped(targetOpen)
      lastCategoriesOpen = targetOpen
    }, 40)
    return () => clearTimeout(t)
  }, [targetOpen, swapped])

  const easeUp = 'transform 420ms cubic-bezier(0.34, 1.35, 0.64, 1)'
  const easeDown = 'transform 420ms cubic-bezier(0.34, 1.35, 0.64, 1) 35ms'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* Superior izquierdo -> pasa a inferior derecho */}
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1"
        style={{
          transform: swapped ? 'translate(11px, 11px)' : 'translate(0px, 0px)',
          transition: easeDown,
          willChange: 'transform',
        }}
      />
      {/* Superior derecho -> pasa a inferior izquierdo */}
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1"
        style={{
          transform: swapped ? 'translate(-11px, 11px)' : 'translate(0px, 0px)',
          transition: easeDown,
          willChange: 'transform',
        }}
      />
      {/* Inferior izquierdo -> sube al superior derecho */}
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1"
        style={{
          transform: swapped ? 'translate(11px, -11px)' : 'translate(0px, 0px)',
          transition: easeUp,
          willChange: 'transform',
        }}
      />
      {/* Inferior derecho -> sube al superior izquierdo */}
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1"
        style={{
          transform: swapped ? 'translate(-11px, -11px)' : 'translate(0px, 0px)',
          transition: easeUp,
          willChange: 'transform',
        }}
      />
    </svg>
  )
}
