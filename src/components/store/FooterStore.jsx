import { Link } from 'react-router-dom'
import { FaWhatsapp, FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa'

const STRIPE_PATTERN = {
  backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 19px,rgba(156,163,175,1) 19px,rgba(156,163,175,1) 20px)',
}

export default function FooterStore() {
  return (
    <footer id="contacto" className="relative overflow-hidden border-t border-zinc-900 bg-black px-6 py-10 md:py-12 lg:py-16">
      <div className="absolute inset-0 opacity-[0.03]" style={STRIPE_PATTERN} />
      <div className="relative z-10 max-w-7xl mx-auto">

        <div className="grid md:grid-cols-2 gap-12">

          {/* IZQUIERDA */}
          <div>
            <h2 className="text-2xl font-black uppercase tracking-[0.15em] mb-4">
              <span className="text-white">INK</span>
              <span className="text-[#C9A84C]">OGNITO STORE</span>
            </h2>
            <p className="text-zinc-500 leading-relaxed max-w-sm mb-6">
              Ropa y calzado deportivo para la región de Urabá. Réplicas premium
              con entrega a domicilio en los 4 municipios de la región.
            </p>
            <div className="flex gap-5">
              <a
                href="https://wa.me/573207911013"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-[#C9A84C] transition-all duration-300"
              >
                <FaWhatsapp size={20} />
              </a>
              <a href="#" className="text-zinc-500 hover:text-[#C9A84C] transition-all duration-300">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-zinc-500 hover:text-[#C9A84C] transition-all duration-300">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-zinc-500 hover:text-[#C9A84C] transition-all duration-300">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* DERECHA — CATEGORÍAS */}
          <div>
            <p className="uppercase tracking-[0.25em] text-zinc-400 text-sm mb-6 font-semibold">
              Categorías
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/store/ropa-dama" className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] transition-all duration-300">
                Ropa Dama
              </Link>
              <Link to="/store/ropa-caballeros" className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] transition-all duration-300">
                Ropa Caballeros
              </Link>
              <Link to="/store/zapatos-deportivos" className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] transition-all duration-300">
                Zapatos Deportivos
              </Link>
              <Link to="/store/zapatos-casuales" className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] transition-all duration-300">
                Zapatos Casuales
              </Link>
              <Link to="/store/guayos" className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] transition-all duration-300">
                Guayos
              </Link>
              <Link to="/store/tenis-guayo" className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-[#C9A84C] transition-all duration-300">
                Tenis Guayo
              </Link>
            </div>
          </div>

        </div>

        {/* LÍNEA INFERIOR */}
        <div className="border-t border-zinc-900 mt-16 pt-8 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link
              to="/"
              className="border border-zinc-700 px-5 py-2 uppercase tracking-[0.2em] text-xs text-zinc-400 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300"
            >
              Ecosistema
            </Link>
            <a
              href="https://wa.me/573207911013?text=Hola,%20quiero%20información%20sobre%20INKognito%20Store"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-500 hover:text-[#C9A84C] transition-all duration-300 uppercase tracking-[0.15em] text-xs"
            >
              <FaWhatsapp size={14} />
              +57 320 791 1013
            </a>
          </div>
          <p className="text-zinc-600 uppercase tracking-[0.2em] text-xs text-center md:text-left">
            © 2026 INKOGNITO. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  )
}
