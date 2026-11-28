import { Link, useLocation } from 'react-router'
import { Home, Flame, CalendarRange, Heart, Menu as MenuIcon } from 'lucide-react'
import { useInkFavoritos } from '../../contexts/InkFavoritosContext'

const ACCENT = '#B3202F'

export default function InkMobileNav({ menuOpen = false, onToggleMenu, onCloseMenu }) {
  const { pathname } = useLocation()
  const { unseenCount } = useInkFavoritos()

  const active =
    pathname === '/tattoo-artist-colombia'
      ? 'inicio'
      : pathname.startsWith('/tattoo-artist-colombia/novedades')
        ? 'novedades'
        : pathname.startsWith('/tattoo-artist-colombia/stands')
          ? 'stands'
          : pathname.startsWith('/tattoo-artist-colombia/favoritos')
            ? 'favoritos'
            : null

  const marca = (key) =>
    !menuOpen && active === key ? (
      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-stone-800" />
    ) : null

  const handleInicioClick = (e) => {
    if (menuOpen && onCloseMenu) onCloseMenu()
    if (pathname === '/tattoo-artist-colombia') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] flex justify-around items-center bg-white/95 backdrop-blur-md border-t border-gray-200 py-2.5 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.12)]">
      <Link
        to="/tattoo-artist-colombia"
        onClick={handleInicioClick}
        className="relative flex flex-col items-center gap-1 text-gray-900 min-w-[56px]"
      >
        {marca('inicio')}
        <Home size={19} />
        <span className="text-[9px] font-bold uppercase tracking-wide">Inicio</span>
      </Link>

      <Link
        to="/tattoo-artist-colombia/novedades"
        onClick={() => { if (menuOpen && onCloseMenu) onCloseMenu() }}
        className="relative flex flex-col items-center gap-1 text-gray-900 min-w-[56px]"
      >
        {marca('novedades')}
        <Flame size={19} />
        <span className="text-[9px] font-bold uppercase tracking-wide">Novedades</span>
      </Link>

      <Link
        to="/tattoo-artist-colombia/stands"
        onClick={() => { if (menuOpen && onCloseMenu) onCloseMenu() }}
        className="relative flex flex-col items-center gap-1 text-gray-900 min-w-[56px]"
      >
        {marca('stands')}
        <CalendarRange size={19} />
        <span className="text-[9px] font-bold uppercase tracking-wide">Stands</span>
      </Link>

      <Link
        to="/tattoo-artist-colombia/favoritos"
        onClick={() => { if (menuOpen && onCloseMenu) onCloseMenu() }}
        className="relative flex flex-col items-center gap-1 text-gray-900 min-w-[56px]"
      >
        {marca('favoritos')}
        <Heart size={19} />
        {unseenCount > 0 && (
          <span
            className="absolute -top-1 right-2 min-w-[14px] h-[14px] px-1 rounded-full text-white text-[8px] font-black flex items-center justify-center leading-none"
            style={{ backgroundColor: ACCENT }}
          >
            {unseenCount > 9 ? '9+' : unseenCount}
          </span>
        )}
        <span className="text-[9px] font-bold uppercase tracking-wide">Favoritos</span>
      </Link>

      <button
        type="button"
        onClick={onToggleMenu}
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={menuOpen}
        className="relative flex flex-col items-center gap-1 text-gray-900 min-w-[56px] cursor-pointer"
      >
        {menuOpen && (
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-stone-800" />
        )}
        <span
          className="inline-flex transition-transform duration-300 ease-in-out"
          style={{ transform: menuOpen ? 'rotate(-90deg)' : 'rotate(0deg)' }}
        >
          <MenuIcon size={19} />
        </span>
        <span className="text-[9px] font-bold uppercase tracking-wide">Menú</span>
      </button>
    </div>
  )
}
