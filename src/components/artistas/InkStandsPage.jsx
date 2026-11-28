import { useState } from 'react'
import { Link } from 'react-router'
import { CalendarRange, Clock, Building2, ShieldCheck, Check, MapPin } from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'

const ACCENT = '#B3202F'

export function meta() {
  return [
    { title: 'Arriendo de Stands en Estudios de Tatuaje | Tattoo Artist Colombia — INK' },
    { name: 'description', content: 'Alquila puestos y cabinas en estudios de tatuajes verificados en Colombia por horas o por días con reserva segura en línea.' },
  ]
}

const MODALIDADES = [
  { key: 'todos', label: 'Todos' },
  { key: 'hora', label: 'Por horas' },
  { key: 'dia', label: 'Por días' },
]

export default function InkStandsPage() {
  const [modalidad, setModalidad] = useState('todos')

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavbarArtistas />

      <main className="flex-1 pt-20 md:pt-24 pb-10 px-4 md:px-6 max-w-3xl mx-auto w-full">
        {/* Cabecera */}
        <div className="mb-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Guest Spot & Booth Rental</p>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-gray-900 flex items-center gap-2 mt-0.5">
            <CalendarRange size={18} className="text-[#B3202F]" />
            Arriendo de Stands
          </h1>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Encuentra puestos y cabinas equipadas en estudios verificados de Colombia. Escoge fecha, horario y tiempo exacto de uso.
          </p>
        </div>

        {/* Filtros por modalidad */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {MODALIDADES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setModalidad(key)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wide border transition-colors cursor-pointer ${
                modalidad === key
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Estado inicial + explicación clara del modelo */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-stone-800 text-white flex items-center justify-center flex-shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <p className="font-black uppercase text-sm text-gray-900 leading-tight">
                Aún no hay stands disponibles en tu zona
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Modalidad activa para estudios verificados: publica tus puestos o cabinas disponibles por horas o por días y recibe reservas pagadas en línea.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            <div className="rounded-xl bg-white border border-gray-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                <MapPin size={12} /> Para tatuadores invitados
              </p>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <Check size={13} className="text-stone-700 flex-shrink-0 mt-0.5" />
                  Elige estudio, fecha, hora de inicio y cantidad de horas o días.
                </li>
                <li className="flex items-start gap-2">
                  <Check size={13} className="text-stone-700 flex-shrink-0 mt-0.5" />
                  Disponibilidad real sin cruces de horario.
                </li>
                <li className="flex items-start gap-2">
                  <Check size={13} className="text-stone-700 flex-shrink-0 mt-0.5" />
                  Reserva asegurada en línea con Mercado Pago (tarifa de servicio fija de $2.000 COP).
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-white border border-gray-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                <Building2 size={12} /> Para estudios de tatuaje
              </p>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <Check size={13} className="text-stone-700 flex-shrink-0 mt-0.5" />
                  Publica tus stands libres con fotos, reglas y tarifas por hora o día.
                </li>
                <li className="flex items-start gap-2">
                  <Check size={13} className="text-stone-700 flex-shrink-0 mt-0.5" />
                  Recibes el 100% de tu tarifa por adelantado directo en tu Mercado Pago.
                </li>
                <li className="flex items-start gap-2">
                  <Check size={13} className="text-stone-700 flex-shrink-0 mt-0.5" />
                  Cero retenciones: sin intermediarios ni cobros que se pierdan.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-2">
            <Link
              to="/tattoo-artist-colombia/estudio/mi-perfil"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
              style={{ backgroundColor: ACCENT }}
            >
              <Building2 size={14} />
              Gestionar mi estudio
            </Link>
            <Link
              to="/tattoo-artist-colombia/estudio/unete"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 bg-white text-gray-700 text-xs font-bold uppercase tracking-widest hover:border-gray-500 transition-colors"
            >
              Registrar mi estudio gratis
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 flex items-center gap-3 text-xs text-gray-500">
          <ShieldCheck size={18} className="text-stone-700 flex-shrink-0" />
          <p className="leading-relaxed">
            Todos los pagos se procesan mediante Mercado Pago conectado a la cuenta verificada de cada estudio.
          </p>
        </div>
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
