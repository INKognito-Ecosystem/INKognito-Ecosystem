import { Link } from 'react-router-dom'
import NavbarCategory from './NavbarCategory'
import FooterSupply from './FooterSupply'
import Seo from '../Seo'
import { useCatalog } from '../../hooks/useCatalog'
import {
  BookOpen, Layers, PenTool, Square, Droplet,
  Package, Crosshair, Hand, FileText,
  PlayCircle, Users, Camera, Monitor, ExternalLink,
} from 'lucide-react'

// ── FALLBACKS ESTÁTICOS (se muestran solo si no hay datos en panel) ─────────
const CURSOS_FALLBACK = [
  { icon: BookOpen, nombre: 'Principiantes', desc: 'Ergonomía, líneas, sombras y bioseguridad desde cero.' },
  { icon: Layers,   nombre: 'Realismo',      desc: 'Sombreado avanzado, contraste y textura hiperrealista.' },
  { icon: PenTool,  nombre: 'Línea fina',    desc: 'Trazo delicado, presión exacta y alta precisión.' },
  { icon: Square,   nombre: 'Blackwork',     desc: 'Figuras y patrones en negro puro con impacto visual.' },
  { icon: Droplet,  nombre: 'Acuarela',      desc: 'Color fluido y efectos de pintura únicos.' },
]

const KIT_FALLBACK = [
  { icon: Package,   nombre: 'Máquina tipo pen',    nota: 'Con batería. La más recomendada para principiantes.' },
  { icon: PenTool,   nombre: 'Cartuchos pack',      nota: 'Desechables, compatibles con máquinas pen.' },
  { icon: Droplet,   nombre: 'Tintas negras',       nota: 'Empieza con negro antes de experimentar con color.' },
  { icon: Crosshair, nombre: 'Piel sintética',      nota: 'Practica cuanto necesites sin riesgos.' },
  { icon: Hand,      nombre: 'Bioseguridad',        nota: 'Guantes, film, jabón — imprescindible desde el día uno.' },
  { icon: FileText,  nombre: 'Papel stencil',       nota: 'Transfiere diseños con precisión a la piel.' },
]

const RECURSOS_FALLBACK = [
  { icon: PlayCircle, nombre: 'YouTube',          desc: 'Busca "curso tatuaje principiantes español". Canal Fredy Tattoo.' },
  { icon: Users,      nombre: 'Grupos Facebook',  desc: 'Comunidades de tatuadores colombianos. Consejos y networking.' },
  { icon: Camera,     nombre: 'Instagram',        desc: 'Sigue tatuadores de tu estilo para inspirarte.' },
  { icon: Monitor,    nombre: 'Practica primero', desc: 'Piel sintética antes de piel real. Mínimo 100h antes de cobrar.' },
]

// ── COMPONENTES DE CARD ──────────────────────────────────────────────────────

function CursoCard({ item, isFallback }) {
  const Icon = item.icon || BookOpen
  const content = (
    <div className="snap-start flex-shrink-0 w-[44vw] md:w-auto border border-zinc-800 bg-zinc-950 rounded-2xl p-5 flex flex-col gap-3 hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.08)] transition-all duration-300 h-full">
      <div className="flex items-center justify-between gap-2">
        {isFallback
          ? <Icon size={20} className="text-orange-400" strokeWidth={1.5} />
          : item.image_url
            ? <img src={item.image_url} alt={item.name} className="w-8 h-8 object-cover rounded-lg" />
            : <BookOpen size={20} className="text-orange-400" strokeWidth={1.5} />
        }
        <span className="text-[9px] font-black uppercase tracking-widest bg-orange-500/15 text-orange-400 border border-orange-500/30 rounded-full px-2 py-0.5 flex-shrink-0">
          Hotmart
        </span>
      </div>
      <h3 className="font-black uppercase text-xs tracking-[0.08em] text-white leading-snug">
        {isFallback ? item.nombre : item.name}
      </h3>
      <p className="text-zinc-500 text-[10px] leading-relaxed flex-1">
        {isFallback ? item.desc : (item.descripcion || 'Curso disponible en Hotmart.')}
      </p>
      {!isFallback && item.url_ventas && (
        <span className="text-orange-400 text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1">
          <ExternalLink size={10} /> Ver curso
        </span>
      )}
      {isFallback && (
        <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.1em]">
          Próximamente →
        </span>
      )}
    </div>
  )

  if (!isFallback && item.url_ventas) {
    return (
      <a href={item.url_ventas} target="_blank" rel="noopener noreferrer" className="contents">
        {content}
      </a>
    )
  }
  return content
}

function KitCard({ item, isFallback }) {
  const Icon = item.icon || Package
  return (
    <div className="snap-start flex-shrink-0 w-[44vw] md:w-auto border border-zinc-800 bg-zinc-950 rounded-2xl p-4 flex flex-col gap-3 hover:border-zinc-600 transition-all duration-300">
      {isFallback
        ? <Icon size={18} className="text-zinc-400" strokeWidth={1.5} />
        : item.image_url
          ? <img src={item.image_url} alt={item.name} className="w-8 h-8 object-cover rounded-lg" />
          : <Package size={18} className="text-zinc-400" strokeWidth={1.5} />
      }
      <h3 className="font-black uppercase text-[10px] tracking-[0.08em] text-white leading-snug">
        {isFallback ? item.nombre : item.name}
      </h3>
      <p className="text-zinc-600 text-[9px] leading-relaxed flex-1">
        {isFallback ? item.nota : (item.descripcion || 'Disponible externamente.')}
      </p>
      <div className="flex flex-col gap-1.5 mt-auto">
        {!isFallback && item.url_ventas ? (
          <a href={item.url_ventas} target="_blank" rel="noopener noreferrer"
            className="text-center text-[9px] font-bold uppercase tracking-widest border border-zinc-700 text-zinc-300 py-1.5 rounded-lg hover:border-zinc-500 hover:text-white transition-all duration-300">
            Amazon →
          </a>
        ) : (
          <span className="text-center text-[9px] font-bold uppercase tracking-widest border border-zinc-800 text-zinc-600 py-1.5 rounded-lg">
            Amazon
          </span>
        )}
        {!isFallback && item.url_checkout ? (
          <a href={item.url_checkout} target="_blank" rel="noopener noreferrer"
            className="text-center text-[9px] font-bold uppercase tracking-widest border border-zinc-700 text-zinc-300 py-1.5 rounded-lg hover:border-zinc-500 hover:text-white transition-all duration-300">
            AliExpress →
          </a>
        ) : (
          <span className="text-center text-[9px] font-bold uppercase tracking-widest border border-zinc-800 text-zinc-600 py-1.5 rounded-lg">
            AliExpress
          </span>
        )}
      </div>
    </div>
  )
}

function RecursoCard({ item, isFallback }) {
  const Icon = item.icon || PlayCircle
  return (
    <div className="snap-start flex-shrink-0 w-[44vw] md:w-auto border border-zinc-800 bg-zinc-950 rounded-2xl p-5 flex flex-col gap-3 hover:border-green-500/30 transition-all duration-300">
      {isFallback
        ? <Icon size={20} className="text-green-400" strokeWidth={1.5} />
        : item.image_url
          ? <img src={item.image_url} alt={item.name} className="w-8 h-8 object-cover rounded-lg" />
          : <PlayCircle size={20} className="text-green-400" strokeWidth={1.5} />
      }
      <h3 className="font-black uppercase text-xs tracking-[0.08em] text-white">
        {isFallback ? item.nombre : item.name}
      </h3>
      <p className="text-zinc-500 text-[10px] leading-relaxed flex-1">
        {isFallback ? item.desc : (item.descripcion || 'Recurso disponible.')}
      </p>
      {!isFallback && item.url_ventas ? (
        <a href={item.url_ventas} target="_blank" rel="noopener noreferrer"
          className="text-green-400 text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1">
          <ExternalLink size={10} /> Ver recurso
        </a>
      ) : (
        <span className="text-green-500 text-[10px] font-bold uppercase tracking-[0.15em]">
          Gratuito ✓
        </span>
      )}
    </div>
  )
}

// ── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function AprendePage() {
  const { allProducts, loading } = useCatalog('supply')
  const afiliados = allProducts.filter(p => p.tipo === 'afiliado')

  // Filtrar por categoría para cada sección
  const cursosPanel   = afiliados.filter(p => p.categoria === 'Cursos')
  const kitPanel      = afiliados.filter(p => p.categoria === 'Kit Externo')
  const recursosPanel = afiliados.filter(p => p.categoria === 'Recursos')

  // Determinar si se usan datos del panel o fallbacks
  const showCursos   = loading || cursosPanel.length   > 0
  const showKit      = loading || kitPanel.length      > 0
  const showRecursos = loading || recursosPanel.length > 0

  const cursosItems   = cursosPanel.length   > 0 ? cursosPanel   : CURSOS_FALLBACK
  const kitItems      = kitPanel.length      > 0 ? kitPanel      : KIT_FALLBACK
  const recursosItems = recursosPanel.length > 0 ? recursosPanel : RECURSOS_FALLBACK

  const isCursosFallback   = cursosPanel.length   === 0
  const isKitFallback      = kitPanel.length      === 0
  const isRecursosFallback = recursosPanel.length === 0

  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Aprende a Tatuar | Cursos, Kit y Recursos — INKognito Supply"
        description="Recursos para aprender a tatuar desde cero. Cursos Hotmart, kit básico en Amazon/AliExpress y recursos gratuitos para principiantes en Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/aprende`}
      />

      <NavbarCategory pageName="Aprende a Tatuar" backPath="/supply" backLabel="Supply" />

      {/* HERO COMPACTO */}
      <div className="bg-black pt-16 md:pt-24">
        <div className="px-6 max-w-7xl mx-auto pb-5 md:pb-8">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-[10px] mb-2">
            Para nuevos tatuadores
          </p>
          <h1 className="text-3xl md:text-7xl font-black uppercase leading-none mb-3 text-white">
            Empieza tu camino<br />
            <span className="text-zinc-500">como tatuador</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-lg leading-relaxed max-w-2xl">
            Cursos recomendados, el kit básico de insumos y recursos gratuitos
            para aprender a tatuar con confianza.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-2 md:mt-4">
        <div className="border-b border-zinc-900" />
      </div>

      {/* CURSOS DIGITALES (Hotmart) */}
      <section className="pt-3 md:pt-6 pb-8 md:pb-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 md:mb-8">
            <p className="uppercase tracking-[0.25em] text-orange-500/70 text-[10px] mb-2">
              Hotmart · Cursos digitales
            </p>
            <h2 className="text-2xl md:text-4xl font-black uppercase leading-none mb-2 text-white">
              Aprende con los mejores
            </h2>
            <p className="text-zinc-500 text-sm">
              Formación online. Compra una vez, acceso de por vida.
              {isCursosFallback && <span className="ml-2 text-zinc-600 text-[10px] uppercase tracking-widest">· Próximamente disponibles</span>}
            </p>
          </div>

          <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
            {cursosItems.map((item, i) => (
              <CursoCard key={isCursosFallback ? item.nombre : (item.name + i)} item={item} isFallback={isCursosFallback} />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        <div className="border-b border-zinc-900" />
      </div>

      {/* KIT BÁSICO (Amazon / AliExpress) */}
      <section className="pt-3 md:pt-6 pb-8 md:pb-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 md:mb-8">
            <p className="uppercase tracking-[0.25em] text-blue-500/70 text-[10px] mb-2">
              Amazon · AliExpress · Kit básico
            </p>
            <h2 className="text-2xl md:text-4xl font-black uppercase leading-none mb-2 text-white">
              Lo que necesitas para empezar
            </h2>
            <p className="text-zinc-500 text-sm">
              Insumos esenciales. url_ventas = Amazon · url_checkout = AliExpress.
              {isKitFallback && <span className="ml-2 text-zinc-600 text-[10px] uppercase tracking-widest">· Links próximamente</span>}
            </p>
          </div>

          <div className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
            {kitItems.map((item, i) => (
              <KitCard key={isKitFallback ? item.nombre : (item.name + i)} item={item} isFallback={isKitFallback} />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        <div className="border-b border-zinc-900" />
      </div>

      {/* RECURSOS GRATUITOS */}
      <section className="pt-3 md:pt-6 pb-8 md:pb-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 md:mb-8">
            <p className="uppercase tracking-[0.25em] text-green-500/70 text-[10px] mb-2">
              Sin costo
            </p>
            <h2 className="text-2xl md:text-4xl font-black uppercase leading-none mb-2 text-white">
              Recursos gratuitos
            </h2>
            <p className="text-zinc-500 text-sm">
              Aprende sin gastar. La práctica constante es la clave.
            </p>
          </div>

          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
            {recursosItems.map((item, i) => (
              <RecursoCard key={isRecursosFallback ? item.nombre : (item.name + i)} item={item} isFallback={isRecursosFallback} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="pt-3 md:pt-6 pb-12 md:pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="border border-blue-500/20 bg-zinc-950 rounded-2xl p-7 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-500/40 transition-all duration-300">
            <div>
              <p className="uppercase tracking-[0.25em] text-zinc-500 text-[10px] mb-2">Próximo paso</p>
              <h3 className="text-xl md:text-3xl font-black uppercase leading-tight text-white">¿Ya tienes lo básico?</h3>
              <p className="text-zinc-400 mt-2 text-sm">Explora nuestro catálogo de insumos profesionales</p>
            </div>
            <Link
              to="/supply"
              className="shrink-0 border border-blue-500/40 text-blue-400 text-sm font-black uppercase tracking-[0.2em] py-4 px-8 rounded-xl hover:border-blue-500 hover:bg-blue-500/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 whitespace-nowrap"
            >
              Ver catálogo completo →
            </Link>
          </div>
        </div>
      </section>

      <FooterSupply />
    </div>
  )
}
