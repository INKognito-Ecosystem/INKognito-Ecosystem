import NavbarGym from '../NavbarGym'
import FooterGym from '../FooterGym'
import Seo from '../../Seo'

const planos = []

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Seo
        title="Planos Técnicos de Máquinas de Gym | Descarga Digital — Colombia"
        description="Planos profesionales en PDF para fabricar tus propias máquinas de gym. Diseños probados y funcionales. Descarga inmediata. Disponibles para toda Colombia."
        siteName="INKognito Gym"
        canonical={`${import.meta.env.VITE_SITE_URL}/gym/planos`}
      />

      <NavbarGym />

      <div className="pt-28 md:pt-36 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-12 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-gray-500 text-xs md:text-sm mb-3">
            Descarga digital
          </p>
          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-6">
            Planos<br />
            <span className="text-gray-400">digitales</span>
          </h1>
          <p className="text-gray-400 leading-relaxed max-w-2xl">
            Planos en PDF con medidas exactas, cortes y lista de materiales para que puedas fabricar tus propias máquinas de gym en casa. Descarga inmediata tras la compra.
          </p>
        </div>

        {planos.length === 0 ? (
          <div className="border border-gray-800 bg-gray-800/20 rounded-2xl py-24 md:py-32 text-center">
            <p className="text-gray-500 uppercase tracking-[0.25em] text-sm mb-2">Próximamente</p>
            <p className="text-gray-600 text-sm">Estamos preparando los primeros planos digitales</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {planos.map((plano) => (
              <div
                key={plano.nombre}
                className="border border-gray-800 bg-gray-800/40 rounded-2xl p-6 flex flex-col gap-4 hover:border-gray-600 transition-all duration-300"
              >
                <h3 className="font-black uppercase text-base">{plano.nombre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{plano.descripcion}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-white font-black text-lg">
                    {plano.precio ?? 'Próximamente'}
                  </span>
                  <button className="border border-gray-600 text-gray-300 text-xs font-bold uppercase tracking-[0.15em] py-2 px-4 rounded-lg hover:border-gray-300 hover:text-white transition-all duration-300">
                    Descargar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <FooterGym />
    </div>
  )
}
