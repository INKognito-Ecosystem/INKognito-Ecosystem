import { useState, useEffect, useMemo, useRef } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2, Calendar, ImagePlus, X } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { WHATSAPP } from '../../config/business'

const WA_LINK = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola Jose, quiero agendar/cotizar un tatuaje')}`

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Mismo Cloudinary (unsigned upload) que ya usa el panel para portafolio/
// inventario — valores públicos por diseño (un preset "unsigned" está pensado
// para vivir en un cliente, se restringe del lado de Cloudinary, no es secreto).
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dsywlttay'
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'inkognito-inventario'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DIAS_SEMANA = ['L','M','X','J','V','S','D']

const toISO = (d) => d.toISOString().split('T')[0]

// Encabezado numerado de cada columna — mismo patrón que ColHead en
// SolicitarRecogida.jsx (Eljach), adaptado a la paleta de esta landing.
function ColHead({ n, title, sub }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
        {n}
      </span>
      <div>
        <h4 className="text-white text-sm font-bold leading-none">{title}</h4>
        <span className="text-gray-500 text-[11px]">{sub}</span>
      </div>
    </div>
  )
}

async function subirImagenReferencia(file) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  fd.append('folder', 'inkognito-citas-referencias')
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: fd })
  const data = await res.json()
  if (!data.secure_url) throw new Error(data.error?.message || 'Error al subir la imagen')
  return data.secure_url.includes('/upload/') ? data.secure_url.replace('/upload/', '/upload/f_auto,q_auto/') : data.secure_url
}

// Formulario de agendamiento directo desde la web — sin pasar por WhatsApp.
// Pensado para mientras Kapso/Twilio no estén operativos (2026-07-26): la
// cita queda en 'pending' en el panel, Jose confirma precio/anticipo aparte.
// La disponibilidad ('Pequeño' caben 2/día, 'Mediano'/'Grande' ocupan el día
// completo) se re-valida siempre en el servidor — esto solo es la vista.
export default function AgendaPublica() {
  const [disponibilidad, setDisponibilidad] = useState({})
  const [monthOffset, setMonthOffset] = useState(0)
  const [form, setForm] = useState({ client_name: '', client_phone: '', design: '', location: '', locationOtro: '', size: '', hora_preferida: '' })
  const [selectedDate, setSelectedDate] = useState(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [estado, setEstado] = useState('idle') // idle | enviando | ok | error
  const [errorMsg, setErrorMsg] = useState('')
  const [refImageUrl, setRefImageUrl] = useState(null)
  const [refImagePreview, setRefImagePreview] = useState(null)
  const [subiendoImagen, setSubiendoImagen] = useState(false)
  const [errorImagen, setErrorImagen] = useState('')
  const calendarRef = useRef(null)

  const onFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setErrorImagen('')
    setRefImagePreview((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file) })
    setRefImageUrl(null)
    setSubiendoImagen(true)
    try {
      const url = await subirImagenReferencia(file)
      setRefImageUrl(url)
    } catch {
      setErrorImagen('No se pudo subir la imagen. Puedes intentar con otra foto o continuar sin ella.')
      setRefImagePreview((prev) => { if (prev) URL.revokeObjectURL(prev); return null })
    } finally {
      setSubiendoImagen(false)
    }
  }

  const quitarImagen = () => {
    setRefImagePreview((prev) => { if (prev) URL.revokeObjectURL(prev); return null })
    setRefImageUrl(null)
    setErrorImagen('')
  }

  // Cierra el desplegable al hacer clic afuera — mismo patrón que cualquier
  // selector tipo dropdown.
  useEffect(() => {
    if (!calendarOpen) return
    const handleClick = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) setCalendarOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [calendarOpen])

  useEffect(() => {
    const desde = new Date()
    const hasta = new Date()
    hasta.setDate(hasta.getDate() + 60)
    fetch(`${PANEL_URL}/api/appointments/disponibilidad?desde=${toISO(desde)}&hasta=${toISO(hasta)}`)
      .then(r => r.json())
      .then(setDisponibilidad)
      .catch(() => setDisponibilidad({}))
  }, [])

  const update = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }))

  // Grilla del mes visible — null para los huecos antes del día 1
  const dias = useMemo(() => {
    const base = new Date()
    base.setDate(1)
    base.setMonth(base.getMonth() + monthOffset)
    const year = base.getFullYear()
    const month = base.getMonth()
    const primerDiaSemana = (new Date(year, month, 1).getDay() + 6) % 7 // lunes=0
    const totalDias = new Date(year, month + 1, 0).getDate()
    const celdas = Array(primerDiaSemana).fill(null)
    for (let d = 1; d <= totalDias; d++) celdas.push(new Date(year, month, d))
    return { celdas, year, month }
  }, [monthOffset])

  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)

  const estadoDia = (fecha) => {
    if (!fecha) return null
    if (fecha <= hoy) return 'pasado'
    const iso = toISO(fecha)
    const ocupacion = disponibilidad[iso]
    if (ocupacion === 'ocupado') return 'ocupado'
    if (ocupacion === 'solo_pequeno') return form.size === 'Pequeño' ? 'libre' : 'ocupado'
    return 'libre'
  }

  const locationFinal = form.location === 'Otra' ? form.locationOtro.trim() : form.location
  const formCompleto = Boolean(
    form.client_name && form.client_phone && form.size && selectedDate
    && locationFinal && form.design.trim() && form.hora_preferida && refImageUrl
  )

  const enviar = async (e) => {
    e.preventDefault()
    if (!formCompleto) return
    setEstado('enviando')
    setErrorMsg('')
    try {
      const res = await fetch(`${PANEL_URL}/api/appointments/publica`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: form.client_name,
          client_phone: form.client_phone,
          design: form.design,
          location: locationFinal,
          size: form.size,
          hora_preferida: form.hora_preferida,
          session_date: toISO(selectedDate),
          reference_image_url: refImageUrl,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error || 'No pudimos enviar tu solicitud. Intenta de nuevo.')
        setEstado('error')
        if (res.status === 409) {
          // Alguien más ocupó esa fecha mientras llenabas el formulario —
          // refresca disponibilidad y deselecciona.
          setSelectedDate(null)
          fetch(`${PANEL_URL}/api/appointments/disponibilidad?desde=${toISO(hoy)}&hasta=${toISO(new Date(hoy.getTime() + 60 * 86400000))}`)
            .then(r => r.json()).then(setDisponibilidad).catch(() => {})
        }
        return
      }
      setEstado('ok')
    } catch {
      setErrorMsg('No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.')
      setEstado('error')
    }
  }

  if (estado === 'ok') {
    return (
      <section id="contacto" className="py-10 md:py-16 px-4 bg-black border-t border-white/5">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-black uppercase italic mb-3">¡Solicitud recibida!</h3>
          <p className="text-gray-400 leading-relaxed">
            Te contactaremos pronto para confirmar el precio, el anticipo y los últimos
            detalles de tu cita del {selectedDate?.toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })}.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="contacto" className="py-10 md:py-16 px-4 bg-black border-t border-white/5">
      <div className="max-w-[1320px] mx-auto">
        <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-3 text-center">
          Agenda tu <span className="text-zinc-600">Cita</span>
        </h2>
        <p className="text-gray-500 text-sm text-center max-w-md mx-auto mb-8">
          Todos los campos son obligatorios: son los que nos permiten darte un precio exacto antes de tu cita.
        </p>

        {/* Ancho completo en PC, mismo patrón que "Agendar recogida" de
            Eljach: los dos grupos más cortos (Fecha, Tus datos) van juntos
            a la izquierda, y el espacio que dejan libre abajo (Tu tatuaje
            es más largo por la foto) se llena con la invitación a
            escribir en vez de quedar vacío. */}
        <form onSubmit={enviar} className="bg-zinc-950 border border-gray-800 rounded-xl p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-8 lg:gap-y-0 divide-y divide-dashed divide-gray-800 lg:divide-y-0 lg:divide-x lg:divide-gray-800">

            {/* IZQUIERDA — Fecha + Tus datos, lado a lado, con el relleno abajo */}
            <div className="lg:col-span-2 lg:pr-8 flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y divide-dashed divide-gray-800 sm:divide-y-0 sm:divide-x sm:divide-gray-800">

                {/* 1 — FECHA */}
                <div className="sm:pr-6 space-y-4">
                  <ColHead n="1" title="Fecha" sub="Cuándo quieres venir" />

                  {/* SELECTOR DE FECHA — botón compacto que despliega el mes
                      al tocarlo, en vez de un calendario siempre abierto. */}
                  <div className="relative" ref={calendarRef}>
                    <button
                      type="button"
                      onClick={() => form.size && setCalendarOpen(o => !o)}
                      disabled={!form.size}
                      className="w-full flex items-center justify-between gap-2 bg-zinc-900 border border-gray-700 text-left p-3.5 rounded outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className={selectedDate ? 'text-white' : 'text-gray-500'}>
                        <Calendar size={16} className="inline mr-2 -mt-0.5 text-gray-500" />
                        {selectedDate
                          ? selectedDate.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
                          : (form.size ? 'Elige un día disponible *' : 'Elige primero el tamaño →')}
                      </span>
                    </button>

                    {calendarOpen && (
                      <div className="absolute z-20 mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-lg p-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-3">
                          <button type="button" onClick={() => setMonthOffset(m => Math.max(0, m - 1))} disabled={monthOffset === 0}
                            className="text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed">
                            <ChevronLeft size={20} />
                          </button>
                          <span className="text-white font-bold text-sm uppercase tracking-wide">
                            {MESES[dias.month]} {dias.year}
                          </span>
                          <button type="button" onClick={() => setMonthOffset(m => Math.min(2, m + 1))} disabled={monthOffset === 2}
                            className="text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed">
                            <ChevronRight size={20} />
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center mb-1">
                          {DIAS_SEMANA.map(d => <span key={d} className="text-gray-600 text-[10px] font-bold">{d}</span>)}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                          {dias.celdas.map((fecha, i) => {
                            if (!fecha) return <div key={i} />
                            const est = estadoDia(fecha)
                            const isSelected = selectedDate && toISO(selectedDate) === toISO(fecha)
                            const disabled = est === 'pasado' || est === 'ocupado'
                            return (
                              <button
                                type="button"
                                key={i}
                                disabled={disabled}
                                onClick={() => { setSelectedDate(fecha); setCalendarOpen(false) }}
                                className={`aspect-square rounded text-xs font-bold transition-colors ${
                                  isSelected ? 'bg-green-600 text-white'
                                  : disabled ? 'text-gray-700 cursor-not-allowed'
                                  : 'text-gray-300 hover:bg-zinc-800 border border-zinc-800'
                                }`}
                              >
                                {fecha.getDate()}
                              </button>
                            )
                          })}
                        </div>

                        <div className="flex items-center gap-3 mt-4 text-[9px] text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-600" /> Seleccionado</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border border-zinc-700" /> Disponible</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-zinc-800" /> Ocupado</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <select
                    value={form.hora_preferida}
                    onChange={e => update('hora_preferida', e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-gray-700 text-white p-3.5 rounded outline-none"
                  >
                    <option value="">¿Horario preferido? *</option>
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                  </select>
                </div>

                {/* 2 — TUS DATOS */}
                <div className="sm:pl-6 pt-6 sm:pt-0 space-y-4">
                  <ColHead n="2" title="Tus datos" sub="Para contactarte" />

                  <input
                    type="text"
                    value={form.client_name}
                    onChange={e => update('client_name', e.target.value)}
                    placeholder="Tu nombre *"
                    required
                    className="w-full bg-zinc-900 border border-gray-700 text-white p-3.5 rounded outline-none placeholder:text-gray-600"
                  />

                  <input
                    type="tel"
                    value={form.client_phone}
                    onChange={e => update('client_phone', e.target.value)}
                    placeholder="Tu WhatsApp o teléfono *"
                    required
                    className="w-full bg-zinc-900 border border-gray-700 text-white p-3.5 rounded outline-none placeholder:text-gray-600"
                  />

                  {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
                </div>
              </div>

              {/* RELLENO — llena el espacio que deja libre el largo desigual
                  con "Tu tatuaje" (que tiene una foto de más). Mismo rol que
                  la card azul en SolicitarRecogida.jsx de Eljach. */}
              <div className="mt-6 flex-1 min-h-[110px] bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-red-600/10" />
                <h3 className="relative text-white text-lg font-black uppercase italic mb-2">
                  ¿Ya tienes una idea en mente?
                </h3>
                <p className="relative text-gray-400 text-[13px] leading-relaxed">
                  Cada proyecto empieza con una buena conversación. Cuéntame qué quieres tatuarte
                  y trabajemos juntos en una pieza que se vea tan bien en años como el día que saliste del estudio.
                </p>
              </div>
            </div>

            {/* 3 — TU TATUAJE (a la derecha, más larga por la foto) */}
            <div className="lg:col-span-2 lg:pl-8 pt-8 lg:pt-0 space-y-4">
              <ColHead n="3" title="Tu tatuaje" sub="Tamaño, zona y diseño" />

              <select
                value={form.size}
                onChange={e => { update('size', e.target.value); setSelectedDate(null) }}
                required
                className="w-full bg-zinc-900 border border-gray-700 text-white p-3.5 rounded outline-none"
              >
                <option value="">¿Tamaño aproximado? *</option>
                <option value="Pequeño">Pequeño</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
              </select>

              <select
                value={form.location}
                onChange={e => update('location', e.target.value)}
                required
                className="w-full bg-zinc-900 border border-gray-700 text-white p-3.5 rounded outline-none"
              >
                <option value="">¿Zona del cuerpo? *</option>
                <option value="Brazo">Brazo</option>
                <option value="Pierna">Pierna</option>
                <option value="Pecho">Pecho</option>
                <option value="Espalda">Espalda</option>
                <option value="Otra">Otra</option>
              </select>

              {form.location === 'Otra' && (
                <input
                  type="text"
                  value={form.locationOtro}
                  onChange={e => update('locationOtro', e.target.value)}
                  placeholder="¿Qué zona? *"
                  required
                  className="w-full bg-zinc-900 border border-gray-700 text-white p-3.5 rounded outline-none placeholder:text-gray-600"
                />
              )}

              <input
                type="text"
                value={form.design}
                onChange={e => update('design', e.target.value)}
                placeholder="Describe brevemente la idea *"
                required
                className="w-full bg-zinc-900 border border-gray-700 text-white p-3.5 rounded outline-none placeholder:text-gray-600"
              />

              {/* FOTO DE REFERENCIA — obligatoria: es la que nos permite dar un
                  precio exacto sin tener que pedirla después. Sube directo a
                  Cloudinary desde el navegador del cliente. */}
              <div>
                {refImagePreview ? (
                  <div className="relative inline-block">
                    <img src={refImagePreview} alt="Referencia" className="h-24 w-24 object-cover rounded border border-gray-700" />
                    {subiendoImagen && (
                      <div className="absolute inset-0 bg-black/60 rounded flex items-center justify-center text-[10px] text-gray-300">Subiendo...</div>
                    )}
                    <button
                      type="button"
                      onClick={quitarImagen}
                      className="absolute -top-2 -right-2 bg-zinc-800 border border-gray-600 rounded-full p-1 hover:bg-zinc-700"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="w-full flex items-center justify-center gap-2 bg-zinc-900 border border-dashed border-gray-700 text-gray-500 p-3.5 rounded cursor-pointer hover:border-gray-500 hover:text-gray-400 transition-colors">
                    <ImagePlus size={16} />
                    <span className="text-sm">Agregar foto de referencia *</span>
                    <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                  </label>
                )}
                {errorImagen && <p className="text-red-500 text-xs mt-1">{errorImagen}</p>}
              </div>
            </div>
          </div>

          {/* CIERRE — disclaimer + submit, mismo patrón de barra inferior que
              Eljach (texto a la izquierda, botón a la derecha en desktop). */}
          <div className="mt-8 pt-7 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-5">
            <p className="text-gray-600 text-[11px] text-center md:text-left leading-relaxed max-w-sm">
              Esto reserva tu fecha — el precio y el anticipo se confirman contigo directamente después.
            </p>
            <button
              type="submit"
              disabled={estado === 'enviando' || subiendoImagen || !formCompleto}
              className="w-full md:w-auto flex-shrink-0 bg-green-600 text-white font-black py-4 px-10 rounded uppercase tracking-widest hover:bg-green-500 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {estado === 'enviando' ? 'Enviando...' : subiendoImagen ? 'Subiendo imagen...' : 'Enviar solicitud de cita'}
            </button>
          </div>

          <div className="pt-5 mt-5 border-t border-gray-800 text-center">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-green-500 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <FaWhatsapp size={14} />
              Prefiero coordinarlo por WhatsApp
            </a>
          </div>

        </form>
      </div>
    </section>
  )
}
