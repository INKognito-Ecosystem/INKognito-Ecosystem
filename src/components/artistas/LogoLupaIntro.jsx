import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search } from 'lucide-react'

const STORAGE_KEY = 'inkognito-artistas-logo-lupa-visto'

// Animación de bienvenida — pedido de Jose (2026-08-05): "una lupa encima
// del logo, haga una especie de zoom, y luego desaparece", solo la
// PRIMERA VEZ que alguien entra a la plataforma. A diferencia del resto de
// animaciones del módulo (AnimatedWordmark/AnimatedCityWordmark, que usan
// sessionStorage y se repiten en cada sesión nueva), acá se pidió
// explícitamente "solo sería para usuarios que visitan por primera vez"
// — sin importar cuántas sesiones abran después — así que se guarda en
// localStorage, no sessionStorage.
//
// v2 (2026-08-05) — v1 leía localStorage en un lazy initializer de
// useState para decidir el estado inicial. Eso rompía la hidratación: el
// servidor no tiene localStorage (arranca en `mostrar=false`), pero en el
// cliente, en una visita real de primera vez, ese mismo initializer SÍ
// encontraba localStorage vacío y arrancaba en `mostrar=true` — servidor
// y cliente no coincidían en el primer render, y React descartaba todo el
// árbol de SSR de la página para esa visita. La lectura de localStorage
// ahora vive ENTERAMENTE dentro de un useEffect (que solo corre en
// cliente, después de hidratar) — `mostrar` arranca en `false` en los dos
// lados, sin excepción, y la animación aparece como una actualización
// normal post-hidratación, no como parte del render inicial.
//
// `decididoRef`/`primeraVezRef` (en vez de re-leer localStorage en cada
// ejecución del efecto) evitan un segundo bug de paso: en desarrollo,
// StrictMode ejecuta el efecto dos veces (monta → limpia → monta de
// nuevo) — sin este guard, la primera pasada ya deja "visto" escrito en
// localStorage, así que la segunda pasada lo relee como visita repetida y
// nunca programa el timeout que la esconde, quedando visible para
// siempre. Los refs sobreviven esa doble ejecución dentro del mismo
// montaje, así que ambas pasadas coinciden en la misma decisión.
export default function LogoLupaIntro() {
  const [mostrar, setMostrar] = useState(false)
  const decididoRef = useRef(false)
  const primeraVezRef = useRef(false)

  useEffect(() => {
    if (!decididoRef.current) {
      decididoRef.current = true
      try { primeraVezRef.current = localStorage.getItem(STORAGE_KEY) !== '1' } catch { primeraVezRef.current = false }
      if (primeraVezRef.current) {
        try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
      }
    }
    if (!primeraVezRef.current) return

    setMostrar(true)
    // 1800ms → 3400ms (Jose, 2026-08-05: "el icono buscar que aparece...
    // desaparece muy rapido"). Entrada+salida suman ~1s más, así que el
    // total visible en pantalla ronda los 4s.
    const t = setTimeout(() => setMostrar(false), 3400)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {mostrar && (
        <motion.div
          initial={{ opacity: 0, scale: 0.4, x: 6, y: 6, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute -bottom-1 -right-1 z-10 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center pointer-events-none"
        >
          <Search size={13} className="text-gray-700" strokeWidth={2.5} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
