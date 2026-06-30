import { Link } from 'react-router-dom'
import { FaWhatsapp, FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa'

const STRIPE_PATTERN = {
  backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 19px,rgba(201,168,76,1) 19px,rgba(201,168,76,1) 20px)',
}

export default function FooterStore() {
  return (
    <footer id="contacto" className="relative overflow-hidden border-t border-gray-200 bg-gray-50 px-6 py-10 md:py-12 lg:py-16">
      <div className="absolute inset-0 opacity-[0.13]" style={STRIPE_PATTERN} />
      <div className="relative z-10 max-w-7xl mx-auto">

        <div className="grid md:grid-cols-2 gap-12">

          {/* IZQUIERDA */}
          <div>
            <h2 className="text-2xl font-black uppercase tracking-[0.15em] mb-4">
              <span className="text-gray-900">INK</span>
              <span className="text-[#C9A84C]">OGNITO STORE</span>
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-sm mb-6">
              Ropa y calzado deportivo para la región de Urabá. Réplicas premium
              con entrega a domicilio en los 4 municipios de la región.
            </p>
            <div className="flex gap-5">
              <a
                href="https://wa.me/573207911013"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#C9A84C] transition-all duration-300"
              >
                <FaWhatsapp size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-[#C9A84C] transition-all duration-300">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-[#C9A84C] transition-all duration-300">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-[#C9A84C] transition-all duration-300">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* DERECHA — CATEGORÍAS */}
          <div>
            <p className="uppercase tracking-[0.25em] text-gray-700 text-sm mb-6 font-semibold">
              Categorías
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/store/ropa-dama" className="uppercase text-sm tracking-[0.2em] text-gray-600 hover:text-[#C9A84C] transition-all duration-300">
                Ropa Dama
              </Link>
              <Link to="/store/ropa-caballeros" className="uppercase text-sm tracking-[0.2em] text-gray-600 hover:text-[#C9A84C] transition-all duration-300">
                Ropa Caballeros
              </Link>
              <Link to="/store/zapatos-deportivos" className="uppercase text-sm tracking-[0.2em] text-gray-600 hover:text-[#C9A84C] transition-all duration-300">
                Zapatos Deportivos
              </Link>
              <Link to="/store/zapatos-casuales" className="uppercase text-sm tracking-[0.2em] text-gray-600 hover:text-[#C9A84C] transition-all duration-300">
                Zapatos Casuales
              </Link>
              <Link to="/store/guayos" className="uppercase text-sm tracking-[0.2em] text-gray-600 hover:text-[#C9A84C] transition-all duration-300">
                Guayos
              </Link>
              <Link to="/store/tenis-guayo" className="uppercase text-sm tracking-[0.2em] text-gray-600 hover:text-[#C9A84C] transition-all duration-300">
                Tenis Guayo
              </Link>
            </div>
          </div>

        </div>

        {/* LÍNEA INFERIOR */}
        <div className="border-t border-gray-200 mt-16 pt-8">
          <p className="text-gray-500 uppercase tracking-[0.2em] text-xs text-center md:text-left">
            © 2026 INKOGNITO. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  )
}
