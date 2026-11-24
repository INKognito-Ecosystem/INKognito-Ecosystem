import { useEffect, useState } from 'react'

// Persiste el estado anterior entre cambios de ruta para que al entrar o salir
// de /<modulo>/categorias la transición diagonal de los 4 cuadros siempre se vea.
let lastCategoriesOpen = false

/**
 * Ícono animado de Categorías (4 cuadros 2x2):
 * - Al abrir: el cuadro inferior izquierdo viaja al superior derecho y el
 *   inferior derecho al superior izquierdo (cruce diagonal limpio).
 * - Al cerrar (tocando Categorías otra vez o tocando cualquier otro botón):
 *   los 4 cuadros regresan suavemente a sus posiciones originales.
 */
export default function CategoriesGridIcon({ open = false, size = 19, className = '' }) {
  const [swapped, setSwapped] = useState(() => lastCategoriesOpen)

  useEffect(() => {
    if (swapped === open) {
      lastCategoriesOpen = open
      return
    }
    let raf2
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setSwapped(open)
        lastCategoriesOpen = open
      })
    })
    return () => {
      cancelAnimationFrame(raf1)
      if (raf2) cancelAnimationFrame(raf2)
    }
  }, [open, swapped])

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
        }}
      />
    </svg>
  )
}
