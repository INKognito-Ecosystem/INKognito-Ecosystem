import { useState } from 'react'
import { useLoaderData, Link } from 'react-router'
import MobileHomeSupply from './MobileHomeSupply'
import DesktopHomeSupply from './DesktopHomeSupply'
import TechMarquee from '../TechMarquee'
import FooterSupply from './FooterSupply'
import { GraduationCap, Package, BookOpen } from 'lucide-react'
import { fetchCatalogCounts, fetchCatalogPage } from '../../hooks/useCatalog'
const ogSupply = '/og/supply.webp'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

const supplyJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  "@id": `${import.meta.env.VITE_SITE_URL}/supply#business`,
  "name": "INKognito Supply",
  "description": "Tienda online de insumos y equipos profesionales para tatuadores, con productos de proveedores locales y nacionales verificados. Máquinas, tintas, cartuchos, agujas y accesorios. Despacho a toda Colombia.",
  "url": `${import.meta.env.VITE_SITE_URL}/supply`,
  "telephone": "+57-320-791-1013",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Chigorodó",
    "addressRegion": "Antioquia",
    "addressCountry": "CO"
  },
  "areaServed": "Colombia"
}

// 2026-09-13, Jose: "al volver atrás, las imágenes de cada card de
// categorías y marcas espabila — primero sin imagen, luego aparece" — las
// 3 secciones (Categorías, Marcas, el carrusel del hero) pedían
// `/api/visual/supply` cada una por su cuenta con su propio useEffect,
// así que cada vez que se remonta la página (cualquier navegación de
// vuelta, no solo un refresh real) arrancaban de nuevo en `{}` antes de
// que la respuesta llegara — 3 fetches duplicados y 3 parpadeos. Al traer
// esas imágenes acá, en el loader (mismo momento que ya trae el
// catálogo), quedan listas ANTES del primer render — cero parpadeo, sin
// importar si es la primera carga o una vuelta atrás.
//
// fetchCatalogCounts (2026-09-14, paginación real) — CategoriesSupply solo
// necesita `{categoria: cantidad}`, nunca los productos en sí; antes este
// loader traía el catálogo COMPLETO del módulo (fetchCatalogFull) solo
// para que CategoriesSupply hiciera `.length` — el home de Supply ya no
// transfiere ni un producto, solo el conteo agregado.
export async function loader() {
  const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
  const [counts, imgs, productsInitial] = await Promise.all([
    fetchCatalogCounts('supply'),
    fetch(`${PANEL_URL}/api/visual/supply`).then(r => r.ok ? r.json() : {}).catch(() => ({})),
    // Home móvil (MobileHomeSupply, 2026-09-14) — primera página del grid
    // "Destacados", SSR igual que counts/imgs, mismo fetchCatalogPage de
    // siempre (sin categoria = mezcla del módulo completo).
    fetchCatalogPage('supply', { limit: 12 }),
  ])
  return { counts, imgs, productsInitial }
}

export function meta() {
  const title = 'INKognito Supply | Insumos y equipos para tatuaje en Colombia'
  const description = 'Tienda online de insumos para tatuadores — máquinas, cartuchos, tintas, agujas y accesorios de proveedores locales y nacionales verificados. Despacho a toda Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: `${import.meta.env.VITE_SITE_URL}${ogSupply}` },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply` },
    { 'script:ld+json': supplyJsonLd },
  ]
}

// Textos completos de Educación para el modal "Ver más" del home móvil
// (2026-09-15) — las cards compactas muestran una versión recortada con
// line-clamp-2, este es el texto íntegro, igual al que ya usa la versión
// desktop, mismo patrón que "Ver descripción" en SupplyProductCard.jsx.
const EDUCACION_DESC = {
  cursos: {
    titulo: 'Domina tu oficio',
    texto: 'Formación en técnica, higiene y gestión de estudio. Acceso ilimitado para aprender a tu propio ritmo.',
  },
  kit: {
    titulo: 'Equípate bien',
    texto: 'Equipamiento inicial y configuraciones clave para armar tu mesa de trabajo con criterio profesional y sin sobrecostos.',
  },
  recursos: {
    titulo: 'Conocimiento',
    texto: 'Guías, plantillas y herramientas descargables diseñadas para potenciar tu técnica y el rendimiento de tu trabajo.',
  },
}

export default function SupplyPage() {
  const { counts, imgs, productsInitial } = useLoaderData()
  const [descAbierta, setDescAbierta] = useState(null)

  return (
    <main className="bg-white text-zinc-900 min-h-screen">
      {/* VISTA ESCRITORIO MODERNA (DesktopHomeSupply) */}
      <div className="hidden md:block">
        <DesktopHomeSupply counts={counts} imgs={imgs} initialProducts={productsInitial} />
      </div>

      {/* VISTA MÓVIL INTACTA (MobileHomeSupply + secciones móviles de Supply) */}
      <div className="md:hidden">
        {/* Home móvil — formato marketplace limpio con tab bar */}
        <MobileHomeSupply imgs={imgs} initialProducts={productsInitial} />

        {/* Sección educación móvil */}
        <section id="educacion" className="relative overflow-hidden bg-white border-t border-zinc-200 py-6">
          <div className="absolute inset-0 opacity-[0.05]" style={DOT_PATTERN} />
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <div className="mb-4">
              <h2 className="text-lg font-black uppercase mb-3 text-zinc-900">Educación</h2>
            </div>

            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2 scrollbar-hide">
              <div className="group relative overflow-hidden snap-start flex-shrink-0 w-[44vw] border border-amber-500/30 bg-amber-500/5 rounded-xl p-4 flex flex-col">
                <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-amber-600/10" />
                <div className="relative flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-white border border-amber-500/30 flex items-center justify-center text-amber-600 flex-shrink-0">
                    <GraduationCap size={15} />
                  </div>
                  <h3 className="text-sm font-black uppercase leading-tight text-zinc-900">Domina tu oficio.</h3>
                </div>
                <p className="relative text-zinc-600 text-[11px] leading-snug flex-1 line-clamp-2">
                  Formación en técnica, higiene y gestión de estudio. Acceso ilimitado para aprender a tu propio ritmo.
                </p>
                <button
                  type="button"
                  onClick={() => setDescAbierta('cursos')}
                  className="relative self-start text-zinc-500 text-[9.5px] font-bold uppercase tracking-wide underline underline-offset-2 mt-1 mb-3"
                >
                  Ver más
                </button>
                <Link
                  to="/supply/aprende/cursos"
                  className="relative shrink-0 border border-amber-500/40 text-amber-600 text-[10px] font-black uppercase tracking-[0.1em] py-2 px-3 rounded-lg text-center"
                >
                  Ver cursos →
                </Link>
              </div>

              <div className="group relative overflow-hidden snap-start flex-shrink-0 w-[44vw] border border-blue-500/30 bg-blue-500/5 rounded-xl p-4 flex flex-col">
                <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-blue-500/10" />
                <div className="relative flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-white border border-blue-500/30 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Package size={15} />
                  </div>
                  <h3 className="text-sm font-black uppercase leading-tight text-zinc-900">Equípate bien</h3>
                </div>
                <p className="relative text-zinc-600 text-[11px] leading-snug flex-1 line-clamp-2">
                  Equipamiento inicial y configuraciones clave para tu mesa de trabajo, sin sobrecostos.
                </p>
                <button
                  type="button"
                  onClick={() => setDescAbierta('kit')}
                  className="relative self-start text-zinc-500 text-[9.5px] font-bold uppercase tracking-wide underline underline-offset-2 mt-1 mb-3"
                >
                  Ver más
                </button>
                <Link
                  to="/supply/aprende/kit"
                  className="relative shrink-0 border border-blue-500/40 text-blue-600 text-[10px] font-black uppercase tracking-[0.1em] py-2 px-3 rounded-lg text-center"
                >
                  Ver kit →
                </Link>
              </div>

              <div className="group relative overflow-hidden snap-start flex-shrink-0 w-[44vw] border border-emerald-500/30 bg-emerald-500/5 rounded-xl p-4 flex flex-col">
                <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-emerald-500/10" />
                <div className="relative flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-white border border-emerald-500/30 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <BookOpen size={15} />
                  </div>
                  <h3 className="text-sm font-black uppercase leading-tight text-zinc-900">Conocimiento</h3>
                </div>
                <p className="relative text-zinc-600 text-[11px] leading-snug flex-1 line-clamp-2">
                  Guías, plantillas y herramientas descargables para potenciar tu técnica.
                </p>
                <button
                  type="button"
                  onClick={() => setDescAbierta('recursos')}
                  className="relative self-start text-zinc-500 text-[9.5px] font-bold uppercase tracking-wide underline underline-offset-2 mt-1 mb-3"
                >
                  Ver más
                </button>
                <Link
                  to="/supply/aprende/recursos"
                  className="relative shrink-0 border border-emerald-500/40 text-emerald-600 text-[10px] font-black uppercase tracking-[0.1em] py-2 px-3 rounded-lg text-center"
                >
                  Ver recursos →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {descAbierta && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-end"
            onClick={() => setDescAbierta(null)}
          >
            <div
              className="w-full max-w-md bg-white border-t border-zinc-200 rounded-t-2xl p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900">
                  {EDUCACION_DESC[descAbierta].titulo}
                </h4>
                <button onClick={() => setDescAbierta(null)} className="text-zinc-500 text-lg leading-none px-1">✕</button>
              </div>
              <p className="text-zinc-600 text-sm leading-relaxed">
                {EDUCACION_DESC[descAbierta].texto}
              </p>
            </div>
          </div>
        )}

        <TechMarquee light />
        <FooterSupply light />
        <div className="h-16 bg-white" />
      </div>
    </main>
  )
}

