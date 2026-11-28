import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ExternalLink } from 'lucide-react'
import { cloudinaryLimit } from '../../lib/cloudinary'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Franja publicitaria flexible para Convenciones, Expos y Seminarios aprobados
// desde el Panel Admin (Eventos INK). Soporta tiras angostas horizontales,
// banners estándar y GIFs animados sin recortar texto ni congelar animación.
// Si no hay pautas activas para el módulo, no renderiza nada.
export default function BannerEventoPublicitario({ modulo = 'supply', className = '' }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    let cancelado = false
    fetch(`${PANEL_URL}/api/banners-publicos?modulo=${encodeURIComponent(modulo)}`)
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (!cancelado && Array.isArray(data?.items) && data.items.length > 0) {
          setItems(data.items)
        }
      })
      .catch(() => {})
    return () => { cancelado = true }
  }, [modulo])

  if (items.length === 0) return null

  return (
    <div className={`space-y-2.5 ${className}`}>
      {items.map((ev) => {
        const rawUrl = ev.banner_url || ev.imagen_url
        if (!rawUrl) return null
        const esGif = /\.gif(\?|$)/i.test(rawUrl)
        const src = esGif ? rawUrl : cloudinaryLimit(rawUrl, 1200)
        const externo = !!(ev.url_externa && /^https?:\/\//i.test(ev.url_externa))

        const cuerpo = (
          <div className="relative rounded-xl border border-gray-200 bg-zinc-950 overflow-hidden shadow-sm group">
            <img
              src={src}
              alt={ev.titulo || 'Evento oficial'}
              className="w-full h-auto max-h-44 object-contain mx-auto block"
              loading="lazy"
            />
            <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-black/80 text-white text-[10px]">
              <span className="font-bold uppercase tracking-wider truncate">
                {ev.titulo || 'Evento oficial'}
                {ev.ciudad ? ` · ${ev.ciudad}` : ''}
              </span>
              <span className="inline-flex items-center gap-1 text-zinc-300 font-bold uppercase tracking-widest flex-shrink-0">
                {ev.patrocinado ? 'Aliado' : 'Evento'} <ExternalLink size={10} />
              </span>
            </div>
          </div>
        )

        return externo ? (
          <a key={ev.id} href={ev.url_externa} target="_blank" rel="noreferrer" className="block">
            {cuerpo}
          </a>
        ) : (
          <Link key={ev.id} to="/tattoo-artist-colombia/novedades" className="block">
            {cuerpo}
          </Link>
        )
      })}
    </div>
  )
}
