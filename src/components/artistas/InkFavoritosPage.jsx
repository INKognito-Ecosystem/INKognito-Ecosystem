import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Heart, Palette, Building2, Image as ImageIcon, CalendarRange, MapPin, Trash2, ArrowRight } from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'
import { useInkFavoritos } from '../../contexts/InkFavoritosContext'
import { cloudinaryFill } from '../../lib/cloudinary'

const ACCENT = '#B3202F'

export function meta() {
  return [
    { title: 'Mis Favoritos | Tattoo Artist Colombia — INK' },
    { name: 'description', content: 'Tus artistas tatuadores, estudios, diseños, láminas y stands guardados en Tattoo Artist Colombia.' },
  ]
}

const TABS = [
  { key: 'todos', label: 'Todos' },
  { key: 'artistas', label: 'Artistas', icon: Palette },
  { key: 'estudios', label: 'Estudios', icon: Building2 },
  { key: 'disenos', label: 'Diseños y láminas', icon: ImageIcon },
  { key: 'stands', label: 'Stands', icon: CalendarRange },
]

export default function InkFavoritosPage() {
  const { favoritos, totalCount, quitarFavorito, hydrated, marcarFavoritosVistos } = useInkFavoritos()
  const [tab, setTab] = useState('todos')

  useEffect(() => {
    if (hydrated) marcarFavoritosVistos()
  }, [hydrated, marcarFavoritosVistos])

  const mostrarArtistas = (tab === 'todos' || tab === 'artistas') && favoritos.artistas.length > 0
  const mostrarEstudios = (tab === 'todos' || tab === 'estudios') && favoritos.estudios.length > 0
  const mostrarDisenos = (tab === 'todos' || tab === 'disenos') && favoritos.disenos.length > 0
  const mostrarStands = (tab === 'todos' || tab === 'stands') && favoritos.stands.length > 0
  const hayVisible = mostrarArtistas || mostrarEstudios || mostrarDisenos || mostrarStands

  const countFor = (key) => {
    if (key === 'todos') return totalCount
    return favoritos[key]?.length || 0
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavbarArtistas titulo="Mis Favoritos" />

      <main className="flex-1 pt-20 md:pt-24 pb-10 px-4 md:px-6 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tu colección guardada</p>
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-gray-900 flex items-center gap-2 mt-0.5">
              <Heart size={18} fill={ACCENT} className="text-[#B3202F]" />
              Mis Favoritos
            </h1>
          </div>
          {hydrated && totalCount > 0 && (
            <span className="text-xs font-bold text-gray-500 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">
              {totalCount} guardado{totalCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Pestañas de filtro */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map(({ key, label }) => {
            const count = countFor(key)
            const activo = tab === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wide border transition-colors cursor-pointer ${
                  activo
                    ? 'bg-stone-800 text-white border-stone-800'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                <span>{label}</span>
                {hydrated && count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full leading-none ${
                    activo ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {!hydrated ? (
          <div className="py-12 text-center text-xs text-gray-400">Cargando tus favoritos...</div>
        ) : !hayVisible ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto mb-3">
              <Heart size={20} className="text-gray-400" />
            </div>
            <p className="font-black uppercase text-sm text-gray-900">
              {totalCount === 0 ? 'Todavía no tienes favoritos guardados' : 'No tienes guardados en esta categoría'}
            </p>
            <p className="text-xs text-gray-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
              Toca el corazón en cualquier artista, estudio, diseño o lámina que te guste para tenerlo siempre a mano.
            </p>
            <Link
              to="/tattoo-artist-colombia"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
              style={{ backgroundColor: ACCENT }}
            >
              Explorar directorio
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-7">
            {/* ARTISTAS */}
            {mostrarArtistas && (
              <section>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2.5 flex items-center gap-1.5">
                  <Palette size={12} /> Artistas ({favoritos.artistas.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {favoritos.artistas.map((a) => (
                    <div key={`fav-art-${a.id}`} className="relative rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-gray-300 transition-colors">
                      <Link to={a.url || `/artista/${a.id}`} className="block">
                        <div className="aspect-square bg-gray-100">
                          {a.foto_url ? (
                            <img src={cloudinaryFill(a.foto_url, 320, 320)} alt={a.nombre} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl font-black">
                              {a.nombre?.[0]?.toUpperCase() || '?'}
                            </div>
                          )}
                        </div>
                        <div className="p-2.5">
                          <p className="font-black uppercase text-xs text-gray-900 truncate">{a.nombre}</p>
                          {a.municipio && (
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide truncate mt-0.5 flex items-center gap-1">
                              <MapPin size={10} className="flex-shrink-0" />
                              <span className="truncate">{a.municipio}</span>
                            </p>
                          )}
                          {a.estilo && <p className="text-[10px] text-gray-400 truncate mt-0.5">{a.estilo}</p>}
                        </div>
                      </Link>
                      <button
                        type="button"
                        onClick={() => quitarFavorito('artistas', a.id)}
                        aria-label="Quitar de favoritos"
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 text-[#B3202F] shadow-sm flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                      >
                        <Heart size={13} fill={ACCENT} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ESTUDIOS */}
            {mostrarEstudios && (
              <section>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2.5 flex items-center gap-1.5">
                  <Building2 size={12} /> Estudios ({favoritos.estudios.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {favoritos.estudios.map((e) => (
                    <div key={`fav-est-${e.id}`} className="relative rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-gray-300 transition-colors">
                      <Link to={e.url || `/tattoo-artist-colombia/estudio/${e.id}`} className="block">
                        <div className="aspect-[4/3] bg-gray-100">
                          {e.foto_portada || e.logo_url ? (
                            <img src={cloudinaryFill(e.foto_portada || e.logo_url, 360, 270)} alt={e.nombre} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl font-black">
                              {e.nombre?.[0]?.toUpperCase() || '?'}
                            </div>
                          )}
                        </div>
                        <div className="p-2.5">
                          <p className="font-black uppercase text-xs text-gray-900 truncate">{e.nombre}</p>
                          {e.municipio && (
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide truncate mt-0.5 flex items-center gap-1">
                              <MapPin size={10} className="flex-shrink-0" />
                              <span className="truncate">{e.municipio}</span>
                            </p>
                          )}
                        </div>
                      </Link>
                      <button
                        type="button"
                        onClick={() => quitarFavorito('estudios', e.id)}
                        aria-label="Quitar de favoritos"
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 text-[#B3202F] shadow-sm flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                      >
                        <Heart size={13} fill={ACCENT} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* DISEÑOS Y LÁMINAS */}
            {mostrarDisenos && (
              <section>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2.5 flex items-center gap-1.5">
                  <ImageIcon size={12} /> Diseños y láminas ({favoritos.disenos.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favoritos.disenos.map((d) => (
                    <div key={`fav-dis-${d.id}`} className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 bg-white">
                      <Link to={d.artistaUrl || '/tattoo-artist-colombia'} className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {d.imagen ? (
                          <img src={cloudinaryFill(d.imagen, 200, 200)} alt={d.titulo} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                          {d.tipo === 'lamina' ? 'Lámina digital' : 'Diseño para tatuar'}
                        </span>
                        <Link to={d.artistaUrl || '/tattoo-artist-colombia'} className="block font-black uppercase text-xs text-gray-900 truncate hover:underline">
                          {d.titulo || 'Diseño'}
                        </Link>
                        {d.artistaNombre && (
                          <p className="text-[11px] text-gray-500 truncate mt-0.5">Por {d.artistaNombre}</p>
                        )}
                        {d.precio != null && (
                          <p className="text-xs font-black text-gray-900 mt-1">
                            ${Number(d.precio).toLocaleString('es-CO')}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => quitarFavorito('disenos', d.id)}
                        aria-label="Quitar de favoritos"
                        className="p-2 text-gray-400 hover:text-[#B3202F] transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* STANDS */}
            {mostrarStands && (
              <section>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2.5 flex items-center gap-1.5">
                  <CalendarRange size={12} /> Stands ({favoritos.stands.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favoritos.stands.map((s) => (
                    <div key={`fav-std-${s.id}`} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white">
                      <div className="flex-1 min-w-0">
                        <p className="font-black uppercase text-xs text-gray-900 truncate">{s.nombre}</p>
                        {s.municipio && <p className="text-[11px] text-gray-500 truncate">{s.municipio}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => quitarFavorito('stands', s.id)}
                        aria-label="Quitar de favoritos"
                        className="p-2 text-gray-400 hover:text-[#B3202F] transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 pt-6 pb-20 md:pb-6 px-4 mt-8">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-400 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} Tattoo Artist Colombia — Todos los derechos reservados.</p>
          <span className="text-gray-300">Desarrollado por INKognito</span>
        </div>
      </footer>
    </div>
  )
}
