import { Link } from 'react-router-dom'

const STRIPE_PATTERN = {
  backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 19px,rgba(201,168,76,1) 19px,rgba(201,168,76,1) 20px)',
}

// paginaTienda (2026-08-30, Jose) — mismo criterio que hideMenu en
// NavbarCategoryStore.jsx: el catálogo de UNA tienda (EstudioTiendaPage.jsx)
// no debe repetir la navegación genérica de Store (esas categorías son
// "lo mismo del navbar", que ya se quitó ahí) — acá también se oculta,
// y el bloque de marca de la izquierda baja de tamaño (Jose: "las letras
// están como muy grandes") ya que sin la columna de categorías al lado
// quedaría ocupando todo el ancho.
export default function FooterStore({ paginaTienda = false }) {
  return (
    <footer id="contacto" className="relative overflow-hidden border-t border-gray-200 bg-gray-50 px-6 py-10 md:py-12 lg:py-16">
      <div className="absolute inset-0 opacity-[0.13]" style={STRIPE_PATTERN} />
      <div className="relative z-10 max-w-7xl mx-auto">

        <div className={paginaTienda ? '' : 'grid md:grid-cols-2 gap-12'}>

          {/* IZQUIERDA */}
          <div>
            <h2 className="font-black uppercase tracking-[0.15em] mb-4 text-2xl">
              <span className="text-gray-900">INK</span>
              <span className="text-[#C9A84C]">OGNITO STORE</span>
            </h2>
            <p className={`text-gray-600 leading-relaxed max-w-sm mb-6 ${paginaTienda ? 'text-sm' : ''}`}>
              Tienda online de ropa y calzado, con proveedores verificados.
              Réplicas premium con entrega a domicilio en los 4 municipios
              de la región.
            </p>
          </div>

          {/* DERECHA — CATEGORÍAS */}
          {!paginaTienda && (
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
                Teniguayos
              </Link>
            </div>
          </div>
          )}

        </div>

        {/* LÍNEA INFERIOR */}
        <div className="border-t border-gray-200 mt-16 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-gray-500 text-[9.5px] sm:text-[12px] text-center md:text-left whitespace-nowrap">
            © 2026 INKognito Store. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-x-6 gap-y-2 text-[12px]">
            <Link to="/terminos" className="text-gray-500 hover:text-[#C9A84C] transition-colors">
              Términos
            </Link>
            <Link to="/privacidad" className="text-gray-500 hover:text-[#C9A84C] transition-colors">
              Privacidad
            </Link>
            <span className="text-gray-500">Desarrollado por INKognito</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
