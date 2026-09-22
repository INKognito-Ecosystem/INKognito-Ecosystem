// Tarjeta "Envío" — Ruta del Golfo (2026-09-22, Jose: "la tienda podrá
// elegir si asume los envíos, o podrá elegirlo por pedido... por compra
// mayores a x precio, el envío es gratis"). Compartida por
// EditarPerfilTiendaSection.jsx (Store) y EditarPerfilSupleSection.jsx
// (Suple) — mismos 3 valores de `estudios.politica_envio` sin importar el
// módulo, aplica igual dentro o fuera de la cobertura de Ruta del Golfo
// (ver PedidoSupplyVendorCheckout.jsx, que decide el monto exacto vs. el
// aviso sin monto según esa cobertura). Mismas clases literales que ambos
// formularios padre (cardClass/cardTitleClass/labelClass/inputClass son
// idénticas en los dos archivos) — se repiten acá para que este
// componente sea autocontenido, no por casualidad.
const cardClass = 'bg-white border border-gray-200 rounded-2xl shadow-sm p-5 md:p-8'
const cardTitleClass = 'text-sm font-black uppercase tracking-widest text-gray-900 mb-4 pb-3 border-b border-gray-100'
const labelClass = 'text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block'
const inputClass = 'w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors'

const OPCIONES = [
  {
    value: 'cliente_paga',
    label: 'El cliente paga el flete',
    desc: 'Si estás en la Ruta del Golfo, se le muestra el valor exacto al pagar. Si no, se le avisa que debe asumirlo, sin un monto fijo.',
  },
  {
    value: 'siempre_gratis',
    label: 'Envío gratis siempre',
    desc: 'Tú le pagas el flete a la transportadora — el cliente nunca ve un cargo de envío.',
  },
  {
    value: 'gratis_desde_monto',
    label: 'Envío gratis desde un monto',
    desc: 'Gratis solo si la compra supera el monto que definas. El carrito le muestra cuánto le falta.',
  },
]

export default function PoliticaEnvioCard({ politicaEnvio, envioGratisMonto, onChange }) {
  return (
    <div className={`${cardClass} mt-5`}>
      <h2 className={cardTitleClass}>Envío</h2>
      <div className="flex flex-col gap-2">
        {OPCIONES.map((opt) => {
          const activo = (politicaEnvio || 'cliente_paga') === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ politica_envio: opt.value })}
              className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                activo ? 'border-gray-700 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="text-sm font-bold text-gray-900">{opt.label}</p>
              <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{opt.desc}</p>
            </button>
          )
        })}
      </div>
      {politicaEnvio === 'gratis_desde_monto' && (
        <div className="mt-3">
          <label className={labelClass}>Envío gratis desde (COP) *</label>
          <input
            type="number"
            min="0"
            step="1000"
            value={envioGratisMonto ?? ''}
            onChange={(e) => onChange({ envio_gratis_monto: e.target.value })}
            placeholder="Ej: 50000"
            className={inputClass}
          />
        </div>
      )}
    </div>
  )
}
