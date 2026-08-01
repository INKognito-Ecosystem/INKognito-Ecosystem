import { useState } from 'react'
import { useSupplyCart } from '../../contexts/SupplyCartContext'

const VAR_THRESHOLD = 3

// Extraído de SupplyCategoryPage.jsx (2026-07-30) para reusarlo también en
// BrandCatalogSection.jsx — antes las páginas de marca no tenían forma de
// mostrar inventario real y cada una inventaba su propia card (algunas con
// productos y precios inventados, ej. "$XX.XXX", que además agregaban al
// carrito real si el cliente hacía clic). Una sola fuente de verdad para la
// card de producto de Supply.
export function VariantSelectorSupply({ variantObjs, selIdx, onChange }) {
  const [open, setOpen] = useState(false)
  if (!variantObjs || variantObjs.length <= 1) return null

  if (variantObjs.length <= VAR_THRESHOLD) {
    return (
      <div className="grid gap-1 w-full" style={{ gridTemplateColumns: `repeat(${variantObjs.length}, 1fr)` }}>
        {variantObjs.map((v, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`text-[9px] font-bold py-1 rounded border transition-all duration-200 text-center truncate ${
              selIdx === i
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-zinc-700 text-zinc-500 hover:border-blue-400 hover:text-white'
            }`}
          >
            {v.variant}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-1.5 px-2 rounded border border-zinc-700 text-[9px] font-bold text-zinc-300 hover:border-blue-400 transition-all duration-200"
      >
        <span className="truncate">{variantObjs[selIdx]?.variant || '—'}</span>
        <span className={`ml-1 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>▶</span>
      </button>
      {open && (
        <div className="mt-1 grid grid-cols-2 gap-1">
          {variantObjs.map((v, i) => (
            <button
              key={i}
              onClick={() => { onChange(i); setOpen(false) }}
              className={`text-[9px] font-bold py-1.5 px-1 rounded border transition-all duration-200 text-center truncate ${
                selIdx === i
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-zinc-700 text-zinc-500 hover:border-blue-400 hover:text-white'
              }`}
            >
              {v.variant}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SupplyProductCard({ item, categoria }) {
  const { items: cartItems, addItem } = useSupplyCart()
  const [selIdx, setSelIdx] = useState(0)

  const variantObjs = item.variantes?.filter(v => v.variant) ?? []
  const totalStock  = item.variantes?.reduce((s, v) => s + (v.stock || 0), 0) ?? 0
  const sel         = variantObjs[selIdx] || variantObjs[0] || {}

  const resolvedPrice = sel.price
    ? '$' + Math.round(sel.price).toLocaleString('es-CO')
    : null
  const activeImage = sel.image_url || item.image_url || null

  const productId = item.name + (sel.variant ? '-' + sel.variant : '')
  const cartKey = `${categoria}-${productId}`
  const enCarrito = cartItems.some(i => i.key === cartKey)

  const handleAdd = () => {
    addItem({
      id:    productId,
      name:  item.name + (sel.variant ? ` (${sel.variant})` : ''),
      price: resolvedPrice || '—',
      brand: item.descripcion || item.categoria || '',
      image: activeImage || '',
    }, categoria)
  }

  return (
    <div className="border border-blue-500/40 bg-zinc-950 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300 flex flex-col h-full">

      <div className="aspect-square w-full bg-zinc-900 overflow-hidden flex-shrink-0">
        {activeImage ? (
          <img
            key={activeImage}
            src={activeImage}
            alt={`${item.name}${sel.variant ? ' ' + sel.variant : ''}`}
            className="w-full h-full object-cover transition-opacity duration-200"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-zinc-700 uppercase tracking-[0.3em] text-[10px] text-center px-3">{item.name}</p>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1 gap-1.5 min-h-0">
        {item.descripcion && (
          <p className="text-zinc-500 uppercase tracking-[0.2em] text-[9px] leading-none">{item.descripcion}</p>
        )}
        <h3 className="text-xs font-black uppercase leading-tight text-white">{item.name}</h3>
        {resolvedPrice && <p className="text-white font-bold text-sm">{resolvedPrice}</p>}
        {totalStock <= 3 && totalStock > 0 && (
          <p className="text-yellow-500 text-[9px] font-bold">⚠️ Últimas {totalStock}</p>
        )}
        <div className="mt-auto pt-1">
          {variantObjs.length === 1 ? (
            <p className="text-[9px] font-bold text-zinc-400 uppercase truncate">{variantObjs[0].variant}</p>
          ) : (
            <VariantSelectorSupply variantObjs={variantObjs} selIdx={selIdx} onChange={setSelIdx} />
          )}
        </div>
      </div>

      <button
        onClick={handleAdd}
        className={`w-full py-2.5 font-bold uppercase tracking-[0.1em] text-[10px] flex-shrink-0 transition-all duration-300 ${
          enCarrito ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {enCarrito ? '✓ Agregado' : '+ Agregar al carrito'}
      </button>
    </div>
  )
}
