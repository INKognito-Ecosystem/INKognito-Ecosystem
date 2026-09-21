// Envuelve el handler de streaming SSR provisto por @vercel/react-router —
// ya incluye el chequeo isbot (esperar contenido completo para bots/crawlers
// en vez de solo el shell) y el manejo de skew protection de Vercel. No hace
// falta reescribirlo a mano; solo se le agrega la caché de borde de abajo.
import { handleRequest as vercelHandleRequest, streamTimeout } from '@vercel/react-router/entry.server'

export { streamTimeout }

// ─── Caché de borde para páginas públicas de catálogo (2026-09-21) ───────
// Sin esto, CADA navegación (documento o `.data` de un clic) ejecutaba la
// función en Vercel, que a su vez pegaba al panel en Railway, y salía con
// `max-age=0, must-revalidate` — en producción se medían 0,4-1,2 s por clic.
// Con `s-maxage` la CDN de Vercel sirve la misma respuesta a todos los
// visitantes durante 60 s, y `stale-while-revalidate` sigue sirviendo la
// copia vieja al instante mientras la refresca en segundo plano (mismo
// criterio que los `max-age=60, stale-while-revalidate=300` que ya usan los
// endpoints públicos del panel). Solo aplica a páginas idénticas para todos;
// el checkout revalida stock/precio por su cuenta, así que un dato de hasta
// un minuto no cobra mal a nadie.
const CACHE_BORDE = 'public, s-maxage=60, stale-while-revalidate=300'

const MODULOS = '(?:suplementos|supply|store|gym)'
const RUTAS_PUBLICAS = [
  new RegExp(`^/${MODULOS}$`),
  new RegExp(`^/${MODULOS}/categorias$`),
  new RegExp(`^/${MODULOS}/producto/[^/]+$`),
  /^\/suplementos\/(?:proteinas|creatina|pre-entreno|vitaminas|accesorios)$/,
  /^\/store\/(?:ropa-dama|ropa-general|ropa-caballeros|zapatos-deportivos|zapatos-casuales|guayos|tenis-guayo|accesorios)$/,
  /^\/supply\/(?:machines|cartridges|cartuchos-surtidos|power-supplies|ink|needles|gloves|aftercare|accessories|furniture|bundles|proveedores)$/,
  /^\/supply\/(?:cartridges|ink|brands|mobiliario)\/[^/]+$/,
  /^\/(?:suplementos|store)\/tiendas$/,
]

// Nunca se cachea: URLs con `?token=` (panel del dueño), rutas de registro,
// "mi-catalogo/mi-tienda/mi-supply", resultados de compra, perfiles de
// vendedor (`/:modulo/:slug`) ni nada fuera de la lista de arriba — la lista
// es cerrada a propósito, una ruta nueva empieza SIN caché hasta que se
// agregue acá.
function esRutaPublicaCacheable(request) {
  if (request.method !== 'GET') return false
  const url = new URL(request.url)
  if (url.searchParams.has('token')) return false
  let ruta = url.pathname.replace(/\.data$/, '')
  if (ruta === '/_root') ruta = '/'
  ruta = ruta.replace(/\/+$/, '') || '/'
  return RUTAS_PUBLICAS.some((re) => re.test(ruta))
}

// Si el panel falla (Railway reinicia el servicio en cada deploy, ~1 min de
// 502), los loaders lo atrapan y devuelven listas vacías con status 200 —
// cachear eso dejaría "Selección en preparación" pegado varios minutos para
// todos. Se anota el último fallo de cualquier fetch del servidor (error de
// red o 5xx) y, mientras sea reciente, las respuestas salen sin caché.
let ultimoFalloFetch = 0
if (!globalThis.__inkFetchVigilado) {
  globalThis.__inkFetchVigilado = true
  const fetchOriginal = globalThis.fetch
  globalThis.fetch = async (...args) => {
    try {
      const res = await fetchOriginal(...args)
      if (res.status >= 500) ultimoFalloFetch = Date.now()
      return res
    } catch (e) {
      ultimoFalloFetch = Date.now()
      throw e
    }
  }
}
const hayFalloReciente = () => Date.now() - ultimoFalloFetch < 20_000

const debeCachearse = (request, status) =>
  status === 200 && esRutaPublicaCacheable(request) && !hayFalloReciente()

export default function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext, options) {
  if (debeCachearse(request, responseStatusCode)) responseHeaders.set('Cache-Control', CACHE_BORDE)
  return vercelHandleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext, options)
}

// Clics dentro del sitio: React Router pide `<ruta>.data` en vez del HTML.
export function handleDataRequest(response, { request }) {
  if (debeCachearse(request, response.status)) response.headers.set('Cache-Control', CACHE_BORDE)
  return response
}
