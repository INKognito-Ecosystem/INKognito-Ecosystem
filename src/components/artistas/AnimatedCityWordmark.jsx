import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

// Animación inversa de AnimatedWordmark.jsx (Store/Supply/Gym/Suple): allá
// "INKOGNITO" se encoge y el nombre del módulo ocupa su lugar; acá
// "Colombia" se encoge y el nombre de la ciudad detectada por IP
// (x-vercel-ip-city, ver colombiaGeo.js) aparece a su lado. Solo se monta
// cuando SÍ hubo detección — si no la hay, NavbarArtistas.jsx ni siquiera
// importa este componente, "Colombia" queda fijo.
//
// El span de "Colombia" reusa el mecanismo EXACTO ya probado en producción
// (motion.span animando `width` de 'auto' a 0) — ver las notas v1-v5 en
// AnimatedWordmark.jsx sobre el flash de animar hacia 'auto'. El span de la
// ciudad, a diferencia del nombre de módulo allá (que anima `x`), acá solo
// anima opacidad — así se evita por completo el mismo riesgo de flash en
// el sentido inverso (mostrar de una el ancho completo antes de poder
// medirlo). El costo es un pequeño espacio reservado de más mientras
// "Colombia" sigue visible (~0.9s) — imperceptible y se autocorrige apenas
// colapsa.
let clientMounted = false
const STORAGE_KEY = 'inkognito-artistas-city-seen'

export default function AnimatedCityWordmark({ ciudad }) {
  const alreadySeen = () => {
    try { return sessionStorage.getItem(STORAGE_KEY) === '1' } catch { return false }
  }

  const [collapsed, setCollapsed] = useState(() => clientMounted && alreadySeen())
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
      try { sessionStorage.setItem(STORAGE_KEY, '1') } catch {}
    }, 900)
    return () => clearTimeout(t)
  }, [])

  if (skipAnimation) {
    return <span className="text-gray-300 whitespace-nowrap">{ciudad}</span>
  }

  const transition = { duration: 0.6, ease: [0.65, 0, 0.35, 1] }

  return (
    <span className="inline-flex items-baseline">
      <motion.span
        animate={{ width: collapsed ? 0 : 'auto', opacity: collapsed ? 0 : 1 }}
        transition={transition}
        style={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap' }}
        className="text-gray-300"
      >
        Colombia
      </motion.span>
      <motion.span
        animate={{ opacity: collapsed ? 1 : 0 }}
        transition={transition}
        className="text-gray-300 whitespace-nowrap"
      >
        {ciudad}
      </motion.span>
    </span>
  )
}
