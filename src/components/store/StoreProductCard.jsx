import { useState } from 'react'
import { useStoreCart } from '../../contexts/StoreCartContext'

const VAR_THRESHOLD = 3

function SizeSelector({ sizes, selected, onChange }) {
  const [open, setOpen] = useState(false)
  if (!sizes || sizes.length === 0) return null

  if (sizes.length <= VAR_THRESHOLD) {
    return (
      <div className="grid gap-1 w-full" style={{ gridTemplateColumns: `repeat(${sizes.length}, 1fr)` }}>
        {sizes.map(s => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`text-[9px] font-bold py-1 rounded border transition-all duration-200 text-center truncate ${
              selected === s
                ? 'text-black border-[#C9A84C]'
                : 'border-gray-300 text-gray-500 hover:border-[#C9A84C] hover:text-gray-900'
            }`}
            style={selected === s ? { backgroundColor: '#C9A84C' } : {}}
          >
            {s}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-1.5 px-2 rounded border border-gray-300 text-[9px] font-bold text-gray-600 hover:border-[#C9A84C] transition-all duration-200"
      >
        <span className="truncate">{selected || 'Elegir talla'}</span>
        <span className={`ml-1 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>▶</span>
      </button>
      {open && (
        <div className="mt-1 grid grid-cols-3 gap-1">
          {sizes.map(s => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false) }}
              className={`text-[9px] font-bold py-1.5 px-1 rounded border transition-all duration-200 text-center truncate ${
                selected === s
                  ? 'text-black border-[#C9A84C]'
                  : 'border-gray-300 text-gray-500 hover:border-[#C9A84C] hover:text-gray-900'
              }`}
              style={selected === s ? { backgroundColor: '#C9A84C' } : {}}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function StoreProductCard({ product, category, sizes }) {
  const { addItem } = useStoreCart()
  const [selectedSize, setSelectedSize] = useState('')
  const [added, setAdded] = useState(false)

  const hasSizes = sizes && sizes.length > 0
  const canAdd   = !hasSizes || !!selectedSize

  const activeImage = (() => {
    if (selectedSize && product._item?.variantes) {
      const v = product._item.variantes.find(v => v.variant === selectedSize)
      if (v?.image_url) return v.image_url
    }
    return product.image || null
  })()

  const handleAdd = () => {
    if (!canAdd) return
    addItem(product, category, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl md:rounded-2xl overflow-hidden hover:border-[#C9A84C] hover:shadow-md transition-all duration-300 flex flex-col h-full">

      <div className="aspect-square w-full overflow-hidden bg-gray-100 relative flex-shrink-0">
        {activeImage ? (
          <img
            key={activeImage}
            src={activeImage}
            alt={`${product.name}${selectedSize ? ' ' + selectedSize : ''}`}
            className="w-full h-full object-cover transition-opacity duration-200"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p className="text-gray-400 uppercase tracking-[0.3em] text-[10px]">Imagen</p>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1 gap-1.5 min-h-0">
        {(product.brand || product.tag) && (
          <p className="text-[#C9A84C] uppercase tracking-[0.2em] text-[9px] md:text-[10px] leading-none">
            {product.brand}{product.tag ? ` — ${product.tag}` : ''}
          </p>
        )}
        <h3 className="text-xs md:text-sm font-black uppercase leading-tight text-gray-900">
          {product.name}
        </h3>
        <span className="text-gray-900 font-bold text-sm">{product.price}</span>
        <div className="mt-auto pt-1">
          <SizeSelector sizes={sizes} selected={selectedSize} onChange={setSelectedSize} />
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={!canAdd}
        className={`w-full py-2.5 font-bold uppercase tracking-[0.1em] text-[10px] md:text-xs flex-shrink-0 transition-all duration-300 ${
          added    ? 'bg-green-500 text-white'
          : canAdd ? 'text-black hover:brightness-90'
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        style={added || !canAdd ? {} : { backgroundColor: '#C9A84C' }}
      >
        {added ? '✓ Agregado' : canAdd ? '+ Agregar al carrito' : 'Elige talla'}
      </button>

    </div>
  )
}
