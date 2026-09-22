// Barra de progreso hacia el envío gratis — Ruta del Golfo (2026-09-22,
// Jose: "en el carrito, los productos relacionados a esa tienda, deberá
// mostrar una barra, que carga, cuando el valor de los productos se
// acercan a ese valor, y cuando cumplan con el valor, entonces el envío
// será gratis"). Compartida por CartDrawerStore.jsx y CartDrawerSuple.jsx
// — lee `vendorLock` (ya trae politicaEnvio/envioGratisMonto desde
// StoreCartContext.jsx/SupleCartContext.jsx, mismo mecanismo que
// mpConectado) y el subtotal ya calculado por cada carrito
// (selectedTotal ?? total, misma convención que ya usa cada drawer).
export default function EnvioGratisBar({ vendorLock, subtotal }) {
  if (!vendorLock) return null
  const politica = vendorLock.politicaEnvio || 'cliente_paga'
  if (politica === 'cliente_paga') return null

  if (politica === 'siempre_gratis') {
    return (
      <div className="px-4 py-2 text-center text-[11px] font-bold uppercase tracking-wide text-green-700 bg-green-50 border-y border-green-200">
        🚚 Envío gratis en {vendorLock.estudioNombre || 'esta tienda'}
      </div>
    )
  }

  // gratis_desde_monto
  const meta = Number(vendorLock.envioGratisMonto) || 0
  if (meta <= 0) return null
  const cumplido = subtotal >= meta
  const pct = Math.min(100, Math.round((subtotal / meta) * 100))
  const falta = Math.max(0, meta - subtotal)

  return (
    <div className="px-4 py-2.5 border-y border-gray-100 bg-gray-50/60">
      <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden mb-1.5">
        <div
          className={`h-full rounded-full transition-all duration-300 ${cumplido ? 'bg-green-500' : 'bg-amber-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[11px] text-center leading-snug">
        {cumplido ? (
          <span className="font-bold text-green-700">🚚 Envío gratis en {vendorLock.estudioNombre || 'esta tienda'}</span>
        ) : (
          <>
            Te faltan <span className="font-bold text-gray-900">${falta.toLocaleString('es-CO')}</span> en productos de {vendorLock.estudioNombre || 'esta tienda'} para envío gratis
          </>
        )}
      </p>
    </div>
  )
}
