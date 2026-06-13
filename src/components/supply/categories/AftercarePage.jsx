import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import { useSupplyCart } from '../../../contexts/SupplyCartContext'
import Seo from '../../Seo'

const products = [
  { id: 1, name: 'Crema Cicatrizante', brand: 'Aftercare', price: '$11' },
  { id: 2, name: 'Tattoo Butter', brand: 'Hustle Butter', price: '$18' },
  { id: 3, name: 'Healing Balm', brand: 'After Inked', price: '$15' },
  { id: 4, name: 'Tattoo Foam', brand: 'TattooMed', price: '$12' },
  { id: 5, name: 'Care Cream', brand: 'Pegasus', price: '$10' },
  { id: 6, name: 'Recovery Gel', brand: 'InkTrox', price: '$14' },
  { id: 7, name: 'Tattoo Lotion', brand: 'Hornet', price: '$11' },
]

export default function AftercarePage() {
  const { addItem } = useSupplyCart()
  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Cuidado post-tatuaje | INKognito Supply — Urabá"
        description="Hustle Butter, After Inked, TattooMed y más. Productos profesionales para la cicatrización óptima del tatuaje. Disponibles en Urabá, Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/aftercare`}
      />
      <NavbarCategory pageName="Cuidado" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Categoría
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            Cuidado durante y despues
          </h1>

          <div className="mt-10 max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-5">
              Un tatuaje excelente solo está completo cuando cicatriza a la perfección. El cuidado de la piel durante el proceso del tatuaje y la etapa posterior de curación (aftercare) es crucial para preservar la nitidez de las líneas, la brillantez de los colores y la salud general de la piel de tus clientes.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-5">
              Descubre nuestra gama especializada de productos en INKognito Supply, incluyendo bálsamos curativos, mantecas humectantes, espumas de limpieza y cremas regeneradoras de marcas líderes como Hustle Butter, After Inked, TattooMed, Pegasus, InkTrox y Hornet.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Desde geles calmantes para usar durante el tatuaje que reducen la rojez y la inflamación, hasta apósitos adhesivos protectores (segunda piel) y lociones de uso diario que aceleran la regeneración celular, ofrecemos soluciones dermatológicamente probadas para garantizar una curación impecable.
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
                  onClick={() => addItem(product, 'aftercare')}
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
                ¿Por qué es importante usar productos específicos para el cuidado del tatuaje?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Los productos para tatuajes están formulados sin fragancias artificiales, alcoholes ni petrolatos pesados. Humectan la piel de forma equilibrada, permiten que respire y aportan nutrientes esenciales que aceleran la cicatrización sin barrer el pigmento.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Qué es el apósito adhesivo transparente (segunda piel)?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Es una película de poliuretano médica, impermeable pero transpirable, que se aplica directamente sobre el tatuaje recién hecho. Protege la herida de bacterias, suciedad y fricción, optimizando el proceso de curación húmeda natural durante los primeros días.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cómo se debe limpiar un tatuaje nuevo durante los primeros días?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Se debe lavar con agua tibia y un jabón neutro, antibacteriano y sin perfume, utilizando únicamente la yema de los dedos de forma muy suave. Luego se seca con toallas de papel absorbente dando ligeros toques, sin frotar.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Qué es la manteca para tatuar y cómo se diferencia de las cremas comunes?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Las mantecas (como Hustle Butter) son productos a base de ingredientes naturales como karité, coco y mango. Se usan tanto durante el proceso para lubricar la piel y reducir el enrojecimiento, como en la cicatrización para nutrir profundamente.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cuánto tiempo tarda en sanar completamente un tatuaje?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                La capa más superficial de la piel suele cicatrizar en un período de 2 a 3 semanas. Sin embargo, las capas más profundas de la dermis pueden tardar de 2 a 3 meses en regenerarse por completo, período durante el cual se recomienda seguir hidratando la zona.
              </p>
            </div>
          </div>
        </section>

      </div>

      <FooterSupply />

    </div>
  )
}