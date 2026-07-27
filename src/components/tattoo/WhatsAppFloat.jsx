import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'

// Antes era un solo botón "Reservar" → WhatsApp. Ahora "Reserva" es una
// etiqueta (no clickeable) seguida de dos botones con destino propio: Online
// (al formulario de agenda de /jhumaneztattoo) y WhatsApp (chat directo).
// Se usa en varias páginas (Home, Portafolio, Cuidados) — "Online" enlaza
// con ruta completa (no solo #contacto) para que funcione desde cualquiera.
export default function WhatsAppFloat({ hidden = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [nearFooter, setNearFooter] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Se oculta apenas el footer entra en el viewport para no taparle los links
  // de Términos/Privacidad/Desarrollado por INKognito — reaparece al subir.
  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return
    const observer = new IntersectionObserver(([entry]) => setNearFooter(entry.isIntersecting))
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  const visible = scrolled && !hidden && !nearFooter

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 bg-black/95 border border-white/10 rounded-full shadow-xl pl-4 pr-1.5 py-1.5 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      <span className="text-white font-bold uppercase tracking-widest text-xs sm:text-sm pr-0.5">
        Reserva
      </span>

      <Link
        to="/jhumaneztattoo#contacto"
        className="px-3.5 py-2 rounded-full bg-green-600 text-white font-bold uppercase tracking-widest text-[11px] sm:text-xs hover:bg-green-500 transition-colors whitespace-nowrap"
      >
        Online
      </Link>

      <a
        href="https://wa.me/573207911013?text=Hola%20Jose,%20quiero%20informaci%C3%B3n%20sobre%20un%20tatuaje"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Reservar por WhatsApp"
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#25D366] text-white font-bold uppercase tracking-widest text-[11px] sm:text-xs hover:brightness-95 transition-all whitespace-nowrap"
      >
        <FaWhatsapp size={14} />
        WhatsApp
      </a>
    </div>
  )
}
