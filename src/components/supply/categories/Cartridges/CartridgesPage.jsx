import { Link } from 'react-router-dom'
import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import { useSupplyCart } from '../../../../contexts/SupplyCartContext'
import Seo from '../../../Seo'

const products = [
{
id: 1,
name: 'EZ Cartridge',
brand: 'EZ Tattoo',
price: '$32',
link: '/supply/cartridges/ez-tattoo'
},
{
id: 2,
name: 'WJX Pro Cartridge',
brand: 'WJX',
price: '$28',
link: '/supply/cartridges/wjx'
},
{
id: 3,
name: 'Kwadron',
brand: 'Kwadron',
price: '$55',
link: '/supply/cartridges/kwadron'
}
]

export default function CartridgesPage() {
  const { addItem } = useSupplyCart()
return (
<>
  <Seo
    title="Cartuchos de tatuaje | INKognito Supply — Urabá"
    description="Cartuchos EZ, WJX y Kwadron para todos los estilos. Compatibles con máquinas tipo pen. Disponibles en Urabá, despacho a otras ciudades de Colombia por solicitud."
    siteName="INKognito Supply"
  />
  <div className="min-h-screen bg-black text-white">

    <NavbarCategory pageName="Cartuchos" />

    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">

      <div className="mb-16">
        <p className="uppercase tracking-[0.25em] text-zinc-500 text-sm mb-4">
          Categoría
        </p>

        <h1 className="text-5xl md:text-7xl font-black uppercase leading-none">
          Cartuchos
        </h1>

        <div className="mt-10 max-w-4xl">
          <p className="text-zinc-400 leading-relaxed mb-5">
            Los cartuchos de tatuaje se han convertido en la herramienta preferida por los tatuadores profesionales debido a su comodidad, higiene y precisión superior. A diferencia de las agujas de varilla tradicionales, los cartuchos permiten un intercambio de configuraciones rápido y seguro durante la sesión.
          </p>
          <p className="text-zinc-400 leading-relaxed mb-5">
            En INKognito Supply ofrecemos cartuchos de marcas líderes en la industria como EZ, WJX y Kwadron. Cada una destaca por sus sistemas de estabilización de aguja, membranas de seguridad elásticas que evitan el reflujo de tinta y materiales de grado médico de máxima esterilización.
          </p>
          <p className="text-zinc-400 leading-relaxed">
            Ya sea que necesites configuraciones Round Liner para líneas ultrafinas, Magnum para rellenos densos, o Curved Magnum para transiciones de sombreado sumamente suaves, aquí encontrarás el cartucho idóneo para elevar tu precisión y llevar tus técnicas al siguiente nivel.
          </p>
        </div>
      </div>

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
              <div className="flex gap-2">
                <Link
                  to={product.link}
                  className="flex-1 py-2 text-center border border-zinc-700 uppercase tracking-[0.15em] text-xs hover:border-white hover:text-white transition-all duration-300"
                >
                  Ver
                </Link>
                <button
                  onClick={() => addItem(product, 'cartridges')}
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
              ¿Qué es un cartucho de tatuaje con membrana de seguridad?
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Es un sistema elástico interno en el cartucho que evita que la tinta o fluidos biológicos retrocedan hacia el interior del grip o la máquina, garantizando máxima higiene y previniendo la contaminación cruzada.
            </p>
          </div>

          <div className="border border-zinc-800 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-3">
              ¿Son los cartuchos de tatuaje universales?
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Sí, la gran mayoría de marcas reconocidas como EZ, Kwadron y WJX utilizan un sistema de acoplamiento universal compatible con grips de cartucho estándar y máquinas rotativas tipo pen.
            </p>
          </div>

          <div className="border border-zinc-800 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-3">
              ¿Cuál es la diferencia entre un cartucho Round Liner y un Magnum?
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Las Round Liner (RL) agrupan sus agujas de forma circular cerrada, ideal para líneas y detalles precisos. Las Magnum (M1/MC) se disponen en dos filas planas alternadas, ideales para rellenar áreas grandes y difuminar sombras.
            </p>
          </div>

          <div className="border border-zinc-800 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-3">
              ¿Qué significa el calibre en las agujas de cartucho?
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              El calibre indica el diámetro individual de cada aguja. Los más comunes son 12 (0.35 mm) para líneas gruesas y rellenos sólidos, 10 (0.30 mm) para sombras suaves y flujo medio, y 08 (0.25 mm) para detalles y microrealismo.
            </p>
          </div>

          <div className="border border-zinc-800 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-3">
              ¿Son reutilizables los cartuchos para tatuar?
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              No. Todos los cartuchos de tatuaje son dispositivos estrictamente estériles y de un solo uso. Deben desecharse de manera segura en un contenedor de objetos cortopunzantes inmediatamente después de la sesión.
            </p>
          </div>

          <div className="border border-zinc-800 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-3">
              ¿Cómo influye el sistema de estabilización en un cartucho?
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              El estabilizador reduce la vibración lateral de la aguja mientras la máquina está en marcha, asegurando líneas mucho más estables, consistentes y precisas.
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
