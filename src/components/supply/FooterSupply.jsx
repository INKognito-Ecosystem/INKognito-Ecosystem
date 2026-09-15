import { Link } from 'react-router-dom'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

// light (2026-09-15, piloto de Jose en Cartuchos: "cambia el fondo de la
// page cartuchos a blanco... todo incluido el footer y politicas") —
// FooterSupply es compartido por TODAS las páginas de Supply, default false
// para no tocar las demás. Solo SupplyCategoryPage.jsx pasa light={light}
// (true únicamente en Cartuchos por ahora).
export default function FooterSupply({ light = false }) {
  const t = light ? {
    barBg: 'bg-white', pageBg: 'bg-white', border: 'border-zinc-200',
    text: 'text-zinc-900', textMuted: 'text-zinc-600', textMuted2: 'text-zinc-500',
    hoverText: 'hover:text-black', btnBorder: 'border-zinc-300', btnText: 'text-zinc-700',
    dotOpacity: 'opacity-[0.05]',
  } : {
    barBg: 'bg-black', pageBg: 'bg-gray-950', border: 'border-zinc-900',
    text: 'text-white', textMuted: 'text-zinc-400', textMuted2: 'text-zinc-600',
    hoverText: 'hover:text-white', btnBorder: 'border-zinc-700', btnText: 'text-zinc-300',
    dotOpacity: 'opacity-[0.11]',
  }

  return (

    <footer id="contacto" className={`relative overflow-hidden border-t ${t.border}`}>

      {/* BARRA SUPERIOR — igual al navbar. Solo desktop (2026-09-15):
          en móvil el logo ya vive fijo en la barra superior durante todo el
          scroll, repetirlo acá en grande era puro relleno. */}
      <div className={`hidden md:block ${t.barBg} border-b ${t.border} px-6 py-4`}>
        <h2 className="max-w-7xl mx-auto text-xl md:text-2xl font-black uppercase tracking-[0.15em] text-center">
          <span className={t.text}>INK</span>
          <span className="text-blue-500">OGNITO </span>
          <span className="text-blue-500">SUPPLY</span>
        </h2>
      </div>

      <div className={`relative ${t.pageBg} px-6 py-6 md:py-8`}>
      <div className={`absolute inset-0 ${t.dotOpacity}`} style={DOT_PATTERN} />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">

          {/* IZQUIERDA */}
          <div>

            <p className={`${t.textMuted} leading-relaxed max-w-sm text-sm`}>
              Infraestructura digital. La plataforma que conecta artistas con supply/proveedores
              del país.
            </p>

          </div>

          {/* CENTRO — solo desktop (2026-09-15): en móvil "Inicio" y
              "Categorías" ya están a un toque en la tab bar de abajo. */}
          <div className="hidden md:block">

            <p className={`uppercase tracking-[0.25em] ${t.textMuted} text-sm mb-3 font-semibold`}>
              Navegación
            </p>

            <div className="flex flex-col gap-2">
  <Link
    to="/supply#destacados"
    className={`uppercase text-sm tracking-[0.2em] ${t.textMuted} ${t.hoverText} transition-all duration-300`}
  >
    Destacados
  </Link>

  <Link
    to="/supply#categorias"
    className={`uppercase text-sm tracking-[0.2em] ${t.textMuted} ${t.hoverText} transition-all duration-300`}
  >
    Categorias
  </Link>

  <Link
    to="/supply#marcas"
    className={`uppercase text-sm tracking-[0.2em] ${t.textMuted} ${t.hoverText} transition-all duration-300`}
  >
    Marcas
  </Link>
</div>

          </div>

          {/* DERECHA — solo desktop (2026-09-15): "Ecosistema" ya vive
              dentro del menú hamburguesa en móvil. */}
          <div className="hidden md:block md:text-right">

            <p className={`uppercase tracking-[0.25em] ${t.textMuted} text-sm mb-3 font-semibold`}>
              Ecosistema
            </p>

            <Link
              to="/"
              className={`inline-block border ${t.btnBorder} px-6 py-2.5 uppercase tracking-[0.2em] text-sm ${t.btnText} hover:border-blue-500 ${t.hoverText} transition-all duration-300`}
            >
              Volver
            </Link>

          </div>

        </div>

        {/* LINEA */}
        <div className={`border-t ${t.border} mt-6 md:mt-8 pt-5 flex flex-col sm:flex-row sm:justify-between items-center gap-3`}>

          <p className={`${t.textMuted2} text-[9.5px] sm:text-[12px] whitespace-nowrap`}>
            © 2026 INKognito Supply. Todos los derechos reservados.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[12px]">
            <Link to="/terminos" className={`${t.textMuted2} ${t.hoverText} transition-colors`}>
              Términos
            </Link>
            <Link to="/privacidad" className={`${t.textMuted2} ${t.hoverText} transition-colors`}>
              Privacidad
            </Link>
            <span className={t.textMuted2}>Desarrollado por INKognito</span>
          </div>

        </div>

      </div>

      </div>

    </footer>

  )

}
