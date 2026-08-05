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
import LogoLupaIntro from './LogoLupaIntro'

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
//
// Navbar oscuro → blanco → gris medio (2026-08-05, pedido de Jose): el
// azul de la hamburguesa tricolor casi no se veía sobre el fondo gris muy
// oscuro original (gray-800). Se probó blanco puro, pero Jose pidió un
// punto intermedio: gris más oscuro que el hero (que a su vez se oscureció
// un poco, ver ArtistasUrabaPage.jsx), para que el navbar mantenga algo de
// peso visual sin volver a esconder el azul. Con el navbar de nuevo en un
// tono medio/oscuro, logo/textos vuelven a la versión clara (como en el
// diseño original), no la oscura que se usó durante la versión blanca.
export default function NavbarArtistas({ ciudadDetectada = null }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-600 border-b border-gray-700">
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
                (2026-08-03). Blanco de nuevo (2026-08-05) — vuelve el
                navbar a un fondo medio/oscuro, así que el logo vuelve a
                necesitar invert(1) para leerse claro sobre él. */}
            <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0">
              <img src={inkognitoLogo} alt="INKognito" className="w-7 h-7 md:w-8 md:h-8 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
              <LogoLupaIntro />
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

          {/* Hamburguesa tricolor — pedido de Jose (2026-08-05), colores de
              la bandera de Colombia de arriba a abajo (amarillo/azul/rojo),
              acorde a la expansión nacional del módulo ("Tattoo Artist
              Colombia"). El ícono de lucide-react (Menu) es un solo trazo
              de un color — no se puede pintar cada línea por separado, así
              que se reemplaza por 3 barras propias solo en el estado
              cerrado; la X de cerrar vuelve a su hover claro original
              (gray-400 → white), correcto de nuevo ahora que el navbar
              volvió a un fondo oscuro. */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="flex-shrink-0 flex items-center justify-center w-[22px] h-[22px]"
          >
            {menuOpen ? (
              <X size={22} className="text-gray-400 hover:text-white transition-colors" />
            ) : (
              <span className="flex flex-col gap-[3px] w-[22px]">
                <span className="h-[2.5px] w-full rounded-full" style={{ backgroundColor: '#FCD116' }} />
                <span className="h-[2.5px] w-full rounded-full" style={{ backgroundColor: '#003893' }} />
                <span className="h-[2.5px] w-full rounded-full" style={{ backgroundColor: '#CE1126' }} />
              </span>
            )}
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
