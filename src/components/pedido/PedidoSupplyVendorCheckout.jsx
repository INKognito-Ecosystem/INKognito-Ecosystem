import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Landmark, ShoppingBag } from 'lucide-react'
import { ZONAS_FLETE } from '../../data/colombiaGeo'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const inputCls = 'w-full bg-zinc-900 border border-gray-700 text-white p-3.5 rounded outline-none placeholder:text-gray-600'

// Endpoint de compra por módulo — Store multitenant (2026-08-29) reusa
// este mismo componente en vez de clonarlo: a diferencia de los
// endpoints de backend (donde categoría/talla sí divergen de verdad
// entre Supply y Store, ver server.js), este componente de presentación
// no tiene ninguna lógica que cambie entre módulos — solo el endpoint y
// el link de "seguir agregando" difieren.
const COMPRAR_ENDPOINT = { supply: 'estudios-supply-comprar', store: 'estudios-tienda-comprar' }

// Checkout dedicado para un carrito de Supply/Store bloqueado a un
// proveedor con Mercado Pago propio (fase 5, 2026-08-07; extendido a
// Store 2026-08-29) — sin nequi/contraentrega, sin dirección/flete/
// Eljach: el proveedor coordina la entrega directo con el comprador por
// WhatsApp después de pagar, mismo criterio que las reservas de artista.
// Reemplaza el formulario normal de PedidoOnlinePage.jsx solo cuando
// cart.vendorLock está seteado (ver SupplyCartContext.jsx/StoreCartContext.jsx).
export default function PedidoSupplyVendorCheckout({ cart, module = 'supply' }) {
  const { items, vendorLock, total } = cart
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', municipio: '', mensaje: '' })
  const [enviando, setEnviando] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Mismo fix de bfcache ya usado en ArtistaLandingPage.jsx — sin esto, si
  // el comprador le da "Atrás" desde Mercado Pago sin pagar, el botón
  // vuelve congelado en "Redirigiendo..." porque ese código nunca corrió
  // de nuevo.
  useEffect(() => {
    const alRestaurar = (e) => { if (e.persisted) setEnviando(false) }
    window.addEventListener('pageshow', alRestaurar)
    return () => window.removeEventListener('pageshow', alRestaurar)
  }, [])

  const update = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }))
  // "Ruta del Golfo" (2026-08-30) — el checkout de Store nunca pedía
  // municipio de entrega; sin eso no hay forma de calcular el flete de un
  // envío ni de saber si es reparto dentro del mismo municipio. Solo
  // Store lo exige — Supply no cambia.
  const formCompleto = Boolean(form.telefono && form.email && (module !== 'store' || form.municipio))

  const enviar = async (e) => {
    e.preventDefault()
    if (!formCompleto || enviando) return
    setEnviando(true)
    setErrorMsg('')
    try {
      const res = await fetch(`${PANEL_URL}/api/${COMPRAR_ENDPOINT[module]}`, {
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
          cliente_nombre: form.nombre || null,
          cliente_telefono: form.telefono,
          cliente_email: form.email,
          ...(module === 'store' ? { cliente_municipio: form.municipio } : {}),
          mensaje: form.mensaje || null,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.init_point) throw new Error(data.error || '')
      window.location.href = data.init_point
    } catch (err) {
      setErrorMsg(err.message || 'No pudimos iniciar el pago — intenta de nuevo.')
      setEnviando(false)
    }
  }

  return (
    <section className="py-10 md:py-16 px-4 bg-black border-t border-white/5">
      <div className="max-w-2xl mx-auto">
        <p className="text-gray-500 text-xs uppercase tracking-[0.25em] text-center mb-2">{vendorLock.estudioNombre}</p>
        <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-3 text-center text-white">
          Confirma tu <span className="text-zinc-600">Compra</span>
        </h2>
        <p className="text-gray-500 text-sm text-center max-w-md mx-auto mb-8">
          Pagas directo a {vendorLock.estudioNombre} por Mercado Pago. En cuanto se apruebe el pago, le llega tu pedido por correo para que lo despache y te escribe por WhatsApp para coordinar la entrega.
        </p>

        <form onSubmit={enviar} className="bg-zinc-950 border border-gray-800 rounded-xl p-6 md:p-10 space-y-6">
          <div className="bg-zinc-900 border border-gray-800 rounded-lg divide-y divide-gray-800">
            {items.map(item => {
              const unitPrice = parseInt(String(item.price).replace(/[^0-9]/g, ''), 10) || 0
              return (
                <div key={item.key} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <span className="text-gray-300 truncate">{item.qty}x {item.name}</span>
                  <span className="text-gray-500 flex-shrink-0">${(unitPrice * item.qty).toLocaleString('es-CO')}</span>
                </div>
              )
            })}
            <div className="flex items-center justify-between px-4 py-3 font-bold">
              <span className="text-white text-sm uppercase tracking-wide">Total</span>
              <span className="text-white">${total.toLocaleString('es-CO')}</span>
            </div>
          </div>

          <Link to={`/${module}`} className="inline-block text-gray-500 hover:text-gray-300 text-xs">
            + Seguir agregando productos de {vendorLock.estudioNombre}
          </Link>

          <div className="space-y-4">
            <input type="text" value={form.nombre} onChange={e => update('nombre', e.target.value)} placeholder="Tu nombre" className={inputCls} />
            <input type="tel" value={form.telefono} onChange={e => update('telefono', e.target.value)} placeholder="Tu WhatsApp o teléfono *" required className={inputCls} />
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="Tu correo *" required className={inputCls} />
            {module === 'store' && (
              <select value={form.municipio} onChange={e => update('municipio', e.target.value)} required className={inputCls}>
                <option value="">Tu municipio de entrega *</option>
                {Object.entries(ZONAS_FLETE).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            )}
            <textarea value={form.mensaje} onChange={e => update('mensaje', e.target.value)} placeholder="Mensaje para el proveedor (opcional)" rows={2} className={inputCls} />
          </div>

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <div className="flex items-start gap-3 bg-zinc-900 border border-amber-500/30 rounded-lg p-4">
            <Landmark size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-gray-400 text-[13px] leading-relaxed">
              Al confirmar, Mercado Pago te pedirá el pago completo (${total.toLocaleString('es-CO')}) — le llega directo a la cuenta de {vendorLock.estudioNombre}, sin pasar por INKognito. Con el pago aprobado, {vendorLock.estudioNombre} recibe tu pedido y tus datos por correo para despacharlo, y te escribe por WhatsApp para coordinar la entrega.
            </p>
          </div>

          <button
            type="submit"
            disabled={enviando || !formCompleto}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-black py-4 px-6 rounded uppercase tracking-widest text-sm hover:bg-blue-500 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={18} />
            {enviando ? 'Redirigiendo a Mercado Pago...' : 'Pagar con Mercado Pago'}
          </button>
        </form>
      </div>
    </section>
  )
}
