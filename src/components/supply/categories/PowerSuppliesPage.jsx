import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'

const products = [
  { id: 1, name: 'Flux Wireless', brand: 'FK Irons', price: '$320' },
  { id: 2, name: 'Atom Power', brand: 'Cheyenne', price: '$280' },
  { id: 3, name: 'Mast Archer', brand: 'Mast', price: '$210' },
  { id: 4, name: 'Bishop Power', brand: 'Bishop', price: '$190' },
  { id: 5, name: 'Spektra Edge', brand: 'FK Irons', price: '$350' },
  { id: 6, name: 'EZ P2S', brand: 'EZ Tattoo', price: '$160' },
]

export default function PowerSuppliesPage() {
  return (
    <>
      <div className="min-h-screen bg-black text-white">

        <NavbarCategory pageName="Fuentes" />

        <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">

          <div className="mb-16">
            <p className="uppercase tracking-[0.25em] text-zinc-500 text-sm mb-4">
              Categoría
            </p>

            <h1 className="text-5xl md:text-7xl font-black uppercase leading-none">
              Fuentes De Poder
            </h1>

            <div className="mt-10 max-w-4xl">
              <p className="text-zinc-400 leading-relaxed mb-5">
                Una corriente estable y ultraprecisa es vital para el correcto funcionamiento de cualquier máquina de tatuar. Las fuentes de poder modernas y los sistemas de baterías inalámbricas aseguran que el motor de tu máquina reciba la energía exacta sin fluctuaciones, prolongando su vida útil y logrando golpes completamente homogéneos.
              </p>
              <p className="text-zinc-400 leading-relaxed mb-5">
                En INKognito Supply seleccionamos fuentes de poder y baterías de marcas consagradas como FK Irons, Cheyenne, Bishop, Mast y EZ. Desde unidades de sobremesa avanzadas hasta baterías inalámbricas acoplables por RCA que te permiten transformar cualquier máquina tradicional en un sistema libre de cables.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Optimiza tus flujos de trabajo con pantallas OLED digitales, modos de arranque rápido (jumpstart), memorias de voltaje programables y conectividad inalámbrica, proporcionándote la estabilidad técnica que necesitas para concentrarte exclusivamente en tu arte.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

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

                  <p className="text-zinc-500 uppercase tracking-[0.25em] text-[10px] md:text-xs mb-1 md:mb-2">
                    {product.brand}
                  </p>

                  <h3 className="text-lg md:text-2xl font-black uppercase mb-3 md:mb-4">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between">

                    <span className="text-white font-bold text-base md:text-xl">
                      {product.price}
                    </span>

                    <button className="px-3 md:px-5 py-2 border border-zinc-700 uppercase tracking-[0.2em] text-xs md:text-sm hover:border-white transition-all duration-300">
                      Ver
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
                  ¿Qué es el voltaje de arranque rápido o "jumpstart"?
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Es una función que entrega un breve pulso de mayor voltaje al encender la máquina para arrancar motores potentes o configuraciones de agujas grandes que presentan alta resistencia inicial.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3">
                  ¿Cuánto dura la batería de una fuente de poder inalámbrica?
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  La duración varía según el voltaje de trabajo y el tipo de motor de la máquina, pero generalmente oscila entre 5 y 10 horas de uso continuo por carga completa.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3">
                  ¿Se puede usar cualquier batería inalámbrica en mi máquina de tatuar?
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Sí, siempre que coincida con el tipo de conexión de tu máquina, siendo RCA la más universal, aunque algunas máquinas utilizan conexiones de jack de 3.5 mm o exclusivas del fabricante.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3">
                  ¿Cómo influye una fuente de alimentación de calidad en el tatuaje?
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Una fuente de calidad previene las fluctuaciones de corriente, lo que resulta en un golpeo constante de la aguja, líneas más limpias, menor daño tisular y una mayor vida útil para el motor de tu máquina.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3">
                  ¿Es necesario usar un pedal con todas las fuentes de poder?
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  No, muchas fuentes modernas cuentan con un modo "continuo" o interruptor táctil que permite encender y apagar la máquina sin necesidad de pedal, además de las baterías inalámbricas que se controlan directamente en la unidad.
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