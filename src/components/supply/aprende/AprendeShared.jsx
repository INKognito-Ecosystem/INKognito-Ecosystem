import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, BookOpen, Package, PlayCircle } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import NavbarCategory from '../NavbarCategory'
import FooterSupply from '../FooterSupply'
import SupplyMobileNav from '../SupplyMobileNav'
import { APRENDE_ORDER } from '../../../data/aprendeOrder'

// Piezas compartidas por las 3 páginas de /supply/aprende/* (cursos, kit,
// recursos) — 2026-09-13, Jose: "separemos las card de educación... cada
// uno deberá abrir su propio espacio". Antes las 3 vivían juntas en una
// sola AprendePage.jsx con anclas #cursos/#kit/#recursos: entrar a
// cualquiera de las 3 mostraba las otras dos igual, solo con distinto
// scroll inicial. Ahora cada categoría es su propia ruta/página — este
// archivo guarda lo que SÍ es idéntico entre las 3 (la card de producto
// afiliado y la sección con su estado de carga/vacío), sin duplicarlo.

export const WA = '573207911013'
export const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

export const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

export function AfiliadoCard({ item, color }) {
  // Descripción recortada a 3 líneas siempre, en cualquier pantalla
  // (2026-09-13, Jose: "que se acorte siempre a 3 líneas... la card no
  // deberá crecer, se abre la descripción en la parte inferior") — mismo
  // mecanismo de hoja inferior que ya usa SupplyProductCard.jsx en
  // Supply, pero sin el gate `md:hidden` de ese componente: acá el
  // recorte aplica también en escritorio, porque estas cards viven en una
  // grilla de hasta 5 columnas donde una descripción larga rompería la
  // altura pareja de la fila.
  const [showDesc, setShowDesc] = useState(false)
  const borderHover = `hover:border-${color}-500/50`
  const url = item.url_ventas || item.url_checkout
  const card = (
    // Translúcida con el acento propio de la sección, no oscura (2026-09-15,
    // mismo criterio que las cards de Educación de SupplyPage.jsx: border-
    // {color}-500/30 bg-{color}-500/5).
    <div className={`snap-start flex-shrink-0 w-[44vw] md:w-auto border border-${color}-500/30 bg-${color}-500/5 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${borderHover}`}>
      {/* Foto si existe */}
      {item.image_url && (
        <div className="w-full aspect-square bg-white overflow-hidden flex-shrink-0">
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        </div>
      )}
      {/* Sin foto: icono placeholder */}
      {!item.image_url && (
        <div className="w-full aspect-square bg-white flex items-center justify-center flex-shrink-0">
          {color === 'orange' && <BookOpen size={28} className="text-zinc-300" strokeWidth={1} />}
          {color === 'blue'   && <Package size={28}  className="text-zinc-300" strokeWidth={1} />}
          {color === 'green'  && <PlayCircle size={28} className="text-zinc-300" strokeWidth={1} />}
        </div>
      )}
      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Insignia de categoría quitada (2026-09-13, Jose: "esa palabra
            arriba del título solo distingue en el panel, donde varias
            categorías se mezclan en una tabla — acá cada página ya es una
            sola categoría, repetirla en cada card es ruido") — el título
            sube y la card queda más compacta con un elemento menos. */}
        <h3 className="font-black uppercase text-xs tracking-[0.08em] text-zinc-900 leading-snug">
          {item.name}
        </h3>
        {item.descripcion && (
          // 2 líneas de texto + 1 línea para "Ver descripción" = 3 líneas
          // visibles siempre (2026-09-13, Jose: "sin color y seguido del
          // texto", y que sean siempre 3 líneas, no 3 en una card y 4 en
          // otra). Se probaron dos versiones antes de esta: (a) todo el
          // párrafo con line-clamp-3 y el botón adentro, en línea — con
          // descripciones largas el texto ya llenaba las 3 líneas por sí
          // solo y el botón quedaba recortado, invisible (confirmado
          // midiendo scrollHeight vs clientHeight); (b) recorte por
          // cantidad fija de caracteres — funcionaba en desktop pero en
          // las cards angostas de móvil (w-[44vw]) esos mismos caracteres
          // ya no cabían en 3 líneas. Separar el botón en su propia línea
          // (sin line-clamp, nunca se recorta) es lo único que garantiza
          // que sea siempre visible sin importar el ancho de la card.
          <div className="flex flex-col gap-0.5">
            <p className="text-zinc-500 text-[10px] leading-relaxed line-clamp-2">{item.descripcion}</p>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDesc(true) }}
              className="text-zinc-500 text-[10px] leading-relaxed underline underline-offset-2 self-start"
            >
              Ver descripción
            </button>
          </div>
        )}
        {/* Acciones según tipo */}
        {item.categoria === 'Kit Externo' ? (
          <div className="flex flex-col gap-1.5 mt-auto pt-2">
            {item.url_ventas && (
              <a href={item.url_ventas} target="_blank" rel="noopener noreferrer"
                className="text-center text-[9px] font-bold uppercase tracking-widest border border-zinc-300 text-zinc-600 py-1.5 rounded-lg hover:border-zinc-400 hover:text-zinc-900 transition-all duration-300">
                Amazon →
              </a>
            )}
            {item.url_checkout && (
              <a href={item.url_checkout} target="_blank" rel="noopener noreferrer"
                className="text-center text-[9px] font-bold uppercase tracking-widest border border-zinc-300 text-zinc-600 py-1.5 rounded-lg hover:border-zinc-400 hover:text-zinc-900 transition-all duration-300">
                AliExpress →
              </a>
            )}
          </div>
        ) : url ? (
          <div className="mt-auto pt-2">
            {/* Micro-copy de apoyo (2026-09-13, propuesta de Jose) — solo
                afirmaciones genéricas y ciertas para cualquier curso digital
                (acceso inmediato, a tu ritmo). Deliberadamente NO se agrega
                "Hotmart Certified" ni un número de días de garantía: son
                afirmaciones de confianza que solo valen si son reales, y
                hoy no hay forma de verificar que apliquen igual a cada
                curso — mejor no mostrarlas que inventarlas. */}
            {item.categoria === 'Cursos' && (
              <p className="text-zinc-600 text-[9px] uppercase tracking-widest mb-1.5">Acceso inmediato · Aprende a tu ritmo</p>
            )}
            <span className={`text-${color}-400 text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1`}>
              {item.categoria === 'Cursos' ? 'Ver detalles del curso' : 'Ver'} → <ExternalLink size={10} />
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )

  // Cursos y Recursos → card completa es clickeable. El botón "Ver
  // descripción" ya hace preventDefault+stopPropagation en su onClick de
  // arriba, así que abrir la hoja inferior no dispara además la
  // navegación de este <a> que envuelve toda la card.
  const wrapped = item.categoria !== 'Kit Externo' && url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" className="contents">
      {card}
    </a>
  ) : card

  return (
    <>
      {wrapped}
      {showDesc && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center"
          onClick={() => setShowDesc(false)}
        >
          <div
            className="w-full max-w-md bg-white border-t border-zinc-200 rounded-t-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900">Descripción</h4>
              <button onClick={() => setShowDesc(false)} className="text-zinc-500 text-lg leading-none px-1">✕</button>
            </div>
            <p className="text-zinc-600 text-sm leading-relaxed">{item.descripcion}</p>
          </div>
        </div>
      )}
    </>
  )
}

// mostrarTitulo (default true) — en las páginas dedicadas (CursosPage,
// KitPage, RecursosPage) ese título ya lo dice el hero de la página, así
// que repetirlo como h2 acá quedaba duplicado; `titulo` igual se sigue
// pasando porque el mensaje de WhatsApp del estado vacío lo necesita.
export function SeccionAfiliados({ id, label, titulo, subtitulo, items, color, cols, mostrarTitulo = true }) {
  return (
    <section id={id} className="relative overflow-hidden pt-3 md:pt-6 pb-8 md:pb-12 px-6 bg-white">
      <div className="absolute inset-0 opacity-[0.05]" style={DOT_PATTERN} />
      <div className="relative z-10 max-w-7xl mx-auto">
        {mostrarTitulo && (
          <div className="mb-4 md:mb-8">
            <p className={`uppercase tracking-[0.25em] text-${color}-500/70 text-[10px] mb-2`}>{label}</p>
            <h2 className="text-2xl md:text-4xl font-black uppercase leading-none mb-2 text-zinc-900">{titulo}</h2>
            {subtitulo && <p className="text-zinc-500 text-sm">{subtitulo}</p>}
          </div>
        )}
        {items.length > 0 ? (
          <div className={`flex md:grid md:grid-cols-2 ${cols} gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide`}>
            {items.map((item, i) => (
              <AfiliadoCard key={item.name + i} item={item} color={color} />
            ))}
          </div>
        ) : (
          <div className="border border-zinc-200 bg-zinc-50 rounded-2xl p-6 text-center">
            <p className="text-zinc-500 text-sm mb-4">Próximamente disponible en esta sección.</p>
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hola, quiero que me avisen cuando haya ${titulo.toLowerCase()} disponibles en INKognito Supply.`)}`}
              target="_blank" rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-5 py-2.5 bg-${color}-500 text-white font-bold uppercase tracking-[0.15em] text-xs rounded hover:opacity-90 transition`}
            >
              <FaWhatsapp size={16} />
              Avisarme cuando esté disponible →
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

// Armazón compartido: Navbar + mini-hero propio de la categoría + la
// sección de afiliados (children) + CTA de vuelta a Supply + Footer.
// Cada página (CursosPage/KitPage/RecursosPage) solo aporta su copy y su
// <SeccionAfiliados>, no repite este esqueleto 3 veces.
export function AprendePageShell({ eyebrow, titulo, descripcion, slug, children }) {
  return (
    <div className="min-h-screen bg-white text-zinc-900">

      {/* Blanco + los dos navbar (2026-09-15, Jose: "apliquemos el patrón
          de fondo blanco y los dos navbar para las tres cards, de
          educación") — mismo patrón ya usado en SupplyProveedoresPage.jsx:
          NavbarCategory arriba (light, sin buscador — acá no hay nada que
          filtrar) + SupplyMobileNav abajo en móvil. */}
      <NavbarCategory
        pageName="Aprende a Tatuar"
        light
        hideMobileActions
        hideWordmark
        shareUrl={`${import.meta.env.VITE_SITE_URL}/supply/aprende/${slug}`}
      />

      {/* Franja de navegación Cursos/Kit/Recursos debajo del navbar, igual
          a como se hace con las categorías (2026-09-15, Jose: "aquí solo
          agregas las tres cards, en la parte superior debajo del navbar,
          como se hace con las categorías") — reemplaza las flechitas
          prev/next de antes por la misma franja azul con texto (no
          íconos) que ya usan las páginas de categoría, con la pestaña
          activa subrayada en blanco. Título y descripción del hero
          siguen intactos, tal cual los pasa cada página. */}
      <div className="md:hidden relative z-10 flex items-center gap-4 overflow-x-auto px-6 py-3 pt-20 bg-blue-500 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {APRENDE_ORDER.map(item => (
          <Link
            key={item.slug}
            to={`/supply/aprende/${item.slug}`}
            replace
            className={`flex-shrink-0 text-[12px] font-extrabold pb-1 border-b-2 whitespace-nowrap ${
              item.slug === slug ? 'text-white border-white' : 'text-blue-100 border-transparent'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="hidden md:flex items-center justify-center gap-8 pt-28 pb-2 bg-blue-500">
        {APRENDE_ORDER.map(item => (
          <Link
            key={item.slug}
            to={`/supply/aprende/${item.slug}`}
            replace
            className={`text-sm font-extrabold uppercase tracking-wide pb-1 border-b-2 whitespace-nowrap ${
              item.slug === slug ? 'text-white border-white' : 'text-blue-100 border-transparent'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="relative overflow-hidden bg-white pt-5 md:pt-8">
        <div className="absolute inset-0 opacity-[0.05]" style={DOT_PATTERN} />
        <div className="relative z-10 px-6 max-w-7xl mx-auto pb-5 md:pb-8">
          <h1 className="text-3xl md:text-6xl font-black uppercase leading-none mb-3 text-zinc-900">
            {titulo}
          </h1>
          <p className="text-zinc-600 text-sm md:text-lg leading-relaxed max-w-2xl mb-4">
            {descripcion}
          </p>
          {/* Eyebrow (2026-09-13, Jose: primero pidió que bajara debajo de
              la descripción arriba de las cards; luego, que quedara
              ARRIBA de la línea que separa el hero de las cards, no
              debajo — o sea, todavía dentro de este bloque del hero). */}
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-[10px]">{eyebrow}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-2 md:mt-4">
        <div className="border-b border-zinc-200" />
      </div>

      {children}

      {/* CTA FINAL */}
      <section className="pt-3 md:pt-6 pb-12 md:pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="border border-blue-500/30 bg-blue-500/5 rounded-2xl p-7 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-500/50 transition-all duration-300">
            <div>
              <p className="uppercase tracking-[0.25em] text-zinc-500 text-[10px] mb-2">Próximo paso</p>
              <h3 className="text-xl md:text-3xl font-black uppercase leading-tight text-zinc-900">¿Listo para el siguiente nivel?</h3>
              <p className="text-zinc-600 mt-2 text-sm">Explora nuestro catálogo de insumos profesionales</p>
            </div>
            <Link to="/supply"
              className="shrink-0 border border-blue-500/40 text-blue-600 text-sm font-black uppercase tracking-[0.2em] py-4 px-8 rounded-xl hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300 whitespace-nowrap">
              Ver catálogo completo →
            </Link>
          </div>
        </div>
      </section>

      <FooterSupply light />
      {/* h-16 (64px), no h-20 — mismo ajuste ya usado en el resto de Supply
          (SupplyPage.jsx/SupplyCategoryPage.jsx/SupplyProveedoresPage.jsx). */}
      <div className="h-16 md:hidden" />
      <SupplyMobileNav active={null} light />
    </div>
  )
}
