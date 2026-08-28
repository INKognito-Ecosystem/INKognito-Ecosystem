import { useRef, useState } from 'react'
import { cloudinarySquare } from '../lib/cloudinary'

// Galería de hasta 3 fotos por producto/variante (2026-08-01). Nunca monta
// más de un <img> a la vez — el src cambia según el índice activo (mismo
// truco key={src} que ya usaban las cards para el fade-in), así que por
// defecto solo se descarga la foto de portada, igual que antes de este
// componente existir. Las fotos 2/3 solo se piden al navegador cuando el
// usuario interactúa (hover-scrub en desktop, swipe en móvil) — nunca se
// precargan en una grilla de catálogo.
//
// Modo no controlado (cards de catálogo/marca): el propio componente lleva
// su índice y lo resetea a 0 al salir el mouse. Modo controlado (landing
// individual, con fila de thumbnails clicables aparte): pasar
// activeIndex/onIndexChange — ahí NO se resetea al salir el mouse, para no
// pelear con una foto que el usuario ya eligió a propósito.
export default function ProductImageGallery({
  images,
  alt,
  imgClassName = '',
  containerClassName = '',
  activeIndex,
  onIndexChange,
  eager = false,
  onImgError,
  // square (2026-08-09, Pilar 2 Cloudinary): opt-in — tarjetas de catálogo
  // (Supply/Store/Suplementos) lo activan para pasar de recorte
  // (object-cover) a relleno con fondo blanco. La foto grande de
  // ProductLandingPage también lo activa desde 2026-08-27 (antes se
  // dejaba sin square a propósito para mostrar la imagen "tal cual" —
  // con Supply multi-tenant, fotos de estudios de cualquier proporción
  // ya no tenían un formato consistente entre sí).
  square = false,
}) {
  const [internalIdx, setInternalIdx] = useState(0)
  const controlled = activeIndex != null
  const idx = controlled ? activeIndex : internalIdx
  const setIdx = controlled ? onIndexChange : setInternalIdx
  const touchStartX = useRef(null)
  const multi = images.length > 1
  const src = square ? cloudinarySquare(images[idx]) : images[idx]

  const handleMouseMove = (e) => {
    if (!multi) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const next = Math.min(images.length - 1, Math.max(0, Math.floor(ratio * images.length)))
    setIdx(next)
  }

  const handleMouseLeave = () => {
    if (!multi || controlled) return
    setInternalIdx(0)
  }

  const handleTouchStart = (e) => {
    if (!multi) return
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (!multi || touchStartX.current == null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < 40) return
    const dir = delta < 0 ? 1 : -1
    setIdx(Math.min(images.length - 1, Math.max(0, idx + dir)))
  }

  return (
    <div
      className={`relative ${containerClassName}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        key={src}
        src={src}
        alt={alt}
        className={`transition-opacity duration-200 ${imgClassName}`}
        loading={eager ? undefined : 'lazy'}
        onError={onImgError}
      />
      {multi && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === idx ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
