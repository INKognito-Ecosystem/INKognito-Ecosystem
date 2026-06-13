import EcosystemNavbar from './EcosystemNavbar'
import { Link } from 'react-router-dom'
import ecosystemBg from '../../assets/ecosystem/ecosystem-bg.jpg'
import Seo from '../Seo'
import ogLogo from '../../assets/ecosystem/logo.png'

export default function InkognitoHome() {
  return (
    <section className="relative min-h-screen bg-black text-white flex flex-col items-center px-6 overflow-hidden">

      <Seo
        title="INKognito Ecosystem"
        description="Ecosistema de servicios en Urabá, Antioquia: tatuajes, insumos para tatuadores y tienda deportiva."
        image={ogLogo}
        noindex={true}
      />

      {/* NAVBAR */}
      <EcosystemNavbar />

      {/* FONDO */}
      <img
        src={ecosystemBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />

      {/* OVERLAY OSCURO */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* CONTENIDO — ocupa todo el espacio disponible entre navbar y copyright */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full flex-1 py-20">

        <h1 className="text-5xl sm:text-6xl md:text-9xl font-black uppercase italic tracking-[0.12em] text-center">
          <span className="text-white">INK</span>
          <span className="text-zinc-300">OGNITO</span>
        </h1>

        <p className="mt-2 mb-10 text-zinc-300 uppercase tracking-[0.5em] text-sm md:text-base font-semibold text-center">
          Disciplina • Arte • Identidad
        </p>

        <p className="text-white uppercase tracking-[0.45em] text-sm text-center mb-10 font-medium">
          Select Module
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

          <Link
            to="/store"
            className="w-full py-5 bg-zinc-700 rounded text-center uppercase tracking-[0.3em] font-black transition-all duration-300"
            style={{ color: 'white' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C9A84C'; e.currentTarget.style.color = '#000' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#3f3f46'; e.currentTarget.style.color = '#fff' }}
          >
            Store
          </Link>

          <button className="w-full py-5 bg-zinc-900 border border-zinc-700 rounded uppercase tracking-[0.3em] font-black text-zinc-500">
            Gym
          </button>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="relative z-10 w-full text-center pb-4">
        <p className="text-zinc-600 text-xs tracking-widest uppercase">
          © 2026 INKOGNITO. Todos los derechos reservados.
        </p>
      </div>

    </section>
  )
}
