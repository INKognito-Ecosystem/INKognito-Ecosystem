import { useEffect } from 'react'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { useSupplyCart } from '../../contexts/SupplyCartContext'

export default function CartDrawerSupply({ open, onClose }) {
  const { items, removeItem, changeQty, clearCart, total, count } = useSupplyCart()

  // Cierra con Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Bloquea scroll del body cuando el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const buildWhatsAppMessage = () => {
    const lines = items.map(i => {
      const subtotal = (parseInt(String(i.price).replace(/[^0-9]/g, ''), 10) || 0) * i.qty
      const variante = i.brand ? ` (${i.brand})` : ''
      return `• ${i.name}${variante} — ${i.qty} und — ${i.price} c/u`
    })
    const msg = [
      'Hola, quiero hacer un pedido en INKognito Supply:',
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
        className={`fixed inset-0 bg-black/70 z-[60] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* DRAWER */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-zinc-950 border-l border-zinc-800 z-[70] flex flex-col transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 flex-shrink-0">
          <div>
            <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs mb-0.5">
              INKognito Supply
            </p>
            <h2 className="font-black uppercase tracking-[0.2em] text-lg flex items-center gap-2">
              Carrito
              {count > 0 && (
                <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {count}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors duration-200 p-1"
          >
            <X size={22} />
          </button>
        </div>

        {/* ITEMS */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center">
                <span className="text-zinc-600 text-2xl">∅</span>
              </div>
              <p className="uppercase tracking-[0.2em] text-zinc-500 text-xs">
                Tu carrito está vacío
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(item => {
                const unitPrice = parseInt(String(item.price).replace(/[^0-9]/g, ''), 10) || 0
                const subtotal = unitPrice * item.qty
                return (
                  <li key={item.key} className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/40">

                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] mb-0.5">
                          {item.brand}
                        </p>
                        <p className="font-black uppercase text-sm leading-tight truncate">
                          {item.name}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.key)}
                        className="text-zinc-600 hover:text-red-500 transition-colors duration-200 flex-shrink-0 mt-0.5"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* CANTIDAD */}
                      <div className="flex items-center gap-0 border border-zinc-700 rounded">
                        <button
                          onClick={() => changeQty(item.key, item.qty - 1)}
                          className="px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 py-1.5 text-sm font-bold text-white border-x border-zinc-700 min-w-[2rem] text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => changeQty(item.key, item.qty + 1)}
                          className="px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* SUBTOTAL */}
                      <div className="text-right">
                        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.15em]">
                          {item.price} c/u
                        </p>
                        <p className="font-black text-white text-sm">
                          ${subtotal.toLocaleString('es-CO')}
                        </p>
                      </div>
                    </div>

                  </li>
                )
              })}
            </ul>
          )}

        </div>

        {/* FOOTER */}
        {items.length > 0 && (
          <div className="border-t border-zinc-800 px-6 py-5 flex-shrink-0 space-y-4">

            {/* TOTAL */}
            <div className="flex items-center justify-between">
              <p className="uppercase tracking-[0.25em] text-zinc-400 text-xs font-semibold">
                Total estimado
              </p>
              <p className="font-black text-xl text-white">
                ${total.toLocaleString('es-CO')}
              </p>
            </div>

            {/* WHATSAPP */}
            <a
              href={buildWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl border border-green-500/30 bg-zinc-900 text-white uppercase tracking-[0.2em] text-xs font-bold transition-all duration-300 hover:border-green-500 hover:shadow-[0_0_25px_rgba(34,197,94,0.3)]"
            >
              <FaWhatsapp size={18} />
              Realizar Pedido por WhatsApp
            </a>

            {/* LIMPIAR */}
            <button
              onClick={clearCart}
              className="w-full text-center uppercase tracking-[0.2em] text-zinc-600 text-[10px] hover:text-red-500 transition-colors duration-200"
            >
              Vaciar carrito
            </button>

          </div>
        )}

      </aside>
    </>
  )
}
