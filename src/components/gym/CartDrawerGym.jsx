import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Share2, Minus, Plus, Trash2, Check, Package } from 'lucide-react'
import { useGymCart } from '../../contexts/GymCartContext'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Rediseño al nivel de CartDrawerSupply.jsx / CartDrawerStore.jsx /
// CartDrawerSuple.jsx (2026-09-20, Jose: "el carrito también deberás
// actualizarlo, a como está en los demás módulos") — mismo lenguaje: foto
// real por fila, casilla de selección estilo Mercado Libre, stepper topado al
// stock REAL (consultado en segundo plano), tipografía limpia (nada de
// uppercase/font-black), pantalla completa en móvil, una sola salida
// ("Continuar" al pedido en línea — sin WhatsApp ni "Vaciar carrito").
// Gym sigue en oscuro (toda su página lo es) y sin color de acento: el
// blanco hace de acento, igual que en su navbar y sus botones.
export default function CartDrawerGym({ open, onClose }) {
  const {
    items, removeItem, changeQty, count, total,
    selectedKeys, toggleSelected, setAllSelected, allSelected, selectedCount, selectedTotal,
  } = useGymCart()

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

  // Stock real — dispara apenas el carrito (siempre montado desde el navbar
  // y el tab bar) tiene items, sin esperar a que el drawer esté abierto,
  // mismo motivo que en CartDrawerSupply.jsx. Reusa /api/product/:id.
  const [stockMap, setStockMap] = useState({})
  useEffect(() => {
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
          // null = no se pudo verificar (producto borrado o de baja) — se
          // trata distinto de "0 en stock" para no confundir un error de red
          // con un producto real agotado.
          next[id] = variante ? (variante.stock ?? 0) : null
        })
        return next
      })
    })
    return () => { cancelado = true }
  }, [items, stockMap])

  // Compartir — el carrito no tiene link propio (es local, por dispositivo),
  // así que comparte la página desde la que se abrió.
  const [shareMsg, setShareMsg] = useState(null)
  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      try { await navigator.share({ title: 'INKognito Gym System', url }) } catch {}
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setShareMsg('Link copiado')
      setTimeout(() => setShareMsg(null), 2000)
    } catch {}
  }

  return (
    <>
      {/* BACKDROP */}
      <div
        className={`fixed inset-0 bg-black/70 z-[60] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* DRAWER — pantalla completa en móvil, panel lateral en desktop */}
      <aside
        className={`fixed top-0 right-0 h-full w-full md:max-w-sm bg-gray-950 border-l border-gray-800 z-[70] flex flex-col transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >

        {/* HEADER */}
        <div className="relative flex items-center justify-between gap-3 px-6 py-5 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              aria-label="Volver"
              className="flex-shrink-0 text-gray-500 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="min-w-0">
              <p className="text-gray-500 text-xs">INKognito Gym System</p>
              <h2 className="font-bold text-lg flex items-center gap-2 text-white">
                Carrito
                {count > 0 && (
                  <span className="bg-white text-gray-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </h2>
            </div>
          </div>
          <button
            onClick={handleShare}
            aria-label="Compartir"
            className="flex-shrink-0 text-gray-500 hover:text-white transition-colors duration-200"
          >
            <Share2 size={20} />
          </button>

          {shareMsg && (
            <div className="absolute left-0 right-0 top-full mt-2 flex justify-center pointer-events-none z-10">
              <p className="bg-white text-gray-950 text-xs font-medium px-4 py-2 rounded-full shadow-lg">{shareMsg}</p>
            </div>
          )}
        </div>

        {/* SELECCIONAR TODOS */}
        {items.length > 0 && (
          <button
            onClick={() => setAllSelected(!allSelected)}
            className="flex items-center gap-2.5 px-6 py-3 border-b border-gray-800 flex-shrink-0"
          >
            <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
              allSelected ? 'border-transparent bg-white' : 'border-gray-700'
            }`}>
              {allSelected && <Check size={10} className="text-gray-950" strokeWidth={3} />}
            </span>
            <span className="text-xs font-medium text-white">
              Todos los productos
            </span>
          </button>
        )}

        {/* ITEMS */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-16 h-16 rounded-full border border-gray-800 flex items-center justify-center">
                <span className="text-gray-500 text-2xl">∅</span>
              </div>
              <p className="text-gray-500 text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            <ul>
              {items.map(item => {
                const unitPrice = parseInt(String(item.price).replace(/[^0-9]/g, ''), 10) || 0
                const subtotal = unitPrice * item.qty
                const isSelected = selectedKeys.has(item.key)
                // Cae al stock ya conocido desde que se agregó (item.stock)
                // mientras el fetch fresco no responde todavía.
                const stockReal = item.inventoryId
                  ? (item.inventoryId in stockMap ? stockMap[item.inventoryId] : (typeof item.stock === 'number' ? item.stock : undefined))
                  : undefined
                const sinStock = stockReal === 0
                const noDisponible = stockReal === null
                const atMax = typeof stockReal === 'number' && item.qty >= stockReal
                const mostrarQuedan = typeof stockReal === 'number' && stockReal > 0 && stockReal <= 10

                return (
                  <li key={item.key} className="flex items-start gap-3 py-3 border-b border-gray-800 -mx-6 px-6">

                    {/* CASILLA */}
                    <button
                      onClick={() => toggleSelected(item.key)}
                      aria-label={isSelected ? 'Quitar de la selección' : 'Agregar a la selección'}
                      className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                        isSelected ? 'border-transparent bg-white' : 'border-gray-700'
                      }`}
                    >
                      {isSelected && <Check size={10} className="text-gray-950" strokeWidth={3} />}
                    </button>

                    {/* FOTO */}
                    <div className="relative flex-shrink-0">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-800 bg-gray-900">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={22} className="text-gray-500" />
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
                          <p className="font-semibold text-sm leading-snug text-white line-clamp-2">
                            {item.name}
                          </p>
                          {item.brand && (
                            <p className="text-gray-500 text-xs mt-0.5 truncate">{item.brand}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.key)}
                          aria-label="Quitar del carrito"
                          className="text-gray-600 hover:text-red-500 transition-colors duration-200 flex-shrink-0 mt-0.5"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {noDisponible && (
                        <p className="text-red-500 text-xs mt-1">Ya no está disponible — quítalo del carrito.</p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        {/* CANTIDAD */}
                        <div className="flex items-center gap-0 border border-gray-700 rounded">
                          <button
                            onClick={() => changeQty(item.key, item.qty - 1)}
                            aria-label="Restar unidad"
                            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="px-2 py-1 text-xs font-medium text-white border-x border-gray-700 min-w-[1.5rem] text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => !atMax && changeQty(item.key, item.qty + 1)}
                            disabled={atMax}
                            aria-label="Sumar unidad"
                            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        {/* SUBTOTAL */}
                        <p className="font-semibold text-white text-sm">
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

        {/* FOOTER — Total + Continuar (2-col, como CartDrawerSupply.jsx). */}
        {items.length > 0 && (
          <div className="border-t border-gray-800 px-6 py-5 flex-shrink-0">

            <div className="grid grid-cols-2 gap-3 items-stretch">
              <div className="flex flex-col justify-center">
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-bold text-xl text-white">
                  ${(selectedCount > 0 ? selectedTotal : total).toLocaleString('es-CO')}
                </p>
              </div>

              <Link
                to="/pedido/gym"
                onClick={onClose}
                className="flex items-center justify-center rounded-xl bg-white text-gray-950 font-semibold text-sm transition-colors duration-200 hover:bg-gray-200"
              >
                Continuar ({selectedCount > 0 ? selectedCount : count})
              </Link>
            </div>

          </div>
        )}

      </aside>
    </>
  )
}
