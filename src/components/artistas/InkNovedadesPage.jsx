import { useEffect, useState, useCallback, useRef } from 'react'
import { Link } from 'react-router'
import {
  Flame, Calendar, Award, MessageCircle, Heart, ShieldCheck, Megaphone,
  UserCircle, Building2, Send, ImagePlus, Trash2, MapPin, ExternalLink,
  LoaderCircle, X, BadgeCheck,
} from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'
import { cloudinaryFill, cloudinaryLimit } from '../../lib/cloudinary'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#B3202F'
const WHATSAPP_ALIANZAS = 'https://wa.me/573104839481?text=' + encodeURIComponent('Hola INKognito, quiero promocionar una convención o seminario de tatuaje en Novedades de INK.')

export function meta() {
  return [
    { title: 'Novedades y Eventos de Tatuaje | Tattoo Artist Colombia — INK' },
    { name: 'description', content: 'Convenciones, seminarios y novedades publicadas por artistas y estudios verificados de tatuaje en Colombia.' },
  ]
}

const FILTROS = [
  { key: 'todo', label: 'Todo' },
  { key: 'comunidad', label: 'Comunidad' },
  { key: 'convencion', label: 'Convenciones' },
  { key: 'seminario', label: 'Seminarios' },
]

function tiempoRelativo(iso) {
  if (!iso) return ''
  const diff = Math.max(0, Date.now() - new Date(iso).getTime())
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'Ahora'
  if (min < 60) return `Hace ${min} min`
  const hrs = Math.floor(min / 60)
  if (hrs < 24) return `Hace ${hrs} h`
  const dias = Math.floor(hrs / 24)
  if (dias < 30) return `Hace ${dias} d`
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
}

function etiquetaCategoria(cat) {
  if (cat === 'convencion') return 'Convención'
  if (cat === 'seminario') return 'Seminario'
  if (cat === 'evento') return 'Evento oficial'
  return 'Comunidad'
}

export default function InkNovedadesPage() {
  const [filtro, setFiltro] = useState('todo')
  const [tokenActivo, setTokenActivo] = useState(null)
  const [identidad, setIdentidad] = useState(null) // { tipo, id, nombre, foto, municipio, url }

  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState(null)
  const [cargandoMas, setCargandoMas] = useState(false)

  // Composer (solo artistas/estudios verificados)
  const [tituloPost, setTituloPost] = useState('')
  const [contenidoPost, setContenidoPost] = useState('')
  const [ciudadPost, setCiudadPost] = useState('')
  const [imagenPost, setImagenPost] = useState(null)
  const [subiendoImg, setSubiendoImg] = useState(false)
  const [publicando, setPublicando] = useState(false)
  const [errorPost, setErrorPost] = useState(null)
  const fileInputRef = useRef(null)

  // Comentarios desplegados por publicación
  const [comentariosAbiertos, setComentariosAbiertos] = useState({})
  const [comentariosData, setComentariosData] = useState({})
  const [cargandoCom, setCargandoCom] = useState({})
  const [textoCom, setTextoCom] = useState({})
  const [enviandoCom, setEnviandoCom] = useState({})

  // Aviso cuando un visitante anónimo intenta dar like o comentar
  const [avisoSoloVerificados, setAvisoSoloVerificados] = useState(false)

  // 1. Detectar token de artista o estudio en localStorage y validar identidad
  useEffect(() => {
    let cancelado = false
    let token = null
    try {
      token = localStorage.getItem('artista_edit_token') || localStorage.getItem('estudio_edit_token') || null
    } catch {}
    if (!token) return
    setTokenActivo(token)
    fetch(`${PANEL_URL}/api/novedades-identidad?token=${encodeURIComponent(token)}`)
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (cancelado || !data?.autenticado) return
        setIdentidad(data)
        if (data.municipio) setCiudadPost(prev => prev || data.municipio)
      })
      .catch(() => {})
    return () => { cancelado = true }
  }, [])

  // 2. Cargar feed de novedades
  const cargarFeed = useCallback(async ({ cursor = null, append = false } = {}) => {
    if (append) setCargandoMas(true)
    else setCargando(true)
    try {
      const qs = new URLSearchParams({ categoria: filtro, limit: '20' })
      if (cursor) qs.set('cursor', String(cursor))
      if (tokenActivo) qs.set('token', tokenActivo)
      const res = await fetch(`${PANEL_URL}/api/novedades?${qs.toString()}`)
      if (!res.ok) {
        if (!append) setItems([])
        setHasMore(false)
        setNextCursor(null)
        return
      }
      const data = await res.json()
      const nuevos = Array.isArray(data.items) ? data.items : []
      setItems(prev => (append ? [...prev, ...nuevos] : nuevos))
      setHasMore(!!data.hasMore)
      setNextCursor(data.nextCursor || null)
    } catch {
      if (!append) setItems([])
      setHasMore(false)
    } finally {
      setCargando(false)
      setCargandoMas(false)
    }
  }, [filtro, tokenActivo])

  useEffect(() => {
    cargarFeed({ append: false })
  }, [cargarFeed])

  // 3. Subir foto opcional a Cloudinary
  const subirImagen = async (file) => {
    if (!file) return
    setSubiendoImg(true)
    setErrorPost(null)
    try {
      const cfgRes = await fetch(`${PANEL_URL}/api/upload-config`)
      if (!cfgRes.ok) throw new Error('No se pudo preparar la subida de imagen.')
      const { cloud_name, upload_preset } = await cfgRes.json()
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', upload_preset)
      const upRes = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
        method: 'POST',
        body: fd,
      })
      const upData = await upRes.json()
      if (!upRes.ok || !upData.secure_url) throw new Error('No pudimos subir la imagen.')
      setImagenPost(upData.secure_url)
    } catch (err) {
      setErrorPost(err.message || 'Error subiendo la imagen.')
    } finally {
      setSubiendoImg(false)
    }
  }

  // 4. Publicar en Comunidad
  const publicarNovedad = async (e) => {
    e.preventDefault()
    if (!identidad || !tokenActivo) {
      setAvisoSoloVerificados(true)
      return
    }
    const texto = contenidoPost.trim()
    if (texto.length < 5) {
      setErrorPost('Escribe al menos 5 caracteres para publicar.')
      return
    }
    setPublicando(true)
    setErrorPost(null)
    try {
      const res = await fetch(`${PANEL_URL}/api/novedades-por-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tokenActivo,
          titulo: tituloPost.trim() || null,
          contenido: texto,
          imagen_url: imagenPost,
          ciudad: ciudadPost.trim() || identidad.municipio || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No pudimos publicar en este momento.')
      setItems(prev => [data, ...prev])
      setTituloPost('')
      setContenidoPost('')
      setImagenPost(null)
    } catch (err) {
      setErrorPost(err.message || 'No pudimos publicar en este momento.')
    } finally {
      setPublicando(false)
    }
  }

  // 5. Eliminar publicación propia
  const eliminarPublicacion = async (id) => {
    if (!tokenActivo) return
    try {
      const res = await fetch(`${PANEL_URL}/api/novedades-por-token/${id}?token=${encodeURIComponent(tokenActivo)}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setItems(prev => prev.filter(it => it.id !== id))
      }
    } catch {}
  }

  // 6. Toggle Like (exclusivo artistas y estudios verificados)
  const toggleLike = async (novedadId) => {
    if (!identidad || !tokenActivo) {
      setAvisoSoloVerificados(true)
      return
    }
    // Optimista
    setItems(prev => prev.map(it => {
      if (it.id !== novedadId) return it
      const liked = !it.liked_by_me
      return {
        ...it,
        liked_by_me: liked,
        likes_count: Math.max(0, (it.likes_count || 0) + (liked ? 1 : -1)),
      }
    }))
    try {
      const res = await fetch(`${PANEL_URL}/api/novedades/${novedadId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenActivo }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setItems(prev => prev.map(it => (it.id === novedadId ? { ...it, liked_by_me: data.liked, likes_count: data.likes_count } : it)))
    } catch {
      cargarFeed({ append: false })
    }
  }

  // 7. Abrir y cargar comentarios
  const toggleComentarios = async (novedadId) => {
    const abrir = !comentariosAbiertos[novedadId]
    setComentariosAbiertos(prev => ({ ...prev, [novedadId]: abrir }))
    if (abrir && !comentariosData[novedadId]) {
      setCargandoCom(prev => ({ ...prev, [novedadId]: true }))
      try {
        const res = await fetch(`${PANEL_URL}/api/novedades/${novedadId}/comentarios`)
        const data = res.ok ? await res.json() : { items: [] }
        setComentariosData(prev => ({ ...prev, [novedadId]: data.items || [] }))
      } catch {
        setComentariosData(prev => ({ ...prev, [novedadId]: [] }))
      } finally {
        setCargandoCom(prev => ({ ...prev, [novedadId]: false }))
      }
    }
  }

  // 8. Enviar comentario (exclusivo artistas y estudios verificados)
  const enviarComentario = async (e, novedadId) => {
    e.preventDefault()
    if (!identidad || !tokenActivo) {
      setAvisoSoloVerificados(true)
      return
    }
    const contenido = (textoCom[novedadId] || '').trim()
    if (contenido.length < 2) return
    setEnviandoCom(prev => ({ ...prev, [novedadId]: true }))
    try {
      const res = await fetch(`${PANEL_URL}/api/novedades/${novedadId}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenActivo, contenido }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '')
      setComentariosData(prev => ({
        ...prev,
        [novedadId]: [...(prev[novedadId] || []), data.comentario],
      }))
      setItems(prev => prev.map(it => (it.id === novedadId ? { ...it, comments_count: data.comments_count } : it)))
      setTextoCom(prev => ({ ...prev, [novedadId]: '' }))
    } catch {}
    finally {
      setEnviandoCom(prev => ({ ...prev, [novedadId]: false }))
    }
  }

  const eventosOficiales = items.filter(it => it.categoria !== 'comunidad')
  const postsComunidad = items.filter(it => it.categoria === 'comunidad')

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavbarArtistas titulo="Novedades" />

      <main className="flex-1 pt-20 md:pt-24 pb-10 px-4 md:px-6 max-w-3xl mx-auto w-full">
        {/* Cabecera */}
        <div className="mb-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Escena del tatuaje en Colombia</p>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-gray-900 flex items-center gap-2 mt-0.5">
            <Flame size={18} className="text-[#B3202F]" />
            Novedades y Eventos
          </h1>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Convenciones, seminarios oficiales y avisos en tiempo real de artistas y estudios verificados.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTROS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFiltro(key)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wide border transition-colors cursor-pointer ${
                filtro === key
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Aviso modal/banner si un visitante intenta interactuar sin ser artista/estudio */}
        {avisoSoloVerificados && (
          <div className="mb-5 rounded-xl border border-stone-300 bg-stone-50 p-4 flex items-start gap-3">
            <ShieldCheck size={18} className="text-stone-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black uppercase text-gray-900">Exclusivo para perfiles verificados</p>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                Solo artistas y estudios registrados en INK pueden publicar, dar like o comentar. Si ya tienes perfil, ábrelo una vez en este dispositivo para activarte automáticamente.
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <Link to="/tattoo-artist-colombia/mi-perfil" className="text-[11px] font-bold uppercase tracking-wide text-stone-900 underline underline-offset-2">
                  Soy artista
                </Link>
                <span className="text-gray-300">·</span>
                <Link to="/tattoo-artist-colombia/estudio/mi-perfil" className="text-[11px] font-bold uppercase tracking-wide text-stone-900 underline underline-offset-2">
                  Soy estudio
                </Link>
                <span className="text-gray-300">·</span>
                <Link to="/tattoo-artist-colombia/unete" className="text-[11px] font-bold uppercase tracking-wide text-[#B3202F] underline underline-offset-2">
                  Unirme gratis
                </Link>
              </div>
            </div>
            <button type="button" onClick={() => setAvisoSoloVerificados(false)} aria-label="Cerrar" className="text-gray-400 hover:text-gray-700 cursor-pointer">
              <X size={16} />
            </button>
          </div>
        )}

        {/* BLOQUE 1: Comunidad (Artistas y Estudios verificados) — primero
            para que el feed vivo del gremio sea lo primero que se vea. */}
        {(filtro === 'todo' || filtro === 'comunidad') && (
          <section className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <MessageCircle size={12} /> Comunidad INK
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500">
                <ShieldCheck size={12} /> Solo perfiles verificados interactúan
              </span>
            </div>

            {/* Composer en vivo si el navegador tiene token de artista o estudio */}
            {identidad && (
              <form onSubmit={publicarNovedad} className="mb-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
                    {identidad.foto ? (
                      <img src={cloudinaryFill(identidad.foto, 80, 80)} alt={identidad.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-black text-gray-500">{identidad.nombre?.[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase text-gray-900 truncate flex items-center gap-1">
                      {identidad.nombre}
                      <BadgeCheck size={13} className="text-stone-700 flex-shrink-0" />
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                      Publicando como {identidad.tipo === 'estudio' ? 'Estudio verificado' : 'Artista verificado'}
                    </p>
                  </div>
                </div>

                <input
                  type="text"
                  value={tituloPost}
                  onChange={(e) => setTituloPost(e.target.value)}
                  maxLength={120}
                  placeholder="Título breve (opcional — ej. Guest Spot en Medellín, Flash Day...)"
                  className="w-full mb-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-stone-500"
                />
                <textarea
                  value={contenidoPost}
                  onChange={(e) => setContenidoPost(e.target.value)}
                  rows={3}
                  maxLength={1500}
                  placeholder="Comparte una novedad con la comunidad de tatuadores y clientes..."
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-stone-500 resize-none"
                />

                {imagenPost && (
                  <div className="relative mt-2 w-32 h-32 rounded-xl overflow-hidden border border-gray-200">
                    <img src={cloudinaryFill(imagenPost, 260, 260)} alt="Vista previa" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImagenPost(null)}
                      aria-label="Quitar imagen"
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                {errorPost && <p className="text-xs text-[#B3202F] font-semibold mt-2">{errorPost}</p>}

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => subirImagen(e.target.files?.[0])}
                    />
                    <button
                      type="button"
                      disabled={subiendoImg}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 bg-white text-gray-700 text-[11px] font-bold hover:border-gray-500 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {subiendoImg ? <LoaderCircle size={13} className="animate-spin" /> : <ImagePlus size={13} />}
                      {subiendoImg ? 'Subiendo...' : 'Agregar foto'}
                    </button>
                    <input
                      type="text"
                      value={ciudadPost}
                      onChange={(e) => setCiudadPost(e.target.value)}
                      maxLength={80}
                      placeholder="Ciudad"
                      className="w-28 sm:w-36 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-stone-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={publicando || subiendoImg}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                    style={{ backgroundColor: ACCENT }}
                  >
                    {publicando ? <LoaderCircle size={13} className="animate-spin" /> : <Send size={13} />}
                    Publicar
                  </button>
                </div>
              </form>
            )}

            {/* Listado de publicaciones */}
            {cargando ? (
              <div className="py-10 flex items-center justify-center gap-2 text-xs text-gray-400">
                <LoaderCircle size={15} className="animate-spin" /> Cargando novedades...
              </div>
            ) : postsComunidad.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
                <p className="font-black uppercase text-sm text-gray-900">
                  Aún no hay publicaciones recientes en Comunidad
                </p>
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                  Espacio activo para que los artistas y estudios registrados en INK compartan guest spots, flash days, apertura de agenda y novedades del gremio.
                </p>

                <div className="mt-4 grid sm:grid-cols-2 gap-2.5 text-xs text-gray-600">
                  <div className="flex items-start gap-2 rounded-xl bg-white border border-gray-200 p-3">
                    <Heart size={14} className="text-[#B3202F] flex-shrink-0 mt-0.5" />
                    <span><strong>Likes y comentarios verificados:</strong> solo perfiles registrados de artistas y estudios pueden dar like o comentar, manteniendo el espacio profesional y libre de spam.</span>
                  </div>
                  <div className="flex items-start gap-2 rounded-xl bg-white border border-gray-200 p-3">
                    <ShieldCheck size={14} className="text-stone-700 flex-shrink-0 mt-0.5" />
                    <span><strong>Lectura abierta:</strong> cualquier visitante puede leer las novedades, descubrir eventos y entrar directo al perfil de cada artista o estudio.</span>
                  </div>
                </div>

                {!identidad && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      to="/tattoo-artist-colombia/mi-perfil"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-800 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-stone-900 transition-colors"
                    >
                      <UserCircle size={14} /> Soy artista
                    </Link>
                    <Link
                      to="/tattoo-artist-colombia/estudio/mi-perfil"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 text-[11px] font-bold uppercase tracking-widest hover:border-gray-500 transition-colors"
                    >
                      <Building2 size={14} /> Soy estudio
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {postsComunidad.map((post) => {
                  const esMio = identidad && identidad.tipo === post.autor_tipo && Number(identidad.id) === Number(post.autor_id)
                  const abierto = !!comentariosAbiertos[post.id]
                  const listaCom = comentariosData[post.id] || []
                  return (
                    <article key={post.id} className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                      <div className="p-4">
                        {/* Autor */}
                        <div className="flex items-center justify-between gap-2">
                          <Link to={post.autor_url || '/tattoo-artist-colombia'} className="flex items-center gap-2.5 min-w-0 group">
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                              {post.autor_foto ? (
                                <img src={cloudinaryFill(post.autor_foto, 90, 90)} alt={post.autor_nombre} className="w-full h-full object-cover" loading="lazy" />
                              ) : (
                                <span className="text-xs font-black text-gray-400">{post.autor_nombre?.[0]?.toUpperCase() || '?'}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-black uppercase text-gray-900 truncate flex items-center gap-1 group-hover:underline">
                                {post.autor_nombre}
                                <BadgeCheck size={13} className="text-stone-700 flex-shrink-0" />
                              </p>
                              <p className="text-[10px] text-gray-400 flex items-center gap-1.5">
                                <span className="uppercase font-bold">{post.autor_tipo === 'estudio' ? 'Estudio' : 'Artista'}</span>
                                {post.ciudad && <><span>·</span><span>{post.ciudad}</span></>}
                                <span>·</span>
                                <span>{tiempoRelativo(post.created_at)}</span>
                              </p>
                            </div>
                          </Link>

                          {esMio && (
                            <button
                              type="button"
                              onClick={() => eliminarPublicacion(post.id)}
                              aria-label="Eliminar publicación"
                              className="p-1.5 text-gray-400 hover:text-[#B3202F] transition-colors cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        {/* Contenido */}
                        {post.titulo && (
                          <h3 className="font-black uppercase text-sm text-gray-900 mt-3 leading-snug">{post.titulo}</h3>
                        )}
                        <p className="text-xs sm:text-sm text-gray-700 mt-1.5 leading-relaxed whitespace-pre-line">{post.contenido}</p>
                      </div>

                      {post.imagen_url && (
                        <div className="bg-gray-100 max-h-96 overflow-hidden">
                          <img src={cloudinaryLimit(post.imagen_url, 900)} alt={post.titulo || 'Novedad'} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      )}

                      {/* Acciones: Like y Comentarios */}
                      <div className="px-4 py-2.5 border-t border-gray-100 flex items-center gap-5">
                        <button
                          type="button"
                          onClick={() => toggleLike(post.id)}
                          className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                            post.liked_by_me ? 'text-[#B3202F]' : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <Heart size={15} fill={post.liked_by_me ? ACCENT : 'none'} />
                          <span>{post.likes_count || 0}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleComentarios(post.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                        >
                          <MessageCircle size={15} />
                          <span>{post.comments_count || 0}</span>
                        </button>
                      </div>

                      {/* Sección desplegable de comentarios */}
                      {abierto && (
                        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50/70">
                          {cargandoCom[post.id] ? (
                            <p className="text-[11px] text-gray-400 py-2">Cargando comentarios...</p>
                          ) : listaCom.length === 0 ? (
                            <p className="text-[11px] text-gray-400 py-1.5">Aún no hay comentarios. Sé el primer perfil verificado en comentar.</p>
                          ) : (
                            <div className="space-y-2.5 mb-3">
                              {listaCom.map((c) => (
                                <div key={c.id} className="flex items-start gap-2">
                                  <Link to={c.autor_url || '/tattoo-artist-colombia'} className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center mt-0.5">
                                    {c.autor_foto ? (
                                      <img src={cloudinaryFill(c.autor_foto, 60, 60)} alt={c.autor_nombre} className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-[9px] font-black text-gray-500">{c.autor_nombre?.[0]?.toUpperCase()}</span>
                                    )}
                                  </Link>
                                  <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xl px-3 py-2">
                                    <div className="flex items-center gap-1.5">
                                      <Link to={c.autor_url || '/tattoo-artist-colombia'} className="text-[11px] font-black uppercase text-gray-900 hover:underline truncate">
                                        {c.autor_nombre}
                                      </Link>
                                      <BadgeCheck size={11} className="text-stone-600 flex-shrink-0" />
                                      <span className="text-[9px] text-gray-400 ml-auto">{tiempoRelativo(c.created_at)}</span>
                                    </div>
                                    <p className="text-xs text-gray-700 mt-0.5 leading-snug whitespace-pre-line">{c.contenido}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {identidad ? (
                            <form onSubmit={(e) => enviarComentario(e, post.id)} className="flex items-center gap-2 mt-2">
                              <input
                                type="text"
                                value={textoCom[post.id] || ''}
                                onChange={(e) => setTextoCom(prev => ({ ...prev, [post.id]: e.target.value }))}
                                maxLength={600}
                                placeholder={`Comentar como ${identidad.nombre}...`}
                                className="flex-1 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-stone-500"
                              />
                              <button
                                type="submit"
                                disabled={enviandoCom[post.id] || !(textoCom[post.id] || '').trim()}
                                className="w-8 h-8 rounded-full text-white flex items-center justify-center flex-shrink-0 hover:opacity-90 disabled:opacity-40 cursor-pointer"
                                style={{ backgroundColor: ACCENT }}
                                aria-label="Enviar comentario"
                              >
                                {enviandoCom[post.id] ? <LoaderCircle size={13} className="animate-spin" /> : <Send size={13} />}
                              </button>
                            </form>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setAvisoSoloVerificados(true)}
                              className="mt-1 text-[11px] font-bold text-gray-500 hover:text-gray-900 underline underline-offset-2 cursor-pointer"
                            >
                              Inicia en tu perfil de artista o estudio para comentar
                            </button>
                          )}
                        </div>
                      )}
                    </article>
                  )
                })}

                {hasMore && (
                  <div className="flex justify-center pt-2">
                    <button
                      type="button"
                      disabled={cargandoMas}
                      onClick={() => cargarFeed({ cursor: nextCursor, append: true })}
                      className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 text-xs font-bold uppercase tracking-widest hover:border-gray-500 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {cargandoMas ? 'Cargando...' : 'Cargar más'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* BLOQUE 2: Eventos Oficiales / Patrocinados */}
        {(filtro === 'todo' || filtro === 'convencion' || filtro === 'seminario') && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <Award size={12} /> Eventos oficiales y aliados
              </p>
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Convenciones · Seminarios</span>
            </div>

            {eventosOficiales.length > 0 && (
              <div className="space-y-4 mb-4">
                {eventosOficiales.map((ev) => (
                  <article key={ev.id} className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                    {ev.imagen_url && (
                      <div className="h-44 sm:h-56 bg-gray-100 overflow-hidden">
                        <img src={cloudinaryLimit(ev.imagen_url, 900)} alt={ev.titulo || 'Evento'} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <div className="p-4 sm:p-5">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full text-white bg-stone-800">
                          {etiquetaCategoria(ev.categoria)}
                        </span>
                        {ev.patrocinado && (
                          <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: ACCENT }}>
                            Evento aliado
                          </span>
                        )}
                        {ev.fecha_evento && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500">
                            <Calendar size={12} />
                            {new Date(ev.fecha_evento).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        )}
                        {ev.ciudad && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                            <MapPin size={12} /> {ev.ciudad}
                          </span>
                        )}
                      </div>
                      {ev.titulo && <h2 className="font-black uppercase text-base text-gray-900 leading-snug">{ev.titulo}</h2>}
                      <p className="text-xs sm:text-sm text-gray-600 mt-1.5 leading-relaxed whitespace-pre-line">{ev.contenido}</p>
                      {ev.url_externa && (
                        <a
                          href={ev.url_externa}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: ACCENT }}
                        >
                          Más información / Boletas <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Banner comercial para organizadores */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-stone-900 via-gray-900 to-black text-white p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                  <Megaphone size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/15 text-gray-200 mb-1.5">
                    Alianzas y patrocinio
                  </span>
                  <h2 className="font-black uppercase text-sm sm:text-base leading-tight">
                    ¿Organizas una convención, expo o seminario de tatuaje?
                  </h2>
                  <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                    Llega directo a tatuadores, estudios y clientes activos en toda Colombia. Ofrecemos difusión destacada, patrocinio oficial y alianzas de boletería.
                  </p>
                  <div className="mt-4">
                    <a
                      href={WHATSAPP_ALIANZAS}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: ACCENT }}
                    >
                      <Calendar size={13} />
                      Promocionar mi evento
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
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
