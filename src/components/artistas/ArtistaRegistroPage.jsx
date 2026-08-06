import { useRef, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { CheckCircle2, Camera, MapPin, Palette, LoaderCircle, Navigation, Check } from 'lucide-react'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import NavbarArtistas from './NavbarArtistas'
import ComboboxBuscable from './ComboboxBuscable'
import { DEPARTAMENTOS, MUNICIPIOS_POR_DEPARTAMENTO, municipioDesdeNombreIP } from '../../data/colombiaGeo'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#B3202F'

// Los mismos 5 slots que ya maneja el admin en el panel (perfil, portada,
// 3 trabajos) — acá el artista los sube él mismo, directo a Cloudinary
// desde el navegador (unsigned upload, mismo patrón que ya usa el panel).
const SLOTS = [
  { key: 'foto_url', label: 'Perfil' },
  { key: 'foto_url_2', label: 'Portada' },
  { key: 'foto_trabajo_1', label: 'Trabajo 1' },
  { key: 'foto_trabajo_2', label: 'Trabajo 2' },
  { key: 'foto_trabajo_3', label: 'Trabajo 3' },
]

export async function loader({ request }) {
  let ciudadDetectada = null
  try {
    const ipCity = request.headers.get('x-vercel-ip-city')
    if (ipCity) ciudadDetectada = municipioDesdeNombreIP(decodeURIComponent(ipCity))
  } catch {
    ciudadDetectada = null
  }
  try {
    const res = await fetch(`${PANEL_URL}/api/upload-config`)
    if (res.ok) return { ...(await res.json()), ciudadDetectada }
  } catch {
    // sigue abajo con el fallback
  }
  return { cloud_name: null, upload_preset: null, ciudadDetectada }
}

export function meta() {
  const title = 'Únete como artista | Tattoo Artist Colombia'
  const description = 'Registra tu perfil en el buscador que conecta clientes con tatuadores de toda Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/tattoo-artist-colombia/unete` },
  ]
}

const inputClass = 'w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors'
const labelClass = 'text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block'

// Autoregistro público — v2 (2026-08-05, decisión de Jose: registro
// gratis y automático, sin revisión manual — el correo verificado es el
// filtro anti-spam en vez de la aprobación de Jose). El artista carga sus
// propios datos Y sus propias fotos, viendo su landing transformarse en
// vivo mientras llena el formulario (pedido explícito de Jose: "que
// ellos esos datos los llenen viendo como se ira transformando su
// landing, como en facebook"). El perfil nace oculto SOLO hasta que
// confirma el link que le llega al correo (ver ArtistaVerificarPage.jsx)
// — ahí se activa solo, nadie del equipo tiene que revisarlo.
export default function ArtistaRegistroPage() {
  const { cloud_name, upload_preset, ciudadDetectada } = useLoaderData()
  const [form, setForm] = useState({
    nombre: '', departamento: '', municipio: '', lat: null, lng: null, estilo: '', bio: '', instagram: '', facebook: '', whatsapp: '', email: '', no_tatua: '',
    foto_url: '', foto_url_2: '', foto_trabajo_1: '', foto_trabajo_2: '', foto_trabajo_3: '',
  })
  const [subiendo, setSubiendo] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState(null)
  const [ubicando, setUbicando] = useState(false)
  const [ubicacionError, setUbicacionError] = useState(null)
  const fileInputs = useRef({})

  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))

  // Cambiar de departamento invalida el municipio ya elegido (son ~1120
  // municipios en total, agrupados por departamento — un municipio de
  // Antioquia no tiene sentido si se cambia a Valle del Cauca).
  const setDepartamento = (nuevoDepartamento) => setForm((f) => ({ ...f, departamento: nuevoDepartamento, municipio: '' }))
  const setMunicipio = (nuevoMunicipio) => setForm((f) => ({ ...f, municipio: nuevoMunicipio }))

  // Ubicación EXACTA y opcional (2026-08-05, respuesta directa a "como se
  // supone que se va a detectar quien esta mas cerca? no sera necesario
  // poner barrio?"): en vez de pedir barrio (no hay dataset de barrios con
  // coordenadas), se pide el GPS real del navegador — mismo patrón/botón
  // "Cerca de ti" que ya existe en el buscador. Si el artista no da
  // permiso, el registro sigue funcionando igual, solo que el buscador usa
  // el centroide de su municipio en vez de su punto exacto.
  const usarMiUbicacion = () => {
    setUbicacionError(null)
    if (!navigator.geolocation) {
      setUbicacionError('Tu navegador no soporta geolocalización — no pasa nada, tu perfil funciona igual.')
      return
    }
    setUbicando(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude }))
        setUbicando(false)
      },
      () => {
        setUbicacionError('No pudimos acceder a tu ubicación — actívala en el navegador, o simplemente sigue sin ella.')
        setUbicando(false)
      },
      { timeout: 8000 }
    )
  }
  const municipiosDisponibles = MUNICIPIOS_POR_DEPARTAMENTO[form.departamento] || []

  const elegirFoto = (slot) => fileInputs.current[slot]?.click()

  const subirFoto = async (slot, file) => {
    if (!file) return
    if (!cloud_name || !upload_preset) {
      setError('La subida de fotos no está disponible en este momento — puedes registrarte igual y las agregamos después.')
      return
    }
    setError(null)
    setSubiendo(slot)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', upload_preset)
      fd.append('folder', 'inkognito-artistas')
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (!data.secure_url) throw new Error()
      setForm((f) => ({ ...f, [slot]: data.secure_url }))
    } catch {
      setError('No pudimos subir esa foto — intenta de nuevo.')
    } finally {
      setSubiendo(null)
    }
  }

  const enviar = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.departamento || !form.municipio || !form.whatsapp.trim() || !form.email.trim()) {
      setError('Nombre, departamento, municipio, WhatsApp y correo son obligatorios.')
      return
    }
    setError(null)
    setEnviando(true)
    try {
      const res = await fetch(`${PANEL_URL}/api/artistas-solicitud`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setEnviado(true)
    } catch {
      setError('No pudimos enviar tu registro — intenta de nuevo en un momento.')
    } finally {
      setEnviando(false)
    }
  }

  const trabajos = [form.foto_trabajo_1, form.foto_trabajo_2, form.foto_trabajo_3].filter(Boolean)

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavbarArtistas ciudadDetectada={ciudadDetectada} />

      {enviado ? (
        <div className="flex-1 pt-20 md:pt-24 max-w-5xl mx-auto px-4 pb-16 w-full">
          <div className="text-center py-16 max-w-sm mx-auto">
            <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: ACCENT }} />
            <h1 className="text-2xl font-black uppercase mb-3">¡Ya casi!</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Falta un paso para que tu perfil quede activo en el buscador.
            </p>
            {/* Pasos explícitos (2026-08-05, Jose: "deberia orientar los
                siguientes pasos para completar la inscripcion de forma
                correcta" — antes era un solo párrafo, menos claro sobre
                qué hacer si el correo no llega rápido). */}
            <ol className="text-left text-gray-600 text-sm leading-relaxed mt-5 space-y-2.5 list-decimal list-inside">
              <li>Revisa la bandeja de <strong>{form.email}</strong> (y la de spam/promociones, por si acaso).</li>
              <li>Abre el correo de "Tattoo Artist Colombia" y haz clic en el link de confirmación.</li>
              <li>Listo — tu perfil se activa al instante, sin que nadie más lo revise.</li>
            </ol>
            <Link to="/tattoo-artist-colombia" className="inline-block mt-6 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity text-gray-600">
              ← Volver al buscador
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Hero fusionado con el navbar (2026-08-05, mismo tratamiento
              que ArtistasColombiaPage.jsx: "transforma tambien el hero de
              unete al buscador" — antes esta card vivía adentro del
              contenedor max-w-5xl con pt-20/24, dejando un hueco blanco
              entre el navbar y una card chica flotante. Ahora es su
              propia sección a todo el ancho, pegada al navbar, sin
              esquinas redondeadas arriba. */}
          <section className="relative pt-16 md:pt-20 pb-6 md:pb-8 px-4 md:px-6 bg-gray-300 border-b border-gray-300 text-center">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black uppercase leading-tight whitespace-nowrap pt-5 md:pt-7">
              Únete al{' '}
              <span className="inline-block px-2 sm:px-3 py-0.5 rounded-lg text-white bg-gray-600">
                buscador
              </span>
            </h1>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed max-w-md mx-auto mt-1.5">
              {/* "INK" en su propia card, igual que en el hero del buscador
                  (Jose, 2026-08-05) — antes era texto plano acá. */}
              <span className="inline-block px-1.5 py-0.5 rounded-md text-white font-black bg-gray-600">INK</span> conecta clientes con tatuadores de todo el país. Llena tus datos y mira tu perfil tomar forma en tiempo real.
            </p>

            {/* "¿Ya tienes perfil?" — Jose (2026-08-05): "no lo dejes por
                haya abajo [footer]... esquina inferior derecha del hero...
                pero por fuera... como un boton, no solo texto cliqueable".
                Se ancla a la esquina del <section> (que ya es `relative`,
                sin overflow-hidden para que SÍ pueda asomarse fuera de la
                card gris) con -bottom para que quede a caballo entre el
                hero y el contenido de abajo, en vez de vivir adentro. */}
            <Link
              to="/tattoo-artist-colombia/mi-perfil"
              className="absolute -bottom-4 right-4 md:right-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-300 shadow-md text-gray-700 text-[11px] font-bold uppercase tracking-wide hover:border-gray-500 transition-colors"
            >
              ¿Ya tienes perfil? Edítalo
            </Link>
          </section>

          <div className="flex-1 max-w-5xl mx-auto px-4 pt-8 pb-16 w-full">
            {/* inputs de archivo ocultos, uno por slot — se disparan desde
                los botones de cámara dentro de la vista previa */}
            {SLOTS.map(({ key }) => (
              <input
                key={key}
                type="file"
                accept="image/*"
                ref={(el) => { fileInputs.current[key] = el }}
                style={{ display: 'none' }}
                onChange={(e) => subirFoto(key, e.target.files?.[0])}
              />
            ))}

            <div className="grid md:grid-cols-2 gap-8 items-start">

              {/* VISTA PREVIA EN VIVO — mismo patrón visual de la landing
                  real (portada + avatar), se actualiza al instante con
                  cada campo y cada foto que se sube. */}
              <div className="order-2 md:order-1 md:sticky md:top-28">
                <p className={labelClass}>Así se verá tu perfil</p>
                <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="relative h-28 bg-gray-100">
                    {form.foto_url_2 && <img src={form.foto_url_2} alt="" className="w-full h-full object-cover" />}
                    <button
                      type="button"
                      onClick={() => elegirFoto('foto_url_2')}
                      className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1.5 rounded-full backdrop-blur-sm hover:bg-black/80 transition-colors"
                    >
                      {subiendo === 'foto_url_2' ? <LoaderCircle size={11} className="animate-spin" /> : <Camera size={11} />}
                      Portada
                    </button>
                  </div>

                  <div className="px-4 pb-4">
                    <div className="relative -mt-8 inline-block">
                      <div className="w-16 h-16 rounded-full border-4 border-white bg-gray-100 shadow-md overflow-hidden">
                        {form.foto_url ? (
                          <img src={form.foto_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl font-black">
                            {form.nombre?.[0]?.toUpperCase() || '?'}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => elegirFoto('foto_url')}
                        aria-label="Subir foto de perfil"
                        className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full text-white shadow-md bg-gray-600"
                      >
                        {subiendo === 'foto_url' ? <LoaderCircle size={11} className="animate-spin" /> : <Camera size={11} />}
                      </button>
                    </div>

                    <p className="font-black uppercase text-sm mt-3 leading-tight">{form.nombre || 'Tu nombre'}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-gray-500 text-[10px] uppercase tracking-wide">
                        <MapPin size={10} />
                        {form.municipio ? `${form.municipio}${form.departamento ? ', ' + form.departamento : ''}` : 'Municipio'}
                      </span>
                      {form.estilo && (
                        <span className="flex items-center gap-1 text-gray-500 text-[10px] uppercase tracking-wide">
                          <Palette size={10} />
                          {form.estilo}
                        </span>
                      )}
                    </div>
                    {form.bio && (
                      <div className="mt-2">
                        <p className="text-gray-400 text-[9px] uppercase tracking-widest mb-0.5">Sobre mí</p>
                        <p className="text-gray-600 text-xs leading-relaxed">{form.bio}</p>
                      </div>
                    )}
                  </div>

                  {/* Redes sociales — mismo componente en miniatura que la
                      landing real: siempre visibles, deshabilitadas si
                      falta el link (2026-08-04, pedido de Jose de que la
                      preview refleje también esto, no solo nombre/
                      municipio/estilo). */}
                  <div className="grid grid-cols-2 border-t border-gray-200">
                    <div className={`flex items-center justify-center gap-1.5 py-2.5 border-r border-gray-200 text-[10px] font-bold uppercase ${form.facebook ? 'text-gray-700' : 'text-gray-300'}`}>
                      <FaFacebook size={12} /> Facebook
                    </div>
                    <div className={`flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-bold uppercase ${form.instagram ? 'text-gray-700' : 'text-gray-300'}`}>
                      <FaInstagram size={12} /> Instagram
                    </div>
                  </div>
                  {form.whatsapp && (
                    <div className="flex items-center justify-center gap-1.5 py-2.5 border-t border-gray-200 bg-green-600 text-white text-[10px] font-bold uppercase">
                      <FaWhatsapp size={12} /> Contactar al artista
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-0.5 border-t border-gray-200">
                    {SLOTS.slice(2).map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => elegirFoto(key)}
                        className="relative aspect-square bg-gray-50 overflow-hidden group"
                      >
                        {form[key] ? (
                          <img src={form[key]} alt={label} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-300 group-hover:text-gray-400 transition-colors">
                            {subiendo === key ? <LoaderCircle size={16} className="animate-spin" /> : <Camera size={16} />}
                            <span className="text-[9px] font-bold uppercase tracking-wide">{label}</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {form.no_tatua && (
                    <div className="px-4 py-3 border-t border-gray-200">
                      <p className="text-gray-400 text-[9px] uppercase tracking-widest mb-0.5">No tatúa</p>
                      <p className="text-gray-600 text-xs leading-relaxed">{form.no_tatua}</p>
                    </div>
                  )}
                </div>
                <p className="text-gray-500 text-[11px] mt-2 text-center font-medium">Sube tus fotos y completa tu información ahora — un perfil completo y presentable capta más clientes.</p>
              </div>

              {/* FORMULARIO */}
              <form id="registro-form" onSubmit={enviar} className="order-1 md:order-2 space-y-4">
                <div>
                  <label className={labelClass}>Nombre *</label>
                  <input required className={inputClass} value={form.nombre} onChange={set('nombre')} placeholder="Tu nombre o el de tu estudio" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Departamento *</label>
                    <ComboboxBuscable
                      value={form.departamento}
                      onChange={setDepartamento}
                      options={DEPARTAMENTOS}
                      placeholder="Escribe para buscar..."
                      inputClassName={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Municipio *</label>
                    <ComboboxBuscable
                      value={form.municipio}
                      onChange={setMunicipio}
                      options={municipiosDisponibles}
                      disabled={!form.departamento}
                      placeholder={form.departamento ? 'Escribe para buscar...' : 'Elige antes el departamento'}
                      inputClassName={inputClass}
                    />
                  </div>
                </div>

                {/* Ubicación exacta opcional (2026-08-05): "municipio" no
                    alcanza para saber quién está más cerca dentro de una
                    ciudad grande — esto le da al buscador tu punto real en
                    vez de solo el centro de tu municipio. No es
                    obligatorio, el registro funciona igual sin esto. */}
                <div>
                  <button
                    type="button"
                    onClick={usarMiUbicacion}
                    disabled={ubicando}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-60"
                    style={form.lat ? { borderColor: '#16a34a', color: '#16a34a' } : { borderColor: '#4B5563', color: '#4B5563' }}
                  >
                    {ubicando
                      ? <LoaderCircle size={14} className="animate-spin" />
                      : form.lat ? <Check size={14} /> : <Navigation size={14} />}
                    {ubicando ? 'Ubicando...' : form.lat ? 'Ubicación exacta agregada' : 'Agregar mi ubicación exacta (opcional)'}
                  </button>
                  <p className="text-gray-400 text-[10px] mt-1.5 text-center leading-relaxed">
                    Ayuda a que clientes cerca de ti te encuentren primero, sobre todo en ciudades grandes. Es opcional — sin esto, igual apareces en tu municipio.
                  </p>
                  {ubicacionError && <p className="text-gray-400 text-[10px] mt-1 text-center">{ubicacionError}</p>}
                </div>

                <div>
                  <label className={labelClass}>Estilo</label>
                  <input className={inputClass} value={form.estilo} onChange={set('estilo')} placeholder="Ej: Realismo, Blackwork, Fine line" />
                </div>

                <div>
                  <label className={labelClass}>Bio</label>
                  <textarea rows={3} className={inputClass} value={form.bio} onChange={set('bio')} placeholder="Cuenta tus técnicas, estilos y materiales — esto ayuda a que te encuentren en la búsqueda" />
                </div>

                <div>
                  <label className={labelClass}>WhatsApp *</label>
                  <input required className={inputClass} value={form.whatsapp} onChange={set('whatsapp')} placeholder="57300..." />
                </div>

                <div>
                  {/* Correo (2026-08-05) — es el filtro anti-spam ahora que
                      el registro ya no pasa por revisión manual: el
                      perfil nace oculto hasta que se confirma este
                      correo, momento en el que se activa solo. */}
                  <label className={labelClass}>Correo *</label>
                  <input required type="email" className={inputClass} value={form.email} onChange={set('email')} placeholder="tucorreo@ejemplo.com" />
                  <p className="text-gray-400 text-[10px] mt-1">Te mandamos un link para confirmar tu perfil — sin esto no queda activo.</p>
                </div>

                <div>
                  <label className={labelClass}>Instagram</label>
                  <input className={inputClass} value={form.instagram} onChange={set('instagram')} placeholder="https://instagram.com/..." />
                </div>

                <div>
                  <label className={labelClass}>Facebook</label>
                  <input className={inputClass} value={form.facebook} onChange={set('facebook')} placeholder="https://facebook.com/..." />
                </div>

                <div>
                  <label className={labelClass}>No tatúas (opcional)</label>
                  <input className={inputClass} value={form.no_tatua} onChange={set('no_tatua')} placeholder="Ej: rostro, manos, zonas genitales" />
                </div>
              </form>
            </div>

            {/* Botón de enviar — de último en toda la página (2026-08-05,
                Jose: debe quedar después de subir las fotos, no antes).
                Vive fuera del <form> (que sigue arriba, en su columna) y
                lo referencia por id para poder ubicarse como el último
                elemento de la sección sin mover la vista previa/columnas. */}
            <div className="mt-6 max-w-md mx-auto md:mx-0 md:ml-auto">
              {error && <p className="text-sm mb-3 text-center md:text-right" style={{ color: ACCENT }}>{error}</p>}
              <button
                type="submit"
                form="registro-form"
                disabled={enviando}
                className="w-full py-3.5 text-white font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 text-sm"
                style={{ backgroundColor: ACCENT }}
              >
                {enviando ? 'Enviando...' : 'Enviar registro'}
              </button>
            </div>
          </div>
        </>
      )}

      <footer className="border-t border-gray-200 py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-400 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} Tattoo Artist Colombia — Todos los derechos reservados.</p>
          <span className="text-gray-300">Desarrollado por INKognito</span>
        </div>
      </footer>
    </div>
  )
}
