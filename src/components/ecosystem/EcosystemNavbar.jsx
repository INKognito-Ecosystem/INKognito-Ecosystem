import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Info, Store, Truck, UserCircle, FileText, Shield } from 'lucide-react'
import inkognitoLogo from '../../assets/ecosystem/logo.png'
import LegalModal from '../legal/LegalModal'
import { irAMiSuple } from '../../lib/supleTienda'

// Menú hamburguesa reestructurado (2026-09-16, Jose) — antes era una lista
// plana (About + Tattoo Studio con sus redes anidadas). Ahora es un centro
// de navegación secundaria en 3 categorías, pensado para NO repetir los 5
// botones principales de InkognitoHome.jsx (Tattoo Studio/Supply/Store/
// Gym/Suple ya están ahí) — acá solo vive lo que esos botones no cubren:
// marca, registro de aliados (proveedores, tiendas, estudios, artistas,
// transportadoras) y accesos de cuenta, comunidad y legal.
//
// Cada link real fue verificado contra routes.js — sin URLs inventadas:
//   Supply proveedor    → /supply/proveedores/unete
//   Store tienda        → /tattoo-artist-colombia/tienda/unete
//   Estudio de tatuaje  → /tattoo-artist-colombia/estudio/unete
//   Registro de artista → /tattoo-artist-colombia/unete (2026-09-16: no se
//                          exponía todavía desde ningún link, ver nota
//                          vieja en routes.js — ahora sí, a pedido de Jose)
//   Transportadoras     → /transportadoras/unete (registro, red "Ruta del
//                          Golfo") / mi-panel (acceso)
//   Mi perfil artista   → /tattoo-artist-colombia/mi-perfil
//   Mi perfil estudio   → /tattoo-artist-colombia/estudio/mi-perfil
// No existe hoy un login unificado de "tienda"/"proveedor Supply" (se
// gestionan con un token propio guardado en su misma URL de tienda, no una
// página de acceso aparte) — el submenú de "Mi cuenta" los manda al
// directorio real donde encuentran/abren su propia tienda
// (/supply/proveedores, /store/tiendas), no un login inventado.
//
// "Marca patrocinadora" y "Redes sociales" (Instagram/Facebook de
// jhumaneztattoo) — quitados a pedido de Jose (2026-09-16), la primera de
// "Vende en la plataforma" sin reemplazo, la segunda de "Comunidad &
// legal" completa. "Contacto & soporte" también se quitó de "Ecosistema &
// marca" — Jose: "ese lo agrego después".
//
// tattooLabel/showTattooSection (props viejas de la sección "Tattoo
// Studio") quedaron obsoletas con este cambio — el menú ahora es el mismo
// en cualquier página que use este navbar (hoy: InkognitoHome.jsx y
// ProductLandingPage.jsx).
// mobileLight (2026-09-15, Jose: "quítale la opacidad a la imagen del home
// del ecosystem, y el logo conviértelo a negro, pues quedará sobre un
// fondo blanco") — el fondo de InkognitoHome.jsx ahora es una imagen clara
// en móvil (ver InkognitoHome.jsx); logo y barras de la hamburguesa son
// blancos por default (pensados para el fondo oscuro de siempre), así que
// necesitan volverse oscuros SOLO en móvil para seguir siendo visibles —
// en desktop ese mismo navbar sigue sobre el fondo oscuro de siempre.
// Default false para no afectar ProductLandingPage.jsx, que no lo pasa.
export default function EcosystemNavbar({ logoFilter = null, showTagline = false, mobileLight = false, hideMenu = false }) {
  const navigate = useNavigate()
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  // legalOpen (2026-09-15, Jose: "cuando le doy a políticas o privacidad...
  // la idea es que sea como lo que ya solucionamos [el modal de Sobre
  // INKognito] — el modal abre directo donde estoy... blanco... ocupa toda
  // la pantalla") — mismo patrón que aboutOpen: no navega, abre encima del
  // menú sin cerrarlo. null | 'terminos' | 'privacidad'.
  const [legalOpen, setLegalOpen] = useState(null)

  useEffect(() => {
    document.body.style.overflow = (menuOpen || aboutOpen || legalOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, aboutOpen, legalOpen])

  // Accesibilidad por teclado (2026-09-16, Jose: "manejo de estado y
  // accesibilidad mediante teclado") — Escape cierra lo que esté abierto,
  // el modal "Sobre INKognito"/legal primero si ambos están abiertos a la vez.
  useEffect(() => {
    if (!menuOpen && !aboutOpen && !legalOpen) return
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return
      if (legalOpen) setLegalOpen(null)
      else if (aboutOpen) setAboutOpen(false)
      else setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen, aboutOpen, legalOpen])

  useEffect(() => {
    if (!showTagline) return
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [showTagline])

  // Abre encima del propio menú, sin cerrarlo primero (2026-09-16, Jose:
  // "que el modal se abra allí mismo... y no que se devuelva al home para
  // abrir") — antes cerraba el drawer y esperaba a que terminara de
  // deslizarse (300ms) para recién abrir "Sobre INKognito" sobre lo que
  // hubiera detrás (el home). El modal ya tiene z-index más alto que el
  // drawer (z-80 vs z-70), así que solo hacía falta dejar de cerrar el
  // menú.
  const openAbout = () => setAboutOpen(true)

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between pl-2 pr-6 py-4">
        {/* Logo blanco siempre (2026-09-15, Jose: "que el logo sea blanco y
            no negro") — mobileLight ya no lo toca; con la opacidad/overlay
            de InkognitoHome.jsx restaurada, el blanco vuelve a leerse bien
            sin necesidad de oscurecerlo. Solo la hamburguesa (abajo) sigue
            reaccionando a mobileLight. */}
        <img
          src={inkognitoLogo}
          alt="INKognito"
          className="h-[52px] w-auto object-contain mr-8"
          style={logoFilter ? { filter: logoFilter } : {}}
        />

        {showTagline && (
          <span
            className="absolute left-1/2 -translate-x-1/2 text-white/35 text-[9px] tracking-[0.15em] uppercase font-bold pointer-events-none transition-opacity duration-500 whitespace-nowrap"
            style={{ opacity: scrolled ? 0 : 1 }}
          >
            Disciplina. Arte. Identidad.
          </span>
        )}

        {/* Caja blanca en móvil (2026-09-15, Jose: "el botón hamburguesa
            debería estar metido en un cuadrado blanco para que se pueda
            diferenciar del negro del fondo en esa zona") — la imagen nueva
            tiene líneas negras cruzando justo esa esquina; sin una base
            sólida detrás, las barras negras del ícono se pierden contra
            ellas. bg-white/85, no bg-white sólido (Jose: "déjalo con
            opacidad como antes") — translúcida en vez de un bloque blanco
            opaco. Desktop se queda sin caja, transparente como siempre. */}
        {/* hideMenu (2026-09-24, Jose: "esas landing son para ventas, no
            pueden distraer al cliente") — ProductLandingPage.jsx es la
            única que lo pasa: una landing de un solo producto no debe
            ofrecer una salida a navegar el resto del sitio. El drawer/menú
            de abajo queda igual, simplemente nunca se puede abrir sin este
            botón (menuOpen nunca pasa a true). */}
        {!hideMenu && (
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            className={`flex flex-col gap-[5px] cursor-pointer border-none ${
              mobileLight ? 'p-2.5 bg-white/85 rounded-lg shadow-sm md:p-1 md:bg-transparent md:rounded-none md:shadow-none' : 'p-1 bg-transparent'
            }`}
          >
            <span className={`block w-6 h-[2px] rounded-sm ${mobileLight ? 'bg-black/80 md:bg-white/90' : 'bg-white/90'}`} />
            <span className={`block w-6 h-[2px] rounded-sm ${mobileLight ? 'bg-black/80 md:bg-white/90' : 'bg-white/90'}`} />
            <span className={`block w-6 h-[2px] rounded-sm ${mobileLight ? 'bg-black/80 md:bg-white/90' : 'bg-white/90'}`} />
          </button>
        )}
      </nav>

      {/* OVERLAY MENÚ */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-[60]"
        />
      )}

      {/* DRAWER — fondo blanco (2026-09-16, Jose: "ese modal del botón
          hamburguesa deberá ser de fondo blanco") — antes oscuro, todo el
          set de colores de acá abajo se invirtió a versión clara (texto
          zinc-900/500, hover zinc-100, bordes zinc-200). El logo (blanco
          en el archivo real, pensado para fondo oscuro) necesita
          brightness(0) para verse sobre blanco — mismo mecanismo de
          logoFilter que ya usa esta navbar en ProductLandingPage.jsx,
          aplicado acá directo porque este logo SIEMPRE es sobre blanco,
          sin importar qué logoFilter le pasen a la barra de arriba. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`fixed inset-0 h-screen w-full bg-white z-[70] flex flex-col overflow-y-auto transition-transform duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Fila del logo/cerrar en la MISMA posición exacta que la barra
            fija de arriba (2026-09-16, Jose: "el navbar debería ser su
            defecto el mismo que ya está en la home page, o bien, ubicarlo
            en ese mismo lugar") — mismas clases pl-2/pr-6/py-4 que <nav>
            arriba, a propósito FUERA del max-w-2xl del contenido: así el
            logo no salta de sitio al abrir el menú, queda pegado al
            mismo borde izquierdo real de la pantalla.*/}
        <div className="flex items-center justify-between pl-2 pr-6 py-4 flex-shrink-0">
          <img src={inkognitoLogo} alt="INKognito" className="h-[52px] w-auto object-contain" style={{ filter: 'brightness(0)' }} />
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
            className="bg-transparent border-none cursor-pointer text-zinc-400 text-2xl leading-none p-1 hover:text-black transition-colors"
          >
            ✕
          </button>
        </div>

        {/* max-w-2xl mx-auto (2026-09-16, Jose: "el menú debe ocupar toda
            la pantalla") — el fondo/overlay ya es 100% ancho/alto; este
            wrapper solo evita que la columna de texto se estire de borde
            a borde en monitores anchos, mismo criterio de columna
            limitada que ya usa el resto del sitio (max-w-3xl en
            InkognitoHome.jsx, FooterSupply.jsx, etc.). */}
        <div className="w-full max-w-2xl mx-auto flex flex-col flex-1 min-h-0 px-6 md:px-10">
          <nav className="flex flex-col gap-1">

          {/* Contacto & soporte quitado por ahora (2026-09-16, Jose: "ese
              lo agrego después") — vuelve cuando haya un canal definido. */}
          <MenuSectionLabel>Ecosistema & marca</MenuSectionLabel>
          <MenuLink icon={Info} label="Sobre INKognito" onClick={openAbout} />

          <MenuDivider />

          {/* "Marca patrocinadora" quitado (2026-09-16, Jose: "no debe
              llamarse marca patrocinadora, es más, ese quítalo de
              momento"). Se agrega "Registrarme como artista" — ruta real
              ya existente (/tattoo-artist-colombia/unete) que no se había
              expuesto todavía desde ningún link (ver comentario en
              routes.js), ahora sí.
              Orden alineado con "Mi cuenta / perfil" de abajo (2026-09-16,
              Jose: "si artista está de primero en ambas debe estar así,
              para que todo sea fácil de identificar") — mismo rol, mismo
              lugar en las dos listas: artista → estudio → Supply → Store. */}
          <MenuSectionLabel>Aliados & logística</MenuSectionLabel>
          <ExpandableSection
            icon={Store}
            label="Vende en la plataforma"
            items={[
              { label: 'Registrarme como artista', to: '/tattoo-artist-colombia/unete' },
              { label: 'Estudio de tatuaje', to: '/tattoo-artist-colombia/estudio/unete' },
              { label: 'Supply — insumos para tatuaje', to: '/supply/proveedores/unete' },
              { label: 'Store — ropa y calzado', to: '/tattoo-artist-colombia/tienda/unete' },
              // Suple (2026-09-21, Jose: "agregar suplementación en aliados
              // y logística") — registro real de vendedores de Suple.
              { label: 'Suple — suplementación', to: '/suplementos/proveedores/unete' },
            ]}
            onNavigate={() => setMenuOpen(false)}
          />
          {/* Red de transportadoras (2026-09-16, Jose: "no debe aparecer
              'Red de transportadoras — Ruta del Golfo', ruta del golfo
              debe estar abajo al lado a red de transportadores, y debe
              llevar directo a la web ruta del golfo, y abajo el
              formulario de registro") — desplegable con 2 sub-ítems: la
              web real de Ruta del Golfo (Jose la pasó directo, todavía
              sin dominio propio — desplegada en Vercel bajo el nombre
              viejo "Eljach", pendiente de renombrar) y el formulario de
              registro de siempre. */}
          <ExpandableSection
            icon={Truck}
            label="Red de transportadoras"
            items={[
              { label: 'Ruta del Golfo', href: 'https://eljach-web.vercel.app/' },
              { label: 'Formulario de registro', to: '/transportadoras/unete' },
            ]}
            onNavigate={() => setMenuOpen(false)}
          />
          {/* Mi cuenta / perfil (2026-09-16, Jose: "falta también el de
              supply, y el de store") — Supply/Store no tienen un login
              propio por correo como artista/estudio/transportadora (el
              dueño entra directo a la URL de su tienda, que recuerda su
              token guardado en este navegador); el link real más cercano
              es el directorio donde puede encontrar/abrir su propia
              tienda. */}
          <ExpandableSection
            icon={UserCircle}
            label="Mi cuenta / perfil"
            items={[
              { label: 'Artista', to: '/tattoo-artist-colombia/mi-perfil' },
              { label: 'Estudio', to: '/tattoo-artist-colombia/estudio/mi-perfil' },
              { label: 'Supply', to: '/supply/proveedores' },
              { label: 'Store', to: '/store/tiendas' },
              // Suple (2026-09-21, Jose: "y suple, en mi cuenta / perfil") —
              // mismo destino que "Mi Suple" dentro del propio módulo: abre
              // directo su tienda si este navegador ya guarda su token, y si
              // no, el formulario de correo de Suple (irAMiSuple).
              { label: 'Suple', action: () => irAMiSuple(navigate) },
              { label: 'Transportadora', to: '/transportadoras/mi-panel' },
            ]}
            onNavigate={() => setMenuOpen(false)}
          />

          <MenuDivider />

          {/* Redes sociales quitado (2026-09-16, Jose) */}
          <MenuSectionLabel>Comunidad & legal</MenuSectionLabel>
          {/* Sin `to` (2026-09-15) — abre el modal en vez de navegar a
              /terminos //privacidad; MenuLink ya soporta modo botón cuando
              no se le pasa `to`/`href`. */}
          <MenuLink icon={FileText} label="Términos y condiciones" onClick={() => setLegalOpen('terminos')} />
            <MenuLink icon={Shield} label="Política de privacidad" onClick={() => setLegalOpen('privacidad')} />
          </nav>

          <div className="mt-auto border-t border-zinc-200 pt-6 pb-6">
            <p className="text-zinc-400 text-[10px] tracking-[0.2em] uppercase text-center">
              INKognito Ecosystem © 2026
            </p>
          </div>
        </div>
      </div>

      {/* OVERLAY MODAL ABOUT */}
      {aboutOpen && (
        <div
          onClick={() => setAboutOpen(false)}
          className="fixed inset-0 bg-black/60 z-[60]"
        />
      )}

      {/* MODAL ABOUT — fondo blanco (2026-09-16, Jose: "que se abra allí
          mismo, y con fondo blanco, y no... hacerlo con fondo negro") —
          ahora se abre ENCIMA del propio drawer (blanco también), un
          modal oscuro habría desentonado. Mismo criterio editorial de
          siempre (label + párrafo, preciso y directo — reescrito
          2026-08-02), solo la paleta cambia de blanco-sobre-negro a
          negro-sobre-blanco. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sobre INKognito"
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] w-[90%] max-w-[480px] max-h-[85vh] overflow-y-auto bg-white border border-zinc-200 shadow-xl rounded-lg px-9 py-10 transition-all duration-300 ease-in-out ${
          aboutOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setAboutOpen(false)}
          aria-label="Cerrar"
          className="absolute top-5 right-5 bg-transparent border-none cursor-pointer text-zinc-400 text-xl hover:text-black transition-colors"
        >
          ✕
        </button>

        <p className="text-zinc-400 text-[10px] tracking-[0.3em] uppercase mb-6">Sobre INKognito</p>

        <p className="text-zinc-900 text-xl font-bold tracking-[0.05em] uppercase mb-7 leading-[1.3]">
          INKognito.<br />Una forma de ver el mundo.
        </p>

        <div className="mb-5">
          <p className="text-zinc-500 text-[10px] font-bold tracking-[0.25em] uppercase mb-2">Origen</p>
          <p className="text-zinc-600 text-sm leading-[1.8] tracking-[0.03em]">
            Disciplina, arte, identidad. Nace de alguien que pregunta demasiado — que quiso construir algo real, desde cero, con intención.
          </p>
        </div>

        <div className="mb-5">
          <p className="text-zinc-500 text-[10px] font-bold tracking-[0.25em] uppercase mb-2">Qué es hoy</p>
          <p className="text-zinc-600 text-sm leading-[1.8] tracking-[0.03em]">
            Un ecosistema digital que nació del tatuaje y creció hacia el comercio: catálogos en línea con proveedores locales y nacionales verificados, para que Urabá tenga acceso a productos y servicios reales en línea.
          </p>
        </div>

        <div>
          <p className="text-zinc-500 text-[10px] font-bold tracking-[0.25em] uppercase mb-2">Visión</p>
          <p className="text-zinc-600 text-sm leading-[1.8] tracking-[0.03em]">
            Construir, desde Urabá, la infraestructura digital que conecte proveedores y compradores de todas partes de Colombia de manera online.
          </p>
        </div>

        <p className="text-zinc-900 text-[13px] font-bold tracking-[0.2em] uppercase mt-7">
          Una visión. Dejar marca.
        </p>
      </div>

      <LegalModal type={legalOpen} variant="ecosystem" onClose={() => setLegalOpen(null)} />
    </>
  )
}

// Título de categoría (2026-09-16) — mayúscula + tracking ancho + tamaño
// reducido, mismo recurso que ya usan los footers de los módulos
// (FooterSupply.jsx etc.) para "Navegación"/"Ecosistema", así la jerarquía
// se siente consistente con el resto del sitio, no un componente aparte.
// Vuelve a mayúscula (2026-09-17, Jose: "Ecosistema y marca, Aliados y
// logística, y Comunidad y legal debe ir en mayúscula, misma lógica que ya
// usamos en los demás") — el 2026-09-16 se había quitado `uppercase` de
// TODO el menú (categorías, items, sub-items) por sentence case; ese
// mismo día, en paralelo, Supply/Store/INK terminaron consolidando el
// patrón contrario para sus propios menús: SOLO el section label va en
// mayúscula, los items (MenuLink de abajo) se quedan en minúscula/frase.
// Esto alinea el menú del ecosistema con ese patrón ya extendido a los
// demás — MenuLink NO cambia, sigue sin `uppercase`.
function MenuSectionLabel({ children }) {
  return (
    <p className="px-4 pt-2 pb-1 text-zinc-400 text-[10px] font-semibold uppercase tracking-wide">
      {children}
    </p>
  )
}

function MenuDivider() {
  return <div className="border-t border-zinc-200 my-3" />
}

// label + (to interno | href externo | onClick) — un solo componente para
// los 3 casos en vez de si/Link/a repetidos en cada sitio de uso. icon
// (2026-09-16, Jose: "con íconos en los ítems principales") — opcional,
// solo los MenuLink/ExpandableSection de nivel superior lo pasan; los
// SubLink de un desplegable se quedan sin ícono, serían ruido a esa
// profundidad.
function MenuLink({ icon: Icon, label, to, href, onClick }) {
  const className = "w-full text-left px-4 py-[14px] text-zinc-800 bg-transparent border-none cursor-pointer tracking-wide text-[14px] font-medium rounded hover:bg-zinc-100 hover:text-black transition-all duration-200 flex items-center gap-3"
  const content = (
    <>
      {Icon && <Icon size={17} className="flex-shrink-0 text-zinc-400" />}
      <span>{label}</span>
    </>
  )
  if (to) {
    return <Link to={to} onClick={onClick} className={className}>{content}</Link>
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  )
}

// Generaliza el desplegable que antes solo existía para "Tattoo Studio" →
// redes sociales (2026-08-02) — ahora lo reusan "Vende en la plataforma",
// "Mi cuenta / perfil" y "Redes sociales", cada uno con su propia lista de
// items (to interno o href externo, igual que MenuLink).
function ExpandableSection({ icon: Icon, label, items, onNavigate }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full text-left px-4 py-[14px] text-zinc-800 bg-transparent border-none cursor-pointer tracking-wide text-[14px] font-medium rounded hover:bg-zinc-100 hover:text-black transition-all duration-200 flex items-center justify-between"
      >
        <span className="flex items-center gap-3">
          {Icon && <Icon size={17} className="flex-shrink-0 text-zinc-400" />}
          {label}
        </span>
        <span
          className="text-zinc-400 text-[10px] transition-transform duration-300"
          style={{ display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▾
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? '600px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="flex flex-col pb-1">
          {items.map((item) => (
            <SubLink key={item.label} {...item} onClick={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  )
}

function SubLink({ label, to, href, action, onClick }) {
  const className = "block px-8 py-[10px] text-zinc-500 hover:text-black tracking-wide text-[13px] font-medium hover:bg-zinc-100 transition-all duration-200 rounded"
  if (to) {
    return <Link to={to} onClick={onClick} className={className}>{label}</Link>
  }
  // `action` — para destinos que se resuelven al hacer clic (p. ej. irAMiSuple
  // mira el token guardado en este navegador), no una URL fija.
  if (action) {
    return (
      <button type="button" onClick={() => { onClick?.(); action() }} className={`${className} w-full text-left bg-transparent border-none cursor-pointer`}>
        {label}
      </button>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
    </a>
  )
}
