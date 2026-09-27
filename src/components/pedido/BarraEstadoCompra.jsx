import { Check, X } from 'lucide-react'

// Stepper del estado de la compra (2026-09-27, Jose: "no así, más parecido
// a la barra donde tiene que comprar x cantidad para envío gratis [ver
// EnvioGratisBar.jsx], debe haber un círculo que defina cada estado") —
// círculos conectados por una línea que se va llenando a medida que avanza
// (como el rastreo de pedidos de Mercado Libre/Temu), no una barra continua
// sin marcar los pasos. Compartido por MisComprasPanel.jsx (lista,
// compacto) y SeguimientoCompraPage.jsx (una compra, más grande con
// etiqueta debajo de cada círculo).
// Supply nunca tiene `envio` (no participa de Ruta del Golfo) — se queda en
// un stepper de 2 pasos; Store/Suple usan los 5 pasos reales.
//
// Supply gana un 3er paso, "Recibido" (2026-09-27, Jose: "una transportadora
// nacional no lo va a llamar a decirle [al proveedor] que ya entregó...
// veo viable la idea de que sea el comprador quien marque como recibido") —
// a diferencia de Store/Suple (donde la transportadora de Ruta del Golfo es
// la fuente de verdad de "recogido"/"entregado"), acá nadie más que el
// propio comprador puede saberlo — por eso lo confirma él mismo
// (`recibidoConfirmado`, viene de `compra.recibido_at` — ver
// POST /api/estudios-compra-marcar-recibido), no un tercero.
//
// `descripciones` (2026-09-27, Jose: "cada estado tendrá enfrente un texto
// que indica lo que sucede en cada estado, así como lo hace Temu") — un
// texto explicativo por paso, paralelo a `pasos`, para el modal "Ver más"
// (ModalDetalleEstadoCompra.jsx). El stepper compacto/grande de acá abajo
// no los usa — solo el nombre corto del paso.
const DESC_RECHAZADO = ['Tu pago no fue aprobado. Puedes intentar de nuevo desde el mismo checkout.']
const DESC_SUPPLY = [
  'Recibimos tu pedido y estamos confirmando el pago.',
  'Tu pago fue aprobado — el vendedor te contactará por WhatsApp para coordinar la entrega.',
  'Confirmaste que ya recibiste tu pedido. ¡Gracias por tu compra!',
]
const DESC_ENVIO = [
  'Recibimos tu pedido y estamos confirmando el pago.',
  'Tu pago fue aprobado — el vendedor ya puede preparar tu pedido.',
  'Tu pedido está siendo empacado para el envío.',
  'Tu pedido ya salió y va en camino a tu dirección.',
  'Tu pedido fue entregado. ¡Gracias por tu compra!',
]

export function calcularPaso({ estadoCompra, envio, module, recibidoConfirmado }) {
  if (estadoCompra === 'rechazado') {
    return { pasos: ['Pago rechazado'], descripciones: DESC_RECHAZADO, activo: 0, rechazado: true }
  }
  if (module === 'supply') {
    const pasos = ['Pedido realizado', 'Pago aprobado', 'Recibido']
    let activo = estadoCompra === 'aprobado' ? 1 : 0
    if (estadoCompra === 'aprobado' && recibidoConfirmado) activo = 2
    return { pasos, descripciones: DESC_SUPPLY, activo, rechazado: false }
  }
  const pasos = ['Pedido realizado', 'Pago aprobado', 'Preparando envío', 'En camino', 'Entregado']
  let activo = estadoCompra === 'aprobado' ? 1 : 0
  if (estadoCompra === 'aprobado' && envio) {
    if (envio.estado === 'asignado') activo = 2
    else if (envio.estado === 'recogido') activo = 3
    else if (envio.estado === 'entregado') activo = 4
  }
  return { pasos, descripciones: DESC_ENVIO, activo, rechazado: false }
}

export default function BarraEstadoCompra({ estadoCompra, envio, module, recibidoConfirmado, size = 'sm' }) {
  const { pasos, activo, rechazado } = calcularPaso({ estadoCompra, envio, module, recibidoConfirmado })
  const circulo = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'
  const iconoTam = size === 'lg' ? 12 : 9

  if (rechazado) {
    return (
      <div className="flex items-center gap-2">
        <span className={`${circulo} rounded-full bg-red-500 flex items-center justify-center flex-shrink-0`}>
          <X size={iconoTam} className="text-white" strokeWidth={3} />
        </span>
        <span className={`font-bold text-red-600 ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>Pago rechazado</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center">
        {pasos.map((_, i) => (
          <div key={i} className="flex items-center" style={{ flex: i === pasos.length - 1 ? '0 0 auto' : '1 1 auto' }}>
            <span
              className={`${circulo} rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                i < activo ? 'bg-green-500' : i === activo ? 'bg-green-500 ring-4 ring-green-100' : 'bg-zinc-200'
              }`}
            >
              {i < activo && <Check size={iconoTam} className="text-white" strokeWidth={3} />}
              {i === activo && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </span>
            {i < pasos.length - 1 && (
              <div className={`h-0.5 flex-1 transition-colors duration-300 ${i < activo ? 'bg-green-500' : 'bg-zinc-200'}`} />
            )}
          </div>
        ))}
      </div>
      {/* Compacto (sm, en la lista de Mis compras): solo el paso actual en
          texto, debajo del stepper — los 5 nombres no caben en una card
          angosta. Grande (lg, página de seguimiento de una sola compra):
          una etiqueta bajo cada círculo, como Mercado Libre. */}
      {size === 'lg' ? (
        <div className="flex mt-1.5">
          {pasos.map((paso, i) => (
            <span
              key={i}
              className={`text-[9px] leading-tight text-center px-0.5 ${i === pasos.length - 1 ? 'flex-none w-6' : 'flex-1'} ${
                i <= activo ? 'text-zinc-700 font-semibold' : 'text-zinc-400'
              }`}
            >
              {paso}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs font-bold text-zinc-700 mt-1.5">{pasos[activo]}</p>
      )}
    </div>
  )
}
