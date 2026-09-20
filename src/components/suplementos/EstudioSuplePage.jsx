import { useLoaderData, redirect, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, MapPin, Menu, Bell } from 'lucide-react'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import FooterSuple from './FooterSuple'
import NavbarSuple from './NavbarSuple'
import SupleMobileNav from './SupleMobileNav'
import { SuplCard } from './SuplCard'
import EstudioSupleOwnerPanel from './EstudioSupleOwnerPanel'
import { fetchCatalogEstudio } from '../../hooks/useCatalog'
import { urlGoogleMaps } from '../artistas/mapaUrl'
import { SUPLE_CATEGORIES_ORDER } from '../../data/supleCategoriesOrder'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const EDIT_TOKEN_KEY_PREFIX = 'suple_edit_token_'
const SUPLE_CATEGORIAS_ORDEN = SUPLE_CATEGORIES_ORDER.map(c => c.categoria)

// Suple multitenant (2026-09-20) — calco exacto de EstudioTiendaPage.jsx
// (Store): catálogo público de un vendedor Y AL MISMO TIEMPO su único panel
// de gestión (perfil y catálogo son la misma cosa, mismo criterio que
// Store). Un visitante normal ve el catálogo de siempre; el dueño (token
// válido para ESTE estudio) ve además el botón/campana de gestión.
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
  // Link viejo con id numérico — si el vendedor ya tiene slug, esa es la
  // URL canónica; redirige preservando ?token= y cualquier otro parámetro
  // (?bienvenida=1, ?mp=ok). Mismo criterio que EstudioTiendaPage.jsx.
  if (params.id && estudio?.slug) {
    throw redirect(`/suplementos/${estudio.slug}${url.search}`)
  }
  if (estudio) {
    try {
      const catalogo = await fetchCatalogEstudio('suplementos', estudio.id)
      products = catalogo.products
    } catch {}
  }
  // Verificación de dueño — el botón de gestión solo se renderiza si el
  // token de la URL es de verdad el de ESTE vendedor (compara contra el id
  // de la ruta). La validación real de cada acción sigue viviendo en el
  // backend (PUT/POST con el token) — esto solo decide si mostrar el botón.
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
  if (!estudio) return [{ title: 'Vendedor no encontrado | INKognito Suple' }]
  const nombreSuple = estudio.nombre_suple || estudio.nombre
  const title = `${nombreSuple} — Catálogo | INKognito Suple`
  const description = `Productos de ${nombreSuple} disponibles en INKognito Suple.`
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/suplementos/${estudio.slug || `estudio/${estudio.id}`}` },
  ]
}

export default function EstudioSuplePage() {
  const loaderData = useLoaderData()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [estudio, setEstudio] = useState(loaderData.estudio)
  const { products, esDueno, token, cloud_name, upload_preset } = loaderData
  const [panelAbierto, setPanelAbierto] = useState(
    () => esDueno && (searchParams.get('bienvenida') === '1' || searchParams.get('mp') != null)
  )

  useEffect(() => { setEstudio(loaderData.estudio) }, [loaderData.estudio])

  const [tooltipVisible, setTooltipVisible] = useState(false)
  useEffect(() => {
    if (!esDueno) return
    try {
      if (!localStorage.getItem('kg_tooltip_suple_panel_visto')) setTooltipVisible(true)
    } catch {}
  }, [esDueno])
  const cerrarTooltip = () => {
    try { localStorage.setItem('kg_tooltip_suple_panel_visto', '1') } catch {}
    setTooltipVisible(false)
  }

  // Campana de notificaciones — mismo patrón de polling 25s que Store.
  const [notif, setNotif] = useState({ ventas_nuevas: 0, envios_actualizados: 0 })
  useEffect(() => {
    if (!esDueno || !token) return
    let cancelado = false
    const cargarNotif = () => {
      fetch(`${PANEL_URL}/api/estudios-notificaciones-por-token?token=${encodeURIComponent(token)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => { if (data && !cancelado) setNotif(data) })
        .catch(() => {})
    }
    cargarNotif()
    const intervalo = setInterval(cargarNotif, 25000)
    return () => { cancelado = true; clearInterval(intervalo) }
  }, [esDueno, token])

  const marcarNotifVista = (tipo) => {
    setNotif((n) => ({ ...n, [tipo === 'ventas' ? 'ventas_nuevas' : 'envios_actualizados']: 0 }))
    fetch(`${PANEL_URL}/api/estudios-notificaciones-vistas-por-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, tipo }),
    }).catch(() => {})
  }

  const totalNotif = (notif.ventas_nuevas || 0) + (notif.envios_actualizados || 0)

  // Recordar el acceso del dueño — mismo patrón que EstudioTiendaPage.jsx.
  useEffect(() => {
    if (!estudio) return
    const key = EDIT_TOKEN_KEY_PREFIX + estudio.id
    if (esDueno && token) {
      try { localStorage.setItem(key, token) } catch {}
      return
    }
    // Token guardado que ya no sirve (vencido) — se borra para que "Mi
    // Suple" vuelva a pedir el correo en vez de dejar al dueño en el
    // catálogo público sin botón de gestión y sin forma de entrar.
    const tokenUrl = searchParams.get('token')
    if (tokenUrl) {
      try { if (localStorage.getItem(key) === tokenUrl) localStorage.removeItem(key) } catch {}
      return
    }
    try {
      const guardado = localStorage.getItem(key)
      if (guardado) {
        const params = new URLSearchParams(searchParams)
        params.set('token', guardado)
        navigate(`?${params}`, { replace: true, state: { sinScroll: true } })
      }
    } catch {}
  }, [estudio, esDueno, token])

  if (!estudio) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
        <p className="text-gray-500 text-sm">No encontramos este vendedor.</p>
      </div>
    )
  }

  const nombreSuple = estudio.nombre_suple || estudio.nombre

  const categoriasEnCatalogo = useMemo(() => {
    const presentes = new Set(products.map((p) => p.categoria).filter(Boolean))
    const ordenadas = SUPLE_CATEGORIAS_ORDEN.filter((c) => presentes.has(c))
    const resto = [...presentes].filter((c) => !ordenadas.includes(c))
    return [...ordenadas, ...resto]
  }, [products])
  const [categoriaActiva, setCategoriaActiva] = useState('todos')
  const productosFiltrados = categoriaActiva === 'todos' ? products : products.filter((p) => p.categoria === categoriaActiva)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <NavbarSuple pageName={nombreSuple} hideMenu={esDueno} hideMobileActions />

      <div className="bg-zinc-50 pt-20 md:pt-24 pb-9 px-4 md:px-6">
        <div className="max-w-3xl mx-auto flex items-start gap-3 sm:gap-6">
          <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex-shrink-0">
            {estudio.logo_url ? (
              <img src={estudio.logo_url} alt={nombreSuple} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-300 text-2xl sm:text-4xl font-black">{nombreSuple?.[0]?.toUpperCase() || '?'}</div>
            )}
          </div>

          <div className="relative max-w-md pb-4 min-w-0 flex-1">
            <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="uppercase tracking-[0.25em] text-zinc-400 text-[10px] font-black mb-1">Catálogo de</p>
                <h1 className="text-lg sm:text-2xl font-black uppercase leading-tight">{nombreSuple}</h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest bg-green-600 mt-2">
                  <CheckCircle2 size={12} /> Vendedor verificado
                </span>
              </div>
              {esDueno && (
                <div className="relative flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => { setPanelAbierto(true); cerrarTooltip() }}
                    aria-label={totalNotif > 0 ? `Gestionar mi catálogo — ${totalNotif} notificación${totalNotif === 1 ? '' : 'es'} nueva${totalNotif === 1 ? '' : 's'}` : 'Gestionar mi catálogo'}
                    className="relative flex items-center justify-center w-9 h-9 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                  >
                    {totalNotif > 0 ? <Bell size={20} className="text-amber-600" /> : <Menu size={20} />}
                    {totalNotif > 0 && (
                      <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-red-600 text-white text-[9px] font-black leading-none">
                        {totalNotif > 9 ? '9+' : totalNotif}
                      </span>
                    )}
                  </button>
                  {tooltipVisible && (
                    <div className="absolute z-20 top-full right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-zinc-900 rounded-xl p-4 shadow-xl text-left">
                      <span className="absolute -top-1.5 right-3 w-3 h-3 bg-zinc-900 rotate-45" />
                      <p className="text-xs leading-relaxed text-zinc-200">
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
                className="absolute -bottom-1 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-zinc-300 shadow-md text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-900 active:scale-95 transition-all whitespace-nowrap"
              >
                <MapPin size={11} className="flex-shrink-0" />
                {estudio.municipio}{estudio.departamento ? `, ${estudio.departamento}` : ''}
              </a>
            )}
          </div>
        </div>

        {estudio.bio && (
          <div className="max-w-3xl mx-auto mt-6">
            <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-sm px-4 py-3.5">
              <p className="text-zinc-700 text-sm leading-relaxed">{estudio.bio}</p>
            </div>
          </div>
        )}
        {/* Dirección exacta — nunca se muestra acá (mismo criterio que
            Store): solo la usan la transportadora y el checkout. */}
        {(estudio.instagram || estudio.facebook || estudio.whatsapp) && (
          <div className="max-w-3xl mx-auto flex items-center gap-3 mt-4">
            {estudio.whatsapp && (
              <a href={`https://wa.me/${estudio.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold" style={{ backgroundColor: '#25D366' }}>
                <FaWhatsapp size={13} /> WhatsApp
              </a>
            )}
            {estudio.instagram && (
              <a href={estudio.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white bg-zinc-900">
                <FaInstagram size={14} />
              </a>
            )}
            {estudio.facebook && (
              <a href={estudio.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white bg-zinc-900">
                <FaFacebook size={14} />
              </a>
            )}
          </div>
        )}
      </div>

      <div className="pt-8 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto bg-zinc-50">
        {categoriasEnCatalogo.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
            {['todos', ...categoriasEnCatalogo].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategoriaActiva(c)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wide transition-colors ${
                  categoriaActiva === c ? 'border-zinc-700 bg-zinc-700 text-white' : 'border-zinc-300 text-zinc-500 hover:border-zinc-400 hover:text-zinc-900'
                }`}
              >
                {c === 'todos' ? 'Todos' : c}
              </button>
            ))}
          </div>
        )}

        {productosFiltrados.length === 0 ? (
          <p className="text-zinc-400 text-sm text-center py-16">Este vendedor todavía no tiene productos cargados.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productosFiltrados.map((item) => (
              <SuplCard key={item.name} item={item} />
            ))}
          </div>
        )}
      </div>

      <FooterSuple />

      <div className="h-16 md:hidden bg-white" />

      <SupleMobileNav active={null} />

      {panelAbierto && esDueno && (
        <EstudioSupleOwnerPanel
          estudio={estudio}
          token={token}
          cloud_name={cloud_name}
          upload_preset={upload_preset}
          mpStatus={searchParams.get('mp')}
          notif={notif}
          onNotifVista={marcarNotifVista}
          onClose={() => setPanelAbierto(false)}
          onEstudioUpdate={(nuevo) => setEstudio((e) => ({ ...e, ...nuevo }))}
        />
      )}
    </div>
  )
}
