import { useState, useEffect } from 'react'

export function useScrolled(threshold = 100) {
  // false (no "scrolled") en vez de leer window.scrollY acá — este hook corre
  // durante el render inicial, que también pasa en el servidor (sin window).
  // El efecto de abajo corrige el valor real apenas monta en el cliente.
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}
