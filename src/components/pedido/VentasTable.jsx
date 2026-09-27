import { useState } from 'react'
import { X, Eye } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://inkognito-ecosystem.com'
const ESTADO_LABEL = { aprobado: 'Pagado', rechazado: 'Rechazado' }
const ESTADO_CLASE = { aprobado: 'text-green-600 font-bold', rechazado: 'text-gray-400' }

// Mensaje de WhatsApp precargado (2026-09-27, Jose: avisarle al cliente que
// ya se enteró de la venta y que puede ver el estado él mismo) — el link de
// seguimiento solo se arma si esta venta trae token_seguimiento (las 3
// tablas estudios_compras_* lo generan desde 2026-09-22; una venta de
// prueba insertada a mano sin ese campo simplemente no lo incluye, no
// revienta). Sin mención de "aviso automático" a propósito (Jose,
// 2026-09-27: el agente de WhatsApp no está en uso) — el link ES el
// mecanismo, nadie promete escribir de nuevo.
function mensajeWhatsapp(venta, vendorNombre, module) {
  const items = venta.items.map((it) => `${it.cantidad}x ${it.product_nombre}${it.variant ? ` (${it.variant})` : ''}`).join('\n')
  const link = venta.token_seguimiento ? `${SITE_URL}/pedido/seguimiento?compra=${venta.id}&token=${venta.token_seguimiento}&module=${module}` : null
  return [
    `Hola${venta.cliente_nombre ? ` ${venta.cliente_nombre}` : ''} 👋 Soy${vendorNombre ? ` ${vendorNombre}` : ' tu vendedor'}. Te confirmo que ya recibí tu pedido:`,
    items,
    `Ya quedó en preparación.${link ? ` Puedes ver el estado de tu compra (armado, en camino, entregado) en cualquier momento aquí: ${link}` : ''}`,
    '¡Gracias por tu compra!',
  ].join('\n\n')
}

// Tabla de ventas + modal de detalle (2026-09-27, Jose: "formato excel, con
// su botón ver, que abrirá un modal... de manera jerárquica y bien
// estructurada") — reemplaza las cards que MisVentasVendorSection.jsx
// (Store/Suple) y MisVentasSupplySection.jsx (Supply) repetían cada una por
// su cuenta (3 copias casi idénticas). Los 3 endpoints "-ventas-*-por-token"
// devuelven exactamente los mismos campos (mismo criterio que
// COMPRAR_ENDPOINT en PedidoSupplyVendorCheckout.jsx), así que esta tabla no
// tiene ninguna rama de negocio distinta entre módulos — solo el mapeo de
// municipio cambia (Store guarda una clave corta de ZONAS_FLETE, los demás
// el nombre real), vía la prop `municipioLabel`.
export default function VentasTable({ ventas, municipioLabel = (m) => m, module = 'supply', vendorNombre }) {
  const [seleccionada, setSeleccionada] = useState(null)

  return (
    <>
      {/* Solo lo esencial en la fila (Jose, 2026-09-27: "ojo que no debe
          hacer scroll lateral, solo mostrará lo esencial") — producto,
          monto y estado; el resto (cliente, fecha, dirección, desglose)
          vive en el modal detrás de "Ver". Sin overflow-x ni min-width: si
          no cabe, el nombre del producto se trunca, no se saca la tabla de
          la pantalla. */}
      <table className="w-full text-xs table-fixed">
        <thead>
          <tr className="text-gray-400 uppercase tracking-wide text-[10px] border-b border-gray-200">
            <th className="text-left font-bold py-2 pr-1 w-auto">Producto</th>
            <th className="text-right font-bold py-2 px-1 w-[76px]">Monto</th>
            <th className="text-left font-bold py-2 px-1 w-[68px]">Estado</th>
            <th className="text-right font-bold py-2 pl-1 w-[44px]"></th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((v) => (
            <tr key={v.id} className="border-b border-gray-100 last:border-0">
              <td className="py-2 pr-1 truncate">{v.items.map((i) => `${i.cantidad}x ${i.product_nombre}`).join(', ')}</td>
              <td className="py-2 px-1 text-right font-black whitespace-nowrap">${Number(v.monto_estudio).toLocaleString('es-CO')}</td>
              <td className={`py-2 px-1 whitespace-nowrap ${ESTADO_CLASE[v.estado] || 'text-amber-600 font-bold'}`}>{ESTADO_LABEL[v.estado] || 'Pendiente'}</td>
              <td className="py-2 pl-1 text-right">
                <button
                  type="button"
                  onClick={() => setSeleccionada(v)}
                  className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 font-bold uppercase tracking-wide text-[10px]"
                >
                  <Eye size={12} /> Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {seleccionada && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center px-0 sm:px-4" onClick={() => setSeleccionada(null)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm max-h-[92vh] overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-black uppercase tracking-widest text-gray-700">Venta #{seleccionada.id}</p>
              <button type="button" onClick={() => setSeleccionada(null)} aria-label="Cerrar" className="text-gray-400">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <p className="font-black uppercase tracking-widest text-gray-400 text-[10px] mb-1.5">Cliente</p>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <p className="font-bold text-gray-900">{seleccionada.cliente_nombre || 'Cliente'}</p>
                  {seleccionada.cliente_telefono && (
                    <a
                      href={`https://wa.me/${seleccionada.cliente_telefono}?text=${encodeURIComponent(mensajeWhatsapp(seleccionada, vendorNombre, module))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-green-600 font-semibold hover:text-green-700"
                    >
                      <FaWhatsapp size={13} className="flex-shrink-0" /> {seleccionada.cliente_telefono} — avisarle por WhatsApp
                    </a>
                  )}
                  {seleccionada.cliente_email && <p className="text-gray-600">✉️ {seleccionada.cliente_email}</p>}
                  {seleccionada.cliente_direccion && (
                    <p className="text-gray-600">📍 {seleccionada.cliente_direccion}, {municipioLabel(seleccionada.cliente_municipio)}</p>
                  )}
                </div>
              </div>

              <div>
                <p className="font-black uppercase tracking-widest text-gray-400 text-[10px] mb-1.5">Pedido</p>
                <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                  {seleccionada.items.map((it, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 px-3 py-2">
                      <span className="text-gray-700">{it.cantidad}x {it.product_nombre}{it.variant ? ` (${it.variant})` : ''}</span>
                      {typeof it.precio_unitario === 'number' && (
                        <span className="text-gray-500 flex-shrink-0">${Number(it.precio_unitario * it.cantidad).toLocaleString('es-CO')}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-black uppercase tracking-widest text-gray-400 text-[10px] mb-1.5">Totales</p>
                {/* Empieza por SU precio (sin tocar), no por una resta — a
                    Jose le pareció confuso "Total pagado / -Comisión /
                    Recibes" porque lee como si le quitáramos algo a su
                    precio; el mecanismo real es al revés: el cliente paga
                    de más desde el inicio (2026-09-27). */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tu precio</span>
                    <span className="font-bold">${Number(seleccionada.monto_estudio).toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Comisión que paga el cliente</span>
                    <span className="text-gray-500">+${Number(seleccionada.monto_total - seleccionada.monto_estudio).toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-gray-200">
                    <span className="font-black">Total que pagó</span>
                    <span className="font-black">${Number(seleccionada.monto_total).toLocaleString('es-CO')}</span>
                  </div>
                </div>
              </div>

              <p className="text-center">
                <span className={ESTADO_CLASE[seleccionada.estado] || 'text-amber-600 font-bold'}>{ESTADO_LABEL[seleccionada.estado] || 'Pendiente'}</span>
                <span className="text-gray-400"> · {new Date(seleccionada.created_at).toLocaleString('es-CO')}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
