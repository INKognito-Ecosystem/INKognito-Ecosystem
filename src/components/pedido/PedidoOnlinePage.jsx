import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, ImagePlus, X, ShoppingBag, Landmark } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { useSupplyCart } from '../../contexts/SupplyCartContext'
import PedidoSupplyVendorCheckout from './PedidoSupplyVendorCheckout'
import { useStoreCart } from '../../contexts/StoreCartContext'
import { useGymCart } from '../../contexts/GymCartContext'
import { useSupleCart } from '../../contexts/SupleCartContext'
import { WHATSAPP } from '../../config/business'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Mismo Cloudinary (unsigned upload) que ya usa el panel/AgendaPublica.jsx —
// valores públicos por diseño, restringidos del lado de Cloudinary.
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dsywlttay'
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'inkognito-inventario'

// Mismos 10 puntos que cubre Eljach en su ruta fija (Chigorodó↔Turbo). La
// fuente real de cuáles son "cobertura" vive en settings.flete_tabla del
// panel (se valida server-side otra vez en /api/orders/publica) — esto solo
// son las etiquetas para mostrar. Repos separados sin paquete compartido, por
// eso se duplica la misma lista que EljachWeb/src/constants.js a propósito
// (es estable, verificada 2026-07-23).
const MUNICIPIO_LABELS = {
  chigorodo: 'Chigorodó',
  carepa: 'Carepa',
  casaverde: 'Casa Verde',
  reposo: 'El Reposo',
  currulao: 'Currulao',
  apartado: 'Apartadó',
  riogrande: 'Río Grande',
  eltres: 'El Tres',
  coldesa: 'Coldesa',
  turbo: 'Turbo',
}
const MUNICIPIOS = Object.keys(MUNICIPIO_LABELS)

const MODULE_LABELS = { supply: 'INKognito Supply', store: 'INKognito Store', gym: 'INKognito Gym', suplementos: 'INKognito Suple' }

// Tema claro SOLO para Suplementos (2026-09-19, migración de Suple a fondo
// blanco, Jose: el flujo carrito → pedido debe quedar todo blanco). Supply,
// Store y Gym siguen con las clases oscuras de siempre: cada lugar que
// cambia usa `c(oscuro, claro)` — el primer argumento es exactamente la
// clase que ya había, así que para esos módulos el resultado es idéntico.
function ColHead({ n, title, sub, light = false }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span className={`flex-shrink-0 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center ${light ? 'bg-zinc-700' : 'bg-green-600'}`}>
        {n}
      </span>
      <div>
        <h4 className={`text-sm font-bold leading-none ${light ? 'text-zinc-900' : 'text-white'}`}>{title}</h4>
        <span className={`text-[11px] ${light ? 'text-zinc-500' : 'text-gray-500'}`}>{sub}</span>
      </div>
    </div>
  )
}

async function subirComprobante(file) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  fd.append('folder', 'inkognito-comprobantes-pedido')
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: fd })
  const data = await res.json()
  if (!data.secure_url) throw new Error(data.error?.message || 'Error al subir el comprobante')
  return data.secure_url.includes('/upload/') ? data.secure_url.replace('/upload/', '/upload/f_auto,q_auto/') : data.secure_url
}

const inputCls = 'w-full bg-zinc-900 border border-gray-700 text-white p-3.5 rounded outline-none placeholder:text-gray-600'
const inputClsLight = 'w-full bg-zinc-50 border border-zinc-300 text-zinc-900 p-3.5 rounded outline-none placeholder:text-zinc-400 focus:border-zinc-500'

// Footer mínimo — mismo patrón que /jhumaneztattoo/agenda (solo lo
// legalmente necesario, sin links de navegación que compitan con el único
// objetivo de la página). Antes faltaba acá del todo — se notó al probar.
function MiniFooter({ moduleLabel, light = false }) {
  return (
    <footer className={`border-t py-6 px-4 ${light ? 'border-zinc-200 bg-white' : 'border-white/10 bg-black'}`}>
      <div className={`max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-[12px] gap-3 ${light ? 'text-zinc-500' : 'text-gray-500'}`}>
        <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} {moduleLabel || 'INKognito'}. Todos los derechos reservados.</p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/terminos" className={`transition-colors ${light ? 'hover:text-zinc-900' : 'hover:text-white'}`}>Términos</Link>
          <Link to="/privacidad" className={`transition-colors ${light ? 'hover:text-zinc-900' : 'hover:text-white'}`}>Privacidad</Link>
          <span>Desarrollado por INKognito</span>
        </div>
      </div>
    </footer>
  )
}

// Landing pública única para los 3 módulos con carrito (Supply/Store/Gym) —
// alternativa al pedido por WhatsApp, no lo reemplaza (ver CartDrawer*.jsx,
// que sigue ofreciendo el botón de WhatsApp). El carrito se lee directo del
// contexto (SupplyCartProvider/etc en root.jsx envuelve toda la app), así que
// no hace falta serializar nada al navegar aquí desde el drawer.
export default function PedidoOnlinePage() {
  const { module } = useParams()
  const light = module === 'suplementos'
  const c = (dark, lite) => (light ? lite : dark)
  const supplyCart = useSupplyCart()
  const storeCart = useStoreCart()
  const gymCart = useGymCart()
  const supleCart = useSupleCart()
  const cart = { supply: supplyCart, store: storeCart, gym: gymCart, suplementos: supleCart }[module]

  const [form, setForm] = useState({ nombre: '', telefono: '', direccion: '', municipioSel: '', ciudadOtra: '' })
  const [estado, setEstado] = useState('idle') // idle | enviando | ok | error
  const [errorMsg, setErrorMsg] = useState('')
  const [comprobanteUrl, setComprobanteUrl] = useState(null)
  const [comprobantePreview, setComprobantePreview] = useState(null)
  const [subiendoComprobante, setSubiendoComprobante] = useState(false)
  const [errorComprobante, setErrorComprobante] = useState('')
  const [fleteTabla, setFleteTabla] = useState(null)
  const [fleteOrigen, setFleteOrigen] = useState('chigorodo')
  const [nequi, setNequi] = useState({ numero: '', nombre: '' })
  const [pagarProductoAhora, setPagarProductoAhora] = useState(false)
  const submitted = useRef(false)

  // Verificación EN VIVO del proveedor (fase 5, 2026-08-07; ampliada
  // 2026-08-30) — bug real original: SupplyCartContext guarda si el
  // proveedor tenía Mercado Pago conectado en el momento exacto de
  // agregar el producto, así que ese dato podía quedar "congelado" en
  // falso. Se revalida acá, justo antes del checkout, contra
  // /api/estudios/:id (siempre fresco, sin caché). `vendorInfo` guarda
  // la respuesta completa (no solo cuando ya está conectado) — hace
  // falta para poder BLOQUEAR el checkout cuando el proveedor existe
  // pero todavía no conecta su cuenta (ver más abajo), en vez de dejarlo
  // caer al formulario genérico de Nequi/contraentrega — ese pago
  // llegaría a la cuenta de INKognito por un producto que no es suyo, y
  // el proveedor real nunca se entera del pedido (Jose, 2026-08-30).
  const [vendorInfo, setVendorInfo] = useState(null)
  const [vendorChecking, setVendorChecking] = useState(false)
  // Store multitenant (2026-08-29) — mismo mecanismo de revalidación en
  // vivo que ya tenía Supply, extendido a Store: ambos módulos permiten
  // un carrito bloqueado a un proveedor con Mercado Pago propio.
  const VENDOR_LOCK_MODULES = ['supply', 'store']
  const estudioIdsEnCarrito = VENDOR_LOCK_MODULES.includes(module)
    ? [...new Set(cart?.items.map(i => i.estudioId).filter(Boolean))]
    : []
  useEffect(() => {
    if (estudioIdsEnCarrito.length !== 1) { setVendorInfo(null); return }
    let active = true
    setVendorChecking(true)
    fetch(`${PANEL_URL}/api/estudios/${estudioIdsEnCarrito[0]}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (active) setVendorInfo(d || null) })
      .catch(() => { if (active) setVendorInfo(null) })
      .finally(() => { if (active) setVendorChecking(false) })
    return () => { active = false }
  }, [estudioIdsEnCarrito.join(',')])

  const vendorNombreVivo = vendorInfo ? ((module === 'store' ? vendorInfo.nombre_tienda : vendorInfo.nombre_supply) || vendorInfo.nombre) : null
  const vendorLive = vendorInfo?.mp_conectado ? { estudioId: vendorInfo.id, estudioNombre: vendorNombreVivo } : null

  useEffect(() => {
    fetch(`${PANEL_URL}/api/visual/flete`)
      .then(r => r.json())
      .then(d => {
        try { setFleteTabla(JSON.parse(d.flete_tabla || '{}')) } catch { setFleteTabla({}) }
        if (d.flete_ciudad_origen) setFleteOrigen(d.flete_ciudad_origen)
      })
      .catch(() => setFleteTabla({}))
    fetch(`${PANEL_URL}/api/visual/pedido-online`)
      .then(r => r.json())
      .then(d => setNequi({ numero: d.nequi_numero || '', nombre: d.nequi_nombre || '' }))
      .catch(() => {})
  }, [])

  if (!cart || !MODULE_LABELS[module]) {
    return (
      <>
        <section className="min-h-[60vh] flex items-center justify-center py-16 px-4 bg-black">
          <div className="text-center">
            <p className="text-gray-400">Esta página no existe.</p>
            <Link to="/" className="text-green-500 hover:text-green-400 text-sm font-semibold">Volver al inicio</Link>
          </div>
        </section>
        <MiniFooter />
      </>
    )
  }

  // items/total: si el carrito trae selección estilo Mercado Libre
  // (Supply, Store y Suple — ver CartDrawer*.jsx y sus contextos) usa SOLO
  // lo marcado — el resto queda guardado en el carrito para después, no se
  // pide ni se borra. Gym no tiene ese campo todavía, así que cae al
  // comportamiento de siempre (?? cart.items/cart.total) sin cambios.
  const { clearCart, removeItems } = cart
  const items = cart.selectedItems ?? cart.items
  const total = cart.selectedTotal ?? cart.total
  const update = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }))

  const municipioSeleccionado = Boolean(form.municipioSel && form.municipioSel !== 'otra')
  const ciudadFinal = municipioSeleccionado ? MUNICIPIO_LABELS[form.municipioSel] : form.ciudadOtra.trim()
  // Mobiliario (Industrias Warlock) no tiene contraentrega confirmada —
  // fabrican en Bogotá y envían a todo el país, así que fuerza Nequi sin
  // importar si el destino está en la ruta de Eljach (2026-08-01).
  const tieneMobiliario = items.some(i => i.category === 'Mobiliario')
  // Máquinas de Gym (bajo pedido, soldadas en Chigorodó): Eljach solo cubre
  // Suplementos dentro del módulo Gym, no transporta máquinas — envío
  // nacional con otra transportadora, mismo criterio que Mobiliario
  // (2026-08-02).
  const tieneMaquinaGym = items.some(i => i.category === 'maquinas')
  const enCobertura = municipioSeleccionado && !tieneMobiliario && !tieneMaquinaGym
  // Dentro de cobertura, el cliente elige: contraentrega total, o pagar el
  // producto de una vez por Nequi y dejar solo el flete para pagar en
  // efectivo al repartidor (2026-08-01) — ver getPayBadgeRepartidor() en el
  // panel, ya tenía la rama lista para este caso (metodo_pago='nequi' con
  // flete_monto>0), solo faltaba esta opción en el checkout.
  const metodoPago = enCobertura ? (pagarProductoAhora ? 'nequi' : 'contraentrega') : 'nequi'
  const precioFlete = enCobertura && fleteTabla ? fleteTabla[fleteOrigen]?.[form.municipioSel] : null

  const productosStr = items.map(i => {
    // mixLabel: desglose de calibres de una caja surtida armada a medida
    // (ver AgujasSurtidasPage.jsx) — sin esto, el pedido llegaba al panel
    // solo como "1x Caja Surtida x20", sin decir qué mezcla pidió el
    // cliente (2026-08-02).
    const detalle = i.size ? ` (Talla ${i.size})` : i.mixLabel ? ` (${i.mixLabel})` : i.brand ? ` (${i.brand})` : ''
    return `${i.qty}x ${i.name}${detalle}`
  }).join(', ')

  // Para que el panel pueda descontar stock automáticamente al entregar
  // (PATCH /api/orders/:id) — antes solo se mandaba el texto libre de arriba,
  // que no sirve para identificar de qué fila de inventario descontar.
  const productosJson = items
    .filter(i => i.inventoryId != null)
    .map(i => ({ inventory_id: i.inventoryId, cantidad: i.qty }))

  const onFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setErrorComprobante('')
    setComprobantePreview((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file) })
    setComprobanteUrl(null)
    setSubiendoComprobante(true)
    try {
      const url = await subirComprobante(file)
      setComprobanteUrl(url)
    } catch {
      setErrorComprobante('No se pudo subir el comprobante. Intenta de nuevo con otra foto.')
      setComprobantePreview((prev) => { if (prev) URL.revokeObjectURL(prev); return null })
    } finally {
      setSubiendoComprobante(false)
    }
  }

  const formCompleto = Boolean(
    items.length > 0 && form.nombre && form.telefono && form.direccion && form.municipioSel
    && (municipioSeleccionado || form.ciudadOtra.trim())
    && (metodoPago === 'contraentrega' || comprobanteUrl)
  )

  const enviar = async (e) => {
    e.preventDefault()
    if (!formCompleto) return
    setEstado('enviando')
    setErrorMsg('')
    try {
      const res = await fetch(`${PANEL_URL}/api/orders/publica`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module,
          products: productosStr,
          productos_json: productosJson,
          total_price: total,
          metodo_pago: metodoPago,
          client_phone: form.telefono,
          client_name: form.nombre,
          client_address: form.direccion,
          client_city: ciudadFinal,
          comprobante_url: comprobanteUrl,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error || 'No pudimos enviar tu pedido. Intenta de nuevo.')
        setEstado('error')
        return
      }
      submitted.current = true
      // Si hubo selección parcial (Supply), solo se borra lo que de
      // verdad se pidió — lo que quedó desmarcado sigue en el carrito.
      if (removeItems) removeItems(items.map(i => i.key))
      else clearCart()
      setEstado('ok')
    } catch {
      setErrorMsg('No pudimos enviar tu pedido. Intenta de nuevo o escríbenos por WhatsApp.')
      setEstado('error')
    }
  }

  if (estado === 'ok') {
    return (
      <>
        <section className={`min-h-[60vh] flex items-center justify-center py-16 px-4 ${c('bg-black', 'bg-white')}`}>
          <div className="max-w-md mx-auto text-center">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
            <h3 className={`text-2xl font-black uppercase italic mb-3 ${c('text-white', 'text-zinc-900')}`}>¡Pedido recibido!</h3>
            <p className={`leading-relaxed ${c('text-gray-400', 'text-zinc-600')}`}>
              {metodoPago === 'contraentrega'
                ? `${module === 'supply' ? 'Tommy Supply Tattoo y Eljach mensajería express' : 'El proveedor y Eljach'} coordinarán la entrega de tu paquete. Te contactamos por WhatsApp para confirmar los últimos detalles.`
                : 'En cuanto verifiquemos tu comprobante, tu pedido entra directo a empaque. Te contactamos por WhatsApp para confirmar.'}
            </p>
            <Link to={`/${module}`} className={`inline-block mt-6 text-sm font-semibold ${c('text-green-500 hover:text-green-400', 'text-zinc-700 hover:text-zinc-900')}`}>
              Volver a {MODULE_LABELS[module]}
            </Link>
          </div>
        </section>
        <MiniFooter moduleLabel={MODULE_LABELS[module]} light={light} />
      </>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <section className={`min-h-[60vh] flex items-center justify-center py-16 px-4 ${c('bg-black', 'bg-white')}`}>
          <div className="text-center">
            <ShoppingBag size={40} className={`mx-auto mb-4 ${c('text-gray-700', 'text-zinc-300')}`} />
            <p className={`mb-2 ${c('text-gray-400', 'text-zinc-500')}`}>Tu carrito de {MODULE_LABELS[module]} está vacío.</p>
            <Link to={`/${module}`} className={`text-sm font-semibold ${c('text-green-500 hover:text-green-400', 'text-zinc-700 hover:text-zinc-900')}`}>
              Ir a {MODULE_LABELS[module]} →
            </Link>
          </div>
        </section>
        <MiniFooter moduleLabel={MODULE_LABELS[module]} light={light} />
      </>
    )
  }

  // Carrito bloqueado a un proveedor con Mercado Pago propio (fase 5,
  // 2026-08-07) — checkout completamente distinto (sin nequi/contraentrega/
  // Eljach, paga directo por Split), ver PedidoSupplyVendorCheckout.jsx.
  // vendorLive (no cart.vendorLock) es la fuente de verdad — ver el efecto
  // de arriba, evita el bug de "conectado pero el botón no aparece".
  if (VENDOR_LOCK_MODULES.includes(module) && estudioIdsEnCarrito.length === 1 && vendorChecking && !vendorInfo) {
    return (
      <>
        <section className="min-h-[60vh] flex items-center justify-center py-16 px-4 bg-black">
          <p className="text-gray-500 text-sm">Cargando...</p>
        </section>
        <MiniFooter moduleLabel={MODULE_LABELS[module]} />
      </>
    )
  }

  if (VENDOR_LOCK_MODULES.includes(module) && vendorLive) {
    return (
      <>
        <PedidoSupplyVendorCheckout cart={{ ...cart, vendorLock: vendorLive }} module={module} />
        <MiniFooter moduleLabel={MODULE_LABELS[module]} />
      </>
    )
  }

  // Proveedor real pero SIN Mercado Pago conectado todavía (2026-08-30,
  // Jose) — a propósito NO cae al formulario genérico de abajo: ese pago
  // (Nequi o contraentrega) le llegaría a INKognito por un producto que
  // no es suyo, y el proveedor nunca se enteraría del pedido (esa
  // información solo le llega vía el webhook del checkout de Split, que
  // acá no puede correr sin una cuenta conectada). Se ofrece contactar a
  // la tienda directo por SU propio WhatsApp — nunca el de INKognito.
  if (VENDOR_LOCK_MODULES.includes(module) && estudioIdsEnCarrito.length === 1 && vendorInfo && !vendorInfo.mp_conectado) {
    return (
      <>
        <section className="min-h-[60vh] flex items-center justify-center py-16 px-4 bg-black">
          <div className="max-w-md mx-auto text-center">
            <Landmark size={40} className="text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-black uppercase italic mb-3 text-white">Pago en línea no disponible todavía</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              {vendorNombreVivo || 'Esta tienda'} todavía no conecta su cuenta de pago, así que no podemos procesar este pedido en línea por ahora.
            </p>
            {vendorInfo.whatsapp ? (
              <a
                href={`https://wa.me/${vendorInfo.whatsapp}?text=${encodeURIComponent(`Hola, quiero comprar un producto de tu catálogo en INKognito ${module === 'store' ? 'Store' : 'Supply'}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white font-black py-3.5 px-8 rounded uppercase tracking-widest text-sm hover:bg-green-500 transition-all"
              >
                <FaWhatsapp size={16} />
                Escribirle directo por WhatsApp
              </a>
            ) : (
              <p className="text-gray-500 text-sm">Intenta más tarde, o quita este producto del carrito.</p>
            )}
            <div className="mt-6">
              {/* 2026-08-30 (Jose: "me mandó al ecosistema, y no a la
                  tienda en la que estaba parado") — antes volvía siempre
                  al módulo genérico (/store, /supply); ahora vuelve al
                  perfil del proveedor específico del que venía el carrito. */}
              <Link
                to={module === 'store' ? `/store/${vendorInfo.slug || `estudio/${vendorInfo.id}`}` : `/supply/${vendorInfo.slug || `estudio/${vendorInfo.id}`}`}
                className="text-gray-500 hover:text-gray-300 text-xs"
              >
                ← Volver a {vendorNombreVivo || MODULE_LABELS[module]}
              </Link>
            </div>
          </div>
        </section>
        <MiniFooter moduleLabel={MODULE_LABELS[module]} />
      </>
    )
  }

  const inputClass = c(inputCls, inputClsLight)
  // Clases completas y literales (no `lg:${x}`) — Tailwind solo genera lo
  // que encuentra escrito entero en el código.
  const dividers = c('divide-gray-800', 'divide-zinc-200')
  const dividersLg = c('lg:divide-gray-800', 'lg:divide-zinc-200')
  const dividersSm = c('sm:divide-gray-800', 'sm:divide-zinc-200')
  const ambarNota = c('text-amber-500/90', 'text-amber-700')

  return (
    <>
    <section className={`py-10 md:py-16 px-4 border-t ${c('bg-black border-white/5', 'bg-white border-zinc-200')}`}>
      <div className="max-w-[1320px] mx-auto">
        <p className={`text-xs uppercase tracking-[0.25em] text-center mb-2 ${c('text-gray-500', 'text-zinc-500')}`}>{MODULE_LABELS[module]}</p>
        <h2 className={`text-3xl md:text-5xl font-black uppercase italic mb-3 text-center ${c('text-white', 'text-zinc-900')}`}>
          Agenda tu <span className={c('text-zinc-600', 'text-zinc-400')}>Pedido</span>
        </h2>
        <p className={`text-sm text-center max-w-md mx-auto mb-8 ${c('text-gray-500', 'text-zinc-500')}`}>
          Sin pasar por WhatsApp — tú pones tus datos, nosotros coordinamos el resto.
        </p>

        <form onSubmit={enviar} className={`border rounded-xl p-6 md:p-10 ${c('bg-zinc-950 border-gray-800', 'bg-white border-zinc-200 shadow-sm')}`}>
          <div className={`grid grid-cols-1 lg:grid-cols-4 gap-y-8 lg:gap-y-0 divide-y divide-dashed ${dividers} lg:divide-y-0 lg:divide-x ${dividersLg}`}>

            {/* IZQUIERDA — Tus datos + Entrega, con el relleno abajo */}
            <div className="lg:col-span-2 lg:pr-8 flex flex-col">
              <div className={`grid grid-cols-1 sm:grid-cols-2 divide-y divide-dashed ${dividers} sm:divide-y-0 sm:divide-x ${dividersSm}`}>

                {/* 1 — TUS DATOS */}
                <div className="sm:pr-6 space-y-4">
                  <ColHead n="1" title="Tus datos" sub="Para contactarte" light={light} />
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={e => update('nombre', e.target.value)}
                    placeholder="Tu nombre *"
                    required
                    className={inputClass}
                  />
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={e => update('telefono', e.target.value)}
                    placeholder="Tu WhatsApp o teléfono *"
                    required
                    className={inputClass}
                  />
                  {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
                </div>

                {/* 2 — ENTREGA */}
                <div className="sm:pl-6 pt-6 sm:pt-0 space-y-4">
                  <ColHead n="2" title="Entrega" sub="A dónde te lo llevamos" light={light} />
                  <select
                    value={form.municipioSel}
                    onChange={e => update('municipioSel', e.target.value)}
                    required
                    className={inputClass}
                  >
                    <option value="">¿En qué municipio recibes? *</option>
                    {MUNICIPIOS.map(m => (
                      <option key={m} value={m}>{MUNICIPIO_LABELS[m]}</option>
                    ))}
                    <option value="otra">Otra ciudad de Colombia</option>
                  </select>
                  {form.municipioSel === 'otra' && (
                    <input
                      type="text"
                      value={form.ciudadOtra}
                      onChange={e => update('ciudadOtra', e.target.value)}
                      placeholder="¿Cuál ciudad? *"
                      required
                      className={inputClass}
                    />
                  )}
                  <input
                    type="text"
                    value={form.direccion}
                    onChange={e => update('direccion', e.target.value)}
                    placeholder="Dirección o punto de referencia *"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* RELLENO — explica la alianza con Eljach y por qué cambia el
                  método de pago según la ciudad, en vez de dejarlo vacío.
                  Mobiliario tiene su propio texto: aunque la ciudad esté en
                  la ruta de Eljach, ese pedido igual va por Nequi (el
                  proveedor de mobiliario despacha por su cuenta), así que
                  el texto genérico de "contraentrega si estás en la ruta"
                  sería engañoso para ese caso. Texto neutro a propósito —
                  no nombra al proveedor puntual (2026-09-12, ver nota en
                  SupplyCategoryPage.jsx). */}
              <div className={`mt-6 flex-1 min-h-[110px] bg-gradient-to-br border rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center ${c('from-zinc-900 to-black border-white/10', 'from-zinc-50 to-zinc-100 border-zinc-200')}`}>
                <div className={`absolute -bottom-10 -left-10 w-36 h-36 rounded-full ${c('bg-green-600/10', 'bg-zinc-700/5')}`} />
                {tieneMobiliario ? (
                  <>
                    <h3 className={`relative text-lg font-black uppercase italic mb-2 ${c('text-white', 'text-zinc-900')}`}>
                      Envío de mobiliario
                    </h3>
                    <p className={`relative text-[13px] leading-relaxed ${c('text-gray-400', 'text-zinc-600')}`}>
                      El mobiliario se fabrica bajo pedido y se despacha a cualquier parte de Colombia.
                      Se paga por Nequi antes del despacho — aún no tenemos contraentrega para esta categoría.
                    </p>
                  </>
                ) : tieneMaquinaGym ? (
                  <>
                    <h3 className={`relative text-lg font-black uppercase italic mb-2 ${c('text-white', 'text-zinc-900')}`}>
                      Envío de tu máquina
                    </h3>
                    <p className={`relative text-[13px] leading-relaxed ${c('text-gray-400', 'text-zinc-600')}`}>
                      Cada máquina se fabrica en nuestro taller de Chigorodó bajo estándares de calidad y se envía a cualquier parte de Colombia con transportadora nacional.
                      Se paga el valor completo por Nequi y subes el comprobante — el flete lo pagas aparte, directamente a la transportadora cuando te entregue.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className={`relative text-lg font-black uppercase italic mb-2 ${c('text-white', 'text-zinc-900')}`}>
                      Entrega con Eljach Mensajería
                    </h3>
                    <p className={`relative text-[13px] leading-relaxed ${c('text-gray-400', 'text-zinc-600')}`}>
                      Si estás en la ruta de Eljach (Chigorodó a Turbo) puedes pagar contraentrega, sin adelantos.
                      Fuera de esa zona coordinamos por Nequi antes de despachar tu pedido a cualquier parte de Colombia.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* 3 — TU PEDIDO (a la derecha, más larga por el resumen + pago) */}
            <div className="lg:col-span-2 lg:pl-8 pt-8 lg:pt-0 space-y-4">
              <ColHead n="3" title="Tu pedido" sub="Revisa y confirma cómo pagas" light={light} />

              <div className={`border rounded-lg divide-y ${dividers} ${c('bg-zinc-900 border-gray-800', 'bg-zinc-50 border-zinc-200')}`}>
                {items.map(item => {
                  const unitPrice = parseInt(String(item.price).replace(/[^0-9]/g, ''), 10) || 0
                  return (
                    <div key={item.key} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                      <span className={`truncate ${c('text-gray-300', 'text-zinc-700')}`}>
                        {item.qty}x {item.name}{item.size ? ` (T. ${item.size})` : item.mixLabel ? ` (${item.mixLabel})` : ''}
                      </span>
                      <span className={`flex-shrink-0 ${c('text-gray-500', 'text-zinc-500')}`}>${(unitPrice * item.qty).toLocaleString('es-CO')}</span>
                    </div>
                  )
                })}
                {enCobertura && precioFlete != null && (
                  <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <span className={c('text-gray-300', 'text-zinc-700')}>Flete</span>
                    <span className={c('text-gray-500', 'text-zinc-500')}>${precioFlete.toLocaleString('es-CO')}</span>
                  </div>
                )}
                <div className="flex items-center justify-between px-4 py-3 font-bold">
                  <span className={`text-sm uppercase tracking-wide ${c('text-white', 'text-zinc-900')}`}>Total</span>
                  <span className={c('text-white', 'text-zinc-900')}>${(total + (enCobertura && precioFlete != null ? precioFlete : 0)).toLocaleString('es-CO')}</span>
                </div>
              </div>
              {tieneMobiliario && (
                <p className={`text-[12px] leading-relaxed ${ambarNota}`}>
                  El envío del mobiliario corre por cuenta del cliente — el proveedor coordina el despacho y la transportadora que lleve el producto cobra el flete directamente al entregar.
                </p>
              )}
              {tieneMaquinaGym && (
                <p className={`text-[12px] leading-relaxed ${ambarNota}`}>
                  El envío de la máquina corre por cuenta del cliente — se fabrica en nuestro taller de Chigorodó y se coordina con una transportadora nacional que cobra el envío directamente al entregar (Eljach no cubre este envío).
                </p>
              )}
              {enCobertura && pagarProductoAhora && (
                <p className={`text-[12px] leading-relaxed ${ambarNota}`}>
                  Pagas ${total.toLocaleString('es-CO')} ahora por Nequi{precioFlete != null ? ` — el flete de $${precioFlete.toLocaleString('es-CO')} se paga en efectivo al recibir` : ' — el flete se paga en efectivo al recibir'}.
                </p>
              )}
              <Link to={`/${module}`} className={`inline-block text-xs ${c('text-gray-500 hover:text-gray-300', 'text-zinc-500 hover:text-zinc-800')}`}>
                + Seguir agregando productos
              </Link>

              {/* MÉTODO DE PAGO — se decide según la ciudad elegida arriba;
                  dentro de cobertura el cliente puede elegir entre las 2
                  opciones (2026-08-01, antes solo existía contraentrega). */}
              {form.municipioSel && (
                <>
                  {enCobertura && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPagarProductoAhora(false)}
                        className={`flex-1 py-2.5 rounded-lg border text-[11px] font-bold uppercase tracking-wide transition-colors ${
                          !pagarProductoAhora
                            ? c('border-green-500 bg-green-600/10 text-white', 'border-zinc-700 bg-zinc-100 text-zinc-900')
                            : c('border-gray-700 text-gray-500 hover:border-gray-500', 'border-zinc-300 text-zinc-500 hover:border-zinc-500')
                        }`}
                      >
                        🏍️ Contraentrega
                      </button>
                      <button
                        type="button"
                        onClick={() => setPagarProductoAhora(true)}
                        className={`flex-1 py-2.5 rounded-lg border text-[11px] font-bold uppercase tracking-wide transition-colors ${
                          pagarProductoAhora
                            ? c('border-amber-500 bg-amber-500/10 text-white', 'border-amber-500 bg-amber-50 text-zinc-900')
                            : c('border-gray-700 text-gray-500 hover:border-gray-500', 'border-zinc-300 text-zinc-500 hover:border-zinc-500')
                        }`}
                      >
                        🏦 Pagar producto
                      </button>
                    </div>
                  )}

                  {metodoPago === 'contraentrega' ? (
                    <div className={`border border-green-600/30 rounded-lg p-4 flex items-start gap-3 ${c('bg-zinc-900', 'bg-green-50')}`}>
                      <span className="text-lg leading-none flex-shrink-0">🏍️</span>
                      <div>
                        <p className={`text-sm font-bold ${c('text-white', 'text-zinc-900')}`}>Contraentrega</p>
                        <p className={`text-[13px] leading-relaxed ${c('text-gray-400', 'text-zinc-600')}`}>
                          Pagas al recibir{precioFlete != null ? ` — flete de $${precioFlete.toLocaleString('es-CO')}` : ''}. Sin adelantos.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className={`border border-amber-500/30 rounded-lg p-4 space-y-3 ${c('bg-zinc-900', 'bg-amber-50')}`}>
                      <div className="flex items-start gap-3">
                        <Landmark size={18} className={`flex-shrink-0 mt-0.5 ${c('text-amber-500', 'text-amber-600')}`} />
                        <div>
                          <p className={`text-sm font-bold ${c('text-white', 'text-zinc-900')}`}>Pago por Nequi</p>
                          <p className={`text-[13px] leading-relaxed ${c('text-gray-400', 'text-zinc-600')}`}>
                            {enCobertura
                              ? `Pagas el producto ahora — el flete${precioFlete != null ? ` de $${precioFlete.toLocaleString('es-CO')}` : ''} se paga en efectivo al repartidor`
                              : tieneMobiliario
                                ? 'El mobiliario se envía a todo el país desde Bogotá y se paga antes de despachar'
                                : tieneMaquinaGym
                                  ? 'Tu máquina se fabrica en Chigorodó y se envía a todo el país — se paga antes de despachar'
                                  : 'Fuera de la ruta de Eljach se paga antes de despachar'}
                            {nequi.numero ? ` — al ${nequi.numero}${nequi.nombre ? `, a nombre de ${nequi.nombre}` : ''}` : ''}.
                          </p>
                        </div>
                      </div>

                      {comprobantePreview ? (
                      <div className="relative inline-block">
                        <img src={comprobantePreview} alt="Comprobante" className={`h-20 w-20 object-cover rounded border ${c('border-gray-700', 'border-zinc-300')}`} />
                        {subiendoComprobante && (
                          <div className="absolute inset-0 bg-black/60 rounded flex items-center justify-center text-[9px] text-gray-300">Subiendo...</div>
                        )}
                        <button
                          type="button"
                          onClick={() => { setComprobantePreview(p => { if (p) URL.revokeObjectURL(p); return null }); setComprobanteUrl(null) }}
                          className={`absolute -top-2 -right-2 border rounded-full p-1 ${c('bg-zinc-800 border-gray-600 hover:bg-zinc-700', 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-100')}`}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <label className={`w-full flex items-center justify-center gap-2 border border-dashed p-3 rounded cursor-pointer transition-colors ${c('bg-zinc-950 border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-400', 'bg-white border-zinc-300 text-zinc-500 hover:border-zinc-500 hover:text-zinc-700')}`}>
                        <ImagePlus size={16} />
                        <span className="text-sm">Adjuntar comprobante de pago *</span>
                        <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                      </label>
                    )}
                    {errorComprobante && <p className="text-red-500 text-xs">{errorComprobante}</p>}
                  </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className={`mt-8 pt-7 border-t flex flex-col md:flex-row items-center justify-between gap-5 ${c('border-gray-800', 'border-zinc-200')}`}>
            <p className={`text-[11px] text-center md:text-left leading-relaxed max-w-sm ${c('text-gray-600', 'text-zinc-500')}`}>
              Te contactamos por WhatsApp para confirmar los últimos detalles de tu entrega.
            </p>
            <button
              type="submit"
              disabled={estado === 'enviando' || subiendoComprobante || !formCompleto}
              className={`w-full md:w-auto flex-shrink-0 text-white font-black py-4 px-6 md:px-10 rounded uppercase tracking-normal md:tracking-widest text-sm md:text-base whitespace-nowrap transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${c('bg-green-600 hover:bg-green-500', 'bg-zinc-700 hover:bg-zinc-800')}`}
            >
              {estado === 'enviando' ? 'Agendando...' : subiendoComprobante ? 'Subiendo comprobante...' : 'Agendar pedido'}
            </button>
          </div>

          <div className={`pt-5 mt-5 border-t text-center ${c('border-gray-800', 'border-zinc-200')}`}>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola, quiero hacer un pedido en ' + MODULE_LABELS[module])}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs font-medium inline-flex items-center gap-1.5 transition-colors ${c('text-gray-500 hover:text-green-500', 'text-zinc-500 hover:text-green-600')}`}
            >
              <FaWhatsapp size={14} />
              Prefiero coordinarlo por WhatsApp
            </a>
          </div>
        </form>
      </div>
    </section>
    <MiniFooter moduleLabel={MODULE_LABELS[module]} light={light} />
    </>
  )
}
