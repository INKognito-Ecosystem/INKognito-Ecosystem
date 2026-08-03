import { useState } from 'react'
import ProductImageGallery from '../ProductImageGallery'

const VAR_THRESHOLD = 3

function VariantSelectorSupl({ variantes, selIdx, onChange }) {
  const [open, setOpen] = useState(false)
  if (!variantes || variantes.length === 0) return null

  if (variantes.length === 1) {
    return variantes[0].variant ? (
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">
        Presentación: {variantes[0].variant}
      </p>
    ) : null
  }

  if (variantes.length <= VAR_THRESHOLD) {
    return (
      <div className="grid gap-1 w-full" style={{ gridTemplateColumns: `repeat(${variantes.length}, 1fr)` }}>
        {variantes.map((v, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`text-[9px] font-bold py-1 rounded border transition-all duration-200 text-center truncate ${
              selIdx === i
                ? 'bg-white text-gray-950 border-white'
                : 'border-gray-700 text-gray-500 hover:border-gray-400 hover:text-white'
            }`}
          >
            {v.variant || `Opc. ${i + 1}`}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-1.5 px-2 rounded border border-gray-700 text-[9px] font-bold text-gray-300 hover:border-gray-400 transition-all duration-200"
      >
        <span className="truncate">{variantes[selIdx]?.variant || 'Elegir variante'}</span>
        <span className={`ml-1 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>▶</span>
      </button>
      {open && (
        <div className="mt-1 grid grid-cols-2 gap-1">
          {variantes.map((v, i) => (
            <button
              key={i}
              onClick={() => { onChange(i); setOpen(false) }}
              className={`text-[9px] font-bold py-1.5 px-1 rounded border transition-all duration-200 text-center truncate ${
                selIdx === i
                  ? 'bg-white text-gray-950 border-white'
                  : 'border-gray-700 text-gray-500 hover:border-gray-400 hover:text-white'
              }`}
            >
              {v.variant || `Opc. ${i + 1}`}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function SuplCard({ p, onAddToCart, enCarrito }) {
  const [selIdx, setSelIdx] = useState(0)
  const [showDesc, setShowDesc] = useState(false)
  const variantes = p.variantes || []
  const sel       = variantes[selIdx] || {}

  const precio = sel.price
    ? '$' + Math.round(sel.price).toLocaleString('es-CO')
    : p.precioLabel || 'Consultar precio'
  const galleryImages = sel.image_url
    ? [sel.image_url, sel.image_url_2, sel.image_url_3].filter(Boolean)
    : (p.images?.length ? p.images : [p.image].filter(Boolean))

  const description = sel.descripcion || p.descripcion

  return (
    <div className="snap-start flex-shrink-0 w-[40vw] md:w-auto border border-gray-800 bg-gray-800/40 rounded-xl overflow-hidden flex flex-col hover:border-gray-600 transition-all duration-300">
      <div className="relative w-full aspect-square bg-gray-800 flex items-center justify-center flex-shrink-0">
        {galleryImages.length > 0
          ? <ProductImageGallery images={galleryImages} alt={p.nombre} containerClassName="w-full h-full" imgClassName="w-full h-full object-cover" onImgError={e => { e.target.style.display = 'none' }} />
          : <span className="text-gray-700 text-[10px] uppercase tracking-widest text-center px-2">Imagen próx.</span>
        }
      </div>
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        <h3 className="font-black uppercase text-xs leading-tight">{p.nombre}</h3>
        <span className="text-white font-black text-sm">{precio}</span>
        {description && (
          <>
            <p className="hidden md:block text-gray-500 text-[9.5px] leading-snug">{description}</p>
            <button
              type="button"
              onClick={() => setShowDesc(true)}
              className="md:hidden self-start text-gray-500 text-[9px] font-bold uppercase tracking-[0.15em] underline underline-offset-2"
            >
              Ver descripción
            </button>
          </>
        )}
        <div className="mt-auto pt-1">
          <VariantSelectorSupl variantes={variantes} selIdx={selIdx} onChange={setSelIdx} />
        </div>
      </div>
      <button
        onClick={() => onAddToCart(p, sel)}
        className={`w-full py-2.5 font-bold uppercase tracking-[0.1em] text-[10px] transition-all duration-300 flex-shrink-0 ${
          enCarrito ? 'bg-green-500 text-white' : 'bg-white text-gray-950 hover:bg-gray-200'
        }`}
      >
        {enCarrito ? '✓ Agregado' : '+ Agregar al carrito'}
      </button>

      {showDesc && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/70 flex items-end justify-center"
          onClick={() => setShowDesc(false)}
        >
          <div
            className="w-full max-w-md bg-gray-900 border-t border-gray-800 rounded-t-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-white">Descripción</h4>
              <button onClick={() => setShowDesc(false)} className="text-gray-500 text-lg leading-none px-1">✕</button>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      )}
    </div>
  )
}
