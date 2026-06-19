import { Link } from 'react-router-dom'
import { FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa'

export default function FooterGym() {
  return (
    <footer className="relative border-t border-gray-800 bg-gray-900 px-6 py-10 md:py-16 overflow-hidden">
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
            <h2 className="text-2xl font-black uppercase tracking-[0.15em] mb-4">
              <span className="text-white">INK</span>
              <span className="text-gray-500">OGNITO </span>
              <span className="text-gray-300">GYM</span>
            </h2>
            <p className="text-gray-500 leading-relaxed max-w-sm">
              Máquinas fabricadas a mano, planos digitales y recursos para entrenar en casa sin gastar una fortuna.
            </p>
          </div>

          {/* CENTRO */}
          <div>
            <p className="uppercase tracking-[0.25em] text-gray-400 text-sm mb-6 font-semibold">
              Navegación
            </p>
            <div className="flex flex-col gap-4">
              <Link to="/gym/maquinas-pedido" className="uppercase text-sm tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300">
                Máquinas bajo pedido
              </Link>
              <Link to="/gym/planos" className="uppercase text-sm tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300">
                Planos digitales
              </Link>
              <Link to="/gym/tutoriales" className="uppercase text-sm tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300">
                Tutoriales en video
              </Link>
              <Link to="/gym/cursos" className="uppercase text-sm tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300">
                Cursos
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

        <div className="border-t border-gray-800 mt-16 pt-8 text-center">
          <p className="text-gray-600 uppercase tracking-[0.2em] text-xs">
            © 2026 INKOGNITO. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  )
}
