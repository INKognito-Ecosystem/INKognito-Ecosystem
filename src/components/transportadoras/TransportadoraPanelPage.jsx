import { useState } from 'react'
import { useLoaderData, useSearchParams } from 'react-router-dom'
import { Mail, Camera, LoaderCircle, Package, MapPin, Check } from 'lucide-react'
import ZonasCoberturaCheckboxes from './ZonasCoberturaCheckboxes'
import { ZONAS_FLETE } from '../../data/colombiaGeo'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#0057D9'
const inputClass = 'w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors'
const labelClass = 'text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block'

// Panel de la transportadora — "Ruta del Golfo" (2026-08-30). A diferencia
// de EstudioTiendaPage.jsx (catálogo público + panel de dueño fusionados),
// una transportadora no tiene página pública que nadie navega — esta
// página ES directamente su panel privado, sin dualidad público/dueño ni
// slug. Estructura de loader (token en la URL -> perfil, o formulario
// para pedir el link) calcada de EstudioEditarPerfilPage.jsx.
export async function loader({ request }) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token) return { token: null }
  try {
    const res = await fetch(`${PANEL_URL}/api/transportadoras-por-token?token=${encodeURIComponent(token)}`)
    if (!res.ok) return { token, transportadora: null, error: 'Este link ya no es válido — pídelo de nuevo.' }
    const transportadora = await res.json()
    const enviosRes = await fetch(`${PANEL_URL}/api/transportadoras-envios-por-token?token=${encodeURIComponent(token)}`)
    const envios = enviosRes.ok ? await enviosRes.json() : []
    return { token, transportadora, envios }
  } catch {
    return { token, transportadora: null, error: 'No pudimos cargar tu panel — intenta de nuevo en un momento.' }
  }
}

export function meta() {
  return [{ title: 'Mi panel | Ruta del Golfo' }]
}

function PedirLinkForm() {
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setEnviando(true)
    try {
      await fetch(`${PANEL_URL}/api/transportadoras-solicitar-edicion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {
      // mismo mensaje de éxito aunque falle — no revela si un correo existe
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
          Si <strong>{email}</strong> tiene un registro con correo confirmado, te mandamos un link para entrar.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-xl font-black uppercase mb-2 text-center">Mi panel</h1>
      <p className="text-gray-500 text-sm text-center mb-6">
        Escribe el correo con el que te registraste — te mandamos un link para entrar, sin contraseña.
      </p>
      <form onSubmit={enviar} className="space-y-3">
        <input required type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" />
        <button type="submit" disabled={enviando} className="w-full py-3 text-white font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 text-sm" style={{ backgroundColor: ACCENT }}>
          {enviando ? 'Enviando...' : 'Mandarme el link'}
        </button>
      </form>
    </div>
  )
}

function PerfilSection({ token, transportadora, onSaved }) {
  const [form, setForm] = useState({
    nombre: transportadora.nombre || '', whatsapp: transportadora.whatsapp || '',
    bio: transportadora.bio || '', logo_url: transportadora.logo_url || '',
    municipio: transportadora.municipio || '',
    zonas_cobertura: transportadora.zonas_cobertura || [],
  })
  const [subiendo, setSubiendo] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [error, setError] = useState(null)

  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))

  const subirFoto = async (file) => {
    if (!file) return
    setSubiendo(true)
    try {
      const configRes = await fetch(`${PANEL_URL}/api/upload-config`)
      const { cloud_name, upload_preset } = await configRes.json()
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', upload_preset)
      fd.append('folder', 'inkognito-transportadoras')
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) setForm((f) => ({ ...f, logo_url: data.secure_url }))
    } catch {
      setError('No pudimos subir esa foto — intenta de nuevo.')
    } finally {
      setSubiendo(false)
    }
  }

  const guardar = async (e) => {
    e.preventDefault()
    setError(null)
    setGuardando(true)
    try {
      const res = await fetch(`${PANEL_URL}/api/transportadoras-editar-por-token`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...form }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setGuardado(true)
      setTimeout(() => setGuardado(false), 2500)
      onSaved?.(data)
    } catch {
      setError('No pudimos guardar los cambios — intenta de nuevo en un momento.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16 rounded-full bg-gray-100 border border-gray-300 overflow-hidden flex-shrink-0">
          {form.logo_url ? <img src={form.logo_url} alt="" className="w-full h-full object-cover" /> : <Camera size={18} className="absolute inset-0 m-auto text-gray-400" />}
          {subiendo && <LoaderCircle size={16} className="animate-spin absolute inset-0 m-auto text-gray-600" />}
          <input type="file" accept="image/*" onChange={(e) => subirFoto(e.target.files?.[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Nombre de la empresa</label>
        <input className={inputClass} value={form.nombre} onChange={set('nombre')} />
      </div>
      <div>
        <label className={labelClass}>WhatsApp</label>
        <input className={inputClass} value={form.whatsapp} onChange={set('whatsapp')} />
      </div>
      <div>
        <label className={labelClass}>Municipio de tu empresa</label>
        <select className={inputClass} value={form.municipio} onChange={set('municipio')}>
          <option value="">Selecciona...</option>
          {Object.entries(ZONAS_FLETE).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>Zonas que cubres</label>
        <ZonasCoberturaCheckboxes value={form.zonas_cobertura} onChange={(zonas) => setForm((f) => ({ ...f, zonas_cobertura: zonas }))} />
      </div>
      <div>
        <label className={labelClass}>Bio</label>
        <textarea rows={3} className={inputClass} value={form.bio} onChange={set('bio')} />
      </div>

      {!transportadora.activo && (
        <p className="text-amber-600 text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">Tu registro está pendiente de revisión — cuando lo activemos, empezarás a ver envíos asignados acá.</p>
      )}
      {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      <button
        type="button"
        onClick={guardar}
        disabled={guardando}
        className="w-full py-3.5 text-white font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 text-sm"
        style={{ backgroundColor: ACCENT }}
      >
        {guardando ? 'Guardando...' : guardado ? '✓ Guardado' : 'Guardar cambios'}
      </button>
    </div>
  )
}

const SIGUIENTE_ESTADO = { asignado: 'recogido', recogido: 'entregado' }
const LABEL_ACCION = { asignado: '📦 Recogí el paquete', recogido: '✅ Entregado al cliente' }

function EnviosSection({ token, envios: enviosIniciales }) {
  const [envios, setEnvios] = useState(enviosIniciales || [])
  const [actualizando, setActualizando] = useState(null)

  const avanzar = async (envio) => {
    const nuevoEstado = SIGUIENTE_ESTADO[envio.estado]
    if (!nuevoEstado) return
    setActualizando(envio.id)
    try {
      const res = await fetch(`${PANEL_URL}/api/transportadoras-envios-estado-por-token`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, envio_id: envio.id, estado: nuevoEstado }),
      })
      if (res.ok) setEnvios((prev) => prev.map((e) => e.id === envio.id ? { ...e, estado: nuevoEstado } : e))
    } finally {
      setActualizando(null)
    }
  }

  if (!envios.length) {
    return <p className="text-gray-400 text-sm text-center py-10">Todavía no tienes envíos asignados.</p>
  }

  return (
    <div className="space-y-3">
      {envios.map((e) => (
        <div key={e.id} className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <p className="text-gray-400 text-[10px] uppercase tracking-wide">Pedido #{e.id}</p>
            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full flex-shrink-0 ${
              e.estado === 'entregado' ? 'bg-green-100 text-green-700' : e.estado === 'recogido' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
            }`}>{e.estado}</span>
          </div>

          <div className="flex items-start gap-1.5 text-gray-700 text-xs mb-2.5">
            <MapPin size={12} className="flex-shrink-0 mt-0.5 text-gray-400" />
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">Recoger en · {e.tienda_nombre_display}</p>
              <p className="truncate">{e.tienda_direccion || 'Sin dirección — coordina por WhatsApp'}, {ZONAS_FLETE[e.municipio_origen] || e.municipio_origen}</p>
            </div>
          </div>
          <div className="flex items-start gap-1.5 text-gray-700 text-xs mb-2.5">
            <MapPin size={12} className="flex-shrink-0 mt-0.5 text-gray-400" />
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">Entregar a · {e.cliente_nombre || 'Cliente'} · {e.cliente_telefono}</p>
              <p className="truncate">{e.cliente_direccion || 'Sin dirección — coordina por WhatsApp'}, {ZONAS_FLETE[e.municipio_destino] || e.municipio_destino}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 text-xs mb-3">
            <Package size={12} className="flex-shrink-0" />
            Flete: ${Number(e.monto_flete).toLocaleString('es-CO')}
          </div>
          {SIGUIENTE_ESTADO[e.estado] && (
            <button
              type="button"
              onClick={() => avanzar(e)}
              disabled={actualizando === e.id}
              className="w-full py-2.5 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ backgroundColor: ACCENT }}
            >
              {actualizando === e.id ? 'Actualizando...' : LABEL_ACCION[e.estado]}
            </button>
          )}
          {e.estado === 'entregado' && (
            <p className="text-center text-green-600 text-xs font-bold flex items-center justify-center gap-1"><Check size={12} /> Entregado</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default function TransportadoraPanelPage() {
  const loaderData = useLoaderData()
  const [searchParams] = useSearchParams()
  const [transportadora, setTransportadora] = useState(loaderData.transportadora)
  const { token, envios, error } = loaderData
  const [vista, setVista] = useState('envios')

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <div className="border-b border-gray-200 px-4 py-4 text-center">
        <p className="font-black uppercase tracking-[0.15em] text-sm" style={{ color: ACCENT }}>Ruta del Golfo</p>
      </div>

      <div className="flex-1 pt-8 max-w-md mx-auto px-4 pb-16 w-full">
        {!token || !transportadora ? (
          <>
            {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
            <PedirLinkForm />
          </>
        ) : (
          <>
            {searchParams.get('bienvenida') === '1' && (
              <p className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4 text-center">¡Correo confirmado! Tu registro está en revisión.</p>
            )}
            <div className="flex border-b border-gray-200 mb-5">
              <button type="button" onClick={() => setVista('envios')} className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest ${vista === 'envios' ? 'border-b-2' : 'text-gray-400'}`} style={vista === 'envios' ? { borderColor: ACCENT, color: ACCENT } : {}}>
                Mis envíos
              </button>
              <button type="button" onClick={() => setVista('perfil')} className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest ${vista === 'perfil' ? 'border-b-2' : 'text-gray-400'}`} style={vista === 'perfil' ? { borderColor: ACCENT, color: ACCENT } : {}}>
                Mi perfil
              </button>
            </div>
            {vista === 'envios'
              ? <EnviosSection token={token} envios={envios} />
              : <PerfilSection token={token} transportadora={transportadora} onSaved={(nuevo) => setTransportadora((t) => ({ ...t, ...nuevo }))} />
            }
          </>
        )}
      </div>

      <footer className="border-t border-gray-200 py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-400 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} Ruta del Golfo — Todos los derechos reservados.</p>
          <span className="text-gray-300">Desarrollado por INKognito</span>
        </div>
      </footer>
    </div>
  )
}
