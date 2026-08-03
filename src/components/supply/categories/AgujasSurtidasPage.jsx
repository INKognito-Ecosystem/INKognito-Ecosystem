import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import NavbarCategory from '../NavbarCategory'
import FooterSupply from '../FooterSupply'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { fetchCatalogCategoria } from '../../../hooks/useCatalog'
import { useSupplyCart } from '../../../contexts/SupplyCartContext'

const WA = '573207911013'
const BOX_SIZE = 20

// Mismos 5 calibres que ya explica NeedlesPage.jsx (guide) — la caja
// surtida se arma con estos, no con toda la variedad de agujas del
// catálogo (2026-08-02).
const CALIBRES = [
  { key: 'RL',     label: 'RL Liner',          sub: 'Contornos y trazos finos' },
  { key: 'RS',     label: 'RS Shader',         sub: 'Rellenos pequeños' },
  { key: 'M1',     label: 'M1 Magnum',         sub: 'Fondos y sombras' },
  { key: 'CM',     label: 'CM Curved Magnum',  sub: 'Degradados sin bordes' },
  { key: 'Bugpin', label: 'Bugpin',            sub: 'Detalle extremo' },
]

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

const fmtPrecio = (p) => p != null ? `$${Number(p).toLocaleString('es-CO')} COP` : null

// Busca el producto/variante "surtida" dentro de la categoría Agujas — Jose
// la crea desde el panel como cualquier otro producto (una fila más de
// inventory), solo que el nombre de la variante o del producto debe
// contener "surtida" para que esta página la detecte. Sin eso, no hace
// falta ningún cambio de esquema ni de backend (2026-08-02).
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
  const { products } = await fetchCatalogCategoria('supply', 'Agujas')
  return { caja: findCajaSurtida(products) }
}

export function meta() {
  const title = 'Arma tu Caja Surtida de Agujas | INKognito Supply — Chigorodó'
  const description = 'Caja de 20 agujas de tatuaje surtida a tu gusto — elige la mezcla de calibres (RL, RS, M1, CM, Bugpin) que necesitas para tu trabajo. Envíos a Urabá y Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/agujas-surtidas` },
  ]
}

export default function AgujasSurtidasPage() {
  const { caja } = useLoaderData()
  const { addItem } = useSupplyCart()
  const [counts, setCounts] = useState(() => Object.fromEntries(CALIBRES.map(c => [c.key, 0])))
  const [added, setAdded] = useState(false)

  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const restantes = BOX_SIZE - total
  const completa = total === BOX_SIZE

  const inc = (key) => {
    if (total >= BOX_SIZE) return
    setAdded(false)
    setCounts(c => ({ ...c, [key]: c[key] + 1 }))
  }
  const dec = (key) => {
    if (counts[key] <= 0) return
    setAdded(false)
    setCounts(c => ({ ...c, [key]: c[key] - 1 }))
  }

  const handleAgregar = () => {
    if (!completa || !caja) return
    const mixLabel = CALIBRES
      .filter(c => counts[c.key] > 0)
      .map(c => `${counts[c.key]} ${c.key}`)
      .join(', ')
    addItem({
      id: `surtida-${Date.now()}`,
      inventoryId: caja.id,
      name: caja.productName || 'Caja Surtida x20 — Agujas',
      price: fmtPrecio(caja.price) || 'Consultar',
      brand: 'Bajo pedido',
      mixLabel,
    }, 'agujas-surtidas')
    setCounts(Object.fromEntries(CALIBRES.map(c => [c.key, 0])))
    setAdded(true)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarCategory pageName="Agujas Surtidas" />

      {/* HERO */}
      <section className="relative pt-24 md:pt-32 pb-8 md:pb-12 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]" style={DOT_PATTERN} />
        <div className="relative z-10 max-w-3xl mx-auto text-center md:text-left">
          <p className="uppercase tracking-[0.25em] text-blue-500 text-xs mb-3">Agujas · A tu medida</p>
          <h1 className="text-3xl md:text-5xl font-black uppercase leading-tight mb-4">
            Arma tu <span className="text-blue-500">Caja Surtida</span>
          </h1>
          <p className="text-zinc-400 leading-relaxed text-justify [hyphens:auto]">
            Una caja trae {BOX_SIZE} agujas — tú eliges cuántas de cada calibre según lo que estés trabajando. Mismo precio de caja, mezcla a tu gusto.
          </p>
        </div>
      </section>

      {!caja ? (
        <section className="px-4 md:px-6 pb-16 max-w-3xl mx-auto">
          <div className="border border-zinc-800 bg-zinc-900/40 rounded-2xl py-14 text-center">
            <p className="text-zinc-400 uppercase tracking-[0.2em] text-sm mb-2">Aún estamos cargando esta opción</p>
            <p className="text-zinc-600 text-sm mb-6 max-w-sm mx-auto">Escríbenos y armamos tu caja surtida manualmente mientras la activamos en el catálogo.</p>
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero una caja surtida de agujas (20 unidades, mezcla de calibres).')}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-black font-bold uppercase tracking-[0.15em] text-xs rounded hover:bg-blue-400 transition"
            >
              Consultar por WhatsApp →
            </a>
          </div>
        </section>
      ) : (
        <section className="px-4 md:px-6 pb-16 max-w-3xl mx-auto">

          {/* PRECIO + PROGRESO */}
          <div className="flex items-center justify-between mb-6 border border-zinc-800 bg-zinc-900/40 rounded-2xl px-5 py-4">
            <div>
              <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] mb-1">Precio de la caja</p>
              <p className="text-white font-black text-xl">{fmtPrecio(caja.price) || 'Consultar'}</p>
            </div>
            <div className="text-right">
              <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] mb-1">Agujas elegidas</p>
              <p className={`font-black text-xl ${completa ? 'text-green-500' : 'text-white'}`}>{total}/{BOX_SIZE}</p>
            </div>
          </div>

          {/* SELECTOR POR CALIBRE */}
          <div className="space-y-3 mb-6">
            {CALIBRES.map(c => (
              <div key={c.key} className="flex items-center justify-between gap-3 border border-zinc-800 bg-zinc-900/40 rounded-xl px-4 py-3">
                <div className="min-w-0">
                  <p className="font-black uppercase text-sm text-white truncate">{c.label}</p>
                  <p className="text-zinc-500 text-xs truncate">{c.sub}</p>
                </div>
                <div className="flex items-center gap-0 border border-zinc-700 rounded flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => dec(c.key)}
                    disabled={counts[c.key] <= 0}
                    className="px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all duration-200"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 py-2 text-sm font-bold text-white border-x border-zinc-700 min-w-[2.5rem] text-center">
                    {counts[c.key]}
                  </span>
                  <button
                    type="button"
                    onClick={() => inc(c.key)}
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
              Faltan <span className="text-white font-bold">{restantes}</span> aguja{restantes !== 1 ? 's' : ''} para completar la caja.
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
            <p className="text-green-500 text-sm text-center mt-3">
              ✓ Caja agregada — puedes armar otra con una mezcla distinta o ir a tu carrito.
            </p>
          )}
        </section>
      )}

      <FooterSupply />
    </div>
  )
}
