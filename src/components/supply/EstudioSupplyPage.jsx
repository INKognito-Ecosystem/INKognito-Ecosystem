import { useLoaderData, redirect } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { Award, MapPin } from 'lucide-react'
import FooterSupply from './FooterSupply'
import NavbarCategory from './NavbarCategory'
import BrandCatalogSection from './BrandCatalogSection'
import CajaSurtidaWidget from './CajaSurtidaWidget'
import { fetchCatalogEstudio } from '../../hooks/useCatalog'
import { SUPPLY_CATEGORIES_ORDER } from '../../data/supplyCategoriesOrder'
import { urlGoogleMaps } from '../artistas/mapaUrl'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Supply multitenant (fase 4, 2026-08-07) — catálogo filtrado de un
// estudio-vendedor específico, a donde llega alguien que entró desde su
// perfil en Tattoo Artist Colombia ("Ver su catálogo en Supply"). A
// diferencia de las páginas de marca (Tommy, Warlock — un archivo fijo
// por marca, copy escrito a mano), esta es dinámica: cualquier estudio
// con vende_supply activo tiene esta misma página, sin tocar código.
export async function loader({ params }) {
  let estudio = null, products = []
  try {
    const [estudioRes, catalogo] = await Promise.all([
      fetch(`${PANEL_URL}/api/estudios/${params.id}`),
      fetchCatalogEstudio('supply', params.id),
    ])
    estudio = estudioRes.ok ? await estudioRes.json() : null
    products = catalogo.products
  } catch {
    estudio = null
  }
  // fase 6.1 (2026-08-07, Jose) — una marca con landing propia ya hecha a
  // mano (marcasProfesionales/*.jsx) o su propio sitio externo no debe
  // quedarse con esta página genérica vacía como duplicado; el redirect
  // va FUERA del try/catch de arriba a propósito — throw redirect() es un
  // Response, no un error, y un catch genérico lo tragaría silenciosamente.
  // ?flechas=0 (bug real, 2026-08-07, Jose: "el botón de las flechas para
  // navegar entre marcas sigue apareciendo") — quien llega acá viene del
  // perfil del estudio en el buscador, no del menú de marcas; las 4
  // páginas de marcasProfesionales/ leen este parámetro para ocultar sus
  // flechas prev/next solo en ese caso, sin tocar su comportamiento
  // normal cuando se navega entre ellas desde el menú de Supply.
  if (estudio?.catalogo_url) {
    const externo = /^https?:\/\//.test(estudio.catalogo_url)
    const destino = externo ? estudio.catalogo_url : `${estudio.catalogo_url}${estudio.catalogo_url.includes('?') ? '&' : '?'}flechas=0`
    throw redirect(destino)
  }
  return { estudio, products }
}

export function meta({ data }) {
  const estudio = data?.estudio
  if (!estudio) return [{ title: 'Estudio no encontrado | INKognito Supply' }]
  // nombre_supply (2026-08-07): identidad propia para vender en Supply,
  // distinta del nombre de tatuajes (ej. "INKognito Supply" vs "INKognito
  // Tattoo Studio") — esta página nunca lo leía, siempre mostraba el
  // nombre de tatuajes sin importar lo que el proveedor configurara
  // (reportado 2026-08-09).
  const nombreSupply = estudio.nombre_supply || estudio.nombre
  const title = `${nombreSupply} — Catálogo | INKognito Supply`
  const description = `Productos de ${nombreSupply} disponibles en INKognito Supply.`
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/estudio/${estudio.id}` },
  ]
}

export default function EstudioSupplyPage() {
  const { estudio, products } = useLoaderData()

  if (!estudio) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <p className="text-zinc-400 text-sm">No encontramos este estudio.</p>
      </div>
    )
  }

  const nombreSupply = estudio.nombre_supply || estudio.nombre

  // Sub-pestañas por categoría (2026-08-09, Jose: "subpestañas que filtren
  // los productos dentro de su web... como hicimos en el hero del buscador,
  // que filtra estudios, artistas, todos") — mismo patrón de pills de
  // ArtistasColombiaPage.jsx, acá filtrando el catálogo de ESTE proveedor
  // en vez de estudios/artistas. Solo se listan las categorías que este
  // proveedor de verdad tiene cargadas (no las 13 fijas de Supply) —
  // ordenadas según SUPPLY_CATEGORIES_ORDER para que el orden sea el mismo
  // que ya usa el resto de la web, con cualquier categoría fuera de esa
  // lista (Cursos, Kit Externo, Recursos...) al final.
  const categoriasEnCatalogo = useMemo(() => {
    const presentes = new Set(products.map((p) => p.categoria).filter(Boolean))
    const ordenadas = SUPPLY_CATEGORIES_ORDER.map((c) => c.name).filter((c) => presentes.has(c))
    const resto = [...presentes].filter((c) => !ordenadas.includes(c))
    return [...ordenadas, ...resto]
  }, [products])
  const [categoriaActiva, setCategoriaActiva] = useState('todos')
  const productosFiltrados = categoriaActiva === 'todos' ? products : products.filter((p) => p.categoria === categoriaActiva)

  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarCategory pageName={nombreSupply} />

      {/* HERO blanco (2026-08-09, Jose: "el fondo del hero debera ser
          blanco") — mismo look que el perfil del estudio/artista en el
          buscador (EstudioLandingPage.jsx/ArtistaLandingPage.jsx), en vez
          del negro que usa el resto de esta página de catálogo. Todo el
          texto (antes plano, debajo/al lado del logo) ahora vive DENTRO de
          una burbuja de chat — mismo recurso que la burbuja "Sobre mí" de
          ArtistaLandingPage.jsx (rounded-2xl rounded-tl-sm, esquina
          superior izquierda cuadrada). La ubicación queda AFUERA de la
          burbuja, montada mitad adentro/mitad afuera de su borde inferior
          — mismo mecanismo que la insignia de Mercado Pago en la card de
          agenda (absolute, mitad de su propio alto hacia afuera). */}
      <div className="bg-white text-gray-900 pt-20 md:pt-24 pb-9 px-4 md:px-6">
        {/* Logo y burbuja SIEMPRE en una sola fila, incluso en celular
            (2026-08-09, Jose: "que logo y texto ocupen una línea, y no
            texto debajo del logo" — v1 apilaba en mobile con flex-col). */}
        <div className="max-w-7xl mx-auto flex items-start gap-3 sm:gap-6">
          <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-gray-100 bg-gray-100 shadow-md overflow-hidden flex-shrink-0">
            {estudio.logo_url ? (
              <img src={estudio.logo_url} alt={nombreSupply} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl sm:text-4xl font-black">{nombreSupply?.[0]?.toUpperCase() || '?'}</div>
            )}
          </div>

          <div className="relative max-w-md pb-4 min-w-0">
            <div className="bg-gray-100 border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3.5">
              <p className="uppercase tracking-[0.25em] text-gray-400 text-[10px] font-black mb-1">Catálogo de</p>
              <h1 className="text-lg sm:text-2xl font-black uppercase leading-tight">{nombreSupply}</h1>
              {/* Insignia "Distribuidor Oficial" (fase 6, 2026-08-07) —
                  tarifa fija de patrocinio, no comisión (la venta acá no
                  necesariamente pasa por el carrito). Color ámbar a
                  propósito, distinto del azul de toda la identidad de
                  Supply, para que se lea como un sello aparte. */}
              {estudio.distribuidor_oficial && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-black text-[10px] font-black uppercase tracking-widest bg-amber-400 mt-2">
                  <Award size={12} /> Distribuidor Oficial
                </span>
              )}
            </div>
            {estudio.municipio && (
              <a
                href={urlGoogleMaps(estudio)}
                target="_blank"
                rel="noreferrer"
                className="absolute -bottom-1 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-300 shadow-md text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:text-gray-900 active:scale-95 transition-all whitespace-nowrap"
              >
                <MapPin size={11} className="flex-shrink-0" />
                {estudio.municipio}{estudio.departamento ? `, ${estudio.departamento}` : ''}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="pt-8 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        {categoriasEnCatalogo.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
            {['todos', ...categoriasEnCatalogo].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategoriaActiva(c)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wide transition-colors ${
                  categoriaActiva === c ? 'border-blue-500 bg-blue-500 text-white' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                }`}
              >
                {c === 'todos' ? 'Todos' : c}
              </button>
            ))}
          </div>
        )}

        {/* Sin insignia de proveedor por card ni banner "Suministrado
            por..." acá — sería redundante, el título de esta misma
            página ya deja claro de quién es el catálogo (Jose,
            2026-08-09). Esa insignia sí importa en el catálogo general
            de Supply, donde los productos vienen mezclados. */}
        <BrandCatalogSection
          brandName={nombreSupply}
          products={productosFiltrados}
          supplierBadge={null}
          showEstudioBadge={false}
          whatsapp={estudio.whatsapp || undefined}
        />

        {/* Cajas surtidas de cartuchos (2026-08-09) — solo si Jose activó
            el toggle para este proveedor Y ya tiene productos reales en
            Cartuchos (de ahí salen las marcas/precio de referencia, sin
            que el proveedor tenga que cargar nada aparte). Vive en la
            tienda de CADA proveedor, no en una página central, para que
            nunca haya ambigüedad de a quién se le compra. */}
        {estudio.vende_cajas_surtidas && (() => {
          const cartuchos = products.filter((p) => p.categoria === 'Cartuchos')
          return cartuchos.length > 0 ? (
            <CajaSurtidaWidget products={cartuchos} estudioId={estudio.id} estudioNombre={nombreSupply} mpConectado={estudio.mp_conectado} recargoPct={estudio.recargo_caja_surtida_pct || 0} />
          ) : null
        })()}
      </div>

      <FooterSupply />
    </div>
  )
}
