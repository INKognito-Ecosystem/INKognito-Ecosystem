import { Link, useLoaderData } from 'react-router-dom'
import NavbarCategory from '../../NavbarCategory'
import FooterSupply from '../../FooterSupply'
import { ArrowRight } from 'lucide-react'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const WA = '573207911013'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

// Directorio de proveedores que arman cajas surtidas (2026-08-09) — antes
// esta página tenía el formulario de armar caja directo, con el precio
// "prestado" de cualquier producto de esa marca en TODO el catálogo, sin
// importar el proveedor. Con varios proveedores reales vendiendo
// Cartuchos eso dejó de tener sentido (el checkout terminaba atribuyendo
// el pago al proveedor equivocado) — ahora el formulario vive en la
// tienda de CADA proveedor (ver CajaSurtidaWidget.jsx en
// EstudioSupplyPage.jsx), y esta página central solo ayuda a elegir con
// cuál proveedor armar la caja.
export async function loader() {
  try {
    const res = await fetch(`${PANEL_URL}/api/estudios-vende-cajas-surtidas`)
    const proveedores = res.ok ? await res.json() : []
    return { proveedores }
  } catch {
    return { proveedores: [] }
  }
}

export function meta() {
  const title = 'Cajas Surtidas de Cartuchos | INKognito Supply — Chigorodó'
  const description = 'Elige con qué proveedor armar tu caja de 20 cartuchos surtida a tu gusto — marca, calibre y referencia exacta que necesitas.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/cartuchos-surtidos` },
  ]
}

export default function CartuchosSurtidosPage() {
  const { proveedores } = useLoaderData()

  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarCategory pageName="Cartuchos Surtidos" />

      <section className="relative pt-24 md:pt-32 pb-8 md:pb-12 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]" style={DOT_PATTERN} />
        <div className="relative z-10 max-w-3xl mx-auto text-center md:text-left">
          <p className="uppercase tracking-[0.25em] text-blue-500 text-xs mb-3">Cartuchos · A tu medida</p>
          <h1 className="text-3xl md:text-5xl font-black uppercase leading-tight mb-4">
            Arma tu <span className="text-blue-500">Caja Surtida</span>
          </h1>
          <p className="text-zinc-400 leading-relaxed text-justify [hyphens:auto]">
            Una caja trae 20 cartuchos — tú eliges la marca, la referencia exacta y cuántos de cada calibre. Elige con cuál proveedor armarla; cada uno tiene su propia tienda con precios y stock reales.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-6 pb-16 max-w-3xl mx-auto">
        {proveedores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {proveedores.map((p) => (
              <Link
                key={p.id}
                to={`/supply/estudio/${p.id}`}
                className="flex items-center gap-4 border border-zinc-800 bg-zinc-900/40 rounded-2xl px-5 py-4 hover:border-blue-500 transition-all duration-300 group"
              >
                {p.logo_url ? (
                  <img src={p.logo_url} alt={p.nombre_supply} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-black uppercase text-sm text-white truncate">{p.nombre_supply}</p>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                    Armar mi caja <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-zinc-800 bg-zinc-950 rounded-2xl p-10 md:p-16 text-center">
            <p className="text-zinc-500 uppercase tracking-[0.25em] text-xs md:text-sm mb-4">
              Todavía sin proveedores
            </p>
            <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto mb-8 leading-relaxed">
              Por ahora ningún proveedor tiene activa la opción de armar cajas surtidas. Escríbenos y te orientamos.
            </p>
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero una caja surtida de cartuchos (20 unidades, mezcla de calibres y referencias).')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold uppercase tracking-[0.15em] text-xs rounded hover:opacity-90 transition"
            >
              Escribir por WhatsApp →
            </a>
          </div>
        )}

        <p className="text-center text-zinc-600 text-xs mt-8">
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
