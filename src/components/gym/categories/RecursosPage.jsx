import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import Seo from '../../Seo'
import { FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa'
import { BookOpen } from 'lucide-react'

const GRID_PATTERN = {
  backgroundImage:
    'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(156,163,175,1) 39px,rgba(156,163,175,1) 40px)',
}

const ebooks = [
  {
    id: 1,
    nombre: 'Construye Lo Que Quieres Ser',
    descripcion: 'Hábitos, identidad y disciplina para construir lo que quieres ser, una pequeña acción a la vez.',
    imagen: null,
    pdf: '/ebooks/construye-lo-que-quieres-ser.pdf',
  },
  {
    id: 2,
    nombre: 'Empieza Donde Estás',
    descripcion: 'Tu primer plan de entrenamiento sin equipo, sin excusas y sin gimnasio. Incluye plan de 8 semanas.',
    imagen: null,
    pdf: '/ebooks/empieza-donde-estas.pdf',
  },
]

export default function RecursosPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Recursos Gratis | Ebooks de Entrenamiento y Desarrollo Personal — INKognito Gym"
        description="Descarga gratis ebooks sobre hábitos, disciplina y rutinas de entrenamiento sin equipo. Recursos de INKognito Gym."
        siteName="INKognito Gym"
        canonical={`${import.meta.env.VITE_SITE_URL}/gym/recursos`}
      />

      <NavbarGym />

      {/* HERO */}
      <section className="relative pt-16 md:pt-24 pb-6 md:pb-10 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900" />
        <div className="absolute inset-0 opacity-[0.04]" style={GRID_PATTERN} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen size={18} className="text-gray-600 flex-shrink-0" />
            <p className="uppercase tracking-[0.25em] text-gray-500 text-xs">Descarga gratuita</p>
          </div>
          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-4">
            Recursos<br />
            <span className="text-gray-400">gratuitos</span>
          </h1>
          <p className="text-gray-400 leading-relaxed max-w-2xl">
            No necesitas pagar nada para empezar a cambiar tu vida. Estos recursos nacieron de mi propia experiencia — construyendo mi gym desde cero, entrenando sin equipo, y aprendiendo a base de prueba y error. Si a mí me sirvió, puede servirte a ti también. Descárgalos, úsalos, y empieza donde estás.
          </p>
        </div>
      </section>

      {/* GRID DE EBOOKS */}
      <div className="pb-8 md:pb-14 px-4 md:px-6 max-w-xl mx-auto pt-6 md:pt-8">
        <div className="grid grid-cols-2 gap-3">
          {ebooks.map((eb) => (
            <div
              key={eb.id}
              className="border border-gray-800 bg-gray-800/40 rounded-xl overflow-hidden flex flex-col hover:border-gray-600 transition-all duration-300"
            >
              {/* PORTADA — altura fija 2x (alinea ambas cards) */}
              <div className="relative bg-gray-800 flex items-center justify-center h-36">
                {eb.imagen ? (
                  <img
                    src={eb.imagen}
                    alt={eb.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <span className="text-gray-700 text-[9px] uppercase tracking-widest">Portada próximamente</span>
                )}
              </div>

              {/* INFO — franja izquierda (ícono) + bloque derecho (texto+botón) */}
              <div className="flex flex-1 border-t border-gray-800">

                {/* FRANJA IZQUIERDA: ícono ocupa todo el alto */}
                <div className="flex items-center justify-center w-8 flex-shrink-0 border-r border-gray-800 bg-gray-900/50">
                  <BookOpen size={14} className="text-gray-600" />
                </div>

                {/* BLOQUE DERECHO: título arriba, botón abajo */}
                <div className="p-2 flex flex-col flex-1 min-w-0">
                  <div className="flex-1">
                    <h2 className="font-black uppercase text-[11px] leading-tight mb-1">{eb.nombre}</h2>
                    <p className="text-gray-500 text-[10px] leading-relaxed line-clamp-2">{eb.descripcion}</p>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-gray-800">
                    <a
                      href={eb.pdf}
                      download
                      className="block text-center bg-white text-gray-950 font-black uppercase tracking-[0.1em] text-[10px] py-1.5 rounded-lg hover:bg-gray-200 transition-all duration-300"
                    >
                      Descargar gratis
                    </a>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* SECCIÓN REDES */}
        <div className="mt-8 border-t border-gray-800 pt-8 text-center max-w-xl mx-auto">
          <p className="text-gray-400 leading-relaxed text-sm md:text-base mb-8">
            Si estos recursos te fueron de ayuda, te invito a seguirme en mis redes y a suscribirte a mi canal de YouTube — ahí comparto todo el proceso de construir esto desde cero.
          </p>
          <div className="flex items-center justify-center gap-8">
            <a href="https://www.instagram.com/jhumaneztattoo" target="_blank" rel="noopener noreferrer"
               className="text-gray-500 hover:text-white transition-colors duration-300">
              <FaInstagram size={28} />
            </a>
            <a href="https://www.facebook.com/jhumaneztattoo" target="_blank" rel="noopener noreferrer"
               className="text-gray-500 hover:text-white transition-colors duration-300">
              <FaFacebookF size={28} />
            </a>
            <a href="https://www.youtube.com/@JhumanezZ" target="_blank" rel="noopener noreferrer"
               className="text-gray-500 hover:text-white transition-colors duration-300">
              <FaYoutube size={28} />
            </a>
          </div>
        </div>
      </div>

      <FooterGym />
    </div>
  )
}
