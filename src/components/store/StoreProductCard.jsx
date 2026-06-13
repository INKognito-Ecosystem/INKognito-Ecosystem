import { useState } from 'react'
import { useStoreCart } from '../../contexts/StoreCartContext'

export default function StoreProductCard({ product, category, sizes }) {
  const { addItem } = useStoreCart()
  const [selectedSize, setSelectedSize] = useState('')
  const [showError, setShowError] = useState(false)

  const handleAdd = () => {
    if (!selectedSize) {
      setShowError(true)
      return
    }
    setShowError(false)
    addItem(product, category, selectedSize)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl md:rounded-2xl overflow-hidden hover:border-[#C9A84C] hover:shadow-md transition-all duration-300">
      <div className="aspect-square w-full overflow-hidden bg-gray-100 relative">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextSibling.style.display = 'flex'
            }}
          />
        )}
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100"
          style={{ display: product.image ? 'none' : 'flex' }}
        >
          <p className="text-gray-400 uppercase tracking-[0.3em] text-xs">Imagen</p>
        </div>
      </div>
      <div className="p-4 md:p-5">
        <p className="text-[#C9A84C] uppercase tracking-[0.25em] text-[10px] md:text-xs mb-1">
          {product.brand}{product.tag ? ` — ${product.tag}` : ''}
        </p>
        <h3 className="text-base md:text-lg font-black uppercase mb-2 leading-tight text-gray-900">
          {product.name}
        </h3>
        <span className="text-gray-900 font-bold text-base md:text-lg block mb-3">
          {product.price}
        </span>

        {/* SELECTOR DE TALLA */}
        <div className="mb-2">
          <select
            value={selectedSize}
            onChange={(e) => {
              setSelectedSize(e.target.value)
              if (e.target.value) setShowError(false)
            }}
            className="w-full py-2 px-3 border rounded text-sm bg-white text-gray-700 outline-none cursor-pointer transition-colors duration-200"
            style={{ borderColor: selectedSize ? '#C9A84C' : '#d1d5db' }}
          >
            <option value="">Talla</option>
            {sizes.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {showError && (
            <p className="text-red-500 text-xs mt-1">
              Por favor selecciona una talla
            </p>
          )}
        </div>

        <button
          onClick={handleAdd}
          className="w-full py-2.5 font-bold uppercase tracking-[0.15em] text-xs text-black transition-all duration-300 hover:brightness-90"
          style={{ backgroundColor: '#C9A84C' }}
        >
          + Agregar al carrito
        </button>
      </div>
    </div>
  )
}
