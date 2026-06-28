import NavbarCategoryStore from '../NavbarCategoryStore'
import FooterStore from '../FooterStore'
import { FaWhatsapp } from 'react-icons/fa'
import StoreProductCard from '../StoreProductCard'
import Seo from '../../Seo'
import { useCatalog, toProdCard } from '../../../hooks/useCatalog'

const SHOE_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44']

export default function GuayosPage() {
  const { allProducts: catalogItems, loading } = useCatalog('store', 'Guayos')
  return (
    <>
      <Seo
        title="Guayos | INKognito Store — Urabá"
        description="Guayos profesionales en Chigorodó y Urabá. Pedidos por WhatsApp."
        siteName="INKognito Store"
        canonical={`${import.meta.env.VITE_SITE_URL}/store/guayos`}
      />
      <NavbarCategoryStore pageName="Guayos" />
      <div className="bg-gray-50 pt-20 md:pt-24">
        <div className="pb-6 px-6 max-w-7xl mx-auto">
          <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-sm mb-4">Categoría</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-3 text-gray-900">Guayos</h1>
        </div>
      </div>
      <div className="bg-gray-50 pt-4 pb-10 md:pt-6 md:pb-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? <p className="text-gray-400 col-span-4 py-8 text-center">Cargando...</p>
              : catalogItems.length === 0 ? <p className="text-gray-400 col-span-4 py-8 text-center">Próximamente disponible</p>
              : catalogItems.map(item => {
                  const prod = toProdCard(item)
                  const sizes = item.variantes.map(v => v.variant).filter(Boolean)
                  return <StoreProductCard key={item.name} product={prod} category="guayos" sizes={sizes.length ? sizes : SHOE_SIZES} />
                })}
          </div>
        </div>
      </div>
      <div className="bg-black py-16 px-6 text-center">
        <a href="https://wa.me/573207911013?text=Hola,%20quiero%20ver%20guayos%20disponibles" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-5 rounded-xl border text-white uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:border-[#C9A84C]"
          style={{ borderColor: 'rgba(201,168,76,0.3)', backgroundColor: 'rgba(201,168,76,0.04)' }}>
          <FaWhatsapp size={22} />Ver catálogo completo
        </a>
      </div>
      <FooterStore />
    </>
  )
}
