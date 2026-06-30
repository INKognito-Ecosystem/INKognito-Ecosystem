import { Link } from 'react-router-dom'
import NavbarCategory from './NavbarCategory'
import FooterSupply from './FooterSupply'
import Seo from '../Seo'
import { useCatalog } from '../../hooks/useCatalog'
import { ExternalLink, BookOpen, Package, PlayCircle } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

const WA = '573207911013'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

// ── CARDS ─────────────────────────────────────────────────────────────────

function AfiliadoCard({ item, color, accentColor }) {
  const borderHover = `hover:border-${color}-500/50`
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
        ) : item.url_ventas ? (
          <span className={`text-${color}-400 text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1 mt-auto pt-2`}>
            <ExternalLink size={10} /> Ver →
          </span>
        ) : null}
      </div>
    </div>
  )

  // Cursos y Recursos → card completa es clickeable
  if (item.categoria !== 'Kit Externo' && item.url_ventas) {
    return (
      <a href={item.url_ventas} target="_blank" rel="noopener noreferrer" className="contents">
        {card}
      </a>
    )
  }
  return card
}

// ── SECCIÓN GENÉRICA CON SCROLL ───────────────────────────────────────────
function SeccionAfiliados({ label, titulo, subtitulo, items, color, cols }) {
  return (
    <>
      <section className="relative overflow-hidden pt-3 md:pt-6 pb-8 md:pb-12 px-6 bg-gray-950">
        <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-4 md:mb-8">
            <p className={`uppercase tracking-[0.25em] text-${color}-500/70 text-[10px] mb-2`}>{label}</p>
            <h2 className="text-2xl md:text-4xl font-black uppercase leading-none mb-2 text-white">{titulo}</h2>
            {subtitulo && <p className="text-zinc-500 text-sm">{subtitulo}</p>}
          </div>
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
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-b border-zinc-900" />
      </div>
    </>
  )
}

// ── PÁGINA ────────────────────────────────────────────────────────────────
export default function AprendePage() {
  const { allProducts, loading } = useCatalog('supply')
  const afiliados = allProducts.filter(p => p.tipo === 'afiliado')

  const cursos   = afiliados.filter(p => p.categoria === 'Cursos')
  const kitExt   = afiliados.filter(p => p.categoria === 'Kit Externo')
  const recursos = afiliados.filter(p => p.categoria === 'Recursos')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Aprende a Tatuar | Cursos, Kit y Recursos — INKognito Supply"
        description="Cursos, kit y recursos para tatuadores en cualquier etapa: desde quienes empiezan hasta quienes buscan especializarse. Formación real para el oficio, en Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/aprende`}
      />

      <NavbarCategory pageName="Aprende a Tatuar" backPath="/supply" backLabel="Supply" />

      {/* HERO */}
      <div className="relative overflow-hidden bg-gray-950 pt-16 md:pt-24">
        <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
        <div className="relative z-10 px-6 max-w-7xl mx-auto pb-5 md:pb-8">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-[10px] mb-2">
            Educación · Crecimiento profesional
          </p>
          <h1 className="text-3xl md:text-7xl font-black uppercase leading-none mb-3 text-white">
            Fórmate. Especialízate.<br />
            <span className="text-zinc-500">Evoluciona.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-lg leading-relaxed max-w-2xl">
            Cursos y recursos para tatuadores en cualquier etapa: desde tu primera
            máquina hasta la técnica que te falta dominar. Conocimiento real,
            aplicable desde la primera sesión.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-2 md:mt-4">
        <div className="border-b border-zinc-900" />
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <p className="text-zinc-600 text-sm uppercase tracking-widest">Cargando recursos…</p>
        </div>
      )}

      {/* Secciones — cada una maneja su propio estado vacío */}
      {!loading && (
        <>
          <SeccionAfiliados
            label="Hotmart · Cursos digitales"
            titulo="Formación que se nota en tu trazo"
            subtitulo="Desde fundamentos hasta especialización en realismo, sombras y color. Acceso de por vida, a tu ritmo."
            items={cursos}
            color="orange"
            cols="lg:grid-cols-5"
          />
          <SeccionAfiliados
            label="Amazon · AliExpress · Kit básico"
            titulo="El kit que respalda tu práctica"
            subtitulo="Insumos seleccionados para trabajar con seriedad, sin sobrecostos."
            items={kitExt}
            color="blue"
            cols="lg:grid-cols-6"
          />
          <SeccionAfiliados
            label="Sin costo"
            titulo="Recursos gratuitos"
            subtitulo="Contenido sin costo para seguir creciendo. La práctica constante es lo que realmente marca la diferencia."
            items={recursos}
            color="green"
            cols="lg:grid-cols-4"
          />
        </>
      )}

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
