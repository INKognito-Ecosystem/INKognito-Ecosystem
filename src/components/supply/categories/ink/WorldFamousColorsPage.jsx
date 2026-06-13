import FooterSupply from '../../FooterSupply'
import NavbarCategory from '../../NavbarCategory'
import Seo from '../../../Seo'
import { useSupplyCart } from '../../../../contexts/SupplyCartContext'

const categories = [
  {
    name: 'Negros y grises',
    products: [
      'Blackout',
      'Triple Blackout',
      'Ghost Grey',
      'Dark Greywash',
      'Medium Greywash',
      'Light Greywash'
    ]
  },
  {
    name: 'Rojos',
    products: [
      'Scarlet Red',
      'Stop Red',
      'Brick Red',
      'Bordeaux',
      'Dark Red'
    ]
  },
  {
    name: 'Azules',
    products: [
      'Blue Concentrate',
      'Dark Blue',
      'Sky Blue',
      'Michele Turco Blue',
      'Limitless Blue'
    ]
  },
  {
    name: 'Verdes',
    products: [
      'Lime Green',
      'Dark Green',
      'Olive Green',
      'Army Green',
      'Limitless Green'
    ]
  },
  {
    name: 'Amarillos y naranjas',
    products: [
      'Canary Yellow',
      'Golden Yellow',
      'Sunflower',
      'Orange',
      'Burnt Orange'
    ]
  },
  {
    name: 'Morados y rosas',
    products: [
      'Purple Concentrate',
      'Violet',
      'Magenta',
      'Hot Pink',
      'Pink Ribbon'
    ]
  },
  {
    name: 'Marrones',
    products: [
      'Chocolate',
      'Dark Brown',
      'Sienna',
      'Burnt Umber',
      'Terra Cotta'
    ]
  },
  {
    name: 'Blancos',
    products: [
      'White House',
      'Straight White',
      'Limitless White'
    ]
  },
  {
    name: 'Tonos piel',
    products: [
      'Dark Flesh',
      'Medium Flesh',
      'Light Flesh',
      'Pink Skin',
      'Skin Tone'
    ]
  }
]

export default function WorldFamousColorsPage() {
  const { addItem } = useSupplyCart()
  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Tintas World Famous | INKognito Supply — Colombia"
        description="World Famous Ink: alta pigmentación, cicatrización limpia y colores que retienen brillantez con el tiempo. Disponibles en Urabá, Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/ink/world-famous`}
      />

      <NavbarCategory pageName="World Famous" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            World Famous Ink
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
            Catálogo Completo
          </h1>

          <div className="mt-10 max-w-4xl">
            <p className="text-zinc-400 leading-relaxed mb-5">
              World Famous Ink está redefiniendo el arte del tatuaje con pigmentos de una densidad asombrosa y una fluidez de flujo insuperable. Respaldada por un equipo global de artistas de élite, esta marca es venerada por su durabilidad extrema y su brillo inalterable bajo la piel.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-5">
              Su formulación patentada de base vegana pasa por rigurosos procesos de esterilización mediante radiación gamma, asegurando un producto completamente libre de contaminantes y seguro para todo tipo de pieles en cualquier parte del mundo.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Descubre su amplio repertorio que incluye tanto sets icónicos de realismo retrato como su innovadora línea Limitless, diseñada especialmente para cumplir de forma estricta con las exigentes regulaciones REACH de la Unión Europea.
            </p>
          </div>
        </div>

        <div className="space-y-10">

          {categories.map((category) => (

            <section key={category.name}>

              <h2 className="text-2xl md:text-4xl font-black uppercase mb-6">
                {category.name}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                {category.products.map((name) => {
                  const product = { id: name, name, brand: 'World Famous', price: '$XX.XXX' }
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

                      <div className="p-3 md:p-4">

                        <h3 className="font-bold text-sm md:text-lg mb-2">
                          {name}
                        </h3>

                        <span className="text-zinc-500 text-xs uppercase block mb-2">
                          World Famous
                        </span>

                        <span className="text-white font-bold text-sm block mb-3">
                          {product.price}
                        </span>

                        <button
                          onClick={() => addItem(product, 'ink-world-famous')}
                          className="w-full py-2 border border-zinc-700 uppercase tracking-[0.15em] text-xs hover:border-blue-500 hover:text-blue-500 transition-all duration-300"
                        >
                          + Agregar al carrito
                        </button>

                      </div>

                    </div>
                  )
                })}

              </div>

            </section>

          ))}

        </div>

        <section className="mt-24 md:mt-32">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-10">
            Preguntas frecuentes
          </h2>

          <div className="space-y-6">
            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Por qué se consideran revolucionarias las tintas World Famous?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Su fama radica en una de las mayores densidades de pigmento del mercado y un flujo ultra rápido que reduce la resistencia al tatuar, logrando curados extremadamente duraderos y nítidos.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Qué es la gama Limitless de World Famous?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Limitless es la línea premium rediseñada de World Famous para cumplir al 100% con los estrictos parámetros del reglamento europeo REACH sobre pigmentos seguros.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Las tintas de World Famous son veganas?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Sí, todos sus productos son completamente libres de crueldad animal, no contienen derivados de origen animal y se clasifican como vegan-friendly.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Dónde se fabrican las tintas World Famous?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Cada envase original se produce en instalaciones avanzadas ubicadas en los Estados Unidos, sujetas a estrictas pautas de grado médico.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                ¿Son seguras las tintas World Famous Ink?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Absolutamente. Su esterilización mediante radiación gamma de alta penetración y su envasado hermético garantizan la máxima seguridad higiénica para el artista y el cliente.
              </p>
            </div>
          </div>
        </section>

      </div>

      <FooterSupply />

    </div>
  )
}