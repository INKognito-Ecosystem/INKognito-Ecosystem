import { useEffect, useLayoutEffect } from 'react'
import { Meta, Links, Outlet, Scripts, useLocation, useMatches, useNavigation, useNavigationType } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { SupplyCartProvider } from './contexts/SupplyCartContext'
import { StoreCartProvider } from './contexts/StoreCartContext'
import { GymCartProvider } from './contexts/GymCartContext'
import { SupleCartProvider } from './contexts/SupleCartContext'
import './index.css'

const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://inkognito-ecosystem.com/#website',
      url: 'https://inkognito-ecosystem.com/',
      name: 'INKognito',
      description: 'Ecosistema de servicios en Chigorodó, Urabá: estudio de tatuajes, insumos para tatuadores y tienda deportiva.',
      publisher: { '@id': 'https://inkognito-ecosystem.com/#organization' },
      inLanguage: 'es-CO',
    },
    {
      '@type': 'Organization',
      '@id': 'https://inkognito-ecosystem.com/#organization',
      name: 'INKognito',
      url: 'https://inkognito-ecosystem.com/',
      logo: { '@type': 'ImageObject', url: 'https://inkognito-ecosystem.com/logo.png' },
      telephone: '+57-320-791-1013',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+57-320-791-1013',
        contactType: 'customer service',
        areaServed: 'CO',
        availableLanguage: 'Spanish',
      },
    },
    {
      '@type': 'ItemList',
      name: 'Módulos INKognito',
      itemListElement: [
        {
          '@type': 'SiteNavigationElement',
          position: 1,
          name: 'Tattoo Studio — Jose Humanez',
          description: 'Estudio de tatuajes en Chigorodó. Realismo, sombras, línea fina y diseños personalizados. Atendemos Chigorodó, Apartadó, Turbo, Carepa y Mutatá.',
          url: 'https://inkognito-ecosystem.com/jhumaneztattoo',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 2,
          name: 'INKognito Supply — Insumos para tatuadores',
          description: 'Máquinas, tintas, cartuchos y accesorios para tatuadores en Urabá, Antioquia. Despacho a toda Colombia.',
          url: 'https://inkognito-ecosystem.com/supply',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 3,
          name: 'INKognito Store — Ropa y calzado deportivo',
          description: 'Tienda de ropa deportiva, zapatos y guayos en Chigorodó, Urabá antioqueño.',
          url: 'https://inkognito-ecosystem.com/store',
        },
      ],
    },
  ],
}

// Fallback para rutas que todavía no tienen su propio export `meta()` (todo lo
// que no sea el bloque piloto /  y /jhumaneztattoo) — antes vivía como <title>
// y <meta description> estáticos en index.html. Cada ruta puede reemplazarlo
// exportando su propio meta() (gana el de la ruta hoja, no se mezclan).
export function meta() {
  return [
    { title: 'INKognito Ecosystem | Tattoo, Supply y Store en Urabá, Colombia' },
    {
      name: 'description',
      content: 'INKognito: estudio de tatuajes, insumos para tatuadores y tienda deportiva en Urabá, Antioquia. Chigorodó, Apartadó, Turbo, Carepa y toda la región.',
    },
  ]
}

export function Layout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Apaga la restauración nativa de scroll del navegador ANTES de que
            el navegador llegue a restaurarla — hacerlo en un useEffect de
            React (como se intentó primero, ver ScrollToHash) llega demasiado
            tarde: el navegador ya restauró el scroll durante la carga de la
            página, antes de que React hidrate y corra sus efectos. Por eso
            recargar (F5) /jhumaneztattoo estando en "Cuida tu tatuaje"
            seguía volviendo ahí en vez de al hero. */}
        <script dangerouslySetInnerHTML={{ __html: "if ('scrollRestoration' in history) history.scrollRestoration = 'manual';" }} />
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="google-site-verification" content="Hs3ziNnEk3QirSduF0Re7dFBF2se5XiT3bxeH_e0A50" />
        {/* JSON-LD estático: los crawlers lo leen sin ejecutar JS */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }} />
        <Meta />
        <Links />
      </head>
      <body>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=988223313973699&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {children}
        {/* Sin <ScrollRestoration/> a propósito: peleaba con ScrollToHash de
            abajo (ambos actúan en cada cambio de ruta, incluido "atrás" del
            navegador) — a veces ganaba la posición restaurada de
            ScrollRestoration en vez del scroll-to-top/hash determinista que
            ScrollToHash ya maneja para todo el sitio. ScrollToHash es ahora
            la única fuente de verdad para el scroll en cada navegación. */}
        <Scripts />
      </body>
    </html>
  )
}

// Recuerda el scroll de cada entrada del historial (por location.key) para
// poder restaurarlo en navegación "atrás/adelante" — ver nota abajo sobre
// por qué no se usa el <ScrollRestoration/> nativo de react-router.
const scrollPositions = new Map()

// Antes vivía en main.jsx envolviendo <App/> — ahora tiene que estar DENTRO
// del árbol de rutas (necesita useLocation, que exige contexto de router), así
// que se mueve acá como hermano de <Outlet/> en vez de wrapper desde afuera.
function ScrollToHash() {
  const { pathname, hash, key } = useLocation()
  const navigationType = useNavigationType() // 'PUSH' | 'POP' | 'REPLACE'

  // Guarda continuamente el scroll de la página actual bajo su propia key,
  // para tenerlo disponible si el usuario vuelve a ella con "atrás".
  useEffect(() => {
    const onScroll = () => scrollPositions.set(key, window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [key])

  // La restauración nativa del navegador ya se apaga antes, con el script
  // inline en <head> (ver Layout arriba) — hacerlo acá con un efecto de
  // React llegaba demasiado tarde para el caso de recarga (F5). Por eso este
  // componente es la única fuente de verdad para el scroll — pero antes
  // forzaba scroll-to-top/hash en TODA navegación, incluida "atrás", lo que
  // mandaba al usuario al hero en vez de dejarlo donde estaba (reportado en
  // Supply, pero el bug es de todo el sitio). Ahora "atrás/adelante" (POP)
  // restaura la posición guardada arriba en vez de forzar nada.
  useLayoutEffect(() => {
    if (navigationType === 'POP') {
      const saved = scrollPositions.get(key)
      if (saved != null) {
        window.scrollTo({ top: saved, behavior: 'instant' })
        return
      }
      // Sin posición guardada (ej. "atrás" hacia una entrada de antes de
      // cargar la página, como tras un F5) — cae al comportamiento normal.
    }
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash)
        // Si el hash no tiene un elemento real (ej. #antes/#despues de
        // CuidadosPage, que son solo señales internas de tab, no anclas)
        // se cae al tope en vez de dejar el scroll que traía la página
        // anterior — sin esto se veía el footer de la nueva página primero.
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        else window.scrollTo({ top: 0, behavior: 'instant' })
      }, 100)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname, hash, key, navigationType])

  return null
}

// Feedback inmediato al hacer clic en un <Link> — sin esto, cualquier ruta
// con loader() que pega a la API del panel (Railway) se sentía "pegada": el
// clic sí se registraba, pero no había NINGUNA señal visual hasta que el
// fetch del loader terminaba, así que parecía que el botón no había hecho
// nada. useNavigation().state cambia a 'loading' de forma síncrona apenas
// arranca la transición, antes de que resuelva el loader.
function NavigationProgress() {
  const navigation = useNavigation()
  if (navigation.state === 'idle') return null
  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[9999] overflow-hidden bg-black/10">
      <div className="h-full w-1/3 bg-red-600 animate-nav-progress" />
    </div>
  )
}

// GA4 y Meta Pixel se cargan acá (efecto post-hidratación), NO como <script>
// en Layout/<head> — el snippet del Pixel se inserta a sí mismo un
// <script src=fbevents.js> nuevo vía document.createElement/insertBefore, y
// hacer eso DURANTE la hidratación de React corrompe el árbol de <head> que
// React está reconciliando (error #418/423, confirmado con Playwright tanto
// en dev como en el build de producción — suppressHydrationWarning en los
// scripts individuales NO alcanza, porque el nodo insertado desplaza la
// posición de todo lo que viene después). Cargarlos post-mount evita que
// exista siquiera esa ventana de conflicto.
function useAnalyticsScripts() {
  useEffect(() => {
    if (window.gtag) return // evita duplicar en re-renders / HMR

    const gtagScript = document.createElement('script')
    gtagScript.async = true
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-G9KWZEY1GY'
    document.head.appendChild(gtagScript)

    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() { window.dataLayer.push(arguments) }
    window.gtag('js', new Date())
    window.gtag('config', 'G-G9KWZEY1GY')

    ;(function (f, b, e, v, n, t, s) {
      if (f.fbq) return
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      }
      if (!f._fbq) f._fbq = n
      n.push = n
      n.loaded = true
      n.version = '2.0'
      n.queue = []
      t = b.createElement(e)
      t.async = true
      t.src = v
      s = b.getElementsByTagName(e)[0]
      s.parentNode.insertBefore(t, s)
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
    window.fbq('init', '988223313973699')
    window.fbq('track', 'PageView')
  }, [])
}

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Deriva el módulo de negocio del pathname — reglas fijas sobre el árbol
// real de rutas (ver routes.js), no heurística. Todo lo de tatuajes vive
// fuera de un prefijo único (/jhumaneztattoo, /tattoo-artist-colombia,
// /artista/:id, /portafolio, /cuidados, /agendaenlinea), así que se listan
// explícitamente; el resto de módulos ya vive bajo un solo prefijo.
function moduloDesdeRuta(pathname) {
  if (pathname === '/') return 'home'
  if (pathname.startsWith('/supply')) return 'supply'
  if (pathname.startsWith('/store')) return 'store'
  if (pathname.startsWith('/gym')) return 'gym'
  if (pathname.startsWith('/suplementos')) return 'suplementos'
  if (
    pathname.startsWith('/jhumaneztattoo') ||
    pathname.startsWith('/tattoo-artist-colombia') ||
    pathname.startsWith('/artista/') ||
    pathname === '/portafolio' || pathname === '/cuidados' || pathname === '/agendaenlinea'
  ) return 'tattoo'
  return 'otro'
}

// UUID persistente en localStorage — sin cookies, sin consentimiento. Solo
// distingue "visitas únicas" de "vistas totales" en el panel; no identifica
// a la persona. Si localStorage falla (modo privado), el tracking sigue
// funcionando, solo se pierde esa deduplicación para esa sesión.
function visitorIdPersistente() {
  try {
    const KEY = 'inkognito_visitor_id'
    let id = localStorage.getItem(KEY)
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(KEY, id) }
    return id
  } catch { return null }
}

// Registra cada cambio de ruta contra el panel — analítica propia
// multitenant, admin-only en el panel (ver GET /api/stats/visitas).
// Client-only a propósito (después de hidratar): no ve tráfico sin JS ni
// bots — tradeoff aceptado, la meta es señal de interés humano real por
// tenant, no volumen crudo de SEO (GA4, ya cargado por useAnalyticsScripts
// arriba, sigue siendo la fuente para eso).
function PageVisitTracker() {
  const { pathname } = useLocation()
  const matches = useMatches()

  useEffect(() => {
    // .data del match más profundo (la página hoja actual) — el resto de
    // matches en la cadena (layouts) no llevan loader propio relevante acá.
    const data = matches[matches.length - 1]?.data
    const estudio = data?.estudio
    const artista = data?.artista

    // fuente solo se llena cuando la página coincide con una de las 3
    // páginas de perfil que sí generan ingreso — mismos 3 valores que usa
    // el UNION ALL de GET /api/stats/multitenant en el panel, para poder
    // cruzar visitas contra ventas por (fuente, tenant_id) sin adivinar.
    let fuente = null
    if (estudio && pathname.startsWith('/store/')) fuente = 'tienda'
    else if (estudio && pathname.startsWith('/supply/estudio/')) fuente = 'supply'
    else if (artista && pathname.startsWith('/artista/')) fuente = 'reservas'

    const payload = {
      path: pathname,
      modulo: moduloDesdeRuta(pathname),
      fuente,
      estudio_id: estudio?.id ?? null,
      estudio_tipo: estudio?.tipo ?? null,
      artista_id: artista?.id ?? null,
      visitor_id: visitorIdPersistente(),
    }

    fetch(`${PANEL_URL}/api/visitas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true, // que sobreviva si el usuario navega/cierra antes de resolver
    }).catch(() => {}) // fire-and-forget — un fallo de tracking nunca debe verse por el visitante
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]) // NO 'matches' en deps — es un array nuevo en cada render aunque el loader data no cambie; solo debe disparar en cambio real de ruta

  return null
}

export default function Root() {
  useAnalyticsScripts()
  return (
    <HelmetProvider>
      <SupplyCartProvider>
        <StoreCartProvider>
          <GymCartProvider>
            <SupleCartProvider>
              <ScrollToHash />
              <NavigationProgress />
              <PageVisitTracker />
              <Outlet />
            </SupleCartProvider>
          </GymCartProvider>
        </StoreCartProvider>
      </SupplyCartProvider>
    </HelmetProvider>
  )
}
