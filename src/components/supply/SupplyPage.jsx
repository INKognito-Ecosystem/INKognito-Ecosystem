import NavbarSupply from './NavbarSupply'
import HeroSupply from './HeroSupply'
import CategoriesSupply from './CategoriesSupply'
import FeaturedProductssupply from './FeaturedProductssupply'
import BrandsSupply from './BrandsSupply'
import FooterSupply from './FooterSupply'
import { FaWhatsapp } from 'react-icons/fa'
import Seo from '../Seo'
import ogSupply from '../../assets/milogo/supply.webp'

export default function SupplyPage() {

  return (

    <main className="bg-black text-white">

    <Seo
      title="INKognito Supply | Insumos y equipos para tatuar en Colombia"
      description="Máquinas, cartuchos, tintas, agujas y accesorios profesionales para tatuadores. Marcas como Kwadron, EZ, Dynamic y Eternal. Envíos en Colombia, pedidos por WhatsApp."
      image={ogSupply}
    />

    <NavbarSupply />

      <HeroSupply />

<div className="max-w-7xl mx-auto px-6 mt-10 md:mt-16 lg:mt-20">
  <div className="border-b border-zinc-900"></div>
</div>

<FeaturedProductssupply id="productos" />
      <CategoriesSupply />

    <BrandsSupply />

    <section
  id="contacto"
  className="max-w-7xl mx-auto px-6 py-12 md:py-16 lg:py-20 border-t border-zinc-900"
>

  <div className="grid md:grid-cols-2 gap-12 items-start">

    {/* IZQUIERDA */}
    <div>

      <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
        Contacto
      </p>

      <h2 className="text-4xl md:text-6xl font-black uppercase leading-none mb-6">
        Compra con confianza
      </h2>

      <p className="text-zinc-400 text-lg leading-relaxed mb-10">
        Te ayudamos a conseguir insumos, tintas, cartuchos, mobiliario y productos
        especializados para tatuadores en la región de Urabá. Nuestro objetivo es
        acompañarte durante todo el proceso de compra y entrega para que recibas
        exactamente lo que necesitas.
      </p>

      <div className="mb-10">
        <a
          href="https://wa.me/573207911013"
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center justify-center gap-3
            w-full max-w-xl
            py-5 px-6
            rounded-xl
            border border-green-500/30
            bg-zinc-950
            text-white
            uppercase
            tracking-[0.2em]
            font-semibold
            transition-all duration-300
            hover:border-green-500
            hover:shadow-[0_0_30px_rgba(34,197,94,0.45)]
            hover:scale-[1.02]
          "
        >
          <FaWhatsapp size={24} />
          Hablar con Inkognito Supply
        </a>
      </div>

      <div className="text-zinc-500 uppercase tracking-[0.2em] text-sm space-y-2">
        <p>Lunes a Sábado</p>
        <p>8:00 AM - 6:00 PM</p>
      </div>

      <div className="mt-10 pt-10 border-t border-zinc-900">
        <p className="text-zinc-400">
          <span className="font-semibold text-white">
            INKOGNITO SUPPLY:
          </span>{' '}
          Tu aliado para insumos de tatuaje en Urabá.
        </p>
      </div>

</div>

    {/* DERECHA */}
<div className="bg-zinc-950 border border-blue-500/30 rounded-2xl p-8 hover:border-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300">
      <p className="text-zinc-500 uppercase tracking-[0.25em] text-xs mb-4">
        Confianza
      </p>

      <h3 className="text-2xl md:text-3xl font-black uppercase mb-8">
        Compra con Seguridad
      </h3>

      <div className="space-y-5">

        <div className="flex items-center gap-3">
          <span className="text-green-500 text-xl">✓</span>
          <span className="text-zinc-300">
            Proveedores verificados
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-green-500 text-xl">✓</span>
          <span className="text-zinc-300">
            Atención personalizada
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-green-500 text-xl">✓</span>
          <span className="text-zinc-300">
            Soporte por WhatsApp
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-green-500 text-xl">✓</span>
          <span className="text-zinc-300">
            Entregas en Urabá
          </span>
        </div>

      </div>

    </div>

  </div>

</section>

    <FooterSupply />

    </main>

  )

}
