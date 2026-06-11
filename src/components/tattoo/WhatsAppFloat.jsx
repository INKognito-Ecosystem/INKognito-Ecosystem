import { useState, useEffect } from 'react'
import { FaWhatsapp } from 'react-icons/fa'

export default function WhatsAppFloat({ hidden = false }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const visible = scrolled && !hidden

  return (
    <a
      href="https://wa.me/573207911013?text=Hola%20Jose,%20quiero%20informaci%C3%B3n%20sobre%20un%20tatuaje"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Reservar por WhatsApp"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 text-white font-bold uppercase tracking-widest text-sm shadow-xl transition-all duration-300 ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      <FaWhatsapp size={20} />
      Reservar
    </a>
  )
}
