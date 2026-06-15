import { Link } from 'react-router-dom'
import { CalendarCheck, Droplets } from 'lucide-react'

export default function CuidadosTeaser() {
  return (
    <section id="cuidados" className="pt-12 md:pt-24 pb-6 md:pb-12 px-4 bg-black border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center">

        <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-4">
          Cuida tu <span className="text-zinc-600">Tatuaje</span>
        </h2>
        <p className="text-gray-400 font-light max-w-xl mx-auto mb-12">
          Tu tatuaje merece el mismo cuidado que su diseño.
          Sigue estas recomendaciones antes y después de tu sesión.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <Link
            to="/cuidados#antes"
            className="group bg-black/40 border border-zinc-800 rounded-xl p-8 hover:border-zinc-600 hover:bg-black/60 transition-all duration-300"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300 mb-5 group-hover:scale-110 transition-transform">
              <CalendarCheck size={24} />
            </div>
            <h3 className="text-white font-black uppercase tracking-widest mb-3">
              Antes de tu sesión
            </h3>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              Descanso, hidratación y cómo preparar tu piel para llegar en óptimas condiciones.
            </p>
          </Link>

          <Link
            to="/cuidados#despues"
            className="group bg-black/40 border border-zinc-800 rounded-xl p-8 hover:border-zinc-600 hover:bg-black/60 transition-all duration-300"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300 mb-5 group-hover:scale-110 transition-transform">
              <Droplets size={24} />
            </div>
            <h3 className="text-white font-black uppercase tracking-widest mb-3">
              Después de tu sesión
            </h3>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              Limpieza, cicatrización y los errores que debes evitar para que tu tatuaje perdure.
            </p>
          </Link>
        </div>

        <Link
          to="/cuidados"
          className="inline-block px-10 py-4 rounded bg-zinc-600 text-white font-black text-sm uppercase tracking-widest hover:bg-green-500 transition-all transform hover:-translate-y-1 shadow-lg"
        >
          Ver todos los cuidados
        </Link>

      </div>
    </section>
  )
}
