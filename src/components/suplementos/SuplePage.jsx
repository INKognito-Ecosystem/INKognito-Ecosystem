import { Link, useLoaderData } from 'react-router-dom'
import NavbarSuple from './NavbarSuple'
import FooterSuple from './FooterSuple'
import MobileHomeSuple from './MobileHomeSuple'
import CategoriesSuple, { CAT_ICONS } from './CategoriesSuple'
import { AfiliadosSuple, LogisticaGarantiasSuple, WA } from './SupleHomeSections'
import { SUPLE_CATEGORIES_ORDER } from '../../data/supleCategoriesOrder'
import { fetchCatalogCounts, fetchCatalogPage } from '../../hooks/useCatalog'
import { Dumbbell } from 'lucide-react'
import rutaDelGolfoLogo from '../../assets/milogo/rutadelgolfologo.png'

// fetchCatalogCounts (2026-09-14, paginación real, fase 2) — antes traía el
// módulo completo (fetchCatalogFull) solo para que CategoriesSuple hiciera
// `.length` por categoría y para filtrar afiliados en memoria; ahora pide
// el conteo agregado y los afiliados por separado, cada uno acotado.
// Primera página de productos físicos (2026-09-19) — alimenta el grid
// "Destacados" del home móvil (MobileHomeSuple), con "Cargar más" vía
// useLoadMore.
export async function loader() {
  const [counts, afiliadosPage, productosPage] = await Promise.all([
    fetchCatalogCounts('suplementos'),
    fetchCatalogPage('suplementos', { tipo: 'afiliado', limit: 100 }),
    fetchCatalogPage('suplementos', { tipo: 'fisico', limit: 12 }),
  ])
  return {
    counts,
    afiliados: afiliadosPage.items,
    products: productosPage.items,
    nextCursor: productosPage.nextCursor,
    hasMore: productosPage.hasMore,
  }
}

export function meta() {
  const title = 'Suplementos y Accesorios para Entrenar | INKognito Suple — Urabá y Colombia'
  const description = 'Tienda online de proteína, creatina, pre-entreno y accesorios para entrenar. Potencia tus entrenamientos y optimiza tus resultados. Suplementos deportivos en Urabá, Chigorodó, Antioquia. Envíos a toda Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/suplementos` },
  ]
}

// Dos instancias, no una sola adaptada (2026-09-19, migración de Suple a
// fondo blanco) — mismo criterio que SupplyPage/StorePage: el móvil es un
// home tipo marketplace (MobileHomeSuple: buscador, listón, banner, grid) y
// el escritorio conserva la landing de siempre (hero + categorías +
// afiliados + logística/garantías/contacto), ahora en blanco.
export default function SuplePage() {
  const { counts, afiliados: apiAfiliados, products, nextCursor, hasMore } = useLoaderData()

  return (
    <>
      <MobileHomeSuple afiliados={apiAfiliados} products={products} nextCursor={nextCursor} hasMore={hasMore} />

      <div className="hidden md:block min-h-screen bg-white text-zinc-900">
        <NavbarSuple />

        {/* HERO — (2026-08-03) rediseñado a pedido de Jose: grid asimétrico
            3/5 + 2/5, título con "Entrenamientos" resaltado tipo marcador,
            silueta de mancuerna de fondo (propia del rubro), stats como
            ticker horizontal con bordes y un panel "Compra en línea" con
            acceso directo a las 5 categorías (mismo ícono que sus cards vía
            CAT_ICONS), con Ruta del Golfo como nota al pie. En blanco (2026-09-19):
            el resaltado pasa a grafito con texto blanco y los bordes a
            zinc-200/zinc-700. */}
        <section className="relative overflow-hidden pt-28 pb-16 px-6 bg-white">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-zinc-50" />
          <Dumbbell
            className="absolute -right-10 top-1/2 -translate-y-1/2 text-zinc-900/[0.05] pointer-events-none"
            style={{ transform: 'translateY(-50%) rotate(-20deg)' }}
            size={480}
            strokeWidth={1}
          />
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="grid grid-cols-5 gap-12 items-end">

              {/* IZQUIERDA — 3/5 */}
              <div className="col-span-3 text-left">
                <p className="uppercase tracking-[0.4em] text-zinc-500 text-sm mb-6 font-semibold">
                  INKognito Suple — Urabá, Antioquia
                </p>
                <h1 className="text-7xl font-black uppercase leading-[1.05] mb-8">
                  <span className="block text-zinc-900">Potencia tus</span>
                  <span className="inline-block bg-zinc-800 text-white px-3 -mx-3">Entrenamientos</span>
                </h1>
                <p className="text-zinc-600 text-xl leading-relaxed max-w-2xl mb-12">
                  Tienda online de suplementos y accesorios para entrenar — proteína, creatina, pre-entreno y más, con stock real y despacho rápido. Optimiza tus resultados con marcas confiables y envíos desde Urabá a toda Colombia.
                </p>
                <div className="flex flex-row gap-4">
                  <button
                    onClick={() => document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-10 py-4 uppercase tracking-[0.25em] font-black text-sm text-white bg-zinc-700 transition-all duration-300 hover:bg-zinc-800"
                  >
                    Ver Catálogo
                  </button>
                  <a
                    href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero ver el catálogo de INKognito Suple')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex px-10 py-4 uppercase tracking-[0.25em] font-bold text-sm border border-zinc-300 text-zinc-700 hover:border-zinc-700 hover:text-zinc-900 transition-all duration-300 items-center justify-center gap-2"
                  >
                    WhatsApp
                  </a>
                </div>

                {/* POR OBJETIVO — mismo lugar/formato que las 3 marcas de
                    HeroSupply.jsx, pero con contenido propio de Suple: 3
                    objetivos de entrenamiento, cada uno a la categoría más
                    relevante (2026-08-03, pedido de Jose). */}
                <div className="flex flex-wrap gap-3 mt-8">
                  {[
                    { to: '/suplementos/proteinas', label: 'Ganar Masa' },
                    { to: '/suplementos/vitaminas', label: 'Definición' },
                    { to: '/suplementos/pre-entreno', label: 'Rendimiento' },
                  ].map(chip => (
                    <Link
                      key={chip.to}
                      to={chip.to}
                      className="text-center py-3 px-6 border border-zinc-700 text-zinc-900 uppercase tracking-wider text-sm hover:bg-zinc-700 hover:text-white transition-all duration-300"
                    >
                      {chip.label}
                    </Link>
                  ))}
                </div>

                {/* STATS — ticker horizontal con bordes, no el grid suelto de Store */}
                <div className="mt-14 flex justify-start divide-x divide-zinc-200 border-y border-zinc-200 max-w-md">
                  {[{n:'4',l:'Municipios'},{n:'100%',l:'Stock real'}].map(s => (
                    <div key={s.l} className="flex-1 px-6 py-4 text-left">
                      <p className="text-4xl font-black text-zinc-800 [font-variant-numeric:tabular-nums]">{s.n}</p>
                      <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] mt-1">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* DERECHA — 2/5: panel "Compra en línea" con acceso directo a
                  las 5 categorías, Ruta del Golfo como nota al pie. */}
              <div className="col-span-2">
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
                  <p className="text-zinc-700 uppercase tracking-[0.3em] text-xs mb-1">Compra en línea</p>
                  <p className="text-zinc-500 text-xs mb-5">Elige tu categoría y arma tu pedido en minutos.</p>
                  <div className="flex flex-col gap-2">
                    {SUPLE_CATEGORIES_ORDER.map(cat => {
                      const Icon = CAT_ICONS[cat.name]
                      return (
                        <Link
                          key={cat.slug}
                          to={cat.link}
                          className="group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-zinc-200 bg-white hover:border-zinc-500 transition-all duration-300"
                        >
                          {Icon && <Icon size={16} className="text-zinc-600 flex-shrink-0" />}
                          <span className="text-xs font-bold uppercase tracking-wide text-zinc-700 group-hover:text-zinc-900 flex-1">{cat.name}</span>
                          <span className="text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all duration-300">→</span>
                        </Link>
                      )
                    })}
                  </div>
                  <div className="mt-5 pt-5 border-t border-zinc-200 flex items-center gap-2">
                    <img src={rutaDelGolfoLogo} alt="" className="w-6 h-6 object-contain" />
                    <span className="text-zinc-500 text-[10px] uppercase tracking-[0.15em]">Envíos con Ruta del Golfo a toda la región</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <CategoriesSuple counts={counts} />
        <AfiliadosSuple afiliados={apiAfiliados} />
        <LogisticaGarantiasSuple />
        <FooterSuple />
      </div>
    </>
  )
}
