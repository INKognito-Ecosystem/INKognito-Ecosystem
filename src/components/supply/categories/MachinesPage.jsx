import { Link } from 'react-router-dom'
import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import { useSupplyCart } from '../../../contexts/SupplyCartContext'
import Seo from '../../Seo'

const products = [
  { id: 1, name: 'Flux Max', brand: 'FK Irons', price: '$899' },
  { id: 2, name: 'Spektra Xion', brand: 'FK Irons', price: '$750' },
  { id: 3, name: 'Atom X', brand: 'Cheyenne', price: '$620' },
  { id: 4, name: 'Sol Terra', brand: 'Cheyenne', price: '$580' },
  { id: 5, name: 'Dragonfly X2', brand: 'Swashdrive', price: '$420' },
  { id: 6, name: 'Injectra', brand: 'Bishop', price: '$390' },
]

export default function MachinesPage() {
  const { addItem } = useSupplyCart()
  return (
  <>
    <Seo
      title="Máquinas para tatuar | INKognito Supply — Urabá"
      description="FK Irons, Cheyenne, Bishop y Swashdrive. Máquinas rotativas tipo pen para artistas profesionales en Urabá. Consulta disponibilidad y despacho a otras ciudades de Colombia."
      siteName="INKognito Supply"
      canonical={`${import.meta.env.VITE_SITE_URL}/supply/machines`}
    />
    <div className="min-h-screen bg-black text-white">

      <NavbarCategory pageName="Máquinas" />

      {/* CONTENIDO */}
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">

        {/* TITULO */}
        <div className="mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-sm mb-4">
            Categoría
          </p>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none">
            máquinas
          </h1>

          <div className="mt-10 max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-5">
              Para un artista del tatuaje, la máquina es una extensión de su propia mano. La evolución tecnológica ha transformado las herramientas tradicionales de bobinas en sistemas rotativos de alta precisión y pen inalámbricas que ofrecen total libertad de movimiento, ergonomía impecable y un control absoluto sobre el voltaje y el golpeo.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-5">
              En INKognito Supply disponemos de un catálogo curado con las marcas más prestigiosas de la industria, como FK Irons, Cheyenne, Bishop y Swashdrive. Cada máquina está diseñada con ingeniería de precisión para garantizar la máxima consistencia en líneas, sombras suaves o rellenos de color sólido.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Encuentra la máquina perfecta adaptada a tu estilo, ya sea que busques el control y potencia de la Flux Max, la versatilidad de la Spektra Xion, o la fiabilidad legendaria de los sistemas Cheyenne, asegurando resultados impecables y minimizando el trauma en la piel del cliente.
            </p>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-zinc-800 bg-zinc-950 rounded-xl md:rounded-2xl overflow-hidden hover:border-zinc-600 transition-all duration-300"
            >
              <div className="aspect-square bg-zinc-900 relative overflow-hidden flex items-center justify-center">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                )}
                <p className="text-zinc-700 uppercase tracking-[0.3em] text-xs md:text-sm">
                  Product Image
                </p>
              </div>
              <div className="p-4 md:p-6">
                <p className="text-zinc-500 uppercase tracking-[0.25em] text-[10px] md:text-xs mb-1 md:mb-2">
                  {product.brand}
                </p>
                <h3 className="text-lg md:text-2xl font-black uppercase mb-3 md:mb-4">
                  {product.name}
                </h3>
                <span className="text-white font-bold text-base md:text-xl block mb-3">
                  {product.price}
                </span>
                <button
                  onClick={() => addItem(product, 'machines')}
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
                ¿Cuál es la diferencia entre una máquina de tatuaje rotativa y una de bobinas?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Las máquinas de bobinas utilizan campos electromagnéticos para mover la aguja y son muy tradicionales y ruidosas, mientras que las rotativas utilizan motores eléctricos pequeños que ofrecen un funcionamiento continuo, silencioso, menor vibración, y gran ligereza, siendo perfectas para cartuchos.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Qué es el stroke o recorrido de una máquina de tatuar?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Es la distancia que recorre la aguja desde su punto más alto hasta el más bajo. Un stroke corto (2.5 mm a 3.0 mm) es ideal para sombras suaves; un stroke medio (3.5 mm) es versátil para todo; y un stroke largo (4.0 mm o más) ofrece el golpe fuerte necesario para líneas sólidas y empaque de color.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Son mejores las máquinas tipo "pen" inalámbricas?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Las máquinas inalámbricas tipo pen eliminan los cables de clip cord y pedales, ofreciendo máxima ergonomía, facilidad de embolsado higiénico y total libertad de movimiento, lo que reduce la fatiga del artista durante sesiones largas.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cómo se realiza el mantenimiento a una máquina rotativa?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                La mayoría de las máquinas rotativas modernas tipo pen tienen motores sellados que no requieren lubricación interna. El mantenimiento se centra en la limpieza externa con desinfectantes de grado hospitalario y el uso de fundas protectoras desechables en cada sesión.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Qué marcas de máquinas de tatuar profesionales ofrecen en INKognito?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Contamos con marcas líderes de renombre internacional como FK Irons, Cheyenne, Bishop y Swashdrive, garantizando productos originales con garantía de fábrica y un rendimiento superior.
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