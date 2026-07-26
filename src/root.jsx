import { useEffect, useLayoutEffect } from 'react'
import { Meta, Links, Outlet, Scripts, ScrollRestoration, useLocation, useNavigation } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { SupplyCartProvider } from './contexts/SupplyCartContext'
import { StoreCartProvider } from './contexts/StoreCartContext'
import { GymCartProvider } from './contexts/GymCartContext'
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
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

// Antes vivía en main.jsx envolviendo <App/> — ahora tiene que estar DENTRO
// del árbol de rutas (necesita useLocation, que exige contexto de router), así
// que se mueve acá como hermano de <Outlet/> en vez de wrapper desde afuera.
function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname, hash])

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

export default function Root() {
  useAnalyticsScripts()
  return (
    <HelmetProvider>
      <SupplyCartProvider>
        <StoreCartProvider>
          <GymCartProvider>
            <ScrollToHash />
            <NavigationProgress />
            <Outlet />
          </GymCartProvider>
        </StoreCartProvider>
      </SupplyCartProvider>
    </HelmetProvider>
  )
}
