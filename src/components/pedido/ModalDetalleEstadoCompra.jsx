import { Check, X } from 'lucide-react'
import { calcularPaso } from './BarraEstadoCompra'

const MODULO_LABEL = { store: 'Store', suplementos: 'Suple', supply: 'Supply' }

// Modal "Ver más" (2026-09-27, Jose: "debería haber un botón ver más, que
// abrirá un modal, donde literalmente verá los mismos estados, pero en
// este caso cada estado tendrá enfrente un texto que indica lo que sucede
// en cada estado, así como lo hace Temu") — mismos pasos/estado que
// BarraEstadoCompra, pero en timeline vertical con la descripción de cada
// paso siempre visible (no solo el paso actual). Vive en MisComprasPanel,
// un modal por tarjeta.
export default function ModalDetalleEstadoCompra({ open, onClose, estadoCompra, envio, module, recibidoConfirmado, vendorNombre }) {
  if (!open) return null
  const { pasos, descripciones, activo, rechazado } = calcularPaso({ estadoCompra, envio, module, recibidoConfirmado })

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 text-zinc-400 hover:text-black transition-colors duration-200"
        >
          <X size={20} />
        </button>

        <span className="inline-block px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-wide mb-2">
          {MODULO_LABEL[module] || module}
        </span>
        <h2 className="font-black text-base text-zinc-900 mb-5 pr-6">{vendorNombre}</h2>

        {rechazado ? (
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <X size={12} className="text-white" strokeWidth={3} />
            </span>
            <div>
              <p className="font-bold text-sm text-red-600">Pago rechazado</p>
              <p className="text-zinc-500 text-xs mt-0.5">{descripciones[0]}</p>
            </div>
          </div>
        ) : (
          <div>
            {pasos.map((paso, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      i < activo ? 'bg-green-500' : i === activo ? 'bg-green-500 ring-4 ring-green-100' : 'bg-zinc-200'
                    }`}
                  >
                    {i < activo && <Check size={12} className="text-white" strokeWidth={3} />}
                    {i === activo && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  {i < pasos.length - 1 && (
                    <div className={`w-0.5 flex-1 min-h-[26px] ${i < activo ? 'bg-green-500' : 'bg-zinc-200'}`} />
                  )}
                </div>
                <div className={i === pasos.length - 1 ? 'pb-0.5' : 'pb-5'}>
                  <p className={`font-bold text-sm ${i <= activo ? 'text-zinc-900' : 'text-zinc-400'}`}>{paso}</p>
                  <p className={`text-xs mt-0.5 ${i <= activo ? 'text-zinc-500' : 'text-zinc-400'}`}>{descripciones[i]}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
