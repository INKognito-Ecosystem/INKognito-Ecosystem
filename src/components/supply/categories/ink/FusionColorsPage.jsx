import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import Seo from '../../../Seo'
import { useSupplyCart } from '../../../../contexts/SupplyCartContext'

const categories = [
  {
    name: 'Negros',
    products: [
      'Black',
      'Power Black',
      'True Black'
    ]
  },
  {
    name: 'Blancos',
    products: [
      'White',
      'Extra White'
    ]
  },
  {
    name: 'Rojos',
    products: [
      'Bright Red',
      'Crimson Red',
      'Red Brown',
      'Blood Red'
    ]
  },
  {
    name: 'Azules',
    products: [
      'Baby Blue',
      'True Blue',
      'Blue Sky',
      'Dark Blue'
    ]
  },
  {
    name: 'Verdes',
    products: [
      'Lime Green',
      'Leaf Green',
      'Dark Green',
      'Olive Green'
    ]
  },
  {
    name: 'Amarillos',
    products: [
      'Golden Yellow',
      'Bright Yellow',
      'Mustard'
    ]
  },
  {
    name: 'Naranjas',
    products: [
      'Orange',
      'Tangerine',
      'Rustic Orange'
    ]
  },
  {
    name: 'Morados y rosas',
    products: [
      'Purple',
      'Lavender',
      'Hot Pink',
      'Bubblegum Pink'
    ]
  },
  {
    name: 'Marrones',
    products: [
      'Chocolate',
      'Dark Chocolate',
      'Sienna',
      'Burnt Umber'
    ]
  },
  {
    name: 'Tonos piel',
    products: [
      'Flesh Tone Extra Light',
      'Flesh Tone Light',
      'Flesh Tone Medium',
      'Flesh Tone Dark'
    ]
  }
]

export default function FusionColorsPage() {
  const { addItem } = useSupplyCart()
  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Tintas Fusion Ink | INKognito Supply — Colombia"
        description="Fusion Ink: pigmentos vibrantes y stencil-friendly para color americano y neotradicional. Disponibles en Urabá, Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/ink/fusion`}
      />

      <NavbarCategory pageName="Fusion Ink" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Fusion Ink
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            Catálogo Completo
          </h1>

          <div className="mt-10 max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-5">
              Fusion Ink es considerada una de las tintas con mayor carga de pigmento y brillo en la industria actual del tatuaje. Desarrollada conjuntamente por Adam Everett y Next Generation Tattoo Machines, esta marca se ha consolidado gracias a su increíble vivacidad.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-5">
              Con una formulación completamente orgánica y libre de rellenos innecesarios, Fusion Ink fluye con una suavidad inigualable en cualquier máquina, logrando que los colores penetren de forma rápida y uniforme para una saturación excelente.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Explora una selección exhaustiva que va desde sus potentes negros como Power Black y True Black, hasta una gama cromática super brillante idónea para estilos como New School, tradicional y realismo a color.
            </p>
          </div>
        </div>

        <div className="space-y-10">

          {categories.map((category) => (

            <div key={category.name}>

              <h2 className="text-2xl md:text-3xl font-black uppercase mb-5 border-b border-zinc-800 pb-3">
                {category.name}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                {category.products.map((name) => {
                  const product = { id: name, name, brand: 'Fusion Ink', price: '$XX.XXX' }
                  return (
                    <div
                      key={name}
                      className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 hover:border-zinc-600 transition-all duration-300"
                    >

                      <div className="aspect-square bg-zinc-900 flex items-center justify-center">
                        <span className="text-zinc-700 uppercase tracking-[0.2em] text-xs">
                          Foto
                        </span>
                      </div>

                      <div className="p-3">

                        <h3 className="font-bold text-sm md:text-base mb-2">
                          {name}
                        </h3>

                        <span className="text-zinc-400 text-xs block mb-2">
                          Fusion Ink
                        </span>

                        <span className="text-white font-bold text-sm block mb-3">
                          {product.price}
                        </span>

                        <button
                          onClick={() => addItem(product, 'ink-fusion')}
                          className="w-full py-2 border border-zinc-700 uppercase tracking-[0.15em] text-xs hover:border-blue-500 hover:text-blue-500 transition-all duration-300"
                        >
                          + Agregar al carrito
                        </button>

                      </div>

                    </div>
                  )
                })}

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
                ¿Quién fabrica la tinta Fusion Ink?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Fusion Ink es el resultado de una colaboración directa entre el experto de la industria Adam Everett y Next Generation Tattoo Machines, garantizando un estándar técnico superior.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Qué hace que Fusion Ink sea tan brillante?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Su secreto reside en un altísimo porcentaje de pigmento orgánico de dispersión fina y la total ausencia de aditivos o rellenos químicos innecesarios.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Las tintas Fusion Ink son veganas?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Sí, Fusion Ink es un producto 100% vegano, libre de subproductos animales y no testado en animales.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Cómo es la consistencia de Fusion Ink?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Tiene una textura ligeramente más densa que otras marcas tradicionales pero sumamente sedosa, lo que evita salpicaduras y facilita una inyección impecable.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Las tintas Fusion se secan rápido en el tintero?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Debido a su alta concentración mineral, pueden tender a espesarse durante sesiones muy largas. Se puede añadir una gota de solución mezcladora o agua destilada si es necesario.
              </p>
            </div>
          </div>
        </section>

      </div>

      <FooterSupply />

    </div>
  )
}