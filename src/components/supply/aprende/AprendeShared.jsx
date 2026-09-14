import { Link } from 'react-router-dom'
import { ExternalLink, BookOpen, Package, PlayCircle } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import NavbarCategory from '../NavbarCategory'
import FooterSupply from '../FooterSupply'

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
  const borderHover = `hover:border-${color}-500/50`
  const url = item.url_ventas || item.url_checkout
  const card = (
    <div className={`snap-start flex-shrink-0 w-[44vw] md:w-auto border border-zinc-800 bg-zinc-950 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${borderHover}`}>
      {/* Foto si existe */}
      {item.image_url && (
        <div className="w-full aspect-square bg-zinc-900 overflow-hidden flex-shrink-0">
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        </div>
      )}
      {/* Sin foto: icono placeholder */}
      {!item.image_url && (
        <div className="w-full aspect-square bg-zinc-900 flex items-center justify-center flex-shrink-0">
          {color === 'orange' && <BookOpen size={28} className="text-zinc-700" strokeWidth={1} />}
          {color === 'blue'   && <Package size={28}  className="text-zinc-700" strokeWidth={1} />}
          {color === 'green'  && <PlayCircle size={28} className="text-zinc-700" strokeWidth={1} />}
        </div>
      )}
      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className={`text-[9px] font-black uppercase tracking-widest bg-${color}-500/15 text-${color}-400 border border-${color}-500/30 rounded-full px-2 py-0.5 self-start`}>
          {item.categoria}
        </span>
        <h3 className="font-black uppercase text-xs tracking-[0.08em] text-white leading-snug">
          {item.name}
        </h3>
        {item.descripcion && (
          <p className="text-zinc-500 text-[10px] leading-relaxed flex-1">{item.descripcion}</p>
        )}
        {/* Acciones según tipo */}
        {item.categoria === 'Kit Externo' ? (
          <div className="flex flex-col gap-1.5 mt-auto pt-2">
            {item.url_ventas && (
              <a href={item.url_ventas} target="_blank" rel="noopener noreferrer"
                className="text-center text-[9px] font-bold uppercase tracking-widest border border-zinc-700 text-zinc-300 py-1.5 rounded-lg hover:border-zinc-500 hover:text-white transition-all duration-300">
                Amazon →
              </a>
            )}
            {item.url_checkout && (
              <a href={item.url_checkout} target="_blank" rel="noopener noreferrer"
                className="text-center text-[9px] font-bold uppercase tracking-widest border border-zinc-700 text-zinc-300 py-1.5 rounded-lg hover:border-zinc-500 hover:text-white transition-all duration-300">
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

  // Cursos y Recursos → card completa es clickeable
  if (item.categoria !== 'Kit Externo' && url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="contents">
        {card}
      </a>
    )
  }
  return card
}

// mostrarTitulo (default true) — en las páginas dedicadas (CursosPage,
// KitPage, RecursosPage) ese título ya lo dice el hero de la página, así
// que repetirlo como h2 acá quedaba duplicado; `titulo` igual se sigue
// pasando porque el mensaje de WhatsApp del estado vacío lo necesita.
export function SeccionAfiliados({ id, label, titulo, subtitulo, items, color, cols, mostrarTitulo = true }) {
  return (
    <section id={id} className="relative overflow-hidden pt-3 md:pt-6 pb-8 md:pb-12 px-6 bg-gray-950">
      <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
      <div className="relative z-10 max-w-7xl mx-auto">
        {mostrarTitulo && (
          <div className="mb-4 md:mb-8">
            <p className={`uppercase tracking-[0.25em] text-${color}-500/70 text-[10px] mb-2`}>{label}</p>
            <h2 className="text-2xl md:text-4xl font-black uppercase leading-none mb-2 text-white">{titulo}</h2>
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
          <div className="border border-zinc-800 bg-zinc-950 rounded-2xl p-6 text-center">
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
export function AprendePageShell({ eyebrow, titulo, descripcion, children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <NavbarCategory pageName="Aprende a Tatuar" backPath="/supply" backLabel="Supply" />

      <div className="relative overflow-hidden bg-gray-950 pt-16 md:pt-24">
        <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
        <div className="relative z-10 px-6 max-w-7xl mx-auto pb-5 md:pb-8">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-[10px] mb-2">
            {eyebrow}
          </p>
          <h1 className="text-3xl md:text-6xl font-black uppercase leading-none mb-3 text-white">
            {titulo}
          </h1>
          <p className="text-zinc-400 text-sm md:text-lg leading-relaxed max-w-2xl">
            {descripcion}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-2 md:mt-4">
        <div className="border-b border-zinc-900" />
      </div>

      {children}

      {/* CTA FINAL */}
      <section className="pt-3 md:pt-6 pb-12 md:pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="border border-blue-500/20 bg-zinc-950 rounded-2xl p-7 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-500/40 transition-all duration-300">
            <div>
              <p className="uppercase tracking-[0.25em] text-zinc-500 text-[10px] mb-2">Próximo paso</p>
              <h3 className="text-xl md:text-3xl font-black uppercase leading-tight text-white">¿Listo para el siguiente nivel?</h3>
              <p className="text-zinc-400 mt-2 text-sm">Explora nuestro catálogo de insumos profesionales</p>
            </div>
            <Link to="/supply"
              className="shrink-0 border border-blue-500/40 text-blue-400 text-sm font-black uppercase tracking-[0.2em] py-4 px-8 rounded-xl hover:border-blue-500 hover:bg-blue-500/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 whitespace-nowrap">
              Ver catálogo completo →
            </Link>
          </div>
        </div>
      </section>

      <FooterSupply />
    </div>
  )
}
