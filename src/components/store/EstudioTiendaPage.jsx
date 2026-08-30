import { useLoaderData, redirect, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, MapPin, Menu } from 'lucide-react'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import FooterStore from './FooterStore'
import NavbarCategoryStore from './NavbarCategoryStore'
import StoreProductCard from './StoreProductCard'
import EstudioTiendaOwnerPanel from './EstudioTiendaOwnerPanel'
import { fetchCatalogEstudio, toProdCard } from '../../hooks/useCatalog'
import { urlGoogleMaps } from '../artistas/mapaUrl'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const EDIT_TOKEN_KEY_PREFIX = 'store_edit_token_'

// Mismo orden que STORE_CATEGORIAS_ESTUDIO en MisProductosTiendaSection.jsx
// (frontend) y server.js (backend) — solo se usa acá para ordenar las
// sub-pestañas por categoría, mismo criterio que SUPPLY_CATEGORIES_ORDER
// en EstudioSupplyPage.jsx.
const STORE_CATEGORIAS_ORDEN = ['Ropa Dama', 'Ropa Caballeros', 'Zapatos Deportivos', 'Zapatos Casuales', 'Guayos', 'Teniguayos', 'Ropa General']

// Store multitenant (2026-08-29; fusión perfil+catálogo 2026-08-30) —
// catálogo público de una tienda, y AL MISMO TIEMPO su único panel de
// gestión: para una tienda, "perfil" y "tienda" son la misma cosa (a
// diferencia de un estudio de tatuajes, que sí puede tener ambas cosas
// separadas porque también vende Supply — ver EstudioEditarPerfilPage.jsx).
// Un visitante normal ve exactamente el catálogo de siempre; el dueño
// (identificado por su token_acceso, mismo mecanismo passwordless de
// siempre) ve además un botón hamburguesa con todo lo que antes vivía en
// el dashboard aparte.
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
  // Link viejo con id numérico (2026-08-30, Jose: "que no sea tan largo")
  // — si la tienda ya tiene slug, esa es la URL canónica; redirige
  // preservando ?token= y cualquier otro parámetro (?bienvenida=1, ?mp=ok).
  // fetchCatalogEstudio necesita el id numérico igual (filtra por
  // inventory.estudio_id), así que se pide después, ya con `estudio`
  // resuelto por cualquiera de los dos caminos.
  if (params.id && estudio?.slug) {
    throw redirect(`/store/${estudio.slug}${url.search}`)
  }
  if (estudio) {
    try {
      const catalogo = await fetchCatalogEstudio('store', estudio.id)
      products = catalogo.products
    } catch {}
  }
  if (estudio?.catalogo_url) {
    const externo = /^https?:\/\//.test(estudio.catalogo_url)
    throw redirect(externo ? estudio.catalogo_url : estudio.catalogo_url)
  }
  // Verificación de dueño (2026-08-30) — el botón de gestión solo se
  // renderiza si el token de la URL es de verdad el de ESTA tienda
  // (compara contra el id de la ruta, no basta con que el token sea
  // válido para CUALQUIER estudio — evita que alguien pegue el token de
  // otra tienda acá y vea el panel igual). La validación real de cada
  // acción sigue viviendo en el backend (PUT/POST con el token) — esto
  // solo decide si mostrar el botón.
  if (estudio && token) {
    try {
      const porTokenRes = await fetch(`${PANEL_URL}/api/estudios-por-token?token=${encodeURIComponent(token)}`)
      if (porTokenRes.ok) {
        const porToken = await porTokenRes.json()
        if (porToken.id === estudio.id) {
          esDueno = true
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
  if (!estudio) return [{ title: 'Tienda no encontrada | INKognito Store' }]
  const nombreTienda = estudio.nombre_tienda || estudio.nombre
  const title = `${nombreTienda} — Catálogo | INKognito Store`
  const description = `Productos de ${nombreTienda} disponibles en INKognito Store.`
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/store/${estudio.slug || `estudio/${estudio.id}`}` },
  ]
}

export default function EstudioTiendaPage() {
  const loaderData = useLoaderData()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [estudio, setEstudio] = useState(loaderData.estudio)
  const { products, esDueno, token, cloud_name, upload_preset } = loaderData
  // Abre el panel solo si ya se sabe que es el dueño Y viene de un
  // contexto donde tiene sentido verlo de una (recién verificó su
  // correo, o acaba de volver de conectar Mercado Pago) — así no hace
  // falta un segundo clic para ver la confirmación de "¡conectado!".
  const [panelAbierto, setPanelAbierto] = useState(
    () => esDueno && (searchParams.get('bienvenida') === '1' || searchParams.get('mp') != null)
  )

  useEffect(() => { setEstudio(loaderData.estudio) }, [loaderData.estudio])

  // Tooltip de onboarding sobre el botón de gestión (2026-08-30) — mismo
  // patrón exacto que ya usan ArtistaEditarPerfilPage.jsx/EstudioEditarPerfilPage.jsx
  // (localStorage propio, se muestra una sola vez). Key dedicada, no la
  // compartida de esos dos — ese botón hace algo distinto acá (abre un
  // panel con menú, no solo activa edición inline).
  const [tooltipVisible, setTooltipVisible] = useState(false)
  useEffect(() => {
    if (!esDueno) return
    try {
      if (!localStorage.getItem('kg_tooltip_tienda_panel_visto')) setTooltipVisible(true)
    } catch {}
  }, [esDueno])
  const cerrarTooltip = () => {
    try { localStorage.setItem('kg_tooltip_tienda_panel_visto', '1') } catch {}
    setTooltipVisible(false)
  }

  // Recordar el acceso del dueño (2026-08-30) — mismo patrón exacto que
  // EstudioEditarPerfilPage.jsx: si esta carga trajo un token válido, se
  // guarda para no tener que volver a pegarlo cada vez que el dueño
  // vuelve; si no hay token en la URL pero sí uno guardado para esta
  // misma tienda, se agrega a la URL para que el loader lo revalide.
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

  if (!estudio) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
        <p className="text-gray-500 text-sm">No encontramos esta tienda.</p>
      </div>
    )
  }

  const nombreTienda = estudio.nombre_tienda || estudio.nombre

  const categoriasEnCatalogo = useMemo(() => {
    const presentes = new Set(products.map((p) => p.categoria).filter(Boolean))
    const ordenadas = STORE_CATEGORIAS_ORDEN.filter((c) => presentes.has(c))
    const resto = [...presentes].filter((c) => !ordenadas.includes(c))
    return [...ordenadas, ...resto]
  }, [products])
  const [categoriaActiva, setCategoriaActiva] = useState('todos')
  const productosFiltrados = categoriaActiva === 'todos' ? products : products.filter((p) => p.categoria === categoriaActiva)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <NavbarCategoryStore pageName={nombreTienda} hideMenu />

      {/* Perfil (avatar/nombre/badge/bio/redes) en max-w-3xl, igual que
          EstudioLandingPage.jsx ("INK") — antes la bio tenía su propio
          max-w-xl + mx-auto anidado dentro de un max-w-7xl, así que se
          autocentraba distinto al resto del bloque y quedaba desfasada
          en PC (2026-08-30, Jose). El catálogo/grid de productos más
          abajo se queda en max-w-7xl a propósito — necesita el ancho
          para mostrar varias columnas, a diferencia de un perfil de
          solo texto como el de INK. */}
      <div className="bg-gray-50 pt-20 md:pt-24 pb-9 px-4 md:px-6">
        <div className="max-w-3xl mx-auto flex items-start gap-3 sm:gap-6">
          <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex-shrink-0">
            {estudio.logo_url ? (
              <img src={estudio.logo_url} alt={nombreTienda} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl sm:text-4xl font-black">{nombreTienda?.[0]?.toUpperCase() || '?'}</div>
            )}
          </div>

          <div className="relative max-w-md pb-4 min-w-0 flex-1">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="uppercase tracking-[0.25em] text-gray-400 text-[10px] font-black mb-1">Catálogo de</p>
                <h1 className="text-lg sm:text-2xl font-black uppercase leading-tight">{nombreTienda}</h1>
                {/* Indicador de confianza (2026-08-29) — a propósito NO
                    reutiliza la insignia "Distribuidor Oficial" (esa es un
                    sello de patrocinio pago para el directorio de
                    tatuadores, semántica distinta). Este es honesto y sin
                    condición de pago: cualquier tienda que llega a esta
                    página ya es, por construcción, activo=TRUE. */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest bg-green-600 mt-2">
                  <CheckCircle2 size={12} /> Tienda verificada
                </span>
              </div>
              {/* Botón hamburguesa (2026-08-30) — SOLO se renderiza si el
                  loader confirmó que el token de la URL es de esta misma
                  tienda. Un cliente normal nunca ve esto ni rastro de él
                  en el HTML. */}
              {esDueno && (
                <div className="relative flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => { setPanelAbierto(true); cerrarTooltip() }}
                    aria-label="Gestionar mi tienda"
                    className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <Menu size={20} />
                  </button>
                  {tooltipVisible && (
                    <div className="absolute z-20 top-full right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-gray-900 rounded-xl p-4 shadow-xl text-left">
                      <span className="absolute -top-1.5 right-3 w-3 h-3 bg-gray-900 rotate-45" />
                      <p className="text-xs leading-relaxed text-gray-200">
                        Toca acá para editar tu perfil, conectar Mercado Pago, subir productos y ver tus ventas — todo desde este mismo botón.
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

        {estudio.bio && (
          <div className="max-w-3xl mx-auto mt-6">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3.5">
              <p className="text-gray-700 text-sm leading-relaxed">{estudio.bio}</p>
            </div>
          </div>
        )}
        {/* Dirección exacta — a propósito NUNCA se muestra acá (2026-08-30,
            Jose, revirtiendo su propia idea inicial: "no la hagas visible
            en el perfil de la tienda, esto será meramente por logística")
            — solo la usan la transportadora (recogida) y el checkout
            (entrega), nunca el catálogo público. */}
        {(estudio.instagram || estudio.facebook || estudio.whatsapp) && (
          <div className="max-w-3xl mx-auto flex items-center gap-3 mt-4">
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

      <div className="pt-8 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto bg-gray-50">
        {categoriasEnCatalogo.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
            {['todos', ...categoriasEnCatalogo].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategoriaActiva(c)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wide transition-colors ${
                  categoriaActiva === c ? 'border-[#C9A84C] bg-[#C9A84C] text-black' : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-900'
                }`}
              >
                {c === 'todos' ? 'Todos' : c}
              </button>
            ))}
          </div>
        )}

        {productosFiltrados.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-16">Esta tienda todavía no tiene productos cargados.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productosFiltrados.map((item) => {
              const prod = toProdCard(item)
              const sizes = item.variantes.map((v) => v.variant).filter(Boolean)
              return (
                <StoreProductCard
                  key={item.name}
                  product={prod}
                  category={item.categoria}
                  sizes={sizes.length ? sizes : CLOTHING_SIZES}
                  showEstudioBadge={false}
                />
              )
            })}
          </div>
        )}
      </div>

      <FooterStore paginaTienda />

      {panelAbierto && esDueno && (
        <EstudioTiendaOwnerPanel
          estudio={estudio}
          token={token}
          cloud_name={cloud_name}
          upload_preset={upload_preset}
          mpStatus={searchParams.get('mp')}
          onClose={() => setPanelAbierto(false)}
          onEstudioUpdate={(nuevo) => setEstudio((e) => ({ ...e, ...nuevo }))}
        />
      )}
    </div>
  )
}
