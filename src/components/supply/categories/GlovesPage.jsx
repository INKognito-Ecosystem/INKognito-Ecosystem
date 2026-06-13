import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import { useSupplyCart } from '../../../contexts/SupplyCartContext'
import Seo from '../../Seo'

const products = [
  { id: 1, name: 'Black Nitrile', brand: 'Unigloves', price: '$12' },
  { id: 2, name: 'Black Diamond', brand: 'Black Diamond', price: '$15' },
  { id: 3, name: 'NitriTex Pro', brand: 'NitriTex', price: '$10' },
  { id: 4, name: 'Tattoo Nitrile', brand: 'EZ Tattoo', price: '$14' },
  { id: 5, name: 'Premium Black', brand: 'Aurelia', price: '$13' },
  { id: 6, name: 'Strong Grip', brand: 'Mast', price: '$11' },
]

export default function GlovesPage() {
  const { addItem } = useSupplyCart()
  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Guantes de nitrilo para tatuaje | INKognito Supply — Urabá"
        description="Unigloves, Black Diamond, NitriTex y Aurelia. Guantes de nitrilo premium, sin látex, para bioseguridad profesional en estudios de tatuaje en Urabá, Colombia."
        siteName="INKognito Supply"
      />
      <NavbarCategory pageName="Guantes" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Categoría
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            Guantes
          </h1>

          <div className="mt-10 max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-5">
              La barrera de protección más importante en el estudio de tatuajes es un par de guantes de alta calidad. En un entorno profesional, la higiene y la prevención de la contaminación cruzada son innegociables, por lo que contar con guantes de alta resistencia, excelente sensibilidad táctil y agarre superior es indispensable para cada sesión.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-5">
              En INKognito Supply ofrecemos guantes de nitrilo premium de marcas referentes como Unigloves, Black Diamond, NitriTex y Aurelia. El nitrilo es el material recomendado por excelencia en la industria del tatuaje debido a su alta resistencia a perforaciones, productos químicos y aceites, además de ser 100% libre de látex para evitar reacciones alérgicas.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Disponibles en color negro para una estética impecable en el estudio y para evitar distracciones visuales con los pigmentos, nuestros guantes garantizan una textura micro-rugosa en los dedos para sostener la máquina y los grips con total seguridad y sin deslizamientos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">

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
                  onClick={() => addItem(product, 'gloves')}
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
                ¿Por qué se prefieren los guantes de nitrilo negro en el tatuaje?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                El nitrilo es mucho más resistente a pinchazos y rasgaduras que el látex o el vinilo. Además, el color negro disimula las manchas de tinta y sangre, manteniendo una estética profesional y limpia durante todo el procedimiento.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Los guantes de nitrilo provocan alergias?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                No, el nitrilo es un compuesto sintético 100% libre de proteínas de látex, lo que elimina por completo el riesgo de alergias tanto para el tatuador como para el cliente.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Qué es el acabado texturizado o micro-rugoso en los guantes?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Es un relieve fino en la punta de los dedos o en toda la palma que mejora notablemente el agarre (grip) de herramientas húmedas o aceitosas, permitiendo manipular la máquina de tatuar con total precisión sin que se resbale.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Se pueden reutilizar los guantes si solo se usaron para preparar la mesa?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                No. Los guantes de examen son estrictamente desechables y de un solo uso. Deben cambiarse cada vez que toques una superficie no estéril, antes de tocar al cliente, y desecharse inmediatamente al terminar cada procedimiento.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cómo elegir la talla correcta de guantes?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Un guante debe quedar perfectamente ajustado a la mano sin apretar demasiado para no cortar la circulación ni fatigar los músculos, pero tampoco quedar holgado, ya que se perdería sensibilidad táctil y precisión en el trazo.
              </p>
            </div>
          </div>
        </section>

      </div>

      <FooterSupply />

    </div>
  )
}