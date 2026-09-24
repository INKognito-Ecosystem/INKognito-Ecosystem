import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Share2, Minus, Plus, Trash2, Check, Package } from 'lucide-react'
import { useSupleCart } from '../../contexts/SupleCartContext'
import EnvioGratisBar from '../pedido/EnvioGratisBar'
import GuardarDireccionButton from '../pedido/GuardarDireccionButton'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Rediseño al nivel de CartDrawerStore.jsx (2026-09-19, migración de Suple
// a fondo blanco) — mismo lenguaje visual: foto real por fila, casilla de
// selección estilo Mercado Libre, stock real consultado en segundo plano,
// tipografía limpia (nada de uppercase/font-black), pantalla completa en
// móvil. Acento grafito (zinc-700). Una sola salida, "Continuar" al pedido
// en línea — sin botón de WhatsApp ni "Vaciar carrito" (2026-09-19, Jose:
// "elimina eso"), igual que CartDrawerStore.jsx.
export default function CartDrawerSuple({ open, onClose }) {
  const {
    items, removeItem, changeQty, count, total,
    selectedKeys, toggleSelected, setAllSelected, allSelected, selectedCount, selectedTotal, vendorLock,
  } = useSupleCart()

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
  // mismo motivo que en CartDrawerStore.jsx.
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
          next[id] = variante ? (variante.stock ?? 0) : null
        })
        return next
      })
    })
    return () => { cancelado = true }
  }, [items, stockMap])

  const [shareMsg, setShareMsg] = useState(null)
  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      try { await navigator.share({ title: 'INKognito Suple', url }) } catch {}
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
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* DRAWER — pantalla completa en móvil, panel lateral en desktop */}
      <aside
        className={`fixed top-0 right-0 h-full w-full md:max-w-sm bg-white border-l border-zinc-200 z-[70] flex flex-col transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >

        {/* HEADER */}
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
              <p className="text-zinc-400 text-xs">INKognito Suple</p>
              <h2 className="font-bold text-lg flex items-center gap-2 text-gray-900">
                Carrito
                {count > 0 && (
                  <span className="bg-zinc-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
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

        {/* GUARDAR DIRECCIÓN (2026-09-23) — arriba de "Todos los productos" */}
        {items.length > 0 && <GuardarDireccionButton />}

        {/* SELECCIONAR TODOS */}
        {items.length > 0 && (
          <button
            onClick={() => setAllSelected(!allSelected)}
            className="flex items-center gap-2.5 px-6 py-3 border-b border-zinc-200 flex-shrink-0"
          >
            <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
              allSelected ? 'border-transparent bg-zinc-700' : 'border-zinc-300'
            }`}>
              {allSelected && <Check size={10} className="text-white" strokeWidth={3} />}
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
                  <li key={item.key} className="flex items-start gap-3 py-3 border-b border-zinc-200 -mx-6 px-6">

                    {/* CASILLA */}
                    <button
                      onClick={() => toggleSelected(item.key)}
                      aria-label={isSelected ? 'Quitar de la selección' : 'Agregar a la selección'}
                      className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                        isSelected ? 'border-transparent bg-zinc-700' : 'border-zinc-300'
                      }`}
                    >
                      {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
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
                          <p className="font-semibold text-sm leading-snug text-gray-900 line-clamp-2">
                            {item.name}
                          </p>
                          {item.brand && (
                            <p className="text-zinc-400 text-xs mt-0.5 truncate">{item.brand}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.key)}
                          aria-label="Quitar del carrito"
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
          )}

        </div>

        {/* Envío gratis (2026-09-22, Ruta del Golfo) — mismo criterio que
            CartDrawerStore.jsx. */}
        {items.length > 0 && <EnvioGratisBar vendorLock={vendorLock} subtotal={selectedCount > 0 ? selectedTotal : total} />}

        {/* FOOTER — Total + Continuar (2-col, como CartDrawerStore.jsx). */}
        {items.length > 0 && (
          <div className="border-t border-zinc-200 px-6 py-5 flex-shrink-0">

            <div className="grid grid-cols-2 gap-3 items-stretch">
              <div className="flex flex-col justify-center">
                <p className="text-xs text-zinc-400">Total</p>
                <p className="font-bold text-xl text-gray-900">
                  ${(selectedCount > 0 ? selectedTotal : total).toLocaleString('es-CO')}
                </p>
              </div>

              <Link
                to="/pedido/suplementos"
                onClick={onClose}
                className="flex items-center justify-center rounded-xl bg-zinc-700 text-white font-semibold text-sm transition-colors duration-200 hover:bg-zinc-800"
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
