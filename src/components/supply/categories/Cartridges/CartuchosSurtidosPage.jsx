import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import NavbarCategory from '../../NavbarCategory'
import FooterSupply from '../../FooterSupply'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { fetchCatalogCategoria } from '../../../../hooks/useCatalog'
import { useSupplyCart } from '../../../../contexts/SupplyCartContext'

const WA = '573207911013'
const BOX_SIZE = 20

// Cada calibre trae varias referencias numeradas (RL3, RL5, RL7...), no es
// un solo tamaño (2026-08-02, pedido de Jose). Rangos estándar de la
// industria, extendidos según lo que aclaró Jose: las curvas (CM/RM)
// llegan hasta la 25.
const CALIBRES = {
  RL:     { label: 'RL Liner',         sub: 'Contornos y trazos finos', refs: ['1','3','5','7','9','11','13','15'] },
  RS:     { label: 'RS Shader',        sub: 'Rellenos pequeños',        refs: ['3','5','7','9','11','13','15'] },
  M1:     { label: 'M1 Magnum',        sub: 'Fondos y sombras',         refs: ['5','7','9','11','13','15','17','19','21'] },
  CM:     { label: 'CM Curved Magnum', sub: 'Degradados sin bordes',    refs: ['5','7','9','11','13','15','17','19','21','23','25'] },
  Bugpin: { label: 'Bugpin',           sub: 'Detalle extremo',          refs: ['3','5','7','9','11','13'] },
}
const CALIBRE_KEYS = Object.keys(CALIBRES)

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

const fmtPrecio = (p) => p != null ? `$${Number(p).toLocaleString('es-CO')} COP` : null

// Busca el producto/variante "surtida" dentro de la categoría Cartuchos —
// SOLO como mejora opcional de precio, si Jose alguna vez la carga en el
// panel. La página NUNCA depende de que exista: sin esto, el formulario
// igual funciona y el precio se confirma por WhatsApp — no tiene sentido
// obligar a cargar inventario para algo que el cliente arma a su gusto en
// el momento (corregido 2026-08-02 tras objeción de Jose: "por qué tendría
// yo que cargar algo en el panel para que el cliente pueda surtir su
// caja").
function findCajaSurtida(products) {
  for (const p of products) {
    const enProducto = p.name?.toLowerCase().includes('surtida')
    for (const v of p.variantes || []) {
      if (enProducto || v.variant?.toLowerCase().includes('surtida')) {
        return { productName: p.name, ...v }
      }
    }
  }
  return null
}

export async function loader() {
  const { products } = await fetchCatalogCategoria('supply', 'Cartuchos')
  // Marcas detectadas con stock real en la categoría Cartuchos (campo
  // `marca` que ya trae /api/catalog/:module por producto) — solo se
  // ofrecen las que existen en inventario ahora mismo, para no prometer
  // una marca que no hay (2026-08-02, pedido de Jose).
  const marcas = [...new Set(products.map(p => p.marca).filter(Boolean))].sort()
  // Precio representativo por marca (primera variante del primer producto
  // de esa marca) — la caja surtida hereda el mismo precio que esa marca
  // ya tiene publicado en la web, sin inventar un precio aparte (2026-08-02,
  // pedido de Jose: "el precio de la caja surtida será el mismo precio que
  // tenga esa marca en la web desde el inventario").
  const preciosPorMarca = {}
  products.forEach(p => {
    if (!p.marca || preciosPorMarca[p.marca]) return
    const v = p.variantes?.[0]
    if (v) preciosPorMarca[p.marca] = { id: v.id, price: v.price, productName: p.name }
  })
  return { caja: findCajaSurtida(products), marcas, preciosPorMarca }
}

export function meta() {
  const title = 'Arma tu Caja Surtida de Cartuchos | INKognito Supply — Chigorodó'
  const description = 'Caja de 20 cartuchos de tatuaje surtida a tu gusto — elige marca, calibre y referencia exacta (RL, RS, M1, CM, Bugpin) que necesitas para tu trabajo. Envíos a Urabá y Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/cartuchos-surtidos` },
  ]
}

export default function CartuchosSurtidosPage() {
  const { caja, marcas, preciosPorMarca } = useLoaderData()
  const { addItem } = useSupplyCart()

  // null = "Cualquier marca disponible" (default) — solo se listan marcas
  // que hoy tienen stock real en Cartuchos, ver loader().
  const [marcaSel, setMarcaSel] = useState(null)
  // Estructura simple (vuelta a como estaba antes de la versión con pasos
  // separados "elige calibre → elige referencia → agregar", que Jose
  // reportó como confusa): una fila fija por calibre, cada una con su
  // propio selector de referencia (dropdown) y su contador +/- de
  // cantidad — todo visible de una vez, sin un paso "agregar" aparte
  // (2026-08-02).
  const [filas, setFilas] = useState(() =>
    Object.fromEntries(CALIBRE_KEYS.map(k => [k, { numero: CALIBRES[k].refs[0], qty: 0 }]))
  )
  const [added, setAdded] = useState(false)

  const total = Object.values(filas).reduce((a, f) => a + f.qty, 0)
  const restantes = BOX_SIZE - total
  const completa = total === BOX_SIZE
  // Con marca elegida, el precio/id vienen del producto real de esa marca
  // en inventory — sin marca (o si esa marca no trajo precio), cae al
  // producto "surtida" si existe, y si tampoco hay eso, queda "a cotizar".
  const cajaMarca = marcaSel ? preciosPorMarca[marcaSel] : null
  const fuentePrecio = cajaMarca || caja
  const precioMostrado = fmtPrecio(fuentePrecio?.price)

  const setNumero = (key, numero) => {
    setAdded(false)
    setFilas(f => ({ ...f, [key]: { ...f[key], numero } }))
  }
  const inc = (key) => {
    if (total >= BOX_SIZE) return
    setAdded(false)
    setFilas(f => ({ ...f, [key]: { ...f[key], qty: f[key].qty + 1 } }))
  }
  const dec = (key) => {
    if (filas[key].qty <= 0) return
    setAdded(false)
    setFilas(f => ({ ...f, [key]: { ...f[key], qty: f[key].qty - 1 } }))
  }

  const handleAgregar = () => {
    if (!completa) return
    const calibresLabel = CALIBRE_KEYS
      .filter(k => filas[k].qty > 0)
      .map(k => `${filas[k].qty} ${k}${filas[k].numero}`)
      .join(', ')
    const mixLabel = marcaSel ? `Marca: ${marcaSel} — ${calibresLabel}` : calibresLabel
    // inventoryId queda null cuando no hay producto real en inventory (ni
    // de la marca elegida ni "surtida") — el panel simplemente no descuenta
    // stock automático para esta línea, igual que cualquier otro ítem
    // "bajo pedido" sin ficha propia.
    addItem({
      id: `surtida-${Date.now()}`,
      inventoryId: fuentePrecio?.id ?? null,
      name: fuentePrecio?.productName || 'Caja Surtida x20 — Cartuchos',
      price: precioMostrado || 'A cotizar',
      brand: marcaSel || 'Bajo pedido',
      mixLabel,
    }, 'cartuchos-surtidos')
    setFilas(Object.fromEntries(CALIBRE_KEYS.map(k => [k, { numero: CALIBRES[k].refs[0], qty: 0 }])))
    setAdded(true)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarCategory pageName="Cartuchos Surtidos" />

      {/* HERO */}
      <section className="relative pt-24 md:pt-32 pb-8 md:pb-12 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]" style={DOT_PATTERN} />
        <div className="relative z-10 max-w-3xl mx-auto text-center md:text-left">
          <p className="uppercase tracking-[0.25em] text-blue-500 text-xs mb-3">Cartuchos · A tu medida</p>
          <h1 className="text-3xl md:text-5xl font-black uppercase leading-tight mb-4">
            Arma tu <span className="text-blue-500">Caja Surtida</span>
          </h1>
          <p className="text-zinc-400 leading-relaxed text-justify [hyphens:auto]">
            Una caja trae {BOX_SIZE} cartuchos — tú eliges la marca, la referencia exacta y cuántos de cada calibre. La agregamos a tu carrito y puedes seguir comprando otros insumos: todo se pide junto, en un solo pedido.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-6 pb-16 max-w-3xl mx-auto">

        {/* PRECIO + PROGRESO */}
        <div className="flex items-center justify-between mb-6 border border-zinc-800 bg-zinc-900/40 rounded-2xl px-5 py-4">
          <div>
            <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] mb-1">
              Precio de la caja{marcaSel ? ` — ${marcaSel}` : ''}
            </p>
            <p className="text-white font-black text-xl">{precioMostrado || 'Se confirma contigo'}</p>
          </div>
          <div className="text-right">
            <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] mb-1">Cartuchos elegidos</p>
            <p className={`font-black text-xl ${completa ? 'text-green-500' : 'text-white'}`}>{total}/{BOX_SIZE}</p>
          </div>
        </div>

        {/* MARCA (opcional, solo si hay marcas con stock detectadas) */}
        {marcas.length > 0 && (
          <div className="mb-6">
            <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] mb-2">Marca (opcional)</p>
            <div className="flex gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setMarcaSel(null)}
                className={`px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all duration-200 ${
                  marcaSel === null ? 'bg-blue-500 text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-700 hover:border-zinc-500'
                }`}
              >
                Cualquier marca
              </button>
              {marcas.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMarcaSel(m)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all duration-200 ${
                    marcaSel === m ? 'bg-blue-500 text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SELECTOR POR CALIBRE — una fila fija por calibre, cada una con
            su propia referencia (dropdown) y contador */}
        <div className="space-y-3 mb-6">
          {CALIBRE_KEYS.map(key => (
            <div key={key} className="flex items-center justify-between gap-3 border border-zinc-800 bg-zinc-900/40 rounded-xl px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-black uppercase text-sm text-white truncate">{CALIBRES[key].label}</p>
                <p className="text-zinc-500 text-xs truncate mb-1.5">{CALIBRES[key].sub}</p>
                <select
                  value={filas[key].numero}
                  onChange={e => setNumero(key, e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 text-white text-xs font-bold rounded px-2 py-1.5 outline-none"
                >
                  {CALIBRES[key].refs.map(n => (
                    <option key={n} value={n}>Referencia {key}{n}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-0 border border-zinc-700 rounded flex-shrink-0">
                <button
                  type="button"
                  onClick={() => dec(key)}
                  disabled={filas[key].qty <= 0}
                  className="px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all duration-200"
                >
                  <Minus size={14} />
                </button>
                <span className="px-3 py-2 text-sm font-bold text-white border-x border-zinc-700 min-w-[2.5rem] text-center">
                  {filas[key].qty}
                </span>
                <button
                  type="button"
                  onClick={() => inc(key)}
                  disabled={total >= BOX_SIZE}
                  className="px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all duration-200"
                >
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

        <button
          type="button"
          onClick={handleAgregar}
          disabled={!completa}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-blue-500 text-black font-black uppercase tracking-[0.15em] text-sm hover:bg-blue-400 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
        >
          <ShoppingCart size={18} />
          Agregar caja al carrito
        </button>

        {added && (
          <div className="mt-4 border border-green-600/30 bg-green-950/20 rounded-xl p-4 text-center">
            <p className="text-green-500 text-sm mb-3">
              ✓ Caja agregada a tu carrito — puedes armar otra mezcla distinta, seguir comprando otros insumos, o finalizar tu pedido ya.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                to="/supply"
                className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-300 border border-zinc-700 rounded-lg px-4 py-2.5 hover:border-zinc-500 hover:text-white transition-all duration-300"
              >
                + Seguir comprando en Supply
              </Link>
              <Link
                to="/pedido/supply"
                className="text-xs font-bold uppercase tracking-[0.15em] text-black bg-green-500 rounded-lg px-4 py-2.5 hover:bg-green-400 transition-all duration-300"
              >
                Finalizar mi pedido →
              </Link>
            </div>
          </div>
        )}

        <p className="text-center text-zinc-600 text-xs mt-6">
          ¿Prefieres coordinarlo por chat?{' '}
          <a
            href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero una caja surtida de cartuchos (20 unidades, mezcla de calibres y referencias).')}`}
            target="_blank" rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
          >
            Escríbenos por WhatsApp
          </a>
        </p>
      </section>

      <FooterSupply />
    </div>
  )
}
