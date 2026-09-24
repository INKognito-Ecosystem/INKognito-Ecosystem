import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Share2, Minus, Plus, Trash2, Check, Package } from 'lucide-react'
import { useSupplyCart } from '../../contexts/SupplyCartContext'
import GuardarDireccionButton from '../pedido/GuardarDireccionButton'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Separa "Producto (Variante)" para mostrar la variante DEBAJO del nombre,
// no pegada al frente (2026-09-15, Jose: "la referencia de la caja...
// debería estar debajo del nombre y no enfrente") — el dato real sigue
// siendo un solo string (item.name, así se arma en SupplyProductCard.jsx/
// SupplyProductDetailPage.jsx: `${nombre} (${variante})`) porque ese mismo
// string también viaja tal cual al mensaje de WhatsApp y a PedidoOnlinePage;
// separarlo a nivel de dato habría tocado esos dos consumidores sin
// necesidad. Acá solo se parte para pintarlo en dos líneas.
function partirNombre(nombre) {
  const m = nombre.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
  return m ? { base: m[1], variante: m[2] } : { base: nombre, variante: null }
}

// Rediseño estilo Mercado Libre (2026-09-15, Jose compartió una captura de
// referencia) — antes era una lista simple sin foto y sin selección; ahora
// cada fila trae vista previa real, casilla de selección (arriba a la
// izquierda, igual que en la referencia) y el stepper de cantidad queda
// topado al stock REAL del producto (no al que tenía cuando se agregó,
// que puede haber cambiado). La selección vive en SupplyCartContext, no
// solo acá, para que PedidoOnlinePage.jsx también la respete al armar el
// pedido — ver comentario ahí.
//
// Segunda pasada (2026-09-15, Jose: "recuerda que ahora es más limpia y
// profesional") — tipografía general bajada de tono: nada de font-black/
// uppercase/tracking ancho en nombre y precios (esa era la identidad
// oscura/streetwear del resto del sitio, no encaja en un carrito tipo
// marketplace). Casilla más chica, foto más grande, sin el nombre de
// categoría sobre el producto, stepper más compacto. Footer: precio y
// "Continuar" (azul, no el verde de antes) en una sola fila de 2
// columnas; el botón de WhatsApp se quitó del todo.
//
// light (2026-09-15, piloto de Jose en Cartuchos: "el carrito no ha
// cambiado a color blanco aún, recuerda que negro solo será en la página
// principal") — default false para no tocar el carrito en el resto del
// sitio. Además: en móvil el carrito ahora ocupa toda la pantalla (antes
// max-w-sm dejaba una franja angosta) — eso aplica siempre, no solo en el
// piloto claro. Al ser de pantalla completa en móvil, ya "reemplaza" al
// SupplyMobileNav mientras está abierto (mismo z-index más alto, mismo
// alto completo) sin necesidad de ocultarlo aparte.
export default function CartDrawerSupply({ open, onClose, light = false }) {
  const {
    items, removeItem, changeQty, count,
    selectedKeys, toggleSelected, setAllSelected, allSelected, selectedCount, selectedTotal, total,
  } = useSupplyCart()
  // bg gris claro, no blanco (2026-09-15, Jose) — solo el fondo del
  // drawer cambia de tono; sin tarjeta/burbuja propia para el grupo de
  // productos (Jose: "no te pedí agregar los productos en una especie
  // de burbuja").
  const t = light ? {
    bg: 'bg-zinc-50', border: 'border-zinc-200', text: 'text-zinc-900', textMuted: 'text-zinc-500', textMuted2: 'text-zinc-400',
    itemBorder: 'border-zinc-200', qtyBorder: 'border-zinc-300', qtyText: 'text-zinc-600',
    imgBg: 'bg-white', checkboxBorder: 'border-zinc-300',
  } : {
    bg: 'bg-zinc-950', border: 'border-zinc-800', text: 'text-white', textMuted: 'text-zinc-500', textMuted2: 'text-zinc-400',
    itemBorder: 'border-zinc-800', qtyBorder: 'border-zinc-700', qtyText: 'text-zinc-400',
    imgBg: 'bg-zinc-900', checkboxBorder: 'border-zinc-700',
  }

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

  // Stock real (2026-09-15, Jose: "obviamente esto debe leer stock real
  // del producto, para no dejar pedir una cantidad que no hay en stock")
  // — el carrito solo guardaba el precio/nombre al momento de agregar, no
  // el stock (que puede cambiar después). Ya NO espera a que `open` sea
  // true (2026-09-16, Jose: "el quedan x producto sigue apareciendo
  // luego" — items agregados antes de este ajuste, guardados en
  // localStorage sin su propio `.stock`, seguían mostrando el hueco hasta
  // que el usuario abría el carrito Y el fetch resolvía). Ahora dispara
  // apenas el carrito (siempre montado, ver NavbarCategory/SupplyMobileNav)
  // tiene items, sin importar si el drawer está visible — reusa
  // /api/product/:id, el mismo endpoint de la ficha de producto
  // (SupplyProductDetailPage.jsx), sin backend nuevo.
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
          // null = no se pudo verificar (producto borrado o de baja) —
          // se trata distinto de "0 en stock" para no confundir un error
          // de red con un producto real agotado.
          next[id] = variante ? (variante.stock ?? 0) : null
        })
        return next
      })
    })
    return () => { cancelado = true }
  }, [items, stockMap])

  // Compartir (2026-09-15, Jose: "en la zona derecha deberá ir el botón
  // de compartir") — mismo patrón (Web Share API con fallback a
  // portapapeles) ya usado en NavbarCategory.jsx/SupplyCategoriasPage.jsx.
  // El carrito no tiene un link propio (es local, por dispositivo), así
  // que comparte la página desde la que se abrió.
  const [shareMsg, setShareMsg] = useState(null)
  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      try { await navigator.share({ title: 'INKognito Supply', url }) } catch {}
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
        className={`fixed top-0 right-0 h-full w-full md:max-w-sm ${t.bg} border-l ${t.border} z-[70] flex flex-col transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >

        {/* HEADER — flecha de volver a la izquierda (reemplaza a la X),
            botón de compartir a la derecha (2026-09-15, Jose). Texto sin
            mayúsculas/tracking ancho, mismo criterio "limpio y
            profesional" que el resto del carrito. */}
        <div className={`relative flex items-center justify-between gap-3 px-6 py-5 border-b ${t.border} flex-shrink-0`}>
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              aria-label="Volver"
              className={`flex-shrink-0 ${t.textMuted} hover:${light ? 'text-black' : 'text-white'} transition-colors duration-200`}
            >
              <ArrowLeft size={20} />
            </button>
            <div className="min-w-0">
              <p className={`${t.textMuted} text-xs`}>
                INKognito Supply
              </p>
              <h2 className={`font-bold text-lg flex items-center gap-2 ${t.text}`}>
                Carrito
                {count > 0 && (
                  <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </h2>
            </div>
          </div>
          <button
            onClick={handleShare}
            aria-label="Compartir"
            className={`flex-shrink-0 ${t.textMuted} hover:${light ? 'text-black' : 'text-white'} transition-colors duration-200`}
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
        {items.length > 0 && <GuardarDireccionButton dark={!light} />}

        {/* SELECCIONAR TODOS */}
        {items.length > 0 && (
          <button
            onClick={() => setAllSelected(!allSelected)}
            className={`flex items-center gap-2.5 px-6 py-3 border-b ${t.border} flex-shrink-0`}
          >
            <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
              allSelected ? 'bg-blue-500 border-blue-500' : t.checkboxBorder
            }`}>
              {allSelected && <Check size={10} className="text-white" strokeWidth={3} />}
            </span>
            <span className={`text-xs font-medium ${t.text}`}>
              Todos los productos
            </span>
          </button>
        )}

        {/* ITEMS */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className={`w-16 h-16 rounded-full border ${t.border} flex items-center justify-center`}>
                <span className={`${t.textMuted} text-2xl`}>∅</span>
              </div>
              <p className={`${t.textMuted} text-sm`}>
                Tu carrito está vacío
              </p>
            </div>
          ) : (
            // Sin tarjeta/burbuja (2026-09-15, Jose: "no te pedí agregar
            // los productos en una especie de burbuja... solo dos líneas
            // horizontales que los dividen, y la línea que divida cada
            // producto no debe ser diferente") — deshecho el fondo/
            // esquinas redondeadas de la vuelta anterior. "Productos de
            // X" es un simple border-b, EXACTAMENTE la misma línea que
            // ya separa "Todos los productos" arriba y cada producto
            // entre sí. -mx-6 px-6, no -mx-3 px-3: sin tarjeta propia, la
            // referencia de "toda la pantalla" vuelve a ser el ancho del
            // drawer (contenedor ITEMS con px-6), como antes de la
            // burbuja.
            <>
              {items[0]?.estudioNombre && (
                <p className={`text-xs font-medium ${t.textMuted} -mx-6 px-6 pb-3 border-b ${t.border}`}>
                  Productos de {items[0].estudioNombre}
                </p>
              )}
              {/* border-b por <li> en vez de divide-y en el <ul> — el
                  divide-y no estaba pintando su borde en absoluto en el
                  panel de escritorio (0px de ancho, comprobado con
                  getComputedStyle), aunque en móvil sí se veía; en vez de
                  perseguir esa inconsistencia, border-b directo en cada
                  fila es el mismo mecanismo ya probado en el resto del
                  componente (Jose, 2026-09-15: "la línea... no puede ser
                  más oscura, y no debe dejar espacio en sus extremos"). El
                  -mx-6 px-6 vive en cada <li> (no en el <ul>): el border-b
                  real está en el <li>, un nivel más adentro que el <ul> —
                  ponerlo en el <ul> solo estiraba el <ul> mismo, pero su
                  propio px-6 volvía a encoger a cada <li> hijo antes de
                  llegar al borde real (bug reportado por Jose: "no están
                  ocupando todo el ancho en móvil"). */}
              <ul>
              {items.map(item => {
                const unitPrice = parseInt(String(item.price).replace(/[^0-9]/g, ''), 10) || 0
                const subtotal = unitPrice * item.qty
                const isSelected = selectedKeys.has(item.key)
                const { base: nombreBase, variante: refVariante } = partirNombre(item.name)
                // stockReal: undefined = todavía no se consultó, null = no
                // se pudo verificar (producto de baja), número = stock real.
                // Mientras el fetch fresco de abajo no responde, cae al
                // stock ya conocido desde que se agregó (item.stock) —
                // sin esto la insignia "Quedan X" aparecía vacía y saltaba
                // un segundo después de abrir el carrito (Jose, 2026-09-16).
                const stockReal = item.inventoryId
                  ? (item.inventoryId in stockMap ? stockMap[item.inventoryId] : (typeof item.stock === 'number' ? item.stock : undefined))
                  : undefined
                const sinStock = stockReal === 0
                const noDisponible = stockReal === null
                const atMax = typeof stockReal === 'number' && item.qty >= stockReal
                const mostrarQuedan = typeof stockReal === 'number' && stockReal > 0 && stockReal <= 10

                return (
                  // Sin card con borde/fondo propio (2026-09-15, Jose: "no
                  // debe tener borde en los laterales... más compacto") —
                  // ahora es una fila plana separada por una línea, mismo
                  // criterio que una lista de marketplace. border-b en
                  // TODAS las filas (incluida la última, "falta la de
                  // abajo del producto") — mismo t.border que ya funciona
                  // en el resto del componente.
                  <li key={item.key} className={`flex items-start gap-3 py-3 border-b ${t.border} -mx-6 px-6`}>

                    {/* CASILLA — aparte de la foto, sin superponerse
                        (2026-09-15, Jose, decisión final tras probar la
                        versión "detrás de la imagen": mejor un elemento
                        propio a la izquierda, alineado con el borde
                        superior de la foto, sin trucos de z-index/
                        pointer-events). */}
                    <button
                      onClick={() => toggleSelected(item.key)}
                      aria-label={isSelected ? 'Quitar de la selección' : 'Agregar a la selección'}
                      className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                        isSelected ? 'bg-blue-500 border-blue-500' : t.checkboxBorder
                      }`}
                    >
                      {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                    </button>

                    {/* FOTO */}
                    <div className="relative flex-shrink-0">
                      <div className={`relative w-20 h-20 rounded-lg overflow-hidden border ${t.itemBorder} ${t.imgBg}`}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={22} className={t.textMuted2} />
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

                    {/* NOMBRE + ELIMINAR — sin el nombre de categoría
                        arriba (Jose: "quita el nombre de la categoría"),
                        tipografía limpia (sin uppercase/font-black — ver
                        comentario arriba del componente), variante en
                        una línea propia debajo del nombre. */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className={`font-semibold text-sm leading-snug truncate ${t.text}`}>
                            {nombreBase}
                          </p>
                          {refVariante && (
                            <p className={`${t.textMuted} text-xs mt-0.5 truncate`}>{refVariante}</p>
                          )}
                          {item.mixLabel && (
                            <p className={`${t.textMuted} text-xs mt-0.5 truncate`}>{item.mixLabel}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.key)}
                          className={`${light ? 'text-zinc-400' : 'text-zinc-600'} hover:text-red-500 transition-colors duration-200 flex-shrink-0 mt-0.5`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {noDisponible && (
                        <p className="text-red-500 text-xs mt-1">Ya no está disponible — quítalo del carrito.</p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        {/* CANTIDAD — más compacta que antes (Jose: "el
                            selector de cantidad... está demasiado
                            grande"), topada al stock real. */}
                        <div className={`flex items-center gap-0 border ${t.qtyBorder} rounded`}>
                          <button
                            onClick={() => changeQty(item.key, item.qty - 1)}
                            aria-label="Restar unidad"
                            className={`px-2 py-1 ${t.qtyText} hover:${light ? 'text-black hover:bg-zinc-100' : 'text-white hover:bg-zinc-800'} transition-all duration-200`}
                          >
                            <Minus size={10} />
                          </button>
                          <span className={`px-2 py-1 text-xs font-medium ${t.text} border-x ${t.qtyBorder} min-w-[1.5rem] text-center`}>
                            {item.qty}
                          </span>
                          <button
                            onClick={() => !atMax && changeQty(item.key, item.qty + 1)}
                            disabled={atMax}
                            aria-label="Sumar unidad"
                            className={`px-2 py-1 ${t.qtyText} transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${!atMax && (light ? 'hover:text-black hover:bg-zinc-100' : 'hover:text-white hover:bg-zinc-800')}`}
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        {/* SUBTOTAL — solo el valor, sin el "c/u" (Jose,
                            2026-09-15). */}
                        <p className={`font-semibold ${t.text} text-sm`}>
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

        {/* FOOTER — reemplaza al navbar inferior mientras el carrito está
            abierto (mismo z-index alto, mismo w-full h-full en móvil).
            Precio y "Continuar" en una sola fila de 2 columnas, azul en
            vez del verde de antes; el botón de WhatsApp se quitó (Jose,
            2026-09-15). */}
        {items.length > 0 && (
          <div className={`border-t ${t.border} px-6 py-5 flex-shrink-0`}>

            <div className="grid grid-cols-2 gap-3 items-stretch">
              <div className="flex flex-col justify-center">
                <p className={`text-xs ${t.textMuted}`}>
                  Total
                </p>
                <p className={`font-bold text-xl ${t.text}`}>
                  ${(selectedCount > 0 ? selectedTotal : total).toLocaleString('es-CO')}
                </p>
              </div>

              <Link
                to="/pedido/supply"
                onClick={onClose}
                className="flex items-center justify-center rounded-xl bg-blue-500 text-white font-semibold text-sm transition-colors duration-200 hover:bg-blue-600"
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
