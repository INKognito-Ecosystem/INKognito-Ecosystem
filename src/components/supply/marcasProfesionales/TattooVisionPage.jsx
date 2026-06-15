import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import { useSupplyCart } from '../../../contexts/SupplyCartContext'
import Seo from '../../Seo'

const products = [
  { id: 1, name: 'Tattoo Vision 2X', brand: 'Sistema Visual', price: '$1.500.000' },
  { id: 2, name: 'Tattoo Vision 2', brand: 'Sistema Visual', price: '$1.140.000' },
  { id: 3, name: 'Gafas Eclipse', brand: 'Gafas', price: '$800.000' },
  { id: 4, name: 'Kit Tattoo Vision', brand: 'Kit', price: '$840.000' },
  { id: 5, name: 'Luz LED Profesional', brand: 'Iluminación', price: '$600.000' },
  { id: 6, name: 'Stand Articulado para Tablet', brand: 'Accesorio', price: '$79.900' },
  { id: 7, name: 'Trípode Viajero', brand: 'Accesorio', price: '$200.000' },
  { id: 8, name: 'Gafas Clásicas', brand: 'Gafas', price: '$400.000' },
  { id: 9, name: 'Gafas Dager', brand: 'Gafas', price: '$400.000' },
  { id: 10, name: 'Gafas Flex', brand: 'Gafas', price: '$400.000' },
  { id: 11, name: 'Gafas REC', brand: 'Gafas', price: '$400.000' },
  { id: 12, name: 'Gafas Orbe', brand: 'Gafas', price: '$400.000' },
  { id: 13, name: 'Gafas Liner', brand: 'Gafas', price: '$400.000' },
]

export default function TattooVisionPage() {
  const { addItem } = useSupplyCart()

  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Tattoo Vision | Sistemas visuales para tatuadores — INKognito Supply"
        description="Lámparas, gafas y sistemas de visión Tattoo Vision para tatuadores profesionales. Precisión óptica en cada sesión. Disponibles en Urabá, Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/brands/tattoo-vision`}
      />
      <NavbarCategory pageName="Tattoo Vision" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">

          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Marca Profesional
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-6">
            Tattoo Vision
          </h1>

          <p className="max-w-3xl text-zinc-400 text-sm md:text-base leading-relaxed">
            Sistemas visuales diseñados para tatuadores profesionales.
            Gafas especializadas, iluminación avanzada y accesorios
            desarrollados para mejorar la visibilidad, reducir reflejos
            y aumentar la precisión durante el proceso de tatuaje.
          </p>

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
                <p className="text-zinc-700 uppercase tracking-[0.3em] text-xs md:text-sm text-center px-4">
                  Product Image
                </p>
              </div>

              <div className="p-4 md:p-6">

                <p className="text-zinc-500 uppercase tracking-[0.2em] text-xs mb-2">
                  {product.brand}
                </p>

                <h3 className="text-lg md:text-2xl font-black uppercase mb-3">
                  {product.name}
                </h3>

                <span className="text-white font-bold text-sm md:text-xl block mb-3">
                  {product.price}
                </span>

                <button
                  onClick={() => addItem(product, 'tattoo-vision')}
                  className="w-full py-2 border border-zinc-700 uppercase tracking-[0.15em] text-xs hover:border-blue-500 hover:text-blue-500 transition-all duration-300"
                >
                  + Agregar al carrito
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

      <FooterSupply />

    </div>
  )
}
