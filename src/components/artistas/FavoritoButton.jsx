import { Heart } from 'lucide-react'
import { useInkFavoritos } from '../../contexts/InkFavoritosContext'

const ACCENT = '#B3202F'

export default function FavoritoButton({ tipo, item, size = 15, className = '', variant = 'floating' }) {
  const { esFavorito, toggleFavorito } = useInkFavoritos()
  const guardado = esFavorito(tipo, item?.id)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorito(tipo, item)
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={guardado ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        aria-pressed={guardado}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wide transition-all cursor-pointer ${
          guardado
            ? 'border-[#B3202F]/30 bg-[#B3202F]/10 text-[#B3202F]'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900'
        } ${className}`}
      >
        <Heart
          size={size}
          fill={guardado ? ACCENT : 'none'}
          className={guardado ? 'text-[#B3202F]' : 'text-gray-500'}
        />
        <span>{guardado ? 'Guardado' : 'Guardar'}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={guardado ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      aria-pressed={guardado}
      className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-sm ${
        guardado
          ? 'bg-white/95 text-[#B3202F] scale-105'
          : 'bg-black/45 text-white hover:bg-black/65'
      } ${className}`}
    >
      <Heart
        size={size}
        fill={guardado ? ACCENT : 'none'}
        strokeWidth={2.2}
      />
    </button>
  )
}
