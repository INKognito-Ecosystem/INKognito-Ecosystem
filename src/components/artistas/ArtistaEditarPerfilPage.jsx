import { useEffect, useRef, useState } from 'react'
import { Link, useLoaderData, useSearchParams, useNavigate } from 'react-router-dom'
import { Camera, LoaderCircle, Navigation, Check, Mail, Plus, Trash2, Wallet, ExternalLink, Pencil, X, CheckCircle2, MapPin, Palette } from 'lucide-react'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import NavbarArtistas from './NavbarArtistas'
import ComboboxBuscable from './ComboboxBuscable'
import { DEPARTAMENTOS, MUNICIPIOS_POR_DEPARTAMENTO } from '../../data/colombiaGeo'
import { OPCIONES_DISPONIBILIDAD, DISPONIBILIDAD_COLOR, DISPONIBILIDAD_TEXTO } from './disponibilidad'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
// Sesión persistida (2026-08-06, Jose: "no tener que estar generando link")
// — el token en sí ya dura mucho más (ver TOKEN_VIGENCIA_HORAS en el panel),
// esto es el complemento: una vez que el artista entra con un link válido,
// el token queda guardado en este navegador, así que volver a /mi-perfil
// sin el ?token en la URL (bookmark, o el link de "Editar mi perfil" del
// navbar) lo reconecta solo, sin pedirle el correo de nuevo.
const EDIT_TOKEN_KEY = 'artista_edit_token'
const ACCENT = '#B3202F'
// BTN (2026-08-06, Jose: "todo botón que esté en rojo cámbialo a gris")
// — ACCENT se queda para texto de error/estado, y para el borde de la
// miniatura del diseño que se está editando (no son botones).
const BTN = '#374151'
const MP_BLUE = '#3483FA'
const MP_LOGO_URL = 'https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/5.21.0/mercadopago/logo__large@2x.png'

const SLOTS = [
  { key: 'foto_url', label: 'Perfil' },
  { key: 'foto_url_2', label: 'Portada' },
  { key: 'foto_trabajo_1', label: 'Trabajo 1' },
  { key: 'foto_trabajo_2', label: 'Trabajo 2' },
  { key: 'foto_trabajo_3', label: 'Trabajo 3' },
]

// "Mi perfil" (2026-08-05) — sin login/contraseña: el artista pone su
// correo, le llega un link con token por email (mismo mecanismo que la
// confirmación de registro, ver ArtistaVerificarPage.jsx), y ese link es
// lo que autoriza la edición. Sin ?token en la URL se pide el correo;
// con token válido, se precarga el formulario con los datos actuales.
export async function loader({ request }) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token) return { token: null }
  try {
    const [artistaRes, configRes] = await Promise.all([
      fetch(`${PANEL_URL}/api/artistas-por-token?token=${encodeURIComponent(token)}`),
      fetch(`${PANEL_URL}/api/upload-config`),
    ])
    const artista = artistaRes.ok ? await artistaRes.json() : null
    const config = configRes.ok ? await configRes.json() : { cloud_name: null, upload_preset: null }
    if (!artista) return { token, artista: null, error: 'Este link ya no es válido — pídelo de nuevo.' }
    return { token, artista, ...config }
  } catch {
    return { token, artista: null, error: 'No pudimos cargar tu perfil — intenta de nuevo en un momento.' }
  }
}

export function meta() {
  return [{ title: 'Editar mi perfil | Tattoo Artist Colombia' }]
}

const inputClass = 'w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors'
const labelClass = 'text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block'

// Pantalla 1 — sin token: solo pide el correo y dispara el envío del link.
function PedirLinkForm() {
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setEnviando(true)
    try {
      await fetch(`${PANEL_URL}/api/artistas-solicitar-edicion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {
      // Se muestra el mismo mensaje de éxito aunque falle la red — no
      // conviene revelar si un correo existe o no en la base.
    } finally {
      setEnviando(false)
      setEnviado(true)
    }
  }

  if (enviado) {
    return (
      <div className="text-center max-w-sm mx-auto">
        <Mail size={40} className="mx-auto mb-4 text-gray-400" />
        <h1 className="text-xl font-black uppercase mb-3">Revisa tu correo</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Si <strong>{email}</strong> tiene un perfil activo, te mandamos un link para editarlo.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-xl font-black uppercase mb-2 text-center">Editar mi perfil</h1>
      <p className="text-gray-500 text-sm text-center mb-6">
        Escribe el correo con el que te registraste — te mandamos un link para editar tu perfil, sin contraseña.
      </p>
      <form onSubmit={enviar} className="space-y-3">
        <input
          required
          type="email"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
        />
        <button
          type="submit"
          disabled={enviando}
          className="w-full py-3 text-white font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 text-sm"
          style={{ backgroundColor: BTN }}
        >
          {enviando ? 'Enviando...' : 'Mandarme el link'}
        </button>
      </form>
    </div>
  )
}

const TIPOS_DISENO = [
  {
    value: 'tatuaje', label: 'Diseño de tatuaje',
    hint: 'Se tatúa en una sola persona — desaparece de la venta al venderse',
    placeholderDescripcion: 'Cuéntale a quien lo vea por qué vale la pena — qué representa este diseño, qué se siente tatuárselo, para quién es. Esto es lo que van a leer antes de comprar.',
  },
  {
    value: 'lamina', label: 'Lámina / print',
    hint: 'Para enmarcar — se puede vender a varios clientes',
    placeholderDescripcion: 'Cuéntale a quien lo vea por qué vale la pena — qué representa este diseño, dónde se vería bien enmarcado, para quién sería un buen regalo. Esto es lo que van a leer antes de comprar.',
  },
]

// "Mis diseños en venta" (2026-08-05) — primer paso de monetización del
// directorio: el artista sube diseños con precio, un comprador los paga
// por Mercado Pago y el reparto (comisión INKognito + resto al artista)
// es instantáneo. Autocontenido a propósito — cada diseño tiene su propio
// ciclo de vida (subir/editar/borrar) que no encaja en el <form> plano de
// "Guardar cambios" de arriba, así que vive FUERA de ese form con sus
// propios endpoints.
const NUEVO_VACIO = { tipo: 'tatuaje', titulo: '', descripcion: '', precio: '', imagen_url: '', imagen_url_2: '', imagen_url_3: '' }
const SLOTS_DISENO = [
  { key: 'imagen_url', label: 'Foto 1' },
  { key: 'imagen_url_2', label: 'Foto 2' },
  { key: 'imagen_url_3', label: 'Foto 3' },
]

function MisDisenosSection({ token, cloud_name, upload_preset, mpConectado }) {
  const [disenos, setDisenos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [subiendo, setSubiendo] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [nuevo, setNuevo] = useState(NUEVO_VACIO)
  // null = formulario de "agregar nuevo"; con id = editando ese diseño ya
  // existente (2026-08-05, bug real reportado por Jose: antes solo se
  // podía subir uno nuevo, no había forma de editar ni de quitar una
  // foto puntual de un diseño ya creado — "tengo una de un buho que no
  // he podido borrar, solo se oculta").
  const [editando, setEditando] = useState(null)
  const [error, setError] = useState(null)
  const [guardadoOk, setGuardadoOk] = useState(false)
  const fileInputs = useRef({})

  useEffect(() => {
    fetch(`${PANEL_URL}/api/artistas-disenos-por-token?token=${encodeURIComponent(token)}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setDisenos)
      .catch(() => setDisenos([]))
      .finally(() => setCargando(false))
  }, [token])

  const elegirFoto = (slot) => fileInputs.current[slot]?.click()

  const subirImagen = async (slot, file) => {
    if (!file || !cloud_name || !upload_preset) return
    setSubiendo(slot)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', upload_preset)
      fd.append('folder', 'inkognito-disenos')
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) setNuevo((n) => ({ ...n, [slot]: data.secure_url }))
    } catch {
      setError('No pudimos subir esa imagen — intenta de nuevo.')
    } finally {
      setSubiendo(null)
    }
  }

  const quitarFoto = (slot) => setNuevo((n) => ({ ...n, [slot]: '' }))

  const iniciarEdicion = (d) => {
    setError(null)
    setEditando(d.id)
    setNuevo({
      tipo: d.tipo, titulo: d.titulo || '', descripcion: d.descripcion || '', precio: d.precio,
      imagen_url: d.imagen_url || '', imagen_url_2: d.imagen_url_2 || '', imagen_url_3: d.imagen_url_3 || '',
    })
  }

  const cancelarEdicion = () => {
    setEditando(null)
    setNuevo(NUEVO_VACIO)
    setError(null)
  }

  const agregarDiseno = async () => {
    if (!nuevo.imagen_url || !nuevo.precio) {
      setError('Sube al menos la primera foto y ponle un precio antes de agregarlo.')
      return
    }
    setError(null)
    setGuardando(true)
    try {
      const res = await fetch(`${PANEL_URL}/api/artistas-disenos-por-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...nuevo }),
      })
      const data = await res.json()
      // Mensaje real del backend (2026-08-06) — antes se descartaba y
      // siempre mostraba el genérico; hacía falta para el límite de 5
      // diseños por categoría, que sí tiene un mensaje específico.
      if (!res.ok) throw new Error(data.error || '')
      setDisenos((d) => [...(d || []), data])
      setNuevo(NUEVO_VACIO)
      setGuardadoOk(true)
    } catch (err) {
      setError(err.message || 'No pudimos agregar el diseño — intenta de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  const guardarEdicion = async () => {
    if (!nuevo.imagen_url || !nuevo.precio) {
      setError('El diseño necesita al menos la primera foto y un precio.')
      return
    }
    setError(null)
    setGuardando(true)
    try {
      const res = await fetch(`${PANEL_URL}/api/artistas-disenos-por-token/${editando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...nuevo }),
      })
      if (!res.ok) throw new Error()
      const actualizado = await res.json()
      setDisenos((ds) => ds.map((x) => x.id === editando ? actualizado : x))
      cancelarEdicion()
      setGuardadoOk(true)
    } catch {
      setError('No pudimos guardar los cambios — intenta de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  const toggleActivo = async (d) => {
    const res = await fetch(`${PANEL_URL}/api/artistas-disenos-por-token/${d.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, activo: !d.activo }),
    })
    if (res.ok) setDisenos((ds) => ds.map((x) => x.id === d.id ? { ...x, activo: !x.activo } : x))
  }

  const borrarDiseno = async (d) => {
    const res = await fetch(`${PANEL_URL}/api/artistas-disenos-por-token/${d.id}?token=${encodeURIComponent(token)}`, { method: 'DELETE' })
    if (res.ok) {
      setDisenos((ds) => ds.filter((x) => x.id !== d.id))
      if (editando === d.id) cancelarEdicion()
    } else if (res.status === 409) {
      setError('Este diseño ya tiene ventas — desactívalo con el switch en vez de borrarlo.')
    }
  }

  return (
    // Sin card angosta (2026-08-06, Jose: "sácala de allí para que ocupe
    // todo el ancho de la pantalla en móvil, acentúa de alguna manera la
    // división con los otros campos") — -mx-4 cancela el padding lateral
    // del contenedor padre (max-w-lg mx-auto px-4) SOLO en móvil, dejando
    // la franja tocar el borde real de la pantalla; en desktop (md+)
    // vuelve a ser una card normal dentro de la columna. bg-gray-50 +
    // border-y (arriba Y abajo) es la "división acentuada" con el resto
    // del formulario, que sigue en blanco liso.
    <div className="mb-8 -mx-4 md:mx-0 bg-gray-50 border-y md:border border-gray-200 md:rounded-2xl px-4 py-5">
      {/* Estado de Mercado Pago (2026-08-06, Jose: "ponlo arriba del
          título") — es la condición previa para que cualquier diseño se
          pueda vender, tiene sentido que se vea antes de "Mis diseños en
          venta", no después. */}
      <div className="flex items-center justify-between gap-3 mb-3 px-3 py-2.5 rounded-lg bg-white border border-gray-200">
        <div className="flex items-center gap-2">
          <Wallet size={16} className={mpConectado ? 'text-green-600' : 'text-gray-400'} />
          <span className="text-xs font-bold">
            {mpConectado ? 'Mercado Pago conectado' : 'Sin Mercado Pago conectado'}
          </span>
        </div>
        {/* Reconectar sigue visible aun ya conectado (2026-08-06, Jose:
            "¿cómo hago para conectar con mi cuenta real si ya me muestra
            que estoy conectado?") — antes el link desaparecía del todo al
            conectar, sin forma de cambiar de cuenta. Autorizar de nuevo
            sobrescribe el token guardado, no hace falta desconectar antes. */}
        <a
          href={`${PANEL_URL}/api/artistas-mp-conectar?token=${encodeURIComponent(token)}`}
          className={mpConectado
            ? 'text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors'
            : 'inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-white hover:opacity-90 transition-opacity'}
          style={mpConectado ? undefined : { backgroundColor: MP_BLUE }}
        >
          {mpConectado ? 'Reconectar' : (<>Conectar <ExternalLink size={11} /></>)}
        </a>
      </div>
      {!mpConectado && (
        <p className="text-gray-400 text-[10px] mb-4">Conecta tu cuenta de Mercado Pago para empezar a vender tus diseños y recibir pagos de Agenda en línea — el dinero llega directo a ti.</p>
      )}

      <p className={labelClass}>Mis diseños en venta</p>

      {cargando ? (
        <p className="text-gray-400 text-xs text-center py-4">Cargando...</p>
      ) : guardadoOk ? (
        <div className="text-center py-10">
          <CheckCircle2 size={40} className="mx-auto mb-3 text-green-600" />
          <p className="font-black uppercase text-sm mb-1">¡Diseño guardado!</p>
          <p className="text-gray-500 text-xs mb-5">Ya quedó visible en tu perfil público.</p>
          <button
            type="button"
            onClick={() => setGuardadoOk(false)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-black uppercase tracking-widest text-[11px] hover:opacity-90 transition-opacity"
            style={{ backgroundColor: BTN }}
          >
            ← Volver a mis diseños
          </button>
        </div>
      ) : (
        <>
          {/* Scroll lateral (2026-08-06, Jose: "cuando son más de dos, se
              apilan todos en filas de a dos... la idea es que hagan
              scroll lateral, para que no se alargue la card") — antes
              era un grid que envolvía a nuevas filas con cada diseño
              agregado, alargando la sección sin límite. */}
          {disenos && disenos.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 snap-x snap-mandatory scrollbar-hide">
              {disenos.map((d) => (
                <div key={d.id} className={`relative w-[42%] sm:w-40 md:w-44 flex-shrink-0 snap-start aspect-square rounded-lg overflow-hidden border-2 ${editando === d.id ? '' : d.activo ? 'border-gray-200' : 'border-gray-200 opacity-50'}`} style={editando === d.id ? { borderColor: ACCENT } : {}}>
                  <img src={d.imagen_url} alt={d.titulo || 'Diseño'} className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 bg-black/60 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full">
                    {d.tipo === 'lamina' ? 'Lámina' : 'Tatuaje'}
                  </div>
                  <button
                    type="button"
                    onClick={() => iniciarEdicion(d)}
                    aria-label="Editar diseño"
                    className="absolute top-1 right-1 flex items-center justify-center w-6 h-6 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                  >
                    <Pencil size={11} />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[10px] px-1.5 py-1 flex items-center justify-between">
                    <span className="font-bold">${Number(d.precio).toLocaleString('es-CO')}</span>
                    <div className="flex items-center gap-1.5">
                      <button type="button" onClick={() => toggleActivo(d)} className="underline">
                        {d.activo ? 'Ocultar' : 'Mostrar'}
                      </button>
                      <button type="button" onClick={() => borrarDiseno(d)} aria-label="Borrar diseño">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Formulario — agrega uno nuevo, o edita el que se seleccionó
              con el lápiz de arriba (mismo formulario, distinto modo). */}
          <div className="border border-dashed border-gray-300 rounded-lg p-3 space-y-2.5">
            {editando && (
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase" style={{ color: ACCENT }}>Editando diseño</p>
                <button type="button" onClick={cancelarEdicion} className="text-gray-400 text-[10px] font-bold uppercase underline">Cancelar</button>
              </div>
            )}
            {SLOTS_DISENO.map(({ key }) => (
              <input
                key={key}
                type="file"
                accept="image/*"
                ref={(el) => { fileInputs.current[key] = el }}
                style={{ display: 'none' }}
                onChange={(e) => subirImagen(key, e.target.files?.[0])}
              />
            ))}
            <p className="text-gray-400 text-[10px]">Hasta 3 fotos — la primera es obligatoria (ej: el diseño solo), las otras 2 son opcionales (ej: sobre piel, otro ángulo). Toca una foto para reemplazarla, o la ✕ para quitarla.</p>
            <div className="grid grid-cols-3 gap-2">
              {SLOTS_DISENO.map(({ key, label }, i) => (
                <div key={key} className="relative aspect-square">
                  <button
                    type="button"
                    onClick={() => elegirFoto(key)}
                    className="w-full h-full rounded-lg bg-gray-50 border border-gray-200 text-gray-400 overflow-hidden"
                  >
                    {nuevo[key] ? (
                      <img src={nuevo[key]} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    ) : subiendo === key ? (
                      <div className="w-full h-full flex items-center justify-center"><LoaderCircle size={14} className="animate-spin" /></div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                        <Camera size={13} />
                        <span className="text-[8px] font-bold uppercase">{label}</span>
                      </div>
                    )}
                  </button>
                  {/* Solo las fotos 2 y 3 se pueden quitar del todo — la
                      primera es obligatoria, siempre tiene que quedar al
                      menos una. */}
                  {nuevo[key] && i > 0 && (
                    <button
                      type="button"
                      onClick={() => quitarFoto(key)}
                      aria-label={`Quitar ${label}`}
                      className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-gray-700 text-white hover:bg-gray-900 transition-colors"
                    >
                      <X size={11} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {TIPOS_DISENO.map((t) => {
                const conteo = (disenos || []).filter((d) => d.tipo === t.value).length
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setNuevo((n) => ({ ...n, tipo: t.value }))}
                    className={`px-2 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-wide transition-colors ${nuevo.tipo === t.value ? 'text-white' : 'text-gray-500 border-gray-300'}`}
                    style={nuevo.tipo === t.value ? { backgroundColor: BTN, borderColor: BTN } : {}}
                  >
                    {t.label} ({conteo}/5)
                  </button>
                )
              })}
            </div>
            <p className="text-gray-400 text-[10px] -mt-1">{TIPOS_DISENO.find((t) => t.value === nuevo.tipo)?.hint}</p>
            {/* Límite de 5 por categoría (2026-08-06, Jose) — se avisa
                antes de que intente subir fotos y le rebote el error del
                backend; no aplica si está editando uno que ya existe. */}
            {!editando && (disenos || []).filter((d) => d.tipo === nuevo.tipo).length >= 5 && (
              <p className="text-xs font-bold" style={{ color: ACCENT }}>
                Ya tienes el máximo de 5 {nuevo.tipo === 'lamina' ? 'láminas' : 'diseños de tatuaje'} — borra uno para agregar otro.
              </p>
            )}

            <input className={inputClass} placeholder="Título (opcional)" value={nuevo.titulo} onChange={(e) => setNuevo((n) => ({ ...n, titulo: e.target.value }))} />
            <div>
              <textarea
                rows={4}
                className={inputClass}
                placeholder={TIPOS_DISENO.find((t) => t.value === nuevo.tipo)?.placeholderDescripcion}
                value={nuevo.descripcion}
                onChange={(e) => setNuevo((n) => ({ ...n, descripcion: e.target.value }))}
              />
              <p className="text-gray-400 text-[10px] mt-1">Esta descripción es lo más importante para que la persona decida comprar — sé específico, no genérico.</p>
            </div>
            <input className={inputClass} type="number" min="1" placeholder="Precio en COP" value={nuevo.precio} onChange={(e) => setNuevo((n) => ({ ...n, precio: e.target.value }))} />

            <button
              type="button"
              onClick={editando ? guardarEdicion : agregarDiseno}
              disabled={subiendo || guardando || (!editando && (disenos || []).filter((d) => d.tipo === nuevo.tipo).length >= 5)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg border-2 text-xs font-black uppercase tracking-widest disabled:opacity-60"
              style={{ borderColor: BTN, color: BTN }}
            >
              {guardando ? <LoaderCircle size={14} className="animate-spin" /> : editando ? <Check size={14} /> : <Plus size={14} />}
              {editando ? 'Guardar cambios' : 'Agregar diseño'}
            </button>
          </div>
        </>
      )}

      {error && <p className="text-sm mt-3" style={{ color: ACCENT }}>{error}</p>}
    </div>
  )
}

// Pantalla 2 — con token válido: formulario precargado. Deliberadamente
// más simple que el de registro (ArtistaRegistroPage.jsx) — sin el panel
// de vista previa en vivo, para no duplicar toda esa complejidad en una
// pantalla de edición puntual.
function FormularioEdicion({ token, artista, cloud_name, upload_preset }) {
  const [searchParams] = useSearchParams()
  const mp = searchParams.get('mp')
  const [form, setForm] = useState({
    nombre: artista.nombre || '', departamento: artista.departamento || '', municipio: artista.municipio || '',
    lat: artista.lat ?? null, lng: artista.lng ?? null, estilo: artista.estilo || '', bio: artista.bio || '',
    instagram: artista.instagram || '', facebook: artista.facebook || '', whatsapp: artista.whatsapp || '',
    no_tatua: artista.no_tatua || '',
    precio_nivel: artista.precio_nivel ?? '', disponibilidad: artista.disponibilidad || '',
    precio_agendar: artista.precio_agendar ?? '', precio_sesion_texto: artista.precio_sesion_texto || '',
    foto_url: artista.foto_url || '', foto_url_2: artista.foto_url_2 || '',
    foto_trabajo_1: artista.foto_trabajo_1 || '', foto_trabajo_2: artista.foto_trabajo_2 || '', foto_trabajo_3: artista.foto_trabajo_3 || '',
    google_maps_url: artista.google_maps_url || '',
  })
  const [subiendo, setSubiendo] = useState(null)
  const [ubicando, setUbicando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [error, setError] = useState(null)
  const fileInputs = useRef({})
  // Edición in situ (2026-08-06, Jose: "yo podré cambiar mi nombre, mi
  // especialidad, sobre mí, las redes sociales y el wpp... desde allí
  // mismo") — un solo interruptor junto al nombre convierte SOLO esos
  // campos (texto libre, bajo riesgo) en inputs sobre el perfil real. El
  // resto (ubicación, no tatúa, precio, disponibilidad, agenda) sigue
  // en el formulario de abajo — son datos que necesitan más cuidado
  // (selects, validaciones), no reemplazo de texto suelto.
  const [editandoHero, setEditandoHero] = useState(false)

  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))
  const setDepartamento = (nuevo) => setForm((f) => ({ ...f, departamento: nuevo, municipio: '' }))
  const setMunicipio = (nuevo) => setForm((f) => ({ ...f, municipio: nuevo }))
  const municipiosDisponibles = MUNICIPIOS_POR_DEPARTAMENTO[form.departamento] || []

  const elegirFoto = (slot) => fileInputs.current[slot]?.click()
  const subirFoto = async (slot, file) => {
    if (!file || !cloud_name || !upload_preset) return
    setSubiendo(slot)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', upload_preset)
      fd.append('folder', 'inkognito-artistas')
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) setForm((f) => ({ ...f, [slot]: data.secure_url }))
    } catch {
      setError('No pudimos subir esa foto — intenta de nuevo.')
    } finally {
      setSubiendo(null)
    }
  }

  const usarMiUbicacion = () => {
    if (!navigator.geolocation) return
    setUbicando(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => { setForm((f) => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude })); setUbicando(false) },
      () => setUbicando(false),
      { timeout: 8000 }
    )
  }

  const guardar = async (e) => {
    e.preventDefault()
    setError(null)
    setGuardando(true)
    try {
      const res = await fetch(`${PANEL_URL}/api/artistas-editar-por-token`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...form }),
      })
      if (!res.ok) throw new Error()
      setGuardado(true)
    } catch {
      setError('No pudimos guardar los cambios — intenta de nuevo en un momento.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    // max-w-3xl solo hasta lg (2026-08-06, Jose: "deben ocupar el ancho
    // de la pantalla en PC") — en móvil sigue siendo la misma columna
    // angosta tipo perfil de siempre; en desktop se libera para que las
    // dos columnas de abajo (perfil editable / formulario) puedan usar
    // todo el ancho real de la pantalla, no quedar encogidas dentro de
    // un límite pensado para una sola columna.
    <div className="max-w-3xl lg:max-w-none mx-auto">
      {/* Sin h1 "Editar mi perfil" acá (2026-08-06, Jose: "quita el
          título editar debajo del navbar pues es redundante ya que está
          en el navbar") — el navbar ya dice "Editar mi perfil" (ver
          ArtistaEditarPerfilPage, prop titulo). La instrucción corta se
          queda, sí aporta algo que el navbar no dice. */}
      <div className="px-4 max-w-3xl mx-auto">
        <p className="text-gray-500 text-sm text-center mb-6 pt-2">Hola {artista.nombre} — toca "Editar" junto a tu nombre para cambiar tus datos, o cualquier foto para reemplazarla.</p>

        {mp === 'ok' && (
          <p className="text-sm text-center mb-4 py-2 rounded-lg bg-green-50 text-green-700 font-bold">✓ Mercado Pago conectado</p>
        )}
        {mp === 'error' && (
          <p className="text-sm text-center mb-4 py-2 rounded-lg bg-gray-50 text-gray-600 font-bold">No pudimos conectar Mercado Pago — intenta de nuevo.</p>
        )}
      </div>

      {/* Confirmación a pantalla completa tras guardar (2026-08-05, Jose:
          "solo espabila y arriba dice cambio exitoso... quiero que dé la
          sensación de que sí ocurrió algo") — antes era un texto chico
          que aparecía arriba sin mover nada más, fácil de no notar. Ahora
          reemplaza todo el contenido hasta que el artista decide volver. */}
      {guardado ? (
        <div className="text-center py-14 px-4 max-w-sm mx-auto">
          <CheckCircle2 size={48} className="mx-auto mb-4 text-green-600" />
          <h2 className="text-lg font-black uppercase mb-2">¡Listo!</h2>
          <p className="text-gray-500 text-sm mb-6">Guardamos tus cambios correctamente.</p>
          <button
            type="button"
            onClick={() => setGuardado(false)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
            style={{ backgroundColor: BTN }}
          >
            ← Volver a editar
          </button>
        </div>
      ) : (
      <>
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

      {/* EDICIÓN IN SITU (2026-08-06, Jose: "esta previsualización...
          debería aparecer de primero en el hero, y no debería estar
          dentro de una card... yo podré cambiar mi nombre, mi
          especialidad, sobre mí, las redes sociales y el wpp... desde
          allí mismo") — ya no es una vista previa aparte metida en una
          card angosta: son literalmente las mismas clases/tamaños que
          ArtistaLandingPage.jsx (el perfil público real), con un botón
          "Editar" junto al nombre que convierte esos campos puntuales en
          inputs sobre el sitio. Todo lo demás (municipio, no tatúa,
          precio, disponibilidad, agenda) se sigue viendo acá para dar
          contexto, pero solo se cambia más abajo en el formulario — son
          datos que necesitan más cuidado (selects, validaciones), no un
          texto suelto. */}

      {/* Dos columnas en PC (2026-08-06, Jose: "la vista tipo perfil
          editable estará a la izquierda... los demás datos a llenar
          ocuparán el lado derecho") — en móvil sigue apilado igual que
          antes (las clases lg: no hacen nada por debajo de ese
          breakpoint), en desktop se parte en dos bloques lado a lado. */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-0 lg:items-start lg:w-full">
      <div>
      <div className="w-full h-40 sm:h-56 md:h-72 bg-gray-100 overflow-hidden relative">
        {form.foto_url_2 && <img src={form.foto_url_2} alt="" className="w-full h-full object-cover" />}
        <button
          type="button"
          onClick={() => elegirFoto('foto_url_2')}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 text-white text-[11px] font-bold uppercase tracking-wide px-3 py-2 rounded-full backdrop-blur-sm hover:bg-black/80 transition-colors"
        >
          {subiendo === 'foto_url_2' ? <LoaderCircle size={12} className="animate-spin" /> : <Camera size={12} />}
          Portada
        </button>
      </div>

      <div className="px-4">
        <div className="relative min-h-16 sm:min-h-[85px] md:min-h-[107px]">
          <div className="absolute left-0 top-0 -translate-y-1/3">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-gray-100 shadow-md overflow-hidden">
              {form.foto_url ? (
                <img src={form.foto_url} alt={form.nombre} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl font-black">
                  {form.nombre?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => elegirFoto('foto_url')}
              aria-label="Subir foto de perfil"
              className="absolute bottom-1 right-1 flex items-center justify-center w-8 h-8 rounded-full text-white shadow-md bg-gray-600"
            >
              {subiendo === 'foto_url' ? <LoaderCircle size={13} className="animate-spin" /> : <Camera size={13} />}
            </button>
          </div>

          <div className="min-w-0 pt-2 pl-[108px] sm:pl-[144px] md:pl-[176px] flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {editandoHero ? (
                  <input
                    value={form.nombre}
                    onChange={set('nombre')}
                    className="text-base sm:text-xl md:text-2xl font-black uppercase leading-tight bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-gray-600 min-w-0 flex-1"
                  />
                ) : (
                  <h1 className="text-base sm:text-xl md:text-2xl font-black uppercase leading-tight truncate">{form.nombre || 'Tu nombre'}</h1>
                )}
                <button
                  type="button"
                  onClick={() => setEditandoHero((v) => !v)}
                  className="flex-shrink-0 flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <Pencil size={10} />
                  {editandoHero ? 'Listo' : 'Editar'}
                </button>
              </div>
              <div className="mt-1 space-y-0.5">
                <span className="flex items-center gap-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500 truncate">
                  <MapPin size={10} className="flex-shrink-0" />
                  <span className="truncate">{form.municipio ? `${form.municipio}${form.departamento ? ', ' + form.departamento : ''}` : 'Municipio (más abajo)'}</span>
                </span>
                {editandoHero ? (
                  <span className="flex items-center gap-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500">
                    <Palette size={10} className="flex-shrink-0" />
                    <input
                      value={form.estilo}
                      onChange={set('estilo')}
                      placeholder="Ej: Realismo, Blackwork"
                      className="bg-transparent border-b border-gray-300 focus:outline-none normal-case tracking-normal font-medium text-gray-700"
                    />
                  </span>
                ) : (
                  form.estilo && (
                    <span className="flex items-center gap-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500 truncate">
                      <Palette size={10} className="flex-shrink-0" />
                      <span className="truncate">{form.estilo}</span>
                    </span>
                  )
                )}
              </div>
            </div>
            {form.precio_nivel && (
              <span className="flex-shrink-0 text-xs font-bold tracking-widest text-gray-500 pt-0.5">{'$'.repeat(Number(form.precio_nivel))}</span>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {(form.bio || editandoHero) && (
            <div className="relative max-w-xl">
              <div className="bg-gray-100 border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3.5">
                {editandoHero ? (
                  <textarea
                    rows={3}
                    value={form.bio}
                    onChange={set('bio')}
                    placeholder="Cuenta algo sobre ti..."
                    className="w-full bg-transparent text-gray-700 text-sm leading-relaxed focus:outline-none resize-none"
                  />
                ) : (
                  <p className="text-gray-700 text-sm leading-relaxed">{form.bio}</p>
                )}
              </div>
              <span className="absolute -top-3 left-4 px-2.5 py-1 rounded-full bg-white border border-gray-300 shadow-sm text-[10px] font-black uppercase tracking-widest text-gray-500">
                Sobre mí
              </span>
              {form.disponibilidad && (
                <span
                  className="absolute -top-4 right-4 px-2 py-1 rounded-full whitespace-nowrap text-[8.5px] font-bold uppercase tracking-wide text-white shadow-md"
                  style={{ backgroundColor: DISPONIBILIDAD_COLOR[form.disponibilidad] || ACCENT }}
                >
                  {DISPONIBILIDAD_TEXTO[form.disponibilidad] || form.disponibilidad}
                </span>
              )}
            </div>
          )}

          {/* Agenda en línea — SIEMPRE visible en la vista previa, aunque
              el artista no haya llenado nada aún (2026-08-06, Jose: "el
              texto de cómo se vería completo debe estar presente"). Los
              precios muestran "$X" de ejemplo hasta que se llenan — así
              entiende de una vez cómo se ve completa la card, sin tener
              que adivinar ni llenar los campos primero. Misma estructura
              de dos capas y mismo padding (pt-2.5/px-4/pb-7) que el
              perfil público real — versión anterior comprimida hacía que
              el botón "Agendar" se viera a punto de salirse de la card. */}
          {/* Sin max-w-xl acá (2026-08-06, Jose: "no estás cogiendo todo
              el ancho de la pantalla en el hero") — a diferencia del
              perfil público (donde la card angosta es una elección de
              diseño), en edición esta card es la pieza que más queremos
              que el artista note, así que ocupa todo el ancho de la
              columna, igual que la portada. */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 border border-gray-500/30 shadow-lg">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent" />
              <div className="pt-2.5 px-4 pb-7">
                <p className="text-[11px] font-black uppercase tracking-widest mb-2 text-gray-300">Agenda en línea</p>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-6">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5 whitespace-nowrap">Valor de mi sesión</p>
                      <p className="text-base font-black text-white whitespace-nowrap">
                        {form.precio_sesion_texto ? `$${Number(form.precio_sesion_texto).toLocaleString('es-CO')}` : '$X'}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5 whitespace-nowrap">Para agendar</p>
                      <p className="text-base font-black text-white whitespace-nowrap">
                        {form.precio_agendar ? `$${Number(form.precio_agendar).toLocaleString('es-CO')}` : '$X'}
                      </p>
                    </div>
                  </div>
                  <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white text-gray-900 font-black uppercase tracking-widest text-[11px]">
                    Agendar
                  </span>
                </div>
              </div>
            </div>

            {/* Mercado Pago — insignia real si ya está conectado, o una
                invitación a conectarlo si no (2026-08-06, Jose: "solo
                cuando el artista se registre... si no, algo informativo
                que lo invite a hacerlo"). Sin esto conectado, la card de
                Agenda en línea no puede cobrar de verdad aunque tenga
                precios llenos. */}
            {artista.mp_conectado ? (
              <span
                className="absolute -bottom-3 right-4 flex items-center px-2.5 py-1 rounded-full bg-white border shadow-md"
                style={{ borderColor: MP_BLUE }}
              >
                <img
                  src={MP_LOGO_URL}
                  alt="Mercado Pago"
                  className="h-4"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              </span>
            ) : (
              <a
                href={`${PANEL_URL}/api/artistas-mp-conectar?token=${encodeURIComponent(token)}`}
                className="absolute -bottom-3 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-[9px] font-black uppercase tracking-widest shadow-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: MP_BLUE }}
              >
                Conecta Mercado Pago <ExternalLink size={10} />
              </a>
            )}
          </div>
          {!artista.mp_conectado && (
            <p className="text-gray-400 text-[11px] max-w-xl mt-5">Sin esto conectado, nadie puede pagarte para agendar — conéctalo para empezar a recibir esos pagos directo a tu cuenta.</p>
          )}
        </div>
      </div>

      <div className="mt-5 max-w-3xl mx-auto lg:mx-0">
        <div className="grid grid-cols-3 gap-0.5 sm:gap-1 w-full">
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
      </div>

      {form.no_tatua && !editandoHero && (
        <div className="max-w-3xl mx-auto px-4 mt-4">
          <p className="text-gray-400 text-[11px] uppercase tracking-widest mb-1">No tatúa</p>
          <p className="text-gray-700 text-sm leading-relaxed">{form.no_tatua}</p>
        </div>
      )}

      {/* Redes sociales + WhatsApp — al final, igual que en el perfil
          público real (2026-08-06). Editables in situ junto con
          nombre/estilo/bio, MISMO interruptor (editandoHero) que el de
          arriba junto al nombre — pero como quedan lejos de ahí, Jose no
          se dio cuenta de que estaban conectados ("así como están ahora
          no me da para editarlos"). Se repite acá un "Editar"/"Listo"
          propio, visible justo donde está la acción. */}
      <div className="mt-5 max-w-3xl mx-auto lg:mx-0">
        <div className="px-4 flex justify-end mb-1.5">
          <button
            type="button"
            onClick={() => setEditandoHero((v) => !v)}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors"
          >
            <Pencil size={10} />
            {editandoHero ? 'Listo' : 'Editar'}
          </button>
        </div>
        {editandoHero ? (
          <div className="grid grid-cols-2 border-t border-gray-200">
            <div className="border-r border-gray-200 p-3">
              <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1 mb-1"><FaFacebook size={10} /> Facebook</label>
              <input value={form.facebook} onChange={set('facebook')} placeholder="https://facebook.com/..." className="w-full text-xs bg-transparent border-b border-gray-300 focus:outline-none" />
            </div>
            <div className="p-3">
              <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1 mb-1"><FaInstagram size={10} /> Instagram</label>
              <input value={form.instagram} onChange={set('instagram')} placeholder="https://instagram.com/..." className="w-full text-xs bg-transparent border-b border-gray-300 focus:outline-none" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 w-full border-t border-gray-200">
            <div className={`flex items-center justify-center gap-2.5 py-3.5 border-r border-gray-200 ${form.facebook ? 'text-gray-700' : 'text-gray-300'}`}>
              <FaFacebook size={18} />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Facebook</span>
            </div>
            <div className={`flex items-center justify-center gap-2.5 py-3.5 ${form.instagram ? 'text-gray-700' : 'text-gray-300'}`}>
              <FaInstagram size={18} />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Instagram</span>
            </div>
          </div>
        )}

        {editandoHero ? (
          <div className="border-t border-b border-gray-200 p-3">
            <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1 mb-1"><FaWhatsapp size={10} /> WhatsApp *</label>
            <input required value={form.whatsapp} onChange={set('whatsapp')} placeholder="573..." className="w-full text-xs bg-transparent border-b border-gray-300 focus:outline-none" />
          </div>
        ) : form.whatsapp ? (
          <div className="flex items-center justify-center gap-2.5 py-3.5 border-t border-b border-gray-200 bg-green-600 text-white font-black uppercase tracking-widest text-sm">
            <FaWhatsapp size={18} />
            Contactar al artista
          </div>
        ) : (
          <div className="border-t border-b border-gray-200" />
        )}
      </div>
      </div>

      {/* Columna derecha en PC: SOLO "Mis diseños en venta" — sin
          max-w-lg, ocupa todo el ancho que le queda al lado del perfil
          editable (2026-08-06, Jose: "que la sesión de agregar o editar
          diseños ocupe todo el ancho de la pantalla que le queda"). */}
      <div>
      <div className="px-4 mt-8 lg:mt-0">

      <MisDisenosSection token={token} cloud_name={cloud_name} upload_preset={upload_preset} mpConectado={artista.mp_conectado} />

      </div>
      </div>
      </div>

      {/* Resto del formulario — un solo bloque largo, a todo el ancho,
          debajo de las dos columnas de arriba (2026-08-06, Jose: "así
          formamos, dos bloques arriba, y uno largo debajo de ambos"). */}
      <div className="px-4 mt-8">
      <form onSubmit={guardar} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Departamento *</label>
            <ComboboxBuscable value={form.departamento} onChange={setDepartamento} options={DEPARTAMENTOS} placeholder="Escribe para buscar..." inputClassName={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Municipio *</label>
            <ComboboxBuscable value={form.municipio} onChange={setMunicipio} options={municipiosDisponibles} disabled={!form.departamento} placeholder="Escribe para buscar..." inputClassName={inputClass} />
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={usarMiUbicacion}
            disabled={ubicando}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-60"
            style={form.lat ? { borderColor: '#16a34a', color: '#16a34a' } : { borderColor: '#4B5563', color: '#4B5563' }}
          >
            {ubicando ? <LoaderCircle size={14} className="animate-spin" /> : form.lat ? <Check size={14} /> : <Navigation size={14} />}
            {ubicando ? 'Ubicando...' : form.lat ? 'Ubicación exacta guardada' : 'Actualizar mi ubicación exacta'}
          </button>
          {/* Aclaración (2026-08-07, Jose confundió esto con el link de
              Google Maps, pensando que uno reemplaza al otro) — son
              independientes: esto alimenta el orden por cercanía del
              buscador, el link de Google Maps de abajo NO. */}
          <p className="text-gray-400 text-[10px] mt-1.5 text-center">Actívalo siempre — es lo único que ordena tu perfil por cercanía real en el buscador, tengas o no link de Google Maps.</p>
        </div>

        <div>
          {/* Link de Google Maps (2026-08-07, Jose: "conectar el botón de
              ubicación con el mapa real de ese negocio") — opcional; sin
              esto, el chip de ubicación del perfil público igual funciona
              (cae a la ubicación exacta de arriba o a una búsqueda por
              nombre+municipio). Texto de ayuda explícito (Jose confundió
              esto con la ubicación exacta, pensando que había que elegir
              una de las dos) — deja claro que esto es ADEMÁS, no en su
              lugar, y que no afecta el orden del buscador. */}
          <label className={labelClass}>Link de Google Maps (opcional)</label>
          <input className={inputClass} value={form.google_maps_url} onChange={set('google_maps_url')} placeholder="https://maps.app.goo.gl/..." />
          <p className="text-gray-400 text-[10px] mt-1">Si ya tienes ficha de tu estudio/local en Google Maps, pégala acá — el botón de ubicación de tu perfil abrirá esa ficha real en vez de un pin genérico. No reemplaza la ubicación exacta de arriba, es un extra: no afecta el orden del buscador.</p>
        </div>

        <div>
          <label className={labelClass}>No tatúas (opcional)</label>
          <input className={inputClass} value={form.no_tatua} onChange={set('no_tatua')} placeholder="Ej: rostro, manos, zonas genitales" />
        </div>

        {/* Precio/disponibilidad (2026-08-06, Jose: "la opción de editar
            del artista no tiene para elegir estos dos datos" — antes solo
            se podían cambiar desde el panel admin; se muestran en el
            perfil público como badges, tiene sentido que el artista los
            actualice él mismo, sobre todo disponibilidad, que cambia
            seguido). */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Precio</label>
            <select className={inputClass} value={form.precio_nivel} onChange={set('precio_nivel')}>
              <option value="">Sin elegir</option>
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{'$'.repeat(n)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Disponibilidad</label>
            <select className={inputClass} value={form.disponibilidad} onChange={set('disponibilidad')}>
              <option value="">Sin elegir</option>
              {OPCIONES_DISPONIBILIDAD.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Reservas con anticipo (fase 2, 2026-08-06) — un solo campo
            obligatorio para activar el botón "Reservar" en el perfil: el
            monto real que se cobra por Mercado Pago. No es un anticipo
            parcial de un total mayor, es el monto completo de la reserva.
            El valor de sesión de abajo es puramente informativo, nunca se
            cobra — muchos artistas no quieren publicar el precio real del
            tatuaje, pero sí dar contexto antes de que alguien pague.
            precio_sesion_texto pasó de textarea a número (2026-08-06, Jose:
            "ahí no tienen por qué escribir una frase, es el valor de la
            sesión, así que debe ser números") — se muestra junto a "Para
            agendar" en una grilla simétrica en el perfil, dos precios
            reales se ven mejor que un precio al lado de una oración. */}
        {/* Copy con beneficio, no solo descripción técnica (2026-08-06,
            Jose: "esa card en editar debe estar muy bien optimizada para
            que el artista decida usarla, por ahí ganaremos la comisión")
            — antes solo explicaba qué hacía cada campo; ahora explica por
            qué le conviene al artista activarlo, mismo argumento ya
            probado en el modal "Términos y condiciones" del perfil
            público, pero dirigido a él, no al cliente. */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-gray-400 text-[11px] uppercase tracking-widest mb-1.5 pt-3">Reservas con anticipo</p>
          <p className="text-gray-500 text-[11px] leading-relaxed mb-3">
            Un cliente que ya pagó para agendar es distinto a uno que solo escribió — no compite con otros mensajes, y tú recibes su contacto completo al instante. Actívalo y aparece un botón "Reservar" en tu perfil, sin reemplazar tu WhatsApp.
          </p>
          <div>
            <label className={labelClass}>Para agendar (COP)</label>
            <input
              type="number" min="0" className={inputClass} value={form.precio_agendar}
              onChange={(e) => setForm((f) => ({ ...f, precio_agendar: e.target.value }))}
              placeholder="Ej: 50000"
            />
            <p className="text-gray-400 text-[11px] mt-1">Esto es lo que el cliente paga para agendar contigo — no un anticipo parcial, es el monto completo de la reserva. Con solo este campo ya puedes empezar a recibir reservas pagas.</p>
          </div>
          <div className="mt-3">
            <label className={labelClass}>El valor de mi sesión (COP, opcional)</label>
            <input
              type="number" min="0" className={inputClass} value={form.precio_sesion_texto}
              onChange={(e) => setForm((f) => ({ ...f, precio_sesion_texto: e.target.value }))}
              placeholder="Ej: 150000"
            />
            <p className="text-gray-400 text-[11px] mt-1">Opcional — no te compromete a cobrar exactamente eso, pero da contexto para que quien te escribe ya venga con una expectativa clara. Muchos artistas prefieren dejarlo vacío y solo publicar "Para agendar", sin exponer sus tarifas — también funciona bien así.</p>
          </div>
        </div>

        {error && <p className="text-sm" style={{ color: ACCENT }}>{error}</p>}

        <button
          type="submit"
          disabled={guardando}
          className="w-full py-3.5 text-white font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 text-sm"
          style={{ backgroundColor: BTN }}
        >
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
      </div>
      </>
      )}
    </div>
  )
}

export default function ArtistaEditarPerfilPage() {
  const { token, artista, error, cloud_name, upload_preset } = useLoaderData()
  const navigate = useNavigate()

  // Guardar el token válido para la próxima visita, y limpiar uno guardado
  // que ya no sirve (evita reintentar en bucle un token vencido guardado
  // de una sesión vieja).
  useEffect(() => {
    if (token && artista) localStorage.setItem(EDIT_TOKEN_KEY, token)
    else if (token && error) localStorage.removeItem(EDIT_TOKEN_KEY)
  }, [token, artista, error])

  // Sin token en la URL — antes de mostrar "pide tu correo", intenta con
  // el que quedó guardado de una visita anterior.
  useEffect(() => {
    if (token) return
    const guardado = localStorage.getItem(EDIT_TOKEN_KEY)
    if (guardado) navigate(`?token=${encodeURIComponent(guardado)}`, { replace: true })
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavbarArtistas titulo="Editar mi perfil" />
      {/* Sin px-4 acá (2026-08-06) — antes lo aplicaba a TODO, así que
          ninguna sección de FormularioEdicion podía ser realmente edge-
          to-edge en móvil (ni portada, ni trabajos, ni "Mis diseños en
          venta", aunque su propio código no tuviera padding — el padre
          se lo imponía). Mismo patrón que ArtistaLandingPage.jsx: el
          padding va sección por sección, no en el contenedor general. */}
      <div className="flex-1 pt-20 md:pt-24 pb-16 w-full">
        {!token || !artista ? (
          error ? (
            <div className="text-center max-w-sm mx-auto px-4">
              <p className="text-gray-500 text-sm leading-relaxed">{error}</p>
            </div>
          ) : (
            <div className="px-4"><PedirLinkForm /></div>
          )
        ) : (
          <FormularioEdicion token={token} artista={artista} cloud_name={cloud_name} upload_preset={upload_preset} />
        )}
      </div>
      <footer className="border-t border-gray-200 py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-400 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} Tattoo Artist Colombia — Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link to="/tattoo-artist-colombia/terminos" className="text-gray-400 hover:text-gray-700 transition-colors">Términos</Link>
            <Link to="/tattoo-artist-colombia/privacidad" className="text-gray-400 hover:text-gray-700 transition-colors">Privacidad</Link>
            <span className="text-gray-300">Desarrollado por INKognito</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
