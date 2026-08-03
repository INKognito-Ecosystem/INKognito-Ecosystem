import { Link } from 'react-router-dom'
import { FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa'
import { FlaskConical } from 'lucide-react'

export default function FooterSuple() {
  return (
    <footer className="relative border-t border-gray-800 bg-gray-950 px-6 py-10 md:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px)',
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto">

        <div className="grid md:grid-cols-3 gap-12">

          {/* IZQUIERDA */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical size={20} className="text-[#9E9E9E]" />
              <h2 className="text-2xl font-black uppercase tracking-[0.15em]">
                <span className="text-white">INK</span>
                <span className="text-[#9E9E9E]">OGNITO SUPLE</span>
              </h2>
            </div>
            <p className="text-gray-500 leading-relaxed max-w-sm">
              Proteína, creatina, pre-entreno y vitaminas de marcas confiables, con despacho rápido desde Urabá a toda Colombia.
            </p>
          </div>

          {/* CENTRO */}
          <div>
            <p className="uppercase tracking-[0.25em] text-gray-400 text-sm mb-6 font-semibold">
              Navegación
            </p>
            <div className="flex flex-col gap-4">
              <Link to="/suplementos" className="uppercase text-sm tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300">
                Catálogo
              </Link>
              <Link to="/gym" className="uppercase text-sm tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300">
                INKognito Gym
              </Link>
              <Link to="/supply" className="uppercase text-sm tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300">
                INKognito Supply
              </Link>
              <Link to="/store" className="uppercase text-sm tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300">
                INKognito Store
              </Link>
            </div>
          </div>

          {/* DERECHA */}
          <div className="md:text-right">
            <p className="uppercase tracking-[0.25em] text-gray-400 text-sm mb-6 font-semibold">
              Redes sociales
            </p>
            <div className="flex md:justify-end gap-5 mb-8">
              <a href="#" target="_blank" rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-all duration-300">
                <FaYoutube size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-all duration-300">
                <FaInstagram size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-all duration-300">
                <FaFacebookF size={20} />
              </a>
            </div>
            <Link
              to="/"
              className="inline-block border border-gray-700 px-6 py-3 uppercase tracking-[0.2em] text-sm text-gray-300 hover:border-gray-400 hover:text-white transition-all duration-300"
            >
              Volver al Ecosistema
            </Link>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col sm:flex-row sm:justify-between items-center gap-3">
          <p className="text-gray-600 text-[9.5px] sm:text-[12px] whitespace-nowrap">
            © 2026 INKognito Suple. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[12px]">
            <Link to="/terminos" className="text-gray-600 hover:text-white transition-colors">
              Términos
            </Link>
            <Link to="/privacidad" className="text-gray-600 hover:text-white transition-colors">
              Privacidad
            </Link>
            <span className="text-gray-600">Desarrollado por INKognito</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
