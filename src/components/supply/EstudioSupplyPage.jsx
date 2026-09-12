import { useLoaderData, redirect, useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { Award, MapPin, Menu } from 'lucide-react'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import FooterSupply from './FooterSupply'
import NavbarCategory from './NavbarCategory'
import BrandCatalogSection from './BrandCatalogSection'
import CajaSurtidaWidget from './CajaSurtidaWidget'
import EstudioSupplyOwnerPanel from './EstudioSupplyOwnerPanel'
import { fetchCatalogEstudio } from '../../hooks/useCatalog'
import { SUPPLY_CATEGORIES_ORDER } from '../../data/supplyCategoriesOrder'
import { urlGoogleMaps } from '../artistas/mapaUrl'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const EDIT_TOKEN_KEY_PREFIX = 'supply_edit_token_'

// Supply multitenant (fase 4, 2026-08-07) — catálogo filtrado de un
// estudio-vendedor específico, a donde llega alguien que entró desde su
// perfil en Tattoo Artist Colombia ("Ver su catálogo en Supply"). A
// diferencia de las páginas de marca (Tommy, Warlock — un archivo fijo
// por marca, copy escrito a mano), esta es dinámica: cualquier estudio
// con vende_supply activo tiene esta misma página, sin tocar código.
export async function loader({ params, request }) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')
  let estudio = null, products = [], esDueno = false, cloud_name = null, upload_preset = null
  try {
    const estudioRes = params.slug
      ? await fetch(`${PANEL_URL}/api/estudios-por-slug/${encodeURIComponent(params.slug)}`)
      : await fetch(`${PANEL_URL}/api/estudios/${params.id}`)
    estudio = estudioRes.ok ? await estudioRes.json() : null
  } catch {
    estudio = null
  }
  // Link viejo con id numérico (2026-09-12, Jose: "debería llevar el
  // nombre del negocio") — mismo criterio que EstudioTiendaPage.jsx: si
  // ya tiene slug (todo estudio nuevo lo trae desde el registro, ver
  // server.js), redirige a la URL bonita en vez de quedarse en /estudio/:id.
  // Fuera del try/catch de arriba a propósito — throw redirect() es un
  // Response, no un error.
  if (params.id && estudio?.slug) {
    throw redirect(`/supply/${estudio.slug}${url.search}`)
  }
  if (estudio) {
    try {
      const catalogo = await fetchCatalogEstudio('supply', estudio.id)
      products = catalogo.products
    } catch {
      products = []
    }
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
  // Botón de gestión (2026-09-12, Jose: "como en las tiendas de Store, que
  // me dé el link que debo compartir") — mismo mecanismo de verificación
  // que EstudioTiendaPage.jsx: el token de la URL debe ser el de ESTE
  // estudio, no solo un token válido de cualquier otro. La gestión en sí
  // (editar perfil, productos, ventas, Mercado Pago) ya existe en
  // /estudio/mi-perfil — este botón solo la hace fácil de encontrar desde
  // acá, sin duplicar esos formularios.
  if (estudio && token) {
    try {
      const porTokenRes = await fetch(`${PANEL_URL}/api/estudios-por-token?token=${encodeURIComponent(token)}`)
      if (porTokenRes.ok) {
        const porToken = await porTokenRes.json()
        if (porToken.id === estudio.id) {
          esDueno = true
          // Bug real (2026-09-12): GET /api/estudios/:id (público) devuelve
          // nombre_supply con COALESCE(nombre_supply, nombre) — para mostrar
          // algo siempre en el hero está bien, pero como valor INICIAL del
          // formulario de edición eso "congela" el nombre viejo apenas se
          // guarda cualquier cambio (el form manda ese mismo valor de vuelta
          // como si el proveedor lo hubiera escrito a mano). estudios-por-
          // token sí trae el valor real (puede ser null) — se usa ese para
          // la edición, sin perder distribuidor_oficial del objeto público.
          estudio.nombre_supply = porToken.nombre_supply
          const configRes = await fetch(`${PANEL_URL}/api/upload-config`)
          const config = configRes.ok ? await configRes.json() : {}
          cloud_name = config.cloud_name || null
          upload_preset = config.upload_preset || null
        }
      }
    } catch {
      esDueno = false
    }
  }
  return { estudio, products, esDueno, token: esDueno ? token : null, cloud_name, upload_preset }
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
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/${estudio.slug || `estudio/${estudio.id}`}` },
  ]
}

export default function EstudioSupplyPage() {
  const loaderData = useLoaderData()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { products, esDueno, token, cloud_name, upload_preset } = loaderData
  const [estudio, setEstudio] = useState(loaderData.estudio)
  useEffect(() => { setEstudio(loaderData.estudio) }, [loaderData.estudio])

  // Recordar el acceso del dueño (2026-09-13) — mismo patrón exacto que
  // EstudioTiendaPage.jsx: si esta carga trajo un token válido, se guarda
  // para no tener que volver a pegarlo cada vez que el dueño vuelve a su
  // propio catálogo (ej. buscándose a sí mismo desde el módulo, sin
  // token en el link); si no hay token en la URL pero sí uno guardado
  // para este mismo estudio, se agrega a la URL para que el loader lo
  // revalide. Antes esto solo existía en Store — acá el dueño de Supply
  // nunca recuperaba su acceso solo, tenía que guardar el link con
  // ?token= a mano.
  useEffect(() => {
    if (!estudio) return
    const key = EDIT_TOKEN_KEY_PREFIX + estudio.id
    if (esDueno && token) {
      try { localStorage.setItem(key, token) } catch {}
      return
    }
    if (!searchParams.get('token')) {
      try {
        const guardado = localStorage.getItem(key)
        if (guardado) navigate(`?token=${encodeURIComponent(guardado)}`, { replace: true })
      } catch {}
    }
  }, [estudio, esDueno, token])

  // Abre el panel solo si ya se sabe que es el dueño Y viene de un
  // contexto donde tiene sentido verlo de una (recién verificó su correo,
  // o acaba de volver de conectar Mercado Pago) — mismo criterio que
  // EstudioTiendaPage.jsx. Sin esto, un proveedor recién registrado nunca
  // veía el link para compartir a menos que encontrara el botón solo.
  const [panelAbierto, setPanelAbierto] = useState(
    () => esDueno && (searchParams.get('bienvenida') === '1' || searchParams.get('mp') != null)
  )

  // Tooltip de onboarding sobre el botón de gestión (2026-09-12) — mismo
  // patrón que EstudioTiendaPage.jsx (localStorage propio, una sola vez).
  // Bug real (Jose, 2026-09-13): con bienvenida=1 el panel se auto-abre Y
  // el tooltip se activaba al mismo tiempo, tapado detrás del panel (z
  // más bajo) — recién se veía al CERRAR el panel, señalando un botón que
  // el dueño ya usó. Si el panel se auto-abrió, el tooltip no tiene nada
  // que enseñar — se marca como visto de una vez, sin mostrarlo nunca.
  const [tooltipVisible, setTooltipVisible] = useState(false)
  useEffect(() => {
    if (!esDueno) return
    try {
      if (panelAbierto) {
        localStorage.setItem('kg_tooltip_supply_panel_visto', '1')
        return
      }
      if (!localStorage.getItem('kg_tooltip_supply_panel_visto')) setTooltipVisible(true)
    } catch {}
  }, [esDueno])
  const cerrarTooltip = () => {
    try { localStorage.setItem('kg_tooltip_supply_panel_visto', '1') } catch {}
    setTooltipVisible(false)
  }

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
      <NavbarCategory pageName={nombreSupply} hideMenu={esDueno} />

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

          <div className="relative max-w-md pb-4 min-w-0 flex-1">
            <div className="bg-gray-100 border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-start justify-between gap-2">
              <div className="min-w-0">
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
              {/* Botón hamburguesa (2026-09-12) — SOLO se renderiza si el
                  loader confirmó que el token de la URL es de este mismo
                  estudio. Un cliente normal nunca ve esto ni rastro de él
                  en el HTML. Abre el panel con el link para compartir y
                  accesos directos a editar perfil/productos/ventas (ya
                  construidos en /estudio/mi-perfil — este botón no los
                  duplica, solo los hace fáciles de encontrar desde acá). */}
              {esDueno && (
                <div className="relative flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => { setPanelAbierto(true); cerrarTooltip() }}
                    aria-label="Gestionar mi catálogo"
                    className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                  >
                    <Menu size={20} />
                  </button>
                  {tooltipVisible && (
                    <div className="absolute z-20 top-full right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-gray-900 rounded-xl p-4 shadow-xl text-left">
                      <span className="absolute -top-1.5 right-3 w-3 h-3 bg-gray-900 rotate-45" />
                      <p className="text-xs leading-relaxed text-gray-200">
                        Toca acá para copiar el link de tu catálogo, editar tu perfil, subir productos y ver tus ventas.
                      </p>
                      <button
                        onClick={cerrarTooltip}
                        className="mt-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:opacity-80 transition-opacity"
                      >
                        Entendido
                      </button>
                    </div>
                  )}
                </div>
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

        {/* Redes + WhatsApp (2026-09-13) — mismo bloque que ya usa
            EstudioTiendaPage.jsx en Store; acá nunca se había agregado, así
            que un proveedor con sus redes cargadas en su perfil no las veía
            reflejadas en su propio catálogo. Bio queda afuera a propósito
            (Jose: "de momento no activemos la bio"). */}
        {(estudio.instagram || estudio.facebook || estudio.whatsapp) && (
          <div className="max-w-7xl mx-auto flex items-center gap-3 mt-4">
            {estudio.whatsapp && (
              <a href={`https://wa.me/${estudio.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold" style={{ backgroundColor: '#25D366' }}>
                <FaWhatsapp size={13} /> WhatsApp
              </a>
            )}
            {estudio.instagram && (
              <a href={estudio.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white bg-gray-900">
                <FaInstagram size={14} />
              </a>
            )}
            {estudio.facebook && (
              <a href={estudio.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white bg-gray-900">
                <FaFacebook size={14} />
              </a>
            )}
          </div>
        )}
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

      {panelAbierto && (
        <EstudioSupplyOwnerPanel
          estudio={estudio}
          token={token}
          cloud_name={cloud_name}
          upload_preset={upload_preset}
          onClose={() => setPanelAbierto(false)}
          onEstudioUpdate={(nuevo) => setEstudio((e) => ({ ...e, ...nuevo }))}
        />
      )}
    </div>
  )
}
