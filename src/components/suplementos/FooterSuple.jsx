import { Link } from 'react-router-dom'
import { FlaskConical } from 'lucide-react'

// Blanco (2026-09-19, migración de Suple a fondo blanco) — mismo criterio
// que FooterSupply en modo claro: borde zinc-200, texto oscuro y cuadrícula
// decorativa apenas visible.
export default function FooterSuple() {
  return (
    <footer className="relative border-t border-zinc-200 bg-white px-6 py-10 md:py-16 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(24,24,27,1) 39px,rgba(24,24,27,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(24,24,27,1) 39px,rgba(24,24,27,1) 40px)',
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto">

        <div className="grid md:grid-cols-3 gap-12">

          {/* IZQUIERDA */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical size={20} className="text-zinc-500" />
              <h2 className="text-2xl font-black uppercase tracking-[0.15em]">
                <span className="text-zinc-900">INK</span>
                <span className="text-zinc-500">OGNITO SUPLE</span>
              </h2>
            </div>
            <p className="text-zinc-500 leading-relaxed max-w-sm">
              Proteína, creatina, pre-entreno y vitaminas de marcas confiables, con despacho rápido desde Urabá a toda Colombia.
            </p>
          </div>

          {/* CENTRO */}
          <div>
            <p className="uppercase tracking-[0.25em] text-zinc-500 text-sm mb-6 font-semibold">
              Navegación
            </p>
            <div className="flex flex-col gap-4">
              <Link to="/suplementos" className="uppercase text-sm tracking-[0.2em] text-zinc-500 hover:text-zinc-900 transition-all duration-300">
                Catálogo
              </Link>
              <Link to="/gym" className="uppercase text-sm tracking-[0.2em] text-zinc-500 hover:text-zinc-900 transition-all duration-300">
                INKognito Gym
              </Link>
              <Link to="/supply" className="uppercase text-sm tracking-[0.2em] text-zinc-500 hover:text-zinc-900 transition-all duration-300">
                INKognito Supply
              </Link>
              <Link to="/store" className="uppercase text-sm tracking-[0.2em] text-zinc-500 hover:text-zinc-900 transition-all duration-300">
                INKognito Store
              </Link>
            </div>
          </div>

          {/* DERECHA */}
          <div className="md:text-right">
            <p className="uppercase tracking-[0.25em] text-zinc-500 text-sm mb-6 font-semibold">
              Ecosistema
            </p>
            <Link
              to="/"
              className="inline-block border border-zinc-300 px-6 py-3 uppercase tracking-[0.2em] text-sm text-zinc-700 hover:border-zinc-600 hover:text-zinc-900 transition-all duration-300"
            >
              Volver al Ecosistema
            </Link>
          </div>

        </div>

        <div className="border-t border-zinc-200 mt-16 pt-8 flex flex-col sm:flex-row sm:justify-between items-center gap-3">
          <p className="text-zinc-400 text-[9.5px] sm:text-[12px] whitespace-nowrap">
            © 2026 INKognito Suple. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[12px]">
            <Link to="/terminos" className="text-zinc-400 hover:text-zinc-900 transition-colors">
              Términos
            </Link>
            <Link to="/privacidad" className="text-zinc-400 hover:text-zinc-900 transition-colors">
              Privacidad
            </Link>
            <span className="text-zinc-400">Desarrollado por INKognito</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
