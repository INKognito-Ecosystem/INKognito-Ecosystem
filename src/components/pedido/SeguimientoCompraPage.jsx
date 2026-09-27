import { useLoaderData } from 'react-router'
import { Package, Truck, CheckCircle2 } from 'lucide-react'
import { ESTADO_LABEL, ESTADO_CLASE } from './MisEnviosVendorSection'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const MODULO_LABEL = { store: 'INKognito Store', suplementos: 'INKognito Suple', supply: 'INKognito Supply' }
const ESTADO_COMPRA_LABEL = { aprobado: 'Pago aprobado', pendiente: 'Confirmando pago', rechazado: 'Pago rechazado' }
const ESTADO_COMPRA_CLASE = { aprobado: 'bg-green-100 text-green-700', pendiente: 'bg-amber-100 text-amber-700', rechazado: 'bg-red-100 text-red-700' }

// Link directo de seguimiento (2026-09-27, Jose: el mensaje de WhatsApp que
// el vendedor le manda al comprador debería apuntar a ver el estado de su
// compra, sin depender de que la abra desde el mismo navegador donde pagó
// (MisComprasPanel.jsx sí depende de eso — vive en localStorage). Esta
// página en cambio consulta GET /api/estudios-compra-seguimiento con el
// compra_id+token que YA vive en la base desde que se creó la compra — no
// necesita ninguna cuenta ni el navegador correcto, solo el link. Reusa las
// mismas etiquetas/colores que MisComprasPanel.jsx (mismo criterio: no
// reinventar colores/estados) — página nueva, SSR desde el día uno (ver
// feedback_ssr_paginas_nuevas.md).
export async function loader({ request }) {
  const url = new URL(request.url)
  const compra = url.searchParams.get('compra')
  const token = url.searchParams.get('token')
  const module = url.searchParams.get('module')
  if (!compra || !token || !module) return { data: null, module, error: 'Este link de seguimiento no está completo.' }
  try {
    const res = await fetch(`${PANEL_URL}/api/estudios-compra-seguimiento?compra_id=${encodeURIComponent(compra)}&token=${encodeURIComponent(token)}&module=${encodeURIComponent(module)}`)
    if (!res.ok) return { data: null, module, error: 'No encontramos esa compra — el link puede estar vencido o incompleto.' }
    return { data: await res.json(), module, error: null }
  } catch {
    return { data: null, module, error: 'No pudimos consultar tu compra en este momento.' }
  }
}

export function meta() {
  return [
    { title: 'Seguimiento de tu compra | INKognito' },
    { name: 'robots', content: 'noindex' },
  ]
}

function formatFecha(iso) {
  try { return new Date(iso).toLocaleString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' }) } catch { return '' }
}

export default function SeguimientoCompraPage() {
  const { data, module, error } = useLoaderData()

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm bg-white border border-zinc-200 rounded-2xl p-6">
        <p className="text-center text-[11px] uppercase tracking-widest text-zinc-400 mb-1">{MODULO_LABEL[module] || 'INKognito'}</p>
        <h1 className="text-center font-black text-lg text-zinc-900 mb-6">Seguimiento de tu compra</h1>

        {error || !data ? (
          <div className="text-center py-8">
            <Package size={32} className="text-zinc-300 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">{error || 'No pudimos consultar tu compra.'}</p>
          </div>
        ) : (
          <>
            <p className="text-zinc-500 text-xs text-center mb-4">{data.vendedor_nombre} · {formatFecha(data.fecha)}</p>

            <div className="flex justify-center mb-5">
              <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-full ${ESTADO_COMPRA_CLASE[data.estado_compra] || 'bg-gray-100 text-gray-600'}`}>
                {ESTADO_COMPRA_LABEL[data.estado_compra] || data.estado_compra}
              </span>
            </div>

            <div className="bg-zinc-50 rounded-lg divide-y divide-zinc-200 mb-5">
              {data.items.map((it, i) => (
                <div key={i} className="px-3 py-2 text-sm text-zinc-700">
                  {it.cantidad}x {it.producto}{it.variant ? ` (${it.variant})` : ''}
                </div>
              ))}
              <div className="px-3 py-2 flex justify-between font-bold text-sm text-zinc-900">
                <span>Total</span>
                <span>${Number(data.monto_total).toLocaleString('es-CO')}</span>
              </div>
            </div>

            {/* Envío por Ruta del Golfo — solo Store/Suple (ver
                MODULO_TABLA_SEGUIMIENTO en server.js, Supply nunca trae
                `envio`). Sin notificación automática (el agente de WhatsApp
                no está en uso) — este link ES el mecanismo para que el
                comprador chequee el avance cuando quiera. */}
            {data.envio ? (
              <div className="border border-zinc-200 rounded-lg p-3">
                <p className="text-[11px] uppercase tracking-widest text-zinc-400 mb-2">Envío</p>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${ESTADO_CLASE[data.envio.estado] || 'bg-gray-100 text-gray-600'}`}>
                    {ESTADO_LABEL[data.envio.estado] || data.envio.estado}
                  </span>
                </div>
                {data.envio.transportadora_nombre && (
                  <p className="text-zinc-500 text-xs flex items-center gap-1.5">
                    <Truck size={13} className="flex-shrink-0" /> {data.envio.transportadora_nombre}
                  </p>
                )}
                {data.envio.entregado_at ? (
                  <p className="text-zinc-400 text-[11px] mt-1 flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="flex-shrink-0" /> Entregado el {formatFecha(data.envio.entregado_at)}
                  </p>
                ) : data.envio.recogido_at ? (
                  <p className="text-zinc-400 text-[11px] mt-1">Recogido el {formatFecha(data.envio.recogido_at)}</p>
                ) : null}
              </div>
            ) : module === 'supply' ? (
              <p className="text-zinc-400 text-xs text-center">{data.vendedor_nombre} coordina la entrega directo contigo por WhatsApp.</p>
            ) : (
              // Store/Suple sin envío asignado todavía (Ruta del Golfo) —
              // distinto del caso Supply: acá SÍ habrá una transportadora,
              // solo que aún no se le asigna una a este pedido.
              <p className="text-zinc-400 text-xs text-center">Tu pedido está en preparación — en cuanto se asigne la transportadora, lo verás reflejado aquí.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
