import { Link } from 'react-router-dom'
import NavbarCategory from './NavbarCategory'
import FooterSupply from './FooterSupply'
import Seo from '../Seo'

const cursos = [
  {
    nombre: 'Para principiantes absolutos',
    descripcion: 'Aprende desde cero: ergonomía, líneas rectas, sombras básicas y normas de bioseguridad.',
  },
  {
    nombre: 'Realismo',
    descripcion: 'Técnicas avanzadas de sombreado, contraste y textura para recrear imágenes hiperrealistas.',
  },
  {
    nombre: 'Línea fina',
    descripcion: 'Domina el trazo delicado, la presión exacta y los diseños de alta precisión.',
  },
  {
    nombre: 'Blackwork y Geométrico',
    descripcion: 'Figuras, patrones y composiciones en negro puro con impacto visual inmediato.',
  },
  {
    nombre: 'Acuarela',
    descripcion: 'Color fluido, manchas y efectos de pintura que dan vida a diseños únicos.',
  },
]

const kitBasico = [
  {
    nombre: 'Máquina rotativa tipo pen (con batería)',
    nota: 'Lo más recomendado para principiantes hoy',
    amazon: '#',
    aliexpress: '#',
  },
  {
    nombre: 'Cartuchos desechables (pack)',
    nota: 'Compatibles con la mayoría de máquinas pen',
    amazon: '#',
    aliexpress: '#',
  },
  {
    nombre: 'Tintas básicas (negro)',
    nota: 'Empieza con negro antes de experimentar con color',
    amazon: '#',
    aliexpress: '#',
  },
  {
    nombre: 'Piel sintética para practicar',
    nota: 'Practica cuanto necesites sin riesgos',
    amazon: '#',
    aliexpress: '#',
  },
  {
    nombre: 'Kit de bioseguridad (guantes, film, jabón)',
    nota: 'Imprescindible desde el primer día',
    amazon: '#',
    aliexpress: '#',
  },
  {
    nombre: 'Papel stencil',
    nota: 'Para transferir diseños con precisión a la piel',
    amazon: '#',
    aliexpress: '#',
  },
]

const recursosGratuitos = [
  'YouTube: busca "curso tatuaje principiantes español"',
  'Grupos de Facebook de tatuadores colombianos',
  'Practica en piel sintética antes de tatuar piel real',
  'Instagram: sigue a tatuadores de tu estilo para inspirarte',
]

export default function AprendePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Aprende a Tatuar | Cursos y Kit Básico — INKognito Supply"
        description="Recursos para aprender a tatuar desde cero. Cursos de realismo, línea fina, blackwork y más. Kit básico de insumos para principiantes en Urabá y Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/aprende`}
      />

      <NavbarCategory pageName="Aprende a Tatuar" />

      {/* HERO */}
      <section className="pt-32 md:pt-40 pb-16 px-4 md:px-6 max-w-7xl mx-auto">
        <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
          Recursos para principiantes
        </p>
        <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-6">
          Empieza tu camino<br />
          <span className="text-zinc-500">como tatuador</span>
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
          Todo lo que necesitas para dar tus primeros pasos: cursos recomendados, el kit básico de insumos
          y recursos gratuitos para aprender a tatuar con confianza.
        </p>
      </section>

      {/* CURSOS RECOMENDADOS */}
      <section className="pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="border-t border-zinc-900 pt-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Formación
          </p>
          <h2 className="text-3xl md:text-5xl font-black uppercase leading-none mb-12">
            Cursos recomendados
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cursos.map((curso) => (
              <div
                key={curso.nombre}
                className="border border-zinc-800 bg-zinc-950 rounded-2xl p-6 flex flex-col gap-4 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.08)] transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-black uppercase tracking-wide leading-tight">
                    {curso.nombre}
                  </h3>
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest bg-orange-500/15 text-orange-400 border border-orange-500/30 rounded-full px-3 py-1">
                    Hotmart
                  </span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                  {curso.descripcion}
                </p>
                <a
                  href="#"
                  className="mt-auto inline-block text-center border border-blue-500/40 text-blue-400 text-xs font-bold uppercase tracking-[0.2em] py-3 px-4 rounded-xl hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300"
                >
                  Ver curso →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KIT BÁSICO */}
      <section className="pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="border-t border-zinc-900 pt-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Equipamiento
          </p>
          <h2 className="text-3xl md:text-5xl font-black uppercase leading-none mb-4">
            Kit básico para empezar
          </h2>
          <p className="text-zinc-400 text-base max-w-xl mb-12">
            Estos son los insumos esenciales que todo principiante necesita. Puedes conseguirlos en Amazon o AliExpress.
          </p>

          {/* CARD DESTACADO */}
          <div className="mb-5 border border-blue-500/50 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-7 md:p-8 shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] hover:border-blue-500 transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-wide leading-tight">
                    Kit Completo Principiante
                  </h3>
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full px-3 py-1">
                    Recomendado
                  </span>
                </div>
                <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-2xl">
                  Todo lo que necesitas en un solo pedido: máquina tipo pen, cartuchos, tintas,
                  piel sintética y bioseguridad básica. La opción más fácil para empezar.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row md:flex-col gap-3 md:w-48 shrink-0">
                <a
                  href="#"
                  className="text-center text-xs font-black uppercase tracking-[0.15em] border border-blue-500/50 text-blue-300 py-3 px-5 rounded-xl hover:border-blue-400 hover:bg-blue-500/15 hover:text-blue-200 transition-all duration-300"
                >
                  Ver en Amazon →
                </a>
                <a
                  href="#"
                  className="text-center text-xs font-black uppercase tracking-[0.15em] border border-zinc-600 text-zinc-300 py-3 px-5 rounded-xl hover:border-zinc-400 hover:text-white transition-all duration-300"
                >
                  Ver en AliExpress →
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {kitBasico.map((item) => (
              <div
                key={item.nombre}
                className="border border-zinc-800 bg-zinc-950 rounded-2xl p-6 flex flex-col gap-4 hover:border-zinc-600 transition-all duration-300"
              >
                <h3 className="text-sm font-black uppercase tracking-wide leading-snug">
                  {item.nombre}
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed flex-1">
                  {item.nota}
                </p>
                <div className="flex gap-3 mt-auto">
                  <a
                    href={item.amazon}
                    className="flex-1 text-center text-xs font-bold uppercase tracking-widest border border-zinc-700 text-zinc-300 py-2 px-3 rounded-lg hover:border-zinc-400 hover:text-white transition-all duration-300"
                  >
                    Amazon
                  </a>
                  <a
                    href={item.aliexpress}
                    className="flex-1 text-center text-xs font-bold uppercase tracking-widest border border-zinc-700 text-zinc-300 py-2 px-3 rounded-lg hover:border-zinc-400 hover:text-white transition-all duration-300"
                  >
                    AliExpress
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECURSOS GRATUITOS */}
      <section className="pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="border-t border-zinc-900 pt-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Sin costo
          </p>
          <h2 className="text-3xl md:text-5xl font-black uppercase leading-none mb-10">
            Recursos gratuitos
          </h2>

          <ul className="space-y-4 max-w-2xl">
            {recursosGratuitos.map((item) => (
              <li key={item} className="flex items-start gap-4">
                <span className="text-blue-500 text-xl mt-0.5">→</span>
                <span className="text-zinc-300 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="pb-24 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="border border-blue-500/20 bg-zinc-950 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-500/40 transition-all duration-300">
          <div>
            <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs mb-2">
              Próximo paso
            </p>
            <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight">
              ¿Ya tienes lo básico?
            </h3>
            <p className="text-zinc-400 mt-2">
              Explora nuestro catálogo de insumos profesionales
            </p>
          </div>
          <Link
            to="/supply"
            className="shrink-0 border border-blue-500/50 text-blue-400 text-sm font-black uppercase tracking-[0.2em] py-4 px-8 rounded-xl hover:border-blue-500 hover:bg-blue-500/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 whitespace-nowrap"
          >
            Ver catálogo completo →
          </Link>
        </div>
      </section>

      <FooterSupply />
    </div>
  )
}
