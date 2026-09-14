import { useLoaderData } from 'react-router-dom'
import { motion } from 'motion/react'
import NavbarSupply from './NavbarSupply'
import HeroSupply from './HeroSupply'
import CategoriesSupply from './CategoriesSupply'
import BrandsSupply from './BrandsSupply'
import MobileHomeSupply from './MobileHomeSupply'
import TechMarquee from '../TechMarquee'
import FooterSupply from './FooterSupply'
import { GraduationCap, Package, BookOpen } from 'lucide-react'
import { fetchCatalogCounts, fetchCatalogPage } from '../../hooks/useCatalog'
const ogSupply = '/og/supply.webp'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

// Mismo patrón de aparición al hacer scroll que StorePage.jsx — Jose notó
// que Supply se quedó sin esto mientras Store sí lo tenía (2026-09-12). El
// hero queda afuera a propósito: ya está visible al cargar, no tiene
// sentido hacerlo esperar.
const REVEAL = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
}
import { Link } from 'react-router-dom'

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

export default function SupplyPage() {
  const { counts, imgs, productsInitial } = useLoaderData()

  return (

    <main className="bg-gray-950 text-white">

    {/* Home móvil (MobileHomeSupply, 2026-09-14) — formato marketplace,
        reemplaza SOLO en móvil al bloque de abajo. Local por ahora. */}
    <MobileHomeSupply imgs={imgs} initialProducts={productsInitial} />

    <div className="hidden md:block">
      <NavbarSupply />

      <HeroSupply imgs={imgs} />

      <div className="max-w-7xl mx-auto px-6 mt-2 md:mt-8">
        <div className="border-b border-zinc-900"></div>
      </div>

      <CategoriesSupply counts={counts} imgs={imgs} />

      <BrandsSupply imgs={imgs} />
    </div>

    {/* SECCIÓN EDUCACIÓN — Cursos, Kit, Recursos */}
    <motion.section {...REVEAL} className="relative overflow-hidden bg-gray-950 border-t border-zinc-900 py-8 md:py-16">
      <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="mb-6">
          <h2 className="float-left mr-6 md:mr-8 mb-2 text-2xl md:text-4xl font-black uppercase leading-none">
            Educación
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed text-justify [hyphens:auto]">
            Recursos formativos, kits esenciales y herramientas gratuitas seleccionadas para
            perfeccionar tu técnica y gestionar tu trabajo. Formación práctica enfocada en el
            crecimiento constante del artista.
          </p>
          <div className="clear-both" />
        </div>

        <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">

          {/* CARD CURSOS — mismo patrón de card usado en Eljach (Packages.jsx:
              fondo en degradado, no plano + hover con elevación/sombra) y en
              jhumaneztattoo (CuidadosTeaser.jsx: círculo decorativo difuminado
              detrás del contenido + ícono que crece en hover). Acento ámbar
              (2026-09-13, Jose: intercambiar el color con la card de Kit,
              antes era azul). */}
          <div className="group relative overflow-hidden snap-start flex-shrink-0 w-[80vw] md:w-auto border border-amber-500/20 bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 md:p-7 flex flex-col hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(245,158,11,0.15)] transition-all duration-300">
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-amber-600/10" />
            <div className="relative w-12 h-12 rounded-full bg-zinc-900 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap size={22} />
            </div>
            <h3 className="relative text-xl md:text-2xl font-black uppercase leading-none mb-3">
              Domina tu oficio.<br />
              <span className="text-zinc-500">No lo improvises.</span>
            </h3>
            <p className="relative text-zinc-400 text-sm mb-5 flex-1">
              Formación en técnica, higiene y gestión de estudio. Acceso ilimitado para aprender a tu propio ritmo.
            </p>
            <Link
              to="/supply/aprende/cursos"
              className="relative shrink-0 border border-amber-500/40 text-amber-400 text-sm font-black uppercase tracking-[0.2em] py-3 px-6 rounded-xl text-center hover:border-amber-500 hover:bg-amber-500/10 transition-all duration-300"
            >
              Ver cursos →
            </Link>
          </div>

          {/* CARD KIT — mismo patrón, acento azul (2026-09-13, Jose:
              intercambiar el color con la card de Cursos, antes era ámbar)
              para que las 3 cards no se lean idénticas. */}
          <div className="group relative overflow-hidden snap-start flex-shrink-0 w-[80vw] md:w-auto border border-blue-500/20 bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 md:p-7 flex flex-col hover:border-blue-500/40 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(59,130,246,0.15)] transition-all duration-300">
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-blue-500/10" />
            <div className="relative w-12 h-12 rounded-full bg-zinc-900 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <Package size={22} />
            </div>
            <h3 className="relative text-xl md:text-2xl font-black uppercase leading-none mb-3">
              Equípate bien<br />
              <span className="text-zinc-500">desde el día uno.</span>
            </h3>
            <p className="relative text-zinc-400 text-sm mb-5 flex-1">
              Equipamiento inicial y configuraciones clave para armar tu mesa de trabajo con criterio profesional y sin sobrecostos.
            </p>
            <Link
              to="/supply/aprende/kit"
              className="relative shrink-0 border border-blue-500/40 text-blue-400 text-sm font-black uppercase tracking-[0.2em] py-3 px-6 rounded-xl text-center hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300"
            >
              Ver kit recomendado →
            </Link>
          </div>

          {/* CARD RECURSOS — acento esmeralda (tercer color, gratis/crecimiento). */}
          <div className="group relative overflow-hidden snap-start flex-shrink-0 w-[80vw] md:w-auto border border-emerald-500/20 bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 md:p-7 flex flex-col hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(16,185,129,0.15)] transition-all duration-300">
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-emerald-500/10" />
            <div className="relative w-12 h-12 rounded-full bg-zinc-900 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <BookOpen size={22} />
            </div>
            <h3 className="relative text-xl md:text-2xl font-black uppercase leading-none mb-3">
              Conocimiento<br />
              <span className="text-zinc-500">que no cuesta nada.</span>
            </h3>
            <p className="relative text-zinc-400 text-sm mb-5 flex-1">
              Guías, plantillas y herramientas descargables diseñadas para potenciar tu técnica y el rendimiento de tu trabajo.
            </p>
            <Link
              to="/supply/aprende/recursos"
              className="relative shrink-0 border border-emerald-500/40 text-emerald-400 text-sm font-black uppercase tracking-[0.2em] py-3 px-6 rounded-xl text-center hover:border-emerald-500 hover:bg-emerald-500/10 transition-all duration-300"
            >
              Ver recursos gratuitos →
            </Link>
          </div>

        </div>
      </div>
    </motion.section>

    {/* ── COBERTURA + CONTACTO — solo móvil ────────────────────── */}
    <motion.section {...REVEAL} id="contacto" className="relative overflow-hidden md:hidden border-t border-zinc-900 bg-gray-950 px-6 py-8">
      <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
      <div className="relative z-10">
      <h2 className="text-base font-black uppercase leading-none mb-3 text-white whitespace-nowrap">Cobertura y red de distribución</h2>
      <p className="text-zinc-400 text-sm leading-relaxed mb-5">
        Infraestructura digital diseñada para el sector. Conectamos tiendas supply/proveedores
        con artistas de todo el país. Nuestra plataforma procesa tu orden y asigna el despacho
        directamente al supply correspondiente, garantizando disponibilidad de stock y entregas
        eficientes en toda Colombia.
      </p>
      <div className="flex flex-col gap-2 mb-5">
        {['Red de proveedores con stock verificado','Despacho directo desde el distribuidor asignado','Cobertura y logística integrada en toda Colombia'].map(g => (
          <div key={g} className="flex items-center gap-2">
            <span className="text-green-500 text-sm font-bold">✓</span>
            <span className="text-zinc-400 text-xs">{g}</span>
          </div>
        ))}
      </div>
      </div>
    </motion.section>

    {/* ── COBERTURA Y LOGÍSTICA — solo desktop (2026-09-13, Jose: quitó
        Garantías y Contacto, quedaban de más una vez que la plataforma
        procesa el pedido directamente en vez de coordinar por WhatsApp) ── */}
    <motion.section {...REVEAL} id="contacto-desktop" className="relative overflow-hidden hidden md:block bg-gray-950 border-t border-zinc-900 px-6 py-14">
      <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.25em] text-blue-400/70 text-[10px] mb-4">Logística · Cobertura</p>
          <h2 className="text-3xl font-black uppercase leading-none mb-6 text-white">Cobertura y red de distribución</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Infraestructura digital diseñada para el sector. Conectamos tiendas supply/proveedores
            con artistas de todo el país. Nuestra plataforma procesa tu orden y asigna el despacho
            directamente al supply correspondiente, garantizando disponibilidad de stock y
            entregas eficientes en toda Colombia.
          </p>
        </div>
      </div>
    </motion.section>

    <TechMarquee />

    <FooterSupply />

    </main>

  )

}

