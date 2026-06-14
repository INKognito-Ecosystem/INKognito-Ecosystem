import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import Seo from '../../Seo'

const videos = [
  {
    id: 1,
    titulo: 'Cómo fabricar mancuernas caseras',
    descripcion: 'Proceso completo con materiales accesibles y herramientas básicas.',
    src: '#',
  },
  {
    id: 2,
    titulo: 'Discos de cemento para entrenamiento',
    descripcion: 'Fabrica discos resistentes y económicos para tu gym en casa.',
    src: '#',
  },
  {
    id: 3,
    titulo: 'Banco de press con madera y acero',
    descripcion: 'Construcción paso a paso de un banco resistente y duradero.',
    src: '#',
  },
  {
    id: 4,
    titulo: 'Estructura para dominadas',
    descripcion: 'Cómo soldar y ensamblar un marco de dominadas seguro y estable.',
    src: '#',
  },
  {
    id: 5,
    titulo: 'Barra olímpica artesanal',
    descripcion: 'Fabricación de una barra de entrenamiento con materiales locales.',
    src: '#',
  },
  {
    id: 6,
    titulo: 'Jalones al pecho desde cero',
    descripcion: 'Tutorial completo para construir una máquina de jalones con polea.',
    src: '#',
  },
]

export default function VideosTutorialesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Seo
        title="Cómo Fabricar Máquinas de Gym | Tutoriales Profesionales — Colombia"
        description="Videos de fabricación de equipos de gym con soldadura: mancuernas, discos, barras y máquinas. Canal de Jose Humanez en YouTube."
        siteName="INKognito Gym"
        canonical={`${import.meta.env.VITE_SITE_URL}/gym/tutoriales`}
      />

      <NavbarGym />

      <div className="pt-28 md:pt-36 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-12 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-gray-500 text-xs md:text-sm mb-3">YouTube</p>
          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-6">
            Tutoriales<br />
            <span className="text-gray-400">en video</span>
          </h1>
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <p className="text-gray-400 leading-relaxed max-w-2xl">
              Videos paso a paso de cómo construir equipos de gym caseros. Los videos se reproducen directamente desde YouTube.
            </p>
            <a
              href="https://www.youtube.com/@JhumanezZ"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 border border-gray-700 text-gray-300 text-xs font-bold uppercase tracking-[0.2em] py-3 px-5 rounded hover:border-gray-400 hover:text-white transition-all duration-300"
            >
              Ver canal completo
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((v) => (
            <div
              key={v.id}
              className="border border-gray-800 bg-gray-800/40 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300"
            >
              <div className="relative w-full aspect-video bg-gray-800">
                {v.src === '#' ? (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                    <span className="text-xs uppercase tracking-widest">Próximamente</span>
                  </div>
                ) : (
                  <iframe
                    src={v.src}
                    title={v.titulo}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
              <div className="p-5">
                <h3 className="font-black uppercase text-sm mb-2 leading-tight">{v.titulo}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{v.descripcion}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      <FooterGym />
    </div>
  )
}
