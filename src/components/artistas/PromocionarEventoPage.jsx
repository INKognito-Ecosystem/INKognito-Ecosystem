import { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import {
  Award, GraduationCap, Calendar, MapPin, ShieldCheck, CheckCircle2,
  ImagePlus, LoaderCircle, ArrowLeft, X, Briefcase, Building2, Mail,
} from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'
import ComboboxBuscable from './ComboboxBuscable'
import { DEPARTAMENTOS, MUNICIPIOS_POR_DEPARTAMENTO } from '../../data/colombiaGeo'
import { cloudinaryFill } from '../../lib/cloudinary'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const ACCENT = '#B3202F'

export function meta() {
  return [
    { title: 'Promocionar Convención o Seminario | Tattoo Artist Colombia — INK' },
    { name: 'description', content: 'Solicita difusión oficial, alianza de patrocinio o venta aliada para tu convención, expo o seminario de tatuaje en INKognito Ecosystem.' },
  ]
}

const MODALIDADES_ALIANZA = [
  {
    key: 'pauta_destacada',
    titulo: 'Difusión destacada (Pauta en INK + Supply)',
    desc: 'Publicación oficial fijada en Novedades de INK + tira publicitaria (imagen o GIF) visible en INKognito Supply.',
  },
  {
    key: 'patrocinio_media',
    titulo: 'Alianza de Patrocinio (Media Partner)',
    desc: 'Difusión en INK y Supply a cambio de presencia de marca INKognito, menciones o stand en el evento.',
  },
  {
    key: 'comision_boleteria',
    titulo: 'Comisión por boletería o stands',
    desc: 'Modelo comercial con enlace rastreable donde INKognito comisiona por cada boleta o stand vendido.',
  },
  {
    key: 'paquete_integral',
    titulo: 'Paquete integral (Patrocinio + Difusión + Boletería)',
    desc: 'Cobertura completa en INK + Supply para convenciones de gran formato o giras nacionales.',
  },
]

const AFOROS_CONVENCION = [
  'Menos de 500 asistentes',
  '500 – 2.000 asistentes',
  '2.000 – 5.000 asistentes',
  'Más de 5.000 asistentes',
]

const AFOROS_SEMINARIO = [
  '10 – 25 cupos',
  '25 – 60 cupos',
  '60 – 150 cupos',
  'Más de 150 cupos / Online',
]

const EDICIONES = [
  'Primera edición',
  '2ª a 4ª edición',
  '5ª edición o superior',
  'Gira / Edición especial',
]

export default function PromocionarEventoPage() {
  const [searchParams] = useSearchParams()
  const tipoInicial = searchParams.get('tipo') === 'seminario' ? 'seminario' : 'convencion'

  const [form, setForm] = useState({
    tipo: tipoInicial,
    nombre_evento: '',
    edicion: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    departamento: '',
    municipio: '',
    recinto: '',
    aforo_estimado: '',
    instagram_url: '',
    boleteria_url: '',
    flyer_url: '',
    banner_url: '',
    modalidad_alianza: 'pauta_destacada',
    propuesta_comercial: '',
    organizador_nombre: '',
    organizador_cargo: '',
    organizacion: '',
    organizador_email: '',
    organizador_telefono: '',
    acepta_bioseguridad: false,
  })

  const [subiendoFlyer, setSubiendoFlyer] = useState(false)
  const [subiendoBanner, setSubiendoBanner] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const [enviadoId, setEnviadoId] = useState(null)
  const fileRef = useRef(null)
  const bannerFileRef = useRef(null)

  const set = (campo) => (e) => setForm(f => ({ ...f, [campo]: e.target.value }))
  const municipiosDisponibles = form.departamento ? (MUNICIPIOS_POR_DEPARTAMENTO[form.departamento] || []) : []
  const aforosOpciones = form.tipo === 'seminario' ? AFOROS_SEMINARIO : AFOROS_CONVENCION

  const subirPieza = async (file, campo) => {
    if (!file) return
    const setLoad = campo === 'banner_url' ? setSubiendoBanner : setSubiendoFlyer
    setLoad(true)
    setError(null)
    try {
      const cfgRes = await fetch(`${PANEL_URL}/api/upload-config`)
      if (!cfgRes.ok) throw new Error('No se pudo preparar la subida de la pieza.')
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
      setForm(f => ({ ...f, [campo]: upData.secure_url }))
    } catch (err) {
      setError(err.message || 'Error subiendo la imagen.')
    } finally {
      setLoad(false)
    }
  }

  const enviarSolicitud = async (e) => {
    e.preventDefault()
    setError(null)
    if (form.descripcion.trim().length < 20) {
      setError('Describe brevemente el evento, categorías o temario (mínimo 20 caracteres).')
      return
    }
    if (!form.departamento || !form.municipio) {
      setError('Selecciona el departamento y municipio donde se realizará el evento.')
      return
    }
    if (!form.acepta_bioseguridad) {
      setError('Debes confirmar la declaración de representación y cumplimiento de normas sanitarias.')
      return
    }
    setEnviando(true)
    try {
      const res = await fetch(`${PANEL_URL}/api/eventos-solicitud`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No pudimos registrar tu solicitud.')
      setEnviadoId(data.id || 'OK')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message || 'Ocurrió un error al enviar la solicitud. Intenta de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-stone-600 transition-colors'
  const labelClass = 'block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5'

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavbarArtistas />

      <main className="flex-1 pt-20 md:pt-24 pb-10 px-4 md:px-6 max-w-2xl mx-auto w-full">
        <Link
          to="/tattoo-artist-colombia/novedades"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-800 transition-colors mb-4"
        >
          <ArrowLeft size={13} /> Volver a Novedades
        </Link>

        {enviadoId ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Solicitud registrada · Radicado #{enviadoId}
            </p>
            <h1 className="text-lg sm:text-xl font-black uppercase text-gray-900 mt-1">
              Recibimos tu propuesta para {form.nombre_evento}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-2.5 max-w-md mx-auto leading-relaxed">
              Enviamos una confirmación formal a <strong>{form.organizador_email}</strong>. Nuestro equipo comercial de INKognito Ecosystem revisará la trayectoria, fechas y modalidad de alianza en un plazo de <strong>24 a 48 horas hábiles</strong>.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              <Link
                to="/tattoo-artist-colombia/novedades"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                style={{ backgroundColor: ACCENT }}
              >
                Volver a Novedades
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Encabezado institucional */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-stone-900 via-gray-900 to-black text-white p-5 sm:p-6 mb-6">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-gray-200">
                <ShieldCheck size={11} /> Alianzas comerciales · INKognito Ecosystem
              </span>
              <h1 className="text-lg sm:text-2xl font-black uppercase leading-tight mt-2.5">
                Solicitud oficial de difusión y patrocinio
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 mt-1.5 leading-relaxed">
                Completa este filtro inicial para postular tu convención, expo o seminario en la red nacional de tatuadores y estudios verificados de INK. Revisión formal en 24–48 h hábiles vía correo corporativo.
              </p>
            </div>

            <form onSubmit={enviarSolicitud} className="space-y-6">
              {/* BLOQUE 1: Tipo e identidad del evento */}
              <section className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 sm:p-5 space-y-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-1.5">
                  <Award size={14} className="text-[#B3202F]" /> 1. Identidad del evento
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, tipo: 'convencion', aforo_estimado: '' }))}
                    className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-xs font-black uppercase tracking-wide transition-colors cursor-pointer ${
                      form.tipo === 'convencion'
                        ? 'bg-stone-800 text-white border-stone-800'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Award size={14} /> Convención / Expo
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, tipo: 'seminario', aforo_estimado: '' }))}
                    className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-xs font-black uppercase tracking-wide transition-colors cursor-pointer ${
                      form.tipo === 'seminario'
                        ? 'bg-stone-800 text-white border-stone-800'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <GraduationCap size={14} /> Seminario / Taller
                  </button>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Nombre oficial del evento *</label>
                    <input
                      required
                      maxLength={140}
                      value={form.nombre_evento}
                      onChange={set('nombre_evento')}
                      placeholder={form.tipo === 'seminario' ? 'Ej. Masterclass de Realismo Black & Grey' : 'Ej. Expo Tattoo Medellín 2026'}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Trayectoria / Edición</label>
                    <select value={form.edicion} onChange={set('edicion')} className={inputClass}>
                      <option value="">Selecciona...</option>
                      {EDICIONES.map(ed => <option key={ed} value={ed}>{ed}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Descripción ejecutiva y propuesta de valor *</label>
                  <textarea
                    required
                    rows={4}
                    maxLength={2000}
                    value={form.descripcion}
                    onChange={set('descripcion')}
                    placeholder={
                      form.tipo === 'seminario'
                        ? 'Temario principal, artista(s) ponentes, duración, certificación y perfil de asistentes...'
                        : 'Categorías de competencia, artistas invitados, número estimado de stands, experiencia para el público...'
                    }
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Piezas gráficas flexibles: Flyer principal + Banner horizontal / Tira / GIF */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Flyer principal / Afiche (PNG, JPG, GIF)</label>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => subirPieza(e.target.files?.[0], 'flyer_url')}
                    />
                    {form.flyer_url ? (
                      <div className="relative inline-block">
                        <img
                          src={/\.gif(\?|$)/i.test(form.flyer_url) ? form.flyer_url : cloudinaryFill(form.flyer_url, 300, 360)}
                          alt="Flyer"
                          className="w-28 h-36 object-contain bg-white rounded-xl border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, flyer_url: '' }))}
                          aria-label="Quitar flyer"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={subiendoFlyer}
                        onClick={() => fileRef.current?.click()}
                        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-gray-300 bg-white text-xs font-bold text-gray-600 hover:border-stone-500 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {subiendoFlyer ? <LoaderCircle size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                        {subiendoFlyer ? 'Subiendo...' : 'Subir afiche / GIF'}
                      </button>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1">Ideal vertical 4:5 o cuadrado 1:1 para tarjeta en Novedades.</p>
                  </div>

                  <div>
                    <label className={labelClass}>Banner horizontal / Tira o GIF (INK + Supply)</label>
                    <input
                      ref={bannerFileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => subirPieza(e.target.files?.[0], 'banner_url')}
                    />
                    {form.banner_url ? (
                      <div className="relative inline-block w-full">
                        <img
                          src={form.banner_url}
                          alt="Banner horizontal"
                          className="w-full max-h-24 object-contain bg-white rounded-xl border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, banner_url: '' }))}
                          aria-label="Quitar banner"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={subiendoBanner}
                        onClick={() => bannerFileRef.current?.click()}
                        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-gray-300 bg-white text-xs font-bold text-gray-600 hover:border-stone-500 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {subiendoBanner ? <LoaderCircle size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                        {subiendoBanner ? 'Subiendo...' : 'Subir tira / banner / GIF'}
                      </button>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1">Admite tiras angostas (ej. 1200×300 o 728×90) y GIFs animados sin recorte.</p>
                  </div>
                </div>
              </section>

              {/* BLOQUE 2: Fechas, sede y alcance */}
              <section className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 sm:p-5 space-y-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#B3202F]" /> 2. Fechas, sede y verificación digital
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Fecha de inicio *</label>
                    <input required type="date" value={form.fecha_inicio} onChange={set('fecha_inicio')} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Fecha de cierre (opcional)</label>
                    <input type="date" value={form.fecha_fin} onChange={set('fecha_fin')} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Departamento *</label>
                    <ComboboxBuscable
                      value={form.departamento}
                      onChange={(v) => setForm(f => ({ ...f, departamento: v, municipio: '' }))}
                      options={DEPARTAMENTOS}
                      placeholder="Buscar..."
                      inputClassName={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Municipio / Ciudad *</label>
                    <ComboboxBuscable
                      value={form.municipio}
                      onChange={(v) => setForm(f => ({ ...f, municipio: v }))}
                      options={municipiosDisponibles}
                      disabled={!form.departamento}
                      placeholder="Buscar..."
                      inputClassName={inputClass}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Recinto o sede</label>
                    <input maxLength={140} value={form.recinto} onChange={set('recinto')} placeholder="Ej. Plaza Mayor, Centro de Convenciones..." className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{form.tipo === 'seminario' ? 'Cupos estimados' : 'Aforo estimado'}</label>
                    <select value={form.aforo_estimado} onChange={set('aforo_estimado')} className={inputClass}>
                      <option value="">Selecciona...</option>
                      {aforosOpciones.map(op => <option key={op} value={op}>{op}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Instagram oficial del evento *</label>
                    <input required maxLength={240} value={form.instagram_url} onChange={set('instagram_url')} placeholder="https://instagram.com/tuevento" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Web oficial o link de boletería</label>
                    <input maxLength={300} value={form.boleteria_url} onChange={set('boleteria_url')} placeholder="https://..." className={inputClass} />
                  </div>
                </div>
              </section>

              {/* BLOQUE 3: Modalidad de alianza comercial */}
              <section className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 sm:p-5 space-y-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-1.5">
                  <Briefcase size={14} className="text-[#B3202F]" /> 3. Modalidad de alianza con INKognito
                </p>

                <div className="space-y-2.5">
                  {MODALIDADES_ALIANZA.map((m) => {
                    const sel = form.modalidad_alianza === m.key
                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, modalidad_alianza: m.key }))}
                        className={`w-full text-left rounded-xl border p-3.5 transition-colors cursor-pointer ${
                          sel
                            ? 'border-stone-800 bg-white ring-1 ring-stone-800'
                            : 'border-gray-200 bg-white hover:border-gray-400'
                        }`}
                      >
                        <p className="text-xs font-black uppercase text-gray-900">{m.titulo}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{m.desc}</p>
                      </button>
                    )
                  })}
                </div>

                <div>
                  <label className={labelClass}>Propuesta comercial o contraprestación (opcional)</label>
                  <textarea
                    rows={2}
                    maxLength={1000}
                    value={form.propuesta_comercial}
                    onChange={set('propuesta_comercial')}
                    placeholder="Ej. Presupuesto estimado de pauta, beneficios de patrocinio ofrecidos (stand, logo en tarima), o % de comisión por boletería..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </section>

              {/* BLOQUE 4: Datos del responsable */}
              <section className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 sm:p-5 space-y-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-1.5">
                  <Building2 size={14} className="text-[#B3202F]" /> 4. Organizador responsable
                </p>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Nombre completo *</label>
                    <input required maxLength={120} value={form.organizador_nombre} onChange={set('organizador_nombre')} placeholder="Nombre y apellido" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Cargo / Rol</label>
                    <input maxLength={80} value={form.organizador_cargo} onChange={set('organizador_cargo')} placeholder="Ej. Director general, Productor..." className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Productora, organización o estudio</label>
                  <input maxLength={120} value={form.organizacion} onChange={set('organizacion')} placeholder="Nombre de la empresa o estudio organizador" className={inputClass} />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Correo corporativo / contacto *</label>
                    <input required type="email" maxLength={160} value={form.organizador_email} onChange={set('organizador_email')} placeholder="contacto@tuevento.com" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Teléfono de contacto *</label>
                    <input required maxLength={40} value={form.organizador_telefono} onChange={set('organizador_telefono')} placeholder="Ej. +57 300 000 0000" className={inputClass} />
                  </div>
                </div>

                <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.acepta_bioseguridad}
                    onChange={(e) => setForm(f => ({ ...f, acepta_bioseguridad: e.target.checked }))}
                    className="mt-0.5 accent-stone-800"
                  />
                  <span className="text-[11px] text-gray-600 leading-relaxed">
                    Declaro ser representante autorizado del evento y confirmo que cuenta con los permisos locales y estándares vigentes de bioseguridad. Acepto recibir respuesta formal al correo registrado.
                  </span>
                </label>
              </section>

              {error && (
                <p className="text-xs font-bold text-[#B3202F] bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={enviando || subiendoFlyer || subiendoBanner}
                className="w-full py-3.5 rounded-full text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: ACCENT }}
              >
                {enviando ? <LoaderCircle size={15} className="animate-spin" /> : <Mail size={15} />}
                {enviando ? 'Enviando solicitud...' : 'Enviar solicitud oficial'}
              </button>

              <p className="text-center text-[11px] text-gray-400">
                Canal institucional: <strong>soporte@inkognito-ecosystem.com</strong> · Respuesta en 24–48 h hábiles.
              </p>
            </form>
          </>
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
