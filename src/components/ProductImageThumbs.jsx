import { cloudinarySquare } from '../lib/cloudinary'

// Fila de miniaturas de las fotos de un producto (máximo 3) para la FICHA del
// producto (2026-09-21, Jose: "estas fotos solo se mostrarán dentro de la
// landing de un producto específico"). Antes las fotos 2 y 3 solo se veían si
// el visitante pasaba el mouse por la foto grande o deslizaba el dedo, con
// unos puntitos como única pista — así que parecía que no estaban. Con 0 o 1
// foto no se dibuja nada. Controlado por la ficha: `activeIndex` /
// `onSelect`, el mismo índice que usa <ProductImageGallery>.
export default function ProductImageThumbs({ images, activeIndex, onSelect, className = '' }) {
  if (!images || images.length < 2) return null
  return (
    <div className={`flex items-center gap-2 ${className}`} role="group" aria-label="Fotos del producto">
      {images.map((src, i) => (
        <button
          key={`${i}-${src}`}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Ver foto ${i + 1} de ${images.length}`}
          aria-current={i === activeIndex ? 'true' : undefined}
          className={`w-16 h-16 rounded-lg overflow-hidden border-2 bg-zinc-50 flex-shrink-0 transition-colors ${
            i === activeIndex ? 'border-zinc-900' : 'border-zinc-200 hover:border-zinc-400'
          }`}
        >
          <img src={cloudinarySquare(src)} alt="" className="w-full h-full object-contain" loading="lazy" />
        </button>
      ))}
    </div>
  )
}
