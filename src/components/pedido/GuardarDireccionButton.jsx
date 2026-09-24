import { useState } from 'react'
import { MapPin, X, Check } from 'lucide-react'
import { DEPARTAMENTOS, MUNICIPIOS_POR_DEPARTAMENTO } from '../../data/colombiaGeo'
import ComboboxBuscable from '../artistas/ComboboxBuscable'
import { leerDireccionGuardada, guardarDireccion } from '../../utils/direccionGuardada'

const inputClass = 'w-full bg-zinc-50 border border-zinc-300 text-zinc-900 p-3 rounded-lg outline-none placeholder:text-zinc-400 focus:border-zinc-500 text-sm'

const VACIO = { nombre: '', telefono: '', email: '', departamento: '', municipio: '', direccion: '' }

// Botón "Guardar mi dirección" (2026-09-23, Jose) — vive arriba de "Todos
// los productos" en los 3 carritos (Store/Suple/Supply). Guardar una vez
// acá precarga el checkout de los 3 módulos (ver PedidoSupplyVendorCheckout.jsx)
// sin volver a escribirla — sin cuenta, guardada en el navegador (ver
// utils/direccionGuardada.js).
// `dark` — CartDrawerSupply es el único de los 3 carritos que todavía
// alterna tema (los demás ya son blancos) — sin esto el borde inferior
// quedaba claro sobre un fondo oscuro.
export default function GuardarDireccionButton({ dark = false }) {
  const [guardada, setGuardada] = useState(() => leerDireccionGuardada())
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(VACIO)

  const abrir = () => {
    setForm(guardada ? { ...VACIO, ...guardada } : VACIO)
    setOpen(true)
  }

  const set = (campo) => (valor) => setForm(f => ({ ...f, [campo]: valor }))
  const setDepartamento = (nuevo) => setForm(f => ({ ...f, departamento: nuevo, municipio: '' }))
  const municipiosDisponibles = MUNICIPIOS_POR_DEPARTAMENTO[form.departamento] || []

  const completo = Boolean(form.telefono.trim() && form.email.trim() && form.departamento && form.municipio && form.direccion.trim())

  const guardar = (e) => {
    e.preventDefault()
    if (!completo) return
    guardarDireccion(form)
    setGuardada(form)
    setOpen(false)
  }

  return (
    <>
      {guardada ? (
        <button
          type="button"
          onClick={abrir}
          className={`flex items-center gap-2.5 px-6 py-3 border-b flex-shrink-0 w-full bg-green-50 hover:bg-green-100 transition-colors ${dark ? 'border-zinc-800' : 'border-zinc-200'}`}
        >
          <span className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
            <Check size={11} className="text-white" strokeWidth={3} />
          </span>
          <span className="text-xs font-semibold text-green-800 truncate min-w-0 flex-1 text-left">
            {guardada.direccion}, {guardada.municipio}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wide text-green-700 flex-shrink-0">Editar</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={abrir}
          className={`flex items-center gap-2.5 px-6 py-3 border-b flex-shrink-0 w-full bg-green-600 hover:bg-green-700 transition-colors ${dark ? 'border-zinc-800' : 'border-zinc-200'}`}
        >
          <MapPin size={15} className="text-white flex-shrink-0" />
          <span className="text-xs font-bold text-white">Guardar mi dirección</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <form onSubmit={guardar} className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-gray-900">Tu dirección</h3>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" className="text-zinc-400 hover:text-zinc-700">
                <X size={20} />
              </button>
            </div>
            <input type="text" value={form.nombre} onChange={e => set('nombre')(e.target.value)} placeholder="Tu nombre" className={inputClass} />
            <input type="tel" value={form.telefono} onChange={e => set('telefono')(e.target.value)} placeholder="Tu WhatsApp o teléfono *" required className={inputClass} />
            <input type="email" value={form.email} onChange={e => set('email')(e.target.value)} placeholder="Tu correo *" required className={inputClass} />
            <div className="grid grid-cols-2 gap-2">
              <ComboboxBuscable value={form.departamento} onChange={setDepartamento} options={DEPARTAMENTOS} placeholder="Departamento *" inputClassName={inputClass} />
              <ComboboxBuscable value={form.municipio} onChange={set('municipio')} options={municipiosDisponibles} disabled={!form.departamento} placeholder={form.departamento ? 'Municipio *' : 'Elige depto.'} inputClassName={inputClass} />
            </div>
            <input type="text" value={form.direccion} onChange={e => set('direccion')(e.target.value)} placeholder="Dirección exacta — calle, carrera, barrio *" required className={inputClass} />
            <button
              type="submit"
              disabled={!completo}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg text-sm hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Guardar dirección
            </button>
          </form>
        </div>
      )}
    </>
  )
}
