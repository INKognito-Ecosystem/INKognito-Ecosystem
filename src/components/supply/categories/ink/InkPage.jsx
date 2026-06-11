import { Link } from 'react-router-dom'
import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import { useSupplyCart } from '../../../../contexts/SupplyCartContext'

const products = [
  {
    id: 1,
    name: 'Vice Colors Set',
    brand: 'Vice',
    price: '$30',
    link: '/supply/ink/vice-colors'
  },
  {
    id: 2,
    name: 'Dynamic Color Set',
    brand: 'Dynamic',
    price: '$20',
    link: '/supply/ink/dynamic'
  },
  {
    id: 3,
    name: 'Eternal Ink Set',
    brand: 'Eternal',
    price: '$35',
    link: '/supply/ink/eternal'
  },
  {
    id: 4,
    name: 'Fusion Ink Set',
    brand: 'Fusion',
    price: '$28',
    link: '/supply/ink/fusion'
  },
  {
    id: 5,
    name: 'World Famous Set',
    brand: 'World Famous',
    price: '$30',
    link: '/supply/ink/world-famous'
  },
  {
    id: 6,
    name: 'Solid Ink Set',
    brand: 'Solid Ink',
    price: '$22',
    link: '/supply/ink/solid-ink'
  },
  {
    id: 7,
    name: 'Intenze Ink Set',
    brand: 'Intenze',
    price: '$25',
    link: '/supply/ink/intenze'
  },
]

export default function InkPage() {
  const { addItem } = useSupplyCart()
  return (
    <>
      <div className="min-h-screen bg-black text-white">

        <NavbarCategory pageName="Tintas" />

        <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

          <div className="mb-10 md:mb-16">

            <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
              Categoría
            </p>

            <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
              Tintas
            </h1>

            <div className="mt-10 max-w-4xl">

              <p className="text-zinc-400 leading-relaxed mb-5">
                Las tintas para tatuaje son uno de los elementos más importantes
                en el resultado final de cualquier trabajo. La calidad del
                pigmento influye directamente en la saturación, cicatrización
                y permanencia del tatuaje.
              </p>

              <p className="text-zinc-400 leading-relaxed mb-5">
                En INKognito Supply reunimos algunas de las marcas más utilizadas
                por artistas profesionales alrededor del mundo, incluyendo
                Dynamic, Eternal Ink, Fusion, World Famous, Solid Ink,
                Intenze y Vice Colors.
              </p>

              <p className="text-zinc-400 leading-relaxed">
                Explora cada marca para descubrir sus líneas de color, negros,
                greywash, tonos piel y configuraciones especializadas para
                realismo, black and grey, color sólido y estilos de alta
                saturación.
              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">

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
                  <div className="flex gap-2">
                    <Link
                      to={product.link}
                      className="flex-1 py-2 text-center border border-zinc-700 uppercase tracking-[0.15em] text-xs hover:border-white hover:text-white transition-all duration-300"
                    >
                      Ver
                    </Link>
                    <button
                      onClick={() => addItem(product, 'ink')}
                      className="flex-1 py-2 border border-zinc-700 uppercase tracking-[0.15em] text-xs hover:border-blue-500 hover:text-blue-500 transition-all duration-300"
                    >
                      + Agregar al carrito
                    </button>
                  </div>

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
                  ¿Cuál es la mejor tinta para tatuar?
                </h3>

                <p className="text-zinc-400 leading-relaxed">
                  No existe una única respuesta. Dynamic, Eternal, Fusion,
                  World Famous y Solid Ink son algunas de las marcas más
                  utilizadas por tatuadores profesionales dependiendo del
                  estilo de trabajo.
                </p>

              </div>

              <div className="border border-zinc-800 rounded-xl p-6">

                <h3 className="font-bold text-lg mb-3">
                  ¿Qué tinta utilizan los tatuadores profesionales?
                </h3>

                <p className="text-zinc-400 leading-relaxed">
                  Las marcas más populares incluyen Dynamic, Eternal Ink,
                  World Famous, Fusion, Solid Ink, Intenze y Vice Colors.
                </p>

              </div>

              <div className="border border-zinc-800 rounded-xl p-6">

                <h3 className="font-bold text-lg mb-3">
                  ¿Cuál es la mejor tinta para realismo?
                </h3>

                <p className="text-zinc-400 leading-relaxed">
                  Para realismo suelen utilizarse negros sólidos, greywash
                  y tonos piel de marcas como Dynamic, Eternal, World Famous,
                  Fusion y vice colors
                </p>

              </div>

              <div className="border border-zinc-800 rounded-xl p-6">

                <h3 className="font-bold text-lg mb-3">
                  ¿Cuál es la mejor tinta para color?
                </h3>

                <p className="text-zinc-400 leading-relaxed">
                  World Famous, Solid Ink, Eternal y Vice Colors destacan
                  por su saturación y variedad cromática para trabajos
                  a color.
                </p>

              </div>

              <div className="border border-zinc-800 rounded-xl p-6">

                <h3 className="font-bold text-lg mb-3">
                  ¿Las tintas para tatuaje son seguras?
                </h3>

                <p className="text-zinc-400 leading-relaxed">
                  Sí, siempre que provengan de fabricantes reconocidos y
                  distribuidores confiables que trabajen con productos
                  originales.
                </p>

              </div>

            </div>

          </section>

        </div>

      </div>

      <FooterSupply />

    </>
  )
}