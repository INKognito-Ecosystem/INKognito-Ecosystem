import { Link } from 'react-router-dom'
import NavbarCategory from './NavbarCategory'
import FooterSupply from './FooterSupply'
import Seo from '../Seo'
import { BookOpen, Layers, PenTool, Square, Droplet, Package, Crosshair, Hand, ShieldCheck, FileText, PlayCircle, Users, Camera, Monitor } from 'lucide-react'

// ── CURSOS HOTMART ────────────────────────────────────────────────
const cursos = [
  {
    icon: BookOpen,
    nombre: 'Principiantes',
    desc: 'Ergonomía, líneas, sombras básicas y bioseguridad desde cero.',
    badge: 'Hotmart',
    link: '#',
  },
  {
    icon: Layers,
    nombre: 'Realismo',
    desc: 'Sombreado avanzado, contraste y textura hiperrealista.',
    badge: 'Hotmart',
    link: '#',
  },
  {
    icon: PenTool,
    nombre: 'Línea fina',
    desc: 'Trazo delicado, presión exacta y diseños de alta precisión.',
    badge: 'Hotmart',
    link: '#',
  },
  {
    icon: Square,
    nombre: 'Blackwork',
    desc: 'Figuras, patrones y composiciones en negro puro.',
    badge: 'Hotmart',
    link: '#',
  },
  {
    icon: Droplet,
    nombre: 'Acuarela',
    desc: 'Color fluido y efectos de pintura que dan vida al diseño.',
    badge: 'Hotmart',
    link: '#',
  },
]

// ── KIT BÁSICO (Amazon / AliExpress) ─────────────────────────────
const kitBasico = [
  {
    icon: Package,
    nombre: 'Máquina tipo pen',
    nota: 'Con batería. La más recomendada para principiantes.',
    amazon: '#',
    aliexpress: '#',
  },
  {
    icon: PenTool,
    nombre: 'Cartuchos pack',
    nota: 'Desechables, compatibles con máquinas pen.',
    amazon: '#',
    aliexpress: '#',
  },
  {
    icon: Droplet,
    nombre: 'Tintas negras',
    nota: 'Empieza con negro antes de experimentar con color.',
    amazon: '#',
    aliexpress: '#',
  },
  {
    icon: Crosshair,
    nombre: 'Piel sintética',
    nota: 'Practica cuanto necesites sin riesgos.',
    amazon: '#',
    aliexpress: '#',
  },
  {
    icon: Hand,
    nombre: 'Bioseguridad',
    nota: 'Guantes, film, jabón — imprescindible desde el día uno.',
    amazon: '#',
    aliexpress: '#',
  },
  {
    icon: FileText,
    nombre: 'Papel stencil',
    nota: 'Transfiere diseños con precisión a la piel.',
    amazon: '#',
    aliexpress: '#',
  },
]

// ── RECURSOS GRATUITOS ────────────────────────────────────────────
const recursosGratuitos = [
  {
    icon: PlayCircle,
    nombre: 'YouTube',
    desc: 'Busca "curso tatuaje principiantes español". Canal Fredy Tattoo, Jesús Navarro.',
  },
  {
    icon: Users,
    nombre: 'Grupos Facebook',
    desc: 'Comunidades de tatuadores colombianos. Consejos, feedback y networking.',
  },
  {
    icon: Camera,
    nombre: 'Instagram',
    desc: 'Sigue tatuadores de tu estilo para inspirarte y aprender viendo su proceso.',
  },
  {
    icon: Monitor,
    nombre: 'Practica primero',
    desc: 'Piel sintética antes de piel real. Mínimo 100 horas de práctica antes de cobrar.',
  },
]

export default function AprendePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Aprende a Tatuar | Cursos, Kit y Recursos — INKognito Supply"
        description="Recursos para aprender a tatuar desde cero. Cursos Hotmart, kit básico en Amazon/AliExpress y recursos gratuitos para principiantes en Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/aprende`}
      />

      <NavbarCategory pageName="Aprende a Tatuar" backPath="/supply" backLabel="Supply" />

      {/* ── HERO COMPACTO ─────────────────────────────────────────── */}
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
            para aprender a tatuar con confianza desde Urabá.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-2 md:mt-4">
        <div className="border-b border-zinc-900" />
      </div>

      {/* ── CURSOS DIGITALES (Hotmart) ────────────────────────────── */}
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
              Formación online certificada. Compra una vez, acceso de por vida.
            </p>
          </div>

          <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
            {cursos.map((c) => {
              const Icon = c.icon
              return (
                <a
                  key={c.nombre}
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="snap-start flex-shrink-0 w-[44vw] md:w-auto border border-zinc-800 bg-zinc-950 rounded-2xl p-5 flex flex-col gap-3 hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.08)] transition-all duration-300"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Icon size={20} className="text-orange-400" strokeWidth={1.5} />
                    <span className="text-[9px] font-black uppercase tracking-widest bg-orange-500/15 text-orange-400 border border-orange-500/30 rounded-full px-2 py-0.5">
                      {c.badge}
                    </span>
                  </div>
                  <h3 className="font-black uppercase text-xs tracking-[0.08em] text-white leading-snug">
                    {c.nombre}
                  </h3>
                  <p className="text-zinc-500 text-[10px] leading-relaxed flex-1">
                    {c.desc}
                  </p>
                  <span className="text-orange-400 text-[10px] font-bold uppercase tracking-[0.15em]">
                    Ver curso →
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        <div className="border-b border-zinc-900" />
      </div>

      {/* ── KIT BÁSICO (Amazon / AliExpress) ─────────────────────── */}
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
              Insumos esenciales disponibles en Amazon y AliExpress.
            </p>
          </div>

          <div className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
            {kitBasico.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.nombre}
                  className="snap-start flex-shrink-0 w-[44vw] md:w-auto border border-zinc-800 bg-zinc-950 rounded-2xl p-4 flex flex-col gap-3 hover:border-zinc-600 transition-all duration-300"
                >
                  <Icon size={18} className="text-zinc-400" strokeWidth={1.5} />
                  <h3 className="font-black uppercase text-[10px] tracking-[0.08em] text-white leading-snug">
                    {item.nombre}
                  </h3>
                  <p className="text-zinc-600 text-[9px] leading-relaxed flex-1">
                    {item.nota}
                  </p>
                  <div className="flex flex-col gap-1.5 mt-auto">
                    <a
                      href={item.amazon}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center text-[9px] font-bold uppercase tracking-widest border border-zinc-700 text-zinc-300 py-1.5 rounded-lg hover:border-zinc-500 hover:text-white transition-all duration-300"
                    >
                      Amazon
                    </a>
                    <a
                      href={item.aliexpress}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center text-[9px] font-bold uppercase tracking-widest border border-zinc-700 text-zinc-300 py-1.5 rounded-lg hover:border-zinc-500 hover:text-white transition-all duration-300"
                    >
                      AliExpress
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        <div className="border-b border-zinc-900" />
      </div>

      {/* ── RECURSOS GRATUITOS ────────────────────────────────────── */}
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
            {recursosGratuitos.map((r) => {
              const Icon = r.icon
              return (
                <div
                  key={r.nombre}
                  className="snap-start flex-shrink-0 w-[44vw] md:w-auto border border-zinc-800 bg-zinc-950 rounded-2xl p-5 flex flex-col gap-3 hover:border-green-500/30 transition-all duration-300"
                >
                  <Icon size={20} className="text-green-400" strokeWidth={1.5} />
                  <h3 className="font-black uppercase text-xs tracking-[0.08em] text-white">
                    {r.nombre}
                  </h3>
                  <p className="text-zinc-500 text-[10px] leading-relaxed flex-1">
                    {r.desc}
                  </p>
                  <span className="text-green-500 text-[10px] font-bold uppercase tracking-[0.15em]">
                    Gratuito ✓
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────── */}
      <section className="pt-3 md:pt-6 pb-12 md:pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="border border-blue-500/20 bg-zinc-950 rounded-2xl p-7 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-500/40 transition-all duration-300">
            <div>
              <p className="uppercase tracking-[0.25em] text-zinc-500 text-[10px] mb-2">
                Próximo paso
              </p>
              <h3 className="text-xl md:text-3xl font-black uppercase leading-tight text-white">
                ¿Ya tienes lo básico?
              </h3>
              <p className="text-zinc-400 mt-2 text-sm">
                Explora nuestro catálogo de insumos profesionales
              </p>
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
