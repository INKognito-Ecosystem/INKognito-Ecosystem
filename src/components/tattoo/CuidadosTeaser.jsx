import { Link } from 'react-router-dom'
import { CalendarCheck, Droplets } from 'lucide-react'

export default function CuidadosTeaser() {
  return (
    <section id="cuidados" className="pt-8 md:pt-14 pb-6 md:pb-10 px-4 bg-black border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center">

        <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-4">
          Cuida tu <span className="text-zinc-600">Tatuaje</span>
        </h2>
        <p className="text-gray-400 font-light max-w-xl mx-auto mb-8">
          Tu tatuaje merece el mismo cuidado que su diseño.
          Sigue estas recomendaciones antes y después de tu sesión.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          <Link
            to="/cuidados#antes"
            className="group bg-black/40 border border-zinc-800 rounded-xl p-4 sm:p-8 hover:border-zinc-600 hover:bg-black/60 transition-all duration-300"
          >
            <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300 mb-3 sm:mb-5 group-hover:scale-110 transition-transform">
              <CalendarCheck size={20} className="sm:hidden" />
              <CalendarCheck size={24} className="hidden sm:block" />
            </div>
            <h3 className="text-white font-black uppercase tracking-widest mb-2 sm:mb-3 text-sm sm:text-base">
              Antes
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
              Descanso, hidratación y cómo preparar tu piel para llegar en óptimas condiciones.
            </p>
          </Link>

          <Link
            to="/cuidados#despues"
            className="group bg-black/40 border border-zinc-800 rounded-xl p-4 sm:p-8 hover:border-zinc-600 hover:bg-black/60 transition-all duration-300"
          >
            <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300 mb-3 sm:mb-5 group-hover:scale-110 transition-transform">
              <Droplets size={20} className="sm:hidden" />
              <Droplets size={24} className="hidden sm:block" />
            </div>
            <h3 className="text-white font-black uppercase tracking-widest mb-2 sm:mb-3 text-sm sm:text-base">
              Después
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
              Limpieza, cicatrización y los errores que debes evitar para que tu tatuaje perdure.
            </p>
          </Link>
        </div>

      </div>
    </section>
  )
}
