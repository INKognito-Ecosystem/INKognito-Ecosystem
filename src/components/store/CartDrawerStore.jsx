import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Share2, Minus, Plus, Trash2, Check, Package } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { useStoreCart } from '../../contexts/StoreCartContext'

const GOLD = '#C9A84C'
const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Rediseño al nivel de CartDrawerSupply.jsx (2026-09-16, Jose: "actualiza
// como se ve el modal del carrito... ahora es diferente, pues también
// trae la foto del producto en carrito, actualizalo en su totalidad, al
// nivel de el de supply") — mismo lenguaje visual: foto real por fila,
// casilla de selección, stock real consultado al abrir, tipografía limpia
// (nada de uppercase/font-black), pantalla completa en móvil. A
// diferencia de Supply, Store SÍ conserva las dos vías de checkout
// (Agendar en línea + WhatsApp) — es su flujo real, no se quita nada,
// solo se le da el mismo acabado visual.
export default function CartDrawerStore({ open, onClose }) {
  const {
    items, removeItem, changeQty, count,
    selectedKeys, toggleSelected, setAllSelected, allSelected, selectedCount, selectedTotal, total, vendorLock,
  } = useStoreCart()

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Stock real (2026-09-16, mismo patrón que CartDrawerSupply.jsx) — el
  // carrito solo guarda precio/nombre al momento de agregar, no el stock
  // (que puede cambiar después). Se consulta una vez por inventoryId único
  // cada vez que el carrito se abre, reusando /api/product/:id (mismo
  // endpoint genérico por id de inventario, sin importar el módulo).
  const [stockMap, setStockMap] = useState({})
  useEffect(() => {
    if (!open) return
    const ids = [...new Set(items.map(i => i.inventoryId).filter(Boolean))]
    const faltantes = ids.filter(id => !(id in stockMap))
    if (faltantes.length === 0) return
    let cancelado = false
    Promise.all(faltantes.map(id =>
      fetch(`${PANEL_URL}/api/product/${id}`).then(r => r.ok ? r.json() : null).catch(() => null)
    )).then(results => {
      if (cancelado) return
      setStockMap(prev => {
        const next = { ...prev }
        results.forEach((data, i) => {
          const id = faltantes[i]
          const variante = data?.variantes?.find(v => v.id === id)
          next[id] = variante ? (variante.stock ?? 0) : null
        })
        return next
      })
    })
    return () => { cancelado = true }
  }, [open, items, stockMap])

  const [shareMsg, setShareMsg] = useState(null)
  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      try { await navigator.share({ title: 'INKognito Store', url }) } catch {}
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setShareMsg('Link copiado')
      setTimeout(() => setShareMsg(null), 2000)
    } catch {}
  }

  const buildWhatsAppMessage = () => {
    const lines = items.map(i => {
      const talla = i.size ? ` — Talla ${i.size}` : ''
      return `• ${i.name}${talla} — ${i.qty} und — ${i.price} c/u`
    })
    const msg = [
      'Hola, quiero hacer un pedido en INKognito Store:',
      '',
      ...lines,
      '',
      `Total aprox: $${total.toLocaleString('es-CO')}`,
      '',
      '¿Me confirmas disponibilidad y cómo sería la entrega?',
    ].join('\n')
    return `https://wa.me/573207911013?text=${encodeURIComponent(msg)}`
  }

  return (
    <>
      {/* BACKDROP */}
      <div
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* DRAWER — pantalla completa en móvil, panel lateral en desktop */}
      <aside
        className={`fixed top-0 right-0 h-full w-full md:max-w-sm bg-white border-l border-zinc-200 z-[70] flex flex-col transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >

        {/* HEADER — flecha de volver a la izquierda, compartir a la derecha */}
        <div className="relative flex items-center justify-between gap-3 px-6 py-5 border-b border-zinc-200 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              aria-label="Volver"
              className="flex-shrink-0 text-zinc-400 hover:text-black transition-colors duration-200"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="min-w-0">
              <p className="text-zinc-400 text-xs">INKognito Store</p>
              <h2 className="font-bold text-lg flex items-center gap-2 text-gray-900">
                Carrito
                {count > 0 && (
                  <span className="text-black text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: GOLD }}>
                    {count}
                  </span>
                )}
              </h2>
            </div>
          </div>
          <button
            onClick={handleShare}
            aria-label="Compartir"
            className="flex-shrink-0 text-zinc-400 hover:text-black transition-colors duration-200"
          >
            <Share2 size={20} />
          </button>

          {shareMsg && (
            <div className="absolute left-0 right-0 top-full mt-2 flex justify-center pointer-events-none z-10">
              <p className="bg-zinc-900 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg">{shareMsg}</p>
            </div>
          )}
        </div>

        {/* SELECCIONAR TODOS */}
        {items.length > 0 && (
          <button
            onClick={() => setAllSelected(!allSelected)}
            className="flex items-center gap-2.5 px-6 py-3 border-b border-zinc-200 flex-shrink-0"
          >
            <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
              allSelected ? 'border-transparent' : 'border-zinc-300'
            }`} style={allSelected ? { backgroundColor: GOLD } : {}}>
              {allSelected && <Check size={10} className="text-black" strokeWidth={3} />}
            </span>
            <span className="text-xs font-medium text-gray-900">
              Todos los productos
            </span>
          </button>
        )}

        {/* ITEMS */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-16 h-16 rounded-full border border-zinc-200 flex items-center justify-center">
                <span className="text-zinc-400 text-2xl">∅</span>
              </div>
              <p className="text-zinc-400 text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              {items[0]?.estudioNombre && (
                <p className="text-xs font-medium text-zinc-400 -mx-6 px-6 pb-3 border-b border-zinc-200">
                  Productos de {items[0].estudioNombre}
                </p>
              )}
              <ul>
              {items.map(item => {
                const unitPrice = parseInt(String(item.price).replace(/[^0-9]/g, ''), 10) || 0
                const subtotal = unitPrice * item.qty
                const isSelected = selectedKeys.has(item.key)
                // Cae al stock ya conocido desde que se agregó (item.stock)
                // mientras el fetch fresco de abajo no responde todavía —
                // sin esto la insignia "Quedan X" aparecía vacía y luego
                // saltaba un segundo después de abrir el carrito.
                const stockReal = item.inventoryId
                  ? (item.inventoryId in stockMap ? stockMap[item.inventoryId] : (typeof item.stock === 'number' ? item.stock : undefined))
                  : undefined
                const sinStock = stockReal === 0
                const noDisponible = stockReal === null
                const atMax = typeof stockReal === 'number' && item.qty >= stockReal
                const mostrarQuedan = typeof stockReal === 'number' && stockReal > 0 && stockReal <= 10

                return (
                  <li key={item.key} className="flex items-start gap-3 py-3 border-b border-zinc-200 -mx-6 px-6">

                    {/* CASILLA */}
                    <button
                      onClick={() => toggleSelected(item.key)}
                      aria-label={isSelected ? 'Quitar de la selección' : 'Agregar a la selección'}
                      className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                        isSelected ? 'border-transparent' : 'border-zinc-300'
                      }`}
                      style={isSelected ? { backgroundColor: GOLD } : {}}
                    >
                      {isSelected && <Check size={10} className="text-black" strokeWidth={3} />}
                    </button>

                    {/* FOTO */}
                    <div className="relative flex-shrink-0">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={22} className="text-zinc-300" />
                          </div>
                        )}
                        {mostrarQuedan && (
                          <span className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[9px] font-medium text-center py-1 leading-none">
                            Quedan {stockReal}
                          </span>
                        )}
                        {sinStock && (
                          <span className="absolute bottom-0 inset-x-0 bg-red-600 text-white text-[9px] font-medium text-center py-1 leading-none">
                            Sin stock
                          </span>
                        )}
                      </div>
                    </div>

                    {/* NOMBRE + ELIMINAR */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm leading-snug truncate text-gray-900">
                            {item.name}
                          </p>
                          {item.size && (
                            <p className="text-zinc-400 text-xs mt-0.5 truncate">Talla: {item.size}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.key)}
                          className="text-zinc-400 hover:text-red-500 transition-colors duration-200 flex-shrink-0 mt-0.5"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {noDisponible && (
                        <p className="text-red-500 text-xs mt-1">Ya no está disponible — quítalo del carrito.</p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        {/* CANTIDAD */}
                        <div className="flex items-center gap-0 border border-zinc-300 rounded">
                          <button
                            onClick={() => changeQty(item.key, item.qty - 1)}
                            aria-label="Restar unidad"
                            className="px-2 py-1 text-zinc-500 hover:text-black hover:bg-zinc-100 transition-all duration-200"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="px-2 py-1 text-xs font-medium text-gray-900 border-x border-zinc-300 min-w-[1.5rem] text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => !atMax && changeQty(item.key, item.qty + 1)}
                            disabled={atMax}
                            aria-label="Sumar unidad"
                            className="px-2 py-1 text-zinc-500 hover:text-black hover:bg-zinc-100 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        {/* SUBTOTAL */}
                        <p className="font-semibold text-gray-900 text-sm">
                          ${subtotal.toLocaleString('es-CO')}
                        </p>
                      </div>
                    </div>

                  </li>
                )
              })}
            </ul>
            </>
          )}

        </div>

        {/* FOOTER — Total + Agendar en línea (2-col, mismo criterio que
            CartDrawerSupply.jsx) y, debajo, WhatsApp como alternativa —
            Store conserva las dos vías de checkout, a diferencia de
            Supply. */}
        {items.length > 0 && (
          <div className="border-t border-zinc-200 px-6 py-5 flex-shrink-0 space-y-3">

            <div className="grid grid-cols-2 gap-3 items-stretch">
              <div className="flex flex-col justify-center">
                <p className="text-xs text-zinc-400">Total</p>
                <p className="font-bold text-xl text-gray-900">
                  ${(selectedCount > 0 ? selectedTotal : total).toLocaleString('es-CO')}
                </p>
              </div>

              <Link
                to="/pedido/store"
                onClick={onClose}
                className="flex items-center justify-center rounded-xl text-black font-semibold text-sm transition-colors duration-200 hover:brightness-90"
                style={{ backgroundColor: GOLD }}
              >
                Continuar ({selectedCount > 0 ? selectedCount : count})
              </Link>
            </div>

            {/* WHATSAPP — oculto si el carrito está bloqueado a una tienda
                con Mercado Pago propio (ver comentario histórico: un
                pedido coordinado por WhatsApp al número de INKognito no
                tiene cómo pagarle a quien no es dueño del producto). */}
            {!vendorLock && (
              <a
                href={buildWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                style={{ border: `1px solid rgba(201,168,76,0.5)`, backgroundColor: 'rgba(201,168,76,0.06)', color: '#8a7127' }}
              >
                <FaWhatsapp size={16} />
                Pedir por WhatsApp
              </a>
            )}
          </div>
        )}

      </aside>
    </>
  )
}
