import { Link } from 'react-router-dom'
import ecosystemBg from '../../assets/ecosystem/ecosystem-bg.jpg'

export default function ComingSoonPage() {
  return (
    <section className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">

      {/* FONDO */}
      <img
        src={ecosystemBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/70" />

      {/* CONTENIDO */}
      <div className="relative z-10 flex flex-col items-center text-center gap-4 sm:gap-6 w-full max-w-4xl mx-auto">

        <p className="uppercase tracking-[0.4em] sm:tracking-[0.5em] text-zinc-500 text-[10px] sm:text-xs">
          INKognito Ecosystem
        </p>

        <h1
          className="font-black uppercase italic leading-none w-full"
          style={{ fontSize: 'clamp(2.5rem, 12vw, 7rem)', letterSpacing: '-0.02em' }}
        >
          Próximamente
        </h1>

        <p className="text-zinc-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm font-medium max-w-xs sm:max-w-md px-2">
          Estamos trabajando en algo increíble
        </p>

        <div className="h-px w-12 sm:w-16 bg-zinc-700 my-1 sm:my-2" />

        <Link
          to="/"
          className="px-8 sm:px-10 py-3 sm:py-4 bg-zinc-700 rounded uppercase tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm font-black hover:bg-zinc-500 transition-all duration-300"
        >
          Volver al inicio
        </Link>

      </div>

      {/* COPYRIGHT */}
      <div className="absolute bottom-4 w-full text-center z-10 px-4">
        <p className="text-zinc-700 text-[10px] sm:text-xs tracking-widest uppercase">
          © 2026 INKOGNITO. Todos los derechos reservados.
        </p>
      </div>

    </section>
  )
}
