import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import Seo from '../../Seo'

const maquinas = [
  {
    id: 1,
    nombre: 'Jalones al pecho',
    descripcion: 'Estructura con polea para jalón vertical. Ideal para trabajar dorsales, bíceps y espalda alta.',
  },
  {
    id: 2,
    nombre: 'Banco estático',
    descripcion: 'Banco plano resistente para press, remo y variaciones de bíceps. Construcción en acero.',
  },
  {
    id: 3,
    nombre: 'Banco multiángulo',
    descripcion: 'Ajustable a plano, inclinado y declinado. Versátil para todo el tren superior con mancuernas o barra.',
  },
  {
    id: 4,
    nombre: 'Extensión de cuádriceps con discos',
    descripcion: 'Máquina de extensión de pierna con carga de discos. Aísla el cuádriceps con seguridad.',
  },
  {
    id: 5,
    nombre: 'Femorales acostado con discos',
    descripcion: 'Máquina de curl femoral acostado para trabajar la parte posterior del muslo y los isquiotibiales.',
  },
  {
    id: 6,
    nombre: 'Rack para press plano',
    descripcion: 'Soporte seguro para press de banca con barra. Incluye topes de seguridad regulables.',
  },
  {
    id: 7,
    nombre: 'Banco para press inclinado',
    descripcion: 'Banco fijo con inclinación para press y mancuernas inclinadas. Mayor activación del pecho superior.',
  },
  {
    id: 8,
    nombre: 'Banco para remos',
    descripcion: 'Banco tipo Scott adaptado para ejercicios de remo y trabajo de espalda con apoyo de pecho.',
  },
  {
    id: 9,
    nombre: 'Banco para bíceps',
    descripcion: 'Banco tipo predicador para curl concentrado y bíceps con barra. Aísla el bíceps completamente.',
  },
  {
    id: 10,
    nombre: 'Estructura para dominadas',
    descripcion: 'Marco fijo de acero para dominadas amplias, neutras y cerradas. Soporta altos niveles de carga.',
  },
]

export default function MaquinasPedidoPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Seo
        title="Máquinas de Gym Bajo Pedido | Fabricación Artesanal — Envío a Colombia"
        description="Racks, bancos multiángulo, jalones, extensiones y más. Fabricadas con soldadura profesional en Urabá. Envío por transportadora a toda Colombia. Cotiza por WhatsApp."
        siteName="INKognito Gym"
        canonical={`${import.meta.env.VITE_SITE_URL}/gym/maquinas-pedido`}
      />

      <NavbarGym />

      <div className="pt-28 md:pt-36 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-12 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-gray-500 text-xs md:text-sm mb-3">
            Fabricación artesanal
          </p>
          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-6">
            Máquinas<br />
            <span className="text-gray-400">bajo pedido</span>
          </h1>
          <p className="text-gray-400 leading-relaxed max-w-2xl mb-6">
            Fabricamos equipos de gym artesanalmente en Urabá, Antioquia. Cada máquina se construye con acero de calidad y se ajusta a tus necesidades específicas.
          </p>

          {/* NOTA INFORMATIVA */}
          <div className="border border-gray-700 bg-gray-800/50 rounded-xl p-5 max-w-2xl">
            <p className="text-gray-400 text-sm leading-relaxed">
              <span className="font-bold text-white">Nota:</span>{' '}
              Fabricamos en Urabá con envíos a nivel nacional por transportadora (Servientrega, Coordinadora). El flete corre por cuenta del cliente.
            </p>
          </div>
        </div>

        {/* GRID DE MÁQUINAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {maquinas.map((m) => (
            <div
              key={m.id}
              className="border border-gray-800 bg-gray-800/40 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300 flex flex-col"
            >
              <div className="aspect-square bg-gray-800 flex items-center justify-center">
                <span className="text-gray-700 text-xs uppercase tracking-widest text-center px-6">
                  Foto próximamente
                </span>
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-700 text-gray-400 rounded-full px-3 py-1">
                    Bajo pedido
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-700 text-gray-400 rounded-full px-3 py-1">
                    Envío nacional
                  </span>
                </div>
                <h3 className="font-black uppercase text-base leading-tight">{m.nombre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{m.descripcion}</p>
                <a
                  href={`https://wa.me/573207911013?text=Hola,%20me%20interesa%20cotizar%20la%20m%C3%A1quina:%20${encodeURIComponent(m.nombre)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto block text-center border border-gray-600 text-gray-300 text-xs font-bold uppercase tracking-[0.15em] py-3 rounded-xl hover:border-gray-300 hover:text-white transition-all duration-300"
                >
                  Cotizar por WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>

      <FooterGym />
    </div>
  )
}
