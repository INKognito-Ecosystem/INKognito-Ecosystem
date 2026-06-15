import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import { useSupplyCart } from '../../../contexts/SupplyCartContext'
import Seo from '../../Seo'

const products = [
  { id: 1, name: 'AQUA MIXER',                           brand: 'Diluyente para tintas',         price: '$40.000', image: null },
  { id: 2, name: 'Toallitas húmedas TACTTUS',            brand: 'Limpieza de la piel',            price: '$25.000', image: null },
  { id: 3, name: 'CREMA MEDIUM',                         brand: 'Crema para tatuar',              price: '$70.000', image: null },
  { id: 4, name: 'VITTA',                                brand: 'Crema para cuidado de tatuajes', price: '$35.000', image: null },
  { id: 5, name: 'COMBO VITTA 30ml + TACTTUS 40 wipes', brand: 'Combo cuidado diario',           price: '$54.000', image: null },
]

export default function HeavenProPage() {
  const { addItem } = useSupplyCart()

  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="Heaven Pro | Cuidado de tatuajes — INKognito Supply"
        description="Cremas y productos de cuidado post-tatuaje Heaven Pro. Formulados para proteger y realzar la cicatrización. Disponibles en Urabá, Colombia."
        siteName="INKognito Supply"
        canonical={`${import.meta.env.VITE_SITE_URL}/supply/brands/heaven-pro`}
      />
      <NavbarCategory pageName="Heaven Pro" />

      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="mb-10 md:mb-16">

          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
            Marca Profesional
          </p>

          <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-6">
            Heaven Pro
          </h1>

          <p className="max-w-3xl text-zinc-400 text-sm md:text-base leading-relaxed">
            Productos de cuidado post-tatuaje desarrollados para proteger la piel
            durante el proceso de cicatrización. Cremas, lociones y accesorios
            formulados específicamente para tatuadores profesionales y sus clientes.
          </p>

        </div>

        {products.length === 0 ? (
          <div className="border border-zinc-800 rounded-2xl p-12 md:p-20 text-center">
            <p className="text-zinc-500 uppercase tracking-[0.25em] text-xs md:text-sm mb-4">
              Próximamente disponible
            </p>
            <p className="text-zinc-400 text-sm md:text-base mb-10">
              Contáctanos por WhatsApp para consultar disponibilidad.
            </p>
            <a
              href="https://wa.me/573207911013"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 border border-zinc-700 uppercase tracking-[0.2em] text-xs hover:border-blue-500 hover:text-blue-500 transition-all duration-300"
            >
              Consultar por WhatsApp
            </a>
          </div>
        ) : (
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
                    onClick={() => addItem(product, 'heaven-pro')}
                    className="w-full py-2 border border-zinc-700 uppercase tracking-[0.15em] text-xs hover:border-blue-500 hover:text-blue-500 transition-all duration-300"
                  >
                    + Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <FooterSupply />
    </div>
  )
}
