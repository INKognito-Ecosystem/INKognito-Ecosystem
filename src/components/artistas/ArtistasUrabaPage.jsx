import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import EcosystemNavbar from '../ecosystem/EcosystemNavbar'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#B3202F'

const MUNICIPIOS = ['Chigorodó', 'Apartadó', 'Turbo', 'Carepa']

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

export async function loader() {
  try {
    const res = await fetch(`${PANEL_URL}/api/artistas`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return { artistas: await res.json() }
  } catch {
    return { artistas: [] }
  }
}

export function meta() {
  const title = 'Tattoo Artist Urabá | Directorio de tatuadores — INKognito'
  const description = 'Encuentra tatuadores en Urabá — Chigorodó, Apartadó, Turbo y Carepa. Portafolio, estilo y contacto directo por WhatsApp.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/tattoo-artist-uraba` },
  ]
}

// Módulo nuevo (2026-08-03), desplegado sin exponer aún — ver plan de
// "Directorio de artistas de tatuaje en Urabá". Paleta propia (rojo tinta,
// #B3202F) para no repetir el azul/dorado/gris ya usados por Supply/Store/
// Suple — sujeto a revisión de Jose antes del lanzamiento ("estas landing
// serán de mejora constante").
export default function ArtistasUrabaPage() {
  const { artistas } = useLoaderData()
  const [municipio, setMunicipio] = useState('Todos')
  const [estilo, setEstilo] = useState('Todos')

  const ESTILOS_DIN = ['Todos', ...new Set(artistas.map(a => a.estilo).filter(Boolean))]

  const filtrados = artistas.filter(a =>
    (municipio === 'Todos' || a.municipio === municipio) &&
    (estilo === 'Todos' || a.estilo === estilo)
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <EcosystemNavbar logoFilter="brightness(0) invert(1)" showTattooSection={false} />

      <section className="relative overflow-hidden pt-24 pb-10 md:pb-14 px-4 md:px-6">
        <div className="absolute inset-0 opacity-[0.08]" style={DOT_PATTERN} />
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <p className="uppercase tracking-[0.4em] text-xs md:text-sm mb-4 font-semibold" style={{ color: ACCENT }}>
            Tattoo Artist Urabá
          </p>
          <h1 className="text-4xl sm:text-6xl font-black uppercase leading-[0.95] mb-6">
            Encuentra tu <span style={{ color: ACCENT }}>tatuador</span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Artistas de tatuaje respaldados por INKognito en toda la región de Urabá. Filtra por municipio o estilo, revisa portafolio y escribe directo por WhatsApp.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-6 pb-16 max-w-6xl mx-auto">

        {/* FILTROS */}
        <div className="flex flex-col gap-3 mb-10">
          <div className="flex gap-2 flex-wrap justify-center">
            {['Todos', ...MUNICIPIOS].map(m => (
              <button
                key={m}
                onClick={() => setMunicipio(m)}
                className={`text-xs font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full border transition-all duration-200 ${
                  municipio === m ? 'bg-white text-black border-white' : 'border-zinc-700 text-zinc-400 hover:border-zinc-400 hover:text-white'
                }`}
              >
                <MapPin size={11} className="inline mr-1 -mt-0.5" />
                {m}
              </button>
            ))}
          </div>
          {ESTILOS_DIN.length > 1 && (
            <div className="flex gap-2 flex-wrap justify-center">
              {ESTILOS_DIN.map(e => (
                <button
                  key={e}
                  onClick={() => setEstilo(e)}
                  className={`text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full border transition-all duration-200 ${
                    estilo === e ? 'text-black border-transparent' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
                  style={estilo === e ? { backgroundColor: ACCENT } : {}}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {/* Card fija de jhumaneztattoo — artista fundador, enlaza a su sitio completo */}
          <Link
            to="/jhumaneztattoo"
            className="group relative aspect-[3/4] rounded-xl overflow-hidden border-2 flex flex-col items-center justify-center gap-2 text-center px-3"
            style={{ borderColor: ACCENT }}
          >
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full absolute top-2 left-2" style={{ backgroundColor: ACCENT, color: 'white' }}>
              Fundador
            </span>
            <p className="font-black uppercase text-sm leading-tight">Jose Humanez</p>
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Chigorodó</p>
            <p className="text-zinc-600 text-[9px] uppercase tracking-widest mt-2 group-hover:text-white transition-colors">Ver sitio completo →</p>
          </Link>

          {filtrados.map(a => {
            const foto = a.foto_url
            return (
              <Link
                key={a.id}
                to={`/artista/${a.id}`}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-300 bg-zinc-950"
              >
                {foto ? (
                  <img src={foto} alt={a.nombre} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-800 text-4xl font-black">
                    {a.nombre?.[0] || '?'}
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3 pt-8">
                  <p className="font-black uppercase text-xs leading-tight text-white">{a.nombre}</p>
                  <p className="text-zinc-400 text-[10px] uppercase tracking-widest mt-0.5">{a.municipio}{a.estilo ? ` · ${a.estilo}` : ''}</p>
                </div>
              </Link>
            )
          })}

          {filtrados.length === 0 && (
            <div className="col-span-2 md:col-span-4 text-center py-10 text-zinc-600 text-sm">
              No hay artistas con ese filtro por ahora.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
