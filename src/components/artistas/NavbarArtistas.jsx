import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
// Recorte del logo genérico (assets/ecosystem/logo.png) sin el margen
// transparente que trae de fábrica — ese margen hacía que se viera más
// chico que los logos por módulo (supply.webp, etc.) aunque la caja
// midiera lo mismo (2026-08-03, reportado por Jose).
import inkognitoLogo from '../../assets/artistas-logo-mark.png'
import InkognitoModuleMenu from '../InkognitoModuleMenu'
import AnimatedCityWordmark from './AnimatedCityWordmark'

// Navbar propio del módulo (2026-08-03) — antes usaba el EcosystemNavbar
// genérico (pensado para landings sueltas de producto), pero al pasar a
// paleta blanco/rojo/gris y llevar el texto del módulo acá (antes vivía
// como eyebrow en el hero, quedaba muy lejos del navbar), necesitaba su
// propio navbar — mismo patrón que NavbarSuple.jsx/NavbarStore.jsx (logo +
// nombre del módulo + menú hamburguesa con InkognitoModuleMenu).
//
// "Urabá" → "Colombia" (2026-08-04, expansión nacional aprobada por Jose
// — ver informe de viabilidad): el registro ya no restringe la ciudad de
// origen del artista, así que el navbar tampoco debía seguir anclado a
// Urabá. `ciudadDetectada` (opcional, viene del loader de cada página vía
// geolocalización por IP de Vercel) hace que "Colombia" se encoja y el
// nombre de la ciudad detectada aparezca en su lugar — mismo mecanismo que
// ya usa AnimatedWordmark.jsx para "INKOGNITO" → nombre del módulo, pero
// en su propio componente (AnimatedCityWordmark) porque acá la palabra que
// desaparece es dinámica según si hubo detección o no.
export default function NavbarArtistas({ ciudadDetectada = null }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-800 border-b border-gray-700">
      <div className="relative max-w-6xl mx-auto px-4 md:px-6">
        <div className="h-16 md:h-20 flex items-center justify-between">

          {/* Logo pegado a la izquierda, tal cual estaba — lo que se centra
              es solo el texto, no el logo (Jose, 2026-08-03: "era centrar
              el texto no mover el logo"). El texto se centra en TODO el
              navbar (absolute + left-1/2), no en el espacio libre entre
              logo y hamburguesa, para que quede alineado con el centro
              real de la barra sin importar el ancho de cada lado. */}
          <Link to="/tattoo-artist-uraba" className="flex items-center flex-shrink-0">
            {/* Medido contra el navbar de Supply con Playwright+sharp: su
                logo ocupa ~57% de su caja de w-12/w-14 (el archivo trae aire
                de fábrica) — acá el archivo ya viene recortado, así que el
                <img> se achica al 57% dentro de la misma caja para igualar
                el tamaño real en pantalla, no solo el de la caja
                (2026-08-03). */}
            <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0">
              <img src={inkognitoLogo} alt="INKognito" className="w-7 h-7 md:w-8 md:h-8 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
          </Link>

          <Link
            to="/tattoo-artist-uraba"
            className="absolute left-1/2 -translate-x-1/2 text-base md:text-xl font-black uppercase tracking-wide leading-tight whitespace-nowrap"
          >
            <span className="text-gray-100">Tattoo Artist</span>{' '}
            {ciudadDetectada
              ? <AnimatedCityWordmark ciudad={ciudadDetectada.municipio} />
              : <span className="text-gray-300">Colombia</span>}
          </Link>

          <button
            onClick={() => setMenuOpen(o => !o)}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute right-4 top-16 md:top-20 bg-white border border-gray-200 w-56 z-50 shadow-lg">
          <Link to="/tattoo-artist-uraba" onClick={close} className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300">
            Inicio
          </Link>
          <InkognitoModuleMenu
            current="artistas"
            textClassName="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            onNavigate={close}
          />
          <Link to="/" onClick={close} className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300">
            Ecosistema
          </Link>
        </div>
      )}
    </nav>
  )
}
