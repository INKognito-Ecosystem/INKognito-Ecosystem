import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import { useSupplyCart } from '../../../contexts/SupplyCartContext'

const products = [
  { id: 1, name: 'Tattoo Chair', brand: 'TATSoul', price: '$850' },
  { id: 2, name: 'Client Bed', brand: 'TATSoul', price: '$1200' },
  { id: 3, name: 'Artist Stool', brand: 'Mast', price: '$180' },
  { id: 4, name: 'Workstation Cart', brand: 'Peak', price: '$240' },
  { id: 5, name: 'Arm Rest Pro', brand: 'InkBed', price: '$160' },
  { id: 6, name: 'Portable Table', brand: 'EZ Tattoo', price: '$320' },
]

export default function FurniturePage() {
  const { addItem } = useSupplyCart()
  return (
    <div className="min-h-screen bg-black text-white">

      <NavbarCategory pageName="Mobiliario" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Categoría
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            Mobiliario
          </h1>

          <div className="mt-10 max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-5">
              La ergonomía y la comodidad del artista y del cliente son fundamentales durante largas jornadas de trabajo. Invertir en mobiliario profesional diseñado específicamente para estudios de tatuajes no solo previene problemas posturales crónicos en el tatuador, sino que mejora la experiencia del cliente y la precisión de cada trazo.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-5">
              En INKognito Supply distribuimos mobiliario de alta gama de marcas referentes como TATSoul, Mast, Peak e InkBed. Nuestra selección incluye camillas multiposición para clientes, sillas ergonómicas para artistas, carros de trabajo de alta resistencia, apoyabrazos robustos ajustables y mesas portátiles.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Construye un estudio moderno, seguro y sumamente profesional con mobiliario de alta durabilidad, tapizados de grado médico fáciles de desinfectar y mecanismos hidráulicos fluidos que se adaptan a cualquier ángulo y zona del cuerpo a tatuar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">

          {products.map((product) => (
            <div
              key={product.id}
              className="border border-zinc-800 bg-zinc-950 rounded-xl md:rounded-2xl overflow-hidden hover:border-zinc-600 transition-all duration-300"
            >
              <div className="h-40 md:h-64 bg-zinc-900 flex items-center justify-center">
                <p className="text-zinc-700 uppercase tracking-[0.3em] text-xs md:text-sm">
                  Product Image
                </p>
              </div>

              <div className="p-4 md:p-6">
                <p className="text-zinc-500 uppercase tracking-[0.2em] text-xs mb-1">
                  {product.brand}
                </p>

                <h3 className="text-lg md:text-2xl font-black uppercase mb-3">
                  {product.name}
                </h3>

                <span className="text-white font-bold text-base md:text-xl block mb-3">
                  {product.price}
                </span>
                <button
                  onClick={() => addItem(product, 'furniture')}
                  className="w-full py-2 border border-zinc-700 uppercase tracking-[0.15em] text-xs hover:border-blue-500 hover:text-blue-500 transition-all duration-300"
                >
                  + Agregar al carrito
                </button>

              </div>
            </div>
          ))}

        </div>

        <section className="mt-24 md:mt-32">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-10">
            Preguntas frecuentes
          </h2>

          <div className="space-y-6">
            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Por qué usar una camilla de tatuajes profesional en lugar de una común?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Las camillas de tatuaje profesionales (como las de TATSoul) permiten ajustar de forma independiente el respaldo, los reposapiernas y la altura hidráulica, además de contar con soportes desmontables que facilitan colocar al cliente en las posiciones óptimas para tatuar zonas difíciles como la espalda, costillas o piernas.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Qué características debe tener la silla del artista?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Debe ofrecer un excelente soporte lumbar, ajuste de altura neumático y ruedas de deslizamiento suave. Algunas cuentan con soporte para el pecho, lo que reduce drásticamente la tensión en la espalda al inclinarse hacia adelante durante sesiones prolongadas.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Qué ventajas ofrece un apoyabrazos profesional ajustable?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Un apoyabrazos profesional tiene una base pesada y estable que no tambalea, un cojín ajustable en altura e inclinación con rótula de 360 grados, y un tapizado resistente al desgaste que permite al cliente descansar la extremidad con firmeza y comodidad.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cómo se deben desinfectar los tapizados del mobiliario de tatuaje?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Se deben limpiar con desinfectantes de grado médico u hospitalario que no contengan alcoholes corrosivos que dañen el vinilo o cuero sintético a largo plazo, asegurando la eliminación completa de patógenos entre cada cliente.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Son seguras las mesas portátiles para eventos o convenciones?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Sí, nuestras mesas portátiles están fabricadas con estructuras de aluminio o acero reforzado que soportan cargas elevadas de peso, a la vez que son ligeras, fáciles de plegar y transportar en estuches protectores.
              </p>
            </div>
          </div>
        </section>

      </div>

      <FooterSupply />

    </div>
  )
}