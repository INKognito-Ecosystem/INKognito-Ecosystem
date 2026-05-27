import { Link } from 'react-router-dom'
import ecosystemBg from '../assets/ecosystem/ecosystem-bg.jpg'

export default function InkognitoHome() {

  return (

    <section className="relative min-h-screen bg-black text-white flex flex-col items-center jusfy-cetinter px-6 overflow-hidden">

      {/* FONDO */}
      <img
        src={ecosystemBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />

      {/* OVERLAY OSCURO */}
      <div className="absolute inset-0 bg-black/60"></div>
      

      {/* CONTENIDO */}
      <div className="relative z-10 flex flex-col items-center w-full">

        <h1 className="text-5xl sm:text-6xl md:text-9xl font-black uppercase italic tracking-[0.12em] text-center">

  <span className="text-white">
    INK
  </span>

  <span className="text-zinc-300">
    OGNITO
  </span>

</h1>

        <p className="mt-2 mb-10 text-zinc-300 uppercase tracking-[0.5em] text-sm md:text-base font-semibold text-center">

          Disciplina • Arte • Identidad

        </p>
<p className="text-white uppercase tracking-[0.45em] text-sm text-center mb-10 font-medium">
  SELECT MODULE
</p>
        <div className="flex flex-col gap-6 w-full max-w-md">

          <Link
            to="/tattoo"
            className="w-full py-5 bg-zinc-700 rounded text-center uppercase tracking-[0.3em] font-black hover:bg-red-600 transition-all duration-300"
          >
            Tattoo Studio
          </Link>

       <Link
        to="/supply"
            className="w-full py-5 bg-zinc-700 rounded text-center uppercase tracking-[0.3em] font-black hover:bg-blue-600 transition-all duration-300"
>
           Tattoo Supply
       </Link>

          <button
            className="w-full py-5 bg-zinc-900 border border-zinc-700 rounded uppercase tracking-[0.3em] font-black text-zinc-500"
          >
            Store
          </button>

          <button
            className="w-full py-5 bg-zinc-900 border border-zinc-700 rounded uppercase tracking-[0.3em] font-black text-zinc-500"
          >
            Gym
          </button>

        </div>

      </div>
{/* COPYRIGHT */}
<div className="absolute bottom-2 left-0 w-full text-center z-10">

  <p className="text-zinc-600 text-xs tracking-widest uppercase">
    © 2026 INKOGNITO. Todos los derechos reservados.
  </p>

</div>
    </section>

  )
}