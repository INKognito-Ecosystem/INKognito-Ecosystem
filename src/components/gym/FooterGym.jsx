import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa'
import { Dumbbell } from 'lucide-react'

export default function FooterGym() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const goToPlanos = (e) => {
    e.preventDefault()
    if (pathname === '/gym') {
      document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/gym')
      setTimeout(() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' }), 400)
    }
  }

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
              <Dumbbell size={20} className="text-gray-400" />
              <h2 className="text-2xl font-black uppercase tracking-[0.15em]">
                <span className="text-white">INK</span>
                <span className="text-gray-500">OGNITO </span>
                <span className="text-gray-300">GYM</span>
              </h2>
            </div>
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
              <a href="/gym#planos" onClick={goToPlanos} className="uppercase text-sm tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300">
                Planos digitales
              </a>
              <Link to="/gym/suplementos" className="uppercase text-sm tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300">
                Suplementos
              </Link>
              <Link to="/gym/tutoriales" className="uppercase text-sm tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300">
                Tutoriales en video
              </Link>
              <Link to="/gym/cursos" className="uppercase text-sm tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300">
                Cursos
              </Link>
              <Link to="/gym/recursos" className="uppercase text-sm tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300">
                Recursos gratis
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
