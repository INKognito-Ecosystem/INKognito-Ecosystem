import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, Search, Palette, Building2, UserPlus, UserCircle, FileText, Shield, Navigation, LoaderCircle, Store, Globe } from 'lucide-react'
// Recorte del logo genérico (assets/ecosystem/logo.png) sin el margen
// transparente que trae de fábrica — ese margen hacía que se viera más
// chico que los logos por módulo (supply.webp, etc.) aunque la caja
// midiera lo mismo (2026-08-03, reportado por Jose).
import inkognitoLogo from '../../assets/artistas-logo-mark.png'
import InkognitoModuleMenu from '../InkognitoModuleMenu'
import AnimatedCityWordmark from './AnimatedCityWordmark'
import LogoLupaIntro from './LogoLupaIntro'
import LegalModal from '../legal/LegalModal'

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
// un poco, ver ArtistasColombiaPage.jsx), para que el navbar mantenga algo de
// peso visual sin volver a esconder el azul. Con el navbar de nuevo en un
// tono medio/oscuro, logo/textos vuelven a la versión clara (como en el
// diseño original), no la oscura que se usó durante la versión blanca.
// titulo (2026-08-06) — override opcional del wordmark central, solo para
// pantallas de tarea puntual (ej. "Editar mi perfil") donde repetir el
// nombre de marca no orienta tanto como decir en qué pantalla está el
// artista. Sigue enlazando a /tattoo-artist-colombia igual que siempre.
//
// Jerarquía visual + íconos en el menú (2026-09-15, Jose: "agrégale a este
// botón jerarquía visual y sus íconos, como ya hicimos con el home del
// ecosystem y con Supply") — mismo patrón de EcosystemNavbar.jsx (eyebrow +
// divisores agrupando por tema) y de SupplyMobileNav.jsx (ícono antes de
// cada nombre). Helpers locales, no compartidos — el menú de este módulo
// es chico y ya tenía su propia paleta blanco/gris.
function MenuSectionLabel({ children }) {
  return (
    <p className="px-6 pt-5 pb-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
      {children}
    </p>
  )
}

function MenuDivider() {
  return <div className="border-t border-gray-100" />
}

// Modo botón cuando no hay `to` (2026-09-15) — usado por Términos/Privacidad
// para abrir el modal legal en vez de navegar (ver LegalModal.jsx).
function MenuLink({ to, icon: Icon, onClick, children }) {
  const className = "flex items-center gap-3 px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300"
  const content = (
    <>
      {Icon && <Icon size={16} className="flex-shrink-0 text-gray-400" />}
      {children}
    </>
  )
  if (!to) {
    return <button type="button" onClick={onClick} className={`w-full text-left border-none bg-transparent cursor-pointer ${className}`}>{content}</button>
  }
  return (
    <Link to={to} onClick={onClick} className={className}>
      {content}
    </Link>
  )
}

// searchValue/onSearchChange/searchPlaceholder (2026-09-15, Jose: "el
// buscador lo vamos a situar arriba en el navbar, como ya lo hace Supply")
// — mismo criterio opcional que NavbarCategory.jsx: la presencia de
// onSearchChange activa el modo buscador (reemplaza el wordmark central),
// default null para no afectar los demás navbars que usan este componente
// (Editar perfil, Registro de estudio, etc. siguen mostrando su `titulo`).
// categoria/onCategoriaChange (mismo pedido) — activan el listón gris de
// categorías (Artistas/Estudios) pegado debajo del navbar, mismo criterio
// opcional. Solo ArtistasColombiaPage.jsx pasa estos props hoy.
// ubicando/onUbicacion/cercaDeTiActivo/tooltipUbicacion/onCerrarTooltipUbicacion
// (2026-09-15, Jose: "agrega el botón cerca de ti, al lado de los dos de
// arriba que dicen artistas, estudios") — "Cerca de ti" vivía solo en el
// hero de ArtistasColombiaPage.jsx; ahora se suma como tercer botón del
// listón, mismo criterio opcional que el resto (onUbicacion ausente = no
// se renderiza). El estado (ubicando, tooltip, etc.) sigue viviendo en la
// page — acá solo se refleja, igual que categoria/onCategoriaChange.
export default function NavbarArtistas({ ciudadDetectada = null, titulo = null, searchValue = null, onSearchChange = null, searchPlaceholder = 'Buscar', categoria = null, onCategoriaChange = null, ubicando = false, onUbicacion = null, cercaDeTiActivo = false, tooltipUbicacion = false, onCerrarTooltipUbicacion = null }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)
  // legalOpen (2026-09-15, Jose: "el modal abre directo donde estoy...
  // blanco... ocupa toda la pantalla" — mismo patrón que EcosystemNavbar.jsx).
  const [legalOpen, setLegalOpen] = useState(null)

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-600 border-b border-gray-700">
      <div className="relative max-w-6xl mx-auto px-4 md:px-6">
        <div className="h-16 md:h-20 flex items-center gap-3 justify-between">

          {/* Logo pegado a la izquierda, tal cual estaba — lo que se centra
              es solo el texto, no el logo (Jose, 2026-08-03: "era centrar
              el texto no mover el logo"). El texto se centra en TODO el
              navbar (absolute + left-1/2), no en el espacio libre entre
              logo y hamburguesa, para que quede alineado con el centro
              real de la barra sin importar el ancho de cada lado. Este
              centrado absoluto solo aplica al modo wordmark — en modo
              buscador (ver abajo) el input vive en el flujo flex normal,
              entre el logo y la hamburguesa. */}
          <Link to="/tattoo-artist-colombia" className="flex items-center flex-shrink-0">
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

          {onSearchChange ? (
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchValue || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                autoComplete="off"
                className="w-full bg-gray-700 border border-gray-500/50 rounded-full pl-10 pr-9 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-gray-300 transition-colors"
              />
              {searchValue && (
                <button
                  onClick={() => onSearchChange('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ) : (
            <Link
              to="/tattoo-artist-colombia"
              className="absolute left-1/2 -translate-x-1/2 text-base md:text-xl font-black uppercase tracking-wide leading-tight whitespace-nowrap"
            >
              {titulo ? (
                <span className="text-gray-100">{titulo}</span>
              ) : (
                <>
                  <span className="text-gray-100">Tattoo Artist</span>{' '}
                  {ciudadDetectada
                    ? <AnimatedCityWordmark ciudad={ciudadDetectada.municipio} />
                    : <span className="text-gray-300">Colombia</span>}
                </>
              )}
            </Link>
          )}

          {/* Hamburguesa — vuelve al ícono normal de lucide-react
              (2026-09-15, Jose: "que no tenga los colores amarillo azul y
              rojo, si no que sea normal"). Antes usaba 3 barras propias
              pintadas con los colores de la bandera de Colombia en el
              estado cerrado; ahora el mismo gris claro que ya usaba la X
              de cerrar, sin ningún color de acento. */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="flex-shrink-0 flex items-center justify-center w-[22px] h-[22px]"
          >
            {menuOpen ? (
              <X size={22} className="text-gray-300 hover:text-white transition-colors" />
            ) : (
              <Menu size={22} className="text-gray-300 hover:text-white transition-colors" />
            )}
          </button>
        </div>
      </div>

      {/* LISTÓN GRIS DE CATEGORÍAS — pegado debajo del navbar (2026-09-15,
          Jose: "en el listón gris que tendrá abajo, estarán lo que haría
          de categoría, los botones de buscador de artistas, estudios").
          Mismo principio que la franja de categorías de MobileHomeSupply.jsx
          (ahí azul, acá gris — paleta propia del módulo), pero fija (no
          scrollea) porque acá solo hay 2 botones, no una fila de muchas
          categorías que necesite overflow-x. Solo se monta cuando la page
          pasa onCategoriaChange (hoy, solo ArtistasColombiaPage.jsx) — el
          resto de pantallas del módulo no la necesitan. */}
      {onCategoriaChange && (
        <div className="fixed top-16 md:top-20 left-0 w-full z-40 bg-gray-200 border-b border-gray-300">
          {/* overflow-x-auto (2026-09-15) — con el botón nuevo de Supply se
              suman 4 pills; en celulares angostos ya no entran todos en una
              fila sin scroll (los 3 anteriores apenas calzaban). Mismo
              recurso que ya usa la franja de categorías de
              MobileHomeSupply.jsx (scrollbar oculta, flex-shrink-0 en cada
              pill para que no se aplasten en vez de scrollear).
              justify-start, NO justify-center (bug real, Jose: "el ícono
              de artistas quedó cortado a la izquierda") — justify-center
              en un contenedor con overflow reparte el desborde a AMBOS
              lados y el de la izquierda queda inalcanzable (scrollLeft no
              puede ir negativo), cortando el primer pill sin forma de
              revelarlo con scroll. */}
          <div className="max-w-6xl mx-auto px-4 md:px-6 h-11 flex items-center justify-start md:justify-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[
              { key: 'artistas', label: 'Artistas', icon: Palette },
              { key: 'estudios', label: 'Estudios', icon: Building2 },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => onCategoriaChange(key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wide transition-colors ${
                  categoria === key ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-400 bg-white text-gray-600 hover:border-gray-600'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
            {onUbicacion && (
              <div className="relative flex-shrink-0">
                <button
                  onClick={onUbicacion}
                  disabled={ubicando}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wide transition-colors disabled:opacity-60 ${
                    cercaDeTiActivo ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-400 bg-white text-gray-600 hover:border-gray-600'
                  }`}
                >
                  {ubicando ? <LoaderCircle size={13} className="animate-spin" /> : <Navigation size={13} />}
                  {/* "Cerca de ti" → "Cerca de mí" (2026-09-15, pedido
                      explícito de Jose) */}
                  {ubicando ? 'Ubicando...' : 'Cerca de mí'}
                </button>
                {/* Tooltip de onboarding — solo la primera vez (ver
                    useEffect/localStorage en ArtistasColombiaPage.jsx).
                    Anclado al borde derecho (no centrado) — este es el
                    botón más a la derecha del listón, un tooltip centrado
                    se saldría de la pantalla en celulares angostos. */}
                {tooltipUbicacion && (
                  <div className="absolute z-30 top-full mt-3 right-0 w-64 max-w-[calc(100vw-2rem)] bg-gray-900 text-white rounded-xl p-4 shadow-xl text-left">
                    <span className="absolute -top-1.5 right-4 w-3 h-3 bg-gray-900 rotate-45" />
                    <p className="text-xs leading-relaxed text-gray-200">
                      Con tu permiso de ubicación te mostramos artistas y estudios reales cerca de ti, ordenados por distancia — no una lista genérica.
                    </p>
                    <button
                      onClick={onCerrarTooltipUbicacion}
                      className="mt-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:opacity-80 transition-opacity"
                    >
                      Entendido
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* Botón nuevo (2026-09-15, Jose: "vas a agregar allí otro
                botón que se llamará Supply y será la url que lleva a la
                page principal del módulo Supply") — Link directo, no un
                toggle de categoría como los dos primeros: navega fuera de
                esta página, no cambia ningún estado local. */}
            <Link
              to="/supply"
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-400 bg-white text-gray-600 hover:border-gray-600 text-[11px] font-bold uppercase tracking-wide transition-colors"
            >
              <Store size={13} />
              Supply
            </Link>
          </div>
        </div>
      )}

      {/* Estructura del menú (2026-08-06, Jose: "analiza su botón
          hamburguesa... quiero que sea así mismo pero con nuestra
          información") — Tattoodo separa su menú en "buscar/explorar" vs.
          "para artistas" (gestión de cuenta), y cierra con legal. Antes
          acá solo había "Inicio" + otros módulos + "Ecosistema", sin
          ningún link para que un artista se registre o edite su perfil
          desde el menú — había que conocer la URL de memoria.
          v2 (Jose: "que al dar clic ocupe toda la pantalla, no un
          pedacito") — pasa de un dropdown chico en la esquina a un
          overlay a pantalla completa (fixed inset-0, debajo del navbar),
          mismo patrón de menú full-screen que usa Tattoodo en móvil. */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 md:top-20 bg-white z-50 overflow-y-auto">
          {/* Jerarquía por secciones (2026-09-15) — antes era una lista
              plana sin agrupar; ahora sigue el mismo criterio que
              EcosystemNavbar.jsx: un eyebrow por tema, con íconos en cada
              link (mismo patrón que SupplyMobileNav.jsx). */}
          <MenuSectionLabel>Buscar</MenuSectionLabel>
          {/* Búsqueda sectorizada (fase 6.5, 2026-08-07, Jose: "por si solo
              quiero búsquedas de estudios, o tatuadores") — ambos links
              aterrizan directo en modo "cerca de mí" para su categoría
              (mismo filtro de ArtistasColombiaPage.jsx, fase 6.3), sin
              tener que tocar el pill después de cargar. */}
          <MenuLink to="/tattoo-artist-colombia?categoria=artistas" icon={Palette} onClick={close}>
            Buscar artistas
          </MenuLink>
          <MenuLink to="/tattoo-artist-colombia?categoria=estudios" icon={Building2} onClick={close}>
            Buscar estudios
          </MenuLink>

          <MenuDivider />
          <MenuSectionLabel>Únete</MenuSectionLabel>
          <MenuLink to="/tattoo-artist-colombia/unete" icon={UserPlus} onClick={close}>
            Únete como artista
          </MenuLink>
          {/* fase 6.3 (2026-08-07, Jose) — el registro de estudio existía
              pero sin ningún link público hacia él, solo por URL directa.
              Las marcas (tipo='empresa') a propósito NO tienen link acá —
              Jose las sigue creando él directamente desde el panel. */}
          <MenuLink to="/tattoo-artist-colombia/estudio/unete" icon={Building2} onClick={close}>
            Registra tu estudio
          </MenuLink>

          <MenuDivider />
          <InkognitoModuleMenu
            current="artistas"
            only={['supply']}
            label="Para artistas"
            icon={UserCircle}
            extraLinks={[
              { label: 'Editar mi perfil', to: '/tattoo-artist-colombia/mi-perfil' },
              { label: 'Cursos', to: '/supply/aprende/cursos' },
            ]}
            textClassName="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            onNavigate={close}
          />
          {/* "Ecosistema" de vuelta (2026-09-15, Jose: "la page INK no tiene
              botón en el navbar que lleve de vuelta a los módulos, como sí
              lo tiene Supply" — se había quitado el 2026-08-06 pensando que
              ni cliente ni artista lo necesitaban; ahora se agrega para que
              INK tenga el mismo atajo que ya tienen los 4 menús de Supply,
              agrupado junto con legal como allá ("Ecosistema y legal"). */}
          <MenuDivider />
          <MenuSectionLabel>Ecosistema y legal</MenuSectionLabel>
          <MenuLink to="/" icon={Globe} onClick={close}>
            Ecosistema
          </MenuLink>
          {/* Sin `to` (2026-09-15) — abre el modal (variant="artistas",
              mismo contenido que /tattoo-artist-colombia/terminos y
              /privacidad) en vez de navegar. */}
          <MenuLink icon={FileText} onClick={() => setLegalOpen('terminos')}>
            Términos
          </MenuLink>
          <MenuLink icon={Shield} onClick={() => setLegalOpen('privacidad')}>
            Privacidad
          </MenuLink>
        </div>
      )}

      <LegalModal type={legalOpen} variant="artistas" onClose={() => setLegalOpen(null)} />
    </nav>
  )
}
