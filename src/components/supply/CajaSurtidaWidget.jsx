import { useState } from 'react'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { useSupplyCart } from '../../contexts/SupplyCartContext'

const BOX_SIZE = 20

// Cada calibre trae varias referencias numeradas (RL3, RL5, RL7...), no es
// un solo tamaño. Rangos estándar de la industria — las curvas (CM/RM)
// llegan hasta la 25.
const CALIBRES = {
  RL:     { label: 'RL Liner',         sub: 'Contornos y trazos finos', refs: ['1','3','5','7','9','11','13','15'] },
  RS:     { label: 'RS Shader',        sub: 'Rellenos pequeños',        refs: ['3','5','7','9','11','13','15'] },
  M1:     { label: 'M1 Magnum',        sub: 'Fondos y sombras',         refs: ['5','7','9','11','13','15','17','19','21'] },
  CM:     { label: 'CM Curved Magnum', sub: 'Degradados sin bordes',    refs: ['5','7','9','11','13','15','17','19','21','23','25'] },
  Bugpin: { label: 'Bugpin',           sub: 'Detalle extremo',          refs: ['3','5','7','9','11','13'] },
}
const CALIBRE_KEYS = Object.keys(CALIBRES)

const fmtPrecio = (p) => p != null ? `$${Number(p).toLocaleString('es-CO')} COP` : null

// Extraído de la antigua CartuchosSurtidosPage.jsx (2026-08-09) para que
// viva en la tienda de CADA proveedor en vez de una sola página central —
// antes el precio/id se "tomaba prestado" del primer producto de esa
// marca en TODO el catálogo (sin importar el proveedor), lo cual dejó de
// tener sentido con varios proveedores reales vendiendo Cartuchos: el
// checkout terminaba atribuyendo el pago/producto al dueño equivocado.
// Acá `products` YA viene filtrado a la categoría Cartuchos de un solo
// proveedor (ver EstudioSupplyPage.jsx) — el precio de referencia sigue
// siendo un producto real, pero siempre de ESE proveedor.
export default function CajaSurtidaWidget({ products, estudioId, estudioNombre, mpConectado, recargoPct = 0 }) {
  const { addItem } = useSupplyCart()

  // Hooks siempre primero, sin returns condicionales antes — el posible
  // "sin nada que ofrecer" se resuelve más abajo, después de declararlos.
  const [marcaSel, setMarcaSel] = useState(null)
  const [filas, setFilas] = useState(() =>
    Object.fromEntries(CALIBRE_KEYS.map(k => [k, { numero: CALIBRES[k].refs[0], qty: 0 }]))
  )
  const [added, setAdded] = useState(false)

  const marcas = [...new Set(products.map(p => p.marca).filter(Boolean))].sort()
  const preciosPorMarca = {}
  products.forEach(p => {
    if (!p.marca || preciosPorMarca[p.marca]) return
    const v = p.variantes?.[0]
    if (v) preciosPorMarca[p.marca] = { id: v.id, price: v.price, productName: p.name }
  })
  // Sin ningún producto real con precio, no hay de qué armar la caja.
  const fallback = products[0]?.variantes?.[0]
  const referenciaGeneral = fallback ? { id: fallback.id, price: fallback.price, productName: products[0].name } : null

  const total = Object.values(filas).reduce((a, f) => a + f.qty, 0)
  const restantes = BOX_SIZE - total
  const completa = total === BOX_SIZE
  const fuentePrecio = (marcaSel ? preciosPorMarca[marcaSel] : null) || referenciaGeneral
  // El recargo (2026-08-09, si el proveedor lo configuró en "editar mi
  // estudio") se aplica sobre el precio de referencia para la vista
  // previa — el monto real siempre se recalcula server-side al crear el
  // pago (POST /api/estudios-supply-comprar), esto es solo estimado.
  const precioConRecargo = fuentePrecio ? Math.round(fuentePrecio.price * (1 + recargoPct / 100)) : null
  const precioMostrado = fmtPrecio(precioConRecargo)

  const setNumero = (key, numero) => { setAdded(false); setFilas(f => ({ ...f, [key]: { ...f[key], numero } })) }
  const inc = (key) => { if (total >= BOX_SIZE) return; setAdded(false); setFilas(f => ({ ...f, [key]: { ...f[key], qty: f[key].qty + 1 } })) }
  const dec = (key) => { if (filas[key].qty <= 0) return; setAdded(false); setFilas(f => ({ ...f, [key]: { ...f[key], qty: f[key].qty - 1 } })) }

  const handleAgregar = () => {
    if (!completa || !fuentePrecio) return
    const calibresLabel = CALIBRE_KEYS
      .filter(k => filas[k].qty > 0)
      .map(k => `${filas[k].qty} ${k}${filas[k].numero}`)
      .join(', ')
    const nombreMezcla = `Caja Surtida x20${marcaSel ? ` — ${marcaSel}` : ''} — ${calibresLabel}`
    addItem({
      id: `surtida-${estudioId}-${Date.now()}`,
      inventoryId: fuentePrecio.id,
      name: nombreMezcla,
      nombrePersonalizado: nombreMezcla,
      price: precioMostrado || 'A cotizar',
      brand: 'Cajas surtidas',
    }, 'cartuchos-surtidos', { estudioId, estudioNombre, mpConectado })
    setFilas(Object.fromEntries(CALIBRE_KEYS.map(k => [k, { numero: CALIBRES[k].refs[0], qty: 0 }])))
    setMarcaSel(null)
    setAdded(true)
  }

  if (!referenciaGeneral) return null

  return (
    <div className="border border-zinc-800 bg-zinc-950 rounded-2xl p-5 md:p-8 mt-10">
      <p className="uppercase tracking-[0.2em] text-blue-500 text-xs mb-2">Cartuchos · A tu medida</p>
      <h2 className="text-2xl md:text-3xl font-black uppercase leading-tight mb-3 text-white">
        Arma tu <span className="text-blue-500">Caja Surtida</span>
      </h2>
      <p className="text-zinc-400 text-sm leading-relaxed mb-6">
        Una caja trae {BOX_SIZE} cartuchos — elige la referencia exacta y cuántos de cada calibre. Se agrega a tu carrito junto con el resto de lo que compres acá.
      </p>

      <div className="flex items-center justify-between mb-6 border border-zinc-800 bg-zinc-900/40 rounded-xl px-4 py-3">
        <div>
          <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] mb-1">Precio de la caja{marcaSel ? ` — ${marcaSel}` : ''}</p>
          <p className="text-white font-black text-lg">{precioMostrado || 'Se confirma contigo'}</p>
        </div>
        <div className="text-right">
          <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] mb-1">Cartuchos elegidos</p>
          <p className={`font-black text-lg ${completa ? 'text-green-500' : 'text-white'}`}>{total}/{BOX_SIZE}</p>
        </div>
      </div>

      {/* Antes solo se mostraba con 2+ marcas cargadas — con una sola
          (ej. un proveedor que recién empieza) quedaba oculto del todo,
          sin forma de ver/elegir de qué marca es la caja (Jose,
          2026-08-09). Con una sola marca no tiene sentido el botón
          "Cualquier marca" (sería idéntico a elegir la única que hay). */}
      {marcas.length > 0 && (
        <div className="mb-6">
          <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] mb-2">Marca{marcas.length > 1 ? ' (opcional)' : ''}</p>
          <div className="flex gap-1.5 flex-wrap">
            {marcas.length > 1 && (
              <button type="button" onClick={() => setMarcaSel(null)} className={`px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all duration-200 ${marcaSel === null ? 'bg-blue-500 text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-700 hover:border-zinc-500'}`}>
                Cualquier marca
              </button>
            )}
            {marcas.map(m => (
              <button key={m} type="button" onClick={() => setMarcaSel(m)} className={`px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all duration-200 ${marcaSel === m ? 'bg-blue-500 text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-700 hover:border-zinc-500'}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3 mb-6">
        {CALIBRE_KEYS.map(key => (
          <div key={key} className="flex items-center justify-between gap-3 border border-zinc-800 bg-zinc-900/40 rounded-xl px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="font-black uppercase text-sm text-white truncate">{CALIBRES[key].label}</p>
              <p className="text-zinc-500 text-xs truncate mb-1.5">{CALIBRES[key].sub}</p>
              <select value={filas[key].numero} onChange={e => setNumero(key, e.target.value)} className="bg-zinc-800 border border-zinc-700 text-white text-xs font-bold rounded px-2 py-1.5 outline-none">
                {CALIBRES[key].refs.map(n => <option key={n} value={n}>Referencia {key}{n}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-0 border border-zinc-700 rounded flex-shrink-0">
              <button type="button" onClick={() => dec(key)} disabled={filas[key].qty <= 0} className="px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all duration-200">
                <Minus size={14} />
              </button>
              <span className="px-3 py-2 text-sm font-bold text-white border-x border-zinc-700 min-w-[2.5rem] text-center">{filas[key].qty}</span>
              <button type="button" onClick={() => inc(key)} disabled={total >= BOX_SIZE} className="px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all duration-200">
                <Plus size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {!completa && (
        <p className="text-zinc-500 text-xs text-center mb-4">
          Faltan <span className="text-white font-bold">{restantes}</span> cartucho{restantes !== 1 ? 's' : ''} para completar la caja.
        </p>
      )}

      <button type="button" onClick={handleAgregar} disabled={!completa} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-blue-500 text-black font-black uppercase tracking-[0.15em] text-sm hover:bg-blue-400 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-500">
        <ShoppingCart size={18} />
        Agregar caja al carrito
      </button>

      {added && (
        <p className="mt-4 text-green-500 text-sm text-center">
          ✓ Caja agregada a tu carrito — puedes armar otra mezcla distinta o seguir comprando.
        </p>
      )}
    </div>
  )
}
