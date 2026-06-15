import { Link } from 'react-router-dom'
import reservaBg from '../../assets/reserva/reserva-bg.webp'

export default function ReservationForm({
  estilo,
  setEstilo,
  zona,
  setZona,
  tamano,
  setTamano,
  imageOpacity = 0.8,
  showBackLink = false,
}) {
  const waMessage = encodeURIComponent(
    `Hola Jose, quiero cotizar un tatuaje.\n\n• Estilo: ${estilo}\n• Zona: ${zona}\n• Tamaño: ${tamano}`
  )

  return (
    <section
      id="contacto"
      className="relative py-12 md:py-24 px-4 overflow-hidden bg-black border-t border-white/5"
    >
      <img
        src={reservaBg}
        alt=""
        loading="lazy"
        fetchpriority="low"
        style={{ opacity: imageOpacity }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {imageOpacity >= 0.5 && <div className="absolute inset-0 bg-black/70" />}

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-8">
          Reserva tu <span className="text-zinc-600">Lugar</span>
        </h2>

        <div className="max-w-md mx-auto bg-black p-8 rounded-xl border border-gray-800 space-y-5">
          <p className="text-gray-300 text-center text-sm">
            Completa esto antes de reservar tu cita
          </p>

          <select
            value={estilo}
            onChange={(e) => setEstilo(e.target.value)}
            className="w-full bg-zinc-900 border border-gray-700 text-white p-4 rounded outline-none"
          >
            <option value="">¿Qué estilo buscas?</option>
            <option value="Realismo">Realismo</option>
            <option value="Línea fina">Línea fina</option>
            <option value="Blackwork">Blackwork</option>
            <option value="Otro">Otro</option>
          </select>

          <select
            value={zona}
            onChange={(e) => setZona(e.target.value)}
            className="w-full bg-zinc-900 border border-gray-700 text-white p-4 rounded outline-none"
          >
            <option value="">¿Zona del cuerpo?</option>
            <option value="Brazo">Brazo</option>
            <option value="Pierna">Pierna</option>
            <option value="Pecho">Pecho</option>
            <option value="Espalda">Espalda</option>
          </select>

          <select
            value={tamano}
            onChange={(e) => setTamano(e.target.value)}
            className="w-full bg-zinc-900 border border-gray-700 text-white p-4 rounded outline-none"
          >
            <option value="">¿Tamaño aproximado?</option>
            <option value="Pequeño">Pequeño</option>
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
          </select>

          <a
            href={`https://wa.me/573207911013?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-zinc-600 text-white font-black py-4 rounded uppercase tracking-widest hover:bg-green-500 transition-all duration-300 text-center"
          >
            Continuar por WhatsApp
          </a>
        </div>

        {showBackLink && (
          <div className="mt-10">
            <Link
              to="/jhumaneztattoo"
              className="px-10 py-4 rounded bg-zinc-600 text-white font-black text-sm uppercase tracking-widest hover:bg-green-500 transition-all transform hover:-translate-y-1 text-center shadow-lg"
            >
              Inicio
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
