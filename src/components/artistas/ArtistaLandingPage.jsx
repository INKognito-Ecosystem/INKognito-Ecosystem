import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { MapPin, Palette } from 'lucide-react'
import EcosystemNavbar from '../ecosystem/EcosystemNavbar'
import ProductImageGallery from '../ProductImageGallery'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#B3202F'

export async function loader({ params }) {
  try {
    const res = await fetch(`${PANEL_URL}/api/artistas/${params.id}`)
    if (!res.ok) return { artista: null }
    return { artista: await res.json() }
  } catch {
    return { artista: null }
  }
}

export function meta({ data }) {
  const artista = data?.artista
  if (!artista) return [{ title: 'Artista no encontrado | Tattoo Artist Urabá' }]
  const title = `${artista.nombre} — Tatuador en ${artista.municipio} | Tattoo Artist Urabá`
  const description = artista.bio || `${artista.nombre}, tatuador en ${artista.municipio}, Urabá. Portafolio y contacto directo por WhatsApp.`
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    ...(artista.foto_url ? [{ property: 'og:image', content: artista.foto_url }] : []),
  ]
}

export default function ArtistaLandingPage() {
  const { artista } = useLoaderData()
  const [imgIdx, setImgIdx] = useState(0)

  if (!artista) return (
    <div className="min-h-screen bg-black flex flex-col">
      <EcosystemNavbar logoFilter="brightness(0) invert(1)" showTattooSection={false} />
      <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm uppercase tracking-widest pt-20">
        Artista no encontrado
      </div>
    </div>
  )

  const images = [artista.foto_url, artista.foto_url_2, artista.foto_url_3].filter(Boolean)
  const waLink = artista.whatsapp
    ? `https://wa.me/${artista.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${artista.nombre}, te encontré en Tattoo Artist Urabá y quiero preguntarte por una cita.`)}`
    : null

  return (
    <div className="min-h-screen bg-black text-white">
      <EcosystemNavbar logoFilter="brightness(0) invert(1)" showTattooSection={false} />

      <div className="pt-20 max-w-5xl mx-auto px-4 py-8 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">

          {/* IZQUIERDA — portafolio */}
          <div className="space-y-3">
            {images.length > 0 ? (
              <>
                <ProductImageGallery
                  images={images}
                  alt={artista.nombre}
                  activeIndex={imgIdx}
                  onIndexChange={setImgIdx}
                  containerClassName="rounded-xl border border-zinc-800 overflow-hidden aspect-square"
                  imgClassName="w-full h-full object-cover"
                  eager
                />
                {images.length > 1 && (
                  <div className="hidden md:flex gap-2">
                    {images.map((src, i) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setImgIdx(i)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          i === imgIdx ? 'border-white' : 'border-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        <img src={src} alt={`${artista.nombre} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-800 text-6xl font-black">
                {artista.nombre?.[0] || '?'}
              </div>
            )}
          </div>

          {/* DERECHA — info + contacto */}
          <div className="space-y-5">
            <div>
              <p className="uppercase tracking-[0.3em] text-xs mb-2" style={{ color: ACCENT }}>Tattoo Artist Urabá</p>
              <h1 className="text-3xl md:text-4xl font-black uppercase leading-tight">{artista.nombre}</h1>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400">
                  <MapPin size={13} />
                  {artista.municipio}
                </span>
                {artista.estilo && (
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400">
                    <Palette size={13} />
                    {artista.estilo}
                  </span>
                )}
              </div>
            </div>

            {artista.bio && (
              <p className="text-zinc-400 text-sm leading-relaxed">{artista.bio}</p>
            )}

            <div className="flex flex-col gap-3 pt-2">
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 py-4 bg-green-600 text-white font-black uppercase tracking-widest rounded hover:bg-green-500 transition-all text-sm"
                >
                  <FaWhatsapp size={20} />
                  Escribir por WhatsApp
                </a>
              )}
              {artista.instagram && (
                <a
                  href={artista.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 py-4 border border-zinc-700 text-zinc-300 font-bold uppercase tracking-widest rounded hover:border-white hover:text-white transition-all text-sm"
                >
                  <FaInstagram size={18} />
                  Ver Instagram
                </a>
              )}
            </div>

            <div className="border-t border-zinc-800 pt-5">
              <Link to="/tattoo-artist-uraba" className="text-zinc-500 hover:text-white text-xs uppercase tracking-widest transition-colors">
                ← Ver más artistas en Urabá
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
