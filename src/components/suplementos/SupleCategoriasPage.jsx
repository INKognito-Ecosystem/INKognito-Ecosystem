import { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'
import NavbarSuple from './NavbarSuple'
import FooterSuple from './FooterSuple'
import SupleMobileNav from './SupleMobileNav'
import CategoriesSuple from './CategoriesSuple'
import { SuplCard } from './SuplCard'
import { fetchCatalogCounts, fetchCatalogPage } from '../../hooks/useCatalog'

export async function loader() {
  // Solo conteos por categoría (nunca el catálogo completo) — mismo patrón
  // que SuplePage.jsx y StoreCategoriasPage.jsx.
  let counts = {}
  try { counts = await fetchCatalogCounts('suplementos') } catch { counts = {} }
  return { counts }
}

export function meta() {
  const title = 'Categorías | INKognito Suple'
  const description = 'Explora proteínas, creatina, pre-entreno, vitaminas y accesorios para entrenar — stock real y despacho rápido en Urabá.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/suplementos/categorias` },
  ]
}

// Página propia de categorías (2026-09-19, migración de Suple a fondo
// blanco) — enlazada desde el botón "Categorías" del tab bar inferior
// (SupleMobileNav.jsx), mismo patrón que StoreCategoriasPage.jsx y
// SupplyCategoriasPage.jsx. A diferencia de las páginas de una sola
// categoría, el buscador acá es GLOBAL: busca en todo el catálogo de Suple.
export default function SupleCategoriasPage() {
  const { counts } = useLoaderData()
  const [busqueda, setBusqueda] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [resultados, setResultados] = useState(null) // null = sin búsqueda activa

  useEffect(() => {
    const q = busqueda.trim()
    if (q.length < 2) { setResultados(null); setBuscando(false); return }
    setBuscando(true)
    let vigente = true
    const t = setTimeout(async () => {
      const page = await fetchCatalogPage('suplementos', { tipo: 'fisico', q, limit: 24 })
      if (!vigente) return
      setResultados(page.items)
      setBuscando(false)
    }, 300)
    return () => { vigente = false; clearTimeout(t) }
  }, [busqueda])

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <NavbarSuple
        pageName="Categorías"
        hideMobileActions
        hideWordmark
        searchValue={busqueda}
        onSearchChange={setBusqueda}
        searchPlaceholder="Buscar en Suple"
        shareUrl={`${import.meta.env.VITE_SITE_URL}/suplementos/categorias`}
      />

      <div className="pt-16 md:pt-20">
        {resultados !== null ? (
          <div className="px-4 md:px-6 pt-6 pb-16 max-w-7xl mx-auto">
            {buscando ? (
              <div className="flex items-center justify-center gap-2 py-10 text-zinc-400 text-sm">
                <LoaderCircle size={14} className="animate-spin" /> Buscando…
              </div>
            ) : resultados.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-10">Ningún producto coincide con "{busqueda.trim()}".</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {resultados.map(item => (
                  <SuplCard key={item.variantes?.[0]?.id ?? item.name} item={item} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <CategoriesSuple counts={counts} />
        )}
      </div>

      <FooterSuple />
      <div className="h-16 md:hidden" />
      <SupleMobileNav active="categorias" />
    </main>
  )
}
