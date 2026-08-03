import { Link } from 'react-router-dom'
import NavbarSuple from './NavbarSuple'
import FooterSuple from './FooterSuple'
import { SuplCard } from './SuplCard'
import { useScrolled } from '../../hooks/useScrolled'
import { useSupleCart } from '../../contexts/SupleCartContext'
import { FaWhatsapp } from 'react-icons/fa'
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import { getAdjacentSupleCategories } from '../../data/supleCategoriesOrder'
import logoNutriHouse from '../../assets/milogo/nutrihouse.webp'

const WA = '573207911013'

// Insignia de proveedor — Nutri House (punto físico en Chigorodó, mismo
// patrón que Tommy Tattoo Supply en Supply) suministra las 5 categorías,
// incluida Accesorios (2026-08-03, confirmado por Jose) — un solo
// DEFAULT_BADGE alcanza, sin overrides por categoría.
const DEFAULT_BADGE = 'Suministrado por Nutri House — punto físico en Chigorodó'
const CATEGORY_BADGE = {}

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

export default function SupleCategoryPage({ title, categoria, slug, intro, products = [] }) {
  const { prev, next } = getAdjacentSupleCategories(slug)
  const scrolled = useScrolled()
  const { addItem, items: cartItems } = useSupleCart()

  const handleAddToCart = (p, sel = {}) => {
    const precio = sel.price
      ? '$' + Math.round(sel.price).toLocaleString('es-CO')
      : p.precioLabel
    const nombre = sel.variant ? `${p.nombre} — ${sel.variant}` : p.nombre
    addItem({
      id:          p.id,
      inventoryId: sel.id ?? null,
      name:        nombre,
      price:       precio,
      brand:       p.categoria,
      image:       sel.image_url || p.image || '',
    }, 'suplementos')
  }

  const productosCard = products.map((item, i) => ({
    id:          i + 1,
    categoria:   item.categoria || categoria,
    descripcion: item.descripcion || null,
    nombre:      item.name,
    image:       item.image_url || item.variantes?.[0]?.image_url || null,
    images:      [item.image_url, item.image_url_2, item.image_url_3].filter(Boolean).length
      ? [item.image_url, item.image_url_2, item.image_url_3].filter(Boolean)
      : [item.variantes?.[0]?.image_url, item.variantes?.[0]?.image_url_2, item.variantes?.[0]?.image_url_3].filter(Boolean),
    variantes:   item.variantes || [],
    precioLabel: item.variantes?.[0]?.price
      ? '$' + Math.round(item.variantes[0].price).toLocaleString('es-CO')
      : 'Consultar precio',
  }))

  const badge = categoria in CATEGORY_BADGE ? CATEGORY_BADGE[categoria] : DEFAULT_BADGE

  return (
    <>
      <NavbarSuple />

      {scrolled && prev && (
        <Link
          to={`/suplementos/${prev.slug}`} replace
          aria-label={`Ver ${prev.name}`}
          className="fixed top-16 md:top-20 left-2 md:left-4 z-40 text-zinc-400 hover:text-white bg-black/60 backdrop-blur-sm border border-zinc-800 rounded-full p-2 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
      )}
      {scrolled && next && (
        <Link
          to={`/suplementos/${next.slug}`} replace
          aria-label={`Ver ${next.name}`}
          className="fixed top-16 md:top-20 right-2 md:right-4 z-40 text-zinc-400 hover:text-white bg-black/60 backdrop-blur-sm border border-zinc-800 rounded-full p-2 transition-colors"
        >
          <ArrowRight size={20} />
        </Link>
      )}

      <div className="min-h-screen bg-gray-950 text-white pt-16 md:pt-24">

        {/* HERO */}
        <div className="relative overflow-hidden px-6 max-w-7xl mx-auto pb-5 md:pb-10">
          <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
          <div className="relative z-10 flex items-center gap-3 mb-2">
            {prev && (
              <Link
                to={`/suplementos/${prev.slug}`} replace
                aria-label={`Ver ${prev.name}`}
                className="flex-shrink-0 text-gray-500 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
            )}
            <p className="flex-1 text-center uppercase tracking-[0.25em] text-gray-500 text-xs">Categoría</p>
            {next && (
              <Link
                to={`/suplementos/${next.slug}`} replace
                aria-label={`Ver ${next.name}`}
                className="flex-shrink-0 text-gray-500 hover:text-white transition-colors"
              >
                <ArrowRight size={20} />
              </Link>
            )}
          </div>
          <h1 className="relative z-10 text-xl md:text-4xl font-black uppercase tracking-tight leading-none text-white text-center mb-4">{title}</h1>
          {intro && (
            <p className="relative z-10 text-gray-400 text-base md:text-lg leading-relaxed max-w-3xl text-justify [hyphens:auto]">{intro}</p>
          )}
          {badge && (
            <div className="relative z-10 flex items-center gap-2 text-xs text-gray-400 bg-gray-900/60 border border-gray-800 rounded-lg px-3 py-2 w-fit mt-4">
              <ShieldCheck size={14} className="shrink-0 text-[#9E9E9E]" />
              <span>{badge}</span>
              {/* Logo de Nutri House al final de la insignia — versión PNG
                  con fondo transparente (2026-08-03), sin círculo/recorte:
                  se deja libre, solo con una altura fija. */}
              <img
                src={logoNutriHouse}
                alt="Nutri House"
                className="shrink-0 h-14 w-auto ml-1 -my-4"
              />
            </div>
          )}
        </div>

        {/* PRODUCTOS */}
        <div className="pb-16 max-w-7xl mx-auto">
          {productosCard.length === 0 ? (
            <div className="mx-6 border border-gray-800 bg-gray-900/30 rounded-2xl p-10 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Sin stock por el momento</p>
              <p className="text-white text-lg font-black uppercase mb-2">Próximamente disponible</p>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                Déjanos tu número y te avisamos cuando tengamos {title.toLowerCase()} disponibles. Sé el primero en saber.
              </p>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hola, quiero que me avisen cuando haya ${title} disponibles en INKognito Suple.`)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-gray-950 font-bold uppercase tracking-[0.15em] text-sm rounded hover:brightness-90 transition"
                style={{ backgroundColor: '#9E9E9E' }}
              >
                <FaWhatsapp size={18} />
                Avisarme cuando haya stock →
              </a>
            </div>
          ) : (
            <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-6 md:mx-0 md:px-6 pb-2 md:pb-0 scrollbar-hide">
              {productosCard.map((p) => (
                <SuplCard key={p.id} p={p} onAddToCart={handleAddToCart} enCarrito={cartItems.some(i => i.key === `suplementos-${p.id}`)} />
              ))}
            </div>
          )}
        </div>

        <FooterSuple />
      </div>
    </>
  )
}
