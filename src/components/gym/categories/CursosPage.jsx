import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import Seo from '../../Seo'
import { GraduationCap } from 'lucide-react'

const cursos = [
  {
    nombre: 'Entrenamiento en casa',
    descripcion: 'Rutinas completas para ganar músculo y perder grasa sin necesidad de ir al gimnasio. Progresión sin equipo o con equipamiento mínimo.',
  },
  {
    nombre: 'Nutrición básica',
    descripcion: 'Aprende a comer bien para tus objetivos: masa muscular, definición o rendimiento deportivo. Sin extremos ni dietas de moda.',
  },
  {
    nombre: 'Desarrollo personal',
    descripcion: 'Disciplina mental, hábitos y productividad aplicados al entrenamiento y la vida cotidiana. La base de cualquier transformación real.',
  },
  {
    nombre: 'Soldadura y fabricación',
    descripcion: 'Aprende las bases de soldadura para fabricar tus propias máquinas y estructuras de acero en casa. Un nicho único que pocos enseñan.',
  },
]

export default function CursosPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Cursos de Entrenamiento en Casa y Fitness | Colombia"
        description="Cursos recomendados de entrenamiento en casa, nutrición y desarrollo personal. Selección de los mejores cursos en español disponibles en Hotmart."
        siteName="INKognito Gym"
        canonical={`${import.meta.env.VITE_SITE_URL}/gym/cursos`}
      />

      <NavbarGym />

      {/* HERO */}
      <section className="relative pt-16 md:pt-24 pb-6 md:pb-10 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-0">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
              Cursos<br />
              <span className="text-gray-400">recomendados</span>
            </h1>
            <GraduationCap size={56} className="text-gray-800 flex-shrink-0 md:hidden" strokeWidth={1} />
          </div>
          <p className="text-gray-400 leading-relaxed max-w-2xl">
            Selección de los mejores cursos en español para entrenarte en casa, mejorar tu alimentación y aprender a fabricar tus propios equipos.
          </p>
        </div>
        </div>
      </section>

      <div className="pb-8 md:pb-14 px-4 md:px-6 max-w-7xl mx-auto pt-6 md:pt-8">
        <div className="flex md:grid md:grid-cols-2 gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
          {cursos.map((curso) => (
            <div
              key={curso.nombre}
              className="snap-start flex-shrink-0 w-[72vw] md:w-auto border border-gray-800 bg-gray-800/40 rounded-2xl p-5 flex flex-col gap-3 hover:border-gray-600 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-black uppercase tracking-wide leading-tight">{curso.nombre}</h3>
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest bg-orange-500/15 text-orange-400 border border-orange-500/30 rounded-full px-3 py-1">
                  Hotmart
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed flex-1">{curso.descripcion}</p>
              <a
                href="#"
                className="mt-auto inline-block text-center border border-gray-600 text-gray-300 text-xs font-bold uppercase tracking-[0.2em] py-3 px-4 rounded-xl hover:border-gray-300 hover:text-white transition-all duration-300"
              >
                Ver curso →
              </a>
            </div>
          ))}
        </div>

      </div>

      <FooterGym />
    </div>
  )
}
