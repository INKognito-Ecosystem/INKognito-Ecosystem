import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Landmark, CheckCircle2, Clock } from 'lucide-react'
import { ZONAS_FLETE, DEPARTAMENTOS, MUNICIPIOS_POR_DEPARTAMENTO, normalize } from '../../data/colombiaGeo'
import ComboboxBuscable from '../artistas/ComboboxBuscable'
import { leerDireccionGuardada } from '../../utils/direccionGuardada'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Carga el SDK de Mercado Pago una sola vez para toda la sesión del
// navegador (2026-09-27, checkout embebido — ver
// project_checkout_pago_embebido_bricks.md) — varios carritos/checkouts
// pueden montarse uno tras otro sin recargar la página; sin este guard se
// insertaría el mismo <script> varias veces.
let mpSdkPromise = null
function cargarSdkMercadoPago() {
  if (window.MercadoPago) return Promise.resolve(window.MercadoPago)
  if (mpSdkPromise) return mpSdkPromise
  mpSdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://sdk.mercadopago.com/js/v2'
    script.onload = () => resolve(window.MercadoPago)
    script.onerror = () => { mpSdkPromise = null; reject(new Error('No se pudo cargar Mercado Pago')) }
    document.head.appendChild(script)
  })
  return mpSdkPromise
}

// Endpoint de compra por módulo — Store multitenant (2026-08-29) y Suple
// multitenant (2026-09-20) reusan este mismo componente en vez de
// clonarlo: a diferencia de los endpoints de backend (donde categoría/
// variante sí divergen de verdad entre módulos, ver server.js), este
// componente de presentación no tiene ninguna rama de negocio real que
// cambie entre ellos — solo el endpoint y el link de "seguir agregando"
// difieren.
const COMPRAR_ENDPOINT = { supply: 'estudios-supply-comprar', store: 'estudios-tienda-comprar', suplementos: 'estudios-suple-comprar' }

// Cálculo/aviso de flete ("Ruta del Golfo") — SOLO Store y Suple: son los
// únicos módulos con transportadoras/flete_tabla/política de envío
// configurada por tienda. Store cubre solo Urabá (combobox de ZONAS_FLETE
// fijo); Suple es nacional (un vendedor puede estar en cualquier parte de
// Colombia, y su comprador también) — combobox Departamento+Municipio,
// mismo patrón que los formularios de registro. `_calcularFlete` en el
// panel ya devuelve 0 sin error cuando la combinación no está en
// flete_tabla, así que un comprador fuera de Urabá no rompe nada, solo
// no tiene flete calculado hasta que el vendedor coordine directo.
const SHIPPING_MODULES = ['store', 'suplementos']

// Dirección de entrega obligatoria (2026-09-23, Jose) — los 3 módulos la
// piden ahora, incluido Supply (antes solo pedía teléfono/correo y el
// vendedor coordinaba la dirección a mano por WhatsApp tras el pago). Esto
// es DISTINTO de SHIPPING_MODULES de arriba: Supply pide dirección para
// que le llegue al vendedor por correo, pero no tiene Ruta del Golfo
// (transportadora/flete calculado) — esa integración no se pidió, solo la
// dirección. Supply es nacional igual que Suple, mismo combobox
// Departamento+Municipio.
const ADDRESS_MODULES = ['store', 'suplementos', 'supply']

// Checkout dedicado para un carrito de Supply/Store/Suple bloqueado a un
// vendedor con Mercado Pago propio (fase 5, 2026-08-07; extendido a Store
// 2026-08-29 y a Suple 2026-09-20) — sin nequi/contraentrega genérico: el
// vendedor coordina la entrega directo con el comprador por WhatsApp
// después de pagar, mismo criterio que las reservas de artista. Reemplaza
// el formulario normal de PedidoOnlinePage.jsx solo cuando cart.vendorLock
// está seteado (ver Supply/Store/SupleCartContext.jsx).
export default function PedidoSupplyVendorCheckout({ cart, module = 'supply', fleteTabla }) {
  const { items, vendorLock, total } = cart
  // Todos los módulos van en claro (2026-09-22, mismo pedido de Jose que
  // PedidoOnlinePage.jsx) — antes solo Suplementos.
  const light = true
  const c = (dark, lite) => (light ? lite : dark)
  const inputClass = c(
    'w-full bg-zinc-900 border border-gray-700 text-white p-3.5 rounded outline-none placeholder:text-gray-600',
    'w-full bg-zinc-50 border border-zinc-300 text-zinc-900 p-3.5 rounded outline-none placeholder:text-zinc-400 focus:border-zinc-500'
  )
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', municipio: '', departamento: '', direccion: '', mensaje: '' })
  const [errorMsg, setErrorMsg] = useState('')

  // Ruta del Golfo (2026-09-22) — normaliza igual que _normCiudadFlete en
  // el panel (server.js): sin acentos, solo letras. `normalize()` ya
  // existe en colombiaGeo.js (usada para geolocalización), solo le falta
  // el paso de quitar todo lo que no sea letra.
  const normMunicipio = (s) => (s ? normalize(s).replace(/[^a-z]/g, '') : null)
  const origenNorm = normMunicipio(vendorLock.municipio)
  const destinoNorm = normMunicipio(form.municipio)
  const metaGratis = Number(vendorLock.envioGratisMonto) || 0
  const envioGratis = vendorLock.politicaEnvio === 'siempre_gratis'
    || (vendorLock.politicaEnvio === 'gratis_desde_monto' && metaGratis > 0 && total >= metaGratis)
  const fleteExacto = SHIPPING_MODULES.includes(module) && vendorLock.enCoberturaRuta && origenNorm && destinoNorm && fleteTabla
    ? (fleteTabla[origenNorm]?.[destinoNorm] ?? null)
    : null

  const update = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }))
  const setDepartamento = (nuevo) => setForm(f => ({ ...f, departamento: nuevo, municipio: '' }))
  const setMunicipio = (nuevo) => setForm(f => ({ ...f, municipio: nuevo }))
  const municipiosDisponibles = MUNICIPIOS_POR_DEPARTAMENTO[form.departamento] || []

  const formCompleto = Boolean(
    form.telefono && form.email &&
    (!ADDRESS_MODULES.includes(module) || (
      module === 'store'
        ? (form.municipio && form.direccion.trim())
        : (form.departamento && form.municipio && form.direccion.trim())
    ))
  )

  // Precarga desde "Mi dirección" guardada (2026-09-23, ver
  // GuardarDireccionButton.jsx) — se guarda siempre en forma nacional
  // (departamento + municipio + dirección), la misma que ya usan Suple/
  // Supply, así que ahí el prefill es 1:1. Store usa una lista de zonas
  // más granular (ZONAS_FLETE, incluye corregimientos) — se busca el
  // municipio guardado por nombre entre las etiquetas de esa lista; si no
  // hay match exacto (ej. guardó un municipio fuera de Urabá) el resto del
  // formulario igual queda precargado, solo el municipio se deja para
  // elegir a mano.
  useEffect(() => {
    const guardada = leerDireccionGuardada()
    if (!guardada) return
    setForm(f => {
      const next = { ...f }
      if (guardada.nombre) next.nombre = guardada.nombre
      if (guardada.telefono) next.telefono = guardada.telefono
      if (guardada.email) next.email = guardada.email
      if (guardada.direccion) next.direccion = guardada.direccion
      if (module === 'store') {
        if (guardada.municipio) {
          const buscado = normMunicipio(guardada.municipio)
          const match = Object.entries(ZONAS_FLETE).find(([, label]) => normMunicipio(label) === buscado)
          if (match) next.municipio = match[0]
        }
      } else {
        if (guardada.departamento) next.departamento = guardada.departamento
        if (guardada.municipio) next.municipio = guardada.municipio
      }
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module])

  // Checkout embebido con Payment Brick (2026-09-27, pieza 2/3 del plan —
  // ver project_checkout_pago_embebido_bricks.md) — reemplaza el botón
  // "Pagar con Mercado Pago" (que redirigía a su página) por el formulario
  // de pago de Mercado Pago incrustado aquí mismo. Todo lo demás (carrito,
  // envío, datos de entrega, lo que le llega al vendedor) se queda igual.
  const [resultado, setResultado] = useState(null) // null | { status, statusDetail }
  const [brickReady, setBrickReady] = useState(false)
  const [brickError, setBrickError] = useState('')
  const brickContainerId = 'mp-payment-brick-container'
  // El callback onSubmit del Brick se define una sola vez, al crearlo — sin
  // esto, seguiría viendo el `form`/`formCompleto` del primer render (stale
  // closure de React), aunque el comprador ya haya llenado sus datos.
  const formRef = useRef(form)
  const formCompletoRef = useRef(formCompleto)
  useEffect(() => { formRef.current = form; formCompletoRef.current = formCompleto })

  const procesarPagoBrick = (mpFormData) => new Promise((resolve, reject) => {
    if (!formCompletoRef.current) {
      setErrorMsg('Completa tus datos de contacto y entrega arriba antes de pagar.')
      reject()
      return
    }
    setErrorMsg('')
    const f = formRef.current
    fetch(`${PANEL_URL}/api/${COMPRAR_ENDPOINT[module]}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        estudio_id: vendorLock.estudioId,
        items: items.filter(i => i.inventoryId != null).map(i => ({
          inventory_id: i.inventoryId,
          cantidad: i.qty,
          // Cajas surtidas (2026-08-09): el inventory_id de arriba es
          // solo referencia de precio real del proveedor — esto le dice
          // al backend que no es literalmente lo comprado, para que no
          // le descuente stock a un producto ajeno a la mezcla.
          ...(i.nombrePersonalizado ? { nombre_personalizado: i.nombrePersonalizado } : {}),
        })),
        cliente_nombre: f.nombre || null,
        cliente_telefono: f.telefono,
        cliente_email: f.email,
        ...(ADDRESS_MODULES.includes(module) ? { cliente_municipio: f.municipio, cliente_direccion: f.direccion.trim() } : {}),
        mensaje: f.mensaje || null,
        mp: mpFormData,
      }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'No pudimos procesar el pago — intenta de nuevo.')
        // PSE (y en teoría Efecty): Mercado Pago entrega una URL a la que
        // hay que mandar al comprador para terminar de autorizar/pagar —
        // mismo salto que ya existía, solo que directo al banco, sin pasar
        // antes por la página de Mercado Pago.
        if (data.accionUrl) { resolve(); window.location.href = data.accionUrl; return }
        // "rejected" NO reemplaza la pantalla — el Brick se queda montado y
        // listo para que el comprador intente de nuevo ahí mismo (mismo
        // comportamiento nativo del widget tras un resolve()); si
        // reemplazáramos la vista por ResultadoPago perderíamos el
        // contenedor del Brick sin volver a crearlo (brickCreadoRef ya
        // quedó en true), dejando un hueco vacío en un reintento.
        if (data.status === 'rejected') {
          setErrorMsg('Tu banco no aprobó este pago — intenta con otra tarjeta o método aquí mismo.')
        } else {
          setResultado({ status: data.status, statusDetail: data.statusDetail })
        }
        resolve()
      })
      .catch((err) => {
        setErrorMsg(err.message || 'No pudimos procesar el pago — intenta de nuevo.')
        reject()
      })
  })

  // Crear el Payment Brick una vez que tengamos la llave pública del
  // vendedor — el monto (`total`) no cambia durante este checkout (carrito
  // bloqueado a un solo vendedor), así que no hace falta recrearlo si el
  // comprador sigue editando sus datos de contacto/entrega más abajo.
  // `activo`/`controllerLocal` (variables del closure, no refs) son a
  // propósito: en desarrollo, StrictMode monta→limpia→remonta este efecto
  // una vez de entrada (para detectar bugs) — con un ref "ya se creó" esa
  // limpieza intermedia deja el Brick a medio crear y nunca se reintenta.
  // Así, cada invocación real del efecto maneja su propio intento de punta
  // a punta, sin pisarse con la siguiente.
  useEffect(() => {
    if (total <= 0) return
    // Vendedor conectado a Mercado Pago pero sin llave pública todavía
    // (ej. el panel aún no desplegó la migración que la trae) — antes se
    // quedaba en "Cargando el formulario de pago..." para siempre, sin
    // avisar nada; ahora se explica en vez de fingir que está cargando.
    if (!vendorLock.mpPublicKey) { setBrickError('El pago en línea no está disponible en este momento — intenta de nuevo en unos minutos o escríbele al vendedor.'); return }
    let activo = true
    let controllerLocal = null
    cargarSdkMercadoPago()
      .then((MercadoPago) => {
        if (!activo) return null
        const mp = new MercadoPago(vendorLock.mpPublicKey, { locale: 'es-CO' })
        return mp.bricks().create('payment', brickContainerId, {
          initialization: { amount: total, payer: { email: form.email || undefined } },
          // Sin "mercadoPago" a propósito: ese método necesita una
          // preferencia creada antes (preferenceId) — no aplica, cobramos
          // directo por /v1/payments (ver _procesarPagoBrick en el panel).
          // Mercado Pago excluye un método si simplemente no está en este
          // objeto (no hace falta una lista de exclusión aparte).
          customization: {
            paymentMethods: { creditCard: 'all', debitCard: 'all', bankTransfer: 'all', ticket: 'all' },
          },
          callbacks: {
            onReady: () => { if (activo) setBrickReady(true) },
            onSubmit: ({ formData }) => procesarPagoBrick(formData),
            onError: (error) => { console.error('[mercadopago brick]', error) },
          },
        })
      })
      .then((controller) => {
        if (!controller) return
        if (!activo) { controller.unmount?.(); return }
        controllerLocal = controller
      })
      .catch(() => { if (activo) setBrickError('No pudimos cargar el formulario de pago. Recarga la página o escríbele a INKognito.') })
    return () => {
      activo = false
      controllerLocal?.unmount?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorLock.mpPublicKey])

  return (
    <section className={`py-10 md:py-16 px-4 border-t ${c('bg-black border-white/5', 'bg-white border-zinc-200')}`}>
      <div className="max-w-2xl mx-auto">
        <p className={`text-xs uppercase tracking-[0.25em] text-center mb-2 ${c('text-gray-500', 'text-zinc-500')}`}>{vendorLock.estudioNombre}</p>
        <h2 className={`text-3xl md:text-5xl font-black uppercase italic mb-3 text-center ${c('text-white', 'text-zinc-900')}`}>
          Confirma tu <span className={c('text-zinc-600', 'text-zinc-400')}>Compra</span>
        </h2>
        <p className={`text-sm text-center max-w-md mx-auto mb-8 ${c('text-gray-500', 'text-zinc-500')}`}>
          Pagas directo a {vendorLock.estudioNombre} por Mercado Pago. En cuanto se apruebe el pago, le llega tu pedido por correo para que lo despache y te escribe por WhatsApp para coordinar la entrega.
        </p>

        <div className={`border rounded-xl p-6 md:p-10 space-y-6 ${c('bg-zinc-950 border-gray-800', 'bg-white border-zinc-200 shadow-sm')}`}>
          <div className={`border rounded-lg divide-y ${c('bg-zinc-900 border-gray-800 divide-gray-800', 'bg-zinc-50 border-zinc-200 divide-zinc-200')}`}>
            {items.map(item => {
              const unitPrice = parseInt(String(item.price).replace(/[^0-9]/g, ''), 10) || 0
              return (
                <div key={item.key} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <span className={`truncate ${c('text-gray-300', 'text-zinc-700')}`}>{item.qty}x {item.name}</span>
                  <span className={`flex-shrink-0 ${c('text-gray-500', 'text-zinc-500')}`}>${(unitPrice * item.qty).toLocaleString('es-CO')}</span>
                </div>
              )
            })}
            {/* Envío (2026-09-22, Ruta del Golfo) — SOLO informativo: no se
                suma a `total` ni al cobro de Mercado Pago de abajo. El
                flete se sigue cobrando aparte (en efectivo, al recibir),
                igual que ya funciona en el checkout genérico de Eljach
                (PedidoOnlinePage.jsx) — decisión de diseño explícita, no
                un olvido. Supply queda fuera de este bloque (no está en
                SHIPPING_MODULES) — sí recolecta municipio/dirección desde
                2026-09-23 (ver ADDRESS_MODULES), pero no tiene
                transportadora/flete_tabla propia, así que no hay nada que
                calcular ni avisar acá todavía. */}
            {SHIPPING_MODULES.includes(module) && (
              envioGratis ? (
                <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className={c('text-gray-300', 'text-zinc-700')}>Envío</span>
                  <span className="font-bold text-green-600">Gratis</span>
                </div>
              ) : form.municipio && vendorLock.enCoberturaRuta && fleteExacto > 0 ? (
                <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className={c('text-gray-300', 'text-zinc-700')}>Envío (se paga al recibir)</span>
                  <span className={c('text-gray-500', 'text-zinc-500')}>${fleteExacto.toLocaleString('es-CO')}</span>
                </div>
              ) : form.municipio && !vendorLock.enCoberturaRuta ? (
                <div className="px-4 py-2.5">
                  <p className={`text-xs leading-relaxed ${c('text-amber-400/90', 'text-amber-700')}`}>
                    Deberás cubrir el envío — {vendorLock.estudioNombre} lo coordina directo contigo al recibir, sin un monto fijo.
                  </p>
                </div>
              ) : null
            )}
            <div className="flex items-center justify-between px-4 py-3 font-bold">
              <span className={`text-sm uppercase tracking-wide ${c('text-white', 'text-zinc-900')}`}>Total</span>
              <span className={c('text-white', 'text-zinc-900')}>${total.toLocaleString('es-CO')}</span>
            </div>
          </div>

          <Link to={`/${module}`} className={`inline-block text-xs ${c('text-gray-500 hover:text-gray-300', 'text-zinc-500 hover:text-zinc-800')}`}>
            + Seguir agregando productos de {vendorLock.estudioNombre}
          </Link>

          <div className="space-y-4">
            <input type="text" value={form.nombre} onChange={e => update('nombre', e.target.value)} placeholder="Tu nombre" className={inputClass} />
            <input type="tel" value={form.telefono} onChange={e => update('telefono', e.target.value)} placeholder="Tu WhatsApp o teléfono *" required className={inputClass} />
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="Tu correo *" required className={inputClass} />
            {module === 'store' && (
              <>
                <select value={form.municipio} onChange={e => update('municipio', e.target.value)} required className={inputClass}>
                  <option value="">Tu municipio de entrega *</option>
                  {Object.entries(ZONAS_FLETE).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <input type="text" value={form.direccion} onChange={e => update('direccion', e.target.value)} placeholder="Dirección exacta — calle, carrera, barrio *" required className={inputClass} />
              </>
            )}
            {/* Suple y Supply comparten el mismo combobox nacional
                (Departamento+Municipio) — a diferencia de Store, ninguno
                de los dos está limitado a Urabá. Supply lo ganó 2026-09-23
                (antes no pedía dirección, ver ADDRESS_MODULES arriba). */}
            {(module === 'suplementos' || module === 'supply') && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <ComboboxBuscable value={form.departamento} onChange={setDepartamento} options={DEPARTAMENTOS} placeholder="Departamento *" inputClassName={inputClass} />
                  <ComboboxBuscable value={form.municipio} onChange={setMunicipio} options={municipiosDisponibles} disabled={!form.departamento} placeholder={form.departamento ? 'Municipio *' : 'Elige antes el departamento'} inputClassName={inputClass} />
                </div>
                <input type="text" value={form.direccion} onChange={e => update('direccion', e.target.value)} placeholder="Dirección exacta — calle, carrera, barrio *" required className={inputClass} />
              </>
            )}
            <textarea value={form.mensaje} onChange={e => update('mensaje', e.target.value)} placeholder="Mensaje para el vendedor (opcional)" rows={2} className={inputClass} />
          </div>

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          {resultado ? (
            <ResultadoPago resultado={resultado} vendorNombre={vendorLock.estudioNombre} module={module} total={total} c={c} />
          ) : (
            <>
              <div className={`flex items-start gap-3 border rounded-lg p-4 ${c('bg-zinc-900 border-amber-500/30', 'bg-amber-50 border-amber-300')}`}>
                <Landmark size={18} className={`flex-shrink-0 mt-0.5 ${c('text-amber-500', 'text-amber-600')}`} />
                <p className={`text-[13px] leading-relaxed ${c('text-gray-400', 'text-zinc-600')}`}>
                  El pago (${total.toLocaleString('es-CO')}) le llega directo a la cuenta de {vendorLock.estudioNombre}, sin pasar por INKognito. Con el pago aprobado, {vendorLock.estudioNombre} recibe tu pedido y tus datos por correo para despacharlo, y te escribe por WhatsApp para coordinar la entrega.
                </p>
              </div>

              {brickError && <p className="text-red-500 text-sm">{brickError}</p>}
              {!formCompleto && !brickError && (
                <p className={`text-sm text-center py-2 ${c('text-gray-500', 'text-zinc-500')}`}>Completa tus datos de contacto y entrega arriba para continuar con el pago.</p>
              )}
              {!brickReady && formCompleto && !brickError && (
                <p className={`text-sm text-center ${c('text-gray-500', 'text-zinc-500')}`}>Cargando el formulario de pago...</p>
              )}
              {/* El contenedor SIEMPRE está montado en el DOM (nunca se
                  quita ni se agrega condicionalmente) — Mercado Pago busca
                  este id una sola vez al crear el Brick; si no existe en
                  ese momento, la creación falla en silencio. Solo se
                  oculta visualmente mientras el formulario de arriba está
                  incompleto. */}
              <div id={brickContainerId} className={formCompleto ? '' : 'hidden'} />
            </>
          )}
        </div>
      </div>
    </section>
  )
}

// Resultado del pago sin salir de esta página (2026-09-27, pieza 4 del
// plan de checkout embebido) — antes esta pantalla era de Mercado Pago
// (el comprador nunca salía de la nuestra). Solo reemplaza la vista en
// los 2 casos donde ya no hay nada más que hacer aquí (aprobado/en
// revisión) — un pago rechazado NO llega hasta acá, ver procesarPagoBrick
// (se queda en el Brick para reintentar). PSE tampoco llega aquí: ese
// método siempre redirige y usa la pantalla de resultado existente
// (/*/compra/resultado).
function ResultadoPago({ resultado, vendorNombre, module, total, c }) {
  if (resultado.status === 'approved') {
    return (
      <div className="text-center py-6">
        <CheckCircle2 size={40} className="text-green-500 mx-auto mb-3" />
        <h3 className={`text-lg font-black uppercase italic mb-2 ${c('text-white', 'text-zinc-900')}`}>¡Pago aprobado!</h3>
        <p className={`text-sm leading-relaxed mb-5 ${c('text-gray-400', 'text-zinc-600')}`}>
          Pagaste ${total.toLocaleString('es-CO')} a {vendorNombre}. Ya le llegó tu pedido por correo para que lo despache, y te escribe por WhatsApp para coordinar la entrega.
        </p>
        <Link to={`/${module}`} className={c('text-green-500 hover:text-green-400', 'text-zinc-700 hover:text-zinc-900') + ' text-sm font-semibold'}>
          Volver a {vendorNombre}
        </Link>
      </div>
    )
  }
  return (
    <div className="text-center py-6">
      <Clock size={40} className="text-amber-500 mx-auto mb-3" />
      <h3 className={`text-lg font-black uppercase italic mb-2 ${c('text-white', 'text-zinc-900')}`}>Pago en revisión</h3>
      <p className={`text-sm leading-relaxed ${c('text-gray-400', 'text-zinc-600')}`}>
        Mercado Pago está revisando tu pago — te llega un correo apenas se confirme, sin que tengas que hacer nada más.
      </p>
    </div>
  )
}
